// Production threshold checks. No browser layout, phone performance or listening
// claim is made by this source-runtime harness.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s),get=s=>JSON.parse(run('JSON.stringify('+s+')'));let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function preview(){run(`artReady=true;rsPreview('rs_stairs');releaseInputs();settings.reduce=false;sceneRenderScaleCap=1;resize();liminal.dark=0;`);}
function near(a,b,t=1e-8){assert(Math.abs(a-b)<t,`${a} != ${b}`);}

test('doorway coordinate transforms preserve yaw and optical velocity in both directions',()=>{
 for(const p of [[3.63,2.5,Math.PI,-4.65,0],[3.60,2.6,2.7,-3,.7],[3.62,2.3,-2.9,-1,-2]]){
  const result=get(`(()=>{const p=rsEntryPose(${p.join(',')});return rsHostPose(p.x,p.y,p.a,p.vx,p.vy)})()`);
  p.forEach((v,i)=>near(result[['x','y','a','vx','vy'][i]],v));
 }
});
test('the aperture stays visible inside the old near clip and during the crossing frame',()=>{
 preview();for(const x of [3.80,3.69,3.645,3.6401,3.61]){
  run(`player.x=${x};player.y=2.5;player.a=Math.PI;player.vx=player.vy=0;worldRender();zBuffer.fill(100);`);
  assert(run('rsStairAperture().some(r=>r[0]<=W/2&&r[0]+r[2]>W/2&&r[1]<=H/2&&r[1]+r[3]>H/2)'),`aperture vanished at ${x}`);
 }
});
test('entry preserves view, gun pose, held input and the exact portal camera',()=>{
 preview();run(`player.x=3.63;player.y=2.52;player.a=3.05;player.vx=-3.1;player.vy=.45;aimPitch=H*.075;bob=.81;recoil=.13;sway=.23;weaponDrop=.07;muzzle=.025;mouseFire=true;keys.KeyW=true;keys.KeyF=true;touchMove.x=.15;touchMove.y=-.4;
 const transitionBefore={pitch:aimPitch,bob,recoil,sway,weaponDrop,muzzle,W,H,viewSpeed:rsViewSpeed()};
 const transitionRenderWorld=rsRenderWorld;let transitionPortal;
 rsRenderWorld=function(preview){transitionRenderWorld(preview);if(preview)transitionPortal={x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,pitch:aimPitch,projection,horizon,point:rsProject(5.9,10,-1.3)};};
 worldRender();rsRenderStairPortal();rsRenderWorld=transitionRenderWorld;rsEnter();worldRender();
 const transitionAfter={pitch:aimPitch,bob,recoil,sway,weaponDrop,muzzle,W,H,viewSpeed:rsViewSpeed()};`);
  for(const [k,v]of Object.entries(get('transitionBefore')))near(get('transitionAfter')[k],v);
  assert(run('mouseFire&&keys.KeyW&&keys.KeyF&&touchMove.x===.15&&touchMove.y===-.4'));
  assert.equal(run('RS.active.fade'),0);assert.equal(run('liminal.dark'),0);assert.equal(run('rsGunDip()'),0);
  const portal=get('transitionPortal'),active=get('({x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,pitch:aimPitch,projection,horizon,point:rsProject(5.9,10,-1.3)})');
  for(const k of ['x','y','a','vx','vy','pitch','projection','horizon'])near(portal[k],active[k]);
  for(const k of ['x','y','d','scale'])near(portal.point[k],active.point[k]);
});
test('the current boot or gun tail is not cut at the entry plane',()=>{
 preview();run('player.x=3.63;player.y=2.5;let transitionStopped=0;const transitionTail={source:{stop(){transitionStopped++;}},nodes:[]};audio.voices.push(transitionTail);rsEnter();');assert.equal(run('transitionStopped'),0);assert(run('audio.voices.includes(transitionTail)'));
});
test('coarse entry does not resize the viewport at the threshold',()=>{
 preview();run('coarse=true;visualViewport.width=844;visualViewport.height=390;resize();const transitionSize=[W,H];player.x=3.63;player.y=2.5;player.a=Math.PI;rsEnter();');
 assert.deepEqual(get('[W,H]'),get('transitionSize'));assert.equal(run('sceneRenderScaleCap'),1);assert(run('sceneAngularView'));
});
test('actual movement crosses and backs out without an input release or forced turn',()=>{
 preview();run('player.x=3.72;player.y=2.5;player.a=Math.PI;player.vx=-4.65;player.vy=0;keys.KeyW=true;for(let i=0;i<10&&!rsRunning();i++)update(1/60);');
 assert(run('rsRunning()&&keys.KeyW&&player.vy>10&&RS.active.fade===0'));
 run('keys.KeyW=false;keys.KeyS=true;for(let i=0;i<120&&rsRunning();i++)update(1/60);');
 assert(run('!rsRunning()&&keys.KeyS'),'backout must keep the player-held backward input');
 assert(run('player.x>RS_ENTRANCE.hostX&&player.x<4.0&&player.y===2.5&&player.vx>0'));
 near(Math.abs(run('player.a')),Math.PI);assert.equal(run('liminal.dark'),0);
});
test('a manual precommit backout uses the exact inverse pose and current pitch',()=>{
 preview();run('player.x=3.63;player.y=2.5;player.a=Math.PI;rsEnter();player.x=5.64;player.y=-.55;player.a=2.2;player.vx=.45;player.vy=-5;aimPitch=projection*.3;const transitionReturn=rsHostPose(player.x,player.y,player.a,player.vx,player.vy),transitionPitch=aimPitch;keys.KeyA=true;rsLeave(false);');
 const expected=get('transitionReturn'),actual=get('({x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy})');assert.deepEqual(actual,expected);near(run('aimPitch'),run('transitionPitch'));assert(run('keys.KeyA&&!sceneAngularView'));
});
test('entry pace changes gradually along the stair and ordinary chapter speed remains bounded',()=>{
 preview();run('player.x=3.63;player.y=2.5;player.a=Math.PI;player.vx=-4.65;rsEnter();const transitionViewSpeed=rsViewSpeed();keys.KeyW=true;rsUpdate(1/60);');
 assert(Math.abs(run('rsViewSpeed()')-run('transitionViewSpeed'))<.015);
 run('releaseInputs();RS.active.committed=true;Object.assign(player,{x:8.7,y:21,a:0,vx:0,vy:0});RS.active.z=RS_B1;keys.KeyW=true;for(let i=0;i<10;i++)rsUpdate(1/60);releaseInputs();');
 assert(run('Math.hypot(player.vx,player.vy)<=4.25*mods.speed+.0001'));
});
test('the original doorway blocks a sideways backout into hospital walls',()=>{
 preview();run('player.x=3.63;player.y=2.5;player.a=Math.PI;rsEnter();player.x=4.3;player.y=-.4;player.vx=player.vy=0;rsMove(0,-.3);');assert(run('player.y>=RS_ENTRANCE.y&&rsRunning()'));
 run('rsMove(1.2,0);rsMove(0,-.3);rsUpdate(0);');assert(run('!rsRunning()&&fits(player.x,player.y)'));
});
test('looking back renders the actual parked corridor without mutating chapter state',()=>{
 preview();run('player.x=3.63;player.y=2.5;player.a=Math.PI;rsEnter();player.a=-Math.PI/2;player.vx=.1;player.vy=-.3;aimPitch=projection*Math.tan(.45);worldRender();const transitionRearState={player:{x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy},aimPitch,projection,horizon,camDX,camDY,planeX,planeY,liminal:JSON.stringify(liminal),clock:RS.active.clock,known:[...RS.active.known],z:[...zBuffer]},transitionRearArrays={active:RS.active,map,environmentProps,wardLights,enemies,bullets,particles,drops};rsRenderStairPortal();');
 const before=get('transitionRearState'),after=get('({player:{x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy},aimPitch,projection,horizon,camDX,camDY,planeX,planeY,liminal:JSON.stringify(liminal),clock:RS.active.clock,known:[...RS.active.known],z:[...zBuffer]})');assert.deepEqual(after,before);
 assert(run('transitionRearArrays.active===RS.active&&transitionRearArrays.map===map&&transitionRearArrays.environmentProps===environmentProps&&transitionRearArrays.wardLights===wardLights&&transitionRearArrays.enemies===enemies&&transitionRearArrays.bullets===bullets&&transitionRearArrays.particles===particles&&transitionRearArrays.drops===drops'));
 assert(run('rsHostPortalBuffer.count>1000&&rsPortalLens===1'),'visible reverse aperture must render and restore the temporary lens');
});
test('steep views through the reverse aperture use bounded overscan without forcing the camera level',()=>{
 for(const deg of [-70,-35,35,70]){run(`player.y=0;player.a=-Math.PI/2;aimPitch=projection*Math.tan(${deg}*Math.PI/180);worldRender();const rearPitch${Math.abs(deg)}${deg<0?'n':'p'}=aimPitch;rsRenderStairPortal();`);near(run('Math.atan(aimPitch/projection)'),deg*Math.PI/180);assert(run('rsPortalLens===1&&rsRunning()'));}
});
console.log(count+' seamless threshold source-runtime checks passed.');
