import {useThree} from '@react-three/fiber';
import {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const sm = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const smoother = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * t * (t * (t * 6 - 15) + 10));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t)) as [number, number, number];
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// camera keyframes: {t (s), pos, target, fov}; smooth between neighbours
export type Key = {t: number; pos: number[]; target: number[]; fov?: number};
export const camAt = (keys: Key[], t: number) => {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.t) {
      const u = smoother((t - a.t) / Math.max(1e-6, b.t - a.t));
      return {t, pos: lerp3(a.pos, b.pos, u), target: lerp3(a.target, b.target, u), fov: lerp(a.fov ?? 35, b.fov ?? 35, u)};
    }
  }
  return keys[keys.length - 1];
};
export const CameraRig: React.FC<{pos: number[]; target: number[]; fov?: number; shake?: number; t?: number}> = ({pos, target, fov = 35, shake = 0, t = 0}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const sx = shake * (Math.sin(t * 61.3) + 0.5 * Math.sin(t * 97.1)), sy = shake * (Math.cos(t * 53.7) + 0.5 * Math.sin(t * 83.9));
    cam.position.set(pos[0] + sx, pos[1] + sy, pos[2]);
    cam.fov = fov;
    cam.near = 0.1;
    cam.far = 600;
    cam.lookAt(target[0] + sx * 0.5, target[1] + sy * 0.5, target[2]);
    cam.updateProjectionMatrix();
  });
  return null;
};

export const canvasTexture = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

export const RBox: React.FC<{size: [number, number, number]; radius?: number; color: string; roughness?: number; metalness?: number; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number | [number, number, number]; map?: THREE.Texture | null; emissive?: string; emissiveIntensity?: number; emissiveMap?: THREE.Texture | null; opacity?: number; cast?: boolean}> = ({
  size, radius = 0.05, color, roughness = 0.6, metalness = 0, position, rotation, scale, map = null, emissive, emissiveIntensity = 1, emissiveMap = null, opacity = 1, cast = true,
}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius), [size[0], size[1], size[2], radius]);
  return (
    <mesh geometry={geo} position={position} rotation={rotation} scale={scale} castShadow={cast} receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} map={map} emissive={emissive ?? '#000000'} emissiveIntensity={emissiveIntensity} emissiveMap={emissiveMap} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
};

// text drawn on a canvas, used as a texture on a plane
export const textTexture = (text: string, opt: {w?: number; h?: number; size?: number; color?: string; bg?: string; weight?: number; radius?: number; lines?: string[]} = {}) => {
  const {w = 1024, h = 256, size = 120, color = '#0F1B2D', bg = 'rgba(0,0,0,0)', weight = 900, radius = 0} = opt;
  return canvasTexture(w, h, (g) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = bg;
    if (radius) {
      g.beginPath();
      (g as unknown as {roundRect: (x: number, y: number, w: number, h: number, r: number) => void}).roundRect(0, 0, w, h, radius);
      g.fill();
    } else g.fillRect(0, 0, w, h);
    g.fillStyle = color;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `${weight} ${size}px "Noto Sans JP", sans-serif`;
    const lines = opt.lines ?? [text];
    lines.forEach((l, i) => g.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * size * 1.18));
  });
};
