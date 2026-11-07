import {useMemo} from 'react';
import * as THREE from 'three';
import {Spot, canvasTexture, rand, woodTexture} from './common';
import {Reflector} from 'three/examples/jsm/objects/Reflector.js';
import {Blob, City, Curtain2, Env, Frame, Plant, RB, Shelf, WindowFrame, plasterTex} from './Decor';
import {Friend} from './Friend';
import type {Expr} from './friendSdf';
import {Cup} from './Cafe';
import {ArmPoseV4} from './personSdf';
import {V3} from './sdf';

type FriendProps = {expr: Expr; gaze?: [number, number]; head?: V3; armL?: ArmPoseV4; armR?: ArmPoseV4; breath?: number; slump?: number};

// ---------------- apartment at night: the friend listens on the sofa ----------------
export const Apartment: React.FC<{friend?: FriendProps}> = ({friend}) => {
  const wall = useMemo(() => plasterTex('#c9c0b4'), []);
  const wood = useMemo(() => { const w = woodTexture(); w.wrapS = w.wrapT = THREE.RepeatWrapping; w.repeat.set(4, 4); return w; }, []);
  const fabric = '#7b8a7f';
  return (
    <group>
      <Env name="night" intensity={0.25} />
      <hemisphereLight args={['#6d7fa8', '#2a1f18', 0.25]} />
      {/* floor lamp (warm key) */}
      <group position={[1.0, 0, -1.3]}>
        <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 1.6, 12]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} /></mesh>
        <mesh position={[0, 1.62, 0]}><cylinderGeometry args={[0.16, 0.22, 0.28, 40, 1, true]} /><meshStandardMaterial color="#f3e2c4" emissive="#ffb766" emissiveIntensity={0.9} side={THREE.DoubleSide} /></mesh>
        <pointLight position={[0, 1.55, 0]} intensity={2.4} distance={5} decay={1.5} color="#ffb877" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.002} />
      </group>
      <Spot position={[0.7, 1.55, 0.5]} target={[0.05, 1.05, -0.9]} angle={0.4} penumbra={1} intensity={4} distance={4} decay={1.3} color="#ffcf9e" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 10]} /><meshStandardMaterial map={wood} roughness={0.55} /></mesh>
      {/* back wall with window */}
      {[[-2.6, 1.3, 3.2, 2.6], [2.6, 1.3, 3.2, 2.6], [0, 0.45, 2.0, 0.9], [0, 2.35, 2.0, 0.5]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -1.8]} receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={wall} roughness={0.92} /></mesh>
      ))}
      <WindowFrame position={[0, 1.5, -1.8]} w={2.0} h={1.2} />
      <City position={[0, -18, -50]} width={80} />
      <Curtain2 position={[-1.15, 1.25, -1.72]} w={0.5} h={2.3} color="#596178" seed={3} />
      <Curtain2 position={[1.15, 1.25, -1.72]} w={0.5} h={2.3} color="#596178" seed={6} />
      <Frame position={[-1.9, 1.5, -1.79]} w={0.5} h={0.38} seed={9} />
      <Plant position={[-1.6, 0, -1.4]} scale={2.0} />
      {/* sofa */}
      <group position={[0, 0, -0.95]}>
        <RB s={[2.0, 0.22, 0.85]} r={0.05} p={[0, 0.22, 0]} c={fabric} rough={0.95} />
        <RB s={[2.0, 0.55, 0.22]} r={0.07} p={[0, 0.6, -0.33]} c={fabric} rough={0.95} />
        {[-1, 1].map((s) => <RB key={s} s={[0.2, 0.42, 0.85]} r={0.07} p={[s * 0.95, 0.42, 0]} c={fabric} rough={0.95} />)}
        {[-0.48, 0.48].map((x, i) => <RB key={i} s={[0.9, 0.12, 0.62]} r={0.05} p={[x, 0.39, 0.06]} c="#87978b" rough={0.95} />)}
        <RB s={[0.4, 0.36, 0.14]} r={0.07} p={[-0.62, 0.62, -0.18]} rot={[-0.2, 0.25, 0.08]} c="#c9a46b" rough={0.95} />
      </group>
      {/* low table with mugs and a tissue box */}
      <RB s={[1.0, 0.04, 0.5]} r={0.01} p={[0, 0.4, 0.1]} c="#5c4636" rough={0.5} />
      {[[-0.45, -0.2], [0.45, -0.2], [-0.45, 0.4], [0.45, 0.4]].map(([x, z], i) => <RB key={i} s={[0.04, 0.38, 0.04]} r={0.008} p={[x, 0.19, z * 0.5 + 0.1]} c="#4a3829" />)}
      <Cup position={[-0.2, 0.42, 0.15]} />
      <Cup position={[0.22, 0.42, 0.2]} color="#c8d3e0" />
      <RB s={[0.22, 0.09, 0.12]} r={0.01} p={[0.35, 0.465, 0.02]} c="#e9e4dc" rough={0.7} />
      <Blob position={[0, 0.003, -0.6]} sx={2.6} sz={1.6} o={0.6} />
      {friend && <Friend position={[0.05, 0.36, -0.95]} armL={{pitch: 0.42, out: -0.12, elbow: 0.95}} armR={{pitch: 0.4, out: -0.1, elbow: 1.0}} top="#7a5b66" {...friend} />}
    </group>
  );
};

// ---------------- shopping street at night (buildings, signs, wires, lamps) ----------------
const signTex = (seed: number, color: string) => canvasTexture(256, 96, (g) => {
  g.fillStyle = color; g.fillRect(0, 0, 256, 96);
  g.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 3 + (seed % 3); i++) g.fillRect(24 + i * 58, 30, 40, 36); // abstract glyph blocks (no real names/logos)
});
const shopWindowTex = (seed: number) => canvasTexture(256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#ffe6b8'); gr.addColorStop(1, '#d6a46a');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(${60 + rand(seed + i) * 120},${50 + rand(seed * 2 + i) * 80},${40 + rand(seed * 3 + i) * 60},0.8)`; g.fillRect(rand(seed * 5 + i) * 220, 120 + rand(seed * 7 + i) * 100, 20 + rand(i) * 30, 30 + rand(i * 3) * 50); }
});
const facadeTex = (seed: number, base: string) => {
  const t = canvasTexture(256, 512, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) {
      const lit = rand(seed * 11 + y * 3 + x) > 0.45;
      g.fillStyle = lit ? '#ffcf8f' : '#1c2230';
      g.fillRect(24 + x * 76, 30 + y * 120, 56, 70);
      g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(24 + x * 76, 96 + y * 120, 56, 6);
    }
  });
  return t;
};
const Building: React.FC<{x: number; side: number; w: number; h: number; seed: number}> = ({x, side, w, h, seed}) => {
  const cols = ['#7d7468', '#6b6f78', '#8a7d6a', '#5f6a66', '#837068'];
  const base = cols[seed % cols.length];
  const tex = useMemo(() => facadeTex(seed, base), [seed, base]);
  const sign = useMemo(() => signTex(seed, ['#b23a2e', '#2f5d8a', '#2f7a55', '#c9902f'][seed % 4]), [seed]);
  const shop = useMemo(() => shopWindowTex(seed), [seed]);
  const z = side * 4.2;
  const face = side > 0 ? -1 : 1; // facade faces the street (z = 0)
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow><boxGeometry args={[w, h, 2.4]} /><meshStandardMaterial color={base} roughness={0.85} /></mesh>
      {/* upper floors facade with lit windows */}
      <mesh position={[0, (h + 3.2) / 2, face * 1.205]} rotation={[0, face > 0 ? 0 : Math.PI, 0]}><planeGeometry args={[w * 0.92, h - 3.4]} /><meshStandardMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.55} roughness={0.8} /></mesh>
      {/* shop front: glowing window, awning, sign */}
      <mesh position={[0, 1.25, face * 1.21]} rotation={[0, face > 0 ? 0 : Math.PI, 0]}><planeGeometry args={[w * 0.8, 1.9]} /><meshStandardMaterial map={shop} emissive="#ffffff" emissiveMap={shop} emissiveIntensity={0.55} roughness={0.3} color="#8a7a66" /></mesh>
      <mesh position={[0, 2.45, face * 1.45]} rotation={[face * 0.45, 0, 0]} castShadow><boxGeometry args={[w * 0.86, 0.04, 0.6]} /><meshStandardMaterial color={['#7a2b24', '#26445e', '#2d5a40', '#7a5a22'][seed % 4]} roughness={0.8} /></mesh>
      <mesh position={[0, 2.95, face * 1.22]} rotation={[0, face > 0 ? 0 : Math.PI, 0]}><planeGeometry args={[w * 0.6, 0.42]} /><meshStandardMaterial map={sign} emissive="#ffffff" emissiveMap={sign} emissiveIntensity={0.8} /></mesh>
      <pointLight position={[0, 1.6, face * 2.0]} intensity={1.2} distance={4} decay={1.8} color="#ffc488" />
    </group>
  );
};
const LampPost: React.FC<{x: number; z: number}> = ({x, z}) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 2.2, 0]} castShadow><cylinderGeometry args={[0.05, 0.07, 4.4, 12]} /><meshStandardMaterial color="#5a5e66" metalness={0.5} roughness={0.5} /></mesh>
    <mesh position={[0, 4.35, -Math.sign(z) * 0.4]} rotation={[Math.sign(z) * 0.3, 0, 0]}><boxGeometry args={[0.18, 0.08, 0.9]} /><meshStandardMaterial color="#5a5e66" metalness={0.5} roughness={0.5} /></mesh>
    <mesh position={[0, 4.28, -Math.sign(z) * 0.8]}><boxGeometry args={[0.16, 0.03, 0.3]} /><meshBasicMaterial color="#fff2d6" toneMapped={false} /></mesh>
    <pointLight position={[0, 4.1, -Math.sign(z) * 0.8]} intensity={4} distance={9} decay={1.6} color="#ffe7c2" />
  </group>
);
const VendingMachine: React.FC<{x: number; z: number}> = ({x, z}) => {
  const front = useMemo(() => canvasTexture(256, 512, (g) => {
    g.fillStyle = '#e8eef5'; g.fillRect(0, 0, 256, 512);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { g.fillStyle = ['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#e67e22'][(r * 6 + c) % 6]; g.fillRect(18 + c * 38, 40 + r * 70, 24, 50); }
    g.fillStyle = '#20252b'; g.fillRect(20, 380, 216, 90);
  }), []);
  return (
    <group position={[x, 0, z]} rotation={[0, z > 0 ? Math.PI : 0, 0]}>
      <RB s={[0.9, 1.8, 0.7]} r={0.02} p={[0, 0.9, 0]} c="#d8dde3" rough={0.4} />
      <mesh position={[0, 1.0, 0.352]}><planeGeometry args={[0.8, 1.55]} /><meshStandardMaterial map={front} emissive="#ffffff" emissiveMap={front} emissiveIntensity={0.9} /></mesh>
      <pointLight position={[0, 1.0, 0.8]} intensity={1.3} distance={3} decay={1.8} color="#e8f2ff" />
    </group>
  );
};
export const Street: React.FC<{friend?: FriendProps; friendPos?: V3; friendOnly?: boolean; children?: React.ReactNode}> = ({friend, friendPos = [0.55, 0.92, -0.2], friendOnly = false, children}) => {
  const asphalt = useMemo(() => {
    const t = canvasTexture(512, 512, (g) => {
      g.fillStyle = '#2a2c30'; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 9000; i++) { const v = 30 + rand(i) * 40; g.fillStyle = `rgb(${v},${v},${v + 3})`; g.fillRect(rand(i * 3) * 512, rand(i * 7) * 512, 2, 2); }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 30); return t;
  }, []);
  const blds = useMemo(() => {
    const out: {x: number; side: number; w: number; h: number; seed: number}[] = [];
    for (const side of [-1, 1]) { let x = -6; let k = side > 0 ? 50 : 0; while (x < 60) { const w = 4 + rand(k * 1.3) * 3; out.push({x: x + w / 2, side, w, h: 7 + rand(k * 2.1) * 9, seed: k}); x += w + 0.15; k++; } }
    return out;
  }, []);
  // utility wires sagging between poles
  const wires = useMemo(() => [0, 1, 2].map((i) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 40; k++) { const t = k / 40; const x = -2 + t * 12; pts.push(new THREE.Vector3(x, 6.8 - i * 0.25 - Math.sin(t * Math.PI) * 0.5, -3.1 + i * 0.12)); }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.012, 6, false);
  }), []);
  if (friendOnly && friend) return <Friend position={friendPos} rotationY={-1.1} armL={{pitch: 0.08, out: 0.1, elbow: 0.25}} armR={{pitch: -0.05, out: 0.1, elbow: 0.2}} {...friend} top="#5d6b82" />;
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <Env name="night" intensity={0.3} />
      <hemisphereLight args={['#4b5a80', '#1a1612', 0.35]} />
      <fog attach="fog" args={['#1c2540', 18, 75]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[25, 0, 0]} receiveShadow><planeGeometry args={[80, 8]} /><meshStandardMaterial map={asphalt} roughness={0.35} metalness={0.1} /></mesh>
      {[-1, 1].map((s) => <mesh key={s} position={[25, 0.08, s * 2.9]} receiveShadow><boxGeometry args={[80, 0.16, 0.12]} /><meshStandardMaterial color="#8d8f94" roughness={0.8} /></mesh>)}
      {blds.map((b, i) => <Building key={i} {...b} />)}
      {[2, 12, 22, 32].map((x) => <LampPost key={x} x={x} z={-3.1} />)}
      {[7, 17, 27].map((x) => <LampPost key={x} x={x} z={3.1} />)}
      {[-2, 10, 22, 34].map((x) => <mesh key={x} position={[x, 3.6, -3.25]} castShadow><cylinderGeometry args={[0.13, 0.15, 7.2, 12]} /><meshStandardMaterial color="#9a9893" roughness={0.8} /></mesh>)}
      {wires.map((g, i) => <mesh key={i} geometry={g}><meshStandardMaterial color="#111" /></mesh>)}
      <VendingMachine x={5.5} z={-2.9} />
      <City position={[95, -6, 0]} rotationY={-Math.PI / 2} width={40} />
      {friend && (
        <group rotation={[0, -Math.PI / 2, 0]}>
          <Friend position={friendPos} rotationY={-1.95} armL={{pitch: 0.08, out: 0.1, elbow: 0.25}} armR={{pitch: -0.05, out: 0.1, elbow: 0.2}} {...friend} top="#c9b7a0" />
        </group>
      )}
      {children}
    </group>
  );
};

// ---------------- "ヒト図鑑" hall: the observer's dark circular gallery (after the channel banner) ----------------
export const Hall: React.FC<{children?: React.ReactNode; ring?: number}> = ({children, ring = 1}) => {
  const floor = useMemo(() => {
    const t = canvasTexture(512, 512, (g) => {
      g.fillStyle = '#121418'; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 4000; i++) { const v = 14 + rand(i) * 22; g.fillStyle = `rgba(${v},${v},${v + 4},0.6)`; g.fillRect(rand(i * 3) * 512, rand(i * 7) * 512, 3 + rand(i) * 6, 1 + rand(i * 2) * 3); }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 6); return t;
  }, []);
  const niches = Array.from({length: 10}, (_, i) => (i / 10) * Math.PI * 2 + 0.31);
  const mirror = useMemo(() => new Reflector(new THREE.CircleGeometry(12, 96), {textureWidth: 960, textureHeight: 540, color: 0x777777}), []);
  return (
    <group>
      <Env name="night" intensity={0.15} />
      <hemisphereLight args={['#8090b0', '#050505', 0.12]} />
      <fog attach="fog" args={['#05070a', 6, 22]} />
      {/* reflective dark floor (real mirror pass under a semi-transparent stone layer) + glowing ring */}
      <primitive object={mirror} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[12, 96]} /><meshStandardMaterial map={floor} color="#2a2e36" roughness={0.35} metalness={0.3} transparent opacity={0.72} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}><ringGeometry args={[2.38, 2.42, 160]} /><meshBasicMaterial color="#ffe2b0" toneMapped={false} transparent opacity={0.7 * ring} /></mesh>
      {/* cylindrical wall with niches */}
      <mesh position={[0, 3, 0]}><cylinderGeometry args={[7, 7, 6, 96, 1, true]} /><meshStandardMaterial color="#17191d" roughness={0.7} side={THREE.BackSide} /></mesh>
      {niches.map((a, i) => (
        <group key={i} position={[Math.sin(a) * 6.85, 0, Math.cos(a) * 6.85]} rotation={[0, a + Math.PI, 0]}>
          <mesh position={[0, 1.7, 0.02]}><planeGeometry args={[0.9, 1.5]} /><meshStandardMaterial color="#2a2620" emissive="#3a2a18" emissiveIntensity={0.4} /></mesh>
          <pointLight position={[0, 2.35, 0.4]} intensity={0.8} distance={2} decay={2} color="#ffbe7a" />
          <mesh position={[0, 1.25, 0.15]}><boxGeometry args={[0.7, 0.04, 0.25]} /><meshStandardMaterial color="#3a3530" /></mesh>
          <mesh position={[0, 1.45, 0.15]}><icosahedronGeometry args={[0.16 + rand(i) * 0.08, 1]} /><meshStandardMaterial color="#8a8070" roughness={0.6} /></mesh>
        </group>
      ))}
      {/* ceiling oculus with a beam of light */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[2.2, 7, 96]} /><meshStandardMaterial color="#0d0f12" side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 6.01, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[2.2, 96]} /><meshBasicMaterial color="#c8d4e8" toneMapped={false} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 3, 0]}><cylinderGeometry args={[2.1, 2.4, 6, 64, 1, true]} /><meshBasicMaterial color="#9fb3d6" transparent opacity={0.06} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <spotLight position={[0, 6, 0]} angle={0.42} penumbra={0.6} intensity={9} distance={12} decay={1.2} color="#dfe8ff" castShadow shadow-mapSize={[1024, 1024]} />
      {children}
    </group>
  );
};
