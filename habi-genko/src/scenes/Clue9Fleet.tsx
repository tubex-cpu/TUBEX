import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures, MapScene, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9FleetCaptions as c} from '../data/captions';

// 2度目は、14万人の大軍だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue9Fleet = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Fleet" label="第9の手がかり" title="2度目は、14万人の大軍だった？">
			<Beat name="2つの軍" captions={c} from={0} to={1}>
				<Stage label="2つの軍" labelBottom>
					<MapScene cam={{lon: 126.5, lat: 32.5, zoom: 0.95}} routes={[{from: 'gappo', to: 'iki', at: 10}, {from: 'keigen', to: 'hirado', at: 40, color: '#ff8f80'}]} pins={[{key: 'gappo', name: '東路軍', dx: -190, at: 10}, {key: 'keigen', name: '江南軍', at: 40, color: '#ff8f80'}, {key: 'iki', name: '壱岐', at: 80}]} />
				</Stage>
			</Beat>
			<Beat name="あわせて、14万人？" captions={c} from={2} to={6}>
				<Stage label="あわせて、14万人？">
					<Figures figs={[{value: '4万人', label: '東路軍', small: '船 900隻'}, {value: '10万人', label: '江南軍', small: '船 3500隻', accent: true}]} note='元や高麗の側の記録の数字' />
				</Stage>
			</Beat>
			<Beat name="海を越える、最大級の攻撃" captions={c} from={7} to={7}>
				<Photo id="map-strait" move="in" label="海を越える、最大級の攻撃" />
			</Beat>
			<Beat name="出発は、そろった？" captions={c} from={8} to={9}>
				<Stage label="出発は、そろった？">
					<TimeBar stops={[{label: '5月3日', sub: '東路軍 出発'}, {label: '6月18日', sub: '江南軍 出発', accent: true}]} note='1か月半の遅れ' />
				</Stage>
			</Beat>
			<Beat name="本当に14万人？" captions={c} from={10} to={12}>
				<Stage label="本当に14万人？">
					<Cards cards={[{head: '記録の数字', body: '14万人\n4400隻', tone: 'gold'}, {head: 'コンランの見方', body: 'もっと\nずっと小さい？', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="海の底の証拠" captions={c} from={13} to={14}>
				<Photo id="anchor-mouko" move="in" label="海の底の証拠" />
			</Beat>
			<Beat name="空前の大軍" captions={c} from={15} to={15}>
				<Photo id="sword-mouko-w" move="left" label="空前の大軍" />
			</Beat>
			<Beat name="国を滅ぼされた兵たち" captions={c} from={16} to={17}>
				<Photo id="song-bowl" move="in" label="国を滅ぼされた兵たち" />
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="嵐だけで、敗れたのか？" captions={c} from={21}>
				<Photo id="shikanoshima-1" move="out" label="嵐だけで、敗れたのか？" />
			</Beat>
		</SceneFrame>
	);
};
