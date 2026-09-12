// A quiet exterior soundscape, separate from the approved indoor score and recorded weapons.
// Soft foliage air, shore wash, dispersed insect calls and occasional forest owls.
audio.exteriorMix=function(){
 if(!this.ctx||!s4Running())return;const t=this.ctx.currentTime;
 // Only the guardian earns a score. Courtyard, parking and bus encounters
 // retain their physical sounds and the surrounding night, without music.
 const combat=cbScoreWanted();
 for(const p of [this.music.gain,this.musicBed.gain]){p.cancelScheduledValues(t);p.setValueAtTime(p===this.music.gain&&combat?settings.music*.92:0,t);}
 this.ambience.gain.cancelScheduledValues(t);this.ambience.gain.setTargetAtTime(settings.sfx*.32,t,.12);
 this.roomReturn.gain.cancelScheduledValues(t);this.roomReturn.gain.setTargetAtTime(.19,t,.12);
 this.roomTone.frequency.cancelScheduledValues(t);this.roomTone.frequency.setTargetAtTime(2900,t,.12);
 // A ConvolverNode rejects impulse responses with a different sample rate.
 // BufferSource ambience may be resampled; the convolution buffer may not.
 if(!this.s4Impulse||this.s4Impulse.sampleRate!==this.ctx.sampleRate){
  const rate=this.ctx.sampleRate,b=this.ctx.createBuffer(2,rate,rate);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(const [delay,gain]of [[.065,.29],[.139,.13],[.27,.052]])d[Math.floor((delay+ch*.012)*rate)]=gain;}
  this.s4Impulse=b;
 }
 if(this.room.buffer!==this.s4Impulse)this.room.buffer=this.s4Impulse;
};
audio.exteriorBed=function(kind){
 this.s4Buffers=this.s4Buffers||{};if(this.s4Buffers[kind])return this.s4Buffers[kind];
 const rate=16000,n=rate*16,fade=rate/2,channels=kind==='wind'?2:1,b=this.ctx.createBuffer(channels,n,rate);
 let seed=kind==='wind'?78213:kind==='water'?32017:92003;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 for(let ch=0;ch<channels;ch++){
  const raw=new Float32Array(n+fade);let low=0,air=0;
  for(let i=0;i<raw.length;i++){
   const t=i/rate,white=random();low=low*.994+white*.006;air=air*.82+white*.18;
   const swell=kind==='water'?.48+.35*Math.sin(t*2.2+ch)+.12*Math.sin(t*5.3):.7+.19*Math.sin(t*.37+ch*1.7)+.09*Math.sin(t*.81+2);
   // Remove the gust envelope and bass-heavy breathing from the old wind bed.
   raw[i]=kind==='water'?(air*.72+low*1.8)*swell:kind==='wind'?((air-low)*.26+low*.16):low*.8;
  }
  const out=b.getChannelData(ch);for(let i=0;i<n;i++){const w=Math.min(1,i/fade);out[i]=raw[i]*w+(i<fade?raw[n+i]*(1-w):0);}
 }
 this.s4Buffers[kind]=b;return b;
};
audio.exteriorOwl=function(){
 if(!this.ctx||!this.active||!this.s4Night)return;
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),panner=a.createPanner(),send=a.createGain();
 source.buffer=this.nightBuffers?.owl;if(!source.buffer)return;source.playbackRate.value=this.s4Night.calls%2?.96:1;
 filter.type='lowpass';filter.frequency.value=2200;panner.panningModel='HRTF';panner.distanceModel='inverse';panner.rolloffFactor=0;
 source.connect(filter).connect(gain).connect(panner).connect(this.ambience);gain.connect(send).connect(this.room);
 const roosts=[{x:53,y:33,z:3.5},{x:75,y:32,z:4},{x:93,y:83,z:3},{x:125,y:7,z:3.5},{x:40,y:23,z:3.6}];
 roosts.sort((p,q)=>Math.hypot(p.x-player.x,p.y-player.y)-Math.hypot(q.x-player.x,q.y-player.y));
 const pos=roosts[this.s4Night.calls%3===2?1:0],vol=.35,wet=.22,nodes=[source,gain,filter,panner,send];
 const v={source,gain,filter,panner,send,pos,vol,wet,nodes,night:true,until:a.currentTime+source.buffer.duration/source.playbackRate.value+.1};
 this.position(v,a.currentTime);this.voices.push(v);this.s4Night.calls++;
 source.onended=()=>{for(const n of nodes)n.disconnect();const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};source.start(a.currentTime);
};
audio.exteriorLoops=function(){
 if(this.s4Nodes?.length)return;
 this.exteriorMix();const a=this.ctx;this.s4Nodes=[];
 for(const [kind,vol,pos]of [['wind',.32,null],['water',1.65,{x:32,y:36}],['city',.1,{x:86,y:-32}],['insects',.63,{x:54,y:37}],['insects',.4,{x:73,y:39}]]){
  const source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner();source.buffer=kind==='insects'?this.nightBuffers.insects:this.exteriorBed(kind);source.loop=true;gain.gain.value=0;
  const layer=this.s4Nodes.length;if(kind==='insects')source.playbackRate.value=layer===3?1:.947;
  source.connect(gain).connect(pan).connect(this.ambience);source.start(a.currentTime,kind==='insects'&&layer===4?7.8:0);this.loops.push(source);this.s4Nodes.push({source,gain,pan,kind,vol,pos,layer});
 }
 this.s4Night={clock:0,next:1.7,calls:0};
 this.lastFoot=this.lastBreath=this.lastHeart=this.lastAmbient=0;this.exteriorTick();
};
audio.exteriorTick=function(dt=0){
 if(!this.ctx||!this.active||mode!=='playing')return;const t=this.ctx.currentTime;
 const disturbance=(S4D.on&&(['approach','impact','rearm','fight'].includes(S4D.phase)||s4qCombat()))||cbScoreWanted()||cbRunning()&&CB.state==='drowning'||hgInside();
 if(this.s4Night){
  const night=this.s4Night;night.clock+=dt;
  if(disturbance)night.next=Math.max(night.next,night.clock+12);
  else if(night.clock>=night.next){this.exteriorOwl();night.next=night.clock+24+(night.calls*7%13);}
 }
 for(const n of this.s4Nodes||[]){
  let gain=n.vol,pan=0;
  if(n.kind==='water'){
   // The audible source follows the nearest point on the long bank, rather than its center.
   n.pos=s4NearestShore(player.x,player.y);
  }
  if(n.kind==='insects'){
   const banks=n.layer===3?[[54,37],[72,28],[97,72],[49,23],[126,13]]:[[73,39],[59,25],[90,84],[29,35],[135,9]];
   banks.sort((p,q)=>Math.hypot(p[0]-player.x,p[1]-player.y)-Math.hypot(q[0]-player.x,q[1]-player.y));n.pos={x:banks[0][0],y:banks[0][1]};
   gain*=disturbance?.18:1;
  }
  if(n.pos){const dx=n.pos.x-player.x,dy=n.pos.y-player.y,d=Math.hypot(dx,dy);pan=clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-1,1)*.8;gain*=n.kind==='water'?1/(1+d*.5):n.kind==='insects'?1/(1+d*.035):1/(1+d*.012);}
  else gain*=S4.zone==='BUS STATION'?.8:1;
  n.gain.gain.setTargetAtTime(gain,t,n.kind==='insects'?(disturbance?.12:2.5):.25);n.pan.pan.setTargetAtTime(pan,t,n.kind==='insects'?1.2:.15);
 }
 for(const v of this.voices)if(v.pos)this.position(v,t);
 const speed=Math.hypot(player.vx,player.vy);
 if(speed>.9&&dashT<=0&&t-this.lastFoot>.30/Math.max(.8,speed/4.65)){
  this.lastFoot=t;const grass=s4GroundType(player.x,player.y)===2;
  const v=this.play(this.choose('step',4),{vol:grass?.19:.29,wet:.055,pan:this.variation.step%2?.12:-.12,rate:grass?.83:rand(.94,1.06)});
  if(v&&grass)v.filter.frequency.setTargetAtTime(1600,t,.01);
 }
};
(function(){
 const levels=audio.levels.bind(audio),startLoops=audio.startLoops.bind(audio),tick=audio.tick.bind(audio),reset=audio.reset.bind(audio);
 audio.levels=function(){levels();if(s4Running())this.exteriorMix();};
 audio.startLoops=function(){if(s4Running())this.exteriorLoops();else startLoops();};
 audio.tick=function(dt=0){if(s4Running())this.exteriorTick(dt);else tick(dt);};
 audio.reset=function(){reset();for(const n of this.s4Nodes||[]){n.gain.disconnect();n.pan.disconnect();}this.s4Nodes=[];this.s4Night=null;};
})();

