import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ViewType } from '../types';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function Navbar({ currentView, setView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; view: ViewType }[] = [
    { label: 'Home', view: 'home' },
    { label: 'How It Works', view: 'how_it_works' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Blog', view: 'blog' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' }
  ];

  const handleNavClick = (view: ViewType) => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6 lg:px-8">
      {/* Floating reflected-glass pill capsule matching the background */}
      <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-2 px-5 sm:px-6 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center justify-between h-11">
          
          {/* Logo / Brand - Style matching the DC circle badge */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="group flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-[0_8px_24px_-8px_oklch(0.65_0.22_300/0.6)] transition-transform group-hover:scale-105">
              <div className="flex items-center gap-[2.5px] h-4 justify-center">
                <div className="w-[2.5px] h-2 bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-[2.5px] h-4 bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                <div className="w-[2.5px] h-3 bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }} />
                <div className="w-[2.5px] h-4 bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-[2.5px] h-[6px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
              </div>
            </span>
            <span className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                ispeech
              </span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-white text-black font-display shadow-md'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Glass capsule matching header) */}
      {isOpen && (
        <div className="md:hidden mt-2 max-w-4xl mx-auto rounded-3xl bg-black/85 backdrop-blur-xl border border-white/10 p-3 shadow-lg animate-fade-in">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`block w-full text-left px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                    active
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
