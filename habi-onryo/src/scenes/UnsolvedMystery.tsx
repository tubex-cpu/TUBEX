import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {BigYears, LegendGap, Relations} from '../components/OnryoArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="首は、どこに眠るのか" captions={c} from={0} to={2}>
				<Stage label="首は、どこに眠るのか" labelBottom>
					<ReliefMap view='honshu' zoom={1.1} focus={P.ogaki} pins={[{at: P.kyoto, name: '京都の祠', t: 6}, {at: P.ogaki, name: '大垣', t: 20}, {at: P.tsuka, name: '大手町', big: true, t: 34}, {at: P.iwai, name: '坂東 胴塚', t: 48, dy: -70}]} />
				</Stage>
			</Beat>
			<Beat name="道真は、本当に無実だったのか" captions={c} from={3} to={4}>
				<Stage label="道真は、本当に無実だったのか">
					<Relations nodes={[{id: 'm', x: 520, y: 600, name: '菅原道真', hot: true}, {id: 't', x: 1400, y: 600, name: '斉世親王'}]} edges={[{a: 'm', b: 't', label: '訴えは本当だったのか', red: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="血の経典は、あったのか" captions={c} from={5} to={6}>
				<Stage label="血の経典は、あったのか">
					<LegendGap from={1150} to={1200} marks={[{year: 1164, label: '崇徳上皇が\n亡くなる'}, {year: 1183, label: '血の経典の話', sub: '貴族の日記', story: true}]} gapLabel='実物を見た記録は？' />
				</Stage>
			</Beat>
			<Beat name="2026年の夏" captions={c} from={7} to={8}>
				<Stage label="2026年の夏">
					<BigYears value={1000} unit='年' caption='いまも感じ続ける怨霊' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="祟りとは、何なのか" captions={c} from={9}>
				<Photo id="yasaka-night" move="in" label="祟りとは、何なのか" />
			</Beat>
		</SceneFrame>
	);
};
