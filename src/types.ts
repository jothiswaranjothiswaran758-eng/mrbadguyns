export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  image: string;
  accentColor: string;
  links: { label: string; url: string }[];
}

export interface BreathingMode {
  id: string;
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface SavedSketch {
  id: string;
  dataUrl: string;
  timestamp: string;
}
