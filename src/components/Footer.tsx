import React from 'react';
import { ViewType } from '../types';

interface FooterProps {
  setView: (view: ViewType) => void;
  isDarkMode: boolean;
}

export default function Footer({ setView, isDarkMode }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative mt-24 border-t border-white/5 pt-16 pb-10 z-10 select-none transition-colors duration-300 ${
      isDarkMode ? 'bg-black/40 backdrop-blur-md' : 'bg-black'
    }`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-12">
        
        {/* Three Columns Sitemap layout requested */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-left">
          
          {/* Column 1: Use Cases & logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1.5">
              {isDarkMode && (
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-[2.2px] h-4 justify-center">
                    <div className="w-[2.2px] h-[6px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                    <div className="w-[2.2px] h-[14px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                    <div className="w-[2.2px] h-[11px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }} />
                    <div className="w-[2.2px] h-[14px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                    <div className="w-[2.2px] h-[4px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                </span>
              )}
              <span className={`font-display font-black text-sm uppercase tracking-wider ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent' 
                  : 'text-black'
              }`}>
                ispeech
              </span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                AI Voice Capabilities
              </h3>
            </div>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => setView('blog')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider font-display ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setView('about')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('privacy')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('terms')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setView('disclaimer')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Get in touch */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider font-display ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              Get in touch
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => setView('contact')}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer text-left block ${
                    isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-black hover:text-black'
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Base Attribution Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="flex items-center space-x-2">
            {isDarkMode && (
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-[1.5px] h-[10px] justify-center">
                  <div className="w-[1.5px] h-[5px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.1s' }} />
                  <div className="w-[1.5px] h-[10px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.3s' }} />
                  <div className="w-[1.5px] h-[8px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.5s' }} />
                  <div className="w-[1.5px] h-[10px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.2s' }} />
                  <div className="w-[1.5px] h-[3px] bg-white rounded-full animate-wave-bar" style={{ animationDelay: '0.4s' }} />
                </div>
              </span>
            )}
            <span className={`font-display font-black text-sm uppercase tracking-wider ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent' 
                : 'text-black'
            }`}>
              ispeech
            </span>
          </div>

          <div className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-black'}`}>
            © 2020s All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
