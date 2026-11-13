import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue28ZhanggongCaptions as c} from '../data/captions';

// 中国では、仏像の中から僧の遺体が見つかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue28Zhanggong = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue28Zhanggong" label="第28の手がかり" title="中国では、仏像の中から僧の遺体が見つかった？">
			<Beat name="福建省三明市大田県" captions={c} from={0} to={0}>
				<Photo id="datian-temple" move="in" label="福建省三明市大田県" />
			</Beat>
			<Beat name="村のお堂から" captions={c} from={1} to={1}>
				<Stage label="村のお堂から">
					<BigYears value={1995} unit='年' caption='12月 仏像が盗まれる' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="2015年3月 ハンガリーの博物館" captions={c} from={2} to={2}>
				<Photo id="hnhm-entrance" move="in" label="2015年3月 ハンガリーの博物館" />
			</Beat>
			<Beat name="仏像の中に" captions={c} from={3} to={3}>
				<Photo id="hnhm-snow" move="in" label="仏像の中に" />
			</Beat>
			<Beat name="返還を求める裁判" captions={c} from={4} to={5}>
				<Stage label="返還を求める裁判">
					<TimeBar stops={[{label: '1995年', sub: '盗まれる'}, {label: '2015年', sub: '展示で見つかる'}, {label: '2022年', sub: '返還を命じる判決', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="いまどこに" captions={c} from={6} to={7}>
				<Stage label="いまどこに">
					<Cards cards={[{head: '収集家', body: 'すでに\n人手に渡った'}, {head: '像の行方', body: '分かっていない', tone: 'red'}]} tone='ink' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="ほかの国にも" captions={c} from={11}>
				<Photo id="samui-temple" move="in" label="ほかの国にも" />
			</Beat>
		</SceneFrame>
	);
};
