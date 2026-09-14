// Production route/collision and native campaign state checks; no browser claim.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs'),routes=require('./audit_restroom_routes.cjs');
const r=runtime(),run=s=>r.eval(s),get=s=>JSON.parse(run('JSON.stringify('+s+')'));
let tests=0;function test(name,fn){fn();tests++;console.log('PASS '+name);}
function enter(){run('artReady=true;rsPreview("rs_stairs");rsEnter();releaseInputs();');}
function movePath(points){for(const [x,y,z]of points){run(`for(var i=0;i<9000&&Math.hypot(player.x-${x},player.y-${y})>.03;i++){var dx=${x}-player.x,dy=${y}-player.y,d=Math.hypot(dx,dy);rsMove(dx/d*Math.min(d,.06),dy/d*Math.min(d,.06));}`);assert(Math.hypot(run('player.x')-x,run('player.y')-y)<.04,'blocked route '+[x,y,z]);assert(Math.abs(run('RS.active.z')-z)<.08,'floor discontinuity');}}
test('the permanent outfall exists but its visible grate blocks ordinary exterior arrival',()=>{
 run('artReady=true;startRun();loadStage(3);');assert(!run('rsSewerOpen()'));assert(run('S4.faces.filter(f=>f.sewer).length>60'));assert(run('S4.faces.some(f=>f.sewerGate)'));assert(run('s4Solid(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));assert(!run('fits(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));
 run('player.x=51.7;player.y=37.4;player.a=Math.PI/2;mode="playing";s4Interact();');assert(!run('rsSewerOpen()'));assert(run('s4Solid(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));
});
test('the staircase is reversible before its lower threshold and sealed immediately beyond it',()=>{
 enter();run('player.x=5.5;player.y=13.9;RS.active.z=rsFloor(RW.byId["first-stair"],5.5,13.9);player.a=Math.PI/2;');assert(run('rsCanStand(5.5,13.8,RS.active.z)'));run('rsMove(0,.85);rsUpdate(0);');assert(run('RS.active.committed'));assert(!run('rsCanStand(5.5,13.99,RS_B1)'));run('rsMove(0,-2);');assert(run('player.y>=14.18'));assert(run('rsRunning()'));
 const seal=get('RW.faces.find(f=>f.seal)');assert(seal.v.every(v=>v[1]===14));assert.equal(seal.owner,'P01');assert(run('rsCanStand(9,22,RS_B1)'),'ordinary movement inside remains available');
});
test('the old tiny return passage has no exit; a hidden hatch leads to a physical four-floor climb',()=>{
 enter();run('RS.active.committed=true;player.x=583;player.y=319.1;RS.active.z=RS_B4;');assert(!run('rsSewerTryExit()'));assert.equal(run('stage'),2);assert.equal(run('RW.rooms.length'),84);assert.equal(run('RW.exit.return'),'sewer-grounds');assert(run('RW.byId["sewer-climb-1"].slope.dz===-RS_B4'));
 assert(!run('RW.doors.find(d=>d.id==="final-ajar-door").open'));run('rsDoorSet("final-ajar-door",true);');movePath(get('RW.sewer.waypoints'));assert(run('rsCanStand(player.x,player.y,RS.active.z)'));assert.equal(run('RW.exit.z'),0);assert(run('RW.waterRegions.some(w=>w.owner==="sewer-climb-0")'));assert(run('RW.faces.some(f=>f.water&&f.owner==="sewer-climb-0")'));
});
test('the sewer exit cannot be triggered remotely or before commitment',()=>{
 enter();assert(!run('rsSewerExit()'));run('player.x=600;player.y=265;RS.active.z=0;');assert(!run('rsSewerExit()'));assert(run('rsRunning()'));assert(!run('RS.test.sewerOpen'));
});
test('actual exit carries spent resources to the native Cerberus Journey without granting kills or supplies',()=>{
 run('RS.active.committed=true;player.hp=37;guns[0].ammo=2;guns[0].reserve=13;score=123;kills=7;weapon=0;var sewerBefore=s4dCapture();');assert(run('rsSewerTryExit()'));assert(!run('rsRunning()'));assert(run('s4Running()&&s4qRunning()&&CB.on&&CB.state==="waiting"'));assert(run('RS.test.complete&&RS.test.sewerOpen'));assert.equal(run('player.hp'),37);assert.equal(run('guns[0].ammo'),2);assert.equal(run('guns[0].reserve'),13);assert.equal(run('score'),123);assert.equal(run('kills'),7);assert(!run('S4Q.keys||S4Q.ext||S4Q.parkClear||S4Q.busClear||S4Q.supplies'));assert.equal(run('enemies.filter(e=>e.alive&&e.s4Quest).length'),12);assert(run('S4Q.moved&&S4Q.gate&&S4Q.done'));assert(run('CB.checkpoint.journey.sewerOpen'));assert(!run('s4Solid(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));assert(run('fits(player.x,player.y)'));
});
test('the earned outfall opens onto a collision-valid path into the actual garden fight',()=>{
 // Sample the same capsule positions that ordinary motion traverses.
 const points=[[51.7,39.5],[51.7,33.8],[54.7,33.8],[54.4,30],[49,26],[44,28],[43,29]];
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.08);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,y=a[1]+(b[1]-a[1])*j/n;assert(run(`fits(${x},${y},.19)`),'blocked exterior capsule '+[x,y]);}}
 run('player.x=43;player.y=29;player.a=-Math.PI/2;review.ai=true;cbTick(.05);');assert(run('CB.state==="waking"||CB.state==="active"'),'native proximity wake triggers');
});
test('native death retry retains earned hatch and the actual carried pre-boss resources',()=>{
 run('player.hp=1;guns[0].ammo=0;CB.hp=1;cbRestore();');assert(run('s4Running()&&CB.on&&CB.state==="waiting"'));assert.equal(run('player.hp'),37);assert.equal(run('guns[0].ammo'),2);assert.equal(run('score'),123);assert(run('rsSewerOpen()'));assert(!run('s4Solid(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));assert(run('CB.checkpoint.journey.sewerOpen'));assert(run('fits(player.x,player.y)'));
});
test('a fresh campaign closes the outfall again and preview completion cannot unlock it',()=>{
 run('startRun();loadStage(3);');assert(!run('RS.campaign.sewerOpen'));assert(!run('rsSewerOpen()'));assert(run('s4Solid(RS_SEWER_OUT.x,RS_SEWER_OUT.mouthY)'));
});
console.log(`PASS ${tests} sewer and one-way route checks.`);
