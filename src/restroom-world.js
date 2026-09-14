// The Lower Restrooms: an authored 84-room chapter, with six physical strata.
// The ledger counts functional rooms and whole courts; stairs, decks and vestibules
// are separate surfaces and never inflate that count. World units are metres.
const RW={version:'lower-restrooms-84-v1',surfaces:[],rooms:[],byId:Object.create(null),faces:[],solids:[],lights:[],signs:[],portals:[],sectors:Object.create(null),connections:[],folds:[],doors:[],waterRegions:[],emitters:[],mirrors:[],owner:null,ready:false,index:null,solidIndex:null};
const RS_B1=-3.4,RS_B2=-6.8,RS_B3=-10.2,RS_B4=-13.6,RS_B5=-17,RS_B6=-20.4,RS_EYE=1.55;
const RS_DISTRICTS={public:{name:'Lower public wing',wall:13,floor:14,ceiling:21,ambient:.20},galleries:{name:'Wash galleries',wall:15,floor:16,ceiling:2,ambient:.24},cubicles:{name:'Cubicle warrens',wall:17,floor:1,ceiling:2,ambient:.14},reservoirs:{name:'Arch reservoirs',wall:18,floor:1,ceiling:18,ambient:.10},courts:{name:'Vertical courts',wall:19,floor:16,ceiling:19,ambient:.18},undercroft:{name:'Service undercroft',wall:20,floor:3,ceiling:20,ambient:.13}};
function rsPolyHas(poly,x,y){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function rsRect(x1,y1,x2,y2){return [[x1,y1],[x2,y1],[x2,y2],[x1,y2]];}
function rsBounds(poly){return [Math.min(...poly.map(p=>p[0])),Math.min(...poly.map(p=>p[1])),Math.max(...poly.map(p=>p[0])),Math.max(...poly.map(p=>p[1]))];}
function rsGridPut(grid,b,value){for(let y=Math.floor(b[1]/12);y<=Math.floor(b[3]/12);y++)for(let x=Math.floor(b[0]/12);x<=Math.floor(b[2]/12);x++){const key=x+','+y;(grid[key]||(grid[key]=[])).push(value);}}
function rsGridQuery(grid,b){const out=new Set();if(!grid)return [];for(let y=Math.floor(b[1]/12);y<=Math.floor(b[3]/12);y++)for(let x=Math.floor(b[0]/12);x<=Math.floor(b[2]/12);x++)for(const s of grid[x+','+y]||[])out.add(s);return [...out];}
function rsSurface(id,poly,z,h=2.65,extra={}){if(RW.byId[id])throw Error('Duplicate restroom surface '+id);const s={id,poly,z,h,ceil:z+h,room:false,water:0,ports:[],neighbors:[],...extra};s.bounds=rsBounds(poly);s.floor=s.floor||Math.max(1,Math.round(-z/3.4));const pal=RS_DISTRICTS[s.district||'public'];s.wallMat=s.wallMat??pal.wall;s.floorMat=s.floorMat??pal.floor;s.ceilingMat=s.ceilingMat??pal.ceiling;s.ambientLight=s.ambientLight??pal.ambient;s.materialSet=s.district||'public';RW.surfaces.push(s);RW.byId[id]=s;RW.sectors[id]={id,faceIndices:[],solidIndices:[],lightIndices:[],portals:[],neighbors:[]};if(s.room)RW.rooms.push(s);return s;}
function rsFloor(s,x,y){if(!s)return -999;if(!s.slope)return s.z;const q=s.slope,dx=q.x1-q.x0,dy=q.y1-q.y0;return s.z+q.dz*clamp(((x-q.x0)*dx+(y-q.y0)*dy)/(dx*dx+dy*dy),0,1);}
function rsCeil(s,x,y){return s.slope?rsFloor(s,x,y)+s.h:s.ceil;}
function rsAt(x,y){const candidates=RW.index?RW.index[Math.floor(x/12)+','+Math.floor(y/12)]||[]:RW.surfaces;return candidates.filter(s=>x>=s.bounds[0]&&x<=s.bounds[2]&&y>=s.bounds[1]&&y<=s.bounds[3]&&rsPolyHas(s.poly,x,y));}
function rsGround(x,y,z){let best=null,height=-Infinity;for(const s of rsAt(x,y)){const f=rsFloor(s,x,y);if(Math.abs(f-z)<.36&&f>height+.0001){best=s;height=f;}}return best;}
function rsSolidAt(x,y,z,r=.19){const candidates=RW.solidIndex?rsGridQuery(RW.solidIndex,[x-r,y-r,x+r,y+r]):RW.solids;return candidates.some(b=>!b.disabled&&z+RS_EYE>b.z+.04&&z+.08<b.z+b.h&&x+r>b.x1&&x-r<b.x2&&y+r>b.y1&&y-r<b.y2);}
function rsCanStand(x,y,z,r=.19){if(typeof RS!=='undefined'&&RS.active?.committed&&x+r>4&&x-r<7&&y-r<14&&y>-12&&z>RS_B1-.2)return false;const s=rsGround(x,y,z);if(!s||rsCeil(s,x,y)-rsFloor(s,x,y)<RS_EYE+.12||rsSolidAt(x,y,rsFloor(s,x,y),r))return false;return [[-r,-r],[r,-r],[-r,r],[r,r]].every(([dx,dy])=>rsGround(x+dx,y+dy,rsFloor(s,x,y)));}
function rsWaterAt(x,y,z){const s=rsGround(x,y,z);if(!s)return null;for(const id of s.waterIds||[]){const w=RW.waterRegions[id-1];if(w&&w.z>z+.015&&rsPolyHas(w.poly,x,y))return {...w,depth:Math.max(0,w.z-z)};}return null;}
function rsFace(v,mat=0,extra={}){const f={v,mat,owner:RW.owner,...extra};const index=RW.faces.push(f)-1;if(RW.sectors[f.owner])RW.sectors[f.owner].faceIndices.push(index);return f;}
function rsQuad(a,b,c,d,mat=0,extra={}){rsFace([a,b,c],mat,extra);rsFace([a,c,d],mat,extra);}
function rsSolid(x1,y1,x2,y2,z,h,extra={}){const b={x1,y1,x2,y2,z,h,owner:RW.owner,...extra};const id=RW.solids.push(b)-1;if(RW.sectors[b.owner])RW.sectors[b.owner].solidIndices.push(id);return id;}
function rsBox(x,y,z,w,d,h,mat=0,solid=false,reflect=false){const a=x-w/2,b=x+w/2,c=y-d/2,e=y+d/2,f=z+h,extra={reflect};rsQuad([a,c,z],[b,c,z],[b,c,f],[a,c,f],mat,extra);rsQuad([b,e,z],[a,e,z],[a,e,f],[b,e,f],mat,extra);rsQuad([a,e,z],[a,c,z],[a,c,f],[a,e,f],mat,extra);rsQuad([b,c,z],[b,e,z],[b,e,f],[b,c,f],mat,extra);rsQuad([a,c,f],[b,c,f],[b,e,f],[a,e,f],mat,extra);if(solid)rsSolid(a,c,b,e,z,h);}
function rsTriangulate(poly){const ids=poly.map((_,i)=>i),out=[],cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);let guard=0;while(ids.length>3&&guard++<1000){let found=false;for(let k=0;k<ids.length;k++){const ia=ids[(k+ids.length-1)%ids.length],ib=ids[k],ic=ids[(k+1)%ids.length],a=poly[ia],b=poly[ib],c=poly[ic];if(cross(a,b,c)<=1e-8)continue;if(ids.some(i=>i!==ia&&i!==ib&&i!==ic&&cross(a,b,poly[i])>=-1e-8&&cross(b,c,poly[i])>=-1e-8&&cross(c,a,poly[i])>=-1e-8))continue;out.push([a,b,c]);ids.splice(k,1);found=true;break;}if(!found)throw Error('Invalid restroom room polygon');}if(ids.length===3)out.push(ids.map(i=>poly[i]));return out;}
function rsCross(a,b){return a[0]*b[1]-a[1]*b[0];}
function rsEdgeCuts(a,b){const d=[b[0]-a[0],b[1]-a[1]],len=d[0]*d[0]+d[1]*d[1],cuts=[0,1],bounds=[Math.min(a[0],b[0])-.03,Math.min(a[1],b[1])-.03,Math.max(a[0],b[0])+.03,Math.max(a[1],b[1])+.03];for(const s of rsGridQuery(RW.index,bounds))for(let i=0;i<s.poly.length;i++){const p=s.poly[i],q=s.poly[(i+1)%s.poly.length],e=[q[0]-p[0],q[1]-p[1]],v=[p[0]-a[0],p[1]-a[1]],den=rsCross(d,e);if(Math.abs(den)>.00001){const t=rsCross(v,e)/den,u=rsCross(v,d)/den;if(t>0&&t<1&&u>=0&&u<=1)cuts.push(t);}else if(Math.abs(rsCross(v,d))<.00001)for(const r of [p,q]){const t=((r[0]-a[0])*d[0]+(r[1]-a[1])*d[1])/len;if(t>0&&t<1)cuts.push(t);}}return [...new Set(cuts.map(t=>Math.round(t*1e7)/1e7))].sort((a,b)=>a-b);}
function rsWallStrip(a,b,z1,z2,mat=0,extra={}){if(z2-z1<.005)return;const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/5)),nz=Math.max(1,Math.ceil((z2-z1)/2.5));for(let i=0;i<n;i++)for(let j=0;j<nz;j++){const ax=mix(a[0],b[0],i/n),ay=mix(a[1],b[1],i/n),bx=mix(a[0],b[0],(i+1)/n),by=mix(a[1],b[1],(i+1)/n),lo=mix(z1,z2,j/nz),hi=mix(z1,z2,(j+1)/nz);rsQuad([ax,ay,lo],[bx,by,lo],[bx,by,hi],[ax,ay,hi],mat,extra);}}
function rsAddPortal(a,b,v,extra={}){const p={a,b,v,...extra};RW.portals.push(p);for(const [from,to]of[[a,b],[b,a]]){const sec=RW.sectors[from];if(!sec)continue;sec.portals.push(p);if(!sec.neighbors.includes(to))sec.neighbors.push(to);const s=RW.byId[from];if(s&&!s.neighbors.includes(to))s.neighbors.push(to);}}
function rsBuildShell(){for(const s of RW.surfaces){RW.owner=s.id;for(const tri of rsTriangulate(s.poly)){rsFace(tri.map(([x,y])=>[x,y,rsFloor(s,x,y)]),s.floorMat);if(!s.noCeil)rsFace(tri.map(([x,y])=>[x,y,rsCeil(s,x,y)]),s.ceilingMat);}for(const id of s.waterIds||[]){const w=RW.waterRegions[id-1];for(const tri of rsTriangulate(w.poly))rsFace(tri.map(([x,y])=>[x,y,w.z]),6,{water:w.id,waterRegion:w.id});}
 if(s.slope){const q=s.slope,dx=q.x1-q.x0,dy=q.y1-q.y0,steps=Math.round(Math.abs(q.dz)/.17),width=s.stairWidth||2.4,nx=-dy/Math.hypot(dx,dy)*width/2,ny=dx/Math.hypot(dx,dy)*width/2;for(let i=0;i<steps;i++){const t=i/steps,u=(i+1)/steps,ax=q.x0+dx*t,ay=q.y0+dy*t,bx=q.x0+dx*u,by=q.y0+dy*u,za=s.z+q.dz*t,zb=s.z+q.dz*u,top=Math.max(za,zb);rsQuad([ax-nx,ay-ny,top+.006],[ax+nx,ay+ny,top+.006],[bx+nx,by+ny,top+.006],[bx-nx,by-ny,top+.006],s.floorMat);rsQuad([bx-nx,by-ny,zb],[bx+nx,by+ny,zb],[bx+nx,by+ny,za],[bx-nx,by-ny,za],4);}}
 for(let i=0;i<s.poly.length;i++){const a=s.poly[i],b=s.poly[(i+1)%s.poly.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),cuts=rsEdgeCuts(a,b);for(let k=0;k<cuts.length-1;k++){const t0=cuts[k],t1=cuts[k+1],t=(t0+t1)/2,x=a[0]+dx*t,y=a[1]+dy*t,aa=[a[0]+dx*t0,a[1]+dy*t0],bb=[a[0]+dx*t1,a[1]+dy*t1],near=rsAt(x+dy/len*.009,y-dx/len*.009).filter(n=>n!==s);for(const n of near){const lo=Math.max(rsFloor(s,x,y),rsFloor(n,x,y)),hi=Math.min(rsCeil(s,x,y),rsCeil(n,x,y));if(hi>lo+.1)rsAddPortal(s.id,n.id,[[aa[0],aa[1],lo],[bb[0],bb[1],lo],[bb[0],bb[1],hi],[aa[0],aa[1],hi]]);}let spans=[[rsFloor(s,x,y),rsCeil(s,x,y)]];for(const n of near){const lo=rsFloor(n,x,y),hi=rsCeil(n,x,y);spans=spans.flatMap(([l,h])=>hi<=l||lo>=h?[[l,h]]:[[l,Math.max(l,lo)],[Math.min(h,hi),h]].filter(([a,b])=>b-a>.005));}if(s.noWalls)continue;if(s.slope&&!near.length)rsQuad([aa[0],aa[1],rsFloor(s,...aa)],[bb[0],bb[1],rsFloor(s,...bb)],[bb[0],bb[1],rsCeil(s,...bb)],[aa[0],aa[1],rsCeil(s,...aa)],s.wallMat);else for(const[lo,hi]of spans){rsWallStrip(aa,bb,lo,hi,s.wallMat);if(lo<=s.z+.03&&hi>s.z+.22)rsWallStrip(aa,bb,s.z+.025,Math.min(s.z+.13,hi),4);if(s.water&&hi>s.z+s.water+.07)rsWallStrip([aa[0]-dy/len*.003,aa[1]+dx/len*.003],[bb[0]-dy/len*.003,bb[1]+dx/len*.003],s.z+s.water-.015,s.z+s.water+.065,23);}}}}
 RW.owner=null;}
function rsLamp(x,y,z,length=1.3,warm=false,power=1.1){rsBox(x,y,z,.20,length,.07,4,false,true);rsBox(x,y,z-.025,.14,length-.1,.022,warm?10:5,false,true);const l={owner:RW.owner,x,y,z:z-.17,power,warm,color:warm?[1,.83,.58]:[.71,.87,1]};const i=RW.lights.push(l)-1;RW.sectors[RW.owner]?.lightIndices.push(i);}
function rsBowl(x,y,z,rx,ry,mat=7){const n=8;for(let i=0;i<n;i++){const a=i*TAU/n,b=(i+1)*TAU/n,p=t=>[x+Math.cos(t)*rx,y+Math.sin(t)*ry,z],q=t=>[x+Math.cos(t)*rx*.75,y+Math.sin(t)*ry*.72,z-.07],r=t=>[x+Math.cos(t)*rx*.18,y+Math.sin(t)*ry*.17,z-.16];rsQuad(p(a),p(b),q(b),q(a),mat);rsQuad(q(a),q(b),r(b),r(a),8);rsQuad([x+Math.cos(a)*rx*.62,y+Math.sin(a)*ry*.58,z-.20],[x+Math.cos(b)*rx*.62,y+Math.sin(b)*ry*.58,z-.20],p(b),p(a),7);}rsBox(x,y,z-.16,.045,.045,.004,4);}
// Fixtures can be rotated in right-angle increments without rotating collision boxes.
function rsFixture(x,y,a,build){const faceStart=RW.faces.length,solidStart=RW.solids.length,mirrorStart=RW.mirrors.length;build();const c=Math.cos(a),s=Math.sin(a),memo=new Map(),tr=p=>{let v=memo.get(p);if(!v){v=[x+p[0]*c-p[1]*s,y+p[0]*s+p[1]*c,p[2]];memo.set(p,v);}return v;};for(let i=faceStart;i<RW.faces.length;i++)RW.faces[i].v=RW.faces[i].v.map(tr);for(let i=solidStart;i<RW.solids.length;i++){const b=RW.solids[i],v=[[b.x1,b.y1],[b.x2,b.y1],[b.x2,b.y2],[b.x1,b.y2]].map(p=>tr([...p,0]));[b.x1,b.y1,b.x2,b.y2]=rsBounds(v);}for(let i=mirrorStart;i<RW.mirrors.length;i++){const m=RW.mirrors[i];m.v=m.v.map(tr);m.center=tr(m.center);const nx=m.normal[0],ny=m.normal[1];m.normal=[nx*c-ny*s,nx*s+ny*c,0];}}
function rsSink(x,y,z,broken=false,a=0,focal=false){const room=RW.byId[RW.owner];if(room){room.fixtureCounts=room.fixtureCounts||{};room.fixtureCounts.sinks=(room.fixtureCounts.sinks||0)+1;}rsFixture(x,y,a,()=>{rsBowl(0,.02,z+.82,.34,.25);rsBox(0,-.01,z+.34,.055,.055,.36,4);rsBox(0,-.15,z+.82,.045,.045,.15,4);rsBox(0,-.1,z+.96,.045,.18,.035,4);rsBox(0,-.29,z+1.07,.76,.045,.94,4);rsBox(0,-.263,z+1.10,.70,.012,.88,9);if(focal){const id='mirror-'+RW.owner+'-'+RW.mirrors.length,v=[[-.35,-.253,z+1.10],[.35,-.253,z+1.10],[.35,-.253,z+1.98],[-.35,-.253,z+1.98]];RW.mirrors.push({id,owner:RW.owner,v,center:[0,-.253,z+1.54],normal:[0,1,0],width:.7,height:.88});}rsBox(.50,-.17,z+1.05,.15,.13,.28,7);if(broken){rsBox(-.16,.1,z+.813,.13,.1,.015,3);rsBox(-.12,.03,z+.37,.07,.06,.41,22);}rsSolid(-.36,-.30,.36,.30,z,.86);});}
function rsToilet(x,y,z,a=0){const room=RW.byId[RW.owner];if(room){room.fixtureCounts=room.fixtureCounts||{};room.fixtureCounts.toilets=(room.fixtureCounts.toilets||0)+1;}rsFixture(x,y,a,()=>{rsBox(0,-.22,z+.12,.40,.20,.63,7);rsBox(0,0,z,.22,.26,.33,7);rsBowl(0,.12,z+.43,.26,.34);rsSolid(-.28,-.34,.28,.48,z,.77);rsBox(.33,-.20,z+.65,.13,.12,.09,4);});}
function rsUrinal(x,y,z,a=0){const room=RW.byId[RW.owner];if(room){room.fixtureCounts=room.fixtureCounts||{};room.fixtureCounts.urinals=(room.fixtureCounts.urinals||0)+1;}rsFixture(x,y,a,()=>{rsBox(0,-.11,z+.48,.42,.26,.69,7);rsBowl(0,.03,z+.67,.22,.20);rsBox(0,-.12,z+1.14,.04,.05,.24,4);rsSolid(-.24,-.24,.24,.25,z,.96);});}
function rsSign(x,y,z,text,a=0){RW.signs.push({owner:RW.owner,x,y,z,text,a});}
function rsArch(x,y,z,width=8,height=5.6){const side=.48,spring=height-width/2*.58;for(const sign of[-1,1])rsBox(x+sign*(width/2+side/2),y,z,side,.68,spring,18,true,true);for(let i=0;i<10;i++){const a=i*Math.PI/10,b=(i+1)*Math.PI/10,pt=(t,r)=>[x+Math.cos(t)*r,y-.34,z+spring+Math.sin(t)*r*.58];rsQuad(pt(a,width/2),pt(b,width/2),pt(b,width/2+side),pt(a,width/2+side),18,{reflect:true});rsQuad(pt(a,width/2).map((v,i)=>i===1?v+.68:v),pt(b,width/2).map((v,i)=>i===1?v+.68:v),pt(b,width/2),pt(a,width/2),18,{reflect:true});}}
function rsAddWater(s,depth=.12,poly=null,tint=null){const id=RW.waterRegions.length+1,w={id,owner:s.id,poly:poly||s.poly,z:s.z+depth,depth,tint:tint||(s.district==='galleries'?[.45,.64,.56]:s.district==='reservoirs'?[.08,.29,.25]:[.25,.40,.35])};RW.waterRegions.push(w);s.waterIds=s.waterIds||[];s.waterIds.push(id);s.waterRegionId=s.waterRegionId||id;s.water=Math.max(s.water||0,depth);return w;}
function rsEmitter(s,kind,x,y,z,gain=.35,interval=8){const e={id:s.id+'-'+kind+'-'+RW.emitters.length,kind,x,y,z,room:s.id,owner:s.id,gain,interval};RW.emitters.push(e);(s.emitters||(s.emitters=[])).push(e);return e;}
function rsDoorCanOpen(d,x,y,z){if(d.open||!d.shortcut||!d.deepSide)return true;return (x-d.x)*(d.deepSide.x-d.x)+(y-d.y)*(d.deepSide.y-d.y)>0;}
function rsDoorSet(d,open){if(typeof d==='string')d=RW.doors.find(v=>v.id===d);if(!d)return false;d.open=!!open;for(const i of d.solidIndices)RW.solids[i].disabled=d.open;for(const i of d.faceIndices){const f=RW.faces[i];f.v=(d.open?f.openV:f.closedV).map(p=>p.slice());if(f.v[0])f.center=f.v[0].map((_,k)=>(f.v[0][k]+f.v[1][k]+f.v[2][k])/3);if(typeof rsBakeOneFace==='function')rsBakeOneFace(f);}return true;}
function rsDoor(id,owner,x,y,z,a=0,width=1.05,extra={}){RW.owner=owner;const d={id,owner,x,y,z,a,width,h:2.10,open:false,faceIndices:[],solidIndices:[],...extra},c=Math.cos(a),s=Math.sin(a),hx=x-c*width/2,hy=y-s*width/2,panel=(angle)=>{const dx=Math.cos(a+angle)*width,dy=Math.sin(a+angle)*width,nx=-Math.sin(a+angle)*.055,ny=Math.cos(a+angle)*.055;return [[hx,hy,z],[hx+dx,hy+dy,z],[hx+dx,hy+dy,z+d.h],[hx,hy,z+d.h]].map(p=>[p[0]+nx,p[1]+ny,p[2]]);},closed=panel(0),opened=panel(Math.PI*.49);for(const tri of[[0,1,2],[0,2,3]]){const f=rsFace(tri.map(i=>closed[i]),11,{doorId:id});f.closedV=f.v.map(p=>p.slice());f.openV=tri.map(i=>opened[i]);d.faceIndices.push(RW.faces.length-1);}const b=rsBounds(closed);d.solidIndices.push(rsSolid(b[0]-.05,b[1]-.05,b[2]+.05,b[3]+.05,z,d.h,{doorId:id}));RW.doors.push(d);rsDoorSet(d,d.open);return d;}
// Every ledger row describes a distinct usable room or organized multi-fixture suite.
const RS_ROOM_LEDGER=[
 ['P01','public',1,[0,14,12,26],'First public washroom','suite','rect','The chipped basin beside the entrance',0],
 ['P02','public',1,[28,14,48,36],'Opposing wash suite','suite','rect','Turquoise doors opposite cream basins',.035],
 ['P03','public',1,[56,14,80,36],'Northern wash hall','wash','L','Twin drain channels beneath a low beam',0],
 ['P04','public',1,[0,44,22,66],'Changing and shower suite','shower','rect','Frosted shower screens and dry benches',.025],
 ['P05','public',1,[28,44,48,66],'Stair-core washroom','suite','U','A square service core with plumbing on three sides',0],
 ['P06','public',1,[56,44,65,55],'Staff washroom east','staff','wedge','A solitary yellow hand dryer',0],
 ['P07','public',1,[0,74,9,86],'Western staff washroom','staff','L','Old green tile exposed beneath a new wall',0],
 ['P08','public',1,[28,74,48,96],'Shower changing hall','shower','rect','A long bank of unused shower heads',.04],
 ['P09','public',1,[56,74,80,96],'Day wash suite','suite','rect','A lit clerestory with no outside view',0],
 ['P10','public',1,[0,104,22,128],'Rear public washroom','suite','octagon','Eight sides, four ordinary doors',.04],
 ['P11','public',1,[28,104,48,128],'South wash hall','wash','L','A split row of paired basins',0],
 ['P12','public',1,[56,104,80,128],'Last public cubicle suite','suite','rect','The final stall beside an exposed thin service wall',.05],
 ['G01','galleries',1,[100,16,170,24],'Seventy-metre wash gallery','gallery','rect','Sink rhythm disappearing into warm distant light',.04],
 ['G02','galleries',1,[178,14,191,25],'Paired washroom north','paired','rect','Two basins sharing one narrow mirror',0],
 ['G03','galleries',1,[202,14,228,40],'North light-well room','lightwell','U','An enclosed square of borrowed light',.10],
 ['G04','galleries',1,[100,52,126,76],'Bent wash gallery','gallery','L','The same blue tile band around a blind turn',0],
 ['G05','galleries',1,[142,52,182,78],'Bright submerged chamber','lightwell','rect','Rectangular shafts cross a visible tiled floor',.18],
 ['G06','galleries',1,[202,56,228,80],'Shared wash chamber','wash','octagon','Three routes around a dry central plinth',.08],
 ['G07','galleries',2,[100,16,170,24],'Lower long wash gallery','gallery','rect','A missing fifth mirror along an excessive row',.12],
 ['G08','galleries',2,[178,14,194,36],'Curved core gallery','gallery','L','A tight service core with an impossible circumference',0],
 ['G09','galleries',2,[202,14,216,29],'Paired washroom behind core','paired','wedge','A rusted pipe returns on the wrong wall',.035],
 ['G10','galleries',2,[100,52,126,76],'Blue band wash gallery','gallery','L','Water ends precisely at the old floor repair',.08],
 ['G11','galleries',2,[142,52,182,78],'Long-window light chamber','lightwell','rect','Tall blank windows over pale warm water',.18],
 ['G12','galleries',2,[202,56,228,80],'Four-door wash chamber','wash','octagon','A suspended square of light over silent water',.10],
 ['G13','galleries',3,[100,16,170,24],'Hall behind the last stall','gallery','rect','The same turquoise partition now very far behind',.06],
 ['G14','galleries',3,[178,14,191,26],'Paired washroom deep','paired','rect','Mirrors and basins installed at two renovation dates',0],
 ['G15','galleries',3,[202,14,228,40],'Return wash gallery','gallery','L','A chipped cream tile at the returning stair door',0],
 ['G16','galleries',3,[100,52,126,76],'Angular wash gallery','gallery','wedge','A diagonal sink wall converges toward a quiet opening',.10],
 ['G17','galleries',3,[142,52,182,78],'Deep paired wash suite','paired','U','Back-to-back wash walls around one service void',.06],
 ['G18','galleries',3,[202,56,228,80],'Lower shared wash chamber','wash','rect','A distant drain sounds below the onward threshold',.12],
 ['C01','cubicles',2,[0,176,22,200],'Turquoise arrival suite','stall','rect','Tall close partitions and a clear central aisle',.035],
 ['C02','cubicles',2,[28,176,50,200],'Offset urinal suite','urinal','L','Alternating urinal screens hide the far doorway',0],
 ['C03','cubicles',2,[58,176,66,188],'Narrow private suite','stall','wedge','Tight worn stalls under an exposed pipe',.035],
 ['C04','cubicles',2,[0,210,22,238],'Shower hall west','shower','rect','Shower stalls with unusually high transom glass',.08],
 ['C05','cubicles',2,[28,210,50,238],'Repeated cubicle suite','stall','rect','One cream door among blue-green doors',.04],
 ['C06','cubicles',2,[58,210,82,238],'East urinal washroom','urinal','L','A repaired sink wall with a new floor drain',0],
 ['C07','cubicles',3,[0,176,12,190],'Lower narrow cubicle suite','stall','rect','A single lamp lights the end of a partition aisle',.045],
 ['C08','cubicles',3,[28,176,38,188],'Wedge washroom','wedge','wedge','Three plainly visible exits around an angled wall',0],
 ['C09','cubicles',3,[58,176,82,200],'Low-beam cubicle suite','stall','rect','A low service soffit between taller stall rows',.04],
 ['C10','cubicles',3,[0,210,22,238],'Lower urinal washroom','urinal','L','White ceramic against dark renewed tiles',0],
 ['C11','cubicles',3,[28,210,50,238],'Deep repeated cubicle suite','stall','rect','The same cream door, with different plumbing behind it',.055],
 ['C12','cubicles',3,[58,210,82,238],'Service-side cubicle suite','stall','U','The damaged basin seen from its supposed service side',0],
 ['C13','cubicles',4,[0,176,22,200],'Compressed shower hall','shower','L','Narrow dry edges beside quiet shallow water',.08],
 ['C14','cubicles',4,[28,176,50,200],'Last urinal suite','urinal','rect','An oversized service duct over normal fixtures',0],
 ['C15','cubicles',4,[0,210,8,222],'Quiet triangular washroom','wedge','wedge','No ambient sound behind the cracked turquoise wall',0],
 ['C16','cubicles',4,[28,210,50,238],'Reservoir approach suite','stall','rect','A tall arched shadow beyond low ordinary partitions',.08],
 ['R01','reservoirs',3,[120,176,158,248],'Long three-aisle arcade','reservoir-long','rect','Five deep cross-vaults and a far lit washroom',.20],
 ['R02','reservoirs',3,[164,178,182,198],'Arcade perimeter washroom','paired','rect','A small human room overlooking a vast aisle',0],
 ['R03','reservoirs',3,[164,209,182,232],'Arcade shower suite','shower','L','White shower heads on green vault-side tile',.08],
 ['R04','reservoirs',3,[120,258,151,277],'North drainage chamber','drain','octagon','Two open drain mouths and dry service ledges',.14],
 ['R05','reservoirs',4,[200,176,254,224],'Offset-column basin','reservoir-offset','rect','A broad grid with one column displaced from its row',.28],
 ['R06','reservoirs',4,[260,178,270,190],'Eastern perimeter washroom','paired','wedge','A single warm mirror beyond the flooded hall',0],
 ['R07','reservoirs',4,[260,209,279,232],'Broad basin shower suite','shower','rect','Dark green showers beside a pale raised threshold',.08],
 ['R08','reservoirs',4,[205,242,238,263],'Broad basin drain hall','drain','L','A double channel disappearing through a thick wall',.16],
 ['R09','reservoirs',5,[120,303,180,358],'Horseshoe reservoir','reservoir-horseshoe','U','Two long flooded arms around a silent dry core',.22],
 ['R10','reservoirs',5,[120,278,137,291],'Horseshoe perimeter washroom','paired','rect','A familiar chipped column glimpsed through a slot',0],
 ['R11','reservoirs',5,[154,278,179,297],'Horseshoe shower suite','shower','wedge','Sparse taps behind a thick corner pier',.06],
 ['R12','reservoirs',5,[120,370,151,393],'Horseshoe drainage room','drain','octagon','A wide silent sump with a raised maintenance island',.20],
 ['R13','reservoirs',5,[213,302,269,362],'Diagonal gallery hall','reservoir-diagonal','rect','A dry diagonal crossing through shadowed columns',.28],
 ['R14','reservoirs',5,[215,278,233,291],'Diagonal hall washroom','paired','L','A narrow bright aperture aimed across the basin',0],
 ['R15','reservoirs',5,[248,278,271,296],'Diagonal hall shower suite','shower','rect','A row of pale shower screens under green concrete',.08],
 ['R16','reservoirs',5,[219,374,253,393],'Southern drainage chamber','drain','wedge','A large angled drain intersection',.16],
 ['V01','courts',5,[296,176,322,214],'Needle court','court-needle','rect','A narrow vertical slot with three reachable upper floors',.16],
 ['V02','courts',6,[354,176,407,226],'Asymmetric flood court','court-broad','rect','Stacked washroom windows around an off-centre flooded floor',.20],
 ['V03','courts',6,[310,303,356,351],'Terraced return court','court-terraced','rect','A cracked column and hanging pipe anchor four visible heights',.20],
 ['V04','courts',5,[329,178,341,191],'Needle lower washroom','paired','rect','The first reachable window above the narrow court',0],
 ['V05','courts',4,[329,202,347,224],'Needle middle landing hall','wash','L','A dry balcony looking back through the entrance slot',0],
 ['V06','courts',2,[296,224,320,244],'Needle upper washroom','paired','rect','The high lamp first seen from the lowest water',.035],
 ['V07','courts',6,[416,176,430,191],'Broad court washroom','paired','rect','Small fixtures frame a large pale court',0],
 ['V08','courts',4,[416,205,439,229],'Broad court landing hall','wash','wedge','An angled doorway several floors over visible water',0],
 ['V09','courts',3,[359,239,389,257],'Broad court upper washroom','paired','U','A reachable bright room above the stacked dark windows',.035],
 ['V10','courts',6,[362,304,386,327],'Terrace lower washroom','paired','L','The cracked column seen at its ordinary base',0],
 ['V11','courts',4,[362,337,386,360],'Terrace middle landing hall','wash','rect','A hanging pipe passes below the level of this door',0],
 ['V12','courts',3,[310,363,340,385],'Terrace high washroom','paired','rect','The impossible level passage has reached the far upper lamp',0],
 ['U01','undercroft',4,[414,303,440,328],'Upper pipe hall','pipe','L','The backs of familiar wash walls and exposed traps',0],
 ['U02','undercroft',4,[448,303,475,328],'Drain crossing hall','drain','octagon','Four thick pipes meet above a dry walkway',.08],
 ['U03','undercroft',5,[414,341,440,366],'Lower pipe hall','pipe','rect','Supported pipework follows the real floor below',0],
 ['U04','undercroft',5,[448,341,462,358],'Maintenance wash suite','staff','wedge','Ordinary basins among service access panels',.035],
 ['U05','undercroft',6,[414,378,443,405],'Deep drain hall','drain','L','Two stair flights end beside an inexplicably familiar door',.10],
 ['U06','undercroft',6,[453,378,478,405],'Deep maintenance washroom','staff','rect','A silent room where the last water ends',0],
 ['U07','undercroft',4,[484,341,510,366],'Dry maintenance wash suite','staff','U','Dry pale tiles begin beyond the service stair',0],
 ['U08','undercroft',4,[484,303,510,328],'First dry institutional room','dry','rect','A functioning ceiling light and ordinary worn floor',0],
 ['U09','undercroft',4,[520,303,531,315],'Quiet dry washroom','dry','L','One last plain basin beside a short passage',0],
 ['U10','undercroft',4,[568,311,579,324],'Last ordinary restroom','dry','rect','A service hatch behind the last basin and a draught from below',0]
];
function rsRoomShape(b,shape){const[x,y,X,Y]=b,w=X-x,h=Y-y;if(shape==='L')return[[x,y],[X,y],[X,Y],[x+w*.68,Y],[x+w*.68,y+h*.66],[x,y+h*.66]];if(shape==='U')return[[x,y],[X,y],[X,Y],[x+w*.69,Y],[x+w*.69,y+h*.48],[x+w*.31,y+h*.48],[x+w*.31,Y],[x,Y]];if(shape==='octagon'){const d=Math.min(w,h)*.18;return[[x+d,y],[X-d,y],[X,y+d],[X,Y-d],[X-d,Y],[x+d,Y],[x,Y-d],[x,y+d]];}if(shape==='wedge')return[[x,y+h*.12],[X-w*.10,y],[X,Y],[x+w*.18,Y],[x,y+h*.70]];return rsRect(...b);}
function rsPort(s,side,f=.5){const axis=side==='e'||side==='w'?0:1,want=side==='e'||side==='s'?1:-1,normal=side==='e'?[1,0]:side==='w'?[-1,0]:side==='s'?[0,1]:[0,-1];let chosen=null,best=-Infinity;for(let i=0;i<s.poly.length;i++){const a=s.poly[i],b=s.poly[(i+1)%s.poly.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=dy/len,ny=-dx/len;if(nx*normal[0]+ny*normal[1]<.45||len<2.1)continue;const score=want*(a[axis]+b[axis])/2+len*.0001;if(score>best){chosen=[a,b,nx,ny];best=score;}}if(!chosen)throw Error('No portal wall '+s.id+' '+side);const p=[mix(chosen[0][0],chosen[1][0],f),mix(chosen[0][1],chosen[1][1],f),s.z];s.ports.push({x:p[0],y:p[1],side,nx:chosen[2],ny:chosen[3]});return p;}
function rsCorridor(id,pts,width=2.6,extra={}){const expanded=[pts[0]];for(const b of pts.slice(1)){const a=expanded[expanded.length-1];if(Math.abs(b[0]-a[0])>.001&&Math.abs(b[1]-a[1])>.001)expanded.push([b[0],a[1],a[2]]);expanded.push(b);}pts=expanded;const via=[];via.waypoints=pts;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy);if(length<.015)continue;if(Math.abs(dx)>.001&&Math.abs(dy)>.001)throw Error('Non-orthogonal corridor '+id);const poly=Math.abs(dx)>Math.abs(dy)?rsRect(Math.min(a[0],b[0])-width/2-.03,a[1]-width/2,Math.max(a[0],b[0])+width/2+.03,a[1]+width/2):rsRect(a[0]-width/2,Math.min(a[1],b[1])-width/2-.03,a[0]+width/2,Math.max(a[1],b[1])+width/2+.03);const s=rsSurface(id+'-'+i,poly,a[2],extra.h||2.65,{district:extra.district||'public',connector:true,...extra});if(Math.abs(b[2]-a[2])>.001){const cap=Math.min(width/2+.035,length*.22);s.slope={x0:a[0]+dx/length*cap,y0:a[1]+dy/length*cap,x1:b[0]-dx/length*cap,y1:b[1]-dy/length*cap,dz:b[2]-a[2]};s.stairWidth=width;s.kind='stair';s.ceil=s.z+s.h+Math.max(0,s.slope.dz);}via.push(s.id);}return via;}
function rsConnect(aId,bId,o={}){const a=RW.byId[aId],b=RW.byId[bId];if(!a||!b)throw Error('Missing connection room '+aId+' '+bId);const ac=[(a.bounds[0]+a.bounds[2])/2,(a.bounds[1]+a.bounds[3])/2],bc=[(b.bounds[0]+b.bounds[2])/2,(b.bounds[1]+b.bounds[3])/2],horizontal=Math.abs(ac[0]-bc[0])>Math.abs(ac[1]-bc[1]),sa=o.sa||(horizontal?(ac[0]<bc[0]?'e':'w'):(ac[1]<bc[1]?'s':'n')),sb=o.sb||({e:'w',w:'e',n:'s',s:'n'}[sa]),p=rsPort(a,sa,o.fa??.5),q=rsPort(b,sb,o.fb??.5),id=o.id||'link-'+aId+'-'+bId;let pts=[p];if(o.points)pts.push(...o.points.map(v=>v.length===2?[v[0],v[1],a.z]:v));else if(Math.abs(p[2]-q[2])<.01){if(Math.abs(p[0]-q[0])>.01&&Math.abs(p[1]-q[1])>.01){if(sa==='e'||sa==='w'){const mx=(p[0]+q[0])/2;pts.push([mx,p[1],p[2]],[mx,q[1],q[2]]);}else{const my=(p[1]+q[1])/2;pts.push([p[0],my,p[2]],[q[0],my,q[2]]);}}}else{throw Error('Stair connection needs explicit waypoints '+id);}pts.push(q);const via=rsCorridor(id,pts,o.width||2.6,{district:o.district||a.district,h:o.h||2.65});const c={id,a:aId,b:bId,type:o.type||((a.z!==b.z)?'stairs':'passage'),via,waypoints:via.waypoints,width:o.width||2.6,...(o.doorId?{doorId:o.doorId}:{})};RW.connections.push(c);return c;}
function rsRegisterRooms(){for(const row of RS_ROOM_LEDGER){const[id,district,floor,b,name,kind,shape,landmark,water]=row,monument=kind.startsWith('reservoir')||kind.startsWith('court'),h=kind==='court-needle'?13.35:kind.startsWith('court')?16.75:kind.startsWith('reservoir')?6.3:kind==='lightwell'?(floor===1?5.65:3.05):kind==='gallery'?3.05:kind==='stall'?2.42:2.65;const s=rsSurface(id,rsRoomShape(b,shape),-floor*3.4,h,{room:true,district,floor,name,kind,shape,landmark,acoustic:kind.startsWith('court')?'court':kind.startsWith('reservoir')?(id==='R13'?'cavern':'pool'):kind==='gallery'||kind==='lightwell'?'gallery':kind==='stall'?'suite':district==='undercroft'?'service':'tile',ambient:'silent',ambience:'silent'});if(water)rsAddWater(s,water);if(id==='G12')s.acoustic='anechoic';if(monument)s.ambientLight*=.78;}
 // Puddles are local water regions. Most of the first washroom remains dry.
 rsAddWater(RW.byId.P01,.022,rsRect(3,17,8,20));
 for(const id of['P02','P08','G05','G11','C04','C11','R01','R08','R12','V01','V02','U02','U05']){const s=RW.byId[id],b=s.bounds,kind=['R08','R12','U02','U05'].includes(id)?'flow':'drip';s.ambient=s.ambience=kind==='drip'?'drips':'flow';rsEmitter(s,kind,b[0]+1.05,b[1]+1.1,s.z+(kind==='drip'?Math.min(s.h-1,2.1):.16),id.startsWith('R')?.35:.18,id.startsWith('R')?11:8);}
 // One authored displaced drip. All other emitters follow their visible fixtures.
 const displaced=RW.byId.C09;displaced.ambient=displaced.ambience='drips';rsEmitter(displaced,'drip',displaced.bounds[0]+.3,displaced.bounds[1]+2.2,displaced.z+2.12,.17,13).displaced=true;
}
function rsGridLinks(ids,cols){for(let i=0;i<ids.length;i++){if(i%cols<cols-1&&i+1<ids.length)rsConnect(ids[i],ids[i+1]);if(i+cols<ids.length)rsConnect(ids[i],ids[i+cols]);}}
function rsOutsideStair(aId,bId,xOffset=8){const a=RW.byId[aId],b=RW.byId[bId],y=(a.bounds[1]+a.bounds[3])/2,x=Math.max(a.bounds[2],b.bounds[2])+xOffset,qy=(b.bounds[1]+b.bounds[3])/2;return rsConnect(aId,bId,{sa:'e',sb:'e',points:[[x,y,a.z],[x,y-14,b.z],[x+4,y-14,b.z],[x+4,qy,b.z]],type:'stairs'});}
function rsBuildCirculation(){
 rsSurface('top',rsRect(4,-12,7,2),0,2.65,{district:'public',connector:true});
 rsSurface('first-stair',rsRect(4,2,7,14),0,2.65,{district:'public',connector:true,kind:'stair',stairWidth:3,slope:{x0:5.5,y0:2,x1:5.5,y1:14,dz:RS_B1}});
 RW.byId.P01.ports.push({x:5.5,y:14,side:'n'});RW.entry={x:5.5,y:0,z:0,a:Math.PI/2,commit:{surface:'P01',y:14.6}};
 RW.connections.push({id:'hospital-stair',a:'top',b:'P01',type:'stairs',via:['first-stair'],width:3,oneWayEntry:true,waypoints:[[5.5,0,0],[5.5,2,0],[5.5,14,RS_B1],[5.5,18,RS_B1]]});
 rsGridLinks(Array.from({length:12},(_,i)=>'P'+String(i+1).padStart(2,'0')),3);
 for(let f=0;f<3;f++)rsGridLinks(Array.from({length:6},(_,i)=>'G'+String(f*6+i+1).padStart(2,'0')),3);
 for(let f=0;f<2;f++)rsGridLinks(Array.from({length:6},(_,i)=>'C'+String(f*6+i+1).padStart(2,'0')),3);
 rsGridLinks(['C13','C14','C15','C16'],2);
 rsOutsideStair('G06','G12',8);rsOutsideStair('G12','G18',19);
 rsOutsideStair('C06','C12',8);rsOutsideStair('C11','C16',6);
 rsConnect('P03','G01',{sa:'e',sb:'w',points:[[89,25,RS_B1],[89,20,RS_B1]]});
 rsConnect('P10','C01',{sa:'s',sb:'n',points:[[11,139,RS_B1],[11,153,RS_B2],[11,164,RS_B2]],type:'stairs'});
 // A perimeter maintenance passage joins the public systems without cutting through their rooms.
 rsConnect('G10','C06',{sa:'w',sb:'e',points:[[92,64,RS_B2],[92,224,RS_B2]],width:2.4});
 rsConnect('G18','R01',{sa:'s',sb:'n',points:[[215,94,RS_B3],[112,94,RS_B3],[112,164,RS_B3],[139,164,RS_B3]],width:3.0});
 rsConnect('C16','R01',{sa:'e',sb:'w',points:[[103,224,RS_B4],[117,224,RS_B3]],type:'stairs',width:2.8});
 // Four distinct reservoir halls, each with its own inhabited perimeter and a loop.
 for(const group of[['R01','R02','R03','R04'],['R05','R06','R07','R08'],['R09','R10','R11','R12'],['R13','R14','R15','R16']]){const[h,a,b,d]=group;rsConnect(h,a);rsConnect(a,b);rsConnect(b,h);rsConnect(h,d);}
 rsConnect('R03','R05',{sa:'e',sb:'w',points:[[189,220.5,RS_B3],[189,206.5,RS_B4],[193,206.5,RS_B4],[193,200,RS_B4]],type:'stairs'});
 rsConnect('R08','R10',{sa:'s',sb:'n',points:[[228,269,RS_B4],[198,269,RS_B4],[184,269,RS_B5],[128.5,269,RS_B5]],type:'stairs'});
 rsConnect('R11','R14',{sa:'e',sb:'w',points:[[197,287.5,RS_B5],[197,284,RS_B5]]});
 // A perimeter loop links both large lower halls without confusing the first-pass court route.
 rsConnect('R12','R16',{sa:'e',sb:'w',points:[[190,381.5,RS_B5],[190,383.5,RS_B5]],width:3});
}
function rsRail(x1,y1,x2,y2,z,owner,solid=true){RW.owner=owner;const len=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.ceil(len/2.5));for(let i=0;i<=n;i++){const x=mix(x1,x2,i/n),y=mix(y1,y2,i/n);rsBox(x,y,z,.055,.055,1.02,4);}rsBox((x1+x2)/2,(y1+y2)/2,z+.97,Math.max(.055,Math.abs(x2-x1)),Math.max(.055,Math.abs(y2-y1)),.055,4);if(solid)rsSolid(Math.min(x1,x2)-.035,Math.min(y1,y2)-.035,Math.max(x1,x2)+.035,Math.max(y1,y2)+.035,z,1.03);}
function rsCourtDeck(s,floor){const z=-floor*3.4,[x,y,X,Y]=s.bounds,d=2.75,prefix=s.id+'-B'+floor;const parts=[['north',rsRect(x,y,X,y+d)],['east',rsRect(X-d,y+d,X,Y-d)],['south',rsRect(x,Y-d,X,Y)],['west',rsRect(x,y+d,x+d,Y-d)]];for(const[k,poly]of parts)rsSurface(prefix+'-'+k,poly,z,2.75,{district:'courts',court:s.id,floor,deck:true,noCeil:true,noWalls:true,acoustic:'court',ambient:'silent',ambience:'silent'});s.deckIds=s.deckIds||[];s.deckIds.push(...parts.map(([k])=>prefix+'-'+k));return prefix;}
function rsCourtSurface(id,floor,side='east'){const s=RW.byId[id];return floor===s.floor?id:id+'-B'+floor+'-'+side;}
function rsBuildCourts(){
 for(const id of['V01','V02','V03']){const s=RW.byId[id],floors=id==='V01'?[4,3,2]:[5,4,3];s.reachableFloors=[s.floor,...floors];for(const f of floors)rsCourtDeck(s,f);const[x,y]=s.bounds;for(const f of floors){const upper=rsCourtSurface(id,f,'west'),lower=rsCourtSurface(id,f+1,'west'),a=[x,y+7,-f*3.4],b=[x,y+21,-(f+1)*3.4],sid='stair-'+id+'-B'+f,via=rsCorridor(sid,[a,[x-5,y+7,a[2]],[x-5,y+21,b[2]],b],2.6,{district:'courts'});const shortcut=id==='V03'&&f===3,doorId=shortcut?'shortcut-court-fourth-landing':null;RW.connections.push({id:sid,a:upper,b:lower,type:shortcut?'shortcut':'stairs',via,waypoints:[a,[x-5,y+7,a[2]],[x-5,y+21,b[2]],b],width:2.6,...(doorId?{doorId}:{})});if(shortcut)RW.pendingDoors=([...RW.pendingDoors||[],{id:doorId,owner:via[0],x:x-2,y:y+7,z:a[2],a:Math.PI/2,width:2.55,shortcut:true,deepSide:{x:x+1,y:y+7},label:'MAINTENANCE STAIR'}]);}}
 rsConnect('V01','V04',{sa:'e',sb:'w'});rsConnect('V01-B4-east','V05',{sa:'e',sb:'w'});rsConnect('V01-B2-south','V06',{sa:'s',sb:'n'});
 rsConnect('V02','V07',{sa:'e',sb:'w',fa:.25});rsConnect('V02-B4-east','V08',{sa:'e',sb:'w'});rsConnect('V02-B3-south','V09',{sa:'s',sb:'n'});
 rsConnect('V03','V10',{sa:'e',sb:'w',fa:.28});rsConnect('V03-B4-east','V11',{sa:'e',sb:'w'});rsConnect('V03-B3-south','V12',{sa:'s',sb:'n'});
 rsConnect('R07','V01',{sa:'e',sb:'n',points:[[287,220.5,RS_B4],[287,162,RS_B4],[301,162,RS_B5],[309,162,RS_B5]],type:'stairs'});
 rsConnect('V04','V02',{sa:'n',sb:'n',points:[[335,164,RS_B5],[349,164,RS_B6],[380.5,164,RS_B6]],type:'stairs',width:2.2});
 rsConnect('R13','V03',{sa:'e',sb:'w',points:[[280,332,RS_B5],[294,332,RS_B6],[302,332,RS_B6],[302,327,RS_B6]],type:'stairs',width:3});
 // The courts connect on their lower strata. The fourth terrace remains gated by its impossible passage.
 rsConnect('V02','V03',{sa:'s',sb:'n',points:[[400,238,RS_B6],[400,285,RS_B6],[333,285,RS_B6]],width:2.8});
}
function rsBuildUndercroft(){
 rsConnect('V12','U01',{sa:'e',sb:'w',points:[[348,374,RS_B3],[393,374,RS_B3],[393,360,RS_B4],[393,315.5,RS_B4]],type:'stairs',width:2.6});
 rsConnect('U01','U02');rsConnect('U03','U04');rsConnect('U05','U06');rsConnect('U07','U08');rsConnect('U08','U09');rsConnect('U09','U10');
 rsConnect('U01','U03',{sa:'s',sb:'n',points:[[432,334,RS_B4],[446,334,RS_B5],[446,337,RS_B5],[427,337,RS_B5]],type:'stairs'});
 rsConnect('U02','U04',{sa:'s',sb:'n',points:[[461.5,335,RS_B4],[475.5,335,RS_B5],[478,335,RS_B5],[478,338,RS_B5],[461.5,338,RS_B5]],type:'stairs'});
 rsConnect('U03','U05',{sa:'s',sb:'n',points:[[427,372,RS_B5],[441,372,RS_B6],[449,372,RS_B6],[449,375,RS_B6],[427,375,RS_B6]],type:'stairs'});
 rsConnect('U04','U07',{sa:'e',sb:'w',points:[[467,349.5,RS_B5],[467,332,RS_B5],[481,332,RS_B4],[481,353.5,RS_B4]],type:'stairs',width:2.2});
 // A second drain-side stair creates a real deep loop; this is not another spatial jump.
 rsConnect('U06','U04',{sa:'e',sb:'e',points:[[485,391.5,RS_B6],[485,377.5,RS_B5],[489,377.5,RS_B5],[489,353.5,RS_B5]],type:'stairs',width:2.4});
 const final=RW.byId.U10,z=final.z;
 rsSurface('return-cubicle',rsRect(579,318,584,320.2),z,2.5,{district:'undercroft',connector:true,acoustic:'suite',ambient:'silent',ambience:'silent'});
 final.ports.push({x:579,y:319.1,side:'e'});
 // The old short return passage is now only the hidden approach to a real
 // four-floor climb. There is no hospital-return trigger behind this door.
 const route=[[583,319.1,z],[593,319.1,z],[593,265,0],[600,265,0]];
 const via=rsCorridor('sewer-climb',route,2.2,{district:'undercroft',h:2.7,noCeil:true,acoustic:'service',ambient:'silent',ambience:'silent',sewer:true});
 for(const id of via){const s=RW.byId[id];s.kind=s.slope?'sewer-stair':'sewer-pipe';if(!s.slope)rsAddWater(s,.035);}
 RW.sewer={via,waypoints:route,entrance:{x:582.5,y:319.1,z},exit:{x:600,y:265,z:0}};
 RW.exit={surface:via[via.length-1],poly:rsRect(599.1,264.05,600.7,265.95),z:0,room:'U10',return:'sewer-grounds'};
 RW.connections.push({id:'sewer-ascent',a:'return-cubicle',b:via[via.length-1],type:'stairs',via,waypoints:route,width:2.2});
 RW.connections.push({id:'final-return',a:'U10',b:'return-cubicle',type:'exit',via:[],waypoints:[[577,319.1,z],[583,319.1,z]],width:2.2});
}
function rsFoldVestibule(id,roomId,side,f=.5){const room=RW.byId[roomId],p=rsPort(room,side,f),theme=id.includes('wrong-height')?{district:'courts',h:2.65,wallMat:19,floorMat:16,ceilingMat:19}:id.includes('impossible-gallery')?{district:'galleries',h:3.05,wallMat:15,floorMat:16,ceilingMat:2}:id.includes('overlap-reservoirs')?{district:'reservoirs',h:3.1,wallMat:18,floorMat:1,ceilingMat:18}:id.includes('returning-descent')?{district:'undercroft',h:2.65,wallMat:20,floorMat:3,ceilingMat:20}:id.includes('damaged-basin')?{district:'public',h:2.65,wallMat:13,floorMat:14,ceilingMat:21}:{district:'cubicles',h:2.45,wallMat:17,floorMat:1,ceilingMat:2},n=side==='e'?[1,0]:side==='w'?[-1,0]:side==='s'?[0,1]:[0,-1],t=[-n[1],n[0]],at=(normal,tangent)=>[p[0]+n[0]*normal+t[0]*tangent,p[1]+n[1]*normal+t[1]*tangent,p[2]],pts=[p,at(3,0),at(3,5),at(13,5),at(13,10),at(16,10)],via=rsCorridor(id,pts,2.1,{...theme,foldVestibule:true,acoustic:'suite',ambient:'silent',ambience:'silent'}),plane=at(8,5);return{x:plane[0],y:plane[1],z:p[2],nx:n[0],ny:n[1],width:2.1,surface:via[2],room:roomId,via,waypoints:pts.slice(0,3).concat([plane]),floor:room.floor};}
function rsBuildFolds(){const specs=[
 ['stall-depth','The room behind the stall','P12','e',.5,'G13','w',.5,false],
 ['damaged-basin','The same damaged basin','C12','e',.5,'P01','w',.45,false],
 ['wrong-height','The wrong-height balcony','V03-B5-east','e',.52,'V03-B3-east','e',.52,true],
 ['impossible-gallery','The gallery that cannot fit','G08','n',.5,'G09','n',.5,false],
 ['overlap-reservoirs','The incompatible reservoirs','R05','w',.55,'R09','w',.45,false],
 ['returning-descent','The returning descent','U05','s',.65,'G15','e',.45,false]
 ];for(const[id,name,ra,sa,fa,rb,sb,fb,required]of specs){const a=id==='impossible-gallery'?rsCurvedFoldSource(ra):rsFoldVestibule('fold-'+id+'-a',ra,sa,fa),b=rsFoldVestibule('fold-'+id+'-b',rb,sb,fb),rotation=Math.atan2(-b.ny,-b.nx)-Math.atan2(a.ny,a.nx),f={id,name,a,b,angle:rotation,required,stable:true};RW.folds.push(f);RW.connections.push({id:'fold-'+id,a:ra,b:rb,type:'fold',foldId:id,requiredFold:required,via:[...a.via,...b.via],waypoints:[],width:2.1});if(id==='returning-descent'){const d={id:'shortcut-returning-descent',owner:b.surface,x:b.x-b.nx*1.2,y:b.y-b.ny*1.2,z:b.z,a:Math.atan2(b.ny,b.nx)+Math.PI/2,width:2.08,shortcut:true,deepSide:{x:b.x+b.nx,y:b.y+b.ny},label:'SERVICE RETURN'};(RW.pendingDoors||(RW.pendingDoors=[])).push(d);f.doorId=d.id;RW.connections[RW.connections.length-1].doorId=d.id;}}
}
function rsPlacement(s,x,y,r=.8){return rsPolyHas(s.poly,x,y)&&rsPolyHas(s.poly,x-r,y-r)&&rsPolyHas(s.poly,x+r,y+r)&&!(s.ports||[]).some(p=>Math.hypot(p.x-x,p.y-y)<2.4);}
function rsDressStall(s,x,y,index,a=0){const z=s.z,c=Math.cos(a),sn=Math.sin(a),tr=(u,v)=>[x+u*c-v*sn,y+u*sn+v*c];const t=tr(0,-.35);rsToilet(...t,z,a);rsFixture(x,y,a,()=>{for(const side of[-1,1])rsBox(side*.77,.35,z,.06,2.12,1.90,11,true);rsBox(-.61,1.40,z,.27,.06,1.87,11,true);rsBox(.61,1.40,z,.27,.06,1.87,11,true);rsBox(.39,-.62,z+.81,.13,.12,.13,7);});const p=tr(0,1.40);rsDoor('door-'+s.id+'-stall-'+index,s.id,p[0],p[1],z,a,.95,{h:1.85,open:index%3!==0,stall:true});}
function rsDressRoom(s){RW.owner=s.id;const[x,y,X,Y]=s.bounds,w=X-x,h=Y-y,z=s.z,cx=(x+X)/2,cy=(y+Y)/2,large=s.kind.startsWith('reservoir')||s.kind.startsWith('court');
 // Wall fixtures observe actual openings. The fixture kit is metrically constant.
 if(!large){const gallery=s.kind==='gallery',count=gallery?Math.min(34,Math.floor(w/1.85)):Math.min(s.kind==='staff'||s.kind==='dry'?3:6,Math.floor(w/2.5));for(let i=0;i<count;i++){const sx=x+1.25+i*(gallery?1.85:1.65),sy=y+.46;if(rsPlacement(s,sx,sy,.28))rsSink(sx,sy,z,s.id==='P01'&&i===0,0,['P01','G05','C08','R02','V04','V12','U09'].includes(s.id)&&i===1);}
  // Diagonal wash walls receive fixtures on their actual inward normal, not the rectangular bounds.
  if(!(s.fixtureCounts?.sinks)&&!['pipe','drain'].includes(s.kind)){for(let k=0;k<s.poly.length;k++){const a=s.poly[k],b=s.poly[(k+1)%s.poly.length],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);if(dx/len<.45||len<3)continue;const angle=Math.atan2(dy,dx),nx=-dy/len,ny=dx/len;for(let i=0;i<Math.min(5,Math.floor((len-2)/1.6));i++){const t=(1.25+i*1.6)/len,sx=a[0]+dx*t+nx*.47,sy=a[1]+dy*t+ny*.47;if(rsPlacement(s,sx,sy,.26))rsSink(sx,sy,z,false,angle,['C08','G16','U04'].includes(s.id)&&i===1);}if(s.fixtureCounts?.sinks)break;}}
  if(['suite','stall','staff','dry','paired'].includes(s.kind)){const n=Math.min(s.kind==='stall'?8:4,Math.floor((w-3)/1.75));for(let i=0;i<n;i++){const sx=X-1.5-i*1.7,sy=Y-1.2;if(rsPlacement(s,sx,sy,1.1))rsDressStall(s,sx,sy,i,Math.PI);}
   // A second functional stall bank organizes big suites into close readable aisles.
   if(s.kind==='stall'&&w>18&&h>20){const bx=x+w*.52;for(let i=0;i<5;i++){const sy=y+5+i*2.5;if(rsPlacement(s,bx,sy,1.2))rsDressStall(s,bx,sy,i+12,Math.PI/2);}rsBox(bx+1.25,cy,z,.12,h-9,2.05,17,true);}
  }
  if(s.kind==='urinal'){for(let i=0;i<Math.min(7,Math.floor((h-4)/1.45));i++){const uy=y+2+i*1.45;if(rsPlacement(s,X-.48,uy,.29)){rsUrinal(X-.48,uy,z,-Math.PI/2);rsBox(X-.9,uy+.67,z+.30,1.0,.08,1.42,11,true);}}}
  if(s.kind==='shower'){for(let i=0;i<Math.min(8,Math.floor((w-3)/1.7));i++){const sx=x+1.5+i*1.7,sy=Y-1.3;if(!rsPlacement(s,sx,sy,.9))continue;rsBox(sx,Y-.15,z+1.0,.035,.035,1.14,4);rsBox(sx,Y-.30,z+2.11,.24,.30,.025,4);rsBox(sx+.77,Y-1.25,z,.065,2.3,1.95,11,true);rsBox(sx,sy,z+.008,.33,.33,.009,12);}if(w>15)rsBox(cx,cy,z,3.6,.52,.44,3,true);}
  if(s.kind==='pipe'||s.kind==='drain'){for(let i=0;i<3;i++){const px=x+1.0+i*.34;rsBox(px,cy,z+s.h-.43,.18,h-2,.18,4);for(let yy=y+2;yy<Y-1;yy+=5)rsBox(px,yy,z+s.h-.65,.06,.08,.56,4);}if(s.kind==='drain'){rsBox(cx,cy,z+.009,Math.min(w-4,9),.43,.015,12);for(const side of[-1,1])rsBox(cx+side*2.5,cy,z,1.1,1.1,.36,20,true);}}
  if(s.kind==='wash'&&w>20&&h>20){rsBox(cx,cy,z,2.7,2.7,.75,s.wallMat,true);for(const dx of[-.65,.65])rsBowl(cx+dx,cy-.75,z+.85,.35,.25);}
  if(s.kind==='lightwell'){const warm=s.id!=='G03';for(let i=0;i<3;i++){const wx=x+3+i*(w-6)/3;rsBox(wx,y+.035,z+s.h-2,2.5,.06,1.55,10,false,true);}for(let i=0;i<4;i++){const lx=x+3+i*(w-6)/4;RW.lights.push({owner:s.id,x:lx,y:y+1.5,z:z+s.h-1.3,power:3.5,warm,color:[1,.86,.63]});}rsBox(cx,cy,z+.01,Math.min(w*.4,11),.055,.015,16);}
 }
 // Practical illumination and local darkness differ by room rather than a global tint.
 if(!large){const gallery=s.kind==='gallery',n=gallery?Math.max(2,Math.ceil(w/9)):Math.max(1,Math.ceil(w/14));for(let i=0;i<n;i++){const lx=x+(i+.5)*w/n,ly=y+Math.min(h*.45,4.5);if(rsPolyHas(s.poly,lx,ly))rsLamp(lx,ly,z+s.h-.11,gallery?1.9:1.15,s.district==='public'||s.id==='G05'||s.id==='G11',gallery?1.0:.9);}if(h>17&&rsPolyHas(s.poly,cx,Y-4))rsLamp(cx,Y-4,z+s.h-.11,1.2,s.district==='undercroft',.75);}
 // Room-specific physical signs stay on wall planes, outside circulation openings.
 if(s.id==='P01')rsSign(1.2,y+.018,z+1.7,'WASHROOMS',0);
 else if(['P12','G03','G18','R02','R10','V04','V12','U01','U10'].includes(s.id))rsSign(x+1.1,y+.018,z+1.65,s.id==='U10'?'RESTROOMS':s.kind.startsWith('court')?'WASH LEVEL':'WASHROOMS / B'+s.floor,0);
 // Grates sit on the true submerged floor. They remain visible through the water.
 const gx=x+Math.min(w-2,3.5),gy=y+Math.min(h-2,4);if(rsPolyHas(s.poly,gx,gy))rsBox(gx,gy,z+.005,.48,.48,.008,12);
 for(const e of s.emitters||[]){if(e.kind==='drip'){rsBox(e.x,e.y,z+s.h-.6,.055,.055,.60,4);rsBox(e.x,e.y,z+.008,.31,.31,.008,12);}else{rsBox(e.x,e.y,z+.06,.52,.52,.12,12);rsBox(e.x,e.y,z+.06,.11,.11,.40,4);}}
 if(s.id==='P01'){s.basinWitness={x:x+1.25,y:y+.46,z:z+.82};rsBox(x+1.25,y+.28,z+.42,.07,.07,.28,22);}
 if(s.id==='C09')rsBox(x+.4,y+3,z+2.05,.09,4,.09,4);
 if(s.id==='G08'||s.id==='G09'){rsBox(cx,cy,z,1.9,2.4,s.h,20,true);rsBox(cx-1.01,cy,z+.3,.10,1.7,1.7,4);}
}
function rsDressReservoir(s){RW.owner=s.id;const[x,y,X,Y]=s.bounds,w=X-x,h=Y-y,z=s.z;
 if(s.id==='R01'){for(let yy=y+10;yy<Y-5;yy+=12)for(let xx=x+6;xx<X-2;xx+=9)rsArch(xx,yy,z,7.7,5.9);for(let yy=y+8;yy<Y-4;yy+=19)rsLamp(x+w*.5,yy,z+6.07,2.1,false,1.4);}
 if(s.id==='R05'){for(let row=0;row<4;row++)for(let col=0;col<5;col++){let xx=x+7+col*10,yy=y+7+row*10;if(row===2&&col===2)xx+=2.6;rsBox(xx,yy,z,.95,.95,6.3,18,true,true);rsBox(xx,yy,z+5.5,2.1,2.1,.8,18,false,true);}for(const[xx,yy]of[[x+8,y+8],[X-8,y+8],[X-8,Y-8]])rsLamp(xx,yy,z+6.12,2.2,false,2.1);}
 if(s.id==='R09'){for(let yy=y+8;yy<Y-4;yy+=11)for(const xx of[x+7,X-7])if(rsPolyHas(s.poly,xx,yy))rsArch(xx,yy,z,9.8,5.7);for(const[xx,yy]of[[x+8,y+9],[X-8,y+9],[x+8,Y-8],[X-8,Y-8]])rsLamp(xx,yy,z+6.04,1.8,false,1.1);}
 if(s.id==='R13'){for(let yy=y+9;yy<Y-5;yy+=13)for(let xx=x+8;xx<X-3;xx+=13)rsBox(xx,yy,z,1.0,1.0,6.3,18,true,true);for(let i=0;i<6;i++){const xx=x+5+i*(w-10)/5,yy=y+5+i*(h-10)/5;rsLamp(xx,yy,z+5.95,1.5,false,1.0);}}
 // Dry perimeter ledges have independent floor collision and change the next footstep.
 const d=2.4;for(const[id,b]of[['north',[x,y,X,y+d]],['west',[x,y+d,x+d,Y]]]){const owner=s.id+'-ledge-'+id;const deck=RW.byId[owner];if(!deck)continue;RW.owner=owner;rsQuad([b[0],b[1],z+.31],[b[2],b[1],z+.31],[b[2],b[3],z+.31],[b[0],b[3],z+.31],s.floorMat);}
 RW.owner=s.id;rsSign(x+.015,y+2.5,z+1.65,'BATHS',Math.PI/2);
}
function rsReservoirLedges(){for(const id of['R01','R05','R09','R13']){const s=RW.byId[id],[x,y,X,Y]=s.bounds,d=2.4;for(const[k,b]of[['north',[x,y,X,y+d]],['west',[x,y+d,x+d,Y]]])rsSurface(id+'-ledge-'+k,rsRect(...b),s.z+.31,Math.max(2.7,s.h-.31),{district:'reservoirs',noCeil:true,noWalls:true,deck:true,parentRoom:id,acoustic:'pool',ambient:'silent',ambience:'silent'});}
 // The diagonal crossing is a real raised path through R13, built from a walkable polygon.
 const r=RW.byId.R13,[x,y,X,Y]=r.bounds,poly=[[x+2,y+3],[x+5,y+2],[X-2,Y-4],[X-5,Y-2]];
 rsSurface('R13-diagonal-walk',poly,r.z+.31,5.9,{district:'reservoirs',noCeil:true,noWalls:true,deck:true,parentRoom:'R13',acoustic:'cavern',ambient:'silent',ambience:'silent'});
 // Shallow slopes into all raised ledges keep water crossings continuous, no invisible step barrier.
 for(const id of['R01','R05','R09','R13']){const s=RW.byId[id],[x,y,X,Y]=s.bounds;rsCorridor('ledge-step-'+id,[[x+5,y+5,s.z],[x+5,y+2,s.z+.31]],2.3,{district:'reservoirs',noCeil:true,noWalls:true,h:5.8});}
}
function rsDressCourt(s){RW.owner=s.id;const[x,y,X,Y]=s.bounds,z=s.z;
 // Repeated windows are in the actual court walls; three selected destinations have real connected rooms.
 for(let floor=s.floor;floor>=Math.min(...s.reachableFloors);floor--){const zz=-floor*3.4;for(let xx=x+4;xx<X-2;xx+=5.7){rsBox(xx,y+.025,zz+1.14,1.55,.045,1.22,4,false,true);rsBox(xx,y+.052,zz+1.19,1.39,.018,1.08,24,false,true);}for(let yy=y+4;yy<Y-2;yy+=5.7){rsBox(X-.025,yy,zz+1.14,.045,1.55,1.22,4,false,true);rsBox(X-.052,yy,zz+1.19,.018,1.39,1.08,24,false,true);}}
 // The same cracked column and pipe are visible from every genuine terrace level.
 const px=x+(s.id==='V03'?witnessOffset(s):4.2),py=y+7;rsBox(px,py,z,.8,.8,s.h,19,true,true);rsBox(px+.408,py-.2,z+.6,.018,.14,s.h-1,22);rsBox(px+1.2,py,z+1,.13,.13,s.h-1.7,4);
 for(const f of s.reachableFloors){if(f===s.floor)continue;const zz=-f*3.4,prefix=s.id+'-B'+f;rsRail(x+2.75,y+2.85,x+2.75,Y-2.85,zz,prefix+'-west');rsRail(X-2.75,y+2.85,X-2.75,Y-2.85,zz,prefix+'-east');rsRail(x+2.8,y+2.75,X-2.8,y+2.75,zz,prefix+'-north');rsRail(x+2.8,Y-2.75,X-2.8,Y-2.75,zz,prefix+'-south');for(const side of['north','east','south','west']){const d=RW.byId[prefix+'-'+side];RW.owner=d.id;for(const tri of rsTriangulate(d.poly))rsFace(tri.map(([xx,yy])=>[xx,yy,zz-.17]),20,{reflect:true});}RW.owner=prefix+'-north';rsLamp(x+5,y+1.25,zz+2.40,1.2,false,.8);RW.owner=prefix+'-south';rsLamp(X-5,Y-1.25,zz+2.40,1.2,true,.9);}
 RW.owner=s.id;rsLamp(x+3,y+4,z+2.85,1.45,false,1.25);rsLamp(X-3,Y-4,z+s.h-.25,2.2,true,3.4);s.witness={x:px,y:py,z,top:z+s.h};
}
function witnessOffset(s){return(s.bounds[2]-s.bounds[0])*.37;}
function rsIndexWorld(){RW.index=Object.create(null);for(const s of RW.surfaces)rsGridPut(RW.index,s.bounds,s);}
function rsIndexSolids(){RW.solidIndex=Object.create(null);for(const b of RW.solids)rsGridPut(RW.solidIndex,[b.x1,b.y1,b.x2,b.y2],b);}
function rsSafeRoomPose(s){const b=s.bounds,candidates=[[(b[0]+b[2])/2,(b[1]+b[3])/2],...s.ports.map(p=>[p.x+(p.side==='w'?.75:p.side==='e'?-.75:0),p.y+(p.side==='n'?.75:p.side==='s'?-.75:0)])];for(let y=b[1]+1;y<b[3]-1;y+=2.3)for(let x=b[0]+1;x<b[2]-1;x+=2.3)candidates.push([x,y]);for(const[x,y]of candidates)if(rsCanStand(x,y,s.z)){s.safePose={x,y,z:s.z,a:Math.PI/2};return;}throw Error('Room has no safe standing position '+s.id);}
function rsBuildWorld(){if(RW.ready)return;rsRegisterRooms();rsThreatPrepareRooms();rsBuildCirculation();rsBuildCourts();rsBuildUndercroft();rsBuildFolds();rsReservoirLedges();rsIndexWorld();rsBuildShell();
 for(const s of RW.rooms){rsDressRoom(s);if(s.kind.startsWith('reservoir'))rsDressReservoir(s);if(s.kind.startsWith('court'))rsDressCourt(s);}
 rsDressFoldWitnesses();
 // Connector lighting belongs to its sector. It never lights an unrelated floor through concrete.
 for(const s of RW.surfaces.filter(s=>s.connector&&!s.room)){RW.owner=s.id;const b=s.bounds,cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;if(rsPolyHas(s.poly,cx,cy))rsLamp(cx,cy,rsFloor(s,cx,cy)+s.h-.12,1.05,false,s.foldVestibule?.65:.85);s.acoustic=s.acoustic||(s.district==='undercroft'?'service':s.district==='courts'?'court':'tile');s.ambient=s.ambient||'silent';s.ambience=s.ambience||s.ambient;}
 for(const spec of RW.pendingDoors||[])rsDoor(spec.id,spec.owner,spec.x,spec.y,spec.z,spec.a,spec.width,spec);
 RW.owner='return-cubicle';rsDoor('final-ajar-door','return-cubicle',579.4,319.1,RS_B4,Math.PI/2,2.1,{open:false,exitDoor:true,label:'SERVICE HATCH'});rsLamp(582.5,319.1,RS_B4+2.33,.5,true,.25);
 rsDressSewer();
 // The first washroom closes behind the whole staircase after commitment.
 // This is the same plane used by capsule collision, not a wall upstairs.
 RW.owner='P01';rsQuad([4,14,RS_B1],[7,14,RS_B1],[7,14,RS_B1+2.65],[4,14,RS_B1+2.65],13,{seal:true});
 // Cross-height courts expose real decks to portal visibility without making them extra rooms.
 for(const s of RW.rooms.filter(s=>s.kind.startsWith('court')))for(const id of s.deckIds||[]){const deck=RW.byId[id],b=deck.bounds;rsAddPortal(s.id,id,[[b[0],b[1],deck.z],[b[2],b[3],deck.z],[b[2],b[3],deck.z+2.65],[b[0],b[1],deck.z+2.65]],{court:true});}
 rsThreatDressWorld();
 // Rebuild light membership once after all art, including custom light-well sources.
 for(const sec of Object.values(RW.sectors))sec.lightIndices=[];RW.lights.forEach((l,i)=>RW.sectors[l.owner]?.lightIndices.push(i));
 rsIndexSolids();for(const s of RW.rooms)rsSafeRoomPose(s);rsWeldVertices();rsMatchFoldTextures();RW.owner=null;RW.ready=true;if(RW.rooms.length!==84)throw Error('Expected 84 authored rooms');rsBakeFaces();
}
function rsCurvedFoldSource(roomId){const s=RW.byId[roomId],p=rsPort(s,'n',.5),z=s.z,cx=p[0]+40,cy=2,r=40,half=1.55,steps=28,outer=[],inner=[],centerline=[];for(let i=0;i<=steps;i++){const a=Math.PI+i*Math.PI/steps;outer.push([cx+Math.cos(a)*(r+half),cy+Math.sin(a)*(r+half)]);inner.push([cx+Math.cos(a)*(r-half),cy+Math.sin(a)*(r-half)]);centerline.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r,z]);}const stem=rsCorridor('curve-G08-approach',[p,[p[0],2,z]],3.1,{district:'galleries',h:3.05}),arc=rsSurface('G08-long-curve',[...outer,...inner.reverse()],z,3.05,{district:'galleries',connector:true,parentRoom:roomId,kind:'curved-gallery',acoustic:'gallery',ambient:'silent',ambience:'silent'});const q=[p[0]+80,2,z],pts=[q,[q[0],5,z],[q[0]-5,5,z],[q[0]-5,15,z],[q[0]-10,15,z],[q[0]-10,18,z]],via=rsCorridor('fold-impossible-gallery-a',pts,2.1,{district:'galleries',h:3.05,wallMat:15,floorMat:16,foldVestibule:true,acoustic:'gallery',ambient:'silent',ambience:'silent'});s.extensions=[arc.id];arc.curve={cx,cy,r,centerline};return{x:q[0]-5,y:10,z,nx:0,ny:1,width:2.1,surface:via[2],room:roomId,via:[...stem,arc.id,...via],waypoints:[p,...centerline,...pts.slice(0,3),[q[0]-5,10,z]],floor:s.floor};}
function rsDressFoldWitnesses(){
 // The actual final cubicle stands at the P12 source opening. Its back wall is
 // visibly thin from the accessible service side and opens into the excessive hall.
 const stall=RW.folds.find(f=>f.id==='stall-depth'),p=RW.byId.P12,z=p.z,source=p.ports.find(v=>v.side==='e'),sy=source.y;RW.owner=p.id;
 rsBox(78.05,sy-1.14,z,3.9,.08,2.05,11,true);rsBox(78.05,sy+1.14,z,3.9,.08,2.05,11,true);rsBox(76.16,sy-1.01,z,.09,.22,2.02,11,true);rsBox(76.16,sy+1.01,z,.09,.22,2.02,11,true);rsDoor('door-P12-last-stall',p.id,76.16,sy,z,Math.PI/2,1.80,{open:true,stall:true});rsToilet(78.75,sy-.64,z,Math.PI/2);rsBox(79.88,sy+1.37,z+.34,.06,1.4,1.42,20);rsBox(79.77,sy+1.45,z+.7,.08,.08,1.1,4);rsSign(79.984,sy+2.3,z+1.60,'SERVICE ACCESS',Math.PI/2);p.foldWitness={kind:'thin-stall-wall',x:79.9,y:sy,sourceDoor:'door-P12-last-stall'};
 // The chipped basin, exposed trap and cream repair stripe belong to P01 only.
 // Returning through the fold reaches this very object and its saved doors.
 const basin=RW.byId.P01;RW.owner=basin.id;rsBox(1.25,14.065,basin.z+.34,.30,.025,1.23,22);rsBox(1.25,14.32,basin.z+.31,.065,.065,.36,4);basin.foldWitness={kind:'persistent-basin',x:1.25,y:14.46,z:basin.z+.82};
 // A physically curved 125-metre gallery exits around a service core barely two
 // metres wide. The same copper repair band can be examined at either local end.
 const curve=RW.byId['G08-long-curve'];if(curve){RW.owner=curve.id;const{cx,cy,r}=curve.curve;for(let i=1;i<28;i+=2){const a=Math.PI+i*Math.PI/28,xx=cx+Math.cos(a)*(r+1.15),yy=cy+Math.sin(a)*(r+1.15);rsSink(xx,yy,curve.z,false,a+Math.PI/2);rsLamp(cx+Math.cos(a)*r,cy+Math.sin(a)*r,curve.z+2.93,1.4,false,.75);}for(const id of['G08','G09']){const s=RW.byId[id],x=(s.bounds[0]+s.bounds[2])/2,y=(s.bounds[1]+s.bounds[3])/2;RW.owner=id;rsBox(x-1.03,y,s.z+.48,.09,1.8,.09,4);rsBox(x-1.04,y+.23,s.z+.42,.11,.11,.21,10);rsSign(x-1.045,y-.6,s.z+1.45,'RISER 04',Math.PI/2);s.foldWitness={kind:'measurable-service-core',width:1.9,depth:2.4,curveLength:Math.PI*40};}}
 // The same distinctive drainage spine meets both incompatible reservoirs.
 // A thick wall and its maintenance return establish the assumed shared footprint.
 for(const id of['R05','R09']){const s=RW.byId[id],b=s.bounds,x=b[0]+.46,y=b[1]+(b[3]-b[1])*.45+5;RW.owner=id;rsBox(x,y,s.z,.64,4.8,s.h,20,true,true);rsBox(x+.39,y,s.z+.63,.12,4.0,.12,4);rsBox(x+.40,y-.72,s.z+.56,.15,.25,.27,10);rsBox(x+.405,y+.62,s.z+1.02,.04,.09,2.3,22);rsSign(x+.425,y-1.32,s.z+1.65,'DRAIN 06',Math.PI/2);s.foldWitness={kind:'shared-drain-spine',width:.64,length:4.8,repairBand:'ochre',via:'overlap-reservoirs'};}
 // Give the broad court an asymmetric actual island and offset structural line.
 const broad=RW.byId.V02;RW.owner=broad.id;rsBox(391,206,broad.z,5.5,8.0,.48,19,true,true);for(const[xx,yy]of[[366,187],[366,212],[392,187]])rsBox(xx,yy,broad.z,.9,.9,broad.h,19,true,true);
 // The dry ending returns to human scale. Its single ajar return is softly lit.
 const end=RW.byId.U10;RW.owner=end.id;rsBox(578.92,317.75,end.z,.12,.18,2.22,4);rsBox(578.92,320.45,end.z,.12,.18,2.22,4);rsBox(578.92,319.1,end.z+2.13,.12,2.86,.10,4);rsSign(578.985,320.95,end.z+1.65,'SERVICE',Math.PI/2);rsLamp(576,319.1,end.z+2.50,1.0,true,1.1);
}

// Static sector geometry shares coincident positions; this reduces mobile heap use
// without dropping rooms, fixtures, geometry or independently mutable door state.
function rsWeldVertices(){let count=0;for(const sector of Object.values(RW.sectors)){const vertices=new Map();for(const index of sector.faceIndices){const f=RW.faces[index];if(f.doorId)continue;for(let i=0;i<f.v.length;i++){const p=f.v[i],key=p.join(',');let q=vertices.get(key);if(!q){vertices.set(key,p);q=p;count++;}f.v[i]=q;}}}RW.vertexCount=count;}

// Matching vestibules also share a texture frame, so a height-changing fold does
// not advertise itself by suddenly moving the grout or flipping its tile rhythm.
function rsMatchFoldTextures(){for(const fold of RW.folds)for(const[end,sign]of[[fold.a,1],[fold.b,-1]])for(const id of end.via||[]){const sector=RW.sectors[id];if(!sector)continue;for(const index of sector.faceIndices){const f=RW.faces[index];if(f.doorId)continue;const v=f.v.map(p=>{const dx=p[0]-end.x,dy=p[1]-end.y;return[sign*(dx*end.nx+dy*end.ny),sign*(-dx*end.ny+dy*end.nx),p[2]-end.z];}),span=k=>Math.max(...v.map(p=>p[k]))-Math.min(...v.map(p=>p[k])),horizontal=span(2)<.002,along=span(0)>=span(1)?0:1;f.uv=v.map(p=>horizontal?[p[0]*.8,p[1]*.8]:[p[along]*.8,p[2]*.8]);f.localUV=true;}}}

// Segmented concrete pipework makes the concealed way out readable as plumbing.
// Curved overhead ribs follow the same physical rising floor as the player.
function rsDressSewer(){
 for(const id of RW.sewer.via){const s=RW.byId[id],b=s.bounds,horizontal=b[2]-b[0]>b[3]-b[1],lo=horizontal?b[0]:b[1],hi=horizontal?b[2]:b[3],cross=horizontal?(b[1]+b[3])/2:(b[0]+b[2])/2;
  RW.owner=id;const point=(along,t,outer=0)=>{const side=Math.cos(t)*(1.08+outer),x=horizontal?along:cross+side,y=horizontal?cross+side:along;return[x,y,rsFloor(s,x,y)+1.2+Math.sin(t)*(1.36+outer)];};
  const segments=Math.max(1,Math.ceil((hi-lo)/3.8));for(let k=0;k<segments;k++){const a=mix(lo,hi,k/segments),b=mix(lo,hi,(k+1)/segments);
   for(let j=0;j<12;j++){const t=j*Math.PI/12,u=(j+1)*Math.PI/12;rsQuad(point(a,t),point(b,t),point(b,u),point(a,u),20,{sewer:true});}
  }
  for(let a=lo+.4;a<hi-.2;a+=4.4)for(let j=0;j<12;j++){const t=j*Math.PI/12,u=(j+1)*Math.PI/12;rsQuad(point(a,t,-.025),point(a+.07,t,-.025),point(a+.07,u,-.025),point(a,u,-.025),4,{sewer:true});}
 }
 const s=RW.byId[RW.sewer.via[0]];rsEmitter(s,'flow',585.4,319.1,s.z+.15,.12,13);
 RW.owner='return-cubicle';rsSign(582.7,318.04,RS_B4+1.55,'DRAIN',0);
}
