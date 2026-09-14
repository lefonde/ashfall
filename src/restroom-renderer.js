const rrFloor=Math.floor,rrCeil=Math.ceil,rrMin=Math.min,rrMax=Math.max,rrAbs=Math.abs,rrHypot=Math.hypot;
// The chapter keeps the host renderer isolated. Geometry, signs, mirrors and
// water share the same perspective-correct depth buffer and portal visibility.
const RR={depth:null,water:null,mirror:null,reflection:null,reflectionBase:null,mirrorReflectionDepth:null,visibleMirrorIds:[],textures:[],w:0,h:0,eye:0,sin:new Float32Array(1024),
 renderMask:null,waterPassById:new Map(),waterPassCache:new Map(),mirrorPassCache:new Map(),reflectionPasses:0,emptyReflectionPasses:0,rasterSamples:0,reflectionSamples:0,
 textureMips:[],sectors:new Map(),waterById:new Map(),mirrorById:new Map(),far:180,visibleFaces:0,visibleSectors:0,baked:false,ripples:[]};
const rsFloorInt=rrFloor;
// Preserve the stored screen displacement for legacy input, while the chapter
// uses a genuine yaw/pitch camera. The reticle and gun share this optical axis.
function rsViewPitch(){return Math.atan(aimPitch/rsAimProjection());}
function rsViewCenterY(){return horizon-aimPitch;}
function rsAimOrigin(){return {x:player.x,y:player.y,z:RS.active.z+RS_EYE};}
function rsAimDirection(){const pitch=rsViewPitch(),c=Math.cos(pitch);return {x:Math.cos(player.a)*c,y:Math.sin(player.a)*c,z:Math.sin(pitch)};}
function rsCameraPoint(x,y,z){const dx=x-player.x,dy=y-player.y,flat=dx*camDX+dy*camDY,up=z-RR.eye;return [dy*camDX-dx*camDY,up*RR.pitchCos-flat*RR.pitchSin,flat*RR.pitchCos+up*RR.pitchSin];}
function rsFaceInView(center,radius){const p=rsCameraPoint(...center);return p[2]+radius>=.065&&p[2]-radius<=RR.far&&rrAbs(p[0])<=rrMax(0,p[2])*W/(2*projection)+radius*(1+W/(2*projection))+1;}

for(let i=0;i<1024;i++)RR.sin[i]=Math.sin(i*TAU/1024);
const RR_PALETTES={
 public:{ambient:.32,tint:[1,.98,.90],fog:[14,20,18],falloff:.00024},
 galleries:{ambient:.43,tint:[1,.99,.92],fog:[33,39,33],falloff:.00012},
 cubicles:{ambient:.24,tint:[.80,1,.95],fog:[5,17,16],falloff:.00030},
 reservoirs:{ambient:.18,tint:[.68,1,.91],fog:[3,15,15],falloff:.000075},
 courts:{ambient:.37,tint:[.91,1,.95],fog:[19,32,29],falloff:.00007},
 undercroft:{ambient:.25,tint:[.91,.96,.89],fog:[12,18,16],falloff:.00024}
};
function rsTextures(){
 if(RR.textures.length)return;
 const colors=[[175,181,159],[102,125,111],[148,155,137],[55,67,64],[106,118,110],[209,243,219],[26,103,88],[218,219,195],[100,129,118],[58,96,90],[252,223,161],[45,103,92],[40,53,48],
 [210,199,166],[190,186,157],[208,226,217],[154,193,180],[86,150,142],[43,98,87],[201,222,207],[104,114,102],[217,204,172],[76,87,69],[54,91,72],[34,64,65]];
 for(let m=0;m<colors.length;m++){
  const out=new Uint8Array(128*128*3),c=colors[m],tile=[0,1,6,13,14,15,16,17,18,19,23].includes(m);
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
   const seed=((x*73856093)^(y*19349663)^(m*83492791))>>>0,grain=(seed%23-11)*.35;
   let s=1;
   if(tile){const size=m===18?16:32,gx=x%size,gy=y%size;
    if(gx===0||gy===0)s=.49;else if(gx===1||gy===1)s=1.10;
    s*=.92+(((x/size|0)*13+(y/size|0)*7+m)%7)*.017;
    // A broad ceramic glaze, without animated texture shimmer.
    if(gx>2&&gy>2)s+=.025*(1-gx/size)*(1-gy/size);
   }
   if(m===2||m===21){s=x%64<2||y%64<2?.65:.98;if(seed%149===0)s*=.78;}
   if(m===3||m===20)s=.87+((seed>>5)%19)*.008;
   if(m===4)s=.82+((x+y)%16)*.02;
   if(m===9)s=.63+y*.004+(x>74&&x<78?.14:0);
   if(m===11)s=.89+(x%41<2?-.28:0)+(seed%127===0?-.25:0);
   if(m===12)s=(x%12<4||y<3||y>124)?.18:1;
   if(m===22||m===23)s*=.57+((seed>>6)%31)*.018;
   if(m===24)s=.4+(x>7&&x<120&&y>7&&y<120?.5:0);
   for(let k=0;k<3;k++)out[(y*128+x)*3+k]=clamp(c[k]*s+grain,0,255);
  }RR.textures.push(out);
  const mips=[{data:out,w:128,h:128}];let previous=out,width=128;
  while(width>4){const nextW=width/2,next=new Uint8Array(nextW*nextW*3);for(let y=0;y<nextW;y++)for(let x=0;x<nextW;x++)for(let c=0;c<3;c++){const i=(y*2*width+x*2)*3+c;next[(y*nextW+x)*3+c]=(previous[i]+previous[i+3]+previous[i+width*3]+previous[i+width*3+3])*.25;}mips.push({data:next,w:nextW,h:nextW});previous=next;width=nextW;}
  RR.textureMips.push(mips);
 }
}
function rsRenderSurface(id){return RW.byId?.[id]||RW.surfaces.find(s=>s.id===id);}
function rsRenderSector(id){return RW.sectors instanceof Map?RW.sectors.get(id):RW.sectors?.[id];}
function rsBakeFaces(){
 rsTextures();RR.sectors.clear();RR.waterById.clear();RR.mirrorById.clear();
 for(const s of RW.surfaces)RR.sectors.set(s.id,{faces:[],water:[],lights:[],portals:[],openLinks:[],blockers:[],surface:s});
 for(const s of RW.surfaces){const parent=s.parentRoom||(s.deck?s.court:null);if(parent&&RR.sectors.has(parent)){RR.sectors.get(s.id).openLinks.push(parent);RR.sectors.get(parent).openLinks.push(s.id);}}
 for(const p of RW.portals){RR.sectors.get(p.a)?.portals.push(p);RR.sectors.get(p.b)?.portals.push(p);}
 for(const b of RW.solids)if(b.h>1.2&&b.owner)RR.sectors.get(b.owner)?.blockers.push(b);
 for(const l of RW.lights){const owner=l.owner||rsAt(l.x,l.y).find(s=>l.z>=rsFloor(s,l.x,l.y)&&l.z<=rsCeil(s,l.x,l.y)+.3)?.id;if(owner)RR.sectors.get(owner)?.lights.push(l);}
 for(const w of RW.waterRegions||[])RR.waterById.set(w.id,w);
 // Fallback permits old save fixtures and the isolated stair-preview harness.
 for(const s of RW.surfaces)if(s.water&&!RR.waterById.has(s.waterRegionId)){
  const id=s.waterRegionId||((s.z===RS_B1)?1:2);if(!RR.waterById.has(id))RR.waterById.set(id,{id,owner:s.id,z:s.z+s.water,depth:s.water,tint:[25,103,88]});
 }
 for(const f of RW.faces)rsBakeRenderFace(f,0);
 for(const s of RW.signs)rsBakeSign(s);
 let mi=0;for(const m of RW.mirrors||[]){
  if(!m.v||m.v.length!==4)continue;const id=++mi,center=m.center||m.v[0].map((_,k)=>m.v.reduce((a,p)=>a+p[k],0)/4),normal=m.normal||[0,1,0];
  const mm={...m,id,center,normal};RR.mirrorById.set(id,mm);
  const verts=m.v.map(p=>p.map((v,k)=>v+(normal[k]||0)*.009));
  for(const v of [[verts[0],verts[1],verts[2]],[verts[0],verts[2],verts[3]]])rsBakeRenderFace({v,mat:9,owner:m.owner,mirror:id},0);
 }
 RR.baked=true;
}
function rsBakeRenderFace(original,split){
 const a=original.v[0],b=original.v[1],c=original.v[2];
 const ab=b.map((v,i)=>v-a[i]),ac=c.map((v,i)=>v-a[i]),n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],nn=rrHypot(...n)||1;
 const axis=rrAbs(n[2])>nn*.55?2:rrAbs(n[0])>rrAbs(n[1])?0:1;
 // Broad floors need interior light samples. Subdivide render copies only,
 // keeping authored collision geometry and the world's face indices stable.
 const lengths=[rrHypot(...ab),rrHypot(b[0]-c[0],b[1]-c[1],b[2]-c[2]),rrHypot(...ac)],long=rrMax(...lengths);
 if(!original.water&&!original.tex&&!original.mirror&&axis===2&&long>9&&split<9){
  const edge=lengths.indexOf(long),p=original.v[edge],q=original.v[(edge+1)%3],r=original.v[(edge+2)%3],mid=p.map((v,k)=>(v+q[k])*.5);
  rsBakeRenderFace({...original,v:[p,mid,r]},split+1);rsBakeRenderFace({...original,v:[mid,q,r]},split+1);return;
 }
 const f=original;f.axis=axis;f.center=a.map((_,i)=>(a[i]+b[i]+c[i])/3);f.radius=rrMax(...f.v.map(p=>rrHypot(p[0]-f.center[0],p[1]-f.center[1])));f.radius3=rrMax(...f.v.map(p=>rrHypot(p[0]-f.center[0],p[1]-f.center[1],p[2]-f.center[2])));
 const owner=f.owner||rsAt(f.center[0],f.center[1]).find(s=>f.center[2]>=rsFloor(s,...f.center)-.2&&f.center[2]<=rsCeil(s,...f.center)+.2)?.id;
 f.owner=owner;const sector=RR.sectors.get(owner),room=sector?.surface,palette=room?.renderPalette||RR_PALETTES[room?.district]||RR_PALETTES.public;
 f.palette=palette;const uv=f.uv||f.v.map(p=>axis===2?[p[0]*.8,p[1]*.8]:[p[axis===0?1:0]*.8,p[2]*.8]);f.uv=uv.length===6?uv:new Float32Array([uv[0][0],uv[0][1],uv[1][0],uv[1][1],uv[2][0],uv[2][1]]);
 const ownLights=sector?.lights||[],local=ownLights.slice(),openParent=room?.parentRoom||room?.court;
 if(openParent&&RR.sectors.has(openParent))local.push(...RR.sectors.get(openParent).lights);
 const includedLights=new Set(local);
 // Only adjacent doorway light can cross a sector boundary, so a lamp behind
 // an unrelated wall never illuminates a room on a different floor.
 if(sector)for(const p of sector.portals){const other=RR.sectors.get(p.a===owner?p.b:p.a);if(!other)continue;
  const center=p.v[0].map((_,k)=>p.v.reduce((v,q)=>v+q[k],0)/p.v.length);
  for(const l of other.lights)if(!includedLights.has(l)&&rrHypot(l.x-center[0],l.y-center[1],l.z-center[2])<7&&(axis===2||rrHypot(f.center[0]-center[0],f.center[1]-center[1])<6)){local.push({...l,power:l.power*.30});includedLights.add(l);}
 }
 local.sort((p,q)=>((p.x-f.center[0])**2+(p.y-f.center[1])**2+(p.z-f.center[2])**2)-((q.x-f.center[0])**2+(q.y-f.center[1])**2+(q.z-f.center[2])**2));
 // Every shared floor vertex must use the same lamps. Selecting them by each
 // triangle's centre creates dark wedges on long raised paths and pool floors.
 const lights=axis===2?local:local.slice(0,8),base=room?.ambientLight??palette.ambient;
 f.tint=palette.tint.slice();let weight=.6,cr=f.tint[0]*weight,cg=f.tint[1]*weight,cb=f.tint[2]*weight;
 for(const l of lights){const d2=(l.x-f.center[0])**2+(l.y-f.center[1])**2+(l.z-f.center[2])**2,w=l.power/(1+d2*.17),col=l.color||l.colorRGB||(l.warm?[255,220,169]:[203,241,229]),scale=rrMax(...col)<=1?1:255;weight+=w;cr+=col[0]/scale*w;cg+=col[1]/scale*w;cb+=col[2]/scale*w;}
 f.tint=[cr/weight,cg/weight,cb/weight];
 f.lum=f.v.map(p=>{
  if(f.mat===5||f.mat===10||f.emissive)return 1.15;
  let light=base;
  for(const q of lights){const d2=(p[0]-q.x)**2+(p[1]-q.y)**2+(p[2]-q.z)**2;
   light+=q.power*.73/(1+d2*.16)*(axis!==2&&rsLightBlocked(p,q,sector?.blockers||[])? .12:1);}
  const direction=axis===2?.92:axis===0?.82:.96;
  return rrMin(1.35,light)*direction;
 });
 f.floor=room?.z??0;f.bounds=room?.bounds;f.isFloor=axis===2&&rrAbs(f.center[2]-f.floor)<.03;f.waterline=room?.water?room.z+room.water:null;
 const custom=!!f.tex&&!f.generatedTexture;f.mips=custom?null:(RR.textureMips[f.mat]||RR.textureMips[0]);f.tex=f.tex||RR.textures[f.mat]||RR.textures[0];f.generatedTexture=!custom;f.texSize=f.texSize||128;f.texHeight=f.texHeight||f.texSize;
 if(sector)(f.water?sector.water:sector.faces).push(f);
 else{let other=RR.sectors.get('_unowned');if(!other){other={faces:[],water:[],lights:[],portals:[]};RR.sectors.set('_unowned',other);}other.faces.push(f);}

}
function rsBakeOneFace(f){
 if(!RR.baked)return;const old=f,sector=RR.sectors.get(f.owner);
 if(old&&sector){const list=old.water?sector.water:sector.faces,index=list.indexOf(old);if(index>=0)list.splice(index,1);}
 if(f.generatedTexture)delete f.uv;rsBakeRenderFace(f,0);
}
function rsLightBlocked(p,l,boxes){
 for(const b of boxes){if(b.disabled)continue;let lo=.015,hi=.985;
  for(let k=0;k<3;k++){
   const end=k===0?l.x:k===1?l.y:l.z,min=k===0?b.x1:k===1?b.y1:b.z,max=k===0?b.x2:k===1?b.y2:b.z+b.h,delta=end-p[k];
   if(rrAbs(delta)<.00001){if(p[k]<min||p[k]>max){lo=1;break;}}
   else{let a=(min-p[k])/delta,c=(max-p[k])/delta;if(a>c){const t=a;a=c;c=t;}lo=rrMax(lo,a);hi=rrMin(hi,c);if(lo>=hi)break;}
  }
  if(lo<hi)return true;
 }return false;
}
function rsWaterStep(x,y,z,force=1){
 if(!RS.active)return;RR.ripples.push({x,y,z,force:clamp(force,.35,1.7),time:RS.active.clock||0});if(RR.ripples.length>6)RR.ripples.shift();
}
function rsBakeSign(s){
 const width=clamp(s.text.length*.077+.30,.7,3.7),height=.32,cs=document.createElement('canvas');cs.width=512;cs.height=64;
 const ctx=cs.getContext('2d');ctx.fillStyle='#273c35';ctx.fillRect(0,0,512,64);ctx.strokeStyle='#778b79';ctx.lineWidth=3;ctx.strokeRect(3,3,506,58);
 ctx.fillStyle='#d6ddc2';ctx.font='600 31px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.text,256,34,487);
 const img=ctx.getImageData(0,0,512,64).data,tex=new Uint8Array(512*64*3);
 for(let i=0;i<512*64;i++){tex[i*3]=img[i*4];tex[i*3+1]=img[i*4+1];tex[i*3+2]=img[i*4+2];}
 let a=s.a||0;const own=rsRenderSurface(s.owner);if(own&&!rsPolyHas(own.poly,s.x-Math.sin(a)*.12,s.y+Math.cos(a)*.12))a+=Math.PI;const dx=Math.cos(a)*width*.5,dy=Math.sin(a)*width*.5,v=[[s.x-dx,s.y-dy,s.z+height/2],[s.x+dx,s.y+dy,s.z+height/2],[s.x+dx,s.y+dy,s.z-height/2],[s.x-dx,s.y-dy,s.z-height/2]],uv=[[0,0],[.999,0],[.999,.999],[0,.999]];
 const owner=s.owner||rsAt(s.x,s.y).find(r=>s.z>=r.z&&s.z<=r.ceil)?.id;
 for(const inds of [[0,1,2],[0,2,3]])rsBakeRenderFace({v:inds.map(i=>v[i]),uv:inds.map(i=>uv[i]),mat:7,tex,texSize:512,texHeight:64,owner,sign:true},0);
}
function rsClipNear(v){
 const out=[];for(let i=0;i<v.length;i++){const a=v[i],b=v[(i+1)%v.length],ina=a[2]>=.065,inb=b[2]>=.065;
  if(ina)out.push(a);if(ina!==inb){const t=(.065-a[2])/(b[2]-a[2]);out.push(a.map((v,k)=>mix(v,b[k],t)));}
 }return out;
}
// One draw finishes before another starts, so vertices and clipping storage can
// be reused without retaining frame-sized temporary object graphs.
const rrVertexScratch=Array.from({length:4},()=>Array.from({length:8},()=>new Float64Array(6)));
function rsClipFaceVertices(source,count,target,axis,plane){
 let n=0;for(let i=0;i<count;i++){const a=source[i],b=source[(i+1)%count],inside=a[axis]>=plane,next=b[axis]>=plane;
  if(inside){target[n].set(a);n++;}if(inside!==next){const t=(plane-a[axis])/(b[axis]-a[axis]),p=target[n++];for(let k=0;k<6;k++)p[k]=mix(a[k],b[k],t);}
 }return n;
}
function rsReflectionMask(cache,key,kind){
 let p=cache.get(key);if(!p||p.rowsMin.length!==H){p={kind,rowsMin:new Int32Array(H),rowsMax:new Int32Array(H)};cache.set(key,p);}
 p.x0=W;p.x1=0;p.y0=H;p.y1=0;p.writes=0;p.sampledPixels=0;p.rowsMin.fill(W);p.rowsMax.fill(0);return p;
}
function rsMaskRow(p,y,left,right){
 if(left>=right)return;p.writes++;if(left<p.rowsMin[y])p.rowsMin[y]=left;if(right>p.rowsMax[y])p.rowsMax[y]=right;
 if(left<p.x0)p.x0=left;if(right>p.x1)p.x1=right;if(y<p.y0)p.y0=y;if(y+1>p.y1)p.y1=y+1;
}
function rsMirrorMaskVisible(pass){
 if(!pass.sampledPixels)return false;
 // Refine candidates only inside rows that actually wrote this mirror. Keep
 // the original every-eighth-pixel visibility rule and final occlusion state.
 for(let y=pass.y0;y<pass.y1;y++){const row=y*W,start=row+pass.rowsMin[y],end=row+pass.rowsMax[y];for(let i=(start+7)&~7;i<end;i+=8)if(RR.mirror[i]===pass.id)return true;}
 return false;
}
function rsReflectedFaceInMask(f,pass){
 if(!pass.rowsMin)return true;if(!pass.writes)return false;
 let x=f.center[0],y=f.center[1],z=f.center[2];
 if(pass.kind==='waterReflection')z=2*pass.z-z;
 else{const m=pass.mirror,n=m.normal,d=(x-m.center[0])*n[0]+(y-m.center[1])*n[1];x-=2*d*n[0];y-=2*d*n[1];}
 const dx=x-player.x,dy=y-player.y,flat=dx*camDX+dy*camDY,up=z-RR.eye,cx=dy*camDX-dx*camDY,cy=up*RR.pitchCos-flat*RR.pitchSin,depth=flat*RR.pitchCos+up*RR.pitchSin,r=f.radius3||f.radius;
 if(depth+r<.065)return false;
 // Sphere/plane tests use the reflected centre and radius, before clipping.
 // The horizontal apron includes the complete animated wave displacement.
 const left=(pass.x0-3-W/2)/projection,right=(pass.x1+3-W/2)/projection,top=(RR.centerY-pass.y0)/projection,bottom=(RR.centerY-pass.y1)/projection;
 return cx-left*depth>=-r*Math.sqrt(1+left*left)&&right*depth-cx>=-r*Math.sqrt(1+right*right)&&top*depth-cy>=-r*Math.sqrt(1+top*top)&&cy-bottom*depth>=-r*Math.sqrt(1+bottom*bottom);
}
function rsDrawFace(f,pass=null){
 if(f.seal&&!RS.active.committed)return;
 const reflected=pass?.kind==='mirrorReflection'||pass?.kind==='waterReflection';
 if(reflected&&!rsReflectedFaceInMask(f,pass))return;
 // The ordinary bound is valid only for the ordinary camera. Reflections still
 // clip and transform their real geometry before testing the reflected view.
 if(!reflected&&!rsFaceInView(f.center,f.radius3||f.radius))return;
 if(pass?.kind==='waterReflection'&&(f.water||f.mirror||(f.isFloor&&f.center[2]>pass.z+.02)||f.v.every(p=>p[2]<pass.z+.002)))return;
 if(pass?.kind==='mirrorReflection'&&(f.mirror||f.mat===9||f.water))return;
 const flash=muzzle>0&&!f.creature&&typeof rsThreatMuzzleAt==='function';let vertices=rrVertexScratch[0],count=f.v.length;
 for(let i=0;i<count;i++){const p=f.v[i],v=vertices[i];v[0]=p[0];v[1]=p[1];v[2]=p[2];v[3]=f.uv[i*2];v[4]=f.uv[i*2+1];v[5]=rrMin(1.35,f.lum[i]+(flash?rsThreatMuzzleAt(p[0],p[1],p[2],f.owner):0));}
 if(pass?.kind==='waterReflection'){
  count=rsClipFaceVertices(vertices,count,rrVertexScratch[1],2,pass.z+.002);vertices=rrVertexScratch[1];if(count<3)return;
  for(let i=0;i<count;i++)vertices[i][2]=pass.z*2-vertices[i][2];
 }else if(pass?.kind==='mirrorReflection'){
  const m=pass.mirror,n=m.normal,c=m.center,side=(player.x-c[0])*n[0]+(player.y-c[1])*n[1];
  if(f.v.every(p=>((p[0]-c[0])*n[0]+(p[1]-c[1])*n[1])*Math.sign(side)<.035))return;
  for(let i=0;i<count;i++){const p=vertices[i],d=(p[0]-c[0])*n[0]+(p[1]-c[1])*n[1];p[0]-=2*d*n[0];p[1]-=2*d*n[1];}
 }
 if(reflected){let x=0,y=0,z=0;for(let i=0;i<count;i++){x+=vertices[i][0];y+=vertices[i][1];z+=vertices[i][2];}if(!rsFaceInView([x/count,y/count,z/count],f.radius3||f.radius))return;}
 let v=rrVertexScratch[2],near=false;
 for(let i=0;i<count;i++){const p=vertices[i],q=v[i],dx=p[0]-player.x,dy=p[1]-player.y,flat=dx*camDX+dy*camDY,up=p[2]-RR.eye;
  q[0]=dy*camDX-dx*camDY;q[1]=up*RR.pitchCos-flat*RR.pitchSin;q[2]=flat*RR.pitchCos+up*RR.pitchSin;q[3]=p[3];q[4]=p[4];q[5]=p[5];if(q[2]<.065)near=true;
 }
 if(near){count=rsClipFaceVertices(v,count,rrVertexScratch[3],2,.065);v=rrVertexScratch[3];}if(count<3)return;
 const screen=rrVertexScratch[0];for(let i=0;i<count;i++){const p=v[i],q=1/p[2],s=screen[i];s[0]=W*.5+p[0]*projection*q;s[1]=RR.centerY-p[1]*projection*q;s[2]=q;s[3]=p[3]*q;s[4]=p[4]*q;s[5]=p[5]*q;}
 for(let i=1;i<count-1;i++)rsRaster(screen[0],screen[i],screen[i+1],f,pass);
}
function rsRaster(a,b,c,f,pass){
 const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(rrAbs(den)<.001)return;
 const reflected=pass?.kind==='waterReflection'||pass?.kind==='mirrorReflection',water=pass?.kind==='water',clip=reflected?null:f.clip,renderMask=RR.renderMask,surfaceMask=water?RR.waterPassById.get(f.waterRegion||f.water):!reflected&&f.mirror?RR.mirrorPassCache.get(f.mirror):null,passMask=reflected&&pass.rowsMin?pass:null;
 const minY=rrMax(0,renderMask?.y0||0,passMask?.y0||0,clip?rrFloor(clip[1]):0,rrCeil(rrMin(a[1],b[1],c[1])-.5)),maxY=rrMin(H-1,renderMask?renderMask.y1-1:H-1,passMask?passMask.y1-1:H-1,clip?rrCeil(clip[3]):H-1,rrFloor(rrMax(a[1],b[1],c[1])-.5));if(minY>maxY)return;
 const da=(b[1]-c[1])/den,db=(c[1]-a[1])/den,dc=-da-db,ea=(c[0]-b[0])/den,eb=(a[0]-c[0])/den;
 const dxq=da*a[2]+db*b[2]+dc*c[2],dxu=da*a[3]+db*b[3]+dc*c[3],dxv=da*a[4]+db*b[4]+dc*c[4],dxl=da*a[5]+db*b[5]+dc*c[5];
 const tex=f.tex,size=f.texSize,texHeight=f.texHeight,mask=size-1,maskY=texHeight-1,mips=f.mips,time=settings.reduce?0:RS.active.clock||0,palette=f.palette,tc=f.tint,waterRegion=water?RR.waterById.get(f.waterRegion||f.water):null;
 const tint=waterRegion?.tint||[28,102,87],wt=tint[0]<=1?[tint[0]*255,tint[1]*255,tint[2]*255]:tint;
 let top=a,mid=b,bot=c,tmp;if(top[1]>mid[1]){tmp=top;top=mid;mid=tmp;}if(mid[1]>bot[1]){tmp=mid;mid=bot;bot=tmp;}if(top[1]>mid[1]){tmp=top;top=mid;mid=tmp;}
 const longSlope=(bot[0]-top[0])/(bot[1]-top[1]||1),upperSlope=(mid[0]-top[0])/(mid[1]-top[1]||1),lowerSlope=(bot[0]-mid[0])/(bot[1]-mid[1]||1);
 for(let y=minY;y<=maxY;y++){
  const sy=y+.5,xLong=top[0]+(sy-top[1])*longSlope,xShort=sy<mid[1]?top[0]+(sy-top[1])*upperSlope:mid[0]+(sy-mid[1])*lowerSlope,left=rrMin(xLong,xShort),right=rrMax(xLong,xShort);
  const ripple=RR.sin[((y*9+time*63)|0)&1023],reflectionShift=pass?.kind==='waterReflection'&&!settings.reduce?rrFloor(ripple*1.35):0;
  const x0=rrMax(0,renderMask?.x0||0,passMask?passMask.rowsMin[y]-reflectionShift:0,clip?rrFloor(clip[0]):0,rrCeil(left-.5)),x1=rrMin(W-1,renderMask?renderMask.x1-1:W-1,passMask?passMask.rowsMax[y]-1-reflectionShift:W-1,clip?rrCeil(clip[2]):W-1,rrFloor(right-.5));if(x0>x1)continue;
  if(reflected)RR.reflectionSamples+=x1-x0+1;else RR.rasterSamples+=x1-x0+1;
  const interpolationStart=rrMax(0,clip?rrFloor(clip[0]):0,rrCeil(left-.5));
  let wa=da*(interpolationStart+.5-c[0])+ea*(sy-c[1]),wb=db*(interpolationStart+.5-c[0])+eb*(sy-c[1]),wc0=1-wa-wb;
  let q=wa*a[2]+wb*b[2]+wc0*c[2],u=wa*a[3]+wb*b[3]+wc0*c[3],v=wa*a[4]+wb*b[4]+wc0*c[4],l=wa*a[5]+wb*b[5]+wc0*c[5];
  // Preserve the exact incremental texture/depth phase at clipped edges.
  for(let skip=interpolationStart;skip<x0;skip++){q+=dxq;u+=dxu;v+=dxv;l+=dxl;}
  const row=y*W;let writtenLeft=W,writtenRight=0;
  for(let x=x0;x<=x1;x++,q+=dxq,u+=dxu,v+=dxv,l+=dxl){
   const targetX=x+reflectionShift;if(targetX<0||targetX>=W)continue;let index=row+targetX;if(q<=0)continue;
   if(renderMask?.top&&(y<renderMask.top[targetX]||y>=renderMask.bottom[targetX]))continue;
   if(reflected){if(pass.kind==='waterReflection'){if(!pass.ids.has(RR.water[index]))continue;}else if(RR.mirror[index]!==pass.id)continue;if(q<=RR.reflection[index])continue;}
   else if(q<=RR.depth[index]+.00000015)continue;
   const depth=1/q,uu=u*depth,vv=v*depth,i=index*4;
   if(water){
    // The original floor remains visible under the surface; physical water
    // height/depth changes its absorption rather than replacing it with tile.
    const wave=RR.sin[((uu*123+vv*151+time*43)|0)&1023],d=waterRegion?.depth||.12,alpha=rrMin(.56,.13+d*.55),fresnel=rrMin(.16,depth*.0025),light=rrMin(1,l*depth);
    let source=i;if(!settings.reduce&&RR.depth[index]>0){const rawX=x+rrFloor(wave*.9),sx=rawX<0?0:rawX>=W?W-1:rawX,si=row+sx;if(rrAbs(RR.depth[si]-RR.depth[index])<.015)source=si*4;}
    let glint=(wave+ripple)*1.45;
    if(!settings.reduce)for(const ring of RR.activeRipples||[]){if(rrAbs(ring.z-(waterRegion?.z-d))>.3)continue;const rx=uu/.8-ring.x,ry=vv/.8-ring.y,radius=ring.age*1.55;if(rrAbs(rx)>radius+.16||rrAbs(ry)>radius+.16)continue;const dist=rrHypot(rx,ry),delta=dist-radius;
     if(rrAbs(delta)<.15)glint+=(1-rrAbs(delta)/.15)*(1-ring.age/2.7)*ring.force*8;}

    px[i]=px[source]*(1-alpha-fresnel)+wt[0]*(alpha+fresnel)*light+glint;
    px[i+1]=px[source+1]*(1-alpha-fresnel)+wt[1]*(alpha+fresnel)*light+glint;
    px[i+2]=px[source+2]*(1-alpha-fresnel)+wt[2]*(alpha+fresnel)*light+glint;
    RR.depth[index]=q;RR.water[index]=f.waterRegion||f.water;if(surfaceMask){if(targetX<writtenLeft)writtenLeft=targetX;writtenRight=targetX+1;}continue;
   }
   const footprint=(f.axis===2?depth*depth*.23/rrMax(.25,rrAbs(RR.eye-f.center[2])):depth*.24)*640/W,
    lod=mips?(footprint>32?5:footprint>16?4:footprint>8?3:footprint>4?2:footprint>2?1:0):0,mt=lod?mips[lod].data:tex,mw=lod?mips[lod].w:size,mh=lod?mw:texHeight;
   const tx=rsFloorInt(uu*mw+(pass?.kind==='waterReflection'?ripple*.7:0))&(mw-1),ty=rsFloorInt(vv*mh)&(mh-1),ti=(ty*mw+tx)*3;
   let light=l*depth;
   if(f.isFloor&&f.bounds&&!f.localUV){const wx=uu/.8,wy=vv/.8,edge=rrMin(wx-f.bounds[0],f.bounds[2]-wx,wy-f.bounds[1],f.bounds[3]-wy);if(edge>=0&&edge<.32)light*=.74+edge*.81;}
   if(f.axis!==2&&!f.sign&&!f.mirror){const height=vv/.8-(f.localUV?0:f.floor);
    if(height>=0&&height<.20)light*=.65+height;
    if(!f.localUV&&f.waterline!==null&&rrAbs(vv/.8-f.waterline)<.09)light*=.67;
   }
   const fog=1/(1+depth*depth*palette.falloff),r=palette.fog[0]+(mt[ti]*light*tc[0]-palette.fog[0])*fog,g=palette.fog[1]+(mt[ti+1]*light*tc[1]-palette.fog[1])*fog,bv=palette.fog[2]+(mt[ti+2]*light*tc[2]-palette.fog[2])*fog;
   if(reflected){RR.reflection[index]=q;if(pass.kind==='waterReflection')RR.waterReflectionDepth[index]=q;else RR.mirrorReflectionDepth[index]=q;const alpha=pass.kind==='mirrorReflection'?.76:.25;px[i]=RR.reflectionBase[i]*(1-alpha)+r*alpha;px[i+1]=RR.reflectionBase[i+1]*(1-alpha)+g*alpha;px[i+2]=RR.reflectionBase[i+2]*(1-alpha)+bv*alpha;}
   else{RR.depth[index]=q;if(f.creature)RR.water[index]=0;RR.mirror[index]=f.mirror||0;px[i]=r;px[i+1]=g;px[i+2]=bv;px[i+3]=255;if(surfaceMask){if(targetX<writtenLeft)writtenLeft=targetX;writtenRight=targetX+1;if(!(index&7))surfaceMask.sampledPixels++;}}
  }
  if(surfaceMask)rsMaskRow(surfaceMask,y,writtenLeft,writtenRight);
 }
}
function rsVisibleSectors(){
 const rects=new Map(),queue=[],projected=new Map();
 const ground=rsGround(player.x,player.y,RS.active.z);
 for(const s of rsAt(player.x,player.y))if((s===ground||s.id===ground?.court||rrAbs(rsFloor(s,player.x,player.y)-RS.active.z)<.12)&&RR.eye>=rsFloor(s,player.x,player.y)-.05&&RR.eye<=rsCeil(s,player.x,player.y)+.05){rects.set(s.id,[0,0,W,H]);queue.push(s.id);}
 let qi=0;while(qi<queue.length&&qi<2048){const id=queue[qi++],r=rects.get(id),sector=RR.sectors.get(id);if(!sector)continue;
  for(const to of sector.openLinks||[]){const old=rects.get(to);if(!old||r[0]<old[0]||r[1]<old[1]||r[2]>old[2]||r[3]>old[3]){rects.set(to,old?[rrMin(old[0],r[0]),rrMin(old[1],r[1]),rrMax(old[2],r[2]),rrMax(old[3],r[3])]:r.slice());queue.push(to);}}
  for(const p of sector.portals){const to=p.a===id?p.b:p.a;let b=projected.get(p);
   if(b===undefined){let v=p.v.map(p=>rsCameraPoint(...p));
    if(v.some(q=>q[2]<.065))v=rsClipNear(v);
    if(v.length<3)b=null;else{const sx=v.map(q=>W/2+q[0]*projection/q[2]),sy=v.map(q=>RR.centerY-q[1]*projection/q[2]);b=[rrMin(...sx)-2,rrMin(...sy)-2,rrMax(...sx)+2,rrMax(...sy)+2];}projected.set(p,b);
   }
   if(!b)continue;const next=[rrMax(r[0],b[0]),rrMax(r[1],b[1]),rrMin(r[2],b[2]),rrMin(r[3],b[3])];if(next[0]>=next[2]||next[1]>=next[3])continue;
   const old=rects.get(to);if(old&&next[0]>=old[0]&&next[1]>=old[1]&&next[2]<=old[2]&&next[3]<=old[3])continue;
   rects.set(to,old?[rrMin(old[0],next[0]),rrMin(old[1],next[1]),rrMax(old[2],next[2]),rrMax(old[3],next[3])]:next);queue.push(to);
  }
 }
 RR.portalVisits=qi;return rects;
}
let rsWaterRenderMask=null;
function rsWaterDependencyMask(mask,water){
 if(!mask||settings.reduce||!water.length)return mask;let top=H,bottom=0;
 for(const f of water){
  if(!rsFaceInView(f.center,f.radius3||f.radius))continue;let v=f.v.map(p=>rsCameraPoint(...p));if(v.some(p=>p[2]<.065))v=rsClipNear(v);if(v.length<3)continue;
  let x0=W,x1=0,y0=H,y1=0;for(const p of v){const x=W/2+p[0]*projection/p[2],y=RR.centerY-p[1]*projection/p[2];x0=rrMin(x0,x);x1=rrMax(x1,x);y0=rrMin(y0,y);y1=rrMax(y1,y);}
  if(f.clip){x0=rrMax(x0,f.clip[0]);y0=rrMax(y0,f.clip[1]);x1=rrMin(x1,f.clip[2]);y1=rrMin(y1,f.clip[3]);}
  if(x1<mask.x0||x0>=mask.x1||y1<mask.y0||y0>=mask.y1)continue;
  top=rrMin(top,rrMax(mask.y0,rrFloor(y0)));bottom=rrMax(bottom,rrMin(mask.y1,rrCeil(y1)));
 }
 if(bottom<=top)return mask;
 // Water refraction reads the already-shaded pixel to its left. That dependency
 // can propagate across a row, so a fixed-width apron is not exact. Retain its
 // upstream row pixels while still masking unrelated rows and reflection work.
 rsWaterRenderMask=rsPortalMaskReset(rsWaterRenderMask);const out=rsWaterRenderMask;
 for(let x=mask.x0;x<mask.x1;x++)rsPortalMaskSpan(out,x,mask.top?mask.top[x]:mask.y0,mask.bottom?mask.bottom[x]:mask.y1);
 for(let x=0;x<mask.x1;x++)rsPortalMaskSpan(out,x,top,bottom);
 return rsPortalMaskFinish(out);
}
function rsRenderWorld(preview=false,renderMask=null){
 RR.renderMask=renderMask;RR.rasterSamples=0;RR.reflectionSamples=0;
 rsBuildWorld();if(!RR.baked)rsBakeFaces();
 if(RR.w!==W||RR.h!==H){RR.w=W;RR.h=H;RR.depth=new Float32Array(W*H);RR.water=new Uint16Array(W*H);RR.mirror=new Uint16Array(W*H);RR.reflection=new Float32Array(W*H);RR.waterReflectionDepth=new Float32Array(W*H);RR.mirrorReflectionDepth=new Float32Array(W*H);RR.reflectionBase=new Uint8ClampedArray(W*H*4);}
 RR.activeRipples=RR.ripples.map(r=>({...r,age:(RS.active.clock||0)-r.time})).filter(r=>r.age>=0&&r.age<2.7);
 const pitch=rsViewPitch();RR.pitchCos=Math.cos(pitch);RR.pitchSin=Math.sin(pitch);RR.centerY=rsViewCenterY();RR.eye=RS.active.z+RS_EYE;RR.waterReflectionDepth.fill(0);RR.mirrorReflectionDepth.fill(0);RR.visibleMirrorIds.length=0;RR.depth.fill(0);RR.water.fill(0);RR.mirror.fill(0);zBuffer.fill(RR.far);
 const ground=rsGround(player.x,player.y,RS.active.z),pal=ground?.renderPalette||RR_PALETTES[ground?.district]||RR_PALETTES.public;
 for(let i=0;i<px.length;i+=4){px[i]=pal.fog[0];px[i+1]=pal.fog[1];px[i+2]=pal.fog[2];px[i+3]=255;}
 const sectors=rsVisibleSectors(),visible=[],reflectionFaces=[],water=[],waterGroups=new Map();
 RR.waterPassById.clear();RR.reflectionPasses=0;RR.emptyReflectionPasses=0;
 for(const [id,m]of RR.mirrorById){const p=rsReflectionMask(RR.mirrorPassCache,id,'mirrorReflection');p.id=id;p.mirror=m;}
 for(const [id,clip]of sectors){const sector=RR.sectors.get(id);if(!sector)continue;
  for(const f of sector.faces){reflectionFaces.push(f);if(!rsFaceInView(f.center,f.radius3||f.radius))continue;f.clip=clip;f.distance=(f.center[0]-player.x)**2+(f.center[1]-player.y)**2+(f.center[2]-RR.eye)**2;visible.push(f);}
  for(const f of sector.water){f.clip=clip;f.distance=(f.center[0]-player.x)**2+(f.center[1]-player.y)**2;water.push(f);const region=RR.waterById.get(f.waterRegion||f.water);if(region&&RR.eye>region.z){const key=Math.round(region.z*1000);if(!waterGroups.has(key)){const p=rsReflectionMask(RR.waterPassCache,key,'waterReflection');p.z=region.z;p.ids=p.ids||new Set();p.owners=p.owners||new Set();p.ids.clear();p.owners.clear();waterGroups.set(key,p);}const p=waterGroups.get(key);p.ids.add(region.id);p.owners.add(region.owner);RR.waterPassById.set(region.id,p);}}
 }
 if(RR.sectors.has('_unowned'))visible.push(...RR.sectors.get('_unowned').faces);
 RR.renderMask=rsWaterDependencyMask(renderMask,water);
 visible.sort((a,b)=>a.distance-b.distance);RR.visibleFaces=visible.length+water.length;RR.visibleSectors=sectors.size;
 for(const f of visible)rsDrawFace(f);
 water.sort((a,b)=>b.distance-a.distance);for(const f of water)rsDrawFace(f,{kind:'water'});
 RR.renderMask=renderMask;
 // Planar reflected architecture is masked by the actual visible water plane.
 // Only local visible sectors are considered, never all 84 rooms each frame.
 let reflectionBaseReady=false;
 function beginReflection(pass){
  if(!pass.writes){RR.emptyReflectionPasses++;return false;}
  if(!reflectionBaseReady){RR.reflectionBase.set(px);reflectionBaseReady=true;}
  // The mask is conservative when surfaces overlap; the per-pixel ID check
  // still resolves exact coverage. Empty rows never rasterize another world.
  for(let y=pass.y0;y<pass.y1;y++)if(pass.rowsMin[y]<pass.rowsMax[y])RR.reflection.fill(0,y*W+pass.rowsMin[y],y*W+pass.rowsMax[y]);
  RR.reflectionPasses++;return true;
 }
 for(const pass of waterGroups.values()){
  if(!beginReflection(pass))continue;
  for(const f of reflectionFaces)rsDrawFace(f,pass);
 }
 for(const [id,m]of RR.mirrorById){if(!sectors.has(m.owner)||rrHypot(m.center[0]-player.x,m.center[1]-player.y)>24)continue;
  const pass=RR.mirrorPassCache.get(id);if(!rsMirrorMaskVisible(pass)||!beginReflection(pass))continue;RR.visibleMirrorIds.push(id);
  const local=new Set([m.owner]);for(const p of RR.sectors.get(m.owner)?.portals||[])local.add(p.a===m.owner?p.b:p.a);
  for(const owner of local)for(const f of RR.sectors.get(owner)?.faces||[])rsDrawFace(f,pass);
 }
 const yy=clamp(Math.round(RR.centerY),0,H-1);for(let x=0;x<W;x++)zBuffer[x]=1/(RR.depth[yy*W+x]||1/RR.far);
 if(!preview){if(typeof rsDrawCreatures==='function')rsDrawCreatures(waterGroups);rsDrawEffects(waterGroups);wc.putImageData(frame,0,0);}
}
function rsProject(x,y,z){
 const dx=x-player.x,dy=y-player.y,flat=dx*camDX+dy*camDY,up=z-(RS.active.z+RS_EYE),pitch=rsViewPitch(),cp=Math.cos(pitch),sp=Math.sin(pitch),d=flat*cp+up*sp;
 if(d<=.065)return null;return {x:W/2+(dy*camDX-dx*camDY)*projection/d,y:rsViewCenterY()-(up*cp-flat*sp)*projection/d,d,scale:projection/d};
}
// Signs are baked into wall-plane triangles and rasterized with ordinary depth.
function rsDrawSigns(){}
const rrEffectColors=new Map();
function rsEffectColor(color){
 if(rrEffectColors.has(color))return rrEffectColors.get(color);let c=[190,217,206];
 if(/^#[0-9a-f]{6}$/i.test(color))c=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
 else if(/^#[0-9a-f]{3}$/i.test(color))c=[1,2,3].map(i=>parseInt(color[i]+color[i],16));
 if(rrEffectColors.size<64)rrEffectColors.set(color,c);return c;
}
function rsEffectPosition(q){return {x:q.x,y:q.y,z:Number.isFinite(q.rsZ)?q.rsZ:RS.active.z+(q.z??.5)+(RS_EYE-.64)};}
function rsEffectSegment(a,b,pass){
 a={...a};b={...b};
 if(pass){
  const surface=pass.z+.006;if(a.z<surface&&b.z<surface)return null;
  if(a.z<surface){const t=(surface-a.z)/(b.z-a.z);a={x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),z:surface};}
  if(b.z<surface){const t=(surface-b.z)/(a.z-b.z);b={x:mix(b.x,a.x,t),y:mix(b.y,a.y,t),z:surface};}
  a.z=2*pass.z-a.z;b.z=2*pass.z-b.z;
 }
 let ca=rsCameraPoint(a.x,a.y,a.z),cb=rsCameraPoint(b.x,b.y,b.z);
 if(ca[2]<.065&&cb[2]<.065)return null;
 if(ca[2]<.065){const t=(.065-ca[2])/(cb[2]-ca[2]);ca=ca.map((v,k)=>mix(v,cb[k],t));}
 if(cb[2]<.065){const t=(.065-cb[2])/(ca[2]-cb[2]);cb=cb.map((v,k)=>mix(v,ca[k],t));}
 return [ca,cb].map(p=>({x:W/2+p[0]*projection/p[2],y:RR.centerY-p[1]*projection/p[2],q:1/p[2]}));
}
function rsEffectStroke(a,b,color,size,alpha,pass,glow){
 const seg=rsEffectSegment(a,b,pass);if(!seg)return;let [p,q]=seg;
 // Screen clipping bounds long muzzle traces, including an endpoint behind
 // the eye when looking almost straight up/down. Cost never scales with range.
 let lo=0,hi=1;const dx=q.x-p.x,dy=q.y-p.y;
 for(const [origin,delta,min,max]of [[p.x,dx,-12,W+12],[p.y,dy,-12,H+12]]){
  if(rrAbs(delta)<1e-9){if(origin<min||origin>max)return;}else{let u=(min-origin)/delta,v=(max-origin)/delta;if(u>v){const t=u;u=v;v=t;}lo=rrMax(lo,u);hi=rrMin(hi,v);if(lo>hi)return;}
 }
 const end={x:mix(p.x,q.x,hi),y:mix(p.y,q.y,hi),q:mix(p.q,q.q,hi)};
 p={x:mix(p.x,q.x,lo),y:mix(p.y,q.y,lo),q:mix(p.q,q.q,lo)};q=end;
 const length=rrHypot(q.x-p.x,q.y-p.y),steps=length<.001?0:rrMin(120,rrMax(1,rrCeil(length/1.5))),time=settings.reduce?0:RS.active.clock||0;
 for(let n=0;n<=steps;n++){
  const t=steps?n/steps:0,cx=mix(p.x,q.x,t),cy=mix(p.y,q.y,t),depth=mix(p.q,q.q,t),radius=clamp(projection*depth*size,glow?1.4:.7,glow?8:3.5),r=rrCeil(radius);
  const y0=rrMax(0,rrFloor(cy-r)),y1=rrMin(H-1,rrCeil(cy+r));
  for(let y=y0;y<=y1;y++){
   const shift=pass&&!settings.reduce?RR.sin[((y*9+time*63)|0)&1023]*1.35:0,x0=rrMax(0,rrFloor(cx-r+shift)),x1=rrMin(W-1,rrCeil(cx+r+shift));
   for(let x=x0;x<=x1;x++){
    const distance=((x+.5-cx-shift)**2+(y+.5-cy)**2)/(radius*radius);if(distance>1)continue;const index=y*W+x;
    if(pass){if(!pass.ids.has(RR.water[index])||depth+1e-5<RR.waterReflectionDepth[index])continue;}
    else if(depth+1e-5<RR.depth[index])continue;
    const coverage=alpha*(glow?(.20+.80*(1-distance)):.9),i=index*4;
    // Additive light preserves the water's tint and submerged architecture.
    px[i]=rrMin(255,px[i]+color[0]*coverage);px[i+1]=rrMin(255,px[i+1]+color[1]*coverage);px[i+2]=rrMin(255,px[i+2]+color[2]*coverage);
   }
  }
 }
}
function rsDrawEffects(waterGroups=new Map()){
 const effects=[...bullets.slice(-48),...tracers.slice(-32),...particles.slice(-96)];RR.effectCount=effects.length;RR.reflectedEffects=0;
 for(let i=0;i<effects.length;i++){
  const q=effects[i];if(q.life<=0)continue;const end=rsEffectPosition(q),from=q.rsFrom||q.rsPrevious||end,color=rsEffectColor(q.color||'#bed9ce'),alpha=rrMin(1,(q.life??1)*6),projectile=q.rsProjectile||q.owner==='player'||q.kind==='plasma'||q.kind==='grave',size=q.size??(projectile?(q.r||.04)*.55:.027);
  if(from!==end)rsEffectStroke(from,end,color,rrMin(.027,size*.45),alpha*.42,null,false);
  rsEffectStroke(end,end,color,size,alpha,null,projectile);
  // Reuse the water and reflected-architecture depth buffers. No additional
  // world pass, scene copy or reflection texture is needed for moving light.
  if(i>=80)continue;
  for(const pass of waterGroups.values()){
   if(end.z<=pass.z+.006&&from.z<=pass.z+.006)continue;
   const region=RR.waterById.get(pass.ids.values().next().value),tint=region?.tint||[28,102,87],tintScale=rrMax(...tint)<=1?1:255,c=color.map((v,k)=>v*(.64+.36*tint[k]/tintScale));
   if(from!==end)rsEffectStroke(from,end,c,rrMin(.030,size*.5),alpha*.16,pass,false);
   rsEffectStroke(end,end,c,size*1.15,alpha*.31,pass,projectile);RR.reflectedEffects++;
  }
 }
}
// Render the actual stair sector through the hospital doorway before crossing.
// Clip rays at the real aperture, rather than rejecting its four corners near
// the camera. A rejected corner used to blank the last frame before entry.
let rsPortalCanvas=null,rsPortalLens=1,rsHostPortalBuffer=null,rsPortalDepth=new Float32Array(0),rsStairRenderMask=null;
function rsPortalMaskReset(mask){
 if(!mask||mask.top.length!==W)mask={top:new Int32Array(W),bottom:new Int32Array(W)};
 mask.top.fill(H);mask.bottom.fill(0);mask.x0=W;mask.x1=0;mask.y0=H;mask.y1=0;mask.pixels=0;return mask;
}
function rsPortalMaskSpan(mask,x,top,bottom){
 if(x<0||x>=W||bottom<=top)return;top=rrMax(0,top);bottom=rrMin(H,bottom);
 mask.top[x]=rrMin(mask.top[x],top);mask.bottom[x]=rrMax(mask.bottom[x],bottom);
 mask.x0=rrMin(mask.x0,x);mask.x1=rrMax(mask.x1,x+1);mask.y0=rrMin(mask.y0,top);mask.y1=rrMax(mask.y1,bottom);
}
function rsPortalMaskFinish(mask){for(let x=mask.x0;x<mask.x1;x++)mask.pixels+=rrMax(0,mask.bottom[x]-mask.top[x]);return mask;}

function rsStairAperture(){
 const e=RS_ENTRANCE,rects=[];
 // Simulation may have advanced just through the plane before rsTryEnter runs
 // on the next tick. Render its exact transformed view for that frame too.
 if(player.x<=e.hostX&&player.y>2.035&&player.y<2.965)return [[0,0,W,H]];
 for(let x=0;x<W;x++){
  const rayX=camDX+planeX*(x*2/W-1),rayY=camDY+planeY*(x*2/W-1),d=(e.hostX-player.x)/rayX;
  if(!(d>0)||zBuffer[x]<d-.05)continue;
  const y=player.y+rayY*d;if(y<2.035||y>2.965)continue;
  const top=Math.max(0,Math.floor(horizon-projection*.52/d)),bottom=Math.min(H,Math.ceil(horizon+projection*.52/d));
  if(bottom>top)rects.push([x,top,1,bottom-top]);
 }
 return rects;
}
function rsRenderStairPortal(){
 if(rsRunning()){rsRenderHostPortal();return;}
 if(!hwRunning()||!HW.resolved||!rsUnlocked()||rsState().complete||player.x>13||player.x<2.3||player.y<1||player.y>4)return;
 const aperture=rsStairAperture();if(!aperture.length)return;
 // A three-pixel apron retains displaced reflected samples at the edge.
 // rsRenderWorld also preserves upstream water-refraction dependencies; the
 // original aperture still clips composition.
 rsStairRenderMask=rsPortalMaskReset(rsStairRenderMask);
 for(const [x,y,w,h]of aperture)for(let column=x-3;column<x+w+3;column++)rsPortalMaskSpan(rsStairRenderMask,column,y-3,y+h+3);
 rsPortalMaskFinish(rsStairRenderMask);if(rsPortalDepth.length!==W)rsPortalDepth=new Float32Array(W);rsPortalDepth.set(zBuffer);
 const host={x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,camDX,camDY,planeX,planeY,z:rsPortalDepth,renderMask:RR.renderMask};
 RS.active={z:0,clock:gameTime,committed:false,weaponRest:0};
 try{
  Object.assign(player,rsEntryPose(host.x,host.y,host.a,host.vx,host.vy));
  camDX=Math.cos(player.a);camDY=Math.sin(player.a);planeX=host.planeY;planeY=-host.planeX;
  rsRenderWorld(true,rsStairRenderMask);
  if(!rsPortalCanvas)rsPortalCanvas=document.createElement('canvas');
  if(rsPortalCanvas.width!==W||rsPortalCanvas.height!==H){rsPortalCanvas.width=W;rsPortalCanvas.height=H;}
  rsPortalCanvas.getContext('2d').putImageData(frame,0,0);
 }finally{RR.renderMask=host.renderMask;RS.active=null;player.x=host.x;player.y=host.y;player.a=host.a;player.vx=host.vx;player.vy=host.vy;camDX=host.camDX;camDY=host.camDY;planeX=host.planeX;planeY=host.planeY;zBuffer.set(host.z);}
 wc.save();wc.beginPath();for(const rect of aperture)wc.rect(...rect);wc.clip();wc.drawImage(rsPortalCanvas,0,0);wc.restore();
}

// Before commitment the hospital remains visible through the same aperture
// when looking back. Render only that bounded opening, without resuming the
// parked campaign simulation. Reprojection converts its ordinary camera to
// the chapter's true pitch, including steep views without a forced level view.
function rsRenderHostPortal(){
 const s=RS.active;if(!s?.host||s.committed||Math.abs(s.z)>.001||player.y>2.01)return;
 const e=RS_ENTRANCE,plane=e.y,left=e.x+(2.035-e.hostY)*e.scale,right=e.x+(2.965-e.hostY)*e.scale;
 if(player.y<plane-.001)return;
 const pitch=rsViewPitch(),cp=Math.cos(pitch),sp=Math.sin(pitch),center=rsViewCenterY(),eye=s.z+RS_EYE;
 const corners=[[left,plane,0],[right,plane,0],[right,plane,2.65],[left,plane,2.65]].map(p=>rsCameraPoint(...p));
 const clipped=[];for(let i=0;i<corners.length;i++){const a=corners[i],b=corners[(i+1)%corners.length],inside=a[2]>=.0001,next=b[2]>=.0001;if(inside)clipped.push(a);if(inside!==next){const t=(.0001-a[2])/(b[2]-a[2]);clipped.push(a.map((v,k)=>mix(v,b[k],t)));}}if(clipped.length<3)return;
 const sx=clipped.map(v=>W/2+v[0]*projection/v[2]),sy=clipped.map(v=>center-v[1]*projection/v[2]);
 const minX=Math.max(0,Math.floor(Math.min(...sx))),maxX=Math.min(W-1,Math.ceil(Math.max(...sx))),minY=Math.max(0,Math.floor(Math.min(...sy))),maxY=Math.min(H-1,Math.ceil(Math.max(...sy)));
 if(minX>maxX||minY>maxY)return;
 if(!rsHostPortalBuffer||rsHostPortalBuffer.w!==W||rsHostPortalBuffer.h!==H)rsHostPortalBuffer={w:W,h:H,indices:new Int32Array(W*H),source:new Int32Array(W*H),u:new Float32Array(W*H),v:new Float32Array(W*H),mask:null};
 const b=rsHostPortalBuffer;let n=0,minV=Infinity,maxV=-Infinity,maxU=0;
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
  const u=(x+.5-W/2)/projection,v=(center-y-.5)/projection,flat=cp-sp*v,up=sp+cp*v,dx=camDX*flat-camDY*u,dy=camDY*flat+camDX*u;
  if(dy>=-.00001)continue;const t=(plane-player.y)/dy;if(t<0)continue;
  const atX=player.x+dx*t,atZ=eye+up*t,i=y*W+x;
  if(atX<left||atX>right||atZ<0||atZ>2.65||(RR.depth[i]&&RR.depth[i]>1/Math.max(.0001,t-.015)))continue;
  const hu=dx/-dy,hv=up/-dy;b.indices[n]=i;b.u[n]=hu;b.v[n]=hv;n++;maxU=Math.max(maxU,Math.abs(hu));minV=Math.min(minV,hv);maxV=Math.max(maxV,hv);
 }
 b.count=n;if(!n)return;
 if(rsPortalDepth.length!==W)rsPortalDepth=new Float32Array(W);rsPortalDepth.set(zBuffer);
 const sceneImage=wc.getImageData(0,0,W,H),scene={x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,pitch:aimPitch,projection,horizon,camDX,camDY,planeX,planeY,z:rsPortalDepth,mask:worldRenderMask,liminal:{...liminal},horrorView,
  map,props:environmentProps,lights:wardLights,lf:lightField,enemies,drops,bullets,particles,rings,decals,tracers,numbers,exit,cleared};
 const h=s.host,p=rsHostPose(player.x,player.y,player.a,player.vx,player.vy),lens=Math.max(1,scene.projection*maxU/Math.max(1,W/2-2),scene.projection*(maxV-minV)/Math.max(1,H-4)),sourceProjection=scene.projection/lens;
 b.lens=lens;let hospital;
 try{
  RS.active=null;map=h.map;environmentProps=h.props;wardLights=h.lights;lightField=h.lf;enemies=h.enemies;drops=h.drops;bullets=h.bullets;particles=h.particles;rings=h.rings;decals=h.decals;tracers=h.tracers;numbers=h.numbers;exit=h.exit;cleared=h.cleared;
  Object.assign(player,p);player.a=0;Object.assign(liminal,h.liminal);rsPortalLens=lens;aimPitch=H/2-center+sourceProjection*(minV+maxV)/2;
  // Reprojection identifies exactly which host samples are needed, including
  // steep pitch and overscan. Shade those source columns before composition.
  worldPrepareView();const sourceHorizon=horizon,sourceProj=projection;b.mask=rsPortalMaskReset(b.mask);
  for(let k=0;k<n;k++){
   const x=Math.max(0,Math.min(W-1,Math.floor(W/2+b.u[k]*sourceProj))),y=Math.max(0,Math.min(H-1,Math.floor(sourceHorizon-b.v[k]*sourceProj)));b.source[k]=(y*W+x)*4;
   // Neighboring host columns supply sprite depth/edge samples as well.
   for(let column=x-1;column<=x+1;column++)rsPortalMaskSpan(b.mask,column,y-1,y+2);
  }
  rsPortalMaskFinish(b.mask);worldRenderMask=b.mask;worldRender();renderWorldObjects();hospital=wc.getImageData(0,0,W,H);
  for(let k=0;k<n;k++){
   const from=b.source[k],to=b.indices[k]*4;
   sceneImage.data[to]=hospital.data[from];sceneImage.data[to+1]=hospital.data[from+1];sceneImage.data[to+2]=hospital.data[from+2];sceneImage.data[to+3]=255;
  }
 }finally{
  RS.active=s;rsPortalLens=1;worldRenderMask=scene.mask;Object.assign(player,{x:scene.x,y:scene.y,a:scene.a,vx:scene.vx,vy:scene.vy});aimPitch=scene.pitch;projection=scene.projection;horizon=scene.horizon;camDX=scene.camDX;camDY=scene.camDY;planeX=scene.planeX;planeY=scene.planeY;zBuffer.set(scene.z);Object.assign(liminal,scene.liminal);horrorView=scene.horrorView;
  map=scene.map;environmentProps=scene.props;wardLights=scene.lights;lightField=scene.lf;enemies=scene.enemies;drops=scene.drops;bullets=scene.bullets;particles=scene.particles;rings=scene.rings;decals=scene.decals;tracers=scene.tracers;numbers=scene.numbers;exit=scene.exit;cleared=scene.cleared;
  px.set(sceneImage.data);wc.putImageData(sceneImage,0,0);
 }
}
