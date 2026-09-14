// Independent sampled navigation audit. Declared RW.connections are deliberately
// not used as edges: every search edge executes production rsMove, including
// collision substeps, continuous stairs and spatial folds. A negative result is
// a diagnostic to inspect at finer resolution, not proof every human path fails.
const assert=require('node:assert/strict');

function rsAuditAnchor(id){
 const s=RW.byId[id];if(!s)return null;
 const b=s.bounds,cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2,candidates=[];
 for(let y=b[1]+.4;y<b[3]-.3;y+=.5)for(let x=b[0]+.4;x<b[2]-.3;x+=.5){if(rsPolyHas(s.poly,x,y)&&rsCanStand(x,y,rsFloor(s,x,y)))candidates.push({x,y,z:rsFloor(s,x,y)});}
 candidates.sort((a,b)=>(a.x-cx)**2+(a.y-cy)**2-(b.x-cx)**2-(b.y-cy)**2);return candidates[0]||null;
}

function rsAuditFlood(options={}){
 if(!RS.active)throw Error('Navigation audit requires the real entered restroom scene');
 const step=options.step||.75,maxStates=options.maxStates||350000,s=RS.active;
 const pose={x:player.x,y:player.y,a:player.a,vx:player.vx,vy:player.vy,z:s.z,clock:s.clock,committed:s.committed,foldCooldown:s.foldCooldown,folds:s.folds,lastFold:s.lastFold,pendingSave:s.pendingSave};
 const doorState=(RW.doors||[]).map(d=>[d,d.open]),folds=RW.folds,anomalies=new Set(s.anomalies),savedDoorState={...s.doorState},savedShortcutState={...s.shortcutState};
 let start=options.start||{x:player.x,y:player.y,z:s.z};
 const nodes=[{...start,distance:0,parent:-1}],seen=new Set(),rooms=new Map(),floors={},opened=new Set(),foldUse=new Set();
 let exit=null,exitNode=-1,openPose=null,limit=false;
 const key=p=>Math.round(p.x/step)+','+Math.round(p.y/step)+','+Math.round(p.z*1000);
 seen.add(key(start));
 // The sealed stair foot is part of the committed chapter. It cannot be
 // used as a spurious return route while evaluating the deep final exit.
 s.committed=true;
 try{
  // Entry traversal is checked separately through the actual first staircase.
  // A chapter audit invoked while still upstairs begins on the lower landing,
  // since commitment has correctly made the original entrance pose invalid.
  if(!options.start&&!rsCanStand(start.x,start.y,start.z)){
   start=rsAuditAnchor('P01');if(!start)throw Error('No valid committed entry landing');
   nodes[0]={...start,distance:0,parent:-1};seen.clear();seen.add(key(start));
  }
  if(!rsCanStand(start.x,start.y,start.z))throw Error('Navigation audit supplied start is not collision-valid');
  for(let i=0;i<nodes.length;i++){
   if(nodes.length>maxStates){limit=true;break;}
   const p=nodes[i];Object.assign(player,{x:p.x,y:p.y,vx:0,vy:0});s.z=p.z;s.foldCooldown=0;s.clock+=.1;
   if(!rsCanStand(p.x,p.y,p.z))continue;
   const here=rsAt(p.x,p.y).filter(v=>Math.abs(rsFloor(v,p.x,p.y)-p.z)<.12);
   for(const room of here.filter(v=>v.room)){
    if(!rooms.has(room.id))rooms.set(room.id,{x:p.x,y:p.y,z:p.z,node:i});
    const floor=room.floor||Math.round(-p.z/3.4);if(!floors[floor])floors[floor]={x:p.x,y:p.y,z:p.z};
   }
   if(!openPose&&here.some(v=>v.room)&&[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]].every(([dx,dy])=>rsCanStand(p.x+dx*1.8,p.y+dy*1.8,p.z)))openPose={x:p.x,y:p.y,z:p.z};
   if(!exit&&RW.exit&&Math.abs(p.z-RW.exit.z)<.2&&rsPolyHas(RW.exit.poly,p.x,p.y)){exit={x:p.x,y:p.y,z:p.z};exitNode=i;if(options.stopAtExit)break;}
   if(options.openDoors)for(const d of RW.doors||[]){
    if(d.open||(options.noShortcuts&&d.shortcut)||Math.abs(d.z-p.z)>.3||Math.hypot(d.x-p.x,d.y-p.y)>2.3||!rsDoorCanOpen(d,p.x,p.y,p.z))continue;
    player.a=Math.atan2(d.y-p.y,d.x-p.x);
    if(rsNearbyDoor()!==d)continue;
    rsInteract();if(d.open)opened.add(d.id);
   }
   for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){
    Object.assign(player,{x:p.x,y:p.y,a:Math.atan2(dy,dx),vx:0,vy:0});s.z=p.z;s.foldCooldown=0;
    const previous=s.folds,travel=rsMove(dx,dy),next={x:player.x,y:player.y,z:s.z,distance:p.distance+travel,parent:i};
    if(s.folds!==previous){
     // Exclude crossing this connection, not its physical trigger. Removing the
     // trigger would invent access behind an otherwise unavoidable portal plane.
     if(s.lastFold===options.blockFold)continue;
     foldUse.add(s.lastFold);
    }
    if(travel<.025||!rsCanStand(next.x,next.y,next.z))continue;
    const id=key(next);if(seen.has(id))continue;seen.add(id);nodes.push(next);
   }
  }
  const route=[];for(let i=exitNode;i>=0;i=nodes[i].parent)route.push({x:nodes[i].x,y:nodes[i].y,z:nodes[i].z});route.reverse();
  return {roomCount:RW.rooms.length,rooms:[...rooms.keys()].sort(),unreached:RW.rooms.filter(r=>!rooms.has(r.id)).map(r=>r.id),
   roomPoses:Object.fromEntries(rooms),floorPoses:floors,missingFloors:[1,2,3,4,5,6].filter(f=>!floors[f]),states:nodes.length,limit,
   exit,route,distanceToExit:exitNode<0?null:nodes[exitNode].distance,openPose,opened:[...opened],folds:[...foldUse]};
 }finally{
  RW.folds=folds;for(const [door,open]of doorState)rsDoorSet(door,open);s.anomalies=anomalies;s.doorState=savedDoorState;s.shortcutState=savedShortcutState;
  Object.assign(player,{x:pose.x,y:pose.y,a:pose.a,vx:pose.vx,vy:pose.vy});
  for(const k of ['z','clock','committed','foldCooldown','folds','lastFold','pendingSave'])s[k]=pose[k];
  _safeX=player.x;_safeY=player.y;
 }
}

// A second, complementary check follows every authored ordinary centerline in
// both directions. Waypoints nominate where to test, but cannot bypass movement
// collision. This catches lips/gaps at room boundaries and reversed stair errors
// even when an alternative loop keeps the room reachable in the flood search.
function rsAuditConnections(){
 const s=RS.active,saved={x:player.x,y:player.y,a:player.a,z:s.z,committed:s.committed,foldCooldown:s.foldCooldown},doors=RW.doors.map(d=>[d,d.open]);
 const failures=[],passed=[];let stairChecks=0;
 try{
  s.committed=true;for(const [d]of doors)rsDoorSet(d,true);
  for(const c of RW.connections){
   if(!c.waypoints||c.waypoints.length<2||c.type==='fold'||c.oneWayEntry)continue;
   for(const reverse of [false,true]){
    const route=c.waypoints.map(p=>p.slice());if(reverse)route.reverse();
    const first=route[0],second=route[1],last=route[route.length-1],before=route[route.length-2];
    const startLen=Math.hypot(second[0]-first[0],second[1]-first[1]),endLen=Math.hypot(last[0]-before[0],last[1]-before[1]);
    if(startLen<.01||endLen<.01){failures.push({id:c.id,reverse,reason:'degenerate boundary waypoint'});continue;}
    const inside=(id,p,preferred)=>{
     const room=RW.byId[id],valid=q=>rsPolyHas(room.poly,q[0],q[1])&&rsCanStand(q[0],q[1],q[2])&&[[.12,0],[-.12,0],[0,.12],[0,-.12]].every(([dx,dy])=>rsPolyHas(room.poly,q[0]+dx,q[1]+dy));
     if(valid(preferred))return preferred;
     // A connecting corridor may approach along the room wall, especially beside
     // a stair core. Finish inside the destination rather than extrapolating its
     // last tangent along that wall. The final leg still executes rsMove.
     for(const d of [.45,.7,1])for(let k=0;k<8;k++){const q=[p[0]+Math.cos(k*Math.PI/4)*d,p[1]+Math.sin(k*Math.PI/4)*d,p[2]];if(valid(q))return q;}
     return preferred;
    };
    const from=reverse?c.b:c.a,to=reverse?c.a:c.b;
    const start=inside(from,first,[first[0]-(second[0]-first[0])/startLen*.4,first[1]-(second[1]-first[1])/startLen*.4,first[2]]);
    route.push(inside(to,last,[last[0]+(last[0]-before[0])/endLen*.4,last[1]+(last[1]-before[1])/endLen*.4,last[2]]));
    Object.assign(player,{x:start[0],y:start[1],vx:0,vy:0});s.z=start[2];s.foldCooldown=0;
    let failure=null,maxHeightStep=0;
    if(!rsCanStand(player.x,player.y,s.z))failure='entry inside source room is blocked';
    for(let pointIndex=0;pointIndex<route.length;pointIndex++){
     const point=route[pointIndex],tolerance=pointIndex===route.length-1?.025:.27;
     if(failure)break;
     let guard=0;
     // A capsule naturally rounds a concave corridor joint. The exact centerline
     // corner need not hold a full player footprint; every actual step still
     // goes through production collision, with a strict destination check.
     while(Math.hypot(point[0]-player.x,point[1]-player.y)>tolerance){
      if(guard++>4000){failure='centerline traversal exceeded geometric bound';break;}
      const dx=point[0]-player.x,dy=point[1]-player.y,len=Math.hypot(dx,dy),oldZ=s.z,oldFolds=s.folds,oldGround=rsGround(player.x,player.y,s.z);
      s.foldCooldown=0;const moved=rsMove(dx/len*Math.min(.07,len),dy/len*Math.min(.07,len));
      if(s.folds!==oldFolds){failure='ordinary centerline unexpectedly crosses a spatial fold';break;}
      maxHeightStep=Math.max(maxHeightStep,Math.abs(s.z-oldZ));
      if(moved<.006){failure='blocked by collision';break;}
      const newGround=rsGround(player.x,player.y,s.z),heightChange=Math.abs(s.z-oldZ);
      if(heightChange>.36||(heightChange>.085&&(oldGround?.slope||newGround?.slope))){failure='discontinuous height on ordinary stair traversal';break;}
     }
     // Authored raised ledges can sit a small step above their owning room's
     // base floor; they are not failures of the room-to-room connection.
     if(!failure&&Math.abs(s.z-point[2])>.36)failure='waypoint floor height does not match actual ground';
    }
    if(!failure&&!rsAt(player.x,player.y).some(v=>v.id===to&&Math.abs(rsFloor(v,player.x,player.y)-s.z)<.36))failure='centerline does not reach destination room interior';
    if(failure)failures.push({id:c.id,reverse,reason:failure,x:player.x,y:player.y,z:s.z});
    else{passed.push(c.id+(reverse?':reverse':':forward'));if(c.type==='stairs')stairChecks++;}
   }
  }
  return{failures,passed,stairChecks};
 }finally{
  for(const [d,open]of doors)rsDoorSet(d,open);Object.assign(player,{x:saved.x,y:saved.y,a:saved.a});s.z=saved.z;s.committed=saved.committed;s.foldCooldown=saved.foldCooldown;_safeX=player.x;_safeY=player.y;
 }
}

function install(r){r.eval([rsAuditAnchor,rsAuditFlood,rsAuditConnections].map(fn=>fn.toString()).join('\n'));}
function audit(r,options={}){
 const result=JSON.parse(r.eval('JSON.stringify(rsAuditFlood('+JSON.stringify(options)+'))'));
 assert(!result.limit,`Navigation search exceeded ${options.maxStates||350000} sampled states; inspect bounds/resolution before claiming reachability`);
 return result;
}
function connections(r){return JSON.parse(r.eval('JSON.stringify(rsAuditConnections())'));}
module.exports={install,audit,connections};
if(require.main===module){
 const r=require('./runtime_harness.cjs')();install(r);
 r.eval("artReady=true;rsPreview('rs_stairs');player.x=3.55;player.y=2.5;player.a=Math.PI;rsEnter();");
 const result=audit(r,{openDoors:true});
 const {route,roomPoses,...report}=result;console.log(JSON.stringify(report,null,2));
 assert.equal(result.roomCount,84);assert.deepEqual(result.unreached,[]);assert(result.exit);
 console.log('PASS sampled collision traversal; this is not a timed human playthrough.');
}
