// 動画で使う実写真の一覧。public/photos/ に画像を置き、ここに登録すると表示される。
// 使ってよい写真：Wikimedia Commons（パブリックドメイン／CCライセンス）や美術館のオープンアクセス画像のみ。
// credit は画面右上と概要欄に載せる出典表記（作者・ライセンス・出典）。
type PhotoEntry = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	// 縦長の資料などは contain（全体を見せ、余白はぼかした同じ画像で埋める）
	readonly fit?: 'cover' | 'contain';
	// 人物・像の顔が上半分にある写真は、テロップを下に置く
	readonly labelBottom?: boolean;
};

const p = (file: string, credit: string, extra: Partial<PhotoEntry> = {}): PhotoEntry => ({file: `${file}.jpg`, credit, ...extra});

export const photos: Record<string, PhotoEntry> = {
	'hashihaka-zenkei': p('hashihaka-zenkei', '箸墓古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'hashihaka-zenkei2': p('hashihaka-zenkei2', '箸墓古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'hashihaka-distance': p('hashihaka-distance', '箸墓古墳 Immanuelle / CC BY 4.0 / Wikimedia Commons'),
	'hashihaka-entrance': p('hashihaka-entrance', '箸墓古墳の拝所 Saigen Jiro / CC0 / Wikimedia Commons'),
	'miwa-from-hashihaka': p('miwa-from-hashihaka', '箸墓古墳から見た三輪山 Saigen Jiro / CC0 / Wikimedia Commons'),
	'yoshinogari-zenkei': p('yoshinogari-zenkei', '吉野ヶ里遺跡 Saigen Jiro / CC0 / Wikimedia Commons'),
	'yoshinogari-kango': p('yoshinogari-kango', '吉野ヶ里遺跡 環濠 小池 隆 / CC BY 3.0 / Wikimedia Commons'),
	'yoshinogari-kamekan': p('yoshinogari-kamekan', '吉野ヶ里遺跡 甕棺墓 小池 隆 / CC BY 3.0 / Wikimedia Commons'),
	'yoshinogari-kitanaikaku': p('yoshinogari-kitanaikaku', '吉野ヶ里遺跡 北内郭 Pekachu / CC BY-SA 4.0 / Wikimedia Commons'),
	'yoshinogari-sword': p('yoshinogari-sword', '吉野ヶ里遺跡出土 銅剣 Pekachu / CC BY-SA 4.0 / Wikimedia Commons', {fit: 'contain'}),
	'yayoi-pottery': p('yayoi-pottery', '弥生土器（吉野ヶ里遺跡） Abasaa / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'yoshinogari-iseki': p('yoshinogari-iseki', '吉野ヶ里遺跡 物見やぐら（復元） / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'na-seal': p('na-seal', '金印「漢委奴国王」 PHGCOM / CC BY-SA 3.0 / Wikimedia Commons', {fit: 'contain'}),
	shikanoshima: p('shikanoshima', '志賀島 Saigen Jiro / CC0 / Wikimedia Commons'),
	'shikanoshima-aerial': p('shikanoshima-aerial', '志賀島 ブルーノ・プラス / CC BY 4.0 / Wikimedia Commons'),
	'dian-seal': p('dian-seal', '滇王之印 Gary Todd / CC0 / Wikimedia Commons', {fit: 'contain'}),
	guangwu: p('guangwu', '光武帝 / パブリックドメイン / Wikimedia Commons', {fit: 'contain', labelBottom: true}),
	arai: p('arai', '新井白石 / パブリックドメイン / Wikimedia Commons', {fit: 'contain', labelBottom: true}),
	motoori: p('motoori', '本居宣長 Hannah / パブリックドメイン / Wikimedia Commons', {fit: 'contain', labelBottom: true}),
	weizhi: p('weizhi', '『三国志』魏志 / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'nihonshoki-683': p('nihonshoki-683', '『日本書紀』 PHGCOM / CC BY-SA 3.0 / Wikimedia Commons', {fit: 'contain'}),
	'jingu-kunisada': p('jingu-kunisada', '歌川国貞「神功皇后と武内宿禰」 Utagawa Kunisada / パブリックドメイン / Wikimedia Commons', {fit: 'contain', labelBottom: true}),
	'jingu-yen': p('jingu-yen', '神功皇后の1円札（1881年） Government of the Empire of Japan / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'toro1': p('toro1', '登呂遺跡（復元） / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'toro2': p('toro2', '登呂遺跡（復元） / パブリックドメイン / Wikimedia Commons'),
	'toro3': p('toro3', '登呂遺跡（復元） / パブリックドメイン / Wikimedia Commons'),
	'hirabaru-mirror': p('hirabaru-mirror', '平原遺跡出土 内行花文鏡（複製） Saigen Jiro / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'hirabaru-tomb': p('hirabaru-tomb', '平原遺跡 1号墓 Saigen Jiro / CC0 / Wikimedia Commons'),
	'sankaku-kambara': p('sankaku-kambara', '神原神社古墳出土 景初三年銘 三角縁神獣鏡 Saigen Jiro / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'kurozuka-zenkei': p('kurozuka-zenkei', '黒塚古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'kurozuka-funcho': p('kurozuka-funcho', '黒塚古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'tomio-zenkei': p('tomio-zenkei', '富雄丸山古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'tomio-funkyu': p('tomio-funkyu', '富雄丸山古墳 Saigen Jiro / CC0 / Wikimedia Commons'),
	'makimuku-tsuji2': p('makimuku-tsuji2', '纒向遺跡 Saigen Jiro / CC0 / Wikimedia Commons'),
	'makimuku-b': p('makimuku-b', '纒向遺跡 建物跡 Saigen Jiro / CC0 / Wikimedia Commons'),
	tsushima: p('tsushima', '宇宙から見た対馬 NASA / パブリックドメイン / Wikimedia Commons'),
	iki: p('iki', '壱岐島 Versions111 / CC BY 4.0 / Wikimedia Commons', {fit: 'contain'}),
	karatsu: p('karatsu', '佐賀県唐津市 Thomas Woodtli / CC BY-SA 2.0 / Wikimedia Commons'),
	miwa: p('miwa', '三輪山 / CC BY-SA 4.0 / Wikimedia Commons'),
	'luoyang-palace': p('luoyang-palace', '漢魏洛陽城遺跡 Windmemories / CC BY-SA 4.0 / Wikimedia Commons'),
	'luoyang-museum': p('luoyang-museum', '漢魏洛陽故城遺跡博物館 Windmemories / CC BY-SA 4.0 / Wikimedia Commons'),
	'nihonshoki-1286': p('nihonshoki-1286', '『日本書紀』写本（1286年） Urabe Kanekata / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'sankaku-higashi': p('sankaku-higashi', '東車塚古墳出土 三角縁神獣鏡 Saigen Jiro / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'akamon-mirror': p('akamon-mirror', '赤門上古墳出土 銅鏡 雪野滾滾 / CC0 / Wikimedia Commons', {fit: 'contain'}),
	'tomio-fukiishi': p('tomio-fukiishi', '富雄丸山古墳 葺石 Saigen Jiro / CC0 / Wikimedia Commons'),
	'haniwa-mesuri': p('haniwa-mesuri', 'メスリ山古墳出土 円筒埴輪 Saigen Jiro / パブリックドメイン / Wikimedia Commons', {fit: 'contain'}),
	'yoshinogari-2017': p('yoshinogari-2017', '吉野ヶ里遺跡 inunami / CC BY 2.0 / Wikimedia Commons'),
	'yoshinogari-park': p('yoshinogari-park', '吉野ヶ里歴史公園センター Peka / CC BY-SA 4.0 / Wikimedia Commons'),
	'nara-basin': p('nara-basin', '奈良盆地 MemColorLab / CC BY-SA 4.0 / Wikimedia Commons', {fit: 'contain'}),
	'nara-basin2': p('nara-basin2', '奈良盆地 Nagono / CC BY-SA 3.0 / Wikimedia Commons'),
	'hashihaka-1': p('hashihaka-1', '箸墓古墳 Otraff / CC BY-SA 3.0 / Wikimedia Commons'),
	'hashihaka-2': p('hashihaka-2', '箸墓古墳 Immanuelle / CC BY 4.0 / Wikimedia Commons'),
	'hashihaka-houses': p('hashihaka-houses', '箸墓古墳と町並み Immanuelle / CC BY 4.0 / Wikimedia Commons'),
};
