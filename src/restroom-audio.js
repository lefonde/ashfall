// The Lower Restrooms: movement-led water Foley and architecture-led acoustics.
// Water Foley uses six actual CC0 recordings; see WATER_AUDIO_CREDITS.md.
// Room responses/dry layering remain synthesized. Inherited media are intact.
const RS_ACOUSTICS=Object.freeze({
 suite:{seconds:.72,delay:.006,early:[.011,.023,.041],tone:7200,wet:.47},
 tile:{seconds:1.25,delay:.011,early:[.019,.037,.063,.091],tone:6800,wet:.55},
 service:{seconds:1.65,delay:.013,early:[.023,.051,.087,.132],tone:3900,wet:.51},
 gallery:{seconds:2.8,delay:.025,early:[.047,.093,.151,.218],tone:5200,wet:.72},
 pool:{seconds:4.7,delay:.041,early:[.063,.129,.204,.317,.441],tone:4500,wet:.92},
 cavern:{seconds:6.8,delay:.068,early:[.103,.219,.376,.593,.821],tone:3100,wet:1.05},
 court:{seconds:5.6,delay:.049,early:[.081,.173,.291,.469,.682],tone:3700,wet:.9},
 anechoic:{seconds:0,delay:0,early:[],tone:19000,wet:0}
});
const RS_AUDIO={ctx:null,enabled:false,domain:null,out:null,verb:null,banks:[],preset:null,room:null,
 buffers:new Map(),footBank:null,impulses:new Map(),voices:new Set(),emitters:new Map(),near:[],clock:0,scan:0,
 graph:null,graphWorld:null,hopFrom:null,hopDistances:null,seed:104729,waterTake:0,motionAt:-Infinity,impactAt:-Infinity,stats:{steps:0,waterSteps:0,drySteps:0,drips:0,peakVoices:0,events:[]}};
function rsAudioRandom(seed){let n=(seed|0)||1;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296;};}
function rsAudioHash(s){let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;}
function rsAudioEvent(kind,extra={}){const a=RS_AUDIO;const e={kind,time:a.ctx?.currentTime||0,room:a.room?.id||null,...extra};a.stats.events.push(e);if(a.stats.events.length>80)a.stats.events.shift();}
function rsAudioParam(param,value,time,smooth=.1){if(!param)return;param.cancelScheduledValues?.(time);param.setTargetAtTime(value,time,smooth);}
function rsAudioDisconnect(nodes){for(const n of nodes)try{n.disconnect();}catch{}}
function rsAudioInit(){
 const c=audio.ctx,a=RS_AUDIO;if(!c)return false;if(a.ctx===c&&a.out)return true;
 if(a.ctx){rsAudioStop();rsAudioDisconnect([a.out,a.verb].filter(Boolean));}a.ctx=c;a.buffers.clear();a.footBank=null;a.impulses.clear();a.preset=null;a.room=null;
 a.out=c.createGain();a.out.gain.value=0;a.out.connect(audio.sfx);a.verb=c.createGain();a.verb.gain.value=1;
 // One-time small Foley bank. Footfalls only create sources/nodes, never PCM arrays.
 rsAudioWarmSteps();
 for(let i=0;i<6;i++){rsAudioBuffer('water-motion',i);rsAudioBuffer('water-impact',i);}
 for(let i=0;i<4;i++)rsAudioBuffer('drip',i);rsAudioBuffer('flow',0);rsAudioBuffer('water',0);rsAudioBuffer('door',0);
 return true;
}
function rsAudioWarmSteps(){
 const a=RS_AUDIO,bank=audio.bank?.getChannelData&&typeof AUDIO_CUES!=='undefined'?audio.bank:null;
 // Decoding can finish after chapter entry. Rebuild this tiny bank once from an
 // update, never in rsFootstep, and leave any already-playing buffers untouched.
 if(a.footBank===bank&&a.buffers.has('dry:5'))return;a.footBank=bank;
 for(const material of ['dry','puddle','shallow','deep'])for(let i=0;i<6;i++){a.buffers.delete(material+':'+i);rsAudioBuffer(material,i);}
}
function rsAudioRecordedWater(kind,variant=0){
 const a=RS_AUDIO,c=a.ctx;if(!c||typeof rsWaterRecording!=='function')return null;
 const take=((Math.floor(variant)%6)+6)%6,key=kind+':'+take;
 if(a.buffers.has(key))return a.buffers.get(key);
 const recording=rsWaterRecording(take),input=recording.data,sr=c.sampleRate,foot=!kind.startsWith('water-');
 const scale=kind==='puddle'?1.09:kind==='deep'?.86:kind==='water-motion'?.94:1;
 const offset=kind==='water-motion'?Math.min(.14,input.length/recording.sampleRate*.23):0;
 const length=Math.max(.22,input.length/recording.sampleRate-offset)/scale+.04;
 const buffer=c.createBuffer(1,Math.ceil(sr*length),sr),out=buffer.getChannelData(0);
 const dry=foot?rsAudioBuffer('dry',take):null,sole=dry?.getChannelData(0),soleRate=dry?.sampleRate||sr;
 // Recorded sheets, cavities and droplets supply the actual splash. A subdued
 // low boot contact joins it to the same heavy character without a bass-drum hit.
 const cutoff=kind==='deep'?3200:kind==='water-motion'?3400:4300;
 const k=1-Math.exp(-2*Math.PI*cutoff/sr),kBoot=1-Math.exp(-2*Math.PI*230/sr);
 let low=0,boot=0;
 for(let i=0;i<out.length;i++){
  const t=i/sr,at=((t-.009)*scale+offset)*recording.sampleRate,j=Math.floor(at),mix=at-j;
  const sample=j>=0&&j+1<input.length?input[j]*(1-mix)+input[j+1]*mix:0;
  low+=k*(sample-low);
  const bootAt=Math.floor(t*soleRate);boot+=kBoot*((sole&&bootAt<sole.length?sole[bootAt]:0)-boot);
  const envelope=Math.min(1,t/.012),tail=Math.min(1,(out.length-1-i)/(sr*.022));
  const weight=kind==='puddle'?.30:kind==='deep'?.16:.23;
  out[i]=(low*(kind==='water-impact'?.78:kind==='water-motion'?.61:.69)+(foot?boot*weight:0))*envelope*envelope*(3-2*envelope)*Math.max(0,tail);
 }
 // Never raise quiet droplets to a normalized peak: their recorded contrast is
 // the detail missing from the prior broad filtered-noise envelope.
 let peak=0;for(const v of out)peak=Math.max(peak,Math.abs(v));
 if(peak>.57)for(let i=0;i<out.length;i++)out[i]*=.57/peak;
 a.buffers.set(key,buffer);return buffer;
}
function rsAudioBuffer(kind,variant=0){
 const a=RS_AUDIO,key=kind+':'+(variant%6);if(a.buffers.has(key))return a.buffers.get(key);
 if(['puddle','shallow','deep','water-motion','water-impact'].includes(kind))return rsAudioRecordedWater(kind,variant);
 const c=a.ctx;if(!c)return null;const sr=c.sampleRate,random=rsAudioRandom(rsAudioHash(key)),exp=Math.exp,sin=Math.sin,PI=Math.PI;
 const seconds=({dry:.34,drip:.52,flow:6,water:6,door:.78})[kind]||.53;
 const buffer=c.createBuffer(1,Math.ceil(sr*seconds),sr),out=buffer.getChannelData(0);
 const foot=kind==='dry',phase=random()*PI*2;
 const soleCue=foot&&a.footBank?AUDIO_CUES['step'+(variant%4)]:null,sole=soleCue?a.footBank.getChannelData(0):null;
 const soleRate=a.footBank?.sampleRate||sr,soleStart=Math.round((soleCue?.start||0)*soleRate);
 const droplets=Array.from({length:kind==='drip'?5:0},(_,i)=>({
  at:.008+i*.039+random()*.02,f:650+random()*1600,
  dur:.014+random()*.045,amp:.019+random()*.041,phase:random()*6.28
 }));
 // Sample-rate independent noise filters prevent a 48 kHz phone from making the
 // same splash twice as bright as the offline 24 kHz fixture.
 const kWash=1-exp(-2*PI*1250/sr),kBody=1-exp(-2*PI*170/sr),kSole=1-exp(-2*PI*1150/sr);
 let low=0,body=0,slow=0,rounded=0,bodyRound=0,soleLow=0,soleRound=0;
 for(let i=0;i<out.length;i++){
  const t=i/sr,n=random()*2-1;low+=(foot?kWash:.11)*(n-low);body+=(foot?kBody:.017)*(n-body);slow+=.0013*(n-slow);rounded+=kWash*(low-rounded);bodyRound+=kBody*(body-bodyRound);let v=0;
  // Broad heel-to-sole loading supplies weight without a click or a rigid pitched
  // thud. The same low body lives under dry and wet steps, joining their identity.
  const heel=(t-.043)/.028,roll=(t-.088)/.049,weight=exp(-heel*heel)+.49*exp(-roll*roll);
  const boot=(sin(2*PI*((91+variant*2)*t-31*t*t))*.12+bodyRound*1.45)*weight;
  if(sole){const at=soleStart+Math.floor(t*soleRate*.96),sample=t<soleCue.duration&&at<sole.length?sole[at]:0;soleLow+=kSole*(sample-soleLow);soleRound+=kSole*(soleLow-soleRound);}
  const original=soleRound*.50*(1-exp(-t/.014))*exp(-Math.max(0,t-.19)*18);
  if(kind==='dry'){
   const soleAt=(t-.12)/.055;v=boot+original+rounded*.15*exp(-soleAt*soleAt);
  }else if(kind==='drip'){
   const rebound=(t-.072)/.042;v=(n*.07+low*.30)*exp(-t*100)*(1-exp(-t*800));
   v+=body*.15*exp(-rebound*rebound);
  }else if(kind==='door'){
   const latch=(t-.045)/.02,stop=(t-.57)/.06,hinge=(t-.28)/.22;v=body*.40*(exp(-latch*latch)+exp(-stop*stop));
   v+=low*.1*exp(-hinge*hinge)*(.7+.3*sin(t*73));
  }else{
   // Stable local moving-water texture; no pitched room tone beneath it.
   const ripple=.58+.21*sin(t*2*PI*3/seconds+phase)+.14*sin(t*2*PI*11/seconds);
   v=kind==='flow'?(low*.47+(n-low)*.026+body*.40)*ripple:(body*.9+low*.14+slow*1.5)*ripple;
  }
  out[i]=v;
 }
 for(const d of droplets){const start=Math.ceil(d.at*sr),end=Math.min(out.length,Math.ceil((d.at+d.dur)*sr));
  for(let i=start;i<end;i++){const u=i/sr-d.at,e=sin(PI*u/d.dur)*exp(-u/d.dur*3.2);out[i]+=sin(d.phase+2*PI*d.f*(u-u*u/(d.dur*5)))*d.amp*e;}
 }
 if(foot){
  // A short eased onset removes random first-sample edges. A gentle final lowpass
  // rounds small droplet transients while leaving air in the splash envelope.
  const k=1-exp(-2*PI*1050/sr);let smooth=0;
  for(let i=0;i<out.length;i++){smooth+=k*(out[i]-smooth);const u=Math.min(1,i/(sr*.018));out[i]=smooth*u*u*(3-2*u);}
 }
 if(kind==='flow'||kind==='water'){
  // Match both loop ends by overlap, preserving a continuous quiet water texture.
  const count=Math.round(sr*.15);for(let i=0;i<count;i++){const k=i/count;out[out.length-count+i]=out[out.length-count+i]*(1-k)+out[i]*k;}
 }else{
  const fade=Math.min(out.length,Math.ceil(sr*.018));for(let i=0;i<fade;i++)out[out.length-1-i]*=i/fade;
 }
 // Controlled peak leaves headroom for overlapping steps, echoes and inherited guns.
 let peak=0;for(const n of out)peak=Math.max(peak,Math.abs(n));
 const target=kind==='dry'?.35:kind==='drip'?.30:kind==='door'?.31:.24;
 const norm=peak>0?target/peak:1;for(let i=0;i<out.length;i++)out[i]*=norm;
 a.buffers.set(key,buffer);return buffer;
}
function rsAudioImpulse(name){
 const a=RS_AUDIO,p=RS_ACOUSTICS[name]||RS_ACOUSTICS.tile;if(!p.seconds)return null;
 if(a.impulses.has(name))return a.impulses.get(name);
 const sr=a.ctx.sampleRate,b=a.ctx.createBuffer(2,Math.ceil(sr*p.seconds),sr);
 for(let ch=0;ch<2;ch++){
  const random=rsAudioRandom(rsAudioHash(name)+ch*977),d=b.getChannelData(ch);let low=0;
  for(let i=Math.ceil(p.delay*sr);i<d.length;i++){
   const t=i/sr,age=t-p.delay,n=random()*2-1;low+=(.13+.1*Math.exp(-age))*(n-low);
   const envelope=Math.exp(-6.91*age/p.seconds)*Math.min(1,age/.035);
   d[i]=(low*.75+n*.25)*envelope*.033/Math.sqrt(sr/48000);
  }
  p.early.forEach((delay,index)=>{const at=Math.round((delay+ch*.0027)*sr);if(at<d.length)d[at]+=(.31/Math.sqrt(index+1))*(ch&&index%2?-.65:1);});
 }
 a.impulses.set(name,b);
 // Four cached responses plus at most three live banks bound the large-room cost.
 if(a.impulses.size>4)for(const key of a.impulses.keys())if(key!==name){a.impulses.delete(key);break;}
 return b;
}
function rsAudioRoom(surface){
 if(surface?.room||surface?.acoustic||typeof surface?.ambience==='string'||typeof surface?.ambient==='string')return surface;
 const id=typeof RS!=='undefined'?RS.active?.room:null;
 return (RW.byId?.[id]?.room?RW.byId[id]:RW.surfaces.find(r=>r.id===id&&r.room))||surface||null;
}
function rsAudioPreset(room){const key=room?.acoustic||(typeof RS!=='undefined'?RW.byId?.[RS.active?.room]?.acoustic:null);return RS_ACOUSTICS[key]?key:'tile';}
function rsAudioRetireBank(bank){if(!bank)return;try{RS_AUDIO.verb.disconnect(bank.input);}catch{}rsAudioDisconnect(bank.nodes);const i=RS_AUDIO.banks.indexOf(bank);if(i>=0)RS_AUDIO.banks.splice(i,1);}
function rsAudioSetRoom(room){
 const a=RS_AUDIO,c=a.ctx;if(!c)return;const name=rsAudioPreset(room),p=RS_ACOUSTICS[name];if(a.room?.id!==room?.id)a.scan=0;a.room=room;
 if(name===a.preset)return;const t=c.currentTime;
 for(const bank of a.banks){if(!Number.isFinite(bank.until)){rsAudioParam(bank.input.gain,0,t,.11);bank.until=t+bank.seconds+.7;}if(name==='anechoic')rsAudioParam(bank.output.gain,0,t,.10);}
 a.preset=name;rsAudioEvent('acoustic',{preset:name});if(!p.seconds)return;
 const input=c.createGain(),convolver=c.createConvolver(),tone=c.createBiquadFilter(),output=c.createGain();
 input.gain.value=0;convolver.normalize=false;convolver.buffer=rsAudioImpulse(name);tone.type='lowpass';tone.frequency.value=p.tone;output.gain.value=p.wet;
 a.verb.connect(input);input.connect(convolver).connect(tone).connect(output).connect(a.out);rsAudioParam(input.gain,1,t,.11);
 a.banks.push({name,input,output,seconds:p.seconds,until:Infinity,nodes:[input,convolver,tone,output]});
 while(a.banks.length>3)rsAudioRetireBank(a.banks[0]);
}
function rsAudioGraph(){
 const a=RS_AUDIO;if(a.graph&&a.graphWorld===RW.surfaces)return a.graph;
 const g=new Map();for(const r of RW.surfaces)g.set(r.id,new Set(r.neighbors||[]));
 for(const p of RW.portals||[]){const from=p.a??p.from,to=p.b??p.to;if(!from||!to)continue;if(!g.has(from))g.set(from,new Set());if(!g.has(to))g.set(to,new Set());g.get(from).add(to);g.get(to).add(from);}
 a.graph=g;a.graphWorld=RW.surfaces;a.hopFrom=null;a.hopDistances=null;return g;
}
function rsAudioHops(from,to){
 if(from===to)return 0;const a=RS_AUDIO,graph=rsAudioGraph();
 if(a.hopFrom!==from){const distances=new Map([[from,0]]),queue=[from];
  for(let i=0;i<queue.length;i++){const id=queue[i],n=distances.get(id);if(n>=5)continue;for(const next of graph.get(id)||[])if(!distances.has(next)){distances.set(next,n+1);queue.push(next);}}
  a.hopFrom=from;a.hopDistances=distances;
 }return a.hopDistances.get(to)??Infinity;
}
function rsAudioOccluded(pos){
 const dx=pos.x-player.x,dy=pos.y-player.y,z=(RS.active?.z||0)+(typeof RS_EYE==='number'?RS_EYE:1.55),dz=(pos.z??z)-z;
 const bounds=[Math.min(player.x,pos.x),Math.min(player.y,pos.y),Math.max(player.x,pos.x),Math.max(player.y,pos.y)];
 const solids=RW.solidIndex&&typeof rsGridQuery==='function'?rsGridQuery(RW.solidIndex,bounds):RW.solids||[];
 for(const b of solids){if(b.disabled)continue;let lo=0,hi=1;
  for(const [start,delta,min,max]of [[player.x,dx,b.x1,b.x2],[player.y,dy,b.y1,b.y2],[z,dz,b.z,b.z+b.h]]){
   if(Math.abs(delta)<.00001){if(start<min||start>max){hi=-1;break;}}
   else{let n=(min-start)/delta,f=(max-start)/delta;if(n>f){const hold=n;n=f;f=hold;}lo=Math.max(lo,n);hi=Math.min(hi,f);}
  }if(hi>=lo&&lo>.035&&lo<.96)return true;
 }return false;
}
function rsAudioPosition(pos,room){
 if(RS_AUDIO.domain==='transfer'||typeof RS==='undefined'||!RS.active){
  const dx=pos.x-player.x,dy=pos.y-player.y,distance=Math.hypot(dx,dy);
  return {gain:1/(1+distance*.14+distance*distance*.003),pan:Math.max(-.88,Math.min(.88,(dy*Math.cos(player.a)-dx*Math.sin(player.a))/Math.max(1,distance))),tone:Math.max(1800,11000-distance*130),hops:0};
 }
 const dx=pos.x-player.x,dy=pos.y-player.y,dz=(pos.z??RS.active?.z??0)-(RS.active?.z||0),distance=Math.hypot(dx,dy,dz*2.3);
 if(distance>85)return {gain:0,pan:0,tone:1000,hops:Infinity};
 const from=room?.id||RS_AUDIO.room?.id,to=pos.room??pos.owner??from,hops=rsAudioHops(from,to);
 if(!Number.isFinite(hops))return {gain:0,pan:0,tone:1000,hops};
 // A neighbouring room already loses some direct sound through its portals.
 // A closed door/solid adds a separate loss; opening it must audibly matter.
 const solid=rsAudioOccluded(pos),gain=1/(1+distance*.16+distance*distance*.0025)*Math.pow(.57,hops)*(solid?.38:hops>0?.74:1);
 return {gain,pan:Math.max(-.88,Math.min(.88,(dy*Math.cos(player.a)-dx*Math.sin(player.a))/Math.max(1,distance))),tone:solid?850:hops>0?1900:Math.max(2600,12000-distance*145),hops};
}
function rsAudioEndVoice(voice){
 if(!voice||voice.ended)return;voice.ended=true;rsAudioDisconnect(voice.nodes);RS_AUDIO.voices.delete(voice);
}
function rsAudioVoice(buffer,{gain=1,wet=.65,pan=0,rate=1,pos=null,loop=false,ambient=false,kind='effect'}={}){
 const a=RS_AUDIO,c=a.ctx;if(!buffer||!a.enabled||!c||!audio.active)return null;
 if(a.voices.size>=24){const old=[...a.voices].find(v=>!v.loop)||[...a.voices][0];if(old){try{old.source.stop();}catch{}rsAudioEndVoice(old);}}
 const source=c.createBufferSource(),filter=c.createBiquadFilter(),level=c.createGain(),send=c.createGain();
 source.buffer=buffer;source.playbackRate.value=rate;source.loop=loop;if(loop){source.loopStart=.15;source.loopEnd=buffer.duration;}filter.type='lowpass';filter.frequency.value=15000;level.gain.value=loop?0:gain;send.gain.value=wet;
 source.connect(filter).connect(level);let panner=null;const nodes=[source,filter,level,send];
 if(c.createStereoPanner){panner=c.createStereoPanner();panner.pan.value=pan;level.connect(panner).connect(a.out);nodes.push(panner);}else level.connect(a.out);
 level.connect(send).connect(a.verb);const voice={source,filter,level,panner,send,nodes,loop,ambient,kind,pos,gain,ended:false,until:loop?Infinity:c.currentTime+buffer.duration/rate+.04};
 source.onended=()=>rsAudioEndVoice(voice);a.voices.add(voice);source.start(c.currentTime);a.stats.peakVoices=Math.max(a.stats.peakVoices,a.voices.size);return voice;
}
function rsFootstep(wetOrDepth,take=0,surface=null,speed=3.8){
 const a=RS_AUDIO;if(!a.enabled||!audio.active||!a.ctx)return;
 const depth=typeof wetOrDepth==='number'?Math.max(0,wetOrDepth):wetOrDepth?.14:0;
 if(depth>.008)return rsAudioWaterFootstep({depth,take,speed,side:take%2?1:-1,room:surface});
 const room=rsAudioRoom(surface);if(room)rsAudioSetRoom(room);
 const material=depth<=.008?'dry':depth<.075?'puddle':depth<.25?'shallow':'deep',variant=((take%6)+6)%6;
 const pan=take%2?.09:-.09,force=Math.max(.68,Math.min(1.15,.70+Math.max(0,speed)*.08));
 rsAudioVoice(rsAudioBuffer(material,variant),{gain:(material==='dry'?.58:.66)*force,wet:material==='dry'?.47:.67,pan,rate:.97+(variant%3)*.026,kind:'footstep'});
 a.stats.steps++;if(material==='dry')a.stats.drySteps++;else a.stats.waterSteps++;
 rsAudioEvent('footstep',{material,depth,take});
}
const RS_TRANSFER_ACOUSTICS=Object.freeze({id:'transfer',room:true,acoustic:'gallery',ambience:'silent'});
function rsAudioWaterRoom(room){return room==='transfer'?RS_TRANSFER_ACOUSTICS:room&&typeof room==='object'?rsAudioRoom(room):RS_AUDIO.domain==='transfer'?RS_TRANSFER_ACOUSTICS:rsAudioRoom(null);}
// Public water helpers work in the original-control Transfer and the height-aware
// Restrooms. Positions use the active scene's coordinates; room IDs aid occlusion.
function rsAudioWaterFootstep({depth=.14,speed=3.8,side=0,pos=null,volume=1,room=null,take=null}={}){
 const a=RS_AUDIO;if(!a.enabled||!a.ctx||!audio.active)return null;
 depth=Number.isFinite(depth)?Math.max(.009,depth):.14;speed=Number.isFinite(speed)?Math.max(0,speed):3.8;
 const space=rsAudioWaterRoom(room);if(space)rsAudioSetRoom(space);
 const material=depth<.075?'puddle':depth<.25?'shallow':'deep',variant=Number.isFinite(take)?((Math.floor(take)%6)+6)%6:a.waterTake++%6;
 const location=pos?rsAudioPosition(pos,space):{gain:1,pan:Math.sign(side)*.085,tone:14000};
 const force=Math.max(.62,Math.min(1.08,.68+speed*.075)),level=Math.max(0,Math.min(2,Number.isFinite(volume)?volume:1));
 const voice=rsAudioVoice(rsAudioBuffer(material,variant),{gain:.72*force*level*location.gain,wet:.42,pan:location.pan,rate:.99+(variant%3-1)*.012,pos,kind:'footstep'});
 if(voice)voice.filter.frequency.value=location.tone;
 a.stats.steps++;a.stats.waterSteps++;rsAudioEvent('footstep',{material,depth,take:variant,recorded:true});return voice;
}
function rsAudioWaterEffect(kind,pos,power=1){
 const a=RS_AUDIO;if(!a.enabled||!a.ctx||!audio.active)return null;
 power=Number.isFinite(power)?Math.max(0,Math.min(2,power)):1;if(power<=0)return null;
 const key=kind==='water-motion'?'motionAt':'impactAt',now=a.ctx.currentTime;
 // Bounds accidental per-frame callers and shotgun pellets while ordinary
 // individual creature footfalls remain positional, separated and readable.
 if(now-a[key]<(kind==='water-motion'?.085:.045))return null;a[key]=now;
 const location=pos?rsAudioPosition(pos,a.room):{gain:1,pan:0,tone:13000},variant=a.waterTake++%6;
 if(location.gain<.002)return null;
 const voice=rsAudioVoice(rsAudioBuffer(kind,variant),{gain:(kind==='water-motion'?.52:.57)*Math.sqrt(power)*location.gain,wet:.50,pan:location.pan,rate:kind==='water-motion'?1.02:.98,pos,kind});
 if(voice)voice.filter.frequency.value=location.tone;rsAudioEvent(kind,{power});return voice;
}
function rsAudioWaterImpact(pos=null,power=1){return rsAudioWaterEffect('water-impact',pos,power);}
function rsAudioWaterMotion(pos=null,power=1){return rsAudioWaterEffect('water-motion',pos,power);}
function rsAudioTransferMix(on){
 if(!on){if(RS_AUDIO.domain==='transfer')rsAudioStop();return;}
 if(!rsAudioInit())return;const a=RS_AUDIO;a.enabled=true;a.domain='transfer';
 rsAudioParam(a.out.gain,1,a.ctx.currentTime,.10);rsAudioSetRoom(RS_TRANSFER_ACOUSTICS);
}
function rsAudioRetireExpired(){
 const a=RS_AUDIO,t=a.ctx?.currentTime||0;
 for(const v of [...a.voices])if(!v.loop&&t>v.until)rsAudioEndVoice(v);
 for(const bank of [...a.banks])if(t>bank.until)rsAudioRetireBank(bank);
}
function rsAudioTransferUpdate(dt){
 const a=RS_AUDIO;if(!a.enabled||a.domain!=='transfer'||!a.ctx||!audio.active)return;
 rsAudioWarmSteps();a.clock+=Number.isFinite(dt)?Math.max(0,Math.min(dt,.1)):0;rsAudioRetireExpired();
}
function rsAudioDoor(position=null,opening=true){
 if(!RS_AUDIO.enabled||!audio.active)return;let gain=.48,pan=0;if(position){const p=rsAudioPosition(position,RS_AUDIO.room);gain*=p.gain;pan=p.pan;}
 rsAudioVoice(rsAudioBuffer('door',0),{gain,pan,wet:.70,rate:opening?.92:1.06,kind:'door'});rsAudioEvent('door',{opening});
}
function rsAudioEmitterVoice(state){
 const e=state.emitter,kind=e.kind==='flow'?'flow':'water';
 state.voice=rsAudioVoice(rsAudioBuffer(kind,0),{gain:e.gain??.40,wet:.65,pos:e,loop:true,ambient:true,kind});return state.voice;
}
function rsAudioScan(room){
 const a=RS_AUDIO,mode=room?.ambience??room?.ambient??'silent';a.near=[];
 if(mode==='silent'||a.preset==='anechoic')return;
 const emitters=(RW.emitters||[]).length?RW.emitters:(room?.emitters||[]);
 for(const e of emitters){const p=rsAudioPosition(e,room);if(p.gain<.012)continue;let state=a.emitters.get(e.id);
  if(!state){state={emitter:e,voice:null,random:rsAudioRandom(rsAudioHash(e.id)),next:a.clock+.25+(rsAudioHash(e.id)%310)/100};a.emitters.set(e.id,state);}
  a.near.push({state,p});
 }a.near.sort((u,v)=>v.p.gain-u.p.gain);a.near=a.near.slice(0,4);
}
function rsAudioUpdate(dt,surface=null){
 const a=RS_AUDIO;if(!a.enabled||!a.ctx||!audio.active)return;
 rsAudioWarmSteps();
 dt=Number.isFinite(dt)?Math.max(0,Math.min(dt,.1)):0;a.clock+=dt;const c=a.ctx,t=c.currentTime,room=rsAudioRoom(surface);
 const changed=room?.id!==a.room?.id;rsAudioSetRoom(room);a.scan-=dt;
 if(changed||a.scan<=0){a.scan=.13;rsAudioScan(room);}
 const audible=new Set();
 for(const {state}of a.near){const e=state.emitter,p=rsAudioPosition(e,room);audible.add(e.id);
  if(e.kind==='drip'){
   if(a.clock>=state.next){const interval=Array.isArray(e.interval)?e.interval:[e.interval||2.6,(e.interval||2.6)*2.5];state.next=a.clock+interval[0]+state.random()*(interval[1]-interval[0]);
    const variant=Math.floor(state.random()*4),v=rsAudioVoice(rsAudioBuffer('drip',variant),{gain:(e.gain??.46)*p.gain,wet:.86,pan:p.pan,rate:.92+state.random()*.16,pos:e,ambient:true,kind:'drip'});
    if(v)v.filter.frequency.value=p.tone;a.stats.drips++;rsAudioEvent('drip',{emitter:e.id});
   }
  }else{
   const v=state.voice&&!state.voice.ended?state.voice:rsAudioEmitterVoice(state);if(!v)continue;
   rsAudioParam(v.level.gain,(e.gain??.40)*p.gain,t,.22);rsAudioParam(v.filter.frequency,p.tone,t,.18);if(v.panner)rsAudioParam(v.panner.pan,p.pan,t,.10);v.retireAt=Infinity;
  }
 }
 for(const [id,state]of a.emitters){const v=state.voice;if(!v||v.ended||audible.has(id))continue;
  if(!Number.isFinite(v.retireAt)){rsAudioParam(v.level.gain,0,t,.16);v.retireAt=t+.9;}
  if(t>=v.retireAt){try{v.source.stop();}catch{}rsAudioEndVoice(v);state.voice=null;}
 }
 rsAudioRetireExpired();
}
function rsAudioMix(on){
 const a=RS_AUDIO;if(!on){rsAudioStop();return;}if(!rsAudioInit())return;
 a.enabled=true;a.domain='restrooms';const t=a.ctx.currentTime;rsAudioParam(a.out.gain,1,t,.10);
 audio.heartSilenceMusic?.();rsAudioParam(audio.music?.gain,0,t,.10);rsAudioParam(audio.ambience?.gain,0,t,.10);
 const surface=typeof RS!=='undefined'&&RS.active?rsGround(player.x,player.y,RS.active.z):null;rsAudioSetRoom(rsAudioRoom(surface));
}
function rsAudioStop(){
 const a=RS_AUDIO;a.enabled=false;a.domain=null;a.motionAt=a.impactAt=-Infinity;if(a.out&&a.ctx)rsAudioParam(a.out.gain,0,a.ctx.currentTime,.04);
 for(const v of [...a.voices]){try{v.source.stop();}catch{}rsAudioEndVoice(v);}
 for(const b of [...a.banks])rsAudioRetireBank(b);a.emitters.clear();a.near=[];a.room=null;a.preset=null;a.scan=0;a.clock=0;
}
// Route only voices born in this chapter into its acoustic space. The owner's
// original firearm/casing/reload/impact samples, volume choices and other levels
// retain their original code and media. The shared hall convolver stays intact.
const rsAudioOriginalPlay=audio.play;
audio.play=function(...args){const v=rsAudioOriginalPlay.apply(this,args);
 if(v?.send&&RS_AUDIO.enabled&&RS_AUDIO.verb){try{v.send.disconnect();v.send.connect(RS_AUDIO.verb);}catch{}}
 return v;
};
