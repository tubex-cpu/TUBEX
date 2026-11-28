// ヒト図鑑の本編用の人物（自作 SVG・フラットイラスト）。社長指示 2026-11-28「棒人間はもっとオシャレに」。
// 全身・服装・髪型・表情つき。実在の人物に似せない。
import React from 'react';
import {Character} from './types';

export type Face = 'neutral' | 'happy' | 'worried' | 'surprised' | 'sad';

const SKIN = '#f4d3b8';
const SKIN_SHADE = '#e3b896';

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const FaceParts: React.FC<{face: Face; cx: number; cy: number; r: number}> = ({face, cx, cy, r}) => {
  const ex = r * 0.36, ey = cy + r * 0.05;
  const eye = (x: number) =>
    face === 'happy' ? (
      <path key={x} d={`M ${x - 7} ${ey + 2} Q ${x} ${ey - 7} ${x + 7} ${ey + 2}`} stroke="#2d2320" strokeWidth="4" fill="none" strokeLinecap="round" />
    ) : (
      <g key={x}>
        <ellipse cx={x} cy={ey} rx={face === 'surprised' ? 6.5 : 5.5} ry={face === 'surprised' ? 8 : 7} fill="#2d2320" />
        <circle cx={x + 2} cy={ey - 3} r="2" fill="#fff" />
      </g>
    );
  const brow =
    face === 'worried' || face === 'sad'
      ? `M ${cx - ex - 9} ${ey - 13} L ${cx - ex + 8} ${ey - 19} M ${cx + ex + 9} ${ey - 13} L ${cx + ex - 8} ${ey - 19}`
      : face === 'surprised'
        ? `M ${cx - ex - 9} ${ey - 20} Q ${cx - ex} ${ey - 26} ${cx - ex + 9} ${ey - 20} M ${cx + ex - 9} ${ey - 20} Q ${cx + ex} ${ey - 26} ${cx + ex + 9} ${ey - 20}`
        : `M ${cx - ex - 9} ${ey - 16} L ${cx - ex + 8} ${ey - 17} M ${cx + ex - 8} ${ey - 17} L ${cx + ex + 9} ${ey - 16}`;
  const my = cy + r * 0.48;
  const mouth =
    face === 'happy' ? <path d={`M ${cx - 12} ${my - 3} Q ${cx} ${my + 11} ${cx + 12} ${my - 3} Z`} fill="#b5413f" />
    : face === 'surprised' ? <ellipse cx={cx} cy={my + 2} rx="6" ry="8" fill="#7a2a2a" />
    : face === 'sad' ? <path d={`M ${cx - 10} ${my + 5} Q ${cx} ${my - 4} ${cx + 10} ${my + 5}`} stroke="#2d2320" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    : face === 'worried' ? <path d={`M ${cx - 10} ${my + 2} Q ${cx - 4} ${my - 3} ${cx} ${my + 1} Q ${cx + 5} ${my + 5} ${cx + 10} ${my}`} stroke="#2d2320" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    : <path d={`M ${cx - 8} ${my} Q ${cx} ${my + 4} ${cx + 8} ${my}`} stroke="#2d2320" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  return (
    <g>
      <path d={brow} stroke="#3a2a22" strokeWidth="4" fill="none" strokeLinecap="round" />
      {eye(cx - ex)}
      {eye(cx + ex)}
      {face === 'happy' ? (
        <>
          <ellipse cx={cx - ex - 6} cy={ey + 15} rx="9" ry="5" fill="#f08a80" opacity="0.45" />
          <ellipse cx={cx + ex + 6} cy={ey + 15} rx="9" ry="5" fill="#f08a80" opacity="0.45" />
        </>
      ) : null}
      {mouth}
    </g>
  );
};

export const HitoFigure: React.FC<{ch?: Character; main: string; face?: Face; t: number; size?: number}> = ({ch, main, face = 'neutral', t, size = 420}) => {
  const build = ch?.build ?? 'adult';
  const child = build === 'child';
  const longHair = ch?.hair === 'long';
  const bob = Math.sin(t / 20) * 3;
  // 寸法（座標系 300 x 520 のうち人物部分だけを表示）。size＝表示の高さ(px)
  const cx = 150;
  const headR = child ? 46 : 38;
  const headY = child ? 150 : 92;
  const shoulderY = headY + headR + (child ? 14 : 18);
  const torsoW = build === 'round' ? 150 : build === 'slim' ? 92 : child ? 96 : 112;
  const hipW = build === 'round' ? 140 : build === 'slim' ? 78 : child ? 88 : 98;
  const torsoH = child ? 120 : 150;
  const hipY = shoulderY + torsoH;
  const legH = child ? 120 : 165;
  const legW = build === 'round' ? 34 : 26;
  const jacket = main;
  const jacketDark = shade(main, -0.12);
  const pants = shade(main, -0.32);
  const hairCol = '#2e2420';
  const belly = build === 'round' ? 22 : 4;

  return (
    <svg width={size * (230 / 450)} height={size} viewBox="35 40 230 450">
      <ellipse cx={cx} cy={hipY + legH + 12} rx={torsoW * 0.75} ry="10" fill="rgba(0,0,0,0.28)" />
      <g transform={`translate(0 ${bob})`}>
        {/* 脚と靴 */}
        <rect x={cx - hipW / 2 + 6} y={hipY - 6} width={legW} height={legH} rx={legW / 2.4} fill={pants} />
        <rect x={cx + hipW / 2 - 6 - legW} y={hipY - 6} width={legW} height={legH} rx={legW / 2.4} fill={shade(pants, -0.05)} />
        <path d={`M ${cx - hipW / 2 + 4} ${hipY + legH - 12} h ${legW + 2} v 12 h ${-legW - 16} q 0 -12 14 -12 Z`} fill="#3b2a22" />
        <path d={`M ${cx + hipW / 2 - 4} ${hipY + legH - 12} h ${-legW - 2} v 12 h ${legW + 16} q 0 -12 -14 -12 Z`} fill="#3b2a22" />
        {/* 長い髪（後ろ） */}
        {longHair ? <path d={`M ${cx - headR - 6} ${headY} Q ${cx - headR - 14} ${shoulderY + 70} ${cx - headR * 0.3} ${shoulderY + 60} L ${cx + headR * 0.3} ${shoulderY + 60} Q ${cx + headR + 14} ${shoulderY + 70} ${cx + headR + 6} ${headY} Z`} fill={hairCol} /> : null}
        {/* 腕 */}
        <path d={`M ${cx - torsoW / 2 + 8} ${shoulderY + 14} Q ${cx - torsoW / 2 - 18} ${shoulderY + 80} ${cx - torsoW / 2 - 6} ${shoulderY + torsoH - 6}`} stroke={jacketDark} strokeWidth={child ? 24 : 28} fill="none" strokeLinecap="round" />
        <path d={`M ${cx + torsoW / 2 - 8} ${shoulderY + 14} Q ${cx + torsoW / 2 + 18} ${shoulderY + 80} ${cx + torsoW / 2 + 6} ${shoulderY + torsoH - 6}`} stroke={jacketDark} strokeWidth={child ? 24 : 28} fill="none" strokeLinecap="round" />
        <circle cx={cx - torsoW / 2 - 6} cy={shoulderY + torsoH} r={child ? 11 : 12} fill={SKIN} />
        <circle cx={cx + torsoW / 2 + 6} cy={shoulderY + torsoH} r={child ? 11 : 12} fill={SKIN} />
        {/* 胴（ジャケット or 服） */}
        <path
          d={`M ${cx - torsoW / 2} ${shoulderY + 10}
              Q ${cx - torsoW / 2} ${shoulderY - 4} ${cx - torsoW / 2 + 16} ${shoulderY - 4}
              L ${cx + torsoW / 2 - 16} ${shoulderY - 4}
              Q ${cx + torsoW / 2} ${shoulderY - 4} ${cx + torsoW / 2} ${shoulderY + 10}
              Q ${cx + torsoW / 2 + belly} ${shoulderY + torsoH * 0.6} ${cx + hipW / 2} ${hipY}
              L ${cx - hipW / 2} ${hipY}
              Q ${cx - torsoW / 2 - belly} ${shoulderY + torsoH * 0.6} ${cx - torsoW / 2} ${shoulderY + 10} Z`}
          fill={jacket}
        />
        <path d={`M ${cx + torsoW * 0.12} ${shoulderY} L ${cx + torsoW / 2 - 6} ${shoulderY + 6} Q ${cx + torsoW / 2 + belly * 0.6} ${shoulderY + torsoH * 0.6} ${cx + hipW / 2 - 4} ${hipY} L ${cx + hipW * 0.18} ${hipY} Z`} fill={jacketDark} opacity="0.55" />
        {child ? null : (
          <>
            {/* シャツとネクタイ（大人）／襟（女性は丸首） */}
            {longHair ? (
              <path d={`M ${cx - 20} ${shoulderY - 4} Q ${cx} ${shoulderY + 22} ${cx + 20} ${shoulderY - 4} Z`} fill="#fbf7f2" />
            ) : (
              <>
                <path d={`M ${cx - 22} ${shoulderY - 4} L ${cx} ${shoulderY + 58} L ${cx + 22} ${shoulderY - 4} Z`} fill="#fbf7f2" />
                <path d={`M ${cx - 6} ${shoulderY + 6} L ${cx + 6} ${shoulderY + 6} L ${cx + 9} ${shoulderY + 46} L ${cx} ${shoulderY + 58} L ${cx - 9} ${shoulderY + 46} Z`} fill="#c2413a" />
                <path d={`M ${cx - 22} ${shoulderY - 4} L ${cx - 6} ${shoulderY + 40} L ${cx - 16} ${shoulderY + 44} Z M ${cx + 22} ${shoulderY - 4} L ${cx + 6} ${shoulderY + 40} L ${cx + 16} ${shoulderY + 44} Z`} fill={jacketDark} />
              </>
            )}
          </>
        )}
        {/* 首と頭 */}
        <rect x={cx - 11} y={headY + headR - 10} width="22" height="24" rx="8" fill={SKIN_SHADE} />
        <ellipse cx={cx - headR + 2} cy={headY + 4} rx="7" ry="10" fill={SKIN_SHADE} />
        <ellipse cx={cx + headR - 2} cy={headY + 4} rx="7" ry="10" fill={SKIN_SHADE} />
        <circle cx={cx} cy={headY} r={headR} fill={SKIN} />
        {/* 前髪 */}
        <path
          d={`M ${cx - headR - 2} ${headY + 4}
              Q ${cx - headR - 6} ${headY - headR * 1.2} ${cx} ${headY - headR * 1.08}
              Q ${cx + headR + 6} ${headY - headR * 1.2} ${cx + headR + 2} ${headY + 4}
              Q ${cx + headR * 0.75} ${headY - headR * 0.45} ${cx + headR * 0.15} ${headY - headR * 0.5}
              Q ${cx - headR * 0.2} ${headY - headR * 0.2} ${cx - headR * 0.55} ${headY - headR * 0.42}
              Q ${cx - headR * 0.85} ${headY - headR * 0.3} ${cx - headR - 2} ${headY + 4} Z`}
          fill={hairCol}
        />
        <path d={`M ${cx - headR * 0.5} ${headY - headR * 0.9} Q ${cx} ${headY - headR * 1.02} ${cx + headR * 0.45} ${headY - headR * 0.88}`} stroke="#fff" strokeWidth="4" opacity="0.25" fill="none" strokeLinecap="round" />
        <FaceParts face={face} cx={cx} cy={headY} r={headR} />
      </g>
    </svg>
  );
};
