import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// 見出し用（法廷らしい明朝）と字幕用（読みやすいゴシック）
// public/fonts のフォントは scripts/subset-fonts.py で使用文字だけに絞ったもの
export const minchoFamily = 'Shippori Mincho B1';
export const gothicFamily = 'Zen Kaku Gothic New';

loadFont({family: minchoFamily, url: staticFile('fonts/ShipporiMinchoB1-ExtraBold.woff2'), weight: '800'});
loadFont({family: gothicFamily, url: staticFile('fonts/ZenKakuGothicNew-Bold.woff2'), weight: '700'});
loadFont({family: gothicFamily, url: staticFile('fonts/ZenKakuGothicNew-Black.woff2'), weight: '900'});

// 「閉園後の法廷」：夜の藍色、木の法壇、金の装飾、粘土板の土色
export const colors = {
	night: '#0b1222',
	nightLight: '#1a2744',
	wood: '#5a3a24',
	woodLight: '#7d5536',
	gold: '#e2bb63',
	goldSoft: '#f3dc9c',
	clay: '#c98b5a',
	clayDark: '#8d5a36',
	paper: '#f4ecdc',
	ink: '#1b1712',
	text: '#f7f2e6',
	muted: '#a9b3c7',
	reed: '#7fa35b',
	correct: '#e94b3c',
	half: '#f0a830',
	wrong: '#3d8ee8',
	japan: '#e8546b',
	sumer: '#e2bb63',
} as const;

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
