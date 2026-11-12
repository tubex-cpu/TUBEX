import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue20HogenCaptions as c} from '../data/captions';

// 崇徳上皇は、自ら兵を挙げて、保元の乱を起こした？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue20Hogen = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue20Hogen" label="第20の手がかり" title="崇徳上皇は、自ら兵を挙げて、保元の乱を起こした？">
			<Beat name="1156年7月" captions={c} from={0} to={1}>
				<Stage label="1156年7月">
					<TimeBar stops={[{label: '7月2日', sub: '鳥羽法皇が亡くなる'}, {label: '7月8日', sub: '頼長の屋敷を没収'}, {label: '7月9日', sub: '白河北殿へ'}, {label: '7月11日', sub: '夜明け前', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="後白河天皇の側は" captions={c} from={2} to={4}>
				<Photo id="go-shirakawa" move="in" label="後白河天皇の側は" />
			</Beat>
			<Beat name="敵と味方に" captions={c} from={5} to={7}>
				<Stage label="敵と味方に">
					<Relations heads={[{x: 520, text: '崇徳上皇の側', red: true}, {x: 1400, text: '後白河天皇の側'}]} nodes={[{id: 's', x: 520, y: 440, name: '崇徳上皇', hot: true}, {id: 'y', x: 520, y: 560, name: '藤原頼長'}, {id: 'ta', x: 520, y: 680, name: '源為義'}, {id: 'tm', x: 520, y: 820, name: '平忠正'}, {id: 'g', x: 1400, y: 440, name: '後白河天皇'}, {id: 'yo', x: 1400, y: 680, name: '源義朝'}, {id: 'k', x: 1400, y: 820, name: '平清盛'}]} edges={[{a: 'ta', b: 'yo', label: '父と子', red: true, at: 60}, {a: 'tm', b: 'k', label: '叔父と甥', red: true, at: 80}]} />
				</Stage>
			</Beat>
			<Beat name="先に動いたのは" captions={c} from={8} to={8}>
				<Photo id="hogen-heiji-screen-2" move="in" label="先に動いたのは" />
			</Beat>
			<Beat name="数時間で決着" captions={c} from={9} to={10}>
				<Photo id="hogen-screen-detail" move="in" label="数時間で決着" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="都を追われた上皇" captions={c} from={14}>
				<Photo id="sutoku-yoshitoshi-exile" move="in" label="都を追われた上皇" />
			</Beat>
		</SceneFrame>
	);
};
