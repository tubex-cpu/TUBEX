"""「もしも全生物の心臓が2つになったら？」のカット表（render_shot.py が NEKO_SHOTS=shots_hearts のときに読む）。
部品は hk.py、カットは hs1.py（章0〜7）・hs2.py（章8〜15）・hs3.py（章16〜23）。猫の動画の kit.py / shots.py / shots_v5.py の上に作る。
返り値 meta：M(meows, bed, amb) に 'beats'（二つの鼓動の音量 0〜1。虫・海の場面〈SCENE 09・10〉は 0）を足す。
台本：../03_script.md（SCENE 01〜23 ＝ 章0〜22、章23 ＝ エンドカード）"""
from hs3 import *


def A(fn, name, **ov):
    """既存のカットを、名前を変えて別カットとして使い回す"""
    def f(n):
        m = fn(n); m.update(ov)
        return m
    f.__name__ = name
    globals()[name] = f
    return f


# 章 -> [(その章の何行目から（-1＝章の頭）, カット関数)]
SHOTS = {
    0: [(-1, hTrainPOV), (2, hChestYou), (4, hChestTwo), (7, hWatch), (9, hTrainCrowd), (10, hLineup), (11, hTrainCity)],
    1: [(-1, hCheeks), (3, hPalm), (5, hPulse), (8, hJacket), (10, hDoorOpen)],
    2: [(-1, hNurseStation), (3, hStetho), (5, hReboot), (7, hDocSelf), (10, hAlarmsOff)],
    3: [(-1, hElderBed), (1, hTwoHeartsBody), (4, A(hElderBed, 'hElderBed2')), (5, hNeighborBed)],
    4: [(-1, hOffice), (2, hChestSlow), (3, hWatchDrop), (5, hShareWork), (8, hStairs)],
    5: [(-1, hMeetingTummy), (1, hBowlHalf), (6, hOnigiriCompare), (7, hJapanBowls), (8, hKonbini), (9, hKyushoku)],
    6: [(-1, hLapCat), (2, hDogMore), (4, hHamster), (5, hGoldfish), (6, hParakeet), (7, hBowls3), (9, hFoodBag)],
    7: [(-1, hAquaKeeper), (2, hOctoHearts), (5, hOctoSwim), (7, hOctoLaps), (9, hOctoFly)],
    8: [(-1, hAntLine), (2, hMosquito), (3, hAntBody), (7, A(hBugsNormal, 'hBugsSame')), (8, hWormSoil), (10, hWormRings), (11, hBugsNormal)],
    9: [(-1, hSeaJelly), (2, hJellyClose), (4, hAnemone), (5, hSponge), (6, hPlanaria), (7, hSeaWide), (9, A(hSeaJelly, 'hSeaJelly2'))],
    10: [(-1, hBedChild), (3, hKidCount), (5, hKidAsleep), (6, hCeiling), (10, hNightTown)],
    11: [(-1, hPlatformCrouch), (2, hAEDRun), (3, hFlicker), (6, hSitBack), (8, hAmbulance)],
    12: [(-1, hERNight), (1, hCauseCard), (2, hQuietStreet), (5, hDocWaves), (9, hWeakHeal)],
    13: [(-1, hBloodQueue), (3, hBloodBody), (7, hBagShow), (8, hBagsFill)],
    14: [(-1, hWaitRoom), (2, hCalMarks), (3, hNewHeart), (5, hCorridor), (7, hListScreen), (8, hCalendar)],
    15: [(-1, hLifeTable), (3, hGraphLine), (5, hPamphlet), (6, hPension)],
    16: [(-1, hSportsStart), (2, hFinishBreath), (3, hLungsBody), (5, hRankFlags), (7, hStadium), (10, hWalkHome)],
    17: [(-1, hCowsHay), (1, hPigsChickens), (3, hFeedTruck), (4, hMilkEggs), (8, hPriceTags), (9, hEatAll)],
    18: [(-1, hBearAcorns), (2, hBearDen), (6, hBearKaki), (8, hKakiHarvest), (9, hBorder)],
    19: [(-1, hSavanna), (3, hChase), (5, hCatchCard), (6, hCheetahRest), (9, hGrassTop)],
    20: [(-1, hSpringForest), (4, hForestGrain), (5, hFawnsCompare), (6, hHerdsShrink), (10, hForestWide)],
    21: [(-1, hGlobeLife), (3, hBalance), (6, A(hBugsNormal, 'hBugsDense')), (7, hFieldsShip), (9, hGlobeEnd)],
    22: [(-1, A(hTrainPOV, 'hTrainPOV2')), (1, hWindowOut), (3, A(hChestTwo, 'hChestTwo2')), (6, hWatchQuiet), (7, hTrainTummy),
         (9, A(hChestYou, 'hChestYou2')), (11, hOnigiriBag)],
    23: [(-1, A(hEnd, 'hEnd', beats=0.3))],
}
