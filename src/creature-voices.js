// BETA 0.1.1: pre-rendered creature performances + restrained spatial voices.
// This extension leaves the approved weapon/player/music/scene units intact.
const MV_COUNTS={idle:4,attack:5,death:3};
const MV_SPECIES=['unstitched','runner','orderly'];
const MV_TONE={unstitched:2800,runner:4500,orderly:1900,shepherd:3100,bulldog:2400,chihuahua:3800,heart:2000};
const MV={owners:new WeakMap(),bags:new Map(),idleAt:-Infinity,deathAt:-Infinity,
 preview:null,previewNodes:[],previewToken:0,played:0,culled:0};

audio.monsterChoose=function(species,event){
 const key=species+'_'+event,n=MV_COUNTS[event];let bag=MV.bags.get(key);
 if(!bag){bag={remaining:[],last:-1};MV.bags.set(key,bag);}
 if(!bag.remaining.length){
  bag.remaining=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag.remaining[i],bag.remaining[j]]=[bag.remaining[j],bag.remaining[i]];}
  if(bag.remaining[n-1]===bag.last)[bag.remaining[0],bag.remaining[n-1]]=[bag.remaining[n-1],bag.remaining[0]];
 }
 bag.last=bag.remaining.pop();return 'mv_'+key+bag.last;
};
const mvPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.monsterReady)return this.monsterReady;
 const base=mvPrepare();if(!this.ctx)return base;
 this.monsterReady=base.then(async ok=>{
  if(!ok||!this.ctx)return false;
  this.monsterBank=await loadAudioAsset(CREATURE_AUDIO_DATA,this.ctx);return true;
 });return this.monsterReady;
};
const mvPosition=audio.position.bind(audio);
audio.position=function(v,t){
 mvPosition(v,t);
 if(v.mv&&v.pos){
  const p=v.follow?.alive?v.follow:v.pos,blocked=!lineOfSight(player.x,player.y,p.x,p.y);
  v.filter.frequency.setTargetAtTime(blocked?Math.min(750,v.tone):v.tone,t,.045);
 }
};
audio.monsterSweep=function(t){
 for(const v of [...this.voices])if(v.mv&&v.until<=t)try{v.source.stop();}catch{}
};
audio.monsterSound=function(species,event,{pos=null,follow=null,owner=null,priority=1,vol=1,rate=1,wet=.16,at=0,cb=false}={}){
 if(!this.ctx||!this.monsterBank)return null;
 const a=this.ctx,t=Math.max(a.currentTime,at||a.currentTime),d=pos?Math.hypot(pos.x-player.x,pos.y-player.y):0;
 if(d>(species==='heart'||cb?24:event==='idle'?10:16)){MV.culled++;return null;}
 this.monsterSweep(a.currentTime);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 // Four creature throats maximum. A close charge warning can replace a distant
 // breath/death, but incidental chatter cannot steal an attack warning.
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 if(owner){
  const same=live.filter(v=>v.owner===owner);
  if(event!=='death'&&same.some(v=>v.priority>priority)){MV.culled++;return null;}
  for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,a.currentTime,.012);try{v.source.stop(a.currentTime+.035);}catch{}}
 }
 const remaining=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 if(remaining.length>=4){
  const candidate=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!candidate){MV.culled++;return null;}candidate.retiring=true;try{candidate.source.stop();}catch{}
 }
 const key=this.monsterChoose(species,event),cue=CREATURE_AUDIO_CUES[key];if(!cue)return null;
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.monsterBank;source.playbackRate.value=clamp(rate,.82,1.18);
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=MV_TONE[species];
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(pos&&a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,key,species,event,priority,owner,distance:d,tone:MV_TONE[species],cb,source,gain,filter,send,panner,nodes,vol,wet,
  pos:pos?{...pos}:null,follow,until:t+cue.duration/source.playbackRate.value+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const index=this.voices.indexOf(v);if(index>=0)this.voices.splice(index,1);};
 if(pos)this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);MV.played++;return v;
};

// Remove the human scream layers from direct creature calls too (Heart phase
// changes, environmental calls and the Bulldog beam's throat layer).
const mvPlay=audio.play.bind(audio);
audio.play=function(key,options={}){
 const match=/^(patient|crawler|brute|scream|shriek|roar|death)\d+$/.exec(key);
 if(!match)return mvPlay(key,options);
 const prefix=match[1],event=['scream','shriek','roar'].includes(prefix)?'attack':prefix==='death'?'death':'idle';
 const boss=cbRunning(),heart=(hbFighting()||HB.state==='dying')&&['scream','roar'].includes(prefix);
 const species=heart?'heart':boss&&prefix==='brute'?'bulldog':['patient','scream','death'].includes(prefix)?'unstitched':['crawler','shriek'].includes(prefix)?'runner':'orderly';
 return this.monsterSound(species,event,{...options,rate:1+(Math.random()-.5)*.07,vol:Math.min(options.vol??.65,1.05)*.82,wet:Math.min(options.wet??.16,.22),priority:heart?4:event==='attack'?2:0,cb:boss});
};
const mvOldCreature=audio.creature.bind(audio),mvOldKill=audio.kill.bind(audio);
audio.creature=function(e,attack=false){
 if(!e||e.type===3||!this.active||!this.ctx)return;
 // The mirror's deliberately borrowed player voice remains a narrative effect.
 if(liminal.mode==='mirror')return mvOldCreature(e,attack);
 const t=this.ctx.currentTime,event=attack?'attack':'idle',urgent=attack&&e.type>0&&e.windup>0;
 let memory=MV.owners.get(e);if(!memory){memory={idle:-Infinity,attack:-Infinity};MV.owners.set(e,memory);}
 const gap=attack?(urgent?.27:e.type===0?1.35:.85):8.5;
 if(t-memory[event]<gap||(!attack&&t<MV.idleAt)){MV.culled++;return;}
 const v=this.monsterSound(MV_SPECIES[e.type]||'orderly',event,{pos:e,follow:e,owner:e,priority:urgent?4:attack?2:0,
  vol:attack?(e.type===2?1.02:.84):.48,wet:attack?.16:.20,rate:rand(.955,1.04)});
 if(v){memory[event]=t;if(!attack)MV.idleAt=t+rand(2.3,3.8);}
 return v;
};
audio.kill=function(e=null){
 if(liminal.mode==='mirror')return mvOldKill(e);
 this.flesh(e,true);
 if(!e||e.type===3||!this.active||!this.ctx)return;
 const t=this.ctx.currentTime;if(t<MV.deathAt)return;
 const v=this.monsterSound(MV_SPECIES[e.type]||'orderly','death',{pos:e,owner:e,priority:1,vol:.62,wet:.14,rate:rand(.95,1.04)});
 if(v)MV.deathAt=t+.48;
};

// Canine articulations replace sped-up human/imp voices. Physical impacts,
// beam synthesis, score, splash and the exact finale timing remain unchanged.
const mvOldCerberusCue=audio.cerberusCue.bind(audio);
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const p=pos||CB,t=this.ctx.currentTime;
 const throat=(species,event,vol,delay=0)=>this.monsterSound(species,event,{pos:p,priority:kind==='yap'?2:4,vol:vol*strength,wet:.13,rate:rand(.96,1.04),at:t+delay,cb:true});
 if(kind==='wake'){throat('shepherd','attack',1.25);throat('bulldog','idle',.95,.23);mvPlay('bodyfall',{pos:p,vol:.5,rate:.57,wet:.16});}
 else if(kind==='snarl')throat('shepherd','attack',1.0);
 else if(kind==='charge')throat('bulldog','attack',.95);
 else if(kind==='hit'){mvPlay('gore1',{pos:p,vol:.78*strength,rate:.8,wet:.09});if(strength>.8)throat('bulldog','death',.5);}
 else if(kind==='chew'){mvPlay('flesh0',{pos:p,vol:.23,rate:1.32,wet:.025});}
 else if(kind==='breath')throat('bulldog','idle',.65);
 else if(kind==='snap'){mvPlay('flesh1',{pos:p,vol:.8,rate:.72,wet:.08});throat('chihuahua','attack',.7);}
 else if(kind==='yap'){
  if(t<(this.mvYapAt||0))return;this.mvYapAt=t+.19;
  throat('chihuahua','attack',.64);
 }
 else if(kind==='want')throat('chihuahua','idle',.65);
 else if(kind==='stagger'){throat('shepherd','death',.9);mvPlay('bodyfall',{pos:p,vol:.7,rate:.59,wet:.07});}
 else if(kind==='fetch'){throat('chihuahua','attack',.75);throat('bulldog','idle',.7,.18);}
 else if(kind==='plunge'){mvPlay('bodyfall',{pos:p,vol:1.5,rate:.42,wet:.17});throat('bulldog','death',.7,.1);}
 else if(kind==='submerge')throat('bulldog','death',.55);
 else mvOldCerberusCue(kind,pos,strength);
};

// A separate context auditions the exact baked clips without resuming paused
// music, ambience, pending attacks, game time or the main audio context.
audio.monsterPreviewStop=function(){
 MV.previewToken++;
 for(const v of MV.previewNodes){try{v.source.stop();}catch{}for(const n of v.nodes)try{n.disconnect();}catch{}}
 MV.previewNodes=[];
 if(MV.preview){MV.preview.suspend().catch(()=>{});}
 if($('mvPreviewStatus'))$('mvPreviewStatus').textContent='Choose a creature. Listen plays a breath, attack and death variation.';
};
audio.monsterPreview=function(){
 if(mode!=='settings')return;
 this.monsterPreviewStop();const token=MV.previewToken;
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 if(!MV.preview)MV.preview=new AC();const a=MV.preview;
 a.resume().catch(()=>{});
 this.prepare().then(ok=>{
  if(!ok||mode!=='settings'||token!==MV.previewToken)return;
  const species=MV_SPECIES[Number($('mvPreviewSpecies').value)||0],distance=Number($('mvPreviewDistance').value)||2;
  let at=a.currentTime+.05;
  for(const event of ['idle','attack','death']){
   const key=this.monsterChoose(species,event),cue=CREATURE_AUDIO_CUES[key],source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter();
   source.buffer=this.monsterBank;filter.type='lowpass';filter.frequency.value=MV_TONE[species];filter.Q.value=.4;
   const level=(event==='idle'?.48:event==='death'?.62:species==='orderly'?1.02:.84)*.86/(1+distance*.21);
   gain.gain.value=settings.mute?0:settings.sfx*level;source.connect(filter).connect(gain).connect(a.destination);
   const v={source,gain,level,nodes:[source,filter,gain]};MV.previewNodes.push(v);
   source.onended=()=>{for(const n of v.nodes)try{n.disconnect();}catch{}MV.previewNodes=MV.previewNodes.filter(n=>n!==v);if(!MV.previewNodes.length&&token===MV.previewToken){a.suspend().catch(()=>{});$('mvPreviewStatus').textContent='Finished. Listen again for different takes.';}};
   source.start(at,cue.start,cue.duration);at+=cue.duration+.52;
  }
  $('mvPreviewStatus').textContent=settings.mute?'Muted in Options.':'Breath → attack → death · '+distance+' m · game remains paused';
 }).catch(()=>{$('mvPreviewStatus').textContent='Audio unavailable. Reload the file to retry.';});
};
$('mvPreviewPlay').onclick=()=>audio.monsterPreview();
$('mvPreviewStop').onclick=()=>audio.monsterPreviewStop();
const mvSettingsBack=$('settingsBack').onclick;
$('settingsBack').onclick=()=>{audio.monsterPreviewStop();mvSettingsBack();};
const mvReset=audio.reset.bind(audio),mvStart=audio.start.bind(audio),mvLevels=audio.levels.bind(audio),mvPause=audio.pause.bind(audio);
audio.reset=function(){this.monsterPreviewStop();mvReset();MV.owners=new WeakMap();MV.idleAt=MV.deathAt=-Infinity;this.mvYapAt=0;};
audio.start=function(){this.monsterPreviewStop();mvStart();};
audio.pause=function(){this.monsterPreviewStop();mvPause();};
audio.levels=function(){mvLevels();for(const v of MV.previewNodes)v.gain.gain.setTargetAtTime(settings.mute?0:settings.sfx*v.level,MV.preview.currentTime,.02);};
addEventListener('blur',()=>audio.monsterPreviewStop());
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.monsterPreviewStop();});

