// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	kinki: {lon0: 134.50000, lon1: 138.10000, lat0: 35.77568, lat1: 34.11592},
	honshu: {lon0: 129.90000, lon1: 140.90000, lat0: 37.39775, lat1: 32.32392},
} as const;

export type ReliefView = keyof typeof reliefViews;
