import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12EyeCaptions as c} from '../data/captions';

// 鉄門海上人は、自分の目をくりぬいた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue12Eye = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Eye" label="第12の手がかり" title="鉄門海上人は、自分の目をくりぬいた？">
			<Beat name="鶴岡市大網 注連寺" captions={c} from={0} to={0}>
				<Photo id="gassan" move="in" label="鶴岡市大網 注連寺" />
			</Beat>
			<Beat name="寺の公式の説明" captions={c} from={1} to={1}>
				<Stage label="寺の公式の説明">
					<TimeBar stops={[{label: '1759年', sub: '鶴岡に生まれる'}, {label: '21歳', sub: '注連寺に入る'}, {label: '二千日', sub: '仙人沢で木食修行', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="数多くの伝説" captions={c} from={2} to={3}>
				<Photo id="tsuruoka-park-sakura" move="in" label="数多くの伝説" />
			</Beat>
			<Beat name="江戸で目の病が流行" captions={c} from={4} to={4}>
				<Photo id="hiroshige-nihonbashi" move="in" label="江戸で目の病が流行" />
			</Beat>
			<Beat name="道を開き、病を退ける祈祷" captions={c} from={5} to={5}>
				<Photo id="sakata-sugatami" move="in" label="道を開き、病を退ける祈祷" />
			</Beat>
			<Beat name="京都・仁和寺「恵眼院」" captions={c} from={6} to={6}>
				<Photo id="ninnaji-kondo" move="in" label="京都・仁和寺「恵眼院」" />
			</Beat>
			<Beat name="本当なのか" captions={c} from={7} to={8}>
				<Stage label="本当なのか">
					<Cards cards={[{head: '伝説', body: '江戸の人々のため\n左目をくりぬいた'}, {head: '1960年代の調査', body: '左目は生前に\nくりぬかれた', tone: 'gold'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="細かな経緯は伝説" captions={c} from={9} to={10}>
				<Photo id="jiji-sugi-snow" move="in" label="細かな経緯は伝説" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="生きたまま土に入った？" captions={c} from={14}>
				<Photo id="haguro-cedar-snow-b" move="in" label="生きたまま土に入った？" />
			</Beat>
		</SceneFrame>
	);
};
