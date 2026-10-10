import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Center, PuzzleFragments, ScoreMeter, TwoLands} from '../components/Illustrations';
import {BloodDrop, ClueIcons, FragmentGrid, Hourglass, PhoneNews, Roadmap, SpringBabylon, StrengthWeak, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue4AICaptions as c} from '../data/captions';
import {colors} from '../theme';

// 12:23 第4の手がかり 最新AI
export const Clue4AI = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第4の手がかり" title="AIが暴いた日本との関係？" tint="#1b2a4a">
			<Beat name="AIが暴いた" captions={c} from={0} to={1}>
				<Center>
					<PhoneNews headlines={['AIが粘土板を解読!?', 'シュメールと日本の関係が判明!?', 'AIが暴いた古代の真実']} />
				</Center>
			</Beat>
			<Beat name="かけらのパズル" captions={c} from={2} to={4}>
				<Center>
					<PuzzleFragments />
				</Center>
			</Beat>
			<Beat name="2万点" captions={c} from={5} to={5}>
				<Visual label="2万点のかけら。完成図は、どこにもない">
					<FragmentGrid count />
				</Visual>
			</Beat>
			<Beat name="ギルガメシュ" captions={c} from={6} to={6}>
				<Visual label="AIが見つけ出したのは、人類最古の物語" labelColor={colors.gold}>
					<FragmentGrid found />
				</Visual>
			</Beat>
			<Beat name="よみがえった歌" captions={c} from={7} to={9}>
				<Visual label="1000年間消えていた歌が、よみがえった" labelColor="#f6c9a0">
					<SpringBabylon />
				</Visual>
			</Beat>
			<Beat name="30〜40年" captions={c} from={10} to={11}>
				<Visual label="人間だけなら、30年以上かかっていた">
					<Hourglass />
				</Visual>
			</Beat>
			<Beat name="日本とのつながり" captions={c} from={12} to={15}>
				<TwoLands broken />
			</Beat>
			<Beat name="通知表" captions={c} from={16} to={18}>
				<ScoreMeter />
			</Beat>
			<Beat name="得意と苦手" captions={c} from={19} to={21}>
				<Center>
					<StrengthWeak />
				</Center>
			</Beat>
			<Beat name="現在地" captions={c} from={22} to={22}>
				<Visual label="AIは、まだ「読めて」いない">
					<Roadmap />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={26}>
				<VerdictStamp verdict="wrong" from={captionFrame(c, 23, 24, fps)} premountFor={fps} />
			</Beat>
			<Beat name="空白は埋まらない" captions={c} from={27} to={29}>
				<ClueIcons count={4} />
			</Beat>
			<Beat name="血だ" captions={c} from={30}>
				<Center>
					<BloodDrop />
				</Center>
			</Beat>
		</SceneFrame>
	);
};
