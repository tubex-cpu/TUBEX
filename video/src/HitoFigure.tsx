// ヒト図鑑の本編用の人物（自作 SVG）。社長指示 2026-11-28「棒人間はもっとオシャレに」→「もっと3Dに」。
// 全身・服装・髪型・表情つき。グラデーションの陰影・ハイライト・リムライト・落ち影で立体感を出す（3D 風）。
// 実在の人物に似せない。
import React, {useId} from 'react';
import {Character} from './types';

export type Face = 'neutral' | 'happy' | 'worried' | 'surprised' | 'sad';

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const SKIN = '#f6d2b4';

const FaceParts: React.FC<{face: Face; cx: number; cy: number; r: number; id: string}> = ({face, cx, cy, r, id}) => {
  const ex = r * 0.37, ey = cy + r * 0.08;
  const eye = (x: number) =>
    face === 'happy' ? (
      <path key={x} d={`M ${x - 7} ${ey + 2} Q ${x} ${ey - 8} ${x + 7} ${ey + 2}`} stroke="#2a1d18" strokeWidth="4" fill="none" strokeLinecap="round" />
    ) : (
      <g key={x}>
        <ellipse cx={x} cy={ey} rx={face === 'surprised' ? 8 : 7} ry={face === 'surprised' ? 9.5 : 8.5} fill="#fff" />
        <ellipse cx={x} cy={ey + 1} rx={face === 'surprised' ? 4.8 : 5.4} ry={face === 'surprised' ? 5.6 : 6.6} fill={`url(#${id}iris)`} />
        <circle cx={x + 2} cy={ey - 2.5} r="2.2" fill="#fff" />
        <circle cx={x - 2} cy={ey + 3} r="0.9" fill="#fff" opacity="0.8" />
        <path d={`M ${x - 8} ${ey - 5} Q ${x} ${ey - 11} ${x + 8} ${ey - 5}`} stroke="#2a1d18" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </g>
    );
  const brow =
    face === 'worried' || face === 'sad'
      ? `M ${cx - ex - 9} ${ey - 13} L ${cx - ex + 8} ${ey - 19} M ${cx + ex + 9} ${ey - 13} L ${cx + ex - 8} ${ey - 19}`
      : face === 'surprised'
        ? `M ${cx - ex - 9} ${ey - 20} Q ${cx - ex} ${ey - 26} ${cx - ex + 9} ${ey - 20} M ${cx + ex - 9} ${ey - 20} Q ${cx + ex} ${ey - 26} ${cx + ex + 9} ${ey - 20}`
        : `M ${cx - ex - 9} ${ey - 16} Q ${cx - ex} ${ey - 19} ${cx - ex + 8} ${ey - 17} M ${cx + ex - 8} ${ey - 17} Q ${cx + ex} ${ey - 19} ${cx + ex + 9} ${ey - 16}`;
  const my = cy + r * 0.52;
  const mouth =
    face === 'happy' ? <path d={`M ${cx - 11} ${my - 3} Q ${cx} ${my + 11} ${cx + 11} ${my - 3} Z`} fill="#a63a3a" />
    : face === 'surprised' ? <ellipse cx={cx} cy={my + 2} rx="5.5" ry="7" fill="#6e2626" />
    : face === 'sad' ? <path d={`M ${cx - 9} ${my + 5} Q ${cx} ${my - 4} ${cx + 9} ${my + 5}`} stroke="#5a2e28" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    : face === 'worried' ? <path d={`M ${cx - 9} ${my + 2} Q ${cx - 4} ${my - 3} ${cx} ${my + 1} Q ${cx + 5} ${my + 5} ${cx + 9} ${my}`} stroke="#5a2e28" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    : <path d={`M ${cx - 8} ${my} Q ${cx} ${my + 5} ${cx + 8} ${my}`} stroke="#5a2e28" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  return (
    <g>
      <path d={brow} stroke="#3a2a22" strokeWidth="4" fill="none" strokeLinecap="round" />
      {eye(cx - ex)}
      {eye(cx + ex)}
      {/* 鼻の陰影 */}
      <path d={`M ${cx + 1} ${cy + r * 0.2} Q ${cx + 6} ${cy + r * 0.34} ${cx} ${cy + r * 0.38}`} stroke="#d9a383" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx={cx - ex - 5} cy={ey + 15} rx="9" ry="5" fill="#f2897d" opacity={face === 'happy' ? 0.5 : 0.25} />
      <ellipse cx={cx + ex + 5} cy={ey + 15} rx="9" ry="5" fill="#f2897d" opacity={face === 'happy' ? 0.5 : 0.25} />
      {mouth}
    </g>
  );
};

export const HitoFigure: React.FC<{ch?: Character; main: string; face?: Face; t: number; size?: number}> = ({ch, main, face = 'neutral', t, size = 420}) => {
  const id = useId().replace(/:/g, '');
  const build = ch?.build ?? 'adult';
  const child = build === 'child';
  const longHair = ch?.hair === 'long';
  const bob = Math.sin(t / 20) * 3;
  // 寸法（座標系 300 x 520 のうち人物部分だけを表示）。size＝表示の高さ(px)
  const cx = 150;
  const headR = child ? 50 : 45;
  const headY = child ? 150 : 100;
  const shoulderY = headY + headR + (child ? 14 : 18);
  const torsoW = build === 'round' ? 150 : build === 'slim' ? 92 : child ? 96 : 112;
  const hipW = build === 'round' ? 140 : build === 'slim' ? 78 : child ? 88 : 98;
  const torsoH = child ? 120 : 150;
  const hipY = shoulderY + torsoH;
  const legH = child ? 120 : 165;
  const legW = build === 'round' ? 34 : 27;
  const belly = build === 'round' ? 22 : 4;
  const armW = child ? 24 : build === 'round' ? 32 : 27;
  const hairCol = '#3a2a22';
  const pants = shade(main, -0.3);
  const lLegX = cx - hipW / 2 + 6;
  const rLegX = cx + hipW / 2 - 6 - legW;
  const footY = hipY + legH;

  // 円柱に見せる横方向のグラデーション（左上から光）
  const cyl = (gid: string, base: string) => (
    <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={shade(base, -0.06)} />
      <stop offset="0.3" stopColor={shade(base, 0.12)} />
      <stop offset="0.55" stopColor={base} />
      <stop offset="0.9" stopColor={shade(base, -0.2)} />
      <stop offset="1" stopColor={shade(base, -0.12)} />
    </linearGradient>
  );

  const torsoPath = `M ${cx - torsoW / 2} ${shoulderY + 10}
      Q ${cx - torsoW / 2} ${shoulderY - 4} ${cx - torsoW / 2 + 16} ${shoulderY - 4}
      L ${cx + torsoW / 2 - 16} ${shoulderY - 4}
      Q ${cx + torsoW / 2} ${shoulderY - 4} ${cx + torsoW / 2} ${shoulderY + 10}
      Q ${cx + torsoW / 2 + belly} ${shoulderY + torsoH * 0.6} ${cx + hipW / 2} ${hipY}
      L ${cx - hipW / 2} ${hipY}
      Q ${cx - torsoW / 2 - belly} ${shoulderY + torsoH * 0.6} ${cx - torsoW / 2} ${shoulderY + 10} Z`;
  const armL = `M ${cx - torsoW / 2 + 10} ${shoulderY + 12} Q ${cx - torsoW / 2 - 16} ${shoulderY + 80} ${cx - torsoW / 2 - 6} ${shoulderY + torsoH - 8}`;
  const armR = `M ${cx + torsoW / 2 - 10} ${shoulderY + 12} Q ${cx + torsoW / 2 + 16} ${shoulderY + 80} ${cx + torsoW / 2 + 6} ${shoulderY + torsoH - 8}`;
  const hairPath = `M ${cx - headR - 3} ${headY + 6}
      Q ${cx - headR - 8} ${headY - headR * 1.25} ${cx} ${headY - headR * 1.12}
      Q ${cx + headR + 8} ${headY - headR * 1.25} ${cx + headR + 3} ${headY + 6}
      Q ${cx + headR * 0.8} ${headY - headR * 0.42} ${cx + headR * 0.18} ${headY - headR * 0.5}
      Q ${cx - headR * 0.2} ${headY - headR * 0.18} ${cx - headR * 0.58} ${headY - headR * 0.4}
      Q ${cx - headR * 0.88} ${headY - headR * 0.28} ${cx - headR - 3} ${headY + 6} Z`;

  return (
    <svg width={size * (230 / 450)} height={size} viewBox="35 40 230 450" style={{overflow: 'visible'}}>
      <defs>
        {cyl(`${id}jk`, main)}
        {cyl(`${id}arm`, shade(main, -0.05))}
        {cyl(`${id}leg`, pants)}
        <radialGradient id={`${id}skin`} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#ffe8d6" />
          <stop offset="0.55" stopColor={SKIN} />
          <stop offset="1" stopColor="#d9a07e" />
        </radialGradient>
        <radialGradient id={`${id}hand`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe3cf" />
          <stop offset="1" stopColor="#d79c7a" />
        </radialGradient>
        <linearGradient id={`${id}hair`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#5b4234" />
          <stop offset="0.5" stopColor={hairCol} />
          <stop offset="1" stopColor="#1c1410" />
        </linearGradient>
        <radialGradient id={`${id}iris`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#6b4a36" />
          <stop offset="1" stopColor="#1e1410" />
        </radialGradient>
        <linearGradient id={`${id}shoe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a4a38" />
          <stop offset="1" stopColor="#22160f" />
        </linearGradient>
        <linearGradient id={`${id}shirt`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d9dde6" />
        </linearGradient>
        <linearGradient id={`${id}tie`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e05a4f" />
          <stop offset="1" stopColor="#9c2b26" />
        </linearGradient>
        {/* 胴体の下側に落ちる陰（アンビエントオクルージョン） */}
        <linearGradient id={`${id}ao`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`${id}floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="5" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 床の影 */}
      <ellipse cx={cx + 6} cy={footY + 6} rx={torsoW * 0.95} ry="16" fill={`url(#${id}floor)`} />

      <g transform={`translate(0 ${bob})`} filter={`url(#${id}soft)`}>
        {/* 脚 */}
        <rect x={lLegX} y={hipY - 8} width={legW} height={legH - 4} rx={legW / 2.2} fill={`url(#${id}leg)`} />
        <rect x={rLegX} y={hipY - 8} width={legW} height={legH - 4} rx={legW / 2.2} fill={`url(#${id}leg)`} />
        <rect x={rLegX} y={hipY - 8} width={legW} height={legH - 4} rx={legW / 2.2} fill="#000" opacity="0.12" />
        {/* 靴（つま先を前に） */}
        {[lLegX, rLegX].map((x, i) => (
          <g key={i}>
            <path d={`M ${x - 6} ${footY + 2} Q ${x - 8} ${footY - 14} ${x + legW / 2} ${footY - 15} Q ${x + legW + 8} ${footY - 14} ${x + legW + 6} ${footY + 2} Z`} fill={`url(#${id}shoe)`} />
            <ellipse cx={x + legW / 2 - 4} cy={footY - 10} rx={legW * 0.3} ry="3" fill="#fff" opacity="0.35" />
          </g>
        ))}
        {/* 長い髪（後ろ） */}
        {longHair ? <path d={`M ${cx - headR - 6} ${headY} Q ${cx - headR - 14} ${shoulderY + 70} ${cx - headR * 0.3} ${shoulderY + 60} L ${cx + headR * 0.3} ${shoulderY + 60} Q ${cx + headR + 14} ${shoulderY + 70} ${cx + headR + 6} ${headY} Z`} fill={`url(#${id}hair)`} /> : null}
        {/* 奥側の腕（右）：少し暗く */}
        <path d={armR} stroke={shade(main, -0.2)} strokeWidth={armW} fill="none" strokeLinecap="round" />
        <path d={armR} stroke={shade(main, -0.05)} strokeWidth={armW * 0.45} fill="none" strokeLinecap="round" opacity="0.6" transform="translate(-3 0)" />
        <circle cx={cx + torsoW / 2 + 6} cy={shoulderY + torsoH + 2} r={armW * 0.48} fill={`url(#${id}hand)`} />
        {/* 胴（ジャケット） */}
        <path d={torsoPath} fill={`url(#${id}jk)`} />
        <path d={torsoPath} fill={`url(#${id}ao)`} />
        {/* 胸のハイライト（光沢） */}
        <ellipse cx={cx - torsoW * 0.22} cy={shoulderY + torsoH * 0.3} rx={torsoW * 0.12} ry={torsoH * 0.22} fill="#fff" opacity="0.12" />
        {child ? null : longHair ? (
          <path d={`M ${cx - 20} ${shoulderY - 4} Q ${cx} ${shoulderY + 22} ${cx + 20} ${shoulderY - 4} Z`} fill={`url(#${id}shirt)`} />
        ) : (
          <>
            <path d={`M ${cx - 22} ${shoulderY - 4} L ${cx} ${shoulderY + 60} L ${cx + 22} ${shoulderY - 4} Z`} fill={`url(#${id}shirt)`} />
            <path d={`M ${cx - 6} ${shoulderY + 4} L ${cx + 6} ${shoulderY + 4} L ${cx + 9} ${shoulderY + 46} L ${cx} ${shoulderY + 58} L ${cx - 9} ${shoulderY + 46} Z`} fill={`url(#${id}tie)`} />
            <path d={`M ${cx - 6} ${shoulderY + 4} L ${cx + 6} ${shoulderY + 4} L ${cx + 4} ${shoulderY + 12} L ${cx - 4} ${shoulderY + 12} Z`} fill="#7d221e" />
            {/* 襟（ラペル）：表側は明るく、裏側は暗く */}
            <path d={`M ${cx - 22} ${shoulderY - 4} L ${cx - 5} ${shoulderY + 44} L ${cx - 17} ${shoulderY + 48} L ${cx - 30} ${shoulderY + 6} Z`} fill={shade(main, 0.1)} />
            <path d={`M ${cx + 22} ${shoulderY - 4} L ${cx + 5} ${shoulderY + 44} L ${cx + 17} ${shoulderY + 48} L ${cx + 30} ${shoulderY + 6} Z`} fill={shade(main, -0.14)} />
            {/* ボタン */}
            <circle cx={cx} cy={shoulderY + 74} r="3.6" fill={shade(main, -0.3)} />
            <circle cx={cx - 1} cy={shoulderY + 73} r="1.3" fill="#fff" opacity="0.5" />
          </>
        )}
        {/* 手前の腕（左）：光が当たる */}
        <path d={armL} stroke={shade(main, -0.08)} strokeWidth={armW} fill="none" strokeLinecap="round" />
        <path d={armL} stroke={shade(main, 0.14)} strokeWidth={armW * 0.4} fill="none" strokeLinecap="round" opacity="0.7" transform="translate(-3 0)" />
        <circle cx={cx - torsoW / 2 - 6} cy={shoulderY + torsoH + 2} r={armW * 0.48} fill={`url(#${id}hand)`} />
        {/* 首（顎の下に影） */}
        <rect x={cx - 11} y={headY + headR - 12} width="22" height="26" rx="8" fill="#e0ab8a" />
        <ellipse cx={cx} cy={headY + headR - 2} rx="13" ry="6" fill="#b97f60" opacity="0.6" />
        {/* 耳 */}
        <ellipse cx={cx - headR + 1} cy={headY + 6} rx="7" ry="10" fill="#e4b090" />
        <ellipse cx={cx + headR - 1} cy={headY + 6} rx="7" ry="10" fill="#d49c7c" />
        {/* 頭（球体の陰影） */}
        <circle cx={cx} cy={headY} r={headR} fill={`url(#${id}skin)`} />
        {/* 髪の落ち影 → 髪 → ツヤ */}
        <path d={hairPath} fill="#7a4a35" opacity="0.35" transform="translate(2 5)" />
        <path d={hairPath} fill={`url(#${id}hair)`} />
        <path d={`M ${cx - headR * 0.6} ${headY - headR * 0.85} Q ${cx - headR * 0.1} ${headY - headR * 1.05} ${cx + headR * 0.35} ${headY - headR * 0.92}`} stroke="#fff" strokeWidth="5" opacity="0.28" fill="none" strokeLinecap="round" />
        <FaceParts face={face} cx={cx} cy={headY} r={headR} id={id} />
        {/* リムライト（右側の輪郭に背景からの光） */}
        <path d={`M ${cx + headR * 0.75} ${headY - headR * 0.6} A ${headR} ${headR} 0 0 1 ${cx + headR * 0.6} ${headY + headR * 0.8}`} stroke="#bcd4ff" strokeWidth="2.5" fill="none" opacity="0.55" />
        <path d={`M ${cx + torsoW / 2 - 2} ${shoulderY + 14} Q ${cx + torsoW / 2 + belly} ${shoulderY + torsoH * 0.6} ${cx + hipW / 2 - 2} ${hipY - 4}`} stroke="#bcd4ff" strokeWidth="2.5" fill="none" opacity="0.4" />
      </g>
    </svg>
  );
};
