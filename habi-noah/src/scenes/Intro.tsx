import {Beat} from '../components/Beat';
import {AraratMountain, BoatFormation, DrillRig, FloodRain} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';
import {introMouth as mouth} from '../data/mouth';
import {colors} from '../theme';

// 謎の先出し
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro" mouth={mouth} expressions={{0: 'stern', 7: 'doubt'}}>
		<Beat name="ドリル" captions={c} from={0} to={0}>
			<Visual label="先月、トルコで何かが起きた" labelColor={colors.gold}>
				<DrillRig />
			</Visual>
		</Beat>
		<Beat name="アララト山" captions={c} from={1} to={1}>
			<Photo id="ararat" label="標高5137m、アララト山">
				<Visual label="トルコの東のはずれの雪山">
					<AraratMountain showBoat={false} />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="船の形" captions={c} from={2} to={2}>
			<Photo id="durupinar" label="山の斜面に、船の形が？">
				<Visual label="山の斜面に、船の形が？">
					<BoatFormation />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="掘削" captions={c} from={3} to={5}>
			<Visual label="地下4〜5mで、何かにぶつかった">
				<DrillRig />
			</Visual>
		</Beat>
		<Beat name="あの船" captions={c} from={6} to={7}>
			<Photo id="deluge-art" label="ここに眠るのは、あの船？">
				<Visual label="ここに眠るのは、あの船？">
					<FloodRain />
				</Visual>
			</Photo>
		</Beat>
		<Beat name="作り話ではない？" captions={c} from={8}>
			<Photo id="noah-art" move="out" label="聖書の物語は、本当だった？">
				<Visual label="聖書の物語は、本当だった？" labelColor={colors.goldSoft}>
					<AraratMountain />
				</Visual>
			</Photo>
		</Beat>
	</SceneFrame>
);
