// Close, frail and breathy. A local injured voice, not another music bed.
audio.seraphimBake=function(){
 if(!this.ctx||this.s4tBuffers)return;
 const rate=this.ctx.sampleRate,buffers={};
 for(const [kind,seconds]of [['breath',2.6],['water',1.5],['feather',.42]]){
  const b=this.ctx.createBuffer(1,Math.floor(rate*seconds),rate),d=b.getChannelData(0);let seed=93173,low=0,mid=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate,u=t/seconds;
   low=.986*low+.014*n;mid=.78*mid+.22*n;
   if(kind==='breath'){
    const env=Math.sin(Math.PI*u)**2*(.55+.45*Math.sin(Math.PI*u)),trem=.85+.15*Math.sin(TAU*5.1*t);
    const fundamental=183*t-11*t*t/seconds;
    d[i]=((mid-low)*.055+Math.sin(TAU*fundamental+Math.sin(t*7)*.11)*.043+Math.sin(TAU*fundamental*2.006)*.025+Math.sin(TAU*fundamental*3.01)*.009)*env*trem;
   }else if(kind==='water'){
    const splash=(mid*.6+low*4)*Math.exp(-t*7)*Math.min(1,t*60),bubble=Math.sin(TAU*(150*t+55*(1-Math.exp(-t*3))))*Math.exp(-t*4)*.045;
    d[i]=(splash+bubble)*Math.min(1,(1-u)*12);
   }else d[i]=(n-mid)*.07*Math.sin(Math.PI*u)**2*(.5+.5*Math.sin(t*TAU*13)**2);
  }
  buffers[kind]=b;
 }
 this.s4tBuffers=buffers;
};
audio.seraphimSound=function(kind,vol=1){
 if(!this.ctx||!this.active)return;this.seraphimBake();
 const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),pan=this.ctx.createStereoPanner(),send=this.ctx.createGain();
 source.buffer=this.s4tBuffers[kind];gain.gain.value=vol;send.gain.value=kind==='breath'?.14:.055;
 source.connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const v={source,gain,pan,send,vol,follow:kind==='breath',pos:{x:S4T.x,y:S4T.y}};
 this.s4tVoices=this.s4tVoices||[];this.s4tVoices.push(v);
 source.onended=()=>{for(const a of[source,gain,pan,send])try{a.disconnect();}catch{}this.s4tVoices=(this.s4tVoices||[]).filter(a=>a!==v);};
 source.start(this.ctx.currentTime);this.seraphimPosition(v);return v;
};
audio.seraphimPosition=function(v){
 const pos=v.follow?s4tLightPosition():v.pos,dx=pos.x-player.x,dy=pos.y-player.y,d=Math.hypot(dx,dy),t=this.ctx.currentTime;
 const clear=d<.3||s4CastRay(player.x,player.y,dx/(d||1),dy/(d||1),d).d>=d-.2;
 v.gain.gain.setTargetAtTime(v.vol/(1+d*.32)*(clear?1:.15),t,.06);
 v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.85,.85),t,.06);
};
audio.seraphimCue=function(kind){
 if(!this.active)return;
 if(kind==='water')this.seraphimSound('water',1.4);
 else if(kind==='lift'){this.seraphimSound('feather',1.1);this.seraphimSound('breath',1.1);S4T.voiceAt=S4T.clock+6.5;}
 else if(kind==='throw')this.seraphimSound('feather',1.4);
 else if(kind==='land'){this.play('bodyfall',{vol:.12,rate:1.45,pos:S4T,wet:.04});this.seraphimSound('feather',.8);S4T.voiceAt=S4T.clock+.65;}
 else if(kind==='return'){this.seraphimSound('feather',.7);S4T.voiceAt=S4T.clock+.8;}
};
audio.seraphimTick=function(){
 if(!s4tRunning()||!this.ctx||!this.active||mode!=='playing')return;
 for(const v of this.s4tVoices||[])this.seraphimPosition(v);
 if(S4T.clock>=S4T.voiceAt){
  S4T.voiceAt=S4T.clock+6.5;
  if(S4T.phase!=='water'&&Math.hypot(S4T.x-player.x,S4T.y-player.y)<14)this.seraphimSound('breath',s4tCarried()?1.15:.95);
 }
};
audio.seraphimStop=function(){for(const v of this.s4tVoices||[])try{v.source.stop();}catch{}this.s4tVoices=[];};
const s4tAudioReset=audio.reset.bind(audio);
audio.reset=function(){this.seraphimStop();s4tAudioReset();};

