"""「もしも南海トラフ巨大地震が起きたら」のカット表（render_shot.py が NEKO_SHOTS=shots_nankai のときに読む）。
部品は nk.py（千年眠る動画の mk.py の上に足す）、カットは ns1.py（章0〜10）・ns2.py（章11〜20）・ns3.py（章21〜30・エンドカード）。
台本：../03_script.md（SCENE 01〜31 ＝ 章0〜30、章31 ＝ エンドカード）。返り値 meta は nk.NB()"""
from ns3 import *

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
    11: [(-1, nKantoMap), (1, nBeach40), (3, nBeachOver), (4, nThirdFloor), (5, nTokyoBay), (6, nRiverBack), (7, nIzuIsland)],
    12: [(-1, nStationFull), (1, nGates), (2, nSitFloor), (3, nCalls), (4, nDeadPhone), (5, nBoard), (6, nMillions), (7, nTokyoGate)],
    13: [(-1, nMapLater), (2, nEastHalf), (3, nWestQuiet), (4, nNewsAlert), (5, nEvacCall)],
    14: [(-1, nWalkHome), (1, nWalkAerial), (2, nSidewalk), (3, nKonbiniEmpty), (4, nTowerLit)],
    15: [(-1, nKochiNight), (2, nFamilyHill), (3, nLightsStay), (4, nWorkPrep), (5, nCareBed), (6, nTVCalm), (7, nHousesLit), (8, nCalmSea), (9, nEerie)],
    16: [(-1, nPreDawn), (1, nMapWest), (2, nQuake2), (3, nWakeUp), (4, nLightsOut2), (5, nPhoneGlow)],
    17: [(-1, nOffshoreWall), (1, nWave34), (3, nFlashSlope), (4, nWaveBehind), (5, nHilltopLook), (6, nTownEngulf), (7, nEarlyEvac), (8, nStayedHouses), (9, nDawnWater)],
    18: [(-1, nYaizuShake2), (1, nHouseFall2), (2, nFireBack), (3, nWaitRubble)],
    19: [(-1, nTVDisaster), (1, nNoFootage), (2, nNoSignal), (3, nTownList), (4, nHeliGround)],
    20: [(-1, nKiiMount), (1, nSlopeFall), (2, nDamForm), (3, nLakeRise), (4, nDownstream), (5, nVillageLeave)],
    21: [(-1, nGymWide), (2, nCardboard), (3, nArrive), (4, nTapDry), (5, nWaterLine), (6, nToilet), (7, nNightGym)],
    22: [(-1, nYuiWide), (1, nYuiBundle), (2, nYuiArtery), (3, nYuiSlide), (4, nYuiBuried), (5, nYuiMapCut)],
    23: [(-1, nFreightYard), (1, nFreightGoods), (2, nFreightStill), (3, nTruckJam)],
    24: [(-1, nPortStop), (1, nThreeBays), (2, nContainers80), (3, nPortBroken), (4, nShipsWait)],
    25: [(-1, nTownHall), (1, nHallInside), (2, nHospitalDark), (3, nHelpWide)],
    26: [(-1, nSuperOutside), (3, nShelvesSparse), (4, nShelfItems), (5, nNotices), (6, nTokyoStall)],
    27: [(-1, nShelfMemory), (1, nNewsMiyazaki), (2, nNoQuake), (3, nRiceCarts), (4, nRiceBuy), (5, nRiceEmpty), (6, nAnxiety)],
    28: [(-1, nTwoWeeks), (2, nNightWork), (3, nSandbags), (4, nSDFClear), (5, nCombMap), (6, nRoads43k), (7, nRails19k), (8, nMudVolunteers), (9, nSoupKitchen), (10, nTownRepair)],
    29: [(-1, nEdoIntro), (1, nEdoMorning), (2, nKumanoWave), (3, nShimodaShip), (4, nEdoEvening), (5, nEdoMapWest), (6, nKiiVillageWave), (7, nRiceFire), (8, nVillagersClimb),
         (9, nHoeiIntro), (10, nTosaWave), (11, nHighGround), (12, nSameWay)],
    30: [(-1, nMonthLater), (1, nTomeiOpen), (2, nTrucksFirst), (3, nFreightMoves), (4, nShelvesRefill), (5, nSurvey), (6, nFirstFamily)],
    31: [(-1, nEnd)],
}
