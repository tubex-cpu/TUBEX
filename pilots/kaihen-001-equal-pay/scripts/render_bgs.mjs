// Renders every background set (src/three/Sets.tsx) once into public/bg/<id>.png. Usage: node scripts/render_bgs.mjs [id,id,...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/bg');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const src = fs.readFileSync(path.join(root, 'src/three/Sets.tsx'), 'utf8');
const all = [...src.matchAll(/^  ([a-z0-9_]+): \{cam:/gm)].map((m) => m[1]);
const ids = process.argv[2] ? process.argv[2].split(',') : all;
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  for (const id of ids) {
    const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000, inputProps: {id}};
    const composition = await selectComposition({...common, id: 'Bg'});
    await renderStill({...common, composition, frame: 0, imageFormat: 'png', output: path.join(out, `${id}.png`)});
    console.log('bg', id);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}
