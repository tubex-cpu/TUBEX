import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="なぜ、捨てられた？" captions={c} from={0} to={1}>
				<Photo id="sunset-1" move="in" label="なぜ、捨てられた？" />
			</Beat>
			<Beat name="決め手は、ない" captions={c} from={2} to={3}>
				<Stage label="決め手は、ない">
					<Cards cards={[{head: 'ひとつの説', body: 'スペインの征服で\n王家の支配が\n崩れた', tone: 'dark'}, {head: 'もうひとつの説', body: 'ヨーロッパから\n来た病気が\n広がった', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="誰が、何のために？" captions={c} from={4} to={6}>
				<Stage label="誰が、何のために？" labelBottom>
					<ReliefMap view='machupicchu' focus={P.machu} zoom={1.35} pins={[{at: P.machu, name: 'マチュピチュ遺跡', big: true, t: 10}, {at: P.mandor, name: 'マンドール', sub: '道はどこへ？', t: 40, dy: -90}]} />
				</Stage>
			</Beat>
			<Beat name="どうやって未来に残す？" captions={c} from={7} to={9}>
				<Stage label="どうやって未来に残す？">
					<Figures figs={[{value: '5600', label: '人', small: '多い時期の1日の上限'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="2025年9月" captions={c} from={10} to={11}>
				<Photo id="crowds" move="in" label="2025年9月" />
			</Beat>
			<Beat name="どう守り、どう伝える？" captions={c} from={12}>
				<Photo id="condor-1" move="in" label="どう守り、どう伝える？" />
			</Beat>
		</SceneFrame>
	);
};
