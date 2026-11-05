import {AbsoluteFill, interpolate} from 'remotion';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {Timer} from './ScenesA';
import {Clock, DarkBoard, FeedTile, PhonePOV, SceneProps, Still, Title, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Pop, clamp, fadeIn} from './ui';

const Notif: React.FC<{icon: string; title: string; body: string; badge?: string}> = ({icon, title, body, badge}) => (
  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1c2333, #0d1018)', fontFamily: FONT}}>
    <div style={{position: 'absolute', left: 18, right: 18, top: 70, padding: '22px 24px', borderRadius: 24, background: 'rgba(240,243,250,0.95)', color: '#1d2230'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, fontWeight: 800, color: '#555'}}><span style={{fontSize: 30}}>{icon}</span>{title}{badge && <span style={{marginLeft: 'auto', background: '#e0533d', color: '#fff', borderRadius: 14, padding: '2px 12px'}}>{badge}</span>}</div>
      <div style={{fontSize: 28, fontWeight: 800, marginTop: 10, lineHeight: 1.4}}>{body}</div>
    </div>
  </div>
);

// ============ 8. 現実逃避 ============
const K8Msg: React.FC<SceneProps> = ({f, dur, T}) => {
  const sw = T('I2');
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="desk" f={f} dur={dur} dark={0.6} blur={5} />
      <PhonePOV f={f - sw} flick={f < sw ? 0 : 26} x={760} y={60} scale={1.0} tilt={-3}
        screen={f < sw ? <Notif icon="💼" title="上司" body="至急 先ほどの資料の件で確認したいことがあります" badge="1" /> : undefined} />
      {f >= T('I3') && (
        <div style={{position: 'absolute', left: 140, top: 160, display: 'flex', flexDirection: 'column', gap: 26, fontFamily: FONT}}>
          {['仕事でミスをした夜', '恋人とけんかした帰り道', 'やることが山のようにあるとき'].map((s, i) => (
            <Pop key={i} f={f} at={T('I3', Math.min(i, 1)) + i * 20} from="left"><div style={{padding: '16px 28px', borderRadius: 14, background: 'rgba(10,12,18,0.85)', fontSize: 38, fontWeight: 800, color: K.ink}}>{s}</div></Pop>
          ))}
        </div>
      )}
      <Vignette />
    </AbsoluteFill>
  );
};
const K8Motives: React.FC<SceneProps> = ({f, T}) => {
  const ms: [string, string][] = [['気分を変えたい', '🌀'], ['嫌なことから気をそらしたい', '🙈'], ['時間をつぶしたい', '⏳']];
  return (
    <DarkBoard>
      <Pop f={f} at={T('I4')} style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 50, fontWeight: 900}}>やめられない使い方と結びついた理由</Pop>
      <div style={{position: 'absolute', left: 140, right: 140, top: 210, display: 'flex', justifyContent: 'space-around'}}>
        {ms.map(([s, ic], i) => (
          <Pop key={i} f={f} at={T('I6', Math.min(i, 1)) + (i === 1 ? 24 : 0)} from="scale">
            <div style={{width: 460, height: 300, borderRadius: 26, background: 'rgba(224,83,61,0.12)', border: '3px solid rgba(224,83,61,0.6)', textAlign: 'center', paddingTop: 36}}>
              <div style={{fontSize: 100}}>{ic}</div><div style={{fontSize: 36, fontWeight: 900, marginTop: 14, padding: '0 20px'}}>{s}</div>
            </div>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={T('I7', 1)} style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center'}}>
        <div style={{display: 'inline-block', padding: '20px 40px', borderRadius: 18, background: 'rgba(255,255,255,0.06)', fontSize: 40, fontWeight: 900}}>退屈しやすい → <span style={{color: K.gold}}>自分だけ取り残されるのが不安</span> → やめられない</div>
      </Pop>
    </DarkBoard>
  );
};
const K8Escape: React.FC<SceneProps> = ({f}) => {
  const s = interpolate(f, [0, 8, 14], [1.8, 0.95, 1], clamp);
  return (
    <DarkBoard tint="#2a1416">
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, textAlign: 'center', transform: `scale(${s})`, opacity: fadeIn(f, 0, 6)}}>
        <div style={{fontSize: 120, fontWeight: 900, color: '#ff3b30'}}>ドパガキ</div>
        <div style={{fontSize: 110, fontWeight: 900, marginTop: 20}}>＝ 現実逃避</div>
      </div>
    </DarkBoard>
  );
};
const K8Cuts: React.FC<SceneProps> = ({f, dur, T}) => {
  const cuts = [T('I9'), T('I10'), T('I11'), T('I12')];
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k];
  const notif = [
    <Notif key="a" icon="💳" title="カード" body="今月のご請求額が確定しました" />,
    <Notif key="b" icon="💬" title="メッセージ" body="未読のメッセージがあります" badge="12" />,
    <Notif key="c" icon="📅" title="カレンダー" body="締め切り 明日 9:00" badge="!" />,
  ];
  const showNotif = k < 3 && lf < 34;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src={k === 2 ? 'desk' : 'living'} f={f} dur={dur} dark={0.6} blur={5} />
      <PhonePOV f={lf} flick={showNotif ? 0 : 24} start={34} x={760} y={60} scale={1.0} screen={showNotif ? notif[k] : undefined} />
      <Vignette />
    </AbsoluteFill>
  );
};
const LOOP = ['しんどい', 'スマホを開く', '夜ふかし', '眠りが浅い', 'もっと疲れる'];
const Ring: React.FC<{f: number; active: number; items: string[]; r?: number; cx?: number; cy?: number; spin?: number}> = ({f, active, items, r = 300, cx = 960, cy = 440, spin = 0}) => (
  <>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={6} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0533d" strokeWidth={6} strokeDasharray={`${r * 0.6} ${r * 6}`} transform={`rotate(${f * 2.4 + spin} ${cx} ${cy})`} />
    </svg>
    {items.map((s, i) => {
      const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const on = i === active;
      return (
        <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * r - 170, top: cy + Math.sin(a) * r - 44, width: 340, textAlign: 'center', fontFamily: FONT}}>
          <div style={{display: 'inline-block', padding: '14px 26px', borderRadius: 16, fontSize: 40, fontWeight: 900, background: on ? '#e0533d' : 'rgba(20,24,34,0.95)', color: on ? '#fff' : K.ink, border: `3px solid ${on ? '#ff7a64' : 'rgba(255,255,255,0.15)'}`, transform: `scale(${on ? 1.1 : 1})`}}>{s}</div>
        </div>
      );
    })}
  </>
);
const K8Loop: React.FC<SceneProps> = ({f, T}) => {
  const ids = ['I14', 'I14', 'I15', 'I16', 'I17'];
  let a = -1;
  const at = [T('I14'), T('I14') + 25, T('I15'), T('I16'), T('I17')];
  for (let i = 0; i < at.length; i++) if (f >= at[i]) a = i;
  if (f >= T('I18')) a = 1;
  void ids;
  return <DarkBoard><Ring f={f} active={a} items={LOOP} /></DarkBoard>;
};
const K8Meta: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <div style={{position: 'absolute', left: 160, top: 120, display: 'grid', gridTemplateColumns: 'repeat(6, 80px)', gap: 16}}>
      {Array.from({length: 23}, (_, i) => <div key={i} style={{width: 80, height: 100, borderRadius: 8, background: '#e9e4dc', opacity: seg(f, i * 2, i * 2 + 8), boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}><div style={{margin: '18px 12px', height: 6, background: '#b9b1a4'}} /><div style={{margin: '0 12px', height: 6, background: '#b9b1a4'}} /></div>)}
    </div>
    <Pop f={f} at={T('I19', 2)} style={{position: 'absolute', left: 230, top: 560, fontSize: 60, fontWeight: 900}}>23本の研究</Pop>
    <Pop f={f} at={T('I20')} style={{position: 'absolute', left: 1000, top: 150}}>
      <svg width={760} height={560} viewBox="0 0 760 560">
        <line x1={80} y1={470} x2={720} y2={470} stroke="#9fb0d0" strokeWidth={3} /><line x1={80} y1={30} x2={80} y2={470} stroke="#9fb0d0" strokeWidth={3} />
        {Array.from({length: 22}, (_, i) => <circle key={i} cx={110 + i * 27} cy={440 - i * 17 + (((i * 53) % 60) - 30)} r={11} fill="#5fa8ff" opacity={seg(f, T('I20') + i * 2, T('I20') + i * 2 + 8)} />)}
        <text x={400} y={530} textAnchor="middle" fill="#dfe6f5" fontSize={30} fontWeight={800} fontFamily={FONT}>やめられない使い方</text>
        <text x={36} y={250} textAnchor="middle" fill="#dfe6f5" fontSize={30} fontWeight={800} fontFamily={FONT} transform="rotate(-90 36 250)">気分の落ち込み</text>
      </svg>
    </Pop>
  </DarkBoard>
);
const K8Ring: React.FC<SceneProps> = ({f, T}) => {
  const a = f < T('I22') + 20 ? 0 : f < T('I22') + 40 ? 1 : f < T('I23') ? 2 : -1;
  return (
    <DarkBoard>
      <Ring f={f} active={a} items={['無気力', '慢性疲労', '現実逃避']} r={250} cx={820} />
      <MascotOverlay f={f} x={1350} y={360} w={380} h={440} rotY={-0.9} />
    </DarkBoard>
  );
};

// ============ 9. 抜け出す方法 ============
const K9Fast: React.FC<SceneProps> = ({f, T}) => {
  const st = T('J3');
  return (
    <DarkBoard>
      <Pop f={f} at={T('J2')} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontSize: 120, fontWeight: 900}}>「ドーパミン断食」</Pop>
      {f >= st && <div style={{position: 'absolute', left: 560, top: 380, transform: `rotate(-6deg) scale(${interpolate(f - st, [0, 6, 10], [2, 0.94, 1], clamp)})`, border: '8px solid #ffd166', borderRadius: 20, padding: '10px 34px', fontSize: 70, fontWeight: 900, color: '#ffd166'}}>確かめた研究は見当たらない</div>}
      <Pop f={f} at={T('J5')} style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontSize: 48, fontWeight: 900, color: K.sub}}>ドーパミンは ためておけるものではない</Pop>
    </DarkBoard>
  );
};
const Toggle: React.FC<{on: boolean; label: string}> = ({on, label}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderRadius: 16, background: '#f4f5f8', fontSize: 26, fontWeight: 800, color: '#1d2230', fontFamily: FONT}}>
    {label}
    <div style={{width: 84, height: 46, borderRadius: 23, background: on ? '#4caf50' : '#c6c9d1', position: 'relative'}}><div style={{position: 'absolute', top: 4, left: on ? 42 : 4, width: 38, height: 38, borderRadius: 19, background: '#fff'}} /></div>
  </div>
);
const K9App: React.FC<SceneProps> = ({f, T}) => {
  const off = f >= T('J10') + 20;
  return (
    <DarkBoard>
      <PhonePOV f={f} flick={0} x={300} y={60} scale={0.95} tilt={-3} thumb={false} screen={
        <div style={{position: 'absolute', inset: 0, background: '#e6e8ee', padding: '90px 20px', display: 'flex', flexDirection: 'column', gap: 18}}>
          <Toggle on={!off} label="モバイルインターネット" />
          <Toggle on label="電話" /><Toggle on label="メッセージ" />
        </div>
      } />
      <div style={{position: 'absolute', left: 900, top: 150, display: 'flex', flexDirection: 'column', gap: 30, fontFamily: FONT}}>
        <Pop f={f} at={T('J10')}><div style={{fontSize: 46, fontWeight: 900, color: '#ff4d3d'}}>🌐 スマホのネット　オフ</div></Pop>
        <Pop f={f} at={T('J11')}><div style={{fontSize: 46, fontWeight: 900, color: '#5fc6b4'}}>📞 電話　💬 メッセージ　OK</div></Pop>
        <Pop f={f} at={T('J11', 1)}><div style={{fontSize: 46, fontWeight: 900, color: '#5fc6b4'}}>💻 パソコンのネット　OK</div></Pop>
        <Pop f={f} at={T('J12')}><div style={{fontSize: 64, fontWeight: 900, color: K.gold, marginTop: 20}}>そのまま2週間</div></Pop>
        <Pop f={f} at={T('J13')}><div style={{fontSize: 38, fontWeight: 800, color: K.ink}}>前と後で 生活の満足度・心の健康・集中力を測る</div></Pop>
      </div>
    </DarkBoard>
  );
};
const K9Graphs: React.FC<SceneProps> = ({f, T}) => {
  const items: [string, string, string][] = [['生活の満足度', 'J16', '#5fc6b4'], ['心の健康', 'J16', '#6fa8dc'], ['集中力', 'J17', '#ffd166']];
  return (
    <DarkBoard>
      <Title f={f} text="2週間ネットを止めると" y={60} size={54} />
      {items.map(([lb, id, c], i) => {
        const g = seg(f, T(id, i === 1 ? 1 : 0), T(id, i === 1 ? 1 : 0) + 30);
        return (
          <div key={i} style={{position: 'absolute', left: 260 + i * 500, top: 200, width: 400, height: 460, fontFamily: FONT}}>
            <svg width={400} height={380} viewBox="0 0 400 380">
              <line x1={30} y1={340} x2={380} y2={340} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
              <path d={`M 60 260 L ${60 + 290 * g} ${260 - 170 * g}`} stroke={c} strokeWidth={10} strokeLinecap="round" />
              <circle cx={60} cy={260} r={14} fill={c} />{g > 0.98 && <circle cx={350} cy={90} r={16} fill={c} />}
              <text x={60} y={375} textAnchor="middle" fill="#aeb8cc" fontSize={26} fontFamily={FONT}>前</text>
              <text x={350} y={375} textAnchor="middle" fill="#aeb8cc" fontSize={26} fontFamily={FONT}>2週間後</text>
            </svg>
            <div style={{textAlign: 'center', fontSize: 42, fontWeight: 900, color: c}}>{lb} ↑</div>
          </div>
        );
      })}
      <Pop f={f} at={T('J18')} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center', fontSize: 50, fontWeight: 900, color: K.gold}}>集中力の上がり方 ＝ 10歳若い人との差と同じくらい</Pop>
    </DarkBoard>
  );
};
const K9Park: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fc3ec 0%, #cfe6f5 55%, #7fbf6a 55.2%, #5f9f4e 100%)', fontFamily: FONT}}>
    {[[200, 360], [420, 330], [1500, 350], [1700, 320]].map(([x, y], i) => (
      <div key={i} style={{position: 'absolute', left: x, top: y}}><div style={{width: 200, height: 200, borderRadius: '50%', background: '#3f8a46'}} /><div style={{width: 30, height: 120, margin: '-20px auto 0', background: '#6b4a32'}} /></div>
    ))}
    <div style={{position: 'absolute', left: 1500, top: 80, width: 140, height: 140, borderRadius: '50%', background: '#fff3b0', boxShadow: '0 0 80px 30px rgba(255,240,170,0.6)'}} />
    <div style={{position: 'absolute', left: 300, right: 300, top: 160, display: 'flex', justifyContent: 'space-around'}}>
      {[['👫', '外で人と会う'], ['🏃', '体を動かす'], ['🌳', '自然の中で過ごす']].map(([ic, lb], i) => (
        <Pop key={i} f={f} at={T('J20', i === 2 ? 1 : 0) + (i === 1 ? 26 : 0)} from="scale">
          <div style={{width: 360, padding: '30px 0', borderRadius: 26, background: 'rgba(255,255,255,0.88)', textAlign: 'center', boxShadow: '0 14px 40px rgba(0,0,0,0.2)'}}><div style={{fontSize: 110}}>{ic}</div><div style={{fontSize: 38, fontWeight: 900, color: '#1d2230'}}>{lb}</div></div>
        </Pop>
      ))}
    </div>
    <Pop f={f} at={T('J20', 1) + 30} style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', fontSize: 54, fontWeight: 900, color: '#fff', textShadow: '0 3px 12px rgba(0,0,0,0.5)'}}>時間が増えていた</Pop>
  </AbsoluteFill>
);
const K9Dropout: React.FC<SceneProps> = ({f, T}) => {
  const k = seg(f, T('J23', 1), T('J23', 2) + 10);
  return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 260, top: 120, display: 'flex', gap: 26}}>
        {Array.from({length: 10}, (_, i) => <div key={i} style={{opacity: i < 4 ? 1 : 1 - 0.7 * k}}><PersonIcon size={120} color={i < 4 && k > 0.5 ? '#5fc6b4' : '#9aa6bd'} /></div>)}
      </div>
      <Pop f={f} at={T('J23', 2)} style={{position: 'absolute', left: 260, top: 330, fontSize: 46, fontWeight: 900, color: '#5fc6b4'}}>2週間のうち10日以上続いたのは 半分もいない</Pop>
      <Pop f={f} at={T('J26')} from="scale" style={{position: 'absolute', left: 260, top: 480, fontSize: 70, fontWeight: 900}}>意志の力 <span style={{color: '#ff4d3d'}}>✕</span></Pop>
      <Pop f={f} at={T('J27', 1)} from="scale" style={{position: 'absolute', left: 260, top: 600, fontSize: 70, fontWeight: 900, color: K.gold}}>「見られない場所」を先につくる</Pop>
    </DarkBoard>
  );
};
const K9Now: React.FC<SceneProps> = ({f, T}) => {
  const sand = seg(f, T('J33', 1), T('J35') + 60);
  return (
    <DarkBoard>
      <Pop f={f} at={T('J29')} style={{position: 'absolute', left: 200, top: 150, fontSize: 70, fontWeight: 900, color: '#5fc6b4'}}>2週間で 戻った</Pop>
      <Pop f={f} at={T('J31')} style={{position: 'absolute', left: 200, top: 290, fontSize: 90, fontWeight: 900, color: K.gold}}>今日から</Pop>
      <svg width={420} height={600} viewBox="0 0 420 600" style={{position: 'absolute', left: 1240, top: 110, opacity: fadeIn(f, T('J33'))}}>
        <path d="M 60 20 L 360 20 L 360 40 C 360 180 230 250 230 300 C 230 350 360 420 360 560 L 360 580 L 60 580 L 60 560 C 60 420 190 350 190 300 C 190 250 60 180 60 40 Z" fill="rgba(255,255,255,0.08)" stroke="#9fb0d0" strokeWidth={6} />
        <path d={`M ${90 + 110 * sand} ${60 + 200 * sand} L ${330 - 110 * sand} ${60 + 200 * sand} L 212 290 L 208 290 Z`} fill="#e8c46a" />
        <path d={`M 90 560 L 330 560 L ${330 - 60 * (1 - sand)} ${560 - 200 * sand} L ${90 + 60 * (1 - sand)} ${560 - 200 * sand} Z`} fill="#e8c46a" />
        <line x1={210} y1={300} x2={210} y2={560} stroke="#e8c46a" strokeWidth={3} strokeDasharray="6 10" strokeDashoffset={-f * 2} />
      </svg>
      <Pop f={f} at={T('J33', 1)} style={{position: 'absolute', left: 200, top: 470, fontSize: 60, fontWeight: 900, color: '#ff4d3d'}}>消えた時間は 二度と戻らない</Pop>
    </DarkBoard>
  );
};
const K9Today: React.FC<SceneProps> = ({f}) => (
  <DarkBoard>
    <Title f={f} text="今日からできること" y={200} size={110} color={K.gold} />
    <Title f={f} at={10} text="3つ" y={380} size={140} />
    <MascotOverlay f={f} x={1420} y={400} w={360} h={420} rotY={-0.8} />
  </DarkBoard>
);
const TipHead: React.FC<{f: number; n: string; text: string}> = ({f, n, text}) => (
  <div style={{position: 'absolute', left: 90, top: 70, display: 'flex', alignItems: 'center', gap: 24, fontFamily: FONT, opacity: fadeIn(f, 0, 10)}}>
    <div style={{padding: '10px 24px', borderRadius: 14, background: K.gold, color: '#141820', fontSize: 44, fontWeight: 900}}>{n}</div>
    <div style={{fontSize: 56, fontWeight: 900, color: K.ink, textShadow: '0 3px 12px rgba(0,0,0,0.7)'}}>{text}</div>
  </div>
);
const K9Tip1: React.FC<SceneProps> = ({f, dur, T}) => {
  const out = seg(f, 20, 70);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Still src="bedLamp" f={f} dur={dur} dark={0.35} />
      <div style={{position: 'absolute', left: 1300 + out * 500, top: 470, width: 130, height: 240, borderRadius: 22, background: '#0d0f13', boxShadow: '0 0 0 3px #2b2f37', opacity: 1 - out}} />
      <Pop f={f} at={T('J40')} from="scale" style={{position: 'absolute', left: 1280, top: 430, fontSize: 200}}>⏰</Pop>
      <TipHead f={f} n="一つ目" text="スマホを寝室に持ち込まない" />
      <Vignette />
    </AbsoluteFill>
  );
};
const K9Tip2: React.FC<SceneProps> = ({f, T}) => {
  const del = seg(f, T('J42', 2), T('J42', 2) + 20);
  return (
    <DarkBoard>
      <TipHead f={f} n="二つ目" text="2週間 スマホのネットを止める" />
      <PhonePOV f={f} flick={0} x={760} y={200} scale={0.8} tilt={0} thumb={false} screen={
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #24304a, #121722)', padding: '90px 30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26}}>
          {['📞', '💬', '📷', '🗓️', '🎬', '🧮'].map((s, i) => <div key={i} style={{height: 90, borderRadius: 22, background: i === 4 ? '#ff4d6d' : 'rgba(255,255,255,0.15)', fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 4 ? 1 - del : 1, transform: i === 4 ? `scale(${1 - 0.5 * del}) rotate(${Math.sin(f / 2) * (del < 0.05 && f > T('J42', 2) - 30 ? 6 : 0)}deg)` : undefined}}>{s}</div>)}
        </div>
      } />
      <Pop f={f} at={T('J43')} style={{position: 'absolute', left: 1240, top: 420, fontSize: 44, fontWeight: 900, color: '#5fc6b4', fontFamily: FONT}}>電話とメッセージだけ残す</Pop>
    </DarkBoard>
  );
};
const K9Tip3: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <TipHead f={f} n="三つ目" text="何もしない15分に慣れる" />
    <div style={{position: 'absolute', left: 300, top: 230, transform: 'scale(0.9)', transformOrigin: 'top left'}}><Timer f={f} run={0} x={0} y={0} /></div>
    <div style={{position: 'absolute', left: 1050, top: 260, display: 'flex', gap: 40}}>
      {[['🚪', '外に出る'], ['🏃', '体を動かす'], ['👫', '人と会う']].map(([ic, lb], i) => (
        <Pop key={i} f={f} at={T('J48') + i * 24} from="scale"><div style={{textAlign: 'center', fontFamily: FONT}}><div style={{fontSize: 110}}>{ic}</div><div style={{fontSize: 34, fontWeight: 900}}>{lb}</div></div></Pop>
      ))}
    </div>
  </DarkBoard>
);

// ============ 10. まとめ ============
const SUM: [string, string, string][] = [['K2', '🧠', '退屈に耐えられない脳は「もっと」と動かされる'], ['K3', '🍽️', '受け皿が少なく 注意とごほうびの場所が小さい'], ['K4', '🧒', '子どもは3年で 脳の育ちと言葉の知能に差'], ['K5', '📝', 'ショート動画のあと やるはずのことが抜け落ちる'], ['K6', '🛏️', '寝室のスマホは眠りを浅くする'], ['K7', '🔁', 'すべてが現実逃避の輪につながる'], ['K8', '🌱', '2週間ネットを止めた人は 集中力と心の健康を取り戻した']];
const K10Sum: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard>
    <Title f={f} text="ドパガキは笑えない" y={40} size={60} color="#ff3b30" />
    {SUM.map(([id, ic, s], i) => (
      <Pop key={i} f={f} at={T(id)} from="left" style={{position: 'absolute', left: 260, top: 140 + i * 102, width: 1400}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '12px 26px', borderRadius: 16, background: i === 6 ? 'rgba(95,198,180,0.16)' : 'rgba(255,255,255,0.05)', border: `2px solid ${i === 6 ? '#5fc6b4' : 'rgba(255,255,255,0.1)'}`}}>
          <div style={{fontSize: 50}}>{ic}</div><div style={{fontSize: 38, fontWeight: 800}}>{s}</div>
        </div>
      </Pop>
    ))}
  </DarkBoard>
);
const K10Question: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.55} from={1.05} to={1.15} />
    <PhonePOV f={f} flick={f < T('K12') ? 30 : 0} x={760} y={60} scale={1.0} glow={f < T('K12') ? 1 : 0.4} thumb={f < T('K12')} />
    <MascotOverlay f={f} x={1420} y={420} w={360} h={420} rotY={-1.0} />
    <Vignette />
  </AbsoluteFill>
);

export const SCENES_C: Record<string, React.FC<SceneProps>> = {
  k8_msg: K8Msg, k8_motives: K8Motives, k8_escape: K8Escape, k8_cuts: K8Cuts, k8_loop: K8Loop, k8_meta: K8Meta, k8_ring: K8Ring,
  k9_fast: K9Fast, k9_app: K9App, k9_graphs: K9Graphs, k9_park: K9Park, k9_dropout: K9Dropout, k9_now: K9Now, k9_today: K9Today, k9_tip1: K9Tip1, k9_tip2: K9Tip2, k9_tip3: K9Tip3,
  k10_sum: K10Sum, k10_question: K10Question,
};
export const _u = {FeedTile, Clock};
