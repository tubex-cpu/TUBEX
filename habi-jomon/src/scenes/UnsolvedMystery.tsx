import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" label="まだ解けていない謎" title="">
			<Beat name="残された謎" captions={c} from={0} to={0}>
				<Photo id="unsolved-sekibo-kitazawa" move="up" label="残された謎" />
			</Beat>
			<Beat name="土偶は、何のために" captions={c} from={1} to={1}>
				<Photo id="c04-masked-goddess" move="in" label="土偶は、何のために" />
			</Beat>
			<Beat name="なぜ、減り始めたのか" captions={c} from={2} to={2}>
				<Stage label="なぜ、減り始めたのか">
					<Cards cards={[{head: '寒さ？', body: '気候'}, {head: '病？', body: '流行り病'}, {head: '別の理由？', body: '？', tone: 'red'}]} tone='night' size={46} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="祖先は、どこから" captions={c} from={3} to={3}>
				<Photo id="unsolved-tools-moro" move="in" label="祖先は、どこから" />
			</Beat>
			<Beat name="2026年10月" captions={c} from={4} to={4}>
				<Stage label="2026年10月" labelBottom>
					<ReliefMap view='archipelago' zoom={1.35} focus={P.kanmuri} pins={[{at: P.kanmuri, name: '冠遺跡群', sub: '広島県廿日市市', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="さらに前へ" captions={c} from={5}>
				<Photo id="unsolved-tools-oimatsuyama" move="in" label="さらに前へ" />
			</Beat>
		</SceneFrame>
	);
};
