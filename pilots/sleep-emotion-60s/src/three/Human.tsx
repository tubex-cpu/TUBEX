import {useMemo} from 'react';
import * as THREE from 'three';
import {canvasTexture} from './common';
import {perlin3} from './noise';

// Stylised "miniature re-enactment" person: sculpted head, layered hair, knit sweater.
// Same colours in every scene so viewers read it as one person. Units: metres.
export const SKIN = '#e3b597';
export const HAIR = '#2e221b';
export const SWEATER = '#5d6e88';

const g2 = (d2: number, r: number) => Math.exp(-d2 / (r * r));

// ---------- head sculpt (crown +y, face +z) ----------
const makeSkull = () => {
  const geo = new THREE.SphereGeometry(0.1, 160, 120);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const base = new THREE.Color(SKIN), blush = new THREE.Color('#e48f80'), lip = new THREE.Color('#b8665a'), shade = new THREE.Color('#c99579');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const ny = y / 0.1;
    // overall proportions: taller than wide, deep skull
    x *= 0.78; y *= 1.14; z *= 0.98;
    // jaw & chin: narrow toward the bottom, chin slightly forward, jaw-back pulled in
    if (ny < -0.15) {
      const t = (-ny - 0.15) / 0.85;
      x *= 1 - 0.42 * Math.pow(t, 1.3);
      if (z < 0) z *= 1 - 0.55 * t;
      else z *= 1 - 0.12 * t;
    }
    // forehead flatter, back of skull rounder
    if (z > 0 && ny > 0.1) z *= 1 - 0.06 * ny;
    if (z < 0) z *= 1.06;
    const front = Math.max(0, z / 0.1);
    let dz = 0;
    // eye sockets
    for (const s of [-1, 1]) dz -= 0.007 * g2((x - s * 0.031) ** 2 + (y - 0.012) ** 2 * 1.4, 0.016) * front;
    // brow ridge
    dz += 0.004 * g2((y - 0.03) ** 2 * 3, 0.012) * front * (Math.abs(x) < 0.05 ? 1 : 0.4);
    // cheekbones
    for (const s of [-1, 1]) dz += 0.004 * g2((x - s * 0.045) ** 2 + (y + 0.012) ** 2, 0.02) * front;
    // nose: bridge + tip + wings
    const bridge = g2(x * x * 4, 0.012) * (y < 0.018 && y > -0.03 ? Math.min(1, (0.018 - y) / 0.04) : 0);
    dz += 0.021 * bridge * front;
    dz += 0.007 * g2(x * x + (y + 0.026) ** 2, 0.011) * front;
    for (const s of [-1, 1]) dz += 0.004 * g2((x - s * 0.012) ** 2 + (y + 0.029) ** 2, 0.008) * front;
    // lips and mouth line
    const mouthW = g2(x * x, 0.02);
    dz += 0.004 * mouthW * g2((y + 0.044) ** 2, 0.005) * front;
    dz += 0.0045 * mouthW * g2((y + 0.055) ** 2, 0.006) * front;
    dz -= 0.0025 * g2(x * x, 0.016) * g2((y + 0.0495) ** 2, 0.0018) * front;
    // chin
    dz += 0.004 * g2(x * x + (y + 0.08) ** 2, 0.016) * front;
    z += dz;
    p.setXYZ(i, x, y, z);
    // vertex colour: blush on cheeks, red lips, slight shade under brows
    c.copy(base);
    for (const s of [-1, 1]) c.lerp(blush, 0.28 * g2((x - s * 0.045) ** 2 + (y + 0.02) ** 2, 0.022) * front);
    c.lerp(lip, 0.75 * mouthW * g2((y + 0.05) ** 2, 0.008) * front);
    c.lerp(shade, 0.25 * Math.max(0, -ny - 0.5));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
};

const makeHairCap = () => {
  const geo = new THREE.SphereGeometry(0.109, 160, 100, 0, Math.PI * 2, 0, Math.PI * 0.72);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3);
  const base = new THREE.Color(HAIR), light = new THREE.Color('#5a4434');
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    x *= 0.82; y *= 1.12;
    // hairline: front edge lifted above the forehead with a soft side part
    if (z > 0.03) {
      const lift = Math.max(0, 0.055 - y) * Math.min(1, (z - 0.03) / 0.06);
      y += lift * 0.95;
      z -= lift * 0.25;
    }
    // strands: grooves flowing from the crown
    const phi = Math.atan2(x, z);
    const n = perlin3(x * 40, y * 40, z * 40);
    const groove = Math.sin(phi * 70 + n * 4);
    const r = 1 + 0.012 * groove + 0.03 * perlin3(x * 14, y * 14, z * 14);
    p.setXYZ(i, x * r, y * r, z * r - 0.003);
    c.copy(base).lerp(light, 0.25 + 0.25 * groove * 0.5 + 0.2 * Math.max(0, y / 0.12));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
};

// tapered tube along a curve (hair locks, arms)
export const taperTube = (pts: THREE.Vector3[], r0: number, r1: number, seg = 32, radial = 12, profile?: (u: number) => number) => {
  const curve = new THREE.CatmullRomCurve3(pts);
  const geo = new THREE.TubeGeometry(curve, seg, 1, radial, false);
  const p = geo.attributes.position as THREE.BufferAttribute;
  const frames = curve.computeFrenetFrames(seg, false);
  for (let i = 0; i <= seg; i++) {
    const u = i / seg;
    const r = profile ? profile(u) : r0 + (r1 - r0) * u;
    const c = curve.getPointAt(u);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      const v = new THREE.Vector3(p.getX(k), p.getY(k), p.getZ(k)).sub(c).multiplyScalar(r);
      p.setXYZ(k, c.x + v.x, c.y + v.y, c.z + v.z);
    }
  }
  void frames;
  geo.computeVertexNormals();
  return geo;
};

const LOCKS: [number, number, number][][] = [
  // fringe locks: start on the cap and lie close to the forehead, slightly swept to one side
  [[-0.035, 0.098, 0.045], [-0.045, 0.078, 0.09], [-0.05, 0.058, 0.1]],
  [[-0.01, 0.103, 0.045], [-0.02, 0.083, 0.094], [-0.03, 0.062, 0.103]],
  [[0.015, 0.103, 0.045], [0.008, 0.085, 0.094], [0.0, 0.066, 0.104]],
  [[0.04, 0.098, 0.04], [0.045, 0.08, 0.088], [0.05, 0.062, 0.096]],
];

export const Head: React.FC<{eyesClosed?: boolean; position?: [number, number, number]; rotation?: [number, number, number]; blink?: number}> = ({eyesClosed = true, position, rotation, blink = 0}) => {
  const m = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.58, emissive: new THREE.Color('#40180c'), emissiveIntensity: 0.22}),
    skinFlat: new THREE.MeshStandardMaterial({color: SKIN, roughness: 0.58, emissive: new THREE.Color('#40180c'), emissiveIntensity: 0.22}),
    hair: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.5}),
    hairFlat: new THREE.MeshStandardMaterial({color: '#3a2a20', roughness: 0.5}),
    sclera: new THREE.MeshStandardMaterial({color: '#f1ece6', roughness: 0.25}),
    iris: new THREE.MeshStandardMaterial({color: '#2a1a12', roughness: 0.2}),
    lash: new THREE.MeshStandardMaterial({color: '#1d1410', roughness: 0.6}),
  }), []);
  const g = useMemo(() => ({
    skull: makeSkull(),
    hair: makeHairCap(),
    locks: LOCKS.map((l, i) => taperTube(l.map((v) => new THREE.Vector3(...v)), 0, 0, 16, 10, (u) => 0.012 * Math.pow(1 - u, 0.9) * Math.min(1, 0.5 + u * 3))),
    eye: new THREE.SphereGeometry(0.0115, 32, 24),
    lid: new THREE.SphereGeometry(0.0123, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5),
    lashLine: new THREE.TorusGeometry(0.0115, 0.0012, 6, 24, Math.PI * 0.8),
    brow: taperTube([new THREE.Vector3(-0.016, -0.002, 0), new THREE.Vector3(0, 0.003, 0.002), new THREE.Vector3(0.018, 0, 0)], 0, 0, 12, 8, (u) => 0.0022 * (1 - 0.5 * u)),
    ear: (() => {
      const e = new THREE.SphereGeometry(0.024, 24, 18);
      const p = e.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        p.setXYZ(i, x * 0.35 - (Math.abs(z) < 0.012 && x > 0 ? 0.003 : 0), y * 1.25, z * 0.8);
      }
      e.computeVertexNormals();
      return e;
    })(),
    neck: new THREE.CylinderGeometry(0.044, 0.05, 0.17, 32),
  }), []);
  const lidClose = eyesClosed ? 1 : blink;
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={g.skull} material={m.skin} castShadow receiveShadow />
      <mesh geometry={g.hair} material={m.hair} castShadow receiveShadow />
      {g.locks.map((l, i) => <mesh key={i} geometry={l} material={m.hairFlat} castShadow receiveShadow scale={[1.25, 1, 0.97]} />)}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={g.ear} material={m.skinFlat} castShadow receiveShadow position={[s * 0.079, -0.004, -0.004]} rotation={[0, s * 0.25, 0]} scale={[s, 1, 1]} />
          <group position={[s * 0.031, 0.012, 0.078]}>
            {lidClose < 1 && (
              <>
                <mesh geometry={g.eye} material={m.sclera} />
                <mesh geometry={g.eye} material={m.iris} position={[0, 0, 0.006]} scale={[0.55, 0.6, 0.55]} />
              </>
            )}
            {/* upper lid: rotates down to close */}
            <mesh geometry={g.lid} material={m.skinFlat} rotation={[-0.35 + (Math.PI * 0.5 + 0.35) * lidClose, 0, 0]} castShadow />
            {lidClose > 0.95 && <mesh geometry={g.lashLine} material={m.lash} position={[0, -0.001, 0.0085]} rotation={[0.35, 0, Math.PI * 1.1]} />}
            {lidClose > 0.95 && <mesh geometry={g.lid} material={m.skinFlat} rotation={[Math.PI, 0, 0]} scale={[1, 0.6, 1]} />}
          </group>
          <mesh geometry={g.brow} material={m.hairFlat} position={[s * 0.031, 0.034, 0.093]} rotation={[0.2, s * 0.25, s * 0.08]} scale={[s, 1, 1]} />
        </group>
      ))}
      <mesh geometry={g.neck} material={m.skinFlat} castShadow receiveShadow position={[0, -0.135, -0.018]} />
    </group>
  );
};

// ---------- body ----------
const knitTexture = () => {
  const t = canvasTexture(512, 512, (g) => {
    g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 512);
    for (let x = 0; x < 512; x += 8) {
      for (let y = 0; y < 512; y += 10) {
        g.fillStyle = 'rgba(255,255,255,0.35)';
        g.beginPath(); g.ellipse(x + 2, y + 5, 2.2, 4.5, 0.35, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(x + 6, y + 5, 2.2, 4.5, -0.35, 0, Math.PI * 2); g.fill();
      }
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  t.colorSpace = THREE.NoColorSpace;
  return t;
};

const torsoGeo = () => {
  // profile radius by height (0 = hips, 0.55 = shoulder line)
  const pts: THREE.Vector2[] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    let r = 0.155 + 0.02 * Math.sin(Math.PI * t * 1.1) - 0.018 * Math.exp(-Math.pow((t - 0.35) / 0.12, 2));
    if (t > 0.86) r = 0.155 * Math.cos(((t - 0.86) / 0.14) * Math.PI * 0.42) + 0.055 * Math.sin(((t - 0.86) / 0.14) * Math.PI * 0.5) * 0.4;
    pts.push(new THREE.Vector2(Math.max(0.05, r), t * 0.58));
  }
  const g = new THREE.LatheGeometry(pts, 64);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const t = y / 0.58;
    const widen = 1.12 + 0.18 * Math.exp(-Math.pow((t - 0.8) / 0.12, 2)); // shoulders wider
    p.setXYZ(i, x * widen, y, z * (0.7 + 0.08 * Math.exp(-Math.pow((t - 0.65) / 0.15, 2))));
  }
  g.computeVertexNormals();
  return g;
};

const handGeo = () => {
  const parts: THREE.BufferGeometry[] = [];
  const palm = new THREE.SphereGeometry(0.04, 20, 14);
  palm.scale(0.95, 0.38, 1.1);
  parts.push(palm);
  for (let k = 0; k < 4; k++) {
    const f = new THREE.CapsuleGeometry(0.0075, 0.04 - Math.abs(k - 1.5) * 0.004, 4, 10);
    f.rotateX(Math.PI / 2 + 0.35);
    f.translate(-0.024 + k * 0.016, -0.008, 0.055);
    parts.push(f);
  }
  const th = new THREE.CapsuleGeometry(0.0085, 0.03, 4, 10);
  th.rotateX(Math.PI / 2); th.rotateY(-0.7); th.translate(-0.04, -0.004, 0.02);
  parts.push(th);
  // merge manually
  const merged = new THREE.BufferGeometry();
  const pos: number[] = [], nor: number[] = [], idx: number[] = [];
  let off = 0;
  for (const g of parts) {
    const gg = g.index ? g : g;
    const pa = gg.attributes.position as THREE.BufferAttribute, na = gg.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i < pa.count; i++) { pos.push(pa.getX(i), pa.getY(i), pa.getZ(i)); nor.push(na.getX(i), na.getY(i), na.getZ(i)); }
    const ix = gg.index!;
    for (let i = 0; i < ix.count; i++) idx.push(ix.getX(i) + off);
    off += pa.count;
  }
  merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  merged.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  merged.setIndex(idx);
  return merged;
};

export type ArmPose = {pitch: number; out: number; elbow: number; twist?: number};
// forward kinematics in torso space: shoulder pitch (forward + = arm forward/up), outward swing, elbow bend
const armPoints = (s: number, a: ArmPose) => {
  const sh = new THREE.Vector3(s * 0.172, 0.5, 0.0);
  const up = 0.27, fo = 0.26;
  const dir1 = new THREE.Vector3(Math.sin(a.out) * s, -Math.cos(a.pitch) * Math.cos(a.out), Math.sin(a.pitch) * Math.cos(a.out)).normalize();
  const elbow = sh.clone().addScaledVector(dir1, up);
  const tot = a.pitch + a.elbow;
  const dir2 = new THREE.Vector3(Math.sin(a.out * 0.5 + (a.twist ?? 0)) * s * 0.4, -Math.cos(tot), Math.sin(tot)).normalize();
  const wrist = elbow.clone().addScaledVector(dir2, fo);
  return {sh, elbow, wrist, dir2};
};

export const SeatedPerson: React.FC<{position?: [number, number, number]; rotationY?: number; headYaw?: number; headPitch?: number; headRoll?: number; shoulderRaise?: number; slump?: number; armL?: ArmPose; armR?: ArmPose; breath?: number; blink?: number}> = ({
  position, rotationY = 0, headYaw = 0, headPitch = 0, headRoll = 0, shoulderRaise = 0, slump = 0, armL, armR, breath = 0, blink = 0,
}) => {
  const knit = useMemo(knitTexture, []);
  const m = useMemo(() => ({
    sweater: new THREE.MeshStandardMaterial({color: SWEATER, roughness: 0.92, bumpMap: knit, bumpScale: 1.2}),
    skin: new THREE.MeshStandardMaterial({color: SKIN, roughness: 0.58, emissive: new THREE.Color('#40180c'), emissiveIntensity: 0.22}),
    pants: new THREE.MeshStandardMaterial({color: '#2c3240', roughness: 0.85}),
    shoe: new THREE.MeshStandardMaterial({color: '#d9d4cc', roughness: 0.9}),
  }), [knit]);
  const g = useMemo(() => ({
    torso: torsoGeo(),
    thigh: new THREE.CapsuleGeometry(0.078, 0.34, 8, 24),
    shin: new THREE.CapsuleGeometry(0.06, 0.4, 8, 24),
    foot: new THREE.CapsuleGeometry(0.045, 0.14, 8, 16),
    hand: handGeo(),
    cuff: new THREE.TorusGeometry(0.043, 0.012, 10, 24),
    collar: new THREE.TorusGeometry(0.062, 0.016, 12, 32),
  }), []);
  const lift = shoulderRaise * 0.028;
  const defaultArm: ArmPose = {pitch: 0.5, out: 0.12, elbow: 1.0};
  const arms = ([[-1, armL ?? defaultArm], [1, armR ?? defaultArm]] as const).map(([s, a]) => {
    const {sh, elbow, wrist, dir2} = armPoints(s, a);
    sh.y += lift;
    const mid = sh.clone().lerp(elbow, 0.5);
    const geo = taperTube([sh.clone().add(new THREE.Vector3(-s * 0.03, 0.02, 0)), mid, elbow, wrist], 0, 0, 40, 16, (u) => 0.058 - 0.016 * u + 0.006 * Math.exp(-Math.pow((u - 0.6) / 0.08, 2)));
    const handQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir2);
    return {s, geo, wrist, handQ, dir2};
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={g.thigh} material={m.pants} castShadow receiveShadow position={[s * 0.095, 0.08, 0.2]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={g.shin} material={m.pants} castShadow receiveShadow position={[s * 0.095, -0.2, 0.42]} />
          <mesh geometry={g.foot} material={m.shoe} castShadow receiveShadow position={[s * 0.095, -0.44, 0.48]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      ))}
      <group position={[0, 0.04, -0.02]} rotation={[0.1 + slump * 0.14, 0, 0]}>
        <mesh geometry={g.torso} material={m.sweater} castShadow receiveShadow scale={[1 + breath * 0.012, 1, 1 + breath * 0.02]} />
        <mesh geometry={g.collar} material={m.sweater} castShadow position={[0, 0.575, -0.008]} rotation={[Math.PI / 2, 0, 0]} />
        {arms.map(({s, geo, wrist, handQ, dir2}) => (
          <group key={s}>
            <mesh geometry={geo} material={m.sweater} castShadow receiveShadow />
            <mesh geometry={g.cuff} material={m.sweater} castShadow position={wrist} quaternion={handQ} />
            <group position={wrist.clone().addScaledVector(dir2, 0.035)} quaternion={handQ}>
              <mesh geometry={g.hand} material={m.skin} castShadow receiveShadow scale={[s, 1, 1]} rotation={[0, 0, 0]} />
            </group>
          </group>
        ))}
        <Head eyesClosed={false} blink={blink} position={[0, 0.715 + lift * 0.5, 0.012]} rotation={[headPitch, headYaw, headRoll]} />
      </group>
    </group>
  );
};
