import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Download, Trash2, Upload, 
  Sparkles, Volume2, HelpCircle, AlertCircle, Share2, 
  History, Settings, Disc, Check, Info, FileText, ChevronDown 
} from 'lucide-react';
import { VoiceOption, TtsHistoryItem } from '../types';

interface TtsToolProps {
  isDarkMode: boolean;
}

const googleVoices: VoiceOption[] = [
  // High-fidelity Studio / Journey Voices
  { id: 'en-US-Journey-F', name: 'en-US-Journey-F', label: 'Expressive Journey - Chloe (US English, Female, Hyper-Realistic) 🔥', languageCode: 'en-US', type: 'neural' },
  { id: 'en-US-Journey-D', name: 'en-US-Journey-D', label: 'Expressive Journey - Arthur (US English, Male, Hyper-Realistic) 🔥', languageCode: 'en-US', type: 'neural' },
  { id: 'en-US-Studio-O', name: 'en-US-Studio-O', label: 'Studio-HD - Michael (US English, Male, Studio Deep Tone) 💎', languageCode: 'en-US', type: 'neural' },
  { id: 'en-US-Studio-Q', name: 'en-US-Studio-Q', label: 'Studio-HD - Karen (US English, Female, Professional Studio) 💎', languageCode: 'en-US', type: 'neural' },
  // Neural2 Premium
  { id: 'en-US-Neural2-F', name: 'en-US-Neural2-F', label: 'Emma (US English, Female, Neural2) 🌟', languageCode: 'en-US', type: 'neural' },
  { id: 'en-US-Neural2-D', name: 'en-US-Neural2-D', label: 'John (US English, Male, Neural2)', languageCode: 'en-US', type: 'neural' },
  { id: 'en-GB-Neural2-F', name: 'en-GB-Neural2-F', label: 'Mia (British English, Female, Neural2) 🌟', languageCode: 'en-GB', type: 'neural' },
  { id: 'en-GB-Neural2-C', name: 'en-GB-Neural2-C', label: 'William (British English, Male, Neural2)', languageCode: 'en-GB', type: 'neural' },
  { id: 'en-AU-Neural2-F', name: 'en-AU-Neural2-F', label: 'Kylie (Australian Neural2, Female)', languageCode: 'en-AU', type: 'neural' },
  { id: 'en-IN-Wavenet-D', name: 'en-IN-Wavenet-D', label: 'Aanya (Indian English, Female, Wavenet) 🇮🇳', languageCode: 'en-IN', type: 'neural' },
  // Native Multilingual
  { id: 'es-ES-Neural2-F', name: 'es-ES-Neural2-F', label: 'Sofia (Spanish, Female, Neural2)', languageCode: 'es-ES', type: 'neural' },
  { id: 'fr-FR-Neural2-F', name: 'fr-FR-Neural2-F', label: 'Chloé (French, Female, Neural2)', languageCode: 'fr-FR', type: 'neural' },
  { id: 'de-DE-Neural2-F', name: 'de-DE-Neural2-F', label: 'Elena (German, Female, Neural2)', languageCode: 'de-DE', type: 'neural' },
  { id: 'ja-JP-Neural2-F', name: 'ja-JP-Neural2-F', label: 'Sakura (Japanese, Female, Neural2)', languageCode: 'ja-JP', type: 'neural' },
  { id: 'am-ET-Wavenet-A', name: 'am-ET-Wavenet-A', label: 'Selam (Amharic 🇪🇹, Female, Wavenet) 🌟', languageCode: 'am-ET', type: 'neural' },
  { id: 'am-ET-Wavenet-B', name: 'am-ET-Wavenet-B', label: 'Alula (Amharic 🇪🇹, Male, Wavenet)', languageCode: 'am-ET', type: 'neural' }
];

export default function TtsTool({ isDarkMode }: TtsToolProps) {
  // TTS core states
  const [text, setText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [selectedVoiceId, setSelectedVoiceId] = useState('en-US-Journey-F');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0.0); // Google TTS accepts pitch in -20.0 to 20.0 semitones. Default is 0.0
  const [engineMode, setEngineMode] = useState<'cloud' | 'browser'>('cloud');
  
  // Custom advanced modes (TTS, STS / Speech-to-Text)
  const [activeModule, setActiveModule] = useState<'tts' | 'sts'>('tts');
  const [waveTick, setWaveTick] = useState(0);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const [arrowHeightScale, setArrowHeightScale] = useState<number>(1.0);
  const [arrowPhaseOffset, setArrowPhaseOffset] = useState<number>(0.0);

  // Speech-to-Text / Audio translation states
  const [isRecording, setIsRecording] = useState(false);
  const [isMicInitializing, setIsMicInitializing] = useState(false);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const [stsTranscription, setStsTranscription] = useState('');
  const [stsAudioFile, setStsAudioFile] = useState<File | null>(null);
  const [transcribingLoading, setTranscribingLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Arrow keys listener
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setArrowHeightScale(prev => Math.min(2.5, prev + 0.15));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setArrowHeightScale(prev => Math.max(0.3, prev - 0.15));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setArrowPhaseOffset(prev => prev - 0.25);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setArrowPhaseOffset(prev => prev + 0.25);
      }
    };
    window.addEventListener('keydown', handleArrowKeys);
    return () => {
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, []);

  // Soft update tick for continuous waveform animation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveTick(prev => (prev + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // High-fidelity microphone and file transcription utilizing Gemini Server-side API
  const processAudioForTranscription = async (blob: Blob, mimeType: string) => {
    setTranscribingLoading(true);
    setErrorMessage(null);
    setInfoMessage("Transcribing audio payload with deep neural models...");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          const rawResult = reader.result as string;
          const base64Data = rawResult.split(',')[1];
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              audio: base64Data,
              mimeType: mimeType || blob.type || 'audio/mp3'
            })
          });

          const data = await response.json();
          if (response.ok && data.success) {
            setStsTranscription(data.transcription);
            setText(data.transcription);
            setInfoMessage("Voice transcribed successfully! Automatically loaded into Text-to-Speech composer.");
            setTimeout(() => setInfoMessage(null), 5000);
          } else {
            setErrorMessage(data.message || "Failed to extract transcription matching your acoustic signature.");
          }
        } catch (apiErr: any) {
          console.error("Transcribe request error:", apiErr);
          setErrorMessage("Failed to reach transcription proxy: " + apiErr.message);
        } finally {
          setTranscribingLoading(false);
        }
      };
    } catch (err: any) {
      console.error("File processing error:", err);
      setErrorMessage("Could not parse speech sample file: " + err.message);
      setTranscribingLoading(false);
    }
  };

  const startRecordingSts = async () => {
    if (isMicInitializing || isRecording) return;
    setIsMicInitializing(true);
    setStsTranscription('');
    setErrorMessage(null);
    setTranscribingLoading(false);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Microphone access is not supported by your browser software context.");
        setIsMicInitializing(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all track streams inside the stop callback so that the recorder is fully flushed first!
        try {
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error("Error stopping stream tracks:", err);
        }
        if (activeStreamRef.current) {
          try {
            activeStreamRef.current.getTracks().forEach(track => track.stop());
          } catch (err) {
            console.error("Error stopping activeStreamRef tracks:", err);
          }
          activeStreamRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 200) {
          // Process final captured recording
          await processAudioForTranscription(audioBlob, 'audio/webm');
        } else {
          console.warn("Recorded audio blob is empty or too small:", audioBlob.size);
          setErrorMessage("Recorded audio file was empty. Please speak clearly into your microphone.");
        }
      };

      mediaRecorder.start(250); // Capture data chunks periodically
      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone setup failed:", err);
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
      }
      setErrorMessage("Could not capture microphones: " + err.message + ". Check permission settings.");
    } finally {
      setIsMicInitializing(false);
    }
  };

  const stopRecordingSts = () => {
    if (isMicInitializing) return;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error("Error stopping recorder:", e);
      }
    }

    setIsRecording(false);
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStsAudioFile(file);
      await processAudioForTranscription(file, file.type);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; 
    const y = 1 - (e.clientY - rect.top) / rect.height; 
    setHoverX(x);
    setHoverY(Math.max(0.1, Math.min(1.0, y)));
  };

  const handleMouseLeave = () => {
    setHoverX(null);
    setHoverY(null);
  };

  // Browser Speech voices list
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceURI, setSelectedBrowserVoiceURI] = useState('');

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Logs & lists
  const [history, setHistory] = useState<TtsHistoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const maxChars = 10000;

  // Track key loaded state (check if user configured premium keys)
  const [premiumAvailable, setPremiumAvailable] = useState<boolean | null>(null);

  // Custom visualizer states & voice sample states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [samplePlayingVoiceId, setSamplePlayingVoiceId] = useState<string | null>(null);
  const [amplitudeData, setAmplitudeData] = useState<number[]>(new Array(11).fill(0.15));

  const dropdownRef = useRef<HTMLDivElement>(null);
  const sampleAudioRef = useRef<HTMLAudioElement | null>(null);
  const sampleTimeoutRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Broadcast live play states to the MiddleHeaderVisualizer and other active listeners
  useEffect(() => {
    const ev = new CustomEvent('studio-audio-state', {
      detail: { playing: isPlaying, paused: isPaused }
    });
    window.dispatchEvent(ev);
  }, [isPlaying, isPaused]);

  // Helper calculating estimated voice reading duration
  const getReadingTime = () => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    if (words === 0) return '0s read';
    const seconds = Math.ceil(words / 2.3);
    if (seconds < 60) {
      return `${seconds}s read`;
    }
    const mins = Math.ceil(seconds / 60);
    return `${mins} min read`;
  };

  // Setup sample preview stop helper
  const stopVoiceSample = () => {
    if (sampleTimeoutRef.current) {
      clearTimeout(sampleTimeoutRef.current);
      sampleTimeoutRef.current = null;
    }
    if (sampleAudioRef.current) {
      sampleAudioRef.current.pause();
      sampleAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSamplePlayingVoiceId(null);
  };

  // Helper to map cloud voice to the best browser fallback voice
  const getBestBrowserVoiceForCloudVoice = (voiceId: string, voicesList: SpeechSynthesisVoice[]) => {
    const cloudVoice = googleVoices.find(v => v.id === voiceId);
    if (!cloudVoice) return null;
    
    const lang = cloudVoice.languageCode.toLowerCase(); // e.g. "en-us" or "en-gb"
    const isMale = cloudVoice.label.toLowerCase().includes('male') || cloudVoice.id.endsWith('-C') || cloudVoice.id.endsWith('-D');
    
    // Find matching language + gender preference if possible
    const langVoices = voicesList.filter(v => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
    if (langVoices.length > 0) {
      const maleHints = ['david', 'mark', 'george', 'william', 'charlie', 'john', 'microsoft', 'google male', 'male', 'guy', 'en-us-standard-c', 'en-us-neural2-d', 'en-gb-neural2-c'];
      if (isMale) {
        const maleVoice = langVoices.find(v => maleHints.some(hint => v.name.toLowerCase().includes(hint)));
        if (maleVoice) return maleVoice;
      } else {
        const femaleVoice = langVoices.find(v => !maleHints.some(hint => v.name.toLowerCase().includes(hint)));
        if (femaleVoice) return femaleVoice;
      }
      return langVoices[0];
    }
    
    // fallback matching just language prefix (e.g. "en")
    const broadLang = lang.split('-')[0];
    const broadVoices = voicesList.filter(v => v.lang.toLowerCase().startsWith(broadLang));
    if (broadVoices.length > 0) {
      return broadVoices[0];
    }
    
    return null;
  };

  const getVoiceSampleText = (voiceId: string) => {
    switch (voiceId) {
      case 'en-US-Neural2-F':
        return "This studio is the best! Easily generate your custom voice now.";
      case 'en-US-Neural2-D':
        return "This is a premium-quality voice sample synthesized inside the audio engine.";
      case 'en-GB-Neural2-F':
        return "This is a demonstration of our rich British accent voice synthesized instantly.";
      case 'en-GB-Neural2-C':
        return "I am William. This is an advanced neural voice built for narrations.";
      case 'en-US-Standard-C':
        return "I am Charlie. The generator lets you turn any writing into speech instantly.";
      case 'en-US-Standard-E':
        return "Welcome to the studio! Try generating your own customized voiceovers here.";
      case 'es-ES-Neural2-F':
        return "¡Este estudio de voz es excelente! Genera tu audio libre de copyright hoy mismo.";
      case 'fr-FR-Neural2-F':
        return "Bienvenue dans notre synthétiseur de voix de qualité supérieure.";
      case 'de-DE-Neural2-F':
        return "Dies ist eine lebensechte neuronale deutsche Sprachausgabe.";
      case 'ja-JP-Neural2-F':
        return "最先端の自動音声合成システムへようこそ。クリアな音声をすぐに体験できます。";
      default:
        return "Welcome to the studio! Generate your voiceover with our premium assets.";
    }
  };

  // Play a short 3-second sample of a voice
  const playVoiceSample = async (voice: VoiceOption | { id: string; name: string; label: string; languageCode: string; type: string }) => {
    if (samplePlayingVoiceId === voice.id) {
      stopVoiceSample();
      return;
    }

    stopVoiceSample();
    
    // Also stop main playbacks if running
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);

    setSamplePlayingVoiceId(voice.id);
    const sampleText = getVoiceSampleText(voice.id);

    if (engineMode === 'browser' || voice.type === 'browser') {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(sampleText);
        const bVoice = browserVoices.find(v => v.voiceURI === voice.id);
        if (bVoice) utterance.voice = bVoice;
        utterance.rate = speed;

        utterance.onend = () => {
          setSamplePlayingVoiceId(null);
        };

        sampleTimeoutRef.current = setTimeout(() => {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          setSamplePlayingVoiceId(null);
        }, 3000);

        window.speechSynthesis.speak(utterance);
      }
    } else {
      try {
        const response = await fetch('/api/tts/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: sampleText,
            voiceName: voice.name,
            speakingRate: 1.0,
            pitch: 0.0,
            languageCode: voice.languageCode
          })
        });

        if (!response.ok) throw new Error("Sample unavailable");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        sampleAudioRef.current = audio;
        audio.play();

        sampleTimeoutRef.current = setTimeout(() => {
          audio.pause();
          setSamplePlayingVoiceId(null);
        }, 3000);

        audio.onended = () => {
          setSamplePlayingVoiceId(null);
        };
      } catch (err) {
        console.warn("Could not play cloud premium sample, falling back to local synthesis:", err);
        
        // Secondary local synthesis fallback inside sample listener
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(sampleText);
          const bVoice = getBestBrowserVoiceForCloudVoice(voice.id, browserVoices);
          if (bVoice) utterance.voice = bVoice;
          utterance.rate = speed;

          utterance.onend = () => {
            setSamplePlayingVoiceId(null);
          };

          sampleTimeoutRef.current = setTimeout(() => {
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            setSamplePlayingVoiceId(null);
          }, 3000);

          window.speechSynthesis.speak(utterance);
        } else {
          setSamplePlayingVoiceId(null);
        }
      }
    }
  };

  // Initialize analyser node
  const initAudioVisualizer = () => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;

      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (err) {
      console.error("AudioContext initialization bypassed:", err);
    }
  };

  // Real-time animation loop for Web Audio API
  useEffect(() => {
    if (isPlaying && !isPaused && engineMode === 'cloud') {
      initAudioVisualizer();

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const totalBars = 11;
        const nextData: number[] = [];
        for (let i = 0; i < totalBars; i++) {
          const idx = Math.min(bufferLength - 1, Math.floor((i / totalBars) * (bufferLength / 2)));
          const raw = dataArray[idx];
          const scale = 0.15 + (raw / 255) * 0.85;
          nextData.push(scale);
        }
        setAmplitudeData(nextData);
        animationFrameIdRef.current = requestAnimationFrame(updateWaveform);
      };

      animationFrameIdRef.current = requestAnimationFrame(updateWaveform);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, isPaused, engineMode]);

  // Simulated real-time waveform updates for browser offline voice mode
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isPaused && engineMode === 'browser') {
      interval = setInterval(() => {
        const simulated = Array.from({ length: 11 }).map(() => 0.15 + Math.random() * 0.85);
        setAmplitudeData(simulated);
      }, 95);
    } else if (engineMode === 'browser') {
      setAmplitudeData(new Array(11).fill(0.15));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused, engineMode]);

  // Global keyboard shortcuts listeners
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const isControl = e.ctrlKey || e.metaKey;
      
      // 1. Ctrl + Enter (or Cmd + Enter) to Generate & play voice
      if (isControl && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          if (audioUrl && engineMode === 'cloud') {
            handleDownload();
          }
        } else {
          if (text.trim() && !generationLoading) {
            handlePlay();
          }
        }
        return;
      }

      // 2. Space bar to play/pause (only when not typing in any input, textarea or editable container)
      if (e.key === ' ' || e.code === 'Space') {
        const activeEl = document.activeElement;
        const isTyping = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true' ||
          (activeEl as HTMLElement).isContentEditable
        );

        if (!isTyping) {
          e.preventDefault(); // Prevent page scroll on space
          if (isPlaying) {
            handlePauseResume();
          } else {
            if (audioUrl) {
              handlePlayPreviewOnly();
            } else if (text.trim() && !generationLoading) {
              handlePlay();
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => {
      window.removeEventListener('keydown', handleGlobalShortcuts);
    };
  }, [text, audioUrl, engineMode, isPlaying, isPaused, generationLoading]);

  // Load history & browser voices
  useEffect(() => {
    // 1. Load History
    const stored = localStorage.getItem('auraspeech_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TtsHistoryItem[];
        // Sanitize audioDataUrl since Blob/object URLs do not survive browser reloads
        const sanitized = parsed.map(item => ({
          ...item,
          audioDataUrl: item.audioDataUrl?.startsWith('blob:') ? undefined : item.audioDataUrl
        }));
        setHistory(sanitized);
      } catch (err) {
        console.error(err);
      }
    }

    // 2. Fetch browser Speech Synthesis Voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const getSpeechVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setBrowserVoices(voices);
        if (voices.length > 0 && !selectedBrowserVoiceURI) {
          // Prefers standard English or first available
          const englishOption = voices.find(v => v.lang.startsWith('en')) || voices[0];
          setSelectedBrowserVoiceURI(englishOption?.voiceURI || voices[0].voiceURI);
        }
      };

      getSpeechVoices();
      window.speechSynthesis.onvoiceschanged = getSpeechVoices;
    }

    // 3. Simple check if AI engine has key
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setPremiumAvailable(data.hasKey);
      })
      .catch(() => setPremiumAvailable(false));
  }, []);

  // Save history state to localStorage helper
  const saveHistory = (newHistory: TtsHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('auraspeech_history', JSON.stringify(newHistory));
  };

  // Add synthesis item to history list (max 5)
  const addToHistory = (txt: string, vId: string, vLabel: string, dataUrl?: string) => {
    const newItem: TtsHistoryItem = {
      id: Math.random().toString(36).substring(7),
      text: txt.length > 100 ? txt.substring(0, 97) + '...' : txt,
      voiceId: vId,
      voiceLabel: vLabel,
      speed,
      pitch,
      audioDataUrl: dataUrl,
      timestamp: Date.now()
    };
    const updated = [newItem, ...history.filter(item => item.text !== newItem.text)].slice(0, 5);
    saveHistory(updated);
  };

  // Drag and Drop files functionality
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "text/plain" && !file.name.endsWith('.txt')) {
      setErrorMessage("Only .txt files are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const textVal = event.target?.result as string;
      if (textVal) {
        setText(textVal.substring(0, maxChars));
        setErrorMessage(null);
      }
    };
    reader.readAsText(file);
  };

  // Stop everything (audio and native narration)
  const handleStopAll = () => {
    // Clear voice preview sample
    stopVoiceSample();

    // Stop browser speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    // Stop audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentCharIndex(-1);
  };

  // Trigger TTS voice generation/playback
  const handlePlay = async (textOverride?: string | React.MouseEvent) => {
    const textToSpeak = typeof textOverride === 'string' ? textOverride : text;
    if (!textToSpeak.trim()) {
      setErrorMessage("Please enter some text to speak.");
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    handleStopAll(); // Clear previous playbacks

    if (engineMode === 'browser') {
      // BROWSER VOICE PLAYBACK
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setErrorMessage("Browser Speech Synthesis is not supported on this device.");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const selectedVoice = browserVoices.find(v => v.voiceURI === selectedBrowserVoiceURI);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = speed;
      // Map pitch from semitones [-20, 20] (where default is 0) to standard [0, 2] (where default is 1)
      const mappedPitch = 1 + (pitch / 20); 
      utterance.pitch = Math.max(0.1, Math.min(2, mappedPitch));

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          setCurrentCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentCharIndex(-1);
      };

      utterance.onerror = (e) => {
        console.error("Browser speech synthesis error:", e);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentCharIndex(-1);
      };

      utteranceRef.current = utterance;
      addToHistory(textToSpeak, selectedBrowserVoiceURI, selectedVoice?.name || 'Local Browser Voice');
      window.speechSynthesis.speak(utterance);

    } else {
      // CLOUD AI PREMIUM VOICES
      setGenerationLoading(true);
      const voiceInfo = googleVoices.find(v => v.id === selectedVoiceId) || googleVoices[0];

      try {
        const response = await fetch('/api/tts/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            voiceName: voiceInfo.name,
            speakingRate: speed,
            pitch,
            languageCode: voiceInfo.languageCode
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Synthesis failed (HTTP ${response.status})`);
        }

        // Response is the direct audio blob. Convert to object URL
        const audioBlob = await response.blob();
        const objectUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(objectUrl);

        // Save history item
        addToHistory(textToSpeak, voiceInfo.id, voiceInfo.label, objectUrl);

        // Initiate audio HTML5 element playing
        if (audioRef.current) {
          audioRef.current.src = objectUrl;
          audioRef.current.load();
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setIsPaused(false);
            })
            .catch((err) => {
              console.error("Audio playback play() failed:", err);
              setErrorMessage("Synthesized successfully, but playback failed. Try downloading the audio or play again.");
            });
        }
      } catch (err: any) {
        console.warn("Cloud AI synthesis failed. Falling back to high precision browser synthesis:", err);
        
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          const bVoice = getBestBrowserVoiceForCloudVoice(voiceInfo.id, browserVoices);
          if (bVoice) {
            utterance.voice = bVoice;
          }
          utterance.rate = speed;
          // Map pitch from Google range to browser range
          const mappedPitch = 1 + (pitch / 25);
          utterance.pitch = Math.max(0.1, Math.min(2, mappedPitch));

          utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
          };

          utterance.onboundary = (event) => {
            if (event.name === 'word') {
              setCurrentCharIndex(event.charIndex);
            }
          };

          utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentCharIndex(-1);
          };

          utterance.onerror = (e) => {
            console.error("Fallback browser speech synthesis triggered error:", e);
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentCharIndex(-1);
            setErrorMessage("Voice synthesis playback failed. Please check browser speech module or switch voice mode.");
          };

          utteranceRef.current = utterance;
          addToHistory(textToSpeak, voiceInfo.id, `${voiceInfo.label} (Fallback Mode)`);
          
          setInfoMessage(
            "H Fallback Active: Premium AI voice experienced a temporary rate limit. We've seamlessly switched to your high-fidelity browser offline voice engine to read this text! Fully unlimited with safe sandbox rendering."
          );
          
          window.speechSynthesis.speak(utterance);
        } else {
          const msg = err.message || "";
          if (msg.includes("403") || msg.toLowerCase().includes("forbidden") || msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("credentials")) {
            setErrorMessage(
              "Google Gemini API returned a 403 (Forbidden) error or missing permission. Please ensure your Gemini API Key is configured in the Secrets manager, or switch to the 'Browser Built-In' voice engine at the top of the card for a free, instant, and unlimited offline voice synthesis fallback!"
            );
          } else {
            setErrorMessage(
              err.message || "Synthesizer offline. Gemini premium service might have reached its quota. Try switching to 'Browser Built-In' voices!"
            );
          }
        }
      } finally {
        setGenerationLoading(false);
      }
    }
  };

  const handlePlayPreviewOnly = () => {
    if (!audioUrl) return;
    handleStopAll();
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsPaused(false);
        })
        .catch((err) => {
          console.error("Audio playback preview failed:", err);
          setErrorMessage("Failed to play preview. Please generate first or play again.");
        });
    }
  };

  const handlePauseResume = () => {
    if (engineMode === 'browser') {
      if (isPlaying) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsPaused(true);
        }
      }
    } else {
      if (audioRef.current && isPlaying) {
        if (isPaused) {
          audioRef.current.play();
          setIsPaused(false);
        } else {
          audioRef.current.pause();
          setIsPaused(true);
        }
      }
    }
  };

  const handleDownload = () => {
    if (engineMode === 'browser') {
      setErrorMessage("Downloading is only supported using premium 'Google Gemini AI' voices. Browser built-in audio cannot be easily recorded.");
      return;
    }
    if (!audioUrl) return;

    // Create virtual link & download
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speech-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Re-play history log item instantly
  const playHistoryItem = (item: TtsHistoryItem) => {
    setText(item.text);
    setSpeed(item.speed);
    setPitch(item.pitch);
    
    // Check if browser voice vs cloud voice
    const isBrowserItem = browserVoices.some(v => v.voiceURI === item.voiceId);
    if (isBrowserItem) {
      setEngineMode('browser');
      setSelectedBrowserVoiceURI(item.voiceId);
    } else {
      setEngineMode('cloud');
      setSelectedVoiceId(item.voiceId);
    }

    // Attempt direct play of binary if available
    if (item.audioDataUrl) {
      handleStopAll();
      setAudioUrl(item.audioDataUrl);
      if (audioRef.current) {
        audioRef.current.src = item.audioDataUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsPaused(false);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    } else {
      // Fallback to trigger normal synthesize play
      setTimeout(() => {
        handlePlay(item.text);
      }, 100);
    }
  };

  // Dynamic list of premium Google WaveNet voices
  const allVoicesList = googleVoices;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in duration-500">
      
      {/* Hidden audio element for Cloud TTS stream */}
      <audio 
        ref={audioRef} 
        onEnded={() => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentCharIndex(-1);
        }}
        onTimeUpdate={() => {
          if (audioRef.current && audioRef.current.duration) {
            const ratio = audioRef.current.currentTime / audioRef.current.duration;
            const words = text.split(/(\s+)/).filter(w => !/\s+/.test(w) && w.length > 0);
            if (words.length > 0) {
              const targetWordIndex = Math.min(words.length - 1, Math.floor(ratio * words.length));
              // Find start character index of targetWordIndex
              let accumLength = 0;
              let currentWordCounter = 0;
              const rawWords = text.split(/(\s+)/);
              for (const part of rawWords) {
                if (/\s+/.test(part)) {
                  accumLength += part.length;
                } else {
                  if (currentWordCounter === targetWordIndex) {
                    setCurrentCharIndex(accumLength);
                    break;
                  }
                  accumLength += part.length;
                  currentWordCounter++;
                }
              }
            }
          }
        }}
        onError={(e) => {
          console.error("HTML5 Audio element error:", e);
        }}
        className="hidden"
      />

      {/* Main Container - Framed in modern Glassmorphism with Blue branding */}
      <div 
        className={`bg-[#0c0c0e]/95 border border-blue-500/15 p-4 sm:p-10 relative rounded-3xl transition-all duration-300 shadow-[0_16px_50px_rgba(0,0,0,0.95)] ${
          dragActive ? 'border-blue-500/50 bg-blue-950/10 shadow-[0_0_35px_rgba(59,130,246,0.15)]' : 'hover:border-blue-500/30'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-gradient-to-br from-blue-500/10 via-blue-500/0 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-gradient-to-tr from-blue-600/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Dynamic header title & mode toggle switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 relative z-10 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <Volume2 className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              {activeModule === 'tts' && 'Text-to-Speech'}
              {activeModule === 'sts' && 'Speech-to-Text Transcribe'}
            </h2>
            <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 pb-0.5">
              {activeModule === 'tts' && 'Enter text to synthesize natural human vocalizations instantly.'}
              {activeModule === 'sts' && 'Speak or upload any audio / speech recording file (.mp3, .wav, .m4a) to transcribe it instantly using Gemini NLP.'}
            </p>
          </div>

          {/* Clean segment switcher replacing old engine switchers */}
          <div className="inline-flex p-0.5 rounded-xl bg-black/50 border border-white/10 w-full md:w-auto overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                handleStopAll();
                setActiveModule('tts');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-300 ${
                activeModule === 'tts'
                  ? 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={12} />
              <span>Text-to-Speech</span>
            </button>
            
            <button
              onClick={() => {
                handleStopAll();
                setActiveModule('sts');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-300 ${
                activeModule === 'sts'
                  ? 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles size={12} />
              <span>Speech-to-Text Transcribe</span>
            </button>
          </div>
        </div>

        {/* Main Columns Stack: Typing region on top, speech configure controls below */}
        <div className="flex flex-col gap-6 relative z-10 items-stretch font-sans">
          
          {/* Top Column - Houses the active module canvas */}
          <div className="w-full flex flex-col justify-stretch">
            
            {/* Input notepad frame wrapper with integrated mouse arrow listeners */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative z-10 group rounded-3xl overflow-hidden border border-white/5 focus-within:border-blue-500/30 transition-all duration-300 bg-[#09090c] flex-grow flex flex-col min-h-[250px] sm:min-h-[330px]"
            >
              
              {/* Waveform Visualization Background behind the text - ALWAYS VISIBLE */}
              <div className="absolute inset-x-0 bottom-3 top-14 flex items-end justify-center px-4 sm:px-8 pb-4 pointer-events-none select-none overflow-hidden opacity-[0.25]">
                {/* Detailed vertical columns forming the dynamic active voice peaks */}
                <div className="flex items-end justify-between w-full h-2/3 gap-[1.5px] max-w-2xl mx-auto">
                  {Array.from({ length: 64 }).map((_, idx) => {
                    const env = 0.40 * Math.exp(-Math.pow((idx - 15) / 5, 2)) + 
                                0.70 * Math.exp(-Math.pow((idx - 32) / 7, 2)) + 
                                0.35 * Math.exp(-Math.pow((idx - 49) / 4, 2));

                    const currentAmp = amplitudeData[idx % amplitudeData.length] || 0.15;
                    
                    // Ambient base height when idle
                    const baseHeight = Math.max(3, env * 45 * (0.3 + 0.7 * Math.abs(Math.sin(idx * 0.15 + waveTick * 0.12 + arrowPhaseOffset))) * arrowHeightScale);
                    
                    // High fidelity playing height
                    const activeHeight = Math.max(3, env * 100 * (0.2 + 0.8 * Math.abs(Math.sin(idx * 0.12 + currentAmp * 7 + arrowPhaseOffset))) * arrowHeightScale);
                    
                    // Synthesized loading wave
                    const loadingHeight = Math.max(4, env * 85 * (0.4 + 0.6 * Math.abs(Math.sin(waveTick * 0.08 + idx * 0.08 + arrowPhaseOffset))) * arrowHeightScale);

                    let finalHeight = isPlaying && !isPaused ? activeHeight : generationLoading ? loadingHeight : baseHeight;

                    // Mouse pointer arrow trace focus
                    if (hoverX !== null && hoverY !== null) {
                      const mouseIndex = hoverX * 64;
                      const dist = Math.abs(idx - mouseIndex);
                      const mousePeak = Math.exp(-Math.pow(dist / 6, 2)) * hoverY * 85 * arrowHeightScale;
                      finalHeight += mousePeak;
                    }

                    return (
                      <div
                        key={idx}
                        className={`w-[2px] sm:w-[3px] rounded-full transition-all duration-150 ${
                          isPlaying && !isPaused
                            ? 'bg-gradient-to-t from-cyan-400 to-emerald-355 shadow-[0_0_8px_rgba(20,184,166,0.5)]'
                            : (hoverX !== null)
                              ? 'bg-gradient-to-t from-fuchsia-500 to-rose-400 shadow-[0_0_6px_rgba(236,72,153,0.3)]'
                              : 'bg-gradient-to-t from-indigo-500/40 to-fuchsia-400/40'
                        }`}
                        style={{
                          height: `${Math.min(100, finalHeight)}%`
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* TEXT-TO-SPEECH WORKSPACE CLIENT */}
              {activeModule === 'tts' && (
                <>
                  {/* Absolute header row containing stats on the left and actions on the right */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none z-20">
                    {/* Left side: Words, read time, and characters counter */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-xs font-mono text-gray-400 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/5 pointer-events-auto select-none shadow-lg">
                      <span className="flex items-center gap-1 text-gray-300">
                        <FileText size={10} className="text-fuchsia-400 shrink-0" />
                        Words: <strong className="text-white font-semibold">{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
                      </span>
                      <span className="h-2.5 w-[1px] bg-white/10" />
                      <span className="flex items-center gap-1 text-gray-300" title="Estimates natural voice narration speed">
                        <Info size={10} className="text-fuchsia-400 shrink-0" />
                        Est. Read: <strong className="text-fuchsia-400 font-semibold">{getReadingTime()}</strong>
                      </span>
                      <span className="h-2.5 w-[1px] bg-white/10" />
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 uppercase text-[8px]">Chars:</span>
                        <span className={`px-1 py-0.5 rounded font-bold text-[9px] ${text.length >= maxChars ? 'bg-rose-500/15 text-rose-400' : 'bg-black/30 text-gray-300 border border-white/0.5'}`}>
                          {text.length.toLocaleString()}/{maxChars.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Input actions (Clear text, Paste from Clipboard, Upload TXT) */}
                    <div className="flex items-center gap-1 pointer-events-auto">
                      {text && (
                        <button
                          type="button"
                          onClick={() => setText('')}
                          className="p-1 px-1.5 rounded-lg bg-black/55 border border-white/5 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer text-[10px] flex items-center gap-1 font-mono font-medium"
                          title="Clear notepad"
                        >
                          Clear text
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const clipboardText = await navigator.clipboard.readText();
                            if (clipboardText) {
                              setText(prev => prev + (prev ? '\n' : '') + clipboardText);
                              setErrorMessage(null);
                              setInfoMessage("Script successfully pasted from clipboard!");
                              setTimeout(() => setInfoMessage(null), 3000);
                            } else {
                              setErrorMessage("Your clipboard is empty.");
                            }
                          } catch (err) {
                            setErrorMessage("Clipboard access blocked by browser. You can still paste with Ctrl+V directly!");
                          }
                        }}
                        className="p-1 px-1.5 rounded-lg bg-black/55 border border-white/5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer text-[10px] flex items-center gap-1 font-mono font-medium"
                        title="Paste text from clipboard"
                      >
                        <FileText size={10} className="text-indigo-400" />
                        <span>Paste</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 px-1.5 rounded-lg bg-black/55 border border-white/5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer text-[10px] flex items-center gap-1 font-mono font-medium"
                        title="Upload text file"
                      >
                        <Upload size={10} className="text-blue-400" />
                        <span>Upload TXT</span>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept=".txt" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </div>
                  </div>

                  {/* Textarea or live synchronized reader */}
                  {isPlaying ? (
                    <div className="w-full flex-grow rounded-3xl pt-20 xs:pt-16 sm:pt-14 pb-4 px-4 text-xs sm:text-sm text-left text-white bg-black/40 overflow-y-auto relative z-10 leading-relaxed font-sans min-h-[160px] sm:min-h-[220px] shadow-inner border border-white/5">
                      <div className="flex flex-wrap gap-x-1.5 gap-y-1">
                        {(() => {
                          const tokens = [];
                          let accumIdx = 0;
                          const rawWords = text.split(/(\s+)/);
                          for (const part of rawWords) {
                            if (/\s+/.test(part)) {
                              accumIdx += part.length;
                            } else {
                              tokens.push({
                                word: part,
                                start: accumIdx,
                                end: accumIdx + part.length
                              });
                              accumIdx += part.length;
                            }
                          }

                          return tokens.map((token, i) => {
                            const isWordActive = currentCharIndex >= token.start && currentCharIndex < token.end;
                            return (
                              <span 
                                key={i} 
                                className={`transition-all duration-150 inline-block px-0.5 rounded-sm ${
                                  isWordActive 
                                    ? 'text-blue-400 font-bold underline underline-offset-4 decoration-blue-500 decoration-2 bg-blue-500/10 scale-105' 
                                    : 'text-zinc-350'
                                }`}
                              >
                                {token.word}
                              </span>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      id="tts-text-input"
                      value={text}
                      onChange={(e) => setText(e.target.value.substring(0, maxChars))}
                      placeholder="Paste or type your script here to create beautiful, flowing natural speech…"
                      className="w-full flex-grow rounded-3xl pt-20 xs:pt-16 sm:pt-14 pb-4 px-4 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none bg-transparent relative z-10 leading-relaxed font-sans resize-none min-h-[160px] sm:min-h-[220px] shadow-inner"
                    />
                  )}
                </>
              )}

              {/* SPEECH-TO-TEXT NEURAL TRANSCRIPTION CLIENT */}
              {activeModule === 'sts' && (
                <div className="p-4 relative z-20 flex-grow flex flex-col justify-between items-center text-center space-y-4 min-h-[240px] sm:min-h-[300px]">
                  <div className="w-full max-w-lg mx-auto py-2.5 sm:py-5 space-y-4">
                    
                    {/* Visual Mic trigger */}
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={isRecording ? stopRecordingSts : startRecordingSts}
                        disabled={transcribingLoading}
                        className={`p-4 sm:p-5 rounded-full border cursor-pointer transition-all duration-300 shadow-lg ${
                          isRecording 
                            ? 'bg-rose-500 hover:bg-rose-600 border-rose-400 animate-pulse' 
                            : transcribingLoading
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                              : 'bg-white/5 hover:bg-white/10 hover:scale-105 border-white/10'
                        }`}
                      >
                        <Volume2 size={24} className={isRecording ? "text-white animate-bounce" : transcribingLoading ? "text-yellow-400 animate-spin" : "text-blue-400"} />
                      </button>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                        {isRecording 
                          ? "🔴 Capturing Vocal Feed..." 
                          : transcribingLoading 
                            ? "⚡ Extracting acoustic transcription..." 
                            : "Neural Speech-to-Text Voice Transcribe"}
                      </h3>
                      <p className="text-[10px] text-zinc-400 mt-1 max-w-md mx-auto leading-normal">
                        {isRecording 
                          ? "Listening to your voice... Speak clearly, then click again to synthesize text." 
                          : transcribingLoading 
                            ? "Gemini flash engine is mapping phonetic acoustic features to text..." 
                            : "Click the mic to speak, or upload any speech payload (.mp3, .wav, .m4a) below. If the browser blocks mic access inside the preview iframe, click the 'Open in New Tab' button in the toolbar above."}
                      </p>
                    </div>

                    {/* Loader overlay */}
                    {transcribingLoading && (
                      <div className="py-1 flex items-center justify-center gap-1.5 text-[10px] text-yellow-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                        <span>TRANSCRIPTION RUNNING (ZERO SUBSCRIPTION REQUIRED)...</span>
                      </div>
                    )}

                    {/* Verbatim transcription response area */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 text-[11px] text-left w-full font-mono text-zinc-300">
                      <span className="text-[9px] text-fuchsia-400 block mb-1 uppercase font-bold tracking-widest">TRANSCRIBED SCRIPT RESULT (EDITABLE):</span>
                      {stsTranscription ? (
                        <div className="space-y-2">
                          <textarea
                            value={stsTranscription}
                            onChange={(e) => {
                              const updatedVal = e.target.value;
                              setStsTranscription(updatedVal);
                              setText(updatedVal); // Sync live with composer text
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 resize-none font-sans min-h-[70px] leading-relaxed transition-all"
                            placeholder="Tweak or rewrite the transcribed text here if needed..."
                          />
                          <div className="pt-0.5 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                            <span className="text-zinc-500 font-sans">
                              ✍️ Feel free to edit! Updates sync live to the composer.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setText(stsTranscription);
                                setActiveModule('tts');
                                setInfoMessage("Injected transcription script into syntheses notepad!");
                                setTimeout(() => setInfoMessage(null), 3000);
                              }}
                              className="px-2 py-1 rounded bg-indigo-550 hover:bg-indigo-600 text-white font-bold cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              ✨ Switch to TTS Composer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-zinc-500 italic text-[10px] py-1">No voice captured yet. Record live audio or drop any MP3 wave below...</p>
                      )}
                    </div>
                  </div>

                  {/* Drag-and-drop / upload file elements specifically for audio input */}
                  <div className="w-full border-t border-white/5 pt-3.5 flex flex-wrap items-center justify-between gap-2.5 text-[11px] relative z-30">
                    <span className="text-zinc-500 font-mono text-[9px] uppercase">Upload any Voice / MP3 Wave:</span>
                    <button
                      type="button"
                      onClick={() => audioFileInputRef.current?.click()}
                      disabled={transcribingLoading}
                      className="p-1 px-3 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 transition-all cursor-pointer font-semibold flex items-center gap-1.5"
                    >
                      <Upload size={12} className="text-blue-400" />
                      <span>{stsAudioFile ? stsAudioFile.name : "Select Audio File"}</span>
                    </button>
                    <input 
                      type="file" 
                      ref={audioFileInputRef} 
                      accept="audio/*" 
                      onChange={handleAudioFileChange} 
                      className="hidden" 
                    />
                  </div>
                </div>
              )}

              {/* Active drag overlay visual */}
              {dragActive && (
                <div className="absolute inset-0 rounded-3xl bg-blue-500/5 backdrop-blur-xs border-2 border-dashed border-blue-500/30 flex items-center justify-center pointer-events-none z-30">
                  <div className="text-center">
                    <Upload size={32} className="text-blue-400 mx-auto mb-2 animate-bounce" />
                    <p className="text-sm font-semibold text-white">Drop your .txt file here to import</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Row - Contains Voice selection, Sliders, and Active Controls in side-by-side grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
            
            {/* Left Options (lg:col-span-7) - Houses choose voice & speed/pitch Controls */}
            <div className="lg:col-span-7 flex flex-col justify-start space-y-4">

            {/* Choose Glass Voice section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs text-indigo-400 font-mono tracking-wider uppercase font-bold" htmlFor="voice-selection">
                  🔮 Choose voice only the voice text
                </label>
              </div>

              {/* Collapsible compact scrolling voice selector dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-left cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                    <div className="truncate">
                      <span className="block text-[7px] text-zinc-500 font-mono leading-none mb-0.5 uppercase">
                        {engineMode === 'cloud' ? 'AI Cloud Engine Active' : 'Offline Browser'}
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-white tracking-tight leading-none">
                        {engineMode === 'cloud' 
                          ? (allVoicesList.find(v => v.id === selectedVoiceId)?.label || 'Select premium voice')
                          : (browserVoices.find(v => v.voiceURI === selectedBrowserVoiceURI)?.name || (browserVoices.length > 0 ? browserVoices[0].name : 'Built-in local voice'))
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                      {engineMode === 'cloud' ? 'PREMIUM' : 'OFFLINE'}
                    </span>
                    <ChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${isVoiceDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
 
                {/* Collapsible Dropdown Option List */}
                {isVoiceDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 pb-1 z-50 rounded-xl bg-zinc-950 border border-white/10 shadow-2xl max-h-[180px] overflow-y-auto scrollbar-thin">
                    <div className="p-1 space-y-0.5">
                      {engineMode === 'cloud' ? (
                        allVoicesList.map((v) => {
                          const isSelected = selectedVoiceId === v.id;
                          const isSamplePlaying = samplePlayingVoiceId === v.id;
                          
                          return (
                            <div
                              key={v.id}
                              onClick={() => {
                                setSelectedVoiceId(v.id);
                                setIsVoiceDropdownOpen(false);
                              }}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-500/15 border border-blue-500/25 text-white'
                                  : 'hover:bg-white/5 border border-transparent text-gray-300'
                              }`}
                            >
                              <div className="truncate pr-1">
                                <span className="text-[11px] font-medium block truncate">{v.label}</span>
                                <span className="text-[8px] font-mono text-gray-500 block">
                                  {v.languageCode === 'en-US' ? 'US Dialect' : v.languageCode === 'en-GB' ? 'UK Dialect' : v.languageCode.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    playVoiceSample(v);
                                  }}
                                  className={`p-1 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                    isSamplePlaying
                                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-transparent'
                                      : 'bg-black/40 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                                  }`}
                                  title="Listen to 3s Voice Sample"
                                >
                                  {isSamplePlaying ? (
                                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                  ) : (
                                    <Play size={8} fill="currentColor" />
                                  )}
                                </button>
                                {isSelected && <Check size={10} className="text-blue-400 shrink-0" />}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        browserVoices.length > 0 ? (
                          browserVoices.map((v) => {
                            const isSelected = selectedBrowserVoiceURI === v.voiceURI;
                            const isSamplePlaying = samplePlayingVoiceId === v.voiceURI;
                            
                            return (
                              <div
                                key={v.voiceURI}
                                onClick={() => {
                                    setSelectedBrowserVoiceURI(v.voiceURI);
                                    setIsVoiceDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-blue-500/15 border border-blue-500/25 text-white'
                                    : 'hover:bg-white/5 border border-transparent text-gray-300'
                                }`}
                              >
                                <div className="truncate pr-1">
                                  <span className="text-[11px] font-medium block truncate">{v.name}</span>
                                  <span className="text-[8px] font-mono text-gray-500 block uppercase">{v.lang}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playVoiceSample({
                                        id: v.voiceURI,
                                        name: v.name,
                                        label: v.name,
                                        languageCode: v.lang,
                                        type: 'browser'
                                      });
                                    }}
                                    className={`p-1 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                      isSamplePlaying
                                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-transparent'
                                        : 'bg-black/40 text-gray-400 border-white/5 hover:text-white hover:border-white/10'
                                    }`}
                                    title="Listen to 3s Voice Sample"
                                  >
                                    {isSamplePlaying ? (
                                      <Pause size={8} />
                                    ) : (
                                      <Play size={8} fill="currentColor" />
                                    )}
                                  </button>
                                  {isSelected && <Check size={10} className="text-blue-400 shrink-0" />}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-3 py-4 text-[9px] text-center text-gray-500">
                            No browser voices detected. Try Cloud voiceovers!
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[8px] sm:text-[9px] text-gray-500 leading-snug">
                {engineMode === 'cloud' ? (
                  <span>Premium Wavenet AI models capture human rhythm, accent, and stress patterns.</span>
                ) : (
                  <span>Direct operating system voice synthesis. Zero request latency.</span>
                )}
              </div>
            </div>

            {/* Side-by-Side Speed & Pitch Controls with Decreased Size */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-white/[0.01] border border-white/[0.03]">
              {/* Speed control */}
              <div className="space-y-0.5 p-1.5 rounded-lg bg-white/[0.01] border border-white/[0.02] flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold uppercase tracking-wider text-cyan-400 text-[8px]">
                    ⚡ SPEED
                  </span>
                  <span className="text-cyan-400 font-bold text-[8px] px-1 bg-cyan-400/10 rounded">
                    {speed.toFixed(1)}x
                  </span>
                </div>
                <div className="pt-0.5">
                  <input
                    id="speed-precision-slider"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all hover:bg-white/20"
                    title="Slide to adjust speed"
                  />
                </div>
              </div>

              {/* Pitch control */}
              <div className="space-y-0.5 p-1.5 rounded-lg bg-white/[0.01] border border-white/[0.02] flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold uppercase tracking-wider text-rose-400 text-[8px]">
                    🔮 PITCH
                  </span>
                  <span className="text-rose-400 font-bold text-[8px] px-1 bg-rose-400/10 rounded">
                    {engineMode === 'cloud' ? `${pitch > 0 ? '+' : ''}${pitch.toFixed(0)} ST` : `${(pitch / 25 + 1).toFixed(1)}x`}
                  </span>
                </div>
                <div className="pt-0.5">
                  <input
                    id="pitch-precision-slider"
                    type="range"
                    min="-20"
                    max="20"
                    step="1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400 transition-all hover:bg-white/20"
                    title="Slide to adjust pitch"
                  />
                </div>
              </div>
            </div>

          </div>

            {/* Right Options Column (lg:col-span-5) - Control Activators & Playing Visualizer */}
            <div className="lg:col-span-5 flex flex-col justify-start h-full">

              {/* Control Activators & Playing visualizer */}
              <div className="p-3.5 border border-white/5 rounded-2xl bg-black/40 space-y-3 h-full flex flex-col justify-between">
                <div>
                  
                  {/* Play status circle glow & active status label */}
                  <div className="flex items-center justify-between gap-2.5 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isPlaying 
                          ? 'bg-fuchsia-500 animate-ping' 
                          : 'bg-gray-700'
                      }`} />

                  {isPlaying ? (
                    <span className="text-[9px] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 font-mono tracking-wider font-semibold uppercase animate-pulse">
                      {isPaused ? 'PAUSED' : 'PLAYING'}
                    </span>
                  ) : generationLoading ? (
                    <span className="text-[9px] text-gray-400 font-mono font-medium">RENDERING PREMIUM GEMINI VOICE...</span>
                  ) : (
                    <span className="text-[9px] text-gray-500 font-mono">ENGINE READY FOR SYNTHESIS</span>
                  )}
                </div>

                {/* Simulated wave bars feedback inside control module */}
                {isPlaying && (
                  <div className="flex items-center gap-[2px] h-3 justify-center">
                    {amplitudeData.slice(0, 5).map((scale, i) => (
                      <div
                        key={i}
                        className="w-[2px] bg-indigo-400 rounded-full transition-all duration-75"
                        style={{
                          height: '100%',
                          transform: `scaleY(${scale})`,
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                  </div>
                )}
                  </div>
                </div>

                {/* Activation action buttons row */}
              <div className="flex flex-wrap gap-1.5 items-center justify-between w-full">
                
                <div className="flex items-center gap-1.5 flex-grow sm:flex-grow-0">
                  {isPlaying ? (
                    <>
                      <button
                        type="button"
                        onClick={handlePauseResume}
                        className="px-2.5 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] sm:text-xs font-semibold text-white transition-all duration-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Pause size={10} />
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleStopAll}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-500/10 bg-rose-500/15 hover:bg-rose-500/25 text-[10px] sm:text-xs font-semibold text-rose-300 transition-all duration-200 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={10} />
                        <span>Stop</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePlay()}
                        disabled={generationLoading || !text.trim()}
                        className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-[0_4px_12px_-4px_rgba(236,72,153,0.5)] text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-all duration-300 transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:opacity-90"
                      >
                        <Play size={10} fill="currentColor" />
                        <span>Generate & Play voice</span>
                      </button>

                      {audioUrl && (
                        <button
                          type="button"
                          onClick={handlePlayPreviewOnly}
                          className="px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-all duration-300 transform active:scale-95 cursor-pointer"
                          title="Play the audio that was already generated"
                        >
                          <Play size={10} className="text-indigo-400" />
                          <span>Play Saved Audio</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  {audioUrl && !isPlaying && (
                    <button
                      type="button"
                      onClick={() => handlePlay(text)}
                      disabled={generationLoading || !text.trim()}
                      className="p-2 rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 hover:bg-fuchsia-500/15 text-[10px] sm:text-xs font-semibold text-fuchsia-300 transition-all duration-220 flex items-center justify-center cursor-pointer"
                      title="Re-synthesize from scratch"
                    >
                      <RotateCcw size={10} className={generationLoading ? "animate-spin" : ""} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  {/* Download Trigger */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={engineMode === 'browser' || !audioUrl}
                    className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                    title="Download generated MP3 voiceover"
                  >
                    <Download size={11} />
                  </button>

                  {/* Twitter share trigger */}
                  {text.trim() && (
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out this text synthesized with ispeech! "${text.substring(0, 50)}..."`
                       )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-blue-400 hover:border-blue-500/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
                      title="Share text on Twitter / X"
                    >
                      <Share2 size={11} />
                    </a>
                  )}
                </div>

              </div>

              {/* Compact elegant Keyboard Shortcuts Guide */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  💡 High-frequency shortcuts active
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-sans font-semibold text-[9px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-sans font-semibold text-[9px]">Enter</kbd>
                    <span>Generate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-sans font-semibold text-[9px]">Space</kbd>
                    <span>Play / Pause</span>
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

        {/* Global error alerts */}
        {errorMessage && (
          <div className="mt-5 relative z-10 flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <strong>Playback or Synthesis Error:</strong> {errorMessage}
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-gray-500 hover:text-white font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Quiet Info or Fallback notice banners */}
        {infoMessage && (
          <div className="mt-5 relative z-10 flex items-start gap-2.5 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300">
            <AlertCircle size={15} className="mt-0.5 shrink-0 text-blue-400" />
            <div className="flex-1 text-[11px] leading-relaxed">
              <strong>Voice Fallback:</strong> {infoMessage}
            </div>
            <button 
              onClick={() => setInfoMessage(null)} 
              className="text-gray-500 hover:text-white font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
