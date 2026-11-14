// one background set as a still (composition "Bg", prop id). Rendered by scripts/render_bgs.mjs into public/bg/<id>.png
import {AbsoluteFill} from 'remotion';
import {Canvas3D} from '../three/Canvas3D';
import {SETS, SetScene} from '../three/Sets';
import {useFont} from './kit';

const GLYPHS = '同じ額居酒屋定食八百屋本屋株式会社コンビニ病院介護施設ショッピングモール作業員募集宝くじガラス取り付け週休3日家から5分夜勤なし高校振込のお知らせ給料が振り込まれました';
export const BgStill: React.FC<{id: string}> = ({id}) => {
  const ok = useFont(GLYPHS);
  const s = SETS[id];
  return (
    <AbsoluteFill style={{background: '#0F1B2D'}}>
      {ok && <Canvas3D focus={s.focus ?? 0.03} blur={s.blur ?? 3.4}><SetScene id={id} /></Canvas3D>}
    </AbsoluteFill>
  );
};
