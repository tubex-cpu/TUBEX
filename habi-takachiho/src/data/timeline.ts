// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2278,
	JudgeEntrance: 861,
	Clue1Kagura: 2938,
	Clue2History: 2112,
	Clue3Iwato: 3354,
	Clue4Shrine: 2730,
	Clue5Descent: 2901,
	Clue6Eclipse: 3275,
	Clue7Himiko: 2859,
	Clue8Uzume: 2650,
	Clue9Future: 2456,
	Clue10Unesco: 2077,
	RootsStory: 2530,
	UnsolvedMystery: 1572,
	Summary: 2632,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 37374;
