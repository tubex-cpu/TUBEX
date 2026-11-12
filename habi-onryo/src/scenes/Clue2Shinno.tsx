import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Relations, Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2ShinnoCaptions as c} from '../data/captions';

// 将門は、神のお告げで「新皇」を名乗った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue2Shinno = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Shinno" label="第2の手がかり" title="将門は、神のお告げで「新皇」を名乗った？">
			<Beat name="乱からまもない記録" captions={c} from={0} to={1}>
				<Stage label="乱からまもない記録">
					<Scroll text={'上野の国府にて\n巫女、神がかりして\n八幡大菩薩の使いと名乗る\n朕の位を授け奉る'} source='『将門記』より（要約）' />
				</Stage>
			</Beat>
			<Beat name="巫女のお告げ" captions={c} from={2} to={3}>
				<Photo id="engi-miko" move="in" label="巫女のお告げ" />
			</Beat>
			<Beat name="左大臣正二位 菅原朝臣" captions={c} from={4} to={5}>
				<Photo id="michizane-pine" move="in" label="左大臣正二位 菅原朝臣" />
			</Beat>
			<Beat name="『将門記』が描く場面" captions={c} from={6} to={8}>
				<Stage label="『将門記』が描く場面">
					<Relations nodes={[{id: 'h', x: 480, y: 470, name: '八幡大菩薩', sub: '神'}, {id: 'm', x: 1440, y: 470, name: '菅原道真の霊', sub: '位を授ける書状', hot: true}, {id: 'k', x: 960, y: 760, name: '平将門', sub: '新皇'}]} edges={[{a: 'h', b: 'k', label: '天皇の位'}, {a: 'm', b: 'k', label: '位記', red: true}]} note='三大怨霊の2人が、ひとつの物語に' />
				</Stage>
			</Beat>
			<Beat name="本当にあった場面？" captions={c} from={9} to={10}>
				<Photo id="masakado-hidesato-kamahige" move="in" label="本当にあった場面？" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="誰が討ち取ったのか" captions={c} from={14}>
				<Photo id="hidesato-yoshitoshi" move="in" label="誰が討ち取ったのか" />
			</Beat>
		</SceneFrame>
	);
};
