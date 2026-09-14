// Creature raster/geometry regressions. No browser or human-playtest claim.
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const r=require('./runtime_harness.cjs')(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
run(`
function rsBuildWorld(){if(RW.ready)return;RW.ready=true;
 const s=rsSurface('creature-test',rsRect(0,0,20,28),0,6,{room:true,district:'reservoirs'});
 rsAddWater(s,.3,rsRect(4,0,16,28));RW.index={};rsGridPut(RW.index,s.bounds,s);rsBuildShell();
 RW.owner=s.id;rsLamp(10,7,5.5,2.2,false,2);RW.owner=null;
}
RS.active={z:0,clock:1.4,committed:true,encounters:{entities:[]}};coarse=true;visualViewport.width=844;visualViewport.height=390;resize();
player.x=10;player.y=3;player.a=Math.PI/2;camDX=0;camDY=1;projection=W/(2*Math.tan(.7));settings.reduce=true;
function creature(kind='hollow',overrides={}){return {id:'sample',kind,x:10,y:9,z:.95,normal:{x:0,y:0,z:1},forward:{x:0,y:-1,z:0},yaw:-Math.PI/2,phase:'stalk',clock:.4,alive:true,revealed:true,roomId:'creature-test',...overrides};}
function baseline(degrees=-5){aimPitch=Math.tan(degrees*Math.PI/180)*projection;horizon=H*.48+aimPitch;rsRenderWorld(true);return px.slice();}
function differences(before){let total=0,wet=0,dry=0;for(let i=0;i<RR.depth.length;i++)if(px[i*4]!==before[i*4]||px[i*4+1]!==before[i*4+1]||px[i*4+2]!==before[i*4+2]){total++;RR.water[i]?wet++:dry++;}return {total,wet,dry};}
const creatureWater=new Map([[300,{kind:'waterReflection',z:.3,ids:new Set([1])}]]);
`);
test('hidden bodies have no direct pixels, water reflection or depth footprint',()=>{
 run(`const hiddenBefore=baseline();const hiddenDepth=RR.depth.slice(),hiddenReflection=RR.waterReflectionDepth.slice();RS.active.encounters.entities=[creature('hollow',{revealed:false})];rsDrawCreatures(creatureWater);`);
 assert.equal(run('differences(hiddenBefore).total'),0);assert.equal(run('RSC.drawn'),0);assert.equal(run('RSC.triangles'),0);assert(run('RR.depth.every((v,i)=>v===hiddenDepth[i])&&RR.waterReflectionDepth.every((v,i)=>v===hiddenReflection[i])'));
});
test('revealed Hollow has visible depth-tested swollen geometry',()=>{
 run(`const revealedBefore=baseline(0);RS.active.encounters.entities=[creature()];rsDrawCreatures(creatureWater);`);
 assert(run('differences(revealedBefore).total>120'));assert.equal(run('RSC.drawn'),1);assert(run('RSC.triangles>1500&&RSC.triangles<2600'));
});
test('closed belly, chest and back block through-rays with actual flesh',()=>{
 const hits=run(`(()=>{const faces=rscHollowMesh(creature()),hit=(x,z)=>faces.filter(f=>rsShotTriangle({x,y:1,z},{x:0,y:-1,z:0},f,2)).length;return [hit(0,.20),hit(.015,.33),hit(.22,.24),hit(0,-.06)];})()`);
 assert(hits.every(n=>n>=2),JSON.stringify(hits));
});
test('revealed water reflections alter only real visible water pixels',()=>{
 run(`const reflectionBefore=baseline(-12);RR.reflection.set(RR.waterReflectionDepth);for(const face of rscFaces(creature()))rsDrawFace(face,creatureWater.get(300));`);
 const d=run('differences(reflectionBefore)');assert(d.wet>40,JSON.stringify(d));assert.equal(d.dry,0);
});
test('cached animation poses still translate and turn each frame',()=>{
 const result=run(`(()=>{const e=creature(),a=rscFaces(e),original=a[0].v[0].slice(),cached=RSC.models.get(e);e.x+=2;e.forward={x:1,y:0,z:0};const b=rscFaces(e),p=cached.local[0].v[0],expected=rscPoint(p,e,rscBasis(e));return {sameModel:cached===RSC.models.get(e),moved:Math.hypot(...b[0].v[0].map((v,i)=>v-original[i])),error:Math.hypot(...b[0].v[0].map((v,i)=>v-expected[i]))};})()`);
 assert.equal(result.sameModel,true);assert(result.moved>1);assert(result.error<1e-10);
});
test('rendering leaves encounter state and reveal decisions untouched',()=>{
 run(`baseline();RS.active.encounters.entities=[creature()];const stateBefore=JSON.stringify(RS.active.encounters);rsDrawCreatures(creatureWater);`);
 assert(run('JSON.stringify(RS.active.encounters)===stateBefore'));
});
test('dead and out-of-range creatures submit no geometry',()=>{
 run(`const absentBefore=baseline();RS.active.encounters.entities=[creature('hollow',{alive:false}),creature('hollow',{y:60})];rsDrawCreatures(creatureWater);`);
 assert.equal(run('differences(absentBefore).total'),0);assert.equal(run('RSC.triangles'),0);
});
test('single-creature rendering budget stays bounded for a saturated array',()=>{
 run(`baseline();RS.active.encounters.entities=Array.from({length:120},(_,i)=>creature('hollow',{scale:2.05,x:9+i*.005,id:'budget'+i}));rsDrawCreatures(creatureWater);`);
 assert.equal(run('RSC.drawn'),1);assert(run('RSC.triangles<=2600'));
});
test('authored 2.05 scale preserves the approved towering height',()=>{
 const measures=run(`(()=>{const f=rscFaces(creature('hollow',{scale:2.05})),v=f.flatMap(q=>q.v);return {height:Math.max(...v.map(q=>q[2]))-Math.min(...v.map(q=>q[2])),width:Math.max(...v.map(q=>q[0]))-Math.min(...v.map(q=>q[0]))};})()`);
 assert(measures.height>3.7&&measures.height<4.2);assert(measures.width>1.35&&measures.width<2.25);
});
test('only retained face and wet-skin art remain, with the approved face byte-exact',()=>{
 assert.equal(run('RSC_ATLAS.length'),2);
 assert.equal(crypto.createHash('sha256').update(run('RSC_ATLAS[0]')).digest('hex'),'5ea609ec74d888672a2fe47fcb660869720192c9412b9905665ba851c25a7d90');
 assert(run('rscHollowMesh(creature()).every(f=>[0,4,6].includes(f.mat))'));
});
test('painted face materials have continuous UVs and visible texture detail',()=>{
 const result=run(`(()=>{rscTextures();const faces=rscFaces(creature()),skin=RSC.textures[0],face=RSC.textures[6];return {size:face.length,colors:new Set(Array.from(face)).size,uvs:faces.filter(f=>f.creatureMat===6&&f.uv!==RSC.uv).length,distinct:face.some((n,i)=>n!==skin[i])};})()`);
 assert.equal(result.size,128*128*3);assert(result.colors>90);assert(result.uvs>60);assert.equal(result.distinct,true);
});
test('revealed anatomy catches a local muzzle flash without changing reveal state',()=>{
 const result=run(`(()=>{const s=RW.byId['creature-test'],saved={threatKind:s.threatKind,renderPalette:s.renderPalette,ambientLight:s.ambientLight,room:RS.active.room};s.threatKind='hollow';s.renderPalette=RS_THREAT_PALETTES.hollow;s.ambientLight=.052;s.threatPracticalLights=[];RS.active.room=s.id;const reduced=settings.reduce;settings.reduce=false;const e=creature(),sample=()=>rscFaces(e).reduce((n,f)=>n+f.lum[0],0);muzzle=0;const dark=sample();muzzle=.06;const flash=sample();muzzle=0;s.threatKind=saved.threatKind;s.renderPalette=saved.renderPalette;s.ambientLight=saved.ambientLight;RS.active.room=saved.room;settings.reduce=reduced;return {dark,flash,revealed:e.revealed};})()`);
 assert(result.flash>result.dark*1.2);assert.equal(result.revealed,true);
});
test('creature pixels clear the water mask before later projectile reflections',()=>{
 run(`baseline(-10);const waterBefore=RR.water.slice();RS.active.encounters.entities=[creature('hollow',{y:7})];rsDrawCreatures(creatureWater);`);
 assert(run('RR.water.some((v,i)=>v===0&&waterBefore[i]!==0)'));
});
test('mirror reflections stay invisible before reveal and obey the real mirror mask',()=>{
 run(`RW.mirrors.push({owner:'creature-test',v:[[7,14,.35],[15,14,.35],[15,14,3.9],[7,14,3.9]],normal:[0,-1,0]});RR.baked=false;const hiddenMirrorBefore=baseline(0);RS.active.encounters.entities=[creature('hollow',{x:12,y:6,revealed:false})];rsDrawCreatures(creatureWater);`);
 assert.equal(run('differences(hiddenMirrorBefore).total'),0);assert(run('RR.visibleMirrorIds.length===1'));
 run(`const mirrorBefore=px.slice();RR.reflection.set(RR.mirrorReflectionDepth);for(const f of rscFaces(creature('hollow',{x:12,y:6})))rsDrawFace(f,{kind:'mirrorReflection',id:1,mirror:RR.mirrorById.get(1)});`);
 assert(run('differences(mirrorBefore).total>30'));
 assert(run('px.every((v,i)=>i%4===3||v===mirrorBefore[i]||RR.mirror[Math.floor(i/4)]===1)'));
});
test('reflected architectural depth hides a creature behind a mirror-side obstruction',()=>{
 run(`RW.owner='creature-test';rsBox(12,10,0,3,.5,6,18,true);RR.baked=false;const mirrorWallBefore=baseline(0);RR.reflection.set(RR.mirrorReflectionDepth);for(const f of rscFaces(creature('hollow',{x:12,y:6})))rsDrawFace(f,{kind:'mirrorReflection',id:1,mirror:RR.mirrorById.get(1)});`);
 assert.equal(run('differences(mirrorWallBefore).total'),0);
});
test('solid walls occlude both creature body and reflected body',()=>{
 run(`RW.owner='creature-test';rsBox(10,15,0,20,.35,6,18,true);RR.baked=false;const wallBefore=baseline(-5);RS.active.encounters.entities=[creature('hollow',{y:20})];rsDrawCreatures(creatureWater);`);
 assert.equal(run('differences(wallBefore).total'),0);
});
console.log(count+' lower-restroom creature geometry/raster checks passed.');
