import {Composition} from 'remotion';
import {Scene} from './Scenes';

export const RemotionRoot: React.FC = () => (
  <Composition id="Thumb3D" component={Scene} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{id: 'rent'}} />
);
