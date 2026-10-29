// 写真の一覧（scripts/gen_photos.py が credits.json から作る）
export type PhotoInfo = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	readonly fit?: 'cover' | 'contain';
	// 人物の顔が上にある写真は、テロップを下に置く
	readonly labelBottom?: boolean;
};

export const photos: Record<string, PhotoInfo> = {
	'ekotoba-shiraishi': {file: 'ekotoba-shiraishi.jpg', credit: '蒙古襲来絵詞 前巻 絵5 Lyrics: Suenaga Takezaki (possibly handwritten) Painter: (tr / Public domain / Wikimedia Commons'},
	'ekotoba-e8': {file: 'ekotoba-e8.jpg', credit: '蒙古襲来絵詞 前巻 絵8（文永の役の戦闘場面） 竹崎季長 / Public domain / Wikimedia Commons'},
};
