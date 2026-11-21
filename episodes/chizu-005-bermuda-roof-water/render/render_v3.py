"""chizu-005-bermuda-roof-water v3 (long, 20 min; 社長 2026-11-12「これ動画尺は、２０分〜３０分にして」).
Reuses render.py (v2: relief base map, diagrams, Codex image slots, no on-screen notes or labels at the corners) and
replaces the episode data with audio_v3 / subtitles_v3 / 05_script_v3_long.md. render.py and the v2 outputs are unchanged.
Usage: python3 render_v3.py --list | --shotlist | --still SEC ... | --chunks i/m | --mux
"""
import argparse, json, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import render as B
from render import (R, W, H, AMBER, TEAL, RED, INK, MUTED, text, panel, seg, ease, arrow, layer, put, house, roof, rain, label,
                   WHITE, WALLS, WATER, SEA, LIME, SOIL, d_roofs, d_section, d_lens, d_steps, d_old, d_law, d_tank, d_big,
                   d_year, d_flow, d_quote, d_summary, L_dots, L_arrow, L_dist)

EP = HERE.parent
OUT = HERE / "out"
TIM = json.loads((EP / "audio_v3/timings.json").read_text())
R.TIM = TIM
R.SC = {s["scene"]: s for s in TIM["scenes"]}
R.TOTAL = TIM["scenes"][-1]["end"] + 2.5
R.SUBS = [(c["start"], c["end"], c["lines"]) for c in json.loads((EP / "subtitles_v3.json").read_text())]
R.TL = None
R.CITIES.update({
    "ジェームズタウン": (-76.78, 37.21), "セント・ジョージズ": (-64.677, 32.381), "デヴォンシャー": (-64.75, 32.31),
    "サマセット": (-64.865, 32.29), "タインズ・ベイ": (-64.757, 32.305),
    "ジブラルタル": (-5.35, 36.14), "マジュロ": (171.27, 7.07), "フナフティ": (179.19, -8.52), "米領ヴァージン諸島": (-64.93, 18.34),
    "アデレード": (138.60, -34.93), "東京": (139.79, 35.70), "マルタ": (14.45, 35.90),
})
B.SIDE.update({"ジェームズタウン": "l", "セント・ジョージズ": "r", "デヴォンシャー": "r", "サマセット": "l", "タインズ・ベイ": "l",
               "ジブラルタル": "r", "マジュロ": "r", "フナフティ": "r", "米領ヴァージン諸島": "r", "アデレード": "r", "東京": "r", "マルタ": "r"})
SKY = (16, 28, 50)


def title(img, s, t, t0=0.1, y=150, size=54):
    text(img, (W / 2, y), s, size, anchor="mm", alpha=seg(t, t0, t0 + 0.6))


from draw import text_w


def d_big(num, sub, note=""):
    """Big number card; the number shrinks to fit the frame width."""
    size = 170
    while size > 80 and text_w(num, size) > 1700:
        size -= 6
    def fn(img, t, d):
        text(img, (W / 2, 440), num, size, anchor="mm", fill=AMBER, alpha=seg(t, 0.1, 0.7), stroke=6)
        text(img, (W / 2, 630), sub, 48 if text_w(sub, 48) < 1700 else 40, anchor="mm", alpha=seg(t, 0.5, 1.1))
    return fn


# ---------------------------------------------------------------- new diagrams
def d_seamount(img, t, d):
    L, dr = layer()
    sea_y = 360
    dr.rectangle([0, sea_y, W, H], fill=SEA + (255,))
    dr.polygon([(260, 900), (760, 470), (1160, 470), (1660, 900)], fill=(70, 66, 72, 255))
    dr.rectangle([0, 900, W, H], fill=(46, 44, 50, 255))
    k = seg(t, 1.5, 4.0)
    if k > 0:
        dr.polygon([(700, 470), (1220, 470), (1180, 470 - 140 * k), (740, 470 - 140 * k)], fill=LIME + (255,))
    put(img, L, seg(t, 0, 0.5))
    label(img, (960, 700), "古い火山（海山）", seg(t, 0.5, 1.1))
    label(img, (960, 260), "石灰岩の層（約15〜100m）", seg(t, 2.5, 3.1), color=AMBER)
    label(img, (180, sea_y - 40), "海面", seg(t, 0.3, 0.9), 38, MUTED)


def d_dune(img, t, d):
    L, dr = layer()
    dr.rectangle([0, 620, W, H], fill=SEA + (255,))
    dr.polygon([(0, 620), (1920, 620), (1920, 560), (0, 600)], fill=(226, 206, 160, 255))
    k = seg(t, 0.8, 3.5)
    dr.polygon([(700, 590), (1150, 590 - 260 * k), (1650, 575)], fill=(226, 206, 160, 255) if t < 5 else LIME + (255,))
    rng = np.random.default_rng(5)
    for i in range(80):
        p = (t * 0.4 + rng.uniform()) % 1.0
        x = 200 + p * 1100; y = 580 - p * 200 * rng.uniform(0.3, 1.0)
        dr.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(240, 226, 190, 220))
    put(img, L, seg(t, 0, 0.5))
    arrow(img, (240, 380), (700, 380), color=INK, width=8, alpha=seg(t, 0.3, 0.9))
    label(img, (470, 320), "風", seg(t, 0.3, 0.9))
    label(img, (300, 700), "浜の砂（サンゴや貝のかけら）", seg(t, 0.2, 0.8), 40)
    label(img, (1180, 250), "砂丘 → 固まった石", seg(t, 2.5, 3.1), 46, AMBER)


def d_soak(img, t, d):
    L, dr = layer()
    dr.rectangle([260, 420, 1660, 860], fill=LIME + (255,))
    rng = np.random.default_rng(9)
    for i in range(160):
        x, y = rng.uniform(280, 1640), rng.uniform(440, 840)
        dr.ellipse([x - 9, y - 6, x + 9, y + 6], fill=(150, 132, 100, 255))
    rain(dr, t, 280, 1640, 100, 410, 70, 0.9)
    for j in range(16):
        x = 330 + j * 85; p = (t * 0.5 + j * 0.13) % 1.0
        dr.line([(x, 430), (x + 8, 430 + p * 400)], fill=WATER + (230,), width=6)
    put(img, L, seg(t, 0, 0.5))
    label(img, (960, 360), "すき間の多い石灰岩", seg(t, 0.3, 0.9))
    label(img, (960, 640), "雨はしみ込む", seg(t, 1.2, 1.8), color=WATER)


def d_gh(pump=False):
    def fn(img, t, d):
        L, dr = layer()
        ys = 520
        dr.rectangle([0, ys, W, 900], fill=SEA + (255,))
        top, bot = 470, 860
        if pump:
            k = seg(t, 1.0, 4.0); top = 470 + 25 * k; bot = 860 - 240 * k
        xs = np.linspace(360, 1560, 80)
        tt = ys - (ys - top) * np.sin(np.pi * (xs - 360) / 1200)
        bb = ys + (bot - ys) * np.sin(np.pi * (xs - 360) / 1200)
        dr.polygon(list(zip(xs, tt)) + list(zip(xs[::-1], bb[::-1])), fill=WATER + (255,))
        dr.line([(0, ys), (W, ys)], fill=(255, 255, 255, 200), width=3)
        put(img, L, seg(t, 0, 0.5))
        label(img, (150, ys - 30), "海面", seg(t, 0.2, 0.8), 36, MUTED)
        a = 0.0 if pump else seg(t, 0.8, 1.4)
        if a > 0:
            dr2 = ImageDraw.Draw(img)
            dr2.line([(1640, top), (1640, ys)], fill=AMBER, width=6); dr2.line([(1640, ys), (1640, bot)], fill=INK, width=6)
        label(img, (1760, (top + ys) / 2), "1", a, 54, AMBER)
        label(img, (1760, (ys + bot) / 2), "40", 0.0 if pump else seg(t, 1.4, 2.0), 54)
        label(img, (960, 300), "くみ上げすぎると、淡水の層は下から薄くなる" if pump else "海面の上に1なら、下へおよそ40", seg(t, 0.2, 0.8), 48)
        if pump:
            label(img, (960, 760), "海水が入り込む", seg(t, 2.5, 3.1), 50, RED)
    return fn


def d_lens_asym(img, t, d):
    L, dr = layer()
    ys = 520
    dr.rectangle([0, ys, W, 940], fill=SEA + (255,))
    dr.rectangle([300, 380, 960, 900], fill=(196, 178, 140, 255))
    dr.rectangle([960, 380, 1620, 900], fill=(226, 208, 168, 255))
    xs = np.linspace(380, 1540, 80)
    bb = ys + 230 * np.sin(np.pi * (xs - 380) / 1160) * np.where(xs < 960, 1.0, 0.7)
    dr.polygon([(x, ys) for x in xs] + list(zip(xs[::-1], bb[::-1])), fill=WATER + (235,))
    put(img, L, seg(t, 0, 0.5))
    label(img, (630, 330), "北側の岩", seg(t, 0.4, 1.0))
    label(img, (1290, 330), "南側の岩", seg(t, 0.8, 1.4))
    label(img, (960, 220), "岩の水の通しやすさが違う → レンズの形も違う", seg(t, 1.4, 2.0), 46, AMBER)


def d_slate(img, t, d):
    L, dr = layer()
    steps = [(seg(t, 0.2, 0.8), "木の垂木", (120, 86, 52)), (seg(t, 1.0, 1.6), "石灰岩の板", (200, 196, 186)),
             (seg(t, 1.8, 2.4), "セメント", (160, 160, 156)), (seg(t, 2.6, 3.2), "白い石灰", WHITE)]
    for i, (a, s, col) in enumerate(steps):
        if a <= 0:
            continue
        y0 = 720 - i * 90
        for j in range(8 - i):
            x0 = 360 + i * 60 + j * 150
            dr.rectangle([x0, y0 - 70, x0 + 140, y0], fill=col + (int(255 * a),))
        label(img, (1640, y0 - 35), s, a, 44, anchor="lm")
    put(img, L, 1.0)
    label(img, (960, 170), "白い屋根のつくり", seg(t, 0.1, 0.6), 54)


def d_mesh(img, t, d):
    L, dr = layer()
    dr.rectangle([0, 600, W, H], fill=SOIL + (255,))
    dr.rectangle([500, 640, 1300, 880], fill=(60, 60, 64, 255), outline=(170, 170, 170, 255), width=6)
    dr.rectangle([520, 760, 1280, 860], fill=WATER + (255,))
    dr.rectangle([480, 610, 1320, 640], fill=(150, 150, 150, 255))
    dr.rectangle([1300, 700, 1560, 726], fill=(200, 200, 196, 255))
    dr.rectangle([1540, 560, 1566, 726], fill=(200, 200, 196, 255))
    for k in range(6):
        dr.line([(1520 + k * 10, 520), (1520 + k * 10, 560)], fill=(220, 220, 220, 255), width=2)
        dr.line([(1520, 520 + k * 8), (1586, 520 + k * 8)], fill=(220, 220, 220, 255), width=2)
    put(img, L, seg(t, 0, 0.5))
    label(img, (900, 570), "しっかり閉めたふた", seg(t, 0.4, 1.0), 42)
    label(img, (1550, 460), "あふれ管の口に金網", seg(t, 1.0, 1.6), 42, AMBER)
    label(img, (300, 480), "蚊を入れない", seg(t, 1.8, 2.4), 52)


def d_measure(img, t, d):
    L, dr = layer()
    x0, y0, w, h, dx, dy = 660, 420, 520, 300, 220, -140
    dr.polygon([(x0, y0), (x0 + w, y0), (x0 + w + dx, y0 + dy), (x0 + dx, y0 + dy)], fill=(120, 190, 240, 255))
    dr.polygon([(x0 + w, y0), (x0 + w + dx, y0 + dy), (x0 + w + dx, y0 + dy + h), (x0 + w, y0 + h)], fill=(70, 140, 200, 255))
    dr.rectangle([x0, y0, x0 + w, y0 + h], fill=(90, 160, 220, 255))
    put(img, L, seg(t, 0, 0.5))
    label(img, (x0 + w / 2, y0 + h + 50), "縦4m", seg(t, 0.6, 1.2), 44)
    label(img, (x0 + w + dx / 2 + 70, y0 + dy / 2 + h + 20), "横4m", seg(t, 1.0, 1.6), 44)
    label(img, (x0 - 110, y0 + h / 2), "深さ2.5m", seg(t, 1.4, 2.0), 44)
    label(img, (960, 170), "4 × 4 × 2.5 ＝ 40立方メートル ＝ 4万リットル", seg(t, 2.2, 2.8), 52, AMBER)


def d_rainmath(img, t, d):
    a, b = seg(t, 0.2, 0.8), seg(t, 3.0, 3.6)
    panel(img, (220, 300, 900, 760), fill=SKY, alpha=0.92 * a, outline=TEAL)
    text(img, (560, 400), "屋根1平方メートル", 46, anchor="mm", alpha=a)
    text(img, (560, 500), "× 雨1ミリ", 46, anchor="mm", alpha=a)
    text(img, (560, 640), "＝ 1リットル", 64, anchor="mm", alpha=a, fill=AMBER, stroke=5)
    panel(img, (1020, 300, 1700, 760), fill=SKY, alpha=0.92 * b, outline=AMBER)
    text(img, (1360, 400), "屋根100平方メートル", 46, anchor="mm", alpha=b)
    text(img, (1360, 500), "× 雨10ミリ", 46, anchor="mm", alpha=b)
    text(img, (1360, 640), "＝ 1,000リットル（1トン）", 54, anchor="mm", alpha=b, fill=AMBER, stroke=5)


def d_check(head, items, step=0.9):
    def fn(img, t, d):
        title(img, head, t, y=170)
        for i, s in enumerate(items):
            a = seg(t, 0.4 + i * step, 1.0 + i * step)
            y = 300 + i * 120
            panel(img, (360, y - 45, 1560, y + 45), fill=SKY, alpha=0.9 * a, outline=TEAL)
            text(img, (420, y), "●", 30, anchor="lm", alpha=a, fill=AMBER)
            text(img, (500, y), s, 44, anchor="lm", alpha=a)
    return fn


def d_storms(img, t, d):
    title(img, "バミューダを通ったハリケーン", t, y=170)
    ev = [("2003年9月5日", "ファビアン", "直撃・4人死亡"), ("2016年10月13日", "ニコール", "目が真上を通過"),
          ("2020年9月14日", "ポーレット", "目が真上を通過"), ("2024年8月17日", "アーネスト", "上陸")]
    for i, (dt, nm, s) in enumerate(ev):
        a = seg(t, 0.4 + i * 1.6, 1.0 + i * 1.6)
        x = 300 + i * 440
        panel(img, (x - 200, 330, x + 200, 720), fill=SKY, alpha=0.92 * a, outline=RED if i == 0 else TEAL)
        text(img, (x, 410), dt, 36, anchor="mm", alpha=a, fill=MUTED, weight="500Medium")
        text(img, (x, 520), nm, 56, anchor="mm", alpha=a, stroke=5)
        text(img, (x, 630), s, 36, anchor="mm", alpha=a)


def d_ro(img, t, d):
    L, dr = layer()
    dr.rectangle([260, 330, 940, 780], fill=(40, 90, 150, 255))
    dr.rectangle([980, 330, 1660, 780], fill=(120, 190, 240, 255))
    for y in range(340, 780, 24):
        dr.line([(960, y), (960, y + 12)], fill=(240, 240, 240, 255), width=6)
    rng = np.random.default_rng(2)
    for i in range(90):
        x, y = rng.uniform(280, 920), rng.uniform(350, 760)
        dr.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(240, 240, 240, 230))
    put(img, L, seg(t, 0, 0.5))
    arrow(img, (120, 555), (360, 555), color=AMBER, width=12, alpha=seg(t, 0.8, 1.4))
    label(img, (600, 280), "海水（塩を含む）", seg(t, 0.3, 0.9))
    label(img, (960, 830), "細かい膜", seg(t, 1.0, 1.6), 44)
    label(img, (1320, 280), "真水", seg(t, 1.6, 2.2), color=WATER)
    label(img, (180, 480), "圧力", seg(t, 0.8, 1.4), 44, AMBER)


def d_three(img, t, d):
    title(img, "三つの水源", t, y=170)
    for i, (s, sub, col) in enumerate([("屋根", "雨を集めてタンクへ", TEAL), ("地下", "海水の上に浮く淡水", WATER), ("海", "真水をつくりトラックで", AMBER)]):
        a = seg(t, 0.4 + i * 0.8, 1.0 + i * 0.8)
        x = W / 2 + (i - 1) * 520
        panel(img, (x - 220, 300, x + 220, 640), fill=SKY, alpha=0.92 * a, outline=col)
        text(img, (x, 420), s, 80, anchor="mm", alpha=a, stroke=5)
        text(img, (x, 560), sub, 36, anchor="mm", alpha=a, weight="500Medium")
    text(img, (W / 2, 760), "家のタンク", 56, anchor="mm", alpha=seg(t, 3.0, 3.6), fill=AMBER, stroke=5)


def d_bars(head, rows, unit=""):
    def fn(img, t, d):
        title(img, head, t, y=170)
        mx = max(v for _, v in rows)
        for i, (k, v) in enumerate(rows):
            a = seg(t, 0.4 + i * 0.7, 1.4 + i * 0.7)
            y = 320 + i * 130
            text(img, (560, y), k, 44, anchor="rm", alpha=min(1, a * 2))
            panel(img, (600, y - 38, 600 + 900 * v / mx * a, y + 38), fill=TEAL if i else AMBER, alpha=0.9, radius=8)
            if a > 0.05:
                text(img, (620 + 900 * v / mx * a, y), f"{v:g}{unit}", 44, anchor="lm", alpha=min(1, a * 2))
    return fn


def d_compare(img, t, d):
    a, b = seg(t, 0.3, 0.9), seg(t, 1.6, 2.2)
    panel(img, (180, 260, 920, 760), fill=SKY, alpha=0.92 * a, outline=MUTED)
    text(img, (550, 340), "ジブラルタル", 58, anchor="mm", alpha=a, stroke=5)
    text(img, (550, 470), "海水から真水をつくる", 40, anchor="mm", alpha=a)
    text(img, (550, 560), "↓", 50, anchor="mm", alpha=a)
    text(img, (550, 650), "斜面の集水を取り外す（1993年）", 38, anchor="mm", alpha=a, fill=MUTED)
    panel(img, (1000, 260, 1740, 760), fill=SKY, alpha=0.92 * b, outline=TEAL)
    text(img, (1370, 340), "バミューダ", 58, anchor="mm", alpha=b, stroke=5)
    text(img, (1370, 470), "海水から真水をつくる", 40, anchor="mm", alpha=b)
    text(img, (1370, 560), "＋", 50, anchor="mm", alpha=b)
    text(img, (1370, 650), "屋根とタンクが今も主役", 42, anchor="mm", alpha=b, fill=AMBER)


# ---------------------------------------------------------------- the edit
ATL = dict(lon=-70.0, lat=34.0, kmpp=1.5)
ISL = dict(lon=-64.77, lat=32.32, kmpp=0.022)
SLOT_S01 = {"photo": "BM-S01.jpg", "label": "バミューダの家並み"}


def shots():
    S = []
    add = lambda sc, w, kind, **P: S.append((sc, w, kind, P))
    # S01 hook
    add("S01", 5, "globe", lon=(-40, -64.8), lat=(20, 32.3), r=(360, 560), cy=560, why="地球儀から大西洋の島へ")
    add("S01", 3, "diag", sent=1, fn=d_roofs, slot=SLOT_S01, why="白い階段の屋根（実写は Codex の素材待ち）")
    add("S01", 5, "diag", fn=d_roofs, why="白い屋根の家並み（図解）")
    add("S01", 6, "diag", sent=2, fn=d_section(1), slot={"gen": "BM-S06a"}, why="屋根の下の飲み水")
    add("S01", 6, "map", sent=3, **ISL, move=False, why="川も湖もない島の全体図")
    add("S01", 5, "card", sent=4, kicker="では", title="雨が降らないときは？", why="問い")
    add("S01", 4, "globe", sent=5, lon=(-64.8, -64.8), lat=(32.3, 32.3), r=(560, 600), cy=560, why="一滴の雨の行き先")
    add("S01", 9, "diag", sent=6, fn=d_check("今日の地図の旅", ["島の地面の下", "四百年あまり前の遭難", "家の下のタンクを決めた法律", "日照りの年の綱渡り", "世界の雨の受け皿"], 0.9), why="章立て")
    # S02 location
    add("S02", 9, "map", **ATL, move=False, layers=[L_dots(["ハッテラス岬"], 0.2, 0, TEAL), L_dots(["バミューダ"], 0.6, 0, AMBER), L_arrow("ハッテラス岬", "バミューダ", 1.0), L_dist("ハッテラス岬", "バミューダ", 2.2)], why="ハッテラス岬からの距離")
    add("S02", 9, "globe", sent=3, lon=(-64.8, -55), lat=(32.3, 25), r=(520, 460), cy=560, why="北緯約32度・大西洋の位置")
    # S03 size and people
    add("S03", 6, "map", lon=(-65.2, -64.77), lat=(32.5, 32.32), kmpp=(0.12, 0.025), why="島へ寄り、小ささを見せる")
    add("S03", 5, "diag", sent=1, fn=d_big("約6万4千人", "2016年の国勢調査"), why="人口")
    add("S03", 6, "diag", sent=2, fn=d_big("約1,200人", "1平方キロメートルあたり"), why="人口密度")
    add("S03", 6, "card", sent=4, title="毎日の水はどこから？", why="今日の問い")
    # S04 map walk
    add("S04", 6, "map", **ISL, move=False, why="島の形")
    add("S04", 4, "map", sent=2, **ISL, move=False, layers=[L_dots(["セント・ジョージズ"], 0.1, 0, AMBER)], why="東の端")
    add("S04", 3, "map", sent=3, **ISL, move=False, layers=[L_dots(["セント・ジョージズ"], 0, 0, AMBER), L_dots(["デヴォンシャー"], 0.1, 0, TEAL)], why="中央")
    add("S04", 3, "map", sent=4, **ISL, move=False, layers=[L_dots(["セント・ジョージズ", "デヴォンシャー"], 0, 0, TEAL), L_dots(["サマセット"], 0.1, 0, AMBER)], why="西の端")
    add("S04", 6, "diag", sent=5, fn=d_roofs, why="点々と並ぶ白い屋根")
    add("S04", 4, "map", sent=6, **ISL, move=False, layers=[L_dots(["セント・ジョージズ", "デヴォンシャー", "サマセット"], 0, 0, TEAL)], why="この地図の上の話")
    # S05 geology
    add("S05", 4, "map", **ISL, move=False, why="島へ")
    add("S05", 20, "diag", sent=1, fn=d_seamount, why="古い火山と石灰岩の層")
    # S06 dune
    add("S06", 15, "diag", fn=d_dune, why="浜の砂が砂丘になり、固まる")
    # S07 soak
    add("S07", 10, "diag", fn=d_soak, why="雨がしみ込む")
    add("S07", 6, "map", sent=2, **ISL, move=False, why="川も湖もない島")
    # S08 lens
    add("S08", 21, "diag", fn=d_lens, slot={"gen": "BM-S04", "labels": [((0.5, 0.42), "石灰岩", 0.4), ((0.5, 0.56), "淡水", 1.6), ((0.15, 0.75), "海水", 2.0)]}, why="淡水のレンズ")
    # S09 1:40
    add("S09", 13, "diag", fn=d_gh(False), why="1と40の関係")
    add("S09", 14, "diag", sent=2, fn=d_gh(True), why="くみ上げすぎると海水が入る")
    # S10 Devonshire lens
    add("S10", 8, "map", **ISL, move=False, layers=[L_dots(["デヴォンシャー"], 0.2, 0, AMBER)], why="島の中央のレンズの位置（範囲は描かない）")
    add("S10", 5, "diag", sent=1, fn=d_big("約7km²", "デヴォンシャーの淡水のレンズ"), why="広さ")
    add("S10", 7, "diag", sent=3, fn=d_year("1975年", "水資源法", "地下の淡水を保護区域に"), why="1975年の法律")
    add("S10", 6, "diag", sent=4, fn=d_big("約3,100件", "5年ごとに出す水利権"), why="水利権")
    # S11 asymmetry
    add("S11", 23, "diag", fn=d_lens_asym, why="北と南で違うレンズ")
    # S12 1609
    add("S12", 5, "card", kicker="歴史", title="嵐が運んだ人々", why="章の扉")
    add("S12", 6, "diag", sent=1, fn=d_year("1609年7月28日", "シー・ヴェンチャー号が座礁"), why="1609年")
    add("S12", 8, "map", sent=2, **ATL, move=False, layers=[L_dots(["ジェームズタウン"], 0.2, 0, TEAL), L_dots(["バミューダ"], 0.5, 0, AMBER)], why="ジェームズタウンとバミューダ")
    add("S12", 8, "map", sent=4, **ATL, move=False, layers=[L_dots(["ジェームズタウン"], 0, 0, TEAL), L_dots(["バミューダ"], 0, 0, AMBER), L_arrow("バミューダ", "ジェームズタウン", 0.4)], why="1610年、2隻でジェームズタウンへ")
    # S13 1612
    add("S13", 6, "diag", fn=d_year("1612年", "プラウ号で入植", "総督リチャード・ムーア"), why="1612年")
    add("S13", 8, "map", sent=1, **ISL, move=False, layers=[L_dots(["セント・ジョージズ"], 0.2, 0, AMBER)], why="セント・ジョージズへ")
    add("S13", 4, "diag", sent=2, fn=d_roofs, why="川のない島での暮らし")
    # S14 slate roof
    add("S14", 17, "diag", fn=d_slate, why="石を切って屋根にする")
    # S15 old tank
    add("S15", 6, "diag", fn=d_old, why="昔のタンク")
    Y1809 = d_year("1809年", "水をためる施設の絵", "W. F. Wells のアクアチント（Wellcome Collection）")
    add("S15", 2.4, "diag", sent=1, fn=Y1809, slot={"photo": "BM-S06b.jpg", "label": "1809年の絵（W. F. Wells）"}, why="1809年の絵")
    add("S15", 3, "diag", fn=Y1809, why="1809年")
    # S16 rain path
    add("S16", 3, "diag", fn=d_roofs, slot={"photo": "BM-S05a.jpg", "label": "白い階段状の屋根"}, why="今の家")
    add("S16", 2, "diag", fn=d_roofs, why="今の家（図解）")
    add("S16", 12, "diag", sent=1, fn=d_steps, slot={"gen": "BM-S05b", "labels": [((0.3, 0.15), "石灰岩の板を重ねた段", 0.4), ((0.85, 0.85), "雨どいへ", 1.4)]}, why="段が雨を遅くする")
    add("S16", 9, "diag", sent=3, fn=d_section(3), slot={"gen": "BM-S06a", "labels": [((0.5, 0.25), "屋根", 0.4), ((0.3, 0.42), "雨どい", 1.0), ((0.5, 0.8), "タンク", 1.6)]}, why="雨どい→縦の管→タンク")
    add("S16", 6, "diag", sent=4, fn=d_mesh, why="あふれ管と金網")
    # S17 mosquito
    add("S17", 20, "diag", fn=d_mesh, why="蚊を入れない")
    # S18 law
    add("S18", 6, "diag", fn=d_law, why="法律で決まっている")
    add("S18", 10, "diag", sent=1, fn=d_year("1951年", "屋根の5分の4以上を雨を集める面に", "その面10平方フィートごとに100ガロンのタンク"), why="1951年の規則")
    add("S18", 6, "diag", sent=2, fn=d_big("約390リットル", "屋根1平方メートルあたり（計算）"), why="換算")
    add("S18", 8, "diag", sent=3, fn=d_big("約39トン", "屋根100平方メートルの家（計算）"), why="例")
    # S19 measure
    add("S19", 25, "diag", fn=d_measure, why="タンクの容積の求め方")
    # S20 rain math
    add("S20", 25, "diag", fn=d_rainmath, why="雨1ミリと屋根1平方メートルで1リットル")
    # S21 maintenance
    add("S21", 6, "diag", fn=d_section(3), why="屋根は水道の入口")
    add("S21", 25, "diag", sent=2, fn=d_check("屋根とタンクの手入れ", ["タンクの掃除：少なくとも6年に1回", "屋根：2年ごとに掃除か塗り直し", "塗る前に漂白剤と水を半分ずつで洗う", "その間は縦の管をふさぐ", "政府が認めた屋根用の塗料"], 3.2), why="手入れの決まり")
    # S22 health
    add("S22", 7, "diag", fn=d_check("タンクの水を飲む前に", ["飲み水・料理の水は消毒を"], 0.9), why="消毒を勧める")
    add("S22", 10, "diag", sent=1, fn=d_big("102の家", "2008年　タンクの水を調べた研究"), why="2008年の研究")
    add("S22", 14, "diag", sent=3, fn=d_check("タンクの水を飲む前に", ["飲み水・料理の水は消毒を", "掃除した家ほど汚れが少ない", "消毒のあとに検査で確かめる"], 0.0), why="まとめ")
    # S23 hurricanes
    add("S23", 6, "globe", lon=(-55, -64.8), lat=(25, 32.3), r=(420, 520), cy=560, why="大西洋のハリケーンの通り道")
    add("S23", 30, "diag", sent=2, fn=d_storms, why="4つのハリケーン")
    add("S23", 5, "diag", sent=5, fn=d_big("約38m/秒", "アーネストの最大風速"), why="2024年")
    # S24 heavy roof
    add("S24", 5, "diag", fn=d_slate, why="重い石の屋根")
    add("S24", 9, "diag", sent=1, fn=d_big("約49m/秒", "2003年当時の基準（瞬間は約67m/秒）"), why="建築の基準")
    add("S24", 12, "diag", sent=2, fn=d_roofs, why="屋根の一部を失った建物も")
    # S25 trucks
    add("S25", 8, "diag", fn=d_tank(False), why="タンクの水が減る")
    add("S25", 5, "diag", sent=2, fn=d_tank(True), slot={"gen": "BM-S08"}, why="給水トラック")
    add("S25", 5, "diag", sent=3, fn=d_big("120ドル", "トラック1台分の配達（2022年から）"), why="料金")
    add("S25", 5, "diag", sent=4, fn=d_big("1〜2週間分", "タンクに常に残す水"), why="業者の勧め")
    # S26 mains
    add("S26", 4, "card", title="政府の水道は？", why="問い")
    add("S26", 8, "diag", sent=1, fn=d_big("約2,000", "政府の水道管につながる家と事業所（2018年）"), why="水道管")
    add("S26", 6, "diag", sent=2, fn=d_big("3分の2", "政府の水が安全網になる家"), why="安全網")
    add("S26", 5, "diag", sent=3, fn=d_big("約4万人", "日照りのときトラックの水に頼る"), why="トラック")
    add("S26", 7, "diag", sent=4, fn=d_three, why="屋根が主役、公共の水が支える")
    # S27 RO
    add("S27", 6, "map", **ISL, move=False, layers=[L_dots(["タインズ・ベイ"], 0.2, 0, AMBER)], why="タインズ・ベイ（中央の北の海岸）")
    add("S27", 9, "diag", sent=1, fn=d_ro, why="逆浸透の仕組み")
    add("S27", 5, "diag", sent=2, fn=d_year("2009年", "第1期が完成"), why="2009年")
    add("S27", 7, "diag", sent=3, fn=d_big("約75万ガロン", "1日の生産（2021年、ほぼ最大能力）"), why="生産量")
    add("S27", 6, "diag", sent=4, fn=d_big("100万ガロン", "1日の生産を上げる計画（2018年）"), why="計画")
    add("S27", 8, "diag", sent=5, fn=d_flow, why="政府と民間のつぎはぎ")
    # S28 2025
    add("S28", 8, "diag", fn=d_year("2025年1月12日", "海水を送る設備が大きく故障", "水道とトラックの出口の水を制限"), why="故障")
    add("S28", 8, "diag", sent=2, fn=d_big("約64ミリ少ない", "2025年2月の雨（平年比）"), why="雨不足")
    add("S28", 12, "diag", sent=3, fn=d_tank(False), why="二つの柱が細る")
    # S29 2025-26
    add("S29", 9, "diag", fn=d_quote, why="節水の呼びかけ")
    add("S29", 14, "diag", sent=1, fn=d_year("2026年5月4日", "東部に給水トラック用の新しい出口", "24時間・2台同時"), why="新しい出口")
    add("S29", 6, "map", sent=3, **ISL, move=False, layers=[L_dots(["セント・ジョージズ"], 0.1, 0, AMBER)], why="東の端")
    add("S29", 8, "diag", sent=4, fn=d_big("20万ガロン", "東部の逆浸透プラント（1日）"), why="東部の整備")
    # S30 recap
    add("S30", 6, "diag", fn=d_steps, why="雨の道のまとめ")
    add("S30", 7, "diag", sent=1, fn=d_section(3), why="タンクへ")
    add("S30", 6, "diag", sent=2, fn=d_lens, why="地下のレンズ")
    add("S30", 5, "diag", sent=3, fn=d_tank(True), why="トラック")
    add("S30", 7, "diag", sent=4, fn=d_three, why="三つの水源")
    # S31 world
    add("S31", 8, "globe", lon=(-64.8, 10), lat=(32.3, 25), r=(520, 360), cy=560, why="世界へ")
    # S32 Gibraltar
    add("S32", 8, "globe", lon=(10, -5.35), lat=(25, 36.1), r=(360, 520), cy=560, why="ジブラルタルへ")
    add("S32", 9, "map", sent=1, lon=-5.35, lat=36.14, kmpp=0.6, move=False, layers=[L_dots(["ジブラルタル"], 0.2, 0, AMBER)], why="岩山の場所")
    add("S32", 7, "diag", sent=3, fn=d_year("1898〜1900年", "最初の4つの貯水池を岩山の中に掘る"), why="貯水池")
    add("S32", 12, "diag", sent=4, fn=d_bars("鉄板の集水面の広さ（エーカー）", [("1903年", 10), ("1911〜14年", 24), ("1961年", 34)]), why="広さの変化")
    add("S32", 9, "diag", sent=5, fn=d_year("1993年10月", "集水面が役目を終える", "海水から真水をつくる設備ができた"), why="撤去")
    # S33 Majuro / Tuvalu
    add("S33", 8, "globe", lon=(-5, 171.3), lat=(36, 7), r=(360, 460), cy=560, why="太平洋へ")
    add("S33", 9, "map", sent=1, lon=171.3, lat=7.1, kmpp=1.2, move=False, layers=[L_dots(["マジュロ"], 0.2, 0, AMBER)], why="マジュロ")
    add("S33", 8, "diag", sent=2, fn=d_gh(False), why="マジュロも地下の淡水のレンズ")
    add("S33", 9, "map", sent=4, lon=179.19, lat=-8.52, kmpp=1.2, move=False, layers=[L_dots(["フナフティ"], 0.2, 0, AMBER)], why="フナフティ")
    add("S33", 10, "diag", sent=6, fn=d_year("2011年", "ツバルが国家非常事態を宣言", "ニュージーランドが水を空輸"), why="2011年")
    # S34 USVI
    add("S34", 8, "map", lon=-66.0, lat=24.0, kmpp=2.2, move=False, layers=[L_dots(["バミューダ"], 0.1, 0, TEAL), L_dots(["米領ヴァージン諸島"], 0.5, 0, AMBER)], why="カリブ海の位置（バミューダと同じ地図）")
    add("S34", 11, "diag", sent=1, fn=d_bars("屋根1平方メートルあたりのタンク（計算）", [("バミューダ（1951年の規則）", 390), ("米領ヴァージン諸島 1階建て", 410), ("同 2階建て以上", 610)], "L"), why="比べる（換算は計算）")
    # S35 Australia / Japan
    add("S35", 7, "globe", lon=(-60, 134), lat=(20, -25), r=(360, 460), cy=560, why="オーストラリアへ")
    add("S35", 8, "diag", sent=1, fn=d_big("約26％", "雨水のタンクを使う世帯（2013年）"), why="26%")
    add("S35", 10, "diag", sent=2, fn=d_bars("雨水のタンクを使う世帯（2013年）", [("南オーストラリア州", 46), ("クイーンズランド州", 34), ("ビクトリア州", 29)], "％"), why="州別")
    add("S35", 6, "map", sent=3, lon=139.79, lat=35.70, kmpp=0.6, move=False, layers=[L_dots(["東京"], 0.2, 0, AMBER)], why="東京")
    add("S35", 10, "diag", sent=4, fn=d_big("約1,000トン", "両国国技館の地下のタンク（屋根 約8,400㎡）"), why="国技館")
    add("S35", 9, "diag", sent=6, fn=d_year("2014年", "雨水の利用を進める法律が施行"), why="法律")
    # S36 desal world
    add("S36", 6, "globe", lon=(134, 45), lat=(-25, 25), r=(460, 400), cy=560, why="中東へ")
    add("S36", 8, "diag", sent=1, fn=d_big("約15,900か所", "世界で動く淡水化プラント"), why="数")
    add("S36", 7, "diag", sent=3, fn=d_big("48％", "中東と北アフリカ"), why="地域")
    add("S36", 8, "diag", sent=4, fn=d_big("約1億4,200万m³", "1日に出る濃い塩水"), why="ブライン")
    add("S36", 5, "diag", sent=5, fn=d_big("55％", "サウジアラビア・UAE・クウェート・カタール"), why="4か国")
    # S37 Malta
    add("S37", 8, "map", lon=14.45, lat=35.90, kmpp=0.6, move=False, layers=[L_dots(["マルタ"], 0.2, 0, AMBER)], why="マルタ")
    add("S37", 8, "diag", sent=1, fn=d_big("約3分の2", "マルタの水道の水は海水から"), why="3分の2")
    # S38 future
    add("S38", 6, "diag", fn=d_gh(True), why="海水が入り込む")
    add("S38", 10, "diag", sent=1, fn=d_gh(True), why="IPCC の評価")
    add("S38", 9, "diag", sent=2, fn=d_big("11倍以上", "地下の淡水を傷める高い潮位（2050年まで）"), why="BIOS")
    add("S38", 14, "diag", sent=3, fn=d_gh(True), why="小さな島の淡水")
    add("S38", 10, "diag", sent=6, fn=d_big("2,130棟", "何らかのリスクにさらされる建物（島の6％）"), why="政府の調査")
    # S39 contrast
    add("S39", 6, "map", lon=-5.35, lat=36.14, kmpp=0.6, move=False, layers=[L_dots(["ジブラルタル"], 0, 0, AMBER)], why="ジブラルタル")
    add("S39", 18, "diag", sent=1, fn=d_compare, why="分かれ道")
    add("S39", 8, "diag", sent=4, fn=d_roofs, why="屋根に学べる")
    # S40 conclusion
    add("S40", 8, "map", **ISL, move=False, why="島の地図")
    add("S40", 10, "diag", sent=2, fn=d_section(3), why="屋根とタンク")
    add("S40", 8, "diag", sent=3, fn=d_summary, why="まとめ")
    add("S40", 13, "diag", sent=6, fn=d_rainmath, why="雨の量を計算してみる")
    # S41
    add("S41", 10, "card", title="地球の事情", sub="地理・歴史・経済で、世界を読み解く", foot="音声：VOICEVOX:雀松朱司", why="締め")
    return S


R.HEAD = {}
R.shots = shots
B.OUT = OUT


def render(t0, t1, path):
    n0, n1 = int(round(t0 * R.FPS)), int(round(t1 * R.FPS))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(R.FPS),
                          "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", str(path)], stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(B.frame(n / R.FPS).tobytes())
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
            print(f"{s['start']:7.2f}–{s['end']:7.2f} {s['end'] - s['start']:5.1f} {s['scene']} {s['kind']:6s} {s['P'].get('why', '')}")
        return
    if a.shotlist:
        (EP / "shotlist_v3_long.md").write_text("# カット表 v3（長尺版。render/render_v3.py から自動生成）\n\n実写は1カット3秒以内・1素材1回。写真・生成画像は Codex の素材が届くまで Claude の図解で代える。地図は地形の陰影図と Natural Earth（衛星画像ではない）。画面の注釈は出さない（社長 2026-11-12）。\n\n" + R.shotlist_md())
        return
    if a.still:
        for t in a.still:
            Image.fromarray(B.frame(t)).save(OUT / f"v3still_{t:07.2f}.jpg", quality=88)
        return
    if a.chunks:
        i, m = map(int, a.chunks.split("/"))
        n = int(math.ceil(R.TOTAL / 10.0))
        for c in range(i - 1, n, m):
            dst = OUT / f"c5v3_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c5v3_{c:03d}.tmp.mp4"
            render(c * 10.0, min(R.TOTAL, (c + 1) * 10.0), tmp)
            tmp.rename(dst)
        return
    if a.mux:
        parts = sorted(OUT.glob("c5v3_[0-9][0-9][0-9].mp4"))
        assert len(parts) == int(math.ceil(R.TOTAL / 10.0)), len(parts)
        (OUT / "parts_v3.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts_v3.txt"),
                        "-i", str(OUT / "mix_v3.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11",
                        "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUT / "chizu-005-bermuda-roof-water_full_v3_long.mp4")], check=True)


if __name__ == "__main__":
    main()
