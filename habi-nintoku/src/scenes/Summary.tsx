import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: '世界最大の墓', note: '長さと面積は世界最大級。高さと体積は及ばない', mark: '半分正しい', color: '#d98a12'},
	{clue: '15年以上かかった', note: '古代の方法なら15年8か月という試算', mark: '正しい', color: colors.correct},
	{clue: '眠るのは仁徳天皇', note: '確かめられてはいない', mark: 'まちがい', color: colors.wrong},
	{clue: '中を見た人はいない', note: '明治5年、前方部の石室と石棺が現れた', mark: 'まちがい', color: colors.wrong},
	{clue: '宝はアメリカへ', note: 'ボストンにはある。仁徳天皇陵からの証拠はない', mark: '半分正しい', color: '#d98a12'},
];

const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 110, right: 110, top: 140, display: 'flex', flexDirection: 'column', gap: 14}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div key={r.clue} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '6px 36px', borderRadius: 18, background: 'rgba(244,236,220,0.08)', opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<div style={{width: 230, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff', background: r.color, borderRadius: 12, padding: '8px 0', textAlign: 'center', whiteSpace: 'nowrap', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{r.mark}</div>
						<div style={{width: 440, fontFamily: minchoFamily, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap', color: colors.text}}>{r.clue}</div>
						<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 32, color: colors.muted}}>{r.note}</div>
					</div>
				);
			})}
		</div>
	);
};

// まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={5}>
			<VerdictBoard />
		</Beat>
		<Beat name="決まらなかった" captions={c} from={6} to={6}>
			<Photo id="kisaragi-2" move="out" label="誰が眠るのかは、まだわからない。でも――" />
		</Beat>
		<Beat name="感謝と幻の城" captions={c} from={7} to={7}>
			<Photo id="haniwa-inari" label="1500年前のまま並ぶ埴輪と、浮かび上がった土壇" />
		</Beat>
		<Beat name="結論" captions={c} from={8}>
			<Photo id="daisen-park-2" label="本当の話は、作り話に負けないくらい、面白い。" />
		</Beat>
	</SceneFrame>
);
