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
	'ekotoba-shiraishi': {file: 'ekotoba-shiraishi.jpg', credit: '蒙古襲来絵詞 前巻 絵5 Lyrics: Suenaga Takezaki (possibly handwritten) Painter: (tr / Public domain / Wikimedia Commons'},
	'ekotoba-e8': {file: 'ekotoba-e8.jpg', credit: '蒙古襲来絵詞 前巻 絵8（文永の役の戦闘場面） 竹崎季長 / Public domain / Wikimedia Commons'},
	'ekotoba-e13': {file: 'ekotoba-e13.jpg', credit: '蒙古襲来絵詞 絵13：弘安4年閏7月5日、生の松原から兵船に乗った季長配下 Author unknown. Illustration rolls were ordered by Takezaki  / Public domain / Wikimedia Commons'},
	'ekotoba-e20': {file: 'ekotoba-e20.jpg', credit: '蒙古襲来絵詞 後巻 絵20 震天動地 / CC BY-SA 3.0 / Wikimedia Commons'},
	'mohon-fukuda-1': {file: 'mohon-fukuda-1.jpg', credit: '福田太華による模本（1846年、東京国立博物館蔵）その1 Fukuda Taika / (of the reproduction) Tokyo National Museum / Public domain / Wikimedia Commons'},
	'yosai-mouko': {file: 'yosai-mouko.jpg', credit: '菊池容斎『蒙古襲来図』（1847年、東京国立博物館蔵） Kikuchi Yoosai / (of the reproduction) Tokyo National Museum / Public domain / Wikimedia Commons', fit: 'contain'},
	'isai-kamikaze': {file: 'isai-kamikaze.jpg', credit: '葛飾為斎『日蓮上人一代図会』（1858年）の神風の場面 ウィキ太郎 (Wiki Taro) / Public domain / Wikimedia Commons'},
	'kublai-letter': {file: 'kublai-letter.jpg', credit: 'クビライの国書「大蒙古国皇帝奉書日本国王」（1266年）の写し（東大寺の宗性による写本） Qubilai Qa’an/(transcribed by 東大寺宗性 Soushou (1202-1278)Todai / Public domain / Wikimedia Commons', fit: 'contain'},
	'takashima-air': {file: 'takashima-air.jpg', credit: '上海→福岡便の機内から見た壱岐水道と鷹島（空撮） そらみみ / CC BY-SA 4.0 / Wikimedia Commons'},
	'kozaki-site-1': {file: 'kozaki-site-1.jpg', credit: '元の船が沈む神崎海中遺跡（鷹島）の海 Equietern / CC BY-SA 3.0 / Wikimedia Commons'},
	'takashima-finds': {file: 'takashima-finds.jpg', credit: '九州国立博物館に展示された鷹島海底遺跡の出土品 先従隗始 / CC0 / Wikimedia Commons'},
	'tsushima-beach': {file: 'tsushima-beach.jpg', credit: '対馬の三宇田浜（対馬北部の海） Choi2451 / CC BY-SA 3.0 / Wikimedia Commons'},
	'ryukoji-cave': {file: 'ryukoji-cave.jpg', credit: '龍口寺の、日蓮が捕らえられた岩屋 Fg2 / Public domain / Wikimedia Commons'},
	'kublai': {file: 'kublai.jpg', credit: 'フビライ（クビライ）・ハンの肖像（元朝皇帝像の画帖から） Araniko / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'tokimune': {file: 'tokimune.jpg', credit: '北条時宗の肖像 Unknown / Public domain / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'engakuji-shariden': {file: 'engakuji-shariden.jpg', credit: '円覚寺舎利殿（国宝）。円覚寺は時宗が元寇の戦死者を弔うため創建 Tsuyoshi chiba / CC BY-SA 4.0 / Wikimedia Commons'},
	'mongol-helmet-1': {file: 'mongol-helmet-1.jpg', credit: '元代の兜（内モンゴル博物館） BabelStone / CC BY-SA 3.0 / Wikimedia Commons', fit: 'contain'},
	'mongol-warrior': {file: 'mongol-warrior.jpg', credit: 'モンゴル帝国の騎馬兵の展示（モンゴル国立博物館） Gary Todd / CC0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'goryeo-celadon-1': {file: 'goryeo-celadon-1.jpg', credit: '高麗青磁の香炉（12世紀） Lightbearer03 / CC BY-SA 4.0 / Wikimedia Commons'},
	'song-celadon-1': {file: 'song-celadon-1.jpg', credit: '南宋・龍泉窯の青磁香炉（上海博物館） Gary Lee Todd, Ph.D. / CC0 / Wikimedia Commons'},
	'typhoon-jebi': {file: 'typhoon-jebi.jpg', credit: '2018年台風21号（チェービー）の衛星写真 MODIS Land Rapid Response Team, NASA GSFC / Public domain / Wikimedia Commons'},
	'genkai-1': {file: 'genkai-1.jpg', credit: '志賀島海水浴場から望む玄界灘 そらみみ (Soramimi) / CC BY-SA 4.0 / Wikimedia Commons'},
	'genkai-2': {file: 'genkai-2.jpg', credit: '二見ヶ浦（糸島）から望む玄界灘 そらみみ (Soramimi) / CC BY-SA 4.0 / Wikimedia Commons'},
	'map-ecs': {file: 'map-ecs.jpg', credit: '東シナ海の地図（OpenStreetMap） OpenStreetMap contributors, and Peka / ODbL / Wikimedia Commons'},
	'ekotoba-tetsuhau-w': {file: 'ekotoba-tetsuhau-w.jpg', credit: '蒙古襲来絵詞 前巻 絵7 Author unknown. Illustration rolls were ordered by Takezaki  / Public domain / Wikimedia Commons'},
	'kyosai-mouko-w': {file: 'kyosai-mouko-w.jpg', credit: '河鍋暁斎『蒙古賊船退治之図』三枚続（アムステルダム国立美術館） Rijksmuseum / CC0 / Wikimedia Commons'},
	'borui-iki-3-w': {file: 'borui-iki-3-w.jpg', credit: '元寇防塁 生の松原地区（横長） Hirho / CC BY-SA 4.0 / Wikimedia Commons'},
	'map-mongol-1-w': {file: 'map-mongol-1-w.jpg', credit: 'モンゴル帝国の最大版図と現代の国境の地図 BlueHypercane761 / CC BY 4.0 / Wikimedia Commons', fit: 'contain', filter: 'invert(1) brightness(0.9) contrast(1.15)'},
	'map-mongol-2-w': {file: 'map-mongol-2-w.jpg', credit: 'モンゴル帝国の最大版図（シンプルな地図） Tiashing595 / CC0 / Wikimedia Commons', fit: 'contain', filter: 'grayscale(1) invert(1) sepia(1) saturate(2.6) brightness(0.85) contrast(1.2)'},
	'ekotoba-e21': {file: 'ekotoba-e21.jpg', credit: '蒙古襲来絵詞 後巻 絵21：肥後国守護・安達盛宗に勲功を報告する季長 Author unknown. Illustration rolls were ordered by Takezaki  / Public domain / Wikimedia Commons', fit: 'contain'},
};
