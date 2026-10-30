// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 3871,
	JudgeEntrance: 828,
	Clue1Name: 4027,
	Clue2Maya: 4109,
	Clue3Queen: 4095,
	Clue4Churchward: 4696,
	Clue5Tablets: 4225,
	Clue6NanMadol: 5937,
	Clue7Curse: 3736,
	Clue8Platinum: 3307,
	Clue9Moai: 4755,
	Clue10Walk: 4539,
	Clue11Settle: 3899,
	Clue12Collapse: 4402,
	Clue13Yonaguni: 5234,
	Clue14Forbidden: 3927,
	Clue15Sandy: 4097,
	Clue16Lemuria: 4158,
	Clue17Seafloor: 5741,
	Clue18Japan: 4315,
	RootsStory: 4597,
	UnsolvedMystery: 4165,
	Summary: 4170,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 96819;
