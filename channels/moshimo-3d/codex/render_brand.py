"""Original procedural 3D brand artwork. Blender 4.3; no downloaded models."""
from pathlib import Path
import sys
import bpy, math, random
from mathutils import Vector
R=Path(__file__).resolve().parent
random.seed(22)
def mat(n,c,metal=0):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.72;p.inputs['Metallic'].default_value=metal
 return m
def box(n,loc,size,m,b=.025):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if b:
  mod=o.modifiers.new('Soft handmade edges','BEVEL');mod.width=b;mod.segments=2;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def mesh(n,verts,faces,m):
 me=bpy.data.meshes.new(n);me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new(n,me);bpy.context.collection.objects.link(o);o.data.materials.append(m);return o
def house(x,y,s=1,wall=None):
 wall=wall or cream
 box('House plaster',(x,y,.75*s),(1.5*s,1.35*s,1.5*s),wall)
 v=[(x+u*s,y+v*s,z*s) for u,v,z in [(-.86,-.8,1.48),(.86,-.8,1.48),(0,-.8,2.12),(-.86,.8,1.48),(.86,.8,1.48),(0,.8,2.12)]]
 mesh('Gabled slate roof',v,[(0,1,2),(3,5,4),(0,2,5,3),(2,1,4,5),(0,3,4,1)],roof)
 box('Front door',(x+.33*s,y-.682*s,.43*s),(.34*s,.04*s,.86*s),wood)
 box('Doorstep',(x+.33*s,y-.82*s,.07*s),(.55*s,.36*s,.14*s),paving)
 for z in [.65,1.16]:
  box('Warm front window',(x-.35*s,y-.692*s,z*s),(.38*s,.03*s,.34*s),window,.01)
  box('Window sill',(x-.35*s,y-.72*s,(z-.19)*s),(.46*s,.09*s,.055*s),cream,.01)
 for yy in [-.28,.28]:box('Side window',(x+.758*s,y+yy*s,.85*s),(.025*s,.3*s,.42*s),window,.01)
 box('Chimney',(x+.4*s,y+.32*s,1.94*s),(.22*s,.26*s,.55*s),wood)
def tree(x,y,s=1):
 box('Tree trunk',(x,y,.45*s),(.14*s,.14*s,.9*s),wood,.01)
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.65*s,location=(x,y,1.12*s));bpy.context.object.scale=(.85,.85,1.2);bpy.context.object.data.materials.append(green)
def camera(loc,target,ortho):
 bpy.ops.object.camera_add(location=loc);o=bpy.context.object;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();o.data.type='ORTHO';o.data.ortho_scale=ortho;bpy.context.scene.camera=o
def light(loc,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
def init():
 global cream,roof,wood,window,paving,green,yellow,orange
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 cream=mat('Warm ivory',(.89,.79,.62));roof=mat('Deep teal slate',(.035,.14,.16));wood=mat('Warm wood',(.22,.105,.065));window=mat('Amber windows',(1,.6,.12));paving=mat('Sandstone',(.64,.49,.32));green=mat('Muted sage',(.25,.38,.23));yellow=mat('Sunflower yellow',(1,.69,.045));orange=mat('Terracotta',(.65,.23,.095))
 s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=48;s.cycles.use_denoising=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.film_transparent=True
 s.world.color=(.45,.34,.25);s.view_settings.view_transform='AgX';s.render.threads_mode='FIXED';s.render.threads=6
 light((-3,-5,8),900,5,(1,.76,.48));light((5,2,6),650,5,(.63,.79,1))
 return s
def save(s,name,w,h):
 s.render.resolution_x=w;s.render.resolution_y=h;s.render.resolution_percentage=100;s.render.filepath=str(R/name);bpy.ops.render.render(write_still=True)
s=init()
box('Miniature plinth',(0,0,-.18),(3.5,2.8,.36),roof,.14)
box('Top paving',(0,0,.015),(3.42,2.72,.07),paving,.10)
house(.35,.25,.94);tree(1.18,.8,.55)
box('Signpost',(-1,-.25,.9),(.095,.095,1.8),wood)
box('Yellow question plaque',(-1,-.27,1.8),(1.0,.16,1.2),yellow,.09)
bpy.ops.object.text_add(location=(-1,-.365,1.8));o=bpy.context.object;o.name='Original question sign';o.data.body='?';o.data.align_x='CENTER';o.data.align_y='CENTER';o.data.size=2.2;o.data.extrude=.012;o.data.bevel_depth=.004;o.data.font=bpy.data.fonts.load(str(R/'NotoSansJP-Black.ttf'));o.rotation_euler=(math.pi/2,0,0);o.data.materials.append(roof)
camera((5,-8,5.2),(0,0,1),5.1)
save(s,'icon_scene.png',1200,1200)
bpy.ops.wm.save_as_mainfile(filepath=str(R/'icon_scene.blend'))
if '--icon-only' in sys.argv: sys.exit(0)
s=init()
ground=mat('Warm street ground',(.45,.25,.14));road=mat('Asphalt blue-grey',(.115,.18,.19))
box('Town ground',(0,5,-.35),(60,65,.6),ground,0)
box('Road',(0,6,-.025),(3.8,60,.10),road,.02)
for side in [-1,1]:
 box('Sidewalk',(side*2.3,6,.07),(.8,60,.19),paving,.02)
 for i in range(11):
  y=-7+i*3.5;house(side*(3.7+(i%2)*.2),y,1.1+(i%3)*.15,cream if i%2 else orange)
  if i%2==0:tree(side*2.25,y+1.45,.8)
 for i in range(5):house(side*6.9,-5+i*5,1.4,cream)
for y in range(-20,32,3):box('Road dash',(0,y,.04),(.08,1.0,.012),cream,.005)
camera((11,-19,15),(0,3,0),29)
save(s,'banner_scene.png',2560,1440)
bpy.ops.wm.save_as_mainfile(filepath=str(R/'banner_scene.blend'))
