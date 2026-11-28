"""エンドカードの読み上げ（台本「## エンドカード」）を完成版に足す。
narration.py は「## エンドカード」を読まないため、音声と1行字幕をあとから重ねる（映像は字幕の部分だけ再エンコード）。
使い方: python endcard_voice.py <入力mp4> <出力mp4>"""
import json, os, subprocess, sys, wave
sys.path.insert(0, '/home/user/TUBEX/pilots/moshimo-neko-meow/video')
os.environ.setdefault('NEKO_VER', 'v5')
import narration as N
import compose as C
OUT = os.environ.get('NEKO_OUT', '/home/user/work_neko/out_nankai')
TEXT = '見てみたい「もしも」があったら、コメントで教えてください。'
src, dst = sys.argv[1], sys.argv[2]
tl = json.load(open(f'{OUT}/timeline.json'))
ec = [c for c in tl['chapters'] if c['title'] == 'エンドカード'][0]
wav = f'{OUT}/endcard.wav'
dur = N.tts(TEXT, wav)
t0 = ec['start'] + 0.6
t1 = t0 + dur
assert t1 < ec['end'] + 3, (t1, ec)
subs = C.split_sub(TEXT, t0, t1)
inputs, filt, last = [], [], '0:v'
for i, (a, b, txt) in enumerate(subs):
    p = f'{OUT}/endcard_sub{i}.png'; C.sub_layer(txt).save(p); inputs += ['-i', p]
    filt.append(f'[{last}][{i+2}:v]overlay=x=(W-w)/2:y=H-135-h/2:enable=\'between(t,{a:.3f},{b:.3f})\'[v{i}]'); last = f'v{i}'
ms = int(t0 * 1000)
# 完成版の音は mix_raw.wav を loudnorm したもの。ナレーションと同じ大きさにするため、同じ倍率をかける
import numpy as np
def rms(f):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(a, dtype=np.float32); return float(np.sqrt(np.mean(x ** 2)))
gain = rms(f'{OUT}/mix.wav') / rms(f'{OUT}/mix_raw.wav') if os.path.exists(f'{OUT}/mix_raw.wav') else 1.0
print('gain', round(gain, 3))
filt.append(f'[1:a]adelay={ms}|{ms},volume={gain:.4f}[na];[0:a][na]amix=inputs=2:duration=first:normalize=0[a]')
cmd = ['ffmpeg', '-v', 'error', '-y', '-i', src, '-i', wav] + inputs + ['-filter_complex', ';'.join(filt), '-map', f'[{last}]', '-map', '[a]',
       '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst]
subprocess.run(cmd, check=True)
print('endcard voice', round(t0, 2), round(t1, 2), subs)
