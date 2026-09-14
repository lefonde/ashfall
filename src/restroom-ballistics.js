// Restroom shots live in metres and absolute world height. The hospital keeps
// its existing combat path; the same gun resources, recoil and sounds are used.
const RSB={faces:null,count:0,grid:null,lastHit:null};
// Build this with the chapter's geometry, before the player fires. A large
// one-time index build must never stall the first trigger pull.
const rsShotBuildWorld=rsBuildWorld;
rsBuildWorld=function(){rsShotBuildWorld();rsShotIndex();};
function rsShotIndex(){
 if(RSB.faces===RW.faces&&RSB.count===RW.faces.length&&RSB.grid)return;
 RSB.faces=RW.faces;RSB.count=RW.faces.length;RSB.grid=Object.create(null);
 for(const f of RW.faces){
  const vertices=f.doorId?[...(f.closedV||f.v),...(f.openV||f.v)]:f.v;
  const b=[Infinity,Infinity,-Infinity,-Infinity];for(const p of vertices){b[0]=Math.min(b[0],p[0]);b[1]=Math.min(b[1],p[1]);b[2]=Math.max(b[2],p[0]);b[3]=Math.max(b[3],p[1]);}
  rsGridPut(RSB.grid,b,f);
 }
}
function rsShotUnit(d){const n=Math.hypot(d.x,d.y,d.z);return n>1e-9&&Number.isFinite(n)?{x:d.x/n,y:d.y/n,z:d.z/n}:{x:Math.cos(player.a),y:Math.sin(player.a),z:0};}
function rsShotDirection(){
 if(typeof rsAimDirection==='function')return rsShotUnit(rsAimDirection());
 const pitch=Math.atan2(aimPitch,Math.max(1,projection)),c=Math.cos(pitch);return {x:Math.cos(player.a)*c,y:Math.sin(player.a)*c,z:Math.sin(pitch)};
}
function rsShotOrigin(){return typeof rsAimOrigin==='function'?rsAimOrigin():{x:player.x,y:player.y,z:RS.active.z+RS_EYE};}
function rsShotSpread(d,h,v){
 const rx=-Math.sin(player.a),ry=Math.cos(player.a),ux=-d.z*ry,uy=d.z*rx,uz=d.x*ry-d.y*rx;
 return rsShotUnit({x:d.x+rx*h+ux*v,y:d.y+ry*h+uy*v,z:d.z+uz*v});
}
// Two-sided Möller–Trumbore sweep. The ray tests the actual floor, ceiling,
// rail and fixture triangles, so the player's current floor never enters it.
function rsShotTriangle(o,d,f,max){
 const a=f.v[0],b=f.v[1],c=f.v[2],e1x=b[0]-a[0],e1y=b[1]-a[1],e1z=b[2]-a[2],e2x=c[0]-a[0],e2y=c[1]-a[1],e2z=c[2]-a[2];
 const px=d.y*e2z-d.z*e2y,py=d.z*e2x-d.x*e2z,pz=d.x*e2y-d.y*e2x,det=e1x*px+e1y*py+e1z*pz;
 if(Math.abs(det)<1e-9)return null;
 const inv=1/det,tx=o.x-a[0],ty=o.y-a[1],tz=o.z-a[2],u=(tx*px+ty*py+tz*pz)*inv;if(u<-.000001||u>1.000001)return null;
 const qx=ty*e1z-tz*e1y,qy=tz*e1x-tx*e1z,qz=tx*e1y-ty*e1x,v=(d.x*qx+d.y*qy+d.z*qz)*inv;if(v<-.000001||u+v>1.000001)return null;
 const distance=(e2x*qx+e2y*qy+e2z*qz)*inv;if(distance<.00005||distance>max)return null;
 let nx=e1y*e2z-e1z*e2y,ny=e1z*e2x-e1x*e2z,nz=e1x*e2y-e1y*e2x,n=Math.hypot(nx,ny,nz)||1;if(nx*d.x+ny*d.y+nz*d.z>0)n=-n;
 return {d:distance,x:o.x+d.x*distance,y:o.y+d.y*distance,z:o.z+d.z*distance,normal:{x:nx/n,y:ny/n,z:nz/n},face:f};
}
function rsShotTrace(origin,direction,max=96){
 rsShotIndex();const d=rsShotUnit(direction),length=clamp(Number.isFinite(max)?max:96,0,180),end={x:origin.x+d.x*length,y:origin.y+d.y*length,z:origin.z+d.z*length};
 const faces=rsGridQuery(RSB.grid,[Math.min(origin.x,end.x)-.002,Math.min(origin.y,end.y)-.002,Math.max(origin.x,end.x)+.002,Math.max(origin.y,end.y)+.002]);
 let closest=length,hit=null;const water=new Map();
 for(const f of faces){if(f.seal&&!RS.active?.committed)continue;const q=rsShotTriangle(origin,d,f, f.water?length:closest);if(!q)continue;
  if(f.water){const id=f.waterRegion||f.water;if(!water.has(id)||q.d<water.get(id).d)water.set(id,{...q,waterId:id});}
  else{closest=q.d;hit=q;}
 }
 const result=hit||{d:length,...end,normal:null,face:null};result.water=[...water.values()].filter(w=>w.d<=closest+.00001).sort((a,b)=>a.d-b.d);return result;
}
function rsShotFold(origin,direction,max){
 let hit=null;for(const fold of RW.folds)for(const[from,to]of [[fold.a,fold.b],[fold.b,fold.a]]){
  const along=direction.x*from.nx+direction.y*from.ny,start=(origin.x-from.x)*from.nx+(origin.y-from.y)*from.ny;
  if(along<=1e-7||start>.00001)continue;const t=-start/along;if(t<.00005||t>max||hit&&t>=hit.d)continue;
  const x=origin.x+direction.x*t,y=origin.y+direction.y*t,z=origin.z+direction.z*t,lateral=-(x-from.x)*from.ny+(y-from.y)*from.nx;
  if(Math.abs(lateral)>from.width/2-.015||z<from.z+.01||z>from.z+2.10)continue;
  const rotation=Math.atan2(-to.ny,-to.nx)-Math.atan2(from.ny,from.nx),c=Math.cos(rotation),s=Math.sin(rotation),dx=x-from.x,dy=y-from.y;
  hit={d:t,from:{x,y,z},origin:{x:to.x+dx*c-dy*s-to.nx*.002,y:to.y+dx*s+dy*c-to.ny*.002,z:to.z+z-from.z},direction:{x:direction.x*c-direction.y*s,y:direction.x*s+direction.y*c,z:direction.z}};
 }return hit;
}
function rsEmitAt(x,y,z,color,count=8,power=1,normal=null,water=false){
 for(let i=0;i<count;i++){if(particles.length>=440)particles.shift();const a=rand(0,TAU),sp=rand(.25,2.5)*power;
  particles.push({x,y,z:0,rsZ:z,vx:Math.cos(a)*sp+(normal?.x||0)*power,vy:Math.sin(a)*sp+(normal?.y||0)*power,vz:rand(.3,2.4)*power+(normal?.z||0)*power,life:rand(.18,.5),max:.5,size:rand(.012,.035)*power,color,rsWater:water});
 }
}
function rsShotWater(w,power=1){
 const region=RW.waterRegions.find(q=>q.id===w.waterId);if(!region)return;
 rsWaterStep(w.x,w.y,w.z,Math.min(1.7,.55+power*.45));rsEmitAt(w.x,w.y,w.z+.012,'#9cbfb3',power>.7?9:4,power*.65,{x:0,y:0,z:.5},true);
 if(typeof rsAudioWaterImpact==='function')rsAudioWaterImpact({x:w.x,y:w.y,z:w.z},power);
}
function rsShotImpact(q,hit){
 const big=q.kind==='grave';RSB.lastHit=hit;if(typeof rsEncounterDamage==='function'){if(hit?.enemy)rsEncounterDamage(hit.enemy,q.damage,hit);if(big)for(const e of RS.active?.encounters?.entities||[]){if(!e.alive||e===hit?.enemy)continue;const origin={x:q.x,y:q.y,z:q.rsZ},distance=Math.hypot(e.x-q.x,e.y-q.y,e.z-q.rsZ);if(distance<2.65&&rsEncounterClear(origin,e))rsEncounterDamage(e,q.damage*clamp(1-distance/2.65,.2,1));}}rsEmitAt(q.x,q.y,q.rsZ,q.color,big?48:9,big?1.35:.52,hit?.normal);
 if(big){audio.boom(1,{x:q.x,y:q.y});shake=Math.max(shake,clamp(11/Math.max(1,Math.hypot(q.x-player.x,q.y-player.y,q.rsZ-rsShotOrigin().z)),2,9));whiteFlash=.065;}
}
function rsShotTracer(from,to,color,life=.08){if(tracers.length>=64)tracers.shift();tracers.push({x:to.x,y:to.y,z:0,rsZ:to.z,rsFrom:{...from},life,max:life,color,size:.018});}
function rsShoot(g){
 const origin=rsShotOrigin(),direction=rsShotDirection();
 if(weapon===0){
  for(let i=0;i<g.pellets;i++){
   let d=rsShotSpread(direction,(i/(g.pellets-1)-.5)*g.spread+rand(-.010,.010),rand(-.035,.035)),o={...origin},remaining=12;
   for(let hops=0;hops<4&&remaining>0;hops++){
    const wall=rsShotTrace(o,d,remaining),creature=typeof rsEncounterRay==='function'?rsEncounterRay(o,d,wall.d):null,hit=creature?{...creature,water:wall.water.filter(w=>w.d<=creature.d)}:wall,fold=rsShotFold(o,d,hit.d),distance=fold?fold.d:hit.d;
    for(const w of hit.water)if(w.d<=distance)rsShotWater(w,.42);
    const end=fold?fold.from:hit;if(i%3===0)rsShotTracer(o,end,g.color);
    if(fold){remaining-=distance;d=fold.direction;o=fold.origin;continue;}
    if(hit.enemy){RSB.lastHit=hit;rsEncounterDamage(hit.enemy,g.damage*clamp(1-hit.d*.038,.48,1),hit);}else if(hit.face&&i%3===0){RSB.lastHit=hit;rsEmitAt(hit.x+d.x*-.012,hit.y+d.y*-.012,hit.z+d.z*-.012,g.color,4,.35,hit.normal);}break;
   }
  }
 }else{
  const d=rsShotSpread(direction,rand(-.007,.007),rand(-.004,.004)),speed=weapon===1?21:11;
  if(bullets.length>=80)bullets.shift();bullets.push({x:origin.x,y:origin.y,z:0,rsZ:origin.z,rsVX:d.x*speed,rsVY:d.y*speed,rsVZ:d.z*speed,rsPrevious:{...origin},a:Math.atan2(d.y,d.x),speed,damage:g.damage,kind:weapon===1?'plasma':'grave',life:2.5,r:weapon===1?.1:.22,size:weapon===1?.05:.11,owner:'player',color:g.color});
 }
}
function rsUpdateBullets(dt){
 for(let i=bullets.length-1;i>=0;i--){const q=bullets[i];if(!Number.isFinite(q.rsZ)){bullets.splice(i,1);continue;}
  const time=Math.min(Math.max(0,dt),Math.max(0,q.life));q.life-=dt;let remaining=q.speed*time,hit=null,done=!!q.cancelled;
  q.rsPrevious={x:q.x,y:q.y,z:q.rsZ};
  for(let hops=0;hops<4&&remaining>1e-6&&!done;hops++){
   const origin={x:q.x,y:q.y,z:q.rsZ},d=rsShotUnit({x:q.rsVX,y:q.rsVY,z:q.rsVZ}),wall=rsShotTrace(origin,d,remaining),creature=typeof rsEncounterRay==='function'?rsEncounterRay(origin,d,wall.d):null,contact=creature?{...creature,water:wall.water.filter(w=>w.d<=creature.d)}:wall,fold=rsShotFold(origin,d,contact.d),travel=fold?fold.d:contact.d;
   for(const w of contact.water)if(w.d<=travel)rsShotWater(w,q.kind==='grave'?1.4:.8);
   if(fold){remaining-=travel;q.x=fold.origin.x;q.y=fold.origin.y;q.rsZ=fold.origin.z;q.rsVX=fold.direction.x*q.speed;q.rsVY=fold.direction.y*q.speed;q.rsVZ=fold.direction.z*q.speed;q.a=Math.atan2(q.rsVY,q.rsVX);q.rsPrevious={...fold.origin};continue;}
   q.x=contact.x;q.y=contact.y;q.rsZ=contact.z;remaining=0;if(contact.face||contact.enemy){done=true;hit=contact;}
  }
  if(done||q.life<=0){bullets.splice(i,1);if(!q.cancelled)rsShotImpact(q,hit);}
  else if(particles.length<440)particles.push({x:q.x,y:q.y,z:0,rsZ:q.rsZ,vx:0,vy:0,vz:0,rsGravity:0,life:.12,max:.12,size:q.r*.4,color:q.color});
 }
}
// Cosmetic sparks use nearby architectural planes and fixture boxes. The
// exact triangle sweep above remains reserved for actual shots and pellets.
function rsParticleContact(o,dx,dy,dz){
 const end={x:o.x+dx,y:o.y+dy,z:o.z+dz},surfaces=rsAt(end.x,end.y);let time=1,normal=null;
 for(const s of surfaces)for(const ceiling of[false,true]){
  if(ceiling&&s.noCeil)continue;const f=ceiling?rsCeil:rsFloor,from=o.z-f(s,o.x,o.y),to=end.z-f(s,end.x,end.y);
  if(ceiling?from<=-.00001&&to>0:from>=.00001&&to<0){const t=from/(from-to);if(t<time){time=t;normal={x:0,y:0,z:ceiling?-1:1};}}
 }
 for(const b of rsGridQuery(RW.solidIndex,[Math.min(o.x,end.x),Math.min(o.y,end.y),Math.max(o.x,end.x),Math.max(o.y,end.y)])){
  if(b.disabled)continue;let lo=0,hi=time,axis=-1,sign=0;
  for(let k=0;k<3;k++){const p=k===0?o.x:k===1?o.y:o.z,step=k===0?dx:k===1?dy:dz,min=k===0?b.x1:k===1?b.y1:b.z,max=k===0?b.x2:k===1?b.y2:b.z+b.h;
   if(Math.abs(step)<1e-8){if(p<min||p>max){hi=-1;break;}}
   else{let a=(min-p)/step,c=(max-p)/step,n=-1;if(a>c){const t=a;a=c;c=t;n=1;}if(a>lo){lo=a;axis=k;sign=n;}hi=Math.min(hi,c);if(lo>hi)break;}
  }
  if(axis>=0&&lo>=0&&lo<time&&lo<=hi){time=lo;normal={x:axis===0?sign:0,y:axis===1?sign:0,z:axis===2?sign:0};}
 }
 if(!normal&&!surfaces.some(s=>end.z>=rsFloor(s,end.x,end.y)-.002&&(s.noCeil||end.z<=rsCeil(s,end.x,end.y)+.002))){time=0;const n=Math.hypot(dx,dy)||1;normal={x:-dx/n,y:-dy/n,z:0};}
 return {x:o.x+dx*time,y:o.y+dy*time,z:o.z+dz*time,normal};
}
const rsHostUpdateEffects=updateEffects;
updateEffects=function(dt){
 if(!rsRunning())return rsHostUpdateEffects(dt);
 for(let i=particles.length-1;i>=0;i--){const q=particles[i];q.life-=dt;if(q.life<=0){particles.splice(i,1);continue;}
  if(!Number.isFinite(q.rsZ))q.rsZ=RS.active.z+(q.z??.5)+(RS_EYE-.64);
  const dx=(q.vx||0)*dt,dy=(q.vy||0)*dt,dz=(q.vz||0)*dt,distance=Math.hypot(dx,dy,dz),origin={x:q.x,y:q.y,z:q.rsZ};
  if(distance>.00001&&q.rsGravity!==0){const hit=rsParticleContact(origin,dx,dy,dz);q.x=hit.x;q.y=hit.y;q.rsZ=hit.z;
   if(hit.normal){q.x+=hit.normal.x*.002;q.y+=hit.normal.y*.002;q.rsZ+=hit.normal.z*.002;const dot=q.vx*hit.normal.x+q.vy*hit.normal.y+q.vz*hit.normal.z;q.vx=(q.vx-1.2*dot*hit.normal.x)*.5;q.vy=(q.vy-1.2*dot*hit.normal.y)*.5;q.vz=(q.vz-1.2*dot*hit.normal.z)*.5;q.life=Math.min(q.life,.12);}
  }else{q.x+=dx;q.y+=dy;q.rsZ+=dz;}
  q.vz=(q.vz||0)-(q.rsGravity??7)*dt;
 }
 for(const arr of[rings,tracers,numbers])for(let i=arr.length-1;i>=0;i--){arr[i].life-=dt;if(arr[i].life<=0)arr.splice(i,1);}
};
