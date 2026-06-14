import React, { useState, useRef } from 'react';
import { Upload, FileText, Play, Activity, Sparkles, Volume2, HelpCircle, Download } from 'lucide-react';

export default function SubtitleToSpeech() {
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [parsedSegments, setParsedSegments] = useState<{ id: string; time: string; text: string }[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Parse standard SRT subtitles
  const parseSRT = (content: string) => {
    const blocks = content.replace(/\r/g, '').split('\n\n');
    const result = [];
    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const timeSegment = lines[1];
        const textSegment = lines.slice(2).join(' ');
        if (timeSegment.includes('-->')) {
          result.push({
            id: lines[0],
            time: timeSegment,
            text: textSegment
          });
        }
      }
    }
    return result;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setSubtitleText(text);
        const parsed = parseSRT(text);
        if (parsed.length > 0) {
          setParsedSegments(parsed);
        } else {
          // If not formal SRT, parse line by line
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          setParsedSegments(lines.map((l, idx) => ({
            id: String(idx + 1),
            time: `Line ${idx + 1}`,
            text: l
          })));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setSubtitleText(text);
        const parsed = parseSRT(text);
        if (parsed.length > 0) {
          setParsedSegments(parsed);
        } else {
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          setParsedSegments(lines.map((l, idx) => ({
            id: String(idx + 1),
            time: `Line ${idx + 1}`,
            text: l
          })));
        }
      };
      reader.readAsText(file);
    }
  };

  const playSegment = async (id: string, textToSpeak: string) => {
    if (!textToSpeak.trim()) return;
    setIsSynthesizing(id);
    
    try {
      // Use standard Synthesis API as quick and reliable fallback
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        
        // Let's create synthesis speech response
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsSynthesizing(null);
        utterance.onerror = () => setIsSynthesizing(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsSynthesizing(null), 1500);
      }
    } catch (e) {
      console.error(e);
      setIsSynthesizing(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Header Container */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 shrink-0" /> Multi-Segment Speech
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white capitalize leading-tight">
          Subtitle to Speech Converter
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
          Upload your <code className="text-cyan-400 bg-white/5 px-1 rounded">.srt</code>, <code className="text-cyan-400 bg-white/5 px-1 rounded">.vtt</code> or script transcripts file to convert lines or timestamps into high quality voices segment by segment.
        </p>
      </div>

      {/* Upload Box Component */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-panel p-8 sm:p-12 relative rounded-3xl border text-center transition-all duration-300 z-10 ${
          dragOver ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-black/40 hover:bg-black/50'
        }`}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-white/5 mb-2">
            <Upload className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          
          <div>
            <p className="text-sm text-gray-200 font-semibold">
              {fileName ? `Loaded: ${fileName}` : "Drag and drop your subtitle details file"}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Supports standard SubRip formats (.srt) or text scripts
            </p>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold cursor-pointer transition-all">
              Browse Files
              <input 
                type="file" 
                accept=".srt,.vtt,.txt" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>
        </div>
      </div>

      {/* Parsed List Results inside highly structured glass panels */}
      {parsedSegments.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl animate-fade-in relative overflow-hidden space-y-4 border border-white/5 bg-black/40">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <Activity size={12} className="text-cyan-400 shrink-0" />
              PARSED SUBTITLE SEGMENTS ({parsedSegments.length})
            </span>
            <button 
              onClick={() => {
                setParsedSegments([]);
                setFileName('');
                setSubtitleText('');
              }}
              className="text-[10px] text-gray-500 hover:text-white font-mono cursor-pointer transition-colors"
            >
              CLEAR SCRIPTS
            </button>
          </div>

          <div className="max-h-[480px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {parsedSegments.map((seg) => (
              <div 
                key={seg.id} 
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 text-left min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-bold">
                      #{seg.id}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400">
                      {seg.time}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-200 break-words leading-relaxed">
                    {seg.text}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playSegment(seg.id, seg.text)}
                    disabled={isSynthesizing !== null}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    title="Speak Segment"
                  >
                    {isSynthesizing === seg.id ? (
                      <Volume2 size={14} className="animate-bounce text-cyan-400" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Help Guide inside a glass box */}
      <div className="glass-panel p-6 rounded-2xl text-xs text-gray-400 text-left border border-white/5 bg-black/20 flex gap-4 items-start">
        <HelpCircle size={20} className="text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1.5">
          <strong className="text-white block font-display">How Subtitle Conversion Works:</strong>
          <span className="block leading-relaxed">
            1. Drop any premium movie or dialogue subtitle script file directly into the layout block above.
          </span>
          <span className="block leading-relaxed">
            2. The system automatically segments each speaking timestamp with corresponding duration records.
          </span>
          <span className="block leading-relaxed">
            3. Preview segment synthesis instantly with custom playback checks, keeping voice records beautifully in check!
          </span>
        </div>
      </div>

    </div>
  );
}
