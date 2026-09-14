// Real raster comparisons at the actual doorway pose, including the gun.
const assert=require('node:assert'),fs=require('node:fs'),path=require('node:path'),runtime=require('./runtime_harness.cjs');
const canvas=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const r=runtime({nativeCanvas:canvas}),run=s=>r.eval(s);let checks=0;
const output=process.env.TRANSFER_CAPTURE_DIR;
if(output)fs.mkdirSync(output,{recursive:true});
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function snap(name){run('render();');if(output)fs.writeFileSync(path.join(output,name+'.png'),r.get('game').toBuffer('image/png'));return new Uint8ClampedArray(run('wc.getImageData(0,0,W,H).data'));}
function diff(a,b){let n=0;for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2])n++;return n;}
function start(level){run(`startRun();${level?'loadStage(1);':''}mode='playing';enemies=[];releaseInputs();settings.reduce=false;visualViewport.width=844;visualViewport.height=390;resize();player.hp=100;shake=liminal.dark=hurt=whiteFlash=muzzle=0;weapon=0;shotCD=.4;weaponDrop=0;recoil=.25;sway=.12;bob=1.2;aimPitch=11;`);}
(async()=>{
 await run(`Promise.all([prepareAtlas(ASSETS.monsters,false),prepareAtlas(ASSETS.weapons,true),prepareEnvironment(ASSETS.environment),prepareCorruption(ASSETS.corruption,ASSETS.heart,ASSETS.heartDead)]).then(([m,g])=>{monsterSprites=m;gunSprites=g;buildWardenSprite();artReady=true;})`);
 for(const level of [0,1]){
  test(`chapter ${level+1}: entry preserves physical pose, velocity, aim and held inputs`,()=>{
   start(level);run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;player.vx=d.nx*3;player.vy=d.ny*3;keys.KeyW=true;keys.KeyF=true;mouseFire=true;}`);
   const before=snap('chapter-'+level+'-entry-before');const pitch=run('aimPitch'),recoil=run('recoil'),bob=run('bob');run('tfEnter();');const after=snap('chapter-'+level+'-entry-after');
   assert.equal(diff(before,after),0,'same physical camera has identical scene and gun on either side');
   assert.equal(run('aimPitch'),pitch);assert.equal(run('recoil'),recoil);assert.equal(run('bob'),bob);assert.equal(run('player.vx'),3);assert.equal(run('player.vy'),0);assert(run('keys.KeyW&&keys.KeyF&&mouseFire'));assert.equal(run('TF.active.fade'),0);
  });
  test(`chapter ${level+1}: looking back across entry shows the same parked hospital`,()=>{
   start(level);run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis+Math.PI-.12;player.vx=d.nx*2;player.vy=d.ny*2;}`);
   const before=snap('chapter-'+level+'-entry-back-before');run('tfEnter();');const after=snap('chapter-'+level+'-entry-back-after');assert.equal(diff(before,after),0);assert(run('TF_PORTAL_STATS.entryPixels>500'));
  });
  test(`chapter ${level+1}: real hallway can be seen before crossing`,()=>{
   start(level);run(`{const d=TF_DOORS[stage];player.x=d.x-d.nx*1.25;player.y=d.y-d.ny*1.25;player.a=d.axis;player.vx=player.vy=0;}`);snap('chapter-'+level+'-approach');assert(run('TF_PORTAL_STATS.entryPixels>500'));assert(!run('tfRunning()'));
  });
  test(`chapter ${level+1}: hospital is visible from the hall and its simulation remains parked`,()=>{
   run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}tfEnter();player.x=TF_END-1.2;player.y=4.5;player.a=0;TF.active.wardenGone=true;player.vx=3;player.vy=0;`);
   const map=run('map'),state=run('JSON.stringify({stageTime,arrival:CH.arrival,clock:TF.active.clock,keys,aimPitch,recoil,bob})');snap('chapter-'+level+'-exit-approach');assert(run('TF_PORTAL_STATS.exitPixels>500'));assert.equal(run('map'),map);assert.equal(run('JSON.stringify({stageTime,arrival:CH.arrival,clock:TF.active.clock,keys,aimPitch,recoil,bob})'),state);
  });
  test(`chapter ${level+1}: exit camera and gun agree exactly with restored actual level`,()=>{
   run(`player.x=TF_END+.28;player.y=4.5;player.a=0;keys.KeyW=true;mouseFire=true;aimPitch=11;`);
   const before=snap('chapter-'+level+'-exit-before'),expected=run('JSON.stringify(tfHostPose(player.x,player.y,player.a,player.vx,player.vy,"exit"))');run('tfRestoreHost(true);');const after=snap('chapter-'+level+'-exit-after');
   assert.equal(diff(before,after),0,'full exit frame including held gun matches the real restored level');
   assert.equal(run('JSON.stringify({x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy})'),expected);assert(run('fits(player.x,player.y)&&keys.KeyW&&mouseFire'));assert.equal(run('aimPitch'),11);assert.equal(run('liminal.dark'),0);assert.equal(run('TF.campaign.status'),'complete');assert(!run('environmentProps.some(p=>p.tfDoor)'));
  });
 }
 test('exit remains open until the entire player capsule clears the physical doorway',()=>{
  for(const level of [0,1]){
   start(level);run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}tfEnter();player.x=TF_END+.1;player.y=4.5;player.a=0;player.vx=player.vy=0;tfUpdate(0);`);
   assert(run('tfRunning()'));assert(run(`TF.active.host.map[${level?7:12}][31]===0`));
   run('player.x=TF_END+.27;tfUpdate(0);');assert(!run('tfRunning()'));assert(run('fits(player.x,player.y)'));assert(run(`map[${level?7:12}][31]!==0`));
  }
 });
 test('three-metre threshold neighborhoods use an exact invertible unit transform',()=>{
  run('player.x=TF_END;');for(const d of [-3,-1,-.01,0,.01,1,3])assert.equal(run(`tfViewX(player.x+${d})`),run(`player.x+${d}`));
  for(const level of [0,1])for(const a of [0,.2,Math.PI,-1]){run(`{const door=TF_DOORS[${level}],p=tfEntryPose(door.x+.02,door.y-.03,${a},2,-1,door);globalThis.portalRoundTrip=tfHostPose(p.x,p.y,p.a,p.vx,p.vy,'entry',door);}`);assert(Math.abs(run('portalRoundTrip.a')-a)<1e-12);assert.equal(run('portalRoundTrip.vx'),2);assert.equal(run('portalRoundTrip.vy'),-1);}
 });
 console.log(`PASS ${checks} Transfer portal checks (native raster, not browser playtesting).`);
})().catch(e=>{console.error(e);process.exitCode=1;});
