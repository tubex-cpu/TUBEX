// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	kyushu: {lon0: 128.50000, lon1: 133.50000, lat0: 33.48080, lat1: 31.10361},
	nihon: {lon0: 127.10000, lon1: 142.10000, lat0: 37.99899, lat1: 31.05601},
	takachiho: {lon0: 131.26000, lon1: 131.40000, lat0: 32.75812, lat1: 32.69187},
} as const;

export type ReliefView = keyof typeof reliefViews;
