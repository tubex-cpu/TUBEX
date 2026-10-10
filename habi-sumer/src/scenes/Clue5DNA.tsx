import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {HaploTree, ReedMarsh} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue5DNACaptions as c} from '../data/captions';
import {colors} from '../theme';

// 16:38 第5の手がかり 神の遺伝子
export const Clue5DNA = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第5の手がかり" title="神の遺伝子" tint="#2a1f3d">
			<Beat name="神の遺伝子" captions={c} from={0} to={2}>
				<BigText size={150} color={colors.goldSoft} sub="「選ばれた遺伝子」とも">「神の遺伝子」？</BigText>
			</Beat>
			<Beat name="Y染色体D" captions={c} from={3} to={4}>
				<BigText size={130} sub="父から息子へ、ほぼそのまま受け継がれる">Y染色体「D」</BigText>
			</Beat>
			<Beat name="YAP説" captions={c} from={5} to={7}>
				<BigText size={130} color={colors.japan} sub="「特別な血がシュメールにつながる」という説">YAP</BigText>
			</Beat>
			<Beat name="Dの家系図" captions={c} from={8} to={10}>
				<HaploTree emphasize="D" />
			</Beat>
			<Beat name="シュメールの側" captions={c} from={11} to={12}>
				<BigText size={120} sub="最も近い子孫と考えられる、イラク南部の湿地の人々">次に、シュメールの側</BigText>
			</Beat>
			<Beat name="葦の原" captions={c} from={13} to={15}>
				<ReedMarsh />
			</Beat>
			<Beat name="DとJ" captions={c} from={16} to={18}>
				<HaploTree emphasize="both" />
			</Beat>
			<Beat name="まだ読まれていない" captions={c} from={19} to={21}>
				<BigText size={110} sub="暑さで骨の中のDNAが壊れてしまう">シュメール人本人のDNAは、まだ読まれていない</BigText>
			</Beat>
			<Beat name="古代エジプト人" captions={c} from={22} to={23}>
				<BigText size={120} sub="約5分の1がメソポタミア方面とつながる（比べた相手はシュメールより古い北の人骨）">古代エジプト人の全ゲノム</BigText>
			</Beat>
			<Beat name="判決" captions={c} from={24} to={27}>
				<VerdictStamp verdict="wrong" from={captionFrame(c, 24, 25, fps)} premountFor={fps} />
			</Beat>
			<Beat name="珍しい≠優れている" captions={c} from={28}>
				<BigText size={130} color={colors.goldSoft} sub="遺伝子は、祖先の旅の記録">珍しい ≠ 優れている</BigText>
			</Beat>
		</SceneFrame>
	);
};
