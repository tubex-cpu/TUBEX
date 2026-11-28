// Usage:
//   node scripts/render.mjs --still <CompositionId> <frame> <out.png>
//   node scripts/render.mjs <CompositionId> <out.mp4> [--frames=a-b] [--scale=0.5]
// Fully local. Uses the pre-installed Chromium headless shell when present.
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const pos = args.filter((a) => !a.startsWith('--'));

const findShell = () => {
  const base = '/opt/pw-browsers';
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base).filter((d) => d.startsWith('chromium_headless_shell-'))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    .flatMap((d) => ['chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-linux/headless_shell'].map((f) => path.join(base, d, f)));
};
const browserExecutable = [process.env.REMOTION_BROWSER, ...findShell()].find((p) => p && fs.existsSync(p)) ?? null;
const chromiumOptions = {gl: process.env.REMOTION_GL ?? 'swangle'};
console.log('browser:', browserExecutable ?? '(Remotion default)', 'gl:', chromiumOptions.gl);

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const common = {serveUrl, browserExecutable, chromiumOptions, timeoutInMilliseconds: 120000};

if (args.includes('--still')) {
  const [id, frame, out] = pos;
  const composition = await selectComposition({...common, id});
  await renderStill({...common, composition, frame: Number(frame), output: path.resolve(out), scale: Number(flag('scale') ?? 1)});
  console.log('still:', out);
} else {
  const [id, out] = pos;
  const composition = await selectComposition({...common, id});
  const fr = flag('frames')?.split('-').map(Number);
  let last = -1;
  await renderMedia({
    ...common, composition, codec: 'h264', crf: 18, outputLocation: path.resolve(out),
    frameRange: fr ? [fr[0], fr[1]] : undefined, scale: Number(flag('scale') ?? 1),
    concurrency: Number(flag('concurrency') ?? 4), audioCodec: 'aac', audioBitrate: '192k',
    onProgress: ({progress}) => { const p = Math.floor(progress * 100); if (p % 10 === 0 && p !== last) { last = p; console.log(`${p}%`); } },
  });
  console.log('video:', out);
}
