"""3D compositor for 地球の事情 (社長 2026-11-14「if動画ジャンル参入の動画制作のクオリティを真似して…制作し直して」、
「今の尺のままで進めて」). Same narration, subtitles and shot timing as the approved edit; new picture:

- map    : the plate (the approved map drawing) is a printed diorama slab on a linen table, filmed with a moving
           camera (perspective), soft sun shadow, layered-earth cut sides, 3D map pins that drop in, real depth of field
- diag   : the plate is a thick white card floating above the table, the episode's map diorama blurred behind it
- big    : big numbers become a raised (extruded) number block with a small plaque, on the table
- globe  : a lit globe (Natural Earth shaded relief) with atmosphere, highlight of the country, pin at the destination
Everything is computed here with numpy / OpenCV (plane homographies + analytic depth), because WebGL in software was
~5 s per frame. Subtitles: the v4 look (render_v4.subtitle). Usage:
  python3 scripts/comp3d.py <ca|bm> --still SEC [SEC ...]      (stills to out/<ep>/)
  python3 scripts/comp3d.py <ca|bm> --chunks i/m                 (10 s chunks, restart-safe)
  python3 scripts/comp3d.py <ca|bm> --mux                        (joins chunks + mix → full mp4)
"""
import importlib.util, json, math, os, subprocess, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = Path(__file__).resolve().parents[1]
ROOT = HERE.parents[1]
EPS = {"ca": "chizu-003-canada-housing", "bm": "chizu-005-bermuda-roof-water"}
KEY = sys.argv[1]
EPN = EPS[KEY]
RD = ROOT / "episodes" / EPN / "render"
PL = RD / "out/plates"
OUT = HERE / "out" / KEY
OUT.mkdir(parents=True, exist_ok=True)
DATA = json.loads((PL / "timeline3d.json").read_text())
SHOTS, XF, TOTAL = DATA["shots"], DATA["xf"], DATA["total"]
W, H, FPS = 1920, 1080, 30
FONT = str(HERE / "public/fonts/MPLUSRounded1c_800ExtraBold.ttf")
FONT7 = str(HERE / "public/fonts/MPLUSRounded1c_700Bold.ttf")
INK, AMBER, TEAL = (38, 42, 50), (214, 118, 0), (0, 132, 122)

# subtitles (v4 look) come from the approved renderer
sys.path.insert(0, str(ROOT / "episodes/chizu-005-bermuda-roof-water/render"))
import render_v4 as V4  # noqa: E402  (also sets up fonts / helpers)


def rnd(i):
    x = math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - math.floor(x)


def smoother(t):
    t = min(1.0, max(0.0, t))
    return t * t * t * (t * (t * 6 - 15) + 10)


def sm(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ camera
class Cam:
    def __init__(self, pos, target, fov=30.0):
        self.pos = np.array(pos, float)
        f = np.array(target, float) - self.pos
        self.f = f / np.linalg.norm(f)
        r = np.cross(self.f, [0, 1, 0]); self.r = r / np.linalg.norm(r)
        self.u = np.cross(self.r, self.f)
        self.fpx = (H / 2) / math.tan(math.radians(fov) / 2)
        # world ray direction for each pixel
        xs = (np.arange(W, dtype=np.float32) + 0.5 - W / 2) / self.fpx
        ys = -(np.arange(H, dtype=np.float32) + 0.5 - H / 2) / self.fpx
        self.X, self.Y = np.meshgrid(xs, ys)

    def proj(self, P):
        P = np.atleast_2d(np.asarray(P, float)) - self.pos
        xc, yc, zc = P @ self.r, P @ self.u, P @ self.f
        zc = np.maximum(zc, 1e-3)
        return np.stack([W / 2 + xc / zc * self.fpx, H / 2 - yc / zc * self.fpx], 1), zc

    def plane_y(self, y0):
        """distance along the view axis (depth) to the horizontal plane y=y0 for every pixel (inf if missed)"""
        dy = self.f[1] + self.X * self.r[1] + self.Y * self.u[1]   # ray = f + X r + Y u  (depth-normalised)
        t = (y0 - self.pos[1]) / np.where(np.abs(dy) < 1e-6, -1e-6, dy)
        return np.where(t > 0, t, np.inf).astype(np.float32)

    def plane_z(self, z0):
        dz = self.f[2] + self.X * self.r[2] + self.Y * self.u[2]
        t = (z0 - self.pos[2]) / np.where(np.abs(dz) < 1e-6, 1e-6, dz)
        return np.where(t > 0, t, np.inf).astype(np.float32)

    def hit(self, depth):
        """world xyz of the rays at the given depth map"""
        return (self.pos[0] + depth * (self.f[0] + self.X * self.r[0] + self.Y * self.u[0]),
                self.pos[1] + depth * (self.f[1] + self.X * self.r[1] + self.Y * self.u[1]),
                self.pos[2] + depth * (self.f[2] + self.X * self.r[2] + self.Y * self.u[2]))


def warp_quad(src, cam, corners, out_rgb, out_depth, depth_val=None, shade=1.0, ss=1):
    """paint image src onto the world quad corners (TL, TR, BR, BL) with an anti-aliased edge; depth by plane"""
    h, w = src.shape[:2]
    q, zc = cam.proj(corners)
    if np.any(zc < 0.05):
        return None
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q.astype(np.float32))
    img = cv2.warpPerspective(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    m = np.zeros((H * 4, W * 4), np.uint8)
    cv2.fillConvexPoly(m, np.int32(np.round(q * 4)), 255, lineType=cv2.LINE_AA)
    m = cv2.resize(m, (W, H), interpolation=cv2.INTER_AREA).astype(np.float32)[..., None] / 255
    if shade != 1.0:
        img = img.astype(np.float32) * shade
    out_rgb[:] = out_rgb * (1 - m) + img * m
    if depth_val is not None:
        dm = m[..., 0] > 0.5
        out_depth[dm] = depth_val[dm] if isinstance(depth_val, np.ndarray) else depth_val
    return q


# ------------------------------------------------------------------ textures
def linen(n=1024):
    rng = np.random.default_rng(3)
    base = np.full((n, n, 3), (236, 230, 220), np.float32)
    noise = rng.normal(0, 1, (n, n)).astype(np.float32)
    weave = cv2.GaussianBlur(noise, (0, 0), 0.8) * 4 + cv2.GaussianBlur(rng.normal(0, 1, (n, n)).astype(np.float32), (0, 0), 6) * 6
    return np.clip(base + weave[..., None], 0, 255)


LINEN = linen()


def strata(w=1600, h=80):
    bands = [((122, 150, 104), 8), ((165, 138, 99), 18), ((142, 115, 82), 22), ((179, 157, 121), 14), ((111, 92, 69), 18)]
    im = np.zeros((h, w, 3), np.float32); y = 0
    rng = np.random.default_rng(5)
    for c, hh in bands:
        im[y:y + hh] = c; y += hh
    im += rng.normal(0, 7, im.shape).astype(np.float32)
    return np.clip(im, 0, 255).astype(np.uint8)


STRATA = strata()
SKY_TOP, SKY_BOT = np.array((205, 222, 236), np.float32), np.array((246, 241, 232), np.float32)
FOG = np.array((238, 240, 240), np.float32)


def sky(cam):
    # ray elevation (computed at half resolution: it is a smooth gradient)
    X, Y = cam.X[::2, ::2], cam.Y[::2, ::2]
    dy = cam.f[1] + X * cam.r[1] + Y * cam.u[1]
    n = np.sqrt(1 + X ** 2 + Y ** 2)
    el = np.clip(dy / n * 1.4 + 0.2, 0, 1) ** 0.8
    return cv2.resize(SKY_BOT * (1 - el[..., None]) + SKY_TOP * el[..., None], (W, H), interpolation=cv2.INTER_LINEAR)


def table(cam, rgb, depth, y0=-0.5):
    # half resolution: the table is mostly out of focus; the board, cards and pins are drawn at full resolution
    X, Y = cam.X[::2, ::2], cam.Y[::2, ::2]
    dy = cam.f[1] + X * cam.r[1] + Y * cam.u[1]
    t = (y0 - cam.pos[1]) / np.where(np.abs(dy) < 1e-6, -1e-6, dy)
    d = np.where(t > 0, t, np.inf).astype(np.float32)
    hitm = np.isfinite(d)
    dd = np.where(hitm, d, 0)
    x = cam.pos[0] + dd * (cam.f[0] + X * cam.r[0] + Y * cam.u[0])
    z = cam.pos[2] + dd * (cam.f[2] + X * cam.r[2] + Y * cam.u[2])
    n = LINEN.shape[0]
    u = ((x * 60) % n).astype(np.float32); v = ((z * 60) % n).astype(np.float32)
    col = cv2.remap(LINEN, u, v, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    fog = np.clip((d - 30) / 110, 0, 1)[..., None]
    col = col * (1 - fog) + FOG * fog
    col = cv2.resize(col.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    dfull = cv2.resize(np.where(hitm, d, 1e4).astype(np.float32), (W, H), interpolation=cv2.INTER_NEAREST)
    hm = dfull < 1e4
    rgb[hm] = col[hm]
    depth[hm] = dfull[hm]


def soft_shadow(cam, rgb, pts_world, strength=0.35, blur=30):
    q, _ = cam.proj(pts_world)
    m = np.zeros((H // 2, W // 2), np.uint8)
    cv2.fillConvexPoly(m, np.int32(np.round(q / 2)), 255, lineType=cv2.LINE_AA)
    m = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), blur / 2)
    m = cv2.resize(m, (W, H))[..., None]
    rgb *= (1 - strength * m)


# DOF: blend between blur levels by circle-of-confusion from the depth map
def dof(rgb, depth, focus, k, maxb=9.0, band=0.0):
    coc = np.clip((np.abs(depth - focus) / np.maximum(depth, 1e-3) - band) * k, 0, maxb)
    coc = cv2.GaussianBlur(coc, (0, 0), 6)
    levels = [0.0, 1.6, 3.4, 6.0, 9.0]
    small = cv2.resize(rgb, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    imgs = [rgb] + [cv2.resize(cv2.GaussianBlur(small, (0, 0), s / 2), (W, H), interpolation=cv2.INTER_LINEAR) for s in levels[1:]]
    out = np.zeros_like(rgb)
    for a in range(len(levels) - 1):
        lo, hi = levels[a], levels[a + 1]
        w = np.clip(1 - np.abs(coc - lo) / (hi - lo), 0, 1) if a > 0 else np.clip(1 - coc / (hi - lo), 0, 1)
        out += imgs[a] * w[..., None]
    w = np.clip((coc - levels[-2]) / (levels[-1] - levels[-2]), 0, 1)
    out += imgs[-1] * w[..., None]
    return out


_vy, _vx = np.mgrid[0:H, 0:W].astype(np.float32)
VIG = (1 - 0.28 * np.clip(((_vx - W / 2) / (W * 0.62)) ** 2 + ((_vy - H / 2) / (H * 0.66)) ** 2, 0, 1.4) ** 1.4)[..., None]
GRAIN = np.random.default_rng(9).normal(0, 1, (H + 64, W + 64)).astype(np.float32)


def finish(rgb, n):
    rgb = rgb * VIG
    ox, oy = (n * 37) % 64, (n * 53) % 64
    rgb += GRAIN[oy:oy + H, ox:ox + W, None] * 2.2
    return np.clip(rgb, 0, 255)


# ------------------------------------------------------------------ pins
def pin_sprite(color, r=48):
    s = r * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for k in range(r * 2, 0, -1):
        f = k / (r * 2)
        c = tuple(int(min(255, cc * (0.55 + 0.6 * (1 - f)) + 90 * (1 - f) ** 6)) for cc in color)
        cx, cy = s / 2 - (1 - f) * r * 0.35, s / 2 - (1 - f) * r * 0.45
        d.ellipse([cx - k, cy - k, cx + k, cy + k], fill=c + (255,))
    d.ellipse([s / 2 - r * 0.62, s / 2 - r * 0.78, s / 2 - r * 0.18, s / 2 - r * 0.38], fill=(255, 255, 255, 170))
    return np.array(im.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)


PIN = {AMBER: pin_sprite(AMBER), TEAL: pin_sprite(TEAL)}


def over(rgb, spr, cx, cy, size):
    """alpha-composite RGBA sprite centred at (cx, cy) scaled to size px"""
    s = max(2, int(size))
    sp = cv2.resize(spr, (s, s), interpolation=cv2.INTER_AREA)
    x0, y0 = int(round(cx - s / 2)), int(round(cy - s / 2))
    x1, y1 = x0 + s, y0 + s
    ax0, ay0, ax1, ay1 = max(0, x0), max(0, y0), min(W, x1), min(H, y1)
    if ax1 <= ax0 or ay1 <= ay0:
        return
    sub = sp[ay0 - y0:ay1 - y0, ax0 - x0:ax1 - x0]
    a = sub[..., 3:4] / 255
    rgb[ay0:ay1, ax0:ax1] = rgb[ay0:ay1, ax0:ax1] * (1 - a) + sub[..., :3] * a


def draw_pins(cam, rgb, pins, t, color=AMBER, ys=0.0):
    """pins: list of (world x, z, local time since its drop). Shadow on the board, needle, glossy head."""
    sh = np.zeros((H // 2, W // 2), np.float32)
    items = []
    for x, z, tl in pins:
        if tl <= 0:
            continue
        fall = min(1.0, tl / 0.32)
        y = (1 - fall * fall) * 3.0
        if fall >= 1:
            y += abs(math.sin(min(1.0, (tl - 0.32) / 0.35) * math.pi)) * 0.18 * math.exp(-(tl - 0.32) * 4)
        base = np.array([x, ys + y, z]); head = base + [0, 0.62, 0]
        # shadow: from the head along the light, onto the board (light from upper left / front)
        sp = np.array([x + 0.38 + y * 0.6, ys, z + 0.18 + y * 0.3])
        (q0,), _ = cam.proj([[x, ys, z]]); (q1,), _ = cam.proj([sp])
        cv2.line(sh, tuple(np.int32(q0 / 2)), tuple(np.int32(q1 / 2)), 0.6, 2, cv2.LINE_AA)
        cv2.circle(sh, tuple(np.int32(q1 / 2)), max(2, int(cam.fpx * 0.11 / np.linalg.norm(sp - cam.pos) / 2)), 0.7, -1, cv2.LINE_AA)
        items.append((base, head))
    if items:
        sh = cv2.resize(cv2.GaussianBlur(sh, (0, 0), 2.5), (W, H))[..., None]
        rgb *= (1 - 0.38 * sh)
    for base, head in sorted(items, key=lambda it: -np.linalg.norm(it[1] - cam.pos)):
        (pb, ph), zc = cam.proj([base, head])
        cv2.line(rgb, tuple(np.int32(pb)), tuple(np.int32(ph)), (175, 178, 186), max(2, int(cam.fpx * 0.035 / zc[1])), cv2.LINE_AA)
        over(rgb, PIN[color], ph[0], ph[1], cam.fpx * 0.11 * 4 / zc[1])


def pin_at(p, t):
    xy = p["xy"]
    if not xy:
        return None
    if t <= xy[0][0]:
        return xy[0][1:]
    for a, b in zip(xy, xy[1:]):
        if t <= b[0]:
            u = (t - a[0]) / max(1e-6, b[0] - a[0])
            return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]
    return xy[-1][1:]


BW, BH = 16.0, 9.0


def board_world(pos=(0, 0, 0), s=1.0, y=0.0):
    x0, z0 = pos[0], pos[2]
    hw, hh = BW / 2 * s, BH / 2 * s
    return [[x0 - hw, y, z0 - hh], [x0 + hw, y, z0 - hh], [x0 + hw, y, z0 + hh], [x0 - hw, y, z0 + hh]]


def draw_board(cam, rgb, depth, plate, pos=(0, 0, 0), s=1.0, thick=0.5):
    top = board_world(pos, s, 0.0)
    bot = board_world(pos, s, -thick)
    # shadow on the table (light from upper left → shadow to the lower right)
    off = np.array([0.55, 0, 0.35]) * s
    soft_shadow(cam, rgb, [np.array(p) + off + [0, -thick, 0] for p in bot], 0.32, 26)
    # visible sides (front and the side facing the camera)
    for a, b, n in ((3, 2, [0, 0, 1]), (1, 2, [1, 0, 0]), (0, 3, [-1, 0, 0])):
        c = (np.array(top[a]) + np.array(top[b])) / 2
        if np.dot(cam.pos - c, n) <= 0:
            continue
        quad = [top[a], top[b], bot[b], bot[a]]
        shade = 0.92 if n[2] else 0.78
        warp_quad(STRATA, cam, quad, rgb, depth, None, shade)
    d = cam.plane_y(0.0)
    warp_quad(plate, cam, top, rgb, depth, d)


# ------------------------------------------------------------------ plate readers
class Reader:
    def __init__(self, i):
        self.i, self.n = i, -1
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(PL / f"shot_{i:03d}.mp4"), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                  stdout=subprocess.PIPE, bufsize=W * H * 3 * 2)
        self.last = None

    def get(self, n):
        while self.n < n:
            buf = self.p.stdout.read(W * H * 3)
            if len(buf) < W * H * 3:
                break
            self.last = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
            self.n += 1
        return self.last

    def close(self):
        self.p.kill()


READERS = {}


def plate(i, tt):
    n = max(0, int(round(tt * FPS)))
    r = READERS.get(i)
    if r is None or r.n > n:
        if r:
            r.close()
        r = READERS[i] = Reader(i)
    for k in list(READERS):
        if k < i - 1:
            READERS.pop(k).close()
    return r.get(n)


BASE = None


def base_plate():
    global BASE
    if BASE is None:
        BASE = np.array(Image.open(HERE / f"public/base_{KEY}.jpg").convert("RGB").resize((W, H)))
    return BASE


# ------------------------------------------------------------------ shots
def map_shot(s, tt):
    d = s["end"] - s["start"]
    u = smoother(tt / (d + XF))
    side = (rnd(s["i"]) - 0.5) * 2
    yaw = math.radians(side * 4 + u * (-3 if side > 0 else 3))
    pitch = math.radians(63 - u * 3)
    D = 16.6 - u * 0.8
    tgt = np.array([0, 0, 0.35])
    pos = tgt + [math.sin(yaw) * math.cos(pitch) * D, math.sin(pitch) * D, math.cos(yaw) * math.cos(pitch) * D]
    cam = Cam(pos, tgt)
    rgb = sky(cam).astype(np.float32); depth = np.full((H, W), np.inf, np.float32)
    table(cam, rgb, depth)
    draw_board(cam, rgb, depth, plate(s["i"], tt))
    pins = []
    for n, p in s["pins"].items():
        xy = pin_at(p, tt)
        if xy:
            pins.append(((xy[0] / W - 0.5) * BW, (xy[1] / H - 0.5) * BH, tt - p["a0"] + 0.05))
    draw_pins(cam, rgb, pins, tt)
    focus = float(np.linalg.norm(pos - tgt))
    return dof(rgb, np.minimum(depth, 400), focus, 40, band=0.07)


def backdrop(cam, rgb, depth):
    table(cam, rgb, depth)
    draw_board(cam, rgb, depth, base_plate(), pos=(0, 0, -9), s=1.6)


def card_shot(s, tt):
    d = s["end"] - s["start"]
    u = smoother(tt / (d + XF))
    side = 1 if rnd(s["i"] + 7) > 0.5 else -1
    CW, cy = 14.6, 4.6
    CH = CW * 9 / 16
    bob = math.sin(tt * 0.9 + s["i"]) * 0.04
    D = 19.6 - u * 1.0
    pos = np.array([side * (1.6 - u * 1.2), cy + 1.6, D]); tgt = np.array([0, cy, 0])
    cam = Cam(pos, tgt)
    rgb = sky(cam).astype(np.float32); depth = np.full((H, W), np.inf, np.float32)
    backdrop(cam, rgb, depth)
    rot = side * (0.07 - u * 0.05)
    c, sn = math.cos(rot), math.sin(rot)

    def P(x, y, z=0.0):  # card local → world (rotation about y, slight tilt back)
        y2, z2 = y * math.cos(-0.04) - z * math.sin(-0.04), y * math.sin(-0.04) + z * math.cos(-0.04)
        return [x * c + z2 * sn, cy + bob + y2, -x * sn + z2 * c]
    hw, hh, th = CW / 2 + 0.1, CH / 2 + 0.1, 0.22
    # shadow of the card on the table (projected along the light)
    soft_shadow(cam, rgb, [[p[0] + 2.2, -0.5, p[2] + 1.0] for p in (P(-hw, -hh), P(hw, -hh), P(hw, -hh, -th), P(-hw, -hh, -th))], 0.22, 60)
    # contact shadow around the card (screen space) so the white card separates from the bright room
    fq, _ = cam.proj([P(-hw, hh, -th / 2), P(hw, hh, -th / 2), P(hw, -hh, -th / 2), P(-hw, -hh, -th / 2)])
    m = np.zeros((H // 2, W // 2), np.uint8)
    cv2.fillConvexPoly(m, np.int32(np.round((fq + [14, 26]) / 2)), 255, lineType=cv2.LINE_AA)
    m = cv2.resize(cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 16), (W, H))[..., None]
    rgb *= (1 - 0.30 * m)
    # card body: edges then face
    edge = np.full((8, 8, 3), 214, np.uint8)
    for quad in ([P(-hw, -hh, th / 2), P(hw, -hh, th / 2), P(hw, -hh, -th / 2), P(-hw, -hh, -th / 2)],
                 [P(hw, hh, th / 2), P(hw, -hh, th / 2), P(hw, -hh, -th / 2), P(hw, hh, -th / 2)] if side < 0 else
                 [P(-hw, hh, th / 2), P(-hw, -hh, th / 2), P(-hw, -hh, -th / 2), P(-hw, hh, -th / 2)]):
        warp_quad(edge, cam, quad, rgb, depth, None)
    white = np.full((8, 8, 3), 250, np.uint8)
    face = [P(-hw, hh, th / 2), P(hw, hh, th / 2), P(hw, -hh, th / 2), P(-hw, -hh, th / 2)]
    dist = float(np.linalg.norm(np.array(P(0, 0, th / 2)) - pos))
    warp_quad(white, cam, face, rgb, depth, dist)
    inner = [P(-CW / 2, CH / 2, th / 2 + 0.002), P(CW / 2, CH / 2, th / 2 + 0.002), P(CW / 2, -CH / 2, th / 2 + 0.002), P(-CW / 2, -CH / 2, th / 2 + 0.002)]
    warp_quad(plate(s["i"], tt), cam, inner, rgb, depth, dist)
    return dof(rgb, np.minimum(depth, 400), dist, 30)


_FCACHE = {}


def font(size, f=FONT):
    k = (size, f)
    if k not in _FCACHE:
        _FCACHE[k] = ImageFont.truetype(f, size)
    return _FCACHE[k]


_BIG = {}


def big_images(val, sub):
    k = (val, sub)
    if k not in _BIG:
        size = 300
        while font(size).getlength(val) > 1900 and size > 80:
            size -= 10
        im = Image.new("RGBA", (2048, 512), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((1024, 270), val, font=font(size), fill=AMBER + (255,), anchor="mm")
        front = np.array(im).astype(np.float32)
        # front face gets a soft top light
        g = np.linspace(1.12, 0.92, 512, dtype=np.float32)[:, None, None]
        front[..., :3] = np.clip(front[..., :3] * g, 0, 255)
        side = front.copy(); side[..., :3] = np.array((130, 68, 0), np.float32)
        pl = Image.new("RGBA", (2048, 220), (0, 0, 0, 0)); dp = ImageDraw.Draw(pl)
        dp.rounded_rectangle([0, 0, 2047, 219], 60, fill=(255, 255, 255, 255))
        fs = 96
        while font(fs).getlength(sub) > 1900 and fs > 40:
            fs -= 4
        dp.text((1024, 116), sub, font=font(fs), fill=INK + (255,), anchor="mm")
        _BIG[k] = (front, side, np.array(pl).astype(np.float32))
    return _BIG[k]


def warp_rgba(rgb, src, cam, corners, alpha=1.0):
    h, w = src.shape[:2]
    q, zc = cam.proj(corners)
    if np.any(zc < 0.05):
        return
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), q.astype(np.float32))
    im = cv2.warpPerspective(src, M, (W, H), flags=cv2.INTER_LINEAR)
    a = im[..., 3:4] / 255 * alpha
    rgb[:] = rgb * (1 - a) + im[..., :3] * a


def big_shot(s, tt):
    d = s["end"] - s["start"]
    val, sub = (s["big"] + ["", ""])[:2]
    u = smoother(tt / (d + XF))
    side = 1 if rnd(s["i"] + 3) > 0.5 else -1
    pos = np.array([side * (2.6 - u * 2.2), 5.6 - u * 0.4, 14.5 - u * 1.0]); tgt = np.array([0, 1.9, 0])
    cam = Cam(pos, tgt)
    rgb = sky(cam).astype(np.float32); depth = np.full((H, W), np.inf, np.float32)
    table(cam, rgb, depth)
    draw_board(cam, rgb, depth, base_plate(), pos=(0, 0, -2), s=1.5)
    rgb = dof(rgb, np.minimum(depth, 400), float(np.linalg.norm(pos - tgt)), 30)
    front, sidei, pl = big_images(val, sub)
    rise = sm(tt / 0.55)
    yb = 3.0 + (rise - 1) * 2.5
    sy = 0.6 + 0.4 * rise
    # shadow of the block on the board
    soft_shadow(cam, rgb, [[-5.0 + 1.6, 0.0, 0.3], [5.0 + 1.6, 0.0, 0.3], [5.4 + 1.6, 0.0, 1.4], [-4.6 + 1.6, 0.0, 1.4]], 0.18 * rise, 40)
    for k in range(16, 0, -1):
        z = -k * 0.024
        warp_rgba(rgb, sidei, cam, [[-6, yb + 1.5 * sy, z], [6, yb + 1.5 * sy, z], [6, yb - 1.5 * sy, z], [-6, yb - 1.5 * sy, z]])
    warp_rgba(rgb, front, cam, [[-6, yb + 1.5 * sy, 0], [6, yb + 1.5 * sy, 0], [6, yb - 1.5 * sy, 0], [-6, yb - 1.5 * sy, 0]])
    if sub:
        a = sm((tt - 0.35) / 0.5)
        if a > 0:
            sc = 0.6 + 0.4 * a
            cy, cz = 1.15, 0.9
            hw, hh = 4.8 * sc, 0.55 * sc
            tilt = 0.2
            P = lambda x, y: [x, cy + y * math.cos(tilt), cz + y * math.sin(tilt)]
            soft_shadow(cam, rgb, [[-hw + 0.8, 0, cz + 0.5], [hw + 0.8, 0, cz + 0.5], [hw + 0.8, 0, cz + 1.4], [-hw + 0.8, 0, cz + 1.4]], 0.15 * a, 30)
            warp_rgba(rgb, pl, cam, [P(-hw, hh), P(hw, hh), P(hw, -hh), P(-hw, -hh)], a)
    return rgb


# globe
GTEX = None
HL = None


def globe_shot(s, tt):
    global GTEX, HL
    if GTEX is None:
        GTEX = np.array(Image.open(HERE / "public/globe.jpg").convert("RGB")).astype(np.float32)
        hp = HERE / f"public/hl_{KEY}.png"
        HL = np.array(Image.open(hp).convert("RGBA")).astype(np.float32) if hp.exists() else None
    P = s["P"]; d = s["end"] - s["start"]
    k = smoother(tt / d)
    lon0 = P["lon"][0] + (P["lon"][1] - P["lon"][0]) * k
    lat0 = P["lat"][0] + (P["lat"][1] - P["lat"][0]) * k
    r = P["r"][0] + (P["r"][1] - P["r"][0]) * k
    cx, cy = W / 2, P.get("cy", 560)
    xs = (_vx - cx) / r; ys = (cy - _vy) / r
    rho2 = xs ** 2 + ys ** 2
    inside = rho2 < 1
    zz = np.sqrt(np.clip(1 - rho2, 0, 1))
    la0, lo0 = math.radians(lat0), math.radians(lon0)
    # inverse orthographic
    lat = np.arcsin(np.clip(zz * math.sin(la0) + ys * math.cos(la0), -1, 1))
    lon = lo0 + np.arctan2(xs, zz * math.cos(la0) - ys * math.sin(la0))
    gw, gh = GTEX.shape[1], GTEX.shape[0]
    u = ((np.degrees(lon) + 180) % 360 / 360 * gw).astype(np.float32)
    v = ((90 - np.degrees(lat)) / 180 * gh).astype(np.float32)
    col = cv2.remap(GTEX, u, v, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
    if HL is not None:
        a = sm((tt - 0.4) / 1.0)
        hl = cv2.remap(HL, u, v, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)
        al = hl[..., 3:4] / 255 * a
        col = col * (1 - al) + hl[..., :3] * al
    # light: lambert from upper left front + ambient, slight specular on the ocean
    L = np.array([-0.45, 0.42, 0.79]); L /= np.linalg.norm(L)
    ndl = np.clip(xs * L[0] + ys * L[1] + zz * L[2], 0, 1)
    shade = 0.42 + 0.72 * ndl
    spec = np.clip(xs * 0.2 + ys * 0.3 + zz * 0.93, 0, 1) ** 40 * 40
    col = col * shade[..., None] + spec[..., None]
    bg = np.empty((H, W, 3), np.float32)
    g = np.clip(_vy / H, 0, 1)[..., None]
    bg[:] = np.array((198, 216, 232), np.float32) * (1 - g) + np.array((244, 239, 230), np.float32) * g
    rim = np.sqrt(rho2)
    glow = np.clip(1 - (rim - 1) / 0.12, 0, 1) ** 2 * (rim >= 1)
    bg = bg + glow[..., None] * np.array((60, 110, 190), np.float32) * 0.55
    edge = np.clip((1 - rim) * r / 1.5, 0, 1)[..., None]
    out = bg * (1 - edge) + col * edge
    # atmosphere inner haze at the limb
    haze = np.clip((rim - 0.82) / 0.18, 0, 1) ** 2 * inside
    out = out * (1 - 0.35 * haze[..., None]) + np.array((150, 190, 240), np.float32) * 0.35 * haze[..., None]
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).convert("RGBA")
    dr = ImageDraw.Draw(img)

    def gp(lo, la):
        la_, lo_ = math.radians(la), math.radians(lo)
        x = math.cos(la_) * math.sin(lo_ - lo0)
        y = math.cos(la0) * math.sin(la_) - math.sin(la0) * math.cos(la_) * math.cos(lo_ - lo0)
        vis = math.sin(la0) * math.sin(la_) + math.cos(la0) * math.cos(la_) * math.cos(lo_ - lo0) > 0
        return cx + x * r, cy - y * r, vis
    import re
    mlat = re.search(r"北緯約?(\d+(?:\.\d+)?)", P.get("why") or "")
    if mlat:
        a = sm((tt - 0.8) / 0.8)
        pts = [gp(lo, float(mlat.group(1))) for lo in np.linspace(lon0 - 179, lon0 + 179, 240)]
        pts = [(x, y) for x, y, vv in pts if vv]
        if a > 0 and len(pts) > 2:
            dr.line(pts, fill=AMBER + (int(255 * a),), width=5, joint="curve")
    rgb = np.array(img.convert("RGB")).astype(np.float32)
    dest = next(((n, c) for k in (1, 0) for n, c in DATA["cities"].items() if abs(c[0] - P["lon"][k]) < 0.4 and abs(c[1] - P["lat"][k]) < 0.4), None)
    if dest:
        x, y, vis = gp(*dest[1])
        tl = tt - d * 0.55
        if vis and tl > 0:
            fall = min(1.0, tl / 0.32)
            hy = y - 46 - (1 - fall * fall) * 260
            cv2.line(rgb, (int(x), int(y)), (int(x), int(hy)), (175, 178, 186), 4, cv2.LINE_AA)
            over(rgb, PIN[AMBER], x, hy, 96)
            a = sm((tl - 0.2) / 0.4)
            if a > 0:
                im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")
                V4.text(im, (x + 40, hy), dest[0], 50, anchor="lm", alpha=a)
                rgb = np.array(im.convert("RGB")).astype(np.float32)
    return rgb


# true-3D hero clips rendered with Remotion (src/heroes), replacing a run of shots: key -> [(first, last, clip id)]
HEROES = {"bm": [(1, 3, "BM-H1")], "ca": [(3, 3, "CA-H1")]}
_HR = {}


def hero_rgb(s, tt):
    for a, b, cid in HEROES.get(KEY, []):
        if a <= s["i"] <= b:
            t0 = SHOTS[a]["start"]
            n = int(round((s["start"] + tt - t0) * FPS))
            r = _HR.get(cid)
            if r is None or r.n > n:
                if r:
                    r.close()
                r = _HR[cid] = Reader.__new__(Reader)
                r.i, r.n, r.last = cid, -1, None
                r.p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(HERE / "out" / cid / "seg000.mp4"), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                       stdout=subprocess.PIPE, bufsize=W * H * 3 * 2)
            return r.get(n).astype(np.float32)
    return None


def shot_rgb(s, tt):
    hr = hero_rgb(s, tt)
    if hr is not None:
        return hr
    k = s["kind"]
    if k == "map":
        return map_shot(s, tt)
    if k == "globe":
        return globe_shot(s, tt)
    if s.get("big"):
        return big_shot(s, tt)
    return card_shot(s, tt)


def frame(n):
    t = n / FPS
    i = next((k for k, s in enumerate(SHOTS) if s["start"] <= t < s["end"]), len(SHOTS) - 1)
    s = SHOTS[i]
    rgb = shot_rgb(s, t - s["start"])
    same_hero = any(a <= i and i + 1 <= b for a, b, _ in HEROES.get(KEY, []))
    if i + 1 < len(SHOTS) and t > s["end"] - XF and not same_hero:
        nx = SHOTS[i + 1]
        a = sm((t - (s["end"] - XF)) / XF)
        rgb = rgb * (1 - a) + shot_rgb(nx, 0.0) * a
    rgb = finish(rgb, n)
    img = Image.fromarray(rgb.astype(np.uint8)).convert("RGBA")
    for c in DATA["subs"]:
        if c["start"] - 0.05 <= t < c["end"] + 0.05:
            V4.subtitle(img, c["lines"])
            break
    return np.array(img.convert("RGB"))


def render(n0, n1, path):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "medium", "-crf", os.environ.get("CRF", "17"), "-pix_fmt", "yuv420p", str(path)], stdin=subprocess.PIPE)
    for n in range(n0, n1):
        p.stdin.write(frame(n).tobytes())
    p.stdin.close(); p.wait()


if __name__ == "__main__":
    args = sys.argv[2:]
    if args and args[0] == "--still":
        for a in args[1:]:
            Image.fromarray(frame(int(round(float(a) * FPS)))).save(OUT / f"still_{float(a):07.2f}.jpg", quality=88)
    elif args and args[0] == "--chunks":
        i, m = map(int, args[1].split("/"))
        nch = int(math.ceil(TOTAL / 10.0))
        for c in range(i - 1, nch, m):
            dst = OUT / f"c_{c:03d}.mp4"
            if dst.exists():
                continue
            tmp = OUT / f"c_{c:03d}.tmp.mp4"
            render(int(round(c * 10 * FPS)), int(round(min(TOTAL, (c + 1) * 10) * FPS)), tmp)
            tmp.rename(dst)
            print(f"{KEY} chunk {c}/{nch - 1}", flush=True)
    elif args and args[0] == "--mux":
        nch = int(math.ceil(TOTAL / 10.0))
        parts = sorted(OUT.glob("c_[0-9][0-9][0-9].mp4"))
        assert len(parts) == nch, (len(parts), nch)
        (OUT / "parts.txt").write_text("".join(f"file '{p.name}'\n" for p in parts))
        mix = OUT / "mix.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(OUT / "parts.txt"), "-i", str(mix),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-af", "loudnorm=I=-15:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac",
                        "-b:a", "192k", "-shortest", str(OUT / f"{EPN}_full_3d.mp4")], check=True)
