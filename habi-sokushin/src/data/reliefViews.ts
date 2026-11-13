// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	kanto: {lon0: 138.35000, lon1: 140.95000, lat0: 36.58937, lat1: 35.40619},
	west: {lon0: 129.90000, lon1: 136.70000, lat0: 35.66874, lat1: 32.50163},
	honshu: {lon0: 129.90000, lon1: 140.90000, lat0: 37.39775, lat1: 32.32392},
} as const;

export type ReliefView = keyof typeof reliefViews;
