import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {IwatoStory} from '../components/TakachihoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3IwatoCaptions as c} from '../data/captions';

// 天岩戸は、高千穂にある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue3Iwato = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Iwato" label="第3の手がかり" title="天岩戸は、高千穂にある？">
			<Beat name="神話の中身" captions={c} from={0} to={0}>
				<Photo id="art-toshimasa" move="in" label="神話の中身" />
			</Beat>
			<Beat name="太陽の神が隠れる" captions={c} from={1} to={2}>
				<Stage label="太陽の神が隠れる">
					<IwatoStory phase='close' />
				</Stage>
			</Beat>
			<Beat name="榊に玉と鏡をかける（古語拾遺）" captions={c} from={3} to={4}>
				<Photo id="real-kogo-sakaki" move="in" label="榊に玉と鏡をかける（古語拾遺）" />
			</Beat>
			<Beat name="天宇受売命の舞" captions={c} from={5} to={6}>
				<Photo id="real-iwato-loc" move="in" label="天宇受売命の舞" />
			</Beat>
			<Beat name="光が戻った" captions={c} from={7} to={8}>
				<Stage label="光が戻った">
					<IwatoStory phase='open' />
				</Stage>
			</Beat>
			<Beat name="舞台は、どこ？" captions={c} from={9} to={9}>
				<Stage label="舞台は、どこ？">
					<Cards cards={[{head: '古事記・日本書紀', body: '高天原での\n出来事', tone: 'gold'}, {head: '高千穂', body: 'この場面には\n出てこない', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="各地の天岩戸" captions={c} from={10} to={10}>
				<Stage label="各地の天岩戸" labelBottom>
					<ReliefMap view='nihon' focus={P.erihara} zoom={1.08} pins={[{at: P.takachihoTown, name: '高千穂', big: true, t: 10}, {at: P.erihara, name: '恵利原の水穴', sub: '三重・志摩', t: 30}, {at: P.togakushi, name: '戸隠神社', sub: '長野', t: 50}]} />
				</Stage>
			</Beat>
			<Beat name="恵利原の水穴（三重・志摩）" captions={c} from={11} to={11}>
				<Photo id="real-erihara-cave" move="in" label="恵利原の水穴（三重・志摩）" />
			</Beat>
			<Beat name="最も南の天岩戸" captions={c} from={12} to={12}>
				<Photo id="kumaya-inner" move="in" label="最も南の天岩戸" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="どのようにまつられている？" captions={c} from={16}>
				<Photo id="tj-shizume" move="in" label="どのようにまつられている？" />
			</Beat>
		</SceneFrame>
	);
};
