import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {CompareCards, GrammarBlocks, SovPie} from '../components/Illustrations';
import {Habi} from '../components/Habi';
import {Converge, Dice, LoneLanguage, OldBook, PersonSilhouette, SumerianStatue, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue2WordsCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 5:22 第2の手がかり 100年前の言葉
export const Clue2Words = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第2の手がかり" title="天皇の呼び名に“シュメール”？">
			<Beat name="スメラミコト" captions={c} from={0} to={1}>
				<Visual label="天皇の呼び名に、シュメールが隠れている？">
					<OldBook title="スメラミコト" />
				</Visual>
			</Beat>
			<Beat name="スメラとシュメール" captions={c} from={2} to={4}>
				<CompareCards
					left={<div style={{zoom: 0.6}}><OldBook title="スメラミコト" /></div>}
					right={<SumerianStatue size={380} />}
					leftLabel="スメラ（日本語）"
					rightLabel="シュメール"
					vs="≒？"
				/>
			</Beat>
			<Beat name="文法の比較" captions={c} from={5} to={8}>
				<GrammarBlocks />
			</Beat>
			<Beat name="ハビの迷い" captions={c} from={9} to={10}>
				<div style={{position: 'absolute', left: 300, top: 170}}>
					<Habi size={420} />
				</div>
				<BigText size={120} top="42%" color={colors.goldSoft}>
					<span style={{marginLeft: 500}}>もしかしたら……？</span>
				</BigText>
			</Beat>
			<Beat name="よくある似かた" captions={c} from={11} to={13}>
				<SovPie />
			</Beat>
			<Beat name="孤立した言語" captions={c} from={14} to={16}>
				<Visual label="世界中と比べても、親戚が見つからない言葉">
					<LoneLanguage />
				</Visual>
			</Beat>
			<Beat name="シュメールとケンギル" captions={c} from={17} to={20}>
				<CompareCards
					left={<PersonSilhouette size={380} color={colors.half} />}
					right={<SumerianStatue size={380} />}
					leftLabel="「シュメール」は、他人がつけたあだ名"
					rightLabel="本当の名は「ケンギル」"
					leftColor={colors.half}
					rightColor={colors.correct}
					vs="≠"
				/>
			</Beat>
			<Beat name="統べる" captions={c} from={21} to={22}>
				<Visual label="では「スメラ」の本当の意味は？">
					<Converge />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<VerdictStamp verdict="half" from={captionFrame(c, 23, 24, fps)} premountFor={fps} />
			</Beat>
			<Beat name="偶然の一致" captions={c} from={26}>
				<Visual label="でも、言葉より確かな証拠がある">
					<Dice />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
