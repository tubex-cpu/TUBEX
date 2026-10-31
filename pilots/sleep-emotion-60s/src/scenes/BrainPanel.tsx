import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AMYG, Brain3D, MPFC, projectToScreen} from '../three/Brain3D';
import {CameraRig} from '../three/common';
import {C, FONT} from '../theme';

type Props = {f: number; x: number; y: number; w: number; h: number; amyg: number; pfc?: number; link?: number; coupling?: number; rot: number; note?: string; noteColor?: string};
const CAM = {pos: [-2.75, 0.55, 1.25] as [number, number, number], target: [0.02, -0.12, 0.0] as [number, number, number], fov: 30};

// 3D brain (self-made procedural model) with 2D labels projected from the 3D region positions.
export const BrainPanel: React.FC<Props> = ({f, x, y, w, h, amyg, pfc = 0, link = 0, coupling = 1, rot, note, noteColor}) => {
  const lab = (p: [number, number, number]) => projectToScreen(p, rot, CAM, w, h);
  const a = lab(AMYG[0]);
  const m = lab(MPFC[0]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <ThreeCanvas width={w} height={h} gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, alpha: true}} style={{position: 'absolute', inset: 0}}>
        <CameraRig pos={CAM.pos} target={CAM.target} fov={CAM.fov} />
        <hemisphereLight args={['#c9d6ff', '#20263a', 0.65]} />
        <directionalLight position={[-3, 3, 2.5]} intensity={1.5} color="#fff4ea" />
        <directionalLight position={[2.5, 1.2, -3]} intensity={1.6} color="#7fa2ff" />
        <directionalLight position={[0, -3, 1]} intensity={0.3} color="#ffb48a" />
        <Brain3D t={f / 30} rotY={rot} amyg={amyg} pfc={pfc} link={link} coupling={coupling} />
      </ThreeCanvas>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}} fontFamily={FONT}>
        <g opacity={Math.min(1, amyg * 1.5)}>
          <line x1={a[0]} y1={a[1]} x2={a[0] + 90} y2={a[1] + 120} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
          <circle cx={a[0]} cy={a[1]} r={5} fill="#fff" />
          <text x={a[0] + 96} y={a[1] + 132} fontSize={32} fontWeight={800} fill={C.amyg} style={{paintOrder: 'stroke'}} stroke="#0b1020" strokeWidth={6}>扁桃体</text>
        </g>
        {pfc > 0 && (
          <g opacity={pfc}>
            <line x1={m[0]} y1={m[1]} x2={m[0] - 40} y2={m[1] - 150} stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
            <circle cx={m[0]} cy={m[1]} r={5} fill="#fff" />
            <text x={m[0] - 40} y={m[1] - 162} fontSize={32} fontWeight={800} fill={C.pfc} textAnchor="middle" style={{paintOrder: 'stroke'}} stroke="#0b1020" strokeWidth={6}>前頭前野（内側）</text>
          </g>
        )}
        <text x={18} y={h - 14} fontSize={20} fill={C.sub}>脳のCGモデル（自作の模式。部位の位置はおおよそ）</text>
        {note && <text x={w / 2} y={36} fontSize={30} fontWeight={800} fill={noteColor ?? C.text} textAnchor="middle">{note}</text>}
      </svg>
    </div>
  );
};
