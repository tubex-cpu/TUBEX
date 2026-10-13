// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1614,
	JudgeEntrance: 862,
	Clue1Ararat: 7229,
	Clue2Tablet: 6431,
	Clue3Layers: 4292,
	Clue4BlackSea: 4142,
	Clue5Animals: 4858,
	RootsStory: 4557,
	UnsolvedMystery: 827,
	Summary: 1636,
	Closing: 960,
} as const;

export const TOTAL_FRAMES = 37208;
