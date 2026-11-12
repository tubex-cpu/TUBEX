"""日本三大怨霊判決：本編（src/HabiOnryoVideo.tsx）とコンポジション一覧（src/Root.tsx）を作る。
  python3 scripts/gen_video.py
場面の並びは scripts/build-voice.py の IDS、場面名は scripts/script.txt の見出し。"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ids = eval(re.search(r'IDS = (\[.*?\])', (ROOT / 'scripts/build-voice.py').read_text(), re.S).group(1))
heads = [l[5:] for l in (ROOT / 'scripts/script.txt').read_text().splitlines() if l.startswith('0:00 ')]
assert len(ids) == len(heads), (len(ids), len(heads))
MID, LATE = 'Clue11Kentoshi', 'Clue19Ojigo'

imp = '\n'.join(f"import {{{s}}} from './scenes/{s}';" for s in sorted(ids))
seq = []
for i, (s, h) in enumerate(zip(ids, heads)):
    if i:
        seq.append('\t\t\t\t<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />')
    seq.append(f'\t\t\t\t<TransitionSeries.Sequence name="{h}" durationInFrames={{d.{s}}} premountFor={{fps}}>\n\t\t\t\t\t<{s} />\n\t\t\t\t</TransitionSeries.Sequence>')
mi, li = ids.index(MID), ids.index(LATE)
mid = ' + '.join(f'd.{s}' for s in ids[:mi]) + f' - {mi} * T'
late = 'midStart + ' + ' + '.join(f'd.{s}' for s in ids[mi:li]) + f' - {li - mi} * T'
video = f"""import {{Audio}} from '@remotion/media';
import {{linearTiming, TransitionSeries}} from '@remotion/transitions';
import {{fade}} from '@remotion/transitions/fade';
import {{interpolate, staticFile, useVideoConfig}} from 'remotion';
import {{sceneDurations as d, TRANSITION_FRAMES as T}} from './data/timeline';
{imp}

const BGM_VOLUME = 0.12;

// BGMの区間：前半（冒頭〜第3の手がかり）、中盤（第4〜第7の手がかり）、後半（第8の手がかり〜締め）。scripts/gen_video.py が作る
export const midStart = {mid};
export const lateStart = {late};

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}});

// ハビ判事：日本三大怨霊判決（本編）。シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiOnryoVideo = () => {{
	const {{fps, durationInFrames}} = useVideoConfig();
	return (
		<>
			<TransitionSeries>
{chr(10).join(seq)}
			</TransitionSeries>
			<Audio name="BGM 前半「将門」" src={{staticFile('bgm/bgm1-masakado.mp3')}} durationInFrames={{midStart + fps}} volume={{fadeVolume(midStart + fps, fps)}} premountFor={{fps}} />
			<Audio name="BGM 中盤「天神」" src={{staticFile('bgm/bgm2-michizane.mp3')}} from={{midStart - fps}} durationInFrames={{lateStart - midStart + 2 * fps}} volume={{fadeVolume(lateStart - midStart + 2 * fps, fps)}} premountFor={{fps}} />
			<Audio name="BGM 後半「白峯」" src={{staticFile('bgm/bgm3-sutoku.mp3')}} from={{lateStart - fps}} durationInFrames={{durationInFrames - lateStart + fps}} volume={{fadeVolume(durationInFrames - lateStart + fps, fps)}} premountFor={{fps}} />
		</>
	);
}};
"""
(ROOT / 'src/HabiOnryoVideo.tsx').write_text(video)
comps = '\n'.join(f'\t\t\t<Composition id="{s}" component={{{s}}} durationInFrames={{d.{s}}} fps={{30}} width={{1920}} height={{1080}} />' for s in ids)
root = f"""import {{AbsoluteFill, Composition, Folder}} from 'remotion';
import {{HabiOnryoVideo}} from './HabiOnryoVideo';
import {{sceneDurations as d, TOTAL_FRAMES}} from './data/timeline';
{imp}
import {{Thumb1Tsuka, Thumb2Kami, Thumb3Kubi}} from './thumbnails/Thumbnails';

// 確認版用の720p（1920×1080の画面をそのまま縮小）
const HabiOnryo720 = () => (
	<AbsoluteFill style={{{{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}}}>
		<HabiOnryoVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="HabiOnryo" component={{HabiOnryoVideo}} durationInFrames={{TOTAL_FRAMES}} fps={{30}} width={{1920}} height={{1080}} />
		<Composition id="HabiOnryo720" component={{HabiOnryo720}} durationInFrames={{TOTAL_FRAMES}} fps={{30}} width={{1280}} height={{720}} />
		<Folder name="Scenes">
{comps}
		</Folder>
		<Folder name="Thumbnails">
			<Composition id="Thumb1Tsuka" component={{Thumb1Tsuka}} durationInFrames={{1}} fps={{30}} width={{1280}} height={{720}} />
			<Composition id="Thumb2Kami" component={{Thumb2Kami}} durationInFrames={{1}} fps={{30}} width={{1280}} height={{720}} />
			<Composition id="Thumb3Kubi" component={{Thumb3Kubi}} durationInFrames={{1}} fps={{30}} width={{1280}} height={{720}} />
		</Folder>
	</>
);
"""
(ROOT / 'src/Root.tsx').write_text(root)
print('ok', len(ids))
