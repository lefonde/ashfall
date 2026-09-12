// Owner approval: Heart B breathing and A attack, exact round-three takes.
// The living organ has one spatial voice, regardless of how many faces show.
const APPROVED_HEART={idle:'b',attack:'a'};
const AH={owner:{},takes:new Map(),next:0,breathT:7.5,context:null};
const ahPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedHeartReady)return this.approvedHeartReady;
 const base=ahPrepare();if(!this.ctx)return base;
 this.approvedHeartReady=base.then(async ok=>{
  if(!ok){this.approvedHeartReady=null;return false;}
  this.approvedHeartBank=await loadAudioAsset(CREATURE_ROUND3_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedHeartReady=null;throw error;});
 return this.approvedHeartReady;
};
audio.approvedHeartStop=function(reset=false){
 // Cancel dry output and new room sends immediately, including queued sources.
 // Existing shared room decay and the separately routed finale stay intact.
 const t=this.ctx?.currentTime||0;
 for(const v of [...this.voices])if(v.approvedHeart){
  v.retiring=true;v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(0,t);
  v.send.gain.cancelScheduledValues(t);v.send.gain.setValueAtTime(0,t);
  try{v.source.stop();}catch{}for(const n of v.nodes)try{n.disconnect();}catch{}
  v.ended=true;const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);
 }
 AH.next=0;AH.breathT=7.5;if(reset)AH.takes.clear();
};
audio.approvedHeartSound=function(event,{priority=event==='idle'?0:4,vol=event==='idle'?.8:1,wet=.16}={}){
 if(!this.ctx||!this.active||mode!=='playing'||!this.approvedHeartBank||!hbFighting()||!APPROVED_HEART[event])return null;
 const a=this.ctx,t=a.currentTime,p=hbSoundPoint(),d=Math.hypot(p.x-player.x,p.y-player.y);
 if(d>24){MV.culled++;return null;}
 this.monsterSweep(t);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring),same=live.filter(v=>v.owner===AH.owner);
 // Do not chop a selected performance into every beat, volley or visible face.
 // A telegraph can interrupt a breath; another attack waits for this throat.
 if(same.some(v=>v.event==='attack'||v.priority>priority)||(event==='attack'&&t<AH.next)){
  MV.culled++;return null;
 }
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==AH.owner);let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const take=AH.takes.get(event)||0,key='cr3_heart_'+APPROVED_HEART[event]+'_'+event+take,cue=CREATURE_ROUND3_CUES[key];
 if(!cue||!Number.isFinite(cue.start)||!Number.isFinite(cue.duration)||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedHeartBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,t,.012);try{v.source.stop(t+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedHeartBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,approvedHeart:true,key,species:'heart',event,priority,owner:AH.owner,distance:d,tone:10500,cb:false,source,gain,filter,send,panner,nodes,vol,wet,pos:{...p},follow:null,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);
 AH.takes.set(event,1-take);if(event==='attack'){AH.next=t+cue.duration+.35;AH.breathT=Math.max(AH.breathT,6.5);}
 MV.played++;return v;
};
const ahPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(v.approvedHeart&&hbFighting()){
  // The existing Heart anchor chooses the closest exposed surface. Retain
  // normal wall occlusion as the player moves between the organ's sides.
  v.pos=hbSoundPoint();v.distance=Math.hypot(v.pos.x-player.x,v.pos.y-player.y);
 }
 return ahPosition(v,t);
};
const ahPlay=audio.play.bind(audio);
audio.play=function(key,options={}){
 // A contextual call replaces only the living Heart's own old throat cue.
 // Death fallback, enemies and unrelated scripted roars are not approvals.
 if(AH.context&&/^(roar|scream)\d+$/.test(key)&&hbFighting())
  return this.approvedHeartSound('attack',{vol:AH.context==='start'?1.05:AH.context==='phase'?.95:.85});
 return ahPlay(key,options);
};
const ahStart=hbStart,ahPhase=hbUpdatePhase,ahBegin=hbBeginAttack;
hbStart=function(...args){
 const before=AH.context;AH.context='start';try{return ahStart(...args);}finally{AH.context=before;}
};
hbUpdatePhase=function(...args){
 const before=AH.context;AH.context='phase';try{return ahPhase(...args);}finally{AH.context=before;}
};
hbBeginAttack=function(...args){
 const before=AH.context;AH.context='attack';let started;
 try{started=ahBegin(...args);}finally{AH.context=before;}
 // The blood-well's physical swelling cue remains. Add the same chosen
 // attack articulation used by the fan; never repeat it on strike release.
 if(started&&HB.attack?.kind==='well')audio.approvedHeartSound('attack',{vol:.85});
 return started;
};
const ahTick=hbTick;
hbTick=function(dt){
 ahTick(dt);
 if(!hbFighting()||mode!=='playing'||!audio.active)return;
 AH.breathT=Math.max(0,AH.breathT-dt);
 if(AH.breathT<=0){
  // Deliberate spaces between breaths, independent of the 76–110 BPM pulse.
  // Missed incidental calls are discarded rather than queued behind combat.
  if(HB.introT===0&&!HB.attack)audio.approvedHeartSound('idle',{wet:.14});
  AH.breathT=AH.takes.get('idle')?8.5:7.5;
 }
};
const ahDie=hbDie,ahFinish=hbFinish,ahBossReset=hbReset,ahRestore=hbRestoreSnapshot,ahReset=audio.reset.bind(audio),ahAudioStart=audio.start.bind(audio);
hbDie=function(...args){if(hbFighting())audio.approvedHeartStop();return ahDie(...args);};
hbFinish=function(...args){audio.approvedHeartStop();return ahFinish(...args);};
hbReset=function(...args){audio.approvedHeartStop(true);return ahBossReset(...args);};
hbRestoreSnapshot=function(...args){audio.approvedHeartStop(true);return ahRestore(...args);};
audio.reset=function(){this.approvedHeartStop(true);return ahReset();};
audio.start=function(){
 // Weapon previews can resume the main context while a menu is open. They
 // must not also resume a suspended live-Heart voice from the paused fight.
 if(mode!=='playing')this.approvedHeartStop();return ahAudioStart();
};

