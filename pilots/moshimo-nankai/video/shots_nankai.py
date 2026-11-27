"""「もしも南海トラフ巨大地震が起きたら」のカット表（render_shot.py が NEKO_SHOTS=shots_nankai のときに読む）。
部品は nk.py（千年眠る動画の mk.py の上に足す）、カットは ns1.py（章0〜10）・ns2.py（章11〜20）・ns3.py（章21〜30・エンドカード）。
台本：../03_script.md（SCENE 01〜31 ＝ 章0〜30、章31 ＝ エンドカード）。返り値 meta は nk.NB()"""
from ns1 import *

# 章 -> [(その章の何行目から（-1＝章の頭）, カット関数)]
SHOTS = {
    0: [(-1, nPortNoon), (2, nBento), (3, nPhones), (4, nJolt), (6, nCrawl), (7, nSignsFall), (8, nGlass), (9, nShakeLong)],
    1: [(-1, nMapQuake), (1, nMapTrough), (2, nMapM91), (3, nMapShindo), (4, nOldHouse)],
    2: [(-1, nRunOut), (1, nSpeaker), (3, nElderHand), (4, nChildCarry), (5, nTowerRush), (6, nNoTime)],
    3: [(-1, nSeaView), (1, nWhiteSwell), (3, nQuayOver), (4, nBoatCarry)],
    4: [(-1, nWave2), (2, nLeveeOver), (3, nBlackClose), (5, nCarsFloat), (6, nHouseSwept), (7, nRoofsUnder)],
    5: [(-1, nTowerFlow), (1, nTowerTop), (2, nHomeDrift), (3, nRoofWaver), (4, nNoReach)],
    6: [(-1, nShinjuku), (1, nOffice40), (2, nFloorSway), (3, nSectionGround), (4, nSectionSway), (5, nChairs), (6, nCopier), (7, nNeighbor), (8, nSwayLong)],
    7: [(-1, nElevShafts), (1, nElevInside), (2, nElevButton), (3, nCityElev), (4, nStairs), (5, nStairsCrowd), (6, nLeftBehind)],
    8: [(-1, nShkStop), (1, nTunnel), (2, nBridge), (3, nShkFull), (4, nShk80k), (5, nStadiums), (6, nLightsOff), (7, nDarkWait)],
    9: [(-1, nAirportWater), (1, nRunwaySea), (2, nPlanesSky), (3, nPlanes200), (4, nHolding), (5, nCabin)],
    10: [(-1, nNagoyaLow), (2, nMallEntrance), (3, nStairsFall), (4, nClimbUp), (5, nRailGrip), (6, nKneeWaist), (7, nNoExit), (8, nMallDays)],
}
for _c in range(11, 32):
    SHOTS.setdefault(_c, [(-1, nMallDays)])
