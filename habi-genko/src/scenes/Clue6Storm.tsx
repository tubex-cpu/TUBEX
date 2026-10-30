import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {NightRetreat, SeasonDial} from '../components/GenkoArt3';
import {Cards, MapScene, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6StormCaptions as c} from '../data/captions';

// 1度目の元軍は、嵐で追い返された？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue6Storm = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Storm" label="第6の手がかり" title="1度目の元軍は、嵐で追い返された？">
			<Beat name="翌朝、何が起きていた？" captions={c} from={0} to={1}>
				<Stage label="翌朝、何が起きていた？">
					<NightRetreat />
				</Stage>
			</Beat>
			<Beat name="1度目の神風？" captions={c} from={2} to={3}>
				<Photo id="typhoon-soulik" move="in" label="1度目の神風？" />
			</Beat>
			<Beat name="記録を読み比べると？" captions={c} from={4} to={7}>
				<Stage label="記録を読み比べると？">
					<Cards cards={[{head: '嵐を書いた記録', body: '高麗史\n勘仲記', tone: 'gold'}, {head: '', body: '？', tone: 'dark'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="書いていない記録も？" captions={c} from={8} to={11}>
				<Stage label="書いていない記録も？">
					<Cards cards={[{head: '嵐を書いていない', body: '元史\n八幡愚童訓', tone: 'red'}, {head: '元史には', body: '軍が整わず\n矢も尽きた', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="どこで吹いた嵐？" captions={c} from={12} to={12}>
				<Stage label="どこで吹いた嵐？" labelBottom>
					<MapScene cam={{lon: 128.6, lat: 34.2, zoom: 1.6}} storm={{key: 'tsushima', at: 15}} pins={[{key: 'hakata', name: '日本の近く？', at: 30}, {key: 'gappo', name: '帰る途中？', at: 50, dx: -230}]} />
				</Stage>
			</Beat>
			<Beat name="台風の季節か？" captions={c} from={13} to={15}>
				<Stage label="台風の季節か？">
					<SeasonDial />
				</Stage>
			</Beat>
			<Beat name="研究者たちの議論" captions={c} from={16} to={18}>
				<Stage label="研究者たちの議論">
					<TimeBar stops={[{label: '1958年', sub: '気象学者 荒川秀俊\n「台風は来なかった」'}, {label: '2017年', sub: '歴史学者 服部英雄\n『蒙古襲来と神風』', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="ほかの理由は？" captions={c} from={19} to={22}>
				<Stage label="ほかの理由は？">
					<Cards cards={[{head: '理由1', body: '副司令官が\n矢を受けて負傷', tone: 'dark'}, {head: '理由2', body: '矢が\n尽きかけた', tone: 'dark'}, {head: '理由3', body: '指揮官の\n意見が合わない', tone: 'dark'}]} tone='ember' size={44} />
				</Stage>
			</Beat>
			<Beat name="風雨は、あったのか" captions={c} from={23} to={23}>
				<Photo id="genkai-4" move="out" label="風雨は、あったのか" />
			</Beat>
			<Beat name="判決" captions={c} from={24} to={26}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 24, 25, fps)} />
			</Beat>
			<Beat name="元が去ったあと、日本は？" captions={c} from={27}>
				<Photo id="engakuji-butsunichian" move="in" label="元が去ったあと、日本は？" />
			</Beat>
		</SceneFrame>
	);
};
