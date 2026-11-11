import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="2026年12月22日、冬至" captions={c} from={0} to={0}>
				<Photo id="naiku-night-sando" move="in" label="2026年12月22日、冬至" />
			</Beat>
			<Beat name="朝7時半ごろ" captions={c} from={1} to={1}>
				<Photo id="naiku-ujibashi-backlit" move="in" label="朝7時半ごろ" />
			</Beat>
			<Beat name="夜明け前から" captions={c} from={2} to={2}>
				<Photo id="naiku-torii-mist" move="in" label="夜明け前から" />
			</Beat>
			<Beat name="太陽の神と、八咫鏡" captions={c} from={3} to={3}>
				<Photo id="naiku-gomon" move="in" label="太陽の神と、八咫鏡" />
			</Beat>
			<Beat name="天皇でさえ見られない？" captions={c} from={4} to={4}>
				<Photo id="mirror-hirabaru" move="in" label="天皇でさえ見られない？" />
			</Beat>
			<Beat name="草薙剣に残る記録" captions={c} from={5} to={5}>
				<Photo id="takeru-gekko" move="in" label="草薙剣に残る記録" />
			</Beat>
			<Beat name="壇ノ浦に沈んだ剣" captions={c} from={6} to={6}>
				<Photo id="genpei-byobu-w" move="scroll" label="壇ノ浦に沈んだ剣" />
			</Beat>
			<Beat name="20年に一度の大事業" captions={c} from={7} to={7}>
				<Photo id="hinoki-akasawa" move="in" label="20年に一度の大事業" />
			</Beat>
			<Beat name="1300年前の記録" captions={c} from={8} to={8}>
				<Photo id="shoki-tanaka-w" move="scroll" label="1300年前の記録" />
			</Beat>
			<Beat name="三種の神器の本当の姿" captions={c} from={9}>
				<Photo id="futami-firstlight" move="out" label="三種の神器の本当の姿" />
			</Beat>
		</SceneFrame>
	);
};
