import {AbsoluteFill, interpolate} from 'remotion';
import {AMYG, VSTR} from '../three/Brain3D';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Bars, BrainShot, DarkBoard, SceneProps, StepCard, Still, WhiteStudio, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Phone, Pop, clamp} from './ui';
import {Big, BrainBox, Candle, MROW, Card, CardRow, FlipRoom, Hand, KAN, LT, MriBg, MriMonitor, NAMES, Notebook, Parchment, SinCard, TXT} from './ScenesS1';

// =============== 6. 憂鬱 ===============
const Cafe: React.FC<{f: number; dur: number; steam: number}> = ({f, dur, steam}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #c8d4dc 0%, #a8b8c4 60%, #6a5a4a 60.2%, #4a3c30 100%)', transform: `scale(${interpolate(f, [0, dur], [1, 1.06], clamp)})`}}>
    <div style={{position: 'absolute', left: 160, top: 40, width: 1600, height: 600, border: '22px solid #3a3028', background: 'linear-gradient(180deg, rgba(220,232,240,0.9), rgba(180,200,212,0.85))'}}>
      <div style={{position: 'absolute', left: 640, top: 140, width: 320, height: 380, borderRadius: '160px 160px 40px 40px', background: 'rgba(60,70,84,0.22)', filter: 'blur(14px)'}} />
      <div style={{position: 'absolute', left: 760, top: 0, bottom: 0, width: 20, background: '#3a3028'}} />
    </div>
    <div style={{position: 'absolute', left: 780, top: 690, width: 300, height: 60, borderRadius: '50%', background: '#e8e4dc'}} />
    <div style={{position: 'absolute', left: 840, top: 600, width: 180, height: 120, borderRadius: '0 0 60px 60px', background: '#f4f1ea'}}>
      <div style={{position: 'absolute', left: 14, right: 14, top: 8, height: 30, borderRadius: '50%', background: '#5a3a22'}} />
    </div>
    {Array.from({length: 3}, (_, i) => {
      const t = ((f + i * 30) % 90) / 90;
      return <div key={i} style={{position: 'absolute', left: 900 + Math.sin(t * 5 + i) * 20, top: 580 - t * 160, width: 60, height: 60, borderRadius: 30, background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)', opacity: steam * Math.sin(t * Math.PI)}} />;
    })}
  </AbsoluteFill>
);
const S26: React.FC<SceneProps> = ({f, T, dur}) => {
  if (f < LT(T, 's26', 1)) return <FlipRoom f={f} n={3} />;
  const study = f >= LT(T, 's26', 3);
  return (
    <AbsoluteFill>
      <Cafe f={f} dur={dur} steam={1 - seg(f, LT(T, 's26', 1), LT(T, 's26', 3))} />
      {!study && f >= LT(T, 's26', 1) && f < LT(T, 's26', 2) && <Big f={f} at={LT(T, 's26', 1)} y={780} size={52} color="#ffffff" text="失ったもの 手に入らなかったものを 思い返して沈む" />}
      {!study && f >= LT(T, 's26', 2) && <Big f={f} at={LT(T, 's26', 2)} y={780} size={60} color="#ffffff" text="昨日の失敗？ 来週の不安？" />}
      {study && <AbsoluteFill style={{background: 'rgba(8,10,16,0.72)'}} />}
      {study && (
        <>
          <StepCard f={f} at={LT(T, 's26', 3)} n="2,250人" text="スマホに ランダムなタイミングで質問を送る" x={160} y={90} w={1600} />
          <StepCard f={f} at={LT(T, 's26', 6)} n="質問1" text="今 どれくらい幸せですか" x={160} y={250} w={1600} />
          <StepCard f={f} at={LT(T, 's26', 6) + 10} n="質問2" text="今 何をしていますか" x={160} y={380} w={1600} />
          <StepCard f={f} at={LT(T, 's26', 6) + 20} n="質問3" text="今していることとは 別のことを考えていましたか" x={160} y={510} w={1600} />
          <StepCard f={f} at={LT(T, 's26', 7)} n="くり返す" text="何日にもわたって" x={160} y={640} w={1600} />
        </>
      )}
    </AbsoluteFill>
  );
};
const Pie: React.FC<{v: number; x: number; y: number; r: number}> = ({v, x, y, r}) => {
  const a = v * 2 * Math.PI;
  const d = `M ${r} ${r} L ${r} 0 A ${r} ${r} 0 ${v > 0.5 ? 1 : 0} 1 ${r + r * Math.sin(a)} ${r - r * Math.cos(a)} Z`;
  return (
    <svg width={r * 2} height={r * 2} style={{position: 'absolute', left: x, top: y}}>
      <circle cx={r} cy={r} r={r} fill="#e8c46a" />
      {v > 0.001 && <path d={d} fill="#7a8090" />}
    </svg>
  );
};
const S27: React.FC<SceneProps> = ({f, T}) => {
  const v = 0.469 * seg(f, LT(T, 's27', 1), LT(T, 's27', 1) + 50);
  return (
    <DarkBoard>
      <Pie v={v} x={180} y={110} r={300} />
      <Pop f={f} at={LT(T, 's27', 1) + 30} style={{position: 'absolute', left: 260, top: 740, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: K.sub}}>灰色＝心がよそに行っていた</Pop>
      <Pop f={f} at={LT(T, 's27', 1, 1)} style={{position: 'absolute', left: 820, top: 120, fontFamily: FONT, fontSize: 110, fontWeight: 900, color: K.ink}}>およそ半分</Pop>
      <Card f={f} at={LT(T, 's27', 2)} x={820} y={300} w={980} size={38} text={<>心がよそに行っているときは<br />どんな活動でも 幸せではなかった</>} />
      <Card f={f} at={LT(T, 's27', 3)} x={820} y={460} w={980} size={38} color="#ff7a64" text="心がよそに行った あとに 不幸せな気分が来る" />
      {f >= LT(T, 's27', 4) && <Pop f={f} at={LT(T, 's27', 4, 1)} style={{position: 'absolute', left: 820, top: 630, fontFamily: FONT, fontSize: 46, fontWeight: 900, color: K.gold}}>心がさまよう → 悲しくなる</Pop>}
    </DarkBoard>
  );
};
const S28: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's28', 3);
  const gray = seg(f, LT(T, 's28', 4), LT(T, 's28', 4) + 60);
  return (
    <DarkBoard tint="#262a36">
      <div style={{position: 'absolute', left: 120, right: 120, top: 520, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.3)'}} />
      {Array.from({length: 9}, (_, i) => <div key={i} style={{position: 'absolute', left: 120 + i * 210, top: 500, width: 4, height: 54, background: 'rgba(255,255,255,0.3)'}} />)}
      {Array.from({length: 7}, (_, i) => {
        const x = 140 + ((f * 0.9 + i * 230) % 1600);
        const heavy = i % 3 === 0;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: 270, opacity: interpolate(x, [140, 260, 1600, 1740], [0, 1, 1, 0], clamp), filter: `blur(${heavy ? 2 * gray : 1}px)`}}>
            <PersonIcon size={180} color={heavy && res ? `rgb(${120 - 60 * gray},${126 - 60 * gray},${140 - 60 * gray})` : '#8a96ae'} dim={0} />
          </div>
        );
      })}
      <StepCard f={f} at={LT(T, 's28', 1)} n="長い期間" text="地域に住む大人たちを 追いかける" x={160} y={50} w={800} />
      <StepCard f={f} at={LT(T, 's28', 2)} n="最初に" text="嫌な気分を くり返し考える傾向を調べる" x={960} y={50} w={900} />
      {res && <Card f={f} at={LT(T, 's28', 4)} x={360} y={620} w={1200} color="#ff7a64" text="くり返し考える人ほど あとでうつ病を新しく発症しやすい" />}
    </DarkBoard>
  );
};
const S29: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.78} from={1.0} to={1.06} oy={20} />
    {['「あのとき ああ言えば」', '「なんであんなことを」', '「変に思われたかも」'].map((t, i) => {
      const at = 20 + i * 70;
      const a = interpolate(f - at, [0, 20, 80, 110], [0, 0.75, 0.75, 0], clamp);
      return <div key={i} style={{...TXT({top: 140 + i * 110, fontSize: 52, color: '#c8d4f0'}), opacity: a, filter: 'blur(1px)'}}>{t}</div>;
    })}
    {f >= LT(T, 's29', 1, 1) && f < LT(T, 's29', 2) && <Big f={f} at={LT(T, 's29', 1, 1)} y={520} size={70} color="#ff7a64" text="変わるのは 明日の気分だけ" />}
    {f >= LT(T, 's29', 2) && <Big f={f} at={LT(T, 's29', 2)} y={480} size={60} color={K.gold} text="思い返して沈む考え ＝ 心の不調の入り口" />}
    <Vignette />
  </AbsoluteFill>
);

// =============== 7. 憤怒 ===============
const Sandbag: React.FC<{f: number; hit: boolean}> = ({f, hit}) => {
  const ph = (f % 24) / 24;
  const sw = hit ? Math.max(0, Math.sin(ph * Math.PI * 2)) * 10 : 0;
  const punch = hit ? Math.max(0, 1 - Math.abs(ph - 0.1) * 6) : 0;
  return (
    <>
      <div style={{position: 'absolute', left: 1140, top: 0, width: 6, height: 140, background: '#555'}} />
      <div style={{position: 'absolute', left: 1020, top: 130, width: 250, height: 520, borderRadius: 60, background: 'linear-gradient(90deg, #6a2a22, #a8463a 50%, #6a2a22)', transform: `rotate(${sw}deg)`, transformOrigin: '50% -20%'}} />
      <div style={{position: 'absolute', left: 620 + punch * 260, top: 360, width: 200, height: 170, borderRadius: 80, background: 'radial-gradient(circle at 40% 40%, #e04a3a, #8a1e16)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: 380 + punch * 260, top: 400, width: 260, height: 100, borderRadius: 40, background: '#2a2f3a'}} />
    </>
  );
};
const S31: React.FC<SceneProps> = ({f, T}) => {
  if (f < LT(T, 's31', 1)) return <FlipRoom f={f} n={4} />;
  const groups = f >= LT(T, 's31', 6);
  return (
    <DarkBoard tint="#302424">
      {!groups && <Sandbag f={f} hit={f >= LT(T, 's31', 1) && f < LT(T, 's31', 2)} />}
      {f >= LT(T, 's31', 1) && f < LT(T, 's31', 2) && <Big f={f} at={LT(T, 's31', 1)} y={720} size={60} text="怒りは 発散したほうがいい？" />}
      {!groups && <StepCard f={f} at={LT(T, 's31', 4)} n="手順1" text="大学生が 自分の意見を書く" x={120} y={90} w={820} />}
      {!groups && <StepCard f={f} at={LT(T, 's31', 5)} n="手順2" text="相手役から ひどい点数と きつい言葉が返ってくる" x={120} y={260} w={820} />}
      {!groups && f >= LT(T, 's31', 5, 1) && <Big f={f} at={LT(T, 's31', 5, 2)} y={560} size={60} color="#ff7a64" text="当然 腹を立てる" />}
      {groups && (
        <>
          <div style={{position: 'absolute', left: 120, top: 80, display: 'flex', gap: 40}}>
            {[['相手を考えて叩く', '#e0533d'], ['体を鍛えると考えて叩く', '#e8a04c'], ['静かに待つ', '#6fa8dc']].map(([t, c], i) => (
              <Pop key={i} f={f} at={LT(T, 's31', 7, Math.min(i, 2)) + (i === 2 ? 0 : 0)} style={{width: 530, padding: '30px 26px', borderRadius: 18, background: 'rgba(16,20,30,0.88)', border: `3px solid ${c}`, fontFamily: FONT, textAlign: 'center'}}>
                <div style={{fontSize: 90}}>{i === 2 ? '🪑' : '🥊'}</div>
                <div style={{fontSize: 40, fontWeight: 900, color: c, marginTop: 10}}>{t}</div>
              </Pop>
            ))}
          </div>
          {f >= LT(T, 's31', 8) && <Card f={f} at={LT(T, 's31', 8)} x={260} y={460} w={1400} color={K.gold} text="最後に 怒らせた相手に 大きな騒音を浴びせられる" />}
        </>
      )}
    </DarkBoard>
  );
};
// no bar heights: the narration gives an order, not numbers (owner rule) — a ranking instead
const S32: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#302424">
    {([['怒りが一番強く 騒音も一番激しい', '相手を考えて叩いた', '#e0533d', 1], ['', '体を鍛えると考えて叩いた', '#e8a04c', 1], ['一番落ち着いていた', '何もしなかった', '#6fa8dc', 2]] as [string, string, string, number][]).map(([note, t, c, k], i) => (
      <Pop key={i} f={f} at={i === 1 ? LT(T, 's32', 1) + 20 : LT(T, 's32', k)} from="left" style={{position: 'absolute', left: 200, top: 90 + i * 170, width: 1520, display: 'flex', alignItems: 'center', gap: 30, padding: '24px 34px', borderRadius: 18, background: 'rgba(16,20,30,0.88)', border: `3px solid ${c}`, fontFamily: FONT}}>
        <div style={{fontSize: 46, fontWeight: 900, color: c, width: 120}}>{['1位', '2位', '3位'][i]}</div>
        <div style={{fontSize: 46, fontWeight: 900, color: K.ink, flex: 1}}>{t}</div>
        {note && <div style={{fontSize: 34, fontWeight: 900, color: c}}>{note}</div>}
      </Pop>
    ))}
    <Pop f={f} at={LT(T, 's32', 1) - 4} style={{position: 'absolute', left: 200, top: 40, fontFamily: FONT, fontSize: 34, fontWeight: 900, color: K.sub}}>怒りの強さ</Pop>
    {f >= LT(T, 's32', 3) && <Big f={f} at={LT(T, 's32', 3)} y={620} size={76} color="#ff7a64" text="発散した人ほど 怒りは大きくなる" />}
  </DarkBoard>
);
const S33: React.FC<SceneProps> = ({f, T}) => {
  const b = Math.sin(f / 40);
  const res = f >= LT(T, 's33', 1);
  return (
    <WhiteStudio>
      <MascotOverlay f={f} x={120} y={260} w={480} h={560} rotY={0.4} tone="light" pose={{bob: 0.03 * b}} />
      <Pop f={f} at={LT(T, 's33', 0)} style={{position: 'absolute', left: 680, top: 70, fontFamily: FONT, fontSize: 44, fontWeight: 900, color: '#1d2230'}}>154本の研究　1万人あまり</Pop>
      {res && (
        <>
          {['ゆっくり呼吸する', '体の力を抜く', 'しばらく時間を置く'].map((t, i) => <Card key={i} f={f} at={LT(T, 's33', 2) + i * 12} light x={680} y={160 + i * 120} w={560} size={40} text={t} />)}
          <Card f={f} at={LT(T, 's33', 2, 2)} light x={1260} y={160} w={560} size={40} color="#2e8a5a" text={<>怒りも攻撃も下がる<br />年齢・性別・国を問わず</>} />
          {f >= LT(T, 's33', 3) && <Card f={f} at={LT(T, 's33', 3)} light x={680} y={540} w={1140} size={40} color="#c0392b" text="発散を支持する結果は 出なかった" />}
        </>
      )}
    </WhiteStudio>
  );
};
const ANGRY = 'あのさ 前から思ってたけど あの言い方はありえない そもそも頼んできたのはそっちだし こっちは何回も確認した それなのに全部こっちのせい？';
const S34: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#2a1e22">
    <div style={{position: 'absolute', left: 140, top: 30, width: 600, height: 820, borderRadius: 60, background: '#111318', boxShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 0 0 3px #2a2e36'}}>
      <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 42, background: '#f4f1ea', padding: '40px 34px', fontFamily: FONT}}>
        <div style={{fontSize: 30, fontWeight: 900, color: '#666'}}>メッセージを入力</div>
        <div style={{marginTop: 20, fontSize: 38, fontWeight: 800, color: '#1d1d1d', lineHeight: 1.5}}>{ANGRY}</div>
        <div style={{position: 'absolute', right: 34, bottom: 40, width: 110, height: 110, borderRadius: 55, background: '#4caf50', color: '#fff', fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>➤</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 560 + 6 * Math.sin(f / 9), top: 700, width: 100, height: 150, borderRadius: 46, background: '#d9a888', transform: 'rotate(-20deg)', boxShadow: '0 10px 20px rgba(0,0,0,0.35)'}} />
    <Card f={f} at={LT(T, 's34', 1)} x={860} y={120} w={940} size={40} text="言ったあとは すっきりした気がする" />
    {f >= LT(T, 's34', 1, 1) && <Card f={f} at={LT(T, 's34', 1, 1)} x={860} y={280} w={940} size={42} color="#ff7a64" text="でも 発散するたびに 怒りは育つ" />}
    {f >= LT(T, 's34', 2) && <Card f={f} at={LT(T, 's34', 2)} x={860} y={460} w={940} size={42} color={K.gold} text="消すのは 吐き出すことではなく 体を落ち着かせること" />}
  </DarkBoard>
);

// =============== 8. 怠惰 ===============
const Hut: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #4a3626 0%, #3a2a1c 62%, #6a5038 62.2%, #4a3826 100%)'}}>
    <div style={{position: 'absolute', left: 1320, top: 160, width: 260, height: 220, background: 'linear-gradient(180deg, #ffe6b0, #f0c070 60%, #d89a50)', border: '20px solid #2a1c12'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, background: '#d8a060'}} />
    </div>
    <div style={{position: 'absolute', left: 860, top: 700, width: 380, height: 220, background: 'rgba(255,226,160,0.55)', transform: 'skewX(-25deg)', filter: 'blur(2px)', boxShadow: '0 0 80px rgba(255,220,150,0.35)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 40%, rgba(255,210,140,0.12) 0%, rgba(0,0,0,0) 60%)'}} />
    <div style={{position: 'absolute', left: 240, top: 560, width: 300, height: 30, background: '#5a4030'}} />
    <Parchment f={0} x={260} y={460} w={260} h={100} lines={0} />
    <Vignette />
    {f < 0 && null}
  </AbsoluteFill>
);
const S36: React.FC<SceneProps> = ({f, T}) => {
  if (f < LT(T, 's36', 1)) return <FlipRoom f={f} n={5} extra={<Pop f={f} at={30} style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: FONT, fontSize: 40, fontWeight: 900, color: '#8a6a3a'}}>元の名前 アケディア</Pop>} />;
  const sym = ['太陽が止まって見える', '一日が50時間あるように感じる', '何度も窓の外を見る', 'ここではないどこかへ行きたい', '今していることが 全部無意味に思える'];
  const symOn = f >= LT(T, 's36', 3) && f < LT(T, 's36', 4);
  return (
    <AbsoluteFill>
      <Hut f={f} />
      {f >= LT(T, 's36', 1) && f < LT(T, 's36', 2) && <Big f={f} at={LT(T, 's36', 1, 1)} y={120} size={90} color={K.gold} text="アケディア" />}
      {f >= LT(T, 's36', 2) && f < LT(T, 's36', 3) && (
        <>
          <Big f={f} at={LT(T, 's36', 2)} y={110} size={100} color="#ffd060" text="真昼の悪魔" />
          <Big f={f} at={LT(T, 's36', 2, 1)} y={270} size={56} color="#ff7a64" text="八つの中で 一番重い" />
        </>
      )}
      {symOn && <AbsoluteFill style={{background: 'rgba(20,12,6,0.55)'}} />}
      {symOn && sym.map((t, i) => <Card key={i} f={f} at={LT(T, 's36', 3, Math.min(i + 1, 4))} x={160} y={60 + i * 130} w={1000} size={42} text={t} />)}
      {f >= LT(T, 's36', 4) && <Big f={f} at={LT(T, 's36', 4, 1)} y={120} size={64} color="#ffe2a8" text="何もかもが嫌になり じっとしていられない" />}
    </AbsoluteFill>
  );
};
const S37: React.FC<SceneProps> = ({f}) => {
  const look = Math.floor(f / 30) % 3;
  return (
    <AbsoluteFill>
      <Still src="desk" f={f} dur={200} dark={0.35} />
      <div style={{position: 'absolute', left: 1380, top: 70, padding: '10px 26px', borderRadius: 14, background: 'rgba(8,10,14,0.85)', fontFamily: FONT, fontWeight: 900, fontSize: 90, color: '#ffb648', transform: `scale(${look === 0 ? 1.1 : 1})`}}>14:0{Math.min(2, Math.floor(f / 90))}</div>
      <AbsoluteFill style={{background: look === 1 ? 'radial-gradient(ellipse at 15% 30%, rgba(255,255,230,0.25) 0%, rgba(0,0,0,0) 40%)' : 'none'}} />
      <Vignette />
    </AbsoluteFill>
  );
};
const ShockBox: React.FC<{press: boolean}> = ({press}) => (
  <>
    <div style={{position: 'absolute', left: 1100, top: 560, width: 300, height: 140, borderRadius: 16, background: 'linear-gradient(180deg, #4a505c, #2a2f38)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
      <div style={{position: 'absolute', left: 110, top: press ? 38 : 26, width: 80, height: 50, borderRadius: 24, background: '#d8443a', boxShadow: press ? '0 0 40px rgba(255,80,60,0.8)' : '0 6px 0 #8a2a22'}} />
    </div>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><path d="M 1400 640 C 1600 640 1650 820 1900 800" stroke="#222" strokeWidth={8} fill="none" /></svg>
  </>
);
const EmptyRoom: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #e6e4df 0%, #d8d5cf 62%, #b8b3aa 62.2%, #a09a90 100%)'}}>
    <div style={{position: 'absolute', left: 1050, top: 690, width: 400, height: 30, background: '#8a8278'}} />
    <div style={{position: 'absolute', left: 1080, top: 720, width: 20, height: 200, background: '#7a7268'}} />
    <div style={{position: 'absolute', left: 1400, top: 720, width: 20, height: 200, background: '#7a7268'}} />
    <div style={{position: 'absolute', left: 560, top: 520, width: 260, height: 30, background: '#6a6258'}} />
    <div style={{position: 'absolute', left: 560, top: 300, width: 30, height: 520, background: '#6a6258'}} />
    <div style={{position: 'absolute', left: 580, top: 550, width: 20, height: 280, background: '#6a6258'}} />
    <div style={{position: 'absolute', left: 800, top: 550, width: 20, height: 280, background: '#6a6258'}} />
    {children}
  </AbsoluteFill>
);
const S38: React.FC<SceneProps> = ({f, T}) => (
  <EmptyRoom>
    <ShockBox press={false} />
    <StepCard f={f} at={LT(T, 's38', 2)} n="手順1" text="弱い電気ショックを体験「お金を払ってでも もう受けたくない」人を集める" x={100} y={60} w={1720} light />
    <StepCard f={f} at={LT(T, 's38', 3)} n="手順2" text="何もない部屋で 一人で15分 スマホも本もない" x={100} y={210} w={1720} light />
    <StepCard f={f} at={LT(T, 's38', 4)} n="手順3" text="ボタンを押せば 自分に電気ショック 押さなくてもいい" x={100} y={360} w={1720} light />
  </EmptyRoom>
);
const S39: React.FC<SceneProps> = ({f, T}) => {
  const later = f >= LT(T, 's39', 2);
  return (
    <DarkBoard>
      {!later && <Bars f={f} at={LT(T, 's39', 1)} max={100} x={460} y={90} w={1000} h={560} items={[{label: '男性 18人中12人', v: 66.7, text: '12人', color: '#e0533d'}, {label: '女性 24人中6人', v: 25, text: '6人', color: '#e8a04c'}]} />}
      {!later && <Pop f={f} at={LT(T, 's39', 1) + 30} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: FONT, fontSize: 40, fontWeight: 900, color: K.sub}}>少なくとも一度 自分でボタンを押した人</Pop>}
      {later && f < LT(T, 's39', 3) && <Big f={f} at={LT(T, 's39', 2)} y={250} size={66} color="#ff7a64" text="何もせず一人でいるより 痛みのほうがまし" />}
      {f >= LT(T, 's39', 3) && f < LT(T, 's39', 4) && <Card f={f} at={LT(T, 's39', 3)} x={260} y={200} w={1400} text="ほかの実験でも 一人で考えるだけの時間は楽しめず 簡単な作業のほうを好んだ" />}
      {f >= LT(T, 's39', 4) && f < LT(T, 's39', 5) && <Card f={f} at={LT(T, 's39', 4)} x={360} y={250} w={1200} size={38} text="少人数の実験 解釈には反論もある" />}
      {f >= LT(T, 's39', 5) && <Big f={f} at={LT(T, 's39', 5, 1)} y={250} size={64} color={K.gold} text="じっとしていられない苦しさは 今も起きている" />}
    </DarkBoard>
  );
};
const Pocket: React.FC<{f: number; kind: number}> = ({f, kind}) => {
  const bg = ['linear-gradient(180deg, #8a96a8 0%, #c8ccd4 40%, #5a6070 100%)', 'linear-gradient(180deg, #b8bcc4, #8a8e96)', 'linear-gradient(180deg, #e8e4dc, #c8c2b8)'][kind];
  return (
    <AbsoluteFill style={{background: bg}}>
      {kind === 0 && Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 150 + i * 300, top: 0, width: 6, height: 200, background: '#555'}}><div style={{position: 'absolute', left: -30, top: 190, width: 66, height: 66, borderRadius: 33, border: '8px solid #ddd'}} /></div>)}
      {kind === 0 && <div style={{position: 'absolute', left: 100, right: 100, top: 300, height: 260, background: `linear-gradient(90deg, #7aa0c8 ${(f * 7) % 100}%, #a8c4dc)`, border: '14px solid #555'}} />}
      {kind === 1 && <div style={{position: 'absolute', left: 820, top: 90, padding: '10px 40px', borderRadius: 10, background: '#111', color: '#ff9a3a', fontFamily: FONT, fontSize: 80, fontWeight: 900}}>{5 + Math.floor(f / 25) % 6}F ▲</div>}
      {kind === 1 && <div style={{position: 'absolute', left: 700, top: 260, width: 520, height: 600, background: 'linear-gradient(90deg, #9aa0a8, #c8ccd4, #9aa0a8)', borderLeft: '6px solid #666'}} />}
      {kind === 2 && <div style={{position: 'absolute', left: 560, top: 120, width: 800, height: 760, background: '#d8d2c8', border: '10px solid #b8b0a4'}} />}
      <div style={{position: 'absolute', left: 1240, top: 620, width: 340, height: 360, borderRadius: 30, background: '#2a2f3a'}}>
        <div style={{position: 'absolute', left: 60, top: 40, width: 220, height: 20, borderRadius: 10, background: '#151820'}} />
      </div>
      <Hand x={1300} y={420 + 90 * Math.abs(Math.sin(f / 16))} rot={175} scale={0.8} />
      <Vignette />
    </AbsoluteFill>
  );
};
const S40: React.FC<SceneProps> = ({f, T}) => {
  const k = f < LT(T, 's40', 1, 1) ? 0 : f < LT(T, 's40', 2) ? 1 : 2;
  if (f >= LT(T, 's40', 2)) return (
    <AbsoluteFill>
      <Hut f={f} />
      <Big f={f} at={LT(T, 's40', 2)} y={160} size={76} color={K.gold} text="逃げずに その場にとどまる" />
    </AbsoluteFill>
  );
  return <Pocket f={f} kind={k} />;
};

// =============== 9. 虚飾 ===============
const LikeGrid: React.FC<{f: number; boost: boolean}> = ({f, boost}) => {
  const likes = [312, 8, 154, 21, 487, 12];
  return (
    <AbsoluteFill style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, padding: 18, background: '#f4f5f7'}}>
      {likes.map((n, i) => {
        const hi = boost && n > 100;
        return (
          <div key={i} style={{position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: hi ? `0 0 ${20 + 10 * Math.sin(f / 4)}px rgba(255,80,120,0.8)` : 'none'}}>
            <div style={{height: 150, background: `linear-gradient(135deg, hsl(${i * 60},50%,62%), hsl(${i * 60 + 50},45%,45%))`, filter: 'blur(6px)'}} />
            <div style={{padding: '6px 10px', fontFamily: FONT, fontSize: 26, fontWeight: 900, color: hi ? '#e0245e' : '#556'}}>♥ {n}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
const S42: React.FC<SceneProps> = ({f, T, dur}) => {
  if (f < LT(T, 's42', 1)) return <FlipRoom f={f} n={6} />;
  return (
    <AbsoluteFill>
      <MriBg f={f} dur={dur} />
      <MriMonitor f={f} x={1060} y={110} w={760} h={480}><LikeGrid f={f} boost={false} /></MriMonitor>
      {f < LT(T, 's42', 2) && <Card f={f} at={LT(T, 's42', 1)} x={100} y={110} w={880} size={40} text="人からよく見られたい 認められたい ＝ 傲慢とは別の考え" color={K.gold} />}
      <StepCard f={f} at={LT(T, 's42', 2)} n="13歳から18歳 32人" text="写真共有アプリに似せた画面を見る（自分の写真も混ざる）" x={100} y={110} w={880} />
      <StepCard f={f} at={LT(T, 's42', 5)} n="いいねの数" text="実は 研究チームが割り振ったもの" x={100} y={330} w={880} />
      <StepCard f={f} at={LT(T, 's42', 6)} n="測る" text="写真を見ているときの 脳の働き" x={100} y={510} w={880} />
    </AbsoluteFill>
  );
};
const S43: React.FC<SceneProps> = ({f, T}) => {
  const pulse = 0.5 + 0.5 * Math.max(0, Math.sin(f / 9));
  const k = seg(f, LT(T, 's43', 1), LT(T, 's43', 1) + 30);
  return (
    <AbsoluteFill>
      <BrainBox><BrainShot f={f} x={-300} glows={[{pos: VSTR, color: '#ff4a8a', k: 0.2 + 0.9 * k * pulse, size: 0.5}]} labels={[{pos: VSTR[0], text: 'ごほうびに反応する場所', note: 'いいねが多い写真で 強く働く', color: '#ff7aa8', k, dx: 300, dy: -230}]} /></BrainBox>
      <Card f={f} at={LT(T, 's43', 1, 2)} x={1160} y={360} w={700} size={38} text="自分の写真でも 他人の写真でも" />
      {f >= LT(T, 's43', 2) && <Card f={f} at={LT(T, 's43', 2)} x={1160} y={500} w={700} size={38} color="#ff7a64" text={<>いいねが多いと 本人も押しやすい<br />危ない行動の写真でも</>} />}
      {f >= LT(T, 's43', 3) && <Card f={f} at={LT(T, 's43', 3)} x={60} y={50} w={300} size={34} text="10代の実験" />}
      {f >= LT(T, 's43', 4) && <Big f={f} at={LT(T, 's43', 4)} y={700} size={60} color={K.gold} text="あなたも 数を一日に何度も確かめていない？" />}
    </AbsoluteFill>
  );
};
const S44: React.FC<SceneProps> = ({f, T}) => {
  const exp = f >= LT(T, 's44', 1);
  if (!exp) return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2b3038, #1a1d23)'}}>
      <div style={{position: 'absolute', left: 560, top: 60, width: 800, height: 720, borderRadius: 24, border: '16px solid #c9c4ba', background: 'linear-gradient(180deg, rgba(196,212,228,0.55), rgba(120,136,156,0.5))', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 230, top: -40, width: 340, height: 400, borderRadius: 170, background: 'rgba(36,42,54,0.92)'}} />
        <div style={{position: 'absolute', left: 120, top: 400, width: 560, height: 400, borderRadius: '260px 260px 0 0', background: `hsl(${(Math.floor(f / 40) * 70) % 360},35%,40%)`}} />
      </div>
      <Hand x={760 + 50 * Math.sin(f / 5)} y={150} rot={170} scale={0.8} />
      <Big f={f} at={20} y={820 - 700} size={56} color="#ffe2a8" text="人は そんなに見ている？" />
      <Vignette />
    </AbsoluteFill>
  );
  const pred = f >= LT(T, 's44', 2);
  const act = f >= LT(T, 's44', 3);
  const late = f >= LT(T, 's44', 4);
  const N = 12;
  return (
    <WhiteStudio>
      {!late && (
        <>
          <div style={{position: 'absolute', left: 230, top: 120, display: 'grid', gridTemplateColumns: `repeat(6, 200px)`, gap: '20px 40px'}}>
            {Array.from({length: N}, (_, i) => {
              const sees = act ? i < 3 : pred ? i < 6 : false;
              return <div key={i} style={{filter: sees ? 'drop-shadow(0 0 16px rgba(224,83,61,0.8))' : 'none'}}><PersonIcon size={150} color={sees ? '#e0533d' : '#8a93a6'} /></div>;
            })}
          </div>
          {pred && !act && <Big f={f} at={LT(T, 's44', 2)} y={640} size={54} color="#1d2230" light text="本人の予想 部屋の半分くらいが気づいた" />}
          {act && <Big f={f} at={LT(T, 's44', 3)} y={640} size={60} color="#c0392b" light text="実際は 予想の半分ほど" />}
          {!pred && <Big f={f} at={LT(T, 's44', 1)} y={640} size={50} color="#1d2230" light text="恥ずかしい柄のTシャツで 部屋に入る" />}
        </>
      )}
      {late && f < LT(T, 's44', 6) && <Big f={f} at={LT(T, 's44', 5)} y={300} size={76} color="#c0392b" light text="その時間の半分は 誰も見ていないもののため" />}
      {f >= LT(T, 's44', 6) && <Big f={f} at={LT(T, 's44', 6)} y={300} size={70} color="#1d2230" light text="七つの大罪からは消えても あなたの一日からは消えていない" />}
    </WhiteStudio>
  );
};

// =============== 10. 傲慢 ===============
const S45: React.FC<SceneProps> = ({f, T}) => {
  const lift = seg(f, LT(T, 's45', 1), LT(T, 's45', 1) + 40);
  if (f < LT(T, 's45', 1)) return <FlipRoom f={f} n={7} />;
  return (
    <AbsoluteFill>
      <CardRow state={(i) => (i === 7 ? {p: 1, glow: 0.8, lift: 140 * lift} : {p: 1, dim: 0.25 * lift})} y={330} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: seg(f, LT(T, 's45', 1, 2), LT(T, 's45', 1, 2) + 30)}}>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M ${1574 + 90} ${330 - 140 + 266} C ${1500} ${700}, ${300 + i * 212} ${760}, ${328 + i * 212} ${600}`} stroke="rgba(160,57,43,0.5)" strokeWidth={4} fill="none" />)}
      </svg>
      {f >= LT(T, 's45', 1, 2) && <Big f={f} at={LT(T, 's45', 1, 2)} y={720 - 640} size={60} color="#c0392b" light text="他のすべての考えの 根っこ" />}
    </AbsoluteFill>
  );
};
const S46: React.FC<SceneProps> = ({f, T}) => {
  const wk = 1 + Math.min(6, Math.floor(Math.max(0, f - LT(T, 's46', 3)) / 18));
  return (
    <DarkBoard tint="#2a2a24">
      <div style={{position: 'absolute', left: 520, top: 420, width: 880, height: 300, borderRadius: '50%', background: 'linear-gradient(180deg, #6a5038, #4a3826)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'}} />
      {[[560, 560], [1240, 560], [900, 680], [700, 440], [1100, 440]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 110, height: 70, borderRadius: 30, background: SKINC, transform: `translateY(${Math.sin((f + i * 13) / 10) * 4}px)`}} />)}
      <div style={{position: 'absolute', left: 1500, top: 380, width: 280, height: 300, borderRadius: 14, background: '#fbfaf6', boxShadow: '0 14px 30px rgba(0,0,0,0.4)', fontFamily: FONT, textAlign: 'center'}}>
        <div style={{height: 70, background: '#c0392b', borderRadius: '14px 14px 0 0', color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: '70px'}}>週</div>
        <div style={{fontSize: 150, fontWeight: 900, color: '#1d2230'}}>{wk}</div>
      </div>
      <StepCard f={f} at={LT(T, 's46', 2)} n="最初に" text="自分を実際よりどれくらい高く見ているか測る" x={120} y={60} w={1680} />
      <StepCard f={f} at={LT(T, 's46', 3)} n="毎週" text="グループで話し合い 7週間" x={120} y={200} w={820} />
      <StepCard f={f} at={LT(T, 's46', 4)} n="毎回" text="お互いの印象を評価" x={980} y={200} w={820} />
    </DarkBoard>
  );
};
const SKINC = '#d9a888';
// no line graph: the narration gives no numbers — first week vs seventh week cards
const S47: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Pop f={f} at={LT(T, 's47', 1)} from="left" style={{position: 'absolute', left: 140, top: 90, width: 760, padding: 34, borderRadius: 20, background: 'rgba(30,60,50,0.5)', border: '3px solid #5fc6b4', fontFamily: FONT}}>
      <div style={{fontSize: 44, fontWeight: 900, color: '#5fc6b4'}}>1週目</div>
      <div style={{fontSize: 52, fontWeight: 900, color: K.ink, marginTop: 16, lineHeight: 1.4}}>感じがいい<br />有能<br />落ち着いている</div>
    </Pop>
    {f >= LT(T, 's47', 2) && <Pop f={f} at={LT(T, 's47', 2)} style={{position: 'absolute', left: 900, top: 260, fontSize: 90, color: '#ff7a64', fontFamily: FONT, fontWeight: 900}}>→</Pop>}
    <Pop f={f} at={LT(T, 's47', 2)} from="right" style={{position: 'absolute', left: 1020, top: 90, width: 760, padding: 34, borderRadius: 20, background: 'rgba(90,30,24,0.5)', border: '3px solid #e0533d', fontFamily: FONT}}>
      <div style={{fontSize: 44, fontWeight: 900, color: '#ff7a64'}}>7週目</div>
      <div style={{fontSize: 52, fontWeight: 900, color: K.ink, marginTop: 16, lineHeight: 1.4}}>傲慢<br />とげがある</div>
    </Pop>
    {f >= LT(T, 's47', 3) && <Card f={f} at={LT(T, 's47', 3)} x={260} y={560} w={1400} color={K.gold} text="本人の自己評価は 高いまま 周りと大きくずれていた" />}
  </DarkBoard>
);
const S48: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    {f < LT(T, 's48', 1) && <Card f={f} at={LT(T, 's48', 0)} x={360} y={250} w={1200} text="論理や文法のテスト" />}
    {f >= LT(T, 's48', 1) && f < LT(T, 's48', 2) && (
      <>
        <Bars f={f} at={LT(T, 's48', 1)} max={100} x={460} y={60} w={1000} h={600} items={[{label: '実際の成績', v: 12, text: '下から12％', color: '#7f8aa8'}, {label: '本人の見積もり', v: 62, text: '62％', color: '#e0533d'}]} />
        <Pop f={f} at={LT(T, 's48', 1)} style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: FONT, fontSize: 36, fontWeight: 900, color: K.sub}}>一番点数が低かったグループ</Pop>
      </>
    )}
    {f >= LT(T, 's48', 2) && f < LT(T, 's48', 3) && <Big f={f} at={LT(T, 's48', 2)} y={240} size={62} color={K.gold} text="間違いに気づく力が足りないと できていないことにも気づけない" />}
    {f >= LT(T, 's48', 3) && <Card f={f} at={LT(T, 's48', 3)} x={360} y={250} w={1200} size={38} text={<>「統計の見かけで出ている部分がある」という反論もあり<br />議論が続いている</>} />}
  </DarkBoard>
);
const S49: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a2a24, #12110e)', fontFamily: FONT}}>
    <Notebook x={500} y={60} w={920} h={760} lines={['会議メモ', '・来期の予算', '・担当の割り振り']} />
    <div style={{position: 'absolute', left: 600, top: 300, fontSize: 60, fontWeight: 900, color: '#c0392b'}}>{'こいつ分'.slice(0, Math.min(4, Math.floor(f / 6)))}</div>
    <Hand x={600 + Math.min(4, Math.floor(f / 6)) * 62} y={250} rot={-30} scale={0.8} />
    {f >= LT(T, 's49', 1) && <AbsoluteFill style={{background: `rgba(8,8,6,${0.75 * seg(f, LT(T, 's49', 1), LT(T, 's49', 1) + 15)})`}} />}
    {f >= LT(T, 's49', 1) && f < LT(T, 's49', 2) && <Big f={f} at={LT(T, 's49', 1)} y={600} size={64} color="#ff7a64" text="そのあいだに 周りの評価は下がっていく" />}
    {f >= LT(T, 's49', 2) && <Big f={f} at={LT(T, 's49', 2)} y={600} size={70} color="#ffd060" text="傲慢の怖さは 自分では気づけないこと" />}
    <Vignette />
  </AbsoluteFill>
);

// =============== 11. 負けない ===============
const S50: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill>
    <CardRow state={() => ({p: 1})} y={320} {...MROW} mascot={{f, x: 1540, y: 330, rotY: -0.9}} />
    {f >= LT(T, 's50', 1) && <Big f={f} at={LT(T, 's50', 1)} y={90} size={60} color="#1d2230" light text="考えを見張り 名前をつけて 書き留める" />}
  </AbsoluteFill>
);
const NoiseFace: React.FC<{f: number}> = ({f}) => (
  <svg width={340} height={400} viewBox="0 0 340 400">
    <defs>
      <filter id="nz"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f / 3) % 20} /><feColorMatrix type="saturate" values="0" /></filter>
      <clipPath id="oval"><ellipse cx="170" cy="200" rx="140" ry="180" /></clipPath>
    </defs>
    <rect width="340" height="400" filter="url(#nz)" clipPath="url(#oval)" />
  </svg>
);
const S51: React.FC<SceneProps> = ({f, T, dur}) => {
  const res = f >= LT(T, 's51', 3);
  const pick = f >= LT(T, 's51', 2) ? (Math.floor((f - LT(T, 's51', 2)) / 40) % 2) : -1;
  if (res) {
    const k = seg(f, LT(T, 's51', 4), LT(T, 's51', 4) + 50);
    return (
      <AbsoluteFill>
        <BrainBox><BrainShot f={f} x={-280} glows={[{pos: AMYG, color: '#ff5a3d', k: 1.1 - 0.85 * k, size: 0.5}]} labels={[{pos: AMYG[0], text: '恐れや怒りに反応する場所', note: '言葉をつけると 働きが下がる', color: '#ff7a64', k, dx: 380, dy: -230}]} /></BrainBox>
        {f >= LT(T, 's51', 5) && <Big f={f} at={LT(T, 's51', 5)} y={700} size={64} color={K.gold} text="名前をつけるだけで 脳の反応は落ち着く" />}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <MriBg f={f} dur={dur} />
      <MriMonitor f={f} x={1060} y={80} w={760} h={560}>
        <AbsoluteFill style={{background: '#20242c', alignItems: 'center'}}>
          <div style={{marginTop: 20}}><NoiseFace f={f} /></div>
          <div style={{display: 'flex', gap: 40, marginTop: 10}}>
            {['怒り', '恐れ'].map((t, i) => <div key={i} style={{padding: '10px 44px', borderRadius: 12, background: pick === i ? '#e8c46a' : '#3a404c', color: pick === i ? '#141820' : '#fff', fontFamily: FONT, fontSize: 44, fontWeight: 900}}>{t}</div>)}
          </div>
        </AbsoluteFill>
      </MriMonitor>
      <StepCard f={f} at={LT(T, 's51', 1)} n="見せる" text="怒った顔 おびえた顔" x={80} y={100} w={900} />
      <StepCard f={f} at={LT(T, 's51', 2)} n="ある回" text="感情に合う言葉「怒り」「恐れ」を選ぶ" x={80} y={260} w={900} />
      <StepCard f={f} at={LT(T, 's51', 2, 1)} n="別の回" text="顔とは関係のない選び方" x={80} y={420} w={900} />
    </AbsoluteFill>
  );
};
const S52: React.FC<SceneProps> = ({f, T}) => {
  const tips = [['名前を呼ぶ', '「今 暴食が来た」'], ['「その先」を考える', '目の前の一口ではなく'], ['ゆっくり息を吐く', '怒ったら 発散しない'], ['先に決めておく', '「もし こうなったら こうする」']];
  const cur = f >= LT(T, 's52', 7) ? 3 : f >= LT(T, 's52', 5) ? 2 : f >= LT(T, 's52', 3) ? 1 : f >= LT(T, 's52', 1) ? 0 : -1;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 50%, #2a2a30 0%, #0c0c10 75%)'}}>
      <Notebook x={110} y={70} w={720} h={760} lines={['今日来た考え', f >= LT(T, 's52', 1) ? '暴食 21時' : '', f >= LT(T, 's52', 1, 1) ? '憤怒 13時' : '']} />
      {f >= LT(T, 's52', 1) && f < LT(T, 's52', 3) && <Hand x={430} y={300} rot={-30} scale={0.7} />}
      <div style={{position: 'absolute', left: 900, top: 70, width: 920}}>
        {tips.map(([a, b], i) => i <= cur && (
          <Pop key={i} f={f} at={LT(T, 's52', [1, 3, 5, 7][i])} from="right" style={{marginBottom: 20, padding: '22px 30px', borderRadius: 18, background: i === cur ? 'rgba(232,196,106,0.16)' : 'rgba(16,20,30,0.88)', border: `3px solid ${i === cur ? K.gold : 'rgba(255,255,255,0.14)'}`, fontFamily: FONT}}>
            <div style={{fontSize: 46, fontWeight: 900, color: i === cur ? K.gold : K.ink}}>{['一つ目', '二つ目', '三つ目', '四つ目'][i]}　{a}</div>
            <div style={{fontSize: 34, fontWeight: 800, color: K.sub, marginTop: 6}}>{b}</div>
          </Pop>
        ))}
      </div>
      {f >= LT(T, 's52', 8) && f < LT(T, 's52', 9) && (
        <div style={{position: 'absolute', left: 110, top: 380, width: 720}}>
          <Card f={f} at={LT(T, 's52', 8)} light x={0} y={0} w={720} size={34} text="もし夜中にお菓子に手が伸びたら 水を一杯飲む" />
          <Card f={f} at={LT(T, 's52', 8, 1)} light x={0} y={170} w={720} size={34} text="もし怒りの長文を打ったら 送らずに朝まで置く" />
        </div>
      )}
    </AbsoluteFill>
  );
};
const S53: React.FC<SceneProps> = ({f, T}) => {
  const avoid = f >= LT(T, 's53', 4);
  return (
    <AbsoluteFill>
      <CardRow state={() => ({p: 1, dim: 0.2})} y={140} w={130} gap={24} shift={-170} mascot={{f, x: 1540, y: 380, rotY: -1.2}} />
      {!avoid && f >= LT(T, 's53', 2) && (
        <>
          <Card f={f} at={LT(T, 's53', 2)} light x={160} y={420} w={1200} size={38} text="我慢が上手な人も 欲求の数はあまり変わらない" />
          <Card f={f} at={LT(T, 's53', 2, 2)} light x={160} y={560} w={1200} size={38} color="#2e8a5a" text="違うのは ぶつかりが小さく 我慢する回数が少ない" />
        </>
      )}
      {!avoid && f >= LT(T, 's53', 3) && <Card f={f} at={LT(T, 's53', 3, 1)} light x={160} y={700} w={1200} size={38} color="#c0392b" text="誘惑の場面に そもそも近づいていない" />}
      {avoid && f < LT(T, 's53', 5) && ['夜中に台所へ行かない', '買い物のアプリを開かない', '腹が立つ相手の投稿を見に行かない'].map((t, i) => <Card key={i} f={f} at={LT(T, 's53', 4) + i * 22} light x={160} y={420 + i * 130} w={1200} size={40} text={t} />)}
      {f >= LT(T, 's53', 5) && <Big f={f} at={LT(T, 's53', 5)} y={500} size={78} color="#c0392b" light text="戦う回数を減らす" />}
    </AbsoluteFill>
  );
};

// =============== 12. まとめ ===============
const S54: React.FC<SceneProps> = ({f, T}) => {
  const names = NAMES.map((n) => n[0]);
  const recap = f >= LT(T, 's54', 4) && f < LT(T, 's54', 5);
  const watch = f >= LT(T, 's54', 7);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2e2418 0%, #0c0906 80%)'}}>
      <Candle f={f} x={120} y={560} />
      <Parchment f={f} x={240} y={80} w={680} h={640} words={names} wordsAt={LT(T, 's54', 1)} />
      <Notebook x={1000} y={80} w={680} h={640}>
        <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', alignContent: 'center', gap: '18px 40px', padding: 50}}>
          {names.map((t, i) => <div key={i} style={{fontSize: 51, fontWeight: 900, color: '#2a3550', textAlign: 'center', opacity: interpolate(f - LT(T, 's54', 1) - i * 8, [0, 10], [0, 1], clamp)}}>{t}</div>)}
        </div>
      </Notebook>
      {(recap || watch) && <AbsoluteFill style={{background: 'rgba(8,6,4,0.9)'}} />}
      {recap && (
        <div style={{position: 'absolute', left: 140, top: 60, width: 1640, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
          {['見ただけで始まる「食べたい」', '勢いがつくと別人になる判断', '買う前に決まっている欲', '心がよそに行って生まれる悲しみ', '発散するほど育つ怒り', '何もない15分に耐えられない', 'いいねに反応する脳', '自分では気づけない傲慢'].map((t, i) => (
            <Pop key={i} f={f} at={LT(T, 's54', 4, Math.min(i, 7))} from="up" style={{padding: '16px 24px', borderRadius: 14, background: 'rgba(16,20,30,0.9)', border: '2px solid rgba(232,196,106,0.5)', fontFamily: FONT, fontSize: 36, fontWeight: 900, color: K.ink}}><span style={{color: K.gold}}>{names[i]}</span>　{t}</Pop>
          ))}
        </div>
      )}
      {watch && ['見張れる', '名前をつけられる', '記録できる'].map((t, i) => <Big key={i} f={f} at={LT(T, 's54', 7) + i * 14} y={110 + i * 120} size={74} color={K.gold} text={t} />)}
      {watch && f >= LT(T, 's54', 8, 1) && <Big f={f} at={LT(T, 's54', 8, 1)} y={520} size={62} color="#ffffff" text="飲み込まれた人ではなく 観察する人になる" />}
    </AbsoluteFill>
  );
};
const S55: React.FC<SceneProps> = ({f, T}) => {
  const g = 0.35 + 0.25 * Math.sin(f / 14);
  return (
    <AbsoluteFill>
      <CardRow state={(i) => ({p: 1, glow: i === 3 ? g : 0, dim: i === 3 ? 0 : 0.3})} y={320} {...MROW} mascot={{f, x: 1540, y: 330, rotY: -1.0}} />
      {f >= LT(T, 's55', 1) && f < LT(T, 's55', 3) && <Big f={f} at={LT(T, 's55', 1)} y={90} size={64} color="#1d2230" light text="一番「自分だ」と感じたのは 何番目？" />}
      {f >= LT(T, 's55', 2) && f < LT(T, 's55', 3) && <Big f={f} at={LT(T, 's55', 2)} y={760} size={56} color="#c0392b" light text="今夜 その考えが来たら 名前を呼ぶ" />}
      {f >= LT(T, 's55', 3) && <Big f={f} at={LT(T, 's55', 3)} y={90} size={66} color="#c0392b" light text="あなたを一番壊しているのは どれ？" />}
    </AbsoluteFill>
  );
};

export const SCENES_S2: Record<string, React.FC<SceneProps>> = {s26: S26, s27: S27, s28: S28, s29: S29, s31: S31, s32: S32, s33: S33, s34: S34, s36: S36, s37: S37, s38: S38, s39: S39, s40: S40,
  s42: S42, s43: S43, s44: S44, s45: S45, s46: S46, s47: S47, s48: S48, s49: S49, s50: S50, s51: S51, s52: S52, s53: S53, s54: S54, s55: S55};
export const _unused2 = [SinCard, KAN, Still, Phone];
