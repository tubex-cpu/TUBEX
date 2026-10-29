import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '古代から語り継がれた', mark: 'まちがい', color: colors.wrong},
	{clue: 'マヤの本に書かれていた', mark: 'まちがい', color: colors.wrong},
	{clue: '女王ムーがエジプトへ', mark: 'まちがい', color: colors.wrong},
	{clue: '6400万人の大陸', mark: 'まちがい', color: colors.wrong},
	{clue: 'ムーの記録の粘土板', mark: 'まちがい', color: colors.wrong},
	{clue: '南の海の石の都はムーの都', mark: 'まちがい', color: colors.wrong},
	{clue: '墓を暴いた男の呪い', mark: 'まちがい', color: colors.wrong},
	{clue: '海底のプラチナの棺', mark: 'まちがい', color: colors.wrong},
	{clue: 'モアイは沈んだ大陸の見張り', mark: 'まちがい', color: colors.wrong},
	{clue: 'モアイは引きずって運んだ', mark: 'まちがい', color: colors.wrong},
	{clue: '沈む大陸から逃げてきた', mark: 'まちがい', color: colors.wrong},
	{clue: '木を切りつくして滅んだ', mark: 'まちがい', color: colors.wrong},
	{clue: '与那国の海底にムーの遺跡', mark: 'まちがい', color: colors.wrong},
	{clue: '上陸禁止の島がムーを隠す', mark: 'まちがい', color: colors.wrong},
	{clue: '地図から消された島', mark: '半分正しい', color: '#d98a12'},
	{clue: '科学者も沈んだ陸を信じた', mark: '正しい', color: colors.correct},
	{clue: '太平洋の海底に大陸', mark: 'まちがい', color: colors.wrong},
	{clue: '次に沈むのは日本', mark: 'まちがい', color: colors.wrong},
];

// 18の判決を2列に並べる
const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 70, right: 70, top: 130, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoFlow: 'column', gridTemplateRows: 'repeat(9, auto)', gap: '10px 30px'}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div key={r.clue} style={{display: 'flex', alignItems: 'center', gap: 24, padding: '6px 24px', borderRadius: 16, background: 'rgba(244,236,220,0.08)', opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<div style={{width: 190, fontFamily: gothicFamily, fontWeight: 900, fontSize: 32, color: '#fff', background: r.color, borderRadius: 12, padding: '6px 0', textAlign: 'center', whiteSpace: 'nowrap', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{r.mark}</div>
						<div style={{fontFamily: minchoFamily, fontWeight: 800, fontSize: 33, whiteSpace: 'nowrap', color: colors.text}}>{r.clue}</div>
					</div>
				);
			})}
		</div>
	);
};

// まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={18}>
			<VerdictBoard />
		</Beat>
		<Beat name="どこにもなかった" captions={c} from={19} to={19}>
			<Photo id="pacific-sunset" move="out" label="ムー大陸は、どこにもなかった。でも――" />
		</Beat>
		<Beat name="本当の人々" captions={c} from={20} to={20}>
			<Photo id="tongariki-dawn" label="石の都、歩く石像、星を読む航海、海の下の大陸" />
		</Beat>
		<Beat name="結論" captions={c} from={21}>
			<Photo id="nanmadol-last" label="本当の話は、作り話に負けないくらい、面白い。" />
		</Beat>
	</SceneFrame>
);
