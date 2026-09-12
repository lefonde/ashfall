function loop(now){const dt=clamp((now-last)/1000,0,.033);last=now;nowTime=now/1000;if(mode==='menu')player.a=Math.sin(nowTime*.14)*.13;update(dt);render();requestAnimationFrame(loop);}
wireTestWard();syncSettings();loadStage(0);$('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';
Promise.all([prepareAtlas(ASSETS.monsters,false),prepareAtlas(ASSETS.weapons,true),prepareEnvironment(ASSETS.environment),prepareCorruption(ASSETS.corruption,ASSETS.heart,ASSETS.heartDead),prepareExterior(),audio.prepare().catch(()=>{feed('AUDIO UNAVAILABLE');$('reviewAudioStatus').textContent='Audio unavailable. Reload the file to retry.';return false;})]).then(([m,g])=>{monsterSprites=m;gunSprites=g;buildWardenSprite();audio.departureBake();s4dFireTextures();artReady=true;$('startTest').disabled=false;$('startBtn').disabled=false;$('startBtn').textContent='ENTER THE WARD →';}).catch(()=>{$('error').classList.remove('hidden');$('error').textContent='The ward assets did not load. Reload to try again.';$('startBtn').textContent='RELOAD GAME';$('startBtn').disabled=false;$('startBtn').onclick=()=>location.reload();});
requestAnimationFrame(loop);


