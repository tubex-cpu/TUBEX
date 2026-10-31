export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const FONT = '"Noto Sans CJK JP", "Noto Sans JP", "IPAGothic", sans-serif';
export const C = {
  ink: '#0b1020',
  panel: '#121a2e',
  grid: 'rgba(160,180,220,0.08)',
  text: '#eef2fb',
  sub: '#9fb0d0',
  sleep: '#6fa8dc', // normal sleep group
  wake: '#e8a04c', // sleep-deprived group
  amyg: '#ff7a59',
  pfc: '#7fd1c7',
  warn: '#ffd166',
};
export const sec = (s: number) => Math.round(s * FPS);
