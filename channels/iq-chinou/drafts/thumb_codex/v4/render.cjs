const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const sharp=require('sharp');
const root=__dirname;
const layouts=[
 {lines:[{text:'同じ言葉なのに',x:385,y:23,size:68,color:'#f4e8cb'},{text:'通じない',x:202,y:477,size:220,color:'#f4e8cb',html:'<span style="color:#f38a61">通じ</span>ない'}]},
 {lines:[{text:'理解の',x:33,y:145,size:133,color:'#183951'},{text:'ズレ',x:32,y:306,size:201,color:'#ba4c3b'}]},
 {lines:[{text:'会話の',x:51,y:203,size:155,color:'#f3e4c9'},{text:'断絶',x:53,y:383,size:235,color:'#f58e76'}]},
];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const font=fs.readFileSync(path.join(root,'../v3/assets/ShipporiMinchoB1-ExtraBold.woff2')).toString('base64');
 for(const [idx,l] of layouts.entries()){
  const art=fs.readFileSync(path.join(root,`assets/art_${idx+1}.png`)).toString('base64');
  const copy=l.lines.map(t=>`<div class="copy" style="left:${t.x}px;top:${t.y}px;font-size:${t.size}px;color:${t.color}">${t.html||t.text}</div>`).join('');
  await page.setContent(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>@font-face{font-family:Title;src:url(data:font/woff2;base64,${font});font-weight:800}html,body{margin:0;width:1280px;height:720px;overflow:hidden}img{position:absolute;width:1280px;height:720px;object-fit:cover}.copy{position:absolute;font-family:Title;font-weight:800;line-height:1.03;letter-spacing:-3px;white-space:nowrap;text-shadow:2px 3px 0 #091e2626}</style><img src="data:image/png;base64,${art}">${copy}</html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluate(img=>img.decode());
  const bounds=await page.locator('.copy').evaluateAll(ns=>ns.map(n=>({text:n.textContent,x:n.offsetLeft,y:n.offsetTop,w:n.offsetWidth,h:n.offsetHeight})));
  for(const b of bounds)if(b.x<0||b.y<0||b.x+b.w>1280||b.y+b.h>720)throw new Error(JSON.stringify(b));
  await page.screenshot({path:path.join(root,`rough_${idx+1}.png`)});
  await sharp(path.join(root,`rough_${idx+1}.png`)).resize(320,180).png().toFile(path.join(root,`rough_${idx+1}_320.png`));
  console.log(JSON.stringify({id:idx+1,characters:l.lines.map(t=>t.text).join('').length,bounds}));
 }
 await browser.close();
 await sharp({create:{width:960,height:180,channels:3,background:'#112333'}}).composite(await Promise.all([1,2,3].map(async(i)=>({input:await fs.promises.readFile(path.join(root,`rough_${i}_320.png`)),left:(i-1)*320,top:0})))).png().toFile(path.join(root,'comparison_320.png'));
})();
