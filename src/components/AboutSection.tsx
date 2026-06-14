import React from 'react';
import { Sparkles, Cpu, Award, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 animate-fade-in duration-500">
      
      {/* 1. Header Container */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <Sparkles size={12} className="text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">A Creative Audio Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
          About Us
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Discover the vision behind ispeech – a minimalist sound sandbox made with premium audio fidelity and zero subscription walls.
        </p>
      </div>

      {/* 2. Our Story - A Small Group of Friends */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-black/30 border border-white/5 p-8 sm:p-10 overflow-hidden shadow-2xl text-left space-y-6">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase font-bold">DEVELOPED BY FRIENDS FOR THE WORLD</span>
          <h2 className="text-2xl font-display font-medium text-white tracking-tight">Our Story: Who is behind ispeech?</h2>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
            ispeech was originally dreamed up and crafted by a <strong className="text-white font-semibold">small, tight-knit group of friends</strong> who share an absolute passion for high-end sound engineering, modern web coding, and clean elegant design.
          </p>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Frustrated by heavy, overpriced monthly subscriptions and clunky TTS set-ups for our own personal creative projects, we decided to band together over a couple of weekends to build our own web-based speech sandbox. Our goal was simple: make voiceovers crystal-clear, instant, limitless, and completely free of subscription walls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">🛠️ Pure Craft</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              We focus purely on precision UI and flawless code, making sure the audio processes smoothly.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">💸 Self-Funded</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              We fund our cloud proxy servers completely out of our own pockets. Ad banners help us keep it scalable.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">🌟 Friendly Vibe</h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              No corporate boards or generic algorithms here. Just friends building cool sound tools for creators.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Core Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        <div className="bg-[#0c0c0e]/80 border border-white/5 rounded-2xl p-5 text-left space-y-3">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-display font-medium text-white text-sm">Neural Audio Engine</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Harnesses advanced Google Gemini voice assets combined with native HTML5 synthesis models to produce flawless global accents.
          </p>
        </div>

        <div className="bg-[#0c0c0e]/80 border border-white/5 rounded-2xl p-5 text-left space-y-3">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-display font-medium text-white text-sm font-semibold">Zero Costs, Direct Saving</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Ditch recurring subscriptions. ispeech offers completely limitless downloads of compiled MP3 high speed segments.
          </p>
        </div>

        <div className="bg-[#0c0c0e]/80 border border-white/5 rounded-2xl p-5 text-left space-y-3">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display font-medium text-white text-sm">Commercial License</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            All downloaded speech tracks are owned completely by you with 100% distribution allowances for advertisements, audio videos, or animations.
          </p>
        </div>

      </div>

    </div>
  );
}
