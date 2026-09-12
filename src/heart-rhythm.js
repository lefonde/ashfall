// R02: sparse, readable attacks within the approved R01 summon/weapon economy.
function hbPulse(){
 if(!hbFighting())return 0;
 const p=HB.beatPhase;
 return Math.exp(-(((p-.10)/.085)**2))+.55*Math.exp(-(((p-.32)/.11)**2));
}
function hbAttacksEnabled(){return hbPressure()&&HB.phase>=2&&(!review.active||review.bloodAttacks);}
function hbBirthAllowed(){return !HB.attackPractice&&!HB.attack&&HB.birthRest<=0;}
function hbAttackOrigin(){
 let best=null,nearest=Infinity;
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),u=clamp((player.x-p.x)*c+(player.y-p.y)*s,-1.35,1.35);
  const x=p.x+c*u-s*.18,y=p.y+s*u+c*.18,d=Math.hypot(x-player.x,y-player.y);
  if(d<nearest&&!wall(x,y)&&lineOfSight(x,y,player.x,player.y)){best={x,y};nearest=d;}
 }return best;
}
function hbBeginAttack(kind){
 if(!hbAttacksEnabled()||HB.attack||HB.births.length||!hbInside())return false;
 const origin=hbAttackOrigin();if(!origin)return false;
 // Close to the organ, a floor eruption has a clearer escape than a tight fan.
 if(kind==='fan'&&Math.hypot(player.x-origin.x,player.y-origin.y)<1.3)kind='well';
 const beats=kind==='fan'?4:3;
 const a={kind,x:player.x,y:player.y,r:1.85,originX:origin.x,originY:origin.y,
  startBeat:HB.beatCount,fireBeat:HB.beatCount+beats,beats,age:0,fired:false,fadeT:.48,lanes:[]};
 if(kind==='fan'){
  const angle=Math.atan2(player.y-origin.y,player.x-origin.x);
  for(const offset of [-.36,0,.36]){
   const dx=Math.cos(angle+offset),dy=Math.sin(angle+offset),d=Math.max(0,castRay(origin.x,origin.y,dx,dy,12).d-.08);
   if(d>.5)a.lanes.push({x:origin.x,y:origin.y,ex:origin.x+dx*d,ey:origin.y+dy*d,r:.27});
  }if(!a.lanes.length)return false;
 }
 HB.attack=a;HB.attackIndex++;
 feed(kind==='well'?'THE FLOOR IS SWELLING\nMOVE OUT OF THE BLOOD RING':'ARTERIES OPENING\nSTEP BETWEEN THE MARKED LANES');
 audio.play(kind==='well'?'gore1':'scream0',{vol:.6,rate:kind==='well'?.66:.79,pos:origin,wet:.48});
 return true;
}
function hbSegmentDistance(x,y,l){
 const dx=l.ex-l.x,dy=l.ey-l.y,n=dx*dx+dy*dy;
 const t=n?clamp(((x-l.x)*dx+(y-l.y)*dy)/n,0,1):0;
 return Math.hypot(x-l.x-dx*t,y-l.y-dy*t);
}
function hbAttackContains(a,x,y){
 if(a.kind==='well')return Math.hypot(x-a.x,y-a.y)<a.r+.19&&lineOfSight(a.x,a.y,x,y);
 return a.lanes.some(l=>hbSegmentDistance(x,y,l)<l.r+.19&&lineOfSight(l.x,l.y,x,y));
}
function hbFireAttack(a){
 if(a.fired||!hbAttacksEnabled())return;
 a.fired=true;a.fadeT=.48;
 if(a.kind==='well'){
  ring(a.x,a.y,'#ff85ad',a.r,.42);emit(a.x,a.y,.18,'#e4275e',settings.reduce?10:38,1.35);
  audio.play('gore2',{vol:.85,rate:.72,pos:{x:a.x,y:a.y},wet:.45});
 }else{
  for(const l of a.lanes)for(let n=1;n<=6;n++){
   const x=mix(l.x,l.ex,n/7),y=mix(l.y,l.ey,n/7);emit(x,y,.18,'#ff376e',settings.reduce?1:4,.7);
  }
  audio.play('gore0',{vol:.85,rate:.7,pos:{x:a.originX,y:a.originY},wet:.5});
 }
 const contact=hbAttackContains(a,player.x,player.y),dashed=contact&&dashT>0;
 if(contact)hurtPlayer(a.kind==='well'?18:20,'The Heart marked the floor before it struck. Leave the blood ring, step between its lanes, or dash through the pulse.');
 if(HB.attackPractice)feed(dashed?'DASHED THROUGH THE PULSE':contact?(review.active&&!review.damage?'BLOOD CONTACT\nHEALTH PROTECTED':'BLOOD CONTACT'):'CLEAR\nKEEP FIRING');
}
function hbRhythmTick(dt){
 const before=HB.beatPhase;
 HB.bpm=mix(HB.bpm,[76,92,110][HB.phase-1],1-Math.exp(-dt*1.6));
 const travel=before+dt*HB.bpm/60,beats=Math.max(0,Math.floor(travel-.1)-Math.floor(before-.1));
 HB.beatPhase=travel%1;HB.beatCount+=beats;
 audio.heartFrame(hbPulse(),HW.intensity);audio.heartScoreFrame(beats);
 HB.birthRest=Math.max(0,HB.birthRest-dt);
 if(!hbAttacksEnabled()){HB.attack=null;HB.attackT=4.2;return;}
 const a=HB.attack;
 if(a){
  a.age+=dt;
  if(!a.fired&&beats>0&&HB.beatCount>=a.fireBeat&&a.age>=(a.kind==='well'?1.6:1.9))hbFireAttack(a);
  else if(a.fired){a.fadeT-=dt;if(a.fadeT<=0){HB.attack=null;HB.attackT=HB.attackPractice?3.5:HB.phase===2?10:8.5;HB.birthRest=.65;}}
  return;
 }
 HB.attackT-=dt;
 if(HB.attackT<=0&&beats>0&&HB.introT===0&&!HB.births.length){
  hbBeginAttack(HB.attackPractice||(HB.phase===2?'well':HB.attackIndex%2===0?'fan':'well'));
 }
}
// Thin world-space outlines, depth tested segment by segment. They mark danger,
// leaving most of the approved environment visible and staying clear without flashes.
function hbFloorOutline(points,color,width=2,alpha=1){
 wc.save();wc.strokeStyle=color;wc.lineWidth=width;wc.globalAlpha=alpha;wc.beginPath();
 let last=null;
 for(const p of points){const v=project(p.x,p.y,.045);
  if(!v||v.x<0||v.x>=W||v.y<0||v.y>H||zBuffer[v.x|0]<v.d-.08){last=null;continue;}
  if(last)wc.lineTo(v.x,v.y);else wc.moveTo(v.x,v.y);last=v;
 }wc.stroke();wc.restore();
}
function hbRenderAttack(){
 const a=HB.attack;if(!hbRunning()||!a)return;
 const progress=clamp((HB.beatCount-a.startBeat+(HB.beatPhase-.1+1)%1)/a.beats,0,1);
 const alpha=a.fired?clamp(a.fadeT/.48,0,1):.68+progress*.32;
 if(a.kind==='well'){
  for(const radius of [a.r,a.r*(.25+progress*.6)]){
   const pts=[];for(let i=0;i<=48;i++)pts.push({x:a.x+Math.cos(i/48*TAU)*radius,y:a.y+Math.sin(i/48*TAU)*radius});
   hbFloorOutline(pts,radius===a.r?'#ffe4bc':'#ff397c',radius===a.r?2.5:2,alpha);
  }
  for(const axis of [0,Math.PI/2])hbFloorOutline([-1,1].map(n=>({x:a.x+Math.cos(axis)*.18*n,y:a.y+Math.sin(axis)*.18*n})),'#ffe4bc',2,alpha);
 }else{
  for(const l of a.lanes){const dx=l.ex-l.x,dy=l.ey-l.y,d=Math.hypot(dx,dy)||1;
   for(const edge of [-1,0,1]){
    const pts=[],steps=Math.ceil(d/.35);
    for(let i=0;i<=steps;i++)pts.push({x:l.x+dx*i/steps-dy/d*l.r*edge,y:l.y+dy*i/steps+dx/d*l.r*edge});
    hbFloorOutline(pts,edge?'#ffe4bc':'#ff397c',edge?1.5:3,alpha);
   }
  }
 }
}

