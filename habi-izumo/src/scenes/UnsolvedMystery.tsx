import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="まだ解けていない謎" captions={c} from={0} to={0}>
				<Photo id="matsue-evening" move="in" label="まだ解けていない謎" />
			</Beat>
			<Beat name="バツの印の意味は？" captions={c} from={1} to={4}>
				<Stage label="バツの印の意味は？">
					<Cards cards={[{head: '作った人の印？', body: '鋳型を作り\n刻んだ人々', tone: 'dark'}, {head: '埋めた集団の印？', body: '分けて\n埋めた人々', tone: 'dark'}, {head: 'まじない？', body: '悪いものを\n封じこめる', tone: 'red'}]} tone='bronze' size={42} />
				</Stage>
			</Beat>
			<Beat name="本殿の、本当の姿は？" captions={c} from={5} to={7}>
				<Photo id="taisha-model-2" move="in" label="本殿の、本当の姿は？" />
			</Beat>
			<Beat name="なぜ、埋められた？" captions={c} from={8} to={10}>
				<Photo id="kamo-site-dotaku" move="in" label="なぜ、埋められた？" />
			</Beat>
			<Beat name="新しい発見があれば" captions={c} from={11}>
				<Photo id="hinomisaki-lighthouse" move="in" label="新しい発見があれば" />
			</Beat>
		</SceneFrame>
	);
};
