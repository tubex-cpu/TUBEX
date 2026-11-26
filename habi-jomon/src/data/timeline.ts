// scripts/build-voice.py で自動生成。ナレーション音声の長さから決まるシーンの尺（フレーム）
export const TRANSITION_FRAMES = 20;

export const sceneDurations = {
	Intro: 2597,
	JudgeEntrance: 1002,
	Clue1Nagasa: 2003,
	Clue2Doki: 1228,
	Clue3Kawari: 1973,
	Clue4Bunmei: 1505,
	Clue5Kari: 1187,
	Clue6Teiju: 1323,
	Clue7Kuri: 1675,
	Clue8Chozo: 1153,
	Clue9Urushi: 1383,
	Clue10Denpun: 2172,
	Clue11Samusa: 1856,
	Clue12Funka: 1795,
	Clue13Senso: 1975,
	Clue14Heiwa: 1679,
	Clue15Koeki: 1371,
	Clue16Yayoi: 1361,
	Clue17Dogu: 1634,
	Clue18Kowasu: 1499,
	Clue19Basshi: 1296,
	Clue20Kanjo: 1330,
	Clue21Jinko: 1468,
	Clue22Kanrei: 1521,
	Clue23Horobi: 1768,
	Clue24Shometsu: 1166,
	RootsStory: 2756,
	UnsolvedMystery: 1307,
	Summary: 4745,
	Closing: 449,
} as const;

export const TOTAL_FRAMES = 49597;
