// Actual authored geometry and native raster checks; not a phone/browser test.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
run('artReady=true;rsBuildWorld();');
test('the single rare presence keeps the same three huge dark reservoirs',()=>{
 assert.deepEqual(JSON.parse(run('JSON.stringify(RS_THREAT_ROOMS)')),{hollow:['R01','R05','R13']});
 assert(run("rsThreatRoomIds('hollow').every(id=>rsThreatRoomEligible(id,'hollow'))"));
 assert(run("!rsThreatRoomEligible('G05','hollow')&&!rsThreatRoomEligible('C07','hollow')&&!rsThreatRoomEligible('P01','hollow')"));
 assert(run("rsThreatRoomIds('hollow').every(id=>{const s=RW.byId[id];return s.h>=4.3&&(s.bounds[2]-s.bounds[0])*(s.bounds[3]-s.bounds[1])>2400})"));
 assert(run("['C03','C07','C15'].every(id=>!RW.byId[id].threatKind&&!RW.byId[id].renderPalette)"));
});
test('full architectural scope, ceiling heights and collision routes remain intact',()=>{
 assert.equal(run('RW.rooms.length'),84);assert.equal(run('new Set(RW.rooms.map(s=>s.floor)).size'),6);assert.equal(run('RW.folds.length'),6);
 assert.equal(run('RW.byId.C03.h'),2.42);assert.equal(run('RW.byId.C07.h'),2.42);assert.equal(run('RW.byId.R05.h'),6.3);
 assert(run('Object.values(RS_THREAT_ROOMS).flat().every(id=>{const s=RW.byId[id];return rsCanStand(s.safePose.x,s.safePose.y,s.z)&&s.ports.length>0&&RW.connections.some(c=>c.a===id||c.b===id)})'));
 assert.equal(run('RW.exit.return'),'sewer-grounds');
});
test('failed fixtures and all their emissive glass are dark before any encounter',()=>{
 assert(run('Object.values(RS_THREAT_ROOMS).flat().every(id=>RW.lights.some(l=>l.owner===id&&l.failed&&l.power===0))'));
 assert(run('RW.faces.filter(f=>f.failedLamp).length>30&&RW.faces.filter(f=>f.failedLamp).every(f=>f.mat===4&&!f.emissive)'));
 assert(run('Object.values(RS_THREAT_ROOMS).flat().every(id=>{const s=RW.byId[id];return s.threatPracticalLights.length===2&&s.threatPracticalLights.every(l=>l.power>0&&l.power<.7)})'));
});
test('room palette, water, raised ledges and baked faces agree on persistent darkness',()=>{
 assert(run('Object.values(RS_THREAT_ROOMS).flat().every(id=>{const s=RW.byId[id],sec=RR.sectors.get(id);return s.water>0&&s.ambientLight>=.04&&s.ambientLight<.06&&sec.faces.every(f=>f.palette===s.renderPalette)&&sec.water.every(f=>f.palette===s.renderPalette)})'));
 assert(run("RW.surfaces.filter(s=>['R01','R05','R13'].includes(s.parentRoom)).every(s=>s.renderPalette===RW.byId[s.parentRoom].renderPalette&&s.ambientLight===RW.byId[s.parentRoom].ambientLight)"));
 assert(run("RW.byId.C15.ambient==='silent'&&RW.byId.C15.ambience==='silent'"));
});
test('dark treatment leaves every other chapter room and its lighting unchanged',()=>{
 assert(run('RW.rooms.filter(s=>!s.threatKind).every(s=>!s.renderPalette&&s.ambientLight===RS_DISTRICTS[s.district].ambient*(s.kind.startsWith(\'reservoir\')||s.kind.startsWith(\'court\')?.78:1))'));
 assert(run('RW.lights.filter(l=>!RS_THREAT_ROOMS.hollow.includes(l.owner)).every(l=>!l.failed)'));
 assert(run("RR.sectors.get('G05').faces.every(f=>f.palette===RR_PALETTES.galleries)&&RR.sectors.get('C08').faces.every(f=>f.palette===RR_PALETTES.cubicles)"));
});
test('muzzle illumination is strictly local, bounded and reduced with reduced motion',()=>{
 run("RS.active={room:'R05',z:RW.byId.R05.z,clock:30,committed:true};Object.assign(player,{x:227,y:200});muzzle=.1;settings.reduce=false;");
 const near=run("rsThreatMuzzleAt(227,202,RS.active.z+1,'R05')");assert(near>.6&&near<1);
 assert.equal(run("rsThreatMuzzleAt(227,202,RS.active.z+1,'C08')"),0);assert.equal(run("rsThreatMuzzleAt(227,202,RS.active.z+1,'C01')"),0);
 assert.equal(run("rsThreatMuzzleAt(227,220,RS.active.z+1,'R05')"),0);
 run('settings.reduce=true;');assert(run("rsThreatMuzzleAt(227,202,RS.active.z+1,'R05')")<near*.3);
 run('muzzle=0;');assert.equal(run("rsThreatMuzzleAt(227,202,RS.active.z+1,'R05')"),0);
});
test('nearby surfaces and water actually brighten in the native raster during a shot',()=>{
 run("coarse=true;resize();player.a=Math.PI/2;camDX=0;camDY=1;projection=W/(2*Math.tan(.7));aimPitch=-projection*.12;horizon=H*.48+aimPitch;settings.reduce=false;muzzle=0;rsRenderWorld(true);var darkPixels=px.slice();muzzle=.1;rsRenderWorld(true);var flashDifference={wet:0,dry:0,sum:0};for(let i=0;i<RR.depth.length;i++){const d=px[i*4]+px[i*4+1]+px[i*4+2]-darkPixels[i*4]-darkPixels[i*4+1]-darkPixels[i*4+2];if(d>9){flashDifference.sum+=d;if(RR.water[i])flashDifference.wet++;else flashDifference.dry++;}}muzzle=0;");
 const diff=run('flashDifference');assert(diff.wet>300,JSON.stringify(diff));assert(diff.dry>300,JSON.stringify(diff));
});
test('reapplying the authored fixture pass cannot duplicate lamps or faces',()=>{
 const before=run('({lights:RW.lights.length,faces:RW.faces.length,water:RW.waterRegions.length})');run('rsThreatDressWorld();');
 assert.deepEqual(JSON.parse(JSON.stringify(run('({lights:RW.lights.length,faces:RW.faces.length,water:RW.waterRegions.length})'))),JSON.parse(JSON.stringify(before)));
});
console.log(count+' authored threat room/lighting checks passed.');
