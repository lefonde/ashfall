// Durable checkpoint integration, using fresh runtimes to model page reloads.
// Native tests do not assert actual browser storage policies or phone playback.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const runtime=require('./runtime_harness.cjs');
const SOURCE=fs.readFileSync(path.join(__dirname,'../src/restroom-save.js'),'utf8');
let count=0;
function test(name,fn){if(process.env.ASHFALL_SAVE_CASE&&!name.includes(process.env.ASHFALL_SAVE_CASE))return;fn();count++;console.log('PASS '+name);}
function fresh(saved){
 const r=runtime();
 if(r.eval('typeof rsRestoreSaved')==='undefined')vm.runInContext(SOURCE,r.context);
 r.eval('artReady=true;');
 if(saved)for(const [key,value]of Object.entries(saved))r.context.localStorage.setItem(key,value);
 return r;
}
function values(r){
 const out={};for(const key of ['ashfall-lower-restrooms-v1','ashfall-lower-restrooms-v1-previous']){
  const value=r.context.localStorage.getItem(key);if(value!==null)out[key]=value;
 }return out;
}
function json(r,expr){return JSON.parse(r.eval('JSON.stringify('+expr+')'));}
// Actual beta 0.2.6 state from the old G07 encounter. Keep this as an independent
// compatibility fixture: deriving it from the new constructor could hide a
// migration that quietly expands, heals or moves the player's existing fight.
function legacyEncounter(kind='hollow'){
 const crawler=kind==='crawler',entity={id:'haunt-'+kind,kind,x:crawler?117.19999999999997:153.2000000000001,
  y:crawler?17:22.400000000000002,z:crawler?-6.38:-5.85,hp:crawler?120:155,alive:true,revealed:false,
  phase:'stalk',clock:0,phaseTime:0,age:0,normal:{x:0,y:0,z:1},forward:{x:0,y:1,z:0},yaw:0,
  roomId:'G07',radius:crawler?.5:.36,breathClock:0,stepClock:0,travel:0,routeStage:0,escapeTime:0,grace:5};
 if(crawler)entity.crawlRoute=[
  {x:117.19999999999997,y:23.58,z:-6.38,normal:{x:0,y:-1,z:0}},
  {x:117.19999999999997,y:23.58,z:-4.17,normal:{x:0,y:-1,z:0}},
  {x:117.19999999999997,y:16.42,z:-4.17,normal:{x:0,y:0,z:-1}},
  {x:117.19999999999997,y:16.42,z:-6.38,normal:{x:0,y:1,z:0}}];
 return {version:1,seed:91337,seenRooms:['G07'],
  opportunities:[{id:entity.id,kind,roomId:'G07',status:'spent'}],entities:[entity]};
}
function withEncounterPayload(r,encounters){
 assert(r.eval('rsSaveCheckpoint("fixture-base")'));
 const e=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);e.payload.scene.encounters=encounters;
 e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
 return {'ashfall-lower-restrooms-v1':JSON.stringify(e)};
}
function campaign(){
 const r=fresh();r.eval(`startRun();TF.campaign={status:'complete',entryChapter:2};CH.flags={transfer:true,annexe:true};
  loadStage(2);hbSkip();player.x=3.2;player.y=2.5;player.a=Math.PI;rsEnter();releaseInputs();
  const saveTestRoom=RW.surfaces.find(s=>s.id==='P01')||RW.surfaces.find(s=>s.id==='public');
  const saveTestPose=saveTestRoom.safePose||{x:5.5,y:22,z:saveTestRoom.z,a:0};
  Object.assign(player,{x:saveTestPose.x,y:saveTestPose.y,a:saveTestPose.a,vx:0,vy:0});RS.active.z=saveTestPose.z;
  RS.active.room=saveTestRoom.id;RS.active.visited.add(saveTestRoom.id);RS.active.known.add(saveTestRoom.id);
  RS.active.committed=true;RS.active.clock=618.25;RS.active.take=94;RS.active.steps=.64;RS.active.folds=3;
  RS.active.doorState={'door-P01-stall-0':true};RS.active.shortcutState={'court-return':true};
  const saveTestDoor=(RW.doors||[]).find(d=>!d.initialOpen)||(RW.doors||[])[0];
  if(saveTestDoor){rsDoorSet(saveTestDoor,true);RS.active.doorState[saveTestDoor.id]=true;}
  RS.active.anomalies=new Set(['damaged-basin','wrong-height']);RS.active.mapFloor=1;RS.active.mapDistrict='public';RS.active.orientationAssist=true;
  player.hp=37;aimPitch=.08;weapon=1;guns[0].ammo=2;guns[0].reserve=17;guns[1].ammo=13;guns[1].reserve=24;
  mods.speed=1.15;mods.damage=1.25;mods.reload=.8;score=11935;kills=42;maxCombo=9;stageKills=18;gameTime=1836.4;stageTime=265.8;
 `);
 assert(r.eval('rsCanStand(player.x,player.y,RS.active.z)'));
 return r;
}
function activeEncounter(r){
 r.eval(`const encounterRoom=RW.byId.R05,encounterPose=encounterRoom.safePose||rsRoomStart(encounterRoom);
  Object.assign(player,{x:encounterPose.x,y:encounterPose.y,a:encounterPose.a,vx:0,vy:0});RS.active.z=encounterPose.z;
  RS.active.room=encounterRoom.id;RS.active.visited.add(encounterRoom.id);RS.active.known.add(encounterRoom.id);
  const savedCreature=rsEncounterCreate('hollow',encounterRoom.id);
  if(!savedCreature)throw Error('Hollow encounter fixture could not spawn');
  savedCreature.grace=4;savedCreature.breathClock=0;
  RS.active.encounters={version:3,seed:91337,seenRooms:[encounterRoom.id],
   opportunities:[{id:savedCreature.id,kind:'hollow',roomId:encounterRoom.id,status:'spent'}],entities:[savedCreature]};
  RS.campaign.encounters=RS.active.encounters;
 `);
 assert(r.eval('rsEncountersValid(RS.active.encounters)'));
}
// Removed actors exist only in compatibility fixtures. These beta 0.2.7
// coordinates/body values were captured from that release, independently of
// the current runtime. They must never reconstruct a live enemy in this build.
function removedV2Encounter(){
 const coords=[[.75,177.8],[11.250000000000002,176.75],[9.15,176.75],[9.15,188.30000000000013],[11.250000000000002,184.10000000000008]];
 const entities=coords.map(([x,y],member)=>{
  const horizontal=member===0;
  const crawlRoute=horizontal?[
   {x:11.709999999999999,y,z:-9.91,normal:{x:-1,y:0,z:0}},
   {x:11.709999999999999,y,z:-8.069999999999999,normal:{x:-1,y:0,z:0}},
   {x:.29,y,z:-8.069999999999999,normal:{x:0,y:0,z:-1}},
   {x:.29,y,z:-9.91,normal:{x:1,y:0,z:0}}]:[
   {x,y:176.29,z:-9.91,normal:{x:0,y:1,z:0}},
   {x,y:176.29,z:-8.069999999999999,normal:{x:0,y:1,z:0}},
   {x,y:189.71,z:-8.069999999999999,normal:{x:0,y:0,z:-1}},
   {x,y:189.71,z:-9.91,normal:{x:0,y:-1,z:0}}];
  return {id:'haunt-crawler'+(member?'-'+member:''),groupId:'haunt-crawler',member,kind:'crawler',x,y,z:-9.91,
   hp:260,alive:true,revealed:false,phase:'stalk',clock:0,phaseTime:0,age:0,normal:{x:0,y:0,z:1},
   forward:{x:0,y:1,z:0},yaw:0,roomId:'C07',radius:.3,scale:.58,height:.67,breathClock:1.8+member*.11,
   stepClock:0,travel:0,routeStage:member%2?0:4,escapeTime:0,grace:2.7+member*.24,retreatUntil:0,
   retreatCooldown:0,surfaceRoute:null,surfaceStage:0,crawlRoute};
 });
 return {version:2,seed:49271,seenRooms:['C07'],opportunities:[{id:'haunt-crawler',kind:'crawler',roomId:'C07',status:'spent'}],entities};
}
function placeInRoom(r,id){
 r.eval(`const resumeRoom=RW.byId[${JSON.stringify(id)}],resumePose=resumeRoom.safePose||rsRoomStart(resumeRoom);
  Object.assign(player,{x:resumePose.x,y:resumePose.y,a:resumePose.a,vx:0,vy:0});RS.active.z=resumePose.z;
  RS.active.room=resumeRoom.id;RS.active.visited.add(resumeRoom.id);RS.active.known.add(resumeRoom.id);`);
 assert(r.eval('rsCanStand(player.x,player.y,RS.active.z)'));
}
function runResources(r){return json(r,'({hp:player.hp,kills,stageKills,score,ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve}))})');}
test('checkpoint stores only canonical state, never geometry, nodes, or host object',()=>{
 const r=campaign();assert(r.eval('rsSaveCheckpoint("room")'));
 const e=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);
 assert.equal(e.version,1);assert.equal(e.world,'lower-restrooms-84-v1');
 assert.equal(e.payload.phase,'restrooms');assert.equal(e.payload.run.hp,37);
 assert(!('host' in e.payload.scene));assert(!('map' in e.payload));assert(!('audio' in e.payload));
 assert(JSON.stringify(e).length<8192);
});
test('fresh page restores pose, inventory, upgrades, exploration and persistent anomalies',()=>{
 const r=campaign();assert(r.eval('rsSaveCheckpoint("fold")'));
 const before=json(r,'rsSaveSnapshot()'),next=fresh(values(r));
 assert(next.eval('rsResumeAvailable()'));assert(next.eval('rsRestoreSaved()'));
 const after=json(next,'rsSaveSnapshot()');
 assert.deepEqual(after,before);assert.equal(next.eval('mode'),'playing');assert(next.eval('RS.active.visited instanceof Set'));
 assert(next.eval('RS.active.known instanceof Set&&RS.active.anomalies instanceof Set'));
 assert.equal(next.eval('player.vx'),0);assert.equal(next.eval('player.vy'),0);
});
test('restored host has a dead Heart, absent Warden, secret route, and no live pursuers',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("room")');const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 assert(next.eval('HW.resolved&&HB.state==="dead"&&HW.restroomUnlocked'));
 assert(next.eval('HW.warden.wgGone&&!HW.warden.alive'));
 assert.equal(next.eval('TF.campaign.status'),'complete');assert.equal(next.eval('TF.campaign.entryChapter'),2);
 assert(next.eval('CH.flags.annexe&&CH.flags.transfer'));
 assert(next.eval('RS.active.host.enemies.every(e=>!e.alive)'));
 assert.equal(next.eval('score'),11935);
});
test('saved open door restores its rendered geometry and disabled collision before movement resumes',()=>{
 const r=campaign();assert(r.eval('!!saveTestDoor'));
 const id=r.eval('saveTestDoor.id');r.eval('rsSaveCheckpoint("door")');
 const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 next.eval('const resumedDoor=RW.doors.find(d=>d.id==='+JSON.stringify(id)+');');
 assert(next.eval('resumedDoor.open&&RS.active.doorState[resumedDoor.id]'));
 assert(next.eval('resumedDoor.solidIndices.every(i=>RW.solids[i].disabled)'));
 assert(next.eval('resumedDoor.faceIndices.every(i=>JSON.stringify(RW.faces[i].v)===JSON.stringify(RW.faces[i].openV))'));
});
test('an obstructed saved pose recovers inside the recorded room while retaining campaign progress',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("room")');
 const data=values(r),e=JSON.parse(data['ashfall-lower-restrooms-v1']);
 e.payload.pose.x=90000;e.payload.pose.y=90000;e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
 data['ashfall-lower-restrooms-v1']=JSON.stringify(e);
 const next=fresh(data);assert(next.eval('rsRestoreSaved()'));
 assert(next.eval('rsCanStand(player.x,player.y,RS.active.z)'));assert.equal(next.eval('RS.active.room'),e.payload.scene.room);
 assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('RS.active.folds'),3);assert(next.eval('RS.active.committed'));
});
test('test previews neither overwrite nor clear an existing campaign checkpoint',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("room")');const before=JSON.parse(values(r)['ashfall-lower-restrooms-v1']).payload;
 r.eval('rsPreview("rs_stairs");player.hp=99;');
 // Entering preview may checkpoint the live campaign before scene ownership
 // changes. Once in preview, neither lifecycle nor menu actions may write it.
 const atPreview=values(r);assert.deepEqual(JSON.parse(atPreview['ashfall-lower-restrooms-v1']).payload,before);
 assert(!r.eval('rsSaveCheckpoint("pagehide")'));assert.deepEqual(values(r),atPreview);
 r.eval('reviewLeave();');assert.deepEqual(values(r),atPreview);assert(r.eval('rsResumeAvailable()'));
});
test('corrupt current generation falls back to the previous validated checkpoint',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one");player.hp=23;rsSaveCheckpoint("two");');
 const data=values(r);data['ashfall-lower-restrooms-v1']='{broken';
 const next=fresh(data);assert(next.eval('rsRestoreSaved()'));assert.equal(next.eval('player.hp'),37);
});
test('cached generations encode once, coalesce identical frames and retain immediate changed-state durability',()=>{
 const r=campaign();assert(r.eval('rsSaveCheckpoint("cache-base")'));
 const initial=JSON.parse(values(r)['ashfall-lower-restrooms-v1']),write=r.context.localStorage.setItem;
 let writes=0;r.context.localStorage.setItem=(key,value)=>{writes++;write(key,value);};
 r.eval(`const countSaveDecode=rsSaveDecode;let saveDecodeCalls=0;rsSaveDecode=function(...args){saveDecodeCalls++;return countSaveDecode(...args);};
  const countSaveStringify=JSON.stringify;let savePayloadEncodes=0;JSON.stringify=function(value,...args){if(value?.phase==='restrooms'&&value?.run)savePayloadEncodes++;return countSaveStringify(value,...args);};`);
 assert(r.eval('rsSaveCheckpoint("same-frame-copy")'));assert.equal(writes,0);
 assert.equal(r.eval('saveDecodeCalls'),0);assert.equal(r.eval('savePayloadEncodes'),1);
 r.eval('player.hp-=7;savePayloadEncodes=0;');assert(r.eval('rsSaveCheckpoint("same-frame-hit")'));
 assert.equal(writes,2);assert.equal(r.eval('saveDecodeCalls'),0);assert.equal(r.eval('savePayloadEncodes'),1);
 const changed=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);assert.equal(changed.serial,initial.serial+1);
 assert.equal(changed.payload.run.hp,initial.payload.run.hp-7);
 assert.equal(JSON.parse(values(r)['ashfall-lower-restrooms-v1-previous']).payload.run.hp,initial.payload.run.hp);
 r.eval('RS.active.encounters.seenRooms.push("snapshot-only");');
 assert(!r.eval('rsRetryCheckpoint.payload.scene.encounters.seenRooms.includes("snapshot-only")'));
 write('ashfall-lower-restrooms-v1','{broken');assert.equal(r.eval('rsSaveRead().serial'),initial.serial);
 assert.equal(r.eval('saveDecodeCalls'),1,'changed disk text is validated despite the in-memory cache');
 r.eval('JSON.stringify=countSaveStringify;rsSaveDecode=countSaveDecode;');
});
test('wrong version and hostile or noncanonical payloads cannot become checkpoints',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one")');const initial=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);
 for(const alter of [e=>e.version=2,e=>e.world='obsolete',e=>e.payload.run.hp=-1,
  e=>e.payload.pose.x=null,e=>e.payload.scene.anomalies=['__proto__'],e=>e.payload.run.ammo[0].ammo=9999,
  e=>e.payload.transfer.status='unseen',e=>e.payload.scene.visited=['same','same']]){
  const e=JSON.parse(JSON.stringify(initial));alter(e);
  // A checksum is corruption detection, not a trust boundary. Schema validation
  // must still reject malformed input whose checksum was recomputed.
  e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
  const next=fresh({'ashfall-lower-restrooms-v1':JSON.stringify(e)});
  assert(!next.eval('rsResumeAvailable()'));assert(!next.eval('rsRestoreSaved()'));assert.equal(next.eval('mode'),'menu');
 }
});
test('completed chapter resumes in the existing hospital without replaying the chapter or duplicating rewards',()=>{
 const r=campaign();r.eval('rsLeave(true);');assert(r.eval('rsSaveCheckpoint("chapter-complete")'));
 const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 assert(!next.eval('rsRunning()'));assert(next.eval('RS.campaign.complete&&HW.resolved&&HB.state==="dead"'));
 assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('guns[0].ammo'),2);assert.equal(next.eval('score'),11935);
 assert(next.eval('player.x>50&&fits(player.x,player.y)'));assert(!next.eval('rsTryEnter()'));
 next.eval('completeWard();');const awarded=next.eval('score');assert(awarded>11935);next.eval('completeWard();');assert.equal(next.eval('score'),awarded);
 assert(!next.eval('rsSaveCheckpoint("after-victory")'));
});
test('blocked writes preserve a readable last good checkpoint and do not interrupt play',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one")');
 const data=values(r),write=r.context.localStorage.setItem;
 r.context.localStorage.setItem=()=>{throw new Error('Quota denied');};
 r.eval('player.hp=11;');assert(!r.eval('rsSaveCheckpoint("two")'));assert.equal(r.eval('mode'),'playing');
 assert(r.eval('rsSaveStatus.failed&&rsResumeAvailable()'));assert.deepEqual(values(r),data);
 r.context.localStorage.setItem=write;assert(r.eval('rsSaveCheckpoint("three")'));assert(!r.eval('rsSaveStatus.failed'));
});
test('quota failure between backup and current writes still reloads the last completed generation',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one");player.hp=23;rsSaveCheckpoint("two");');
 const write=r.context.localStorage.setItem;
 r.context.localStorage.setItem=(key,value)=>{if(key==='ashfall-lower-restrooms-v1')throw new Error('Quota denied');write(key,value);};
 r.eval('player.hp=11;');assert(!r.eval('rsSaveCheckpoint("three")'));
 const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));assert.equal(next.eval('player.hp'),23);
});
test('unavailable localStorage is handled without an exception or false Continue offer',()=>{
 const r=campaign();r.context.localStorage.getItem=()=>{throw new Error('Storage blocked');};
 r.context.localStorage.setItem=()=>{throw new Error('Storage blocked');};r.context.localStorage.removeItem=()=>{throw new Error('Storage blocked');};
 assert(!r.eval('rsResumeAvailable()'));assert(!r.eval('rsSaveCheckpoint("pagehide")'));assert(!r.eval('rsRestoreSaved()'));
 assert(!r.eval('rsClearSave()'));assert(!r.eval('rsResumeAvailable()'));assert.equal(r.eval('mode'),'playing');
});
test('clear removes both generations and the Continue entry',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one");rsSaveCheckpoint("two");');
 assert(r.eval('rsResumeAvailable()'));assert(r.eval('rsClearSave()'));
 assert.deepEqual(values(r),{});assert(!r.eval('rsResumeAvailable()'));assert(r.get('restroomContinue').classList.contains('hidden'));
});
test('explicit new run and actual exterior departure retire chapter checkpoints',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("one");startRun();');assert(!r.eval('rsResumeAvailable()'));assert.deepEqual(values(r),{});
 const next=campaign();next.eval('rsLeave(true);rsSaveCheckpoint("hospital");');assert(next.eval('rsResumeAvailable()'));
 next.eval('loadStage(3);');assert(!next.eval('rsResumeAvailable()'));assert.deepEqual(values(next),{});
});
test('near-vertical up and down views save and resume across adaptive resolution and rotation',()=>{
 for(const degrees of [88,-88]){
  const r=campaign(),angle=degrees*Math.PI/180;
  r.eval('aimPitch=Math.tan('+angle+')*rsAimProjection();settings.res=.5;resize();');
  assert(Math.abs(r.eval('Math.atan2(aimPitch,rsAimProjection())')-angle)<1e-12);
  assert(Math.abs(r.eval('aimPitch'))>1000,'test must cover the old rejected pixel range');
  r.context.visualViewport.width=390;r.context.visualViewport.height=844;r.eval('resize();');
  assert(Math.abs(r.eval('Math.atan2(aimPitch,rsAimProjection())')-angle)<1e-12);
  assert(r.eval('rsSaveCheckpoint("rotated-high-view")'));
  const envelope=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);
  assert(Math.abs(envelope.payload.pose.pitch)<=1000);
  assert(Math.abs(envelope.payload.pose.pitchAngle-angle)<1e-12);
  const next=fresh(values(r));next.context.visualViewport.width=844;next.context.visualViewport.height=390;
  next.eval('settings.res=1;resize();');assert(next.eval('rsRestoreSaved()'));
  assert(Math.abs(next.eval('Math.atan2(aimPitch,rsAimProjection())')-angle)<1e-12);
  assert(next.eval('rsSaveCheckpoint("continued-high-view")'));
 }
});
test('beta 0.2.4 checkpoints without pitchAngle preserve their legacy view and upgrade on next save',()=>{
 const r=campaign();r.eval('aimPitch=110;rsSaveCheckpoint("legacy");');
 const e=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);delete e.payload.pose.pitchAngle;
 e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
 const next=fresh({'ashfall-lower-restrooms-v1':JSON.stringify(e)});
 assert(next.eval('rsRestoreSaved()'));assert.equal(next.eval('aimPitch'),110);
 assert(next.eval('rsSaveCheckpoint("upgraded")'));
 const upgraded=JSON.parse(values(next)['ashfall-lower-restrooms-v1']);
 assert.equal(upgraded.version,1);assert.equal(upgraded.payload.pose.pitch,110);
 assert(Number.isFinite(upgraded.payload.pose.pitchAngle));
});
test('invalid angular views are rejected even with a valid checksum and never overwrite a good save',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("valid");');const data=values(r),initial=JSON.parse(data['ashfall-lower-restrooms-v1']);
 for(const value of [null,'1',89*Math.PI/180,-89*Math.PI/180,NaN,Infinity,-Infinity]){
  const e=JSON.parse(JSON.stringify(initial));e.payload.pose.pitchAngle=value;
  e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
  assert.equal(r.eval('rsSaveDecode('+JSON.stringify(JSON.stringify(e))+')'),null);
 }
 for(const value of ['NaN','Infinity','-Infinity']){
  r.eval('aimPitch='+value+';');assert(!r.eval('rsSaveCheckpoint("invalid-view")'));assert.deepEqual(values(r),data);
 }
});
test('recovery from an obstructed near-vertical checkpoint resets the recovered view to level',()=>{
 const r=campaign();r.eval('aimPitch=Math.tan(88*Math.PI/180)*rsAimProjection();rsSaveCheckpoint("high-view");');
 const e=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);e.payload.pose.x=90000;e.payload.pose.y=90000;
 e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
 const next=fresh({'ashfall-lower-restrooms-v1':JSON.stringify(e)});assert(next.eval('rsRestoreSaved()'));
 assert(next.eval('rsCanStand(player.x,player.y,RS.active.z)'));assert.equal(next.eval('aimPitch'),0);
 assert.equal(next.eval('RS.active.folds'),3);
});
test('beta 0.2.5 payloads without encounter or sewer fields upgrade without losing the old run',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("legacy-beta-five");');
 const e=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);delete e.payload.scene.encounters;delete e.payload.sewerOpen;
 e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
 const next=fresh({'ashfall-lower-restrooms-v1':JSON.stringify(e)});assert(next.eval('rsRestoreSaved()'));
 assert.equal(next.eval('player.hp'),37);assert(next.eval('RS.active.committed'));
 const migrated=JSON.parse(values(next)['ashfall-lower-restrooms-v1']);
 assert.equal(migrated.payload.scene.encounters.seed,next.eval('RS.active.encounters.seed'),'legacy rarity is fixed before the first resumed frame');
 const again=fresh(values(next));assert(again.eval('rsRestoreSaved()'));
 assert.equal(again.eval('RS.active.encounters.seed'),migrated.payload.scene.encounters.seed);
 assert(!next.eval('RS.campaign.sewerOpen'));assert(next.eval('rsSaveCheckpoint("beta-six-upgrade")'));
 const upgraded=JSON.parse(values(next)['ashfall-lower-restrooms-v1']);
 assert.equal(upgraded.version,1);assert.equal(upgraded.payload.sewerOpen,false);
 assert(next.eval('rsEncountersValid(rsSaveSnapshot().scene.encounters)'));
});
test('beta 0.2.6 active Hollow migrates once without healing, enlargement, movement or reroll',()=>{
 const r=campaign(),legacy=legacyEncounter(),actor=legacy.entities[0];
 Object.assign(actor,{hp:51,revealed:true,phase:'charge',phaseTime:1.7,age:16,grace:0});
 const data=withEncounterPayload(r,legacy),next=fresh(data);assert(next.eval('rsRestoreSaved()'));
 const upgraded=json(next,'RS.active.encounters');assert.equal(upgraded.version,3);assert.equal(upgraded.seed,legacy.seed);
 assert.deepEqual(upgraded.seenRooms,legacy.seenRooms);assert.equal(upgraded.entities.length,1);
 const actual=upgraded.entities[0];
 for(const key of ['id','kind','x','y','z','hp','revealed','alive','phase','phaseTime'])assert.equal(actual[key],actor[key]);
 assert.equal(actual.scale,1);assert.deepEqual(actual.normal,actor.normal);assert(actual.grace>=4);
 assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('kills'),42);assert.equal(next.eval('score'),11935);
 const stored=JSON.parse(values(next)['ashfall-lower-restrooms-v1']);
 assert.equal(stored.version,1);assert.deepEqual(stored.payload.scene.encounters,upgraded,'migration persists before the first frame');
 assert.equal(stored.serial,JSON.parse(data['ashfall-lower-restrooms-v1']).serial+1);
 const again=fresh(values(next));assert(again.eval('rsRestoreSaved()'));
 assert.deepEqual(json(again,'RS.active.encounters'),upgraded);assert.deepEqual(values(again),values(next),'current schema does not migrate twice');
});
test('beta 0.2.6 removed active, dead and pending encounters are discarded without resource changes',()=>{
 for(const phase of ['active','dead','pending','arming']){
  const r=campaign(),legacy=legacyEncounter('crawler');
  if(phase==='dead')Object.assign(legacy.entities[0],{hp:0,alive:false,revealed:true,phase:'dead'});
  if(['pending','arming'].includes(phase)){legacy.entities=[];legacy.opportunities[0].status=phase;}
  const before=runResources(r),next=fresh(withEncounterPayload(r,legacy));assert(next.eval('rsRestoreSaved()'));
  assert.equal(next.eval('RS.active.encounters.version'),3);assert.equal(next.eval('RS.active.encounters.seed'),legacy.seed);
  assert.equal(next.eval('RS.active.encounters.entities.length'),0);assert.equal(next.eval('RS.active.encounters.opportunities.length'),0);
  next.eval('for(let frame=0;frame<120;frame++)rsEncountersUpdate(.05);');
  assert.deepEqual(runResources(next),before);assert.equal(next.eval('RSE.stats.spawns'),0);assert.equal(next.eval('RSE.stats.breaths'),0);
  const again=fresh(values(next));assert(again.eval('rsRestoreSaved()'));assert.equal(again.eval('RS.active.encounters.entities.length'),0);
 }
});
test('checksum-valid beta 0.2.7 removed group is cleared even during a partially defeated wall retreat',()=>{
 const r=campaign(),legacy=removedV2Encounter();placeInRoom(r,'C07');
 for(const e of legacy.entities.slice(0,2))Object.assign(e,{hp:0,alive:false,revealed:true,phase:'dead'});
 const actor=legacy.entities[2],ledge=actor.crawlRoute[1];
 Object.assign(actor,{...ledge,normal:{...ledge.normal},hp:183,revealed:true,phase:'retreat',age:20,clock:20,
  routeStage:2,grace:0,retreatUntil:22.65,retreatCooldown:24.8,surfaceRoute:[{...ledge}],surfaceStage:0});
 legacy.opportunities.push({id:'haunt-hollow',kind:'hollow',roomId:'R13',status:'pending'});
 const before=runResources(r),data=withEncounterPayload(r,legacy),next=fresh(data);
 assert(next.eval('rsSaveDecode(localStorage.getItem(RS_SAVE_KEY))!==null'));
 let writes=0;const write=next.context.localStorage.setItem;
 next.context.localStorage.setItem=(key,value)=>{if(key==='ashfall-lower-restrooms-v1')writes++;write(key,value);};
 assert(next.eval('rsRestoreSaved()'));assert.equal(writes,1);
 const migrated=json(next,'RS.active.encounters');assert.equal(migrated.version,3);assert.equal(migrated.seed,legacy.seed);
 assert.deepEqual(migrated.seenRooms,legacy.seenRooms);assert.deepEqual(migrated.opportunities,[legacy.opportunities[1]]);
 assert.equal(migrated.entities.length,0);assert.deepEqual(runResources(next),before);
 assert.equal(next.eval('RSE.paths.size'),0);assert.equal(next.eval('RSE.spawnJobs.size'),0);assert.equal(next.eval('RSE.voices.size'),0);
 next.eval('for(let frame=0;frame<120;frame++)rsEncountersUpdate(.05);');
 assert.equal(next.eval('RSE.stats.spawns'),0);assert.equal(next.eval('RSE.stats.breaths'),0);assert.deepEqual(runResources(next),before);
 const stored=values(next);assert(!JSON.stringify(JSON.parse(stored['ashfall-lower-restrooms-v1']).payload.scene.encounters).includes('crawler'));
 const again=fresh(stored);assert(again.eval('rsRestoreSaved()'));assert.deepEqual(values(again),stored);
 assert.equal(again.eval('RS.active.encounters.entities.length'),0);assert.deepEqual(runResources(again),before);
});
test('beta 0.2.7 Hollow survives removal migration with the same body, damage, pose and completed rewards',()=>{
 for(const alive of [true,false]){
  const r=campaign(),legacy=legacyEncounter();placeInRoom(r,'R05');legacy.version=2;legacy.seed=49271;legacy.seenRooms=['R05'];
  legacy.opportunities[0].roomId='R05';legacy.opportunities.push({id:'haunt-crawler',kind:'crawler',roomId:'C15',status:'pending'});
  const actor=legacy.entities[0];Object.assign(actor,{groupId:'haunt-hollow',member:0,x:206.75,y:220.75,z:-11.6525,
   hp:alive?731:0,alive,revealed:true,phase:alive?'recover':'dead',phaseTime:.4,age:17,clock:17,roomId:'R05',
   radius:.66,scale:2.05,height:4.13,grace:0,retreatUntil:0,retreatCooldown:0,surfaceRoute:null,surfaceStage:0});
  const before=runResources(r),next=fresh(withEncounterPayload(r,legacy));assert(next.eval('rsRestoreSaved()'));
  const actual=json(next,'RS.active.encounters.entities[0]');
  for(const key of ['id','kind','x','y','z','hp','alive','revealed','phase','phaseTime','scale','height','radius'])assert.equal(actual[key],actor[key]);
  assert.equal(next.eval('RS.active.encounters.version'),3);assert.equal(next.eval('RS.active.encounters.opportunities.length'),1);
  for(const key of ['groupId','member','routeStage','retreatUntil','retreatCooldown','surfaceRoute','surfaceStage'])assert(!(key in actual));
  assert.deepEqual(runResources(next),before);
  next.eval('rsEncountersUpdate(.05);');assert.deepEqual(runResources(next),before);
  const stored=values(next),again=fresh(stored);assert(again.eval('rsRestoreSaved()'));assert.deepEqual(values(again),stored);
  assert.equal(again.eval('RS.active.encounters.entities[0].hp'),actor.hp);
 }
});
test('beta 0.2.7 removed schedules never finish an interrupted spawn or re-award completed kills',()=>{
 for(const status of ['pending','arming','dead']){
  const r=campaign(),legacy=removedV2Encounter();
  if(status==='dead')for(const e of legacy.entities)Object.assign(e,{hp:0,alive:false,revealed:true,phase:'dead'});
  else{legacy.entities=[];legacy.opportunities[0].status=status;}
  const before=runResources(r),next=fresh(withEncounterPayload(r,legacy));assert(next.eval('rsRestoreSaved()'));
  next.eval('for(let frame=0;frame<120;frame++)rsEncountersUpdate(.05);');
  assert.equal(next.eval('RS.active.encounters.entities.length'),0);assert.equal(next.eval('RS.active.encounters.opportunities.length'),0);
  assert.equal(next.eval('RSE.spawnJobs.size'),0);assert.equal(next.eval('RSE.stats.spawns'),0);assert.deepEqual(runResources(next),before);
 }
});
test('legacy Hollow pending rarity decisions retain their exact room, status and seed without a new lottery',()=>{
 for(const version of [1,2]){
  const r=campaign(),legacy=legacyEncounter();legacy.version=version;legacy.entities=[];legacy.seenRooms=[];
  legacy.opportunities[0].roomId='R13';legacy.opportunities[0].status='pending';
  const data=withEncounterPayload(r,legacy),first=fresh(data),second=fresh(data);
  assert(first.eval('rsRestoreSaved()'));assert(second.eval('rsRestoreSaved()'));
  const a=json(first,'RS.active.encounters'),b=json(second,'RS.active.encounters');
  assert.deepEqual(a,b);assert.equal(a.version,3);assert.equal(a.seed,legacy.seed);assert.equal(a.entities.length,0);
  assert.deepEqual(a.opportunities,legacy.opportunities);
  const again=fresh(values(first));assert(again.eval('rsRestoreSaved()'));assert.deepEqual(json(again,'RS.active.encounters'),a);
 }
});
test('storage denial during removal migration still gives Retry a clean in-memory generation',()=>{
 const r=campaign(),next=fresh(withEncounterPayload(r,removedV2Encounter()));
 next.context.localStorage.setItem=()=>{throw Error('Storage denied');};
 assert(next.eval('rsRestoreSaved()'));const before=json(next,'RS.active.encounters');
 assert.equal(before.version,3);assert.equal(before.entities.length,0);assert.equal(before.opportunities.length,0);
 assert(next.eval('rsSaveStatus.failed'));assert(next.eval('rsRetryCheckpoint.payload.scene.encounters.version===3'));
 next.eval('player.hp=0;finish(false,"The room moved.");');assert(next.get('retryBtn').onclick());
 assert.deepEqual(json(next,'RS.active.encounters'),before);
 assert.equal(next.eval('player.hp'),37);assert(next.eval('RS.active.committed'));
});
test('failed encounter reconstruction keeps the validated checkpoint instead of accepting a rerolled schedule',()=>{
 const r=campaign(),data=withEncounterPayload(r,legacyEncounter()),next=fresh(data);
 next.eval('rsEncountersRestore=()=>false;');assert(!next.eval('rsRestoreSaved()'));
 assert.equal(next.eval('mode'),'menu');assert(!next.eval('rsRunning()'));
 assert(next.eval('rsSaveStatus.failed&&rsSaveStatus.failure==="restore"'));
 assert.deepEqual(values(next),data);
});
test('Retry button restores the committed Restrooms checkpoint after death rather than the Heart',()=>{
 const r=campaign();r.eval('wireTestWard();rsSaveCheckpoint("descent-committed");');
 const seed=r.eval('RS.active.encounters.seed');
 for(let i=0;i<2;i++){
  r.eval('hurt=0;dashT=0;hurtPlayer(1000,"A shape found you in the water.");');
  assert.equal(r.eval('mode'),'dead');assert(r.get('retryBtn').onclick());
  assert(r.eval('rsRunning()&&RS.active.committed'));assert.equal(r.eval('player.hp'),37);
  assert.equal(r.eval('RS.active.encounters.seed'),seed);assert.equal(r.eval('RS.active.room'),'P01');
 }
});
test('a browser denying checkpoint storage still retries inside the Restrooms using memory',()=>{
 const r=campaign();r.eval('rsClearSave();');r.context.localStorage.setItem=()=>{throw Error('Storage denied');};
 assert(!r.eval('rsSaveCheckpoint("memory-only")'));const seed=r.eval('RS.active.encounters.seed');
 r.eval('player.hp=0;finish(false,"The water moved.");');assert(r.get('retryBtn').onclick());
 assert(r.eval('rsRunning()&&RS.active.committed'));assert.equal(r.eval('player.hp'),37);
 assert.equal(r.eval('RS.active.encounters.seed'),seed);assert(!r.eval('rsResumeAvailable()'));
});
test('the earned sewer exit persists an exterior arrival anchor with resources and native Journey retry',()=>{
 const r=campaign();r.eval('RS.campaign.complete=RS.campaign.sewerOpen=true;const sewerCarry=s4dCapture();rsLeave(false,true);rsSewerArrive(sewerCarry);');
 assert(r.eval('rsSaveCheckpoint("sewer-arrival")'));const data=values(r),e=JSON.parse(data['ashfall-lower-restrooms-v1']);
 assert.equal(e.payload.phase,'sewer');assert.equal(e.payload.complete,true);assert.equal(e.payload.sewerOpen,true);
 const next=fresh(data);assert(next.eval('rsRestoreSaved()'));
 assert(next.eval('s4Running()&&!rsRunning()&&RS.campaign.sewerOpen&&CB.on&&CB.checkpoint.journey'));
 assert(next.eval('Math.hypot(player.x-RS_SEWER_OUT.x,player.y-RS_SEWER_OUT.y)<.01'));
 assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('guns[0].ammo'),2);assert.equal(next.eval('score'),11935);
 assert(next.eval('CB.checkpoint.journey.sewerOpen'));
 assert(next.eval('rsResumeAvailable()'),'restoring the exterior must retain its durable sewer anchor');
 const again=fresh(values(next));assert(again.eval('rsRestoreSaved()'));
 assert(again.eval('s4Running()&&RS.campaign.sewerOpen&&CB.checkpoint.journey'));
 assert.equal(next.eval('enemies.filter(e=>e.s4Quest&&e.alive).length'),12);
 assert(!next.eval('S4.solids.some(b=>b.kind==="sewer-gate")'));
 next.eval('wireTestWard();player.hp=0;finish(false,"The guardian found you.");');assert(next.get('retryBtn').onclick());
 assert(next.eval('s4Running()&&RS.campaign.sewerOpen&&CB.on&&CB.checkpoint.journey'));
 assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('score'),11935);
});
test('later exterior autosaves retain the arrival anchor rather than duplicating supplies or rewards',()=>{
 const r=campaign();r.eval('RS.campaign.complete=RS.campaign.sewerOpen=true;const sewerCarry=s4dCapture();rsLeave(false,true);rsSewerArrive(sewerCarry);rsSaveCheckpoint("sewer-arrival");');
 const before=values(r);r.eval('player.hp=88;guns[0].ammo=5;score+=1000;');
 assert(!r.eval('rsSaveCheckpoint("pagehide")'));assert.deepEqual(values(r),before);
 r.eval('player.y-=4;');assert(!r.eval('rsSaveCheckpoint("hidden")'));assert.deepEqual(values(r),before);
 const next=fresh(before);assert(next.eval('rsRestoreSaved()'));assert.equal(next.eval('player.hp'),37);assert.equal(next.eval('score'),11935);
});
test('sewer route data cannot grant an exterior save without its earned boolean and completed chapter',()=>{
 const r=campaign();r.eval('rsSaveCheckpoint("valid");');const initial=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);
 for(const mutate of [p=>p.sewerOpen='true',p=>p.sewerOpen=1,p=>p.sewerOpen=null,
  p=>{p.phase='sewer';p.complete=true;p.sewerOpen=false;},p=>{p.phase='sewer';p.sewerOpen=true;p.complete=false;}]){
  const e=JSON.parse(JSON.stringify(initial));mutate(e.payload);e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
  assert.equal(r.eval('rsSaveDecode('+JSON.stringify(JSON.stringify(e))+')'),null);
 }
});
test('an explicit new campaign closes the earned exterior culvert and clears its Continue anchor',()=>{
 const r=campaign();r.eval('RS.campaign.complete=RS.campaign.sewerOpen=true;const sewerCarry=s4dCapture();rsLeave(false,true);rsSewerArrive(sewerCarry);rsSaveCheckpoint("sewer-arrival");startRun();loadStage(3);');
 assert(!r.eval('RS.campaign.sewerOpen'));assert(!r.eval('rsResumeAvailable()'));
 assert(r.eval('S4.solids.some(b=>b.kind==="sewer-gate")'));
});
test('active Hollow checkpoint preserves phase, position, reveal and health with resume grace',()=>{
 const r=campaign();activeEncounter(r);
 r.eval('savedCreature.revealed=true;savedCreature.hp=51;savedCreature.phase="windup";savedCreature.phaseTime=.56;savedCreature.grace=0;pauseGame();');
 assert(r.eval('rsSaveCheckpoint("paused-threat")'));const data=values(r),before=JSON.parse(data['ashfall-lower-restrooms-v1']).payload.scene.encounters;
 const next=fresh(data);assert(next.eval('rsRestoreSaved()'));const after=json(next,'RS.active.encounters');
 assert.equal(after.seed,before.seed);assert.deepEqual(after.seenRooms,before.seenRooms);assert.deepEqual(after.opportunities,before.opportunities);
 const e=after.entities[0],original=before.entities[0];
 for(const key of ['id','kind','x','y','z','hp','revealed','alive'])assert.equal(e[key],original[key]);
 assert.equal(e.phase,'windup');assert.equal(e.phaseTime,.56);assert(e.grace>=4);assert.equal(e.breathClock,0);
 const breaths=next.eval('RSE.stats.breaths');next.eval('for(let frame=0;frame<60;frame++)rsEncountersUpdate(1/60);');
 assert.equal(next.eval('player.hp'),37);assert(next.eval('RSE.stats.breaths')>breaths);
 assert.equal(next.eval('RS.active.encounters.entities.length'),1);
});
test('the giant retains its larger health pool and current damage across Continue',()=>{
 const r=campaign();activeEncounter(r);assert.equal(r.eval('savedCreature.hp'),1050);
 r.eval('savedCreature.grace=0;rsEncounterDamage(savedCreature,20);');
 assert(r.eval('savedCreature.hp>1000&&savedCreature.revealed'));assert(r.eval('rsSaveCheckpoint("giant-hit")'));
 const before=json(r,'savedCreature'),next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 const after=json(next,'RS.active.encounters.entities[0]');
 for(const key of ['hp','scale','height','radius','revealed','x','y','z','phase'])assert.equal(after[key],before[key]);
 assert.equal(next.eval('kills'),42);
});
test('a killed rare enemy and its one-time resource reward persist before another frame can reload',()=>{
 const r=campaign();activeEncounter(r);
 r.eval('rsEncounterDamage(savedCreature,1000);rsEncountersUpdate(0);');
 const data=values(r),e=JSON.parse(data['ashfall-lower-restrooms-v1']);
 assert(e.payload.scene.encounters.entities[0].hp===0&&!e.payload.scene.encounters.entities[0].alive);
 const before=json(r,'({hp:player.hp,kills,stageKills,ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve}))})');
 const next=fresh(data);assert(next.eval('rsRestoreSaved()'));
 assert.deepEqual(json(next,'({hp:player.hp,kills,stageKills,ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve}))})'),before);
 next.eval('rsEncountersUpdate(.05);rsEncountersUpdate(.05);');
 assert(next.eval('RS.active.encounters.opportunities.every(o=>o.status==="spent")'));
 assert(!next.eval('RS.active.encounters.entities.some(e=>e.alive)'));assert.equal(next.eval('kills'),before.kills);
});
test('malformed encounter schedules and actor state are rejected even with a recomputed checksum',()=>{
 const r=campaign();activeEncounter(r);r.eval('rsSaveCheckpoint("valid-threat");');
 const initial=JSON.parse(values(r)['ashfall-lower-restrooms-v1']);
 for(const mutate of [v=>v.seed=-1,v=>v.seed='42',v=>v.seenRooms=['G07','G07'],v=>v.extra='runtime node',
  v=>v.opportunities[0].status='pending',v=>v.opportunities[0].roomId='__proto__',
  v=>v.entities[0].phase='shoot',v=>v.entities[0].normal={x:0,y:0,z:0},v=>v.entities[0].x=null,
  v=>v.entities[0].hp=-1,v=>v.entities[0].grace='0',v=>v.entities[0].geometry=[]]){
  const e=JSON.parse(JSON.stringify(initial));mutate(e.payload.scene.encounters);
  e.hash=r.eval('rsSaveHash('+JSON.stringify(JSON.stringify(e.payload))+')');
  assert.equal(r.eval('rsSaveDecode('+JSON.stringify(JSON.stringify(e))+')'),null);
 }
});
test('the Hollow preview preserves campaign resources and obsolete preview requests cannot activate removed content',()=>{
 const r=campaign();activeEncounter(r);r.eval('rsSaveCheckpoint("campaign-threat");');
 const before=JSON.parse(values(r)['ashfall-lower-restrooms-v1']).payload;
 assert(!r.eval('rsEncounterPreview("crawler")'));assert(!r.eval('review.active'));
 assert.deepEqual(json(r,'rsSaveSnapshot()'),before);
 assert(r.eval('rsEncounterPreview("hollow")'));assert(r.eval('review.active&&RS.active.encounters.entities[0].kind==="hollow"'));
 const atPreview=values(r);assert.deepEqual(JSON.parse(atPreview['ashfall-lower-restrooms-v1']).payload,before);
 r.eval('rsEncounterDamage(RS.active.encounters.entities[0],1000);rsEncountersUpdate(0);');
 assert(!r.eval('rsSaveCheckpoint("pagehide")'));assert.deepEqual(values(r),atPreview);
 r.eval('reviewLeave();');assert.deepEqual(values(r),atPreview);
 assert(r.eval('rsRestoreSaved()'));assert.deepEqual(json(r,'rsSaveSnapshot().scene.encounters'),before.scene.encounters);
 assert.equal(r.eval('player.hp'),37);assert.equal(r.eval('kills'),42);
});
test('an encounter still being prepared retains its selected opportunity across a fresh page',()=>{
 const r=campaign();activeEncounter(r);
 r.eval('RS.active.encounters.entities=[];RS.active.encounters.opportunities[0].status="arming";');
 assert(r.eval('rsSaveCheckpoint("encounter-arming")'));const before=json(r,'RS.active.encounters');
 const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 assert.deepEqual(json(next,'RS.active.encounters'),before);
 assert.equal(next.eval('RS.active.encounters.opportunities[0].status'),'arming');
});
test('an interrupted Hollow spawn resumes one selected enemy without duplicate spawns',()=>{
 const r=campaign();activeEncounter(r);
 r.eval(`RS.active.encounters.entities=[];RS.active.encounters.opportunities[0].status="arming";`);
 assert(r.eval('rsSaveCheckpoint("partial-encounter-build")'));
 const next=fresh(values(r));assert(next.eval('rsRestoreSaved()'));
 assert.equal(next.eval('RSE.spawnJobs.size'),0);
 next.eval('for(let i=0;i<2000&&!RS.active.encounters.entities.length;i++)rsEncountersUpdate(0);');
 assert.equal(next.eval('RS.active.encounters.entities.length'),1);
 assert.equal(next.eval('RS.active.encounters.seed'),91337);
 assert.equal(next.eval('RS.active.encounters.opportunities[0].status'),'spent');
 assert.equal(next.eval('RSE.stats.spawns'),1);assert(next.eval('rsEncountersValid(RS.active.encounters)'));
});
console.log(`PASS ${count} durable restroom checkpoint scenarios (fresh native runtimes; not real-browser storage QA).`);
