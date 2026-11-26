import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue13KannaiCaptions as c} from '../data/captions';

// 黒塚古墳で、いちばん大切にされたのは三角縁神獣鏡？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue13Kannai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue13Kannai" label="第13の手がかり" title="黒塚古墳で、いちばん大切にされたのは三角縁神獣鏡？">
			<Beat name="棺の中には" captions={c} from={0} to={1}>
				<Photo id="c13-tsubai-32-gamon" move="in" label="棺の中には" />
			</Beat>
			<Beat name="頭のそばの1枚" captions={c} from={2} to={3}>
				<Photo id="c13-hokenoyama-gamon" move="in" label="頭のそばの1枚" />
			</Beat>
			<Beat name="大きいのに外" captions={c} from={4} to={4}>
				<Stage label="大きいのに外">
					<Figures figs={[{value: '13.5センチ', label: '棺の中の鏡'}, {value: '20〜24センチ', label: '棺の外の三角縁', accent: true}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="低く扱われた？" captions={c} from={5} to={5}>
				<Photo id="c13-tenjinyama-gamon" move="in" label="低く扱われた？" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="2026年の最新技術" captions={c} from={9}>
				<Photo id="c14-tenri-sankokan" move="in" label="2026年の最新技術" />
			</Beat>
		</SceneFrame>
	);
};
