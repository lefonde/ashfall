// R3-P01: each theatre changes how the suite can be used. No kill quota.
const FV_SYSTEMS={
 OR1:{short:'CUT POWER',name:'OR 1 / POWER',action:'ISOLATE POWER',color:'#edc17b',
  hint:'Wakes the patients here. Restores the emergency supply in Recovery.'},
 OR2:{short:'VENT SPINE',name:'OR 2 / VENTILATION',action:'ACTIVATE VENTILATION',color:'#54efff',
  hint:'Stuns the large creature in the central corridor for 20s. Patients wake when the vent stops.'},
 OR3:{short:'START PURGE',name:'OR 3 / PURGE',action:'START THE PURGE',color:'#ff488d',
  hint:'12 seconds. Patients wake in stages. Opens the store return; you can move away.'}
};
const FV_RECOVERY={x:17.5,y:34.12,id:'recovery'};
function fvSystem(id){return FV.valves.find(v=>v.id===id);}
function fvControlInfo(id){
 if(id==='recovery')return {color:'#edc17b',done:FV.recoveryUsed,ready:!!fvSystem('OR1')?.closed,progress:0};
 const v=fvSystem(id);return {color:FV_SYSTEMS[id].color,done:!!v?.closed,ready:true,
  progress:id==='OR3'&&FV.purgeT>0?1-FV.purgeT/12:0};
}
function fvNearestUse(){
 if(!fvRunning()||mode!=='playing')return null;
 const targets=[...FV.valves.map(v=>({...v,y:v.y-1.38})),FV_RECOVERY];
 let target=null,nearest=2.5;
 for(const v of targets){
  const d=Math.hypot(v.x-player.x,v.y-player.y);
  if(d>=nearest||Math.abs(angle(Math.atan2(v.y-player.y,v.x-player.x)-player.a))>1.05||
     !lineOfSight(player.x,player.y,v.x,v.y))continue;
  target=v;nearest=d;
 }
 return target;
}
function fvInteract(){
 const target=fvNearestUse();if(!target)return false;
 if(target.id==='recovery'){
  if(!fvSystem('OR1').closed){feed('NO POWER / ISOLATE OR 1');return true;}
  if(FV.recoveryUsed){feed('EMERGENCY SUPPLY EMPTY');return true;}
  FV.recoveryUsed=true;player.hp=Math.min(100,player.hp+40);
  for(const g of guns)g.reserve=Math.min(g.maxReserve,g.reserve+g.mag*3);
  audio.pickup();say('TAKE A BREATH.',1.8);feed('LIFE +40 / RESERVE AMMO / CHECKPOINT');fvSave();return true;
 }
 const v=fvSystem(target.id);
 if(v.closed){feed(FV_SYSTEMS[v.id].short+' / ISOLATED');return true;}
 if(v.id==='OR3'&&FV.purgeT>0){feed('PURGE RUNNING / KEEP MOVING');return true;}
 if(v.id==='OR1'){
  FV.blackoutT=2.4;fvFinishSystem(v);
  say('THE LIGHTS GO FIRST.',2);feed('RECOVERY SUPPLY RESTORED');
 }else if(v.id==='OR2'){
  FV.ventT=20;
  if(FV.orderly){FV.orderly.windup=FV.orderly.charge=0;FV.orderly.cd=1.2;}
  fvFinishSystem(v);audio.play('environment1',{pos:{x:27.5,y:32.5},vol:.85,rate:.7,wet:.7});
  say('THE SPINE IS BREATHING.',2);feed('ORDERLY SUPPRESSED / 20 SECONDS');
 }else{
  FV.purgeT=12;FV.purgeStep=0;fvWake('OR3',0);FV.purgeStep=1;
  fvLights();audio.play('machinery',{pos:v,vol:.6,wet:.45,rate:1.15});
  say('DO NOT WAIT BESIDE IT.',2);feed('PURGE RUNNING / STORE RETURN WILL OPEN');fvSave();
 }
 fvHud();return true;
}
function fvFinishSystem(v,silent=false){
 if(!v||v.closed)return;
 v.closed=true;FV.closed++;
 if(v.id==='OR3')fvOpenReturn();
 if(!silent){whiteFlash=.06;shake=Math.max(shake,3.2);audio.play('seal',{vol:.6,pos:v,wet:.9,rate:.62});}
 if(FV.closed>=3){cleared=true;fvOpenAirlock();if(!silent){say('LOOP ISOLATED',2.6);feed('AIRLOCK RELEASED / VESTIBULE');}}
 fvLights();fvSetObjective();if(!silent)fvSave();
}
function fvWake(id,slot=null){
 let first=null;
 for(const e of enemies)if(e.fvSleep===id&&e.alive&&e.dormant&&(slot===null||e.fvSlot===slot)){
  e.dormant=false;e.noticed=true;e.cd=1;e.alertT=.45;first=first||e;
 }
 if(first){audio.creature(first,true);FV.tension=1;audio.tension(1);}
}
function fvOpenReturn(){
 FV.returnOpen=true;for(const x of [49,50,51])map[47][x]=0;
 for(const p of environmentProps)if(p.fvReturn)p.label='RETURN / OPEN';
 buildFlow();
}
function fvSystemTick(dt){
 if(FV.blackoutT>0){FV.blackoutT=Math.max(0,FV.blackoutT-dt);if(!FV.blackoutT)fvWake('OR1');}
 if(FV.ventT>0){
  FV.ventT=Math.max(0,FV.ventT-dt);
  if(FV.orderly&&FV.orderly.alive){FV.orderly.windup=FV.orderly.charge=0;FV.orderly.cower=.45;}
  if(!FV.ventT){
   if(FV.orderly){FV.orderly.cower=0;FV.orderly.cd=1.2;}
   fvWake('OR2');fvLights();feed('VENT STOPPED / THE SPINE IS LIVE');
  }
 }
 if(FV.purgeT>0){
  FV.purgeT=Math.max(0,FV.purgeT-dt);
  for(;FV.purgeStep<3&&12-FV.purgeT>=FV.purgeStep*4;FV.purgeStep++)fvWake('OR3',FV.purgeStep);
  if(!FV.purgeT){fvFinishSystem(fvSystem('OR3'));if(FV.closed<3){say('PURGE COMPLETE',2);feed('STORE RETURN OPEN / SOUTH HATCH');}}
 }
}
function fvSuppressed(e){return fvRunning()&&e.fvHold&&FV.ventT>0;}
function fvRoomMix(hot=FV.tension){
 if(!audio.ctx||!audio.musicBed)return;
 const recovery=fvIn(player.x,player.y,10,34,25,47),zone=recovery&&!hot?'recovery':hot?'combat':'ward';
 if(zone===FV.mixZone)return;FV.mixZone=zone;
 const t=audio.ctx.currentTime;
 audio.musicBed.gain.setTargetAtTime(zone==='recovery'?.09:zone==='combat'?1:.26,t,.65);
 if(audio.thr){audio.thr.hum.gain.setTargetAtTime(zone==='recovery'?.045:.17,t,.65);audio.thr.vent.gain.setTargetAtTime(zone==='recovery'?.055:.20,t,.65);}
}
function fvCompassTarget(){
 if(FV.closed>=3)return exit;
 const list=FV.valves.filter(v=>!v.closed&&!(v.id==='OR3'&&FV.purgeT>0));
 return list.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]||fvSystem('OR3');
}
function fvHud(){
 const on=fvRunning()&&mode==='playing';
 $('fvStatus').classList.toggle('hidden',!on);
 if(on){
  const beats=[];
  if(FV.ventT>0)beats.push('SPINE SUPPRESSED '+Math.ceil(FV.ventT)+'s');
  if(FV.purgeT>0)beats.push('PURGE '+Math.ceil(FV.purgeT)+'s / KEEP MOVING');
  if(!beats.length)beats.push(FV.returnOpen?'STORE RETURN OPEN':FV.closed?'Choose your next system · M opens the map':'Find a labelled control in each operating room. '+(coarse?'Tap USE.':'[E] to use.'));
  $('fvStatus').textContent=beats.join(' · ');
 }
 const p=on?fvNearestUse():null;
 $('interactPrompt').classList.toggle('hidden',!p);$('touchUse').classList.toggle('hidden',!p);
 if(!p)return;
 const info=fvControlInfo(p.id),system=FV_SYSTEMS[p.id];
 const action=p.id==='recovery'?(info.done?'SUPPLY EMPTY':info.ready?'TAKE EMERGENCY SUPPLY':'NO POWER / ISOLATE OR 1'):
  info.done?'SYSTEM ISOLATED':p.id==='OR3'&&FV.purgeT>0?'PURGE RUNNING':system.action;
 $('interactAction').textContent=(info.done||!info.ready||info.progress>0?'':coarse?'USE · ':'[E] ')+action;
 touchSetLabel('touchUse',info.done?'DONE':p.id==='OR3'&&FV.purgeT>0?'RUNNING':'USE');
 $('interactHint').textContent=p.id==='recovery'?'One use: +40 life, reserve ammunition and a checkpoint.':system.hint;
 $('interactPrompt').style.borderColor=info.color;
}

