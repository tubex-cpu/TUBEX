import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Table} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4BunmeiCaptions as c} from '../data/captions';

// 縄文時代は、文明と呼べる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue4Bunmei = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Bunmei" label="第4の手がかり" title="縄文時代は、文明と呼べる？">
			<Beat name="縄文文明という言葉" captions={c} from={0} to={0}>
				<Stage label="縄文文明という言葉">
					<Cards cards={[{head: '梅原猛', body: '哲学者'}, {head: '安田喜憲', body: '環境考古学者'}]} tone='ink' size={50} height={300} top={380} />
				</Stage>
			</Beat>
			<Beat name="1995年 縄文文明の発見" captions={c} from={1} to={1}>
				<Photo id="c04-goshono-earthroof" move="in" label="1995年 縄文文明の発見" />
			</Beat>
			<Beat name="学問の世界では" captions={c} from={2} to={2}>
				<Photo id="c04-ofune-frame" move="left" label="学問の世界では" />
			</Beat>
			<Beat name="文明の条件" captions={c} from={3} to={3}>
				<Stage label="文明の条件">
					<Table head={['', '文明', '縄文時代']} rows={[['都市', 'ある', 'ない'], ['国家', 'ある', 'ない'], ['文字', 'ある', 'ない']]} hot={2} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="1万年の高度な暮らし" captions={c} from={4} to={4}>
				<Photo id="c04-venus" move="in" label="1万年の高度な暮らし" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="暮らしを支えたのは" captions={c} from={8}>
				<Photo id="c05-acorns" move="in" label="暮らしを支えたのは" />
			</Beat>
		</SceneFrame>
	);
};
