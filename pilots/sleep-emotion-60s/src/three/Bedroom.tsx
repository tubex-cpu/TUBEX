import {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Head} from './Human';
import {RBox, Spot, canvasTexture, quiltTexture, woodTexture} from './common';

// Bed runs along +x, headboard at x = -1.1. Camera side is +z. Mattress top = MT.
const MT = 0.55;
const BED = {x0: -1.08, x1: 1.02, z0: -0.76, z1: 0.76};

// Body volume under the duvet, sleeping on the side, facing +z, knees slightly bent.
type Cap = {a: [number, number]; b: [number, number]; r: number; h: number; breath?: number};
const CAPS: Cap[] = [
  {a: [-0.52, 0.0], b: [-0.4, 0.0], r: 0.15, h: 0.19, breath: 0.6}, // shoulder
  {a: [-0.42, 0.0], b: [-0.02, 0.03], r: 0.17, h: 0.19, breath: 1}, // ribcage/waist
  {a: [-0.02, 0.03], b: [0.06, 0.03], r: 0.17, h: 0.21}, // hip
  {a: [0.06, 0.06], b: [0.38, 0.26], r: 0.11, h: 0.13}, // thigh (bent forward)
  {a: [0.38, 0.26], b: [0.78, 0.14], r: 0.085, h: 0.1}, // shin
  {a: [-0.5, 0.16], b: [-0.3, 0.27], r: 0.06, h: 0.09}, // forearm in front of chest
];

const segDist = (x: number, z: number, a: [number, number], b: [number, number]) => {
  const vx = b[0] - a[0], vz = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * vx + (z - a[1]) * vz) / (vx * vx + vz * vz)));
  const dx = x - (a[0] + vx * t), dz = z - (a[1] + vz * t);
  return Math.sqrt(dx * dx + dz * dz);
};

const surface = (x: number, z: number, breath: number) => {
  // smooth max of gaussian-draped bumps
  let s = 0;
  for (const c of CAPS) {
    const d = segDist(x, z, c.a, c.b);
    const h = c.h * (1 + (c.breath ?? 0) * breath);
    const sig = c.r * 0.95;
    s += Math.exp(40 * h * Math.exp(-(d * d) / (2 * sig * sig)));
  }
  let y = Math.log(s / CAPS.length + 1e-9) / 40;
  y = Math.max(0, y);
  // soft fabric folds (fixed, not animated)
  y += 0.006 * Math.sin(x * 23 + z * 7) * Math.sin(z * 17 - x * 3);
  return MT + 0.045 + y;
};

const Duvet: React.FC<{breath: number}> = ({breath}) => {
  const tex = useMemo(() => {
    const t = quiltTexture('#c9d3e3', 'rgba(70,85,110,0.45)');
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);
  const NX = 150, NZ = 110;
  const u0 = -0.58, u1 = 1.32, v0 = -1.08, v1 = 1.08;
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1, NX, NZ), []);
  const cuff = useMemo(() => ({geo: null as THREE.TubeGeometry | null}), []);
  // update vertices for this frame (pure function of breath)
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let j = 0; j <= NZ; j++) {
    for (let i = 0; i <= NX; i++) {
      const k = j * (NX + 1) + i;
      const u = u0 + ((u1 - u0) * i) / NX;
      const v = v0 + ((v1 - v0) * j) / NZ;
      // drape: past the mattress edge the cloth falls vertically
      const ex = BED.x1 + 0.03, ez = BED.z1 + 0.03;
      const cx = Math.min(u, ex);
      const cz = Math.max(-ez, Math.min(v, ez));
      let y = surface(cx, cz, breath);
      const over = Math.max(0, u - ex) + Math.max(0, Math.abs(v) - ez);
      // rounded edge over the mattress corner, then hang down
      const roll = Math.min(over, 0.06);
      y -= over > 0 ? roll * roll * 8 + Math.max(0, over - 0.06) : 0;
      const outX = u > ex ? ex + Math.sin(Math.min(1, roll / 0.06) * Math.PI / 2) * 0.03 : cx;
      const outZ = Math.abs(v) > ez ? Math.sign(v) * (ez + Math.sin(Math.min(1, roll / 0.06) * Math.PI / 2) * 0.03) : cz;
      // hanging hem waves
      const hem = over > 0.06 ? 0.012 * Math.sin(u * 30 + v * 9) : 0;
      pos.setXYZ(k, outX + (Math.abs(v) > ez ? hem : 0), Math.max(0.22, y), outZ + (u > ex ? hem : 0));
      uv.setXY(k, (u - u0) / 1.3, (v - v0) / 1.3);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  // folded top edge (cuff) following the surface at the upper hem
  const pts: THREE.Vector3[] = [];
  for (let j = 0; j <= 60; j++) {
    const v = -0.8 + (1.6 * j) / 60;
    const ez = BED.z1 + 0.03;
    const cz = Math.max(-ez, Math.min(v, ez));
    let y = surface(u0, cz, breath) + 0.01;
    const over = Math.max(0, Math.abs(v) - ez);
    y -= over * 3;
    pts.push(new THREE.Vector3(u0 + 0.005, y, cz));
  }
  cuff.geo?.dispose();
  cuff.geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.028, 16, false);
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" map={tex} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={cuff.geo} castShadow receiveShadow>
        <meshStandardMaterial color="#dfe5ef" roughness={0.9} />
      </mesh>
    </group>
  );
};

const Curtain: React.FC<{x: number}> = ({x}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.34, 1.6, 64, 8);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setZ(i, 0.025 * Math.sin(p.getX(i) * 55) + 0.01 * Math.sin(p.getX(i) * 140));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[x, 1.32, -1.52]} castShadow receiveShadow>
      <meshStandardMaterial color="#5b6680" roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
};

const Pillow: React.FC = () => {
  const geo = useMemo(() => {
    const g = new RoundedBoxGeometry(0.42, 0.13, 0.66, 24, 0.06);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      // puffy centre, thinner edges
      const fx = 1 - Math.pow(Math.abs(x) / 0.21, 4), fz = 1 - Math.pow(Math.abs(z) / 0.33, 4);
      y *= 0.55 + 0.45 * Math.max(0, fx) * Math.max(0, fz);
      // dent where the head rests
      const dx = x - 0.06, dz = z - 0.02;
      if (y > 0) y -= 0.04 * Math.exp(-(dx * dx + dz * dz) / 0.012);
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[-0.82, MT + 0.07, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#eef1f6" roughness={0.85} />
    </mesh>
  );
};

export const Bedroom: React.FC<{lampOn?: number; showPerson?: boolean}> = ({lampOn = 1, showPerson = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  // ~13 breaths/min, slightly asymmetric (inhale shorter than exhale)
  const ph = (t / 4.6) % 1;
  const breath = ph < 0.4 ? Math.sin((ph / 0.4) * Math.PI / 2) : Math.cos(((ph - 0.4) / 0.6) * Math.PI / 2);
  const b = 0.05 * (breath * breath * (3 - 2 * breath));
  const wood = useMemo(() => {
    const w = woodTexture();
    w.wrapS = w.wrapT = THREE.RepeatWrapping;
    w.repeat.set(3, 3);
    return w;
  }, []);
  const wall = useMemo(() => canvasTexture(512, 512, (g) => {
    g.fillStyle = '#c9c2b8'; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${i % 2 ? 255 : 0},${i % 2 ? 255 : 0},${i % 2 ? 255 : 0},0.025)`; g.fillRect((i * 97) % 512, (i * 53 + i * i) % 512, 1, 1); }
  }), []);
  const moon = useMemo(() => canvasTexture(256, 384, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 384);
    gr.addColorStop(0, '#1d2a4a'); gr.addColorStop(1, '#3b5378');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 384);
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(220,230,255,0.6)'; g.fillRect((i * 71) % 256, (i * 113) % 200, 2, 2); }
  }), []);
  const headY = MT + 0.155 + b * 0.04;
  return (
    <group>
      {/* lights */}
      <hemisphereLight args={['#5d74a8', '#1a1410', 0.35]} />
      <directionalLight position={[1.4, 3.2, -2.6]} intensity={1.1} color="#9db4e8" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-2.5} shadow-camera-right={2.5} shadow-camera-top={2.5} shadow-camera-bottom={-2.5} />
      <pointLight position={[-0.97, 1.02, -1.18]} intensity={1.6 * lampOn} distance={4.5} decay={1.6} color="#ffb36b" />
      {/* soft fill on the sleeper's face (lamp bounce) */}
      <Spot position={[-0.2, 1.3, 1.2]} target={[-0.72, 0.7, 0.03]} angle={0.35} penumbra={1} intensity={1.6} distance={3} decay={1.2} color="#ffd2a8" />
      {/* room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial map={wood} roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.5, -1.6]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial map={wall} roughness={0.95} />
      </mesh>
      <mesh position={[-1.3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial map={wall} roughness={0.95} />
      </mesh>
      {/* window with night sky + curtains */}
      <mesh position={[0.75, 1.45, -1.595]}>
        <planeGeometry args={[0.8, 1.1]} />
        <meshBasicMaterial map={moon} toneMapped={false} />
      </mesh>
      <RBox size={[0.9, 0.05, 0.06]} position={[0.75, 2.02, -1.57]} color="#e8e2d8" />
      <RBox size={[0.9, 0.05, 0.08]} position={[0.75, 0.88, -1.56]} color="#e8e2d8" />
      {[-1, 1].map((s) => (
        <Curtain key={s} x={0.75 + s * 0.55} />
      ))}
      {/* bed frame */}
      <RBox size={[2.2, 0.28, 1.62]} position={[-0.03, 0.22, 0]} color="#8a6a4f" radius={0.03} roughness={0.6} />
      <RBox size={[0.07, 1.0, 1.62]} position={[-1.12, 0.62, 0]} color="#7d5e45" radius={0.03} roughness={0.6} />
      {[-1, 1].map((sx) => [-1, 1].map((sz) => (
        <RBox key={`${sx}${sz}`} size={[0.07, 0.1, 0.07]} position={[sx * 1.03, 0.05, sz * 0.74]} color="#5c4433" radius={0.01} />
      )))}
      {/* mattress */}
      <RBox size={[2.1, 0.2, 1.52]} position={[-0.03, MT - 0.1, 0]} color="#f2efe9" radius={0.06} roughness={0.9} />
      <Pillow />
      {/* nightstand + lamp */}
      <RBox size={[0.45, 0.55, 0.4]} position={[-0.85, 0.275, -1.25]} color="#7b5c44" radius={0.02} />
      <mesh position={[-0.97, 0.65, -1.34]} castShadow><cylinderGeometry args={[0.035, 0.07, 0.2, 24]} /><meshStandardMaterial color="#d8d0c4" roughness={0.5} /></mesh>
      <mesh position={[-0.97, 0.86, -1.34]}>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 32, 1, true]} />
        <meshStandardMaterial color="#ffe2bd" emissive="#ffb066" emissiveIntensity={1.0 * lampOn} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      {/* rug */}
      <RBox size={[1.6, 0.012, 1.0]} position={[0.2, 0.006, 1.25]} color="#5a4a5e" radius={0.005} roughness={1} cast={false} />
      {showPerson && (
        <>
          <Head eyesClosed position={[-0.735, headY, 0.03]} rotation={[0.05, 0.0, Math.PI / 2 - 0.12]} />
          <Duvet breath={b} />
        </>
      )}
      {!showPerson && <Duvet breath={0} />}
    </group>
  );
};
export const BED_TOP = MT;
