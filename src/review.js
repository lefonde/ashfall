// R2-P01: isolated review sessions. Campaign tuning stays in the original modules.
const review={active:false,scene:'chapter',selected:'chapter',returnTo:'menu',preset:'explore',ai:false,damage:false,
 unlimited:true,music:false,holdBoss:false,bloodAttacks:true,health:100,loadout:0,entered:false,done:false,hudClock:0};
const reviewScenes={
 ch_mains:{label:'Admissions — mains breaker',level:0,chapter:true,at:'mains',hint:'The labelled physical breaker. Walk up and look at it, then press E or touch POWER. Proximity alone does not switch it on. Check its new state, the Security return route and the saved checkpoint.'},
 chapter:{label:'Admissions chapter',level:0,chapter:true,at:'start',hint:'The authored first chapter from its opening. Objective is shown in the HUD.'},
 ch_triage:{label:'Encounter A — triage bays',level:0,chapter:true,at:'triage',hint:'The cramped first fight. Enable combat AI. B or N repeats this scene.'},
 ch_reception:{label:'Encounter B — reception hall',level:0,chapter:true,at:'reception',hint:'The open second fight with power restored. Enable combat AI. B or N repeats this scene.'},
 ch_gate:{label:'The annexe — the crossing',level:0,chapter:true,at:'gate',hint:'Power already on, ward emptied. The dark corridor is just east of you. Walk the spiral and see where it puts you.'},
 ch_maze:{label:'The annexe — inside',level:0,chapter:true,at:'maze',hint:'Already through, standing where the corridor let you out. Follow the machines that are still running. B resets.'},
 ch_after:{label:'The annexe — after',level:0,chapter:true,at:'after',hint:'The ward as it is once you have been and come back. Walk the staff route south, then look into Ward 1.'},
 ch_transfer:{label:'The Transfer',level:0,chapter:true,at:'transfer',hint:'In the doorway of W-04, an ordinary patient room on the ward corridor. Walk in.'},
 fever_ch:{label:'Level 2 — Fever Theatre',level:1,chapter:true,hint:'Infected hospital tile, acid neon fissures and bone growth; compare OR 1, OR 2 and OR 3. Choose the order: power, spine ventilation, timed purge. Look at a panel and press E. Explore is protected; Combat drill adds active enemies without damage.'},
 fv_spine:{label:'The sterile spine',level:1,chapter:true,at:'spine',hint:'South end of the spine, looking north. The Orderly is on station in the middle. Enable combat AI, then try the corridor and try the ring.'},
 fv_or1:{label:'OR 1 — blackout and recovery',level:1,chapter:true,at:'or1',hint:'Look at the power panel. E cuts the lights and restores the supply in Recovery. Prepare an escape before the patients wake.'},
 fv_or3:{label:'OR 3 — purge and return route',level:1,chapter:true,at:'or3',hint:'E starts a 12-second purge. Move freely as the room wakes in stages. Then inspect the new return through the south end of the store.'},
 fv_recovery:{label:'Recovery — emergency supply',level:1,chapter:true,at:'recovery',hint:'Power already diverted from OR 1. E opens the supply once: life, reserve ammo and a checkpoint. This room starts empty; pursuers can follow.'},
 fv_or2:{label:'OR 2 — suppress the spine',level:1,chapter:true,at:'or2',hint:'E vents the spine for 20 seconds. The Orderly cannot move or attack during the window. Decide whether to use this early or save it for your return. The room wakes when ventilation stops.'},
 fv_ring:{label:'The sterile store — the way round',level:1,chapter:true,at:'ring',hint:'On the eastern bypass between OR 2 and OR 3. Long, dim, and it never touches the spine.'},
 fv_end:{label:'Fever Theatre — loop isolated',level:1,chapter:true,at:'end',hint:'All three valves already closed, the suite dark, the airlock released. Walk south and leave.'},
 heart_ch:{label:'Level 3 — Heart Ward',level:2,chapter:true,hint:'The hospital returns consumed by flesh and bone. Follow its arterial corridors to the living core. Explore keeps you protected.'},
 hw_spine:{label:'The wrong corridor',level:2,chapter:true,at:'spine',hint:'At the south end of the sterile spine, now invaded by ribs and arteries. The rooms hanging off it are W-01 to W-06.'},
 hw_rooms:{label:'W-01…W-06, again',level:2,chapter:true,at:'rooms',hint:'Standing on the spine facing a patient-room doorway. Compare the dressing with the Admissions chapter scene.'},
 hw_heart:{label:'Heart — arrival',level:2,chapter:true,at:'heart',hint:'At the chamber entrance. Cross into the room to awaken the heart. The entrances close behind you once you are safely inside.'},
 hw_finale:{label:'Heart — full boss fight',level:2,chapter:true,at:'finale',hint:'One boss, four faces, shared health. Shoot the heart to win; kill its summons to recover. Combat drill enables pressure without health loss. Normal conditions uses finite ammo.'},
 hw_peak:{label:'Heart — cardiac failure · 29%',level:2,chapter:true,at:'peak',hint:'The boss begins at 29% health with maximum summoning pressure. Explore stops summoning. Combat drill enables it with protected health.'},
 hb_target:{label:'Heart — target practice',level:2,chapter:true,at:'target',hint:'Summoning stays off in this scene. Shoot every face with each gun and compare the shared bar. Hold boss health lets you inspect impacts indefinitely.'},
 hb_rupture:{label:'Heart — rupture · 64%',level:2,chapter:true,at:'rupture',hint:'The second stage: more runners and occasional Orderlies. Shoot the heart while using its creatures to replenish health and ammunition.'},
 hb_death:{label:'Heart — one hit from death',level:2,chapter:true,at:'death',hint:'The heart has one health point. Enable Music, land the fatal hit, and hear the score give way to the rupture. Inspect the dead organ, then walk to the exit. Turn Hold boss health off to kill it.'},
 hb_bloodwell:{label:'Heart — blood rise practice',level:2,chapter:true,at:'bloodwell',hint:'No monsters. Choose Combat drill and enable Heart blood attacks. The circle locks onto where you stood; move out before the heartbeat strikes. B repeats.'},
 hb_bloodfan:{label:'Heart — arterial salvo practice',level:2,chapter:true,at:'bloodfan',hint:'No monsters. Choose Combat drill and enable Heart blood attacks. Three lanes aim once, then stay fixed. Step clear of the marked strips or dash on the strike. B repeats.'},
 hw_after:{label:'Heart — aftermath',level:2,chapter:true,at:'after',hint:'The fight is over, the pulse has stopped, and something is standing in front of the way out. Walk at it.'},
 hw_staff:{label:'The annexe payoff — staff route',level:2,chapter:true,at:'staff',hint:'The door off reception that is only open if you went into the Waiting Annex in chapter one. Here it is forced open so you can walk it.'},
 admissions:{label:'Admissions (old grid)',level:0,hint:'The pre-chapter generated ward, kept for comparison.'},
 fever:{label:'Fever Theatre (old grid)',level:1,hint:'Inspect the second ward without playing through Admissions.'},
 heart:{label:'Heart Ward (old grid)',level:2,hint:'Inspect the final ward and its exit directly.'},
 fed:{label:'Fed Corridor',level:0,hint:'The entrance is open ahead. Walk east into the passage. B resets this scene.'},
 loop:{label:'Loop Corridor',level:0,hint:'The entrance is ahead. Explore its repetition and find your way back.'},
 mirror:{label:'Mirror',level:0,hint:'You begin on the other side. The mirror ahead is your way back. Creatures retain their scripted behavior.'},
 range:{label:'Weapon range',level:0,hint:'Three targets at different distances. Test hits, misses, reloads and splash damage. N restores the targets.'},
 patient:{label:'The Unstitched',level:0,hint:'One creature in Admissions. Enable combat AI to study its approach. B or N repeats this scene.'},
 crawler:{label:'Spine Runner',level:0,hint:'One creature in Admissions. Enable combat AI to study its charge. B or N repeats this scene.'},
 orderly:{label:'The Orderly',level:0,hint:'One creature in Admissions. Enable combat AI to study its attack. B or N repeats this scene.'},
 mixed:{label:'Mixed combat drill',level:0,hint:'One of each ordinary creature. Clear the drill, then press N to repeat.'}
};
const reviewPresets={
 explore:{ai:false,damage:false,unlimited:true,music:false},
 drill:{ai:true,damage:false,unlimited:true,music:true},
 normal:{ai:true,damage:true,unlimited:false,music:true}
};
function reviewBuildSceneList(){
 const sel=$('reviewScene');if(!sel)return;
 const GROUPS=[
  ['Find Your Way — this review',['chapter','ch_mains','fever_ch','fv_or1','fv_or2','fv_or3','fv_recovery']],
  ['No Way Out — Cerberus',['cb_threshold','cb_fight','cb_transition','cb_frenzy','cb_dropped','cb_carried','cb_water','cb_after','cb_arrival','cb_shepherd','cb_bulldog','cb_inspect']],
  ['No Way Out — the stolen seraphim',['s4_toy','s4_toy_carry','s4_toy_west','s4_toy_route']],
  ['No Way Out — two ways forward',['s4_quest','s4_keys','s4_extinguisher','s4_recovery','s4_open']],
  ['No Way Out — discharge interrupted',['s4_departure','s4_crash','s4_ambush']],
  ['No Way Out — calm exterior',Object.keys(S4_ENTRIES).map(k=>'s4_'+k)],
  ['The Heart boss',['hw_heart','hb_target','hw_finale','hb_rupture','hw_peak','hb_bloodwell','hb_bloodfan','hb_death','hw_after']],
  ['Admissions chapter',['chapter','ch_triage','ch_reception','ch_gate','ch_maze','ch_after','ch_transfer']],
  ['Fever Theatre chapter',['fever_ch','fv_or1','fv_or2','fv_or3','fv_recovery','fv_spine','fv_ring','fv_end']],
  ['Heart Ward chapter',['heart_ch','hw_spine','hw_rooms','hw_staff']],
  ['Wards',['admissions','fever','heart']],
  ['Liminal spaces (legacy)',['fed','loop','mirror']],
  ['Combat and weapons',['range','patient','crawler','orderly','mixed']]];
 sel.replaceChildren();
 const placed=new Set();
 for(const [label,keys] of GROUPS){
  const g=document.createElement('optgroup');g.label=label;let n=0;
  for(const k of keys){
   if(!reviewScenes[k]||placed.has(k))continue;
   const o=document.createElement('option');o.value=k;o.textContent=reviewScenes[k].label;
   g.append(o);placed.add(k);n++;
  }
  if(n)sel.append(g);
 }
 const rest=Object.keys(reviewScenes).filter(k=>!placed.has(k));
 if(rest.length){
  const g=document.createElement('optgroup');g.label='Other';
  for(const k of rest){const o=document.createElement('option');o.value=k;o.textContent=reviewScenes[k].label;g.append(o);}
  sel.append(g);
 }
 sel.value=review.selected;
 const h=$('reviewHint');
 if(h&&reviewScenes[review.selected])h.textContent=reviewScenes[review.selected].hint;
}
function reviewFixture(){return ['range','patient','crawler','orderly','mixed'].includes(review.scene);}
function reviewAllowLiminal(){return !review.active||!reviewFixture();}
function reviewSetPreset(name){
 if(!reviewPresets[name])return;
 review.preset=name;Object.assign(review,reviewPresets[name]);
 if(!review.ai){bullets=bullets.filter(q=>q.owner!=='enemy');if(hbRunning()){HB.births=[];HB.attack=null;}}
 reviewSync();audio.levels();
}
function reviewSync(){
 $('reviewScene').value=review.selected;$('reviewPreset').value=review.preset;
 $('reviewAI').checked=review.ai;$('reviewDamage').checked=review.damage;
 $('reviewAmmo').checked=review.unlimited;$('reviewMusic').checked=review.music;$('reviewHoldBoss').checked=review.holdBoss;
 $('reviewBloodAttacks').checked=review.bloodAttacks;
 $('reviewHealth').value=review.health;$('reviewWeapon').value=review.loadout;
 $('reviewHint').textContent=reviewScenes[review.selected].hint;
 $('reviewResume').classList.toggle('hidden',!review.active);
 $('reviewCheckpoint').classList.toggle('hidden',!review.active||(!fvRunning()&&!hwRunning()&&!S4D.checkpoint&&!S4T_RUNTIME.checkpoint&&!CB.checkpoint));
 $('reviewToySave').classList.toggle('hidden',!s4tRunning()||cbRunning());
 $('reviewCheckpoint').textContent=CB.checkpoint?'RESTORE PRE-BOSS CHECKPOINT':S4T_RUNTIME.checkpoint?'RESTORE SERAPHIM CHECKPOINT':S4D.checkpoint?(S4Q.on?'RESTORE EXPEDITION CHECKPOINT':'RETRY COURTYARD CHECKPOINT'):hwRunning()?'RETRY HEART CHECKPOINT':'RESTORE THEATRE CHECKPOINT';
 $('reviewOpenExit').classList.toggle('hidden',!review.active||reviewFixture()||s4Running());
 $('reviewReturn').textContent=review.returnTo==='paused'?'BACK TO PAUSE':'BACK TO MENU';
}
function reviewRead(){
 review.selected=reviewScenes[$('reviewScene').value]?$('reviewScene').value:'admissions';
 review.health=clamp(Number($('reviewHealth').value)||100,1,100);
 review.loadout=clamp(Number($('reviewWeapon').value)||0,0,2)|0;
 for(const [key,id]of [['ai','reviewAI'],['damage','reviewDamage'],['unlimited','reviewAmmo'],['music','reviewMusic'],['holdBoss','reviewHoldBoss'],['bloodAttacks','reviewBloodAttacks']])review[key]=$(id).checked;
}
function openTestWard(){
 if(!artReady)return;
 if(!review.active){reviewSetPreset(review.selected==='cb_fight'?'normal':review.selected.startsWith('cb_')?'drill':'explore');if(review.selected.startsWith('cb_'))review.unlimited=false;}
 review.returnTo=mode==='playing'||mode==='paused'||review.active?'paused':'menu';
 if(mode==='playing'){mode='paused';releaseInputs();document.exitPointerLock?.();}
 audio.pause();hideOverlays();mode='review';
 document.body.classList.remove('playing');$('touch').classList.add('hidden');
 $('testWard').classList.remove('hidden');reviewSync();
 $('reviewScene').focus?.();
}
function closeTestWard(){
 reviewStopAudio();hideOverlays();
 if(review.returnTo==='paused'){mode='paused';$('pause').classList.remove('hidden');}
 else{mode='menu';$('start').classList.remove('hidden');audio.reset();}
}
function reviewPlace(x,y,a=0){
 player.x=x;player.y=y;player.a=a;player.vx=player.vy=0;
 _safeX=x;_safeY=y;buildFlow();
}
function reviewSpawnTargets(){
 enemies=[];bullets=[];particles=[];rings=[];tracers=[];numbers=[];decals=[];
 const formations={range:[[4.6,4.5,0],[10.5,4.5,0],[14.3,4.5,2]],
 patient:[[5.7,4.5,0]],crawler:[[5.7,4.5,1]],orderly:[[5.7,4.5,2]],
 mixed:[[5.7,4.5,0],[9.7,4.5,1],[13.7,4.5,2]]};
 for(const [x,y,type]of formations[review.scene]||[]){const e=spawn(x,y,type);e.cd=1.1;e.vocal=2;e.phase=0;e.noticed=true;}
 review.done=false;stageKills=0;cleared=false;
}
function reviewLoad(scene=review.scene){
 if(!reviewScenes[scene])return;
 releaseInputs();audio.reset();review.active=true;review.scene=review.selected=scene;
 review.entered=review.done=false;review.hudClock=0;review.returnTo='paused';
 Object.assign(mods,{damage:1,speed:1,life:1,reload:1,dash:1});
 gameTime=score=kills=combo=maxCombo=comboT=0;enemyId=0;weapon=review.loadout;
 for(const g of guns){g.ammo=g.mag;g.reserve=Math.min(g.maxReserve,g.mag*8);}
 useChapter=!!reviewScenes[scene].chapter;
 loadStage(reviewScenes[scene].level);player.hp=review.health;
 if(reviewScenes[scene].at)(reviewScenes[scene].level===3?s4JumpTo:reviewScenes[scene].level===2?hwJumpTo:reviewScenes[scene].level===1?fvJumpTo:chJumpTo)(reviewScenes[scene].at);
 if(['fed','loop'].includes(scene)){enemies=[];drops=[];}
 if(reviewFixture()){drops=[];reviewSpawnTargets();}
 if(scene==='fed'){reviewPlace(4.5,9.5);fedTrigger();}
 if(scene==='loop'){reviewPlace(13.2,18.5);loopTrigger();}
 if(scene==='mirror'){
  const p={kind:'mirror',permanent:true,x:4,y:4.5,a:Math.PI/2};
  environmentProps.push(p);mirrorEnter(p);mirrorLatch=true;
  _safeX=player.x;_safeY=player.y;
 }
 msgT=feedT=0;hideOverlays();mode='playing';document.body.classList.add('playing','testing');
 $('hud').classList.remove('hidden');$('touch').classList.remove('hidden');
 $('reviewBar').classList.remove('hidden');$('reviewPanelBtn').classList.remove('hidden');
 $('restartBtn').textContent='RESET TEST SCENE';$('retryBtn').textContent='RETRY TEST SCENE';
 audio.start();hudUpdate();reviewHud();lockPointer();s4dReview(scene);s4tReview(scene);cbReview(scene);cbfReview(scene);
}
function reviewReset(){if(review.active)reviewLoad(review.scene);}
function reviewRepeatTargets(){if(review.active&&useChapter){reviewReset();return;}
 if(!review.active||!reviewFixture())return;
 releaseInputs();audio.reset();liminalReset();reviewPlace(2.8,4.5);
 reviewSpawnTargets();shotCD=reloadT=reloadDuration=dashT=dashCD=meleeT=meleeCD=0;
 recoil=muzzle=shake=hurt=whiteFlash=hitstop=hitmarker=killmarker=0;
 player.hp=review.health;score=kills=combo=comboT=maxCombo=gameTime=stageTime=0;
 for(const g of guns){g.ammo=g.mag;g.reserve=g.maxReserve;}
 audio.start();reviewHud();feed('TARGETS RESTORED');
}
function reviewTick(dt){
 if(!review.active)return;
 if(review.unlimited)for(const g of guns)g.reserve=g.maxReserve;
 if(liminal.mode===review.scene)review.entered=true;
 if(review.entered&&!liminal.mode&&!review.done){review.done=true;}
 if(reviewFixture()&&enemies.length&&!enemies.some(e=>e.alive))review.done=true;
 review.hudClock-=dt;if(review.hudClock<=0){review.hudClock=.1;reviewHud();}
}
function chBannerTick(){}
function reviewHud(){
 if(!hudComposing){hudUpdate();return;}
 if(!review.active)return;
 const flags=[review.ai?'AI ON':'AI OFF',review.damage?'DAMAGE ON':'PROTECTED',review.unlimited?'AMMO REFILL':'FINITE AMMO'];
 $('reviewBarText').textContent=reviewScenes[review.scene].label+' · '+flags.join(' / ');
 $('reviewStatus').textContent=review.done?'SCENE COMPLETE · B TO REPEAT':'T CONTROLS · B RESET · H PAIN PREVIEW'+(reviewFixture()?' · N TARGETS':useChapter?' · N REPEAT SCENE':'');
 $('reviewDiagnostics').textContent=BUILD.id+' | '+review.scene+' | '+mode+' / '+(liminal.mode||'ward')+' | '+player.x.toFixed(2)+', '+player.y.toFixed(2)+' | '+enemies.filter(e=>e.alive).length+' alive | '+bullets.length+' projectiles';
 $('scoreLabel').textContent='TEST SCORE · NOT SAVED';
 // Scene HUDs are composed later by hudUpdate, in narrative priority order.
}
function reviewOpenExit(){
 if(!review.active||s4Running())return;
 if(hwRunning())hbSkip();
 if(fvRunning()){FV.blackoutT=FV.ventT=FV.purgeT=0;for(const v of FV.valves)fvFinishSystem(v,true);fvOpenReturn();fvLights();fvSave();}
 cleared=true;review.done=false;feed('EXIT OPEN // FOLLOW THE EXIT ARROW');
 closeTestWard();resumeGame();hudUpdate();
}
function reviewDamagePreview(){
 if(!review.active||mode!=='playing')return;
 hurt=.42;shake=Math.max(shake,5);audio.hit(20);feed('PAIN PREVIEW // HEALTH UNCHANGED');
}
function reviewSound(key){
 if(mode!=='review'||!artReady)return;
 audio.start();
 const e={x:player.x+Math.cos(player.a)*2,y:player.y+Math.sin(player.a)*2,type:0,alive:true};
 if(key==='rust')audio.fire(0);
 if(key==='hex')audio.fire(1);
 if(key==='grave'){audio.fire(2);audio.boom(1,e);}
 if(key==='pain'){audio.painUntil=0;audio.hit(20);}
 if(key==='agony')audio.play('agony',{vol:1.03,wet:.22});
 if(key==='creature'){e.type=Number($('reviewVoice').value)||0;audio.creature(e,true);}
 if(key==='room')audio.play('roomtone',{vol:.45,wet:.2});
 $('reviewAudioStatus').textContent=settings.mute?'All audio is muted in Options.':'Previewing '+({rust:'Rustshot',hex:'Hexdrive',grave:'Gravemaker',pain:'pain',agony:'agony',creature:'creature',room:'room tone'}[key]||key)+'.';
}
function reviewStopAudio(){
 audio.pause();for(const v of [...audio.voices])try{v.source.stop();}catch{}
 audio.voices=[];audio.painVoice=null;audio.painUntil=0;
}
function reviewLeave(){
 review.active=false;releaseInputs();audio.reset();audio.pause();mode='menu';
 document.exitPointerLock?.();document.body.classList.remove('playing','testing');hideOverlays();
 $('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');
 $('start').classList.remove('hidden');$('hud').classList.add('hidden');$('touch').classList.add('hidden');
 $('scoreLabel').textContent='SCORE';$('restartBtn').textContent='RESTART RUN';$('retryBtn').textContent='ONE MORE RUN';
 $('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';loadStage(0);
}
function wireTestWard(){
 $('startTest').onclick=openTestWard;$('pauseTest').onclick=openTestWard;$('reviewPanelBtn').onclick=openTestWard;
 $('reviewLaunch').onclick=()=>{reviewRead();reviewLoad(review.selected);};
 $('reviewResume').onclick=()=>{reviewRead();reviewStopAudio();resumeGame();};
 $('reviewReturn').onclick=closeTestWard;$('reviewMenu').onclick=reviewLeave;$('pauseMenu').onclick=reviewLeave;
 $('reviewOpenExit').onclick=reviewOpenExit;
 $('reviewToySave').onclick=()=>s4tSave();
 $('reviewCheckpoint').onclick=()=>{if(cbRunning()&&CB.checkpoint){reviewRead();reviewStopAudio();cbRestore();return;}if(s4tRunning()&&S4T_RUNTIME.checkpoint){reviewRead();reviewStopAudio();s4tRestore();return;}if(review.active&&(fvRunning()||hwRunning()||S4D.checkpoint)){reviewRead();reviewStopAudio();if(S4D.checkpoint)s4dRestore();else if(hwRunning())hwRestore();else fvRestore();}};
 $('reviewDeath').onclick=()=>{reviewRead();reviewStopAudio();review.holdBoss=false;reviewLoad('hb_death');hbDamage(2,hbSoundPoint(),'grave');};
 $('reviewScene').onchange=()=>{review.selected=$('reviewScene').value;$('reviewHint').textContent=reviewScenes[$('reviewScene').value].hint;};
 $('reviewPreset').onchange=()=>reviewSetPreset($('reviewPreset').value);
 for(const [key,id]of [['ai','reviewAI'],['damage','reviewDamage'],['unlimited','reviewAmmo'],['music','reviewMusic'],['holdBoss','reviewHoldBoss'],['bloodAttacks','reviewBloodAttacks']])$(id).onchange=()=>{
  review[key]=$(id).checked;review.preset='custom';$('reviewPreset').value='custom';
  if(!review.ai){bullets=bullets.filter(q=>q.owner!=='enemy');if(hbRunning())HB.births=[];}
  if((!review.ai||!review.bloodAttacks)&&hbRunning()){HB.attack=null;HB.attackT=4.2;}
  if(key==='music'&&review.music&&mode==='review')audio.start();else audio.levels();
 };
 $('reviewHealth').onchange=()=>review.health=clamp(Number($('reviewHealth').value)||100,1,100);
 $('reviewWeapon').onchange=()=>review.loadout=clamp(Number($('reviewWeapon').value)||0,0,2)|0;
 for(const [id,key]of [['soundRust','rust'],['soundHex','hex'],['soundGrave','grave'],['soundPain','pain'],['soundAgony','agony'],['soundCreature','creature'],['soundRoom','room']])$(id).onclick=()=>reviewSound(key);
 $('soundStop').onclick=()=>{reviewStopAudio();$('reviewAudioStatus').textContent='Audio stopped. Resume or launch a scene to continue.';};
 $('retryBtn').onclick=()=>cbRunning()&&CB.checkpoint?cbRestore():s4tRunning()&&S4T_RUNTIME.checkpoint?s4tRestore():S4D.on&&S4D.checkpoint?s4dRestore():review.active?reviewReset():mode==='won'?startRun():(HW.on&&HW.checkpoint?hwRestore():FV.on&&FV.checkpoint?fvRestore():CH.checkpoint?chRestore():startRun());
 $('restartBtn').onclick=()=>review.active?reviewReset():startRun();
 $('menuBtn').onclick=reviewLeave;
 $('reviewOptions').onclick=()=>{audio.pause();openSettings('review');};
 reviewBuildSceneList();
 $('buildLabel').textContent=BUILD.id+' / '+BUILD.title.toUpperCase();
 reviewSync();
}

audio.restoreRoom=function(){
 if(!this.ctx)return;
 const t=this.ctx.currentTime;
 for(const [param,value]of [[this.musicBed.gain,1],[this.droneGain?.gain,0],[this.roomReturn.gain,.62],[this.roomTone.frequency,3700]]){
  if(param){param.cancelScheduledValues(t);param.value=value;}
 }
 this.room.buffer=this.impShort;
 if(this.ambience){this.ambience.gain.cancelScheduledValues(t);this.ambience.gain.value=settings.sfx*.19;}
};

