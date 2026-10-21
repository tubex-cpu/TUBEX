// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1682,
	JudgeEntrance: 719,
	Clue1Cry: 5077,
	Clue2Grudge: 6213,
	Clue3Hideyoshi: 5224,
	Clue4Shikoku: 3859,
	Clue5Tenkai: 3595,
	RootsStory: 6250,
	UnsolvedMystery: 1788,
	Summary: 1703,
	Closing: 547,
} as const;

export const TOTAL_FRAMES = 36457;
