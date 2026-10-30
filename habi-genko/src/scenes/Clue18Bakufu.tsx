import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {NoNewLand} from '../components/GenkoArt4';
import {Cards, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18BakufuCaptions as c} from '../data/captions';

// 元に勝った幕府は、強くなった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue18Bakufu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Bakufu" label="第18の手がかり" title="元に勝った幕府は、強くなった？">
			<Beat name="ほうびの土地は？" captions={c} from={0} to={4}>
				<Stage label="ほうびの土地は？">
					<NoNewLand />
				</Stage>
			</Beat>
			<Beat name="季長、鎌倉へ" captions={c} from={5} to={7}>
				<Photo id="ekotoba-amanawa-w" move="scroll" label="季長、鎌倉へ" />
			</Beat>
			<Beat name="安達泰盛に、直訴" captions={c} from={8} to={10}>
				<Photo id="ekotoba-uma-w" move="right" label="安達泰盛に、直訴" />
			</Beat>
			<Beat name="絵巻に込めた思い" captions={c} from={11} to={12}>
				<Photo id="ekotoba-borui-w" move="scroll" label="絵巻に込めた思い" />
			</Beat>
			<Beat name="恩人は、どうなった？" captions={c} from={13} to={15}>
				<Stage label="恩人は、どうなった？">
					<TimeBar stops={[{label: '1284年', sub: '北条時宗が亡くなる'}, {label: '1285年', sub: '霜月騒動\n安達泰盛が滅ぶ', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="幕府の手は？" captions={c} from={16} to={17}>
				<Stage label="幕府の手は？">
					<TimeBar stops={[{label: '1297年', sub: '永仁の徳政令'}]} tone='ink' note='御家人の苦しさは、救えなかった' />
				</Stage>
			</Beat>
			<Beat name="元は、あきらめた？" captions={c} from={18} to={19}>
				<Stage label="元は、あきらめた？">
					<Cards cards={[{head: '3度目の計画', body: '船や食料を\n集めていた', tone: 'red'}, {head: 'けれども', body: 'ベトナムの戦いを\n優先して中止', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="終わらない守りの負担" captions={c} from={20} to={21}>
				<Photo id="iki-suketoki" move="in" label="終わらない守りの負担" />
			</Beat>
			<Beat name="そして、幕府は" captions={c} from={22} to={23}>
				<Stage label="そして、幕府は">
					<TimeBar stops={[{label: '1274年', sub: '文永の役'}, {label: '1281年', sub: '弘安の役'}, {label: '1333年', sub: '鎌倉幕府が滅ぶ', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={24} to={26}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 24, 25, fps)} />
			</Beat>
			<Beat name="神風という言葉は、どこから？" captions={c} from={27}>
				<Photo id="hakozaki-romon-1" move="in" label="神風という言葉は、どこから？" />
			</Beat>
		</SceneFrame>
	);
};
