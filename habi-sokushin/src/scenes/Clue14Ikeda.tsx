import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14IkedaCaptions as c} from '../data/captions';

// 同じ時代の人々は、鉄門海の即身仏をあがめた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue14Ikeda = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Ikeda" label="第14の手がかり" title="同じ時代の人々は、鉄門海の即身仏をあがめた？">
			<Beat name="1832年夏 開帳" captions={c} from={0} to={1}>
				<Photo id="ekoin-1842-w" move="scroll" label="1832年夏 開帳" />
			</Beat>
			<Beat name="庄内藩士・池田玄斎の記録" captions={c} from={2} to={3}>
				<Photo id="tada-kaicho" move="in" label="庄内藩士・池田玄斎の記録" />
			</Beat>
			<Beat name="藩士が書いたひと言" captions={c} from={4} to={5}>
				<Stage label="藩士が書いたひと言">
					<Scroll text={'掘り出して\n開帳せるは\n鐵門が本意には\nあらじ'} source='池田玄斎『弘采録』' tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="鉄門海の文書" captions={c} from={6} to={6}>
				<Stage label="鉄門海の文書">
					<Cards cards={[{head: '亀鏡志', body: '1960年の調査で\n座布団の下から'}, {head: '2016年', body: '鶴岡市郷土資料館で\n改めて見つかる', tone: 'gold'}]} tone='ink' size={44} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="生前にあがめられた行者" captions={c} from={7} to={8}>
				<Photo id="dewa-kuyoto-yokohama" move="in" label="生前にあがめられた行者" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="体に加えられた手" captions={c} from={12}>
				<Photo id="nangakuji" move="in" label="体に加えられた手" />
			</Beat>
		</SceneFrame>
	);
};
