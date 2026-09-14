// A finite analytic sector with a smooth optical fold along its long axis.
// All surfaces, fixtures, water, effects and the fixed Warden share one mapping;
// lighting and texture phase remain anchored to the actual walking coordinates.
const tfFloor=Math.floor,tfAbs=Math.abs,tfSin=Math.sin,tfCos=Math.cos,tfExp=Math.exp,tfMax=Math.max,tfMin=Math.min,tfCeil=Math.ceil,tfRound=Math.round;
const TF_LIGHT=new Float32Array((TF_END+124)*2),TF_LAMPS=[];
for(let x=-110,n=0;x<390;x+=18,n++){
 const on=x<60?n%4!==2:n%5===0||n%5===2;
 TF_LAMPS.push({x,y:4.5,on});
}
for(let i=0;i<TF_LIGHT.length;i++){
 const x=i/2-122;let light=.12+Math.max(0,1-x/90)*.035;
 for(const p of TF_LAMPS)if(p.on)light+=.72/(1+(x-p.x)**2*.58);
 light+=.60/(1+(x-390)**2*.35);
 TF_LIGHT[i]=light;
}
function tfLightAt(x){const i=((x+122)*2)|0;return TF_LIGHT[i<0?0:i>=TF_LIGHT.length?TF_LIGHT.length-1:i];}
const TF_SCAN={top:new Int32Array(0),bottom:new Int32Array(0),rays:[]};
// Raycast the mapped orthogonal outline; monotonic x compression preserves all
// wall edges, so floor spans, reflected rays and sprite occlusion agree exactly.
function tfViewCastRay(dx,dy,max=1000){
 let best=max,side=0,id=-1;
 for(let i=0;i<TF_OUTLINE.length;i++){
  const aa=TF_OUTLINE[i],bb=TF_OUTLINE[(i+1)%TF_OUTLINE.length];
  const ax=tfViewX(aa[0]),bx=tfViewX(bb[0]),vertical=aa[0]===bb[0],v=vertical?dx:dy;
  if(tfAbs(v)<1e-9)continue;
  const d=((vertical?ax:aa[1])-(vertical?player.x:player.y))/v;if(d<.00001||d>best)continue;
  const hit=vertical?player.y+d*dy:player.x+d*dx,lo=tfMin(vertical?aa[1]:ax,vertical?bb[1]:bx),hi=tfMax(vertical?aa[1]:ax,vertical?bb[1]:bx);
  if(hit<lo-1e-7||hit>hi+1e-7)continue;best=d;side=vertical?0:1;id=i;
 }
 return {d:best,side,id};
}
function tfRenderWorld(){
 const ceiling=1.28,floorTex=materialPixels[3],wallTex=materialPixels[0],ceilTex=materialPixels[1],s=TF.active;
 const flash=muzzle>0?(settings.reduce?.025:.12):0,time=s?.clock||0,mask=worldRenderMask;
 if(TF_SCAN.top.length!==W){TF_SCAN.top=new Int32Array(W);TF_SCAN.bottom=new Int32Array(W);TF_SCAN.rays.length=W;}
 // Full-width depth preserves Canvas clip/crop runs; heavy shaders below
 // remain bounded by the actual aperture.
 for(let x=0;x<W;x++){
  const camera=x*2/W-1,ray=tfViewCastRay(camDX+planeX*camera,camDY+planeY*camera);
  ray.d=tfMax(.03,ray.d);TF_SCAN.rays[x]=ray;zBuffer[x]=ray.d;
  TF_SCAN.top[x]=tfMax(0,tfFloor(horizon-projection*ceiling/ray.d));
  TF_SCAN.bottom[x]=tfMin(H-1,tfCeil(horizon+projection*(.52-TF_WATER)/ray.d));
 }
 // Water shading is sampled in 2×2 blocks at normal render sizes. Walls,
 // silhouettes, ripples and moving highlights retain the full raster.
 const sample=W>=480?2:1;let shadedSamples=0;
 for(let y=mask?tfFloor(mask.y0/sample)*sample:0;y<(mask?mask.y1:H);y+=sample){
  const floor=y>horizon,dist=projection*(floor?.52-TF_WATER:ceiling)/tfMax(.5,tfAbs(y-horizon));
  const fog=tfExp(-dist*.029),tex=floor?floorTex:ceilTex;
  let vx=player.x+dist*(camDX-planeX),wy=player.y+dist*(camDY-planeY);
  const sx=sample*2*dist*planeX/W,sy=sample*2*dist*planeY/W;
  for(let x=0;x<W;x+=sample,vx+=sx,wy+=sy){
   if(mask&&!worldRenderMaskIntersects(x,y,x+sample,y+sample,mask))continue;
   const last=tfMin(W-1,x+sample-1);
   if(y>=TF_SCAN.top[x]&&y+sample-1<=TF_SCAN.bottom[x]&&y>=TF_SCAN.top[last]&&y+sample-1<=TF_SCAN.bottom[last])continue;
   shadedSamples++;
   const wx=tfWorldX(vx),wave=floor?tfSin(wx*2.2+wy*3.7-time*1.2)*.018+tfSin(wx*.9-wy*4.6+time*.7)*.011:0;
   const tx=tfFloor((wx+wave)*128)&255,ty=tfFloor((wy-wave)*128)&255,ti=(ty*256+tx)*4;
   const base=tex?(tex[ti]*.30+tex[ti+1]*.52+tex[ti+2]*.18):80;
   const seam=floor&&((tfFloor(wx*128)&63)<2||(tfFloor(wy*128)&63)<2)?.63:1;
   const transverse=tfMax(.42,1-tfAbs(wy-4.5)*.20),corner=wx>382&&wy>4.85?(wy>5.7?.24:1-(wy-4.85)*.89):1;
   const light=tfLightAt(wx)*transverse*corner*(floor?1.25:.72),v=base*light*seam;
   const i=(y*W+x)*4,glow=flash/(1+dist*.3);
   let red=6+(v*.85-6)*fog+glow*100,green=8+(v*.97-8)*fog+glow*105,blue=9+(v*.94-9)*fog+glow*90;
   if(floor){
    // Analytic planar reflection: reflect the camera through the water, trace
    // the same wall ray, and shade its true reflected height. Ceiling lamps are
    // evaluated at that ray's ceiling intersection, not painted screen streaks.
    const ray=TF_SCAN.rays[x],rc=x*2/W-1,rdx=camDX+planeX*rc,rdy=camDY+planeY*rc;
    const refHeight=2*TF_WATER-.52+(y-horizon)/projection*ray.d;
    let reflected=0;
    if(refHeight<1.8){
     const hx=tfWorldX(player.x+rdx*ray.d),hy=player.y+rdy*ray.d,along=ray.side?hx:hy;
     const rtx=tfFloor((along+wave)*128)&255,rty=tfMax(0,tfMin(255,tfFloor((1.8-refHeight)/1.8*255))),ri=(rty*256+rtx)*4;
     const tone=wallTex?(wallTex[ri]*.3+wallTex[ri+1]*.52+wallTex[ri+2]*.18):90;
     reflected=tone*tfLightAt(hx)*(ray.side?1:.76)*(refHeight<.66?.6:1);
    }else{
     const cd=(1.8-2*TF_WATER+.52)*projection/tfMax(.5,y-horizon),cx=tfWorldX(player.x+rdx*cd),cy=player.y+rdy*cd;
     reflected=10+tfLightAt(cx)*19;
     const lampIndex=tfRound((cx+110)/18),lamp=TF_LAMPS[lampIndex];
     if(lamp?.on&&tfAbs(cx-lamp.x)<.13+tfAbs(wave)*4&&cy>4.02&&cy<4.98)reflected+=125;
    }
    const fresnel=tfMin(.73,.36+dist*.013),r=reflected*tfExp(-dist*.024);
    red=red*(1-fresnel)*.65+r*fresnel*.50;green=green*(1-fresnel)*.86+r*fresnel*.75+2;blue=blue*(1-fresnel)*.86+r*fresnel*.73+2;
    const caustic=(tfSin(wx*3.1+wy*5.9+time*.7+tfSin(wy*2-time))*.5+.5)**10*tfLightAt(wx)*3;
    green+=caustic;blue+=caustic*.7;
   }
   px[i]=red;px[i+1]=green;px[i+2]=blue;px[i+3]=255;
   if(sample===2){if(x+1<W){px[i+4]=red;px[i+5]=green;px[i+6]=blue;px[i+7]=255;}if(y+1<H){const below=i+W*4;px[below]=red;px[below+1]=green;px[below+2]=blue;px[below+3]=255;if(x+1<W){px[below+4]=red;px[below+5]=green;px[below+6]=blue;px[below+7]=255;}}}
  }
 }
 WORLD_RENDER_WORK.hallSamples+=shadedSamples;
 for(let x=mask?mask.x0:0;x<(mask?mask.x1:W);x++){
  if(mask?.top&&mask.bottom[x]<=mask.top[x])continue;
  const camera=x*2/W-1,dx=camDX+planeX*camera,dy=camDY+planeY*camera,ray=TF_SCAN.rays[x];
  const d=tfMax(.03,ray.d),top=horizon-projection*ceiling/d,bottom=horizon+projection*.52/d,hh=bottom-top;
  const y0=tfMax(TF_SCAN.top[x],mask?.top?mask.top[x]:mask?mask.y0:0),y1=tfMin(TF_SCAN.bottom[x],mask?.bottom?mask.bottom[x]-1:mask?mask.y1-1:H-1),hx=tfWorldX(player.x+dx*d),hy=player.y+dy*d;
  const along=ray.side?hx:hy,tx=tfFloor(along*128)&255;
  const light=tfLightAt(hx)*(ray.side?1:.76)*(hx>382&&hy>5?.25:1),fog=tfExp(-d*.026);
  const phase=((hx+112+(hy>4.5?8:0))%22+22)%22,grainSeed=tfFloor(hx*43)^tfFloor(hy*19);
  WORLD_RENDER_WORK.hallWallPixels+=tfMax(0,y1-y0+1);
  for(let y=y0;y<=y1;y++){
   const raw=(y-top)/hh,v=raw<0?0:raw>1?1:raw,height=1.8-v*1.8,ty=(v*255)|0,ti=(ty*256+tx)*4;
   let shade=wallTex?(wallTex[ti]*.30+wallTex[ti+1]*.52+wallTex[ti+2]*.18):125;
   let r=.89,g=.98,b=.90;if(height<.66){r=.44;g=.63;b=.59;}
   if(height<TF_WATER+.05)shade*=.42;if(tfAbs(height-.67)<.018)shade*=1.45;
   if(ray.side&&hx<370&&phase<1.18&&height<1.33){shade*=phase<.035||phase>1.14||height>1.30?.90:.40;if(phase>.92&&phase<1.03&&height>.61&&height<.64)shade=145;}
   const grain=((grainSeed^ty*7)&7)*.37,lum=(shade+grain)*light,glow=flash/(1+d*.4),i=(y*W+x)*4;
   px[i]=6+(lum*r-6)*fog+glow*100;px[i+1]=8+(lum*g-8)*fog+glow*105;px[i+2]=9+(lum*b-9)*fog+glow*90;px[i+3]=255;
  }
 }
 tfRenderThroatCeilings();
 if(mask)wc.putImageData(frame,0,0,mask.x0,mask.y0,mask.x1-mask.x0,mask.y1-mask.y0);else wc.putImageData(frame,0,0);
 tfRenderFixtures();tfRenderPresence();tfRenderWaterEffects();
}
// Texture the low vestibule ceilings with the same world-space sampling as
// the main ceiling. A stretched mesh quad would expose a flat triangle at entry.
function tfRenderThroatCeilings(){
 if(player.x>9&&player.x<390)return;
 const tex=materialPixels[1],mask=worldRenderMask;
 for(let y=mask?mask.y0:0;y<Math.min(mask?mask.y1:H,Math.ceil(horizon));y++){
  const d=projection*.56/Math.max(.5,horizon-y),fog=tfExp(-d*.029);
  for(let x=mask?mask.x0:0;x<(mask?mask.x1:W);x++){
   if(mask?.top&&(y<mask.top[x]||y>=mask.bottom[x]))continue;
   if(TF_SCAN.rays[x].d<d)continue;
   const c=x*2/W-1,wx=tfWorldX(player.x+(camDX+planeX*c)*d),wy=player.y+(camDY+planeY*c)*d;
   if(wy<4.04||wy>4.96||!((wx>=-1&&wx<=4)||(wx>=396&&wx<=TF_END+1)))continue;
   const ti=((tfFloor(wy*128)&255)*256+(tfFloor(wx*128)&255))*4,base=tex?tex[ti]*.30+tex[ti+1]*.52+tex[ti+2]*.18:80,v=base*tfLightAt(wx)*.72,i=(y*W+x)*4;
   px[i]=6+(v*.85-6)*fog;px[i+1]=8+(v*.97-8)*fog;px[i+2]=9+(v*.94-9)*fog;px[i+3]=255;
  }
 }
}
function tfQuad(points,color,emissive=false,tex=-1){
 const worldPoints=points.map(p=>({x:tfViewX(p[0]),y:p[1],z:p[2]}));
 const d=worldPoints.reduce((n,v)=>n+(v.x-player.x)*camDX+(v.y-player.y)*camDY,0)/4;
 drawMeshFace({worldPoints,color,tex,emissive,d});
}
function tfRenderFixtures(){

 const visible=TF_LAMPS.filter(p=>tfAbs(p.x-player.x)<65||p.x>370);
 visible.sort((a,b)=>tfAbs(b.x-player.x)-tfAbs(a.x-player.x));
 for(const p of visible){
  const x=p.x;
  tfQuad([[x-.17,3.93,1.70],[x+.17,3.93,1.70],[x+.17,5.07,1.70],[x-.17,5.07,1.70]],'#202c29');
  tfQuad([[x-.085,4.02,1.685],[x+.085,4.02,1.685],[x+.085,4.98,1.685],[x-.085,4.98,1.685]],p.on?'#89958b':'#28332f',p.on);
  if(p.on){const v=project(x,4.5,1.68);if(v&&v.d<26&&zBuffer[clamp(v.x|0,0,W-1)]>v.d-.3)drawGlow(v.x,v.y,tfMin(32,v.scale*.35),'#bbc7aa',.035);}
 }
 // Plain far doorway. The Warden's dark corner is to its right, physically clear of it.
 for(const y of [3.30,4.85])tfQuad([[389.95,y,0],[389.95,y+.045,0],[389.95,y+.045,1.37],[389.95,y,1.37]],'#6c7770');
 tfQuad([[389.95,3.30,1.34],[389.95,4.895,1.34],[389.95,4.895,1.43],[389.95,3.30,1.43]],'#657367');
 tfQuad([[390.1,3.39,.014],[391.4,3.39,.014],[391.4,4.77,.014],[390.1,4.77,.014]],'#889986',true);
 // Dim shoulder of plaster behind the figure; no halo or exit light attached to him.
 tfQuad([[389.94,5.27,.12],[389.94,5.96,.12],[389.94,5.96,1.73],[389.94,5.27,1.73]],'#1c2926');
}
function tfRenderPresence(){
 const s=TF.active,art=monsterSprites[3];if(!s||s.wardenGone||!art)return;
 const w=TF_WARDEN,view=tfPresencePoint(),depth=(view.x-player.x)*camDX+(w.y-player.y)*camDY;
 if(depth<.1)return;
 const alpha=s.wardenAlpha*.88;if(alpha<=0)return;
 const height=1.55,width=height*art.aspect;
 // A fixed world-facing plane, not a camera-facing monster that swivels to watch.
 const vertices=[[w.x,w.y+width/2,0,0,art.image.height],[w.x,w.y-width/2,0,art.image.width,art.image.height],
  [w.x,w.y-width/2,height,art.image.width,0],[w.x,w.y+width/2,height,0,0]].map(([x,y,z,u,v])=>{const p=project(x,y,z);return p?{...p,u,v}:null;});
 if(vertices.some(p=>!p))return;
 const left=tfMax(0,tfFloor(tfMin(...vertices.map(v=>v.x)))),right=tfMin(W,tfCeil(tfMax(...vertices.map(v=>v.x))));
 wc.save();wc.beginPath();let run=-1;
 for(let x=left;x<=right;x++){
  const rayDX=camDX+planeX*(x*2/W-1),d=(view.x-player.x)/rayDX;
  const visible=x<right&&d>0&&zBuffer[x]>d-.03;
  if(visible&&run<0)run=x;
  if(!visible&&run>=0){wc.rect(run,0,x-run,H);run=-1;}
 }
 wc.clip();wc.globalAlpha=alpha;
 textureTriangle(art.image,vertices[0],vertices[1],vertices[2]);
 textureTriangle(art.image,vertices[0],vertices[2],vertices[3]);
 const reflected=[[w.x,w.y+width/2,2*TF_WATER,0,art.image.height],[w.x,w.y-width/2,2*TF_WATER,art.image.width,art.image.height],[w.x,w.y-width/2,2*TF_WATER-height,art.image.width,0],[w.x,w.y+width/2,2*TF_WATER-height,0,0]].map(([x,y,z,u,v])=>{const p=project(x,y,z);return p?{...p,x:p.x+tfSin(p.y*.17+s.clock)*.5,u,v}:null;});
 if(reflected.every(Boolean)){wc.save();tfClipWater();wc.globalAlpha=alpha*.15;textureTriangle(art.image,reflected[0],reflected[1],reflected[2]);textureTriangle(art.image,reflected[0],reflected[2],reflected[3]);wc.restore();}
 wc.restore();
}
function tfRenderDoor(p){
 meshFaces=[];
 for(const x of [-.49,.49])meshBox(p,x,0,0,.065,.10,1.10,'#53615a',1);
 meshBox(p,0,0,1.08,1.06,.11,.065,'#4b5750',1);
 // Leaf already open into the shallow vestibule, leaving a clear central passage.
 meshBox(p,.41,-.40,0,.055,.80,1.07,'#384b44',0);
 // The opening is filled by the real Transfer renderer, not a painted threshold.
 for(const face of meshFaces){face.d=face.worldPoints.reduce((n,v)=>n+(v.x-player.x)*camDX+(v.y-player.y)*camDY,0)/4;}
 meshFaces.sort((a,b)=>b.d-a.d);for(const face of meshFaces)drawMeshFace(face);
}
const tfRenderProp=renderProp;
renderProp=function(p){if(p.kind==='tf_door')tfRenderDoor(p);else tfRenderProp(p);};

// Other renderer callers (projectiles, tracers, particles) use the identical
// optical coordinates without changing the inherited planar aiming controls.
const tfBaseProject=project;
project=function(x,y,z=.5){return tfBaseProject(tfRunning()?tfViewX(x):x,y,z);};
function tfClipWater(){
 wc.beginPath();let start=0,top=tfMax(0,TF_SCAN.bottom[0]+1);for(let x=1;x<=W;x++){const next=x<W?tfMax(0,TF_SCAN.bottom[x]+1):-1;if(next===top)continue;if(top<H)wc.rect(start,top,x-start,H-top);start=x;top=next;}wc.clip();
}
function tfRenderWaterEffects(){
 const s=TF.active;if(!s)return;wc.save();tfClipWater();
 // Foot rings expand in world space and clip at the flooded wall footprint.
 for(const q of s.ripples){const t=q.age/q.life,radius=.08+q.age*.9*q.power;wc.strokeStyle='#85aaa0';wc.globalAlpha=(1-t)*.22;wc.lineWidth=1;wc.beginPath();let open=false;
  for(let j=0;j<=32;j++){const a=j/32*TAU,x=q.x+tfCos(a)*radius,y=q.y+tfSin(a)*radius,p=tfWall(x,y)?null:project(x,y,TF_WATER+.002);if(!p){open=false;continue;}if(open)wc.lineTo(p.x,p.y);else{wc.moveTo(p.x,p.y);open=true;}}wc.stroke();
 }
 // Mirror moving bolts and sparks below the same water plane. All use bounded
 // existing effects; no extra world render, persistent texture or scene camera.
 const effects=bullets.slice(-32).concat(particles.slice(-64),tracers.slice(-24));
 for(const q of effects){const z=Number.isFinite(q.z)?q.z:.52;if(z<=TF_WATER||tfWall(q.x,q.y))continue;const p=project(q.x,q.y,2*TF_WATER-z);if(!p||p.x<0||p.x>=W||p.y<0||p.y>=H||zBuffer[p.x|0]<p.d-.05)continue;
  const life=Number.isFinite(q.max)?clamp(q.life/q.max,0,1):1,r=clamp(p.scale*(q.r||q.size||.035)*1.7,1,18),offset=tfSin(p.y*.19+s.clock*2)*tfMin(3,p.d*.09);
  wc.globalAlpha=1;drawGlow(p.x+offset,p.y,r,q.color||'#8ecfc0',.25*life);
 }
 wc.restore();
}

// Two reciprocal, same-unit portals. Only the adjoining world is drawn; its
// simulation remains parked. Cameras, weapon state and inputs are never reset.
let tfPortalHostPass=null,tfPortalBusy=false;
const TF_PORTAL_STATS={entryPixels:0,exitPixels:0,passes:0,primaryPasses:0,secondaryPasses:0,readbacks:0,surfaceResizes:0};
const TF_PORTAL_CACHE={surface:null,context:null,depth:new Float32Array(0),snapshots:[],mask:{top:new Int32Array(0),bottom:new Int32Array(0),x0:0,x1:0,y0:0,y1:0,pixels:0},empty:[],virtual:null};
function tfPortalCastRay(x,y,dx,dy,max=70){
 const p=tfPortalHostPass,nx=-p.nx,ny=-p.ny,den=dx*nx+dy*ny,side=(x-p.x)*nx+(y-p.y)*ny;
 const skip=side<0&&den>1e-8?Math.max(0,-side/den):0;
 tfPortalHostPass=null;
 try{if(!skip)return castRay(x,y,dx,dy,max);const ray=castRay(x+dx*(skip+1e-7),y+dy*(skip+1e-7),dx,dy,Math.max(.01,max-skip));return {...ray,d:ray.d+skip+1e-7};}
 finally{tfPortalHostPass=p;}
}
// Snapshots retain render-only references. Neither virtual renderer mutates the
// parked map or lighting; copying 192 KiB of lighting each view is unnecessary.
function tfPortalSnapshot(slot=0){
 let b=TF_PORTAL_CACHE.snapshots[slot];if(!b)b=TF_PORTAL_CACHE.snapshots[slot]={player:{},liminal:{}};
 Object.assign(b,{active:TF.active,map,props:environmentProps,lights:wardLights,lf:lightField,enemies,drops,bullets,particles,rings,decals,tracers,numbers,exit,cleared,horrorView,projection,horizon,camDX,camDY,planeX,planeY,pitch:aimPitch,mask:worldRenderMask,hostPass:tfPortalHostPass});
 Object.assign(b.player,{x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy});Object.assign(b.liminal,liminal);return b;
}
function tfPortalRestore(b){
 TF.active=b.active;Object.assign(player,b.player);map=b.map;environmentProps=b.props;wardLights=b.lights;lightField=b.lf;enemies=b.enemies;drops=b.drops;bullets=b.bullets;particles=b.particles;rings=b.rings;decals=b.decals;tracers=b.tracers;numbers=b.numbers;exit=b.exit;cleared=b.cleared;Object.assign(liminal,b.liminal);horrorView=b.horrorView;projection=b.projection;horizon=b.horizon;camDX=b.camDX;camDY=b.camDY;planeX=b.planeX;planeY=b.planeY;aimPitch=b.pitch;worldRenderMask=b.mask;tfPortalHostPass=b.hostPass;
}
function tfPortalEnsure(){
 const c=TF_PORTAL_CACHE;
 if(!c.surface){c.surface=document.createElement('canvas');c.context=c.surface.getContext('2d',{alpha:false});}
 if(c.surface.width!==W||c.surface.height!==H){c.surface.width=W;c.surface.height=H;TF_PORTAL_STATS.surfaceResizes++;}
 if(c.depth.length!==W){c.depth=new Float32Array(W);c.mask.top=new Int32Array(W);c.mask.bottom=new Int32Array(W);}
 return c;
}
function tfPortalDraw(mask){
 worldRenderMask=mask;worldRender();renderWorldObjects();
}
function tfPortalHostLists(s){
 const h=s.host;if(h.portalLists)return h.portalLists;
 const visible=q=>(q.x-s.door.x)*-s.door.nx+(q.y-s.door.y)*-s.door.ny>-.07;
 return h.portalLists={props:h.props.filter(p=>p.tfDoor||visible(p)),enemies:h.enemies.filter(visible),drops:h.drops.filter(visible),bullets:h.bullets.filter(visible),particles:h.particles.filter(visible),rings:h.rings.filter(visible),decals:h.decals.filter(visible),tracers:h.tracers.filter(visible),numbers:h.numbers.filter(visible)};
}
function tfPortalHostView(s,which,mask=null){
 const b=tfPortalSnapshot(1),h=s.host,plane=which==='entry'?TF_ENTRY:TF_END;
 const cameraX=plane-(tfViewX(plane)-player.x),p=tfHostPose(cameraX,player.y,player.a,player.vx,player.vy,which,s.door),lists=tfPortalHostLists(s);
 try{
  TF.active=null;Object.assign(player,p);map=h.map;environmentProps=lists.props;wardLights=h.lights;lightField=h.lf;enemies=lists.enemies;drops=lists.drops;bullets=lists.bullets;particles=lists.particles;rings=lists.rings;decals=lists.decals;tracers=lists.tracers;numbers=lists.numbers;exit=h.exit;cleared=h.cleared;Object.assign(liminal,h.liminal);tfPortalHostPass=s.door;
  tfPortalDraw(mask);
 }finally{tfPortalRestore(b);}
}
function tfPortalCoverage(which,depth){
 const c=TF_PORTAL_CACHE,m=c.mask,plane=tfViewX(which==='entry'?TF_ENTRY:TF_END);
 m.top.fill(0);m.bottom.fill(0);m.x0=W;m.x1=0;m.y0=H;m.y1=0;m.pixels=0;
 for(let x=0;x<W;x++){
  const dx=camDX+planeX*(x*2/W-1),dy=camDY+planeY*(x*2/W-1),d=(plane-player.x)/dx;
  if(!(d>0)||depth[x]<d-.04)continue;
  const y=player.y+dy*d;if(y<4.04||y>4.96)continue;
  const top=Math.max(0,Math.floor(horizon-projection*.56/d)),bottom=Math.min(H,Math.ceil(horizon+projection*.52/d));
  if(bottom<=top)continue;m.top[x]=top;m.bottom[x]=bottom;m.x0=Math.min(m.x0,x);m.x1=x+1;m.y0=Math.min(m.y0,top);m.y1=Math.max(m.y1,bottom);m.pixels+=bottom-top;
 }
 return m;
}
function tfPortalCanSee(plane,pose,depth=null){
 const dx=Math.cos(pose.a),dy=Math.sin(pose.a),lens=W/(2*projection);
 for(let x=0;x<W;x++){
  const lateral=(x*2/W-1)*lens,rx=dx-dy*lateral,ry=dy+dx*lateral,t=(plane-pose.x)/rx;
  if(!(t>0)||depth&&depth[x]<t-.04)continue;
  const y=pose.y+ry*t;if(y>=4.04&&y<=4.96)return true;
 }
 return false;
}
function tfPortalVirtual(door){
 const c=TF_PORTAL_CACHE;
 if(!c.virtual)c.virtual={host:{liminal:{}},door,clock:0,fade:0,wardenAlpha:1,wardenGone:false,ripples:[]};
 const s=c.virtual,h=s.host;s.door=door;s.clock=gameTime;
 Object.assign(h,{map,props:environmentProps,lights:wardLights,lf:lightField,enemies,drops,bullets,particles,rings,decals,tracers,numbers,exit,cleared,portalLists:null});Object.assign(h.liminal,liminal);return s;
}
function tfPortalEnterView(s,p){
 const empty=TF_PORTAL_CACHE.empty;TF.active=s;Object.assign(player,p);environmentProps=empty;wardLights=empty;enemies=empty;drops=empty;bullets=empty;particles=empty;rings=empty;decals=empty;tracers=empty;numbers=empty;exit={x:-999,y:-999};cleared=false;worldPrepareView();
}
// Plan before drawing: the physical camera chooses the base, independently of
// which simulation owns the capsule. A zero-area second view costs no render.
function tfRenderPortalFrame(){
 TF_PORTAL_STATS.entryPixels=TF_PORTAL_STATS.exitPixels=TF_PORTAL_STATS.passes=TF_PORTAL_STATS.primaryPasses=TF_PORTAL_STATS.secondaryPasses=TF_PORTAL_STATS.readbacks=0;
 for(const k in WORLD_RENDER_WORK)WORLD_RENDER_WORK[k]=0;
 if(tfPortalBusy||rsRunning()||!useChapter||stage>1)return false;
 const active=TF.active;let which,s,pose;
 if(active){which=player.x<TF_ENTRY+8?'entry':player.x>390?'exit':null;if(!which)return false;s=active;}
 else{
  if(tfState().status==='complete'||CH.maze||liminal.mode)return false;
  const door=TF_DOORS[stage];pose=tfEntryPose(player.x,player.y,player.a,player.vx,player.vy,door);
  if(pose.x<TF_ENTRY-10||pose.x>TF_ENTRY+1.7||Math.abs(pose.y-4.5)>7)return false;
  which='entry';s=tfPortalVirtual(door);
 }
 worldPrepareView();
 const plane=which==='entry'?TF_ENTRY:TF_END,hallPose=pose||player,inside=which==='entry'?hallPose.x>=plane:hallPose.x<=plane;
 // A fully ordinary base with no forward portal rays needs no saved surface.
 if((active&&inside||!active&&!inside)&&!tfPortalCanSee(active?tfViewX(plane):plane,hallPose))return false;
 const c=tfPortalEnsure(),b=tfPortalSnapshot(0);tfPortalBusy=true;
 try{
  if(!active&&inside)tfPortalEnterView(s,pose);
  if(inside)tfPortalDraw(null);
  else if(active)tfPortalHostView(s,which);
  else tfPortalDraw(null);
  TF_PORTAL_STATS.primaryPasses=1;c.depth.set(zBuffer);
  if(!active&&!inside)tfPortalEnterView(s,pose);
  const m=tfPortalCoverage(which,c.depth);TF_PORTAL_STATS[which+'Pixels']=m.pixels;
  if(m.pixels){
   c.context.drawImage(world,0,0);
   if(inside)tfPortalHostView(s,which,m);else tfPortalDraw(m);
   TF_PORTAL_STATS.secondaryPasses=1;TF_PORTAL_STATS.passes=1;WORLD_RENDER_WORK.maskedPixels=m.pixels;
   // Canvas layers (props, actors, water effects) are part of the view. Compose
   // those directly instead of reading/reuploading entire RGBA frames.
   c.context.save();c.context.beginPath();let start=m.x0,top=m.top[start],bottom=m.bottom[start];
   for(let x=start+1;x<=m.x1;x++){const t=x<m.x1?m.top[x]:-1,e=x<m.x1?m.bottom[x]:-1;if(t===top&&e===bottom)continue;if(bottom>top)c.context.rect(start,top,x-start,bottom-top);start=x;top=t;bottom=e;}
   c.context.clip();c.context.drawImage(world,0,0);c.context.restore();wc.drawImage(c.surface,0,0);
  }
  zBuffer.set(c.depth);return true;
 }finally{tfPortalRestore(b);tfPortalBusy=false;}
}
