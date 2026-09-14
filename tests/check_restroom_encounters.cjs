// Production Hollow scheduling/combat and real resolved movement. Native source
// checks demonstrate counterplay, not a human playthrough or phone timing.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function fixture(){
 assert(run('rsEncounterPreview()'));
 run(`review.active=false;review.damage=true;review.ai=true;review.unlimited=false;mode='playing';releaseInputs();player.hp=100;mods.damage=mods.life=mods.speed=mods.reload=1;difficulty=1;RS.active.clock=30;RS.active.committed=true;aimPitch=0;dashT=hurt=shotCD=reloadT=meleeT=meleeCD=0;bullets=[];particles=[];tracers=[];RSB.lastHit=null;var testedEnemy=RS.active.encounters.entities[0];rsAimDirection=nativeAimDirection;`);
}
function firingFixture(weapon){fixture();run(`Object.assign(player,{x:testedEnemy.x+3,y:testedEnemy.y});var targetShot={x:testedEnemy.x,y:testedEnemy.y,z:testedEnemy.z+.04*testedEnemy.scale},testAim=rsShotUnit({x:targetShot.x-player.x,y:targetShot.y-player.y,z:targetShot.z-rsShotOrigin().z});rsAimDirection=()=>testAim;weapon=${weapon};guns[weapon].ammo=guns[weapon].mag;guns[weapon].reserve=guns[weapon].maxReserve;`);assert(run('rsEncounterClear(rsShotOrigin(),targetShot)'),'firing lane');}
run('artReady=true;rsStartChapter();var nativeAimDirection=rsAimDirection;');
test('one 12 percent lottery chooses only the unchanged three dark reservoirs',()=>{
 const v=run(`(()=>{let h=0;for(let i=1;i<=12000;i++){const q=rsEncountersSchedule(Math.imul(i,2654435761)>>>0);h+=q.opportunities.length;if(q.version!==3||q.opportunities.length>1)throw Error('invalid count');for(const o of q.opportunities)if(o.kind!=='hollow'||!['R01','R05','R13'].includes(o.roomId)||RW.byId[o.roomId].ambientLight>.06)throw Error('invalid room');}return h;})()`);assert(v>1200&&v<1700);
});
test('Hollow preview retains one invisible giant in R05 with 1050 HP and unchanged size',()=>{
 run('tfReady();');assert.equal(typeof r.get('restroomHollow').onclick,'function');r.get('restroomHollow').onclick();assert(run(`review.active&&review.ai&&!review.damage&&RS.active.room==='R05'&&RS.active.encounters.entities.length===1&&RS.active.encounters.entities[0].hp===1050&&RS.active.encounters.entities[0].scale===2.05&&!RS.active.encounters.entities[0].revealed`));assert(run('rsEncountersValid(rsEncountersSnapshot())'));
});
test('removed or unknown kinds cannot produce rooms, factories or previews',()=>{
 const before=run('rsEncountersSnapshot()');for(const kind of ['crawler','spider','brood','other']){assert.equal(run(`rsEncounterRooms('${kind}').length`),0);assert.equal(run(`rsEncounterCreate('${kind}','C07')`),null);assert.equal(run(`rsEncounterPreview('${kind}')`),false);}assert.deepEqual(run('rsEncountersSnapshot()'),before);
});
test('arming checkpoints resume incremental creation of one Hollow',()=>{
 fixture();run(`RS.active.encounters={version:3,seed:37,seenRooms:[],opportunities:[{id:'haunt-hollow',kind:'hollow',roomId:'R05',status:'pending'}],entities:[]};rsState().encounters=RS.active.encounters;rsEncountersUpdate(.016);var armingCopy=rsEncountersSnapshot();`);assert.equal(run('armingCopy.opportunities[0].status'),'arming');assert(run('rsEncountersValid(armingCopy)'));assert.equal(run('rsSaveRead().payload.scene.encounters.opportunities[0].status'),'arming');
 run(`rsEncountersRestore(armingCopy);var prepareFrames=0;while(RS.active.encounters.opportunities[0].status==='arming'&&prepareFrames++<1500)rsEncountersUpdate(.016);`);assert(run('prepareFrames>1&&prepareFrames<1500'));assert.equal(run('RS.active.encounters.entities.length'),1);assert(run('rsEncountersValid(rsEncountersSnapshot())'));
});
test('deferred spawn rechecks distance and never appears on top of the player',()=>{
 fixture();run(`var plannedEnemy=testedEnemy;Object.assign(player,{x:plannedEnemy.x,y:plannedEnemy.y});RS.active.encounters.entities=[];RS.active.encounters.opportunities[0].status='arming';RSE.spawnJobs.set('haunt-hollow',(function*(){return plannedEnemy;})());rsEncountersUpdate(.016);`);assert.equal(run('RS.active.encounters.entities.length'),0);assert.equal(run('RS.active.encounters.opportunities[0].status'),'spent');
});
test('spent rooms never reroll or duplicate on re-entry',()=>{
 fixture();const before=run('RSE.stats.spawns');run(`RS.active.room='R06';rsEncountersUpdate(0);RS.active.room='R05';for(let i=0;i<20;i++)rsEncountersUpdate(.05);`);assert.equal(run('RSE.stats.spawns'),before);assert.equal(run('RS.active.encounters.entities.length'),1);
});
test('invisible Hollow gives breath and water tells before it attacks',()=>{
 fixture();const b=run('RSE.stats.breaths'),s=run('RSE.stats.steps');run('for(let i=0;i<50;i++)rsEncountersUpdate(.05);');assert.equal(run('player.hp'),100);assert(run('!testedEnemy.revealed&&testedEnemy.phase==="stalk"'));assert(run(`RSE.stats.breaths>${b}&&RSE.stats.steps>${s}`));
});
test('standing still remains dangerous and the strike has an 850 ms visible tell',()=>{
 fixture();run(`var windupAt=null;for(let i=0;i<600&&windupAt===null;i++){rsEncountersUpdate(.05);if(testedEnemy.phase==='windup')windupAt=testedEnemy.age;}var hpAtWindup=player.hp;`);assert(run('windupAt>2.7&&windupAt<25&&testedEnemy.revealed'));assert.equal(run('hpAtWindup'),100);run('for(let i=0;i<16;i++)rsEncountersUpdate(.05);');assert.equal(run('player.hp'),100);run('rsEncountersUpdate(.05);');assert.equal(run('player.hp'),64);assert.equal(run('bullets.length'),0);
});
test('windup dodge uses actual water acceleration and collision with no dash',()=>{
 fixture();run(`Object.assign(player,{x:227,y:200,a:Math.PI,vx:0,vy:0});Object.assign(testedEnemy,{x:229,y:200,z:RS.active.z+1.9475,grace:0,phase:'windup',phaseTime:0,revealed:true});keys.KeyW=true;var dodgeStart=player.x;for(let i=0;i<53;i++)rsUpdate(1/60);keys.KeyW=false;var dodgeDistance=dodgeStart-player.x;`);assert.equal(run('player.hp'),100);assert(run('dodgeDistance>3&&dashT===0&&testedEnemy.phase==="recover"'));
});
test('charge acceleration and mandatory recovery leave a full reload window',()=>{
 fixture();run(`Object.assign(player,{x:242,y:200});Object.assign(testedEnemy,{x:219,y:200,phase:'charge',phaseTime:0,grace:0});var maxRush=0,firstRush=0,recoveryFrames=0;for(let i=0;i<110;i++){const x=testedEnemy.x,y=testedEnemy.y;rsEncountersUpdate(.05);const pace=Math.hypot(testedEnemy.x-x,testedEnemy.y-y)/.05;maxRush=Math.max(maxRush,pace);if(i===0)firstRush=pace;if(testedEnemy.phase==='recover')recoveryFrames++;}`);assert(run('maxRush>4&&maxRush<4.48&&firstRush<2.5&&recoveryFrames>=25'));assert(run('RSE_PACE.recovery>Math.max(...guns.map(g=>g.reload))'));
});
test('pause and resume grace suppress melee damage',()=>{
 fixture();run(`testedEnemy.x=player.x+1.9;testedEnemy.y=player.y;testedEnemy.phase='windup';testedEnemy.phaseTime=.84;testedEnemy.grace=0;mode='paused';rsEncountersUpdate(.05);`);assert.equal(run('player.hp'),100);assert.equal(run('testedEnemy.phaseTime'),.84);run(`mode='playing';testedEnemy.grace=4;rsEncountersUpdate(.05);`);assert.equal(run('player.hp'),100);
});
test('pellets do not freeze either the charge or its recovery window',()=>{
 fixture();run(`testedEnemy.grace=0;testedEnemy.phase='charge';testedEnemy.phaseTime=.9;for(let i=0;i<12;i++)rsEncounterDamage(testedEnemy,1);`);assert(run('testedEnemy.phase==="charge"&&testedEnemy.phaseTime===.9'));run(`testedEnemy.phase='recover';testedEnemy.phaseTime=.5;rsEncounterDamage(testedEnemy,1);`);assert(run('testedEnemy.phase==="recover"&&testedEnemy.phaseTime===.5'));
});
test('all three guns hit and reveal the unchanged scaled body',()=>{
 for(const weapon of [0,1,2]){firingFixture(weapon);run('shoot();if(weapon!==0)updateBullets(.5);');assert(run('testedEnemy.revealed&&testedEnemy.hp<1050'),`weapon ${weapon}`);assert.equal(run('guns[weapon].ammo'),run('guns[weapon].mag-1'));}run('rsAimDirection=nativeAimDirection;');
});
test('unchanged health still requires 62 plasma hits or 5 grave hits',()=>{
 for(const [weapon,shots] of [[1,62],[2,5]]){firingFixture(weapon);run(`var firedCount=0;while(testedEnemy.alive&&firedCount<100){shotCD=reloadT=meleeT=0;guns[weapon].ammo=guns[weapon].mag;shoot();updateBullets(.5);firedCount++;}`);assert.equal(run('firedCount'),shots);assert.equal(run('testedEnemy.alive'),false);}run('rsAimDirection=nativeAimDirection;');
});
test('head has a vertical hit volume and actual ceilings block overhead shots',()=>{
 fixture();run(`var head=rsEncounterSpheres(testedEnemy)[2],headShot=rsEncounterRay({x:head.x+2,y:head.y,z:head.z},{x:-1,y:0,z:0},4);`);assert(run('headShot?.enemy===testedEnemy'));
 run(`testedEnemy.x=player.x;testedEnemy.y=player.y;testedEnemy.z=RW.byId.R05.ceil+3;var roofWall=rsShotTrace(rsShotOrigin(),{x:0,y:0,z:1},12),roofEnemy=rsEncounterRay(rsShotOrigin(),{x:0,y:0,z:1},roofWall.d);`);assert(run('roofWall.face&&!roofEnemy'));
});
test('actual sealed belly flanks and upper chest geometry all receive hits',()=>{
 fixture();run(`Object.assign(testedEnemy,{x:227,y:200,forward:{x:0,y:1,z:0},clock:0});var sealedProbes=[];
 for(const phase of ['stalk','charge','windup']){testedEnemy.phase=phase;const faces=rscHollowMesh(testedEnemy).map(f=>({...f,v:f.v.map(p=>rscPoint(p,testedEnemy,rscBasis(testedEnemy)))}));
  for(const [name,x,z]of [['front belly',0,.04],['swollen flank',.31,.285],['upper chest',.12,.47]]){const origin={x:testedEnemy.x+x*testedEnemy.scale,y:testedEnemy.y+4,z:testedEnemy.z+z*testedEnemy.scale},direction={x:0,y:-1,z:0};sealedProbes.push({name,phase,mesh:faces.some(f=>rsShotTriangle(origin,direction,f,8)),hit:!!rsEncounterRay(origin,direction,8)});}
 }`);for(const probe of run('sealedProbes'))assert(probe.mesh&&probe.hit,JSON.stringify(probe));
});
test('full giant body cannot pass low arches or solid pillars',()=>{
 fixture();assert(run('rsEncounterFloorFit(testedEnemy.x,testedEnemy.y,RS.active.z,testedEnemy.radius,testedEnemy.height)'));assert(run('!rsEncounterFloorFit(RW.byId.C07.safePose.x,RW.byId.C07.safePose.y,RW.byId.C07.z,testedEnemy.radius,testedEnemy.height)'));
 run(`var beforeSolids=RW.solids.length;RW.owner='R05';rsBox(testedEnemy.x+1.3,testedEnemy.y,RS.active.z+2.7,.12,3,1.2,11,true);rsIndexSolids();var archBlocked=!rsEncounterFloorEdge(testedEnemy,{x:testedEnemy.x+3,y:testedEnemy.y},RS.active.z,testedEnemy.radius,testedEnemy.height);rsBox(testedEnemy.x-1.3,testedEnemy.y,RS.active.z,.12,3,6.3,11,true);rsIndexSolids();var pillarBlocked=!rsEncounterFloorEdge(testedEnemy,{x:testedEnemy.x-3,y:testedEnemy.y},RS.active.z,testedEnemy.radius,testedEnemy.height);for(let i=beforeSolids;i<RW.solids.length;i++)RW.solids[i].disabled=true;rsIndexSolids();`);assert(run('archBlocked&&pillarBlocked'));
});
test('thin partitions block overlapping colliders, melee and projectiles',()=>{
 firingFixture(1);run(`var thinBefore=RW.solids.length,thinX=(player.x+testedEnemy.x)/2;RW.owner='R05';rsBox(thinX,player.y,RS.active.z,.06,3,6.3,11,true);rsIndexSolids();var partitionWall=rsShotTrace(rsShotOrigin(),testAim,5),leaked=rsEncounterRay(rsShotOrigin(),testAim,partitionWall.d);shoot();updateBullets(.5);`);assert(run('!leaked&&testedEnemy.hp===1050&&!testedEnemy.revealed&&RSB.lastHit.face'));
 run(`testedEnemy.x=thinX-.22;testedEnemy.z=RS.active.z+1.9475;player.x=thinX+.22;player.a=Math.PI;rsAimDirection=nativeAimDirection;melee();testedEnemy.phase='windup';testedEnemy.phaseTime=.84;testedEnemy.grace=0;rsEncountersUpdate(.05);for(let i=thinBefore;i<RW.solids.length;i++)RW.solids[i].disabled=true;rsIndexSolids();`);assert.equal(run('testedEnemy.hp'),1050);assert.equal(run('player.hp'),100);
});
test('Hollow death awards exactly once and remains dead through checkpoints',()=>{
 fixture();run(`var killsBefore=kills;rsEncounterDamage(testedEnemy,9999);var rewarded=guns[0].reserve;rsEncounterDamage(testedEnemy,9999);rsEncountersUpdate(0);`);assert(run('kills===killsBefore+1&&guns[0].reserve===rewarded&&!testedEnemy.alive'));assert(run('rsSaveRead().payload.scene.encounters.entities[0].alive===false&&rsEncountersValid(rsEncountersSnapshot())'));
});
test('strict v3 schema rejects unsupported actors, extra fields and duplicate opportunities',()=>{
 fixture();const valid=run('rsEncountersSnapshot()');for(const mutate of [v=>v.extra={},v=>v.seed=-1,v=>v.entities[0].x=NaN,v=>v.entities[0].normal.extra=true,v=>v.entities[0].kind='crawler',v=>v.entities[0].surfaceRoute=[],v=>v.opportunities.push({...v.opportunities[0]}),v=>v.entities.push({...v.entities[0]})]){const copy=structuredClone(valid);mutate(copy);r.context.badEncounter=copy;assert.equal(run('rsEncountersValid(badEncounter)'),false);}
});
test('v2 filtering removes old actors without manufacturing a Hollow lottery',()=>{
 fixture();run(`var oldState={version:2,seed:73,seenRooms:['C07'],opportunities:[{id:'haunt-crawler',kind:'crawler',roomId:'C07',status:'spent'}],entities:[{kind:'crawler',hp:18}]};var accepted=rsEncountersValid(oldState);rsEncountersRestore(oldState);`);assert(run('accepted&&RS.active.encounters.version===3&&RS.active.encounters.seed===73&&RS.active.encounters.opportunities.length===0&&RS.active.encounters.entities.length===0&&RS.active.encounters.seenRooms[0]==="C07"'));
});
test('each standard weapon defeats the giant using actual movement, reloads and limited ammo',()=>{
 const results=[];
 for(const weapon of [0,1,2]){fixture();run(`
  Object.assign(player,{x:220,y:196,a:0,vx:0,vy:0});Object.assign(testedEnemy,{x:228,y:200,z:RS.active.z+1.9475,grace:0,phase:'charge',phaseTime:0});
  weapon=${weapon};guns.forEach((g,i)=>{g.ammo=g.mag;g.reserve=[48,144,9][i];});var initialAmmo=guns[weapon].ammo+guns[weapon].reserve,combatMinHP=100,combatFrames=0,combatReloads=0,lastReload=0,combatWay=0,combatTravel=0;
  var combatRoute=[{x:234,y:196},{x:234,y:208},{x:220,y:208},{x:220,y:196}];
  for(;combatFrames<2400&&testedEnemy.alive&&mode==='playing';combatFrames++){
   const target=combatRoute[combatWay];if(Math.hypot(target.x-player.x,target.y-player.y)<.35)combatWay=(combatWay+1)%4;
   const to=combatRoute[combatWay],dx=to.x-player.x,dy=to.y-player.y,len=Math.hypot(dx,dy)||1;
   const ex=testedEnemy.x-player.x,ey=testedEnemy.y-player.y;player.a=Math.atan2(ey,ex);aimPitch=rsAimProjection()*(testedEnemy.z+.04*testedEnemy.scale-rsShotOrigin().z)/Math.hypot(ex,ey);
   touchMove.x=(-Math.sin(player.a)*dx+Math.cos(player.a)*dy)/len;touchMove.y=-(Math.cos(player.a)*dx+Math.sin(player.a)*dy)/len;mouseFire=true;
   const oldX=player.x,oldY=player.y;rsUpdate(1/60);combatTravel+=Math.hypot(player.x-oldX,player.y-oldY);combatMinHP=Math.min(combatMinHP,player.hp);if(reloadT>0&&lastReload<=0)combatReloads++;lastReload=reloadT;
  }
  releaseInputs();var combatResult={weapon:${weapon},alive:testedEnemy.alive,playerHP:combatMinHP,seconds:combatFrames/60,travel:combatTravel,reloads:combatReloads,ammoSpent:initialAmmo-guns[weapon].ammo-guns[weapon].reserve+[12,50,3][weapon]};
 `);const v=run('combatResult');results.push(v);assert.equal(v.alive,false,JSON.stringify(v));assert(v.playerHP>0,JSON.stringify(v));assert(v.travel>10&&v.reloads>=1,JSON.stringify(v));assert(v.seconds<35,JSON.stringify(v));}
 console.log('Counterplay evidence: '+JSON.stringify(results));
});
test('leaving clears jobs and voices and restores ordinary campaign shooting',()=>{
 run(`rsAimDirection=nativeAimDirection;rsLeave(false,true);review.active=false;stage=0;TF.active=null;mode='playing';weapon=1;shotCD=reloadT=meleeT=0;guns[1].ammo=4;bullets=[];shoot();`);assert(run('RSE.voices.size===0&&RSE.paths.size===0&&RSE.spawnJobs.size===0'));assert(run('bullets.length===1&&!Number.isFinite(bullets[0].rsZ)'));
});
console.log(count+' restroom encounter checks passed.');
