import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3KawariCaptions as c} from '../data/captions';

// 縄文の暮らしは、1万年間ほとんど変わらなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue3Kawari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Kawari" label="第3の手がかり" title="縄文の暮らしは、1万年間ほとんど変わらなかった？">
			<Beat name="1万年、同じ暮らし？" captions={c} from={0} to={0}>
				<Photo id="c03-ogushi-interior" move="in" label="1万年、同じ暮らし？" />
			</Beat>
			<Beat name="変わり続けた暮らし" captions={c} from={1} to={1}>
				<Photo id="c03-final-pottery" move="left" label="変わり続けた暮らし" />
			</Beat>
			<Beat name="暮らし方の変化" captions={c} from={2} to={2}>
				<Stage label="暮らし方の変化">
					<Flow steps={[{head: '移り住む', body: '季節ごとに'}, {head: '村をつくる', body: '一か所に\n住み続ける', hot: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="暖かくなると" captions={c} from={3} to={3}>
				<Photo id="c03-jomon-sea-map" move="in" label="暖かくなると" />
			</Beat>
			<Beat name="九州の南の海" captions={c} from={4} to={4}>
				<Photo id="c12-takeshima" move="right" label="九州の南の海" />
			</Beat>
			<Beat name="変わらなかったもの" captions={c} from={5} to={5}>
				<Photo id="c03-ofune-ento" move="in" label="変わらなかったもの" />
			</Beat>
			<Beat name="氷河期の祖先" captions={c} from={6} to={6}>
				<Stage label="氷河期の祖先">
					<Figures figs={[{value: '42人', label: '縄文人の遺伝子'}, {value: '1万年以上', label: '保たれた特徴', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="文明と呼べるのか" captions={c} from={10}>
				<Photo id="c04-sannai-pithouses" move="in" label="文明と呼べるのか" />
			</Beat>
		</SceneFrame>
	);
};
