function loop(now){const elapsed=Math.max(0,now-last),dt=clamp(elapsed/1000,0,rsRunning()?.05:.033);last=now;nowTime=now/1000;
 const frameStart=AF_PERF.enabled?performance.now():0;if(AF_PERF.enabled)afPerfBeginFrame();if(mode==='menu')player.a=Math.sin(nowTime*.14)*.13;update(dt);
 const updated=AF_PERF.enabled?performance.now():0;
 const measure=rsRunning()&&mode==='playing';if(measure)rsRenderQualityApply();
 const renderStart=measure||AF_PERF.enabled?performance.now():0;render();
 const rendered=measure||AF_PERF.enabled?performance.now():0;
 if(measure)rsRenderQualitySample(rendered-renderStart,elapsed);
 if(AF_PERF.enabled)afPerfFrame(now,elapsed,updated-frameStart,rendered-updated);requestAnimationFrame(loop);
}
wireTestWard();syncSettings();loadStage(0);$('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';
Promise.all([prepareAtlas(ASSETS.monsters,false),prepareAtlas(ASSETS.weapons,true),prepareEnvironment(ASSETS.environment),prepareCorruption(ASSETS.corruption,ASSETS.heart,ASSETS.heartDead),prepareExterior(),audio.prepare().catch(()=>{feed('AUDIO UNAVAILABLE');$('reviewAudioStatus').textContent='Audio unavailable. Reload the file to retry.';return false;})]).then(async([m,g])=>{
 monsterSprites=m;gunSprites=g;buildWardenSprite();audio.departureBake();s4dFireTextures();rsAudioInit();
 $('startBtn').textContent='PREPARING THE WARD…';
 if(!await preparePerformanceWorld())return;
 artReady=true;tfReady();$('startTest').disabled=false;$('startBtn').disabled=false;$('startBtn').textContent='ENTER THE WARD →';
}).catch(()=>{$('error').classList.remove('hidden');$('error').textContent='The ward assets did not load. Reload to try again.';$('startBtn').textContent='RELOAD GAME';$('startBtn').disabled=false;$('startBtn').onclick=()=>location.reload();});
requestAnimationFrame(loop);
