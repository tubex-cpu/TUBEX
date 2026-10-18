// 動画で使う実写真の一覧（public/photos/credits.json をもとに作る）
type PhotoEntry = {
	readonly file: string;
	readonly credit: string;
	readonly position?: string;
	readonly fit?: 'cover' | 'contain';
};

export const photos: Record<string, PhotoEntry> = {};
