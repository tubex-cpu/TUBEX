import {Beat} from '../components/Beat';
import {BigText} from '../components/BigText';
import {Center, ClayTablet, Label, PetroglyphRock, TwoLands} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 0:00 謎の先出し
export const Intro = () => (
	<SceneFrame captions={c}>
		<Beat name="5000年前" captions={c} from={0} to={0}>
			<BigText size={200} color={colors.gold}>5000年前</BigText>
		</Beat>
		<Beat name="粘土板" captions={c} from={1} to={2}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<ClayTablet width={500} />
					<Label>人類最古の文字のひとつ</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="謎の民族" captions={c} from={3} to={4}>
			<BigText size={110} sub="突然現れ、気づけば消えている">どこから来て、どこへ行ったのか</BigText>
		</Beat>
		<Beat name="シュメール人" captions={c} from={5} to={5}>
			<BigText size={220} color={colors.gold}>シュメール人</BigText>
		</Beat>
		<Beat name="ふたつの土地" captions={c} from={6} to={8}>
			<TwoLands />
		</Beat>
		<Beat name="説の提示" captions={c} from={9} to={9}>
			<BigText size={120} color={colors.goldSoft}>「日本人は、シュメール人の子孫だ」</BigText>
		</Beat>
		<Beat name="岩の予告" captions={c} from={10} to={10}>
			<Center>
				<PetroglyphRock highlight />
			</Center>
		</Beat>
		<Beat name="問いかけ" captions={c} from={11}>
			<BigText size={110} sub="あなたの体に、謎の民族の血が？">本当なら……</BigText>
		</Beat>
	</SceneFrame>
);
