import {continueRender, delayRender, staticFile} from 'remotion';

// 地球の事情 v4 bright look (社長 2026-11-12): rounded gothic, light background
export const FONT = '"MPR", sans-serif';
export const C = {
  ink: '#262a32', amber: '#d67600', teal: '#00847a', red: '#ce3c30', muted: '#626872',
  paper: '#f4f1ea', table: '#e7e1d6', sky: '#eef3f7', white: '#ffffff',
};
export const FPS = 30;
export const RW = 1440, RH = 810; // 3D is drawn at 1440x810 and scaled to 1920x1080 (as in ルール改変ニッポン v2)
export const PLATE_HOST = 'http://127.0.0.1:8765';

let fontsReady: Promise<void> | null = null;
export const loadFonts = () => {
  if (!fontsReady) {
    const h = delayRender('fonts');
    const faces = [
      new FontFace('MPR', `url(${staticFile('fonts/MPLUSRounded1c_800ExtraBold.ttf')})`, {weight: '800'}),
      new FontFace('MPR', `url(${staticFile('fonts/MPLUSRounded1c_700Bold.ttf')})`, {weight: '700'}),
    ];
    fontsReady = Promise.all(faces.map((f) => f.load().then((ff) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(ff)))).then(() => continueRender(h));
  }
  return fontsReady;
};
