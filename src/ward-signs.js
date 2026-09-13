// Real, depth-clipped enamel faces. Text shares the board's perspective, never
// an independent floating label. Exterior signs retain their approved renderer.
const WF_SIGN_CACHE=new Map(),WF_FACE_CACHE=new WeakMap();
function wfText(c,text,x,y,width,size,color='#e0e1c8',align='left'){
 c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;
 c.font='600 '+size+'px Arial, "DejaVu Sans", sans-serif';
 while(c.measureText(text).width>width&&size>12)c.font='600 '+(--size)+'px Arial, "DejaVu Sans", sans-serif';
 c.fillText(text,x,y);
}
function wfSignLines(label){
 return String(label||'WARD').replace(/W[‑–]0/g,'W-0').trim().split(/\s*\/\s*|\s{2,}/).filter(Boolean).slice(0,3);
}
function wfExitReady(p){
 return p.wfExit==='security'?CH.power:p.wfExit==='airlock'?!FV.sealed:false;
}
function wfSignTexture(p){
 const exitReady=!!p.wfExit&&wfExitReady(p);
 let label=exitReady&&p.readyLabel?p.readyLabel:p.label;
 if(chRunning()&&label==='NO POWER')label=CH.power?'MAINS ONLINE / SECURITY OPEN':'MAINS OFFLINE / PLANT HALL';
 const lines=wfSignLines(label),arch=p.kind==='arch',small=/^W[-‑–]0\d$|^BAY \d$/.test(label),key='sign:'+arch+':'+exitReady+':'+lines.join('|');
 if(WF_SIGN_CACHE.has(key))return WF_SIGN_CACHE.get(key);
 const img=document.createElement('canvas');img.width=small?384:768;img.height=arch?54:small?132:lines.length>1?146:114;
 const c=img.getContext('2d'),h=img.height,w=img.width;
 c.fillStyle='#111f21';c.fillRect(0,0,w,img.height);
 c.fillStyle=exitReady?'#8dbab0':'#74817a';c.fillRect(2,2,w-4,img.height-4);c.fillStyle=exitReady?'#183b35':'#283e3d';c.fillRect(5,5,w-10,img.height-10);
 const tint=exitReady?'#b7e4c5':/POWER|PLANT|HV/.test(label)?'#ae9871':/OR |PURGE|STERILE|THEATRE/.test(label)?'#879b96':'#9ca99b';
 c.fillStyle=tint;c.fillRect(12,12,5,h-24);
 c.fillStyle='#bfc2ac20';c.fillRect(18,7,w-38,2);
 for(const x of [28,w-28])for(const y of [18,h-18]){
  c.fillStyle='#a4aaa0';c.beginPath();c.arc(x,y,3,0,TAU);c.fill();c.fillStyle='#1a2528';c.fillRect(x-2,y,4,1);
 }
 // Fixed stains, not per-frame noise; the lettering stays clean and legible.
 c.fillStyle='#00000016';for(let i=0;i<22;i++)c.fillRect((i*113+21)%w,(i*37)%h,3+(i%11),1);
 const texts=arch?[lines.join(' · ')]:lines;
 texts.forEach((text,i)=>wfText(c,text,arch||small?w/2:52,(i+.5)*h/texts.length,w-100,arch?34:small?62:lines.length>1?42:59,exitReady?'#d4f3d8':undefined,arch||small?'center':'left'));
 WF_SIGN_CACHE.set(key,img);return img;
}
function wfSignFace(p){
 if(p.kind==='arch'){
  let nx=Math.sin(p.a),ny=-Math.cos(p.a);
  if((player.x-p.x)*nx+(player.y-p.y)*ny<0){nx=-nx;ny=-ny;}
  return {x:p.x+nx*.128,y:p.y+ny*.128,nx,ny,z:1.104,w:1.82,h:.127};
 }
 const cached=WF_FACE_CACHE.get(p);if(cached&&cached.map===map)return cached.face;
 let nx=p.nx??Math.sin(p.a),ny=p.ny??Math.cos(p.a),x=p.x,y=p.y;
 // Some old room plaques were a cell deep inside masonry. Find the exposed
 // side on this wall axis and mount just proud of it, never through the wall.
 if(p.nx===undefined){
  const candidates=[];
  for(const sign of [1,-1])for(let step=0;step<=26;step++){
   const offset=step*.05,xx=x+nx*sign*offset,yy=y+ny*sign*offset;
   if(!wall(xx+nx*sign*.05,yy+ny*sign*.05)){
    const backing=wall(xx-nx*sign*.12,yy-ny*sign*.12);
    candidates.push({x:xx+nx*sign*.055,y:yy+ny*sign*.055,nx:nx*sign,ny:ny*sign,score:offset+(backing?0:.8)+(sign<0?2:0)});break;
   }
  }
  candidates.sort((a,b)=>a.score-b.score);if(candidates.length)({x,y,nx,ny}=candidates[0]);
 }
 const lines=wfSignLines(p.label),small=/^W[-‑–]0\d$|^BAY \d$/.test(p.label),
  face={x,y,nx,ny,z:p.z||.86,w:p.w||(small?.72:1.68),h:p.h||(lines.length>1?.32:.25)};
 WF_FACE_CACHE.set(p,{map,face});return face;
}
function wfDrawFace(texture,f){
 const dot=(player.x-f.x)*f.nx+(player.y-f.y)*f.ny;
 if(dot<.018||dot>19)return;
 const tx=f.ny,ty=-f.nx,midDepth=(f.x-player.x)*camDX+(f.y-player.y)*camDY;
 if(midDepth+f.w/2<.075||Math.hypot(f.x-player.x,f.y-player.y)>20)return;
 const a=project(f.x-tx*f.w/2,f.y-ty*f.w/2,f.z),b=project(f.x+tx*f.w/2,f.y+ty*f.w/2,f.z);
 const left=a&&b?Math.max(0,Math.floor(Math.min(a.x,b.x))):0,
  right=a&&b?Math.min(W-1,Math.ceil(Math.max(a.x,b.x))):W-1;
 if(right-left<3)return;
 wc.save();wc.imageSmoothingEnabled=true;
 // Column sampling gives perspective-correct text even at an oblique angle.
 // A bounded W columns also makes grazing/near-plane cases cheap and finite.
 for(let sx=left;sx<=right;sx++){
  const camera=2*(sx+.5)/W-1,dx=camDX+planeX*camera,dy=camDY+planeY*camera,
   den=dx*f.nx+dy*f.ny;
  if(Math.abs(den)<1e-6)continue;
  const d=-dot/den;
  if(d<=.075||d>22||zBuffer[sx]<d-.065)continue;
  const u=((player.x+dx*d-f.x)*tx+(player.y+dy*d-f.y)*ty)/f.w+.5;
  if(u<0||u>=1)continue;
  const top=horizon+(.52-f.z-f.h/2)*projection/d,height=f.h*projection/d;
  const y0=Math.max(0,top),y1=Math.min(H,top+height);if(y1<=y0)continue;
  wc.drawImage(texture,Math.min(texture.width-1,(u*texture.width)|0),(y0-top)/height*texture.height,
   1,(y1-y0)/height*texture.height,sx,y0,1,y1-y0);
  wc.fillStyle='rgba(3,9,15,'+clamp(.07+d*.022,.08,.51)+')';wc.fillRect(sx,y0,1,y1-y0);
 }
 wc.restore();
}
function wfDrawSign(p){wfDrawFace(wfSignTexture(p),wfSignFace(p));}
function wfPanelTexture(id,done,ready=true,progress=0){
 // The only animated face is the 12-step purge display. No unbounded cache.
 const tick=Math.floor(progress*12),key='panel:'+id+':'+done+':'+ready+':'+tick;
 if(WF_SIGN_CACHE.has(key))return WF_SIGN_CACHE.get(key);
 const img=document.createElement('canvas');img.width=480;img.height=300;const c=img.getContext('2d');
 c.fillStyle='#101c20';c.fillRect(0,0,480,300);c.fillStyle='#737b73';c.fillRect(3,3,474,294);
 c.fillStyle='#33423f';c.fillRect(9,9,462,282);c.fillStyle='#132626';c.fillRect(24,22,432,65);
 const names={mains:'MAINS / PLANT',OR1:'OR 1 / POWER',OR2:'OR 2 / VENT',OR3:'OR 3 / PURGE',recovery:'RECOVERY SUPPLY'};
 wfText(c,names[id],40,54,400,31);
 const color=done?'#a4bdb0':!ready?'#626e6a':id==='OR3'?'#b77676':id==='OR2'?'#8aafad':'#c1a973';
 c.fillStyle='#081717';c.fillRect(34,105,270,122);
 if(id==='mains'||id==='OR1'){
  c.fillStyle='#c1baa0';c.fillRect(47,119,131,69);c.strokeStyle='#243b38';c.lineWidth=3;
  c.beginPath();c.arc(112,181,51,Math.PI,TAU);c.stroke();
  c.beginPath();c.moveTo(112,181);c.lineTo(done?147:79,143);c.stroke();
  c.fillStyle='#172523';c.fillRect(221,112,23,103);c.fillStyle='#787e70';c.fillRect(218,done?117:181,30,30);
  c.fillStyle=color;c.fillRect(204,done?111:175,57,17);
 }else if(id==='OR2'){
  c.strokeStyle='#83968f';c.lineWidth=3;c.beginPath();c.arc(116,165,48,0,TAU);c.stroke();
  for(let i=0;i<4;i++){
   const a=i*TAU/4+.4;c.save();c.translate(116,165);c.rotate(a);c.fillStyle='#778b83';c.beginPath();c.ellipse(19,0,25,11,0,0,TAU);c.fill();c.restore();
  }
  c.fillStyle='#152522';for(let y=126;y<210;y+=12)c.fillRect(63,y,106,3);
  c.strokeStyle=color;c.beginPath();c.arc(240,166,25,0,TAU);c.stroke();c.fillStyle=color;c.fillRect(237,140,6,30);
 }else if(id==='OR3'){
  c.fillStyle='#706f59';c.fillRect(54,115,111,106);c.fillStyle='#172624';c.fillRect(60,121,99,94);
  c.fillStyle=done?'#5b7165':'#b45856';c.beginPath();c.arc(109,169,30,0,TAU);c.fill();
  c.strokeStyle='#9f9e83';c.lineWidth=7;c.strokeRect(74,128,70,76);
  wfText(c,tick&&!done?String(12-tick).padStart(2,'0')+'s':done?'OFF':'READY',231,155,108,26,color,'center');
  c.fillStyle='#4e615b';c.fillRect(189,188,94,10);c.fillStyle=color;c.fillRect(189,188,94*(done?1:progress),10);
 }else{
  c.strokeStyle='#8a9d91';c.lineWidth=3;c.strokeRect(46,116,242,101);
  c.fillStyle=ready&&!done?'#b6c6ad':'#78877b';c.fillRect(100,137,21,61);c.fillRect(80,157,61,21);
  c.fillStyle='#9ca896';c.fillRect(259,150,7,36);
 }
 c.fillStyle='#1a2825';c.fillRect(328,107,116,121);c.fillStyle=color;c.beginPath();c.arc(386,137,10,0,TAU);c.fill();
 wfText(c,done?'DONE':ready?'READY':'OFF',386,182,100,23,color,'center');
 wfText(c,id==='mains'?(done?'SECURITY RELEASED':'SECURITY INTERLOCK'):id==='recovery'?'EMERGENCY USE ONLY':done?'SYSTEM ISOLATED':'LOCAL ISOLATION CONTROL',240,262,424,22,'#bdc1ac','center');
 for(const x of [18,462])for(const y of [18,282]){c.fillStyle='#9b9f8f';c.beginPath();c.arc(x,y,3,0,TAU);c.fill();}
 WF_SIGN_CACHE.set(key,img);return img;
}
function wfDrawControl(p){
 const id=p.fvSystem||'mains',info=id==='mains'?{done:CH.power,ready:true,progress:0}:fvControlInfo(id),
  nx=id==='mains'?-1:Math.sin(p.a),ny=id==='mains'?0:-Math.cos(p.a);
 wfDrawFace(wfPanelTexture(id,info.done,info.ready,info.progress),{
  x:p.x+nx*.089,y:p.y+ny*.089,nx,ny,z:.66,w:.8,h:.5});
}
// These are labels and a wall-mounted panel only; no extra floor obstacles.
const WF_ADMISSIONS_PROPS=[
 {kind:'wf_control',...WF_BREAKER,a:-Math.PI/2},
 {kind:'sign',x:27.96,y:48.3,a:-Math.PI/2,label:'← WARD 1 / PLANT HALL'},
 {kind:'sign',x:31.94,y:29.4,a:-Math.PI/2,label:'← WARD 1 / SERVICE RISER'},
 {kind:'sign',x:50.91,y:20.9,a:-Math.PI/2,label:'← PLANT HALL / VIA RISER'},
 {kind:'sign',x:56.88,y:7.2,a:-Math.PI/2,label:'MAINS SWITCH / SECURITY INTERLOCK'}
];
function wfExtraProps(){return chRunning()&&!wfUncharted()?WF_ADMISSIONS_PROPS:[];}
