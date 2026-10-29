# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_video.py habi-<題材>
# 仁徳天皇陵：HabiNintokuVideo.tsx と Root.tsx を作る（場面の並びは build-voice.py の IDS）
import re, sys
root = sys.argv[1]
src = open(f'{root}/scripts/build-voice.py').read()
ids = eval(src[src.index('IDS = ') + 6:src.index(']', src.index('IDS = ')) + 1])
titles = [l[5:] for l in open(f'{root}/scripts/script.txt').read().splitlines() if l.startswith('0:00 ')]
assert len(ids) == len(titles)
mid = ids.index('Clue6Nintoku'); late = ids.index('Clue12Treasure')
imp = '\n'.join(f"import {{{i}}} from './scenes/{i}';" for i in sorted(ids))
seq = []
for k, (i, t) in enumerate(zip(ids, titles)):
    if k: seq.append('\t\t\t\t<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: T})} />')
    seq.append(f'\t\t\t\t<TransitionSeries.Sequence name="{t}" durationInFrames={{d.{i}}} premountFor={{fps}}>\n\t\t\t\t\t<{i} />\n\t\t\t\t</TransitionSeries.Sequence>')
first = ' + '.join(f'd.{i}' for i in ids[:mid]) + f' - {mid} * T'
second = ' + '.join(f'd.{i}' for i in ids[mid:late]) + f' - {late - mid} * T'
video = f"""import {{Audio}} from '@remotion/media';
import {{linearTiming, TransitionSeries}} from '@remotion/transitions';
import {{fade}} from '@remotion/transitions/fade';
import {{interpolate, staticFile, useVideoConfig}} from 'remotion';
import {{sceneDurations as d, TRANSITION_FRAMES as T}} from './data/timeline';
{imp}

const BGM_VOLUME = 0.11;

// BGMの区間：前半（冒頭〜第5の手がかり）、中盤（第6〜第11の手がかり）、後半（第12の手がかり〜締め）
const midStart = {first};
const lateStart = midStart + {second};

// 区間の頭と終わりを2秒でフェード
const fadeVolume = (length: number, fps: number) => (f: number) =>
	BGM_VOLUME * interpolate(f, [0, 2 * fps, length - 2 * fps, length], [0, 1, 1, 0], {{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}});

// ハビ判事：仁徳天皇陵判決（本編）
// シーンの長さは scripts/build-voice.py がナレーション音声から計算する
export const HabiNintokuVideo = () => {{
	const {{fps, durationInFrames}} = useVideoConfig();
	return (
		<>
			<TransitionSeries>
{chr(10).join(seq)}
			</TransitionSeries>
			<Audio
				name="BGM 前半「百舌鳥の森」"
				src={{staticFile('bgm/bgm1-mozu.mp3')}}
				durationInFrames={{midStart + fps}}
				volume={{fadeVolume(midStart + fps, fps)}}
				premountFor={{fps}}
			/>
			<Audio
				name="BGM 中盤「調査」"
				src={{staticFile('bgm/bgm2-survey.mp3')}}
				from={{midStart - fps}}
				durationInFrames={{lateStart - midStart + 2 * fps}}
				volume={{fadeVolume(lateStart - midStart + 2 * fps, fps)}}
				premountFor={{fps}}
			/>
			<Audio
				name="BGM 後半「浮かび上がる形」"
				src={{staticFile('bgm/bgm3-relief.mp3')}}
				from={{lateStart - fps}}
				durationInFrames={{durationInFrames - lateStart + fps}}
				volume={{fadeVolume(durationInFrames - lateStart + fps, fps)}}
				premountFor={{fps}}
			/>
		</>
	);
}};
"""
open(f'{root}/src/HabiNintokuVideo.tsx', 'w').write(video)
comps = '\n'.join(f'\t\t\t\t<Composition id="{i}" component={{{i}}} durationInFrames={{d.{i}}} fps={{30}} width={{1920}} height={{1080}} />' for i in ids)
rootfile = f"""import {{AbsoluteFill, Composition, Folder}} from 'remotion';
import {{HabiNintokuVideo}} from './HabiNintokuVideo';
import {{sceneDurations as d, TOTAL_FRAMES}} from './data/timeline';
import {{VerdictStamp}} from './components/VerdictStamp';
{imp}

// 投稿用の720p版（1920×1080の画面をそのまま縮小）
const HabiNintoku720 = () => (
	<AbsoluteFill style={{{{width: 1920, height: 1080, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}}}>
		<HabiNintokuVideo />
	</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {{
	return (
		<>
			<Composition id="HabiNintoku" component={{HabiNintokuVideo}} durationInFrames={{TOTAL_FRAMES}} fps={{30}} width={{1920}} height={{1080}} />
			<Composition id="HabiNintoku720" component={{HabiNintoku720}} durationInFrames={{TOTAL_FRAMES}} fps={{30}} width={{1280}} height={{720}} />
			<Folder name="Scenes">
{comps}
			</Folder>
			<Folder name="Elements">
				<Composition
					id="VerdictStamp"
					component={{VerdictStamp}}
					durationInFrames={{90}}
					fps={{30}}
					width={{1920}}
					height={{1080}}
					defaultProps={{{{verdict: 'half', size: 380}}}}
				/>
			</Folder>
		</>
	);
}};
"""
open(f'{root}/src/Root.tsx', 'w').write(rootfile)
print('ok', len(ids))
