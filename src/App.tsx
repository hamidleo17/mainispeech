import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TtsTool from './components/TtsTool';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import LegalSection from './components/LegalSection';
import FaqSection from './components/FaqSection';
import BlogSection from './components/BlogSection';
import HowItWorksSection from './components/HowItWorksSection';
import CyberMeshBackground from './components/CyberMeshBackground';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setView] = useState<ViewType>('home');
  const [prevView, setPrevView] = useState<ViewType>('home');
  const isDarkMode = true;

  const VIEW_ORDER: ViewType[] = [
    'home',
    'how_it_works',
    'faq',
    'blog',
    'about',
    'contact',
    'privacy',
    'terms',
    'disclaimer'
  ];

  const handleSetView = (newView: ViewType) => {
    setPrevView(currentView);
    setView(newView);
  };

  // Swipe / Drag horizontal gestures to switch from "home" to "how_it_works" and other views
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const isInteractive = (target: EventTarget | null) => {
      if (!target) return false;
      const el = target as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      return tagName === 'input' || 
             tagName === 'textarea' || 
             el.closest('[role="slider"]') || 
             el.closest('button') || 
             el.closest('a') || 
             el.closest('.no-swipe');
    };

    const handleStart = (clientX: number, clientY: number, target: EventTarget | null) => {
      if (isInteractive(target)) return;
      startX = clientX;
      startY = clientY;
      startTime = Date.now();
    };

    const handleEnd = (endX: number, endY: number) => {
      if (!startX || !startY) return;
      
      const diffX = endX - startX;
      const diffY = endY - startY;
      const elapsedTime = Date.now() - startTime;

      startX = 0;
      startY = 0;

      // Ignore slower gestures (longer than 1000ms) or minor horizontal shakes
      if (elapsedTime > 1000 || Math.abs(diffX) < 70) return;
      
      // Horizontal swipe must be dominant over vertical scroll to avoid conflicts
      if (Math.abs(diffX) > Math.abs(diffY)) {
        const clickableViews: ViewType[] = ['home', 'how_it_works', 'faq', 'blog', 'about', 'contact'];
        const currentIdx = clickableViews.indexOf(currentView as any);
        
        if (currentIdx !== -1) {
          if (diffX > 0) {
            // Dragged left of the page to the right (swipe right)
            // Change from home to how_it_works, or sequence forward!
            const nextIdx = (currentIdx + 1) % clickableViews.length;
            handleSetView(clickableViews[nextIdx]);
          } else {
            // Dragged right of the page to the left (swipe left)
            // Sequence backward!
            const prevIdx = (currentIdx - 1 + clickableViews.length) % clickableViews.length;
            handleSetView(clickableViews[prevIdx]);
          }
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      handleStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY, e.target);
    };

    const onMouseUp = (e: MouseEvent) => {
      handleEnd(e.clientX, e.clientY);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [currentView]);

  // Scroll to top on view changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  const prevIndex = VIEW_ORDER.indexOf(prevView);
  const currentIndex = VIEW_ORDER.indexOf(currentView);
  const direction = currentIndex >= prevIndex ? 1 : -1;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir * 180,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: -dir * 180,
      opacity: 0
    })
  };

  return (
    <div className={`min-h-screen relative flex flex-col justify-between overflow-hidden font-sans transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0e0e12] text-gray-100' 
        : 'bg-[#fafafc] text-zinc-900'
    }`}>
      
      {/* BACKGROUND GRAPHIC GLOW EFFECTS WITH BLUE BRANDING & CYBER FLOW MESH */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        
        {/* Soft elegant glowing blue orbs for deep ambient background color depth */}
        <div className={`absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] animate-glow-slow transition-opacity duration-300 ${
          isDarkMode ? 'opacity-25 bg-blue-600/10' : 'opacity-10 bg-blue-400/5'
        }`} />

        <div className={`absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[160px] animate-glow-slow transition-opacity duration-300 ${
          isDarkMode ? 'opacity-30 bg-blue-500/12' : 'opacity-15 bg-blue-400/6'
        }`} style={{ animationDelay: '-3s' }} />

        <div className={`absolute top-[30%] left-[25%] w-[35vw] h-[35vw] rounded-full blur-[140px] animate-glow-slow transition-opacity duration-300 ${
          isDarkMode ? 'opacity-15 bg-indigo-500/10' : 'opacity-5 bg-indigo-400/4'
        }`} style={{ animationDelay: '-5s' }} />

        {/* Looping electrical network flow animation canvas simulating the reference video loop */}
        <CyberMeshBackground />

        {/* Subtle grid pattern overlays */}
        <div className={`absolute inset-0 bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 transition-all ${
          isDarkMode 
            ? 'bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)]'
        }`} />
      </div>

      {/* HEADER NAVIGATION - Matches Floating Pill Image */}
      <Navbar 
        currentView={currentView} 
        setView={handleSetView} 
      />

      {/* MAIN CONTAINER LAYOUT */}
      <main className="flex-grow pt-24 pb-32 sm:pt-28 sm:pb-36 lg:pt-32 lg:pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 space-y-12 select-none overflow-hidden">
        
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentView}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 360, damping: 36 },
              opacity: { duration: 0.22 }
            }}
            className="w-full"
          >
            {/* Render Home specifically with centered single column layout */}
            {currentView === 'home' && (
              <div className="space-y-16 w-full">
                
                {/* Main Application Greeting Header and tool wrapped in centered max-w-4xl */}
                <div className="max-w-4xl mx-auto space-y-8 w-full">

                  {/* Put elements in one elegant centered column box */}
                  <div className="w-full">
                    <TtsTool isDarkMode={isDarkMode} />
                  </div>

                </div>

              </div>
            )}

            {currentView === 'how_it_works' && (
              <HowItWorksSection />
            )}

            {currentView === 'faq' && (
              <FaqSection />
            )}

            {/* View render segments inside dedicated glass boxes */}
            {currentView === 'about' && (
              <AboutSection />
            )}

            {currentView === 'contact' && (
              <ContactSection />
            )}

            {currentView === 'privacy' && (
              <LegalSection initialTab="privacy" />
            )}

            {currentView === 'terms' && (
              <LegalSection initialTab="terms" />
            )}

            {currentView === 'disclaimer' && (
              <LegalSection initialTab="disclaimer" />
            )}

            {currentView === 'blog' && (
              <BlogSection />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* FIXED FOOTER CONTROLLER */}
      <Footer setView={handleSetView} isDarkMode={isDarkMode} />
    </div>
  );
}
