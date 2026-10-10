import '@fontsource/noto-sans-jp/500.css';
import '@fontsource/noto-sans-jp/900.css';
import '@fontsource/dela-gothic-one/400.css';
import React from 'react';
import {Composition, Still} from 'remotion';
import {Episode} from './Episode';
import {Thumbnail} from './Thumbnail';
import {EpisodeScript} from './types';
import defaultScript from '../../episodes/001-sleep-without-brain/script.json';

const fallback = defaultScript as EpisodeScript;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Episode"
      component={Episode}
      width={1920}
      height={1080}
      fps={fallback.fps}
      durationInFrames={1}
      defaultProps={fallback}
      calculateMetadata={({props}) => ({
        fps: props.fps,
        durationInFrames: props.scenes.reduce((s, sc) => s + Math.round(sc.seconds * props.fps), 0),
      })}
    />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} defaultProps={fallback} />
  </>
);
