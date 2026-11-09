// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2708,
	JudgeEntrance: 850,
	Clue1Bingham: 4670,
	Clue2Name: 3701,
	Clue3Fortress: 3505,
	Clue4Date: 3246,
	Clue5Virgins: 2546,
	Clue6People: 3447,
	Clue7Spain: 2645,
	Clue8Stone: 3874,
	Clue9Japan: 4395,
	Clue10Lidar: 4940,
	RootsStory: 3662,
	UnsolvedMystery: 2821,
	Summary: 2834,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 49993;
