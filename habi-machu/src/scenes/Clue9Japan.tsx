import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {JapanChain} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9JapanCaptions as c} from '../data/captions';

// マチュピチュと日本は、何のつながりもない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue9Japan = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Japan" label="第9の手がかり" title="マチュピチュと日本は、何のつながりもない？">
			<Beat name="ふもとの村に刻まれた名" captions={c} from={0} to={1}>
				<Photo id="aguas-1" move="in" label="ふもとの村に刻まれた名" />
			</Beat>
			<Beat name="野内与吉" captions={c} from={2} to={3}>
				<Stage label="野内与吉">
					<TimeBar stops={[{label: '1895年', sub: '大玉村に\n生まれる'}, {label: '1917年ごろ', sub: 'ペルーへ'}, {label: '1935年', sub: 'ホテル・ノウチ'}, {label: '1948年', sub: '初代村長', accent: true}, {label: '1968年', sub: 'ふるさとへ'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="鉄道の建設" captions={c} from={4} to={4}>
				<Photo id="perurail-trail" move="in" label="鉄道の建設" />
			</Beat>
			<Beat name="村の暮らしの土台" captions={c} from={5} to={7}>
				<Photo id="aguas-station" move="in" label="村の暮らしの土台" />
			</Beat>
			<Beat name="ふるさと、大玉村" captions={c} from={8} to={10}>
				<Photo id="otama-office" move="in" label="ふるさと、大玉村" />
			</Beat>
			<Beat name="思いがけない縁" captions={c} from={11} to={12}>
				<Stage label="思いがけない縁" labelBottom>
					<ReliefMap view='fukushima' pins={[{at: P.otama, name: '大玉村', big: true, t: 10}, {at: P.tomioka, name: '富岡町', t: 40}]} lines={[{pts: [P.tomioka, P.otama], t: 60, arrow: true, label: '2011年 避難'}]} />
				</Stage>
			</Beat>
			<Beat name="2011年、富岡町" captions={c} from={13} to={14}>
				<Photo id="yonomori" move="in" label="2011年、富岡町" />
			</Beat>
			<Beat name="恩を返したい" captions={c} from={15} to={17}>
				<Stage label="恩を返したい">
					<JapanChain />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="日本の技術が見つけたもの" captions={c} from={21}>
				<Photo id="uru-valley-2-w" move="scroll" label="日本の技術が見つけたもの" />
			</Beat>
		</SceneFrame>
	);
};
