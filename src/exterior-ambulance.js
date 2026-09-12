// Textured vehicle geometry, persistent fire and first-person threshold dressing.
// Original approved ground/sky/architecture stay in the Phase 1 renderer.
const S4_VAN_ART={panels:[],flames:[]};
function s4dSpriteClipped(img,left,top,width,height,d,alpha){
 const x0=Math.max(0,Math.ceil(left)),x1=Math.min(W,Math.ceil(left+width)),y0=Math.max(0,Math.ceil(top)),y1=Math.min(H,Math.ceil(top+height));
 if(x1<=x0||y1<=y0)return;wc.save();wc.beginPath();let visible=0;
 for(let y=y0;y<y1;y++){let start=-1;for(let x=x0;x<=x1;x++){
  const open=x<x1&&S4.depth[y*W+x]>d-.08;if(open&&start<0)start=x;
  if(!open&&start>=0){wc.rect(start,y,x-start,1);visible+=x-start;start=-1;}
 }}
 if(visible){wc.clip();wc.globalAlpha=alpha;wc.drawImage(img,left,top,width,height);}wc.restore();
}
function s4dPrepareVan(img){
 const rects=[[2,2,708,621],[720,2,531,621],[2,632,707,619],[716,632,535,619]];
 S4_VAN_ART.panels=rects.map(([x,y,w,h],i)=>{
  const c=document.createElement('canvas');c.width=i===0?512:256;c.height=256;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,x*img.width/1254,y*img.height/1254,w*img.width/1254,h*img.height/1254,0,0,c.width,c.height);
  return{w:c.width,h:c.height,data:g.getImageData(0,0,c.width,c.height).data};
 });
 const rear=S4_VAN_ART.panels[1];for(let half=0;half<2;half++){
  const data=new Uint8ClampedArray(128*256*4);for(let y=0;y<256;y++)data.set(rear.data.subarray((y*256+half*128)*4,(y*256+half*128+128)*4),y*128*4);
  S4_VAN_ART.panels.push({w:128,h:256,data});
 }
 const cab=S4_VAN_ART.panels[2];for(const [sy,h]of [[0,120],[142,114]]){
  const data=new Uint8ClampedArray(256*h*4);data.set(cab.data.subarray(sy*256*4,(sy+h)*256*4));S4_VAN_ART.panels.push({w:256,h,data});
 }

}
function s4dFireTextures(){
 if(S4_VAN_ART.flames.length)return;
 // Cached, multi-scale turbulent tongues; simulation selects frames (pause holds).
 for(let frame=0;frame<12;frame++){
  const w=96,h=160,data=new Uint8ClampedArray(w*h*4),phase=frame/12*TAU;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const v=1-y/(h-1),u=x/(w-1)*2-1;
   const bend=Math.sin(v*7+phase)*.19*v+Math.sin(v*16-phase*2)*.06;
   const noise=(Math.sin(x*.17+y*.13+phase*2)+Math.sin(x*.37-y*.087-phase)+Math.sin(x*.065-y*.32+phase*3))/3;
   const width=(1-v)*.77+.04,heat=1-Math.abs(u-bend)/(width+.11*noise);
   if(heat<.04||v>.96-.13*(1+noise))continue;
   const hot=clamp(heat*(1-v*.7),0,1),i=(y*w+x)*4;
   data[i]=255;data[i+1]=Math.floor(65+hot*186);data[i+2]=Math.floor(12+Math.pow(hot,3)*211);
   data[i+3]=Math.floor(clamp(heat*3,0,1)*255);
  }
  S4_VAN_ART.flames.push({w,h,data});
 }
}
function s4dVehicleFaces(){
 if(!S4D.vehicle||!s4Running())return;
 s4dSkidMarks();
 const van=S4D.vehicle,c=Math.cos(van.a),s=Math.sin(van.a),panels=S4_VAN_ART.panels;
 const settle=S4D.phase==='impact'?Math.sin(S4D.t*16)*.075*Math.exp(-S4D.t*3.5):S4D.phase==='approach'?Math.sin(S4D.t*25)*.025:0;
 const roll=settings.reduce?0:van.roll||0;
 const point=p=>[van.x+p[0]*c-p[1]*s,van.y+p[0]*s+p[1]*c,Math.max(.01,p[2]+settle+p[1]*roll)];
 const quad=(pts,color,surface=null,emissive=false)=>s4DrawFace({points:pts.map(point),tex:-1,color,surface,u:1,v:1,emissive});
 const box=(x,y,z,w,d,h,col,side=null,front=null,roof=null)=>{
  const a=x-w/2,b=x+w/2,n=y-d/2,f=y+d/2,t=z+h;
  quad([[a,n,z],[b,n,z],[b,n,t],[a,n,t]],col,side);
  quad([[b,f,z],[a,f,z],[a,f,t],[b,f,t]],col,side);
  quad([[a,f,z],[a,n,z],[a,n,t],[a,f,t]],col,front);
  quad([[b,n,z],[b,f,z],[b,f,t],[b,n,t]],col);
  quad([[a,n,t],[b,n,t],[b,f,t],[a,f,t]],col,roof||side);
 };
 const cream=[168,167,143],steel=[73,81,77],red=[100,18,29];
 box(0,0,.21,4.3,2.28,.22,steel);
 // Tall patient box and lower cab are distinct volumes, not a single billboard.
 box(.68,0,.43,2.92,2.36,1.39,cream,panels[0],null,panels[3]);
 box(-1.24,0,.43,1.06,2.12,1.13,cream,panels[3],null,panels[3]);
 box(-1.88,0,.4,.5,2.1,.44,cream,panels[3],null,panels[3]);
 quad([[-1.779,-1.02,.83],[-1.779,1.02,.83],[-1.779,1.02,1.52],[-1.779,-1.02,1.52]],cream,panels[6]);
 quad([[-2.139,-1.02,.42],[-2.139,1.02,.42],[-2.139,1.02,.82],[-2.139,-1.02,.82]],cream,panels[7]);
 // Cab glass, door stripe, mirrors, stepped roof, lamps, bumper.
 for(const y of[-1.068,1.068]){
  quad([[-1.67,y,.94],[-.82,y,.94],[-.82,y,1.46],[-1.48,y,1.46]],[19,38,41]);
  quad([[-1.71,y,.68],[-.78,y,.68],[-.78,y,.86],[-1.71,y,.86]],red);
  box(-.87,y,.9,.17,.032,.032,steel);
  box(-1.54,y*1.11,1.06,.24,.12,.23,[25,32,32]);
 }
 box(-2.18,0,.25,.14,2.32,.16,steel,panels[3]);
 box(2.15,0,.24,.15,2.48,.18,steel,panels[3]);
 for(const yy of[-.76,.76])quad([[-2.257,yy-.19,.53],[-2.257,yy+.19,.53],[-2.257,yy+.19,.7],[-2.257,yy-.19,.7]],[208,211,160],null,true);
 // Eight-sided tyres give the silhouette real depth from any approach.
 for(const x of[-1.35,1.24])for(const y of[-1.23,1.23]){
  const radius=.32,z=.34,ys=[y-.105,y+.105];
  for(let i=0;i<10;i++){
   const a=i/10*TAU,b=(i+1)/10*TAU,xa=x+Math.cos(a)*radius,xb=x+Math.cos(b)*radius,za=z+Math.sin(a)*radius,zb=z+Math.sin(b)*radius;
   quad([[xa,ys[0],za],[xb,ys[0],zb],[xb,ys[1],zb],[xa,ys[1],za]],i%2?[17,21,21]:[28,32,30]);
   for(const side of ys)quad([[x,side,z],[xa,side,za],[xb,side,zb],[x,side,z]],[25,28,28]);
  }
  const side=y+Math.sign(y)*.111;
  for(let i=0;i<10;i++){const a=i/10*TAU,b=(i+1)/10*TAU;
   quad([[x,side,z],[x+Math.cos(a)*.165,side,z+Math.sin(a)*.165],[x+Math.cos(b)*.165,side,z+Math.sin(b)*.165],[x,side,z]],i%2?[93,98,88]:[63,68,61]);
  }
  for(let i=0;i<5;i++)box(x+Math.cos(i/5*TAU)*.1,side,.329+Math.sin(i/5*TAU)*.1,.025,.008,.025,[153,152,128]);
 }
 box(-.71,0,1.62,.34,1.65,.09,steel);
 for(const y of[-.55,.55])box(-.71,y,1.71,.32,.52,.15,[125,17,27]);
 // Rear black opening behind two hinged, textured door leaves.
 quad([[2.153,-1.12,.49],[2.153,1.12,.49],[2.153,1.12,1.74],[2.153,-1.12,1.74]],[10,13,12]);
 for(const side of[-1,1]){
  const swing=S4D.door*1.28,hingeY=side*1.12,freeY=hingeY-side*1.12*Math.cos(swing),freeX=2.17+1.12*Math.sin(swing);
  quad([[2.17,hingeY,.48],[freeX,freeY,.48],[freeX,freeY,1.76],[2.17,hingeY,1.76]],cream,panels[side<0?4:5]);
 }
 if(S4D.crashed){
  // Crumpled gate rail and shards lie at the physical point of impact.
  if(S4Q.on&&(S4Q.moved||S4Q.action?.kind==='move')){const f=[];for(let i=0;i<5;i++)s4qMeshBox(f,57.8-i*.12,42.8+Math.sin(i*3)*.7,.025,1.3-i*.15,.055,.035,[92,110,99]);for(const face of f)s4DrawFace(face);}
  else for(let i=0;i<5;i++)box(-1.4-i*.12,-.2+Math.sin(i*3)*.7,.025,1.3-i*.15,.055,.035,[92,110,99]);
 }
 if(!s4qFireAmount())return;
 s4dFireTextures();
 const clock=settings.reduce?Math.floor(S4D.clock*5)/5:S4D.clock;
 const firePoints=[[-1.94,.76,.82],[-1.78,-.68,.84],[-2.25,.34,.49],[-2.25,-.5,.51],[-1.65,1.09,.65],[-1.58,-1.1,.69],[-1.05,-1,1.5]];
 const ignition=(S4D.phase==='impact'?.22+.78*s4dEase(S4D.t/.48):1)*s4qFireAmount();
 for(let i=0;i<firePoints.length;i++){
  const [x,y,z]=firePoints[i];
  const p=point([x,y,z]),w=(i===6?1.2:.58+(i%2)*.15)*ignition,h=(i===6?3.1:1.4+(i%3)*.28)*(S4Q.action?.kind==='extinguish'?Math.pow(ignition,.35):ignition);
  const ox=-camDY*w/2,oy=camDX*w/2,tex=S4_VAN_ART.flames[(Math.floor(clock*10)+i*3)%12];
  s4DrawFace({points:[[p[0]-ox,p[1]-oy,p[2]],[p[0]+ox,p[1]+oy,p[2]],[p[0]+ox,p[1]+oy,p[2]+h],[p[0]-ox,p[1]-oy,p[2]+h]],tex:-1,color:[255,110,25],surface:tex,u:1,v:1,cutout:true,emissive:true});
 }
}
function s4dSkidMarks(){
 if(!S4_VAN_ART.skids){
  const strips=[];for(let i=5;i<31;i++)for(const side of[-1,1]){
   const a=s4dCrashPosition((i-1)/32),b=s4dCrashPosition(i/32);
   const tire=v=>[v.x+Math.cos(v.a)*1.24-Math.sin(v.a)*side*1.23,v.y+Math.sin(v.a)*1.24+Math.cos(v.a)*side*1.23];
   const p=tire(a),q=tire(b),d=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/(d||1)*.075,ny=(q[0]-p[0])/(d||1)*.075;
   strips.push({t:i/32,points:[[p[0]-nx,p[1]-ny,.014],[q[0]-nx,q[1]-ny,.014],[q[0]+nx,q[1]+ny,.014],[p[0]+nx,p[1]+ny,.014]],tex:-1,color:[14,21,22],u:1,v:1});
  }S4_VAN_ART.skids=strips;
 }
 const progress=S4D.crashed?1:clamp(S4D.t/S4D_DURATIONS.approach,0,1);
 for(const f of S4_VAN_ART.skids)if(f.t<=progress)s4DrawFace(f);
}
function s4dVehicleLight(wx,wy){
 if(!S4D.vehicle||!s4qFireAmount())return 0;
 const v=S4D.vehicle,dx=wx-(v.x-1.85*Math.cos(v.a)),dy=wy-(v.y-1.85*Math.sin(v.a)),d2=dx*dx+dy*dy;
 if(d2>80)return 0;
 return S4D.fireBrightness/(1+d2*.45);
}
function s4dBakeFireLight(){
 if(!S4.fireLight)S4.fireLight=new Float32Array(S4_TW*S4_TH);else S4.fireLight.fill(0);
 if(!S4D.vehicle||!s4qFireAmount())return;
 S4D.fireBrightness=(settings.reduce?.8:.83+.12*Math.sin(S4D.clock*9)+.07*Math.sin(S4D.clock*17))*(S4D.phase==='impact'?s4dEase(S4D.t/.48):1)*s4qFireAmount();
 const v=S4D.vehicle;for(let y=Math.max(0,(v.y-9)*2|0);y<Math.min(S4_TH,(v.y+9)*2);y++)for(let x=Math.max(0,(v.x-11)*2|0);x<Math.min(S4_TW,(v.x+7)*2);x++)S4.fireLight[y*S4_TW+x]=s4dVehicleLight((x+.5)/2,(y+.5)/2);
}
function s4dDrawSmoke(){
 if(!s4Running()||!S4D.vehicle)return;
 const v=S4D.vehicle,clock=S4D.clock;
 // Slow windward smoke remains legible with reduced motion. Depth clips its base.
 const burning=s4qFireAmount()>0,fireAge=S4D.phase==='impact'?S4D.t:S4D.phase==='rearm'?S4D.t+S4D_DURATIONS.impact:10;
 for(let i=burning?10:-1;i>=0;i--){
  const age=((clock*.18+i/11)%1);if(age*5.55>fireAge)continue;
  const x=v.x-1.85+age*.8,y=v.y+.2+Math.sin(i*2.3)*age*.55,z=1.1+age*6.5;
  const p=project(x,y,z);if(!p||!s4Visible(p.x,p.y,p.d,.4))continue;
  const r=Math.max(1,p.scale*(.25+age*.7)),g=wc.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
  g.addColorStop(0,'rgba(24,28,29,'+((1-age)*.28)+')');g.addColorStop(1,'rgba(20,24,25,0)');wc.fillStyle=g;wc.fillRect(p.x-r,p.y-r,r*2,r*2);
 }
 for(const [x,y,z,col,amp]of [[v.x-1.85,v.y,1.25,'#ff7b26',burning?.22:0],[v.x-.71,v.y-.55,1.81,'#ff273c',.3],[v.x-.71,v.y+.55,1.81,'#ff273c',.3]]){
  const p=project(x,y,z);if(p&&s4Visible(p.x,p.y,p.d,.25)){const pulse=settings.reduce?.5:.5+.5*Math.sin(clock*5.4);drawGlow(p.x,p.y,p.scale*.55,col,amp*pulse);}
 }
}
function s4dDoorGlass(){
 if(S4_VAN_ART.doorGlass)return S4_VAN_ART.doorGlass;
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 const white=g.createLinearGradient(0,0,0,256);white.addColorStop(0,'#ffffff');white.addColorStop(.55,'#f9fcff');white.addColorStop(1,'#dfeaf3');g.fillStyle=white;g.fillRect(0,0,256,256);
 const sheen=g.createLinearGradient(0,0,256,0);sheen.addColorStop(0,'rgba(180,201,217,.2)');sheen.addColorStop(.1,'rgba(255,255,255,0)');sheen.addColorStop(.8,'rgba(255,255,255,.45)');sheen.addColorStop(1,'rgba(197,213,226,.24)');g.fillStyle=sheen;g.fillRect(0,0,256,256);
 return S4_VAN_ART.doorGlass=c;
}
function s4dThreshold(){
 if(!hwRunning()||(!HW.resolved&&!HW.ending&&!s4dLocked()))return;
 const p={x:61.94,y:2.5,a:Math.PI/2};meshFaces=[];
 // Recessed white glass, narrow silver frames and slim push bars. The smooth
 // cached surface replaces the old green slab while retaining native depth.
 meshQuad(p,[[-1.4,0,.015],[1.4,0,.015],[1.4,0,1.13],[-1.4,0,1.13]],'#edf5ff',-1,true);
 for(const [a,b]of [[-1.36,-1.18],[-1.145,-.025],[.025,1.145],[1.18,1.36]]){
  meshQuad(p,[[a,-.012,.045],[b,-.012,.045],[b,-.012,1.09],[a,-.012,1.09]],'#ffffff',-1,true);meshFaces[meshFaces.length-1].image=s4dDoorGlass();
 }
 for(const x of[-1.39,-1.165,0,1.165,1.39])meshBox(p,x,-.029,.02,x===0?.024:.032,.045,1.1,'#bdcddc');
 for(const z of[.018,1.095])meshBox(p,0,-.029,z,2.81,.06,.028,'#c9d7e3');
 for(const x of[-.585,.585]){
  meshBox(p,x,-.068,.445,.8,.055,.026,'#afc1d0');
  meshBox(p,x,-.095,.465,.81,.022,.012,'#f6fbff');
 }
 for(const face of meshFaces){face.d=(face.worldPoints[0].x-player.x)*camDX+(face.worldPoints[0].y-player.y)*camDY;face.wallAttached=true;face.emissive=true;drawMeshFace(face);}
 const light=project(61.88,2.5,.65);if(light&&zBuffer[clamp(light.x|0,0,W-1)]>light.d-.1)drawGlow(light.x,light.y,Math.min(W,light.scale*1.7),'#f5faff',.28);
}
function s4dScreen(){
 if(!s4dLocked())return;
 let alpha=S4D.phase==='threshold'?s4dEase(S4D.t/S4D_DURATIONS.threshold):S4D.phase==='reveal'?1-s4dEase(S4D.t/.95):0;
 if(alpha>0){wc.fillStyle='rgba(246,250,255,'+alpha+')';wc.fillRect(0,0,W,H);}
}

