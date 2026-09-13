// Scene 4 / Phase 2. One finite opening encounter, followed by free exploration.
// Cinematics advance only on simulation time. Skipping constructs an endpoint;
// it never runs missed sounds, impacts or spawns in a burst.
const S4D={on:false,phase:'idle',t:0,clock:0,carry:null,origin:null,vehicle:null,
 crashed:false,door:0,wave:0,waveT:0,spawned:0,safeT:0,checkpoint:null,impactCount:0};
const S4D_DURATIONS={walk:3.6,threshold:.85,reveal:6.2,approach:1.95,impact:1.15,rearm:1.0};
const S4D_WRECK={x0:56.95,x1:61.45,y0:41.65,y1:44.35,kind:'ambulance'};
const S4D_CAST=[
 {x:61.72,y:42.62,type:0,wave:1,at:.45,from:'ambulance',out:[1,0]},
 {x:61.78,y:43.35,type:1,wave:1,at:1.3,from:'ambulance',out:[1,0]},
 {x:70.8,y:42.65,type:0,wave:2,at:.45,from:'east verge',out:[0,-1]},
 {x:67.66,y:36.5,type:2,wave:2,at:1.4,from:'forest road',out:[-1,0]},
 {x:60.54,y:47.1,type:1,wave:2,at:2.5,from:'canopy',out:[1,0]}
];
const s4dEase=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
function s4dLocked(){return S4D.on&&!['fight','aftermath','idle'].includes(S4D.phase);}
function s4dCapture(){return{hp:player.hp,weapon,ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve})),mods:{...mods},score,kills,gameTime,maxCombo};}
function s4dCarry(c){player.hp=c.hp;weapon=c.weapon;Object.assign(mods,c.mods);guns.forEach((g,i)=>Object.assign(g,c.ammo[i]));score=c.score;kills=c.kills;gameTime=c.gameTime;maxCombo=c.maxCombo;}
function s4dReset(){
 Object.assign(S4D,{on:false,phase:'idle',t:0,clock:0,carry:null,origin:null,vehicle:null,crashed:false,door:0,wave:0,waveT:0,spawned:0,safeT:0,checkpoint:null,impactCount:0});
 document.body.classList.remove('departure');$('sequenceControls').classList.add('hidden');
 audio.departureStop?.();s4qReset();s4tReset();cbReset();$('compassArrow').style.visibility='visible';
}
function s4dPhase(phase){S4D.phase=phase;S4D.t=0;hudClock=0;}
function s4dBeginWalk(){
 if(S4D.on)return false;
 Object.assign(S4D,{on:true,carry:s4dCapture(),origin:{x:player.x,y:player.y,a:player.a},clock:0});
 releaseInputs();shotCD=reloadT=reloadDuration=meleeT=muzzle=recoil=weaponDrop=0;player.vx=player.vy=0;
 msgT=feedT=0;hideOverlays();mode='playing';s4dPhase('walk');
 $('hud').classList.remove('hidden');$('touch').classList.remove('hidden');document.body.classList.add('playing');
 audio.start();audio.heartSilenceMusic();audio.play('breath1',{vol:.28,wet:.04});hudUpdate();lockPointer();return true;
}
function s4dOutside(){
 const state={...S4D},carry=s4dCapture();
 audio.reset();loadStage(3);Object.assign(S4D,state);s4dCarry(carry);S4.entry=S4D.carry;
 reviewPlace(64,50.3,-Math.PI/2);msgT=feedT=0;audio.start();audio.exteriorMix();
}
function s4dCrashPosition(t){
 t=clamp(t,0,1);const u=1-t;
 const x=u*u*u*77+3*u*u*t*72+3*u*t*t*65+t*t*t*59.2;
 // The rear steps out, the driver countersteers, then the tyres slide sideways.
 // Body yaw deliberately disagrees with travel; endpoints stay physically fixed.
 const slip=Math.sin(t*TAU)*Math.sin(t*Math.PI);
 const y=u*u*u*43+3*u*u*t*40.6+3*u*t*t*43+t*t*t*43+slip*.64;
 const dx=3*u*u*(72-77)+6*u*t*(65-72)+3*t*t*(59.2-65);
 const dy=3*u*u*(40.6-43)+6*u*t*(43-40.6);
 const skid=Math.sin(t*Math.PI);
 return{x,y,a:Math.atan2(-dy,-dx)+.42*Math.sin(t*TAU+.25)*skid,roll:.07*Math.sin(t*TAU+.4)*skid,alive:true};
}
function s4dPlaceWreck(){
 S4D.crashed=true;S4D.vehicle={x:59.2,y:43,a:0,alive:true};
 if(!S4.solids.some(b=>b.kind==='ambulance')){
  S4.solids.push({...S4D_WRECK});
  // The struck southern pier breaks low, revealing the van behind it.
  for(const f of S4.faces)if(f.s4BreakPost){for(const p of f.points)p[2]*=.19;}
  // The same strike crushes the near hedge corner. Its low, solid wreckage
  // exposes the burning cab without changing the route or the calm grounds.
  S4.faces=S4.faces.filter(f=>!f.s4CrashHedge);
  s4Box(59.35,44.75,0,1.9,1.1,.95,9,[39,73,49],false,1.6);
  s4Box(59.35,46.8,0,1.9,3,2.8,9,[39,73,49],false,1.6);
  for(const p of S4.flora)if(p.s4CrashHedge){p.z=.15;p.h=.75;p.w=2.2;}
  // The forest edge shares this corner with the living wall. Flatten only
  // the struck cell and its overhanging sapling into solid brush/rubble.
  for(const f of S4.faces)if(f.tex===8&&f.points.every(p=>p[0]>=58.3&&p[0]<=60.31&&p[1]>=44&&p[1]<=45.01))for(const p of f.points)p[2]=Math.min(p[2],.85);
  for(const p of S4.flora)if(p.x>58.4&&p.x<60.4&&p.y>=44.2&&p.y<45.5&&p.h>4){p.tex=15;p.h=.8;p.w=2.7;p.z=.12;}
  s4Box(59.1,44.8,.05,1.8,.24,.21,-1,[61,48,35],false);
 }
 // Flow and projectile collision use the same visible wreck footprint.
 for(let y=41;y<=44;y++)for(let x=56;x<=61;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 buildFlow();
}
function s4dImpact(){
 s4dPlaceWreck();S4D.impactCount++;s4dPhase('impact');
 shake=settings.reduce?0:8;audio.departureCrash();
 emit(57.35,43,.55,'#ffd09a',settings.reduce?12:65,1.5);
 emit(58.4,43.4,.28,'#778f82',settings.reduce?8:28,1.1);
}
function s4dFightStart(){
 s4dPlaceWreck();S4D.door=1;S4D.wave=1;S4D.waveT=0;S4D.spawned=0;S4D.safeT=1.8;
 releaseInputs();player.vx=player.vy=0;weaponDrop=shotCD=reloadT=dashT=meleeT=0;
 s4dPhase('fight');s4dSave();hudUpdate();feed('THEY CAME WITH YOU.');
}
function s4dSkip(){
 if(mode!=='playing'||!s4dLocked())return false;
 if(S4Q.action)return s4qActionFinish();
 // Preserve the real carried resources, but discard movie-specific sources.
 if(!s4Running())s4dOutside();else{audio.departureStop();for(const v of [...audio.voices])try{v.source.stop();}catch{}}
 reviewPlace(64,47,-Math.PI/2-.72);enemies=[];bullets=[];particles=[];rings=[];tracers=[];numbers=[];
 shake=hurt=whiteFlash=muzzle=recoil=hitstop=aimPitch=0;S4D.impactCount=0;
 s4dFightStart();audio.start();return true;
}
function s4dSave(){
 S4D.checkpoint={carry:s4dCapture(),phase:S4D.phase,clock:S4D.clock,t:S4D.t,wave:S4D.wave,waveT:S4D.waveT,spawned:S4D.spawned,
  x:player.x,y:player.y,a:player.a,enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),decals:decals.map(d=>({...d})),stageKills,stageTime,enemyId,entry:S4D.carry,quest:S4Q.on?s4qSnapshot():null,visited:[...S4.visited]};
}
function s4dRestore(){
 const c=S4D.checkpoint;if(!c)return false;
 hideOverlays();audio.reset();useChapter=true;loadStage(3);s4dCarry(c.carry);
 Object.assign(S4D,{on:true,phase:c.phase,clock:c.clock,t:c.t,wave:c.wave,waveT:c.waveT,spawned:c.spawned,carry:c.entry,door:1,safeT:1.8,checkpoint:c});
 s4dPlaceWreck();if(c.quest){Object.assign(S4Q,c.quest,{visited:[...c.quest.visited],action:null});s4qApplyGate();s4qApplyVehicle();if(S4Q.moved)S4D.door=0;}S4.visited=new Set(c.visited||[]);reviewPlace(c.x,c.y,c.a);enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));decals=c.decals.map(d=>({...d}));
 stageKills=c.stageKills;stageTime=c.stageTime;enemyId=c.enemyId;S4.entry=c.entry;
 mode='playing';document.body.classList.add('playing');$('hud').classList.remove('hidden');$('touch').classList.remove('hidden');
 review.done=c.quest?c.quest.done:c.phase==='aftermath';audio.start();hudUpdate();lockPointer();feed(c.quest?c.quest.checkpointLabel+' · CHECKPOINT':'COURTYARD CHECKPOINT');return true;
}
function s4dSpawn(actor,index){
 // The emerging body occupies a real safe cell at the doorway/cover edge.
 const e=spawn(actor.x,actor.y,actor.type);e.s4Actor=index;e.s4Emerge=.75;e.s4From=actor.from;e.dormant=true;
 e.noticed=true;e.alertT=.3;e.cd=1.15;e.vocal=3;e.phase=index*1.3;
 if(audio.active)audio.creature(e,true);
}
function s4dTick(dt){
 if(!S4D.on||mode!=='playing')return;
 S4D.t+=dt;S4D.clock+=dt;S4D.safeT=Math.max(0,S4D.safeT-dt);
 const phase=S4D.phase,t=S4D.t,span=S4D_DURATIONS[phase];
 if(phase==='walk'){
  const o=S4D.origin,p=s4dEase((t-.4)/3.2);player.x=mix(o.x,61.73,p);player.y=mix(o.y,2.5,s4dEase(t/1.2));
  player.a=angle(o.a+angle(-o.a)*s4dEase(t/.85));player.vx=player.vy=0;
  if(t>.7&&t<3.4&&Math.floor(t/.55)!==Math.floor((t-dt)/.55))audio.play(audio.choose('step',4),{vol:.25,wet:.12});
  if(t>=span)s4dPhase('threshold');
 }else if(phase==='threshold'){
  if(t>=span){s4dOutside();s4dPhase('reveal');}
 }else if(phase==='reveal'){
  player.y=mix(50.3,47,s4dEase(t/1.55));player.x=64;player.a=-Math.PI/2;player.vx=player.vy=0;
  if(t<1.6&&Math.floor(t/.45)!==Math.floor((t-dt)/.45))audio.play(audio.choose('step',4),{vol:.25,wet:.06});
  if(t>=span){S4D.vehicle=s4dCrashPosition(0);s4dPhase('approach');audio.departureEngine();}
 }else if(phase==='approach'){
  S4D.vehicle=s4dCrashPosition(t/span);
  // A small head turn follows the crash while preserving the established view.
  player.a=-Math.PI/2+.12*Math.sin(t/span*Math.PI)-.72*s4dEase((t/span-.33)/.67);if(t>=span)s4dImpact();
 }else if(phase==='impact'){
  S4D.vehicle.x=59.2-Math.sin(t*13)*.17*Math.exp(-t*3);S4D.vehicle.a=Math.sin(t*10)*.035*Math.exp(-t*3);
  S4D.door=s4dEase((t-.6)/1.1);
  if(t>=span){s4dPhase('rearm');audio.reload('end');audio.play('environment0',{vol:.38,rate:.75,pos:{x:61.6,y:43},wet:.17});}
 }else if(phase==='rearm'){
  S4D.door=mix(.55,1,s4dEase(t/span));if(t>=span)s4dFightStart();
 }else if(phase==='fight'){
  S4D.waveT+=dt;
  for(let i=0;i<S4D_CAST.length;i++){const actor=S4D_CAST[i];if(actor.wave===S4D.wave&&S4D.waveT>=actor.at&&!(S4D.spawned&(1<<i))){S4D.spawned|=1<<i;s4dSpawn(actor,i);}}
  for(const e of enemies){if(e.alive&&e.s4Emerge>0){e.s4Emerge=Math.max(0,e.s4Emerge-dt);e.walk+=dt;const out=S4D_CAST[e.s4Actor].out;move(e,out[0]*dt*.55,out[1]*dt*.55);if(!e.s4Emerge)e.dormant=false;}}
  if(S4D.wave===1&&(S4D.spawned&3)===3&&!enemies.some(e=>e.alive)&&S4D.waveT>3){S4D.wave=2;S4D.waveT=-.7;feed('MOVEMENT IN THE TREES.');}
  else if(S4D.wave===2&&S4D.spawned===31&&!enemies.some(e=>e.alive)){
   bullets=bullets.filter(q=>q.owner!=='enemy');s4dPhase('aftermath');audio.departureScoreStop();
   s4qBegin();say('NO WAY OUT.',2.2);
  }
 }
 s4qTick(dt);
 if(s4dLocked()){_safeX=player.x;_safeY=player.y;msgT=feedT=0;shake*=Math.exp(-dt*9);updateEffects(dt);}
 // The shared HUD pass runs after all simulation systems.
}
function s4dGunDip(){
 if(!s4dLocked())return 0;
 if(S4D.phase==='walk')return s4dEase(S4D.t/.7)*1.35;
 if(S4D.phase==='rearm')return (1-s4dEase(S4D.t/.7))*1.35;
 return 1.35;
}
function s4dHud(){
 if(!hudComposing){hudUpdate();return;}
 const locked=s4dLocked();document.body.classList.toggle('departure',locked);
 $('sequenceControls').classList.toggle('hidden',!locked||mode!=='playing');
 if(!S4D.on)return;
 $('sequenceSkip').textContent=S4Q.action?'SKIP ACTION · ENTER':'SKIP · ENTER';
 $('sequenceCaption').textContent=({extinguish:'PUTTING OUT THE ENGINE FIRE',move:'CLEARING THE GARDEN ENTRANCE'})[S4D.phase]||({walk:'THE FRONT DOORS',threshold:'',reveal:'NIGHT AIR.',approach:'',impact:'',rearm:'NO WAY OUT.'})[S4D.phase]||'';
 if(S4Q.action)$('sequenceCaption').textContent=(S4Q.action.kind==='extinguish'?'EXTINGUISHING ENGINE FIRE':'CLEARING THE GARDEN WALK')+' · '+Math.min(100,Math.floor(S4D.t/(S4Q.action.kind==='extinguish'?4.15:5.6)*100))+'%';
 if(!s4Running())return;
 const left=enemies.filter(e=>e.alive).length;
 if(S4D.phase==='fight'){
  $('goal').textContent='SURVIVE THE COURTYARD · '+(S4D.wave===1?'THE AMBULANCE':'THE GROUNDS')+' · '+left+' ACTIVE';
  $('lifeHint').textContent=review.active&&!review.damage?'PROTECTED':'KILL TO RESTORE';
  const target=enemies.find(e=>e.alive);if(target){$('compassText').textContent='THREAT';$('compassArrow').style.transform='rotate('+angle(Math.atan2(target.y-player.y,target.x-player.x)-player.a)+'rad)';}
 }else if(S4D.phase==='aftermath'){
  $('goal').textContent='GARDEN BLOCKED · EXPLORE PARKING / BUS ROAD';$('lifeHint').textContent='TAKE A BREATH';
 }
 const nearWreck=s4dWreckNear();
 if(nearWreck&&!locked){$('touchUse').classList.remove('hidden');touchSetLabel('touchUse','EXAMINE');}
 if(review.active){
  $('reviewBarText').textContent='NO WAY OUT · '+(locked?'DISCHARGE INTERRUPTED':S4D.phase==='fight'?'COURTYARD AMBUSH':'COURTYARD CLEAR');
  $('reviewStatus').textContent=locked?'ENTER / SKIP · ESC PAUSE · T CONTROLS':S4D.phase==='aftermath'?'PHASE 2 COMPLETE · T REVIEW · B REPLAY':'T CONTROLS · B REPLAY · '+(review.ai?'AI ON':'AI OFF')+' / '+(review.damage?'DAMAGE ON':'PROTECTED');
 }
 s4qHud();
}
function s4dWreckNear(){
 return mode==='playing'&&s4Running()&&S4D.on&&!S4Q.on&&!s4dLocked()&&S4D.crashed&&s4qCanReach({x:61.5,y:43},3,.9);
}
function s4dInteract(){
 if(S4Q.on)return s4qInteract();
 if(!s4dWreckNear())return false;
 feed('BURNING. THE GARDEN PATH IS BLOCKED.\n'+(review.active?'Moving the wreck is the next development phase.':'Find another way through the grounds.'));return true;
}
function s4dReview(scene){
 s4qReview(scene);
 if(scene==='s4_departure'){
  hwJumpTo('after');reviewPlace(HW_EXIT.x,HW_EXIT.y,0);msgT=feedT=0;hwComplete();
 }else if(scene==='s4_crash'){
  Object.assign(S4D,{on:true,carry:s4dCapture(),vehicle:s4dCrashPosition(0)});reviewPlace(64,47,-Math.PI/2);
  s4dPhase('approach');audio.departureEngine();msgT=feedT=0;
 }else if(scene==='s4_ambush'){
  Object.assign(S4D,{on:true,carry:s4dCapture()});reviewPlace(64,47,-2.29);s4dFightStart();
 }
}
reviewScenes.s4_departure={label:'Discharge — leave the hospital',level:2,chapter:true,hint:'The apparent ending. Click LEAVE HOSPITAL for the walk, bright doors, exterior reveal and crash. Enter or SKIP lands safely after the crash. Explore shows the scene with protected health and inactive combat AI; Combat drill adds the music and active ambush without damage.'};
reviewScenes.s4_crash={label:'Ambulance — the crash',level:3,chapter:true,hint:'Starts as the ambulance approaches from the right. Check the crossing, impact, fire, opening rear doors and weapon return. Then fight the two occupants and three nearby creatures. Pause freezes the sequence.'};
reviewScenes.s4_ambush={label:'Courtyard — post-crash fight',level:3,chapter:true,hint:'Weapon ready, wreck in place, a short reaction window before the first pair emerges. Combat drill is active and protected. Normal has damage and finite ammunition. Death retries this checkpoint; B replays the selected scene. Five enemies total; cleared stays clear.'};
$('sequenceSkip').onclick=s4dSkip;

