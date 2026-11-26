// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	eastasia: {lon0: 110.30000, lon1: 136.30000, lat0: 41.68993, lat1: 29.86803},
	westjapan: {lon0: 128.90000, lon1: 137.50000, lat0: 36.27415, lat1: 32.27834},
	nara: {lon0: 135.55000, lon1: 136.05000, lat0: 34.72067, lat1: 34.48917},
	kyushu: {lon0: 129.67000, lon1: 130.97000, lat0: 33.73460, lat1: 33.12433},
	honshu: {lon0: 128.30000, lon1: 140.90000, lat0: 38.04357, lat1: 32.25329},
} as const;

export type ReliefView = keyof typeof reliefViews;
