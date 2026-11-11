import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7DannouraCaptions as c} from '../data/captions';

// 草薙剣は、壇ノ浦の海に永遠に沈んだ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue7Dannoura = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Dannoura" label="第7の手がかり" title="草薙剣は、壇ノ浦の海に永遠に沈んだ？">
			<Beat name="1185年3月" captions={c} from={0} to={0}>
				<Photo id="dannoura-sadahide-w" move="scroll" label="1185年3月" />
			</Beat>
			<Beat name="幼い安徳天皇" captions={c} from={1} to={1}>
				<Photo id="antoku-engi" move="in" label="幼い安徳天皇" />
			</Beat>
			<Beat name="剣だけが見つからない" captions={c} from={2} to={3}>
				<Photo id="antoku-portrait" move="in" label="剣だけが見つからない" />
			</Beat>
			<Beat name="沈んだのは、どの剣？" captions={c} from={4} to={5}>
				<Stage label="沈んだのは、どの剣？">
					<TimeBar stops={[{label: '668年', sub: '盗まれかける'}, {label: '686年', sub: '熱田へ'}, {label: '1185年', sub: '宮中の形代が\n沈む', accent: true}, {label: '1210年', sub: '新しい宝剣'}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="本体は熱田に" captions={c} from={6} to={6}>
				<Photo id="atsuta-square" move="in" label="本体は熱田に" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="見た人はいる？" captions={c} from={10}>
				<Photo id="atsuta-kusanagikan" move="in" label="見た人はいる？" />
			</Beat>
		</SceneFrame>
	);
};
