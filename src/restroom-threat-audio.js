// The Drowned Hollow has its own throat: angry, short performances follow
// real movement. Existing water PCM, footsteps, music and campaign cues are not
// changed. These cached layers reuse the inherited recorded creature banks.
const RST_AUDIO={ctx:null,approved:null,fx:null,monster:null,buffers:new Map(),sources:new Map(),voices:new Set(),tails:new Set(),owners:new Map(),group:new Map(),serial:0,stats:{played:0,culled:0,peakVoices:0}};
const RST_EVENTS=Object.freeze({
 awake:{priority:1,gap:1.6,group:.12,gain:.76,wet:.24,tone:7500},
 breathe:{priority:0,gap:1.4,group:.28,gain:.66,wet:.19,tone:6300},
 charge:{priority:3,gap:.65,group:.055,gain:1.22,wet:.22,tone:12500},
 windup:{priority:4,gap:.35,group:.045,gain:1.05,wet:.15,tone:12000},
 attack:{priority:5,gap:.25,group:.04,gain:1.24,wet:.17,tone:13000},
 hit:{priority:2,gap:.18,group:.035,gain:.91,wet:.20,tone:10800},
 death:{priority:6,gap:2,group:.045,gain:.87,wet:.26,tone:8500}
});
function rsThreatSource(bankName,key){
 const a=RST_AUDIO,id=bankName+':'+key;if(a.sources.has(id))return a.sources.get(id);
 const bank=bankName==='approved'?audio.approvedBank:bankName==='monster'?audio.monsterBank:audio.bank;
 const cues=bankName==='approved'?CREATURE_AUDITION_CUES:bankName==='monster'?CREATURE_AUDIO_CUES:AUDIO_CUES,cue=cues?.[key];
 if(!bank?.getChannelData||!cue||cue.start<0||cue.duration<=0||cue.start+cue.duration>bank.duration+.05)return null;
 const data=bank.getChannelData(0),rate=bank.sampleRate,start=Math.floor(cue.start*rate),end=Math.min(data.length,Math.floor((cue.start+cue.duration)*rate));
 let peak=0;for(let i=start;i<end;i++)peak=Math.max(peak,Math.abs(data[i]));
 // Only trim genuine leading silence; retain the mouth articulation itself.
 let onset=start;while(onset<end&&Math.abs(data[onset])<peak*.035)onset++;
 onset=Math.max(start,onset-Math.floor(rate*.006));
 const source={data,rate,start:onset,end};a.sources.set(id,source);return source;
}
function rsThreatRecipe(kind,event,take=0){
 if(kind!=='hollow'||!RST_EVENTS[event])return null;
 const v=take%2,own=(part)=>['approved','ca_orderly_a_'+part+v],death=['monster','mv_orderly_death'+v];
 // Each tuple is [bank, cue, delay, playback rate, relative level, seconds,
 // lowpass Hz, highpass Hz, additional source offset]. These are the approved
 // Hollow performances, including the low chest layer, without changing PCM.
 const layer=(source,delay,rate,level,seconds,lp=12000,hp=35,offset=0)=>[...source,delay,rate,level,seconds,lp,hp,offset];
 const growl=own('attack'),inhale=own('idle'),breath=['fx','breath'+v];
 if(event==='breathe')return {duration:1.42,layers:[layer(inhale,0,.72,.51,1.36,6400,100),layer(breath,.04,.81,.33,1.15,7500,450),layer(growl,.32,.57,.25,1.02,840,40,.10)]};
 if(event==='awake')return {duration:1.78,layers:[layer(breath,0,.81,.37,.58,7300,360),layer(growl,.20,.80,.9,1.47,11000,75,.04),layer(growl,.23,.51,.5,1.48,1500,35,.09)]};
 if(event==='charge')return {duration:1.62,layers:[layer(growl,0,.88,1.06,1.52,12800,70,.075),layer(growl,.035,.54,.58,1.47,1750,32,.13),layer(breath,0,1.13,.2,.24,8500,620)]};
 if(event==='windup')return {duration:.49,layers:[layer(growl,0,.83,.97,.46,12500,100,.36),layer(inhale,0,.64,.45,.43,4300,120,.10)]};
 if(event==='attack')return {duration:.98,layers:[layer(growl,0,.92,1.2,.93,13800,75,.25),layer(growl,.019,.54,.59,.90,1700,30,.19),layer(['fx','gore'+v],.022,.9,.22,.18,6200,650)]};
 if(event==='hit')return {duration:.56,layers:[layer(death,0,.89,.88,.52,10800,95,.10),layer(growl,.04,.69,.52,.45,9800,95,.43)]};
 return {duration:1.77,layers:[layer(death,0,.66,.85,1.65,8500,55),layer(growl,.09,.43,.30,1.52,1000,28,.20)]};
}
function rsThreatBake(kind,event,take=0){
 const a=RST_AUDIO,c=audio.ctx,recipe=rsThreatRecipe(kind,event,take);if(!c||!recipe)return null;const rate=24000,buffer=c.createBuffer(1,Math.ceil(recipe.duration*rate),rate),out=buffer.getChannelData(0);
 let contributed=false;
 for(const [bank,key,delay,pitch,level,seconds,lp,hp,offset]of recipe.layers){
  const source=rsThreatSource(bank,key);if(!source)continue;contributed=true;
  const begin=Math.floor(delay*rate),length=Math.min(out.length-begin,Math.ceil(seconds*rate)),values=new Float32Array(length),lowA=1-Math.exp(-2*Math.PI*Math.min(lp,rate*.44)/rate),dcA=1-Math.exp(-2*Math.PI*hp/rate);let low=0,dc=0,energy=0;
  for(let i=0;i<length;i++){
   const at=source.start+((offset||0)+i/rate*pitch)*source.rate,index=Math.floor(at),fraction=at-index;
   const sample=index>=source.start&&index+1<source.end?source.data[index]*(1-fraction)+source.data[index+1]*fraction:0;
   low+=(sample-low)*lowA;dc+=(low-dc)*dcA;const filtered=low-dc;
   const t=i/rate,fadeIn=Math.min(1,t/(event==='breathe'?.028:.008)),fadeOut=Math.min(1,(length-1-i)/rate/.065);
   const shaped=filtered*fadeIn*fadeIn*fadeOut*(1-.13*Math.sin(t*Math.PI*2*29)**2);
   values[i]=shaped;energy+=shaped*shaped;
  }
  const scale=level*Math.min(5,.16/Math.max(.032,Math.sqrt(energy/Math.max(1,length))));for(let i=0;i<length;i++)out[begin+i]+=values[i]*scale;
 }
 if(!contributed)return null;
 // Soft saturation adds a rough vocal edge without clicks or clipped peaks.
 const target=event==='breathe'?.48:.85;let peak=0;
 for(let i=0;i<out.length;i++){out[i]=Math.tanh(out[i]*1.45)*.75;peak=Math.max(peak,Math.abs(out[i]));}
 const limit=peak>target?target/peak:1;for(let i=0;i<out.length;i++)out[i]*=limit;out[0]=out[out.length-1]=0;return buffer;
}
function rsThreatAudioWarm(){
 const a=RST_AUDIO;if(!audio.ctx||!audio.approvedBank?.getChannelData||!audio.bank?.getChannelData||!audio.monsterBank?.getChannelData)return false;
 if(a.ctx===audio.ctx&&a.approved===audio.approvedBank&&a.fx===audio.bank&&a.monster===audio.monsterBank&&a.buffers.size===14)return true;
 rsThreatAudioStop();a.ctx=audio.ctx;a.approved=audio.approvedBank;a.fx=audio.bank;a.monster=audio.monsterBank;a.sources.clear();a.buffers.clear();
 for(const event of Object.keys(RST_EVENTS))for(let take=0;take<2;take++){const b=rsThreatBake('hollow',event,take);if(b)a.buffers.set('hollow:'+event+':'+take,b);}
 return a.buffers.size===14;
}
function rsThreatAudioFinish(v){
 if(!v||v.ended)return;rsAudioEndVoice(v);RST_AUDIO.voices.delete(v);RST_AUDIO.tails.delete(v);
}
function rsThreatAudioRetire(v){
 if(!v||v.ended)return;const a=RST_AUDIO,t=RS_AUDIO.ctx?.currentTime||0;
 // Eighteen milliseconds let the previous throat settle without a hard-cut
 // click. At most two tiny tails coexist with the one active performance.
 if(a.tails.size>=2){const old=[...a.tails][0];try{old.source.stop();}catch{}rsThreatAudioFinish(old);}
 v.retiring=true;v.until=t+.018;rsAudioParam(v.level.gain,0,t,.003);rsAudioParam(v.send.gain,0,t,.003);a.voices.delete(v);a.tails.add(v);try{v.source.stop(v.until);}catch{rsThreatAudioFinish(v);}
}
function rsThreatAudioStop(id){
 for(const v of [...RST_AUDIO.voices,...RST_AUDIO.tails])if(id===undefined||v.ownerId===id){try{v.source.stop();}catch{}rsThreatAudioFinish(v);}
 if(id===undefined){RST_AUDIO.owners.clear();RST_AUDIO.group.clear();}else RST_AUDIO.owners.delete(id);
}
function rsThreatPosition(e){
 const local=[-.035,e.phase==='windup'?.50:e.phase==='charge'?.44:.24,e.phase==='windup'?.60:e.phase==='charge'?.61:.63];
 // Match the articulated model's local mouth, including scale and rotation.
 // The fallback also supports isolated audio tests.
 let point;if(typeof rscBasis==='function'&&typeof rscPoint==='function')point=rscPoint(local,e,rscBasis(e));
 else{const up=e.normal||{x:0,y:0,z:1},f=e.forward||{x:0,y:1,z:0},dot=f.x*up.x+f.y*up.y+f.z*up.z,raw={x:f.x-up.x*dot,y:f.y-up.y*dot,z:f.z-up.z*dot},length=Math.hypot(raw.x,raw.y,raw.z)||1,forward={x:raw.x/length,y:raw.y/length,z:raw.z/length},right={x:forward.y*up.z-forward.z*up.y,y:forward.z*up.x-forward.x*up.z,z:forward.x*up.y-forward.y*up.x},scale=e.scale||1;point=['x','y','z'].map(k=>e[k]+scale*(right[k]*local[0]+forward[k]*local[1]+up[k]*local[2]));}
 return {x:point[0],y:point[1],z:point[2],room:e.roomId};
}
function rsThreatVoiceUpdate(e){
 if(!e)return;const a=RST_AUDIO,c=RS_AUDIO.ctx;if(!c)return;
 // No owner voice means no spatial/occlusion calculation. Active owners are
 // updated once by rsThreatAudioUpdate; a new event initializes itself below.
 let active=false;for(const v of a.voices){if(v.ended||c.currentTime>=v.until){rsThreatAudioFinish(v);continue;}if(v.ownerId===e.id)active=true;}if(!active)return;
 const pos=rsThreatPosition(e),location=rsAudioPosition(pos,RS_AUDIO.room),distance=Math.hypot(pos.x-player.x,pos.y-player.y,pos.z-(RS.active?.z||0)-(typeof RS_EYE==='number'?RS_EYE:1.55));
 for(const v of a.voices){
  if(v.ended||c.currentTime>=v.until){rsThreatAudioFinish(v);continue;}if(v.ownerId!==e.id)continue;
  if(distance>65||location.gain<.001){try{v.source.stop();}catch{}rsThreatAudioFinish(v);continue;}
  v.pos=pos;v.distance=distance;rsAudioParam(v.level.gain,v.baseGain*location.gain,c.currentTime,.035);rsAudioParam(v.filter.frequency,Math.min(v.tone,location.tone),c.currentTime,.045);
  if(v.hrtf){const dx=pos.x-player.x,dy=pos.y-player.y,dz=pos.z-(RS.active?.z||0)-(typeof RS_EYE==='number'?RS_EYE:1.55),x=dy*Math.cos(player.a)-dx*Math.sin(player.a),z=-(dx*Math.cos(player.a)+dy*Math.sin(player.a));
   if(v.panner.positionX){rsAudioParam(v.panner.positionX,x,c.currentTime,.025);rsAudioParam(v.panner.positionY,dz,c.currentTime,.025);rsAudioParam(v.panner.positionZ,z,c.currentTime,.025);}else v.panner.setPosition?.(x,dz,z);
  }else if(v.panner)rsAudioParam(v.panner.pan,location.pan,c.currentTime,.025);
 }
}
function rsThreatVoice(e,event='breathe'){
 const a=RST_AUDIO,room=RS_AUDIO,c=room.ctx,spec=RST_EVENTS[event];
 if(!e||e.kind!=='hollow'||!spec||!room.enabled||room.domain!=='restrooms'||!c||!audio.active||(typeof mode!=='undefined'&&mode!=='playing'))return null;
 const t=c.currentTime,pos=rsThreatPosition(e),p=rsAudioPosition(pos,room.room),distance=Math.hypot(pos.x-player.x,pos.y-player.y,pos.z-(RS.active?.z||0));
 if(distance>65||p.gain<.008){a.stats.culled++;return null;}
 let memory=a.owners.get(e.id);if(!memory){memory={times:{},takes:{}};a.owners.set(e.id,memory);}
 if(t-(memory.times[event]??-Infinity)<spec.gap||t-(a.group.get(event)??-Infinity)<spec.group){a.stats.culled++;return null;}
 for(const v of [...a.voices])if(v.ended||v.until<=t)rsThreatAudioFinish(v);
 const live=[...a.voices].filter(v=>!v.ended),same=live.filter(v=>v.ownerId===e.id);
 // A breath cannot replace a charge. Damage must react immediately,
 // while a shotgun's pellets may schedule only one cry per 180 ms.
 if(same.some(v=>v.priority>spec.priority)&&!['hit','death'].includes(event)){a.stats.culled++;return null;}
 const take=(memory.takes[event]||0)%2,buffer=a.buffers.get(e.kind+':'+event+':'+take);
 if(!buffer){a.stats.culled++;return null;}
 const other=live.filter(v=>v.ownerId!==e.id),cap=1;
 if(other.length>=cap){const candidate=other.filter(v=>v.priority<spec.priority||v.priority===spec.priority&&v.distance>distance+1).sort((x,y)=>x.priority-y.priority||y.distance-x.distance)[0];if(!candidate){a.stats.culled++;return null;}rsThreatAudioRetire(candidate);}
 // Reserve room in the shared 24-source graph for water, weapons and drips.
 if(room.voices.size>=22&&same.length===0){a.stats.culled++;return null;}
 for(const v of same)rsThreatAudioRetire(v);
 const source=c.createBufferSource(),filter=c.createBiquadFilter(),level=c.createGain(),send=c.createGain(),baseGain=spec.gain;
 source.buffer=buffer;source.playbackRate.value=1;filter.type='lowpass';filter.Q.value=.5;filter.frequency.value=Math.min(spec.tone,p.tone);level.gain.value=baseGain*p.gain;send.gain.value=spec.wet;
 source.connect(filter).connect(level);const nodes=[source,filter,level,send];let panner=null,hrtf=false;
 if(c.createPanner){panner=c.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=85;hrtf=true;level.connect(panner).connect(room.out);nodes.push(panner);}
 else if(c.createStereoPanner){panner=c.createStereoPanner();panner.pan.value=p.pan;level.connect(panner).connect(room.out);nodes.push(panner);}else level.connect(room.out);
 level.connect(send).connect(room.verb);
 const v={ownerId:e.id,owner:e,event,priority:spec.priority,source,filter,level,send,panner,hrtf,nodes,pos,distance,baseGain,tone:spec.tone,loop:false,kind:'creature-voice',ended:false,until:t+buffer.duration+.04};
 source.onended=()=>rsThreatAudioFinish(v);a.voices.add(v);room.voices.add(v);source.start(t);rsThreatVoiceUpdate(e);
 memory.times[event]=t;memory.takes[event]=take+1;a.group.set(event,t);a.stats.played++;a.stats.peakVoices=Math.max(a.stats.peakVoices,a.voices.size);return v;
}
function rsThreatAudioUpdate(dt){
 if(!RS_AUDIO.enabled||RS_AUDIO.domain!=='restrooms'){if(RST_AUDIO.voices.size||RST_AUDIO.tails.size||RST_AUDIO.owners.size||RST_AUDIO.group.size)rsThreatAudioStop();return;}
 if(!audio.active)return;
 for(const v of [...RST_AUDIO.tails])if(v.ended||v.until<=RS_AUDIO.ctx.currentTime)rsThreatAudioFinish(v);
 const visited=new Set();for(const v of [...RST_AUDIO.voices]){if(v.ended){RST_AUDIO.voices.delete(v);continue;}if(!visited.has(v.ownerId)){visited.add(v.ownerId);rsThreatVoiceUpdate(v.owner);}}
}
// Warm during the existing load gate, before play. No PCM is generated in an
// encounter frame, footstep or damage callback.
const rsThreatPrepare=audio.prepare;
audio.prepare=function(...args){return rsThreatPrepare.apply(this,args).then(ok=>{if(ok)rsThreatAudioWarm();return ok;});};
const rsThreatReset=audio.reset;
audio.reset=function(...args){rsThreatAudioStop();return rsThreatReset.apply(this,args);};
