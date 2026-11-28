import {useMemo} from 'react';
import * as THREE from 'three';
import {RBox, canvasTexture} from './common';
import {Blob, Env, RB} from './Decor';
import {HeadV4} from './Person';

// Generic MRI scanner re-enactment (not a specific vendor model). Bore axis = x.
export const MRIRoom: React.FC<{slide: number}> = ({slide}) => {
  const housing = useMemo(() => {
    const w = 2.1, h = 2.0, r = 0.25;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const hole = new THREE.Path();
    hole.absarc(0, 0.12, 0.36, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, {depth: 1.2, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 8, curveSegments: 64});
    g.translate(0, 0, -0.6);
    g.rotateY(Math.PI / 2);
    return g;
  }, []);
  const tiles = useMemo(() => canvasTexture(512, 512, (g) => {
    g.fillStyle = '#d9dde3'; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = 'rgba(90,100,115,0.35)'; g.lineWidth = 2;
    for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, 512); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(512, i * 64); g.stroke(); }
  }), []);
  tiles.wrapS = tiles.wrapT = THREE.RepeatWrapping;
  tiles.repeat.set(10, 10);
  const tableX = 1.55 - slide * 0.85; // table slides into the bore (towards -x)
  return (
    <group>
      <hemisphereLight args={['#e8eef8', '#59606b', 0.9]} />
      <directionalLight position={[1.5, 3.5, 2.2]} intensity={1.6} color="#f4f7ff" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} />
      <Env name="lab" intensity={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={tiles} roughness={0.22} metalness={0.05} /></mesh>
      {/* ceiling with recessed light panels */}
      <mesh position={[0, 3.0, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[30, 30]} /><meshStandardMaterial color="#e6e9ee" roughness={0.9} /></mesh>
      {[[-1.2, -0.8], [1.2, -0.8], [-1.2, 1.2], [1.2, 1.2], [3.4, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 2.99, z]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.0, 0.6]} /><meshBasicMaterial color="#fbfdff" toneMapped={false} /></mesh>
      ))}
      {/* wall panels, observation window, cabinet, wall-mounted monitor */}
      {Array.from({length: 9}, (_, i) => (
        <mesh key={i} position={[-4 + i * 1.0, 1.6, -2.195]}><planeGeometry args={[0.012, 3.2]} /><meshStandardMaterial color="#aeb7c2" roughness={0.8} /></mesh>
      ))}
      <group position={[2.6, 1.55, -2.18]}>
        <RB s={[1.9, 0.9, 0.06]} r={0.02} c="#d9dee5" rough={0.5} />
        <mesh position={[0, 0, 0.032]}><planeGeometry args={[1.75, 0.76]} /><meshStandardMaterial color="#0f1a26" roughness={0.05} metalness={0.4} emissive="#203448" emissiveIntensity={0.6} /></mesh>
      </group>
      <RB s={[1.1, 0.95, 0.5]} r={0.02} p={[-2.6, 0.475, -1.9]} c="#e9edf2" rough={0.4} />
      {[0, 1].map((k) => <RB key={k} s={[0.5, 0.42, 0.01]} r={0.004} p={[-2.6 - 0.26 + k * 0.52, 0.5, -1.645]} c="#dfe4ea" rough={0.4} />)}
      <Blob position={[0, 0.003, 0]} sx={3.0} sz={2.6} o={0.5} />
      <Blob position={[1.45, 0.003, 0]} sx={1.9} sz={0.9} o={0.45} />
      <mesh position={[-4.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[30, 3.2]} /><meshStandardMaterial color="#c3ccd6" roughness={0.9} /></mesh>
      <mesh position={[0, 1.6, -2.2]} receiveShadow><planeGeometry args={[30, 3.2]} /><meshStandardMaterial color="#c9d2dc" roughness={0.9} /></mesh>
      {/* scanner */}
      <mesh geometry={housing} position={[0, 1.12, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f1f3f6" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.24, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.36, 1.32, 64, 1, true]} />
        <meshStandardMaterial color="#c4ccd6" roughness={0.5} side={THREE.BackSide} />
      </mesh>
      {/* front bezel display (blank, no logo) and side stripe */}
      <mesh position={[0.67, 2.0, 0.42]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.36, 0.12]} /><meshStandardMaterial color="#0e1620" emissive="#3c8fd0" emissiveIntensity={0.5} roughness={0.2} /></mesh>
      <mesh position={[0, 0.55, 1.07]}><planeGeometry args={[1.25, 0.05]} /><meshStandardMaterial color="#7fb3d8" roughness={0.4} /></mesh>
      {/* accent ring */}
      <mesh position={[0.665, 1.24, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.43, 0.012, 16, 96]} />
        <meshStandardMaterial color="#7fb3d8" emissive="#5aa0d6" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      {/* table base */}
      <RBox size={[1.5, 0.75, 0.55]} position={[1.45, 0.375, 0]} color="#e4e8ee" radius={0.06} roughness={0.4} />
      {/* sliding table + person (supine, head toward the bore) */}
      <group position={[tableX, 0.93, 0]}>
        <RBox size={[2.0, 0.07, 0.5]} color="#cfd6df" radius={0.03} roughness={0.4} />
        <RBox size={[1.9, 0.05, 0.46]} position={[0, 0.06, 0]} color="#3d6f9e" radius={0.025} roughness={0.8} />
        {/* head coil */}
        <mesh position={[-0.86, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 48, 1, true, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#e8ecf1" roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <group position={[-0.86, 0.19, 0]} rotation={[0, Math.PI / 2, 0]}>
          <HeadV4 rotation={[-Math.PI / 2, 0, 0]} />
        </group>
        {/* blanket over the body */}
        <BlanketBody />
      </group>
    </group>
  );
};

const BlanketBody: React.FC = () => {
  const geo = useMemo(() => {
    const NX = 120, NZ = 60;
    const g = new THREE.PlaneGeometry(1.55, 0.62, NX, NZ);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const u = (x + 0.775) / 1.55; // 0 = shoulders, 1 = feet
      const w = u < 0.45 ? 0.2 : 0.2 - (u - 0.45) * 0.16;
      const h = u < 0.45 ? 0.15 : 0.15 - (u - 0.45) * 0.12;
      const feet = 0.07 * Math.exp(-Math.pow((u - 0.95) / 0.035, 2)) * Math.exp(-Math.pow((Math.abs(z) - 0.07) / 0.045, 2));
      const body = h * Math.exp(-Math.pow(z / w, 2) * 1.6) + feet;
      const folds = 0.004 * Math.sin(x * 26 + z * 9) * Math.sin(z * 21);
      // cloth hangs over the table edge (|z| > 0.25)
      const over = Math.max(0, Math.abs(z) - 0.25);
      p.setY(i, 0.045 + body + folds - over * 1.4);
      p.setZ(i, Math.sign(z) * Math.min(Math.abs(z), 0.25 + over * 0.45));
    }
    g.computeVertexNormals();
    g.translate(0.13, 0.04, 0);
    return g;
  }, []);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#dfe7f0" roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  );
};
