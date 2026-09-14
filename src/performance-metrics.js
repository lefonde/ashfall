// Opt-in, local-only diagnostics. No network, per-frame logging or gameplay changes.
// Start with ?perf=1 or ashfallPerformance.start(); export after the playtest.
const AF_PERF={enabled:false,capacity:1800,stride:15,data:null,count:0,cursor:0,lastScene:-1,lastPlaying:false,
 events:[],spans:new Map(),installed:false,started:0,frameReflectionPasses:0,frameRasterCandidates:0};
const AF_PERF_COLUMNS=['time','intervalMs','cpuMs','updateMs','renderMs','width','height','scene',
 'hostPasses','hallPasses','transferPixels','transferReadbacks','hostShadedPixels','reflectionPasses','rasterCandidates'];
function afPerfScene(){return rsRunning()?4:tfRunning()?5:stage;}
function afPerfEvent(name,detail=''){
 const p=AF_PERF;if(!p.enabled)return;
 if(p.events.length===96)p.events.shift();p.events.push({at:performance.now(),name,detail});
}
function afPerfWrap(name,fn){return function(...args){
 if(!AF_PERF.enabled)return fn.apply(this,args);
 const start=performance.now();try{return fn.apply(this,args);}finally{
  const ms=performance.now()-start,p=AF_PERF;let s=p.spans.get(name);
  if(!s){s={calls:0,totalMs:0,maxMs:0};p.spans.set(name,s);}s.calls++;s.totalMs+=ms;s.maxMs=Math.max(s.maxMs,ms);
  if(ms>50)afPerfEvent('long-task',name+': '+ms.toFixed(2)+' ms');
 }
};}
function afPerfInstall(){
 if(AF_PERF.installed)return;AF_PERF.installed=true;
 tfEnter=afPerfWrap('transfer.enter',tfEnter);tfRestoreHost=afPerfWrap('transfer.exit',tfRestoreHost);
 rsBuildWorld=afPerfWrap('restrooms.prepare',rsBuildWorld);rsSaveCheckpoint=afPerfWrap('checkpoint.save',rsSaveCheckpoint);
 buildFlow=afPerfWrap('navigation.flow',buildFlow);rsAudioImpulse=afPerfWrap('audio.response',rsAudioImpulse);
 rsRenderStairPortal=afPerfWrap('stair.down-view',rsRenderStairPortal);rsRenderHostPortal=afPerfWrap('stair.up-view',rsRenderHostPortal);
 const draw=rsRenderWorld;
 rsRenderWorld=function(...args){
  if(!AF_PERF.enabled)return draw.apply(this,args);
  try{return draw.apply(this,args);}finally{AF_PERF.frameReflectionPasses+=RR.reflectionPasses;AF_PERF.frameRasterCandidates+=RR.rasterSamples+RR.reflectionSamples;}
 };
}
function afPerfBeginFrame(){AF_PERF.frameReflectionPasses=AF_PERF.frameRasterCandidates=0;}
function afPerfVisibilityReset(){AF_PERF.lastPlaying=false;}
document.addEventListener('visibilitychange',afPerfVisibilityReset);
function afPerfStart(){
 const p=AF_PERF;afPerfInstall();if(!p.data)p.data=new Float64Array(p.capacity*p.stride);
 p.enabled=true;p.count=p.cursor=0;p.lastScene=-1;p.lastPlaying=false;p.events.length=0;p.spans.clear();p.started=performance.now();
 return {recording:true,capacity:p.capacity};
}
function afPerfFrame(now,interval,updateMs,renderMs){
 const p=AF_PERF;if(!p.enabled)return;
 if(mode!=='playing'||document.hidden){p.lastPlaying=false;return;}
 const scene=afPerfScene();if(scene!==p.lastScene){afPerfEvent('scene',String(scene));p.lastScene=scene;}
 const d=p.data,i=p.cursor*p.stride;
 d[i]=now;d[i+1]=p.lastPlaying&&Number.isFinite(interval)&&interval>=0?interval:0;
 d[i+2]=updateMs+renderMs;d[i+3]=updateMs;d[i+4]=renderMs;d[i+5]=W;d[i+6]=H;d[i+7]=scene;
 d[i+8]=WORLD_RENDER_WORK.hostPasses;d[i+9]=WORLD_RENDER_WORK.hallPasses;
 d[i+10]=TF_PORTAL_STATS.entryPixels+TF_PORTAL_STATS.exitPixels;d[i+11]=TF_PORTAL_STATS.readbacks;
 d[i+12]=WORLD_RENDER_WORK.hostFloorPixels+WORLD_RENDER_WORK.hostWallPixels;
 d[i+13]=p.frameReflectionPasses;d[i+14]=p.frameRasterCandidates;
 p.lastPlaying=true;p.cursor=(p.cursor+1)%p.capacity;p.count=Math.min(p.capacity,p.count+1);
}
function afPerfReport(){
 const p=AF_PERF,frames=[];
 for(let j=0;j<p.count;j++){const i=((p.cursor-p.count+j+p.capacity)%p.capacity)*p.stride;frames.push(Array.from(p.data.subarray(i,i+p.stride)));}
 const stats=(rows,column,positive=false)=>{
  const values=rows.map(r=>r[column]).filter(v=>Number.isFinite(v)&&(!positive||v>0)).sort((a,b)=>a-b),n=values.length;
  const q=t=>n?+values[Math.max(0,Math.ceil(n*t)-1)].toFixed(3):0;
  return {samples:n,p50:q(.5),p95:q(.95),p99:q(.99),max:q(1),over33:values.filter(v=>v>33.334).length,over50:values.filter(v=>v>50).length};
 };
 const summary=rows=>({frameInterval:stats(rows,1,true),cpu:stats(rows,2),update:stats(rows,3),render:stats(rows,4)});
 const scenes={};for(const id of new Set(frames.map(f=>f[7])))scenes[id]=summary(frames.filter(f=>f[7]===id));
 return {version:BUILD.version,recording:p.enabled,capacity:p.capacity,framesRecorded:p.count,
  note:'CPU spans exclude browser presentation; frame intervals include scheduling. Native harness timings are not device FPS.',
  sceneNames:{0:'Admissions',1:'Fever Theatre',2:'Heart',3:'Exterior',4:'Lower Restrooms',5:'Transfer'},
  summary:summary(frames),scenes,spans:Object.fromEntries(p.spans),events:p.events.slice(),columns:AF_PERF_COLUMNS.slice(),frames};
}
function afPerfStop(){AF_PERF.enabled=false;return afPerfReport();}
function afPerfDownload(){
 const blob=new Blob([JSON.stringify(afPerfReport(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='ashfall-performance-'+BUILD.version+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
window.ashfallPerformance=Object.freeze({start:afPerfStart,stop:afPerfStop,report:afPerfReport,download:afPerfDownload});
if(new URLSearchParams(location.search).get('perf')==='1')afPerfStart();
