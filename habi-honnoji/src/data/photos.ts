// 動画で使う実写真の一覧（public/photos/credits.json をもとに作る）
type PhotoEntry = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	readonly fit?: 'cover' | 'contain';
	// 人物・像の顔が上半分にある写真は、テロップを下に置く
	readonly labelBottom?: boolean;
};

export const photos: Record<string, PhotoEntry> = {
	'honnoji-nobukazu': {file: 'honnoji-nobukazu.jpg', credit: '楊洲周延による本能寺の変の錦絵 Nobukazu Yōsai / パブリックドメイン / Wikimedia Commons', fit: 'contain'},
	'honnoji-yoshitoshi': {file: 'honnoji-yoshitoshi.jpg', credit: '月岡芳年による本能寺の信長の錦絵 Tsukioka Yoshitoshi (Japan, 1839-1892) / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'honnoji-yoshimori': {file: 'honnoji-yoshimori.jpg', credit: '歌川芳盛による本能寺の戦いの錦絵 Utagawa Yoshimori / パブリックドメイン / Wikimedia Commons', fit: 'contain'},
	'honnoji-site': {file: 'honnoji-site.jpg', credit: '本能寺跡の石碑 Saigen Jiro / CC0 / Wikimedia Commons'},
	'honnoji-hondo': {file: 'honnoji-hondo.jpg', credit: '本能寺 本堂 そらみみ / CC BY-SA 3.0 / Wikimedia Commons'},
	'mori-ranmaru': {file: 'mori-ranmaru.jpg', credit: '月岡芳年「森蘭丸」 Yoshitoshi / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'ranmaru-end': {file: 'ranmaru-end.jpg', credit: '右田年英による森蘭丸の最期の錦絵 Toshihide Migita / パブリックドメイン / Wikimedia Commons', fit: 'contain'},
	nobunaga: {file: 'nobunaga.jpg', credit: '織田信長像（狩野宗秀筆） Kano Soshu (1551-1601) / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	mitsuhide: {file: 'mitsuhide.jpg', credit: '明智光秀像 / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'mitsuhide-ukiyoe': {file: 'mitsuhide-ukiyoe.jpg', credit: '歌川芳幾「明智光秀」 Utagawa Yoshiiku / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'mitsuhide-statue': {file: 'mitsuhide-statue.jpg', credit: '明智光秀の銅像 流離いの暇人 / CC BY-SA 4.0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	hideyoshi: {file: 'hideyoshi.jpg', credit: '豊臣秀吉像（高台寺） Kanō Mitsunobu / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'hideyoshi-2': {file: 'hideyoshi-2.jpg', credit: '豊臣秀吉像 Unknown / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	tenkai: {file: 'tenkai.jpg', credit: '天海像 Kimura Ryōtaku (Inscription by Tenkai) / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	yoshiaki: {file: 'yoshiaki.jpg', credit: '足利義昭像 Published by Meguro Shoten (目黒書店) / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	motochika: {file: 'motochika.jpg', credit: '歌川芳幾「長宗我部元親」 Utagawa Yoshiiku / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	kikkawa: {file: 'kikkawa.jpg', credit: '吉川元春像 / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	motonari: {file: 'motonari.jpg', credit: '毛利元就像 / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	fujitaka: {file: 'fujitaka.jpg', credit: '細川藤孝（幽斎）像 天授庵所蔵 / A collection of Tenju-an / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'sakamoto-09': {file: 'sakamoto-09.jpg', credit: '坂本城跡の石垣 / パブリックドメイン / Wikimedia Commons'},
	'sakamoto-01': {file: 'sakamoto-01.jpg', credit: '坂本城址の石碑 / CC BY 3.0 / Wikimedia Commons', fit: 'contain'},
	'sakamoto-02': {file: 'sakamoto-02.jpg', credit: '坂本城址公園の明智光秀像 / CC BY-SA 3.0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'sakamoto-05': {file: 'sakamoto-05.jpg', credit: '坂本城跡の記念碑 / CC BY 3.0 / Wikimedia Commons'},
	'sakamoto-04': {file: 'sakamoto-04.jpg', credit: '坂本城跡付近の水路 / パブリックドメイン / Wikimedia Commons'},
	'biwa-omi': {file: 'biwa-omi.jpg', credit: '近江神宮から見た琵琶湖 Zairon / CC BY 4.0 / Wikimedia Commons'},
	'biwa-sa': {file: 'biwa-sa.jpg', credit: '大津から見た琵琶湖 もんじゃ / CC BY-SA 3.0 / Wikimedia Commons'},
	'takamatsu-ruins': {file: 'takamatsu-ruins.jpg', credit: '備中高松城跡 663highland / CC BY-SA 4.0 / Wikimedia Commons'},
	'takamatsu-ukiyoe': {file: 'takamatsu-ukiyoe.jpg', credit: '歌川豊宣による備中高松城の水攻めの錦絵 Utagawa Toyonobu / パブリックドメイン / Wikimedia Commons', fit: 'contain'},
	atago: {file: 'atago.jpg', credit: '愛宕神社 Saigen Jiro / CC0 / Wikimedia Commons'},
	'atago-torii': {file: 'atago-torii.jpg', credit: '愛宕神社の鳥居 Tomomarusan / CC BY 2.5 / Wikimedia Commons'},
	akechidaira: {file: 'akechidaira.jpg', credit: '日光・明智平 Inazakira / CC BY-SA 2.0 / Wikimedia Commons'},
	hiei: {file: 'hiei.jpg', credit: '比叡山と京都 Benlisquare / CC BY-SA 4.0 / Wikimedia Commons'},
	fukuchiyama: {file: 'fukuchiyama.jpg', credit: '福知山城 Saigen Jiro / CC0 / Wikimedia Commons'},
	goryo: {file: 'goryo.jpg', credit: '御霊神社（福知山） Tam0031 / CC BY-SA 3.0 / Wikimedia Commons'},
	'nishiyama-kubizuka': {file: 'nishiyama-kubizuka.jpg', credit: '西山本門寺の信長の首塚 Missile shot / CC BY-SA 3.0 / Wikimedia Commons'},
	azuchi: {file: 'azuchi.jpg', credit: '安土城跡 Akonnchiroll / CC BY-SA 4.0 / Wikimedia Commons'},
	kameyama: {file: 'kameyama.jpg', credit: '丹波亀山城跡の石垣 kamoseiro / CC BY-SA 3.0 / Wikimedia Commons'},
	hayashibara: {file: 'hayashibara.jpg', credit: '林原美術館 663highland / CC BY 2.5 / Wikimedia Commons'},
	kochi: {file: 'kochi.jpg', credit: '高知城 663highland / CC BY 2.5 / Wikimedia Commons'},
	katsura: {file: 'katsura.jpg', credit: '桂川 Smiley.toerist / CC BY-SA 4.0 / Wikimedia Commons'},
	'hidemitsu-lake': {file: 'hidemitsu-lake.jpg', credit: '「明智左馬助 湖水渡り」（アムステルダム国立美術館） Rijksmuseum / CC0 / Wikimedia Commons', fit: 'contain'},
	'hidemitsu-ukiyoe': {file: 'hidemitsu-ukiyoe.jpg', credit: '歌川芳幾「明智光春（秀満）」 Utagawa Yoshiiku / パブリックドメイン / Wikimedia Commons', fit: 'contain', labelBottom: true},
	iwakuni: {file: 'iwakuni.jpg', credit: '岩国・錦帯橋 Jakub Hałun / CC BY-SA 4.0 / Wikimedia Commons'},
	'honnoji-daihoden': {file: 'honnoji-daihoden.jpg', credit: '本能寺 大宝殿 そらみみ / CC BY-SA 4.0 / Wikimedia Commons'},
	'biwa-ukimido': {file: 'biwa-ukimido.jpg', credit: '琵琶湖の浮御堂 Zairon / CC BY 4.0 / Wikimedia Commons'},
	'fukuchiyama-2': {file: 'fukuchiyama-2.jpg', credit: '福知山城 先従隗始 / CC BY-SA 4.0 / Wikimedia Commons'},
	'biwa-omi3': {file: 'biwa-omi3.jpg', credit: '近江神宮から見た琵琶湖 Zairon / CC BY 4.0 / Wikimedia Commons'},
	'hiei-sakura': {file: 'hiei-sakura.jpg', credit: '比叡山と桜 Hahifuheho / CC0 / Wikimedia Commons'},
};
