import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {GprScan, SwordOnWave, TwoKofun} from '../components/IzumoArt3';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15YuzuriCaptions as c} from '../data/captions';

// 出雲は、ヤマトに国を譲った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue15Yuzuri = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Yuzuri" label="第15の手がかり" title="出雲は、ヤマトに国を譲った？">
			<Beat name="出雲の海辺から" captions={c} from={0} to={2}>
				<Photo id="benten-1" move="in" label="出雲の海辺から" />
			</Beat>
			<Beat name="力の強い神" captions={c} from={3} to={3}>
				<Photo id="takemikazuchi-gakutei" move="in" label="力の強い神" />
			</Beat>
			<Beat name="稲佐の浜に、剣を" captions={c} from={4} to={4}>
				<Stage label="稲佐の浜に、剣を">
					<SwordOnWave />
				</Stage>
			</Beat>
			<Beat name="コトシロヌシは？" captions={c} from={5} to={5}>
				<Photo id="miho-shrine-1" move="in" label="コトシロヌシは？" />
			</Beat>
			<Beat name="タケミナカタは、どこまで？" captions={c} from={6} to={6}>
				<Stage label="タケミナカタは、どこまで？" labelBottom>
					<ReliefMap view='nihonkai' focus={[136.0, 35.6]} zoom={1.25} pins={[{at: P.taisha, name: '出雲', t: 6}, {at: P.suwa, name: '諏訪', big: true, t: 50}]} lines={[{pts: [P.taisha, P.suwa], t: 14, len: 60, arrow: true, color: '#ff9b7a'}]} />
				</Stage>
			</Beat>
			<Beat name="一つの条件" captions={c} from={7} to={9}>
				<Photo id="suwa-torii" move="in" label="一つの条件" />
			</Beat>
			<Beat name="本当にあった出来事？" captions={c} from={10} to={11}>
				<Photo id="kashima-romon" move="in" label="本当にあった出来事？" />
			</Beat>
			<Beat name="考古学では？" captions={c} from={12} to={13}>
				<Photo id="dainenji-sekkan" move="in" label="考古学では？" />
			</Beat>
			<Beat name="景初三年の鏡" captions={c} from={14} to={15}>
				<Photo id="kanbara-mirror" move="in" label="景初三年の鏡" />
			</Beat>
			<Beat name="6世紀、東と西に" captions={c} from={16} to={16}>
				<Stage label="6世紀、東と西に">
					<TwoKofun />
				</Stage>
			</Beat>
			<Beat name="東の山代二子塚古墳" captions={c} from={17} to={17}>
				<Photo id="futagozuka" move="in" label="東の山代二子塚古墳" />
			</Beat>
			<Beat name="西の今市大念寺古墳" captions={c} from={18} to={18}>
				<Photo id="dainenji-mound" move="in" label="西の今市大念寺古墳" />
			</Beat>
			<Beat name="掘らずに、中を探ると？" captions={c} from={19} to={21}>
				<Stage label="掘らずに、中を探ると？">
					<GprScan />
				</Stage>
			</Beat>
			<Beat name="東と西の有力者？" captions={c} from={22} to={23}>
				<Stage label="東と西の有力者？" labelBottom>
					<ReliefMap view='izumo' zoom={1.15} pins={[{at: P.yamashiro, name: '意宇', sub: '山代二子塚古墳', t: 10, big: true}, {at: P.daienji, name: '杵築', sub: '今市大念寺古墳', t: 30, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={24} to={26}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 24, 25, fps)} />
			</Beat>
			<Beat name="天にとどく宮殿は？" captions={c} from={27}>
				<Photo id="taisha-1999" move="in" label="天にとどく宮殿は？" />
			</Beat>
		</SceneFrame>
	);
};
