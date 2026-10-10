import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {BigText} from '../components/BigText';
import {CompareCards, GrammarBlocks, NameTags, SovPie} from '../components/Illustrations';
import {Habi} from '../components/Habi';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue2WordsCaptions as c} from '../data/captions';
import {colors, minchoFamily} from '../theme';

const Word = ({children, color}: {readonly children: string; readonly color: string}) => (
	<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 140, color}}>{children}</div>
);

// 5:22 第2の手がかり 100年前の言葉
export const Clue2Words = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第2の手がかり" title="100年前の言葉">
			<Beat name="スメラミコト" captions={c} from={0} to={1}>
				<BigText size={190} color={colors.gold} sub="天皇を指す、古い日本語">スメラミコト</BigText>
			</Beat>
			<Beat name="スメラとシュメール" captions={c} from={2} to={4}>
				<CompareCards
					left={<Word color={colors.japan}>スメラ</Word>}
					right={<Word color={colors.sumer}>シュメール</Word>}
					leftLabel="日本語"
					rightLabel="古代メソポタミア"
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
				<BigText size={110} sub="親戚にあたる言葉が、ひとつも見つかっていない">世界でひとりぼっちの言葉</BigText>
			</Beat>
			<Beat name="シュメールとケンギル" captions={c} from={17} to={20}>
				<NameTags />
			</Beat>
			<Beat name="統べる" captions={c} from={21} to={22}>
				<BigText size={150} color={colors.goldSoft} sub="国を治める＝「統べる」が由来とするのが一般的">スメラ ＝ 統べる</BigText>
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<VerdictStamp verdict="half" from={captionFrame(c, 23, 24, fps)} premountFor={fps} />
			</Beat>
			<Beat name="偶然の一致" captions={c} from={26}>
				<BigText size={120}>言葉は、偶然似ることがある</BigText>
			</Beat>
		</SceneFrame>
	);
};
