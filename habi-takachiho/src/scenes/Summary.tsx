import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: '夜神楽は、観光客のためのショー？', v: 'wrong'},
	{q: '夜神楽は、神話の時代から続く？', v: 'wrong'},
	{q: '天岩戸は、高千穂にある？', v: 'half'},
	{q: '天岩戸神社の御神体は、洞窟そのもの？', v: 'right'},
	{q: '天孫降臨の地は、宮崎の高千穂？', v: 'half'},
	{q: '天岩戸の神話は、日食の記憶？', v: 'half'},
	{q: '天照大神は卑弥呼だと証明された？', v: 'wrong'},
	{q: '天宇受売命の舞は、神楽の始まり？', v: 'half'},
	{q: '夜神楽は、消えかけている？', v: 'half'},
	{q: '神楽は、もう世界遺産？', v: 'wrong'},
] as const;

// まとめ：10の判決を、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="今夜の判決" captions={c} from={0} to={10}>
				<Stage>
					<VerdictBoard rows={rows} startAt={rows.map((_, i) => captionFrame(c, 0, i + 1, fps))} />
				</Stage>
			</Beat>
			<Beat name="舞として、生き続ける" captions={c} from={11} to={12}>
				<Photo id="yk-mask-oldwoman" move="in" label="舞として、生き続ける" />
			</Beat>
			<Beat name="今年も" captions={c} from={13}>
				<Photo id="kunimi-unkai" move="in" label="今年も、岩戸が開かれる" />
			</Beat>
		</SceneFrame>
	);
};
