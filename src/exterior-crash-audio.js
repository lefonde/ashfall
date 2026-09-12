// The approved recordings supply the score, impact body, metal, voices and guns.
// Original cached diesel/fire beds add continuous mass; all route through the
// existing effects/master mix and use the actual AudioContext sample rate.
audio.departureBake=function(){
 if(!this.ctx||this.s4dBuffers)return;
 const rate=this.ctx.sampleRate,make=(kind,seconds)=>{
  const b=this.ctx.createBuffer(1,Math.round(rate*seconds),rate),d=b.getChannelData(0);let seed=kind==='engine'?5191:9127,low=0,mid=0,crack=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.995+n*.005;mid=mid*.87+n*.13;
   if(kind==='engine'){
    const pulse=Math.pow(Math.max(0,Math.sin(TAU*48*t)),5),firing=.55+.45*pulse;
    d[i]=Math.tanh((Math.sin(TAU*48*t)*.22+Math.sin(TAU*96*t)*.1+Math.sin(TAU*144*t)*.05+mid*.65)*firing)*.6+low*.2;
   }else if(kind==='skid'){
    // Tyre scrub under an unstable, abrasive stick-slip squeal.
    const phase=TAU*930*t+.4*Math.sin(TAU*21*t)+.11*Math.sin(TAU*67*t);
    d[i]=(Math.sin(phase)*.14+Math.sin(phase*1.993)*.045+(n-mid)*.15)*(.82+.18*Math.sin(TAU*9*t));
   }else{
    if(n>.9992)crack=.18+Math.abs(mid)*2;crack*=Math.exp(-1/(rate*.006));
    const gust=.75+.16*Math.sin(TAU*t/3)+.09*Math.sin(TAU*t/2);
    d[i]=Math.tanh((low*5.5+mid*.44+(n-mid)*crack)*gust)*.56;
   }
  }
  // Crossfade only the seam, retaining the loop's continuous energy.
  const seam=Math.round(rate*.035);for(let i=0;i<seam;i++){const t=i/seam;d[d.length-seam+i]=d[d.length-seam+i]*(1-t)+d[i]*t;}
  return b;
 };
 this.s4dBuffers={engine:make('engine',3),fire:make('fire',6),skid:make('skid',2)};
};
audio.departureLoop=function(kind){
 if(!this.ctx)return null;this.departureBake();
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),pan=a.createStereoPanner(),send=a.createGain();
 source.buffer=this.s4dBuffers[kind];source.loop=true;filter.type='lowpass';filter.frequency.value=kind==='engine'?2100:5100;gain.gain.value=0;send.gain.value=.08;
 source.connect(filter).connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const voice={source,gain,filter,pan,send,kind};source.onended=()=>{for(const n of[source,gain,filter,pan,send])try{n.disconnect();}catch{}};
 source.start(a.currentTime);return voice;
};
audio.departureEngine=function(){
 if(!this.ctx||!this.active)return;
 if(!this.s4dEngine)this.s4dEngine=this.departureLoop('engine');
 if(!this.s4dSkid)this.s4dSkid=this.departureLoop('skid');
 // The machinery recording supplies a torn mechanical layer, below the engine.
 this.play('machinery',{vol:.36,rate:1.38,pos:{x:76,y:42},wet:.08});
};
audio.departureCrash=function(){
 if(!this.ctx||!this.active)return;
 if(this.s4dEngine){try{this.s4dEngine.source.stop();}catch{}this.s4dEngine=null;}
 if(this.s4dSkid){try{this.s4dSkid.source.stop();}catch{}this.s4dSkid=null;}
 if(!this.s4dFire)this.s4dFire=this.departureLoop('fire');
 const t=this.ctx.currentTime,pos={x:61.6,y:44.5};
 this.play('blast0',{vol:1.06,rate:.72,pos,wet:.31});
 this.play('environment0',{vol:.95,rate:.72,pos,wet:.27});
 this.play('environment1',{vol:.72,rate:.67,at:t+.09,pos,wet:.24});
 this.play('bodyfall',{vol:.75,rate:.57,at:t+.16,pos,wet:.15});
 for(const [delay,vol,rate]of [[.18,.35,.67],[.43,.28,.89],[.76,.2,1.18]])this.play('shell',{vol,rate,at:t+delay,pos,wet:.22});
 this.duck(.1,.75);
};
audio.departureScoreStop=function(){
 if(this.s4dScore){const v=this.s4dScore;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}this.s4dScore=null;}
 if(s4Running()&&this.ctx&&!cbScoreWanted()){this.music.gain.cancelScheduledValues(this.ctx.currentTime);this.music.gain.setValueAtTime(0,this.ctx.currentTime);}
};
audio.departureScore=function(){
 this.departureScoreStop();
};
audio.departureTick=function(){
 if(!s4Running()||!S4D.on||!this.ctx||!this.active||mode!=='playing')return;
 const t=this.ctx.currentTime,v=S4D.vehicle;
 this.departureScore();this.exteriorMix();
 if(v&&s4qFireAmount()>0&&!this.s4dFire)this.s4dFire=this.departureLoop('fire');
 for(const voice of [this.s4dEngine,this.s4dSkid,this.s4dFire]){
  if(!voice||!v)continue;
  const front=voice.kind==='fire'?-1.85:0;
  const dx=v.x+front*Math.cos(v.a)-player.x,dy=v.y+front*Math.sin(v.a)-player.y,d=Math.hypot(dx,dy),side=dy*Math.cos(player.a)-dx*Math.sin(player.a);
  const base=voice.kind==='engine'?(S4Q.action?.kind==='move'?.5:1.25):voice.kind==='skid'?.8*Math.sin(Math.PI*clamp((S4D.t/S4D_DURATIONS.approach-.12)/.88,0,1)):.72*s4qFireAmount();
  voice.gain.gain.setTargetAtTime(base/(1+d*(voice.kind==='engine'?.095:.22)),t,.04);
  voice.pan.pan.setTargetAtTime(clamp(side/(d+.1),-.9,.9),t,.03);
  voice.filter.frequency.setTargetAtTime((voice.kind==='engine'?3000:6200)/(1+d*.055),t,.05);
  if(voice.kind==='engine')voice.source.playbackRate.setTargetAtTime(S4Q.action?.kind==='move'?.8:1.2+.37*Math.sin(clamp(S4D.t/S4D_DURATIONS.approach,0,1)*Math.PI),t,.035);
 }
 // Keep the existing exertion and critical-health body cues in outdoor combat.
 if(!s4dLocked()&&player.hp<38&&t-this.lastHeart>(player.hp<20?.48:.64)){this.lastHeart=t;this.play('heartbeat',{vol:(1-player.hp/65)*.55,wet:0});}
 if(!s4dLocked()&&player.hp<45&&t-this.lastBreath>(player.hp<25?2.1:4.3)&&t>this.painUntil+.5){this.lastBreath=t;this.play(this.choose('breath',3),{vol:player.hp<25?.64:.32,wet:.06});}
};
audio.departureStop=function(){
 this.departureScoreStop();for(const key of['s4dEngine','s4dSkid','s4dFire']){const v=this[key];if(v)try{v.source.stop();}catch{}this[key]=null;}
};
const s4dPreviousAudioTick=audio.tick.bind(audio);
audio.tick=function(dt){s4dPreviousAudioTick(dt);this.departureTick();};
const s4dPreviousAudioReset=audio.reset.bind(audio);
audio.reset=function(){this.departureStop();s4dPreviousAudioReset();};
const s4dPreviousAudioEnd=audio.end.bind(audio);
audio.end=function(won){if(S4D.on)this.departureScoreStop();s4dPreviousAudioEnd(won);};
const s4dPreviousAudioStart=audio.start.bind(audio);
audio.start=function(){if(S4D.on&&mode!=='playing')this.departureScoreStop();s4dPreviousAudioStart();};

