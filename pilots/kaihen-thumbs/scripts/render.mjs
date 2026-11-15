// 3D の主役素材を out/<id>_3d.png に書き出す（文字なし）。Usage: node scripts/render.mjs [rent,cash]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const ids = (process.argv[2] || 'rent,cash').split(',');
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
try {
  for (const id of ids) {
    const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000, inputProps: {id}};
    const composition = await selectComposition({...common, id: 'Thumb3D'});
    await renderStill({...common, composition, frame: 0, imageFormat: 'png', output: path.join(out, `${id}_3d.png`)});
    console.log('3d', id);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
