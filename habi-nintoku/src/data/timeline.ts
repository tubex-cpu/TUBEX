// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2964,
	JudgeEntrance: 761,
	Clue1Size: 9035,
	Clue2Build: 5158,
	Clue3Craft: 5376,
	Clue4Haniwa: 6179,
	Clue5Baicho: 4270,
	Clue6Nintoku: 8103,
	Clue7Juryo: 3642,
	Clue8Kings: 5078,
	Clue9Name: 6088,
	Clue10Inside: 6063,
	Clue11Boston: 4852,
	Clue12Treasure: 4578,
	Clue13Entry: 3916,
	Clue14Lost: 4878,
	Clue15Heritage: 3664,
	Clue16Now: 3667,
	RootsStory: 8975,
	UnsolvedMystery: 3854,
	Summary: 4341,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 105471;
