// One actor and health pool. Phase 6 changes the last third into a frenzy:
// guns stagger the guardian; the captive seraphim supplies the way through.
const CB_MAX=7200,CB_STOP=CB_MAX/3,CB_RADIUS=1.55;
const cbFresh=()=>({on:false,alive:true,state:'waiting',x:43,y:24.5,a:Math.PI/2,
 hp:CB_MAX,trail:CB_MAX,clock:0,t:0,attack:null,cooldown:2.2,cycle:0,
 hurt:0,voiceAt:3,stepAt:0,walk:0,shots:0,beams:0,blocked:0,hitCue:0,
 practice:'both',beamSide:1,checkpoint:null,toyDropped:false,stagger:0,staggerMeter:0,
 staggerLast:0,tug:0,route:[],routeIndex:0,lureCommitted:false,sink:0,
 waterPulse:0,gateProgress:0,rewarded:false,completed:false,roomWait:0,roomHint:0,dropFrom:null,dropTo:null,
 toyHeld:false,retrieveToy:null,sinkAt:null,retrieveFacing:0,retrieveTurn:0,chewCue:0,yap:null,yapCD:.6,yapCycle:0,yapFlash:0});
const CB=cbFresh();
function cbRunning(){return s4Running()&&CB.on;}
function cbAI(){return !review.active||review.ai;}
function cbFighting(){return cbRunning()&&['active','frenzy'].includes(CB.state);}
function cbPressure(){return cbFighting()&&cbAI()&&mode==='playing';}
function cbScoreWanted(){return cbRunning()&&cbAI()&&(!review.active||review.music)&&['active','transition','frenzy','fetch','retrieve'].includes(CB.state);}
function cbIntensity(){return clamp((CB_MAX-CB.hp)/(CB_MAX-CB_STOP),0,1);}
function cbReset(){
 audio.cerberusStop?.();Object.assign(CB,cbFresh());
 document.body.classList.remove('cerberus-fight','cerberus-frenzy');
}
function cbBodyFree(x,y,r=.19){return !cbRunning()||!CB.alive||Math.hypot(x-CB.x,y-CB.y)>=CB_RADIUS+r;}
function cbHead(kind){
 // Attack and audio origins follow the same directional neck/muzzle anchors
 // as the artwork, rather than an unrelated floating point above the body.
 const p=cbAttachment(kind),across=p.pose===2?(p.flip?-.24:.24)*p.height:0;
 return{x:p.x-Math.sin(player.a)*across,y:p.y+Math.cos(player.a)*across,
  z:p.z+p.height*(kind==='shepherd'?.55:kind==='bulldog'?.50:.48),alive:true};
}
function cbCancelAttack(){
 CB.attack=CB.yap=null;CB.yapCD=.8;for(const q of bullets)if(q.cb)q.cancelled=true;
 audio.cerberusBeamStop?.();
 audio.cerberusChargeStop?.();
}
function cbAwaken(){
 if(!cbRunning()||CB.state!=='waiting')return;
 CB.state='waking';CB.t=0;CB.cooldown=.85;audio.cerberusCue('wake');
 feed('THREE THROATS. ONE WOUND.');hudUpdate();
}
function cbRay(x,y,dx,dy,limit){
 if(!cbRunning()||!CB.alive||CB.state==='boundary')return null;
 const ex=CB.x-x,ey=CB.y-y,along=ex*dx+ey*dy,cross=ex*dy-ey*dx,r=CB_RADIUS;
 if(Math.abs(cross)>r)return null;
 const d=Math.max(.015,along-Math.sqrt(r*r-cross*cross));
 if(along+r<.01||d>limit)return null;
 const wallHit=s4CastRay(x,y,dx,dy,limit);
 if(wallHit.d+.025<d)return null;
 return{d,x:x+dx*d,y:y+dy*d,z:.86,cerberus:true};
}
function cbProjectileContact(q,dx,dy){
 const len=Math.hypot(dx,dy);if(!len)return null;
 return cbRay(q.x,q.y,dx/len,dy/len,len+q.r);
}
function cbExplosion(q){
 if(q.owner!=='player'||!cbRunning()||CB.state==='boundary')return;
 if(q.cbHit){cbDamage(q.damage,q.cbHit,q.kind);return;}
 if(q.kind!=='grave')return;
 const d=Math.hypot(q.x-CB.x,q.y-CB.y),edge=Math.max(0,d-CB_RADIUS);
 if(edge>=2.65)return;
 const dx=(CB.x-q.x)/(d||1),dy=(CB.y-q.y)/(d||1),hit=s4CastRay(q.x,q.y,dx,dy,edge+.03);
 if(hit.d+.025<edge)return;
 cbDamage(q.damage*clamp(1-edge/2.65,.2,1),{x:CB.x-dx*CB_RADIUS,y:CB.y-dy*CB_RADIUS,z:.7},'grave');
}
function cbDamage(amount,p,kind){
 if(!cbRunning()||!['waiting','waking','active','frenzy'].includes(CB.state)||!Number.isFinite(amount)||amount<=0)return false;
 if(CB.state==='waiting')cbAwaken();
 if(CB.state==='frenzy')cbfStagger(amount*mods.damage);
 else if(!(review.active&&review.holdBoss))CB.hp=Math.max(CB_STOP,CB.hp-amount*mods.damage);
 CB.hurt=.19;hitmarker=.15;emit(p.x,p.y,p.z||.8,'#fb246c',kind==='grave'?24:9,kind==='grave'?1.15:.65);
 if(CB.clock>=CB.hitCue){CB.hitCue=CB.clock+.13;audio.cerberusCue('hit',p,kind==='grave'?1:.5);}
 if(CB.hp<=CB_STOP&&!CB.toyDropped&&CB.practice==='both'){cbfDrop();}
 else if(CB.hp<=CB_STOP&&CB.practice!=='both'){
  CB.state='boundary';CB.t=0;cbCancelAttack();audio.cerberusStop();
  review.done=true;CB.trail=CB.hp;hitstop=0;shake=Math.min(shake,2);
  // No score, clear flag, end screen, toy pickup or gate mutation here.
  feed('HEAD PRACTICE COMPLETE.\nT → CERBERUS: THE COMPLETE FIGHT FOR THE LAST THIRD.');
 }
 hudUpdate();return true;
}
function cbPlayerSweep(a,b){
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.12));
 for(let i=0;i<=n;i++)if(!fits(mix(a.x,b.x,i/n),mix(a.y,b.y,i/n),.24))return false;
 return true;
}
function cbBeamDistance(b,p){
 const along=(p.x-b.x)*b.dx+(p.y-b.y)*b.dy;
 if(along<0||along>b.length)return Infinity;
 return Math.abs((p.x-b.x)*b.dy-(p.y-b.y)*b.dx);
}
function cbBeamFrame(b,progress){
 // The whole sweep commits before charging. It never retargets the player.
 const a=b.aim+b.arc*(progress*2-1)*b.side;
 b.dx=Math.cos(a);b.dy=Math.sin(a);
 b.length=Math.max(0,Math.min(23,s4CastRay(b.x,b.y,b.dx,b.dy,23).d-.06));
 return b;
}
function cbPlanBeam(){
 const m=cbHead('bulldog'),d=Math.hypot(player.x-m.x,player.y-m.y);
 if(d<3.2||d>20)return null;
 const a=Math.atan2(player.y-m.y,player.x-m.x),rx=-Math.sin(a),ry=Math.cos(a),arc=Math.atan2(1.65,d);
 for(const side of [CB.beamSide,-CB.beamSide]){
  const b=cbBeamFrame({x:m.x,y:m.y,z:.62,endZ:.52,aim:a,arc,width:.22,side,safe:null},0);
  if(b.length<d-1.5)continue;
  // Walk behind the starting edge during the charge. Verify the whole path
  // and all sweep angles; the lake, hedges and body can never steal this exit.
  for(const turn of [0,-.35,.35,-.7,.7]){
   const angle=a-side*Math.PI/2+turn,p={x:player.x+Math.cos(angle)*3.0,y:player.y+Math.sin(angle)*3.0};
   if(!cbPlayerSweep(player,p))continue;
   let clear=true;for(let n=0;n<=12;n++){const frame=cbBeamFrame({...b},n/12);if(cbBeamDistance(frame,p)<.82){clear=false;break;}}
   if(!clear)continue;
   if(CB.practice==='both'){const m0=cbHead('shepherd'),sx=player.x-m0.x,sy=player.y-m0.y,sl=Math.hypot(sx,sy)||1;
    if(Math.abs((p.x-m0.x)*sy-(p.y-m0.y)*sx)/sl<.85)continue;
   }
   b.safe=p;b.safeFrom={x:player.x,y:player.y};
   if(!cbfBeamEscapeClear(b))continue;
   CB.beamSide=-side;return b;
  }
 }
 return null;
}
function cbStartAttack(kind){
 if(kind==='yap')return cbfStartYap();
 if(!cbPressure()||CB.attack)return false;
 if(kind==='beam'){
  // The little head never waits for this turn. Existing and future small
  // bolts leave one feasible walking escape from the committed beam sweep.
  if(bullets.some(q=>q.cb&&!q.cbYap&&!q.cancelled))return false;
  const beam=cbPlanBeam();if(!beam){CB.blocked++;CB.cooldown=.55;return false;}
  CB.attack={kind:'beam',t:0,windup:1.1,duration:1.35,fired:false,beam,
   assist:CB.state!=='frenzy'&&CB.practice==='both'&&CB.hp<CB_MAX*.78?{target:{x:player.x,y:player.y},sent:0,done:false,fixed:true}:null};
  audio.cerberusCharge();return true;
 }
 const m=cbHead('shepherd'),d=Math.hypot(player.x-m.x,player.y-m.y);
 if(d<1.1||d>20||s4CastRay(m.x,m.y,(player.x-m.x)/d,(player.y-m.y)/d,d).d<d-.35)return false;
 const count=CB.hp<CB_MAX*.62?5:4;
 CB.attack={kind:'salvo',t:0,windup:.62,duration:(count-1)*.25+.24,fired:false,sent:0,count,target:{x:player.x,y:player.y}};
 audio.cerberusCue('snarl',m);return true;
}
function cbSalvoShot(a){
 if(!a.fixed)a.target={x:player.x,y:player.y};
 const m=cbHead('shepherd'),direction=Math.atan2(a.target.y-m.y,a.target.x-m.x)+(a.fixed?0:(a.sent%2?1:-1)*.045);
 bullets.push({x:m.x,y:m.y,z:m.z,cbZ0:m.z,cbTravel:0,cbTargetD:Math.max(1,Math.hypot(a.target.x-m.x,a.target.y-m.y)),a:direction,speed:7.2+cbIntensity(),damage:19,kind:'cerberus',cb:true,
  life:3.2,r:.20,owner:'enemy',color:'#ff4a86'});
 a.sent++;CB.shots++;audio.cerberusCue('spit',m);emit(m.x,m.y,m.z,'#ff526f',5,.45);
}
function cbMove(dt){
 if(CB.attack||!cbFighting()||!cbAI()||review.active&&review.scene==='cb_inspect')return;
 const dx=player.x-CB.x,dy=player.y-CB.y,d=Math.hypot(dx,dy);
 // A slow, weighty advance leaves room to circle and never pursues into the
 // estate corridors. Check the whole circular footprint, not its centre.
 if(d<5.4||d>18)return;
 const speed=.95+cbIntensity()*.35,nx=CB.x+dx/d*speed*dt,ny=CB.y+dy/d*speed*dt;
 if(nx<35||nx>50||ny<22||ny>32||!s4tProxyFree(nx,ny))return;
 CB.x=nx;CB.y=ny;CB.walk+=dt;
 if(CB.clock>CB.stepAt){CB.stepAt=CB.clock+.85;audio.cerberusCue('step',CB);}
}
function cbTick(dt){
 if(!cbRunning()||mode!=='playing')return;
 CB.clock+=dt;CB.t+=dt;CB.hurt=Math.max(0,CB.hurt-dt);CB.trail=mix(CB.trail,CB.hp,1-Math.exp(-dt*4));
 CB.tug=Math.max(0,CB.tug-dt);
 if(cbfTick(dt))return;
 if(CB.state==='boundary')return;
 const dx=player.x-CB.x,dy=player.y-CB.y,d=Math.hypot(dx,dy);
 if(!CB.attack&&!(review.active&&review.scene==='cb_inspect'))CB.a=angle(CB.a+clamp(angle(Math.atan2(dy,dx)-CB.a),-dt*.72,dt*.72));
 if(CB.state==='waiting'&&d<11&&s4CastRay(player.x,player.y,-dx/d,-dy/d,d).d>d-1.6)cbAwaken();
 if(CB.state==='waking'&&CB.t>=2.2){CB.state='active';CB.t=0;}
 if(!cbAI()){cbCancelAttack();CB.cooldown=Math.max(1.2,CB.cooldown);return;}
 if(!cbFighting())return;
 cbfYapTick(dt);
 cbMove(dt);
 if(CB.clock>=CB.voiceAt){CB.voiceAt=CB.clock+5.8;audio.cerberusCue('breath',cbHead('bulldog'));}
 const a=CB.attack;
 if(a){
  a.t+=dt;
  if(a.kind==='salvo'){
   while(a.sent<a.count&&a.t>=a.windup+a.sent*.25)cbSalvoShot(a);
  }else{
   // Coordination arrives after the player has seen both heads separately.
   // The extra shot commits to the old position, leaving the proven exit.
   if(a.assist&&!a.assist.done&&a.t>=.4){cbSalvoShot(a.assist);a.assist.done=true;}
   if(a.t>=a.windup&&!a.fired){a.fired=true;CB.beams++;cbBeamRelease(a);audio.cerberusBeam(a.beam);}
   if(a.fired)cbBeamFrame(a.beam,clamp((a.t-a.windup)/a.duration,0,1));
   if(a.fired&&!a.hit&&a.t<=a.windup+a.duration&&cbBeamDistance(a.beam,player)<a.beam.width+.24){
    const hp=player.hp;
    hurtPlayer(27,'The Bulldog lowers its head before a low sweep. Move behind its starting side, or dash through the beam.');
    // One contact per sweep, independent of frame rate or pain cooldown.
    if(player.hp<hp)a.hit=true;
   }
  }
  if(a.t>=a.windup+a.duration){CB.attack=null;CB.cooldown=CB.state==='frenzy'?.82:(a.kind==='beam'?.8:.72)-cbIntensity()*.22;CB.cycle++;audio.cerberusBeamStop();}
 }else{
  CB.cooldown-=dt;
  if(CB.cooldown<=0){
   const kind=CB.practice==='bulldog'?'beam':CB.practice==='shepherd'?'salvo':CB.cycle%2?'beam':'salvo';
   if(!cbStartAttack(kind)){CB.cooldown=CB.state==='frenzy'&&kind==='beam'?.12:.5;
    if(kind==='beam'&&CB.state!=='frenzy'&&CB.practice==='both'&&!bullets.some(q=>q.cb&&!q.cbYap&&!q.cancelled))cbStartAttack('salvo');
   }
  }
 }
 audio.cerberusTick();
}
function cbSave(){
 CB.checkpoint={scene:review.scene,carry:s4dCapture(),player:{...player},pose:{x:CB.x,y:CB.y,a:CB.a},stageTime};
 reviewSync();
}
function cbRestore(){
 const c=CB.checkpoint;if(!c)return false;
 if(c.journey){S4D.checkpoint=c.journey;s4dRestore();cbfJourneyBegin();CB.checkpoint=c;hudUpdate();return true;}
 reviewLoad(c.scene);s4dCarry(c.carry);Object.assign(player,c.player);Object.assign(CB,c.pose);
 _safeX=player.x;_safeY=player.y;stageTime=c.stageTime;CB.checkpoint=c;
 releaseInputs();hudUpdate();feed('PRE-BOSS CHECKPOINT RESTORED.');return true;
}
function cbReview(scene){
 if(!scene.startsWith('cb_'))return;
 Object.assign(CB,cbFresh(),{on:true,practice:scene==='cb_shepherd'?'shepherd':scene==='cb_bulldog'?'bulldog':'both'});
 enemies=[];drops=[];bullets=[];review.unlimited=false;
 reviewPlace(43,33,-Math.PI/2);
 if(scene==='cb_arrival')reviewPlace(47.5,32.5,-1.95);
 if(scene==='cb_inspect'){reviewPlace(43,30.3,-Math.PI/2);review.ai=false;review.damage=false;review.music=false;CB.state='active';}
 else if(scene!=='cb_arrival'){CB.state='waking';CB.t=0;CB.cooldown=.85;audio.cerberusCue('wake');}
 guns[0].reserve=48;guns[1].reserve=144;guns[2].reserve=9;
 if(scene==='cb_threshold'){
  // Exercise the actual damaging-hit transition, not an already-dropped toy.
  CB.state='active';CB.hp=CB.trail=CB_STOP+85;CB.cooldown=.9;
  const volley={target:{x:player.x,y:player.y},sent:0,fixed:true};
  for(let i=0;i<3;i++)cbSalvoShot(volley);
 }
 msgT=feedT=0;cbSave();hudUpdate();audio.levels();
}
function cbHud(){
 if(!hudComposing){hudUpdate();return;}
 if(!cbRunning())return;
 if(cbfHud())return;
 const visible=mode!=='menu',pct=CB.hp/CB_MAX*100;
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);document.body.classList.add('cerberus-fight');
 $('bossHud').classList.remove('boss-dead');$('bossHud').setAttribute('aria-label','Cerberus boss');$('bossTitle').textContent='CERBERUS';
 $('bossMeter').setAttribute('aria-label','Cerberus shared health');$('bossMeter').setAttribute('aria-valuenow',Math.round(pct));
 $('bossFill').style.width=pct+'%';$('bossTrail').style.width=(CB.trail/CB_MAX*100)+'%';$('bossHealth').textContent=Math.round(pct)+'%';
 $('bossState').textContent=CB.state==='boundary'?'REVIEW COMPLETE':!cbAI()?'INSPECTION':CB.attack?.kind==='beam'?(CB.attack.fired?'WHITEOUT':'BEAM CHARGING'):CB.attack?'SHEPHERD SALVO':CB.state==='waking'?'THREE THROATS':'THE GATEKEEPER';
 $('goal').textContent=CB.state==='boundary'?'HEAD PRACTICE COMPLETE · T FOR THE FULL FIGHT':!cbAI()?'INSPECT CERBERUS · T FOR COMBAT CONDITIONS':'BREAK THE GUARDIAN · TWO HEADS ARE HUNTING';
 $('compassText').textContent='CERBERUS';$('compassArrow').style.transform='rotate('+angle(Math.atan2(CB.y-player.y,CB.x-player.x)-player.a)+'rad)';
 $('lifeHint').textContent=!review.active||review.damage?'STAY MOBILE':'PROTECTED';
 $('reviewBarText').textContent='CERBERUS · '+(CB.state==='boundary'?'LAST THIRD / REVIEW COMPLETE':cbAI()?'TWO-HEAD COMBAT':'CIRCLE + INSPECT')+' · '+(!review.active||review.damage?'DAMAGE ON':'PROTECTED')+' / '+(review.unlimited?'AMMO REFILL':'FINITE AMMO');
}
for(const [id,label,hint]of [
 ['cb_threshold','Cerberus — just before one-third health','Quick freeze-fix check. Start just above 33% with enemy shots already in flight. Use Combat drill for protected testing. Fire weapon 2 or 3 until the toy drops, keep moving through the frenzy, then pause and resume. B repeats this exact starting point.'],
 ['cb_fight','Cerberus — two-head boss review','Start here with Normal conditions to judge the fight: damage on, finite ammo. Combat drill protects health for practice. The Shepherd re-aims each bolt; the Bulldog lowers its head and sweeps a low white beam. Pressure increases as health falls. At 33% the review stops safely. T restores the pre-boss checkpoint; B resets.'],
 ['cb_arrival','Cerberus — first sight at the gates','Approach the guardian. Notice three breeds fused to one body, its weight, and the tiny head chewing its captive light. Combat drill activates the two attacking heads; Explore lets you approach calmly.'],
 ['cb_shepherd','Cerberus — Shepherd salvo practice','Only the Shepherd attacks. Its throat and jaw warn before four staggered bolts, increasing to five later. Each shot aims when released; keep moving. Finite ammo; Combat drill protects health, Normal enables damage.'],
 ['cb_bulldog','Cerberus — Bulldog beam practice','Only the Bulldog attacks. Read the lowered head, white throat and rising growl: there is no marked floor lane. A low beam sweeps across where you stood. Move behind its starting side during the charge or dash through it. Try shore and cover; the committed sweep never follows you.'],
 ['cb_inspect','Cerberus — calm creature inspection','AI and damage off. Walk around the whole body and inspect each breed, stitched necks, breathing and the Chihuahua chewing the seraphim. This scene holds its heading so you can see its sides and rear. T can enable combat again.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

