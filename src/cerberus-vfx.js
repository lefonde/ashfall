// Simulation-clock effects, clipped by outdoor geometry. No lane preview.
// Ribbons are camera-facing strips in world space, not screen overlays.
function cbvRibbon(a,b,width,color,near=.08,surface=null){
 const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[player.x-(a[0]+b[0])*.5,player.y-(a[1]+b[1])*.5,.52-(a[2]+b[2])*.5],
  n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
 const p=n.map(t=>t/len*width);
 s4DrawFace({points:[a.map((t,i)=>t-p[i]),b.map((t,i)=>t-p[i]),b.map((t,i)=>t+p[i]),a.map((t,i)=>t+p[i])],tex:-1,color,u:1,v:1,emissive:!surface||!!surface.glow,cutout:!!surface?.cutout,near,surface});
}
function cbvRing(m,axis,r,t,color,width=.012){
 const side=[-Math.sin(axis),Math.cos(axis),0];
 for(let i=0;i<18;i++){
  const p=j=>{const a=j*TAU/18+t;return[m.x+side[0]*Math.cos(a)*r,m.y+side[1]*Math.cos(a)*r,m.z+Math.sin(a)*r];};
  cbvRibbon(p(i),p(i+1),width,color,1.05);
 }
}
function cbBeamWorld(){
 const a=CB.attack;if(a?.kind!=='beam')return;
 const m=cbHead('bulldog'),t=a.t,axis=a.beam.aim;
 if(!a.fired){
  const u=clamp(t/a.windup,0,1),r=.48*(1-u)+.11;
  cbvRing(m,axis,r,t*3,[88,153,211],.013);
  cbvRing(m,axis,r*.66,-t*5,[215,210,255],.019);
  const n=settings.reduce?5:10;
  for(let j=0;j<n;j++){
   const phase=(t*1.7+j/n)%1,ang=j*2.399+t*5,dist=.15+(1-phase)*.58;
   const point=k=>{const d=dist+k;return[m.x-Math.sin(axis)*Math.cos(ang-k*4)*d,m.y+Math.cos(axis)*Math.cos(ang-k*4)*d,m.z+Math.sin(ang-k*4)*d*.66];};
   cbvRibbon(point(0),point(.07),.009+u*.006,j%2?[132,221,255]:[243,159,255],1.05);
  }
  const front={x:m.x-camDX*.12,y:m.y-camDY*.12,z:m.z};
  cbvRing(front,player.a,.035+u*.065,0,[250,251,255],.024);
  return;
 }
 const b=a.beam,root=[b.x,b.y,b.z],end=[b.x+b.dx*b.length,b.y+b.dy*b.length,b.endZ];
 // The same physical shaft now has turbulent plasma and broken edges,
 // instead of several flat, opaque stripes. Its centre is continuously hot.
 cbvRibbon(root,end,.235,[110,70,199],1.1,cbvPlasma());
 for(let j=0;j<(settings.reduce?12:28);j++){
  const p=k=>{const d=k/28*b.length,ang=d*3.2-t*24,r=.19;return[b.x+b.dx*d-b.dy*Math.cos(ang)*r,b.y+b.dy*d+b.dx*Math.cos(ang)*r,mix(b.z,b.endZ,d/b.length)+Math.sin(ang)*r];};
  cbvRibbon(p(j),p(j+1),.016,j%3?[186,249,255]:[242,146,255],1.1);
 }
 for(let j=0;j<3;j++){
  const d=((t*9+j*b.length/3)%b.length),p={x:b.x+b.dx*d,y:b.y+b.dy*d,z:mix(b.z,b.endZ,d/b.length)};
  cbvRing(p,Math.atan2(b.dy,b.dx),.23,0,[143,206,248],.009);
 }
 cbvRing(m,Math.atan2(b.dy,b.dx),.28,t*3,[234,248,255],.045);
}
function cbBeamRelease(a){
 const m=cbHead('bulldog');emit(m.x,m.y,m.z,'#c2f1ff',settings.reduce?5:18,.6);
 shake=Math.max(shake,settings.reduce?0:3.5);
}
function cbYapSprite(q,v){
 if(!s4Visible(v.x,v.y,v.d,.15))return;
 const r=clamp(v.scale*q.r,1,13);
 wc.save();wc.globalAlpha=.25;wc.fillStyle=q.color;wc.beginPath();wc.arc(v.x,v.y,r*2.1,0,TAU);wc.fill();
 wc.globalAlpha=1;wc.beginPath();wc.arc(v.x,v.y,r,0,TAU);wc.fill();
 wc.fillStyle='#fffbdc';wc.beginPath();wc.arc(v.x,v.y,Math.max(.8,r*.47),0,TAU);wc.fill();wc.restore();
}

const CBV_PLASMA={w:192,h:48,data:new Uint8ClampedArray(192*48*4),stamp:-1,glow:true,cutout:true};
function cbvPlasma(){
 const s=CBV_PLASMA,stamp=Math.floor(CB.clock*(settings.reduce?3:18));if(s.stamp===stamp)return s;s.stamp=stamp;
 const t=settings.reduce?0:CB.clock;
 for(let x=0;x<s.w;x++)for(let y=0;y<s.h;y++){
  const u=x/s.w,v=(y/s.h-.5)*2,
   rag=.83+.09*Math.sin(x*.43-t*17)+.07*Math.sin(x*.93+t*31),
   warp=Math.sin(x*.13-t*14)*.055+Math.sin(x*.67+t*24)*.02,d=Math.abs(v-warp),
   thread=Math.sin(x*.55+v*35-t*40)**10,
   core=Math.exp(-d*d*22),body=Math.exp(-d*d*4.3),i=(y*s.w+x)*4;
  s.data[i]=53+core*205+thread*65;s.data[i+1]=30+body*167+core*70;
  s.data[i+2]=131+body*123;s.data[i+3]=d<rag?255:0;
 }return s;
}

