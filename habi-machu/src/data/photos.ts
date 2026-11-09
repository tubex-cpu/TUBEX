// 写真の一覧（scripts/gen_photos.py が credits.json から作る）
export type PhotoInfo = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	readonly fit?: 'cover' | 'contain';
	// 人物の顔が上にある写真は、テロップを下に置く
	readonly labelBottom?: boolean;
	// 色の調整（明るい地図を夜の色にするなど）
	readonly filter?: string;
};

export const photos: Record<string, PhotoInfo> = {
	'mp-classic-dd60': {file: 'mp-classic-dd60.jpg', credit: '定番の角度から見たマチュピチュとワイナ・ピチュ（晴れ） Diego Delso / CC BY-SA 4.0 / Wikimedia Commons'},
	'mp-houses-dd47': {file: 'mp-houses-dd47.jpg', credit: '石造りの家並みとワイナ・ピチュ Diego Delso / CC BY-SA 4.0 / Wikimedia Commons'},
	'mp-80-crop': {file: 'mp-80-crop.jpg', credit: '夕方の光に染まるマチュピチュ全景 Martin St-Amant (S23678) / CC BY-SA 3.0 / Wikimedia Commons'},
	'mp-sunrise-allard': {file: 'mp-sunrise-allard.jpg', credit: '朝霧が谷をうめる日の出直後のマチュピチュ Allard Schmidt (The Netherlands) / Public domain / Wikimedia Commons'},
	'mp-clouds-unsplash': {file: 'mp-clouds-unsplash.jpg', credit: '雲が湧き上がる中のマチュピチュ Scott Umstattd scott_umstattd / CC0 / Wikimedia Commons'},
	'mp-misty-unsplash': {file: 'mp-misty-unsplash.jpg', credit: '霧に包まれたマチュピチュとワイナ・ピチュ John Kutcher jmkutcher / CC0 / Wikimedia Commons'},
	'mp-sunrise-45': {file: 'mp-sunrise-45.jpg', credit: '青空と朝の光のマチュピチュ（ワイド） Amatula11 / CC BY-SA 4.0 / Wikimedia Commons'},
	'mp-dd37': {file: 'mp-dd37.jpg', credit: 'ウルバンバ川を見下ろす尾根の上のマチュピチュ Diego Delso / CC BY-SA 4.0 / Wikimedia Commons'},
	'wayna-full': {file: 'wayna-full.jpg', credit: 'マチュピチュ山側から見たワイナ・ピチュと遺跡 Alesegura / CC BY-SA 4.0 / Wikimedia Commons'},
	'wayna-tallest': {file: 'wayna-tallest.jpg', credit: '石垣越しにそびえるワイナ・ピチュ AlexandraPinao / CC BY-SA 4.0 / Wikimedia Commons'},
	'wayna-vrchol': {file: 'wayna-vrchol.jpg', credit: '段々畑が刻まれたワイナ・ピチュの山頂 Pavel Špindler / CC BY 3.0 / Wikimedia Commons'},
	'mpmtn-preben': {file: 'mpmtn-preben.jpg', credit: 'マチュピチュ山の上から見た遺跡と蛇行するウルバンバ川 Preben Nilsen (@prebz22) on Unsplash / CC0 / Wikimedia Commons'},
	'map-gohring': {file: 'map-gohring.jpg', credit: '1874年ごろのゲーリングの地図「パウカルタンボ…ビルカノタ谷」（マチュピチュの名が載る古地図とされる） Göhring, Herman ; Mondejar, [?] / CC0 / Wikimedia Commons', fit: 'contain'},
	'sun-temple-1': {file: 'sun-temple-1.jpg', credit: '太陽の神殿（トレオン）を上から Apollo / CC BY 2.0 / Wikimedia Commons'},
	'sun-temple-solstice': {file: 'sun-temple-solstice.jpg', credit: '冬至の朝日が差す太陽の神殿 François Bianco / CC BY-SA 2.0 / Wikimedia Commons', fit: 'contain'},
	'royal-tomb': {file: 'royal-tomb.jpg', credit: '太陽の神殿の下の「王の墓」の岩 Jorge Láscar from Australia / CC BY 2.0 / Wikimedia Commons'},
	'royal-residence': {file: 'royal-residence.jpg', credit: '王の住居とされる建物の扉口（二重の台形の門） Dennis G. Jarvis / CC BY-SA 2.0 / Wikimedia Commons', fit: 'contain'},
	'intihuatana-1': {file: 'intihuatana-1.jpg', credit: 'インティワタナの石 Alesegura / CC BY-SA 4.0 / Wikimedia Commons'},
	'main-temple-1': {file: 'main-temple-1.jpg', credit: '主神殿の巨石の壁 PA / CC BY-SA 4.0 / Wikimedia Commons'},
	'pachacuti-brooklyn': {file: 'pachacuti-brooklyn.jpg', credit: '18世紀の肖像画「第10代インカ・パチャクティ」（ブルックリン美術館） 作者不明 / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'pachacuti-statue': {file: 'pachacuti-statue.jpg', credit: 'クスコのアルマス広場の噴水とパチャクテク像 Diego Delso / CC BY-SA 4.0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'coricancha-1': {file: 'coricancha-1.jpg', credit: 'インカの太陽神殿コリカンチャの上に建つサント・ドミンゴ修道院 Brian Jeffery Beggerly / CC BY 2.0 / Wikimedia Commons'},
	'coricancha-wall': {file: 'coricancha-wall.jpg', credit: 'コリカンチャのすき間のない石組み Pethrus / CC BY-SA 4.0 / Wikimedia Commons'},
	'bingham-portrait': {file: 'bingham-portrait.jpg', credit: 'ハイラム・ビンガム3世の肖像写真（若いころ） Unknown authorUnknown author / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'bingham-lc': {file: 'bingham-lc.jpg', credit: '上院議員時代のビンガム（米議会図書館） Harris &amp; Ewing, photographer / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'bingham-tent': {file: 'bingham-tent.jpg', credit: '1912年、マチュピチュの野営地のテントの前に立つビンガム Ellwood C. Erdis (sub Director of the North American Scienti / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'bingham-espiritu': {file: 'bingham-espiritu.jpg', credit: '1911年、エスピリトゥ・パンパの密林の石橋の上のビンガム（手彩色ガラススライド） Harry Ward Foote / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'old-mp-1912': {file: 'old-mp-1912.jpg', credit: '1912年に撮られたマチュピチュ全景（草木を伐採した直後） Hiram Bingham III / Public domain / Wikimedia Commons'},
	'old-sameplace': {file: 'old-sameplace.jpg', credit: '伐採前（1911年）の草木に覆われた同じ場所 H. L. Tucker / Public domain / Wikimedia Commons', fit: 'contain'},
	'old-three-windows-1911': {file: 'old-three-windows-1911.jpg', credit: '1911年、草に埋もれた三つの窓の神殿 Hiram Bingham III / Public domain / Wikimedia Commons'},
	'lizarraga': {file: 'lizarraga.jpg', credit: '三つの窓の神殿の石柱（リサラガが落書きを残したとされる石） Hiram Bingham III / Public domain / Wikimedia Commons'},
	'old-heaviest': {file: 'old-heaviest.jpg', credit: 'マチュピチュでいちばん重い石を使った壁（1912年） Hiram Bingham III / Public domain / Wikimedia Commons'},
	'old-canyon': {file: 'old-canyon.jpg', credit: 'ウルバンバ峡谷にのぞむマチュピチュとワイナ・ピチュ（1912年） Hiram Bingham III / Public domain / Wikimedia Commons'},
	'old-house-door': {file: 'old-house-door.jpg', credit: '典型的な家の扉口（1912年） Hiram Bingham III / Public domain / Wikimedia Commons'},
	'ng-cover-1913': {file: 'ng-cover-1913.jpg', credit: 'ナショナル ジオグラフィック 1913年4月号の表紙「ペルーの不思議の国で」 National Geographic / Public domain / Wikimedia Commons', fit: 'contain'},
};
