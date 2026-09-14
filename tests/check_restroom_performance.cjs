// Real source/runtime integration with deterministic render timings. This does
// not estimate phone frame rates or replace browser/device performance testing.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const runtime=require('./runtime_harness.cjs'),r=runtime(),run=s=>r.eval(s);let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function samples(n,ms){run(`for(let i=0;i<${n};i++)rsRenderQualitySample(${ms});`);}
function fresh(coarse=false,res=1){run(`coarse=${coarse};settings.res=${res};mode='playing';rsRenderQualityBegin();`);}
run('artReady=true;rsStartChapter();');
test('real chapter entry enables a temporary desktop cap without rewriting settings',()=>{assert(run('rsRunning()&&RS_RENDER_QUALITY.active&&sceneRenderScaleCap===1&&settings.res===1'));});
test('coarse input preserves entry resolution and respects a lower manual cap',()=>{fresh(true);assert.equal(run('W'),640);assert.equal(run('settings.res'),1);fresh(true,.625);assert.equal(run('W'),400);assert.equal(run('settings.res'),.625);});
test('warmup and a complete sample window exclude isolated slow frames',()=>{fresh();samples(15,150);samples(44,8);assert.equal(run('RS_RENDER_QUALITY.pending'),null);samples(1,200);assert.equal(run('RS_RENDER_QUALITY.pending'),null);});
test('sustained slow rendering requests one bounded change on the next frame',()=>{samples(45,45);assert.equal(run('RS_RENDER_QUALITY.pending'),.875);assert.equal(run('W'),640);run('aimPitch=H*.37;rsRenderQualityApply();');assert.equal(run('W'),560);assert(run('Math.abs(aimPitch/H-.37)<1e-10'));assert(run('Math.abs(H/W-gameViewport.height/gameViewport.width)<1/W'));assert.equal(run('settings.res'),1);});
test('cooldown prevents repeated frame-by-frame resizes',()=>{samples(143,80);assert.equal(run('RS_RENDER_QUALITY.pending'),null);assert.equal(run('RS_RENDER_QUALITY.changes'),1);samples(45,80);assert.equal(run('RS_RENDER_QUALITY.pending'),.75);});
test('pause and menus neither measure nor apply queued changes',()=>{const before=run('JSON.stringify(RS_RENDER_QUALITY)');for(const mode of ['paused','menu']){run(`mode='${mode}';`);samples(300,200);run('rsRenderQualityApply();');assert.equal(run('JSON.stringify(RS_RENDER_QUALITY)'),before);assert.equal(run('W'),560);}run("mode='playing';rsRenderQualityApply();");assert.equal(run('W'),480);});
test('resolution recovers only after two fast windows and preserves manual settings',()=>{samples(143,8);samples(45,8);assert.equal(run('RS_RENDER_QUALITY.pending'),null);samples(45,8);assert.equal(run('RS_RENDER_QUALITY.pending'),.875);run('rsRenderQualityApply();');assert.equal(run('W'),560);assert.equal(run('settings.res'),1);});
test('a manual cap drives an immediate effective downshift without redundant resizes',()=>{fresh(false,.75);samples(60,60);assert.equal(run('RS_RENDER_QUALITY.pending'),.625);run('rsRenderQualityApply();');assert.equal(run('W'),400);assert.equal(run('settings.res'),.75);});
test('sustained overload never goes below the half-resolution floor',()=>{run('for(let n=0;n<8;n++){for(let i=0;i<210;i++)rsRenderQualitySample(90);rsRenderQualityApply();}');assert.equal(run('sceneRenderScaleCap'),.5);assert.equal(run('W'),320);assert.equal(run('RS_RENDER_QUALITY.pending'),null);});
test('invalid measurements are ignored and ordinary timing jitter has hysteresis',()=>{fresh();samples(15,0);run('for(const t of [NaN,Infinity,-1])rsRenderQualitySample(t);');assert.equal(run('RS_RENDER_QUALITY.samples.length'),0);samples(90,21);assert.equal(run('RS_RENDER_QUALITY.pending'),null);});
test('the real animation loop measures only rendering and applies before drawing',()=>{
 const boot=fs.readFileSync(path.join(r.root,'src/boot.js'),'utf8');run(boot.slice(0,boot.indexOf('wireTestWard();')));
 run(`const savedQualityUpdate=update,savedQualityRender=render,savedQualityClock=performance.now;let qualityClock=0;const qualityDrawWidths=[];update=()=>{qualityClock+=400;};render=()=>{qualityDrawWidths.push(W);qualityClock+=12;};performance.now=()=>qualityClock;RS_RENDER_QUALITY.warmup=0;RS_RENDER_QUALITY.samples=[];RS_RENDER_QUALITY.pending=.75;loop(1000);`);
 assert.equal(run('qualityDrawWidths[0]'),480);run('RS_RENDER_QUALITY.warmup=0;RS_RENDER_QUALITY.cooldown=0;loop(1016);');assert.equal(run('RS_RENDER_QUALITY.samples[0]'),12);
 run("mode='menu';loop(1032);");assert.equal(run('RS_RENDER_QUALITY.samples.length'),1);
 run("mode='playing';update=savedQualityUpdate;render=savedQualityRender;performance.now=savedQualityClock;");
});
test('leaving restores the current manual resolution and original view fraction after rotation',()=>{
 run('RS.active.host.pitch=RS.active.host.pitchHeight*.06;settings.res=.875;visualViewport.width=844;visualViewport.height=390;resize();rsLeave(false,true);');
 assert(run('!rsRunning()&&!RS_RENDER_QUALITY.active&&sceneRenderScaleCap===1&&settings.res===.875'));assert.equal(run('W'),560);assert(run('Math.abs(aimPitch/H-.06)<1e-10'));assert(run('Math.abs(H/W-390/844)<1/W'));
 const width=run('W');samples(500,200);run('rsRenderQualityApply();');assert.equal(run('W'),width);
});
console.log(count+' scene-only render quality integration checks passed.');
