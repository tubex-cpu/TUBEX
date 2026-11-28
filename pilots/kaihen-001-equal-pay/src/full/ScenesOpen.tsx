// 第0章 明日の朝 (S01–S03): the opening check cut
import {AbsoluteFill, interpolate} from 'remotion';
import {C, FONT} from '../theme';
import {Big, Chip, Envelope, Person, Role, Room, SceneProps, Seal, appear, clamp, ease, slam} from './kit';

const PEOPLE: {role: Role; name: string}[] = [
  {role: 'doctor', name: '医者'}, {role: 'clerk', name: 'コンビニの店員'}, {role: 'builder', name: '工事現場'}, {role: 'manager', name: '会社の部長'}, {role: 'you', name: 'あなた'},
];

// the rule sheet (an official-looking paper with one rule) + the seal
const RuleSheet: React.FC<{f: number; stampAt: number; text: React.ReactNode; x?: number; y?: number; scale?: number}> = ({f, stampAt, text, x = 960, y = 400, scale = 1}) => {
  const a = appear(f, 0, 16);
  const st = slam(f, stampAt);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - a) * 60}px) rotate(-1.5deg) scale(${scale})`, opacity: a}}>
      <div style={{width: 1060, height: 560, background: C.paper, borderRadius: 10, boxShadow: '0 30px 80px rgba(0,0,0,0.55)', padding: '54px 70px', boxSizing: 'border-box', color: C.navy, fontFamily: FONT, position: 'relative'}}>
        <div style={{fontSize: 34, fontWeight: 900, letterSpacing: '0.3em', color: '#5b6577'}}>新しいルール</div>
        <div style={{height: 4, background: C.navy, margin: '18px 0 34px', width: 260}} />
        {[0.9, 0.7, 0.8].map((w, i) => <div key={i} style={{height: 16, width: `${w * 100}%`, background: 'rgba(15,27,45,0.12)', borderRadius: 8, marginBottom: 16}} />)}
        <div style={{fontSize: 92, fontWeight: 900, marginTop: 26, letterSpacing: '0.02em'}}>{text}</div>
        <div style={{position: 'absolute', right: 70, bottom: 50, transform: `scale(${st.s}) translate(${st.shake}px, ${-st.shake * 0.5}px) rotate(-8deg)`, opacity: st.o}}>
          <Seal size={200} />
        </div>
      </div>
    </div>
  );
};

const S01: React.FC<SceneProps> = ({f, T}) => {
  const t1 = T('s01_1'), t1b = T('s01_1', 1), t2 = T('s01_2'), t3 = T('s01_3'), t3b = T('s01_3', 1);
  void t3b;
  // part 1: the sheet; part 2: five people; part 3: morning, two ways; part 4: who comes?
  const sheetOut = ease((f - (t1 - 10)) / 14);
  const morning = ease((f - t2) / 30);
  const ask = ease((f - T('s01_3', 1)) / 14);
  return (
    <Room warm={morning * (1 - ask * 0.6)}>
      {sheetOut < 1 && (
        <AbsoluteFill style={{opacity: 1 - sheetOut, transform: `scale(${1 + sheetOut * 0.08})`}}>
          <RuleSheet f={f} stampAt={10} text={<>明日から 給料は<br /><span style={{color: C.red}}>全員同じ</span></>} y={420} />
        </AbsoluteFill>
      )}
      {f >= t1 - 10 && (
        <AbsoluteFill>
          {PEOPLE.map((p, i) => {
            const at = i < 3 ? t1 + 6 + i * 20 : t1b + 4 + (i - 3) * 20;
            const a = appear(f, at, 10);
            const x = 240 + i * 360;
            const center = p.role === 'you';
            const morningX = center ? interpolate(morning, [0, 1], [x, 960]) : x;
            const others = morning;
            const ghost = ask > 0.5 && !center;
            return (
              <div key={p.role} style={{position: 'absolute', left: morningX, top: 300, transform: `translate(-50%, 0) translateY(${(1 - a) * 40}px)`, opacity: a * (center ? 1 : 1 - others), textAlign: 'center'}}>
                <div style={{position: 'absolute', left: '50%', top: -120, transform: `translateX(-50%) scale(${appear(f, T('s01_1', 1) + 18, 10)})`, opacity: (center || morning < 0.5 ? 1 : 0) * (1 - ask)}}>
                  <Envelope w={150} label="同じ額" />
                </div>
                <Person role={p.role} h={400} ghost={ghost} />
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 38, marginTop: 12, color: center ? C.gold : C.white}}>{p.name}</div>
              </div>
            );
          })}
          {/* morning: two ways */}
          {morning > 0 && ask < 1 && (
            <AbsoluteFill style={{opacity: morning * (1 - ask)}}>
              {[['いつもの職場', -1], ['別の職場', 1]].map(([label, side]) => (
                <div key={label as string} style={{position: 'absolute', top: 470, left: 960 + (side as number) * 420, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: appear(f, (side as number) < 0 ? T('s01_2', 1) : T('s01_2', 2), 10)}}>
                  <div style={{fontSize: 90, color: (side as number) < 0 ? C.white : C.gold, fontWeight: 900}}>{(side as number) < 0 ? '←' : '→'}</div>
                  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, background: (side as number) < 0 ? 'rgba(255,255,255,0.12)' : 'rgba(242,193,78,0.18)', padding: '14px 28px', borderRadius: 14}}>{label}</div>
                </div>
              ))}
            </AbsoluteFill>
          )}
          {/* who comes? */}
          {f >= t3 && (
            <AbsoluteFill style={{opacity: ask}}>
              {PEOPLE.filter((p) => p.role !== 'you').map((p, i) => (
                <div key={p.role} style={{position: 'absolute', left: [300, 610, 1310, 1620][i], top: 330, transform: 'translateX(-50%)', opacity: 0.9}}>
                  <Person role={p.role} h={400} ghost />
                  <div style={{position: 'absolute', left: '50%', top: 90, transform: 'translateX(-50%)', fontFamily: FONT, fontWeight: 900, fontSize: 130, color: C.red}}>？</div>
                </div>
              ))}
              <div style={{position: 'absolute', left: 0, right: 0, top: 80, textAlign: 'center', transform: `scale(${0.9 + 0.1 * ask})`}}>
                <Big size={120}>全員同じ給料 <span style={{color: C.red}}>誰が働く？</span></Big>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      )}
    </Room>
  );
};

const CARDS: [string, string, string][] = [
  ['A', 'ほとんど\n何も変わらない', C.white],
  ['B', 'きつい仕事から\n人が消えていく', C.gold],
  ['C', '誰も\n働かなくなる', C.red],
];
const S02: React.FC<SceneProps> = ({f, T}) => {
  const ats = [T('s02_1'), T('s02_2'), T('s02_3')];
  const t4 = T('s02_4');
  const lift = ease((f - t4) / 18);
  return (
    <Room>
      <div style={{position: 'absolute', left: 0, right: 0, top: 90 - lift * 20, textAlign: 'center', opacity: appear(f, 0, 12)}}>
        <Big size={84}>あなたの<span style={{color: C.gold}}>予想</span>は？</Big>
      </div>
      {CARDS.map(([k, label, col], i) => {
        const a = appear(f, ats[i] - 4, 12);
        const flip = interpolate(f - (ats[i] - 4), [0, 12], [90, 0], clamp);
        return (
          <div key={k} style={{position: 'absolute', left: 400 + i * 560, top: 520 - lift * 40, transform: `translate(-50%, -50%) perspective(1200px) rotateY(${flip}deg) scale(${1 - lift * 0.12})`, opacity: a}}>
            <div style={{width: 470, height: 440, background: C.navy2, border: `6px solid ${col}`, borderRadius: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.5)'}}>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 150, color: col, lineHeight: 1}}>{k}</div>
              <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 50, color: C.white, textAlign: 'center', whiteSpace: 'pre-line', marginTop: 20, lineHeight: 1.3}}>{label}</div>
            </div>
          </div>
        );
      })}
      {/* comment box */}
      {f >= t4 && (
        <div style={{position: 'absolute', left: 960, top: 820, transform: `translate(-50%, -50%) scale(${appear(f, t4, 12)})`, display: 'flex', alignItems: 'center', gap: 22, background: C.white, color: C.navy, borderRadius: 60, padding: '14px 40px', fontFamily: FONT, fontWeight: 900, fontSize: 44}}>
          <span style={{fontSize: 46}}>💬</span> コメント欄に <span style={{color: C.red}}>A・B・C</span>
          <span style={{opacity: appear(f, T('s02_4', 2), 10), color: '#5b6577', fontSize: 36}}>／ 最後に選び直し</span>
        </div>
      )}
    </Room>
  );
};

const LEGEND: [string, string][] = [['事実', '国の統計・実際に起きた出来事の研究'], ['前提', 'この動画で置いた条件'], ['推論', '事実から考えられる道']];
const S03: React.FC<SceneProps> = ({f, T}) => {
  const tFact = T('s03_1'), tInf = T('s03_1', 2), tUndec = T('s03_1', 3);
  const demo = ease((f - T('s03_0', 3)) / 16);
  return (
    <Room>
      {/* mini screen with the tag in its top-left corner */}
      <div style={{position: 'absolute', left: 1500, top: 300, transform: `translate(-50%, -50%) scale(${0.7 + 0.15 * demo})`, opacity: demo}}>
        <div style={{width: 640, height: 360, border: '5px solid rgba(255,255,255,0.7)', borderRadius: 18, background: C.navy2, position: 'relative'}}>
          <div style={{position: 'absolute', left: 18, top: 16}}><Chip k="事実" size={30} /></div>
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 30, height: 20, background: 'rgba(255,255,255,0.15)', borderRadius: 10}} />
          <div style={{position: 'absolute', left: -40, top: -50, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.gold}}>↘ ここ</div>
        </div>
      </div>
      {LEGEND.map(([k, d], i) => {
        const at = i === 0 ? T('s03_0') : i === 1 ? T('s03_0', 1) : T('s03_0', 2);
        const hi = (k === '事実' && f >= tFact && f < tInf) || (k === '推論' && f >= tInf);
        const a = appear(f, at, 10);
        return (
          <div key={k} style={{position: 'absolute', left: 140, top: 170 + i * 190, opacity: a, transform: `translateX(${(1 - a) * -40}px) scale(${hi ? 1.06 : 1})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 26}}>
            <Chip k={k} size={64} />
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, maxWidth: 840, color: hi ? C.white : 'rgba(255,255,255,0.75)'}}>{d}</span>
          </div>
        );
      })}
      {/* when it cannot be decided */}
      {f >= tUndec - 4 && (
        <div style={{position: 'absolute', left: 1500, top: 640, transform: `translate(-50%, -50%) rotate(-6deg) scale(${slam(f, tUndec).s})`, opacity: slam(f, tUndec).o}}>
          <div style={{border: `10px solid ${C.red}`, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 92, padding: '10px 40px', borderRadius: 18, whiteSpace: 'nowrap', background: 'rgba(15,27,45,0.6)'}}>決まらない</div>
          <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 38, color: C.white, marginTop: 14, whiteSpace: 'nowrap'}}>ときは、そう言い切る</div>
        </div>
      )}
    </Room>
  );
};

export const SCENES_OPEN: Record<string, React.FC<SceneProps>> = {s01: S01, s02: S02, s03: S03};
