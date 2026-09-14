// Distribution shell. Campaign/renderer/audio units precede this file. No telemetry, uploads, remote assets or new combat rules.
(function betaShell(){
 document.body.classList.add('beta');
 document.title='ASHFALL // NEON WARD — Beta '+BUILD.version;
 $('buildLabel').textContent='BETA '+BUILD.version;
 $('betaPauseVersion').textContent='BETA '+BUILD.version+' · SIGNAL HELD';
 DIFFICULTIES[1].note='The intended starting difficulty.';applyDifficulty();
 Object.assign(review,{active:false,preset:'normal',ai:true,damage:true,unlimited:false,music:true,holdBoss:false});
 // Retain required DOM and engine hooks; remove all player-facing review entry.
 openTestWard=()=>false;
 for(const id of ['startTest','pauseTest','reviewPanelBtn']){
  $(id).onclick=null;$(id).setAttribute('hidden','');$(id).setAttribute('aria-hidden','true');$(id).setAttribute('tabindex','-1');
 }
 $('testWard').setAttribute('inert','');$('testWard').setAttribute('aria-hidden','true');
 function report(){
  const browser=typeof navigator==='undefined'?'Please enter browser and version':navigator.userAgent;
  return [
   'ASHFALL // NEON WARD — BETA '+BUILD.version,
   'Browser: '+browser,
   'Window: '+innerWidth+' × '+innerHeight,
   'Visible viewport: '+gameViewport.width+' × '+gameViewport.height,
   'Touch controls: '+(coarse?'yes':'no'),
   'Chapter: '+(typeof rsRunning==='function'&&rsRunning()?'Lower Restrooms / '+RS.active.room+' / height '+RS.active.z.toFixed(2):(stage+1)+' / '+(s4Running()?'No Way Out':wardNames[stage]||'Menu')),
   'Objective: '+$('goal').textContent,
   'Position: '+player.x.toFixed(2)+', '+player.y.toFixed(2),
   'Run time: '+formatTime(gameTime),
   'Difficulty: '+DIFFICULTIES[difficulty].name,
   'Life: '+Math.ceil(player.hp)+' / Weapon: '+equippedItem().name,
   'Display: '+Math.round((settings.res||1)*100)+'% / Reduced effects: '+(settings.reduce?'on':'off'),
   'Audio: '+(settings.mute?'muted':'on')+' / Music '+Math.round(settings.music*100)+' / Effects '+Math.round(settings.sfx*100),
   '',
   'What happened:',
   '',
   'What I expected:',
   '',
   'Steps to repeat it:',
   '',
   'Screenshot or short clip:',
   '',
   'Most enjoyable moment / most confusing moment:',
   ''
  ].join('\n');
 }
 for(const prefix of ['pause','end']){
  const details=$('beta'+prefix+'Feedback'),field=$('beta'+prefix+'Report'),status=$('beta'+prefix+'Status');
  details.addEventListener('toggle',()=>{if(details.open){field.value=report();status.textContent='Copy these details and add your notes when you send feedback.';}});
  $('beta'+prefix+'Copy').onclick=async()=>{
   field.value=report();
   try{
    if(typeof navigator==='undefined'||!navigator.clipboard?.writeText)throw Error('clipboard unavailable');
    await navigator.clipboard.writeText(field.value);status.textContent='Copied. Paste it into your message and add your notes.';
   }catch{
    field.focus();field.select?.();status.textContent='Text selected. Use Copy in your browser or press Ctrl/Cmd+C.';
   }
  };
 }
 // A finished beta starts a fresh campaign; deaths retain the approved retry.
 const retry=$('retryBtn').onclick;
 $('retryBtn').onclick=()=>mode==='won'&&CB.completed?startRun():retry();
 const complete=cbfComplete;
 cbfComplete=function(){const result=complete();if(result)$('retryBtn').textContent='NEW RUN';return result;};
})();

