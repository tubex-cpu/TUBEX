// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1675,
	JudgeEntrance: 647,
	Clue1Age: 5916,
	Clue2Underground: 4201,
	Clue3Quake: 3591,
	Clue4Lift: 5047,
	Clue5Workers: 4476,
	RootsStory: 6136,
	UnsolvedMystery: 2795,
	Summary: 1400,
	Closing: 547,
} as const;

export const TOTAL_FRAMES = 36231;
