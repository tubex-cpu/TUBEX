export type IconName = 'hydra' | 'jellyfish' | 'bird' | 'brain' | 'dna' | 'moon';

export type Layout = 'title' | 'duo' | 'fact' | 'summary' | 'outro';

export type SideState = {caption?: string};

export type Character = {
  name: string;
  label: string;
  tone?: 'warm' | 'cool' | 'neutral';
  build?: 'slim' | 'round' | 'child' | 'adult';
  hair?: 'short' | 'long';
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

export type ThumbProp = 'plate-big' | 'plate' | 'toast' | 'coffee' | 'phone' | 'book' | 'shout' | 'talk' | 'family' | 'none';

export type ThumbDraft = {
  id: string;
  line1: string;
  line2?: string;
  highlight?: string; // この語だけ強調色
  highlightColor?: 'red' | 'yellow';
  composition?: 'bottom' | 'center' | 'top';
  badge?: string; // 時計・年齢（例："7:00"、"15歳"）
  leftMood?: 'warm' | 'cool' | 'dim';
  rightMood?: 'warm' | 'cool' | 'dim';
  leftFace?: 'happy' | 'neutral' | 'worried' | 'shocked' | 'sad' | 'proud';
  rightFace?: 'happy' | 'neutral' | 'worried' | 'shocked' | 'sad' | 'proud';
  leftArm?: 'down' | 'hold' | 'raise';
  rightArm?: 'down' | 'hold' | 'raise';
  leftProp?: ThumbProp;
  rightProp?: ThumbProp;
  leftImage?: string; // video/public からの相対パス（画像生成・無料写真。06c_thumbnail_assets.md に記録）
  rightImage?: string;
  note?: string;
  [key: string]: unknown;
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
  thumbnailDrafts?: ThumbDraft[];
  draft?: ThumbDraft;
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
