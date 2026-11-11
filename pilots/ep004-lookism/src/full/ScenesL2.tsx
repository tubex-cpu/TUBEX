import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Bars, DarkBoard, SceneProps, StepCard, WhiteStudio, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Pop, clamp} from './ui';
import {Card, FaceCard, LT, Mirror} from './ScenesL1';

const TXT = (s: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, textShadow: '0 4px 22px rgba(0,0,0,0.85)', ...s});

// ============ 6. 見られている意識 ============
const S19: React.FC<SceneProps> = ({f}) => (
  <DarkBoard tint="#262b33">
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 400, background: 'linear-gradient(180deg, #3c4048, #22252b)'}} />
    <div style={{position: 'absolute', left: 300, top: 470, width: 520, height: 180, transform: 'rotate(-4deg)', background: '#f4f2ec', borderRadius: 6, padding: 20, fontFamily: FONT, fontSize: 26, fontWeight: 800, color: '#445', boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}}>発表資料<div style={{height: 8, background: '#ccd', width: 380, marginTop: 14}} /><div style={{height: 8, background: '#ccd', width: 320, marginTop: 14}} /></div>
    <div style={{position: 'absolute', left: 1120, top: 80, width: 560, height: 420, borderRadius: 10, background: 'linear-gradient(160deg, rgba(150,170,200,0.35), rgba(60,70,90,0.4))', border: '8px solid #555b66', overflow: 'hidden'}}>
      <svg width="560" height="420" viewBox="0 0 560 420"><path d="M 90 420 C 100 300 180 250 280 250 C 380 250 460 300 470 420 Z" fill="rgba(30,36,48,0.8)" /><rect x="200" y="-40" width="160" height="280" rx="80" fill="rgba(30,36,48,0.8)" /></svg>
      <div style={{position: 'absolute', left: 230 + 20 * Math.sin(f / 5), top: 40, fontSize: 90}}>✋</div>
    </div>
    <Pop f={f} at={30} style={TXT({top: 150, left: 120, right: 'auto', width: 900, fontSize: 76, color: '#ff7a64'})}>話す内容が 飛ぶ</Pop>
  </DarkBoard>
);
const Door: React.FC<{icon: string; label: string; open: number}> = ({icon, label, open}) => (
  <div style={{width: 360, textAlign: 'center', fontFamily: FONT}}>
    <div style={{height: 470, borderRadius: 10, background: '#e6e2da', border: '8px solid #b9b2a6', position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: '#cfc8bb', transformOrigin: 'left center', transform: `perspective(800px) rotateY(${-70 * open}deg)`, borderRight: '6px solid #a8a092'}}><div style={{position: 'absolute', right: 30, top: 230, width: 20, height: 20, borderRadius: 10, background: '#776f60'}} /></div>
    </div>
    <div style={{marginTop: 16, fontSize: 90}}>{icon}</div>
    <div style={{fontSize: 36, fontWeight: 900, color: '#1d2230'}}>{label}</div>
  </div>
);
const S20: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's20', 5);
  const mirror = f >= LT(T, 's20', 11);
  if (mirror) return (
    <AbsoluteFill>
      <Mirror f={f} hand={false} />
      <Pop f={f} at={LT(T, 's20', 11) + 10} from="scale" style={TXT({top: 200, fontSize: 100, color: K.gold})}>鏡の前で 何分？</Pop>
      <Vignette />
    </AbsoluteFill>
  );
  if (!res) return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 1080, top: 40, display: 'flex', gap: 60}}>
        <Door icon="👙" label="水着" open={seg(f, LT(T, 's20', 2), LT(T, 's20', 2) + 20)} />
        <Door icon="🧶" label="セーター" open={seg(f, LT(T, 's20', 2), LT(T, 's20', 2) + 20)} />
      </div>
      <StepCard f={f} at={LT(T, 's20', 2)} n="手順1" text="一人で 更衣室に入る" x={100} y={130} w={900} light />
      <StepCard f={f} at={LT(T, 's20', 3)} n="手順2" text="くじで決めた服に着替える 水着か セーター" x={100} y={300} w={900} light />
      <StepCard f={f} at={LT(T, 's20', 4)} n="手順3" text="その格好で 数学のテストを解く" x={100} y={470} w={900} light />
    </WhiteStudio>
  );
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 260, top: 80, display: 'flex', gap: 120, fontFamily: FONT}}>
        <Pop f={f} at={LT(T, 's20', 6)} style={{width: 640, padding: 36, borderRadius: 20, background: 'rgba(60,20,20,0.6)', border: '3px solid #ff7a64'}}>
          <div style={{fontSize: 44, fontWeight: 900}}>水着を着た女性</div>
          <div style={{fontSize: 40, fontWeight: 900, color: '#ff7a64', marginTop: 16}}>恥ずかしさ ↑</div>
          <div style={{fontSize: 56, fontWeight: 900, color: '#ff3b30', marginTop: 8}}>数学の成績 ↓</div>
        </Pop>
        {f >= LT(T, 's20', 8) && <Pop f={f} at={LT(T, 's20', 8)} style={{width: 520, padding: 36, borderRadius: 20, background: 'rgba(20,24,34,0.8)', border: '3px solid rgba(255,255,255,0.2)'}}>
          <div style={{fontSize: 44, fontWeight: 900}}>男性</div>
          <div style={{fontSize: 48, fontWeight: 900, color: K.sub, marginTop: 24}}>成績の差 なし</div>
        </Pop>}
      </div>
      {f >= LT(T, 's20', 7) && f < LT(T, 's20', 9) && <Pop f={f} at={LT(T, 's20', 7)} style={TXT({top: 470, fontSize: 56, color: K.gold})}>一人きりの部屋 誰にも見られていない</Pop>}
      {f >= LT(T, 's20', 9) && <Pop f={f} at={LT(T, 's20', 9)} from="scale" style={TXT({top: 470, fontSize: 72, color: '#ff7a64'})}>考える力を その場で削っている</Pop>}
    </DarkBoard>
  );
};

// ============ 7. ルッキズムは うつるのか ============
const Bubble: React.FC<{f: number; at: number; text: string; x: number; y: number; me?: boolean}> = ({f, at, text, x, y, me}) => (
  <Pop f={f} at={at} from={me ? 'right' : 'left'} style={{position: 'absolute', left: x, top: y, padding: '18px 30px', borderRadius: 30, background: me ? '#ffe3dd' : '#ffffff', color: '#1d2230', fontFamily: FONT, fontSize: 44, fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.35)'}}>{text}</Pop>
);
const S21: React.FC<SceneProps> = ({f, T}) => {
  const term = f >= LT(T, 's21', 3);
  return (
    <DarkBoard tint="#3a2e24">
      <div style={{position: 'absolute', left: 360, right: 360, top: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, #6a5038, #3a2a1c)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontSize: 100}}>☕　🍰　☕</div>
      <Bubble f={f} at={LT(T, 's21', 1)} text="私 太った" x={300} y={120} />
      <Bubble f={f} at={LT(T, 's21', 1, 1)} text="顔むくんでる" x={1220} y={170} />
      <Bubble f={f} at={LT(T, 's21', 1, 2)} text="いや 私のほうがヤバい" x={640} y={300} me />
      {term && <Pop f={f} at={LT(T, 's21', 3)} from="scale" style={TXT({top: 430, fontSize: 90, color: K.gold})}>ファットトーク</Pop>}
      {f >= LT(T, 's21', 5) && <Pop f={f} at={LT(T, 's21', 5)} style={{position: 'absolute', left: 380, right: 380, top: 30, padding: '18px 30px', borderRadius: 16, background: 'rgba(60,20,20,0.75)', border: '3px solid #ff7a64', textAlign: 'center', fontFamily: FONT, fontSize: 44, fontWeight: 900, color: '#ffb3a6'}}>加わった人ほど 不満と罪悪感が強くなる</Pop>}
    </DarkBoard>
  );
};
const Circles: React.FC<{f: number; light?: boolean}> = ({f, light}) => (
  <div style={{position: 'absolute', left: 1000, top: 70, width: 820, height: 560}}>
    {[[0, 0], [430, 40], [120, 290], [520, 310]].map(([x, y], i) => (
      <div key={i} style={{position: 'absolute', left: x, top: y, width: 300, height: 220, borderRadius: '50%', border: `5px solid ${light ? '#8a8478' : 'rgba(255,255,255,0.4)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: interpolate(f, [i * 6, i * 6 + 12], [0, 1], clamp)}}>
        {[0, 1, 2].map((j) => <PersonIcon key={j} size={70} color={['#d77a6a', '#6f9bd6', '#8cc08a', '#c9a35a'][i]} />)}
      </div>
    ))}
  </div>
);
const S22: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's22', 6) && f < LT(T, 's22', 8);
  const caveat = f >= LT(T, 's22', 8) && f < LT(T, 's22', 11);
  const tail = f >= LT(T, 's22', 11);
  if (tail) return (
    <DarkBoard>
      <Card f={f} at={LT(T, 's22', 12)} x={260} y={90} w={1400} text="SNSは 10分で気分を変えた" />
      <Card f={f} at={LT(T, 's22', 12, 1)} x={260} y={230} w={1400} text="体型の悪口は その場で不満を強めた" />
      <Card f={f} at={LT(T, 's22', 14)} x={260} y={370} w={1400} color="#ff7a64" text="悩む人の周りには 同じ悩みの人が集まる" />
      {f >= LT(T, 's22', 15) && <Pop f={f} at={LT(T, 's22', 15)} from="scale" style={TXT({top: 540, fontSize: 70, color: '#ff3b30'})}>抜け出すきっかけが 周りにない</Pop>}
    </DarkBoard>
  );
  return (
    <WhiteStudio>
      <Circles f={f} light />
      {!res && !caveat && (
        <>
          <Pop f={f} at={LT(T, 's22', 1)} style={{position: 'absolute', left: 110, top: 50, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: '#556'}}>中学生くらいの女の子 仲良しグループ173組</Pop>
          <StepCard f={f} at={LT(T, 's22', 3)} n="手順1" text="誰と仲がいいかを聞き グループを割り出す" x={100} y={150} w={860} light />
          <StepCard f={f} at={LT(T, 's22', 4)} n="手順2" text="ダイエットや食べ方 体の悩みを聞く" x={100} y={320} w={860} light />
          <StepCard f={f} at={LT(T, 's22', 5)} n="手順3" text="同じグループの子どうしを比べる" x={100} y={490} w={860} light />
        </>
      )}
      {res && <Card f={f} at={LT(T, 's22', 7)} light x={100} y={180} w={860} text="同じグループの子どうしは ダイエットの行動が似ていた" />}
      {caveat && (
        <>
          <Card f={f} at={LT(T, 's22', 9)} light x={100} y={120} w={860} text="似ている理由は 主に「似た子どうしが友達になる」から" />
          <Card f={f} at={LT(T, 's22', 10)} light x={100} y={340} w={860} color="#c0392b" text="病気のようにうつると 証明されたわけではない" />
        </>
      )}
    </WhiteStudio>
  );
};

// ============ 8. 今 日本で ============
const S23: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#1e2a3a">
    <div style={{position: 'absolute', left: 1200, top: 60, fontSize: 420, filter: `drop-shadow(0 0 40px rgba(232,196,106,${0.4 + 0.2 * Math.sin(f / 12)}))`}}>🗾</div>
    <Pop f={f} at={LT(T, 's23', 1)} style={{position: 'absolute', left: 140, top: 90, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: K.sub}}>20代の女性で BMI18.5未満「やせ」</Pop>
    <Pop f={f} at={LT(T, 's23', 1, 9)} from="scale" style={{position: 'absolute', left: 140, top: 160, fontFamily: FONT, fontSize: 200, fontWeight: 900, color: K.gold}}>20.7％</Pop>
    <div style={{position: 'absolute', left: 150, top: 450, display: 'flex', gap: 20}}>
      {[0, 1, 2, 3, 4].map((i) => <Pop key={i} f={f} at={LT(T, 's23', 2) + i * 5}><PersonIcon size={120} color={i === 0 ? '#ff7a64' : '#55607a'} /></Pop>)}
    </div>
    {f >= LT(T, 's23', 4) && <Pop f={f} at={LT(T, 's23', 4)} style={{position: 'absolute', left: 140, top: 650, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: K.ink}}>この10年 ほとんど変わらない</Pop>}
  </DarkBoard>
);
const S24: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's24', 2);
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 160, top: 60, display: 'flex', gap: 40}}>
        {['日本', 'アメリカ', '中国', '韓国'].map((c, i) => (
          <Pop key={c} f={f} at={LT(T, 's24', 1) + i * 6} style={{width: 370, padding: 30, borderRadius: 18, background: i === 0 ? 'rgba(60,40,20,0.7)' : 'rgba(20,24,34,0.8)', border: `3px solid ${i === 0 ? K.gold : 'rgba(255,255,255,0.15)'}`, fontFamily: FONT, textAlign: 'center'}}>
            <div style={{fontSize: 50, fontWeight: 900, color: i === 0 ? K.gold : K.ink}}>{c}</div>
            <div style={{fontSize: 28, fontWeight: 800, color: K.sub, marginTop: 6}}>女子高校生</div>
          </Pop>
        ))}
      </div>
      <Card f={f} at={LT(T, 's24', 1, 1)} x={160} y={270} w={1600} size={40} text="日本は 4か国で一番やせていて 標準体重の子が一番多い" />
      {res && <Card f={f} at={LT(T, 's24', 2)} x={160} y={410} w={1600} size={40} color="#ff7a64" text="なのに 体型への満足は一番低く およそ半数が「太っている」と思う" />}
      {f >= LT(T, 's24', 4) && <Pop f={f} at={LT(T, 's24', 4)} from="scale" style={TXT({top: 580, fontSize: 70, color: '#ff3b30'})}>かなり深刻な状態</Pop>}
    </DarkBoard>
  );
};
const S25: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Pop f={f} at={LT(T, 's25', 1)} style={TXT({top: 50, fontSize: 44, color: K.sub})}>美容医療の施術件数（美容外科の学会の全国調査）</Pop>
    <Bars f={f} at={LT(T, 's25', 1, 1)} max={480} x={460} y={120} w={1000} h={480} items={[{label: '2024年', v: 306, text: '約306万件', color: '#7f8aa8'}, {label: '2025年', v: 433, text: '約433万件', color: '#e8c46a'}]} />
    {f >= LT(T, 's25', 2) && <Pop f={f} at={LT(T, 's25', 2)} style={TXT({top: 640, fontSize: 50, color: K.ink})}>9割以上は メスを使わない施術</Pop>}
  </DarkBoard>
);
const S26: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#1e2a3a">
    <div style={{position: 'absolute', left: 1240, top: 40, fontSize: 360, opacity: 0.5}}>🗾</div>
    <MascotOverlay f={f} x={1300} y={400} w={360} h={420} rotY={2.6} />
    <Card f={f} at={LT(T, 's26', 0)} x={140} y={90} w={1000} text="体は細いのに 太っていると思う" />
    <Card f={f} at={LT(T, 's26', 1)} x={140} y={230} w={1000} text="素顔では 外に出られない" />
    <Card f={f} at={LT(T, 's26', 2)} x={140} y={370} w={1000} text="変えられるところは お金で変える" />
    {f >= LT(T, 's26', 3) && <Pop f={f} at={LT(T, 's26', 3)} from="scale" style={{position: 'absolute', left: 140, top: 540, fontFamily: FONT, fontSize: 60, fontWeight: 900, color: '#ff7a64'}}>見た目に点数をつけ続ける社会</Pop>}
  </DarkBoard>
);

// ============ 9. 子どものころの あの一言 ============
const S27: React.FC<SceneProps> = ({f, T}) => {
  const lab = f >= LT(T, 's27', 2) && f < LT(T, 's27', 10);
  const tail = f >= LT(T, 's27', 10);
  if (lab) {
    const res = f >= LT(T, 's27', 7);
    return (
      <DarkBoard>
        {!res ? (
          <>
            <Pop f={f} at={LT(T, 's27', 2)} style={{position: 'absolute', left: 120, top: 60, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: K.sub}}>中学生と高校生 4,746人</Pop>
            <StepCard f={f} at={LT(T, 's27', 4)} n="手順1" text="体重のことで からかわれた経験を聞く" x={110} y={150} w={1100} />
            <StepCard f={f} at={LT(T, 's27', 5)} n="手順2" text="体への満足 自分への評価 気分の落ち込みを聞く" x={110} y={310} w={1100} />
            <StepCard f={f} at={LT(T, 's27', 6)} n="手順3" text="実際の体重を考えに入れて 比べる" x={110} y={470} w={1100} />
          </>
        ) : (
          <>
            <Pop f={f} at={LT(T, 's27', 8)} style={TXT({top: 70, fontSize: 50, color: K.gold})}>からかわれた子は 実際の体重に関係なく</Pop>
            <Card f={f} at={LT(T, 's27', 8, 1)} x={300} y={170} w={1320} color="#ff7a64" text="体への満足が低い　自分への評価が低い　落ち込みが強い" />
            {f >= LT(T, 's27', 9) && <Card f={f} at={LT(T, 's27', 9)} x={300} y={340} w={1320} size={40} text="5年後も 心の状態や食べ方の乱れと結びついていた" />}
          </>
        )}
      </DarkBoard>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a2a2e 0%, #3a3934 55%, #4a453c 100%)'}}>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <polygon points="0,0 760,330 760,650 0,1080" fill="#34342f" />
        <polygon points="1920,0 1160,330 1160,650 1920,1080" fill="#30302b" />
        <rect x="760" y="330" width="400" height="320" fill="#1d1d1b" />
        {[0, 1, 2].map((i) => <rect key={i} x={1250 + i * 210} y={250 - i * 40} width={130} height={180 + i * 60} fill="rgba(200,220,240,0.12)" transform={`skewY(${-22})`} />)}
      </svg>
      {!tail && (
        <>
          {f % 90 < 50 && f > 20 && <div style={{position: 'absolute', left: 260, top: 300, fontFamily: FONT, fontSize: 90, fontWeight: 900, color: 'rgba(255,90,70,0.85)', transform: 'rotate(-8deg)'}}>デブ</div>}
          {(f + 45) % 90 < 50 && f > 40 && <div style={{position: 'absolute', left: 1400, top: 420, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: 'rgba(255,90,70,0.85)', transform: 'rotate(6deg)'}}>顔でか</div>}
        </>
      )}
      {tail && (
        <>
          <Pop f={f} at={LT(T, 's27', 10)} style={TXT({top: 200, fontSize: 64, color: K.ink})}>軽い一言は 何年も残る</Pop>
          {f >= LT(T, 's27', 12) && <Pop f={f} at={LT(T, 's27', 12)} style={TXT({top: 340, fontSize: 64, color: '#ff7a64'})}>まだ誰かの中で 鳴り続けている</Pop>}
        </>
      )}
      <Vignette />
    </AbsoluteFill>
  );
};

// ============ 10. いい見た目って何 ============
const S28: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 810, top: 120, width: 300, height: 360, opacity: 0.7}}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', inset: 0, opacity: 0.5 + 0.5 * Math.sin(f / 10 + i * 1.6)}}><FaceCard w={300} hue={i * 80} light /></div>)}
    </div>
    <MascotOverlay f={f} x={760} y={430} w={400} h={460} rotY={0} tone="light" />
    {['目が大きい', '鼻が高い', '顔が小さい', '細い'].map((t, i) => (
      <Pop key={t} f={f} at={LT(T, 's28', 1, i)} from="scale" style={{position: 'absolute', left: [180, 1320, 220, 1360][i], top: [160, 160, 420, 420][i], padding: '14px 30px', borderRadius: 14, background: 'rgba(255,255,255,0.95)', border: '3px solid #d8d4cc', fontFamily: FONT, fontSize: 52, fontWeight: 900, color: '#1d2230'}}>{t}</Pop>
    ))}
    {f >= LT(T, 's28', 3) && <Pop f={f} at={LT(T, 's28', 3)} from="scale" style={TXT({top: 40, fontSize: 64, color: '#c0392b', textShadow: '0 4px 20px rgba(255,255,255,0.9)'})}>本当に あなたが決めた？</Pop>}
  </WhiteStudio>
);
const S29: React.FC<SceneProps> = ({f, T}) => {
  const body = f >= LT(T, 's29', 7);
  const res = f >= LT(T, 's29', 4);
  const merge = seg(f, LT(T, 's29', 2), LT(T, 's29', 3));
  if (body) return (
    <DarkBoard>
      <Pop f={f} at={LT(T, 's29', 8)} style={TXT({top: 90, fontSize: 60, color: K.ink})}>世界26か国 7千人以上</Pop>
      <Card f={f} at={LT(T, 's29', 8, 1)} x={260} y={220} w={1400} text="魅力的とされる女性の体型は 地域によって違う" />
      <Card f={f} at={LT(T, 's29', 8, 2)} x={260} y={370} w={1400} color="#ff7a64" text="豊かな地域ほど やせを理想とし 自分の体に不満を持つ" />
      {f >= LT(T, 's29', 9) && <Pop f={f} at={LT(T, 's29', 9)} from="scale" style={TXT({top: 560, fontSize: 64, color: K.gold})}>生まれた場所と時代の ものさし</Pop>}
    </DarkBoard>
  );
  return (
    <DarkBoard tint="#1e2636">
      <div style={{position: 'absolute', left: res ? 760 : 1180, top: 80, width: 400, height: 500}}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          const r = 320 * (1 - merge);
          return <div key={i} style={{position: 'absolute', left: Math.cos(a) * r * 0.9, top: Math.sin(a) * r * 0.5, opacity: res ? 0.25 : 0.85 - 0.6 * merge}}><FaceCard w={260} hue={i * 60} /></div>;
        })}
        {merge > 0.5 && <div style={{position: 'absolute', left: 0, top: 0, opacity: (merge - 0.5) * 2, filter: 'blur(1px)'}}><FaceCard w={260} hue={200} glow={res ? 1 : 0.3} label="平均の顔" /></div>}
      </div>
      {!res && (
        <>
          <StepCard f={f} at={LT(T, 's29', 2)} n="手順1" text="たくさんの顔を重ねて 平均の顔を作る" x={100} y={160} w={900} />
          <StepCard f={f} at={LT(T, 's29', 3)} n="手順2" text="元の一人ひとりの顔と並べて 評価してもらう" x={100} y={340} w={900} />
        </>
      )}
      {res && f >= LT(T, 's29', 5) && <Card f={f} at={LT(T, 's29', 5)} x={260} y={560} w={1400} size={40} text="平均の顔は ほとんどの一人ひとりの顔より 魅力的" color={K.gold} />}
    </DarkBoard>
  );
};
const S30: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's30', 6);
  const tail = f >= LT(T, 's30', 9);
  if (tail) return (
    <AbsoluteFill>
      <Mirror f={f} hand={false} light={0.8} />
      <Pop f={f} at={LT(T, 's30', 10)} style={TXT({top: 160, fontSize: 60, color: K.gold})}>あなたを知っている人の目には 中身が映る</Pop>
      {f >= LT(T, 's30', 11) && <Pop f={f} at={LT(T, 's30', 11)} style={TXT({top: 300, fontSize: 60, color: '#ff7a64'})}>鏡の点数は あなたを一番知らない人の目</Pop>}
      <Vignette />
    </AbsoluteFill>
  );
  const liked = [1, 4, 6];
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 1000, top: 50, width: 820, padding: 30, borderRadius: 10, background: '#f9f6ee', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', display: 'grid', gridTemplateColumns: 'repeat(4, 175px)', gap: 18}}>
        {Array.from({length: 8}, (_, i) => <FaceCard key={i} w={175} hue={(i * 41) % 360} light glow={res && liked.includes(i) ? 0.9 : 0} />)}
      </div>
      {!res && (
        <>
          <StepCard f={f} at={LT(T, 's30', 3)} n="手順1" text="自分の卒業アルバムで 同級生の見た目と 好き・尊敬を答える" x={90} y={110} w={860} light />
          <StepCard f={f} at={LT(T, 's30', 4)} n="手順2" text="知らない人にも 写真だけで見た目を評価してもらう" x={90} y={330} w={860} light />
          <StepCard f={f} at={LT(T, 's30', 5)} n="手順3" text="二つの評価を比べる" x={90} y={550} w={860} light />
        </>
      )}
      {res && (
        <>
          <Card f={f} at={LT(T, 's30', 7)} light x={90} y={140} w={860} color="#c78a00" text="好きな人 尊敬している人ほど 見た目も魅力的に" />
          {f >= LT(T, 's30', 8) && <Card f={f} at={LT(T, 's30', 8)} light x={90} y={380} w={860} size={38} text="ボート部や 6週間の発掘調査でも同じ　知らない人の評価では 差は出ない" />}
        </>
      )}
    </WhiteStudio>
  );
};

// ============ 11. 今日からできること ============
const TIPS = ['SNSの時間を 半分にする', '加工しない写真を 1枚残す', '体の悪口の輪から 抜ける', '見た目ではなく 関わり方で人を見る'];
const TipCard: React.FC<{f: number; at: number; n: number; big?: boolean}> = ({f, at, n, big}) => (
  <Pop f={f} at={at} from="scale" style={{position: 'absolute', left: big ? 110 : 0, top: big ? 70 : 0, width: big ? 760 : 380, padding: big ? '30px 36px' : '20px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.96)', border: `4px solid ${K.gold}`, fontFamily: FONT, boxShadow: '0 16px 40px rgba(0,0,0,0.3)'}}>
    <div style={{fontSize: big ? 34 : 26, fontWeight: 900, color: '#c78a00'}}>{['一つ目', '二つ目', '三つ目', '四つ目'][n]}</div>
    <div style={{fontSize: big ? 54 : 34, fontWeight: 900, color: '#1d2230', marginTop: 6, lineHeight: 1.3}}>{TIPS[n]}</div>
  </Pop>
);
const S31: React.FC<SceneProps> = ({f, T}) => (
  <WhiteStudio>
    <div style={{position: 'absolute', left: 260, top: 520, width: 1400, height: 36, borderRadius: 10, background: '#cfc9bf'}} />
    <div style={{position: 'absolute', left: 300, top: 300, display: 'flex', gap: 40}}>
      {[0, 1, 2, 3].map((i) => <Pop key={i} f={f} at={LT(T, 's31', 3) + i * 6} style={{width: 280, height: 200, borderRadius: 14, background: '#3a4256', color: K.gold, fontSize: 80, fontWeight: 900, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</Pop>)}
    </div>
    {f < LT(T, 's31', 3) && <Pop f={f} at={LT(T, 's31', 1)} style={TXT({top: 150, fontSize: 80, color: '#c0392b', textShadow: '0 4px 20px rgba(255,255,255,0.9)'})}>手遅れではない</Pop>}
    <MascotOverlay f={f} x={1500} y={330} w={340} h={400} rotY={-0.8} tone="light" />
  </WhiteStudio>
);
const SettingsScreen: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 1120, top: 40, width: 520, height: 640, borderRadius: 50, background: '#0f1117', border: '12px solid #2a2e38', padding: '70px 30px', fontFamily: FONT, color: '#fff'}}>
    <div style={{fontSize: 30, color: '#9fb0d0'}}>アプリの使用時間</div>
    <div style={{fontSize: 40, fontWeight: 900, marginTop: 20}}>SNS の上限</div>
    <div style={{marginTop: 30, display: 'flex', gap: 14}}>
      {['30分', '1時間', '2時間'].map((t, i) => <div key={t} style={{flex: 1, padding: '20px 0', textAlign: 'center', borderRadius: 16, fontSize: 34, fontWeight: 900, background: i === 1 && f > 40 ? '#e8c46a' : '#2a2f3a', color: i === 1 && f > 40 ? '#141820' : '#fff'}}>{t}</div>)}
    </div>
    {f > 50 && <div style={{marginTop: 40, fontSize: 30, color: '#9cf0b2', fontWeight: 800}}>✓ 1日1時間に設定しました</div>}
  </div>
);
const S32: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's32', 5);
  return (
    <DarkBoard>
      <TipCard f={f} at={0} n={0} big />
      <SettingsScreen f={f} />
      {!res ? (
        <>
          <StepCard f={f} at={LT(T, 's32', 3)} n="手順1" text="1週間 ふだんどおりに過ごす" x={110} y={330} w={900} />
          <StepCard f={f} at={LT(T, 's32', 4)} n="手順2" text="くじで分け 一方は3週間 SNSを1日1時間まで" x={110} y={490} w={900} />
        </>
      ) : (
        <>
          <Card f={f} at={LT(T, 's32', 5)} x={110} y={330} w={900} color={K.gold} text="使う時間は およそ半分　見た目への評価が上がった" />
          {f >= LT(T, 's32', 6) && <Pop f={f} at={LT(T, 's32', 6)} from="scale" style={{position: 'absolute', left: 110, top: 560, fontFamily: FONT, fontSize: 80, fontWeight: 900, color: K.gold}}>たった3週間</Pop>}
        </>
      )}
    </DarkBoard>
  );
};
const S33: React.FC<SceneProps> = ({f}) => (
  <DarkBoard tint="#2a2630">
    <TipCard f={f} at={0} n={1} big />
    <div style={{position: 'absolute', left: 1160, top: 80, transform: 'rotate(4deg)', padding: 20, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
      <FaceCard w={380} hue={30} light />
      <div style={{marginTop: 12, textAlign: 'center', fontFamily: FONT, fontSize: 34, fontWeight: 900, color: '#556'}}>加工なし</div>
    </div>
  </DarkBoard>
);
const S34: React.FC<SceneProps> = ({f}) => (
  <DarkBoard tint="#3a2e24">
    <TipCard f={f} at={0} n={2} big />
    <Bubble f={f} at={20} text="私 太った" x={1100} y={140} />
    <Pop f={f} at={50} from="right" style={{position: 'absolute', left: 1180, top: 330, padding: '18px 30px', borderRadius: 30, background: '#e7f6e9', color: '#1d2230', fontFamily: FONT, fontSize: 44, fontWeight: 900}}>そういえば 週末どうする？</Pop>
  </DarkBoard>
);
const S35: React.FC<SceneProps> = ({f}) => (
  <DarkBoard tint="#202a30">
    <TipCard f={f} at={0} n={3} big />
    <div style={{position: 'absolute', left: 1080, top: 110, display: 'flex', gap: 60, alignItems: 'flex-end'}}>
      <PersonIcon size={220} color="#e3e6ee" glow={0} />
      <div style={{fontSize: 100, marginBottom: 80}}>💬</div>
      <PersonIcon size={220} color="#e8c46a" />
    </div>
    <Pop f={f} at={40} style={{position: 'absolute', left: 1080, top: 470, fontFamily: FONT, fontSize: 46, fontWeight: 900, color: K.gold}}>第一印象は 一度保留</Pop>
  </DarkBoard>
);

// ============ 12. まとめ ============
const S36: React.FC<SceneProps> = ({f, T, dur}) => {
  const off = interpolate(f, [dur - 40, dur - 10], [0, 1], clamp);
  const items = ['顔を見ただけで 中身まで決めつける', 'SNS10分で気分が下がる 加工するほど素顔が嫌いに', '日本は 標準の体なのに太っていると思う', '「いい見た目」は 知っている人の目の中で変わる'];
  return (
    <AbsoluteFill>
      <Mirror f={f} hand={f < 60} light={1 - 0.7 * off} />
      <AbsoluteFill style={{background: 'rgba(8,10,14,0.55)'}} />
      <div style={{position: 'absolute', left: 260, top: 80, width: 1400}}>
        {items.map((t, i) => <Card key={i} f={f} at={LT(T, 's36', i + 1)} x={0} y={i * 140} w={1400} size={42} text={t} color={i === 3 ? K.gold : undefined} />)}
      </div>
      <AbsoluteFill style={{background: '#000', opacity: off * 0.6}} />
    </AbsoluteFill>
  );
};
const S37: React.FC<SceneProps> = ({f, T, dur}) => {
  const turn = seg(f, LT(T, 's37', 3), LT(T, 's37', 4));
  const walk = seg(f, LT(T, 's37', 4), dur - 30);
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 1180, top: 70, width: 460, height: 640, borderRadius: 20, border: '14px solid #b9b2a6', overflow: 'hidden', background: '#2a2e36'}}>
        <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(${(f * 7) % 180}deg, rgba(255,255,255,0.12) 0 2px, rgba(0,0,0,0.1) 2px 5px)`, opacity: 0.8}} />
      </div>
      <MascotOverlay f={f} x={720 - walk * 900} y={330} w={420} h={480} rotY={-1.2 + turn * 2.6} tone="light" />
      <Pop f={f} at={LT(T, 's37', 1)} style={TXT({top: 70, left: 80, right: 'auto', width: 1060, fontSize: 56, color: '#1d2230', textShadow: 'none'})}>どちらの目で 自分を見ますか</Pop>
      {f >= LT(T, 's37', 2) && f < LT(T, 's37', 4) && <Pop f={f} at={LT(T, 's37', 2)} style={TXT({top: 170, left: 80, right: 'auto', width: 1060, fontSize: 42, color: '#556', textShadow: 'none'})}>画面の向こうの 誰かの目</Pop>}
      {f >= LT(T, 's37', 3) && f < LT(T, 's37', 4) && <Pop f={f} at={LT(T, 's37', 3)} style={TXT({top: 250, left: 80, right: 'auto', width: 1060, fontSize: 48, color: '#c78a00', textShadow: 'none'})}>あなたと笑ったことのある あの人の目</Pop>}
    </WhiteStudio>
  );
};

export const SCENES_L2: Record<string, React.FC<SceneProps>> = {s19: S19, s20: S20, s21: S21, s22: S22, s23: S23, s24: S24, s25: S25, s26: S26, s27: S27, s28: S28, s29: S29, s30: S30, s31: S31, s32: S32, s33: S33, s34: S34, s35: S35, s36: S36, s37: S37};
