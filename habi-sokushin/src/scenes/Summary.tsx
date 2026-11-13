import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

type Row = {q: string; v: 'right' | 'half' | 'wrong'};
const masakado: Row[] = [
	{q: '将門は朝廷に逆らった悪人？', v: 'half'},
	{q: '神のお告げで「新皇」に？', v: 'right'},
	{q: '将門を討ったのは俵藤太？', v: 'half'},
	{q: '首は笑い、胴を探した？', v: 'half'},
	{q: '首は東京まで飛んだ？', v: 'wrong'},
	{q: '塚を動かすと祟る？', v: 'half'},
	{q: 'GHQの重機が横転した？', v: 'wrong'},
	{q: '2026年、男に罰が？', v: 'half'},
	{q: '神田明神は将門を外した？', v: 'right'},
	{q: '氏子は成田山に参れない？', v: 'half'},
];
const michizane: Row[] = [
	{q: '道真は遣唐使を廃止した？', v: 'half'},
	{q: '道真は無実の罪だった？', v: 'half'},
	{q: '時平は祟りで若死に？', v: 'wrong'},
	{q: '落雷は当時から祟り？', v: 'half'},
	{q: '絵巻に地獄の醍醐天皇？', v: 'wrong'},
	{q: 'はじめから学問の神？', v: 'wrong'},
	{q: '牛が止まった地に天満宮？', v: 'half'},
	{q: '梅は大宰府まで飛んだ？', v: 'wrong'},
];
const sutoku: Row[] = [
	{q: '鳥羽上皇の子ではない？', v: 'half'},
	{q: '自ら保元の乱を起こした？', v: 'half'},
	{q: '血で呪いの経を書いた？', v: 'wrong'},
	{q: '讃岐で殺された？', v: 'half'},
	{q: '西行は墓を訪ねた？', v: 'right'},
	{q: '死後、天狗になった？', v: 'wrong'},
	{q: 'すぐに怨霊と恐れられた？', v: 'wrong'},
	{q: '明治天皇が霊を迎えた？', v: 'right'},
	{q: '五輪のために慰霊した？', v: 'wrong'},
	{q: '球技好きでスポーツの神？', v: 'wrong'},
	{q: '三大怨霊は昔から？', v: 'wrong'},
	{q: '祀れば守り神になる？', v: 'right'},
	{q: '祇園祭は怨霊鎮めから？', v: 'half'},
];

// まとめ：31の判決を、3人の怨霊ごとに、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	const at = (rows: Row[], first: number) => rows.map((_, i) => captionFrame(c, first, first + i, fps));
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="平将門の判決" captions={c} from={0} to={10}>
				<Stage>
					<VerdictBoard title="平将門" rows={masakado} first={1} startAt={at(masakado, 1)} />
				</Stage>
			</Beat>
			<Beat name="菅原道真の判決" captions={c} from={11} to={18}>
				<Stage>
					<VerdictBoard title="菅原道真" rows={michizane} first={11} startAt={at(michizane, 11)} />
				</Stage>
			</Beat>
			<Beat name="崇徳上皇と御霊の判決" captions={c} from={19} to={31}>
				<Stage>
					<VerdictBoard title="崇徳上皇と御霊信仰" rows={sutoku} first={19} startAt={at(sutoku, 19)} />
				</Stage>
			</Beat>
			<Beat name="物語は後から" captions={c} from={32} to={32}>
				<Photo id="hyakki-yagyo-w" move="scroll" label="後の時代にふくらんだ物語" />
			</Beat>
			<Beat name="日本人の心" captions={c} from={33}>
				<Photo id="night-lanterns" move="in" label="恐れ、そして祀ってきた" />
			</Beat>
		</SceneFrame>
	);
};
