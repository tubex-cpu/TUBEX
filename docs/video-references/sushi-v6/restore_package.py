#!/usr/bin/env python3
"""Download, verify, and restore the approved Claude Code reproduction package."""
import argparse,hashlib,json,tempfile,urllib.request,zipfile
from pathlib import Path
REPO='tubex-cpu/TUBEX'
REF='codex/sushi-v6-reproduction-20261029'
FOLDER='docs/video-references/sushi-v6'
def download(url,path):
 req=urllib.request.Request(url,headers={'User-Agent':'TUBEX-reproduction-downloader/1.0'})
 with urllib.request.urlopen(req,timeout=120) as src,path.open('wb') as out:
  while True:
   block=src.read(1024*1024)
   if not block:break
   out.write(block)
def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
 return h.hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--ref',default=REF);ap.add_argument('--output',type=Path,default=Path.cwd());ap.add_argument('--zip-only',action='store_true');args=ap.parse_args()
 target=args.output.resolve();target.mkdir(parents=True,exist_ok=True)
 base=f'https://raw.githubusercontent.com/{REPO}/{args.ref}/{FOLDER}/'
 archive=target/'claude-code-sushi-reproduction.zip'
 extracted=target/'claude-code-sushi-reproduction'
 if archive.exists() or (extracted.exists() and not args.zip_only):raise SystemExit('Output already exists. Choose an empty --output directory.')
 with tempfile.TemporaryDirectory(prefix='tubex-download-',dir=target) as tmp:
  tmp=Path(tmp);download(base+'package-manifest.json',tmp/'manifest.json');m=json.loads((tmp/'manifest.json').read_text())
  joined=tmp/'package.zip'
  with joined.open('wb') as out:
   for i,part in enumerate(m['parts'],1):
    f=tmp/'part';download(base+part['path'],f)
    if f.stat().st_size!=part['bytes'] or sha(f)!=part['sha256']:raise RuntimeError('Part checksum mismatch: '+part['path'])
    with f.open('rb') as inp:
     for chunk in iter(lambda:inp.read(1024*1024),b''):out.write(chunk)
    print(f'{i}/{len(m["parts"])} downloaded and verified',flush=True)
  if joined.stat().st_size!=m['bytes'] or sha(joined)!=m['sha256']:raise RuntimeError('ZIP checksum mismatch')
  with zipfile.ZipFile(joined) as z:
   if z.testzip() is not None:raise RuntimeError('ZIP CRC check failed')
   for info in z.infolist():
    name=Path(info.filename)
    if name.is_absolute() or '..' in name.parts or not name.parts or name.parts[0]!='claude-code-sushi-reproduction':raise RuntimeError('Unsafe archive path')
   if not args.zip_only:z.extractall(target)
  joined.replace(archive)
 print('Restored:',archive)
 if not args.zip_only:print('Open in Claude Code:',extracted)
if __name__=='__main__':main()
