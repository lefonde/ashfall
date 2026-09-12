// The Heart's dormant Warden was never given a breathing trigger. Keep the
// approved three airy FX performances and the earlier Warden scenes intact.
const WB={voice:null,owner:null};
audio.wardenBreathStop=function(){
 const v=WB.voice;WB.voice=null;WB.owner=null;if(!v)return;
 const t=this.ctx?.currentTime||0;
 v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(0,t);
 v.send.gain.cancelScheduledValues(t);v.send.gain.setValueAtTime(0,t);
 try{v.source.stop();}catch{}for(const node of v.nodes)try{node.disconnect();}catch{}
 v.ended=true;const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);
};
function wbPresent(w){return !!(w&&w.alive&&!w.wgGone&&(w.wgFade??1)>0);}
const wbPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(!v.wardenBreath)return wbPosition(v,t);
 const w=v.follow,fade=wbPresent(w)?clamp(w.wgFade??1,0,1):0;
 // Leave headroom intact: the same .72 source ceiling, with a clearer direct
 // image and less room wash than the earlier long, impossible corridors.
 const dx=w.x-player.x,dy=w.y-player.y,d=Math.hypot(dx,dy),blocked=!lineOfSight(player.x,player.y,w.x,w.y);
 const x=(dy*Math.cos(player.a)-dx*Math.sin(player.a))*1.7,z=-(dx*Math.cos(player.a)+dy*Math.sin(player.a))*1.7;
 v.distance=d;v.gain.gain.setTargetAtTime(v.vol*fade/(1+d*.16)*(blocked?.33:1),t,.045);
 v.filter.frequency.setTargetAtTime(blocked?850:Math.max(5000,17000-d*650),t,.05);
 v.send.gain.setTargetAtTime(v.wet*(blocked?1.35:1),t,.07);
 if(v.panner?.positionX){v.panner.positionX.setTargetAtTime(x,t,.025);v.panner.positionY.setTargetAtTime((w.wgLift||0)-.02,t,.025);v.panner.positionZ.setTargetAtTime(z,t,.025);}
 else if(v.panner?.pan)v.panner.pan.setTargetAtTime(clamp(x/(d*1.7+.1),-1,1),t,.025);
};
audio.wardenBreathSound=function(w){
 if(!this.active||!this.ctx||!this.bank||mode!=='playing'||!hwRunning()||!HW.resolved||w!==HW.warden||!wbPresent(w)||settings.mute||settings.sfx<=0)return null;
 if(Math.hypot(w.x-player.x,w.y-player.y)>14)return null;
 if(WB.voice){if(WB.voice.ended||WB.voice.until<=this.ctx.currentTime||WB.owner!==w)this.wardenBreathStop();else return null;}
 const take=(w.wbBreathTake||0)%3,key='breath'+take;
 const v=this.play(key,{vol:.72,rate:.7,pos:w,follow:w,wet:.24});if(!v)return null;
 v.wardenBreath=true;v.key=key;v.ended=false;
 const ended=v.source.onended;
 v.source.onended=()=>{if(v.ended)return;v.ended=true;ended?.();if(WB.voice===v){WB.voice=null;WB.owner=null;}};
 WB.voice=v;WB.owner=w;this.position(v,this.ctx.currentTime);
 w.wbBreathTake=(take+1)%3;w.wbBreathT=AUDIO_CUES[key].duration/.7+2.1+take*.35;
 return v;
};
const wbHeartTick=hwTick;
hwTick=function(dt){
 wbHeartTick(dt);
 const w=HW.warden;
 if(!hwRunning()||!HW.resolved||!wbPresent(w)||HW.ending){audio.wardenBreathStop();return;}
 if(mode!=='playing'||!audio.active)return;
 if(WB.voice&&(WB.owner!==w||WB.voice.ended||WB.voice.until<=(audio.ctx?.currentTime||0)))audio.wardenBreathStop();
 if(WB.voice)audio.position(WB.voice,audio.ctx.currentTime);
 // A simulation timer cannot pile up missed calls during a pause. Do not
 // queue distant breaths: the first one becomes available on approach.
 if(!Number.isFinite(w.wbBreathT))w.wbBreathT=.7;
 if(Math.hypot(w.x-player.x,w.y-player.y)>14)return;
 w.wbBreathT=Math.max(0,w.wbBreathT-clamp(dt,0,.25));
 if(w.wbBreathT<=0&&!audio.wardenBreathSound(w))w.wbBreathT=.5;
};
const wbReset=audio.reset.bind(audio),wbStart=audio.start.bind(audio),wbEnd=audio.end.bind(audio);
audio.reset=function(){this.wardenBreathStop();return wbReset();};
audio.start=function(){
 // A weapon preview may wake the shared context while the game is suspended.
 // Ordinary pause/resume keeps the one current breath frozen in that context.
 if(mode!=='playing')this.wardenBreathStop();return wbStart();
};
audio.end=function(...args){this.wardenBreathStop();return wbEnd(...args);};

