// Threats belong to a small set of authored dark spaces. Their lighting is
// present on every visit, including the much more common visits with no enemy.
// No floor, doorway, connection, fold or movement rule is changed here.
const RS_THREAT_ROOMS=Object.freeze({hollow:Object.freeze(['R01','R05','R13'])});
const RS_THREAT_PALETTES={
 hollow:{ambient:.052,tint:[.65,.85,.89],fog:[1,4,5],falloff:.00016}
};
function rsThreatRoomIds(kind){return (RS_THREAT_ROOMS[kind]||[]).slice();}
function rsThreatRoomEligible(room,kind){
 const s=typeof room==='string'?RW.byId[room]:room;if(!s?.room||!RS_THREAT_ROOMS[kind]?.includes(s.id))return false;
 const w=s.bounds[2]-s.bounds[0],d=s.bounds[3]-s.bounds[1];
 return kind==='hollow'&&s.h>=4.3&&Math.min(w,d)>=35&&s.water>=.14;
}
function rsThreatRoomFor(owner){const s=typeof owner==='string'?RW.byId[owner]:owner;return s?.threatKind?s:s?.parentRoom?RW.byId[s.parentRoom]:null;}
function rsThreatPrepareRooms(){
 for(const kind of Object.keys(RS_THREAT_ROOMS))for(const id of RS_THREAT_ROOMS[kind]){
  const s=RW.byId[id];if(!s)continue;s.threatKind=kind;s.renderPalette=RS_THREAT_PALETTES[kind];s.ambientLight=s.renderPalette.ambient;s.darkPractical=true;
 }
}
function rsThreatDressWorld(){
 if(RW.threatDressed)return;RW.threatDressed=true;
 const selected=new Set(Object.values(RS_THREAT_ROOMS).flat());
 for(const s of RW.surfaces){const parent=RW.byId[s.parentRoom];if(parent?.threatKind){s.renderPalette=parent.renderPalette;s.ambientLight=parent.ambientLight;s.threatParent=parent.id;}}
 // Failed tubes are physically dark, including their reflected glass. Leaving
 // a bright emissive tube above a room with zero lamp power looks artificial.
 for(const l of RW.lights)if(selected.has(l.owner)){l.power=0;l.failed=true;}
 for(const f of RW.faces)if(selected.has(f.owner)&&(f.mat===5||f.mat===10)&&!f.sign){f.mat=4;f.failedLamp=true;}
 const previous=RW.owner;
 for(const id of selected){
  const s=RW.byId[id],[x,y,X,Y]=s.bounds;RW.owner=id;s.threatPracticalLights=[];
  {
   // Two small side-wall maintenance lights establish scale and backlight
   // columns. They leave the centre of the bath and its long approach dark.
   for(const [px,py]of [[x+.16,y+6],[X-.16,Y-6]]){
    rsBox(px,py,s.z+2.5,.08,.75,.16,4,false,true);
    rsBox(px+(px<(x+X)/2?.045:-.045),py,s.z+2.52,.014,.59,.105,5,false,true);
    const l={owner:id,x:px+(px<(x+X)/2?.35:-.35),y:py,z:s.z+2.56,power:.64,warm:false,color:[.54,.77,.88],threatPractical:true};RW.lights.push(l);s.threatPracticalLights.push(l);
   }
  }
 }
 RW.owner=previous;
}
// Raw local illumination for articulated creature materials; hidden creatures
// still draw nothing. Callers can use a restrained readability floor on reveal.
function rsThreatVisibilityAt(x,y,z,roomId){
 const s=rsThreatRoomFor(roomId);if(!s?.threatKind)return RW.byId[roomId]?.ambientLight??.12;
 let value=s.ambientLight;
 for(const l of s.threatPracticalLights||[])value+=l.power*.73/(1+((x-l.x)**2+(y-l.y)**2+(z-l.z)**2)*.16);
 return Math.min(1.15,value+rsThreatMuzzleAt(x,y,z,s.id));
}
// A short point flash illuminates nearby visible tile, water and bodies in the
// same architectural room. It cannot raise adjacent rooms or another floor.
// Three cheap vertex samples reuse the existing raster pass, with no new pass,
// light cache, ray walk or per-pixel loop. Its radius is strictly bounded.
function rsThreatMuzzleAt(x,y,z,owner){
 if(!(muzzle>0)||!RS.active)return 0;
 const s=rsThreatRoomFor(owner),current=rsThreatRoomFor(RS.active.room);if(!s?.threatKind||s.id!==current?.id)return 0;
 const dx=x-player.x,dy=y-player.y,dz=z-(RS.active.z+RS_EYE-.12),d2=dx*dx+dy*dy+dz*dz;if(d2>=196)return 0;
 return (settings.reduce?.25:.98)*Math.min(1,muzzle/.045)*(1-d2/196)/(1+d2*.038);
}
