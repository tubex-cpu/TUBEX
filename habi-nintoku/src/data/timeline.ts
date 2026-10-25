// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 1822,
	JudgeEntrance: 730,
	Clue1Size: 5725,
	Clue2Build: 4291,
	Clue3Nintoku: 5632,
	Clue4Inside: 3724,
	Clue5Boston: 3842,
	RootsStory: 6324,
	UnsolvedMystery: 2322,
	Summary: 1685,
	Closing: 432,
} as const;

export const TOTAL_FRAMES = 36329;
