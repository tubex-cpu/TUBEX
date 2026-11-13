import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3GoshintaiCaptions as c} from '../data/captions';

// 湯殿山の御神体は、語ってはいけない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue3Goshintai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Goshintai" label="第3の手がかり" title="湯殿山の御神体は、語ってはいけない？">
			<Beat name="本殿も拝殿もない" captions={c} from={0} to={1}>
				<Photo id="yudono-torii-2005" move="in" label="本殿も拝殿もない" />
			</Beat>
			<Beat name="古くからの習わし" captions={c} from={2} to={4}>
				<Stage label="古くからの習わし">
					<Scroll text={'語るなかれ\n聞くなかれ'} source='湯殿山の習わし' tone='moss' />
				</Stage>
			</Beat>
			<Beat name="1689年 松尾芭蕉" captions={c} from={5} to={5}>
				<Photo id="basho-sanpu" move="in" label="1689年 松尾芭蕉" />
			</Beat>
			<Beat name="芭蕉の一句" captions={c} from={6} to={7}>
				<Stage label="芭蕉の一句">
					<Scroll text={'語られぬ\n湯殿にぬらす\n袂かな'} source='松尾芭蕉『奥の細道』' />
				</Stage>
			</Beat>
			<Beat name="御神体は撮影禁止" captions={c} from={8} to={8}>
				<Photo id="buson-hosomichi-princeton" move="scroll" label="御神体は撮影禁止" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="なぜ空海の教えを？" captions={c} from={12}>
				<Photo id="kukai-patriarch" move="in" label="なぜ空海の教えを？" />
			</Beat>
		</SceneFrame>
	);
};
