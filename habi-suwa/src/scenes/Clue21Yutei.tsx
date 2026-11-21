import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Flow, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue21YuteiCaptions as c} from '../data/captions';

// 宥貞法印は、石の棺の中で鉦を鳴らしながら亡くなった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue21Yutei = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue21Yutei" label="第21の手がかり" title="宥貞法印は、石の棺の中で鉦を鳴らしながら亡くなった？">
			<Beat name="福島県浅川町" captions={c} from={0} to={0}>
				<Stage label="福島県浅川町" labelBottom>
					<ReliefMap view='japan' zoom={1.3} focus={P.asakawa} pins={[{at: P.asakawa, name: '浅川町 貫秀寺', sub: '宥貞法印', big: true, t: 6}]} />
				</Stage>
			</Beat>
			<Beat name="1683年12月" captions={c} from={1} to={2}>
				<Stage label="1683年12月">
					<Scroll text={'わが身を\nとどめて\n薬師如来と\nならん'} source='『権僧都宥貞法印行状記』より（寺の伝え）' />
				</Stage>
			</Beat>
			<Beat name="棺の大きさ" captions={c} from={3} to={4}>
				<Stage label="棺の大きさ">
					<Cards cards={[{head: '伝承', body: '石の棺の中で\n鉦を鳴らした'}, {head: '現存する棺', body: '中で鉦を鳴らすのは\n難しい', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="2019年 CT撮影" captions={c} from={5} to={5}>
				<Photo id="ct-scanner" move="in" label="2019年 CT撮影" />
			</Beat>
			<Beat name="分かっていること" captions={c} from={6} to={6}>
				<Stage label="分かっていること">
					<Flow steps={[{head: '2019年', body: '病院でCT撮影'}, {head: '特別展「ミイラ」', body: '約46万人'}, {head: '詳しい結果', body: '論文は\n確認できず', dim: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="本人だと確かめられる？" captions={c} from={10}>
				<Photo id="fingerprint-exercise" move="in" label="本人だと確かめられる？" />
			</Beat>
		</SceneFrame>
	);
};
