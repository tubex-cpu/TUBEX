import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {DarkBoard, SceneProps, StepCard, Still, WhiteStudio, seg} from './kit';
import {WHITE} from './mode';
import {K, MascotOverlay, PersonIcon, Phone, Pop, clamp} from './ui';

// ep004 ルッキズム. No real faces: every "photo" is a faceless silhouette. No thin bodies, no weights, no body comparisons.
export const LT = (T: SceneProps['T'], id: string, k: number, c = 0) => T(`${id}_${k}`, c);
export const tint = (c: string, a: number) => <AbsoluteFill style={{background: c, opacity: a, mixBlendMode: 'multiply'}} />;
const TXT = (s: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, textShadow: WHITE ? '0 3px 14px rgba(255,255,255,0.9)' : '0 4px 22px rgba(0,0,0,0.85)', ...s});
const SOFTRED = WHITE ? '#c0392b' : '#ff7a64', HIP = WHITE ? '#1d2230' : '#e3e6ee', LOP = WHITE ? '#b9c0cc' : '#55607a';
const Vig: React.FC = () => (WHITE ? null : <Vignette />);

// faceless portrait card (blurred head-and-shoulders silhouette)
export const FaceCard: React.FC<{w?: number; hue?: number; glow?: number; dim?: number; label?: string; light?: boolean}> = ({w = 220, hue = 220, glow = 0, dim = 0, label, light = false}) => (
  <div style={{width: w, textAlign: 'center', fontFamily: FONT}}>
    <div style={{width: w, height: w * 1.25, borderRadius: 14, overflow: 'hidden', position: 'relative', background: `linear-gradient(170deg, hsl(${hue},28%,${light ? 82 : 34}%), hsl(${hue + 30},22%,${light ? 68 : 20}%))`,
      boxShadow: glow > 0 ? `0 0 ${50 * glow}px rgba(255,214,120,${0.8 * glow}), 0 10px 30px rgba(0,0,0,0.3)` : '0 10px 30px rgba(0,0,0,0.3)', filter: `brightness(${1 + 0.35 * glow - 0.55 * dim}) saturate(${1 - 0.6 * dim})`}}>
      <svg width="100%" height="100%" viewBox="0 0 100 125" style={{position: 'absolute', inset: 0, filter: 'blur(1.6px)'}}>
        <ellipse cx="50" cy="50" rx="21" ry="25" fill={light ? 'rgba(60,66,80,0.55)' : 'rgba(10,12,18,0.6)'} />
        <path d="M 6 125 C 8 92 28 80 50 80 C 72 80 92 92 94 125 Z" fill={light ? 'rgba(60,66,80,0.55)' : 'rgba(10,12,18,0.6)'} />
      </svg>
    </div>
    {label && <div style={{marginTop: 12, fontSize: 32, fontWeight: 900, color: light ? '#1d2230' : K.ink}}>{label}</div>}
  </div>
);

// bathroom mirror, "you" seen from the shoulders down (no face)
export const Mirror: React.FC<{f: number; light?: number; hand?: boolean}> = ({f, light = 1, hand = true}) => (
  <AbsoluteFill style={{background: WHITE ? 'linear-gradient(180deg, #f1efeb, #dcd8d1)' : `linear-gradient(180deg, #2b3038, #1a1d23)`}}>
    <AbsoluteFill style={{backgroundImage: WHITE ? 'linear-gradient(rgba(0,0,0,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.05) 2px, transparent 2px)' : 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '120px 120px'}} />
    <div style={{position: 'absolute', left: 460, top: 70, width: 1000, height: 760, borderRadius: 26, border: '16px solid #c9c4ba', background: `linear-gradient(180deg, rgba(196,212,228,${0.55 * light}), rgba(120,136,156,${0.5 * light}))`, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
      <svg width="1000" height="760" viewBox="0 0 1000 760" style={{position: 'absolute', inset: 0}}>
        <path d="M 170 760 C 180 560 300 470 500 470 C 700 470 820 560 830 760 Z" fill="rgba(44,52,66,0.85)" />
        <rect x="430" y="380" width="140" height="110" rx="40" fill="rgba(44,52,66,0.85)" />
        <rect x="300" y="-60" width="400" height="440" rx="190" fill="rgba(36,42,54,0.9)" />
      </svg>
      {hand && <div style={{position: 'absolute', left: 520 + 30 * Math.sin(f / 6), top: 140 + 12 * Math.sin(f / 4), fontSize: 120, transform: 'rotate(-20deg)'}}>✋</div>}
      <AbsoluteFill style={{background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)'}} />
    </div>
    <div style={{position: 'absolute', left: 380, right: 380, top: 860, height: 220, borderRadius: '20px 20px 0 0', background: 'linear-gradient(180deg, #e8e4dc, #b8b3aa)'}} />
  </AbsoluteFill>
);

// matching-app card, swiped left
const SwipeCard: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = seg(f, at + 25, at + 40);
  return (
    <div style={{position: 'absolute', left: 760 - p * 900, top: 80, width: 400, transform: `rotate(${-p * 25}deg)`, opacity: 1 - p * 0.8}}>
      <div style={{padding: 18, borderRadius: 26, background: '#ffffff', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
        <FaceCard w={364} hue={330} light />
        <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 16, fontSize: 56}}><span style={{color: '#ff3b30'}}>✕</span><span style={{color: '#2ecc71'}}>♥</span></div>
      </div>
    </div>
  );
};

// photo editor with sliders
export const Editor: React.FC<{f: number; x?: number; y?: number; scale?: number}> = ({f, x = 660, y = 40, scale = 1}) => {
  const sliders = [['肌をなめらかに', 0], ['クマを消す', 40], ['輪郭を変える', 80]] as const;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 600, transform: `scale(${scale})`, transformOrigin: 'top left', borderRadius: 40, background: '#0f1117', border: '10px solid #2a2e38', padding: 24, fontFamily: FONT, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
      <div style={{display: 'flex', justifyContent: 'center', filter: `blur(${seg(f, 10, 120) * 2}px) brightness(${1 + seg(f, 10, 120) * 0.25})`}}><FaceCard w={380} hue={20} light /></div>
      {sliders.map(([t, d], i) => {
        const v = 0.15 + 0.75 * seg(f, 10 + d, 60 + d);
        return (
          <div key={i} style={{marginTop: 22}}>
            <div style={{fontSize: 26, fontWeight: 800, color: '#cfd6e6'}}>{t}</div>
            <div style={{position: 'relative', height: 10, borderRadius: 5, background: '#3a3f4c', marginTop: 10}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * 100}%`, borderRadius: 5, background: '#ff6fa0'}} />
              <div style={{position: 'absolute', left: `calc(${v * 100}% - 16px)`, top: -11, width: 32, height: 32, borderRadius: 16, background: '#fff'}} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Tag: React.FC<{f: number; at: number; text: string; x: number; y: number; color?: string; size?: number}> = ({f, at, text, x, y, color = K.gold, size = 44}) => (
  <Pop f={f} at={at} from="scale" style={{position: 'absolute', left: x, top: y, padding: '10px 24px', borderRadius: 14, background: 'rgba(12,14,20,0.85)', border: `3px solid ${color}`, color, fontSize: size, fontWeight: 900, fontFamily: FONT, whiteSpace: 'nowrap'}}>{text}</Pop>
);
export const Card: React.FC<{f: number; at: number; text: React.ReactNode; x?: number; y?: number; w?: number; color?: string; size?: number; light?: boolean}> = ({f, at, text, x = 0, y = 0, w = 800, color, size = 44, light = false}) => (
  <Pop f={f} at={at} style={{position: 'absolute', left: x, top: y, width: w, padding: '24px 34px', borderRadius: 18, background: light || WHITE ? 'rgba(255,255,255,0.94)' : 'rgba(16,20,30,0.88)', border: `2px solid ${color ?? (light || WHITE ? '#d8d4cc' : 'rgba(255,255,255,0.14)')}`, boxShadow: '0 14px 40px rgba(0,0,0,0.3)', fontFamily: FONT, fontSize: size, fontWeight: 900, color: color ?? (light || WHITE ? '#1d2230' : K.ink), lineHeight: 1.35}}>{text}</Pop>
);

// ============ 0. オープニング ============
const S00: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (k === 0 ? 0 : LT(T, 's00', k) - 8));
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k], ld = (k + 1 < cuts.length ? cuts[k + 1] : dur) - cuts[k];
  const body = (() => {
    switch (k) {
      case 0: return <><Mirror f={lf} /><Vig /></>;
      case 1: return (
        <DarkBoard>
          <div style={{position: 'absolute', left: 160, top: 90, display: 'flex', gap: 40}}>
            {[200, 30, 140, 260, 90].map((h, i) => <FaceCard key={i} w={250} hue={h} />)}
          </div>
          <Tag f={lf} at={12} text="だらしなさそう" x={180} y={420} color={SOFTRED} />
          <Tag f={lf} at={22} text="やさしそう" x={760} y={440} />
          <Tag f={lf} at={32} text="頭よさそう" x={1350} y={420} />
        </DarkBoard>
      );
      case 2: return <><Mirror f={lf} hand={false} /><Tag f={lf} at={10} text="あなたも 決めつけている" x={640} y={330} color={SOFTRED} size={60} /><Vig /></>;
      case 3: return <DarkBoard tint="#2a2030"><SwipeCard f={lf} at={0} /><Pop f={lf} at={30} style={TXT({top: 300, fontSize: 120, color: '#ff3b30'})}>1秒</Pop></DarkBoard>;
      case 4: return (
        <DarkBoard tint="#262a30">
          <div style={{position: 'absolute', left: 260, top: 160, display: 'flex', gap: 70}}>{[0, 1, 2, 3, 4].map((i) => <PersonIcon key={i} size={210} color={i === 2 ? HIP : LOP} />)}</div>
          <div style={{position: 'absolute', left: 200, right: 200, top: 420, height: 26, borderRadius: 8, background: '#3a3f4a'}} />
          <Pop f={lf} at={14} style={TXT({top: 520, fontSize: 70, color: K.gold})}>「この人には 勝てない」</Pop>
        </DarkBoard>
      );
      case 5: return <DarkBoard tint="#2a2230"><Editor f={lf} x={660} y={30} scale={0.95} /></DarkBoard>;
      case 6: return (
        <DarkBoard tint="#202a30">
          <Phone f={lf} x={700} y={30} scale={0.9} title="友達" msgs={[{from: 'them', text: '久しぶり！', at: 0, time: '12:10'}, {from: 'them', text: '痩せた？かわいくなったね', at: 8, time: '12:10'}]} />
        </DarkBoard>
      );
      default: return (
        <DarkBoard tint="#2a1e22">
          <Pop f={lf} at={4} style={TXT({top: 160, fontSize: 160})}>🍰🍟</Pop>
          <Pop f={lf} at={26} style={TXT({top: 420, fontSize: 84, color: SOFTRED})}>自分が 嫌になる</Pop>
        </DarkBoard>
      );
    }
  })();
  return <AbsoluteFill style={{background: WHITE ? '#f3f2ef' : '#000'}}><AbsoluteFill style={{opacity: interpolate(lf, [0, 6], [k === 0 ? 1 : 0, 1], clamp)}}>{body}</AbsoluteFill>{ld < 0 && null}</AbsoluteFill>;
};

const S01: React.FC<SceneProps> = ({f, T}) => {
  const term = f >= LT(T, 's01', 5) && f < LT(T, 's01', 7);
  const prom = f >= LT(T, 's01', 7) && f < LT(T, 's01', 12);
  const last = f >= LT(T, 's01', 12);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 120, top: 60, display: 'grid', gridTemplateColumns: 'repeat(8, 190px)', gap: 18, opacity: term || prom ? 0.25 : 0.9}}>
        {Array.from({length: 16}, (_, i) => <div key={i} style={{opacity: interpolate(f, [i * 3, i * 3 + 10], [0, 1], clamp)}}><FaceCard w={190} hue={(i * 47) % 360} light /></div>)}
      </div>
      {!term && !prom && !last && <MascotOverlay f={f} x={760} y={430} w={400} h={460} rotY={0.3 * Math.sin(f / 50)} tone="light" />}
      {term && (
        <>
          <Pop f={f} at={LT(T, 's01', 5)} from="scale" style={TXT({top: 250, fontSize: 150, color: '#c0392b', textShadow: '0 6px 30px rgba(255,255,255,0.8)'})}>ルッキズム</Pop>
          <Pop f={f} at={LT(T, 's01', 5, 2)} style={TXT({top: 470, fontSize: 64, color: '#1d2230', textShadow: 'none'})}>外見至上主義</Pop>
        </>
      )}
      {prom && (
        <div style={{position: 'absolute', left: 300, top: 110, width: 1320}}>
          {['見た目が 評価とお金と人生をどう変えるか', 'スマホの中で「自分の顔が嫌い」がどう作られるか', '今 日本で何が起きているか', 'そもそも「いい見た目」って何か'].map((t, i) => (
            <Card key={i} f={f} at={LT(T, 's01', 8 + i)} light x={0} y={i * 150} w={1320} size={46} text={<><span style={{color: '#c0392b'}}>{['一つ目', '二つ目', '三つ目', '四つ目'][i]}</span>　{t}</>} />
          ))}
        </div>
      )}
      {last && <><Mirror f={f} hand={false} /><Pop f={f} at={LT(T, 's01', 12) + 20} from="scale" style={{position: 'absolute', left: 1240, top: 160, width: 260, height: 260, borderRadius: 130, border: '10px solid #ff3b30', color: '#ff3b30', fontSize: 110, fontWeight: 900, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', background: 'rgba(10,10,14,0.4)'}}>点数</Pop><Vig /></>}
    </WhiteStudio>
  );
};

// ============ 1. チェック ============
const CHECK = ['写真をSNSに載せる前に 必ず加工する', '人の投稿を見て 自分の顔や体と比べてしまう', '「私 太ってる」「顔が大きい」と 自分の見た目の悪口を言う', '初めて会った人の性格を 見た目でだいたい決めている', '見た目のせいで 損をしていると感じたことがある'];
const S02: React.FC<SceneProps> = ({f}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 360, top: 470, width: 1200, height: 40, borderRadius: 10, background: '#cfc9bf'}} />
    <div style={{position: 'absolute', left: 420, top: 300, display: 'flex', gap: 40}}>
      {[0, 1, 2, 3, 4].map((i) => <Pop key={i} f={f} at={8 + i * 6} style={{width: 180, height: 170, borderRadius: 14, background: '#3a4256', boxShadow: '0 10px 24px rgba(0,0,0,0.25)', color: '#e8c46a', fontSize: 70, fontWeight: 900, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</Pop>)}
    </div>
    <MascotOverlay f={f} x={1500} y={300} w={360} h={420} rotY={-0.8} tone="light" />
  </WhiteStudio>
);
const S03: React.FC<SceneProps> = ({f, T}) => {
  const after = f >= LT(T, 's03', 5);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 200, top: 60, width: 1520}}>
        {CHECK.map((t, i) => {
          const at = LT(T, 's03', i);
          const hl = after && f >= LT(T, 's03', 7) && (i === 0 || i === 2);
          return (
            <Pop key={i} f={f} at={at} from="left" style={{marginBottom: 22, display: 'flex', alignItems: 'center', gap: 26, padding: '22px 34px', borderRadius: 18, background: hl ? '#fff1ee' : 'rgba(255,255,255,0.94)', border: `3px solid ${hl ? '#e0533d' : '#d8d4cc'}`, fontFamily: FONT}}>
              <div style={{width: 64, height: 64, borderRadius: 14, background: hl ? '#e0533d' : '#3a4256', color: '#fff', fontSize: 40, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              <div style={{fontSize: 44, fontWeight: 900, color: '#1d2230'}}>{t}</div>
            </Pop>
          );
        })}
      </div>
    </WhiteStudio>
  );
};

// ============ 2. 顔を見ただけで ============
const S04: React.FC<SceneProps> = ({f, T}) => {
  const app = f >= LT(T, 's04', 3) && f < LT(T, 's04', 4);
  const shop = f >= LT(T, 's04', 4);
  if (app) return <DarkBoard tint="#2a2030"><SwipeCard f={f} at={LT(T, 's04', 3)} /></DarkBoard>;
  if (shop) return (
    <DarkBoard tint="#2a2a24">
      <div style={{position: 'absolute', left: 520, top: 150, display: 'flex', gap: 240}}>
        <PersonIcon size={260} color={LOP} /><PersonIcon size={260} color={HIP} />
      </div>
      <Tag f={f} at={LT(T, 's04', 4) + 10} text="いらっしゃいませ…" x={420} y={500} color="#9fb0d0" size={40} />
      <Tag f={f} at={LT(T, 's04', 4) + 24} text="いらっしゃいませ！" x={1020} y={500} color={K.gold} size={40} />
      {f >= LT(T, 's04', 5) && <Pop f={f} at={LT(T, 's04', 5)} style={TXT({top: 640, fontSize: 70, color: SOFTRED})}>「どうせ顔でしょ」</Pop>}
    </DarkBoard>
  );
  return (
    <DarkBoard tint="#24303a">
      <div style={{position: 'absolute', left: 230, top: 170, display: 'flex', gap: 80}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{filter: 'blur(1px)'}}><PersonIcon size={230} color={i === 1 ? HIP : LOP} /></div>)}</div>
      <Tag f={f} at={LT(T, 's04', 1)} text="やさしそう" x={420} y={110} />
      <Tag f={f} at={LT(T, 's04', 1, 1)} text="仕事ができそう" x={820} y={110} />
      <Tag f={f} at={LT(T, 's04', 1, 2)} text="ちょっと怖そう" x={1260} y={110} color={SOFTRED} />
      <Pop f={f} at={LT(T, 's04', 2)} style={TXT({top: 520, fontSize: 64, color: K.ink})}>まだ一言も 話していない</Pop>
    </DarkBoard>
  );
};
const S05: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 1080, top: 120, display: 'flex', gap: 30}}>
      {[40, 200, 300].map((h, i) => <FaceCard key={i} w={230} hue={h} light />)}
    </div>
    <div style={{position: 'absolute', left: 1080, top: 460, width: 750, padding: 26, borderRadius: 14, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', fontFamily: FONT, fontSize: 30, fontWeight: 800, color: '#556'}}>
      性格は？　仕事は？　結婚は？　幸せになる？
    </div>
    <StepCard f={f} at={LT(T, 's05', 2)} n="手順1" text="卒業アルバムの写真を 見た目で三つに分ける" x={110} y={140} w={900} light />
    <StepCard f={f} at={LT(T, 's05', 3)} n="手順2" text="何も知らない大学生に 写真を見せる" x={110} y={310} w={900} light />
    <StepCard f={f} at={LT(T, 's05', 4)} n="手順3" text="性格と人生を 予想してもらう" x={110} y={480} w={900} light />
  </WhiteStudio>
);
const S06: React.FC<SceneProps> = ({f, T}) => {
  const meta = f >= LT(T, 's06', 4);
  if (meta) return (
    <DarkBoard>
      <Card f={f} at={LT(T, 's06', 6)} x={260} y={110} w={1400} text="誰が魅力的かは 評価する人どうしで かなり一致" />
      <Card f={f} at={LT(T, 's06', 6, 1)} x={260} y={270} w={1400} text="国や文化が違っても かなり一致" />
      <Card f={f} at={LT(T, 's06', 7)} x={260} y={430} w={1400} color={SOFTRED} text="魅力的な人は 子どもでも大人でも よく扱われる" />
    </DarkBoard>
  );
  const cols = [['魅力的', 300, 1], ['普通', 210, 0], ['魅力的でない', 40, -1]] as const;
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 250, top: 60, display: 'flex', gap: 140}}>
        {cols.map(([l, h, g], i) => (
          <div key={i} style={{width: 330, textAlign: 'center'}}>
            <FaceCard w={260} hue={h} glow={g > 0 && f >= LT(T, 's06', 1) ? 1 : 0} dim={g < 0 && f >= LT(T, 's06', 1) ? 0.7 : 0} />
            <div style={{fontSize: 36, fontWeight: 900, marginTop: 10, fontFamily: FONT}}>{l}</div>
            {g > 0 && f >= LT(T, 's06', 1) && <Pop f={f} at={LT(T, 's06', 1, 1)} style={{marginTop: 10, fontSize: 32, fontWeight: 900, color: K.gold, fontFamily: FONT}}>性格◎ 仕事◎ 結婚◎ 幸せ◎</Pop>}
          </div>
        ))}
      </div>
      {f >= LT(T, 's06', 3) && <Pop f={f} at={LT(T, 's06', 3)} from="scale" style={{...TXT({top: 640, fontSize: 70, color: K.gold})}}>「美しいものは良い」</Pop>}
    </DarkBoard>
  );
};
const S07: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 140, top: 90, display: 'flex', gap: 24}}>{[10, 80, 150, 220, 290, 330, 30].map((h, i) => <FaceCard key={i} w={210} hue={h} light />)}</div>
    <MascotOverlay f={f} x={1380} y={400} w={400} h={460} rotY={3.1} tone="light" />
    {f >= LT(T, 's07', 2) && <Pop f={f} at={LT(T, 's07', 2)} style={TXT({top: 470, left: 120, right: 'auto', width: 1200, fontSize: 80, color: '#c0392b', textShadow: '0 4px 20px rgba(255,255,255,0.9)'})}>かなり深刻な状態</Pop>}
  </WhiteStudio>
);

// ============ 3. 先生も 面接官も 裁判も ============
const Report: React.FC<{hue: number; glow: number; dim: number; mark?: string; markColor?: string}> = ({hue, glow, dim, mark, markColor}) => (
  <div style={{width: 560, padding: 28, borderRadius: 14, background: '#fbfaf6', boxShadow: '0 16px 40px rgba(0,0,0,0.35)', fontFamily: FONT, color: '#1d2230', position: 'relative'}}>
    <div style={{display: 'flex', gap: 24}}>
      <FaceCard w={150} hue={hue} glow={glow} dim={dim} light />
      <div style={{flex: 1, fontSize: 26, fontWeight: 800, lineHeight: 1.9}}>
        <div style={{fontSize: 30, fontWeight: 900}}>通知表</div>
        <div>国語 ◎　算数 ○</div><div>欠席 2日</div><div style={{color: '#667'}}>よくがんばっています</div>
      </div>
    </div>
    {mark && <div style={{position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 18, textAlign: 'center', fontSize: 44, fontWeight: 900, color: markColor}}>{mark}</div>}
  </div>
);
const S08: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's08', 7);
  const paired = f >= LT(T, 's08', 4);
  return (
    <DarkBoard tint="#2c2a24">
      {!paired ? (
        <>
          <div style={{position: 'absolute', left: 1080, top: 160, transform: 'rotate(4deg)'}}><Report hue={40} glow={0} dim={0} /></div>
          {f >= LT(T, 's08', 3) && <StepCard f={f} at={LT(T, 's08', 3)} n="手順1" text="中身がまったく同じ 通知表を用意" x={110} y={200} w={860} />}
          {f < LT(T, 's08', 1) && <Pop f={f} at={6} style={TXT({top: 260, left: 100, right: 'auto', width: 900, fontSize: 60, color: K.gold})}>先生のお気に入り</Pop>}
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 140, top: 70}}><Report hue={30} glow={res ? 0.8 : 0} dim={0} mark={res ? '頭がいい・うまくやれる' : undefined} markColor="#e8c46a" /></div>
          <div style={{position: 'absolute', left: 1220, top: 70}}><Report hue={220} glow={0} dim={res ? 0.6 : 0} mark={res ? '△' : undefined} markColor="#9aa3b5" /></div>
          {!res && <StepCard f={f} at={LT(T, 's08', 4)} n="手順2" text="違うのは 貼った顔写真だけ" x={510} y={450} w={900} />}
          {!res && f >= LT(T, 's08', 5) && <StepCard f={f} at={LT(T, 's08', 5)} n="手順3" text="先生に 頭のよさと学校生活を見積もってもらう" x={360} y={590} w={1200} />}
          {res && <Pop f={f} at={LT(T, 's08', 8)} style={TXT({top: 520, fontSize: 64, color: SOFTRED})}>子どもは 自分の顔を選べない</Pop>}
        </>
      )}
    </DarkBoard>
  );
};
const S09: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#24282e">
    <div style={{position: 'absolute', left: 0, right: 0, top: 540, height: 400, background: 'linear-gradient(180deg, #4a3c30, #2a2018)'}} />
    <div style={{position: 'absolute', left: 1250, top: 380, width: 420, height: 300, borderRadius: 6, background: '#f6f4ef', transform: 'rotate(-6deg)', padding: 24, fontFamily: FONT, color: '#334', fontSize: 26, fontWeight: 800, boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}}>履歴書<div style={{marginTop: 14, height: 10, background: '#ccd', width: 300}} /><div style={{marginTop: 14, height: 10, background: '#ccd', width: 340}} /><div style={{marginTop: 14, height: 10, background: '#ccd', width: 260}} /></div>
    <Card f={f} at={LT(T, 's09', 2)} x={120} y={80} w={1000} text="採用でも 仕事の評価でも 有利" />
    <Card f={f} at={LT(T, 's09', 3)} x={120} y={230} w={1000} color={SOFTRED} text="人事のプロも 学生と同じくらい 引っ張られる" />
    <Card f={f} at={LT(T, 's09', 4)} x={120} y={380} w={1000} size={38} text="最近の研究ほど弱まった でも なくならない" />
  </DarkBoard>
);
const S10: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <Pop f={f} at={LT(T, 's10', 1)} style={TXT({top: 110, fontSize: 48, color: '#1d2230', textShadow: 'none'})}>見た目が平均より劣ると評価された人の収入</Pop>
    <Pop f={f} at={LT(T, 's10', 1, 1)} from="scale" style={TXT({top: 220, fontSize: 220, color: '#c0392b', textShadow: '0 6px 30px rgba(255,255,255,0.8)'})}>5〜10％低い</Pop>
    <Pop f={f} at={LT(T, 's10', 2)} style={TXT({top: 520, fontSize: 44, color: '#1d2230', textShadow: 'none'})}>得をする分より 損をする分のほうが 少し大きい</Pop>
  </WhiteStudio>
);
const S11: React.FC<SceneProps> = ({f, T}) => {
  const self = f >= LT(T, 's11', 6);
  if (self) return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f - LT(T, 's11', 6)} dur={300} dark={0.75} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 58% 38%, rgba(110,160,255,0.3) 0%, rgba(0,0,0,0) 45%)', mixBlendMode: 'screen'}} />
      <Pop f={f} at={LT(T, 's11', 7)} style={TXT({top: 300, fontSize: 76, color: SOFTRED})}>一番きつい点数をつけているのは あなた</Pop>
      <Vig />
    </AbsoluteFill>
  );
  return (
    <DarkBoard tint="#2a2420">
      <div style={{position: 'absolute', left: 560, top: 70, width: 800, height: 150, borderRadius: 10, background: 'linear-gradient(180deg, #5a4430, #3a2a1c)'}} />
      <div style={{position: 'absolute', left: 900, top: 20, fontSize: 110}}>⚖️</div>
      <div style={{position: 'absolute', left: 860, top: 260, filter: 'blur(1px)'}}><PersonIcon size={200} color={LOP} /></div>
      {Array.from({length: 2}, (_, r) => <div key={r} style={{position: 'absolute', left: 200, right: 200, top: 520 + r * 90, height: 40, borderRadius: 8, background: '#3a2c20'}} />)}
      <Card f={f} at={LT(T, 's11', 2)} x={160} y={240} w={620} text="見た目が魅力的な被告人ほど 軽い刑" color={K.gold} />
      {f >= LT(T, 's11', 3) && <Pop f={f} at={LT(T, 's11', 3)} from="scale" style={TXT({top: 300, left: 1080, right: 'auto', width: 800, fontSize: 80, color: '#ff3b30'})}>ヤバくないですか</Pop>}
    </DarkBoard>
  );
};

// ============ 4. 10分のSNS ============
const FLOAT = ['きれいな肌', '細い腕', '楽しそうな休日', '整った横顔', 'カフェで自撮り', 'ジムの帰り'];
const S12: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.78} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 58% 40%, rgba(110,160,255,${0.28 + 0.05 * Math.sin(f / 5)}) 0%, rgba(0,0,0,0) 48%)`, mixBlendMode: 'screen'}} />
    {FLOAT.map((t, i) => {
      const y = 700 - ((f * 1.6 + i * 150) % 900);
      return (
        <div key={i} style={{position: 'absolute', left: i % 2 ? 1160 : 260, top: y, width: 460, opacity: interpolate(y, [-200, 0, 500, 700], [0, 0.85, 0.85, 0], clamp), padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(2px)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: FONT}}>
          <div style={{height: 180, borderRadius: 12, background: `linear-gradient(135deg, hsl(${i * 55},60%,62%), hsl(${i * 55 + 40},60%,45%))`, filter: 'blur(3px)'}} />
          <div style={{marginTop: 10, fontSize: 28, fontWeight: 800, color: '#e8eefc'}}>{t}</div>
        </div>
      );
    })}
    <Vig />
  </AbsoluteFill>
);
const Monitor: React.FC<{label: string; c: string; icon: string}> = ({label, c, icon}) => (
  <div style={{width: 470, textAlign: 'center', fontFamily: FONT}}>
    <div style={{height: 280, borderRadius: 14, border: '14px solid #2a2f3a', background: `linear-gradient(160deg, ${c}, #1a1e28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110}}>{icon}</div>
    <div style={{width: 80, height: 40, margin: '0 auto', background: '#2a2f3a'}} />
    <div style={{marginTop: 10, fontSize: 34, fontWeight: 900}}>{label}</div>
  </div>
);
const S13: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 150, top: 60, display: 'flex', gap: 60}}>
      <Monitor label="自分のSNS" c="#c54b8c" icon="📱" /><Monitor label="ファッション雑誌のサイト" c="#b0855a" icon="👗" /><Monitor label="関係ないサイト" c="#4a7a6a" icon="🌿" />
    </div>
    <StepCard f={f} at={LT(T, 's13', 2)} n="手順1" text="くじで 三つのグループに分ける" x={110} y={500} w={830} />
    <StepCard f={f} at={LT(T, 's13', 3)} n="手順2" text="それぞれ 10分間 見る" x={980} y={500} w={830} />
    <StepCard f={f} at={LT(T, 's13', 6)} n="手順3" text="気分と 自分の見た目への気持ちを測る" x={360} y={640} w={1200} />
  </DarkBoard>
);
const S14: React.FC<SceneProps> = ({f, T}) => {
  const meta = f >= LT(T, 's14', 4);
  return (
    <WhiteStudio>
      {!meta ? (
        <>
          <div style={{position: 'absolute', left: 380, top: 110, display: 'flex', gap: 300, fontFamily: FONT, textAlign: 'center'}}>
            <Pop f={f} at={LT(T, 's14', 1)}><div style={{fontSize: 200}}>😐</div><div style={{fontSize: 40, fontWeight: 900}}>関係ないサイト</div></Pop>
            <Pop f={f} at={LT(T, 's14', 1, 1)}><div style={{fontSize: 200}}>😞</div><div style={{fontSize: 40, fontWeight: 900, color: '#c0392b'}}>SNS</div></Pop>
          </div>
          <Pop f={f} at={LT(T, 's14', 2)} style={TXT({top: 470, fontSize: 44, color: '#1d2230', textShadow: 'none'})}>比べがちな人ほど「こうなりたい自分」との差が大きい</Pop>
          {f >= LT(T, 's14', 3) && <Pop f={f} at={LT(T, 's14', 3)} from="scale" style={TXT({top: 560, fontSize: 90, color: '#c0392b', textShadow: '0 4px 24px rgba(255,255,255,0.9)'})}>たった10分</Pop>}
        </>
      ) : (
        <>
          <Pop f={f} at={LT(T, 's14', 4)} style={TXT({top: 130, fontSize: 70, color: '#1d2230', textShadow: 'none'})}>3万6千人以上のデータ</Pop>
          <Card f={f} at={LT(T, 's14', 4, 1)} light x={360} y={280} w={1200} text="SNSを使う人ほど 体や見た目の悩みが大きい" />
          <Card f={f} at={LT(T, 's14', 4, 3)} light x={360} y={430} w={1200} size={38} text="強い結びつきではない　でも はっきりある" />
        </>
      )}
    </WhiteStudio>
  );
};
const S15: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#1e2840">
    <MascotOverlay f={f} x={1380} y={380} w={400} h={460} rotY={-0.6} />
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 80% 60%, rgba(110,160,255,${0.18 + 0.05 * Math.sin(f / 4)}) 0%, rgba(0,0,0,0) 35%)`, mixBlendMode: 'screen'}} />
    <Pop f={f} at={LT(T, 's15', 1)} style={{position: 'absolute', left: 160, top: 160, fontFamily: FONT, fontSize: 90, fontWeight: 900, color: K.ink}}>10分 × 6 = <span style={{color: SOFTRED}}>1日1時間</span></Pop>
    <Pop f={f} at={LT(T, 's15', 1, 2)} style={{position: 'absolute', left: 160, top: 320, fontFamily: FONT, fontSize: 50, fontWeight: 900, color: K.sub}}>毎日 自分の顔と 誰かの顔を並べている</Pop>
    {f >= LT(T, 's15', 3) && <Pop f={f} at={LT(T, 's15', 3)} from="scale" style={{position: 'absolute', left: 160, top: 450, fontFamily: FONT, fontSize: 70, fontWeight: 900, color: K.gold}}>しかも 加工して</Pop>}
  </DarkBoard>
);

// ============ 5. 加工するほど ============
const S16: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#2a2230">
    <Editor f={f} x={1060} y={30} scale={0.95} />
    <Pop f={f} at={LT(T, 's16', 1)} style={{position: 'absolute', left: 140, top: 240, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: K.gold}}>「これなら載せられる」</Pop>
    {f >= LT(T, 's16', 2) && <Pop f={f} at={LT(T, 's16', 2)} style={{position: 'absolute', left: 140, top: 400, fontFamily: FONT, fontSize: 56, fontWeight: 900, color: '#9fb0d0'}}>でも 鏡の素顔は…？</Pop>}
  </DarkBoard>
);
const S17: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's17', 5);
  if (!res) return (
    <DarkBoard>
      <Editor f={f} x={1180} y={40} scale={0.85} />
      <Pop f={f} at={LT(T, 's17', 0)} style={{position: 'absolute', left: 120, top: 70, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: K.sub}}>18歳から30歳の女性 130人</Pop>
      <StepCard f={f} at={LT(T, 's17', 2)} n="手順1" text="SNSの画像を見る" x={110} y={170} w={950} />
      <StepCard f={f} at={LT(T, 's17', 3)} n="手順2" text="自撮りして 投稿するつもりで 最大5枚まで加工" x={110} y={320} w={950} />
      <StepCard f={f} at={LT(T, 's17', 4)} n="手順3" text="加工の前と後で 気分と顔への不満を測る" x={110} y={470} w={950} />
    </DarkBoard>
  );
  return (
    <DarkBoard>
      <Pop f={f} at={LT(T, 's17', 6)} style={TXT({top: 80, fontSize: 60, color: K.ink})}>加工の時間　平均 <span style={{color: K.gold}}>およそ4分半</span></Pop>
      <Card f={f} at={LT(T, 's17', 7)} x={260} y={230} w={1400} color={SOFTRED} text="たくさん加工した人ほど 自分の顔への不満が大きい" />
      <Card f={f} at={LT(T, 's17', 7, 2)} x={260} y={380} w={1400} size={40} text="加工や投稿に時間をかけた人ほど 気分も悪い" />
      <Card f={f} at={LT(T, 's17', 8)} x={260} y={520} w={1400} color={K.gold} text="なのに 本人は加工した写真のほうが好き" />
    </DarkBoard>
  );
};
const S18: React.FC<SceneProps> = ({f, T}) => {
  const d = seg(f, 0, LT(T, 's18', 2));
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 380, top: 70, display: 'flex', gap: 200}}>
        <FaceCard w={420} hue={20} glow={0.4 + 0.6 * d} label="加工後" />
        <FaceCard w={420} hue={20} dim={0.85 * d} label="素顔" />
      </div>
      {f >= LT(T, 's18', 2) && <Pop f={f} at={LT(T, 's18', 2)} from="scale" style={TXT({top: 680, fontSize: 90, color: '#ff3b30'})}>今夜も 同じことをする</Pop>}
    </DarkBoard>
  );
};

export const SCENES_L1: Record<string, React.FC<SceneProps>> = {s00: S00, s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08, s09: S09, s10: S10, s11: S11, s12: S12, s13: S13, s14: S14, s15: S15, s16: S16, s17: S17, s18: S18};
