import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {CompareCards, GrammarBlocks, SovPie} from '../components/Illustrations';
import {Converge, Dice, LoneLanguage, OldBook, PersonSilhouette, SumerianStatue, Visual} from '../components/Scenery';
import {CourtWithText} from '../components/CourtImage';
import {SceneFrame} from '../components/SceneFrame';
import {GavelVerdict} from '../components/GavelVerdict';
import {clue2WordsCaptions as c} from '../data/captions';
import {clue2WordsMouth as mouth} from '../data/mouth';
import {colors, minchoFamily} from '../theme';

// 5:22 第2の手がかり 100年前の言葉
export const Clue2Words = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Words" mouth={mouth} expressions={{0: 'think', 11: 'stern', 17: 'doubt', 26: 'think'}} hideAvatar={[[9, 10], [23, 25]]} label="第2の手がかり" title="天皇の呼び名に“シュメール”？">
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
				<CourtWithText shot="court-think">
					<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 110, color: colors.goldSoft, lineHeight: 1.3}}>
						もしかしたら、
						<br />
						本当に……？
					</div>
				</CourtWithText>
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
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="偶然の一致" captions={c} from={26}>
				<Visual label="でも、言葉より確かな証拠がある">
					<Dice />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};
