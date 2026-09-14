// Deterministic DSP and Web Audio routing checks, not a browser/listening test.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
class Param{constructor(value=0){this.value=value;this.events=[];}setTargetAtTime(v,t,c){assert(Number.isFinite(v));this.value=v;this.events.push({v,t,c});}cancelScheduledValues(){}setValueAtTime(v){this.value=v;}}
class Node{constructor(c,type){this.ctx=c;this.type=type;this.links=[];this.gain=new Param(1);this.frequency=new Param(15000);this.pan=new Param();this.playbackRate=new Param(1);}connect(n){this.links.push(n);return n;}disconnect(n){this.links=n?this.links.filter(v=>v!==n):[];}start(){this.started=true;}stop(){this.stopped=true;this.onended?.();}}
class Context{constructor(stereo=true){this.sampleRate=24000;this.currentTime=0;this.bufferCount=0;this.nodes=[];if(!stereo)this.createStereoPanner=undefined;}node(type){const n=new Node(this,type);this.nodes.push(n);return n;}createGain(){return this.node('gain');}createBiquadFilter(){return this.node('filter');}createConvolver(){return this.node('convolver');}createStereoPanner(){return this.node('pan');}createBufferSource(){return this.node('source');}createBuffer(channels,length,rate){this.bufferCount++;const data=Array.from({length:channels},()=>new Float32Array(length));return{numberOfChannels:channels,length,sampleRate:rate,duration:length/rate,getChannelData:n=>data[n]};}}
function fixture(stereo=true){
 const ctx=new Context(stereo),audio={ctx,active:true,bank:null,sfx:ctx.createGain(),music:ctx.createGain(),ambience:ctx.createGain(),room:ctx.createConvolver(),heartSilenceMusic(){},play(){const send=ctx.createGain();send.connect(audio.room);return {send};}};
 const room=(id,acoustic,ambience,x)=>({id,room:true,acoustic,ambience,water:0,z:-3,bounds:[x,0,x+10,10],neighbors:[]});
 const suite=room('suite','suite','silent',0),pool=room('pool','pool','drips',10),cavern=room('cavern','cavern','flow',20),dead=room('dead','anechoic','silent',30),far=room('far','court','flow',100);
 const RW={surfaces:[suite,pool,cavern,dead,far],portals:[{a:'suite',b:'pool'},{a:'pool',b:'cavern'},{a:'cavern',b:'dead'}],solids:[],emitters:[{id:'tap',kind:'drip',room:'pool',x:13,y:5,z:-3,gain:.6,interval:[.3,.5]},{id:'spill',kind:'flow',room:'cavern',x:22,y:5,z:-3,gain:.6},{id:'outside',kind:'flow',room:'far',x:103,y:5,z:-3,gain:.6}]};
 const RS={active:{z:-3,room:'suite'}},player={x:5,y:5,a:0},c={audio,RW,RS,player,console,Math,Float32Array,Map,Set,Number,Object,Array,Infinity,rsGround:()=>RW.surfaces.find(r=>r.id===RS.active.room)};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/restroom-water-samples.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/restroom-audio.js'),'utf8'),c);
 const run=s=>vm.runInContext(s,c),move=(id)=>{RS.active.room=id;const r=RW.surfaces.find(r=>r.id===id);player.x=r.bounds[0]+5;run('rsAudioUpdate(.05,rsGround())');},tick=(seconds)=>{for(let t=0;t<seconds;t+=.05){ctx.currentTime+=.05;run('rsAudioUpdate(.05,rsGround())');}};
 return {c,ctx,audio,RW,RS,player,run,move,tick};
}
let passed=0;function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('embedded recorded-water decoder preserves the six credited PCM payload hashes',()=>{
 const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/restroom-water-samples.js'),'utf8'),c);
 const expected=['74fc728cd0d41326dd089421a5b632e586a2374c651fef283cef7b2667f1dbd9','f171a972c4f4d680bf9eca7c644cd62a71ea200c6f6dd85c4ecd8fdd686387d8','7b0137256df31eaa054229f346082298339de4134afa82b37e55d1b3c95c152d','47bd81b8ab524e7d69b73439be10e948555501f16bf9d0b48dd31b3fdb46a992','8a609c5aa5c638ed973f0c172bed13d00a9f2d4e6ca84fb6a3751425ed9fe472','a152cff2fdd33a933238b09cd492b455595d1f2905d4cc04a326710c30def6cd'];
 for(let take=0;take<6;take++){const d=vm.runInContext(`rsWaterRecording(${take}).data`,c),bytes=Buffer.alloc(d.length*2);for(let i=0;i<d.length;i++)bytes.writeInt16LE(Math.round(d[i]*32768),i*2);assert.equal(require('crypto').createHash('sha256').update(bytes).digest('hex'),expected[take]);}
});
test('silent room produces no autonomous sources while own footsteps still echo',()=>{const f=fixture();f.run('rsAudioMix(true)');f.tick(12);assert.equal(f.run('RS_AUDIO.stats.drips'),0);assert.equal(f.run('RS_AUDIO.voices.size'),0);f.run('rsFootstep(0,0,rsGround(),4)');assert.equal(f.run('RS_AUDIO.stats.steps'),1);assert.equal(f.run('RS_AUDIO.banks.at(-1).name'),'suite');assert(f.run('RS_AUDIO.banks.at(-1).input.gain.value')>0);});
test('water depth selects four physical palettes and footfalls allocate no PCM',()=>{const f=fixture();f.run('rsAudioMix(true)');const before=f.ctx.bufferCount;for(const [i,depth]of [0,.03,.16,.4].entries())f.run(`rsFootstep(${depth},${i},rsGround(),4)`);assert.equal(f.ctx.bufferCount,before);assert.deepEqual(Array.from(f.run("RS_AUDIO.stats.events.filter(e=>e.kind==='footstep').map(e=>e.material)")),['dry','puddle','shallow','deep']);});
test('idle updates never synthesize new footsteps; a final wet tail remains alive',()=>{const f=fixture();f.run('rsAudioMix(true);rsFootstep(.3,0,rsGround(),4)');const v=f.run('[...RS_AUDIO.voices][0]');f.tick(.3);assert(!v.source.stopped);f.tick(4);assert.equal(f.run('RS_AUDIO.stats.waterSteps'),1);assert.equal(f.run('RS_AUDIO.voices.size'),0);});
test('large hall response is longer, stereo, finite, and decays after its early reflections',()=>{const f=fixture();f.run('rsAudioMix(true)');const suite=f.run("rsAudioImpulse('suite')"),cave=f.run("rsAudioImpulse('cavern')");assert(cave.duration>suite.duration*6);assert.equal(cave.numberOfChannels,2);const l=cave.getChannelData(0),r=cave.getChannelData(1),energy=(start,end)=>{let n=0;for(let i=start;i<end;i++)n+=l[i]*l[i];return n/(end-start);};assert([...l].every(Number.isFinite));assert(energy(l.length*.13|0,l.length*.3|0)>energy(l.length*.8|0,l.length));assert(l.some((v,i)=>v!==r[i]));});
test('room transition feeds the new response while allowing the old tail to finish',()=>{const f=fixture();f.run('rsAudioMix(true)');const old=f.run('RS_AUDIO.banks[0]');f.move('pool');assert.equal(old.input.gain.value,0);assert(old.output.gain.value>0);assert(Number.isFinite(old.until));assert.equal(f.run('RS_AUDIO.banks.at(-1).name'),'pool');f.tick(2);assert(!f.run('RS_AUDIO.banks').includes(old));});
test('deliberate anechoic room has no wet path; ordinary silent room retains one',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('pool');f.move('dead');assert.equal(f.run('RS_AUDIO.preset'),'anechoic');assert(f.run('RS_AUDIO.banks.every(b=>b.input.gain.value===0&&b.output.gain.value===0)'));f.move('suite');assert(f.run('RS_AUDIO.banks.at(-1).input.gain.value')>0);});
test('local drip schedule is audible in its room and suppressed in a silent room',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('pool');f.tick(5);const n=f.run('RS_AUDIO.stats.drips');assert(n>0);f.move('suite');f.tick(5);assert.equal(f.run('RS_AUDIO.stats.drips'),n);assert.equal(f.run('RS_AUDIO.near.length'),0);});
test('remote disconnected source is inaudible and walls muffle nearby sources',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('pool');assert.equal(f.run("rsAudioPosition(RW.emitters[2],RS_AUDIO.room).gain"),0);f.player.x=11;f.player.y=5;const clear=f.run('rsAudioPosition(RW.emitters[0],RS_AUDIO.room)');f.RW.solids.push({x1:11.8,x2:12.2,y1:0,y2:10,z:-3,h:3});const blocked=f.run('rsAudioPosition(RW.emitters[0],RS_AUDIO.room)');assert(blocked.gain<clear.gain);assert(blocked.tone<clear.tone);});
test('indexed occlusion ignores opened door slabs and uses the listener ear height',()=>{const f=fixture();f.run('rsAudioMix(true)');f.player.x=5;f.player.y=5;const slab={x1:6,x2:6.2,y1:0,y2:10,z:-3,h:3,disabled:false};f.RW.solidIndex={};let queries=0;f.c.rsGridQuery=(grid,bounds)=>{queries++;assert(bounds[0]===5&&bounds[2]===9);return [slab];};f.c.RS_EYE=1.55;assert(f.run('rsAudioOccluded({x:9,y:5,z:-1.45})'));slab.disabled=true;assert(!f.run('rsAudioOccluded({x:9,y:5,z:-1.45})'));slab.disabled=false;slab.h=.9;assert(!f.run('rsAudioOccluded({x:9,y:5,z:-1.45})'));assert.equal(queries,3);});
test('a closed door adds muffling beyond ordinary adjacent-room attenuation',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('pool');const slab={x1:18,x2:18.2,y1:0,y2:10,z:-3,h:3,disabled:true};f.RW.solids.push(slab);const open=f.run('rsAudioPosition(RW.emitters[1],RS_AUDIO.room)');slab.disabled=false;const closed=f.run('rsAudioPosition(RW.emitters[1],RS_AUDIO.room)');assert(open.hops>0);assert(closed.gain<open.gain);assert(closed.tone<open.tone);});
test('leaving a flowing room fades and retires its loop without replacing silence',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('cavern');f.tick(1);assert(f.run('[...RS_AUDIO.voices].some(v=>v.loop)'));f.move('suite');f.tick(2);assert(!f.run('[...RS_AUDIO.voices].some(v=>v.loop)'));});
test('inherited gun wet sends use local acoustics only while the chapter is active',()=>{const f=fixture();const before=f.audio.play();assert(before.send.links.includes(f.audio.room));f.run('rsAudioMix(true)');const during=f.audio.play();assert(during.send.links.includes(f.run('RS_AUDIO.verb')));assert(!during.send.links.includes(f.audio.room));f.run('rsAudioStop()');const after=f.audio.play();assert(after.send.links.includes(f.audio.room));});
test('pause prevents footsteps and ambient events from being scheduled',()=>{const f=fixture();f.run('rsAudioMix(true)');f.move('pool');f.audio.active=false;f.tick(8);f.run('rsFootstep(.4,0,rsGround(),4)');assert.equal(f.run('RS_AUDIO.stats.steps'),0);assert.equal(f.run('RS_AUDIO.stats.drips'),0);f.audio.active=true;f.tick(5);assert(f.run('RS_AUDIO.stats.drips')>0);});
test('rapid transitions and overlap remain bounded and stop releases every voice',()=>{const f=fixture();f.run('rsAudioMix(true)');for(let i=0;i<40;i++){f.move(['suite','pool','cavern','dead'][i%4]);f.run(`rsFootstep(.3,${i},rsGround(),4)`);}assert(f.run('RS_AUDIO.banks.length')<=3);assert(f.run('RS_AUDIO.voices.size')<=24);assert(f.run('RS_AUDIO.impulses.size')<=4);f.run('rsAudioStop()');assert.equal(f.run('RS_AUDIO.voices.size'),0);assert.equal(f.run('RS_AUDIO.banks.length'),0);assert.equal(f.run('RS_AUDIO.verb.links.length'),0);});
test('mono fallback retains water and room acoustics without a stereo panner API',()=>{const f=fixture(false);f.run('rsAudioMix(true)');f.move('cavern');f.run('rsFootstep(.4,2,rsGround(),3)');assert(f.run('RS_AUDIO.voices.size')>0);assert(f.run('[...RS_AUDIO.voices].every(v=>v.panner===null)'));});
test('recorded water contains contact, displaced water, and a withdrawal tail',()=>{const f=fixture();f.run('rsAudioMix(true)');for(const key of ['puddle','shallow','deep']){const b=f.run(`rsAudioBuffer('${key}',0)`),d=b.getChannelData(0),energy=(x,y)=>{let s=0;for(let i=x*b.sampleRate|0;i<y*b.sampleRate;i++)s+=d[i]*d[i];return s;};assert(energy(.01,.13)>.001);assert(energy(.19,Math.min(b.duration-.03,.50))>.001);assert(Math.max(...d)<=.571);assert(Math.min(...d)>=-.571);assert.equal(d[d.length-1],0);}});
test('unchanged softened dry boots retain an eased onset and rounded weight',()=>{
 const f=fixture();f.run('rsAudioMix(true)');
 for(const kind of ['dry'])for(let variant=0;variant<6;variant++){
  const b=f.run(`rsAudioBuffer('${kind}',${variant})`),d=b.getChannelData(0),rms=(start,end)=>{let sum=0,count=0;for(let i=Math.floor(start*b.sampleRate);i<Math.min(d.length,end*b.sampleRate);i++){sum+=d[i]*d[i];count++;}return Math.sqrt(sum/count);};
  let energy=0,slew=0;for(let i=1;i<d.length;i++){energy+=d[i]*d[i];slew+=(d[i]-d[i-1])**2;}
  assert.equal(d[0],0);assert(rms(0,.006)<rms(.015,.14)*.18,kind+' must load weight rather than click');
  assert(rms(.025,.15)>.015,kind+' must retain an audible foot body');assert(Math.sqrt(slew/energy)<(kind==='dry'?.10:.27),kind+' must keep the noisy edge rounded');
 }
});
test('six distinct actual recordings drive wet steps and preserve their irregular waveform',()=>{
 const f=fixture();f.run('rsAudioMix(true)');const ids=new Set();
 for(let take=0;take<6;take++){
  const source=f.run(`rsWaterRecording(${take})`),b=f.run(`rsAudioBuffer('shallow',${take})`),d=b.getChannelData(0);ids.add(source.id);
  assert(source.data.length>9000&&source.data.length<20000);assert.equal(source.sampleRate,24000);assert(source.data.every(Number.isFinite));
  let cross=0,inputEnergy=0,outputEnergy=0;
  for(let i=0;i<d.length;i++){const at=(i/b.sampleRate-.009)*source.sampleRate,j=Math.floor(at),m=at-j,v=j>=0&&j+1<source.data.length?source.data[j]*(1-m)+source.data[j+1]*m:0;cross+=v*d[i];inputEnergy+=v*v;outputEnergy+=d[i]*d[i];}
  assert(cross/Math.sqrt(inputEnergy*outputEnergy)>.88,'the audible layer must follow recorded water, not a replacement noise envelope');
  assert.equal(d[0],0);assert.equal(d.at(-1),0);assert(d.every(Number.isFinite));assert(Math.max(...d)<=.571&&Math.min(...d)>=-.571);
 }
 assert.equal(ids.size,6);assert.equal(f.run('RS_WATER_DECODED.filter(Boolean).length'),6);
});
test('recorded water resamples at 48 kHz without changing duration or generating PCM per footfall',()=>{
 const a=fixture(),b=fixture();b.ctx.sampleRate=48000;a.run('rsAudioMix(true)');b.run('rsAudioMix(true)');
 const low=a.run("rsAudioBuffer('deep',3)"),high=b.run("rsAudioBuffer('deep',3)");assert(Math.abs(low.duration-high.duration)<1/24000);
 const before=b.ctx.bufferCount;for(let i=0;i<20;i++)b.run(`rsFootstep(.4,${i},rsGround(),4)`);assert.equal(b.ctx.bufferCount,before);
});
test('Transfer uses the same recordings and hall echoes without accessing restroom geometry',()=>{
 const f=fixture();f.RS.active=null;f.RW.surfaces=[];f.run('rsAudioTransferMix(true);rsAudioWaterFootstep({depth:.14,side:-1,pos:{x:5,y:5},room:"transfer"})');
 assert.equal(f.run('RS_AUDIO.domain'),'transfer');assert.equal(f.run('RS_AUDIO.preset'),'gallery');assert.equal(f.run('RS_AUDIO.stats.waterSteps'),1);
 const count=f.ctx.bufferCount;f.ctx.currentTime=3;f.run('rsAudioTransferUpdate(.05)');assert.equal(f.ctx.bufferCount,count);assert.equal(f.run('RS_AUDIO.voices.size'),0);
 f.run('rsAudioTransferMix(false)');assert.equal(f.run('RS_AUDIO.voices.size+RS_AUDIO.banks.length'),0);assert(!f.run('RS_AUDIO.enabled'));
});
test('creature movement and projectile water impacts are positional and rate bounded',()=>{
 const f=fixture();f.run('rsAudioMix(true)');const before=f.ctx.bufferCount;
 f.run('rsAudioWaterMotion({x:5,y:7,z:-3,room:"suite"},1);rsAudioWaterImpact({x:5,y:3,z:-3,room:"suite"},1)');
 let voices=f.run('[...RS_AUDIO.voices]');assert.equal(voices.length,2);assert(voices[0].panner.pan.value>0&&voices[1].panner.pan.value<0);
 for(let i=0;i<20;i++)f.run('rsAudioWaterMotion({x:5,y:7},1);rsAudioWaterImpact({x:5,y:3},1)');assert.equal(f.run('RS_AUDIO.voices.size'),2);
 f.ctx.currentTime=.2;f.run('rsAudioWaterMotion({x:5,y:7},1)');assert.equal(f.run('RS_AUDIO.voices.size'),3);assert.equal(f.ctx.bufferCount,before);
 assert.equal(f.run('RS_AUDIO.stats.steps'),0);f.audio.active=false;f.ctx.currentTime=1;f.run('rsAudioWaterMotion({x:5,y:7},1)');assert.equal(f.run('RS_AUDIO.voices.size'),3);
});
test('public water helpers safely no-op before audio is ready',()=>{
 const f=fixture();f.audio.ctx=null;f.run('rsAudioWaterFootstep();rsAudioWaterImpact();rsAudioWaterMotion();rsAudioTransferMix(true);rsAudioTransferUpdate(.1)');assert.equal(f.run('RS_AUDIO.voices.size'),0);
});
test('late original boot decoding warms each cached palette once and never bypasses the softened path',()=>{
 const f=fixture();f.run('rsAudioMix(true)');const synthetic=f.run("rsAudioBuffer('dry',0)").getChannelData(0).slice();
 const bank=f.ctx.createBuffer(1,f.ctx.sampleRate*2,f.ctx.sampleRate),data=bank.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.sin(i/f.ctx.sampleRate*Math.PI*2*173)*.35;
 f.c.AUDIO_CUES=Object.fromEntries([0,1,2,3].map(i=>['step'+i,{start:i*.4,duration:.34}]));f.audio.bank=bank;let bypass=0;f.audio.play=()=>{bypass++;};
 f.run('rsAudioUpdate(.05,rsGround())');const shaped=f.run("rsAudioBuffer('dry',0)").getChannelData(0);assert(shaped.some((v,i)=>Math.abs(v-synthetic[i])>.01),'original sole must contribute');
 const warmed=f.ctx.bufferCount;for(let i=0;i<12;i++)f.run(`rsAudioUpdate(.05,rsGround());rsFootstep(${i%2?.16:0},${i},rsGround(),4);`);
 assert.equal(f.ctx.bufferCount,warmed);assert.equal(bypass,0);assert(f.run('[...RS_AUDIO.voices].every(v=>v.kind==="footstep")'));
});
test('complete chapter world supplies room acoustics and actual exit releases its audio graph',()=>{
 const runtime=require('./runtime_harness.cjs'),r=runtime();r.eval('artReady=true;rsPreview("rs_stairs");rsEnter();');
 assert(r.eval('rsRunning()&&RW.rooms.length===84'));
 r.context.rsAudioTestContext=new Context();r.eval('audio.ctx=rsAudioTestContext;for(const key of ["master","sfx","music","ambience","musicBed","musicDuck","roomReturn"])audio[key]=audio.ctx.createGain();audio.roomTone=audio.ctx.createBiquadFilter();audio.room=audio.ctx.createConvolver();audio.active=true;rsAudioMix(true);');
 r.eval('var audioTestRoom=RW.rooms.find(r=>r.acoustic==="pool");RS.active.room=audioTestRoom.id;RS.active.z=audioTestRoom.z;player.x=(audioTestRoom.bounds[0]+audioTestRoom.bounds[2])/2;player.y=(audioTestRoom.bounds[1]+audioTestRoom.bounds[3])/2;rsAudioUpdate(.05,audioTestRoom);rsFootstep(.3,0,audioTestRoom,4);');
 assert.equal(r.eval('RS_AUDIO.preset'),'pool');assert(r.eval('RS_AUDIO.voices.size>0'));r.eval('rsLeave(true);');
 assert(!r.eval('rsRunning()||RS_AUDIO.enabled'));assert.equal(r.eval('RS_AUDIO.voices.size+RS_AUDIO.banks.length'),0);assert.equal(r.eval('RS_AUDIO.verb.links.length'),0);assert(r.eval('audio.ambience.gain.value>0'));
});
const renderAt=process.argv.indexOf('--render-dir');if(renderAt>=0){
 const folder=path.resolve(process.argv[renderAt+1]);fs.mkdirSync(folder,{recursive:true});const f=fixture();f.run('rsAudioMix(true)');
 function wav(name,b){const frames=b.length,ch=b.numberOfChannels,out=Buffer.alloc(44+frames*ch*2);out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(ch,22);out.writeUInt32LE(b.sampleRate,24);out.writeUInt32LE(b.sampleRate*ch*2,28);out.writeUInt16LE(ch*2,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(out.length-44,40);for(let i=0;i<frames;i++)for(let c=0;c<ch;c++)out.writeInt16LE(Math.round(Math.max(-1,Math.min(1,b.getChannelData(c)[i]))*32767),44+(i*ch+c)*2);fs.writeFileSync(path.join(folder,name+'.wav'),out);}
 for(const kind of ['dry','puddle','shallow','deep','drip','flow','water'])wav(kind,f.run(`rsAudioBuffer('${kind}',0)`));for(const kind of ['suite','pool','cavern'])wav('response-'+kind,f.run(`rsAudioImpulse('${kind}')`));
 console.log('DSP sample WAVs saved for listening review: '+folder);
}
console.log(passed+' restroom audio behavior/DSP checks passed. Listening and browser checks are separate.');
