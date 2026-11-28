// ヒト図鑑の人物（自作 SVG・漫画風）。社長指示 2026-11-28：参考サムネの漫画風の描き方を取り入れ、
// 参考にない「はっきりした表情」で差別化する。他者の画像のトレース・流用はしない。
import React from 'react';

export type Expression = 'happy' | 'neutral' | 'worried' | 'shocked' | 'sad' | 'proud';
export type Build = 'slim' | 'round' | 'child' | 'adult';

const LINE = '#2a1d17';

const Eyes: React.FC<{e: Expression}> = ({e}) => {
  if (e === 'happy' || e === 'proud') {
    // 笑って細くなった目
    return (
      <g stroke={LINE} strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M -48 -2 Q -32 -20 -16 -2" />
        <path d="M 16 -2 Q 32 -20 48 -2" />
      </g>
    );
  }
  const r = e === 'shocked' ? 17 : 15;
  const pupil = e === 'shocked' ? 6 : 10;
  return (
    <g>
      {[-32, 32].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="-4" rx={r * 0.85} ry={r * 1.15} fill="#fff" stroke={LINE} strokeWidth="5" />
          <circle cx={x + (e === 'worried' || e === 'sad' ? 0 : 2)} cy={e === 'sad' ? 2 : -1} r={pupil} fill="#2b2b3a" />
          <circle cx={x + 5} cy="-9" r="4" fill="#fff" />
        </g>
      ))}
    </g>
  );
};

const Brows: React.FC<{e: Expression}> = ({e}) => {
  const d: Record<Expression, string> = {
    happy: 'M -50 -38 Q -32 -50 -14 -40 M 14 -40 Q 32 -50 50 -38',
    proud: 'M -50 -40 Q -32 -52 -14 -44 M 14 -44 Q 32 -52 50 -40',
    neutral: 'M -48 -36 L -16 -38 M 16 -38 L 48 -36',
    worried: 'M -50 -30 L -16 -44 M 16 -44 L 50 -30',
    sad: 'M -50 -28 L -16 -44 M 16 -44 L 50 -28',
    shocked: 'M -50 -48 Q -32 -60 -14 -50 M 14 -50 Q 32 -60 50 -48',
  };
  return <path d={d[e]} stroke={LINE} strokeWidth="7" fill="none" strokeLinecap="round" />;
};

const Mouth: React.FC<{e: Expression}> = ({e}) => {
  switch (e) {
    case 'happy':
      return <path d="M -26 26 Q 0 58 26 26 Z" fill="#b8323a" stroke={LINE} strokeWidth="5" strokeLinejoin="round" />;
    case 'proud':
      return <path d="M -22 32 Q 4 46 26 26" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'shocked':
      return <ellipse cx="0" cy="38" rx="15" ry="20" fill="#6b1f25" stroke={LINE} strokeWidth="5" />;
    case 'worried':
      return <path d="M -22 40 Q -8 30 0 36 Q 8 42 22 32" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />;
    case 'sad':
      return <path d="M -22 44 Q 0 24 22 44" stroke={LINE} strokeWidth="6" fill="none" strokeLinecap="round" />;
    default:
      return <path d="M -18 36 L 18 36" stroke={LINE} strokeWidth="6" strokeLinecap="round" />;
  }
};

// 感情の記号（汗・涙・ほほの赤み）
const Extras: React.FC<{e: Expression}> = ({e}) => (
  <g>
    {e === 'happy' || e === 'proud' ? (
      <>
        <ellipse cx="-52" cy="20" rx="14" ry="8" fill="#ff8a8a" opacity="0.6" />
        <ellipse cx="52" cy="20" rx="14" ry="8" fill="#ff8a8a" opacity="0.6" />
      </>
    ) : null}
    {e === 'worried' || e === 'shocked' ? <path d="M 74 -46 Q 88 -20 74 -14 Q 60 -20 74 -46 Z" fill="#8fd3ff" stroke={LINE} strokeWidth="4" /> : null}
    {e === 'sad' ? <path d="M -34 14 Q -40 36 -34 44 Q -28 36 -34 14 Z" fill="#8fd3ff" stroke={LINE} strokeWidth="3" /> : null}
  </g>
);

export const HitoCharacter: React.FC<{
  build?: Build;
  expression?: Expression;
  shirt: string;
  hair?: string;
  size?: number;
  armPose?: 'down' | 'hold' | 'raise';
  longHair?: boolean;
}> = ({build = 'adult', expression = 'neutral', shirt, hair = '#3a2a22', size = 560, armPose = 'down', longHair = false}) => {
  const child = build === 'child';
  const bodyW = build === 'round' ? 290 : build === 'slim' ? 170 : child ? 180 : 210;
  const headR = child ? 98 : 86;
  const headY = child ? 190 : 150;
  const bodyTop = headY + headR - 14;
  const bodyH = child ? 260 : 330;
  const cx = 300;
  const armY = bodyTop + 40;
  const armL =
    armPose === 'raise'
      ? `M ${cx - bodyW / 2 + 16} ${armY} Q ${cx - bodyW / 2 - 70} ${armY - 60} ${cx - bodyW / 2 - 60} ${armY - 150}`
      : armPose === 'hold'
        ? `M ${cx - bodyW / 2 + 16} ${armY} Q ${cx - bodyW / 2 - 40} ${armY + 90} ${cx - 30} ${armY + 120}`
        : `M ${cx - bodyW / 2 + 16} ${armY} Q ${cx - bodyW / 2 - 34} ${armY + 100} ${cx - bodyW / 2 - 10} ${armY + 190}`;
  const armR =
    armPose === 'hold'
      ? `M ${cx + bodyW / 2 - 16} ${armY} Q ${cx + bodyW / 2 + 40} ${armY + 90} ${cx + 30} ${armY + 120}`
      : `M ${cx + bodyW / 2 - 16} ${armY} Q ${cx + bodyW / 2 + 34} ${armY + 100} ${cx + bodyW / 2 + 10} ${armY + 190}`;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 600 660">
      <defs>
        <linearGradient id={`shade-${shirt.slice(1)}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shirt} />
          <stop offset="0.7" stopColor={shirt} />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="skin" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ffe6d2" />
          <stop offset="1" stopColor="#efc2a0" />
        </radialGradient>
      </defs>
      {longHair ? <path d={`M ${cx - headR - 14} ${headY - 10} Q ${cx - headR - 40} ${headY + headR * 1.9} ${cx - headR * 0.4} ${headY + headR * 1.8} L ${cx + headR * 0.4} ${headY + headR * 1.8} Q ${cx + headR + 40} ${headY + headR * 1.9} ${cx + headR + 14} ${headY - 10} Z`} fill={hair} stroke={LINE} strokeWidth="6" /> : null}
      {/* 胴体と腕 */}
      <path d={armL} stroke={LINE} strokeWidth="44" fill="none" strokeLinecap="round" />
      <path d={armL} stroke={shirt} strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d={armR} stroke={LINE} strokeWidth="44" fill="none" strokeLinecap="round" />
      <path d={armR} stroke={shirt} strokeWidth="32" fill="none" strokeLinecap="round" />
      <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} rx={bodyW / 2.4} fill={`url(#shade-${shirt.slice(1)})`} stroke={LINE} strokeWidth="7" />
      <path d={`M ${cx - 34} ${bodyTop + 2} L ${cx} ${bodyTop + 40} L ${cx + 34} ${bodyTop + 2}`} fill="#fff" stroke={LINE} strokeWidth="5" />
      {/* 頭 */}
      <g transform={`translate(${cx} ${headY})`}>
        <ellipse cx={-headR + 4} cy="6" rx="14" ry="20" fill="url(#skin)" stroke={LINE} strokeWidth="5" />
        <ellipse cx={headR - 4} cy="6" rx="14" ry="20" fill="url(#skin)" stroke={LINE} strokeWidth="5" />
        <ellipse rx={headR} ry={headR * 1.02} fill="url(#skin)" stroke={LINE} strokeWidth="7" />
        {/* 髪（前髪の束） */}
        <path
          d={`M ${-headR - 6} 4 Q ${-headR - 10} ${-headR * 1.25} 0 ${-headR * 1.14} Q ${headR + 10} ${-headR * 1.25} ${headR + 6} 4 Q ${headR * 0.7} ${-headR * 0.55} ${headR * 0.3} ${-headR * 0.45} L ${headR * 0.18} ${-headR * 0.2} L 0 ${-headR * 0.5} L ${-headR * 0.25} ${-headR * 0.22} L ${-headR * 0.42} ${-headR * 0.5} Q ${-headR * 0.8} ${-headR * 0.45} ${-headR - 6} 4 Z`}
          fill={hair}
          stroke={LINE}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d={`M ${-headR * 0.5} ${-headR * 0.95} Q ${-headR * 0.1} ${-headR * 1.08} ${headR * 0.3} ${-headR * 0.98}`} stroke="#fff" strokeWidth="6" opacity="0.35" fill="none" strokeLinecap="round" />
        <g transform={`translate(0 ${headR * 0.12})`}>
          <Brows e={expression} />
          <Eyes e={expression} />
          <Mouth e={expression} />
          <Extras e={expression} />
        </g>
      </g>
    </svg>
  );
};
