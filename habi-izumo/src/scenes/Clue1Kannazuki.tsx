import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {KanjiNo, MonthNames} from '../components/IzumoArt1';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1KannazukiCaptions as c} from '../data/captions';

// 神無月は、神様がいない月？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue1Kannazuki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Kannazuki" label="第1の手がかり" title="神無月は、神様がいない月？">
			<Beat name="10月の古い呼び名" captions={c} from={0} to={0}>
				<Photo id="old-calendar" move="in" label="10月の古い呼び名" />
			</Beat>
			<Beat name="神様がいなくなる月？" captions={c} from={1} to={2}>
				<Photo id="momiji-torii" move="right" label="神様がいなくなる月？" />
			</Beat>
			<Beat name="辞書を開くと？" captions={c} from={3} to={5}>
				<Stage label="辞書を開くと？">
					<Cards cards={[{head: '日本国語大辞典', body: '神無月の\n名前の由来\nいくつもの説', tone: 'paper'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="「な」は、何を意味する？" captions={c} from={6} to={6}>
				<Stage label="「な」は、何を意味する？">
					<KanjiNo />
				</Stage>
			</Beat>
			<Beat name="水無月も、同じ？" captions={c} from={7} to={8}>
				<Stage label="水無月も、同じ？">
					<MonthNames />
				</Stage>
			</Beat>
			<Beat name="10月は、どんな季節？" captions={c} from={9} to={9}>
				<Photo id="harvest-hazakake" move="in" label="10月は、どんな季節？" />
			</Beat>
			<Beat name="ほかにも説が" captions={c} from={10} to={10}>
				<Photo id="autumn-mikoshi" move="in" label="ほかにも説が" />
			</Beat>
			<Beat name="出雲に行くから、は？" captions={c} from={11} to={11}>
				<Photo id="harvest-field" move="left" label="出雲に行くから、は？" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="その話は、いつ生まれた？" captions={c} from={15}>
				<Photo id="harvest-1914" move="in" label="その話は、いつ生まれた？" />
			</Beat>
		</SceneFrame>
	);
};
