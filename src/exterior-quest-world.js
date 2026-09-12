// Native 3D props extend the existing world renderer; signs stay on physical faces.
// Shared materials and original hospital, forest, lake and creature artwork are retained.
const S4Q_ART={};
const S4Q_WORLD={faces:null,key:''};
function s4qBuildProps(){
 S4Q_WORLD.faces=null;S4Q_WORLD.key='';s4qDressCars();
 // Staff car: a lit open driver's door, a numbered bay and matching ambulance ID.
 s4Box(95.87,79.85,.3,.07,1.28,.55,-1,[61,81,71],true);
 s4Quad([[95.87,79.21,.82],[95.87,80.49,.82],[95.87,80.49,1.12],[95.87,79.21,1.12]],-1,[19,45,47]);
 s4Box(97,80.1,1.02,.53,.23,.07,-1,[131,86,31]);
 s4Label(97,78.54,.57,'04',.58,{h:.17,front:[0,-1],color:'#eedfb0'});
 s4Box(98.1,77.9,0,.075,.075,1.92,7,[42,61,58],true);
 s4Label(98.1,77.9,1.66,'AMBULANCE 04\nON-CALL DRIVER',2.15,{h:.64,front:[0,-1],interact:'READ THE STAFF BAY',read:'AMBULANCE 04 — ON-CALL DRIVER\nSpare keys are hanging from the open driver’s door.'});
 S4.lamps.push({x:96,y:79.4,z:1.05,color:[235,186,100]});
 // Emergency cabinet at the shelter, to the right of the bench so it is reachable.
 s4Box(137.08,5.04,.45,.7,.25,1.02,7,[111,29,33]);
 s4Quad([[136.78,5.178,.51],[137.38,5.178,.51],[137.38,5.178,1.39],[136.78,5.178,1.39]],-1,[17,24,25]);
 for(const x of[136.73,137.43])s4Box(x,5.21,.45,.055,.075,1.02,-1,[145,36,43]);
 s4Label(137.08,5.19,1.62,'FIRE\nEXTINGUISHER',.83,{h:.35,front:[0,1],color:'#fff0d0'});
 s4Box(137.08,5.14,1.86,.86,.19,.075,-1,[191,232,207]);
 S4.lamps.push({x:137.08,y:5.6,z:1.85,color:[177,219,196]});
 // Physical supply cases: E leaves a full case alone and empty cases stay empty.
 for(const p of S4Q_SUPPLIES){
  s4Box(p.x,p.y,.02,.66,.43,.25,7,[79,87,73]);
  s4Label(p.x,p.y-.23,.19,'FIRST AID',.57,{h:.14,front:[0,-1],color:'#e4edc8'});
  s4Label(p.x,p.y+.23,.19,'FIRST AID',.57,{h:.14,front:[0,1],color:'#e4edc8'});
 }
 // A narrow, winding maintenance footpath links the already separated regions.
 // The forest edge and floor share this exact route; no gaps or invisible passage.
 for(const [x,y]of [[102.8,59],[105.2,47],[104.5,37],[107.7,28]]){
  s4Box(x,y,0,.1,.1,.82,7,[39,56,48]);s4Box(x,y,.76,.2,.2,.08,-1,[163,185,129]);
  S4.lamps.push({x,y,z:.8,color:[128,153,112]});
 }
 s4RoadSign(100.2,65.5,'SERVICE WALK →','SERVICE WALK →\nA footpath through the woods to the city road and bus station.',[-1,0],2.6,1.3);
 s4RoadSign(109.8,23.1,'PARKING / SERVICE WALK ↓','PARKING / SERVICE WALK\nFollow the low lamps south through the forest.',[-.65,-.76],3,1.35);
 s4Label(109.8,23.1,1.35,'BUS STATION →',3,{front:[.65,.76],h:.4,interact:'READ THE SERVICE SIGN',read:'BUS STATION →\nFollow the city road to the right.'});
 for(const x of[102.08,105.92])s4Box(x,56.5,0,.12,.15,1.36,7,[63,79,65],true);
 s4Label(104,56.5,1.6,'SERVICE WALK',2.75,{h:.3,front:[0,1]});
 s4Label(104,56.5,1.6,'SERVICE WALK',2.75,{h:.3,front:[0,-1]});
 for(const f of S4.faces)if(f.cx===undefined){const xs=f.points.map(p=>p[0]),ys=f.points.map(p=>p[1]);f.cx=(Math.min(...xs)+Math.max(...xs))/2;f.cy=(Math.min(...ys)+Math.max(...ys))/2;f.radius=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))/2;}
}
function s4qApplyGate(){
 S4.solids=S4.solids.filter(b=>b.kind!=='serviceGate');
 if(S4Q.on&&!S4Q.gate)S4.solids.push({x0:102.08,x1:105.92,y0:56.44,y1:56.56,kind:'serviceGate'});
 for(let y=55;y<=57;y++)for(let x=102;x<=105;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 S4Q_WORLD.faces=null;buildFlow();
}
function s4qMeshBox(faces,x,y,z,w,d,h,color,emissive=false){
 const a=x-w/2,b=x+w/2,n=y-d/2,s=y+d/2,t=z+h;
 for(const points of[
  [[a,n,z],[b,n,z],[b,n,t],[a,n,t]],[[b,s,z],[a,s,z],[a,s,t],[b,s,t]],
  [[a,s,z],[a,n,z],[a,n,t],[a,s,t]],[[b,n,z],[b,s,z],[b,s,t],[b,n,t]],
  [[a,n,t],[b,n,t],[b,s,t],[a,s,t]]])faces.push({points,tex:-1,color,u:1,v:1,emissive,cx:x,cy:y,radius:Math.hypot(w,d)/2});
}
function s4qCanister(faces,x,y,z,scale=1){
 const r=.12*scale,h=.59*scale;
 for(let i=0;i<12;i++){
  const a=i/12*TAU,b=(i+1)/12*TAU,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r,xx2=x+Math.cos(b)*r,yy2=y+Math.sin(b)*r;
  faces.push({points:[[xx,yy,z],[xx2,yy2,z],[xx2,yy2,z+h],[xx,yy,z+h]],tex:-1,color:i%3?[153,35,39]:[196,57,49],surface:S4Q_ART.extinguisher,u:S4Q_ART.extinguisher?1/12:1,u0:S4Q_ART.extinguisher?((i+3)%12)/12:0,v:1});
  faces.push({points:[[xx,yy,z+h],[xx2,yy2,z+h],[x,y,z+h+.075*scale],[x,y,z+h+.075*scale]],tex:-1,color:[111,31,33],u:1,v:1});
 }
 s4qMeshBox(faces,x,y,z+h+.05*scale,.045*scale,.045*scale,.1*scale,[163,166,140]);
 s4qMeshBox(faces,x+.055*scale,y,z+h+.14*scale,.24*scale,.055*scale,.033*scale,[38,44,41]);
 s4qMeshBox(faces,x+.17*scale,y,z+.18*scale,.04*scale,.05*scale,.48*scale,[19,28,28]);
 s4qMeshBox(faces,x+.2*scale,y,z+.1*scale,.07*scale,.08*scale,.14*scale,[33,41,37]);
 // The prepared wrap carries the worn instruction label around the cylinder.
}
function s4qWorldFaces(){
 if(!s4qRunning())return;
 const key=[S4Q.keys,S4Q.ext,S4Q.supplies,S4Q.gate,S4Q.fire].join('|');
 if(!S4Q_WORLD.faces||key!==S4Q_WORLD.key){
  S4Q_WORLD.key=key;const f=S4Q_WORLD.faces=[];
  if(!S4Q.keys){
   const {x,y}=S4Q_KEYS;
   for(let i=0;i<12;i++){
    const a=i/12*TAU,b=(i+1)/12*TAU;
    f.push({points:[[x,y+Math.cos(a)*.083,.97+Math.sin(a)*.083],[x,y+Math.cos(b)*.083,.97+Math.sin(b)*.083],[x,y+Math.cos(b)*.062,.97+Math.sin(b)*.062],[x,y+Math.cos(a)*.062,.97+Math.sin(a)*.062]],tex:-1,color:[218,216,152],u:1,v:1,emissive:true});
   }
   s4qMeshBox(f,x,y-.03,.68,.045,.055,.24,[183,183,150]);
   for(const z of[.69,.735,.78])s4qMeshBox(f,x,y-.065,z,.045,.06,.025,[196,199,163]);
   s4qMeshBox(f,x,y+.1,.74,.045,.14,.19,[168,99,35]);
  }
  if(!S4Q.ext)s4qCanister(f,S4Q_EXT.x,S4Q_EXT.y,.58);
  if(!S4Q.gate){
   for(const z of[.2,.92])s4qMeshBox(f,104,56.5,z,3.8,.085,.065,[87,101,77]);
   for(let x=102.2;x<105.9;x+=.32)s4qMeshBox(f,x,56.5,.2,.038,.065,.78,[53,72,60]);
  }else{
   // The actual gate remains visible, folded alongside the path.
   for(const z of[.2,.92])s4qMeshBox(f,102.08,54.6,z,.085,3.8,.065,[87,101,77]);
  }
  S4Q_SUPPLIES.forEach((p,i)=>{
   const open=!!(S4Q.supplies&(1<<i));
   s4qMeshBox(f,p.x,p.y-(open?.19:0),open?.27:.28,.67,open?.04:.44,open?.38:.04,open?[41,54,44]:[124,147,99]);
   if(!open){s4qMeshBox(f,p.x,p.y,.325,.26,.07,.009,[224,234,181]);s4qMeshBox(f,p.x,p.y,.326,.07,.26,.009,[224,234,181]);}
  });
  if(!S4Q.fire){
   // Chalky extinguisher residue stays at the crash site after the van leaves.
   for(let i=0;i<9;i++)s4qMeshBox(f,57.3+Math.sin(i*4)*.6,43+Math.cos(i*2.7)*.9,.016,.32,.34,.003,[148,153,126]);
  }
 }
 for(const f of S4Q_WORLD.faces)s4DrawFace(f);
 if(S4Q.action?.kind==='extinguish'){
  const f=[],x=player.x+camDX*.65-camDY*.27,y=player.y+camDY*.65+camDX*.27;
  s4qCanister(f,x,y,-.22,.9);for(const face of f)s4DrawFace(face);
 }
}
function s4qAtmosphere(){
 if(!s4qRunning())return;
 if(!S4Q.keys){const p=project(S4Q_KEYS.x,S4Q_KEYS.y,.95);if(p&&s4Visible(p.x,p.y,p.d,.12))drawGlow(p.x,p.y,p.scale*.18,'#fff0a2',.34);}
 if(!S4Q.ext){const p=project(S4Q_EXT.x,S4Q_EXT.y,1.05);if(p&&s4Visible(p.x,p.y,p.d,.2))drawGlow(p.x,p.y,p.scale*.2,'#fff0d0',.15);}
 const spraying=S4Q.action?.kind==='extinguish'&&S4D.t>.75;
 if(!spraying&&S4Q.steam<=0)return;
 // Short, depth-clipped foam pulses arch over the patient box onto the engine.
 const clock=S4Q.clock;
 for(let i=0;i<(settings.reduce?8:18);i++){
  const t=(clock*.85+i/18)%1;
  let x=57.45+Math.sin(i*2.5)*t*.45,y=43+Math.cos(i*3)*t*.75,z=1.2+t*2;
  if(spraying){x=mix(player.x+camDX*.65-camDY*.27,57.4,t);y=mix(player.y+camDY*.65+camDX*.27,43,t);z=.7+Math.sin(t*Math.PI)*2.05+t*.35;}
  const p=project(x,y,z);if(!p)continue;
  const r=Math.max(1,p.scale*(spraying?.025+t*.14:.15+t*.22));
  if(!s4Visible(p.x,p.y,p.d,.12))continue;
  wc.fillStyle='rgba(221,232,201,'+((spraying?.26:.17)*Math.min(1,spraying?1:S4Q.steam)*(.6+.4*t))+')';
  wc.beginPath();wc.arc(p.x,p.y,r,0,TAU);wc.fill();
 }
}

function s4qPrepareAtlas(img){
 const tiles={lower:[2,249,623,266,512,192],glass:[106,98,450,140,384,128],front:[632,358,617,190,384,160],windshield:[655,24,566,155,384,128],extinguisher:[3,630,619,620,256,256],steel:[637,641,604,600,256,256],door:[114,248,216,256,192,256]};
 for(const [name,[x,y,w,h,cw,ch]]of Object.entries(tiles)){
  const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,x*img.width/1254,y*img.height/1254,w*img.width/1254,h*img.height/1254,0,0,cw,ch);S4Q_ART[name]={w:cw,h:ch,data:g.getImageData(0,0,cw,ch).data};
 }
}
function s4qDressCars(){
 const cars=[[97,80]];
 const panel=(points,key)=>{const f=s4Quad(points,-1,[54,75,67]);f.surface=S4Q_ART[key];};
 for(const [x,y]of cars){
  for(const side of[-1,1]){
   const xx=x+side*.827;
   panel([[xx,y-1.425,.14],[xx,y+1.425,.14],[xx,y+1.425,.603],[xx,y-1.425,.603]],'lower');
   const glassX=x+side*.722;
   panel([[glassX,y-.56,.603],[glassX,y+.8,.603],[glassX,y+.8,.98],[glassX,y-.56,.98]],'glass');
  }
  panel([[x-.825,y-1.431,.14],[x+.825,y-1.431,.14],[x+.825,y-1.431,.602],[x-.825,y-1.431,.602]],'front');
  panel([[x+.63,y-.572,.68],[x-.63,y-.572,.68],[x-.63,y-.572,.94],[x+.63,y-.572,.94]],'windshield');
  panel([[x-.825,y-1.425,.602],[x+.825,y-1.425,.602],[x+.825,y+1.425,.602],[x-.825,y+1.425,.602]],'steel');
  panel([[x-.72,y-.56,.982],[x+.72,y-.56,.982],[x+.72,y+.8,.982],[x-.72,y+.8,.982]],'steel');
 }
 // One door stands ajar in the numbered bay, with the actual keys on its outside.
 panel([[95.832,79.21,.3],[95.832,80.49,.3],[95.832,80.49,.82],[95.832,79.21,.82]],'door');
 panel([[95.869,79.21,.82],[95.869,80.49,.82],[95.869,80.49,1.12],[95.869,79.21,1.12]],'glass');
}

function s4qPrepareParking(img){
 const xs=[3,365,727,1090,1446],ys=[3,365,716,1084],names=['redSide','redFront','redRear','redPaint','blueSide','blueFront','blueRear','bluePaint','wheel','sideGlass','windGlass','rearGlass'];
 for(let i=0;i<12;i++){
  const col=i%4,row=Math.floor(i/4),c=document.createElement('canvas');c.width=c.height=256;
  const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,xs[col],ys[row],xs[col+1]-xs[col]-5,ys[row+1]-ys[row]-5,0,0,256,256);
  const data=g.getImageData(0,0,256,256).data;
  // The circular wheel mesh uses the atlas as a cutout material.
  if(i===8)for(let y=0;y<256;y++)for(let x=0;x<256;x++)if((x-128)**2+(y-128)**2>125**2)data[(y*256+x)*4+3]=0;
  S4Q_ART[names[i]]={w:256,h:256,data};
 }
}
function s4qParkingCar(x,y,variant){
 const wagon=variant===1,prefix=variant%2?'blue':'red',roof= wagon?1.12:1.04,rear=wagon?.92:.5;
 // The original footprint is retained, including the encounter cover lanes.
 S4.solids.push({x0:x-.825,x1:x+.825,y0:y-1.425,y1:y+1.425});
 const panel=(p,key,flip=false,cutout=false)=>{const f=s4Quad(p.map(([a,b,c])=>[x+a,y+b,c]),-1,[48,58,60]);f.surface=S4Q_ART[key];f.u=flip?-1:1;f.u0=flip?1:0;f.cutout=cutout;};
 panel([[-.825,-1.425,.17],[.825,-1.425,.17],[.825,-1.425,.58],[-.825,-1.425,.58]],prefix+'Front');
 panel([[.825,1.425,.17],[-.825,1.425,.17],[-.825,1.425,.59],[.825,1.425,.59]],prefix+'Rear');
 panel([[-.825,-1.425,.58],[.825,-1.425,.58],[.825,-.64,.69],[-.825,-.64,.69]],prefix+'Paint');
 panel([[-.825,-.64,.69],[.825,-.64,.69],[.68,-.22,roof],[-.68,-.22,roof]],'windGlass');
 panel([[-.68,-.22,roof],[.68,-.22,roof],[.68,rear,roof],[-.68,rear,roof]],prefix+'Paint');
 panel([[-.68,rear,roof],[.68,rear,roof],[.825,1.25,.65],[-.825,1.25,.65]],'rearGlass');
 panel([[-.825,1.25,.65],[.825,1.25,.65],[.825,1.425,.59],[-.825,1.425,.59]],prefix+'Paint');
 for(const s of [-1,1]){
  panel([[s*.825,-1.425,.17],[s*.825,1.425,.17],[s*.825,1.425,.66],[s*.825,-1.425,.66]],prefix+'Side',s>0);
  panel([[s*.825,-.64,.66],[s*.825,1.25,.66],[s*.68,rear,roof],[s*.68,-.22,roof]],'sideGlass',s>0);
  for(const yy of [-.91,.96]){
   const xx=s*.846,r=.27,z=.29;
   panel([[xx,yy-r,z-r],[xx,yy+r,z-r],[xx,yy+r,z+r],[xx,yy-r,z+r]],'wheel',s<0,true);
   for(let n=0;n<8;n++){
    const a=n*TAU/8,b=(n+1)*TAU/8;
    s4Quad([[x+xx,y+yy+Math.cos(a)*r,z+Math.sin(a)*r],[x+xx-s*.16,y+yy+Math.cos(a)*r,z+Math.sin(a)*r],[x+xx-s*.16,y+yy+Math.cos(b)*r,z+Math.sin(b)*r],[x+xx,y+yy+Math.cos(b)*r,z+Math.sin(b)*r]],-1,[17,20,22]);
   }
  }
 }
}

