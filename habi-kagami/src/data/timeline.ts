// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 3899,
	JudgeEntrance: 1304,
	Clue1Hyakumai: 2407,
	Clue2Nengo: 2105,
	Clue3Shisha: 1615,
	Clue4Keisho3: 2479,
	Clue5Seishi: 3101,
	Clue6Keisho4: 2212,
	Clue7Kazu: 2292,
	Clue8China: 1761,
	Clue9Mei: 2206,
	Clue10Namari: 1756,
	Clue11Sanjigen: 1924,
	Clue12Kurozuka: 2126,
	Clue13Kannai: 1973,
	Clue14Kage: 2669,
	Clue15Densei: 1855,
	Clue16Makyo: 2439,
	Clue17Kami: 2534,
	Clue18Kyodai: 1974,
	Clue19Haifu: 3734,
	Clue20Haka: 2276,
	Clue21Hashihaka: 2518,
	Clue22Makimuku: 2696,
	Clue23Hirabaru: 2270,
	Clue24Yoshinogari: 2471,
	Clue25Tenrankai: 2051,
	RootsStory: 4402,
	UnsolvedMystery: 1542,
	Summary: 5520,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 73960;
