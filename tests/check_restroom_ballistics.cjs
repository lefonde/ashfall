// Actual chapter geometry and weapon updates. This is native runtime QA;
// rendered reticle/reflection agreement is checked separately by the renderer.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function near(a,b,t=.0001){assert(Math.abs(a-b)<=t,`${a} != ${b}`);}
run(`artReady=true;rsStartChapter();let rsTestAim={x:0,y:0,z:1};const rsRealAim=typeof rsAimDirection==='function'?rsAimDirection:null;rsAimDirection=()=>rsTestAim;`);
function place(x=9,y=19,z=-3.4){run(`releaseInputs();Object.assign(player,{x:${x},y:${y},a:0,vx:0,vy:0});RS.active.z=${z};aimPitch=0;shotCD=reloadT=meleeT=0;bullets=[];particles=[];tracers=[];RSB.lastHit=null;`);}
test('the real near-vertical camera and shot direction project to the same reticle',()=>{
 assert(run('typeof rsRealAim==="function"'));
 for(const pitch of[-85,-45,0,45,85]){
  place();run(`rsAimDirection=rsRealAim;player.a=.7;camDX=Math.cos(player.a);camDY=Math.sin(player.a);aimPitch=Math.tan(${pitch}*Math.PI/180)*projection;horizon=H*.48+aimPitch;var eyeCheck=rsShotOrigin(),aimCheck=rsShotDirection(),screenCheck=rsProject(eyeCheck.x+aimCheck.x*5,eyeCheck.y+aimCheck.y*5,eyeCheck.z+aimCheck.z*5);`);
  near(run('screenCheck.x'),run('W/2'));near(run('screenCheck.y'),run('rsViewCenterY()'));near(run('Math.hypot(aimCheck.x,aimCheck.y,aimCheck.z)'),1);
 }
 run('rsAimDirection=()=>rsTestAim;');
});
test('absolute traces hit the real ceiling and floor on a negative world floor',()=>{
 place();run(`const up=rsShotTrace({x:9,y:19,z:RS_B1+RS_EYE},{x:0,y:0,z:5},20),down=rsShotTrace({x:9,y:19,z:RS_B1+RS_EYE},{x:0,y:0,z:-5},20);`);
 assert.equal(run('up.face.owner'),'P01');near(run('up.z'),-.75);near(run('down.z'),-3.4);near(run('up.d'),1.1);near(run('down.d'),1.55);
});
test('downward traces on stairs strike the visible tread at its world height',()=>{
 run(`const stairY=8.3,stairZ=rsFloor(RW.byId['first-stair'],5.5,stairY),stairHit=rsShotTrace({x:5.5,y:stairY,z:stairZ+RS_EYE},{x:0,y:0,z:-1},10);`);
 assert.equal(run('stairHit.face.owner'),'first-stair');assert(run('stairHit.z>=stairZ-.001&&stairHit.z<stairZ+.19'));
});
test('shots pass above a balcony rail but hit its actual horizontal bar',()=>{
 run(`const railLow=rsShotTrace({x:330,y:304.5,z:RS_B3+.99},{x:0,y:1,z:0},4),railHigh=rsShotTrace({x:330,y:304.5,z:RS_B3+1.55},{x:0,y:1,z:0},4);`);
 assert(run('railLow.face&&railLow.d<1.4'));assert(run('!railHigh.face&&railHigh.d===4'));
});
test('closed doors occlude shots and the same ray clears a hinged open door',()=>{
 run(`const shotDoor=RW.doors[0],doorOrigin={x:shotDoor.x,y:shotDoor.y-1,z:shotDoor.z+1.2};rsDoorSet(shotDoor,false);const shut=rsShotTrace(doorOrigin,{x:0,y:1,z:0},1.5);rsDoorSet(shotDoor,true);const open=rsShotTrace(doorOrigin,{x:0,y:1,z:0},1.5);`);
 assert.equal(run('shut.face.doorId'),run('shotDoor.id'));assert(run('!open.face||open.face.doorId!==shotDoor.id'));run('rsDoorSet(shotDoor,false);');
});
test('shotgun pellets produce vertical world tracers and ceiling impacts',()=>{
 place();run(`weapon=0;guns[0].ammo=4;rsTestAim={x:0,y:0,z:1};shoot();`);assert.equal(run('guns[0].ammo'),3);assert(run('tracers.length>0&&tracers.every(t=>t.rsZ>t.rsFrom.z+.8&&t.rsZ<-.7)'));assert(run('RSB.lastHit?.face.owner==="P01"&&particles.every(p=>Number.isFinite(p.rsZ))'));
});
test('plasma and grave shots normalize full 3D velocity and keep weapon resources',()=>{
 for(const weapon of[1,2]){place();run(`weapon=${weapon};guns[weapon].ammo=4;rsTestAim={x:0,y:0,z:9};shoot();`);assert.equal(run('guns[weapon].ammo'),3);assert.equal(run('bullets.length'),1);near(run('Math.hypot(bullets[0].rsVX,bullets[0].rsVY,bullets[0].rsVZ)'),weapon===1?21:11);assert(run('bullets[0].rsVZ>bullets[0].speed*.999'));}
});
test('a high speed projectile sweep cannot tunnel through the ceiling',()=>{
 place();run(`weapon=1;guns[1].ammo=4;rsTestAim={x:0,y:0,z:1};shoot();updateBullets(.2);`);assert.equal(run('bullets.length'),0);assert(run('RSB.lastHit?.face.owner==="P01"'));near(run('RSB.lastHit.z'),-.75);
});
test('projectile world height does not follow a later player floor or camera change',()=>{
 place(9,19);run(`weapon=1;guns[1].ammo=4;rsTestAim={x:1,y:0,z:0};shoot();const startShotZ=bullets[0].rsZ,shotZVelocity=bullets[0].rsVZ;RS.active.z=RS_B6;aimPitch=H*.4;updateBullets(.02);`);
 assert.equal(run('bullets.length'),1);near(run('bullets[0].rsZ'),run('startShotZ+shotZVelocity*.02'));
});
test('water intersections occur at the real water plane before the solid floor',()=>{
 place(5.5,18.5);run(`const waterRay=rsShotTrace({x:5.5,y:18.5,z:RS_B1+RS_EYE},{x:0,y:0,z:-1},5);`);assert(run('waterRay.water.length===1&&waterRay.water[0].z>waterRay.z'));near(run('waterRay.water[0].z'),-3.378);
 run(`weapon=1;guns[1].ammo=4;rsTestAim={x:0,y:0,z:-1};shoot();const rippleBefore=RR.ripples.length;updateBullets(.2);`);assert(run('RR.ripples.length>rippleBefore&&particles.some(p=>p.rsWater)'));assert(run('RSB.lastHit.z<RS_B1+.001'));
});
test('particle trails retain absolute height when the player moves floors',()=>{
 place();run(`particles=[{x:9,y:19,z:0,rsZ:-1.8,vx:0,vy:0,vz:0,rsGravity:0,life:.12,max:.12,size:.03,color:'#ffffff'}];RS.active.z=RS_B6;updateEffects(.02);`);near(run('particles[0].rsZ'),-1.8);
});
test('actual impossible passage rotates shot direction and changes absolute height',()=>{
 run(`const shotFold=RW.folds.find(f=>f.id==='wrong-height'),sf=shotFold.a,foldRay=rsShotFold({x:sf.x-sf.nx*.2,y:sf.y-sf.ny*.2,z:sf.z+1.3},{x:sf.nx,y:sf.ny,z:0},1);`);
 assert(run('!!foldRay'));near(run('foldRay.origin.z'),run('shotFold.b.z+1.3'));near(run('Math.hypot(foldRay.direction.x,foldRay.direction.y,foldRay.direction.z)'),1);
});
test('bounded ray ranges and repeated shots keep effect arrays finite',()=>{
 place();run(`weapon=1;guns[1].ammo=4;rsTestAim={x:1,y:0,z:0};for(let i=0;i<200;i++)rsShoot(guns[1]);const boundRay=rsShotTrace({x:-900,y:-900,z:100},{x:1,y:0,z:0},Infinity);`);assert(run('bullets.length===80&&boundRay.d===96&&Number.isFinite(boundRay.x)'));run('updateBullets(4);updateEffects(1);');assert(run('bullets.length===0&&particles.length<=440&&tracers.length<=64'));
});
test('leaving the chapter restores the original horizontal campaign projectile path',()=>{
 run(`rsLeave('abort');stage=0;TF.active=null;mode='playing';weapon=1;shotCD=reloadT=meleeT=0;guns[1].ammo=4;bullets=[];shoot();`);assert(run('!rsRunning()&&bullets.length===1&&!Number.isFinite(bullets[0].rsZ)&&bullets[0].z===.52'));
});
console.log(count+' restroom ballistics checks passed.');
