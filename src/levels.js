// levels.js — bundled from the owner’s liminal baseline.
function createMap(level){if(useChapter&&level===3){s4CreateMap();return;}if(useChapter&&level===0){chCreateMap();return;}if(useChapter&&level===1){fvCreateMap();return;}if(useChapter&&level===2){hwCreateMap();return;}map=Array.from({length:MH},()=>Array(MW).fill(1));const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
 [[1,2,6,7],[9,1,15,7],[18,1,23,8],[18,11,23,16],[9,11,15,17],[1,10,6,17],[6,20,21,23],[6,4,9,5],[15,4,18,5],[20,8,21,11],[15,13,18,14],[6,13,9,14],[3,7,4,10],[12,17,13,20],[3,17,4,21],[3,21,9,22],[20,16,21,20]].forEach(r=>carve(...r));
 const columns=[[4,2],[11,3],[13,6],[21,2],[19,6],[22,13],[10,14],[14,16],[2,13],[5,15],[9,22],[16,20]];for(const [x,y]of columns)map[y][x]=2;
 if(level===1){map[11][19]=2;map[15][12]=2;map[6][10]=2;}if(level===2){map[12][22]=2;map[3][14]=2;map[16][3]=2;}
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function spawn(x,y,type){const a=creatureTypes[type];const _e={id:enemyId++,x,y,type,hp:a.hp*(1+stage*.1),maxHp:a.hp*(1+stage*.1),alive:true,cd:rand(.4,1.8),vocal:rand(.5,4),hurt:0,phase:rand(0,TAU),state:'hunt',windup:0,charge:0,dx:0,dy:0,r:type===2?.27:.2,noticed:false,walk:0,death:0,cower:0,dormant:false};enemies.push(_e);return _e;}
function populate(level){if(useChapter&&level===3){enemies=[];drops=[];return;}if(useChapter&&level===0){chPopulate();return;}if(useChapter&&level===1){fvPopulate();return;}if(useChapter&&level===2){hwPopulate();return;}enemies=[];const spots=[[5.7,4.5,0],[9.7,4.5,1],[13.7,2.7,0],[14.5,6.4,1],[18.8,4.7,0],[22.4,4.2,2],[19.5,7.5,1],[20.5,10.5,0],[22.2,15.3,0],[18.8,12.2,1],[14.4,13.5,2],[10.3,16.3,0],[5.5,13.5,1],[2.5,16.1,0],[8.3,21.3,0],[13.7,22.6,1],[18.3,22.6,2]];
 if(level>0)spots.push([11.5,6.4,0],[22.6,7.5,1],[4.5,11.5,0],[17.6,21.5,1]);if(level>1)spots.push([13.5,11.7,2],[3.5,19.5,1],[21.3,21.5,2],[6.5,4.5,1]);
 for(const s of spots)spawn(...s);drops=[{x:11.8,y:2.3,type:'life',life:999},{x:22.7,y:11.6,type:'ammo',life:999},{x:2.5,y:10.7,type:'life',life:999},{x:12.5,y:19.2,type:'ammo',life:999}];
}
function loadStage(level){s4dReset();S4.on=false;$('leaveHospitalBtn').classList.add('hidden');liminalReset();MW=useChapter&&level===3?S4_WIDTH:64;MH=useChapter&&level===3?S4_HEIGHT:64;exit={x:20.5,y:22.5};releaseInputs();stage=level;hbReset();stageKills=0;stageTime=0;cleared=false;grace=6;createMap(level);setupEnvironment();horrorSetup();populate(level);player.x=2.8;player.y=4.5;player.a=0;player.vx=player.vy=0;player.hp=100;aimPitch=bob=sway=lookDelta=weaponDrop=hitmarker=killmarker=reloadDuration=0;_safeX=player.x;_safeY=player.y;bullets=[];particles=[];rings=[];decals=[];tracers=[];numbers=[];flowClock=0;shotCD=reloadT=dashT=dashCD=meleeT=meleeCD=0;recoil=muzzle=shake=hurt=whiteFlash=hitstop=0;for(const g of guns){g.ammo=g.mag;g.reserve=Math.max(g.reserve,g.mag*3);}if(useChapter&&level===0){FV.on=HW.on=false;FV.checkpoint=HW.checkpoint=null;chBegin();audio.theatre(false);audio.heart(0);}else if(useChapter&&level===1){HW.on=false;HW.checkpoint=null;audio.heart(0);fvBegin();}else if(useChapter&&level===2){FV.on=false;hwBegin();}else if(useChapter&&level===3){FV.on=HW.on=CH.on=false;FV.checkpoint=HW.checkpoint=CH.checkpoint=null;CH.tr=null;s4Begin();}else{FV.on=HW.on=false;audio.theatre(false);audio.heart(0);}buildFlow();if(useChapter&&level===0){say('ADMISSIONS',2.4);feed('THE WARD HAS NO POWER');}else if(useChapter&&level===1){say('FEVER THEATRE',2.4);feed('THREE THEATRES ARE STILL RUNNING');}else if(useChapter&&level===2){say('THE HEART WARD',2.4);feed('YOU HAVE BEEN HERE BEFORE');}else if(s4Running()){say('NO WAY OUT',2.6);feed('THE GROUNDS // TAKE A BREATH');}else{say('WARD '+(level+1)+' // '+wardNames[level],2.6);feed(quotas[level]+' KILLS BREAK THE SEAL');}hudUpdate();}
const FLOW_CACHE={field:null,walkable:null,queue:null,mapCells:null,collisionInputs:[],simpleValid:false,width:0,height:0,x:0,y:0,topology:0,stats:{builds:0,hits:0,scans:0,adopted:0}};
function flowTopologyChanged(){
 const c=FLOW_CACHE,n=MW*MH;
 // These are the ordinary wards/exterior collision inputs. Transfer and the
 // vertical Restrooms use different geometry and are sampled conservatively.
 const simple=typeof furniture!=='undefined'&&typeof furnGrid!=='undefined'&&
  (typeof tfRunning!=='function'||!tfRunning())&&(typeof rsRunning!=='function'||!rsRunning());
 if(!simple){c.simpleValid=false;return true;}
 let changed=!c.simpleValid||c.width!==MW||c.height!==MH;
 if(c.mapCells?.length!==n)c.mapCells=new Uint8Array(n);
 for(let yy=0,i=0;yy<MH;yy++)for(let xx=0;xx<MW;xx++,i++){
  const solid=map[yy][xx]===0?0:1;if(c.mapCells[i]!==solid){changed=true;c.mapCells[i]=solid;}
 }
 let at=0;const check=value=>{if(c.collisionInputs[at]!==value){changed=true;c.collisionInputs[at]=value;}at++;};
 // Rebuilding the index changes identity; existing bodies may move in place.
 check(furnGrid);check(furnGrid?.size||0);check(furniture);check(fits);check(wall);check(furnitureFree);check(cbBodyFree);
 for(const p of furniture){check(p);check(p.x);check(p.y);check(p.c);check(p.s);check(p.hx);check(p.hy);}
 const outside=typeof s4Running==='function'&&s4Running(),boss=typeof cbRunning==='function'&&cbRunning();check(outside);check(boss);
 if(outside){
  check(s4Solid);check(s4Outside);check(s4Pond);check(s4InWaterOval);check(S4.solids);
  for(const b of S4.solids){check(b.x0);check(b.x1);check(b.y0);check(b.y1);}
  for(const p of [S4_POND,S4_LAKE]){check(p.x);check(p.y);check(p.rx);check(p.ry);}
 }
 if(boss){check(CB.alive);if(CB.alive){check(CB.x);check(CB.y);check(CB_RADIUS);}}
 if(c.collisionInputs.length!==at){changed=true;c.collisionInputs.length=at;}
 c.simpleValid=true;return changed;
}
// A parked chapter may prepare this exact bitmap and BFS incrementally. Taking
// ownership avoids recomputing either at the visible portal crossing.
function adoptFlow(field,x,y,walkable){
 const c=FLOW_CACHE,n=MW*MH;if(field?.length!==n||walkable?.length!==n)return false;
 flow=field;c.field=field;c.walkable=walkable;c.width=MW;c.height=MH;c.x=x|0;c.y=y|0;c.simpleValid=false;c.topology++;c.stats.adopted++;return true;
}
function buildFlow(){
 const c=FLOW_CACHE,n=MW*MH,x=player.x|0,y=player.y|0;
 let changed=!c.walkable||c.width!==MW||c.height!==MH;
 if(changed)c.walkable=new Uint8Array(n);
 // Compare actual traversability, not a hash or a manually maintained door
 // version: map writes, furniture, vehicle movement and the boss body all
 // affect fits(), including edits made by older chapter code.
 if(flowTopologyChanged()||changed){
  c.stats.scans++;
  for(let yy=0,i=0;yy<MH;yy++)for(let xx=0;xx<MW;xx++,i++){
   const open=map[yy][xx]===0&&fits(xx+.5,yy+.5,.27)?1:0;
   if(c.walkable[i]!==open){changed=true;c.walkable[i]=open;}
  }
 }
 if(!changed&&flow===c.field&&c.x===x&&c.y===y){c.stats.hits++;return flow;}
 if(changed)c.topology++;
 // A new result leaves parked references immutable. Only the BFS work queue
 // is reused; it does not belong to a saved chapter or portal view.
 flow=new Int16Array(n).fill(-1);if(c.queue?.length!==n)c.queue=new Int16Array(n);
 const q=c.queue;let r=0,w=0;const idx=y*MW+x;flow[idx]=0;q[w++]=idx;
 while(r<w){const i=q[r++],xx=i%MW,yy=(i/MW)|0,next=flow[i]+1;
  for(let direction=0;direction<4;direction++){
   const nx=xx+(direction===0?1:direction===1?-1:0),ny=yy+(direction===2?1:direction===3?-1:0),ni=ny*MW+nx;
   if(nx<0||ny<0||nx>=MW||ny>=MH||!c.walkable[ni]||flow[ni]!==-1)continue;
   flow[ni]=next;q[w++]=ni;
  }
 }
 c.field=flow;c.width=MW;c.height=MH;c.x=x;c.y=y;c.stats.builds++;return flow;
}
