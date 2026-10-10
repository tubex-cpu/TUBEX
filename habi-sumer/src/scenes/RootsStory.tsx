import {Beat} from '../components/Beat';
import {BigText} from '../components/BigText';
import {JapanGunma, TwoStreams} from '../components/Illustrations';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 20:51 足元にあった物語
export const RootsStory = () => (
	<SceneFrame captions={c} label="調査の先に" title="足元にあった物語" tint="#2d2a1a">
		<Beat name="手がかりは途切れた" captions={c} from={0} to={2}>
			<BigText size={110} sub="5つの手がかりは、すべて途切れた">日本人は、シュメール人の子孫ではなかった</BigText>
		</Beat>
		<Beat name="別の物語" captions={c} from={3} to={5}>
			<BigText size={120} color={colors.goldSoft} sub="舞台は、日本の群馬の山あい">まったく別の物語</BigText>
		</Beat>
		<Beat name="群馬の縄文女性" captions={c} from={6} to={10}>
			<JapanGunma />
		</Beat>
		<Beat name="ふたつの流れ" captions={c} from={11} to={12}>
			<TwoStreams />
		</Beat>
		<Beat name="自分は何者か" captions={c} from={13} to={14}>
			<BigText size={120} sub="特別な存在であってほしい――その気持ちは誰にでもある">自分は何者なのか</BigText>
		</Beat>
		<Beat name="生き延びた証" captions={c} from={15}>
			<BigText size={110} color={colors.goldSoft} sub="選ばれた証ではなく、生き延びてきた証">本当の物語は、もっと足元にあった</BigText>
		</Beat>
	</SceneFrame>
);
