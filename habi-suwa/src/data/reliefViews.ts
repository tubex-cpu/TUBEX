// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	shonai: {lon0: 138.35000, lon1: 141.55000, lat0: 39.06227, lat1: 37.65085},
	japan: {lon0: 134.10000, lon1: 144.10000, lat0: 39.21275, lat1: 34.72093},
} as const;

export type ReliefView = keyof typeof reliefViews;
