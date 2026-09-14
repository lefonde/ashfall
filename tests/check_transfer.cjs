// Whole-runtime native checks. Art/audio/DOM layout are not browser-tested here.
const assert=require('assert'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s),get=s=>JSON.parse(run('JSON.stringify('+s+')'));
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function enter(level=0){
 run(`startRun();${level?'loadStage(1);':''}mode='playing';enemies=[];player.hp=19;player.x=${level?31.5:31.5};player.y=${level?7.5:12.3};player.a=${level?0:-Math.PI/2};update(1/60);`);
 assert(run('tfRunning()'),'threshold enters');
}
function finish(){run(`releaseInputs();player.y=4.5;player.a=0;keys.KeyW=true;for(let i=0;i<7000&&tfRunning();i++)update(1/60);releaseInputs();`);assert(!run('tfRunning()'),'finite walk leaves');}

test('both authored entrances exist and accept low health',()=>{
 for(const level of [0,1]){enter(level);assert.equal(run('TF.active.door.level'),level);assert.equal(run('player.hp'),19);assert.equal(run('enemies.length'),0);assert.equal(run('tfState().entryChapter'),level+1);}
});
test('both preview doors are reachable by ordinary collision-resolved walking',()=>{
 for(const level of [0,1]){
  run(`startRun();artReady=true;tfPreview(${level});keys.KeyW=true;for(let i=0;i<70&&!tfRunning();i++)update(1/60);`);
  assert(run('tfRunning()'),`walk into chapter ${level+1} door`);
 }
});
test('walking outside the thresholds does not trigger discovery',()=>{
 for(const level of [0,1]){run(`startRun();${level?'loadStage(1);':''}player.x=${level?30:33.5};player.y=${level?12.5:18};update(1/60);`);assert(!run('tfRunning()'));}
});
test('forward and backward at multiple facing angles always advance longitudinally',()=>{
 for(const angle of [0,Math.PI,Math.PI/4,-Math.PI/4,Math.PI*3/4])for(const key of ['KeyW','KeyS']){
  enter();run(`player.a=${angle};keys.${key}=true;for(let i=0;i<12;i++)update(1/60);`);assert(run('player.x>2.1'),angle+' '+key);
 }
});
test('strafe, walls, idle and look-only do not create phantom progress',()=>{
 enter();const origin=run('player.x');run(`keys.KeyD=true;for(let i=0;i<90;i++)update(1/60);`);assert.equal(run('player.x'),origin);assert(run('player.y<6'));
 run(`releaseInputs();for(let i=0;i<60;i++)update(1/60);player.vx=player.vy=0;const tfIdleX=player.x;keys.ArrowRight=true;for(let i=0;i<600;i++)update(1/60);`);
 assert.equal(run('player.x'),run('tfIdleX'));
});
test('diagonals normalize speed and backward dash obeys the same movement rule',()=>{
 enter();run(`keys.KeyW=true;keys.KeyD=true;update(.05);`);assert(run('Math.hypot(player.vx,player.vy)<=4.65+.00001'));
 for(const angle of [0,Math.PI]){enter();run(`player.a=${angle};keys.KeyS=true;dash();update(1/60);`);assert(run('player.x>2'));
 }
});
test('the entire corridor is collision-continuous, finite, and about 85 seconds at walking speed',()=>{
 enter();assert(run('tfFits(376,4.5)&&tfFits(390,4.5)&&tfFits(396,4.5)'));
 const h=run('player.hp');finish();assert.equal(run('player.hp'),h);
 assert(run('gameTime>80&&gameTime<92'),run('gameTime'));assert.equal(run('TF.campaign.status'),'complete');
});
test('host chapter timers and enemies remain suspended',()=>{
 run(`startRun();CH.arrival=12;stageTime=20;enemies=[{x:20,y:20,type:0,alive:true,hp:70,noticed:true}];player.x=31.5;player.y=12.3;player.a=-Math.PI/2;update(1/60);const tfHostEnemy=TF.active.host.enemies[0];keys.KeyW=true;for(let i=0;i<100;i++)update(1/60);`);
 assert.equal(run('CH.arrival'),12);assert.equal(run('stageTime'),20);assert.deepEqual(get('tfHostEnemy'),{x:20,y:20,type:0,alive:true,hp:70,noticed:true});
});
test('Warden has immutable corner coordinates, fades in place and cannot be a combat target',()=>{
 enter();const w=get('TF_WARDEN');run(`releaseInputs();player.x=380;player.y=4.5;player.a=0;for(let i=0;i<60;i++)update(1/60);`);
 assert.deepEqual(get('TF_WARDEN'),w);assert.equal(run('TF.active.wardenAlpha'),1);assert.equal(run('enemies.length'),0);
 run(`player.x=386;for(let i=0;i<35;i++)update(1/60);`);assert(run('TF.active.wardenGone'));assert.equal(run('TF.active.wardenAlpha'),0);
 run('shoot();melee();hurtPlayer(999,"test");');assert.equal(run('kills'),0);assert.equal(run('player.hp'),19);
 assert.deepEqual(get('TF_WARDEN'),w);assert(run('TF_WARDEN.y>4.8'));
});
test('passing while looking away still completes the disappearance',()=>{
 enter();run(`player.x=385.5;player.y=2.3;player.a=Math.PI;for(let i=0;i<40;i++)update(1/60);`);
 assert(run('TF.active.wardenGone'));
});
test('pause freezes the scene and resume releases held input',()=>{
 enter();run(`keys.KeyW=true;update(1/60);pauseGame();const tfPausedClock=TF.active.clock;const tfPausedX=player.x;for(let i=0;i<100;i++)update(1/60);`);
 assert.equal(run('TF.active.clock'),run('tfPausedClock'));assert.equal(run('player.x'),run('tfPausedX'));assert.equal(run('keys.KeyW'),undefined);
 run('resumeGame();');assert.equal(run('mode'),'playing');
});
test('both return rooms, consumed doors and ammo use survive leaving',()=>{
 for(const level of [0,1]){
  enter(level);run('weapon=0;shotCD=0;shoot();');assert.equal(run('guns[0].ammo'),5);finish();
  assert.equal(run('guns[0].ammo'),5);assert(run('fits(player.x,player.y)'));assert.equal(run('TF.campaign.entryChapter'),level+1);
  assert(run(`map[${level?7:12}][31]!==0`));assert(!run('environmentProps.some(p=>p.tfDoor)'));
 }
});
test('completion survives earlier checkpoints and chapter handovers, but a new run rearms it',()=>{
 run(`startRun();const tfOldCheckpoint=CH.checkpoint;player.x=31.5;player.y=12.3;player.a=-Math.PI/2;update(1/60);`);finish();
 run('CH.checkpoint=tfOldCheckpoint;chRestore();');assert(run('TF.campaign.status==="complete"&&map[12][31]!==0'));
 run('loadStage(1);');assert(run('TF.campaign.status==="complete"&&map[7][31]!==0'));
 run('loadStage(2);');assert.equal(run('TF.campaign.status'),'complete');
 run('startRun();');assert.equal(run('TF.campaign.status'),'unseen');assert.equal(run('map[12][31]'),0);
});
test('preview completion is isolated from the campaign',()=>{
 run(`startRun();artReady=true;tfPreview(1);player.x=31.5;player.y=7.5;player.a=0;update(1/60);`);assert(run('tfRunning()'));finish();
 assert.equal(run('TF.test.status'),'complete');assert.equal(run('TF.campaign.status'),'unseen');
 run('startRun();');assert.equal(run('map[12][31]'),0);
});
test('restart and scene changes restore the host and clear scene effects',()=>{
 enter();run('startRun();');assert(!run('tfRunning()'));assert.equal(run('liminal.mode'),null);assert(run('fits(player.x,player.y)'));
 enter(1);run('loadStage(2);');assert(!run('tfRunning()'));assert.equal(run('stage'),2);assert.equal(run('enemies.some(e=>e.tfScenic)'),false);
});
test('chapter objective, compass and contextual USE remain absent inside the hallway',()=>{
 enter(1);run('hudUpdate();');for(const id of ['goal','wardName','lifeHint','wfSystems'])assert.equal(r.get(id).textContent,'');
 assert(r.get('touchUse').classList.contains('hidden'));assert(r.get('compass').classList.contains('hidden'));
});
console.log(`PASS ${checks} whole-runtime Transfer scenarios (native simulation; no real-browser or listening claim).`);
