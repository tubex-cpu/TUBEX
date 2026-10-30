// 地図の下絵（public/maps/*.jpg）が映している範囲。scripts/gen_maps.py が作る
export const mapViews = {
	pacific: {lon0: 95.0000, lon1: 295.0000, lat0: 47.7026, lat1: -63.7026},
	world: {lon0: -160.0000, lon1: 160.0000, lat0: 90.0000, lat1: -90.0000},
	micronesia: {lon0: 102.0000, lon1: 198.0000, lat0: 43.4219, lat1: -8.0219},
	ryukyu: {lon0: 119.0000, lon1: 130.0000, lat0: 27.8039, lat1: 22.1961},
	genkai: {lon0: 127.0000, lon1: 134.0000, lat0: 35.6322, lat1: 32.3678},
	andaman: {lon0: 91.6000, lon1: 93.3000, lat0: 11.9186, lat1: 10.9814},
	coral: {lon0: 154.0000, lon1: 170.0000, lat0: -16.2850, lat1: -24.7150},
	zealandia: {lon0: 135.0000, lon1: 201.0000, lat0: -17.4322, lat1: -48.5678},
	easter: {lon0: 241.0000, lon1: 291.0000, lat0: -13.3607, lat1: -38.6393},
	hokulea: {lon0: 145.0000, lon1: 269.0000, lat0: 30.1627, lat1: -39.3627},
	southamerica: {lon0: 229.5000, lon1: 294.5000, lat0: -3.4877, lat1: -37.7123},
	japan: {lon0: 85.0000, lon1: 179.0000, lat0: 55.1724, lat1: 10.8276},
	atlantic: {lon0: -105.0000, lon1: 45.0000, lat0: 59.6433, lat1: -19.6433},
	indian: {lon0: -6.5000, lon1: 130.5000, lat0: 32.5340, lat1: -44.1340},
	northsea: {lon0: -10.0000, lon1: 16.0000, lat0: 58.1188, lat1: 49.4812},
} as const;

export type MapView = keyof typeof mapViews;
