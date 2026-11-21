import '@fontsource/noto-sans-jp/900.css';
import {Composition} from 'remotion';
import {FULL_FRAMES, Full, SUB_CHUNKS, SubCard} from './full/Full';
import {BgStill} from './full/Bg';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: false}} />
    <Composition id="FullNoGrain" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: false, grain: false}} />
    <Composition id="FullSubs" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} defaultProps={{withSubs: true, grain: false}} />
    <Composition id="Bg" component={BgStill} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{id: 'payday_street'}} />
    <Composition id="SubCards" component={SubCard} durationInFrames={SUB_CHUNKS.length} fps={30} width={1920} height={1080} />
  </>
);
