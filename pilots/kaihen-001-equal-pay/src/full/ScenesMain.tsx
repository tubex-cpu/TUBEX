// chapters 1-12 (S03-S47, 台本 v0.5). Each scene: a 3D background still (public/bg/<set>.png, src/three/Sets.tsx) with a slow
// push-in, and 2D story graphics timed to the narration (T(line, chunk) = frame of a subtitle line within the scene).
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {C, FONT} from '../theme';
import {Big, SceneProps, appear, clamp, ease, slam} from './kit';

const FPS = 30;
const RED = C.red, GOLD = C.gold, NAVY = C.navy;

// ---------- building blocks ----------
const Bg: React.FC<{id: string; f: number; dur: number; from?: number; to?: number; ox?: number; oy?: number; dim?: number; tint?: string}> = ({id, f, dur, from = 1.03, to = 1.12, ox = 50, oy = 45, dim = 0.25, tint}) => {
  const s = interpolate(f, [0, Math.max(1, dur)], [from, to], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: NAVY}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ox}% ${oy}%`}}>
        <Img src={staticFile(`bg/${id}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(15,27,45,${dim + 0.25}) 0%, rgba(15,27,45,${dim}) 35%, rgba(15,27,45,${dim}) 65%, rgba(15,27,45,${dim + 0.35}) 100%)`}} />
      {tint && <AbsoluteFill style={{background: tint, mixBlendMode: 'multiply'}} />}
    </AbsoluteFill>
  );
};

const pop = (f: number, at: number) => {
  const a = appear(f, at, 10);
  return {opacity: a, transform: `translateY(${(1 - a) * 26}px) scale(${0.96 + 0.04 * a})`};
};

const Kicker: React.FC<{f: number; at: number; text: string; color?: string}> = ({f, at, text, color = GOLD}) => (
  <div style={{position: 'absolute', left: 110, top: 96, ...pop(f, at)}}>
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: NAVY, background: color, padding: '8px 26px', borderRadius: 10, letterSpacing: '0.08em'}}>{text}</span>
  </div>
);

const Head: React.FC<{f: number; at: number; children: React.ReactNode; size?: number; top?: number}> = ({f, at, children, size = 96, top = 170}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', ...pop(f, at)}}><Big size={size}>{children}</Big></div>
);

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; color?: string}> = ({children, style, color = 'rgba(255,255,255,0.93)'}) => (
  <div style={{background: color, color: NAVY, borderRadius: 26, padding: '26px 40px', boxShadow: '0 24px 60px rgba(0,0,0,0.45)', fontFamily: FONT, fontWeight: 900, ...style}}>{children}</div>
);

const man = (v: number) => `${Math.round(v).toLocaleString('ja-JP')}万円`;
const count = (f: number, at: number, a: number, b: number, d = 26) => a + (b - a) * ease((f - at) / d);

// before -> after with the change (the payday cards)
const Swap: React.FC<{f: number; at: number; label: string; before: number; after?: number; delta?: string; up?: boolean; sub?: string; top?: number; x?: number; w?: number; size?: number}> = ({f, at, label, before, after = 478, delta, up = true, sub, top = 300, x = 960, w = 1100, size = 120}) => {
  const v = count(f, at + 18, before, after);
  const done = f > at + 44;
  return (
    <div style={{position: 'absolute', left: x - w / 2, width: w, top, ...pop(f, at)}}>
      <Card style={{textAlign: 'center', padding: '30px 40px'}}>
        <div style={{fontSize: 46, color: '#5b6577'}}>{label}</div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 30, marginTop: 8}}>
          <span style={{fontSize: size * 0.5, color: '#8a93a3', textDecoration: f > at + 18 ? 'line-through' : 'none'}}>{man(before)}</span>
          <span style={{fontSize: size * 0.45, color: '#8a93a3'}}>→</span>
          <span style={{fontSize: size, color: NAVY, letterSpacing: '-0.02em'}}>{man(v)}</span>
        </div>
        {delta && <div style={{marginTop: 10, opacity: done ? 1 : 0, transform: `scale(${done ? slam(f, at + 44).s : 1})`}}>
          <span style={{fontSize: 58, color: '#ffffff', background: up ? '#2e8b57' : RED, padding: '6px 30px', borderRadius: 14}}>{delta}</span>
        </div>}
        {sub && <div style={{marginTop: 14, fontSize: 38, color: '#5b6577', opacity: appear(f, at + 56, 10)}}>{sub}</div>}
      </Card>
    </div>
  );
};

const Chips: React.FC<{f: number; items: {t: string; at: number; color?: string}[]; top?: number; size?: number}> = ({f, items, top = 640, size = 46}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', gap: 26, flexWrap: 'wrap', padding: '0 120px'}}>
    {items.map((it) => (
      <span key={it.t} style={{...pop(f, it.at), fontFamily: FONT, fontWeight: 900, fontSize: size, color: NAVY, background: it.color ?? 'rgba(255,255,255,0.92)', padding: '12px 30px', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'}}>{it.t}</span>
    ))}
  </div>
);

const Question: React.FC<{f: number; at: number; children: React.ReactNode; size?: number; top?: number}> = ({f, at, children, size = 104, top = 330}) => {
  const st = slam(f, at);
  return f < at - 2 ? null : (
    <div style={{position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: st.o, transform: `scale(${0.9 + 0.1 * Math.min(1, st.s)}) translateX(${st.shake * 0.6}px)`}}>
      <Big size={size} style={{display: 'inline-block', background: 'rgba(15,27,45,0.72)', padding: '18px 54px', borderRadius: 26}}>{children}</Big>
    </div>
  );
};

// horizontal bars for real numbers (求人倍率, 辞めた理由)
const Bars: React.FC<{f: number; at: number; rows: {label: string; v: number; hi?: boolean; at?: number}[]; max: number; unit: string; title?: string; top?: number; fmt?: (v: number) => string}> = ({f, at, rows, max, unit, title, top = 250, fmt = (v) => v.toFixed(2)}) => (
  <div style={{position: 'absolute', left: 230, right: 230, top, ...pop(f, at)}}>
    <Card style={{padding: '30px 46px'}}>
      {title && <div style={{fontSize: 40, color: '#5b6577', marginBottom: 14}}>{title}</div>}
      {rows.map((r, i) => {
        const a = ease((f - (r.at ?? at + 8 + i * 8)) / 22);
        return (
          <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 22, margin: '12px 0'}}>
            <div style={{width: 440, fontSize: 36, textAlign: 'right', whiteSpace: 'nowrap'}}>{r.label}</div>
            <div style={{flex: 1, height: 52, background: 'rgba(15,27,45,0.08)', borderRadius: 10, position: 'relative'}}>
              <div style={{width: `${(r.v / max) * 100 * a}%`, height: '100%', background: r.hi ? RED : '#3d6fb6', borderRadius: 10}} />
            </div>
            <div style={{width: 200, fontSize: 46, color: r.hi ? RED : NAVY, opacity: a}}>{fmt(r.v)}{unit}</div>
          </div>
        );
      })}
    </Card>
  </div>
);

const Two: React.FC<{f: number; at: [number, number]; left: React.ReactNode; right: React.ReactNode; top?: number; colors?: [string, string]}> = ({f, at, left, right, top = 300, colors = ['rgba(255,255,255,0.93)', 'rgba(255,255,255,0.93)']}) => (
  <div style={{position: 'absolute', left: 140, right: 140, top, display: 'flex', gap: 50}}>
    <div style={{flex: 1, ...pop(f, at[0])}}><Card color={colors[0]} style={{textAlign: 'center', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{left}</Card></div>
    <div style={{flex: 1, ...pop(f, at[1])}}><Card color={colors[1]} style={{textAlign: 'center', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>{right}</Card></div>
  </div>
);

const Rain: React.FC<{f: number; o?: number}> = ({f, o = 0.55}) => (
  <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
    <svg width="1920" height="1080">
      {Array.from({length: 140}, (_, i) => {
        const x = (i * 137.3) % 1920, sp = 38 + (i % 7) * 6;
        const y = ((i * 89.1 + f * sp) % 1180) - 100;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 60} stroke="rgba(200,215,240,0.7)" strokeWidth={2} />;
      })}
    </svg>
  </AbsoluteFill>
);
const Flash: React.FC<{f: number; at: number[]}> = ({f, at}) => {
  let o = 0;
  for (const a of at) { const d = f - a; if (d >= 0 && d < 10) o = Math.max(o, d < 2 ? 0.85 : 0.85 * (1 - (d - 2) / 8)); }
  return <AbsoluteFill style={{background: '#dfe8ff', opacity: o, mixBlendMode: 'screen'}} />;
};

const Big2: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = NAVY, size = 64}) => <div style={{fontSize: size, color, lineHeight: 1.2}}>{children}</div>;
const Small: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{fontSize: 36, color: '#5b6577', marginTop: 10}}>{children}</div>;

// ---------- scenes ----------
const S03: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="night_aerial" f={f} dur={dur} dim={0.3} />
    <Kicker f={f} at={T('s03_0')} text="夜9時" />
    {f > T('s03_1') - 4 && f < T('s03_2') + 6 && (
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, ...pop(f, T('s03_1'))}}>
        <div style={{margin: '0 auto', width: 1300, background: RED, color: '#fff', fontFamily: FONT, fontWeight: 900, borderRadius: 18, padding: '22px 40px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
          <div style={{fontSize: 36, letterSpacing: '0.3em'}}>速報</div>
          <div style={{fontSize: 74, marginTop: 6}}>全国の給料を、一律、年478万円に</div>
        </div>
      </div>
    )}
    {f > T('s03_2') - 2 && (
      <div style={{position: 'absolute', left: 360, right: 360, top: 300, ...pop(f, T('s03_2'))}}>
        <Card style={{textAlign: 'center'}}><Small>日本の平均（2024年・1年を通じて働いた人）</Small><Big2 size={140}>478万円</Big2><div style={{fontSize: 46, color: '#5b6577', opacity: appear(f, T('s03_2', 4), 10)}}>月に直すと　およそ40万円</div></Card>
      </div>
    )}
  </>
);
const S04: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="dawn_aerial" f={f} dur={dur} />
    <Chips f={f} top={250} items={[{t: '税金　そのまま', at: T('s04_0', 1)}, {t: '物の値段　そのまま', at: T('s04_0', 1) + 10}, {t: '仕事を選ぶ・辞める　自由', at: T('s04_0', 2)}]} />
    <Head f={f} at={T('s04_1')} top={420} size={110}>給料だけ　<span style={{color: GOLD}}>年478万円</span></Head>
    {f > T('s04_2') && <Chips f={f} top={620} items={[{t: '増える人 ↑', at: T('s04_2', 1), color: '#9fe3b8'}, {t: '減る人 ↓', at: T('s04_2', 1) + 8, color: '#ffb3ae'}]} size={58} />}
    {f > T('s04_3', 1) && <Kicker f={f} at={T('s04_3', 1)} text="答えは、1か月後の給料日" color="#ffffff" />}
  </>
);
const S05: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="phone" f={f} dur={dur} from={1.0} to={1.18} oy={48} dim={0.15} />
    <Kicker f={f} at={T('s05_0')} text="1か月後　給料日の朝" />
    {f > T('s05_2') && <Chips f={f} top={760} items={[{t: 'やった！', at: T('s05_2'), color: '#9fe3b8'}, {t: 'えっ…', at: T('s05_2') + 8, color: '#ffb3ae'}, {t: 'うそでしょ', at: T('s05_2') + 16, color: '#ffffff'}, {t: '二度見', at: T('s05_2') + 24, color: GOLD}]} size={52} />}
  </>
);
const S06: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="izakaya" f={f} dur={dur} />
    <Kicker f={f} at={T('s06_0')} text="居酒屋で働く人" />
    <Swap f={f} at={T('s06_1')} label="ホテル・飲食店の平均（いちばん低い業種）" before={279} delta="一年で +199万円（月 約+16万円）" sub="" top={240} />
    {f > T('s06_2') && <Chips f={f} top={700} items={[{t: '掛け持ちを1つやめる', at: T('s06_2')}, {t: '習いごとを1つ増やす', at: T('s06_2', 1)}, {t: '少し遠回りして帰る', at: T('s06_2', 2), color: GOLD}]} />}
  </>
);
const S07: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="power_night" f={f} dur={dur} />
    <Kicker f={f} at={T('s07_0')} text="電力会社の技術者" color="#ffb3ae" />
    <Swap f={f} at={T('s07_1')} label="電気・ガス・水道の平均（いちばん高い業種）" before={832} up={false} delta="一年で −354万円（月 約−30万円）" top={240} />
    {f > T('s07_2') && <Chips f={f} top={700} items={[{t: '住宅ローン', at: T('s07_2')}, {t: '子どもの学費', at: T('s07_2') + 8}, {t: '計画が一夜でずれる', at: T('s07_2', 1), color: '#ffb3ae'}]} />}
    {f > T('s07_3') && <Question f={f} at={T('s07_3', 2)} top={790} size={52}>台風の夜も、出ていく仕事</Question>}
  </>
);
const S08: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="office" f={f} dur={dur} />
    {f < T('s08_2') && <Question f={f} at={T('s08_1')}>「普通の会社員の自分は、得をする」？</Question>}
    {f >= T('s08_2') - 2 && f < T('s08_3') && <Swap f={f} at={T('s08_2')} label="正社員の平均" before={545} up={false} delta="実は、減る側　年 −67万円" top={260} />}
    {f >= T('s08_3') - 2 && (
      <div style={{position: 'absolute', left: 260, right: 260, top: 300, ...pop(f, T('s08_3'))}}>
        <Card style={{textAlign: 'center'}}>
          <div style={{fontSize: 44, color: '#5b6577'}}>増える側と減る側の境目</div>
          <div style={{fontSize: 110, marginTop: 6}}>年478万円</div>
          <div style={{fontSize: 56, color: '#5b6577'}}>＝ 月 およそ40万円</div>
        </Card>
      </div>
    )}
  </>
);
const S09: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="konbini" f={f} dur={dur} />
    <Swap f={f} at={T('s09_0')} label="正社員以外（パート・契約社員など）の平均" before={206} delta="2倍以上" top={250} />
    {f > T('s09_1') && <Chips f={f} top={720} items={[{t: '片方は減る', at: T('s09_1'), color: '#ffb3ae'}, {t: '片方は2倍', at: T('s09_1') + 10, color: '#9fe3b8'}]} size={54} />}
  </>
);
const S10: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="home" f={f} dur={dur} />
    <Two f={f} at={[T('s10_0', 1), T('s10_0', 2)]} top={220}
      left={<><Small>正社員の夫</Small><Big2>{man(count(f, T('s10_1'), 545, 478))}</Big2></>}
      right={<><Small>パートで働く妻</Small><Big2>{man(count(f, T('s10_1'), 206, 478))}</Big2></>} />
    {f > T('s10_0', 3) && (
      <div style={{position: 'absolute', left: 360, right: 360, top: 560, ...pop(f, T('s10_0', 3))}}>
        <Card style={{textAlign: 'center'}}>
          <Small>家の財布（二人の合計）</Small>
          <Big2 size={92}>{man(count(f, T('s10_1', 1), 751, 956))}</Big2>
          <div style={{opacity: appear(f, T('s10_1', 2), 10), marginTop: 8}}><span style={{fontSize: 52, color: '#fff', background: '#2e8b57', padding: '4px 26px', borderRadius: 12}}>+205万円</span></div>
        </Card>
      </div>
    )}
  </>
);
const S11: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="payday_street" f={f} dur={dur} />
    <Two f={f} at={[T('s11_0', 1), T('s11_0', 1) + 8]} top={250}
      left={<><Small>男性の平均</Small><Big2 size={84}>{man(count(f, T('s11_1'), 587, 478))}</Big2></>}
      right={<><Small>女性の平均</Small><Big2 size={84}>{man(count(f, T('s11_1'), 333, 478))}</Big2></>} />
    <Question f={f} at={T('s11_1', 2)} top={620} size={84}>男女の差　254万円 → <span style={{color: GOLD}}>0</span></Question>
  </>
);
const S12: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="home_parent_child" f={f} dur={dur} />
    <Two f={f} at={[T('s12_1'), T('s12_2')]} top={220}
      left={<><Small>22歳の子（20〜24歳の平均）</Small><Big2>男性 {man(count(f, T('s12_1', 2), 295, 478))}</Big2><Big2>女性 {man(count(f, T('s12_1', 2), 258, 478))}</Big2><div style={{marginTop: 10}}><span style={{fontSize: 44, color: '#fff', background: '#2e8b57', padding: '4px 20px', borderRadius: 12}}>+183万円／+220万円</span></div></>}
      right={<><Small>55歳の父（55〜59歳男性の平均）</Small><Big2 size={84}>{man(count(f, T('s12_2', 2), 735, 478))}</Big2><div style={{marginTop: 10, opacity: appear(f, T('s12_2', 3), 8)}}><span style={{fontSize: 44, color: '#fff', background: RED, padding: '4px 20px', borderRadius: 12}}>−257万円</span></div></>} />
    {f > T('s12_3', 2) && <Chips f={f} top={680} items={[{t: '父：ローンの計算', at: T('s12_3', 2), color: '#ffb3ae'}, {t: '子：一人暮らしの部屋探し', at: T('s12_3', 3), color: '#9fe3b8'}]} />}
  </>
);
const S13: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="hospital" f={f} dur={dur} />
    <Kicker f={f} at={T('s13_0', 1)} text="いちばん大きく減る仕事" color="#ffb3ae" />
    <Swap f={f} at={T('s13_1')} label="雇われて働く医師の平均（国の調査をもとにした計算）" before={1338} up={false} delta="約 −860万円　給料は3分の1ほど" top={240} />
    {f > T('s13_2') && <Chips f={f} top={720} items={[{t: '医学部で6年', at: T('s13_2')}, {t: '国家試験', at: T('s13_2') + 10}, {t: 'その先の給料が、みんなと同じ', at: T('s13_2', 2), color: '#ffb3ae'}]} />}
  </>
);
const S14: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="care" f={f} dur={dur} />
    {f < T('s14_2') && (
      <div style={{position: 'absolute', left: 300, right: 300, top: 250, ...pop(f, T('s14_0', 1))}}>
        <Card style={{textAlign: 'center'}}>
          <Small>介護職員の平均給与（月・手当など込み）</Small>
          <Big2 size={96}>{f < T('s14_1') ? '33万8,200円' : '約39万8,000円'}</Big2>
          <div style={{fontSize: 36, color: '#5b6577'}}>{f < T('s14_1') ? 'うち基本給 25万3,810円' : '月に約 +6万円'}</div>
        </Card>
      </div>
    )}
    <Question f={f} at={T('s14_2', 1)} size={84}>この6万円は、多い？　少ない？</Question>
    {f > T('s14_3', 2) && <Chips f={f} top={700} items={[{t: '求人倍率は、全職業より高い水準', at: T('s14_3', 2)}, {t: '後半の伏線', at: T('s14_3', 4), color: GOLD}]} />}
  </>
);
const MAPROWS: [string, string, string][] = [['大きく増えた', 'パートなど・20代前半・居酒屋やホテル', '#9fe3b8'], ['少し増えた', '介護', '#d8f2c8'], ['減った', '平均的な正社員・50代後半の男性・電気ガス水道', '#ffd0cc'], ['いちばん減った', '医師', '#ff8f87']];
const S15: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="map_wide" f={f} dur={dur} dim={0.4} />
    <Kicker f={f} at={T('s15_0')} text="給料日の地図" />
    <div style={{position: 'absolute', left: 220, right: 220, top: 200}}>
      {MAPROWS.map(([k, v, c], i) => (
        <div key={k} style={{...pop(f, T('s15_1', Math.min(i + 1, 5))), display: 'flex', gap: 24, alignItems: 'center', margin: '18px 0'}}>
          <span style={{width: 380, flexShrink: 0, whiteSpace: 'nowrap', textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 46, background: c, color: NAVY, padding: '14px 0', borderRadius: 14}}>{k}</span>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', textShadow: '0 3px 14px rgba(0,0,0,0.8)'}}>{v}</span>
        </div>
      ))}
    </div>
  </>
);
const S16: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="mall_day" f={f} dur={dur} />
    <Kicker f={f} at={T('s16_0')} text="最初の1か月" />
    <Chips f={f} top={240} items={[{t: '夜は家族と食卓', at: T('s16_1')}, {t: '体を休める', at: T('s16_1', 1)}, {t: '資格の勉強', at: T('s16_1', 1) + 10}, {t: '塾代に悩まない', at: T('s16_1', 2)}]} />
    <Chips f={f} top={420} items={[{t: '冷蔵庫を買い替え', at: T('s16_2', 1), color: GOLD}, {t: '家族旅行を予約', at: T('s16_2', 2), color: GOLD}]} />
    <Question f={f} at={T('s16_3', 1)} top={600}>「時間」と「選択肢」</Question>
  </>
);
const S17: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="office" f={f} dur={dur} dim={0.4} />
    <Head f={f} at={T('s17_0', 1)} top={260} size={84}>隣の人の給料を、こっそり気にする気持ち</Head>
    <Question f={f} at={T('s17_2')} top={520} size={90}>給料で人を比べる理由が、消えた</Question>
  </>
);
const S18: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="dusk_clouds" f={f} dur={dur} from={1.0} to={1.1} />
    <Head f={f} at={T('s18_0')} top={300} size={110}>ここまでは、<span style={{color: GOLD}}>天国</span></Head>
    <Question f={f} at={T('s18_1', 1)} top={520} size={96}>まだ誰も気づいていない<span style={{color: RED}}>落とし穴</span></Question>
  </>
);
const S19: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="izakaya" f={f} dur={dur} />
    <Kicker f={f} at={T('s19_0')} text="異変①　お店の財布" color="#ffb3ae" />
    <Two f={f} at={[T('s19_1'), T('s19_2')]} top={260}
      left={<><Small>居酒屋が一人に払う給料</Small><Big2 size={120} color={RED}>約1.7倍</Big2></>}
      right={<><Small>電力会社が一人に払う給料</Small><Big2 size={120} color="#3d6fb6">約0.57倍</Big2></>} />
  </>
);
const S20: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id={f < T('s20_2') ? 'izakaya' : 'izakaya_closed'} f={f} dur={dur} />
    {f < T('s20_4') && <Two f={f} at={[T('s20_1'), T('s20_2')]} top={260}
      left={<><Small>値段を変えられるなら</Small><Big2>メニューの数字が書き換わる</Big2><Small>電気代は下がる</Small></>}
      right={<><Small>値段を変えられないなら</Small><Big2>シャッターが下りる</Big2><Small>払えないお店から</Small></>} />}
    {f > T('s20_3', 3) && f < T('s20_4') && <Chips f={f} top={680} items={[{t: '給料袋は増えたのに、ビール1杯も値上がり', at: T('s20_3', 3), color: GOLD}]} />}
    <Question f={f} at={T('s20_4')} top={340} size={88}>値段が上がる世界？　お店が減る世界？</Question>
  </>
);
const S21: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="payday_street" f={f} dur={dur} dim={0.45} />
    <Kicker f={f} at={T('s21_0')} text="異変②" color="#ffb3ae" />
    <Question f={f} at={T('s21_1')} top={260} size={96}>「同じ額なら、この仕事、私がやる理由ある？」</Question>
    <Chips f={f} top={560} items={[{t: '体がきつくない？', at: T('s21_2', 1)}, {t: '危なくない？', at: T('s21_2', 1) + 8}, {t: '夜じゃない？', at: T('s21_2', 2)}, {t: '家から近い？', at: T('s21_2', 3)}]} />
  </>
);
const S22: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="office" f={f} dur={dur} dim={0.5} />
    <Bars f={f} at={T('s22_1')} max={20} unit="%" fmt={(v) => v.toFixed(1)} title="2025年に転職した男性が、前の仕事を辞めた理由" top={230}
      rows={[{label: 'その他の個人的な理由', v: 16.8, at: T('s22_2', 2)}, {label: '定年・契約期間の満了', v: 16.1, at: T('s22_2')}, {label: '給料などが少なかった', v: 9.9, hi: true, at: T('s22_1', 1)}]} />
    <Question f={f} at={T('s22_3', 1)} top={700} size={70}>いちばん大きな理由では、ない</Question>
  </>
);
const S23: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="payday_street" f={f} dur={dur} dim={0.5} />
    <Two f={f} at={[T('s23_1'), T('s23_2')]} top={220}
      left={<><Small>読み方①</Small><Big2 size={58}>給料以外の理由で働く人は多い</Big2><Big2 size={58} color="#2e8b57">→ みんな続ける</Big2></>}
      right={<><Small>読み方②</Small><Big2 size={58}>残る理由は「きつい・危ない・夜」</Big2><Big2 size={58} color={RED}>→ 人が離れる</Big2></>} />
    <Question f={f} at={T('s23_3', 1)} top={640} size={70}>カギは、今すでに悲鳴を上げている仕事</Question>
  </>
);
const S24: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="construction" f={f} dur={dur} dim={0.45} />
    <Bars f={f} at={T('s24_0')} max={8} unit="件" title="仕事を探す人1人あたりの求人（2025年度）" top={200}
      rows={[{label: '仕事全体', v: 1.10, at: T('s24_1')}, {label: 'サービス', v: 2.73, at: T('s24_2', 2)}, {label: '建設', v: 5.02, at: T('s24_2', 1)}, {label: '警備など', v: 6.41, at: T('s24_2')}, {label: '建物の骨組み', v: 7.72, hi: true, at: T('s24_3')}]} />
    {f > T('s24_3', 1) && f < T('s24_4') && <Chips f={f} top={800} items={[{t: '1人を、7つ以上の職場が待っている', at: T('s24_3', 1), color: GOLD}]} />}
  </>
);
const S25: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="storm" f={f} dur={dur} from={1.05} to={1.15} />
    <Rain f={f} />
    <Flash f={f} at={[T('s25_1') + 4, T('s25_1') + 40, T('s25_3') - 6]} />
    <Kicker f={f} at={T('s25_1')} text="台風の夜　呼び出しの電話" color="#ffb3ae" />
    {f > T('s25_2') && f < T('s25_3') && <Head f={f} at={T('s25_2')} top={330} size={92}>行っても行かなくても、<span style={{color: GOLD}}>478万円</span></Head>}
    <Question f={f} at={T('s25_3')} top={330} size={120}>その電話に、出ますか？</Question>
    {f > T('s25_4', 1) && <Chips f={f} top={620} items={[{t: '夜の工事現場', at: T('s25_4', 1)}, {t: '真夜中の警備', at: T('s25_4', 2)}, {t: '介護施設の夜勤', at: T('s25_4', 3)}]} />}
  </>
);
const S26: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="dawn_aerial" f={f} dur={dur} dim={0.4} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', ...pop(f, T('s26_0'))}}>
      <span style={{display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#fff', background: NAVY, border: `8px solid ${RED}`, borderRadius: 30, padding: '30px 60px'}}><span style={{fontSize: 140, color: RED}}>C</span><br />誰も働かなくなる</span>
    </div>
    <Question f={f} at={T('s26_2')} top={720} size={70}>実は、これを確かめた国がある</Question>
  </>
);
const S27: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="snow_town" f={f} dur={dur} dim={0.3} />
    <Kicker f={f} at={T('s27_0')} text="フィンランド　2017〜2018年" color="#ffffff" />
    {f < T('s27_2') && <Two f={f} at={[T('s27_1'), T('s27_1', 2)]} top={240}
      left={<><Small>仕事のない人 約17万5,000人から</Small><Big2 size={90}>くじで2,000人</Big2><Small>およそ88人に1人</Small></>}
      right={<><Small>毎月</Small><Big2 size={110} color="#3d6fb6">560ユーロ</Big2><Small>働いても減らない</Small></>} />}
    {f >= T('s27_2') && <Two f={f} at={[T('s27_2', 1), T('s27_3')]} top={240}
      left={<><Small>1年目　働いた日数</Small><Big2 size={90}>差なし</Big2><Small>満足度は高いと答えた</Small></>}
      right={<><Small>2年目　働いた日数</Small><Big2 size={90}>約6日多い</Big2><Small>ただし同じ年に手当の制度も変わった</Small></>} />}
  </>
);
const S28: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="lottery" f={f} dur={dur} />
    {f < T('s28_2') && <Question f={f} at={T('s28_1')} top={300} size={92}>宝くじで大金。会社を辞めますか？</Question>}
    {f >= T('s28_2') && f < T('s28_4') && <Two f={f} at={[T('s28_2'), T('s28_3')]} top={240}
      left={<><Small>スウェーデンの当選者</Small><Big2 size={96}>約25万人</Big2><Small>の記録</Small></>}
      right={<><Small>働いて得る収入</Small><Big2>少し減った</Big2><Big2 color="#2e8b57">多くは働き続けた</Big2></>} />}
    {f >= T('s28_4') && <Two f={f} at={[T('s28_4', 1), T('s28_4', 2)]} top={260}
      left={<><Small>当選した本人</Small><Big2 size={80} color={RED}>働く量を減らした</Big2></>}
      right={<><Small>その配偶者</Small><Big2 size={80}>減らし方は小さい</Big2></>} />}
  </>
);
const S29: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="snow_town" f={f} dur={dur} dim={0.55} />
    <Two f={f} at={[T('s29_0', 2), T('s29_1')]} top={240}
      left={<><Small>フィンランド・宝くじ</Small><Big2>働けば、働いた分増える</Big2></>}
      right={<><Small>全員同じ給料の世界</Small><Big2 color={RED} size={54}>どれだけ働いても478万円</Big2></>} />
    <Question f={f} at={T('s29_2')} top={640} size={80}>予想C：弱まった。でも、まだ安心できない</Question>
  </>
);
const S30: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="kibbutz" f={f} dur={dur} from={1.0} to={1.12} />
    <Kicker f={f} at={T('s30_0')} text="冒頭の約束" />
    <Head f={f} at={T('s30_1')} top={250} size={130}>イスラエルの「キブツ」</Head>
    <Chips f={f} top={480} items={[{t: '働いて得たものを全員で平等に分ける', at: T('s30_1', 1)}, {t: '農場も工場も、取り分は同じ', at: T('s30_1', 3)}]} />
  </>
);
const S31: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="kibbutz_leave" f={f} dur={dur} />
    <Kicker f={f} at={T('s31_0')} text="1980年代の終わり　財政の危機" color="#ffb3ae" />
    {f < T('s31_3') && <Two f={f} at={[T('s31_1', 2), T('s31_2')]} top={250}
      left={<><Small>出ていきやすかった人</Small><Big2 color={RED}>仕事の力が高い人</Big2><Small>外なら、もっと稼げる</Small></>}
      right={<><Small>出ていく人が少なかった</Small><Big2 color="#2e8b57">財産が多いキブツ</Big2><Small>出ていくと損になる</Small></>} />}
    {f >= T('s31_3') && f < T('s31_4') && <Question f={f} at={T('s31_3', 1)} top={300} size={80}>いちばん腕のいい職人なら、残りますか？</Question>}
    {f >= T('s31_4') && <Question f={f} at={T('s31_4')} top={300} size={76}>平等の考えが強いキブツほど、長く続いた</Question>}
  </>
);
const S32: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="school" f={f} dur={dur} />
    <Kicker f={f} at={T('s32_0', 1)} text="キブツの子どもたち" />
    <Head f={f} at={T('s32_1', 4)} top={260} size={74}>早く「仕事に応じた給料」に変えたキブツの子ほど</Head>
    <Chips f={f} top={440} items={[{t: '高校でよく勉強した', at: T('s32_1', 5), color: '#9fe3b8'}, {t: '大学などに進む割合も高い', at: T('s32_1', 6), color: '#9fe3b8'}, {t: '親の学歴が低い家ほど差が大きい', at: T('s32_1', 7)}]} />
    <Question f={f} at={T('s32_2', 1)} top={660} size={70}>給料のルールは、子どもの将来まで動かした</Question>
  </>
);
const S33: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="kibbutz" f={f} dur={dur} dim={0.45} />
    <Two f={f} at={[T('s33_0'), T('s33_1')]} top={240}
      left={<><Small>キブツ</Small><Big2>嫌なら、外に出られた</Big2></>}
      right={<><Small>日本全国</Small><Big2 color={RED}>国の中に「外」はない</Big2><Small>出ていく先は海外か、待遇のいい職場</Small></>} />
    <Question f={f} at={T('s33_2', 3)} top={660} size={70}>それでも、本当に起きたこと</Question>
  </>
);
const S34: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="factory" f={f} dur={dur} />
    <Kicker f={f} at={T('s34_0')} text="逆の実験　アメリカ・セーフライト" />
    {f < T('s34_3') && <Two f={f} at={[T('s34_1', 1), T('s34_1', 2)]} top={260}
      left={<><Small>前</Small><Big2>時給</Big2></>}
      right={<><Small>後</Small><Big2 color="#2e8b57">取り付けた枚数で</Big2></>} />}
    {f >= T('s34_2') && f < T('s34_3') && <Question f={f} at={T('s34_2', 1)} top={620} size={70}>あなたなら、1日に何枚？</Question>}
    {f >= T('s34_3') && (
      <div style={{position: 'absolute', left: 360, right: 360, top: 250, ...pop(f, T('s34_3'))}}>
        <Card style={{textAlign: 'center'}}>
          <Small>一人あたりの仕事の量</Small>
          <Big2 size={180} color="#2e8b57">+{Math.round(count(f, T('s34_3') + 6, 0, 44, 30))}%</Big2>
          <div style={{opacity: appear(f, T('s34_3', 2), 10), fontSize: 46}}>増えた分の、およそ半分は給料に</div>
        </Card>
      </div>
    )}
  </>
);
const S35: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="factory" f={f} dur={dur} dim={0.5} />
    <Two f={f} at={[T('s35_1'), T('s35_1') + 10]} top={240}
      left={<><Small>キブツ</Small><Big2>平等にしたら</Big2><Big2 color={RED}>人が動いた</Big2></>}
      right={<><Small>セーフライト</Small><Big2>差をつけたら</Big2><Big2 color="#2e8b57">仕事が増えた</Big2></>} />
    <Question f={f} at={T('s35_1', 2)} top={640} size={70}>給料の決め方で、働き方は変わる</Question>
  </>
);
const S36: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="office" f={f} dur={dur} dim={0.4} />
    <Kicker f={f} at={T('s36_0')} text="日本にもある「同じ」のルール" />
    {f < T('s36_2') && <Two f={f} at={[T('s36_1'), T('s36_1', 1)]} top={250}
      left={<><Small>2020年4月</Small><Big2>大企業で開始</Big2></>}
      right={<><Small>2021年4月</Small><Big2>中小企業で開始</Big2></>} />}
    {f < T('s36_2') && <Chips f={f} top={600} items={[{t: '同一労働同一賃金', at: T('s36_1', 2), color: GOLD}, {t: '理由のない差はダメ', at: T('s36_1', 4)}]} />}
    {f >= T('s36_2') && f < T('s36_3') && <Question f={f} at={T('s36_2')} top={320} size={80}>隣の人との給料の差。理由を説明できますか？</Question>}
    {f >= T('s36_3') && <Question f={f} at={T('s36_3', 3)} top={320} size={84}>差をなくすのではなく、差に「理由」を</Question>}
  </>
);
const S37: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="govt" f={f} dur={dur} />
    <Kicker f={f} at={T('s37_0', 1)} text="国家公務員の給料の決まり方" />
    <Chips f={f} top={260} items={[{t: '人事院が民間の給料を調べる', at: T('s37_1')}, {t: '役職・地域・学歴・年齢をそろえて比べる', at: T('s37_1', 2)}, {t: '差を埋めるように勧告', at: T('s37_1', 3)}]} />
    {f > T('s37_1', 4) && (
      <div style={{position: 'absolute', left: 420, right: 420, top: 500, ...pop(f, T('s37_1', 4))}}>
        <Card style={{textAlign: 'center'}}><Small>2024年の勧告　民間との差</Small><Big2 size={86}>月1万1,183円（2.76%）</Big2></Card>
      </div>
    )}
  </>
);
const S38: React.FC<SceneProps> = ({f, dur, T}) => {
  const collapse = ease((f - T('s38_0', 1)) / 30);
  return (
    <>
      <Bg id="govt" f={f} dur={dur} dim={0.5} />
      <div style={{position: 'absolute', left: 300, right: 300, top: 230, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 360}}>
        {[279, 333, 478, 545, 587, 735, 832, 1338].map((v, i) => {
          const h = (1 - collapse) * (v / 1338) * 330 + collapse * (478 / 1338) * 330;
          return <div key={v} style={{width: 90, height: h, background: i === 2 ? GOLD : 'rgba(255,255,255,0.85)', borderRadius: 10, opacity: appear(f, i * 3, 10)}} />;
        })}
      </div>
      <Head f={f} at={T('s38_0', 2)} top={630} size={72}>ものさしが、478万円の一本に</Head>
      {f > T('s38_2', 2) && <Chips f={f} top={780} items={[{t: '残るのは、求人の貼り紙と、鳴りやまない電話', at: T('s38_2', 2), color: GOLD}]} />}
    </>
  );
};
const CHAIN = ['給料が同じに', '得と損が分かれる', '値段が揺れる', '仕事を選ぶ理由が変わる', '足りない仕事が揺れる', '子どもの進路へ'];
const S39: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="dawn_aerial" f={f} dur={dur} dim={0.45} />
    {f < T('s39_2') && <div style={{position: 'absolute', left: 120, right: 120, top: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap'}}>
      {CHAIN.map((c, i) => <span key={c} style={{...pop(f, T('s39_1', Math.min(i, 5))), fontFamily: FONT, fontWeight: 900, fontSize: 40, color: NAVY, background: 'rgba(255,255,255,0.92)', padding: '12px 22px', borderRadius: 14}}>{c}{i < CHAIN.length - 1 ? '　→' : ''}</span>)}
    </div>}
    {f >= T('s39_2') && <div style={{position: 'absolute', left: 160, right: 160, top: 260, display: 'flex', gap: 40}}>
      {['A', 'B', 'C'].map((k, i) => <div key={k} style={{flex: 1, ...pop(f, T('s39_2', 1) + i * 8)}}><Card style={{textAlign: 'center'}}><Big2 size={130} color={RED}>{k}</Big2><Small>10年後の未来</Small></Card></div>)}
    </div>}
  </>
);
const Future: React.FC<SceneProps & {bg: string; k: string; title: string; lines: [string, number][]; scene: string}> = ({f, dur, bg, k, title, lines}) => (
  <>
    <Bg id={bg} f={f} dur={dur} />
    <div style={{position: 'absolute', left: 110, top: 96, ...pop(f, 4)}}>
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff', background: RED, padding: '8px 26px', borderRadius: 10}}>未来{k}</span>
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 56, color: '#fff', marginLeft: 22, textShadow: '0 4px 16px rgba(0,0,0,0.8)'}}>{title}</span>
    </div>
    <Chips f={f} top={620} items={lines.map(([t, at]) => ({t, at}))} />
  </>
);
const S40: React.FC<SceneProps> = (p) => <Future {...p} scene="s40" bg="construction_empty" k="A" title="楽な仕事に人が集まる日本" lines={[['道路の工事が終わらない', p.T('s40_1', 1)], ['お祭りの警備が足りない', p.T('s40_1', 2)], ['停電の復旧が遅い', p.T('s40_1', 3)], ['「作業員募集」だけが増える', p.T('s40_3', 1)]]} />;
const S41: React.FC<SceneProps> = (p) => <Future {...p} scene="s41" bg="shops_evening" k="B" title="みんなが少しずつ働かない日本" lines={[['残業しても給料は同じ', p.T('s41_0', 1)], ['働いた分の上乗せがない', p.T('s41_1', 3)], ['「今日はここまでです」', p.T('s41_2', 1)]]} />;
const S42: React.FC<SceneProps> = (p) => <Future {...p} scene="s42" bg="job_ads" k="C" title="給料以外で奪い合う日本" lines={[['休みの多さ', p.T('s42_0', 2)], ['働く時間の短さ', p.T('s42_0', 3)], ['職場の雰囲気', p.T('s42_0', 4)], ['差は、形を変えて残る', p.T('s42_1', 6)]]} />;
const S43: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="school" f={f} dur={dur} dim={0.4} />
    {f < T('s43_2') && <Chips f={f} top={220} items={[{t: '22歳の子：資格の学校へ', at: T('s43_1', 1), color: '#9fe3b8'}, {t: '55歳の父：きつい仕事を続ける理由が弱まる', at: T('s43_1', 3), color: '#ffb3ae'}, {t: '技術者：昼の仕事へ', at: T('s43_1', 5)}, {t: 'パートの人：時間を増やすも減らすも', at: T('s43_1', 6), color: GOLD}]} />}
    {f >= T('s43_2') && f < T('s43_3') && <Question f={f} at={T('s43_2')} top={300} size={74}>医者を目指す高校生。その先の給料も、478万円</Question>}
    {f >= T('s43_3') && <Question f={f} at={T('s43_3')} top={300} size={80}>10年後のあなたは、どの未来の住人？</Question>}
  </>
);
const S44: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="kibbutz" f={f} dur={dur} from={1.12} to={1.0} />
    <Kicker f={f} at={T('s44_0')} text="冒頭の約束　意外な答え" />
    <Head f={f} at={T('s44_1')} top={240} size={78}>1990年代の終わり　平等に分けるのをやめるキブツ</Head>
    <Chips f={f} top={430} items={[{t: '仕事に応じた給料へ', at: T('s44_1', 2), color: GOLD}, {t: '前から「ただ乗り」への不満', at: T('s44_2', 1)}]} />
    <Question f={f} at={T('s44_3', 2)} top={600} size={76}>でも、「安全網」は残した</Question>
  </>
);
const S45: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="sunrise_end" f={f} dur={dur} dim={0.4} />
    <Two f={f} at={[T('s45_0'), T('s45_0', 1)]} top={220}
      left={<><Big2>働きに応じて差をつける</Big2></>}
      right={<><Big2>弱い人を支える仕組み</Big2></>} />
    <Question f={f} at={T('s45_1', 2)} top={560} size={80}>それは、今の日本に近い形</Question>
  </>
);
const VERD: [string, string, string, string][] = [['A', 'ほとんど何も変わらない', '—', '#ffffff'], ['B', 'きつい仕事から人が消えていく', '手がかり　多数', GOLD], ['C', '誰も働かなくなる', '弱い', RED]];
const S46: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="sunrise_end" f={f} dur={dur} dim={0.45} />
    {f < T('s46_3') && <Chips f={f} top={240} items={[{t: '二度見した居酒屋の人', at: T('s46_1')}, {t: '固まった電力会社の人', at: T('s46_1', 1)}, {t: '財布が重くなった夫婦', at: T('s46_1', 2)}, {t: '3分の1になった医師', at: T('s46_1', 3)}]} />}
    {f >= T('s46_3') && f < T('s46_8') && <div style={{position: 'absolute', left: 140, right: 140, top: 220, display: 'flex', gap: 36}}>
      {VERD.map(([k, t, v, c], i) => <div key={k} style={{flex: 1, ...pop(f, T('s46_4') + i * 6)}}><Card style={{textAlign: 'center', minHeight: 330}}><Big2 size={110} color={c === '#ffffff' ? NAVY : c}>{k}</Big2><Small>{t}</Small><div style={{marginTop: 14, opacity: appear(f, k === 'C' ? T('s46_5') : k === 'B' ? T('s46_6', 2) : T('s46_7'), 10)}}><span style={{fontSize: 44, background: c === '#ffffff' ? '#e5e8ee' : c, color: c === RED ? '#fff' : NAVY, padding: '4px 22px', borderRadius: 12}}>{v}</span></div></Card></div>)}
    </div>}
    {f >= T('s46_7') && f < T('s46_8') && <Chips f={f} top={680} items={[{t: '全員同じをやった人たちは、最後に全員同じをやめた', at: T('s46_7'), color: GOLD}]} />}
    {f >= T('s46_8') && <Question f={f} at={T('s46_8', 2)} top={340} size={84}>決めるのは、明日の朝の一人ひとりの選択</Question>}
  </>
);
const S47: React.FC<SceneProps> = ({f, dur, T}) => (
  <>
    <Bg id="sunrise_end" f={f} dur={dur} from={1.1} to={1.0} dim={0.35} />
    {f < T('s47_2') && <Question f={f} at={T('s47_0')} top={300} size={100}>明日も、今の仕事に行きますか？</Question>}
    {f >= T('s47_1') && f < T('s47_2') && <Question f={f} at={T('s47_1')} top={520} size={70}>台風の夜の電話に、出ますか？</Question>}
    {f >= T('s47_2') && <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...pop(f, T('s47_2'))}}>
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 22, background: '#fff', color: NAVY, borderRadius: 60, padding: '18px 50px', fontFamily: FONT, fontWeight: 900, fontSize: 60}}>コメント欄で　<span style={{color: RED}}>A・B・C</span>　を選び直す</span>
    </div>}
    {f >= T('s47_3') && <Head f={f} at={T('s47_3')} top={520} size={80}>次の回も、ルールを1つだけ変えます</Head>}
    <AbsoluteFill style={{background: NAVY, opacity: interpolate(f, [dur - 20, dur], [0, 0], clamp)}} />
  </>
);

export const SCENES_MAIN: Record<string, React.FC<SceneProps>> = {
  s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08, s09: S09, s10: S10, s11: S11, s12: S12, s13: S13, s14: S14, s15: S15,
  s16: S16, s17: S17, s18: S18, s19: S19, s20: S20, s21: S21, s22: S22, s23: S23, s24: S24, s25: S25, s26: S26, s27: S27, s28: S28,
  s29: S29, s30: S30, s31: S31, s32: S32, s33: S33, s34: S34, s35: S35, s36: S36, s37: S37, s38: S38, s39: S39, s40: S40, s41: S41,
  s42: S42, s43: S43, s44: S44, s45: S45, s46: S46, s47: S47,
};
