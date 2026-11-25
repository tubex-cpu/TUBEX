import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {LegendGap, Relations, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue26DochuCaptions as c} from '../data/captions';

// 土中入定と即身仏は、同じ信仰だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue26Dochu = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue26Dochu" label="第26の手がかり" title="土中入定と即身仏は、同じ信仰だった？">
			<Beat name="各地の入定塚" captions={c} from={0} to={1}>
				<Stage label="各地の入定塚" labelBottom>
					<ReliefMap view='japan' zoom={1.25} focus={P.shirataka} pins={[{at: P.shirataka, name: '白鷹町 光明海', sub: '1854年に入定と伝わる', big: true, t: 6, dy: 80}]} />
				</Stage>
			</Beat>
			<Beat name="塚を掘ると" captions={c} from={2} to={4}>
				<Stage label="塚を掘ると">
					<LegendGap from={1840} to={1990} marks={[{year: 1854, label: '光明海が\n入定と伝わる'}, {year: 1978, label: '掘り出すと\n白骨', story: true}]} gapLabel='124年後' />
				</Stage>
			</Beat>
			<Beat name="内藤正敏氏の指摘" captions={c} from={5} to={6}>
				<Stage label="内藤正敏氏の指摘">
					<Relations nodes={[{id: 'd', x: 520, y: 560, name: '土中入定', sub: '土の中で亡くなる伝説'}, {id: 's', x: 1400, y: 560, name: '即身仏', sub: '体を残して祀る', hot: true}]} edges={[{a: 'd', b: 's', label: 'もともと別の信仰', red: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="寺に伝わる伝承" captions={c} from={7} to={7}>
				<Stage label="寺に伝わる伝承">
					<Scroll text={'土中入定を\n明記した\n古文書は\n見つかっていない'} source='岩鼻通明（2021年）より要約' tone='moss' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="日本の外にも？" captions={c} from={11}>
				<Photo id="sojiji-sanmon-hd" move="in" label="日本の外にも？" />
			</Beat>
		</SceneFrame>
	);
};
