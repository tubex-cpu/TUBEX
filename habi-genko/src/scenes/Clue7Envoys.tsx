import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {EnvoyBoat} from '../components/GenkoArt3';
import {Cards, MapScene} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7EnvoysCaptions as c} from '../data/captions';

// 幕府は、元の使いを斬った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue7Envoys = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Envoys" label="第7の手がかり" title="幕府は、元の使いを斬った？">
			<Beat name="また、使いが来た" captions={c} from={0} to={1}>
				<Stage label="また、使いが来た">
					<EnvoyBoat />
				</Stage>
			</Beat>
			<Beat name="鎌倉、龍ノ口" captions={c} from={2} to={3}>
				<Photo id="ryukoji-gate" move="in" label="鎌倉、龍ノ口" />
			</Beat>
			<Beat name="使いの命を奪う意味は？" captions={c} from={4} to={6}>
				<Stage label="使いの命を奪う意味は？">
					<Cards cards={[{head: '幕府の答え', body: '話し合いには\n応じない', tone: 'red'}]} tone='ink' size={60} />
				</Stage>
			</Beat>
			<Beat name="処刑場の跡に、寺" captions={c} from={7} to={7}>
				<Photo id="ryukoji-hondo" move="out" label="処刑場の跡に、寺" />
			</Beat>
			<Beat name="元使塚" captions={c} from={8} to={8}>
				<Photo id="genshizuka" move="in" label="元使塚" />
			</Beat>
			<Beat name="故郷に帰ることなく" captions={c} from={9} to={9}>
				<Photo id="joryuji-hondo" move="left" label="故郷に帰ることなく" />
			</Beat>
			<Beat name="1279年、ふたたび" captions={c} from={10} to={11}>
				<Photo id="joryuji-gate" move="in" label="1279年、ふたたび" />
			</Beat>
			<Beat name="南宋が、元のものに" captions={c} from={12} to={14}>
				<Stage label="南宋が、元のものに" labelBottom>
					<MapScene cam={{lon: 120.5, lat: 30.5, zoom: 1.1}} shade={{lon: 118.5, lat: 29.5, r: 200, label: '南宋', at: 10}} pins={[{key: 'keigen', name: '慶元', at: 40}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="次の戦いに備えて" captions={c} from={18}>
				<Photo id="borui-imazu-1" move="out" label="次の戦いに備えて" />
			</Beat>
		</SceneFrame>
	);
};
