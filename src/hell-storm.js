// The destination is a storm, audible through the opening and surrounding you
// on the bridge. Bounded visual work and two cached audio buffers; no new score.
const HG_STORM={clock:0,thunder:-1};
function hgStormStrength(){
 if(!s4Running()||!CB.rewarded)return 0;
 if(hgInside())return 1;
 const d=Math.hypot(player.x-43,player.y-19.22);
 return clamp((22-d)/18,0,1)*CB.gateProgress*(lineOfSight(player.x,player.y,43,20.5)?1:.08);
}
function hgStormFlash(){
 if(settings.reduce||!s4Running()||!CB.rewarded)return 0;
 const t=HG_STORM.clock%9.4-2;
 return t>=0&&t<.16?Math.sin(t/.16*Math.PI)*.7:t>=.29&&t<.48?Math.sin((t-.29)/.19*Math.PI)*.36:0;
}
audio.hellStormBuffer=function(thunder=false){
 const key=thunder?'hgThunderBuffer':'hgWindBuffer';if(this[key])return this[key];
 const rate=16000,n=rate*(thunder?6:16),fade=rate/2,b=this.ctx.createBuffer(2,n,rate);
 let seed=thunder?43172:89123;
 for(let ch=0;ch<2;ch++){
  const raw=new Float32Array(n+fade);let low=0,mid=0,air=0;
  for(let i=0;i<raw.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/2147483648-1,t=i/rate;
   low=low*.993+white*.007;mid=mid*.94+white*.06;air=air*.60+white*.40;
   if(thunder){
    const start=Math.max(0,t-ch*.027),roll=Math.exp(-start*.8)*(1+.24*Math.sin(start*9)),
     attack=Math.min(1,start*38),crack=Math.exp(-start*24)*air*1.7;
    raw[i]=Math.tanh((low*5.3+mid*.85)*roll+crack)*attack*Math.min(1,(6-t)*2);
   }else{
    const gust=.64+.17*Math.sin(t*.73+ch*.65)+.11*Math.sin(t*1.69+ch),
     whistle=Math.sin(t*TAU*(183+ch*9)+Math.sin(t*.7)*8)*.009;
    raw[i]=Math.tanh((low*2.1+mid*.76+(air-mid)*.27)*gust+whistle);
   }
  }
  const out=b.getChannelData(ch);
  for(let i=0;i<n;i++){const blend=Math.min(1,i/fade);out[i]=thunder?raw[i]:raw[i]*blend+(i<fade?raw[n+i]*(1-blend):0);}
 }
 this[key]=b;return b;
};
audio.hellStormStop=function(){
 for(const group of [this.hgWind,this.hgThunder])if(group){
  group.source.onended=null;try{group.source.stop();}catch{}
  for(const n of group.nodes)try{n.disconnect();}catch{}
 }
 this.hgWind=this.hgThunder=null;
};
audio.hellStormLayer=function(thunder=false){
 const a=this.ctx,source=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain(),pan=a.createStereoPanner();
 source.buffer=this.hellStormBuffer(thunder);source.loop=!thunder;filter.type='lowpass';filter.frequency.value=1200;
 gain.gain.value=0;source.connect(filter).connect(gain).connect(pan).connect(this.sfx);
 const layer={source,filter,gain,pan,nodes:[source,filter,gain,pan]};
 if(thunder)source.onended=()=>{for(const n of layer.nodes)n.disconnect();if(this.hgThunder===layer)this.hgThunder=null;};
 source.start(a.currentTime);return layer;
};
audio.hellStormTick=function(dt){
 if(mode!=='playing')return;
 if(!s4Running()||!CB.rewarded){if(this.hgWind||this.hgThunder)this.hellStormStop();return;}
 HG_STORM.clock+=dt;
 const strength=hgStormStrength();if(!this.ctx||!this.active)return;
 if(strength>.005&&!this.hgWind)this.hgWind=this.hellStormLayer();
 const t=this.ctx.currentTime,inside=hgInside(),dx=43-player.x,dy=19.22-player.y,
  pan=inside?0:clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(Math.hypot(dx,dy)||1),-1,1)*.75;
 if(this.hgWind){
  this.hgWind.gain.gain.setTargetAtTime(strength*(inside?1.13:.84),t,.5);
  this.hgWind.filter.frequency.setTargetAtTime(inside?6100:900+strength*2100,t,.4);
  this.hgWind.pan.pan.setTargetAtTime(pan,t,.25);
 }
 const cycle=Math.floor(HG_STORM.clock/9.4),phase=HG_STORM.clock%9.4;
 if(phase>=2.7&&HG_STORM.thunder!==cycle){
  HG_STORM.thunder=cycle;
  if(strength>.03&&!this.hgThunder){
   this.hgThunder=this.hellStormLayer(true);
   this.hgThunder.gain.gain.setValueAtTime(strength*.9,t);
   this.hgThunder.filter.frequency.setValueAtTime(inside?3400:1200+strength*1500,t);
   this.hgThunder.pan.pan.setValueAtTime(inside?(cycle%2?.34:-.34):pan,t);
  }
 }
 if(this.hgThunder){
  this.hgThunder.gain.gain.setTargetAtTime(strength*.9,t,.25);
  this.hgThunder.filter.frequency.setTargetAtTime(inside?3400:1200+strength*1500,t,.25);
  this.hgThunder.pan.pan.setTargetAtTime(inside?(cycle%2?.34:-.34):pan,t,.25);
 }
 // The quiet courtyard mix is preserved outside. Wildlife recedes inside.
 if(inside)for(const n of this.s4Nodes||[])n.gain.gain.setTargetAtTime(n.kind==='wind'?.02:0,t,.45);
};
function hgStormLine(a,b,color,width,alpha){
 const p=project(...a),q=project(...b);if(!p||!q)return;
 for(const v of [p,q]){
  if(v.x<0||v.x>=W||v.y<0||v.y>=H)return;
  const index=(v.y|0)*W+(v.x|0);
  if(!HG.mask?.[index]||S4.depth[index]<v.d-.12)return;
 }
 wc.strokeStyle=color;wc.globalAlpha=alpha;wc.lineWidth=width;
 wc.beginPath();wc.moveTo(p.x,p.y);wc.lineTo(q.x,q.y);wc.stroke();
}
function hgStormDraw(){
 if(!s4Running()||!CB.rewarded||Math.hypot(player.x-43,player.y-19.22)>35)return;
 const clock=settings.reduce?0:HG_STORM.clock;
 wc.save();
 // Fixed population. Ash travels across the actual bridge in perspective.
 for(let i=0;i<72;i++){
  const x=34+((i*7.131+clock*(2.8+i%3*.35))%19),
   y=19.1-((i*3.173+clock*.8)%26),z=.08+((i*.731+clock*.37)%3.7),
   length=settings.reduce?.025:.15+(i%4)*.04;
  hgStormLine([x,y,z],[x-length,y+.025,z+.07],i%5?'#d9b8b1':'#fb738d',1,i%5?.28:.46);
 }
 const flash=hgStormFlash();
 if(flash>0){
  const side=Math.floor(HG_STORM.clock/9.4)%2?1:-1,bolt=[];
  for(let j=0;j<9;j++)bolt.push([43+side*9+Math.sin(j*7.3)*1.2,-34+j*.27,10-j*.9]);
  for(let j=1;j<bolt.length;j++)hgStormLine(bolt[j-1],bolt[j],'#f2dbea',1.5,flash);
 }
 wc.restore();
}
const hgStormPreviousTick=audio.tick.bind(audio),hgStormPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt=0){hgStormPreviousTick(dt);this.hellStormTick(dt);};
audio.reset=function(){this.hellStormStop();HG_STORM.clock=0;HG_STORM.thunder=-1;hgStormPreviousReset();};

