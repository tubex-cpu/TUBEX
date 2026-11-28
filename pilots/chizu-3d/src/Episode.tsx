import {AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import ca from './data/ca.json';
import bm from './data/bm.json';
import {BigShot, CardShot, Data, GlobeShot, MapShot, Shot} from './shots';
import {HEROES} from './heroes';
import {FONT, FPS} from './theme';
import {useFonts} from './three/Stage';

export const DATA: Record<string, Data> = {ca: ca as unknown as Data, bm: bm as unknown as Data};
export const frames = (ep: string) => Math.ceil(DATA[ep].total * FPS);

const ShotView: React.FC<{shot: Shot; data: Data; ep: string; first: boolean}> = ({shot, data, ep, first}) => {
  const f = useCurrentFrame();
  const xf = Math.round(data.xf * FPS);
  const o = first ? 1 : interpolate(f, [0, xf], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const hero = HEROES[ep]?.[shot.i];
  const K = hero ?? (shot.kind === 'map' ? MapShot : shot.kind === 'globe' ? GlobeShot : shot.big ? BigShot : CardShot);
  return <AbsoluteFill style={{opacity: o}}><K shot={shot} data={data} ep={ep} /></AbsoluteFill>;
};

// subtitles: Bermuda v4 look (white rounded ExtraBold 72px, thin gray edge, soft shadow), 2 lines max
const Subs: React.FC<{data: Data}> = ({data}) => {
  const ok = useFonts();
  const t = useCurrentFrame() / FPS;
  const c = data.subs.find((s) => s.start - 0.05 <= t && t < s.end + 0.05);
  if (!c || !ok) return null;
  return (
    <AbsoluteFill>
      {c.lines.map((ln, j) => (
        <div key={j} style={{position: 'absolute', left: 0, right: 0, top: 1080 - 62 - (c.lines.length - 1 - j) * 88 - 72, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 72, lineHeight: '72px', color: '#ffffff',
          WebkitTextStroke: '2px rgb(120,120,124)', paintOrder: 'stroke fill', textShadow: '0 5px 10px rgba(30,30,34,0.75), 0 2px 18px rgba(30,30,34,0.45)', whiteSpace: 'nowrap'}}>{ln}</div>
      ))}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.045, mixBlendMode: 'overlay', backgroundImage: `url(${staticFile(`grain/g${f % 4}.png`)})`, backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`, backgroundSize: '512px 512px'}} />;
};

export const Episode: React.FC<{ep: string; subs?: boolean; from?: number}> = ({ep, subs = true}) => {
  const data = DATA[ep];
  return (
    <AbsoluteFill style={{background: '#eef3f7'}}>
      {data.shots.map((s, k) => {
        const from = Math.round(s.start * FPS);
        const dur = Math.round((s.end + (k + 1 < data.shots.length ? data.xf : 0)) * FPS) - from;
        return (
          <Sequence key={s.i} from={from} durationInFrames={Math.max(1, dur)} premountFor={15}>
            <ShotView shot={s} data={data} ep={ep} first={k === 0} />
          </Sequence>
        );
      })}
      <Grain />
      {subs && <Subs data={data} />}
    </AbsoluteFill>
  );
};
