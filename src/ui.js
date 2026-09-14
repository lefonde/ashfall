// ui.js — bundled from the owner’s liminal baseline.
// Guard the existing composition's DOM writes without caching game state.
// Read actual DOM values so other chapter writers still take precedence.
function hudWrite(id,key,value){const node=$(id),text=value==null?'':String(value);if(node[key]!==text)node[key]=text;}
function hudStyle(id,key,value){
 const node=$(id),text=String(value),cache=hudStyle.cache||(hudStyle.cache=new WeakMap());
 let values=cache.get(node);if(!values){values={};cache.set(node,values);}const last=values[key];
 if(last&&last.input===text&&last.output===node.style[key])return;
 if(node.style[key]!==text)node.style[key]=text;values[key]={input:text,output:node.style[key]};
}
let hudComposing=false;
// All chapter writers run synchronously inside one final HUD composition.
function hudUpdate(){
 if(hudComposing)return;
 hudComposing=true;
 try{
  const g=equippedItem();
  hudWrite('wardName','innerHTML',hwRunning()?'03 <b>THE HEART WARD</b>':fvRunning()?'02 <b>FEVER THEATRE</b>':chRunning()?'01 <b>ADMISSIONS</b>':'0'+(stage+1)+' <b>'+wardNames[stage]+'</b>');
  hudWrite('goal','textContent',hwRunning()?HW.objective:fvRunning()?FV.objective:chRunning()?CH.objective:(cleared?'SEAL BROKEN · REACH THE EXIT':'BREAK THE SEAL · '+Math.min(stageKills,quotas[stage])+' / '+quotas[stage]));
  hudWrite('life','textContent',Math.ceil(player.hp));hudStyle('lifeFill','width',clamp(player.hp,0,100)+'%');
  hudWrite('lifeHint','textContent',liminal.mix>.4?'':player.hp<25?'SIGNAL CRITICAL':'KILL TO RESTORE');
  hudStyle('life','color',player.hp<25?'#ff327c':'#f3f1cf');
  hudWrite('score','textContent',Math.round(score).toString().padStart(6,'0'));
  hudWrite('time','textContent',formatTime(gameTime)+'.'+Math.floor(gameTime%1*100).toString().padStart(2,'0'));
  hudWrite('ammo','textContent',reloadT>0?'—':g.ammo);hudWrite('reserve','textContent','/ '+g.reserve);
  hudWrite('weaponName','textContent',g.name);hudStyle('weaponName','color',g.color);
  for(let i=0;i<3;i++)$('slot'+i).classList.toggle('active',i===weapon);
  hudWrite('dashLabel','textContent',dashCD>0?'DASH '+dashCD.toFixed(1)+'s':coarse?'DASH READY':'[SPACE] DASH READY');
  const visible=1-clamp(liminal.mix*1.35,0,1);
  hudStyle('comboWrap','opacity',combo>1?visible:0);hudWrite('combo','textContent',combo+'×');
  hudWrite('comboText','textContent',combo>=10?'CATASTROPHIC':combo>=6?'UNSTOPPABLE':'KEEP FEEDING');
  hudStyle('comboTrack','width',(comboT/3.4*100)+'%');
  hudStyle('message','opacity',clamp(msgT*3,0,1)*visible);hudStyle('feed','opacity',clamp(feedT*2,0,1)*visible);
  // Narrative priority is deliberate: boss/finale guidance supersedes the old quest.
  if(review.active)reviewHud();
  fvHud();if(!cbRunning())hbHud();
  if(s4Running())s4Hud();
  s4dHud();s4tHud();cbHud();
  // Route selection owns navigation; the actual E/USE target owns the prompt.
  wfHud();hudInteractionHud();if(typeof tfHud==='function')tfHud();if(typeof rsHud==='function')rsHud();
 }finally{hudComposing=false;}
}

// The prompt follows the same priority and reach checks as the USE/E handlers.
function hudExitNear(){
 return mode==='playing'&&!s4Running()&&cleared&&!s4dLocked()&&!wfUncharted()&&
  !fvNearestUse()&&!wfBreakerNear()&&Math.hypot(player.x-exit.x,player.y-exit.y)<1.5;
}
function hudExteriorInteraction(){
 if(mode!=='playing'||!s4Running()||s4dLocked())return null;
 if(s4tNear())return {action:'LIFT THE WOUNDED SERAPHIM',touch:'LIFT',hint:coarse?'FIRE to throw · GUN to switch weapons.':'FIRE to throw · 1–3 for guns · 4 to hold it again.',color:'#efdb9e'};
 const q=s4qNearby();
 if(q){
  const hints={keys:'Spare keys for the ambulance.',ext:'Use it on the ambulance engine fire.',gate:'Opens the shortcut between parking and the bus road.',supply:'One use: first aid and ammunition.',
   wreck:S4Q.fire?(S4Q.ext?'Put out the engine fire, then use the spare keys.':'Find the extinguisher at the bus shelter.'):(S4Q.keys?'Clear nearby threats, then move the ambulance.':'Find the spare keys in Staff Car 04.')};
  return {action:q.label,touch:q.touch,hint:hints[q.kind]||'',color:'#b0e7d8'};
 }
 if(s4dWreckNear())return {action:'EXAMINE AMBULANCE',touch:'EXAMINE',hint:'The burning wreck blocks the garden path.',color:'#e4bc91'};
 const sign=s4NearbyLabel();
 return sign?{action:sign.interact,touch:'READ',hint:'Read the sign.',color:'#b0e7d8'}:null;
}
function hudInteractionHud(){
 if(mode!=='playing'||s4dLocked()||wfUncharted()){
  $('interactPrompt').classList.add('hidden');$('touchUse').classList.add('hidden');return;
 }
 let target=null;
 if(s4Running())target=hudExteriorInteraction();
 else if(hudExitNear())target={action:chRunning()?'LEAVE THROUGH SECURITY EXIT':fvRunning()?'ENTER THE AIRLOCK EXIT':'LEAVE THROUGH THE EXIT',touch:'EXIT',hint:'Continue through the open exit.',color:'#d5ff9e'};
 else return; // Admissions and theatre controls were already composed above.
 $('interactPrompt').classList.toggle('hidden',!target);$('touchUse').classList.toggle('hidden',!target);
 if(!target)return;
 hudWrite('interactAction','textContent',(coarse?'USE · ':'[E] ')+target.action);
 hudWrite('interactHint','textContent',target.hint);hudStyle('interactPrompt','borderColor',target.color);
 touchSetLabel('touchUse',target.touch);
}

function saveSettings(){try{localStorage.setItem('ashfall-settings-v2',JSON.stringify(settings));}catch{}audio.levels();document.body.classList.toggle('lowfx',settings.reduce);}
function syncSettings(){ $('musicVol').value=settings.music*100;$('sfxVol').value=settings.sfx*100;$('sensitivity').value=settings.sensitivity/.00003;$('shakeAmount').value=settings.shake*100;$('renderRes').value=Math.round((settings.res||1)*100);$('difficulty').value=String(clamp(Math.round(settings.difficulty),0,2)|0);applyDifficulty();$('reduceFx').checked=settings.reduce;$('showMap').checked=settings.map;$('muteAll').checked=settings.mute;document.body.classList.toggle('lowfx',settings.reduce);}
function openSettings(parent){menuParent=parent;hideOverlays();$('settings').classList.remove('hidden');mode='settings';syncSettings();}
function closeSettings(){saveSettings();hideOverlays();if(menuParent==='review'){mode='review';$('testWard').classList.remove('hidden');reviewSync();}else if(menuParent==='paused'){$('pause').classList.remove('hidden');mode='paused';}else{$('start').classList.remove('hidden');mode='menu';}}
$('musicVol').oninput=e=>{settings.music=+e.target.value/100;audio.levels();};$('sfxVol').oninput=e=>{settings.sfx=+e.target.value/100;audio.levels();};$('sensitivity').oninput=e=>settings.sensitivity=+e.target.value*.00003;$('shakeAmount').oninput=e=>settings.shake=+e.target.value/100;$('renderRes').oninput=e=>{settings.res=+e.target.value/100;resize();};$('difficulty').onchange=e=>{settings.difficulty=+e.target.value;applyDifficulty();saveSettings();};$('reduceFx').onchange=e=>{settings.reduce=e.target.checked;document.body.classList.toggle('lowfx',settings.reduce);};$('showMap').onchange=e=>settings.map=e.target.checked;$('muteAll').onchange=e=>{settings.mute=e.target.checked;audio.levels();};
$('startBtn').onclick=()=>{if(artReady)startRun();};$('resumeBtn').onclick=resumeGame;$('retryBtn').onclick=()=>{if(!review.active){if(HW.on&&HW.checkpoint){hwRestore();return;}if(FV.on&&FV.checkpoint){fvRestore();return;}if(CH.checkpoint){chRestore();return;}}startRun();};$('restartBtn').onclick=startRun;$('startSettings').onclick=()=>openSettings('menu');$('pauseSettings').onclick=()=>openSettings('paused');$('settingsBack').onclick=closeSettings;$('menuBtn').onclick=()=>{mode='menu';hideOverlays();$('start').classList.remove('hidden');$('hud').classList.add('hidden');$('touch').classList.add('hidden');$('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';audio.pause();loadStage(0);};
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>{settings.difficulty=+b.dataset.mode;applyDifficulty();saveSettings();};
addEventListener('keydown',e=>{if(!(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)||e.target?.isContentEditable)&&wfMapKey(e))return;if(e.code!=='Escape'&&(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)||e.target?.isContentEditable||(mode!=='playing'&&['BUTTON','SUMMARY'].includes(e.target?.tagName))))return;if(mode==='playing'&&['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(mode==='playing')pauseGame();else if(mode==='paused')resumeGame();else if(mode==='settings')closeSettings();else if(mode==='review')closeTestWard();return;}if(e.code==='KeyU'&&!e.repeat){settings.mute=!settings.mute;$('muteAll').checked=settings.mute;saveSettings();return;}if(mode==='menu'&&e.code==='Enter'&&artReady){startRun();return;}if(mode!=='playing')return;if(review.active&&!e.repeat){if(e.code==='KeyT'){openTestWard();return;}if(e.code==='KeyB'){reviewReset();return;}if(e.code==='KeyH'){reviewDamagePreview();return;}if(e.code==='KeyN'){reviewRepeatTargets();return;}}if(s4dLocked()){if(e.code==='Enter'){e.preventDefault();s4dSkip();}return;}keys[e.code]=true;if(e.repeat)return;if(e.code==='Digit1')changeWeapon(0);if(e.code==='Digit2')changeWeapon(1);if(e.code==='Digit3')changeWeapon(2);if(e.code==='Digit4')s4tEquip();if(e.code==='KeyR')reload();if(e.code==='KeyQ')melee();if(e.code==='Space'||e.code==='ShiftLeft'||e.code==='ShiftRight')dash();if(e.code==='Tab')mapHeld=true;if(e.code==='KeyE'){e.preventDefault();if((typeof rsInteract==='function'&&rsInteract())||s4Interact()||fvInteract()||chInteract())return;if(hudExitNear())completeWard();}});

