import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="即身仏の本当の物語" captions={c} from={0} to={2}>
				<Photo id="chokai-sakata-fields" move="in" label="即身仏の本当の物語" />
			</Beat>
			<Beat name="弟子と信者の手" captions={c} from={3} to={4}>
				<Stage label="弟子と信者の手">
					<Cards cards={[{body: 'いぶす'}, {body: '柿渋を塗る'}, {body: '内臓を取り石灰'}, {body: 'ひもで縛る'}]} tone='ember' size={44} height={260} top={400} />
				</Stage>
			</Beat>
			<Beat name="調査が明かしたこと" captions={c} from={5} to={5}>
				<Photo id="kahaku-japan-gallery" move="in" label="調査が明かしたこと" />
			</Beat>
			<Beat name="記録が語ること" captions={c} from={6} to={7}>
				<Stage label="記録が語ること">
					<TimeBar stops={[{label: '1829年', sub: '鉄門海 病死'}, {label: '1832年', sub: '掘り出して開帳'}, {label: '1903年', sub: '仏海 土に入るのを止められる'}, {label: '1961年', sub: '仏海の墓を発掘', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="語り継がれた信仰の物語" captions={c} from={8} to={9}>
				<Photo id="nanatsu-taki" move="in" label="語り継がれた信仰の物語" />
			</Beat>
			<Beat name="人々の手が刻まれた体" captions={c} from={10}>
				<Photo id="yonezawa-snow-house" move="in" label="人々の手が刻まれた体" />
			</Beat>
		</SceneFrame>
	);
};
