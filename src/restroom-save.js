// Versioned chapter checkpoints and the earned sewer arrival anchor. Rebuild
// authored worlds; never serialize the parked runtime or live audio nodes.
const RS_SAVE_KEY='ashfall-lower-restrooms-v1';
const RS_SAVE_BACKUP_KEY=RS_SAVE_KEY+'-previous';
const RS_SAVE_WORLD='lower-restrooms-84-v1';
const RS_SAVE_PITCH_LIMIT=88*Math.PI/180;
let rsSaveRestoring=false;
let rsRetryCheckpoint=null,rsLastDeathInRestrooms=false;
const rsSaveStatus={available:false,failed:false,failure:'',phase:'',lastReason:'',suppressed:false};
// Disk text is still checked on explicit reads (including external edits), but
// each unchanged generation is parsed and validated only once in this runtime.
const rsSaveCache={current:{text:undefined,envelope:null},previous:{text:undefined,envelope:null},encoded:new WeakMap(),last:null,payloadText:'',frame:-1};

function rsSaveHash(text){
 let h=2166136261;
 for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}
 return (h>>>0).toString(16).padStart(8,'0');
}
function rsSaveNumber(v,lo,hi){return typeof v==='number'&&Number.isFinite(v)&&v>=lo&&v<=hi;}
function rsSaveID(v){return typeof v==='string'&&/^[A-Za-z0-9_-]{1,96}$/.test(v)&&!['__proto__','constructor','prototype'].includes(v);}
function rsSaveIDs(v,max=1024){return Array.isArray(v)&&v.length<=max&&v.every(rsSaveID)&&new Set(v).size===v.length;}
function rsSaveRecord(v,max=512){
 return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length<=max&&
  Object.entries(v).every(([k,value])=>rsSaveID(k)&&typeof value==='boolean');
}
function rsSaveCopyRecord(v){
 const out={};
 for(const [key,value]of Object.entries(v||{}))if(rsSaveID(key)&&typeof value==='boolean')out[key]=value;
 return out;
}
function rsSavePose(v,withZ=false){
 return !!v&&rsSaveNumber(v.x,-100000,100000)&&rsSaveNumber(v.y,-100000,100000)&&
  rsSaveNumber(v.a,-Math.PI-.001,Math.PI+.001)&&rsSaveNumber(v.pitch,-1000,1000)&&(!withZ||rsSaveNumber(v.z,-1000,1000))&&
  (!Object.prototype.hasOwnProperty.call(v,'pitchAngle')||rsSaveNumber(v.pitchAngle,-RS_SAVE_PITCH_LIMIT,RS_SAVE_PITCH_LIMIT));
}
function rsSavePayloadValid(p){
 if(!p||typeof p!=='object'||!['restrooms','aftermath','sewer'].includes(p.phase))return false;
 if(Object.prototype.hasOwnProperty.call(p,'sewerOpen')&&typeof p.sewerOpen!=='boolean')return false;
 if(!p.transfer||p.transfer.status!=='complete'||![null,1,2].includes(p.transfer.entryChapter))return false;
 if(!rsSaveRecord(p.flags,128)||!p.run||!rsSavePose(p.pose,p.phase==='restrooms'))return false;
 const v=p.run;
 if(!rsSaveNumber(v.hp,.001,1000)||!Number.isInteger(v.weapon)||v.weapon<0||v.weapon>=guns.length||
  !Number.isInteger(v.difficulty)||v.difficulty<0||v.difficulty>2)return false;
 if(!v.mods||!['damage','speed','life','reload','dash'].every(k=>rsSaveNumber(v.mods[k],.01,100)))return false;
 for(const k of ['gameTime','stageTime','kills','stageKills','score','maxCombo','enemyId'])if(!rsSaveNumber(v[k],0,1e12))return false;
 if(!Array.isArray(v.ammo)||v.ammo.length!==guns.length||!v.ammo.every((g,i)=>g&&
  Number.isInteger(g.ammo)&&g.ammo>=0&&g.ammo<=guns[i].mag&&
  Number.isInteger(g.reserve)&&g.reserve>=0&&g.reserve<=100000))return false;
 if(p.phase==='sewer')return p.complete===true&&p.sewerOpen===true;
 if(p.phase==='aftermath')return p.complete===true;
 const s=p.scene;
 if(p.complete!==false||!s||!rsSaveID(s.room)||!rsSaveIDs(s.visited)||!rsSaveIDs(s.known)||
  !rsSaveIDs(s.anomalies,64)||!rsSaveRecord(s.doorState)||!rsSaveRecord(s.shortcutState,128))return false;
 if(typeof s.committed!=='boolean'||typeof s.orientationAssist!=='boolean'||
  !rsSaveNumber(s.clock,0,1e12)||!rsSaveNumber(s.steps,0,1000)||!rsSaveNumber(s.take,0,1e12)||
  !rsSaveNumber(s.folds,0,1e9)||!rsSaveNumber(s.mapFloor,-32,32)||
  !(s.mapDistrict===''||rsSaveID(s.mapDistrict)))return false;
 if(Object.prototype.hasOwnProperty.call(s,'encounters')&&
  (typeof rsEncountersValid!=='function'||!rsEncountersValid(s.encounters)))return false;
 return true;
}
function rsSaveDecode(text){
 if(typeof text!=='string'||text.length>262144)return null;
 try{
  const e=JSON.parse(text);
  if(e?.format!=='ashfall-restroom-checkpoint'||e.version!==1||e.world!==RS_SAVE_WORLD||
   !Number.isSafeInteger(e.serial)||e.serial<1||!rsSaveNumber(e.savedAt,0,9e15)||
   e.hash!==rsSaveHash(JSON.stringify(e.payload))||!rsSavePayloadValid(e.payload))return null;
  return e;
 }catch{return null;}
}
function rsSaveRead(){
 if(rsSaveStatus.suppressed)return null;
 try{
  const read=(key,slot)=>{const text=localStorage.getItem(key);if(text!==slot.text){slot.text=text;slot.envelope=rsSaveDecode(text);if(slot.envelope)rsSaveCache.encoded.set(slot.envelope,text);}return slot.envelope;};
  const current=read(RS_SAVE_KEY,rsSaveCache.current),previous=read(RS_SAVE_BACKUP_KEY,rsSaveCache.previous);
  return !current?previous:!previous?current:current.serial>=previous.serial?current:previous;
 }catch{return null;}
}
function rsResumeAvailable(){
 const saved=rsSaveRead();rsSaveStatus.available=!!saved;rsSaveStatus.phase=saved?.payload.phase||'';
 return rsSaveStatus.available;
}
function rsSaveMenuSync(knownEnvelope){
 const saved=arguments.length?knownEnvelope:rsSaveRead();
 rsSaveStatus.available=!!saved;rsSaveStatus.phase=saved?.payload.phase||'';
 const available=rsSaveStatus.available,button=$('restroomContinue'),note=$('restroomSaveNote');
 if(button){button.classList.toggle('hidden',!available);button.disabled=!available||!artReady;button.onclick=rsRestoreSaved;
  button.textContent=rsSaveStatus.phase==='sewer'?'CONTINUE FROM THE SEWER':rsSaveStatus.phase==='aftermath'?'CONTINUE AT THE HOSPITAL':'CONTINUE THE DESCENT';}
 if(note){note.textContent=rsSaveStatus.failed?(rsSaveStatus.failure==='restore'?'Your saved place could not be restored.':'Your browser could not keep this checkpoint.'):
  available?(rsSaveStatus.phase==='sewer'?'Your emergence from the sewer is saved.':rsSaveStatus.phase==='aftermath'?'Your return to the hospital is saved.':'Your place in the Lower Restrooms is saved.'):'';
  note.classList.toggle('hidden',!note.textContent);}
 return available;
}
function rsSaveSnapshot(){
 if(rsSaveRestoring||review.active||player.hp<=0||!Number.isFinite(aimPitch))return null;
 const s=RS.active;
 const sewer=!s&&typeof rsSewerCanSave==='function'&&rsSewerCanSave();
 if(!sewer&&(!hwRunning()||!HW.resolved||HB.state!=='dead'))return null;
 if(!s&&(!RS.campaign.complete||!sewer&&HW.ending))return null;
 const p={phase:s?'restrooms':sewer?'sewer':'aftermath',complete:!s,sewerOpen:!!RS.campaign.sewerOpen,
  transfer:{status:TF.campaign.status,entryChapter:TF.campaign.entryChapter??null},
  flags:rsSaveCopyRecord(CH.flags),pose:{x:player.x,y:player.y,a:angle(player.a),pitch:s?clamp(aimPitch,-1000,1000):aimPitch},
  run:{hp:player.hp,weapon,difficulty,mods:{damage:mods.damage,speed:mods.speed,life:mods.life,reload:mods.reload,dash:mods.dash},
   ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve})),gameTime,stageTime,kills,stageKills,score,maxCombo,enemyId}};
 // The optional angle extends v1 without invalidating beta 0.2.4 checkpoints.
 // A bounded legacy pixel offset keeps the payload readable by older builds;
 // the angle preserves the view across resolution changes and phone rotation.
 if(s){p.pose.z=s.z;p.pose.pitchAngle=Math.atan2(aimPitch,rsAimProjection());p.scene={clock:s.clock,steps:s.steps,take:s.take,committed:!!s.committed,folds:s.folds,
  visited:[...s.visited],known:[...s.known],room:s.room,doorState:rsSaveCopyRecord(s.doorState),
  anomalies:[...(s.anomalies||[])],shortcutState:rsSaveCopyRecord(s.shortcutState),
  mapFloor:Number.isFinite(s.mapFloor)?s.mapFloor:Math.max(0,Math.round(-s.z/3.4)),
  mapDistrict:s.mapDistrict||'',orientationAssist:!!s.orientationAssist};
  if(typeof rsEncountersSnapshot==='function')p.scene.encounters=rsEncountersSnapshot(s);
 }
 return rsSavePayloadValid(p)?p:null;
}
function rsSaveCheckpoint(reason='checkpoint'){
 const payload=rsSaveSnapshot();if(!payload)return false;
 // The exterior uses its authored Journey retry in memory. Persist its sewer
 // arrival anchor once: saving later resources against a reconstructed arrival
 // would revive collected supplies and defeated enemies after a page reload.
 if(payload.phase==='sewer'&&reason!=='sewer-arrival')return false;
 rsSaveStatus.suppressed=false;
 const old=rsSaveRead(),payloadText=JSON.stringify(payload);
 // Collapse only an identical generation in this frame. A second hit, changed
 // resources or a changed milestone still writes immediately, even this frame.
 if(old&&old===rsSaveCache.last&&old===rsSaveCache.current.envelope&&rsSaveCache.frame===nowTime&&payloadText===rsSaveCache.payloadText){
  rsRetryCheckpoint=old;rsSaveStatus.failed=false;rsSaveStatus.failure='';rsSaveStatus.lastReason=String(reason).slice(0,80);rsSaveMenuSync(old);return true;
 }
 const envelope={format:'ashfall-restroom-checkpoint',version:1,world:RS_SAVE_WORLD,
  savedAt:Date.now(),serial:Math.min((old?.serial||0)+1,Number.MAX_SAFE_INTEGER),payload,hash:rsSaveHash(payloadText)};
 // Reuse the one payload encoding for both checksum and persisted envelope.
 const header=JSON.stringify({format:envelope.format,version:envelope.version,world:envelope.world,savedAt:envelope.savedAt,serial:envelope.serial});
 const encoded=header.slice(0,-1)+',"payload":'+payloadText+',"hash":'+JSON.stringify(envelope.hash)+'}';
 // A denied storage write must not send a killed Restrooms player back into
 // the Heart. This finite in-memory generation serves only the current retry.
 rsRetryCheckpoint=envelope;
 try{
  // setItem is atomic per key. Keep a validated previous generation before
  // replacing the current one, so truncation/corruption can fall back safely.
  if(old){const previous=rsSaveCache.encoded.get(old);localStorage.setItem(RS_SAVE_BACKUP_KEY,previous);rsSaveCache.previous={text:previous,envelope:old};}
  localStorage.setItem(RS_SAVE_KEY,encoded);
  rsSaveCache.current={text:encoded,envelope};rsSaveCache.encoded.set(envelope,encoded);rsSaveCache.last=envelope;rsSaveCache.payloadText=payloadText;rsSaveCache.frame=nowTime;
  rsSaveStatus.failed=false;rsSaveStatus.failure='';rsSaveStatus.available=true;rsSaveStatus.lastReason=String(reason).slice(0,80);
  rsSaveMenuSync(envelope);return true;
 }catch{rsSaveStatus.failed=true;rsSaveStatus.failure='write';rsSaveMenuSync();return false;}
}
function rsClearSave(){
 rsRetryCheckpoint=null;rsLastDeathInRestrooms=false;
 rsSaveCache.last=null;rsSaveCache.payloadText='';rsSaveCache.frame=-1;
 rsSaveStatus.suppressed=true;rsSaveStatus.available=false;rsSaveStatus.failed=false;rsSaveStatus.failure='';
 let ok=true;
 for(const key of [RS_SAVE_KEY,RS_SAVE_BACKUP_KEY])try{localStorage.removeItem(key);}catch{ok=false;}
 rsSaveMenuSync();return ok;
}
function rsSaveSurface(id){return RW.byId instanceof Map?RW.byId.get(id):RW.byId?.[id]||RW.surfaces.find(s=>s.id===id);}
function rsSaveSafeRoomPose(id){
 const room=rsSaveSurface(id);if(!room)return null;
 return room.safePose||(typeof rsRoomStart==='function'&&room.room?rsRoomStart(room):null)||
  (room.spawn?{...room.spawn,z:room.z}:null);
}
function rsSaveRecoverPose(p,saved){
 const candidates=[()=>p,()=>rsSaveSafeRoomPose(saved.room),
  ...[...saved.visited].reverse().map(id=>()=>rsSaveSafeRoomPose(id)),()=>rsSaveSafeRoomPose('P01'),()=>RW.entry];
 for(const getPose of candidates){const q=getPose();
  if(!q||!Number.isFinite(q.x)||!Number.isFinite(q.y)||!Number.isFinite(q.z))continue;
  RS.active.z=q.z;
  if(!rsCanStand(q.x,q.y,q.z))continue;
  player.x=q.x;player.y=q.y;player.a=angle(Number.isFinite(q.a)?q.a:p.a);
  aimPitch=q===p?(Object.prototype.hasOwnProperty.call(p,'pitchAngle')?Math.tan(p.pitchAngle)*rsAimProjection():p.pitch):0;
  RS.active.z=rsFloor(rsGround(q.x,q.y,q.z),q.x,q.y);return true;
 }
 return false;
}
function rsSaveApplyRun(v){
 for(const key of ['damage','speed','life','reload','dash'])mods[key]=v.mods[key];
 guns.forEach((g,i)=>{g.ammo=v.ammo[i].ammo;g.reserve=v.ammo[i].reserve;});
 player.hp=v.hp;weapon=v.weapon;gameTime=v.gameTime;stageTime=v.stageTime;kills=v.kills;stageKills=v.stageKills;
 score=v.score;maxCombo=v.maxCombo;enemyId=v.enemyId;combo=comboT=0;
}
function rsRestoreSaved(retryEnvelope=null){
 if(!artReady||rsSaveRestoring)return false;
 const envelope=retryEnvelope===rsRetryCheckpoint&&retryEnvelope?retryEnvelope:rsSaveRead();if(!envelope){rsSaveMenuSync();return false;}
 const p=envelope.payload,v=p.run;
 // The chapter envelope and earned progress remain v1. The independently
 // versioned encounter schedule filters retired content and upgrades once,
 // before a resumed frame can select a threat or repeat a migration on reload.
 const upgradeEncounters=p.phase==='restrooms'&&p.scene.encounters?.version!==3;
 let restored=false;
 rsSaveRestoring=true;
 try{
  releaseInputs();audio.reset();if(rsRunning())rsLeave(false,true);
  review.active=false;useChapter=true;
  RS.campaign={complete:p.complete,sewerOpen:!!p.sewerOpen};TF.campaign={status:p.transfer.status,entryChapter:p.transfer.entryChapter};CH.flags={...p.flags,transfer:true};
  settings.difficulty=v.difficulty;applyDifficulty();
  if(p.phase==='sewer'){
   if(typeof rsSewerArrive!=='function'||!rsSewerArrive({hp:v.hp,weapon:v.weapon,ammo:v.ammo.map(g=>({...g})),
    mods:{...v.mods},score:v.score,kills:v.kills,gameTime:v.gameTime,maxCombo:v.maxCombo},{restore:true}))throw Error('Saved sewer route is unavailable');
   rsSaveApplyRun(v);aimPitch=p.pose.pitch;
  }else{
  loadStage(2);hbSkip();
  // The Heart is already dead. A fresh escort would repeat the story and could
  // alter the selected corridor; retain only its absence in the host scene.
  HW.restroomUnlocked=true;HW.ending=false;HW.arrival=0;
  if(HW.warden){HW.warden.wgGone=true;HW.warden.wgFading=false;HW.warden.wgFade=0;HW.warden.alive=false;HW.warden.death=0;}
  enemies=enemies.filter(e=>e.alive&&e.type!==3);drops=[];bullets=[];particles=[];rings=[];decals=[];tracers=[];numbers=[];
  rsSaveApplyRun(v);
  rsHostDoor();
  player.x=3.2;player.y=2.5;player.a=Math.PI;aimPitch=0;
  hwSave();
  if(p.phase==='restrooms'){
   rsEnter();const s=RS.active,saved=p.scene;
   Object.assign(s,{clock:saved.clock,steps:saved.steps,take:saved.take,committed:saved.committed,folds:saved.folds,
    visited:new Set(saved.visited),known:new Set(saved.known),room:saved.room,doorState:{...saved.doorState},
    anomalies:new Set(saved.anomalies),shortcutState:{...saved.shortcutState},mapFloor:saved.mapFloor,
    mapDistrict:saved.mapDistrict,orientationAssist:saved.orientationAssist,fade:0,foldCooldown:.75});
   for(const door of RW.doors||[])if(Object.prototype.hasOwnProperty.call(saved.doorState,door.id))rsDoorSet(door,saved.doorState[door.id]);
   if(!rsSaveRecoverPose(p.pose,saved))throw Error('Saved floor is unavailable');
   if(Object.prototype.hasOwnProperty.call(saved,'encounters')&&
    (typeof rsEncountersRestore!=='function'||!rsEncountersRestore(saved.encounters,s)))throw Error('Saved encounter is unavailable');
   s.lastSurface=rsGround(player.x,player.y,s.z)?.id||s.room;s.lastSave=s.clock;
  }else{
   player.x=p.pose.x;player.y=p.pose.y;player.a=p.pose.a;aimPitch=p.pose.pitch;
   if(!fits(player.x,player.y)){player.x=54.3;player.y=2.5;player.a=0;aimPitch=0;}
  }
  }
  player.vx=player.vy=0;_safeX=player.x;_safeY=player.y;
  dashT=dashCD=meleeT=meleeCD=shotCD=reloadT=reloadDuration=recoil=muzzle=shake=hurt=hitstop=whiteFlash=hitmarker=killmarker=0;
  msgT=feedT=0;hideOverlays();mode='playing';document.body.classList.remove('testing');document.body.classList.add('playing');
  $('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');$('hud').classList.remove('hidden');$('touch').classList.remove('hidden');
  $('scoreLabel').textContent='SCORE';$('restartBtn').textContent='RESTART RUN';$('retryBtn').textContent='RETRY CHECKPOINT';
  if(!rsRunning()&&hwRunning())hwSave();audio.start();hudUpdate();lockPointer();
  rsRetryCheckpoint=envelope;rsLastDeathInRestrooms=false;rsSaveStatus.failed=false;rsSaveStatus.failure='';restored=true;return true;
 }catch{
  // Keep the last validated data. Return to a usable menu rather than leaving
  // input or audio owned by a half-constructed scene.
  if(rsRunning())rsLeave(false,true);releaseInputs();audio.reset();audio.pause();mode='menu';hideOverlays();
  document.body.classList.remove('playing','testing','liminal','restroom-scene');
  $('hud').classList.add('hidden');$('touch').classList.add('hidden');$('start').classList.remove('hidden');
  rsSaveStatus.failed=true;rsSaveStatus.failure='restore';return false;
 }finally{
  rsSaveRestoring=false;
  // Assign or migrate a legacy checkpoint's schedule once, before the first
  // frame. In-memory Retry also receives this generation if storage is denied.
  if(restored&&upgradeEncounters)rsSaveCheckpoint('encounter-schema-upgrade');
  rsSaveMenuSync();
 }
}
function rsWireRetry(){
 const previous=$('retryBtn').onclick;
 $('retryBtn').onclick=()=>{
  if(!review.active&&mode!=='won'&&(rsRunning()||rsLastDeathInRestrooms))return rsRestoreSaved(rsRetryCheckpoint);
  return previous?.();
 };
}
const rsSaveWireTestWard=wireTestWard;
wireTestWard=function(...args){const result=rsSaveWireTestWard(...args);rsWireRetry();return result;};
rsWireRetry();
const rsSaveFinish=finish;
finish=function(won,...args){
 if(!won&&mode==='playing'&&rsRunning()&&!review.active)rsLastDeathInRestrooms=true;
 return rsSaveFinish(won,...args);
};
addEventListener('pagehide',()=>rsSaveCheckpoint('pagehide'));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')rsSaveCheckpoint('hidden');});
