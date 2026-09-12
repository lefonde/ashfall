// Outdoor profile: horizon sky, terrain and perspective-correct textured geometry.
// A pixel depth buffer lets low objects, roofs and tall buildings occlude at their actual heights.
const S4_ART={tiles:[],sky:null,city:null};
function prepareExterior(){
 const load=(src,kind)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  if(kind==='parking'){s4qPrepareParking(img);}else if(kind==='cerberusBody'||kind==='cerberusHeads'){cbPrepareArt(img,kind==='cerberusBody'?'body':'heads');}else if(kind==='seraphim'){s4tPrepareArt(img);}else if(kind==='recovery'){s4qPrepareAtlas(img);}else if(kind==='ambulance'){s4dPrepareVan(img);}else if(kind==='sky'||kind==='city'){
   const c=document.createElement('canvas');c.width=kind==='sky'?1536:1024;c.height=kind==='sky'?512:342;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0,c.width,c.height);S4_ART[kind]={w:c.width,h:c.height,data:g.getImageData(0,0,c.width,c.height).data};
  }else for(let i=0;i<4;i++){
   const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d',{willReadFrequently:true}),cellW=img.width/2,split=img.height*(kind==='flora'?653/1254:.5),cellY=i<2?0:split,cellH=i<2?split:img.height-split,inset=kind==='facade'?4:kind==='flora'?0:1;
   g.drawImage(img,(i%2)*cellW+inset,cellY+inset,cellW-inset*2,cellH-inset*2,0,0,256,256);
   S4_ART.tiles[({ground:0,facade:4,woods:8,flora:12}[kind])+i]=g.getImageData(0,0,256,256).data;
  }resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Exterior artwork could not load'));img.src=src;});
 return Promise.all([load(ASSETS.exteriorSky,'sky'),load(ASSETS.exteriorMaterials,'ground'),load(ASSETS.exteriorFacade,'facade'),load(ASSETS.groundsTextures,'woods'),load(ASSETS.groundsSprites,'flora'),load(ASSETS.distantCity,'city'),load(ASSETS.ambulance,'ambulance'),load(ASSETS.recovery,'recovery'),load(ASSETS.seraphim,'seraphim'),load(ASSETS.cerberusBody,'cerberusBody'),load(ASSETS.cerberusHeads,'cerberusHeads'),load(ASSETS.parking,'parking')]);
}
function s4SkyU(a){return ((.53+(a+Math.PI/2)/TAU)%1+1)%1;}
function s4BakeLights(){
 S4.light=new Float32Array(S4_TW*S4_TH*3);
 for(let y=0;y<S4_TH;y++)for(let x=0;x<S4_TW;x++){
  const i=(y*S4_TW+x)*3;let r=.47,g=.66,b=.76;
  for(const l of S4.lamps){const d2=((x+.5)/2-l.x)**2+((y+.5)/2-l.y)**2,f=.85/(1+d2*.5);r+=l.color[0]/200*f;g+=l.color[1]/200*f;b+=l.color[2]/200*f;}
  S4.light[i]=r;S4.light[i+1]=g;S4.light[i+2]=b;
 }
}
function s4WorldRender(){
 if(!S4.depth||S4.depth.length!==W*H)S4.depth=new Float32Array(W*H);
 if(!S4.light)s4BakeLights();s4dBakeFireLight();
 if(!S4.skyColumns||S4.skyColumns.length!==W){S4.skyColumns=new Int32Array(W);S4.skyRayLength=new Float32Array(W);}
 const depth=S4.depth,sky=S4_ART.sky,texes=S4_ART.tiles,skyColumns=S4.skyColumns,skyRayLength=S4.skyRayLength;
 const flash=muzzle>0?(settings.reduce?.04:.18):0,gr=equippedItem().rgb,clock=settings.reduce?0:gameTime,toyLight=s4tRunning()?s4tLightPosition():null;
 for(let x=0;x<W;x++){const c=2*x/W-1,dx=camDX+planeX*c,dy=camDY+planeY*c;skyColumns[x]=sky?Math.floor(s4SkyU(Math.atan2(dy,dx))*sky.w):0;skyRayLength[x]=Math.hypot(dx,dy);}
 for(let y=0;y<H;y++){
  const down=y-horizon,dist=down>0?projection*.52/Math.max(.5,down):Infinity;
  const nearFloor=down>0&&dist<78,canReachLake=down>0&&dist<520,lit=Math.exp(-dist*.014);
  let wx=player.x+dist*(camDX-planeX),wy=player.y+dist*(camDY-planeY);
  const stepx=2*dist*planeX/W,stepy=2*dist*planeY/W;
  for(let x=0;x<W;x++){
   const pi=y*W+x,i=pi*4;
   const outside=wx<0||wy<0||wx>=S4_WIDTH||wy>=S4_HEIGHT;
   const openWater=canReachLake&&(outside||!nearFloor)&&s4Pond(wx,wy);
   if(!nearFloor&&!openWater){
    if(sky){const syRaw=(.93-Math.atan2(horizon-y,projection*skyRayLength[x])/.64)*sky.h,sy=clamp(Math.floor(syRaw),0,sky.h-1),ti=(sy*sky.w+skyColumns[x])*4;px[i]=sky.data[ti];px[i+1]=sky.data[ti+1];px[i+2]=sky.data[ti+2];if(syRaw<0){const blend=clamp(-syRaw/(sky.h*.035),0,1);px[i]=mix(px[i],5,blend);px[i+1]=mix(px[i+1],12,blend);px[i+2]=mix(px[i+2],18,blend);}}else{px[i]=9;px[i+1]=18;px[i+2]=25;}
    depth[pi]=1e6;
   }else{
    const cell=clamp(wy*2|0,0,S4_TH-1)*S4_TW+clamp(wx*2|0,0,S4_TW-1),kind=openWater?3:S4.terrain[cell],water=kind===3,tex=texes[kind];
    const scale=kind===2?160:kind===0?96:64;
    const tx=Math.floor(wx*scale+(water?Math.sin(wy*1.9+clock*.63)*2:0))&255,ty=Math.floor(wy*scale+(water?clock*3:0))&255,ti=(ty*256+tx)*4;
    const li=cell*3;let r=(tex?tex[ti]:50)*S4.light[li],g=(tex?tex[ti+1]:65)*S4.light[li+1],b=(tex?tex[ti+2]:67)*S4.light[li+2];
    if(water&&sky){const sy=clamp(Math.floor((.93-Math.atan2(down,projection*skyRayLength[x])/.64)*sky.h),0,sky.h-1),sx=(skyColumns[x]+Math.floor(Math.sin(wx*3+clock)*2)+sky.w)%sky.w,si=(sy*sky.w+sx)*4;r=r*.6+sky.data[si]*.42;g=g*.6+sky.data[si+1]*.42;b=b*.6+sky.data[si+2]*.42;}
    if(toyLight){const td=(wx-toyLight.x)**2+(wy-toyLight.y)**2;if(td<20){const f=.7*Math.exp(-td*.65)*(S4T.phase==='airborne'?.55:1);r+=f*100;g+=f*80;b+=f*36;}}
    if(wx>38&&wx<48&&wy>19&&wy<25){const g0=Math.exp(-((wx-43)**2*.07+(wy-19.5)**2*.22))*(.22+CB.gateProgress*.68);r+=g0*140;g+=g0*6;b+=g0*32;}
    const fire=S4.fireLight[cell];r+=fire*160;g+=fire*61;b+=fire*12;const glow=flash/(1+dist*.35),waterLight=water?Math.exp(-Math.min(dist,60)*.014-Math.max(0,dist-60)*.002):lit;
    px[i]=11+(r-11)*waterLight+gr[0]*glow;px[i+1]=23+(g-23)*waterLight+gr[1]*glow;px[i+2]=29+(b-29)*waterLight+gr[2]*glow;depth[pi]=dist;
   }
   px[i+3]=255;wx+=stepx;wy+=stepy;
  }
 }
 s4DrawDistantCity();
 for(const face of S4.faces)if(!hgIndoorFace(face))s4DrawFace(face);
 for(const plant of S4.flora){
  if(hgIndoorTree(plant))continue;
  const dx=plant.x-player.x,dy=plant.y-player.y,d=dx*camDX+dy*camDY,cross=dy*camDX-dx*camDY;
  if(d<=.08||Math.abs(cross)>d*W/(2*projection)+plant.w*.6)continue;
  const ox=-camDY*plant.w/2,oy=camDX*plant.w/2,z=plant.z,top=z+plant.h;
  s4DrawFace({points:[[plant.x-ox,plant.y-oy,z],[plant.x+ox,plant.y+oy,z],[plant.x+ox,plant.y+oy,top],[plant.x-ox,plant.y-oy,top]],tex:plant.tex,color:[29,57,42],u:1,v:1,cutout:true,distant:plant.x<0});
 }
 s4dVehicleFaces();s4qWorldFaces();s4tWorldFaces();cbWorldFaces();hgWorld();
 // Existing projectile/sprite effects use eye-height distance. Geometry and signs use pixel depth.
 const row=clamp(Math.round(horizon),0,H-1)*W;for(let x=0;x<W;x++)zBuffer[x]=depth[row+x];
 wc.putImageData(frame,0,0);
 for(const l of S4.lamps){const v=project(l.x,l.y,l.z);if(v&&v.d<45&&s4Visible(v.x,v.y,v.d,.3)){const col='#'+l.color.map(n=>n.toString(16).padStart(2,'0')).join('');drawGlow(v.x,v.y,Math.min(24,v.scale*.24),col,.18);}}
}
function s4ClipNear(verts,near=.08){
 const out=[];for(let i=0;i<verts.length;i++){const a=verts[i],b=verts[(i+1)%verts.length],ina=a.d>=near,inb=b.d>=near;if(ina)out.push(a);if(ina!==inb){const t=(near-a.d)/(b.d-a.d);out.push({cx:mix(a.cx,b.cx,t),cy:mix(a.cy,b.cy,t),d:near,u:mix(a.u,b.u,t),v:mix(a.v,b.v,t)});}}return out;
}
function s4DrawFace(face){
 if(face.cx!==undefined){
  const dx=face.cx-player.x,dy=face.cy-player.y,d=dx*camDX+dy*camDY,r=face.radius;
  if(d+r<=.08||Math.abs(dy*camDX-dx*camDY)>Math.max(0,d)*W/(2*projection)+r*1.9)return;
  if(face.out&&(-dx*face.out[0]-dy*face.out[1])<-.01)return;
 }
 const verts=face.points.map((p,i)=>{const dx=p[0]-player.x,dy=p[1]-player.y;return{cx:dy*camDX-dx*camDY,cy:.52-p[2],d:dx*camDX+dy*camDY,u:(face.u0||0)+[0,face.u,face.u,0][i],v:(face.v0||0)+[face.v,face.v,0,0][i]};});
 if(verts.every(v=>v.d<=.08))return;
 const clipped=s4ClipNear(verts,face.near||.08);if(clipped.length<3)return;
 const ps=clipped.map(v=>({x:W/2+v.cx*projection/v.d,y:horizon+v.cy*projection/v.d,q:1/v.d,u:v.u/v.d,v:v.v/v.d}));
 if(ps.every(p=>p.x<0)||ps.every(p=>p.x>=W)||ps.every(p=>p.y<0)||ps.every(p=>p.y>=H))return;
 const a=face.points[0],b=face.points[1],c=face.points[2],ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
 const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,len=Math.hypot(nx,ny,nz)||1;
 const brightness=face.emissive?1:.62+.15*Math.abs(nz/len)+.12*Math.abs(nx/len);
 for(let i=1;i<ps.length-1;i++)s4RasterTriangle(ps[0],ps[i],ps[i+1],face,brightness);
}
function s4RasterTriangle(a,b,c,face,brightness){
 const det=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(det)<.00001)return;
 const inv=1/det,x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(W-1,Math.ceil(Math.max(a.x,b.x,c.x))),y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(H-1,Math.ceil(Math.max(a.y,b.y,c.y)));
 if(x1<x0||y1<y0)return;
 const tex=face.surface?face.surface.data:S4_ART.tiles[face.tex],tw=face.surface?face.surface.w:256,th=face.surface?face.surface.h:256,color=face.color,depth=S4.depth,portalMask=face.portalMask;
 const dbdx=(c.y-a.y)*inv,dbdy=-(c.x-a.x)*inv,dcdx=-(b.y-a.y)*inv,dcdy=(b.x-a.x)*inv;
 for(let y=y0;y<=y1;y++){
  let wb=((x0+.5-a.x)*(c.y-a.y)-(y+.5-a.y)*(c.x-a.x))*inv,wc0=((b.x-a.x)*(y+.5-a.y)-(b.y-a.y)*(x0+.5-a.x))*inv;
  for(let x=x0;x<=x1;x++,wb+=dbdx,wc0+=dcdx){
   const wa=1-wb-wc0;if(wa<-.00001||wb<-.00001||wc0<-.00001)continue;
   const q=wa*a.q+wb*b.q+wc0*c.q,d=1/q,pi=y*W+x;if(portalMask&&!portalMask[pi])continue;if(d>=depth[pi]-.000001)continue;
   const fu=(wa*a.u+wb*b.u+wc0*c.u)*d,fv=(wa*a.v+wb*b.v+wc0*c.v)*d,tu=face.surface?clamp(Math.floor(fu*tw),0,tw-1):Math.floor(fu*256)&255,tv=face.surface?clamp(Math.floor(fv*th),0,th-1):Math.floor(fv*256)&255,ti=(tv*tw+tu)*4;
   if(face.cutout&&(!tex||tex[ti+3]<128))continue;
   const baseFog=1/(1+d*.009),fog=face.emissive?1:face.distant?baseFog*baseFog:baseFog,i=pi*4;
   const r=tex?tex[ti]:color[0],g=tex?tex[ti+1]:color[1],bl=tex?tex[ti+2]:color[2];
   px[i]=11+(r*brightness*(face.emissive?1:.83)-11)*fog;px[i+1]=23+(g*brightness-23)*fog;px[i+2]=29+(bl*brightness*1.07-29)*fog;depth[pi]=d;
  }
 }
}
function s4Visible(x,y,d,tolerance=.1){if(x<0||y<0||x>=W||y>=H||!S4.depth)return false;return d<S4.depth[(y|0)*W+(x|0)]+tolerance;}
// The ridge is part of the distant sky, always behind real trees and architecture.
function s4DrawDistantCity(){
 const city=S4_ART.city;if(!city)return;
 const yaw=-Math.PI/2+.255,width=.62,top=.365,height=.22;
 for(let x=0;x<W;x++){
  const ray=2*x/W-1,dx=camDX+planeX*ray,dy=camDY+planeY*ray,u=.5+angle(Math.atan2(dy,dx)-yaw)/width;
  if(u<0||u>=1)continue;
  const sx=Math.min(city.w-1,Math.floor(u*city.w)),len=S4.skyRayLength[x];
  const ya=Math.max(0,Math.floor(horizon-Math.tan(top)*projection*len)),yb=Math.min(H-1,Math.ceil(horizon-Math.tan(top-height)*projection*len));
  for(let y=ya;y<=yb;y++){
   const v=(top-Math.atan2(horizon-y,projection*len))/height;if(v<0||v>=1)continue;
   const si=(Math.floor(v*city.h)*city.w+sx)*4,a=city.data[si+3]/255,pi=y*W+x;
   if(!a||S4.depth[pi]<1e5)continue;
   const i=pi*4;for(let c=0;c<3;c++)px[i+c]=mix(px[i+c],city.data[si+c],a);
  }
 }
}
function s4RenderMap(){
 const c=mapCtx,s=150/S4_WIDTH,oy=(150-S4_HEIGHT*s)/2;c.clearRect(0,0,150,150);
 for(let y=0;y<S4_HEIGHT;y++)for(let x=0;x<S4_WIDTH;x++){c.fillStyle=s4ForestAt(x,y)?'#173329':['#394f55','#a8b9a4','#32503b','#103b52'][S4.terrain[y*2*S4_TW+x*2]];c.fillRect(x*s,oy+y*s,s+.1,s+.1);}
 for(const b of S4.solids){if(b.kind==='forest')continue;c.fillStyle=b.kind==='hedge'?'#64854c':'#77968d';c.fillRect(b.x0*s,oy+b.y0*s,Math.max(1,(b.x1-b.x0)*s),Math.max(1,(b.y1-b.y0)*s));}
 c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#e2dfba';for(const [x,y,label]of [[64,56,'HOSPITAL'],[92,85,'PARK'],[135,3,'BUS'],[41,17,'GATES'],[17,49,'LAKE']])c.fillText(label,x*s,oy+y*s);
 c.fillStyle='#ffedb7';c.beginPath();c.arc(player.x*s,oy+player.y*s,2.4,0,TAU);c.fill();c.strokeStyle='#ffedb7';c.beginPath();c.moveTo(player.x*s,oy+player.y*s);c.lineTo((player.x+Math.cos(player.a)*2)*s,oy+(player.y+Math.sin(player.a)*2)*s);c.stroke();
}

