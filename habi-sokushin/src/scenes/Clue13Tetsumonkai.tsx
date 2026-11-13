import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13TetsumonkaiCaptions as c} from '../data/captions';

// 鉄門海上人は、生きたまま土に入った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue13Tetsumonkai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Tetsumonkai" label="第13の手がかり" title="鉄門海上人は、生きたまま土に入った？">
			<Beat name="弟子が書き残した記録" captions={c} from={0} to={1}>
				<Photo id="sakata-port" move="in" label="弟子が書き残した記録" />
			</Beat>
			<Beat name="1829年 弟子・清海の記録帳" captions={c} from={2} to={3}>
				<Stage label="1829年 弟子・清海の記録帳">
					<TimeBar stops={[{label: '8月', sub: '山を下り海向寺へ'}, {label: '10月18日', sub: '病で床につく'}, {label: '10月25日', sub: '遺言書'}, {label: '12月8日', sub: '息を引き取る', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="亡くなる1か月半前の遺言書" captions={c} from={4} to={4}>
				<Photo id="sakata-sankyo" move="in" label="亡くなる1か月半前の遺言書" />
			</Beat>
			<Beat name="遺体は注連寺へ" captions={c} from={5} to={5}>
				<Photo id="sakata-mogami" move="in" label="遺体は注連寺へ" />
			</Beat>
			<Beat name="研究者の結論" captions={c} from={6} to={6}>
				<Stage label="研究者の結論">
					<Scroll text={'鉄門海は\n病死しており\n自ら即身仏に\nなったのではない'} source='岩手大学 中村安宏氏らの論文（要約）' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="どのようにして即身仏に？" captions={c} from={10}>
				<Photo id="ekoin-hiroshige" move="in" label="どのようにして即身仏に？" />
			</Beat>
		</SceneFrame>
	);
};
