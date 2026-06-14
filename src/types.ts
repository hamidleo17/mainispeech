export interface VoiceOption {
  id: string;
  name: string; // The official Google TTS name, e.g. "en-US-Neural2-F" ou a browser name
  label: string; // Display name e.g. "Emma (US English, Female, Neural2)"
  languageCode: string;
  type: 'neural' | 'standard' | 'browser';
}

export interface TtsHistoryItem {
  id: string;
  text: string;
  voiceId: string;
  voiceLabel: string;
  speed: number;
  pitch: number;
  audioDataUrl?: string; // Cache locally or keep reference
  timestamp: number;
}

export type ViewType = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | 'blog' | 'faq' | 'how_it_works';

export interface BlogImage {
  url: string;
  caption: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Psychology' | 'Analysis' | 'Tech' | 'Business' | 'Creators';
  readTime: string;
  date: string;
  author: string;
  gradient: string;
  images: BlogImage[];
  graphicConfig: {
    episode: string;
    badgeColor: string;
    avatarUrl: string;
    overlayTitle: string;
    baseGradient: string;
  };
}

