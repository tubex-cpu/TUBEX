// 地図の下絵（public/maps/*.jpg）が映している範囲（ウェブメルカトル）。scripts/gen_relief.py が作る
export const reliefViews = {
	sudamerica: {lon0: -92.00000, lon1: -48.00000, lat0: -0.73798, lat1: -24.68670},
	cusco: {lon0: -73.85000, lon1: -71.25000, lat0: -12.53719, lat1: -13.96073},
	machupicchu: {lon0: -72.65000, lon1: -72.41000, lat0: -13.09927, lat1: -13.23072},
	fukushima: {lon0: 139.80000, lon1: 141.30000, lat0: 37.81403, lat1: 37.14447},
} as const;

export type ReliefView = keyof typeof reliefViews;
