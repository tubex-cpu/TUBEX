import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {NightRaid, TyphoonStrike} from '../components/GenkoArt3';
import {MapScene, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10KamikazeCaptions as c} from '../data/captions';

// 2度目は、嵐だけで勝った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue10Kamikaze = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Kamikaze" label="第10の手がかり" title="2度目は、嵐だけで勝った？">
			<Beat name="博多湾の入り口" captions={c} from={0} to={1}>
				<Photo id="nokonoshima-view-w" move="left" label="博多湾の入り口" />
			</Beat>
			<Beat name="石の壁が、ずらりと" captions={c} from={2} to={3}>
				<Photo id="borui-iki-4" move="in" label="石の壁が、ずらりと" />
			</Beat>
			<Beat name="志賀島へ" captions={c} from={4} to={4}>
				<Photo id="shikanoshima-air" move="in" label="志賀島へ" />
			</Beat>
			<Beat name="夜のうちに？" captions={c} from={5} to={5}>
				<Stage label="夜のうちに？">
					<NightRaid />
				</Stage>
			</Beat>
			<Beat name="海の中道" captions={c} from={6} to={6}>
				<Photo id="shikanoshima-2" move="right" label="海の中道" />
			</Beat>
			<Beat name="敵の船に乗り込む" captions={c} from={7} to={7}>
				<Photo id="ekotoba-e16-w" move="scroll" label="敵の船に乗り込む" />
			</Beat>
			<Beat name="元軍は、どこへ？" captions={c} from={8} to={8}>
				<Stage label="元軍は、どこへ？" labelBottom>
					<MapScene cam={{lon: 129.9, lat: 33.6, zoom: 2.8}} routes={[{from: 'shika', via: ['iki'], to: 'takashima', at: 10}]} pins={[{key: 'shika', name: '志賀島', dx: 20, at: 5}, {key: 'iki', name: '壱岐', at: 30}, {key: 'takashima', name: '鷹島', at: 60, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="海の上で、2か月" captions={c} from={9} to={11}>
				<Stage label="海の上で、2か月">
					<TimeBar stops={[{label: '6月初め', sub: '博多湾に現れる'}, {label: '7月', sub: '病気・食料の不足'}, {label: '7月末', sub: '江南軍と合流', accent: true}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="鷹島に集まった大船団" captions={c} from={12} to={12}>
				<Stage label="鷹島に集まった大船団" labelBottom>
					<MapScene cam={{lon: 129.7, lat: 33.45, zoom: 5}} fleet={{key: 'takashima', n: 90, at: 10}} pins={[{key: 'takashima', name: '鷹島', big: true}, {key: 'hirado', name: '平戸', at: 40, dx: -150}]} />
				</Stage>
			</Beat>
			<Beat name="そして、7月30日の夜" captions={c} from={13} to={15}>
				<Stage label="そして、7月30日の夜">
					<TyphoonStrike />
				</Stage>
			</Beat>
			<Beat name="台風だった" captions={c} from={16} to={16}>
				<Photo id="typhoon-nanmadol" move="in" label="台風だった" />
			</Beat>
			<Beat name="2度目の神風は、本当に" captions={c} from={17} to={17}>
				<Photo id="imari-bay-w" move="left" label="2度目の神風は、本当に" />
			</Beat>
			<Beat name="もし、石の壁がなかったら？" captions={c} from={18} to={20}>
				<Stage label="もし、石の壁がなかったら？">
					<TimeBar stops={[{label: '6月初め', sub: 'もし上陸できていたら'}, {label: '8月下旬', sub: '台風の季節', accent: true}]} tone='night' note='石の壁と夜襲が、上陸を阻んだ' />
				</Stage>
			</Beat>
			<Beat name="とどめになった台風" captions={c} from={21} to={22}>
				<Photo id="borui-mukaihama-w" move="right" label="とどめになった台風" />
			</Beat>
			<Beat name="判決" captions={c} from={23} to={25}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 23, 24, fps)} />
			</Beat>
			<Beat name="海に残された元軍は？" captions={c} from={26}>
				<Photo id="takashima-1" move="out" label="海に残された元軍は？" />
			</Beat>
		</SceneFrame>
	);
};
