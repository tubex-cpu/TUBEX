// 第0章 明日の朝 (S01–S03) v2: 3D miniature street (tilt-shift), cinematic camera
import {ThreeCanvas} from '@remotion/three';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {AbsoluteFill, interpolate} from 'remotion';
import * as THREE from 'three';
import {C, FONT} from '../theme';
import {CameraRig, Key, camAt, lerp, sm} from '../three/common';
import {Card3D, City, Dust, Envelope3D, Figure, GOLD, Imprint, Lights, NAVY, QMark, Role, Seal3D, Shockwave, Sign, Sky, Street} from '../three/World';
import {Big, Chip, SceneProps, appear, clamp, ease, slam, useFont} from './kit';

const FPS = 30;
const GLYPHS = '改同じ額いつもの職場別？ABCほとんど何も変わらないきつい仕事から人が消えていく誰働かなくなる←→ 0123456789';
const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, antialias: true, preserveDrawingBuffer: true};

const RW = 1440, RH = 810;
const Canvas3D: React.FC<{children: React.ReactNode; focus: number; blur?: number}> = ({children, focus, blur = 3.2}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: RW, height: RH, transform: `scale(${1920 / RW})`, transformOrigin: '0 0'}}>
    <ThreeCanvas width={RW} height={RH} gl={GL} shadows={{type: THREE.PCFShadowMap}} style={{position: 'absolute', inset: 0}}>
      {children}
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={focus} focalLength={0.035} bokehScale={blur} height={540} />
        <Bloom intensity={0.5} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
        <Vignette offset={0.25} darkness={0.62} />
      </EffectComposer>
    </ThreeCanvas>
  </div>
);
// screen position (1920x1080) of a world point for a camera
const project = (p: number[], cam: {pos: number[]; target: number[]; fov?: number}) => {
  const c = new THREE.PerspectiveCamera(cam.fov ?? 35, 1920 / 1080, 0.1, 600);
  c.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
  c.lookAt(cam.target[0], cam.target[1], cam.target[2]);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(c);
  return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080];
};

const PEOPLE: {role: Role; name: string; x: number}[] = [
  {role: 'doctor', name: '医者', x: -6}, {role: 'clerk', name: 'コンビニの店員', x: -3}, {role: 'builder', name: '工事現場で働く人', x: 0}, {role: 'manager', name: '会社の部長', x: 3}, {role: 'you', name: 'あなた', x: 6},
];
const Z = 3.2; // the people stand on the crosswalk, in front of the seal imprint

// S01: aerial dawn → the seal comes down → street level, five people → the fork → who comes?
const S01: React.FC<SceneProps> = ({f, T}) => {
  const ok = useFont(GLYPHS + PEOPLE.map((p) => p.name).join(''));
  const t = f / FPS;
  const sec = (fr: number) => fr / FPS;
  const c0 = sec(T('s01_1')), c1 = sec(T('s01_1', 1)), m0 = sec(T('s01_2')), m1 = sec(T('s01_2', 1)), m2 = sec(T('s01_2', 2)), q0 = sec(T('s01_3')), q1 = sec(T('s01_3', 1));
  const impact = 3.55; // the seal hits the road on 「全員同じ」
  const keys: Key[] = [
    {t: 0, pos: [46, 52, 70], target: [0, 9, 0], fov: 30},
    {t: impact - 0.2, pos: [30, 36, 48], target: [0, 8, 0], fov: 30},
    {t: impact + 1.2, pos: [24, 28, 40], target: [0, 6, 0], fov: 30},
    {t: c0 + 0.1, pos: [2, 4.2, 20], target: [0, 1.6, Z], fov: 32},
    {t: c1 + 2.6, pos: [0, 3.9, 17.5], target: [0, 1.9, Z], fov: 36},
    {t: m0 + 0.8, pos: [7.8, 3.0, 11.5], target: [6.0, 1.8, -6], fov: 36},
    {t: q0 + 0.2, pos: [7.4, 3.2, 12], target: [6.0, 1.9, -6], fov: 36},
    {t: q1 + 0.6, pos: [0, 6.5, 21], target: [0, 1.6, Z - 1], fov: 34},
    {t: q1 + 4, pos: [0, 6.0, 19.5], target: [0, 1.6, Z - 1], fov: 34},
  ];
  const cam = camAt(keys, t);
  const sealY = t < impact - 0.75 ? 60 : t < impact ? lerp(60, 0, sm((t - (impact - 0.75)) / 0.75) ** 2) : t < impact + 0.7 ? 0 : lerp(0, 70, sm((t - impact - 0.7) / 1.0));
  const shake = Math.max(0, 1 - (t - impact) / 0.6) * (t >= impact ? 0.55 : 0);
  const morning = sm((t - m0) / 3);
  const ask = sm((t - q1) / 0.6);
  const fork = sm((t - m0 + 0.3) / 0.8) * (1 - ask);
  const focus = t < c0 ? 0.06 : 0.018;
  return (
    <AbsoluteFill style={{background: NAVY}}>
      {ok && (
        <Canvas3D focus={focus} blur={t < c0 ? 2.2 : 3.4}>
          <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} shake={shake} t={t} />
          <Sky k={0.15 + morning * 0.85} />
          <fog attach="fog" args={[new THREE.Color('#1c2a44').lerp(new THREE.Color('#e7b48f'), morning), 40, 190]} />
          <Lights k={0.1 + morning * 0.9} spot={t > c1 ? [6, 1.2, Z] : null} spotI={t > c1 ? sm((t - c1 - 1.5) / 1) * (1 - morning * 0.6) + ask * 0.8 : 0} />
          <City lit={0.5} />
          <Street />
          <Imprint a={t < impact ? 0 : 1} />
          <Shockwave u={(t - impact) / 0.9} />
          <Dust u={(t - impact) / 1.4} />
          {sealY < 69 && <Seal3D y={sealY} />}
          {PEOPLE.map((p, i) => {
            const at = i < 3 ? c0 + 0.2 + i * 0.667 : c1 + 0.13 + (i - 3) * 0.667;
            const pop = t < at ? 0 : 1 + Math.sin(Math.min(1, (t - at) / 0.35) * Math.PI) * 0.18 - (1 - Math.min(1, (t - at) / 0.12)) * 1;
            const isYou = p.role === 'you';
            const ghost = isYou ? 0 : ask;
            const hide = isYou ? 0 : fork; // during the fork the others step out of the shot
            const env = sm((t - (c1 + 2.2) - i * 0.08) / 0.4) * (1 - (isYou ? 0 : fork));
            return (
              <group key={p.role}>
                {pop > 0 && <Figure role={p.role} pos={[p.x, -hide * 3, Z]} s={Math.max(0.001, pop) * 1.15} ghost={ghost} />}
                <Envelope3D pos={[p.x, 3.75, Z]} s={env * (1 - ask * (isYou ? 0 : 1))} spin={t * 1.6 + i} />
                {!isYou && <QMark pos={[p.x, 3.7, Z]} s={ask * 1.4} />}
              </group>
            );
          })}
          {/* the fork in front of you */}
          {fork > 0.01 && <>
            <Sign pos={[2.4, -3 + fork * 3, -3]} text="いつもの職場" color="#ffffff" fg={NAVY} glow={t > m1 && t < m2 ? 1 : 0.2} rotY={0.18} arrow="left" />
            <Sign pos={[9.8, -3 + fork * 3, -3]} text="別の職場" color={GOLD} fg={NAVY} glow={t > m2 ? 1 : 0.2} rotY={-0.18} arrow="right" />
          </>}
        </Canvas3D>
      )}
      {/* headline over the aerial shot */}
      {t < c0 + 0.3 && (
        <AbsoluteFill style={{opacity: 1 - sm((t - c0 + 0.2) / 0.5)}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
            <div style={{opacity: appear(f, T('s01_0') - 2, 10), transform: `translateY(${(1 - appear(f, T('s01_0') - 2, 10)) * 30}px)`}}>
              <Big size={88}>明日から、日本の給料は</Big>
            </div>
            <div style={{marginTop: 10, transform: `scale(${slam(f, Math.round(impact * FPS)).s})`, opacity: slam(f, Math.round(impact * FPS)).o}}>
              <Big size={190} color={C.red} style={{WebkitTextStroke: '6px #ffffff'}}>全員同じ</Big>
            </div>
          </div>
        </AbsoluteFill>
      )}
      {/* names under the people (street shot) */}
      {t > c0 && t < m0 + 0.6 && (
        <AbsoluteFill style={{opacity: 1 - sm((t - m0) / 0.5)}}>
          {PEOPLE.map((p, i) => {
            const at = Math.round((i < 3 ? c0 + 0.2 + i * 0.667 : c1 + 0.13 + (i - 3) * 0.667) * FPS);
            const [sx, sy] = project([p.x, -0.15, Z], cam);
            return (
              <div key={p.role} style={{position: 'absolute', left: sx, top: Math.min(800, sy + 6), transform: 'translateX(-50%)', opacity: appear(f, at + 4, 8), fontFamily: FONT, fontWeight: 900, fontSize: 36, color: p.role === 'you' ? C.gold : C.white, textShadow: '0 3px 12px rgba(0,0,0,0.9)', whiteSpace: 'nowrap'}}>{p.name}</div>
            );
          })}
        </AbsoluteFill>
      )}
      {/* who comes? */}
      {t > q1 - 0.2 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: ask, transform: `scale(${0.92 + 0.08 * ask})`}}>
          <Big size={124}>全員同じ給料　<span style={{color: C.red}}>誰が働く？</span></Big>
        </div>
      )}
    </AbsoluteFill>
  );
};

// S02: three prediction cards floating above the street (city blurred behind)
const CARDS: {k: string; lines: string[]; color: string}[] = [
  {k: 'A', lines: ['ほとんど', '何も変わらない'], color: '#ffffff'},
  {k: 'B', lines: ['きつい仕事から', '人が消えていく'], color: GOLD},
  {k: 'C', lines: ['誰も', '働かなくなる'], color: C.red},
];
const S02: React.FC<SceneProps> = ({f, T}) => {
  const ok = useFont(GLYPHS);
  const t = f / FPS;
  const ats = [T('s02_1'), T('s02_2'), T('s02_3')].map((x) => x / FPS);
  const t4 = T('s02_4') / FPS;
  const lift = sm((t - t4) / 0.8);
  const orbit = Math.sin(t * 0.12) * 0.9;
  return (
    <AbsoluteFill style={{background: NAVY}}>
      {ok && (
        <Canvas3D focus={0.012} blur={5}>
          <CameraRig pos={[orbit, 8.8 - lift * 0.6, 22.5]} target={[0, 7.4 + lift * 0.9, 6]} fov={36} />
          <Sky k={1} />
          <fog attach="fog" args={['#e7b48f', 30, 170]} />
          <Lights k={1} />
          <City lit={0.15} glow={0.12} />
          <Street />
          <Imprint a={1} />
          {CARDS.map((c, i) => {
            const u = sm((t - (ats[i] - 0.25)) / 0.6);
            if (u <= 0) return null;
            const flip = (1 - u) * Math.PI;
            const bob = Math.sin(t * 1.3 + i * 1.7) * 0.12;
            return <Card3D key={c.k} pos={[(i - 1) * 5.6, 7.4 + bob + lift * 1.2, 6 + (1 - u) * 3]} rotY={flip + (i - 1) * -0.08} letter={c.k} lines={c.lines} color={c.color} s={1 - lift * 0.18} />;
          })}
        </Canvas3D>
      )}
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: appear(f, 6, 12) * (1 - lift)}}>
        <Big size={84}>あなたの<span style={{color: C.gold}}>予想</span>は？</Big>
      </div>
      {t > t4 - 0.1 && (
        <div style={{position: 'absolute', left: 960, top: 790, transform: `translate(-50%, -50%) scale(${appear(f, T('s02_4'), 12)})`, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(255,255,255,0.95)', color: NAVY, borderRadius: 64, padding: '16px 46px', fontFamily: FONT, fontWeight: 900, fontSize: 48, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,0.4)'}}>
          <svg width="52" height="46" viewBox="0 0 52 46"><path d="M6 4h40a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H22l-10 9v-9H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill={NAVY} /></svg>
          コメント欄に <span style={{color: C.red}}>A・B・C</span>
          <span style={{opacity: appear(f, T('s02_4', 2), 10), color: '#5b6577', fontSize: 38}}>／ 最後にもう一度</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// S03: how to read the labels — glass panels over the blurred street
const LEGEND: {k: string; d: string; icon: string}[] = [
  {k: '事実', d: '国の統計・実際に起きた出来事の研究', icon: 'M8 40V24h8v16zM22 40V12h8v28zM36 40V18h8v22z'},
  {k: '前提', d: 'この動画で置いた条件', icon: 'M14 6v36M14 8h24l-6 7 6 7H14'},
  {k: '推論', d: '事実から考えられる道', icon: 'M24 42V24M24 24L10 10M24 24l14-14M6 14V6h8M42 14V6h-8'},
];
const S03: React.FC<SceneProps> = ({f, T}) => {
  const ok = useFont(GLYPHS);
  const t = f / FPS;
  const tFact = T('s03_1') / FPS, tInf = T('s03_1', 2) / FPS, tUndec = T('s03_1', 3);
  const demo = ease((f - T('s03_0', 3)) / 16);
  return (
    <AbsoluteFill style={{background: NAVY}}>
      {ok && (
        <Canvas3D focus={0.002} blur={7}>
          <CameraRig pos={[-10 + t * 0.25, 5, 22]} target={[-10 + t * 0.25, 3, 0]} fov={40} />
          <Sky k={1} />
          <fog attach="fog" args={['#e7b48f', 30, 170]} />
          <Lights k={1} />
          <City lit={0.15} glow={0.12} />
          <Street />
        </Canvas3D>
      )}
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(15,27,45,0.88) 0%, rgba(15,27,45,0.62) 55%, rgba(15,27,45,0.35) 100%)'}} />
      {LEGEND.map(({k, d, icon}, i) => {
        const at = i === 0 ? T('s03_0') : i === 1 ? T('s03_0', 1) : T('s03_0', 2);
        const hi = (k === '事実' && t >= tFact && t < tInf) || (k === '推論' && t >= tInf);
        const a = appear(f, at - 3, 12);
        return (
          <div key={k} style={{position: 'absolute', left: 120, top: 150 + i * 200, opacity: a, transform: `translateX(${(1 - a) * -60}px) scale(${hi ? 1.05 : 1})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 30,
            background: hi ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)', border: `2px solid ${hi ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 26, padding: '22px 40px 22px 26px', backdropFilter: 'blur(6px)', width: 1000, boxSizing: 'border-box'}}>
            <svg width="70" height="70" viewBox="0 0 48 48" style={{flexShrink: 0}}><path d={icon} stroke={C.white} strokeWidth="4" fill={k === '事実' ? C.white : 'none'} strokeLinecap="round" strokeLinejoin="round" /></svg>
            <Chip k={k} size={58} />
            <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 42, whiteSpace: 'nowrap', color: hi ? C.white : 'rgba(255,255,255,0.8)'}}>{d}</span>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 1530, top: 300, transform: `translate(-50%, -50%) scale(${0.75 + 0.1 * demo})`, opacity: demo}}>
        <div style={{width: 560, height: 315, border: '5px solid rgba(255,255,255,0.75)', borderRadius: 18, background: 'rgba(22,38,63,0.85)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
          <div style={{position: 'absolute', left: 16, top: 14}}><Chip k="事実" size={30} /></div>
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 28, height: 18, background: 'rgba(255,255,255,0.18)', borderRadius: 9}} />
          <div style={{position: 'absolute', left: -10, top: -64, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.gold, whiteSpace: 'nowrap'}}>画面の左上 ↙</div>
        </div>
      </div>
      {f >= tUndec - 4 && (
        <div style={{position: 'absolute', left: 1530, top: 640, transform: `translate(-50%, -50%) rotate(-6deg) scale(${slam(f, tUndec).s}) translateX(${slam(f, tUndec).shake}px)`, opacity: slam(f, tUndec).o}}>
          <div style={{border: `10px solid ${C.red}`, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 96, padding: '8px 44px', borderRadius: 18, background: 'rgba(255,255,255,0.92)', whiteSpace: 'nowrap'}}>決まらない</div>
          <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.white, marginTop: 16, whiteSpace: 'nowrap', textShadow: '0 3px 12px rgba(0,0,0,0.8)'}}>ときは、そう言い切る</div>
        </div>
      )}
      <AbsoluteFill style={{pointerEvents: 'none', opacity: interpolate(f, [0, 1], [0, 0], clamp)}} />
    </AbsoluteFill>
  );
};

// S03 (how to read the labels) was removed from the script (v0.4, owner comment 2026-11-14); kept here unused
void S03;
export const SCENES_OPEN3D: Record<string, React.FC<SceneProps>> = {s01: S01, s02: S02};
