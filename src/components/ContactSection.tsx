import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // Custom contact submission flow (e.g. Formspree or serverless mockup endpoint)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Simulate/Trigger submission
      // In production, the user replaces this with their exact formspree URL:
      // await fetch("https://formspree.io/f/YOUR_ENDPOINT", { ... })
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-white mb-2 leading-tight">
          Get in Touch
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          Have feedback, queries, or feature requests? Reach out and we will respond shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Support details - left side */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0c0c0e]/90 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between h-full backdrop-blur-2xl shadow-2xl">
            <div className="space-y-6">
              <h2 className="text-lg font-bold font-display text-white">
                Contact Details
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Our tools are crafted to be fast and maintenance-free. If you run into character limit issues, server quota problems, or have suggestions for new voices, please alert us.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-mono">SUPPORT EMAIL</span>
                    <a href="mailto:18hamidboss@gmail.com" className="hover:text-cyan-400 text-sm font-medium transition-colors">
                      18hamidboss@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-mono">RESPONSE TIME</span>
                    <span className="text-sm font-medium text-gray-300">
                      Within 24-48 working hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-[11px] text-gray-500">
              <span className="font-mono text-cyan-500/70 block uppercase tracking-wider font-semibold">Ad Support Disclaimer</span>
              This tool remains completely free through AdSense revenue. We appreciate your ethical support.
            </div>
          </div>
        </div>

        {/* Contact Form - right side */}
        <div className="md:col-span-3">
          <div className="bg-[#0c0c0e]/90 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
            <h2 className="text-lg font-bold font-display text-white mb-6">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-mono" htmlFor="contact-name">
                  YOUR NAME
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Carter"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder-gray-600 transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-mono" htmlFor="contact-email">
                  YOUR EMAIL
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder-gray-600 transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-mono" htmlFor="contact-message">
                  MESSAGE
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you think or describe an issue..."
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none placeholder-gray-600 transition-all resize-none font-sans"
                />
              </div>

              {/* Status Message */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl text-xs sm:text-sm">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Thank you! Your message was sent successfully.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-xs sm:text-sm">
                  <AlertTriangle size={16} className="text-rose-400" />
                  <span>Please fill out all credentials or try again later.</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 border border-white/10 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
