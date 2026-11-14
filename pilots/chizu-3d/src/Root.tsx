import {Composition} from 'remotion';
import {Episode, frames} from './Episode';
import {BermudaRoofs} from './heroes/BermudaRoofs';
import {CanadaQuestion} from './heroes/CanadaQuestion';

// Hero scenes are rendered here (true 3D) and composited into the main edit by scripts/comp3d.py.
export const HERO_COMPS: {id: string; component: React.FC; frames: number}[] = [
  {id: 'BM-H1', component: BermudaRoofs, frames: Math.round((10.806 + 0.4 - 2.818) * 30)},
  {id: 'CA-H1', component: CanadaQuestion, frames: Math.round((27.871 + 0.4 - 20.224) * 30)},
];

export const RemotionRoot: React.FC = () => (
  <>
    {HERO_COMPS.map((h) => <Composition key={h.id} id={h.id} component={h.component} durationInFrames={h.frames} fps={30} width={1920} height={1080} />)}
    <Composition id="CA" component={Episode} durationInFrames={frames('ca')} fps={30} width={1920} height={1080} defaultProps={{ep: 'ca'}} />
    <Composition id="BM" component={Episode} durationInFrames={frames('bm')} fps={30} width={1920} height={1080} defaultProps={{ep: 'bm'}} />
  </>
);
