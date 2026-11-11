// White-based, richer versions of the first 3 minutes (s00–s04). Used only when WHITE (mode.ts) is true.
import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {SceneProps, WhiteStudio, seg} from './kit';
import {Editor, FaceCard, LT, Mirror} from './ScenesL1';
import {MascotOverlay, PersonIcon, Phone, Pop, clamp} from './ui';

const INK = '#1d2230', SUB = '#5a6478', RED = '#c0392b', GOLD = '#b8860b', BLUE = '#2f6fb0';
const TX = (s: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: INK, ...s});

// slow camera drift for every cut
const Drift: React.FC<{f: number; dur: number; children: React.ReactNode; z?: number; dx?: number}> = ({f, dur, children, z = 0.05, dx = 0}) => {
  const p = interpolate(f, [0, Math.max(1, dur)], [0, 1], clamp);
  return <AbsoluteFill style={{transform: `scale(${1 + z * p}) translateX(${dx * p}px)`, transformOrigin: '50% 40%'}}>{children}</AbsoluteFill>;
};
// light chip with a coloured edge
const Chip: React.FC<{f: number; at: number; text: string; x: number; y: number; color?: string; size?: number; rot?: number}> = ({f, at, text, x, y, color = GOLD, size = 40, rot = 0}) => (
  <Pop f={f} at={at} from="scale" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, padding: '10px 26px', borderRadius: 40, background: '#ffffff', border: `4px solid ${color}`, color, fontSize: size, fontWeight: 900, fontFamily: FONT, whiteSpace: 'nowrap', boxShadow: '0 10px 26px rgba(0,0,0,0.14)'}}>{text}</Pop>
);
// svg stroke that draws itself
const Draw: React.FC<{f: number; at: number; d: number; path: string; color?: string; w?: number; len?: number; dash?: boolean}> = ({f, at, d, path, color = INK, w = 6, len = 2000, dash = false}) => {
  const p = seg(f, at, at + d);
  return <path d={path} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? '14 14' : `${len}`} strokeDashoffset={dash ? -f : len * (1 - p)} opacity={p > 0 ? 1 : 0} />;
};
const Svg: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{children}</svg>;
const Stamp: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string}> = ({f, at, text, x, y, size = 90, color = RED}) => {
  if (f < at) return null;
  const s = interpolate(f, [at, at + 6, at + 10], [2.2, 0.92, 1], clamp);
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(-12deg) scale(${s})`, opacity: interpolate(f, [at, at + 4], [0, 1], clamp), padding: '8px 30px', border: `9px solid ${color}`, borderRadius: 18, color, fontSize: size, fontWeight: 900, fontFamily: FONT, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.75)'}}>{text}</div>;
};
// face-recognition style frame with a scan line
const ScanFrame: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; color?: string}> = ({f, at, x, y, w, h, color = RED}) => {
  const p = seg(f, at, at + 14);
  const c = 46;
  const sy = y + ((f - at) * 9) % h;
  return (
    <g opacity={p}>
      {[[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].map(([a, b, sx, sy2], i) => (
        <path key={i} d={`M ${a} ${b + sy2 * c} L ${a} ${b} L ${a + sx * c} ${b}`} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
      ))}
      {f >= at && <line x1={x + 10} x2={x + w - 10} y1={sy} y2={sy} stroke={color} strokeWidth={3} opacity={0.6} />}
    </g>
  );
};
const Particles: React.FC<{f: number; at: number; n?: number; x: number; y: number; char?: string; color?: string}> = ({f, at, n = 10, x, y, char = '♥', color = '#e05a7a'}) => (
  <>{Array.from({length: n}, (_, i) => {
    const t = f - at - i * 3;
    if (t < 0) return null;
    const a = (i * 137) % 360, r = 40 + t * 4;
    return <div key={i} style={{position: 'absolute', left: x + Math.cos((a * Math.PI) / 180) * r * 0.6, top: y - t * 5 + Math.sin((a * Math.PI) / 180) * 30, fontSize: 40 + (i % 3) * 14, color, opacity: interpolate(t, [0, 8, 40, 60], [0, 1, 1, 0], clamp)}}>{char}</div>;
  })}</>
);
// circular timer
const Ring: React.FC<{p: number; x: number; y: number; r?: number; color?: string; label?: string}> = ({p, x, y, r = 90, color = RED, label}) => (
  <div style={{position: 'absolute', left: x - r - 20, top: y - r - 20, width: 2 * r + 40, height: 2 * r + 40}}>
    <svg width={2 * r + 40} height={2 * r + 40}><circle cx={r + 20} cy={r + 20} r={r} stroke="#e4e0d8" strokeWidth={16} fill="#fff" />
      <circle cx={r + 20} cy={r + 20} r={r} stroke={color} strokeWidth={16} fill="none" strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - p)} transform={`rotate(-90 ${r + 20} ${r + 20})`} strokeLinecap="round" /></svg>
    {label && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, fontSize: r * 0.62, color}}>{label}</div>}
  </div>
);
const Bubble: React.FC<{f: number; at: number; x: number; y: number; w: number; text: React.ReactNode; size?: number; color?: string; think?: boolean}> = ({f, at, x, y, w, text, size = 52, color = INK, think = false}) => (
  <Pop f={f} at={at} from="scale" style={{position: 'absolute', left: x, top: y, width: w}}>
    <div style={{padding: '26px 34px', borderRadius: think ? 80 : 30, background: '#fff', border: '4px solid #d8d4cc', boxShadow: '0 16px 40px rgba(0,0,0,0.15)', fontFamily: FONT, fontWeight: 900, fontSize: size, color, textAlign: 'center'}}>{text}</div>
    {think ? <><div style={{position: 'absolute', left: 60, bottom: -40, width: 34, height: 34, borderRadius: 17, background: '#fff', border: '4px solid #d8d4cc'}} /><div style={{position: 'absolute', left: 36, bottom: -74, width: 20, height: 20, borderRadius: 10, background: '#fff', border: '4px solid #d8d4cc'}} /></>
      : <div style={{position: 'absolute', left: 70, bottom: -26, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '30px solid #fff'}} />}
  </Pop>
);
const EyeIcon: React.FC<{f: number; x: number; y: number; s?: number}> = ({f, x, y, s = 1}) => {
  const blink = (f % 90) > 84 ? 0.1 : 1;
  return (
    <svg width={260 * s} height={150 * s} viewBox="0 0 260 150" style={{position: 'absolute', left: x, top: y}}>
      <path d="M 10 75 C 70 -5 190 -5 250 75 C 190 155 70 155 10 75 Z" fill="#fff" stroke={INK} strokeWidth={8} />
      <g transform={`translate(${130 + 18 * Math.sin(f / 14)} 75) scale(1 ${blink})`}><circle r={40} fill={INK} /><circle r={14} cx={12} cy={-12} fill="#fff" /></g>
    </svg>
  );
};

// ============ s00 オープニング ============
const S00: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (k === 0 ? 0 : LT(T, 's00', k) - 8));
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k], ld = (k + 1 < cuts.length ? cuts[k + 1] : dur) - cuts[k];
  const body = (() => {
    switch (k) {
      case 0: return ( // warning: a face being scanned
        <WhiteStudio>
          <div style={{position: 'absolute', left: 760, top: 70}}><FaceCard w={400} hue={210} light /></div>
          <Svg><ScanFrame f={lf} at={6} x={790} y={110} w={340} h={420} />
            <Draw f={lf} at={20} d={16} path="M 1150 200 L 1400 140" color={RED} w={4} /><Draw f={lf} at={26} d={16} path="M 1150 420 L 1400 470" color={RED} w={4} /></Svg>
          <Chip f={lf} at={30} text="分析中…" x={1410} y={110} color={RED} size={36} />
          <Chip f={lf} at={38} text="判定" x={1410} y={440} color={RED} size={36} />
        </WhiteStudio>
      );
      case 1: { // five faces, each gets a label through a drawn line
        const xs = [160, 500, 840, 1180, 1520];
        const labels = ['だらしなさそう', 'やさしそう', '頭よさそう', '暗そう', 'モテそう'];
        return (
          <WhiteStudio><Drift f={lf} dur={ld}>
            {xs.map((x, i) => <Pop key={i} f={lf} at={i * 4} style={{position: 'absolute', left: x, top: 90}}><FaceCard w={240} hue={[200, 30, 140, 260, 90][i]} light /></Pop>)}
            <Svg>{xs.map((x, i) => <Draw key={i} f={lf} at={14 + i * 6} d={10} path={`M ${x + 120} 400 L ${x + 120} 470`} color={i % 2 ? GOLD : RED} w={5} />)}</Svg>
            {xs.map((x, i) => <Chip key={i} f={lf} at={22 + i * 6} text={labels[i]} x={x + 120 - labels[i].length * 21 - 26} y={480} color={i % 2 ? GOLD : RED} size={38} rot={i % 2 ? 3 : -3} />)}
            <Pop f={lf} at={60} style={TX({top: 640, fontSize: 56, color: SUB})}>中身は まだ何も知らない</Pop>
          </Drift></WhiteStudio>
        );
      }
      case 2: { // your eye sweeps over people
        const gx = 560 + 1000 * seg(lf, 6, 70);
        return (
          <WhiteStudio>
            <EyeIcon f={lf} x={110} y={240} s={1.2} />
            <Svg><path d={`M 420 330 L ${gx} 200 L ${gx} 520 Z`} fill="rgba(47,111,176,0.10)" /></Svg>
            <div style={{position: 'absolute', left: 620, top: 170, display: 'flex', gap: 70}}>{[0, 1, 2, 3, 4].map((i) => <PersonIcon key={i} size={170} color={Math.abs(620 + i * 240 + 85 - gx) < 140 ? INK : '#b9c0cc'} />)}</div>
            <Stamp f={lf} at={40} text="あなたも 決めつけている" x={620} y={480} size={64} />
          </WhiteStudio>
        );
      }
      case 3: { // 1 second, flicked to the left
        const p = seg(lf, 36, 48);
        return (
          <WhiteStudio>
            {[2, 1].map((j) => <div key={j} style={{position: 'absolute', left: 780 + j * 14, top: 70 + j * 10, width: 400, height: 560, borderRadius: 26, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.12)'}} />)}
            <div style={{position: 'absolute', left: 760 - p * 1000, top: 60, transform: `rotate(${-p * 28}deg)`, padding: 18, borderRadius: 26, background: '#fff', boxShadow: '0 30px 70px rgba(0,0,0,0.25)'}}>
              <FaceCard w={364} hue={330} light /><div style={{textAlign: 'center', fontSize: 64, color: RED, fontWeight: 900, marginTop: 6}}>✕</div>
            </div>
            <Ring p={seg(lf, 4, 34)} x={1480} y={300} r={110} label="1秒" />
            <Pop f={lf} at={50} style={TX({top: 680, fontSize: 52, color: SUB})}>写真だけで 次へ</Pop>
          </WhiteStudio>
        );
      }
      case 4: // waiting room: chairs, thought bubble
        return (
          <WhiteStudio><Drift f={lf} dur={ld} z={0.04}>
            <div style={{position: 'absolute', left: 300, top: 470, width: 1320, height: 24, borderRadius: 8, background: '#cfc9bf'}} />
            <div style={{position: 'absolute', left: 360, top: 230, display: 'flex', gap: 140}}>
              {[0, 1, 2, 3].map((i) => <PersonIcon key={i} size={200} color={i === 1 ? INK : i === 2 ? '#7d8799' : '#b9c0cc'} star={i === 2 && lf > 30} />)}
            </div>
            <Chip f={lf} at={6} text="面接 待合室" x={80} y={60} color={SUB} size={34} />
            <Bubble f={lf} at={20} x={400} y={10} w={780} think text={<span style={{color: RED}}>「この人には 勝てない」</span>} size={48} />
            <Svg><Draw f={lf} at={14} d={20} path="M 690 300 C 760 220 860 220 930 300" color={BLUE} w={5} dash /></Svg>
          </Drift></WhiteStudio>
        );
      case 5: { // before / after wipe + editor
        const wp = seg(lf, 10, 60);
        return (
          <WhiteStudio>
            <div style={{position: 'absolute', left: 200, top: 80, width: 420, height: 525, borderRadius: 16, overflow: 'hidden'}}>
              <FaceCard w={420} hue={20} light />
              <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - wp * 100}% 0 0)`, filter: 'blur(2px) brightness(1.18) saturate(1.2)'}}><FaceCard w={420} hue={20} light /></div>
              <div style={{position: 'absolute', top: 0, bottom: 0, left: `${wp * 100}%`, width: 6, background: '#fff', boxShadow: '0 0 12px rgba(0,0,0,0.3)'}} />
            </div>
            <Chip f={lf} at={4} text="加工前" x={230} y={620} color={SUB} size={34} /><Chip f={lf} at={40} text="加工後" x={470} y={620} color="#e05a7a" size={34} />
            <Editor f={lf} x={900} y={40} scale={0.88} />
            <Stamp f={lf} at={56} text="このままは 載せられない" x={230} y={700} size={50} />
          </WhiteStudio>
        );
      }
      case 6: return ( // compliment → hearts
        <WhiteStudio>
          <Phone f={lf} x={700} y={20} scale={0.88} title="友達" msgs={[{from: 'them', text: '久しぶり！', at: 0, time: '12:10'}, {from: 'them', text: '痩せた？かわいくなったね', at: 8, time: '12:10'}]} />
          <Particles f={lf} at={20} x={1300} y={500} n={12} />
          <Pop f={lf} at={24} style={{position: 'absolute', left: 1320, top: 260, fontSize: 140}}>😊</Pop>
        </WhiteStudio>
      );
      default: { // mood gauge drops
        const p = seg(lf, 30, 60);
        const ang = -60 + 120 * (1 - p);
        return (
          <WhiteStudio>
            <Pop f={lf} at={4} style={{position: 'absolute', left: 300, top: 160, fontSize: 150}}>🍰🍟</Pop>
            <div style={{position: 'absolute', left: 1000, top: 110, width: 600, height: 340}}>
              <svg width={600} height={340} viewBox="0 0 600 340">
                <path d="M 60 300 A 240 240 0 0 1 540 300" fill="none" stroke="#e4e0d8" strokeWidth={40} />
                <path d="M 60 300 A 240 240 0 0 1 300 60" fill="none" stroke="#e7b0a6" strokeWidth={40} />
                <path d="M 300 60 A 240 240 0 0 1 540 300" fill="none" stroke="#a9d3c3" strokeWidth={40} />
                <g transform={`rotate(${ang} 300 300)`}><line x1={300} y1={300} x2={300} y2={90} stroke={INK} strokeWidth={10} strokeLinecap="round" /></g>
                <circle cx={300} cy={300} r={20} fill={INK} />
              </svg>
              <div style={{position: 'absolute', left: 0, top: 290, fontSize: 60}}>😞</div><div style={{position: 'absolute', right: 0, top: 290, fontSize: 60}}>😊</div>
            </div>
            <Pop f={lf} at={34} style={TX({top: 520, fontSize: 84, color: RED})}>自分が 嫌になる</Pop>
          </WhiteStudio>
        );
      }
    }
  })();
  return <AbsoluteFill style={{background: '#f3f2ef'}}><AbsoluteFill style={{opacity: interpolate(lf, [0, 6], [k === 0 ? 1 : 0, 1], clamp)}}>{body}</AbsoluteFill></AbsoluteFill>;
};

// ============ s01 ============
const PROMS = [['💴', '見た目が 評価とお金と人生をどう変えるか'], ['📱', 'スマホの中で「自分の顔が嫌い」がどう作られるか'], ['🗾', '今 日本で何が起きているか'], ['✨', 'そもそも「いい見た目」って何か']] as const;
const S01: React.FC<SceneProps> = ({f, T, dur}) => {
  const L = (k: number, c = 0) => LT(T, 's01', k, c);
  if (f >= L(12)) { // mirror + self score
    const lf = f - L(12);
    const n = lf < 50 ? 40 + ((lf * 7) % 59) : null;
    return (
      <AbsoluteFill><Drift f={lf} dur={dur - L(12)} z={0.06}><Mirror f={lf} hand={false} /></Drift>
        <div style={{position: 'absolute', left: 1240, top: 150, width: 300, height: 300, borderRadius: 150, background: '#fff', border: `10px solid ${RED}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, color: RED, opacity: seg(lf, 10, 20), transform: 'rotate(-8deg)'}}>
          <div style={{fontSize: 40}}>今日の点数</div><div style={{fontSize: 120, lineHeight: 1}}>{n ?? '？'}</div>
        </div>
      </AbsoluteFill>
    );
  }
  if (f >= L(7)) { // four promises with icons and progress dots
    const cur = [8, 9, 10, 11].filter((k) => f >= L(k)).length - 1;
    return (
      <WhiteStudio>
        <Pop f={f} at={L(7)} style={TX({top: 50, fontSize: 56})}>今日 わかる <span style={{color: RED}}>4つ</span>のこと</Pop>
        {PROMS.map(([ic, t], i) => {
          const on = i === cur;
          return (
            <Pop key={i} f={f} at={L(8 + i)} from="left" style={{position: 'absolute', left: 260, top: 160 + i * 150, width: 1400, display: 'flex', alignItems: 'center', gap: 30, padding: '20px 34px', borderRadius: 20, background: '#fff', border: `4px solid ${on ? RED : '#e0dcd4'}`, boxShadow: on ? '0 18px 44px rgba(192,57,43,0.22)' : '0 8px 20px rgba(0,0,0,0.08)', opacity: on ? 1 : 0.55, transform: `scale(${on ? 1.03 : 1})`, fontFamily: FONT}}>
              <div style={{fontSize: 70}}>{ic}</div>
              <div style={{fontSize: 34, fontWeight: 900, color: RED, whiteSpace: 'nowrap'}}>{['一つ目', '二つ目', '三つ目', '四つ目'][i]}</div>
              <div style={{fontSize: 46, fontWeight: 900, color: INK}}>{t}</div>
            </Pop>
          );
        })}
      </WhiteStudio>
    );
  }
  if (f >= L(5)) { // term: typewriter + definition flow, then iceberg
    if (f >= L(6)) {
      const lf = f - L(6);
      const wave = (x: number) => 380 + 8 * Math.sin(x / 60 + lf / 10);
      return (
        <WhiteStudio>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <path d="M 760 380 L 960 170 L 1160 380 Z" fill="#ffffff" stroke="#9fb6cc" strokeWidth={5} />
            <path d={`M 0 ${wave(0)} ${Array.from({length: 33}, (_, i) => `L ${i * 60} ${wave(i * 60)}`).join(' ')} L 1920 1080 L 0 1080 Z`} fill="rgba(110,160,210,0.35)" />
            <path d="M 760 380 L 560 700 L 1360 720 L 1160 380 Z" fill={`rgba(70,110,150,${0.3 * seg(lf, 40, 70) + 0.1})`} stroke="#6f8fb0" strokeWidth={4} strokeDasharray="12 10" />
          </svg>
          <Pop f={f} at={L(6)} style={TX({top: 250, fontSize: 52})}>言葉</Pop>
          <Pop f={f} at={L(6) + 40} style={TX({top: 520, fontSize: 52, color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.4)'})}>人生への 入り込み方</Pop>
          <Chip f={lf} at={20} text="みんな知っている" x={1300} y={230} color={BLUE} size={36} />
          <Chip f={lf} at={70} text="ほとんど知らない" x={1400} y={560} color={RED} size={36} />
        </WhiteStudio>
      );
    }
    const lf = f - L(5);
    const word = 'ルッキズム';
    const nch = Math.min(word.length, Math.floor(lf / 4));
    return (
      <WhiteStudio>
        <div style={TX({top: 120, fontSize: 160, color: RED})}>{word.slice(0, nch)}<span style={{opacity: nch < word.length && Math.floor(lf / 6) % 2 ? 1 : 0}}>｜</span></div>
        <Svg><Draw f={lf} at={22} d={14} path="M 560 330 L 1360 330" color={RED} w={8} /></Svg>
        <div style={{position: 'absolute', left: 300, top: 400, width: 1320, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          {['見た目', '評価', '扱いが変わる'].map((t, i) => (
            <Pop key={i} f={f} at={L(5, 1) + i * 12} from="scale" style={{padding: '22px 40px', borderRadius: 20, background: '#fff', border: `4px solid ${i === 2 ? RED : '#d8d4cc'}`, fontFamily: FONT, fontWeight: 900, fontSize: 52, color: i === 2 ? RED : INK, boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>{t}</Pop>
          ))}
        </div>
        <Svg><Draw f={f - L(5, 1)} at={8} d={10} path="M 610 450 L 800 450" color={SUB} w={6} /><Draw f={f - L(5, 1)} at={20} d={10} path="M 1010 450 L 1200 450" color={SUB} w={6} /></Svg>
        <Pop f={f} at={L(5, 2)} style={TX({top: 600, fontSize: 64})}>日本語では <span style={{color: GOLD}}>外見至上主義</span></Pop>
      </WhiteStudio>
    );
  }
  // wall of faces: wave in, scan sweep, then two circles merge into "you"
  const venn = f >= L(3);
  const scan = f >= L(2) && !venn;
  const sx = 100 + 1720 * seg(f, L(2), L(3) - 10);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 120, top: 60, display: 'grid', gridTemplateColumns: 'repeat(8, 190px)', gap: 18, opacity: venn ? 0.15 : 0.95}}>
        {Array.from({length: 16}, (_, i) => {
          const col = i % 8, row = Math.floor(i / 8);
          const a = interpolate(f, [col * 3 + row * 6, col * 3 + row * 6 + 12], [0, 1], clamp);
          const hit = scan && Math.abs(120 + col * 208 + 95 - sx) < 110;
          return <div key={i} style={{opacity: a, transform: `translateY(${(1 - a) * 40}px) scale(${hit ? 1.06 : 1})`, outline: hit ? `6px solid ${RED}` : 'none', borderRadius: 14}}><FaceCard w={190} hue={(i * 47) % 360} light /></div>;
        })}
      </div>
      {scan && <div style={{position: 'absolute', left: sx - 4, top: 40, width: 8, height: 520, background: RED, opacity: 0.6, boxShadow: `0 0 30px ${RED}`}} />}
      {!venn && <MascotOverlay f={f} x={760} y={470} w={400} h={420} rotY={0.3 * Math.sin(f / 50)} tone="light" />}
      {venn && (() => {
        const p = seg(f, L(3) + 20, L(4));
        return (
          <>
            <div style={{position: 'absolute', left: 560 + 170 * p, top: 120, width: 520, height: 520, borderRadius: 260, background: 'rgba(47,111,176,0.16)', border: `5px solid ${BLUE}`}} />
            <div style={{position: 'absolute', left: 840 - 170 * p, top: 120, width: 520, height: 520, borderRadius: 260, background: 'rgba(192,57,43,0.14)', border: `5px solid ${RED}`}} />
            <Pop f={f} at={L(3)} style={{position: 'absolute', left: 300 + 120 * p, top: 330, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: BLUE}}>決めつける頭</Pop>
            <Pop f={f} at={L(3, 1)} style={{position: 'absolute', left: 1360 - 120 * p, top: 330, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: RED}}>苦しむ心</Pop>
            {f >= L(4) && <div style={{position: 'absolute', left: 860, top: 300}}><PersonIcon size={200} color={INK} /></div>}
            <Pop f={f} at={L(4)} style={TX({top: 680, fontSize: 64})}>同じ一人の中に</Pop>
          </>
        );
      })()}
    </WhiteStudio>
  );
};

// ============ s02 ============
const S02: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 360, top: 470, width: 1200, height: 40, borderRadius: 10, background: '#cfc9bf'}} />
    <div style={{position: 'absolute', left: 420, top: 290, display: 'flex', gap: 40}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fl = seg(f, LT(T, 's02', 1) + 10 + i * 8, LT(T, 's02', 1) + 20 + i * 8);
        return <div key={i} style={{width: 180, height: 180, transform: `rotateY(${fl * 180}deg)`, transformStyle: 'preserve-3d', position: 'relative'}}>
          <Pop f={f} at={8 + i * 6} style={{position: 'absolute', inset: 0, borderRadius: 14, background: fl > 0.5 ? '#fff' : '#3a4256', border: fl > 0.5 ? `4px solid ${RED}` : 'none', boxShadow: '0 10px 24px rgba(0,0,0,0.2)', color: fl > 0.5 ? RED : '#e8c46a', fontSize: 80, fontWeight: 900, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: fl > 0.5 ? 'scaleX(-1)' : 'none'}}>{fl > 0.5 ? i + 1 : '?'}</Pop>
        </div>;
      })}
    </div>
    <Pop f={f} at={LT(T, 's02', 1, 1)} style={TX({top: 600, fontSize: 52, color: SUB})}>心の中で <span style={{color: RED}}>数えて</span> ください</Pop>
    <MascotOverlay f={f} x={1520} y={260} w={340} h={400} rotY={-0.8} tone="light" />
  </WhiteStudio>
);

// ============ s03 check list ============
const CHECK = ['写真をSNSに載せる前に 必ず加工する', '人の投稿を見て 自分の顔や体と比べてしまう', '「私 太ってる」「顔が大きい」と 見た目の悪口を言う', '初めて会った人の性格を 見た目で決めている', '見た目のせいで 損をしていると感じたことがある'];
const S03: React.FC<SceneProps> = ({f, T}) => {
  const L = (k: number, c = 0) => LT(T, 's03', k, c);
  const hlOn = f >= L(7);
  const loop = f >= L(8);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 120, top: 50, width: loop ? 1060 : 1400, transition: 'none'}}>
        {CHECK.map((t, i) => {
          const at = L(i);
          const tick = seg(f, at + 20, at + 32);
          const hl = hlOn && (i === 0 || i === 2);
          const pulse = hl ? 1 + 0.02 * Math.sin(f / 5) : 1;
          return (
            <Pop key={i} f={f} at={at} from="left" style={{marginBottom: 18, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 28px', borderRadius: 18, background: hl ? '#fff1ee' : '#ffffff', border: `4px solid ${hl ? RED : '#e0dcd4'}`, fontFamily: FONT, transform: `scale(${pulse})`, opacity: hlOn && !hl ? 0.45 : 1}}>
              <svg width={60} height={60}><rect x={4} y={4} width={52} height={52} rx={10} fill="#fff" stroke={hl ? RED : '#3a4256'} strokeWidth={5} />
                <path d="M 15 31 L 26 42 L 46 18" fill="none" stroke={hl ? RED : '#2e9c6a'} strokeWidth={7} strokeLinecap="round" strokeDasharray={60} strokeDashoffset={60 * (1 - tick)} /></svg>
              <div style={{fontSize: loop ? 32 : 40, fontWeight: 900, color: INK, whiteSpace: 'nowrap'}}>{t}</div>
            </Pop>
          );
        })}
      </div>
      {f >= L(5) && !loop && <div style={{position: 'absolute', left: 1580, top: 120}}><Ring p={seg(f, L(5), L(6))} x={110} y={110} r={95} color={GOLD} label="？" /></div>}
      {!loop && <Stamp f={f} at={L(6, 1)} text="ルッキズムの中" x={1440} y={420} size={58} />}
      {loop && (() => {
        const lf = f - L(8);
        return (
          <>
            <Pop f={f} at={L(8)} style={{position: 'absolute', left: 1280, top: 70, width: 520, padding: 24, borderRadius: 20, background: '#fff', border: `4px solid ${BLUE}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: BLUE, textAlign: 'center'}}>🛡 自分を守るため</Pop>
            <Svg><Draw f={lf} at={30} d={20} path="M 1700 190 C 1830 300 1830 420 1700 520" color={SUB} w={6} /><Draw f={lf} at={60} d={20} path="M 1380 520 C 1250 420 1250 300 1380 190" color={RED} w={6} /></Svg>
            <Pop f={f} at={L(8) + 50} style={{position: 'absolute', left: 1280, top: 520, width: 520, padding: 24, borderRadius: 20, background: '#fff1ee', border: `4px solid ${RED}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: RED, textAlign: 'center'}}>⛓ 逆に追い詰める</Pop>
          </>
        );
      })()}
    </WhiteStudio>
  );
};

// ============ s04 ============
const S04: React.FC<SceneProps> = ({f, T, dur}) => {
  const L = (k: number, c = 0) => LT(T, 's04', k, c);
  if (f >= L(5)) { // "どうせ顔でしょ" typewriter over faint faces
    const lf = f - L(5);
    const q = '「どうせ顔でしょ」';
    return (
      <WhiteStudio>
        <div style={{position: 'absolute', left: 200, top: 120, display: 'flex', gap: 30, opacity: 0.18, filter: 'blur(2px)'}}>{[0, 1, 2, 3, 4, 5].map((i) => <FaceCard key={i} w={230} hue={i * 60} light />)}</div>
        <div style={TX({top: 300, fontSize: 120, color: RED})}>{q.slice(0, Math.min(q.length, 1 + Math.floor(lf / 3)))}</div>
      </WhiteStudio>
    );
  }
  if (f >= L(4)) { // shop: two customers, warm vs cold
    const lf = f - L(4);
    return (
      <WhiteStudio><Drift f={lf} dur={L(5) - L(4)} z={0.04}>
        <div style={{position: 'absolute', left: 240, top: 460, width: 1440, height: 60, borderRadius: 10, background: '#d9d3c9'}} />
        <div style={{position: 'absolute', left: 880, top: 210}}><PersonIcon size={200} color="#7d8799" label="店員" /></div>
        <div style={{position: 'absolute', left: 360, top: 560}}><PersonIcon size={180} color={INK} label="あなた" /></div>
        <div style={{position: 'absolute', left: 1400, top: 560}}><PersonIcon size={180} color="#b9c0cc" label="隣の人" /></div>
        <Bubble f={lf} at={10} x={470} y={40} w={360} text="いらっしゃいませ…" size={36} color={SUB} />
        <Bubble f={lf} at={26} x={1100} y={20} w={460} text="いらっしゃいませ！" size={50} color={GOLD} />
        <Particles f={lf} at={34} x={1450} y={380} n={6} char="✦" color={GOLD} />
        <Pop f={lf} at={44} style={{position: 'absolute', left: 600, top: 600, fontSize: 90}}>❄</Pop>
      </Drift></WhiteStudio>
    );
  }
  if (f >= L(3)) { // app: photos sorted into two trays
    const lf = f - L(3);
    return (
      <WhiteStudio>
        <div style={{position: 'absolute', left: 260, top: 520, width: 520, height: 140, borderRadius: 20, border: '5px dashed #b9c0cc', fontFamily: FONT, fontWeight: 900, fontSize: 44, color: SUB, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>会わない</div>
        <div style={{position: 'absolute', left: 1140, top: 520, width: 520, height: 140, borderRadius: 20, border: `5px dashed ${RED}`, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: RED, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>会う</div>
        {[0, 1, 2, 3].map((i) => {
          const p = seg(lf, 8 + i * 22, 22 + i * 22);
          const right = i === 2;
          const x = 810 + (right ? 1 : -1) * p * 440, y = 60 + p * 300;
          return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${(right ? 1 : -1) * p * 12}deg) scale(${1 - 0.45 * p})`, opacity: lf >= 8 + i * 22 - 6 ? 1 : 0, zIndex: 10 - i}}><FaceCard w={300} hue={(i * 70 + 20) % 360} light /></div>;
        })}
        <Chip f={lf} at={4} text="写真だけで" x={80} y={60} color={RED} size={40} />
      </WhiteStudio>
    );
  }
  // first meeting: you and a stranger; tags fly onto them
  return (
    <WhiteStudio><Drift f={f} dur={L(3)} z={0.05}>
      <div style={{position: 'absolute', left: 380, top: 250}}><PersonIcon size={240} color={INK} label="あなた" /></div>
      <div style={{position: 'absolute', left: 1300, top: 250}}><PersonIcon size={240} color="#7d8799" /></div>
      <EyeIcon f={f} x={720} y={300} s={0.7} />
      <Svg><Draw f={f} at={20} d={20} path="M 920 350 L 1260 350" color={BLUE} w={5} dash /></Svg>
      <Chip f={f} at={L(1)} text="やさしそう" x={1220} y={60} color={GOLD} size={38} rot={-4} />
      <Chip f={f} at={L(1, 1)} text="仕事ができそう" x={1480} y={160} color={GOLD} size={38} rot={3} />
      <Chip f={f} at={L(1, 2)} text="ちょっと怖そう" x={1180} y={560} color={RED} size={38} rot={-2} />
      {f >= L(2) && <Bubble f={f} at={L(2)} x={330} y={20} w={420} text={<span style={{textDecoration: 'line-through', color: SUB}}>……</span>} size={56} />}
      <Pop f={f} at={L(2, 1)} style={TX({top: 700, fontSize: 60})}>まだ一言も <span style={{color: RED}}>話していない</span></Pop>
    </Drift></WhiteStudio>
  );
};

export const SCENES_W: Record<string, React.FC<SceneProps>> = {s00: S00, s01: S01, s02: S02, s03: S03, s04: S04};
