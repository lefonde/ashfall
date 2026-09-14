// Focused navigation/HUD regression: no browser rendering or timing claims.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..'),c={console,Int16Array,Uint8Array,Math};vm.createContext(c);
vm.runInContext(`let MW=7,MH=5,map=Array.from({length:MH},(_,y)=>Array.from({length:MW},(_,x)=>y===2&&x>0&&x<6?0:1));
 let player={x:1.5,y:2.5},flow=[],flowClock=0,blocked=-1,fitCalls=0,enemies=[],liminal={mode:''},review={active:false},CH={live:{}};
 function fits(x,y){fitCalls++;return (x|0)!==blocked;}function cbRunning(){return false;}function fvSuppressed(){return false;}
`,c);
vm.runInContext(fs.readFileSync(path.join(root,'src/levels.js'),'utf8'),c);
vm.runInContext(fs.readFileSync(path.join(root,'src/enemies.js'),'utf8'),c);
const run=s=>vm.runInContext(s,c);
run('buildFlow();const initialFlow=flow;const initialBuilds=FLOW_CACHE.stats.builds;');
assert.equal(run('flow[2*MW+5]'),4,'corridor reaches its far end');
run('player.x=1.8;buildFlow();');assert(run('flow===initialFlow'),'same-cell unchanged topology reuses the field');
assert.equal(run('FLOW_CACHE.stats.builds'),run('initialBuilds'));
run('map[2][3]=1;buildFlow();');assert.equal(run('flow[2*MW+5]'),-1,'arbitrary map edits invalidate the route');
assert.equal(run('initialFlow[2*MW+5]'),4,'parked field stays immutable');
run('map[2][3]=0;blocked=3;buildFlow();');assert.equal(run('flow[2*MW+5]'),-1,'furniture/body changes are detected without map edits');
run('blocked=-1;buildFlow();');assert.equal(run('flow[2*MW+5]'),4);
run('player.x=5.5;buildFlow();');assert.equal(run('flow[2*MW+1]'),4);assert.equal(run('flow[2*MW+5]'),0);
run('const adoptedField=new Int16Array(flow),adoptedMask=new Uint8Array(FLOW_CACHE.walkable);const beforeAdopt=FLOW_CACHE.stats.builds;adoptFlow(adoptedField,5,2,adoptedMask);buildFlow();');
assert(run('flow===adoptedField'));assert.equal(run('FLOW_CACHE.stats.builds'),run('beforeAdopt'));
run('enemies=[{alive:false,death:1}];flowClock=0;fitCalls=0;enemyAI(.1);');
assert.equal(run('fitCalls'),0,'no topology scan without eligible enemies');assert.equal(run('enemies[0].death'),.9,'other AI timers still advance');
run(`let furniture=[{x:3.5,y:2.5,c:1,s:0,hx:.3,hy:.3}],furnGrid=new Map([[17,furniture]]);
 function wall(){return false;}function furnitureFree(x){return Math.abs(x-furniture[0].x)>.27+furniture[0].hx;}function cbBodyFree(){return true;}
 fits=function(x){fitCalls++;return furnitureFree(x);};buildFlow();fitCalls=0;buildFlow();`);
assert.equal(run('fitCalls'),0,'ordinary indoor unchanged topology bypasses collision resampling');
assert.equal(run('flow[2*MW+1]'),-1);
run('furniture[0].x=20;buildFlow();');assert.equal(run('flow[2*MW+1]'),4,'an indexed body moved in place invalidates the indoor cache');
run('map[2][3]=1;buildFlow();');assert.equal(run('flow[2*MW+1]'),-1,'direct map writes invalidate the indoor cache');
run(`map[2][3]=0;
 const S4={solids:[{x0:3,x1:4,y0:2,y1:3}]},S4_POND={x:90,y:90,rx:2,ry:2},S4_LAKE={x:95,y:95,rx:2,ry:2},CB={alive:true,on:false,x:3.5,y:2.5},CB_RADIUS=.6;
 function s4Running(){return true;}function s4Outside(){return false;}function s4Pond(){return false;}function s4InWaterOval(){return false;}
 function s4Solid(x,y){return S4.solids.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);}
 cbRunning=function(){return CB.on;};cbBodyFree=function(x,y){return !CB.on||!CB.alive||Math.hypot(x-CB.x,y-CB.y)>=CB_RADIUS+.27;};
 fits=function(x,y){fitCalls++;return !s4Solid(x,y)&&furnitureFree(x)&&cbBodyFree(x,y);};buildFlow();fitCalls=0;buildFlow();`);
assert.equal(run('fitCalls'),0,'unchanged exterior collision inputs reuse passability');
assert.equal(run('flow[2*MW+1]'),-1);
run('S4.solids[0].x0=20;S4.solids[0].x1=21;buildFlow();');assert.equal(run('flow[2*MW+1]'),4,'vehicle rectangle edits invalidate the exterior cache');
run('CB.on=true;buildFlow();');assert.equal(run('flow[2*MW+1]'),-1,'the live boss body blocks the route');
run('CB.x=20;buildFlow();');assert.equal(run('flow[2*MW+1]'),4,'moving the boss invalidates the cache');
console.log('PASS flow caching preserves exact changed topology, dynamic blockers, parked state, prepared adoption, and non-pursuing AI timers.');
