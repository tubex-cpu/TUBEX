HEAD='''<html><head><style>
@font-face{font-family:N;src:url(NotoSerifJP-Black.ttf)}
@font-face{font-family:G;src:url(NotoSansJP-Black.ttf)}
body{margin:0;width:1672px;height:941px;position:relative;overflow:hidden;background:#000}
.bg{position:absolute;inset:0;background:url(BG) center/cover}
.top{position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,0))}
.bot{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.72))}
.t{position:absolute;left:44px;right:0;text-align:left;white-space:nowrap;line-height:1;font-family:N}
.b{color:#000;-webkit-text-stroke:16px #000;text-shadow:0 8px 12px rgba(0,0,0,.8)}
.w{color:#fff}.r{color:#e8100c}
.rb{color:#fff;-webkit-text-stroke:12px #fff;text-shadow:0 8px 12px rgba(0,0,0,.9),0 0 3px #000}
.q{margin-left:-.18em;margin-right:-.3em}
.band{position:absolute;left:0;right:0;top:40px;height:170px;background:linear-gradient(#e0120e,#a8070a);box-shadow:0 8px 18px rgba(0,0,0,.6);border-top:5px solid #fff;border-bottom:5px solid #fff}
.tag{position:absolute;left:44px;top:62px;height:126px;padding:0 26px;background:#fff;color:#d30c0a;font:900 104px/126px G;letter-spacing:.02em}
.gw{position:absolute;left:334px;top:62px;font:900 118px/126px G;color:#fff;white-space:nowrap;text-shadow:0 5px 8px rgba(0,0,0,.55)}
</style></head><body><div class=bg></div><div class=top></div><div class=bot></div>
'''
def line(txt,top,size,kind):
    if kind=='w': return f'<div class="t b" style="top:{top}px;font-size:{size}px">{txt}</div>\n<div class="t w" style="top:{top}px;font-size:{size}px">{txt}</div>\n'
    return f'<div class="t rb" style="top:{top}px;font-size:{size}px">{txt}</div>\n<div class="t r" style="top:{top}px;font-size:{size}px">{txt}</div>\n'
Q='<span class=q>？</span>'
pages={
 'j1':('j1.jpg', line('1万年続いた縄文文化',50,132,'w')+line('消滅させたのは何'+Q,736,158,'r')),
 'j2':('j2.jpg', line('平和主義の縄文人',50,132,'w')+line('1万年もの間',598,104,'w')+line('なぜ争わなかった'+Q,752,134,'r')),
 'j3':('j3.jpg', '<div class=band></div><div class=tag>速報</div><div class=gw>縄文人のDNA</div>\n'+line('遺伝子が語る',598,104,'w')+line('1万年も生き延びた理由',752,134,'r')),
}
for k,(bg,body) in pages.items():
    open(k+'.html','w').write(HEAD.replace('BG',bg)+body+'</body></html>')
