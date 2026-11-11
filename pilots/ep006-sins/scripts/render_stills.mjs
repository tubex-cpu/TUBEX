// Renders the CG background stills (compositions Bg*) into public/bg/<name>.png. Usage: node scripts/render_stills.mjs BgBed BgDesk ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ids = process.argv.slice(2);
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000};
  for (const id of ids) {
    const composition = await selectComposition({...common, id});
    const name = id.replace(/^Bg/, '').replace(/^./, (c) => c.toLowerCase());
    await renderStill({...common, composition, frame: 0, imageFormat: 'png', output: path.join(root, `public/bg/${name}.png`)});
    console.log('still', id);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
