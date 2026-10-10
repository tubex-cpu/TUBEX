// Usage: npm run render -- <episode-dir-name> [--thumb-only]
// Renders episodes/<name>/script.json to video/out/<name>.mp4 and thumbnail.png. Fully local, no paid APIs.
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const name = process.argv[2];
if (!name) {
  console.error('episode name required, e.g. npm run render -- 001-sleep-without-brain');
  process.exit(1);
}
const thumbOnly = process.argv.includes('--thumb-only');
const episodeDir = path.resolve(root, '..', 'episodes', name);
const inputProps = JSON.parse(fs.readFileSync(path.join(episodeDir, 'script.json'), 'utf8'));

// Use a locally installed Chromium if present, so Remotion does not download one.
const candidates = [process.env.REMOTION_BROWSER, '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'];
const browserExecutable = candidates.find((p) => p && fs.existsSync(p)) ?? null;

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
fs.mkdirSync(path.join(root, 'out'), {recursive: true});

const thumb = await selectComposition({serveUrl, id: 'Thumbnail', inputProps, browserExecutable});
const thumbPath = path.join(episodeDir, 'thumbnail.png');
await renderStill({serveUrl, composition: thumb, inputProps, output: thumbPath, browserExecutable});
console.log('thumbnail:', thumbPath);

if (!thumbOnly) {
  const comp = await selectComposition({serveUrl, id: 'Episode', inputProps, browserExecutable});
  const out = path.join(root, 'out', `${name}.mp4`);
  let lastPct = -1;
  await renderMedia({
    serveUrl,
    composition: comp,
    inputProps,
    codec: 'h264',
    outputLocation: out,
    browserExecutable,
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastPct) console.log(`render ${pct}%`);
      lastPct = pct;
    },
  });
  console.log('video:', out);
  // Lightweight copy committed next to the episode so auditors and the owner can watch it from the PR.
  const preview = path.join(episodeDir, 'preview.mp4');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', preview]);
  console.log('preview:', preview);
}
