import sys; sys.path.insert(0,'/home/user/TUBEX/episodes/chizu-001-australia-coast/render')
from geo import load_layer
from PIL import Image, ImageDraw, ImageFilter
S='/tmp/claude-0/-home-user-TUBEX/ade57ae0-ca35-51c0-a610-94c1973a512e/scratchpad/'
st=load_layer(S+'usatlas/package/states-albers-10m.json','states')
skip={'02','15','72','60','66','69','78'}
aq={'Colorado','Kansas','Nebraska','New Mexico','Oklahoma','South Dakota','Texas','Wyoming'}
K=2.0; W,H=int(975*K)+80,int(610*K)+80; ox,oy=40,40
def polys(name_ok):
    for gid,name,P in st:
        if gid in skip or not name_ok(name): continue
        for poly in P:
            yield [ (x*K+ox,y*K+oy) for x,y in poly[0] ]
def make(mode,out):
    bg=(14,22,40)
    im=Image.new('RGB',(W,H),bg)
    # glow
    if mode:
        g=Image.new('L',(W,H),0); gd=ImageDraw.Draw(g)
        for p in polys(lambda n:n=='Kansas'): gd.polygon(p,fill=255)
        g=g.filter(ImageFilter.GaussianBlur(28))
        im.paste((255,214,90),(0,0),g.point(lambda v:int(v*0.8)))
    d=ImageDraw.Draw(im)
    for p in polys(lambda n:True): d.polygon(p,fill=(214,208,192))
    if mode==2:
        for p in polys(lambda n:n in aq): d.polygon(p,fill=(232,200,120))
    if mode:
        for p in polys(lambda n:n=='Kansas'): d.polygon(p,fill=(255,196,40))
    for p in polys(lambda n:True): d.line(p+[p[0]],fill=(150,146,134),width=2)
    im.save(out,quality=95)
make(0,S+'thumb010_assets/map_us_plain.jpg')
make(1,S+'thumb010_assets/map_us_kansas.jpg')
make(2,S+'thumb010_assets/map_us_kansas_8states.jpg')
