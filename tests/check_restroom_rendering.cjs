// Native raster checks. These exercise projected geometry and per-pixel masks;
// they do not claim a browser/phone GPU, DOM layout, or audio listening pass.
const assert=require('node:assert/strict');
const runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
run(`
function rsBuildWorld(){if(RW.ready)return;RW.ready=true;
 const s=rsSurface('render-test',rsRect(0,0,24,36),0,6,{room:true,district:'reservoirs'});
 rsAddWater(s,.3,rsRect(5,0,19,36));RW.index={};rsGridPut(RW.index,s.bounds,s);rsBuildShell();
 RW.owner=s.id;rsLamp(12,18,5.5,3,false,2);RW.owner=null;
}
RS.active={z:0,clock:1.4,committed:true};coarse=true;visualViewport.width=844;visualViewport.height=390;resize();
player.x=12;player.y=5;player.a=Math.PI/2;camDX=0;camDY=1;projection=W/(2*Math.tan(.7));settings.reduce=true;
function renderTestPitch(degrees){aimPitch=Math.tan(degrees*Math.PI/180)*projection;horizon=H*.48+aimPitch;bullets=[];particles=[];tracers=[];rsRenderWorld(true);}
function pixelDifference(before){let total=0,wet=0,dry=0;for(let i=0;i<RR.depth.length;i++)if(px[i*4]!==before[i*4]||px[i*4+1]!==before[i*4+1]||px[i*4+2]!==before[i*4+2]){total++;RR.water[i]?wet++:dry++;}return {total,wet,dry};}
`);
test('reticle optical axis and unit firing direction agree through nearly vertical pitch',()=>{
 for(const degrees of[-88,-70,-30,0,30,70,88]){
  run(`renderTestPitch(${degrees});const axis_${degrees<0?'m'+(-degrees):degrees}=rsAimDirection();`);
  const result=run(`(()=>{const a=rsAimOrigin(),d=rsAimDirection(),p=rsProject(a.x+d.x*10,a.y+d.y*10,a.z+d.z*10);return {length:Math.hypot(d.x,d.y,d.z),x:p.x,y:p.y,c:rsViewCenterY(),width:W,depth:p.d};})()`);
  assert(Math.abs(result.length-1)<1e-12);assert(Math.abs(result.x-result.width/2)<1e-8);assert(Math.abs(result.y-result.c)<1e-8);assert(Math.abs(result.depth-10)<1e-8);
 }
});
test('near-vertical floor and ceiling remain rasterized instead of culled away',()=>{
 for(const degrees of[-88,88]){run(`renderTestPitch(${degrees})`);assert(run('Array.from(RR.depth).filter(v=>v>0).length>W*H*.985'));}
});
test('level pitch keeps the original flat-camera projection exactly',()=>{
 run('renderTestPitch(0)');const p=run('rsProject(15,14,2.4)');assert(Math.abs(p.x-run('W/2-3*projection/9'))<1e-8);assert(Math.abs(p.y-run('horizon-(2.4-RS_EYE)*projection/9'))<1e-8);
});
test('absolute projectile height is independent of player floor changes',()=>{
 assert.equal(run("rsEffectPosition({x:12,y:15,z:.5,rsZ:8}).z"),8);run('RS.active.z=-10');assert.equal(run("rsEffectPosition({x:12,y:15,z:.5,rsZ:8}).z"),8);run('RS.active.z=0');
});
test('moving projectile reflection changes visible water pixels only',()=>{
 run(`renderTestPitch(-8);const reflectiveBefore=px.slice();const wetPass={z:.3,ids:new Set([1])};rsEffectStroke({x:12,y:14,z:2.2},{x:13,y:17,z:2.7},[255,100,60],.11,.8,wetPass,true);`);
 const diff=run('pixelDifference(reflectiveBefore)');assert(diff.wet>10,JSON.stringify(diff));assert.equal(diff.dry,0);
});
test('dry tile receives no projected water reflection',()=>{
 run(`player.x=2;renderTestPitch(-8);const dryBefore=px.slice();rsEffectStroke({x:2,y:14,z:2.2},{x:2,y:17,z:2.7},[255,100,60],.11,.8,wetPass,true);`);assert.equal(run('pixelDifference(dryBefore).total'),0);run('player.x=12');
});
test('submerged effects cannot create an above-water mirror image',()=>{
 run(`renderTestPitch(-8);const submergedBefore=px.slice();rsEffectStroke({x:12,y:14,z:.1},{x:13,y:17,z:.2},[255,100,60],.11,.8,wetPass,true);`);assert.equal(run('pixelDifference(submergedBefore).total'),0);
});
test('real wall geometry occludes both live projectiles and their water reflections',()=>{
 run(`RW.owner='render-test';rsBox(12,18,0,24,.35,6,18,true);RR.baked=false;renderTestPitch(-8);const wallBefore=px.slice();rsEffectStroke({x:12,y:23,z:2.2},{x:13,y:25,z:2.7},[255,100,60],.11,.8,wetPass,true);rsEffectStroke({x:12,y:23,z:2.2},{x:13,y:25,z:2.7},[255,100,60],.11,.8,null,true);`);
 assert.equal(run('pixelDifference(wallBefore).total'),0);
});
test('effect work is bounded even with saturated projectile and particle arrays',()=>{
 run(`renderTestPitch(0);bullets=Array.from({length:500},()=>({x:12,y:10,rsZ:1.8,life:1,size:.04,owner:'player'}));tracers=Array.from({length:500},()=>({x:12,y:11,rsZ:1.8,life:.05}));particles=Array.from({length:500},()=>({x:12,y:12,rsZ:1.8,life:.2,size:.015}));rsDrawEffects(new Map([[1,wetPass]]));`);
 assert(run('RR.effectCount<=176&&RR.reflectedEffects<=80'));
});
console.log(count+' chapter camera/projectile reflection raster checks passed.');
