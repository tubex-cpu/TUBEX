"""章の書き出し：カットごとに小さな mp4 を作り、章 → 全編の順に連結する。

build/<章>/
  timeline.json            カットと文の時刻
  shots/NNN.mp4 + NNN.key  カットごとの映像と入力ハッシュ（同じなら再描画しない＝再開・部分修正）
  narration.wav score.wav mix.wav
  chapter.mp4              章の完成（映像＋音）
  storyboard.jpg           全カット一覧
build/final.mp4            全章の連結
"""
import hashlib
import json
import os
import subprocess
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

from . import audio
from .character import Character
from .project import Project, shot_key, timeline
from .shots import ShotRenderer
from .style import Fonts, Style

ENGINE_DIR = Path(__file__).resolve().parent
VIDEO_ARGS = ['-c:v', 'libx264', '-preset', 'fast', '-crf', '17', '-pix_fmt', 'yuv420p']


def engine_hash():
    h = hashlib.sha256()
    for p in sorted(ENGINE_DIR.glob('*.py')):
        if p.name in ('style.py', 'shots.py', 'character.py'):
            h.update(p.read_bytes())
    return h.hexdigest()[:16]


_worker = {}


def renderer(project_dir):
    """プロセスごとに1回だけ素材・フォントを読み込む。"""
    if project_dir not in _worker:
        p = Project(project_dir)
        fonts = Fonts(p.cfg['fonts'])
        style = Style(fonts, p.assets)
        _worker[project_dir] = (p, ShotRenderer(style, lambda: Character(p.assets)))
    return _worker[project_dir]


def frame_at(project_dir, item, f):
    """章の f フレーム目（item のカット内）を描く。"""
    p, r = renderer(project_dir)
    t = f / p.fps
    u = t - item['start'] / p.fps
    return r.frame(item['shot'], t, u)


def _render_shot(args):
    project_dir, item, out, key = args
    p, r = renderer(project_dir)
    tmp = out.with_suffix('.part.mp4')
    cmd = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', str(p.fps), '-i', '-',
           *VIDEO_ARGS, '-r', str(p.fps), str(tmp)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(item['start'], item['end']):
        proc.stdin.write(frame_at(project_dir, item, f).tobytes())
    proc.stdin.close()
    assert proc.wait() == 0, 'ffmpeg failed for ' + str(out)
    tmp.replace(out)
    out.with_suffix('.key').write_text(key)
    return item['index']


class ChapterBuild:
    def __init__(self, project, cid, voice=None):
        self.p = project
        self.ch = project.chapter(cid)
        self.dir = project.build / cid
        self.dir.mkdir(parents=True, exist_ok=True)
        self.voice = voice
        self.tl = timeline(project, self.ch, voice if self.ch['timing'] == 'voice' else None)
        (self.dir / 'timeline.json').write_text(json.dumps(
            {'frames': self.tl['frames'], 'seconds': self.tl['frames'] / project.fps,
             'shots': [{'index': s['index'], 'start': s['start'] / project.fps, 'end': s['end'] / project.fps,
                        'asset': s['shot'].get('asset') or s['shot']['bg'].get('asset'), 'note': s['shot'].get('note', '')} for s in self.tl['shots']],
             'sentences': self.tl['sentences']}, ensure_ascii=False, indent=1))

    def keys(self):
        fonts = Fonts(self.p.cfg['fonts']).chosen
        eh = engine_hash()
        return {s['index']: shot_key(self.p, self.ch, s, eh, fonts) for s in self.tl['shots']}

    def shot_path(self, i):
        return self.dir / 'shots' / f'{i:03d}.mp4'

    def status(self):
        keys = self.keys()
        done = [i for i, k in keys.items() if self.shot_path(i).exists() and self.shot_path(i).with_suffix('.key').exists()
                and self.shot_path(i).with_suffix('.key').read_text() == k]
        return len(done), len(keys)

    def render_shots(self, only=None, jobs=None):
        (self.dir / 'shots').mkdir(exist_ok=True)
        keys = self.keys()
        todo = []
        for item in self.tl['shots']:
            i = item['index']
            if only is not None and i not in only:
                continue
            kp = self.shot_path(i).with_suffix('.key')
            if self.shot_path(i).exists() and kp.exists() and kp.read_text() == keys[i]:
                continue
            todo.append((str(self.p.dir), item, self.shot_path(i), keys[i]))
        print(f'{self.ch["id"]}: {len(todo)} カットを描画（{len(keys) - len(todo)} カットは前回の結果を再利用）', flush=True)
        jobs = jobs or max(1, (os.cpu_count() or 2) - 1)
        with ProcessPoolExecutor(jobs) as ex:
            for n, i in enumerate(ex.map(_render_shot, todo), 1):
                print(f'  {n}/{len(todo)} #{i:03d}', flush=True)
        # 章のカット一覧から外れた古いファイルを片付ける
        valid = {self.shot_path(s['index']).name for s in self.tl['shots']}
        for f in (self.dir / 'shots').glob('*.mp4'):
            if f.name not in valid:
                f.unlink()
                f.with_suffix('.key').unlink(missing_ok=True)

    def build_audio(self):
        seconds = self.tl['frames'] / self.p.fps
        a = self.ch.get('audio', {})
        out = self.dir / 'mix.wav'
        if 'mix' in a:
            # 承認済みの完成ミックスをそのまま使う
            data, sr = audio.read_wav(self.p.assets.path(a['mix']))
            assert sr == audio.SR
            audio.write_wav(out, _fit(data, seconds))
            return out
        n = int(round(seconds * audio.SR))
        nar = np.zeros(n, dtype=np.float32)
        for s in self.tl['sentences']:
            data, sr = audio.read_wav(s['wav'])
            assert sr == audio.SR, 'VOICEVOX の出力を 48kHz にする'
            a0 = int(round(s['start'] * audio.SR))
            seg = data[:, 0][:max(0, n - a0)]
            nar[a0:a0 + len(seg)] += seg
        audio.write_wav(self.dir / 'narration.wav', nar[:, None])
        fps = self.p.fps
        bounds = [s['start'] / fps for s in self.tl['shots'][1:]]
        hits = [s['start'] / fps for s in self.tl['shots'] if s['shot'].get('hit')]
        sc = audio.score(seconds, hits=hits, transitions=bounds, motifs=audio.auto_motifs(seconds),
                         seed=a.get('seed', 18), fade_in=a.get('fade_in', .2), fade_out=a.get('fade_out', 1.5))
        audio.write_wav(self.dir / 'score.wav', sc)
        audio.mix(self.dir / 'narration.wav', self.dir / 'score.wav', out)
        return out

    def assemble(self):
        """カットの mp4 を無劣化でつなぎ、章の音を合わせる。"""
        lst = self.dir / 'shots.txt'
        lst.write_text(''.join(f"file '{self.shot_path(s['index'])}'\n" for s in self.tl['shots']))
        missing = [s['index'] for s in self.tl['shots'] if not self.shot_path(s['index']).exists()]
        assert not missing, f'未描画のカット: {missing}'
        mix = self.build_audio()
        seconds = self.tl['frames'] / self.p.fps
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst.resolve()), '-i', str(mix),
                        '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', f'{seconds:.4f}',
                        '-movflags', '+faststart', str(self.dir / 'chapter.mp4')], check=True)
        return self.dir / 'chapter.mp4'

    def storyboard(self, cols=4):
        """全カットの一覧（各カットの中央のフレーム）。"""
        items = self.tl['shots']
        rows = (len(items) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * 400, rows * 249), '#080c10')
        d = ImageDraw.Draw(sheet)
        p, r = renderer(str(self.p.dir))
        font = r.s.ft(14)
        for k, item in enumerate(items):
            mid = (item['start'] + item['end']) // 2
            f = frame_at(str(self.p.dir), item, mid)
            f.thumbnail((400, 225))
            x, y = k % cols * 400, k // cols * 249
            sheet.paste(f, (x, y))
            a, b = item['start'] / p.fps, item['end'] / p.fps
            d.text((x + 6, y + 229), f"{a:05.1f}–{b:05.1f}s  {item['shot'].get('note', '')}", font=font, fill='#fff8eb')
        out = self.dir / 'storyboard.jpg'
        sheet.save(out, quality=92)
        return out


def _fit(data, seconds):
    n = int(round(seconds * audio.SR))
    if len(data) >= n:
        return data[:n]
    return np.concatenate([data, np.zeros((n - len(data), data.shape[1]), dtype=data.dtype)])


def concat(project, chapter_ids, out):
    """章をつなぐ。映像は無劣化、音は PCM をつないでから1回だけ AAC にする。"""
    b = project.build
    lst = b / 'chapters.txt'
    lst.write_text(''.join((b / c / 'shots.txt').read_text() for c in chapter_ids))
    mixes = [audio.read_wav(b / c / 'mix.wav')[0] for c in chapter_ids]
    audio.write_wav(b / 'final-mix.wav', np.concatenate(mixes))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-i', str(b / 'final-mix.wav'),
                    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest',
                    '-movflags', '+faststart', str(out)], check=True)
    return out
