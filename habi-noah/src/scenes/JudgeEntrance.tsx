import {interpolate, useCurrentFrame} from 'remotion';
import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {ClayTablet} from '../components/Illustrations';
import {AraratMountain, BlackSeaFill, FloodLayerDig, ArkBuilding} from '../components/NoahArt';
import {ScaleBalance, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {judgeEntranceCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const clues = [
	{t: 'アララト山の船の形', el: <AraratMountain />},
	{t: '聖書より古い物語', el: <ClayTablet width={500} />},
	{t: '洪水の地層', el: <FloodLayerDig />},
	{t: '黒海大洪水', el: <BlackSeaFill />},
	{t: '全ての動物を乗せた船', el: <ArkBuilding />},
];

const ClueRow = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 100, right: 100, top: 230, display: 'flex', gap: 22, justifyContent: 'center'}}>
			{clues.map((cl, i) => (
				<div
					key={cl.t}
					style={{
						width: 320,
						padding: '22px 0',
						borderRadius: 18,
						background: colors.paper,
						textAlign: 'center',
						opacity: interpolate(frame, [i * 8, i * 8 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
					}}
				>
					<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 32, color: colors.clayDark}}>手がかり {i + 1}</div>
					<div style={{height: 170, margin: '10px 16px', background: colors.night, borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<div style={{zoom: 0.2}}>{cl.el}</div>
					</div>
					<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 34, color: colors.ink}}>{cl.t}</div>
				</div>
			))}
		</div>
	);
};

// ハビ判事登場
export const JudgeEntrance = () => (
	<SceneFrame captions={c} voice="JudgeEntrance" label="開廷" title="閉園後の法廷">
		<Beat name="ハビ判事" captions={c} from={0} to={1}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
				<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 52, color: colors.gold}}>閉園後の法廷</div>
				<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 170, color: colors.text, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>ハビ判事</div>
				<div style={{display: 'inline-block', marginTop: 10, fontFamily: gothicFamily, fontWeight: 900, fontSize: 56, color: colors.text, padding: '10px 40px', borderRadius: 14, background: 'rgba(5, 9, 18, 0.88)', border: `3px solid ${colors.gold}`}}>
					信じるのは、証拠だけ。
				</div>
			</div>
		</Beat>
		<Beat name="前回から" captions={c} from={2} to={3}>
			<Photo id="ur-ziggurat" label="シュメールの調査で、ずっと気になっていた物語">
				<Visual label="シュメールの調査で、ずっと気になっていた物語">
					<ClayTablet width={480} />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="今夜の問い" captions={c} from={4} to={5}>
			<Visual label="ノアの方舟は、本当にあったのか？">
				<ScaleBalance undecided />
			</Visual>
		</Beat>
		<Beat name="5つの手がかり" captions={c} from={6}>
			<ClueRow />
		</Beat>
	</SceneFrame>
);
