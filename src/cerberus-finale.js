// Phase 6. One wounded item, one guardian, and one irreversible water landing.
// The earlier single-head drills retain their safe one-third stopping point.
const CBF_STAGGER=360;
const CBF_GATE={leaves:[],passable:false};
function cbfSafe(){return cbRunning()&&(CB.state==='transition'||CB.lureCommitted);}
function cbfJourneyBegin(){
 if(!s4qRunning()||!S4Q.moved||CB.on)return false;
 s4dSave();const journey=S4D.checkpoint;
 Object.assign(CB,cbFresh(),{on:true});review.done=false;
 CB.checkpoint={journey};reviewSync();return true;
}
function cbfDropPoint(){
 // Put the light outside the body on reachable, visible grass. No pickup can
 // be hidden inside its collider, the gate, a hedge or the shore.
 for(const r of [3.3,2.8,3.8,4.4])for(const turn of [.40,-.4,0,.85,-.85,1.3,-1.3,Math.PI]){
  const a=CB.a+turn,p={x:CB.x+Math.cos(a)*r,y:CB.y+Math.sin(a)*r};
  if(fits(p.x,p.y,.3)&&s4CastRay(CB.x,CB.y,Math.cos(a),Math.sin(a),r).d>=r-.05)return p;
 }
 return s4tSafePoint({x:42,y:31});
}
function cbfDrop(){
 if(!cbRunning()||CB.toyDropped)return false;
 const from=cbHead('chihuahua'),to=cbfDropPoint();
 cbCancelAttack();bullets=bullets.filter(q=>q.owner!=='enemy');
 CB.state='transition';CB.t=0;CB.toyDropped=true;CB.hp=CB.trail=CB_STOP;
 CB.dropFrom={...from};CB.dropTo=to;CB.stagger=CB.staggerMeter=0;CB.cycle=0;
 Object.assign(S4T,s4tFresh(),{on:true,phase:'dropping',x:from.x,y:from.y,z:from.z,
  previousGun:weapon<3?weapon:0,safe:{...to},origin:{...to},facing:CB.a,voiceAt:1.8});
 s4tBuildCollision();S4T_RUNTIME.nav=null;
 audio.cerberusBeamStop();audio.cerberusCue('snap',from);
 feed('THE LITTLE HEAD STOPS CHEWING.');review.done=false;
 return true;
}
function cbfSettleDrop(){
 Object.assign(S4T,CB.dropTo,{phase:'ground',z:.27,settle:.4});
 audio.seraphimCue('land');CB.state='frenzy';CB.t=0;CB.cooldown=.9;CB.cycle=0;CB.yapCD=.45;
 audio.cerberusCue('yap',cbHead('chihuahua'),1.15);
 feed('FRENZY · GUNFIRE STAGGERS THE HEADS.\nTHE FALLEN LIGHT IS STILL BREATHING.');hudUpdate();
}
function cbfStagger(damage){
 if(CB.state!=='frenzy'||CB.stagger>0||review.active&&review.holdBoss)return;
 CB.staggerMeter=Math.min(CBF_STAGGER,CB.staggerMeter+damage);CB.staggerLast=CB.clock;
 if(CB.staggerMeter>=CBF_STAGGER){
  CB.stagger=1.05;cbCancelAttack();CB.cooldown=.75;
  audio.cerberusCue('stagger');feed('HEADS STAGGERED · MAKE YOUR MOVE.');
 }
}
function cbfStartYap(){
 if(!cbPressure()||CB.state!=='frenzy'||CB.stagger>0||CB.yap)return false;
 const m=cbHead('chihuahua'),dx=player.x-m.x,dy=player.y-m.y,d=Math.hypot(dx,dy);
 if(d<1||d>22||s4CastRay(m.x,m.y,dx/d,dy/d,d).d<d-.35)return false;
 const spiral=CB.yapCycle%2===1;
 CB.yap={kind:'yap',t:0,windup:.28,duration:1.08,sent:0,count:8,
  aim:Math.atan2(dy,dx),gap:CB.yapCycle%2?-.29:.29,spiral,target:{x:player.x,y:player.y}};
 audio.cerberusCue('yap',m,.75);return true;
}
function cbfYapShot(a){
 // Staggered fans and corkscrew fans retain moving gaps, rather than filling
 // every angle. They have their own clock and fire during either big head.
 const m=cbHead('chihuahua'),sweep=a.spiral?(a.sent-3.5)*.055:(a.sent%2? .04:-.04);
 let live=bullets.filter(q=>q.cbYap&&!q.cancelled).length;
 for(let i=0;i<11&&live<96;i++){
  const offset=(i-5)*.195+sweep;if(Math.abs(offset-a.gap)<.16)continue;
  const direction=a.aim+offset,speed=a.spiral?11.8:10.6;
  if(!cbfYapEscapeClear(m,direction,speed))continue;
  bullets.push({x:m.x,y:m.y,z:m.z,cbZ0:m.z,cbTravel:0,
   cbTargetD:Math.max(1,Math.hypot(a.target.x-m.x,a.target.y-m.y)),a:direction,
   speed,damage:6,kind:'cerberus',cb:true,cbYap:true,life:2.5,r:.085,
   owner:'enemy',color:a.spiral?'#ffad64':'#ffe082'});
  live++;CB.shots++;
 }
 a.sent++;CB.yapFlash=.09;emit(m.x,m.y,m.z,'#ffe5a0',2,.2);
 audio.cerberusCue('yap',m,.52+(a.sent%2)*.14);
}
function cbfYapTick(dt){
 if(CB.state!=='frenzy'||!cbAI()||CB.stagger>0)return;
 CB.yapFlash=Math.max(0,CB.yapFlash-dt);
 const a=CB.yap;
 if(a){
  a.t+=dt;while(a.sent<a.count&&a.t>=a.windup+a.sent*.135)cbfYapShot(a);
  if(a.t>=a.windup+a.duration){CB.yap=null;CB.yapCD=.48;CB.yapCycle++;}
 }else{CB.yapCD-=dt;if(CB.yapCD<=0&&!cbfStartYap())CB.yapCD=.25;}
}
function cbfEscapePoint(b,time){
 const u=clamp(time/.86,0,1);return{x:mix(b.safeFrom.x,b.safe.x,u),y:mix(b.safeFrom.y,b.safe.y,u)};
}
function cbfBoltMeetsEscape(q,b,elapsed=0){
 const dx=Math.cos(q.a)*q.speed,dy=Math.sin(q.a)*q.speed;
 for(let t=0;t<=Math.min(q.life,2.55-elapsed);t+=.055){
  const p=cbfEscapePoint(b,t+elapsed);
  if(Math.hypot(q.x+dx*t-p.x,q.y+dy*t-p.y)<.61)return true;
 }return false;
}
function cbfBeamEscapeClear(b){return !bullets.some(q=>q.cbYap&&!q.cancelled&&cbfBoltMeetsEscape(q,b));}
function cbfYapEscapeClear(m,a,speed){
 const beam=CB.attack;if(beam?.kind!=='beam')return true;
 return !cbfBoltMeetsEscape({x:m.x,y:m.y,a,speed,life:2.5},beam.beam,beam.t);
}
function cbfToyReaction(kind){
 if(!cbRunning()||CB.state!=='frenzy')return;
 CB.tug=kind==='land'?1.15:.6;
 audio.cerberusCue('want',cbHead('chihuahua'));
 if(kind==='land')feed('THE LITTLE HEAD PULLS TOWARD ITS TOY.\nTHE OTHER TWO BRACE AGAINST IT.');
}
function cbfWaterLanding(){
 if(!cbRunning()||!CB.toyDropped)return false;
 if(CB.lureCommitted)return true;
 if(CB.state!=='frenzy')return false;
 if(!S4T_RUNTIME.nav)s4tBuildNav();
 const route=cbfRetrieveRoute(S4T);
 if(!route){s4tReturn('THE GUARDIAN CANNOT REACH THAT BANK. TRY AN OPEN SHORE.');return true;}
 CB.route=route;CB.routeIndex=0;CB.lureCommitted=true;CB.state='fetch';CB.t=0;
 CB.stagger=CB.staggerMeter=0;S4T.returnT=0;
 cbCancelAttack();bullets=bullets.filter(q=>q.owner!=='enemy');
 audio.cerberusCue('fetch',cbHead('chihuahua'));feed('IT WILL NOT LET GO.');
 return true;
}
function cbfMakeRoom(next){
 const gap=CB_RADIUS+.27,dx=player.x-next.x,dy=player.y-next.y,d=Math.hypot(dx,dy);
 if(d>=gap)return true;
 // The solved encounter cannot kill or trap its player. A tiny swept nudge
 // moves an obstructing player to dry grass; otherwise the body waits.
 const a=d>.01?Math.atan2(dy,dx):CB.a+Math.PI/2;
 for(const turn of [0,.4,-.4,.8,-.8,1.2,-1.2]){
  const p={x:next.x+Math.cos(a+turn)*(gap+.04),y:next.y+Math.sin(a+turn)*(gap+.04)};
  if(Math.hypot(p.x-player.x,p.y-player.y)>.45||!cbPlayerSweep(player,p))continue;
  player.x=p.x;player.y=p.y;_safeX=p.x;_safeY=p.y;player.vx=player.vy=0;return true;
 }
 return false;
}
function cbfFetchTick(dt){
 const target=CB.route[CB.routeIndex];
 if(!target){if(CB.toyHeld)cbfDrown();else cbfBeginRetrieve();return;}
 const dx=target.x-CB.x,dy=target.y-CB.y,d=Math.hypot(dx,dy),step=Math.min(d,3.1*dt),
  next={x:CB.x+dx/(d||1)*step,y:CB.y+dy/(d||1)*step};
 if(!s4tProxySweep(CB,next,!!target.water)){
  // Do not fake arrival or phase through scenery. An unexpected obstruction
  // cancels the solution and makes the canonical item recoverable again.
  CB.lureCommitted=false;CB.state='frenzy';CB.t=0;CB.cooldown=2;
  s4tReturn('THE HEAVY BODY CANNOT PASS. THE LIGHT RETURNS.');return;
 }
 if(!cbfMakeRoom(next)){
  CB.roomWait=(CB.roomWait||0)+dt;
  if(CB.roomWait>1.2&&CB.clock>(CB.roomHint||0)){CB.roomHint=CB.clock+6;feed('GIVE THE BODY ROOM TO PASS.');}
  return;
 }
 CB.roomWait=0;
 Object.assign(CB,next);CB.walk+=dt;
 if(d>.001)CB.a=angle(CB.a+clamp(angle(Math.atan2(dy,dx)-CB.a),-dt*2.8,dt*2.8));
 if(CB.clock>CB.stepAt){CB.stepAt=CB.clock+.45;audio.cerberusCue('step',CB,1.35);}
 if(d<=step+.001)CB.routeIndex++;
}
function cbfDrown(){
 if(CB.state!=='fetch'||!CB.toyHeld||S4T.phase!=='mouth'||!s4Pond(CB.x,CB.y))return false;
 // The planned end point is beyond the shore by more than the body radius.
 for(let i=0;i<24;i++)if(!s4Pond(CB.x+Math.cos(i*TAU/24)*CB_RADIUS,CB.y+Math.sin(i*TAU/24)*CB_RADIUS))return false;
 CB.state='drowning';CB.t=0;CB.sink=0;CB.waterPulse=0;cbCancelAttack();
 audio.cerberusScoreStop();audio.cerberusCue('plunge',CB);audio.cerberusWater(CB);
 shake=Math.max(shake,settings.reduce?0:4.5);
 emit(CB.x,CB.y,.08,'#c3dce0',settings.reduce?18:65,2.3);
 feed('THREE THROATS. NO BREATH.');return true;
}
function cbfDefeated(){
 if(CB.rewarded)return;
 CB.alive=false;CB.state='aftermath';CB.t=0;CB.hp=CB.trail=0;CB.rewarded=true;
 score+=6000;kills++;stageKills++;killmarker=.25;
 s4tReset();audio.cerberusStop();audio.exteriorMix();
 audio.cerberusCue('gate', {x:43,y:19.5});
 const label=S4.labels.find(l=>l.interact==='EXAMINE THE GATES');
 if(label)label.read='THE IRON HAS LET GO.\nTHERE IS A WAY THROUGH.';
 feed('THE GATES RELEASE.');hudUpdate();
}
function cbfTick(dt){
 if(CB.state==='transition'){
  const u=clamp(CB.t/1.12,0,1),ease=s4dEase(u);
  S4T.x=mix(CB.dropFrom.x,CB.dropTo.x,ease);S4T.y=mix(CB.dropFrom.y,CB.dropTo.y,ease);
  S4T.z=mix(CB.dropFrom.z,.27,u)+Math.sin(Math.PI*u)*.34;
  if(CB.t>=1.9)cbfSettleDrop();return true;
 }
 if(CB.state==='fetch'){cbfFetchTick(dt);cbfSyncMouth();return true;}
 if(CB.state==='retrieve'){cbfRetrieveTick();return true;}
 if(CB.state==='drowning'){
  CB.sink=s4dEase(CB.t/3.9)*2.75+(settings.reduce?0:Math.sin(CB.t*10)*.07*Math.sin(Math.PI*clamp(CB.t/3.9,0,1)));
  cbfSyncMouth();
  if(CB.t>=CB.waterPulse){
   CB.waterPulse=CB.t+.48;
   emit(CB.x,CB.y,.08,'#91b8c5',settings.reduce?4:12,1.8);
   if(CB.t>1&&CB.t<2)audio.cerberusCue('submerge',CB,.6);
  }
  if(CB.t>=4.3)cbfDefeated();return true;
 }
 if(CB.state==='aftermath'){
  cbfOpenGate(clamp(CB.t/2.1,0,1));
  if(CB.gateProgress>=1)hgWalkTick();
  return true;
 }
 if(CB.state==='escaped')return true;
 if(CB.state==='frenzy'){
  if(CB.stagger>0){CB.stagger=Math.max(0,CB.stagger-dt);if(!CB.stagger)CB.staggerMeter=0;return true;}
  if(CB.clock-CB.staggerLast>2.4)CB.staggerMeter=Math.max(0,CB.staggerMeter-dt*45);
 }
 return false;
}
function cbfBuildGate(){
 hgBuild();CBF_GATE.leaves=[];CBF_GATE.passable=false;
 const old=S4.faces.filter(f=>f.cerberusGate);S4.faces=S4.faces.filter(f=>!f.cerberusGate);
 for(const f of old)for(let side=0;side<2;side++){
  const points=f.points.map(p=>[mix(p[0],43,.5),p[1],p[2]]);
  // Split at the centre seam, preserving the original complete texture.
  const a=f.points[0][0],b=f.points[1][0],left=side===0?a:43,right=side===0?43:b;
  points[0][0]=points[3][0]=left;points[1][0]=points[2][0]=right;
  const leaf={...f,points,u:f.u/2,u0:side*f.u/2};delete leaf.cx;delete leaf.out;
  const west=(left+right)/2<43;
  CBF_GATE.leaves.push({face:leaf,closed:points.map(p=>[...p]),hinge:west?39.65:46.35,sign:west?-1:1});
  S4.faces.push(leaf);
 }
}
function cbfOpenGate(progress){
 CB.gateProgress=progress;const u=s4dEase(progress);
 for(const l of CBF_GATE.leaves){
  const a=l.sign*u*Math.PI*.47,c=Math.cos(a),s=Math.sin(a);
  l.face.points=l.closed.map(p=>{const dx=p[0]-l.hinge,dy=p[1]-19.5;return[l.hinge+dx*c-dy*s,19.5+dx*s+dy*c,p[2]];});
  delete l.face.cx;delete l.face.out;
 }
 if(progress>=.88){
  S4.solids=S4.solids.filter(b=>!['cerberusGate','cerberusLeaf'].includes(b.kind));
  for(const l of CBF_GATE.leaves.filter((_,i)=>i<2)){
   const xs=l.face.points.map(p=>p[0]),ys=l.face.points.map(p=>p[1]);
   S4.solids.push({x0:Math.min(...xs)-.05,x1:Math.max(...xs)+.05,y0:Math.min(...ys)-.05,y1:Math.max(...ys)+.05,kind:'cerberusLeaf'});
  }
  if(!CBF_GATE.passable){CBF_GATE.passable=true;for(let y=15;y<=20;y++)for(let x=39;x<=47;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;buildFlow();}
 }
}
function cbfComplete(){
 if(CB.completed||!CB.rewarded||CB.gateProgress<1||!hgInside()||player.y>7.3||mode!=='playing')return false;
 CB.completed=true;CB.state='escaped';cleared=true;review.done=review.active;
 finish(true);
 $('endLabel').textContent='CHAPTER FOUR COMPLETE';$('endTitle').textContent='INTO HELL.';
 $('endReason').textContent='The hospital was only the threshold. Something vast is breathing on the other side.';
 $('retryBtn').textContent='REPLAY BOSS CHECKPOINT';return true;
}
function cbfHud(){
 if(!CB.toyDropped)return false;
 const resolved=CB.lureCommitted,after=!CB.alive,pct=CB.stagger>0?100:CB.staggerMeter/CBF_STAGGER*100;
 const visible=!after&&mode!=='menu';
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);
 document.body.classList.add('cerberus-fight');$('bossHud').classList.remove('boss-dead');
 $('bossHud').setAttribute('aria-label','Cerberus frenzy');$('bossTitle').textContent=resolved?'CERBERUS':'FRENZY';document.body.classList.add('cerberus-frenzy');
 $('bossMeter').setAttribute('aria-label','Gun stagger buildup');$('bossMeter').setAttribute('aria-valuenow',Math.round(pct));
 $('bossFill').style.width=pct+'%';$('bossTrail').style.width=pct+'%';
 $('bossHealth').textContent=CB.stagger>0?'OPEN':resolved?'':Math.round(pct)+'%';
 $('bossState').textContent=CB.state==='transition'?'THE LITTLE HEAD WAKES':CB.state==='retrieve'?'THE TOY IS HIS':CB.state==='fetch'?(CB.toyHeld?'ONE LAST CHEW':'THE BODY FOLLOWS'):CB.state==='drowning'?'NO BREATH':CB.stagger>0?'MAKE YOUR MOVE':CB.attack?.kind==='beam'?(CB.attack.fired?'WHITEOUT':'BEAM CHARGING'):CB.attack?(CB.yap?'CROSSFIRE':'SHEPHERD SALVO'):CB.yap?'CHIHUAHUA FRENZY':'GUNFIRE BUYS TIME';
 $('goal').textContent=after?(hgInside()?'FOLLOW THE BRIDGE INTO HELL':'HELL IS OPEN · WALK THROUGH'):resolved?'WATCH THE WATER':CB.state==='transition'?'THE CAPTIVE LIGHT FALLS':s4tNear()?(coarse?'USE · ':'[E] ')+'LIFT THE WOUNDED SERAPHIM':s4tCarried()?(weapon===3?(coarse?'FIRE TO THROW · GUN TO SWITCH':'FIRE TO THROW · 1–3 GUNS'):(coarse?'GUN TO SELECT THE SERAPHIM':'4 TO HOLD THE SERAPHIM')):S4T.phase==='airborne'?'FOLLOW THE FALLING LIGHT':'THE LITTLE HEAD WANTS ITS TOY';
 $('lifeHint').textContent=cbfSafe()?'TAKE A BREATH':!review.active||review.damage?'STAY MOBILE':'PROTECTED';
 const target=after?{x:43,y:hgInside()?6:17.5}:resolved?CB:S4T,held=s4tCarried();
 $('compassText').textContent=after?(hgInside()?'THE OTHER SIDE':'GARDEN GATES'):resolved?'THE POND':held?'SERAPHIM CARRIED':'SERAPHIM';
 $('compassArrow').style.visibility=held?'hidden':'visible';
 $('compassArrow').style.transform='rotate('+angle(Math.atan2(target.y-player.y,target.x-player.x)-player.a)+'rad)';
 if(review.active){
  $('reviewBarText').textContent='NO WAY OUT · '+(after?'THE OPEN GATES':resolved?'THE GUARDIAN FOLLOWS':'CERBERUS / LAST THIRD');
  $('reviewStatus').textContent='T CONTROLS · B RESET · '+(CB.completed?'SCENE COMPLETE':cbfSafe()?'AFTERMATH':review.damage?'DAMAGE ON':'PROTECTED');
 }
 return true;
}
function cbfWaterAtmosphere(){
 if(!cbRunning()||!['drowning','aftermath'].includes(CB.state)||CB.state==='aftermath'&&CB.t>7)return;
 const fade=CB.state==='aftermath'?clamp(1-CB.t/7,0,1):1;
 wc.save();wc.lineWidth=1;wc.strokeStyle='#a9cdd4';
 for(let j=0;j<4;j++){
  const u=((CB.clock*.38+j*.25)%1),r=.5+u*3.8;
  wc.globalAlpha=(1-u)*fade*.42;wc.beginPath();let started=false;
  for(let i=0;i<=44;i++){
   const a=i*TAU/44,x=CB.x+Math.cos(a)*r,y=CB.y+Math.sin(a)*r,v=project(x,y,.035);
   if(!v||!s4Pond(x,y)||!s4Visible(v.x,v.y,v.d,.15)){started=false;continue;}
   if(started)wc.lineTo(v.x,v.y);else{wc.moveTo(v.x,v.y);started=true;}
  }wc.stroke();
 }wc.restore();
}
function cbfReview(scene){
 if(!['cb_transition','cb_frenzy','cb_dropped','cb_carried','cb_water','cb_after'].includes(scene))return;
 cbfDrop();
 if(scene!=='cb_transition')cbfSettleDrop();
 if(scene==='cb_dropped')reviewPlace(S4T.x+.7,S4T.y+2,-Math.PI/2-.3);
 if(['cb_carried','cb_water','cb_after'].includes(scene)){
  reviewPlace(35,33.1,Math.PI/2);Object.assign(S4T,{phase:'carried',pickups:1,x:player.x,y:player.y});weapon=3;
 }
 if(scene==='cb_water')s4tThrow();
 if(scene==='cb_after'){
  // Enter the actual aftermath through the same resolved state and gate code.
  CB.lureCommitted=true;CB.state='drowning';CB.x=35;CB.y=37;CB.sink=2.8;cbfDefeated();CB.t=2.1;cbfOpenGate(1);
  reviewPlace(43,24,-Math.PI/2);
 }
 msgT=feedT=0;cbSave();hudUpdate();audio.levels();
}
reviewScenes.cb_fight={label:'Cerberus — the complete fight',level:3,chapter:true,hint:'Normal conditions: damage on, finite ammo. The approved two-head fight now continues into a new last third. Read the heads, the fallen light and their reactions. T restores your starting checkpoint; B resets. For a calm test choose Explore; Combat drill keeps attacks but protects you.'};
reviewScenes.s4_departure.hint=reviewScenes.s4_departure.hint.replace('adds the music and active ambush without damage','adds the active ambush without damage. Ordinary fights stay music-free')+' This entry now continues through the expedition, Cerberus, the pond and the gates. Select Normal for a full playthrough.';
reviewScenes.s4_open.hint='Recovery finished. Follow the hedge walk into the garden, approach the guardian and finish Scene 4. Normal enables damage. Resources and cleared branch state survive the pre-boss retry.';
for(const [id,label,hint]of [
 ['cb_transition','Cerberus — the last-third transition','The little head has just lost its captive. Watch the drop, light and change from health to Frenzy. The drop has a short protected beat. Then the Chihuahua fires independently through the other attacks; Combat drill protects you, Normal enables damage.'],
 ['cb_frenzy','Cerberus — angry Chihuahua','Begin at the last third with the seraphim on the ground. The Chihuahua fires dense, gapped fans independently through the Shepherd and Bulldog attacks. The larger heads still alternate. There is no floor laser marker. Guns fill a stagger bar to create a brief opening. The bar is not more health to grind down.'],
 ['cb_dropped','Seraphim — recover under pressure','Close to the dropped light. Lift with E / touch LIFT. Slot 4 and FIRE throw; 1–3 return to guns. Land throws remain recoverable. Watch the little head pull toward the toy. Carrying it does not protect you in combat.'],
 ['cb_carried','Seraphim — the solution at the shore','Already carrying the seraphim near the hospital bay. Try land throws and different banks. Only an actual water landing commits the guardian. Watch the entire body reach the water; the score gives way to the plunge and night.'],
 ['cb_water','Cerberus — the throw and drowning','The seraphim is already in flight toward water. Watch the guardian reach the actual toy, the little head lower, bite and chew, then sink with it. The score must stop at the plunge, after retrieval. Pause and resume at any point. The gates release after the body sinks; step through the window and walk along the bridge to complete the chapter.'],
 ['cb_after','Garden gates — after the guardian','The water is still. Corrupted iron opens onto a living hellscape. Look through the window, strafe to see the bridge in depth, then walk through. Stop, turn around and walk back to the night if you wish. Continuing along the hell bridge completes the chapter. No score should restart, no invisible gate should block you and no other ending button is needed. The checkpoint repeats this aftermath entry.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

