// R03 presentation only. Health, attack clocks, summons and exits stay in R02.
// Three recorded arrangements share a 32-heartbeat phrase and seek to the
// simulation beat on retries. Pausing never advances encounter choreography.
audio.heartScoreStop=function(immediate=false){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 for(const v of this.hbScoreNodes||[]){
  v.gain.gain.cancelScheduledValues(now);v.gain.gain.setTargetAtTime(0,now,.045);
  try{v.source.stop(now+(immediate?0:.25));}catch{}
 }
 if(immediate)this.hbScoreNodes=[];
 this.hbScoreCurrent=null;
};
audio.heartPresentationReset=function(){
 this.heartScoreStop(true);
 if(this.hbDeathVoice){try{this.hbDeathVoice.source.stop();}catch{}this.hbDeathVoice=null;}
 this.hbDeathComplete=false;
};
// The regular ward score must have an exact zero, not an audible gain floor.
// Keep the boss arrangement's short drop and all separately routed death FX.
audio.heartSilenceMusic=function(){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 this.musicBed.gain.cancelScheduledValues(now);
 this.musicBed.gain.setValueAtTime(0,now);
 this.heartScoreStop();
};
audio.heartScoreFrame=function(beats=0){
 if(!this.ctx||!this.heartBuffer||!this.active||mode!=='playing'||!hbFighting())return;
 const now=this.ctx.currentTime;
 this.musicBed.gain.setTargetAtTime(0,now,.18);
 let current=this.hbScoreCurrent;
 const beat=Math.max(0,HB.beatCount-1+(HB.beatPhase-.1+1)%1);
 if(current){current.playedBeat+=(now-current.lastTime)*current.lastBpm/60;current.lastTime=now;current.lastBpm=HB.bpm;}
 // Phase changes join at a two-bar boundary; direct review entries start there.
 if(!current||((current.phase!==HB.phase||Math.abs(current.playedBeat-beat)>.14)&&beats>0&&(HB.beatCount-1)%4===0)){
  const cue=HEART_AUDIO_CUES['phase'+HB.phase],source=this.ctx.createBufferSource(),gain=this.ctx.createGain();
  source.buffer=this.heartBuffer;source.loop=true;source.loopStart=cue.start;source.loopEnd=cue.start+cue.duration;
  source.playbackRate.value=HB.bpm/cue.heart_bpm;
  gain.gain.value=0;source.connect(gain).connect(this.musicTone);
  const voice={source,gain,phase:HB.phase,bpm:cue.heart_bpm,playedBeat:beat,lastTime:now,lastBpm:HB.bpm};
  this.hbScoreNodes=this.hbScoreNodes||[];this.hbScoreNodes.push(voice);
  source.onended=()=>{source.disconnect();gain.disconnect();this.hbScoreNodes=this.hbScoreNodes.filter(v=>v!==voice);};
  source.start(now,cue.start+(beat%cue.beats)*60/cue.heart_bpm);
  gain.gain.setTargetAtTime(.88,now,.16);
  if(current){current.gain.gain.cancelScheduledValues(now);current.gain.gain.setTargetAtTime(0,now,.16);try{current.source.stop(now+.8);}catch{}}
  this.hbScoreCurrent=current=voice;
 }
 current.source.playbackRate.setTargetAtTime(HB.bpm/current.bpm,now,.025);
};
audio.heartDeathStart=function(){
 if(!this.ctx||!this.heartBuffer||!this.active||mode!=='playing'||HB.state!=='dying')return false;
 if(this.hbDeathVoice||this.hbDeathComplete)return true;
 const cue=HEART_AUDIO_CUES.death,elapsed=clamp(HB.deathT,0,cue.duration);
 if(elapsed>=cue.duration)return true;
 const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();
 source.buffer=this.heartBuffer;gain.gain.value=.92;source.connect(gain).connect(this.sfx);
 const voice={source,gain};this.hbDeathVoice=voice;
 source.onended=()=>{source.disconnect();gain.disconnect();if(this.hbDeathVoice===voice){this.hbDeathVoice=null;this.hbDeathComplete=true;}};
 source.start(this.ctx.currentTime,cue.start+elapsed,cue.duration-elapsed);
 return true;
};
audio.heartAftermath=function(){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 this.heartSilenceMusic();
 this.ambience.gain.setTargetAtTime(settings.sfx*.055,now,.5);
 this.roomReturn.gain.setTargetAtTime(.82,now,.5);
 this.roomTone.frequency.setTargetAtTime(4100,now,.5);
 if(this.room.buffer!==this.impLong)this.room.buffer=this.impLong;
};

function hbFinaleTick(){
 if(HB.state!=='dying')return;
 audio.heartDeathStart();
 // Falling tissue is punctuation, not another damaging attack or a second blast.
 if(!HB.settled&&HB.deathT>=2.22){
  HB.settled=true;
  for(const p of hbFaces()){
   const x=p.x-Math.sin(p.a)*.16,y=p.y+Math.cos(p.a)*.16;
   emit(x,y,.64,'#542638',settings.reduce?3:12,.45);
  }
 }
 if(!HB.drained&&HB.deathT>=4.1){
  HB.drained=true;feed('NO PULSE');
  if(audio.ctx){audio.ambience.gain.setTargetAtTime(settings.sfx*.055,audio.ctx.currentTime,.7);}
 }
}

