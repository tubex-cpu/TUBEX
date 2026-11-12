import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {SoulTurn, Table} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue30GoryoCaptions as c} from '../data/captions';

// 怨霊は、神として祀れば守り神になる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue30Goryo = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue30Goryo" label="第30の手がかり" title="怨霊は、神として祀れば守り神になる？">
			<Beat name="いつ生まれたのか" captions={c} from={0} to={0}>
				<Photo id="sudo-jinja" move="in" label="いつ生まれたのか" />
			</Beat>
			<Beat name="785年 早良親王" captions={c} from={1} to={2}>
				<Stage label="785年 早良親王" labelBottom>
					<ReliefMap view='west' zoom={1.6} focus={P.awaji} pins={[{at: P.nagaoka, name: '長岡京', t: 6}, {at: P.awaji, name: '淡路島', big: true, t: 40}]} lines={[{pts: [P.nagaoka, P.awaji], t: 14, len: 40, arrow: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="次々に起きた不幸" captions={c} from={3} to={3}>
				<Photo id="sudo-nara" move="in" label="次々に起きた不幸" />
			</Beat>
			<Beat name="謝り続けた朝廷" captions={c} from={4} to={5}>
				<Stage label="謝り続けた朝廷">
					<TimeBar stops={[{label: '785年', sub: '早良親王が亡くなる'}, {label: '792年', sub: '祟りとされる', accent: true}, {label: '800年', sub: '崇道天皇の名'}, {label: '805年', sub: '怨霊に謝る'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="863年5月 神泉苑" captions={c} from={6} to={6}>
				<Photo id="shinsenen-pond" move="in" label="863年5月 神泉苑" />
			</Beat>
			<Beat name="6人の霊" captions={c} from={7} to={7}>
				<Stage label="6人の霊">
					<Table head={['863年 神泉苑の御霊会で祀られた霊']} widths={[1600]} rows={[['崇道天皇（早良親王）・伊予親王'], ['藤原夫人・観察使'], ['橘逸勢・文室宮田麻呂']]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="疫病を鎮める祭りへ" captions={c} from={8} to={8}>
				<Photo id="shinsenen-bridge" move="in" label="疫病を鎮める祭りへ" />
			</Beat>
			<Beat name="御霊信仰" captions={c} from={9} to={10}>
				<Stage label="御霊信仰">
					<SoulTurn />
				</Stage>
			</Beat>
			<Beat name="3人も、この流れの中で" captions={c} from={11} to={11}>
				<Photo id="kamigoryo-torii" move="in" label="3人も、この流れの中で" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="いまの日本に" captions={c} from={15}>
				<Photo id="gion-1905" move="in" label="いまの日本に" />
			</Beat>
		</SceneFrame>
	);
};
