// ヒト図鑑のサムネ（二面対比）。社長方針：左右分割＋左右ラベル＋問いのコピー、イラスト調可（channels/hito-zukan/CHANNEL.md）。
// 主役は自作 SVG の架空の人物（顔は簡略化し、実在の人物に見せない）。フォントは OFL（Noto Sans JP 900）。
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Character, EpisodeScript, ThumbDraft, ThumbProp} from './types';
import {HitoCharacter} from './HitoCharacter';

const font = '"Noto Sans JP", sans-serif';
const serif = '"Noto Serif JP", serif';
const RED = '#8f1d22';
const NAVY = '#1b3474';
const YELLOW = '#ffd400';

const outline = (w: number, color = '#000') =>
  Array.from({length: 24}, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return `${(Math.cos(a) * w).toFixed(1)}px ${(Math.sin(a) * w).toFixed(1)}px 0 ${color}`;
  }).join(',');

// 背景：部屋の光（暖色の窓／寒色の夜）。左右で明暗・色温度を変える
const Room: React.FC<{mood: 'warm' | 'cool' | 'dim'; side: 'left' | 'right'}> = ({mood, side}) => {
  const bg =
    mood === 'warm'
      ? 'radial-gradient(circle at 50% 35%, #ffe2b0 0%, #f0a865 38%, #7a3f22 100%)'
      : mood === 'cool'
        ? 'radial-gradient(circle at 50% 35%, #cfe3ff 0%, #6f98d8 40%, #1c2f5c 100%)'
        : 'radial-gradient(circle at 50% 38%, #8a8fa8 0%, #444a66 45%, #15182a 100%)';
  return (
    <div style={{position: 'absolute', inset: 0, background: bg}}>
      {/* 窓枠のシルエット（場所が部屋だと分かる程度） */}
      <div style={{position: 'absolute', top: 70, [side === 'left' ? 'left' : 'right']: 40, width: 150, height: 190, border: '10px solid rgba(255,255,255,0.35)', borderRadius: 6}} />
      <div style={{position: 'absolute', top: 70, [side === 'left' ? 'left' : 'right']: 110, width: 10, height: 190, background: 'rgba(255,255,255,0.35)'}} />
    </div>
  );
};

const Figure: React.FC<{ch?: Character; shirt: string; mood: 'happy' | 'neutral' | 'worried'}> = ({ch, shirt, mood}) => {
  const build = ch?.build ?? 'adult';
  const w = build === 'round' ? 300 : build === 'slim' ? 180 : build === 'child' ? 190 : 220;
  const top = build === 'child' ? 150 : 90;
  const headR = build === 'child' ? 92 : 82;
  const bodyH = build === 'child' ? 300 : 380;
  const mouth =
    mood === 'happy' ? 'M -28 26 Q 0 50 28 26' : mood === 'worried' ? 'M -24 38 Q 0 22 24 38' : 'M -22 32 L 22 32';
  return (
    <svg width="520" height="620" viewBox="0 0 520 620">
      <ellipse cx="260" cy="605" rx={w * 0.7} ry="14" fill="rgba(0,0,0,0.3)" />
      <rect x={260 - w / 2} y={top + headR * 2 - 18} width={w} height={bodyH} rx={w / 2.3} fill={shirt} stroke="#1a1a1a" strokeWidth="6" />
      <g transform={`translate(260 ${top + headR})`}>
        <circle r={headR} fill="#f3d6bd" stroke="#1a1a1a" strokeWidth="6" />
        <path d={`M ${-headR} -8 Q 0 ${-headR * 1.45} ${headR} -8 Q ${headR * 0.6} ${-headR * 0.55} 0 ${-headR * 0.6} Q ${-headR * 0.6} ${-headR * 0.55} ${-headR} -8`} fill="#2b2420" />
        <circle cx="-28" cy="0" r="8" fill="#1a1a1a" />
        <circle cx="28" cy="0" r="8" fill="#1a1a1a" />
        {mood === 'worried' ? <path d="M -46 -12 L -16 -24 M 46 -12 L 16 -24" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" /> : null}
        <path d={mouth} stroke="#1a1a1a" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// 小道具（その回の状況が一瞬で分かるもの。企画にない要素は足さない）
const Prop: React.FC<{kind?: ThumbProp}> = ({kind}) => {
  if (!kind || kind === 'none') return null;
  const S = (p: {children: React.ReactNode}) => <svg width="260" height="200" viewBox="0 0 260 200">{p.children}</svg>;
  switch (kind) {
    case 'plate-big':
      return (
        <S>
          <ellipse cx="130" cy="150" rx="120" ry="34" fill="#fff" stroke="#1a1a1a" strokeWidth="6" />
          <path d="M 40 145 Q 130 10 220 145 Z" fill="#f2c14e" stroke="#1a1a1a" strokeWidth="6" />
        </S>
      );
    case 'plate':
      return (
        <S>
          <ellipse cx="130" cy="150" rx="100" ry="30" fill="#fff" stroke="#1a1a1a" strokeWidth="6" />
          <path d="M 75 146 Q 130 80 185 146 Z" fill="#f2c14e" stroke="#1a1a1a" strokeWidth="6" />
        </S>
      );
    case 'toast':
      return (
        <S>
          <rect x="60" y="60" width="140" height="120" rx="30" fill="#e8a95b" stroke="#1a1a1a" strokeWidth="6" />
          <rect x="80" y="82" width="100" height="80" rx="18" fill="#fbe3b3" />
        </S>
      );
    case 'coffee':
      return (
        <S>
          <rect x="80" y="70" width="100" height="110" rx="14" fill="#fff" stroke="#1a1a1a" strokeWidth="6" />
          <path d="M 180 95 Q 225 110 180 150" stroke="#1a1a1a" strokeWidth="6" fill="none" />
          <rect x="88" y="80" width="84" height="20" fill="#5a3418" />
        </S>
      );
    case 'phone':
      return (
        <S>
          <rect x="85" y="10" width="95" height="180" rx="16" fill="#222" stroke="#1a1a1a" strokeWidth="6" />
          <rect x="95" y="28" width="75" height="140" rx="6" fill="#7fd0ff" />
          <polygon points="122,80 122,118 150,99" fill="#fff" />
        </S>
      );
    case 'book':
      return (
        <S>
          <path d="M 30 50 L 130 70 L 230 50 L 230 170 L 130 190 L 30 170 Z" fill="#fff" stroke="#1a1a1a" strokeWidth="6" />
          <path d="M 130 70 L 130 190" stroke="#1a1a1a" strokeWidth="6" />
          <path d="M 50 85 L 115 98 M 50 115 L 115 128 M 145 98 L 210 85 M 145 128 L 210 115" stroke="#999" strokeWidth="6" />
        </S>
      );
    case 'shout':
      return (
        <S>
          <polygon points="20,30 240,20 220,150 150,140 110,195 105,140 30,150" fill="#fff" stroke="#c8202a" strokeWidth="9" />
          <text x="128" y="112" fontSize="86" fontWeight="900" textAnchor="middle" fill="#c8202a" fontFamily={font}>!!</text>
        </S>
      );
    case 'talk':
      return (
        <S>
          <ellipse cx="130" cy="85" rx="115" ry="70" fill="#fff" stroke="#1d3f9a" strokeWidth="8" />
          <path d="M 90 145 L 70 195 L 130 150" fill="#fff" stroke="#1d3f9a" strokeWidth="8" />
          <circle cx="90" cy="85" r="11" fill="#1d3f9a" /><circle cx="130" cy="85" r="11" fill="#1d3f9a" /><circle cx="170" cy="85" r="11" fill="#1d3f9a" />
        </S>
      );
    case 'family':
      return (
        <S>
          <circle cx="80" cy="70" r="34" fill="#f3d6bd" stroke="#1a1a1a" strokeWidth="6" />
          <rect x="45" y="104" width="70" height="90" rx="30" fill="#e2725b" stroke="#1a1a1a" strokeWidth="6" />
          <circle cx="175" cy="100" r="26" fill="#f3d6bd" stroke="#1a1a1a" strokeWidth="6" />
          <rect x="148" y="126" width="54" height="68" rx="24" fill="#6fa8dc" stroke="#1a1a1a" strokeWidth="6" />
        </S>
      );
    default:
      return null;
  }
};

const Label: React.FC<{text: string; color: string}> = ({text, color}) => (
  <div style={{background: `linear-gradient(${color}, ${color === RED ? '#6e0f14' : '#0d2156'})`, color: '#fff', fontFamily: serif, fontWeight: 900, fontSize: 52, padding: '4px 26px 8px', border: '4px solid #e9d9a6', borderRadius: 6, boxShadow: '0 6px 0 rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>{text}</div>
);

// 主コピー：極太ゴシック＋白フチ＋黒フチの二重フチ。highlight の語だけ黄色
const Copy: React.FC<{text: string; highlight?: string; color?: 'red' | 'yellow'; size: number}> = ({text, highlight, color = 'red', size}) => {
  const parts = highlight && text.includes(highlight) ? text.split(highlight) : [text];
  const base: React.CSSProperties = {fontFamily: font, fontWeight: 900, fontSize: size, lineHeight: 1.12, letterSpacing: -2, whiteSpace: 'nowrap', textShadow: `${outline(7, '#000')}, 0 10px 12px rgba(0,0,0,0.6)`};
  return (
    <div style={{...base, color: '#fff'}}>
      {parts.length === 1 ? (
        text
      ) : (
        <>
          {parts[0]}
          <span style={color === 'red' ? {color: '#ff2a2a', textShadow: `${outline(5, '#fff')}, ${outline(10, '#000')}, 0 10px 12px rgba(0,0,0,0.6)`} : {color: YELLOW}}>{highlight}</span>
          {parts[1]}
        </>
      )}
    </div>
  );
};

const Badge: React.FC<{text: string}> = ({text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, background: '#111', border: `6px solid ${YELLOW}`, borderRadius: 999, padding: '6px 26px 10px 16px'}}>
    <svg width="54" height="54" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="none" stroke={YELLOW} strokeWidth="4" />
      <path d="M20 9 V20 L28 25" stroke={YELLOW} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
    <span style={{fontFamily: font, fontWeight: 900, fontSize: 60, color: YELLOW}}>{text}</span>
  </div>
);

export const HitoThumbnail: React.FC<EpisodeScript & {draft?: ThumbDraft}> = (props) => {
  const d: ThumbDraft = props.draft ?? {id: 'final', ...props.thumbnail, composition: 'bottom'};
  const chars = props.characters;
  const comp = d.composition ?? 'bottom';
  const copyBlock = (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Copy text={d.line1} highlight={d.highlight} color={d.highlightColor} size={comp === 'center' ? 112 : 116} />
      {d.line2 ? <Copy text={d.line2} highlight={d.highlight} color={d.highlightColor} size={comp === 'center' ? 112 : 116} /> : null}
    </div>
  );
  const side = (s: 'left' | 'right') => {
    const ch = chars?.[s];
    const mood = (s === 'left' ? d.leftMood : d.rightMood) ?? (s === 'left' ? 'warm' : 'cool');
    const face = (s === 'left' ? d.leftFace : d.rightFace) ?? 'neutral';
    const prop = s === 'left' ? d.leftProp : d.rightProp;
    const img = s === 'left' ? d.leftImage : d.rightImage;
    const figTop = comp === 'top' ? 340 : 120;
    return (
      <div style={{position: 'relative', flex: 1, overflow: 'hidden'}}>
        <Room mood={mood} side={s} />
        {img ? <Img src={staticFile(img)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
        {img ? null : <div style={{position: 'absolute', left: 0, right: 0, top: figTop, display: 'flex', justifyContent: 'center', transform: 'scale(0.9)', transformOrigin: 'top center'}}>
          <HitoCharacter build={ch?.build} expression={face} shirt={s === 'left' ? '#e2725b' : '#5b93d6'} hair={s === 'left' ? '#3a2a22' : '#2a2522'} armPose={(s === 'left' ? d.leftArm : d.rightArm) ?? 'down'} longHair={ch?.hair === 'long'} size={600} />
        </div>}
        {img ? null : <div style={{position: 'absolute', left: s === 'left' ? 20 : undefined, right: s === 'right' ? 20 : undefined, top: comp === 'top' ? 420 : 300}}>
          <Prop kind={prop} />
        </div>}
        <div style={{position: 'absolute', top: comp === 'top' ? 280 : 22, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Label text={ch?.label ?? ''} color={s === 'left' ? RED : NAVY} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{display: 'flex', width: '100%', height: '100%'}}>
        {side('left')}
        <div style={{width: 12, background: '#fff', boxShadow: '0 0 24px #fff'}} />
        {side('right')}
      </div>
      {d.badge ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: comp === 'top' ? 380 : 128, display: 'flex', justifyContent: 'center'}}>
          <Badge text={d.badge} />
        </div>
      ) : null}
      {comp === 'top' ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 290, background: 'linear-gradient(#000 75%, transparent)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 6}}>
          {copyBlock}
        </div>
      ) : comp === 'center' ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', justifyContent: 'center'}}>{copyBlock}</div>
      ) : (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(transparent, rgba(0,0,0,0.92) 40%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 26, paddingRight: 140}}>
          {copyBlock}
        </div>
      )}
    </AbsoluteFill>
  );
};
