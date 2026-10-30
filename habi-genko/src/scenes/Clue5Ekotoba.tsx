import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {PaperSeam, ThreeSoldiers} from '../components/GenkoArt3';
import {Cards} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5EkotobaCaptions as c} from '../data/captions';

// 教科書のあの絵は、見たままを描いた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue5Ekotoba = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Ekotoba" label="第5の手がかり" title="教科書のあの絵は、見たままを描いた？">
			<Beat name="教科書の、あの場面" captions={c} from={0} to={2}>
				<Stage label="教科書の、あの場面">
					<ThreeSoldiers />
				</Stage>
			</Beat>
			<Beat name="季長が描かせた絵巻" captions={c} from={3} to={4}>
				<Photo id="ekotoba-e19-w" move="scroll" label="季長が描かせた絵巻" />
			</Beat>
			<Beat name="ある疑い" captions={c} from={5} to={6}>
				<Photo id="ekotoba-e14-w" move="left" label="ある疑い" />
			</Beat>
			<Beat name="紙のつなぎ目を、調べる" captions={c} from={7} to={8}>
				<Photo id="ekotoba-e21" move="in" label="紙のつなぎ目を、調べる" />
			</Beat>
			<Beat name="おかしなこととは？" captions={c} from={9} to={12}>
				<Stage label="おかしなこととは？">
					<PaperSeam />
				</Stage>
			</Beat>
			<Beat name="何が、違う？" captions={c} from={13} to={14}>
				<Stage label="何が、違う？">
					<Cards cards={[{head: '3人の兵士', body: '装備が違う\n筆の運びも違う', tone: 'red'}, {head: 'ほかの元の兵士', body: '同じ絵巻の\n描き方', tone: 'dark'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="反論も" captions={c} from={15} to={15}>
				<Stage label="反論も">
					<Cards cards={[{head: '多くの研究者', body: '江戸時代に\n描き足された', tone: 'gold'}, {head: '服部英雄', body: '同じころに\n描かれた', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="700年の長い旅" captions={c} from={16} to={18}>
				<Photo id="sadahide-mouko-w" move="left" label="700年の長い旅" />
			</Beat>
			<Beat name="本当は、どんな場面？" captions={c} from={19} to={20}>
				<Photo id="ekotoba-kono-w" move="scroll" label="本当は、どんな場面？" />
			</Beat>
			<Beat name="てつはうは、作り話ではない" captions={c} from={21} to={23}>
				<Photo id="takashima-museum" move="in" label="てつはうは、作り話ではない" />
			</Beat>
			<Beat name="2021年、国宝に" captions={c} from={24} to={24}>
				<Photo id="ekotoba-e20" move="in" label="2021年、国宝に" />
			</Beat>
			<Beat name="判決" captions={c} from={25} to={27}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 25, 26, fps)} />
			</Beat>
			<Beat name="なぜ、一日で引き揚げた？" captions={c} from={28}>
				<Photo id="genkai-3" move="out" label="なぜ、一日で引き揚げた？" />
			</Beat>
		</SceneFrame>
	);
};
