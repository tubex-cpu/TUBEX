import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {Center, CountUp, PuzzleFragments, ScoreMeter} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue4AICaptions as c} from '../data/captions';
import {colors, gothicFamily} from '../theme';

const Column = ({title, items, color}: {readonly title: string; readonly items: string[]; readonly color: string}) => (
	<div style={{width: 760, boxSizing: 'border-box', flexShrink: 0, padding: 50, borderRadius: 24, background: 'rgba(244,236,220,0.07)', borderTop: `12px solid ${color}`}}>
		<div style={{fontFamily: gothicFamily, fontWeight: 900, fontSize: 64, color}}>{title}</div>
		{items.map((t) => (
			<div key={t} style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 42, color: colors.text, marginTop: 24}}>・{t}</div>
		))}
	</div>
);

// 12:23 第4の手がかり 最新AI
export const Clue4AI = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第4の手がかり" title="最新AI" tint="#1b2a4a">
			<Beat name="AIが暴いた" captions={c} from={0} to={1}>
				<BigText size={130} color={colors.goldSoft} sub="ネットで広まる話">「AIが解読した」</BigText>
			</Beat>
			<Beat name="かけらのパズル" captions={c} from={2} to={4}>
				<Center>
					<PuzzleFragments />
				</Center>
			</Beat>
			<Beat name="2万点" captions={c} from={5} to={5}>
				<CountUp to={20000} suffix="点超" caption="粘土板のかけらをデータベース化" />
			</Beat>
			<Beat name="ギルガメシュ" captions={c} from={6} to={6}>
				<BigText size={130} color={colors.gold} sub="AIが新しいかけらを発見">ギルガメシュ叙事詩</BigText>
			</Beat>
			<Beat name="よみがえった歌" captions={c} from={7} to={9}>
				<BigText size={120} color="#f6c9a0" sub="春のバビロン――川が牧場をうるおし、麦が芽吹く">1000年ぶりによみがえった歌</BigText>
			</Beat>
			<Beat name="30〜40年" captions={c} from={10} to={11}>
				<BigText size={130} sub="AIがなければ、復元にかかったはずの年月">30〜40年分</BigText>
			</Beat>
			<Beat name="日本とのつながり" captions={c} from={12} to={15}>
				<Center>
					<Column title="AIが見つけたもの" items={['粘土板と粘土板のつながり', 'メソポタミアの中の話']} color={colors.gold} />
					<Column title="出てこないもの" items={['日本の話', 'アジアの話']} color={colors.wrong} />
				</Center>
			</Beat>
			<Beat name="通知表" captions={c} from={16} to={18}>
				<ScoreMeter />
			</Beat>
			<Beat name="得意と苦手" captions={c} from={19} to={21}>
				<Center>
					<Column title="得意" items={['役所の書類', '王をたたえる文章']} color={colors.reed} />
					<Column title="苦手" items={['神話', '詩', '粘土板の写真を直接読む']} color={colors.correct} />
				</Center>
			</Beat>
			<Beat name="現在地" captions={c} from={22} to={22}>
				<BigText size={120} color={colors.goldSoft} sub="AIの本当の現在地">「探す」「つなぐ」 ＞ 「読む」</BigText>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={26}>
				<VerdictStamp verdict="wrong" from={captionFrame(c, 23, 24, fps)} premountFor={fps} />
			</Beat>
			<Beat name="空白は埋まらない" captions={c} from={27} to={29}>
				<BigText size={90} sub="残された方法は、ひとつだけ">岩・言葉・模様・AI――空白は埋まらなかった</BigText>
			</Beat>
			<Beat name="血だ" captions={c} from={30}>
				<BigText size={260} color={colors.correct}>血だ。</BigText>
			</Beat>
		</SceneFrame>
	);
};
