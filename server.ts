import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Audio memory cache matching prompt specifications
interface CachedAudio {
  buffer: Buffer;
  timestamp: number;
}
const audioCache = new Map<string, CachedAudio>();
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour memory retention cache

// Encodes raw 16-bit mono little-endian PCM to a standard playable and downloadable WAV file
function encodeWav(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const header = Buffer.alloc(44);
  const dataLength = pcmBuffer.length;
  
  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataLength, 4);
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size is 16 for PCM
  header.writeUInt16LE(1, 20);  // AudioFormat: 1 (uncompressed PCM)
  header.writeUInt16LE(1, 22);  // NumChannels: 1 (Mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate (e.g. 24000)
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate = SampleRate * NumChannels * BitsPerSample/8
  header.writeUInt16LE(2, 32);  // BlockAlign = NumChannels * BitsPerSample/8
  header.writeUInt16LE(16, 34); // BitsPerSample: 16-bit
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataLength, 40);
  
  return Buffer.concat([header, pcmBuffer]);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Apply JSON body parsing with large limit to accommodate base64 audio files
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // Clean expired caches periodically to free up RAM
  setInterval(() => {
    const now = Date.now();
    for (const [key, cached] of audioCache.entries()) {
      if (now - cached.timestamp > CACHE_EXPIRY_MS) {
        audioCache.delete(key);
      }
    }
  }, 10 * 60 * 1000); // Check every 10 minutes

  // Health endpoint checks credentials state in a secure way
  app.get('/api/health', (req, res) => {
    const hasGoogleKey = !!process.env.GOOGLE_API_KEY;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    res.json({
      status: 'active',
      hasKey: hasGoogleKey || hasGeminiKey
    });
  });

  // Audio transcription/translation endpoint to convert uploaded or spoken voice clips into text
  app.post('/api/transcribe', async (req, res) => {
    try {
      const { audio, mimeType } = req.body;
      if (!audio) {
        return res.status(400).json({ error: 'Validation Error', message: 'Missing audio base64 payload.' });
      }

      const verifiedMimeType = mimeType || 'audio/mp3';
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      
      if (!geminiApiKey) {
        return res.status(401).json({
          error: 'Missing Credentials',
          message: 'Google Gemini API key is not configured inside Environment Variables. Transcribing requires GOOGLE_API_KEY or GEMINI_API_KEY.'
        });
      }

      console.log(`Transcribing audio utilizing Gemini API model: gemini-3.5-flash. MimeType: ${verifiedMimeType}`);
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const audioPart = {
        inlineData: {
          mimeType: verifiedMimeType,
          data: audio, // base64 representation
        },
      };

      const promptPart = {
        text: "Transcribe the spoken audio segment into precise text. Do NOT add any extra commentary, filler, context, introduction, translation warnings, or pleasantries. Return only the transcripts verbatim."
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [audioPart, promptPart] }
      });

      const transcriptionText = response.text || '';
      return res.json({
        success: true,
        transcription: transcriptionText.trim()
      });

    } catch (err: any) {
      console.error('Audio Transcription failure:', err);
      return res.status(500).json({
        error: 'Transcription API Failure',
        message: 'Could not transcribe speech: ' + err.message
      });
    }
  });

  // Main Text-to-Speech Proxy Router
  app.post('/api/tts/synthesize', async (req, res) => {
    try {
      const { text, voiceName, speakingRate, pitch, languageCode } = req.body;

      // 1. Validation parameters checks
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Validation Error', message: 'Text input must be a non-empty string.' });
      }

      if (text.length > 10000) {
        return res.status(400).json({ error: 'Validation Error', message: 'Hard character limits violated. Max 10,000 characters permitted.' });
      }

      const verifiedRate = Math.max(0.5, Math.min(2.0, speakingRate || 1.0));
      const verifiedPitch = Math.max(-20.0, Math.min(20.0, pitch || 0.0));
      const verifiedLang = languageCode || 'en-US';
      const verifiedVoice = voiceName || 'en-US-Neural2-F';

      // 2. Cache Match Checking
      const cacheKeyPayload = JSON.stringify({
        text,
        voice: verifiedVoice,
        rate: verifiedRate,
        pitch: verifiedPitch,
        lang: verifiedLang,
        engine: 'gemini'
      });
      const hashKey = crypto.createHash('sha256').update(cacheKeyPayload).digest('hex');

      const cached = audioCache.get(hashKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_EXPIRY_MS)) {
        res.set('Content-Type', 'audio/wav');
        res.set('X-Cache-Status', 'HIT');
        return res.send(cached.buffer);
      }

      // 3. Setup Gemini API first
      const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (geminiApiKey) {
        try {
          console.log(`Synthesizing with Google Gemini API model: gemini-3.1-flash-tts-preview. Voice: ${verifiedVoice}`);
          const ai = new GoogleGenAI({
            apiKey: geminiApiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build'
              }
            }
          });

          // Map specified cloud voice to Gemini prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
          let geminiVoice = 'Kore';
          if (verifiedVoice.includes('Neural2-D') || verifiedVoice.includes('Standard-C') || verifiedVoice.includes('Neural2-C')) {
            geminiVoice = verifiedVoice.includes('Standard-C') ? 'Puck' : 'Charon';
          } else if (verifiedVoice.includes('Neural2-F') || verifiedVoice.includes('Standard-E')) {
            geminiVoice = verifiedVoice.includes('Neural2-F') ? 'Kore' : 'Zephyr';
          } else {
            // Default select by gender
            geminiVoice = verifiedVoice.toLowerCase().includes('male') ? 'Charon' : 'Zephyr';
          }

          // Build prompt to adjust language translation narration/accent with styling instructions
          let promptText = text;
          if (verifiedVoice.includes('en-GB') || verifiedLang.toLowerCase().includes('gb')) {
            promptText = `Read the following text with a classic, clear British accent: "${text}"`;
          } else if (verifiedLang.toLowerCase().startsWith('es')) {
            promptText = `Read the following text in fluent European Spanish: "${text}"`;
          } else if (verifiedLang.toLowerCase().startsWith('fr')) {
            promptText = `Read the following text in fluent French: "${text}"`;
          } else if (verifiedLang.toLowerCase().startsWith('de')) {
            promptText = `Read the following text in fluent German: "${text}"`;
          } else if (verifiedLang.toLowerCase().startsWith('ja')) {
            promptText = `Read the following text in fluent Japanese: "${text}"`;
          } else if (verifiedLang.toLowerCase().startsWith('am')) {
            promptText = `Read the following text in fluent Amharic: "${text}"`;
          } else {
            promptText = `Read the following text clearly: "${text}"`;
          }

          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text: promptText }] }],
            config: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: geminiVoice },
                },
              },
            },
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            const rawPcmBuffer = Buffer.from(base64Audio, 'base64');
            // Wrap raw 24kHz Mono 16-bit PCM in a standard playable WAV container 
            const wavBuffer = encodeWav(rawPcmBuffer, 24000);

            // Cache and return
            audioCache.set(hashKey, {
              buffer: wavBuffer,
              timestamp: Date.now()
            });

            res.set('Content-Type', 'audio/wav');
            res.set('X-Cache-Status', 'MISS-GEMINI');
            return res.send(wavBuffer);
          }
        } catch (geminiErr: any) {
          console.warn("Gemini Native TTS synthesis failed, trying fallback to Google Cloud REST API:", geminiErr);
        }
      }

      // 4. Secondary fallback: Request generation from Google Cloud Text-to-Speech REST API
      const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(401).json({
          error: 'Missing Credentials',
          message: 'Google Cloud API key is not configured inside Environment Variables. Please set GOOGLE_API_KEY or GEMINI_API_KEY.'
        });
      }

      const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const payload = {
        input: { text },
        voice: {
          languageCode: verifiedLang,
          name: verifiedVoice
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: verifiedRate,
          pitch: verifiedPitch
        }
      };

      const response = await fetch(ttsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errDetails = await response.json().catch(() => ({}));
        console.error('Google Cloud TTS Error payload:', errDetails);
        const errorMsg = errDetails.error?.message || `Google Cloud TTS API responded with code ${response.status}`;
        return res.status(response.status).json({
          error: 'Google API Error',
          message: errorMsg
        });
      }

      const results = await response.json() as { audioContent?: string };
      if (!results.audioContent) {
        return res.status(502).json({
          error: 'Invalid Response Body',
          message: 'Google TTS API did not return any compiled audio contents.'
        });
      }

      // decode Base64 audio representation and cache buffer
      const audioBuffer = Buffer.from(results.audioContent, 'base64');
      audioCache.set(hashKey, {
        buffer: audioBuffer,
        timestamp: Date.now()
      });

      // return response to consumer
      res.set('Content-Type', 'audio/mpeg');
      res.set('X-Cache-Status', 'MISS-FALLBACK');
      return res.send(audioBuffer);

    } catch (err: any) {
      console.error('TTS Proxy Execution failure:', err);
      return res.status(500).json({
        error: 'Engine Failure',
        message: 'Internal server error triggered during TTS voice synthesis: ' + err.message
      });
    }
  });

  // Mount Vite development middleware, falling back to static files dist folder in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware registered.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA catch-all navigation fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static compiled server files registered.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TTS Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
