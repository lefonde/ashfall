// Phase 4 is a protected fixture, not an early activation of the campaign boss.
// The canonical object owns every location. Guns remain exactly three guns.
const S4T_ITEM={name:'WOUNDED SERAPHIM',color:'#efdb9e',rgb:[239,219,158],ammo:'',reserve:''};
const s4tFresh=()=>({on:false,phase:'ground',x:40.2,y:29.3,z:.27,vx:0,vy:0,vz:0,
 clock:0,flight:0,settle:0,returnT:0,throwT:0,gunReturnT:0,throwLatch:false,previousGun:0,
 origin:{x:42,y:31},safe:{x:40.2,y:29.3},facing:0,
 pickups:0,lands:0,waters:0,returns:0,voiceAt:2.8,proxy:null});
const S4T=s4tFresh();
const S4T_RUNTIME={checkpoint:null,obstacles:[],nav:null};
function s4tRunning(){return s4Running()&&S4T.on;}
function s4tCarried(){return s4tRunning()&&S4T.phase==='carried';}
function equippedItem(){return weapon===3?S4T_ITEM:guns[weapon];}
function s4tReset(){
 if(weapon===3)weapon=S4T.previousGun;
 Object.assign(S4T,s4tFresh());Object.assign(S4T_RUNTIME,{checkpoint:null,obstacles:[],nav:null});
 document.body.classList.remove('seraphim-held');$('slot3').classList.add('hidden');touchSetLabel('touchFire','FIRE');
 audio.seraphimStop?.();
}
function s4tEquip(){
 if(!s4tCarried()){if(s4tRunning())feed('THE SERAPHIM IS NOT IN YOUR HANDS. FOLLOW ITS LIGHT.');return false;}
 changeWeapon(3);return true;
}
function s4tNear(){
 return s4tRunning()&&S4T.phase==='ground'&&s4qCanReach(S4T,2.35,1.0);
}
function s4tInteract(){
 if(!s4tNear())return false;
 S4T.previousGun=weapon<3?weapon:S4T.previousGun;S4T.phase='carried';S4T.pickups++;
 S4T.throwT=0;S4T.gunReturnT=0;S4T.returnT=0;S4T.proxy&&(S4T.proxy.phase='idle');
 reloadT=reloadDuration=muzzle=meleeT=0;changeWeapon(3);audio.seraphimCue('lift');
 feed('STILL ALIVE.\n4 TO HOLD · FIRE TO THROW · 1–3 FOR GUNS');cbfToyReaction('lift');hudUpdate();return true;
}
function s4tThrow(){
 if(!s4tCarried()||mode!=='playing'||S4T.throwLatch||shotCD>0)return false;
 const a=player.a,pitch=clamp(aimPitch/H,-.1,.1);
 S4T.origin={x:player.x,y:player.y};S4T.safe={...S4T.origin};
 Object.assign(S4T,{phase:'airborne',x:player.x,y:player.y,z:.72,
  vx:Math.cos(a)*8.2,vy:Math.sin(a)*8.2,vz:3.15+pitch*7,
  facing:a,flight:0,throwT:.32,gunReturnT:1.35,throwLatch:true,returnT:0});
 mouseFire=false;keys.KeyF=false;reloadT=reloadDuration=recoil=muzzle=0;shotCD=.5;
 audio.seraphimCue('throw');hudUpdate();return true;
}
function s4tReleaseTrigger(){S4T.throwLatch=false;}
function s4tBuildCollision(){
 // Recover actual top heights from the existing geometry without changing it.
 const bounds=S4.faces.map(f=>({x0:Math.min(...f.points.map(p=>p[0])),x1:Math.max(...f.points.map(p=>p[0])),
  y0:Math.min(...f.points.map(p=>p[1])),y1:Math.max(...f.points.map(p=>p[1])),z:Math.max(...f.points.map(p=>p[2]))}));
 S4T_RUNTIME.obstacles=S4.solids.map(b=>{
  let top=b.kind==='forest'?12:b.kind==='hedge'?2.8:.9;
  for(const f of bounds)if(f.x0>=b.x0-.08&&f.x1<=b.x1+.08&&f.y0>=b.y0-.08&&f.y1<=b.y1+.08)top=Math.max(top,f.z);
  return{...b,top};
 });
}
function s4tBlocked(x,y,z,r=.16){
 if(s4Outside(x,y)&&!s4Pond(x,y))return true;
 return S4T_RUNTIME.obstacles.some(b=>z-r<b.top&&x+r>b.x0&&x-r<b.x1&&y+r>b.y0&&y-r<b.y1);
}
function s4tSafePoint(p){
 if(fits(p.x,p.y,.24))return {...p};
 // Search close to the release point, never return inside a hedge or under a car.
 for(let r=.3;r<=3;r+=.3)for(let i=0;i<24;i++){
  const x=p.x+Math.cos(i*TAU/24)*r,y=p.y+Math.sin(i*TAU/24)*r;
  if(fits(x,y,.24)&&s4qCanReach({x,y},200,Math.PI))return{x,y};
 }
 return{x:42,y:31};
}
function s4tReturn(reason='THE LIGHT RETURNS TO THE BANK.'){
 const p=s4tSafePoint(S4T.safe||S4T.origin);Object.assign(S4T,p,{phase:'ground',z:.27,vx:0,vy:0,vz:0,returnT:0,settle:.5});
 S4T.returns++;if(S4T.proxy)Object.assign(S4T.proxy,{x:43,y:24.5,a:Math.PI/2,phase:'idle',route:[],index:0,wait:0});audio.seraphimCue('return');feed(reason+'\nE TO RECOVER.');
}
function s4tLand(){
 S4T.vx=S4T.vy=S4T.vz=0;
 if(s4Pond(S4T.x,S4T.y)){
  S4T.phase='water';S4T.z=.08;S4T.waters++;S4T.returnT=3.2;
  audio.seraphimCue('water');
  if(cbfWaterLanding()){hudUpdate();return;}
  if(S4T.proxy){
   const route=s4tPlanRoute(S4T);
   if(route){Object.assign(S4T.proxy,{phase:'walk',route,index:0,wait:0});S4T.returnT=0;feed('WATER LANDING · WATCH THE LARGE FOOTPRINT REACH THE BANK.');}
   else{S4T.proxy.phase='blocked';feed('NO CLEAR LARGE-BODY ROUTE.\nTHE TOY WILL RETURN; THE GATES STAY CLOSED.');}
  }else feed('WATER LANDING.\nREVIEW: THE TOY RETURNS TO THE BANK IN A MOMENT.');
 }else if(fits(S4T.x,S4T.y,.24)){
  S4T.phase='ground';S4T.z=.27;S4T.settle=.45;S4T.safe={x:S4T.x,y:S4T.y};S4T.lands++;
  audio.seraphimCue('land');feed('A BROKEN LITTLE BREATH.\nTHE LIGHT MARKS WHERE IT LANDED.');cbfToyReaction('land');
 }else s4tReturn('THE THROW COULD NOT BE RECOVERED THERE.');
 if(!cbRunning())review.done=S4T.pickups>0&&S4T.lands>0&&S4T.waters>0;hudUpdate();
}
function s4tTick(dt){
 if(!s4tRunning()||mode!=='playing')return;
 S4T.clock+=dt;S4T.settle=Math.max(0,S4T.settle-dt);
 S4T.throwT=Math.max(0,S4T.throwT-dt);
 if(S4T.gunReturnT>0){S4T.gunReturnT=Math.max(0,S4T.gunReturnT-dt);if(!S4T.gunReturnT&&weapon===3){weapon=S4T.previousGun;weaponDrop=.16;hudUpdate();}}
 if(S4T.phase==='carried'){S4T.x=player.x;S4T.y=player.y;S4T.z=.62;}
 else if(S4T.phase==='airborne'){
  // Small, deterministic substeps prevent fast throws tunnelling through thin rails.
  let left=dt;while(left>1e-8&&S4T.phase==='airborne'){
   const h=Math.min(left,1/120);left-=h;S4T.flight+=h;
   const x=S4T.x+S4T.vx*h,y=S4T.y+S4T.vy*h,z=S4T.z+S4T.vz*h-3.75*h*h;
   S4T.vz-=7.5*h;
   if(s4tBlocked(x,S4T.y,z)){S4T.vx*=-.25;S4T.vy*=.55;}else S4T.x=x;
   if(s4tBlocked(S4T.x,y,z)){S4T.vy*=-.25;S4T.vx*=.55;}else S4T.y=y;
   S4T.z=z;
   // Merely crossing water in mid-air is never a successful water landing.
   if(z<=.27)s4tLand();else if(S4T.flight>3)s4tReturn('THE TOY RETURNS TO REACHABLE GROUND.');
  }
 }
 if(S4T.proxy)s4tProxyTick(dt);
 if(S4T.returnT>0){S4T.returnT=Math.max(0,S4T.returnT-dt);if(!S4T.returnT)s4tReturn();}
 audio.seraphimTick();
}
function s4tSnapshot(){return JSON.parse(JSON.stringify(S4T));}
function s4tSave(notify=true){
 if(!s4tRunning()||cbRunning())return false;
 S4T_RUNTIME.checkpoint={toy:s4tSnapshot(),carry:s4dCapture(),player:{...player},stageTime,scene:review.scene,
  shotCD,reloadT,reloadDuration,dashT,dashCD,meleeT,meleeCD,weaponDrop,bob,aimPitch,
  bullets:bullets.map(b=>({...b})),done:review.done};
 if(notify){$('reviewAudioStatus').textContent='Seraphim checkpoint captured: '+S4T.phase+'. Restore repeats this exact state.';feed('SERAPHIM CHECKPOINT CAPTURED.');}
 reviewSync();return true;
}
function s4tRestore(){
 const c=S4T_RUNTIME.checkpoint;if(!c)return false;
 // Reload the same fixture, then replace its single toy with the captured state.
 reviewLoad(c.scene);Object.assign(S4T,JSON.parse(JSON.stringify(c.toy)));S4T.throwLatch=false;
 s4dCarry(c.carry);Object.assign(player,c.player);_safeX=player.x;_safeY=player.y;
 ({stageTime,shotCD,reloadT,reloadDuration,dashT,dashCD,meleeT,meleeCD,weaponDrop,bob,aimPitch}=c);
 bullets=c.bullets.map(b=>({...b}));review.done=c.done;S4T_RUNTIME.checkpoint=c;
 releaseInputs();audio.seraphimStop();hudUpdate();feed('SERAPHIM CHECKPOINT · '+S4T.phase.toUpperCase());return true;
}
function s4tHud(){
 if(!hudComposing){hudUpdate();return;}
 const on=s4tRunning(),held=s4tCarried(),selected=on&&weapon===3;
 $('slot3').classList.toggle('hidden',!held);$('slot3').classList.toggle('active',selected);
 document.body.classList.toggle('seraphim-held',selected);touchSetLabel('touchFire',selected?'THROW':'FIRE');
 if(!on)return;
 const near=s4tNear();if(!cbRunning())$('lifeHint').textContent='PROTECTED';
 $('goal').textContent=near?(coarse?'USE · ':'[E] ')+'LIFT THE WOUNDED SERAPHIM':held?(selected?(coarse?'FIRE TO THROW · GUN TO SWITCH':'FIRE TO THROW · 1–3 GUNS'):(coarse?'GUN TO SELECT THE SERAPHIM':'4 TO HOLD THE SERAPHIM · ITS LIGHT FOLLOWS YOU')):S4T.phase==='airborne'?'FOLLOW THE FALLING LIGHT':S4T.phase==='water'?'WATER LANDED · REVIEW RETURN PENDING':'FOLLOW THE HOLY LIGHT';
 if(selected){$('ammo').textContent='';$('reserve').textContent='';}
 $('touchUse').classList.toggle('hidden',!near&&!s4NearbyLabel());touchSetLabel('touchUse',near?'LIFT':'READ');
 $('compassText').textContent=held?'CARRIED':S4T.phase==='water'?'IN THE WATER':'SERAPHIM';
 const dx=S4T.x-player.x,dy=S4T.y-player.y,d=Math.hypot(dx,dy);
 const visible=!held&&d>.2&&s4CastRay(player.x,player.y,dx/d,dy/d,d).d>=d-.15;
 $('compassArrow').style.visibility=visible?'visible':'hidden';
 if(visible)$('compassArrow').style.transform='rotate('+angle(Math.atan2(dy,dx)-player.a)+'rad)';
 $('reviewBarText').textContent='THE STOLEN SERAPHIM · CALM INTERACTION REVIEW';
 $('reviewStatus').textContent=S4T.proxy?'LARGE FOOTPRINT: '+S4T.proxy.phase.toUpperCase()+' · MOVEMENT TEST ONLY · T CONTROLS':'E LIFT · 4 HOLD · FIRE THROW · T CHECKPOINT · B RESET';
}
function s4tReview(scene){
 if(!['s4_toy','s4_toy_carry','s4_toy_west','s4_toy_route'].includes(scene))return;
 Object.assign(S4T,s4tFresh(),{on:true,previousGun:weapon});enemies=[];drops=[];bullets=[];
 const poses={s4_toy:[42,31.4,-1.85],s4_toy_carry:[35,32.5,Math.PI/2],s4_toy_west:[25.3,28.5,Math.PI],s4_toy_route:[39,32.5,1.84]};
 reviewPlace(...poses[scene]);S4T.safe={x:player.x,y:player.y};S4T.origin={...S4T.safe};
 if(scene!=='s4_toy'){S4T.phase='carried';S4T.x=player.x;S4T.y=player.y;S4T.pickups=1;weapon=3;weaponDrop=.15;}
 if(scene==='s4_toy_route')S4T.proxy={x:43,y:24.5,a:Math.PI/2,r:1.55,phase:'idle',route:[],index:0,wait:0};
 s4tBuildCollision();if(S4T.proxy)s4tBuildNav();
 msgT=feedT=0;s4tSave(false);hudUpdate();
}
for(const [id,label,hint]of [
 ['s4_toy','Seraphim — lift the fallen light','A calm garden test. Walk toward the light and press E, or LIFT on touch. 4 holds the creature; FIRE throws it. Wheel/GUN cycles the carried fourth slot. Land throws stay recoverable. All four seraphim scenes remain protected, even with Normal selected.'],
 ['s4_toy_carry','Seraphim — held at the hospital bay','Already in your hands, facing the near water. Throw on grass and recover it; switch all three guns and return with 4. The holy light stays with you while carrying it. No ammo, reload or damage belongs to the toy. Water throws return to your bank after a short review hold.'],
 ['s4_toy_west','Seraphim — the western bank','Already carrying the creature by the large western lake. Try different banks and oblique throws. Only a landing in water counts; crossing water in the air does not. Bad throws return to reachable ground. T lets you capture and restore the exact state, including mid-flight.'],
 ['s4_toy_route','Seraphim — large guardian route proof','The wire cage marks a 3.1-unit-wide, nonattacking guardian footprint. It is a navigation proxy, not Cerberus artwork. A water landing asks it to reach a clear bank and enter the water. Test from different points along the shore; the toy then returns. No attacks, drowning, victory or gate opening is enabled.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

