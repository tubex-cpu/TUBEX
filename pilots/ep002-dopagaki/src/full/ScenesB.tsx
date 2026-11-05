import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Feed} from './ScenesA';
import {Bars, BrainShot, Clock, DarkBoard, PhonePOV, R, SceneProps, StepCard, Still, Title, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Pop, clamp, fadeIn} from './ui';

// ============ 4. 無気力の正体 ============
const Dish: React.FC<{x: number; y: number; filled: boolean; f: number; i: number}> = ({x, y, filled, f, i}) => (
  <g>
    <path d={`M ${x - 34} ${y} Q ${x} ${y + 44} ${x + 34} ${y}`} fill="none" stroke="#9fb0d0" strokeWidth={8} strokeLinecap="round" />
    {filled && <circle cx={x} cy={y - 6 + Math.sin((f + i * 9) / 7) * 2} r={16} fill="#ffd166" />}
  </g>
);
const Synapse: React.FC<{f: number; n: number; x: number; y: number; label: string; fall?: number}> = ({f, n, x, y, label, fall = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 760, fontFamily: FONT}}>
    <div style={{fontSize: 40, fontWeight: 900, textAlign: 'center', marginBottom: 16}}>{label}</div>
    <svg width={760} height={420} viewBox="0 0 760 420">
      <path d="M 40 0 L 720 0 L 720 80 Q 380 150 40 80 Z" fill="#2a3246" />
      {Array.from({length: 12}, (_, i) => {
        const p = ((f * 0.9 + i * 23) % 120) / 120;
        return <circle key={i} cx={80 + ((i * 59) % 600)} cy={110 + p * 180 * fall} r={11} fill="#ffd166" opacity={1 - p * 0.6} />;
      })}
      <rect x={20} y={330} width={720} height={90} rx={20} fill="#1f2636" />
      {Array.from({length: 8}, (_, i) => i < n && <Dish key={i} x={70 + i * 88} y={330} filled={(f + i * 13) % 40 < 26} f={f} i={i} />)}
    </svg>
  </div>
);
const K4Receptor: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Synapse f={f} n={8} x={580} y={120} label="ドーパミンを受け取る「受け皿」" />
    <StepCard f={f} at={T('E4')} n="手順1" text="ネット依存の男性と そうでない男性を集める" x={140} y={640} w={800} />
    <StepCard f={f} at={T('E5')} n="手順2" text="目印の薬で 受け皿の数を数える" x={1000} y={640} w={780} />
  </DarkBoard>
);
const K4Compare: React.FC<SceneProps> = ({f, T}) => {
  const k = seg(f, T('E8') - 10, T('E8') + 20);
  return (
    <DarkBoard>
      <Synapse f={f} n={8} x={120} y={110} label="ネット依存ではない人" />
      <Synapse f={f} n={Math.round(8 - 5 * k)} x={1040} y={110} label="ネット依存の人" />
      <Pop f={f} at={T('E9')} style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontSize: 54, fontWeight: 900, color: '#ff4d3d'}}>依存が重い人ほど 受け皿は少なかった</Pop>
    </DarkBoard>
  );
};
const K4Glass: React.FC<SceneProps> = ({f, T}) => {
  const pour = seg(f, 10, 80);
  const items: [string, string][] = [['📄', '仕事を片づける'], ['📖', '本を読む'], ['💬', '友達と話す'], ['🚶', '散歩をする']];
  return (
    <DarkBoard>
      <svg width={1920} height={560} style={{position: 'absolute', top: 60}}>
        {[[560, 1], [1360, 0.35]].map(([cx, sc], j) => {
          const w = 300 * sc, h = 120 * sc + 60;
          const lvl = Math.min(1, pour / (sc as number));
          return (
            <g key={j}>
              <rect x={(cx as number) - 10} y={60} width={20} height={160 * pour} fill="#5fa8ff" opacity={pour < 1 ? 0.8 : 0} />
              <path d={`M ${(cx as number) - w / 2} ${380 - h} L ${(cx as number) - w / 2 + 20} 380 L ${(cx as number) + w / 2 - 20} 380 L ${(cx as number) + w / 2} ${380 - h} Z`} fill="rgba(255,255,255,0.08)" stroke="#9fb0d0" strokeWidth={5} />
              <rect x={(cx as number) - w / 2 + 22} y={380 - h * Math.min(1, lvl)} width={w - 44} height={h * Math.min(1, lvl)} fill="#5fa8ff" opacity={0.7} />
              {j === 1 && pour > 0.4 && [0, 1, 2, 3].map((d) => <circle key={d} cx={(cx as number) + w / 2 + 10 + d * 6} cy={400 + ((f * 4 + d * 30) % 150)} r={8} fill="#5fa8ff" opacity={0.8} />)}
            </g>
          );
        })}
        <text x={560} y={460} textAnchor="middle" fill="#dfe6f5" fontSize={36} fontWeight={800} fontFamily={FONT}>受け皿が多い</text>
        <text x={1360} y={460} textAnchor="middle" fill="#ff7a64" fontSize={36} fontWeight={800} fontFamily={FONT}>受け皿が少ない</text>
      </svg>
      <div style={{position: 'absolute', left: 160, right: 160, top: 600, display: 'flex', justifyContent: 'space-around'}}>
        {items.map(([ic, lb], i) => (
          <Pop key={i} f={f} at={T('E11') + i * 14} from="scale">
            <div style={{textAlign: 'center', opacity: f > T('E13') ? 0.45 : 1}}><div style={{fontSize: 90}}>{ic}</div><div style={{fontSize: 32, fontWeight: 800, color: K.sub}}>{lb}</div></div>
          </Pop>
        ))}
      </div>
    </DarkBoard>
  );
};
const K4Room: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill>
    <Still src="living" f={f} dur={dur} dark={0.3} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,220,170,0.15), rgba(0,0,0,0.2))'}} />
    {[['📕', 'やろうと思っていた勉強', 'E15', 0], ['🎸', '始めたはずの趣味', 'E15', 1], ['✉️', '会いたかった友達への連絡', 'E15', 2]].map(([ic, lb, id, k], i) => (
      <Pop key={i} f={f} at={T(id as string, k as number)} from="up" style={{position: 'absolute', left: 140 + i * 420, top: 160}}>
        <div style={{width: 360, padding: '26px 0', borderRadius: 22, background: 'rgba(12,14,20,0.78)', textAlign: 'center', fontFamily: FONT, opacity: f > T('E16', 1) ? 0.5 : 1, filter: f > T('E16', 1) ? 'grayscale(0.8)' : undefined}}>
          <div style={{fontSize: 110}}>{ic}</div><div style={{fontSize: 30, fontWeight: 800, color: K.ink, marginTop: 6}}>{lb}</div>
        </div>
      </Pop>
    ))}
    {f >= T('E17') && <PhonePOV f={f - T('E17')} flick={24} x={1420} y={240} scale={0.7} tilt={-6} />}
    <Vignette />
  </AbsoluteFill>
);
const K4Cause: React.FC<SceneProps> = ({f, T}) => {
  const dim = seg(f, T('E22b'), T('E22b') + 40);
  return (
    <DarkBoard>
      <Pop f={f} at={4} style={{position: 'absolute', left: 300, top: 140, display: 'flex', alignItems: 'center', gap: 80}}>
        <div style={{width: 380, height: 290, borderRadius: '48% 52% 46% 54%', background: 'radial-gradient(circle at 40% 40%, #5b5f6e, #2a2d36)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: K.sub, opacity: 1 - 0.4 * dim}}>ごほうびが届かない脳</div>
        <div style={{fontSize: 90, color: K.sub}}>＋</div>
        <div style={{width: 220, height: 360, borderRadius: 30, background: 'linear-gradient(160deg, #ff7a59, #ffd166)', boxShadow: '0 0 70px rgba(255,170,90,0.6)', transform: `scale(${1 + 0.08 * dim})`}} />
      </Pop>
      <Pop f={f} at={T('E22')} style={{position: 'absolute', left: 0, right: 0, top: 580, textAlign: 'center', fontSize: 50, fontWeight: 900, color: '#ff4d3d'}}>どんどんハマって抜け出せない</Pop>
      <Pop f={f} at={T('E22c')} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontSize: 52, fontWeight: 900, color: K.gold}}>目先の快楽は 本当に大事？</Pop>
    </DarkBoard>
  );
};

// ============ 5. 脳が縮み、言葉の知能が下がる ============
const K5Mri: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill>
    <Still src="mri" f={f} dur={dur} dark={0.35} />
    <StepCard f={f} at={T('F4') - 4} n="手順1" text="スマホ依存にあたる人22人 あたらない人26人" w={1000} />
    <StepCard f={f} at={T('F5') - 4} n="手順2" text="MRIで灰白質の量を場所ごとに比べる" y={230} w={900} />
  </AbsoluteFill>
);
const K5Gray: React.FC<SceneProps> = ({f, T}) => {
  const a = seg(f, T('F8') - 6, T('F8') + 12), b = seg(f, T('F8', 1) - 6, T('F8', 1) + 12), c = seg(f, T('F8', 2) - 6, T('F8', 2) + 12);
  const base = seg(f, T('F7'), T('F7') + 30) * 0.5;
  return (
    <BrainShot f={f} cam={{pos: [-3.25, 0.05, 0.6], target: [0, -0.3, 0], fov: 30}} rot={0.15 - 0.1 * seg(f, 0, 600)}
      glows={[{pos: R.ins, color: '#4f8cff', k: Math.max(base, a), size: 0.42}, {pos: R.itg, color: '#4f8cff', k: Math.max(base, b), size: 0.42}, {pos: R.phg, color: '#4f8cff', k: Math.max(base, c), size: 0.38}]}
      labels={[{pos: R.ins[0], text: '体の感覚をまとめる場所', note: '島皮質', color: '#8fb6ff', k: a, dx: -120, dy: -260}, {pos: R.itg[0], text: '形を見分ける場所', note: '側頭葉の下側', color: '#8fb6ff', k: b, dx: -300, dy: 40}, {pos: R.phg[0], text: '記憶にかかわる場所', note: '海馬のそば', color: '#8fb6ff', k: c, dx: 320, dy: 60}]} />
  );
};
const K5Two: React.FC<SceneProps> = ({f, T}) => {
  const a = seg(f, T('F10') - 6, T('F10') + 12), b = seg(f, T('F12') - 6, T('F12') + 12);
  const dimA = seg(f, T('F11'), T('F11') + 40) * 0.55, dimB = seg(f, T('F12', 2), T('F12', 2) + 40) * 0.55;
  return (
    <BrainShot f={f}
      glows={[{pos: R.acc, color: '#ff5a4a', k: a * (1 - dimA), size: 0.44}, {pos: R.ofc, color: '#ff5a4a', k: b * (1 - dimB), size: 0.44}]}
      labels={[{pos: R.acc[0], text: '前帯状皮質', note: '注意を戻す場所', color: '#ff7a64', k: a, dx: 300, dy: -200}, {pos: R.ofc[0], text: '眼窩前頭皮質', note: 'ごほうびを選ぶ場所', color: '#ff7a64', k: b, dx: 340, dy: 120}]} />
  );
};
const K5Kids: React.FC<SceneProps> = ({f, T}) => {
  const yr = Math.min(3, Math.max(0, Math.floor((f - T('F20')) / 25)));
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 200, top: 120, display: 'flex', gap: 30}}>
        {[110, 140, 170, 200].map((s, i) => <Pop key={i} f={f} at={T('F16') + i * 8}><PersonIcon size={s} color="#c9d3e6" /></Pop>)}
      </div>
      <Pop f={f} at={T('F16', 1)} from="scale" style={{position: 'absolute', left: 1180, top: 110}}>
        <div style={{width: 500, borderRadius: 22, background: '#f4f1ea', color: '#1d2230', textAlign: 'center', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
          <div style={{background: '#e0533d', color: '#fff', fontSize: 40, fontWeight: 900, padding: '14px 0'}}>追いかけた期間</div>
          <div style={{fontSize: 150, fontWeight: 900, padding: '10px 0'}}>{f >= T('F20') ? `${yr}年後` : '3年間'}</div>
        </div>
      </Pop>
      <StepCard f={f} at={T('F18')} n="最初" text="ネットを使う頻度を聞く" x={160} y={470} w={720} />
      <StepCard f={f} at={T('F19')} n="同時に" text="言葉の知能と脳の大きさを測る" x={160} y={610} w={720} />
      <StepCard f={f} at={T('F20')} n="3年後" text="同じ検査をもう一度" x={1000} y={540} w={720} />
    </DarkBoard>
  );
};
const BrainBlob: React.FC<{s: number; color: string; label: string; sub?: string}> = ({s, color, label, sub}) => (
  <div style={{width: 560, textAlign: 'center', fontFamily: FONT}}>
    <div style={{height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 380 * s, height: 300 * s, borderRadius: '50% 46% 44% 52% / 56% 52% 48% 44%', background: `radial-gradient(circle at 38% 35%, ${color}, #3a3550 80%)`, boxShadow: `0 0 60px ${color}55, inset -20px -30px 60px rgba(0,0,0,0.35)`}} />
    </div>
    <div style={{fontSize: 38, fontWeight: 900}}>{label}</div>
    {sub && <div style={{fontSize: 34, fontWeight: 900, color: '#ff4d3d', marginTop: 8}}>{sub}</div>}
  </div>
);
const K5Growth: React.FC<SceneProps> = ({f, T}) => {
  const g = seg(f, T('F24'), T('F24') + 70);
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 280, top: 110, display: 'flex', gap: 240}}>
        <BrainBlob s={0.7 + 0.3 * g} color="#b3a9bd" label="ネットをあまり使わない子" />
        <BrainBlob s={0.7 + 0.1 * g} color="#b3a9bd" label="ネットを使う頻度が高い子" sub={f >= T('F23', 1) ? '言葉の知能 ↓' : undefined} />
      </div>
    </DarkBoard>
  );
};
const K5Mascot: React.FC<SceneProps> = ({f}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 260, top: 160, transform: 'scale(0.7)', transformOrigin: 'top left', display: 'flex', gap: 140}}>
      <BrainBlob s={1} color="#b3a9bd" label="" /><BrainBlob s={0.8} color="#b3a9bd" label="" />
    </div>
    <MascotOverlay f={f} x={1380} y={300} w={400} h={460} rotY={-0.9} />
  </DarkBoard>
);

// ============ 6. 抜け落ちる ============
const K6Memo: React.FC<SceneProps> = ({f, T}) => {
  const fade = seg(f, T('G3') - 30, T('G3') + 10);
  const night = f >= T('G3');
  return (
    <AbsoluteFill style={{background: night ? '#14161c' : '#e9e6e0', fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 360, top: 60, width: 560, height: 820, borderRadius: 30, background: night ? '#2b2e35' : '#f6f6f3', boxShadow: '0 30px 70px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', right: 30, top: 300, width: 18, height: 200, borderRadius: 9, background: '#b8b8b2'}} />
        {[['牛乳', 120, -4], ['メール返す', 300, 3]].map(([s, y, r], i) => (
          <div key={i} style={{position: 'absolute', left: 120, top: y as number, padding: '24px 34px', background: '#ffe98a', transform: `rotate(${r}deg)`, fontSize: 52, fontWeight: 900, color: '#333', opacity: 1 - fade, filter: `blur(${fade * 8}px)`, boxShadow: '0 6px 14px rgba(0,0,0,0.15)'}}>{s}</div>
        ))}
      </div>
      {night ? (
        <div style={{position: 'absolute', left: 1080, top: 140, width: 560, height: 640, borderRadius: 20, background: '#dfe3ea', boxShadow: 'inset 0 0 80px rgba(0,0,0,0.25)'}}>
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 150 + i * 170, height: 8, background: '#b8bec9'}} />)}
          <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontSize: 50, fontWeight: 900, color: '#6a7080'}}>からっぽ</div>
        </div>
      ) : <PhonePOV f={f} flick={22} x={1180} y={60} scale={0.85} tilt={-5} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(40,36,30,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};
const LabScreen: React.FC<{f: number; signal: boolean}> = ({f, signal}) => (
  <div style={{position: 'absolute', left: 980, top: 120, width: 800, height: 500, borderRadius: 18, background: '#10141c', border: '14px solid #2a2f3a', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', fontFamily: FONT, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontSize: 120, fontWeight: 900, color: signal ? '#ffd166' : '#e8ecf5'}}>{signal ? '★' : '学ぶ　走る　空'.split('　')[Math.floor(f / 30) % 3]}</div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontSize: 30, color: K.sub}}>{signal ? '合図 → ボタンを押す' : '簡単な課題'}</div>
  </div>
);
const K6Lab: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill>
    <Still src="desk" f={f} dur={dur} dark={0.55} blur={6} />
    <LabScreen f={f} signal={f >= T('G8') && (f - T('G8')) % 70 < 26} />
    <StepCard f={f} at={T('G7')} n="手順1" text="パソコンで簡単な課題" x={120} y={150} w={760} />
    <StepCard f={f} at={T('G8')} n="覚える" text="合図が出たら ボタンを押す" x={120} y={300} w={760} />
    <Pop f={f} at={T('G9', 1)} from="scale" style={{position: 'absolute', left: 120, top: 480, padding: '24px 40px', borderRadius: 18, background: K.gold, color: '#141820', fontSize: 58, fontWeight: 900, fontFamily: FONT}}>展望記憶</Pop>
    <Pop f={f} at={T('G10')} style={{position: 'absolute', left: 140, top: 640, fontSize: 40, fontWeight: 800, color: K.ink, fontFamily: FONT}}>＝「帰りに牛乳を買う」を覚えておく力</Pop>
  </AbsoluteFill>
);
const GROUPS: [string, string, string, string][] = [['G12', '📱', 'TikTokの', 'ショート動画'], ['G12', '🐦', 'Twitter', ''], ['G13', '▶️', 'YouTubeの', '動画'], ['G13', '☕', '何もしない', '']];
const K6Groups: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="休憩のしかたで4つのグループ" y={70} size={54} />
    <div style={{position: 'absolute', left: 120, right: 120, top: 260, display: 'flex', justifyContent: 'space-around'}}>
      {GROUPS.map(([id, ic, a, b], i) => (
        <Pop key={i} f={f} at={T(id, i % 2)} from="scale">
          <div style={{width: 340, height: 380, borderRadius: 26, background: i === 0 ? 'rgba(224,83,61,0.14)' : 'rgba(255,255,255,0.05)', border: `3px solid ${i === 0 ? '#e0533d' : 'rgba(255,255,255,0.14)'}`, textAlign: 'center', paddingTop: 50}}>
            <div style={{fontSize: 120}}>{ic}</div><div style={{fontSize: 40, fontWeight: 900, marginTop: 10}}>{a}</div><div style={{fontSize: 40, fontWeight: 900}}>{b}</div>
          </div>
        </Pop>
      ))}
    </div>
  </DarkBoard>
);
const K6Bars: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="合図でボタンを押せたか" y={70} size={54} />
    <div style={{position: 'absolute', left: 120, right: 120, top: 220, display: 'flex', justifyContent: 'space-around'}}>
      {GROUPS.map(([, ic, a, b], i) => {
        const down = i === 0;
        const show = f >= (down ? T('G16', 1) : T('G17') + (i - 1) * 12);
        return (
          <div key={i} style={{width: 340, height: 480, borderRadius: 26, background: down && show ? 'rgba(224,83,61,0.16)' : 'rgba(255,255,255,0.05)', border: `3px solid ${down && show ? '#e0533d' : 'rgba(255,255,255,0.14)'}`, textAlign: 'center', paddingTop: 40}}>
            <div style={{fontSize: 100}}>{ic}</div><div style={{fontSize: 36, fontWeight: 900, marginTop: 6}}>{a}{b}</div>
            {show && <div style={{marginTop: 40, fontSize: 46, fontWeight: 900, color: down ? '#ff4d3d' : '#5fc6b4', opacity: fadeIn(f, down ? T('G16', 1) : T('G17') + (i - 1) * 12)}}>{down ? '成績 ↓' : '下がらない'}</div>}
          </div>
        );
      })}
    </div>
  </DarkBoard>
);
const K6Planner: React.FC<SceneProps> = ({f, T}) => {
  const gone = seg(f, T('G23'), T('G23') + 30);
  return (
    <AbsoluteFill style={{background: '#d9d4cb', fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 520, top: 50, width: 880, height: 800, borderRadius: 16, background: '#fbf9f4', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 60, color: '#2a2a2a'}}>
        <div style={{fontSize: 52, fontWeight: 900, borderBottom: '4px solid #e0533d', paddingBottom: 16}}>今日やること</div>
        {['1', '2', '3'].map((n, i) => (
          <div key={i} style={{marginTop: 70, display: 'flex', alignItems: 'center', gap: 30}}>
            <div style={{width: 60, height: 60, border: '4px solid #888', borderRadius: 10}} />
            <div style={{flex: 1, height: 18, borderRadius: 9, background: '#c9c2b6', opacity: i === 1 ? 1 : 1 - gone, width: `${50 + i * 15}%`}} />
            <div style={{fontSize: 70, fontWeight: 900, color: '#e0533d', opacity: f >= T('G21') && i !== 1 ? fadeIn(f, T('G21', 1)) * (1 - gone * 0.0) : 0}}>？</div>
          </div>
        ))}
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(40,36,30,0.45) 100%)'}} />
    </AbsoluteFill>
  );
};

// ============ 7. 寝室のスマホ ============
const K7Bed: React.FC<SceneProps> = ({f, dur, T}) => {
  const morning = f >= T('H1') + 50;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src={morning ? 'bedLamp' : 'bed'} f={f} dur={dur} dark={morning ? 0.05 : 0.6} />
      {morning && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(190,210,255,0.3), rgba(255,255,255,0.05))', filter: 'blur(2px)'}} />}
      <Clock text={morning ? '7:00' : '1:23'} x={150} y={120} size={110} />
      {!morning && <PhonePOV f={f} flick={24} x={760} y={60} scale={1.0} />}
      <Vignette />
    </AbsoluteFill>
  );
};
const K7Map: React.FC<SceneProps> = ({f, T}) => {
  const n = Math.round(125198 * seg(f, T('H4', 1) - 10, T('H4', 1) + 50));
  return (
    <DarkBoard>
      <svg width={1920} height={760} style={{position: 'absolute', top: 40}}>
        {Array.from({length: 220}, (_, i) => {
          const x = 120 + ((i * 97) % 1680), y = 60 + ((i * 61) % 560);
          return <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 2} fill="#5fc6b4" opacity={seg(f, i * 0.4, i * 0.4 + 10) * 0.7} />;
        })}
      </svg>
      <Pop f={f} at={T('H4', 1) - 10} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontSize: 130, fontWeight: 900, textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}>{n.toLocaleString('en-US')}人</Pop>
      <Pop f={f} at={T('H5')} style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 46, fontWeight: 900, color: K.gold}}>寝る前の画面 × 睡眠</Pop>
    </DarkBoard>
  );
};
const K7Bars: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="寝る前に使っている子（使っていない子＝1）" y={60} size={48} />
    <Bars f={f} at={T('H7') - 10} max={3} h={600} y={150} items={[
      {label: '睡眠が足りない', v: f >= T('H7') ? 2.17 : 0, text: '2.17倍', color: '#e0533d'},
      {label: '睡眠の質が悪い', v: f >= T('H8') ? 1.46 : 0, text: '1.46倍', color: '#e8a04c'},
      {label: '昼間に強い眠気', v: f >= T('H9') ? 2.72 : 0, text: '2.72倍', color: '#ff4d3d'},
    ]} />
  </DarkBoard>
);
const K7Night: React.FC<SceneProps> = ({f, dur, T}) => {
  const times = ['23:30', '0:10', '0:55'];
  const k = f < T('H11') ? 0 : f < T('H12') ? 1 : 2;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bed" f={f} dur={dur} dark={0.68} from={1.12} to={1.2} />
      <PhonePOV f={f} flick={20} x={760} y={60} scale={1.05} clock={times[k]} />
      <Clock text={times[k]} x={150} y={120} size={100} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, rgba(80,130,255,0.12), rgba(0,0,0,0) 60%)'}} />
      <Vignette />
    </AbsoluteFill>
  );
};
const K7Charger: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.55} ox={80} oy={60} from={1.2} to={1.3} />
    <div style={{position: 'absolute', left: 1300, top: 420, width: 140, height: 260, borderRadius: 22, background: '#0d0f13', boxShadow: '0 0 0 3px #2b2f37, 0 20px 40px rgba(0,0,0,0.6)', transform: 'rotate(-12deg)'}}>
      <div style={{position: 'absolute', left: 52, bottom: -60, width: 8, height: 70, background: '#ddd'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', fontSize: 40, color: '#5fc6b4', opacity: 0.5 + 0.5 * Math.sin(f / 15)}}>⚡</div>
    </div>
    <Pop f={f} at={T('H15', 1)} style={{position: 'absolute', left: 150, top: 160, fontFamily: FONT, color: K.ink, padding: '20px 34px', borderRadius: 18, background: 'rgba(10,12,18,0.85)'}}>
      <div style={{fontSize: 36, fontWeight: 800, color: K.sub}}>寝室にあるだけ（使っていなくても）</div>
      <div style={{fontSize: 52, fontWeight: 900, marginTop: 8}}>睡眠が足りない <span style={{color: '#ff4d3d'}}>1.79倍</span></div>
      <div style={{fontSize: 52, fontWeight: 900, marginTop: 4}}>睡眠の質が悪い <span style={{color: '#e8a04c'}}>1.53倍</span></div>
    </Pop>
    <Vignette />
  </AbsoluteFill>
);

export const SCENES_B: Record<string, React.FC<SceneProps>> = {
  k4_receptor: K4Receptor, k4_compare: K4Compare, k4_glass: K4Glass, k4_room: K4Room, k4_cause: K4Cause,
  k5_mri: K5Mri, k5_gray: K5Gray, k5_two: K5Two, k5_kids: K5Kids, k5_growth: K5Growth, k5_mascot: K5Mascot,
  k6_memo: K6Memo, k6_lab: K6Lab, k6_groups: K6Groups, k6_bars: K6Bars, k6_planner: K6Planner,
  k7_bed: K7Bed, k7_map: K7Map, k7_bars: K7Bars, k7_night: K7Night, k7_charger: K7Charger,
};
export const _unused = {interpolate, clamp, Feed};
