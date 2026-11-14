// Bermuda opening (shots 1–3 of the approved edit, 2.82–10.81 s): a miniature hillside of pastel houses with white
// stepped roofs in the rain; the camera ends on a cut-away of one house: rain runs off the roof, down the pipe, into the
// tank under the house. Replaces the three illustrative diagrams (same content: 白い階段の屋根／家並み／屋根の下の飲み水).
import {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {C, FONT, FPS} from '../theme';
import {CameraRig, Key, RBox, camAt, rand, sm} from '../three/common';
import {Canvas3D, Sky, Table, useFonts} from '../three/Stage';

const PASTEL = ['#efc3b2', '#b7d3e6', '#f1df9d', '#c6e0bf', '#e9c9de'];

// white stepped (terraced) hip roof: stacked slabs, each smaller than the one below
const SteppedRoof: React.FC<{w: number; d: number; steps?: number}> = ({w, d, steps = 7}) => (
  <group>
    {Array.from({length: steps}, (_, k) => {
      const s = 1 - k / steps;
      return <RBox key={k} size={[w * s + 0.1, 0.13, d * s + 0.1]} radius={0.03} color="#fbfbf8" roughness={0.55} position={[0, 0.065 + k * 0.13, 0]} />;
    })}
  </group>
);

const House: React.FC<{pos: [number, number, number]; c: string; w?: number; d?: number; h?: number; rotY?: number; cut?: boolean}> = ({pos, c, w = 2.2, d = 1.7, h = 1.2, rotY = 0, cut = false}) => (
  <group position={pos} rotation={[0, rotY, 0]}>
    <RBox size={[w, h, d]} radius={0.04} color={c} roughness={0.8} position={[0, h / 2, 0]} />
    {[-0.5, 0.5].map((x) => <mesh key={x} position={[x * w * 0.45, h * 0.55, d / 2 + 0.006]}><planeGeometry args={[0.32, 0.38]} /><meshStandardMaterial color="#3c4a5c" roughness={0.3} /></mesh>)}
    {!cut && <mesh position={[0, h * 0.32, d / 2 + 0.006]}><planeGeometry args={[0.34, 0.62]} /><meshStandardMaterial color="#ffffff" roughness={0.5} /></mesh>}
    <group position={[0, h, 0]}><SteppedRoof w={w + 0.3} d={d + 0.3} /></group>
    {/* gutter along the front eave and the down pipe */}
    <RBox size={[w + 0.3, 0.07, 0.09]} radius={0.02} color="#e9e9e4" position={[0, h + 0.02, d / 2 + 0.2]} cast={false} />
    <mesh position={[w / 2 + 0.1, h / 2, d / 2 + 0.2]}><cylinderGeometry args={[0.045, 0.045, h + 0.05, 10]} /><meshStandardMaterial color="#e9e9e4" /></mesh>
  </group>
);

const Rain: React.FC<{t: number; n?: number; area?: number[]; a?: number}> = ({t, n = 700, area = [-14, 14, -10, 6], a = 1}) => {
  const ref = useMemo(() => new THREE.InstancedMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.5, 4), new THREE.MeshBasicMaterial({color: '#8fb3d6', transparent: true, opacity: 0.55}), n), [n]);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const x = area[0] + rand(i) * (area[1] - area[0]), z = area[2] + rand(i + 9) * (area[3] - area[2]);
    const y = 9 - ((t * 9 + rand(i + 3) * 9) % 9);
    m.makeTranslation(x + y * 0.04, y, z);
    ref.setMatrixAt(i, m);
  }
  ref.instanceMatrix.needsUpdate = true;
  (ref.material as THREE.MeshBasicMaterial).opacity = 0.5 * a;
  return <primitive object={ref} />;
};

// the hillside: terraced green ground, sea behind
const HOUSES: {p: [number, number, number]; c: number; r: number}[] = [
  {p: [-6.5, 0.0, 0.2], c: 0, r: 0.12}, {p: [-3.4, 0.25, -1.4], c: 1, r: -0.05}, {p: [-0.2, 0.55, -3.2], c: 2, r: 0.08}, {p: [3.2, 0.3, -1.6], c: 3, r: -0.12},
  {p: [6.4, 0.6, -3.8], c: 4, r: 0.05}, {p: [-4.8, 1.0, -5.6], c: 2, r: 0.2}, {p: [1.6, 1.2, -6.8], c: 0, r: -0.1}, {p: [7.6, 0.0, 0.0], c: 1, r: 0.15},
  {p: [-9.4, 0.4, -3.2], c: 3, r: -0.2}, {p: [4.8, 1.4, -8.6], c: 1, r: 0.1},
];

const CUT_X = 0.2, HZ = 3.3; // the cut-away house (front row); its tank sits in a pit open to the front edge
const FRONT = 4.6, TOP = 0, PIT = {x0: CUT_X - 1.7, x1: CUT_X + 1.7, y0: -2.1, y1: -0.35, z0: 2.3};

const proj = (cam: {pos: number[]; target: number[]; fov?: number}, p: number[]) => {
  const c = new THREE.PerspectiveCamera(cam.fov ?? 34, 1920 / 1080, 0.1, 600);
  c.position.set(cam.pos[0], cam.pos[1], cam.pos[2]); c.lookAt(cam.target[0], cam.target[1], cam.target[2]); c.updateMatrixWorld();
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(c);
  return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080];
};

// a box with a grass top and soil sides
const Earth: React.FC<{x: [number, number]; y: [number, number]; z: [number, number]; grass?: boolean}> = ({x, y, z, grass = true}) => (
  <mesh position={[(x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2]} receiveShadow castShadow>
    <boxGeometry args={[x[1] - x[0], y[1] - y[0], z[1] - z[0]]} />
    {[0, 1, 2, 3, 4, 5].map((k) => <meshStandardMaterial key={k} attach={`material-${k}`} color={k === 2 && grass ? '#7fae6a' : k === 4 ? '#7d5d3f' : '#8a6a49'} roughness={1} />)}
  </mesh>
);

export const BermudaRoofs: React.FC = () => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  // timing relative to 2.818 s (shot 1 start): shot 2 at 1.70 s, shot 3 at 4.55 s
  const keys: Key[] = [
    {t: 0, pos: [-8.6, 3.4, 6.8], target: [-6.4, 1.2, 0.4], fov: 32},
    {t: 1.6, pos: [-5.4, 3.6, 7.6], target: [-4.0, 1.0, -0.6], fov: 34},
    {t: 4.2, pos: [5.0, 6.4, 14.5], target: [0.0, 0.6, -1.5], fov: 34},
    {t: 5.3, pos: [3.0, 0.8, 13.4], target: [CUT_X, -0.25, HZ], fov: 36},
    {t: 8.4, pos: [2.3, 0.6, 12.4], target: [CUT_X, -0.3, HZ], fov: 36},
  ];
  const cam = camAt(keys, t);
  const fill = sm((t - 5.2) / 2.6); // tank water level
  const flow = t > 4.9;
  const labA = sm((t - 5.4) / 0.4), labB = sm((t - 6.1) / 0.4);
  const focusD = Math.hypot(cam.pos[0] - cam.target[0], cam.pos[1] - cam.target[1], cam.pos[2] - cam.target[2]);
  const pRoof = proj(cam, [CUT_X, 1.55, HZ + 0.9]), pTank = proj(cam, [CUT_X + 1.5, -1.4, FRONT]);
  return (
    <AbsoluteFill style={{background: C.sky}}>
      {ok && (
        <Canvas3D focus={focusD / 600} range={0.02} blur={2.6} bloom={0.2}>
          <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
          <Sky top="#c3d3e0" bottom="#eef0ec" />
          <fog attach="fog" args={['#e3e8ea', 18, 60]} />
          <hemisphereLight args={['#ffffff', '#b8c4b0', 1.2]} />
          <directionalLight position={[-8, 14, 9]} intensity={1.7} color="#fff7ec" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
            shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={16} shadow-camera-bottom={-16} shadow-bias={-0.0003} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, -45]}><planeGeometry args={[220, 70]} /><meshStandardMaterial color="#5f9fc6" roughness={0.25} metalness={0.1} /></mesh>
          <Table y={-2.42} />
          {/* terraces behind */}
          {[1, 2, 3].map((k) => <Earth key={k} x={[-14, 14]} y={[-2.4, -0.1 + k * 0.4]} z={[-2 - k * 3 - (7 - k * 0.5) / 2, -2 - k * 3 + (7 - k * 0.5) / 2]} />)}
          <Earth x={[-14, 14]} y={[-2.4, TOP]} z={[-5.5, PIT.z0]} />
          {/* the front strip, cut open around the pit */}
          <Earth x={[-14, PIT.x0]} y={[-2.4, TOP]} z={[PIT.z0, FRONT]} />
          <Earth x={[PIT.x1, 14]} y={[-2.4, TOP]} z={[PIT.z0, FRONT]} />
          <Earth x={[PIT.x0, PIT.x1]} y={[-2.4, PIT.y0]} z={[PIT.z0, FRONT]} grass={false} />
          <Earth x={[PIT.x0, PIT.x1]} y={[PIT.y1, TOP]} z={[PIT.z0, FRONT]} />
          <mesh position={[CUT_X, (PIT.y0 + PIT.y1) / 2, PIT.z0 + 0.01]}><planeGeometry args={[PIT.x1 - PIT.x0, PIT.y1 - PIT.y0]} /><meshStandardMaterial color="#6e5038" roughness={1} /></mesh>
          {HOUSES.map((h, i) => <House key={i} pos={h.p} c={PASTEL[h.c]} rotY={h.r} />)}
          <House pos={[CUT_X, TOP, HZ]} c={PASTEL[1]} cut />
          {/* tank: concrete walls, open to the front so the water shows */}
          <group position={[CUT_X, -1.22, 3.45]}>
            <RBox size={[2.9, 0.12, 2.0]} radius={0.02} color="#c9c6be" position={[0, -0.78, 0]} />
            <RBox size={[2.9, 1.6, 0.12]} radius={0.02} color="#bdb9b0" position={[0, 0, -0.95]} />
            <RBox size={[0.12, 1.6, 2.0]} radius={0.02} color="#c9c6be" position={[-1.4, 0, 0]} />
            <RBox size={[0.12, 1.6, 2.0]} radius={0.02} color="#c9c6be" position={[1.4, 0, 0]} />
            <RBox size={[2.9, 0.12, 2.0]} radius={0.02} color="#d6d3cb" position={[0, 0.78, 0]} />
            <mesh position={[0, -0.72 + fill * 0.65, 0.02]}><boxGeometry args={[2.66, 0.02 + fill * 1.3, 1.8]} /><meshStandardMaterial color="#4f9fde" roughness={0.12} transparent opacity={0.88} /></mesh>
          </group>
          {/* down pipe continues through the ground into the tank */}
          <mesh position={[CUT_X + 1.2, -0.25, HZ + 1.05]}><cylinderGeometry args={[0.045, 0.045, 1.0, 10]} /><meshStandardMaterial color="#e9e9e4" /></mesh>
          {flow && <mesh position={[CUT_X + 1.2, -0.6 - (1 - fill) * 0.2, HZ + 1.05]}><cylinderGeometry args={[0.028, 0.028, 0.5, 8]} /><meshStandardMaterial color="#6fb8f0" emissive="#6fb8f0" emissiveIntensity={0.5} /></mesh>}
          <Rain t={t} a={1 - sm((t - 7.6) / 0.6) * 0.4} />
        </Canvas3D>
      )}
      {ok && labA > 0 && (
        <div style={{position: 'absolute', left: pRoof[0], top: pRoof[1] - 60, transform: 'translateX(-50%)', opacity: labA, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.ink, textShadow: '0 0 10px #fff, 0 0 18px #fff, 0 0 4px #fff'}}>屋根</div>
      )}
      {ok && labB > 0 && (
        <div style={{position: 'absolute', left: pTank[0] + 30, top: pTank[1] - 30, opacity: labB, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.teal, textShadow: '0 0 10px #fff, 0 0 18px #fff, 0 0 4px #fff'}}>タンク</div>
      )}
    </AbsoluteFill>
  );
};
