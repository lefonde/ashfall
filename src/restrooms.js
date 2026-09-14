// The Lower Restrooms: a separately owned chapter. The resolved Heart remains
// parked while the player descends toward the hidden sewer escape.
const RS={active:null,campaign:{complete:false},test:{complete:false},bed:null};
function rsRunning(){return RS.active!==null;}
function rsState(){return review.active?RS.test:RS.campaign;}
function rsUnlocked(){return tfState().status==='complete'||!!HW.restroomUnlocked;}
// Both renderers use this exact doorway transform. Preserve the camera and its
// optical velocity instead of treating the threshold as a new scene spawn.
const RS_ENTRANCE={hostX:3.64,hostY:2.5,x:5.5,y:-.49,scale:RS_EYE/.52};
function rsEntryPose(x,y,a=0,vx=0,vy=0){const e=RS_ENTRANCE;return{x:e.x+(y-e.hostY)*e.scale,y:e.y+(e.hostX-x)*e.scale,a:angle(a-Math.PI/2),vx:vy*e.scale,vy:-vx*e.scale};}
function rsHostPose(x,y,a=0,vx=0,vy=0){const e=RS_ENTRANCE;return{x:e.hostX-(y-e.y)/e.scale,y:e.hostY+(x-e.x)/e.scale,a:angle(a+Math.PI/2),vx:-vy/e.scale,vy:vx/e.scale};}
function rsEntranceBlend(){if(!rsRunning()||RS.active.committed)return 1;const t=clamp((player.y-2)/12,0,1);return t*t*(3-2*t);}
function rsEntranceMotionScale(){return mix(RS_ENTRANCE.scale,1,rsEntranceBlend());}
function rsThresholdAimBlend(){if(rsRunning())return 1;if(!hwRunning()||!HW.resolved||!rsUnlocked()||rsState().complete||player.y<1||player.y>4)return 0;const t=clamp((RS_ENTRANCE.hostX+2-player.x)/2,0,1);return t*t*(3-2*t);}
function rsViewSpeed(){const v=Math.hypot(player.vx,player.vy);return rsRunning()?v/rsEntranceMotionScale():v;}
function rsTryEnter(){
 if(mode!=='playing'||rsRunning()||!hwRunning()||!HW.resolved||HB.state!=='dead'||!rsUnlocked()||rsState().complete)return false;
 if(player.x<RS_ENTRANCE.hostX&&player.x>2.3&&player.y>2.15&&player.y<2.85){rsEnter();return true;}return false;
}
function rsHostDoor(){
 if(!hwRunning()||rsRunning())return;
 environmentProps=environmentProps.filter(p=>!p.rsDoor);wardLights=wardLights.filter(l=>!l.rsDoor);
 map[2][2]=tfWallType(0,2,2);map[2][3]=tfWallType(0,3,2);
 if(HW.resolved&&rsUnlocked()&&!rsState().complete){
  map[2][3]=0;map[2][2]=0;
  environmentProps.push({kind:'arch',x:3.5,y:2.5,a:Math.PI/2,label:'RESTROOMS',rsDoor:true},
   {kind:'sign',x:7,y:1.035,a:0,label:'RESTROOMS / B1',rsDoor:true});
  wardLights.push({x:4.2,y:2.5,rgb:[.31,.38,.32],rsDoor:true});
 }
 wardLights=wardLights.map(l=>HW.resolved&&l.x<15&&l.y<4&&!l.rsDoor?{...l,rsBaseRgb:l.rsBaseRgb||l.rgb,rgb:(l.rsBaseRgb||l.rgb).map(v=>v*.27)}:l);
 rebuildFurniture();bakeLightField();buildFlow();WF.key='';WF.map=null;
}
function rsEnter(){
 if(rsRunning())return;rsBuildWorld();
 const host={map,props:environmentProps,lights:wardLights,lf:new Float32Array(lightField),enemies,drops,bullets,particles,rings,decals,tracers,numbers,exit,cleared,flow,
  x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,pitch:aimPitch,pitchHeight:H,liminal:{...liminal}};
 RS.active={host,z:0,clock:0,steps:0,take:0,fade:0,committed:false,folds:0,visited:new Set(),known:new Set(),room:'top',
  doorState:{},shortcutState:{},anomalies:new Set(),foldCooldown:0,lastSave:0,lastSurface:null,mapFloor:1,mapDistrict:'public',orientationAssist:false,ripples:[],weaponRest:0,weaponReadyUntil:1.3};
 for(const d of RW.doors||[]){if(d.initialOpen===undefined)d.initialOpen=!!d.open;rsDoorSet(d,d.initialOpen);RS.active.doorState[d.id]=!!d.open;}
 // Let an existing boot/gun tail finish across the physical doorway.
 audio.wardenBreathStop();
 enemies=[];drops=[];bullets=[];particles=[];rings=[];decals=[];tracers=[];numbers=[];environmentProps=[];wardLights=[];rebuildFurniture();exit={x:-999,y:-999};cleared=false;
 Object.assign(player,rsEntryPose(host.x,host.y,host.a,host.vx,host.vy));_safeX=player.x;_safeY=player.y;
 // Pitch, bob, recoil and held input belong to the player, not to a renderer.
 // Keep them across the doorway; the wider look range is discovered by input.
 msgT=feedT=0;
 liminal.mode='restrooms';liminal.mix=liminal.target=1;liminal.dark=0;
 document.body.classList.add('liminal','restroom-scene');sceneAngularView=true;rsRenderQualityBegin();rsAudioMix(true);hudUpdate();
 if(typeof rsEncountersInit==='function')rsEncountersInit(RS.active);
 if(typeof rsSaveCheckpoint==='function')rsSaveCheckpoint('entry');
}
function rsLeave(completed=false,abort=false){
 const s=RS.active;if(!s)return;
 if(abort&&typeof rsSaveCheckpoint==='function')rsSaveCheckpoint('leave-session');
 if(typeof rsEncountersLeave==='function')rsEncountersLeave();
 rsAudioMix(false);for(const v of [...audio.voices])tfStopVoice(v);RS.active=null;rsRenderQualityEnd();sceneAngularView=false;
 const returnPose=!completed&&!abort?rsHostPose(player.x,player.y,player.a,player.vx,player.vy):null,returnPitch=aimPitch/H;
 const h=s.host;map=h.map;environmentProps=h.props;wardLights=h.lights;lightField.set(h.lf);enemies=h.enemies;drops=h.drops;bullets=h.bullets;particles=h.particles;rings=h.rings;decals=h.decals;tracers=h.tracers;numbers=h.numbers;exit=h.exit;cleared=h.cleared;flow=h.flow;
 Object.assign(liminal,h.liminal);
 if(returnPose){Object.assign(player,returnPose);aimPitch=returnPitch*H;}
 else{player.x=abort?h.x:54.3;player.y=abort?h.y:2.5;player.a=abort?h.a:0;player.vx=player.vy=0;aimPitch=h.pitch*H/(h.pitchHeight||H);dashT=hitstop=0;releaseInputs();}
 _safeX=player.x;_safeY=player.y;document.body.classList.remove('liminal','restroom-scene');
 if(completed)rsState().complete=true;
 if(!abort&&HW.warden){HW.warden.wgGone=true;HW.warden.wgFade=0;HW.warden.alive=false;}
 if(completed)rsHostDoor();else rebuildFurniture();audio.restoreRoom();audio.levels();audio.heartAftermath();hudUpdate();
 if(!abort){hwSave();liminal.dark=completed?.35:0;}
 if(completed&&typeof rsSaveCheckpoint==='function')rsSaveCheckpoint('hospital-return');
 if(typeof rsSaveMenuSync==='function')rsSaveMenuSync();
}
// Cross only a vestibule's outward-facing plane. The transform maps that normal
// to the destination's inward direction, so the connection is reversible.
function rsFold(ox,oy,oz=RS.active?.z){
 const s=RS.active;if(!s||s.foldCooldown>0)return 0;
 for(const fold of RW.folds||[])for(const pair of [[fold.a,fold.b],[fold.b,fold.a]]){
  const [a,b]=pair;if(Math.abs(oz-a.z)>.3)continue;
  const before=(ox-a.x)*a.nx+(oy-a.y)*a.ny,after=(player.x-a.x)*a.nx+(player.y-a.y)*a.ny;
  if(before>0||after<=0)continue;
  const side=(player.x-a.x)*-a.ny+(player.y-a.y)*a.nx;
  if(Math.abs(side)>(a.width||2.2)/2-.16)continue;
  const rotation=angle(Math.atan2(-b.ny,-b.nx)-Math.atan2(a.ny,a.nx)),c=Math.cos(rotation),sn=Math.sin(rotation),dx=player.x-a.x,dy=player.y-a.y;
  const nx=b.x+dx*c-dy*sn,ny=b.y+dx*sn+dy*c,nz=b.z+(s.z-a.z);
  if(!rsCanStand(nx,ny,nz))continue;
  player.x=nx;player.y=ny;player.a=angle(player.a+rotation);const vx=player.vx;player.vx=vx*c-player.vy*sn;player.vy=vx*sn+player.vy*c;
  s.z=nz;s.folds++;s.anomalies.add(fold.id);s.foldCooldown=.055;s.pendingSave='connection';s.lastFold=fold.id;
  _safeX=player.x;_safeY=player.y;return rotation||TAU;
 }
 return 0;
}
function rsEntryBoundaryAllows(x,y){
 const s=RS.active;if(s.committed||Math.abs(s.z)>.01||player.y<RS_ENTRANCE.y||y>=RS_ENTRANCE.y)return true;
 // The metre-scale body must still fit the original hospital opening when it
 // crosses back. This prevents a sideways exit inside the corridor's wall.
 const p=rsHostPose(x,y),m=s.host.map,r=.19;
 return [[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>m[Math.floor(p.y+dy)]?.[Math.floor(p.x+dx)]===0);
}
function rsMove(dx,dy){
 const s=RS.active,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.085));dx/=n;dy/=n;let travel=0;
 for(let i=0;i<n;i++){
  const ox=player.x,oy=player.y,oz=s.z;
  if(rsCanStand(player.x+dx,player.y,s.z)&&rsEntryBoundaryAllows(player.x+dx,player.y)){player.x+=dx;s.z=rsFloor(rsGround(player.x,player.y,s.z),player.x,player.y);}
  if(rsCanStand(player.x,player.y+dy,s.z)&&rsEntryBoundaryAllows(player.x,player.y+dy)){player.y+=dy;s.z=rsFloor(rsGround(player.x,player.y,s.z),player.x,player.y);}
  travel+=Math.hypot(player.x-ox,player.y-oy);
  const rotation=rsFold(ox,oy,oz);if(rotation){const c=Math.cos(rotation),sn=Math.sin(rotation),old=dx;dx=old*c-dy*sn;dy=old*sn+dy*c;}
 }
 _safeX=player.x;_safeY=player.y;return travel;
}
function rsCurrentSurface(){
 const s=RS.active;if(!s)return null;
 const here=rsAt(player.x,player.y).filter(r=>Math.abs(rsFloor(r,player.x,player.y)-s.z)<.28);
 return here.find(r=>r.room)||here.find(r=>r.slope)||here[0]||null;
}
function rsNearbyDoor(){
 if(!rsRunning()||mode!=='playing')return null;let best=null,dist=2.6;
 for(const d of RW.doors||[]){
  if(Math.abs(d.z-RS.active.z)>.4)continue;
  const dx=d.x-player.x,dy=d.y-player.y,n=Math.hypot(dx,dy);
  if(n>=dist||Math.abs(angle(Math.atan2(dy,dx)-player.a))>1.05)continue;
  // Visibility to the near side of the panel avoids use through an adjacent wall.
  if(n>.4&&rsCastRay(player.x,player.y,dx/n,dy/n,Math.max(0,n-.35)).d<n-.39)continue;
  dist=n;best=d;
 }
 return best;
}
function rsInteract(){
 if(!rsRunning())return false;if(mode!=='playing')return true;
 const d=rsNearbyDoor();if(!d)return true;
 if(!d.open&&typeof rsDoorCanOpen==='function'&&!rsDoorCanOpen(d,player.x,player.y,RS.active.z)){
  RS.active.doorNotice={id:d.id,text:'LATCHED FROM THE OTHER SIDE',until:RS.active.clock+1.8};hudUpdate();return true;
 }
 // Do not close a panel onto the player's body or trap them in the hinge.
 if(d.open&&Math.hypot(player.x-d.x,player.y-d.y)<Math.max(.7,(d.width||1)*.52))return true;
 rsDoorSet(d,!d.open);RS.active.doorState[d.id]=!!d.open;
 if(d.shortcut&&d.open)RS.active.shortcutState[d.id]=true;
 rsAudioDoor({x:d.x,y:d.y,z:d.z+1},d.open);RS.active.pendingSave='door';hudUpdate();return true;
}
function rsUpdate(dt){
 if(mode!=='playing'||!rsRunning())return;dt=clamp(Number.isFinite(dt)?dt:0,0,.05);
 const s=RS.active;s.clock+=dt;gameTime+=dt;s.fade=Math.max(0,s.fade-dt*3);s.foldCooldown=Math.max(0,s.foldCooldown-dt);
 if(keys.ArrowLeft)player.a-=dt*2.2;if(keys.ArrowRight)player.a+=dt*2.2;player.a=angle(player.a);
 // Looking at an upper court floor is persistent; it must not spring away.
 aimPitch=rsClampViewPitch(aimPitch);sway=mix(sway,clamp(lookDelta*.03,-1,1),1-Math.exp(-dt*10));lookDelta=0;
 const mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchMove.x,my=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchMove.y,len=Math.max(1,Math.hypot(mx,my));
 let ground=rsCurrentSurface();const hasWaterQuery=typeof rsWaterAt==='function',water=hasWaterQuery?rsWaterAt(player.x,player.y,s.z):null,depth=hasWaterQuery?(water?.depth||0):(ground?.water||0);
 const entrance=rsEntranceBlend(),motionScale=rsEntranceMotionScale(),speed=mix(4.65,4.25,entrance)*motionScale*(depth>.12?.93:1)*mods.speed;
 if(dashT>0)dashT=Math.max(0,dashT-dt);
 else{player.vx=mix(player.vx,(Math.cos(player.a)*my-Math.sin(player.a)*mx)/len*speed,1-Math.exp(-dt*mix(20,18,entrance)));player.vy=mix(player.vy,(Math.sin(player.a)*my+Math.cos(player.a)*mx)/len*speed,1-Math.exp(-dt*mix(20,18,entrance)));}
 const traveled=rsMove(player.vx*dt,player.vy*dt);bob+=traveled*mix(2.5/RS_ENTRANCE.scale,2,entrance);s.steps+=traveled/motionScale;
 ground=rsCurrentSurface();
 const here=rsAt(player.x,player.y).filter(r=>Math.abs(rsFloor(r,player.x,player.y)-s.z)<.28);for(const r of here)s.known.add(r.id);
 // Raised pool ledges, court decks and the curved gallery belong to the
 // enclosing room even when its base floor is below the player's feet.
 const room=here.find(r=>r.room)||RW.byId[ground?.parentRoom||ground?.court];if(room){
  if(s.room!==room.id){s.room=room.id;s.pendingSave='room';s.mapDistrict=room.district;}
  s.mapFloor=ground?.floor??rsFloorNumber(s.z);
  s.visited.add(room.id);
 }
 if(ground){s.lastSurface=ground.id;rsAudioUpdate(dt,ground);}
 // Match the heavy campaign gait; rapid splash overlaps made the old water
 // layer sound abrasive even at low volume. Movement speed stays unchanged.
 const cadence=depth>.008?1.45:1.35;
 if(s.steps>=cadence&&traveled>0){s.steps%=cadence;const w=hasWaterQuery?rsWaterAt(player.x,player.y,s.z):null,wet=hasWaterQuery?(w?.depth||0):(ground?.water||0);
  rsFootstep(wet,s.take++,ground,traveled/Math.max(.001,dt)/motionScale);
  if(wet){s.ripples.push({x:player.x,y:player.y,z:s.z+wet,age:0});if(s.ripples.length>6)s.ripples.shift();if(typeof rsWaterStep==='function')rsWaterStep(player.x,player.y,s.z,Math.min(1,traveled/Math.max(.001,dt)/4.25));}
 }
 for(const r of s.ripples)r.age+=dt;s.ripples=s.ripples.filter(r=>r.age<1.6);
 const commit=RW.entry?.commit;if(!s.committed&&room&&(commit?room.id===commit.surface&&player.y>(commit.y??-Infinity):true)){s.committed=true;s.pendingSave='threshold';if(typeof rsSaveCheckpoint==='function')rsSaveCheckpoint('descent-committed');}
 if(player.y<RS_ENTRANCE.y&&!s.committed){rsLeave(false);return;}
 if(typeof rsSewerTryExit==='function'&&rsSewerTryExit())return;
 shotCD=Math.max(0,shotCD-dt);dashCD=Math.max(0,dashCD-dt);meleeCD=Math.max(0,meleeCD-dt);meleeT=Math.max(0,meleeT-dt);weaponDrop=Math.max(0,weaponDrop-dt);recoil=Math.max(0,recoil-dt*6);muzzle=Math.max(0,muzzle-dt);shake*=Math.exp(-dt*15);hurt=Math.max(0,hurt-dt);hitmarker=Math.max(0,hitmarker-dt);killmarker=Math.max(0,killmarker-dt);whiteFlash=Math.max(0,whiteFlash-dt);
 if(reloadT>0&&weapon<3){reloadT-=dt;if(reloadT<=0){const g=guns[weapon],n=Math.min(g.mag-g.ammo,g.reserve);g.ammo+=n;g.reserve-=n;audio.reload('end');}}
 if(mouseFire||keys.KeyF)shoot();updateBullets(dt);updateEffects(dt);
 if(typeof rsEncountersUpdate==='function')rsEncountersUpdate(dt);
 if(mode!=='playing'||!rsRunning())return;
 const weaponActive=mouseFire||keys.KeyF||reloadT>0||meleeT>0||weaponDrop>0||muzzle>0;
 if(weaponActive){s.weaponReadyUntil=s.clock+1.3;s.weaponRest=0;}
 else{s.weaponRest=mix(s.weaponRest??1,s.clock<(s.weaponReadyUntil||0)?0:1,1-Math.exp(-dt*3));}
 if((s.pendingSave&&s.clock-s.lastSave>.8||s.clock-s.lastSave>15)&&ground&&!ground.slope){const reason=s.pendingSave||'progress';s.pendingSave=null;s.lastSave=s.clock;if(typeof rsSaveCheckpoint==='function')rsSaveCheckpoint(reason);}
 hudClock-=dt;if(hudClock<=0){hudUpdate();hudClock=.12;}
}
function rsHud(){
 if(!rsRunning()){
  if(hwRunning()&&HW.resolved&&rsUnlocked()&&!rsState().complete&&player.y<9){$('compass').classList.add('hidden');$('goal').textContent='';}return;
 }
 for(const id of ['goal','lifeHint','wfSystems','fvStatus'])$(id).textContent='';
 $('wardName').textContent='THE LOWER RESTROOMS';
 for(const id of ['compass','bossHud','reviewBar','reviewPanelBtn'])$(id).classList.add('hidden');
 document.body.classList.remove('boss-fight');$('message').style.opacity=0;$('feed').style.opacity=0;
 const d=rsNearbyDoor();$('interactPrompt').classList.toggle('hidden',!d);$('touchUse').classList.toggle('hidden',!d);
 if(d){
  const blocked=!d.open&&typeof rsDoorCanOpen==='function'&&!rsDoorCanOpen(d,player.x,player.y,RS.active.z),notice=RS.active.doorNotice;
  $('interactAction').textContent=notice?.id===d.id&&notice.until>RS.active.clock?notice.text:(coarse?'':'[E] ')+(blocked?'CHECK LATCH':d.open?'CLOSE DOOR':'OPEN DOOR');
  $('interactHint').textContent='';$('interactPrompt').style.borderColor='#9ab3a9';touchSetLabel('touchUse',blocked?'LATCH':d.open?'CLOSE':'OPEN');
 }
}
function rsFloorNumber(z){return Math.max(0,Math.min(6,Math.round(-z/3.4)));}
function rsGunDip(){return rsRunning()?H*(coarse?.25:.29)*rsEntranceBlend()*(mouseFire||keys.KeyF?0:(RS.active.weaponRest??1)):0;}
// Scene-only CPU rendering adaptation. The user's saved resolution is never
// changed; the temporary cap is removed before restoring the hospital scene.
const RS_RENDER_QUALITY={active:false,cap:1,pending:null,warmup:0,cooldown:0,samples:[],fastWindows:0,renderMs:0,changes:0};
function rsRenderQualityBegin(){
 const q=RS_RENDER_QUALITY;Object.assign(q,{active:true,cap:1,pending:null,warmup:15,cooldown:0,samples:[],fastWindows:0,renderMs:0,changes:0});
 sceneRenderScaleCap=q.cap;resize();
}
function rsRenderQualityEnd(){
 const q=RS_RENDER_QUALITY;q.active=false;q.cap=1;q.pending=null;q.samples.length=0;q.fastWindows=0;
 sceneRenderScaleCap=1;resize();
}
function rsRenderQualityApply(){
 const q=RS_RENDER_QUALITY;if(!q.active||!rsRunning()||mode!=='playing'||q.pending===null)return;
 q.cap=clamp(q.pending,.5,1);q.pending=null;sceneRenderScaleCap=q.cap;q.samples.length=0;q.warmup=8;q.cooldown=135;q.fastWindows=0;q.changes++;
 // Apply before the next render, so resizing never leaves a cleared frame on screen.
 resize();
}
function rsRenderQualitySample(milliseconds,elapsed=1000/60){
 const q=RS_RENDER_QUALITY;if(!q.active||!rsRunning()||mode!=='playing'||!Number.isFinite(milliseconds)||milliseconds<0)return;
 // Keep the approved quality thresholds; cooldown follows real elapsed time
 // rather than stretching out when a device has a low frame rate.
 const ticks=clamp(Number.isFinite(elapsed)?elapsed:1000/60,0,100)/(1000/60);
 if(q.warmup>0){q.warmup=Math.max(0,q.warmup-ticks);return;}if(q.cooldown>0){q.cooldown=Math.max(0,q.cooldown-ticks);return;}if(q.pending!==null)return;
 q.samples.push(Math.min(milliseconds,250));if(q.samples.length<45)return;
 const sorted=q.samples.slice().sort((a,b)=>a-b),middle=sorted.slice(4,41),mean=middle.reduce((a,b)=>a+b,0)/middle.length,p80=sorted[35],target=coarse?25:21;
 q.renderMs=mean;q.samples.length=0;
 const manualCap=clamp(settings.res||1,.5,1),effectiveCap=Math.min(q.cap,manualCap);
 if(mean>target*1.18||p80>target*1.35){q.fastWindows=0;if(effectiveCap>.5)q.pending=Math.max(.5,Math.round((effectiveCap-.125)*1000)/1000);}
 else if(mean<target*.58&&p80<target*.8){if(++q.fastWindows>=2&&q.cap<manualCap)q.pending=Math.min(manualCap,Math.round((q.cap+.125)*1000)/1000);}
 else q.fastWindows=0;
}
function rsRoomStart(room){
 const b=room.bounds,candidates=room.spawn?[[room.spawn.x,room.spawn.y]]:[];
 candidates.push([(b[0]+b[2])/2,(b[1]+b[3])/2]);
 for(let y=b[1]+1;y<b[3]-1;y+=1.5)for(let x=b[0]+1;x<b[2]-1;x+=1.5)candidates.push([x,y]);
 for(const [x,y]of candidates)if(rsPolyHas(room.poly,x,y)&&rsCanStand(x,y,room.z))return{x,y,z:room.z,a:room.spawn?.a??Math.PI/2};
 return null;
}
function rsStartChapter(){
 if(!artReady)return;startRun();Object.assign(TF.campaign,{status:'complete',entryChapter:1});if(CH.flags)CH.flags.transfer=true;
 loadStage(2);hbSkip();HW.restroomUnlocked=true;if(HW.warden){HW.warden.wgGone=true;HW.warden.wgFade=0;HW.warden.alive=false;}
 rsHostDoor();player.x=3.55;player.y=2.5;player.a=Math.PI;rsEnter();
}
const rsLoadStage=loadStage;loadStage=function(...args){if(rsRunning())rsLeave(false,true);if(args[0]===3&&!review.active&&!RS.campaign.sewerOpen&&typeof rsClearSave==='function')rsClearSave();const r=rsLoadStage(...args);rsHostDoor();return r;};
const rsStartRun=startRun;startRun=function(...args){if(rsRunning())rsLeave(false,true);if(typeof rsClearSave==='function')rsClearSave();RS.campaign={complete:false};return rsStartRun(...args);};
const rsResolve=hwResolve;hwResolve=function(...args){const before=HW.resolved,r=rsResolve(...args);if(!before&&HW.resolved){HW.restroomUnlocked=tfState().status==='complete';if(HW.warden)wgPrime(HW.warden);rsHostDoor();hwSave();}return r;};
const rsRestore=hwRestore;hwRestore=function(...args){if(rsRunning())rsLeave(false,true);const r=rsRestore(...args);rsHostDoor();return r;};
const rsBegin=hwBegin;hwBegin=function(...args){HW.restroomUnlocked=false;return rsBegin(...args);};
const rsLevels=audio.levels.bind(audio),rsAudioStart=audio.start.bind(audio),rsAudioReset=audio.reset.bind(audio);
audio.levels=function(){rsLevels();if(rsRunning())rsAudioMix(true);};audio.start=function(){const r=rsAudioStart();if(rsRunning())rsAudioMix(true);return r;};audio.reset=function(){rsAudioMix(false);return rsAudioReset();};
const rsReview=reviewLoad;reviewLoad=function(scene=review.scene){
 if(rsRunning())rsLeave(false,true);RS.test={complete:false};const r=rsReview(scene);
 if(['rs_stairs','rs_left','rs_right'].includes(scene)){
  TF.test.status=scene==='rs_right'?'unseen':'complete';HW.restroomUnlocked=scene!=='rs_right';if(HW.warden)wgPrime(HW.warden);rsHostDoor();
  reviewPlace(scene==='rs_stairs'?5.5:32.5,scene==='rs_stairs'?2.5:9.3,scene==='rs_stairs'?Math.PI:-Math.PI/2);
  $('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');hwSave();hudUpdate();
 }return r;
};
// Leave the scene before the old menu handler clears its preview flag. Otherwise
// a preview would masquerade as a campaign checkpoint during the stage reset.
const rsReviewLeave=reviewLeave;reviewLeave=function(...args){if(rsRunning())rsLeave(false,true);const r=rsReviewLeave(...args);if(typeof rsSaveMenuSync==='function')rsSaveMenuSync();return r;};
for(const [key,label]of [['rs_stairs','Restrooms — stairway descent'],['rs_left','Heart — secret left route'],['rs_right','Heart — normal right route']])reviewScenes[key]={label,level:2,chapter:true,at:'after',hint:'A separate chapter below the existing left corridor.'};
function rsPreview(scene='rs_stairs',roomId=null){
 if(!artReady)return;review.preset='explore';review.ai=false;review.damage=false;review.unlimited=false;review.music=true;review.health=100;reviewLoad(scene);
 if(roomId){player.x=3.55;player.y=2.5;player.a=Math.PI;rsEnter();const room=RW.byId?.[roomId],p=room&&rsRoomStart(room);if(p){Object.assign(player,{x:p.x,y:p.y,a:p.a,vx:0,vy:0});RS.active.z=p.z;RS.active.committed=true;_safeX=p.x;_safeY=p.y;rsUpdate(0);}}
}
const rsReady=tfReady;tfReady=function(){
 rsReady();for(const [id,scene]of [['restroomPreview','rs_stairs'],['restroomLeft','rs_left'],['restroomRight','rs_right']]){$(id).disabled=false;$(id).onclick=()=>rsPreview(scene);}
 $('restroomStartChapter').disabled=false;$('restroomStartChapter').onclick=rsStartChapter;
 $('restroomVisit').disabled=false;$('restroomVisit').onclick=()=>rsPreview('rs_stairs',$('restroomDistrictPreview').value||'P01');
 $('restroomHollow').disabled=false;$('restroomHollow').onclick=()=>rsEncounterPreview('hollow');
 if(typeof rsSaveMenuSync==='function')rsSaveMenuSync();
};
function rsCastRay(x,y,dx,dy,max=70){
 const z=RS.active.z,n=Math.ceil(max/.09);let d=max;
 for(let i=1;i<=n;i++){const t=i*max/n;if(!rsGround(x+dx*t,y+dy*t,z)||rsSolidAt(x+dx*t,y+dy*t,z,.025)){d=t;break;}}
 return{d,side:Math.abs(dx)>Math.abs(dy)?0:1,u:0,mx:Math.floor(x+dx*d),my:Math.floor(y+dy*d),type:1};
}
// The notebook records observed local plans. Distant fold destinations are
// labelled connections, never a fictitious single metric floor plan.
const rsMapDraw=wfDrawMap;wfDrawMap=function(c,w,h,local=false){
 if(!rsRunning())return rsMapDraw(c,w,h,local);const s=RS.active;
 c.clearRect(0,0,w,h);c.fillStyle='#111c1e';c.fillRect(0,0,w,h);
 const floor=local?rsFloorNumber(s.z):s.mapFloor,district=local?(RW.byId[s.room]?.district):s.mapDistrict;
 const visible=RW.surfaces.filter(r=>s.known.has(r.id)&&((r.floor||rsFloorNumber(r.z))===floor)&&(!district||r.district===district));
 if(!visible.length){c.fillStyle='#a4b9ae';c.font='12px monospace';c.fillText('No rooms recorded here.',16,28);return;}
 const bounds=[Math.min(...visible.map(r=>r.bounds[0])),Math.min(...visible.map(r=>r.bounds[1])),Math.max(...visible.map(r=>r.bounds[2])),Math.max(...visible.map(r=>r.bounds[3]))];
 const scale=local?3.5:Math.min((w-36)/Math.max(8,bounds[2]-bounds[0]),(h-42)/Math.max(8,bounds[3]-bounds[1]));
 const ox=local?w/2-player.x*scale:(w-(bounds[2]-bounds[0])*scale)/2-bounds[0]*scale,oy=local?h/2-player.y*scale:(h-(bounds[3]-bounds[1])*scale)/2-bounds[1]*scale;
 for(const r of visible){
  c.beginPath();r.poly.forEach((p,i)=>c[i?'lineTo':'moveTo'](ox+p[0]*scale,oy+p[1]*scale));c.closePath();c.fillStyle=r.water?'#29494a':'#36423e';c.fill();c.strokeStyle='#869d90';c.lineWidth=.8;c.stroke();
  if(!local&&r.room&&scale>1.5){const x=(r.bounds[0]+r.bounds[2])/2,y=(r.bounds[1]+r.bounds[3])/2;c.fillStyle='#c9cdb4';c.font='9px monospace';c.textAlign='center';c.fillText(r.name||r.id,ox+x*scale,oy+y*scale,Math.max(22,(r.bounds[2]-r.bounds[0])*scale-6));}
 }
 for(const f of RW.folds||[])if(s.anomalies.has(f.id))for(const end of [f.a,f.b])if(visible.some(r=>r.id===end.surface)){
  c.strokeStyle='#d9c59f';c.beginPath();c.arc(ox+end.x*scale,oy+end.y*scale,4,0,TAU);c.stroke();
 }
 if(floor===rsFloorNumber(s.z)&&(!district||district===RW.byId[s.room]?.district)){
  c.save();c.translate(ox+player.x*scale,oy+player.y*scale);c.rotate(player.a);c.fillStyle='#eee9bd';c.beginPath();c.moveTo(7,0);c.lineTo(-4,-4);c.lineTo(-2,0);c.lineTo(-4,4);c.closePath();c.fill();c.restore();
 }
};
function rsOrientationHint(){
 const s=RS.active,room=RW.byId[s.room];if(!room)return 'Follow the stairs into the public washroom.';
 const edges=(RW.connections||[]).filter(e=>e.a===room.id||e.b===room.id);
 const next=edges.find(e=>!s.visited.has(e.a===room.id?e.b:e.a)&&(!e.doorId||(RW.doors.find(d=>d.id===e.doorId)?.open)))||edges[0];
 if(!next)return 'Look for openings around the edge of this room.';
 const via=(next.via||[]).map(id=>RW.byId[id]).find(Boolean),other=RW.byId[next.a===room.id?next.b:next.a];
 if(!via)return s.visited.has(other?.id)?'You have a recorded connection to '+(other.name||'a familiar room')+'.':'An unexplored passage leaves this room.';
 const x=(via.bounds[0]+via.bounds[2])/2,y=(via.bounds[1]+via.bounds[3])/2,a=angle(Math.atan2(y-player.y,x-player.x)-player.a),direction=Math.abs(a)<.7?'ahead':Math.abs(a)>2.4?'behind you':a>0?'to your right':'to your left';
 return 'There is '+(s.visited.has(other?.id)?'a familiar':'an unexplored')+' connection '+direction+'.';
}
const rsMapRefresh=wfRefreshMap;wfRefreshMap=function(){
 if(!rsRunning())return rsMapRefresh();const s=RS.active,current=RW.byId[s.room];
 $('wfMapTitle').textContent='LOWER RESTROOMS / '+(s.mapFloor?'B'+s.mapFloor:'STAIRWAY');
 $('wfMapObjective').textContent=current?.name||'The stairway';
 $('wfMapNote').textContent=s.orientationAssist?rsOrientationHint():'A sketch of the rooms you have entered. Unfamiliar connections are left open.';
 const list=$('wfDestinations');list.replaceChildren();
 const floors=[...new Set(RW.surfaces.filter(r=>s.known.has(r.id)).map(r=>r.floor||rsFloorNumber(r.z)))].sort((a,b)=>a-b);
 for(const floor of floors){const b=document.createElement('button');b.className='secondary';b.textContent=floor?'B'+floor:'STAIR';b.setAttribute('aria-pressed',String(s.mapFloor===floor));b.onclick=()=>{s.mapFloor=floor;const first=RW.surfaces.find(r=>s.known.has(r.id)&&(r.floor||rsFloorNumber(r.z))===floor);s.mapDistrict=first?.district||'';wfRefreshMap();};list.append(b);}
 const districts=[...new Set(RW.surfaces.filter(r=>s.known.has(r.id)&&(r.floor||rsFloorNumber(r.z))===s.mapFloor).map(r=>r.district).filter(Boolean))];
 for(const district of districts){const b=document.createElement('button');b.className='secondary';b.textContent=(RW.districts?.[district]?.name)||district;b.setAttribute('aria-pressed',String(s.mapDistrict===district));b.onclick=()=>{s.mapDistrict=district;wfRefreshMap();};list.append(b);}
 const assist=document.createElement('button');assist.className='secondary';assist.textContent=s.orientationAssist?'HIDE ORIENTATION HINT':'ORIENTATION HINT';assist.setAttribute('aria-pressed',String(s.orientationAssist));assist.onclick=()=>{s.orientationAssist=!s.orientationAssist;wfRefreshMap();};list.append(assist);
 const w=Math.max(250,Math.min(1050,innerWidth-48)),h=Math.max(140,Math.min(620,innerHeight-245)),c=$('wfLargeMap');c.width=w;c.height=h;wfDrawMap(c.getContext('2d'),w,h);
};
