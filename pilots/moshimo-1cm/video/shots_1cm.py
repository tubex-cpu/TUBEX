"""「もしも全人類が1cmになったら」のカット表（render_shot.py が NEKO_SHOTS=shots_1cm のときに読む）。
部品は tk.py、カットは t1.py（章0〜7）・t2.py（章8〜14 とエンドカード）。猫の動画の kit.py / shots*.py と心臓の動画の hk.py の上に作る。
返り値 meta：MB(amb, meows, bed, purr)。心臓の音はこの動画にない（beats=0）。purr は猫ののどの音（audio.py）。
台本：../03_script.md（SCENE 01〜15 ＝ 章0〜14、章15 ＝ エンドカード）"""
from t2 import *


def A(fn, name, **ov):
    """既存のカットを、名前を変えて別カットとして使い回す（shots_v5.A は使わない）"""
    def f(n):
        m = fn(n); m.update(ov)
        return m
    f.__name__ = name
    globals()[name] = f
    return f


# 章 -> [(その章の何行目から（-1＝章の頭）, カット関数)]
SHOTS = {
    0: [(-1, tEye), (3, tCatLook), (5, tNose), (6, tRoomWide), (7, tPawUp)],
    1: [(-1, tRun), (3, tPillow), (5, tEdge)],
    2: [(-1, tCatBehind), (2, tDropView), (3, tFall), (6, tLanded), (8, tAntDrop)],
    3: [(-1, tStairTop), (2, tFamilyBelow), (4, tStairJump), (6, tStairWall)],
    4: [(-1, tTownStill), (2, tStationStill), (4, tCurbDown), (6, tAntsPeople)],
    5: [(-1, tKitchenFloor), (3, tBite), (5, tFamilyGrain)],
    6: [(-1, tShiver), (2, tLint), (3, tShrew), (4, tNibble)],
    7: [(-1, tDoorGap), (2, tRain), (5, tLeafShelter)],
    8: [(-1, tAntGuest), (3, tSpider), (7, tAntLeaves)],
    9: [(-1, tShadowPass), (3, tSparrow), (5, tCrowWire), (7, tPotHide)],
    10: [(-1, tJapanDots), (2, tVillage), (4, tOnigiriShelf), (5, tRiceField)],
    11: [(-1, tRiceBag), (3, tRatShadow), (5, tAlleyRats), (6, tHolding)],
    12: [(-1, tGoldEyes), (2, tCatCrouch), (3, tPounce), (6, tPawFloor)],
    13: [(-1, tShelfLife), (3, tCatSleep), (5, tWindowCats), (6, tNeighbor)],
    14: [(-1, A(tEye, 'tEye2')), (3, tEyeClose), (5, tFurSleep)],
    15: [(-1, tEnd)],
}
