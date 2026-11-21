import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import * as THREE from 'three';
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import apartment from '@pmndrs/assets/hdri/apartment.exr.js';
import lab from '@pmndrs/assets/hdri/lab.exr.js';
import night from '@pmndrs/assets/hdri/night.exr.js';
import {canvasTexture, rand} from './common';

// ---------- image-based lighting (Poly Haven HDRIs via @pmndrs/assets, CC0) ----------
const HDRI = {apartment, lab, night} as const;
const envCache = new Map<string, THREE.Texture>();
export const Env: React.FC<{name: keyof typeof HDRI; intensity?: number; rotation?: number}> = ({name, intensity = 1, rotation = 0}) => {
  const {gl, scene} = useThree();
  const tex = useMemo(() => {
    const key = name;
    if (envCache.has(key)) return envCache.get(key)!;
    const b64 = (HDRI[name] as string).split(',')[1];
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    const loader = new EXRLoader();
    const d = loader.parse(buf.buffer) as unknown as {width: number; height: number; data: Float32Array | Uint16Array; format: THREE.PixelFormat; type: THREE.TextureDataType};
    const t = new THREE.DataTexture(d.data, d.width, d.height, d.format, d.type);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.LinearSRGBColorSpace;
    t.flipY = false;
    t.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromEquirectangular(t).texture;
    pm.dispose();
    envCache.set(key, env);
    return env;
  }, [name, gl]);
  scene.environment = tex;
  scene.environmentIntensity = intensity;
  scene.environmentRotation.set(0, rotation, 0);
  return null;
};

// ---------- procedural city seen through a window ----------
const windowsTex = (seed: number, dawn: boolean) =>
  canvasTexture(256, 512, (g) => {
    g.fillStyle = dawn ? '#1b2233' : '#0b0e16';
    g.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 8; x++) {
        const r = rand(seed * 1000 + y * 13 + x * 7);
        const lit = r > (dawn ? 0.8 : 0.62);
        g.fillStyle = lit ? (r > 0.93 ? '#bfe0ff' : '#ffd29a') : dawn ? '#2a3348' : '#141a26';
        g.globalAlpha = lit ? 0.6 + 0.4 * rand(seed + x * y) : 1;
        g.fillRect(x * 32 + 8, y * 16 + 4, 18, 9);
      }
    g.globalAlpha = 1;
  });

export const City: React.FC<{dawn?: boolean; position?: [number, number, number]; rotationY?: number; width?: number}> = ({dawn = false, position = [0, 0, 0], rotationY = 0, width = 30}) => {
  const items = useMemo(() => {
    const out: {x: number; z: number; w: number; d: number; h: number; mat: THREE.MeshStandardMaterial; top: boolean}[] = [];
    const texes = [0, 1, 2, 3].map((k) => windowsTex(k + 1, dawn));
    let i = 0;
    for (let row = 0; row < 4; row++) {
      let x = -width / 2;
      while (x < width / 2) {
        const w = 2 + rand(i * 3.1 + row) * 4;
        const d = 2 + rand(i * 5.3) * 3;
        const h = 6 + rand(i * 7.7 + row * 2) * (14 + row * 10);
        const t = texes[i % 4].clone();
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(w / 3, h / 6);
        t.needsUpdate = true;
        const mat = new THREE.MeshStandardMaterial({color: dawn ? '#3a4458' : '#151924', roughness: 0.8, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: dawn ? 0.35 : 1.0, map: t});
        out.push({x: x + w / 2, z: -row * 9 - rand(i) * 3, w, d, h, mat, top: rand(i * 9.1) > 0.7});
        x += w + 0.6 + rand(i * 2.2) * 1.5;
        i++;
      }
    }
    return out;
  }, [dawn, width]);
  const sky = useMemo(() => canvasTexture(16, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 256);
    if (dawn) { gr.addColorStop(0, '#24365e'); gr.addColorStop(0.55, '#6f7aa3'); gr.addColorStop(0.82, '#d8a07f'); gr.addColorStop(1, '#f2c79a'); }
    else { gr.addColorStop(0, '#060a16'); gr.addColorStop(0.7, '#14203a'); gr.addColorStop(1, '#2b3550'); }
    g.fillStyle = gr; g.fillRect(0, 0, 16, 256);
  }), [dawn]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 20, -45]}>
        <planeGeometry args={[220, 70]} />
        <meshBasicMaterial map={sky} toneMapped={false} fog={false} />
      </mesh>
      {!dawn && (
        <mesh position={[14, 26, -44]}>
          <circleGeometry args={[1.4, 48]} />
          <meshBasicMaterial color="#f4f1e2" toneMapped={false} />
        </mesh>
      )}
      {items.map((b, k) => (
        <group key={k} position={[b.x, b.h / 2 - 8, b.z]}>
          <mesh material={b.mat}><boxGeometry args={[b.w, b.h, b.d]} /></mesh>
          {b.top && <mesh position={[0, b.h / 2 + 0.6, 0]}><boxGeometry args={[b.w * 0.4, 1.2, b.d * 0.4]} /><meshStandardMaterial color="#20242e" emissive={dawn ? '#000' : '#ff3b30'} emissiveIntensity={0.25} /></mesh>}
        </group>
      ))}
    </group>
  );
};

// ---------- furnishing ----------
const RB: React.FC<{s: [number, number, number]; r?: number; p?: [number, number, number]; rot?: [number, number, number]; c: string; rough?: number; metal?: number; map?: THREE.Texture | null; cast?: boolean}> = ({s, r = 0.01, p, rot, c, rough = 0.6, metal = 0, map = null, cast = true}) => {
  const g = useMemo(() => new RoundedBoxGeometry(s[0], s[1], s[2], 3, Math.min(r, Math.min(...s) / 2.01)), [s[0], s[1], s[2], r]);
  return (
    <mesh geometry={g} position={p} rotation={rot} castShadow={cast} receiveShadow>
      <meshStandardMaterial color={c} roughness={rough} metalness={metal} map={map} />
    </mesh>
  );
};
export {RB};

const BOOK_COLORS = ['#8c3b2f', '#2f4f6f', '#c9a227', '#3f6b4a', '#6b4f7a', '#d8d2c4', '#20303f', '#a35b3a', '#5a6b78', '#e0b98a'];
export const Books: React.FC<{n: number; width: number; seed?: number; position?: [number, number, number]; rotationY?: number}> = ({n, width, seed = 1, position, rotationY = 0}) => {
  const books = useMemo(() => {
    const out: {x: number; w: number; h: number; d: number; c: string; tilt: number}[] = [];
    let x = 0;
    for (let i = 0; i < n && x < width; i++) {
      const w = 0.018 + rand(seed * 31 + i) * 0.03;
      const h = 0.17 + rand(seed * 17 + i * 3) * 0.09;
      const d = 0.12 + rand(seed * 7 + i) * 0.06;
      const tilt = i === n - 1 ? 0.18 : 0;
      out.push({x: x + w / 2, w, h, d, c: BOOK_COLORS[Math.floor(rand(seed * 13 + i * 5) * BOOK_COLORS.length)], tilt});
      x += w + 0.002;
    }
    return out;
  }, [n, width, seed]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {books.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, 0]} rotation={[0, 0, -b.tilt]}>
          <RB s={[b.w, b.h, b.d]} r={0.003} c={b.c} rough={0.7} />
          <mesh position={[0, b.h * 0.25, b.d / 2 + 0.0005]}><planeGeometry args={[b.w * 0.7, 0.008]} /><meshStandardMaterial color="#e8dcc0" roughness={0.6} /></mesh>
        </group>
      ))}
    </group>
  );
};

export const Shelf: React.FC<{position: [number, number, number]; rotationY?: number; width?: number; levels?: number; seed?: number}> = ({position, rotationY = 0, width = 0.8, levels = 3, seed = 1}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {Array.from({length: levels}, (_, i) => (
      <group key={i} position={[0, i * 0.32, 0]}>
        <RB s={[width, 0.022, 0.24]} r={0.004} c="#a07c5a" rough={0.55} />
        <Books n={18} width={width * (0.55 + 0.35 * rand(seed + i))} seed={seed * 10 + i} position={[-width / 2 + 0.02, 0.011, 0]} />
      </group>
    ))}
    {[-1, 1].map((s) => <RB key={s} s={[0.022, levels * 0.32, 0.24]} r={0.004} p={[s * (width / 2 + 0.011), (levels * 0.32) / 2 - 0.011, 0]} c="#8c6a4c" />)}
  </group>
);

// potted plant: leaves are bent ellipses arranged in a rosette (procedural, deterministic)
export const Plant: React.FC<{position: [number, number, number]; scale?: number}> = ({position, scale = 1}) => {
  const leaf = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.06, 0.26, 4, 12);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i) + 0.13;
      const w = Math.sin((y / 0.26) * Math.PI) * 1.0;
      p.setXYZ(i, x * w, y, -0.35 * y * y * 4 + Math.abs(x) * 0.3);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const leaves = useMemo(() => Array.from({length: 16}, (_, i) => ({ry: i * 2.4 + rand(i) * 0.4, rx: 0.25 + rand(i * 3) * 0.6, s: 0.7 + rand(i * 5) * 0.6, c: rand(i * 7) > 0.5 ? '#3f6b3a' : '#4f7d43'})), []);
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.1, 0.075, 0.18, 32]} />
        <meshStandardMaterial color="#c8b7a2" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.175, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.092, 24]} /><meshStandardMaterial color="#3b2a1d" roughness={1} /></mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.17, 0]} rotation={[0, l.ry, 0]}>
          <mesh geometry={leaf} rotation={[l.rx, 0, 0]} scale={l.s} castShadow receiveShadow>
            <meshStandardMaterial color={l.c} roughness={0.55} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// framed abstract print (self-made)
export const Frame: React.FC<{position: [number, number, number]; rotationY?: number; w?: number; h?: number; seed?: number}> = ({position, rotationY = 0, w = 0.5, h = 0.38, seed = 2}) => {
  const art = useMemo(() => canvasTexture(512, 400, (g) => {
    g.fillStyle = '#efe8dc'; g.fillRect(0, 0, 512, 400);
    const cols = ['#c86b4a', '#2f5d7c', '#e2b65c', '#7a9a8a', '#3b3b4f'];
    for (let i = 0; i < 7; i++) {
      g.fillStyle = cols[(i + seed) % cols.length];
      g.globalAlpha = 0.85;
      g.beginPath();
      g.arc(80 + rand(seed + i) * 350, 70 + rand(seed * 3 + i) * 260, 30 + rand(seed * 5 + i) * 90, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }), [seed]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RB s={[w + 0.05, h + 0.05, 0.025]} r={0.004} c="#2a2420" rough={0.5} />
      <mesh position={[0, 0, 0.0131]}><planeGeometry args={[w, h]} /><meshStandardMaterial map={art} roughness={0.8} /></mesh>
      <mesh position={[0, 0, 0.0135]}><planeGeometry args={[w * 0.88, h * 0.86]} /><meshStandardMaterial transparent opacity={0.06} color="#ffffff" roughness={0.05} /></mesh>
    </group>
  );
};

// wall with baseboard + crown moulding and a subtle plaster texture
export const plasterTex = (base: string) => {
  const t = canvasTexture(512, 512, (g) => {
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 14000; i++) {
      const v = rand(i * 1.7) > 0.5 ? 255 : 0;
      g.fillStyle = `rgba(${v},${v},${v},0.022)`;
      g.fillRect(rand(i * 3.3) * 512, rand(i * 5.9) * 512, 1 + rand(i) * 2, 1 + rand(i * 2) * 2);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
};
export const Wall: React.FC<{position: [number, number, number]; rotationY?: number; w: number; h?: number; color?: string; trim?: string}> = ({position, rotationY = 0, w, h = 2.6, color = '#cfc7bb', trim = '#ece6dc'}) => {
  const tex = useMemo(() => plasterTex(color), [color]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, h / 2, 0]} receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={tex} roughness={0.92} /></mesh>
      <RB s={[w, 0.1, 0.018]} r={0.004} p={[0, 0.05, 0.009]} c={trim} rough={0.5} cast={false} />
      <RB s={[w, 0.06, 0.04]} r={0.01} p={[0, h - 0.03, 0.02]} c={trim} rough={0.5} cast={false} />
    </group>
  );
};

// window with frame, mullions and faint glass reflection; the city sits behind it
export const WindowFrame: React.FC<{position: [number, number, number]; rotationY?: number; w: number; h: number}> = ({position, rotationY = 0, w, h}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {[[0, h / 2, w + 0.08, 0.06], [0, -h / 2, w + 0.08, 0.07]].map(([x, y, ww, hh], i) => <RB key={i} s={[ww, hh, 0.08]} r={0.008} p={[x, y, 0.0]} c="#efeae2" rough={0.45} />)}
    {[-1, 1].map((s) => <RB key={s} s={[0.06, h, 0.08]} r={0.008} p={[s * (w / 2), 0, 0]} c="#efeae2" rough={0.45} />)}
    <RB s={[0.035, h, 0.05]} r={0.006} p={[0, 0, 0.005]} c="#efeae2" rough={0.45} />
    <RB s={[w, 0.03, 0.05]} r={0.006} p={[0, h * 0.12, 0.005]} c="#efeae2" rough={0.45} />
    <RB s={[w + 0.2, 0.03, 0.16]} r={0.006} p={[0, -h / 2 - 0.045, 0.06]} c="#efeae2" rough={0.45} />
    <mesh position={[0, 0, -0.005]}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color="#9fb4d0" transparent opacity={0.08} roughness={0.02} metalness={0.2} />
    </mesh>
  </group>
);

// curtain with deep folds and a hem
export const Curtain2: React.FC<{position: [number, number, number]; rotationY?: number; w?: number; h?: number; color?: string; seed?: number}> = ({position, rotationY = 0, w = 0.45, h = 2.1, color = '#6a7189', seed = 1}) => {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 96, 24);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const t = (h / 2 - y) / h; // 0 top -> 1 bottom
      const fold = 0.035 * Math.sin(x * 48 + seed) + 0.012 * Math.sin(x * 130 + seed * 2);
      p.setZ(i, fold * (0.75 + 0.35 * t));
      p.setX(i, x * (1 + 0.08 * t));
    }
    g.computeVertexNormals();
    return g;
  }, [w, h, seed]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, h / 2 + 0.04, 0.03]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, w + 0.3, 16]} /><meshStandardMaterial color="#8a8f99" metalness={0.7} roughness={0.3} /></mesh>
    </group>
  );
};

// soft contact shadow blob under objects (ambient-occlusion substitute)
const blobTex = () => canvasTexture(128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
export const Blob: React.FC<{position: [number, number, number]; sx: number; sz: number; o?: number}> = ({position, sx, sz, o = 1}) => {
  const t = useMemo(blobTex, []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[sx, sz]} />
      <meshBasicMaterial map={t} transparent opacity={o} depthWrite={false} />
    </mesh>
  );
};
