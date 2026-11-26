"""「もしも全人類が1000年眠ったら」のカット表（render_shot.py が NEKO_SHOTS=shots_1000 のときに読む）。
部品は mk.py（心臓の動画の hk.py の上に足す）、カットは ms1.py（章0〜4）・ms2.py（章5〜9）・ms3.py（章10〜14・エンドカード）。
台本：../03_script.md（SCENE 01〜15 ＝ 章0〜14、章15 ＝ エンドカード）。返り値 meta は mk.MB()（beats=0）"""
from ms3 import *


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
    0: [(-1, kCrossWalk), (2, kCrossStop), (4, kSleepClose), (5, kDriver), (6, kCrossHigh), (7, kSignalRed)],
    1: [(-1, kNightCity), (2, kLightsOut), (3, kStarsAppear), (4, kFewStars), (5, kManyStars), (6, kNobodyLooks)],
    2: [(-1, kPlatformSeep), (2, kSeepWall), (3, kPumpRoom), (4, kTrackFlood), (5, kUenoSection), (6, kWaterRise)],
    3: [(-1, kLowTownRain), (2, kBelowSea), (3, kLevee), (4, kPumpStation), (5, kStreetFlood), (6, kShallowLake)],
    4: [(-1, kTowerWide), (1, kRustStreaks), (3, kSeaWind), (4, kPainters), (5, kEmptyGondola), (6, kRustSpread)],
    5: [(-1, kCross10), (2, kYoungTree), (3, kPaddy), (4, kFieldTrees), (5, kTokyoGreen)],
    6: [(-1, kBambooHill), (2, kBambooRoots), (3, kBambooPush), (4, kBambooDark), (5, kBambooWide)],
    7: [(-1, kDeerStreet), (2, kDeerGraze), (3, kBareSlope), (4, kBoarPlaza), (5, kBoarTown)],
    8: [(-1, kCrowWire), (1, kGarbage), (3, kCrowFewer), (4, kTanuki)],
    9: [(-1, kShibuyaForest), (2, kMeijiForest), (4, kPlanting), (5, kForestSpread), (6, kCross100)],
    10: [(-1, kFujiFar), (2, kFujiErupt), (4, kAshForest), (5, kRebar), (6, kWallCrack), (7, kCollapse)],
    11: [(-1, kPagoda), (3, kPagodaClose), (4, kRepair), (5, kIse), (6, kRepairCycle), (7, kPagodaQuiet)],
    12: [(-1, kMound), (2, kMoundSide), (4, kStoneWall), (5, kBowlBottle), (6, kNoCity), (7, kRemains)],
    13: [(-1, kForestCross), (1, kEyeOpen), (2, kWakeUp), (3, kLookAround), (4, kNoBuildings), (5, kMossStones)],
    14: [(-1, kSunset), (2, kMilkyWay), (4, kLookUp), (6, kPickStone)],
    15: [(-1, kEnd)],
}
