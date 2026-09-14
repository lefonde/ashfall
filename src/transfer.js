// The Transfer: one continuous, finite scene shared by the first two chapters.
// The host world is suspended, never advanced under the corridor's coordinates.
const TF={active:null,campaign:{status:'unseen',entryChapter:null},test:{status:'unseen',entryChapter:null},bed:null};
const TF_ENTRY=2,TF_END=398,TF_WARDEN=Object.freeze({x:388.6,y:5.65}),TF_WATER=.14;
// The long axis folds optically; simulation and the inherited controls keep their
// exact metres. Nearby space has unit derivative, while the far corner hangs
// within sight until the last stretch. This mapping is monotone and invertible.
const TF_FOLD_LENGTH=21; // Plus the rigid three-metre doorway neighborhood.
function tfViewX(x){const d=x-player.x,a=Math.abs(d),far=Math.max(0,a-3);return player.x+Math.sign(d)*(Math.min(3,a)+far/(1+far/TF_FOLD_LENGTH));}
function tfWorldX(x){const d=x-player.x,a=Math.abs(d),far=Math.max(0,a-3),den=1-far/TF_FOLD_LENGTH;return player.x+Math.sign(d)*(Math.min(3,a)+far/Math.max(.00001,den));}
function tfPresencePoint(){return {x:tfViewX(TF_WARDEN.x),y:TF_WARDEN.y};}
function tfWaterRipple(x,y,power=1){const s=TF.active;if(!s||tfWall(x,y))return;s.ripples.push({x,y,age:0,life:1.7,power:clamp(power,.1,2)});if(s.ripples.length>24)s.ripples.shift();}
function tfPresenceAudiblePoint(){const p=tfPresencePoint(),dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy)||1;return {x:player.x+dx/d*Math.min(d,5.5),y:player.y+dy/d*Math.min(d,5.5)};}
function tfShotFacesPresence(){
 const s=TF.active;if(!s||s.wardenGone||s.disappearing)return false;
 const p=tfPresencePoint(),dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy);
 if(d<=.1||Math.abs(angle(Math.atan2(dy,dx)-player.a))>=Math.atan2(.38,d)+(weapon===0?guns[0].spread*.13:.009))return false;
 const visible=typeof tfViewCastRay!=='function'||tfViewCastRay(dx/d,dy/d).d>=d-.05;return visible;
}
function tfWallScream(){
 const s=TF.active;if(!s||s.screamCooldown>0)return false;
 s.screamCooldown=2.3;s.screams++;const side=s.screams%2?3.03:5.97,pos={x:player.x+1.8,y:side};
 // These are the original human wall voices, not a combat creature attack.
 if(audio.active){const play=typeof mvPlay==='function'?mvPlay:audio.play.bind(audio);play('scream'+s.screams%2,{vol:.66,rate:.78+(s.screams%3)*.035,wet:.76,pos});play('agony',{vol:.17,rate:.69,wet:.85,pos:{x:player.x-2.2,y:side===3.03?5.97:3.03},at:(audio.ctx?.currentTime||0)+.32});}
 return true;
}

// Human-sized door throats open into the original, much wider flooded hall.
// The exterior sliver is retained until the player's whole body clears it.
const TF_RECTS=[[-1,4.04,4,4.96],[4,3,376,6],[376,2,390,6],[390,3.35,396,4.96],[396,4.04,TF_END+1,4.96]];
const TF_OUTLINE=[[-1,4.04],[4,4.04],[4,3],[376,3],[376,2],[390,2],[390,3.35],[396,3.35],[396,4.04],[TF_END+1,4.04],[TF_END+1,4.96],[390,4.96],[390,6],[4,6],[4,4.96],[-1,4.96]];
const TF_DOORS=[
 {level:0,cells:[[31,12],[31,11]],x:31.5,y:13.02,a:0,axis:-Math.PI/2,nx:0,ny:-1,returnX:31.5,returnY:13.72,returnA:Math.PI/2},
 {level:1,cells:[[31,7],[32,7]],x:31.02,y:7.5,a:Math.PI/2,axis:0,nx:1,ny:0,returnX:30.18,returnY:7.5,returnA:Math.PI}
];
// Both cameras and movement share an exact rigid transform: no scale, snap,
// changed look mode or reset of the player's weapon animation at a threshold.
function tfEntryPose(x,y,a,vx=0,vy=0,door=TF_DOORS[stage]){
 const dx=x-door.x,dy=y-door.y,nx=door.nx,ny=door.ny;
 return {x:TF_ENTRY+dx*nx+dy*ny,y:4.5-dx*ny+dy*nx,a:angle(a-door.axis),vx:vx*nx+vy*ny,vy:-vx*ny+vy*nx};
}
function tfHostPose(x,y,a,vx=0,vy=0,which='entry',door=TF.active?.door||TF_DOORS[stage]){
 const sign=which==='exit'?-1:1,nx=door.nx*sign,ny=door.ny*sign,dx=x-(which==='exit'?TF_END:TF_ENTRY),dy=y-4.5;
 return {x:door.x+dx*nx-dy*ny,y:door.y+dx*ny+dy*nx,a:angle(a+door.axis+(which==='exit'?Math.PI:0)),vx:vx*nx-vy*ny,vy:vx*ny+vy*nx};
}
function tfGunDip(){
 if(!TF.active)return 0;
 const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
 return H*(coarse?.09:.18)*smooth((player.x-4)/5)*smooth((396-player.x)/6);
}
function tfRunning(){return TF.active!==null;}
function tfState(){return review.active?TF.test:TF.campaign;}
function tfResetCampaign(){TF.campaign={status:'unseen',entryChapter:null};}
function tfWall(x,y){return !TF_RECTS.some(r=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3]);}
function tfFits(x,y,r=.19){return !tfWall(x-r,y-r)&&!tfWall(x+r,y-r)&&!tfWall(x-r,y+r)&&!tfWall(x+r,y+r);}
function tfCastRay(x,y,dx,dy,max=1000){
 let best=max,side=0,id=-1,u=0;
 for(let i=0;i<TF_OUTLINE.length;i++){
  const a=TF_OUTLINE[i],b=TF_OUTLINE[(i+1)%TF_OUTLINE.length],vertical=a[0]===b[0],v=vertical?dx:dy;
  if(Math.abs(v)<1e-9)continue;
  const d=((vertical?a[0]:a[1])-(vertical?x:y))/v;
  if(d<.00001||d>best)continue;
  const hit=vertical?y+d*dy:x+d*dx,lo=Math.min(vertical?a[1]:a[0],vertical?b[1]:b[0]),hi=Math.max(vertical?a[1]:a[0],vertical?b[1]:b[0]);
  if(hit<lo-1e-7||hit>hi+1e-7)continue;
  best=d;side=vertical?0:1;id=i;u=hit;
 }
 return {d:best,side,id,u:u-Math.floor(u),mx:Math.floor(x+dx*best),my:Math.floor(y+dy*best),type:1};
}
function tfWallType(level,x,y){return level===0?((x*7+y*13)%13===0?3:(x+y*3)%9===0?4:1):((x*5+y*11)%11===0?3:(x+y*4)%7===0?4:1);}
function tfHostBuild(){
 if(!useChapter||stage>1||tfRunning())return;
 const d=TF_DOORS[stage],done=tfState().status==='complete';
 environmentProps=environmentProps.filter(p=>!p.tfDoor&&!p.tfVestibule);
 wardLights=wardLights.filter(l=>!l.tfDoor);
 if(stage===1){
  // A sheltered staff recess off the north ring, away from all theatre panels.
  for(let y=6;y<=10;y++)for(let x=26;x<=30;x++)map[y][x]=0;
  map[11][27]=0;
  environmentProps.push({kind:'pipe',x:28,y:6.5,a:0,length:3,tfVestibule:true},
   {kind:'shrouded',x:29.8,y:10.45,a:0,tfVestibule:true},
   {kind:'sign',x:27.85,y:11.04,a:0,label:'STAFF',tfVestibule:true});
  wardLights.push({x:27.8,y:9.5,rgb:[.26,.31,.29],tfDoor:true});
 }
 for(const [x,y]of d.cells)map[y][x]=done?tfWallType(stage,x,y):0;
 if(!done){
  environmentProps.push({kind:'tf_door',x:d.x,y:d.y,a:d.a,tfDoor:true});
 }
 // Closing an impossible doorway must not relight the real room at exit.
 wardLights.push({x:d.x-d.nx*.25,y:d.y-d.ny*.25,rgb:[.20,.20,.15],tfDoor:true});
 if(done)CH.flags.transfer=true;
 rebuildFurniture();bakeLightField();buildFlow();WF.key='';WF.map=null;
}
// While the host is parked, prepare its sealed doorway without changing the
// world visible through either opening. The exit always lands in one cell;
// the capsule-clear threshold and rigid transform determine that cell exactly.
// Only the two Transfer door cells and its leaf differ from the parked world.
function tfPrepareHostExit(s){
 if(s.exitCache)return s.exitCache;
 const h=s.host,d=s.door,width=h.width,height=h.height;
 const closed=new Set(d.cells.map(([x,y])=>y*width+x));
 const props=h.props.filter(p=>!p.tfDoor),solid=h.furniture.filter(p=>p.kind!=='tf_leaf');
 const grid=new Map();for(const [cell,items]of h.furnGrid||[]){
  const kept=items.some(p=>p.kind==='tf_leaf')?items.filter(p=>p.kind!=='tf_leaf'):items;
  if(kept.length)grid.set(cell,kept);
 }
 const rootX=(d.x-d.nx*.27)|0,rootY=(d.y-d.ny*.27)|0,root=rootY*width+rootX;
 const field=new Int16Array(width*height).fill(-1),queue=new Int16Array(width*height);
 field[root]=0;queue[0]=root;
 return s.exitCache={props,furniture:solid,furnGrid:grid,closed,width,height,rootX,rootY,
  field,queue,walkable:new Uint8Array(width*height),navOpen:new Uint8Array(width*height),navEdges:new Uint8Array(width*height),
  navField:new Int16Array(width*height).fill(-1),phase:'scan',scan:0,read:0,write:1,ready:false};
}
function tfPreparedHostWall(job,h,x,y){
 return x<0||y<0||x>=job.width||y>=job.height||h.map[y|0][x|0]!==0||job.closed.has((y|0)*job.width+(x|0));
}
function tfPreparedHostFits(job,h,x,y,r){
 if(tfPreparedHostWall(job,h,x-r,y-r)||tfPreparedHostWall(job,h,x+r,y-r)||tfPreparedHostWall(job,h,x-r,y+r)||tfPreparedHostWall(job,h,x+r,y+r))return false;
 for(const p of job.furnGrid.get((y|0)*job.width+(x|0))||[]){
  const dx=x-p.x,dy=y-p.y;if(Math.abs(dx)>1.2||Math.abs(dy)>1.2)continue;
  if(Math.abs(dx*p.c+dy*p.s)<p.hx+r&&Math.abs(-dx*p.s+dy*p.c)<p.hy+r)return false;
 }
 return true;
}
function tfPreparedHostSight(job,h,ax,ay,bx,by){
 const count=Math.ceil(Math.hypot(bx-ax,by-ay)*9);
 for(let i=1;i<=count;i++)if(tfPreparedHostWall(job,h,ax+(bx-ax)*i/count,ay+(by-ay)*i/count))return false;
 return true;
}
function tfPreparedNavGoal(job,h){
 const p=h.navTarget;if(!p)return -1;let best=-1,distance=Infinity;
 for(let y=Math.max(1,(p.y|0)-3);y<Math.min(job.height-1,(p.y|0)+4);y++)for(let x=Math.max(1,(p.x|0)-3);x<Math.min(job.width-1,(p.x|0)+4);x++){
  const cell=y*job.width+x,d=Math.hypot(x+.5-p.x,y+.5-p.y);
  if(job.navOpen[cell]&&d<distance&&tfPreparedHostSight(job,h,x+.5,y+.5,p.x,p.y)){best=cell;distance=d;}
 }
 return best;
}
function tfPrepareHostExitStep(s){
 const job=tfPrepareHostExit(s);if(job.ready)return;
 const h=s.host,width=job.width,height=job.height,start=performance.now();let work=0;
 // Fixed work cap also bounds the diagnostic harness where the clock is frozen.
 while(work<96){
  if(job.phase==='scan'){
   const cell=job.scan++,x=cell%width,y=(cell/width)|0;
   // These two hospital chapters have no exterior boss collision to include.
   job.walkable[cell]=tfPreparedHostFits(job,h,x+.5,y+.5,.27)?1:0;
   job.navOpen[cell]=x>0&&y>0&&x<width-1&&y<height-1&&tfPreparedHostFits(job,h,x+.5,y+.5,.21)?1:0;
   if(job.scan===job.walkable.length){job.phase='edges';job.scan=0;}
  }else if(job.phase==='edges'){
   const cell=job.scan++,x=cell%width,y=(cell/width)|0;
   if(job.navOpen[cell]){
    if(job.navOpen[cell+1]&&tfPreparedHostFits(job,h,x+1,y+.5,.21)){job.navEdges[cell]|=2;job.navEdges[cell+1]|=1;}
    if(job.navOpen[cell+width]&&tfPreparedHostFits(job,h,x+.5,y+1,.21)){job.navEdges[cell]|=8;job.navEdges[cell+width]|=4;}
   }
   if(job.scan===job.walkable.length)job.phase='flow';
  }else if(job.phase==='flow'&&job.read<job.write){
   const cell=job.queue[job.read++],x=cell%width,y=(cell/width)|0,next=job.field[cell]+1;
   for(let side=0;side<4;side++){
    const nx=x+(side===0?1:side===1?-1:0),ny=y+(side===2?1:side===3?-1:0),index=ny*width+nx;
    if(nx<0||ny<0||nx>=width||ny>=height||!job.walkable[index]||job.field[index]!==-1)continue;
    job.field[index]=next;job.queue[job.write++]=index;
   }
  }else if(job.phase==='flow'){
   job.phase='route';job.read=job.write=0;const goal=tfPreparedNavGoal(job,h);
   if(goal>=0){job.navField[goal]=0;job.queue[job.write++]=goal;}
  }else if(job.read<job.write){
   const cell=job.queue[job.read++],next=job.navField[cell]+1;
   for(let side=0;side<4;side++){
    const index=cell+(side===0?-1:side===1?1:side===2?-width:width),bit=1<<side;
    if(!(job.navEdges[cell]&bit)||job.navField[index]>=0)continue;
    job.navField[index]=next;job.queue[job.write++]=index;
   }
  }else{job.ready=true;job.queue=null;return;}
  work++;if(work%8===0&&performance.now()-start>=1)return;
 }
}
function tfTryEnter(){
 if(mode!=='playing'||!useChapter||stage>1||tfRunning()||CH.maze||liminal.mode||tfState().status==='complete')return false;
 const p=tfEntryPose(player.x,player.y,player.a),at=p.x>=TF_ENTRY&&p.x<TF_ENTRY+1.7&&p.y>4.04+.19&&p.y<4.96-.19;
 if(!at)return false;
 tfEnter();return true;
}
function tfStopVoice(v){if(!v)return;try{v.source.stop();}catch{}for(const n of v.nodes||[])try{n.disconnect();}catch{}const i=audio.voices.indexOf(v);if(i>=0)audio.voices.splice(i,1);}
function tfAudioMix(on){
 if(!audio.ctx)return;
 const c=audio.ctx,t=c.currentTime;
 if(on&&!TF.bed){
  const gain=c.createGain();gain.gain.value=0;gain.connect(audio.sfx);
  for(const [frequency,volume]of [[50.2,.7],[100.7,.18]]){
   const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=frequency;g.gain.value=volume;
   o.connect(g).connect(gain);o.start();
  }
  TF.bed=gain;
 }
 TF.bed?.gain.setTargetAtTime(on?.036:0,t,.6);
 if(on){
  audio.music.gain.setTargetAtTime(0,t,.25);audio.ambience.gain.setTargetAtTime(0,t,.25);
  audio.roomReturn.gain.setTargetAtTime(.82,t,.3);audio.roomTone.frequency.setTargetAtTime(2400,t,.3);
  if(audio.impLong)audio.room.buffer=audio.impLong;
 }
 if(typeof rsAudioTransferMix==='function')rsAudioTransferMix(on);
}
function tfEnter(){
 if(tfRunning()||tfState().status==='complete')return;
 const door=TF_DOORS[stage],navTarget=wfTarget(),host={map,props:environmentProps,lights:wardLights,lf:new Float32Array(lightField),
  enemies,drops,bullets,particles,rings,decals,tracers,numbers,exit,cleared,flow,flowClock,width:MW,height:MH,
  nav:{...WF,seen:WF.seen?.slice(),path:WF.path.slice()},navTarget:navTarget?{...navTarget}:null,navTopology:wfTopologyKey(),
  x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,liminal:{...liminal},pitch:aimPitch,furniture,furnGrid};
 TF.active={host,door,clock:gameTime,steps:0,take:0,progress:0,fade:0,ending:0,wardenAlpha:1,wardenGone:false,
  disappearing:false,breath:null,breathPlayed:false,nextBreath:.8,breathTake:0,screamCooldown:0,screams:0,ripples:[],waterMotion:0};
 Object.assign(tfState(),{status:'inside',entryChapter:stage+1});
 enemies=[];drops=[];bullets=[];particles=[];rings=[];decals=[];tracers=[];numbers=[];
 environmentProps=[];wardLights=[];rebuildFurniture();exit={x:-999,y:-999};cleared=false;
 Object.assign(player,tfEntryPose(host.x,host.y,host.a,host.vx,host.vy,door));
 _safeX=player.x;_safeY=player.y;msgT=feedT=0;
 liminal.mode='transfer';liminal.mix=liminal.target=1;liminal.dark=0;
 document.body.classList.add('liminal','transfer-scene');
 tfAudioMix(true);hudUpdate();
}
function tfRestoreHost(completed){
 const s=TF.active;if(!s)return;
 tfStopVoice(s.breath);tfAudioMix(false);
 const pose=completed?tfHostPose(player.x,player.y,player.a,player.vx,player.vy,'exit',s.door):null;
 TF.active=null;
 const h=s.host;
 map=h.map;environmentProps=h.props;wardLights=h.lights;lightField.set(h.lf);
 enemies=h.enemies;drops=h.drops;bullets=h.bullets;particles=h.particles;rings=h.rings;
 decals=h.decals;tracers=h.tracers;numbers=h.numbers;exit=h.exit;cleared=h.cleared;flow=h.flow;
 furniture=h.furniture;furnGrid=h.furnGrid;flowClock=h.flowClock;
 Object.assign(WF,h.nav);
 Object.assign(liminal,h.liminal);CH.tr=null;
 if(completed){
  Object.assign(tfState(),{status:'complete',entryChapter:s.door.level+1});
  Object.assign(player,pose);
 }else{
  tfState().status='unseen';Object.assign(player,{x:h.x,y:h.y,a:h.a,vx:h.vx,vy:h.vy});aimPitch=h.pitch;
 }
 document.body.classList.remove('liminal','transfer-scene');
 audio.restoreRoom();audio.levels();
 // Reuse the host's exact light bake and collision data. Rebuilding the entire
 // hospital here formerly stalled this single crossing and could relight it.
 if(completed){
  const prepared=tfPrepareHostExit(s);
  environmentProps=prepared.props;furniture=prepared.furniture;furnGrid=prepared.furnGrid;
  for(const [x,y]of s.door.cells)map[y][x]=tfWallType(s.door.level,x,y);
  const atRoot=(player.x|0)===prepared.rootX&&(player.y|0)===prepared.rootY;
  if(prepared.ready&&atRoot){
   flow=prepared.field;flowClock=.28;
   if(typeof adoptFlow==='function')adoptFlow(flow,prepared.rootX,prepared.rootY,prepared.walkable);
  }else{
   // Instant debug jumps may bypass every preparation slice. Mark navigation
   // due so the normal AI tick resolves it before any enemy moves; no host
   // simulation or unbounded preparation runs under the corridor coordinates.
   flowClock=0;
  }
  if(prepared.ready&&h.navTopology===wfTopologyKey()){
   // The compass owns a separate .21-radius grid and target-rooted route.
   // Prepare those too: invalidating its map here would synchronously rebuild
   // both inside hudUpdate, even with the enemy flow already adopted.
   Object.assign(WF,{map:h.map,key:h.navTopology,open:prepared.navOpen,edges:prepared.navEdges,
    field:prepared.navField,targetKey:h.navTarget?h.navTarget.id+':'+h.navTarget.x+','+h.navTarget.y:'',path:[],at:-1,cell:-1,wasUncharted:false});
  }else{WF.key='';WF.map=null;}
 }
 // Transfer uses its own light lookup; the host's active/horror light blends
 // also remained parked, so neither requires rebaking on return.
 _safeX=player.x;_safeY=player.y;
 if(completed){
  CH.flags.transfer=true;
  if(stage===0)chSave();else fvSave();
  liminal.dark=0;msgT=feedT=0;
 }
 if(fvRunning())fvRoomMix();hudUpdate();
}
function tfAbort(){if(tfRunning())tfRestoreHost(false);}
function tfUpdate(dt){
 if(mode!=='playing'||!TF.active)return;
 dt=clamp(Number.isFinite(dt)?dt:0,0,.05);
 const s=TF.active;s.clock+=dt;gameTime+=dt;s.screamCooldown=Math.max(0,s.screamCooldown-dt);
 tfPrepareHostExitStep(s);
 for(let i=s.ripples.length-1;i>=0;i--){s.ripples[i].age+=dt;if(s.ripples[i].age>=s.ripples[i].life)s.ripples.splice(i,1);}
 if(typeof rsAudioTransferUpdate==='function')rsAudioTransferUpdate(dt);
 s.fade=Math.max(0,s.fade-dt*3.6);
 if(keys.ArrowLeft)player.a-=dt*2.2;if(keys.ArrowRight)player.a+=dt*2.2;player.a=angle(player.a);
 aimPitch*=Math.exp(-dt*5);sway=mix(sway,clamp(lookDelta*.03,-1,1),1-Math.exp(-dt*10));lookDelta=0;
 const mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchMove.x;
 const my=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchMove.y;
 const len=Math.max(1,Math.hypot(mx,my)),speed=4.65*mods.speed;
 if(dashT>0){dashT=Math.max(0,dashT-dt);player.vx=Math.abs(player.vx);}
 else{
  const vx=Math.abs((Math.cos(player.a)*my-Math.sin(player.a)*mx)/len*speed),vy=(Math.sin(player.a)*my+Math.cos(player.a)*mx)/len*speed;
  player.vx=mix(player.vx,vx,1-Math.exp(-dt*20));player.vy=mix(player.vy,vy,1-Math.exp(-dt*20));
  if(!mx&&!my&&Math.hypot(player.vx,player.vy)<.015)player.vx=player.vy=0;
 }
 const oldX=player.x,oldY=player.y;move(player,Math.abs(player.vx)*dt,player.vy*dt);
 if(!tfFits(player.x,player.y)){player.x=_safeX;player.y=_safeY;player.vx=player.vy=0;}
 _safeX=player.x;_safeY=player.y;s.progress=player.x-2;
 const traveled=Math.hypot(player.x-oldX,player.y-oldY);bob+=traveled*2.5;s.steps+=traveled;
 if(s.steps>=1.48){s.steps%=1.48;const side=s.take++%2?1:-1,pos={x:player.x,y:player.y+side*.12};tfWaterRipple(pos.x,pos.y,.85);if(audio.active&&typeof rsAudioWaterFootstep==='function')rsAudioWaterFootstep({depth:TF_WATER,speed:Math.hypot(player.vx,player.vy),side,pos,volume:.85,room:'transfer'});}
 s.waterMotion-=dt;if(traveled>.002&&s.waterMotion<=0){s.waterMotion=.42;if(audio.active&&typeof rsAudioWaterMotion==='function')rsAudioWaterMotion({x:player.x,y:player.y},.22);}
 shotCD=Math.max(0,shotCD-dt);dashCD=Math.max(0,dashCD-dt);meleeCD=Math.max(0,meleeCD-dt);meleeT=Math.max(0,meleeT-dt);
 weaponDrop=Math.max(0,weaponDrop-dt);recoil=Math.max(0,recoil-dt*(weapon===1?7:5));muzzle=Math.max(0,muzzle-dt);shake*=Math.exp(-dt*15);
 if(reloadT>0&&weapon<3){reloadT-=dt;if(reloadT<=0){const g=guns[weapon],n=Math.min(g.mag-g.ammo,g.reserve);g.ammo+=n;g.reserve-=n;audio.reload('end');}}
 if(review.active&&review.unlimited)for(const g of guns)g.reserve=g.maxReserve;
 if(mouseFire||keys.KeyF)shoot();updateBullets(dt);updateEffects(dt);
 const distance=Math.hypot(player.x-TF_WARDEN.x,player.y-TF_WARDEN.y);
 if(!s.wardenGone&&!s.disappearing&&s.clock>=s.nextBreath&&audio.active){s.breathPlayed=true;tfStopVoice(s.breath);s.breath=audio.play('breath'+(s.breathTake++%3),{vol:.80,rate:.68+(s.breathTake%3)*.035,wet:.58,pos:tfPresenceAudiblePoint()});s.nextBreath=s.clock+4.1+(s.breathTake%3)*.7;}
 if(!s.wardenGone&&(distance<4.4||player.x>TF_WARDEN.x-3.6))s.disappearing=true;
 if(s.disappearing){s.wardenAlpha=Math.max(0,s.wardenAlpha-dt/.48);if(s.wardenAlpha===0){s.wardenGone=true;tfStopVoice(s.breath);s.breath=null;}}
 if(audio.ctx&&audio.active){
  if(s.breath){s.breath.vol=.80*s.wardenAlpha;s.breath.pos=tfPresenceAudiblePoint();}
  for(const v of audio.voices)if(v.pos)audio.position(v,audio.ctx.currentTime);
 }
 if(player.x>TF_END+.26){tfRestoreHost(true);return;}
 hudClock-=dt;if(hudClock<=0){hudUpdate();hudClock=.08;}
}
function tfHud(){
 if(!tfRunning())return;
 for(const id of ['goal','wardName','lifeHint','wfSystems'])$(id).textContent='';
 for(const id of ['compass','interactPrompt','touchUse'])$(id).classList.add('hidden');
 $('message').style.opacity=0;$('feed').style.opacity=0;
}

// The already-open door leaf has the same footprint in drawing and collision.
const tfRebuildFurniture=rebuildFurniture;
rebuildFurniture=function(){
 tfRebuildFurniture();
 for(const p of environmentProps)if(p.tfDoor){
  const c=Math.cos(p.a),s=Math.sin(p.a);
  furniture.push({kind:'tf_leaf',x:p.x+.41*c+.4*s,y:p.y+.41*s-.4*c,hx:.0275,hy:.40,c,s});
 }
 furnitureIndex();
};

// Host lifecycle hooks keep one completed discovery across chapter rebuilds.
const tfLoadStage=loadStage;
loadStage=function(level){tfAbort();const result=tfLoadStage(level);tfHostBuild();return result;};
const tfChRestore=chRestore,tfFvRestore=fvRestore;
chRestore=function(){tfAbort();const result=tfChRestore();tfHostBuild();return result;};
fvRestore=function(){tfAbort();const result=tfFvRestore();tfHostBuild();return result;};
const tfChSave=chSave,tfFvSave=fvSave;
chSave=function(){tfChSave();CH.checkpoint.transfer={...tfState()};};
fvSave=function(){tfFvSave();FV.checkpoint.transfer={...tfState()};};
const tfReviewLoad=reviewLoad;
reviewLoad=function(...args){
 tfAbort();TF.test={status:'unseen',entryChapter:null};const result=tfReviewLoad(...args);
 if(review.scene==='ch_transfer'||review.scene==='fv_transfer'){
  const fever=review.scene==='fv_transfer';enemies=[];reviewPlace(fever?29.3:31.5,fever?7.5:14.8,fever?0:-Math.PI/2);
  $('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');
 }
 return result;
};
const tfAudioLevels=audio.levels.bind(audio),tfAudioStart=audio.start.bind(audio),tfAudioReset=audio.reset.bind(audio);
audio.levels=function(){tfAudioLevels();if(tfRunning())tfAudioMix(true);};
audio.start=function(){const result=tfAudioStart();if(tfRunning())tfAudioMix(true);return result;};
audio.reset=function(){tfAudioMix(false);return tfAudioReset();};

function tfPreview(level){
 if(!artReady)return;
 review.preset='explore';review.ai=false;review.damage=false;review.unlimited=false;review.music=true;review.health=100;
 reviewLoad(level===1?'fv_transfer':'ch_transfer');
 $('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');
}
reviewScenes.fv_transfer={label:'The Transfer — Fever entrance',level:1,chapter:true,hint:'Staff recess on the north ring. Explore the unmarked door.'};
function tfReady(){for(const [id,level]of [['transferPreview1',0],['transferPreview2',1]]){$(id).disabled=false;$(id).onclick=()=>tfPreview(level);}}

// Scoped hooks: aiming at the visible anomaly provokes the room, never damage.
// Ammo, cadence, recoil, legacy planar trajectories and controls stay inherited.
const tfBaseShoot=shoot;
shoot=function(...args){const s=TF.active,g=guns[weapon],ammo=g?.ammo,aimed=s&&tfShotFacesPresence(),result=tfBaseShoot(...args);if(s===TF.active&&aimed&&g&&g.ammo<ammo)tfWallScream();return result;};
const tfBaseExplode=explode;
explode=function(q){const result=tfBaseExplode(q);if(tfRunning()&&q.owner==='player'){tfWaterRipple(q.x,q.y,q.kind==='grave'?1.6:.55);if(audio.active&&typeof rsAudioWaterImpact==='function')rsAudioWaterImpact({x:q.x,y:q.y},q.kind==='grave'?.8:.22);}return result;};
