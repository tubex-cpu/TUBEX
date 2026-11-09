import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {ClayCasing, KofunPlan, SwordParts, SwordScale} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3SwordCaptions as c} from '../data/captions';

// 巨大な剣は、戦いの武器だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue3Sword = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Sword" label="第3の手がかり" title="巨大な剣は、戦いの武器だった？">
			<Beat name="古墳から張り出した場所" captions={c} from={0} to={1}>
				<Stage label="古墳から張り出した場所">
					<KofunPlan />
				</Stage>
			</Beat>
			<Beat name="粘土の中から？" captions={c} from={2} to={3}>
				<Stage label="粘土の中から？">
					<ClayCasing />
				</Stage>
			</Beat>
			<Beat name="蛇のように、くねる刃" captions={c} from={4} to={5}>
				<Photo id="dakoken-1" move="right" label="蛇のように、くねる刃" />
			</Beat>
			<Beat name="2024年3月の発表" captions={c} from={6} to={6}>
				<Photo id="kashikoken-museum" move="in" label="2024年3月の発表" />
			</Beat>
			<Beat name="柄と鞘をつけると？" captions={c} from={7} to={8}>
				<Stage label="柄と鞘をつけると？">
					<SwordParts />
				</Stage>
			</Beat>
			<Beat name="振り回して戦える？" captions={c} from={9} to={11}>
				<Stage label="振り回して戦える？">
					<SwordScale withOld={false} />
				</Stage>
			</Beat>
			<Beat name="何のための剣？" captions={c} from={12} to={13}>
				<Photo id="chasuri-dakoken" move="in" label="何のための剣？" />
			</Beat>
			<Beat name="金属の工芸品の最高傑作？" captions={c} from={14} to={15}>
				<Photo id="inariyama-sword" move="in" label="金属の工芸品の最高傑作？" />
			</Beat>
			<Beat name="判決" captions={c} from={16} to={18}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 16, 17, fps)} />
			</Beat>
			<Beat name="どこで生まれた？" captions={c} from={19}>
				<Photo id="ebino-plateau" move="in" label="どこで生まれた？" />
			</Beat>
		</SceneFrame>
	);
};
