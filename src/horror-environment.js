// R3-P02 corruption, with R3-P03 hit and death states driven by the boss.
// Material slots 0–3 stay the owner's atlas; 4–7 are infected tile / bone / muscle / blood.
const horrorZone=new Uint8Array(MW*MH),horrorMix=new Float32Array(MW*MH);
const horrorLightActive=new Float32Array(128*128*3);
let horrorHeartCanvas=null,horrorHeartHitCanvas=null,horrorHeartDeadCanvas=null,horrorHeartFadeCanvas=null,horrorHeartBlend=-1,horrorView={active:false,clock:0,pulse:0,energy:0,core:0,ceiling:.68,flow:0,collapse:0};
// The corpse's RGB source uses a neutral sprite matte. Alpha-test at import,
// before resampling; colored cartilage and dark flesh remain opaque. Genuine
// alpha sources pass through unchanged. This never touches the living artwork.
function heartSpriteAlpha(data){
 let transparent=false;for(let i=3;i<data.length;i+=4)if(data[i]<255){transparent=true;break;}
 if(transparent)return;
 for(let i=0;i<data.length;i+=4){
  const lo=Math.min(data[i],data[i+1],data[i+2]),hi=Math.max(data[i],data[i+1],data[i+2]);
  if(hi-lo<22&&lo>160)data[i+3]=Math.round(255*(1-clamp((lo-160)/32,0,1)));
 }
}
function prepareCorruption(atlasSrc,heartSrc,deadSrc){
 const atlas=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  for(let i=0;i<4;i++){const c=document.createElement('canvas');c.width=c.height=256;
   const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(img,(i%2)*img.width/2,(i>>1)*img.height/2,img.width/2,img.height/2,0,0,256,256);
   materialCanvases[4+i]=c;materialPixels[4+i]=g.getImageData(0,0,256,256).data;
  }resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Corruption atlas unavailable'));img.src=atlasSrc;});
 const heart=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  const c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(img,0,0,256,256);
  horrorHeartCanvas=c;
  horrorHeartHitCanvas=document.createElement('canvas');horrorHeartHitCanvas.width=horrorHeartHitCanvas.height=256;
  const hit=horrorHeartHitCanvas.getContext('2d');hit.drawImage(c,0,0);hit.globalCompositeOperation='source-atop';hit.fillStyle='rgba(255,226,192,.58)';hit.fillRect(0,0,256,256);resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Heart artwork unavailable'));img.src=heartSrc;});
 const dead=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  const src=document.createElement('canvas');src.width=img.width;src.height=img.height;
  const g=src.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const pixels=g.getImageData(0,0,src.width,src.height);heartSpriteAlpha(pixels.data);g.putImageData(pixels,0,0);
  horrorHeartDeadCanvas=document.createElement('canvas');horrorHeartDeadCanvas.width=horrorHeartDeadCanvas.height=256;
  // Insets keep the severed vessel tips inside the world surface as it slumps.
  horrorHeartDeadCanvas.getContext('2d').drawImage(src,6,6,244,244);
  horrorHeartFadeCanvas=document.createElement('canvas');horrorHeartFadeCanvas.width=horrorHeartFadeCanvas.height=256;horrorHeartBlend=-1;resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Dead-heart artwork unavailable'));img.src=deadSrc;});
 return Promise.all([atlas,heart,dead]);
}
function heartDeathImage(collapse){
 if(!horrorHeartDeadCanvas||!horrorHeartFadeCanvas)return horrorHeartCanvas;
 const blend=clamp(collapse/.55,0,1);
 if(blend>=1)return horrorHeartDeadCanvas;
 const step=Math.round(blend*64);if(step===horrorHeartBlend)return horrorHeartFadeCanvas;
 const g=horrorHeartFadeCanvas.getContext('2d');g.clearRect(0,0,256,256);
 g.globalAlpha=1-step/64;g.drawImage(horrorHeartCanvas,0,0);
 g.globalAlpha=step/64;g.drawImage(horrorHeartDeadCanvas,0,0);g.globalAlpha=1;horrorHeartBlend=step;
 return horrorHeartFadeCanvas;
}
function horrorCoreProximity(x,y){
 // Ease into a vaulted chamber through either approach, and down on the way out.
 const dx=Math.max(16-x,0,x-49),dy=Math.max(6-y,0,y-18);
 const t=clamp(1-Math.hypot(dx,dy)/5,0,1);return t*t*(3-2*t);
}
function horrorFrame(){
 const active=useChapter&&(stage===1||stage===2)&&liminal.mix<.01;
 const core=active&&stage===2?horrorCoreProximity(player.x,player.y):0;
 const dying=active&&stage===2&&HB.state==='dying',dead=active&&stage===2&&HB.state==='dead';
 const falling=dying?clamp((HB.deathT-.72)/4,0,1):dead?1:0,collapse=falling*falling*(3-2*falling);
 const energy=active&&stage===2?(HW.resolved?0:(.28+.72*clamp(HW.intensity,0,1))*(1-collapse)):0;
 const clock=settings.reduce?0:gameTime;
 // A double contraction, with a breathing interval; no random flashes.
 const beat=(clock*(stage===2?1.15:0.65))%1;
 const pulse=settings.reduce||energy===0||dying||dead?0:stage===2&&hbFighting()?hbPulse():Math.exp(-(((beat-.10)/.085)**2))+.55*Math.exp(-(((beat-.32)/.11)**2));
 const ceiling=active&&stage===2?mix(.88,3.0,core):LIM_CEIL;
 return {active,clock,pulse,energy,core,ceiling,collapse,flow:settings.reduce?0:dying||dead?HB.flowAtDeath+26*(1-Math.exp(-HB.deathT/1.3)):clock*(stage===2?energy*21:3)};
}
function horrorSetup(){
 horrorZone.fill(0);horrorMix.fill(0);
 if(!useChapter||(stage!==1&&stage!==2))return;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  let zone=1,amount=.42;
  if(stage===1){
   // Recovery stays a recognizable warm pause between the infected rooms.
   amount=y>=52?.28:x>=10&&x<=24&&y>=34&&y<=46?.20:.46;
   if(x>=10&&x<=24&&y>=18&&y<=30)amount=.85;
   if(x>=30&&x<=46&&y>=18&&y<=30){zone=2;amount=.58;}
   if(x>=30&&x<=46&&y>=34&&y<=46){zone=2;amount=.80;}
   if(x>=48&&y<48)amount=.65;
  }else{
   zone=2;amount=y>=48?.76:.94;
   if(x>=16&&x<=48&&y>=6&&y<=17){zone=3;amount=1;}
   // The cold aftermath keeps its earlier contrast, beyond the organic throat.
   if(y<=3){zone=0;amount=0;}
  }
  horrorZone[y*MW+x]=zone;horrorMix[y*MW+x]=amount;
 }
 const add=(kind,x,y,a=0,extra={})=>environmentProps.push({kind:'horror_'+kind,x,y,a,...extra});
 const rib=(x,y,a,span,height,seed)=>add('rib',x,y,a,{span,height,seed});
 const artery=(x,y,a,length,height,seed)=>add('artery',x,y,a,{length,height,seed});
 const seal=(x,y,a,size,seed)=>add('seal',x,y,a,{size,seed});
 if(stage===1){
  for(let i=0;i<FV_HALL.length;i++){
   const h=FV_HALL[i],span=h.x2-h.x1+.8;
   // Wall-rooted bone fingers meet the existing low ceiling, never the route.
   rib(fvCX(h),h.y1+3.5,0,span,1.16,i);
   if(i>0)rib(fvCX(h),h.y2-1.5,0,span,1.16,i+4);
   artery(h.x1+.16,fvCY(h),Math.PI/2,7+i*2,1.07,i);
   artery(h.x2+.84,fvCY(h),Math.PI/2,7+i*2,1.03,i+3);
   // A raised, inverted bone crown is attached to the back wall, away from panels.
   seal(h.x1+3.5,h.y2+.96,0,.74,i);
   if(i===2)seal(h.x2-2,h.y1+.04,Math.PI,.92,8);
  }
  for(const y of [20,31,44])artery(28.85,y,Math.PI/2,5,1.08,y);
  for(const y of [20,31,42]){rib(50.5,y,0,4.8,1.17,y);seal(52.96,y+1,-Math.PI/2,.68,y);}
 }else{
  // The old hospital composition remains, physically consumed by the new material.
  for(const p of environmentProps){const k=(p.y|0)*MW+(p.x|0),z=horrorZone[k];
   if(z&&['bed','shrouded','monitor','curtain','pipe'].includes(p.kind))p.horrorSkin=z===3?6:5;
  }
  for(const y of [49,55]){rib(26.5,y,0,20.8,1.38,y);artery(36.86,y,Math.PI/2,5,1.24,y);}
  for(const y of [14,23,32,41,50]){
   rib(11.5,y,0,2.92,1.36,y);artery(12.89,y+2,Math.PI/2,5,1.23,y);
  }
  for(const r of HW_ROOMS){
   const y=(r.y1+r.y2+1)/2;
   rib(6.5,y,0,4.9,1.35,y);seal(4.04,y,Math.PI/2,1.05,y);
  }
  // The solid 9 × 4 core is still the same collision mass. Flesh wraps its faces.
  add('heart',32.5,14.025,0,{size:3.28});
  add('heart',32.5,9.975,Math.PI,{size:3.28});
  add('heart',27.975,12,Math.PI/2,{size:3.28});
  add('heart',37.025,12,-Math.PI/2,{size:3.28});
  for(const y of [10.65,13.35]){
   rib(22,y,0,11.8,3.42,y);rib(43,y,0,11.8,3.42,y+1);
  }
  for(const x of [29.2,32.5,35.8]){
   rib(x,8,Math.PI/2,3.9,3.42,x);rib(x,16,Math.PI/2,3.9,3.42,x+2);
  }
  for(const x of [19,24,41,46]){
   artery(x,12,Math.PI/2,11.6,3.20,x);
   seal(x,6.035,Math.PI,2.25,x);seal(x,17.965,0,2.25,x+3);
  }
  for(const y of [8,16])artery(32.5,y,0,31,3.29,y);
  for(const y of [17,28,39]){rib(50.5,y,0,3.9,1.39,y);artery(52.85,y,Math.PI/2,7,1.25,y);}
  // Bloodfalls hug the organ's solid faces, with depth-tested world-space droplets.
  for(const x of [29,31,34,36]){add('bloodfall',x,14.08,0,{seed:x});add('bloodfall',x,9.92,0,{seed:x+7});}
  add('bloodfall',27.91,11.4,0,{seed:20});add('bloodfall',37.09,12.6,0,{seed:29});
 }
 heartBossFaces=environmentProps.filter(p=>p.kind==='horror_heart');
 horrorBakeLight();
}
function horrorBakeLight(){
 // Cap hot surfaces once per light bake, not six extra operations per screen pixel.
 if(!useChapter||(stage!==1&&stage!==2))return;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const amount=horrorMix[(y>>1)*MW+(x>>1)],i=(y*128+x)*3;
  for(let c=0;c<3;c++)horrorLightActive[i+c]=mix(lightActive[i+c],Math.min(1.45,lightActive[i+c]),amount);
 }
}
function horrorLights(){
 if(!useChapter||(stage!==1&&stage!==2))return;
 const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
 if(stage===1){
  for(const [i,h] of FV_HALL.entries()){
   const off=FV.valves.some(v=>v.id===h.id&&v.closed),k=off?.20:1;
   const rgb=i===0?[.13,.32,.03]:i===1?[.40,.03,.30]:[.49,.02,.15];
   for(const x of [h.x1+.5,h.x2+.5])L(x,h.y2-1,rgb.map(v=>v*k));
  }
  L(51,29,[.33,.015,.24]);
 }else{
  for(const y of [17,32,47])L(12.4,y,[.50,.04,.28]);
  for(const r of HW_ROOMS)L(4.5,r.door,[.47,.025,.20]);
  const k=HW.resolved?.12:1;
  for(const x of [18,25,40,47])for(const y of [7,17])L(x,y,[.57*k,.035*k,.21*k]);
  // Cooler edge light separates creatures and exits from red tissue.
  L(16.5,11.5,[.08,.37,.45]);L(48.5,11.5,[.10,.26,.40]);L(32.5,6.4,[.13,.44,.39]);
 }
}
function horrorTube(p,points,radius,color,tex=6,vein=false){
 // Four-sided tapered tubes: low-poly volume, not camera-facing decoration.
 const sections=points.map((v,i)=>{const before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+1)];
  const dx=after[0]-before[0],dz=after[2]-before[2],n=Math.hypot(dx,dz)||1;
  const r=radius*(v[3]===undefined?1:v[3]);
  return [[v[0]-dz/n*r,v[1],v[2]+dx/n*r],[v[0],v[1]+r,v[2]],[v[0]+dz/n*r,v[1],v[2]-dx/n*r],[v[0],v[1]-r,v[2]]];
 });
 for(let j=0;j<sections.length-1;j++)for(let s=0;s<4;s++){
  meshQuad(p,[sections[j][s],sections[j+1][s],sections[j+1][(s+1)%4],sections[j][(s+1)%4]],color,tex,vein);
 }
}
function renderHorrorProp(p){
 if(!horrorView.active)return;
 if(p.kind==='horror_heart'){
  const normalX=-Math.sin(p.a),normalY=Math.cos(p.a);
  if((player.x-p.x)*normalX+(player.y-p.y)*normalY<=0)return;
  if(!horrorHeartCanvas)return;
  const lastBeat=!settings.reduce&&HB.state==='dying'&&HB.deathT<.72?Math.sin(HB.deathT/.72*Math.PI)*.045:0;
  const h=p.size*(1+horrorView.pulse*.045*horrorView.energy-lastBeat)*(1-horrorView.collapse*.42),w=p.size*.98*(1+horrorView.pulse*.045*horrorView.energy+lastBeat)*(1+horrorView.collapse*.10);
  meshQuad(p,[[-w/2,0,.04],[w/2,0,.04],[w/2,0,h+.04],[-w/2,0,h+.04]],'transparent',-1,true);
  const f=meshFaces[meshFaces.length-1];f.image=horrorView.collapse>0?heartDeathImage(horrorView.collapse):
   !settings.reduce&&HB.hitT>0&&horrorHeartHitCanvas?horrorHeartHitCanvas:horrorHeartCanvas;f.wallAttached=true;
  return;
 }
 if(p.kind==='horror_bloodfall'){renderHorrorBloodfall(p);return;}
 if(p.horrorFaces){meshFaces=p.horrorFaces;return;}
 const col=stage===1?'#9b9a64':'#b09989',neon=stage===1&&p.seed%3===0?'#b8ef29':'#ff247c';
 if(p.kind==='horror_rib'){
  const w=p.span/2,h=p.height;
  // The roots stay at existing walls. All overhanging volume is above the eye.
  const points=[[-w,0,.12,.65],[-w+.12,0,h*.68,1],[-w*.82,0,h*.91,.85],[-w*.42,0,h,.55],[0,0,h*.97,.17],
   [w*.42,0,h,.55],[w*.82,0,h*.91,.85],[w-.12,0,h*.68,1],[w,0,.12,.65]];
  horrorTube(p,points,stage===1?.095:.13,col,5);
  horrorTube(p,points.map(v=>[v[0],-.10,v[2]-.025,v[3]]),.023,neon,-1,true);
  for(const sign of [-1,1])horrorTube(p,[[sign*w*.80,0,h*.93,1],[sign*w*.73,-.10,h*.73,.62],[sign*w*.61,-.16,h*.68,0]],.11,'#321322',5);
 }else if(p.kind==='horror_artery'){
  const n=Math.ceil(p.length/2),points=[];
  for(let i=0;i<=n;i++){const x=-p.length/2+i*p.length/n;points.push([x,Math.sin(i*1.8+p.seed)*.07,p.height+Math.sin(i*.9+p.seed)*.055,1]);}
  horrorTube(p,points,stage===1?.075:.14,'#760b32',6);
  horrorTube(p,points.map(v=>[v[0],v[1]-.09,v[2]-.07,1]),.025,neon,-1,true);
 }else if(p.kind==='horror_seal'){
  const s=p.size,core=horrorZone[(p.y|0)*MW+(p.x|0)]===3,h=stage===1?1.12:core?Math.min(3.45,s+1.0):1.32,z=h-s*.46;
  // An inverted crown of horns, flesh struts and a glowing arterial fissure.
  const pts=[[-s*.47,0,z+s*.39],[-s*.27,-.06,z+s*.11],[0,-.12,z-s*.42],[s*.27,-.06,z+s*.11],[s*.47,0,z+s*.39]];
  horrorTube(p,pts,.052*s,col,5);
  horrorTube(p,[[-s*.41,0,z+s*.02],[s*.41,0,z+s*.02]],.04*s,'#95162f',6);
  horrorTube(p,[[0,-.04,z-s*.30],[0,-.07,z+s*.22]],.024*s,neon,-1,true);
  for(const sign of [-1,1])horrorTube(p,[[sign*s*.30,0,z+s*.1,1],[sign*s*.38,0,z+s*.38,.7],[sign*s*.28,0,z+s*.52,0]],.11*s,'#271320',5);
 }
 // Immutable local dressing is tessellated once, never every animation frame.
 for(const f of meshFaces)f.horror=true;
 p.horrorFaces=meshFaces;
}
function horrorClipCeiling(verts){
 const top=-horrorView.ceiling;
 if(verts.every(v=>v.cy>=top))return verts;
 const out=[];
 for(let i=0;i<verts.length;i++){
  const a=verts[i],b=verts[(i+1)%verts.length],ina=a.cy>=top,inb=b.cy>=top;
  if(ina)out.push(a);
  if(ina!==inb){const t=(top-a.cy)/(b.cy-a.cy);out.push({cx:mix(a.cx,b.cx,t),cy:top,d:mix(a.d,b.d,t),u:mix(a.u,b.u,t),v:mix(a.v,b.v,t)});}
 }
 return out;
}
function renderHorrorBloodfall(p){
 const v=horrorView;if(settings.reduce||v.energy===0)return;
 const count=6+Math.round(v.energy*8),clock=v.clock;
 for(let i=0;i<count;i++){
  const t=(clock*(.38+v.energy*.25)+i/count+p.seed*.119)%1;
  const x=p.x+Math.sin(i*2.4+p.seed)*.12,y=p.y+Math.cos(i*1.7)*.035,z=3.05*(1-t*t);
  if(z>v.ceiling+.52)continue;
  const q=project(x,y,z),tail=project(x,y,Math.min(v.ceiling+.52,z+.045+v.energy*.13));
  if(!q||!tail||q.x<0||q.x>=W||zBuffer[q.x|0]<q.d-.06)continue;
  wc.strokeStyle=i%4?'#e21a53':'#ff8aac';wc.globalAlpha=.45+v.energy*.35;
  wc.lineWidth=clamp(q.scale*.018,1,3);wc.beginPath();wc.moveTo(tail.x,tail.y);wc.lineTo(q.x,q.y);wc.stroke();
 }wc.globalAlpha=1;
}

