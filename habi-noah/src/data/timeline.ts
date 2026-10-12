// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1323,
	JudgeEntrance: 862,
	Clue1Ararat: 4884,
	Clue2Tablet: 4572,
	Clue3Layers: 3686,
	Clue4BlackSea: 2974,
	Clue5Animals: 2713,
	RootsStory: 3275,
	UnsolvedMystery: 827,
	Summary: 1636,
	Closing: 960,
} as const;

export const TOTAL_FRAMES = 27512;
