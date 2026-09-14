// Whole-runtime behavior and native raster proof for the flooded Transfer.
const assert=require('node:assert'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function enter(){run(`startRun();mode='playing';player.x=31.5;player.y=12.3;player.a=-Math.PI/2;update(1/60);releaseInputs();`);assert(run('tfRunning()'));}
function aim(){run(`{const aimTarget=tfPresencePoint();player.a=Math.atan2(aimTarget.y-player.y,aimTarget.x-player.x);}`);}
test('fixed off-path presence is visible from arrival and hangs ahead for most of the walk',()=>{
 enter();const distances=[];for(const x of [2,90,220,300]){run(`player.x=${x};player.a=0;camDX=1;camDY=0;projection=400;horizon=148;`);distances.push(run('tfPresencePoint().x-player.x'));assert(run('project(TF_WARDEN.x,TF_WARDEN.y,1.55).scale*1.55>24'));}
 assert(distances[0]<24&&distances[3]>18);assert(distances[0]-distances[2]<2);
 run('player.x=382;');assert(run('tfPresencePoint().x-player.x<6.2'));assert(run('TF_WARDEN.y>4.8&&Object.isFrozen(TF_WARDEN)'));
});
test('optical fold is continuous, invertible and keeps near-foot movement natural',()=>{
 enter();for(const offset of [-350,-20,-1,-.02,0,.02,1,20,380]){run(`player.x=80;`);assert(Math.abs(run(`tfWorldX(tfViewX(player.x+${offset}))-player.x`)-offset)<1e-8);}
 assert(Math.abs(run('tfViewX(player.x+.02)-player.x')-.02)<.00002);
 const before=run('tfPresencePoint().x-player.x');run('player.x+=.01;');assert(Math.abs(run('tfPresencePoint().x-player.x')-before)<.01);
});
test('sustained breathing begins early and comes from the visible direction',()=>{
 enter();run(`const transferVoiceLog=[];audio.active=true;audio.play=(key,opt)=>{transferVoiceLog.push({key,opt});return null;};for(let i=0;i<720;i++)tfUpdate(1/60);`);
 assert(run('transferVoiceLog.filter(v=>v.key.startsWith("breath")).length>=3'));assert(run('transferVoiceLog[0].opt.pos.x>player.x'));assert(run('Math.hypot(transferVoiceLog[0].opt.pos.x-player.x,transferVoiceLog[0].opt.pos.y-player.y)<6'));
 run('audio.active=false;');
});
test('aiming at projected Warden triggers wall screams while health/position remain unchanged',()=>{
 enter();aim();run('weapon=1;shotCD=0;reloadT=0;const transferHP=player.hp;shoot();');assert.equal(run('TF.active.screams'),1);assert.equal(run('guns[1].ammo'),run('guns[1].mag-1'));assert.equal(run('TF.active.wardenAlpha'),1);assert.equal(run('player.hp'),run('transferHP'));assert.equal(run('enemies.length'),0);
 run('shotCD=0;shoot();');assert.equal(run('TF.active.screams'),1,'wall response has a bounded cooldown');
 run('TF.active.screamCooldown=0;player.a+=Math.PI;shotCD=0;shoot();');assert.equal(run('TF.active.screams'),1,'shooting away does not provoke him');
 run('TF.active.wardenGone=true;TF.active.wardenAlpha=0;');aim();run('shotCD=0;shoot();');assert.equal(run('TF.active.screams'),1,'departed presence cannot respond');
});
test('presence cannot respond through the exit wall and dry firing is silent',()=>{
 enter();run('player.x=394;');aim();assert(!run('tfShotFacesPresence()'));
 run('player.x=2;');aim();run('weapon=1;guns[1].ammo=0;guns[1].reserve=0;shotCD=0;shoot();');assert.equal(run('TF.active.screams'),0);
});
test('walking makes bounded surface ripples and uses the shared water performance',()=>{
 enter();run(`const transferWaterCalls=[];rsAudioWaterFootstep=o=>transferWaterCalls.push(o);rsAudioWaterMotion=()=>{};audio.active=true;keys.KeyW=true;for(let i=0;i<120;i++)tfUpdate(1/60);releaseInputs();audio.active=false;`);
 assert(run('transferWaterCalls.length>3'));assert(run('transferWaterCalls.every(q=>q.depth===TF_WATER&&q.room==="transfer"&&q.pos&&q.speed>0)'));assert(run('TF.active.ripples.length>0&&TF.active.ripples.length<=24'));
 run('for(let i=0;i<100;i++)tfWaterRipple(player.x,player.y,1);');assert.equal(run('TF.active.ripples.length'),24);
 run('player.vx=player.vy=0;for(let i=0;i<120;i++)tfUpdate(1/60);');assert.equal(run('TF.active.ripples.length'),0,'ripples expire during stillness');
});
test('impacts disturb water without changing the inherited projectile or controls',()=>{
 enter();run(`const impactCalls=[];rsAudioWaterImpact=(pos,power)=>impactCalls.push({pos,power});audio.active=true;explode({x:player.x+2,y:4.5,z:.52,owner:'player',kind:'plasma',color:'#54efff',damage:0});audio.active=false;`);
 assert.equal(run('TF.active.ripples.length'),1);assert.equal(run('impactCalls.length'),1);assert.equal(run('sceneAngularView'),false);assert.equal(run('RS.active'),null);
});
(async()=>{
 const nativeCanvas=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
 const n=runtime({nativeCanvas}),nr=s=>n.eval(s);
 await nr(`Promise.all([prepareAtlas(ASSETS.monsters,false),prepareEnvironment(ASSETS.environment)]).then(([m])=>{monsterSprites=m;buildWardenSprite();artReady=true;})`);
 nr(`startRun();mode='playing';player.x=31.5;player.y=12.3;player.a=-Math.PI/2;update(1/60);TF.active.fade=0;TF.active.clock=2;coarse=true;visualViewport.width=844;visualViewport.height=390;resize();player.x=2;player.y=4.5;player.a=0;aimPitch=0;worldRender();`);
 function pixels(){return nr('wc.getImageData(0,0,W,H).data');}
 function differences(a,b){let total=0,outside=0;const width=nr('W'),scan=nr('TF_SCAN.bottom');for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]){total++;if(Math.floor(i/4/width)<=scan[(i/4)%width])outside++;}return {total,outside};}
 test('native entrance frame contains a readable Warden, not a distance-hidden sprite',()=>{
  const before=pixels();nr('TF.active.wardenGone=true;tfRenderWorld();');const absent=pixels(),diff=differences(before,absent);assert(diff.total>30,JSON.stringify(diff));nr('TF.active.wardenGone=false;');
 });
 test('moving projectile reflection changes only visible flooded pixels',()=>{
  nr('tfRenderWorld();');const before=pixels();nr(`bullets.push({x:7,y:3.9,z:.52,r:.1,color:'#54efff'});tfRenderWorld();`);const after=pixels(),diff=differences(before,after);assert(diff.total>30,JSON.stringify(diff));assert.equal(diff.outside,0,'reflections must remain below each column water edge');
 });
 test('occluded projectile reflection is not drawn through the wall',()=>{
  nr('bullets=[];tfRenderWorld();');const before=pixels();nr(`bullets.push({x:7,y:8,z:.52,r:.1,color:'#54efff'});tfRenderWorld();`);assert.equal(differences(before,pixels()).total,0);
 });
 console.log(`PASS ${checks} flooded Transfer checks (native simulation/raster; no browser or listening claim).`);
})().catch(error=>{console.error(error);process.exitCode=1;});
