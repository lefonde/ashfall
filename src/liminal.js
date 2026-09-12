// liminal.js — bundled from the owner’s liminal baseline.
/* ==================================================================
   LIMINAL SYSTEM  -  crossover state, the two corridors, the mirror
   ================================================================== */
const lightActive=new Float32Array(128*128*3);
const hidden=new Uint8Array(MW*MH);          // cells the minimap must not admit
let LIM_CEIL=.68;
/* each liminal space gets its own identity. the corridors are NOWHERE - flat
   sodium, uniform walls, no source. the mirror is the ward you already know,
   drained and reversed, so it keeps the ward's own lighting shape. */
const LIM_ASH=[.20,.20,.21], LIM_SODIUM=[1.31,1.27,.93], LIM_COLD=[1.12,1.24,1.46];
const LIM_LOOK={
  fed   :{tint:LIM_ASH    ,flat:1  ,uniform:true ,fog:[7,7,9]   ,ceil:.5 ,flicker:'fluor'},
  loop  :{tint:LIM_SODIUM ,flat:1  ,uniform:true ,fog:[31,32,25],ceil:1.55},
  mirror:{tint:LIM_COLD   ,flat:.72,uniform:false,fog:[16,20,30],ceil:.92},  deep  :{tint:[.62,.66,.63],flat:.88,uniform:true ,fog:[12,14,13],ceil:2.1}
};
let LIM_TINT=LIM_SODIUM, LIM_FLAT_AMT=1, LIM_UNIFORM=true, LIM_FOG=[31,32,25];
let LIM_FLICKER='none', LIM_FLICK=1;

const liminal={mix:0,target:0,mode:null,fed:null,loop:null,mirror:null,
               baked:-1,cool:0,fedUsed:false,loopUsed:false,dark:0};

function bakeLightActive(){
  const m=clamp(liminal.mix,0,1)*LIM_FLAT_AMT;
  for(let i=0;i<49152;i+=3){
    lightActive[i]  =mix(lightField[i]  ,LIM_TINT[0],m);
    lightActive[i+1]=mix(lightField[i+1],LIM_TINT[1],m);
    lightActive[i+2]=mix(lightField[i+2],LIM_TINT[2],m);
  }
  liminal.baked=clamp(liminal.mix,0,1);
  horrorBakeLight();
}
/* THE WARDEN's art: the Unstitched, bleached flat and drawn too tall.
   Same maw, wrong proportions, no neon - it belongs to the corridor, not the ward. */
function buildWardenSprite(){
  const src=monsterSprites[0];if(!src)return;
  const w=src.image.width,h=src.image.height;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(src.image,0,0);
  const img=g.getImageData(0,0,w,h),px=img.data;
  for(let i=0;i<px.length;i+=4){
    if(px[i+3]<8)continue;
    const L=px[i]*.299+px[i+1]*.587+px[i+2]*.114;
    px[i]  =clamp(26+L*.40,0,255);   // dark and low contrast: a shape in the gloom,
    px[i+1]=clamp(27+L*.40,0,255);   // not a portrait. the ramp below does the rest.
    px[i+2]=clamp(25+L*.39,0,255);
  }
  g.putImageData(img,0,0);
  const hit=document.createElement('canvas');hit.width=w;hit.height=h;
  const hc=hit.getContext('2d');hc.drawImage(c,0,0);
  hc.globalCompositeOperation='source-atop';hc.fillStyle='#fff5d6';hc.fillRect(0,0,w,h);
  monsterSprites[3]={image:c,hit,aspect:src.aspect*.72};
}
function rebuildFurniture(){
  furniture=environmentProps.filter(p=>['bed','shrouded','monitor'].includes(p.kind))
    .map(p=>({...p,hx:p.kind==='monitor'?.17:.6,hy:p.kind==='monitor'?.17:.16,c:Math.cos(p.a),s:Math.sin(p.a)}));
  furnitureIndex();
}
function bakeLightField(){
  // 128x128 over a 64-unit world. Falloff is 0.85/(1+d^2*0.25), which is under
  // 1% of peak past ~18 units, so culling there is free and keeps the bake
  // proportional to nearby lights instead of every light on the floor.
  const CULL=18*18;
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
    const wx=(x+.5)/2,wy=(y+.5)/2,i=(y*128+x)*3;let r=.23,g=.29,b=.33;
    for(const l of wardLights){
      const dx=wx-l.x,dy=wy-l.y,d2=dx*dx+dy*dy;
      if(d2>CULL)continue;
      const fall=.85/(1+d2*.25);
      r+=l.rgb[0]*fall;g+=l.rgb[1]*fall;b+=l.rgb[2]*fall;}
    lightField[i]=r;lightField[i+1]=g;lightField[i+2]=b;
  }
  bakeLightActive();
}
function liminalReset(){
  audio.restoreRoom();flinchUntil=0;LIM_FLICKER='none';LIM_FLICK=1;
  liminal.mix=liminal.target=0;liminal.mode=null;liminal.fed=null;liminal.loop=null;
  liminal.mirror=null;liminal.cool=0;liminal.dark=0;liminal.baked=-1;
  liminal.fedUsed=false;liminal.loopUsed=false;mirrorLatch=false;
  LIM_CEIL=.68;LIM_TINT=LIM_SODIUM;LIM_FLAT_AMT=1;LIM_UNIFORM=true;LIM_FOG=[31,32,25];hidden.fill(0);
  document.body.classList.remove('liminal');
}
function liminalEnter(mode){
  const L=LIM_LOOK[mode]||LIM_LOOK.fed;
  LIM_TINT=L.tint;LIM_FLAT_AMT=L.flat;LIM_UNIFORM=L.uniform;LIM_FOG=L.fog;LIM_CEIL=L.ceil;
  LIM_FLICKER=L.flicker||'none';
  liminal.mode=mode;liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');audio.crossover(true);
}
function liminalLeave(){liminal.target=0;liminal.mode=null;LIM_FLICKER='none';LIM_FLICK=1;document.body.classList.remove('liminal');audio.crossover(false);}

function liminalTick(dt){
  if(mode!=='playing'||s4Running())return;
  const rate=dt/.85;
  liminal.mix=clamp(liminal.mix+clamp(liminal.target-liminal.mix,-rate,rate),0,1);
  if(Math.abs(liminal.mix-liminal.baked)>.015)bakeLightActive();
  liminal.dark=Math.max(0,liminal.dark-dt*2.2);
  // a failing fluorescent tube: harsh, irregular, never settles
  if(LIM_FLICKER==='fluor'&&!settings.reduce){
    // long steady stretches, then a brief stutter. rare, not rhythmic.
    const stutter=(Math.sin(nowTime*1.31)>.993||Math.sin(nowTime*.79)>.997)?.5:1;
    LIM_FLICK=(.975+.025*Math.sin(nowTime*.6))*stutter;
  }else LIM_FLICK=1;
  if(liminal.cool>0)liminal.cool-=dt;
  if(mode!=='playing')return;
  if(liminal.mirror){
    // the world is flipped in here: corridor coordinate tests would read as
    // "walked out" and tear down the space you are standing in. freeze them.
    mirrorUpdate(dt);
  }else{
    if(liminal.fed)fedUpdate(dt);
    if(liminal.loop)loopUpdate(dt);
    if(!liminal.mode&&reviewAllowLiminal()&&!chRunning()&&!fvRunning()&&!hwRunning()){fedTrigger();loopTrigger();}
  }
  if(!chRunning()&&!fvRunning()&&!hwRunning())mirrorTrigger();
}

/* ---------- 02 · THE CORRIDOR YOU ARE FED DOWN ------------------- */
const FED={y:9,x0:5,x1:16,renews:1};   // renews: how many times the corridor refuses to end
function fedCarve(open){
  for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=open?0:1;hidden[FED.y*MW+x]=open?1:0;}
  if(open)audio.opening(FED.x0+.5,FED.y+.5);
  buildFlow();
}
function fedTrigger(){
  if(liminal.fedUsed||liminal.fed)return;
  if(player.hp<40&&!review.active)return;                       // never strand a dying player
  if(player.x<3.0||player.x>5.0||player.y<6.8||player.y>11.2)return;
  fedCarve(true);
  // it stays open. an opening that shuts while you run past it is an opening
  // nobody ever finds - which is exactly what the last build did.
  liminal.fed={armed:true,locked:false,ending:0,warden:null,breath:1.4,
               stretch:0,settled:false,backWall:FED.x0,entry:{x:player.x,y:player.y,a:player.a}};
  liminal.fedUsed=true;
}
function fedSealBehind(f){
  // only the entrance goes: the back wall walks forward with you.
  const upto=Math.floor(player.x-1.3);
  if(upto<f.backWall)return;
  for(let x=f.backWall;x<=upto&&x<=FED.x1;x++){map[FED.y][x]=1;hidden[FED.y*MW+x]=1;}
  f.backWall=upto+1;
  buildFlow();
}
function fedUpdate(dt){
  const f=liminal.fed;
  if(f.armed&&!f.locked){
    if(player.x>FED.x0+1.4&&player.y>FED.y+.05&&player.y<FED.y+.95){  // in the corridor, not merely east of it
      f.locked=true;
      f.entry={x:4.5,y:9.5,a:Math.PI};
      const w=spawn(FED.x1-.6,FED.y+.5,3);
      w.dormant=true;w.noticed=false;f.warden=w;
      liminalEnter('fed');            // low ceiling comes with the space
      say('',0);
    }
    return;                                     // no auto-close: it waits for you
  }
  fedSealBehind(f);
  if(f.ending){
    f.ending-=dt;
    if(f.ending<=0){
      if(f.warden){f.warden.alive=false;const i=enemies.indexOf(f.warden);if(i>=0)enemies.splice(i,1);}
      fedCarve(false);
      for(let x=FED.x0;x<=FED.x1;x++)hidden[FED.y*MW+x]=0;   // scoped: never touch the other corridor
      player.x=f.entry.x;player.y=f.entry.y;player.a=f.entry.a;player.vx=player.vy=0;
      liminal.fed=null;liminalLeave();LIM_CEIL=.68;
      buildFlow();
    }
    return;
  }
  // a single breath from the far end, before you can see what it is
  f.breath-=dt;
  if(f.breath<=0&&f.warden){f.breath=rand(3.4,6.2);audio.play(audio.choose('breath',3),{vol:.72,pos:f.warden,wet:.72,rate:.72});}

  if(f.stretch<FED.renews){
    // it stays ahead of you, and the corridor renews behind the seam.
    // uniform walls + flat light mean there is nothing to see the join by.
    if(f.warden)f.warden.x=Math.min(player.x+6.0,FED.x1+.2);
    if(player.x>FED.x1-2.4&&player.y>FED.y&&player.y<FED.y+1){
      for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=0;hidden[FED.y*MW+x]=1;}
      f.backWall=FED.x0;
      player.x=FED.x0+1.6;f.stretch++;buildFlow();
    }
    return;
  }
  if(f.warden&&!f.settled){f.settled=true;f.warden.x=FED.x1-.6;}
  // it steps aside
  if(f.warden&&player.x>FED.x1-3.2){
    f.warden.y=mix(f.warden.y,FED.y+.16,1-Math.exp(-dt*2.4));
  }
  if(player.x>FED.x1+.4&&player.y>FED.y&&player.y<FED.y+1&&!f.ending){f.ending=.55;liminal.dark=1;}
}

/* ---------- 01 · THE CORRIDOR THAT KEEPS GOING ------------------- */
const LOOP={y:18,x0:14,x1:18};
function loopCarve(open){
  for(let x=LOOP.x0;x<=LOOP.x1;x++){map[LOOP.y][x]=open?0:1;hidden[LOOP.y*MW+x]=open?1:0;}
  if(open)audio.opening(LOOP.x0+.5,LOOP.y+.5);
  buildFlow();
}
function loopTrigger(){
  if(liminal.loopUsed||liminal.loop)return;
  if(player.x<12.1||player.x>13.9||player.y<17.2||player.y>19.4)return;
  loopCarve(true);
  liminal.loop={lap:0,inside:false};
  liminal.loopUsed=true;
}
function loopUpdate(dt){
  const L=liminal.loop;
  if(!L.inside){
    if(player.x>LOOP.x0+.6&&player.y>LOOP.y+.05&&player.y<LOOP.y+.95){L.inside=true;liminalEnter('loop');}
    return;                                     // stays open until you take it
  }
  // east end: you are quietly returned to the west end
  if(player.x>LOOP.x1+.62){
    player.x=LOOP.x0+.35;
    L.lap++;
    if(L.lap===1)feed('');
    if(L.lap===2&&!environmentProps.some(p=>p.kind==='mirror')){
      environmentProps.push({kind:'mirror',x:LOOP.x1+.62,y:LOOP.y+.5,a:0});
    }
  }
  // walking back out is the way out
  if(player.x<LOOP.x0-.35){
    loopCarve(false);
    for(let x=LOOP.x0;x<=LOOP.x1;x++)hidden[LOOP.y*MW+x]=0;   // scoped
    liminal.loop=null;liminalLeave();LIM_CEIL=.68;
    environmentProps=environmentProps.filter(p=>p.kind!=='mirror'||p.permanent);
    buildFlow();
  }
}

/* ---------- 03 · THE MIRROR -------------------------------------- */
let mirrorLatch=false;const mirrorGate={x:0,y:0};
function mirrorTrigger(){
  const p=environmentProps.find(q=>q.kind==='mirror'&&Math.hypot(q.x-player.x,q.y-player.y)<.62);
  if(mirrorLatch){
    // the latch has to outlive the crossing, or stepping out steps straight back in
    if(!p&&Math.hypot(player.x-mirrorGate.x,player.y-mirrorGate.y)>1.9)mirrorLatch=false;
    return;
  }
  if(!p)return;
  mirrorLatch=true;mirrorGate.x=p.x;mirrorGate.y=p.y;
  if(liminal.mirror)mirrorExit();else mirrorEnter(p);
}
function flipWorld(){
  const src=map.map(r=>r.slice());
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map[y][x]=src[y][MW-1-x];
  const hs=hidden.slice();
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)hidden[y*MW+x]=hs[y*MW+(MW-1-x)];
  environmentProps=environmentProps.map(p=>({...p,x:MW-p.x,a:Math.PI-p.a}));
  wardLights=wardLights.map(l=>({...l,x:MW-l.x}));
  rebuildFurniture();bakeLightField();
  for(const e of enemies)e.x=MW-e.x;
  for(const arr of [decals,drops,bullets,particles,rings,tracers,numbers])for(const o of arr){
    o.x=MW-o.x;if(Number.isFinite(o.a))o.a=angle(Math.PI-o.a);if(Number.isFinite(o.vx))o.vx=-o.vx;
  }
  for(const e of enemies)if(Number.isFinite(e.dx))e.dx=-e.dx;
  for(const v of audio.voices)if(v.pos)v.pos.x=MW-v.pos.x;
  player.vx=-player.vx;
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);_safeX=player.x;_safeY=player.y;
  exit.x=MW-exit.x;
  buildFlow();
}
function mirrorEnter(p){
  if(liminal.mode&&liminal.mode!=='loop')return;
  const wasLoop=!!liminal.loop;
  flipWorld();
  const gate=environmentProps.find(q=>q.kind==='mirror');
  liminal.mirror={gate:{x:gate.x,y:gate.y},wasLoop,killed:0,spared:0};
  mirrorGate.x=gate.x;mirrorGate.y=gate.y;
  for(const e of enemies){e.cower=0;e.noticed=false;e.windup=0;e.charge=0;}
  liminalEnter('mirror');
  say('',0);
}
function mirrorExit(){
  const m=liminal.mirror;
  flipWorld();
  liminal.mirror=null;
  const g=environmentProps.find(q=>q.kind==='mirror');
  if(g){mirrorGate.x=g.x;mirrorGate.y=g.y;}
  for(const e of enemies){e.cower=0;e.noticed=false;}
  flinchUntil=nowTime+15;
  if(m.wasLoop&&liminal.loop){liminalEnter('loop');}
  else{liminalLeave();LIM_CEIL=.68;liminal.cool=20;}
}
let flinchUntil=0;
function mirrorUpdate(dt){}
function mirrorEnemy(e,dt){
  e.hurt=Math.max(0,e.hurt-dt);e.vocal-=dt;e.walk+=dt;
  const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||.01;
  if(e.vocal<=0&&d<12){audio.mirrorVoice(e);e.vocal=rand(1.1,3.6);}
  e.cower=clamp((e.cower||0)+(d<2.6?dt*2.6:-dt*1.6),0,1);
  if(e.cower>.55||d>14)return;
  const ix=e.x|0,iy=e.y|0;let best=flow[iy*MW+ix],tx=e.x,ty=e.y;
  for(const [xx,yy] of [[ix+1,iy],[ix-1,iy],[ix,iy+1],[ix,iy-1]]){
    if(xx<0||yy<0||xx>=MW||yy>=MH)continue;
    const v=flow[yy*MW+xx];
    if(v>=0&&(v>best||best<0)){best=v;tx=xx+.5;ty=yy+.5;}
  }
  let mx=tx-e.x,my=ty-e.y;const dd=Math.hypot(mx,my)||1;mx/=dd;my/=dd;
  for(const o of enemies){if(!o.alive||o===e)continue;
    const ox=e.x-o.x,oy=e.y-o.y,sep=Math.hypot(ox,oy);
    if(sep>.02&&sep<.55){mx+=ox/sep*(.55-sep)*2;my+=oy/sep*(.55-sep)*2;}}
  move(e,mx*creatureTypes[e.type].speed*.92*dt,my*creatureTypes[e.type].speed*.92*dt);
}

/* ---------- audio: crossover, drone, the borrowed human voice ---- */
audio.ensureDrone=function(){
  if(this.droneGain||!this.ctx)return;
  const a=this.ctx;
  const g=a.createGain();g.gain.value=.0001;
  const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=240;f.Q.value=7;
  const o1=a.createOscillator();o1.type='sawtooth';o1.frequency.value=54.5;
  const o2=a.createOscillator();o2.type='sawtooth';o2.frequency.value=55.3;
  const o3=a.createOscillator();o3.type='sine';o3.frequency.value=27.4;
  const lfo=a.createOscillator();lfo.type='sine';lfo.frequency.value=.045;
  const lg=a.createGain();lg.gain.value=95;
  lfo.connect(lg).connect(f.frequency);
  o1.connect(f);o2.connect(f);o3.connect(f);f.connect(g).connect(this.music);
  for(const o of [o1,o2,o3,lfo])o.start();
  this.droneGain=g;
};
/* ---- the annexe's own bed: sub, air, and a slow detuned pad ------------- */
audio.ensureAnnexe=function(){
  if(this.anx||!this.ctx)return;
  const a=this.ctx, out={};

  // 1. air: looping noise through a bandpass that drifts. the room tone of a
  //    building that does not have any windows.
  const len=a.sampleRate*4, buf=a.createBuffer(1,len,a.sampleRate), d=buf.getChannelData(0);
  let last=0;
  for(let i=0;i<len;i++){last=(last+rand(-1,1)*.22)*.94;d[i]=last;}
  const noise=a.createBufferSource();noise.buffer=buf;noise.loop=true;
  const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=1.3;
  const sweep=a.createOscillator();sweep.type='sine';sweep.frequency.value=.031;
  const sweepAmt=a.createGain();sweepAmt.gain.value=280;
  sweep.connect(sweepAmt).connect(bp.frequency);
  out.air=a.createGain();out.air.gain.value=.0001;
  noise.connect(bp).connect(out.air).connect(this.music);

  // 2. pad: two voices a fifth apart, detuned, swelling very slowly. this is
  //    what actually reads as "different music" rather than "no music".
  const pad=a.createGain();pad.gain.value=.0001;
  const padFilter=a.createBiquadFilter();padFilter.type='lowpass';
  padFilter.frequency.value=900;padFilter.Q.value=.8;
  for(const [f,type] of [[110,'triangle'],[110.6,'triangle'],[164.8,'sine'],[220,'sine']]){
    const o=a.createOscillator();o.type=type;o.frequency.value=f;
    const g=a.createGain();g.gain.value=f>200?.06:.13;
    o.connect(g).connect(padFilter);o.start();
  }
  const swell=a.createOscillator();swell.type='sine';swell.frequency.value=.023;
  const swellAmt=a.createGain();swellAmt.gain.value=260;
  swell.connect(swellAmt).connect(padFilter.frequency);
  out.pad=pad;padFilter.connect(pad).connect(this.music);

  noise.start();sweep.start();swell.start();
  this.anx=out;
};
/* t = 0 is the ward and its score, t = 1 is the annexe. Everything in between
   is a real position on the crossfade, driven by where you are in the spiral. */
audio.annexe=function(t){
  if(!this.ctx)return;
  this.ensureAnnexe();this.ensureDrone();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime, T=.18;
  this.musicBed.gain.setTargetAtTime(Math.max(.0001,1-t*1.15),now,T);
  this.droneGain.gain.setTargetAtTime(Math.max(.0001,t*.58),now,T);
  this.anx.air.gain.setTargetAtTime(Math.max(.0001,t*t*.55),now,T);
  this.anx.pad.gain.setTargetAtTime(Math.max(.0001,Math.pow(t,1.5)*.62),now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*mix(.19,.03,t),now,T);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.3,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,1700,t),now,T);
  this.musicTone.frequency.setTargetAtTime(mix(11500,2600,t),now,T);
  const want=t>.5?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};
audio.crossover=function(on){
  if(!this.ctx)return;
  this.ensureDrone();
  const t=this.ctx.currentTime;
  this.musicBed.gain.setTargetAtTime(on?.0001:1,t,.42);
  this.droneGain.gain.setTargetAtTime(on?.42:.0001,t,.55);
  this.ambience.gain.setTargetAtTime(on?settings.sfx*.03:settings.sfx*.19,t,.5);
  this.roomReturn.gain.setTargetAtTime(on?1.15:.62,t,.5);
  this.roomTone.frequency.setTargetAtTime(on?2100:3700,t,.5);
  try{this.room.buffer=on?this.impLong:this.impShort;}catch(e){}
};
audio.opening=function(x,y){
  if(!this.active||!this.ctx)return;
  this.play(this.choose('environment',4),{vol:.8,pos:{x,y},wet:.85,rate:.55});
  this.play('seal',{vol:.3,pos:{x,y},wet:.9,rate:.42});
};
audio.mirrorVoice=function(e){
  if(!this.active||!this.ctx)return;
  const r=Math.random();
  const key=r<.46?this.choose('pain',4):r<.78?this.choose('breath',3):'gasp';
  this.play(key,{vol:.66,pos:e,follow:e,rate:rand(.86,1.08),wet:.55});
};
/* trope 01 - a voice from a room with nothing in it */
audio.sourceless=function(){
  if(!this.active||!this.ctx||!environmentProps.length)return;
  for(let i=0;i<10;i++){
    const p=environmentProps[(Math.random()*environmentProps.length)|0];
    const d=Math.hypot(p.x-player.x,p.y-player.y);
    if(d<3.5||d>11)continue;
    if(enemies.some(e=>e.alive&&Math.hypot(e.x-p.x,e.y-p.y)<3.5))continue;
    this.play(this.choose(Math.random()<.5?'patient':'crawler',3),
              {vol:.6,pos:{x:p.x,y:p.y},wet:.72,rate:rand(.82,.96)});
    return;
  }
};
(function(){
  const baseKill=audio.kill.bind(audio);
  audio.kill=function(e){
    if(liminal.mode==='mirror'){
      this.flesh(e,true);
      this.play(Math.random()<.55?'agony':this.choose('pain',4),{vol:.9,pos:e,wet:.5,rate:rand(.9,1.05)});
      return;
    }
    baseKill(e);
  };
  const baseCreature=audio.creature.bind(audio);
  audio.creature=function(e,attack){
    if(e.type===3)return;                       // the Warden does not vocalise
    if(liminal.mode==='mirror')return this.mirrorVoice(e);
    baseCreature(e,attack);
  };
  audio.sourcelessClock=6;
  const baseTick=audio.tick.bind(audio);
  audio.tick=function(dt=0){
    baseTick();
    if(mode!=='playing'||!this.active)return;
    this.sourcelessClock-=dt;
    if(this.sourcelessClock<=0){this.sourcelessClock=liminal.mix>.4?rand(4,8):rand(16,30);this.sourceless();}
  };
})();

/* ---------- flinch: the fifteen seconds after you come back ------ */
(function(){
  const baseHurt=hurtPlayer;
  window.__baseHurt=baseHurt;
})();

/* tear down whatever is live and put the geometry back, so testing one
   set-piece can never leave another one half-carved */
function liminalHardReset(){
  if(liminal.fed&&liminal.fed.warden){
    const i=enemies.indexOf(liminal.fed.warden);if(i>=0)enemies.splice(i,1);
  }
  if(liminal.mirror){flipWorld();liminal.mirror=null;}
  for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=1;hidden[FED.y*MW+x]=0;}
  for(let x=LOOP.x0;x<=LOOP.x1;x++){map[LOOP.y][x]=1;hidden[LOOP.y*MW+x]=0;}
  environmentProps=environmentProps.filter(p=>p.kind!=='mirror');
  liminal.fed=liminal.loop=null;liminal.fedUsed=liminal.loopUsed=false;
  liminal.cool=0;liminal.dark=0;mirrorLatch=false;
  liminalLeave();liminal.mix=0;liminal.target=0;
  LIM_CEIL=.68;LIM_FLICKER='none';LIM_FLICK=1;
  rebuildFurniture();bakeLightField();buildFlow();
}

/* Existing debug shortcuts are now unscored, isolated scene entry points. */
addEventListener('keydown',e=>{
 if(mode!=='playing'||e.repeat||['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;
 const scene={Digit7:'fed',Digit8:'loop',Digit9:'mirror'}[e.code];
 if(scene){if(!review.active)reviewSetPreset('explore');reviewLoad(scene);}
});


