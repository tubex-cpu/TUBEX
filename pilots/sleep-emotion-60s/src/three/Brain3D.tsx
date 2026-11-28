import {useMemo} from 'react';
import * as THREE from 'three';
import {canvasTexture} from './common';
import {perlin3, ridged} from './noise';

// Procedural, self-made brain model (not traced from any image). Axes: x lateral, y up, z anterior (+z = front).
// Purpose: a readable "where in the brain" schematic. Region positions are approximate (schematic).
export const AMYG: [number, number, number][] = [[-0.27, -0.3, 0.14], [0.27, -0.3, 0.14]];
export const MPFC: [number, number, number][] = [[-0.06, 0.08, 0.64], [0.06, 0.08, 0.64]];

const hemisphere = (s: number) => {
  const g = new THREE.SphereGeometry(1, 320, 220);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const dx = v.x, dy = v.y, dz = v.z;
    const medial = dx * s < 0;
    // half-ellipsoid with a flattened medial wall (hemispheres meet at the midline fissure)
    let x = medial ? -s * 0.355 * Math.pow(Math.abs(dx), 0.28) : dx * 0.5;
    let y = dy * 0.56 * (dy < 0 ? 0.68 : 1);
    let z = dz * 0.9 * (dz < 0 ? 1.02 : 0.98);
    y *= 1 - 0.1 * Math.max(0, dz) * Math.max(0, dy); // frontal lobe slopes down to the front
    const lat = Math.max(0, dx * s);
    // temporal lobe: rounded bulge down/forward on the lateral underside
    const tz = Math.exp(-Math.pow((dz - 0.18) / 0.45, 2));
    if (dy < 0.15) y -= 0.22 * Math.pow(lat, 0.7) * tz * Math.min(1, (0.15 - dy) * 2.0);
    // occipital pole a bit pointed
    if (dz < -0.6) y *= 1 - 0.25 * (-dz - 0.6);
    // Sylvian (lateral) fissure
    const lineY = -0.1 + (0.35 - z) * 0.3;
    const sylv = lat > 0.35 && z > -0.3 && z < 0.55 ? Math.exp(-Math.pow((y - lineY) / 0.03, 2)) : 0;
    // central sulcus hint (runs top -> down-forward)
    const cs = Math.exp(-Math.pow((z - (0.05 - (y - 0.1) * 0.35)) / 0.025, 2)) * (y > -0.05 ? 1 : 0);
    // sulci = narrow grooves along zero-crossings of two warped noise fields; gyri = the broad rounded areas between
    const wx = perlin3(x * 1.7 + 3.3, y * 1.7, z * 1.7) * 0.3;
    const wy = perlin3(x * 1.7, y * 1.7 + 7.7, z * 1.7) * 0.3;
    const n1 = perlin3((x + wx) * 5.0 + s * 7.1, (y + wy) * 5.6, z * 5.0);
    const n2 = perlin3((x - wy) * 9.0 + 11.0, (y + wx) * 9.0, z * 9.0 + s * 3.0);
    const groove = Math.max(Math.exp(-Math.pow(n1 / 0.07, 2)), 0.6 * Math.exp(-Math.pow(n2 / 0.06, 2)));
    const disp = -0.045 * groove + 0.008 * n1 - sylv * 0.06 - cs * 0.03;
    const nx = x / 0.25, ny = y / 0.31, nz = z / 0.81;
    const nl = Math.hypot(nx, ny, nz) || 1;
    p.setXYZ(i, x + s * 0.37 + (nx / nl) * disp, y + (ny / nl) * disp, z + (nz / nl) * disp);
  }
  g.computeVertexNormals();
  return g;
};

const cerebellum = () => {
  const g = new THREE.SphereGeometry(1, 180, 120);
  const p = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const fo = Math.sin(v.y * 34 + perlin3(v.x * 3, v.y * 3, v.z * 3) * 3);
    const folia = -0.05 * Math.exp(-Math.pow(fo / 0.25, 2));
    const vermis = -0.04 * Math.exp(-Math.pow(v.x / 0.08, 2)) * Math.max(0, -v.z);
    const r = 1 + folia + vermis;
    p.setXYZ(i, v.x * 0.5 * r, v.y * 0.22 * r, v.z * 0.28 * r);
  }
  g.computeVertexNormals();
  return g;
};

// Translucent surface with a fresnel rim (glass-like "documentary" brain).
const glassMat = (side: THREE.Side, opacity: number, color: string, rim: string) => {
  const m = new THREE.MeshStandardMaterial({color, roughness: 0.45, metalness: 0.0, transparent: true, opacity, side, depthWrite: false});
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
       float fr = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);
       gl_FragColor.rgb += vec3(${new THREE.Color(rim).toArray().map((c) => c.toFixed(3)).join(',')}) * fr * 0.9;
       gl_FragColor.a = clamp(gl_FragColor.a + fr * 0.55, 0.0, 1.0);`,
    );
  };
  m.customProgramCacheKey = () => `glass-${side}-${opacity}-${color}`;
  return m;
};

const haloTex = () =>
  canvasTexture(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });

const Glow: React.FC<{pos: [number, number, number]; color: string; k: number; size: number; tex: THREE.Texture; core?: [number, number, number]}> = ({pos, color, k, size, tex, core = [0.05, 0.035, 0.08]}) => (
  <group position={pos}>
    <mesh scale={core} renderOrder={20}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.3 + 0.6 * k} toneMapped={false} depthWrite={false} depthTest={false} />
    </mesh>
    <sprite scale={[size * (0.5 + 0.6 * k), size * (0.5 + 0.6 * k), 1]} renderOrder={21}>
      <spriteMaterial map={tex} color={color} transparent opacity={0.1 + 0.55 * k} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
    </sprite>
  </group>
);

export const Brain3D: React.FC<{t: number; rotY?: number; amyg?: number; pfc?: number; link?: number; coupling?: number; showSecondSide?: boolean}> = ({
  t, rotY = 0, amyg = 0.3, pfc = 0, link = 0, coupling = 1,
}) => {
  const geo = useMemo(() => ({L: hemisphere(-1), R: hemisphere(1), cb: cerebellum()}), []);
  const mats = useMemo(() => {
    const clay = new THREE.MeshStandardMaterial({color: '#b3a9bd', roughness: 0.66, metalness: 0, transparent: true, opacity: 0.86});
    clay.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float fr = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.5);
        gl_FragColor.rgb += vec3(0.35, 0.5, 0.95) * fr * 0.35;`);
    };
    clay.customProgramCacheKey = () => 'brain-clay-v2';
    return {clay, stem: glassMat(THREE.FrontSide, 0.9, '#b9b0c2', '#9fb4ff')};
  }, []);
  const tex = useMemo(haloTex, []);
  const curves = useMemo(() => [0, 1].map((i) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(...MPFC[i]), new THREE.Vector3(MPFC[i][0] * 1.6, -0.12, 0.5), new THREE.Vector3(AMYG[i][0] * 0.8, -0.26, 0.3), new THREE.Vector3(...AMYG[i]),
  ])), []);
  const tubes = useMemo(() => curves.map((c) => new THREE.TubeGeometry(c, 60, 0.008, 8, false)), [curves]);
  const N = 18;
  return (
    <group rotation={[0.05, rotY, 0]}>
      {/* back faces first, then front faces (stable transparency) */}
      <mesh geometry={geo.L} material={mats.clay} castShadow receiveShadow />
      <mesh geometry={geo.R} material={mats.clay} castShadow receiveShadow />
      <mesh geometry={geo.cb} material={mats.clay} position={[0, -0.42, -0.6]} rotation={[-0.3, 0, 0]} />
      <mesh material={mats.stem} position={[0, -0.72, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.085, 0.62, 32]} />
      </mesh>
      {/* regions */}
      {AMYG.map((p, i) => <Glow key={`a${i}`} pos={p} color="#ff6a3d" k={amyg} size={0.36} tex={tex} />)}
      {pfc > 0 && MPFC.map((p, i) => <Glow key={`p${i}`} pos={p} color="#3fd6c4" k={pfc} size={0.4} tex={tex} core={[0.035, 0.08, 0.07]} />)}
      {/* activity coupling: light pulses travelling between the regions (schematic, not wiring) */}
      {link > 0 && curves.map((c, ci) => (
        <group key={ci}>
          <mesh geometry={tubes[ci]} renderOrder={19}>
            <meshBasicMaterial color="#dfe8ff" transparent opacity={0.22 * link} depthWrite={false} depthTest={false} toneMapped={false} />
          </mesh>
          {Array.from({length: N}, (_, i) => {
            const speed = 0.22 + 0.1 * coupling;
            const u = (((t * speed + i / N + ci * 0.37) % 1) + 1) % 1;
            // weak coupling: pulses thin out and lose rhythm (fewer, dimmer, irregular)
            const keep = coupling + (1 - coupling) * (perlin3(i * 1.7, ci * 3.1, Math.floor(t * 2) * 0.9) > 0.15 ? 1 : 0) * 0.15;
            const a = link * Math.sin(Math.PI * u) * keep;
            if (a < 0.02) return null;
            const p = c.getPointAt(u);
            return (
              <sprite key={i} position={p} scale={[0.08, 0.08, 1]} renderOrder={22}>
                <spriteMaterial map={tex} color="#f2f6ff" transparent opacity={Math.min(1, a)} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
              </sprite>
            );
          })}
        </group>
      ))}
    </group>
  );
};

// project a brain-local point to screen pixels for 2D labels
export const projectToScreen = (
  local: [number, number, number], rotY: number, cam: {pos: [number, number, number]; target: [number, number, number]; fov: number}, w: number, h: number, offset: [number, number] = [0, 0],
) => {
  const c = new THREE.PerspectiveCamera(cam.fov, w / h, 0.01, 50);
  c.position.set(...cam.pos);
  c.lookAt(...cam.target);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...local).applyEuler(new THREE.Euler(0.05, rotY, 0)).project(c);
  return [(v.x * 0.5 + 0.5) * w + offset[0], (-v.y * 0.5 + 0.5) * h + offset[1]] as const;
};
