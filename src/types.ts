export type ModuleId = 
  | 'landing'
  | 'home'
  | 'chat'
  | 'voice'
  | 'coding'
  | 'cyber'
  | 'media'
  | 'edu'
  | 'business'
  | 'community'
  | 'settings';

export interface Module {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'holographic';
  language: string;
  interests: string[];
}
