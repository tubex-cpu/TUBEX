// The four kinds of shot in the 3D edit. Plates (the approved 2D drawing of each shot, without subtitles) are used as
// textures: maps lie on a diorama board on a table; diagrams float as thick cards over that board; big numbers become
// raised number blocks; globes are a real 3D globe (Natural Earth shaded relief, public domain).
import {useMemo} from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {C, FONT, FPS, PLATE_HOST} from './theme';
import {CameraRig, RBox, canvasTexture, lerp, rand, sm, smoother} from './three/common';
import {Canvas3D, Lights, Sky, Table, strataTex, useFonts, usePlate} from './three/Stage';

export type Pin = {a0: number; xy: number[][]};
export type Shot = {i: number; scene: string; kind: string; start: number; end: number; P: Record<string, unknown>; big: string[] | null; pins: Record<string, Pin>};
export type Data = {episode: string; total: number; xf: number; shots: Shot[]; cities: Record<string, number[]>; subs: {start: number; end: number; lines: string[]}[]};
export type ShotProps = {shot: Shot; data: Data; ep: string};

const BW = 16, BH = 9; // the board (plate) in world units
const toBoard = (px: number, py: number): [number, number] => [(px / 1920 - 0.5) * BW, (py / 1080 - 0.5) * BH];
const plateUrl = (data: Data, i: number) => `${PLATE_HOST}/${data.episode}/render/out/plates/shot_${String(i).padStart(3, '0')}.mp4`;

const camFor = (pos: number[], target: number[], fov: number) => {
  const c = new THREE.PerspectiveCamera(fov, 1920 / 1080, 0.1, 600);
  c.position.set(pos[0], pos[1], pos[2]);
  c.lookAt(target[0], target[1], target[2]);
  c.updateMatrixWorld();
  return (p: number[]) => {
    const v = new THREE.Vector3(p[0], p[1], p[2]).project(c);
    return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080, v.z];
  };
};
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// --------------------------------------------------------------- pieces
// the plate keeps its exact colours (unlit); a shadow catcher above it receives the pins' shadows
const PlateMat: React.FC<{tex: THREE.Texture | null; glow?: number}> = ({tex, glow = 1}) => {
  if (tex) tex.colorSpace = THREE.SRGBColorSpace;
  return <meshBasicMaterial key={tex ? 'tex' : 'none'} map={tex} color={new THREE.Color(glow, glow, glow)} toneMapped={false} />;
};
const ShadowCatch: React.FC<{w: number; h: number; y?: number; o?: number}> = ({w, h, y = 0.004, o = 0.28}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow><planeGeometry args={[w, h]} /><shadowMaterial transparent opacity={o} /></mesh>
);
let BASE: Record<string, THREE.Texture> = {};
const baseTex = (ep: string) => {
  if (!BASE[ep]) {
    const t = new THREE.TextureLoader().load(staticFile(`base_${ep}.jpg`));
    t.colorSpace = THREE.SRGBColorSpace;
    BASE[ep] = t;
  }
  return BASE[ep];
};

// the diorama slab: plate on top, layered earth on the cut sides
const PlateTop: React.FC<{src: string; w: number; h: number}> = ({src, w, h}) => {
  const tex = usePlate(src);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow><planeGeometry args={[w, h]} /><PlateMat tex={tex} /></mesh>;
};
const PlateFace: React.FC<{src: string; w: number; h: number; z: number; glow?: number}> = ({src, w, h, z, glow}) => {
  const tex = usePlate(src);
  return <mesh position={[0, 0, z]}><planeGeometry args={[w, h]} /><PlateMat tex={tex} glow={glow} /></mesh>;
};
export const Board: React.FC<{tex?: THREE.Texture | null; src?: string; thick?: number}> = ({tex = null, src, thick = 0.5}) => {
  const side = useMemo(strataTex, []);
  return (
    <group>
      <mesh position={[0, -thick / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW, thick, BH]} />
        {[0, 1, 2, 3, 4, 5].map((k) => <meshStandardMaterial key={k} attach={`material-${k}`} map={k === 2 || k === 3 ? null : side} color={k === 2 || k === 3 ? '#cfc6b6' : '#ffffff'} roughness={0.9} />)}
      </mesh>
      {src ? <PlateTop src={src} w={BW} h={BH} /> : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} receiveShadow>
          <planeGeometry args={[BW, BH]} />
          <PlateMat tex={tex} />
        </mesh>
      )}
      <ShadowCatch w={BW} h={BH} />
    </group>
  );
};

// a map pin that drops in, bounces and casts a shadow
const Pin3D: React.FC<{x: number; z: number; t: number; color?: string}> = ({x, z, t, color = C.amber}) => {
  if (t <= 0) return null;
  const fall = Math.min(1, t / 0.32);
  const y = (1 - fall * fall) * 3 + (fall >= 1 ? Math.abs(Math.sin(Math.min(1, (t - 0.32) / 0.35) * Math.PI)) * 0.18 * Math.exp(-(t - 0.32) * 4) : 0);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.022, 0.006, 0.84, 8]} /><meshStandardMaterial color="#c9ccd2" metalness={0.8} roughness={0.25} /></mesh>
      <mesh position={[0, 0.9, 0]} castShadow><sphereGeometry args={[0.17, 24, 16]} /><meshStandardMaterial color={color} roughness={0.25} metalness={0.05} /></mesh>
      <mesh position={[-0.05, 0.95, 0.12]}><sphereGeometry args={[0.04, 10, 8]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.8} /></mesh>
    </group>
  );
};

const pinAt = (p: Pin, t: number): [number, number] | null => {
  const xy = p.xy;
  if (!xy.length) return null;
  if (t <= xy[0][0]) return [xy[0][1], xy[0][2]];
  for (let k = 0; k < xy.length - 1; k++) {
    if (t <= xy[k + 1][0]) {
      const u = (t - xy[k][0]) / Math.max(1e-6, xy[k + 1][0] - xy[k][0]);
      return [lerp(xy[k][1], xy[k + 1][1], u), lerp(xy[k][2], xy[k + 1][2], u)];
    }
  }
  const l = xy[xy.length - 1];
  return [l[1], l[2]];
};

// --------------------------------------------------------------- map: plate on the diorama board
export const MapShot: React.FC<ShotProps> = ({shot, data}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const d = shot.end - shot.start;
  const u = smoother(Math.min(1, t / (d + data.xf)));
  const side = (rand(shot.i) - 0.5) * 2; // each shot orbits a little differently
  const yaw = (side * 4 + u * (side > 0 ? -3 : 3)) * Math.PI / 180;
  const pitch = (63 - u * 3) * Math.PI / 180;
  const D = 16.6 - u * 0.8;
  const target = [0, 0, 0.35];
  const pos = [target[0] + Math.sin(yaw) * Math.cos(pitch) * D, Math.sin(pitch) * D, target[2] + Math.cos(yaw) * Math.cos(pitch) * D];
  const fov = 30;
  return (
    <AbsoluteFill style={{background: C.sky}}>
      <Canvas3D focus={dist(pos, target) / 600} range={0.05} blur={2.6}>
        <CameraRig pos={pos} target={target} fov={fov} />
        <Sky />
        <fog attach="fog" args={['#eef1f2', 40, 140]} />
        <Lights />
        <Table y={-0.5} />
        <Board src={plateUrl(data, shot.i)} />
        {Object.entries(shot.pins).map(([n, p]) => {
          const xy = pinAt(p, t);
          if (!xy) return null;
          const [x, z] = toBoard(xy[0], xy[1]);
          return <Pin3D key={n} x={x} z={z} t={t - p.a0 + 0.05} />;
        })}
      </Canvas3D>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------- diagram / card: a thick card floating over the board
export const CardShot: React.FC<ShotProps> = ({shot, data, ep}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const d = shot.end - shot.start;
  const u = smoother(Math.min(1, t / (d + data.xf)));
  const side = rand(shot.i + 7) > 0.5 ? 1 : -1;
  const CW = 14.6, CH = CW * 9 / 16;
  const cy = 4.6;
  const bob = Math.sin(t * 0.9 + shot.i) * 0.04;
  const rotY = side * (0.07 - u * 0.05);
  const target = [0, cy, 0];
  const D = 19.6 - u * 1.0;
  const pos = [side * (1.6 - u * 1.2), cy + 1.6, D];
  return (
    <AbsoluteFill style={{background: C.sky}}>
      <Canvas3D focus={dist(pos, target) / 600} range={0.022} blur={4}>
        <CameraRig pos={pos} target={target} fov={30} />
        <Sky />
        <fog attach="fog" args={['#eef1f2', 30, 120]} />
        <Lights sun={[-8, 18, 14]} span={16} />
        <Table y={-0.5} />
        <group position={[0, 0, -9]} scale={1.6}><Board tex={baseTex(ep)} /></group>
        <group position={[0, cy + bob, 0]} rotation={[-0.04, rotY, 0]}>
          <RBox size={[CW + 0.2, CH + 0.2, 0.22]} radius={0.12} color="#ffffff" roughness={0.6} />
          <PlateFace src={plateUrl(data, shot.i)} w={CW} h={CH} z={0.115} glow={0.97} />
        </group>
      </Canvas3D>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------- big number: a raised block of the number standing on the board
const bigTex = (s: string, color: string, w = 2048, h = 512) => canvasTexture(w, h, (g) => {
  g.clearRect(0, 0, w, h);
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  let size = 300;
  g.font = `800 ${size}px "MPR", sans-serif`;
  while (g.measureText(s).width > w * 0.94 && size > 80) { size -= 10; g.font = `800 ${size}px "MPR", sans-serif`; }
  g.fillText(s, w / 2, h / 2 + 10);
});
export const BigShot: React.FC<ShotProps> = ({shot, data, ep}) => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  const d = shot.end - shot.start;
  const [val, sub] = shot.big ?? ['', ''];
  const front = useMemo(() => (ok ? bigTex(val, C.amber) : null), [ok, val]);
  const edge = useMemo(() => (ok ? bigTex(val, '#8a4a00') : null), [ok, val]);
  const subT = useMemo(() => (ok ? canvasTexture(2048, 220, (g) => {
    g.fillStyle = '#ffffff'; (g as unknown as {roundRect: (a: number, b: number, c: number, d: number, r: number) => void}).roundRect(0, 0, 2048, 220, 60); g.fill();
    g.fillStyle = C.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
    let size = 96; g.font = `800 ${size}px "MPR", sans-serif`;
    while (g.measureText(sub).width > 1900 && size > 40) { size -= 4; g.font = `800 ${size}px "MPR", sans-serif`; }
    g.fillText(sub, 1024, 116);
  }) : null), [ok, sub]);
  const u = smoother(Math.min(1, t / (d + data.xf)));
  const rise = sm(t / 0.55);
  const side = rand(shot.i + 3) > 0.5 ? 1 : -1;
  const target = [0, 1.9, 0];
  const pos = [side * (2.6 - u * 2.2), 5.6 - u * 0.4, 14.5 - u * 1.0];
  const layers = 18;
  return (
    <AbsoluteFill style={{background: C.sky}}>
      {ok && (
        <Canvas3D focus={dist(pos, target) / 600} range={0.02} blur={4.5}>
          <CameraRig pos={pos} target={target} fov={30} />
          <Sky />
          <fog attach="fog" args={['#eef1f2', 30, 120]} />
          <Lights sun={[-7, 14, 10]} span={14} />
          <Table y={-0.5} />
          <group position={[0, 0, -2]} scale={1.5}><Board tex={baseTex(ep)} /></group>
          <group position={[0, (rise - 1) * 2.5, 0]} scale={[1, 0.6 + 0.4 * rise, 1]}>
            {Array.from({length: layers}, (_, k) => (
              <mesh key={k} position={[0, 3.0, -k * 0.022]} castShadow={k === layers - 1}>
                <planeGeometry args={[12, 3]} />
                <meshStandardMaterial map={k === 0 ? front : edge} transparent alphaTest={0.4} roughness={0.35} metalness={0.05} emissive={k === 0 ? '#ffffff' : '#000000'} emissiveMap={k === 0 ? front : null} emissiveIntensity={k === 0 ? 0.35 : 0} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
          {sub && (
            <group position={[0, 1.15, 0.9]} rotation={[-0.2, 0, 0]} scale={sm((t - 0.35) / 0.5)}>
              <RBox size={[9.6, 1.12, 0.12]} radius={0.06} color="#ffffff" roughness={0.6} />
              <mesh position={[0, 0, 0.065]}><planeGeometry args={[9.4, 1.0]} /><meshBasicMaterial map={subT} transparent toneMapped={false} /></mesh>
            </group>
          )}
        </Canvas3D>
      )}
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------- globe: a real 3D globe
const Atmos: React.FC<{r: number}> = ({r}) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vN; void main(){ float k = pow(0.72 - dot(vN, vec3(0,0,1.0)), 3.0); gl_FragColor = vec4(0.45,0.7,1.0,1.0) * k * 1.6; }',
  }), []);
  return <mesh material={mat} scale={r * 1.12}><sphereGeometry args={[1, 64, 32]} /></mesh>;
};
const LatRing: React.FC<{lat: number; a: number}> = ({lat, a}) => {
  const r = Math.cos(lat * Math.PI / 180) * 1.004, y = Math.sin(lat * Math.PI / 180) * 1.004;
  return <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.006, 8, 160]} /><meshBasicMaterial color={C.amber} transparent opacity={a} toneMapped={false} /></mesh>;
};
const ll = (lon: number, lat: number, r = 1): [number, number, number] => {
  const L = lon * Math.PI / 180, B = lat * Math.PI / 180;
  return [Math.cos(B) * Math.cos(L) * r, Math.sin(B) * r, -Math.cos(B) * Math.sin(L) * r];
};
export const GlobeShot: React.FC<ShotProps> = ({shot, data, ep}) => {
  const ok = useFonts();
  const f = useCurrentFrame();
  const t = f / FPS;
  const d = shot.end - shot.start;
  const P = shot.P as {lon: number[]; lat: number[]; r: number[]; why?: string};
  const k = smoother(Math.min(1, t / d));
  const lon = lerp(P.lon[0], P.lon[1], k), lat = lerp(P.lat[0], P.lat[1], k), rpx = lerp(P.r[0], P.r[1], k);
  const tex = useMemo(() => {
    const l = new THREE.TextureLoader().load(staticFile('globe.jpg'));
    l.colorSpace = THREE.SRGBColorSpace; l.anisotropy = 8;
    return l;
  }, []);
  const hl = useMemo(() => (ep === 'ca' ? new THREE.TextureLoader().load(staticFile('hl_ca.png')) : null), [ep]);
  const D = 540 / (0.2679 * rpx) + 0.0;
  const spin = t * 0.01;
  // a pin at the destination when it is a named place
  const dest = Object.entries(data.cities).find(([, c]) => Math.abs(c[0] - P.lon[1]) < 0.4 && Math.abs(c[1] - P.lat[1]) < 0.4);
  const ring = (P.why ?? '').includes('北緯') ? P.lat[1] : null;
  const pinT = t - (d * 0.55);
  const rotY = -Math.PI / 2 - lon * Math.PI / 180 + spin, rotX = lat * Math.PI / 180;
  const pinW = dest ? (() => {
    const v = new THREE.Vector3(...ll(dest[1][0], dest[1][1], 1.0));
    v.applyEuler(new THREE.Euler(0, rotY, 0)); v.applyEuler(new THREE.Euler(rotX, 0, 0));
    return [v.x, v.y, v.z];
  })() : null;
  const pos = [0, -0.05, D], target = [0, -0.05, 0];
  const proj = camFor(pos, target, 30);
  const lab = pinW && pinT > 0.2 ? proj([pinW[0] * 1.06, pinW[1] * 1.06, pinW[2] * 1.06]) : null;
  return (
    <AbsoluteFill style={{background: '#dfe9f1'}}>
      {ok && (
        <Canvas3D focus={(D - 1) / 600} range={0.03} blur={1.5} bloom={0.25} vignette={0.35}>
          <CameraRig pos={pos} target={target} fov={30} />
          <Sky top="#bfd5e8" bottom="#f4efe6" />
          <ambientLight intensity={0.55} />
          <directionalLight position={[-3, 2.5, 4]} intensity={2.4} color="#fff6ea" />
          <group rotation={[rotX, 0, 0]}>
            <group rotation={[0, rotY, 0]}>
              <mesh><sphereGeometry args={[1, 128, 64]} /><meshStandardMaterial map={tex} roughness={0.85} /></mesh>
              {hl && <mesh scale={1.003}><sphereGeometry args={[1, 128, 64]} /><meshBasicMaterial map={hl} transparent opacity={sm((t - 0.4) / 1.0)} depthWrite={false} toneMapped={false} /></mesh>}
              {ring !== null && <LatRing lat={ring} a={sm((t - 0.8) / 0.8)} />}
              {dest && pinT > 0 && (
                <group position={ll(dest[1][0], dest[1][1], 1.0)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...ll(dest[1][0], dest[1][1], 1)).normalize())}>
                  <group scale={0.11}><Pin3D x={0} z={0} t={pinT} /></group>
                </group>
              )}
            </group>
          </group>
          <Atmos r={1} />
        </Canvas3D>
      )}
      {dest && lab && (
        <div style={{position: 'absolute', left: lab[0] + 26, top: lab[1] - 40, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.ink, opacity: sm((pinT - 0.2) / 0.4), whiteSpace: 'nowrap',
          textShadow: '0 0 8px #fff, 0 0 14px #fff, 0 2px 4px rgba(255,255,255,0.9)'}}>{dest[0]}</div>
      )}
    </AbsoluteFill>
  );
};
