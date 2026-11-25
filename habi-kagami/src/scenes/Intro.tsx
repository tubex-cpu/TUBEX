import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BigYears, Flow} from '../components/SokushinArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="1961年7月 新潟県村上市" captions={c} from={0} to={0}>
				<Photo id="murakami-castle" move="in" label="1961年7月 新潟県村上市" />
			</Beat>
			<Beat name="ひとつの墓が掘り起こされた" captions={c} from={1} to={1}>
				<Photo id="murakami-shioya" move="in" label="ひとつの墓が掘り起こされた" />
			</Beat>
			<Beat name="最後の即身仏" captions={c} from={2} to={3}>
				<Stage label="最後の即身仏">
					<BigYears value={58} unit='年' caption='土の中で眠っていた僧・仏海' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="即身仏とは" captions={c} from={4} to={4}>
				<Photo id="gassan-clouds" move="in" label="即身仏とは" />
			</Beat>
			<Beat name="伝えられてきた物語" captions={c} from={5} to={6}>
				<Stage label="伝えられてきた物語">
					<Flow steps={[{head: '土の中へ', body: '生きたまま\n石室に入る'}, {head: '鉦の音', body: '経を唱え\n鳴らし続ける'}, {head: '音が止まる', body: '人々が\n死を知る', hot: true}, {head: '3年後', body: '掘り出すと\n仏の姿に'}]} />
				</Stage>
			</Beat>
			<Beat name="棺の中から現れたのは？" captions={c} from={7} to={7}>
				<Photo id="kofun-chamber-tsuruga" move="in" label="棺の中から現れたのは？" />
			</Beat>
			<Beat name="本当に生きたまま土に入ったのか" captions={c} from={8} to={8}>
				<Photo id="haguro-cedar-snow-a" move="in" label="本当に生きたまま土に入ったのか" />
			</Beat>
			<Beat name="体の中の、小さな抜け殻" captions={c} from={9} to={10}>
				<Photo id="fly-puparium" move="in" label="体の中の、小さな抜け殻" />
			</Beat>
			<Beat name="江戸の武士が書き残した、ひと言" captions={c} from={11} to={11}>
				<Photo id="chido-goinden" move="in" label="江戸の武士が書き残した、ひと言" />
			</Beat>
			<Beat name="X線、CT、指紋" captions={c} from={12}>
				<Photo id="ct-schematic" move="in" label="X線、CT、指紋" />
			</Beat>
		</SceneFrame>
	);
};
