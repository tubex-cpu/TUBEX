// Renders one transparent PNG per subtitle line (composition SubCards) into out/subs/s0000.png ...
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out/subs');
fs.rmSync(out, {recursive: true, force: true});
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}};
const composition = await selectComposition({...common, id: 'SubCards'});
await renderFrames({...common, composition, outputDir: out, imageFormat: 'png', concurrency: 1, onStart: () => {}, onFrameUpdate: () => {}});
for (const f of fs.readdirSync(out)) {
  const m = f.match(/(\d+)\.png$/);
  if (m) fs.renameSync(path.join(out, f), path.join(out, `s${String(Number(m[1])).padStart(4, '0')}.png`));
}
fs.rmSync(serveUrl, {recursive: true, force: true});
console.log('subs:', fs.readdirSync(out).length);
