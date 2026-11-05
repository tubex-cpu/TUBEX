import '@fontsource/noto-sans-jp/900.css';
import {Composition} from 'remotion';
import {BgBed, BgBedLamp, BgDesk, BgLiving, BgMri, BgWhite} from './Stills';
import {FULL_FRAMES, Full, SUB_CHUNKS, SubCard} from './full/Full';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: false}} />
    <Composition id="FullNoGrain" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: false, grain: false}} />
    <Composition id="FullSubs" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: true}} />
    <Composition id="SubCards" component={SubCard} durationInFrames={SUB_CHUNKS.length} fps={30} width={1920} height={1080} />
    {([['BgBed', BgBed], ['BgBedLamp', BgBedLamp], ['BgDesk', BgDesk], ['BgLiving', BgLiving], ['BgMri', BgMri], ['BgWhite', BgWhite]] as const).map(([id, C]) => (
      <Composition key={id} id={id} component={C} durationInFrames={1} fps={30} width={1920} height={1080} />
    ))}
  </>
);
