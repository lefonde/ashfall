// Production-runtime integration, not browser/device rendering or listening QA.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs'),auditRoutes=require('./audit_restroom_routes.cjs');
const r=runtime(),run=source=>r.eval(source),get=source=>JSON.parse(run('JSON.stringify('+source+')'));
let count=0;function test(name,fn){try{fn();count++;console.log('PASS '+name);}catch(error){console.error('FAIL '+name);throw error;}}
function preview(scene='rs_stairs'){run(`artReady=true;rsPreview(${JSON.stringify(scene)});releaseInputs();`);}
function enter(){preview();run('keys.KeyW=true;for(var rsTestFrame=0;rsTestFrame<120&&!rsRunning();rsTestFrame++)update(1/60);releaseInputs();');assert(run('rsRunning()'),'forward input must cross the actual hospital doorway');}
function place(p,a=0){assert(p&&[p.x,p.y,p.z,a].every(Number.isFinite));run(`player.x=${p.x};player.y=${p.y};RS.active.z=${p.z};player.a=${a};player.vx=player.vy=0;_safeX=player.x;_safeY=player.y;`);assert(run('rsCanStand(player.x,player.y,RS.active.z)'),'test pose must be collision-valid');}
function walk(seconds,key='KeyW'){run(`keys.${key}=true;for(var rsTestFrame=0;rsTestFrame<${Math.ceil(seconds*60)};rsTestFrame++)update(1/60);releaseInputs();`);}
auditRoutes.install(r);

test('either earlier discovery selects left guidance while an undiscovered run keeps the right exit',()=>{
 for(const chapter of [1,2]){run(`startRun();Object.assign(TF.campaign,{status:'complete',entryChapter:${chapter}});loadStage(2);hbSkip();`);assert(run('HW.warden.wgLeft&&rsUnlocked()'));assert.equal(run('map[2][3]'),0);}
 run('startRun();loadStage(2);hbSkip();');assert(!run('HW.warden.wgLeft||rsUnlocked()'));assert.notEqual(run('map[2][3]'),0);
});
test('the new entrance adds only two cells at the far end of the existing left corridor',()=>{
 run('startRun();loadStage(2);hbSkip();var rsTestNormalMap=map.map(row=>row.slice());TF.campaign.status="complete";HW.restroomUnlocked=true;rsHostDoor();');
 assert.deepEqual(get('map.flatMap((row,y)=>row.map((v,x)=>v===0&&rsTestNormalMap[y][x]!==0?[x,y]:null).filter(Boolean))'),[[2,2],[3,2]]);assert.equal(run('MW'),64);assert.equal(run('MH'),64);
});
test('both Warden guides traverse the old corridor and disappear once at fixed off-path positions',()=>{
 for(const scene of ['rs_left','rs_right']){preview(scene);assert(run('Array.from({length:300},(_,i)=>wgPoint(wgPath().length*i/299)).every(p=>fits(p.x,p.y,HW.warden.r))'));
  run('for(var rsTestFrame=0;rsTestFrame<3000&&HW.warden.wgProgress<wgPath().length;rsTestFrame++){var rsTestP=wgPoint(Math.max(0,HW.warden.wgProgress-3));player.x=rsTestP.x;player.y=rsTestP.y;player.vx=4.65;wgTick(1/60);}');
  const corner=get('[HW.warden.x,HW.warden.y]');assert(corner[1]<1.6);run('for(var rsTestFrame=0;rsTestFrame<120;rsTestFrame++)wgTick(1/60);');assert(run('HW.warden.wgGone&&!HW.warden.alive'));assert.deepEqual(get('[HW.warden.x,HW.warden.y]'),corner);
  run('player.x=32.5;player.y=2.5;for(var rsTestFrame=0;rsTestFrame<120;rsTestFrame++)wgTick(1/60);');assert(run('HW.warden.wgGone'));
 }
});
test('Heart checkpoint restore preserves the chosen guidance route',()=>{
 preview('rs_left');run('hwRestore();');assert(run('HW.warden.wgLeft&&rsUnlocked()&&map[2][3]===0'));preview('rs_right');run('hwRestore();');assert(!run('HW.warden.wgLeft'));
});
test('projectiles pass the scenic guide without damage, collision burst or hit marker',()=>{
 preview('rs_left');run('HW.warden.x=6.7;HW.warden.y=1.48;HW.warden.wgProgress=wgPath().length;enemies=[HW.warden];player.x=6.7;player.y=2.5;player.a=-Math.PI/2;player.vx=player.vy=0;weapon=1;shotCD=reloadT=meleeT=hitmarker=0;guns[1].ammo=10;var rsTestGuideHP=HW.warden.hp;shoot();var rsTestGuideBullet=bullets[bullets.length-1];updateBullets(.04);');
 assert(run('bullets.includes(rsTestGuideBullet)'),'scenic body must not consume or detonate the projectile');assert(run('rsTestGuideBullet.y<HW.warden.y'));assert.equal(run('HW.warden.hp'),run('rsTestGuideHP'));assert.equal(run('hitmarker'),0);
});
test('walking through the doorway enters a separate scene with the Heart suspended',()=>{
 enter();assert.equal(run('liminal.mode'),'restrooms');assert.equal(run('stage'),2);assert.equal(run('RS.active.z'),0);assert.equal(run('enemies.length+drops.length'),0);assert(run('RS.active.host.map&&RS.active.host.props.length>0'));
 run('stageTime=35;HW.arrival=9;player.hp=17;var rsTestEnemies=JSON.stringify(RS.active.host.enemies);var rsTestDrops=JSON.stringify(RS.active.host.drops);');walk(.3);run('hurtPlayer(999);');assert.equal(run('stageTime'),35);assert.equal(run('HW.arrival'),9);assert.equal(run('player.hp'),17);assert.equal(run('JSON.stringify(RS.active.host.enemies)'),run('rsTestEnemies'));assert.equal(run('JSON.stringify(RS.active.host.drops)'),run('rsTestDrops'));
});
test('backing out before commitment restores the original stair entrance',()=>{
 enter();run('player.a=-Math.PI/2;aimPitch=H*.08;keys.KeyW=true;for(var rsTestFrame=0;rsTestFrame<90&&rsRunning();rsTestFrame++)update(1/60);');
 assert(!run('rsRunning()'));assert.equal(run('stage'),2);
 assert(run('fits(player.x,player.y)&&player.x>=RS_ENTRANCE.hostX&&player.x<RS_ENTRANCE.hostX+.2'),'stop on the crossing frame at the real hospital doorway');
 assert(run('Math.abs(angle(player.a))<.001&&player.vx>0&&Math.abs(player.vy)<.001'),'facing and forward momentum survive the inverse doorway transform');
 assert(run('keys.KeyW&&Math.abs(aimPitch/H-.08)<.001'),'held movement and look direction survive the crossing');
 assert(!run('RS.test.complete'));run('releaseInputs();');
});
test('the first ordinary stair descends exactly one floor and supports walking back up',()=>{
 enter();const stair=get('RW.surfaces.find(v=>v.slope&&Math.abs(v.z)<.01)'),q=stair.slope,dx=q.x1-q.x0,dy=q.y1-q.y0,len=Math.hypot(dx,dy);
 place({x:q.x0-dx/len*.4,y:q.y0-dy/len*.4,z:stair.z},Math.atan2(dy,dx));
 run('keys.KeyW=true;var rsTestHeightSteps=[];for(var rsTestFrame=0;rsTestFrame<1800&&RS.active.z>-3.399;rsTestFrame++){var rsTestOldZ=RS.active.z;update(1/60);rsTestHeightSteps.push(Math.abs(RS.active.z-rsTestOldZ));}releaseInputs();');
 assert(Math.abs(run('RS.active.z')+3.4)<.01);assert(run('Math.max(...rsTestHeightSteps)<.085'));
 run('keys.KeyS=true;for(var rsTestFrame=0;rsTestFrame<1800&&RS.active.z<-.001;rsTestFrame++)update(1/60);releaseInputs();');assert(Math.abs(run('RS.active.z'))<.01);
});
test('every ordinary room connection and stair centerline is collision-traversable in both directions',()=>{
 enter();const result=auditRoutes.connections(r);if(result.failures.length)console.error(JSON.stringify(result.failures.slice(0,12)));assert.equal(result.failures.length,0,'ordinary connection directions blocked; first failures printed above');assert(result.stairChecks>=10,'six floors need real bidirectional stair traversal');console.log(`  ${result.passed.length} ordinary connection directions traversed, including ${result.stairChecks} stair directions.`);
});
test('all six spatial folds preserve reversible travel, facing and relative height without a dark jump',()=>{
 enter();const folds=get('RW.folds');assert.equal(folds.length,6);
 for(const f of folds){const a=f.a,b=f.b,start={x:a.x-a.nx*.45,y:a.y-a.ny*.45,z:a.z};place(start,Math.atan2(a.ny,a.nx));run('RS.active.foldCooldown=0;RS.active.fade=0;var rsTestFoldCount=RS.active.folds;');
  const traveled=run(`rsMove(${a.nx*.85},${a.ny*.85})`);assert(Math.abs(traveled-.85)<.04,f.id+' travel must exclude teleport distance');assert.equal(run('RS.active.folds'),run('rsTestFoldCount')+1);assert(Math.abs(run('RS.active.z')-b.z)<.03);assert(Math.hypot(run('player.x')-(b.x-b.nx*.4),run('player.y')-(b.y-b.ny*.4))<.05,f.id+' transformed arrival');
  assert(Math.abs(run(`angle(player.a-(${Math.atan2(-b.ny,-b.nx)}))`))<.01,f.id+' facing');assert.equal(run('RS.active.fade'),0);
  run(`RS.active.foldCooldown=0;rsMove(${b.nx*.85},${b.ny*.85});`);assert(Math.hypot(run('player.x')-start.x,run('player.y')-start.y)<.06,f.id+' reverse position');assert(Math.abs(run('RS.active.z')-a.z)<.03);assert.equal(run('RS.active.folds'),run('rsTestFoldCount')+2);
 }
});
test('court galleries block falling while their actual lower floors remain traversable',()=>{
 enter();const cases=get(`(()=>{const out=[];for(const id of ['V01','V02','V03']){const court=RW.byId[id],deck=RW.surfaces.find(s=>s.court===id&&s.deck&&s.id.endsWith('-west'));if(!deck)continue;for(let y=deck.bounds[1]+2;y<deck.bounds[3]-2;y+=.5){const x=deck.bounds[2]-.7;if(rsCanStand(x,y,deck.z)&&rsCanStand(x+1.4,y,court.z)&&rsCanStand(x+2.8,y,court.z)){out.push({id,upper:{x,y,z:deck.z},lower:{x:x+1.4,y,z:court.z},edge:deck.bounds[2]});break;}}}return out;})()`);
 assert.equal(cases.length,3,'three courts need physically usable upper/lower test locations');
 for(const c of cases){place(c.upper);walk(1);assert(run(`player.x<${c.edge}-.15`),c.id+' upper edge');assert(Math.abs(run('RS.active.z')-c.upper.z)<.01);place(c.lower);walk(.25);assert(run(`player.x>${c.lower.x}+.5`),c.id+' actual lower floor');assert(Math.abs(run('RS.active.z')-c.lower.z)<.01);}
});
test('deep-side shortcut latches use the existing interaction and cannot open from the approach side',()=>{
 enter();const doors=get('RW.doors.filter(d=>d.shortcut&&d.deepSide).map(d=>({id:d.id,x:d.x,y:d.y,z:d.z,deepSide:d.deepSide}))');assert(doors.length>=2);
 for(const d of doors){const len=Math.hypot(d.deepSide.x-d.x,d.deepSide.y-d.y),nx=(d.deepSide.x-d.x)/len,ny=(d.deepSide.y-d.y)/len;
  run(`rsDoorSet(${JSON.stringify(d.id)},false);`);place({x:d.x-nx*.9,y:d.y-ny*.9,z:d.z},Math.atan2(ny,nx));run('rsInteract();');assert(!run(`RW.doors.find(d=>d.id===${JSON.stringify(d.id)}).open`),d.id+' approach latch');
  place({x:d.x+nx*.9,y:d.y+ny*.9,z:d.z},Math.atan2(-ny,-nx));run('rsInteract();');assert(run(`RW.doors.find(d=>d.id===${JSON.stringify(d.id)}).open`),d.id+' deep-side use');assert(run(`RS.active.shortcutState[${JSON.stringify(d.id)}]`));
 }
});
let navigation;
test('collision-resolved traversal reaches all 84 substantial rooms and the final return',()=>{
 enter();navigation=auditRoutes.audit(r,{openDoors:true});assert.equal(navigation.roomCount,84);assert.deepEqual(navigation.unreached,[],'unreachable rooms: '+navigation.unreached.join(', '));assert.deepEqual(navigation.missingFloors,[]);assert(navigation.exit,'final return must be physically reachable');
 console.log(`  Collision audit: ${navigation.states} reachable poses, ${navigation.rooms.length} rooms; ${navigation.distanceToExit.toFixed(1)} movement units to the exit in the sampled graph.`);
});
test('the first-pass final return depends on the wrong-height court connection',()=>{
 enter();const result=auditRoutes.audit(r,{openDoors:true,noShortcuts:true,blockFold:'wrong-height'});assert.equal(result.exit,null,'ordinary stairs and approach-side service doors must not bypass the compulsory court revelation');
 enter();const route=auditRoutes.audit(r,{openDoors:true,noShortcuts:true,stopAtExit:true});assert(route.exit,'the intended first-pass route must remain achievable');assert(route.folds.includes('wrong-height'));
});
test('normal reverse movement and diagonal normalization survive the separate scene',()=>{
 enter();const p=navigation.openPose;assert(p,'reachable navigation must supply open movement space');place(p);walk(.25,'KeyS');assert(run(`player.x<${p.x}-.2`));place(p);run('keys.KeyW=keys.KeyD=true;for(var rsTestFrame=0;rsTestFrame<25;rsTestFrame++)update(1/60);releaseInputs();');assert(run('Math.hypot(player.vx,player.vy)<=4.66*mods.speed'));
});
test('pause and the six-floor exploration map freeze travel and clear held input',()=>{
 for(const floor of [1,2,3,4,5,6]){enter();place(navigation.floorPoses[floor]);run('update(1/60);touchMove.x=1;mouseFire=true;pauseGame();var rsTestPaused=[player.x,player.y,RS.active.z,RS.active.clock];for(var rsTestFrame=0;rsTestFrame<30;rsTestFrame++)update(1/60);');assert.deepEqual(get('[player.x,player.y,RS.active.z,RS.active.clock]'),get('rsTestPaused'));assert.equal(run('touchMove.x'),0);assert.equal(run('mouseFire'),false);run('wfOpenMap();');assert(r.get('wfMapTitle').textContent.includes('B'+floor));run('wfCloseMap();');assert.equal(run('mode'),'paused');run('resumeGame();');}
});
test('the deep sewer exit keeps resources and enters the native outdoor campaign once',()=>{
 enter();run('RS.active.committed=true;player.hp=37;weapon=0;shotCD=0;shoot();var rsTestAmmo=guns[0].ammo;var rsTestScore=score;');place(navigation.exit);run('update(1/60);');assert(!run('rsRunning()'),'actual exit trigger must enter exterior');assert(run('RS.test.complete&&RS.test.sewerOpen'));assert.equal(run('player.hp'),37);assert.equal(run('guns[0].ammo'),run('rsTestAmmo'));assert.equal(run('score'),run('rsTestScore'));assert(run('fits(player.x,player.y)&&s4Running()&&CB.on&&CB.state==="waiting"'));assert(!run('rsSewerTryExit()'),'completion cannot fire again');run('completeWard();completeWard();');assert.equal(run('score'),run('rsTestScore'));assert.equal(run('mode'),'playing');
});
test('preview restart and chapter changes clear scene ownership without consuming campaign discovery',()=>{
 enter();run('RS.test.complete=true;startRun();');assert(!run('rsRunning()'));assert(!run('RS.campaign.complete'));assert.equal(run('TF.campaign.status'),'unseen');assert.equal(run('liminal.mode'),null);enter();run('loadStage(3);');assert(!run('rsRunning()'));assert.equal(run('stage'),3);assert(!run('document.body.classList.contains("restroom-scene")'));
});
test('restroom HUD suppresses the old Heart objective and retains normal pause access',()=>{
 enter();run('hudUpdate();');assert.equal(r.get('wardName').textContent,'THE LOWER RESTROOMS');assert.equal(r.get('goal').textContent,'');assert(r.get('bossHud').classList.contains('hidden'));assert(r.get('compass').classList.contains('hidden'));run('pauseGame();');assert.equal(run('mode'),'paused');
});
console.log(`PASS ${count} whole-runtime restroom scenarios (native; no browser/device/listening claim).`);
