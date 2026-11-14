// Canada: the question card (shot 3 of the approved edit, 20.22–27.87 s, 「広いのに、なぜ家が足りない？」).
// A miniature of a vast land — forests, lakes, snow to the north — and, at its southern edge, one crowded town with
// cranes. The camera flies over the empty north and comes down to the crowded town; the question stays on screen.
// Illustrative (not a map): no place names or numbers are shown.
import {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {C, FONT, FPS} from '../theme';
import {CameraRig, Key, RBox, camAt, rand, sm} from '../three/common';
import {Canvas3D, Sky, Table, useFonts} from '../three/Stage';

const Trees: React.FC<{n: number}> = ({n}) => {
  const mesh = useMemo(() => {
    const g = new THREE.ConeGeometry(0.15, 0.5, 7);
    g.translate(0, 0.25, 0);
    const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 0.9}), n);
    const M = new THREE.Matrix4(), col = new THREE.Color();
    let k = 0;
    for (let i = 0; k < n && i < n * 6; i++) {
      const x = -15 + rand(i) * 30, z = -9 + rand(i + 77) * 13.5;
      if (Math.hypot(x - 3, z - 6.5) < 3.6) continue; // keep the town clear
      if (rand(i + 5) > 0.55 + 0.35 * Math.sin(x * 0.4 + z * 0.3)) continue; // clumps
      const s = 0.6 + rand(i + 9) * 0.6;
      M.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion(), new THREE.Vector3(s, s, s));
      m.setMatrixAt(k, M);
      m.setColorAt(k, col.set(z < -5 ? '#6d8f7a' : rand(i + 3) > 0.5 ? '#4f8458' : '#5c9160'));
      k++;
    }
    m.count = k;
    m.castShadow = true;
    return m;
  }, [n]);
  return <primitive object={mesh} />;
};

const LAKES: [number, number, number, number][] = [[-9, -3, 1.8, 1.0], [-4, -6, 1.2, 0.7], [5, -4, 2.2, 1.1], [10, -1, 1.0, 0.6], [-11, 2, 1.3, 0.8], [1, -1, 0.9, 0.5], [8, -7, 1.6, 0.8]];

// the town: small houses packed on a grid, a few apartment blocks and tower cranes
const Town: React.FC<{t: number}> = ({t}) => {
  const houses = useMemo(() => {
    const out: {x: number; z: number; c: string; r: number}[] = [];
    let i = 0;
    for (let gx = -6; gx <= 6; gx++) for (let gz = -4; gz <= 4; gz++) {
      i++;
      const x = 3 + gx * 0.5 + (rand(i) - 0.5) * 0.08, z = 6.5 + gz * 0.42;
      if (Math.hypot(x - 3, (z - 6.5) * 1.3) > 3.2 || rand(i + 1) < 0.08) continue;
      out.push({x, z, c: ['#d9c7b0', '#c9b6a3', '#b9c4cc', '#d8d0c2', '#c4b8a8'][Math.floor(rand(i + 2) * 5)], r: rand(i + 4) > 0.5 ? 0 : Math.PI / 2});
    }
    return out;
  }, []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.005, 6.5]} receiveShadow><circleGeometry args={[3.5, 48]} /><meshStandardMaterial color="#b9b5ad" roughness={1} /></mesh>
      {houses.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]} rotation={[0, h.r, 0]}>
          <RBox size={[0.34, 0.24, 0.28]} radius={0.02} color={h.c} position={[0, 0.12, 0]} />
          <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[0.27, 0.14, 4]} /><meshStandardMaterial color="#6f5a4c" roughness={0.8} /></mesh>
        </group>
      ))}
      {[[2.2, 6.0, 1.3], [3.9, 6.9, 1.0], [3.0, 5.4, 0.8]].map(([x, z, h], i) => <RBox key={i} size={[0.6, h, 0.5]} radius={0.03} color="#e4e1da" position={[x, h / 2, z]} />)}
      {[[1.4, 7.4], [4.8, 5.6], [3.2, 8.4]].map(([x, z], i) => {
        const sw = Math.sin(t * 0.6 + i * 2) * 0.6;
        return (
          <group key={i} position={[x, 0, z]}>
            <RBox size={[0.06, 1.9, 0.06]} radius={0.01} color="#f2c14e" position={[0, 0.95, 0]} />
            <group position={[0, 1.9, 0]} rotation={[0, sw, 0]}>
              <RBox size={[1.4, 0.05, 0.05]} radius={0.01} color="#f2c14e" position={[0.45, 0, 0]} />
              <mesh position={[1.0, -0.3, 0]}><cylinderGeometry args={[0.006, 0.006, 0.6, 4]} /><meshBasicMaterial color="#444" /></mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export const CanadaQuestion: React.FC = () => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  const keys: Key[] = [
    {t: 0, pos: [-3, 8.5, -0.5], target: [-1, 0, -5.5], fov: 38},
    {t: 3.2, pos: [1.0, 7.0, 4.0], target: [2.0, 0, -2.0], fov: 38},
    {t: 6.2, pos: [5.4, 2.4, 11.6], target: [3.0, 0.3, 6.6], fov: 34},
    {t: 8.1, pos: [5.0, 2.1, 11.0], target: [3.0, 0.3, 6.6], fov: 34},
  ];
  const cam = camAt(keys, t);
  const focusD = Math.hypot(cam.pos[0] - cam.target[0], cam.pos[1] - cam.target[1], cam.pos[2] - cam.target[2]);
  const ground = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 640;
    const g = c.getContext('2d')!;
    const gr = g.createLinearGradient(0, 0, 0, 640);
    gr.addColorStop(0, '#f3f5f6'); gr.addColorStop(0.18, '#dfe6e3'); gr.addColorStop(0.32, '#9db58f'); gr.addColorStop(1, '#8fb07c');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 640);
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(0,0,0,${rand(i) * 0.05})`; g.fillRect(rand(i + 1) * 1024, rand(i + 2) * 640, 3, 3); }
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }, []);
  const q = sm((t - 0.3) / 0.6);
  return (
    <AbsoluteFill style={{background: C.sky}}>
      {ok && (
        <Canvas3D focus={focusD / 600} range={0.025} blur={3} bloom={0.2}>
          <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
          <Sky />
          <fog attach="fog" args={['#eef1f2', 16, 48]} />
          <hemisphereLight args={['#ffffff', '#c9c2b4', 1.15]} />
          <directionalLight position={[-10, 16, 8]} intensity={1.9} color="#fff3e2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
            shadow-camera-left={-18} shadow-camera-right={18} shadow-camera-top={18} shadow-camera-bottom={-18} shadow-bias={-0.0003} />
          <Table y={-0.62} />
          <mesh position={[0, -0.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[32, 0.6, 20]} />
            {[0, 1, 2, 3, 4, 5].map((k) => <meshStandardMaterial key={k} attach={`material-${k}`} map={k === 2 ? ground : null} color={k === 2 ? '#ffffff' : '#8a6a49'} roughness={0.95} />)}
          </mesh>
          {LAKES.map(([x, z, a, b], i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]} scale={[a, b, 1]}><circleGeometry args={[1, 40]} /><meshStandardMaterial color="#6ea6cf" roughness={0.2} /></mesh>)}
          <Trees n={1300} />
          <Town t={t} />
        </Canvas3D>
      )}
      {ok && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', opacity: q, transform: `scale(${0.94 + 0.06 * q})`}}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.amber, textShadow: '0 0 12px #fff, 0 0 22px #fff'}}>では</div>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.ink, marginTop: 6, textShadow: '0 0 14px rgba(255,255,255,0.95), 0 0 30px rgba(255,255,255,0.9), 0 4px 10px rgba(0,0,0,0.15)'}}>
            広いのに、<span style={{color: C.red}}>なぜ家が足りない？</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
