import React from 'react';
import { Volume2, Settings, FileText, Sparkles, Sliders, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      title: "1. Write or Paste Script",
      description: "Draft your message or script inside the spacious writing canvas. You can also import TXT files or use the instant Clipboard Paste feature.",
      accent: "from-indigo-500/10 to-indigo-500/0"
    },
    {
      icon: <Sliders className="w-6 h-6 text-cyan-400" />,
      title: "2. Tune Glass Controls",
      description: "Fine-tune speed and pitch. Choose from high-fidelity neural voices powered by Gemini AI, or run direct offline browser speech.",
      accent: "from-cyan-500/10 to-cyan-500/0"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-400" />,
      title: "3. Render & Download",
      description: "Click to generate and play your audio in real time. Download high-quality MP3 voiceovers or share on Twitter with one click.",
      accent: "from-rose-500/10 to-rose-500/0"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in duration-500">
      
      {/* Visual Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <Sparkles size={12} className="text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">Seamless Synthesis Journey</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
          How It Works
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          ispeech combines industry-leading AI models with an elegant interface to turn text into crystal-clear natural speech.
        </p>
      </div>

      {/* Grid Steps Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="group relative rounded-2xl bg-black/40 border border-white/5 p-6 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Background Accent glow */}
            <div className={`absolute inset-0 bg-gradient-to-b ${step.accent} rounded-2xl opacity-30 group-hover:opacity-50 transition-all pointer-events-none`} />
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
            
            {idx < 2 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <ArrowRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Showcase Feature Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-black/30 border border-white/5 p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-rose-400 uppercase font-black">AI & OFFLINE POWERHOUSE</span>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-white tracking-tight">Two Cutting-Edge Speech Engines</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-400 leading-relaxed">
            <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
              <h4 className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-indigo-300">
                🚀 GOOGLE GEMINI AI (DEFAULT)
              </h4>
              <p>
                Synthesizes premium, human-realistic text-to-speech utilizing state-of-the-art WaveNet models. Detects stress, pauses, and speech patterns seamlessly.
              </p>
            </div>
            
            <div className="space-y-2 p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
              <h4 className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-emerald-300">
                🌐 OFFLINE BROWSER SYNTHESIS
              </h4>
              <p>
                Direct client-side fallback utilizing native Web Speech Synthesis APIs. Zero request latency, works offline, and processes instantly in the browser.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
