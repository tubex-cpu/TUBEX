// ヒト図鑑：研究と統計をもとにした架空の2人を、左右の二面対比で追うレイアウト。
// 映像の元データは episodes/<id>/script.json のみ（layout / chapter / left / right / bigNumber / source）。
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Character, EpisodeScript, Scene} from './types';

const font = '"Noto Sans JP", sans-serif';
const c = {
  bg1: '#0e1424',
  bg2: '#1b2540',
  ink: '#ffffff',
  sub: '#c8d0e6',
  gold: '#ffcf4a',
  red: '#b3262d',
  navy: '#1f3f8f',
  warm: '#3a2a1c',
  cool: '#17283f',
  neutralL: '#2a2f45',
  neutralR: '#22283c',
};
const stroke = (w: number, color = '#000') =>
  Array.from({length: 16}, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * w).toFixed(1)}px ${(Math.sin(a) * w).toFixed(1)}px 0 ${color}`;
  }).join(',');

const sideBg = (ch: Character | undefined, side: 'left' | 'right') => {
  const tone = ch?.tone ?? 'neutral';
  if (tone === 'warm') return c.warm;
  if (tone === 'cool') return c.cool;
  return side === 'left' ? c.neutralL : c.neutralR;
};

// 架空の人物のシンプルな図（顔は描き込まない＝特定の人に見せない）
const Person: React.FC<{build?: Character['build']; color: string; t: number; size?: number}> = ({build = 'adult', color, t, size = 420}) => {
  const bob = Math.sin(t / 18) * 4;
  const w = build === 'round' ? 150 : build === 'slim' ? 92 : build === 'child' ? 96 : 112;
  const h = build === 'child' ? 150 : 210;
  const head = build === 'child' ? 52 : 46;
  const top = build === 'child' ? 140 : 70;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <ellipse cx="200" cy="385" rx={w * 0.9} ry="10" fill="rgba(0,0,0,0.35)" />
      <g transform={`translate(0 ${bob})`}>
        <rect x={200 - w / 2} y={top + head * 2 - 6} width={w} height={h} rx={w / 2.2} fill={color} />
        <circle cx="200" cy={top + head} r={head} fill="#f1d9c4" />
        <path d={`M ${200 - head} ${top + head - 6} Q 200 ${top - head * 0.25} ${200 + head} ${top + head - 6} Q 200 ${top + 8} ${200 - head} ${top + head - 6}`} fill="#2b2622" />
      </g>
    </svg>
  );
};

const Chapter: React.FC<{text?: string}> = ({text}) =>
  text ? (
    <div style={{position: 'absolute', left: 60, top: 48, display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.45)', padding: '10px 26px 10px 18px', borderRadius: 999, border: `3px solid ${c.gold}`}}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="17" fill="none" stroke={c.gold} strokeWidth="4" />
        <path d="M20 9 V20 L28 25" stroke={c.gold} strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
      <span style={{fontSize: 44, fontWeight: 900, color: c.gold}}>{text}</span>
    </div>
  ) : null;

const Label: React.FC<{text: string; color: string}> = ({text, color}) => (
  <div style={{background: color, color: '#fff', fontWeight: 900, fontSize: 46, padding: '8px 28px', borderRadius: 10, border: '4px solid #fff', boxShadow: '0 6px 0 rgba(0,0,0,0.35)'}}>{text}</div>
);

const Headline: React.FC<{text: string; size?: number; appear: number}> = ({text, size = 76, appear}) => (
  <div
    style={{
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.25,
      whiteSpace: 'pre-line',
      textAlign: 'center',
      color: c.ink,
      textShadow: stroke(5),
      opacity: appear,
      transform: `translateY(${(1 - appear) * 30}px)`,
    }}
  >
    {text}
  </div>
);

const Duo: React.FC<{scene: Scene; chars: EpisodeScript['characters']; t: number; enter: number; textIn: number}> = ({scene, chars, t, enter, textIn}) => {
  const sides = (['left', 'right'] as const).map((side) => {
    const ch = chars?.[side];
    const st = scene[side];
    return (
      <div key={side} style={{flex: 1, position: 'relative', background: sideBg(ch, side), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 230}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.16), rgba(0,0,0,0.25) 70%)'}} />
        <div style={{position: 'relative', marginTop: 40}}>
          <Label text={ch?.label ?? ''} color={side === 'left' ? c.red : c.navy} />
        </div>
        <div style={{position: 'relative', transform: `scale(${0.85 + 0.15 * enter})`}}>
          <Person build={ch?.build} color={side === 'left' ? '#d9774a' : '#5b8fd9'} t={t + (side === 'left' ? 0 : 9)} size={400} />
        </div>
        <div style={{position: 'relative', fontSize: 40, fontWeight: 900, color: c.ink, textShadow: stroke(3)}}>{ch?.name}</div>
        {st?.caption ? (
          <div style={{position: 'relative', marginTop: 10, fontSize: 36, fontWeight: 500, color: c.sub, background: 'rgba(0,0,0,0.45)', padding: '6px 20px', borderRadius: 8, opacity: textIn}}>{st.caption}</div>
        ) : null}
      </div>
    );
  });
  return (
    <AbsoluteFill>
      <div style={{display: 'flex', width: '100%', height: '100%'}}>
        {sides[0]}
        <div style={{width: 10, background: '#fff', boxShadow: '0 0 30px rgba(255,255,255,0.6)'}} />
        {sides[1]}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, background: 'linear-gradient(transparent, rgba(0,0,0,0.85) 35%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 80px 30px'}}>
        <Headline text={scene.headline} size={66} appear={textIn} />
        {scene.body ? <div style={{marginTop: 8, fontSize: 32, color: c.sub, opacity: textIn}}>{scene.body}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const Fact: React.FC<{scene: Scene; chars: EpisodeScript['characters']; t: number; enter: number; textIn: number; numberPop: number}> = ({scene, chars, t, enter, textIn, numberPop}) => (
  <AbsoluteFill style={{padding: '150px 120px 90px', display: 'flex', flexDirection: 'column'}}>
    {chars ? (
      <div style={{position: 'absolute', right: 80, top: 250, display: 'flex', gap: 10, opacity: 0.9 * enter}}>
        {(['left', 'right'] as const).map((side) => (
          <div key={side} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{fontSize: 30, fontWeight: 900, color: '#fff', background: side === 'left' ? c.red : c.navy, padding: '4px 16px', borderRadius: 8}}>{chars[side].label}</div>
            <Person build={chars[side].build} color={side === 'left' ? '#d9774a' : '#5b8fd9'} t={t + (side === 'left' ? 0 : 9)} size={300} />
            <div style={{fontSize: 30, fontWeight: 900, textShadow: stroke(3)}}>{chars[side].name}</div>
          </div>
        ))}
      </div>
    ) : null}
    <div style={{alignSelf: 'flex-start', background: c.gold, color: c.bg1, fontWeight: 900, fontSize: 38, padding: '8px 26px', borderRadius: 999, transform: `translateX(${(1 - enter) * -200}px)`}}>{scene.kicker}</div>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26}}>
      {scene.bigNumber ? (
        <div style={{fontWeight: 900, fontSize: 180, color: c.gold, lineHeight: 1.05, textShadow: stroke(6), transform: `scale(${numberPop})`, transformOrigin: 'left center'}}>{scene.bigNumber}</div>
      ) : null}
      <div style={{fontWeight: 900, fontSize: scene.bigNumber ? 70 : 88, lineHeight: 1.3, whiteSpace: 'pre-line', textShadow: stroke(5), opacity: textIn}}>{scene.headline}</div>
      {scene.body ? <div style={{fontSize: 40, lineHeight: 1.6, color: c.sub, maxWidth: 1050, opacity: textIn}}>{scene.body}</div> : null}
    </div>
    {scene.source ? (
      <div style={{alignSelf: 'flex-start', fontSize: 28, color: c.sub, background: 'rgba(0,0,0,0.4)', padding: '8px 18px', borderRadius: 8, borderLeft: `6px solid ${c.gold}`}}>出典：{scene.source}</div>
    ) : null}
  </AbsoluteFill>
);

const TitleCard: React.FC<{scene: Scene; chars: EpisodeScript['characters']; t: number; textIn: number}> = ({scene, chars, t, textIn}) => (
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{display: 'flex', gap: 220, alignItems: 'flex-end'}}>
      {(['left', 'right'] as const).map((side) => (
        <div key={side} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
          <Label text={chars?.[side].label ?? ''} color={side === 'left' ? c.red : c.navy} />
          <Person build={chars?.[side].build} color={side === 'left' ? '#d9774a' : '#5b8fd9'} t={t + (side === 'left' ? 0 : 9)} size={360} />
          <div style={{fontSize: 40, fontWeight: 900, textShadow: stroke(3)}}>{chars?.[side].name}</div>
        </div>
      ))}
    </div>
    <div style={{marginTop: 30, padding: '0 100px'}}>
      <Headline text={scene.headline} size={78} appear={textIn} />
    </div>
    {scene.body ? <div style={{marginTop: 14, fontSize: 36, color: c.sub, opacity: textIn}}>{scene.body}</div> : null}
  </AbsoluteFill>
);

const Plain: React.FC<{scene: Scene; textIn: number}> = ({scene, textIn}) => (
  <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 140px'}}>
    <div style={{background: c.gold, color: c.bg1, fontWeight: 900, fontSize: 38, padding: '8px 26px', borderRadius: 999, marginBottom: 36}}>{scene.kicker}</div>
    <Headline text={scene.headline} size={86} appear={textIn} />
    {scene.body ? <div style={{marginTop: 34, fontSize: 40, lineHeight: 1.6, color: c.sub, textAlign: 'center', whiteSpace: 'pre-line', opacity: textIn}}>{scene.body}</div> : null}
    {scene.credit ? <div style={{position: 'absolute', bottom: 40, fontSize: 22, color: c.sub, opacity: 0.8}}>{scene.credit}</div> : null}
  </AbsoluteFill>
);

const HitoScene: React.FC<{scene: Scene; chars: EpisodeScript['characters']; durationInFrames: number}> = ({scene, chars, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  const numberPop = spring({frame: frame - 10, fps, config: {damping: 9, mass: 0.8}});
  const textIn = interpolate(frame, [6, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const fade = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const layout = scene.layout ?? 'fact';
  return (
    <AbsoluteFill style={{opacity: fade, fontFamily: font, color: c.ink}}>
      {layout === 'duo' ? <Duo scene={scene} chars={chars} t={frame} enter={enter} textIn={textIn} /> : null}
      {layout === 'fact' ? <Fact scene={scene} chars={chars} t={frame} enter={enter} textIn={textIn} numberPop={numberPop} /> : null}
      {layout === 'title' ? <TitleCard scene={scene} chars={chars} t={frame} textIn={textIn} /> : null}
      {layout === 'summary' || layout === 'outro' ? <Plain scene={scene} textIn={textIn} /> : null}
      <Chapter text={scene.chapter} />
    </AbsoluteFill>
  );
};

const NARRATION_LEAD_IN = 0.4; // keep in sync with LEAD_IN in scripts/make_audio.py

export const HitoEpisode: React.FC<EpisodeScript> = (props) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const total = props.scenes.reduce((s, sc) => s + Math.round(sc.seconds * fps), 0);
  let from = 0;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 30%, ${c.bg2}, ${c.bg1} 75%)`}}>
      {props.scenes.map((scene) => {
        const d = Math.round(scene.seconds * fps);
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={d} name={scene.id}>
            <HitoScene scene={scene} chars={props.characters} durationInFrames={d} />
            {scene.audio ? (
              <Sequence from={Math.round(NARRATION_LEAD_IN * fps)} name={`${scene.id}-voice`}>
                <Audio src={staticFile(scene.audio)} />
              </Sequence>
            ) : null}
          </Sequence>
        );
        from += d;
        return seq;
      })}
      {props.bgm ? <Audio src={staticFile(props.bgm)} volume={0.12} /> : null}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 8, width: `${(frame / Math.max(1, total)) * 100}%`, background: c.gold}} />
    </AbsoluteFill>
  );
};
