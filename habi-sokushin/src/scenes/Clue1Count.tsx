import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1CountCaptions as c} from '../data/captions';

// 即身仏は、日本に十数体しかない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue1Count = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Count" label="第1の手がかり" title="即身仏は、日本に十数体しかない？">
			<Beat name="全国で16〜18体" captions={c} from={0} to={2}>
				<Stage label="全国で16〜18体" labelBottom>
					<ReliefMap view='japan' zoom={1.04} pins={[{at: P.tsuruoka, name: '庄内', sub: '6体', big: true, t: 6, dy: 90}, {at: P.yonezawa, name: '置賜', sub: '2体', t: 24, dy: 70}, {at: P.murakami, name: '新潟', sub: '4体', t: 40, dx: -80}, {at: P.asakawa, name: '福島', t: 56}, {at: P.sakuragawa, name: '茨城', t: 66}, {at: P.anan, name: '長野', t: 76}, {at: P.sojiji, name: '神奈川', t: 86, dy: 60}]} />
				</Stage>
			</Beat>
			<Beat name="資料によって違う数" captions={c} from={3} to={3}>
				<Stage label="資料によって違う数">
					<Cards cards={[{head: '山形大学 岩鼻通明氏', body: '全国 18体'}, {head: '新潟県観光協会', body: '全国 17体'}, {head: '数え方で', body: '16〜18体', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="拝観はできるが、撮影は" captions={c} from={4} to={4}>
				<Photo id="kaikoji-sokushindo" move="in" label="拝観はできるが、撮影は" />
			</Beat>
			<Beat name="文化財に指定できない？" captions={c} from={5} to={5}>
				<Photo id="kaikoji-hondo" move="in" label="文化財に指定できない？" />
			</Beat>
			<Beat name="2022年の調査" captions={c} from={6} to={6}>
				<Stage label="2022年の調査">
					<Figures figs={[{value: '64体', label: '日本に保管されている人のミイラ'}, {value: '15体', label: 'そのうちの即身仏', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="守っているのは" captions={c} from={7} to={7}>
				<Photo id="chido-sakai-garden" move="in" label="守っているのは" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="なぜ山形に多いのか" captions={c} from={11}>
				<Photo id="gassan-tsuruoka" move="in" label="なぜ山形に多いのか" />
			</Beat>
		</SceneFrame>
	);
};
