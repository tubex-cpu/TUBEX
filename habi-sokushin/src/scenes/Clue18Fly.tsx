import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {BigYears, Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18FlyCaptions as c} from '../data/captions';

// 即身仏の体の中から、ハエの抜け殻が見つかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue18Fly = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Fly" label="第18の手がかり" title="即身仏の体の中から、ハエの抜け殻が見つかった？">
			<Beat name="1962年の報告" captions={c} from={0} to={0}>
				<Photo id="housefly-snodgrass" move="in" label="1962年の報告" />
			</Beat>
			<Beat name="小さな発見" captions={c} from={1} to={1}>
				<Stage label="小さな発見">
					<BigYears value={6} unit='体' caption='体の中からハエのさなぎの抜け殻' tone='night' />
				</Stage>
			</Beat>
			<Beat name="ハエが育つ条件" captions={c} from={2} to={2}>
				<Photo id="calliphora-side" move="in" label="ハエが育つ条件" />
			</Beat>
			<Beat name="冬に土に入ったはずなのに" captions={c} from={3} to={4}>
				<Stage label="冬に土に入ったはずなのに">
					<TimeBar stops={[{label: '1月・2月', sub: '入定と伝わる'}, {label: '暖かい季節', sub: 'ハエが育つ', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="小片保氏の推測" captions={c} from={5} to={5}>
				<Stage label="小片保氏の推測">
					<Flow steps={[{head: '亡くなる'}, {head: '地上に置かれる', body: '体がまだ\n湿っている', hot: true}, {head: 'ハエが育つ'}, {head: '乾燥・処置'}]} />
				</Stage>
			</Beat>
			<Beat name="伝説とは違う過程" captions={c} from={6} to={6}>
				<Photo id="dewa-basho-spot" move="in" label="伝説とは違う過程" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="亡くなったあとに整えられた？" captions={c} from={10}>
				<Photo id="kaneiji-pagoda" move="in" label="亡くなったあとに整えられた？" />
			</Beat>
		</SceneFrame>
	);
};
