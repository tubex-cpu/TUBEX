#!/usr/bin/env python3
"""長尺動画（20〜30分・60分）の章別制作ツール。承認済み60秒版のデザインを部品化して使う。

使い方（video/longform で実行）
  python build.py fetch-assets  PROJECT          承認済みパッケージ（Git の分割 ZIP）から素材を復元
  python build.py check         PROJECT          依存関係・フォント・素材・全章の lint
  python build.py plan          PROJECT [章]     時刻の割り付けとカット数（声なしの見積もりも可）
  python build.py voice         PROJECT 章       VOICEVOX で章のナレーションを作る（文ごとにキャッシュ）
  python build.py preview       PROJECT 章 [--shot N] [--at 秒]   章の全カット一覧／1枚
  python build.py render        PROJECT 章 [--shot N ...]          章を書き出す（済んだカットは再利用＝再開）
  python build.py status        PROJECT          章ごとの進み具合
  python build.py concat        PROJECT          全章を連結して final.mp4
  python build.py verify        PROJECT [章]     解像度・fps・尺・音声・全編デコード
  python build.py selftest      PROJECT          承認済み60秒版と同じ絵・音になるか確かめる
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from engine import audio  # noqa: E402
from engine.project import Project, lint, main_asset, timeline  # noqa: E402
from engine.render import ChapterBuild, concat, frame_at, renderer  # noqa: E402
from engine.style import Fonts  # noqa: E402


def project_of(name):
    p = Path(name)
    return Project(p if p.is_dir() else HERE / 'projects' / name)


def voice_of(p):
    v = audio.Voicevox(p.cfg['voice'], p.build / 'voice-cache')
    return v


def cmd_fetch_assets(p, args):
    """承認済みパッケージを Git の分割 ZIP から復元し、project/ の素材を assets_dir に置く（ネット接続は Git のみ）。"""
    src = p.cfg['package']
    ref, folder = src['ref'], src['folder']
    root = Path(subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], cwd=HERE, text=True).strip())
    subprocess.run(['git', 'fetch', '-q', 'origin', src.get('branch', ref)], cwd=root, check=False)
    manifest = json.loads(subprocess.check_output(['git', 'show', f'{ref}:{folder}/package-manifest.json'], cwd=root))
    cache = p.build / 'package'
    cache.mkdir(parents=True, exist_ok=True)
    zpath = cache / manifest['filename']
    h = hashlib.sha256()
    with zpath.open('wb') as out:
        for part in manifest['parts']:
            data = subprocess.check_output(['git', 'show', f"{ref}:{folder}/{part['path']}"], cwd=root)
            assert len(data) == part['bytes'] and hashlib.sha256(data).hexdigest() == part['sha256'], part['path']
            out.write(data)
            h.update(data)
    assert h.hexdigest() == manifest['sha256'], 'ZIP checksum mismatch'
    dest = p.assets.root
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zpath) as z:
        assert z.testzip() is None, 'ZIP CRC check failed'
        for info in z.infolist():
            parts = Path(info.filename).parts
            if len(parts) == 3 and parts[1] == 'project' and not info.is_dir():
                target = dest / parts[2]
                if not target.exists():
                    target.write_bytes(z.read(info))
            if len(parts) == 3 and parts[1] == 'reference' and not info.is_dir():
                ref_dir = p.build / 'reference'
                ref_dir.mkdir(exist_ok=True)
                target = ref_dir / parts[2]
                if not target.exists():
                    target.write_bytes(z.read(info))
    print('SHA-256・CRC 一致。素材：', dest)
    print('比較用の承認済み動画：', p.build / 'reference')


def cmd_check(p, args):
    errors = []
    for tool in ['ffmpeg', 'ffprobe']:
        if not shutil.which(tool):
            errors.append('ffmpeg/ffprobe がない: ' + tool)
    fonts = Fonts(p.cfg['fonts'])
    errors += ['フォントがない: ' + k for k in fonts.missing()]
    for kind, (path, index) in fonts.chosen.items():
        print(f'フォント {kind}: {path} [{index}]')
    errors += ['素材ファイルがない（fetch-assets を実行）: ' + k for k in p.assets.missing()]
    v = voice_of(p)
    ok = v.available()
    print('VOICEVOX:', ok or '未起動（声のある章は字数からの見積もりで検査する）')
    for cid in p.chapter_ids():
        ch = p.chapter(cid)
        tl = timeline(p, ch, v if ok and ch['timing'] == 'voice' else None)
        e, w = lint(p, ch, tl)
        errors += e
        for x in w:
            print('注意:', x)
    print('\n'.join('エラー: ' + e for e in errors) if errors else 'check OK')
    return 1 if errors else 0


def cmd_plan(p, args):
    ids = [args.chapter] if args.chapter else p.chapter_ids()
    total = 0
    v = voice_of(p) if args.with_voice else None
    for cid in ids:
        ch = p.chapter(cid)
        tl = timeline(p, ch, v if ch['timing'] == 'voice' else None)
        sec = tl['frames'] / p.fps
        total += sec
        lens = [(s['end'] - s['start']) / p.fps for s in tl['shots']]
        giants = sum(1 for s in tl['shots'] for L in s['shot'].get('layers', []) if L['type'] == 'giant')
        est = '' if ch['timing'] == 'fixed' or v else '（声なしの見積もり）'
        print(f"{cid}: {sec / 60:5.2f}分{est}  カット{len(lens)}  最長{max(lens):.2f}秒  特大数字{giants}  文{len(tl['sentences'])}")
        e, _ = lint(p, ch, tl)
        for x in e:
            print('  エラー:', x)
    print(f'合計 {total / 60:.2f}分')


def cmd_voice(p, args):
    v = voice_of(p)
    assert v.available(), 'VOICEVOX が起動していない（docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest）'
    ch = p.chapter(args.chapter)
    tl = timeline(p, ch, v)
    print(f"{args.chapter}: 文{len(tl['sentences'])}・{tl['frames'] / p.fps / 60:.2f}分")


def cmd_preview(p, args):
    v = voice_of(p)
    b = ChapterBuild(p, args.chapter, v)
    if args.shot is not None or args.at is not None:
        if args.at is not None:
            f = int(round(args.at * p.fps))
            item = next(s for s in b.tl['shots'] if s['start'] <= f < s['end'])
        else:
            item = b.tl['shots'][args.shot]
            f = (item['start'] + item['end']) // 2
        out = b.dir / f'frame-{f / p.fps:.2f}.jpg'
        frame_at(str(p.dir), item, f).save(out, quality=94)
    else:
        out = b.storyboard()
    print(out)


def cmd_render(p, args):
    v = voice_of(p)
    b = ChapterBuild(p, args.chapter, v)
    e, _ = lint(p, b.ch, b.tl)
    if e and not args.force:
        print('\n'.join('エラー: ' + x for x in e))
        return 1
    b.render_shots(only=set(args.shot) if args.shot else None, jobs=args.jobs)
    print(b.assemble())


def cmd_status(p, args):
    v = voice_of(p)
    for cid in p.chapter_ids():
        ch = p.chapter(cid)
        if ch['timing'] == 'voice' and not v.available():
            print(f'{cid}: VOICEVOX 未起動のため確認できない')
            continue
        b = ChapterBuild(p, cid, v)
        done, n = b.status()
        print(f"{cid}: カット {done}/{n}  章の動画 {'あり' if (b.dir / 'chapter.mp4').exists() else 'なし'}")


def cmd_concat(p, args):
    print(concat(p, p.chapter_ids(), p.build / 'final.mp4'))


def probe(path):
    data = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    v = next(x for x in data['streams'] if x['codec_type'] == 'video')
    return data, v


def cmd_verify(p, args):
    if args.chapter:
        path = p.build / args.chapter / 'chapter.mp4'
        b = ChapterBuild(p, args.chapter, voice_of(p))
        expect = b.tl['frames'] / p.fps
    else:
        path = p.build / 'final.mp4'
        expect = 0
        for cid in p.chapter_ids():
            expect += json.loads((p.build / cid / 'timeline.json').read_text())['seconds']
    data, v = probe(path)
    assert (v['width'], v['height']) == (1920, 1080), 'resolution'
    assert v['r_frame_rate'] == f'{p.fps}/1', 'fps'
    dur = float(data['format']['duration'])
    assert abs(dur - expect) < .1, f'duration {dur} != {expect}'
    assert any(x['codec_type'] == 'audio' for x in data['streams']), 'audio'
    subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(path), '-f', 'null', '-'], check=True)
    print(f'Verified: {dur:.2f}s, 1920x1080, {p.fps}fps, audio, full decode: {path}')


def cmd_selftest(p, args):
    """承認済みパッケージの render.py・sound.py と、新しい部品の出力を比べる。"""
    import importlib.util
    import numpy as np
    pkg = p.assets.root
    cid = p.cfg.get('selftest_chapter', p.chapter_ids()[0])
    b = ChapterBuild(p, cid, None)
    # 1) 音：sound.py の score.wav と同じ BGM になるか
    sc = audio.score(60, hits=[0, 21, 24, 42, 57], transitions=list(range(3, 60, 3)), motifs=audio.OPENING_MOTIFS)
    ref, _ = audio.read_wav(pkg / 'score.wav')
    mine = (np.clip(sc, -1, 1) * 32767).astype('<i2')
    ref_i = np.round(ref * 32767).astype('<i2')
    print('BGM（score.wav）:', '一致' if np.array_equal(mine, ref_i) else f'不一致 最大差 {np.abs(mine.astype(int) - ref_i).max()}')
    # 2) 絵：承認済み render.py の frame(t) と全フレーム（または間引き）で比べる
    sys.argv = ['render.py']
    sys.path.insert(0, str(pkg))
    spec = importlib.util.spec_from_file_location('approved_render', pkg / 'render.py')
    old = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(old)
    step = args.step
    same = diff = 0
    worst = []
    for item in b.tl['shots']:
        for f in range(item['start'], item['end'], step):
            a = np.asarray(old.frame(f / p.fps))
            n = np.asarray(frame_at(str(p.dir), item, f))
            if np.array_equal(a, n):
                same += 1
            else:
                diff += 1
                worst.append((f, int(np.abs(a.astype(int) - n.astype(int)).max())))
    print(f'絵：{same + diff} フレーム中 {same} 一致、{diff} 不一致', worst[:10])
    return 0 if diff == 0 else 1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('action', choices=['fetch-assets', 'check', 'plan', 'voice', 'preview', 'render', 'status', 'concat', 'verify', 'selftest'])
    ap.add_argument('project')
    ap.add_argument('chapter', nargs='?')
    ap.add_argument('--shot', type=int, nargs='*')
    ap.add_argument('--at', type=float)
    ap.add_argument('--jobs', type=int)
    ap.add_argument('--step', type=int, default=1)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--with-voice', action='store_true')
    args = ap.parse_args()
    if args.action == 'preview':
        args.shot = args.shot[0] if args.shot else None
    p = project_of(args.project)
    fn = globals()['cmd_' + args.action.replace('-', '_')]
    return fn(p, args) or 0


if __name__ == '__main__':
    sys.exit(main())
