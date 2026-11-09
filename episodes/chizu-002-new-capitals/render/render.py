"""chizu-002-new-capitals: full render (1920x1080, 30 fps). Free and local.
Reuses the drawing engine of chizu-001 (render_v23.py, Natural Earth base map only — no Blue Marble) and
replaces its episode data (timings, subtitles, shots, credits, output paths).
Usage: python3 render.py --list | --shotlist | --still SEC ... | --chunks i/m | --mux
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent
EP = HERE.parent
R1 = EP.parent / "chizu-001-australia-coast" / "render"
sys.path.insert(0, str(R1))
import render_v23 as R                      # sets the Natural Earth base map (ne_base.install) on import
from render_v23 import (W, H, AMBER, TEAL, RED, INK, MUTED, text, panel, seg, ease, caption_box, note_ne, polyline, arrow)
import base, geo
from PIL import Image, ImageDraw

OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
TIM = json.loads((EP / "audio/timings.json").read_text())
R.EP, R.OUT, R.TIM = EP, OUT, TIM
R.SC = {s["scene"]: s for s in TIM["scenes"]}
R.TOTAL = TIM["scenes"][-1]["end"] + 2.5
R.SUBS = [(c["start"], c["end"], c["lines"]) for c in json.loads((EP / "subtitles.json").read_text())]
R.CREDITS = json.loads((HERE / "credits.json").read_text()) if (HERE / "credits.json").exists() else {}
R.TL = None
R.CITIES = {
    "ワシントン": (-77.04, 38.91), "ニューヨーク": (-74.01, 40.71), "フィラデルフィア": (-75.17, 39.95),
    "ブラジリア": (-47.88, -15.79), "リオデジャネイロ": (-43.17, -22.91),
    "キャンベラ": (149.13, -35.28), "シドニー": (151.21, -33.87), "メルボルン": (144.96, -37.81),
    "アブジャ": (7.49, 9.06), "ラゴス": (3.38, 6.52),
    "ジャカルタ": (106.85, -6.21), "ヌサンタラ": (116.70, -0.97),
}
CAPS = ["ワシントン", "ブラジリア", "キャンベラ", "アブジャ", "ヌサンタラ"]
SIDE = {"ワシントン": "l", "ニューヨーク": "r", "フィラデルフィア": "r", "ブラジリア": "l", "リオデジャネイロ": "r",
        "キャンベラ": "l", "シドニー": "r", "メルボルン": "r", "アブジャ": "r", "ラゴス": "l", "ジャカルタ": "l", "ヌサンタラ": "r"}
TYPE_COL = {"ワシントン": TEAL, "キャンベラ": TEAL, "ブラジリア": AMBER, "アブジャ": (150, 170, 255), "ヌサンタラ": RED}


def L_dots(names, t0=0.2, stagger=0.4, color=AMBER, labels=True, size=40):
    return lambda img, p, t, d: R.dots(img, p, names, t0=t0, t=t, labels=labels, stagger=stagger, color=color, size=size, side=SIDE)


def L_caption(s, t0=0.2):
    return R.L_caption(s, t0)


def L_arrow(a, b, t0=0.5, dur=1.6):
    def fn(img, p, t, d):
        pa = p(*R.CITIES[a]); pb = p(*R.CITIES[b])
        k = seg(t, t0, t0 + dur)
        if k > 0:
            arrow(img, pa[:2], pb[:2], color=AMBER, width=8, prog=k, alpha=min(1, k * 3))
    return fn


def L_dist(a, b, t0=1.2):
    def fn(img, p, t, d):
        km = geo.gc_km(*R.CITIES[a], *R.CITIES[b])
        pa = p(*R.CITIES[a]); pb = p(*R.CITIES[b])
        mx, my = (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2
        text(img, (mx + 20, my - 30), f"直線で約{int(round(km, -1)):,}km", 40, anchor="lm", alpha=seg(t, t0, t0 + 0.6), fill=AMBER)
        R.note(img, "距離は地図上の2点の大円距離（計算値）", seg(t, t0, t0 + 0.6))
    return fn


def L_label(lon, lat, s, t0=0.3, size=44, color=INK):
    return lambda img, p, t, d: text(img, p(lon, lat)[:2], s, size, anchor="mm", fill=color, alpha=seg(t, t0, t0 + 0.6))


def L_globe_caps(names, colors=None, t0=0.2):
    def fn(img, p, t, d):
        for i, n in enumerate(names):
            c = (colors or {}).get(n, AMBER)
            R.dots(img, p, [n], t0=t0 + i * 0.35, t=t, color=c, size=36, side=SIDE)
    return fn


def L_caps_timed(groups):
    def fn(img, p, t, d):
        for names, t0 in groups:
            for n in names:
                R.dots(img, p, [n], t0=t0, t=t, color=TYPE_COL[n], size=38, side=SIDE)
        R.note(img, "正積図法（ランベルト）。地図の端の形はゆがむ")
    return fn


# ---------------------------------------------------------------- globe with layers (dots on the globe)
def r_globe2(t, d, P):
    img = R.r_globe(t, d, {k: v for k, v in P.items() if k != "layers"})
    lon0 = P["lon"][0] + (P["lon"][1] - P["lon"][0]) * ease(t / d)
    lat0 = P["lat"][0] + (P["lat"][1] - P["lat"][0]) * ease(t / d)
    rad = P["r"][0] + (P["r"][1] - P["r"][0]) * ease(t / d)
    p = base.globe_proj(lon0, lat0, rad, W / 2, P.get("cy", 560))
    for fn in P.get("layers", []):
        fn(img, p, t, d)
    return img


# ---------------------------------------------------------------- diagrams
def d_year(year, line1, line2=""):
    def fn(img, t, d):
        text(img, (W / 2, 420), year, 160, anchor="mm", fill=AMBER, alpha=seg(t, 0.1, 0.7), stroke=6)
        text(img, (W / 2, 600), line1, 52, anchor="mm", alpha=seg(t, 0.5, 1.1))
        if line2:
            text(img, (W / 2, 690), line2, 42, anchor="mm", fill=MUTED, alpha=seg(t, 0.9, 1.5), weight="500Medium")
    return fn


TYPES = [("型1", "大都市どうしの\n争いを避ける", "ワシントン・キャンベラ", TEAL), ("型2", "国の内陸を\n開く", "ブラジリア", AMBER),
         ("型3", "どの集団にも\n偏らない場所", "アブジャ", (150, 170, 255)), ("型4", "今の首都が\n限界", "ヌサンタラ", RED)]


def d_four(timing=(0.2, 0.8, 1.4, 2.0), title="首都をゼロから造る、4つの型", show_city=True):
    def fn(img, t, d):
        text(img, (W / 2, 170), title, 58, anchor="mm")
        for i, (k, s, c, col) in enumerate(TYPES):
            a = seg(t, timing[i], timing[i] + 0.6)
            x = W / 2 + (i - 1.5) * 430
            panel(img, (x - 195, 290, x + 195, 760), fill=(16, 28, 50), alpha=0.92 * a, outline=col)
            text(img, (x, 345), k, 40, fill=col, anchor="mm", alpha=a)
            for j, ln in enumerate(s.split("\n")):
                text(img, (x, 460 + j * 66), ln, 50, anchor="mm", alpha=a, stroke=4)
            if show_city:
                text(img, (x, 680), c, 32, fill=MUTED, anchor="mm", alpha=a, weight="500Medium")
    return fn


def d_problems(img, t, d):
    text(img, (W / 2, 200), "ジャカルタの3つの問題", 60, anchor="mm")
    for i, s in enumerate(["渋滞", "大気汚染", "地盤沈下"]):
        a = seg(t, 0.2 + i * 0.7, 0.8 + i * 0.7)
        x = W / 2 + (i - 1) * 520
        panel(img, (x - 220, 360, x + 220, 640), fill=(16, 28, 50), alpha=0.92 * a, outline=RED if i == 2 else TEAL)
        text(img, (x, 500), s, 80, anchor="mm", alpha=a, stroke=5)


def d_deal(img, t, d):
    text(img, (W / 2, 180), "1790年の取引", 60, anchor="mm")
    a, b = seg(t, 0.3, 0.9), seg(t, 1.2, 1.8)
    for x, s, sub, col, k in [(W / 2 - 430, "首都の場所", "ポトマック川のほとり", TEAL, a), (W / 2 + 430, "州の借金", "国がまとめて引き受ける", AMBER, b)]:
        panel(img, (x - 300, 330, x + 300, 640), fill=(16, 28, 50), alpha=0.92 * k, outline=col)
        text(img, (x, 440), s, 66, anchor="mm", alpha=k, stroke=5)
        text(img, (x, 550), sub, 38, fill=MUTED, anchor="mm", alpha=k, weight="500Medium")
    c = seg(t, 2.2, 2.8)
    if c > 0:
        arrow(img, (W / 2 - 110, 450), (W / 2 + 110, 450), color=INK, width=8, alpha=c)
        arrow(img, (W / 2 + 110, 530), (W / 2 - 110, 530), color=INK, width=8, alpha=c)
    R.note(img, "1790年の首都法と借金の肩代わりの法律（米国国立公文書館・議会図書館の解説による）")


def d_legal(img, t, d):
    text(img, (W / 2, 200), "インドネシアの首都は？", 60, anchor="mm")
    a = seg(t, 0.3, 0.9)
    panel(img, (360, 330, 1560, 700), fill=(16, 28, 50), alpha=0.92 * a, outline=RED)
    text(img, (W / 2, 430), "大統領令が出るまで", 54, anchor="mm", alpha=a)
    text(img, (W / 2, 540), "首都はジャカルタ", 84, anchor="mm", alpha=a, fill=AMBER, stroke=5)
    text(img, (W / 2, 640), "2022年の法律で、新しい首都はヌサンタラと決定", 36, anchor="mm", alpha=seg(t, 0.8, 1.4), fill=MUTED, weight="500Medium")


# ---------------------------------------------------------------- the edit
def M(lon, lat, kmpp, **kw):
    return dict(lon=lon, lat=lat, kmpp=kmpp, **kw)


USA = M(-75.6, 39.6, 0.9)
BRA = M(-50.0, -15.5, 4.2)
NGA = M(7.6, 8.6, 1.9)
IDN = M(112.0, -4.0, 3.6)
AUSM = M(134.0, -29.5, 4.0)


def shots():
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    # S01
    add("S01", 4, "globe2", lon=(-30, -55), lat=(15, 10), r=(360, 430), cy=560, why="地球儀から、首都と大都市を見比べる問いを出す")
    add("S01", 4, "map", sent=1, **USA, move=False, layers=[L_dots(["ニューヨーク"], 0.1, 0, TEAL), L_dots(["ワシントン"], 0.6, 0, AMBER)], why="アメリカ：大都市ニューヨークと首都ワシントン")
    add("S01", 4, "map", sent=2, **BRA, move=False, layers=[L_dots(["リオデジャネイロ"], 0.1, 0, TEAL), L_dots(["ブラジリア"], 0.6, 0, AMBER)], why="ブラジル：リオデジャネイロと首都ブラジリア")
    add("S01", 4, "map", sent=3, **AUSM, move=False, layers=[L_dots(["シドニー"], 0.1, 0, TEAL), L_dots(["キャンベラ"], 0.6, 0, AMBER)], why="オーストラリア：シドニーと首都キャンベラ")
    add("S01", 4, "map", sent=4, **NGA, move=False, layers=[L_dots(["ラゴス"], 0.1, 0, TEAL), L_dots(["アブジャ"], 0.6, 0, AMBER)], why="ナイジェリア：ラゴスと首都アブジャ")
    # S02
    add("S02", 6, "globe2", lon=(-60, 20), lat=(10, 5), r=(430, 400), cy=560, layers=[L_globe_caps(["ワシントン", "ブラジリア", "アブジャ"], None, 0.2)], why="4つの首都に共通点があるという問いを、地球儀の上の首都の点で示す")
    add("S02", 4, "map", sent=2, **IDN, move=False, layers=[L_dots(["ジャカルタ"], 0.1, 0, TEAL), L_dots(["ヌサンタラ"], 0.6, 0, RED), L_caption("インドネシアも、新しい首都を造っている", 0.2)], why="インドネシアの今の首都と新しい首都の位置")
    add("S02", 3, "card", sent=3, title="なぜ首都をゼロから造るのか", why="問いを1枚で出す")
    add("S02", 5, "diag", sent=4, fn=d_four((0.2, 0.7, 1.2, 1.7)), why="4つの型を一覧で出す（このあとの章立て）")
    # S03
    add("S03", 3, "card", kicker="型1", title="大都市どうしの争いを避ける", why="章の扉")
    add("S03", 6, "map", sent=1, lon=(-76.0, -75.6), lat=(40.0, 39.6), kmpp=(1.2, 0.9), layers=[L_dots(["ニューヨーク", "フィラデルフィア"], 0.2, 0.4, TEAL), L_caption("どこを首都にするか、州どうしが対立", 0.3)], why="独立直後の東海岸の都市の位置")
    add("S03", 5, "diag", sent=2, fn=d_year("1790年", "首都法：ポトマック川のほとりに新しい首都", "それまでの10年はフィラデルフィアが仮の首都"), why="1790年の首都法を年号カードで示す")
    add("S03", 6, "diag", sent=3, fn=d_deal, why="首都の場所と借金の肩代わりの取引を図で示す")
    # S04
    add("S04", 3, "photo", file="photo_02_philadelphia.jpg", label="フィラデルフィアの独立記念館")
    add("S04", 4, "map", **USA, move=False, layers=[L_dots(["フィラデルフィア"], 0, 0, TEAL), L_dots(["ワシントン"], 0.3, 0, AMBER), L_arrow("フィラデルフィア", "ワシントン", 0.6), L_label(-77.4, 38.6, "ポトマック川", 1.2, 36, MUTED)], why="仮の首都から新しい首都への位置関係")
    add("S04", 3, "photo", sent=2, file="photo_01_us_capitol.jpg", label="アメリカ合衆国議会議事堂（ワシントン、現在）")
    add("S04", 3, "diag", fn=d_year("1800年11月", "議会がワシントンで初めて開かれた"), why="1800年の移転を年号カードで示す")
    # S05
    add("S05", 4, "map", **AUSM, move=False, layers=[L_dots(["シドニー", "メルボルン"], 0.1, 0.3, TEAL), L_dots(["キャンベラ"], 0.8, 0, AMBER), L_caption("前回の動画：キャンベラ", 0.2)], why="前回の動画の地図に戻り、キャンベラの位置を示す")
    add("S05", 5, "map", sent=1, lon=150.0, lat=-34.4, kmpp=0.55, move=False, layers=[R.L_circle(0.3)], why="シドニーから100マイルの憲法の条件を、縮尺どおりの円で示す")
    add("S05", 3, "diag", fn=d_year("1908年", "連邦議会が首都の場所を決定"), why="1908年の決定")
    add("S05", 3, "photo", sent=2, file="photo_11_canberra.jpg", label="キャンベラ")
    add("S05", 2, "diag", fn=d_year("1927年", "議会がキャンベラで初めて開かれた"), why="1927年の議会")
    # S06
    add("S06", 3, "card", kicker="型2", title="国の内陸を開く", why="章の扉")
    add("S06", 3, "photo", sent=1, file="photo_04_rio.jpg", label="リオデジャネイロ（大西洋岸）")
    add("S06", 2, "map", **BRA, move=False, layers=[L_dots(["リオデジャネイロ"], 0, 0, TEAL)], why="リオが海岸にあることを地図で示す")
    add("S06", 8, "map", sent=2, lon=(-46.0, -48.0), lat=(-19.0, -16.0), kmpp=(4.2, 3.0), layers=[L_dots(["リオデジャネイロ"], 0, 0, TEAL), L_label(-48.0, -14.2, "国の中央の高原", 0.8, 48), L_caption("1891年 憲法：国の中央の高原に首都の土地", 0.3)], why="1891年の憲法の条文が示す場所（国の中央の高原）を地図で示す。区域の境界は描かない")
    # S07
    add("S07", 5, "map", **BRA, move=False, layers=[L_dots(["リオデジャネイロ"], 0, 0, TEAL), L_dots(["ブラジリア"], 0.4, 0, AMBER), L_arrow("リオデジャネイロ", "ブラジリア", 0.6), L_dist("リオデジャネイロ", "ブラジリア", 1.6)], why="海岸の旧首都から内陸の新首都への距離")
    add("S07", 5, "diag", sent=1, fn=d_year("1960年4月21日", "ブラジリアが新しい首都に", "1956年に建設開始"), why="建設開始と開都の年")
    add("S07", 3, "photo", sent=2, file="photo_03_brasilia_congress.jpg", label="ブラジリアの国会議事堂（設計：オスカー・ニーマイヤー）")
    add("S07", 3, "map", lon=-47.88, lat=-15.79, kmpp=0.6, move=False, layers=[L_dots(["ブラジリア"], 0, 0, AMBER), L_caption("計画：ルシオ・コスタ　建物：オスカー・ニーマイヤー", 0.1)], why="計画した人の名前を、首都の位置の地図に添える")
    # S08
    add("S08", 3, "card", kicker="型3", title="どの集団にも偏らない場所", why="章の扉")
    add("S08", 3, "photo", sent=1, file="photo_05_lagos.jpg", label="ラゴス（マリーナ地区）")
    add("S08", 2, "map", **NGA, move=False, layers=[L_dots(["ラゴス"], 0, 0, TEAL)], why="ラゴスが南西の海岸にあることを地図で示す")
    add("S08", 4, "map", sent=2, **NGA, move=False, layers=[L_dots(["ラゴス"], 0, 0, TEAL), L_caption("多くの民族と宗教", 0.2)], why="多くの民族と宗教がある国だという語りを国の地図で受ける（分布は示さない）")
    add("S08", 7, "diag", sent=3, fn=d_year("1975年", "政府の委員会が首都の場所を見直す", "翌1976年、首都をラゴスから移すことが決まる"), why="1975年の委員会と1976年の決定")
    # S09
    add("S09", 6, "map", **NGA, move=False, layers=[L_dots(["ラゴス"], 0, 0, TEAL), L_dots(["アブジャ"], 0.3, 0, AMBER), L_arrow("ラゴス", "アブジャ", 0.6), L_caption("国の中央、どこにも偏らない土地", 0.3)], why="ラゴスから国の中央のアブジャへ")
    add("S09", 3, "photo", sent=1, file="photo_06_abuja.jpg", label="アブジャ（奥はアソ・ロック）")
    add("S09", 3, "diag", fn=d_year("1991年12月", "政府がラゴスからアブジャに移った"), why="1991年の移転")
    # S10
    add("S10", 3, "card", kicker="型4", title="今の首都が限界", why="章の扉")
    add("S10", 4, "map", sent=1, lon=(110.0, 106.8), lat=(-5.0, -6.3), kmpp=(3.0, 0.9), layers=[L_dots(["ジャカルタ"], 0.3, 0, TEAL), L_caption("ジャワ島の北の海岸", 0.3)], why="ジャカルタがジャワ島の北の海岸にあることを地図で示す")
    add("S10", 3, "diag", sent=2, fn=d_problems, why="渋滞・大気汚染・地盤沈下の3つを読み上げに合わせて出す（インドネシアの建物の写真は、パノラマの自由がないため使わない）")
    add("S10", 4, "map", sent=3, lon=106.8, lat=-6.3, kmpp=0.9, move=False, layers=[L_dots(["ジャカルタ"], 0, 0, TEAL), L_caption("地盤沈下で、街の一部が沈む", 0.1)], why="地盤沈下の語りを位置の地図で受ける（沈下の分布は示さない）")
    # S11
    add("S11", 4, "map", **IDN, move=False, layers=[L_dots(["ジャカルタ"], 0, 0, TEAL), L_dots(["ヌサンタラ"], 0.3, 0, RED), L_arrow("ジャカルタ", "ヌサンタラ", 0.6), L_label(114.5, 0.8, "ボルネオ島（カリマンタン）", 1.0, 40, MUTED)], why="ジャカルタからボルネオ島の新首都へ")
    add("S11", 2, "diag", fn=d_year("2022年", "法律で新しい首都ヌサンタラを決定"), why="2022年の法律")
    add("S11", 6, "diag", sent=1, fn=d_legal, why="法律の上の首都はまだジャカルタであることを示す（2026年5月の憲法裁判所の判断を含む）")
    add("S11", 3, "diag", sent=3, fn=d_year("2026年11月時点", "首都の移転は、まだ終わっていない"), why="移転が終わっていないことを示す（公開直前に確認）")
    # S12
    add("S12", 3, "globe2", lon=(130, 40), lat=(-10, 5), r=(400, 300), cy=560, why="世界地図に戻る")
    add("S12", 14, "map", sent=1, lon=50.0, lat=-22.0, kmpp=19.0, move=False,
        layers=[L_caps_timed([(["ワシントン", "キャンベラ"], 0.2), (["ブラジリア"], 3.9), (["アブジャ"], 6.6), (["ヌサンタラ"], 10.1)])],
        why="4つの型の首都を、読み上げに合わせて世界地図の上に出す（正積図法。端はゆがむ）")
    # S13
    add("S13", 9, "diag", fn=d_four((0.0, 0.0, 0.0, 0.0), "首都の場所を決めるのは、政治の決断"), why="結論の文を4つの型の一覧で受ける")
    add("S13", 4, "globe2", sent=2, lon=(100, 140), lat=(-10, 0), r=(420, 320), cy=560, layers=[L_globe_caps(CAPS, TYPE_COL, -1)], why="地球全体へ引いて締める")
    # S14
    add("S14", 10, "card", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
    return S


R.HEAD = {"S01": "首都と大都市", "S02": "4つの共通点", "S03": "型1 大都市どうしの争いを避ける", "S04": "型1 ワシントン",
          "S05": "型1 キャンベラ", "S06": "型2 国の内陸を開く", "S07": "型2 ブラジリア", "S08": "型3 偏らない場所",
          "S09": "型3 アブジャ", "S10": "型4 今の首都の限界", "S11": "型4 ヌサンタラ", "S12": "4つの型を重ねる", "S13": "首都の場所を決めるもの", "S14": ""}
R.shots = shots
_orig_shot_frame = R.shot_frame


def shot_frame(s, t):
    if s["kind"] == "globe2":
        R._NOTE_Y[0] = 40
        return r_globe2(t - s["start"], s["end"] - s["start"], s["P"])
    return _orig_shot_frame(s, t)


R.shot_frame = shot_frame
_orig_drift = R.drift


def frame(t):
    return R.frame(t)


def render(t0, t1, path):
    n0, n1 = int(round(t0 * R.FPS)), int(round(t1 * R.FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(R.FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(path)], stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n / R.FPS).tobytes())
    p.stdin.close(); p.wait()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--still", type=float, nargs="*")
    ap.add_argument("--chunks")
    ap.add_argument("--mux", action="store_true")
    ap.add_argument("--list", action="store_true")
    ap.add_argument("--shotlist", action="store_true")
    a = ap.parse_args()
    if a.list:
        for s in R.timeline():
            print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['scene']} {s['kind']:6s} {s['P'].get('file') or s['P'].get('label') or s['P'].get('title') or ''}")
        return
    if a.shotlist:
        tl = R.timeline()
        for s in tl:
            if s["kind"] == "globe2":
                s["kind"] = "globe"
        R.timeline = lambda: tl
        (EP / "shotlist.md").write_text("# カット表（render/render.py から自動生成）\n\n実写は1カット3秒以内・1素材1回。地図・図解を長く見せる区間は「長く見せる根拠」に書く。地図は Natural Earth（衛星画像ではない）。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(frame(t)).save(OUT / f"still_{t:07.2f}.jpg", quality=88)
        return
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        n = int(math.ceil(R.TOTAL / 10.0))
        for c in range(i - 1, n, m):
            dst = OUT / f"c_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c_{c:03d}.tmp.mp4"
            render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c_[0-9][0-9][0-9].mp4"))
        assert len(parts) == int(math.ceil(R.TOTAL / 10.0)), len(parts)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"),
                        "-i", str(OUT / "mix.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-002-new-capitals_full_v1.mp4")], check=True)


if __name__ == "__main__":
    main()
