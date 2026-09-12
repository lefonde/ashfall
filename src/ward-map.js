// A quiet, paused hospital plan plus a local Tab peek. No enemy radar.
const WF_MAP={parent:'playing',w:0,h:0};
const WF_ROOM_LABELS={
 0:[[26.5,55,'RECEPTION',16],[10,40,'TRIAGE',9],[41,40,'WARD 2',13],[24,26,'NURSES',7],
    [17,27.4,'RECORDS',7],[32,21.4,'WARD 1',15],[49.5,15.5,'RISER',5],[44,7.5,'PLANT HALL',15]],
 1:[[17.5,24,'OR 1',10],[38.5,24,'OR 2',11],[38.5,40,'OR 3',11],[17.5,40,'RECOVERY',12],
    [27.5,32.5,'SPINE',6],[50.5,31,'STORE',6],[17,13.5,'NORTH RING',14],[8,55.5,'VESTIBULE',11]],
 2:[[27,56,'RECEPTION',15],[32.5,12,'HEART',16],[50.5,31,'RISER',6],[25,2.5,'MAIN ENTRANCE',17]],
 3:[[64,56,'HOSPITAL',27],[65,47,'COURTYARD',13],[94,71,'PARKING',22],[130,9,'BUS SHELTER',20],
    [25,47,'POND',24],[43,28,'GARDEN',13],[82,22,'CITY ROAD',17]]
};
function wfMapTitle(){return wfUncharted()?'UNCHARTED':s4Running()?'HOSPITAL GROUNDS':
 chRunning()?'ADMISSIONS':fvRunning()?'FEVER THEATRE':hwRunning()?'HEART WARD':wardNames[stage];}
function wfMapMarkers(){
 if(wfUncharted())return [];
 if(chRunning())return [{...WF_BREAKER,mark:'P',done:CH.power},{...exit,id:'security',label:'Security',mark:'X',locked:!CH.power}];
 if(fvRunning())return [...FV.valves.map((v,i)=>({x:v.x,y:v.y-1.38,id:v.id,mark:String(i+1),label:FV_SYSTEMS[v.id].name,done:v.closed})),
  {...FV_RECOVERY,mark:'+',label:'Recovery supply',done:FV.recoveryUsed,locked:!fvSystem('OR1')?.closed},
  {...exit,id:'airlock',mark:'X',label:'Exit airlock',locked:FV.closed<3}];
 return wfTargets().map(t=>({...t,mark:t.id==='exit'||t.id==='gate'?'X':'◇'}));
}
function wfMapBounds(local){
 if(local)return {x0:player.x-14,y0:player.y-14,x1:player.x+14,y1:player.y+14};
 if(s4Running()&&!wfUncharted())return {x0:0,y0:0,x1:144,y1:96};
 let x0=MW,y0=MH,x1=0,y1=0;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]===0&&(!wfUncharted()||WF.seen[y*MW+x])){
  x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);
 }
 if(x1<=x0)return {x0:player.x-8,y0:player.y-8,x1:player.x+8,y1:player.y+8};
 return {x0:x0-2,y0:y0-2,x1:x1+2,y1:y1+2};
}
function wfDrawMap(c,w,h,local=false){
 wfSync();const unknown=wfUncharted(),bounds=wfMapBounds(local),pad=local?7:24,
  scale=Math.min((w-pad*2)/(bounds.x1-bounds.x0),(h-pad*2)/(bounds.y1-bounds.y0)),
  ox=(w-(bounds.x1-bounds.x0)*scale)/2-bounds.x0*scale,
  oy=(h-(bounds.y1-bounds.y0)*scale)/2-bounds.y0*scale,
  X=x=>ox+x*scale,Y=y=>oy+y*scale;
 c.clearRect(0,0,w,h);c.fillStyle='#0d191e';c.fillRect(0,0,w,h);
 c.save();c.beginPath();c.rect(pad/2,pad/2,w-pad,h-pad);c.clip();
 if(s4Running()&&!unknown)wfGrid();
 for(let y=Math.max(0,Math.floor(bounds.y0));y<Math.min(MH,Math.ceil(bounds.y1));y++)
  for(let x=Math.max(0,Math.floor(bounds.x0));x<Math.min(MW,Math.ceil(bounds.x1));x++){
   const i=y*MW+x,seen=WF.seen[i];if(unknown&&!seen)continue;
   const floor=s4Running()?(unknown?!wall(x+.5,y+.5):!!WF.open?.[i]):map[y][x]===0;
   c.fillStyle=floor?(seen?'#3b5050':'#263b40'):s4Running()&&s4Pond(x+.5,y+.5)?'#193743':'#152329';
   c.fillRect(X(x),Y(y),scale+.35,scale+.35);
  }
 // Draw furniture as small solid footprints; openings read as actual openings.
 if(!s4Running())for(const p of furniture){
  if(unknown&&!WF.seen[(p.y|0)*MW+(p.x|0)])continue;
  c.save();c.translate(X(p.x),Y(p.y));c.rotate(p.a);c.fillStyle='#14272a';
  c.fillRect(-p.hx*scale,-p.hy*scale,p.hx*2*scale,p.hy*2*scale);c.restore();
 }
 const target=wfTarget(),route=wfRoute(target);
 if(route.length>1){
  c.strokeStyle='#aeb98780';c.lineWidth=local?1.5:2;c.setLineDash(local?[2,3]:[4,5]);c.beginPath();
  c.moveTo(X(player.x),Y(player.y));for(const p of route)c.lineTo(X(p.x),Y(p.y));c.stroke();c.setLineDash([]);
 }
 if(!local&&!unknown&&useChapter){
  for(const [x,y,text,space] of WF_ROOM_LABELS[stage]||[]){
   c.font='600 '+clamp(scale*1.65,10,13)+'px Arial, "DejaVu Sans", sans-serif';
   if(c.measureText(text).width>space*scale)continue;
   c.textAlign='center';c.textBaseline='middle';
   const tw=c.measureText(text).width;
   c.fillStyle='#102027dd';c.fillRect(X(x)-tw/2-3,Y(y)-8,tw+6,16);
   c.fillStyle='#bac9c1';c.fillText(text,X(x),Y(y));
  }
 }
 for(const p of wfMapMarkers()){
  const x=X(p.x),y=Y(p.y);if(x<pad/2||x>w-pad/2||y<pad/2||y>h-pad/2)continue;
  const selected=p.id===target?.id,r=local?4:8;
  c.fillStyle=p.done?'#587166':p.locked?'#895e64':selected?'#d8c98d':'#839a90';
  c.fillRect(x-r,y-r,r*2,r*2);
  if(!local){c.fillStyle='#102028';c.font='bold 11px Arial, "DejaVu Sans", sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(p.done?'✓':p.mark,x,y+.5);}
  if(selected){c.strokeStyle='#e5d7a4';c.lineWidth=1;c.strokeRect(x-r-3,y-r-3,r*2+6,r*2+6);}
 }
 // True north stays fixed. Only this player arrow rotates.
 c.save();c.translate(X(player.x),Y(player.y));c.rotate(player.a);c.fillStyle='#fff5d6';c.strokeStyle='#0b1a20';c.lineWidth=2;
 c.beginPath();c.moveTo(local?7:10,0);c.lineTo(local?-5:-7,local?-4:-6);c.lineTo(local?-2:-3,0);c.lineTo(local?-5:-7,local?4:6);c.closePath();c.stroke();c.fill();c.restore();c.restore();
 c.textAlign='right';c.font='600 '+(local?10:12)+'px Arial, "DejaVu Sans", sans-serif';c.fillStyle='#a4b8b1';c.fillText('N ↑',w-12,local?17:20);
 if(local){c.textAlign='left';c.font='9px Arial, "DejaVu Sans", sans-serif';c.fillText('M · FULL MAP',8,h-8);}
}
function wfMapOptions(){
 const list=$('wfDestinations');list.replaceChildren();
 for(const t of wfTargets()){
  const button=document.createElement('button');button.type='button';button.textContent=t.label;
  button.dataset.target=t.id;button.setAttribute('aria-pressed',String(WF.selected===t.id));
  button.onclick=()=>{WF.selected=t.id;WF.field=null;wfRefreshMap();
   const selected=Array.from(list.children).find(b=>b.dataset.target===t.id);selected?.focus();};list.append(button);
 }
}
function wfRefreshMap(){
 wfSync();wfTarget();
 $('wfMapTitle').textContent=wfMapTitle();
 $('wfMapObjective').textContent=wfUncharted()?'This space is missing from the hospital plan. Only the area you have explored is shown.':
  chRunning()?CH.objective:fvRunning()?FV.objective:hwRunning()?HW.objective:$('goal').textContent;
 $('wfMapNote').textContent=wfUncharted()?'Explore to reveal the local layout.':fvRunning()?'Choose a destination below. Complete the three systems in any order.':
  wfTargets().length>1?'Choose which destination to follow.':wfTargets().length?'Follow the marked route. Rooms off the route are still yours to explore.':'Use the room names and your heading to get your bearings.';
 const w=Math.max(250,Math.min(1050,innerWidth-48)),h=Math.max(220,Math.min(640,innerHeight-265));
 WF_MAP.w=w;WF_MAP.h=h;const canvas=$('wfLargeMap');canvas.width=w;canvas.height=h;
 wfDrawMap(canvas.getContext('2d'),w,h);wfMapOptions();
}
function wfOpenMap(){
 if(mode!=='playing'&&mode!=='paused')return;
 WF_MAP.parent=mode;if(mode==='playing')pauseGame();
 hideOverlays();mode='map';$('mapPanel').classList.remove('hidden');
 $('map').classList.add('hidden');wfRefreshMap();$('wfMapClose').focus();
}
function wfCloseMap(){
 if(mode!=='map')return;
 hideOverlays();releaseInputs();
 if(WF_MAP.parent==='paused'){mode='paused';$('pause').classList.remove('hidden');$('resumeBtn').focus();}
 else{resumeGame();canvas.focus();hudUpdate();}
}
function wfMapKey(e){
 if(e.code==='KeyM'&&(e.ctrlKey||e.metaKey||e.altKey))return false;
 if(e.code==='KeyM'&&(mode==='playing'||mode==='paused'||mode==='map')){
  e.preventDefault();if(!e.repeat){if(mode==='map')wfCloseMap();else wfOpenMap();}return true;
 }
 if(mode!=='map')return false;
 if(e.code==='Escape'){e.preventDefault();wfCloseMap();}
 // Keep keyboard focus in the map without stealing normal navigation keys.
 if(e.code==='Tab'){
  const buttons=[$('wfMapClose'),...$('wfDestinations').children],first=buttons[0],last=buttons[buttons.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
 return true;
}
function wfRenderCorner(){
 const show=mode==='playing'&&(mapHeld||settings.map)&&!s4dLocked();
 $('map').classList.toggle('hidden',!show);if(show)wfDrawMap(mapCtx,150,150,true);
}
$('wfMapClose').onclick=wfCloseMap;$('touchMap').onclick=wfOpenMap;$('pauseMap').onclick=wfOpenMap;
addEventListener('resize',()=>{if(mode==='map')wfRefreshMap();});

