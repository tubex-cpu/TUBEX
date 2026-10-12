// 動画で使う実写真の一覧。public/photos/ に画像を置き、ここに登録すると図解の代わりに表示される。
// 使ってよい写真：Wikimedia Commons（パブリックドメイン／CCライセンス）や美術館のオープンアクセス画像のみ。
// credit は画面右上と概要欄に載せる出典表記（作者・ライセンス・出典）。
type PhotoEntry = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
};

export const photos: Record<string, PhotoEntry> = {};
