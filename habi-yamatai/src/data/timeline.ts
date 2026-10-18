// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1957,
	JudgeEntrance: 642,
	Clue1Himiko: 5598,
	Clue2Route: 6169,
	Clue3GoldSeal: 3734,
	Clue4Yoshinogari: 4370,
	Clue5Hashihaka: 6667,
	RootsStory: 4561,
	UnsolvedMystery: 1204,
	Summary: 1507,
	Closing: 528,
} as const;

export const TOTAL_FRAMES = 36737;
