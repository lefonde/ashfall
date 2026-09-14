// Deterministic CPU-raster work/coverage checks. These measure work and image
// parity, not real-browser FPS, Canvas presentation or mobile input latency.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
run(`
function rsBuildWorld(){if(RW.ready)return;RW.ready=true;
 const s=rsSurface('mask-test',rsRect(0,0,24,36),0,6,{room:true,district:'reservoirs'});
 rsAddWater(s,.3,rsRect(5,0,19,36));RW.index={};rsGridPut(RW.index,s.bounds,s);rsBuildShell();
 RW.owner=s.id;rsLamp(12,18,5.5,3,false,2);rsBox(12,24,0,2,2,5,18,true);RW.owner=null;
}
RS.active={z:0,clock:1.4,committed:true};coarse=true;visualViewport.width=844;visualViewport.height=390;settings.res=.5;resize();
player.x=12;player.y=5;player.a=Math.PI/2;camDX=0;camDY=1;projection=W/(2*Math.tan(.7));settings.reduce=false;
function maskPitch(degrees){aimPitch=Math.tan(degrees*Math.PI/180)*projection;horizon=H*.48+aimPitch;}
`);
test('water planes outside the view start no reflection pass or frame-color copy',()=>{
 run('maskPitch(88);rsRenderWorld(true);RR.reflectionBase.fill(211);rsRenderWorld(true);');
 assert.equal(run('RR.reflectionPasses'),0);assert(run('RR.emptyReflectionPasses>0'));assert(run('RR.reflectionBase.every(v=>v===211)'));
});
test('visible water has bounded row masks covering every contributing pixel',()=>{
 run('maskPitch(-8);rsRenderWorld(true);');assert(run('RR.reflectionPasses>0&&RR.reflectionSamples>0'));
 assert(run(`(()=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++){const id=RR.water[y*W+x];if(!id)continue;const p=RR.waterPassById.get(id);if(!p||x<p.rowsMin[y]||x>=p.rowsMax[y]||y<p.y0||y>=p.y1)return false;}return true;})()`));
});
test('reflection and vertex scratch storage is reused across stationary frames',()=>{
 run('const maskStorage=RR.waterPassById.get(1),vertexStorage=rrVertexScratch[0][0];rsRenderWorld(true);');
 assert(run('RR.waterPassById.get(1)===maskStorage&&rrVertexScratch[0][0]===vertexStorage'));
});
test('a real aperture reduces CPU raster work while preserving its visible water image',()=>{
 run(`maskPitch(-8);rsRenderWorld(true);const maskBefore=px.slice(),fullMaskWork=RR.rasterSamples+RR.reflectionSamples;
 const narrow=rsPortalMaskReset(null);for(let x=110;x<210;x++)rsPortalMaskSpan(narrow,x,37,133);rsPortalMaskFinish(narrow);rsRenderWorld(true,narrow);
 let maskDiff=0,maskMaxDelta=0;for(let y=40;y<130;y++)for(let x=113;x<207;x++)for(let c=0;c<4;c++){const i=(y*W+x)*4+c,d=Math.abs(px[i]-maskBefore[i]);if(d){maskDiff++;maskMaxDelta=Math.max(maskMaxDelta,d);}}
 `);
 assert(run('RR.rasterSamples+RR.reflectionSamples<fullMaskWork*.6'));
 assert(run('maskMaxDelta===0'),`visible aperture color delta ${run('maskMaxDelta')} in ${run('maskDiff')} channels`);
});
test('a missing column is excluded from reflection shading as well as opaque raster',()=>{
 run('maskPitch(88);narrow.top[160]=H;narrow.bottom[160]=0;rsRenderWorld(true,narrow);');assert(run('Array.from({length:H},(_,y)=>RR.depth[y*W+160]).every(q=>q===0)'));
});
test('an ordinary frame clears the temporary aperture restriction',()=>{
 run('maskPitch(-8);rsRenderWorld(true);');assert.equal(run('RR.renderMask'),null);assert(run('RR.depth[100*W+160]>0'));
});
console.log(count+' restroom render mask/work checks passed.');
