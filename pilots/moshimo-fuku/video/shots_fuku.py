"""「もしも世界中から服が消えたら」のカット表（render_shot.py が NEKO_SHOTS=shots_fuku のときに読む）。
部品は fk.py（hk.py から写した fk_base.py の上）、カットは fs1.py（章0〜4）・fs2.py（章5〜9）・fs3.py（章10〜14）。
台本：../03_script.md（SCENE 01〜14 ＝ 章0〜13、章14 ＝ エンドカード）。
決まり：画面の人は、いつも布団・シーツ・カーテン・タオル・ガウン・縫った服で体が隠れている（fk.py の先頭）。"""
from fs3 import *


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
    0: [(-1, fCloset), (3, fMannequins), (4, fBalcony), (5, fNightTown), (6, fSleeper)],
    1: [(-1, fAlarm), (2, fFutonSit), (3, fClosetOpen), (5, fDrawers), (6, fGenkan)],
    2: [(-1, fStation), (2, fTrainDoors), (3, fCurtainsShut), (4, fPeek), (5, fTownShut)],
    3: [(-1, fThermo), (1, fSummer), (2, fTokyoCold), (3, fWarmAir), (4, fHuddle), (5, fBathTowel), (6, fBathNight)],
    4: [(-1, fCurtainsOff), (2, fThreeCloths), (3, fPins), (4, fBareWindows), (5, fTwoCloths), (6, fTug)],
    5: [(-1, fStepOut), (2, fQueue), (3, fAisle), (4, fShelvesEmpty), (5, fFabricRolls)],
    6: [(-1, fCrossStop), (1, fPuzzled), (2, fHospCorr), (3, fPlatform), (4, fUniforms), (5, fSameWraps)],
    7: [(-1, fBandBlue), (2, fBandWhite), (3, fBandRed), (4, fBandsLine)],
    8: [(-1, fStreetOut), (1, fJuggle), (3, fDoorStuck), (4, fBagOn), (5, fBagsTown)],
    9: [(-1, fEmptyStore), (2, fWorldArrows), (3, fFactoryEmpty), (4, fGlobeMorning), (5, fShip)],
    10: [(-1, fLooms), (2, fImabari), (3, fTowelStacks), (4, fSewGown), (5, fGownTruck)],
    11: [(-1, fKojimaLine), (1, fGakuranRack), (2, fThread), (3, fOshiire), (4, fCurtainJacket)],
    12: [(-1, fSchoolRoute), (2, fAdultsWalk), (3, fBandsWalk), (4, fBagsWalk), (5, fStationBusy)],
    13: [(-1, fSewDusk), (1, fShirtUp), (2, fShirtOn), (3, fAncient), (4, fClosetShirt), (5, fDuskTown)],
    14: [(-1, A(fClosetShirt, 'fEnd'))],
}


def _with_blinks(fn):
    """カットを組んだあと、目のまばたきを付ける（名前はそのまま）"""
    def f(n):
        m = fn(n)
        blink_all(n, seed=sum(map(ord, fn.__name__)))
        return m
    f.__name__ = fn.__name__
    return f


for _ch, _rows in SHOTS.items():
    SHOTS[_ch] = [(li, _with_blinks(fn)) for li, fn in _rows]
    for _li, _fn in SHOTS[_ch]:
        globals()[_fn.__name__] = _fn
