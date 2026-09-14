// Deterministic work/allocation gates; native source simulation, not device FPS.
const assert=require('node:assert'),runtime=require('./runtime_harness.cjs');
const r=runtime(),run=s=>r.eval(s);let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
function start(level){run(`startRun();${level?'loadStage(1);':''}mode='playing';settings.res=.5;sceneRenderScaleCap=1;visualViewport.width=844;visualViewport.height=390;resize();releaseInputs();enemies=[];settings.map=false;shake=liminal.dark=hurt=whiteFlash=muzzle=0;aimPitch=11;player.vx=player.vy=0;`);}
function draw(){run('render();');assert.equal(run('worldRenderMask'),null);assert.equal(run('tfPortalBusy'),false);return run('({...WORLD_RENDER_WORK})');}
for(const level of [0,1]){
 test(`chapter ${level+1}: crossed entry renders only the visible hall`,()=>{
  start(level);run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}`);
  const work=draw();assert.equal(work.hostPasses,0);assert.equal(work.hallPasses,1);assert.equal(run('TF_PORTAL_STATS.secondaryPasses'),0);
 });
 test(`chapter ${level+1}: approach draws one host and an aperture-limited hall`,()=>{
  start(level);run(`{const d=TF_DOORS[stage];player.x=d.x-d.nx*1.25;player.y=d.y-d.ny*1.25;player.a=d.axis+.15;}`);
  const lf=run('lightField'),work=draw(),area=run('W*H');assert.equal(work.hostPasses,1);assert.equal(work.hallPasses,1);assert.equal(run('lightField'),lf);
  assert(work.maskedPixels>0&&work.maskedPixels<area);assert.equal(work.hostFloorPixels+work.hostWallPixels,area);assert(work.hallWallPixels<=work.maskedPixels);
 });
 test(`chapter ${level+1}: exit secondary host shades exactly the aperture`,()=>{
  run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}tfEnter();player.x=TF_END-1.2;player.y=4.5;player.a=.22;TF.active.wardenGone=true;`);
  const work=draw();assert.equal(work.hostPasses,1);assert.equal(work.hallPasses,1);assert(work.maskedPixels<run('W*H'));assert.equal(work.hostFloorPixels+work.hostWallPixels,work.maskedPixels);
 });
 test(`chapter ${level+1}: crossed exit discards no full hall render`,()=>{
  run('player.x=TF_END+.1;player.a=0;');const work=draw();assert.equal(work.hostPasses,1);assert.equal(work.hallPasses,0);assert.equal(run('TF_PORTAL_STATS.secondaryPasses'),0);
 });
 test(`chapter ${level+1}: looking away performs zero portal work`,()=>{
  run('player.x=TF_END-1.2;player.a=Math.PI;');const work=draw();assert.equal(work.hostPasses,0);assert.equal(work.hallPasses,1);assert.equal(run('TF_PORTAL_STATS.secondaryPasses'),0);
 });
}
test('visible portal composition uses no Canvas pixel readback and reuses its storage',()=>{
 run(`player.x=TF_END-1.2;player.a=0;var perfOldRead=wc.getImageData;wc.getImageData=()=>{throw Error('Portal must not read Canvas pixels');};`);
 try{draw();const surface=run('TF_PORTAL_CACHE.surface'),depth=run('TF_PORTAL_CACHE.depth'),top=run('TF_PORTAL_CACHE.mask.top'),snapshot=run('TF_PORTAL_CACHE.snapshots[0]'),lists=run('TF.active.host.portalLists');draw();assert.equal(run('TF_PORTAL_CACHE.surface'),surface);assert.equal(run('TF_PORTAL_CACHE.depth'),depth);assert.equal(run('TF_PORTAL_CACHE.mask.top'),top);assert.equal(run('TF_PORTAL_CACHE.snapshots[0]'),snapshot);assert.equal(run('TF.active.host.portalLists'),lists);assert.equal(run('TF_PORTAL_STATS.readbacks'),0);}finally{run('wc.getImageData=perfOldRead;');}
});
test('viewport changes resize portal storage once and preserve masks',()=>{
 run('settings.res=.75;resize();');draw();assert.equal(run('TF_PORTAL_CACHE.depth.length'),run('W'));assert.equal(run('TF_PORTAL_CACHE.mask.top.length'),run('W'));assert.equal(run('TF_PORTAL_CACHE.surface.height'),run('H'));const n=run('TF_PORTAL_STATS.surfaceResizes');draw();assert.equal(run('TF_PORTAL_STATS.surfaceResizes'),n);
});
console.log(`PASS ${checks} Transfer performance work gates (not browser FPS).`);
