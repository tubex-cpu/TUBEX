import {Composition} from 'remotion';
import {GLTest} from './GLTest';
import {Main} from './Main';
import {BedroomTest, MascotTest} from './Tests';
export const RemotionRoot = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={1800} fps={30} width={1920} height={1080} />
    <Composition id="GLTest" component={GLTest} durationInFrames={30} fps={30} width={1920} height={1080} />
    <Composition id="BedroomTest" component={BedroomTest} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{cam: 0}} />
    <Composition id="BedroomClose" component={BedroomTest} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{cam: 1}} />
    <Composition id="MascotTest" component={MascotTest} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
