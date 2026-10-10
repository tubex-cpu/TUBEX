export type IconName = 'hydra' | 'jellyfish' | 'bird' | 'brain' | 'dna' | 'moon';

export type Scene = {
  id: string;
  seconds: number;
  icon: IconName;
  kicker: string;
  headline: string;
  body?: string;
  bigNumber?: string;
  source?: string;
  narration: string;
};

export type EpisodeScript = {
  episodeId: string;
  fps: number;
  title: string;
  thumbnail: {
    line1: string;
    line2: string;
    sub: string;
    icon: IconName;
  };
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
