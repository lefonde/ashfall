// The existing post-Heart junction: right to discharge, left to downstairs.
// The route is picked once. At its shadowed side corner the guide fades in place.
const WG_RADIUS=.85,WG_NORTH=4.15,WG_ARC=Math.PI*.5*WG_RADIUS,WG_DEPARTURE=.48;
function wgRoute(left){
 const points=[[32.5,7.5],[32.5,3.35]];
 for(let i=1;i<=12;i++){const a=(left?0:Math.PI)+(left?-1:1)*Math.PI*.5*i/12;points.push([(left?31.65:33.35)+Math.cos(a)*.85,3.35+Math.sin(a)*.85]);}
 if(left){points.push([10,2.5],[6.7,1.48]);}else points.push([34.2,1.48]);
 const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 return {points,lengths,length:lengths[lengths.length-1]};
}
const WG_ROUTES={left:wgRoute(true),right:wgRoute(false)};
function wgPath(w=HW.warden){return WG_ROUTES[w?.wgLeft?'left':'right'];}
function wgPoint(s,w=HW.warden){
 const r=wgPath(w);s=clamp(s,0,r.length);let i=1;while(i<r.lengths.length-1&&r.lengths[i]<s)i++;
 const t=(s-r.lengths[i-1])/(r.lengths[i]-r.lengths[i-1]),a=r.points[i-1],b=r.points[i];return {x:mix(a[0],b[0],t),y:mix(a[1],b[1],t)};
}
function wgPlayerProgress(w=HW.warden){
 const r=wgPath(w);let best=Infinity,progress=0;
 for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),t=clamp(((player.x-a[0])*dx+(player.y-a[1])*dy)/(len*len),i===1?-10:0,i===r.points.length-1?10:1);
  const d=(player.x-a[0]-dx*t)**2+(player.y-a[1]-dy*t)**2;if(d<best){best=d;progress=r.lengths[i-1]+t*len;}}
 return progress;
}
function wgPrime(w){
 w.wgLeft=typeof rsUnlocked==='function'&&rsUnlocked();w.wgGuide=true;w.wgStep=-1;w.wgT=0;w.wgSpeed=0;w.wgFade=1;w.wgGone=false;w.wgFading=false;
 w.wgProgress=0;w.wgPlayerProgress=wgPlayerProgress(w);w.wgPlayerSpeed=0;w.wgWaiting=false;w.wgEntered=false;
}
const wgResolve=hwResolve;
hwResolve=function(...args){const previous=HW.warden,result=wgResolve(...args),w=HW.warden;if(HW.resolved&&w&&w!==previous){wgPrime(w);hwSave();}return result;};
const wgPresence=wardenPresence;
wardenPresence=function(e,d,time=gameTime){return wgPresence(e,d,time)*(e.wgGuide?(e.wgGone?0:clamp(e.wgFade,0,1)):1);};
function wgTick(dt){
 const w=HW.warden;
 if(!hwRunning()||mode!=='playing'||player.hp<=0||HW.ending||!HW.resolved||HB.state!=='dead'||!w||!w.wgGuide||w.wgGone||!w.alive)return;
 dt=clamp(Number.isFinite(dt)?dt:0,0,.1);if(!dt)return;
 if(player.y<3.75&&player.y>1)w.wgEntered=true;
 const d=Math.hypot(w.x-player.x,w.y-player.y),path=wgPath(w);
 if(w.wgProgress>=path.length){
  if(w.wgEntered&&(d<4.8||(w.wgLeft?player.x<w.x:player.x>w.x)))w.wgFading=true;
  if(w.wgFading){w.wgT=Math.min(WG_DEPARTURE,w.wgT+dt);w.wgFade=1-w.wgT/WG_DEPARTURE;
   if(w.wgT===WG_DEPARTURE){w.wgGone=true;w.wgFade=0;w.alive=false;w.death=0;}}
  return;
 }
 const pp=wgPlayerProgress(w),walk=4.65*clamp(mods.speed||1,.5,2);
 if(w.wgStep<0){if(d>7||!lineOfSight(w.x,w.y,player.x,player.y)){w.wgT=0;w.wgPlayerProgress=pp;return;}w.wgT+=dt;if(w.wgT<.1)return;w.wgStep=0;w.wgT=0;w.wgPlayerProgress=pp;w.wgPlayerSpeed=Math.min(walk,Math.hypot(player.vx,player.vy));}
 if(w.wgWaiting){if(d<7.5)w.wgWaiting=false;}else if(d>10)w.wgWaiting=true;
 const forward=clamp((pp-w.wgPlayerProgress)/dt,0,walk*1.15);w.wgPlayerProgress=pp;w.wgPlayerSpeed=mix(w.wgPlayerSpeed,forward,1-Math.exp(-dt*6));
 const remaining=path.length-w.wgProgress,target=w.wgWaiting?0:Math.min(clamp(w.wgPlayerSpeed+(pp+4.8-w.wgProgress)*2.3,0,walk*1.42),Math.sqrt(2*walk*3*remaining));
 w.wgSpeed+=clamp(target-w.wgSpeed,-walk*3*dt,walk*6*dt);
 const next=remaining<.018?path.length:Math.min(path.length,w.wgProgress+w.wgSpeed*dt),p=wgPoint(next,w);
 if(!fits(p.x,p.y,w.r)){w.wgSpeed=0;return;}w.wgProgress=next;w.x=p.x;w.y=p.y;
 if(next===path.length){w.wgSpeed=0;w.wgT=0;}
}
hwTick=function(dt){if(!hwRunning())return;if(HW.arrival>0){HW.arrival-=dt;if(player.y<58)HW.arrival=0;}if(HB.state==='dormant'&&hbSafeEntry())hbStart();hbTick(dt);wgTick(dt);};
