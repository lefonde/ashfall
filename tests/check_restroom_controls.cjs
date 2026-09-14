// Actual controller checks for the metre-scale chapter, not a browser simulation.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
run(`artReady=true;rsStartChapter();const rsControlSteps=[];rsFootstep=(depth,take,surface,speed)=>rsControlSteps.push({depth,speed,room:surface?.id});`);
function place(x,y,a=0){run(`releaseInputs();player.x=${x};player.y=${y};player.a=${a};RS.active.z=RS_B1;RS.active.steps=0;RS.active.foldCooldown=0;player.vx=player.vy=0;rsControlSteps.length=0;`);assert(run('rsCanStand(player.x,player.y,RS.active.z)'));}
function walk(t,key='KeyW'){run(`keys.${key}=true;for(let i=0;i<${Math.round(t*60)};i++)rsUpdate(1/60);releaseInputs();`);}
test('chapter shortcut starts a real resumable run after the resolved Heart',()=>{assert(run('rsRunning()&&!review.active&&HW.resolved&&HB.state==="dead"&&rsResumeAvailable()'));});
test('dry tiles in a room with a partial puddle produce dry footsteps',()=>{place(8.7,18.5);walk(.5);assert(run('rsControlSteps.length>0&&rsControlSteps.every(s=>s.depth===0)'));});
test('walking through the actual local puddle produces wet contacts',()=>{place(5.2,18.5);walk(.5);assert(run('rsControlSteps.length>0&&rsControlSteps.every(s=>s.depth>0&&s.depth<.075)'));});
test('idle and looking do not produce footsteps or travel',()=>{place(5.2,18.5);run('const rsLookPose=[player.x,player.y];aimPitch=H*.4;for(let i=0;i<180;i++){player.a+=.01;rsUpdate(1/60);}');assert(run('rsControlSteps.length===0&&player.x===rsLookPose[0]&&player.y===rsLookPose[1]'));});
test('a sustained view of upper floors remains pitched until the player looks again',()=>{assert(run('Math.abs(aimPitch-H*.4)<.001'));run('coarse=true;touchAim(0,-400);');assert(run('aimPitch>H*.4&&Math.abs(rsViewPitch())<=RS_VIEW_PITCH_LIMIT+1e-10'));run('for(let i=0;i<180;i++)rsUpdate(1/60);');assert(run('aimPitch>H*.4'));});
test('blocked movement does not fabricate a water-step cadence',()=>{place(.24,14.5,Math.PI);run('rsMove(-.2,0);RS.active.steps=0;rsControlSteps.length=0;');walk(2);assert(run('rsControlSteps.length===0'));});
test('ordinary backward motion remains backward with finite diagonal speed',()=>{place(8.7,21,0);walk(.25,'KeyS');assert(run('player.x<8.3'));run('keys.KeyW=keys.KeyD=true;for(let i=0;i<20;i++)rsUpdate(1/60);releaseInputs();');assert(run('Math.hypot(player.vx,player.vy)<=4.25*mods.speed+.001'));});
test('quiet traversal lowers the gun and firing raises it immediately',()=>{run('releaseInputs();RS.active.weaponRest=1;');assert(run('rsGunDip()>H*.2'));run('mouseFire=true;');assert.equal(run('rsGunDip()'),0);run('releaseInputs();RS.active.weaponReadyUntil=RS.active.clock;RS.active.weaponRest=0;for(let i=0;i<180;i++)rsUpdate(1/60);');assert(run('rsGunDip()>H*.2'));});
test('raised pool ledges and the curved gallery retain their logical room for exploration and saves',()=>{
 for(const [id,room]of [['R01-ledge-north','R01'],['G08-long-curve','G08']]){
  run(`releaseInputs();const pose_${room}=rsRoomStart(RW.byId['${id}']);if(!pose_${room})throw Error('No valid authored surface pose');Object.assign(player,pose_${room},{vx:0,vy:0});RS.active.z=pose_${room}.z;RS.active.room='top';rsUpdate(1/60);`);
  assert(run(`RS.active.room==='${room}'&&RS.active.visited.has('${room}')&&RS.active.known.has('${id}')`));
 }
});
test('the actual reticle stays on the gun sight line through full vertical aiming',()=>{
 run('const reticlePaint=[];const oldReticleFill=wc.fillRect;wc.fillRect=(x,y,w,h)=>reticlePaint.push({x,y,w,h});');
 for(const degrees of [-88,-45,0,45,88]){
  run(`aimPitch=Math.tan(${degrees}*Math.PI/180)*rsAimProjection();horizon=H*.48+aimPitch;reticlePaint.length=0;renderCrosshair();`);
  assert(run('Math.abs(reticlePaint[0].x-W/2)<1e-9&&Math.abs(reticlePaint[0].y-rsViewCenterY())<1e-9'));
 }
 run('wc.fillRect=oldReticleFill;');
});
test('vertical touch sensitivity is angular, matches yaw and remains available with reduced motion',()=>{
 run('aimPitch=0;settings.reduce=true;settings.sensitivity=.002;const lookYawBefore=player.a;touchAim(10,-10);const lookPitchOnce=rsViewPitch();const lookYawOnce=player.a-lookYawBefore;');
 assert(run('Math.abs(lookPitchOnce-lookYawOnce)<1e-10'));
 run('aimPitch=0;settings.sensitivity=.004;touchAim(10,-10);');assert(run('Math.abs(rsViewPitch()-lookPitchOnce*2)<1e-10'));
 run('settings.sensitivity=.00225;settings.reduce=false;');
});
console.log(count+' whole-controller chapter input/Foley checks passed.');
