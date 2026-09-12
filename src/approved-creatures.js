// Only the owner's approved breathing/attack performances enter the campaign.
// Original MP3 bank/cue offsets are retained; no rebake or runtime pitch shift.
const APPROVED_CREATURES={orderly:'a',runner:'b'};
const AC_TAKES=new Map();
const acPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedReady)return this.approvedReady;
 const base=acPrepare();if(!this.ctx)return base;
 this.approvedReady=base.then(async ok=>{
  if(!ok)return false;
  this.approvedBank=await loadAudioAsset(CREATURE_AUDITION_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedReady=null;throw error;});
 return this.approvedReady;
};
audio.approvedCreatureSound=function(species,event,{pos,follow,owner,priority,vol,wet}){
 if(!this.ctx||!this.approvedBank||!APPROVED_CREATURES[species]||!['idle','attack'].includes(event))return null;
 const a=this.ctx,t=a.currentTime,d=Math.hypot(pos.x-player.x,pos.y-player.y);
 if(d>(event==='idle'?10:16)){MV.culled++;return null;}
 this.monsterSweep(t);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const same=live.filter(v=>v.owner===owner);
 if(same.some(v=>v.priority>priority)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==owner);
 let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const bag=species+'_'+event,take=AC_TAKES.get(bag)||0;
 const key='ca_'+species+'_'+APPROVED_CREATURES[species]+'_'+event+take,cue=CREATURE_AUDITION_CUES[key];
 if(!cue||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,t,.012);try{v.source.stop(t+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,key,species,event,priority,owner,distance:d,tone:10500,cb:false,source,gain,filter,send,panner,nodes,vol,wet,pos:{...pos},follow,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);AC_TAKES.set(bag,1-take);MV.played++;return v;
};
const acCreature=audio.creature.bind(audio);
audio.creature=function(e,attack=false){
 if(!e||![1,2].includes(e.type)||liminal.mode==='mirror')return acCreature(e,attack);
 if(!this.active||!this.ctx)return;
 const t=this.ctx.currentTime,event=attack?'attack':'idle',urgent=attack&&e.windup>0;
 let memory=MV.owners.get(e);if(!memory){memory={idle:-Infinity,attack:-Infinity};MV.owners.set(e,memory);}
 const gap=attack?(urgent?.27:.85):8.5;
 if(t-memory[event]<gap||(!attack&&t<MV.idleAt)){MV.culled++;return;}
 const v=this.approvedCreatureSound(e.type===2?'orderly':'runner',event,{pos:e,follow:e,owner:e,priority:urgent?4:attack?2:0,vol:attack?1:.72,wet:attack?.16:.20});
 if(v){memory[event]=t;if(!attack)MV.idleAt=t+rand(2.3,3.8);}
 return v;
};
// Shared reset/death/spatial lifecycle handles approved voices because they
// participate in the existing mv pool. Deaths and scripted boss cues stay pending.
const acReset=audio.reset.bind(audio);
audio.reset=function(){acReset();AC_TAKES.clear();};

