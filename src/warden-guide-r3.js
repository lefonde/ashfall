// A brief lead through the real opening, then a glimpse through the hallway wall.
// Route progress is scalar so the established checkpoint copies remain valid.
const WG_RADIUS=.85,WG_NORTH=4.15,WG_ARC=Math.PI*.5*WG_RADIUS;
const WG_PATH=[[32.5,3.35],[33.35,2.5]];
const WG_LENGTH=WG_NORTH+WG_ARC,WG_DEPARTURE=.8;
function wgPoint(s){
 if(s<=WG_NORTH)return {x:32.5,y:7.5-s};
 if(s<WG_NORTH+WG_ARC){const a=Math.PI+(s-WG_NORTH)/WG_RADIUS;return {x:33.35+Math.cos(a)*WG_RADIUS,y:3.35+Math.sin(a)*WG_RADIUS};}
 return {x:33.35,y:2.5};
}
function wgPlayerProgress(){
 // Closest projection onto the actual rounded route. The first and last
 // straights extend past their ends, so approach/exit do not pin the pacing.
 const north=Math.min(7.5-player.y,WG_NORTH),ny=7.5-north;
 let best=(player.x-32.5)**2+(player.y-ny)**2,progress=north;
 let a=Math.atan2(player.y-3.35,player.x-33.35);if(a<0)a+=TAU;
 a=clamp(a,Math.PI,Math.PI*1.5);
 const cx=33.35+Math.cos(a)*WG_RADIUS,cy=3.35+Math.sin(a)*WG_RADIUS;
 const cd=(player.x-cx)**2+(player.y-cy)**2;
 if(cd<best){best=cd;progress=WG_NORTH+(a-Math.PI)*WG_RADIUS;}
 const east=Math.max(0,player.x-33.35),ed=(player.x-33.35-east)**2+(player.y-2.5)**2;
 if(ed<best)progress=WG_NORTH+WG_ARC+east;
 return progress;
}
function wgPrime(w){
 w.wgGuide=true;w.wgStep=-1;w.wgT=0;w.wgSpeed=0;w.wgFade=1;w.wgGone=false;
 w.wgProgress=0;w.wgPlayerProgress=wgPlayerProgress();w.wgPlayerSpeed=0;w.wgWaiting=false;w.wgEntered=false;
}
const wgResolve=hwResolve;
hwResolve=function(...args){
 const previous=HW.warden,result=wgResolve(...args),w=HW.warden;
 if(HW.resolved&&w&&w!==previous){wgPrime(w);hwSave();}
 return result;
};
const wgPresence=wardenPresence;
wardenPresence=function(e,d,time=gameTime){
 return wgPresence(e,d,time)*(e.wgGuide?(e.wgGone?0:clamp(e.wgFade,0,1)):1);
};
function wgTick(dt){
 const w=HW.warden;
 if(!hwRunning()||mode!=='playing'||player.hp<=0||HW.ending||!HW.resolved||HB.state!=='dead'||!w||!w.wgGuide||w.wgGone||!w.alive)return;
 dt=Math.min(Math.max(Number.isFinite(dt)?dt:0,0),.1);if(!dt)return;
 // Remember the actual crossing even if the player dashes away or turns back.
 // The upper corridor starts at row 3; standing in the crack is not entry.
 if(player.y<3.75&&player.y>1&&player.x>31.6&&player.x<37)w.wgEntered=true;
 if(w.wgStep===WG_PATH.length){
  if(!w.wgEntered)return;
  w.wgT=Math.min(WG_DEPARTURE,w.wgT+dt);const t=w.wgT/WG_DEPARTURE,u=t*t*(3-2*t);
  // A short, continuous sideways slip into the nearby wall. Depth clipping
  // hides the last trace; the selected breath fades through the same hook.
  w.x=mix(33.35,33.9,u);w.y=mix(2.5,.65,u);w.wgFade=1-u;
  if(t===1){w.wgGone=true;w.wgFade=0;w.wgSpeed=0;w.wgStep++;w.alive=false;w.death=0;}
  return;
 }
 const d=Math.hypot(w.x-player.x,w.y-player.y),pp=wgPlayerProgress();
 const walk=4.65*clamp(Number.isFinite(mods.speed)?mods.speed:1,.5,2);
 if(w.wgStep<0){
  if(d>7||!lineOfSight(w.x,w.y,player.x,player.y)){w.wgT=0;w.wgPlayerProgress=pp;return;}
  w.wgT+=dt;if(w.wgT<.1)return;
  w.wgStep=0;w.wgT=0;w.wgPlayerProgress=pp;
  w.wgPlayerSpeed=Math.min(walk,Math.hypot(player.vx,player.vy));
 }
 // Ignore brief corner occlusion after the player has seen it. A latched
 // distance wait has distinct stop/resume thresholds, avoiding edge chatter.
 if(w.wgWaiting){if(d<7.5)w.wgWaiting=false;}
 else if(d>10)w.wgWaiting=true;
 const forward=clamp((pp-w.wgPlayerProgress)/dt,0,walk*1.15);w.wgPlayerProgress=pp;
 w.wgPlayerSpeed=mix(w.wgPlayerSpeed,forward,1-Math.exp(-dt*6));
 const lead=4.8,remaining=Math.max(0,WG_LENGTH-w.wgProgress);
 // Brake gently at the bend if the player has not entered yet, avoiding a
 // hard waypoint stop while preserving the same lead at the actual opening.
 const target=w.wgWaiting?0:Math.min(clamp(w.wgPlayerSpeed+(pp+lead-w.wgProgress)*2.3,0,walk*1.42),Math.sqrt(2*walk*3*remaining));
 // Continuous acceleration and braking; no velocity reset at path points.
 const acceleration=target>w.wgSpeed?walk*6:walk*3;
 w.wgSpeed+=clamp(target-w.wgSpeed,-acceleration*dt,acceleration*dt);
 if(w.wgSpeed<.015&&target<.015){w.wgSpeed=0;return;}
 const next=Math.min(WG_LENGTH,w.wgProgress+w.wgSpeed*dt),p=wgPoint(next);
 // Only the final disappearance enters a wall; ordinary travel uses the
 // same furniture-aware fit test as the player, including the rounded turn.
 if(!fits(p.x,p.y,w.r)){w.wgSpeed=Math.max(0,w.wgSpeed-walk*3*dt);return;}
 w.wgProgress=next;w.x=p.x;w.y=p.y;
 w.wgStep=next<WG_NORTH?0:1;
 if(next===WG_LENGTH){w.x=33.35;w.y=2.5;w.wgStep=WG_PATH.length;w.wgT=0;w.wgSpeed=0;}
}
hwTick=function(dt){
 if(!hwRunning())return;
 if(HW.arrival>0){HW.arrival-=dt;if(player.y<58)HW.arrival=0;}
 if(HB.state==='dormant'&&hbSafeEntry())hbStart();
 hbTick(dt);wgTick(dt);
};

