"""「東日本大震災」を「ひがしにほんだいしんさい」と読み直す（社長 2026-11-28）。
時間割（timeline.json）を変えないよう、新しい音声を元の長さに合わせて narration.wav の同じ位置に上書きする。映像の作り直しは不要。"""
import json, os, sys, wave, shutil
import numpy as np
sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video')
os.environ.setdefault('NEKO_VER', 'v5')
import narration as N
OUT = '/home/user/work_neko/out_nankai'
tl = json.load(open(f'{OUT}/timeline.json'))
def rd(p):
    with wave.open(p) as f: return f.getframerate(), np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).copy()
sr, nar = rd(f'{OUT}/narration.wav')
if not os.path.exists(f'{OUT}/narration_before_reading_fix.wav'):
    shutil.copy(f'{OUT}/narration.wav', f'{OUT}/narration_before_reading_fix.wav')
for c in tl['chapters']:
    for l in c['lines']:
        if '東日本大震災' not in l['text']: continue
        _, old = rd(l['wav'])
        new_p = l['wav'].replace('.wav', '_hgn.wav'); N.tts(l['text'], new_p)
        _, new = rd(new_p)
        kana = N._SYN.create_audio_query(l['text'].replace('東日本大震災', 'ひがしにほんだいしんさい'), N.STYLE).kana
        print(c['no'], 'old', len(old) / sr, 'new', len(new) / sr, kana[:40])
        if len(new) > len(old): raise SystemExit('新しい音声が長い：時間割の調整が必要')
        pad = np.zeros(len(old), np.int16); pad[:len(new)] = new
        s = int(round(l['start'] * sr)); seg = nar[s:s + len(old)]
        # 元の文の位置を確かめる（元の音声と narration.wav の一致）
        corr = np.corrcoef(seg.astype(float), old.astype(float))[0, 1]
        print('  match', round(corr, 3))
        if corr < 0.9: raise SystemExit('位置が合わない')
        nar[s:s + len(old)] = pad
with wave.open(f'{OUT}/narration.wav', 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(nar.tobytes())
print('patched')
