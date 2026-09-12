// Phase 3: one authored expedition, with persistent branch and resource state.
// Quest snapshots live inside the departure checkpoint; scene replay is explicit.
const s4qFresh=()=>({on:false,keys:false,ext:false,fire:true,moved:false,gate:false,
 awake:0,parkClear:false,busClear:false,supplies:0,clock:0,steam:0,action:null,
 lastZone:'',visited:[],done:false,checkpointLabel:'COURTYARD CLEAR'});
const S4Q=s4qFresh();
const S4Q_KEYS={x:95.76,y:79.65},S4Q_EXT={x:137.08,y:5.36};
const S4Q_WALK=[[99.8,64],[104,58],[104,47],[103,38],[106,30],[107,21]];
const S4Q_GATE={x:104,y:56.5};
const S4Q_PARKED={x:66,y:42,a:0,alive:true};
const S4Q_CAST=[
 {x:87,y:68.2,type:1,group:0,branch:'park'},
 {x:91,y:68.6,type:0,group:0,branch:'park'},
 {x:95.1,y:74.1,type:2,group:1,branch:'park'},
 {x:99.2,y:72.9,type:0,group:1,branch:'park'},
 {x:86.9,y:74.1,type:1,group:1,branch:'park'},
 {x:94.8,y:82.2,type:0,group:2,branch:'park'},
 {x:99.1,y:81.9,type:2,group:2,branch:'park'},
 {x:91.7,y:82.8,type:1,group:2,branch:'park'},
 {x:132.6,y:13.4,type:2,group:3,branch:'bus'},
 {x:137.4,y:9.7,type:0,group:3,branch:'bus'},
 {x:132.9,y:7.4,type:1,group:4,branch:'bus'},
 {x:138.8,y:7.4,type:0,group:4,branch:'bus'}
];
const S4Q_SUPPLIES=[
 {x:63.9,y:49.2,label:'OPEN COURTYARD FIRST AID',hp:35,ammo:[4,18,1]},
 {x:98.9,y:76.1,label:'OPEN STAFF EMERGENCY SUPPLY',hp:25,ammo:[6,24,2]},
 {x:131.9,y:8.9,label:'OPEN ROADSIDE FIRST AID',hp:35,ammo:[4,18,1]}
];
function s4qReset(){Object.assign(S4Q,s4qFresh());$('questInventory').classList.add('hidden');audio.questStop?.();}
function s4qRunning(){return s4Running()&&S4D.on&&S4Q.on;}
function s4qSnapshot(){return {...S4Q,visited:[...S4Q.visited],action:null};}
function s4qSave(label){if(!s4qRunning()||S4Q.action||mode!=='playing')return;if(label)S4Q.checkpointLabel=label;s4dSave();}
function s4qBegin(){
 if(S4Q.on)return;
 Object.assign(S4Q,s4qFresh(),{on:true});review.done=false;s4qApplyGate();
 for(let i=0;i<S4Q_CAST.length;i++){
  const a=S4Q_CAST[i],e=spawn(a.x,a.y,a.type);e.s4Quest=a.branch;e.s4Group=a.group;e.s4QuestId=i;
  e.dormant=true;e.noticed=false;e.cd=1.4;e.vocal=4;e.phase=i*1.37;
 }
 s4qSave('COURTYARD CLEAR');feed('SPARE KEYS: STAFF CAR 04, PARKING.\nEXTINGUISHER: BUS SHELTER. CHOOSE YOUR ROUTE.');
}
function s4qWake(group){
 if(S4Q.awake&(1<<group))return;
 S4Q.awake|=1<<group;
 const actors=enemies.filter(e=>e.alive&&e.s4Quest&&e.s4Group===group);
 for(const e of actors){e.dormant=false;e.noticed=true;e.alertT=.5;e.cd=Math.max(e.cd,1.1);e.vocal=3.5;}
 if(actors.length&&audio.active)audio.creature(actors[0],true);
 if(group===0)feed('SOMETHING UNDER THE CARS.');
 if(group===3)feed('THE LAST SERVICE IS STILL HERE.');
}
function s4qThreats(){
 if(!s4qRunning())return [];
 return enemies.filter(e=>e.alive&&e.s4Quest&&!e.dormant&&Math.hypot(e.x-player.x,e.y-player.y)<19);
}
function s4qCombat(){return s4qRunning()&&!S4Q.action&&s4qThreats().length>0;}
function s4qProgress(){
 if(!s4qRunning())return;
 for(const [branch,key,label]of [['park','parkClear','PARKING CLEAR'],['bus','busClear','BUS ROAD CLEAR']]){
  if(!S4Q[key]&&!enemies.some(e=>e.alive&&e.s4Quest===branch)){
   S4Q[key]=true;feed(label+'\nTHE RETURN WALK WILL STAY QUIET.');
  }
 }
 s4qSave();
}
function s4qCanReach(p,range=2.3,cone=.9){
 const dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy);
 return d<range&&(d<.32||Math.abs(angle(Math.atan2(dy,dx)-player.a))<cone)&&
  (d<.25||s4CastRay(player.x,player.y,dx/d,dy/d,Math.max(0,d-.14)).d>=d-.15);
}
function s4qNearby(){
 if(!s4qRunning()||s4dLocked())return null;
 const q=[];
 if(!S4Q.keys)q.push({...S4Q_KEYS,kind:'keys',label:'TAKE AMBULANCE KEYS',touch:'KEYS'});
 if(!S4Q.ext)q.push({...S4Q_EXT,kind:'ext',label:'TAKE FIRE EXTINGUISHER',touch:'TAKE'});
 if(!S4Q.gate)q.push({x:S4Q_GATE.x,y:S4Q_GATE.y+(player.y>S4Q_GATE.y?.18:-.18),kind:'gate',label:'UNLATCH SERVICE WALK',touch:'OPEN'});
 S4Q_SUPPLIES.forEach((p,i)=>{if(!(S4Q.supplies&(1<<i)))q.push({...p,kind:'supply',index:i,touch:'SUPPLY'});});
 if(!S4Q.moved)q.push({x:61.72,y:43,kind:'wreck',label:S4Q.fire?(S4Q.ext?'EXTINGUISH ENGINE FIRE':'EXAMINE AMBULANCE'):(S4Q.keys?'START AND MOVE AMBULANCE':'EXAMINE AMBULANCE'),touch:S4Q.fire&&S4Q.ext?'DOUSE':!S4Q.fire&&S4Q.keys?'MOVE':'EXAMINE'});
 return q.filter(p=>s4qCanReach(p,p.kind==='wreck'?5:2.3)).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]||null;
}
function s4qInteract(){
 const p=s4qNearby();if(!p)return false;
 if(p.kind==='keys'||p.kind==='ext'){
  S4Q[p.kind]=true;audio.pickup();audio.play('shell',{vol:.23,rate:p.kind==='keys'?1.65:.65,wet:.06,pos:p});
  s4qSave(p.kind==='keys'?'AMBULANCE KEYS SECURED':'EXTINGUISHER SECURED');
  say(p.kind==='keys'?'AMBULANCE KEYS.':'FIRE EXTINGUISHER.',1.7);
  feed((S4Q.keys&&S4Q.ext?'BOTH ITEMS SECURED. RETURN TO THE WRECK.':p.kind==='keys'?'NEXT: THE BUS SHELTER EXTINGUISHER.':'NEXT: STAFF CAR 04 IN PARKING.')+'\nTHE SIGNED SERVICE WALK LINKS BOTH ROUTES.');
 }else if(p.kind==='gate'){
  S4Q.gate=true;s4qApplyGate();audio.play('environment0',{vol:.42,rate:1.1,pos:p,wet:.08});s4qSave('SERVICE WALK UNLATCHED');feed('SERVICE WALK OPEN\nPARKING ↔ CITY ROAD');
 }else if(p.kind==='supply'){
  const supply=S4Q_SUPPLIES[p.index];
  if(player.hp>=100&&guns.every(g=>g.reserve>=g.maxReserve)){feed('YOU ARE FULLY SUPPLIED. LEAVE IT FOR THE RETURN.');return true;}
  S4Q.supplies|=1<<p.index;player.hp=Math.min(100,player.hp+supply.hp);
  guns.forEach((g,i)=>g.reserve=Math.min(g.maxReserve,g.reserve+supply.ammo[i]));
  audio.pickup();s4qSave('EMERGENCY SUPPLY USED');feed('FIRST AID +'+supply.hp+' · AMMUNITION\nONE USE. THE EMPTY CASE STAYS EMPTY.');
 }else if(p.kind==='wreck'){
  if(S4Q.fire&&!S4Q.ext)feed('ENGINE FIRE. CANNOT GET INSIDE.\nEXTINGUISHER AT THE BUS SHELTER.\nSPARE KEYS IN STAFF CAR 04, PARKING.');
  else if(!S4Q.fire&&!S4Q.keys)feed('THE FIRE IS OUT. IGNITION LOCKED.\nSPARE KEYS IN STAFF CAR 04, PARKING.');
  else if(enemies.some(e=>e.alive&&!e.dormant&&Math.hypot(e.x-64,e.y-43)<17)||bullets.some(b=>b.owner==='enemy'&&Math.hypot(b.x-player.x,b.y-player.y)<15))feed('CLEAR THE NEARBY THREATS FIRST.');
  else s4qStartAction(S4Q.fire?'extinguish':'move');
 }
 hudUpdate();return true;
}
function s4qVehicleBox(v){
 const c=Math.abs(Math.cos(v.a)),s=Math.abs(Math.sin(v.a)),hx=c*2.25+s*1.35,hy=s*2.25+c*1.35;
 return{x0:v.x-hx,x1:v.x+hx,y0:v.y-hy,y1:v.y+hy,kind:'ambulance'};
}
function s4qNavigation(){
 for(let y=38;y<=45;y++)for(let x=56;x<=75;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 buildFlow();
}
function s4qApplyVehicle(){
 S4.solids=S4.solids.filter(b=>b.kind!=='ambulance');
 if(S4Q.moved)S4D.vehicle={...S4Q_PARKED};
 S4.solids.push(s4qVehicleBox(S4D.vehicle));s4qNavigation();
}
function s4qMovePosition(t){
 // Reverse straight out of the crushed hedge, then steer into the wider court edge.
 const progress=s4dEase(t);
 if(progress<.54)return{x:mix(59.2,64.7,progress/.54),y:43,a:0,alive:true};
 const v=(progress-.54)/.46,u=1-v;
 const x=u*u*u*64.7+3*u*u*v*65+3*u*v*v*65.1+v*v*v*66;
 const y=u*u*u*43+3*u*u*v*43+3*u*v*v*42+v*v*v*42;
 const dx=3*u*u*.3+6*u*v*.1+3*v*v*.9,dy=6*u*v*(-1);
 return{x,y,a:Math.atan2(dy,dx),alive:true};
}
function s4qStartAction(kind){
 s4qSave();S4Q.action={kind,origin:{x:player.x,y:player.y,a:player.a}};
 releaseInputs();player.vx=player.vy=0;shotCD=reloadT=reloadDuration=dashT=meleeT=muzzle=recoil=0;
 if(kind==='move')reviewPlace(64,47,-2.29);
 s4dPhase(kind);audio.questAction(kind);hudUpdate();
}
function s4qActionFinish(){
 if(!S4Q.action)return false;
 const kind=S4Q.action.kind;
 if(kind==='extinguish'){S4Q.fire=false;S4Q.steam=3;audio.questFireOut();}
 else{S4Q.moved=true;S4D.door=0;s4qApplyVehicle();audio.questVehicleStop();}
 S4Q.action=null;S4D.safeT=1.1;releaseInputs();player.vx=player.vy=0;weaponDrop=.2;
 s4dPhase('aftermath');s4qSave(kind==='extinguish'?'ENGINE FIRE EXTINGUISHED':'GARDEN PATH OPEN');
 say(kind==='extinguish'?'THE FIRE IS OUT.':'THE WAY IS OPEN.',1.8);
 feed(kind==='extinguish'?(S4Q.keys?'USE THE KEYS TO MOVE THE AMBULANCE.':'FIND THE SPARE KEYS IN STAFF CAR 04.'):'FOLLOW THE LIVING HEDGE TO THE GARDEN.');return true;
}
function s4qFireAmount(){return !S4D.crashed?0:!S4Q.on?1:!S4Q.fire?0:S4Q.action?.kind==='extinguish'?1-s4dEase((S4D.t-.75)/3.2)*.98:1;}
function s4qTick(dt){
 if(!s4qRunning()||mode!=='playing')return;
 S4Q.clock+=dt;S4Q.steam=Math.max(0,S4Q.steam-dt);
 if(S4Q.action){
  if(S4Q.action.kind==='move'){
   S4D.door=1-s4dEase(S4D.t/.55);S4D.vehicle=s4qMovePosition((S4D.t-.65)/4.6);
   S4.solids=S4.solids.filter(b=>b.kind!=='ambulance');S4.solids.push(s4qVehicleBox(S4D.vehicle));
   player.a=mix(-2.29,Math.atan2(S4D.vehicle.y-player.y,S4D.vehicle.x-player.x),s4dEase(S4D.t/1.4));
   if(S4D.t>=5.6)s4qActionFinish();
  }else{
   const o=S4Q.action.origin,p=s4dEase(S4D.t/.7);
   player.x=mix(o.x,64,p);player.y=mix(o.y,47,p);player.a=o.a+angle(-2.29-o.a)*p;player.vx=player.vy=0;
   if(S4D.t>=4.15)s4qActionFinish();
  }
  return;
 }
 for(const e of enemies){
  if(!e.alive||!e.s4Quest||!e.dormant||e.s4Group===4)continue;
  const d=Math.hypot(e.x-player.x,e.y-player.y);
  if(d<(e.s4Quest==='park'?8:12)&&lineOfSight(e.x,e.y,player.x,player.y))s4qWake(e.s4Group);
 }
 // The second bus pair leaves cover only when the player commits to the shelter.
 if(player.x>130&&player.y<10.3)s4qWake(4);
 const zone=s4Zone();
 if(zone!==S4Q.lastZone){S4Q.lastZone=zone;if(!S4Q.visited.includes(zone))S4Q.visited.push(zone);s4qSave();}
 if(S4Q.moved&&!S4Q.done&&player.x<51&&player.y<35){
  S4Q.done=true;review.done=false;s4qSave('GARDEN FIELD REACHED');say('SOMETHING GUARDS THE GATES.',2);
 }
 if(S4Q.done&&!CB.on)cbfJourneyBegin();
}
function s4qHud(){
 const active=s4qRunning();$('questInventory').classList.toggle('hidden',!active);if(!active)return;
 $('questKeys').textContent=(S4Q.keys?'✓ ':'○ ')+'KEYS';$('questExt').textContent=(S4Q.ext?'✓ ':'○ ')+'EXTINGUISHER';
 $('questKeys').classList.toggle('found',S4Q.keys);$('questExt').classList.toggle('found',S4Q.ext);
 const near=s4qNearby(),sign=s4dLocked()?null:s4NearbyLabel(),threats=s4qThreats();
 let goal=S4Q.moved?'FOLLOW THE HEDGE WALK TO THE GARDEN':S4Q.keys&&S4Q.ext?'RETURN TO THE AMBULANCE':S4Q.keys?'FIND THE BUS SHELTER EXTINGUISHER':S4Q.ext?'FIND STAFF CAR 04 · PARKING':'KEYS IN PARKING · EXTINGUISHER AT BUS STOP';
 if(S4Q.done)goal='THE GUARDIAN BLOCKS THE GATES';
 if(S4Q.action)goal=(S4Q.action.kind==='extinguish'?'EXTINGUISHING ENGINE FIRE':'CLEARING THE GARDEN WALK')+' · '+Math.min(100,Math.floor(S4D.t/(S4Q.action.kind==='extinguish'?4.15:5.6)*100))+'%';
 $('goal').textContent=near?'[E] '+near.label:sign?'[E] '+sign.interact:goal;
 $('lifeHint').textContent=threats.length?(review.active&&!review.damage?'PROTECTED':'KILL TO RESTORE'):'TAKE A BREATH';
 $('touchUse').classList.toggle('hidden',!near&&!sign);$('touchUse').textContent=near?near.touch:'READ';
 // Guide along roads, never straight through the dense forest.
 let target,label;
 if(S4Q.moved){target={x:56.5,y:39};label='GARDEN';if(player.x<57&&player.y<40)target={x:43,y:26};}
 else if(S4Q.keys&&S4Q.ext){target={x:64,y:43};label='WRECK';}
 else if(player.x>80&&player.y>61&&!S4Q.keys){target=S4Q_KEYS;label='STAFF 04';}
 else if(player.x>130&&player.y<18&&!S4Q.ext){target=S4Q_EXT;label='SHELTER';}
 else{target=null;label=S4Q.keys?'BUS ROAD':S4Q.ext?'PARKING':'CHOOSE A ROUTE';}
 $('compassText').textContent=label;$('compassArrow').style.visibility=target?'visible':'hidden';
 if(target){
  let p=target;
  // A landmark arrow is useful only while the landmark is visible. The physical
  // road signs guide the long woodland legs, without pointing through tree walls.
  if(!lineOfSight(player.x,player.y,target.x,target.y)){p=null;$('compassText').textContent='FOLLOW THE SIGNS';}
  $('compassArrow').style.visibility=p?'visible':'hidden';if(p)$('compassArrow').style.transform='rotate('+angle(Math.atan2(p.y-player.y,p.x-player.x)-player.a)+'rad)';
 }
 if(review.active){$('reviewBarText').textContent='NO WAY OUT · '+(S4Q.done?'GARDEN APPROACH OPEN':S4Q.action?'AMBULANCE RECOVERY':'TWO WAYS FORWARD');$('reviewStatus').textContent='T CONTROLS · B REPLAY · '+(review.damage?'DAMAGE ON':'PROTECTED')+(S4Q.done?' · THE GUARDIAN WAITS':'');}
}
function s4qReview(scene){
 if(!['s4_quest','s4_keys','s4_extinguisher','s4_recovery','s4_open'].includes(scene))return;
 Object.assign(S4D,{on:true,carry:s4dCapture(),phase:'aftermath',door:1,wave:2,spawned:31,safeT:1.8});s4dPlaceWreck();s4qBegin();
 const poses={s4_quest:[64,47,-1.57],s4_keys:[84,63,1.02],s4_extinguisher:[129.8,17,-.82],s4_recovery:[63.8,43,Math.PI],s4_open:[56.5,40,-Math.PI/2]};
 reviewPlace(...poses[scene]);
 if(scene==='s4_recovery'||scene==='s4_open'){
  enemies=[];S4Q.keys=S4Q.ext=S4Q.parkClear=S4Q.busClear=S4Q.gate=true;S4Q.awake=31;s4qApplyGate();
 }
 if(scene==='s4_open'){S4Q.fire=false;S4Q.moved=true;S4D.door=0;s4qApplyVehicle();}
 msgT=feedT=0;s4qSave('PHASE 3 REVIEW START');hudUpdate();
}
for(const [id,label,hint]of [
 ['s4_quest','Recovery expedition — either order','The courtyard is already clear. Find the keys in marked staff car 04 and the extinguisher inside the bus shelter. Either order works. E or the contextual touch button picks up, opens and operates. The service walk connects the two branches.'],
 ['s4_keys','Parking — the spare keys','At the parking entrance. Eight creatures in three local groups, car cover and a clearly marked staff vehicle. Kill or evade them. Clearances and supplies persist. Look for the service walk at the northeast corner.'],
 ['s4_extinguisher','Bus station — emergency cabinet','Near the final road bend. Four creatures, exposed sightlines and shelter cover. The extinguisher sits in the red cabinet inside the shelter. The signed service walk on the return road leads to parking.'],
 ['s4_recovery','Ambulance — douse and move','Both items already carried and all branch enemies cleared. Face the rear of the wreck: E extinguishes the engine, then E starts the reverse out of the garden entrance. Pause during either action. Check the clear path and the parked vehicle collision.'],
 ['s4_open','Garden — after the recovery','Wreck already moved, both branches clear. Follow the hedge walkway into the garden field and inspect the open route. The separate Seraphim review scenes now test the toy calmly; Cerberus combat is still a later phase.']
 ])reviewScenes[id]={label,level:3,chapter:true,hint};

