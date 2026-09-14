// Pointer ownership keeps move, aim and fire independent during multitouch.
function touchSetLabel(id,text){
 const el=$(id);if(!el)return;
 const label=el.querySelector('.touchLabel')||el;
 if(label.textContent!==text)label.textContent=text;
}
function touchCapture(el,id){try{el.setPointerCapture(id);}catch{}}
function touchDevice(e){
 if(e.pointerType==='touch'&&!coarse){coarse=true;document.body.classList.add('touch-device');queueViewportResize();}
}
const RS_VIEW_PITCH_LIMIT=88*Math.PI/180;
function rsAimProjection(){return Number.isFinite(projection)&&projection>0?projection:W/(2*Math.tan(.7));}
function rsClampViewPitch(value=aimPitch){const p=rsAimProjection();return Math.tan(clamp(Math.atan((Number.isFinite(value)?value:0)/p),-RS_VIEW_PITCH_LIMIT,RS_VIEW_PITCH_LIMIT))*p;}
function rsLookVertical(radians){const p=rsAimProjection(),current=Math.atan(aimPitch/p);aimPitch=Math.tan(clamp(current+radians,-RS_VIEW_PITCH_LIMIT,RS_VIEW_PITCH_LIMIT))*p;}
function touchAim(dx,dy){
 // Same sensitivity slider on mouse and touch; normalize across screen sizes.
 const scale=clamp(844/(gameViewport.width||innerWidth||844),.65,1.4);
 player.a+=dx*settings.sensitivity*2.65*scale;lookDelta+=dx;
 if(typeof rsRunning==='function'&&rsRunning())rsLookVertical(-dy*settings.sensitivity*2.65*scale);else if(!settings.reduce)aimPitch=clamp(aimPitch-dy*.12,-H*.08,H*.08);
}
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyF')s4tReleaseTrigger();if(e.code==='Tab')mapHeld=false;});
let hadLock=false;
document.addEventListener('pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;if(hadLock&&!locked&&mode==='playing')pauseGame();hadLock=locked;});
addEventListener('mousemove',e=>{if(mode!=='playing'||coarse||s4dLocked())return;if(document.pointerLockElement===canvas||mouseFire){player.a+=e.movementX*settings.sensitivity;lookDelta+=e.movementX;if(typeof rsRunning==='function'&&rsRunning())rsLookVertical(-e.movementY*settings.sensitivity);else if(!settings.reduce)aimPitch=clamp(aimPitch-e.movementY*.09,-H*.1,H*.1);}});
canvas.addEventListener('mousedown',e=>{if(mode!=='playing'||coarse||s4dLocked())return;if(e.button===0){mouseFire=true;shoot();if(document.pointerLockElement!==canvas)lockPointer();}if(e.button===2){e.preventDefault();melee();}});
addEventListener('mouseup',e=>{if(e.button===0&&touchFireId===null){mouseFire=false;s4tReleaseTrigger();}});
addEventListener('wheel',e=>{if(mode!=='playing')return;e.preventDefault();changeWeapon(weapon+(e.deltaY>0?1:-1));},{passive:false});
addEventListener('blur',()=>{releaseInputs();if(mode==='playing')pauseGame();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseInputs();if(mode==='playing')pauseGame();}});
const stick=$('stick');let stickId=null,touchFireId=null,touchFireLook=null;
stick.addEventListener('pointerdown',e=>{
 if(mode!=='playing'||s4dLocked()||stickId!==null)return;
 e.preventDefault();touchDevice(e);stickId=e.pointerId;touchCapture(stick,e.pointerId);stick.classList.add('is-pressed');handleStick(e);
});
function handleStick(e){
 if(mode!=='playing'||e.pointerId!==stickId||s4dLocked())return;
 const r=stick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
 const radius=Math.max(20,r.width*.34),distance=Math.hypot(x,y),dead=radius*.1;
 const strength=clamp((distance-dead)/(radius-dead),0,1);
 touchMove.x=distance?x/distance*strength:0;touchMove.y=distance?y/distance*strength:0;
 $('stickKnob').style.transform='translate('+touchMove.x*radius+'px,'+touchMove.y*radius+'px)';
}
stick.addEventListener('pointermove',handleStick);
for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,e=>{
 if(e.pointerId===stickId){stickId=null;touchMove.x=touchMove.y=0;$('stickKnob').style.transform='';stick.classList.remove('is-pressed');}
});
canvas.addEventListener('pointerdown',e=>{
 if(mode!=='playing'||e.pointerType==='mouse'||s4dLocked()||touchLook.id!==null)return;
 e.preventDefault();touchDevice(e);touchLook.id=e.pointerId;touchLook.x=e.clientX;touchLook.y=e.clientY;touchCapture(canvas,e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
 if(mode!=='playing'||e.pointerId!==touchLook.id||s4dLocked())return;
 touchAim(e.clientX-touchLook.x,e.clientY-touchLook.y);touchLook.x=e.clientX;touchLook.y=e.clientY;
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(touchLook.id===e.pointerId)touchLook.id=null;});
const fireButton=$('touchFire');
fireButton.addEventListener('pointerdown',e=>{
 if(mode!=='playing'||s4dLocked()||touchFireId!==null)return;
 e.preventDefault();touchDevice(e);touchFireId=e.pointerId;touchFireLook={x:e.clientX,y:e.clientY};
 touchCapture(fireButton,e.pointerId);fireButton.classList.add('is-pressed');mouseFire=true;shoot();
});
fireButton.addEventListener('pointermove',e=>{
 if(e.pointerId!==touchFireId||!touchFireLook||mode!=='playing'||s4dLocked())return;
 if(touchLook.id===null)touchAim(e.clientX-touchFireLook.x,e.clientY-touchFireLook.y);
 touchFireLook.x=e.clientX;touchFireLook.y=e.clientY;
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])fireButton.addEventListener(event,e=>{
 if(e.pointerId!==touchFireId)return;
 touchFireId=null;touchFireLook=null;mouseFire=false;s4tReleaseTrigger();fireButton.classList.remove('is-pressed');
});
function touchAction(id,action,allowLocked=false){
 const el=$(id);if(!el)return;
 el.addEventListener('pointerdown',e=>{
  if(mode!=='playing'||(!allowLocked&&s4dLocked())||el.disabled)return;
  e.preventDefault();touchDevice(e);touchCapture(el,e.pointerId);el.classList.add('is-pressed');action();
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>el.classList.remove('is-pressed'));
 // Keyboard/screen-reader activation remains usable; suppress synthetic clicks.
 el.onclick=e=>{if(e.detail===0&&mode==='playing'&&(allowLocked||!s4dLocked())&&!el.disabled)action();};
}
touchAction('touchDash',dash);
touchAction('touchGun',()=>changeWeapon(weapon+1));
touchAction('touchReload',reload);
touchAction('touchMelee',melee);
touchAction('touchUse',()=>{if((typeof rsInteract==='function'&&rsInteract())||s4Interact()||fvInteract()||chInteract())return;if(hudExitNear())completeWard();});
touchAction('touchMap',()=>wfOpenMap());
touchAction('touchPause',pauseGame,true);
function playingSurface(target){
 return mode==='playing'&&target instanceof Element&&!!target.closest('#game,#touch,#hud');
}
// Block page gestures only on the game. Menus, sliders and feedback stay native.
for(const type of ['contextmenu','selectstart','dragstart'])document.addEventListener(type,e=>{
 if(playingSurface(e.target))e.preventDefault();
},{capture:true});
for(const type of ['touchstart','touchmove','gesturestart','gesturechange','gestureend'])document.addEventListener(type,e=>{
 if(playingSurface(e.target)&&e.cancelable)e.preventDefault();
},{capture:true,passive:false});
const fullscreenButton=$('touchFullscreen');
if(fullscreenButton&&document.documentElement.requestFullscreen&&document.fullscreenEnabled){
 fullscreenButton.hidden=false;fullscreenButton.classList.remove('hidden');
 fullscreenButton.onclick=async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
  catch{fullscreenButton.textContent='FULLSCREEN UNAVAILABLE';}
  queueViewportResize();
 };
 document.addEventListener('fullscreenchange',()=>{
  fullscreenButton.textContent=document.fullscreenElement?'EXIT FULLSCREEN':'FULLSCREEN';fullscreenButton.setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');releaseInputs();queueViewportResize();
 });
}
