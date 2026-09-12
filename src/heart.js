/* ================================================ THE HEART WARD  (P07) == */
const HW={
  on:false, objective:'', phase:'arrive', ending:false, checkpoint:null,
  wave:0, waveT:0, live:false, warden:null, resolved:false, staff:false,
  arrival:0, tension:0, intensity:0
};
/* the landmarks, at the footprints they had in the chapters they came from */
const HW_RECEPTION={x1:16,y1:48,x2:36,y2:58};      // Admissions, shifted 2 north
const HW_ALCOVE   ={x1:13,y1:52,x2:15,y2:54};      //   its security alcove
const HW_SPINE    ={x1:10,y1:10,x2:12,y2:54};      // Fever's sterile spine, 45 long
const HW_HEART    ={x1:16,y1:6,x2:48,y2:17};       // the one new space
const HW_CORE     ={x1:28,y1:10,x2:36,y2:13};      //   the mass you walk around
const HW_AFTER    ={x1:4,y1:1,x2:58,y2:3};         // the aftermath, 55 long
const HW_DOOR     =[[32,4],[32,5]];                // Heart -> aftermath, shut
const HW_STAFF    =[[37,49]];                      // reception -> riser, if you found the annexe
// The front doors are a place, reached through a single-cell opening, so a
// player hugging a wall down a three-wide corridor cannot walk straight past
// the end of the game.
const HW_EXIT     ={x:56.5,y:2.5};
/* W-01..W-06, west of the sterile spine, doors onto it at x=9 */
const HW_ROOMS=[0,1,2,3,4,5].map(i=>({
  id:'W0'+(i+1), label:'W‑0'+(i+1),
  x1:4, y1:16+i*6, x2:8, y2:20+i*6, door:18+i*6
}));
function hwRunning(){return HW.on&&useChapter&&stage===2;}
const hwIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const hwInHeart=()=>hwIn(player.x,player.y,HW_HEART.x1,HW_HEART.y1,HW_HEART.x2+1,HW_HEART.y2+1);

/* ------------------------------------------------------------------ layout */
function hwCreateMap(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(24,59,28,62);                                   // arrival lobby
  carve(HW_RECEPTION.x1,HW_RECEPTION.y1,HW_RECEPTION.x2,HW_RECEPTION.y2);
  carve(HW_ALCOVE.x1,HW_ALCOVE.y1,HW_ALCOVE.x2,HW_ALCOVE.y2);
  carve(HW_SPINE.x1,HW_SPINE.y1,HW_SPINE.x2,HW_SPINE.y2);
  carve(12,10,16,12);                                   // the approach into the Heart
  carve(HW_HEART.x1,HW_HEART.y1,HW_HEART.x2,HW_HEART.y2);
  carve(49,10,52,50);                                   // east riser
  carve(38,48,49,50);                                   // staff run, riser -> reception
  carve(37,49,37,49);                                   //   one cell, so HW_STAFF really seals it
  carve(HW_AFTER.x1,HW_AFTER.y1,HW_AFTER.x2,HW_AFTER.y2);
  map[1][56]=map[3][56]=1;                              // one-cell vestibule entry
  carve(57,1,61,3);                                     // a real walk to the outer doors
  for(const [x,y] of HW_DOOR)carve(x,y,x,y);
  for(const r of HW_ROOMS){carve(r.x1,r.y1,r.x2,r.y2);map[r.door][9]=0;}

  for(let y=HW_CORE.y1;y<=HW_CORE.y2;y++)               // the mass in the middle
    for(let x=HW_CORE.x1;x<=HW_CORE.x2;x++)map[y][x]=2;
  // reception's columns, in the places they stood in Admissions
  for(const [x,y] of [[20,52],[20,56],[32,52],[32,56]])map[y][x]=2;

  for(const [x,y] of HW_DOOR)map[y][x]=1;               // shut until it is over
  for(const [x,y] of HW_STAFF)map[y][x]=1;              // shut unless you found the annexe

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function hwOpenStaff(){
  if(HW.staff)return;HW.staff=true;
  for(const [x,y] of HW_STAFF)map[y][x]=0;
  buildFlow();
}
function hwOpenWayOut(){
  for(const [x,y] of HW_DOOR)map[y][x]=0;
  buildFlow();
}

/* ---------------------------------------------------------------- dressing
   Reception and the patient rooms are quoted from Admissions and the spine
   from Fever Theatre, prop for prop. The recognition is the content. */
function hwSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  /* --- ADMISSIONS RECEPTION, exactly as it was ------------------------- */
  const R=HW_RECEPTION;
  for(let y=R.y1+2;y<=R.y1+6;y+=1.2)add('monitor',R.x2+.55,y,-Math.PI/2);
  add('sign',R.x2+.97,R.y1+.6,-Math.PI/2,{label:'ADMISSIONS'});
  for(let x=19;x<=33;x+=2.4){
    add('bed',x,R.y2-.5,0,{seed:seed++});
    add('curtain',x+1.2,R.y2-1.1,0,{seed:seed++});
  }
  add('sign',R.x1+.03,55,Math.PI/2,{label:'WAITING'});
  add('sign',R.x2+.97,52,-Math.PI/2,{label:'ADMISSIONS'});
  add('arch',15.5,53.5,Math.PI/2,{label:'SECURITY'});     // E-W passage
  add('sign',13.03,53.5,Math.PI/2,{label:'SECURITY'});
  add('sign',26,62.97,-Math.PI,{label:'THE HEART WARD'});

  /* --- THE STERILE SPINE, exactly as Fever Theatre had it -------------- */
  const S=HW_SPINE;
  add('sign',S.x1+.03,12,Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('sign',S.x2+.97,50,-Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('arch',11.5,10,0,{label:'STERILE'});
  add('arch',11.5,54,0,{label:'STERILE'});
  for(let y=14;y<=52;y+=7)add('pipe',S.x1+.4,y,Math.PI/2,{length:6});

  /* --- W-01..W-06, exactly as Admissions dressed them ------------------ */
  for(const r of HW_ROOMS){
    const cy=(r.y1+r.y2+1)/2;
    add('arch',r.x2+1.5,r.door+.5,Math.PI/2,{label:r.label});   // E-W doorway
    add('sign',r.x2+.97,r.door-1.4,-Math.PI/2,{label:r.label});
    add('bed',r.x1+.9,cy,Math.PI/2,{seed:seed++});              // head to the far wall
    add('monitor',r.x1+.9,cy+1.15,Math.PI/2);
    add('curtain',r.x2-.6,cy-1.1,Math.PI/2,{seed:seed++});
    add('lamp',(r.x1+r.x2+1)/2,cy,0,{color:'#8be5df',seed:seed++});
  }

  /* --- THE HEART, the only room in here nobody has been in ------------- */
  const H=HW_HEART, C=HW_CORE;
  for(let x=C.x1+.5;x<=C.x2+.5;x+=2)add('monitor',x,C.y1-.45,Math.PI);
  for(let x=C.x1+.5;x<=C.x2+.5;x+=2)add('monitor',x,C.y2+1.45,0);
  for(const [x,y] of [[C.x1-.55,11],[C.x1-.55,13],[C.x2+1.55,11],[C.x2+1.55,13]])
    add('pipe',x,y,Math.PI/2,{length:9});
  add('sign',C.x1+4.5,C.y1-.48,Math.PI,{label:'THE HEART'});
  for(const [x,y] of [[22,9],[22,15],[42,9],[42,15]])
    add('lamp',x,y,0,{color:'#ff3e70',seed:seed++});
  add('arch',32.5,4.5,0,{label:'EXIT'});
  add('sign',H.x1+.03,12,Math.PI/2,{label:'PLANT / HEART'});
  add('sign',H.x2+.97,12,-Math.PI/2,{label:'EAST RISER'});
  for(let y=8;y<=16;y+=3){add('shrouded',17.4,y,0,{seed:seed++});add('shrouded',47.6,y,0,{seed:seed++});}

  /* --- the riser and the staff run ------------------------------------- */
  for(let y=13;y<=47;y+=4)add('shrouded',51.5,y,0,{seed:seed++});
  add('sign',49.03,20,Math.PI/2,{label:'EAST RISER'});
  add('arch',37.5,49.5,Math.PI/2,{label:'STAFF'});
  add('sign',38,48.03,0,{label:'STAFF ONLY'});

  /* --- the aftermath --------------------------------------------------- */
  for(let x=8;x<=56;x+=8)add('pipe',x,HW_AFTER.y1+.4,0,{length:7});
  add('sign',20,HW_AFTER.y1+.03,0,{label:'MAIN ENTRANCE'});
  add('sign',44,HW_AFTER.y1+.03,0,{label:'MAIN ENTRANCE'});
  add('arch',56.5,2.5,Math.PI/2,{label:'MAIN ENTRANCE'});

  hwLights();
  rebuildFurniture();
}

/* Reception and the rooms are lit as they were when the power came back on in
   Admissions. The spine is lit as Fever lit it. The Heart is lit by its own
   core and nothing else, and the aftermath is daylight-cold and even. */
function hwLights(){
  wardLights=[];
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  const R=HW_RECEPTION;
  L(26,53,[1.00,.96,.86]); L(20,55,[1.00,.96,.86]); L(32,55,[1.00,.96,.86]);
  L(26,50,[.80,.86,.84]);  L(26,60,[.62,.60,.56]);
  L(14,53,[.44,.50,.54]);
  // The recognition is the content, so the whole hall has to be legible - the
  // counter, the seating and the columns are what the player is meant to know.
  for(const x of [19,25,31])for(const y of [50,54,57])L(x,y,[.50,.48,.44]);
  for(let y=13;y<=53;y+=7.5)L(11.5,y,[.50,.62,.72]);        // the spine, Fever's light
  for(const r of HW_ROOMS)L((r.x1+r.x2+1)/2,(r.y1+r.y2+1)/2,[.62,.80,.78]);
  const C=HW_CORE, on=HW.phase!=='after';
  for(let x=C.x1;x<=C.x2+1;x+=3){                            // the core is the light
    L(x,C.y1-1.2, on?[1.15,.34,.52]:[.16,.20,.26]);
    L(x,C.y2+2.2, on?[1.15,.34,.52]:[.16,.20,.26]);
  }
  // the flanks are where the fight actually happens, so they get enough light
  // to read the roles apart, and no more - the core stays the brightest thing
  for(const x of [19,23,41,45])for(const y of [8,12,16])
    L(x,y, on?[.40,.34,.40]:[.20,.24,.28]);
  for(let y=14;y<=46;y+=8)L(50.5,y,[.26,.30,.36]);           // the riser
  L(43,49,[.36,.40,.44]);
  for(let x=8;x<=58;x+=7)L(x,2,[.86,.90,.96]);               // the aftermath, cold and even
  L(60.5,2.5,[1.30,1.34,1.40]);                              // and daylight in the porch
  horrorLights();
  bakeLightField();
}

/* ------------------------------------------------------------- population */
/* Reception and the lobby stay EMPTY. The chapter opens on recognising a room,
   and it cannot do that with something standing in it. The first creature is
   past the security door, which is also the first thing that is wrong. */
const HW_RESIDENTS=[
  [11.5,14.5,0],[11.5,26.5,1],[11.5,38.5,0],[11.5,46.5,1],   // the sterile spine
  [6,18.5,0],[6,30.5,0],[6,42.5,0],[6,48.5,1],               // in the patient rooms
  [50.5,14.5,1],[50.5,28.5,0],[50.5,44.5,1],                 // the east riser
  [43,49.5,0]
];
function hwPopulate(){
  enemies=[];drops=[];
  for(const [x,y,t] of HW_RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  drops.push({x:6,y:24.5,type:'life',life:999});
  drops.push({x:6,y:36.5,type:'ammo',life:999});
  drops.push({x:50.5,y:34.5,type:'ammo',life:999});     // the riser pays, if you can use it
  drops.push({x:19,y:12,type:'life',life:999});
  drops.push({x:45,y:12,type:'ammo',life:999});
}
function hwSetObjective(phase){
  HW.phase=phase;
  HW.objective =
    phase==='arrive' ? 'FIND THE HEART' :
    phase==='heart'  ? 'DESTROY THE HEART' :
                       'THE WAY OUT IS OPEN';
  hudUpdate();
}
function hwBegin(){
  HW.on=true;HW.ending=false;HW.wave=0;HW.waveT=0;HW.live=false;
  HW.warden=null;HW.resolved=false;HW.staff=false;HW.arrival=30;
  HW.tension=0;HW.intensity=0;
  cleared=false;exit={...HW_EXIT};
  player.x=26.5;player.y=61.5;player.a=-Math.PI/2;
  _safeX=player.x;_safeY=player.y;
  // the discovery payoff: chapter one's flags survive into chapter three
  if(typeof CH!=='undefined'&&CH.flags&&CH.flags.annexe)hwOpenStaff();
  hwSetObjective('arrive');
  audio.tension(0);audio.theatre(false);audio.heart(0);
  hwLights(); // Rebuild the visual state after a replay of the resolved Heart.
  HW.checkpoint=null;hwSave();
}
function hwSave(){
  const {checkpoint,warden,...state}=HW;
  HW.checkpoint={state:{...state},boss:hbSnapshot(),map:map.map(row=>row.slice()),
    enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),
    x:player.x,y:player.y,a:player.a,hp:player.hp,
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,stageKills,gameTime,stageTime,maxCombo,enemyId};
}
function hwRestore(){
  const c=HW.checkpoint;if(!c)return;
  hideOverlays();audio.reset();useChapter=true;loadStage(2);
  map=c.map.map(row=>row.slice());Object.assign(HW,c.state);
  enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));
  hbRestoreSnapshot(c.boss);HW.warden=enemies.find(e=>e.type===3&&e.hwSeen)||null;
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;stageKills=c.stageKills;gameTime=c.gameTime;stageTime=c.stageTime;maxCombo=c.maxCombo;enemyId=c.enemyId;
  HW.checkpoint=c;HW.arrival=0;cleared=HB.state==='dead';
  buildFlow();mode='playing';document.body.classList.add('playing');
  if(HB.state==='dormant'&&hbSafeEntry())hbStart(HB.hp/HB.maxHp,true,HB.training);
  else if(hbFighting())hbUpdatePhase(true);
  else{audio.heart(0);if(hbVictory())audio.heartSilenceMusic();}
  if(HB.state==='dead')audio.heartAftermath();
  hwLights();hudUpdate();$('touch').classList.remove('hidden');audio.start();lockPointer();feed('RESUMED FROM CHECKPOINT');
}
/* the peak resolves rather than stopping: everything drops away, and the thing
   that delivered you in chapter one is standing in front of the way out. */
function hwResolve(silent){
  if(HW.resolved||!HB.active||HB.state!=='dead')return;
  HW.resolved=true;HW.live=false;
  const w=spawn(32.5,7.5,3);w.dormant=true;w.noticed=false;w.hwSeen=true;HW.warden=w;
  HW.intensity=0;audio.heart(0);audio.tension(0);
  hwOpenWayOut();cleared=true;
  hwSetObjective('after');hwLights();
  if(!silent){
    say('THE HEART IS DEAD.',2.4);
    feed('THE WAY OUT IS OPEN');
  }
  hwSave();
}
function hwComplete(){
  if(HW.ending)return;HW.ending=true;
  score+=6000+Math.round(player.hp*22);
  audio.heart(0);
  finish(true);
  $('endLabel').textContent='THREE WARDS / ONE SURVIVOR';
  $('endTitle').textContent='DISCHARGED.';
  $('endReason').textContent='Admissions, Fever Theatre, the Heart. The hospital is quiet. The front doors are finally open.';
  $('leaveHospitalBtn').classList.remove('hidden');
}
/* Fever now hands over here instead of ending the build. */
function fvHandOver(){
  if(FV.ending)return;FV.ending=true;
  score+=3500+Math.round(player.hp*14);
  audio.theatre(false);
  say('',0);feed('ONE WARD LEFT');
}

/* ------------------------------------------------------------------- tick */
function hwTick(dt){
  if(!hwRunning())return;
  if(HW.arrival>0){HW.arrival-=dt;if(player.y<58)HW.arrival=0;}
  if(HB.state==='dormant'&&hbSafeEntry())hbStart();
  hbTick(dt);
  const w=HW.warden;
  if(HW.resolved&&w&&player.y<9.5&&Math.abs(player.x-32.5)<4)w.x=mix(w.x,36.4,1-Math.exp(-dt*2.2));
}

/* ------------------------------------------------ Test Ward entry points */
function hwJumpTo(where){
  if(where==='spine'){player.x=11.5;player.y=52;player.a=-Math.PI/2;}
  else if(where==='rooms'){player.x=11.5;player.y=30.5;player.a=Math.PI;}
  else if(where==='heart'){player.x=14.5;player.y=11.5;player.a=0;}
  else if(['finale','peak','rupture','target','death','bloodwell','bloodfan'].includes(where)){
    player.x=24.5;player.y=15.5;player.a=-.58;
    const practice=where==='bloodwell'?'well':where==='bloodfan'?'fan':'';
    if(practice){HB.attackPractice=practice;HB.attackT=1.5;enemies=[];}
    hbStart(where==='peak'||where==='bloodfan'?.29:where==='rupture'||where==='bloodwell'?.64:where==='death'?1/HB.maxHp:1,true,where==='target');
  }else if(where==='after'){
    player.x=24.5;player.y=15.5;player.a=-.58;hbSkip();
  }else if(where==='staff'){hwOpenStaff();player.x=34;player.y=49.5;player.a=0;}
  HW.arrival=0;_safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();
}

/* ---------------------------------- walkability, through the furniture too */
const HW_WAY={
  lobby:[26,61], reception:[26,53], counter:[35,52], alcove:[14,53],
  spineS:[11,52], spineMid:[11,32], spineN:[11,12],
  w01:[6,18], w03:[6,30], w06:[6,48],
  approach:[14,11], heartW:[19,12], heartN:[32,8], heartS:[32,15], heartE:[46,12],
  riserN:[50,12], riserS:[50,48], staffRun:[44,49],
  afterW:[8,2], afterE:[56,2], porch:[60,2]
};
function hwValidate(from,withStaff){
  if(withStaff)hwOpenStaff();
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
  for(const n in HW_WAY){
    const [wx,wy]=HW_WAY[n];let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok',cells:seen.size,reached,stuck,lostDrops};
}

/* ---------------------------------------------------------------- the room
   "Let sound reveal what kind of place it has become." The Heart has a pulse,
   and the pulse is the only thing in the game that speeds up as you lose. It
   is scaled by wave, and at the resolution it stops - which is what the
   aftermath corridor is for. */
audio.ensureHeart=function(){
  if(this.hrt||!this.ctx)return;
  const a=this.ctx,out={};
  // a low double-thump on a slow LFO: a pump, not a heart, but close enough
  out.pulse=a.createGain();out.pulse.gain.value=.0001;
  const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;lp.Q.value=1.4;
  for(const [f,g] of [[41,.42],[62,.18],[27,.30]]){
    const o=a.createOscillator();o.type='sine';o.frequency.value=f;
    const gg=a.createGain();gg.gain.value=g;o.connect(gg).connect(lp);o.start();
  }
  const beat=a.createGain();beat.gain.value=0;
  out.rate=a.createOscillator();out.rate.type='sawtooth';out.rate.frequency.value=.75;
  const beatAmt=a.createGain();beatAmt.gain.value=.45;
  const beatBias=a.createConstantSource();beatBias.offset.value=.45;
  out.rate.connect(beatAmt).connect(beat.gain);beatBias.connect(beat.gain);out.beatAmt=beatAmt;out.beatBias=beatBias;
  lp.connect(beat).connect(out.pulse).connect(this.music);
  out.rate.start();beatBias.start();

  // and a wide metallic shimmer over it, so the hall sounds like a hall
  const len=a.sampleRate*4,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  let last=0;for(let i=0;i<len;i++){last=(last+rand(-1,1)*.18)*.96;d[i]=last;}
  const n=a.createBufferSource();n.buffer=buf;n.loop=true;
  const hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=2400;
  out.air=a.createGain();out.air.gain.value=.0001;
  n.connect(hp).connect(out.air).connect(this.music);n.start();
  this.hrt=out;
};
/* t = 0 is the ward and the aftermath, 1 is the peak of the finale */
audio.heart=function(t){
  if(!this.ctx)return;
  this.ensureHeart();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime,T=.9;
  const synced=hbFighting();
  this.hrt.beatAmt.gain.setValueAtTime(synced?0:.45,now);this.hrt.beatBias.offset.setValueAtTime(synced?1:.45,now);
  this.hrt.pulse.gain.setTargetAtTime(synced?.0001:Math.max(.0001,t*.52),now,T);
  this.hrt.air.gain.setTargetAtTime(Math.max(.0001,t*.16),now,T);
  this.hrt.rate.frequency.setTargetAtTime(mix(.62,1.55,t),now,T*2);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.25,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,2400,t),now,T);
  const want=t>.35?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};
audio.heartFrame=function(pulse,intensity){
  if(!this.ctx||!this.hrt||!hbFighting())return;
  const now=this.ctx.currentTime,gain=this.hrt.pulse.gain;
  gain.cancelScheduledValues(now);gain.setTargetAtTime(Math.max(.0001,pulse*intensity*.52),now,.012);
};

