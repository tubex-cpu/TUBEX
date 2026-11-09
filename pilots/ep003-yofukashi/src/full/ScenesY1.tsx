import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Bars, Clock, DarkBoard, PhonePOV, SceneProps, StepCard, Still, Title, WhiteStudio, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Phone, Pop, clamp, fadeIn} from './ui';

// T for line k of block id
export const LT = (T: SceneProps['T'], id: string, k: number, c = 0) => T(`${id}_${k}`, c);
const tint = (c: string, a: number) => <AbsoluteFill style={{background: c, opacity: a, mixBlendMode: 'multiply'}} />;

export const Timer: React.FC<{text: string; x: number; y: number; scale?: number}> = ({text, x, y, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'top left', width: 520, height: 330, borderRadius: 40, background: '#f6f4ef', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '3px solid #d8d4cc'}}>
    <div style={{position: 'absolute', left: 40, right: 40, top: 50, height: 170, borderRadius: 20, background: '#1f2a24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Noto Sans JP", monospace', fontWeight: 900, fontSize: 120, color: '#9cf0b2'}}>{text}</div>
  </div>
);
export const WallClock: React.FC<{f: number; x: number; y: number; size?: number; speed?: number; start?: number}> = ({f, x, y, size = 320, speed = 6, start = 22.5}) => {
  const h = start + (f * speed) / 3600;
  const ma = ((h % 1) * 360), ha = ((h % 12) / 12) * 360;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{position: 'absolute', left: x, top: y}}>
      <circle cx={100} cy={100} r={92} fill="#fbfaf6" stroke="#3a3f4a" strokeWidth={8} />
      {Array.from({length: 12}, (_, i) => <line key={i} x1={100} y1={18} x2={100} y2={30} stroke="#3a3f4a" strokeWidth={5} transform={`rotate(${i * 30} 100 100)`} />)}
      <line x1={100} y1={100} x2={100} y2={52} stroke="#1d2230" strokeWidth={8} strokeLinecap="round" transform={`rotate(${ha} 100 100)`} />
      <line x1={100} y1={100} x2={100} y2={34} stroke="#e0533d" strokeWidth={5} strokeLinecap="round" transform={`rotate(${ma} 100 100)`} />
      <circle cx={100} cy={100} r={7} fill="#1d2230" />
    </svg>
  );
};
const Post: React.FC<{text: string; who: string; likes: string}> = ({text, who, likes}) => (
  <div style={{margin: '0 0 18px', padding: '18px 20px', borderRadius: 18, background: '#ffffff', color: '#1d2230', fontFamily: FONT}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, fontWeight: 800, color: '#556'}}><div style={{width: 34, height: 34, borderRadius: 17, background: '#c9d3e6'}} />{who}</div>
    <div style={{fontSize: 26, fontWeight: 800, marginTop: 10, lineHeight: 1.4}}>{text}</div>
    <div style={{fontSize: 18, color: '#e0533d', marginTop: 8}}>♥ {likes}</div>
  </div>
);
export const PostsScreen: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, background: '#e9ecf2', padding: '80px 16px', transform: `translateY(${-((f * 1.4) % 300)}px)`}}>
    {[['寝る時間がもったいない', 'night_owl', '2.1万'], ['短く寝られる人が成功する', 'success_blog', '8,402'], ['睡眠4時間でも平気', 'grind_daily', '1.3万'], ['寝る時間がもったいない', 'night_owl', '2.1万'], ['短く寝られる人が成功する', 'success_blog', '8,402']].map(([t, w, l], i) => <Post key={i} text={t} who={w} likes={l} />)}
  </div>
);

// ============ 0. オープニング ============
// ranking show: each "cancel" gets a red stamp; no phone on screen (owner 2026-11-09: avoid repeating ep002's swiping phone)
const RANK: [string, string, string][] = [['5位', '歯磨き', '🪥'], ['4位', '着替え', '👕'], ['3位', '外出', '🚪'], ['2位', 'お仕事', '💼']];
const Stamp: React.FC<{f: number; at: number; size?: number}> = ({f, at, size = 34}) => {
  if (f < at + 8) return null;
  const sc = interpolate(f - at - 8, [0, 5, 9], [2.4, 0.92, 1], clamp);
  return <div style={{position: 'absolute', right: 30, top: '50%', transform: `translateY(-50%) rotate(-12deg) scale(${sc})`, border: `5px solid #ff3b30`, borderRadius: 10, padding: '2px 14px', color: '#ff3b30', fontSize: size, fontWeight: 900, letterSpacing: '0.08em', background: 'rgba(10,10,14,0.4)'}}>キャンセル</div>;
};
const S00: React.FC<SceneProps> = ({f, dur, T}) => {
  const one = LT(T, 's00', 5);
  const s = interpolate(f - one, [0, 8, 14], [2.2, 0.94, 1], clamp);
  const spot = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: 'blur(6px)'}}><Still src="bed" f={f} dur={dur} dark={0.75} from={1.1} to={1.16} /></AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% -10%, rgba(255,214,120,${0.18 + 0.06 * spot}) 0%, rgba(0,0,0,0) 55%)`}} />
      <Pop f={f} at={4} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontFamily: FONT}}>
        <div style={{display: 'inline-block', padding: '10px 40px', borderRadius: 14, background: K.gold, color: '#141820', fontSize: 52, fontWeight: 900}}>キャンセル界隈 ヤバい順</div>
      </Pop>
      <div style={{position: 'absolute', left: 360, top: 170, width: 1200, fontFamily: FONT}}>
        {RANK.map(([n, t, ic], i) => (
          <Pop key={i} f={f} at={LT(T, 's00', i + 1)} from="right">
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 30, padding: '12px 30px', marginBottom: 14, borderRadius: 16, background: 'rgba(14,16,24,0.88)', border: '2px solid rgba(255,255,255,0.12)', opacity: f > one ? 0.4 : 1}}>
              <div style={{fontSize: 40, fontWeight: 900, color: K.sub, width: 90}}>{n}</div>
              <div style={{fontSize: 56}}>{ic}</div>
              <div style={{fontSize: 48, fontWeight: 900, color: K.ink}}>{t}キャンセル</div>
              <Stamp f={f} at={LT(T, 's00', i + 1)} />
            </div>
          </Pop>
        ))}
        {f >= one && (
          <div style={{position: 'relative', marginTop: 16, padding: '18px 30px', borderRadius: 20, background: 'rgba(224,83,61,0.22)', border: '5px solid #e0533d', transform: `scale(${s})`, transformOrigin: 'center', boxShadow: `0 0 ${40 + 30 * spot}px rgba(255,59,48,0.45)`, display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{fontSize: 52, fontWeight: 900, color: '#ff7a64', width: 90}}>1位</div>
            <div style={{fontSize: 80}}>🛏️</div>
            <div style={{fontSize: 78, fontWeight: 900, color: '#ff3b30'}}>睡眠キャンセル界隈</div>
          </div>
        )}
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
// the everyday cuts — still life and clocks only, the phone stays off screen (its blue light shows on the ceiling)
const PhoneLight: React.FC<{f: number; k?: number}> = ({f, k = 1}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 58% 38%, rgba(110,160,255,${(0.22 + 0.05 * Math.sin(f / 5) + 0.04 * Math.sin(f / 2.3)) * k}) 0%, rgba(0,0,0,0) 45%)`, mixBlendMode: 'screen'}} />
);
const S01: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => LT(T, 's01', k) - 10);
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k], ld = (k + 1 < cuts.length ? cuts[k + 1] : dur) - cuts[k];
  const body = (() => {
    switch (k) {
      case 0: return <><Still src="living" f={lf} dur={ld} dark={0.3} />{tint('#ffb070', 0.25)}<Clock text="23:00" x={150} y={120} size={96} color="#ffd29a" /></>;
      case 1: return (
        <>
          <Still src="living" f={lf} dur={ld} dark={0.55} ox={50} oy={70} from={1.05} to={1.15} />
          <Pop f={lf} at={8} style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: FONT, fontSize: 84, fontWeight: 900, color: K.gold, textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>やっと自分の時間</Pop>
          <Pop f={lf} at={30} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: FONT, fontSize: 52, fontWeight: 900, color: '#7fa2ff', textShadow: '0 4px 20px rgba(0,0,0,0.8)'}}>寝たら すぐ明日</Pop>
        </>
      );
      case 2: return (
        <>
          <Still src="bed" f={lf} dur={ld} dark={0.72} from={1.1} to={1.2} />
          <PhoneLight f={lf} />
          <Pop f={lf} at={6} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontFamily: FONT, fontSize: 120, fontWeight: 900, color: K.gold, textShadow: '0 6px 30px rgba(0,0,0,0.9)'}}>あと1本だけ</Pop>
        </>
      );
      case 3: {
        const t = Math.min(1, lf / 40);
        const mm = Math.floor(5 + 55 * t);
        return <><Still src="bed" f={lf} dur={ld} dark={0.75} /><PhoneLight f={lf} k={0.8} /><div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center'}}><Clock text={t < 1 ? `0:${String(mm).padStart(2, '0')}` : '1:05'} x={0} y={0} size={170} /></div></>;
      }
      case 4: {
        const snz = Math.min(3, Math.floor(lf / 22) + 1);
        return (
          <>
            <AbsoluteFill style={{filter: 'saturate(0.6)'}}><Still src="bedLamp" f={lf} dur={ld} dark={0.1} /></AbsoluteFill>
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(190,210,255,0.3), rgba(255,255,255,0.05))'}} />
            <Clock text="7:00" x={150} y={120} size={110} />
            <div style={{position: 'absolute', left: 150, top: 330, display: 'flex', gap: 20, fontFamily: FONT}}>
              {Array.from({length: snz}, (_, i) => <div key={i} style={{padding: '14px 26px', borderRadius: 14, background: 'rgba(10,12,18,0.85)', fontSize: 40, fontWeight: 900, color: K.ink}}>スヌーズ</div>)}
            </div>
          </>
        );
      }
      case 5: return (
        <>
          <Still src="desk" f={lf} dur={ld} dark={0.3} blur={7} />
          <div style={{position: 'absolute', left: 520, top: 120, width: 880, height: 620, borderRadius: 16, background: '#f5f7fb', padding: 50, filter: `blur(${2 + 2 * Math.sin(lf / 9)}px)`, fontFamily: FONT, color: '#1d2230'}}>
            <div style={{fontSize: 46, fontWeight: 900}}>来期の計画について</div>
            {Array.from({length: 7}, (_, i) => <div key={i} style={{height: 18, borderRadius: 9, background: '#b9c2d3', marginTop: 36, width: `${60 + ((i * 29) % 35)}%`}} />)}
          </div>
        </>
      );
      case 6: return (
        <>
          <Still src="living" f={lf} dur={ld} dark={0.6} blur={5} />
          <Phone f={lf} x={660} y={30} scale={0.9} title="恋人" input={lf > 40 ? 'もういいって。ほっといて' : ''} msgs={[{from: 'them', text: '今日のごはんどうする？', at: 0, time: '20:14'}, {from: 'them', text: '返事まだ？', at: 4, time: '20:52'}]} />
        </>
      );
      case 7: return <><AbsoluteFill style={{filter: 'blur(2px)'}}><Still src="bedLamp" f={lf} dur={ld} dark={0.0} /></AbsoluteFill><AbsoluteFill style={{background: 'rgba(255,240,210,0.25)'}} /><Clock text="12:30" x={150} y={120} size={100} color="#ff9f43" /></>;
      default: return <><Still src="bed" f={lf} dur={ld} dark={0.78} from={1.1} to={1.2} /><PhoneLight f={lf} k={1.2} /></>;
    }
  })();
  return <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{opacity: interpolate(lf, [0, 8], [0, 1], clamp)}}>{body}</AbsoluteFill><Vignette /></AbsoluteFill>;
};
const S02: React.FC<SceneProps> = ({f, dur, T}) => {
  const def = LT(T, 's02', 6), four = LT(T, 's02', 8);
  const items = ['なぜ現代社会は短い睡眠を肯定するのか', 'なぜ夜更かしはやめられないのか', '心と体と脳に起きる危機', '短く寝ても平気な人は本当にいるのか'];
  if (f >= four) {
    return (
      <DarkBoard>
        <Title f={f - four} text="今日わかること" y={70} size={58} color={K.gold} />
        {items.map((t, i) => (
          <Pop key={i} f={f} at={LT(T, 's02', 9 + i)} from="left" style={{position: 'absolute', left: 260, top: 190 + i * 150, width: 1400}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '22px 36px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.12)'}}>
              <div style={{fontSize: 36, fontWeight: 900, color: '#141820', background: K.gold, borderRadius: 12, padding: '6px 18px'}}>{['一つ目', '二つ目', '三つ目', '四つ目'][i]}</div>
              <div style={{fontSize: 48, fontWeight: 900, color: i === 2 ? '#ff7a64' : K.ink}}>{t}</div>
            </div>
          </Pop>
        ))}
      </DarkBoard>
    );
  }
  if (f >= def) {
    return (
      <DarkBoard>
        <Pop f={f} at={def + 4} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontSize: 120, fontWeight: 900, color: '#ff3b30'}}>睡眠キャンセル界隈</Pop>
        <Pop f={f} at={def + 30} style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontSize: 46, fontWeight: 800, color: K.ink}}>寝たほうがいいと分かっているのに 寝るのを後回しにする人たち</Pop>
        <MascotOverlay f={f} x={1460} y={460} w={360} h={420} rotY={-0.8} />
      </DarkBoard>
    );
  }
  const drunk = f >= LT(T, 's02', 4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.65} ox={20} oy={60} />
      <div style={{position: 'absolute', left: 1180, top: 300, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,170,255,0.35), rgba(0,0,0,0) 70%)'}} />
      <MascotOverlay f={f} x={200} y={260} w={440} h={520} rotY={0.7} />
      {drunk && (
        <div style={{position: 'absolute', left: 1050, top: 150, display: 'flex', alignItems: 'center', gap: 30, fontFamily: FONT, opacity: fadeIn(f, LT(T, 's02', 4))}}>
          <Clock text={f < LT(T, 's02', 4) + 50 ? '7:00' : '0:00'} x={0} y={0} size={90} />
          <div style={{marginLeft: 330, fontSize: 130}}>🍺</div>
        </div>
      )}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ 1. チェック ============
const CHECK = ['「今日は早く寝よう」と決めた時間を ほぼ毎日過ぎている', '布団に入ってからも スマホを見ている', '朝 目覚ましを一度では止められない', '休みの日は 平日より2時間以上遅く起きる', '「自分は短い睡眠でも平気なほうだ」と思っている'];
export const Cards: React.FC<{f: number; on: (i: number) => number; hi?: number; only5?: boolean}> = ({f, on, hi, only5}) => (
  <>
    {CHECK.map((c, i) => {
      const flip = only5 ? (i === 4 ? 1 : 0) : seg(f, on(i) - 4, on(i) + 10);
      const red = hi === i;
      return (
        <div key={i} style={{position: 'absolute', left: 150, top: 170 + i * 128, width: 1200, height: 108, perspective: 1200, opacity: only5 && i !== 4 ? 0.35 : 1}}>
          <div style={{position: 'absolute', inset: 0, transform: `rotateX(${(1 - flip) * 90}deg)`, borderRadius: 18, background: '#ffffff', border: `3px solid ${red ? '#e0533d' : '#d8d4cc'}`, boxShadow: red ? '0 10px 30px rgba(224,83,61,0.3)' : '0 6px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 24, fontFamily: FONT}}>
            <div style={{fontSize: 44, fontWeight: 900, color: '#e0533d', width: 50}}>{'①②③④⑤'[i]}</div>
            <div style={{fontSize: 38, fontWeight: 800, color: '#1d2230'}}>{c}</div>
          </div>
        </div>
      );
    })}
  </>
);
const S03: React.FC<SceneProps> = ({f}) => (
  <WhiteStudio>
    <Title f={f} text="あなたは何個あてはまる？" y={60} size={56} color="#1d2230" />
    <MascotOverlay f={f} x={1500} y={480} w={340} h={380} rotY={-0.9} tone="light" />
  </WhiteStudio>
);
const S04: React.FC<SceneProps> = ({f, T}) => {
  const cur = [0, 1, 2, 3, 4].findIndex((i, _, a) => f >= LT(T, 's04', i) && (i === 4 ? f < LT(T, 's04', 5) : f < LT(T, 's04', i + 1)));
  const hi5 = f >= LT(T, 's04', 7) ? 4 : cur;
  return (
    <WhiteStudio>
      <Title f={f} text="あなたは何個あてはまる？" y={60} size={56} color="#1d2230" />
      <Cards f={f} on={(i) => LT(T, 's04', i)} hi={hi5} />
      {f >= LT(T, 's04', 6) && <div style={{position: 'absolute', left: 1360, top: 340, transform: `rotate(-10deg) scale(${interpolate(f - LT(T, 's04', 6), [0, 6, 10], [2, 0.94, 1], clamp)})`, border: '8px solid #e0533d', borderRadius: 20, padding: '10px 26px', color: '#e0533d', fontSize: 60, fontWeight: 900, fontFamily: FONT, background: 'rgba(255,255,255,0.75)'}}>入口に立っている</div>}
      <MascotOverlay f={f} x={1520} y={520} w={320} h={360} rotY={-0.9} tone="light" />
    </WhiteStudio>
  );
};
const ScreenTime: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', inset: 0, background: '#f4f5f8', padding: '90px 26px', fontFamily: FONT, color: '#1d2230'}}>
    <div style={{fontSize: 30, fontWeight: 900}}>スクリーンタイム</div>
    <div style={{fontSize: 22, color: '#778', marginTop: 6}}>今日</div>
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 8, height: 330, marginTop: 40, borderBottom: '2px solid #ccd'}}>
      {[2, 1, 1, 3, 2, 2, 3, 2, 4, 9, 12, 14].map((v, i) => <div key={i} style={{flex: 1, height: `${(v / 14) * 100 * seg(f, i * 2, i * 2 + 14)}%`, background: i >= 9 ? '#e0533d' : '#6fa8dc', borderRadius: '6px 6px 0 0'}} />)}
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#778', marginTop: 6}}><span>朝</span><span>昼</span><span>夜</span></div>
  </div>
);
const S05: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.55} />
    <PhonePOV f={f} flick={0} x={1180} y={60} scale={0.95} screen={<ScreenTime f={f} />} />
    <div style={{position: 'absolute', left: 140, top: 140, fontFamily: FONT}}>
      <Pop f={f} at={LT(T, 's05', 1)}><div style={{display: 'flex', gap: 30}}><Clock text="23:00" x={0} y={0} size={70} color="#9cf0b2" /><div style={{marginLeft: 300, fontSize: 60, color: K.ink, fontWeight: 900, marginTop: 20}}>→</div><div style={{marginLeft: 60}}><Clock text="23:30" x={0} y={0} size={70} /></div></div></Pop>
      <Pop f={f} at={LT(T, 's05', 3)} style={{marginTop: 170, fontSize: 50, fontWeight: 900, color: K.ink}}>1週間 3時間半</Pop>
      <Pop f={f} at={LT(T, 's05', 3) + 40} style={{marginTop: 20, fontSize: 70, fontWeight: 900, color: '#ff4d3d'}}>1か月 およそ15時間</Pop>
    </div>
    <Vignette />
  </AbsoluteFill>
);

// ============ 1b. 短い睡眠が普通の国 ============
const S06: React.FC<SceneProps> = ({f, T}) => {
  const g = seg(f, LT(T, 's06', 1), LT(T, 's06', 1) + 40);
  return (
    <DarkBoard>
      <Title f={f} text="OECDの国々の平均睡眠時間" y={70} size={50} />
      <Pop f={f} at={LT(T, 's06', 1)} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center'}}>
        <div style={{fontSize: 60, fontWeight: 900, color: K.ink}}>日本</div>
        <div style={{fontSize: 220, fontWeight: 900, color: '#ff4d3d', lineHeight: 1.1}}>{Math.round(442 * g)}分</div>
        <div style={{fontSize: 56, fontWeight: 900, color: '#ff7a64', opacity: g}}>比べた国の中で 一番短い</div>
      </Pop>
    </DarkBoard>
  );
};
const S07: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="1日の睡眠が6時間未満の人" y={50} size={50} />
    <Bars f={f} at={8} max={50} y={130} h={480} x={460} w={1000} items={[{label: '男性', v: 37.5, text: '37.5％', color: '#e0533d'}, {label: '女性', v: 40.6, text: '40.6％', color: '#e0533d'}]} />
    {f >= LT(T, 's07', 1) && (
      <div style={{position: 'absolute', left: 360, top: 660, display: 'flex', gap: 22}}>
        {Array.from({length: 10}, (_, i) => <Pop key={i} f={f} at={LT(T, 's07', 1) + i * 3}><PersonIcon size={100} color={i < 4 ? '#ff4d3d' : '#6c7486'} glow={i < 4 ? 0.5 : 0} /></Pop>)}
      </div>
    )}
  </DarkBoard>
);
const S08: React.FC<SceneProps> = ({f, dur, T}) => {
  const trap = f >= LT(T, 's08', 2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.6} />
      <PhonePOV f={f} flick={0} x={760} y={60} scale={1.0} thumb={false} screen={<PostsScreen f={f} />} />
      {trap && <Pop f={f} at={LT(T, 's08', 2)} from="scale" style={{position: 'absolute', left: 150, top: 200, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: '#ff4d3d'}}>落とし穴</Pop>}
      {f >= LT(T, 's08', 3) && <Pop f={f} at={LT(T, 's08', 3)} style={{position: 'absolute', left: 150, top: 340, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: K.ink, width: 560}}>削っている本人は 削れていることに気づけない</Pop>}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ 2. 就寝の先延ばし ============
const AlarmScreen: React.FC<{label: string; time: string}> = ({label, time}) => (
  <div style={{position: 'absolute', inset: 0, background: '#101420', padding: '110px 30px', fontFamily: FONT, color: '#fff'}}>
    <div style={{fontSize: 26, color: '#9fb0d0'}}>アラーム</div>
    <div style={{fontSize: 110, fontWeight: 900, marginTop: 10}}>{time}</div>
    <div style={{fontSize: 30, fontWeight: 800, marginTop: 10}}>{label}</div>
    <div style={{marginTop: 30, width: 90, height: 50, borderRadius: 25, background: '#4caf50', position: 'relative'}}><div style={{position: 'absolute', right: 4, top: 4, width: 42, height: 42, borderRadius: 21, background: '#fff'}} /></div>
  </div>
);
const S09: React.FC<SceneProps> = ({f, dur, T}) => {
  const open = f >= LT(T, 's09', 1);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.5} />
      {(() => { const t = open ? Math.min(1, (f - LT(T, 's09', 1)) / 150) : 0; const m = 22 * 60 + 30 + Math.round(t * 130); const hh = Math.floor(m / 60) % 24; return <Clock text={open ? `${hh}:${String(m % 60).padStart(2, '0')}` : '22:30'} x={150} y={120} size={90} color={open && m >= 23 * 60 ? '#ff7a64' : '#9cf0b2'} />; })()}
      <PhonePOV f={0} flick={0} x={760} y={60} scale={1.0} thumb={false} screen={<AlarmScreen label="今日は11時に寝る" time="23:00" />} />
      {open && <div style={{position: 'absolute', left: 800, top: 380, width: 420, height: 10, background: '#ff4d3d', borderRadius: 5, transform: `rotate(-8deg) scaleX(${interpolate(f - LT(T, 's09', 1), [60, 75], [0, 1], clamp)})`, transformOrigin: 'left center', boxShadow: '0 0 20px rgba(255,77,61,0.7)'}} />}
      {f >= LT(T, 's09', 1) + 20 && <Pop f={f} at={LT(T, 's09', 1) + 20} from="scale" style={{position: 'absolute', left: 140, top: 330, padding: '20px 34px', borderRadius: 18, background: K.gold, color: '#141820', fontSize: 64, fontWeight: 900, fontFamily: FONT}}>就寝の先延ばし</Pop>}
      <Vignette />
    </AbsoluteFill>
  );
};
const S10: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 1050, top: 110, width: 720, height: 520, borderRadius: 18, background: '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: 40, fontFamily: FONT, color: '#1d2230'}}>
      <div style={{fontSize: 30, fontWeight: 900, color: '#6fa8dc'}}>アンケート</div>
      {['寝ようと思っていた時間より 遅く寝ることがある', '寝る時間なのに ほかのことをしている', 'ふだんの自己管理の力', '睡眠が足りているか'].map((q, i) => (
        <Pop key={i} f={f} at={LT(T, 's10', i < 2 ? 3 : 4) + (i % 2) * 20} style={{marginTop: 26, fontSize: 30, fontWeight: 800, display: 'flex', gap: 14}}><span style={{color: '#6fa8dc'}}>Q{i + 1}</span>{q}</Pop>
      ))}
    </div>
    <StepCard f={f} at={LT(T, 's10', 2)} n="手順1" text="大人177人がネットで回答" x={120} y={160} w={820} light />
    <StepCard f={f} at={LT(T, 's10', 4)} n="手順2" text="自己管理の力と睡眠も聞く" x={120} y={330} w={820} light />
    <StepCard f={f} at={LT(T, 's10', 5)} n="手順3" text="三つの関係を調べる" x={120} y={500} w={820} light />
  </WhiteStudio>
);
export const Scatter: React.FC<{f: number; at: number; xl: string; yl: string; x?: number; y?: number; color?: string; up?: boolean}> = ({f, at, xl, yl, x = 560, y = 120, color = '#ff7a64', up = true}) => (
  <svg width={820} height={600} viewBox="0 0 820 600" style={{position: 'absolute', left: x, top: y}}>
    <line x1={90} y1={520} x2={790} y2={520} stroke="#9fb0d0" strokeWidth={4} /><line x1={90} y1={30} x2={90} y2={520} stroke="#9fb0d0" strokeWidth={4} />
    {Array.from({length: 26}, (_, i) => <circle key={i} cx={120 + i * 25} cy={(up ? 490 - i * 16 : 260) + (((i * 53) % 70) - 35)} r={12} fill={color} opacity={seg(f, at + i * 2, at + i * 2 + 8)} />)}
    <text x={440} y={580} textAnchor="middle" fill="#dfe6f5" fontSize={32} fontWeight={800} fontFamily={FONT}>{xl}</text>
    <text x={40} y={280} textAnchor="middle" fill="#dfe6f5" fontSize={32} fontWeight={800} fontFamily={FONT} transform="rotate(-90 40 280)">{yl}</text>
  </svg>
);
const S11: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Scatter f={f} at={LT(T, 's11', 1)} xl="就寝の先延ばし" yl="睡眠が足りない" x={200} />
    <Pop f={f} at={LT(T, 's11', 2)} style={{position: 'absolute', left: 1080, top: 200, width: 700, fontSize: 46, fontWeight: 900, color: K.ink}}>自己管理の力が低い人ほど 先延ばしが強い</Pop>
    <Pop f={f} at={LT(T, 's11', 3)} style={{position: 'absolute', left: 1080, top: 420, width: 700, fontSize: 56, fontWeight: 900, color: '#ff4d3d'}}>寝る時間はある なのに寝ていない</Pop>
  </DarkBoard>
);
const S12: React.FC<SceneProps> = ({f}) => (
  <WhiteStudio>
    <WallClock f={f} x={1000} y={90} size={380} speed={40} />
    <MascotOverlay f={f} x={560} y={260} w={420} h={480} rotY={0.5} tone="light" pose={{headNod: -0.25}} />
  </WhiteStudio>
);

// ============ 3. 報復性夜更かし ============
const S13: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = [0, 1, 2, 4].map((k) => LT(T, 's13', k) - 10);
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k], ld = (k + 1 < cuts.length ? cuts[k + 1] : dur) - cuts[k];
  const body = (() => {
    switch (k) {
      case 0: return (
        <DarkBoard tint="#1d2533">
          <div style={{position: 'absolute', left: 260, top: 120, display: 'flex', gap: 16}}>
            {Array.from({length: 9}, (_, i) => <PersonIcon key={i} size={150} color="#5d6880" />)}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 56, fontWeight: 900, color: K.ink}}>朝から晩まで 会社の時間</div>
        </DarkBoard>
      );
      case 1: return (
        <DarkBoard tint="#262028">
          <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontSize: 150}}>🍽️ 🧺 🧸</div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 56, fontWeight: 900, color: K.ink}}>帰ってからは 家事の時間</div>
        </DarkBoard>
      );
      case 2: return <><Still src="living" f={lf} dur={ld} dark={0.55} />{tint('#6ea0ff', 0.12)}<Clock text="23:30" x={1250} y={160} size={96} color="#9fb7ff" /><Pop f={lf} at={10} style={{position: 'absolute', left: 150, top: 200, fontFamily: FONT, fontSize: 60, fontWeight: 900, color: K.gold}}>自分の時間は 夜だけ</Pop></>;
      default: return (
        <DarkBoard>
          <Pop f={lf} at={4} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontSize: 120, fontWeight: 900, color: K.gold}}>報復性夜更かし</Pop>
          <Pop f={lf} at={30} style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontSize: 44, fontWeight: 800, color: K.ink}}>昼間に奪われた自分の時間を 夜に取り返す</Pop>
        </DarkBoard>
      );
    }
  })();
  return <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{opacity: interpolate(lf, [0, 8], [0, 1], clamp)}}>{body}</AbsoluteFill></AbsoluteFill>;
};
const S14: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 1080, top: 110, width: 700, height: 500, borderRadius: 18, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: 40, fontFamily: FONT, color: '#1d2230'}}>
      <div style={{fontSize: 34, fontWeight: 900}}>今日 我慢したこと</div>
      {['おやつ', '買い物', 'スマホ', 'イライラ'].map((s, i) => <Pop key={i} f={f} at={LT(T, 's14', 3) + i * 12} style={{marginTop: 26, fontSize: 32, fontWeight: 800, display: 'flex', gap: 14}}><span style={{color: '#e0533d'}}>☑</span>{s}</Pop>)}
    </div>
    <StepCard f={f} at={LT(T, 's14', 3)} n="手順1" text="前の日に我慢した欲求の数" x={120} y={200} w={860} light />
    <StepCard f={f} at={LT(T, 's14', 4)} n="手順2" text="その夜の寝る先延ばし" x={120} y={370} w={860} light />
    <StepCard f={f} at={LT(T, 's14', 5)} n="手順3" text="二つを比べる" x={120} y={540} w={860} light />
  </WhiteStudio>
);
const S15: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="昼間の我慢と その夜の先延ばし" y={60} size={50} />
    <div style={{position: 'absolute', left: 260, right: 260, top: 190, display: 'flex', justifyContent: 'space-between'}}>
      {[['我慢が少なかった人', '先延ばし 少ない', '#6c7a96'], ['我慢が多かった人', '先延ばし 多い', '#e0533d']].map(([a1, b1, c], i) => (
        <Pop key={i} f={f} at={LT(T, 's15', 1) + i * 24} from="scale">
          <div style={{width: 560, height: 380, borderRadius: 26, background: `${c}22`, border: `4px solid ${c}`, textAlign: 'center', paddingTop: 50}}>
            <div style={{fontSize: 44, fontWeight: 900}}>{a1}</div>
            <div style={{fontSize: 110, margin: '20px 0'}}>{i ? '🌙🌙🌙' : '🌙'}</div>
            <div style={{fontSize: 48, fontWeight: 900, color: i ? '#ff4d3d' : K.sub}}>{b1}</div>
          </div>
        </Pop>
      ))}
    </div>
    <Pop f={f} at={LT(T, 's15', 3)} style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontSize: 52, fontWeight: 900, color: '#ff4d3d'}}>がんばった日ほど 夜は自分を止められない</Pop>
  </DarkBoard>
);

// ============ 4. 布団の中のスマホ ============
const S16: React.FC<SceneProps> = ({f, dur, T}) => {
  const lab = f >= LT(T, 's16', 2);
  if (!lab) return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.75} from={1.12} to={1.18} />
      <PhoneLight f={f} k={1.6} />
      <Pop f={f} at={20} style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: FONT, fontSize: 96, fontWeight: 900, color: '#9fb7ff', textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>布団の中の 画面の光</Pop>
      <Pop f={f} at={LT(T, 's16', 1)} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 400, textAlign: 'center', fontFamily: FONT, fontSize: 72, fontWeight: 900, color: '#ff4d3d', textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>眠りが 遠ざかる</Pop>
      <Vignette />
    </AbsoluteFill>
  );
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 1180, top: 160, display: 'flex', gap: 60, fontFamily: FONT}}>
        <Pop f={f} at={LT(T, 's16', 5)}><div style={{textAlign: 'center'}}><div style={{width: 220, height: 300, borderRadius: 20, background: '#0d0f13', boxShadow: '0 0 60px rgba(120,170,255,0.6)', border: '4px solid #333'}}><div style={{margin: 14, height: 268, borderRadius: 12, background: 'linear-gradient(160deg, #dfe8ff, #9fb7ff)'}} /></div><div style={{fontSize: 34, fontWeight: 900, marginTop: 14}}>タブレット 5晩</div></div></Pop>
        <Pop f={f} at={LT(T, 's16', 5) + 30}><div style={{textAlign: 'center'}}><div style={{width: 220, height: 300, borderRadius: 8, background: '#f4ead8', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} /><div style={{fontSize: 34, fontWeight: 900, marginTop: 14}}>紙の本 5晩</div></div></Pop>
      </div>
      <StepCard f={f} at={LT(T, 's16', 4)} n="手順1" text="12人が研究施設に泊まる" x={120} y={140} w={900} />
      <StepCard f={f} at={LT(T, 's16', 5)} n="手順2" text="寝る前の4時間 読書をする" x={120} y={300} w={900} />
      <StepCard f={f} at={LT(T, 's16', 6)} n="手順3" text="ホルモン 寝つき 翌朝の目覚めを測る" x={120} y={460} w={900} />
    </DarkBoard>
  );
};
const S17: React.FC<SceneProps> = ({f, T}) => {
  const p = seg(f, 10, 120);
  const line = (low: boolean) => Array.from({length: 40}, (_, i) => {
    const u = i / 39;
    if (u > p) return null;
    const v = low ? Math.max(0, u - 0.25) * 0.7 : u * 1.0;
    return `${100 + u * 900},${520 - v * 400}`;
  }).filter(Boolean).join(' ');
  return (
    <DarkBoard>
      <Title f={f} text="夜に 眠りを促すホルモン" y={50} size={50} />
      <svg width={1100} height={600} viewBox="0 0 1100 600" style={{position: 'absolute', left: 120, top: 130}}>
        <line x1={100} y1={520} x2={1040} y2={520} stroke="#9fb0d0" strokeWidth={4} />
        <polyline points={line(false)} fill="none" stroke="#f4ead8" strokeWidth={10} />
        <polyline points={line(true)} fill="none" stroke="#7fa2ff" strokeWidth={10} />
        <text x={570} y={580} textAnchor="middle" fill="#dfe6f5" fontSize={32} fontWeight={800} fontFamily={FONT}>夜の時間</text>
      </svg>
      <div style={{position: 'absolute', left: 1260, top: 200, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{fontSize: 38, fontWeight: 900, color: '#f4ead8'}}>― 紙の本</div>
        <div style={{fontSize: 38, fontWeight: 900, color: '#7fa2ff'}}>― タブレット</div>
        <Pop f={f} at={LT(T, 's17', 2)}><div style={{fontSize: 44, fontWeight: 900, color: '#ff4d3d', marginTop: 30}}>寝つくまで およそ10分長い</div></Pop>
        <Pop f={f} at={LT(T, 's17', 3)}><div style={{fontSize: 40, fontWeight: 900, color: K.ink}}>夢を見る眠りが減る</div></Pop>
        <Pop f={f} at={LT(T, 's17', 4)}><div style={{fontSize: 40, fontWeight: 900, color: K.ink}}>翌朝の目覚めが悪い</div></Pop>
      </div>
    </DarkBoard>
  );
};
const S18: React.FC<SceneProps> = ({f, dur, T}) => {
  const off = f >= LT(T, 's18', 0) + 70;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={off ? 0.85 : 0.65} />
      {!off && <PhoneLight f={f} k={1.4} />}
      {!off && <Pop f={f} at={10} style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: FONT, fontSize: 84, fontWeight: 900, color: '#9fb7ff', textShadow: '0 4px 24px rgba(0,0,0,0.9)'}}>スマホを置いても…</Pop>}
      {off && <Pop f={f} at={LT(T, 's18', 0) + 74} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontSize: 140}}>👁️</Pop>}
      <Vignette />
    </AbsoluteFill>
  );
};
export const Ring: React.FC<{f: number; active: number; items: string[]; r?: number; cx?: number; cy?: number}> = ({f, active, items, r = 300, cx = 960, cy = 430}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0533d" strokeWidth={6} strokeDasharray={`${r * 0.6} ${r * 6}`} transform={`rotate(${f * 2.4} ${cx} ${cy})`} />
    </svg>
    {items.map((s, i) => {
      const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const on = i === active;
      return (
        <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * r - 180, top: cy + Math.sin(a) * r - 40, width: 360, textAlign: 'center', fontFamily: FONT}}>
          <div style={{display: 'inline-block', padding: '12px 22px', borderRadius: 16, fontSize: 36, fontWeight: 900, background: on ? '#e0533d' : 'rgba(20,24,34,0.95)', color: on ? '#fff' : K.ink, border: `3px solid ${on ? '#ff7a64' : 'rgba(255,255,255,0.15)'}`}}>{s}</div>
        </div>
      );
    })}
  </>
);
const S19: React.FC<SceneProps> = ({f, T}) => {
  const a = f < LT(T, 's19', 4) ? -1 : Math.floor((f - LT(T, 's19', 4)) / 25) % 6;
  return (
    <DarkBoard>
      <Ring f={f} active={a} items={['寝るのを先延ばし', '布団でスマホ', '寝つけない', '朝つらい', '昼間がまんの一日', '夜に取り返したい']} r={310} />
      <Pop f={f} at={LT(T, 's19', 3)} style={{position: 'absolute', left: 60, top: 740, width: 760, fontSize: 30, fontWeight: 800, color: K.sub}}>子ども12万人あまり 寝室にあるだけで 睡眠不足と質の悪さが増える</Pop>
    </DarkBoard>
  );
};

// ============ 5. 気づけない ============
const S20: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 1180, top: 120, width: 600, padding: 30, borderRadius: 18, background: '#f4f1ea', fontFamily: FONT, color: '#1d2230'}}>
      <div style={{fontSize: 30, fontWeight: 900, marginBottom: 14}}>14日間</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10}}>
        {Array.from({length: 14}, (_, i) => <div key={i} style={{height: 64, borderRadius: 8, background: f > LT(T, 's20', 5) + i * 6 ? '#e0533d' : '#d9d3c7', color: '#fff', fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>)}
      </div>
    </div>
    <StepCard f={f} at={LT(T, 's20', 4)} n="手順1" text="健康な大人48人が研究施設で生活" x={120} y={120} w={960} />
    <StepCard f={f} at={LT(T, 's20', 5)} n="手順2" text="寝床の時間 8時間／6時間／4時間で14日" x={120} y={280} w={960} />
    <StepCard f={f} at={LT(T, 's20', 5, 1)} n="別に" text="3晩まったく寝ないグループ" x={120} y={440} w={960} />
    <StepCard f={f} at={LT(T, 's20', 6)} n="手順3" text="毎日 注意力の検査と眠さを答える" x={120} y={600} w={960} />
  </DarkBoard>
);
const Lines: React.FC<{f: number; at: number; series: {pts: (u: number) => number; color: string; label: string}[]; xl: string; yl: string}> = ({f, at, series, xl, yl}) => {
  const p = seg(f, at, at + 110);
  return (
    <svg width={1500} height={640} viewBox="0 0 1500 640" style={{position: 'absolute', left: 150, top: 120}}>
      <line x1={120} y1={560} x2={1180} y2={560} stroke="#9fb0d0" strokeWidth={4} /><line x1={120} y1={40} x2={120} y2={560} stroke="#9fb0d0" strokeWidth={4} />
      {series.map((s, j) => {
        const pts = Array.from({length: 50}, (_, i) => i / 49).filter((u) => u <= p).map((u) => `${120 + u * 1060},${560 - s.pts(u) * 480}`).join(' ');
        const end = 560 - s.pts(Math.min(1, p)) * 480;
        return (
          <g key={j}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={9} strokeLinecap="round" />
            <text x={1200} y={end + 12} fill={s.color} fontSize={36} fontWeight={900} fontFamily={FONT} opacity={p > 0.95 ? 1 : 0}>{s.label}</text>
          </g>
        );
      })}
      <text x={650} y={620} textAnchor="middle" fill="#dfe6f5" fontSize={32} fontWeight={800} fontFamily={FONT}>{xl}</text>
      <text x={60} y={300} textAnchor="middle" fill="#dfe6f5" fontSize={32} fontWeight={800} fontFamily={FONT} transform="rotate(-90 60 300)">{yl}</text>
    </svg>
  );
};
const S21: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Lines f={f} at={LT(T, 's21', 1) - 10} xl="日数（14日）" yl="見落とし" series={[{pts: () => 0.08, color: '#6fa8dc', label: '8時間'}, {pts: (u) => 0.08 + 0.45 * u, color: '#e8a04c', label: '6時間'}, {pts: (u) => 0.08 + 0.75 * u, color: '#e0533d', label: '4時間'}]} />
    <Pop f={f} at={LT(T, 's21', 3)} from="scale" style={{position: 'absolute', left: 520, top: 80, padding: '14px 30px', borderRadius: 16, background: 'rgba(224,83,61,0.2)', border: '3px solid #e0533d', fontSize: 46, fontWeight: 900, color: '#ff7a64'}}>最大で 2晩徹夜と同じ</Pop>
  </DarkBoard>
);
const S22: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Lines f={f} at={LT(T, 's22', 1) - 10} xl="日数（14日）" yl="" series={[{pts: (u) => 0.08 + 0.6 * u, color: '#e0533d', label: '見落とし'}, {pts: (u) => 0.08 + 0.25 * Math.min(1, u * 4), color: '#9cf0b2', label: '感じた眠さ'}]} />
    <Pop f={f} at={LT(T, 's22', 2)} style={{position: 'absolute', left: 300, top: 80, fontSize: 54, fontWeight: 900, color: '#ff4d3d'}}>頭は落ち続ける なのに本人は気づかない</Pop>
  </DarkBoard>
);
const S23: React.FC<SceneProps> = ({f}) => {
  const noise = seg(f, 10, 200);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 1020, top: 100, width: 520, height: 700, borderRadius: 30, background: 'linear-gradient(160deg, #e6ecf3, #c7d2de)', border: '14px solid #b9b2a6', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: -100, top: 120, filter: `contrast(${1 + noise * 1.2}) blur(${noise * 1.5}px)`, opacity: 0.9}}><MascotOverlay f={f} x={0} y={0} w={620} h={560} rotY={-0.4} tone="light" /></div>
      </div>
      <MascotOverlay f={f} x={420} y={220} w={460} h={520} rotY={0.6} tone="light" />
    </WhiteStudio>
  );
};
const S24: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's24', 6);
  const glasses = res ? 4 : Math.min(4, Math.max(0, Math.floor((f - LT(T, 's24', 4)) / 25)));
  if (f >= LT(T, 's24', 8)) {
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <Still src="bed" f={f - LT(T, 's24', 8)} dur={400} dark={0.65} />
        <PhoneLight f={f} k={1.1} />
        <div style={{position: 'absolute', left: 150, top: 150, width: 900, height: 140}}><div style={{position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap'}}><Clock text="0:00〜2:00" x={0} y={0} size={72} /></div></div>
        <Pop f={f} at={LT(T, 's24', 9)} style={{position: 'absolute', left: 150, top: 360, fontFamily: FONT, fontSize: 56, fontWeight: 900, color: '#ff4d3d', width: 860}}>お酒を飲んだ人の頭と 同じくらい鈍っている</Pop>
        <Vignette />
      </AbsoluteFill>
    );
  }
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 1120, top: 140, width: 640, height: 420, borderRadius: 18, background: '#10141c', border: '14px solid #2a2f3a', fontFamily: FONT}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontSize: 110, color: (f % 50) < 25 ? '#ffd166' : '#2a2f3a'}}>●</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, textAlign: 'center', fontSize: 28, color: K.sub}}>光ったらすぐ押す</div>
      </div>
      <div style={{position: 'absolute', left: 1140, top: 600, display: 'flex', gap: 24, fontSize: 90}}>{Array.from({length: glasses}, (_, i) => <span key={i}>🥃</span>)}</div>
      <StepCard f={f} at={LT(T, 's24', 3)} n="手順1" text="眠らずに起き続けて検査" x={120} y={160} w={900} />
      <StepCard f={f} at={LT(T, 's24', 4)} n="手順2" text="別の日にお酒を少しずつ飲んで検査" x={120} y={320} w={900} />
      <StepCard f={f} at={LT(T, 's24', 5)} n="手順3" text="二つの成績を比べる" x={120} y={480} w={900} />
      {res && <Pop f={f} at={LT(T, 's24', 7)} from="scale" style={{position: 'absolute', left: 120, top: 640, width: 960, padding: '20px 30px', borderRadius: 18, background: 'rgba(224,83,61,0.18)', border: '3px solid #e0533d', fontSize: 40, fontWeight: 900, color: K.ink}}>起きて17〜19時間 ＝ 血中アルコール0.05％と同じかそれ以下</Pop>}
    </DarkBoard>
  );
};

export const SCENES_Y1: Record<string, React.FC<SceneProps>> = {
  s00: S00, s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08, s09: S09, s10: S10, s11: S11, s12: S12,
  s13: S13, s14: S14, s15: S15, s16: S16, s17: S17, s18: S18, s19: S19, s20: S20, s21: S21, s22: S22, s23: S23, s24: S24,
};
