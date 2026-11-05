import '@fontsource/noto-sans-jp/900.css';
import {Composition} from 'remotion';
import {BgBed, BgBedLamp, BgDesk, BgLiving, BgMri, BgWhite} from './Stills';

export const RemotionRoot: React.FC = () => (
  <>
    {([['BgBed', BgBed], ['BgBedLamp', BgBedLamp], ['BgDesk', BgDesk], ['BgLiving', BgLiving], ['BgMri', BgMri], ['BgWhite', BgWhite]] as const).map(([id, C]) => (
      <Composition key={id} id={id} component={C} durationInFrames={1} fps={30} width={1920} height={1080} />
    ))}
  </>
);
