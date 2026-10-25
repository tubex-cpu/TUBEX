// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2883,
	JudgeEntrance: 741,
	Clue1Size: 8593,
	Clue2Build: 5010,
	Clue3Craft: 4789,
	Clue4Haniwa: 6001,
	Clue5Baicho: 4144,
	Clue6Nintoku: 7986,
	Clue7Juryo: 3352,
	Clue8Kings: 4929,
	Clue9Name: 5911,
	Clue10Inside: 5834,
	Clue11Boston: 4723,
	Clue12Treasure: 4449,
	Clue13Entry: 3660,
	Clue14Lost: 4760,
	Clue15Now: 3564,
	RootsStory: 9035,
	UnsolvedMystery: 3747,
	Summary: 4023,
	Closing: 440,
} as const;

export const TOTAL_FRAMES = 98174;
