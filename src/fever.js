/* ================================================ FEVER THEATRE  (P06) === */
const FV={
  on:false, objective:'', valves:[], closed:0, orderly:null, ending:false,
  checkpoint:null, tension:0, arrival:0, sealed:true, hold:0,
  blackoutT:0, ventT:0, purgeT:0, purgeStep:0, returnOpen:false,
  recoveryUsed:false, mixZone:''
};
/* Each theatre declares its own doorway onto the spine and its own valve, the
   way ROOMS does in Admissions, so geometry, dressing, signage, lighting and
   the sleepers are all derived rather than hand-scattered. */
const FV_HALL=[
  {id:'OR1',x1:10,y1:18,x2:24,y2:30,door:{x:25,y:23},
   sleep:[[11.5,19.5],[23.5,29.5],[11.5,29.5]],label:'OR 1'},
  {id:'OR2',x1:30,y1:18,x2:46,y2:30,door:{x:29,y:23},east:23,
   sleep:[[31.5,19.5],[45.5,29.5],[31.5,29.5]],label:'OR 2'},
  {id:'OR3',x1:30,y1:34,x2:46,y2:46,door:{x:29,y:39},east:39,
   sleep:[[31.5,35.5],[45.5,45.5],[31.5,45.5]],label:'OR 3'}
];
const FV_REC={x1:10,y1:34,x2:24,y2:46,door:{x:25,y:39}};
const FV_SPINE={x1:26,y1:15,x2:28,y2:50};
// One cell wide, so the arch over it spans the opening with its columns in the
// flanking wall instead of standing in the doorway.
const FV_AIRLOCK=[[7,59]];                      // sealed until the loop is cold
const FV_EXIT={x:7.5,y:60.5};
function fvRunning(){return FV.on&&useChapter&&stage===1;}
const fvCX=h=>(h.x1+h.x2+1)/2, fvCY=h=>(h.y1+h.y2+1)/2;

/* ------------------------------------------------------------------ layout */
function fvCreateMap(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(4,52,10,58);        // vestibule: where you come in, and where you leave
  carve(6,60,8,61);         //   the airlock chamber beyond it
  carve(7,59,7,59);         //   and the single door into it
  carve(4,12,6,51);         // OUTER RING - west leg, 40 long
  carve(4,12,56,14);        // OUTER RING - north leg, 53 long
  carve(4,50,28,52);        // OUTER RING - south leg, meeting the west leg 3 wide
  carve(26,15,28,50);       // THE STERILE SPINE - 36 long, 3 wide, no cover
  carve(48,15,52,46);       // sterile store: the eastern way round
  carve(49,47,51,52);      // earned return from the store, behind a shutter
  carve(29,50,51,52);
  for(const x of [49,50,51])map[47][x]=1;
  for(const h of FV_HALL)carve(h.x1,h.y1,h.x2,h.y2);
  carve(FV_REC.x1,FV_REC.y1,FV_REC.x2,FV_REC.y2);
  carve(7,23,9,24);         // scrub lobby, ring -> OR1
  carve(7,39,9,40);         // scrub lobby, ring -> recovery
  // one doorway onto the spine each, cut after the halls exist
  for(const h of FV_HALL)for(let y=h.door.y;y<=h.door.y+1;y++)map[y][h.door.x]=0;
  for(let y=FV_REC.door.y;y<=FV_REC.door.y+1;y++)map[y][FV_REC.door.x]=0;
  for(const h of FV_HALL)if(h.east)for(let y=h.east;y<=h.east+1;y++)map[y][47]=0;

  // structural columns: cover inside the big halls, and none in a corridor
  for(const h of FV_HALL)for(const [x,y] of [[h.x1+3,h.y1+3],[h.x2-3,h.y1+3],
                                             [h.x1+3,h.y2-2],[h.x2-3,h.y2-2]])map[y][x]=2;
  for(const [x,y] of FV_AIRLOCK)map[y][x]=1;

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*5+y*11)%11===0)?3:((x+y*4)%7===0)?4:1;
}

/* ---------------------------------------------------------------- dressing */
function fvSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  for(const h of FV_HALL){
    const cx=fvCX(h), cy=fvCY(h), eastDoor=h.door.x>h.x2;
    add('bed',cx,cy,0,{seed:seed++});                      // the table, centre of the room
    add('lamp',cx,cy,0,{color:'#dff3ff',seed:seed++,fvHall:h.id});
    for(const dx of [-2.8,2.8])add('monitor',cx+dx,cy-1.4,0);
    add('control',cx,h.y1+.12,Math.PI,{fvSystem:h.id});
    add('lamp',cx,h.y1+1.1,0,{color:FV_SYSTEMS[h.id].color,seed:seed++,fvSystem:h.id});
    add('sign',cx+2.2,h.y1+.03,0,{label:FV_SYSTEMS[h.id].short});
    add('pipe',cx-3.5,h.y1+1.4,0,{length:7});
    add('pipe',cx+3.5,h.y1+1.4,0,{length:7});
    for(let x=h.x1+1.4;x<h.x1+5;x+=1.6)add('monitor',x,h.y2+.55,0);   // the back bench
    add('curtain',h.x2-1.6,h.y2-.7,0,{seed:seed++});
    add('arch',h.door.x+.5,h.door.y+1,0,{label:h.label});
    add('sign',eastDoor?h.x1+.03:h.x2+.97,cy,eastDoor?Math.PI/2:-Math.PI/2,{label:h.label});
  }
  // recovery: the one soft room in the suite, curtained rows
  for(let x=FV_REC.x1+1.6;x<FV_REC.x2;x+=2.6){
    add('bed',x,FV_REC.y1+.7,0,{seed:seed++});
    add('curtain',x+1.3,FV_REC.y1+1.3,0,{seed:seed++});
    add(seed++%3===0?'shrouded':'bed',x,FV_REC.y2+.35,0,{seed:seed++});
    add('curtain',x+1.3,FV_REC.y2-.9,0,{seed:seed++});
  }
  add('arch',FV_REC.door.x+.5,FV_REC.door.y+1,0,{label:'RECOVERY'});
  add('sign',FV_REC.x1+.03,40,Math.PI/2,{label:'RECOVERY'});
  add('lamp',17,40,0,{color:'#edc17b',seed:seed++});
  add('control',17.5,34.12,Math.PI,{fvSystem:'recovery'});
  add('sign',20,34.03,0,{label:'EMERGENCY SUPPLY'});

  // sterile store: shelving down one side, the long way round to OR2 and OR3
  for(let y=17;y<=44;y+=3.4)add('shrouded',52.4,y,0,{seed:seed++});
  add('sign',48.03,17,Math.PI/2,{label:'STERILE STORE'});
  add('sign',48.03,42,Math.PI/2,{label:'STERILE STORE'});
  add('arch',50.5,47,0,{label:'RETURN / SEALED',fvReturn:true});
  add('sign',48.03,44,Math.PI/2,{label:'OR 3 / PURGE RELEASE'});
  add('sign',32,50.03,0,{label:'STORE RETURN'});
  for(const [x,y] of [[50,24],[50,40]])add('pipe',x,y,Math.PI/2,{length:8});

  // scrub lobbies, which is what the two western links are. Signage only: a
  // sink against the wall of a 2-deep link still blocks half of it.
  for(const y of [23,39])add('sign',7.03,y+.5,Math.PI/2,{label:'SCRUB'});
  // the spine: bare. Signage overhead, nothing on the floor to hide behind.
  add('sign',26.03,17,Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('sign',28.97,48,-Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('arch',27.5,15,0,{label:'STERILE'});
  add('arch',27.5,50,0,{label:'STERILE'});
  for(let y=19;y<=47;y+=7)add('pipe',26.4,y,Math.PI/2,{length:6});

  // wayfinding on the ring, where real signage lives
  add('sign',4.03,20,Math.PI/2,{label:'THEATRES 1-3'});
  add('sign',4.03,44,Math.PI/2,{label:'RECOVERY'});
  add('sign',30,12.03,0,{label:'THEATRE SUITE'});
  add('sign',16,50.03,0,{label:'THEATRE SUITE'});

  // vestibule and the airlock you leave by
  add('arch',7.5,59.5,0,{label:'AIRLOCK'});
  add('sign',10.97,56,-Math.PI/2,{label:'AIRLOCK / SEALED'});
  add('sign',10.97,53,-Math.PI/2,{label:'1 POWER / 2 VENT / 3 PURGE'});
  add('monitor',4.45,57,Math.PI/2);add('monitor',10.55,57,-Math.PI/2);

  fvLights();
  rebuildFurniture();
}

/* Admissions gets brighter as you win. This gets darker: an isolated theatre
   loses its lights, so three valves closed is a suite you cannot see. */
function fvLights(){
  wardLights=[];
  for(const p of environmentProps)if(p.fvHall){
    p.off=FV.valves.some(v=>v.id===p.fvHall&&v.closed);
    p.color=p.off?'#263036':p.fvHall==='OR3'&&FV.purgeT>0?'#ff488d':'#dff3ff';
  }
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  // A live theatre is the brightest place in the game and an isolated one is
  // the darkest, so the fill has to cover the whole hall - one pool over the
  // table reads the same lit or dark, which is what r01 did.
  for(const h of FV_HALL){
    const cx=fvCX(h), cy=fvCY(h), off=FV.valves.some(v=>v.id===h.id&&v.closed);
    L(cx,cy,     off?[.10,.11,.14]:[1.45,1.52,1.60]);   // the lamp over the table
    L(cx,h.y1+2, off?[.08,.09,.12]:[.62,.82,.74]);      // the supply panel
    for(let gx=h.x1+3;gx<=h.x2-1;gx+=4.5)for(let gy=h.y1+3;gy<=h.y2-1;gy+=4.5)
      L(gx,gy,   off?[.07,.08,.10]:[.74,.80,.84]);
  }
  const recoveryOn=FV.valves.some(v=>v.id==='OR1'&&v.closed);
  L(15,38,recoveryOn?[.84,.61,.32]:[.18,.17,.16]);
  L(21,44,recoveryOn?[.62,.45,.25]:[.15,.15,.16]);
  for(let y=18;y<=48;y+=7.5)L(27.5,y,FV.ventT>0?[.22,.86,.68]:[.50,.62,.72]);
  for(let x=8;x<=54;x+=9)L(x,13,[.36,.42,.48]);           // outer ring, north
  for(let y=20;y<=48;y+=9)L(5,y,[.32,.38,.44]);           // outer ring, west
  L(14,51,[.30,.36,.42]); L(24,51,[.30,.36,.42]);
  for(let y=19;y<=43;y+=8)L(50,y,[.22,.26,.30]);          // the store, dim on purpose
  L(8,23.5,[.44,.54,.52]); L(8,39.5,[.44,.54,.52]);       // scrub lobbies
  L(7,55,[.66,.66,.62]); L(7,60,[.30,.34,.32]);
  for(let x=32;x<=50;x+=6)L(x,51,FV.returnOpen?[.22,.59,.49]:[.12,.15,.18]);
  if(FV.purgeT>0)for(const [x,y] of [[33,37],[44,37],[33,44],[44,44]])L(x,y,[1.05,.16,.28]);
  horrorLights();
  bakeLightField();
}

/* ------------------------------------------------------------- population */
const FV_RESIDENTS=[
  // Spine Runners live on the long sightlines - closing 40 units is their job
  [12.5,13.5,1],[30.5,13.5,1],[44.5,13.5,1],
  [5.5,44.5,1],[24.5,51.5,1],
  [50.5,18.5,1],[50.5,43.5,1],
  // Unstitched hold the corners and the rooms, where they are met at knife range
  [5.5,20.5,0],[14.5,51.5,0],[50.5,30.5,0],
  [27.5,18.5,0],[27.5,45.5,0],
  // Recovery begins empty. Pursuing creatures can still follow you inside.
  [22.5,20.5,0],[44.5,20.5,0],[44.5,36.5,0]
];
function fvPopulate(){
  enemies=[];drops=[];
  // ONE Orderly, and it holds the sterile spine. That is the chapter's problem.
  const o=spawn(27.5,32.5,2);o.noticed=false;o.fvHold=true;FV.orderly=o;
  for(const [x,y,t] of FV_RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  // and the sleepers, lying in the theatres. Dormant creatures take no damage,
  // so they cannot be cleared before the lights go out.
  for(const h of FV_HALL)for(const [i,[x,y]] of h.sleep.entries()){
    const e=spawn(x,y,h.id==='OR3'&&i===1?1:0);e.noticed=false;e.dormant=true;e.fvSleep=h.id;e.fvSlot=i;
  }
  drops.push({x:12.5,y:26.5,type:'life',life:999});
  drops.push({x:16.5,y:40.5,type:'life',life:999});
  drops.push({x:50.5,y:26.5,type:'ammo',life:999});   // the long way round pays
  drops.push({x:36.5,y:44.5,type:'ammo',life:999});
}

/* -------------------------------------------------------------- lifecycle */
function fvBegin(){
  FV.on=true;FV.ending=false;FV.closed=0;FV.tension=0;FV.arrival=30;
  FV.sealed=true;FV.hold=0;
  FV.blackoutT=FV.ventT=FV.purgeT=FV.purgeStep=0;
  FV.returnOpen=FV.recoveryUsed=false;FV.mixZone='';
  FV.valves=FV_HALL.map(h=>({id:h.id,x:fvCX(h),y:h.y1+1.5,closed:false}));
  // setupEnvironment bakes the light field BEFORE this runs, off whatever the
  // previous scene left in FV.valves, so a theatre could load dark with its
  // valve open. Re-bake now that the valves are actually reset.
  fvLights();
  cleared=false;exit={...FV_EXIT};
  player.x=7.5;player.y=54.5;player.a=-Math.PI/2;
  _safeX=player.x;_safeY=player.y;
  fvSetObjective();audio.tension(0);audio.theatre(true);
  FV.checkpoint=null;fvSave();
}
function fvSetObjective(){
  FV.objective = FV.closed>=3 ? 'ALL SYSTEMS ISOLATED · RETURN TO THE AIRLOCK'
                              : 'ISOLATE THE THREE THEATRE SYSTEMS · '+FV.closed+' / 3';
  hudUpdate();
}
function fvOpenAirlock(){
  if(!FV.sealed)return;FV.sealed=false;
  for(const [x,y] of FV_AIRLOCK)map[y][x]=0;
  buildFlow();
  for(const p of environmentProps)
    if(p.kind==='sign'&&p.label==='AIRLOCK / SEALED')p.label='AIRLOCK / OPEN';
}
function fvCloseValve(v){fvFinishSystem(v);}
function fvSave(){
  FV.checkpoint={closed:FV.closed,valves:FV.valves.map(v=>({...v})),sealed:FV.sealed,
    x:player.x,y:player.y,a:player.a,hp:Math.max(45,player.hp),
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,
    gameTime,stageTime,stageKills,maxCombo,
    enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),decals:decals.map(d=>({...d})),
    blackoutT:FV.blackoutT,ventT:FV.ventT,purgeT:FV.purgeT,purgeStep:FV.purgeStep,
    returnOpen:FV.returnOpen,recoveryUsed:FV.recoveryUsed};
}
function fvRestore(){
  const c=FV.checkpoint;if(!c)return;
  hideOverlays();audio.reset();useChapter=true;loadStage(1);
  FV.closed=c.closed;FV.valves=c.valves.map(v=>({...v}));
  enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));decals=c.decals.map(d=>({...d}));
  FV.orderly=enemies.find(e=>e.fvHold);
  for(const key of ['blackoutT','ventT','purgeT','purgeStep','recoveryUsed'])FV[key]=c[key];
  if(c.returnOpen)fvOpenReturn();
  enemyId=Math.max(enemyId,...enemies.map(e=>e.id+1));
  if(FV.closed>=3){cleared=true;fvOpenAirlock();}
  fvLights();
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;
  gameTime=c.gameTime;stageTime=c.stageTime;stageKills=c.stageKills;maxCombo=c.maxCombo;combo=comboT=0;
  FV.checkpoint=c;FV.arrival=0;FV.tension=0;
  buildFlow();mode='playing';document.body.classList.add('playing');
  $('touch').classList.remove('hidden');
  audio.start();audio.theatre(true);lockPointer();
  fvSetObjective();feed('RESUMED FROM CHECKPOINT');fvRoomMix();
}
function fvComplete(){
  if(FV.ending)return;FV.ending=true;
  score+=3500+Math.round(player.hp*14);
  audio.theatre(false);
  finish(true);
  $('endLabel').textContent='CHAPTER 02 COMPLETE';
  $('endTitle').textContent='FEVER THEATRE.';
  $('endReason').textContent='The Theatre test is complete. Repeat it with another system order, or return to Test Ward.';
}
/* Admissions hands over to the upgrade screen, which loads this chapter. */
function chHandOver(){
  if(CH.ending)return;CH.ending=true;
  score+=2500+Math.round(player.hp*12);
  say('',0);feed('THE SUITE IS STILL RUNNING');
}

/* ------------------------------------------------------------------- tick */
const fvIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const fvInSpine=(x,y)=>fvIn(x,y,FV_SPINE.x1-.3,FV_SPINE.y1-.3,FV_SPINE.x2+1.3,FV_SPINE.y2+1.3);

function fvTick(dt){
  if(!fvRunning())return;
  if(FV.arrival>0){FV.arrival-=dt;if(player.y<51)FV.arrival=0;}

  fvSystemTick(dt);

  // The Orderly will not leave the sterile spine. It is a ranged denier in a
  // 3-wide corridor with no cover, and the theatre doorways along the spine are
  // the only thing to break its line on. Take the ring instead if you would rather.
  const o=FV.orderly;
  if(o&&o.alive&&FV.ventT<=0){
    o.x=clamp(o.x,FV_SPINE.x1+.35,FV_SPINE.x2+.65);
    o.y=clamp(o.y,FV_SPINE.y1+.35,FV_SPINE.y2+.65);
    if(fvInSpine(player.x,player.y))FV.hold=0;
    else{
      FV.hold+=dt;
      if(FV.hold>2.2){                       // you left: it goes back on station
        const d=32.5-o.y;
        if(Math.abs(d)>.4)move(o,0,Math.sign(d)*.95*dt);
        else o.noticed=false;
      }
    }
  }
  const hot=enemies.some(e=>e.alive&&!e.dormant&&e.noticed&&
                            Math.hypot(e.x-player.x,e.y-player.y)<11)?1:0;
  if(hot!==FV.tension){FV.tension=hot;FV.mixZone='';audio.tension(hot);}
  fvRoomMix(hot);
}

/* ------------------------------------------------ Test Ward entry points */
function fvJumpTo(where){
  if(where==='spine'){
    player.x=27.5;player.y=48.5;player.a=-Math.PI/2;
  }else if(where==='or1'||where==='or2'||where==='or3'){
    const h=FV_HALL[Number(where.slice(-1))-1];
    player.x=fvCX(h);player.y=h.y1+2.2;player.a=-Math.PI/2;
  }else if(where==='recovery'){
    fvFinishSystem(FV.valves[0],true);FV.blackoutT=0;
    player.x=17.5;player.y=36.2;player.a=-Math.PI/2;
  }else if(where==='ring'){
    player.x=50.5;player.y=34.5;player.a=-Math.PI/2;
  }else if(where==='end'){
    for(const v of FV.valves)fvFinishSystem(v,true);
    fvOpenReturn();
    player.x=27.5;player.y=48.5;player.a=Math.PI/2;
  }
  FV.arrival=0;_safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();fvSave();
}

/* ---------------------------------- walkability, through the furniture too */
const FV_WAY={
  vestibule:[7,54], airlock:[7,60], ringW:[5,30], ringN:[30,13], ringS:[16,51],
  spineN:[27,17], spineMid:[27,32], spineS:[27,48],
  or1:[17,24], or2:[38,24], or3:[38,40], recovery:[17,40],
  valve1:[17.5,20], valve2:[38.5,20], valve3:[38.5,36],
  store:[50,30], storeOR2:[47,23.5], storeOR3:[47,39.5],
  scrub1:[8,23.5], scrub2:[8,39.5]
};
function fvValidate(from){
  const S=.25, seen=new Set(), key=(x,y)=>Math.round(x/S)+':'+Math.round(y/S);
  const sx=from?from[0]:player.x, sy=from?from[1]:player.y;
  if(!fits(sx,sy))return {start:'BLOCKED AT START',reached:{}};
  const q=[[sx,sy]];seen.add(key(sx,sy));
  while(q.length){
    const [x,y]=q.pop();
    for(const [nx,ny] of [[x+S,y],[x-S,y],[x,y+S],[x,y-S]]){
      if(nx<1||ny<1||nx>MW-1||ny>MH-1)continue;
      const k=key(nx,ny);if(seen.has(k)||!fits(nx,ny))continue;
      seen.add(k);q.push([nx,ny]);
    }
  }
  const reached={};
  for(const n in FV_WAY){
    const [wx,wy]=FV_WAY[n];let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok',cells:seen.size,reached,stuck,lostDrops};
}

/* ---------------------------------------------------------------- the room
   A hard, bright, tiled suite: a long convolution tail, room tone up at 6 kHz
   where Admissions sits at 3.7, plus plant and a ventilator that will not stop.
   The score itself is left alone, so combat still swells the way it always does
   - this is the building underneath it, not a different soundtrack. */
audio.ensureTheatre=function(){
  if(this.thr||!this.ctx)return;
  const a=this.ctx,out={};
  // 1. plant: a thin high hum, the sound of equipment that is still powered
  out.hum=a.createGain();out.hum.gain.value=.0001;
  const hf=a.createBiquadFilter();hf.type='lowpass';hf.frequency.value=2600;hf.Q.value=.7;
  for(const [f,g,t] of [[196,.10,'sawtooth'],[294,.05,'sine'],[392,.035,'sine'],[588,.018,'sine']]){
    const o=a.createOscillator();o.type=t;o.frequency.value=f;
    const gg=a.createGain();gg.gain.value=g;o.connect(gg).connect(hf);o.start();
  }
  const drift=a.createOscillator();drift.type='sine';drift.frequency.value=.047;
  const driftAmt=a.createGain();driftAmt.gain.value=6;
  drift.connect(driftAmt).connect(hf.frequency);drift.start();
  hf.connect(out.hum).connect(this.music);

  // 2. the ventilator: filtered noise gated by a slow sine. It breathes for
  //    something you never find, about 15 a minute, and it never varies.
  const len=a.sampleRate*3,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  let last=0;for(let i=0;i<len;i++){last=(last+rand(-1,1)*.30)*.90;d[i]=last;}
  const noise=a.createBufferSource();noise.buffer=buf;noise.loop=true;
  const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=780;bp.Q.value=2.2;
  const gate=a.createGain();gate.gain.value=0;
  const puff=a.createOscillator();puff.type='sine';puff.frequency.value=.25;
  const puffAmt=a.createGain();puffAmt.gain.value=.5;
  const puffBias=a.createConstantSource();puffBias.offset.value=.5;
  puff.connect(puffAmt).connect(gate.gain);puffBias.connect(gate.gain);
  out.vent=a.createGain();out.vent.gain.value=.0001;
  noise.connect(bp).connect(gate).connect(out.vent).connect(this.music);
  noise.start();puff.start();puffBias.start();
  this.thr=out;
};
audio.theatre=function(on){
  if(!this.ctx)return;
  this.ensureTheatre();
  const now=this.ctx.currentTime,T=1.1;
  this.thr.hum.gain.setTargetAtTime(on?.17:.0001,now,T);
  this.thr.vent.gain.setTargetAtTime(on?.20:.0001,now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*(on?.09:.19),now,T);
  this.roomReturn.gain.setTargetAtTime(on?1.05:.62,now,T);
  this.roomTone.frequency.setTargetAtTime(on?6200:3700,now,T);
  const want=on?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};

