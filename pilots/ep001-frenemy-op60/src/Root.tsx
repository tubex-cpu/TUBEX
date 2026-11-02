import {Composition} from 'remotion';
import {Main, Main30} from './Main';
import {P2_FRAMES, Part2} from './scenes/Part2';
import {BgApartment, BgCafe, FULL_FRAMES, Full} from './full/Full';
import {CafeTest, FaceTest, MascotTest, SetTest} from './Tests';
export const RemotionRoot = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={1800} fps={30} width={1920} height={1080} />
    <Composition id="Full" component={Full} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="BgCafe" component={BgCafe} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="BgApartment" component={BgApartment} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="Part2" component={Part2} durationInFrames={P2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Main30" component={Main30} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="MascotTest" component={MascotTest} durationInFrames={60} fps={30} width={1080} height={1080} />
    <Composition id="CafePOV" component={CafeTest} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{cam: 0}} />
    <Composition id="CafeClose" component={CafeTest} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{cam: 1}} />
    <Composition id="CafeWide" component={CafeTest} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{cam: 2}} />
    <Composition id="FaceA" component={FaceTest} durationInFrames={1} fps={30} width={800} height={900} defaultProps={{smile: 0.25}} />
    <Composition id="FaceB" component={FaceTest} durationInFrames={1} fps={30} width={800} height={900} defaultProps={{smile: 1, open: 0.25, yaw: 0.5}} />
    <Composition id="FaceC" component={FaceTest} durationInFrames={1} fps={30} width={800} height={900} defaultProps={{smile: 0.25, lid: 0.75, yaw: -0.4}} />
    {['apt', 'street', 'street2', 'hall'].map((k) => <Composition key={k} id={`Set-${k}`} component={SetTest} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{set: k}} />)}
  </>
);
