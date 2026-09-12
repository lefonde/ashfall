const S4T_ART={front:null,back:null,hands:null};
function s4tPrepareArt(img){
 // Atlas panels retain genuine alpha. Scaling/cropping only; no colour-key removal.
 for(const [key,x,y,w,h,dw,dh]of [['front',0,0,627,598,384,366],['back',627,0,627,600,384,367],['hands',0,600,1254,654,960,501]]){
  const image=document.createElement('canvas');image.width=dw;image.height=dh;
  const c=image.getContext('2d',{willReadFrequently:true});c.drawImage(img,x,y,w,h,0,0,dw,dh);
  S4T_ART[key]={image,w:dw,h:dh,data:c.getImageData(0,0,dw,dh).data};
 }
}
function s4tWorldFaces(){
 if(!s4tRunning())return;
 if(S4T.phase!=='carried'&&S4T.phase!=='mouth'){
  const t=S4T.clock,w=.73,h=.70*(1+(settings.reduce?0:.012*Math.sin(t*2.1))),
   z=S4T.z-.27+(S4T.phase==='ground'?Math.sin(S4T.settle*17)*S4T.settle*.014:0),ox=-camDY*w/2,oy=camDX*w/2;
  const rear=Math.cos(Math.atan2(player.y-S4T.y,player.x-S4T.x)-S4T.facing)<-.35;
  const art=rear?S4T_ART.back:S4T_ART.front;
  if(art)s4DrawFace({points:[[S4T.x-ox,S4T.y-oy,z],[S4T.x+ox,S4T.y+oy,z],[S4T.x+ox,S4T.y+oy,z+h],[S4T.x-ox,S4T.y-oy,z+h]],
   surface:art,tex:-1,color:[219,210,169],u:1,v:1,emissive:true,cutout:true});
 }
 const p=S4T.proxy;if(!p)return;
 const faces=[],color=p.phase==='walk'?[149,189,174]:[93,128,137],r=p.r;
 // A technical wire volume makes the development boundary unmistakable.
 for(const z of[.05,2.15])for(let i=0;i<16;i++){
  const a=i*TAU/16,b=(i+1)*TAU/16;
  faces.push({points:[[p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,z],[p.x+Math.cos(b)*r,p.y+Math.sin(b)*r,z],
   [p.x+Math.cos(b)*r,p.y+Math.sin(b)*r,z+.035],[p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,z+.035]],tex:-1,color,u:1,v:1,emissive:true});
 }
 for(let i=0;i<8;i++){const a=i*TAU/8;s4qMeshBox(faces,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,.05,.035,.035,2.1,color,true);}
 for(const f of faces)s4DrawFace(f);
}
function s4tLightPosition(){if(S4T.phase==='mouth')return cbfMouthPoint();return s4tCarried()?{x:player.x,y:player.y,z:.5}:S4T;}
function s4tAtmosphere(){
 if(!s4tRunning())return;
 const p=s4tLightPosition(),carried=s4tCarried();if(S4T.phase==='mouth'&&p.z<.06)return;
 if(carried){
  // Illumination falls onto the carrier, not an opaque stripe over the reticle.
  wc.save();const g=wc.createLinearGradient(0,0,0,H*.34);g.addColorStop(0,'rgba(248,234,180,.09)');g.addColorStop(1,'rgba(248,234,180,0)');
  wc.fillStyle=g;wc.fillRect(0,0,W,H*.34);wc.restore();return;
 }
 const d=(p.x-player.x)*camDX+(p.y-player.y)*camDY;if(d<.1||d>75)return;
 const base=project(p.x,p.y,Math.max(.15,p.z)),top=project(p.x,p.y,12);if(!base||!top)return;
 const span=Math.min(W*.22,Math.max(2,base.scale*.43)),x0=Math.max(0,Math.floor(base.x-span)),x1=Math.min(W-1,Math.ceil(base.x+span));
 const y0=Math.max(0,Math.floor(top.y)),y1=Math.min(H-1,Math.ceil(base.y));
 // Per-pixel occlusion keeps light behind the hospital, trees and gate posts.
 if(x1<x0||y1<y0)return;
 const img=wc.getImageData(x0,y0,x1-x0+1,y1-y0+1);
 const data=img.data,width=x1-x0+1;
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  if(!s4Visible(x,y,d,.28))continue;
  const cross=(x+.5-base.x)/span,soft=Math.exp(-cross*cross*5),vertical=.65+.35*(y-y0)/Math.max(1,y1-y0),alpha=soft*.29*vertical;
  const i=((y-y0)*width+x-x0)*4;data[i]+=alpha*220;data[i+1]+=alpha*193;data[i+2]+=alpha*130;
 }
 wc.putImageData(img,x0,y0);
 if(s4Visible(base.x,base.y,d,.35))drawGlow(base.x,base.y,Math.min(30,base.scale*.32),'#f0dda9',.21);
 // Small drifting motes, with simulation time so pause also stills the light.
 for(let i=0;i<9;i++){
  const a=i*2.399,t=settings.reduce?0:S4T.clock,z=.2+((i*.37+t*.09)%2.8),v=project(p.x+Math.cos(a+t*.13)*.24,p.y+Math.sin(a+t*.13)*.24,z);
  if(v&&s4Visible(v.x,v.y,v.d,.05)){wc.fillStyle='#ddd3a38c';wc.fillRect(v.x,v.y,1,1);}
 }
 if(S4T.phase==='water'){
  wc.save();wc.strokeStyle='#d8debb';wc.globalAlpha=.3;wc.lineWidth=1;
  for(let j=0;j<3;j++){const r=.25+((S4T.clock*.32+j*.4)%1.3);wc.beginPath();let started=false;
   for(let k=0;k<=40;k++){const a=k/40*TAU,v=project(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,.03);if(!v||!s4Visible(v.x,v.y,v.d,.1)){started=false;continue;}if(!started){wc.moveTo(v.x,v.y);started=true;}else wc.lineTo(v.x,v.y);}wc.stroke();}
  wc.restore();
 }
}
function s4tRenderHands(){
 const art=S4T_ART.hands;if(!s4tRunning()||!art)return;
 const carried=s4tCarried();if(!carried&&S4T.throwT<=0)return;const out=carried?0:1-S4T.throwT/.32;
 // Width is capped as well as height: portrait hands never swallow the viewport.
 const w=Math.min(W*.88,H*1.1),h=w*art.h/art.w,moving=settings.reduce?0:Math.min(1,Math.hypot(player.vx,player.vy)/4.65);
 const breath=settings.reduce?0:Math.sin(S4T.clock*2.1)*h*.005;
 const x=W/2+(settings.reduce?0:Math.sin(bob)*moving*2-sway*3),y=H+h*.02+breath+weaponDrop*h*1.4+out*h*1.35;
 wc.save();wc.translate(x,y);if(!settings.reduce)wc.rotate(Math.sin(bob)*moving*.004);
 wc.drawImage(art.image,-w/2,-h,w,h);wc.restore();
}

// Deliberately bounded large-body routing proof. It has no combat or score hooks.
const S4T_NAV={x:22,y:20,w:73,h:53,step:.5,r:1.55};
function s4tProxyFree(x,y,water=false){
 const r=S4T_NAV.r;if(s4Outside(x-r,y-r)||s4Outside(x+r,y+r))return false;
 for(const b of S4.solids){
  const dx=x-clamp(x,b.x0,b.x1),dy=y-clamp(y,b.y0,b.y1);
  if(dx*dx+dy*dy<(r+.03)**2)return false;
 }
 if(!water){if(s4Pond(x,y))return false;for(let i=0;i<24;i++)if(s4Pond(x+Math.cos(i*TAU/24)*(r+.035),y+Math.sin(i*TAU/24)*(r+.035)))return false;}
 return true;
}
function s4tProxySweep(a,b,water=false){
 const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.18));
 for(let i=0;i<=steps;i++)if(!s4tProxyFree(mix(a.x,b.x,i/steps),mix(a.y,b.y,i/steps),water))return false;
 return true;
}
function s4tBuildNav(){
 const n=S4T_NAV,cells=new Uint8Array(n.w*n.h);
 for(let y=0;y<n.h;y++)for(let x=0;x<n.w;x++)cells[y*n.w+x]=s4tProxyFree(n.x+x*n.step,n.y+y*n.step)?1:0;
 S4T_RUNTIME.nav=cells;
}
function s4tPlanRoute(target,p=S4T.proxy){
 const n=S4T_NAV,grid=S4T_RUNTIME.nav;if(!grid||!p)return null;
 const point=i=>({x:n.x+(i%n.w)*n.step,y:n.y+Math.floor(i/n.w)*n.step,water:false});
 const id=(x,y)=>{const gx=Math.round((x-n.x)/n.step),gy=Math.round((y-n.y)/n.step);return gx<0||gy<0||gx>=n.w||gy>=n.h?-1:gy*n.w+gx;};
 // A walking actor can be beside a blocked rounded grid cell. Find a nearby
 // cell reachable by its complete footprint; never snap it onto that cell.
 let start=-1,closest=Infinity;
 for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){
  const j=id(p.x+x*n.step,p.y+y*n.step);if(j<0||!grid[j])continue;
  const q=point(j),d=Math.hypot(q.x-p.x,q.y-p.y);
  if(d<closest&&s4tProxySweep(p,q)){start=j;closest=d;}
 }
 if(start<0)return null;
 const parent=new Int32Array(grid.length);parent.fill(-2);parent[start]=-1;const queue=[start];
 for(let head=0;head<queue.length;head++){
  const i=queue[head],x=i%n.w,y=Math.floor(i/n.w);
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const xx=x+dx,yy=y+dy,j=yy*n.w+xx;
   if(xx<0||yy<0||xx>=n.w||yy>=n.h||!grid[j]||parent[j]!==-2)continue;
   if(dx&&dy&&(!grid[y*n.w+xx]||!grid[yy*n.w+x]))continue;
   parent[j]=i;queue.push(j);
  }
 }
 let best=null,bestScore=Infinity;
 for(const shore of S4.shore){
  if(shore.x<22||shore.x>57||shore.y<21||shore.y>45)continue;
  const oval=[S4_POND,S4_LAKE].sort((a,b)=>Math.abs(((shore.x-a.x)/a.rx)**2+((shore.y-a.y)/a.ry)**2-1)-Math.abs(((shore.x-b.x)/b.rx)**2+((shore.y-b.y)/b.ry)**2-1))[0];
  let nx=(shore.x-oval.x)/oval.rx**2,ny=(shore.y-oval.y)/oval.ry**2;const len=Math.hypot(nx,ny);nx/=len;ny/=len;
  const bank={x:shore.x+nx*(n.r+.22),y:shore.y+ny*(n.r+.22),water:false},entry={x:shore.x-nx*(n.r+.3),y:shore.y-ny*(n.r+.3),water:true};
  const score=(shore.x-target.x)**2+(shore.y-target.y)**2;
  if(score>=bestScore||!s4Pond(entry.x,entry.y)||!s4tProxyFree(bank.x,bank.y)||!s4tProxySweep(bank,entry,true))continue;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const j=id(bank.x+dx*.5,bank.y+dy*.5);if(j<0||parent[j]===-2||!s4tProxySweep(point(j),bank))continue;
   bestScore=score;best={j,bank,entry};
  }
 }
 if(!best)return null;
 const raw=[];for(let i=best.j;i>=0;i=parent[i])raw.push(point(i));raw.reverse();raw.push(best.bank);
 // Remove staircase turns only where the complete footprint can sweep the chord.
 const route=[];let from={x:p.x,y:p.y},i=0;
 while(i<raw.length){let far=i;for(let j=i+1;j<raw.length;j++){if(!s4tProxySweep(from,raw[j]))break;far=j;}route.push(raw[far]);from=raw[far];i=far+1;}
 route.push(best.entry);return route;
}
function s4tProxyTick(dt){
 const p=S4T.proxy;if(p.phase==='arrived'){p.wait+=dt;if(p.wait>1.4){s4tReturn('LARGE FOOTPRINT REACHED THE WATER. REVIEW RESET.');}return;}
 if(p.phase!=='walk')return;
 const target=p.route[p.index];if(!target){p.phase='arrived';p.wait=0;return;}
 const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy),step=Math.min(d,2.8*dt);
 const next={x:p.x+dx/(d||1)*step,y:p.y+dy/(d||1)*step};
 if(!s4tProxySweep(p,next,target.water)){p.phase='blocked';S4T.returnT=2;feed('ROUTE BLOCKED. THE TOY WILL RETURN TO SAFETY.');return;}
 Object.assign(p,next);if(d>.001)p.a=Math.atan2(dy,dx);if(d<=step+.001)p.index++;
}

