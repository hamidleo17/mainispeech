import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Lock, CheckCircle, Info } from 'lucide-react';

interface LegalSectionProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export default function LegalSection({ initialTab = 'privacy' }: LegalSectionProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  // Sync state if initialTab prop changes externally
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Tab Switcher Controller inside a glass box */}
      <div className="flex justify-center flex-wrap gap-2">
        <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md gap-1">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white/10 text-white border border-white/10 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Privacy Policy</span>
          </button>
          
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white/10 text-white border border-white/10 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-white/10 text-white border border-white/10 shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info size={14} />
            <span>Disclaimer</span>
          </button>
        </div>
      </div>

      {/* Glass Panel Content Card inside a glass box */}
      <div className="glass-panel p-6 sm:p-10 relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 text-gray-300 font-sans text-sm leading-relaxed shadow-xl max-h-[800px] overflow-y-auto">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-[180px] h-[180px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {activeTab === 'privacy' && (
          /* Privacy Policy View */
          <div className="space-y-6 relative z-10 animate-fade-in text-left">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white">Privacy Policy & Privacy Terms</h1>
              <span className="block text-[10px] text-gray-500 font-mono mt-1">LAST UPDATED: JUNE 14, 2026</span>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm">
              At <strong className="text-white">ispeech</strong>, we value transparency, privacy, and digital trust. Since we operate as a public audio-centric utility, our tools are architected to respect user boundaries entirely. Under these comprehensive Privacy Policy terms, we describe how we handle metadata, cookies, security parameters, and how we protect users under modern data directives such as GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), and global cybersecurity guidelines.
            </p>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Lock size={15} className="text-cyan-400" />
                1. Full Personal Data Exclusion Policy
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Unlike traditional high-overhead platforms, ispeech does not require user accounts, signup verification, or email registration. We collect absolutely zero personally identifiable information (PII). When you use our live synth notepad, or utilize your microphone for speech-to-test conversions, your actions remain anonymous. No database traces are connected to your email, IP address, physical location, or real-world credentials. Since we hold no customer register, we cannot sell, rent, license, or disclose your identity to brokers, agencies, or external entities.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <ShieldCheck size={15} className="text-cyan-400" />
                2. Third-Party API Integrations & Core Processing Channels
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Our synthesis engine routes requests to secure cloud processing layers. The detailed data-flow guidelines are as follows:
              </p>
              <div className="pl-4 border-l-2 border-indigo-500/30 space-y-3 text-xs sm:text-sm text-gray-400">
                <p>
                  <strong className="text-white">A. Google Gemini AI Engine:</strong> When synthesizing audio via our AI premium mode, text inputs, voice styles, speed coefficients, and pitch settings are temporarily passed to secure Google Gemini node farms. Google processes these assets in compliance with its enterprise-grade data handling rules. Google does not use raw inputs submitted to our endpoints to train its developer models, and all server data chunks are discarded directly after the output WAV or MP3 stream is completed.
                </p>
                <p>
                  <strong className="text-white">B. Google Cloud Text-to-Speech REST Fallback:</strong> In scenarios where secondary fallback engines are triggered, text sequences are packaged and dispatched to Google Cloud synthesis endpoints. This transaction is governed under Google Cloud's strict enterprise-grade privacy protection compliance.
                </p>
                <p>
                  <strong className="text-white">C. Third-Party Advertisements & Google AdSense:</strong> We display non-intrusive contextual ads to keep our synthetic servers completely free and open for the public. Google and its partner networks use cookies (such as the DART cookie) to optimize and serve adverts based on your visit to this site and other websites on the internet. You can disable personalized advertising or clear advertising identifiers by visiting the official Google Ad Settings portal.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <CheckCircle size={15} className="text-cyan-400" />
                3. Local Caching Capping & On-Device Storage
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Your customizable preferences (such as language selectors, speed sliders (e.g. 1.0x), and pitch tuning parameters) are cached on your local device. Under this protocol, we utilize browser-native <code className="text-fuchsia-400 bg-white/5 px-1 py-0.5 rounded font-mono">localStorage</code> blocks. Similarly, your historic syntheses clips list (retaining the recent 5 track previews) exists purely in local cache memory. No server database is provisioned to catalog your voiceover drafts, which guarantees that your proprietary creative content stays 100% inside your custody. You can purge this data at any moment by clearing your browser's site cookies or utilizing the "Clear History" button inside the audio dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                4. Comprehensive GDPR and CCPA Compliance Disclosures
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Although our systems operate without user profile creation, we remain strictly aligned with global privacy frameworks:
              </p>
              <ul className="list-disc pl-5 text-gray-405 text-xs sm:text-sm space-y-2">
                <li><strong className="text-gray-200">The Right to be Forgotten:</strong> Since we save no personal data files or profiles, you are already entirely forgotten upon closing the browser tab.</li>
                <li><strong className="text-gray-200">The Right of Access:</strong> You hold full command of all data assets since they reside localized inside your browser's storage cache.</li>
                <li><strong className="text-gray-200">No Sale of Personal Assets:</strong> In alignment with California's CCPA guidelines, we affirm that we never sell user data parameters, nor do we track profiles for monetization.</li>
                <li><strong className="text-gray-200">Children's Privacy Protection (COPPA):</strong> Because ispeech is generic and collects absolutely zero registration data, we fulfill all strict requirements of COPPA. No kids' profiles are ever stored on our systems.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                5. Continuous Security Measures & Server Audio Hardening
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Our production runs securely on top-tier cloud architecture with strict SSL/HTTPS encryption protocols active. All data packets dispatched between the client browser and our proxy servers are encrypted in transit using industry-standard TLS 1.3 algorithms. This prevents man-in-the-middle attacks or script sniffing when generating voice pieces. We continuously audit our system hooks to guarantee that our servers remain safe, highly stable, and impervious to external threats.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-gray-500">
              <p>For more details on how Google handles cloud API queries, feel free to inspect the official <a href="https://policies.google.com/privacy" className="text-cyan-400 hover:underline mx-1" target="_blank" rel="noopener noreferrer">Google Privacy Framework</a>. Our team remains dedicated to keeping your creative flow 100% private and protected.</p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          /* Terms of Service View */
          <div className="space-y-6 relative z-10 animate-fade-in text-left">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white">Terms of Service & Usage Guidelines</h1>
              <span className="block text-[10px] text-gray-500 font-mono mt-1">LAST UPDATED: JUNE 14, 2026</span>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm">
              Welcome to <strong className="text-white">ispeech</strong>. Under these extensive Terms of Service, we establish a binding legal agreement governing your access to and utilization of our public synthesis applications, script generators, neural speech-to-text models, and local browser engines. By accessing or interacting with our tool, you unconditionally agree to fulfill all instructions and accept the terms detailed herein.
            </p>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                1. Acceptable Use, Fair Quotas & Abuse Safeguards
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Our server-based speech synthesis delivers premium, human-like voice outputs completely free of charge. To ensure uniform speed and open accessibility for everyone, you agree to abide by our strict fair usage caps:
              </p>
              <ul className="list-disc pl-5 text-gray-405 text-xs sm:text-sm space-y-2">
                <li><strong className="text-gray-200">Character Thresholds:</strong> Single text submissions must stay within our maximum limit of 10,000 characters.</li>
                <li><strong className="text-gray-200">No Programmatic Scraping or Bots:</strong> You are strictly forbidden from connecting headless scrapers, API crawlers, cURL scripts, automated bots, or batch generators to our proxy server routes.</li>
                <li><strong className="text-gray-200">No Denial of Service Actions:</strong> Initiating heavy load triggers, spam requests, or brute-forcing workflows intended to degrade system responsiveness or deplete Google Cloud/Gemini project budgets will lead to automatic, permanent blocks.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                2. Licensing, Commercial Rights & Content Ownership
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Unlike competitive premium audio software, ispeech enforces no ownership claims over your generated voiceovers:
              </p>
              <p className="text-gray-400 text-xs sm:text-sm">
                All intellectual property, commercial copyrights, distribution rights, and audio properties of the WAV/MP3 files you synthesize belong entirely to <strong className="text-white">you, the creator</strong>. ispeech reserves no loyalty claims, residuals requests, or royalty requirements. You can freely integrate our voice tracks into monetize-enabled YouTube videos, personal or enterprise and corporate commercials, audiobooks, podcasts, video games, animations, and other online distribution assets.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                3. Prohibited Content & Malicious Voice Misuse
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                You agree that you will not submit texts or generate audio clips containing:
              </p>
              <ul className="list-disc pl-5 text-gray-455 text-xs sm:text-sm space-y-2">
                <li>Legal threats, targeted hate speech, defamatory scripts, or files designed to bully, harass, or verbally abuse specific real individuals.</li>
                <li>Cloned deepfake segments mimicking political figures, private citizens, or celebrities to spread disinformation, commit fraud, or misrepresent events.</li>
                <li>Synthesized phish blocks or phone scams aimed at mimicking bank officials or safety services to extract sensitive private data from unsuspecting people.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                4. Server Uptime & "As-Is" Service Guarantee
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                This app is developed and hosted as a free utility. Consequently, the platform is provided on an <strong className="text-white">"As-Is"</strong> and <strong className="text-white">"As-Available"</strong> basis. We make no guarantees regarding unbroken uptime, speed, database longevity, or voice synthesis availability. If service quotas expire or under high-demand periods, the server synthesis might pause temporarily. In such situations, users are advised to switch to the "Browser Built-In" engine built right into the interface.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-display font-bold text-white">
                5. Complete Indemnification Clause
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                By interacting with ispeech, you agree to fully indemnify, defend, and hold harmless ispeech, its builders, core creators, friends, and hosting affiliates against any and all claims, damages, court fees, or financial liabilities resulting from how you utilize our synthesized audio tracks or your non-compliance with these Terms.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          /* Disclaimer View */
          <div className="space-y-6 relative z-10 animate-fade-in text-left">
            <div className="border-b border-white/10 pb-4">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white">Platform Disclaimer & Liability Limitations</h1>
              <span className="block text-[10px] text-gray-500 font-mono mt-1">LAST UPDATED: JUNE 14, 2026</span>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm">
              Please review this legal platform disclaimer closely. Under these statements, we clarify and limit our legal footprint regarding service distributions, synthesized content, similar vocal traces, and, most importantly, user accountability.
            </p>

            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <h2 className="text-sm font-display font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  ⚠️ CRITICAL DISCLAIMER: ZERO LIABILITY FOR MISUSE OF VOICE COMPILATIONS
                </h2>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">We are not going to be responsible or legally liable in any capacity for any misuse of these generated voices.</strong> This platform is designed strictly as a productive, human-centric visual/audio tool for legitimate, legal, creative, educational, entertainment, and marketing purposes. 
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  If any individual, script, or automated tool uses our voice engines to compile malicious audio blocks, commit bank fraud, impersonate private citizens or public figures, spread deep-fake propaganda, propagate fake news, defame characters, complete phishing calls, or engage in any form of cyber-harassment, the sole legal and criminal accountability remains occupied <strong className="text-white">entirely by the user who submitted the text script</strong>. 
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  Our systems represent a highly generic pipeline translating text to speech. We do not edit, pre-screen, verify, or own the context of user-entered texts. Thus, we reject all structural liability, class-action liabilities, and police-related legal responsibilities stemming from malicious user-side actions.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-display font-bold text-white">
                  1. Natural Voice Similarity Disclaimer
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Our neural voices are synthesized by sophisticated mathematical deep-learning networks. Because these speech curves model generic accents and human tones, you acknowledge that any natural similarity or voice resemblance to real-life actors, voice actors, media characters, celebrities, or living individuals is completely coincidental. ispeech represents no intent to clone or violate publicity rights of private performers, and rejects any claims based on similar vocal timbers or phonetic profiles occurring naturally.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-display font-bold text-white">
                  2. Performance, API Quotas & Outages Disclaiming
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  We render synthesized audio utilizing Google APIs, external servers, and client browsers. We provide no legal warranty that our voice compilation will be free of transcription typos, pronunciation anomalies, or temporary outages. ispeech disclaims any responsibility for damages resulting from missed commercial deadlines, lost marketing opportunities, website load failures, or lost revenue caused by system downtime or API exhaustion.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-display font-bold text-white">
                  3. Use of Speech-to-Speech Modifications
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  The Speech-to-Text and Speech-to-Speech transcribers on this site process standard audio data feeds. If phonetic translations or voice inputs capture incorrect words or generate transcription errors, users hold full command to manually re-author, rewrite, and fix those errors in the provided interactive text blocks. Users hold full responsibility for validating the text is accurate and compliant before downloading any derived track.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-display font-bold text-white">
                  4. Dynamic Service Adjustments
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  The creators of ispeech hold free permissions to scale down, update, adjust, modify, or shut off parts of the application or its voice lists at any time without prior notifications. By continuing to generate sound tracks here, you explicitly agree to these limitations and accept utilizing the site solely at your own legal risk.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
