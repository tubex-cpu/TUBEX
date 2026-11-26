import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {SpanCompare} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1NagasaCaptions as c} from '../data/captions';

// 縄文時代は、1万年以上続いた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue1Nagasa = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Nagasa" label="第1の手がかり" title="縄文時代は、1万年以上続いた？">
			<Beat name="本州の北の果て" captions={c} from={0} to={0}>
				<Stage label="本州の北の果て" labelBottom>
					<ReliefMap view='tohoku' zoom={1.08} focus={P.odai} pins={[{at: P.odai, name: '大平山元遺跡', sub: '青森県外ヶ浜町', big: true, t: 8}, {at: P.sannai, name: '三内丸山遺跡', t: 40}]} />
				</Stage>
			</Beat>
			<Beat name="こびりついた焦げ" captions={c} from={1} to={1}>
				<Photo id="c01-odai-sherds" move="in" label="こびりついた焦げ" />
			</Beat>
			<Beat name="2025年 国の重要文化財" captions={c} from={2} to={2}>
				<Photo id="c01-odai-replica" move="left" label="2025年 国の重要文化財" />
			</Beat>
			<Beat name="終わりはいつ？" captions={c} from={3} to={3}>
				<Stage label="終わりはいつ？">
					<TimeBar stops={[{label: '1万6000年前', sub: '縄文の始まり'}, {label: '紀元前10世紀', sub: '九州北部で米づくり', accent: true}, {label: '今日', sub: ''}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="くらべると" captions={c} from={4} to={5}>
				<Stage label="くらべると">
					<SpanCompare spans={[{label: '縄文時代', years: 13000, accent: true}, {label: '弥生時代から今日まで', years: 3000}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="北の大地では" captions={c} from={6} to={6}>
				<Stage label="北の大地では" labelBottom>
					<ReliefMap view='archipelago' zoom={1.05} pins={[{at: P.hokkaido, name: '北海道', sub: '米づくりをしない暮らし', big: true, t: 8}, {at: P.odai, name: '本州', t: 36}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="世界でいちばん古い？" captions={c} from={10}>
				<Photo id="c02-incipient-bowls" move="in" label="世界でいちばん古い？" />
			</Beat>
		</SceneFrame>
	);
};
