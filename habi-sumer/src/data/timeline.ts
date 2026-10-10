// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1516,
	JudgeEntrance: 727,
	Clue1Rock: 4971,
	Clue2Words: 5405,
	Clue3Chrysanthemum: 4102,
	Clue4AI: 5926,
	Clue5DNA: 5748,
	RootsStory: 3159,
	UnsolvedMystery: 1805,
	Summary: 2129,
	Closing: 1040,
} as const;

export const TOTAL_FRAMES = 36328;
