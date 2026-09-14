// The deep drain is a real alternate campaign arrival. It bypasses the wreck
// from its garden side; parking and bus actors retain their native quest state.
const RS_SEWER_OUT={x:51.7,y:39.5,a:-Math.PI/2,mouthY:38.6};
const RS_SEWER_PATH=[[54.7,33.8],[51.7,33.8],[51.7,39.8]];
function rsSewerOpen(){return !!rsState().sewerOpen;}
function rsSewerCanSave(){return !review.active&&rsSewerOpen()&&s4qRunning()&&CB.on&&CB.state==='waiting'&&Math.hypot(player.x-RS_SEWER_OUT.x,player.y-RS_SEWER_OUT.y)<.1;}
function rsSewerTryExit(){
 const s=RS.active,e=RW.exit;if(!s||!e||e.return!=='sewer-grounds'||Math.abs(s.z-e.z)>.3||!rsPolyHas(e.poly,player.x,player.y))return false;
 return rsSewerExit();
}
function rsSewerExit(){
 if(!rsRunning()||!RS.active.committed)return false;
 const e=RW.exit;if(!e||Math.abs(RS.active.z-e.z)>.3||!rsPolyHas(e.poly,player.x,player.y))return false;
 const carry=s4dCapture();rsState().complete=rsState().sewerOpen=true;
 // Restore and release the parked host without awarding a second Heart ending.
 rsLeave(false,true);rsSewerArrive(carry);
 if(typeof rsSaveCheckpoint==='function')rsSaveCheckpoint('sewer-arrival');
 return true;
}
function rsSewerArrive(carry,{restore=false}={}){
 rsState().complete=rsState().sewerOpen=true;audio.reset();useChapter=true;loadStage(3);s4dCarry(carry);
 Object.assign(S4D,{on:true,carry:{...carry,ammo:carry.ammo.map(a=>({...a})),mods:{...carry.mods}},phase:'aftermath',door:0,wave:2,spawned:31,safeT:1.8});
 // Construct the actual quest, including the twelve still-living branch actors.
 // The sewer has already reached the far side of the blocked garden entrance;
 // there is no reason to repeat an ambulance crash the player never witnessed.
 s4qBegin();Object.assign(S4Q,{moved:true,gate:true,done:true,fire:false,checkpointLabel:'SEWER OUTFALL'});
 S4D.crashed=false;S4D.vehicle={...S4Q_PARKED};s4qApplyGate();s4qApplyVehicle();
 reviewPlace(RS_SEWER_OUT.x,RS_SEWER_OUT.y,RS_SEWER_OUT.a);S4.entry=S4D.carry;
 mode='playing';hideOverlays();document.body.classList.add('playing');$('hud').classList.remove('hidden');$('touch').classList.remove('hidden');
 // Native pre-boss Journey owns retry, creature state, supplies and resources.
 cbfJourneyBegin();rsSewerApplyExteriorGate();msgT=feedT=0;audio.start();audio.exteriorMix();hudUpdate();
 return true;
}
function rsSewerFace(points,tex=-1,color=[50,60,54],extra={}){return Object.assign(s4Quad(points,tex,color),{sewer:true},extra);}
function rsSewerBuildExterior(){
 const x=RS_SEWER_OUT.x,y=RS_SEWER_OUT.mouthY,back=41.15,inner=1.13,outer=1.43,cz=1.12;
 // Forest-edge billboards may extend several metres beyond their solid roots.
 // Keep this small service spur visible wherever its physical path is clear.
 S4.flora=S4.flora.filter(p=>Math.hypot(p.x-x,p.y-y)>12||s4PathDistance(p.x,p.y,RS_SEWER_PATH)>1.35+(p.w||0)*.5);
 const ring=(a,r,yy)=>[x+Math.cos(a)*r,yy,cz+Math.sin(a)*r];
 // A concrete culvert set into the bank. Its bottom is cut level for walking.
 for(let i=0;i<20;i++){const a=-Math.PI*.24+i*Math.PI*1.48/20,b=-Math.PI*.24+(i+1)*Math.PI*1.48/20;
  rsSewerFace([ring(a,inner,y),ring(b,inner,y),ring(b,outer,y),ring(a,outer,y)],4,[73,78,67]);
  rsSewerFace([ring(a,inner,y),ring(a,inner,back),ring(b,inner,back),ring(b,inner,y)],4,[39,48,43]);
  rsSewerFace([ring(a,outer,y),ring(b,outer,y),ring(b,outer,back),ring(a,outer,back)],4,[54,60,50]);
 }
 // The back is only the hidden bend below the bank; returning inside cannot
 // teleport the player back into the one-way restroom chapter.
 rsSewerFace([[x-1.13,back,0],[x+1.13,back,0],[x+1.13,back,2.4],[x-1.13,back,2.4]],-1,[5,9,8]);
 S4.solids.push({x0:x-1.5,x1:x-1.1,y0:y,y1:back,kind:'sewer-wall'},{x0:x+1.1,x1:x+1.5,y0:y,y1:back,kind:'sewer-wall'},{x0:x-1.5,x1:x+1.5,y0:back-.05,y1:back+.25,kind:'sewer-back'});
 rsSewerFace([[x-1.07,y,.015],[x+1.07,y,.015],[x+1.07,back,.015],[x-1.07,back,.015]],4,[48,61,53]);
 s4Label(x,y-.04,2.28,'',2,{front:[0,-1],interact:'EXAMINE THE OUTFALL',read:rsSewerOpen()?'THE HINGES ARE OPEN. COLD AIR COMES UP FROM BELOW.':'RUSTED BARS. THE RELEASE IS ON THE OTHER SIDE.',sewer:true});
 rsSewerApplyExteriorGate();
 // Grounds culling is normally finalized by the original builder; these new
 // faces get the same bounds because they are appended after that pass.
 for(const f of S4.faces.filter(f=>f.sewer)){const xs=f.points.map(p=>p[0]),ys=f.points.map(p=>p[1]);f.cx=(Math.min(...xs)+Math.max(...xs))/2;f.cy=(Math.min(...ys)+Math.max(...ys))/2;f.radius=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))/2;}
}
function rsSewerApplyExteriorGate(){
 if(!S4.on)return;S4.faces=S4.faces.filter(f=>!f.sewerGate);S4.solids=S4.solids.filter(b=>b.kind!=='sewer-gate');
 const x=RS_SEWER_OUT.x,y=RS_SEWER_OUT.mouthY,open=rsSewerOpen();
 for(let i=-4;i<=4;i++){const xx=x+i*.23,yy=open?y-.95+i*.22:y,zTop=1.12+Math.sqrt(Math.max(0,1.13**2-(i*.23)**2));
  const a=open?[x-1.09,yy,.04]:[xx-.025,yy,.04],b=open?[x-1.035,yy,.04]:[xx+.025,yy,.04];
  rsSewerFace([a,b,[b[0],b[1],zTop],[a[0],a[1],zTop]],7,[41,49,43],{sewerGate:true});
 }
 if(!open)S4.solids.push({x0:x-1.1,x1:x+1.1,y0:y-.25,y1:y+.25,kind:'sewer-gate'});
 for(const l of S4.labels.filter(l=>l.sewer))l.read=open?'THE HINGES ARE OPEN. COLD AIR COMES UP FROM BELOW.':'RUSTED BARS. THE RELEASE IS ON THE OTHER SIDE.';
}
const rsSewerClearing=s4Clearing;s4Clearing=function(x,y){return s4PathDistance(x,y,RS_SEWER_PATH)<1.4||rsSewerClearing(x,y);};
const rsSewerGround=s4GroundType;s4GroundType=function(x,y){return !s4Pond(x,y)&&s4PathDistance(x,y,RS_SEWER_PATH)<.85?1:rsSewerGround(x,y);};
const rsSewerGrounds=s4BuildGrounds;s4BuildGrounds=function(...args){const result=rsSewerGrounds(...args);rsSewerBuildExterior();return result;};
// Carry the earned hatch through both the normal expedition retry and the
// Cerberus Journey retry. Test scenes use their separate RS.test flag.
const rsSewerDepartureSave=s4dSave;s4dSave=function(...args){const result=rsSewerDepartureSave(...args);if(S4D.checkpoint)S4D.checkpoint.sewerOpen=rsSewerOpen();return result;};
const rsSewerDepartureRestore=s4dRestore;s4dRestore=function(...args){const c=S4D.checkpoint;if(c?.sewerOpen)rsState().complete=rsState().sewerOpen=true;const result=rsSewerDepartureRestore(...args);if(result)rsSewerApplyExteriorGate();return result;};

// The sewer route did not witness the crash. Reconstructing its native Journey
// must not introduce flattened hedges and crash damage on a later death retry.
let rsSewerRestoringJourney=false;
const rsSewerPlaceWreck=s4dPlaceWreck;s4dPlaceWreck=function(...args){if(rsSewerRestoringJourney){S4D.crashed=false;S4D.vehicle={...S4Q_PARKED};return;}return rsSewerPlaceWreck(...args);};
const rsSewerRestoreWithoutCrash=s4dRestore;s4dRestore=function(...args){rsSewerRestoringJourney=!!S4D.checkpoint?.sewerOpen;try{return rsSewerRestoreWithoutCrash(...args);}finally{rsSewerRestoringJourney=false;}};
