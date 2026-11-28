# 縄文サムネ：左右の余白なし（端から20px）。下段は左右いっぱい、上段は下段の0.92倍で字間を広げて左右いっぱい、中段は0.68倍で左寄せ。上下の余白は詰める
HEAD='''<html><head><style>
@font-face{font-family:N;src:url(NotoSerifJP-Black.ttf)}
@font-face{font-family:G;src:url(NotoSansJP-Black.ttf)}
body{margin:0;width:1672px;height:941px;position:relative;overflow:hidden;background:#000}
.bg{position:absolute;inset:0;background:url(BG) center/cover}
.top{position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,0))}
.bot{position:absolute;left:0;right:0;bottom:0;height:440px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.72))}
.L{position:absolute;left:20px;width:1632px;text-align:left;white-space:nowrap;line-height:1;font-family:N}
.L span.x{position:relative}
.b{color:#000;-webkit-text-stroke:16px #000;text-shadow:0 8px 12px rgba(0,0,0,.8)}
.w{color:#fff}.r{color:#e8100c}
.rb{color:#fff;-webkit-text-stroke:12px #fff;text-shadow:0 8px 12px rgba(0,0,0,.9),0 0 3px #000}
.q{margin-left:-.18em;margin-right:-.3em}
.band{position:absolute;left:0;right:0;height:190px;background:linear-gradient(#e0120e,#a8070a);box-shadow:0 8px 18px rgba(0,0,0,.6);border-top:5px solid #fff;border-bottom:5px solid #fff}
.news{position:absolute;left:0;width:1672px;white-space:nowrap;line-height:1;font-family:G;font-weight:900;display:flex;justify-content:flex-start;align-items:center;padding-left:20px}
.tag{background:#fff;color:#d30c0a;padding:.1em .22em;margin-right:.3em}
.gw{color:#fff;text-shadow:0 5px 8px rgba(0,0,0,.55)}
</style></head><body><div class=bg></div><div class=top></div><div class=bot></div>
'''
FIT='''<script>
const M=20, W=1672-2*M, MAXLS=0.14;
function size(el,px){el.querySelectorAll('.L').forEach(e=>e.style.fontSize=px+'px')}
function width(el){return el.querySelector('.L:last-child').scrollWidth||0}
function natural(g,px){size(g,px);g.querySelectorAll('.L').forEach(e=>e.style.letterSpacing='0');const s=g.querySelector('.L:last-child span.x');return s.getBoundingClientRect().width}
function px0(g){const w=natural(g,100);return 100*W/w}
function fill(g,px){ // 字間を広げて左右いっぱいに。広がりすぎるなら中央
  const w=natural(g,px), n=g.dataset.n, ls=(W-w)/(n-1)/px;
  if(ls>0) g.querySelectorAll('.L').forEach(e=>e.style.letterSpacing=ls+'em');
}
document.fonts.ready.then(()=>{
  const bot=document.getElementById('bot'), w0=natural(bot,100), B=Math.floor(100*W/w0); natural(bot,B);
  bot.querySelectorAll('.L').forEach(e=>e.style.top=(941-18-B)+'px');
  const top=document.getElementById('top');
  if(top){const T=Math.min(Math.round(B*0.92),Math.floor(px0(top))); fill(top,T); top.querySelectorAll('.L').forEach(e=>e.style.top='22px');}
  const mid=document.getElementById('mid');
  if(mid){const P=Math.round(B*0.68); natural(mid,P); mid.querySelectorAll('.L').forEach(e=>e.style.top=(941-18-B-12-P)+'px');}
  const nw=document.getElementById('news');
  if(nw){ // 速報帯：下段より少し小さく、帯いっぱい
    let px=Math.round(B*0.92); nw.style.fontSize=px+'px';
    const r=nw.scrollWidth; const inner=[...nw.children].reduce((a,c)=>a+c.getBoundingClientRect().width,0)+0.3*px;
    const ls=(W-inner)/(nw.dataset.n-1)/px; if(ls>0) nw.querySelector('.gw').style.letterSpacing=Math.min(ls,0.12)+'em';
    document.querySelector('.band').style.top='14px'; nw.style.top=(14+5+(180-px*1.2)/2)+'px'; nw.style.height=(px*1.2)+'px';
  }
  document.body.dataset.done=1;
});
</script>'''
def grp(id,txt,kind,n):
    a,b=('b','w') if kind=='w' else ('rb','r')
    return f'<div id={id} data-n={n}><div class="L {a}"><span class=x>{txt}</span></div><div class="L {b}"><span class=x>{txt}</span></div></div>\n'
Q='<span class=q>？</span>'
pages={
 'j1':('g1.jpg', grp('top','1万年続いた縄文文化','w',9)+grp('bot','消滅させたのは何'+Q,'r',9)),
 'j2':('g2.jpg', grp('top','平和主義の縄文人','w',8)+grp('mid','1万年もの間','w',6)+grp('bot','なぜ争わなかった'+Q,'r',9)),
 'j3':('g3.jpg', '<div class=band></div><div id=news class=news data-n=7><span class=tag>速報</span><span class=gw>縄文人のDNA</span></div>\n'+grp('mid','遺伝子が語る','w',6)+grp('bot','1万年も生き延びた理由','r',11)),
}
for k,(bg,body) in pages.items():
    open(k+'.html','w').write(HEAD.replace('BG',bg)+body+FIT+'</body></html>')
