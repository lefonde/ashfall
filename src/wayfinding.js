// R4-P07: stable destinations, traversable routes, and deliberate hospital use.
// Navigation ignores creatures. It never owns quest state or changes collision.
const WF_BREAKER={x:56.86,y:9,id:'mains',label:'Plant Hall',nx:-1,ny:0};
const WF={map:null,key:'',open:null,edges:null,field:null,targetKey:'',selected:'',path:[],
 seen:null,cell:-1,at:-1,navTarget:'',navArrow:'',routeBuilds:0,gridBuilds:0,wasUncharted:false};
function wfUncharted(){return !!(CH.maze||CH.tr||liminal.mode||hgInside());}
function wfTopologyKey(){return [stage,useChapter,CH.power,FV.closed,FV.returnOpen,
 HW.resolved,HB.state,S4Q.moved,S4Q.gate,CB.rewarded,S4D.phase].join('|');}
function wfFree(x,y,r=.21){return !wall(x-r,y-r)&&!wall(x+r,y-r)&&
 !wall(x-r,y+r)&&!wall(x+r,y+r)&&furnitureFree(x,y,r);}
function wfClear(a,b){
 const steps=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.y-b.y)*5));
 for(let i=1;i<=steps;i++)if(!wfFree(mix(a.x,b.x,i/steps),mix(a.y,b.y,i/steps)))return false;
 return true;
}
function wfSync(){
 const key=wfTopologyKey();
 if(WF.map!==map){
  WF.map=map;WF.key='';WF.selected='';WF.seen=new Uint8Array(MW*MH);WF.cell=-1;
 }
 if(WF.key!==key){
  WF.key=key;WF.open=null;WF.edges=null;WF.field=null;WF.targetKey='';WF.path=[];WF.at=-1;
 }
 // Discover the local footprint, not enemies and not the solution to a liminal space.
 const cell=(player.y|0)*MW+(player.x|0),uncharted=wfUncharted();
 if(uncharted!==WF.wasUncharted){WF.wasUncharted=uncharted;WF.seen.fill(0);WF.cell=-1;WF.path=[];WF.field=null;}
 if(cell!==WF.cell){
  WF.cell=cell;
  for(let y=Math.max(0,(player.y|0)-6);y<Math.min(MH,(player.y|0)+7);y++)
   for(let x=Math.max(0,(player.x|0)-6);x<Math.min(MW,(player.x|0)+7);x++)
    if(Math.hypot(x+.5-player.x,y+.5-player.y)<7&&lineOfSight(player.x,player.y,x+.5,y+.5))WF.seen[y*MW+x]=1;
 }
}
function wfTargets(){
 if(wfUncharted()||s4dLocked())return [];
 if(chRunning())return [CH.power?{...exit,id:'security',label:'Security exit'}:{...WF_BREAKER}];
 if(fvRunning()){
  if(FV.closed>=3)return [{...exit,id:'airlock',label:'Airlock exit'}];
  return FV.valves.filter(v=>!v.closed&&!(v.id==='OR3'&&FV.purgeT>0))
   .map(v=>({x:v.x,y:v.y-1.38,id:v.id,label:{OR1:'OR 1 · Power',OR2:'OR 2 · Vent',OR3:'OR 3 · Purge'}[v.id]}));
 }
 if(hwRunning())return HW.resolved?[{...exit,id:'exit',label:'Main entrance'}]:
  HB.state==='dormant'?[{x:32.5,y:11.5,id:'heart',label:'Heart chamber'}]:[];
 if(s4Running()){
  if(cbRunning()&&!CB.rewarded)return []; // Let the encounter and the toy's light speak.
  if(CB.rewarded)return [{x:43,y:18.8,id:'gate',label:'Garden gates'}];
  if(s4qRunning()){
   if(S4Q.moved)return [{x:43,y:30,id:'garden',label:'Garden gates'}];
   if(S4Q.keys&&S4Q.ext)return [{x:61.5,y:43,id:'wreck',label:'Ambulance'}];
   return [...(!S4Q.keys?[{...S4Q_KEYS,id:'keys',label:'Parking · Staff 04'}]:[]),
    ...(!S4Q.ext?[{...S4Q_EXT,id:'ext',label:'Bus shelter'}]:[])];
  }
  return [];
 }
 return cleared?[{...exit,id:'exit',label:'Exit'}]:[];
}
function wfTarget(){
 const list=wfTargets();
 let target=list.find(t=>t.id===WF.selected);
 if(!target){target=list[0]||null;WF.selected=target?.id||'';WF.field=null;WF.targetKey='';}
 return target;
}
function wfGrid(){
 if(WF.open)return;
 WF.open=new Uint8Array(MW*MH);WF.gridBuilds++;
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)
  if((s4Running()||map[y]?.[x]===0)&&wfFree(x+.5,y+.5))WF.open[y*MW+x]=1;
 WF.edges=new Uint8Array(MW*MH);
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
  const i=y*MW+x;if(!WF.open[i])continue;
  if(WF.open[i+1]&&wfFree(x+1,y+.5)){WF.edges[i]|=2;WF.edges[i+1]|=1;}
  if(WF.open[i+MW]&&wfFree(x+.5,y+1)){WF.edges[i]|=8;WF.edges[i+MW]|=4;}
 }
}
function wfNearestCell(p,requireVisible=false){
 let best=-1,dist=Infinity;
 for(let y=Math.max(1,(p.y|0)-3);y<Math.min(MH-1,(p.y|0)+4);y++)
  for(let x=Math.max(1,(p.x|0)-3);x<Math.min(MW-1,(p.x|0)+4);x++){
   const n=y*MW+x,d=Math.hypot(x+.5-p.x,y+.5-p.y);
   if(WF.open[n]&&d<dist&&(!requireVisible||lineOfSight(x+.5,y+.5,p.x,p.y))){best=n;dist=d;}
  }
 return best;
}
function wfRoute(target=wfTarget()){
 if(!target||wfUncharted()){WF.path=[];return [];}
 wfGrid();
 const targetKey=target.id+':'+target.x+','+target.y;
 if(WF.targetKey!==targetKey||!WF.field){
  WF.targetKey=targetKey;WF.field=new Int16Array(MW*MH);WF.field.fill(-1);WF.at=-1;
  const goal=wfNearestCell(target,true),queue=new Int32Array(MW*MH);let head=0,tail=0;
  if(goal>=0){queue[tail++]=goal;WF.field[goal]=0;}
  while(head<tail){
   const i=queue[head++],x=i%MW,y=(i/MW)|0;
   for(const [n,bit] of [[i-1,1],[i+1,2],[i-MW,4],[i+MW,8]])
    if((WF.edges[i]&bit)&&WF.field[n]<0){WF.field[n]=WF.field[i]+1;queue[tail++]=n;}
  }
  WF.routeBuilds++;
 }
 const cell=wfNearestCell(player,true);
 if(WF.at===cell)return WF.path;
 WF.at=cell;WF.path=[];if(cell<0||WF.field[cell]<0)return WF.path;
 let i=cell;
 for(let count=0;count<MW*MH;count++){
  WF.path.push({x:i%MW+.5,y:((i/MW)|0)+.5});
  if(WF.field[i]===0)break;
  const next=[[i-1,1],[i+1,2],[i-MW,4],[i+MW,8]].find(([n,bit])=>(WF.edges[i]&bit)&&WF.field[n]===WF.field[i]-1)?.[0];
  if(next===undefined)break;i=next;
 }
 return WF.path;
}
function wfBearing(target){
 if(!target)return null;
 const d=Math.hypot(target.x-player.x,target.y-player.y);
 if(d<2.7&&lineOfSight(player.x,player.y,target.x,target.y))return {near:true,point:target};
 const route=wfRoute(target);let point=null;
 for(let i=0;i<Math.min(route.length,9);i++){
  if(wfClear(player,route[i]))point=route[i];else break;
 }
 if(!point||Math.hypot(point.x-player.x,point.y-player.y)<.2)return null;
 return {point,angle:angle(Math.atan2(point.y-player.y,point.x-player.x)-player.a)};
}
function wfBreakerNear(){
 return chRunning()&&!wfUncharted()&&mode==='playing'&&
  Math.hypot(player.x-WF_BREAKER.x,player.y-WF_BREAKER.y)<2.4&&
  Math.abs(angle(Math.atan2(WF_BREAKER.y-player.y,WF_BREAKER.x-player.x)-player.a))<.8&&
  lineOfSight(player.x,player.y,WF_BREAKER.x,WF_BREAKER.y);
}
function chInteract(){
 if(!wfBreakerNear())return false;
 if(CH.power){feed('MAINS ONLINE / SECURITY DOOR RELEASED');return true;}
 chRestorePower();wfSync();hudUpdate();return true;
}
// A small angular dead band stops direction labels chattering at a threshold.
function wfDirection(target,bearing){
 const previous=WF.navTarget===target?.id?WF.navArrow:'';
 let symbol='·';
 if(bearing?.near)symbol='◇';
 else if(bearing){
  const a=bearing.angle,abs=Math.abs(a);
  if(previous==='↶'&&abs>2.37)symbol='↶';
  else if(abs>2.53)symbol='↶';
  else if(previous==='↑'&&abs<.46)symbol='↑';
  else if(previous==='‹'&&a<-.30&&a>-2.53)symbol='‹';
  else if(previous==='›'&&a>.30&&a<2.53)symbol='›';
  else symbol=abs>2.45?'↶':a<-.38?'‹':a>.38?'›':'↑';
 }
 WF.navTarget=target?.id||'';WF.navArrow=symbol;return symbol;
}
function wfHud(){
 if(typeof rsRunning==='function'&&rsRunning())return;
 wfSync();const target=wfTarget(),bearing=mode==='playing'?wfBearing(target):null;
 const arrow=$('compassArrow'),label=$('compassText');
 arrow.style.transform='none';arrow.style.visibility='visible';
 $('compass').classList.toggle('hidden',!target||mode!=='playing'||wfUncharted());
 if(target){
  arrow.textContent=wfDirection(target,bearing);
  label.textContent=target.label;
  const hint={'·':'FOLLOW SIGNS','◇':'NEARBY','↶':'TURN AROUND','‹':'TURN LEFT','›':'TURN RIGHT','↑':'AHEAD'}[arrow.textContent];
  $('compass').setAttribute('aria-label',target.label+': '+hint.toLowerCase());
  $('wfNavHint').textContent=hint;
 }
 if(!target){WF.navTarget='';WF.navArrow='';}
 if(chRunning()&&!wfUncharted()){
  $('fvStatus').classList.remove('hidden');
  $('fvStatus').textContent=CH.power?'Service return is open. Leave through Security.':'Ward 1 → Service Riser → Plant Hall';
  const near=wfBreakerNear();$('interactPrompt').classList.toggle('hidden',!near);$('touchUse').classList.toggle('hidden',!near);
  if(near){
   $('interactAction').textContent=CH.power?'MAINS · ONLINE':(coarse?'USE · ':'[E] ')+'RESTORE MAINS POWER';
   $('interactHint').textContent=CH.power?'Security is unlocked. Take the service return.':'Releases the Security door and opens the service return.';
   $('interactPrompt').style.borderColor='#bbab7b';touchSetLabel('touchUse',CH.power?'ONLINE':'POWER');
  }
 }
 if(fvRunning()){
  const parts=['OR1','OR2','OR3'].map((id,i)=>(fvSystem(id)?.closed?'✓ ':'○ ')+['Power','Vent','Purge'][i]);
  $('wfSystems').textContent=parts.join('   ');
 }else $('wfSystems').textContent='';
 $('wfSystems').classList.toggle('hidden',!fvRunning());
}

