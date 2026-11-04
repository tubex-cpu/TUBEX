import {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {canvasTexture} from './common';
import {Env} from './Decor';

// Bright "thought experiment" room: a seamless white cyclorama with soft light.
export const WhiteRoom: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const cyc = useMemo(() => {
    // floor that curves up into the back wall (no visible corner)
    const shape: THREE.Vector2[] = [];
    for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI / 2; shape.push(new THREE.Vector2(-6 + 3 * Math.sin(a), 3 - 3 * Math.cos(a))); }
    shape.push(new THREE.Vector2(-3, 8));
    const pts = shape.map((p) => new THREE.Vector3(0, p.y, p.x));
    const g = new THREE.BufferGeometry();
    const W = 30, N = pts.length;
    const pos: number[] = [], idx: number[] = [];
    for (let i = 0; i < N; i++) { pos.push(-W, pts[i].y, pts[i].z, W, pts[i].y, pts[i].z); }
    for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    // floor in front
    const base = pos.length / 3;
    pos.push(-W, 0, -3, W, 0, -3, -W, 0, 12, W, 0, 12);
    idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group>
      <Env name="lab" intensity={0.6} />
      <color attach="background" args={['#f2f1ee']} />
      <fog attach="fog" args={['#f2f1ee', 9, 26]} />
      <hemisphereLight args={['#ffffff', '#d9d6d0', 0.9]} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-radius={6} />
      <mesh geometry={cyc} receiveShadow><meshStandardMaterial color="#f4f3f0" roughness={0.95} side={THREE.DoubleSide} /></mesh>
      {children}
    </group>
  );
};

// floating card with an illustration texture on the front
export const Card3D: React.FC<{tex: THREE.Texture; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; glow?: number; dim?: number}> = ({tex, position, rotation, scale = 1, glow = 0, dim = 0}) => {
  const g = useMemo(() => new RoundedBoxGeometry(1.6, 1.0, 0.03, 4, 0.03), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={g} castShadow receiveShadow><meshStandardMaterial color="#ffffff" roughness={0.6} emissive="#ff3b2f" emissiveIntensity={glow * 0.35} /></mesh>
      <mesh position={[0, 0, 0.0155]}><planeGeometry args={[1.54, 0.94]} /><meshStandardMaterial map={tex} roughness={0.7} color={new THREE.Color().setScalar(1 - 0.55 * dim)} /></mesh>
      {glow > 0 && <mesh position={[0, 0, -0.02]}><planeGeometry args={[1.75, 1.15]} /><meshBasicMaterial color="#ff4a3d" transparent opacity={0.35 * glow} toneMapped={false} /></mesh>}
    </group>
  );
};

// ---- card illustrations (flat, self-drawn) ----
const person = (g: CanvasRenderingContext2D, x: number, y: number, s: number, body: string, head = '#e8c3a6') => {
  g.fillStyle = body;
  g.beginPath(); g.moveTo(x - 46 * s, y + 120 * s); g.quadraticCurveTo(x - 46 * s, y + 20 * s, x, y + 18 * s); g.quadraticCurveTo(x + 46 * s, y + 20 * s, x + 46 * s, y + 120 * s); g.closePath(); g.fill();
  g.fillStyle = head; g.beginPath(); g.arc(x, y - 14 * s, 28 * s, 0, Math.PI * 2); g.fill();
};
const caption = (g: CanvasRenderingContext2D, num: string, text: string) => {
  g.fillStyle = '#1d2230'; g.fillRect(0, 470, 1024, 170);
  g.fillStyle = '#ffd166'; g.font = `900 64px "Noto Sans CJK JP"`; g.textBaseline = 'middle'; g.fillText(num, 40, 555);
  g.fillStyle = '#ffffff'; g.font = `700 34px "Noto Sans CJK JP"`;
  const lines = text.split('\n');
  lines.forEach((l, i) => g.fillText(l, 130, 555 + (i - (lines.length - 1) / 2) * 50));
};
export const cardTex = (k: 1 | 2 | 3) =>
  canvasTexture(1024, 640, (g) => {
    const bg = g.createLinearGradient(0, 0, 0, 470);
    if (k === 1) {
      bg.addColorStop(0, '#20263a'); bg.addColorStop(1, '#3b3150'); g.fillStyle = bg; g.fillRect(0, 0, 1024, 470);
      // a TV frame with a spotlight, a star on stage and gold coins
      g.fillStyle = '#0e1018'; g.fillRect(230, 40, 560, 380); g.strokeStyle = '#8e95a8'; g.lineWidth = 14; g.strokeRect(230, 40, 560, 380);
      const sp = g.createRadialGradient(510, 120, 10, 510, 260, 260); sp.addColorStop(0, 'rgba(255,240,200,0.9)'); sp.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = sp; g.fillRect(244, 54, 532, 352);
      person(g, 510, 210, 1.1, '#f2c14e');
      g.strokeStyle = '#f2c14e'; g.lineWidth = 16; g.lineCap = 'round';
      g.beginPath(); g.moveTo(470, 245); g.lineTo(430, 180); g.moveTo(550, 245); g.lineTo(590, 180); g.stroke();
      for (let i = 0; i < 14; i++) { g.fillStyle = '#ffcf4a'; g.beginPath(); g.ellipse(270 + (i * 37) % 480, 70 + ((i * 53) % 120), 14, 9, 0.4, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#8e95a8'; g.fillRect(470, 420, 80, 30);
      caption(g, '①', '世界的な有名人が\n何十億円という大成功をおさめた');
    } else if (k === 2) {
      bg.addColorStop(0, '#e8eef6'); bg.addColorStop(1, '#cfd9e8'); g.fillStyle = bg; g.fillRect(0, 0, 1024, 470);
      person(g, 300, 200, 1.4, '#7d8796'); // you
      g.fillStyle = '#4a5160'; g.font = `700 34px "Noto Sans CJK JP"`; g.textAlign = 'center'; g.fillText('あなた', 300, 430);
      g.setLineDash([16, 14]); g.strokeStyle = '#8a94a6'; g.lineWidth = 6; g.beginPath(); g.moveTo(512, 40); g.lineTo(512, 440); g.stroke(); g.setLineDash([]);
      person(g, 720, 200, 1.4, '#3f8f6b'); // friend, different job (apron)
      g.fillStyle = '#ffffff'; g.fillRect(690, 260, 60, 90);
      g.fillStyle = '#e0533d'; g.beginPath(); g.moveTo(840, 200); g.lineTo(880, 140); g.lineTo(920, 200); g.closePath(); g.fill(); g.fillRect(866, 200, 28, 70);
      g.fillStyle = '#4a5160'; g.fillText('違う仕事の友達', 720, 430); g.textAlign = 'left';
      caption(g, '②', 'あなたとまったく違う仕事をしている友達が\n昇進した');
    } else {
      bg.addColorStop(0, '#f6ebe6'); bg.addColorStop(1, '#ead2c8'); g.fillStyle = bg; g.fillRect(0, 0, 1024, 470);
      // staircase: friend one step ahead of you, same suits
      g.fillStyle = '#cdb4a8';
      for (let i = 0; i < 5; i++) g.fillRect(150 + i * 150, 420 - i * 60, 150, 60 + i * 60);
      person(g, 450, 230, 1.1, '#3b4a66');
      person(g, 640, 170, 1.1, '#3b4a66');
      g.fillStyle = '#e0533d'; g.beginPath(); g.moveTo(700, 70); g.lineTo(735, 20); g.lineTo(770, 70); g.closePath(); g.fill(); g.fillRect(723, 70, 24, 50);
      g.fillStyle = '#4a5160'; g.font = `700 34px "Noto Sans CJK JP"`; g.textAlign = 'center';
      g.fillText('あなた', 450, 405); g.fillText('同じ仕事の友達', 820, 190); g.textAlign = 'left';
      caption(g, '③', 'あなたと同じ仕事をしていてずっと一緒に\nがんばってきた友達があなたより先に昇進した');
    }
  });

export const signTex = () =>
  canvasTexture(1024, 400, (g) => {
    g.fillStyle = '#1d2230'; g.fillRect(0, 0, 1024, 400);
    g.strokeStyle = '#ffd166'; g.lineWidth = 10; g.strokeRect(24, 24, 976, 352);
    g.fillStyle = '#ffffff'; g.font = `900 150px "Noto Sans CJK JP"`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('思考実験', 512, 190);
    g.fillStyle = '#ffd166'; g.font = `700 40px "Noto Sans CJK JP"`; g.fillText('あなた自身の心で試す', 512, 320);
  });
