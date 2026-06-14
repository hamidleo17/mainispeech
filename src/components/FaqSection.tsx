import React, { useState } from 'react';
import { HelpCircle, Plus } from 'lucide-react';

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does ispeech keep voiceovers completely free?",
      a: "Our system combines cutting-edge Google Gemini AI and built-in browser neural pathways with extremely minimalist caching. Over half of our requests compile on your device natively which keeps resource footprints tiny, allowing us to keep everything free from subscription blocks."
    },
    {
      q: "What is the maximum character limit?",
      a: "You can convert up to 10,000 characters per single session. You can compile multiple paragraphs sequentially and download as many high-fidelity voice tracks as your creative projects require."
    },
    {
      q: "Are the downloaded voice files copyright-free?",
      a: "Yes. You maintain full ownership, licensing parameters, and intellectual distribution rights of all downloaded audio configurations. You can use them for commercial projects, YouTube channel uploads, ad pieces, and paid audiobooks with no royalty requirements."
    },
    {
      q: "Does it support Subtitles conversion?",
      a: "Absolutely! Simply click on the Subtitles tab in the navbar or explore our core tools. You can upload any standard subtitle files to synthesize individual speaker lines."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-2 px-4 space-y-6 animate-fade-in" id="faq-section-container">
      
      {/* 5. INTERACTIVE FAQ ACCORDION SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-[9px] font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3 h-3" /> FAQs & Answers
          </div>
          
          {/* Extremely decreased upper text size per user request */}
          <h2 className="font-display font-bold text-base sm:text-lg tracking-tight text-white capitalize">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto text-[10px] leading-snug">
            Get instant answers regarding voiceovers, files ownership, and character limits.
          </p>
        </div>

        <div className="space-y-2 text-left pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="glass-panel flex flex-col rounded-xl border border-white/5 bg-black/40 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between text-white hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-xs font-semibold tracking-tight">
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-lg bg-zinc-800 transition-transform duration-300 ${isOpen ? 'rotate-45 text-blue-400' : 'text-gray-400'}`}>
                    <Plus size={10} />
                  </div>
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out px-4 text-xs text-gray-400 leading-relaxed ${
                    isOpen ? 'pb-4 max-h-[160px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="text-[11px] text-gray-400 leading-normal">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
