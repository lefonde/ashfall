// Full-art native Canvas check: CPU aperture restriction must produce exactly
// the same complete picture as rendering the entire adjoining world. This is
// a deterministic work/visual check, not a browser or phone FPS measurement.
const assert=require('node:assert/strict'),runtime=require('./runtime_harness.cjs');
const nativeCanvas=require('@napi-rs/canvas'),r=runtime({nativeCanvas}),run=s=>r.eval(s);let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name);}
run(`var qaForceFull=false,qaReadbacks=0;const qaOriginalDraw=tfPortalDraw;
 tfPortalDraw=function(mask){return qaOriginalDraw(qaForceFull?null:mask);};
 const qaOriginalRead=wc.getImageData.bind(wc);wc.getImageData=function(...a){qaReadbacks++;return qaOriginalRead(...a);};`);
function setup(level,kind){run(`startRun();${level?'loadStage(1);':''}mode='playing';enemies=[];releaseInputs();settings.reduce=false;settings.map=false;settings.res=1;coarse=true;sceneRenderScaleCap=1;visualViewport.width=844;visualViewport.height=390;resize();shake=liminal.dark=hurt=whiteFlash=muzzle=0;weapon=0;shotCD=.4;weaponDrop=0;recoil=.25;sway=.12;bob=1.2;aimPitch=11;player.vx=player.vy=0;qaForceFull=false;`);
 if(kind==='approach')run(`{const d=TF_DOORS[stage];player.x=d.x-d.nx*1.25;player.y=d.y-d.ny*1.25;player.a=d.axis+.34;}`);
 if(kind==='straddle')run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}`);
 if(kind==='back')run(`{const d=TF_DOORS[stage];player.x=d.x+d.nx*.025;player.y=d.y+d.ny*.025;player.a=d.axis;}tfEnter();player.x=TF_ENTRY+1.25;player.y=4.5;player.a=Math.PI+.19;TF.active.clock=30;`);
}
function snap(){run('qaReadbacks=0;render();');const game=r.get('game');return new Uint8ClampedArray(game.getContext('2d').getImageData(0,0,game.width,game.height).data);}
function difference(a,b){let n=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])n++;return n;}
(async()=>{
 await run(`Promise.all([prepareAtlas(ASSETS.monsters,false),prepareAtlas(ASSETS.weapons,true),prepareEnvironment(ASSETS.environment),prepareCorruption(ASSETS.corruption,ASSETS.heart,ASSETS.heartDead)]).then(([m,g])=>{monsterSprites=m;gunSprites=g;buildWardenSprite();artReady=true;})`);
 for(const level of [0,1]){
  for(const kind of ['approach','back'])test(`chapter ${level+1}: ${kind} CPU aperture clipping preserves every final color channel`,()=>{
   setup(level,kind);const clipped=snap(),work=run('({...WORLD_RENDER_WORK})');assert.equal(run('qaReadbacks'),0);assert.equal(run('TF_PORTAL_STATS.primaryPasses'),1);assert.equal(run('TF_PORTAL_STATS.secondaryPasses'),1);
   run('qaForceFull=true;');const complete=snap(),full=run('({...WORLD_RENDER_WORK})');assert.equal(difference(clipped,complete),0,'restricted CPU render changes visible pixels');
   const key=kind==='approach'?'hallWallPixels':'hostWallPixels';assert(work[key]<full[key],`expected less actual ${key}: ${work[key]} versus ${full[key]}`);assert(work.hostPasses<=1&&work.hallPasses<=1);
  });

 }
 console.log(`${checks} performance work/visual parity checks passed (native Canvas; not device FPS).`);
})().catch(e=>{console.error(e);process.exitCode=1;});
