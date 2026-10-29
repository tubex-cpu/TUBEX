import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {EnvoysAgain, LetterQuote, LetterRoute, SixYears, YuanTimeline} from '../components/GenkoArt2';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1LetterCaptions as c} from '../data/captions';

// 元は、いきなり攻めてきた？（素材はすべてこの場面だけで使う）
export const Clue1Letter = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Letter" label="第1の手がかり" title="元は、いきなり攻めてきた？">
			<Beat name="史上最大級の帝国" captions={c} from={0} to={0}>
				<Photo id="map-mongol-2-w" move="in" label="人類の歴史で、最大級の国" />
			</Beat>
			<Beat name="草原から" captions={c} from={1} to={1}>
				<Photo id="mongol-warrior" move="up" label="草原の遊牧民から" />
			</Beat>
			<Beat name="騎馬軍団" captions={c} from={2} to={2}>
				<Photo id="mongol-helmet-1" move="in" label="東は中国、西はヨーロッパへ" />
			</Beat>
			<Beat name="フビライ" captions={c} from={3} to={3}>
				<Photo id="kublai" move="in" label="孫、フビライ・ハン" />
			</Beat>
			<Beat name="元へ" captions={c} from={4} to={4}>
				<Stage label="モンゴル帝国から、元へ">
					<YuanTimeline />
				</Stage>
			</Beat>
			<Beat name="南宋" captions={c} from={5} to={5}>
				<Photo id="song-celadon-1" move="in" label="南の大国、南宋" />
			</Beat>
			<Beat name="高麗" captions={c} from={6} to={6}>
				<Photo id="goryeo-celadon-1" move="in" label="30年、攻められた高麗" />
			</Beat>
			<Beat name="手紙の道" captions={c} from={7} to={8}>
				<Stage label="海の向こうの、日本へ" labelBottom>
					<LetterRoute />
				</Stage>
			</Beat>
			<Beat name="国書" captions={c} from={9} to={11}>
				<Photo id="kublai-letter" move="in" label="海を越えて届いた、一通の手紙" />
			</Beat>
			<Beat name="最後の一文" captions={c} from={12} to={15}>
				<Stage label="最後の一文に、何が？">
					<LetterQuote />
				</Stage>
			</Beat>
			<Beat name="返事は" captions={c} from={16} to={17}>
				<Photo id="engakuji-shariden" move="right" label="返事を、出すか？" />
			</Beat>
			<Beat name="時宗" captions={c} from={18} to={18}>
				<Photo id="tokimune" move="in" label="10代の執権、北条時宗" />
			</Beat>
			<Beat name="何度も" captions={c} from={19} to={20}>
				<Stage label="何度も届く、使い">
					<EnvoysAgain />
				</Stage>
			</Beat>
			<Beat name="見張り" captions={c} from={21} to={22}>
				<Photo id="genkai-2" move="left" label="九州の海を、見張れ" />
			</Beat>
			<Beat name="日蓮" captions={c} from={23} to={25}>
				<Photo id="ryukoji-cave" move="in" label="外国が、攻めてくる？" />
			</Beat>
			<Beat name="6年" captions={c} from={26} to={26}>
				<Stage label="最初の手紙から、6年あまり">
					<SixYears />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={27} to={29}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 27, 28, fps)} />
			</Beat>
			<Beat name="最初に戦ったのは" captions={c} from={30}>
				<Photo id="tsushima-beach" move="out" label="最初に戦ったのは、どこ？" />
			</Beat>
		</SceneFrame>
	);
};
