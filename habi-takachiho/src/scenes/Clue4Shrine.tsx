import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4ShrineCaptions as c} from '../data/captions';

// 天岩戸神社の御神体は、洞窟そのもの？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue4Shrine = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Shrine" label="第4の手がかり" title="天岩戸神社の御神体は、洞窟そのもの？">
			<Beat name="岩戸川の谷" captions={c} from={0} to={0}>
				<Stage label="岩戸川の谷" labelBottom>
					<ReliefMap view='takachiho' zoom={1.1} pins={[{at: P.takachihoTown, name: '高千穂神社', t: 10}, {at: P.iwatoJinja, name: '天岩戸神社', big: true, t: 35}]} />
				</Stage>
			</Beat>
			<Beat name="本殿のない神社" captions={c} from={1} to={2}>
				<Photo id="iwato-west" move="in" label="本殿のない神社" />
			</Beat>
			<Beat name="神職さえ立ち入らない聖域" captions={c} from={3} to={4}>
				<Photo id="miya-cedar" move="in" label="神職さえ立ち入らない聖域" />
			</Beat>
			<Beat name="遥拝所から拝む" captions={c} from={5} to={5}>
				<Photo id="iwato-ogatama" move="in" label="遥拝所から拝む" />
			</Beat>
			<Beat name="最初に住んだ場所" captions={c} from={6} to={6}>
				<Photo id="miya-ridges" move="in" label="最初に住んだ場所" />
			</Beat>
			<Beat name="神々が集まった河原" captions={c} from={7} to={8}>
				<Photo id="yasu-cave" move="in" label="神々が集まった河原" />
			</Beat>
			<Beat name="願いを込めた石" captions={c} from={9} to={9}>
				<Photo id="yasu-stones" move="in" label="願いを込めた石" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="もうひとつの神話" captions={c} from={13}>
				<Photo id="kunimi-ninigi" move="in" label="もうひとつの神話" />
			</Beat>
		</SceneFrame>
	);
};
