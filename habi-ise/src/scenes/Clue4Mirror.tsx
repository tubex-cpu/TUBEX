import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {MirrorVessel} from '../components/IseArt';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4MirrorCaptions as c} from '../data/captions';

// 八咫鏡は、天皇でさえ見ることができない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Clue4Mirror = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Mirror" label="第4の手がかり" title="八咫鏡は、天皇でさえ見ることができない？">
			<Beat name="天岩戸で作られた鏡" captions={c} from={0} to={0}>
				<Photo id="iwato-toshimasa-w" move="scroll" label="天岩戸で作られた鏡" />
			</Beat>
			<Beat name="正殿の奥、何重もの器" captions={c} from={1} to={1}>
				<Photo id="gen-vessel" move="in" label="正殿の奥、何重もの器" />
			</Beat>
			<Beat name="鏡を納める器" captions={c} from={2} to={4}>
				<Stage label="鏡を納める器">
					<MirrorVessel />
				</Stage>
			</Beat>
			<Beat name="内裏の火事" captions={c} from={5} to={5}>
				<Photo id="gen-palace-fire" move="in" label="内裏の火事" />
			</Beat>
			<Beat name="形代の鏡がたどった歴史" captions={c} from={6} to={6}>
				<Stage label="形代の鏡がたどった歴史">
					<TimeBar stops={[{label: '960年', sub: '内裏の火事'}, {label: '1005年', sub: '内裏の火事'}, {label: '1040年', sub: '鏡が\n粒のように', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="天皇でさえ？" captions={c} from={7} to={8}>
				<Photo id="mirror-large" move="in" label="天皇でさえ？" />
			</Beat>
			<Beat name="確かめる方法はない" captions={c} from={9} to={9}>
				<Photo id="meiji-kami-w" move="scroll" label="確かめる方法はない" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="ある噂" captions={c} from={13}>
				<Photo id="mirror-239" move="in" label="ある噂" />
			</Beat>
		</SceneFrame>
	);
};
