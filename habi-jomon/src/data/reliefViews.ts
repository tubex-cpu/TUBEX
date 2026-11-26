// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	archipelago: {lon0: 120.50000, lon1: 150.50000, lat0: 42.34231, lat1: 28.67132},
	japansea: {lon0: 125.50000, lon1: 140.50000, lat0: 41.24843, lat1: 34.60105},
	kyushu: {lon0: 128.00000, lon1: 133.20000, lat0: 33.13319, lat1: 30.65007},
	tohoku: {lon0: 139.75000, lon1: 142.05000, lat0: 41.10920, lat1: 40.12719},
	wide: {lon0: 114.00000, lon1: 154.00000, lat0: 43.85764, lat1: 25.51188},
	kyushus: {lon0: 126.40000, lon1: 134.40000, lat0: 33.30063, lat1: 29.46010},
	nsea: {lon0: 118.00000, lon1: 148.00000, lat0: 46.60679, lat1: 33.78233},
	chinajp: {lon0: 111.00000, lon1: 141.00000, lat0: 38.86651, lat1: 24.57843},
} as const;

export type ReliefView = keyof typeof reliefViews;
