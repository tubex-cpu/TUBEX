import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TakashimaWrecks, Wreck1} from '../components/GenkoArt4';
import {Figures, MapScene} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12WrecksCaptions as c} from '../data/captions';

// 海に沈んだ元の船は、見つからない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue12Wrecks = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Wrecks" label="第12の手がかり" title="海に沈んだ元の船は、見つからない？">
			<Beat name="伊万里湾の入り口、鷹島" captions={c} from={0} to={1}>
				<Photo id="takashima-bridge-1" move="right" label="伊万里湾の入り口、鷹島" />
			</Beat>
			<Beat name="1281年の夏、この島で" captions={c} from={2} to={2}>
				<Stage label="1281年の夏、この島で" labelBottom>
					<MapScene cam={{lon: 129.75, lat: 33.4, zoom: 4}} to={{lon: 129.75, lat: 33.43, zoom: 7}} pins={[{key: 'takashima', name: '鷹島', big: true}]} />
				</Stage>
			</Beat>
			<Beat name="砂の中から、銅の印" captions={c} from={3} to={5}>
				<Photo id="seal-mouko" move="in" label="砂の中から、銅の印" />
			</Beat>
			<Beat name="元の軍の持ち物" captions={c} from={6} to={6}>
				<Photo id="woodseal-mouko" move="in" label="元の軍の持ち物" />
			</Beat>
			<Beat name="1980年、海の底の調査" captions={c} from={7} to={8}>
				<Photo id="takashima-port" move="left" label="1980年、海の底の調査" />
			</Beat>
			<Beat name="およそ4000点" captions={c} from={9} to={10}>
				<Photo id="arrows-mouko" move="in" label="およそ4000点" />
			</Beat>
			<Beat name="2011年、大発見" captions={c} from={11} to={15}>
				<Stage label="2011年、大発見">
					<Wreck1 />
				</Stage>
			</Beat>
			<Beat name="海の中の遺跡が、初めて" captions={c} from={16} to={17}>
				<Stage label="海の中の遺跡が、初めて">
					<Figures figs={[{value: '2012', label: '年', small: '国の史跡に'}, {value: '38万', label: '平方メートル', small: '鷹島神崎遺跡', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="3隻目も" captions={c} from={18} to={20}>
				<Stage label="3隻目も">
					<TakashimaWrecks />
				</Stage>
			</Beat>
			<Beat name="泥の中こそ、保管庫" captions={c} from={21} to={22}>
				<Photo id="brick-mouko" move="in" label="泥の中こそ、保管庫" />
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="どうやって、見つける？" captions={c} from={26}>
				<Photo id="bow-mouko" move="in" label="どうやって、見つける？" />
			</Beat>
		</SceneFrame>
	);
};
