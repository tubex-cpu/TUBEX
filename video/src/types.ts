export type IconName = 'hydra' | 'jellyfish' | 'bird' | 'brain' | 'dna' | 'moon';

export type Layout = 'title' | 'duo' | 'fact' | 'summary' | 'outro';

export type SideState = {caption?: string};

export type Character = {
  name: string;
  label: string;
  tone?: 'warm' | 'cool' | 'neutral';
  build?: 'slim' | 'round' | 'child' | 'adult';
};

export type Scene = {
  id: string;
  seconds: number;
  icon?: IconName;
  layout?: Layout;
  chapter?: string;
  left?: SideState;
  right?: SideState;
  kicker: string;
  headline: string;
  body?: string;
  bigNumber?: string;
  source?: string;
  narration: string;
  audio?: string;
  credit?: string;
};

export type EpisodeScript = {
  episodeId: string;
  fps: number;
  title: string;
  series?: string;
  characters?: {left: Character; right: Character};
  thumbnail: {
    line1: string;
    line2: string;
    sub: string;
    icon: IconName;
  };
  bgm?: string;
  scenes: Scene[];
};

export const theme = {
  bg1: '#0b1030',
  bg2: '#1d2a6b',
  accent: '#ffd23f',
  text: '#ffffff',
  sub: '#c9d1ff',
  pink: '#ff6fae',
};

export const fontBody = '"Noto Sans JP", sans-serif';
export const fontDisplay = '"Dela Gothic One", "Noto Sans JP", sans-serif';
