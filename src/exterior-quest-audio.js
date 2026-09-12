// Local branch sounds, not a second global ambience or a replacement score.
audio.questBake=function(){
 if(!this.ctx||this.s4qBuffers)return;
 const rate=this.ctx.sampleRate,make=kind=>{
  const seconds=kind==='hiss'?4:6,b=this.ctx.createBuffer(1,rate*seconds,rate),d=b.getChannelData(0);let seed=4817,low=0,mid=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.998+n*.002;mid=mid*.85+n*.15;
   if(kind==='hiss')d[i]=Math.tanh((mid*.7+(n-mid)*.2+low*.5)*1.4)*(.84+.08*Math.sin(t*TAU*7));
   else if(kind==='hum')d[i]=Math.sin(t*TAU*60)*.065+Math.sin(t*TAU*120)*.025+(n-mid)*.003;
   else{const pulse=Math.pow(Math.max(0,Math.sin(t*TAU*.5)),4);d[i]=(Math.sin(TAU*415*t+2*Math.sin(TAU*2*t))*.15+Math.sin(TAU*207.5*t)*.07)*pulse;}
  }
  const seam=Math.round(rate*.02);for(let i=0;i<seam;i++){const u=i/seam;d[d.length-seam+i]=d[d.length-seam+i]*(1-u)+d[i]*u;}return b;
 };
 this.s4qBuffers={hiss:make('hiss'),hum:make('hum'),alarm:make('alarm')};
};
audio.questLoop=function(kind,pos){
 this.questBake();const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.s4qBuffers[kind];source.loop=true;gain.gain.value=0;filter.type='lowpass';filter.frequency.value=6000;send.gain.value=kind==='hum'?.16:.065;
 source.connect(filter).connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const v={source,gain,pan,filter,send,kind,pos};source.onended=()=>{for(const n of[source,gain,pan,filter,send])try{n.disconnect();}catch{}};source.start(a.currentTime);return v;
};
audio.questAction=function(kind){
 if(!this.ctx||!this.active)return;
 this.departureScoreStop();
 if(kind==='extinguish'){
  if(!this.s4qHiss)this.s4qHiss=this.questLoop('hiss',{x:player.x,y:player.y});
  this.play('shell',{vol:.37,rate:1.2,wet:.035});this.play('effort0',{vol:.26,wet:.05});
 }else{
  if(!this.s4dEngine)this.s4dEngine=this.departureLoop('engine');
  this.play('machinery',{vol:.45,rate:.8,pos:S4D.vehicle,wet:.1});this.play('environment0',{vol:.36,rate:.9,pos:S4D.vehicle,wet:.08});
 }
};
audio.questFireOut=function(){
 for(const key of['s4qHiss','s4dFire']){const v=this[key];if(v)try{v.source.stop();}catch{}this[key]=null;}
};
audio.questVehicleStop=function(){
 if(this.s4dEngine)try{this.s4dEngine.source.stop();}catch{}this.s4dEngine=null;
 if(this.active)this.play('environment1',{vol:.32,rate:.85,pos:S4D.vehicle,wet:.06});
};
audio.questTick=function(){
 if(!s4qRunning()||!this.ctx||!this.active||mode!=='playing')return;
 const t=this.ctx.currentTime;
 this.s4qNodes=this.s4qNodes||[];
 if(!this.s4qNodes.length){this.s4qNodes.push(this.questLoop('alarm',{x:97,y:80}),this.questLoop('hum',{x:135,y:5.8}));this.s4qNext=5;}
 for(const v of this.s4qNodes){
  const dx=v.pos.x-player.x,dy=v.pos.y-player.y,d=Math.hypot(dx,dy),blocked=d<27&&!lineOfSight(player.x,player.y,v.pos.x,v.pos.y);
  const base=v.kind==='alarm'?(S4Q.keys?.035:.46):.52;
  v.gain.gain.setTargetAtTime(d>27?0:base/(1+d*.25)*(blocked?.22:1),t,.25);
  v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.9,.9),t,.12);
  v.filter.frequency.setTargetAtTime(blocked?800:v.kind==='hum'?2100:3500,t,.16);
 }
 if(this.s4qHiss){this.s4qHiss.gain.gain.setTargetAtTime(S4Q.action?.kind==='extinguish'&&S4D.t>.75?.78:0,t,.035);this.s4qHiss.pan.pan.setTargetAtTime(.2,t,.06);}
 if(S4Q.clock>=this.s4qNext){
  this.s4qNext=S4Q.clock+9+(Math.floor(S4Q.clock)%7);
  if(S4.zone==='PARKING LOT'&&!S4Q.parkClear)this.play('shell',{vol:.32,rate:.62,pos:{x:93,y:71},wet:.22});
  if(S4.zone==='BUS STATION'&&!S4Q.busClear)this.play('environment2',{vol:.24,rate:.72,pos:{x:135,y:5.8},wet:.16});
 }
};
audio.questStop=function(){
 for(const v of[...(this.s4qNodes||[]),this.s4qHiss])if(v)try{v.source.stop();}catch{}
 this.s4qNodes=[];this.s4qHiss=null;this.s4qNext=5;
};
const s4qPreviousTick=audio.tick.bind(audio),s4qPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt){s4qPreviousTick(dt);this.questTick();};
audio.reset=function(){this.questStop();s4qPreviousReset();};

