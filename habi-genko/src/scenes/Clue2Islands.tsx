import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures, MapScene} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2IslandsCaptions as c} from '../data/captions';

// 最初に襲われたのは博多だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue2Islands = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Islands" label="第2の手がかり" title="最初に襲われたのは博多だった？">
			<Beat name="900隻が向かった先は？" captions={c} from={0} to={1}>
				<Stage label="900隻が向かった先は？" labelBottom>
					<MapScene cam={{lon: 129.2, lat: 34.6, zoom: 2.2}} to={{lon: 129.3, lat: 34.5, zoom: 2.6}} routes={[{from: 'gappo', to: 'tsushima'}]} fleet={{key: 'tsushima', n: 40, at: 60}} pins={[{key: 'gappo', name: '合浦', dx: -150}, {key: 'tsushima', name: '対馬', at: 70, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="寄せ集めの大軍" captions={c} from={2} to={2}>
				<Photo id="mongol-chainmail" move="in" label="寄せ集めの大軍" />
			</Beat>
			<Beat name="博多ではなかった？" captions={c} from={3} to={4}>
				<Photo id="izuhara" move="right" label="博多ではなかった？" />
			</Beat>
			<Beat name="10月5日、小茂田浜" captions={c} from={5} to={5}>
				<Photo id="komoda-1" move="in" label="10月5日、小茂田浜" />
			</Beat>
			<Beat name="わずかな兵で？" captions={c} from={6} to={7}>
				<Stage label="わずかな兵で？">
					<Figures figs={[{value: '80', label: '騎ほど', small: '宗資国の手勢'}, {value: '数千', label: 'の大軍', accent: true}]} mid='対' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="小茂田浜神社" captions={c} from={8} to={8}>
				<Photo id="komoda-2" move="out" label="小茂田浜神社" />
			</Beat>
			<Beat name="島を守った人" captions={c} from={9} to={9}>
				<Photo id="komoda-statue" move="in" label="島を守った人" />
			</Beat>
			<Beat name="次に襲われたのは？" captions={c} from={10} to={10}>
				<Stage label="次に襲われたのは？" labelBottom>
					<MapScene cam={{lon: 129.5, lat: 34.1, zoom: 2.4}} routes={[{from: 'tsushima', to: 'iki'}]} pins={[{key: 'tsushima', name: '対馬', dx: -130}, {key: 'iki', name: '壱岐', at: 60, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="唐人原" captions={c} from={11} to={11}>
				<Photo id="iki-tojinbaru" move="right" label="唐人原" />
			</Beat>
			<Beat name="城が落ちる前に" captions={c} from={12} to={13}>
				<Photo id="iki-kagetaka" move="in" label="城が落ちる前に" />
			</Beat>
			<Beat name="亡くなった人々の塚" captions={c} from={14} to={14}>
				<Photo id="iki-senninzuka" move="out" label="亡くなった人々の塚" />
			</Beat>
			<Beat name="島が、戦場になった" captions={c} from={15} to={16}>
				<Photo id="iki-koraibashi" move="left" label="島が、戦場になった" />
			</Beat>
			<Beat name="10月20日、ついに" captions={c} from={17} to={17}>
				<Stage label="10月20日、ついに" labelBottom>
					<MapScene cam={{lon: 130.0, lat: 33.8, zoom: 2.6}} routes={[{from: 'iki', to: 'hakata'}]} fleet={{key: 'hakata', n: 50, at: 50}} pins={[{key: 'iki', name: '壱岐', dx: -130}, {key: 'hakata', name: '博多湾', at: 50, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="博多の武士は、どう戦った？" captions={c} from={21}>
				<Photo id="hakata-bay-1" move="out" label="博多の武士は、どう戦った？" />
			</Beat>
		</SceneFrame>
	);
};
