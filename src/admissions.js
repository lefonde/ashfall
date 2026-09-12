// boot.js — bundled from the owner’s liminal baseline.

/* ==================================================================
   R2-P05-R03  ADMISSIONS + ANNEXE + THE TRANSFER  -  the ward, and the spiral into the annexe
   ================================================================== */
let useChapter=true;

const CH={
  on:false, phase:'arrive', power:false, objective:'', arrival:0,
  live:{}, cleared:{}, flags:{}, checkpoint:null, tension:0, ending:false,
  maze:null, gateOpen:false, drone:false, trailRooms:[], counter:null, tr:null,
  doors:{ service:[[4,9],[5,9],[6,9]],
          security:[[15,54],[15,55],[15,56]] }
};
function chRunning(){return CH.on&&useChapter&&stage===0;}
const CH_GOAL={x:54,y:9};        // where the compass points until the power is on

/* ---------------------------------------------------------------- the plan
   Rooms declare their own doorway. Geometry, arches, signage and furniture
   are all derived from this table, which is what stops props from landing
   in doorways the way they did in r01. side = wall the door is cut into. */
const ROOMS=[
  // north patient rooms, doors south into the ward corridor
  {id:'W01',x1:13,y1:13,x2:17,y2:18,side:'S',door:15,label:'W‑01'},
  {id:'W02',x1:19,y1:13,x2:23,y2:18,side:'S',door:21,label:'W‑02'},
  {id:'W03',x1:25,y1:13,x2:29,y2:18,side:'S',door:27,label:'W‑03'},
  {id:'W04',x1:31,y1:13,x2:35,y2:18,side:'S',door:33,label:'W‑04'},
  {id:'W05',x1:37,y1:13,x2:41,y2:18,side:'S',door:39,label:'W‑05'},
  {id:'W06',x1:43,y1:13,x2:47,y2:18,side:'S',door:45,label:'W‑06'},
  // south side: records, then the support cluster
  {id:'REC',x1:13,y1:24,x2:19,y2:29,side:'N',door:16,label:'RECORDS'},
  {id:'CLN',x1:33,y1:24,x2:37,y2:29,side:'N',door:35,label:'CLEAN UTILITY'},
  {id:'SOI',x1:39,y1:24,x2:43,y2:29,side:'N',door:41,label:'SOILED'},
  {id:'LIN',x1:45,y1:24,x2:49,y2:29,side:'N',door:47,label:'LINEN'}
];
// curtained assessment bays, open to the triage corridor on their west side
const BAYS=[{y1:35,y2:37,n:'BAY 1'},{y1:39,y2:41,n:'BAY 2'},{y1:43,y2:45,n:'BAY 3'}];

function chCreateMap(){
  CH.power=false;
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(16,50,36,60);        // reception / waiting hall
  carve(13,54,15,56);        // security alcove  (chapter exit)
  carve(25,48,27,49);        // reception -> spine
  carve(25,34,27,47);        // main spine
  carve(4,31,52,33);         // cross corridor, 49 long
  carve(9,34,11,46);         // triage corridor
  for(const b of BAYS)carve(12,b.y1,19,b.y2);          // assessment bays
  carve(34,35,50,46);        // ward 2, open hall
  carve(40,34,42,34);        //   its doorway
  carve(29,23,31,30);        // ward connector
  carve(10,20,50,22);        // WARD CORRIDOR - double loaded, 41 long
  carve(21,24,27,27);        // nurse station, open to the corridor
  carve(48,12,50,19);        // service riser
  carve(36,4,56,11);         // plant hall
  carve(4,6,36,8);           // plant west passage (service level)
  carve(4,9,6,30);           // service return, plant down to the cross corridor
  for(const r of ROOMS)carve(r.x1,r.y1,r.x2,r.y2);
  for(const r of ROOMS)                                 // one doorway each
    map[r.side==='S'?r.y2+1:r.y1-1][r.door]=0;
  carve(21,23,27,23);        // nurse station counter opening

  // structural columns: cover in the two fighting spaces only
  for(const [x,y] of [[20,54],[20,58],[32,54],[32,58],[38,38],[38,43],[46,38],[46,43]])map[y][x]=2;
  for(const k in CH.doors)for(const [x,y] of CH.doors[k])map[y][x]=1;

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function chOpenDoors(){
  for(const k in CH.doors)for(const [x,y] of CH.doors[k])map[y][x]=0;
  buildFlow();
}

/* --------------------------------------------------------------- dressing
   Generated from the plan. A patient room gets its bed against the wall
   OPPOSITE its door, the monitor at the bed head, a curtain inside the
   doorway, an arch in the doorway and its number beside it. */
function chSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  for(const r of ROOMS){
    const cx=(r.x1+r.x2+1)/2, south=r.side==='S';
    const doorY=south?r.y2+1:r.y1, dx=r.door+.5;
    // The arch mesh carries its columns at local x = ±0.96. Rotated 90° they
    // swing INTO the passage, which is what was standing in every doorway in
    // r03. A door walked through north–south takes angle 0, so the columns
    // land in the flanking wall where they belong.
    add('arch',dx,(south?r.y2+1:r.y1-1)+.5,0,{label:r.label});
    // number plate on the corridor wall beside the door
    add('sign',r.door+1.6,south?r.y2+1.03:r.y1-.03,south?0:Math.PI,{label:r.label});
    if(r.id==='REC'||r.id==='CLN'||r.id==='SOI'||r.id==='LIN'){
      // support rooms: shelving along the back wall, nothing near the door
      const backY=south?r.y1+.55:r.y2+.45;
      for(let x=r.x1+1;x<=r.x2;x+=2)add('shrouded',x+.1,backY,0,{seed:seed++});
      add('monitor',r.x1+.45,(r.y1+r.y2)/2+.5,Math.PI/2);
    }else{
      // patient room: bed head to the far wall, monitor at the head
      const bedY=south?r.y1+.75:r.y2+.25;
      add('bed',cx,bedY,0,{seed:seed++});
      add('monitor',cx+1.15,bedY+(south?-.5:.5),0);
      add('curtain',cx-1.1,south?r.y2-.6:r.y1+1.4,0,{seed:seed++});
      add('lamp',cx,(r.y1+r.y2)/2+.5,0,{color:'#8be5df',seed:seed++});
    }
  }

  // nurse station: a counter facing down the ward corridor, staff side behind
  for(let x=21.6;x<=26.6;x+=1.2)add('monitor',x,23.55,0);
  add('sign',24,23.0,Math.PI,{label:'NURSE STATION'});
  add('shrouded',22.5,26.4,0,{seed:seed++});
  add('lamp',24,25.5,0,{color:'#edc17b',seed:seed++});

  // assessment bays: bed across the bay, curtain at the corridor opening
  BAYS.forEach((b,i)=>{
    const cy=(b.y1+b.y2+1)/2;
    add('bed',16,cy,0,{seed:seed++});
    add('monitor',18.6,cy-.7,-Math.PI/2);
    add('curtain',12.3,cy-1.2,0,{seed:seed++});
    add('sign',12.03,b.y1+.5,Math.PI/2,{label:b.n});
  });
  add('sign',9.03,35,Math.PI/2,{label:'ASSESSMENT'});

  // ward 2: two rows of beds head to wall, aisle down the middle
  for(let x=35.5;x<=49;x+=2.4){
    add('bed',x,35.4,0,{seed:seed++});add('monitor',x+1.05,35.35,0);
    add('curtain',x+1.2,36.1,0,{seed:seed++});        // track between adjacent bays
  }
  for(let x=35.5;x<=49;x+=2.4){
    add(seed++%4===0?'shrouded':'bed',x,46.5,0,{seed:seed++});
    add('curtain',x+1.2,44.9,0,{seed:seed++});
  }
  add('sign',34.03,40,Math.PI/2,{label:'WARD 2'});
  // R2-P04 retired: the owner rejected the mirror world. Nothing places
  // it and nothing ticks it. The code below remains, unreferenced, so the
  // decision can be reversed without rebuilding it.
  add('sign',50.97,40,-Math.PI/2,{label:'WARD 2 / END'});
  for(const [x,y] of [[38,40],[46,40]])add('lamp',x,y,0,{color:'#ff3e70',seed:seed++});

  // reception: desk facing the entrance, seating in facing rows with an aisle
  // Registration counter against the EAST wall. In r03/r04 it sat across the
  // middle of the hall, which is what the Orderly kept snagging on.
  for(let y=52;y<=56;y+=1.2)add('monitor',36.5,y,-Math.PI/2);
  add('sign',36.97,50.6,-Math.PI/2,{label:'ADMISSIONS'});
  // seating hard against the far wall only. The middle of this hall is the
  // arena for the Orderly, and in r03 it was full of gurneys he could not
  // path around, which is why he could be strafed to death from range.
  for(let x=19;x<=33;x+=2.4){
    add('bed',x,59.5,0,{seed:seed++});
    add('curtain',x+1.2,58.9,0,{seed:seed++});
  }
  add('sign',16.03,55,Math.PI/2,{label:'WAITING'});
  add('sign',36.97,52,-Math.PI/2,{label:'NO POWER'});
  add('arch',15.5,55,Math.PI/2,{label:'SECURITY'});

  // plant hall: switchgear along the back wall, pipework overhead
  for(let x=38;x<=54;x+=3)add('monitor',x,4.5,0);
  for(const [x,y] of [[40,5.5],[47,5.5],[52,5.5]])add('pipe',x,y,0,{length:6});
  add('sign',45,4.03,0,{label:'PLANT / HV'});
  add('lamp',46,8,0,{color:'#8be5df',seed:seed++});

  // wayfinding at the junctions, which is where real signage lives
  add('sign',26.5,31.035,0,{label:'← TRIAGE / WARD 1 + PLANT →'});
  add('sign',4.03,31.5,Math.PI/2,{label:'SERVICE'});
  add('sign',29.97,23.5,-Math.PI/2,{label:'WARD 1 / W‑01…W‑06'});
  // No frames at corridor junctions: these openings are three cells wide, the
  // arch mesh spans under two, and real corridors do not have door frames
  // where they meet each other. Overhead directional signs instead.

  chSetLights();
  rebuildFurniture();
}

function chSetLights(){
  wardLights=[];
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  const dim=!CH.power;
  const A=dim?[.58,.12,.18]:[1.00,.96,.86];      // public
  const B=dim?[.26,.28,.36]:[.80,.86,.84];       // circulation
  const C=dim?[.30,.56,.60]:[.44,.88,.92];       // service
  L(26,55,A); L(20,57,A); L(32,57,A);
  L(26,46,B); L(26,36,B);      // nothing at y40-42: the gate mouth stays black
  L(10,32,B); L(26,32,B); L(42,32,B);
  L(10,40,B); L(16,44,B);
  L(40,40,dim?[.24,.26,.32]:[.78,.84,.80]); L(48,42,dim?[.22,.24,.30]:[.72,.78,.76]);
  L(16,21,B); L(30,21,B); L(44,21,B);
  L(24,26,dim?[.30,.32,.40]:[.88,.84,.62]);
  L(20,16,B); L(34,16,B); L(46,16,B);
  L(49,15,C); L(46,8,C); L(5,20,C); L(20,7,C);
  bakeLightField();
  if(CH.gateOpen)chDarkenGate();
}

/* ------------------------------------------------- population
   Two authored encounters, plus residents scattered through the floor who
   wake individually on sight or proximity. The floor is inhabited without
   the whole ward charging you at once. */
const CH_ENC={
  triage:[[15,36,0],[16,40,0],[15,44,0],[10,38,1],[10,43,1],[17,45,0]],
  reception:[[26,55,2],[31,52,2],[19,52,1],[33,57,1],[21,57,1],[29,58,1],[24,51,0],[34,54,0]]
};
// Placed to be revealed. Several stand just inside a doorway or a corner so
// they come into view as you turn, rather than being visible down a corridor.
const RESIDENTS=[
  [15,17,0],[21,17,1],[27,17,0],[33,17,0],[39,17,1],[45,17,0],   // deep in each room, seen on entry
  [11.5,21,0],[28.5,21,1],[47.5,21,0],                            // corridor, near the bends
  [24,26.5,0],                                                    // behind the nurse station counter
  [35,28,0],[41,28,1],[47,28,0],                                  // support rooms, back walls
  [36.5,36,0],[45,40,1],[43,44,2],[49,45,0],                      // ward 2, Orderly deep in it
  [17,28,1],                                                      // records
  [44,9,0],[52,9,1],                                              // plant hall, flanking the breaker
  [26,35.5,1],                                                    // just past the spine/cross junction
  [10.5,34.5,0],                                                  // around the corner into assessment
  [5,29,0],                                                       // service return, at the bottom bend
  [50.5,21,1]                                                     // at the riser mouth
];
function chSpawnEnc(id){
  for(const [x,y,t] of CH_ENC[id]){const e=spawn(x,y,t);e.enc=id;e.noticed=false;}
}
function chPopulate(){
  enemies=[];drops=[];
  chSpawnEnc('triage');
  for(const [x,y,t] of RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  drops.push({x:16,y:27,type:'ammo',life:999,ch:'cache'});
  drops.push({x:17.4,y:26,type:'life',life:999,ch:'cache'});
  drops.push({x:24,y:26,type:'ammo',life:999});
  drops.push({x:46,y:42,type:'life',life:999});
}
function chRespawnLive(){
  const ids=new Set([...Object.keys(CH.live).filter(k=>CH.live[k]),
                     ...Object.keys(CH.cleared).filter(k=>CH.cleared[k])]);
  if(!ids.size)return;
  enemies=enemies.filter(e=>!e.enc);
  for(const id of ids){CH.live[id]=true;CH.cleared[id]=false;chSpawnEnc(id);}
  for(const e of enemies)if(e.enc)e.noticed=true;
  CH.tension=1;audio.tension(1);buildFlow();
}
function chActivate(id){
  if(CH.live[id]||CH.cleared[id])return;
  CH.live[id]=true;
  if(id==='reception')chSpawnEnc('reception');
  for(const e of enemies)if(e.enc===id){e.noticed=true;e.cd=rand(.3,1.1);}
  CH.tension=1;audio.tension(1);
  if(id==='reception'){shake=Math.max(shake,5);audio.creature(enemies.find(e=>e.enc==='reception'&&e.type===2)||{x:player.x,y:player.y,type:2},true);}
  say(id==='triage'?'THEY WERE WAITING IN THE BAYS.':'IT CAME BACK FOR THE DOOR.',2.0);
}
function chKill(e){
  if(!e.enc)return;
  if(enemies.filter(x=>x.alive&&x.enc===e.enc).length>0)return;
  CH.live[e.enc]=false;CH.cleared[e.enc]=true;
  CH.tension=0;audio.tension(0);comboT=0;combo=0;
  feed(e.enc==='triage'?'ASSESSMENT CLEAR':'HALL CLEAR');
  if(e.enc==='triage')chSetObjective('seek');
  chSave();
}

/* ============================================ THE TRANSFER  (P05-R03) ==== */
/* Entered through W-04, which looks like every other room on the ward. Its own
   scene, so there is nothing in here but the corridor and the thing at the end. */
const TR_ROOM={x1:31,y1:13,x2:35,y2:18,door:33};
const TR_COR ={y1:15,y2:16,x0:36,x1:60,renews:1};   // straight, east, ~12s with one renewal

function trBuild(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
  carve(TR_ROOM.x1,TR_ROOM.y1,TR_ROOM.x2,TR_ROOM.y2);
  map[TR_ROOM.y2+1][TR_ROOM.door]=0;                 // the door you came through
  carve(TR_COR.x0,TR_COR.y1,TR_COR.x1,TR_COR.y2);    // the corridor
  for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][TR_COR.x0]=1;   // shut until the door closes
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function trProps(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  const cx=(TR_ROOM.x1+TR_ROOM.x2+1)/2;
  add('bed',cx,TR_ROOM.y1+.75,0,{seed:1});           // dressed exactly as W-04 was
  add('monitor',cx+1.15,TR_ROOM.y1+1.25,0);
  add('curtain',cx-1.1,TR_ROOM.y2-.6,0,{seed:2});
  wardLights.push({x:cx,y:TR_ROOM.y1+2.5,rgb:[.30,.27,.24]});
  bakeLightField();rebuildFurniture();
}
function trEnter(){
  if(CH.tr)return;
  CH.tr={ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
               lf:new Float32Array(lightField),enemies,drops,exit:{...exit},
               x:player.x,y:player.y,a:player.a},
         shut:false,opened:false,fed:false,warden:null,
         back:TR_COR.x0,stretch:0,settled:false,breath:1.2,ending:0};
  enemies=[];drops=[];bullets=[];particles=[];tracers=[];rings=[];numbers=[];
  exit={x:-99,y:-99};
  trBuild();trProps();buildFlow();chSettle();
  LIM_TINT=[.19,.19,.20];LIM_FLAT_AMT=1;LIM_UNIFORM=true;LIM_FOG=[5,5,6];LIM_CEIL=.48;
  LIM_FLICKER='none';liminal.mode='transfer';liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');
  audio.transfer(1);
}
function trLeave(){
  const w=CH.tr&&CH.tr.ward;if(!w)return;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);enemies=w.enemies;drops=w.drops;exit=w.exit;
  rebuildFurniture();bakeLightActive();buildFlow();
  player.x=w.x;player.y=w.y;player.a=w.a;player.vx=player.vy=0;chSettle();
  CH.tr=null;CH.flags.transfer=true;              // no reward, no acknowledgement
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.transfer(0);
  say('',0);feed('');
  chSave();
}
function trTick(dt){
  if(!CH.tr){
    if(!CH.flags.transfer&&chRunning()&&player.hp>40&&
       player.x>TR_ROOM.x1+.5&&player.x<TR_ROOM.x2+.5&&
       player.y>TR_ROOM.y1+.4&&player.y<TR_ROOM.y2-.2) trEnter();
    return;
  }
  const s=CH.tr;

  // 1. the door shuts behind you
  if(!s.shut&&player.y<TR_ROOM.y2-.4){
    s.shut=true;
    map[TR_ROOM.y2+1][TR_ROOM.door]=1;buildFlow();
    audio.play('seal',{vol:.5,pos:{x:TR_ROOM.door+.5,y:TR_ROOM.y2+1},wet:.8,rate:.5});
  }
  // 2. and only then does the room turn out to go on
  if(s.shut&&!s.opened){
    s.opened=true;
    for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][TR_COR.x0]=0;
    buildFlow();
    const w=spawn(TR_COR.x1-.6,TR_COR.y1+1,3);
    w.dormant=true;w.noticed=false;s.warden=w;      // standing at the far end
    audio.play(audio.choose('environment',4),{vol:.7,pos:{x:TR_COR.x0+2,y:TR_COR.y1+1},wet:.95,rate:.5});
  }
  const w=s.warden;if(!w)return;

  const inCor=player.x>TR_COR.x0+.2&&player.y>TR_COR.y1-.2&&player.y<TR_COR.y2+1.2;
  s.fed=inCor;                                     // both arrows lead the same way

  // the way back closes as you go: only the entrance goes, a wall at a time
  if(inCor){
    const upto=Math.floor(player.x-1.4);
    if(upto>=s.back){
      for(let x=s.back;x<=upto&&x<=TR_COR.x1;x++)
        for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][x]=1;
      s.back=upto+1;buildFlow();
    }
  }

  s.breath-=dt;
  if(s.breath<=0){s.breath=rand(2.8,5.0);
    audio.play(audio.choose('breath',3),{vol:.7,pos:w,wet:.8,rate:.7});}

  if(s.ending){
    s.ending-=dt;
    if(s.ending<=0){
      const i=enemies.indexOf(w);if(i>=0)enemies.splice(i,1);
      trLeave();
    }
    return;
  }

  // it holds station ahead of you while the corridor refuses to end...
  if(s.stretch<TR_COR.renews){
    w.x=Math.min(player.x+6.0,TR_COR.x1-.4);
    if(player.x>TR_COR.x1-2.6&&inCor){
      for(let x=TR_COR.x0;x<=TR_COR.x1;x++)
        for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][x]=0;
      s.back=TR_COR.x0;
      player.x=TR_COR.x0+1.8;s.stretch++;buildFlow();
    }
    return;
  }
  // ...then it settles at the end, and waits
  if(!s.settled){s.settled=true;w.x=TR_COR.x1-.6;w.y=TR_COR.y1+1;}

  // AND WHEN YOU REACH IT, NOTHING HAPPENS. It steps aside and lets you past.
  if(player.x>TR_COR.x1-3.4)
    w.y=mix(w.y,TR_COR.y1+.18,1-Math.exp(-dt*2.6));

  // the far end is the way out, and it is always there
  if(player.x>TR_COR.x1+.35){s.ending=.55;liminal.dark=1;}
}
/* its own bed: heavier sub, no pad, more room than the annexe */
audio.transfer=function(t){
  if(!this.ctx)return;
  this.ensureAnnexe();this.ensureDrone();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime,T=.5;
  this.musicBed.gain.setTargetAtTime(Math.max(.0001,1-t),now,T);
  this.droneGain.gain.setTargetAtTime(Math.max(.0001,t*.78),now,T);
  this.anx.air.gain.setTargetAtTime(Math.max(.0001,t*.30),now,T);
  this.anx.pad.gain.setTargetAtTime(.0001,now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*mix(.19,.02,t),now,T);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.45,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,1300,t),now,T);
  try{this.room.buffer=t>.5?this.impLong:this.impShort;}catch(e){}
};

/* ===== THE COUNTER-WARD (mirror) - RETIRED at owner review, kept dormant == */
const MIRROR_AT={x:48,y:40};                   // in Ward 2, off the main route
let counterLatch=false;

function chBuildCounter(){
  const src=map.map(r=>r.slice());
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map[y][x]=src[y][MW-1-x];
}
function chCounterProps(saved){
  // the same ward, reversed. Authored differences rather than a tint alone:
  // the beds are all occupied, the machines are all dead, and the signs read
  // backwards because they are the same signs.
  environmentProps=saved.map(p=>({...p,x:MW-p.x,a:Math.PI-p.a}));
  for(const p of environmentProps){
    if(p.kind==='bed')p.kind='shrouded';
    if(p.kind==='lamp')p.color='#6f7f86';
  }
  wardLights=[];
  for(const l of wardLights)l.x=MW-l.x;
  // a cold, even wash with one warm point at the way back
  for(let x=8;x<58;x+=10)for(let y=10;y<58;y+=12)
    wardLights.push({x,y,rgb:[.30,.40,.52]});
  wardLights.push({x:MW-MIRROR_AT.x,y:MIRROR_AT.y,rgb:[1.5,1.25,.85]});
  bakeLightField();rebuildFurniture();
}
function chEnterCounter(){
  if(CH.counter)return;
  // Snapshot the roster and detach the live array FIRST. spawn() pushes into
  // `enemies`, so iterating the saved reference while spawning into it never
  // terminates.
  const roster=enemies.slice(), savedDrops=drops;
  CH.counter={
    ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
          lf:new Float32Array(lightField),enemies:roster,drops:savedDrops,exit:{...exit}},
    killed:new Set()
  };
  bullets=[];particles=[];tracers=[];rings=[];numbers=[];   // nothing crosses with you
  const saved=CH.counter.ward.props;
  enemies=[];drops=[];exit={x:-99,y:-99};
  // one inhabitant for every living thing in the ward, in the mirrored place
  for(const e of roster){
    if(!e.alive||e.type===3)continue;
    const m=spawn(MW-e.x,e.y,e.type);
    m.mirror=e.id;m.noticed=false;m.cower=0;m.enc=null;
  }
  chBuildCounter();chCounterProps(saved);
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);player.vx=player.vy=0;
  chSettle();buildFlow();
  counterLatch=true;
  // mode stays 'mirror' so the existing flee/cower AI and the borrowed human
  // voices both apply; the look is overridden so the mix is still its own.
  LIM_TINT=[.72,.86,1.06];LIM_FLAT_AMT=.66;LIM_UNIFORM=false;
  LIM_FOG=[10,14,22];LIM_CEIL=1.05;
  LIM_FLICKER='none';liminal.mode='mirror';liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');
  audio.annexe(.55);                       // its own mix, not the annexe's
  say('THE SAME WARD.',2.4);
  feed('THEY ARE AFRAID OF YOU HERE');
}
function chLeaveCounter(){
  const c=CH.counter;if(!c)return;
  const w=c.ward;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);drops=w.drops;exit=w.exit;
  // the literal consequence: what died in there is dead out here
  enemies=w.enemies.filter(e=>!c.killed.has(e.id));
  bullets=[];particles=[];tracers=[];rings=[];numbers=[];
  rebuildFurniture();bakeLightActive();buildFlow();
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);player.vx=player.vy=0;
  chSettle();
  const n=c.killed.size;
  CH.counter=null;counterLatch=true;
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.annexe(0);
  CH.flags.counter=true;CH.flags.counterKilled=n;
  say('',0);
  feed(n?('THE WARD IS SHORT '+n+' OF WHAT IT WAS'):'THE WARD IS AS YOU LEFT IT');
  chSave();
}
/* killing in there gives nothing: no score, no healing, no ammunition, no
   progress. It only removes something from the world on both sides. */
function chCounterKill(e){
  if(!e.alive)return;
  e.alive=false;e.death=.38;
  if(e.mirror!=null)CH.counter.killed.add(e.mirror);
  emit(e.x,e.y,.55,creatureTypes[e.type].color,26,1);
  ring(e.x,e.y,creatureTypes[e.type].color,.8,.24);
  decals.push({x:e.x,y:e.y,r:rand(.22,.4),color:e.type===1?'#137888':'#781653'});
  if(decals.length>80)decals.shift();
  hitstop=.02;shake=Math.max(shake,2.2);
  audio.flesh(e,true);
  audio.play(Math.random()<.6?'agony':audio.choose('pain',4),
             {vol:.95,pos:e,wet:.5,rate:rand(.9,1.05)});
}
function chCounterTick(dt){
  const p=environmentProps.find(q=>q.kind==='mirror'&&
    Math.hypot(q.x-player.x,q.y-player.y)<.75);
  if(counterLatch){ if(!p)counterLatch=false; return; }
  if(!p)return;
  if(CH.counter)chLeaveCounter(); else chEnterCounter();
}

/* ======================================== THE ANNEXE  (liminal) ========== */
/* The spiral. Identical in the ward and in the annexe, which is the whole
   trick: the exchange happens mid-corridor and has nothing to alter. */
const GATE_SEGS=[
  [53,31,58,33],   // east, off the end of the cross corridor
  [56,24,58,31],   // north
  [56,24,62,26],   // east
  [60,26,62,40],   // south  <- the world is exchanged along here
  [54,38,62,40]    // west, and out into the annexe
];
const GATE_SWAP={x1:59.5,y1:27,x2:62.5,y2:39};     // deep in the fourth leg
/* ---- the rule: the machines that are still running are a path ----------- */
function mzTrail(){
  const key=(i,j)=>i+','+j, prev=new Map(), q=[[MZ_ENTRY.i,MZ_ENTRY.j]];
  prev.set(key(MZ_ENTRY.i,MZ_ENTRY.j),null);
  while(q.length){
    const [i,j]=q.shift();
    const nbrs=[];
    if(i<MZ.n-1&&mzLink(i,j,1,0))nbrs.push([i+1,j]);
    if(i>0&&mzLink(i-1,j,1,0))nbrs.push([i-1,j]);
    if(j<MZ.n-1&&mzLink(i,j,0,1))nbrs.push([i,j+1]);
    if(j>0&&mzLink(i,j-1,0,1))nbrs.push([i,j-1]);
    for(const [a,b] of nbrs){
      if(prev.has(key(a,b)))continue;
      prev.set(key(a,b),[i,j]);q.push([a,b]);
    }
  }
  const out=new Set(); let cur=[MZ_EXIT.i,MZ_EXIT.j];
  if(!prev.has(key(cur[0],cur[1])))return out;      // unreachable: leave it dark
  while(cur){out.add(key(cur[0],cur[1]));cur=prev.get(key(cur[0],cur[1]));}
  return out;
}

/* ---- the consequence, once you are back -------------------------------- */
// The two legs must OVERLAP, not merely touch at a corner: [4,34,6,53] and
// [7,54,12,56] met only diagonally, so the corridor was never connected.
const SHORTCUT=[[4,34,6,53],[4,54,12,56]];          // cross corridor -> security door
function chOpenStaffRoute(){
  for(const [x1,y1,x2,y2] of SHORTCUT)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;
  buildFlow();
}
function chOccupyWard(){
  // every bed in Ward 1 is occupied now. Nothing remarks on it.
  const rooms=new Set(ROOMS.filter(r=>r.id.startsWith('W')).map(r=>r.id));
  for(const p of environmentProps){
    if(p.kind!=='bed')continue;
    for(const r of ROOMS){
      if(!rooms.has(r.id))continue;
      if(p.x>=r.x1&&p.x<=r.x2+1&&p.y>=r.y1&&p.y<=r.y2+1){p.kind='shrouded';break;}
    }
  }
  rebuildFurniture();
}
const MZ={x0:2,y0:2,size:5,step:6,n:9};
const MZ_ENTRY={i:8,j:6}, MZ_EXIT={i:0,j:1};
function mzRoom(i,j){
  const x=MZ.x0+i*MZ.step, y=MZ.y0+j*MZ.step;
  return {x1:x,y1:y,x2:x+MZ.size-1,y2:y+MZ.size-1,cx:x+MZ.size/2,cy:y+MZ.size/2};
}
function mzLink(a,b,c,d){
  const h=(((a*73856093)^(b*19349663)^(c*83492791)^(d*2654435761))>>>0);
  return (h%10)<7;                                  // loops, not a single thread
}
function chCarveGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;
  buildFlow();
}
function chSealGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=1;
  buildFlow();
}
function chInGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    if(player.x>=x1-.4&&player.x<=x2+1.4&&player.y>=y1-.4&&player.y<=y2+1.4)return true;
  return false;
}
/* how far along the spiral you are, for the light and the score to follow */
function chGateProgress(){
  let best=0;
  GATE_SEGS.forEach(([x1,y1,x2,y2],i)=>{
    if(player.x>=x1-.4&&player.x<=x2+1.4&&player.y>=y1-.4&&player.y<=y2+1.4)
      best=Math.max(best,(i+1)/GATE_SEGS.length);
  });
  return best;
}
function chBuildMaze(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
  for(let i=0;i<MZ.n;i++)for(let j=0;j<MZ.n;j++){
    const r=mzRoom(i,j); carve(r.x1,r.y1,r.x2,r.y2);
    if(i<MZ.n-1&&mzLink(i,j,1,0))carve(r.x2+1,r.y1+2,r.x2+1,r.y1+2);
    if(j<MZ.n-1&&mzLink(i,j,0,1))carve(r.x1+2,r.y2+1,r.x1+2,r.y2+1);
  }
  chCarveGate();                                    // the same spiral, cell for cell
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function chMazeProps(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;
  const trail=mzTrail(); CH.trailRooms=[];
  for(let i=0;i<MZ.n;i++)for(let j=0;j<MZ.n;j++){
    const r=mzRoom(i,j), out=(i===MZ_EXIT.i&&j===MZ_EXIT.j);
    add('bed',r.cx,r.y1+.75,0,{seed:seed++});
    add('curtain',r.cx-1.1,r.y2-.6,0,{seed:seed++});
    if(out){
      add('lamp',r.cx,r.cy,0,{color:'#ffd479',seed:seed++});
      add('sign',r.x1+.03,r.cy,Math.PI/2,{label:'WAY OUT'});
      wardLights.push({x:r.cx,y:r.cy,rgb:[3.0,2.5,1.4]});
    }else if(trail.has(i+','+j)){
      // on the path: this room's machine is still running
      add('monitor',r.cx+1.15,r.y1+1.25,0);
      add('lamp',r.cx,r.cy,0,{color:'#8be5df',seed:seed++});
      wardLights.push({x:r.cx+1.15,y:r.y1+1.25,rgb:[.30,.86,.92]});
      CH.trailRooms.push({x:r.cx+1.15,y:r.y1+1.25});
    }
  }
  for(let i=0;i<MZ.n;i+=2)for(let j=0;j<MZ.n;j+=2){
    const r=mzRoom(i,j); wardLights.push({x:r.cx,y:r.cy,rgb:[.34,.36,.34]});
  }
  bakeLightField();chDarkenGate();rebuildFurniture();
}
function chDarkenGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1-1;y<=y2+1;y++)for(let x=x1-1;x<=x2+1;x++)
      for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){
        const i=(((y*2+sy)*128)+(x*2+sx))*3;
        if(i<0||i>=lightField.length)continue;
        lightField[i]*=.13;lightField[i+1]*=.13;lightField[i+2]*=.15;
      }
  bakeLightActive();
}
function chDeepLook(t){
  if(liminal.mode!=='deep'){
    const L=LIM_LOOK.deep;
    LIM_TINT=L.tint;LIM_FLAT_AMT=L.flat;LIM_UNIFORM=L.uniform;LIM_FOG=L.fog;LIM_CEIL=L.ceil;
    LIM_FLICKER='none';liminal.mode='deep';liminal.baked=-1;
    document.body.classList.add('liminal');
  }
  liminal.target=t;
  audio.annexe(t);            // continuous crossfade, not a switch at a threshold
  CH.drone=t>.1;
}
/* nothing may leave the player inside geometry, least of all a map swap */
function chSettle(){
  if(fits(player.x,player.y)){_safeX=player.x;_safeY=player.y;return true;}
  for(let r=.25;r<=4;r+=.25)
    for(let a=0;a<Math.PI*2;a+=Math.PI/8){
      const nx=player.x+Math.cos(a)*r, ny=player.y+Math.sin(a)*r;
      if(fits(nx,ny)){player.x=nx;player.y=ny;_safeX=nx;_safeY=ny;return true;}
    }
  return false;
}
function chEnterMaze(){
  if(CH.maze)return;
  CH.maze={ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
                 lf:new Float32Array(lightField),enemies,drops,exit:{...exit}},
           t:0,hinted:false,sealed:false};
  enemies=[];drops=[];
  // The ward's door stayed armed while the annexe was loaded, and `cleared`
  // was already true, so straying near those coordinates in here ended the
  // chapter. There is no exit in the annexe except the one you have to find.
  exit={x:-99,y:-99};
  chBuildMaze();chMazeProps();
  chSettle();                                // identical geometry, so this holds
  buildFlow();
}
function chLeaveMaze(){
  const w=CH.maze&&CH.maze.ward;if(!w)return;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);enemies=w.enemies;drops=w.drops;exit=w.exit;
  chSealGate();                              // and it was never there
  rebuildFurniture();bakeLightActive();buildFlow();
  CH.maze=null;CH.drone=false;CH.gateOpen=false;
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.annexe(0);audio.crossover(false);
  player.x=51;player.y=32;player.a=0;player.vx=player.vy=0;   // facing where it was
  chSettle();
  if(!CH.flags.annexe){
    CH.flags.annexe=true;
    chOpenStaffRoute();                 // a way to the door that was not there
    chOccupyWard();                     // and the ward is not quite as you left it
    feed('STAFF ROUTE OPEN / CROSS CORRIDOR TO SECURITY');
  }else feed('BACK IN THE WARD');
  say('',0);
  chSave();
}
function chDeepTick(dt){
  if(CH.maze){
    CH.maze.t+=dt;
    // once you are out of the corridor and into the rooms, it closes
    if(!CH.maze.sealed&&player.x<52.5&&!chInGate()){
      CH.maze.sealed=true;chSealGate();
      say('THE CORRIDOR IS GONE.',2.6);feed('FIND THE WAY OUT');
    }
    chDeepLook(1);
    const r=mzRoom(MZ_EXIT.i,MZ_EXIT.j);
    if(Math.hypot(player.x-r.cx,player.y-r.cy)<1.5){chLeaveMaze();return;}
    // the nearest running machine, heard rather than seen
    if(CH.trailRooms&&CH.trailRooms.length&&Math.random()<dt*1.1){
      let near=null,bd=13;
      for(const p of CH.trailRooms){
        const d=Math.hypot(p.x-player.x,p.y-player.y);
        if(d<bd){bd=d;near=p;}
      }
      if(near)audio.play(audio.choose('environment',4),
        {vol:.34,pos:near,wet:.8,rate:1.35});
    }
    if(CH.maze.t>40&&!CH.maze.hinted){
      CH.maze.hinted=true;feed('THE MACHINES THAT ARE STILL ON MAKE A PATH');
    }
    if(CH.maze.t>40&&Math.random()<dt*.6)
      audio.play(audio.choose('environment',4),{vol:.8,pos:{x:r.cx,y:r.cy},wet:.9,rate:.55});
    return;
  }
  if(!CH.power||!CH.gateOpen)return;
  if(chInGate()){
    chDeepLook(chGateProgress()*.8);
    // exchanged deep in the fourth leg, where both maps are the same corridor
    if(player.x>=GATE_SWAP.x1&&player.x<=GATE_SWAP.x2&&
       player.y>=GATE_SWAP.y1&&player.y<=GATE_SWAP.y2)chEnterMaze();
  }else if(liminal.mode==='deep'){
    chDeepLook(0);
    if(liminal.mix<.03){liminal.mode=null;document.body.classList.remove('liminal');LIM_CEIL=.68;}
  }
}

/* -------------------------------------------- walkability, through furniture */
const CH_WAY={
  reception:[26,56], spine:[26,40], crossW:[8,32], crossE:[50,32],
  triageCorr:[10,44], bay2:[16,40], ward2:[44,42], wardCorrW:[12,21],
  wardCorrE:[48,21], roomW01:[15,15], roomW06:[45,15], nurseStation:[24,26],
  records:[16,27], serviceRiser:[49,15], plantBreaker:[54,9],
  serviceReturn:[5,20], exitDoor:[14,55]
};
function chValidate(from){
  const S=.25, seen=new Set(), key=(x,y)=>Math.round(x/S)+':'+Math.round(y/S);
  const sx=from?from[0]:player.x, sy=from?from[1]:player.y;
  if(!fits(sx,sy))return {start:'BLOCKED AT START', reached:{}};
  const q=[[sx,sy]]; seen.add(key(sx,sy));
  while(q.length){
    const [x,y]=q.pop();
    for(const [nx,ny] of [[x+S,y],[x-S,y],[x,y+S],[x,y-S]]){
      if(nx<1||ny<1||nx>MW-1||ny>MH-1)continue;
      const k=key(nx,ny); if(seen.has(k)||!fits(nx,ny))continue;
      seen.add(k); q.push([nx,ny]);
    }
  }
  const reached={};
  for(const n in CH_WAY){
    const [wx,wy]=CH_WAY[n]; let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  // every creature and pickup must also be standing somewhere legal
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok', cells:seen.size, reached, stuck, lostDrops};
}

/* ------------------------------------------------------------- objectives */
function chSetObjective(phase){
  CH.phase=phase;
  CH.objective =
    phase==='arrive' ? 'RESTORE HOSPITAL POWER · PLANT HALL' :
    phase==='seek'   ? 'RESTORE HOSPITAL POWER · PLANT HALL' :
    phase==='return' ? 'POWER ON · RETURN TO THE SECURITY DOOR' :
                       'LEAVE ADMISSIONS';
  hudUpdate();
}
function chBegin(){
  CH.on=true;CH.power=false;CH.ending=false;
  CH.live={};CH.cleared={};CH.flags={cache:false,annex:false,annexe:false,counter:false,counterKilled:0,transfer:false};
  CH.arrival=40;CH.tension=0;CH.checkpoint=null;CH.maze=null;CH.gateOpen=false;CH.drone=false;CH.counter=null;counterLatch=false;CH.tr=null;
  cleared=false;exit={x:14,y:55.5};
  player.x=32;player.y=57.5;player.a=Math.PI;
  _safeX=player.x;_safeY=player.y;
  chSetObjective('arrive');audio.tension(0);chSave();
}
function chJumpTo(where){
  if(where==='mains'){
    chSetObjective('seek');player.x=54.7;player.y=9;player.a=0;CH.arrival=0;
  }else if(where==='triage'){
    chSetObjective('seek');
    player.x=10;player.y=34.5;player.a=Math.PI/2;CH.arrival=0;
  }else if(where==='gate'){
    // the crossing, with the ward emptied so it can be walked in peace
    CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=50;player.y=32;player.a=0;CH.arrival=0;
  }else if(where==='maze'){
    CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=61;player.y=30;CH.arrival=0;
    chEnterMaze();                       // already through
    if(CH.maze)CH.maze.sealed=false;     // it still closes as you step clear
    player.x=52;player.y=40;player.a=Math.PI;
    chSettle();chDeepLook(1);liminal.mix=1;
  }else if(where==='transfer'){
    CH.power=true;chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=33.5;player.y=19.6;player.a=-Math.PI/2;CH.arrival=0;
  }else if(where==='after'){
    CH.power=true;CH.gateOpen=false;chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    CH.flags.annexe=true;chOpenStaffRoute();chOccupyWard();
    player.x=8;player.y=32;player.a=Math.PI/2;CH.arrival=0;
  }else if(where==='reception'){
    CH.power=true;chOpenDoors();chSetLights();
    enemies=enemies.filter(e=>e.enc!=='triage');
    CH.cleared.triage=true;chSetObjective('return');cleared=true;
    player.x=26;player.y=50.6;player.a=Math.PI/2;CH.arrival=0;
  }
  _safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();
}
function chRestorePower(){
  if(CH.power)return;
  CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();cleared=true;
  chSetObjective('return');
  whiteFlash=.10;shake=Math.max(shake,3);audio.seal();
  say('POWER RESTORED',2.6);
  feed('SECURITY DOOR RELEASED / SERVICE RETURN OPEN');
  chSave();
}
function chSave(){
  CH.checkpoint={phase:CH.phase,power:CH.power,
    live:{...CH.live},cleared:{...CH.cleared},flags:{...CH.flags},
    x:player.x,y:player.y,a:player.a,hp:Math.max(45,player.hp),
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,
    dead:enemies.filter(e=>!e.alive&&!e.enc).length};
}
function chRestore(){
  const c=CH.checkpoint;if(!c)return;
  hideOverlays();useChapter=true;loadStage(0);
  CH.phase=c.phase;CH.power=c.power;
  CH.live={...c.live};CH.cleared={...c.cleared};CH.flags={...c.flags};
  if(CH.power){chOpenDoors();chSetLights();cleared=true;}
  enemies=enemies.filter(e=>!(e.enc&&CH.cleared[e.enc]));
  for(const id in CH.live)if(CH.live[id]&&!enemies.some(e=>e.enc===id))chSpawnEnc(id);
  for(const e of enemies)if(e.enc&&CH.live[e.enc])e.noticed=true;
  if(CH.flags.cache)drops=drops.filter(d=>d.ch!=='cache');
  if(CH.flags.annexe){chOpenStaffRoute();chOccupyWard();}
  CH.tr=null;                      // re-arms on entry unless already done
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;
  chSetObjective(CH.phase);
  CH.arrival=0;CH.tension=0;audio.tension(0);CH.checkpoint=c;
  buildFlow();mode='playing';document.body.classList.add('playing');
  $('touch').classList.remove('hidden');
  audio.start();lockPointer();hudUpdate();feed('RESUMED FROM CHECKPOINT');
}
function chComplete(){
  if(CH.ending)return;CH.ending=true;
  score+=2500+Math.round(player.hp*12);
  finish(true);
  $('endLabel').textContent='CHAPTER 01 COMPLETE';
  $('endTitle').textContent='ADMISSIONS.';
  $('endReason').textContent='Admissions test complete. Return to Test Ward to choose another chapter.';
}

const chIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
function chTick(dt){
  if(!chRunning())return;
  if(CH.arrival>0){
    CH.arrival-=dt;
    if(!chIn(player.x,player.y,16,50,37,61))CH.arrival=0;
  }
  if(!CH.cleared.triage&&!CH.live.triage&&CH.arrival<=0&&chIn(player.x,player.y,12,35,20,46))
    chActivate('triage');
  if(CH.phase==='arrive'&&player.y<49.5)chSetObjective('seek');
  // Power is restored deliberately at the labelled mains panel (E / touch).
  if(chIn(player.x,player.y,13,24,20,30)){
    if(!CH.flags.annex){CH.flags.annex=true;feed('RECORDS / STAFF CACHE');chSave();}
    if(!CH.flags.cache&&!drops.some(d=>d.ch==='cache')){CH.flags.cache=true;chSave();}
  }
  chDeepTick(dt);
  if(CH.maze)return;
  trTick(dt);
  if(CH.tr)return;                       // the ward waits while you are in there
  if(CH.power&&!CH.cleared.reception&&!CH.live.reception&&chIn(player.x,player.y,16,50,37,61))
    chActivate('reception');
  const want=(CH.live.triage||CH.live.reception)?1:0;
  if(want!==CH.tension){CH.tension=want;audio.tension(want);}
}
audio.tension=function(level){
  if(!this.ctx||!this.musicBed)return;
  const t=this.ctx.currentTime;
  this.musicBed.gain.setTargetAtTime(hbVictory()?0:level?1:.26,t,level?.25:.9);
};

