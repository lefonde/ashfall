// Native lifecycle/navigation and exact PCM checks. No browser FPS or listening claim.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const runtime=require('./runtime_harness.cjs'),root=path.join(__dirname,'..');
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
const r=runtime(),run=s=>r.eval(s);
function enter(level){
 run(`startRun();${level?'loadStage(1);':''}releaseInputs();{const d=TF_DOORS[stage];player.x=d.x+d.nx*.03;player.y=d.y+d.ny*.03;player.a=d.axis;player.vx=player.vy=0;}tfEnter();`);
 assert(run('tfRunning()'));
}
for(const level of [0,1]){
 test(`chapter ${level+1}: preparation is bounded and leaves the parked world unchanged`,()=>{
  enter(level);
  const original=run('JSON.stringify({map:TF.active.host.map,props:TF.active.host.props,lights:TF.active.host.lights})');
  run('tfPrepareHostExitStep(TF.active);');assert(run('TF.active.exitCache.scan<=96'));assert(!run('TF.active.exitCache.ready'));
  run('for(let i=0;i<200&&!TF.active.exitCache.ready;i++)tfPrepareHostExitStep(TF.active);');
  assert(run('TF.active.exitCache.ready'));assert.equal(run('TF.active.exitCache.queue'),null);
  assert.equal(run('JSON.stringify({map:TF.active.host.map,props:TF.active.host.props,lights:TF.active.host.lights})'),original);
 });
 test(`chapter ${level+1}: crossing restores exact light and adopts correct sealed-door navigation`,()=>{
  const oldMap=run('TF.active.host.map.map(row=>row.slice())'),light=new Float32Array(run('TF.active.host.lf'));
  const oldField=run('TF.active.exitCache.field');
  const gridBuilds=run('TF.active.host.nav.gridBuilds'),routeBuilds=run('TF.active.host.nav.routeBuilds');
  const preparedNav={open:new Uint8Array(run('TF.active.exitCache.navOpen')),edges:new Uint8Array(run('TF.active.exitCache.navEdges')),field:new Int16Array(run('TF.active.exitCache.navField'))};
  run('player.x=TF_END+.28;player.y=4.5;player.a=0;');
  const expected=run('JSON.stringify(tfHostPose(player.x,player.y,player.a,player.vx,player.vy,"exit"))');
  run(`{const oldBuild=tfHostBuild,oldLight=bakeLightField,oldActive=bakeLightActive,oldFurniture=rebuildFurniture,oldFlow=buildFlow;
   tfHostBuild=bakeLightField=bakeLightActive=rebuildFurniture=buildFlow=()=>{throw Error('Unbounded rebuild at crossing');};
   try{tfRestoreHost(true);}finally{tfHostBuild=oldBuild;bakeLightField=oldLight;bakeLightActive=oldActive;rebuildFurniture=oldFurniture;buildFlow=oldFlow;}}`);
  assert.equal(run('JSON.stringify({x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy})'),expected);
  assert.deepEqual(new Float32Array(run('lightField')),light);assert.equal(run('flow'),oldField);
  assert.equal(run('WF.gridBuilds'),gridBuilds,'HUD must not rebuild the navigation grid during crossing');
  assert.equal(run('WF.routeBuilds'),routeBuilds,'HUD must not flood a new target route during crossing');
  assert(run('furniture.every(p=>p.kind!=="tf_leaf")&&environmentProps.every(p=>!p.tfDoor)&&fits(player.x,player.y)'));
  const changed=[];const current=run('map');for(let y=0;y<current.length;y++)for(let x=0;x<current[y].length;x++)if(oldMap[y][x]!==current[y][x])changed.push([x,y]);
  assert.deepEqual(changed,Array.from(run('TF_DOORS[stage].cells'),p=>Array.from(p)).sort((a,b)=>a[1]-b[1]||a[0]-b[0]));
  const field=new Int16Array(run('flow'));
  // Force an independent normal rebuild rather than accepting the adopted cache.
  run('flow=[];buildFlow();');assert.deepEqual(new Int16Array(run('flow')),field);
  run('WF.open=null;WF.edges=null;WF.field=null;wfGrid();wfRoute();');
  assert.deepEqual(new Uint8Array(run('WF.open')),preparedNav.open);assert.deepEqual(new Uint8Array(run('WF.edges')),preparedNav.edges);
  assert.deepEqual(new Int16Array(run('WF.field')),preparedNav.field);
  assert.equal(run('tfState().status'),'complete');assert(run('(stage===0?CH:FV).checkpoint.transfer.status==="complete"'));
 });
 test(`chapter ${level+1}: abort restores original collision/nav references and clears job ownership`,()=>{
  enter(level);const host=run('TF.active.host');run('tfPrepareHostExitStep(TF.active);tfAbort();');
  assert.equal(run('furniture'),host.furniture);assert.equal(run('furnGrid'),host.furnGrid);
  assert.equal(run('flow'),host.flow);assert.equal(run('flowClock'),host.flowClock);assert.equal(run('TF.active'),null);
  assert.equal(run('map'),host.map);assert.equal(run('environmentProps'),host.props);assert.equal(run('wardLights'),host.lights);
  assert(run('TF_DOORS[stage].cells.every(([x,y])=>map[y][x]===0)'));assert.equal(run('tfState().status'),'unseen');
 });
}
test('a direct preview exit does not finish an unbounded navigation job at the threshold',()=>{
 enter(0);run('player.x=TF_END+.28;player.y=4.5;tfRestoreHost(true);');
 assert(!run('tfRunning()'));assert.equal(run('flowClock'),0);assert(run('fits(player.x,player.y)'));
 run('buildFlow();');assert.equal(run('flow[(player.y|0)*MW+(player.x|0)]'),0);
});
test('approved water and acoustics implementation files retain exact hashes',()=>{
 const crypto=require('node:crypto');for(const [file,hash]of [
  ['restroom-audio.js','cfe032345a031122d4987121f363e402746d7efa6a85b478171c62abe79ea966'],
  ['restroom-water-samples.js','af173dd32d65307cb899d1aeafeea0c591b754bcc8b68908f53dc19602a0f9e4']
 ])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src',file))).digest('hex'),hash);
});
function preparationFixture(){
 let buffers=0;const audioContext={sampleRate:24000,createBuffer(channels,length,sampleRate){buffers++;const data=Array.from({length:channels},()=>new Float32Array(length));return{numberOfChannels:channels,length,sampleRate,getChannelData:i=>data[i]};}};
 const c={audio:{play(){}},RW:{ready:false},RR:{baked:false},mode:'menu',setTimeout,console};vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'src/restroom-audio.js'),'utf8'),c);
 c.ctx=audioContext;vm.runInContext('RS_AUDIO.ctx=ctx;rsAudioInit=()=>true;',c);
 vm.runInContext(fs.readFileSync(path.join(root,'src/performance-preparation.js'),'utf8'),c);
 return{run:s=>vm.runInContext(s,c),c,buffers:()=>buffers};
}
test('prewarmed gallery is bit-identical, remains cached after LRU eviction and creates no playback bank',()=>{
 const f=preparationFixture(),expected=f.run('performanceBaseAudioImpulse("gallery")');f.run('RS_AUDIO.impulses.clear();preparePerformanceAudio();');
 const warmed=f.run('rsAudioImpulse("gallery")');
 for(let channel=0;channel<2;channel++)assert.deepEqual(warmed.getChannelData(channel),expected.getChannelData(channel));
 for(const preset of ['suite','tile','service','court','pool'])f.run(`rsAudioImpulse('${preset}');`);
 assert(!f.run('RS_AUDIO.impulses.has("gallery")'));const before=f.buffers();
 assert.equal(f.run('rsAudioImpulse("gallery")'),warmed);assert.equal(f.buffers(),before);
 assert(f.run('RS_AUDIO.impulses.size<=4'));assert.equal(f.run('RS_AUDIO.banks.length'),0);assert.equal(f.run('RS_AUDIO.enabled'),false);
 f.run('preparePerformanceAudio();');assert.equal(f.buffers(),before);
 // Context identity, rather than sample rate alone, guards ownership.
 f.c.otherContext={...f.c.ctx};f.run('RS_AUDIO.ctx=otherContext;RS_AUDIO.impulses.clear();preparePerformanceAudio();');
 assert.notEqual(f.run('rsAudioImpulse("gallery")'),warmed);
});
(async()=>{
 const f=preparationFixture();let worlds=0,bakes=0;
 f.c.rsBuildWorld=()=>{worlds++;f.c.RW.ready=true;};f.c.rsBakeFaces=()=>{bakes++;f.c.RR.baked=true;};
 const first=f.run('preparePerformanceWorld()'),same=f.run('preparePerformanceWorld()');assert.equal(first,same);
 assert.equal(worlds,0,'construction yields before work');assert.equal(await first,true);assert.equal(worlds,1);assert.equal(bakes,1);
 assert.equal(f.run('PERF_PREPARATION.state'),'ready');checks++;console.log('PASS loader prepares before play and shares an in-flight job');
 const cancelled=preparationFixture();let writes=0;cancelled.c.rsBuildWorld=()=>writes++;cancelled.c.rsBakeFaces=()=>writes++;
 const pending=cancelled.run('preparePerformanceWorld()');cancelled.run('cancelPerformancePreparation();');assert.equal(await pending,false);assert.equal(writes,0);
 cancelled.run('mode="playing";');assert.equal(await cancelled.run('preparePerformanceWorld()'),false);assert.equal(writes,0);
 checks++;console.log('PASS cancellation and accidental in-play requests cannot mutate authored world');
 const failure=preparationFixture();let attempts=0;failure.c.rsBuildWorld=()=>{attempts++;throw Error('authored failure');};
  await assert.rejects(failure.run('preparePerformanceWorld()'),/authored failure/);await assert.rejects(failure.run('preparePerformanceWorld()'),/authored failure/);assert.equal(attempts,1);
  checks++;console.log('PASS failed construction requires reload instead of appending a partial world');
 if(run('typeof preparePerformanceWorld')==='undefined')run(fs.readFileSync(path.join(root,'src/performance-preparation.js'),'utf8'));
 r.context.setTimeout=setTimeout;run('mode="menu";');
 const hostState=run('JSON.stringify({player,stage,gameTime,stageTime,map,guns,transfer:TF.campaign,chapter:CH.checkpoint,restrooms:RS.active})');
 assert.equal(await run('preparePerformanceWorld()'),true);
 assert(run('RW.ready&&RR.baked&&!!RSB.grid&&RW.rooms.length===84'));
 assert.equal(run('JSON.stringify({player,stage,gameTime,stageTime,map,guns,transfer:TF.campaign,chapter:CH.checkpoint,restrooms:RS.active})'),hostState);
 const faces=run('RW.faces'),count=faces.length,index=run('RSB.grid');await run('preparePerformanceWorld()');
 assert.equal(run('RW.faces'),faces);assert.equal(run('RW.faces.length'),count);assert.equal(run('RSB.grid'),index);
 checks++;console.log('PASS real authored preparation retains all84 rooms and reuses geometry without entering or modifying a campaign');
  console.log(`PASS ${checks} performance preparation checks (native simulation and exact PCM).`);
})().catch(error=>{console.error(error);process.exitCode=1;});
