// input.js — bundled from the owner’s liminal baseline.
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='KeyF')s4tReleaseTrigger();if(e.code==='Tab')mapHeld=false;});
let hadLock=false;
document.addEventListener('pointerlockchange',()=>{const locked=document.pointerLockElement===canvas;if(hadLock&&!locked&&mode==='playing')pauseGame();hadLock=locked;});
addEventListener('mousemove',e=>{if(mode!=='playing'||coarse||s4dLocked())return;if(document.pointerLockElement===canvas||mouseFire){player.a+=e.movementX*settings.sensitivity;lookDelta+=e.movementX;if(!settings.reduce)aimPitch=clamp(aimPitch-e.movementY*.09,-H*.1,H*.1);}});
canvas.addEventListener('mousedown',e=>{if(mode!=='playing'||coarse||s4dLocked())return;if(e.button===0){mouseFire=true;shoot();if(document.pointerLockElement!==canvas)lockPointer();}if(e.button===2){e.preventDefault();melee();}});
addEventListener('mouseup',e=>{if(e.button===0){mouseFire=false;s4tReleaseTrigger();}});canvas.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('wheel',e=>{if(mode!=='playing')return;e.preventDefault();changeWeapon(weapon+(e.deltaY>0?1:-1));},{passive:false});
addEventListener('blur',()=>{releaseInputs();if(mode==='playing')pauseGame();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing')pauseGame();});
const stick=$('stick');let stickId=null;
stick.addEventListener('pointerdown',e=>{if(mode!=='playing')return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);handleStick(e);});
function handleStick(e){if(e.pointerId!==stickId||s4dLocked())return;const r=stick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,l=Math.max(42,Math.hypot(x,y));touchMove.x=x/l;touchMove.y=y/l;$('stickKnob').style.transform='translate('+touchMove.x*36+'px,'+touchMove.y*36+'px)';}
stick.addEventListener('pointermove',handleStick);for(const event of['pointerup','pointercancel'])stick.addEventListener(event,e=>{if(e.pointerId===stickId){stickId=null;touchMove.x=touchMove.y=0;$('stickKnob').style.transform='';}});
canvas.addEventListener('pointerdown',e=>{if(mode!=='playing'||e.pointerType==='mouse'||s4dLocked())return;e.preventDefault();touchLook.id=e.pointerId;touchLook.x=e.clientX;touchLook.y=e.clientY;canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(mode!=='playing'||e.pointerId!==touchLook.id||s4dLocked())return;const dx=e.clientX-touchLook.x,dy=e.clientY-touchLook.y;player.a+=dx*.006;lookDelta+=dx;if(!settings.reduce)aimPitch=clamp(aimPitch-dy*.12,-H*.08,H*.08);touchLook.x=e.clientX;touchLook.y=e.clientY;});for(const event of['pointerup','pointercancel'])canvas.addEventListener(event,e=>{if(touchLook.id===e.pointerId)touchLook.id=null;});
$('touchFire').addEventListener('pointerdown',e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);if(!s4dLocked()){mouseFire=true;shoot();}});for(const event of['pointerup','pointercancel'])$('touchFire').addEventListener(event,()=>{mouseFire=false;s4tReleaseTrigger();});$('touchDash').onpointerdown=e=>{e.preventDefault();dash();};$('touchGun').onpointerdown=e=>{e.preventDefault();changeWeapon(weapon+1);};$('touchPause').onclick=pauseGame;$('touchUse').onclick=()=>s4Interact()||fvInteract()||chInteract();


