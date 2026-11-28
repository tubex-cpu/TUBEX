"""サムネ用の主役素材（文字なし）。本編と同じ3Dの世界・部品（kit.py / shots.py）で、本編の1場面に見えるように組む。
社長指示 2026-11-22「このちゃんねるたちのように動画の切り抜きシーンの一部のような絵風にしたい」。
使い方: /home/user/work_neko/venv/bin/python scenes.py <A|B|C> <out.png>"""
import sys, os, math, random
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'video'))
os.environ.setdefault('NEKO_VER', 'v5')
import kit
from kit import *
import shots_v5 as S


def open_mouth(c, f=1):
    meow(c, [f], dur=30, lift=0.25)


def scene_A():
    """6億匹 止まらない：夕方の路地。手前で大きく鳴く猫、塀・屋根・道に鳴く猫が並ぶ"""
    S.street_env(corner=False)
    s = bpy.context.scene; sky(hexc('#f0a868')); s.view_settings.exposure = 0.25
    light_dir((0.85, -0.25, 0.3)); s.display.shading.shadow_intensity = 0.7
    front = cat((0.3, -12.6, 0), 'tora', s=0.62, rot_z=math.pi * 0.08)
    open_mouth(front)
    rnd = random.Random(4)
    for i in range(26):
        side = -1 if i % 2 else 1
        y = -11 + i * 0.9
        z = 1.3 if i % 3 else 0
        x = side * (2.2 if z else rnd.uniform(0.4, 1.3))
        c = cat((x, y, z), rnd.choice(['kuro', 'shiro', 'mike', 'saba', 'tora', 'hachi']), s=0.62,
                rot_z=rnd.uniform(-0.6, 0.6) + (math.pi * 0.5 * side if z else 0))
        open_mouth(c)
        if i % 6 == 3:
            rings((x, y, z + 0.45), [1], rgb=(1, 0.92, 0.7), size=0.45, n=1)
    cam = camera(32, dof=1.2, fstop=2.0)
    look(cam, (0.75, -13.6, 0.22), (-0.2, -7.0, 0.9))
    return 6


def scene_B():
    """ネズミが 得をする：夜の路地。手前にネズミ、奥で鳴き続ける猫（声で居場所が分かる）"""
    S.env_alley()
    s = bpy.context.scene; s.view_settings.exposure = 0.05
    rat = S.make_rat((0.25, 0.6, 0), rot_z=0.7)
    rat.scale = (1.4, 1.4, 1.4)
    for sx in (-1, 1):
        link(sphere((sx * 0.015, -0.118, 0.072), 0.007, hexc('#0a0a0a'), seg=10), rat)
    link(sphere((0, -0.128, 0.058), 0.006, hexc('#d98a8a'), seg=10), rat)
    box((0.9, 0.9, 0.02), (0.5, 0.5, 0.04), hexc('#2a2a30'))  # 排水口
    for i in range(3):
        c = cat((-0.8 + i * 0.9, 6 + i * 1.2, 0), ['saba', 'kuro', 'tora'][i], s=0.62, rot_z=math.pi)
        open_mouth(c)
        rings((-0.8 + i * 0.9, 6 + i * 1.2, 0.45), [1], rgb=(1, 0.85, 0.5), size=0.8, n=2)
    box((1.7, 3.0, 2.3), (0.3, 0.3, 0.2), hexc('#ffd98a'))
    cam = camera(45, dof=0.7, fstop=1.8)
    look(cam, (0.75, -0.25, 0.13), (0.0, 1.6, 0.14))
    return 6


def scene_C():
    """呼ばれているのは 人間：床の高さ。何匹もの猫が、こちら（人）を見上げて鳴く"""
    S.living_room()
    s = bpy.context.scene; s.view_settings.exposure = 0.3
    light_dir((-0.5, -0.6, 0.6)); s.display.shading.shadow_intensity = 0.6
    rnd = random.Random(7)
    pos = [(0.0, 0.0), (-0.45, 0.35), (0.48, 0.3), (-0.9, 0.85), (0.95, 0.8), (0.1, 0.95)]
    for i, (x, y) in enumerate(pos):
        c = cat((x, y, 0), ['tora', 'kuro', 'shiro', 'mike', 'saba', 'hachi'][i], s=0.62, rot_z=-math.atan2(x, y + 1.3))
        meow(c, [1], dur=30, lift=0.6)
    # 人（あなた）の目線：上から見下ろすと、猫が全員こちらを見上げて鳴いている
    cam = camera(30, dof=1.9, fstop=2.4)
    look(cam, (0.0, -1.3, 1.45), (0.0, 0.45, 0.1))
    return 6


def main():
    which, out = sys.argv[1], sys.argv[2]
    reset((1920, 1080))
    f = {'A': scene_A, 'B': scene_B, 'C': scene_C}[which]()
    s = bpy.context.scene
    s.frame_set(f); s.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('DONE', out)


if __name__ == '__main__':
    main()
