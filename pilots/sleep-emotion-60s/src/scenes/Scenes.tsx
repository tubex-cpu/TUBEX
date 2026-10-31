import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bedroom} from '../three/Bedroom';
import {CameraRig, ease, lerp, lerp3} from '../three/common';
import {DESK_Y, DeskRoom} from '../three/Desk';
import {Mascot} from '../three/Mascot';
import {MRIRoom} from '../three/MRI';
import {Connectivity, Conditions, ImageStrip, Limits, Result} from '../ui/Diagrams';
import {ObsLog, Tag, Vignette} from '../ui/Overlay';

const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, antialias: true, preserveDrawingBuffer: true};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
export const XF = 8; // scenes become visible XF frames before their nominal start (cross-fade)
const useF = () => useCurrentFrame() - XF;

const Canvas3D: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows={{type: THREE.PCFSoftShadowMap}} gl={GL} style={{position: 'absolute', inset: 0}}>
      {children}
    </ThreeCanvas>
  );
};

const PREDICT = '予測：睡眠は、体の休息。';
const PREDICT2 = '　　　感情には関係しない。';

// S1 — hook: an all-nighter at the desk, a phone buzz, a sharp reaction (re-enactment)
export const HookScene: React.FC = () => {
  const f = useF();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const pulse = (a: number, b: number) => Math.min(ease((t - a) / 0.12), 1 - ease((t - b + 0.25) / 0.25));
  const buzz = Math.max(0, pulse(2.3, 3.2), pulse(3.4, 4.3));
  const shotB = f >= 81;
  // reaction: sharp head turn toward the phone, shoulders tense, then a heavy slump
  const turn = seg(f, 86, 92) * (1 - 0.35 * seg(f, 125, 150));
  const tense = seg(f, 86, 94) * (1 - seg(f, 120, 140));
  const slump = seg(f, 122, 150);
  const typing = f < 70 ? t : 0;
  const camA = lerp3([1.35, 1.5, 1.55], [1.15, 1.42, 1.3], seg(f, 0, 81));
  const camB = lerp3([0.8, 1.56, 1.38], [0.72, 1.52, 1.26], seg(f, 81, 159));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        {shotB ? <CameraRig pos={camB} target={[0.18, 0.98, 0.12]} fov={36} /> : <CameraRig pos={camA} target={[0.0, 0.98, -0.05]} fov={38} />}
        <DeskRoom t={t} buzz={buzz} headYaw={-0.75 * turn} headPitch={0.15 * slump + 0.05} shoulderRaise={tense} slump={slump} typing={typing} />
      </Canvas3D>
      <Vignette />
      <Tag text="再現映像（CG）" sub="日常の場面は、研究で直接調べたものではありません" />
    </AbsoluteFill>
  );
};

// S2 — the observer on the desk, writing a (wrong) prediction
export const ObserveScene: React.FC = () => {
  const f = useF();
  const {fps} = useVideoConfig();
  const t = (f + 159) / fps;
  const tilt = 0.24 * seg(f, 34, 52);
  const arm = 0.55 * seg(f, 48, 66);
  const lean = 0.08 * seg(f, 48, 66);
  const cam = lerp3([-1.2, 0.96, 0.4], [-1.12, 0.94, 0.32], seg(f, 0, 117));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[-0.3, 0.92, -0.05]} fov={36} />
        <DeskRoom t={t} headYaw={-0.26} headPitch={0.2} slump={1}>
          <Mascot position={[-0.45, DESK_Y, -0.02]} rotationY={0.75} scale={0.19} pose={{headTilt: tilt, armR: arm, lean, headNod: -0.06}} />
        </DeskRoom>
      </Canvas3D>
      <Vignette />
      <ObsLog x={1060} y={70} width={780} lines={[{text: PREDICT, at: 18}, {text: PREDICT2, at: 40}]} />
    </AbsoluteFill>
  );
};

// S3 — sleeping person (re-enactment)
export const SleepScene: React.FC = () => {
  const f = useF();
  const shotB = f >= 74;
  const camA = lerp3([1.15, 1.5, 2.55], [0.85, 1.32, 2.2], seg(f, 0, 74));
  const camB = lerp3([-0.2, 0.92, 0.82], [-0.3, 0.88, 0.7], seg(f, 74, 160));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        {shotB ? <CameraRig pos={camB} target={[-0.62, 0.68, 0.0]} fov={32} /> : <CameraRig pos={camA} target={[-0.25, 0.62, 0]} fov={34} />}
        <Bedroom />
      </Canvas3D>
      <Vignette />
      <Tag text="再現映像（CG）" />
      {shotB && (
        <div style={{position: 'absolute', right: 64, top: 52, padding: '14px 22px', borderRadius: 10, background: 'rgba(10,14,26,0.75)', color: '#fff', fontFamily: '"Noto Sans CJK JP"', fontSize: 26, lineHeight: 1.45,
          opacity: interpolate(f, [80, 92], [0, 1], clamp), border: '1px solid rgba(255,255,255,0.2)'}}>
          <div style={{fontWeight: 800, fontSize: 30}}>Yoo et al. (2007)</div>
          <div>“The human emotional brain without sleep”</div>
          <div style={{color: '#9fb0d0'}}>Current Biology 17, R877–R878</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ConditionsScene: React.FC = () => <Conditions f={useF()} />;

// S5 — measurement re-enactment
export const MRIScene: React.FC = () => {
  const f = useF();
  const slide = seg(f, 0, 70);
  const cam = lerp3([4.3, 2.1, 3.9], [3.7, 1.9, 3.3], seg(f, 0, 168));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={cam} target={[0.25, 0.95, 0]} fov={34} />
        <MRIRoom slide={slide} />
      </Canvas3D>
      <Vignette />
      <Tag text="測定の再現（CG）" sub="実際の研究参加者・装置ではありません" />
      <ImageStrip f={f} />
    </AbsoluteFill>
  );
};

// S6 — result graph + the observer noticing it
export const ResultScene: React.FC = () => {
  const f = useF();
  const show = f >= 192; // ≈ 37.0 s
  const a = interpolate(f, [192, 202], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Result f={f} />
      {show && (
        <div style={{position: 'absolute', right: -40, bottom: 40, width: 520, height: 560, opacity: a}}>
          <ThreeCanvas width={520} height={560} shadows gl={{...GL, alpha: true}} style={{position: 'absolute', inset: 0}}>
            <CameraRig pos={[0, 0.9, 4.4]} target={[0, 0.72, 0]} fov={28} />
            <hemisphereLight args={['#c8d4ff', '#202030', 0.7]} />
            <directionalLight position={[-2, 4, 3]} intensity={2.0} />
            <directionalLight position={[3, 1, -2]} intensity={0.9} color="#ffb38a" />
            <Mascot rotationY={-0.6 + 0.1 * seg(f, 196, 214)} pose={{headTilt: 0.3 * seg(f, 200, 216), headNod: -0.18 * seg(f, 198, 212), armL: 0.35 * seg(f, 206, 222)}} castShadow={false} />
          </ThreeCanvas>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const ConnectivityScene: React.FC = () => <Connectivity f={useF()} />;
export const LimitsScene: React.FC = () => <Limits f={useF()} />;

// S9 — back in the bedroom: the observer updates its judgement (distance, arm, posture)
export const UpdateScene: React.FC = () => {
  const f = useF();
  const shotB = f >= 54; // 53.4 s
  const g = f - 54;
  const back = seg(g, 46, 80); // steps back
  const pose = {
    headTilt: 0.24 * (1 - seg(g, 30, 50)),
    armR: 0.5 * (1 - seg(g, 34, 52)),
    lean: 0.08 * (1 - seg(g, 34, 52)),
    headNod: 0.16 * Math.sin(Math.PI * Math.min(1, Math.max(0, (g - 92) / 26))),
    step: back > 0 && back < 1 ? back * Math.PI * 4 : 0,
  };
  const camA = lerp3([1.05, 1.42, 2.4], [0.95, 1.38, 2.3], seg(f, 0, 54));
  const camB = lerp3([0.45, 1.02, 0.95], [0.38, 0.98, 0.82], seg(g, 0, 198));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        {shotB ? <CameraRig pos={camB} target={[-0.76, 0.72, -0.62]} fov={27} /> : <CameraRig pos={camA} target={[-0.3, 0.6, -0.2]} fov={36} />}
        <Bedroom />
        {shotB && (
          <Mascot position={[lerp(-0.7, -0.66, back), 0.55, lerp(-1.13, -1.32, back)]} rotationY={lerp(-0.05, -0.55, seg(g, 50, 90))} scale={0.19} pose={pose} />
        )}
      </Canvas3D>
      <Vignette />
      {shotB && (
        <ObsLog x={60} y={60} width={820} lines={[
          {text: PREDICT, at: -100, strike: 30}, {text: PREDICT2, at: -100, strike: 34},
          {text: '更新：睡眠不足は、感情に関わる', at: 58, color: '#ffe6a6'},
          {text: '　　　脳の反応も変える。', at: 84, color: '#ffe6a6'},
          {text: '次から：徹夜明けの反応を、', at: 116},
          {text: '　　　性格と決めつけない。', at: 140},
        ]} />
      )}
    </AbsoluteFill>
  );
};
