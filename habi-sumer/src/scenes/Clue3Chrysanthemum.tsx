import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Center, Chrysanthemum, CompareCards, GapTimeline, Label, Rosette} from '../components/Illustrations';
import {AiLink, Magnifier, PersonSilhouette, SumerianStatue, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue3ChrysanthemumCaptions as c} from '../data/captions';

// 9:22 第3の手がかり 菊の紋
export const Clue3Chrysanthemum = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第3の手がかり" title="菊の紋">
			<Beat name="菊の紋" captions={c} from={0} to={0}>
				<Center>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Chrysanthemum size={520} />
						<Label>16枚の花びらの菊</Label>
					</div>
				</Center>
			</Beat>
			<Beat name="同じ模様？" captions={c} from={1} to={2}>
				<Visual label="シュメールにも、同じ模様が？">
					<Magnifier>
						<Chrysanthemum size={460} />
					</Magnifier>
				</Visual>
			</Beat>
			<Beat name="ロゼット" captions={c} from={3} to={3}>
				<Center>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Rosette size={520} />
						<Label>ロゼット文様</Label>
					</div>
				</Center>
			</Beat>
			<Beat name="ウルの金の花" captions={c} from={4} to={5}>
				<Center>
					<Rosette size={300} petals={8} />
					<Rosette size={360} petals={12} />
					<Rosette size={300} petals={16} color="#e9d38a" />
				</Center>
				<div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center'}}>
					<Label>ウル王墓の金の花飾り／女神イナンナのしるし</Label>
				</div>
			</Beat>
			<Beat name="並べてみる" captions={c} from={6} to={7}>
				<CompareCards
					left={<Chrysanthemum size={430} />}
					right={<Rosette size={430} petals={16} />}
					leftLabel="皇室の菊"
					rightLabel="メソポタミアの花"
					vs="＝"
				/>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<VerdictStamp verdict="correct" from={captionFrame(c, 8, 9, fps)} premountFor={fps} />
			</Beat>
			<Beat name="模様と祖先" captions={c} from={11} to={12}>
				<CompareCards
					left={<PersonSilhouette size={380} />}
					right={<SumerianStatue size={380} />}
					leftLabel="模様が同じでも"
					rightLabel="祖先が同じとは限らない"
					vs="≠"
				/>
			</Beat>
			<Beat name="世界中の花" captions={c} from={13} to={14}>
				<Center>
					{['エジプト', 'ギリシャ', 'インド', 'メソポタミア'].map((n, i) => (
						<div key={n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<Rosette size={300} petals={8 + i * 2} />
							<Label size={40}>{n}</Label>
						</div>
					))}
				</Center>
			</Beat>
			<Beat name="3000年の空白" captions={c} from={15} to={18}>
				<GapTimeline />
			</Beat>
			<Beat name="AIの噂" captions={c} from={19}>
				<Visual label="「最新のAIが、つながりを見つけた」？">
					<AiLink />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
