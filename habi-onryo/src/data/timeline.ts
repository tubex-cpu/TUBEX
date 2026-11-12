// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2430,
	JudgeEntrance: 802,
	Clue1Solstice: 3249,
	Clue2Origin: 2868,
	Clue3Regalia: 2702,
	Clue4Mirror: 3051,
	Clue5Hebrew: 2328,
	Clue6Curse: 2487,
	Clue7Dannoura: 2240,
	Clue8Seen: 2466,
	Clue9Sengu: 3522,
	RootsStory: 2850,
	UnsolvedMystery: 2188,
	Summary: 2401,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 35753;
