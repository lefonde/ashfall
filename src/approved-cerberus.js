// Approved 0.1.4 auditions: Shepherd A, Bulldog A, Chihuahua B, both events.
// Keep the original encoded bank, exact cue boundaries and audition pitch.
const APPROVED_CERBERUS={shepherd:'a',bulldog:'a',chihuahua:'b'};
const ACB={takes:new Map(),heads:{shepherd:{},bulldog:{},chihuahua:{}},next:new Map(),beamDepth:0,breath:0};
const acbPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedCerberusReady)return this.approvedCerberusReady;
 const base=acbPrepare();if(!this.ctx)return base;
 this.approvedCerberusReady=base.then(async ok=>{
  if(!ok){this.approvedCerberusReady=null;return false;}
  this.approvedCerberusBank=await loadAudioAsset(CREATURE_ROUND2_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedCerberusReady=null;throw error;});
 return this.approvedCerberusReady;
};
audio.approvedCerberusSound=function(species,event,{pos=null,priority=4,vol=1,wet=.13,at=0}={}){
 if(!this.active||!this.ctx||!this.approvedCerberusBank||!cbRunning()||!APPROVED_CERBERUS[species]||!['idle','attack'].includes(event))return null;
 const a=this.ctx,now=a.currentTime,t=Math.max(now,at),p=pos||cbHead(species),owner=ACB.heads[species],d=Math.hypot(p.x-player.x,p.y-player.y);
 if(d>24){MV.culled++;return null;}
 this.monsterSweep(now);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring),same=live.filter(v=>v.owner===owner),memory=ACB.next.get(species);
 // Projectile volleys call yap every .19s. A whole recorded performance is
 // one voice, not a new throat per projectile. An attack may interrupt breath.
 if(same.some(v=>v.event==='attack'||v.priority>priority)||(memory?.event===event&&t<memory.until)){
  MV.culled++;return null;
 }
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==owner);let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const bag=species+'_'+event,take=ACB.takes.get(bag)||0,key='cr_'+species+'_'+APPROVED_CERBERUS[species]+'_'+event+take,cue=CREATURE_ROUND2_CUES[key];
 if(!cue||!Number.isFinite(cue.start)||!Number.isFinite(cue.duration)||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedCerberusBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,now,.012);try{v.source.stop(now+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedCerberusBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,approvedCerberus:true,key,species,event,priority,owner,distance:d,tone:10500,cb:true,source,gain,filter,send,panner,nodes,vol,wet,pos:{...p},follow:null,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);
 ACB.takes.set(bag,1-take);ACB.next.set(species,{event,until:t+cue.duration+(event==='idle'?4:species==='chihuahua'?.28:.35)});MV.played++;return v;
};
const acbPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(v.approvedCerberus&&cbRunning()){
  // Retrieval moves the whole guardian. Follow the rendered muzzle, including
  // its final descent, rather than leaving its voice where a volley started.
  const p=cbHead(v.species);v.pos={...p,z:p.z-(CB.sink||0)};v.distance=Math.hypot(p.x-player.x,p.y-player.y);
 }
 return acbPosition(v,t);
};
const acbCue=audio.cerberusCue.bind(audio);
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const p=pos||CB,t=this.ctx.currentTime;
 const throat=(species,event,vol,delay=0)=>this.approvedCerberusSound(species,event,{pos:cbHead(species),priority:event==='idle'?0:kind==='yap'?2:4,vol:vol*strength,wet:.13,at:t+delay});
 if(kind==='wake'){
  throat('shepherd','attack',1.25);throat('bulldog','idle',.95,.23);
  mvPlay('bodyfall',{pos:p,vol:.5,rate:.57,wet:.16});
 }else if(kind==='snarl')return throat('shepherd','attack',1);
 else if(kind==='charge')return throat('bulldog','attack',.95);
 else if(kind==='breath'){
  // Share occasional resting breaths between the two adult throats; the
  // existing 5.8s encounter timer and global incidental-voice cap still apply.
  const species=ACB.breath%2?'shepherd':'bulldog',v=throat(species,'idle',.72);if(v)ACB.breath++;return v;
 }else if(kind==='snap'){
  mvPlay('flesh1',{pos:p,vol:.8,rate:.72,wet:.08});return throat('chihuahua','attack',.7);
 }else if(kind==='yap')return throat('chihuahua','attack',.8);
 else if(kind==='want')return throat('chihuahua','idle',.72);
 else if(kind==='fetch'){
  const v=throat('chihuahua','attack',.85);throat('bulldog','idle',.7,.18);return v;
 }else return acbCue(kind,pos,strength);
 // Chewing/impacts/steps, pending death performances, splash, machinery,
 // score and beam synthesis keep their exact parent implementation.
};
const acbPlay=audio.play.bind(audio),acbBeam=audio.cerberusBeam.bind(audio);
audio.play=function(key,options={}){
 // This is the one direct legacy throat call outside cerberusCue. Scope it
 // to beam emission so Heart and other scripted brute voices are untouched.
 if(ACB.beamDepth&&key==='brute2'&&cbRunning())return this.approvedCerberusSound('bulldog','attack',{...options,priority:4,vol:.65});
 return acbPlay(key,options);
};
audio.cerberusBeam=function(...args){ACB.beamDepth++;try{return acbBeam(...args);}finally{ACB.beamDepth--;}};
const acbStop=audio.cerberusStop.bind(audio);
audio.cerberusStop=function(){
 acbStop();ACB.next.clear();ACB.takes.clear();ACB.breath=0;
};

