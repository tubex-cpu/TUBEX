"""音：VOICEVOX のナレーション、オリジナル合成の BGM・低音・転換音、ミックス。

BGM は承認済みパッケージの sound.py を、尺・低音の位置・転換音の位置を引数にして一般化したもの。
`score(60, hits=[0,21,24,42,57], transitions=[3,6,...,57], motifs=OPENING_MOTIFS)` が
承認済み60秒版の score.wav と同じ音になる（build.py selftest で確認）。
"""
import hashlib
import json
import subprocess
import urllib.parse
import urllib.request
import wave
from pathlib import Path

import numpy as np

SR = 48000
OPENING_MOTIFS = [(8.3, 440), (17.3, 466.164), (29.3, 329.628), (38.3, 415.305), (47.3, 293.665), (54.3, 440)]
MOTIF_FREQS = [440, 466.164, 329.628, 415.305, 293.665]


def auto_motifs(duration, every=9.0, first=8.3):
    """長い章では、短い上の音を約9秒おきに置く（承認版の間隔に合わせる）。"""
    out = []
    b = first
    j = 0
    while b < duration - 3:
        out.append((round(b, 3), MOTIF_FREQS[j % len(MOTIF_FREQS)]))
        b += every
        j += 1
    return out


def score(duration, hits, transitions, motifs, seed=18, fade_in=.2, fade_out=1.5):
    """控えめな低音の持続音とパルス、要所の低音（hits）、カット境界の小さな転換音。"""
    N = int(round(SR * duration))
    t = np.arange(N) / SR
    rng = np.random.default_rng(seed)
    m = np.zeros((N, 2), dtype=np.float32)
    for f, g in [(55, .018), (82.4069, .009), (110, .006), (130.813, .004)]:
        for ch in range(2):
            m[:, ch] += g * np.sin(2 * np.pi * (f + ch * .08) * t) * (0.75 + .25 * np.sin(t * .3))

    def add(start, sig, pan=0):
        a = int(start * SR)
        b = min(N, a + len(sig))
        sig = sig[:b - a]
        if b > a:
            m[a:b, 0] += sig * (1 - pan * .4)
            m[a:b, 1] += sig * (1 + pan * .4)
    for b in np.arange(0, duration - .5, .75):
        u = np.arange(int(SR * .38)) / SR
        sig = (np.sin(2 * np.pi * 110 * u) + .3 * np.sin(2 * np.pi * 164.81 * u)) * .018 * np.exp(-u * 14)
        add(b, sig, (-1 if int(b / .75) % 2 else 1) * .6)
    for b in hits:
        u = np.arange(int(SR * 2)) / SR
        phase = 2 * np.pi * (42 * u + 35 * (1 - np.exp(-u * 7)) / 7)
        hit = .19 * np.sin(phase) * np.exp(-u * 3) + .025 * rng.standard_normal(len(u)) * np.exp(-u * 16)
        add(b, hit)
    for b in transitions:
        u = np.arange(int(SR * .45)) / SR
        n = rng.standard_normal(len(u))
        n = np.convolve(n, np.ones(12) / 12, mode='same')
        add(b - .35, n * .045 * np.sin(np.pi * u / .45) ** 2, 0)
    for b, f in motifs:
        u = np.arange(SR * 3) / SR
        sig = .015 * np.sin(2 * np.pi * f * u) * np.exp(-u * 2.3) * (1 - np.exp(-u * 60))
        add(b, sig, .5)
        add(b + .23, sig * .33, -.6)
    fade = np.ones(N)
    if fade_in:
        fade *= np.minimum(1, t / fade_in)
    if fade_out:
        fade *= np.minimum(1, (duration - t) / fade_out)
    m *= fade[:, None]
    return m


def write_wav(path, m):
    m = np.atleast_2d(m.T).T if m.ndim == 1 else m
    with wave.open(str(path), 'wb') as w:
        w.setparams((m.shape[1], 2, SR, 0, 'NONE', 'not compressed'))
        w.writeframes((np.clip(m, -1, 1) * 32767).astype('<i2').tobytes())


def read_wav(path):
    with wave.open(str(path), 'rb') as w:
        assert w.getsampwidth() == 2
        data = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32767
        return data.reshape(-1, w.getnchannels()), w.getframerate()


def mix(narration_wav, score_wav, out_wav):
    """ナレーション最優先。ナレーションを -17 LUFS にそろえて BGM と合わせ、クリップを防ぐ（sound.py と同じ処理）。"""
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(narration_wav), '-i', str(score_wav), '-filter_complex',
                    '[0:a]loudnorm=I=-17:TP=-2:LRA=7,aresample=48000,pan=stereo|c0=c0|c1=c0[v];[v][1:a]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89:level=false[a]',
                    '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s16le', str(out_wav)], check=True)


class Voicevox:
    """ローカルの VOICEVOX エンジン（無料）。文ごとに合成し、キャッシュする。

    エンジンの起動例：docker run -d --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
    """

    def __init__(self, cfg, cache_dir):
        self.url = cfg.get('engine', 'http://localhost:50021')
        self.speaker = cfg['speaker']
        self.speed = cfg.get('speed', 1.0)
        self.readings = cfg.get('readings', [])
        self.cache = Path(cache_dir)
        self.cache.mkdir(parents=True, exist_ok=True)

    def reading(self, text):
        for a, b in self.readings:
            text = text.replace(a, b)
        return text

    def available(self):
        try:
            with urllib.request.urlopen(self.url + '/version', timeout=5) as r:
                return r.read().decode().strip('"')
        except OSError:
            return None

    def sentence(self, text):
        """文の音声（48kHz モノラル）のパスを返す。読み・話者・速度が同じならキャッシュを使う。"""
        spoken = self.reading(text)
        key = hashlib.sha256(json.dumps([spoken, self.speaker, self.speed], ensure_ascii=False).encode()).hexdigest()[:20]
        path = self.cache / f'{key}.wav'
        if path.exists():
            return path
        q = urllib.parse.urlencode({'text': spoken, 'speaker': self.speaker})
        req = urllib.request.Request(f'{self.url}/audio_query?{q}', method='POST')
        with urllib.request.urlopen(req, timeout=120) as r:
            query = json.loads(r.read())
        query.update({'speedScale': self.speed, 'outputSamplingRate': SR, 'outputStereo': False,
                      'prePhonemeLength': 0.05, 'postPhonemeLength': 0.05})
        req = urllib.request.Request(f'{self.url}/synthesis?speaker={self.speaker}', data=json.dumps(query).encode(),
                                     headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=300) as r:
            tmp = path.with_suffix('.tmp')
            tmp.write_bytes(r.read())
        tmp.replace(path)
        return path
