// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 6476,
	JudgeEntrance: 783,
	Clue1Kannazuki: 3461,
	Clue2Okugi: 4546,
	Clue3Kojiki: 4259,
	Clue4Kunibiki: 4742,
	Clue5Orochi: 5987,
	Clue6Kojindani: 4357,
	Clue7Swords: 3613,
	Clue8Bells: 3245,
	Clue9Kamo: 5184,
	Clue10Mark: 4545,
	Clue11Burial: 3876,
	Clue12King: 3886,
	Clue13Crossroads: 3750,
	Clue14Iron: 4358,
	Clue15Yuzuri: 7573,
	Clue16Shrine: 7776,
	Clue17Collapse: 3987,
	Clue18Kokuso: 3992,
	Clue19Kamiari: 6319,
	RootsStory: 5062,
	UnsolvedMystery: 2731,
	Summary: 5019,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 109496;
