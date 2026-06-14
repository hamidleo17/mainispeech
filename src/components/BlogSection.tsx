import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  User, 
  Tag, 
  Sparkles,
  TrendingUp,
  Share2,
  ChevronDown,
  Mail,
  UserCheck
} from 'lucide-react';

import { BlogPost } from '../types';
import { blogPosts } from '../blogData';

export default function BlogSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Reading Progress State mimicking screenshot
  const [scrollProgress, setScrollProgress] = useState(3);
  
  useEffect(() => {
    if (!selectedPostId) {
      setScrollProgress(3);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = docHeight - winHeight > 0 
        ? Math.round((scrollTop / (docHeight - winHeight)) * 100) 
        : 3;
      
      setScrollProgress(Math.min(100, Math.max(3, scrollPercent)));
    };

    // Initial run
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [selectedPostId]);
  
  // Newsletter state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = ['All', 'Psychology', 'Analysis', 'Tech', 'Business', 'Creators'];

  // Filter conditions
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activePost = blogPosts.find(p => p.id === selectedPostId);

  // Latest post is the first matched post (or hardcoded primary one)
  const latestPost = blogPosts[0];
  // Editor's picks are indices 1, 2, 3
  const editorsPicks = blogPosts.slice(1, 4);

  // Reusable custom graphic component using one of the five post's actual photos for premium visual background cover
  const renderGraphicBanner = (post: BlogPost, size: 'large' | 'small' | 'card') => {
    const config = post.graphicConfig;
    const bannerImgUrl = post.images && post.images.length > 0 ? post.images[0].url : config.avatarUrl;
    
    if (size === 'large') {
      return (
        <div className="relative w-full aspect-[21/10] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-lg flex items-end p-6 sm:p-10 group-hover:border-indigo-500/30 transition-all duration-300">
          {/* Real actual background image from the post - full bleed */}
          <img 
            src={bannerImgUrl} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 opacity-60" 
            referrerPolicy="no-referrer" 
          />
          {/* Custom vignette & modern dark gradient overlay for deep legibility */}
          <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
          
          <div className="w-[85%] space-y-2.5 relative z-10 text-left">
            <span className={`inline-block text-[9px] font-mono tracking-wider text-white font-black px-2.5 py-1 rounded ${config.badgeColor}`}>
              {config.episode}
            </span>
            <h2 className="text-base sm:text-lg md:text-xl font-display font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {post.title}
            </h2>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-bold">ispeech blog</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="text-[10px] text-zinc-400">{post.readTime}</span>
            </div>
          </div>
        </div>
      );
    }

    if (size === 'small') {
      return (
        <div className="relative w-28 h-20 sm:w-32 sm:h-22 shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-white/10 shadow flex items-end p-2 pointer-events-none">
          {/* Background Image */}
          <img 
            src={bannerImgUrl} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="w-full space-y-0.5 relative z-10 text-left">
            <span className="text-[6px] font-mono font-black text-cyan-400 block tracking-widest uppercase">{config.episode}</span>
            <h3 className="text-[9px] font-display font-extrabold text-white leading-tight line-clamp-2">
              {post.title}
            </h3>
          </div>
        </div>
      );
    }

    // Default card layout
    return (
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 flex items-end p-4 group-hover:border-indigo-500/20 transition-all duration-300 overflow-hidden">
        {/* Real background photo used for homepage card backdrop */}
        <img 
          src={bannerImgUrl} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-60" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />

        <div className="w-full space-y-1.5 relative z-10 text-left">
          <span className={`inline-block text-[7px] font-mono tracking-wider text-white font-heavy px-1.5 py-0.5 rounded ${config.badgeColor}`}>
            {config.episode}
          </span>
          <h4 className="text-[11px] sm:text-xs font-display font-extrabold text-white leading-tight line-clamp-2">
            {post.title}
          </h4>
        </div>
      </div>
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setFirstName('');
        setLastName('');
        setEmail('');
      }, 4000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 text-left">
      
      {/* HEADER SECTION IN CASE OF LIST VIEW */}
      {!selectedPostId ? (
        <>
          {/* Elegant header left-aligned exactly like Agorapulse blog mockups */}
          <div className="text-left space-y-2 pb-2 border-b border-white/5">
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white capitalize leading-none">
              ispeech Blog
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
              The best tips, tricks & news about AI audio generation, neural voice synthesizers, and video content marketing.
            </p>
          </div>

          {/* LATEST POST */}
          <div className="pt-2">
            
            {/* Latest Post */}
            <div className="space-y-3 text-left">
              <h2 className="text-xs font-mono font-black tracking-widest text-fuchsia-400 uppercase">
                ⚡ LATEST POST
              </h2>
              <article 
                onClick={() => setSelectedPostId(latestPost.id)}
                className="group cursor-pointer space-y-4"
              >
                {/* Large horizontal banner cover graphic */}
                {renderGraphicBanner(latestPost, 'large')}

                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {latestPost.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {latestPost.excerpt}
                  </p>
                  
                  {/* Author and modified date row aligned exactly like screenshot */}
                  <div className="flex items-center justify-between pt-2 text-[10px] sm:text-[11px] font-mono text-zinc-500">
                    <span className="font-bold flex items-center gap-1.5 text-zinc-400">
                      By {latestPost.author}
                    </span>
                    <span>Last modified {latestPost.date}</span>
                  </div>
                </div>
              </article>
            </div>

          </div>

          {/* FILTERS & SEARCH ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 pb-4 border-t border-b border-white/5 relative z-20">
            {/* Filters component matching "Filters All v" dropdown exactly */}
            <div className="flex items-center gap-2 relative">
              <span className="text-xs text-gray-500 font-mono">Filters</span>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/20 text-xs text-white font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Category: <span className="text-cyan-400">{selectedCategory}</span>
                <ChevronDown size={12} className={`text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter List Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-[110%] left-0 w-44 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md shadow-2xl p-1.5 space-y-1 z-30">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left text-[11px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right-aligned Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-450" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/40 placeholder-zinc-500 transition-all font-sans"
              />
            </div>
          </div>

          {/* GRID OF OTHER REMAINING POSTS */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`glass-panel p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-cyan-500/20 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between text-left relative overflow-hidden group`}
                >
                  <div className="space-y-4 relative z-10">
                    {/* Visual custom graphic banner exactly on top */}
                    {renderGraphicBanner(post, 'card')}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Tag size={9} />
                          {post.category}
                        </span>
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="font-display font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-5 relative z-10 text-[10px] font-mono text-zinc-500">
                    <span className="font-bold text-zinc-400">By {post.author}</span>
                    <span>Last modified {post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-16 rounded-3xl border border-white/5 bg-black/30 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-gray-600 mx-auto animate-pulse" />
              <div>
                <p className="text-sm text-gray-300 font-semibold">No insights matches your filters</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting your search query or categorical options.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        /* BLOG POST FULL-SCREEN READING MODE */
        <article className="space-y-8 animate-fade-in text-left">
          {/* Back Action Header */}
          <button
            onClick={() => setSelectedPostId(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white font-mono bg-zinc-900 border border-white/5 hover:border-white/10 px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
          >
            <ArrowLeft size={13} /> BACK TO NEWSFEED
          </button>

          {activePost && (
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/5 bg-black/40 relative overflow-hidden space-y-8 shadow-2xl">
              <div className={`absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b ${activePost.gradient} filter blur-3xl pointer-events-none opacity-50`} />

              {/* Title Section matching the screenshot precisely */}
              <div className="space-y-4 relative z-10">
                <h1 className="font-sans font-black text-2xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
                  {activePost.title}
                </h1>
                
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                  {activePost.excerpt}
                </p>

                {/* Author profile row matching screenshot */}
                <div className="flex items-center gap-2.5 pt-2 text-xs sm:text-sm text-zinc-400">
                  <img 
                    src={activePost.graphicConfig.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                    alt={activePost.author} 
                    className="w-8 h-8 rounded-full object-cover border border-white/10" 
                    referrerPolicy="no-referrer" 
                  />
                  <div>
                    By <span className="text-blue-500 font-bold hover:underline cursor-pointer">{activePost.author}</span>
                    <span className="mx-2 text-zinc-600">•</span>
                    Updated {activePost.date}
                    <span className="mx-2 text-zinc-600">•</span>
                    <span>{activePost.readTime}</span>
                  </div>
                </div>

                {/* Blue Reading Progress indicator matching screenshot */}
                <div className="pt-4 space-y-1.5 border-b border-white/5 pb-6">
                  <div className="relative w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-200"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-zinc-500 text-right">
                    {scrollProgress}% Complete
                  </div>
                </div>
              </div>

              {/* Primary large image placed right under progress bar matching the image layout */}
              <div className="space-y-2 relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[21/10] bg-zinc-950">
                <img 
                  src={activePost.images[0].url} 
                  alt={activePost.images[0].caption} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 top-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-zinc-400">
                  {activePost.images[0].caption}
                </div>
              </div>

              {/* INTEGRATED GORGEOUS IMAGES - Exactly 5 high-fidelity figures placed on the left side of contents */}
              <div className="space-y-10 text-gray-300 font-sans text-xs sm:text-sm leading-relaxed max-w-4xl relative z-10">
                {activePost.content.map((paragraph, index) => {
                  // If standard section divider/header
                  if (paragraph.startsWith('---') && paragraph.endsWith('---')) {
                    const cleanHeader = paragraph.replace(/---/g, '').replace(/SECTION \d+:/g, '').trim();
                    return (
                      <div key={`section-h-${index}`} className="pt-8 pb-3 border-t border-white/5 mt-8 first:mt-0 first:border-0">
                        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">DEEP EXPLORATION</span>
                        <h2 className="font-sans font-black text-lg sm:text-2xl text-white tracking-tight mt-1">
                          {cleanHeader}
                        </h2>
                      </div>
                    );
                  }

                  // Non-header segment: Display image on specific index so we show exactly 5 unique images total
                  // Banner = post.images[0]
                  // index 2 = post.images[1]
                  // index 6 = post.images[2]
                  // index 11 = post.images[3]
                  // index 16 = post.images[4]
                  const imagePositions: Record<number, number> = { 2: 1, 6: 2, 11: 3, 16: 4 };
                  const imageIdx = imagePositions[index];
                  const hasImage = imageIdx !== undefined && activePost.images && activePost.images[imageIdx];
                  const imageObj = hasImage ? activePost.images[imageIdx] : null;

                  return (
                    <div key={`segment-${index}`} className="group/item flex flex-col space-y-3.5 p-2 transition-all duration-305">
                      {/* Segment Title */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight font-sans">
                          {hasImage ? `Key Analysis Phase #${imageIdx + 1}` : `Insight Segment #${index + 1}`}
                        </h3>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                          {hasImage ? 'Acoustic Visual' : 'Narrative Insight'}
                        </span>
                      </div>

                      {/* Content Layout */}
                      {hasImage ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-1">
                          {/* Styled Image Column (Exactly 5 unique items shown) */}
                          <div className="md:col-span-5 relative group/img overflow-hidden rounded-xl border border-white/10 hover:border-blue-500/30 shadow-lg transition-all duration-305">
                            <div className="aspect-[4/3] bg-zinc-950 overflow-hidden relative">
                              <img 
                                src={imageObj.url} 
                                alt={imageObj.caption} 
                                className="w-full h-full object-cover group-hover/img:scale-[1.04] transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                              <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none group-hover/img:border-blue-500/20 transition-all duration-300" />
                              
                              <span className="absolute top-2 left-2 text-[8px] font-mono font-black tracking-widest text-white px-2 py-1 rounded bg-[#3b82f6]">
                                FIG {imageIdx + 1}
                              </span>

                              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                <p className="text-[9px] font-mono text-zinc-300 leading-tight bg-zinc-950/80 border border-white/5 px-2 py-1.5 rounded-lg drop-shadow-md">
                                  {imageObj.caption}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Text Column */}
                          <div className="md:col-span-7 space-y-2 text-left">
                            {paragraph.startsWith('• ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') ? (
                              <p className="font-semibold text-white pl-3.5 leading-relaxed text-xs sm:text-sm pt-0.5">
                                {paragraph}
                              </p>
                            ) : (
                              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                                {paragraph}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Simple, premium full-width typography (Medium / Substack style) for standard paragraphs */
                        <div className="space-y-2 text-left w-full">
                          {paragraph.startsWith('• ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') ? (
                            <p className="font-semibold text-white pl-4 leading-relaxed text-xs sm:text-sm">
                              {paragraph}
                            </p>
                          ) : (
                            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                              {paragraph}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* RECOMMENDED OTHER POSTS / BLOG SWITCHER SECTOR */}
              {(() => {
                const otherPosts = blogPosts.filter(p => p.id !== activePost.id).slice(0, 3);
                return (
                  <div className="pt-10 border-t border-white/5 space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-blue-400 tracking-widest uppercase">
                        CONTINUE READING
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {otherPosts.length} other insights available
                      </span>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-bold font-display text-white tracking-tight text-left">
                      Switch to another insight block:
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {otherPosts.map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => {
                            setSelectedPostId(post.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group p-5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-400 uppercase">
                              {post.category}
                            </span>
                            <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-normal">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-zinc-500 pt-3 border-t border-white/[0.03] mt-auto">
                            <span>By {post.author}</span>
                            <span className="text-blue-400 group-hover:underline flex items-center gap-1">
                              READ NOW →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Footer Author signature box */}
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex gap-4 items-center text-left relative z-10">
                <TrendingUp size={20} className="text-cyan-400 shrink-0" />
                <p className="text-[11px] text-zinc-400">
                  Enjoying these insights? ispeech is dedicated to expanding the scope of free speech assets. Click <strong className="text-cyan-400 hover:underline cursor-pointer" onClick={() => setSelectedPostId(null)}>Back to Newsfeed</strong> or navigate to the <strong className="text-cyan-400 hover:underline cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Speech synthesis toolbox</strong> to convert your drafts now.
                </p>
              </div>

            </div>
          )}
        </article>
      )}

    </div>
  );
}
