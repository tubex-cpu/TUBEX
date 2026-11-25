import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7UrushiCaptions as c} from '../data/captions';

// 即身仏になるため、行者は漆を飲んだ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue7Urushi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Urushi" label="第7の手がかり" title="即身仏になるため、行者は漆を飲んだ？">
			<Beat name="漆の茶" captions={c} from={0} to={1}>
				<Photo id="urushi-trunk" move="in" label="漆の茶" />
			</Beat>
			<Beat name="記録では" captions={c} from={2} to={3}>
				<Photo id="urushi-yellow" move="in" label="記録では" />
			</Beat>
			<Beat name="仏海上人の伝え" captions={c} from={4} to={4}>
				<Photo id="yamagata-yudono-m" move="in" label="仏海上人の伝え" />
			</Beat>
			<Beat name="調査で確かめられた？" captions={c} from={5} to={5}>
				<Stage label="調査で確かめられた？">
					<Cards cards={[{head: '伝説', body: '漆を飲んで\n体を固めた'}, {head: '調査', body: '使用を確かめた例\n見つからない', tone: 'red'}]} tone='ink' size={48} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="中国の乾漆の仏" captions={c} from={6} to={6}>
				<Photo id="lacquer-buddha-met" move="in" label="中国の乾漆の仏" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="鉦を鳴らし続けた？" captions={c} from={10}>
				<Photo id="kane-katori" move="in" label="鉦を鳴らし続けた？" />
			</Beat>
		</SceneFrame>
	);
};
