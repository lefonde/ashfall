// R3-P03-R01: one stationary boss behind four exposed, shared-health surfaces.
const HB_MAX_HP=9000;
const HB_PORTS=[[19.5,7.5],[23.5,16.2],[32.5,7.1],[41,7.5],[45.5,16.2],[44,11.8],[20,13.6],[40,16]];
const HB={};let heartBossFaces=[];
function hbReset(){
 heartBossFaces=[];
 Object.assign(HB,{active:useChapter&&stage===2,state:'dormant',hp:HB_MAX_HP,maxHp:HB_MAX_HP,phase:1,
  introT:0,spawnT:2,births:[],spawnCount:0,lastPort:-1,gates:[],training:false,
  hitT:0,hitSoundT:0,trail:HB_MAX_HP,trailHold:0,deathT:0,burst:false,settled:false,drained:false,flowAtDeath:0,scoreBudget:4500,
  beatPhase:.08,beatCount:0,bpm:76,attack:null,attackT:4.2,attackIndex:0,attackPractice:'',birthRest:0});
 $('bossHud').classList.add('hidden');document.body.classList.remove('boss-fight');
}
function hbRunning(){return HB.active&&hwRunning();}
function hbFighting(){return hbRunning()&&(HB.state==='awakening'||HB.state==='fighting');}
function hbInside(x=player.x,y=player.y){return x>=16&&x<49&&y>=6&&y<18;}
function hbSafeEntry(){return player.x>=16.7&&player.x<=48.3&&player.y>=6.4&&player.y<=17.6;}
function hbVictory(){return hbRunning()&&(HB.state==='dying'||HB.state==='dead');}
function hbPressure(){return hbFighting()&&!HB.training&&(!review.active||review.ai);}
function hbCopyAttack(a){return a?{...a,lanes:a.lanes?.map(l=>({...l}))}:null;}
function hbSnapshot(){return {...HB,attack:hbCopyAttack(HB.attack),births:HB.births.map(b=>({...b})),gates:HB.gates.map(g=>g.slice())};}
function hbRestoreSnapshot(s){Object.assign(HB,s,{attack:hbCopyAttack(s.attack),births:s.births.map(b=>({...b})),gates:s.gates.map(g=>g.slice())});}
function hbGates(close){
 if(close){
  if(HB.gates.length)return;
  const cells=[];for(let y=10;y<=12;y++)cells.push([15,y]);for(let y=10;y<=17;y++)cells.push([49,y]);
  for(const [x,y] of cells)if(map[y][x]===0){HB.gates.push([x,y,0]);map[y][x]=4;}
 }else{for(const [x,y,v] of HB.gates)map[y][x]=v;HB.gates=[];}
 buildFlow();
}
function hbStart(fraction=1,quiet=false,training=false){
 if(!hbRunning()||HB.state!=='dormant'||!hbSafeEntry())return false;
 HB.hp=clamp(fraction,.00001,1)*HB.maxHp;HB.trail=HB.hp;HB.training=training;
 hwSave(); // Before gates close, with the exact loadout and supplies for this attempt.
 HB.state='awakening';HB.introT=quiet?.3:2;HB.spawnT=quiet?.5:1.4;
 HW.arrival=0;HW.phase='heart';HW.live=true;cleared=false;
 for(const e of enemies)if(e.alive&&e.type!==3&&hbInside(e.x,e.y)){e.hb=true;e.noticed=true;}
 hbGates(true);hbUpdatePhase(true);hbHud();
 if(!quiet){say('THE HEART',1.8);feed('DESTROY THE HEART\nKILL ITS SPAWN TO RECOVER');
  audio.play('roar0',{vol:.95,rate:.78,pos:hbSoundPoint(),wet:.65});audio.duck(.3,.75);}
 return true;
}
function hbUpdatePhase(silent=false){
 const pct=HB.hp/HB.maxHp,n=pct>.65?1:pct>.30?2:3,changed=n!==HB.phase;
 HB.phase=n;HW.wave=n;HW.intensity=n/3;HW.objective='DESTROY THE HEART';
 if(changed)HB.attackT=Math.min(HB.attackT,4.2);
 audio.heart(HW.intensity);audio.tension(1);audio.heartScoreFrame();
 if(changed&&!silent){HB.spawnT=Math.min(HB.spawnT,1.8);
  feed(n===2?'THE HEART IS RUPTURING':'CARDIAC FAILURE');
  audio.play(n===2?'scream0':'roar1',{vol:.8,rate:.76,pos:hbSoundPoint(),wet:.6});
  if(!settings.reduce)shake=Math.max(shake,3);
 }
}
function hbFaces(){return heartBossFaces;}
function hbSoundPoint(){
 let best=null,dist=Infinity;
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),u=clamp((player.x-p.x)*c+(player.y-p.y)*s,-1.5,1.5);
  const q={x:p.x+c*u-s*.14,y:p.y+s*u+c*.14,z:.6},d=Math.hypot(q.x-player.x,q.y-player.y);
  if(d<dist&&!wall(q.x,q.y)){best=q;dist=d;}
 }return best||{x:24,y:15,z:.6};
}
function hbRay(x,y,dx,dy,max=70){
 if(!hbFighting())return null;
 const obstruction=castRay(x,y,dx,dy,max).d;let hit=null,nearest=Math.min(max,obstruction+.035);
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),nx=-s,ny=c,den=dx*nx+dy*ny;
  if(den>=-.000001)continue;
  const t=((p.x-x)*nx+(p.y-y)*ny)/den;if(t<0||t>nearest)continue;
  const hx=x+dx*t,hy=y+dy*t,u=(hx-p.x)*c+(hy-p.y)*s;
  // A forgiving body span follows the same surface as the rendered organ.
  if(Math.abs(u)>p.size*.53)continue;
  hit={d:t,x:hx,y:hy,face:p};nearest=t;
 }return hit;
}
function hbProjectileContact(q,dx,dy){
 const length=Math.hypot(dx,dy);if(!length)return null;
 const ux=dx/length,uy=dy/length,b=hbRay(q.x,q.y,ux,uy,length+q.r);if(!b)return null;
 // A creature in front of the surface intercepts the projectile first.
 for(const e of enemies){if(!e.alive)continue;
  const ex=e.x-q.x,ey=e.y-q.y,along=ex*ux+ey*uy,across=ex*uy-ey*ux,r=e.r+q.r;
  if(Math.abs(across)<=r&&along+r>=0&&Math.max(0,along-Math.sqrt(r*r-across*across))<b.d)return null;
 }return b;
}
function hbExplosion(q){
 if(!hbFighting())return;
 const big=q.kind==='grave',radius=big?2.65:.45;let best=q.hbHit?{d:0,x:q.hbHit.x,y:q.hbHit.y}:null;
 if(!best)for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),nx=-s,ny=c;
  if((q.x-p.x)*nx+(q.y-p.y)*ny<-.005)continue;
  const u=clamp((q.x-p.x)*c+(q.y-p.y)*s,-p.size*.53,p.size*.53);
  const x=p.x+c*u+nx*.015,y=p.y+s*u+ny*.015,d=Math.hypot(q.x-x,q.y-y);
  if(d<radius&&(!best||d<best.d)&&lineOfSight(q.x,q.y,x,y))best={d,x,y};
 }
 if(best)hbDamage(q.damage*(big?clamp(1-best.d/radius,.2,1):1),best,q.kind);
}
function hbDamage(amount,point,kind='shotgun'){
 if(!hbFighting()||!Number.isFinite(amount)||amount<=0)return 0;
 const dealt=Math.min(HB.hp,amount*mods.damage);
 if(!(review.active&&review.holdBoss))HB.hp=Math.max(0,HB.hp-dealt);
 HB.hitT=.10;HB.trailHold=.3;hitmarker=.12;
 if(point)emit(point.x,point.y,.55,kind==='grave'?'#ff9fcc':'#dd245d',settings.reduce?4:kind==='grave'?22:7,kind==='grave'?1.25:.65);
 if(HB.hitSoundT<=0){audio.play(kind==='grave'?'gore0':kind==='plasma'?'flesh1':'bodyhit0',
  {vol:kind==='grave'?.95:.62,rate:kind==='grave'?.75:.9,pos:point||hbSoundPoint(),wet:.36});HB.hitSoundT=kind==='grave'?.18:.1;}
 if(HB.hp<=0)hbDie();else if((HB.hp/HB.maxHp>.65?1:HB.hp/HB.maxHp>.30?2:3)!==HB.phase)hbUpdatePhase();
 hbHud();return dealt;
}
function hbReward(e,earned){
 if(!hbRunning()||!e.hb)return earned;
 const value=Math.min(earned,HB.scoreBudget);HB.scoreBudget-=value;return value;
}
function hbQueueBirth(){
 if(!hbBirthAllowed())return false;
 const live=enemies.filter(e=>e.alive&&e.type!==3&&(e.hb||hbInside(e.x,e.y)));
 const cap=[6,8,10][HB.phase-1];if(live.length+HB.births.length>=cap)return false;
 const available=HB_PORTS.map(([x,y],i)=>({x,y,i})).filter(p=>p.i!==HB.lastPort&&!HB.births.some(b=>b.port===p.i)&&
  Math.hypot(p.x-player.x,p.y-player.y)>4.25&&fits(p.x,p.y,.3)&&flow[(p.y|0)*MW+(p.x|0)]>=0&&live.every(e=>Math.hypot(e.x-p.x,e.y-p.y)>1));
 if(!available.length)return false;
 const p=available[(HB.spawnCount*3+HB.phase)%available.length];
 let type=HB.phase===1?(HB.spawnCount%3===2?1:0):HB.spawnCount%2;
 if(HB.phase>1&&HB.spawnCount%5===4&&!live.some(e=>e.type===2)&&!HB.births.some(b=>b.type===2))type=2;
 if(!live.some(e=>e.type===0)&&!HB.births.some(b=>b.type===0))type=0;
 HB.births.push({x:p.x,y:p.y,port:p.i,type,t:1.3});HB.lastPort=p.i;HB.spawnCount++;
 audio.play('gore1',{vol:.65,pos:p,wet:.5,rate:.75});return true;
}
function hbTick(dt){
 if(!hbRunning())return;
 enemies=enemies.filter(e=>!e.hb||e.alive||e.death>0);
 HB.hitT=Math.max(0,HB.hitT-dt);HB.hitSoundT=Math.max(0,HB.hitSoundT-dt);
 HB.trailHold=Math.max(0,HB.trailHold-dt);if(HB.trailHold<=0)HB.trail=mix(HB.trail,HB.hp,1-Math.exp(-dt*5));
 if(HB.state==='dormant')return;
 if(HB.state==='dying'){
  HB.deathT+=dt;
  if(!HB.burst&&HB.deathT>=.72){HB.burst=true;hbBurst();}
  hbFinaleTick();if(HB.deathT>=6.5)hbFinish();return;
 }
 if(HB.state==='dead')return;
 HB.introT=Math.max(0,HB.introT-dt);if(HB.introT===0)HB.state='fighting';
 hbRhythmTick(dt);
 if(!hbPressure()){HB.births=[];return;}
 const cap=[6,8,10][HB.phase-1];
 for(let i=HB.births.length-1;i>=0;i--){const b=HB.births[i];b.t-=dt;if(b.t>0)continue;
  const live=enemies.filter(e=>e.alive&&e.type!==3&&(e.hb||hbInside(e.x,e.y))).length;
  if(live<cap&&fits(b.x,b.y,.3)&&Math.hypot(b.x-player.x,b.y-player.y)>2.1&&enemies.every(e=>!e.alive||Math.hypot(e.x-b.x,e.y-b.y)>.8)){
   const e=spawn(b.x,b.y,b.type);e.hb=true;e.noticed=true;e.cd=1.1;e.alertT=.3;
   emit(b.x,b.y,.35,'#e51e69',settings.reduce?8:20,.7);audio.creature(e,true);
  }HB.births.splice(i,1);
 }
 HB.spawnT-=dt;
 if(HB.spawnT<=0&&HB.introT<.6&&hbBirthAllowed()){hbQueueBirth();hbQueueBirth();HB.spawnT=[5.2,4.3,3.5][HB.phase-1];}
}
function hbDie(){
 if(!hbFighting())return;
 HB.flowAtDeath=horrorFrame().flow;HB.hp=0;HB.state='dying';HB.deathT=0;HB.births=[];HB.attack=null;HW.live=false;
 for(const e of enemies)if(e.alive&&e.type!==3){e.alive=false;e.death=.38;e.windup=e.charge=0;}
 // Do not mutate the projectile array while explode() is iterating it.
 for(const q of bullets)if(q.owner==='enemy')q.cancelled=true;
 HB.trailHold=.1;score+=4000;comboT=0;HW.objective='THE HEART IS DYING';
 audio.heart(0);audio.tension(0);
 audio.heartSilenceMusic();
 if(!audio.heartDeathStart())audio.play('roar1',{vol:.95,rate:.58,pos:hbSoundPoint(),wet:.7});audio.duck(.08,.7);
 say('CARDIAC ARREST',1.5);feed('THE HEART HAS STOPPED');hbHud();
}
function hbBurst(){
 for(const p of hbFaces()){
  const x=p.x-Math.sin(p.a)*.12,y=p.y+Math.cos(p.a)*.12;
  ring(x,y,'#ff377e',4.5,.8);emit(x,y,1.2,'#f02869',settings.reduce?12:42,1.65);
  emit(x,y,.9,'#ecc4b5',settings.reduce?3:9,1.2);
 }
 if(!settings.reduce){shake=Math.max(shake,8);whiteFlash=Math.max(whiteFlash,.07);}
 if(!audio.heartBuffer){audio.boom(1.15,hbSoundPoint());audio.play('gore2',{vol:1,rate:.58,wet:.65});}
 hwLights();
}
function hbFinish(silent=false){
 if(!hbRunning()||HB.state==='dead')return;
 for(const e of enemies)if(!e.alive)e.death=0;
 HB.hp=0;HB.trail=0;HB.state='dead';HB.deathT=6.5;HB.births=[];HB.attack=null;
 hbGates(false);hwResolve(silent);
 audio.heartAftermath();
 hbHud();
}
function hbSkip(){
 if(!hbRunning())return;
 for(const e of enemies)if(e.type!==3){e.alive=false;e.death=0;}
 for(const q of bullets)if(q.owner==='enemy')q.cancelled=true;
 HB.state='dying';hbFinish(true);
}
function hbHud(){
 if(cbRunning()){cbHud();return;}
 const visible=hbRunning()&&HB.state!=='dormant'&&mode!=='menu';
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);
 if(!visible)return;
 $('bossTitle').textContent='THE HEART';$('bossHud').setAttribute('aria-label','The Heart boss');$('bossMeter').setAttribute('aria-label','The Heart health');
 const pct=clamp(HB.hp/HB.maxHp,0,1);
 $('bossFill').style.width=(pct*100)+'%';$('bossTrail').style.width=(clamp(HB.trail/HB.maxHp,0,1)*100)+'%';
 $('bossHealth').textContent=HB.state==='dead'?'DEAD':Math.ceil(pct*100)+'%';
 $('bossState').textContent=HB.state==='dying'?(HB.deathT<.72?'CARDIAC ARREST':HB.deathT<4.1?'RUPTURE':'NO PULSE'):HB.state==='dead'?'THE WAY OUT IS OPEN':
  HB.training?'TARGET PRACTICE':HB.attack&&!HB.attack.fired?(HB.attack.kind==='well'?'BLOOD RISE':'ARTERIAL SALVO'):
  review.active&&review.holdBoss?'HEALTH HELD':HB.state==='awakening'?'AWAKENING':['AWAKENING','RUPTURE','CARDIAC FAILURE'][HB.phase-1];
 $('bossMeter').setAttribute('aria-valuenow',Math.round(pct*100));
 $('bossHud').classList.toggle('boss-dead',HB.state==='dead');
}
function hbRenderBirths(){
 if(!hbRunning())return;
 for(const b of HB.births){const v=project(b.x,b.y,.04);if(!v||v.x<0||v.x>=W||zBuffer[v.x|0]<v.d)continue;
  const r=v.scale*(.22+(1-b.t/1.3)*.24);wc.save();wc.strokeStyle='#fff0cd';wc.lineWidth=2;
  wc.beginPath();wc.ellipse(v.x,v.y,r,r*.27,0,0,TAU);wc.stroke();
  drawGlow(v.x,v.y-v.scale*.13,r,'#ff367f',.32);wc.restore();
 }
}

