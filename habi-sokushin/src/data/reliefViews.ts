// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	shonai: {lon0: 138.80000, lon1: 141.20000, lat0: 38.90720, lat1: 37.84893},
	japan: {lon0: 135.15000, lon1: 142.95000, lat0: 38.78055, lat1: 35.27908},
} as const;

export type ReliefView = keyof typeof reliefViews;
