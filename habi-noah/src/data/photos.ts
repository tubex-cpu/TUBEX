// 動画で使う実写真の一覧。public/photos/ に画像を置き、ここに登録すると図解の代わりに表示される。
// 使ってよい写真：Wikimedia Commons（パブリックドメイン／CCライセンス）や美術館のオープンアクセス画像のみ。
// credit は画面右上と概要欄に載せる出典表記（作者・ライセンス・出典）。
type PhotoEntry = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	// 縦長の絵画などは contain（全体を見せ、余白はぼかした同じ画像で埋める）
	readonly fit?: 'cover' | 'contain';
};

export const photos: Record<string, PhotoEntry> = {
	ararat: {file: 'ararat.jpg', credit: 'Vyacheslav Argenberg / CC BY 4.0 / Wikimedia Commons', position: 'center 35%'},
	durupinar: {file: 'durupinar.jpg', credit: 'Wikkiwooki / CC BY-SA 4.0 / Wikimedia Commons'},
	'deluge-art': {file: 'deluge-art.jpg', credit: 'ギュスターヴ・ドレ「大洪水」（1866）/ パブリックドメイン', fit: 'contain'},
	'noah-art': {file: 'noah-art.jpg', credit: 'エドワード・ヒックス「ノアの方舟」（1846, フィラデルフィア美術館）/ CC0', fit: 'contain'},
	'george-smith': {file: 'george-smith.jpg', credit: 'ジョージ・スミス（1840–1876）/ パブリックドメイン', fit: 'contain'},
	'flood-tablet': {file: 'flood-tablet.jpg', credit: '大英博物館「洪水書版」撮影：Mike Peel / CC BY-SA 4.0', fit: 'contain'},
	quffa: {file: 'quffa.jpg', credit: 'American Colony (Jerusalem) 1932 / パブリックドメイン', position: 'center 60%'},
	'ur-ziggurat': {file: 'ur-ziggurat.jpg', credit: 'Alli Khalil / CC BY-SA 4.0 / Wikimedia Commons'},
	'black-sea': {file: 'black-sea.jpg', credit: 'NASA / パブリックドメイン'},
	'ark-encounter': {file: 'ark-encounter.jpg', credit: "1990'sguy / CC BY-SA 4.0 / Wikimedia Commons", position: 'center 30%'},
	glacier: {file: 'glacier.jpg', credit: 'Hannes Grobe / CC BY-SA 2.5 / Wikimedia Commons'},
	kaizuka: {file: 'kaizuka.jpg', credit: '加曽利貝塚（千葉市）Xser21 / CC BY-SA 4.0 / Wikimedia Commons'},
};
