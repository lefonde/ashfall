// Scene 4 / Phase 1. An explicit, calm exterior chapter; later encounters are not enabled.
const S4_ORIGIN=32,S4_WIDTH=144,S4_HEIGHT=96,S4_TW=S4_WIDTH*2,S4_TH=S4_HEIGHT*2;
const S4={on:false,zone:'',visited:new Set(),faces:[],solids:[],labels:[],lamps:[],flora:[],shore:[],forest:null,terrain:new Uint8Array(S4_TW*S4_TH),depth:null,entry:null};
const S4_ENTRIES={
 court:{label:'Courtyard — first breath',x:64,y:47,a:-Math.PI/2,hint:'Look slightly right for the city beyond the forest. The left path passes through a narrow hedge entrance; the right path winds to parking. Turn around to see the hospital. Walk to the three-way sign, then choose any route.'},
 hospital:{label:'Hospital — look back',x:64,y:42,a:Math.PI/2,hint:'Look back at the doors and the hospital wings. Walk toward the entrance, along the facade and under the canopy. Check its scale and silhouette against the sky.'},
 parking:{label:'Parking lot — rows of silence',x:88,y:76.8,a:-2.1,hint:'Parking sits behind the hospital’s left wing, as seen when facing the hospital. Walk around the building to return to the court; compare that journey with the longer bus route. Look out across the open outer verge. Explore the cars and find the screened entrance back to the court. Neither the garden nor the bus stop should be visible. For the expedition and enemies, choose Parking — the spare keys.'},
 road:{label:'Forest road — halfway out',x:100,y:21,a:0,hint:'Follow the asphalt and pale edge lines through the trees. The bus stop is still ahead, beside the city road. Turn back and follow HOSPITAL signs to return.'},
 bus:{label:'Bus station — last service',x:135,y:15.4,a:-Math.PI/2,hint:'The shelter sits beside the city road, beyond the wooded bends. Step under its roof, read the timetable, then follow the road back. Parking and the garden are hidden by forest. There is no extinguisher objective yet.'},
 gardens:{label:'Garden gates — the clearing',x:42,y:32,a:-1.47,hint:'Cross the grass. The royal gates are ahead, slightly right; the pond is behind your left shoulder and runs back toward the hospital. No boss is present in this phase.'},
 pond:{label:'Pond — the western horizon',x:25.25,y:29,a:Math.PI,hint:'Look west over the open water toward the distant wilderness. Walk along the near bank and look back toward the hospital. Check that the water feels expansive, with a distant shoreline instead of a nearby forest wall. Water still blocks movement.'}
};
// The approved hospital bay joins a much larger western body of water.
const S4_POND={x:32,y:49,rx:23,ry:14};
const S4_LAKE={x:-145,y:49,rx:172,ry:118};
// Only this 2.4-unit mouth connects the garden route to the court.
const S4_GARDEN_MOUTH={x:59,y:43,width:2.4};
const S4_GARDEN_PATH=[[64,43],[59,43],[56.5,43],[56.5,39],[55.8,36],[54.4,30],[49,26],[44,28],[42,32]];
const S4_POND_PATH=[[42,32],[34,31],[30,30],[25.25,29]];
// A short continuation makes the released gate an actual way out. It bends
// into the woods; the chapter ends on crossing, before the next journey.
const S4_EXIT_PATH=[[43,21],[43,13],[40,9],[39,6]];
const S4_PARK_PATH=[[64,41],[72,41],[77,43],[79,48],[79,57],[80,61],[84,63]];
// Translation preserves every bend, road width and marking of the approved forward road.
const S4_ROAD=[[32,41],[32,32],[32,26],[32,19],[38,13],[46,13],[50,8],[57,8],[63,14],[68,21],[75,21],[81,14],[87,13],[92,18],[98,18],[103,12],[109,12]].map(([x,y])=>[x+S4_ORIGIN,y]);
const S4_BUS={x:135,y:6.5};
function s4Running(){return useChapter&&stage===3&&S4.on;}
function s4InWaterOval(x,y,p){return ((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2<1;}
function s4Pond(x,y){return s4InWaterOval(x,y,S4_POND)||s4InWaterOval(x,y,S4_LAKE);}
function s4NearestShore(x,y){
 let nearest={x:S4_POND.x,y:S4_POND.y-S4_POND.ry},distance=Infinity;
 for(const p of S4.shore){const d=(p.x-x)**2+(p.y-y)**2;if(d<distance){distance=d;nearest=p;}}
 return nearest;
}
function s4PathDistance(x,y,points){let d=Infinity;for(let i=1;i<points.length;i++){const [ax,ay]=points[i-1],[bx,by]=points[i],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);d=Math.min(d,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return d;}
function s4GroundType(x,y){
 if(s4Pond(x,y))return 3;
 if(s4PathDistance(x,y,S4_EXIT_PATH)<1.15)return 1;
 if(x>131&&x<139.5&&y>4&&y<10.6)return 1;
 if(x>81.5&&x<100.6&&y>62&&y<82.8)return 0;
 if(s4PathDistance(x,y,S4Q_WALK)<1.1)return 1;
 const road=s4PathDistance(x,y,S4_ROAD);
 if(y<38&&road<3)return 0;
 if(y<38&&road<3.85)return 1;
 if(s4PathDistance(x,y,S4_GARDEN_PATH)<1.05||s4PathDistance(x,y,S4_POND_PATH)<1.1||s4PathDistance(x,y,S4_PARK_PATH)<1.4||(x>61.6&&x<66.4&&y>36&&y<51)||(x>59&&x<69&&y>44&&y<51))return 1;
 return 2;
}
function s4Outside(x,y){return x<=4||x>=S4_WIDTH-2||y<=2||y>=S4_HEIGHT-4;}
function s4Solid(x,y){return s4Outside(x,y)||s4Pond(x,y)||S4.solids.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);}
function s4ShotBlocked(x,y){return (s4Outside(x,y)&&!s4Pond(x,y))||S4.solids.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);}
function s4CreateMap(){
 S4.on=true;S4.light=null;S4.faces=[];S4.solids=[];S4.labels=[];S4.lamps=[];S4.flora=[];S4.shore=[];
 s4BuildGeometry();s4BuildGrounds();s4qBuildProps();s4BuildSigns();cbfBuildGate();
 map=Array.from({length:MH},(_,y)=>Array.from({length:MW},(_,x)=>s4Solid(x+.5,y+.5)?1:0));
 for(let y=0;y<S4_TH;y++)for(let x=0;x<S4_TW;x++)S4.terrain[y*S4_TW+x]=s4GroundType((x+.5)/2,(y+.5)/2);
 hidden.fill(0);
}
function s4SetupEnvironment(){environmentProps=[];furniture=[];furnGrid=null;wardLights=[];lightField.fill(.55);bakeLightActive();}
function s4Begin(){
 S4.on=true;S4.zone='';S4.visited=new Set();S4.entry=null;exit={x:43,y:19.5};cleared=false;
 player.x=64;player.y=47;player.a=-Math.PI/2;player.vx=player.vy=0;_safeX=player.x;_safeY=player.y;
 audio.theatre(false);audio.heart(0);audio.exteriorMix();
}
function s4JumpTo(at){const p=S4_ENTRIES[at];if(p){reviewPlace(p.x,p.y,p.a);S4.zone='';s4Tick(0);}}
function s4EnterFromHeart(){
 if(mode!=='won'||!hwRunning()||!HW.ending)return false;
 return s4dBeginWalk();
}
function s4Zone(){
 if(player.x>130&&player.y<17)return 'BUS STATION';
 if(player.x>76&&player.y>60)return 'PARKING LOT';
 if(player.x<30)return 'WESTERN SHORE';
 if(player.x<51&&player.y<35)return 'GARDEN GATES';
 if(player.x<51)return 'POND WALK';
 if(player.x<60&&player.y<48)return 'GARDEN APPROACH';
 if(player.x>72&&player.y>37)return 'PARKING APPROACH';
 if(player.y>48)return 'HOSPITAL ENTRANCE';
 if(player.y<38)return 'FOREST ROAD';
 return 'ENTRANCE COURT';
}
function s4Tick(){if(!s4Running()||mode!=='playing')return;const zone=s4Zone();if(zone!==S4.zone){S4.zone=zone;if(!S4.visited.has(zone)){S4.visited.add(zone);feed(zone);}}}
function s4NearbyLabel(){let best=null,near=4.6;for(const l of S4.labels){if(!l.interact||(l.front&&(player.x-l.x)*l.front[0]+(player.y-l.y)*l.front[1]<0))continue;const d=Math.hypot(player.x-l.x,player.y-l.y),a=Math.abs(angle(Math.atan2(l.y-player.y,l.x-player.x)-player.a));if(d<near&&a<.85&&(d<.3||s4CastRay(player.x,player.y,(l.x-player.x)/d,(l.y-player.y)/d,d-.2).d>=d-.21)){best=l;near=d;}}return best;}
function s4Hud(){
 $('wardName').innerHTML='04 <b>NO WAY OUT</b>';
 const sign=s4NearbyLabel();$('goal').textContent=sign?'[E] '+sign.interact:'EXPLORE THE GROUNDS · '+(S4.zone||'ENTRANCE COURT');
 $('lifeHint').textContent='TAKE A BREATH';$('compassText').textContent='HOSPITAL';
 $('compassArrow').style.transform='rotate('+angle(Math.atan2(50-player.y,64-player.x)-player.a)+'rad)';
 $('touchUse').classList.toggle('hidden',!sign);$('touchUse').textContent='READ';
 if(review.active){$('reviewBarText').textContent='NO WAY OUT · CALM EXTERIOR REVIEW';$('reviewStatus').textContent='T CONTROLS · B RESET · M MAP · TAB PEEK · CALM ENTRY · NO ENCOUNTERS';}
}
function s4Interact(){if(!s4Running()||mode!=='playing')return false;if(s4tInteract()||s4dInteract())return true;const l=s4NearbyLabel();if(!l)return false;feed(review.active?l.read:l.read.replace('T opens the review guide.','ESC → TEST WARD opens the review guide.'));return true;}
function s4CastRay(x,y,dx,dy,max){
 let closest=max,side=0;
 // Water blocks walking, not the horizontal gun ray. Physical structures alone occlude shots.
 const boxes=S4.solids.concat([{x0:-1e3,x1:4,y0:-1e3,y1:1e3},{x0:S4_WIDTH-2,x1:1e3,y0:-1e3,y1:1e3},{x0:4,x1:S4_WIDTH-2,y0:-1e3,y1:2},{x0:4,x1:S4_WIDTH-2,y0:S4_HEIGHT-4,y1:1e3}].map(b=>({...b,estateEdge:true})));
 for(const b of boxes){let lo=0,hi=closest,s=0;for(const [p,v,mn,mx,k]of [[x,dx,b.x0,b.x1,0],[y,dy,b.y0,b.y1,1]]){if(Math.abs(v)<1e-8){if(p<mn||p>mx){hi=-1;break;}continue;}let a=(mn-p)/v,c=(mx-p)/v;if(a>c)[a,c]=[c,a];if(a>lo){lo=a;s=k;}hi=Math.min(hi,c);}if(lo<=hi&&lo>0&&lo<closest){if(b.estateEdge&&s4Pond(x+dx*(lo+.001),y+dy*(lo+.001)))continue;closest=lo;side=s;}}
 const wx=x+dx*closest,wy=y+dy*closest,u=side?wx:wy;return{d:closest,u:u-Math.floor(u),side,mx:wx|0,my:wy|0,type:1};
}
// Native world geometry. Texture indices are private to this chapter.
function s4Quad(points,tex=-1,color=[55,66,70],u=1,v=1,emissive=false){const face={points,tex,color,u,v,emissive};S4.faces.push(face);return face;}
function s4Box(x,y,z,w,d,h,tex=4,color=[62,74,77],solid=false,tile=1){
 const a=x-w/2,b=x+w/2,c=y-d/2,e=y+d/2,f=z+h;
 s4Quad([[a,c,z],[b,c,z],[b,c,f],[a,c,f]],tex,color,w/tile,h/tile);
 s4Quad([[b,e,z],[a,e,z],[a,e,f],[b,e,f]],tex,color,w/tile,h/tile);
 s4Quad([[a,e,z],[a,c,z],[a,c,f],[a,e,f]],tex,color,d/tile,h/tile);
 s4Quad([[b,c,z],[b,e,z],[b,e,f],[b,c,f]],tex,color,d/tile,h/tile);
 s4Quad([[a,c,f],[b,c,f],[b,e,f],[a,e,f]],tex,color,w/tile,d/tile);
 if(solid)S4.solids.push({x0:a,x1:b,y0:c,y1:e});
}
function s4Label(x,y,z,text,w=3,extra={}){S4.labels.push({x,y,z,text,w,...extra});}
function s4Lamp(x,y,color=[140,187,191]){
 s4Box(x,y,0,.12,.12,2.6,7,[33,51,56],true);s4Box(x,y,2.62,.46,.46,.08,7);s4Box(x,y,2.5,.3,.3,.12,-1,color);S4.lamps.push({x,y,z:2.56,color});
}
function s4Fence(ax,ay,bx,by,height=.8){
 const count=Math.ceil(Math.hypot(bx-ax,by-ay)/2.4);
 for(let i=0;i<=count;i++){const x=mix(ax,bx,i/count),y=mix(ay,by,i/count);s4Box(x,y,0,.09,.09,height+.12,7,[37,53,58]);}
 const w=Math.abs(bx-ax)||.065,d=Math.abs(by-ay)||.065;
 for(const z of[.25,height])s4Box((ax+bx)/2,(ay+by)/2,z,w,d,.055,7,[45,63,64]);
 S4.solids.push({x0:Math.min(ax,bx)-.045,x1:Math.max(ax,bx)+.045,y0:Math.min(ay,by)-.045,y1:Math.max(ay,by)+.045});
}
// Move complete authored landmarks without rescaling their approved architecture.
function s4Group(dx,dy,build){
 const starts=[S4.faces.length,S4.solids.length,S4.labels.length,S4.lamps.length];build();
 for(const f of S4.faces.slice(starts[0]))for(const p of f.points){p[0]+=dx;p[1]+=dy;}
 for(const b of S4.solids.slice(starts[1])){b.x0+=dx;b.x1+=dx;b.y0+=dy;b.y1+=dy;}
 for(const a of [S4.labels.slice(starts[2]),S4.lamps.slice(starts[3])])for(const p of a){p.x+=dx;p.y+=dy;}
}
function s4BuildGeometry(){
 s4Group(S4_ORIGIN,0,()=>{
 // Tall wings remain true geometry, visible over low fencing and shelter roofs.
 s4Box(32,55,0,18,8,7.8,5,[73,83,84],true,3.8);
 s4Box(24.5,53,0,4,10,9.2,5,[65,76,79],true,3.8);
 s4Box(41,54,0,5,12,6.7,5,[61,77,81],true,3.8);
 for(const [x,y,w,d,h]of [[32,55,18.4,8.3,7.8],[24.5,53,4.3,10.3,9.2],[41,54,5.3,12.3,6.7]])s4Box(x,y,h,w,d,.24,4,[44,54,56],false,2);
 s4Box(32,50.92,0,4,.2,2.8,4,[71,82,79],true,2);
 s4Quad([[30.6,50.79,.05],[33.4,50.79,.05],[33.4,50.79,2.1],[30.6,50.79,2.1]],-1,[206,221,196],1,1,true);
 for(const x of[30.55,32,33.45])s4Box(x,50.72,0,.065,.08,2.15,-1,[45,68,63]);
 s4Box(32,50.70,2.1,3,.08,.065,-1,[43,61,57]);
 s4Box(32,49.3,2.6,7,3.8,.25,4,[64,77,77],false,2);
 for(const x of[28.75,35.25])s4Box(x,47.65,0,.2,.2,2.6,4,[70,87,85],true);
 s4Quad([[29.4,47.35,2.62],[34.6,47.35,2.62],[34.6,47.35,2.88],[29.4,47.35,2.88]],-1,[14,34,34]);
 s4Label(32,47.28,2.76,'ASHFALL HOSPITAL',4.8,{color:'#d0ddd0',front:[0,-1],h:.24});
 S4.lamps.push({x:32,y:50,z:1.2,color:[205,232,207]});
 });
 s4Group(S4_ORIGIN,0,()=>{
 // One fixed board, three equally spaced lines. No screen-space floating labels.
 s4Box(35.4,38.9,0,.11,.11,2.1,7,[55,77,70],true);
 s4Label(35.4,38.9,1.55,'←  GARDEN GATES\n→  PARKING\n↑  BUS STATION',3.45,{h:1.05,front:[0,1],interact:'READ THE WAYFINDER',read:'← GARDEN GATES   → PARKING LOT\n↑ BUS STATION'});
 for(const [x,y]of [[30,45],[35.6,34],[29.2,24]])s4Lamp(x,y,[155,180,146]);
 });
 s4Group(42,36,()=>{
 // Parking wraps behind the hospital left wing (when facing its entrance).
 const cars=[[43,30,0],[47,30,1],[51,30,2],[55,30,0],[43,35,2],[51,35,1],[55,35,0],[45,44,1],[50,44,0],[55,44,2]];
 const colors=[[48,60,65],[95,57,48],[62,83,73]];
 for(const [x,y,k]of cars){
  if(x!==55||y!==44){s4qParkingCar(x,y,k);continue;}
  const col=colors[k];s4Box(x,y,.14,1.65,2.85,.46,-1,col,true);s4Box(x,y+.12,.6,1.44,1.36,.38,-1,col);
  s4Quad([[x-.63,y-.571,.68],[x+.63,y-.571,.68],[x+.63,y-.571,.94],[x-.63,y-.571,.94]],-1,[16,43,50]);
  s4Quad([[x+.63,y+.811,.66],[x-.63,y+.811,.66],[x-.63,y+.811,.94],[x+.63,y+.811,.94]],-1,[11,34,41]);
  for(const xx of[-.77,.77])for(const yy of[-.88,.88])s4Box(x+xx,y+yy,.05,.19,.38,.3,-1,[13,17,22]);
  for(const xx of[-.52,.52]){s4Box(x+xx,y-1.43,.4,.26,.028,.11,-1,[100,112,110]);s4Box(x+xx,y+1.43,.38,.25,.03,.12,-1,[106,27,33]);}
 }
 for(const x of[41,45,49,53,57])for(const y of[30,35,44])s4Quad([[x-.035,y-1.6,.008],[x+.035,y-1.6,.008],[x+.035,y+1.6,.008],[x-.035,y+1.6,.008]],-1,[108,112,97]);
 s4Lamp(40,28,[108,160,190]);s4Lamp(57,38,[112,162,193]);
 s4Box(43.4,39.7,.0,.11,.11,1.8,7,[40,62,64],true);s4Label(43.4,39.7,1.68,'P  /  PARKING',2,{front:[0,1],h:.4,interact:'READ THE PARKING SIGN',read:'VISITOR PARKING\nThe cars are still here.'});
 });
 // Roadside shelter: the same roof, bench and materials now sit beyond the forest road.
 s4BuildBusShelter(S4_BUS.x,S4_BUS.y);
 s4Group(24,0,()=>{
 // Garden arena is only a quiet composition review now. Pond follows its left edge.
 s4Box(15.3,19.5,0,.65,.8,3.1,4,[80,79,63],true);
 s4Box(22.7,19.5,0,.65,.8,3.1,4,[80,79,63],true);
 s4Box(19,19.5,2.9,8.4,.55,.42,4,[66,69,61]);
 s4Quad([[15.65,19.54,0],[22.35,19.54,0],[22.35,19.54,2.9],[15.65,19.54,2.9]],6,[29,46,38]).cerberusGate=true;
 s4Quad([[22.35,19.46,0],[15.65,19.46,0],[15.65,19.46,2.9],[22.35,19.46,2.9]],6,[29,46,38]).cerberusGate=true;
 S4.solids.push({x0:15.4,x1:22.6,y0:19.42,y1:19.58,kind:'cerberusGate'});
 s4Fence(4.1,19.5,15.3,19.5,1.25);s4Fence(22.7,19.5,26,19.5,1.25);s4Fence(26,6,26,19.5,1.25);
 s4Label(19,19.8,3.17,'H    ’s Garden Gates',7.4,{color:'#c1b58a',front:[0,1],h:.34});
 s4Label(19,19.7,1.4,'',4,{interact:'EXAMINE THE GATES',read:'OLD IRON. FRESH HEAT.\nTHE GUARDIAN HAS NOT LET ANYONE THROUGH.'});
 for(const [x,y]of [[15,21],[23,21]]){s4Box(x,y,0,.28,.28,1.4,4,[80,73,54],true);S4.lamps.push({x,y,z:1.45,color:[192,109,101]});}
 });
 // Forest forms the outer boundary; retain the hospital-side low fence.
 s4Fence(55,60,75.5,60,1);
 // Open outer verge, with a low estate rail and distant woodland instead of a hedge box.
 s4Fence(77,86,122,86,.8);s4Fence(122,61,122,86,.8);
 s4BuildWaterfront();
}
for(const [key,p]of Object.entries(S4_ENTRIES))reviewScenes['s4_'+key]={label:p.label,level:3,chapter:true,at:key,hint:p.hint+' Calm environment review: no ambulance, quests or boss yet.'};
$('leaveHospitalBtn').onclick=s4EnterFromHeart;

