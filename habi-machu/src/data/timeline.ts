// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 3100,
	JudgeEntrance: 792,
	Clue1Size: 2847,
	Clue2History: 3633,
	Clue3Sword: 4463,
	Clue4South: 3123,
	Clue5Mirror: 3042,
	Clue6Coffin: 3393,
	Clue7Mirrors: 3537,
	Clue8Owner: 3193,
	Clue9Tenri: 3269,
	RootsStory: 2763,
	UnsolvedMystery: 1768,
	Summary: 2518,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 41610;
