// The original recordings retain the voice's mass. Each throat has its own
// register, timing and physical origin, through the existing HRTF/room mix.
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const t=this.ctx.currentTime,m=pos||CB,play=(key,vol,rate,wet=.13,delay=0)=>{
  const bite=kind==='yap'?this.ctx.createGain():null;
  if(bite){bite.connect(this.sfx);bite.gain.setValueAtTime(1,t+delay);bite.gain.setTargetAtTime(.001,t+delay+.085,.017);}
  const v=this.play(key,{vol:vol*strength,rate,wet,pos:m,at:t+delay,bus:bite});
  if(v){
   v.cb=true;v.filter.frequency.setTargetAtTime(kind==='chew'?2700:6500,t,.015);
   if(bite){const ended=v.source.onended;v.source.onended=()=>{ended();bite.disconnect();};v.until=t+delay+.18;v.source.stop(t+delay+.18);}
  }else bite?.disconnect();
 };
 if(kind==='wake'){
  play('roar0',1.7,.62,.24);play('brute1',1.05,.76,.16,.16);play('bodyfall',.5,.57,.16,.12);
 }else if(kind==='snarl'){play('patient2',1.1,.66,.12);play('roar1',.5,.95,.17);}
 else if(kind==='spit'){play('bodyhit1',.68,.77,.1);play('flesh1',.56,.7,.13);}
 else if(kind==='charge'){play('brute0',1.0,.54,.18);play('machinery',.44,1.31,.08);}
 else if(kind==='hit'){play('gore1',.78,.8,.09);if(strength>.8)play('brute2',.56,.69,.17);}
 else if(kind==='step'){play('bodyfall',.45,.51,.09);play('step2',.48,.61,.1);}
 else if(kind==='chew'){play('flesh0',.23,1.32,.025);play('breath2',.16,1.44,.06);}
 else if(kind==='breath'){play('brute2',.8,.49,.13);}
 else if(kind==='snap'){play('flesh1',.8,.72,.08);play('patient1',.55,1.62,.1);}
 else if(kind==='yap'){play('brute1',.72,1.85+(CB.shots%3)*.11,.08);play('bodyhit0',.28,1.3,.04);}
 else if(kind==='want'){play('patient2',.56,1.73,.1);play('brute0',.43,.58,.14,.12);}
 else if(kind==='stagger'){play('roar1',1.05,.67,.16);play('bodyfall',.7,.59,.07);}
 else if(kind==='fetch'){play('patient2',.8,1.85,.1);play('brute0',1.0,.55,.17,.16);}
 else if(kind==='plunge'){play('bodyfall',1.5,.42,.17);play('brute2',1.1,.63,.12,.1);}
 else if(kind==='submerge'){play('brute0',.9,.4,.07);}
 else if(kind==='gate'){play('machinery',.62,.61,.16);play('bodyhit1',.6,.46,.15,1.55);}
};
audio.cerberusBake=function(){
 if(!this.ctx||this.cbBeamBuffer)return;
 // Layered air tear, detuned electrical grit and sub pressure. The attack's
 // initial crack stays separate from its sustained body and travels spatially.
 const rate=this.ctx.sampleRate,b=this.ctx.createBuffer(2,Math.round(rate*1.5),rate);
 for(let ch=0;ch<2;ch++){
  const data=b.getChannelData(ch);let seed=77021+ch*743,low=0,mid=0;
  for(let i=0;i<data.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.994+n*.006;mid=mid*.72+n*.28;
   const gate=.7+.3*Math.sin(t*TAU*43+ch*.4)**2,
    tear=Math.sin(TAU*(131*t+2.1*Math.sin(t*38))+mid*5)*.23,
    pressure=Math.sin(TAU*47*t+low*2)*.3,
    crack=n*Math.exp(-t*65)*.65,envelope=Math.min(1,t/.004,(1.5-t)/.06);
   data[i]=Math.tanh((low*5+mid*.82+tear+pressure+crack)*gate)*envelope*.7;
  }
 }this.cbBeamBuffer=b;
};
audio.cerberusCharge=function(){
 if(!this.ctx||!this.active)return;this.cerberusChargeStop();
 const a=this.ctx,rate=a.sampleRate;
 if(!this.cbChargeBuffer){
  const b=a.createBuffer(2,Math.ceil(rate*1.1),rate);
  for(let ch=0;ch<2;ch++){
   const data=b.getChannelData(ch);let seed=9191+ch*151,low=0,phase=0;
   for(let i=0;i<data.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate,u=t/1.1;
    low=low*.82+n*.18;phase+=TAU*(64+u*u*415)/rate;
    const teeth=Math.sin(phase+Math.sin(phase*1.497)*2.4),
     intake=(low*.75+n*.10)*(.4+.6*Math.sin(t*TAU*(9+u*16))**2),
     swell=Math.sin(Math.PI*clamp(u*1.01,0,1))*.32+u*.68;
    data[i]=Math.tanh(teeth*.25+intake+Math.sin(t*TAU*37)*.12)*swell*Math.min(1,t*35)*.7;
   }
  }this.cbChargeBuffer=b;
 }
 const source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner(),m=cbHead('bulldog'),d=Math.hypot(m.x-player.x,m.y-player.y);
 source.buffer=this.cbChargeBuffer;gain.gain.value=.9/(1+d*.065);
 pan.pan.value=clamp(((m.y-player.y)*Math.cos(player.a)-(m.x-player.x)*Math.sin(player.a))/(d||1),-.8,.8);
 source.connect(gain).connect(pan).connect(this.sfx);const v={source,gain,pan};this.cbCharge=v;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbCharge===v)this.cbCharge=null;};source.start(a.currentTime);
 this.cerberusCue('charge',m,.85);
};
audio.cerberusChargeStop=function(){
 const v=this.cbCharge;if(!v)return;this.cbCharge=null;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);
 v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
audio.cerberusBeam=function(beam){
 if(!this.ctx||!this.active)return;this.cerberusChargeStop();this.cerberusBeamStop();this.cerberusBake();
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner();
 source.buffer=this.cbBeamBuffer;gain.gain.value=.65;source.connect(gain).connect(pan).connect(this.sfx);
 const v={source,gain,pan,beam};this.cbBeam=v;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbBeam===v)this.cbBeam=null;};source.start(a.currentTime);
 const hit=this.play('blast1',{vol:.92,rate:.68,wet:.17,pos:cbHead('bulldog')});if(hit)hit.cb=true;const throat=this.play('brute2',{vol:.46,rate:.48,wet:.1,pos:cbHead('bulldog')});if(throat)throat.cb=true;
};
audio.cerberusBeamStop=function(){
 const v=this.cbBeam;if(!v)return;this.cbBeam=null;
 v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
audio.cerberusScoreStop=function(){
 const v=this.cbScore;if(v){this.cbScore=null;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}}
 if(this.ctx&&cbRunning()){this.music.gain.cancelScheduledValues(this.ctx.currentTime);this.music.gain.setValueAtTime(0,this.ctx.currentTime);}
};
audio.cerberusTick=function(){
 if(!this.ctx||!this.active||!cbRunning()||mode!=='playing')return;
 const t=this.ctx.currentTime,enabled=cbScoreWanted()&&settings.music>0;
 if(!enabled)this.cerberusScoreStop();
 else if(!this.cbScore&&this.cbScoreBuffer){
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.cbScoreBuffer;source.loop=true;gain.gain.value=.92;
  source.connect(gain).connect(this.musicTone);this.musicTone.frequency.setTargetAtTime(13200,t,.14);
  const voice={source,gain};this.cbScore=voice;source.onended=()=>{source.disconnect();gain.disconnect();if(this.cbScore===voice)this.cbScore=null;};
  source.start(t);
 }
 this.exteriorMix();
 if(this.cbWater){
  const v=this.cbWater,dx=v.pos.x-player.x,dy=v.pos.y-player.y,d=Math.hypot(dx,dy);
  v.gain.gain.setTargetAtTime(1.1/(1+d*.065),t,.06);
  v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.75,.75),t,.05);
 }
 if(this.cbBeam){
  const v=this.cbBeam,b=v.beam,l=clamp((player.x-b.x)*b.dx+(player.y-b.y)*b.dy,0,b.length),dx=b.x+b.dx*l-player.x,dy=b.y+b.dy*l-player.y,d=Math.hypot(dx,dy);
  v.gain.gain.setTargetAtTime(.74/(1+d*.11),t,.03);v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.9,.9),t,.04);
 }
};
audio.cerberusStop=function(){
 this.cerberusScoreStop();this.cerberusBeamStop();this.cerberusChargeStop();
 this.cerberusWaterStop();
 for(const v of [...this.voices])if(v.cb)try{v.source.stop();}catch{}
};
audio.cerberusWater=function(pos){
 if(!this.ctx||!this.active)return;this.cerberusWaterStop();
 const ctx=this.ctx,rate=ctx.sampleRate;
 if(!this.cbWaterBuffer){
  const b=ctx.createBuffer(2,Math.ceil(rate*4.3),rate);
  for(let ch=0;ch<2;ch++){
   const data=b.getChannelData(ch);let seed=53719+ch*571,low=0,mid=0;
   for(let i=0;i<data.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
    low=low*.993+n*.007;mid=mid*.86+n*.14;
    const impact=Math.exp(-t*2.6)*Math.min(1,t*45),struggle=Math.exp(-Math.max(0,t-.6)*.85)*(Math.sin(t*8+ch*.4)**8)*.34,
     air=Math.max(0,1-t/4.3),bubble=Math.sin(TAU*(83*t+24*Math.sin(t*2.8)))*Math.sin(t*17)**10*.09;
    data[i]=Math.tanh((low*8+mid*1.4)*(impact+struggle)+bubble*air)*Math.min(1,(4.3-t)*3)*.74;
   }
  }this.cbWaterBuffer=b;
 }
 const source=ctx.createBufferSource(),gain=ctx.createGain(),pan=ctx.createStereoPanner(),dx=pos.x-player.x,dy=pos.y-player.y,d=Math.hypot(dx,dy);
 source.buffer=this.cbWaterBuffer;gain.gain.value=1.1/(1+d*.065);
 pan.pan.value=clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.75,.75);
 source.connect(gain).connect(pan).connect(this.sfx);const voice={source,gain,pan,pos:{...pos}};this.cbWater=voice;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbWater===voice)this.cbWater=null;};source.start(ctx.currentTime);
};
audio.cerberusWaterStop=function(){
 const v=this.cbWater;if(!v)return;this.cbWater=null;
 v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
const cbPreviousTick=audio.tick.bind(audio),cbPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt){
 cbPreviousTick(dt);if(!cbRunning()||mode!=='playing')return;
 this.cerberusTick();
 if(CB.state!=='boundary'&&!CB.toyDropped&&CB.clock>=(this.cbChewAt||0)){this.cbChewAt=CB.clock+2.9;this.cerberusCue('chew',cbHead('chihuahua'));}
};
audio.reset=function(){this.cerberusStop();this.cbChewAt=0;cbPreviousReset();};
const cbPreviousEnd=audio.end.bind(audio);
audio.end=function(won){if(CB.on)this.cerberusStop();cbPreviousEnd(won);};

