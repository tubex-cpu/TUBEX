import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {BrainShot, Clock, DarkBoard, PhonePOV, R, SceneProps, StepCard, Still, Title, WhiteStudio, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Pop, clamp, fadeIn} from './ui';

const tint = (c: string, a: number) => <AbsoluteFill style={{background: c, opacity: a, mixBlendMode: 'multiply'}} />;

// ============ 0. オープニング ============
const OScroll: React.FC<SceneProps> = ({f, dur, T}) => {
  const jump = T('O1', 1) - 4;
  const after = f >= jump;
  const shake = f >= jump && f < jump + 8 ? Math.sin(f * 3.1) * 10 : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.62} from={1.08} to={1.14} />
      <PhonePOV f={f} flick={13} x={760} y={60} scale={1.05} clock={after ? '1:52' : '0:14'} />
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        <Clock text={after ? '1:52' : '0:14'} x={160} y={120} size={110} a={fadeIn(f, 6, 10)} />
      </AbsoluteFill>
      {f >= jump && f < jump + 5 && <AbsoluteFill style={{background: 'rgba(255,255,255,0.18)'}} />}
      <Vignette />
    </AbsoluteFill>
  );
};

const OMontage: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = ['O2', 'O3', 'O4', 'O5', 'O6', 'O7'].map((id) => T(id) - 10);
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k];
  const ld = (k + 1 < cuts.length ? cuts[k + 1] : dur) - cuts[k];
  const inA = interpolate(lf, [0, 8], [0, 1], clamp);
  const body = (() => {
    switch (k) {
      case 0: return (
        <>
          <Still src="living" f={lf} dur={ld} dark={0.2} />
          {tint('#ffb070', 0.35)}
          <Clock text={lf < 40 ? '13:05' : '17:42'} x={150} y={120} size={84} color="#ffd29a" />
          <PhonePOV f={lf} flick={22} x={1180} y={120} scale={0.78} tilt={-10} />
        </>
      );
      case 1: return (
        <>
          <Still src="desk" f={lf} dur={ld} dark={0.25} blur={3} />
          <PhonePOV f={lf} flick={20} x={760} y={90} scale={0.92} tilt={6} />
          <div style={{position: 'absolute', left: 150, top: 140, width: 420, padding: 26, borderRadius: 16, background: 'rgba(245,247,252,0.92)', fontFamily: FONT, color: '#1d2230', fontSize: 30, fontWeight: 800, opacity: fadeIn(lf, 4)}}>
            今日のタスク
            {['資料の修正', '見積もりの返信', '会議の準備'].map((s, i) => <div key={i} style={{fontSize: 28, fontWeight: 600, marginTop: 14}}>□ {s}</div>)}
          </div>
        </>
      );
      case 2: return (
        <>
          <Still src="living" f={lf} dur={ld} dark={0.45} blur={4} />
          <PhonePOV f={lf} flick={24} x={430} y={140} scale={0.8} tilt={-8} />
          <PhonePOV f={lf + 40} flick={30} x={1090} y={140} scale={0.8} tilt={8} thumb={false} />
        </>
      );
      case 3: {
        const p = (lf * 2.6) % 100;
        return (
          <DarkBoard tint="#1a1f2b">
            <div style={{position: 'absolute', left: 260, top: 110, width: 1400, height: 690, borderRadius: 18, background: 'linear-gradient(135deg, #2d3b55, #11151d)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at ${30 + p * 0.4}% 45%, rgba(255,190,120,0.45) 0%, rgba(0,0,0,0) 40%)`}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center', fontSize: 150, color: '#fff', fontFamily: FONT, fontWeight: 900, opacity: 0.85}}>⏩</div>
              <div style={{position: 'absolute', right: 40, top: 30, fontSize: 54, fontWeight: 900, color: '#ffd166', fontFamily: FONT}}>×2.0</div>
              <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.25)'}}><div style={{width: `${p}%`, height: '100%', borderRadius: 5, background: '#ff4d4d'}} /></div>
            </div>
          </DarkBoard>
        );
      }
      case 4: return (
        <>
          <Still src="bed" f={lf} dur={ld} dark={0.6} from={1.1} to={1.16} />
          <PhonePOV f={lf} flick={18} x={760} y={60} scale={1.0} clock={lf < ld / 2 ? '23:10' : '0:10'} />
          <Clock text={lf < ld / 2 ? '23:10' : '0:10'} x={160} y={120} size={90} />
        </>
      );
      default: {
        const wob = Math.sin(lf / 14) * 0.6;
        return (
          <>
            <AbsoluteFill style={{filter: 'blur(2px) saturate(0.6)', transform: `rotate(${wob}deg) scale(1.05)`}}><Still src="bedLamp" f={lf} dur={ld} dark={0.1} /></AbsoluteFill>
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(190,210,255,0.35), rgba(255,255,255,0.05))'}} />
            <Clock text="7:00" x={150} y={120} size={110} color="#ff6b4a" a={0.5 + 0.5 * Math.abs(Math.sin(lf / 8))} />
          </>
        );
      }
    }
  })();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: inA}}>{body}</AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

const OTired: React.FC<SceneProps> = ({f, dur, T}) => {
  const melt = seg(f, T('O11', 1), T('O11', 2) + 40);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.7} from={1.12} to={1.2} />
      <AbsoluteFill style={{filter: `blur(${melt * 10}px)`, transform: `translateY(${melt * 120}px) scaleY(${1 - melt * 0.35})`, opacity: 1 - melt * 0.6}}>
        <PhonePOV f={f} flick={f < T('O9') ? 0 : 34} x={760} y={60} scale={1.05 + 0.1 * seg(f, 0, dur)} />
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};

const OWord: React.FC<SceneProps> = ({f, T}) => {
  const icons: [string, string, string][] = [['📱', 'ショート動画', 'O13'], ['💬', 'SNS', 'O13'], ['🎮', 'ゲーム', 'O13']];
  const shake = f > T('O15') ? Math.sin(f * 0.9) * 2 : 0;
  return (
    <DarkBoard>
      <Pop f={f} at={4} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
        <div style={{fontSize: 170, fontWeight: 900, color: '#ff3b30', letterSpacing: '0.06em', transform: `translateX(${shake}px)`, textShadow: '0 8px 40px rgba(255,59,48,0.4)'}}>ドパガキ</div>
      </Pop>
      <Pop f={f} at={T('O12', 1)} style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontSize: 56, fontWeight: 900}}>＝ ドーパミン中毒のガキ</Pop>
      <div style={{position: 'absolute', left: 300, right: 300, top: 470, display: 'flex', justifyContent: 'space-around'}}>
        {icons.map(([ic, lb], i) => (
          <Pop key={i} f={f} at={T('O13') + i * 12} from="scale">
            <div style={{textAlign: 'center'}}><div style={{fontSize: 120}}>{ic}</div><div style={{fontSize: 40, fontWeight: 800, color: K.sub}}>{lb}</div></div>
          </Pop>
        ))}
      </div>
      <MascotOverlay f={f} x={1460} y={500} w={380} h={420} rotY={-0.6} />
    </DarkBoard>
  );
};

const OThree: React.FC<SceneProps> = ({f, T}) => {
  const rows: [string, string, string, string][] = [['O17', '一つ目', 'なぜスマホはやめられないのか', '脳の中で起きていること'], ['O18', '二つ目', '脳と体に起きる本当にヤバいこと', '無気力 慢性疲労 脳そのものの変化'], ['O20', '三つ目', 'ドパガキから抜け出す方法', '実験で効果が出た方法']];
  return (
    <DarkBoard>
      <Title f={f} text="今日わかること" y={70} size={58} color={K.gold} />
      {rows.map(([id, n, t, s], i) => {
        const on = f >= T(id);
        const cur = on && (i === 2 || f < T(rows[i + 1][0]));
        return (
          <Pop key={i} f={f} at={T(id)} from="left" style={{position: 'absolute', left: 230, top: 200 + i * 205, width: 1460}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 34, padding: '26px 40px', borderRadius: 22, background: cur ? 'rgba(232,196,106,0.14)' : 'rgba(255,255,255,0.05)', border: `2px solid ${cur ? K.gold : 'rgba(255,255,255,0.1)'}`}}>
              <div style={{fontSize: 40, fontWeight: 900, color: '#141820', background: K.gold, borderRadius: 12, padding: '8px 20px'}}>{n}</div>
              <div><div style={{fontSize: 54, fontWeight: 900}}>{t}</div><div style={{fontSize: 32, color: i === 1 ? '#ff7a64' : K.sub, marginTop: 6, fontWeight: 800}}>{s}</div></div>
            </div>
          </Pop>
        );
      })}
    </DarkBoard>
  );
};

// ============ 1. あなたで試す ============
const CHECK = ['用もないのにスマホを開き 閉じてすぐまた開いている', '動画は倍速か早送りでないともどかしい', 'ベッドの中でスマホを見ながら眠りに落ちる', '嫌なことがあるとまずスマホを開く', '何もしない時間が5分あると落ち着かない'];
const K1Cards: React.FC<SceneProps> = ({f, T}) => {
  const ids = ['A3', 'A4', 'A5', 'A6', 'A7'];
  const stamp = T('A9');
  return (
    <WhiteStudio>
      <Title f={f} text="あなたは何個あてはまる？" y={60} size={56} color="#1d2230" />
      {CHECK.map((c, i) => {
        const at = T(ids[i]);
        const flip = seg(f, at - 4, at + 10);
        const cur = f >= at && (i === 4 ? f < T('A8') : f < T(ids[i + 1]));
        return (
          <div key={i} style={{position: 'absolute', left: 170, top: 170 + i * 128, width: 1150, height: 108, perspective: 1200}}>
            <div style={{position: 'absolute', inset: 0, transform: `rotateX(${(1 - flip) * 90}deg)`, transformOrigin: '50% 50%', borderRadius: 18, background: '#ffffff', border: `3px solid ${cur ? '#e0533d' : '#d8d4cc'}`, boxShadow: cur ? '0 10px 30px rgba(224,83,61,0.25)' : '0 6px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 24}}>
              <div style={{fontSize: 44, fontWeight: 900, color: '#e0533d', width: 50}}>{'①②③④⑤'[i]}</div>
              <div style={{fontSize: 38, fontWeight: 800, color: '#1d2230'}}>{c}</div>
            </div>
          </div>
        );
      })}
      {f >= stamp && (
        <div style={{position: 'absolute', left: 1180, top: 330, transform: `rotate(-12deg) scale(${interpolate(f - stamp, [0, 6, 10], [2.2, 0.92, 1], clamp)})`, opacity: interpolate(f - stamp, [0, 4], [0, 1], clamp), border: '10px solid #e0533d', borderRadius: 24, padding: '14px 34px', color: '#e0533d', fontSize: 92, fontWeight: 900, fontFamily: FONT, background: 'rgba(255,255,255,0.7)'}}>ドパガキ確定</div>
      )}
      <MascotOverlay f={f} x={1500} y={520} w={340} h={380} rotY={-0.9} tone="light" />
    </WhiteStudio>
  );
};

const Timer: React.FC<{f: number; run: number; x: number; y: number; scale?: number; light?: boolean}> = ({f, run, x, y, scale = 1, light = true}) => {
  const s = Math.max(0, 900 - Math.max(0, f - run) / 30 * 8);
  const mm = Math.floor(s / 60), ss = Math.floor(s % 60);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'top left', width: 520, height: 330, borderRadius: 40, background: light ? '#f6f4ef' : '#1a1e27', boxShadow: '0 20px 60px rgba(0,0,0,0.25), inset 0 -8px 0 rgba(0,0,0,0.08)', border: '3px solid #d8d4cc'}}>
      <div style={{position: 'absolute', left: 40, right: 40, top: 50, height: 170, borderRadius: 20, background: '#1f2a24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Noto Sans JP", monospace', fontWeight: 900, fontSize: 130, color: '#9cf0b2'}}>{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</div>
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 110 + i * 120, top: 245, width: 70, height: 50, borderRadius: 14, background: i === 1 ? '#e0533d' : '#c9c3b8'}} />)}
    </div>
  );
};
const K1Timer: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 300, top: 600, width: 1320, height: 26, borderRadius: 13, background: '#d6d1c8'}} />
    <Pop f={f} at={T('A13')} style={{position: 'absolute', left: 380, top: 470}}>
      <div style={{width: 230, height: 120, borderRadius: 26, background: '#15171c', boxShadow: '0 12px 30px rgba(0,0,0,0.3)', transform: 'rotate(-6deg)'}} />
    </Pop>
    <Pop f={f} at={T('A13', 1)} from="scale" style={{position: 'absolute', left: 800, top: 180}}><Timer f={f} run={T('A15')} x={0} y={0} /></Pop>
    <Pop f={f} at={T('A14')} style={{position: 'absolute', left: 1400, top: 200, display: 'flex', flexDirection: 'column', gap: 26}}>
      {['📖', '🎧', '📱'].map((s, i) => <div key={i} style={{position: 'relative', fontSize: 84, opacity: 0.55}}>{s}<div style={{position: 'absolute', left: -6, top: 48, width: 120, height: 10, background: '#e0533d', transform: 'rotate(-30deg)', borderRadius: 5}} /></div>)}
    </Pop>
    <MascotOverlay f={f} x={120} y={170} w={330} h={380} rotY={0.7} tone="light" />
  </WhiteStudio>
);

// ============ 2. 退屈より電気ショック ============
const ShockRoom: React.FC<{f: number; glow?: number; person?: boolean; zoom?: number; press?: number}> = ({f, glow = 0, person = false, zoom = 1, press = 0}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 10%, #3a3f4a 0%, #15171c 60%, #0a0b0e 100%)', transform: `scale(${zoom})`, transformOrigin: '58% 55%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 640, bottom: 0, background: 'linear-gradient(180deg, #23262d, #121418)'}} />
    <div style={{position: 'absolute', left: 860, top: 70, width: 200, height: 26, borderRadius: 13, background: '#f5f1e6', boxShadow: '0 0 80px 30px rgba(255,245,220,0.25)'}} />
    {/* desk */}
    <div style={{position: 'absolute', left: 740, top: 520, width: 640, height: 36, borderRadius: 8, background: '#6b5a48'}} />
    <div style={{position: 'absolute', left: 780, top: 556, width: 24, height: 200, background: '#4d4033'}} /><div style={{position: 'absolute', left: 1316, top: 556, width: 24, height: 200, background: '#4d4033'}} />
    {/* the device with one button */}
    <div style={{position: 'absolute', left: 1080, top: 430, width: 200, height: 92, borderRadius: 14, background: '#d9d6cf', boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}}>
      <div style={{position: 'absolute', left: 64, top: 12 + press * 6, width: 72, height: 48, borderRadius: 24, background: '#e0533d', boxShadow: `0 0 ${20 + 40 * glow}px rgba(255,80,60,${0.3 + 0.6 * glow})`}} />
      <div style={{position: 'absolute', left: -90, top: 60, width: 100, height: 6, background: '#333', borderRadius: 3}} />
    </div>
    {/* chair + person */}
    <div style={{position: 'absolute', left: 560, top: 470, width: 170, height: 260, borderRadius: 18, background: '#2e333d'}} />
    {person && <div style={{position: 'absolute', left: 540, top: 300}}><PersonIcon size={210} color="#9aa6bd" /></div>}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)'}} />
    <div style={{display: 'none'}}>{f}</div>
  </AbsoluteFill>
);
const K2Room: React.FC<SceneProps> = ({f, dur}) => <AbsoluteFill><ShockRoom f={f} zoom={1 + 0.05 * seg(f, 0, dur)} /></AbsoluteFill>;
const K2Step1: React.FC<SceneProps> = ({f, T}) => {
  const zap = (f - T('B3') - 30) % 50 < 6 && f > T('B3') + 20 && f < T('B4');
  return (
    <DarkBoard>
      <StepCard f={f} at={4} n="手順1" text="弱い電気ショックを体験する" />
      <div style={{position: 'absolute', left: 180, top: 280, width: 560, height: 470}}>
        <svg width={560} height={470} viewBox="0 0 560 470">
          <path d="M 200 0 L 300 0 L 310 330 C 312 380 340 400 420 410 C 470 416 480 450 450 460 L 230 460 C 205 460 196 440 198 400 Z" fill="#d9a888" />
          <rect x={190} y={290} width={130} height={46} rx={14} fill="#2d3340" />
          <path d="M 320 312 C 380 300 420 260 470 250" stroke="#2d3340" strokeWidth={8} fill="none" />
          {zap && <path d="M 470 180 L 430 250 L 470 250 L 420 340" stroke="#ffd166" strokeWidth={12} fill="none" strokeLinejoin="round" />}
        </svg>
      </div>
      <Pop f={f} at={T('B5')} style={{position: 'absolute', left: 860, top: 300, width: 900}}>
        <div style={{padding: '34px 40px', borderRadius: 22, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.15)'}}>
          <div style={{fontSize: 44, fontWeight: 900, lineHeight: 1.4}}>この電気ショックを<br />お金を払ってでも避けたいか</div>
          <div style={{display: 'flex', gap: 30, marginTop: 34}}>
            {['避けたい', '避けなくていい'].map((s, i) => {
              const on = i === 0 && f >= T('B6');
              return <div key={i} style={{flex: 1, textAlign: 'center', padding: '18px 0', borderRadius: 14, fontSize: 40, fontWeight: 900, background: on ? K.gold : 'rgba(255,255,255,0.08)', color: on ? '#141820' : K.ink, opacity: i === 1 && f >= T('B6') ? 0.35 : 1}}>{on ? '✓ ' : ''}{s}</div>;
            })}
          </div>
        </div>
      </Pop>
    </DarkBoard>
  );
};
const K2Step2: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill>
    <ShockRoom f={f} person zoom={1.02 + 0.04 * seg(f, 0, dur)} />
    <StepCard f={f} at={4} n="手順2" text="一人で15分 ただ考える" />
    <Pop f={f} at={T('B8')} style={{position: 'absolute', left: 140, top: 250, display: 'flex', gap: 30}}>
      {['📱', '📖', '🖊️'].map((s, i) => <div key={i} style={{position: 'relative', fontSize: 80, opacity: 0.7}}>{s}<div style={{position: 'absolute', left: -6, top: 44, width: 110, height: 10, background: '#e0533d', transform: 'rotate(-30deg)', borderRadius: 5}} /></div>)}
    </Pop>
    <Pop f={f} at={T('B9', 1)} from="scale" style={{position: 'absolute', left: 1440, top: 130}}><Clock text="15:00" x={0} y={0} size={86} color="#9cf0b2" /></Pop>
  </AbsoluteFill>
);
const K2Step3: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill>
    <ShockRoom f={f} person glow={0.5 + 0.5 * Math.sin(f / 6)} zoom={1 + 0.35 * seg(f, T('B11') - 10, T('B11') + 40)} />
    <StepCard f={f} at={4} n="手順3" text="ボタンを押せば さっきの電気ショックを自分に流せる" w={1100} />
    <div style={{display: 'none'}}>{dur}</div>
  </AbsoluteFill>
);
const Dots: React.FC<{f: number; at: number; n: number; red: number; x: number; y: number; cols: number; size?: number}> = ({f, at, n, red, x, y, cols, size = 64}) => (
  <div style={{position: 'absolute', left: x, top: y, width: cols * (size + 10)}}>
    {Array.from({length: n}, (_, i) => {
      const on = f >= at + 8 + i * 3;
      const isRed = i < red && f >= at + 20 + n * 3 + i * 4;
      return <div key={i} style={{position: 'absolute', left: (i % cols) * (size + 10), top: Math.floor(i / cols) * (size * 1.2 + 10), opacity: on ? 1 : 0}}><PersonIcon size={size} color={isRed ? '#ff4d3d' : '#6c7486'} glow={isRed ? 0.6 : 0} /></div>;
    })}
  </div>
);
const K2Result: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="自分に電気ショックを流した人" y={60} size={56} />
    <div style={{position: 'absolute', left: 170, top: 170, fontSize: 48, fontWeight: 900}}>男性</div>
    <Dots f={f} at={T('B15')} n={18} red={12} x={170} y={250} cols={6} size={92} />
    <Pop f={f} at={T('B15') + 80} from="scale" style={{position: 'absolute', left: 170, top: 720, fontSize: 70, fontWeight: 900, color: '#ff4d3d'}}>18人中12人</Pop>
    <div style={{position: 'absolute', left: 1000, top: 170, fontSize: 48, fontWeight: 900}}>女性</div>
    <Dots f={f} at={T('B16')} n={24} red={6} x={1000} y={250} cols={8} size={72} />
    <Pop f={f} at={T('B16') + 60} from="scale" style={{position: 'absolute', left: 1000, top: 720, fontSize: 70, fontWeight: 900, color: '#ff4d3d'}}>24人中6人</Pop>
  </DarkBoard>
);
const K2Mascot: React.FC<SceneProps> = ({f, T}) => {
  const morph = seg(f, T('B21', 1) - 6, T('B21', 1) + 14);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 260, top: 640, width: 1400, height: 24, borderRadius: 12, background: '#d6d1c8'}} />
      <MascotOverlay f={f} x={420} y={180} w={460} h={500} rotY={0.4} tone="light" pose={{armR: 0.4 + 0.15 * Math.sin(f / 3), armL: 0.2}} />
      <div style={{position: 'absolute', left: 1040, top: 330, transform: 'scale(0.7)', transformOrigin: 'top left'}}><Timer f={f} run={0} x={0} y={0} /></div>
      <Pop f={f} at={T('B20')} from="scale" style={{position: 'absolute', left: 1460, top: 250}}>
        <div style={{position: 'relative', width: 200, height: 330}}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - morph}}><div style={{width: 200, height: 92, marginTop: 180, borderRadius: 14, background: '#d9d6cf'}}><div style={{width: 72, height: 48, margin: '12px auto', borderRadius: 24, background: '#e0533d'}} /></div></div>
          <div style={{position: 'absolute', inset: 0, opacity: morph, borderRadius: 30, background: '#111', boxShadow: '0 0 50px rgba(120,170,255,0.6)'}}><div style={{position: 'absolute', inset: 10, borderRadius: 22, background: 'linear-gradient(160deg, #ff7a59, #ffd166)'}} /></div>
        </div>
      </Pop>
    </WhiteStudio>
  );
};

// ============ 3. 脳の中で起きていること ============
const K3Brain: React.FC<SceneProps> = ({f, T}) => {
  const k = seg(f, T('C2') - 10, T('C2') + 20);
  return (
    <AbsoluteFill>
      <BrainShot f={f} x={-200} glows={[{pos: R.str, color: '#ffd166', k: 0.3 + 0.7 * k * (1 + 0.2 * Math.sin(f / 6)), size: 0.45}]} labels={[{pos: R.str[0], text: 'ドーパミン', color: '#ffd166', k, dx: 340, dy: -220}]} />
      <Pop f={f} at={T('C4')} from="scale" style={{position: 'absolute', left: 1300, top: 560, fontSize: 92, fontWeight: 900, color: '#ffd166', fontFamily: FONT}}>「欲しい」</Pop>
      <Pop f={f} at={T('C4') + 18} from="scale" style={{position: 'absolute', left: 1360, top: 690, fontSize: 92, fontWeight: 900, color: '#ff7a59', fontFamily: FONT}}>「もっと」</Pop>
    </AbsoluteFill>
  );
};
const K3Pet: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill>
    <Still src="mri" f={f} dur={dur} dark={0.35} />
    <StepCard f={f} at={T('C7') - 4} n="手順1" text="受け皿に結合する薬に 目印をつけて体に入れる" w={1000} />
    <Pop f={f} at={T('C8')} style={{position: 'absolute', left: 120, top: 240}}><StepCard f={f} at={T('C8')} n="手順2" text="目印を脳を調べる装置で見る" x={0} y={0} w={800} /></Pop>
  </AbsoluteFill>
);
const Seats: React.FC<{f: number; fill: number; x: number; y: number; label: string}> = ({f, fill, x, y, label}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 720, fontFamily: FONT}}>
    <div style={{fontSize: 40, fontWeight: 900, marginBottom: 20, textAlign: 'center'}}>{label}</div>
    <svg width={720} height={380} viewBox="0 0 720 380">
      <rect x={0} y={250} width={720} height={130} rx={20} fill="#1f2636" />
      {Array.from({length: 8}, (_, i) => {
        const cx = 60 + i * 86;
        const dop = (i * 37) % 100 < fill * 100;
        const bob = Math.sin((f + i * 11) / 8) * 4;
        return (
          <g key={i}>
            <path d={`M ${cx - 32} 250 Q ${cx} 300 ${cx + 32} 250`} fill="none" stroke="#9fb0d0" strokeWidth={8} strokeLinecap="round" />
            <circle cx={cx} cy={232 + (dop ? 0 : bob)} r={20} fill={dop ? '#ffd166' : '#5fa8ff'} />
          </g>
        );
      })}
      {Array.from({length: 10}, (_, i) => {
        const fx = 40 + ((i * 71) % 640), fy = 40 + ((i * 53 + f * (i % 2 ? 1.2 : -1)) % 140 + 140) % 140;
        return <circle key={`m${i}`} cx={fx} cy={fy} r={14} fill={i < fill * 10 ? '#5fa8ff' : '#ffd166'} opacity={0.75} />;
      })}
    </svg>
  </div>
);
const K3Seats: React.FC<SceneProps> = ({f, T}) => {
  const fill = seg(f, T('C9', 1), T('C9', 2) + 20);
  return (
    <DarkBoard>
      <Seats f={f} fill={0.15} x={160} y={140} label="ふだん" />
      <Seats f={f} fill={0.15 + 0.7 * fill} x={1040} y={140} label="ドーパミンがたくさん出ると" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 650, display: 'flex', justifyContent: 'center', gap: 70, fontSize: 38, fontWeight: 800}}>
        <span><span style={{color: '#ffd166'}}>●</span> ドーパミン</span><span><span style={{color: '#5fa8ff'}}>●</span> 目印の薬</span>
      </div>
      <Pop f={f} at={T('C10')} style={{position: 'absolute', left: 0, right: 0, top: 730, textAlign: 'center', fontSize: 48, fontWeight: 900, color: K.gold}}>目印が減る ＝ ドーパミンが出ている</Pop>
    </DarkBoard>
  );
};
const K3Result: React.FC<SceneProps> = ({f, T}) => {
  const k = seg(f, T('C13') - 6, T('C13') + 20);
  return (
    <AbsoluteFill>
      <BrainShot f={f} x={-260} glows={[{pos: R.str, color: '#ffd166', k: 0.2 + 0.9 * k * (1 + 0.25 * Math.sin(f / 4)), size: 0.48}]} labels={[{pos: R.str[0], text: '線条体', note: 'ゲーム中に目印が減った', color: '#ffd166', k, dx: 330, dy: -230}]} />
      <Pop f={f} at={T('C14')} style={{position: 'absolute', left: 1180, top: 420}}>
        <svg width={600} height={380} viewBox="0 0 600 380">
          <line x1={60} y1={320} x2={580} y2={320} stroke="#9fb0d0" strokeWidth={3} /><line x1={60} y1={20} x2={60} y2={320} stroke="#9fb0d0" strokeWidth={3} />
          {Array.from({length: 10}, (_, i) => <circle key={i} cx={90 + i * 48} cy={290 - i * 24 + ((i * 37) % 30 - 15)} r={11} fill="#ffd166" opacity={seg(f, T('C14') + i * 3, T('C14') + i * 3 + 8)} />)}
          <text x={320} y={370} textAnchor="middle" fill="#dfe6f5" fontSize={28} fontWeight={800} fontFamily={FONT}>ゲームの成績</text>
          <text x={20} y={170} textAnchor="middle" fill="#dfe6f5" fontSize={28} fontWeight={800} fontFamily={FONT} transform="rotate(-90 20 170)">ドーパミン</text>
        </svg>
      </Pop>
    </AbsoluteFill>
  );
};
const Feed: React.FC<SceneProps & {bore?: (i: number) => boolean}> = ({f, dur, bore}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.65} from={1.1} to={1.18} />
    <PhonePOV f={f} flick={22} x={760} y={60} scale={1.05} bore={bore} />
    <Vignette />
  </AbsoluteFill>
);
const K3Feed: React.FC<SceneProps> = (p) => (
  <AbsoluteFill>
    <Feed {...p} />
    <Pop f={p.f} at={p.T('C17', 1)} from="scale" style={{position: 'absolute', left: 1320, top: 300, fontSize: 200, fontWeight: 900, color: '#ffd166', fontFamily: FONT}}>∞</Pop>
  </AbsoluteFill>
);
const K3Map: React.FC<SceneProps> = ({f, T}) => {
  const grow = seg(f, T('C22', 1), T('C22', 1) + 30);
  const regions: [string, number, number, number, number][] = [['カナダ', 140, 160, 420, 230], ['ヨーロッパ', 760, 140, 360, 260], ['中央アジア', 1160, 230, 380, 200]];
  return (
    <DarkBoard>
      {regions.map(([n, x, y, w, h], i) => (
        <Pop key={i} f={f} at={T('C20') + i * 10} from="scale" style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
          <div style={{width: '100%', height: '100%', borderRadius: '42% 58% 50% 46%', background: 'rgba(95,198,180,0.22)', border: '3px solid rgba(95,198,180,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900}}>{n}</div>
        </Pop>
      ))}
      <Pop f={f} at={T('C20', 1)} style={{position: 'absolute', left: 160, top: 470, fontSize: 44, fontWeight: 900}}>44の国と地域　11〜15歳　約28万人</Pop>
      {f >= T('C22') && (
        <div style={{position: 'absolute', left: 520, top: 560, width: 900, height: 230, fontFamily: FONT}}>
          {[['2018年', 7, '#9fb0d0'], ['2022年', 7 + 4 * grow, '#ff4d3d']].map(([lb, v, c], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 30}}>
              <div style={{width: 160, fontSize: 38, fontWeight: 800}}>{lb as string}</div>
              <div style={{height: 70, width: (v as number) * 52, borderRadius: 10, background: c as string}} />
              <div style={{fontSize: 56, fontWeight: 900, color: c as string}}>{Math.round(v as number)}％</div>
            </div>
          ))}
        </div>
      )}
    </DarkBoard>
  );
};
const K3NotDisease: React.FC<SceneProps> = ({f, T}) => {
  const st = T('C23') + 40;
  return (
    <DarkBoard>
      <Pop f={f} at={T('C23') + 6} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', fontSize: 120, fontWeight: 900}}>「ドーパミン中毒」</Pop>
      {f >= st && <div style={{position: 'absolute', left: 560, top: 380, transform: `rotate(-8deg) scale(${interpolate(f - st, [0, 6, 10], [2, 0.94, 1], clamp)})`, border: '8px solid #ffd166', borderRadius: 20, padding: '10px 34px', fontSize: 80, fontWeight: 900, color: '#ffd166'}}>という病気はない</div>}
      <Pop f={f} at={T('C25', 1)} style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', fontSize: 72, fontWeight: 900, color: '#ff4d3d'}}>だからこそ やっかい</Pop>
    </DarkBoard>
  );
};

// ============ 3b. 次が読めないごほうび ============
const Monkey: React.FC<{f: number; lamp: number; juice: number}> = ({f, lamp, juice}) => (
  <svg width={900} height={640} viewBox="0 0 900 640">
    <ellipse cx={330} cy={560} rx={240} ry={40} fill="rgba(0,0,0,0.35)" />
    <path d="M 200 560 C 180 420 220 330 330 320 C 440 330 480 420 460 560 Z" fill="#8a6a50" />
    <circle cx={330} cy={250} r={120} fill="#8a6a50" />
    <ellipse cx={330} cy={275} rx={80} ry={70} fill="#e0bfa0" />
    <circle cx={300} cy={250} r={10} fill="#2a1e16" /><circle cx={360} cy={250} r={10} fill="#2a1e16" />
    <circle cx={210} cy={240} r={34} fill="#e0bfa0" /><circle cx={450} cy={240} r={34} fill="#e0bfa0" />
    <path d="M 300 300 Q 330 318 360 300" stroke="#2a1e16" strokeWidth={6} fill="none" />
    <path d="M 330 130 C 340 80 420 60 470 40" stroke="#9fb0d0" strokeWidth={5} fill="none" />
    <rect x={460} y={26} width={60} height={30} rx={6} fill="#5a6478" />
    {/* lamp */}
    <circle cx={700} cy={140} r={46} fill={lamp > 0.5 ? '#ffd166' : '#4b4f58'} />
    {lamp > 0.5 && <circle cx={700} cy={140} r={90} fill="rgba(255,209,102,0.25)" />}
    <rect x={690} y={186} width={20} height={120} fill="#3a3e47" />
    {/* juice tube */}
    <path d="M 860 330 L 520 330 Q 470 330 460 300" stroke="#b9c4d8" strokeWidth={14} fill="none" strokeLinecap="round" />
    {juice > 0 && [0, 1, 2].map((i) => <circle key={i} cx={440 - i * 8} cy={300 + ((f * 3 + i * 14) % 40)} r={8} fill="#ff9f43" opacity={juice} />)}
  </svg>
);
const K3bMonkey: React.FC<SceneProps> = ({f, T}) => {
  const t0 = T('D7');
  const cyc = (f - t0) % 60;
  const lamp = f >= t0 && cyc < 20 ? 1 : 0;
  const juice = f < T("D6") ? 0 : (f < t0 ? ((f - T('D6')) % 70 < 25 ? 1 : 0) : cyc >= 26 && cyc < 48 ? 1 : 0);
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 120, top: 120}}><Monkey f={f} lamp={lamp} juice={juice} /></div>
      <StepCard f={f} at={T('D5')} n="手順1" text="ドーパミンを出す神経細胞の働きを記録" x={1050} y={150} w={760} />
      <StepCard f={f} at={T('D6')} n="手順2" text="ときどきジュースを出す" x={1050} y={330} w={760} />
      <StepCard f={f} at={T('D7')} n="手順3" text="ジュースの前にランプが光る" x={1050} y={510} w={760} />
    </DarkBoard>
  );
};
const Wave: React.FC<{f: number; at: number; title: string; lamp: boolean; juice: boolean; spikeAt: 'lamp' | 'juice'; dip?: boolean; x: number}> = ({f, at, title, lamp, juice, spikeAt, dip, x}) => {
  const p = seg(f, at, at + 50);
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const u = i / 100;
    let v = Math.sin(i * 1.7) * 4;
    const c = spikeAt === 'lamp' ? 0.3 : 0.65;
    if (!dip) v += -120 * Math.exp(-((u - c) ** 2) / 0.0012);
    if (dip) v += 60 * Math.exp(-((u - 0.65) ** 2) / 0.006);
    if (u <= p) pts.push(`${20 + u * 500},${200 + v}`);
  }
  return (
    <div style={{position: 'absolute', left: x, top: 150, width: 540, fontFamily: FONT, opacity: f >= at ? 1 : 0.15}}>
      <div style={{fontSize: 38, fontWeight: 900, textAlign: 'center', marginBottom: 14}}>{title}</div>
      <div style={{position: 'relative', height: 420, borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)'}}>
        <svg width={540} height={320} viewBox="0 0 540 320" style={{position: 'absolute', top: 20}}>
          <line x1={20} y1={200} x2={520} y2={200} stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeDasharray="8 8" />
          <polyline points={pts.join(' ')} fill="none" stroke={dip ? '#5fa8ff' : '#ffd166'} strokeWidth={5} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'space-around', fontSize: 30, fontWeight: 800}}>
          <span style={{color: lamp ? '#ffd166' : '#555'}}>💡 ランプ</span><span style={{color: juice ? '#ff9f43' : '#555'}}>{juice ? '🧃 ジュース' : '✕ ジュースなし'}</span>
        </div>
      </div>
    </div>
  );
};
const K3bWave: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Wave f={f} at={T('D10')} title="最初" lamp={false} juice spikeAt="juice" x={90} />
    <Wave f={f} at={T('D11', 1)} title="ランプを覚えたあと" lamp juice spikeAt="lamp" x={690} />
    <Wave f={f} at={T('D13')} title="ジュースが来なかった" lamp juice={false} spikeAt="lamp" dip x={1290} />
    <Pop f={f} at={T('D16')} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontSize: 50, fontWeight: 900, color: K.gold}}>反応していたのは「思っていたより」の差</Pop>
  </DarkBoard>
);
const K3bFeed: React.FC<SceneProps> = (p) => {
  const bore = (i: number) => i % 4 !== 3;
  const k = Math.max(0, p.f) / 22;
  const good = !bore(Math.floor(k) + 1) && k % 1 > 0.35;
  return (
    <AbsoluteFill>
      <Feed {...p} bore={bore} />
      <div style={{position: 'absolute', left: 1300, top: 320, fontFamily: FONT, fontSize: 130, fontWeight: 900, color: good ? '#ffd166' : '#5fa8ff', opacity: p.f > 20 ? 1 : 0}}>{good ? '↑' : '↓'}</div>
    </AbsoluteFill>
  );
};
const K3bMascot: React.FC<SceneProps> = ({f}) => {
  const lamp = f % 50 < 18;
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 1180, top: 150}}>
        <div style={{width: 120, height: 120, borderRadius: '50%', background: lamp ? '#ffd166' : '#3d4049', boxShadow: lamp ? '0 0 100px 40px rgba(255,209,102,0.35)' : 'none'}} />
        <div style={{width: 24, height: 240, margin: '0 auto', background: '#2e323a'}} />
      </div>
      <MascotOverlay f={f} x={500} y={200} w={480} h={560} rotY={0.5} pose={{headTilt: lamp ? 0.08 : 0, bob: lamp ? 0.012 : 0}} />
    </DarkBoard>
  );
};

export const SCENES_A: Record<string, React.FC<SceneProps>> = {
  o_scroll: OScroll, o_montage: OMontage, o_tired: OTired, o_word: OWord, o_three: OThree,
  k1_cards: K1Cards, k1_timer: K1Timer,
  k2_room: K2Room, k2_step1: K2Step1, k2_step2: K2Step2, k2_step3: K2Step3, k2_result: K2Result, k2_mascot: K2Mascot,
  k3_brain: K3Brain, k3_pet: K3Pet, k3_seats: K3Seats, k3_result: K3Result, k3_feed: K3Feed, k3_map: K3Map, k3_notdisease: K3NotDisease,
  k3b_monkey: K3bMonkey, k3b_wave: K3bWave, k3b_feed: K3bFeed, k3b_mascot: K3bMascot,
};
export {Timer, Feed};
