import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5DescentCaptions as c} from '../data/captions';

// 天孫降臨の地は、宮崎の高千穂？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue5Descent = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Descent" label="第5の手がかり" title="天孫降臨の地は、宮崎の高千穂？">
			<Beat name="天孫降臨" captions={c} from={0} to={0}>
				<Photo id="art-tenson" move="in" label="天孫降臨" />
			</Beat>
			<Beat name="記紀が記す場所" captions={c} from={1} to={1}>
				<Stage label="記紀が記す場所">
					<Cards cards={[{head: '古事記', body: '筑紫の日向の\n高千穂の\nくしふるたけ', tone: 'dark'}, {head: '日本書紀', body: '日向の襲の\n高千穂峯', tone: 'dark'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="日本書紀「日向の襲の高千穂峯」" captions={c} from={2} to={3}>
				<Photo id="real-shoki-descent" move="in" label="日本書紀「日向の襲の高千穂峯」" />
			</Beat>
			<Beat name="高千穂町のくしふる神社" captions={c} from={4} to={4}>
				<Photo id="real-kushifuru-torii" move="in" label="高千穂町のくしふる神社" />
			</Beat>
			<Beat name="稲穂をまいた伝え" captions={c} from={5} to={5}>
				<Photo id="gen-rice-seeds" move="in" label="稲穂をまいた伝え" />
			</Beat>
			<Beat name="もうひとつの高千穂" captions={c} from={6} to={6}>
				<Stage label="もうひとつの高千穂" labelBottom>
					<ReliefMap view='kyushu' zoom={1.08} pins={[{at: P.takachihoTown, name: '高千穂町', big: true, t: 10}, {at: P.takachihoPeak, name: '高千穂峰', sub: '霧島連山', big: true, t: 40}]} lines={[{pts: [P.takachihoTown, P.takachihoPeak], t: 60, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="標高およそ1574m" captions={c} from={7} to={7}>
				<Photo id="kiri-peak" move="in" label="標高およそ1574m" />
			</Beat>
			<Beat name="天の逆鉾" captions={c} from={8} to={8}>
				<Photo id="kiri-sakahoko" move="in" label="天の逆鉾" />
			</Beat>
			<Beat name="「襲」は大隅地方？" captions={c} from={9} to={9}>
				<Photo id="kiri-jingu" move="in" label="「襲」は大隅地方？" />
			</Beat>
			<Beat name="どちらが降臨の地？" captions={c} from={10} to={10}>
				<Photo id="kiri-unkai" move="in" label="どちらが降臨の地？" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="太陽が隠れた神話は？" captions={c} from={14}>
				<Photo id="art-uzume-hokkei" move="in" label="太陽が隠れた神話は？" />
			</Beat>
		</SceneFrame>
	);
};
