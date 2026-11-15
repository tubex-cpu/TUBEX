// ルール改変ニッポンのサムネの主役素材（3D）。黄色の背景、黒い立体の棒人間（目・口なし）。文字は描かない（文字は scripts/compose.py で OFL の Noto Serif JP を別に組む）
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';

const W = 1280, H = 720;
const YELLOW = '#FFD60A';
const BLACK = '#141414';
const CREAM = '#F4EBD3';
const RED = '#E0322C';

const blackMat = {color: BLACK, roughness: 0.32, metalness: 0.15};
const creamMat = {color: CREAM, roughness: 0.6, metalness: 0};

// 黒い立体の棒人間。armL / armR：腕の角度（ラジアン、0＝下ろす、正＝前に上げる）
const Figure: React.FC<{p: [number, number, number]; ry?: number; armL?: number; armR?: number; s?: number}> = ({p, ry = 0, armL = 0.15, armR = 0.15, s = 1}) => (
  <group position={p} rotation={[0, ry, 0]} scale={s}>
    <mesh position={[0, 1.78, 0]} castShadow><sphereGeometry args={[0.34, 48, 48]} /><meshStandardMaterial {...blackMat} /></mesh>
    <mesh position={[0, 1.12, 0]} castShadow><capsuleGeometry args={[0.27, 0.62, 8, 24]} /><meshStandardMaterial {...blackMat} /></mesh>
    {[-0.14, 0.14].map((x) => (
      <mesh key={x} position={[x, 0.4, 0]} castShadow><capsuleGeometry args={[0.11, 0.62, 8, 16]} /><meshStandardMaterial {...blackMat} /></mesh>
    ))}
    {[[-0.36, armL], [0.36, armR]].map(([x, a]) => (
      <group key={x} position={[x, 1.42, 0]} rotation={[-a, 0, x < 0 ? 0.12 : -0.12]}>
        <mesh position={[0, -0.36, 0]} castShadow><capsuleGeometry args={[0.095, 0.56, 8, 16]} /><meshStandardMaterial {...blackMat} /></mesh>
      </group>
    ))}
  </group>
);

const Lights: React.FC = () => (
  <>
    <ambientLight intensity={0.75} />
    <hemisphereLight args={['#fff8e0', '#d9b400', 0.55]} />
    <directionalLight position={[-6, 10, 8]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-0.0004} />
    <directionalLight position={[7, 4, 6]} intensity={0.6} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><shadowMaterial opacity={0.22} /></mesh>
  </>
);

// 家賃が全国同じ：アパートの前で、抽選のガラガラに並ぶ人たち
const Rent: React.FC = () => (
  <>
    {/* アパート */}
    <group position={[3.0, 0, -1.6]}>
      <mesh position={[0, 1.45, 0]} castShadow receiveShadow><boxGeometry args={[3.2, 2.9, 1.8]} /><meshStandardMaterial {...creamMat} /></mesh>
      <mesh position={[0, 2.98, 0]} castShadow><boxGeometry args={[3.4, 0.16, 2.0]} /><meshStandardMaterial {...blackMat} /></mesh>
      {[0, 1, 2].flatMap((r) => [-1.0, 0, 1.0].map((x) => (
        <mesh key={`${r}-${x}`} position={[x, 1.15 + r * 0.7, 0.91]}><boxGeometry args={[0.6, 0.44, 0.04]} /><meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.2} /></mesh>
      )))}
      <mesh position={[0, 0.38, 0.91]}><boxGeometry args={[0.56, 0.76, 0.04]} /><meshStandardMaterial {...blackMat} /></mesh>
    </group>
    {/* 抽選のガラガラ（八角形の箱・台・取っ手・玉の受け皿） */}
    <group position={[0.45, 0, 0.9]}>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow><boxGeometry args={[1.5, 0.96, 0.9]} /><meshStandardMaterial {...creamMat} /></mesh>
      <group position={[0, 1.6, 0]} rotation={[0.35, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.62, 0.62, 0.95, 6]} /><meshStandardMaterial color="#B5652A" roughness={0.55} /></mesh>
        {[-0.49, 0.49].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.64, 0.64, 0.05, 6]} /><meshStandardMaterial {...blackMat} /></mesh>
        ))}
        <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 0.3, 12]} /><meshStandardMaterial {...blackMat} /></mesh>
        <mesh position={[0.76, -0.25, 0]} castShadow><boxGeometry args={[0.07, 0.55, 0.07]} /><meshStandardMaterial {...blackMat} /></mesh>
        <mesh position={[0.76, -0.52, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.2, 12]} /><meshStandardMaterial {...blackMat} /></mesh>
      </group>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 1.2, 0]} castShadow><boxGeometry args={[0.1, 0.5, 0.1]} /><meshStandardMaterial {...blackMat} /></mesh>
      ))}
      <mesh position={[0.62, 0.99, 0.2]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.5, 0.05, 0.42]} /><meshStandardMaterial {...blackMat} /></mesh>
      <mesh position={[0.56, 1.08, 0.24]} castShadow><sphereGeometry args={[0.1, 32, 32]} /><meshStandardMaterial color="#ffffff" roughness={0.3} /></mesh>
      <mesh position={[0.74, 1.08, 0.16]} castShadow><sphereGeometry args={[0.1, 32, 32]} /><meshStandardMaterial color="#d4a017" roughness={0.25} metalness={0.5} /></mesh>
    </group>
    {/* ガラガラを回す人と、並ぶ人たち */}
    <Figure p={[-0.75, 0, 0.9]} ry={Math.PI / 2} armR={1.3} />
    <Figure p={[-1.9, 0, 0.9]} ry={Math.PI / 2} />
    <Figure p={[-3.0, 0, 0.9]} ry={Math.PI / 2} />
    <Figure p={[-4.1, 0, 0.9]} ry={Math.PI / 2} />
  </>
);

// 現金が使えない：レジでスマホを出す人と、横にある大きな赤い停止ボタンに手をかける人
const Cash: React.FC = () => (
  <>
    {/* レジ台とレジ */}
    <group position={[-0.5, 0, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow><boxGeometry args={[2.2, 1.1, 1.0]} /><meshStandardMaterial {...creamMat} /></mesh>
      <mesh position={[0.2, 1.3, 0]} castShadow><boxGeometry args={[0.8, 0.4, 0.6]} /><meshStandardMaterial {...blackMat} /></mesh>
      <mesh position={[0.2, 1.68, -0.05]} rotation={[-0.35, 0, 0]} castShadow><boxGeometry args={[0.6, 0.38, 0.06]} /><meshStandardMaterial {...blackMat} /></mesh>
      <mesh position={[0.2, 1.69, -0.015]} rotation={[-0.35, 0, 0]}><boxGeometry args={[0.5, 0.28, 0.01]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} /></mesh>
    </group>
    {/* スマホを出す客（画面はこちら向き） */}
    <Figure p={[-2.55, 0, 0.35]} ry={Math.PI / 2 - 0.35} armR={1.4} />
    <group position={[-1.95, 1.62, 0.75]} rotation={[0, -0.25, 0]}>
      <mesh castShadow><boxGeometry args={[0.36, 0.64, 0.05]} /><meshStandardMaterial {...blackMat} /></mesh>
      <mesh position={[0, 0, 0.028]}><boxGeometry args={[0.3, 0.55, 0.005]} /><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.45} /></mesh>
    </group>
    {/* 大きな赤い停止ボタン */}
    <group position={[2.0, 0, 0.3]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.5, 1.1, 48]} /><meshStandardMaterial {...creamMat} /></mesh>
      <mesh position={[0, 1.2, 0]} castShadow><cylinderGeometry args={[0.55, 0.55, 0.22, 48]} /><meshStandardMaterial {...blackMat} /></mesh>
      <mesh position={[0, 1.39, 0]} castShadow><cylinderGeometry args={[0.45, 0.47, 0.22, 48]} /><meshStandardMaterial color={RED} roughness={0.25} metalness={0.1} /></mesh>
    </group>
    {/* ボタンに手をかける人 */}
    <Figure p={[2.75, 0, 0.1]} ry={-Math.PI / 2 + 0.2} armR={1.55} />
  </>
);

const CAMS: Record<string, {pos: [number, number, number]; target: [number, number, number]; fov: number}> = {
  rent: {pos: [0.0, 3.6, 12.6], target: [-0.1, 1.45, 0], fov: 33},
  cash: {pos: [0.2, 3.1, 8.6], target: [0.1, 1.25, 0], fov: 33},
};

export const Scene: React.FC<{id: string}> = ({id}) => {
  const c = CAMS[id];
  return (
    <div style={{position: 'absolute', inset: 0, background: YELLOW}}>
      <ThreeCanvas width={W} height={H} shadows={{type: THREE.PCFSoftShadowMap}} gl={{antialias: true, preserveDrawingBuffer: true, toneMapping: THREE.NoToneMapping}}
        camera={{position: c.pos, fov: c.fov, near: 0.1, far: 200}} onCreated={({camera}) => camera.lookAt(...c.target)} style={{position: 'absolute', inset: 0}}>
        <color attach="background" args={[YELLOW]} />
        <Lights />
        {id === 'rent' ? <Rent /> : <Cash />}
      </ThreeCanvas>
    </div>
  );
};
