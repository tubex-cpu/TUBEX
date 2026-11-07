import {useThree} from '@react-three/fiber';
import {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => lerp(v, b[i], t)) as [number, number, number];

export const CameraRig: React.FC<{pos: [number, number, number]; target: [number, number, number]; fov?: number}> = ({pos, target, fov = 35}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pos);
    cam.fov = fov;
    cam.near = 0.02;
    cam.far = 60;
    cam.lookAt(...target);
    cam.updateProjectionMatrix();
  });
  return null;
};

export const RBox: React.FC<{size: [number, number, number]; radius?: number; color: string; roughness?: number; position?: [number, number, number]; rotation?: [number, number, number]; cast?: boolean; map?: THREE.Texture | null; emissive?: string; emissiveIntensity?: number}> = ({
  size, radius = 0.02, color, roughness = 0.7, position, rotation, cast = true, map = null, emissive, emissiveIntensity = 1,
}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(size[0], size[1], size[2], 4, radius), [size[0], size[1], size[2], radius]);
  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow={cast} receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} map={map} emissive={emissive ?? '#000000'} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
};

// deterministic pseudo-random (no Math.random anywhere in the render path)
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
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

export const woodTexture = () =>
  canvasTexture(1024, 1024, (g) => {
    g.fillStyle = '#7a5a40';
    g.fillRect(0, 0, 1024, 1024);
    for (let p = 0; p < 8; p++) {
      const y0 = p * 128;
      g.fillStyle = p % 2 ? '#7e5d42' : '#76553b';
      g.fillRect(0, y0, 1024, 126);
      g.fillStyle = 'rgba(30,18,10,0.55)';
      g.fillRect(0, y0 + 126, 1024, 2);
      for (let k = 0; k < 40; k++) {
        const yy = y0 + rand(p * 100 + k) * 126;
        g.strokeStyle = `rgba(40,25,12,${0.05 + rand(k + p * 7) * 0.12})`;
        g.lineWidth = 1 + rand(k * 3 + p) * 2;
        g.beginPath();
        g.moveTo(0, yy);
        for (let x = 0; x <= 1024; x += 64) g.lineTo(x, yy + Math.sin(x / 140 + k) * 3);
        g.stroke();
      }
    }
  });

export const quiltTexture = (base: string, line: string) =>
  canvasTexture(1024, 1024, (g) => {
    g.fillStyle = base;
    g.fillRect(0, 0, 1024, 1024);
    // soft quilting: shaded pillows between stitch lines
    const n = 6;
    const s = 1024 / n;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const gr = g.createRadialGradient(i * s + s / 2, j * s + s / 2, s * 0.1, i * s + s / 2, j * s + s / 2, s * 0.75);
        gr.addColorStop(0, 'rgba(255,255,255,0.10)');
        gr.addColorStop(1, 'rgba(0,0,0,0.16)');
        g.fillStyle = gr;
        g.fillRect(i * s, j * s, s, s);
      }
    g.strokeStyle = line;
    g.lineWidth = 3;
    g.setLineDash([10, 8]);
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, 1024); g.stroke();
      g.beginPath(); g.moveTo(0, i * s); g.lineTo(1024, i * s); g.stroke();
    }
  });

export const Spot: React.FC<{position: [number, number, number]; target: [number, number, number]; angle?: number; penumbra?: number; intensity?: number; distance?: number; decay?: number; color?: string; castShadow?: boolean}> = ({target, ...p}) => {
  const obj = useMemo(() => new THREE.Object3D(), []);
  obj.position.set(...target);
  return (
    <>
      <primitive object={obj} />
      <spotLight {...p} target={obj} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0008} />
    </>
  );
};
