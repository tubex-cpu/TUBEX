import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16GakumonCaptions as c} from '../data/captions';

// 菅原道真は、はじめから学問の神だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue16Gakumon = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Gakumon" label="第16の手がかり" title="菅原道真は、はじめから学問の神だった？">
			<Beat name="942年 お告げ" captions={c} from={0} to={0}>
				<Photo id="kitano-plum" move="in" label="942年 お告げ" />
			</Beat>
			<Beat name="947年 北野に社殿" captions={c} from={1} to={1}>
				<Photo id="kitano-honden" move="in" label="947年 北野に社殿" />
			</Beat>
			<Beat name="怨霊から、神へ" captions={c} from={2} to={4}>
				<Stage label="怨霊から、神へ">
					<TimeBar stops={[{label: '947年', sub: '北野に社殿'}, {label: '987年', sub: '初めての国の祭り'}, {label: '993年', sub: '太政大臣を贈る', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="学問の神は、いつ？" captions={c} from={5} to={6}>
				<Photo id="totou-tenjin" move="in" label="学問の神は、いつ？" />
			</Beat>
			<Beat name="文章の道の祖" captions={c} from={7} to={7}>
				<Photo id="tenjin-kakejiku" move="in" label="文章の道の祖" />
			</Beat>
			<Beat name="寺子屋の天神さま" captions={c} from={8} to={9}>
				<Photo id="kitano-ox" move="in" label="寺子屋の天神さま" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="大宰府の地には" captions={c} from={13}>
				<Photo id="tofuro-aerial" move="in" label="大宰府の地には" />
			</Beat>
		</SceneFrame>
	);
};
