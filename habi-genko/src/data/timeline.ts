// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 5307,
	JudgeEntrance: 840,
	Clue1Letter: 6049,
	Clue2Islands: 3899,
	Clue3Samurai: 4937,
	Clue4Tetsuhau: 4460,
	Clue5Ekotoba: 6494,
	Clue6Storm: 5738,
	Clue7Envoys: 3277,
	Clue8Wall: 5464,
	Clue9Fleet: 4241,
	Clue10Kamikaze: 4877,
	Clue11Survivors: 3558,
	Clue12Wrecks: 5442,
	Clue13Search: 4925,
	Clue14Ships: 5177,
	Clue15Board: 4572,
	Clue16Arrows: 4618,
	Clue17Games: 4472,
	Clue18Bakufu: 5689,
	Clue19Shinkoku: 4170,
	RootsStory: 5066,
	UnsolvedMystery: 3538,
	Summary: 4803,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 111582;
