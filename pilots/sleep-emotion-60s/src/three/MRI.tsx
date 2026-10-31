import {useMemo} from 'react';
import * as THREE from 'three';
import {RBox, canvasTexture} from './common';
import {Head} from './Human';

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
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 30]} /><meshStandardMaterial map={tiles} roughness={0.35} /></mesh>
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
          <Head eyesClosed={false} rotation={[-Math.PI / 2, 0, 0]} />
        </group>
        {/* blanket over the body */}
        <BlanketBody />
      </group>
    </group>
  );
};

const BlanketBody: React.FC = () => {
  const geo = useMemo(() => {
    const NX = 90, NZ = 40;
    const g = new THREE.PlaneGeometry(1.55, 0.62, NX, NZ);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const u = (x + 0.775) / 1.55; // 0 = shoulders, 1 = feet
      const width = u < 0.45 ? 0.2 : 0.2 - (u - 0.45) * 0.18;
      const height = u < 0.45 ? 0.17 : 0.17 - (u - 0.45) * 0.14;
      const feet = 0.08 * Math.exp(-Math.pow((u - 0.96) / 0.03, 2)) * (Math.exp(-Math.pow((Math.abs(z) - 0.07) / 0.05, 2)));
      const y = height * Math.exp(-Math.pow(z / width, 4)) + feet;
      const hang = Math.max(0, Math.abs(z) - 0.25) * 1.5;
      p.setY(i, Math.max(0.02, y + 0.04) - hang);
    }
    g.computeVertexNormals();
    g.translate(0.13, 0.04, 0);
    return g;
  }, []);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#e7ecf2" roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
};
