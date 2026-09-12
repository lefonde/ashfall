// Listening round four and the post-credits creature gallery. Campaign playback
// is owned by a separate module; this room never resumes the game AudioContext.
const CREATURE_GALLERY=(()=>{
 const definitions={
  unstitched:{name:'The Unstitched',sprite:0,role:'Broken body · close pursuit',artLabel:'The Unstitched, a gaunt bandaged monster with an enormous tooth-filled maw',a:'Dry rasp',b:'Wet suction'},
  runner:{name:'Spine Runner',sprite:1,role:'Fleshy predator · fast pursuit',artLabel:'Spine Runner, a fleshy quadruped with a wide tooth-filled mouth',chosen:'b',description:'Ragged snarl'},
  orderly:{name:'The Orderly',sprite:2,role:'Heavy body · close-range threat',artLabel:'The Orderly, a large butcher-like monster',chosen:'a',description:'Deep throat'},
  warden:{name:'The Warden',sprite:3,role:'A presence that should not be here',artLabel:'The Warden, a hollow-faced apparition with long hands and a dissolving hospital smock',chosen:'existing',description:'Existing breathing approved'},
  heart:{name:'The Heart',role:'The living core of the ward',artLabel:'The living neon heart from the final hospital chamber',chosen:{idle:'b',attack:'a'},bank:'round3',description:{idle:'Straining chamber · breath',attack:'Wet valves · attack'}},
  shepherd:{name:'Cerberus · Shepherd',head:'shepherd',role:'The central head · projectile salvo',artLabel:'Cerberus with its German Shepherd, Bulldog and Chihuahua heads; the Shepherd is highlighted',chosen:'a',bank:'round2',description:'Canine snarl'},
  bulldog:{name:'Cerberus · Bulldog',head:'bulldog',role:'The heavy head · charged beam',artLabel:'Cerberus with its German Shepherd, Bulldog and Chihuahua heads; the Bulldog is highlighted',chosen:'a',bank:'round2',description:'Nasal pressure'},
  chihuahua:{name:'Cerberus · Chihuahua',head:'chihuahua',role:'The little head · a terrible temper',artLabel:'Cerberus with its German Shepherd, Bulldog and Chihuahua heads; the Chihuahua is highlighted',chosen:'b',bank:'round2',description:'Ragged yap'}
 };
 const panel=$('creatureAudition'),creditsPanel=$('cgCreditsOverlay');
 const playButtons=[...panel.querySelectorAll('[data-cs-voice]')];
 const overlayIds=['start','pause','settings','upgrade','end','testWard','mapPanel','creatureAudition','cgCreditsOverlay','hud','touch'];
 const unlockKey='ashfall-creature-gallery-v1',nextTakes={},cutouts=new WeakMap();
 let earned=false,unlocked=false;
 try{const saved=JSON.parse(localStorage.getItem(unlockKey)||'null');earned=saved?.earned===true;unlocked=earned&&saved?.opened===true;}catch{}
 let context=null,output=null,source=null,generation=0,artTimer=0,artTries=0;
 let galleryReturn=null,creditsReturn=null,reviewMode=false,species='unstitched',event='idle';
 const buffers={},decoding={};
 const isOpen=()=>mode==='audition'&&!panel.classList.contains('hidden');
 const creditsOpen=()=>mode==='credits'&&!creditsPanel.classList.contains('hidden');
 const activePanel=()=>isOpen()?panel:creditsOpen()?creditsPanel:null;
 const status=text=>{$('csStatus').textContent=text;};
 const silent=()=>settings.mute||!(settings.sfx>0);
 const eventLabel=()=>event==='attack'?'attack':species==='chihuahua'?'idle / mutter':species==='heart'?'pressure / breath':'breath';
 function persist(){try{localStorage.setItem(unlockKey,JSON.stringify({earned,opened:unlocked}));}catch{}}
 function show(el,visible){el.hidden=!visible;el.classList.toggle('hidden',!visible);}
 function applyLevel(){if(output)output.gain.value=settings.mute?0:Math.max(0,Math.min(1,Number(settings.sfx)||0))*.86;}
 function clearPlaying(){for(const button of playButtons){button.classList.remove('is-playing');button.querySelector('.cs-play-word').textContent='PLAY';}}
 function stop(message,shouldSuspend=true){
  generation++;
  if(source){const old=source;source=null;old.onended=null;try{old.stop();}catch{}try{old.disconnect();}catch{}}
  clearPlaying();
  if(shouldSuspend&&context&&context.state!=='closed')context.suspend().catch(()=>{});
  if(message)status(message);
 }
 function getContext(){
  if(context&&context.state!=='closed')return context;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)throw Error('Audio playback is not supported in this browser.');
  context=new AC();output=context.createGain();output.connect(context.destination);applyLevel();
  for(const key of Object.keys(buffers))delete buffers[key];
  for(const key of Object.keys(decoding))delete decoding[key];
  return context;
 }
 function getBuffer(bank){
  if(buffers[bank])return Promise.resolve(buffers[bank]);
  if(decoding[bank])return decoding[bank];
  // AudioBuffers are reusable between contexts (as in the existing preview).
  // Warden's three breaths should not decode a second copy of the full FX bank.
  const prepared=bank==='fx'?audio.bank:bank==='chosen'?audio.approvedBank:bank==='round2'?audio.approvedCerberusBank:bank==='round3'?audio.approvedHeartBank:null;
  if(prepared){buffers[bank]=prepared;return Promise.resolve(prepared);}
  const ctx=context;
  decoding[bank]=Promise.resolve().then(()=>{
   const url=bank==='chosen'?CREATURE_AUDITION_DATA:bank==='round2'?CREATURE_ROUND2_DATA:bank==='round3'?CREATURE_ROUND3_DATA:AUDIO_DATA.fx;
   return loadAudioAsset(url,ctx);
  }).then(result=>{if(context===ctx)buffers[bank]=result;return result;}).catch(error=>{if(context===ctx)delete decoding[bank];throw error;});
  return decoding[bank];
 }
 function playbackChoice(direction){
  const definition=definitions[species];
  if(definition.chosen){
   if(direction!=='selected')return null;
   if(species==='warden')return event==='idle'?{direction:'existing',bank:'fx',cues:AUDIO_CUES,key:'breath',count:3,rate:.7,label:'Existing breathing approved'}:null;
   const bank=definition.bank||'chosen',selected=typeof definition.chosen==='string'?definition.chosen:definition.chosen[event];
   if(!selected)return null;
   return{direction:selected,bank,prefix:bank==='round3'?'cr3_':bank==='round2'?'cr_':'ca_',cues:bank==='round3'?CREATURE_ROUND3_CUES:bank==='round2'?CREATURE_ROUND2_CUES:CREATURE_AUDITION_CUES,count:2,rate:1,label:'Chosen voice'};
  }
  if(!reviewMode||species!=='unstitched'||!['a','b'].includes(direction))return null;
  return{direction,bank:'round3',prefix:'cr3_',cues:CREATURE_ROUND3_CUES,count:2,rate:1,label:'Direction '+direction.toUpperCase()};
 }
 async function play(direction){
  if(!isOpen())return false;
  const choice=playbackChoice(direction);if(!choice)return false;
  stop(null,false);
  const token=generation,bag=species+'_'+choice.direction+'_'+event,take=nextTakes[bag]||0;
  const cue=choice.cues[choice.key?choice.key+take:choice.prefix+bag+take];
  if(!cue){stop('This take is unavailable. Please try another performance.');return false;}
  const label=choice.label+' · '+eventLabel()+' · take '+(take+1)+'/'+choice.count;
  status('Preparing '+label.toLowerCase()+'…');
  try{
   const ctx=getContext(),resumed=ctx.resume();
   const [decoded]=await Promise.all([getBuffer(choice.bank),resumed]);
   if(token!==generation||!isOpen())return false;
   if(ctx.state!=='running')throw Error('Audio playback is paused by the browser.');
   if(!Number.isFinite(cue.start)||!Number.isFinite(cue.duration)||cue.start<0||cue.duration<=0||cue.start+cue.duration>decoded.duration+.05)throw Error('The selected take could not be read.');
   applyLevel();
   const playing=ctx.createBufferSource();source=playing;playing.buffer=decoded;playing.playbackRate.value=choice.rate;playing.connect(output);
   playing.onended=()=>{
    if(source!==playing)return;
    source=null;try{playing.disconnect();}catch{}clearPlaying();
    if(token===generation&&isOpen())status('Finished · '+label+(silent()?' · audio muted':''));
    ctx.suspend().catch(()=>{});
   };
   playing.start(ctx.currentTime+.09,cue.start,cue.duration);nextTakes[bag]=(take+1)%choice.count;
   const button=playButtons.find(item=>item.dataset.csVoice===direction);
   if(button){button.classList.add('is-playing');button.querySelector('.cs-play-word').textContent='PLAYING';}
   status(label+(silent()?(settings.mute?' · muted; press U to unmute':' · Effects volume is zero'):' · playing'));
   return true;
  }catch(error){if(token===generation&&isOpen()){stop(null);status('Could not play this take. Try again, or reopen the file.');}return false;}
 }
 function keyedImage(art){
  if(!art||!art.data||!art.w||!art.h)return null;
  if(cutouts.has(art))return cutouts.get(art);
  const c=document.createElement('canvas');c.width=art.w;c.height=art.h;
  const g=c.getContext('2d'),pixels=g.createImageData(art.w,art.h);
  pixels.data.set(art.data);g.putImageData(pixels,0,0);cutouts.set(art,c);return c;
 }
 function drawCerberus(g,canvas,selected){
  const bodyArt=CB_ART.body[0],body=keyedImage(bodyArt);
  const heads=['shepherd','bulldog','chihuahua'].map(kind=>({kind,image:keyedImage(CB_ART.heads[kind]?.[0])}));
  if(!body||heads.some(head=>!head.image))return false;
  const scale=Math.min((canvas.height-38)/2.55,(canvas.width-38)/2.8),baseY=canvas.height-15,bodyH=1.6;
  const crop=CB_BODY_CROPS[0],bodyW=bodyH*(crop[2]-crop[0])/(crop[3]-crop[1]);
  g.drawImage(body,canvas.width/2-bodyW*scale/2,baseY-bodyH*scale,bodyW*scale,bodyH*scale);
  for(let i=0;i<heads.length;i++){
   const {kind,image}=heads[i],socket=CB_SOCKET_PIXELS[0][i],height=kind==='shepherd'?1.08:kind==='bulldog'?.83:.71;
   const sv=(socket[1]-crop[1])/(crop[3]-crop[1]),across=((socket[0]-crop[0])/(crop[2]-crop[0])-.5)*bodyW;
   const base=bodyH*(1-sv)-.18+(kind==='shepherd'?.04:kind==='chihuahua'?.03:0),w=height*image.width/image.height;
   g.save();g.globalAlpha=kind===selected?1:.76;
   if(kind===selected){g.shadowColor='#b7e1d3';g.shadowBlur=7;}
   g.drawImage(image,canvas.width/2+(across-w/2)*scale,baseY-(base+height)*scale,w*scale,height*scale);g.restore();
  }
  return true;
 }
 function drawArt(){
  clearTimeout(artTimer);artTimer=0;if(!isOpen())return;
  const definition=definitions[species],canvas=$('csArtwork'),g=canvas.getContext('2d');
  g.clearRect(0,0,canvas.width,canvas.height);g.imageSmoothingEnabled=species!=='warden';
  let ready=false;
  if(definition.head)ready=drawCerberus(g,canvas,definition.head);
  else{
   const sprite=definition.sprite===undefined?null:monsterSprites[definition.sprite];
   const art=species==='heart'?horrorHeartCanvas:sprite?.image;
   if(art&&art.width&&art.height){
    const aspect=sprite?.aspect||art.width/art.height,height=Math.min(canvas.height-32,(canvas.width-48)/aspect),width=height*aspect;
    g.drawImage(art,(canvas.width-width)/2,canvas.height-height-12,width,height);ready=true;
   }
  }
  show($('csArtStatus'),!ready);
  if(!ready){$('csArtStatus').textContent=artTries>=60?'Artwork unavailable. Audio is still available.':'Preparing creature artwork…';if(artTries++<60)artTimer=setTimeout(drawArt,250);}
 }
 function prompt(){
  if(!definitions[species].chosen&&!reviewMode)return 'Voice selection pending.';
  if(settings.mute)return 'Audio is muted. Press U to unmute, then choose a voice.';
  if(!(settings.sfx>0))return 'Effects volume is zero. Raise it in Options before listening.';
  if(species==='warden')return 'Play the existing breathing. Click again to hear all three takes.';
  return definitions[species].chosen?'Play the chosen voice.':'Choose a direction to listen.';
 }
 function updateCreature(){
  const definition=definitions[species],approved=!!definition.chosen,pending=!approved&&!reviewMode,warden=species==='warden';
  if(warden){event='idle';$('csEvent').value=event;}
  const attackOption=$('csEvent').querySelector('option[value="attack"]');if(attackOption)attackOption.disabled=warden;
  $('csCreatureName').textContent=definition.name.toUpperCase();$('csCreatureRole').textContent=definition.role;
  $('csArtwork').setAttribute('aria-label',definition.artLabel);
  $('csDescriptionSelected').textContent=(typeof definition.description==='string'?definition.description:definition.description?.[event])||'Approved performance';
  $('csDescriptionA').textContent=definition.a||'First sound direction';$('csDescriptionB').textContent=definition.b||'Second sound direction';
  const idleOption=$('csEvent').querySelector('option[value="idle"]');
  if(idleOption)idleOption.textContent=species==='chihuahua'?'Idle / mutter':species==='heart'?'Pressure / breath':'Breath';
  $('csApproval').textContent=warden?'Existing breathing approved. The same three takes remain in the game; this creature has no attack voice.':approved?(reviewMode?'Your chosen breath and attack are installed in the game. Both takes are retained.':'Chosen breath and attack.'):pending?'Voice selection pending. The creature artwork is available to explore.':'Compare A and B for both breath and attack. These candidates await listening approval.';
  show($('csPlaySelected'),approved);show($('csPlayA'),!approved&&!pending&&!warden);show($('csPlayB'),!approved&&!pending&&!warden);
  $('csEvent').disabled=pending||warden;$('csStop').disabled=pending;
  show($('csQuestions'),reviewMode&&!approved&&!warden);
  show($('csMethod'),!pending);
  $('csMethod').textContent=warden?'Click again to cycle through the three existing takes. Uses your Effects + voices volume.':approved?'Click again for the second take. Uses your Effects + voices volume.':'Click again for the second take. Levels are matched for comparison. Uses your Effects + voices volume.';
  status(prompt());artTries=0;drawArt();
 }
 function capture(){
  if(mode==='playing')pauseGame();
  const state={mode,focus:document.activeElement,visibility:{}};
  for(const id of overlayIds){const el=$(id);if(el)state.visibility[id]={hidden:el.hidden,cls:el.classList.contains('hidden')};}
  return state;
 }
 function hideForModal(){
  releaseInputs();audio.pause();document.exitPointerLock?.();document.body.classList.remove('playing');hideOverlays();
  for(const id of ['creatureAudition','cgCreditsOverlay','hud','touch'])$(id).classList.add('hidden');
 }
 function restore(state,fallback){
  if(!state)return;
  hideOverlays();panel.classList.add('hidden');creditsPanel.classList.add('hidden');mode=state.mode;
  for(const [id,visibility]of Object.entries(state.visibility)){const el=$(id);if(el){el.hidden=visibility.hidden;el.classList.toggle('hidden',visibility.cls);}}
  // No automatic resume: captured gameplay is converted to a paused parent.
  (state.focus&&state.focus.isConnected?state.focus:$(fallback))?.focus();
 }
 function open(options={}){
  if(isOpen())return true;
  const owner=CREATURE_REVIEW_MODE===true&&!options.approvedOnly;
  if(!owner&&(!earned||!unlocked))return false;
  galleryReturn=capture();reviewMode=owner;stop(null);hideForModal();mode='audition';show(panel,true);
  species=reviewMode?'unstitched':'orderly';event='idle';$('csCreature').value=species;$('csEvent').value=event;
  $('csKicker').textContent=reviewMode?'ASHFALL / LISTENING REVIEW 04':'ASHFALL / AFTER THE CREDITS';
  $('csTitle').textContent=reviewMode?'CREATURE VOICES':'CREATURE GALLERY';
  $('csIntro').textContent=reviewMode?'The Heart now uses your chosen breath and attack. Visit the Warden to review its ghostly appearance. The Unstitched is the remaining voice comparison.':'Meet the creatures of Ashfall. Listen to their chosen performances, one creature at a time.';
  updateCreature();$('csCreature').focus();return true;
 }
 function close(){
  if(isOpen()){stop(null);clearTimeout(artTimer);artTimer=0;const back=galleryReturn;galleryReturn=null;restore(back,'startBtn');return true;}
  if(creditsOpen()){stop(null);const back=creditsReturn;creditsReturn=null;restore(back,'menuBtn');return true;}
  return false;
 }
 const optionsCredits=[...document.querySelectorAll('#settings details.audioCredits')].find(el=>!el.classList.contains('mvPreview'));
 const optionsFooter=document.createElement('div');optionsFooter.id='cgOptionsGallery';
 const optionsButton=document.createElement('button');optionsButton.type='button';optionsButton.className='secondary';optionsButton.textContent='CREATURE GALLERY';
 optionsFooter.append(optionsButton);if(optionsCredits)optionsCredits.append(optionsFooter);
 optionsButton.onclick=()=>unlocked?open({approvedOnly:true}):openCredits();
 const endButton=document.createElement('button');endButton.id='cgEndCredits';endButton.type='button';endButton.className='secondary';endButton.textContent='CREDITS';
 const endHost=$('end')?.querySelector('.smallPanel');if(endHost)endHost.append(endButton);show(endButton,false);
 function syncUnlock(){show(optionsFooter,earned);optionsButton.textContent=unlocked?'CREATURE GALLERY':'CREDITS + CREATURE GALLERY';}
 function prepareCredits(){
  const body=$('cgCreditsBody');body.replaceChildren();
  const addHeading=text=>{const h=document.createElement('h3');h.textContent=text;body.append(h);};
  if(optionsCredits){
   addHeading('Audio and recordings');
   for(const child of [...optionsCredits.children])if(child.tagName!=='SUMMARY'&&child!==optionsFooter)body.append(child.cloneNode(true));
  }
  if($('csCredits').children.length){addHeading('Creature recording credits');for(const child of [...$('csCredits').children])body.append(child.cloneNode(true));}
 }
 function openCredits(){
  if(!earned)return false;if(creditsOpen())return true;if(isOpen())close();if(creditsOpen())return true;
  creditsReturn=capture();stop(null);hideForModal();mode='credits';prepareCredits();show(creditsPanel,true);creditsPanel.scrollTop=0;
  $('cgCreditsBack').focus();return true;
 }
 endButton.onclick=()=>{if(mode==='won'&&CB.completed&&!review.active)openCredits();};
 $('cgCreditsBack').onclick=close;
 $('cgCreditsGallery').onclick=()=>{if(!creditsOpen()||!earned)return;unlocked=true;persist();syncUnlock();open({approvedOnly:true});};
 // Only actual campaign completion earns the bonus. The Heart's apparent
 // ending and owner test-scene completion must not unlock it.
 const previousFinish=finish;
 finish=function(...args){show(endButton,false);return previousFinish.apply(this,args);};
 const previousComplete=cbfComplete;
 cbfComplete=function(...args){
  const completed=previousComplete.apply(this,args);
  if(completed&&!review.active){earned=true;persist();show(endButton,true);syncUnlock();}
  return completed;
 };
 $('csCreature').onchange=()=>{const next=$('csCreature').value;if(!definitions[next])return;stop(null);species=next;updateCreature();};
 $('csEvent').onchange=()=>{const next=$('csEvent').value;if(!['idle','attack'].includes(next)||(species==='warden'&&next!=='idle')){$('csEvent').value=event;return;}stop(null);event=next;updateCreature();};
 for(const button of playButtons)button.onclick=()=>play(button.dataset.csVoice);
 $('csStop').onclick=()=>stop('Stopped. '+prompt());$('csBack').onclick=close;
 if(CREATURE_REVIEW_MODE)for(const id of ['csOpenMain','csOpenPause'])if($(id))$(id).onclick=()=>open();
 function focusable(active){return [...active.querySelectorAll('button:not([disabled]),select:not([disabled]),input,a[href],summary,[tabindex="0"]')].filter(el=>!el.hidden&&el.getClientRects().length);}
 addEventListener('keydown',e=>{
  const active=activePanel();if(!active)return;e.stopImmediatePropagation();
  if(e.code==='Escape'){e.preventDefault();close();return;}
  if(e.code==='Tab'){
   const choices=focusable(active),first=choices[0],last=choices[choices.length-1];
   if(!first){e.preventDefault();return;}
   if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus();}
  }
  if(e.code==='KeyU'&&!e.repeat&&!['INPUT','TEXTAREA'].includes(e.target?.tagName)&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
   e.preventDefault();settings.mute=!settings.mute;$('muteAll').checked=settings.mute;saveSettings();applyLevel();
   if(isOpen())status(settings.mute?'Audio muted. Press U to unmute.':source?'Audio unmuted. Playing.':prompt());
  }
 },true);
 document.addEventListener('focusin',e=>{const active=activePanel();if(active&&!active.contains(e.target))$(isOpen()?'csBack':'cgCreditsBack').focus();});
 addEventListener('blur',()=>{if(isOpen())stop('Playback stopped while this window was inactive.');});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&isOpen())stop('Playback stopped while this tab was hidden.');});
 addEventListener('pagehide',()=>stop(null));
 syncUnlock();
 if(CREATURE_REVIEW_MODE){
  for(const id of ['startTest','pauseTest'])if($(id))$(id).textContent='GAME REVIEW';
  if($('reviewPanelBtn')){$('reviewPanelBtn').textContent='T · REVIEW';$('reviewPanelBtn').setAttribute('aria-label','Open game review controls');}
 }
 document.title='ASHFALL // NEON WARD — '+(CREATURE_REVIEW_MODE?'Creature Review ':'Beta ')+BUILD.version;
 $('buildLabel').textContent=BUILD.version+' / '+(CREATURE_REVIEW_MODE?'CREATURE REVIEW 04':'BETA');
 if($('betaPauseVersion'))$('betaPauseVersion').textContent=BUILD.version+' · '+(CREATURE_REVIEW_MODE?'CREATURE REVIEW 04':'SIGNAL HELD');
 return{open,close,stop,play,openCredits};
})();