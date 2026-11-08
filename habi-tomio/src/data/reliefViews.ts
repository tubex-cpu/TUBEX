// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	nara: {lon0: 135.52500, lon1: 136.07500, lat0: 34.74720, lat1: 34.49260},
	nishinihon: {lon0: 128.65000, lon1: 138.15000, lat0: 35.79645, lat1: 31.34615},
} as const;

export type ReliefView = keyof typeof reliefViews;
