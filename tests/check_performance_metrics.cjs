// Opt-in whole-loop timing checks. Synthetic clocks, not device FPS.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const r=require('./runtime_harness.cjs')(),run=s=>r.eval(s);let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
test('diagnostics allocate no frame buffer and install no wrappers by default',()=>{
 assert.equal(run('AF_PERF.enabled'),false);assert.equal(run('AF_PERF.data'),null);assert.equal(run('AF_PERF.installed'),false);
 assert.equal(run('ashfallPerformance.report().framesRecorded'),0);
});
run(fs.readFileSync(path.join(r.root,'src/boot.js'),'utf8').split('wireTestWard();')[0]);
test('full loop records update and rendering separately and leaves simulation delta unchanged',()=>{
 run(`mode='playing';ashfallPerformance.start();var metricClock=0,metricDt=0;performance.now=()=>metricClock;
 update=dt=>{metricDt=dt;metricClock+=40;};render=()=>{metricClock+=8;};last=1000;loop(1016);loop(1032);`);
 const report=run('ashfallPerformance.report()');assert.equal(report.framesRecorded,2);
 assert.equal(report.summary.cpu.p50,48);assert.equal(report.summary.update.p50,40);assert.equal(report.summary.render.p50,8);
 assert.equal(report.summary.frameInterval.samples,1);assert.equal(report.summary.frameInterval.p50,16);
 assert.equal(run('metricDt'),.016);
});
test('pause and hidden-tab gaps do not become gameplay frame spikes',()=>{
 run("mode='paused';loop(1048);mode='playing';loop(50000);document.hidden=true;loop(50016);document.hidden=false;loop(90000);");
 const report=run('ashfallPerformance.report()');assert.equal(report.framesRecorded,4);assert.equal(report.summary.frameInterval.samples,1);
 assert.equal(report.summary.frameInterval.max,16);
});
test('visibility changes reset pacing even when the browser suspends all hidden animation frames',()=>{
 run('document.hidden=true;afPerfVisibilityReset();document.hidden=false;loop(150000);');
 const report=run('ashfallPerformance.report()');assert.equal(report.summary.frameInterval.samples,1);assert.equal(report.summary.frameInterval.max,16);
});
test('secondary restroom counters are retained in the Heart scene and cleared for the next frame',()=>{
 run('stage=2;afPerfBeginFrame();AF_PERF.frameReflectionPasses=2;AF_PERF.frameRasterCandidates=12345;afPerfFrame(150016,16,2,7);');
 const frame=run('ashfallPerformance.report().frames.at(-1)');assert.equal(frame[7],2);assert.equal(frame[13],2);assert.equal(frame[14],12345);
 run('afPerfBeginFrame();');assert.equal(run('AF_PERF.frameRasterCandidates'),0);assert.equal(run('AF_PERF.frameReflectionPasses'),0);
});
test('recording uses a fixed buffer and stopping leaves a stable snapshot',()=>{
 const data=run('AF_PERF.data');run("for(let i=0;i<1900;i++)afPerfFrame(90000+i*16,16,2,5);");
 assert.equal(run('AF_PERF.data'),data);assert.equal(run('AF_PERF.count'),1800);
 assert.equal(run('ashfallPerformance.report().frames.length'),1800);
 const before=run('JSON.stringify(ashfallPerformance.stop())');run('loop(200000);');assert.equal(run('JSON.stringify(ashfallPerformance.report())'),before);
});
test('low-frame-rate cooldown follows elapsed time without lowering quality at entry',()=>{
 run("RS.active={};mode='playing';RS_RENDER_QUALITY.active=true;RS_RENDER_QUALITY.cap=1;RS_RENDER_QUALITY.pending=null;RS_RENDER_QUALITY.warmup=0;RS_RENDER_QUALITY.cooldown=135;RS_RENDER_QUALITY.samples=[];");
 run('for(let i=0;i<45;i++)rsRenderQualitySample(40,50);');
 assert.equal(run('RS_RENDER_QUALITY.cooldown'),0);assert.equal(run('RS_RENDER_QUALITY.pending'),null);assert.equal(run('RS_RENDER_QUALITY.cap'),1);
});
test('boot awaits preparation before making the game ready',()=>{
 const boot=fs.readFileSync(path.join(r.root,'src/boot.js'),'utf8');
 assert(boot.indexOf('await preparePerformanceWorld()')<boot.indexOf('artReady=true'));
 assert(boot.indexOf('artReady=true')<boot.indexOf("$('startBtn').disabled=false"));
});
console.log(checks+' whole-frame diagnostics and loading integration checks passed.');
