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
	'yk-kaguraden-night': {file: 'yk-kaguraden-night.jpg', credit: '夜の闇に灯りがともる高千穂神社の神楽殿 Duarna / CC BY-SA 3.0 / Wikimedia Commons'},
	'yk-iwato-kaguraden': {file: 'yk-iwato-kaguraden.jpg', credit: '天岩戸神社の神楽殿 sk01 / CC BY-SA 3.0 / Wikimedia Commons'},
	'yk-shiiba': {file: 'yk-shiiba.jpg', credit: '宮崎・椎葉村の夜神楽（不土野）。注連飾りの下で舞う murakamihisho / Public domain / Wikimedia Commons', labelBottom: true},
	'yk-iki': {file: 'yk-iki.jpg', credit: '民家のような神楽の座で、面をつけ刀を持って舞う（壱岐・月読神社の例祭の神楽） Hiroi_Yamaguchi / CC BY-SA 4.0 / Wikimedia Commons', labelBottom: true},
	'yk-yutate': {file: 'yk-yutate.jpg', credit: '湯立神事で面をつけて舞う神楽（大釜の前で） さかおり (talk) / CC BY-SA 3.0 / Wikimedia Commons', labelBottom: true},
	'yk-tsunoyama': {file: 'yk-tsunoyama.jpg', credit: '夜の舞台で舞う津野山神楽（高知） osami / Public domain / Wikimedia Commons', labelBottom: true},
	'yk-1914': {file: 'yk-1914.jpg', credit: '1914年の祭りの神楽舞台と見物の群衆（古写真） A.Davey from Portland, Oregon, EE UU / CC BY 2.0 / Wikimedia Commons', labelBottom: true},
	'yk-masks-shelf': {file: 'yk-masks-shelf.jpg', credit: '棚にずらりと並んだ神楽面（宮城・加美町） スティーブ・ミズキ / CC BY-SA 4.0 / Wikimedia Commons', labelBottom: true},
	'yk-mask-demon': {file: 'yk-mask-demon.jpg', credit: '鬼神の神楽面（大写し） Ka23 13 / CC BY-SA 4.0 / Wikimedia Commons', labelBottom: true},
	'yk-mask-kami-pair': {file: 'yk-mask-kami-pair.jpg', credit: '500年前の神楽の神の面（男女一対・大英博物館） Zunkir / CC BY-SA 4.0 / Wikimedia Commons', labelBottom: true},
	'yk-mask-oldwoman': {file: 'yk-mask-oldwoman.jpg', credit: '江戸時代はじめの老女の神楽面 Daderot / CC0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'yk-suzu': {file: 'yk-suzu.jpg', credit: '神楽鈴（メトロポリタン美術館） 作者不明 / CC0 / Wikimedia Commons'},
	'yk-giant-uzume': {file: 'yk-giant-uzume.jpg', credit: '高千穂の巨大な鈿女の面のモニュメント dani / CC BY 2.0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'yk-giant-tajikarao': {file: 'yk-giant-tajikarao.jpg', credit: '高千穂の巨大な手力雄の面のモニュメント dani / CC BY 2.0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'yk-iwami-orochi': {file: 'yk-iwami-orochi.jpg', credit: '石見神楽「大蛇」：スサノオと大蛇 pattio (投稿者編集/Myself) , Japanese / CC BY-SA 3.0 / Wikimedia Commons', labelBottom: true},
	'yk-iwami-smoke': {file: 'yk-iwami-smoke.jpg', credit: '煙の中で舞う石見神楽のスサノオ pattio(投稿者編集) , Japanese / CC BY-SA 3.0 / Wikimedia Commons', labelBottom: true},
	'yk-iwami-shrine': {file: 'yk-iwami-shrine.jpg', credit: '山あいの神社の神楽殿で奉納される石見神楽と見物の人々 jpg / CC BY-SA 2.0 / Wikimedia Commons', labelBottom: true},
	'yk-masked-actor': {file: 'yk-masked-actor.jpg', credit: '面をつけ刀を持つ神代神楽の舞い手（島根） pelican / CC BY-SA 2.0 / Wikimedia Commons', labelBottom: true},
	'yk-daidai': {file: 'yk-daidai.jpg', credit: '面をつけて舞う里神楽（太々神楽・山梨岡神社） Sakaori (talk) / CC BY-SA 3.0 / Wikimedia Commons', labelBottom: true},
	'yk-ema': {file: 'yk-ema.jpg', credit: '神楽を描いた奉納絵馬（北尾重光） 渓齋北尾 / Public domain / Wikimedia Commons', labelBottom: true},
	'yk-harunobu': {file: 'yk-harunobu.jpg', credit: '鈴木春信「神楽舞」（1766年ごろ） Suzuki Harunobu (鈴木春信) / CC0 / Wikimedia Commons', fit: 'contain', labelBottom: true},
	'yk-bonfire': {file: 'yk-bonfire.jpg', credit: '夜空に燃え上がる大きなかがり火（鹿児島の鬼火焚き） Hirase / CC BY-SA 3.0 / Wikimedia Commons'},
	'yk-bonfire-shrine': {file: 'yk-bonfire-shrine.jpg', credit: '夜の神社の境内で燃える火 ウィキ太郎(Wiki Taro) / CC0 / Wikimedia Commons'},
	'yk-dawn-sea': {file: 'yk-dawn-sea.jpg', credit: '夜明けの日向の海と岩（宮崎・油津） ブルーノ・プラス / CC BY-SA 4.0 / Wikimedia Commons'},
};
