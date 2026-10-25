import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BostonItems, BostonTimeline, LowChance, Magazine1938, PurchaseRecord, RumorCloud, ToBoston} from '../components/NintokuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue11BostonCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 宝はアメリカに渡った？（素材はすべてこの場面だけで使う）
export const Clue11Boston = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Boston" label="第11の手がかり" title="宝はアメリカに渡った？">
			<Beat name="アメリカ・ボストン" captions={c} from={0} to={0}>
				<Photo id="boston" label="アメリカ・ボストン" />
			</Beat>
			<Beat name="BostonItems" captions={c} from={1} to={1}>
				<Visual label="美術館にある品々">
					<BostonItems />
				</Visual>
			</Beat>
			<Beat name="細い線で描かれた獣の鏡" captions={c} from={2} to={2}>
				<Photo id="mirror-1" label="細い線で描かれた獣の鏡" />
			</Beat>
			<Beat name="「伝・仁徳天皇陵出土品」" captions={c} from={3} to={3}>
				<Photo id="mfa-2" move="left" label="「伝・仁徳天皇陵出土品」" />
			</Beat>
			<Beat name="Magazine1938" captions={c} from={4} to={5}>
				<Visual label="1938年の雑誌">
					<Magazine1938 />
				</Visual>
			</Beat>
			<Beat name="RumorCloud" captions={c} from={6} to={7}>
				<Visual label="広まった噂">
					<RumorCloud />
				</Visual>
			</Beat>
			<Beat name="ToBoston" captions={c} from={8} to={9}>
				<Visual label="どうやって渡った？">
					<ToBoston />
				</Visual>
			</Beat>
			<Beat name="買ったのは、誰？" captions={c} from={10} to={10}>
				<Photo id="okakura" label="買ったのは、誰？" />
			</Beat>
			<Beat name="『茶の本』" captions={c} from={11} to={12}>
				<Photo id="book-of-tea" label="『茶の本』" />
			</Beat>
			<Beat name="ボストン美術館の日本美術" captions={c} from={13} to={14}>
				<Photo id="tenshin-en" label="ボストン美術館の日本美術" />
			</Beat>
			<Beat name="PurchaseRecord" captions={c} from={15} to={15}>
				<Visual label="記録に残っていたのは？">
					<PurchaseRecord />
				</Visual>
			</Beat>
			<Beat name="2010年、宮内庁の調査" captions={c} from={16} to={16}>
				<Photo id="mirror-2" label="2010年、宮内庁の調査" />
			</Beat>
			<Beat name="BostonTimeline" captions={c} from={17} to={18}>
				<Visual label="年代は、合うのか？">
					<BostonTimeline />
				</Visual>
			</Beat>
			<Beat name="LowChance" captions={c} from={19} to={19}>
				<Visual label="結果は？">
					<LowChance />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="本物の宝は、どこへ？" captions={c} from={23}>
				<Photo id="helmet-met" label="本物の宝は、どこへ？" />
			</Beat>
		</SceneFrame>
	);
};
