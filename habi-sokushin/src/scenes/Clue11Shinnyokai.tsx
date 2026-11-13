import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11ShinnyokaiCaptions as c} from '../data/captions';

// 真如海上人は、大飢饉の年に入定した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue11Shinnyokai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Shinnyokai" label="第11の手がかり" title="真如海上人は、大飢饉の年に入定した？">
			<Beat name="大日坊の真如海上人" captions={c} from={0} to={0}>
				<Photo id="yudono-uba-gassan" move="in" label="大日坊の真如海上人" />
			</Beat>
			<Beat name="天明の大飢饉の年" captions={c} from={1} to={2}>
				<Stage label="天明の大飢饉の年">
					<BigYears value={1783} unit='年' caption='天明3年 96歳で入定（寺の説明）' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="千日後に掘り起こしたら" captions={c} from={3} to={3}>
				<Photo id="gassan-green" move="in" label="千日後に掘り起こしたら" />
			</Beat>
			<Beat name="明治8年の大火で2体が" captions={c} from={4} to={4}>
				<Photo id="kiyochika-after-fire" move="in" label="明治8年の大火で2体が" />
			</Beat>
			<Beat name="こんな伝説も" captions={c} from={5} to={6}>
				<Photo id="hiroshige-dewa-gassan" move="in" label="こんな伝説も" />
			</Beat>
			<Beat name="確かめられない話" captions={c} from={7} to={7}>
				<Photo id="ideha-forest" move="in" label="確かめられない話" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="最も多くの伝説に包まれた即身仏" captions={c} from={11}>
				<Photo id="gassan-pilgrim" move="in" label="最も多くの伝説に包まれた即身仏" />
			</Beat>
		</SceneFrame>
	);
};
