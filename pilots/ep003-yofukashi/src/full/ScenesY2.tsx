import {AbsoluteFill, interpolate} from 'remotion';
import {AMYG, MPFC} from '../three/Brain3D';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Bars, BrainShot, Clock, DarkBoard, PhonePOV, SceneProps, StepCard, Still, Title, WhiteStudio, seg} from './kit';
import {Cards, LT, PostsScreen} from './ScenesY1';
import {K, MascotOverlay, PersonIcon, Phone, Pop, clamp, fadeIn} from './ui';

// ============ 6. 心がささくれる ============
const S25: React.FC<SceneProps> = ({f, dur, T}) => {
  const lab = f >= LT(T, 's25', 1);
  if (!lab) return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="desk" f={f} dur={dur} dark={0.45} blur={4} />
      <Pop f={f} at={8} from="scale" style={{position: 'absolute', left: 150, top: 180, fontFamily: FONT, fontSize: 100, fontWeight: 900, color: '#ff4d3d'}}>イライラ</Pop>
      <Pop f={f} at={30} from="scale" style={{position: 'absolute', left: 520, top: 380, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: '#7fa2ff'}}>落ち込む</Pop>
      <Vignette />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Still src="mri" f={f} dur={dur} dark={0.4} />
      <StepCard f={f} at={LT(T, 's25', 3)} n="手順1" text="26人を二つのグループに 約35時間起き続ける／普段どおり眠る" w={1200} />
      <StepCard f={f} at={LT(T, 's25', 4)} n="手順2" text="MRIの中で100枚の写真を見る" y={250} w={900} />
      <StepCard f={f} at={LT(T, 's25', 5)} n="手順3" text="写真を見ているときの脳を比べる" y={410} w={900} />
    </AbsoluteFill>
  );
};
const S26: React.FC<SceneProps> = ({f, T}) => {
  const a = seg(f, LT(T, 's26', 1) - 6, LT(T, 's26', 1) + 20);
  const brake = f >= LT(T, 's26', 2) ? 1 - 0.6 * seg(f, LT(T, 's26', 2), LT(T, 's26', 2) + 40) : 0;
  return (
    <BrainShot f={f} glows={[{pos: AMYG, color: '#ff5a3d', k: 0.3 + 0.9 * a * (1 + 0.2 * Math.sin(f / 4)), size: 0.5}, {pos: MPFC, color: '#3fd6c4', k: brake, size: 0.42}]}
      labels={[{pos: AMYG[0], text: '扁桃体', note: '怖さや怒りに真っ先に反応する', color: '#ff7a64', k: a, dx: 300, dy: 120}, ...(f >= LT(T, 's26', 2) ? [{pos: MPFC[0], text: 'ブレーキ', note: '扁桃体を落ち着かせる場所', color: '#5fc6b4', k: 1, dx: 260, dy: -200}] : [])]} />
  );
};
const S26wrap: React.FC<SceneProps> = (p) => (
  <AbsoluteFill>
    <S26 {...p} />
    <Pop f={p.f} at={LT(p.T, 's26', 1)} from="scale" style={{position: 'absolute', left: 1360, top: 520, fontFamily: FONT, fontSize: 90, fontWeight: 900, color: '#ff4d3d'}}>約60％↑</Pop>
  </AbsoluteFill>
);
const S27: React.FC<SceneProps> = ({f, dur, T}) => {
  const morning = f >= LT(T, 's27', 1);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src={morning ? 'bedLamp' : 'bed'} f={f} dur={dur} dark={morning ? 0.2 : 0.65} blur={4} />
      <Phone f={f} x={660} y={30} scale={0.9} title="恋人" msgs={[{from: 'them', text: '今日ちょっと遅くなる', at: 0, time: '0:41'}, {from: 'me', text: 'いつもそうだよね もういい', at: 30, time: '0:43'}]} />
      {morning && <Clock text="7:10" x={150} y={120} size={90} />}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ 7. 体が「もっと食べろ」 ============
const S28: React.FC<SceneProps> = ({f, T}) => {
  const lab = f >= LT(T, 's28', 1);
  if (!lab) return (
    <DarkBoard tint="#2a2418">
      <Clock text="1:00" x={150} y={120} size={90} />
      <Pop f={f} at={6} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontSize: 230}}>🍜</Pop>
      <Pop f={f} at={40} from="scale" style={{position: 'absolute', left: 1300, top: 300, fontSize: 150}}>🥐🥐</Pop>
    </DarkBoard>
  );
  return (
    <DarkBoard>
      <StepCard f={f} at={LT(T, 's28', 1)} n="参加者" text="健康な若い男性12人" x={120} y={120} w={900} />
      <StepCard f={f} at={LT(T, 's28', 3)} n="手順1" text="2晩続けて 寝床の時間を4時間" x={120} y={270} w={900} />
      <StepCard f={f} at={LT(T, 's28', 4)} n="手順2" text="別の時期に 2晩続けて10時間" x={120} y={420} w={900} />
      <StepCard f={f} at={LT(T, 's28', 5)} n="同じ" text="食事の量と体を動かす量は同じに" x={120} y={570} w={900} />
      <div style={{position: 'absolute', left: 1180, top: 200, display: 'flex', gap: 40, fontFamily: FONT}}>
        {[['4時間', '🌙'], ['10時間', '🌙🌙🌙']].map(([a, b], i) => <Pop key={i} f={f} at={LT(T, 's28', 3 + i)}><div style={{width: 270, height: 260, borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.14)', textAlign: 'center', paddingTop: 40}}><div style={{fontSize: 70}}>{b}</div><div style={{fontSize: 42, fontWeight: 900, marginTop: 20}}>{a}</div></div></Pop>)}
      </div>
    </DarkBoard>
  );
};
const Balance: React.FC<{f: number; at: number; label: string; pct: string; down: boolean; color: string}> = ({f, at, label, pct, down, color}) => {
  const t = seg(f, at, at + 30) * (down ? -1 : 1) * 14;
  return (
    <div style={{width: 640, textAlign: 'center', fontFamily: FONT, opacity: f >= at ? 1 : 0.3}}>
      <svg width={640} height={360} viewBox="0 0 640 360">
        <polygon points="320,330 280,360 360,360" fill="#9fb0d0" /><line x1={320} y1={330} x2={320} y2={120} stroke="#9fb0d0" strokeWidth={8} />
        <g transform={`rotate(${t} 320 120)`}>
          <line x1={80} y1={120} x2={560} y2={120} stroke="#dfe6f5" strokeWidth={8} />
          <path d="M 40 170 Q 80 220 120 170 Z" fill={color} /><line x1={80} y1={120} x2={60} y2={170} stroke="#dfe6f5" strokeWidth={3} /><line x1={80} y1={120} x2={100} y2={170} stroke="#dfe6f5" strokeWidth={3} />
          <path d="M 520 170 Q 560 220 600 170 Z" fill="#55607a" /><line x1={560} y1={120} x2={540} y2={170} stroke="#dfe6f5" strokeWidth={3} /><line x1={560} y1={120} x2={580} y2={170} stroke="#dfe6f5" strokeWidth={3} />
        </g>
      </svg>
      <div style={{fontSize: 38, fontWeight: 900}}>{label}</div>
      <div style={{fontSize: 80, fontWeight: 900, color}}>{pct}</div>
    </div>
  );
};
const S29: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 260, top: 90, display: 'flex', gap: 120}}>
      <Balance f={f} at={LT(T, 's29', 1)} label="「お腹いっぱい」のホルモン" pct="18％↓" down color="#6fa8dc" />
      <Balance f={f} at={LT(T, 's29', 1) + 40} label="「お腹がすいた」のホルモン" pct="28％↑" down={false} color="#e0533d" />
    </div>
    <Pop f={f} at={LT(T, 's29', 2)} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 660, textAlign: 'center', fontSize: 56, fontWeight: 900, color: '#ff4d3d'}}>空腹感 24％強く</Pop>
  </DarkBoard>
);
const S30: React.FC<SceneProps> = ({f, T, dur}) => {
  const exp = f >= LT(T, 's30', 1);
  if (!exp) return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bedLamp" f={f} dur={dur} dark={0.05} />
      <AbsoluteFill style={{background: 'linear-gradient(110deg, rgba(255,240,200,0.35) 0%, rgba(255,240,200,0) 40%)'}} />
      <Clock text="12:40" x={150} y={120} size={90} color="#ff9f43" />
      <Vignette />
    </AbsoluteFill>
  );
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 140, top: 110, width: 1640, fontFamily: FONT}}>
        {[['9時間のグループ', [9, 9, 9, 9, 9, 9, 9], '#6fa8dc'], ['5時間のグループ', [5, 5, 5, 5, 5, 5, 5], '#e8a04c'], ['寝だめのグループ', [5, 5, 5, 5, 5, 9, 9], '#e0533d']].map(([n, hs, c], gi) => (
          <Pop key={gi} f={f} at={LT(T, 's30', 3) + gi * 20} from="left">
            <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24}}>
              <div style={{width: 340, fontSize: 36, fontWeight: 900, color: c as string}}>{n as string}</div>
              {(hs as number[]).map((h, i) => <div key={i} style={{width: 150, height: 90, borderRadius: 12, background: `${c as string}${h === 9 ? 'cc' : '55'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 900}}><div style={{fontSize: 22, color: K.sub}}>{days[i]}</div><div style={{fontSize: 32}}>{gi === 2 && i >= 5 ? '好きなだけ' : `${h}時間`}</div></div>)}
            </div>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={LT(T, 's30', 7)} style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontSize: 50, fontWeight: 900, color: '#ff4d3d'}}>平日に戻ると インスリンの効きが下がった</Pop>
      <Pop f={f} at={LT(T, 's30', 9)} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontSize: 64, fontWeight: 900, color: K.gold}}>週末の寝だめでは取り返せない</Pop>
    </DarkBoard>
  );
};

// ============ 8. 脳の掃除 ============
const Flow: React.FC<{f: number; k: number; speed?: number}> = ({f, k, speed = 1}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: k}}>
    {Array.from({length: 60}, (_, i) => {
      const y0 = 260 + ((i * 97) % 420), x = 520 + ((((f * 2.4 * speed + i * 57) % 760) + 760) % 760);
      return <circle key={i} cx={x} cy={y0 + Math.sin((f + i * 13) / 14) * 18} r={6 + (i % 3) * 2} fill="#7fd1ff" opacity={0.55} />;
    })}
  </svg>
);
const S31: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill>
    <BrainShot f={f} rot={0.15} glows={[]} />
    <Flow f={f} k={seg(f, 10, 40)} />
    <Pop f={f} at={LT(T, 's31', 1)} style={{position: 'absolute', left: 120, top: 90, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: K.sub}}>マウスの実験</Pop>
    <Pop f={f} at={LT(T, 's31', 2)} from="scale" style={{position: 'absolute', left: 1300, top: 160, fontFamily: FONT, fontSize: 54, fontWeight: 900, color: '#7fd1ff', width: 520}}>眠っていると 細胞のすき間が約60％広がる</Pop>
  </AbsoluteFill>
);
const Arrows: React.FC<{f: number; at: number}> = ({f, at}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', justifyContent: 'center', gap: 260, fontFamily: FONT}}>
    <Pop f={f} at={at}><div style={{textAlign: 'center'}}><div style={{fontSize: 200, color: '#5fc6b4', lineHeight: 1}}>⬆</div><div style={{fontSize: 56, fontWeight: 900, color: '#5fc6b4'}}>速くなる</div></div></Pop>
    <Pop f={f} at={at + 20}><div style={{textAlign: 'center'}}><div style={{fontSize: 200, color: '#e8a04c', lineHeight: 1}}>⬇</div><div style={{fontSize: 56, fontWeight: 900, color: '#e8a04c'}}>遅くなる</div></div></Pop>
  </div>
);
const S32: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill>
    <BrainShot f={f} rot={0.15} glows={[]} dim={0.5} />
    <Flow f={f} k={1 - seg(f, 0, 30)} />
    <AbsoluteFill style={{background: 'rgba(7,8,11,0.55)'}} />
    <Arrows f={f} at={LT(T, 's32', 1)} />
    <Pop f={f} at={LT(T, 's32', 2)} style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: FONT, fontSize: 52, fontWeight: 900, color: K.ink}}>まだ決着はついていない</Pop>
  </AbsoluteFill>
);
const S33: React.FC<SceneProps> = ({f}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 300, top: 160, fontSize: 200, color: '#5fc6b4'}}>⬆</div>
    <div style={{position: 'absolute', left: 1450, top: 160, fontSize: 200, color: '#e8a04c'}}>⬇</div>
    <MascotOverlay f={f} x={740} y={200} w={440} h={520} rotY={0} tone="light" pose={{headTurn: 0.4 * Math.sin(f / 30)}} />
  </WhiteStudio>
);

// ============ 9. 続けたら ============
const S34: React.FC<SceneProps> = ({f, T}) => {
  const n = Math.round(138 * seg(f, LT(T, 's34', 6) - 10, LT(T, 's34', 6) + 40));
  return (
    <DarkBoard>
      <svg width={1920} height={760} style={{position: 'absolute', top: 30}}>
        {Array.from({length: 240}, (_, i) => <circle key={i} cx={120 + ((i * 97) % 1680)} cy={60 + ((i * 61) % 560)} r={5 + (i % 3) * 2} fill="#5fc6b4" opacity={seg(f, i * 0.4, i * 0.4 + 10) * 0.6} />)}
      </svg>
      <StepCard f={f} at={LT(T, 's34', 3)} n="手順1" text="ふだんの睡眠時間を聞く" x={120} y={120} w={760} />
      <StepCard f={f} at={LT(T, 's34', 4)} n="手順2" text="4年〜25年 追いかける" x={120} y={270} w={760} />
      <StepCard f={f} at={LT(T, 's34', 5)} n="手順3" text="亡くなった人の割合を比べる" x={120} y={420} w={760} />
      {f >= LT(T, 's34', 6) - 10 && <div style={{position: 'absolute', left: 1000, top: 300, fontFamily: FONT, textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}><div style={{fontSize: 120, fontWeight: 900}}>{n}万人あまり</div><div style={{fontSize: 40, fontWeight: 800, color: K.sub}}>16本の研究をまとめた分析</div></div>}
    </DarkBoard>
  );
};
const S35: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="追いかけているあいだに亡くなる危険" y={50} size={48} />
    <Bars f={f} at={LT(T, 's35', 1) - 10} max={1.3} y={130} h={560} x={460} w={1000} items={[{label: '標準的な睡眠', v: 1, text: '基準', color: '#6c7a96'}, {label: '睡眠が短い人', v: 1.12, text: '12％高い', color: '#e0533d'}]} />
  </DarkBoard>
);
const S36: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="追いかけているあいだに亡くなる危険" y={50} size={48} />
    <Bars f={f} at={0} max={1.3} y={130} h={560} x={260} w={1000} items={[{label: '標準的な睡眠', v: 1, text: '基準', color: '#6c7a96'}, {label: '睡眠が短い人', v: 1.12, text: '12％高い', color: '#e0533d'}]} />
    <Pop f={f} at={LT(T, 's36', 2)} from="scale" style={{position: 'absolute', left: 1320, top: 260, width: 440, padding: '30px 30px', borderRadius: 22, background: 'rgba(232,160,76,0.15)', border: '3px solid #e8a04c', textAlign: 'center'}}><div style={{fontSize: 40, fontWeight: 900}}>睡眠が長すぎる人も</div><div style={{fontSize: 56, fontWeight: 900, color: '#e8a04c', marginTop: 10}}>危険は高い</div></Pop>
    <Pop f={f} at={LT(T, 's36', 1)} style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontSize: 42, fontWeight: 900, color: K.ink}}>結びつきで 原因を証明したものではない</Pop>
  </DarkBoard>
);
const S37: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #070a14, #121a2e 70%, #0b0e16)', fontFamily: FONT}}>
    {Array.from({length: 7}, (_, b) => (
      <div key={b} style={{position: 'absolute', left: 60 + b * 260, bottom: 160, width: 220, height: 260 + ((b * 83) % 220), background: '#141a26'}}>
        {Array.from({length: 18}, (_, w) => {
          const lit = ((w * 7 + b * 13) % 10) < 3 + Math.min(6, Math.floor(f / 40));
          return <div key={w} style={{position: 'absolute', left: 20 + (w % 3) * 66, top: 20 + Math.floor(w / 3) * 60, width: 44, height: 34, background: lit ? '#ffd29a' : '#1e2534', opacity: lit ? 0.9 : 1}} />;
        })}
      </div>
    ))}
    <Clock text={f < 120 ? '23:00' : f < 240 ? '0:30' : '1:40'} x={150} y={100} size={90} />
    <Pop f={f} at={LT(T, 's37', 1)} from="scale" style={{position: 'absolute', left: 1080, top: 120, padding: '18px 32px', borderRadius: 18, background: 'rgba(10,12,18,0.85)', fontSize: 60, fontWeight: 900, color: '#ff4d3d'}}>その4割に あなたは？</Pop>
  </AbsoluteFill>
);

// ============ 10. ショートスリーパー ============
const S38: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.6} />
    <PhonePOV f={f} flick={0} x={760} y={60} scale={1.0} thumb={false} screen={<PostsScreen f={f} />} />
    {f >= LT(T, 's38', 3) && <Pop f={f} at={LT(T, 's38', 3)} from="scale" style={{position: 'absolute', left: 150, top: 220, fontFamily: FONT, padding: '20px 34px', borderRadius: 18, background: 'rgba(10,12,18,0.85)'}}><div style={{fontSize: 56, fontWeight: 900, color: K.gold}}>います</div><div style={{fontSize: 56, fontWeight: 900, color: '#ff4d3d'}}>ただし とても少ない</div></Pop>}
    <Vignette />
  </AbsoluteFill>
);
const Tree: React.FC<{f: number; at: number; hi: number[]; labels?: Record<number, string>}> = ({f, at, hi, labels = {}}) => {
  const pos: [number, number][] = [[660, 160], [1260, 160], [460, 460], [760, 460], [1060, 460], [1360, 460], [610, 720], [910, 720], [1210, 720]];
  const links = [[0, 2], [0, 3], [1, 4], [1, 5], [3, 6], [4, 7], [5, 8]];
  return (
    <>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {links.map(([a, b], i) => <line key={i} x1={pos[a][0]} y1={pos[a][1] + 70} x2={pos[b][0]} y2={pos[b][1] - 60} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />)}
        <line x1={pos[0][0] + 60} y1={pos[0][1]} x2={pos[1][0] - 60} y2={pos[1][1]} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
      </svg>
      {pos.map(([x, y], i) => {
        const on = hi.includes(i) && f >= at;
        return (
          <div key={i} style={{position: 'absolute', left: x - 110, top: y - 70, width: 220, height: 150, borderRadius: 18, background: on ? 'rgba(232,196,106,0.2)' : 'rgba(255,255,255,0.05)', border: `3px solid ${on ? K.gold : 'rgba(255,255,255,0.15)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
            <PersonIcon size={70} color={on ? '#e8c46a' : '#7a849a'} />
            {labels[i] && <div style={{fontSize: 30, fontWeight: 900, color: on ? K.gold : K.sub}}>{labels[i]}</div>}
          </div>
        );
      })}
    </>
  );
};
const S39: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Tree f={f} at={LT(T, 's39', 2)} hi={[0, 3, 6]} />
    <StepCard f={f} at={LT(T, 's39', 3)} n="手順" text="家族全員の睡眠と遺伝子を調べる" x={120} y={40} w={900} />
  </DarkBoard>
);
const S40: React.FC<SceneProps> = ({f, T}) => {
  const lab: Record<number, string> = f >= LT(T, 's40', 2) ? {0: '6.25時間', 3: '6.25時間', 1: '8.06時間', 2: '8.06時間', 4: '8.06時間'} : {};
  return (
    <DarkBoard>
      <Tree f={f} at={0} hi={[0, 3]} labels={lab} />
      <Pop f={f} at={LT(T, 's40', 1)} style={{position: 'absolute', left: 120, top: 40, fontSize: 42, fontWeight: 900, color: K.gold}}>睡眠の長さに関わる遺伝子に 珍しい変異</Pop>
      {f >= LT(T, 's40', 7) && <Pop f={f} at={LT(T, 's40', 7)} from="scale" style={{position: 'absolute', left: 1460, top: 860, fontSize: 52, fontWeight: 900, color: '#ff4d3d'}}>とても珍しい</Pop>}
    </DarkBoard>
  );
};
const S41: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill>
    <Still src="mri" f={f} dur={dur} dark={0.45} />
    <Pop f={f} at={LT(T, 's41', 1)} style={{position: 'absolute', left: 120, top: 80, fontFamily: FONT, fontSize: 48, fontWeight: 900, color: K.ink, textShadow: '0 3px 12px rgba(0,0,0,0.6)'}}>839人分の脳の画像</Pop>
    <div style={{position: 'absolute', left: 120, top: 200, display: 'flex', flexDirection: 'column', gap: 24}}>
      {['6時間以下・つらい', '6時間以下・平気', 'しっかり眠る'].map((s, i) => <Pop key={i} f={f} at={LT(T, 's41', 3) + i * 20} from="left"><div style={{padding: '16px 30px', borderRadius: 14, background: 'rgba(10,12,18,0.85)', fontSize: 44, fontWeight: 900, color: i === 1 ? K.gold : K.ink, fontFamily: FONT}}>{s}</div></Pop>)}
    </div>
  </AbsoluteFill>
);
const Net: React.FC<{f: number; sleepy: boolean; label: string; color: string; at: number}> = ({f, sleepy, label, color, at}) => {
  const nodes: [number, number][] = [[80, 80], [220, 50], [340, 120], [300, 260], [160, 280], [60, 200], [200, 170]];
  const links = sleepy ? [[0, 6], [6, 3], [1, 6]] : [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 0], [6, 2], [6, 4]];
  return (
    <div style={{width: 420, textAlign: 'center', fontFamily: FONT, opacity: f >= at ? 1 : 0.2}}>
      <svg width={420} height={340} viewBox="0 0 420 340">
        {links.map(([a, b], i) => <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={color} strokeWidth={6} opacity={0.6 + 0.3 * Math.sin((f + i * 10) / 12)} />)}
        {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={16} fill={color} />)}
      </svg>
      <div style={{fontSize: 34, fontWeight: 900}}>{label}</div>
      <div style={{fontSize: 30, fontWeight: 800, color: sleepy ? '#ff7a64' : '#5fc6b4', marginTop: 6}}>{sleepy ? '眠りに近い形' : '起きているときの形'}</div>
    </div>
  );
};
const S42: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 140, right: 140, top: 160, display: 'flex', justifyContent: 'space-between'}}>
      <Net f={f} at={LT(T, 's42', 1)} sleepy={false} label="しっかり眠る" color="#5fc6b4" />
      <Net f={f} at={LT(T, 's42', 1) + 20} sleepy label="6時間以下・つらい" color="#e8a04c" />
      <Net f={f} at={LT(T, 's42', 2)} sleepy label="6時間以下・平気" color="#e0533d" />
    </div>
    <Pop f={f} at={LT(T, 's42', 2)} style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', fontSize: 50, fontWeight: 900, color: '#ff4d3d'}}>「平気」と答えた人の脳も 眠りに近かった</Pop>
  </DarkBoard>
);
const S43: React.FC<SceneProps> = ({f}) => (
  <WhiteStudio>
    <Title f={f} text="あなたは何個あてはまる？" y={60} size={56} color="#1d2230" />
    <Cards f={f} on={() => 0} hi={4} only5 />
    <MascotOverlay f={f} x={1460} y={460} w={380} h={420} rotY={-1.0} tone="light" pose={{headNod: -0.3}} />
  </WhiteStudio>
);

// ============ 11. 今夜からできること ============
const TipHead: React.FC<{f: number; n: string; text: string}> = ({f, n, text}) => (
  <div style={{position: 'absolute', left: 90, top: 70, display: 'flex', alignItems: 'center', gap: 24, fontFamily: FONT, opacity: fadeIn(f, 0, 10)}}>
    <div style={{padding: '10px 24px', borderRadius: 14, background: K.gold, color: '#141820', fontSize: 44, fontWeight: 900}}>{n}</div>
    <div style={{fontSize: 56, fontWeight: 900, color: K.ink, textShadow: '0 3px 12px rgba(0,0,0,0.7)'}}>{text}</div>
  </div>
);
const AlarmScreen: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#101420', padding: '110px 30px', fontFamily: FONT, color: '#fff'}}>
    <div style={{fontSize: 26, color: '#9fb0d0'}}>アラーム</div>
    <div style={{fontSize: 110, fontWeight: 900, marginTop: 10}}>23:00</div>
    <div style={{fontSize: 34, fontWeight: 800, marginTop: 10, color: K.gold}}>スマホを置く時間</div>
  </div>
);
const S44: React.FC<SceneProps> = ({f, dur, T}) => {
  const tip = f >= LT(T, 's44', 2);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="living" f={f} dur={dur} dark={0.45} />
      {!tip && <Pop f={f} at={LT(T, 's44', 1)} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: FONT}}><div style={{fontSize: 100, fontWeight: 900, color: K.gold}}>今夜からできること</div><div style={{fontSize: 130, fontWeight: 900, color: K.ink}}>4つ</div></Pop>}
      {tip && <><TipHead f={f - LT(T, 's44', 2)} n="一つ目" text="「スマホを置く時間」を昼に決める" /><PhonePOV f={f} flick={0} x={760} y={200} scale={0.85} screen={<AlarmScreen />} /></>}
      <Vignette />
    </AbsoluteFill>
  );
};
const S45: React.FC<SceneProps> = ({f, dur}) => {
  const out = seg(f, 20, 80);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bedLamp" f={f} dur={dur} dark={0.35} />
      <div style={{position: 'absolute', left: 1300 + out * 500, top: 470, width: 130, height: 240, borderRadius: 22, background: '#0d0f13', boxShadow: '0 0 0 3px #2b2f37', opacity: 1 - out}} />
      <TipHead f={f} n="二つ目" text="スマホを寝室に持ち込まない" />
      <MascotOverlay f={f} x={120} y={460} w={320} h={380} rotY={0.6} />
      <Vignette />
    </AbsoluteFill>
  );
};
const S46: React.FC<SceneProps> = ({f}) => {
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  return (
    <DarkBoard>
      <TipHead f={f} n="三つ目" text="寝だめで取り返そうとしない" />
      <div style={{position: 'absolute', left: 200, top: 260, display: 'flex', gap: 24, fontFamily: FONT}}>
        {days.map((d, i) => <Pop key={i} f={f} at={10 + i * 6}><div style={{width: 200, height: 260, borderRadius: 16, background: '#f4f1ea', color: '#1d2230', textAlign: 'center', paddingTop: 24}}><div style={{fontSize: 34, fontWeight: 900, color: i >= 5 ? '#e0533d' : '#1d2230'}}>{d}</div><div style={{fontSize: 34, fontWeight: 900, marginTop: 40}}>6時間以上</div><div style={{fontSize: 30, marginTop: 20}}>⏰ 同じ時間</div></div></Pop>)}
      </div>
    </DarkBoard>
  );
};
const S47: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="living" f={f} dur={dur} dark={0.25} />
    <AbsoluteFill style={{background: 'rgba(255,190,120,0.15)'}} />
    <div style={{position: 'absolute', left: 820, top: 420, fontSize: 220, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'}}>☕</div>
    <TipHead f={f} n="四つ目" text="自分の時間を夜の最後に置かない" />
    <Vignette />
  </AbsoluteFill>
);

// ============ 12. まとめ ============
const SUM: [number, string][] = [[1, 'がんばった日ほど 夜は自分を止められない'], [2, '取り返したいのは 昼間に奪われた自分の時間'], [3, '睡眠が足りてない頭は 疲れに気づけない'], [4, '6時間を14日で 最大2晩徹夜と同じ'], [5, '感情のブレーキが効かず 体は食べる方向へ'], [6, '生まれつきのショートスリーパーは とても少ない'], [7, '大人の4割近くが 6時間も眠っていない']];
const S48: React.FC<SceneProps> = ({f, T}) => {
  const q = f >= LT(T, 's48', 9);
  if (q) return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 820, top: 520, width: 280, height: 60, borderRadius: 14, background: '#15171c', boxShadow: '0 12px 30px rgba(0,0,0,0.3)'}} />
      <MascotOverlay f={f} x={700} y={150} w={500} h={560} rotY={0} tone="light" pose={{headNod: -0.2}} />
    </WhiteStudio>
  );
  return (
    <DarkBoard>
      <Title f={f} text="今夜 あなたは何をキャンセルしますか" y={40} size={54} color={K.gold} />
      {SUM.map(([k, s], i) => (
        <Pop key={i} f={f} at={LT(T, 's48', k)} from="left" style={{position: 'absolute', left: 300, top: 140 + i * 96, width: 1320}}>
          <div style={{padding: '12px 26px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', fontSize: 38, fontWeight: 800}}>{s}</div>
        </Pop>
      ))}
    </DarkBoard>
  );
};

export const SCENES_Y2: Record<string, React.FC<SceneProps>> = {
  s25: S25, s26: S26wrap, s27: S27, s28: S28, s29: S29, s30: S30, s31: S31, s32: S32, s33: S33, s34: S34, s35: S35, s36: S36, s37: S37,
  s38: S38, s39: S39, s40: S40, s41: S41, s42: S42, s43: S43, s44: S44, s45: S45, s46: S46, s47: S47, s48: S48,
};
export const _y2 = {interpolate, clamp, Bars, Clock};
