import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {SoloVsGroup} from '../components/GenkoArt3';
import {Cards, MapScene, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3SamuraiCaptions as c} from '../data/captions';

// 鎌倉武士は一騎打ちで負けた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue3Samurai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Samurai" label="第3の手がかり" title="鎌倉武士は一騎打ちで負けた？">
			<Beat name="何月の戦いだった？" captions={c} from={0} to={0}>
				<Stage label="何月の戦いだった？">
					<TimeBar stops={[{label: '10月20日', sub: '文永11年（1274年）'}, {label: '11月下旬', sub: '今の暦では', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="元軍は、どこに上陸？" captions={c} from={1} to={1}>
				<Stage label="元軍は、どこに上陸？" labelBottom>
					<MapScene cam={{lon: 130.36, lat: 33.63, zoom: 5}} pins={[{key: 'momochi', name: '百道原', big: true}, {key: 'hakata', name: '博多', at: 30, dx: 20}]} fleet={{key: 'momochi', n: 30, at: 20}} />
				</Stage>
			</Beat>
			<Beat name="九州の御家人が駆けつけた" captions={c} from={2} to={2}>
				<Photo id="borui-momochi" move="in" label="九州の御家人が駆けつけた" />
			</Beat>
			<Beat name="赤坂、鳥飼、祖原" captions={c} from={3} to={3}>
				<Photo id="sohara-2" move="right" label="赤坂、鳥飼、祖原" />
			</Beat>
			<Beat name="よく語られる話" captions={c} from={4} to={5}>
				<Photo id="ekotoba-e8" move="in" label="よく語られる話" />
			</Beat>
			<Beat name="名乗りと一騎打ち？" captions={c} from={6} to={7}>
				<Stage label="名乗りと一騎打ち？">
					<SoloVsGroup />
				</Stage>
			</Beat>
			<Beat name="何度も見てきた場面" captions={c} from={8} to={8}>
				<Photo id="mohon-fukuda-3" move="left" label="何度も見てきた場面" />
			</Beat>
			<Beat name="その話の、出どころは？" captions={c} from={9} to={12}>
				<Stage label="その話の、出どころは？">
					<Cards cards={[{head: '八幡愚童訓', body: '八幡の神の\nありがたさを\n説くための本', tone: 'gold'}, {head: '研究者は', body: 'そのまま\n信じてよいか\n疑問', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="戦った本人が残した絵巻" captions={c} from={13} to={15}>
				<Photo id="ekotoba-hakozaki-w" move="scroll" label="戦った本人が残した絵巻" />
			</Beat>
			<Beat name="仲間と一緒に" captions={c} from={16} to={18}>
				<Photo id="ekotoba-e13" move="in" label="仲間と一緒に" />
			</Beat>
			<Beat name="元軍の武器" captions={c} from={19} to={20}>
				<Photo id="crossbow-mouko" move="in" label="元軍の武器" />
			</Beat>
			<Beat name="筥崎宮が焼かれるほどの戦い" captions={c} from={21} to={21}>
				<Photo id="hakozaki-hama-w" move="out" label="筥崎宮が焼かれるほどの戦い" />
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="見たことのない武器とは？" captions={c} from={25}>
				<Photo id="mohon-ndl-e6-w" move="left" label="見たことのない武器とは？" />
			</Beat>
		</SceneFrame>
	);
};
