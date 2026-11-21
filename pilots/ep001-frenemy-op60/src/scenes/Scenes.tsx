import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Brain3D} from '../three/Brain3D';
import {Cafe, TABLE_Y} from '../three/Cafe';
import {CameraRig, canvasTexture, ease, lerp, lerp3} from '../three/common';
import {RB} from '../three/Decor';
import type {Expr} from '../three/friendSdf';
import {Mascot} from '../three/Mascot';
import {wobble} from '../three/noise';
import {Apartment, Hall, Street} from '../three/Sets';
import {FONT} from '../theme';
import {Bubble, Tag, Vignette} from '../ui/Overlay';

export const XF = 8;
const useF = () => useCurrentFrame() - XF;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};
const hand = (p: [number, number, number], t: number, a: number): [number, number, number] => [p[0] + wobble(t, 1) * a, p[1] + wobble(t, 2) * a, p[2] + wobble(t, 3) * a];
const blink = (f: number, at: number[]) => (at.some((b) => f >= b && f < b + 4) ? 1 : 0);

const Canvas3D: React.FC<{children: React.ReactNode; exposure?: number; filter?: string}> = ({children, exposure = 1, filter}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{filter}}>
      <ThreeCanvas width={width} height={height} shadows={{type: THREE.PCFSoftShadowMap}} gl={{...GL, toneMappingExposure: exposure}} style={{position: 'absolute', inset: 0}}>
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// S1 (0–8.0s) — lamp comes on; across the table, your close friend smiles at you (POV, re-enactment)
export const S1Cafe: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const on = seg(f, 6, 14);
  const cam = hand(lerp3([0.02, 1.2, 0.85], [0, 1.18, 0.42], seg(f, 0, 240)), t, 0.004);
  const tgt: [number, number, number] = [0, 1.06, -0.6];
  const e: Expr = {smile: lerp(0.5, 0.75, seg(f, 150, 175)), open: 0, lid: blink(f, [118, 205])};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D exposure={0.3 + 0.7 * on}>
        <CameraRig pos={cam} target={tgt} fov={40} />
        <Cafe showYou={false} friend={{expr: e, gaze: [0, 0.06], head: [0.02 * Math.sin(t * 0.8), 0.03 * Math.sin(t * 0.5), 0.04], breath: Math.sin(t * 1.6)}} />
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// S2a (8.0–11.0s) — "the one who listens when you are in trouble"
export const S2aApartment: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const cam = hand(lerp3([0.1, 1.05, 0.85], [0.05, 1.03, 0.6], seg(f, 0, 90)), t, 0.003);
  const nod = 0.07 * Math.max(0, Math.sin(t * 3.2)) * seg(f, 15, 30);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[0.05, 0.9, -0.9]} fov={36} />
        <Apartment friend={{expr: {smile: 0.25, open: 0, lid: 0.25 + 0.75 * blink(f, [52])}, gaze: [0, 0.12], head: [0.12 + nod, 0.05, 0.1], slump: 0.4, breath: Math.sin(t * 1.5)}} />
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// S2b (11.0–13.93s) — walking together, she laughs
export const S2bStreet: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const step = t * 2 * Math.PI * 1.7;
  const camY = 1.55 + 0.012 * Math.abs(Math.sin(step / 2));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={[-0.15, camY, 0.9]} target={[0.4, 1.38, -0.7]} fov={40} />
        <group position={[0, 0, t * 1.2]}>
          <Street />
        </group>
        <pointLight position={[0.0, 1.9, 0.3]} intensity={2.2} distance={3} decay={1.5} color="#ffd2a0" />
        <Street friendOnly friendPos={[0.6, 0.86 + 0.01 * Math.abs(Math.sin(step / 2 + 1)), -0.5]} friend={{expr: {smile: 1, open: f % 24 < 12 ? 0.25 : 0, lid: 0}, gaze: [-0.1, 0.02], head: [0.02 * Math.sin(step), 0.45, 0.05]}} />
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// S3 (13.93–18.5s) — her face; at "フレネミー" time freezes and the observer appears on the table
export const S3Freeze: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const freezeAt = 68; // ≈16.2s
  const fz = f >= freezeAt;
  const tt = fz ? freezeAt / 30 : t;
  const cam = lerp3([0.06, 1.16, 0.16], [0.05, 1.15, 0.02], seg(Math.min(f, freezeAt), 0, freezeAt));
  const camF = fz ? lerp3(cam, [0.4, 1.2, 0.7], seg(f, freezeAt, freezeAt + 50)) : cam;
  const tgtF = fz ? lerp3([0, 1.11, -0.6], [0.06, 0.88, -0.25], seg(f, freezeAt, freezeAt + 50)) : ([0, 1.11, -0.6] as [number, number, number]);
  const sat = fz ? interpolate(f, [freezeAt, freezeAt + 8], [1, 0.25], clamp) : 1;
  const mascotIn = seg(f, freezeAt + 4, freezeAt + 20);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D filter={`saturate(${sat}) contrast(${1 + (1 - sat) * 0.15})`}>
        <CameraRig pos={camF} target={tgtF} fov={fz ? lerp(24, 38, seg(f, freezeAt, freezeAt + 50)) : 24} />
        <Cafe showYou={false} friend={{expr: {smile: 0.75, open: 0, lid: 0}, gaze: [0, 0.04], head: [0.02 * Math.sin(tt * 0.8), 0.03 * Math.sin(tt * 0.5), 0.04], breath: Math.sin(tt * 1.6)}}>
          {mascotIn > 0 && <Mascot position={[0.16, TABLE_Y, 0.06]} rotationY={Math.PI - 0.35} scale={0.13 * (0.6 + 0.4 * mascotIn)} pose={{headTilt: 0.18 * seg(f, freezeAt + 24, freezeAt + 40), headNod: -0.15}} />}
        </Cafe>
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// S4 (18.5–23.9s) — "おめでとう" then "……でもさ"
export const S4Demo: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const cg = 54, dm = 117; // おめでとう ≈20.3s, でも ≈22.4s
  const sm = f < cg ? 0.5 : f < dm - 18 ? 1 : lerp(1, 0.25, seg(f, dm - 18, dm - 6));
  const lid = f < dm - 18 ? 0 : lerp(0, 0.5, seg(f, dm - 18, dm - 4));
  const gaze: [number, number] = f < dm - 18 ? [0, 0.06] : [lerp(0, 0.25, seg(f, dm - 18, dm - 4)), lerp(0.06, -0.12, seg(f, dm - 18, dm - 4))];
  const open = (f >= cg && f < cg + 16 && f % 8 < 4) || (f >= dm && f < dm + 10 && f % 8 < 4) ? 0.25 : 0;
  const cam = hand(lerp3([0, 1.2, 0.62], [0, 1.19, 0.48], seg(f, 0, 162)), t, 0.003);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[0, 1.08, -0.6]} fov={36} />
        <Cafe friend={{expr: {smile: sm, open, lid}, gaze, head: [lerp(0.04, 0.12, seg(f, dm - 18, dm)), lerp(0, 0.14, seg(f, dm - 18, dm)), 0.04], breath: Math.sin(t * 1.6)}} showYou={false} />
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
      <Bubble text="おめでとう！" at={cg + XF} out={dm - 10 + XF} x={1150} y={300} tail="left" />
      <Bubble text="……でもさ" at={dm + XF} out={170 + XF} x={480} y={330} tail="right" tone="cold" />
    </AbsoluteFill>
  );
};

// S5 (23.9–30.67s) — walking home alone; tired, looking at the pavement
export const S5WalkHome: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const step = t * 2 * Math.PI * 1.5;
  const haze = interpolate(f, [80, 180], [0, 0.35], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D filter="saturate(0.75)">
        <CameraRig pos={[0.2 + 0.01 * Math.sin(step / 2), 1.52 + 0.012 * Math.abs(Math.sin(step / 2)), 0]} target={[0.15, lerp(1.1, 0.75, seg(f, 0, 120)), -6]} fov={44} />
        <group position={[0, 0, 20 + t * 0.9]}>
          <Street />
        </group>
      </Canvas3D>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(8,10,20,0.8) 100%)', opacity: 0.6 + haze}} />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// a "specimen" under a glass dome: a miniature cafe table for two (abstract figures)
const Specimen: React.FC<{dim: number}> = ({dim}) => (
  <group>
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.46, 0.9, 64]} /><meshStandardMaterial color="#1c1e22" roughness={0.4} metalness={0.4} /></mesh>
    <mesh position={[0, 0.905, 0]}><cylinderGeometry args={[0.43, 0.43, 0.01, 64]} /><meshStandardMaterial color="#c8a76c" metalness={0.8} roughness={0.3} /></mesh>
    <group position={[0, 0.91, 0]} scale={0.32}>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.42, 0.42, 0.03, 48]} /><meshStandardMaterial color="#6b4a33" /></mesh>
      <mesh position={[0, 0.36, 0]}><cylinderGeometry args={[0.035, 0.035, 0.72, 12]} /><meshStandardMaterial color="#222" /></mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, s * 0.62]} rotation={[0, s > 0 ? Math.PI : 0, 0]}>
          <mesh position={[0, 0.85, 0]}><capsuleGeometry args={[0.16, 0.35, 8, 16]} /><meshStandardMaterial color={s > 0 ? '#d8d2c8' : '#c9b7a0'} roughness={0.6} /></mesh>
          <mesh position={[0, 1.35, 0]}><sphereGeometry args={[0.13, 24, 16]} /><meshStandardMaterial color={s > 0 ? '#d8d2c8' : '#c9b7a0'} roughness={0.6} /></mesh>
        </group>
      ))}
    </group>
    <mesh position={[0, 1.15, 0]}><sphereGeometry args={[0.38, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#cfe0ff" transparent opacity={0.12} roughness={0.02} metalness={0.3} /></mesh>
    <pointLight position={[0, 1.6, 0.3]} intensity={1.6 * dim} distance={2} decay={2} color="#ffe2b8" />
  </group>
);

// S6 (30.67–40.8s) — the observer's hall: it watches the "specimen" of the two friends
export const S6Hall: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const cam = lerp3([0.4, 1.8, 6.8], [1.6, 1.3, 3.9], seg(f, 0, 300));
  const dim = 1 - 0.55 * seg(f, 260, 290);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[0, 1.0, 0]} fov={36} />
        <Hall ring={dim}>
          <group position={[0, 0, -0.4]}><Specimen dim={dim} /></group>
          <Mascot position={[0.95, 0, 0.35]} rotationY={-2.2} scale={0.6} pose={{headTilt: 0.16 * Math.sin(Math.PI * seg(f, 120, 240)), headNod: 0.12, bob: 0.004 * Math.sin(t * 2)}} />
          <directionalLight position={[2, 3, 3]} intensity={0.5} />
          <directionalLight position={[-2, 2.5, -3]} intensity={2.2} color="#ffd9a8" />
        </Hall>
      </Canvas3D>
      <Vignette />
    </AbsoluteFill>
  );
};

// S7 (40.8–47.0s) — title card: FRIEND + ENEMY = FRENEMY
export const S7Title: React.FC = () => {
  const f = useF();
  const {fps} = useVideoConfig();
  const a = spring({frame: f - 4, fps, config: {damping: 16}});
  const b = spring({frame: f - 22, fps, config: {damping: 16}});
  const m = spring({frame: f - 70, fps, config: {damping: 18}});
  const glow = interpolate(f, [70, 100], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1d24 0%, #050608 75%)', fontFamily: FONT, color: '#f2efe9', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', top: 300, display: 'flex', gap: 60, alignItems: 'baseline', opacity: 1 - m}}>
        <div style={{transform: `translateX(${(1 - a) * -200}px)`, opacity: a, textAlign: 'center'}}>
          <div style={{fontSize: 120, fontWeight: 900, letterSpacing: '0.06em'}}>FRIEND</div>
          <div style={{fontSize: 40, color: '#b9c3d6'}}>フレンド（友達）</div>
        </div>
        <div style={{fontSize: 90, opacity: b, color: '#888'}}>＋</div>
        <div style={{transform: `translateX(${(1 - b) * 200}px)`, opacity: b, textAlign: 'center'}}>
          <div style={{fontSize: 120, fontWeight: 900, letterSpacing: '0.06em', color: '#d9534a'}}>ENEMY</div>
          <div style={{fontSize: 40, color: '#e2a29b'}}>エネミー（敵）</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 330, textAlign: 'center', opacity: m, transform: `scale(${0.9 + 0.1 * m})`}}>
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: '0.04em', textShadow: `0 0 ${40 * glow}px rgba(217,83,74,0.55)`}}>
          FR<span style={{color: '#d9534a'}}>ENEMY</span>
        </div>
        <div style={{fontSize: 64, fontWeight: 800, marginTop: 10}}>フレネミー</div>
        <div style={{fontSize: 34, color: '#b9c3d6', marginTop: 14}}>友達のふりをした敵</div>
      </div>
    </AbsoluteFill>
  );
};

// "?" above the observer's head (sprite)
const qTex = () => canvasTexture(256, 256, (g) => { g.fillStyle = 'rgba(0,0,0,0)'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#ffffff'; g.font = `bold 200px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('？', 128, 140); });

// S8 (47.0–60s) — the brain as an exhibit in the hall; the observer looks up, "?" appears
export const S8Brain: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const ang = lerp(-0.15, 0.3, seg(f, 0, 390));
  const r = lerp(5.6, 4.3, seg(f, 0, 390));
  const cam: [number, number, number] = [Math.sin(ang) * r, lerp(1.9, 1.5, seg(f, 0, 390)), Math.cos(ang) * r];
  const pulse = 0.25 + 0.2 * Math.max(0, Math.sin(t * 2.2)) * seg(f, 160, 200);
  const q = seg(f, 352, 362);
  const tex = qTex();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[0.25, 1.05, 0.3]} fov={40} />
        <Hall>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.46, 0.9, 64]} /><meshStandardMaterial color="#1c1e22" roughness={0.4} metalness={0.4} /></mesh>
          <group position={[0, 1.62, 0]} scale={0.48}>
            <hemisphereLight args={['#c9d6ff', '#20263a', 0.4]} />
            <Brain3D t={t} rotY={t * 0.25} amyg={pulse} pfc={0} link={0} />
          </group>
          <directionalLight position={[-3, 3, 2.5]} intensity={1.2} color="#fff4ea" />
          <directionalLight position={[2.5, 1.2, -3]} intensity={1.4} color="#7fa2ff" />
          <group position={[0.8, 0, 0.75]}>
            <Mascot rotationY={-2.6} scale={0.55} pose={{headNod: -0.35 * seg(f, 300, 330), headTilt: 0.2 * seg(f, 340, 356)}} />
            {q > 0 && <sprite position={[0, 1.08, 0]} scale={[0.32 * q, 0.32 * q, 1]}><spriteMaterial map={tex} transparent toneMapped={false} /></sprite>}
          </group>
        </Hall>
      </Canvas3D>
      <Vignette />
    </AbsoluteFill>
  );
};
