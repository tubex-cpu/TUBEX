import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {KaguraClock, KaguraNight} from '../components/TakachihoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1KaguraCaptions as c} from '../data/captions';

// 高千穂の夜神楽は、観光客のためのショー？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue1Kagura = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Kagura" label="第1の手がかり" title="高千穂の夜神楽は、観光客のためのショー？">
			<Beat name="11月から2月まで" captions={c} from={0} to={0}>
				<Photo id="gen-kagura-yado" move="in" label="11月から2月まで" />
			</Beat>
			<Beat name="集落の神楽宿で" captions={c} from={1} to={1}>
				<Photo id="yk-shiiba" move="in" label="集落の神楽宿で" />
			</Beat>
			<Beat name="夜を徹して、33番" captions={c} from={2} to={3}>
				<Stage label="夜を徹して、33番">
					<KaguraClock />
				</Stage>
			</Beat>
			<Beat name="1978年、国の文化財に" captions={c} from={4} to={4}>
				<Photo id="gen-kagura-dawn" move="in" label="1978年、国の文化財に" />
			</Beat>
			<Beat name="観光客のためのショー？" captions={c} from={5} to={5}>
				<Photo id="yk-tsunoyama" move="in" label="観光客のためのショー？" />
			</Beat>
			<Beat name="神々に、実りを感謝する" captions={c} from={6} to={7}>
				<Stage label="神々に、実りを感謝する">
					<KaguraNight />
				</Stage>
			</Beat>
			<Beat name="高千穂神社の神楽殿で、毎晩8時から" captions={c} from={8} to={8}>
				<Photo id="real-kagura-2023" move="in" label="高千穂神社の神楽殿で、毎晩8時から" />
			</Beat>
			<Beat name="旅行者が見られる4番" captions={c} from={9} to={9}>
				<Stage label="旅行者が見られる4番">
					<Cards cards={[{head: '1', body: '手力雄の舞'}, {head: '2', body: '鈿女の舞'}, {head: '3', body: '戸取の舞'}, {head: '4', body: '御神体の舞'}]} tone='ember' size={44} height={300} top={380} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="いつから続く？" captions={c} from={13}>
				<Photo id="yk-iwami-shrine" move="in" label="いつから続く？" />
			</Beat>
		</SceneFrame>
	);
};
