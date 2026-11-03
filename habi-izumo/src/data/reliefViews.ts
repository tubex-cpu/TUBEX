// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	nihonkai: {lon0: 124.00000, lon1: 140.00000, lat0: 39.36489, lat1: 32.06769},
	chugoku: {lon0: 130.40000, lon1: 136.00000, lat0: 36.27994, lat1: 33.69972},
	izumo: {lon0: 132.42500, lon1: 133.67500, lat0: 35.63624, lat1: 35.06275},
	kojindani: {lon0: 132.79100, lon1: 132.95100, lat0: 35.39469, lat1: 35.32129},
} as const;

export type ReliefView = keyof typeof reliefViews;
