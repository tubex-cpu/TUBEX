// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1954,
	JudgeEntrance: 642,
	Clue1Himiko: 5604,
	Clue2Route: 6176,
	Clue3GoldSeal: 3738,
	Clue4Yoshinogari: 4366,
	Clue5Hashihaka: 6667,
	RootsStory: 4561,
	UnsolvedMystery: 1201,
	Summary: 1507,
	Closing: 528,
} as const;

export const TOTAL_FRAMES = 36744;
