import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19ShinkokuCaptions as c} from '../data/captions';

// 神風は、昔からの信仰だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue19Shinkoku = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Shinkoku" label="第19の手がかり" title="神風は、昔からの信仰だった？">
			<Beat name="ほうびを求めたのは？" captions={c} from={0} to={2}>
				<Stage label="ほうびを求めたのは？">
					<Cards cards={[{head: '武士', body: '戦った手柄に\nほうびを', tone: 'dark'}, {head: '寺や神社', body: '祈った手柄に\nほうびを', tone: 'gold'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="神に守られた国？" captions={c} from={3} to={4}>
				<Photo id="hakozaki-hoanden" move="in" label="神に守られた国？" />
			</Beat>
			<Beat name="敵国降伏" captions={c} from={5} to={5}>
				<Photo id="hakozaki-tekikoku" move="in" label="敵国降伏" />
			</Beat>
			<Beat name="亀山上皇の祈り" captions={c} from={6} to={6}>
				<Photo id="kameyama" move="in" label="亀山上皇の祈り" />
			</Beat>
			<Beat name="明治時代、ふたたび" captions={c} from={7} to={8}>
				<Photo id="kameyama-statue-1" move="in" label="明治時代、ふたたび" />
			</Beat>
			<Beat name="学校や歌で" captions={c} from={9} to={9}>
				<Photo id="genko-monument" move="in" label="学校や歌で" />
			</Beat>
			<Beat name="時代とともに、どう使われた？" captions={c} from={10} to={12}>
				<Stage label="時代とともに、どう使われた？">
					<TimeBar stops={[{label: '1281年', sub: '弘安の役'}, {label: '明治時代', sub: '元寇の物語が\n広く語られる'}, {label: '太平洋戦争', sub: '「神風」の名の\n部隊', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="神風の陰に" captions={c} from={13} to={14}>
				<Photo id="genko-museum-1-w" move="left" label="神風の陰に" />
			</Beat>
			<Beat name="石の壁を築いた人々" captions={c} from={15} to={16}>
				<Photo id="borui-jigyo" move="in" label="石の壁を築いた人々" />
			</Beat>
			<Beat name="判決" captions={c} from={17} to={19}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 17, 18, fps)} />
			</Beat>
		</SceneFrame>
	);
};
