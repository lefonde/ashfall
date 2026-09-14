// One rare, seeded Hollow encounter in a vast dark reservoir. An empty descent
// stays empty; visits, reloads and migration never reroll an opportunity.
const RSE={chance:.12,max:1,voices:new Map(),paths:new Map(),spawnJobs:new Map(),stats:{spawns:0,breaths:0,steps:0,attacks:0,pathSearches:0}};
const RSE_BODY={hollow:{scale:2.05,height:4.13,radius:.66,offset:1.9475,hp:1050,min:12,max:29}};
// Actual unmodified water pace is 3.95 m/s. Short, accelerating rushes peak at
// 4.47 m/s, with a fixed strike tell and recovery window for turns/reloads.
const RSE_PACE={stalk:.9,charge:4.1,pulse:.09,ramp:.8,burst:4.1,windup:.85,recovery:1.3,reach:2.5};
function rsEncounterRng(seed){let x=(seed>>>0)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296;};}
function rsEncounterRooms(kind='hollow'){return kind==='hollow'?(typeof rsThreatRoomIds==='function'?rsThreatRoomIds(kind):['R01','R05','R13']).map(id=>RW.byId[id]).filter(Boolean):[];}
function rsEncountersSchedule(seed){const random=rsEncounterRng(seed),chosen=random()<RSE.chance,rooms=rsEncounterRooms(),pick=random(),opportunities=chosen&&rooms.length?[{id:'haunt-hollow',kind:'hollow',roomId:rooms[Math.floor(pick*rooms.length)].id,status:'pending'}]:[];return {version:3,seed:seed>>>0,seenRooms:[],opportunities,entities:[]};}
function rsEncountersInit(s=RS.active){if(!s)return null;rsEncountersLeave();const owner=rsState(),previous=owner.encounters;s.encounters=previous&&rsEncountersValid(previous)?rsEncountersUpgrade(previous):rsEncountersSchedule((Math.random()*4294967296)>>>0);owner.encounters=s.encounters;return s.encounters;}
function rsEncounterPoint(e){return {x:e.x,y:e.y,z:e.z};}
function rsEncounterOffset(e){return .95*(e.scale||1);}
function rsEncounterFoot(e){return e.z-rsEncounterOffset(e);}
function rsEncounterClear(a,b,margin=.035){const d={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},n=Math.hypot(d.x,d.y,d.z);if(n<.001)return true;const h=rsShotTrace(a,d,n);return !h.face||h.d>=n-margin;}
function rsEncounterFloorFit(x,y,z,r=.25,height=2.05){
 const g=rsGround(x,y,z);if(!g)return false;const floor=rsFloor(g,x,y);
 for(const[dx,dy]of[[0,0],[-r,-r],[r,-r],[-r,r],[r,r]]){const s=rsGround(x+dx,y+dy,floor);if(!s||rsCeil(s,x+dx,y+dy)-floor<height+.045)return false;}
 for(const b of rsGridQuery(RW.solidIndex,[x-r,y-r,x+r,y+r]))if(!b.disabled&&floor+height>b.z+.025&&floor+.035<b.z+b.h&&x+r>b.x1&&x-r<b.x2&&y+r>b.y1&&y-r<b.y2)return false;
 if(height>3){const roof=rsShotTrace({x,y,z:floor+.12},{x:0,y:0,z:1},height-.12);if(roof.face)return false;}
 return true;
}
function* rsEncounterCreateWork(kind,roomId,id='haunt-hollow'){
 const room=RW.byId[roomId],body=RSE_BODY.hollow;if(kind!=='hollow'||!room?.room||room.h<body.height+.05)return null;const b=room.bounds,candidates=[];let scanned=0;
 for(let y=b[1]+.75;y<b[3]-.7;y+=2)for(let x=b[0]+.75;x<b[2]-.7;x+=2){if(++scanned%12===0)yield;const d=Math.hypot(x-player.x,y-player.y);if(d>=body.min&&d<=body.max&&rsPolyHas(room.poly,x,y)&&rsEncounterFloorFit(x,y,room.z,body.radius,body.height))candidates.push({x,y,d});}
 candidates.sort((a,b)=>b.d-a.d);
 for(const p of candidates.slice(0,120)){yield;const center={x:p.x,y:p.y,z:room.z+body.offset};if(!rsEncounterClear({...center,z:room.z+1.1},rsShotOrigin()))continue;
  return {id,kind:'hollow',...center,hp:body.hp,alive:true,revealed:false,phase:'stalk',clock:0,phaseTime:0,age:0,normal:{x:0,y:0,z:1},forward:{x:0,y:1,z:0},yaw:0,roomId,radius:body.radius,scale:body.scale,height:body.height,breathClock:0,stepClock:0,travel:0,escapeTime:0,grace:2.7};
 }return null;
}
function rsEncounterCreate(kind,roomId,id='haunt-hollow'){const work=rsEncounterCreateWork(kind,roomId,id);let next;do{next=work.next();}while(!next.done);return next.value;}
function rsEncounterVoice(e,event){if(typeof rsThreatVoice==='function')rsThreatVoice(e,event);}
function rsEncounterBreath(e){RSE.stats.breaths++;e.breathClock=e.phase==='charge'?1.25:2.05;rsEncounterVoice(e,'breathe');}
function rsEncounterVoiceUpdate(e){if(typeof rsThreatVoiceUpdate==='function')rsThreatVoiceUpdate(e);}
function rsEncounterSteps(e,moved){e.travel+=moved;if(e.travel<1.7)return;e.travel%=1.7;const wet=rsWaterAt(e.x,e.y,rsEncounterFoot(e));if(!wet)return;RSE.stats.steps++;const power=e.phase==='charge'?1.3:.84;if(typeof rsAudioWaterMotion==='function')rsAudioWaterMotion({x:e.x,y:e.y,z:wet.z,room:e.roomId},power);rsWaterStep(e.x,e.y,wet.z,power);}
function rsEncounterFloorEdge(a,b,z,radius=.25,height=2.05){const dx=b.x-a.x,dy=b.y-a.y;for(const t of[.25,.5,.75,1])if(!rsEncounterFloorFit(mix(a.x,b.x,t),mix(a.y,b.y,t),z,radius,height))return false;for(const q of rsGridQuery(RW.solidIndex,[Math.min(a.x,b.x)-radius,Math.min(a.y,b.y)-radius,Math.max(a.x,b.x)+radius,Math.max(a.y,b.y)+radius])){if(q.disabled||z+height<=q.z+.025||z+.035>=q.z+q.h)continue;let lo=0,hi=1;for(const[p,d,m,M]of[[a.x,dx,q.x1-radius,q.x2+radius],[a.y,dy,q.y1-radius,q.y2+radius]]){if(Math.abs(d)<1e-8){if(p<=m||p>=M){hi=-1;break;}}else{let t=(m-p)/d,u=(M-p)/d;if(t>u){const v=t;t=u;u=v;}lo=Math.max(lo,t);hi=Math.min(hi,u);}}if(hi>=lo&&hi>1e-6&&lo<1-1e-6)return false;}return true;}
function rsEncounterFloorPath(e,target){
 RSE.stats.pathSearches++;const step=1.35,base={x:e.x,y:e.y},z=rsEncounterFoot(e),nodes=new Map(),open=[],radius=e.radius,height=e.height||2.05;
 const key=(x,y)=>x+','+y,at=(x,y)=>({x:base.x+x*step,y:base.y+y*step}),heur=(x,y)=>Math.hypot(base.x+x*step-target.x,base.y+y*step-target.y),first={x:0,y:0,g:0,h:heur(0,0),parent:null};nodes.set('0,0',first);open.push(first);let best=first;
 for(let count=0;open.length&&count<160;count++){open.sort((a,b)=>a.g+a.h-b.g-b.h);const q=open.shift();if(q.closed)continue;q.closed=true;if(q.h<best.h)best=q;if(q.h<step){best=q;break;}for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const x=q.x+dx,y=q.y+dy;if(Math.abs(x)>22||Math.abs(y)>22)continue;const k=key(x,y),old=nodes.get(k),g=q.g+Math.hypot(dx,dy)*step;if(old&&(old.closed||old.g<=g))continue;const p=at(x,y);if(!rsEncounterFloorEdge(at(q.x,q.y),p,z,radius,height))continue;const n={x,y,g,h:heur(x,y),parent:q};nodes.set(k,n);open.push(n);}}
 const path=[];for(let q=best;q?.parent;q=q.parent)path.push(at(q.x,q.y));return path.reverse();
}
function rsEncounterGroundMove(e,dt,speed,goal=null){
 let path=RSE.paths.get(e.id);if(!path){path={floor:[],nextPath:e.age};RSE.paths.set(e.id,path);}const foot=rsEncounterFoot(e),target=goal||{x:player.x,y:player.y},radius=e.radius,height=e.height||2.05,direct=rsEncounterFloorEdge(e,target,foot,radius,height);
 if((!direct||path.blocked)&&e.age>=path.nextPath){path.floor=rsEncounterFloorPath(e,target);path.nextPath=e.age+1.05;}
 if(direct)path.floor=[];while(path.floor.length&&Math.hypot(path.floor[0].x-e.x,path.floor[0].y-e.y)<.09)path.floor.shift();const to=path.floor[0]||target,dx=to.x-e.x,dy=to.y-e.y,d=Math.hypot(dx,dy);if(d<.035)return 0;
 const travel=Math.min(speed*dt,d);if(height>3&&!rsEncounterClear({x:e.x,y:e.y,z:foot+height-.10},{x:e.x+dx/d*travel,y:e.y+dy/d*travel,z:foot+height-.10},.002)){path.blocked=true;return 0;}const steps=Math.max(1,Math.ceil(travel/.08)),sx=dx/d*travel/steps,sy=dy/d*travel/steps;let moved=0,z=foot;
 for(let i=0;i<steps;i++){const x=e.x+sx,y=e.y+sy;if(!rsEncounterFloorFit(x,y,z,radius,height)||!rsEncounterClear({x:e.x,y:e.y,z:z+Math.min(1,height*.5)},{x,y,z:z+Math.min(1,height*.5)},.002))break;const g=rsGround(x,y,z);e.x=x;e.y=y;z=rsFloor(g,x,y);e.z=z+rsEncounterOffset(e);moved+=Math.hypot(sx,sy);}
 path.blocked=moved<travel*.8;e.normal={x:0,y:0,z:1};e.forward={x:dx/d,y:dy/d,z:0};e.yaw=Math.atan2(dy,dx);return moved;
}
function rsEncounterHurtPlayer(amount,reason){if(!rsRunning()||mode!=='playing'||dashT>0||hurt>.22||(review.active&&!review.damage))return false;player.hp=Math.max(0,player.hp-amount*[.65,1,1.3][difficulty]);hurt=.42;shake=Math.max(shake,5);comboT=Math.max(0,comboT-.45);audio.hit(amount);hudUpdate();if(player.hp<=0){rsEncountersSilence();finish(false,reason||'Something in the water reached you. Listen, turn toward it, and fire.');}return true;}
function rsEncounterSpawnValid(e,s){const room=RW.byId[e.roomId],d=Math.hypot(e.x-player.x,e.y-player.y);return s.room===e.roomId&&Math.abs(s.z-room.z)<.3&&d>=RSE_BODY[e.kind].min&&d<=RSE_BODY[e.kind].max+2&&rsEncounterFloorFit(e.x,e.y,room.z,e.radius,e.height)&&rsEncounterClear({...e,z:room.z+1.1},rsShotOrigin());}
function rsEncountersUpdate(dt){
 const s=RS.active;if(!s||mode!=='playing'||review.active&&!review.ai)return;dt=clamp(Number.isFinite(dt)?dt:0,0,.05);const st=s.encounters||rsEncountersInit(s),room=RW.byId[s.room];if(typeof rsThreatAudioUpdate==='function')rsThreatAudioUpdate(dt);
 // Keep the immediate arming milestone as the completed spawn's backup. Clear
 // its dirty marker after saving so an unchanged yielded job cannot save it
 // twice; actual spawn/reveal/hit changes below still persist this same update.
 if(room?.room&&!st.seenRooms.includes(room.id)){st.seenRooms.push(room.id);const opportunity=st.opportunities.find(o=>o.roomId===room.id&&o.status==='pending');if(opportunity){opportunity.status=s.committed&&s.clock>20&&!st.entities.some(e=>e.alive)?'arming':'spent';s.pendingSave='encounter-opportunity';if(typeof rsSaveCheckpoint==='function'){rsSaveCheckpoint('encounter-opportunity');s.pendingSave=null;s.lastSave=s.clock;}}}
 for(const o of st.opportunities.filter(o=>o.status==='arming')){if(o.kind!=='hollow'||o.roomId!==s.room||st.entities.some(e=>e.alive)){o.status='spent';RSE.spawnJobs.delete(o.id);s.pendingSave='encounter-opportunity';continue;}let job=RSE.spawnJobs.get(o.id);if(!job){job=rsEncounterCreateWork(o.kind,o.roomId,o.id);RSE.spawnJobs.set(o.id,job);}const start=performance.now();for(let steps=0;steps<20;steps++){const next=job.next();if(next.done){o.status='spent';RSE.spawnJobs.delete(o.id);const e=next.value;if(e&&e.kind==='hollow'&&rsEncounterSpawnValid(e,s)){st.entities=[e];RSE.stats.spawns++;rsEncounterVoice(e,'awake');rsEncounterBreath(e);}s.pendingSave='encounter-spawn';break;}if(performance.now()-start>1.6)break;}}
 for(const e of st.entities){if(!e.alive){e.clock+=dt;continue;}e.clock+=dt;e.age+=dt;e.phaseTime+=dt;e.grace=Math.max(0,e.grace-dt);e.breathClock=Math.max(0,e.breathClock-dt);if(e.breathClock<=0)rsEncounterBreath(e);
  const target={x:player.x,y:player.y,z:s.z+1.03},distance=Math.hypot(e.x-target.x,e.y-target.y),visible=distance<40&&rsEncounterClear(e,target);e.escapeTime=visible?0:e.escapeTime+dt;
  if(e.escapeTime>24||distance>70){e.alive=false;e.phase='dead';e.clock=0;rsEncounterStopVoice(e.id);continue;}
  if(e.phase==='stalk'&&e.grace<=0||e.phase==='recover'&&e.phaseTime>=RSE_PACE.recovery){e.phase='charge';e.phaseTime=0;rsEncounterVoice(e,'charge');}
  if(e.phase==='charge'&&distance<RSE_PACE.reach&&visible&&e.grace<=0){e.phase='windup';e.phaseTime=0;e.revealed=true;rsEncounterVoice(e,'windup');s.pendingSave='encounter-reveal';}
  if(e.phase==='windup'&&e.phaseTime>=RSE_PACE.windup){if(distance<RSE_PACE.reach+.15&&visible&&e.grace<=0){RSE.stats.attacks++;rsEncounterVoice(e,'attack');rsEncounterHurtPlayer(36,'The breathing became a rush. Give it space, aim into the splashing, and keep moving.');}e.phase='recover';e.phaseTime=0;}
  if(e.phase==='charge'&&e.phaseTime>=RSE_PACE.burst){e.phase='recover';e.phaseTime=0;}
  if(e.phase==='stalk'||e.phase==='charge'){const pulse=1+RSE_PACE.pulse*Math.sin(e.age*13),ramp=mix(.48,1,clamp(e.phaseTime/RSE_PACE.ramp,0,1)),speed=e.phase==='stalk'?RSE_PACE.stalk:RSE_PACE.charge*pulse*ramp;rsEncounterSteps(e,rsEncounterGroundMove(e,dt,speed));}
 }
 if(mode==='playing'&&s.pendingSave?.startsWith('encounter')&&typeof rsSaveCheckpoint==='function'){rsSaveCheckpoint(s.pendingSave);s.pendingSave=null;s.lastSave=s.clock;}
}
function rsEncounterSphereRay(o,d,c,r,max){const x=o.x-c.x,y=o.y-c.y,z=o.z-c.z,b=x*d.x+y*d.y+z*d.z,q=x*x+y*y+z*z-r*r,disc=b*b-q;if(disc<0)return null;const t=-b-Math.sqrt(disc),far=-b+Math.sqrt(disc),hit=t>=0?t:far>=0?0:null;return hit!==null&&hit<=max?hit:null;}
function rsEncounterSpheres(e){
 const scale=e.scale||1,forward=e.forward||{x:Math.cos(e.yaw||0),y:Math.sin(e.yaw||0)};
 // Overlapping sealed-flesh volumes cover the swollen flanks and upper chest.
 // Keep the approved head and lower body; movement collision stays unchanged.
 return [{x:e.x,y:e.y,z:e.z-.50*scale,r:.32*scale},{x:e.x+forward.x*.055*scale,y:e.y+forward.y*.055*scale,z:e.z+.04*scale,r:.43*scale},{x:e.x,y:e.y,z:e.z+.83*scale,r:.30*scale},{x:e.x+forward.x*.075*scale,y:e.y+forward.y*.075*scale,z:e.z+.34*scale,r:.30*scale}];
}
function rsEncounterRay(origin,direction,max=96){if(!rsRunning())return null;const d=rsShotUnit(direction);let closest=max,hit=null;for(const e of RS.active.encounters?.entities||[]){if(!e.alive)continue;for(const c of rsEncounterSpheres(e)){const n=rsEncounterSphereRay(origin,d,c,c.r,closest);if(n===null||!rsEncounterClear(origin,c))continue;closest=n;const x=origin.x+d.x*n,y=origin.y+d.y*n,z=origin.z+d.z*n,len=Math.hypot(x-c.x,y-c.y,z-c.z)||1;hit={d:n,enemy:e,x,y,z,normal:{x:(x-c.x)/len,y:(y-c.y)/len,z:(z-c.z)/len}};}}return hit;}
function rsEncounterDamage(e,amount,hit=null){
 if(!e?.alive||!Number.isFinite(amount)||amount<=0)return false;const first=!e.revealed;e.revealed=true;e.hp=Math.max(0,e.hp-amount*mods.damage);hitmarker=.13;const p=hit||e;rsEmitAt(p.x,p.y,p.z,'#a7b7a4',8,.42);audio.flesh({x:e.x,y:e.y});RS.active.pendingSave='encounter-hit';rsEncounterVoice(e,'hit');
 // Damage never resets the rush animation. A shotgun's twelve pellets cannot
 // freeze the giant or erase its readable recovery window.
 if(e.hp>0){if(first&&e.grace<=0&&e.phase==='stalk'){e.phase='charge';e.phaseTime=0;rsEncounterVoice(e,'charge');}}
 else{e.alive=false;e.phase='dead';e.clock=0;kills++;stageKills++;killmarker=.22;rsEncounterStopVoice(e.id);rsEncounterVoice(e,'death');RSE.paths.delete(e.id);for(let i=0;i<3;i++){const g=guns[i],gift=[12,50,3][i];g.reserve=Math.min(g.maxReserve,g.reserve+gift);}player.hp=Math.min(100,player.hp+15*mods.life);}
 return true;
}
function rsEncounterMelee(){if(!rsRunning()||mode!=='playing'||meleeCD>0||weapon===3)return;meleeT=.27;meleeCD=.62;shake=Math.max(shake,3);audio.swing();const o=rsShotOrigin(),d=rsShotDirection();let hit=null;for(const x of[-.32,0,.32])for(const y of[-.24,0,.24]){const v=rsShotSpread(d,x,y),wall=rsShotTrace(o,v,1.75),q=rsEncounterRay(o,v,wall.d);if(q&&(!hit||q.d<hit.d))hit=q;}if(hit){rsEncounterDamage(hit.enemy,65,hit);guns[0].reserve=Math.min(guns[0].maxReserve,guns[0].reserve+3);audio.flesh(null,true);}}
function rsEncounterStopVoice(id){if(typeof rsThreatAudioStop==='function')rsThreatAudioStop(id);const v=RSE.voices.get(id);if(v){try{v.source.stop();}catch{}rsAudioEndVoice(v);RSE.voices.delete(id);}}
function rsEncountersSilence(){if(typeof rsThreatAudioStop==='function')rsThreatAudioStop();for(const id of [...RSE.voices.keys()])rsEncounterStopVoice(id);}
function rsEncountersLeave(){rsEncountersSilence();RSE.paths.clear();RSE.spawnJobs.clear();}
function rsEncountersSnapshot(s=RS.active){
 // Encounter state is small plain data. Copy it without a second JSON encode
 // and parse; the enclosing checkpoint owns validation and serialization.
 const copy=v=>Array.isArray(v)?v.map(copy):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,value])=>[k,copy(value)])):v;
 return s?.encounters?copy(s.encounters):null;
}
// Only the checkpoint reader recognizes removed legacy kinds. Their payloads
// are discarded before validation of the live Hollow-only schema.
function rsEncountersUpgrade(saved){
 const v=JSON.parse(JSON.stringify(saved));if(v.version===3)return v;
 v.version=3;v.opportunities=v.opportunities.filter(o=>o.kind==='hollow');v.entities=v.entities.filter(e=>e.kind==='hollow');
 for(const e of v.entities){if(saved.version===1)Object.assign(e,{scale:1,height:2.05,legacy:true});for(const key of ['groupId','member','routeStage','crawlRoute','retreatUntil','retreatCooldown','surfaceRoute','surfaceStage'])delete e[key];}
 // Retain the exact chosen room/status/seed. A removed opportunity never
 // becomes a fresh Hollow lottery and an already visited room stays spent.
 return v;
}
function rsEncountersValid(v){
 const keys=(o,allowed)=>!!o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).every(k=>allowed.includes(k)),num=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b,id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,96}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x),vec=x=>keys(x,['x','y','z'])&&num(x.x,-1.001,1.001)&&num(x.y,-1.001,1.001)&&num(x.z,-1.001,1.001)&&Math.abs(Math.hypot(x.x,x.y,x.z)-1)<.03;
 if(!keys(v,['version','seed','seenRooms','opportunities','entities'])||![1,2,3].includes(v.version)||!Number.isInteger(v.seed)||!num(v.seed,0,4294967295)||!Array.isArray(v.seenRooms)||v.seenRooms.length>84||!v.seenRooms.every(id)||new Set(v.seenRooms).size!==v.seenRooms.length||!Array.isArray(v.opportunities)||v.opportunities.length>(v.version===3?1:2)||!Array.isArray(v.entities)||v.entities.length>(v.version===2?5:1))return false;
 if(v.version!==3){
  // Validate the bounded legacy envelope and retained actors. Removed actors
  // need no geometry or asset support and can never enter the live world.
  if(!v.opportunities.every(o=>keys(o,['id','kind','roomId','status'])&&id(o.id)&&['hollow','crawler'].includes(o.kind)&&id(o.roomId)&&['pending','arming','spent'].includes(o.status))||new Set(v.opportunities.map(o=>o.kind)).size!==v.opportunities.length||!v.entities.every(e=>e&&typeof e==='object'&&['hollow','crawler'].includes(e.kind)))return false;
  try{return rsEncountersValid(rsEncountersUpgrade(v));}catch{return false;}
 }
 if(!v.opportunities.every(o=>keys(o,['id','kind','roomId','status'])&&id(o.id)&&o.kind==='hollow'&&id(o.roomId)&&['pending','arming','spent'].includes(o.status)))return false;
 for(const e of v.entities){if(!keys(e,['id','kind','x','y','z','hp','alive','revealed','phase','clock','phaseTime','age','normal','forward','yaw','roomId','radius','scale','height','breathClock','stepClock','travel','escapeTime','grace','legacy'])||!id(e.id)||e.kind!=='hollow'||!id(e.roomId)||!num(e.x,-100000,100000)||!num(e.y,-100000,100000)||!num(e.z,-1000,1000)||!num(e.hp,0,1050)||typeof e.alive!=='boolean'||typeof e.revealed!=='boolean'||!['stalk','charge','windup','recover','dead'].includes(e.phase)||!vec(e.normal)||!vec(e.forward)||!num(e.yaw,-Math.PI-.001,Math.PI+.001)||!num(e.radius,.1,1))return false;
  if(!['clock','phaseTime','age','breathClock','stepClock','travel','escapeTime','grace'].every(k=>num(e[k],0,1e12))||e.alive&&e.hp<=0||!e.alive&&e.phase!=='dead'||!v.opportunities.some(o=>o.id===e.id&&o.roomId===e.roomId&&o.status==='spent')||!num(e.scale,.5,2.1)||!num(e.height,.58,4.2)||'legacy'in e&&e.legacy!==true)return false;
  if(!e.legacy&&(e.scale!==RSE_BODY.hollow.scale||e.height!==RSE_BODY.hollow.height||e.radius!==RSE_BODY.hollow.radius))return false;
 }
 return true;
}
function rsEncountersRestore(saved,s=RS.active){if(!s||!rsEncountersValid(saved))return false;rsEncountersLeave();s.encounters=rsEncountersUpgrade(saved);rsState().encounters=s.encounters;for(const e of s.encounters.entities)if(e.alive){e.grace=Math.max(4,e.grace);e.breathClock=0;}return true;}
function rsEncounterPreview(kind='hollow'){
 if(!artReady||kind!=='hollow')return false;const roomId='R05';rsPreview('rs_stairs',roomId);review.ai=true;review.damage=false;review.unlimited=true;const s=RS.active,room=RW.byId[roomId];Object.assign(player,room.safePose,{vx:0,vy:0});s.z=room.z;s.room=room.id;s.committed=true;s.clock=30;
 const e=rsEncounterCreate(kind,room.id);if(!e)return false;
 s.encounters={version:3,seed:49271,seenRooms:[room.id],opportunities:[{id:e.id,kind,roomId:room.id,status:'spent'}],entities:[e]};rsState().encounters=s.encounters;player.a=Math.atan2(e.y-player.y,e.x-player.x);aimPitch=0;_safeX=player.x;_safeY=player.y;rsEncounterVoice(e,'awake');rsEncounterBreath(e);hudUpdate();return true;
}
