// ルール改変ニッポン brand (channels/if-okane/01_brand_brief.md): navy / vermilion / white, a little gold for money
export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const FONT = '"Noto Sans JP", "Noto Sans CJK JP", sans-serif';
export const C = {
  navy: '#0F1B2D',
  navy2: '#16263f',
  navy3: '#22385a',
  red: '#E53935',
  white: '#FFFFFF',
  paper: '#F4F1EA',
  gold: '#F2C14E',
  sky: '#7cc4f2',
  gray: '#9aa6b8',
  ink: '#0F1B2D',
};
// labels shown at the top left (03_plan.md): 事実 / 前提 / 計算 / 推論 / 参考例 / 反例
export const TAG: Record<string, {bg: string; fg: string}> = {
  事実: {bg: '#FFFFFF', fg: '#0F1B2D'},
  前提: {bg: '#F2C14E', fg: '#0F1B2D'},
  計算: {bg: '#d9c48a', fg: '#0F1B2D'},
  推論: {bg: '#7cc4f2', fg: '#0F1B2D'},
  参考例: {bg: '#9aa6b8', fg: '#0F1B2D'},
  反例: {bg: '#E53935', fg: '#FFFFFF'},
};
