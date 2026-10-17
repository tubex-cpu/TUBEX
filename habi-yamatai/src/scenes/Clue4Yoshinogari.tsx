import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {CoffinInside, EraOverlap, MoatVillage, MysteryArea, SecondDitch, SquareDitch, StoneCoffin, VisitorCounter} from '../components/YamataiArt2';
import {clue4YoshinogariCaptions as c} from '../data/captions';

// 第4の手がかり 吉野ヶ里の「謎のエリア」（素材はすべてこの場面だけで使う）
export const Clue4Yoshinogari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Yoshinogari" label="第4の手がかり" title="吉野ヶ里の「謎のエリア」に眠るのは？">
			<Beat name="吉野ヶ里遺跡" captions={c} from={0} to={0}>
				<Photo id="yoshinogari-zenkei" move="right" label="佐賀県、吉野ヶ里遺跡" />
			</Beat>
			<Beat name="1989年" captions={c} from={1} to={2}>
				<Photo id="yoshinogari-kango" label="1989年、日本中が沸いた" />
			</Beat>
			<Beat name="堀に囲まれたムラ" captions={c} from={3} to={3}>
				<Visual label="二重の堀に囲まれたムラ">
					<MoatVillage />
				</Visual>
			</Beat>
			<Beat name="かめ棺" captions={c} from={4} to={4}>
				<Photo id="yoshinogari-kamekan" move="left" label="盛り土の墓に、王たちが？" />
			</Beat>
			<Beat name="平原の鏡" captions={c} from={5} to={5}>
				<Photo id="hirabaru-mirror" label="日本最大の銅の鏡" />
			</Beat>
			<Beat name="九州の王" captions={c} from={6} to={6}>
				<Photo id="hirabaru-tomb" move="out" label="鏡を大切にした王が、九州に" />
			</Beat>
			<Beat name="謎のエリア" captions={c} from={7} to={8}>
				<Visual label="長いあいだ、調べられなかった一角">
					<MysteryArea />
				</Visual>
			</Beat>
			<Beat name="石の棺" captions={c} from={9} to={11}>
				<Visual label="2023年、ふたが閉じたままの棺">
					<StoneCoffin />
				</Visual>
			</Beat>
			<Beat name="棺の中" captions={c} from={12} to={13}>
				<Visual label="棺の中にあったのは？">
					<CoffinInside />
				</Visual>
			</Beat>
			<Beat name="方形周溝墓" captions={c} from={14} to={15}>
				<Visual label="2026年2月20日、新たな発表">
					<SquareDitch />
				</Visual>
			</Beat>
			<Beat name="もうひとつの溝" captions={c} from={16} to={17}>
				<Visual label="四角い溝は、ひとつではなかった？">
					<SecondDitch />
				</Visual>
			</Beat>
			<Beat name="卑弥呼の時代" captions={c} from={18} to={18}>
				<Visual label="墓が並んだのは、いつ？">
					<EraOverlap />
				</Visual>
			</Beat>
			<Beat name="特別公開" captions={c} from={19} to={19}>
				<Visual label="特別公開に、人が押し寄せた">
					<VisitorCounter />
				</Visual>
			</Beat>
			<Beat name="まだ空っぽ" captions={c} from={20} to={21}>
				<Photo id="yoshinogari-park" move="left" label="誰が葬られたのか？" />
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="奈良へ" captions={c} from={25}>
				<Photo id="miwa-from-hashihaka" move="out" label="もうひとつの候補地、奈良は？" />
			</Beat>
		</SceneFrame>
	);
};
