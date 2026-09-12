// R4-P01-R04: authored clearings within continuous, impassable woodland.
// A shared occupancy mask drives both collision and the visible forest edge.
function s4Clearing(x,y){
 if(s4PathDistance(x,y,S4_EXIT_PATH)<1.85)return true;
 if(s4PathDistance(x,y,S4Q_WALK)<1.65)return true;
 if(s4Pond(x,y)||((x-S4_LAKE.x)/(S4_LAKE.rx+1.7))**2+((y-S4_LAKE.y)/(S4_LAKE.ry+1.7))**2<1)return true;
 // A small open bank lets the western view and hospital bay read together.
 if(x>24&&x<40&&y>27&&y<36)return true;
 // No shore clearance beside the entrance: the garden route is the only access.
 if(((x-S4_POND.x)/(S4_POND.rx+1.6))**2+((y-49)/15.6)**2<1&&x<53)return true;
 if(x>60.4&&x<78&&y>45&&y<61)return true;
 if(x>75.5&&x<81&&y>46&&y<64)return true;
 if(x>60.4&&x<68.6&&y>38&&y<51)return true;
 if(x>30&&x<50&&y>19&&y<34.5)return true;
 if(x>38&&x<48&&y>17&&y<22)return true;
 if(x>76.5&&x<132&&y>61&&y<90)return true;
 if(x>68&&x<101&&y>59&&y<63)return true;
 if(x>68&&x<81&&y>59&&y<74)return true;
 if(s4PathDistance(x,y,S4_PARK_PATH)<1.85)return true;
 if(s4PathDistance(x,y,S4_GARDEN_PATH)<1.45)return true;
 if(s4PathDistance(x,y,S4_POND_PATH)<1.65)return true;
 if(s4PathDistance(x,y,S4_ROAD)<4.4)return true;
 return x>130.5&&x<140&&y>3.5&&y<11.2;
}
// A small, impassable low-canopy notch frames the distant city from the court.
function s4CityWindow(x,y){return y>20&&y<45&&Math.abs(x-(64+(47-y)*.255))<3.5;}
function s4CityCanopy(x,y){return y>4&&y<45&&Math.abs(x-(64+(47-y)*.255))<4.6;}
function s4ForestAt(x,y){return x>=0&&x<S4_WIDTH&&y>=0&&y<S4_HEIGHT&&S4.forest[(y|0)*S4_WIDTH+(x|0)]===1;}
function s4WoodHash(x,y){let n=Math.imul(x-S4_ORIGIN+573,374761393)^Math.imul(y+811,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
function s4ForestHeight(x,y){return x>67&&y>60?1.6+s4WoodHash(x,y)*.4:s4CityWindow(x,y)?1.3+s4WoodHash(x,y)*.25:3.3+s4WoodHash(x,y)*.8;}
function s4Vegetation(x,y,w,h,tex,z=0){if(x>67&&y>60&&h>4.5){w*=.7;h=4.5;}S4.flora.push({x,y,w,h,z,tex});}
function s4BuildForest(){
 const forest=S4.forest=new Uint8Array(S4_WIDTH*S4_HEIGHT);
 for(let y=2;y<S4_HEIGHT-4;y++)for(let x=4;x<S4_WIDTH-2;x++){
  if(!s4Clearing(x+.5,y+.5))forest[y*S4_WIDTH+x]=1;
 }
 // Merge solid runs vertically. No separate invisible tree colliders or gaps.
 let previous=new Map();
 for(let y=2;y<S4_HEIGHT-4;y++){
  const row=new Map();
  for(let x=4;x<S4_WIDTH-2;){if(!forest[y*S4_WIDTH+x]){x++;continue;}
   const a=x;while(x<S4_WIDTH-2&&forest[y*S4_WIDTH+x])x++;
   const key=a+','+x;let box=previous.get(key);
   if(box)box.y1=y+1;else{box={x0:a,x1:x,y0:y,y1:y+1,kind:'forest'};S4.solids.push(box);}
   row.set(key,box);
  }previous=row;
 }
 for(let y=2;y<S4_HEIGHT-4;y++)for(let x=4;x<S4_WIDTH-2;x++){
  if(!forest[y*S4_WIDTH+x])continue;
  let edge=false,outX=0,outY=0;
  for(const [dx,dy,ax,ay,bx,by]of [[0,-1,x,y,x+1,y],[1,0,x+1,y,x+1,y+1],[0,1,x+1,y+1,x,y+1],[-1,0,x,y+1,x,y]]){
   if(s4ForestAt(x+dx,y+dy))continue;
   // Boundary forest is viewed from a clearing; unseen outer faces are unnecessary.
   if(x+dx<4||x+dx>=S4_WIDTH-2||y+dy<2||y+dy>=S4_HEIGHT-4)continue;
   edge=true;outX+=dx;outY+=dy;
   const face=s4Quad([[ax,ay,0],[bx,by,0],[bx,by,s4ForestHeight(bx,by)],[ax,ay,s4ForestHeight(ax,ay)]],8,[31,54,43],.25,1);
   face.u0=(dx?y:x)*.25;face.out=[dx,dy];
   if((x-S4_ORIGIN+y*3)%4===0){
    // Leafy skirts soften the grid edge. The opaque core remains at its exact collision line.
    s4Vegetation((ax+bx)/2-dx*.06,(ay+by)/2-dy*.06,2.4,1.8,14);
   }
  }
  // Tall overlapping tree clusters break the skyline, including behind garden hedges.
  if(edge&&(x-S4_ORIGIN+y)%3===0){
   const n=s4WoodHash(x,y),len=Math.hypot(outX,outY)||1,tx=x+.5-outX/len*1.9,ty=y+.5-outY/len*1.9;
   // Keep the trunks in the woods, so tall sprites cannot visually fill a walkable lane.
   if(s4ForestAt(tx,ty)&&!(ty>37&&tx>56&&tx<78)&&!s4CityCanopy(tx,ty)&&!s4CityCanopy(tx-3,ty)&&!s4CityCanopy(tx+3,ty))s4Vegetation(tx,ty,5.2+n*1.8,6.8+n*3.2,n>.46?12:13);
  }
 }
 // A second, sparse row gives depth above the thicket without filling the level with meshes.
 for(let y=5;y<S4_HEIGHT-6;y+=5)for(let x=4;x<S4_WIDTH-4;x+=5){
  if(!s4ForestAt(x,y))continue;
  const close= !s4ForestAt(x+3,y)||!s4ForestAt(x-3,y)||!s4ForestAt(x,y+3)||!s4ForestAt(x,y-3);
  if(close&&!s4CityCanopy(x,y)&&!s4CityCanopy(x-3,y)&&!s4CityCanopy(x+3,y)){const n=s4WoodHash(x,y);s4Vegetation(x+.3,y+.2,5+n*2,8+n*3,n>.55?12:13);}
 }
 // Beyond the northern boundary, crowns continue the forest behind the roadside shelter.
 // Their roots are outside the playable grounds; no extra collision or navigation cells are needed.
 for(let x=9;x<S4_WIDTH;x+=4){const n=s4WoodHash(x,1);s4Vegetation(x,-.4,5.8+n*1.2,6+n*2.2,n>.4?12:13);}
}
function s4Hedge(x0,y0,x1,y1,crashCorner=false){
 const start=S4.faces.length;
 s4Box((x0+x1)/2,(y0+y1)/2,0,x1-x0,y1-y0,2.8,9,[39,73,49],false,1.6);
 S4.solids.push({x0,x1,y0,y1,kind:'hedge'});
 for(let i=start;i<S4.faces.length;i++){S4.faces[i].hedge=true;if(crashCorner)S4.faces[i].s4CrashHedge=true;}
 const vertical=y1-y0>x1-x0,length=vertical?y1-y0:x1-x0;
 for(let d=.8;d<length;d+=2.1){const x=vertical?(x0+x1)/2:x0+d,y=vertical?y0+d:(y0+y1)/2;
  s4Vegetation(x,y,3,1.6,15,1.8);
  if(crashCorner&&d<1.2)S4.flora[S4.flora.length-1].s4CrashHedge=true;
 }
}
function s4RoadMark(a,b,offset,width,color){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
 const p=(v,s)=>[v[0]+nx*s,v[1]+ny*s,.014];
 s4Quad([p(a,offset-width/2),p(b,offset-width/2),p(b,offset+width/2),p(a,offset+width/2)],-1,color);
}
function s4RoadSign(x,y,text,read,front,w=3.1,z=1.64){
 s4Box(x,y,0,.09,.09,z+.04,7,[46,64,59],true);
 s4Label(x,y,z,text,w,{h:Math.min(.42,w*.15),front,interact:'READ THE ROAD SIGN',read});
}
function s4BuildRoad(){
 for(let i=2;i<S4_ROAD.length;i++){
  const a=S4_ROAD[i-1],b=S4_ROAD[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(const side of[-1,1])s4RoadMark(a,b,side*2.77,.07,[147,158,137]);
  for(let d=.8;d<len-1;d+=3.4){const t=d/len,t2=Math.min(1,(d+1.35)/len);s4RoadMark([mix(a[0],b[0],t),mix(a[1],b[1],t)],[mix(a[0],b[0],t2),mix(a[1],b[1],t2)],0,.085,[163,158,106]);}
 }
 s4Group(S4_ORIGIN,0,()=>{
 // Sparse lamps reveal each turn without turning the forest into a lit corridor.
 for(const [x,y]of [[35.5,19.8],[45.4,10],[60.6,16.5],[74.6,18.4],[87,16],[100.7,16.1]])s4Lamp(x,y,[137,164,140]);
 s4RoadSign(35.6,30,'BUS STATION ↑','BUS STATION\nFollow the forest road toward the city.',[0,1]);
 s4RoadSign(63,20.3,'BUS STATION ↖','BUS STATION ↖\nFollow the next road bend.',[-.58,-.81]);
 s4Label(63,20.3,1.64,'HOSPITAL ↗',3.1,{h:.42,front:[.58,.81],interact:'READ THE ROAD SIGN',read:'HOSPITAL ↗\nThe garden and parking are at the entrance court.'});
 s4RoadSign(97.3,14.4,'BUS STOP ↖','BUS STATION — ROADSIDE SHELTER\nContinue around the bend.',[-1,0]);
 s4RoadSign(107.8,10.2,'← HOSPITAL  /  CITY →','HOSPITAL ←\nCITY ROAD →', [0,1]);
 // Visible end of this review's city road; no unmarked invisible boundary across asphalt.
 s4Fence(108.7,7.5,108.7,16.5,.85);
 s4RoadSign(108.6,12,'ROAD CLOSED','CITY ROAD CLOSED\nReturn along the road to the hospital grounds.',[-1,0]);
 });
}
function s4BuildBusShelter(x,y){
 s4Box(x,y,1.95,6,3.6,.17,7,[39,67,70]);
 for(const dx of[-2.8,2.8])for(const dy of[-1.5,1.5])s4Box(x+dx,y+dy,0,.12,.12,1.95,7,[60,81,79],true);
 s4Box(x,y-1.56,0,5.8,.11,1.86,7,[48,68,67],true,2);
 s4Box(x,y-.7,.26,3.8,.45,.14,7,[68,72,57],true);s4Box(x,y-.9,.45,3.8,.085,.45,7,[67,74,60]);
 s4Box(x+2.7,y+.6,.6,.12,.78,.72,7,[89,103,97]);
 s4Label(x,y+1.84,2.04,'BUS STATION / LAST SERVICE',5.5,{front:[0,1],h:.22});
 s4Label(x+2.45,y+1.1,1.08,'',2,{interact:'READ THE TIMETABLE',read:'LAST SERVICE — 23:10\nNo arrivals are listed.'});
 s4Lamp(x-3.6,y+3.2,[171,174,139]);
 // Low curb separates the shelter platform from the road instead of putting it in the road.
 s4Box(x,y+3.6,0,8.5,.12,.07,4,[88,106,96],false,2);
}
// Shared exposed shoreline: collision, the curb and shore wash describe the same water.
function s4BuildWaterfront(){
 const banks=[S4_POND,S4_LAKE];
 for(const [index,p]of banks.entries()){
  const other=banks[1-index],count=index?512:96;
  for(let i=0;i<count;i++){
   const a=i/count*TAU,b=(i+1)/count*TAU,mid=(a+b)/2;
   const point={x:p.x+p.rx*Math.cos(mid),y:p.y+p.ry*Math.sin(mid)};
   if(s4InWaterOval(point.x,point.y,other))continue;
   S4.shore.push(point);
   // The developed bank ends at the estate; the remote shore remains wilderness.
   if(point.x<4||point.x>S4_WIDTH-2||point.y<2||point.y>S4_HEIGHT-4)continue;
   const u=[p.x+p.rx*Math.cos(a),p.y+p.ry*Math.sin(a)],v=[p.x+p.rx*Math.cos(b),p.y+p.ry*Math.sin(b)];
   s4Quad([[...u,0],[...v,0],[...v,.095],[...u,.095]],4,[55,69,62],1,.3);
  }
 }
 // Distant wooded ridges use the existing tree artwork. They are beyond the water,
 // outside the walkable estate, and are never an invisible wall near the player.
 for(let i=0;i<=72;i++){
  const a=Math.PI*.46+i/72*Math.PI*1.08,n=s4WoodHash(i,207),x=S4_LAKE.x+(S4_LAKE.rx+5)*Math.cos(a),y=S4_LAKE.y+(S4_LAKE.ry+5)*Math.sin(a);
  s4Vegetation(x,y,14+n*6,8+n*5,n>.45?12:13);
 }
 for(let i=0;i<=40;i++){
  const a=Math.PI*.47+i/40*Math.PI*1.06,n=s4WoodHash(i,419),x=S4_LAKE.x+(S4_LAKE.rx+24)*Math.cos(a),y=S4_LAKE.y+(S4_LAKE.ry+24)*Math.sin(a);
  s4Vegetation(x,y,23+n*9,12+n*7,n>.6?12:13,1);
 }
}
function s4BuildGrounds(){
 s4BuildForest();
 // Living walls frame a vehicle-sized mouth and conceal the water along the first leg.
 s4Hedge(58.4,35.5,60.3,41.8);s4Hedge(58.4,44.2,60.3,48.3,true);
 s4Hedge(53.5,35.3,54.6,47.9);
 for(const y of [41.5,44.5]){const first=S4.faces.length;s4Box(60.45,y,0,.55,.6,1.8,4,[78,85,70],true);if(y===44.5)for(const f of S4.faces.slice(first))f.s4BreakPost=true;}
 s4Hedge(49.7,19.5,51.1,23.6);
 s4Hedge(28.1,18.7,39,20.25);s4Hedge(47,18.7,51,20.25);
 s4RoadSign(61.2,44.8,'GARDEN GATES ↑','GARDEN GATES\nPass through the narrow opening and follow the living hedge.',[1,0],2.4,1.3);
 s4RoadSign(53.3,28.5,'GARDEN GATES ↖','GARDEN GATES\nThe grass clearing is around the next bend.',[0,1]);
 s4Label(53.3,28.5,1.64,'HOSPITAL ←',3.1,{h:.42,front:[0,-1],interact:'READ THE ROAD SIGN',read:'HOSPITAL ←\nFollow the hedge walk back to the court.'});
 s4RoadSign(79.9,64.3,'HOSPITAL →','HOSPITAL →\nFollow the path around the hospital wing back to the entrance court.',[1,0]);
 for(const [x,y]of [[75,39.7],[80.6,52.5],[81.3,59.3],[57.6,38.3],[52,29.5]])s4Lamp(x,y,[133,160,140]);
 s4BuildRoad();
 // Cache horizontal bounds for cheap visibility rejection on mobile.
 for(const face of S4.faces){const xs=face.points.map(p=>p[0]),ys=face.points.map(p=>p[1]);face.cx=(Math.min(...xs)+Math.max(...xs))/2;face.cy=(Math.min(...ys)+Math.max(...ys))/2;face.radius=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))/2;}
}

