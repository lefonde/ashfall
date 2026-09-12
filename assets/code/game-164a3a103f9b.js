'use strict';
const BUILD={"id":"BETA-0.2.0","version":"0.2.0","channel":"friends-beta","title":"Friends Beta","release_date":"2026-09-12","parent":"ashfall-beta-0.1.8-warden-motion.html","parent_sha256":"451287a1d9af92a15717fb144718700e3bc1febb6c809a6dfb63010ec1272db9","status":"Ready for beta feedback","distribution":"github-pages","standalone_sha256":"c38b4c928977a12710e2033e5bfac09d64041f935153b9b8895a9171e8a2d52b","source_digest":"cd7c54ec6ff2"};
const ASSETS={"monsters":"assets/images/monsters-7a8d8ffd4fae.png","weapons":"assets/images/weapons-73583938e547.png","environment":"assets/images/environment-3322ada17e47.png","corruption":"assets/images/corruption-e84fc5cb4a50.png","heart":"assets/images/heart-5692eece590a.png","heartDead":"assets/images/heartDead-7f529971b65b.png","exteriorSky":"assets/images/exteriorSky-6693e4a4d332.webp","exteriorMaterials":"assets/images/exteriorMaterials-e843987123e0.webp","exteriorFacade":"assets/images/exteriorFacade-3a67568a2001.webp","groundsTextures":"assets/images/groundsTextures-f1efbe29ae5c.webp","groundsSprites":"assets/images/groundsSprites-bd069fa07efd.webp","distantCity":"assets/images/distantCity-89b2d4b4bada.webp","ambulance":"assets/images/ambulance-47ad2f81dfb6.webp","recovery":"assets/images/recovery-c727d44ad39a.webp","seraphim":"assets/images/seraphim-f9d62263f225.webp","cerberusBody":"assets/images/cerberusBody-09c649a96f23.webp","cerberusHeads":"assets/images/cerberusHeads-acebff74aa17.webp","parking":"assets/images/parking-07caf158b197.webp"};
const AUDIO_DATA={"fx":"assets/audio/fx-7b8598627e4a.mp3","music":"assets/audio/music-49c4af6ac5c0.mp3"};
const NIGHT_AUDIO_DATA={"insects":"assets/audio/night-insects-e61571f673e6.mp3","owl":"assets/audio/night-owl-e261b3affa75.mp3"};
const AUDIO_CUES={"shotgun0":{"start":0.15,"duration":0.747938},"shotgun1":{"start":1.017937,"duration":0.747938},"shotgun2":{"start":1.885875,"duration":0.747938},"plasma0":{"start":2.753812,"duration":0.284},"plasma1":{"start":3.157812,"duration":0.284},"plasma2":{"start":3.561812,"duration":0.284},"cannon0":{"start":3.965813,"duration":2.244},"blast0":{"start":6.329813,"duration":0.960375},"cannon1":{"start":7.410188,"duration":2.244},"blast1":{"start":9.774188,"duration":0.960375},"rack":{"start":10.854563,"duration":0.654},"reload":{"start":11.628562,"duration":0.654},"dry":{"start":12.402563,"duration":0.152906},"shell":{"start":12.675469,"duration":0.3585},"patient0":{"start":13.153969,"duration":2.854},"crawler0":{"start":16.127969,"duration":2.654},"brute0":{"start":18.901969,"duration":3.454},"death0":{"start":22.475969,"duration":2.141906},"patient1":{"start":24.737875,"duration":1.209219},"crawler1":{"start":26.067094,"duration":2.654},"brute1":{"start":28.841094,"duration":3.454},"death1":{"start":32.415094,"duration":1.273125},"patient2":{"start":33.808219,"duration":2.854},"crawler2":{"start":36.782219,"duration":2.654},"brute2":{"start":39.556219,"duration":3.454},"death2":{"start":43.130219,"duration":1.328938},"scream0":{"start":44.579156,"duration":3.079},"shriek0":{"start":47.778156,"duration":1.32325},"roar0":{"start":49.221406,"duration":3.054},"scream1":{"start":52.395406,"duration":1.874406},"shriek1":{"start":54.389812,"duration":0.813594},"roar1":{"start":55.323406,"duration":3.054},"pain0":{"start":58.497406,"duration":1.755031},"pain1":{"start":60.372437,"duration":1.755031},"pain2":{"start":62.247469,"duration":1.072031},"pain3":{"start":63.4395,"duration":1.118656},"agony":{"start":64.678156,"duration":1.231719},"gasp":{"start":66.029875,"duration":1.254},"effort":{"start":67.403875,"duration":0.58825},"breath0":{"start":68.112125,"duration":1.632969},"breath1":{"start":69.865094,"duration":1.80775},"breath2":{"start":71.792844,"duration":1.131156},"flesh0":{"start":73.044,"duration":0.610344},"gore0":{"start":73.774344,"duration":0.5965},"bodyhit0":{"start":74.490844,"duration":0.465},"flesh1":{"start":75.075844,"duration":0.329781},"gore1":{"start":75.525625,"duration":0.407594},"bodyhit1":{"start":76.053219,"duration":0.386281},"flesh2":{"start":76.5595,"duration":0.43025},"gore2":{"start":77.10975,"duration":0.494406},"bodyhit2":{"start":77.724156,"duration":0.467875},"step0":{"start":78.312031,"duration":0.294},"step1":{"start":78.726031,"duration":0.294},"step2":{"start":79.140031,"duration":0.294},"step3":{"start":79.554031,"duration":0.294},"heartbeat":{"start":79.968031,"duration":0.404},"swing":{"start":80.492031,"duration":0.334},"dash":{"start":80.946031,"duration":0.294},"pickup":{"start":81.360031,"duration":0.604},"seal":{"start":82.084031,"duration":1.138313},"bodyfall":{"start":83.342344,"duration":0.559},"environment0":{"start":84.021344,"duration":1.042344},"environment1":{"start":85.183688,"duration":2.554},"environment2":{"start":87.857687,"duration":2.554},"environment3":{"start":90.531688,"duration":0.338687},"roomtone":{"start":90.990375,"duration":10.0},"machinery":{"start":101.110375,"duration":8.0}};
const CERBERUS_AUDIO_DATA="assets/audio/cerberus-score-bd028e8baa2c.mp3";
const HEART_AUDIO_DATA="assets/audio/heart-finale-6779025fc027.mp3";
const HEART_AUDIO_CUES={"phase1":{"start":0.15,"duration":25.26315192743764,"heart_bpm":76,"beats":32},"phase2":{"start":25.593152,"duration":20.86956916099773,"heart_bpm":92,"beats":32},"phase3":{"start":46.642721,"duration":17.45453514739229,"heart_bpm":110,"beats":32},"death":{"start":64.277256,"duration":6.5,"rupture":0.72}};
const CREATURE_AUDIO_DATA="assets/audio/creature-voices-0244fee2a287.mp3";
const CREATURE_AUDIO_CUES={"mv_unstitched_idle0":{"start":0.15,"duration":1.23421875},"mv_unstitched_idle1":{"start":1.50421875,"duration":1.25375},"mv_unstitched_idle2":{"start":2.87796875,"duration":1.06440625},"mv_unstitched_idle3":{"start":4.062375,"duration":1.083875},"mv_unstitched_attack0":{"start":5.26625,"duration":0.6074375},"mv_unstitched_attack1":{"start":5.9936875,"duration":0.58290625},"mv_unstitched_attack2":{"start":6.69659375,"duration":0.6733125},"mv_unstitched_attack3":{"start":7.48990625,"duration":0.5605},"mv_unstitched_attack4":{"start":8.17040625,"duration":0.58646875},"mv_unstitched_death0":{"start":8.876875,"duration":1.0305},"mv_unstitched_death1":{"start":10.027375,"duration":0.88040625},"mv_unstitched_death2":{"start":11.02778125,"duration":1.125375},"mv_runner_idle0":{"start":12.27315625,"duration":0.65446875},"mv_runner_idle1":{"start":13.047625,"duration":0.74946875},"mv_runner_idle2":{"start":13.91709375,"duration":0.755},"mv_runner_idle3":{"start":14.79209375,"duration":0.64528125},"mv_runner_attack0":{"start":15.557375,"duration":0.35484375},"mv_runner_attack1":{"start":16.03221875,"duration":0.40803125},"mv_runner_attack2":{"start":16.56025,"duration":0.3441875},"mv_runner_attack3":{"start":17.0244375,"duration":0.36484375},"mv_runner_attack4":{"start":17.50928125,"duration":0.41021875},"mv_runner_death0":{"start":18.0395,"duration":0.67465625},"mv_runner_death1":{"start":18.83415625,"duration":0.7071875},"mv_runner_death2":{"start":19.66134375,"duration":0.73546875},"mv_orderly_idle0":{"start":20.5168125,"duration":1.52121875},"mv_orderly_idle1":{"start":22.15803125,"duration":1.64075},"mv_orderly_idle2":{"start":23.91878125,"duration":1.70209375},"mv_orderly_idle3":{"start":25.740875,"duration":1.49378125},"mv_orderly_attack0":{"start":27.35465625,"duration":0.75253125},"mv_orderly_attack1":{"start":28.2271875,"duration":0.8978125},"mv_orderly_attack2":{"start":29.245,"duration":0.825},"mv_orderly_attack3":{"start":30.19,"duration":0.83734375},"mv_orderly_attack4":{"start":31.14734375,"duration":0.864},"mv_orderly_death0":{"start":32.13134375,"duration":1.32115625},"mv_orderly_death1":{"start":33.5725,"duration":1.416625},"mv_orderly_death2":{"start":35.109125,"duration":1.29525},"mv_shepherd_idle0":{"start":36.524375,"duration":1.01190625},"mv_shepherd_idle1":{"start":37.65628125,"duration":1.26071875},"mv_shepherd_idle2":{"start":39.037,"duration":1.056375},"mv_shepherd_idle3":{"start":40.213375,"duration":1.2461875},"mv_shepherd_attack0":{"start":41.5795625,"duration":0.471375},"mv_shepherd_attack1":{"start":42.1709375,"duration":0.52609375},"mv_shepherd_attack2":{"start":42.81703125,"duration":0.4778125},"mv_shepherd_attack3":{"start":43.41484375,"duration":0.49640625},"mv_shepherd_attack4":{"start":44.03125,"duration":0.5335},"mv_shepherd_death0":{"start":44.68475,"duration":1.154125},"mv_shepherd_death1":{"start":45.958875,"duration":0.9709375},"mv_shepherd_death2":{"start":47.0498125,"duration":0.971875},"mv_bulldog_idle0":{"start":48.1416875,"duration":1.2851875},"mv_bulldog_idle1":{"start":49.546875,"duration":1.587875},"mv_bulldog_idle2":{"start":51.25475,"duration":1.26184375},"mv_bulldog_idle3":{"start":52.63659375,"duration":1.5223125},"mv_bulldog_attack0":{"start":54.27890625,"duration":0.95309375},"mv_bulldog_attack1":{"start":55.352,"duration":0.9591875},"mv_bulldog_attack2":{"start":56.4311875,"duration":1.07334375},"mv_bulldog_attack3":{"start":57.62453125,"duration":0.8551875},"mv_bulldog_attack4":{"start":58.59971875,"duration":0.9894375},"mv_bulldog_death0":{"start":59.70915625,"duration":1.4330625},"mv_bulldog_death1":{"start":61.26221875,"duration":1.461375},"mv_bulldog_death2":{"start":62.84359375,"duration":1.15821875},"mv_chihuahua_idle0":{"start":64.1218125,"duration":0.54746875},"mv_chihuahua_idle1":{"start":64.78928125,"duration":0.46065625},"mv_chihuahua_idle2":{"start":65.3699375,"duration":0.51246875},"mv_chihuahua_idle3":{"start":66.00240625,"duration":0.51228125},"mv_chihuahua_attack0":{"start":66.6346875,"duration":0.20421875},"mv_chihuahua_attack1":{"start":66.95890625,"duration":0.20709375},"mv_chihuahua_attack2":{"start":67.286,"duration":0.228625},"mv_chihuahua_attack3":{"start":67.634625,"duration":0.2498125},"mv_chihuahua_attack4":{"start":68.0044375,"duration":0.21659375},"mv_chihuahua_death0":{"start":68.34103125,"duration":0.484375},"mv_chihuahua_death1":{"start":68.94540625,"duration":0.43015625},"mv_chihuahua_death2":{"start":69.4955625,"duration":0.46253125},"mv_heart_idle0":{"start":70.07809375,"duration":2.0604375},"mv_heart_idle1":{"start":72.25853125,"duration":1.69409375},"mv_heart_idle2":{"start":74.072625,"duration":1.605},"mv_heart_idle3":{"start":75.797625,"duration":1.6895},"mv_heart_attack0":{"start":77.607125,"duration":2.56034375},"mv_heart_attack1":{"start":80.28746875,"duration":2.53234375},"mv_heart_attack2":{"start":82.9398125,"duration":2.17640625},"mv_heart_attack3":{"start":85.23621875,"duration":1.99721875},"mv_heart_attack4":{"start":87.3534375,"duration":2.19328125},"mv_heart_death0":{"start":89.66671875,"duration":2.799375},"mv_heart_death1":{"start":92.58609375,"duration":2.4289375},"mv_heart_death2":{"start":95.13503125,"duration":2.447}};
const CREATURE_AUDITION_DATA="assets/audio/creature-auditions-a190f10c4f0b.mp3";
const CREATURE_AUDITION_CUES={"ca_orderly_a_attack0":{"start":0.15,"duration":2.8988125},"ca_orderly_a_attack1":{"start":3.2988125,"duration":2.2296666666666667},"ca_orderly_a_idle0":{"start":5.778479166666667,"duration":1.3027916666666666},"ca_orderly_a_idle1":{"start":7.331270833333333,"duration":0.9091041666666667},"ca_orderly_b_attack0":{"start":8.490375,"duration":3.034104166666667},"ca_orderly_b_attack1":{"start":11.774479166666667,"duration":2.644},"ca_orderly_b_idle0":{"start":14.668479166666666,"duration":1.8478958333333333},"ca_orderly_b_idle1":{"start":16.766375,"duration":1.8661875},"ca_runner_a_attack0":{"start":18.8825625,"duration":1.5039583333333333},"ca_runner_a_attack1":{"start":20.636520833333332,"duration":1.543375},"ca_runner_a_idle0":{"start":22.429895833333333,"duration":1.375},"ca_runner_a_idle1":{"start":24.054895833333333,"duration":1.3897083333333333},"ca_runner_b_attack0":{"start":25.694604166666668,"duration":1.3583333333333334},"ca_runner_b_attack1":{"start":27.3029375,"duration":1.2510208333333332},"ca_runner_b_idle0":{"start":28.803958333333334,"duration":1.565875},"ca_runner_b_idle1":{"start":30.619833333333332,"duration":1.0618541666666668},"ca_orderly_previous_idle0":{"start":31.9316875,"duration":1.6212291666666667},"ca_orderly_previous_idle1":{"start":33.80291666666667,"duration":1.74075},"ca_orderly_previous_attack0":{"start":35.79366666666667,"duration":0.8525208333333333},"ca_orderly_previous_attack1":{"start":36.8961875,"duration":0.9978125},"ca_runner_previous_idle0":{"start":38.144,"duration":0.7544583333333333},"ca_runner_previous_idle1":{"start":39.14845833333333,"duration":0.8494583333333333},"ca_runner_previous_attack0":{"start":40.24791666666667,"duration":0.4548333333333333},"ca_runner_previous_attack1":{"start":40.95275,"duration":0.5080416666666666}};
const CREATURE_REVIEW_MODE=false;
const CREATURE_ROUND2_DATA="assets/audio/creature-round2-569de06a3c95.mp3";
const CREATURE_ROUND2_CUES={"cr_unstitched_a_attack0":{"start":0.15,"duration":1.8173125},"cr_unstitched_a_attack1":{"start":2.2473125,"duration":1.9363333333333332},"cr_unstitched_a_idle0":{"start":4.4636458333333335,"duration":1.1821458333333332},"cr_unstitched_a_idle1":{"start":5.925791666666667,"duration":1.2720625},"cr_unstitched_b_attack0":{"start":7.477854166666667,"duration":2.1352083333333334},"cr_unstitched_b_attack1":{"start":9.8930625,"duration":2.0745},"cr_unstitched_b_idle0":{"start":12.2475625,"duration":1.0577083333333333},"cr_unstitched_b_idle1":{"start":13.585270833333333,"duration":1.2430416666666666},"cr_shepherd_a_attack0":{"start":15.1083125,"duration":2.3876458333333335},"cr_shepherd_a_attack1":{"start":17.77595833333333,"duration":2.0953125},"cr_shepherd_a_idle0":{"start":20.151270833333335,"duration":1.555},"cr_shepherd_a_idle1":{"start":21.986270833333332,"duration":1.6199583333333334},"cr_shepherd_b_attack0":{"start":23.886229166666666,"duration":1.63075},"cr_shepherd_b_attack1":{"start":25.796979166666667,"duration":1.6868125},"cr_shepherd_b_idle0":{"start":27.763791666666666,"duration":1.4986458333333332},"cr_shepherd_b_idle1":{"start":29.5424375,"duration":1.5121041666666666},"cr_bulldog_a_attack0":{"start":31.334541666666667,"duration":2.2989166666666665},"cr_bulldog_a_attack1":{"start":33.91345833333333,"duration":2.1782083333333335},"cr_bulldog_a_idle0":{"start":36.37166666666667,"duration":1.5841875},"cr_bulldog_a_idle1":{"start":38.23585416666667,"duration":1.435},"cr_bulldog_b_attack0":{"start":39.950854166666666,"duration":2.2936875},"cr_bulldog_b_attack1":{"start":42.524541666666664,"duration":1.6897083333333334},"cr_bulldog_b_idle0":{"start":44.49425,"duration":1.0568333333333333},"cr_bulldog_b_idle1":{"start":45.83108333333333,"duration":0.9583333333333334},"cr_chihuahua_a_attack0":{"start":47.06941666666667,"duration":0.845},"cr_chihuahua_a_attack1":{"start":48.19441666666667,"duration":1.0543125},"cr_chihuahua_a_idle0":{"start":49.528729166666665,"duration":0.645},"cr_chihuahua_a_idle1":{"start":50.45372916666667,"duration":0.9765},"cr_chihuahua_b_attack0":{"start":51.710229166666664,"duration":1.2727291666666667},"cr_chihuahua_b_attack1":{"start":53.26295833333333,"duration":1.0138958333333334},"cr_chihuahua_b_idle0":{"start":54.55685416666667,"duration":0.8992083333333334},"cr_chihuahua_b_idle1":{"start":55.7360625,"duration":0.6828958333333334},"cr_heart_a_attack0":{"start":56.69895833333333,"duration":2.559229166666667},"cr_heart_a_attack1":{"start":59.5381875,"duration":2.535270833333333},"cr_heart_a_idle0":{"start":62.353458333333336,"duration":1.4503125},"cr_heart_a_idle1":{"start":64.08377083333333,"duration":1.5416666666666667},"cr_heart_b_attack0":{"start":65.9054375,"duration":2.7660416666666667},"cr_heart_b_attack1":{"start":68.95147916666667,"duration":2.3875},"cr_heart_b_idle0":{"start":71.61897916666666,"duration":1.3869166666666666},"cr_heart_b_idle1":{"start":73.28589583333333,"duration":1.2839166666666666}};
const CREATURE_ROUND3_DATA="assets/audio/creature-round3-abb03751c8c4.mp3";
const CREATURE_ROUND3_CUES={"cr3_unstitched_a_idle0":{"start":0.15,"duration":1.3803333333333334},"cr3_unstitched_a_idle1":{"start":1.8103333333333333,"duration":1.4583333333333333},"cr3_unstitched_a_attack0":{"start":3.5486666666666666,"duration":1.8165},"cr3_unstitched_a_attack1":{"start":5.645166666666666,"duration":1.8363541666666667},"cr3_unstitched_b_idle0":{"start":7.761520833333333,"duration":1.3105833333333334},"cr3_unstitched_b_idle1":{"start":9.352104166666667,"duration":1.44825},"cr3_unstitched_b_attack0":{"start":11.080354166666666,"duration":1.7386458333333332},"cr3_unstitched_b_attack1":{"start":13.099,"duration":1.836125},"cr3_heart_a_idle0":{"start":15.215125,"duration":1.8625},"cr3_heart_a_idle1":{"start":17.357625,"duration":1.9542708333333334},"cr3_heart_a_attack0":{"start":19.591895833333332,"duration":2.512958333333333},"cr3_heart_a_attack1":{"start":22.384854166666667,"duration":2.5375},"cr3_heart_b_idle0":{"start":25.202354166666666,"duration":1.7376041666666666},"cr3_heart_b_idle1":{"start":27.219958333333334,"duration":1.8625},"cr3_heart_b_attack0":{"start":29.362458333333333,"duration":2.51975},"cr3_heart_b_attack1":{"start":32.16220833333333,"duration":2.483979166666667}};
const WARDEN_ART_DATA="assets/images/warden-hollowed-d752e4dcecfd.webp";
// Website transport only. The exact MP3 bytes are decoded by the same context
// and played through the beta's unchanged mixing and creature selection code.
async function loadAudioAsset(url,context){
 const response=await fetch(url);
 if(!response.ok)throw Error('Audio asset could not load ('+response.status+'): '+url);
 const bytes=await response.arrayBuffer();
 if(!bytes.byteLength)throw Error('Audio asset was empty: '+url);
 return context.decodeAudioData(bytes);
}

// SOURCE: state.js
// state.js — bundled from the owner’s liminal baseline.
const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d',{alpha:false}), mapCtx=$('map').getContext('2d');
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mix=(a,b,t)=>a+(b-a)*t, rand=(a=0,b=1)=>a+Math.random()*(b-a), angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const settings={music:.48,sfx:.8,sensitivity:.00225,shake:.65,res:1,difficulty:1,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,map:false,mute:false};
try{const saved=JSON.parse(localStorage.getItem('ashfall-settings-v2')||'{}');if(saved&&typeof saved==='object'){
 for(const [key,lo,hi]of [['music',0,1],['sfx',0,1],['sensitivity',.0006,.0054],['shake',0,1],['res',.5,1],['difficulty',0,2]])if(typeof saved[key]==='number'&&Number.isFinite(saved[key]))settings[key]=clamp(saved[key],lo,hi);
 for(const key of ['reduce','map','mute'])if(typeof saved[key]==='boolean')settings[key]=saved[key];
}}catch{}
let best=0;try{best=Math.max(0,Number(localStorage.getItem('ashfall-best-v2'))||0);if(!Number.isFinite(best))best=0;}catch{}
const coarse=matchMedia('(pointer: coarse)').matches;
let W=640,H=360,frame,px,zBuffer;const world=document.createElement('canvas'),wc=world.getContext('2d',{alpha:false});
function resize(){const _iw=innerWidth||800,_ih=innerHeight||450,ar=(_ih/_iw)||.5625;let w=Math.max(128,Math.round(640*clamp(settings.res||1,.5,1)/8)*8),h=Math.round(w*ar)||Math.round(w*.5625);if(h>800){h=800;w=Math.max(128,Math.round(h/ar/8)*8);h=Math.round(w*ar);}if(h<120){h=120;w=Math.max(128,Math.round(h/ar/8)*8);h=Math.round(w*ar);}W=w;H=clamp(h,120,800);canvas.width=world.width=W;canvas.height=world.height=H;frame=wc.createImageData(W,H);px=frame.data;zBuffer=new Float32Array(W);ctx.imageSmoothingEnabled=false;wc.imageSmoothingEnabled=false;}
addEventListener('resize',resize);resize();
let mode='menu',difficulty=1,stage=0,gameTime=0,stageTime=0,kills=0,stageKills=0,score=0,combo=0,comboT=0,maxCombo=0,grace=5,cleared=false;
let map=[],MW=64,MH=64,flow=[],flowClock=0,enemies=[],bullets=[],particles=[],rings=[],drops=[],decals=[],tracers=[],numbers=[],exit={x:20.5,y:22.5};
let weapon=0,shotCD=0,reloadT=0,reloadDuration=0,recoil=0,muzzle=0,shake=0,hurt=0,hitstop=0,hitmarker=0,killmarker=0,whiteFlash=0,dashT=0,dashCD=0,meleeT=0,meleeCD=0,weaponDrop=0;
let nowTime=0,last=0,msgT=0,feedT=0,bob=0,sway=0,lookDelta=0,aimPitch=0,mapHeld=false,mouseFire=false,menuParent='menu',hudClock=0,ambientClock=1.2,enemyId=0;
const keys={},touchMove={x:0,y:0},touchLook={id:null,x:0,y:0};
const player={x:2.8,y:4.5,a:0,hp:100,vx:0,vy:0,r:.19};let _safeX=null,_safeY=null;
const mods={damage:1,speed:1,life:1,reload:1,dash:1};
const guns=[
 {name:'RUSTSHOT',tag:'BREACH SHOTGUN',color:'#ff488d',rgb:[255,62,138],mag:6,ammo:6,reserve:48,maxReserve:72,rate:.42,reload:.78,damage:11,pellets:12,spread:.12},
 {name:'HEXDRIVE',tag:'PLASMA ROTARY',color:'#52eeff',rgb:[70,238,255],mag:48,ammo:48,reserve:144,maxReserve:240,rate:.085,reload:.95,damage:17},
 {name:'GRAVEMAKER',tag:'ANNIHILATION ENGINE',color:'#d5ff42',rgb:[210,255,58],mag:3,ammo:3,reserve:9,maxReserve:15,rate:.86,reload:1.16,damage:230}
];
const creatureTypes=[
 {name:'THE UNSTITCHED',hp:100,speed:1.6,size:1.16,width:.7,damage:13,score:100,color:'#ff3b8a'},
 {name:'SPINE RUNNER',hp:72,speed:2.55,size:.68,width:.9,damage:10,score:125,color:'#5beeff'},
 {name:'THE ORDERLY',hp:285,speed:.96,size:1.45,width:1.05,damage:21,score:250,color:'#d5ff42'},
 {name:'THE WARDEN',hp:9999,speed:0,size:1.74,width:.82,damage:0,score:0,color:'#cfd3c2'}
];
const wardNames=['ADMISSIONS','FEVER THEATRE','THE HEART WARD'], quotas=[10,14,18];


// SOURCE: ui-helpers.js
// ui-helpers.js — bundled from the owner’s liminal baseline.
function say(text,t=1.65){$('message').textContent=text;msgT=t;}
function feed(text){$('feed').textContent=text;feedT=2.1;}


// SOURCE: physics.js
// physics.js — bundled from the owner’s liminal baseline.
function wall(x,y){if(s4Running())return s4Solid(x,y);return x<0||y<0||x>=MW||y>=MH||map[y|0]?.[x|0]!==0;}
function fits(x,y,r=.19){return !wall(x-r,y-r)&&!wall(x+r,y-r)&&!wall(x-r,y+r)&&!wall(x+r,y+r)&&furnitureFree(x,y,r)&&cbBodyFree(x,y,r);}
function move(o,dx,dy,r=o.r||.19){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.12));dx/=steps;dy/=steps;for(let i=0;i<steps;i++){if(fits(o.x+dx,o.y,r))o.x+=dx;if(fits(o.x,o.y+dy,r))o.y+=dy;}}
function lineOfSight(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d*9);for(let i=1;i<=n;i++)if(wall(ax+(bx-ax)*i/n,ay+(by-ay)*i/n))return false;return true;}
function castRay(x,y,dx,dy,max=70){if(s4Running())return s4CastRay(x,y,dx,dy,max);let mx=x|0,my=y|0;const ddx=Math.abs(1/(dx||1e-9)),ddy=Math.abs(1/(dy||1e-9)),sx=dx<0?-1:1,sy=dy<0?-1:1;let tx=(dx<0?x-mx:mx+1-x)*ddx,ty=(dy<0?y-my:my+1-y)*ddy,side=0,d=0;for(let i=0;i<90;i++){if(tx<ty){d=tx;tx+=ddx;mx+=sx;side=0}else{d=ty;ty+=ddy;my+=sy;side=1}if(d>max||map[my]?.[mx]!==0)break;}const u=side?x+d*dx:y+d*dy;return{d:Math.min(d,max),u:u-Math.floor(u),side,mx,my,type:map[my]?.[mx]||1};}


// SOURCE: levels.js
// levels.js — bundled from the owner’s liminal baseline.
function createMap(level){if(useChapter&&level===3){s4CreateMap();return;}if(useChapter&&level===0){chCreateMap();return;}if(useChapter&&level===1){fvCreateMap();return;}if(useChapter&&level===2){hwCreateMap();return;}map=Array.from({length:MH},()=>Array(MW).fill(1));const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
 [[1,2,6,7],[9,1,15,7],[18,1,23,8],[18,11,23,16],[9,11,15,17],[1,10,6,17],[6,20,21,23],[6,4,9,5],[15,4,18,5],[20,8,21,11],[15,13,18,14],[6,13,9,14],[3,7,4,10],[12,17,13,20],[3,17,4,21],[3,21,9,22],[20,16,21,20]].forEach(r=>carve(...r));
 const columns=[[4,2],[11,3],[13,6],[21,2],[19,6],[22,13],[10,14],[14,16],[2,13],[5,15],[9,22],[16,20]];for(const [x,y]of columns)map[y][x]=2;
 if(level===1){map[11][19]=2;map[15][12]=2;map[6][10]=2;}if(level===2){map[12][22]=2;map[3][14]=2;map[16][3]=2;}
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function spawn(x,y,type){const a=creatureTypes[type];const _e={id:enemyId++,x,y,type,hp:a.hp*(1+stage*.1),maxHp:a.hp*(1+stage*.1),alive:true,cd:rand(.4,1.8),vocal:rand(.5,4),hurt:0,phase:rand(0,TAU),state:'hunt',windup:0,charge:0,dx:0,dy:0,r:type===2?.27:.2,noticed:false,walk:0,death:0,cower:0,dormant:false};enemies.push(_e);return _e;}
function populate(level){if(useChapter&&level===3){enemies=[];drops=[];return;}if(useChapter&&level===0){chPopulate();return;}if(useChapter&&level===1){fvPopulate();return;}if(useChapter&&level===2){hwPopulate();return;}enemies=[];const spots=[[5.7,4.5,0],[9.7,4.5,1],[13.7,2.7,0],[14.5,6.4,1],[18.8,4.7,0],[22.4,4.2,2],[19.5,7.5,1],[20.5,10.5,0],[22.2,15.3,0],[18.8,12.2,1],[14.4,13.5,2],[10.3,16.3,0],[5.5,13.5,1],[2.5,16.1,0],[8.3,21.3,0],[13.7,22.6,1],[18.3,22.6,2]];
 if(level>0)spots.push([11.5,6.4,0],[22.6,7.5,1],[4.5,11.5,0],[17.6,21.5,1]);if(level>1)spots.push([13.5,11.7,2],[3.5,19.5,1],[21.3,21.5,2],[6.5,4.5,1]);
 for(const s of spots)spawn(...s);drops=[{x:11.8,y:2.3,type:'life',life:999},{x:22.7,y:11.6,type:'ammo',life:999},{x:2.5,y:10.7,type:'life',life:999},{x:12.5,y:19.2,type:'ammo',life:999}];
}
function loadStage(level){s4dReset();S4.on=false;$('leaveHospitalBtn').classList.add('hidden');liminalReset();MW=useChapter&&level===3?S4_WIDTH:64;MH=useChapter&&level===3?S4_HEIGHT:64;exit={x:20.5,y:22.5};releaseInputs();stage=level;hbReset();stageKills=0;stageTime=0;cleared=false;grace=6;createMap(level);setupEnvironment();horrorSetup();populate(level);player.x=2.8;player.y=4.5;player.a=0;player.vx=player.vy=0;player.hp=100;aimPitch=bob=sway=lookDelta=weaponDrop=hitmarker=killmarker=reloadDuration=0;_safeX=player.x;_safeY=player.y;bullets=[];particles=[];rings=[];decals=[];tracers=[];numbers=[];flowClock=0;shotCD=reloadT=dashT=dashCD=meleeT=meleeCD=0;recoil=muzzle=shake=hurt=whiteFlash=hitstop=0;for(const g of guns){g.ammo=g.mag;g.reserve=Math.max(g.reserve,g.mag*3);}if(useChapter&&level===0){FV.on=HW.on=false;FV.checkpoint=HW.checkpoint=null;chBegin();audio.theatre(false);audio.heart(0);}else if(useChapter&&level===1){HW.on=false;HW.checkpoint=null;audio.heart(0);fvBegin();}else if(useChapter&&level===2){FV.on=false;hwBegin();}else if(useChapter&&level===3){FV.on=HW.on=CH.on=false;FV.checkpoint=HW.checkpoint=CH.checkpoint=null;CH.tr=null;s4Begin();}else{FV.on=HW.on=false;audio.theatre(false);audio.heart(0);}buildFlow();if(useChapter&&level===0){say('ADMISSIONS',2.4);feed('THE WARD HAS NO POWER');}else if(useChapter&&level===1){say('FEVER THEATRE',2.4);feed('THREE THEATRES ARE STILL RUNNING');}else if(useChapter&&level===2){say('THE HEART WARD',2.4);feed('YOU HAVE BEEN HERE BEFORE');}else if(s4Running()){say('NO WAY OUT',2.6);feed('THE GROUNDS // TAKE A BREATH');}else{say('WARD '+(level+1)+' // '+wardNames[level],2.6);feed(quotas[level]+' KILLS BREAK THE SEAL');}hudUpdate();}
function buildFlow(){flow=new Int16Array(MW*MH).fill(-1);const q=new Int16Array(MW*MH);let r=0,w=0;const idx=(player.y|0)*MW+(player.x|0);flow[idx]=0;q[w++]=idx;while(r<w){const i=q[r++],x=i%MW,y=(i/MW)|0;for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,ni=ny*MW+nx;if(nx<0||ny<0||nx>=MW||ny>=MH||map[ny][nx]!==0||flow[ni]!==-1||!fits(nx+.5,ny+.5,.27))continue;flow[ni]=flow[i]+1;q[w++]=ni;}}}


// SOURCE: run.js
// run.js — bundled from the owner’s liminal baseline.
function startRun(){applyDifficulty();useChapter=true;review.active=false;document.body.classList.remove('testing');$('reviewBar').classList.add('hidden');$('reviewPanelBtn').classList.add('hidden');$('scoreLabel').textContent='SCORE';$('restartBtn').textContent='RESTART RUN';$('retryBtn').textContent='ONE MORE RUN';audio.reset();Object.assign(mods,{damage:1,speed:1,life:1,reload:1,dash:1});for(const g of guns){g.ammo=g.mag;g.reserve=Math.min(g.maxReserve,g.mag*8);}gameTime=score=kills=combo=maxCombo=comboT=0;weapon=0;loadStage(0);hideOverlays();mode='playing';$('hud').classList.remove('hidden');$('touch').classList.remove('hidden');document.body.classList.add('playing');audio.start();if(review.active)reviewHud();lockPointer();}
function hideOverlays(){for(const id of['start','pause','settings','upgrade','end','testWard','mapPanel'])$(id).classList.add('hidden');}
function lockPointer(){canvas.focus?.({preventScroll:true});if(!coarse&&canvas.requestPointerLock){try{const promise=canvas.requestPointerLock();if(promise?.catch)promise.catch(()=>feed('MOUSE CAPTURE UNAVAILABLE\nDRAG TO AIM / ARROWS TO TURN'));}catch{feed('DRAG TO AIM / ARROWS TO TURN');}}}
function releaseInputs(){mouseFire=false;s4tReleaseTrigger();for(const k in keys)delete keys[k];touchMove.x=touchMove.y=0;lookDelta=0;mapHeld=false;touchLook.id=null;stickId=null;$('stickKnob').style.transform='';}
function pauseGame(){if(mode!=='playing')return;mode='paused';releaseInputs();hideOverlays();$('pause').classList.remove('hidden');$('touch').classList.add('hidden');document.body.classList.remove('playing');document.exitPointerLock?.();audio.pause();}
function resumeGame(){hideOverlays();mode='playing';$('touch').classList.remove('hidden');document.body.classList.add('playing');audio.start();lockPointer();}
function finish(won,reason){if(mode!=='playing')return;mode=won?'won':'dead';releaseInputs();document.exitPointerLock?.();document.body.classList.remove('playing');$('touch').classList.add('hidden');hideOverlays();$('end').classList.remove('hidden');$('endLabel').textContent=won?'THREE SEALS / ONE SURVIVOR':'SIGNAL LOST';$('endTitle').textContent=won?'DISCHARGED.':'BACK TO ASH.';$('endReason').textContent=won?'The ward is quiet. For now.':reason;$('endScore').textContent=Math.round(score).toLocaleString();$('endKills').textContent=kills;$('endTime').textContent=formatTime(gameTime);$('endCombo').textContent=maxCombo+'×';if(!review.active&&score>best){best=Math.round(score);try{localStorage.setItem('ashfall-best-v2',best);}catch{}}if(review.active){$('endLabel').textContent='TEST WARD / '+BUILD.id;$('endTitle').textContent=won?'SCENE COMPLETE.':'TEST ENDED.';$('endReason').textContent=won?'Exit reached. Reset this scene or return to Test Ward.':'Retry this scene, or use Test Ward to change the conditions.';}$('retryBtn').textContent=review.active?'RETRY TEST SCENE':won?'NEW RUN':'RETRY CHECKPOINT';audio.end(won);}
function completeWard(){if(mode!=='playing'||!cleared||s4Running())return;if(hwRunning()){hwComplete();return;}if(fvRunning()){if(review.active){fvComplete();return;}fvHandOver();}if(chRunning()){if(review.active){chComplete();return;}chHandOver();}if(review.active){finish(true);return;}if(stage===2){score+=Math.round(5000+player.hp*20);finish(true);return;}mode='upgrade';releaseInputs();document.exitPointerLock?.();document.body.classList.remove('playing');$('touch').classList.add('hidden');hideOverlays();$('upgrade').classList.remove('hidden');$('wardCleared').textContent=chRunning()?'ADMISSIONS COMPLETE':fvRunning()?'FEVER THEATRE COMPLETE':'SEAL 0'+(stage+1)+' BROKEN';const options=[['HOT BLOOD','25% more damage. Reload 20% faster.',()=>{mods.damage*=1.25;mods.reload*=.8;}],['BAD REFLEXES','Move 15% faster. Dash recharges 30% sooner.',()=>{mods.speed*=1.15;mods.dash*=.7;}],['SECOND HEART','Kills restore 35% more life.',()=>{mods.life*=1.35;}]];$('upgradeList').replaceChildren();for(const [name,desc,fn]of options){const b=document.createElement('button');b.className='upgrade';const st=document.createElement('strong');st.textContent=name;const sp=document.createElement('span');sp.textContent=desc;b.append(st,sp);b.onclick=()=>{fn();loadStage(stage+1);resumeGame();};$('upgradeList').append(b);}audio.pause();}
function formatTime(t){return Math.floor(t/60).toString().padStart(2,'0')+':'+Math.floor(t%60).toString().padStart(2,'0');}


// SOURCE: audio.js
// audio.js — bundled from the owner’s liminal baseline.
// Visceral mix: recorded one-shots, HRTF positioning, occlusion, convolution,
// and separate transient/voice/music headroom. Sources and licenses in Credits.
const audio={ctx:null,bank:null,scoreBuffer:null,ready:null,active:false,voices:[],loops:[],lastFoot:0,lastBreath:0,lastHeart:0,lastAmbient:0,lastTick:0,lastVocal:0,painUntil:0,variation:{},
 init(){if(this.ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const a=this.ctx=new AC();
 this.master=a.createGain();this.master.gain.value=.86;
 this.sfx=a.createGain();this.music=a.createGain();this.musicDuck=a.createGain();this.ambience=a.createGain();this.shock=a.createBiquadFilter();this.shock.type='lowpass';this.shock.frequency.value=19500;this.shock.Q.value=.5;
 this.sfx.connect(this.shock);this.ambience.connect(this.shock);this.music.connect(this.musicDuck).connect(this.shock);this.shock.connect(this.master);
 const bass=a.createBiquadFilter();bass.type='lowshelf';bass.frequency.value=130;bass.gain.value=2;
 const limiter=a.createDynamicsCompressor();limiter.threshold.value=-3;limiter.knee.value=3;limiter.ratio.value=16;limiter.attack.value=.002;limiter.release.value=.12;
 const ceiling=a.createWaveShaper();ceiling.curve=Float32Array.from({length:4096},(_,i)=>.965*Math.tanh((i/4095*2-1)*1.05)/Math.tanh(1.05));ceiling.oversample='2x';this.master.connect(bass).connect(limiter).connect(ceiling).connect(a.destination);
 this.room=a.createConvolver();this.room.normalize=false;this.room.buffer=this.impulse(2.65);
 this.roomTone=a.createBiquadFilter();this.roomTone.type='lowpass';this.roomTone.frequency.value=3700;
 this.roomReturn=a.createGain();this.roomReturn.gain.value=.62;this.room.connect(this.roomTone).connect(this.roomReturn).connect(this.sfx);
 this.musicTone=a.createBiquadFilter();this.musicTone.type='lowpass';this.musicTone.frequency.value=11500;this.musicTone.connect(this.music);this.musicBed=a.createGain();this.musicBed.gain.value=1;this.musicBed.connect(this.musicTone);this.impShort=this.room.buffer;this.impLong=this.impulse(7.4);
 this.levels();
 },
 impulse(seconds){const a=this.ctx,b=a.createBuffer(2,Math.ceil(a.sampleRate*seconds),a.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);let low=0;for(let i=0;i<d.length;i++){const t=i/a.sampleRate;low=low*.48+rand(-1,1)*.52;d[i]=low*.0075*Math.exp(-t*3.1)*(t>.013?1:0);}for(const [delay,amp]of[[.021,.42],[.039,.29],[.068,.2],[.109,.16],[.173,.1]])d[Math.floor((delay+ch*.0037)*a.sampleRate)]+=amp;}return b;},
 prepare(){if(this.ready)return this.ready;try{this.init();if(!this.ctx)return Promise.resolve(false);const decode=url=>loadAudioAsset(url,this.ctx);this.ready=Promise.all([decode(AUDIO_DATA.fx),decode(AUDIO_DATA.music),decode(HEART_AUDIO_DATA),decode(NIGHT_AUDIO_DATA.insects),decode(NIGHT_AUDIO_DATA.owl),decode(CERBERUS_AUDIO_DATA)]).then(([fx,music,heart,insects,owl,cerberus])=>{this.bank=fx;this.scoreBuffer=music;this.heartBuffer=heart;this.nightBuffers={insects,owl};this.cbScoreBuffer=cerberus;return true;});return this.ready;}catch(e){this.ready=Promise.reject(e);return this.ready;}},
 levels(){if(!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.setTargetAtTime(settings.mute?0:.86,t,.025);this.sfx.gain.setTargetAtTime(settings.sfx,t,.035);this.music.gain.setTargetAtTime(settings.music*.92*((review.active||mode==='review')&&!review.music?0:1),t,.06);this.ambience.gain.setTargetAtTime(settings.sfx*(liminal.target?.03:hbVictory()?.055:.19),t,.08);},
 start(){this.init();if(!this.ctx)return;if(mode!=='playing')this.heartPresentationReset();if(hbFighting()&&mode!=='playing'&&this.hrt){this.hrt.pulse.gain.cancelScheduledValues(this.ctx.currentTime);this.hrt.pulse.gain.setValueAtTime(.0001,this.ctx.currentTime);}this.ctx.resume().catch(()=>{});this.active=true;this.levels();this.prepare().then(ok=>{if(ok&&this.active&&!this.loops.length)this.startLoops();}).catch(()=>feed('AUDIO COULD NOT START // RELOAD GAME'));},
 startLoops(){const a=this.ctx,s=a.createBufferSource();s.buffer=this.scoreBuffer;s.loop=true;s.connect(this.musicBed);s.start(a.currentTime);this.loops.push(s);for(const key of['roomtone','machinery']){const c=AUDIO_CUES[key];if(!c)continue;const n=a.createBufferSource(),g=a.createGain();n.buffer=this.bank;n.loop=true;n.loopStart=c.start;n.loopEnd=c.start+c.duration;g.gain.value=key==='roomtone'?.78:.27;n.connect(g).connect(this.ambience);n.start(a.currentTime,c.start);this.loops.push(n);}this.lastFoot=this.lastBreath=this.lastHeart=this.lastAmbient=0;this.heartScoreFrame();if(HB.state==='dying')this.heartDeathStart();},
 pause(){this.active=false;if(this.ctx)this.ctx.suspend().catch(()=>{});},
 reset(){this.heartPresentationReset();for(const n of this.loops){try{n.stop();n.disconnect();}catch{}}this.loops=[];for(const v of [...this.voices]){try{v.source.stop();}catch{}}this.voices=[];this.restoreRoom();this.sourcelessClock=6;this.lastFoot=this.lastBreath=this.lastHeart=this.lastAmbient=this.lastTick=0;this.painVoice=null;this.painUntil=0;this.lastVocal=0;if(this.ctx){this.musicDuck.gain.cancelScheduledValues(this.ctx.currentTime);this.musicDuck.gain.value=1;this.shock.frequency.value=19500;}},
 choose(prefix,n){let k=Math.floor(Math.random()*n);if(n>1&&k===this.variation[prefix])k=(k+1)%n;this.variation[prefix]=k;return prefix+k;},
 play(key,{vol=1,rate=1,at=0,pos=null,wet=.2,pan=0,bus=null,follow=null}={}){if(!this.ctx||!this.bank)return null;const c=AUDIO_CUES[key];if(!c)return null;const a=this.ctx,t=Math.max(a.currentTime,at||a.currentTime),source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter();source.buffer=this.bank;source.playbackRate.value=rate;filter.type='lowpass';filter.frequency.value=19000;filter.Q.value=.5;gain.gain.value=vol;source.connect(filter).connect(gain);const nodes=[source,gain,filter];let panner=null;
 if(pos&&a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(bus||this.sfx);nodes.push(panner);}else if(a.createStereoPanner){panner=a.createStereoPanner();panner.pan.value=pan;gain.connect(panner).connect(bus||this.sfx);nodes.push(panner);}else gain.connect(bus||this.sfx);
 const send=a.createGain();send.gain.value=wet;gain.connect(send).connect(this.room);nodes.push(send);
 const v={source,gain,filter,panner,pos:pos?{...pos}:null,follow,vol,send,wet,nodes,until:t+c.duration/rate+.08};if(pos)this.position(v,t);this.voices.push(v);source.onended=()=>{for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};source.start(t,c.start,c.duration);if(this.voices.length>70){const oldest=this.voices.find(x=>x!==v);if(oldest)try{oldest.source.stop();}catch{}}return v;},
 position(v,t){if(!v.pos)return;const p=v.follow&&v.follow.alive?v.follow:v.pos,dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy),blocked=!v.night&&!lineOfSight(player.x,player.y,p.x,p.y),x=(dy*Math.cos(player.a)-dx*Math.sin(player.a))*1.7,z=-(dx*Math.cos(player.a)+dy*Math.sin(player.a))*1.7;
 const atten=1/(1+d*(v.night?.055:.21))*(blocked?.33:1);v.gain.gain.setTargetAtTime(v.vol*atten,t,.045);v.filter.frequency.setTargetAtTime(v.night?2200:blocked?850:Math.max(3000,17000-d*750),t,.05);v.send.gain.setTargetAtTime(v.wet*(blocked?1.9:1+d*.05),t,.07);
 if(v.panner?.positionX){v.panner.positionX.setTargetAtTime(x,t,.025);v.panner.positionY.setTargetAtTime((p.z||.5)-.52,t,.025);v.panner.positionZ.setTargetAtTime(z,t,.025);}else if(v.panner?.pan)v.panner.pan.setTargetAtTime(clamp(x/(d*1.7+.1),-1,1),t,.025);},
 duck(amount=.65,duration=.2){if(!this.ctx)return;const t=this.ctx.currentTime,g=this.musicDuck.gain;g.cancelScheduledValues(t);g.setTargetAtTime(amount,t,.009);g.setTargetAtTime(1,t+duration,.12);},
 fire(w){if(!this.active)return;const t=this.ctx?.currentTime||0;if(w===0){this.play(this.choose('shotgun',3),{vol:1.0,rate:rand(.965,1.03),wet:.32});this.play('rack',{vol:.48,at:t+.19,wet:.13,pan:.12});this.play('shell',{vol:.27,at:t+.37,wet:.25,pan:.7});this.duck(.48,.16);}else if(w===1){this.play(this.choose('plasma',3),{vol:.58,rate:rand(.96,1.05),wet:.2,pan:rand(-.06,.06)});this.duck(.79,.055);}else{this.play(this.choose('cannon',2),{vol:1.12,wet:.5});this.duck(.38,.4);}},
 boom(strength=1,position=null){this.play(this.choose('blast',2),{vol:Math.min(1.15,strength),pos:typeof position==='object'?position:null,wet:.54,rate:rand(.91,1.02)});this.duck(.48,.25);},
 creature(e,attack=false){if(!this.active||!this.ctx)return;const d=Math.hypot(e.x-player.x,e.y-player.y);if(d>16)return;const t=this.ctx.currentTime;if(!attack&&t-this.lastVocal<.55)return;this.lastVocal=t;const prefix=e.type===0?(attack?'scream':'patient'):e.type===1?(attack?'shriek':'crawler'):(attack?'roar':'brute');const counts={scream:2,patient:3,shriek:2,crawler:3,roar:2,brute:3};this.play(this.choose(prefix,counts[prefix]),{vol:attack?1.05:.7,pos:e,follow:e,rate:rand(.93,1.06),wet:attack?.4:.55});},
 flesh(e=null,heavy=false){this.play(this.choose(heavy?'gore':'flesh',heavy?3:3),{vol:heavy?.8:.4,pos:e,wet:.18,rate:rand(.9,1.12)});},
 kill(e=null){this.flesh(e,true);if(e&&Math.random()<.6)this.play(this.choose('death',3),{vol:.64,pos:e,wet:.4,rate:e.type===2?.7:e.type===1?1.2:.9});},
 hit(amount=15){if(!this.ctx)return;const t=this.ctx.currentTime;this.play(this.choose('bodyhit',3),{vol:.83,wet:.14});if(t>this.painUntil){if(this.painVoice){this.painVoice.gain.gain.setTargetAtTime(.001,t,.015);try{this.painVoice.source.stop(t+.07);}catch{}}this.painVoice=this.play(this.choose('pain',4),{vol:1.0,wet:.09,rate:rand(.94,1.025)});this.painUntil=t+.55;}if(player.hp<35)this.play('gasp',{vol:.58,at:t+.4,wet:.08});this.duck(.24,.5);this.shock.frequency.cancelScheduledValues(t);this.shock.frequency.setTargetAtTime(4200,t,.008);this.shock.frequency.setTargetAtTime(19500,t+.19,.28);},
 dash(){this.play('dash',{vol:.64,wet:.2});this.play('effort',{vol:.32,wet:.035,rate:rand(.94,1.07)});},
 swing(){this.play('swing',{vol:.62,wet:.18});this.play('effort',{vol:.3,wet:.02,rate:1.08});},
 reload(phase='start'){this.play(phase==='end'?'rack':'reload',{vol:.5,wet:.12,pan:.12});},
 dry(){this.play('dry',{vol:.5,wet:.09});},
 pickup(){this.play('pickup',{vol:.28,wet:.38});},
 seal(){this.play('seal',{vol:.85,wet:.65});this.duck(.4,.7);},
 tick(){if(!this.active||!this.ctx||!this.bank||mode!=='playing')return;const t=this.ctx.currentTime;if(t-this.lastTick>.05){this.lastTick=t;for(const v of this.voices)if(v.pos)this.position(v,t);this.musicTone.frequency.setTargetAtTime(9500+stage*1500,t,.3);}
 const speed=Math.hypot(player.vx,player.vy);if(speed>.9&&dashT<=0&&t-this.lastFoot>.29/Math.max(.8,speed/4.65)){this.lastFoot=t;this.play(this.choose('step',4),{vol:.27+speed*.018,wet:.25,pan:this.variation.step%2?.12:-.12,rate:rand(.92,1.07)});}
 if(player.hp<38&&t-this.lastHeart>(player.hp<20?.48:.64)){this.lastHeart=t;this.play('heartbeat',{vol:(1-player.hp/65)*.55,wet:0});}
 if((player.hp<45||speed>5)&&t-this.lastBreath>(player.hp<25?2.1:4.3)&&t>this.painUntil+.5){this.lastBreath=t;this.play(this.choose('breath',3),{vol:player.hp<25?.64:.32,wet:.06});}
 if(t-this.lastAmbient>rand(4,7)){this.lastAmbient=t;const loc=environmentProps?.find(p=>Math.hypot(p.x-player.x,p.y-player.y)>2&&Math.hypot(p.x-player.x,p.y-player.y)<9);if(loc)this.play(this.choose('environment',4),{vol:.55,pos:loc,wet:.62});}
 },
 end(won){if(!this.ctx)return;this.active=false;const t=this.ctx.currentTime;this.musicDuck.gain.cancelScheduledValues(t);this.musicDuck.gain.setTargetAtTime(won?.28:.06,t,.16);if(won)this.play('seal',{vol:.95,wet:.65});else{if(this.painVoice){try{this.painVoice.source.stop();}catch{}}this.play('agony',{vol:1.03,wet:.22});this.play('bodyfall',{vol:.8,at:t+.45,wet:.4});}}
};

// SOURCE: combat.js
// combat.js — bundled from the owner’s liminal baseline.
function changeWeapon(n){if(s4dLocked()||mode!=='playing')return;const count=s4tCarried()?4:3;n=((n%count)+count)%count;if(n===weapon)return;weapon=n;if(n<3)S4T.previousGun=n;reloadT=reloadDuration=0;weaponDrop=.2;shotCD=Math.max(shotCD,.16);if(n<3)audio.reload('end');else audio.seraphimCue('throw');hudUpdate();}
function reload(){if(s4dLocked()||weapon===3)return;const g=guns[weapon];if(review.active&&review.unlimited)g.reserve=g.maxReserve;if(mode!=='playing'||reloadT>0||g.ammo===g.mag||g.reserve<=0)return;reloadT=reloadDuration=g.reload*mods.reload;audio.reload();}
function alertNoise(x,y,radius){for(const e of enemies){if(!e.alive||e.noticed||e.dormant)continue;if(e.enc&&!CH.live[e.enc])continue;const d=Math.hypot(e.x-x,e.y-y);if(d>radius)continue;if(d<radius*.6||lineOfSight(x,y,e.x,e.y)){e.noticed=true;e.alertT=rand(.15,.6);}}}
function emit(x,y,z,col,count=12,power=1){for(let i=0;i<count;i++){if(particles.length>440)particles.shift();const a=rand(0,TAU),sp=rand(.3,3.4)*power;particles.push({x,y,z,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,vz:rand(.2,3.6)*power,life:rand(.2,.6),max:.6,size:rand(.016,.05)*power,color:col});}}
function ring(x,y,color,radius=2,life=.35){rings.push({x,y,color,radius,life,max:life});}
function damageEnemy(e,amount,push=0){if(!e.alive)return;if(e.s4Quest&&e.dormant)s4qWake(e.s4Group);if(e.dormant){hitmarker=.12;if(Math.random()<.5)audio.flesh(e);emit(e.x,e.y,.9,'#8d9a86',5,.5);return;}e.noticed=true;e.alertT=.2;if(e.enc&&typeof CH!=='undefined'&&CH.live&&!CH.live[e.enc]&&typeof chActivate==='function')chActivate(e.enc);e.hp-=amount*mods.damage;e.hurt=.14;e.noticed=true;hitmarker=.12;const d=Math.hypot(e.x-player.x,e.y-player.y)||1;if(push)move(e,(e.x-player.x)/d*push,(e.y-player.y)/d*push);if(e.hp<=0)killEnemy(e);}
function killEnemy(e){if(!e.alive)return;if(typeof CH!=='undefined'&&CH.counter){chCounterKill(e);return;}e.alive=false;e.death=.38;kills++;stageKills++;combo=comboT>0?combo+1:1;comboT=3.4;maxCombo=Math.max(maxCombo,combo);const close=Math.hypot(e.x-player.x,e.y-player.y)<2.1;const earned=hbReward(e,Math.round(creatureTypes[e.type].score*(1+Math.min(combo-1,15)*.2)*(close?1.35:1)));score+=earned;const heal=(18+(e.type===2?7:0)+(close?5:0))*mods.life;player.hp=Math.min(100,player.hp+heal);for(let i=0;i<3;i++){const g=guns[i],gain=i===0?3:i===1?12:(kills%3===0?1:0);g.reserve=Math.min(g.maxReserve,g.reserve+gain);}emit(e.x,e.y,.55,creatureTypes[e.type].color,32,e.type===2?1.45:1);emit(e.x,e.y,.7,'#f3e5c7',10,.8);ring(e.x,e.y,creatureTypes[e.type].color,.8,.24);decals.push({x:e.x,y:e.y,r:rand(.22,.4),color:e.type===1?'#137888':'#781653'});if(decals.length>80)decals.shift();numbers.push({x:e.x,y:e.y,z:1.15,text:'+'+earned,color:'#d5ff42',life:.75});hitstop=.025;killmarker=.2;shake=Math.max(shake,2.6);audio.kill(e);feed((close?'POINT BLANK +35%\n':'')+'SIGNAL +'+Math.round(heal)+(combo>1?' / '+combo+' KILL CHAIN':''));if(combo===3||combo===6||combo===10||combo%15===0)say(combo>=10?'CATASTROPHIC.':combo>=6?'KEEP. FEEDING.':'BLOOD IN THE CIRCUIT.',1.2);if(e.s4Quest)s4qProgress();if(chRunning()){chKill(e);return;}if(fvRunning()||hwRunning()||s4Running())return;if((!review.active||!reviewFixture())&&stageKills>=quotas[stage]&&!cleared){cleared=true;score+=1000;player.hp=Math.min(100,player.hp+20);say('SEAL BROKEN // FIND THE EXIT',2.8);audio.seal();}}
function shoot(){if(s4dLocked()||(s4tRunning()&&S4T.throwLatch))return;if(weapon===3){s4tThrow();return;}if(review.active&&review.unlimited)for(const g of guns)g.reserve=g.maxReserve;if(mode!=='playing'||shotCD>0||reloadT>0||meleeT>.1)return;const g=guns[weapon];if(g.ammo<=0){if(g.reserve>0)reload();else{shotCD=.22;audio.dry();feed('EMPTY // Q MELEE TO REFILL');}return;}g.ammo--;alertNoise(player.x,player.y,weapon===0?20:weapon===1?14:26);shotCD=g.rate;recoil=1;muzzle=weapon===1?.07:.14;shake=Math.max(shake,weapon===0?4:weapon===1?1.7:7);audio.fire(weapon);const origin=hbFighting()||cbRunning()?0:.3,ox=player.x+Math.cos(player.a)*origin,oy=player.y+Math.sin(player.a)*origin;
 if(weapon===0){let got=false,bossDamage=0,bossPoint=null;const totals=new Map();for(let i=0;i<g.pellets;i++){const a=player.a+(i/(g.pellets-1)-.5)*g.spread+rand(-.012,.012),dx=Math.cos(a),dy=Math.sin(a),hit=castRay(player.x,player.y,dx,dy,12);let closest=hit.d,enemy=null,boss=cbRay(player.x,player.y,dx,dy,hit.d+.03)||hbRay(player.x,player.y,dx,dy,hit.d+.03);if(boss)closest=boss.d;for(const e of enemies){if(!e.alive)continue;const ex=e.x-player.x,ey=e.y-player.y,along=ex*dx+ey*dy,across=Math.abs(ex*dy-ey*dx);if(along>.1&&along<closest&&across<e.r+.13&&lineOfSight(player.x,player.y,e.x,e.y)){closest=along;enemy=e;boss=null;}}if(enemy){got=true;totals.set(enemy,(totals.get(enemy)||0)+g.damage*clamp(1-closest*.038,.48,1));}else if(boss){bossDamage+=g.damage*clamp(1-closest*.038,.48,1);bossPoint=boss;}else if(i%3===0)emit(player.x+dx*(closest-.03),player.y+dy*(closest-.03),.5,g.color,4,.4);if(i%4===0)tracers.push({x:player.x+dx*closest,y:player.y+dy*closest,z:.5,life:.07,color:g.color});}for(const[e,damage]of totals){damageEnemy(e,damage,.16);emit(e.x,e.y,.65,g.color,9,.65);}if(bossDamage>0)(bossPoint.cerberus?cbDamage:hbDamage)(bossDamage,bossPoint,'shotgun');if(got)audio.flesh();
 }else bullets.push({x:ox,y:oy,a:player.a+rand(-.007,.007),speed:weapon===1?21:11,damage:g.damage,kind:weapon===1?'plasma':'grave',life:2.5,r:weapon===1?.1:.22,owner:'player',color:g.color,z:.52});
 if(g.ammo===0&&g.reserve>0)feed('R TO RELOAD / SWITCH WEAPONS');hudUpdate();}
function melee(){if(s4dLocked()||weapon===3)return;if(mode!=='playing'||meleeCD>0)return;alertNoise(player.x,player.y,5);meleeT=.27;meleeCD=.62;shake=Math.max(shake,3);audio.swing();let hit=false;for(const e of enemies){if(!e.alive)continue;const d=Math.hypot(e.x-player.x,e.y-player.y),a=angle(Math.atan2(e.y-player.y,e.x-player.x)-player.a);if(d<1.5&&Math.abs(a)<.85&&lineOfSight(player.x,player.y,e.x,e.y)){damageEnemy(e,65,.48);emit(e.x,e.y,.6,'#ff327c',18);hit=true;}}const boss=cbRay(player.x,player.y,Math.cos(player.a),Math.sin(player.a),1.35)||hbRay(player.x,player.y,Math.cos(player.a),Math.sin(player.a),1.35);if(boss)(boss.cerberus?cbDamage:hbDamage)(45,boss,'melee');if(hit){audio.flesh(null,true);guns[0].reserve=Math.min(72,guns[0].reserve+3);feed('MELEE // +3 SHELLS');}}
function dash(){if(s4dLocked())return;if(mode!=='playing'||dashCD>0)return;let x=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchMove.x,y=(keys.KeyW?1:0)-(keys.KeyS?1:0)-touchMove.y;if(Math.hypot(x,y)<.1){x=0;y=1;}const len=Math.hypot(x,y);player.vx=(Math.cos(player.a)*y-Math.sin(player.a)*x)/len*16;player.vy=(Math.sin(player.a)*y+Math.cos(player.a)*x)/len*16;if((liminal.fed&&liminal.fed.locked)||(typeof CH!=='undefined'&&CH.tr&&CH.tr.fed)){player.vx=Math.abs(player.vx);}dashT=.17;dashCD=1.25*mods.dash;audio.dash();shake=Math.max(shake,1.5);}
function hurtPlayer(amount,reason){if((s4tRunning()&&!cbRunning())||cbfSafe()||s4dLocked()||(S4D.on&&S4D.safeT>0))return;if(hbVictory()||dashT>0||hurt>.22||mode!=='playing'||(review.active&&!review.damage))return;player.hp-=amount*[.65,1,1.3][difficulty];hurt=.42;shake=Math.max(shake,5);comboT=Math.max(0,comboT-.45);audio.hit(amount);if(player.hp<=0){player.hp=0;finish(false,reason||'The ward found a way in. Dash through danger and keep feeding your signal.');}}
function explode(q){hbExplosion(q);cbExplosion(q);const big=q.kind==='grave',radius=big?2.65:.45;if(!big&&Math.random()<.5)audio.flesh({x:q.x,y:q.y});ring(q.x,q.y,q.color,radius,big?.48:.18);emit(q.x,q.y,q.z,q.color,big?65:10,big?1.6:.65);if(big){audio.boom(1,{x:q.x,y:q.y});shake=Math.max(shake,clamp(11/Math.max(1,Math.hypot(q.x-player.x,q.y-player.y)),2,9));whiteFlash=.065;}for(const e of enemies){if(!e.alive)continue;const d=Math.hypot(e.x-q.x,e.y-q.y);if(d<radius&&lineOfSight(q.x,q.y,e.x,e.y))damageEnemy(e,q.damage*(big?clamp(1-d/radius,.2,1):1),big?.22:.02);}}
function updateBullets(dt){
 // An impact can cross the boss threshold and replace the live shot list.
 // Walk this frame's stable identities; removed shots never run afterward.
 const pending=bullets.slice();
 for(let i=pending.length-1;i>=0;i--){
 const q=pending[i],index=bullets[i]===q?i:bullets.indexOf(q);if(index<0)continue;
 if(q.cancelled||(q.owner==='enemy'&&hbVictory()&&hbInside(q.x,q.y))){bullets.splice(index,1);continue;}q.life-=dt;let done=q.life<=0;const steps=Math.max(1,Math.ceil(q.speed*dt/.1));for(let s=0;s<steps&&!done;s++){const dx=Math.cos(q.a)*q.speed*dt/steps,dy=Math.sin(q.a)*q.speed*dt/steps;const boss=q.owner==='player'?(cbProjectileContact(q,dx,dy)||hbProjectileContact(q,dx,dy)):null;if(boss){if(boss.cerberus)q.cbHit=boss;else q.hbHit=boss;q.x=boss.x-Math.cos(q.a)*.035;q.y=boss.y-Math.sin(q.a)*.035;done=true;break;}if(s4Running()?s4ShotBlocked(q.x+dx,q.y+dy):wall(q.x+dx,q.y+dy)){done=true;break;}q.x+=dx;q.y+=dy;if(q.cb){q.cbTravel+=Math.hypot(dx,dy);q.z=mix(q.cbZ0,.52,Math.min(1,q.cbTravel/q.cbTargetD));}if(q.owner==='enemy'){if(Math.hypot(q.x-player.x,q.y-player.y)<(q.cbYap?.275:.32)){hurtPlayer(q.damage,q.cbYap?'The little head fires through the others. Find the moving gaps; gunfire can stagger all three.':q.cb?'The Shepherd aims before it spits. Move across its salvo, or dash through the gap.':'An Orderly cut your signal. Its acid bolts can be sidestepped or dashed through.');done=true;}}else for(const e of enemies){if(e.alive&&Math.hypot(q.x-e.x,q.y-e.y)<e.r+q.r){done=true;break;}}}
 if(done){
  // Consume this exact projectile before impact callbacks clear other shots.
  const liveIndex=bullets[index]===q?index:bullets.indexOf(q);if(liveIndex>=0)bullets.splice(liveIndex,1);
  if(q.owner==='player')explode(q);else emit(q.x,q.y,.5,q.color,q.cbYap?2:9,.7);
 }else if(particles.length<440&&Math.random()<(q.cbYap?.14:.7))particles.push({x:q.x,y:q.y,z:q.z,vx:0,vy:0,vz:0,life:.12,max:.12,size:q.r*.4,color:q.color});
 }}

// SOURCE: enemies.js
// enemies.js — bundled from the owner’s liminal baseline.
function enemyAI(dt){if(cbRunning()&&CB.lureCommitted)return;if(review.active&&!review.ai&&liminal.mode!=='mirror')return;flowClock-=dt;if(flowClock<=0){buildFlow();flowClock=.28;}for(const e of enemies){if(!e.alive){e.death=Math.max(0,e.death-dt);continue;}if(fvSuppressed(e)){e.hurt=Math.max(0,e.hurt-dt);e.walk+=dt;continue;}if(e.dormant){e.hurt=Math.max(0,e.hurt-dt);e.walk+=dt;continue;}if(liminal.mode==='mirror'){mirrorEnemy(e,dt);continue;}e.hurt=Math.max(0,e.hurt-dt);e.cd-=dt;e.vocal-=dt;e.walk+=dt;const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||.01,sees=d<13&&lineOfSight(e.x,e.y,player.x,player.y);if(e.enc&&!CH.live[e.enc]&&!e.noticed)continue;if(sees||d<5){if(!e.noticed)e.alertT=.35;e.noticed=true;}if(!e.noticed)continue;if(e.alertT>0){e.alertT-=dt;if(e.alertT<=0)for(const o of enemies){if(o===e||!o.alive||o.noticed||o.dormant)continue;if(o.enc&&!CH.live[o.enc])continue;if(Math.hypot(o.x-e.x,o.y-e.y)<6.5&&lineOfSight(e.x,e.y,o.x,o.y)){o.noticed=true;o.alertT=.5;}}}if(e.vocal<=0&&d<8){audio.creature(e);e.vocal=rand(3,7);}if(e.hurt>.045)continue;
 if(e.windup>0){e.windup-=dt;if(e.windup<=0){if(e.type===2){const a=Math.atan2(dy,dx);for(let i=-1;i<=1;i++)bullets.push({x:e.x+Math.cos(a)*.35,y:e.y+Math.sin(a)*.35,a:a+i*.15,speed:4.7,damage:14,kind:'acid',life:3,r:.14,owner:'enemy',color:'#caff47',z:.58});e.cd=2.2;}else{e.charge=.32;e.dx=dx/d;e.dy=dy/d;e.cd=2;}}continue;}
 if(e.charge>0){e.charge-=dt;move(e,e.dx*6.8*dt,e.dy*6.8*dt);if(d<.7){hurtPlayer(creatureTypes[e.type].damage);e.charge=0;}continue;}
 if(e.type===2&&sees&&d>2.5&&d<8&&e.cd<=0){e.windup=.7;audio.creature(e,true);continue;}
 if(e.type===1&&sees&&d>1.3&&d<4.1&&e.cd<=0){e.windup=.32;audio.creature(e,true);continue;}
 if(d<.78&&e.cd<=0){hurtPlayer(creatureTypes[e.type].damage);e.cd=e.type===2?1.15:.8;audio.creature(e,true);continue;}
 if(d>.6){let mx=dx/d,my=dy/d;if(!sees||!clearFurniturePath(e.x,e.y,player.x,player.y,e.r)){const ix=e.x|0,iy=e.y|0;let best=flow[iy*MW+ix],tx=e.x,ty=e.y;for(const [xx,yy]of[[ix+1,iy],[ix-1,iy],[ix,iy+1],[ix,iy-1]]){const v=flow[yy*MW+xx];if(v>=0&&(v<best||best<0)){best=v;tx=xx+.5;ty=yy+.5;}}const dd=Math.hypot(tx-e.x,ty-e.y)||1;mx=(tx-e.x)/dd;my=(ty-e.y)/dd;}
 let speed=creatureTypes[e.type].speed*(1+stage*.1)*[.82,1,1.12][difficulty];if(e.type===0)speed*=Math.sin(e.walk*10+e.phase)>.2?1.5:.6;if(e.type===2&&sees&&d<4)speed*=.35;for(const other of enemies){if(!other.alive||other===e)continue;const xx=e.x-other.x,yy=e.y-other.y,sep=Math.hypot(xx,yy);if(sep>.02&&sep<.55){mx+=xx/sep*(.55-sep)*2;my+=yy/sep*(.55-sep)*2;}}if(nowTime<flinchUntil&&d<2.5){mx=-mx;my=-my;speed*=.72;}move(e,mx*speed*dt,my*speed*dt);}
}}


// SOURCE: effects.js
// effects.js — bundled from the owner’s liminal baseline.
function updateEffects(dt){for(let i=particles.length-1;i>=0;i--){const q=particles[i];q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.vz-=7*dt;if(q.z<.02){q.z=.02;q.vz=Math.abs(q.vz)*.24;q.vx*=.65;q.vy*=.65;}if(q.life<=0)particles.splice(i,1);}for(const arr of[rings,tracers,numbers])for(let i=arr.length-1;i>=0;i--){arr[i].life-=dt;if(arr===numbers)arr[i].z+=dt*.4;if(arr[i].life<=0)arr.splice(i,1);}for(let i=drops.length-1;i>=0;i--){const q=drops[i];if(Math.hypot(q.x-player.x,q.y-player.y)<.6){if(q.type==='life'){player.hp=Math.min(100,player.hp+35);feed('SIGNAL +35');}else{for(const g of guns)g.reserve=Math.min(g.maxReserve,g.reserve+g.mag*2);feed('ALL AMMUNITION REPLENISHED');}audio.pickup();drops.splice(i,1);if(s4qRunning())s4qSave();}}}


// SOURCE: simulation.js
// simulation.js — bundled from the owner’s liminal baseline.
function update(dt){audio.tick(dt);liminalTick(dt);if(mode!=='playing')return;if(s4dLocked()){gameTime+=dt;stageTime+=dt;s4dTick(dt);hudUpdate();return;}if(hitstop>0){hitstop-=dt;return;}chTick(dt);fvTick(dt);hwTick(dt);s4Tick(dt);s4dTick(dt);s4tTick(dt);cbTick(dt);if(mode!=='playing')return;reviewTick(dt);gameTime+=dt;stageTime+=dt;grace=Math.max(0,grace-dt);
 if(keys.ArrowLeft)player.a-=dt*2.2;if(keys.ArrowRight)player.a+=dt*2.2;player.a=angle(player.a);aimPitch*=Math.exp(-dt*5);sway=mix(sway,clamp(lookDelta*.03,-1,1),1-Math.exp(-dt*10));lookDelta=0;
 const mx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+touchMove.x,my=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-touchMove.y,len=Math.max(1,Math.hypot(mx,my)),speed=4.65*mods.speed;
 if(dashT>0){dashT-=dt;}else{const a=1-Math.exp(-dt*20);let _tvx=(Math.cos(player.a)*my-Math.sin(player.a)*mx)/len*speed,_tvy=(Math.sin(player.a)*my+Math.cos(player.a)*mx)/len*speed;if((liminal.fed&&liminal.fed.locked)||(typeof CH!=='undefined'&&CH.tr&&CH.tr.fed))_tvx=Math.abs(_tvx);player.vx=mix(player.vx,_tvx,a);player.vy=mix(player.vy,_tvy,a);}move(player,player.vx*dt,player.vy*dt);if(fits(player.x,player.y)){_safeX=player.x;_safeY=player.y;}else if(_safeX!==null){player.x=_safeX;player.y=_safeY;player.vx=player.vy=0;}const moving=Math.hypot(player.vx,player.vy);bob+=dt*moving*2.5;
 shotCD=Math.max(0,shotCD-dt);dashCD=Math.max(0,dashCD-dt);meleeCD=Math.max(0,meleeCD-dt);meleeT=Math.max(0,meleeT-dt);weaponDrop=Math.max(0,weaponDrop-dt);recoil=Math.max(0,recoil-dt*(weapon===1?7:5));muzzle=Math.max(0,muzzle-dt);shake*=Math.exp(-dt*15);hurt=Math.max(0,hurt-dt);hitmarker=Math.max(0,hitmarker-dt);killmarker=Math.max(0,killmarker-dt);whiteFlash=Math.max(0,whiteFlash-dt);comboT=Math.max(0,comboT-dt);if(comboT<=0)combo=0;msgT=Math.max(0,msgT-dt);feedT=Math.max(0,feedT-dt);
 if(reloadT>0&&weapon<3){reloadT-=dt;if(reloadT<=0){const g=guns[weapon],n=Math.min(g.mag-g.ammo,g.reserve);g.ammo+=n;g.reserve-=n;audio.reload('end');}}if(mouseFire||keys.KeyF)shoot();enemyAI(dt);if(mode!=='playing')return;updateBullets(dt);updateEffects(dt);if(cleared&&Math.hypot(player.x-exit.x,player.y-exit.y)<.75)completeWard();hudClock-=dt;if(hudClock<=0){hudUpdate();hudClock=.06;}}


// SOURCE: environment.js
// environment.js — bundled from the owner’s liminal baseline.
// Low resolution textured raycasting with true per-column sprite occlusion.
const textures=[];let monsterSprites=[],gunSprites=[],artReady=false;
function prepareAtlas(src,isGun){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{const out=[],step=img.width/3;for(let k=0;k<3;k++){const source=document.createElement('canvas');source.width=Math.round(step);source.height=img.height;const s=source.getContext('2d',{willReadFrequently:true});s.drawImage(img,k*step,0,step,img.height,0,0,source.width,source.height);const d=s.getImageData(0,0,source.width,source.height).data;let left=source.width,top=source.height,right=0,bottom=0;for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(d[(y*source.width+x)*4+3]>32){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}if(right<=left||bottom<=top)throw Error('Empty sprite');const sprite=document.createElement('canvas');sprite.height=isGun?400:320;sprite.width=Math.max(1,Math.round((right-left+1)/(bottom-top+1)*sprite.height));const sc=sprite.getContext('2d');sc.imageSmoothingEnabled=true;sc.drawImage(source,left,top,right-left+1,bottom-top+1,0,0,sprite.width,sprite.height);const hit=document.createElement('canvas');hit.width=sprite.width;hit.height=sprite.height;const hc=hit.getContext('2d');hc.drawImage(sprite,0,0);hc.globalCompositeOperation='source-atop';hc.fillStyle='#fff5d6';hc.fillRect(0,0,hit.width,hit.height);out.push({image:sprite,hit,aspect:sprite.width/sprite.height});}resolve(out);}catch(e){reject(e);}};img.onerror=()=>reject(Error('Artwork could not load'));img.src=src;});}
let horizon=H/2,projection=390,camDX=1,camDY=0,planeX=0,planeY=.78;
// Hospital geometry and material lighting, projected into the raycast world.
const materialCanvases=[],materialPixels=[];
let environmentProps=[],furniture=[],wardLights=[],lightField=new Float32Array(128*128*3),meshFaces=[];
function prepareEnvironment(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{for(let i=0;i<4;i++){const c=document.createElement('canvas');c.width=c.height=256;const p=c.getContext('2d',{willReadFrequently:true});p.drawImage(img,(i%2)*img.width/2,(i>>1)*img.height/2,img.width/2,img.height/2,0,0,256,256);materialCanvases[i]=c;materialPixels[i]=p.getImageData(0,0,256,256).data;}resolve();}catch(e){reject(e);}};img.onerror=reject;img.src=src;});}
function setupEnvironment(){if(useChapter&&stage===3){s4SetupEnvironment();return;}if(useChapter&&stage===0){chSetupEnvironment();return;}if(useChapter&&stage===1){fvSetupEnvironment();return;}if(useChapter&&stage===2){hwSetupEnvironment();return;}environmentProps=[];furniture=[];wardLights=[];
 const add=(kind,x,y,a=0,extra={})=>environmentProps.push({kind,x,y,a,...extra});
 // Ward edges carry shallow fixtures; doorway lanes remain open at full speed.
 const beds=[[2.0,2.36,0],[5.5,7.65,0],[10.7,1.35,0],[15.63,5.95,Math.PI/2],[18.36,2.7,Math.PI/2],[23.64,6.55,Math.PI/2],[23.64,12.1,Math.PI/2],[18.36,14.85,Math.PI/2],[11.7,11.36,0],[13.7,17.64,0],[1.36,11.25,Math.PI/2],[4.15,17.63,0],[7.35,20.36,0],[19,23.63,0]];
 beds.forEach(([x,y,a],i)=>add(i%4===2?'shrouded':'bed',x,y,a,{seed:i}));
 for(const [x,y,a]of[[1.3,5.9,0],[6.65,6.4,Math.PI],[9.3,6.15,0],[14.65,1.35,Math.PI],[22.8,8.65,-Math.PI/2],[18.28,11.8,0],[15.65,15.0,Math.PI],[6.65,11.4,Math.PI],[11.8,20.28,Math.PI/2],[21.65,22.3,Math.PI]])add('monitor',x,y,a);
 const doors=[[7.55,5,Math.PI/2,'ADMISSIONS'],[16.6,5,Math.PI/2,'ISOLATION'],[21,9.55,0,'MORGUE'],[16.6,14,Math.PI/2,'THEATRE'],[7.55,14,Math.PI/2,'RECOVERY'],[4,8.75,0,'TRIAGE'],[13,18.6,0,'LOWER WARD'],[21,18.6,0,'NO RETURN']];
 for(const [x,y,a,label]of doors)add('arch',x,y,a,{label});
 const rooms=[[3.7,4.6,5.5],[12.4,4.5,5.5],[20.6,4.6,6.3],[20.7,13.6,5.5],[12.3,14.5,5.4],[3.7,13.8,6.4],[13.9,22,10.8]];
 rooms.forEach(([x,y,length],i)=>{const col=i%3===0?[.24,1.05,1.16]:i%3===1?[1.25,.18,.44]:[1.1,.73,.28];wardLights.push({x,y,rgb:col});add('lamp',x,y,0,{color:i%3===0?'#8be5df':i%3===1?'#ff3e70':'#edc17b',seed:i});add('pipe',x,y-1.15,0,{length});if(i%2===1)add('curtain',x-1.35,y-1.7,0,{seed:i});});
 for(const [x,y,a,label]of[[1.03,3.25,Math.PI/2,'TRIAGE / 01'],[12.3,1.025,0,'NO VISITORS'],[23.97,3.8,-Math.PI/2,'QUARANTINE'],[20.7,16.975,Math.PI,'MORTUARY'],[11.8,11.025,0,'SURGERY'],[1.025,15.3,Math.PI/2,'DO NOT RESUSCITATE'],[18.2,23.975,Math.PI,'FOLLOW THE SIGNAL']])add('sign',x,y,a,{label});
 rebuildFurniture();
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){const wx=(x+.5)/2,wy=(y+.5)/2,i=(y*128+x)*3;let r=.23,g=.29,b=.33;for(const l of wardLights){const d2=(wx-l.x)**2+(wy-l.y)**2,fall=.85/(1+d2*.25);r+=l.rgb[0]*fall;g+=l.rgb[1]*fall;b+=l.rgb[2]*fall;}lightField[i]=r;lightField[i+1]=g;lightField[i+2]=b;}
 bakeLightActive();
}
let furnGrid=null;
function furnitureIndex(){furnGrid=new Map();for(const p of furniture){const x0=Math.max(0,Math.floor(p.x-1.3)),x1=Math.min(MW-1,Math.floor(p.x+1.3)),y0=Math.max(0,Math.floor(p.y-1.3)),y1=Math.min(MH-1,Math.floor(p.y+1.3));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const k=y*MW+x;let a=furnGrid.get(k);if(!a){a=[];furnGrid.set(k,a);}a.push(p);}}}
function furnitureFree(x,y,r){if(!furnGrid)return true;const a=furnGrid.get((y|0)*MW+(x|0));if(!a)return true;for(const p of a){const dx=x-p.x,dy=y-p.y;if(Math.abs(dx)>1.2||Math.abs(dy)>1.2)continue;const lx=dx*p.c+dy*p.s,ly=-dx*p.s+dy*p.c;if(Math.abs(lx)<p.hx+r&&Math.abs(ly)<p.hy+r)return false;}return true;}
function clearFurniturePath(ax,ay,bx,by,r){const n=Math.ceil(Math.hypot(bx-ax,by-ay)*4);for(let i=1;i<=n;i++)if(!furnitureFree(mix(ax,bx,i/n),mix(ay,by,i/n),r))return false;return true;}


// SOURCE: renderer.js
// renderer.js — bundled from the owner’s liminal baseline.
function worldRender(){
 const travel=mode==='playing'?Math.min(1,Math.hypot(player.vx,player.vy)/5):0;
 const fov=1.4+(settings.reduce?0:(dashT>0?.15:travel*.04));projection=W/(2*Math.tan(fov/2));
 horizon=H*.48+aimPitch+(settings.reduce?0:Math.sin(bob*2)*travel*1.3);
 camDX=Math.cos(player.a);camDY=Math.sin(player.a);planeX=-camDY*Math.tan(fov/2);planeY=camDX*Math.tan(fov/2);
 horrorView=horrorFrame();if(s4Running()){s4WorldRender();return;}const hv=horrorView,ha=hv.active;
 const _lm=liminal.mix,core=hv.core,drain=ha&&stage===2?hv.collapse:0;
 const fogR=ha&&stage===2?mix(mix(17,31,core),9,drain*core):mix(stage===2?20:10,LIM_FOG[0],_lm);
 const fogG=ha&&stage===2?mix(mix(7,3,core),17,drain*core):mix(stage===2?8:13,LIM_FOG[1],_lm);
 const fogB=ha&&stage===2?mix(mix(25,18,core),25,drain*core):mix(21,LIM_FOG[2],_lm);
 const flash=muzzle>0?(settings.reduce?.06:weapon===1?.1:.3):0,gr=equippedItem().rgb;
 const floorTex=materialPixels[3],ceilTex=materialPixels[1],bloodTex=materialPixels[7];
 const flicker=mix(settings.reduce?1:.955+.025*Math.sin(nowTime*12)+.02*Math.sin(nowTime*29),LIM_FLICK,_lm),_limU=LIM_UNIFORM&&_lm>.5;
 const lights=ha?horrorLightActive:lightActive;
 const flowX=hv.flow|0,flowY=(hv.flow*.43)|0,emission=(.13+hv.energy*.12+hv.pulse*hv.energy*.17)*(1-(hv.collapse||0)*.9);
 for(let y=0;y<H;y++){
  const floor=y>horizon,dist=projection*(floor?.52:hv.ceiling)/Math.max(.5,Math.abs(y-horizon)),lit=Math.exp(-dist*.092);
  let wx=player.x+dist*(camDX-planeX),wy=player.y+dist*(camDY-planeY);
  const stepx=2*dist*planeX/W,stepy=2*dist*planeY/W,tex=floor?floorTex:ceilTex;
  for(let x=0;x<W;x++){
   const tx=Math.floor(wx*128)&255,ty=Math.floor(wy*128)&255,ti=(ty*256+tx)*4;
   const li=(clamp(Math.floor(wy*2),0,127)*128+clamp(Math.floor(wx*2),0,127))*3;
   let r=tex?tex[ti]:35,g=tex?tex[ti+1]:42,b=tex?tex[ti+2]:47;
   const cell=ha?(clamp(Math.floor(wy),0,MH-1)*MW+clamp(Math.floor(wx),0,MW-1)):0,zone=ha?horrorZone[cell]:0;
   const amount=zone?horrorMix[cell]*(floor?(zone===1?.34:zone===2?.70:1):(zone===1?.30:1)):0;
   const organTex=zone?(floor?bloodTex:materialPixels[3+zone]):null;
   let er=0,eg=0,eb=0;
   if(organTex){
    // The final floor has an actual moving blood surface; the hospital seams recede.
    const oti=floor&&zone===3?((((ty+flowY)&255)*256+((tx+flowX)&255))*4):ti;
    const nr=organTex[oti],ng=organTex[oti+1],nb=organTex[oti+2];
    r=mix(r,nr,amount);g=mix(g,ng,amount);b=mix(b,nb,amount);
    const hot=Math.max(0,(Math.max(nr,ng,nb)-82)/173)*amount*emission;
    er=nr*hot;eg=ng*hot;eb=nb*hot;
   }
   const ceilingScale=floor?mix(1.25,1.04,amount):mix(.42,.83,amount);
   const seam=floor&&((Math.floor(wx*128)&127)<2||(Math.floor(wy*128)&127)<2)?mix(.55,1,amount):1;
   let reflection=0;if(floor){const lx=wx-Math.round(wx),ly=wy-Math.round(wy);reflection=Math.max(0,1-Math.abs(lx)*2)*Math.max(0,1-Math.abs(ly)*3)*.05*(1-amount);}
   const glow=flash/(1+dist*.9),i=(y*W+x)*4;
   const lr=lights[li],lg=lights[li+1],lb=lights[li+2];
   r=(r*ceilingScale*seam+reflection*120)*lr*flicker+er;g=(g*ceilingScale*seam+reflection*90)*lg*flicker+eg;b=(b*ceilingScale*seam+reflection*110)*lb*flicker+eb;
   if(zone===3&&drain){const ash=r*.30+g*.59+b*.11;r=mix(r,ash*.68,drain*.9);g=mix(g,ash*.86,drain*.9);b=mix(b,ash*1.12,drain*.9);}
   px[i]=fogR+(r-fogR)*lit+gr[0]*glow;px[i+1]=fogG+(g-fogG)*lit+gr[1]*glow;px[i+2]=fogB+(b-fogB)*lit+gr[2]*glow;px[i+3]=255;wx+=stepx;wy+=stepy;
  }
 }
 for(let x=0;x<W;x++){
  const camera=2*x/W-1,dx=camDX+planeX*camera,dy=camDY+planeY*camera,ray=castRay(player.x,player.y,dx,dy),d=Math.max(.04,ray.d);zBuffer[x]=d;
  const top=horizon-projection*hv.ceiling/d,bottom=horizon+projection*.52/d,wallH=bottom-top,y0=Math.max(0,Math.floor(top)),y1=Math.min(H-1,Math.ceil(bottom));
  const hitx=player.x+dx*(d-.02),hity=player.y+dy*(d-.02),li=(clamp(Math.floor(hity*2),0,127)*128+clamp(Math.floor(hitx*2),0,127))*3;
  const cell=ha?(clamp(Math.floor(hity),0,MH-1)*MW+clamp(Math.floor(hitx),0,MW-1)):0,zone=ha?horrorZone[cell]:0,amount=zone?horrorMix[cell]:0;
  const lr=lights[li],lg=lights[li+1],lb=lights[li+2],light=(ray.side?.82:1)*Math.exp(-d*.075)*flicker;
  let tx=Math.floor(ray.u*256);if((!ray.side&&dx>0)||(ray.side&&dy<0))tx=255-tx;
  const material=_limU?0:ray.type===2?1:ray.type===3?2:ray.type===4?2:((ray.mx+ray.my+stage*2)%8<2?2:0),tex=materialPixels[material],organTex=zone?materialPixels[3+zone]:null;
  for(let y=y0;y<=y1;y++){
   const v=(y-top)/wallH,ty=clamp(Math.floor(v*256),0,255),ti=(ty*256+tx)*4,i=(y*W+x)*4;
   let r=tex?tex[ti]:70,g=tex?tex[ti+1]:73,b=tex?tex[ti+2]:78;
   let edge=v>.935?.24:v>.58&&v<.605?.35:v>.6&&v<.62?1.25:1;
   if(material===0&&v>.62&&v<.93){r*=.53;g*=.69;b*=.68;}
   if(tx<3||tx>253)edge*=.6;
   let er=0,eg=0,eb=0;
   if(organTex){
    const nr=organTex[ti],ng=organTex[ti+1],nb=organTex[ti+2];
    r=mix(r,nr,amount);g=mix(g,ng,amount);b=mix(b,nb,amount);edge=mix(edge,1,amount);
    const hot=Math.max(0,(Math.max(nr,ng,nb)-90)/165)*amount*emission;
    er=nr*hot;eg=ng*hot;eb=nb*hot;
   }
   const l=light*edge,glow=flash/(1+d*.8);
   r=r*lr+er;g=g*lg+eg;b=b*lb+eb;
   if(zone===3&&drain){const ash=r*.30+g*.59+b*.11;r=mix(r,ash*.68,drain*.9);g=mix(g,ash*.86,drain*.9);b=mix(b,ash*1.12,drain*.9);}
   px[i]=fogR+(r-fogR)*l+gr[0]*glow;px[i+1]=fogG+(g-fogG)*l+gr[1]*glow;px[i+2]=fogB+(b-fogB)*l+gr[2]*glow;
  }
 }
 wc.putImageData(frame,0,0);
}
function localPoint(p,x,y,z){const c=Math.cos(p.a),s=Math.sin(p.a);return{x:p.x+x*c-y*s,y:p.y+x*s+y*c,z};}
function meshQuad(p,points,color,tex=-1,emissive=false){const worldPoints=points.map(v=>localPoint(p,...v));meshFaces.push({worldPoints,color,tex,emissive});}
function meshBox(p,x,y,z,sx,sy,sz,color,tex=-1){const a=x-sx/2,b=x+sx/2,c=y-sy/2,d=y+sy/2,e=z,f=z+sz;
 meshQuad(p,[[a,c,e],[b,c,e],[b,c,f],[a,c,f]],color,tex);meshQuad(p,[[b,d,e],[a,d,e],[a,d,f],[b,d,f]],color,tex);meshQuad(p,[[a,d,e],[a,c,e],[a,c,f],[a,d,f]],color,tex);meshQuad(p,[[b,c,e],[b,d,e],[b,d,f],[b,c,f]],color,tex);meshQuad(p,[[a,c,f],[b,c,f],[b,d,f],[a,d,f]],color,tex);}
function renderProp(p){meshFaces=[];const box=(...args)=>{if(p.horrorSkin&&args[7]>=0){args[6]='#663045';args[7]=p.horrorSkin;}meshBox(p,...args);},quad=(...args)=>{if(p.horrorSkin&&p.kind==='monitor'){args[1]=({'#021a15':'#260416','#61c989':'#ff2468','#98ffc4':'#ffb3d0'})[args[1]]||args[1];}meshQuad(p,...args);};
 if(p.kind==='wf_control'){wfDrawControl(p);return;}
 if(p.kind.startsWith('horror_')){renderHorrorProp(p);
 }else if(p.kind==='bed'||p.kind==='shrouded'){
 box(0,0,.17,1.33,.45,.09,'#454c46',1);box(0,0,.26,1.24,.43,.12,'#b6b4a0',0);box(-.47,0,.38,.22,.36,.06,'#bfc8ab',0);
 for(const xx of[-.55,.55]){for(const yy of[-.16,.16]){box(xx,yy,.03,.038,.038,.18,'#444643');box(xx,yy,.025,.075,.055,.055,'#161b1b');}box(xx,0,.25,.028,.46,.35,'#646f61');box(xx,0,.59,.032,.46,.025,'#899585');}
 for(const yy of[-.22,.22]){box(0,yy,.42,1.03,.02,.022,'#656b5f');for(const xx of[-.4,0,.4])box(xx,yy,.33,.018,.018,.1,'#535e53');}
 if(p.kind==='shrouded'){box(.02,0,.38,.74,.32,.105,'#868673',0);box(-.31,0,.395,.23,.27,.13,'#9b9a83',0);box(.41,0,.37,.35,.25,.06,'#777e70',0);}
 }else if(p.kind==='mirror'){
 box(0,0,0,.2,1.16,2.16,'#23281f');box(0,0,.05,.26,1.02,2.0,'#171d19');
 box(0,0,.09,.3,.88,1.84,'#080d0b');
 box(0,0,.05,.315,.94,.045,'#c2cbaa');box(0,0,1.9,.315,.94,.04,'#c2cbaa');
 }else if(p.kind==='control'){
 const c=fvControlInfo(p.fvSystem),col=c.done?'#7c8b83':c.ready?c.color:'#596461';
 box(0,0,.42,.82,.14,.48,'#34443f',1);
 quad([[-.35,-.075,.49],[.35,-.075,.49],[.35,-.075,.83],[-.35,-.075,.83]],'#0b161b');
 for(const xx of [-.23,0,.23])box(xx,-.085,.72,.12,.02,.07,col,-1);
 quad([[-.29,-.083,.56],[.29,-.083,.56],[.29,-.083,.61],[-.29,-.083,.61]],'#263832');
 const width=c.done?.58:c.progress*.58;
 if(width>0)quad([[-.29,-.087,.56],[-.29+width,-.087,.56],[-.29+width,-.087,.61],[-.29,-.087,.61]],col,-1,true);
 }else if(p.kind==='monitor'){
 box(0,0,.11,.39,.38,.07,'#45594b',1);box(0,0,.18,.04,.04,.31,'#727e6c');box(0,0,.47,.4,.38,.04,'#647b68');box(0,0,.51,.33,.27,.26,'#778177',2);quad([[-.145,-.141,.535],[.145,-.141,.535],[.145,-.141,.745],[-.145,-.141,.745]],'#021a15');
 quad([[-.115,-.143,.57],[.1,-.143,.57],[.1,-.143,.575],[-.115,-.143,.575]],'#61c989',-1,true);
 const pulse=.62+(Math.sin(nowTime*3+p.x)>.9?.075:0);quad([[-.01,-.144,.58],[.005,-.144,.58],[.005,-.144,pulse],[-.01,-.144,pulse]],'#98ffc4',-1,true);
 box(.12,0,.12,.015,.025,.43,'#e0d7b0');for(const xx of[-.14,.14])for(const yy of[-.14,.14])box(xx,yy,.02,.06,.06,.1,'#192a26');
 }else if(p.kind==='arch'){
 for(const xx of[-.96,.96]){box(xx,0,0,.08,.19,1.13,'#406061',2);box(xx,-.102,.12,.022,.014,.83,'#526d69');}
 box(0,0,1.025,2.01,.23,.16,'#2c4b47',2);box(0,-.122,1.015,1.82,.022,.02,'#6cd8c7');
 }else if(p.kind==='lamp'){
 box(0,0,1.13,1.25,.24,.045,'#464b45',1);quad([[-.55,-.08,1.125],[.55,-.08,1.125],[.55,.08,1.125],[-.55,.08,1.125]],p.color,-1,true);for(const xx of[-.43,.43])box(xx,0,1.175,.018,.018,.025,'#374239');
 }else if(p.kind==='pipe'){
 for(let i=0;i<3;i++){box(0,i*.11,1.045+i*.022,p.length,.07,.07,i===1?'#704132':'#474e43',1);for(let xx=-p.length/2+.6;xx<p.length/2;xx+=1.2)box(xx,i*.11,1.039+i*.022,.045,.085,.085,'#313d38');}
 }else if(p.kind==='curtain'){
 box(0,0,1.095,1.12,.035,.035,'#6d7970');for(let i=0;i<12;i++){const x=-.55+i*.095;box(x,Math.sin(i*2)*.027,.39,.096,.026,.7,i%2?'#415b54':'#5f7664',2);}
 }
 for(const f of meshFaces)f.d=f.worldPoints.reduce((s,v)=>s+(v.x-player.x)*camDX+(v.y-player.y)*camDY,0)/4;
 meshFaces.sort((a,b)=>b.d-a.d);for(const f of meshFaces)drawMeshFace(f);
 if(p.kind==='lamp'&&!p.off){const v=project(p.x,p.y,1.10);if(v&&v.d<13&&zBuffer[clamp(v.x|0,0,W-1)]>v.d-.08){const pulse=settings.reduce?1:.92+.08*Math.sin(nowTime*18+p.seed*5);drawGlow(v.x,v.y,Math.min(70,v.scale*.33),p.color,.18*pulse);}}
 if(p.kind==='arch'||p.kind==='sign')drawWardSign(p);
 if(p.kind==='control')wfDrawControl(p);
}
function drawMeshFace(face){
 if(face.horror){
  const [a,b,c]=face.worldPoints,ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z;
  if((uy*vz-uz*vy)*(player.x-a.x)+(uz*vx-ux*vz)*(player.y-a.y)+(ux*vy-uy*vx)*(.52-a.z)<=0)return;
 }
 let verts=face.worldPoints.map((p,i)=>({cx:(p.y-player.y)*camDX-(p.x-player.x)*camDY,cy:.52-p.z,d:(p.x-player.x)*camDX+(p.y-player.y)*camDY,u:[0,256,256,0][i],v:[256,256,0,0][i]}));
 // Clip the near plane before projection, including furniture beside the camera.
 const clipped=[];for(let i=0;i<verts.length;i++){const a=verts[i],b=verts[(i+1)%verts.length],ina=a.d>.07,inb=b.d>.07;if(ina)clipped.push(a);if(ina!==inb){const t=(.071-a.d)/(b.d-a.d);clipped.push({cx:mix(a.cx,b.cx,t),cy:mix(a.cy,b.cy,t),d:.071,u:mix(a.u,b.u,t),v:mix(a.v,b.v,t)});}}if(clipped.length<3)return;
 const surface=face.horror||face.wallAttached?horrorClipCeiling(clipped):clipped;if(surface.length<3)return;
 verts=surface.map(p=>({...p,x:W/2+p.cx*projection/p.d,y:horizon+p.cy*projection/p.d}));const left=Math.max(0,Math.floor(Math.min(...verts.map(p=>p.x)))),right=Math.min(W,Math.ceil(Math.max(...verts.map(p=>p.x))));if(right<=left||Math.max(...verts.map(p=>p.y))<0||Math.min(...verts.map(p=>p.y))>H)return;
 wc.save();wc.beginPath();let run=-1,visiblePixels=0;for(let x=left;x<=right;x++){let depth=Math.max(.07,face.d);
 if(face.wallAttached){const a=face.worldPoints[0],b=face.worldPoints[1],nx=-(b.y-a.y),ny=b.x-a.x,c=2*x/W-1,den=nx*(camDX+planeX*c)+ny*(camDY+planeY*c);if(Math.abs(den)>.00001)depth=(nx*(a.x-player.x)+ny*(a.y-player.y))/den;}
 const visible=x<right&&depth>0&&zBuffer[x]>depth-(face.wallAttached?.06:.3);if(visible&&run<0)run=x;if(!visible&&run>=0){wc.rect(run,0,x-run,H);visiblePixels+=x-run;run=-1;}}if(!visiblePixels){wc.restore();return;}wc.clip();wc.beginPath();verts.forEach((p,i)=>i?wc.lineTo(p.x,p.y):wc.moveTo(p.x,p.y));wc.closePath();wc.fillStyle=face.horror&&face.emissive&&horrorView.collapse>0?'rgb('+Math.round(mix(255,49,horrorView.collapse))+','+Math.round(mix(36,32,horrorView.collapse))+','+Math.round(mix(124,47,horrorView.collapse))+')':face.color;wc.fill();
 const faceImage=face.image||(!(face.horror&&face.d>8)&&face.tex>=0?materialCanvases[face.tex]:null);
 if(faceImage){wc.globalAlpha=face.image?1:face.horror?.82:.58;for(let i=1;i<verts.length-1;i++)textureTriangle(faceImage,verts[0],verts[i],verts[i+1]);wc.globalAlpha=1;}
 if(!face.emissive){const distance=Math.max(0,face.d),light=.12+Math.min(.67,distance*.035);wc.fillStyle='rgba(5,10,17,'+light+')';wc.beginPath();verts.forEach((p,i)=>i?wc.lineTo(p.x,p.y):wc.moveTo(p.x,p.y));wc.closePath();wc.fill();}wc.restore();
}
function textureTriangle(img,a,b,c){const den=a.u*(b.v-c.v)+b.u*(c.v-a.v)+c.u*(a.v-b.v);if(Math.abs(den)<.001)return;wc.save();wc.beginPath();wc.moveTo(a.x,a.y);wc.lineTo(b.x,b.y);wc.lineTo(c.x,c.y);wc.closePath();wc.clip();const aa=(a.x*(b.v-c.v)+b.x*(c.v-a.v)+c.x*(a.v-b.v))/den,bb=(a.y*(b.v-c.v)+b.y*(c.v-a.v)+c.y*(a.v-b.v))/den,cc=(a.x*(c.u-b.u)+b.x*(a.u-c.u)+c.x*(b.u-a.u))/den,dd=(a.y*(c.u-b.u)+b.y*(a.u-c.u)+c.y*(b.u-a.u))/den,ee=(a.x*(b.u*c.v-c.u*b.v)+b.x*(c.u*a.v-a.u*c.v)+c.x*(a.u*b.v-b.u*a.v))/den,ff=(a.y*(b.u*c.v-c.u*b.v)+b.y*(c.u*a.v-a.u*c.v)+c.y*(a.u*b.v-b.u*a.v))/den;wc.transform(aa,bb,cc,dd,ee,ff);wc.drawImage(img,0,0);wc.restore();}
function drawWardSign(p){wfDrawSign(p);}

function project(x,y,z=.5){if(s4Running()&&!hgPointVisible(x,y,z))return null;const dx=x-player.x,dy=y-player.y,d=dx*camDX+dy*camDY;if(d<=.065)return null;return{x:W/2+(dy*camDX-dx*camDY)*projection/d,y:horizon+(.52-z)*projection/d,d,scale:projection/d};}
function spriteClipped(img,left,top,width,height,depth,alpha=1){if(width<=0||height<=0)return;if(s4Running()){s4dSpriteClipped(img,left,top,width,height,depth,alpha);return;}const start=Math.max(0,Math.ceil(left)),end=Math.min(W,Math.ceil(left+width));wc.globalAlpha=alpha;let run=-1;for(let x=start;x<=end;x++){const visible=x<end&&zBuffer[x]>depth-.08;if(visible&&run===-1)run=x;if(!visible&&run!==-1){const sw=(x-run)/width*img.width,sx=(run-left)/width*img.width;wc.drawImage(img,sx,0,sw,img.height,run,top,x-run,height);run=-1;}}wc.globalAlpha=1;}
function renderEnemy(e){const a=creatureTypes[e.type],v=project(e.x,e.y,e.s4From==='ambulance'?(e.s4Emerge||0)*.18:0);if(!v||v.d>20)return;const art=monsterSprites[e.type];if(!art)return;const death=e.alive?1:e.death/.38;if(death<=0)return;const pace=e.walk*12+e.phase,squash=e.type===1?1+Math.sin(pace)*.035:1+Math.sin(pace*.6)*.015,height=v.scale*a.size*squash*(e.s4Emerge>0?.65+.35*(1-e.s4Emerge/.75):1)*(e.alive?1:death*.65)*(1-(e.cower||0)*.34),width=height*art.aspect*(e.type===1?1.1:1)/(e.s4Emerge>0?.65+.35*(1-e.s4Emerge/.75):1),twitch=e.type===0&&Math.sin(pace*2)>.8?3:0,left=v.x-width/2+twitch,top=v.y-height-(e.type===1?Math.abs(Math.sin(pace))*v.scale*.018:0);if(left>W||left+width<0)return;
 wc.fillStyle='#07021288';wc.beginPath();wc.ellipse(v.x,v.y,v.scale*a.width*.32,v.scale*.09,0,0,TAU);if(zBuffer[clamp(v.x|0,0,W-1)]>v.d)wc.fill();spriteClipped(e.hurt>.07?art.hit:art.image,left,top,width,height,v.d,clamp(1-v.d*.03,.5,1)*death*(e.type===3?(e.hwSeen?clamp(1-v.d*.02,.58,1):clamp((7.4-v.d)/5.2,.10,1)):1));
 if(e.windup>0){const gl=project(e.x,e.y,e.type===2?.85:.3);if(gl&&zBuffer[clamp(gl.x|0,0,W-1)]>gl.d){wc.globalCompositeOperation='lighter';wc.fillStyle=a.color;wc.globalAlpha=.7;wc.beginPath();wc.arc(gl.x,gl.y,Math.max(3,v.scale*.09*(1+Math.sin(nowTime*40)*.2)),0,TAU);wc.fill();wc.globalAlpha=1;wc.globalCompositeOperation='source-over';}}
}
function drawGlow(x,y,r,col,alpha=1){wc.save();wc.globalCompositeOperation='lighter';wc.globalAlpha=alpha;const gr=wc.createRadialGradient(x,y,0,x,y,Math.max(1,r));gr.addColorStop(0,'#fffce5');gr.addColorStop(.15,col);gr.addColorStop(1,col+'00');wc.fillStyle=gr;wc.fillRect(x-r,y-r,r*2,r*2);wc.restore();}
function renderExit(){if(chRunning()||fvRunning())return;if(s4Running()||(hwRunning()&&HW.ending))return;const v=project(exit.x,exit.y,.7);if(!v||v.d>22||zBuffer[clamp(v.x|0,0,W-1)]<v.d-.1)return;const c=cleared?'#d5ff42':'#ff327c';wc.save();wc.globalCompositeOperation='lighter';const r=v.scale*.55;wc.strokeStyle=c;wc.lineWidth=Math.max(1,v.scale*.027);for(let i=0;i<4;i++){wc.globalAlpha=.85-i*.17;wc.beginPath();wc.ellipse(v.x,v.y,r*(1-i*.11),r*1.35,nowTime*(cleared?.6:.1)+i*.3,0,TAU);wc.stroke();}wc.globalAlpha=1;wc.font='bold '+Math.max(8,v.scale*.12|0)+'px monospace';wc.textAlign='center';wc.fillStyle=c;wc.fillText(cleared?'EXIT':'SEALED',v.x,v.y-r*1.6);if(!cleared)wc.fillText(stageKills+'/'+quotas[stage],v.x,v.y+4);wc.restore();if(cleared)drawGlow(v.x,v.y,r*.8,c,.3);}
function renderWorldObjects(){for(const d of decals){const v=project(d.x,d.y,.01);if(!v||v.d>12||zBuffer[clamp(v.x|0,0,W-1)]<v.d)continue;wc.fillStyle=d.color;wc.globalAlpha=.75;wc.beginPath();wc.ellipse(v.x,v.y,v.scale*d.r,v.scale*d.r*.24,0,0,TAU);wc.fill();wc.globalAlpha=1;}
 const objects=enemies.filter(e=>e.alive||e.death>0).map(e=>({kind:'enemy',o:e,d:(e.x-player.x)*camDX+(e.y-player.y)*camDY}));for(const q of drops)objects.push({kind:'drop',o:q,d:(q.x-player.x)*camDX+(q.y-player.y)*camDY});for(const p of environmentProps.concat(wfExtraProps())){const d=(p.x-player.x)*camDX+(p.y-player.y)*camDY,r=p.kind==='horror_rib'?p.span/2:p.kind==='horror_artery'?p.length/2:0;if(d>-3-r&&d<17+r&&Math.hypot(p.x-player.x,p.y-player.y)<18+r)objects.push({kind:'prop',o:p,d});}objects.sort((a,b)=>b.d-a.d);renderExit();for(const t of objects){if(t.kind==='prop'){renderProp(t.o);continue;}if(t.kind==='enemy'){renderEnemy(t.o);continue;}const q=t.o,v=project(q.x,q.y,.28+Math.sin(nowTime*4+q.x)*.04);if(!v||zBuffer[clamp(v.x|0,0,W-1)]<v.d)continue;const s=v.scale*.16,c=q.type==='life'?'#ff327c':'#54efff';drawGlow(v.x,v.y,s*2,c,.6);wc.strokeStyle=c;wc.lineWidth=2;wc.strokeRect(v.x-s,v.y-s,s*2,s*2);wc.fillStyle='#fff4da';if(q.type==='life'){wc.fillRect(v.x-s*.65,v.y-s*.17,s*1.3,s*.34);wc.fillRect(v.x-s*.17,v.y-s*.65,s*.34,s*1.3);}else for(let j=0;j<3;j++)wc.fillRect(v.x-s*.6+j*s*.5,v.y-s*.5,s*.22,s);}
 for(const q of bullets){const v=project(q.x,q.y,q.z);if(q.cbYap){if(v&&v.x>=0&&v.x<W)cbYapSprite(q,v);continue;}if(!v||v.x<-20||v.x>W+20||zBuffer[clamp(v.x|0,0,W-1)]<v.d)continue;drawGlow(v.x,v.y,Math.max(4,v.scale*q.r*2.4),q.color,.9);}
 for(const q of particles){const v=project(q.x,q.y,q.z);if(!v||v.x<0||v.x>=W||v.y<0||v.y>=H||zBuffer[v.x|0]<v.d)continue;wc.globalAlpha=clamp(q.life/q.max,0,1);wc.fillStyle=q.color;const s=clamp(q.size*v.scale,1,15);wc.fillRect(v.x-s/2,v.y-s/2,s,s);}wc.globalAlpha=1;
 for(const q of rings){const v=project(q.x,q.y,.55);if(!v||v.x<0||v.x>=W||zBuffer[v.x|0]<v.d-.15)continue;const progress=1-q.life/q.max,r=v.scale*q.radius*progress;wc.globalCompositeOperation='lighter';wc.globalAlpha=(1-progress)*.9;wc.lineWidth=Math.max(1,4*(1-progress));wc.strokeStyle=q.color;wc.beginPath();wc.arc(v.x,v.y,Math.max(.1,r),0,TAU);wc.stroke();wc.globalAlpha=1;wc.globalCompositeOperation='source-over';}
 for(const q of tracers){const v=project(q.x,q.y,q.z);if(!v)continue;wc.strokeStyle=q.color;wc.globalAlpha=q.life/.1;wc.lineWidth=1;wc.beginPath();wc.moveTo(W*.5+12,H*.74);wc.lineTo(v.x,v.y);wc.stroke();}wc.globalAlpha=1;
 for(const n of numbers){const v=project(n.x,n.y,n.z);if(!v||zBuffer[clamp(v.x|0,0,W-1)]<v.d-.2)continue;wc.globalAlpha=n.life/.75;wc.font='bold 12px monospace';wc.fillStyle=n.color;wc.textAlign='center';wc.fillText(n.text,v.x,v.y);}wc.globalAlpha=1;
}
function renderGun(){if(!artReady)return;if(weapon===3){s4tRenderHands();return;}const g=guns[weapon],art=gunSprites[weapon],motion=settings.reduce?0:Math.min(1,Math.hypot(player.vx,player.vy)/4.65),reloadDip=reloadT>0?Math.sin(Math.PI*clamp(1-reloadT/reloadDuration,0,1)):0;const gh=Math.min(H*(weapon===2?.68:.64),cbRunning()&&H>W?H*.46:Infinity),gw=gh*art.aspect,gx=W*.5+(settings.reduce?0:Math.sin(bob)*3*motion-sway*9),gy=H+gh*.13+Math.abs(Math.cos(bob))*motion*3+recoil*(weapon===1?8:22)+reloadDip*gh*.65+weaponDrop*gh*2+s4dGunDip()*gh;
 wc.save();wc.translate(gx,gy);wc.rotate((settings.reduce?0:sway*.027+Math.sin(bob)*motion*.008)+reloadDip*.25-recoil*(weapon===1?.012:.033));wc.drawImage(art.image,-gw/2,-gh,gw,gh);wc.restore();
 if(muzzle>0){const x=gx,y=gy-gh+gh*.075,r=weapon===1?17:weapon===0?42:51;drawGlow(x,y,r,g.color,.9);wc.save();wc.globalCompositeOperation='lighter';wc.strokeStyle=g.color;wc.fillStyle='#fffbd5';wc.lineWidth=3;wc.beginPath();for(let i=0;i<12;i++){const a=i/12*TAU+nowTime*7,rad=i%2?r*.25:r*(.7+Math.random()*.3);const xx=x+Math.cos(a)*rad,yy=y+Math.sin(a)*rad*(weapon===1?.7:1);if(i===0)wc.moveTo(xx,yy);else wc.lineTo(xx,yy);}wc.closePath();wc.fill();wc.stroke();wc.restore();}
 if(reloadT>0){wc.textAlign='center';wc.font='bold 10px monospace';wc.fillStyle=g.color;wc.fillText('RELOADING',W/2,H*.76);wc.fillStyle='#130820';wc.fillRect(W/2-35,H*.78,70,3);wc.fillStyle=g.color;wc.fillRect(W/2-35,H*.78,70*(1-reloadT/reloadDuration),3);}
 if(meleeT>0){wc.save();wc.globalCompositeOperation='lighter';wc.strokeStyle='#ff327c';wc.lineWidth=8*meleeT/.27;wc.beginPath();wc.arc(W/2,H*.56,W*.15,Math.PI*.95-meleeT*5,Math.PI*1.8-meleeT*5);wc.stroke();wc.strokeStyle='#fff4d3';wc.lineWidth=2;wc.stroke();wc.restore();}
}
function renderCrosshair(){const x=W/2,y=horizon,gap=4+recoil*4;wc.save();wc.strokeStyle=hitmarker>0?'#fff8d2':'#f5efd3';wc.lineWidth=1;wc.shadowBlur=3;wc.shadowColor='#050005';if(hitmarker>0){wc.strokeStyle=killmarker>0?'#d5ff42':'#fff';wc.lineWidth=killmarker>0?2:1;for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;wc.beginPath();wc.moveTo(x+Math.cos(a)*4,y+Math.sin(a)*4);wc.lineTo(x+Math.cos(a)*10,y+Math.sin(a)*10);wc.stroke();}}else for(let i=0;i<4;i++){const a=i*Math.PI/2;wc.beginPath();wc.moveTo(x+Math.cos(a)*gap,y+Math.sin(a)*gap);wc.lineTo(x+Math.cos(a)*(gap+4),y+Math.sin(a)*(gap+4));wc.stroke();}wc.fillStyle='#d5ff42';wc.fillRect(x,y,1,1);wc.restore();}
function renderMap(){wfRenderCorner();}

function render(){worldRender();renderWorldObjects();if(s4Running()){s4DrawLabels();s4dDrawSmoke();s4qAtmosphere();s4tAtmosphere();cbAtmosphere();hgStormDraw();}s4dThreshold();hbRenderBirths();hbRenderAttack();if(mode!=='menu')renderGun();if(mode==='playing'&&!s4dLocked())renderCrosshair();s4dScreen();if(liminal.dark>0){wc.fillStyle='rgba(4,3,6,'+clamp(liminal.dark,0,1)+')';wc.fillRect(0,0,W,H);}ctx.fillStyle='#100717';ctx.fillRect(0,0,W,H);const kick=settings.reduce?0:shake*settings.shake,sx=rand(-kick,kick),sy=rand(-kick,kick);ctx.drawImage(world,sx,sy);
 if(mode==='playing'&&!settings.reduce&&(dashT>0||muzzle>.08)){ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=dashT>0?.1:.075;ctx.drawImage(world,sx+4,sy-1);ctx.restore();}
 if(mode==='playing'){if(hurt>0){ctx.fillStyle='rgba(255,20,103,'+Math.min(settings.reduce?.12:.3,hurt*.65)+')';ctx.fillRect(0,0,W,H);}if(whiteFlash>0&&!settings.reduce){ctx.fillStyle='rgba(218,255,115,'+whiteFlash*2+')';ctx.fillRect(0,0,W,H);}if(player.hp<25){ctx.strokeStyle='#ff327c';ctx.globalAlpha=.45+.2*Math.sin(nowTime*9);ctx.lineWidth=6;ctx.strokeRect(0,0,W,H);ctx.globalAlpha=1;}if(dashT>0&&!settings.reduce){ctx.strokeStyle='#54efff77';ctx.lineWidth=1;for(let i=0;i<14;i++){const a=i/14*TAU;ctx.beginPath();ctx.moveTo(W/2+Math.cos(a)*W*.35,H/2+Math.sin(a)*H*.35);ctx.lineTo(W/2+Math.cos(a)*W*.7,H/2+Math.sin(a)*H*.7);ctx.stroke();}}}renderMap();}

// SOURCE: ui.js
// ui.js — bundled from the owner’s liminal baseline.
function hudUpdate(){const g=equippedItem();$('wardName').innerHTML=hwRunning()?'03 <b>THE HEART WARD</b>':fvRunning()?'02 <b>FEVER THEATRE</b>':chRunning()?'01 <b>ADMISSIONS</b>':'0'+(stage+1)+' <b>'+wardNames[stage]+'</b>';$('goal').textContent=hwRunning()?HW.objective:fvRunning()?FV.objective:chRunning()?CH.objective:(cleared?'SEAL BROKEN · REACH THE EXIT':'BREAK THE SEAL · '+Math.min(stageKills,quotas[stage])+' / '+quotas[stage]);$('life').textContent=Math.ceil(player.hp);$('lifeFill').style.width=clamp(player.hp,0,100)+'%';$('lifeHint').textContent=liminal.mix>.4?'':player.hp<25?'SIGNAL CRITICAL':'KILL TO RESTORE';$('life').style.color=player.hp<25?'#ff327c':'#f3f1cf';$('score').textContent=Math.round(score).toString().padStart(6,'0');$('time').textContent=formatTime(gameTime)+'.'+Math.floor(gameTime%1*100).toString().padStart(2,'0');$('ammo').textContent=reloadT>0?'—':g.ammo;$('reserve').textContent='/ '+g.reserve;$('weaponName').textContent=g.name;$('weaponName').style.color=g.color;for(let i=0;i<3;i++)$('slot'+i).classList.toggle('active',i===weapon);$('dashLabel').textContent=dashCD>0?'DASH '+dashCD.toFixed(1)+'s':'[SPACE] DASH READY';const _hv=1-clamp(liminal.mix*1.35,0,1);$('comboWrap').style.opacity=combo>1?_hv:0;$('combo').textContent=combo+'×';$('comboText').textContent=combo>=10?'CATASTROPHIC':combo>=6?'UNSTOPPABLE':'KEEP FEEDING';$('comboTrack').style.width=(comboT/3.4*100)+'%';$('message').style.opacity=clamp(msgT*3,0,1)*_hv;$('feed').style.opacity=clamp(feedT*2,0,1)*_hv;let target=exit,ctext=cleared?'EXIT':'HUNT';if(hwRunning()){target=HW.resolved?exit:{x:32.5,y:11.5};ctext=HW.resolved?'EXIT':'HEART';}else if(fvRunning()){target=fvCompassTarget();ctext=FV.closed>=3?'AIRLOCK':target.id;}else if(chRunning()){target=CH.power?exit:CH_GOAL;ctext=CH.power?'EXIT':'PLANT';}else if(!cleared){let d=Infinity;for(const e of enemies){if(!e.alive)continue;const dd=Math.hypot(e.x-player.x,e.y-player.y);if(dd<d){d=dd;target=e;}}}const a=angle(Math.atan2(target.y-player.y,target.x-player.x)-player.a);$('compassArrow').style.transform='rotate('+a+'rad)';$('compassText').textContent=ctext;if(review.active)reviewHud();fvHud();hbHud();if(s4Running())s4Hud();s4dHud();s4tHud();cbHud();wfHud();}
function saveSettings(){try{localStorage.setItem('ashfall-settings-v2',JSON.stringify(settings));}catch{}audio.levels();document.body.classList.toggle('lowfx',settings.reduce);}
function syncSettings(){ $('musicVol').value=settings.music*100;$('sfxVol').value=settings.sfx*100;$('sensitivity').value=settings.sensitivity/.00003;$('shakeAmount').value=settings.shake*100;$('renderRes').value=Math.round((settings.res||1)*100);$('difficulty').value=String(clamp(Math.round(settings.difficulty),0,2)|0);applyDifficulty();$('reduceFx').checked=settings.reduce;$('showMap').checked=settings.map;$('muteAll').checked=settings.mute;document.body.classList.toggle('lowfx',settings.reduce);}
function openSettings(parent){menuParent=parent;hideOverlays();$('settings').classList.remove('hidden');mode='settings';syncSettings();}
function closeSettings(){saveSettings();hideOverlays();if(menuParent==='review'){mode='review';$('testWard').classList.remove('hidden');reviewSync();}else if(menuParent==='paused'){$('pause').classList.remove('hidden');mode='paused';}else{$('start').classList.remove('hidden');mode='menu';}}
$('musicVol').oninput=e=>{settings.music=+e.target.value/100;audio.levels();};$('sfxVol').oninput=e=>{settings.sfx=+e.target.value/100;audio.levels();};$('sensitivity').oninput=e=>settings.sensitivity=+e.target.value*.00003;$('shakeAmount').oninput=e=>settings.shake=+e.target.value/100;$('renderRes').oninput=e=>{settings.res=+e.target.value/100;resize();};$('difficulty').onchange=e=>{settings.difficulty=+e.target.value;applyDifficulty();saveSettings();};$('reduceFx').onchange=e=>{settings.reduce=e.target.checked;document.body.classList.toggle('lowfx',settings.reduce);};$('showMap').onchange=e=>settings.map=e.target.checked;$('muteAll').onchange=e=>{settings.mute=e.target.checked;audio.levels();};
$('startBtn').onclick=()=>{if(artReady)startRun();};$('resumeBtn').onclick=resumeGame;$('retryBtn').onclick=()=>{if(!review.active){if(HW.on&&HW.checkpoint){hwRestore();return;}if(FV.on&&FV.checkpoint){fvRestore();return;}if(CH.checkpoint){chRestore();return;}}startRun();};$('restartBtn').onclick=startRun;$('startSettings').onclick=()=>openSettings('menu');$('pauseSettings').onclick=()=>openSettings('paused');$('settingsBack').onclick=closeSettings;$('menuBtn').onclick=()=>{mode='menu';hideOverlays();$('start').classList.remove('hidden');$('hud').classList.add('hidden');$('touch').classList.add('hidden');$('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';audio.pause();loadStage(0);};
for(const b of document.querySelectorAll('[data-mode]'))b.onclick=()=>{settings.difficulty=+b.dataset.mode;applyDifficulty();saveSettings();};
addEventListener('keydown',e=>{if(!(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)||e.target?.isContentEditable)&&wfMapKey(e))return;if(e.code!=='Escape'&&(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)||e.target?.isContentEditable||(mode!=='playing'&&['BUTTON','SUMMARY'].includes(e.target?.tagName))))return;if(mode==='playing'&&['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'){if(mode==='playing')pauseGame();else if(mode==='paused')resumeGame();else if(mode==='settings')closeSettings();else if(mode==='review')closeTestWard();return;}if(e.code==='KeyU'&&!e.repeat){settings.mute=!settings.mute;$('muteAll').checked=settings.mute;saveSettings();return;}if(mode==='menu'&&e.code==='Enter'&&artReady){startRun();return;}if(mode!=='playing')return;if(review.active&&!e.repeat){if(e.code==='KeyT'){openTestWard();return;}if(e.code==='KeyB'){reviewReset();return;}if(e.code==='KeyH'){reviewDamagePreview();return;}if(e.code==='KeyN'){reviewRepeatTargets();return;}}if(s4dLocked()){if(e.code==='Enter'){e.preventDefault();s4dSkip();}return;}keys[e.code]=true;if(e.repeat)return;if(e.code==='Digit1')changeWeapon(0);if(e.code==='Digit2')changeWeapon(1);if(e.code==='Digit3')changeWeapon(2);if(e.code==='Digit4')s4tEquip();if(e.code==='KeyR')reload();if(e.code==='KeyQ')melee();if(e.code==='Space'||e.code==='ShiftLeft'||e.code==='ShiftRight')dash();if(e.code==='Tab')mapHeld=true;if(e.code==='KeyE'){e.preventDefault();if(s4Interact()||fvInteract()||chInteract())return;if(cleared&&Math.hypot(player.x-exit.x,player.y-exit.y)<1.5)completeWard();}});


// SOURCE: input.js
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


// SOURCE: liminal.js
// liminal.js — bundled from the owner’s liminal baseline.
/* ==================================================================
   LIMINAL SYSTEM  -  crossover state, the two corridors, the mirror
   ================================================================== */
const lightActive=new Float32Array(128*128*3);
const hidden=new Uint8Array(MW*MH);          // cells the minimap must not admit
let LIM_CEIL=.68;
/* each liminal space gets its own identity. the corridors are NOWHERE - flat
   sodium, uniform walls, no source. the mirror is the ward you already know,
   drained and reversed, so it keeps the ward's own lighting shape. */
const LIM_ASH=[.20,.20,.21], LIM_SODIUM=[1.31,1.27,.93], LIM_COLD=[1.12,1.24,1.46];
const LIM_LOOK={
  fed   :{tint:LIM_ASH    ,flat:1  ,uniform:true ,fog:[7,7,9]   ,ceil:.5 ,flicker:'fluor'},
  loop  :{tint:LIM_SODIUM ,flat:1  ,uniform:true ,fog:[31,32,25],ceil:1.55},
  mirror:{tint:LIM_COLD   ,flat:.72,uniform:false,fog:[16,20,30],ceil:.92},  deep  :{tint:[.62,.66,.63],flat:.88,uniform:true ,fog:[12,14,13],ceil:2.1}
};
let LIM_TINT=LIM_SODIUM, LIM_FLAT_AMT=1, LIM_UNIFORM=true, LIM_FOG=[31,32,25];
let LIM_FLICKER='none', LIM_FLICK=1;

const liminal={mix:0,target:0,mode:null,fed:null,loop:null,mirror:null,
               baked:-1,cool:0,fedUsed:false,loopUsed:false,dark:0};

function bakeLightActive(){
  const m=clamp(liminal.mix,0,1)*LIM_FLAT_AMT;
  for(let i=0;i<49152;i+=3){
    lightActive[i]  =mix(lightField[i]  ,LIM_TINT[0],m);
    lightActive[i+1]=mix(lightField[i+1],LIM_TINT[1],m);
    lightActive[i+2]=mix(lightField[i+2],LIM_TINT[2],m);
  }
  liminal.baked=clamp(liminal.mix,0,1);
  horrorBakeLight();
}
/* THE WARDEN's art: the Unstitched, bleached flat and drawn too tall.
   Same maw, wrong proportions, no neon - it belongs to the corridor, not the ward. */
function buildWardenSprite(){
  const src=monsterSprites[0];if(!src)return;
  const w=src.image.width,h=src.image.height;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(src.image,0,0);
  const img=g.getImageData(0,0,w,h),px=img.data;
  for(let i=0;i<px.length;i+=4){
    if(px[i+3]<8)continue;
    const L=px[i]*.299+px[i+1]*.587+px[i+2]*.114;
    px[i]  =clamp(26+L*.40,0,255);   // dark and low contrast: a shape in the gloom,
    px[i+1]=clamp(27+L*.40,0,255);   // not a portrait. the ramp below does the rest.
    px[i+2]=clamp(25+L*.39,0,255);
  }
  g.putImageData(img,0,0);
  const hit=document.createElement('canvas');hit.width=w;hit.height=h;
  const hc=hit.getContext('2d');hc.drawImage(c,0,0);
  hc.globalCompositeOperation='source-atop';hc.fillStyle='#fff5d6';hc.fillRect(0,0,w,h);
  monsterSprites[3]={image:c,hit,aspect:src.aspect*.72};
}
function rebuildFurniture(){
  furniture=environmentProps.filter(p=>['bed','shrouded','monitor'].includes(p.kind))
    .map(p=>({...p,hx:p.kind==='monitor'?.17:.6,hy:p.kind==='monitor'?.17:.16,c:Math.cos(p.a),s:Math.sin(p.a)}));
  furnitureIndex();
}
function bakeLightField(){
  // 128x128 over a 64-unit world. Falloff is 0.85/(1+d^2*0.25), which is under
  // 1% of peak past ~18 units, so culling there is free and keeps the bake
  // proportional to nearby lights instead of every light on the floor.
  const CULL=18*18;
  for(let y=0;y<128;y++)for(let x=0;x<128;x++){
    const wx=(x+.5)/2,wy=(y+.5)/2,i=(y*128+x)*3;let r=.23,g=.29,b=.33;
    for(const l of wardLights){
      const dx=wx-l.x,dy=wy-l.y,d2=dx*dx+dy*dy;
      if(d2>CULL)continue;
      const fall=.85/(1+d2*.25);
      r+=l.rgb[0]*fall;g+=l.rgb[1]*fall;b+=l.rgb[2]*fall;}
    lightField[i]=r;lightField[i+1]=g;lightField[i+2]=b;
  }
  bakeLightActive();
}
function liminalReset(){
  audio.restoreRoom();flinchUntil=0;LIM_FLICKER='none';LIM_FLICK=1;
  liminal.mix=liminal.target=0;liminal.mode=null;liminal.fed=null;liminal.loop=null;
  liminal.mirror=null;liminal.cool=0;liminal.dark=0;liminal.baked=-1;
  liminal.fedUsed=false;liminal.loopUsed=false;mirrorLatch=false;
  LIM_CEIL=.68;LIM_TINT=LIM_SODIUM;LIM_FLAT_AMT=1;LIM_UNIFORM=true;LIM_FOG=[31,32,25];hidden.fill(0);
  document.body.classList.remove('liminal');
}
function liminalEnter(mode){
  const L=LIM_LOOK[mode]||LIM_LOOK.fed;
  LIM_TINT=L.tint;LIM_FLAT_AMT=L.flat;LIM_UNIFORM=L.uniform;LIM_FOG=L.fog;LIM_CEIL=L.ceil;
  LIM_FLICKER=L.flicker||'none';
  liminal.mode=mode;liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');audio.crossover(true);
}
function liminalLeave(){liminal.target=0;liminal.mode=null;LIM_FLICKER='none';LIM_FLICK=1;document.body.classList.remove('liminal');audio.crossover(false);}

function liminalTick(dt){
  if(mode!=='playing'||s4Running())return;
  const rate=dt/.85;
  liminal.mix=clamp(liminal.mix+clamp(liminal.target-liminal.mix,-rate,rate),0,1);
  if(Math.abs(liminal.mix-liminal.baked)>.015)bakeLightActive();
  liminal.dark=Math.max(0,liminal.dark-dt*2.2);
  // a failing fluorescent tube: harsh, irregular, never settles
  if(LIM_FLICKER==='fluor'&&!settings.reduce){
    // long steady stretches, then a brief stutter. rare, not rhythmic.
    const stutter=(Math.sin(nowTime*1.31)>.993||Math.sin(nowTime*.79)>.997)?.5:1;
    LIM_FLICK=(.975+.025*Math.sin(nowTime*.6))*stutter;
  }else LIM_FLICK=1;
  if(liminal.cool>0)liminal.cool-=dt;
  if(mode!=='playing')return;
  if(liminal.mirror){
    // the world is flipped in here: corridor coordinate tests would read as
    // "walked out" and tear down the space you are standing in. freeze them.
    mirrorUpdate(dt);
  }else{
    if(liminal.fed)fedUpdate(dt);
    if(liminal.loop)loopUpdate(dt);
    if(!liminal.mode&&reviewAllowLiminal()&&!chRunning()&&!fvRunning()&&!hwRunning()){fedTrigger();loopTrigger();}
  }
  if(!chRunning()&&!fvRunning()&&!hwRunning())mirrorTrigger();
}

/* ---------- 02 · THE CORRIDOR YOU ARE FED DOWN ------------------- */
const FED={y:9,x0:5,x1:16,renews:1};   // renews: how many times the corridor refuses to end
function fedCarve(open){
  for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=open?0:1;hidden[FED.y*MW+x]=open?1:0;}
  if(open)audio.opening(FED.x0+.5,FED.y+.5);
  buildFlow();
}
function fedTrigger(){
  if(liminal.fedUsed||liminal.fed)return;
  if(player.hp<40&&!review.active)return;                       // never strand a dying player
  if(player.x<3.0||player.x>5.0||player.y<6.8||player.y>11.2)return;
  fedCarve(true);
  // it stays open. an opening that shuts while you run past it is an opening
  // nobody ever finds - which is exactly what the last build did.
  liminal.fed={armed:true,locked:false,ending:0,warden:null,breath:1.4,
               stretch:0,settled:false,backWall:FED.x0,entry:{x:player.x,y:player.y,a:player.a}};
  liminal.fedUsed=true;
}
function fedSealBehind(f){
  // only the entrance goes: the back wall walks forward with you.
  const upto=Math.floor(player.x-1.3);
  if(upto<f.backWall)return;
  for(let x=f.backWall;x<=upto&&x<=FED.x1;x++){map[FED.y][x]=1;hidden[FED.y*MW+x]=1;}
  f.backWall=upto+1;
  buildFlow();
}
function fedUpdate(dt){
  const f=liminal.fed;
  if(f.armed&&!f.locked){
    if(player.x>FED.x0+1.4&&player.y>FED.y+.05&&player.y<FED.y+.95){  // in the corridor, not merely east of it
      f.locked=true;
      f.entry={x:4.5,y:9.5,a:Math.PI};
      const w=spawn(FED.x1-.6,FED.y+.5,3);
      w.dormant=true;w.noticed=false;f.warden=w;
      liminalEnter('fed');            // low ceiling comes with the space
      say('',0);
    }
    return;                                     // no auto-close: it waits for you
  }
  fedSealBehind(f);
  if(f.ending){
    f.ending-=dt;
    if(f.ending<=0){
      if(f.warden){f.warden.alive=false;const i=enemies.indexOf(f.warden);if(i>=0)enemies.splice(i,1);}
      fedCarve(false);
      for(let x=FED.x0;x<=FED.x1;x++)hidden[FED.y*MW+x]=0;   // scoped: never touch the other corridor
      player.x=f.entry.x;player.y=f.entry.y;player.a=f.entry.a;player.vx=player.vy=0;
      liminal.fed=null;liminalLeave();LIM_CEIL=.68;
      buildFlow();
    }
    return;
  }
  // a single breath from the far end, before you can see what it is
  f.breath-=dt;
  if(f.breath<=0&&f.warden){f.breath=rand(3.4,6.2);audio.play(audio.choose('breath',3),{vol:.72,pos:f.warden,wet:.72,rate:.72});}

  if(f.stretch<FED.renews){
    // it stays ahead of you, and the corridor renews behind the seam.
    // uniform walls + flat light mean there is nothing to see the join by.
    if(f.warden)f.warden.x=Math.min(player.x+6.0,FED.x1+.2);
    if(player.x>FED.x1-2.4&&player.y>FED.y&&player.y<FED.y+1){
      for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=0;hidden[FED.y*MW+x]=1;}
      f.backWall=FED.x0;
      player.x=FED.x0+1.6;f.stretch++;buildFlow();
    }
    return;
  }
  if(f.warden&&!f.settled){f.settled=true;f.warden.x=FED.x1-.6;}
  // it steps aside
  if(f.warden&&player.x>FED.x1-3.2){
    f.warden.y=mix(f.warden.y,FED.y+.16,1-Math.exp(-dt*2.4));
  }
  if(player.x>FED.x1+.4&&player.y>FED.y&&player.y<FED.y+1&&!f.ending){f.ending=.55;liminal.dark=1;}
}

/* ---------- 01 · THE CORRIDOR THAT KEEPS GOING ------------------- */
const LOOP={y:18,x0:14,x1:18};
function loopCarve(open){
  for(let x=LOOP.x0;x<=LOOP.x1;x++){map[LOOP.y][x]=open?0:1;hidden[LOOP.y*MW+x]=open?1:0;}
  if(open)audio.opening(LOOP.x0+.5,LOOP.y+.5);
  buildFlow();
}
function loopTrigger(){
  if(liminal.loopUsed||liminal.loop)return;
  if(player.x<12.1||player.x>13.9||player.y<17.2||player.y>19.4)return;
  loopCarve(true);
  liminal.loop={lap:0,inside:false};
  liminal.loopUsed=true;
}
function loopUpdate(dt){
  const L=liminal.loop;
  if(!L.inside){
    if(player.x>LOOP.x0+.6&&player.y>LOOP.y+.05&&player.y<LOOP.y+.95){L.inside=true;liminalEnter('loop');}
    return;                                     // stays open until you take it
  }
  // east end: you are quietly returned to the west end
  if(player.x>LOOP.x1+.62){
    player.x=LOOP.x0+.35;
    L.lap++;
    if(L.lap===1)feed('');
    if(L.lap===2&&!environmentProps.some(p=>p.kind==='mirror')){
      environmentProps.push({kind:'mirror',x:LOOP.x1+.62,y:LOOP.y+.5,a:0});
    }
  }
  // walking back out is the way out
  if(player.x<LOOP.x0-.35){
    loopCarve(false);
    for(let x=LOOP.x0;x<=LOOP.x1;x++)hidden[LOOP.y*MW+x]=0;   // scoped
    liminal.loop=null;liminalLeave();LIM_CEIL=.68;
    environmentProps=environmentProps.filter(p=>p.kind!=='mirror'||p.permanent);
    buildFlow();
  }
}

/* ---------- 03 · THE MIRROR -------------------------------------- */
let mirrorLatch=false;const mirrorGate={x:0,y:0};
function mirrorTrigger(){
  const p=environmentProps.find(q=>q.kind==='mirror'&&Math.hypot(q.x-player.x,q.y-player.y)<.62);
  if(mirrorLatch){
    // the latch has to outlive the crossing, or stepping out steps straight back in
    if(!p&&Math.hypot(player.x-mirrorGate.x,player.y-mirrorGate.y)>1.9)mirrorLatch=false;
    return;
  }
  if(!p)return;
  mirrorLatch=true;mirrorGate.x=p.x;mirrorGate.y=p.y;
  if(liminal.mirror)mirrorExit();else mirrorEnter(p);
}
function flipWorld(){
  const src=map.map(r=>r.slice());
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map[y][x]=src[y][MW-1-x];
  const hs=hidden.slice();
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)hidden[y*MW+x]=hs[y*MW+(MW-1-x)];
  environmentProps=environmentProps.map(p=>({...p,x:MW-p.x,a:Math.PI-p.a}));
  wardLights=wardLights.map(l=>({...l,x:MW-l.x}));
  rebuildFurniture();bakeLightField();
  for(const e of enemies)e.x=MW-e.x;
  for(const arr of [decals,drops,bullets,particles,rings,tracers,numbers])for(const o of arr){
    o.x=MW-o.x;if(Number.isFinite(o.a))o.a=angle(Math.PI-o.a);if(Number.isFinite(o.vx))o.vx=-o.vx;
  }
  for(const e of enemies)if(Number.isFinite(e.dx))e.dx=-e.dx;
  for(const v of audio.voices)if(v.pos)v.pos.x=MW-v.pos.x;
  player.vx=-player.vx;
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);_safeX=player.x;_safeY=player.y;
  exit.x=MW-exit.x;
  buildFlow();
}
function mirrorEnter(p){
  if(liminal.mode&&liminal.mode!=='loop')return;
  const wasLoop=!!liminal.loop;
  flipWorld();
  const gate=environmentProps.find(q=>q.kind==='mirror');
  liminal.mirror={gate:{x:gate.x,y:gate.y},wasLoop,killed:0,spared:0};
  mirrorGate.x=gate.x;mirrorGate.y=gate.y;
  for(const e of enemies){e.cower=0;e.noticed=false;e.windup=0;e.charge=0;}
  liminalEnter('mirror');
  say('',0);
}
function mirrorExit(){
  const m=liminal.mirror;
  flipWorld();
  liminal.mirror=null;
  const g=environmentProps.find(q=>q.kind==='mirror');
  if(g){mirrorGate.x=g.x;mirrorGate.y=g.y;}
  for(const e of enemies){e.cower=0;e.noticed=false;}
  flinchUntil=nowTime+15;
  if(m.wasLoop&&liminal.loop){liminalEnter('loop');}
  else{liminalLeave();LIM_CEIL=.68;liminal.cool=20;}
}
let flinchUntil=0;
function mirrorUpdate(dt){}
function mirrorEnemy(e,dt){
  e.hurt=Math.max(0,e.hurt-dt);e.vocal-=dt;e.walk+=dt;
  const dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy)||.01;
  if(e.vocal<=0&&d<12){audio.mirrorVoice(e);e.vocal=rand(1.1,3.6);}
  e.cower=clamp((e.cower||0)+(d<2.6?dt*2.6:-dt*1.6),0,1);
  if(e.cower>.55||d>14)return;
  const ix=e.x|0,iy=e.y|0;let best=flow[iy*MW+ix],tx=e.x,ty=e.y;
  for(const [xx,yy] of [[ix+1,iy],[ix-1,iy],[ix,iy+1],[ix,iy-1]]){
    if(xx<0||yy<0||xx>=MW||yy>=MH)continue;
    const v=flow[yy*MW+xx];
    if(v>=0&&(v>best||best<0)){best=v;tx=xx+.5;ty=yy+.5;}
  }
  let mx=tx-e.x,my=ty-e.y;const dd=Math.hypot(mx,my)||1;mx/=dd;my/=dd;
  for(const o of enemies){if(!o.alive||o===e)continue;
    const ox=e.x-o.x,oy=e.y-o.y,sep=Math.hypot(ox,oy);
    if(sep>.02&&sep<.55){mx+=ox/sep*(.55-sep)*2;my+=oy/sep*(.55-sep)*2;}}
  move(e,mx*creatureTypes[e.type].speed*.92*dt,my*creatureTypes[e.type].speed*.92*dt);
}

/* ---------- audio: crossover, drone, the borrowed human voice ---- */
audio.ensureDrone=function(){
  if(this.droneGain||!this.ctx)return;
  const a=this.ctx;
  const g=a.createGain();g.gain.value=.0001;
  const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=240;f.Q.value=7;
  const o1=a.createOscillator();o1.type='sawtooth';o1.frequency.value=54.5;
  const o2=a.createOscillator();o2.type='sawtooth';o2.frequency.value=55.3;
  const o3=a.createOscillator();o3.type='sine';o3.frequency.value=27.4;
  const lfo=a.createOscillator();lfo.type='sine';lfo.frequency.value=.045;
  const lg=a.createGain();lg.gain.value=95;
  lfo.connect(lg).connect(f.frequency);
  o1.connect(f);o2.connect(f);o3.connect(f);f.connect(g).connect(this.music);
  for(const o of [o1,o2,o3,lfo])o.start();
  this.droneGain=g;
};
/* ---- the annexe's own bed: sub, air, and a slow detuned pad ------------- */
audio.ensureAnnexe=function(){
  if(this.anx||!this.ctx)return;
  const a=this.ctx, out={};

  // 1. air: looping noise through a bandpass that drifts. the room tone of a
  //    building that does not have any windows.
  const len=a.sampleRate*4, buf=a.createBuffer(1,len,a.sampleRate), d=buf.getChannelData(0);
  let last=0;
  for(let i=0;i<len;i++){last=(last+rand(-1,1)*.22)*.94;d[i]=last;}
  const noise=a.createBufferSource();noise.buffer=buf;noise.loop=true;
  const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=520;bp.Q.value=1.3;
  const sweep=a.createOscillator();sweep.type='sine';sweep.frequency.value=.031;
  const sweepAmt=a.createGain();sweepAmt.gain.value=280;
  sweep.connect(sweepAmt).connect(bp.frequency);
  out.air=a.createGain();out.air.gain.value=.0001;
  noise.connect(bp).connect(out.air).connect(this.music);

  // 2. pad: two voices a fifth apart, detuned, swelling very slowly. this is
  //    what actually reads as "different music" rather than "no music".
  const pad=a.createGain();pad.gain.value=.0001;
  const padFilter=a.createBiquadFilter();padFilter.type='lowpass';
  padFilter.frequency.value=900;padFilter.Q.value=.8;
  for(const [f,type] of [[110,'triangle'],[110.6,'triangle'],[164.8,'sine'],[220,'sine']]){
    const o=a.createOscillator();o.type=type;o.frequency.value=f;
    const g=a.createGain();g.gain.value=f>200?.06:.13;
    o.connect(g).connect(padFilter);o.start();
  }
  const swell=a.createOscillator();swell.type='sine';swell.frequency.value=.023;
  const swellAmt=a.createGain();swellAmt.gain.value=260;
  swell.connect(swellAmt).connect(padFilter.frequency);
  out.pad=pad;padFilter.connect(pad).connect(this.music);

  noise.start();sweep.start();swell.start();
  this.anx=out;
};
/* t = 0 is the ward and its score, t = 1 is the annexe. Everything in between
   is a real position on the crossfade, driven by where you are in the spiral. */
audio.annexe=function(t){
  if(!this.ctx)return;
  this.ensureAnnexe();this.ensureDrone();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime, T=.18;
  this.musicBed.gain.setTargetAtTime(Math.max(.0001,1-t*1.15),now,T);
  this.droneGain.gain.setTargetAtTime(Math.max(.0001,t*.58),now,T);
  this.anx.air.gain.setTargetAtTime(Math.max(.0001,t*t*.55),now,T);
  this.anx.pad.gain.setTargetAtTime(Math.max(.0001,Math.pow(t,1.5)*.62),now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*mix(.19,.03,t),now,T);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.3,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,1700,t),now,T);
  this.musicTone.frequency.setTargetAtTime(mix(11500,2600,t),now,T);
  const want=t>.5?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};
audio.crossover=function(on){
  if(!this.ctx)return;
  this.ensureDrone();
  const t=this.ctx.currentTime;
  this.musicBed.gain.setTargetAtTime(on?.0001:1,t,.42);
  this.droneGain.gain.setTargetAtTime(on?.42:.0001,t,.55);
  this.ambience.gain.setTargetAtTime(on?settings.sfx*.03:settings.sfx*.19,t,.5);
  this.roomReturn.gain.setTargetAtTime(on?1.15:.62,t,.5);
  this.roomTone.frequency.setTargetAtTime(on?2100:3700,t,.5);
  try{this.room.buffer=on?this.impLong:this.impShort;}catch(e){}
};
audio.opening=function(x,y){
  if(!this.active||!this.ctx)return;
  this.play(this.choose('environment',4),{vol:.8,pos:{x,y},wet:.85,rate:.55});
  this.play('seal',{vol:.3,pos:{x,y},wet:.9,rate:.42});
};
audio.mirrorVoice=function(e){
  if(!this.active||!this.ctx)return;
  const r=Math.random();
  const key=r<.46?this.choose('pain',4):r<.78?this.choose('breath',3):'gasp';
  this.play(key,{vol:.66,pos:e,follow:e,rate:rand(.86,1.08),wet:.55});
};
/* trope 01 - a voice from a room with nothing in it */
audio.sourceless=function(){
  if(!this.active||!this.ctx||!environmentProps.length)return;
  for(let i=0;i<10;i++){
    const p=environmentProps[(Math.random()*environmentProps.length)|0];
    const d=Math.hypot(p.x-player.x,p.y-player.y);
    if(d<3.5||d>11)continue;
    if(enemies.some(e=>e.alive&&Math.hypot(e.x-p.x,e.y-p.y)<3.5))continue;
    this.play(this.choose(Math.random()<.5?'patient':'crawler',3),
              {vol:.6,pos:{x:p.x,y:p.y},wet:.72,rate:rand(.82,.96)});
    return;
  }
};
(function(){
  const baseKill=audio.kill.bind(audio);
  audio.kill=function(e){
    if(liminal.mode==='mirror'){
      this.flesh(e,true);
      this.play(Math.random()<.55?'agony':this.choose('pain',4),{vol:.9,pos:e,wet:.5,rate:rand(.9,1.05)});
      return;
    }
    baseKill(e);
  };
  const baseCreature=audio.creature.bind(audio);
  audio.creature=function(e,attack){
    if(e.type===3)return;                       // the Warden does not vocalise
    if(liminal.mode==='mirror')return this.mirrorVoice(e);
    baseCreature(e,attack);
  };
  audio.sourcelessClock=6;
  const baseTick=audio.tick.bind(audio);
  audio.tick=function(dt=0){
    baseTick();
    if(mode!=='playing'||!this.active)return;
    this.sourcelessClock-=dt;
    if(this.sourcelessClock<=0){this.sourcelessClock=liminal.mix>.4?rand(4,8):rand(16,30);this.sourceless();}
  };
})();

/* ---------- flinch: the fifteen seconds after you come back ------ */
(function(){
  const baseHurt=hurtPlayer;
  window.__baseHurt=baseHurt;
})();

/* tear down whatever is live and put the geometry back, so testing one
   set-piece can never leave another one half-carved */
function liminalHardReset(){
  if(liminal.fed&&liminal.fed.warden){
    const i=enemies.indexOf(liminal.fed.warden);if(i>=0)enemies.splice(i,1);
  }
  if(liminal.mirror){flipWorld();liminal.mirror=null;}
  for(let x=FED.x0;x<=FED.x1;x++){map[FED.y][x]=1;hidden[FED.y*MW+x]=0;}
  for(let x=LOOP.x0;x<=LOOP.x1;x++){map[LOOP.y][x]=1;hidden[LOOP.y*MW+x]=0;}
  environmentProps=environmentProps.filter(p=>p.kind!=='mirror');
  liminal.fed=liminal.loop=null;liminal.fedUsed=liminal.loopUsed=false;
  liminal.cool=0;liminal.dark=0;mirrorLatch=false;
  liminalLeave();liminal.mix=0;liminal.target=0;
  LIM_CEIL=.68;LIM_FLICKER='none';LIM_FLICK=1;
  rebuildFurniture();bakeLightField();buildFlow();
}

/* Existing debug shortcuts are now unscored, isolated scene entry points. */
addEventListener('keydown',e=>{
 if(mode!=='playing'||e.repeat||['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;
 const scene={Digit7:'fed',Digit8:'loop',Digit9:'mirror'}[e.code];
 if(scene){if(!review.active)reviewSetPreset('explore');reviewLoad(scene);}
});


// SOURCE: review.js
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
 if(!review.active)return;
 const flags=[review.ai?'AI ON':'AI OFF',review.damage?'DAMAGE ON':'PROTECTED',review.unlimited?'AMMO REFILL':'FINITE AMMO'];
 $('reviewBarText').textContent=reviewScenes[review.scene].label+' · '+flags.join(' / ');
 $('reviewStatus').textContent=review.done?'SCENE COMPLETE · B TO REPEAT':'T CONTROLS · B RESET · H PAIN PREVIEW'+(reviewFixture()?' · N TARGETS':useChapter?' · N REPEAT SCENE':'');
 $('reviewDiagnostics').textContent=BUILD.id+' | '+review.scene+' | '+mode+' / '+(liminal.mode||'ward')+' | '+player.x.toFixed(2)+', '+player.y.toFixed(2)+' | '+enemies.filter(e=>e.alive).length+' alive | '+bullets.length+' projectiles';
 $('scoreLabel').textContent='TEST SCORE · NOT SAVED';
 if(s4tRunning())s4tHud();if(cbRunning())cbHud();
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

// SOURCE: admissions.js
// boot.js — bundled from the owner’s liminal baseline.

/* ==================================================================
   R2-P05-R03  ADMISSIONS + ANNEXE + THE TRANSFER  -  the ward, and the spiral into the annexe
   ================================================================== */
let useChapter=true;

const CH={
  on:false, phase:'arrive', power:false, objective:'', arrival:0,
  live:{}, cleared:{}, flags:{}, checkpoint:null, tension:0, ending:false,
  maze:null, gateOpen:false, drone:false, trailRooms:[], counter:null, tr:null,
  doors:{ service:[[4,9],[5,9],[6,9]],
          security:[[15,54],[15,55],[15,56]] }
};
function chRunning(){return CH.on&&useChapter&&stage===0;}
const CH_GOAL={x:54,y:9};        // where the compass points until the power is on

/* ---------------------------------------------------------------- the plan
   Rooms declare their own doorway. Geometry, arches, signage and furniture
   are all derived from this table, which is what stops props from landing
   in doorways the way they did in r01. side = wall the door is cut into. */
const ROOMS=[
  // north patient rooms, doors south into the ward corridor
  {id:'W01',x1:13,y1:13,x2:17,y2:18,side:'S',door:15,label:'W‑01'},
  {id:'W02',x1:19,y1:13,x2:23,y2:18,side:'S',door:21,label:'W‑02'},
  {id:'W03',x1:25,y1:13,x2:29,y2:18,side:'S',door:27,label:'W‑03'},
  {id:'W04',x1:31,y1:13,x2:35,y2:18,side:'S',door:33,label:'W‑04'},
  {id:'W05',x1:37,y1:13,x2:41,y2:18,side:'S',door:39,label:'W‑05'},
  {id:'W06',x1:43,y1:13,x2:47,y2:18,side:'S',door:45,label:'W‑06'},
  // south side: records, then the support cluster
  {id:'REC',x1:13,y1:24,x2:19,y2:29,side:'N',door:16,label:'RECORDS'},
  {id:'CLN',x1:33,y1:24,x2:37,y2:29,side:'N',door:35,label:'CLEAN UTILITY'},
  {id:'SOI',x1:39,y1:24,x2:43,y2:29,side:'N',door:41,label:'SOILED'},
  {id:'LIN',x1:45,y1:24,x2:49,y2:29,side:'N',door:47,label:'LINEN'}
];
// curtained assessment bays, open to the triage corridor on their west side
const BAYS=[{y1:35,y2:37,n:'BAY 1'},{y1:39,y2:41,n:'BAY 2'},{y1:43,y2:45,n:'BAY 3'}];

function chCreateMap(){
  CH.power=false;
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(16,50,36,60);        // reception / waiting hall
  carve(13,54,15,56);        // security alcove  (chapter exit)
  carve(25,48,27,49);        // reception -> spine
  carve(25,34,27,47);        // main spine
  carve(4,31,52,33);         // cross corridor, 49 long
  carve(9,34,11,46);         // triage corridor
  for(const b of BAYS)carve(12,b.y1,19,b.y2);          // assessment bays
  carve(34,35,50,46);        // ward 2, open hall
  carve(40,34,42,34);        //   its doorway
  carve(29,23,31,30);        // ward connector
  carve(10,20,50,22);        // WARD CORRIDOR - double loaded, 41 long
  carve(21,24,27,27);        // nurse station, open to the corridor
  carve(48,12,50,19);        // service riser
  carve(36,4,56,11);         // plant hall
  carve(4,6,36,8);           // plant west passage (service level)
  carve(4,9,6,30);           // service return, plant down to the cross corridor
  for(const r of ROOMS)carve(r.x1,r.y1,r.x2,r.y2);
  for(const r of ROOMS)                                 // one doorway each
    map[r.side==='S'?r.y2+1:r.y1-1][r.door]=0;
  carve(21,23,27,23);        // nurse station counter opening

  // structural columns: cover in the two fighting spaces only
  for(const [x,y] of [[20,54],[20,58],[32,54],[32,58],[38,38],[38,43],[46,38],[46,43]])map[y][x]=2;
  for(const k in CH.doors)for(const [x,y] of CH.doors[k])map[y][x]=1;

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function chOpenDoors(){
  for(const k in CH.doors)for(const [x,y] of CH.doors[k])map[y][x]=0;
  buildFlow();
}

/* --------------------------------------------------------------- dressing
   Generated from the plan. A patient room gets its bed against the wall
   OPPOSITE its door, the monitor at the bed head, a curtain inside the
   doorway, an arch in the doorway and its number beside it. */
function chSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  for(const r of ROOMS){
    const cx=(r.x1+r.x2+1)/2, south=r.side==='S';
    const doorY=south?r.y2+1:r.y1, dx=r.door+.5;
    // The arch mesh carries its columns at local x = ±0.96. Rotated 90° they
    // swing INTO the passage, which is what was standing in every doorway in
    // r03. A door walked through north–south takes angle 0, so the columns
    // land in the flanking wall where they belong.
    add('arch',dx,(south?r.y2+1:r.y1-1)+.5,0,{label:r.label});
    // number plate on the corridor wall beside the door
    add('sign',r.door+1.6,south?r.y2+1.03:r.y1-.03,south?0:Math.PI,{label:r.label});
    if(r.id==='REC'||r.id==='CLN'||r.id==='SOI'||r.id==='LIN'){
      // support rooms: shelving along the back wall, nothing near the door
      const backY=south?r.y1+.55:r.y2+.45;
      for(let x=r.x1+1;x<=r.x2;x+=2)add('shrouded',x+.1,backY,0,{seed:seed++});
      add('monitor',r.x1+.45,(r.y1+r.y2)/2+.5,Math.PI/2);
    }else{
      // patient room: bed head to the far wall, monitor at the head
      const bedY=south?r.y1+.75:r.y2+.25;
      add('bed',cx,bedY,0,{seed:seed++});
      add('monitor',cx+1.15,bedY+(south?-.5:.5),0);
      add('curtain',cx-1.1,south?r.y2-.6:r.y1+1.4,0,{seed:seed++});
      add('lamp',cx,(r.y1+r.y2)/2+.5,0,{color:'#8be5df',seed:seed++});
    }
  }

  // nurse station: a counter facing down the ward corridor, staff side behind
  for(let x=21.6;x<=26.6;x+=1.2)add('monitor',x,23.55,0);
  add('sign',24,23.0,Math.PI,{label:'NURSE STATION'});
  add('shrouded',22.5,26.4,0,{seed:seed++});
  add('lamp',24,25.5,0,{color:'#edc17b',seed:seed++});

  // assessment bays: bed across the bay, curtain at the corridor opening
  BAYS.forEach((b,i)=>{
    const cy=(b.y1+b.y2+1)/2;
    add('bed',16,cy,0,{seed:seed++});
    add('monitor',18.6,cy-.7,-Math.PI/2);
    add('curtain',12.3,cy-1.2,0,{seed:seed++});
    add('sign',12.03,b.y1+.5,Math.PI/2,{label:b.n});
  });
  add('sign',9.03,35,Math.PI/2,{label:'ASSESSMENT'});

  // ward 2: two rows of beds head to wall, aisle down the middle
  for(let x=35.5;x<=49;x+=2.4){
    add('bed',x,35.4,0,{seed:seed++});add('monitor',x+1.05,35.35,0);
    add('curtain',x+1.2,36.1,0,{seed:seed++});        // track between adjacent bays
  }
  for(let x=35.5;x<=49;x+=2.4){
    add(seed++%4===0?'shrouded':'bed',x,46.5,0,{seed:seed++});
    add('curtain',x+1.2,44.9,0,{seed:seed++});
  }
  add('sign',34.03,40,Math.PI/2,{label:'WARD 2'});
  // R2-P04 retired: the owner rejected the mirror world. Nothing places
  // it and nothing ticks it. The code below remains, unreferenced, so the
  // decision can be reversed without rebuilding it.
  add('sign',50.97,40,-Math.PI/2,{label:'WARD 2 / END'});
  for(const [x,y] of [[38,40],[46,40]])add('lamp',x,y,0,{color:'#ff3e70',seed:seed++});

  // reception: desk facing the entrance, seating in facing rows with an aisle
  // Registration counter against the EAST wall. In r03/r04 it sat across the
  // middle of the hall, which is what the Orderly kept snagging on.
  for(let y=52;y<=56;y+=1.2)add('monitor',36.5,y,-Math.PI/2);
  add('sign',36.97,50.6,-Math.PI/2,{label:'ADMISSIONS'});
  // seating hard against the far wall only. The middle of this hall is the
  // arena for the Orderly, and in r03 it was full of gurneys he could not
  // path around, which is why he could be strafed to death from range.
  for(let x=19;x<=33;x+=2.4){
    add('bed',x,59.5,0,{seed:seed++});
    add('curtain',x+1.2,58.9,0,{seed:seed++});
  }
  add('sign',16.03,55,Math.PI/2,{label:'WAITING'});
  add('sign',36.97,52,-Math.PI/2,{label:'NO POWER'});
  add('arch',15.5,55,Math.PI/2,{label:'SECURITY'});

  // plant hall: switchgear along the back wall, pipework overhead
  for(let x=38;x<=54;x+=3)add('monitor',x,4.5,0);
  for(const [x,y] of [[40,5.5],[47,5.5],[52,5.5]])add('pipe',x,y,0,{length:6});
  add('sign',45,4.03,0,{label:'PLANT / HV'});
  add('lamp',46,8,0,{color:'#8be5df',seed:seed++});

  // wayfinding at the junctions, which is where real signage lives
  add('sign',26.5,31.035,0,{label:'← TRIAGE / WARD 1 + PLANT →'});
  add('sign',4.03,31.5,Math.PI/2,{label:'SERVICE'});
  add('sign',29.97,23.5,-Math.PI/2,{label:'WARD 1 / W‑01…W‑06'});
  // No frames at corridor junctions: these openings are three cells wide, the
  // arch mesh spans under two, and real corridors do not have door frames
  // where they meet each other. Overhead directional signs instead.

  chSetLights();
  rebuildFurniture();
}

function chSetLights(){
  wardLights=[];
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  const dim=!CH.power;
  const A=dim?[.58,.12,.18]:[1.00,.96,.86];      // public
  const B=dim?[.26,.28,.36]:[.80,.86,.84];       // circulation
  const C=dim?[.30,.56,.60]:[.44,.88,.92];       // service
  L(26,55,A); L(20,57,A); L(32,57,A);
  L(26,46,B); L(26,36,B);      // nothing at y40-42: the gate mouth stays black
  L(10,32,B); L(26,32,B); L(42,32,B);
  L(10,40,B); L(16,44,B);
  L(40,40,dim?[.24,.26,.32]:[.78,.84,.80]); L(48,42,dim?[.22,.24,.30]:[.72,.78,.76]);
  L(16,21,B); L(30,21,B); L(44,21,B);
  L(24,26,dim?[.30,.32,.40]:[.88,.84,.62]);
  L(20,16,B); L(34,16,B); L(46,16,B);
  L(49,15,C); L(46,8,C); L(5,20,C); L(20,7,C);
  bakeLightField();
  if(CH.gateOpen)chDarkenGate();
}

/* ------------------------------------------------- population
   Two authored encounters, plus residents scattered through the floor who
   wake individually on sight or proximity. The floor is inhabited without
   the whole ward charging you at once. */
const CH_ENC={
  triage:[[15,36,0],[16,40,0],[15,44,0],[10,38,1],[10,43,1],[17,45,0]],
  reception:[[26,55,2],[31,52,2],[19,52,1],[33,57,1],[21,57,1],[29,58,1],[24,51,0],[34,54,0]]
};
// Placed to be revealed. Several stand just inside a doorway or a corner so
// they come into view as you turn, rather than being visible down a corridor.
const RESIDENTS=[
  [15,17,0],[21,17,1],[27,17,0],[33,17,0],[39,17,1],[45,17,0],   // deep in each room, seen on entry
  [11.5,21,0],[28.5,21,1],[47.5,21,0],                            // corridor, near the bends
  [24,26.5,0],                                                    // behind the nurse station counter
  [35,28,0],[41,28,1],[47,28,0],                                  // support rooms, back walls
  [36.5,36,0],[45,40,1],[43,44,2],[49,45,0],                      // ward 2, Orderly deep in it
  [17,28,1],                                                      // records
  [44,9,0],[52,9,1],                                              // plant hall, flanking the breaker
  [26,35.5,1],                                                    // just past the spine/cross junction
  [10.5,34.5,0],                                                  // around the corner into assessment
  [5,29,0],                                                       // service return, at the bottom bend
  [50.5,21,1]                                                     // at the riser mouth
];
function chSpawnEnc(id){
  for(const [x,y,t] of CH_ENC[id]){const e=spawn(x,y,t);e.enc=id;e.noticed=false;}
}
function chPopulate(){
  enemies=[];drops=[];
  chSpawnEnc('triage');
  for(const [x,y,t] of RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  drops.push({x:16,y:27,type:'ammo',life:999,ch:'cache'});
  drops.push({x:17.4,y:26,type:'life',life:999,ch:'cache'});
  drops.push({x:24,y:26,type:'ammo',life:999});
  drops.push({x:46,y:42,type:'life',life:999});
}
function chRespawnLive(){
  const ids=new Set([...Object.keys(CH.live).filter(k=>CH.live[k]),
                     ...Object.keys(CH.cleared).filter(k=>CH.cleared[k])]);
  if(!ids.size)return;
  enemies=enemies.filter(e=>!e.enc);
  for(const id of ids){CH.live[id]=true;CH.cleared[id]=false;chSpawnEnc(id);}
  for(const e of enemies)if(e.enc)e.noticed=true;
  CH.tension=1;audio.tension(1);buildFlow();
}
function chActivate(id){
  if(CH.live[id]||CH.cleared[id])return;
  CH.live[id]=true;
  if(id==='reception')chSpawnEnc('reception');
  for(const e of enemies)if(e.enc===id){e.noticed=true;e.cd=rand(.3,1.1);}
  CH.tension=1;audio.tension(1);
  if(id==='reception'){shake=Math.max(shake,5);audio.creature(enemies.find(e=>e.enc==='reception'&&e.type===2)||{x:player.x,y:player.y,type:2},true);}
  say(id==='triage'?'THEY WERE WAITING IN THE BAYS.':'IT CAME BACK FOR THE DOOR.',2.0);
}
function chKill(e){
  if(!e.enc)return;
  if(enemies.filter(x=>x.alive&&x.enc===e.enc).length>0)return;
  CH.live[e.enc]=false;CH.cleared[e.enc]=true;
  CH.tension=0;audio.tension(0);comboT=0;combo=0;
  feed(e.enc==='triage'?'ASSESSMENT CLEAR':'HALL CLEAR');
  if(e.enc==='triage')chSetObjective('seek');
  chSave();
}

/* ============================================ THE TRANSFER  (P05-R03) ==== */
/* Entered through W-04, which looks like every other room on the ward. Its own
   scene, so there is nothing in here but the corridor and the thing at the end. */
const TR_ROOM={x1:31,y1:13,x2:35,y2:18,door:33};
const TR_COR ={y1:15,y2:16,x0:36,x1:60,renews:1};   // straight, east, ~12s with one renewal

function trBuild(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
  carve(TR_ROOM.x1,TR_ROOM.y1,TR_ROOM.x2,TR_ROOM.y2);
  map[TR_ROOM.y2+1][TR_ROOM.door]=0;                 // the door you came through
  carve(TR_COR.x0,TR_COR.y1,TR_COR.x1,TR_COR.y2);    // the corridor
  for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][TR_COR.x0]=1;   // shut until the door closes
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function trProps(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  const cx=(TR_ROOM.x1+TR_ROOM.x2+1)/2;
  add('bed',cx,TR_ROOM.y1+.75,0,{seed:1});           // dressed exactly as W-04 was
  add('monitor',cx+1.15,TR_ROOM.y1+1.25,0);
  add('curtain',cx-1.1,TR_ROOM.y2-.6,0,{seed:2});
  wardLights.push({x:cx,y:TR_ROOM.y1+2.5,rgb:[.30,.27,.24]});
  bakeLightField();rebuildFurniture();
}
function trEnter(){
  if(CH.tr)return;
  CH.tr={ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
               lf:new Float32Array(lightField),enemies,drops,exit:{...exit},
               x:player.x,y:player.y,a:player.a},
         shut:false,opened:false,fed:false,warden:null,
         back:TR_COR.x0,stretch:0,settled:false,breath:1.2,ending:0};
  enemies=[];drops=[];bullets=[];particles=[];tracers=[];rings=[];numbers=[];
  exit={x:-99,y:-99};
  trBuild();trProps();buildFlow();chSettle();
  LIM_TINT=[.19,.19,.20];LIM_FLAT_AMT=1;LIM_UNIFORM=true;LIM_FOG=[5,5,6];LIM_CEIL=.48;
  LIM_FLICKER='none';liminal.mode='transfer';liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');
  audio.transfer(1);
}
function trLeave(){
  const w=CH.tr&&CH.tr.ward;if(!w)return;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);enemies=w.enemies;drops=w.drops;exit=w.exit;
  rebuildFurniture();bakeLightActive();buildFlow();
  player.x=w.x;player.y=w.y;player.a=w.a;player.vx=player.vy=0;chSettle();
  CH.tr=null;CH.flags.transfer=true;              // no reward, no acknowledgement
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.transfer(0);
  say('',0);feed('');
  chSave();
}
function trTick(dt){
  if(!CH.tr){
    if(!CH.flags.transfer&&chRunning()&&player.hp>40&&
       player.x>TR_ROOM.x1+.5&&player.x<TR_ROOM.x2+.5&&
       player.y>TR_ROOM.y1+.4&&player.y<TR_ROOM.y2-.2) trEnter();
    return;
  }
  const s=CH.tr;

  // 1. the door shuts behind you
  if(!s.shut&&player.y<TR_ROOM.y2-.4){
    s.shut=true;
    map[TR_ROOM.y2+1][TR_ROOM.door]=1;buildFlow();
    audio.play('seal',{vol:.5,pos:{x:TR_ROOM.door+.5,y:TR_ROOM.y2+1},wet:.8,rate:.5});
  }
  // 2. and only then does the room turn out to go on
  if(s.shut&&!s.opened){
    s.opened=true;
    for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][TR_COR.x0]=0;
    buildFlow();
    const w=spawn(TR_COR.x1-.6,TR_COR.y1+1,3);
    w.dormant=true;w.noticed=false;s.warden=w;      // standing at the far end
    audio.play(audio.choose('environment',4),{vol:.7,pos:{x:TR_COR.x0+2,y:TR_COR.y1+1},wet:.95,rate:.5});
  }
  const w=s.warden;if(!w)return;

  const inCor=player.x>TR_COR.x0+.2&&player.y>TR_COR.y1-.2&&player.y<TR_COR.y2+1.2;
  s.fed=inCor;                                     // both arrows lead the same way

  // the way back closes as you go: only the entrance goes, a wall at a time
  if(inCor){
    const upto=Math.floor(player.x-1.4);
    if(upto>=s.back){
      for(let x=s.back;x<=upto&&x<=TR_COR.x1;x++)
        for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][x]=1;
      s.back=upto+1;buildFlow();
    }
  }

  s.breath-=dt;
  if(s.breath<=0){s.breath=rand(2.8,5.0);
    audio.play(audio.choose('breath',3),{vol:.7,pos:w,wet:.8,rate:.7});}

  if(s.ending){
    s.ending-=dt;
    if(s.ending<=0){
      const i=enemies.indexOf(w);if(i>=0)enemies.splice(i,1);
      trLeave();
    }
    return;
  }

  // it holds station ahead of you while the corridor refuses to end...
  if(s.stretch<TR_COR.renews){
    w.x=Math.min(player.x+6.0,TR_COR.x1-.4);
    if(player.x>TR_COR.x1-2.6&&inCor){
      for(let x=TR_COR.x0;x<=TR_COR.x1;x++)
        for(let y=TR_COR.y1;y<=TR_COR.y2;y++)map[y][x]=0;
      s.back=TR_COR.x0;
      player.x=TR_COR.x0+1.8;s.stretch++;buildFlow();
    }
    return;
  }
  // ...then it settles at the end, and waits
  if(!s.settled){s.settled=true;w.x=TR_COR.x1-.6;w.y=TR_COR.y1+1;}

  // AND WHEN YOU REACH IT, NOTHING HAPPENS. It steps aside and lets you past.
  if(player.x>TR_COR.x1-3.4)
    w.y=mix(w.y,TR_COR.y1+.18,1-Math.exp(-dt*2.6));

  // the far end is the way out, and it is always there
  if(player.x>TR_COR.x1+.35){s.ending=.55;liminal.dark=1;}
}
/* its own bed: heavier sub, no pad, more room than the annexe */
audio.transfer=function(t){
  if(!this.ctx)return;
  this.ensureAnnexe();this.ensureDrone();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime,T=.5;
  this.musicBed.gain.setTargetAtTime(Math.max(.0001,1-t),now,T);
  this.droneGain.gain.setTargetAtTime(Math.max(.0001,t*.78),now,T);
  this.anx.air.gain.setTargetAtTime(Math.max(.0001,t*.30),now,T);
  this.anx.pad.gain.setTargetAtTime(.0001,now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*mix(.19,.02,t),now,T);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.45,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,1300,t),now,T);
  try{this.room.buffer=t>.5?this.impLong:this.impShort;}catch(e){}
};

/* ===== THE COUNTER-WARD (mirror) - RETIRED at owner review, kept dormant == */
const MIRROR_AT={x:48,y:40};                   // in Ward 2, off the main route
let counterLatch=false;

function chBuildCounter(){
  const src=map.map(r=>r.slice());
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)map[y][x]=src[y][MW-1-x];
}
function chCounterProps(saved){
  // the same ward, reversed. Authored differences rather than a tint alone:
  // the beds are all occupied, the machines are all dead, and the signs read
  // backwards because they are the same signs.
  environmentProps=saved.map(p=>({...p,x:MW-p.x,a:Math.PI-p.a}));
  for(const p of environmentProps){
    if(p.kind==='bed')p.kind='shrouded';
    if(p.kind==='lamp')p.color='#6f7f86';
  }
  wardLights=[];
  for(const l of wardLights)l.x=MW-l.x;
  // a cold, even wash with one warm point at the way back
  for(let x=8;x<58;x+=10)for(let y=10;y<58;y+=12)
    wardLights.push({x,y,rgb:[.30,.40,.52]});
  wardLights.push({x:MW-MIRROR_AT.x,y:MIRROR_AT.y,rgb:[1.5,1.25,.85]});
  bakeLightField();rebuildFurniture();
}
function chEnterCounter(){
  if(CH.counter)return;
  // Snapshot the roster and detach the live array FIRST. spawn() pushes into
  // `enemies`, so iterating the saved reference while spawning into it never
  // terminates.
  const roster=enemies.slice(), savedDrops=drops;
  CH.counter={
    ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
          lf:new Float32Array(lightField),enemies:roster,drops:savedDrops,exit:{...exit}},
    killed:new Set()
  };
  bullets=[];particles=[];tracers=[];rings=[];numbers=[];   // nothing crosses with you
  const saved=CH.counter.ward.props;
  enemies=[];drops=[];exit={x:-99,y:-99};
  // one inhabitant for every living thing in the ward, in the mirrored place
  for(const e of roster){
    if(!e.alive||e.type===3)continue;
    const m=spawn(MW-e.x,e.y,e.type);
    m.mirror=e.id;m.noticed=false;m.cower=0;m.enc=null;
  }
  chBuildCounter();chCounterProps(saved);
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);player.vx=player.vy=0;
  chSettle();buildFlow();
  counterLatch=true;
  // mode stays 'mirror' so the existing flee/cower AI and the borrowed human
  // voices both apply; the look is overridden so the mix is still its own.
  LIM_TINT=[.72,.86,1.06];LIM_FLAT_AMT=.66;LIM_UNIFORM=false;
  LIM_FOG=[10,14,22];LIM_CEIL=1.05;
  LIM_FLICKER='none';liminal.mode='mirror';liminal.target=1;liminal.baked=-1;
  document.body.classList.add('liminal');
  audio.annexe(.55);                       // its own mix, not the annexe's
  say('THE SAME WARD.',2.4);
  feed('THEY ARE AFRAID OF YOU HERE');
}
function chLeaveCounter(){
  const c=CH.counter;if(!c)return;
  const w=c.ward;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);drops=w.drops;exit=w.exit;
  // the literal consequence: what died in there is dead out here
  enemies=w.enemies.filter(e=>!c.killed.has(e.id));
  bullets=[];particles=[];tracers=[];rings=[];numbers=[];
  rebuildFurniture();bakeLightActive();buildFlow();
  player.x=MW-player.x;player.a=angle(Math.PI-player.a);player.vx=player.vy=0;
  chSettle();
  const n=c.killed.size;
  CH.counter=null;counterLatch=true;
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.annexe(0);
  CH.flags.counter=true;CH.flags.counterKilled=n;
  say('',0);
  feed(n?('THE WARD IS SHORT '+n+' OF WHAT IT WAS'):'THE WARD IS AS YOU LEFT IT');
  chSave();
}
/* killing in there gives nothing: no score, no healing, no ammunition, no
   progress. It only removes something from the world on both sides. */
function chCounterKill(e){
  if(!e.alive)return;
  e.alive=false;e.death=.38;
  if(e.mirror!=null)CH.counter.killed.add(e.mirror);
  emit(e.x,e.y,.55,creatureTypes[e.type].color,26,1);
  ring(e.x,e.y,creatureTypes[e.type].color,.8,.24);
  decals.push({x:e.x,y:e.y,r:rand(.22,.4),color:e.type===1?'#137888':'#781653'});
  if(decals.length>80)decals.shift();
  hitstop=.02;shake=Math.max(shake,2.2);
  audio.flesh(e,true);
  audio.play(Math.random()<.6?'agony':audio.choose('pain',4),
             {vol:.95,pos:e,wet:.5,rate:rand(.9,1.05)});
}
function chCounterTick(dt){
  const p=environmentProps.find(q=>q.kind==='mirror'&&
    Math.hypot(q.x-player.x,q.y-player.y)<.75);
  if(counterLatch){ if(!p)counterLatch=false; return; }
  if(!p)return;
  if(CH.counter)chLeaveCounter(); else chEnterCounter();
}

/* ======================================== THE ANNEXE  (liminal) ========== */
/* The spiral. Identical in the ward and in the annexe, which is the whole
   trick: the exchange happens mid-corridor and has nothing to alter. */
const GATE_SEGS=[
  [53,31,58,33],   // east, off the end of the cross corridor
  [56,24,58,31],   // north
  [56,24,62,26],   // east
  [60,26,62,40],   // south  <- the world is exchanged along here
  [54,38,62,40]    // west, and out into the annexe
];
const GATE_SWAP={x1:59.5,y1:27,x2:62.5,y2:39};     // deep in the fourth leg
/* ---- the rule: the machines that are still running are a path ----------- */
function mzTrail(){
  const key=(i,j)=>i+','+j, prev=new Map(), q=[[MZ_ENTRY.i,MZ_ENTRY.j]];
  prev.set(key(MZ_ENTRY.i,MZ_ENTRY.j),null);
  while(q.length){
    const [i,j]=q.shift();
    const nbrs=[];
    if(i<MZ.n-1&&mzLink(i,j,1,0))nbrs.push([i+1,j]);
    if(i>0&&mzLink(i-1,j,1,0))nbrs.push([i-1,j]);
    if(j<MZ.n-1&&mzLink(i,j,0,1))nbrs.push([i,j+1]);
    if(j>0&&mzLink(i,j-1,0,1))nbrs.push([i,j-1]);
    for(const [a,b] of nbrs){
      if(prev.has(key(a,b)))continue;
      prev.set(key(a,b),[i,j]);q.push([a,b]);
    }
  }
  const out=new Set(); let cur=[MZ_EXIT.i,MZ_EXIT.j];
  if(!prev.has(key(cur[0],cur[1])))return out;      // unreachable: leave it dark
  while(cur){out.add(key(cur[0],cur[1]));cur=prev.get(key(cur[0],cur[1]));}
  return out;
}

/* ---- the consequence, once you are back -------------------------------- */
// The two legs must OVERLAP, not merely touch at a corner: [4,34,6,53] and
// [7,54,12,56] met only diagonally, so the corridor was never connected.
const SHORTCUT=[[4,34,6,53],[4,54,12,56]];          // cross corridor -> security door
function chOpenStaffRoute(){
  for(const [x1,y1,x2,y2] of SHORTCUT)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;
  buildFlow();
}
function chOccupyWard(){
  // every bed in Ward 1 is occupied now. Nothing remarks on it.
  const rooms=new Set(ROOMS.filter(r=>r.id.startsWith('W')).map(r=>r.id));
  for(const p of environmentProps){
    if(p.kind!=='bed')continue;
    for(const r of ROOMS){
      if(!rooms.has(r.id))continue;
      if(p.x>=r.x1&&p.x<=r.x2+1&&p.y>=r.y1&&p.y<=r.y2+1){p.kind='shrouded';break;}
    }
  }
  rebuildFurniture();
}
const MZ={x0:2,y0:2,size:5,step:6,n:9};
const MZ_ENTRY={i:8,j:6}, MZ_EXIT={i:0,j:1};
function mzRoom(i,j){
  const x=MZ.x0+i*MZ.step, y=MZ.y0+j*MZ.step;
  return {x1:x,y1:y,x2:x+MZ.size-1,y2:y+MZ.size-1,cx:x+MZ.size/2,cy:y+MZ.size/2};
}
function mzLink(a,b,c,d){
  const h=(((a*73856093)^(b*19349663)^(c*83492791)^(d*2654435761))>>>0);
  return (h%10)<7;                                  // loops, not a single thread
}
function chCarveGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;
  buildFlow();
}
function chSealGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=1;
  buildFlow();
}
function chInGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    if(player.x>=x1-.4&&player.x<=x2+1.4&&player.y>=y1-.4&&player.y<=y2+1.4)return true;
  return false;
}
/* how far along the spiral you are, for the light and the score to follow */
function chGateProgress(){
  let best=0;
  GATE_SEGS.forEach(([x1,y1,x2,y2],i)=>{
    if(player.x>=x1-.4&&player.x<=x2+1.4&&player.y>=y1-.4&&player.y<=y2+1.4)
      best=Math.max(best,(i+1)/GATE_SEGS.length);
  });
  return best;
}
function chBuildMaze(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};
  for(let i=0;i<MZ.n;i++)for(let j=0;j<MZ.n;j++){
    const r=mzRoom(i,j); carve(r.x1,r.y1,r.x2,r.y2);
    if(i<MZ.n-1&&mzLink(i,j,1,0))carve(r.x2+1,r.y1+2,r.x2+1,r.y1+2);
    if(j<MZ.n-1&&mzLink(i,j,0,1))carve(r.x1+2,r.y2+1,r.x1+2,r.y2+1);
  }
  chCarveGate();                                    // the same spiral, cell for cell
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function chMazeProps(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;
  const trail=mzTrail(); CH.trailRooms=[];
  for(let i=0;i<MZ.n;i++)for(let j=0;j<MZ.n;j++){
    const r=mzRoom(i,j), out=(i===MZ_EXIT.i&&j===MZ_EXIT.j);
    add('bed',r.cx,r.y1+.75,0,{seed:seed++});
    add('curtain',r.cx-1.1,r.y2-.6,0,{seed:seed++});
    if(out){
      add('lamp',r.cx,r.cy,0,{color:'#ffd479',seed:seed++});
      add('sign',r.x1+.03,r.cy,Math.PI/2,{label:'WAY OUT'});
      wardLights.push({x:r.cx,y:r.cy,rgb:[3.0,2.5,1.4]});
    }else if(trail.has(i+','+j)){
      // on the path: this room's machine is still running
      add('monitor',r.cx+1.15,r.y1+1.25,0);
      add('lamp',r.cx,r.cy,0,{color:'#8be5df',seed:seed++});
      wardLights.push({x:r.cx+1.15,y:r.y1+1.25,rgb:[.30,.86,.92]});
      CH.trailRooms.push({x:r.cx+1.15,y:r.y1+1.25});
    }
  }
  for(let i=0;i<MZ.n;i+=2)for(let j=0;j<MZ.n;j+=2){
    const r=mzRoom(i,j); wardLights.push({x:r.cx,y:r.cy,rgb:[.34,.36,.34]});
  }
  bakeLightField();chDarkenGate();rebuildFurniture();
}
function chDarkenGate(){
  for(const [x1,y1,x2,y2] of GATE_SEGS)
    for(let y=y1-1;y<=y2+1;y++)for(let x=x1-1;x<=x2+1;x++)
      for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){
        const i=(((y*2+sy)*128)+(x*2+sx))*3;
        if(i<0||i>=lightField.length)continue;
        lightField[i]*=.13;lightField[i+1]*=.13;lightField[i+2]*=.15;
      }
  bakeLightActive();
}
function chDeepLook(t){
  if(liminal.mode!=='deep'){
    const L=LIM_LOOK.deep;
    LIM_TINT=L.tint;LIM_FLAT_AMT=L.flat;LIM_UNIFORM=L.uniform;LIM_FOG=L.fog;LIM_CEIL=L.ceil;
    LIM_FLICKER='none';liminal.mode='deep';liminal.baked=-1;
    document.body.classList.add('liminal');
  }
  liminal.target=t;
  audio.annexe(t);            // continuous crossfade, not a switch at a threshold
  CH.drone=t>.1;
}
/* nothing may leave the player inside geometry, least of all a map swap */
function chSettle(){
  if(fits(player.x,player.y)){_safeX=player.x;_safeY=player.y;return true;}
  for(let r=.25;r<=4;r+=.25)
    for(let a=0;a<Math.PI*2;a+=Math.PI/8){
      const nx=player.x+Math.cos(a)*r, ny=player.y+Math.sin(a)*r;
      if(fits(nx,ny)){player.x=nx;player.y=ny;_safeX=nx;_safeY=ny;return true;}
    }
  return false;
}
function chEnterMaze(){
  if(CH.maze)return;
  CH.maze={ward:{map:map.map(r=>r.slice()),props:environmentProps,lights:wardLights,
                 lf:new Float32Array(lightField),enemies,drops,exit:{...exit}},
           t:0,hinted:false,sealed:false};
  enemies=[];drops=[];
  // The ward's door stayed armed while the annexe was loaded, and `cleared`
  // was already true, so straying near those coordinates in here ended the
  // chapter. There is no exit in the annexe except the one you have to find.
  exit={x:-99,y:-99};
  chBuildMaze();chMazeProps();
  chSettle();                                // identical geometry, so this holds
  buildFlow();
}
function chLeaveMaze(){
  const w=CH.maze&&CH.maze.ward;if(!w)return;
  map=w.map;environmentProps=w.props;wardLights=w.lights;
  lightField.set(w.lf);enemies=w.enemies;drops=w.drops;exit=w.exit;
  chSealGate();                              // and it was never there
  rebuildFurniture();bakeLightActive();buildFlow();
  CH.maze=null;CH.drone=false;CH.gateOpen=false;
  liminal.target=0;liminal.mode=null;LIM_CEIL=.68;
  document.body.classList.remove('liminal');audio.annexe(0);audio.crossover(false);
  player.x=51;player.y=32;player.a=0;player.vx=player.vy=0;   // facing where it was
  chSettle();
  if(!CH.flags.annexe){
    CH.flags.annexe=true;
    chOpenStaffRoute();                 // a way to the door that was not there
    chOccupyWard();                     // and the ward is not quite as you left it
    feed('STAFF ROUTE OPEN / CROSS CORRIDOR TO SECURITY');
  }else feed('BACK IN THE WARD');
  say('',0);
  chSave();
}
function chDeepTick(dt){
  if(CH.maze){
    CH.maze.t+=dt;
    // once you are out of the corridor and into the rooms, it closes
    if(!CH.maze.sealed&&player.x<52.5&&!chInGate()){
      CH.maze.sealed=true;chSealGate();
      say('THE CORRIDOR IS GONE.',2.6);feed('FIND THE WAY OUT');
    }
    chDeepLook(1);
    const r=mzRoom(MZ_EXIT.i,MZ_EXIT.j);
    if(Math.hypot(player.x-r.cx,player.y-r.cy)<1.5){chLeaveMaze();return;}
    // the nearest running machine, heard rather than seen
    if(CH.trailRooms&&CH.trailRooms.length&&Math.random()<dt*1.1){
      let near=null,bd=13;
      for(const p of CH.trailRooms){
        const d=Math.hypot(p.x-player.x,p.y-player.y);
        if(d<bd){bd=d;near=p;}
      }
      if(near)audio.play(audio.choose('environment',4),
        {vol:.34,pos:near,wet:.8,rate:1.35});
    }
    if(CH.maze.t>40&&!CH.maze.hinted){
      CH.maze.hinted=true;feed('THE MACHINES THAT ARE STILL ON MAKE A PATH');
    }
    if(CH.maze.t>40&&Math.random()<dt*.6)
      audio.play(audio.choose('environment',4),{vol:.8,pos:{x:r.cx,y:r.cy},wet:.9,rate:.55});
    return;
  }
  if(!CH.power||!CH.gateOpen)return;
  if(chInGate()){
    chDeepLook(chGateProgress()*.8);
    // exchanged deep in the fourth leg, where both maps are the same corridor
    if(player.x>=GATE_SWAP.x1&&player.x<=GATE_SWAP.x2&&
       player.y>=GATE_SWAP.y1&&player.y<=GATE_SWAP.y2)chEnterMaze();
  }else if(liminal.mode==='deep'){
    chDeepLook(0);
    if(liminal.mix<.03){liminal.mode=null;document.body.classList.remove('liminal');LIM_CEIL=.68;}
  }
}

/* -------------------------------------------- walkability, through furniture */
const CH_WAY={
  reception:[26,56], spine:[26,40], crossW:[8,32], crossE:[50,32],
  triageCorr:[10,44], bay2:[16,40], ward2:[44,42], wardCorrW:[12,21],
  wardCorrE:[48,21], roomW01:[15,15], roomW06:[45,15], nurseStation:[24,26],
  records:[16,27], serviceRiser:[49,15], plantBreaker:[54,9],
  serviceReturn:[5,20], exitDoor:[14,55]
};
function chValidate(from){
  const S=.25, seen=new Set(), key=(x,y)=>Math.round(x/S)+':'+Math.round(y/S);
  const sx=from?from[0]:player.x, sy=from?from[1]:player.y;
  if(!fits(sx,sy))return {start:'BLOCKED AT START', reached:{}};
  const q=[[sx,sy]]; seen.add(key(sx,sy));
  while(q.length){
    const [x,y]=q.pop();
    for(const [nx,ny] of [[x+S,y],[x-S,y],[x,y+S],[x,y-S]]){
      if(nx<1||ny<1||nx>MW-1||ny>MH-1)continue;
      const k=key(nx,ny); if(seen.has(k)||!fits(nx,ny))continue;
      seen.add(k); q.push([nx,ny]);
    }
  }
  const reached={};
  for(const n in CH_WAY){
    const [wx,wy]=CH_WAY[n]; let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  // every creature and pickup must also be standing somewhere legal
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok', cells:seen.size, reached, stuck, lostDrops};
}

/* ------------------------------------------------------------- objectives */
function chSetObjective(phase){
  CH.phase=phase;
  CH.objective =
    phase==='arrive' ? 'RESTORE HOSPITAL POWER · PLANT HALL' :
    phase==='seek'   ? 'RESTORE HOSPITAL POWER · PLANT HALL' :
    phase==='return' ? 'POWER ON · RETURN TO THE SECURITY DOOR' :
                       'LEAVE ADMISSIONS';
  hudUpdate();
}
function chBegin(){
  CH.on=true;CH.power=false;CH.ending=false;
  CH.live={};CH.cleared={};CH.flags={cache:false,annex:false,annexe:false,counter:false,counterKilled:0,transfer:false};
  CH.arrival=40;CH.tension=0;CH.checkpoint=null;CH.maze=null;CH.gateOpen=false;CH.drone=false;CH.counter=null;counterLatch=false;CH.tr=null;
  cleared=false;exit={x:14,y:55.5};
  player.x=32;player.y=57.5;player.a=Math.PI;
  _safeX=player.x;_safeY=player.y;
  chSetObjective('arrive');audio.tension(0);chSave();
}
function chJumpTo(where){
  if(where==='mains'){
    chSetObjective('seek');player.x=54.7;player.y=9;player.a=0;CH.arrival=0;
  }else if(where==='triage'){
    chSetObjective('seek');
    player.x=10;player.y=34.5;player.a=Math.PI/2;CH.arrival=0;
  }else if(where==='gate'){
    // the crossing, with the ward emptied so it can be walked in peace
    CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=50;player.y=32;player.a=0;CH.arrival=0;
  }else if(where==='maze'){
    CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=61;player.y=30;CH.arrival=0;
    chEnterMaze();                       // already through
    if(CH.maze)CH.maze.sealed=false;     // it still closes as you step clear
    player.x=52;player.y=40;player.a=Math.PI;
    chSettle();chDeepLook(1);liminal.mix=1;
  }else if(where==='transfer'){
    CH.power=true;chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    player.x=33.5;player.y=19.6;player.a=-Math.PI/2;CH.arrival=0;
  }else if(where==='after'){
    CH.power=true;CH.gateOpen=false;chOpenDoors();chSetLights();
    enemies=[];drops=[];CH.cleared.triage=true;CH.cleared.reception=true;
    chSetObjective('return');cleared=true;
    CH.flags.annexe=true;chOpenStaffRoute();chOccupyWard();
    player.x=8;player.y=32;player.a=Math.PI/2;CH.arrival=0;
  }else if(where==='reception'){
    CH.power=true;chOpenDoors();chSetLights();
    enemies=enemies.filter(e=>e.enc!=='triage');
    CH.cleared.triage=true;chSetObjective('return');cleared=true;
    player.x=26;player.y=50.6;player.a=Math.PI/2;CH.arrival=0;
  }
  _safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();
}
function chRestorePower(){
  if(CH.power)return;
  CH.power=true;CH.gateOpen=true;chCarveGate();chOpenDoors();chSetLights();cleared=true;
  chSetObjective('return');
  whiteFlash=.10;shake=Math.max(shake,3);audio.seal();
  say('POWER RESTORED',2.6);
  feed('SECURITY DOOR RELEASED / SERVICE RETURN OPEN');
  chSave();
}
function chSave(){
  CH.checkpoint={phase:CH.phase,power:CH.power,
    live:{...CH.live},cleared:{...CH.cleared},flags:{...CH.flags},
    x:player.x,y:player.y,a:player.a,hp:Math.max(45,player.hp),
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,
    dead:enemies.filter(e=>!e.alive&&!e.enc).length};
}
function chRestore(){
  const c=CH.checkpoint;if(!c)return;
  hideOverlays();useChapter=true;loadStage(0);
  CH.phase=c.phase;CH.power=c.power;
  CH.live={...c.live};CH.cleared={...c.cleared};CH.flags={...c.flags};
  if(CH.power){chOpenDoors();chSetLights();cleared=true;}
  enemies=enemies.filter(e=>!(e.enc&&CH.cleared[e.enc]));
  for(const id in CH.live)if(CH.live[id]&&!enemies.some(e=>e.enc===id))chSpawnEnc(id);
  for(const e of enemies)if(e.enc&&CH.live[e.enc])e.noticed=true;
  if(CH.flags.cache)drops=drops.filter(d=>d.ch!=='cache');
  if(CH.flags.annexe){chOpenStaffRoute();chOccupyWard();}
  CH.tr=null;                      // re-arms on entry unless already done
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;
  chSetObjective(CH.phase);
  CH.arrival=0;CH.tension=0;audio.tension(0);CH.checkpoint=c;
  buildFlow();mode='playing';document.body.classList.add('playing');
  $('touch').classList.remove('hidden');
  audio.start();lockPointer();hudUpdate();feed('RESUMED FROM CHECKPOINT');
}
function chComplete(){
  if(CH.ending)return;CH.ending=true;
  score+=2500+Math.round(player.hp*12);
  finish(true);
  $('endLabel').textContent='CHAPTER 01 COMPLETE';
  $('endTitle').textContent='ADMISSIONS.';
  $('endReason').textContent='Admissions test complete. Return to Test Ward to choose another chapter.';
}

const chIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
function chTick(dt){
  if(!chRunning())return;
  if(CH.arrival>0){
    CH.arrival-=dt;
    if(!chIn(player.x,player.y,16,50,37,61))CH.arrival=0;
  }
  if(!CH.cleared.triage&&!CH.live.triage&&CH.arrival<=0&&chIn(player.x,player.y,12,35,20,46))
    chActivate('triage');
  if(CH.phase==='arrive'&&player.y<49.5)chSetObjective('seek');
  // Power is restored deliberately at the labelled mains panel (E / touch).
  if(chIn(player.x,player.y,13,24,20,30)){
    if(!CH.flags.annex){CH.flags.annex=true;feed('RECORDS / STAFF CACHE');chSave();}
    if(!CH.flags.cache&&!drops.some(d=>d.ch==='cache')){CH.flags.cache=true;chSave();}
  }
  chDeepTick(dt);
  if(CH.maze)return;
  trTick(dt);
  if(CH.tr)return;                       // the ward waits while you are in there
  if(CH.power&&!CH.cleared.reception&&!CH.live.reception&&chIn(player.x,player.y,16,50,37,61))
    chActivate('reception');
  const want=(CH.live.triage||CH.live.reception)?1:0;
  if(want!==CH.tension){CH.tension=want;audio.tension(want);}
}
audio.tension=function(level){
  if(!this.ctx||!this.musicBed)return;
  const t=this.ctx.currentTime;
  this.musicBed.gain.setTargetAtTime(hbVictory()?0:level?1:.26,t,level?.25:.9);
};

// SOURCE: fever.js
/* ================================================ FEVER THEATRE  (P06) === */
const FV={
  on:false, objective:'', valves:[], closed:0, orderly:null, ending:false,
  checkpoint:null, tension:0, arrival:0, sealed:true, hold:0,
  blackoutT:0, ventT:0, purgeT:0, purgeStep:0, returnOpen:false,
  recoveryUsed:false, mixZone:''
};
/* Each theatre declares its own doorway onto the spine and its own valve, the
   way ROOMS does in Admissions, so geometry, dressing, signage, lighting and
   the sleepers are all derived rather than hand-scattered. */
const FV_HALL=[
  {id:'OR1',x1:10,y1:18,x2:24,y2:30,door:{x:25,y:23},
   sleep:[[11.5,19.5],[23.5,29.5],[11.5,29.5]],label:'OR 1'},
  {id:'OR2',x1:30,y1:18,x2:46,y2:30,door:{x:29,y:23},east:23,
   sleep:[[31.5,19.5],[45.5,29.5],[31.5,29.5]],label:'OR 2'},
  {id:'OR3',x1:30,y1:34,x2:46,y2:46,door:{x:29,y:39},east:39,
   sleep:[[31.5,35.5],[45.5,45.5],[31.5,45.5]],label:'OR 3'}
];
const FV_REC={x1:10,y1:34,x2:24,y2:46,door:{x:25,y:39}};
const FV_SPINE={x1:26,y1:15,x2:28,y2:50};
// One cell wide, so the arch over it spans the opening with its columns in the
// flanking wall instead of standing in the doorway.
const FV_AIRLOCK=[[7,59]];                      // sealed until the loop is cold
const FV_EXIT={x:7.5,y:60.5};
function fvRunning(){return FV.on&&useChapter&&stage===1;}
const fvCX=h=>(h.x1+h.x2+1)/2, fvCY=h=>(h.y1+h.y2+1)/2;

/* ------------------------------------------------------------------ layout */
function fvCreateMap(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(4,52,10,58);        // vestibule: where you come in, and where you leave
  carve(6,60,8,61);         //   the airlock chamber beyond it
  carve(7,59,7,59);         //   and the single door into it
  carve(4,12,6,51);         // OUTER RING - west leg, 40 long
  carve(4,12,56,14);        // OUTER RING - north leg, 53 long
  carve(4,50,28,52);        // OUTER RING - south leg, meeting the west leg 3 wide
  carve(26,15,28,50);       // THE STERILE SPINE - 36 long, 3 wide, no cover
  carve(48,15,52,46);       // sterile store: the eastern way round
  carve(49,47,51,52);      // earned return from the store, behind a shutter
  carve(29,50,51,52);
  for(const x of [49,50,51])map[47][x]=1;
  for(const h of FV_HALL)carve(h.x1,h.y1,h.x2,h.y2);
  carve(FV_REC.x1,FV_REC.y1,FV_REC.x2,FV_REC.y2);
  carve(7,23,9,24);         // scrub lobby, ring -> OR1
  carve(7,39,9,40);         // scrub lobby, ring -> recovery
  // one doorway onto the spine each, cut after the halls exist
  for(const h of FV_HALL)for(let y=h.door.y;y<=h.door.y+1;y++)map[y][h.door.x]=0;
  for(let y=FV_REC.door.y;y<=FV_REC.door.y+1;y++)map[y][FV_REC.door.x]=0;
  for(const h of FV_HALL)if(h.east)for(let y=h.east;y<=h.east+1;y++)map[y][47]=0;

  // structural columns: cover inside the big halls, and none in a corridor
  for(const h of FV_HALL)for(const [x,y] of [[h.x1+3,h.y1+3],[h.x2-3,h.y1+3],
                                             [h.x1+3,h.y2-2],[h.x2-3,h.y2-2]])map[y][x]=2;
  for(const [x,y] of FV_AIRLOCK)map[y][x]=1;

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*5+y*11)%11===0)?3:((x+y*4)%7===0)?4:1;
}

/* ---------------------------------------------------------------- dressing */
function fvSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  for(const h of FV_HALL){
    const cx=fvCX(h), cy=fvCY(h), eastDoor=h.door.x>h.x2;
    add('bed',cx,cy,0,{seed:seed++});                      // the table, centre of the room
    add('lamp',cx,cy,0,{color:'#dff3ff',seed:seed++,fvHall:h.id});
    for(const dx of [-2.8,2.8])add('monitor',cx+dx,cy-1.4,0);
    add('control',cx,h.y1+.12,Math.PI,{fvSystem:h.id});
    add('lamp',cx,h.y1+1.1,0,{color:FV_SYSTEMS[h.id].color,seed:seed++,fvSystem:h.id});
    add('sign',cx+2.2,h.y1+.03,0,{label:FV_SYSTEMS[h.id].short});
    add('pipe',cx-3.5,h.y1+1.4,0,{length:7});
    add('pipe',cx+3.5,h.y1+1.4,0,{length:7});
    for(let x=h.x1+1.4;x<h.x1+5;x+=1.6)add('monitor',x,h.y2+.55,0);   // the back bench
    add('curtain',h.x2-1.6,h.y2-.7,0,{seed:seed++});
    add('arch',h.door.x+.5,h.door.y+1,0,{label:h.label});
    add('sign',eastDoor?h.x1+.03:h.x2+.97,cy,eastDoor?Math.PI/2:-Math.PI/2,{label:h.label});
  }
  // recovery: the one soft room in the suite, curtained rows
  for(let x=FV_REC.x1+1.6;x<FV_REC.x2;x+=2.6){
    add('bed',x,FV_REC.y1+.7,0,{seed:seed++});
    add('curtain',x+1.3,FV_REC.y1+1.3,0,{seed:seed++});
    add(seed++%3===0?'shrouded':'bed',x,FV_REC.y2+.35,0,{seed:seed++});
    add('curtain',x+1.3,FV_REC.y2-.9,0,{seed:seed++});
  }
  add('arch',FV_REC.door.x+.5,FV_REC.door.y+1,0,{label:'RECOVERY'});
  add('sign',FV_REC.x1+.03,40,Math.PI/2,{label:'RECOVERY'});
  add('lamp',17,40,0,{color:'#edc17b',seed:seed++});
  add('control',17.5,34.12,Math.PI,{fvSystem:'recovery'});
  add('sign',20,34.03,0,{label:'EMERGENCY SUPPLY'});

  // sterile store: shelving down one side, the long way round to OR2 and OR3
  for(let y=17;y<=44;y+=3.4)add('shrouded',52.4,y,0,{seed:seed++});
  add('sign',48.03,17,Math.PI/2,{label:'STERILE STORE'});
  add('sign',48.03,42,Math.PI/2,{label:'STERILE STORE'});
  add('arch',50.5,47,0,{label:'RETURN / SEALED',fvReturn:true});
  add('sign',48.03,44,Math.PI/2,{label:'OR 3 / PURGE RELEASE'});
  add('sign',32,50.03,0,{label:'STORE RETURN'});
  for(const [x,y] of [[50,24],[50,40]])add('pipe',x,y,Math.PI/2,{length:8});

  // scrub lobbies, which is what the two western links are. Signage only: a
  // sink against the wall of a 2-deep link still blocks half of it.
  for(const y of [23,39])add('sign',7.03,y+.5,Math.PI/2,{label:'SCRUB'});
  // the spine: bare. Signage overhead, nothing on the floor to hide behind.
  add('sign',26.03,17,Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('sign',28.97,48,-Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('arch',27.5,15,0,{label:'STERILE'});
  add('arch',27.5,50,0,{label:'STERILE'});
  for(let y=19;y<=47;y+=7)add('pipe',26.4,y,Math.PI/2,{length:6});

  // wayfinding on the ring, where real signage lives
  add('sign',4.03,20,Math.PI/2,{label:'THEATRES 1-3'});
  add('sign',4.03,44,Math.PI/2,{label:'RECOVERY'});
  add('sign',30,12.03,0,{label:'THEATRE SUITE'});
  add('sign',16,50.03,0,{label:'THEATRE SUITE'});

  // vestibule and the airlock you leave by
  add('arch',7.5,59.5,0,{label:'AIRLOCK'});
  add('sign',10.97,56,-Math.PI/2,{label:'AIRLOCK / SEALED'});
  add('sign',10.97,53,-Math.PI/2,{label:'1 POWER / 2 VENT / 3 PURGE'});
  add('monitor',4.45,57,Math.PI/2);add('monitor',10.55,57,-Math.PI/2);

  fvLights();
  rebuildFurniture();
}

/* Admissions gets brighter as you win. This gets darker: an isolated theatre
   loses its lights, so three valves closed is a suite you cannot see. */
function fvLights(){
  wardLights=[];
  for(const p of environmentProps)if(p.fvHall){
    p.off=FV.valves.some(v=>v.id===p.fvHall&&v.closed);
    p.color=p.off?'#263036':p.fvHall==='OR3'&&FV.purgeT>0?'#ff488d':'#dff3ff';
  }
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  // A live theatre is the brightest place in the game and an isolated one is
  // the darkest, so the fill has to cover the whole hall - one pool over the
  // table reads the same lit or dark, which is what r01 did.
  for(const h of FV_HALL){
    const cx=fvCX(h), cy=fvCY(h), off=FV.valves.some(v=>v.id===h.id&&v.closed);
    L(cx,cy,     off?[.10,.11,.14]:[1.45,1.52,1.60]);   // the lamp over the table
    L(cx,h.y1+2, off?[.08,.09,.12]:[.62,.82,.74]);      // the supply panel
    for(let gx=h.x1+3;gx<=h.x2-1;gx+=4.5)for(let gy=h.y1+3;gy<=h.y2-1;gy+=4.5)
      L(gx,gy,   off?[.07,.08,.10]:[.74,.80,.84]);
  }
  const recoveryOn=FV.valves.some(v=>v.id==='OR1'&&v.closed);
  L(15,38,recoveryOn?[.84,.61,.32]:[.18,.17,.16]);
  L(21,44,recoveryOn?[.62,.45,.25]:[.15,.15,.16]);
  for(let y=18;y<=48;y+=7.5)L(27.5,y,FV.ventT>0?[.22,.86,.68]:[.50,.62,.72]);
  for(let x=8;x<=54;x+=9)L(x,13,[.36,.42,.48]);           // outer ring, north
  for(let y=20;y<=48;y+=9)L(5,y,[.32,.38,.44]);           // outer ring, west
  L(14,51,[.30,.36,.42]); L(24,51,[.30,.36,.42]);
  for(let y=19;y<=43;y+=8)L(50,y,[.22,.26,.30]);          // the store, dim on purpose
  L(8,23.5,[.44,.54,.52]); L(8,39.5,[.44,.54,.52]);       // scrub lobbies
  L(7,55,[.66,.66,.62]); L(7,60,[.30,.34,.32]);
  for(let x=32;x<=50;x+=6)L(x,51,FV.returnOpen?[.22,.59,.49]:[.12,.15,.18]);
  if(FV.purgeT>0)for(const [x,y] of [[33,37],[44,37],[33,44],[44,44]])L(x,y,[1.05,.16,.28]);
  horrorLights();
  bakeLightField();
}

/* ------------------------------------------------------------- population */
const FV_RESIDENTS=[
  // Spine Runners live on the long sightlines - closing 40 units is their job
  [12.5,13.5,1],[30.5,13.5,1],[44.5,13.5,1],
  [5.5,44.5,1],[24.5,51.5,1],
  [50.5,18.5,1],[50.5,43.5,1],
  // Unstitched hold the corners and the rooms, where they are met at knife range
  [5.5,20.5,0],[14.5,51.5,0],[50.5,30.5,0],
  [27.5,18.5,0],[27.5,45.5,0],
  // Recovery begins empty. Pursuing creatures can still follow you inside.
  [22.5,20.5,0],[44.5,20.5,0],[44.5,36.5,0]
];
function fvPopulate(){
  enemies=[];drops=[];
  // ONE Orderly, and it holds the sterile spine. That is the chapter's problem.
  const o=spawn(27.5,32.5,2);o.noticed=false;o.fvHold=true;FV.orderly=o;
  for(const [x,y,t] of FV_RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  // and the sleepers, lying in the theatres. Dormant creatures take no damage,
  // so they cannot be cleared before the lights go out.
  for(const h of FV_HALL)for(const [i,[x,y]] of h.sleep.entries()){
    const e=spawn(x,y,h.id==='OR3'&&i===1?1:0);e.noticed=false;e.dormant=true;e.fvSleep=h.id;e.fvSlot=i;
  }
  drops.push({x:12.5,y:26.5,type:'life',life:999});
  drops.push({x:16.5,y:40.5,type:'life',life:999});
  drops.push({x:50.5,y:26.5,type:'ammo',life:999});   // the long way round pays
  drops.push({x:36.5,y:44.5,type:'ammo',life:999});
}

/* -------------------------------------------------------------- lifecycle */
function fvBegin(){
  FV.on=true;FV.ending=false;FV.closed=0;FV.tension=0;FV.arrival=30;
  FV.sealed=true;FV.hold=0;
  FV.blackoutT=FV.ventT=FV.purgeT=FV.purgeStep=0;
  FV.returnOpen=FV.recoveryUsed=false;FV.mixZone='';
  FV.valves=FV_HALL.map(h=>({id:h.id,x:fvCX(h),y:h.y1+1.5,closed:false}));
  // setupEnvironment bakes the light field BEFORE this runs, off whatever the
  // previous scene left in FV.valves, so a theatre could load dark with its
  // valve open. Re-bake now that the valves are actually reset.
  fvLights();
  cleared=false;exit={...FV_EXIT};
  player.x=7.5;player.y=54.5;player.a=-Math.PI/2;
  _safeX=player.x;_safeY=player.y;
  fvSetObjective();audio.tension(0);audio.theatre(true);
  FV.checkpoint=null;fvSave();
}
function fvSetObjective(){
  FV.objective = FV.closed>=3 ? 'ALL SYSTEMS ISOLATED · RETURN TO THE AIRLOCK'
                              : 'ISOLATE THE THREE THEATRE SYSTEMS · '+FV.closed+' / 3';
  hudUpdate();
}
function fvOpenAirlock(){
  if(!FV.sealed)return;FV.sealed=false;
  for(const [x,y] of FV_AIRLOCK)map[y][x]=0;
  buildFlow();
  for(const p of environmentProps)
    if(p.kind==='sign'&&p.label==='AIRLOCK / SEALED')p.label='AIRLOCK / OPEN';
}
function fvCloseValve(v){fvFinishSystem(v);}
function fvSave(){
  FV.checkpoint={closed:FV.closed,valves:FV.valves.map(v=>({...v})),sealed:FV.sealed,
    x:player.x,y:player.y,a:player.a,hp:Math.max(45,player.hp),
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,
    gameTime,stageTime,stageKills,maxCombo,
    enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),decals:decals.map(d=>({...d})),
    blackoutT:FV.blackoutT,ventT:FV.ventT,purgeT:FV.purgeT,purgeStep:FV.purgeStep,
    returnOpen:FV.returnOpen,recoveryUsed:FV.recoveryUsed};
}
function fvRestore(){
  const c=FV.checkpoint;if(!c)return;
  hideOverlays();audio.reset();useChapter=true;loadStage(1);
  FV.closed=c.closed;FV.valves=c.valves.map(v=>({...v}));
  enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));decals=c.decals.map(d=>({...d}));
  FV.orderly=enemies.find(e=>e.fvHold);
  for(const key of ['blackoutT','ventT','purgeT','purgeStep','recoveryUsed'])FV[key]=c[key];
  if(c.returnOpen)fvOpenReturn();
  enemyId=Math.max(enemyId,...enemies.map(e=>e.id+1));
  if(FV.closed>=3){cleared=true;fvOpenAirlock();}
  fvLights();
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;
  gameTime=c.gameTime;stageTime=c.stageTime;stageKills=c.stageKills;maxCombo=c.maxCombo;combo=comboT=0;
  FV.checkpoint=c;FV.arrival=0;FV.tension=0;
  buildFlow();mode='playing';document.body.classList.add('playing');
  $('touch').classList.remove('hidden');
  audio.start();audio.theatre(true);lockPointer();
  fvSetObjective();feed('RESUMED FROM CHECKPOINT');fvRoomMix();
}
function fvComplete(){
  if(FV.ending)return;FV.ending=true;
  score+=3500+Math.round(player.hp*14);
  audio.theatre(false);
  finish(true);
  $('endLabel').textContent='CHAPTER 02 COMPLETE';
  $('endTitle').textContent='FEVER THEATRE.';
  $('endReason').textContent='The Theatre test is complete. Repeat it with another system order, or return to Test Ward.';
}
/* Admissions hands over to the upgrade screen, which loads this chapter. */
function chHandOver(){
  if(CH.ending)return;CH.ending=true;
  score+=2500+Math.round(player.hp*12);
  say('',0);feed('THE SUITE IS STILL RUNNING');
}

/* ------------------------------------------------------------------- tick */
const fvIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const fvInSpine=(x,y)=>fvIn(x,y,FV_SPINE.x1-.3,FV_SPINE.y1-.3,FV_SPINE.x2+1.3,FV_SPINE.y2+1.3);

function fvTick(dt){
  if(!fvRunning())return;
  if(FV.arrival>0){FV.arrival-=dt;if(player.y<51)FV.arrival=0;}

  fvSystemTick(dt);

  // The Orderly will not leave the sterile spine. It is a ranged denier in a
  // 3-wide corridor with no cover, and the theatre doorways along the spine are
  // the only thing to break its line on. Take the ring instead if you would rather.
  const o=FV.orderly;
  if(o&&o.alive&&FV.ventT<=0){
    o.x=clamp(o.x,FV_SPINE.x1+.35,FV_SPINE.x2+.65);
    o.y=clamp(o.y,FV_SPINE.y1+.35,FV_SPINE.y2+.65);
    if(fvInSpine(player.x,player.y))FV.hold=0;
    else{
      FV.hold+=dt;
      if(FV.hold>2.2){                       // you left: it goes back on station
        const d=32.5-o.y;
        if(Math.abs(d)>.4)move(o,0,Math.sign(d)*.95*dt);
        else o.noticed=false;
      }
    }
  }
  const hot=enemies.some(e=>e.alive&&!e.dormant&&e.noticed&&
                            Math.hypot(e.x-player.x,e.y-player.y)<11)?1:0;
  if(hot!==FV.tension){FV.tension=hot;FV.mixZone='';audio.tension(hot);}
  fvRoomMix(hot);
}

/* ------------------------------------------------ Test Ward entry points */
function fvJumpTo(where){
  if(where==='spine'){
    player.x=27.5;player.y=48.5;player.a=-Math.PI/2;
  }else if(where==='or1'||where==='or2'||where==='or3'){
    const h=FV_HALL[Number(where.slice(-1))-1];
    player.x=fvCX(h);player.y=h.y1+2.2;player.a=-Math.PI/2;
  }else if(where==='recovery'){
    fvFinishSystem(FV.valves[0],true);FV.blackoutT=0;
    player.x=17.5;player.y=36.2;player.a=-Math.PI/2;
  }else if(where==='ring'){
    player.x=50.5;player.y=34.5;player.a=-Math.PI/2;
  }else if(where==='end'){
    for(const v of FV.valves)fvFinishSystem(v,true);
    fvOpenReturn();
    player.x=27.5;player.y=48.5;player.a=Math.PI/2;
  }
  FV.arrival=0;_safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();fvSave();
}

/* ---------------------------------- walkability, through the furniture too */
const FV_WAY={
  vestibule:[7,54], airlock:[7,60], ringW:[5,30], ringN:[30,13], ringS:[16,51],
  spineN:[27,17], spineMid:[27,32], spineS:[27,48],
  or1:[17,24], or2:[38,24], or3:[38,40], recovery:[17,40],
  valve1:[17.5,20], valve2:[38.5,20], valve3:[38.5,36],
  store:[50,30], storeOR2:[47,23.5], storeOR3:[47,39.5],
  scrub1:[8,23.5], scrub2:[8,39.5]
};
function fvValidate(from){
  const S=.25, seen=new Set(), key=(x,y)=>Math.round(x/S)+':'+Math.round(y/S);
  const sx=from?from[0]:player.x, sy=from?from[1]:player.y;
  if(!fits(sx,sy))return {start:'BLOCKED AT START',reached:{}};
  const q=[[sx,sy]];seen.add(key(sx,sy));
  while(q.length){
    const [x,y]=q.pop();
    for(const [nx,ny] of [[x+S,y],[x-S,y],[x,y+S],[x,y-S]]){
      if(nx<1||ny<1||nx>MW-1||ny>MH-1)continue;
      const k=key(nx,ny);if(seen.has(k)||!fits(nx,ny))continue;
      seen.add(k);q.push([nx,ny]);
    }
  }
  const reached={};
  for(const n in FV_WAY){
    const [wx,wy]=FV_WAY[n];let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok',cells:seen.size,reached,stuck,lostDrops};
}

/* ---------------------------------------------------------------- the room
   A hard, bright, tiled suite: a long convolution tail, room tone up at 6 kHz
   where Admissions sits at 3.7, plus plant and a ventilator that will not stop.
   The score itself is left alone, so combat still swells the way it always does
   - this is the building underneath it, not a different soundtrack. */
audio.ensureTheatre=function(){
  if(this.thr||!this.ctx)return;
  const a=this.ctx,out={};
  // 1. plant: a thin high hum, the sound of equipment that is still powered
  out.hum=a.createGain();out.hum.gain.value=.0001;
  const hf=a.createBiquadFilter();hf.type='lowpass';hf.frequency.value=2600;hf.Q.value=.7;
  for(const [f,g,t] of [[196,.10,'sawtooth'],[294,.05,'sine'],[392,.035,'sine'],[588,.018,'sine']]){
    const o=a.createOscillator();o.type=t;o.frequency.value=f;
    const gg=a.createGain();gg.gain.value=g;o.connect(gg).connect(hf);o.start();
  }
  const drift=a.createOscillator();drift.type='sine';drift.frequency.value=.047;
  const driftAmt=a.createGain();driftAmt.gain.value=6;
  drift.connect(driftAmt).connect(hf.frequency);drift.start();
  hf.connect(out.hum).connect(this.music);

  // 2. the ventilator: filtered noise gated by a slow sine. It breathes for
  //    something you never find, about 15 a minute, and it never varies.
  const len=a.sampleRate*3,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  let last=0;for(let i=0;i<len;i++){last=(last+rand(-1,1)*.30)*.90;d[i]=last;}
  const noise=a.createBufferSource();noise.buffer=buf;noise.loop=true;
  const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=780;bp.Q.value=2.2;
  const gate=a.createGain();gate.gain.value=0;
  const puff=a.createOscillator();puff.type='sine';puff.frequency.value=.25;
  const puffAmt=a.createGain();puffAmt.gain.value=.5;
  const puffBias=a.createConstantSource();puffBias.offset.value=.5;
  puff.connect(puffAmt).connect(gate.gain);puffBias.connect(gate.gain);
  out.vent=a.createGain();out.vent.gain.value=.0001;
  noise.connect(bp).connect(gate).connect(out.vent).connect(this.music);
  noise.start();puff.start();puffBias.start();
  this.thr=out;
};
audio.theatre=function(on){
  if(!this.ctx)return;
  this.ensureTheatre();
  const now=this.ctx.currentTime,T=1.1;
  this.thr.hum.gain.setTargetAtTime(on?.17:.0001,now,T);
  this.thr.vent.gain.setTargetAtTime(on?.20:.0001,now,T);
  this.ambience.gain.setTargetAtTime(settings.sfx*(on?.09:.19),now,T);
  this.roomReturn.gain.setTargetAtTime(on?1.05:.62,now,T);
  this.roomTone.frequency.setTargetAtTime(on?6200:3700,now,T);
  const want=on?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};

// SOURCE: fever-choices.js
// R3-P01: each theatre changes how the suite can be used. No kill quota.
const FV_SYSTEMS={
 OR1:{short:'CUT POWER',name:'OR 1 / POWER',action:'ISOLATE POWER',color:'#edc17b',
  hint:'Wakes the patients here. Restores the emergency supply in Recovery.'},
 OR2:{short:'VENT SPINE',name:'OR 2 / VENTILATION',action:'ACTIVATE VENTILATION',color:'#54efff',
  hint:'Stuns the large creature in the central corridor for 20s. Patients wake when the vent stops.'},
 OR3:{short:'START PURGE',name:'OR 3 / PURGE',action:'START THE PURGE',color:'#ff488d',
  hint:'12 seconds. Patients wake in stages. Opens the store return; you can move away.'}
};
const FV_RECOVERY={x:17.5,y:34.12,id:'recovery'};
function fvSystem(id){return FV.valves.find(v=>v.id===id);}
function fvControlInfo(id){
 if(id==='recovery')return {color:'#edc17b',done:FV.recoveryUsed,ready:!!fvSystem('OR1')?.closed,progress:0};
 const v=fvSystem(id);return {color:FV_SYSTEMS[id].color,done:!!v?.closed,ready:true,
  progress:id==='OR3'&&FV.purgeT>0?1-FV.purgeT/12:0};
}
function fvNearestUse(){
 if(!fvRunning()||mode!=='playing')return null;
 const targets=[...FV.valves.map(v=>({...v,y:v.y-1.38})),FV_RECOVERY];
 let target=null,nearest=2.5;
 for(const v of targets){
  const d=Math.hypot(v.x-player.x,v.y-player.y);
  if(d>=nearest||Math.abs(angle(Math.atan2(v.y-player.y,v.x-player.x)-player.a))>1.05||
     !lineOfSight(player.x,player.y,v.x,v.y))continue;
  target=v;nearest=d;
 }
 return target;
}
function fvInteract(){
 const target=fvNearestUse();if(!target)return false;
 if(target.id==='recovery'){
  if(!fvSystem('OR1').closed){feed('NO POWER / ISOLATE OR 1');return true;}
  if(FV.recoveryUsed){feed('EMERGENCY SUPPLY EMPTY');return true;}
  FV.recoveryUsed=true;player.hp=Math.min(100,player.hp+40);
  for(const g of guns)g.reserve=Math.min(g.maxReserve,g.reserve+g.mag*3);
  audio.pickup();say('TAKE A BREATH.',1.8);feed('LIFE +40 / RESERVE AMMO / CHECKPOINT');fvSave();return true;
 }
 const v=fvSystem(target.id);
 if(v.closed){feed(FV_SYSTEMS[v.id].short+' / ISOLATED');return true;}
 if(v.id==='OR3'&&FV.purgeT>0){feed('PURGE RUNNING / KEEP MOVING');return true;}
 if(v.id==='OR1'){
  FV.blackoutT=2.4;fvFinishSystem(v);
  say('THE LIGHTS GO FIRST.',2);feed('RECOVERY SUPPLY RESTORED');
 }else if(v.id==='OR2'){
  FV.ventT=20;
  if(FV.orderly){FV.orderly.windup=FV.orderly.charge=0;FV.orderly.cd=1.2;}
  fvFinishSystem(v);audio.play('environment1',{pos:{x:27.5,y:32.5},vol:.85,rate:.7,wet:.7});
  say('THE SPINE IS BREATHING.',2);feed('ORDERLY SUPPRESSED / 20 SECONDS');
 }else{
  FV.purgeT=12;FV.purgeStep=0;fvWake('OR3',0);FV.purgeStep=1;
  fvLights();audio.play('machinery',{pos:v,vol:.6,wet:.45,rate:1.15});
  say('DO NOT WAIT BESIDE IT.',2);feed('PURGE RUNNING / STORE RETURN WILL OPEN');fvSave();
 }
 fvHud();return true;
}
function fvFinishSystem(v,silent=false){
 if(!v||v.closed)return;
 v.closed=true;FV.closed++;
 if(v.id==='OR3')fvOpenReturn();
 if(!silent){whiteFlash=.06;shake=Math.max(shake,3.2);audio.play('seal',{vol:.6,pos:v,wet:.9,rate:.62});}
 if(FV.closed>=3){cleared=true;fvOpenAirlock();if(!silent){say('LOOP ISOLATED',2.6);feed('AIRLOCK RELEASED / VESTIBULE');}}
 fvLights();fvSetObjective();if(!silent)fvSave();
}
function fvWake(id,slot=null){
 let first=null;
 for(const e of enemies)if(e.fvSleep===id&&e.alive&&e.dormant&&(slot===null||e.fvSlot===slot)){
  e.dormant=false;e.noticed=true;e.cd=1;e.alertT=.45;first=first||e;
 }
 if(first){audio.creature(first,true);FV.tension=1;audio.tension(1);}
}
function fvOpenReturn(){
 FV.returnOpen=true;for(const x of [49,50,51])map[47][x]=0;
 for(const p of environmentProps)if(p.fvReturn)p.label='RETURN / OPEN';
 buildFlow();
}
function fvSystemTick(dt){
 if(FV.blackoutT>0){FV.blackoutT=Math.max(0,FV.blackoutT-dt);if(!FV.blackoutT)fvWake('OR1');}
 if(FV.ventT>0){
  FV.ventT=Math.max(0,FV.ventT-dt);
  if(FV.orderly&&FV.orderly.alive){FV.orderly.windup=FV.orderly.charge=0;FV.orderly.cower=.45;}
  if(!FV.ventT){
   if(FV.orderly){FV.orderly.cower=0;FV.orderly.cd=1.2;}
   fvWake('OR2');fvLights();feed('VENT STOPPED / THE SPINE IS LIVE');
  }
 }
 if(FV.purgeT>0){
  FV.purgeT=Math.max(0,FV.purgeT-dt);
  for(;FV.purgeStep<3&&12-FV.purgeT>=FV.purgeStep*4;FV.purgeStep++)fvWake('OR3',FV.purgeStep);
  if(!FV.purgeT){fvFinishSystem(fvSystem('OR3'));if(FV.closed<3){say('PURGE COMPLETE',2);feed('STORE RETURN OPEN / SOUTH HATCH');}}
 }
}
function fvSuppressed(e){return fvRunning()&&e.fvHold&&FV.ventT>0;}
function fvRoomMix(hot=FV.tension){
 if(!audio.ctx||!audio.musicBed)return;
 const recovery=fvIn(player.x,player.y,10,34,25,47),zone=recovery&&!hot?'recovery':hot?'combat':'ward';
 if(zone===FV.mixZone)return;FV.mixZone=zone;
 const t=audio.ctx.currentTime;
 audio.musicBed.gain.setTargetAtTime(zone==='recovery'?.09:zone==='combat'?1:.26,t,.65);
 if(audio.thr){audio.thr.hum.gain.setTargetAtTime(zone==='recovery'?.045:.17,t,.65);audio.thr.vent.gain.setTargetAtTime(zone==='recovery'?.055:.20,t,.65);}
}
function fvCompassTarget(){
 if(FV.closed>=3)return exit;
 const list=FV.valves.filter(v=>!v.closed&&!(v.id==='OR3'&&FV.purgeT>0));
 return list.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]||fvSystem('OR3');
}
function fvHud(){
 const on=fvRunning()&&mode==='playing';
 $('fvStatus').classList.toggle('hidden',!on);
 if(on){
  const beats=[];
  if(FV.ventT>0)beats.push('SPINE SUPPRESSED '+Math.ceil(FV.ventT)+'s');
  if(FV.purgeT>0)beats.push('PURGE '+Math.ceil(FV.purgeT)+'s / KEEP MOVING');
  if(!beats.length)beats.push(FV.returnOpen?'STORE RETURN OPEN':FV.closed?'Choose your next system · M opens the map':'Find a labelled control in each operating room. [E] to use.');
  $('fvStatus').textContent=beats.join(' · ');
 }
 const p=on?fvNearestUse():null;
 $('interactPrompt').classList.toggle('hidden',!p);$('touchUse').classList.toggle('hidden',!p);
 if(!p)return;
 const info=fvControlInfo(p.id),system=FV_SYSTEMS[p.id];
 const action=p.id==='recovery'?(info.done?'SUPPLY EMPTY':info.ready?'TAKE EMERGENCY SUPPLY':'NO POWER / ISOLATE OR 1'):
  info.done?'SYSTEM ISOLATED':p.id==='OR3'&&FV.purgeT>0?'PURGE RUNNING':system.action;
 $('interactAction').textContent=(info.done||!info.ready||info.progress>0?'':coarse?'USE · ':'[E] ')+action;
 $('touchUse').textContent=info.done?'DONE':p.id==='OR3'&&FV.purgeT>0?'RUNNING':'USE';
 $('interactHint').textContent=p.id==='recovery'?'One use: +40 life, reserve ammunition and a checkpoint.':system.hint;
 $('interactPrompt').style.borderColor=info.color;
}

// SOURCE: heart.js
/* ================================================ THE HEART WARD  (P07) == */
const HW={
  on:false, objective:'', phase:'arrive', ending:false, checkpoint:null,
  wave:0, waveT:0, live:false, warden:null, resolved:false, staff:false,
  arrival:0, tension:0, intensity:0
};
/* the landmarks, at the footprints they had in the chapters they came from */
const HW_RECEPTION={x1:16,y1:48,x2:36,y2:58};      // Admissions, shifted 2 north
const HW_ALCOVE   ={x1:13,y1:52,x2:15,y2:54};      //   its security alcove
const HW_SPINE    ={x1:10,y1:10,x2:12,y2:54};      // Fever's sterile spine, 45 long
const HW_HEART    ={x1:16,y1:6,x2:48,y2:17};       // the one new space
const HW_CORE     ={x1:28,y1:10,x2:36,y2:13};      //   the mass you walk around
const HW_AFTER    ={x1:4,y1:1,x2:58,y2:3};         // the aftermath, 55 long
const HW_DOOR     =[[32,4],[32,5]];                // Heart -> aftermath, shut
const HW_STAFF    =[[37,49]];                      // reception -> riser, if you found the annexe
// The front doors are a place, reached through a single-cell opening, so a
// player hugging a wall down a three-wide corridor cannot walk straight past
// the end of the game.
const HW_EXIT     ={x:56.5,y:2.5};
/* W-01..W-06, west of the sterile spine, doors onto it at x=9 */
const HW_ROOMS=[0,1,2,3,4,5].map(i=>({
  id:'W0'+(i+1), label:'W‑0'+(i+1),
  x1:4, y1:16+i*6, x2:8, y2:20+i*6, door:18+i*6
}));
function hwRunning(){return HW.on&&useChapter&&stage===2;}
const hwIn=(x,y,x1,y1,x2,y2)=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const hwInHeart=()=>hwIn(player.x,player.y,HW_HEART.x1,HW_HEART.y1,HW_HEART.x2+1,HW_HEART.y2+1);

/* ------------------------------------------------------------------ layout */
function hwCreateMap(){
  map=Array.from({length:MH},()=>Array(MW).fill(1));
  const carve=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)map[y][x]=0;};

  carve(24,59,28,62);                                   // arrival lobby
  carve(HW_RECEPTION.x1,HW_RECEPTION.y1,HW_RECEPTION.x2,HW_RECEPTION.y2);
  carve(HW_ALCOVE.x1,HW_ALCOVE.y1,HW_ALCOVE.x2,HW_ALCOVE.y2);
  carve(HW_SPINE.x1,HW_SPINE.y1,HW_SPINE.x2,HW_SPINE.y2);
  carve(12,10,16,12);                                   // the approach into the Heart
  carve(HW_HEART.x1,HW_HEART.y1,HW_HEART.x2,HW_HEART.y2);
  carve(49,10,52,50);                                   // east riser
  carve(38,48,49,50);                                   // staff run, riser -> reception
  carve(37,49,37,49);                                   //   one cell, so HW_STAFF really seals it
  carve(HW_AFTER.x1,HW_AFTER.y1,HW_AFTER.x2,HW_AFTER.y2);
  map[1][56]=map[3][56]=1;                              // one-cell vestibule entry
  carve(57,1,61,3);                                     // a real walk to the outer doors
  for(const [x,y] of HW_DOOR)carve(x,y,x,y);
  for(const r of HW_ROOMS){carve(r.x1,r.y1,r.x2,r.y2);map[r.door][9]=0;}

  for(let y=HW_CORE.y1;y<=HW_CORE.y2;y++)               // the mass in the middle
    for(let x=HW_CORE.x1;x<=HW_CORE.x2;x++)map[y][x]=2;
  // reception's columns, in the places they stood in Admissions
  for(const [x,y] of [[20,52],[20,56],[32,52],[32,56]])map[y][x]=2;

  for(const [x,y] of HW_DOOR)map[y][x]=1;               // shut until it is over
  for(const [x,y] of HW_STAFF)map[y][x]=1;              // shut unless you found the annexe

  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)
    if(map[y][x]===1)map[y][x]=((x*7+y*13)%13===0)?3:((x+y*3)%9===0)?4:1;
}
function hwOpenStaff(){
  if(HW.staff)return;HW.staff=true;
  for(const [x,y] of HW_STAFF)map[y][x]=0;
  buildFlow();
}
function hwOpenWayOut(){
  for(const [x,y] of HW_DOOR)map[y][x]=0;
  buildFlow();
}

/* ---------------------------------------------------------------- dressing
   Reception and the patient rooms are quoted from Admissions and the spine
   from Fever Theatre, prop for prop. The recognition is the content. */
function hwSetupEnvironment(){
  environmentProps=[];furniture=[];wardLights=[];
  const add=(k,x,y,a=0,extra={})=>environmentProps.push({kind:k,x,y,a,...extra});
  let seed=0;

  /* --- ADMISSIONS RECEPTION, exactly as it was ------------------------- */
  const R=HW_RECEPTION;
  for(let y=R.y1+2;y<=R.y1+6;y+=1.2)add('monitor',R.x2+.55,y,-Math.PI/2);
  add('sign',R.x2+.97,R.y1+.6,-Math.PI/2,{label:'ADMISSIONS'});
  for(let x=19;x<=33;x+=2.4){
    add('bed',x,R.y2-.5,0,{seed:seed++});
    add('curtain',x+1.2,R.y2-1.1,0,{seed:seed++});
  }
  add('sign',R.x1+.03,55,Math.PI/2,{label:'WAITING'});
  add('sign',R.x2+.97,52,-Math.PI/2,{label:'ADMISSIONS'});
  add('arch',15.5,53.5,Math.PI/2,{label:'SECURITY'});     // E-W passage
  add('sign',13.03,53.5,Math.PI/2,{label:'SECURITY'});
  add('sign',26,62.97,-Math.PI,{label:'THE HEART WARD'});

  /* --- THE STERILE SPINE, exactly as Fever Theatre had it -------------- */
  const S=HW_SPINE;
  add('sign',S.x1+.03,12,Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('sign',S.x2+.97,50,-Math.PI/2,{label:'RESTRICTED / STERILE'});
  add('arch',11.5,10,0,{label:'STERILE'});
  add('arch',11.5,54,0,{label:'STERILE'});
  for(let y=14;y<=52;y+=7)add('pipe',S.x1+.4,y,Math.PI/2,{length:6});

  /* --- W-01..W-06, exactly as Admissions dressed them ------------------ */
  for(const r of HW_ROOMS){
    const cy=(r.y1+r.y2+1)/2;
    add('arch',r.x2+1.5,r.door+.5,Math.PI/2,{label:r.label});   // E-W doorway
    add('sign',r.x2+.97,r.door-1.4,-Math.PI/2,{label:r.label});
    add('bed',r.x1+.9,cy,Math.PI/2,{seed:seed++});              // head to the far wall
    add('monitor',r.x1+.9,cy+1.15,Math.PI/2);
    add('curtain',r.x2-.6,cy-1.1,Math.PI/2,{seed:seed++});
    add('lamp',(r.x1+r.x2+1)/2,cy,0,{color:'#8be5df',seed:seed++});
  }

  /* --- THE HEART, the only room in here nobody has been in ------------- */
  const H=HW_HEART, C=HW_CORE;
  for(let x=C.x1+.5;x<=C.x2+.5;x+=2)add('monitor',x,C.y1-.45,Math.PI);
  for(let x=C.x1+.5;x<=C.x2+.5;x+=2)add('monitor',x,C.y2+1.45,0);
  for(const [x,y] of [[C.x1-.55,11],[C.x1-.55,13],[C.x2+1.55,11],[C.x2+1.55,13]])
    add('pipe',x,y,Math.PI/2,{length:9});
  add('sign',C.x1+4.5,C.y1-.48,Math.PI,{label:'THE HEART'});
  for(const [x,y] of [[22,9],[22,15],[42,9],[42,15]])
    add('lamp',x,y,0,{color:'#ff3e70',seed:seed++});
  add('arch',32.5,4.5,0,{label:'EXIT'});
  add('sign',H.x1+.03,12,Math.PI/2,{label:'PLANT / HEART'});
  add('sign',H.x2+.97,12,-Math.PI/2,{label:'EAST RISER'});
  for(let y=8;y<=16;y+=3){add('shrouded',17.4,y,0,{seed:seed++});add('shrouded',47.6,y,0,{seed:seed++});}

  /* --- the riser and the staff run ------------------------------------- */
  for(let y=13;y<=47;y+=4)add('shrouded',51.5,y,0,{seed:seed++});
  add('sign',49.03,20,Math.PI/2,{label:'EAST RISER'});
  add('arch',37.5,49.5,Math.PI/2,{label:'STAFF'});
  add('sign',38,48.03,0,{label:'STAFF ONLY'});

  /* --- the aftermath --------------------------------------------------- */
  for(let x=8;x<=56;x+=8)add('pipe',x,HW_AFTER.y1+.4,0,{length:7});
  add('sign',20,HW_AFTER.y1+.03,0,{label:'MAIN ENTRANCE'});
  add('sign',44,HW_AFTER.y1+.03,0,{label:'MAIN ENTRANCE'});
  add('arch',56.5,2.5,Math.PI/2,{label:'MAIN ENTRANCE'});

  hwLights();
  rebuildFurniture();
}

/* Reception and the rooms are lit as they were when the power came back on in
   Admissions. The spine is lit as Fever lit it. The Heart is lit by its own
   core and nothing else, and the aftermath is daylight-cold and even. */
function hwLights(){
  wardLights=[];
  const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
  const R=HW_RECEPTION;
  L(26,53,[1.00,.96,.86]); L(20,55,[1.00,.96,.86]); L(32,55,[1.00,.96,.86]);
  L(26,50,[.80,.86,.84]);  L(26,60,[.62,.60,.56]);
  L(14,53,[.44,.50,.54]);
  // The recognition is the content, so the whole hall has to be legible - the
  // counter, the seating and the columns are what the player is meant to know.
  for(const x of [19,25,31])for(const y of [50,54,57])L(x,y,[.50,.48,.44]);
  for(let y=13;y<=53;y+=7.5)L(11.5,y,[.50,.62,.72]);        // the spine, Fever's light
  for(const r of HW_ROOMS)L((r.x1+r.x2+1)/2,(r.y1+r.y2+1)/2,[.62,.80,.78]);
  const C=HW_CORE, on=HW.phase!=='after';
  for(let x=C.x1;x<=C.x2+1;x+=3){                            // the core is the light
    L(x,C.y1-1.2, on?[1.15,.34,.52]:[.16,.20,.26]);
    L(x,C.y2+2.2, on?[1.15,.34,.52]:[.16,.20,.26]);
  }
  // the flanks are where the fight actually happens, so they get enough light
  // to read the roles apart, and no more - the core stays the brightest thing
  for(const x of [19,23,41,45])for(const y of [8,12,16])
    L(x,y, on?[.40,.34,.40]:[.20,.24,.28]);
  for(let y=14;y<=46;y+=8)L(50.5,y,[.26,.30,.36]);           // the riser
  L(43,49,[.36,.40,.44]);
  for(let x=8;x<=58;x+=7)L(x,2,[.86,.90,.96]);               // the aftermath, cold and even
  L(60.5,2.5,[1.30,1.34,1.40]);                              // and daylight in the porch
  horrorLights();
  bakeLightField();
}

/* ------------------------------------------------------------- population */
/* Reception and the lobby stay EMPTY. The chapter opens on recognising a room,
   and it cannot do that with something standing in it. The first creature is
   past the security door, which is also the first thing that is wrong. */
const HW_RESIDENTS=[
  [11.5,14.5,0],[11.5,26.5,1],[11.5,38.5,0],[11.5,46.5,1],   // the sterile spine
  [6,18.5,0],[6,30.5,0],[6,42.5,0],[6,48.5,1],               // in the patient rooms
  [50.5,14.5,1],[50.5,28.5,0],[50.5,44.5,1],                 // the east riser
  [43,49.5,0]
];
function hwPopulate(){
  enemies=[];drops=[];
  for(const [x,y,t] of HW_RESIDENTS){const e=spawn(x,y,t);e.noticed=false;}
  drops.push({x:6,y:24.5,type:'life',life:999});
  drops.push({x:6,y:36.5,type:'ammo',life:999});
  drops.push({x:50.5,y:34.5,type:'ammo',life:999});     // the riser pays, if you can use it
  drops.push({x:19,y:12,type:'life',life:999});
  drops.push({x:45,y:12,type:'ammo',life:999});
}
function hwSetObjective(phase){
  HW.phase=phase;
  HW.objective =
    phase==='arrive' ? 'FIND THE HEART' :
    phase==='heart'  ? 'DESTROY THE HEART' :
                       'THE WAY OUT IS OPEN';
  hudUpdate();
}
function hwBegin(){
  HW.on=true;HW.ending=false;HW.wave=0;HW.waveT=0;HW.live=false;
  HW.warden=null;HW.resolved=false;HW.staff=false;HW.arrival=30;
  HW.tension=0;HW.intensity=0;
  cleared=false;exit={...HW_EXIT};
  player.x=26.5;player.y=61.5;player.a=-Math.PI/2;
  _safeX=player.x;_safeY=player.y;
  // the discovery payoff: chapter one's flags survive into chapter three
  if(typeof CH!=='undefined'&&CH.flags&&CH.flags.annexe)hwOpenStaff();
  hwSetObjective('arrive');
  audio.tension(0);audio.theatre(false);audio.heart(0);
  hwLights(); // Rebuild the visual state after a replay of the resolved Heart.
  HW.checkpoint=null;hwSave();
}
function hwSave(){
  const {checkpoint,warden,...state}=HW;
  HW.checkpoint={state:{...state},boss:hbSnapshot(),map:map.map(row=>row.slice()),
    enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),
    x:player.x,y:player.y,a:player.a,hp:player.hp,
    ammo:guns.map(g=>({a:g.ammo,r:g.reserve})),weapon,score,kills,stageKills,gameTime,stageTime,maxCombo,enemyId};
}
function hwRestore(){
  const c=HW.checkpoint;if(!c)return;
  hideOverlays();audio.reset();useChapter=true;loadStage(2);
  map=c.map.map(row=>row.slice());Object.assign(HW,c.state);
  enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));
  hbRestoreSnapshot(c.boss);HW.warden=enemies.find(e=>e.type===3&&e.hwSeen)||null;
  player.x=c.x;player.y=c.y;player.a=c.a;player.hp=c.hp;player.vx=player.vy=0;
  _safeX=player.x;_safeY=player.y;
  guns.forEach((g,i)=>{g.ammo=c.ammo[i].a;g.reserve=c.ammo[i].r;});
  weapon=c.weapon;score=c.score;kills=c.kills;stageKills=c.stageKills;gameTime=c.gameTime;stageTime=c.stageTime;maxCombo=c.maxCombo;enemyId=c.enemyId;
  HW.checkpoint=c;HW.arrival=0;cleared=HB.state==='dead';
  buildFlow();mode='playing';document.body.classList.add('playing');
  if(HB.state==='dormant'&&hbSafeEntry())hbStart(HB.hp/HB.maxHp,true,HB.training);
  else if(hbFighting())hbUpdatePhase(true);
  else{audio.heart(0);if(hbVictory())audio.heartSilenceMusic();}
  if(HB.state==='dead')audio.heartAftermath();
  hwLights();hudUpdate();$('touch').classList.remove('hidden');audio.start();lockPointer();feed('RESUMED FROM CHECKPOINT');
}
/* the peak resolves rather than stopping: everything drops away, and the thing
   that delivered you in chapter one is standing in front of the way out. */
function hwResolve(silent){
  if(HW.resolved||!HB.active||HB.state!=='dead')return;
  HW.resolved=true;HW.live=false;
  const w=spawn(32.5,7.5,3);w.dormant=true;w.noticed=false;w.hwSeen=true;HW.warden=w;
  HW.intensity=0;audio.heart(0);audio.tension(0);
  hwOpenWayOut();cleared=true;
  hwSetObjective('after');hwLights();
  if(!silent){
    say('THE HEART IS DEAD.',2.4);
    feed('THE WAY OUT IS OPEN');
  }
  hwSave();
}
function hwComplete(){
  if(HW.ending)return;HW.ending=true;
  score+=6000+Math.round(player.hp*22);
  audio.heart(0);
  finish(true);
  $('endLabel').textContent='THREE WARDS / ONE SURVIVOR';
  $('endTitle').textContent='DISCHARGED.';
  $('endReason').textContent='Admissions, Fever Theatre, the Heart. The hospital is quiet. The front doors are finally open.';
  $('leaveHospitalBtn').classList.remove('hidden');
}
/* Fever now hands over here instead of ending the build. */
function fvHandOver(){
  if(FV.ending)return;FV.ending=true;
  score+=3500+Math.round(player.hp*14);
  audio.theatre(false);
  say('',0);feed('ONE WARD LEFT');
}

/* ------------------------------------------------------------------- tick */
function hwTick(dt){
  if(!hwRunning())return;
  if(HW.arrival>0){HW.arrival-=dt;if(player.y<58)HW.arrival=0;}
  if(HB.state==='dormant'&&hbSafeEntry())hbStart();
  hbTick(dt);
  const w=HW.warden;
  if(HW.resolved&&w&&player.y<9.5&&Math.abs(player.x-32.5)<4)w.x=mix(w.x,36.4,1-Math.exp(-dt*2.2));
}

/* ------------------------------------------------ Test Ward entry points */
function hwJumpTo(where){
  if(where==='spine'){player.x=11.5;player.y=52;player.a=-Math.PI/2;}
  else if(where==='rooms'){player.x=11.5;player.y=30.5;player.a=Math.PI;}
  else if(where==='heart'){player.x=14.5;player.y=11.5;player.a=0;}
  else if(['finale','peak','rupture','target','death','bloodwell','bloodfan'].includes(where)){
    player.x=24.5;player.y=15.5;player.a=-.58;
    const practice=where==='bloodwell'?'well':where==='bloodfan'?'fan':'';
    if(practice){HB.attackPractice=practice;HB.attackT=1.5;enemies=[];}
    hbStart(where==='peak'||where==='bloodfan'?.29:where==='rupture'||where==='bloodwell'?.64:where==='death'?1/HB.maxHp:1,true,where==='target');
  }else if(where==='after'){
    player.x=24.5;player.y=15.5;player.a=-.58;hbSkip();
  }else if(where==='staff'){hwOpenStaff();player.x=34;player.y=49.5;player.a=0;}
  HW.arrival=0;_safeX=player.x;_safeY=player.y;buildFlow();hudUpdate();
}

/* ---------------------------------- walkability, through the furniture too */
const HW_WAY={
  lobby:[26,61], reception:[26,53], counter:[35,52], alcove:[14,53],
  spineS:[11,52], spineMid:[11,32], spineN:[11,12],
  w01:[6,18], w03:[6,30], w06:[6,48],
  approach:[14,11], heartW:[19,12], heartN:[32,8], heartS:[32,15], heartE:[46,12],
  riserN:[50,12], riserS:[50,48], staffRun:[44,49],
  afterW:[8,2], afterE:[56,2], porch:[60,2]
};
function hwValidate(from,withStaff){
  if(withStaff)hwOpenStaff();
  const S=.25, seen=new Set(), key=(x,y)=>Math.round(x/S)+':'+Math.round(y/S);
  const sx=from?from[0]:player.x, sy=from?from[1]:player.y;
  if(!fits(sx,sy))return {start:'BLOCKED AT START',reached:{}};
  const q=[[sx,sy]];seen.add(key(sx,sy));
  while(q.length){
    const [x,y]=q.pop();
    for(const [nx,ny] of [[x+S,y],[x-S,y],[x,y+S],[x,y-S]]){
      if(nx<1||ny<1||nx>MW-1||ny>MH-1)continue;
      const k=key(nx,ny);if(seen.has(k)||!fits(nx,ny))continue;
      seen.add(k);q.push([nx,ny]);
    }
  }
  const reached={};
  for(const n in HW_WAY){
    const [wx,wy]=HW_WAY[n];let ok=false;
    for(let dx=-.6;dx<=.6&&!ok;dx+=S)for(let dy=-.6;dy<=.6&&!ok;dy+=S)
      if(seen.has(key(wx+dx,wy+dy)))ok=true;
    reached[n]=ok;
  }
  const stuck=enemies.filter(e=>e.alive&&!fits(e.x,e.y,e.r)).map(e=>creatureTypes[e.type].name+'@'+e.x+','+e.y);
  const lostDrops=drops.filter(d=>!fits(d.x,d.y)).map(d=>d.type+'@'+d.x+','+d.y);
  return {start:'ok',cells:seen.size,reached,stuck,lostDrops};
}

/* ---------------------------------------------------------------- the room
   "Let sound reveal what kind of place it has become." The Heart has a pulse,
   and the pulse is the only thing in the game that speeds up as you lose. It
   is scaled by wave, and at the resolution it stops - which is what the
   aftermath corridor is for. */
audio.ensureHeart=function(){
  if(this.hrt||!this.ctx)return;
  const a=this.ctx,out={};
  // a low double-thump on a slow LFO: a pump, not a heart, but close enough
  out.pulse=a.createGain();out.pulse.gain.value=.0001;
  const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;lp.Q.value=1.4;
  for(const [f,g] of [[41,.42],[62,.18],[27,.30]]){
    const o=a.createOscillator();o.type='sine';o.frequency.value=f;
    const gg=a.createGain();gg.gain.value=g;o.connect(gg).connect(lp);o.start();
  }
  const beat=a.createGain();beat.gain.value=0;
  out.rate=a.createOscillator();out.rate.type='sawtooth';out.rate.frequency.value=.75;
  const beatAmt=a.createGain();beatAmt.gain.value=.45;
  const beatBias=a.createConstantSource();beatBias.offset.value=.45;
  out.rate.connect(beatAmt).connect(beat.gain);beatBias.connect(beat.gain);out.beatAmt=beatAmt;out.beatBias=beatBias;
  lp.connect(beat).connect(out.pulse).connect(this.music);
  out.rate.start();beatBias.start();

  // and a wide metallic shimmer over it, so the hall sounds like a hall
  const len=a.sampleRate*4,buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  let last=0;for(let i=0;i<len;i++){last=(last+rand(-1,1)*.18)*.96;d[i]=last;}
  const n=a.createBufferSource();n.buffer=buf;n.loop=true;
  const hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=2400;
  out.air=a.createGain();out.air.gain.value=.0001;
  n.connect(hp).connect(out.air).connect(this.music);n.start();
  this.hrt=out;
};
/* t = 0 is the ward and the aftermath, 1 is the peak of the finale */
audio.heart=function(t){
  if(!this.ctx)return;
  this.ensureHeart();
  t=clamp(t,0,1);
  const now=this.ctx.currentTime,T=.9;
  const synced=hbFighting();
  this.hrt.beatAmt.gain.setValueAtTime(synced?0:.45,now);this.hrt.beatBias.offset.setValueAtTime(synced?1:.45,now);
  this.hrt.pulse.gain.setTargetAtTime(synced?.0001:Math.max(.0001,t*.52),now,T);
  this.hrt.air.gain.setTargetAtTime(Math.max(.0001,t*.16),now,T);
  this.hrt.rate.frequency.setTargetAtTime(mix(.62,1.55,t),now,T*2);
  this.roomReturn.gain.setTargetAtTime(mix(.62,1.25,t),now,T);
  this.roomTone.frequency.setTargetAtTime(mix(3700,2400,t),now,T);
  const want=t>.35?this.impLong:this.impShort;
  if(this.room.buffer!==want){try{this.room.buffer=want;}catch(e){}}
};
audio.heartFrame=function(pulse,intensity){
  if(!this.ctx||!this.hrt||!hbFighting())return;
  const now=this.ctx.currentTime,gain=this.hrt.pulse.gain;
  gain.cancelScheduledValues(now);gain.setTargetAtTime(Math.max(.0001,pulse*intensity*.52),now,.012);
};

// SOURCE: heart-boss.js
// R3-P03-R01: one stationary boss behind four exposed, shared-health surfaces.
const HB_MAX_HP=9000;
const HB_PORTS=[[19.5,7.5],[23.5,16.2],[32.5,7.1],[41,7.5],[45.5,16.2],[44,11.8],[20,13.6],[40,16]];
const HB={};let heartBossFaces=[];
function hbReset(){
 heartBossFaces=[];
 Object.assign(HB,{active:useChapter&&stage===2,state:'dormant',hp:HB_MAX_HP,maxHp:HB_MAX_HP,phase:1,
  introT:0,spawnT:2,births:[],spawnCount:0,lastPort:-1,gates:[],training:false,
  hitT:0,hitSoundT:0,trail:HB_MAX_HP,trailHold:0,deathT:0,burst:false,settled:false,drained:false,flowAtDeath:0,scoreBudget:4500,
  beatPhase:.08,beatCount:0,bpm:76,attack:null,attackT:4.2,attackIndex:0,attackPractice:'',birthRest:0});
 $('bossHud').classList.add('hidden');document.body.classList.remove('boss-fight');
}
function hbRunning(){return HB.active&&hwRunning();}
function hbFighting(){return hbRunning()&&(HB.state==='awakening'||HB.state==='fighting');}
function hbInside(x=player.x,y=player.y){return x>=16&&x<49&&y>=6&&y<18;}
function hbSafeEntry(){return player.x>=16.7&&player.x<=48.3&&player.y>=6.4&&player.y<=17.6;}
function hbVictory(){return hbRunning()&&(HB.state==='dying'||HB.state==='dead');}
function hbPressure(){return hbFighting()&&!HB.training&&(!review.active||review.ai);}
function hbCopyAttack(a){return a?{...a,lanes:a.lanes?.map(l=>({...l}))}:null;}
function hbSnapshot(){return {...HB,attack:hbCopyAttack(HB.attack),births:HB.births.map(b=>({...b})),gates:HB.gates.map(g=>g.slice())};}
function hbRestoreSnapshot(s){Object.assign(HB,s,{attack:hbCopyAttack(s.attack),births:s.births.map(b=>({...b})),gates:s.gates.map(g=>g.slice())});}
function hbGates(close){
 if(close){
  if(HB.gates.length)return;
  const cells=[];for(let y=10;y<=12;y++)cells.push([15,y]);for(let y=10;y<=17;y++)cells.push([49,y]);
  for(const [x,y] of cells)if(map[y][x]===0){HB.gates.push([x,y,0]);map[y][x]=4;}
 }else{for(const [x,y,v] of HB.gates)map[y][x]=v;HB.gates=[];}
 buildFlow();
}
function hbStart(fraction=1,quiet=false,training=false){
 if(!hbRunning()||HB.state!=='dormant'||!hbSafeEntry())return false;
 HB.hp=clamp(fraction,.00001,1)*HB.maxHp;HB.trail=HB.hp;HB.training=training;
 hwSave(); // Before gates close, with the exact loadout and supplies for this attempt.
 HB.state='awakening';HB.introT=quiet?.3:2;HB.spawnT=quiet?.5:1.4;
 HW.arrival=0;HW.phase='heart';HW.live=true;cleared=false;
 for(const e of enemies)if(e.alive&&e.type!==3&&hbInside(e.x,e.y)){e.hb=true;e.noticed=true;}
 hbGates(true);hbUpdatePhase(true);hbHud();
 if(!quiet){say('THE HEART',1.8);feed('DESTROY THE HEART\nKILL ITS SPAWN TO RECOVER');
  audio.play('roar0',{vol:.95,rate:.78,pos:hbSoundPoint(),wet:.65});audio.duck(.3,.75);}
 return true;
}
function hbUpdatePhase(silent=false){
 const pct=HB.hp/HB.maxHp,n=pct>.65?1:pct>.30?2:3,changed=n!==HB.phase;
 HB.phase=n;HW.wave=n;HW.intensity=n/3;HW.objective='DESTROY THE HEART';
 if(changed)HB.attackT=Math.min(HB.attackT,4.2);
 audio.heart(HW.intensity);audio.tension(1);audio.heartScoreFrame();
 if(changed&&!silent){HB.spawnT=Math.min(HB.spawnT,1.8);
  feed(n===2?'THE HEART IS RUPTURING':'CARDIAC FAILURE');
  audio.play(n===2?'scream0':'roar1',{vol:.8,rate:.76,pos:hbSoundPoint(),wet:.6});
  if(!settings.reduce)shake=Math.max(shake,3);
 }
}
function hbFaces(){return heartBossFaces;}
function hbSoundPoint(){
 let best=null,dist=Infinity;
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),u=clamp((player.x-p.x)*c+(player.y-p.y)*s,-1.5,1.5);
  const q={x:p.x+c*u-s*.14,y:p.y+s*u+c*.14,z:.6},d=Math.hypot(q.x-player.x,q.y-player.y);
  if(d<dist&&!wall(q.x,q.y)){best=q;dist=d;}
 }return best||{x:24,y:15,z:.6};
}
function hbRay(x,y,dx,dy,max=70){
 if(!hbFighting())return null;
 const obstruction=castRay(x,y,dx,dy,max).d;let hit=null,nearest=Math.min(max,obstruction+.035);
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),nx=-s,ny=c,den=dx*nx+dy*ny;
  if(den>=-.000001)continue;
  const t=((p.x-x)*nx+(p.y-y)*ny)/den;if(t<0||t>nearest)continue;
  const hx=x+dx*t,hy=y+dy*t,u=(hx-p.x)*c+(hy-p.y)*s;
  // A forgiving body span follows the same surface as the rendered organ.
  if(Math.abs(u)>p.size*.53)continue;
  hit={d:t,x:hx,y:hy,face:p};nearest=t;
 }return hit;
}
function hbProjectileContact(q,dx,dy){
 const length=Math.hypot(dx,dy);if(!length)return null;
 const ux=dx/length,uy=dy/length,b=hbRay(q.x,q.y,ux,uy,length+q.r);if(!b)return null;
 // A creature in front of the surface intercepts the projectile first.
 for(const e of enemies){if(!e.alive)continue;
  const ex=e.x-q.x,ey=e.y-q.y,along=ex*ux+ey*uy,across=ex*uy-ey*ux,r=e.r+q.r;
  if(Math.abs(across)<=r&&along+r>=0&&Math.max(0,along-Math.sqrt(r*r-across*across))<b.d)return null;
 }return b;
}
function hbExplosion(q){
 if(!hbFighting())return;
 const big=q.kind==='grave',radius=big?2.65:.45;let best=q.hbHit?{d:0,x:q.hbHit.x,y:q.hbHit.y}:null;
 if(!best)for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),nx=-s,ny=c;
  if((q.x-p.x)*nx+(q.y-p.y)*ny<-.005)continue;
  const u=clamp((q.x-p.x)*c+(q.y-p.y)*s,-p.size*.53,p.size*.53);
  const x=p.x+c*u+nx*.015,y=p.y+s*u+ny*.015,d=Math.hypot(q.x-x,q.y-y);
  if(d<radius&&(!best||d<best.d)&&lineOfSight(q.x,q.y,x,y))best={d,x,y};
 }
 if(best)hbDamage(q.damage*(big?clamp(1-best.d/radius,.2,1):1),best,q.kind);
}
function hbDamage(amount,point,kind='shotgun'){
 if(!hbFighting()||!Number.isFinite(amount)||amount<=0)return 0;
 const dealt=Math.min(HB.hp,amount*mods.damage);
 if(!(review.active&&review.holdBoss))HB.hp=Math.max(0,HB.hp-dealt);
 HB.hitT=.10;HB.trailHold=.3;hitmarker=.12;
 if(point)emit(point.x,point.y,.55,kind==='grave'?'#ff9fcc':'#dd245d',settings.reduce?4:kind==='grave'?22:7,kind==='grave'?1.25:.65);
 if(HB.hitSoundT<=0){audio.play(kind==='grave'?'gore0':kind==='plasma'?'flesh1':'bodyhit0',
  {vol:kind==='grave'?.95:.62,rate:kind==='grave'?.75:.9,pos:point||hbSoundPoint(),wet:.36});HB.hitSoundT=kind==='grave'?.18:.1;}
 if(HB.hp<=0)hbDie();else if((HB.hp/HB.maxHp>.65?1:HB.hp/HB.maxHp>.30?2:3)!==HB.phase)hbUpdatePhase();
 hbHud();return dealt;
}
function hbReward(e,earned){
 if(!hbRunning()||!e.hb)return earned;
 const value=Math.min(earned,HB.scoreBudget);HB.scoreBudget-=value;return value;
}
function hbQueueBirth(){
 if(!hbBirthAllowed())return false;
 const live=enemies.filter(e=>e.alive&&e.type!==3&&(e.hb||hbInside(e.x,e.y)));
 const cap=[6,8,10][HB.phase-1];if(live.length+HB.births.length>=cap)return false;
 const available=HB_PORTS.map(([x,y],i)=>({x,y,i})).filter(p=>p.i!==HB.lastPort&&!HB.births.some(b=>b.port===p.i)&&
  Math.hypot(p.x-player.x,p.y-player.y)>4.25&&fits(p.x,p.y,.3)&&flow[(p.y|0)*MW+(p.x|0)]>=0&&live.every(e=>Math.hypot(e.x-p.x,e.y-p.y)>1));
 if(!available.length)return false;
 const p=available[(HB.spawnCount*3+HB.phase)%available.length];
 let type=HB.phase===1?(HB.spawnCount%3===2?1:0):HB.spawnCount%2;
 if(HB.phase>1&&HB.spawnCount%5===4&&!live.some(e=>e.type===2)&&!HB.births.some(b=>b.type===2))type=2;
 if(!live.some(e=>e.type===0)&&!HB.births.some(b=>b.type===0))type=0;
 HB.births.push({x:p.x,y:p.y,port:p.i,type,t:1.3});HB.lastPort=p.i;HB.spawnCount++;
 audio.play('gore1',{vol:.65,pos:p,wet:.5,rate:.75});return true;
}
function hbTick(dt){
 if(!hbRunning())return;
 enemies=enemies.filter(e=>!e.hb||e.alive||e.death>0);
 HB.hitT=Math.max(0,HB.hitT-dt);HB.hitSoundT=Math.max(0,HB.hitSoundT-dt);
 HB.trailHold=Math.max(0,HB.trailHold-dt);if(HB.trailHold<=0)HB.trail=mix(HB.trail,HB.hp,1-Math.exp(-dt*5));
 if(HB.state==='dormant')return;
 if(HB.state==='dying'){
  HB.deathT+=dt;
  if(!HB.burst&&HB.deathT>=.72){HB.burst=true;hbBurst();}
  hbFinaleTick();if(HB.deathT>=6.5)hbFinish();return;
 }
 if(HB.state==='dead')return;
 HB.introT=Math.max(0,HB.introT-dt);if(HB.introT===0)HB.state='fighting';
 hbRhythmTick(dt);
 if(!hbPressure()){HB.births=[];return;}
 const cap=[6,8,10][HB.phase-1];
 for(let i=HB.births.length-1;i>=0;i--){const b=HB.births[i];b.t-=dt;if(b.t>0)continue;
  const live=enemies.filter(e=>e.alive&&e.type!==3&&(e.hb||hbInside(e.x,e.y))).length;
  if(live<cap&&fits(b.x,b.y,.3)&&Math.hypot(b.x-player.x,b.y-player.y)>2.1&&enemies.every(e=>!e.alive||Math.hypot(e.x-b.x,e.y-b.y)>.8)){
   const e=spawn(b.x,b.y,b.type);e.hb=true;e.noticed=true;e.cd=1.1;e.alertT=.3;
   emit(b.x,b.y,.35,'#e51e69',settings.reduce?8:20,.7);audio.creature(e,true);
  }HB.births.splice(i,1);
 }
 HB.spawnT-=dt;
 if(HB.spawnT<=0&&HB.introT<.6&&hbBirthAllowed()){hbQueueBirth();hbQueueBirth();HB.spawnT=[5.2,4.3,3.5][HB.phase-1];}
}
function hbDie(){
 if(!hbFighting())return;
 HB.flowAtDeath=horrorFrame().flow;HB.hp=0;HB.state='dying';HB.deathT=0;HB.births=[];HB.attack=null;HW.live=false;
 for(const e of enemies)if(e.alive&&e.type!==3){e.alive=false;e.death=.38;e.windup=e.charge=0;}
 // Do not mutate the projectile array while explode() is iterating it.
 for(const q of bullets)if(q.owner==='enemy')q.cancelled=true;
 HB.trailHold=.1;score+=4000;comboT=0;HW.objective='THE HEART IS DYING';
 audio.heart(0);audio.tension(0);
 audio.heartSilenceMusic();
 if(!audio.heartDeathStart())audio.play('roar1',{vol:.95,rate:.58,pos:hbSoundPoint(),wet:.7});audio.duck(.08,.7);
 say('CARDIAC ARREST',1.5);feed('THE HEART HAS STOPPED');hbHud();
}
function hbBurst(){
 for(const p of hbFaces()){
  const x=p.x-Math.sin(p.a)*.12,y=p.y+Math.cos(p.a)*.12;
  ring(x,y,'#ff377e',4.5,.8);emit(x,y,1.2,'#f02869',settings.reduce?12:42,1.65);
  emit(x,y,.9,'#ecc4b5',settings.reduce?3:9,1.2);
 }
 if(!settings.reduce){shake=Math.max(shake,8);whiteFlash=Math.max(whiteFlash,.07);}
 if(!audio.heartBuffer){audio.boom(1.15,hbSoundPoint());audio.play('gore2',{vol:1,rate:.58,wet:.65});}
 hwLights();
}
function hbFinish(silent=false){
 if(!hbRunning()||HB.state==='dead')return;
 for(const e of enemies)if(!e.alive)e.death=0;
 HB.hp=0;HB.trail=0;HB.state='dead';HB.deathT=6.5;HB.births=[];HB.attack=null;
 hbGates(false);hwResolve(silent);
 audio.heartAftermath();
 hbHud();
}
function hbSkip(){
 if(!hbRunning())return;
 for(const e of enemies)if(e.type!==3){e.alive=false;e.death=0;}
 for(const q of bullets)if(q.owner==='enemy')q.cancelled=true;
 HB.state='dying';hbFinish(true);
}
function hbHud(){
 if(cbRunning()){cbHud();return;}
 const visible=hbRunning()&&HB.state!=='dormant'&&mode!=='menu';
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);
 if(!visible)return;
 $('bossTitle').textContent='THE HEART';$('bossHud').setAttribute('aria-label','The Heart boss');$('bossMeter').setAttribute('aria-label','The Heart health');
 const pct=clamp(HB.hp/HB.maxHp,0,1);
 $('bossFill').style.width=(pct*100)+'%';$('bossTrail').style.width=(clamp(HB.trail/HB.maxHp,0,1)*100)+'%';
 $('bossHealth').textContent=HB.state==='dead'?'DEAD':Math.ceil(pct*100)+'%';
 $('bossState').textContent=HB.state==='dying'?(HB.deathT<.72?'CARDIAC ARREST':HB.deathT<4.1?'RUPTURE':'NO PULSE'):HB.state==='dead'?'THE WAY OUT IS OPEN':
  HB.training?'TARGET PRACTICE':HB.attack&&!HB.attack.fired?(HB.attack.kind==='well'?'BLOOD RISE':'ARTERIAL SALVO'):
  review.active&&review.holdBoss?'HEALTH HELD':HB.state==='awakening'?'AWAKENING':['AWAKENING','RUPTURE','CARDIAC FAILURE'][HB.phase-1];
 $('bossMeter').setAttribute('aria-valuenow',Math.round(pct*100));
 $('bossHud').classList.toggle('boss-dead',HB.state==='dead');
}
function hbRenderBirths(){
 if(!hbRunning())return;
 for(const b of HB.births){const v=project(b.x,b.y,.04);if(!v||v.x<0||v.x>=W||zBuffer[v.x|0]<v.d)continue;
  const r=v.scale*(.22+(1-b.t/1.3)*.24);wc.save();wc.strokeStyle='#fff0cd';wc.lineWidth=2;
  wc.beginPath();wc.ellipse(v.x,v.y,r,r*.27,0,0,TAU);wc.stroke();
  drawGlow(v.x,v.y-v.scale*.13,r,'#ff367f',.32);wc.restore();
 }
}

// SOURCE: heart-rhythm.js
// R02: sparse, readable attacks within the approved R01 summon/weapon economy.
function hbPulse(){
 if(!hbFighting())return 0;
 const p=HB.beatPhase;
 return Math.exp(-(((p-.10)/.085)**2))+.55*Math.exp(-(((p-.32)/.11)**2));
}
function hbAttacksEnabled(){return hbPressure()&&HB.phase>=2&&(!review.active||review.bloodAttacks);}
function hbBirthAllowed(){return !HB.attackPractice&&!HB.attack&&HB.birthRest<=0;}
function hbAttackOrigin(){
 let best=null,nearest=Infinity;
 for(const p of hbFaces()){
  const c=Math.cos(p.a),s=Math.sin(p.a),u=clamp((player.x-p.x)*c+(player.y-p.y)*s,-1.35,1.35);
  const x=p.x+c*u-s*.18,y=p.y+s*u+c*.18,d=Math.hypot(x-player.x,y-player.y);
  if(d<nearest&&!wall(x,y)&&lineOfSight(x,y,player.x,player.y)){best={x,y};nearest=d;}
 }return best;
}
function hbBeginAttack(kind){
 if(!hbAttacksEnabled()||HB.attack||HB.births.length||!hbInside())return false;
 const origin=hbAttackOrigin();if(!origin)return false;
 // Close to the organ, a floor eruption has a clearer escape than a tight fan.
 if(kind==='fan'&&Math.hypot(player.x-origin.x,player.y-origin.y)<1.3)kind='well';
 const beats=kind==='fan'?4:3;
 const a={kind,x:player.x,y:player.y,r:1.85,originX:origin.x,originY:origin.y,
  startBeat:HB.beatCount,fireBeat:HB.beatCount+beats,beats,age:0,fired:false,fadeT:.48,lanes:[]};
 if(kind==='fan'){
  const angle=Math.atan2(player.y-origin.y,player.x-origin.x);
  for(const offset of [-.36,0,.36]){
   const dx=Math.cos(angle+offset),dy=Math.sin(angle+offset),d=Math.max(0,castRay(origin.x,origin.y,dx,dy,12).d-.08);
   if(d>.5)a.lanes.push({x:origin.x,y:origin.y,ex:origin.x+dx*d,ey:origin.y+dy*d,r:.27});
  }if(!a.lanes.length)return false;
 }
 HB.attack=a;HB.attackIndex++;
 feed(kind==='well'?'THE FLOOR IS SWELLING\nMOVE OUT OF THE BLOOD RING':'ARTERIES OPENING\nSTEP BETWEEN THE MARKED LANES');
 audio.play(kind==='well'?'gore1':'scream0',{vol:.6,rate:kind==='well'?.66:.79,pos:origin,wet:.48});
 return true;
}
function hbSegmentDistance(x,y,l){
 const dx=l.ex-l.x,dy=l.ey-l.y,n=dx*dx+dy*dy;
 const t=n?clamp(((x-l.x)*dx+(y-l.y)*dy)/n,0,1):0;
 return Math.hypot(x-l.x-dx*t,y-l.y-dy*t);
}
function hbAttackContains(a,x,y){
 if(a.kind==='well')return Math.hypot(x-a.x,y-a.y)<a.r+.19&&lineOfSight(a.x,a.y,x,y);
 return a.lanes.some(l=>hbSegmentDistance(x,y,l)<l.r+.19&&lineOfSight(l.x,l.y,x,y));
}
function hbFireAttack(a){
 if(a.fired||!hbAttacksEnabled())return;
 a.fired=true;a.fadeT=.48;
 if(a.kind==='well'){
  ring(a.x,a.y,'#ff85ad',a.r,.42);emit(a.x,a.y,.18,'#e4275e',settings.reduce?10:38,1.35);
  audio.play('gore2',{vol:.85,rate:.72,pos:{x:a.x,y:a.y},wet:.45});
 }else{
  for(const l of a.lanes)for(let n=1;n<=6;n++){
   const x=mix(l.x,l.ex,n/7),y=mix(l.y,l.ey,n/7);emit(x,y,.18,'#ff376e',settings.reduce?1:4,.7);
  }
  audio.play('gore0',{vol:.85,rate:.7,pos:{x:a.originX,y:a.originY},wet:.5});
 }
 const contact=hbAttackContains(a,player.x,player.y),dashed=contact&&dashT>0;
 if(contact)hurtPlayer(a.kind==='well'?18:20,'The Heart marked the floor before it struck. Leave the blood ring, step between its lanes, or dash through the pulse.');
 if(HB.attackPractice)feed(dashed?'DASHED THROUGH THE PULSE':contact?(review.active&&!review.damage?'BLOOD CONTACT\nHEALTH PROTECTED':'BLOOD CONTACT'):'CLEAR\nKEEP FIRING');
}
function hbRhythmTick(dt){
 const before=HB.beatPhase;
 HB.bpm=mix(HB.bpm,[76,92,110][HB.phase-1],1-Math.exp(-dt*1.6));
 const travel=before+dt*HB.bpm/60,beats=Math.max(0,Math.floor(travel-.1)-Math.floor(before-.1));
 HB.beatPhase=travel%1;HB.beatCount+=beats;
 audio.heartFrame(hbPulse(),HW.intensity);audio.heartScoreFrame(beats);
 HB.birthRest=Math.max(0,HB.birthRest-dt);
 if(!hbAttacksEnabled()){HB.attack=null;HB.attackT=4.2;return;}
 const a=HB.attack;
 if(a){
  a.age+=dt;
  if(!a.fired&&beats>0&&HB.beatCount>=a.fireBeat&&a.age>=(a.kind==='well'?1.6:1.9))hbFireAttack(a);
  else if(a.fired){a.fadeT-=dt;if(a.fadeT<=0){HB.attack=null;HB.attackT=HB.attackPractice?3.5:HB.phase===2?10:8.5;HB.birthRest=.65;}}
  return;
 }
 HB.attackT-=dt;
 if(HB.attackT<=0&&beats>0&&HB.introT===0&&!HB.births.length){
  hbBeginAttack(HB.attackPractice||(HB.phase===2?'well':HB.attackIndex%2===0?'fan':'well'));
 }
}
// Thin world-space outlines, depth tested segment by segment. They mark danger,
// leaving most of the approved environment visible and staying clear without flashes.
function hbFloorOutline(points,color,width=2,alpha=1){
 wc.save();wc.strokeStyle=color;wc.lineWidth=width;wc.globalAlpha=alpha;wc.beginPath();
 let last=null;
 for(const p of points){const v=project(p.x,p.y,.045);
  if(!v||v.x<0||v.x>=W||v.y<0||v.y>H||zBuffer[v.x|0]<v.d-.08){last=null;continue;}
  if(last)wc.lineTo(v.x,v.y);else wc.moveTo(v.x,v.y);last=v;
 }wc.stroke();wc.restore();
}
function hbRenderAttack(){
 const a=HB.attack;if(!hbRunning()||!a)return;
 const progress=clamp((HB.beatCount-a.startBeat+(HB.beatPhase-.1+1)%1)/a.beats,0,1);
 const alpha=a.fired?clamp(a.fadeT/.48,0,1):.68+progress*.32;
 if(a.kind==='well'){
  for(const radius of [a.r,a.r*(.25+progress*.6)]){
   const pts=[];for(let i=0;i<=48;i++)pts.push({x:a.x+Math.cos(i/48*TAU)*radius,y:a.y+Math.sin(i/48*TAU)*radius});
   hbFloorOutline(pts,radius===a.r?'#ffe4bc':'#ff397c',radius===a.r?2.5:2,alpha);
  }
  for(const axis of [0,Math.PI/2])hbFloorOutline([-1,1].map(n=>({x:a.x+Math.cos(axis)*.18*n,y:a.y+Math.sin(axis)*.18*n})),'#ffe4bc',2,alpha);
 }else{
  for(const l of a.lanes){const dx=l.ex-l.x,dy=l.ey-l.y,d=Math.hypot(dx,dy)||1;
   for(const edge of [-1,0,1]){
    const pts=[],steps=Math.ceil(d/.35);
    for(let i=0;i<=steps;i++)pts.push({x:l.x+dx*i/steps-dy/d*l.r*edge,y:l.y+dy*i/steps+dx/d*l.r*edge});
    hbFloorOutline(pts,edge?'#ffe4bc':'#ff397c',edge?1.5:3,alpha);
   }
  }
 }
}

// SOURCE: heart-finale.js
// R03 presentation only. Health, attack clocks, summons and exits stay in R02.
// Three recorded arrangements share a 32-heartbeat phrase and seek to the
// simulation beat on retries. Pausing never advances encounter choreography.
audio.heartScoreStop=function(immediate=false){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 for(const v of this.hbScoreNodes||[]){
  v.gain.gain.cancelScheduledValues(now);v.gain.gain.setTargetAtTime(0,now,.045);
  try{v.source.stop(now+(immediate?0:.25));}catch{}
 }
 if(immediate)this.hbScoreNodes=[];
 this.hbScoreCurrent=null;
};
audio.heartPresentationReset=function(){
 this.heartScoreStop(true);
 if(this.hbDeathVoice){try{this.hbDeathVoice.source.stop();}catch{}this.hbDeathVoice=null;}
 this.hbDeathComplete=false;
};
// The regular ward score must have an exact zero, not an audible gain floor.
// Keep the boss arrangement's short drop and all separately routed death FX.
audio.heartSilenceMusic=function(){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 this.musicBed.gain.cancelScheduledValues(now);
 this.musicBed.gain.setValueAtTime(0,now);
 this.heartScoreStop();
};
audio.heartScoreFrame=function(beats=0){
 if(!this.ctx||!this.heartBuffer||!this.active||mode!=='playing'||!hbFighting())return;
 const now=this.ctx.currentTime;
 this.musicBed.gain.setTargetAtTime(0,now,.18);
 let current=this.hbScoreCurrent;
 const beat=Math.max(0,HB.beatCount-1+(HB.beatPhase-.1+1)%1);
 if(current){current.playedBeat+=(now-current.lastTime)*current.lastBpm/60;current.lastTime=now;current.lastBpm=HB.bpm;}
 // Phase changes join at a two-bar boundary; direct review entries start there.
 if(!current||((current.phase!==HB.phase||Math.abs(current.playedBeat-beat)>.14)&&beats>0&&(HB.beatCount-1)%4===0)){
  const cue=HEART_AUDIO_CUES['phase'+HB.phase],source=this.ctx.createBufferSource(),gain=this.ctx.createGain();
  source.buffer=this.heartBuffer;source.loop=true;source.loopStart=cue.start;source.loopEnd=cue.start+cue.duration;
  source.playbackRate.value=HB.bpm/cue.heart_bpm;
  gain.gain.value=0;source.connect(gain).connect(this.musicTone);
  const voice={source,gain,phase:HB.phase,bpm:cue.heart_bpm,playedBeat:beat,lastTime:now,lastBpm:HB.bpm};
  this.hbScoreNodes=this.hbScoreNodes||[];this.hbScoreNodes.push(voice);
  source.onended=()=>{source.disconnect();gain.disconnect();this.hbScoreNodes=this.hbScoreNodes.filter(v=>v!==voice);};
  source.start(now,cue.start+(beat%cue.beats)*60/cue.heart_bpm);
  gain.gain.setTargetAtTime(.88,now,.16);
  if(current){current.gain.gain.cancelScheduledValues(now);current.gain.gain.setTargetAtTime(0,now,.16);try{current.source.stop(now+.8);}catch{}}
  this.hbScoreCurrent=current=voice;
 }
 current.source.playbackRate.setTargetAtTime(HB.bpm/current.bpm,now,.025);
};
audio.heartDeathStart=function(){
 if(!this.ctx||!this.heartBuffer||!this.active||mode!=='playing'||HB.state!=='dying')return false;
 if(this.hbDeathVoice||this.hbDeathComplete)return true;
 const cue=HEART_AUDIO_CUES.death,elapsed=clamp(HB.deathT,0,cue.duration);
 if(elapsed>=cue.duration)return true;
 const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();
 source.buffer=this.heartBuffer;gain.gain.value=.92;source.connect(gain).connect(this.sfx);
 const voice={source,gain};this.hbDeathVoice=voice;
 source.onended=()=>{source.disconnect();gain.disconnect();if(this.hbDeathVoice===voice){this.hbDeathVoice=null;this.hbDeathComplete=true;}};
 source.start(this.ctx.currentTime,cue.start+elapsed,cue.duration-elapsed);
 return true;
};
audio.heartAftermath=function(){
 if(!this.ctx)return;
 const now=this.ctx.currentTime;
 this.heartSilenceMusic();
 this.ambience.gain.setTargetAtTime(settings.sfx*.055,now,.5);
 this.roomReturn.gain.setTargetAtTime(.82,now,.5);
 this.roomTone.frequency.setTargetAtTime(4100,now,.5);
 if(this.room.buffer!==this.impLong)this.room.buffer=this.impLong;
};

function hbFinaleTick(){
 if(HB.state!=='dying')return;
 audio.heartDeathStart();
 // Falling tissue is punctuation, not another damaging attack or a second blast.
 if(!HB.settled&&HB.deathT>=2.22){
  HB.settled=true;
  for(const p of hbFaces()){
   const x=p.x-Math.sin(p.a)*.16,y=p.y+Math.cos(p.a)*.16;
   emit(x,y,.64,'#542638',settings.reduce?3:12,.45);
  }
 }
 if(!HB.drained&&HB.deathT>=4.1){
  HB.drained=true;feed('NO PULSE');
  if(audio.ctx){audio.ambience.gain.setTargetAtTime(settings.sfx*.055,audio.ctx.currentTime,.7);}
 }
}

// SOURCE: horror-environment.js
// R3-P02 corruption, with R3-P03 hit and death states driven by the boss.
// Material slots 0–3 stay the owner's atlas; 4–7 are infected tile / bone / muscle / blood.
const horrorZone=new Uint8Array(MW*MH),horrorMix=new Float32Array(MW*MH);
const horrorLightActive=new Float32Array(128*128*3);
let horrorHeartCanvas=null,horrorHeartHitCanvas=null,horrorHeartDeadCanvas=null,horrorHeartFadeCanvas=null,horrorHeartBlend=-1,horrorView={active:false,clock:0,pulse:0,energy:0,core:0,ceiling:.68,flow:0,collapse:0};
// The corpse's RGB source uses a neutral sprite matte. Alpha-test at import,
// before resampling; colored cartilage and dark flesh remain opaque. Genuine
// alpha sources pass through unchanged. This never touches the living artwork.
function heartSpriteAlpha(data){
 let transparent=false;for(let i=3;i<data.length;i+=4)if(data[i]<255){transparent=true;break;}
 if(transparent)return;
 for(let i=0;i<data.length;i+=4){
  const lo=Math.min(data[i],data[i+1],data[i+2]),hi=Math.max(data[i],data[i+1],data[i+2]);
  if(hi-lo<22&&lo>160)data[i+3]=Math.round(255*(1-clamp((lo-160)/32,0,1)));
 }
}
function prepareCorruption(atlasSrc,heartSrc,deadSrc){
 const atlas=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  for(let i=0;i<4;i++){const c=document.createElement('canvas');c.width=c.height=256;
   const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(img,(i%2)*img.width/2,(i>>1)*img.height/2,img.width/2,img.height/2,0,0,256,256);
   materialCanvases[4+i]=c;materialPixels[4+i]=g.getImageData(0,0,256,256).data;
  }resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Corruption atlas unavailable'));img.src=atlasSrc;});
 const heart=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  const c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(img,0,0,256,256);
  horrorHeartCanvas=c;
  horrorHeartHitCanvas=document.createElement('canvas');horrorHeartHitCanvas.width=horrorHeartHitCanvas.height=256;
  const hit=horrorHeartHitCanvas.getContext('2d');hit.drawImage(c,0,0);hit.globalCompositeOperation='source-atop';hit.fillStyle='rgba(255,226,192,.58)';hit.fillRect(0,0,256,256);resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Heart artwork unavailable'));img.src=heartSrc;});
 const dead=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  const src=document.createElement('canvas');src.width=img.width;src.height=img.height;
  const g=src.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
  const pixels=g.getImageData(0,0,src.width,src.height);heartSpriteAlpha(pixels.data);g.putImageData(pixels,0,0);
  horrorHeartDeadCanvas=document.createElement('canvas');horrorHeartDeadCanvas.width=horrorHeartDeadCanvas.height=256;
  // Insets keep the severed vessel tips inside the world surface as it slumps.
  horrorHeartDeadCanvas.getContext('2d').drawImage(src,6,6,244,244);
  horrorHeartFadeCanvas=document.createElement('canvas');horrorHeartFadeCanvas.width=horrorHeartFadeCanvas.height=256;horrorHeartBlend=-1;resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Dead-heart artwork unavailable'));img.src=deadSrc;});
 return Promise.all([atlas,heart,dead]);
}
function heartDeathImage(collapse){
 if(!horrorHeartDeadCanvas||!horrorHeartFadeCanvas)return horrorHeartCanvas;
 const blend=clamp(collapse/.55,0,1);
 if(blend>=1)return horrorHeartDeadCanvas;
 const step=Math.round(blend*64);if(step===horrorHeartBlend)return horrorHeartFadeCanvas;
 const g=horrorHeartFadeCanvas.getContext('2d');g.clearRect(0,0,256,256);
 g.globalAlpha=1-step/64;g.drawImage(horrorHeartCanvas,0,0);
 g.globalAlpha=step/64;g.drawImage(horrorHeartDeadCanvas,0,0);g.globalAlpha=1;horrorHeartBlend=step;
 return horrorHeartFadeCanvas;
}
function horrorCoreProximity(x,y){
 // Ease into a vaulted chamber through either approach, and down on the way out.
 const dx=Math.max(16-x,0,x-49),dy=Math.max(6-y,0,y-18);
 const t=clamp(1-Math.hypot(dx,dy)/5,0,1);return t*t*(3-2*t);
}
function horrorFrame(){
 const active=useChapter&&(stage===1||stage===2)&&liminal.mix<.01;
 const core=active&&stage===2?horrorCoreProximity(player.x,player.y):0;
 const dying=active&&stage===2&&HB.state==='dying',dead=active&&stage===2&&HB.state==='dead';
 const falling=dying?clamp((HB.deathT-.72)/4,0,1):dead?1:0,collapse=falling*falling*(3-2*falling);
 const energy=active&&stage===2?(HW.resolved?0:(.28+.72*clamp(HW.intensity,0,1))*(1-collapse)):0;
 const clock=settings.reduce?0:gameTime;
 // A double contraction, with a breathing interval; no random flashes.
 const beat=(clock*(stage===2?1.15:0.65))%1;
 const pulse=settings.reduce||energy===0||dying||dead?0:stage===2&&hbFighting()?hbPulse():Math.exp(-(((beat-.10)/.085)**2))+.55*Math.exp(-(((beat-.32)/.11)**2));
 const ceiling=active&&stage===2?mix(.88,3.0,core):LIM_CEIL;
 return {active,clock,pulse,energy,core,ceiling,collapse,flow:settings.reduce?0:dying||dead?HB.flowAtDeath+26*(1-Math.exp(-HB.deathT/1.3)):clock*(stage===2?energy*21:3)};
}
function horrorSetup(){
 horrorZone.fill(0);horrorMix.fill(0);
 if(!useChapter||(stage!==1&&stage!==2))return;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  let zone=1,amount=.42;
  if(stage===1){
   // Recovery stays a recognizable warm pause between the infected rooms.
   amount=y>=52?.28:x>=10&&x<=24&&y>=34&&y<=46?.20:.46;
   if(x>=10&&x<=24&&y>=18&&y<=30)amount=.85;
   if(x>=30&&x<=46&&y>=18&&y<=30){zone=2;amount=.58;}
   if(x>=30&&x<=46&&y>=34&&y<=46){zone=2;amount=.80;}
   if(x>=48&&y<48)amount=.65;
  }else{
   zone=2;amount=y>=48?.76:.94;
   if(x>=16&&x<=48&&y>=6&&y<=17){zone=3;amount=1;}
   // The cold aftermath keeps its earlier contrast, beyond the organic throat.
   if(y<=3){zone=0;amount=0;}
  }
  horrorZone[y*MW+x]=zone;horrorMix[y*MW+x]=amount;
 }
 const add=(kind,x,y,a=0,extra={})=>environmentProps.push({kind:'horror_'+kind,x,y,a,...extra});
 const rib=(x,y,a,span,height,seed)=>add('rib',x,y,a,{span,height,seed});
 const artery=(x,y,a,length,height,seed)=>add('artery',x,y,a,{length,height,seed});
 const seal=(x,y,a,size,seed)=>add('seal',x,y,a,{size,seed});
 if(stage===1){
  for(let i=0;i<FV_HALL.length;i++){
   const h=FV_HALL[i],span=h.x2-h.x1+.8;
   // Wall-rooted bone fingers meet the existing low ceiling, never the route.
   rib(fvCX(h),h.y1+3.5,0,span,1.16,i);
   if(i>0)rib(fvCX(h),h.y2-1.5,0,span,1.16,i+4);
   artery(h.x1+.16,fvCY(h),Math.PI/2,7+i*2,1.07,i);
   artery(h.x2+.84,fvCY(h),Math.PI/2,7+i*2,1.03,i+3);
   // A raised, inverted bone crown is attached to the back wall, away from panels.
   seal(h.x1+3.5,h.y2+.96,0,.74,i);
   if(i===2)seal(h.x2-2,h.y1+.04,Math.PI,.92,8);
  }
  for(const y of [20,31,44])artery(28.85,y,Math.PI/2,5,1.08,y);
  for(const y of [20,31,42]){rib(50.5,y,0,4.8,1.17,y);seal(52.96,y+1,-Math.PI/2,.68,y);}
 }else{
  // The old hospital composition remains, physically consumed by the new material.
  for(const p of environmentProps){const k=(p.y|0)*MW+(p.x|0),z=horrorZone[k];
   if(z&&['bed','shrouded','monitor','curtain','pipe'].includes(p.kind))p.horrorSkin=z===3?6:5;
  }
  for(const y of [49,55]){rib(26.5,y,0,20.8,1.38,y);artery(36.86,y,Math.PI/2,5,1.24,y);}
  for(const y of [14,23,32,41,50]){
   rib(11.5,y,0,2.92,1.36,y);artery(12.89,y+2,Math.PI/2,5,1.23,y);
  }
  for(const r of HW_ROOMS){
   const y=(r.y1+r.y2+1)/2;
   rib(6.5,y,0,4.9,1.35,y);seal(4.04,y,Math.PI/2,1.05,y);
  }
  // The solid 9 × 4 core is still the same collision mass. Flesh wraps its faces.
  add('heart',32.5,14.025,0,{size:3.28});
  add('heart',32.5,9.975,Math.PI,{size:3.28});
  add('heart',27.975,12,Math.PI/2,{size:3.28});
  add('heart',37.025,12,-Math.PI/2,{size:3.28});
  for(const y of [10.65,13.35]){
   rib(22,y,0,11.8,3.42,y);rib(43,y,0,11.8,3.42,y+1);
  }
  for(const x of [29.2,32.5,35.8]){
   rib(x,8,Math.PI/2,3.9,3.42,x);rib(x,16,Math.PI/2,3.9,3.42,x+2);
  }
  for(const x of [19,24,41,46]){
   artery(x,12,Math.PI/2,11.6,3.20,x);
   seal(x,6.035,Math.PI,2.25,x);seal(x,17.965,0,2.25,x+3);
  }
  for(const y of [8,16])artery(32.5,y,0,31,3.29,y);
  for(const y of [17,28,39]){rib(50.5,y,0,3.9,1.39,y);artery(52.85,y,Math.PI/2,7,1.25,y);}
  // Bloodfalls hug the organ's solid faces, with depth-tested world-space droplets.
  for(const x of [29,31,34,36]){add('bloodfall',x,14.08,0,{seed:x});add('bloodfall',x,9.92,0,{seed:x+7});}
  add('bloodfall',27.91,11.4,0,{seed:20});add('bloodfall',37.09,12.6,0,{seed:29});
 }
 heartBossFaces=environmentProps.filter(p=>p.kind==='horror_heart');
 horrorBakeLight();
}
function horrorBakeLight(){
 // Cap hot surfaces once per light bake, not six extra operations per screen pixel.
 if(!useChapter||(stage!==1&&stage!==2))return;
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const amount=horrorMix[(y>>1)*MW+(x>>1)],i=(y*128+x)*3;
  for(let c=0;c<3;c++)horrorLightActive[i+c]=mix(lightActive[i+c],Math.min(1.45,lightActive[i+c]),amount);
 }
}
function horrorLights(){
 if(!useChapter||(stage!==1&&stage!==2))return;
 const L=(x,y,rgb)=>wardLights.push({x,y,rgb});
 if(stage===1){
  for(const [i,h] of FV_HALL.entries()){
   const off=FV.valves.some(v=>v.id===h.id&&v.closed),k=off?.20:1;
   const rgb=i===0?[.13,.32,.03]:i===1?[.40,.03,.30]:[.49,.02,.15];
   for(const x of [h.x1+.5,h.x2+.5])L(x,h.y2-1,rgb.map(v=>v*k));
  }
  L(51,29,[.33,.015,.24]);
 }else{
  for(const y of [17,32,47])L(12.4,y,[.50,.04,.28]);
  for(const r of HW_ROOMS)L(4.5,r.door,[.47,.025,.20]);
  const k=HW.resolved?.12:1;
  for(const x of [18,25,40,47])for(const y of [7,17])L(x,y,[.57*k,.035*k,.21*k]);
  // Cooler edge light separates creatures and exits from red tissue.
  L(16.5,11.5,[.08,.37,.45]);L(48.5,11.5,[.10,.26,.40]);L(32.5,6.4,[.13,.44,.39]);
 }
}
function horrorTube(p,points,radius,color,tex=6,vein=false){
 // Four-sided tapered tubes: low-poly volume, not camera-facing decoration.
 const sections=points.map((v,i)=>{const before=points[Math.max(0,i-1)],after=points[Math.min(points.length-1,i+1)];
  const dx=after[0]-before[0],dz=after[2]-before[2],n=Math.hypot(dx,dz)||1;
  const r=radius*(v[3]===undefined?1:v[3]);
  return [[v[0]-dz/n*r,v[1],v[2]+dx/n*r],[v[0],v[1]+r,v[2]],[v[0]+dz/n*r,v[1],v[2]-dx/n*r],[v[0],v[1]-r,v[2]]];
 });
 for(let j=0;j<sections.length-1;j++)for(let s=0;s<4;s++){
  meshQuad(p,[sections[j][s],sections[j+1][s],sections[j+1][(s+1)%4],sections[j][(s+1)%4]],color,tex,vein);
 }
}
function renderHorrorProp(p){
 if(!horrorView.active)return;
 if(p.kind==='horror_heart'){
  const normalX=-Math.sin(p.a),normalY=Math.cos(p.a);
  if((player.x-p.x)*normalX+(player.y-p.y)*normalY<=0)return;
  if(!horrorHeartCanvas)return;
  const lastBeat=!settings.reduce&&HB.state==='dying'&&HB.deathT<.72?Math.sin(HB.deathT/.72*Math.PI)*.045:0;
  const h=p.size*(1+horrorView.pulse*.045*horrorView.energy-lastBeat)*(1-horrorView.collapse*.42),w=p.size*.98*(1+horrorView.pulse*.045*horrorView.energy+lastBeat)*(1+horrorView.collapse*.10);
  meshQuad(p,[[-w/2,0,.04],[w/2,0,.04],[w/2,0,h+.04],[-w/2,0,h+.04]],'transparent',-1,true);
  const f=meshFaces[meshFaces.length-1];f.image=horrorView.collapse>0?heartDeathImage(horrorView.collapse):
   !settings.reduce&&HB.hitT>0&&horrorHeartHitCanvas?horrorHeartHitCanvas:horrorHeartCanvas;f.wallAttached=true;
  return;
 }
 if(p.kind==='horror_bloodfall'){renderHorrorBloodfall(p);return;}
 if(p.horrorFaces){meshFaces=p.horrorFaces;return;}
 const col=stage===1?'#9b9a64':'#b09989',neon=stage===1&&p.seed%3===0?'#b8ef29':'#ff247c';
 if(p.kind==='horror_rib'){
  const w=p.span/2,h=p.height;
  // The roots stay at existing walls. All overhanging volume is above the eye.
  const points=[[-w,0,.12,.65],[-w+.12,0,h*.68,1],[-w*.82,0,h*.91,.85],[-w*.42,0,h,.55],[0,0,h*.97,.17],
   [w*.42,0,h,.55],[w*.82,0,h*.91,.85],[w-.12,0,h*.68,1],[w,0,.12,.65]];
  horrorTube(p,points,stage===1?.095:.13,col,5);
  horrorTube(p,points.map(v=>[v[0],-.10,v[2]-.025,v[3]]),.023,neon,-1,true);
  for(const sign of [-1,1])horrorTube(p,[[sign*w*.80,0,h*.93,1],[sign*w*.73,-.10,h*.73,.62],[sign*w*.61,-.16,h*.68,0]],.11,'#321322',5);
 }else if(p.kind==='horror_artery'){
  const n=Math.ceil(p.length/2),points=[];
  for(let i=0;i<=n;i++){const x=-p.length/2+i*p.length/n;points.push([x,Math.sin(i*1.8+p.seed)*.07,p.height+Math.sin(i*.9+p.seed)*.055,1]);}
  horrorTube(p,points,stage===1?.075:.14,'#760b32',6);
  horrorTube(p,points.map(v=>[v[0],v[1]-.09,v[2]-.07,1]),.025,neon,-1,true);
 }else if(p.kind==='horror_seal'){
  const s=p.size,core=horrorZone[(p.y|0)*MW+(p.x|0)]===3,h=stage===1?1.12:core?Math.min(3.45,s+1.0):1.32,z=h-s*.46;
  // An inverted crown of horns, flesh struts and a glowing arterial fissure.
  const pts=[[-s*.47,0,z+s*.39],[-s*.27,-.06,z+s*.11],[0,-.12,z-s*.42],[s*.27,-.06,z+s*.11],[s*.47,0,z+s*.39]];
  horrorTube(p,pts,.052*s,col,5);
  horrorTube(p,[[-s*.41,0,z+s*.02],[s*.41,0,z+s*.02]],.04*s,'#95162f',6);
  horrorTube(p,[[0,-.04,z-s*.30],[0,-.07,z+s*.22]],.024*s,neon,-1,true);
  for(const sign of [-1,1])horrorTube(p,[[sign*s*.30,0,z+s*.1,1],[sign*s*.38,0,z+s*.38,.7],[sign*s*.28,0,z+s*.52,0]],.11*s,'#271320',5);
 }
 // Immutable local dressing is tessellated once, never every animation frame.
 for(const f of meshFaces)f.horror=true;
 p.horrorFaces=meshFaces;
}
function horrorClipCeiling(verts){
 const top=-horrorView.ceiling;
 if(verts.every(v=>v.cy>=top))return verts;
 const out=[];
 for(let i=0;i<verts.length;i++){
  const a=verts[i],b=verts[(i+1)%verts.length],ina=a.cy>=top,inb=b.cy>=top;
  if(ina)out.push(a);
  if(ina!==inb){const t=(top-a.cy)/(b.cy-a.cy);out.push({cx:mix(a.cx,b.cx,t),cy:top,d:mix(a.d,b.d,t),u:mix(a.u,b.u,t),v:mix(a.v,b.v,t)});}
 }
 return out;
}
function renderHorrorBloodfall(p){
 const v=horrorView;if(settings.reduce||v.energy===0)return;
 const count=6+Math.round(v.energy*8),clock=v.clock;
 for(let i=0;i<count;i++){
  const t=(clock*(.38+v.energy*.25)+i/count+p.seed*.119)%1;
  const x=p.x+Math.sin(i*2.4+p.seed)*.12,y=p.y+Math.cos(i*1.7)*.035,z=3.05*(1-t*t);
  if(z>v.ceiling+.52)continue;
  const q=project(x,y,z),tail=project(x,y,Math.min(v.ceiling+.52,z+.045+v.energy*.13));
  if(!q||!tail||q.x<0||q.x>=W||zBuffer[q.x|0]<q.d-.06)continue;
  wc.strokeStyle=i%4?'#e21a53':'#ff8aac';wc.globalAlpha=.45+v.energy*.35;
  wc.lineWidth=clamp(q.scale*.018,1,3);wc.beginPath();wc.moveTo(tail.x,tail.y);wc.lineTo(q.x,q.y);wc.stroke();
 }wc.globalAlpha=1;
}

// SOURCE: release-settings.js
/* ============================================ RELEASE READINESS  (P08) === */
/* One place that says what the three difficulties actually do, so the control
   can describe itself instead of the player having to guess. */
const DIFFICULTIES=[
  {id:0,name:'FORGIVING',note:'Creatures are slower and hit for 35% less.'},
  {id:1,name:'STANDARD', note:'The approved balance.'},
  {id:2,name:'UNKIND',   note:'Creatures are faster and hit for 30% more.'}
];
function applyDifficulty(){
  difficulty=clamp(Math.round(settings.difficulty),0,2)|0;
  settings.difficulty=difficulty;
  $('difficulty').value=String(difficulty);
  for(const b of document.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',Number(b.dataset.mode)===difficulty?'true':'false');
  const el=$('difficultyNote');
  if(el)el.textContent=DIFFICULTIES[difficulty].note;
}

// SOURCE: exterior.js
// Scene 4 / Phase 1. An explicit, calm exterior chapter; later encounters are not enabled.
const S4_ORIGIN=32,S4_WIDTH=144,S4_HEIGHT=96,S4_TW=S4_WIDTH*2,S4_TH=S4_HEIGHT*2;
const S4={on:false,zone:'',visited:new Set(),faces:[],solids:[],labels:[],lamps:[],flora:[],shore:[],forest:null,terrain:new Uint8Array(S4_TW*S4_TH),depth:null,entry:null};
const S4_ENTRIES={
 court:{label:'Courtyard — first breath',x:64,y:47,a:-Math.PI/2,hint:'Look slightly right for the city beyond the forest. The left path passes through a narrow hedge entrance; the right path winds to parking. Turn around to see the hospital. Walk to the three-way sign, then choose any route.'},
 hospital:{label:'Hospital — look back',x:64,y:42,a:Math.PI/2,hint:'Look back at the doors and the hospital wings. Walk toward the entrance, along the facade and under the canopy. Check its scale and silhouette against the sky.'},
 parking:{label:'Parking lot — rows of silence',x:88,y:76.8,a:-2.1,hint:'Parking sits behind the hospital’s left wing, as seen when facing the hospital. Walk around the building to return to the court; compare that journey with the longer bus route. Look out across the open outer verge. Explore the cars and find the screened entrance back to the court. Neither the garden nor the bus stop should be visible. For the expedition and enemies, choose Parking — the spare keys.'},
 road:{label:'Forest road — halfway out',x:100,y:21,a:0,hint:'Follow the asphalt and pale edge lines through the trees. The bus stop is still ahead, beside the city road. Turn back and follow HOSPITAL signs to return.'},
 bus:{label:'Bus station — last service',x:135,y:15.4,a:-Math.PI/2,hint:'The shelter sits beside the city road, beyond the wooded bends. Step under its roof, read the timetable, then follow the road back. Parking and the garden are hidden by forest. There is no extinguisher objective yet.'},
 gardens:{label:'Garden gates — the clearing',x:42,y:32,a:-1.47,hint:'Cross the grass. The royal gates are ahead, slightly right; the pond is behind your left shoulder and runs back toward the hospital. No boss is present in this phase.'},
 pond:{label:'Pond — the western horizon',x:25.25,y:29,a:Math.PI,hint:'Look west over the open water toward the distant wilderness. Walk along the near bank and look back toward the hospital. Check that the water feels expansive, with a distant shoreline instead of a nearby forest wall. Water still blocks movement.'}
};
// The approved hospital bay joins a much larger western body of water.
const S4_POND={x:32,y:49,rx:23,ry:14};
const S4_LAKE={x:-145,y:49,rx:172,ry:118};
// Only this 2.4-unit mouth connects the garden route to the court.
const S4_GARDEN_MOUTH={x:59,y:43,width:2.4};
const S4_GARDEN_PATH=[[64,43],[59,43],[56.5,43],[56.5,39],[55.8,36],[54.4,30],[49,26],[44,28],[42,32]];
const S4_POND_PATH=[[42,32],[34,31],[30,30],[25.25,29]];
// A short continuation makes the released gate an actual way out. It bends
// into the woods; the chapter ends on crossing, before the next journey.
const S4_EXIT_PATH=[[43,21],[43,13],[40,9],[39,6]];
const S4_PARK_PATH=[[64,41],[72,41],[77,43],[79,48],[79,57],[80,61],[84,63]];
// Translation preserves every bend, road width and marking of the approved forward road.
const S4_ROAD=[[32,41],[32,32],[32,26],[32,19],[38,13],[46,13],[50,8],[57,8],[63,14],[68,21],[75,21],[81,14],[87,13],[92,18],[98,18],[103,12],[109,12]].map(([x,y])=>[x+S4_ORIGIN,y]);
const S4_BUS={x:135,y:6.5};
function s4Running(){return useChapter&&stage===3&&S4.on;}
function s4InWaterOval(x,y,p){return ((x-p.x)/p.rx)**2+((y-p.y)/p.ry)**2<1;}
function s4Pond(x,y){return s4InWaterOval(x,y,S4_POND)||s4InWaterOval(x,y,S4_LAKE);}
function s4NearestShore(x,y){
 let nearest={x:S4_POND.x,y:S4_POND.y-S4_POND.ry},distance=Infinity;
 for(const p of S4.shore){const d=(p.x-x)**2+(p.y-y)**2;if(d<distance){distance=d;nearest=p;}}
 return nearest;
}
function s4PathDistance(x,y,points){let d=Infinity;for(let i=1;i<points.length;i++){const [ax,ay]=points[i-1],[bx,by]=points[i],dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);d=Math.min(d,Math.hypot(x-ax-dx*t,y-ay-dy*t));}return d;}
function s4GroundType(x,y){
 if(s4Pond(x,y))return 3;
 if(s4PathDistance(x,y,S4_EXIT_PATH)<1.15)return 1;
 if(x>131&&x<139.5&&y>4&&y<10.6)return 1;
 if(x>81.5&&x<100.6&&y>62&&y<82.8)return 0;
 if(s4PathDistance(x,y,S4Q_WALK)<1.1)return 1;
 const road=s4PathDistance(x,y,S4_ROAD);
 if(y<38&&road<3)return 0;
 if(y<38&&road<3.85)return 1;
 if(s4PathDistance(x,y,S4_GARDEN_PATH)<1.05||s4PathDistance(x,y,S4_POND_PATH)<1.1||s4PathDistance(x,y,S4_PARK_PATH)<1.4||(x>61.6&&x<66.4&&y>36&&y<51)||(x>59&&x<69&&y>44&&y<51))return 1;
 return 2;
}
function s4Outside(x,y){return x<=4||x>=S4_WIDTH-2||y<=2||y>=S4_HEIGHT-4;}
function s4Solid(x,y){return s4Outside(x,y)||s4Pond(x,y)||S4.solids.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);}
function s4ShotBlocked(x,y){return (s4Outside(x,y)&&!s4Pond(x,y))||S4.solids.some(b=>x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1);}
function s4CreateMap(){
 S4.on=true;S4.light=null;S4.faces=[];S4.solids=[];S4.labels=[];S4.lamps=[];S4.flora=[];S4.shore=[];
 s4BuildGeometry();s4BuildGrounds();s4qBuildProps();s4BuildSigns();cbfBuildGate();
 map=Array.from({length:MH},(_,y)=>Array.from({length:MW},(_,x)=>s4Solid(x+.5,y+.5)?1:0));
 for(let y=0;y<S4_TH;y++)for(let x=0;x<S4_TW;x++)S4.terrain[y*S4_TW+x]=s4GroundType((x+.5)/2,(y+.5)/2);
 hidden.fill(0);
}
function s4SetupEnvironment(){environmentProps=[];furniture=[];furnGrid=null;wardLights=[];lightField.fill(.55);bakeLightActive();}
function s4Begin(){
 S4.on=true;S4.zone='';S4.visited=new Set();S4.entry=null;exit={x:43,y:19.5};cleared=false;
 player.x=64;player.y=47;player.a=-Math.PI/2;player.vx=player.vy=0;_safeX=player.x;_safeY=player.y;
 audio.theatre(false);audio.heart(0);audio.exteriorMix();
}
function s4JumpTo(at){const p=S4_ENTRIES[at];if(p){reviewPlace(p.x,p.y,p.a);S4.zone='';s4Tick(0);}}
function s4EnterFromHeart(){
 if(mode!=='won'||!hwRunning()||!HW.ending)return false;
 return s4dBeginWalk();
}
function s4Zone(){
 if(player.x>130&&player.y<17)return 'BUS STATION';
 if(player.x>76&&player.y>60)return 'PARKING LOT';
 if(player.x<30)return 'WESTERN SHORE';
 if(player.x<51&&player.y<35)return 'GARDEN GATES';
 if(player.x<51)return 'POND WALK';
 if(player.x<60&&player.y<48)return 'GARDEN APPROACH';
 if(player.x>72&&player.y>37)return 'PARKING APPROACH';
 if(player.y>48)return 'HOSPITAL ENTRANCE';
 if(player.y<38)return 'FOREST ROAD';
 return 'ENTRANCE COURT';
}
function s4Tick(){if(!s4Running()||mode!=='playing')return;const zone=s4Zone();if(zone!==S4.zone){S4.zone=zone;if(!S4.visited.has(zone)){S4.visited.add(zone);feed(zone);}}}
function s4NearbyLabel(){let best=null,near=4.6;for(const l of S4.labels){if(!l.interact||(l.front&&(player.x-l.x)*l.front[0]+(player.y-l.y)*l.front[1]<0))continue;const d=Math.hypot(player.x-l.x,player.y-l.y),a=Math.abs(angle(Math.atan2(l.y-player.y,l.x-player.x)-player.a));if(d<near&&a<.85&&(d<.3||s4CastRay(player.x,player.y,(l.x-player.x)/d,(l.y-player.y)/d,d-.2).d>=d-.21)){best=l;near=d;}}return best;}
function s4Hud(){
 $('wardName').innerHTML='04 <b>NO WAY OUT</b>';
 const sign=s4NearbyLabel();$('goal').textContent=sign?'[E] '+sign.interact:'EXPLORE THE GROUNDS · '+(S4.zone||'ENTRANCE COURT');
 $('lifeHint').textContent='TAKE A BREATH';$('compassText').textContent='HOSPITAL';
 $('compassArrow').style.transform='rotate('+angle(Math.atan2(50-player.y,64-player.x)-player.a)+'rad)';
 $('touchUse').classList.toggle('hidden',!sign);$('touchUse').textContent='READ';
 if(review.active){$('reviewBarText').textContent='NO WAY OUT · CALM EXTERIOR REVIEW';$('reviewStatus').textContent='T CONTROLS · B RESET · M MAP · TAB PEEK · CALM ENTRY · NO ENCOUNTERS';}
}
function s4Interact(){if(!s4Running()||mode!=='playing')return false;if(s4tInteract()||s4dInteract())return true;const l=s4NearbyLabel();if(!l)return false;feed(review.active?l.read:l.read.replace('T opens the review guide.','ESC → TEST WARD opens the review guide.'));return true;}
function s4CastRay(x,y,dx,dy,max){
 let closest=max,side=0;
 // Water blocks walking, not the horizontal gun ray. Physical structures alone occlude shots.
 const boxes=S4.solids.concat([{x0:-1e3,x1:4,y0:-1e3,y1:1e3},{x0:S4_WIDTH-2,x1:1e3,y0:-1e3,y1:1e3},{x0:4,x1:S4_WIDTH-2,y0:-1e3,y1:2},{x0:4,x1:S4_WIDTH-2,y0:S4_HEIGHT-4,y1:1e3}].map(b=>({...b,estateEdge:true})));
 for(const b of boxes){let lo=0,hi=closest,s=0;for(const [p,v,mn,mx,k]of [[x,dx,b.x0,b.x1,0],[y,dy,b.y0,b.y1,1]]){if(Math.abs(v)<1e-8){if(p<mn||p>mx){hi=-1;break;}continue;}let a=(mn-p)/v,c=(mx-p)/v;if(a>c)[a,c]=[c,a];if(a>lo){lo=a;s=k;}hi=Math.min(hi,c);}if(lo<=hi&&lo>0&&lo<closest){if(b.estateEdge&&s4Pond(x+dx*(lo+.001),y+dy*(lo+.001)))continue;closest=lo;side=s;}}
 const wx=x+dx*closest,wy=y+dy*closest,u=side?wx:wy;return{d:closest,u:u-Math.floor(u),side,mx:wx|0,my:wy|0,type:1};
}
// Native world geometry. Texture indices are private to this chapter.
function s4Quad(points,tex=-1,color=[55,66,70],u=1,v=1,emissive=false){const face={points,tex,color,u,v,emissive};S4.faces.push(face);return face;}
function s4Box(x,y,z,w,d,h,tex=4,color=[62,74,77],solid=false,tile=1){
 const a=x-w/2,b=x+w/2,c=y-d/2,e=y+d/2,f=z+h;
 s4Quad([[a,c,z],[b,c,z],[b,c,f],[a,c,f]],tex,color,w/tile,h/tile);
 s4Quad([[b,e,z],[a,e,z],[a,e,f],[b,e,f]],tex,color,w/tile,h/tile);
 s4Quad([[a,e,z],[a,c,z],[a,c,f],[a,e,f]],tex,color,d/tile,h/tile);
 s4Quad([[b,c,z],[b,e,z],[b,e,f],[b,c,f]],tex,color,d/tile,h/tile);
 s4Quad([[a,c,f],[b,c,f],[b,e,f],[a,e,f]],tex,color,w/tile,d/tile);
 if(solid)S4.solids.push({x0:a,x1:b,y0:c,y1:e});
}
function s4Label(x,y,z,text,w=3,extra={}){S4.labels.push({x,y,z,text,w,...extra});}
function s4Lamp(x,y,color=[140,187,191]){
 s4Box(x,y,0,.12,.12,2.6,7,[33,51,56],true);s4Box(x,y,2.62,.46,.46,.08,7);s4Box(x,y,2.5,.3,.3,.12,-1,color);S4.lamps.push({x,y,z:2.56,color});
}
function s4Fence(ax,ay,bx,by,height=.8){
 const count=Math.ceil(Math.hypot(bx-ax,by-ay)/2.4);
 for(let i=0;i<=count;i++){const x=mix(ax,bx,i/count),y=mix(ay,by,i/count);s4Box(x,y,0,.09,.09,height+.12,7,[37,53,58]);}
 const w=Math.abs(bx-ax)||.065,d=Math.abs(by-ay)||.065;
 for(const z of[.25,height])s4Box((ax+bx)/2,(ay+by)/2,z,w,d,.055,7,[45,63,64]);
 S4.solids.push({x0:Math.min(ax,bx)-.045,x1:Math.max(ax,bx)+.045,y0:Math.min(ay,by)-.045,y1:Math.max(ay,by)+.045});
}
// Move complete authored landmarks without rescaling their approved architecture.
function s4Group(dx,dy,build){
 const starts=[S4.faces.length,S4.solids.length,S4.labels.length,S4.lamps.length];build();
 for(const f of S4.faces.slice(starts[0]))for(const p of f.points){p[0]+=dx;p[1]+=dy;}
 for(const b of S4.solids.slice(starts[1])){b.x0+=dx;b.x1+=dx;b.y0+=dy;b.y1+=dy;}
 for(const a of [S4.labels.slice(starts[2]),S4.lamps.slice(starts[3])])for(const p of a){p.x+=dx;p.y+=dy;}
}
function s4BuildGeometry(){
 s4Group(S4_ORIGIN,0,()=>{
 // Tall wings remain true geometry, visible over low fencing and shelter roofs.
 s4Box(32,55,0,18,8,7.8,5,[73,83,84],true,3.8);
 s4Box(24.5,53,0,4,10,9.2,5,[65,76,79],true,3.8);
 s4Box(41,54,0,5,12,6.7,5,[61,77,81],true,3.8);
 for(const [x,y,w,d,h]of [[32,55,18.4,8.3,7.8],[24.5,53,4.3,10.3,9.2],[41,54,5.3,12.3,6.7]])s4Box(x,y,h,w,d,.24,4,[44,54,56],false,2);
 s4Box(32,50.92,0,4,.2,2.8,4,[71,82,79],true,2);
 s4Quad([[30.6,50.79,.05],[33.4,50.79,.05],[33.4,50.79,2.1],[30.6,50.79,2.1]],-1,[206,221,196],1,1,true);
 for(const x of[30.55,32,33.45])s4Box(x,50.72,0,.065,.08,2.15,-1,[45,68,63]);
 s4Box(32,50.70,2.1,3,.08,.065,-1,[43,61,57]);
 s4Box(32,49.3,2.6,7,3.8,.25,4,[64,77,77],false,2);
 for(const x of[28.75,35.25])s4Box(x,47.65,0,.2,.2,2.6,4,[70,87,85],true);
 s4Quad([[29.4,47.35,2.62],[34.6,47.35,2.62],[34.6,47.35,2.88],[29.4,47.35,2.88]],-1,[14,34,34]);
 s4Label(32,47.28,2.76,'ASHFALL HOSPITAL',4.8,{color:'#d0ddd0',front:[0,-1],h:.24});
 S4.lamps.push({x:32,y:50,z:1.2,color:[205,232,207]});
 });
 s4Group(S4_ORIGIN,0,()=>{
 // One fixed board, three equally spaced lines. No screen-space floating labels.
 s4Box(35.4,38.9,0,.11,.11,2.1,7,[55,77,70],true);
 s4Label(35.4,38.9,1.55,'←  GARDEN GATES\n→  PARKING\n↑  BUS STATION',3.45,{h:1.05,front:[0,1],interact:'READ THE WAYFINDER',read:'← GARDEN GATES   → PARKING LOT\n↑ BUS STATION'});
 for(const [x,y]of [[30,45],[35.6,34],[29.2,24]])s4Lamp(x,y,[155,180,146]);
 });
 s4Group(42,36,()=>{
 // Parking wraps behind the hospital left wing (when facing its entrance).
 const cars=[[43,30,0],[47,30,1],[51,30,2],[55,30,0],[43,35,2],[51,35,1],[55,35,0],[45,44,1],[50,44,0],[55,44,2]];
 const colors=[[48,60,65],[95,57,48],[62,83,73]];
 for(const [x,y,k]of cars){
  if(x!==55||y!==44){s4qParkingCar(x,y,k);continue;}
  const col=colors[k];s4Box(x,y,.14,1.65,2.85,.46,-1,col,true);s4Box(x,y+.12,.6,1.44,1.36,.38,-1,col);
  s4Quad([[x-.63,y-.571,.68],[x+.63,y-.571,.68],[x+.63,y-.571,.94],[x-.63,y-.571,.94]],-1,[16,43,50]);
  s4Quad([[x+.63,y+.811,.66],[x-.63,y+.811,.66],[x-.63,y+.811,.94],[x+.63,y+.811,.94]],-1,[11,34,41]);
  for(const xx of[-.77,.77])for(const yy of[-.88,.88])s4Box(x+xx,y+yy,.05,.19,.38,.3,-1,[13,17,22]);
  for(const xx of[-.52,.52]){s4Box(x+xx,y-1.43,.4,.26,.028,.11,-1,[100,112,110]);s4Box(x+xx,y+1.43,.38,.25,.03,.12,-1,[106,27,33]);}
 }
 for(const x of[41,45,49,53,57])for(const y of[30,35,44])s4Quad([[x-.035,y-1.6,.008],[x+.035,y-1.6,.008],[x+.035,y+1.6,.008],[x-.035,y+1.6,.008]],-1,[108,112,97]);
 s4Lamp(40,28,[108,160,190]);s4Lamp(57,38,[112,162,193]);
 s4Box(43.4,39.7,.0,.11,.11,1.8,7,[40,62,64],true);s4Label(43.4,39.7,1.68,'P  /  PARKING',2,{front:[0,1],h:.4,interact:'READ THE PARKING SIGN',read:'VISITOR PARKING\nThe cars are still here.'});
 });
 // Roadside shelter: the same roof, bench and materials now sit beyond the forest road.
 s4BuildBusShelter(S4_BUS.x,S4_BUS.y);
 s4Group(24,0,()=>{
 // Garden arena is only a quiet composition review now. Pond follows its left edge.
 s4Box(15.3,19.5,0,.65,.8,3.1,4,[80,79,63],true);
 s4Box(22.7,19.5,0,.65,.8,3.1,4,[80,79,63],true);
 s4Box(19,19.5,2.9,8.4,.55,.42,4,[66,69,61]);
 s4Quad([[15.65,19.54,0],[22.35,19.54,0],[22.35,19.54,2.9],[15.65,19.54,2.9]],6,[29,46,38]).cerberusGate=true;
 s4Quad([[22.35,19.46,0],[15.65,19.46,0],[15.65,19.46,2.9],[22.35,19.46,2.9]],6,[29,46,38]).cerberusGate=true;
 S4.solids.push({x0:15.4,x1:22.6,y0:19.42,y1:19.58,kind:'cerberusGate'});
 s4Fence(4.1,19.5,15.3,19.5,1.25);s4Fence(22.7,19.5,26,19.5,1.25);s4Fence(26,6,26,19.5,1.25);
 s4Label(19,19.8,3.17,'H    ’s Garden Gates',7.4,{color:'#c1b58a',front:[0,1],h:.34});
 s4Label(19,19.7,1.4,'',4,{interact:'EXAMINE THE GATES',read:'OLD IRON. FRESH HEAT.\nTHE GUARDIAN HAS NOT LET ANYONE THROUGH.'});
 for(const [x,y]of [[15,21],[23,21]]){s4Box(x,y,0,.28,.28,1.4,4,[80,73,54],true);S4.lamps.push({x,y,z:1.45,color:[192,109,101]});}
 });
 // Forest forms the outer boundary; retain the hospital-side low fence.
 s4Fence(55,60,75.5,60,1);
 // Open outer verge, with a low estate rail and distant woodland instead of a hedge box.
 s4Fence(77,86,122,86,.8);s4Fence(122,61,122,86,.8);
 s4BuildWaterfront();
}
for(const [key,p]of Object.entries(S4_ENTRIES))reviewScenes['s4_'+key]={label:p.label,level:3,chapter:true,at:key,hint:p.hint+' Calm environment review: no ambulance, quests or boss yet.'};
$('leaveHospitalBtn').onclick=s4EnterFromHeart;

// SOURCE: exterior-signs.js
// Lettering is typeset once into a physical sign face, then projected with the world.
// Texture and board share the same dimensions: distance and viewing angle cannot separate them.
const S4_SIGN_CACHE=new Map();
function s4SignTexture(label){
 const rows=label.text.split('\n'),h=label.h||.4,w=label.w;
 const key=[label.text,w,h,label.color||''].join('|');
 if(S4_SIGN_CACHE.has(key))return S4_SIGN_CACHE.get(key);
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=Math.max(48,Math.round(768*h/w));
 const g=canvas.getContext('2d',{willReadFrequently:true}),cw=canvas.width,ch=canvas.height,pad=22,line=ch/rows.length;
 g.fillStyle='#1d3736';g.fillRect(0,0,cw,ch);
 g.strokeStyle='#748780';g.lineWidth=2;g.strokeRect(6,6,cw-12,ch-12);
 g.fillStyle='#afb6a0';for(const x of [13,cw-13])for(const y of [13,ch-13]){g.beginPath();g.arc(x,y,2,0,TAU);g.fill();}
 let font=Math.floor(Math.min(line*.58,60));
 for(;;){g.font='600 '+font+'px sans-serif';if(font<=8||rows.every(row=>g.measureText(row).width<=cw-pad*2))break;font--;}
 g.textAlign=rows.length>1?'left':'center';g.textBaseline='middle';g.fillStyle=label.color||'#d7dec7';
 const metrics=[];
 rows.forEach((row,i)=>{const y=(i+.5)*line;g.fillText(row,rows.length>1?pad:cw/2,y);metrics.push({text:row,width:g.measureText(row).width,y,font});});
 const texture={data:g.getImageData(0,0,cw,ch).data,w:cw,h:ch,metrics,pad};S4_SIGN_CACHE.set(key,texture);return texture;
}
function s4BuildSigns(){
 for(const l of S4.labels){
  if(!l.text)continue;
  const front=l.front||[0,1],len=Math.hypot(...front),nx=front[0]/len,ny=front[1]/len,rx=ny,ry=-nx,h=l.h||.4;
  const corner=(side,z,offset)=>[l.x+rx*side+nx*offset,l.y+ry*side+ny*offset,z];
  const points=[corner(-l.w/2,l.z-h/2,.066),corner(l.w/2,l.z-h/2,.066),corner(l.w/2,l.z+h/2,.066),corner(-l.w/2,l.z+h/2,.066)];
  const face=s4Quad(points,-1,[29,55,54]);face.surface=s4SignTexture(l);face.sign=true;face.out=[nx,ny];face.cx=l.x;face.cy=l.y;face.radius=l.w/2+.07;
  // Dark back and thin top/side edges keep an oblique board physically legible.
  const back=points.map(p=>[p[0]-nx*.095,p[1]-ny*.095,p[2]]);
  const f=s4Quad(back,-1,[25,38,37]);f.out=[-nx,-ny];f.cx=l.x;f.cy=l.y;f.radius=face.radius;
  for(const [a,b]of [[0,3],[3,2],[2,1],[1,0]])s4Quad([points[a],points[b],back[b],back[a]],-1,[73,86,77]);
  l.face=face;
 }
}
// Retained hook for the shared renderer. World text is already in the pixel depth pass.
function s4DrawLabels(){}

// SOURCE: exterior-grounds.js
// R4-P01-R04: authored clearings within continuous, impassable woodland.
// A shared occupancy mask drives both collision and the visible forest edge.
function s4Clearing(x,y){
 if(s4PathDistance(x,y,S4_EXIT_PATH)<1.85)return true;
 if(s4PathDistance(x,y,S4Q_WALK)<1.65)return true;
 if(s4Pond(x,y)||((x-S4_LAKE.x)/(S4_LAKE.rx+1.7))**2+((y-S4_LAKE.y)/(S4_LAKE.ry+1.7))**2<1)return true;
 // A small open bank lets the western view and hospital bay read together.
 if(x>24&&x<40&&y>27&&y<36)return true;
 // No shore clearance beside the entrance: the garden route is the only access.
 if(((x-S4_POND.x)/(S4_POND.rx+1.6))**2+((y-49)/15.6)**2<1&&x<53)return true;
 if(x>60.4&&x<78&&y>45&&y<61)return true;
 if(x>75.5&&x<81&&y>46&&y<64)return true;
 if(x>60.4&&x<68.6&&y>38&&y<51)return true;
 if(x>30&&x<50&&y>19&&y<34.5)return true;
 if(x>38&&x<48&&y>17&&y<22)return true;
 if(x>76.5&&x<132&&y>61&&y<90)return true;
 if(x>68&&x<101&&y>59&&y<63)return true;
 if(x>68&&x<81&&y>59&&y<74)return true;
 if(s4PathDistance(x,y,S4_PARK_PATH)<1.85)return true;
 if(s4PathDistance(x,y,S4_GARDEN_PATH)<1.45)return true;
 if(s4PathDistance(x,y,S4_POND_PATH)<1.65)return true;
 if(s4PathDistance(x,y,S4_ROAD)<4.4)return true;
 return x>130.5&&x<140&&y>3.5&&y<11.2;
}
// A small, impassable low-canopy notch frames the distant city from the court.
function s4CityWindow(x,y){return y>20&&y<45&&Math.abs(x-(64+(47-y)*.255))<3.5;}
function s4CityCanopy(x,y){return y>4&&y<45&&Math.abs(x-(64+(47-y)*.255))<4.6;}
function s4ForestAt(x,y){return x>=0&&x<S4_WIDTH&&y>=0&&y<S4_HEIGHT&&S4.forest[(y|0)*S4_WIDTH+(x|0)]===1;}
function s4WoodHash(x,y){let n=Math.imul(x-S4_ORIGIN+573,374761393)^Math.imul(y+811,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
function s4ForestHeight(x,y){return x>67&&y>60?1.6+s4WoodHash(x,y)*.4:s4CityWindow(x,y)?1.3+s4WoodHash(x,y)*.25:3.3+s4WoodHash(x,y)*.8;}
function s4Vegetation(x,y,w,h,tex,z=0){if(x>67&&y>60&&h>4.5){w*=.7;h=4.5;}S4.flora.push({x,y,w,h,z,tex});}
function s4BuildForest(){
 const forest=S4.forest=new Uint8Array(S4_WIDTH*S4_HEIGHT);
 for(let y=2;y<S4_HEIGHT-4;y++)for(let x=4;x<S4_WIDTH-2;x++){
  if(!s4Clearing(x+.5,y+.5))forest[y*S4_WIDTH+x]=1;
 }
 // Merge solid runs vertically. No separate invisible tree colliders or gaps.
 let previous=new Map();
 for(let y=2;y<S4_HEIGHT-4;y++){
  const row=new Map();
  for(let x=4;x<S4_WIDTH-2;){if(!forest[y*S4_WIDTH+x]){x++;continue;}
   const a=x;while(x<S4_WIDTH-2&&forest[y*S4_WIDTH+x])x++;
   const key=a+','+x;let box=previous.get(key);
   if(box)box.y1=y+1;else{box={x0:a,x1:x,y0:y,y1:y+1,kind:'forest'};S4.solids.push(box);}
   row.set(key,box);
  }previous=row;
 }
 for(let y=2;y<S4_HEIGHT-4;y++)for(let x=4;x<S4_WIDTH-2;x++){
  if(!forest[y*S4_WIDTH+x])continue;
  let edge=false,outX=0,outY=0;
  for(const [dx,dy,ax,ay,bx,by]of [[0,-1,x,y,x+1,y],[1,0,x+1,y,x+1,y+1],[0,1,x+1,y+1,x,y+1],[-1,0,x,y+1,x,y]]){
   if(s4ForestAt(x+dx,y+dy))continue;
   // Boundary forest is viewed from a clearing; unseen outer faces are unnecessary.
   if(x+dx<4||x+dx>=S4_WIDTH-2||y+dy<2||y+dy>=S4_HEIGHT-4)continue;
   edge=true;outX+=dx;outY+=dy;
   const face=s4Quad([[ax,ay,0],[bx,by,0],[bx,by,s4ForestHeight(bx,by)],[ax,ay,s4ForestHeight(ax,ay)]],8,[31,54,43],.25,1);
   face.u0=(dx?y:x)*.25;face.out=[dx,dy];
   if((x-S4_ORIGIN+y*3)%4===0){
    // Leafy skirts soften the grid edge. The opaque core remains at its exact collision line.
    s4Vegetation((ax+bx)/2-dx*.06,(ay+by)/2-dy*.06,2.4,1.8,14);
   }
  }
  // Tall overlapping tree clusters break the skyline, including behind garden hedges.
  if(edge&&(x-S4_ORIGIN+y)%3===0){
   const n=s4WoodHash(x,y),len=Math.hypot(outX,outY)||1,tx=x+.5-outX/len*1.9,ty=y+.5-outY/len*1.9;
   // Keep the trunks in the woods, so tall sprites cannot visually fill a walkable lane.
   if(s4ForestAt(tx,ty)&&!(ty>37&&tx>56&&tx<78)&&!s4CityCanopy(tx,ty)&&!s4CityCanopy(tx-3,ty)&&!s4CityCanopy(tx+3,ty))s4Vegetation(tx,ty,5.2+n*1.8,6.8+n*3.2,n>.46?12:13);
  }
 }
 // A second, sparse row gives depth above the thicket without filling the level with meshes.
 for(let y=5;y<S4_HEIGHT-6;y+=5)for(let x=4;x<S4_WIDTH-4;x+=5){
  if(!s4ForestAt(x,y))continue;
  const close= !s4ForestAt(x+3,y)||!s4ForestAt(x-3,y)||!s4ForestAt(x,y+3)||!s4ForestAt(x,y-3);
  if(close&&!s4CityCanopy(x,y)&&!s4CityCanopy(x-3,y)&&!s4CityCanopy(x+3,y)){const n=s4WoodHash(x,y);s4Vegetation(x+.3,y+.2,5+n*2,8+n*3,n>.55?12:13);}
 }
 // Beyond the northern boundary, crowns continue the forest behind the roadside shelter.
 // Their roots are outside the playable grounds; no extra collision or navigation cells are needed.
 for(let x=9;x<S4_WIDTH;x+=4){const n=s4WoodHash(x,1);s4Vegetation(x,-.4,5.8+n*1.2,6+n*2.2,n>.4?12:13);}
}
function s4Hedge(x0,y0,x1,y1,crashCorner=false){
 const start=S4.faces.length;
 s4Box((x0+x1)/2,(y0+y1)/2,0,x1-x0,y1-y0,2.8,9,[39,73,49],false,1.6);
 S4.solids.push({x0,x1,y0,y1,kind:'hedge'});
 for(let i=start;i<S4.faces.length;i++){S4.faces[i].hedge=true;if(crashCorner)S4.faces[i].s4CrashHedge=true;}
 const vertical=y1-y0>x1-x0,length=vertical?y1-y0:x1-x0;
 for(let d=.8;d<length;d+=2.1){const x=vertical?(x0+x1)/2:x0+d,y=vertical?y0+d:(y0+y1)/2;
  s4Vegetation(x,y,3,1.6,15,1.8);
  if(crashCorner&&d<1.2)S4.flora[S4.flora.length-1].s4CrashHedge=true;
 }
}
function s4RoadMark(a,b,offset,width,color){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
 const p=(v,s)=>[v[0]+nx*s,v[1]+ny*s,.014];
 s4Quad([p(a,offset-width/2),p(b,offset-width/2),p(b,offset+width/2),p(a,offset+width/2)],-1,color);
}
function s4RoadSign(x,y,text,read,front,w=3.1,z=1.64){
 s4Box(x,y,0,.09,.09,z+.04,7,[46,64,59],true);
 s4Label(x,y,z,text,w,{h:Math.min(.42,w*.15),front,interact:'READ THE ROAD SIGN',read});
}
function s4BuildRoad(){
 for(let i=2;i<S4_ROAD.length;i++){
  const a=S4_ROAD[i-1],b=S4_ROAD[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  for(const side of[-1,1])s4RoadMark(a,b,side*2.77,.07,[147,158,137]);
  for(let d=.8;d<len-1;d+=3.4){const t=d/len,t2=Math.min(1,(d+1.35)/len);s4RoadMark([mix(a[0],b[0],t),mix(a[1],b[1],t)],[mix(a[0],b[0],t2),mix(a[1],b[1],t2)],0,.085,[163,158,106]);}
 }
 s4Group(S4_ORIGIN,0,()=>{
 // Sparse lamps reveal each turn without turning the forest into a lit corridor.
 for(const [x,y]of [[35.5,19.8],[45.4,10],[60.6,16.5],[74.6,18.4],[87,16],[100.7,16.1]])s4Lamp(x,y,[137,164,140]);
 s4RoadSign(35.6,30,'BUS STATION ↑','BUS STATION\nFollow the forest road toward the city.',[0,1]);
 s4RoadSign(63,20.3,'BUS STATION ↖','BUS STATION ↖\nFollow the next road bend.',[-.58,-.81]);
 s4Label(63,20.3,1.64,'HOSPITAL ↗',3.1,{h:.42,front:[.58,.81],interact:'READ THE ROAD SIGN',read:'HOSPITAL ↗\nThe garden and parking are at the entrance court.'});
 s4RoadSign(97.3,14.4,'BUS STOP ↖','BUS STATION — ROADSIDE SHELTER\nContinue around the bend.',[-1,0]);
 s4RoadSign(107.8,10.2,'← HOSPITAL  /  CITY →','HOSPITAL ←\nCITY ROAD →', [0,1]);
 // Visible end of this review's city road; no unmarked invisible boundary across asphalt.
 s4Fence(108.7,7.5,108.7,16.5,.85);
 s4RoadSign(108.6,12,'ROAD CLOSED','CITY ROAD CLOSED\nReturn along the road to the hospital grounds.',[-1,0]);
 });
}
function s4BuildBusShelter(x,y){
 s4Box(x,y,1.95,6,3.6,.17,7,[39,67,70]);
 for(const dx of[-2.8,2.8])for(const dy of[-1.5,1.5])s4Box(x+dx,y+dy,0,.12,.12,1.95,7,[60,81,79],true);
 s4Box(x,y-1.56,0,5.8,.11,1.86,7,[48,68,67],true,2);
 s4Box(x,y-.7,.26,3.8,.45,.14,7,[68,72,57],true);s4Box(x,y-.9,.45,3.8,.085,.45,7,[67,74,60]);
 s4Box(x+2.7,y+.6,.6,.12,.78,.72,7,[89,103,97]);
 s4Label(x,y+1.84,2.04,'BUS STATION / LAST SERVICE',5.5,{front:[0,1],h:.22});
 s4Label(x+2.45,y+1.1,1.08,'',2,{interact:'READ THE TIMETABLE',read:'LAST SERVICE — 23:10\nNo arrivals are listed.'});
 s4Lamp(x-3.6,y+3.2,[171,174,139]);
 // Low curb separates the shelter platform from the road instead of putting it in the road.
 s4Box(x,y+3.6,0,8.5,.12,.07,4,[88,106,96],false,2);
}
// Shared exposed shoreline: collision, the curb and shore wash describe the same water.
function s4BuildWaterfront(){
 const banks=[S4_POND,S4_LAKE];
 for(const [index,p]of banks.entries()){
  const other=banks[1-index],count=index?512:96;
  for(let i=0;i<count;i++){
   const a=i/count*TAU,b=(i+1)/count*TAU,mid=(a+b)/2;
   const point={x:p.x+p.rx*Math.cos(mid),y:p.y+p.ry*Math.sin(mid)};
   if(s4InWaterOval(point.x,point.y,other))continue;
   S4.shore.push(point);
   // The developed bank ends at the estate; the remote shore remains wilderness.
   if(point.x<4||point.x>S4_WIDTH-2||point.y<2||point.y>S4_HEIGHT-4)continue;
   const u=[p.x+p.rx*Math.cos(a),p.y+p.ry*Math.sin(a)],v=[p.x+p.rx*Math.cos(b),p.y+p.ry*Math.sin(b)];
   s4Quad([[...u,0],[...v,0],[...v,.095],[...u,.095]],4,[55,69,62],1,.3);
  }
 }
 // Distant wooded ridges use the existing tree artwork. They are beyond the water,
 // outside the walkable estate, and are never an invisible wall near the player.
 for(let i=0;i<=72;i++){
  const a=Math.PI*.46+i/72*Math.PI*1.08,n=s4WoodHash(i,207),x=S4_LAKE.x+(S4_LAKE.rx+5)*Math.cos(a),y=S4_LAKE.y+(S4_LAKE.ry+5)*Math.sin(a);
  s4Vegetation(x,y,14+n*6,8+n*5,n>.45?12:13);
 }
 for(let i=0;i<=40;i++){
  const a=Math.PI*.47+i/40*Math.PI*1.06,n=s4WoodHash(i,419),x=S4_LAKE.x+(S4_LAKE.rx+24)*Math.cos(a),y=S4_LAKE.y+(S4_LAKE.ry+24)*Math.sin(a);
  s4Vegetation(x,y,23+n*9,12+n*7,n>.6?12:13,1);
 }
}
function s4BuildGrounds(){
 s4BuildForest();
 // Living walls frame a vehicle-sized mouth and conceal the water along the first leg.
 s4Hedge(58.4,35.5,60.3,41.8);s4Hedge(58.4,44.2,60.3,48.3,true);
 s4Hedge(53.5,35.3,54.6,47.9);
 for(const y of [41.5,44.5]){const first=S4.faces.length;s4Box(60.45,y,0,.55,.6,1.8,4,[78,85,70],true);if(y===44.5)for(const f of S4.faces.slice(first))f.s4BreakPost=true;}
 s4Hedge(49.7,19.5,51.1,23.6);
 s4Hedge(28.1,18.7,39,20.25);s4Hedge(47,18.7,51,20.25);
 s4RoadSign(61.2,44.8,'GARDEN GATES ↑','GARDEN GATES\nPass through the narrow opening and follow the living hedge.',[1,0],2.4,1.3);
 s4RoadSign(53.3,28.5,'GARDEN GATES ↖','GARDEN GATES\nThe grass clearing is around the next bend.',[0,1]);
 s4Label(53.3,28.5,1.64,'HOSPITAL ←',3.1,{h:.42,front:[0,-1],interact:'READ THE ROAD SIGN',read:'HOSPITAL ←\nFollow the hedge walk back to the court.'});
 s4RoadSign(79.9,64.3,'HOSPITAL →','HOSPITAL →\nFollow the path around the hospital wing back to the entrance court.',[1,0]);
 for(const [x,y]of [[75,39.7],[80.6,52.5],[81.3,59.3],[57.6,38.3],[52,29.5]])s4Lamp(x,y,[133,160,140]);
 s4BuildRoad();
 // Cache horizontal bounds for cheap visibility rejection on mobile.
 for(const face of S4.faces){const xs=face.points.map(p=>p[0]),ys=face.points.map(p=>p[1]);face.cx=(Math.min(...xs)+Math.max(...xs))/2;face.cy=(Math.min(...ys)+Math.max(...ys))/2;face.radius=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))/2;}
}

// SOURCE: exterior-renderer.js
// Outdoor profile: horizon sky, terrain and perspective-correct textured geometry.
// A pixel depth buffer lets low objects, roofs and tall buildings occlude at their actual heights.
const S4_ART={tiles:[],sky:null,city:null};
function prepareExterior(){
 const load=(src,kind)=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{
  if(kind==='parking'){s4qPrepareParking(img);}else if(kind==='cerberusBody'||kind==='cerberusHeads'){cbPrepareArt(img,kind==='cerberusBody'?'body':'heads');}else if(kind==='seraphim'){s4tPrepareArt(img);}else if(kind==='recovery'){s4qPrepareAtlas(img);}else if(kind==='ambulance'){s4dPrepareVan(img);}else if(kind==='sky'||kind==='city'){
   const c=document.createElement('canvas');c.width=kind==='sky'?1536:1024;c.height=kind==='sky'?512:342;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0,c.width,c.height);S4_ART[kind]={w:c.width,h:c.height,data:g.getImageData(0,0,c.width,c.height).data};
  }else for(let i=0;i<4;i++){
   const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d',{willReadFrequently:true}),cellW=img.width/2,split=img.height*(kind==='flora'?653/1254:.5),cellY=i<2?0:split,cellH=i<2?split:img.height-split,inset=kind==='facade'?4:kind==='flora'?0:1;
   g.drawImage(img,(i%2)*cellW+inset,cellY+inset,cellW-inset*2,cellH-inset*2,0,0,256,256);
   S4_ART.tiles[({ground:0,facade:4,woods:8,flora:12}[kind])+i]=g.getImageData(0,0,256,256).data;
  }resolve();
 }catch(e){reject(e);}};img.onerror=()=>reject(Error('Exterior artwork could not load'));img.src=src;});
 return Promise.all([load(ASSETS.exteriorSky,'sky'),load(ASSETS.exteriorMaterials,'ground'),load(ASSETS.exteriorFacade,'facade'),load(ASSETS.groundsTextures,'woods'),load(ASSETS.groundsSprites,'flora'),load(ASSETS.distantCity,'city'),load(ASSETS.ambulance,'ambulance'),load(ASSETS.recovery,'recovery'),load(ASSETS.seraphim,'seraphim'),load(ASSETS.cerberusBody,'cerberusBody'),load(ASSETS.cerberusHeads,'cerberusHeads'),load(ASSETS.parking,'parking')]);
}
function s4SkyU(a){return ((.53+(a+Math.PI/2)/TAU)%1+1)%1;}
function s4BakeLights(){
 S4.light=new Float32Array(S4_TW*S4_TH*3);
 for(let y=0;y<S4_TH;y++)for(let x=0;x<S4_TW;x++){
  const i=(y*S4_TW+x)*3;let r=.47,g=.66,b=.76;
  for(const l of S4.lamps){const d2=((x+.5)/2-l.x)**2+((y+.5)/2-l.y)**2,f=.85/(1+d2*.5);r+=l.color[0]/200*f;g+=l.color[1]/200*f;b+=l.color[2]/200*f;}
  S4.light[i]=r;S4.light[i+1]=g;S4.light[i+2]=b;
 }
}
function s4WorldRender(){
 if(!S4.depth||S4.depth.length!==W*H)S4.depth=new Float32Array(W*H);
 if(!S4.light)s4BakeLights();s4dBakeFireLight();
 if(!S4.skyColumns||S4.skyColumns.length!==W){S4.skyColumns=new Int32Array(W);S4.skyRayLength=new Float32Array(W);}
 const depth=S4.depth,sky=S4_ART.sky,texes=S4_ART.tiles,skyColumns=S4.skyColumns,skyRayLength=S4.skyRayLength;
 const flash=muzzle>0?(settings.reduce?.04:.18):0,gr=equippedItem().rgb,clock=settings.reduce?0:gameTime,toyLight=s4tRunning()?s4tLightPosition():null;
 for(let x=0;x<W;x++){const c=2*x/W-1,dx=camDX+planeX*c,dy=camDY+planeY*c;skyColumns[x]=sky?Math.floor(s4SkyU(Math.atan2(dy,dx))*sky.w):0;skyRayLength[x]=Math.hypot(dx,dy);}
 for(let y=0;y<H;y++){
  const down=y-horizon,dist=down>0?projection*.52/Math.max(.5,down):Infinity;
  const nearFloor=down>0&&dist<78,canReachLake=down>0&&dist<520,lit=Math.exp(-dist*.014);
  let wx=player.x+dist*(camDX-planeX),wy=player.y+dist*(camDY-planeY);
  const stepx=2*dist*planeX/W,stepy=2*dist*planeY/W;
  for(let x=0;x<W;x++){
   const pi=y*W+x,i=pi*4;
   const outside=wx<0||wy<0||wx>=S4_WIDTH||wy>=S4_HEIGHT;
   const openWater=canReachLake&&(outside||!nearFloor)&&s4Pond(wx,wy);
   if(!nearFloor&&!openWater){
    if(sky){const syRaw=(.93-Math.atan2(horizon-y,projection*skyRayLength[x])/.64)*sky.h,sy=clamp(Math.floor(syRaw),0,sky.h-1),ti=(sy*sky.w+skyColumns[x])*4;px[i]=sky.data[ti];px[i+1]=sky.data[ti+1];px[i+2]=sky.data[ti+2];if(syRaw<0){const blend=clamp(-syRaw/(sky.h*.035),0,1);px[i]=mix(px[i],5,blend);px[i+1]=mix(px[i+1],12,blend);px[i+2]=mix(px[i+2],18,blend);}}else{px[i]=9;px[i+1]=18;px[i+2]=25;}
    depth[pi]=1e6;
   }else{
    const cell=clamp(wy*2|0,0,S4_TH-1)*S4_TW+clamp(wx*2|0,0,S4_TW-1),kind=openWater?3:S4.terrain[cell],water=kind===3,tex=texes[kind];
    const scale=kind===2?160:kind===0?96:64;
    const tx=Math.floor(wx*scale+(water?Math.sin(wy*1.9+clock*.63)*2:0))&255,ty=Math.floor(wy*scale+(water?clock*3:0))&255,ti=(ty*256+tx)*4;
    const li=cell*3;let r=(tex?tex[ti]:50)*S4.light[li],g=(tex?tex[ti+1]:65)*S4.light[li+1],b=(tex?tex[ti+2]:67)*S4.light[li+2];
    if(water&&sky){const sy=clamp(Math.floor((.93-Math.atan2(down,projection*skyRayLength[x])/.64)*sky.h),0,sky.h-1),sx=(skyColumns[x]+Math.floor(Math.sin(wx*3+clock)*2)+sky.w)%sky.w,si=(sy*sky.w+sx)*4;r=r*.6+sky.data[si]*.42;g=g*.6+sky.data[si+1]*.42;b=b*.6+sky.data[si+2]*.42;}
    if(toyLight){const td=(wx-toyLight.x)**2+(wy-toyLight.y)**2;if(td<20){const f=.7*Math.exp(-td*.65)*(S4T.phase==='airborne'?.55:1);r+=f*100;g+=f*80;b+=f*36;}}
    if(wx>38&&wx<48&&wy>19&&wy<25){const g0=Math.exp(-((wx-43)**2*.07+(wy-19.5)**2*.22))*(.22+CB.gateProgress*.68);r+=g0*140;g+=g0*6;b+=g0*32;}
    const fire=S4.fireLight[cell];r+=fire*160;g+=fire*61;b+=fire*12;const glow=flash/(1+dist*.35),waterLight=water?Math.exp(-Math.min(dist,60)*.014-Math.max(0,dist-60)*.002):lit;
    px[i]=11+(r-11)*waterLight+gr[0]*glow;px[i+1]=23+(g-23)*waterLight+gr[1]*glow;px[i+2]=29+(b-29)*waterLight+gr[2]*glow;depth[pi]=dist;
   }
   px[i+3]=255;wx+=stepx;wy+=stepy;
  }
 }
 s4DrawDistantCity();
 for(const face of S4.faces)if(!hgIndoorFace(face))s4DrawFace(face);
 for(const plant of S4.flora){
  if(hgIndoorTree(plant))continue;
  const dx=plant.x-player.x,dy=plant.y-player.y,d=dx*camDX+dy*camDY,cross=dy*camDX-dx*camDY;
  if(d<=.08||Math.abs(cross)>d*W/(2*projection)+plant.w*.6)continue;
  const ox=-camDY*plant.w/2,oy=camDX*plant.w/2,z=plant.z,top=z+plant.h;
  s4DrawFace({points:[[plant.x-ox,plant.y-oy,z],[plant.x+ox,plant.y+oy,z],[plant.x+ox,plant.y+oy,top],[plant.x-ox,plant.y-oy,top]],tex:plant.tex,color:[29,57,42],u:1,v:1,cutout:true,distant:plant.x<0});
 }
 s4dVehicleFaces();s4qWorldFaces();s4tWorldFaces();cbWorldFaces();hgWorld();
 // Existing projectile/sprite effects use eye-height distance. Geometry and signs use pixel depth.
 const row=clamp(Math.round(horizon),0,H-1)*W;for(let x=0;x<W;x++)zBuffer[x]=depth[row+x];
 wc.putImageData(frame,0,0);
 for(const l of S4.lamps){const v=project(l.x,l.y,l.z);if(v&&v.d<45&&s4Visible(v.x,v.y,v.d,.3)){const col='#'+l.color.map(n=>n.toString(16).padStart(2,'0')).join('');drawGlow(v.x,v.y,Math.min(24,v.scale*.24),col,.18);}}
}
function s4ClipNear(verts,near=.08){
 const out=[];for(let i=0;i<verts.length;i++){const a=verts[i],b=verts[(i+1)%verts.length],ina=a.d>=near,inb=b.d>=near;if(ina)out.push(a);if(ina!==inb){const t=(near-a.d)/(b.d-a.d);out.push({cx:mix(a.cx,b.cx,t),cy:mix(a.cy,b.cy,t),d:near,u:mix(a.u,b.u,t),v:mix(a.v,b.v,t)});}}return out;
}
function s4DrawFace(face){
 if(face.cx!==undefined){
  const dx=face.cx-player.x,dy=face.cy-player.y,d=dx*camDX+dy*camDY,r=face.radius;
  if(d+r<=.08||Math.abs(dy*camDX-dx*camDY)>Math.max(0,d)*W/(2*projection)+r*1.9)return;
  if(face.out&&(-dx*face.out[0]-dy*face.out[1])<-.01)return;
 }
 const verts=face.points.map((p,i)=>{const dx=p[0]-player.x,dy=p[1]-player.y;return{cx:dy*camDX-dx*camDY,cy:.52-p[2],d:dx*camDX+dy*camDY,u:(face.u0||0)+[0,face.u,face.u,0][i],v:(face.v0||0)+[face.v,face.v,0,0][i]};});
 if(verts.every(v=>v.d<=.08))return;
 const clipped=s4ClipNear(verts,face.near||.08);if(clipped.length<3)return;
 const ps=clipped.map(v=>({x:W/2+v.cx*projection/v.d,y:horizon+v.cy*projection/v.d,q:1/v.d,u:v.u/v.d,v:v.v/v.d}));
 if(ps.every(p=>p.x<0)||ps.every(p=>p.x>=W)||ps.every(p=>p.y<0)||ps.every(p=>p.y>=H))return;
 const a=face.points[0],b=face.points[1],c=face.points[2],ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
 const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,len=Math.hypot(nx,ny,nz)||1;
 const brightness=face.emissive?1:.62+.15*Math.abs(nz/len)+.12*Math.abs(nx/len);
 for(let i=1;i<ps.length-1;i++)s4RasterTriangle(ps[0],ps[i],ps[i+1],face,brightness);
}
function s4RasterTriangle(a,b,c,face,brightness){
 const det=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(det)<.00001)return;
 const inv=1/det,x0=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),x1=Math.min(W-1,Math.ceil(Math.max(a.x,b.x,c.x))),y0=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),y1=Math.min(H-1,Math.ceil(Math.max(a.y,b.y,c.y)));
 if(x1<x0||y1<y0)return;
 const tex=face.surface?face.surface.data:S4_ART.tiles[face.tex],tw=face.surface?face.surface.w:256,th=face.surface?face.surface.h:256,color=face.color,depth=S4.depth,portalMask=face.portalMask;
 const dbdx=(c.y-a.y)*inv,dbdy=-(c.x-a.x)*inv,dcdx=-(b.y-a.y)*inv,dcdy=(b.x-a.x)*inv;
 for(let y=y0;y<=y1;y++){
  let wb=((x0+.5-a.x)*(c.y-a.y)-(y+.5-a.y)*(c.x-a.x))*inv,wc0=((b.x-a.x)*(y+.5-a.y)-(b.y-a.y)*(x0+.5-a.x))*inv;
  for(let x=x0;x<=x1;x++,wb+=dbdx,wc0+=dcdx){
   const wa=1-wb-wc0;if(wa<-.00001||wb<-.00001||wc0<-.00001)continue;
   const q=wa*a.q+wb*b.q+wc0*c.q,d=1/q,pi=y*W+x;if(portalMask&&!portalMask[pi])continue;if(d>=depth[pi]-.000001)continue;
   const fu=(wa*a.u+wb*b.u+wc0*c.u)*d,fv=(wa*a.v+wb*b.v+wc0*c.v)*d,tu=face.surface?clamp(Math.floor(fu*tw),0,tw-1):Math.floor(fu*256)&255,tv=face.surface?clamp(Math.floor(fv*th),0,th-1):Math.floor(fv*256)&255,ti=(tv*tw+tu)*4;
   if(face.cutout&&(!tex||tex[ti+3]<128))continue;
   const baseFog=1/(1+d*.009),fog=face.emissive?1:face.distant?baseFog*baseFog:baseFog,i=pi*4;
   const r=tex?tex[ti]:color[0],g=tex?tex[ti+1]:color[1],bl=tex?tex[ti+2]:color[2];
   px[i]=11+(r*brightness*(face.emissive?1:.83)-11)*fog;px[i+1]=23+(g*brightness-23)*fog;px[i+2]=29+(bl*brightness*1.07-29)*fog;depth[pi]=d;
  }
 }
}
function s4Visible(x,y,d,tolerance=.1){if(x<0||y<0||x>=W||y>=H||!S4.depth)return false;return d<S4.depth[(y|0)*W+(x|0)]+tolerance;}
// The ridge is part of the distant sky, always behind real trees and architecture.
function s4DrawDistantCity(){
 const city=S4_ART.city;if(!city)return;
 const yaw=-Math.PI/2+.255,width=.62,top=.365,height=.22;
 for(let x=0;x<W;x++){
  const ray=2*x/W-1,dx=camDX+planeX*ray,dy=camDY+planeY*ray,u=.5+angle(Math.atan2(dy,dx)-yaw)/width;
  if(u<0||u>=1)continue;
  const sx=Math.min(city.w-1,Math.floor(u*city.w)),len=S4.skyRayLength[x];
  const ya=Math.max(0,Math.floor(horizon-Math.tan(top)*projection*len)),yb=Math.min(H-1,Math.ceil(horizon-Math.tan(top-height)*projection*len));
  for(let y=ya;y<=yb;y++){
   const v=(top-Math.atan2(horizon-y,projection*len))/height;if(v<0||v>=1)continue;
   const si=(Math.floor(v*city.h)*city.w+sx)*4,a=city.data[si+3]/255,pi=y*W+x;
   if(!a||S4.depth[pi]<1e5)continue;
   const i=pi*4;for(let c=0;c<3;c++)px[i+c]=mix(px[i+c],city.data[si+c],a);
  }
 }
}
function s4RenderMap(){
 const c=mapCtx,s=150/S4_WIDTH,oy=(150-S4_HEIGHT*s)/2;c.clearRect(0,0,150,150);
 for(let y=0;y<S4_HEIGHT;y++)for(let x=0;x<S4_WIDTH;x++){c.fillStyle=s4ForestAt(x,y)?'#173329':['#394f55','#a8b9a4','#32503b','#103b52'][S4.terrain[y*2*S4_TW+x*2]];c.fillRect(x*s,oy+y*s,s+.1,s+.1);}
 for(const b of S4.solids){if(b.kind==='forest')continue;c.fillStyle=b.kind==='hedge'?'#64854c':'#77968d';c.fillRect(b.x0*s,oy+b.y0*s,Math.max(1,(b.x1-b.x0)*s),Math.max(1,(b.y1-b.y0)*s));}
 c.font='bold 8px monospace';c.textAlign='center';c.fillStyle='#e2dfba';for(const [x,y,label]of [[64,56,'HOSPITAL'],[92,85,'PARK'],[135,3,'BUS'],[41,17,'GATES'],[17,49,'LAKE']])c.fillText(label,x*s,oy+y*s);
 c.fillStyle='#ffedb7';c.beginPath();c.arc(player.x*s,oy+player.y*s,2.4,0,TAU);c.fill();c.strokeStyle='#ffedb7';c.beginPath();c.moveTo(player.x*s,oy+player.y*s);c.lineTo((player.x+Math.cos(player.a)*2)*s,oy+(player.y+Math.sin(player.a)*2)*s);c.stroke();
}

// SOURCE: exterior-audio.js
// A quiet exterior soundscape, separate from the approved indoor score and recorded weapons.
// Soft foliage air, shore wash, dispersed insect calls and occasional forest owls.
audio.exteriorMix=function(){
 if(!this.ctx||!s4Running())return;const t=this.ctx.currentTime;
 // Only the guardian earns a score. Courtyard, parking and bus encounters
 // retain their physical sounds and the surrounding night, without music.
 const combat=cbScoreWanted();
 for(const p of [this.music.gain,this.musicBed.gain]){p.cancelScheduledValues(t);p.setValueAtTime(p===this.music.gain&&combat?settings.music*.92:0,t);}
 this.ambience.gain.cancelScheduledValues(t);this.ambience.gain.setTargetAtTime(settings.sfx*.32,t,.12);
 this.roomReturn.gain.cancelScheduledValues(t);this.roomReturn.gain.setTargetAtTime(.19,t,.12);
 this.roomTone.frequency.cancelScheduledValues(t);this.roomTone.frequency.setTargetAtTime(2900,t,.12);
 // A ConvolverNode rejects impulse responses with a different sample rate.
 // BufferSource ambience may be resampled; the convolution buffer may not.
 if(!this.s4Impulse||this.s4Impulse.sampleRate!==this.ctx.sampleRate){
  const rate=this.ctx.sampleRate,b=this.ctx.createBuffer(2,rate,rate);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(const [delay,gain]of [[.065,.29],[.139,.13],[.27,.052]])d[Math.floor((delay+ch*.012)*rate)]=gain;}
  this.s4Impulse=b;
 }
 if(this.room.buffer!==this.s4Impulse)this.room.buffer=this.s4Impulse;
};
audio.exteriorBed=function(kind){
 this.s4Buffers=this.s4Buffers||{};if(this.s4Buffers[kind])return this.s4Buffers[kind];
 const rate=16000,n=rate*16,fade=rate/2,channels=kind==='wind'?2:1,b=this.ctx.createBuffer(channels,n,rate);
 let seed=kind==='wind'?78213:kind==='water'?32017:92003;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
 for(let ch=0;ch<channels;ch++){
  const raw=new Float32Array(n+fade);let low=0,air=0;
  for(let i=0;i<raw.length;i++){
   const t=i/rate,white=random();low=low*.994+white*.006;air=air*.82+white*.18;
   const swell=kind==='water'?.48+.35*Math.sin(t*2.2+ch)+.12*Math.sin(t*5.3):.7+.19*Math.sin(t*.37+ch*1.7)+.09*Math.sin(t*.81+2);
   // Remove the gust envelope and bass-heavy breathing from the old wind bed.
   raw[i]=kind==='water'?(air*.72+low*1.8)*swell:kind==='wind'?((air-low)*.26+low*.16):low*.8;
  }
  const out=b.getChannelData(ch);for(let i=0;i<n;i++){const w=Math.min(1,i/fade);out[i]=raw[i]*w+(i<fade?raw[n+i]*(1-w):0);}
 }
 this.s4Buffers[kind]=b;return b;
};
audio.exteriorOwl=function(){
 if(!this.ctx||!this.active||!this.s4Night)return;
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),panner=a.createPanner(),send=a.createGain();
 source.buffer=this.nightBuffers?.owl;if(!source.buffer)return;source.playbackRate.value=this.s4Night.calls%2?.96:1;
 filter.type='lowpass';filter.frequency.value=2200;panner.panningModel='HRTF';panner.distanceModel='inverse';panner.rolloffFactor=0;
 source.connect(filter).connect(gain).connect(panner).connect(this.ambience);gain.connect(send).connect(this.room);
 const roosts=[{x:53,y:33,z:3.5},{x:75,y:32,z:4},{x:93,y:83,z:3},{x:125,y:7,z:3.5},{x:40,y:23,z:3.6}];
 roosts.sort((p,q)=>Math.hypot(p.x-player.x,p.y-player.y)-Math.hypot(q.x-player.x,q.y-player.y));
 const pos=roosts[this.s4Night.calls%3===2?1:0],vol=.35,wet=.22,nodes=[source,gain,filter,panner,send];
 const v={source,gain,filter,panner,send,pos,vol,wet,nodes,night:true,until:a.currentTime+source.buffer.duration/source.playbackRate.value+.1};
 this.position(v,a.currentTime);this.voices.push(v);this.s4Night.calls++;
 source.onended=()=>{for(const n of nodes)n.disconnect();const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};source.start(a.currentTime);
};
audio.exteriorLoops=function(){
 if(this.s4Nodes?.length)return;
 this.exteriorMix();const a=this.ctx;this.s4Nodes=[];
 for(const [kind,vol,pos]of [['wind',.32,null],['water',1.65,{x:32,y:36}],['city',.1,{x:86,y:-32}],['insects',.63,{x:54,y:37}],['insects',.4,{x:73,y:39}]]){
  const source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner();source.buffer=kind==='insects'?this.nightBuffers.insects:this.exteriorBed(kind);source.loop=true;gain.gain.value=0;
  const layer=this.s4Nodes.length;if(kind==='insects')source.playbackRate.value=layer===3?1:.947;
  source.connect(gain).connect(pan).connect(this.ambience);source.start(a.currentTime,kind==='insects'&&layer===4?7.8:0);this.loops.push(source);this.s4Nodes.push({source,gain,pan,kind,vol,pos,layer});
 }
 this.s4Night={clock:0,next:1.7,calls:0};
 this.lastFoot=this.lastBreath=this.lastHeart=this.lastAmbient=0;this.exteriorTick();
};
audio.exteriorTick=function(dt=0){
 if(!this.ctx||!this.active||mode!=='playing')return;const t=this.ctx.currentTime;
 const disturbance=(S4D.on&&(['approach','impact','rearm','fight'].includes(S4D.phase)||s4qCombat()))||cbScoreWanted()||cbRunning()&&CB.state==='drowning'||hgInside();
 if(this.s4Night){
  const night=this.s4Night;night.clock+=dt;
  if(disturbance)night.next=Math.max(night.next,night.clock+12);
  else if(night.clock>=night.next){this.exteriorOwl();night.next=night.clock+24+(night.calls*7%13);}
 }
 for(const n of this.s4Nodes||[]){
  let gain=n.vol,pan=0;
  if(n.kind==='water'){
   // The audible source follows the nearest point on the long bank, rather than its center.
   n.pos=s4NearestShore(player.x,player.y);
  }
  if(n.kind==='insects'){
   const banks=n.layer===3?[[54,37],[72,28],[97,72],[49,23],[126,13]]:[[73,39],[59,25],[90,84],[29,35],[135,9]];
   banks.sort((p,q)=>Math.hypot(p[0]-player.x,p[1]-player.y)-Math.hypot(q[0]-player.x,q[1]-player.y));n.pos={x:banks[0][0],y:banks[0][1]};
   gain*=disturbance?.18:1;
  }
  if(n.pos){const dx=n.pos.x-player.x,dy=n.pos.y-player.y,d=Math.hypot(dx,dy);pan=clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-1,1)*.8;gain*=n.kind==='water'?1/(1+d*.5):n.kind==='insects'?1/(1+d*.035):1/(1+d*.012);}
  else gain*=S4.zone==='BUS STATION'?.8:1;
  n.gain.gain.setTargetAtTime(gain,t,n.kind==='insects'?(disturbance?.12:2.5):.25);n.pan.pan.setTargetAtTime(pan,t,n.kind==='insects'?1.2:.15);
 }
 for(const v of this.voices)if(v.pos)this.position(v,t);
 const speed=Math.hypot(player.vx,player.vy);
 if(speed>.9&&dashT<=0&&t-this.lastFoot>.30/Math.max(.8,speed/4.65)){
  this.lastFoot=t;const grass=s4GroundType(player.x,player.y)===2;
  const v=this.play(this.choose('step',4),{vol:grass?.19:.29,wet:.055,pan:this.variation.step%2?.12:-.12,rate:grass?.83:rand(.94,1.06)});
  if(v&&grass)v.filter.frequency.setTargetAtTime(1600,t,.01);
 }
};
(function(){
 const levels=audio.levels.bind(audio),startLoops=audio.startLoops.bind(audio),tick=audio.tick.bind(audio),reset=audio.reset.bind(audio);
 audio.levels=function(){levels();if(s4Running())this.exteriorMix();};
 audio.startLoops=function(){if(s4Running())this.exteriorLoops();else startLoops();};
 audio.tick=function(dt=0){if(s4Running())this.exteriorTick(dt);else tick(dt);};
 audio.reset=function(){reset();for(const n of this.s4Nodes||[]){n.gain.disconnect();n.pan.disconnect();}this.s4Nodes=[];this.s4Night=null;};
})();

// SOURCE: exterior-sequence.js
// Scene 4 / Phase 2. One finite opening encounter, followed by free exploration.
// Cinematics advance only on simulation time. Skipping constructs an endpoint;
// it never runs missed sounds, impacts or spawns in a burst.
const S4D={on:false,phase:'idle',t:0,clock:0,carry:null,origin:null,vehicle:null,
 crashed:false,door:0,wave:0,waveT:0,spawned:0,safeT:0,checkpoint:null,impactCount:0};
const S4D_DURATIONS={walk:3.6,threshold:.85,reveal:6.2,approach:1.95,impact:1.15,rearm:1.0};
const S4D_WRECK={x0:56.95,x1:61.45,y0:41.65,y1:44.35,kind:'ambulance'};
const S4D_CAST=[
 {x:61.72,y:42.62,type:0,wave:1,at:.45,from:'ambulance',out:[1,0]},
 {x:61.78,y:43.35,type:1,wave:1,at:1.3,from:'ambulance',out:[1,0]},
 {x:70.8,y:42.65,type:0,wave:2,at:.45,from:'east verge',out:[0,-1]},
 {x:67.66,y:36.5,type:2,wave:2,at:1.4,from:'forest road',out:[-1,0]},
 {x:60.54,y:47.1,type:1,wave:2,at:2.5,from:'canopy',out:[1,0]}
];
const s4dEase=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
function s4dLocked(){return S4D.on&&!['fight','aftermath','idle'].includes(S4D.phase);}
function s4dCapture(){return{hp:player.hp,weapon,ammo:guns.map(g=>({ammo:g.ammo,reserve:g.reserve})),mods:{...mods},score,kills,gameTime,maxCombo};}
function s4dCarry(c){player.hp=c.hp;weapon=c.weapon;Object.assign(mods,c.mods);guns.forEach((g,i)=>Object.assign(g,c.ammo[i]));score=c.score;kills=c.kills;gameTime=c.gameTime;maxCombo=c.maxCombo;}
function s4dReset(){
 Object.assign(S4D,{on:false,phase:'idle',t:0,clock:0,carry:null,origin:null,vehicle:null,crashed:false,door:0,wave:0,waveT:0,spawned:0,safeT:0,checkpoint:null,impactCount:0});
 document.body.classList.remove('departure');$('sequenceControls').classList.add('hidden');
 audio.departureStop?.();s4qReset();s4tReset();cbReset();$('compassArrow').style.visibility='visible';
}
function s4dPhase(phase){S4D.phase=phase;S4D.t=0;s4dHud();}
function s4dBeginWalk(){
 if(S4D.on)return false;
 Object.assign(S4D,{on:true,carry:s4dCapture(),origin:{x:player.x,y:player.y,a:player.a},clock:0});
 releaseInputs();shotCD=reloadT=reloadDuration=meleeT=muzzle=recoil=weaponDrop=0;player.vx=player.vy=0;
 msgT=feedT=0;hideOverlays();mode='playing';s4dPhase('walk');
 $('hud').classList.remove('hidden');$('touch').classList.remove('hidden');document.body.classList.add('playing');
 audio.start();audio.heartSilenceMusic();audio.play('breath1',{vol:.28,wet:.04});hudUpdate();lockPointer();return true;
}
function s4dOutside(){
 const state={...S4D},carry=s4dCapture();
 audio.reset();loadStage(3);Object.assign(S4D,state);s4dCarry(carry);S4.entry=S4D.carry;
 reviewPlace(64,50.3,-Math.PI/2);msgT=feedT=0;audio.start();audio.exteriorMix();
}
function s4dCrashPosition(t){
 t=clamp(t,0,1);const u=1-t;
 const x=u*u*u*77+3*u*u*t*72+3*u*t*t*65+t*t*t*59.2;
 // The rear steps out, the driver countersteers, then the tyres slide sideways.
 // Body yaw deliberately disagrees with travel; endpoints stay physically fixed.
 const slip=Math.sin(t*TAU)*Math.sin(t*Math.PI);
 const y=u*u*u*43+3*u*u*t*40.6+3*u*t*t*43+t*t*t*43+slip*.64;
 const dx=3*u*u*(72-77)+6*u*t*(65-72)+3*t*t*(59.2-65);
 const dy=3*u*u*(40.6-43)+6*u*t*(43-40.6);
 const skid=Math.sin(t*Math.PI);
 return{x,y,a:Math.atan2(-dy,-dx)+.42*Math.sin(t*TAU+.25)*skid,roll:.07*Math.sin(t*TAU+.4)*skid,alive:true};
}
function s4dPlaceWreck(){
 S4D.crashed=true;S4D.vehicle={x:59.2,y:43,a:0,alive:true};
 if(!S4.solids.some(b=>b.kind==='ambulance')){
  S4.solids.push({...S4D_WRECK});
  // The struck southern pier breaks low, revealing the van behind it.
  for(const f of S4.faces)if(f.s4BreakPost){for(const p of f.points)p[2]*=.19;}
  // The same strike crushes the near hedge corner. Its low, solid wreckage
  // exposes the burning cab without changing the route or the calm grounds.
  S4.faces=S4.faces.filter(f=>!f.s4CrashHedge);
  s4Box(59.35,44.75,0,1.9,1.1,.95,9,[39,73,49],false,1.6);
  s4Box(59.35,46.8,0,1.9,3,2.8,9,[39,73,49],false,1.6);
  for(const p of S4.flora)if(p.s4CrashHedge){p.z=.15;p.h=.75;p.w=2.2;}
  // The forest edge shares this corner with the living wall. Flatten only
  // the struck cell and its overhanging sapling into solid brush/rubble.
  for(const f of S4.faces)if(f.tex===8&&f.points.every(p=>p[0]>=58.3&&p[0]<=60.31&&p[1]>=44&&p[1]<=45.01))for(const p of f.points)p[2]=Math.min(p[2],.85);
  for(const p of S4.flora)if(p.x>58.4&&p.x<60.4&&p.y>=44.2&&p.y<45.5&&p.h>4){p.tex=15;p.h=.8;p.w=2.7;p.z=.12;}
  s4Box(59.1,44.8,.05,1.8,.24,.21,-1,[61,48,35],false);
 }
 // Flow and projectile collision use the same visible wreck footprint.
 for(let y=41;y<=44;y++)for(let x=56;x<=61;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 buildFlow();
}
function s4dImpact(){
 s4dPlaceWreck();S4D.impactCount++;s4dPhase('impact');
 shake=settings.reduce?0:8;audio.departureCrash();
 emit(57.35,43,.55,'#ffd09a',settings.reduce?12:65,1.5);
 emit(58.4,43.4,.28,'#778f82',settings.reduce?8:28,1.1);
}
function s4dFightStart(){
 s4dPlaceWreck();S4D.door=1;S4D.wave=1;S4D.waveT=0;S4D.spawned=0;S4D.safeT=1.8;
 releaseInputs();player.vx=player.vy=0;weaponDrop=shotCD=reloadT=dashT=meleeT=0;
 s4dPhase('fight');s4dSave();hudUpdate();feed('THEY CAME WITH YOU.');
}
function s4dSkip(){
 if(mode!=='playing'||!s4dLocked())return false;
 if(S4Q.action)return s4qActionFinish();
 // Preserve the real carried resources, but discard movie-specific sources.
 if(!s4Running())s4dOutside();else{audio.departureStop();for(const v of [...audio.voices])try{v.source.stop();}catch{}}
 reviewPlace(64,47,-Math.PI/2-.72);enemies=[];bullets=[];particles=[];rings=[];tracers=[];numbers=[];
 shake=hurt=whiteFlash=muzzle=recoil=hitstop=aimPitch=0;S4D.impactCount=0;
 s4dFightStart();audio.start();return true;
}
function s4dSave(){
 S4D.checkpoint={carry:s4dCapture(),phase:S4D.phase,clock:S4D.clock,t:S4D.t,wave:S4D.wave,waveT:S4D.waveT,spawned:S4D.spawned,
  x:player.x,y:player.y,a:player.a,enemies:enemies.map(e=>({...e})),drops:drops.map(d=>({...d})),decals:decals.map(d=>({...d})),stageKills,stageTime,enemyId,entry:S4D.carry,quest:S4Q.on?s4qSnapshot():null,visited:[...S4.visited]};
}
function s4dRestore(){
 const c=S4D.checkpoint;if(!c)return false;
 hideOverlays();audio.reset();useChapter=true;loadStage(3);s4dCarry(c.carry);
 Object.assign(S4D,{on:true,phase:c.phase,clock:c.clock,t:c.t,wave:c.wave,waveT:c.waveT,spawned:c.spawned,carry:c.entry,door:1,safeT:1.8,checkpoint:c});
 s4dPlaceWreck();if(c.quest){Object.assign(S4Q,c.quest,{visited:[...c.quest.visited],action:null});s4qApplyGate();s4qApplyVehicle();if(S4Q.moved)S4D.door=0;}S4.visited=new Set(c.visited||[]);reviewPlace(c.x,c.y,c.a);enemies=c.enemies.map(e=>({...e}));drops=c.drops.map(d=>({...d}));decals=c.decals.map(d=>({...d}));
 stageKills=c.stageKills;stageTime=c.stageTime;enemyId=c.enemyId;S4.entry=c.entry;
 mode='playing';document.body.classList.add('playing');$('hud').classList.remove('hidden');$('touch').classList.remove('hidden');
 review.done=c.quest?c.quest.done:c.phase==='aftermath';audio.start();hudUpdate();s4dHud();lockPointer();feed(c.quest?c.quest.checkpointLabel+' · CHECKPOINT':'COURTYARD CHECKPOINT');return true;
}
function s4dSpawn(actor,index){
 // The emerging body occupies a real safe cell at the doorway/cover edge.
 const e=spawn(actor.x,actor.y,actor.type);e.s4Actor=index;e.s4Emerge=.75;e.s4From=actor.from;e.dormant=true;
 e.noticed=true;e.alertT=.3;e.cd=1.15;e.vocal=3;e.phase=index*1.3;
 if(audio.active)audio.creature(e,true);
}
function s4dTick(dt){
 if(!S4D.on||mode!=='playing')return;
 S4D.t+=dt;S4D.clock+=dt;S4D.safeT=Math.max(0,S4D.safeT-dt);
 const phase=S4D.phase,t=S4D.t,span=S4D_DURATIONS[phase];
 if(phase==='walk'){
  const o=S4D.origin,p=s4dEase((t-.4)/3.2);player.x=mix(o.x,61.73,p);player.y=mix(o.y,2.5,s4dEase(t/1.2));
  player.a=angle(o.a+angle(-o.a)*s4dEase(t/.85));player.vx=player.vy=0;
  if(t>.7&&t<3.4&&Math.floor(t/.55)!==Math.floor((t-dt)/.55))audio.play(audio.choose('step',4),{vol:.25,wet:.12});
  if(t>=span)s4dPhase('threshold');
 }else if(phase==='threshold'){
  if(t>=span){s4dOutside();s4dPhase('reveal');}
 }else if(phase==='reveal'){
  player.y=mix(50.3,47,s4dEase(t/1.55));player.x=64;player.a=-Math.PI/2;player.vx=player.vy=0;
  if(t<1.6&&Math.floor(t/.45)!==Math.floor((t-dt)/.45))audio.play(audio.choose('step',4),{vol:.25,wet:.06});
  if(t>=span){S4D.vehicle=s4dCrashPosition(0);s4dPhase('approach');audio.departureEngine();}
 }else if(phase==='approach'){
  S4D.vehicle=s4dCrashPosition(t/span);
  // A small head turn follows the crash while preserving the established view.
  player.a=-Math.PI/2+.12*Math.sin(t/span*Math.PI)-.72*s4dEase((t/span-.33)/.67);if(t>=span)s4dImpact();
 }else if(phase==='impact'){
  S4D.vehicle.x=59.2-Math.sin(t*13)*.17*Math.exp(-t*3);S4D.vehicle.a=Math.sin(t*10)*.035*Math.exp(-t*3);
  S4D.door=s4dEase((t-.6)/1.1);
  if(t>=span){s4dPhase('rearm');audio.reload('end');audio.play('environment0',{vol:.38,rate:.75,pos:{x:61.6,y:43},wet:.17});}
 }else if(phase==='rearm'){
  S4D.door=mix(.55,1,s4dEase(t/span));if(t>=span)s4dFightStart();
 }else if(phase==='fight'){
  S4D.waveT+=dt;
  for(let i=0;i<S4D_CAST.length;i++){const actor=S4D_CAST[i];if(actor.wave===S4D.wave&&S4D.waveT>=actor.at&&!(S4D.spawned&(1<<i))){S4D.spawned|=1<<i;s4dSpawn(actor,i);}}
  for(const e of enemies){if(e.alive&&e.s4Emerge>0){e.s4Emerge=Math.max(0,e.s4Emerge-dt);e.walk+=dt;const out=S4D_CAST[e.s4Actor].out;move(e,out[0]*dt*.55,out[1]*dt*.55);if(!e.s4Emerge)e.dormant=false;}}
  if(S4D.wave===1&&(S4D.spawned&3)===3&&!enemies.some(e=>e.alive)&&S4D.waveT>3){S4D.wave=2;S4D.waveT=-.7;feed('MOVEMENT IN THE TREES.');}
  else if(S4D.wave===2&&S4D.spawned===31&&!enemies.some(e=>e.alive)){
   bullets=bullets.filter(q=>q.owner!=='enemy');s4dPhase('aftermath');audio.departureScoreStop();
   s4qBegin();say('NO WAY OUT.',2.2);
  }
 }
 s4qTick(dt);
 if(s4dLocked()){_safeX=player.x;_safeY=player.y;msgT=feedT=0;shake*=Math.exp(-dt*9);updateEffects(dt);}
 s4dHud();
}
function s4dGunDip(){
 if(!s4dLocked())return 0;
 if(S4D.phase==='walk')return s4dEase(S4D.t/.7)*1.35;
 if(S4D.phase==='rearm')return (1-s4dEase(S4D.t/.7))*1.35;
 return 1.35;
}
function s4dHud(){
 const locked=s4dLocked();document.body.classList.toggle('departure',locked);
 $('sequenceControls').classList.toggle('hidden',!locked||mode!=='playing');
 if(!S4D.on)return;
 $('sequenceSkip').textContent=S4Q.action?'SKIP ACTION · ENTER':'SKIP · ENTER';
 $('sequenceCaption').textContent=({extinguish:'PUTTING OUT THE ENGINE FIRE',move:'CLEARING THE GARDEN ENTRANCE'})[S4D.phase]||({walk:'THE FRONT DOORS',threshold:'',reveal:'NIGHT AIR.',approach:'',impact:'',rearm:'NO WAY OUT.'})[S4D.phase]||'';
 if(S4Q.action)$('sequenceCaption').textContent=(S4Q.action.kind==='extinguish'?'EXTINGUISHING ENGINE FIRE':'CLEARING THE GARDEN WALK')+' · '+Math.min(100,Math.floor(S4D.t/(S4Q.action.kind==='extinguish'?4.15:5.6)*100))+'%';
 if(!s4Running())return;
 const left=enemies.filter(e=>e.alive).length;
 if(S4D.phase==='fight'){
  $('goal').textContent='SURVIVE THE COURTYARD · '+(S4D.wave===1?'THE AMBULANCE':'THE GROUNDS')+' · '+left+' ACTIVE';
  $('lifeHint').textContent=review.active&&!review.damage?'PROTECTED':'KILL TO RESTORE';
  const target=enemies.find(e=>e.alive);if(target){$('compassText').textContent='THREAT';$('compassArrow').style.transform='rotate('+angle(Math.atan2(target.y-player.y,target.x-player.x)-player.a)+'rad)';}
 }else if(S4D.phase==='aftermath'){
  $('goal').textContent='GARDEN BLOCKED · EXPLORE PARKING / BUS ROAD';$('lifeHint').textContent='TAKE A BREATH';
 }
 const nearWreck=!S4Q.on&&S4D.crashed&&Math.hypot(player.x-61.5,player.y-43)<3;
 if(nearWreck&&!locked){$('touchUse').classList.remove('hidden');$('touchUse').textContent='EXAMINE';}
 if(review.active){
  $('reviewBarText').textContent='NO WAY OUT · '+(locked?'DISCHARGE INTERRUPTED':S4D.phase==='fight'?'COURTYARD AMBUSH':'COURTYARD CLEAR');
  $('reviewStatus').textContent=locked?'ENTER / SKIP · ESC PAUSE · T CONTROLS':S4D.phase==='aftermath'?'PHASE 2 COMPLETE · T REVIEW · B REPLAY':'T CONTROLS · B REPLAY · '+(review.ai?'AI ON':'AI OFF')+' / '+(review.damage?'DAMAGE ON':'PROTECTED');
 }
 s4qHud();
}
function s4dInteract(){
 if(S4Q.on)return s4qInteract();
 if(!S4D.on||s4dLocked()||!S4D.crashed||Math.hypot(player.x-61.5,player.y-43)>=3)return false;
 feed('BURNING. THE GARDEN PATH IS BLOCKED.\n'+(review.active?'Moving the wreck is the next development phase.':'Find another way through the grounds.'));return true;
}
function s4dReview(scene){
 s4qReview(scene);
 if(scene==='s4_departure'){
  hwJumpTo('after');reviewPlace(HW_EXIT.x,HW_EXIT.y,0);msgT=feedT=0;hwComplete();
 }else if(scene==='s4_crash'){
  Object.assign(S4D,{on:true,carry:s4dCapture(),vehicle:s4dCrashPosition(0)});reviewPlace(64,47,-Math.PI/2);
  s4dPhase('approach');audio.departureEngine();msgT=feedT=0;
 }else if(scene==='s4_ambush'){
  Object.assign(S4D,{on:true,carry:s4dCapture()});reviewPlace(64,47,-2.29);s4dFightStart();
 }
}
reviewScenes.s4_departure={label:'Discharge — leave the hospital',level:2,chapter:true,hint:'The apparent ending. Click LEAVE HOSPITAL for the walk, bright doors, exterior reveal and crash. Enter or SKIP lands safely after the crash. Explore shows the scene with protected health and inactive combat AI; Combat drill adds the music and active ambush without damage.'};
reviewScenes.s4_crash={label:'Ambulance — the crash',level:3,chapter:true,hint:'Starts as the ambulance approaches from the right. Check the crossing, impact, fire, opening rear doors and weapon return. Then fight the two occupants and three nearby creatures. Pause freezes the sequence.'};
reviewScenes.s4_ambush={label:'Courtyard — post-crash fight',level:3,chapter:true,hint:'Weapon ready, wreck in place, a short reaction window before the first pair emerges. Combat drill is active and protected. Normal has damage and finite ammunition. Death retries this checkpoint; B replays the selected scene. Five enemies total; cleared stays clear.'};
$('sequenceSkip').onclick=s4dSkip;

// SOURCE: exterior-ambulance.js
// Textured vehicle geometry, persistent fire and first-person threshold dressing.
// Original approved ground/sky/architecture stay in the Phase 1 renderer.
const S4_VAN_ART={panels:[],flames:[]};
function s4dSpriteClipped(img,left,top,width,height,d,alpha){
 const x0=Math.max(0,Math.ceil(left)),x1=Math.min(W,Math.ceil(left+width)),y0=Math.max(0,Math.ceil(top)),y1=Math.min(H,Math.ceil(top+height));
 if(x1<=x0||y1<=y0)return;wc.save();wc.beginPath();let visible=0;
 for(let y=y0;y<y1;y++){let start=-1;for(let x=x0;x<=x1;x++){
  const open=x<x1&&S4.depth[y*W+x]>d-.08;if(open&&start<0)start=x;
  if(!open&&start>=0){wc.rect(start,y,x-start,1);visible+=x-start;start=-1;}
 }}
 if(visible){wc.clip();wc.globalAlpha=alpha;wc.drawImage(img,left,top,width,height);}wc.restore();
}
function s4dPrepareVan(img){
 const rects=[[2,2,708,621],[720,2,531,621],[2,632,707,619],[716,632,535,619]];
 S4_VAN_ART.panels=rects.map(([x,y,w,h],i)=>{
  const c=document.createElement('canvas');c.width=i===0?512:256;c.height=256;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,x*img.width/1254,y*img.height/1254,w*img.width/1254,h*img.height/1254,0,0,c.width,c.height);
  return{w:c.width,h:c.height,data:g.getImageData(0,0,c.width,c.height).data};
 });
 const rear=S4_VAN_ART.panels[1];for(let half=0;half<2;half++){
  const data=new Uint8ClampedArray(128*256*4);for(let y=0;y<256;y++)data.set(rear.data.subarray((y*256+half*128)*4,(y*256+half*128+128)*4),y*128*4);
  S4_VAN_ART.panels.push({w:128,h:256,data});
 }
 const cab=S4_VAN_ART.panels[2];for(const [sy,h]of [[0,120],[142,114]]){
  const data=new Uint8ClampedArray(256*h*4);data.set(cab.data.subarray(sy*256*4,(sy+h)*256*4));S4_VAN_ART.panels.push({w:256,h,data});
 }

}
function s4dFireTextures(){
 if(S4_VAN_ART.flames.length)return;
 // Cached, multi-scale turbulent tongues; simulation selects frames (pause holds).
 for(let frame=0;frame<12;frame++){
  const w=96,h=160,data=new Uint8ClampedArray(w*h*4),phase=frame/12*TAU;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const v=1-y/(h-1),u=x/(w-1)*2-1;
   const bend=Math.sin(v*7+phase)*.19*v+Math.sin(v*16-phase*2)*.06;
   const noise=(Math.sin(x*.17+y*.13+phase*2)+Math.sin(x*.37-y*.087-phase)+Math.sin(x*.065-y*.32+phase*3))/3;
   const width=(1-v)*.77+.04,heat=1-Math.abs(u-bend)/(width+.11*noise);
   if(heat<.04||v>.96-.13*(1+noise))continue;
   const hot=clamp(heat*(1-v*.7),0,1),i=(y*w+x)*4;
   data[i]=255;data[i+1]=Math.floor(65+hot*186);data[i+2]=Math.floor(12+Math.pow(hot,3)*211);
   data[i+3]=Math.floor(clamp(heat*3,0,1)*255);
  }
  S4_VAN_ART.flames.push({w,h,data});
 }
}
function s4dVehicleFaces(){
 if(!S4D.vehicle||!s4Running())return;
 s4dSkidMarks();
 const van=S4D.vehicle,c=Math.cos(van.a),s=Math.sin(van.a),panels=S4_VAN_ART.panels;
 const settle=S4D.phase==='impact'?Math.sin(S4D.t*16)*.075*Math.exp(-S4D.t*3.5):S4D.phase==='approach'?Math.sin(S4D.t*25)*.025:0;
 const roll=settings.reduce?0:van.roll||0;
 const point=p=>[van.x+p[0]*c-p[1]*s,van.y+p[0]*s+p[1]*c,Math.max(.01,p[2]+settle+p[1]*roll)];
 const quad=(pts,color,surface=null,emissive=false)=>s4DrawFace({points:pts.map(point),tex:-1,color,surface,u:1,v:1,emissive});
 const box=(x,y,z,w,d,h,col,side=null,front=null,roof=null)=>{
  const a=x-w/2,b=x+w/2,n=y-d/2,f=y+d/2,t=z+h;
  quad([[a,n,z],[b,n,z],[b,n,t],[a,n,t]],col,side);
  quad([[b,f,z],[a,f,z],[a,f,t],[b,f,t]],col,side);
  quad([[a,f,z],[a,n,z],[a,n,t],[a,f,t]],col,front);
  quad([[b,n,z],[b,f,z],[b,f,t],[b,n,t]],col);
  quad([[a,n,t],[b,n,t],[b,f,t],[a,f,t]],col,roof||side);
 };
 const cream=[168,167,143],steel=[73,81,77],red=[100,18,29];
 box(0,0,.21,4.3,2.28,.22,steel);
 // Tall patient box and lower cab are distinct volumes, not a single billboard.
 box(.68,0,.43,2.92,2.36,1.39,cream,panels[0],null,panels[3]);
 box(-1.24,0,.43,1.06,2.12,1.13,cream,panels[3],null,panels[3]);
 box(-1.88,0,.4,.5,2.1,.44,cream,panels[3],null,panels[3]);
 quad([[-1.779,-1.02,.83],[-1.779,1.02,.83],[-1.779,1.02,1.52],[-1.779,-1.02,1.52]],cream,panels[6]);
 quad([[-2.139,-1.02,.42],[-2.139,1.02,.42],[-2.139,1.02,.82],[-2.139,-1.02,.82]],cream,panels[7]);
 // Cab glass, door stripe, mirrors, stepped roof, lamps, bumper.
 for(const y of[-1.068,1.068]){
  quad([[-1.67,y,.94],[-.82,y,.94],[-.82,y,1.46],[-1.48,y,1.46]],[19,38,41]);
  quad([[-1.71,y,.68],[-.78,y,.68],[-.78,y,.86],[-1.71,y,.86]],red);
  box(-.87,y,.9,.17,.032,.032,steel);
  box(-1.54,y*1.11,1.06,.24,.12,.23,[25,32,32]);
 }
 box(-2.18,0,.25,.14,2.32,.16,steel,panels[3]);
 box(2.15,0,.24,.15,2.48,.18,steel,panels[3]);
 for(const yy of[-.76,.76])quad([[-2.257,yy-.19,.53],[-2.257,yy+.19,.53],[-2.257,yy+.19,.7],[-2.257,yy-.19,.7]],[208,211,160],null,true);
 // Eight-sided tyres give the silhouette real depth from any approach.
 for(const x of[-1.35,1.24])for(const y of[-1.23,1.23]){
  const radius=.32,z=.34,ys=[y-.105,y+.105];
  for(let i=0;i<10;i++){
   const a=i/10*TAU,b=(i+1)/10*TAU,xa=x+Math.cos(a)*radius,xb=x+Math.cos(b)*radius,za=z+Math.sin(a)*radius,zb=z+Math.sin(b)*radius;
   quad([[xa,ys[0],za],[xb,ys[0],zb],[xb,ys[1],zb],[xa,ys[1],za]],i%2?[17,21,21]:[28,32,30]);
   for(const side of ys)quad([[x,side,z],[xa,side,za],[xb,side,zb],[x,side,z]],[25,28,28]);
  }
  const side=y+Math.sign(y)*.111;
  for(let i=0;i<10;i++){const a=i/10*TAU,b=(i+1)/10*TAU;
   quad([[x,side,z],[x+Math.cos(a)*.165,side,z+Math.sin(a)*.165],[x+Math.cos(b)*.165,side,z+Math.sin(b)*.165],[x,side,z]],i%2?[93,98,88]:[63,68,61]);
  }
  for(let i=0;i<5;i++)box(x+Math.cos(i/5*TAU)*.1,side,.329+Math.sin(i/5*TAU)*.1,.025,.008,.025,[153,152,128]);
 }
 box(-.71,0,1.62,.34,1.65,.09,steel);
 for(const y of[-.55,.55])box(-.71,y,1.71,.32,.52,.15,[125,17,27]);
 // Rear black opening behind two hinged, textured door leaves.
 quad([[2.153,-1.12,.49],[2.153,1.12,.49],[2.153,1.12,1.74],[2.153,-1.12,1.74]],[10,13,12]);
 for(const side of[-1,1]){
  const swing=S4D.door*1.28,hingeY=side*1.12,freeY=hingeY-side*1.12*Math.cos(swing),freeX=2.17+1.12*Math.sin(swing);
  quad([[2.17,hingeY,.48],[freeX,freeY,.48],[freeX,freeY,1.76],[2.17,hingeY,1.76]],cream,panels[side<0?4:5]);
 }
 if(S4D.crashed){
  // Crumpled gate rail and shards lie at the physical point of impact.
  if(S4Q.on&&(S4Q.moved||S4Q.action?.kind==='move')){const f=[];for(let i=0;i<5;i++)s4qMeshBox(f,57.8-i*.12,42.8+Math.sin(i*3)*.7,.025,1.3-i*.15,.055,.035,[92,110,99]);for(const face of f)s4DrawFace(face);}
  else for(let i=0;i<5;i++)box(-1.4-i*.12,-.2+Math.sin(i*3)*.7,.025,1.3-i*.15,.055,.035,[92,110,99]);
 }
 if(!s4qFireAmount())return;
 s4dFireTextures();
 const clock=settings.reduce?Math.floor(S4D.clock*5)/5:S4D.clock;
 const firePoints=[[-1.94,.76,.82],[-1.78,-.68,.84],[-2.25,.34,.49],[-2.25,-.5,.51],[-1.65,1.09,.65],[-1.58,-1.1,.69],[-1.05,-1,1.5]];
 const ignition=(S4D.phase==='impact'?.22+.78*s4dEase(S4D.t/.48):1)*s4qFireAmount();
 for(let i=0;i<firePoints.length;i++){
  const [x,y,z]=firePoints[i];
  const p=point([x,y,z]),w=(i===6?1.2:.58+(i%2)*.15)*ignition,h=(i===6?3.1:1.4+(i%3)*.28)*(S4Q.action?.kind==='extinguish'?Math.pow(ignition,.35):ignition);
  const ox=-camDY*w/2,oy=camDX*w/2,tex=S4_VAN_ART.flames[(Math.floor(clock*10)+i*3)%12];
  s4DrawFace({points:[[p[0]-ox,p[1]-oy,p[2]],[p[0]+ox,p[1]+oy,p[2]],[p[0]+ox,p[1]+oy,p[2]+h],[p[0]-ox,p[1]-oy,p[2]+h]],tex:-1,color:[255,110,25],surface:tex,u:1,v:1,cutout:true,emissive:true});
 }
}
function s4dSkidMarks(){
 if(!S4_VAN_ART.skids){
  const strips=[];for(let i=5;i<31;i++)for(const side of[-1,1]){
   const a=s4dCrashPosition((i-1)/32),b=s4dCrashPosition(i/32);
   const tire=v=>[v.x+Math.cos(v.a)*1.24-Math.sin(v.a)*side*1.23,v.y+Math.sin(v.a)*1.24+Math.cos(v.a)*side*1.23];
   const p=tire(a),q=tire(b),d=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=-(q[1]-p[1])/(d||1)*.075,ny=(q[0]-p[0])/(d||1)*.075;
   strips.push({t:i/32,points:[[p[0]-nx,p[1]-ny,.014],[q[0]-nx,q[1]-ny,.014],[q[0]+nx,q[1]+ny,.014],[p[0]+nx,p[1]+ny,.014]],tex:-1,color:[14,21,22],u:1,v:1});
  }S4_VAN_ART.skids=strips;
 }
 const progress=S4D.crashed?1:clamp(S4D.t/S4D_DURATIONS.approach,0,1);
 for(const f of S4_VAN_ART.skids)if(f.t<=progress)s4DrawFace(f);
}
function s4dVehicleLight(wx,wy){
 if(!S4D.vehicle||!s4qFireAmount())return 0;
 const v=S4D.vehicle,dx=wx-(v.x-1.85*Math.cos(v.a)),dy=wy-(v.y-1.85*Math.sin(v.a)),d2=dx*dx+dy*dy;
 if(d2>80)return 0;
 return S4D.fireBrightness/(1+d2*.45);
}
function s4dBakeFireLight(){
 if(!S4.fireLight)S4.fireLight=new Float32Array(S4_TW*S4_TH);else S4.fireLight.fill(0);
 if(!S4D.vehicle||!s4qFireAmount())return;
 S4D.fireBrightness=(settings.reduce?.8:.83+.12*Math.sin(S4D.clock*9)+.07*Math.sin(S4D.clock*17))*(S4D.phase==='impact'?s4dEase(S4D.t/.48):1)*s4qFireAmount();
 const v=S4D.vehicle;for(let y=Math.max(0,(v.y-9)*2|0);y<Math.min(S4_TH,(v.y+9)*2);y++)for(let x=Math.max(0,(v.x-11)*2|0);x<Math.min(S4_TW,(v.x+7)*2);x++)S4.fireLight[y*S4_TW+x]=s4dVehicleLight((x+.5)/2,(y+.5)/2);
}
function s4dDrawSmoke(){
 if(!s4Running()||!S4D.vehicle)return;
 const v=S4D.vehicle,clock=S4D.clock;
 // Slow windward smoke remains legible with reduced motion. Depth clips its base.
 const burning=s4qFireAmount()>0,fireAge=S4D.phase==='impact'?S4D.t:S4D.phase==='rearm'?S4D.t+S4D_DURATIONS.impact:10;
 for(let i=burning?10:-1;i>=0;i--){
  const age=((clock*.18+i/11)%1);if(age*5.55>fireAge)continue;
  const x=v.x-1.85+age*.8,y=v.y+.2+Math.sin(i*2.3)*age*.55,z=1.1+age*6.5;
  const p=project(x,y,z);if(!p||!s4Visible(p.x,p.y,p.d,.4))continue;
  const r=Math.max(1,p.scale*(.25+age*.7)),g=wc.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
  g.addColorStop(0,'rgba(24,28,29,'+((1-age)*.28)+')');g.addColorStop(1,'rgba(20,24,25,0)');wc.fillStyle=g;wc.fillRect(p.x-r,p.y-r,r*2,r*2);
 }
 for(const [x,y,z,col,amp]of [[v.x-1.85,v.y,1.25,'#ff7b26',burning?.22:0],[v.x-.71,v.y-.55,1.81,'#ff273c',.3],[v.x-.71,v.y+.55,1.81,'#ff273c',.3]]){
  const p=project(x,y,z);if(p&&s4Visible(p.x,p.y,p.d,.25)){const pulse=settings.reduce?.5:.5+.5*Math.sin(clock*5.4);drawGlow(p.x,p.y,p.scale*.55,col,amp*pulse);}
 }
}
function s4dDoorGlass(){
 if(S4_VAN_ART.doorGlass)return S4_VAN_ART.doorGlass;
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 const white=g.createLinearGradient(0,0,0,256);white.addColorStop(0,'#ffffff');white.addColorStop(.55,'#f9fcff');white.addColorStop(1,'#dfeaf3');g.fillStyle=white;g.fillRect(0,0,256,256);
 const sheen=g.createLinearGradient(0,0,256,0);sheen.addColorStop(0,'rgba(180,201,217,.2)');sheen.addColorStop(.1,'rgba(255,255,255,0)');sheen.addColorStop(.8,'rgba(255,255,255,.45)');sheen.addColorStop(1,'rgba(197,213,226,.24)');g.fillStyle=sheen;g.fillRect(0,0,256,256);
 return S4_VAN_ART.doorGlass=c;
}
function s4dThreshold(){
 if(!hwRunning()||(!HW.resolved&&!HW.ending&&!s4dLocked()))return;
 const p={x:61.94,y:2.5,a:Math.PI/2};meshFaces=[];
 // Recessed white glass, narrow silver frames and slim push bars. The smooth
 // cached surface replaces the old green slab while retaining native depth.
 meshQuad(p,[[-1.4,0,.015],[1.4,0,.015],[1.4,0,1.13],[-1.4,0,1.13]],'#edf5ff',-1,true);
 for(const [a,b]of [[-1.36,-1.18],[-1.145,-.025],[.025,1.145],[1.18,1.36]]){
  meshQuad(p,[[a,-.012,.045],[b,-.012,.045],[b,-.012,1.09],[a,-.012,1.09]],'#ffffff',-1,true);meshFaces[meshFaces.length-1].image=s4dDoorGlass();
 }
 for(const x of[-1.39,-1.165,0,1.165,1.39])meshBox(p,x,-.029,.02,x===0?.024:.032,.045,1.1,'#bdcddc');
 for(const z of[.018,1.095])meshBox(p,0,-.029,z,2.81,.06,.028,'#c9d7e3');
 for(const x of[-.585,.585]){
  meshBox(p,x,-.068,.445,.8,.055,.026,'#afc1d0');
  meshBox(p,x,-.095,.465,.81,.022,.012,'#f6fbff');
 }
 for(const face of meshFaces){face.d=(face.worldPoints[0].x-player.x)*camDX+(face.worldPoints[0].y-player.y)*camDY;face.wallAttached=true;face.emissive=true;drawMeshFace(face);}
 const light=project(61.88,2.5,.65);if(light&&zBuffer[clamp(light.x|0,0,W-1)]>light.d-.1)drawGlow(light.x,light.y,Math.min(W,light.scale*1.7),'#f5faff',.28);
}
function s4dScreen(){
 if(!s4dLocked())return;
 let alpha=S4D.phase==='threshold'?s4dEase(S4D.t/S4D_DURATIONS.threshold):S4D.phase==='reveal'?1-s4dEase(S4D.t/.95):0;
 if(alpha>0){wc.fillStyle='rgba(246,250,255,'+alpha+')';wc.fillRect(0,0,W,H);}
}

// SOURCE: exterior-crash-audio.js
// The approved recordings supply the score, impact body, metal, voices and guns.
// Original cached diesel/fire beds add continuous mass; all route through the
// existing effects/master mix and use the actual AudioContext sample rate.
audio.departureBake=function(){
 if(!this.ctx||this.s4dBuffers)return;
 const rate=this.ctx.sampleRate,make=(kind,seconds)=>{
  const b=this.ctx.createBuffer(1,Math.round(rate*seconds),rate),d=b.getChannelData(0);let seed=kind==='engine'?5191:9127,low=0,mid=0,crack=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.995+n*.005;mid=mid*.87+n*.13;
   if(kind==='engine'){
    const pulse=Math.pow(Math.max(0,Math.sin(TAU*48*t)),5),firing=.55+.45*pulse;
    d[i]=Math.tanh((Math.sin(TAU*48*t)*.22+Math.sin(TAU*96*t)*.1+Math.sin(TAU*144*t)*.05+mid*.65)*firing)*.6+low*.2;
   }else if(kind==='skid'){
    // Tyre scrub under an unstable, abrasive stick-slip squeal.
    const phase=TAU*930*t+.4*Math.sin(TAU*21*t)+.11*Math.sin(TAU*67*t);
    d[i]=(Math.sin(phase)*.14+Math.sin(phase*1.993)*.045+(n-mid)*.15)*(.82+.18*Math.sin(TAU*9*t));
   }else{
    if(n>.9992)crack=.18+Math.abs(mid)*2;crack*=Math.exp(-1/(rate*.006));
    const gust=.75+.16*Math.sin(TAU*t/3)+.09*Math.sin(TAU*t/2);
    d[i]=Math.tanh((low*5.5+mid*.44+(n-mid)*crack)*gust)*.56;
   }
  }
  // Crossfade only the seam, retaining the loop's continuous energy.
  const seam=Math.round(rate*.035);for(let i=0;i<seam;i++){const t=i/seam;d[d.length-seam+i]=d[d.length-seam+i]*(1-t)+d[i]*t;}
  return b;
 };
 this.s4dBuffers={engine:make('engine',3),fire:make('fire',6),skid:make('skid',2)};
};
audio.departureLoop=function(kind){
 if(!this.ctx)return null;this.departureBake();
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),pan=a.createStereoPanner(),send=a.createGain();
 source.buffer=this.s4dBuffers[kind];source.loop=true;filter.type='lowpass';filter.frequency.value=kind==='engine'?2100:5100;gain.gain.value=0;send.gain.value=.08;
 source.connect(filter).connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const voice={source,gain,filter,pan,send,kind};source.onended=()=>{for(const n of[source,gain,filter,pan,send])try{n.disconnect();}catch{}};
 source.start(a.currentTime);return voice;
};
audio.departureEngine=function(){
 if(!this.ctx||!this.active)return;
 if(!this.s4dEngine)this.s4dEngine=this.departureLoop('engine');
 if(!this.s4dSkid)this.s4dSkid=this.departureLoop('skid');
 // The machinery recording supplies a torn mechanical layer, below the engine.
 this.play('machinery',{vol:.36,rate:1.38,pos:{x:76,y:42},wet:.08});
};
audio.departureCrash=function(){
 if(!this.ctx||!this.active)return;
 if(this.s4dEngine){try{this.s4dEngine.source.stop();}catch{}this.s4dEngine=null;}
 if(this.s4dSkid){try{this.s4dSkid.source.stop();}catch{}this.s4dSkid=null;}
 if(!this.s4dFire)this.s4dFire=this.departureLoop('fire');
 const t=this.ctx.currentTime,pos={x:61.6,y:44.5};
 this.play('blast0',{vol:1.06,rate:.72,pos,wet:.31});
 this.play('environment0',{vol:.95,rate:.72,pos,wet:.27});
 this.play('environment1',{vol:.72,rate:.67,at:t+.09,pos,wet:.24});
 this.play('bodyfall',{vol:.75,rate:.57,at:t+.16,pos,wet:.15});
 for(const [delay,vol,rate]of [[.18,.35,.67],[.43,.28,.89],[.76,.2,1.18]])this.play('shell',{vol,rate,at:t+delay,pos,wet:.22});
 this.duck(.1,.75);
};
audio.departureScoreStop=function(){
 if(this.s4dScore){const v=this.s4dScore;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}this.s4dScore=null;}
 if(s4Running()&&this.ctx&&!cbScoreWanted()){this.music.gain.cancelScheduledValues(this.ctx.currentTime);this.music.gain.setValueAtTime(0,this.ctx.currentTime);}
};
audio.departureScore=function(){
 this.departureScoreStop();
};
audio.departureTick=function(){
 if(!s4Running()||!S4D.on||!this.ctx||!this.active||mode!=='playing')return;
 const t=this.ctx.currentTime,v=S4D.vehicle;
 this.departureScore();this.exteriorMix();
 if(v&&s4qFireAmount()>0&&!this.s4dFire)this.s4dFire=this.departureLoop('fire');
 for(const voice of [this.s4dEngine,this.s4dSkid,this.s4dFire]){
  if(!voice||!v)continue;
  const front=voice.kind==='fire'?-1.85:0;
  const dx=v.x+front*Math.cos(v.a)-player.x,dy=v.y+front*Math.sin(v.a)-player.y,d=Math.hypot(dx,dy),side=dy*Math.cos(player.a)-dx*Math.sin(player.a);
  const base=voice.kind==='engine'?(S4Q.action?.kind==='move'?.5:1.25):voice.kind==='skid'?.8*Math.sin(Math.PI*clamp((S4D.t/S4D_DURATIONS.approach-.12)/.88,0,1)):.72*s4qFireAmount();
  voice.gain.gain.setTargetAtTime(base/(1+d*(voice.kind==='engine'?.095:.22)),t,.04);
  voice.pan.pan.setTargetAtTime(clamp(side/(d+.1),-.9,.9),t,.03);
  voice.filter.frequency.setTargetAtTime((voice.kind==='engine'?3000:6200)/(1+d*.055),t,.05);
  if(voice.kind==='engine')voice.source.playbackRate.setTargetAtTime(S4Q.action?.kind==='move'?.8:1.2+.37*Math.sin(clamp(S4D.t/S4D_DURATIONS.approach,0,1)*Math.PI),t,.035);
 }
 // Keep the existing exertion and critical-health body cues in outdoor combat.
 if(!s4dLocked()&&player.hp<38&&t-this.lastHeart>(player.hp<20?.48:.64)){this.lastHeart=t;this.play('heartbeat',{vol:(1-player.hp/65)*.55,wet:0});}
 if(!s4dLocked()&&player.hp<45&&t-this.lastBreath>(player.hp<25?2.1:4.3)&&t>this.painUntil+.5){this.lastBreath=t;this.play(this.choose('breath',3),{vol:player.hp<25?.64:.32,wet:.06});}
};
audio.departureStop=function(){
 this.departureScoreStop();for(const key of['s4dEngine','s4dSkid','s4dFire']){const v=this[key];if(v)try{v.source.stop();}catch{}this[key]=null;}
};
const s4dPreviousAudioTick=audio.tick.bind(audio);
audio.tick=function(dt){s4dPreviousAudioTick(dt);this.departureTick();};
const s4dPreviousAudioReset=audio.reset.bind(audio);
audio.reset=function(){this.departureStop();s4dPreviousAudioReset();};
const s4dPreviousAudioEnd=audio.end.bind(audio);
audio.end=function(won){if(S4D.on)this.departureScoreStop();s4dPreviousAudioEnd(won);};
const s4dPreviousAudioStart=audio.start.bind(audio);
audio.start=function(){if(S4D.on&&mode!=='playing')this.departureScoreStop();s4dPreviousAudioStart();};

// SOURCE: exterior-quest.js
// Phase 3: one authored expedition, with persistent branch and resource state.
// Quest snapshots live inside the departure checkpoint; scene replay is explicit.
const s4qFresh=()=>({on:false,keys:false,ext:false,fire:true,moved:false,gate:false,
 awake:0,parkClear:false,busClear:false,supplies:0,clock:0,steam:0,action:null,
 lastZone:'',visited:[],done:false,checkpointLabel:'COURTYARD CLEAR'});
const S4Q=s4qFresh();
const S4Q_KEYS={x:95.76,y:79.65},S4Q_EXT={x:137.08,y:5.36};
const S4Q_WALK=[[99.8,64],[104,58],[104,47],[103,38],[106,30],[107,21]];
const S4Q_GATE={x:104,y:56.5};
const S4Q_PARKED={x:66,y:42,a:0,alive:true};
const S4Q_CAST=[
 {x:87,y:68.2,type:1,group:0,branch:'park'},
 {x:91,y:68.6,type:0,group:0,branch:'park'},
 {x:95.1,y:74.1,type:2,group:1,branch:'park'},
 {x:99.2,y:72.9,type:0,group:1,branch:'park'},
 {x:86.9,y:74.1,type:1,group:1,branch:'park'},
 {x:94.8,y:82.2,type:0,group:2,branch:'park'},
 {x:99.1,y:81.9,type:2,group:2,branch:'park'},
 {x:91.7,y:82.8,type:1,group:2,branch:'park'},
 {x:132.6,y:13.4,type:2,group:3,branch:'bus'},
 {x:137.4,y:9.7,type:0,group:3,branch:'bus'},
 {x:132.9,y:7.4,type:1,group:4,branch:'bus'},
 {x:138.8,y:7.4,type:0,group:4,branch:'bus'}
];
const S4Q_SUPPLIES=[
 {x:63.9,y:49.2,label:'OPEN COURTYARD FIRST AID',hp:35,ammo:[4,18,1]},
 {x:98.9,y:76.1,label:'OPEN STAFF EMERGENCY SUPPLY',hp:25,ammo:[6,24,2]},
 {x:131.9,y:8.9,label:'OPEN ROADSIDE FIRST AID',hp:35,ammo:[4,18,1]}
];
function s4qReset(){Object.assign(S4Q,s4qFresh());$('questInventory').classList.add('hidden');audio.questStop?.();}
function s4qRunning(){return s4Running()&&S4D.on&&S4Q.on;}
function s4qSnapshot(){return {...S4Q,visited:[...S4Q.visited],action:null};}
function s4qSave(label){if(!s4qRunning()||S4Q.action||mode!=='playing')return;if(label)S4Q.checkpointLabel=label;s4dSave();}
function s4qBegin(){
 if(S4Q.on)return;
 Object.assign(S4Q,s4qFresh(),{on:true});review.done=false;s4qApplyGate();
 for(let i=0;i<S4Q_CAST.length;i++){
  const a=S4Q_CAST[i],e=spawn(a.x,a.y,a.type);e.s4Quest=a.branch;e.s4Group=a.group;e.s4QuestId=i;
  e.dormant=true;e.noticed=false;e.cd=1.4;e.vocal=4;e.phase=i*1.37;
 }
 s4qSave('COURTYARD CLEAR');feed('SPARE KEYS: STAFF CAR 04, PARKING.\nEXTINGUISHER: BUS SHELTER. CHOOSE YOUR ROUTE.');
}
function s4qWake(group){
 if(S4Q.awake&(1<<group))return;
 S4Q.awake|=1<<group;
 const actors=enemies.filter(e=>e.alive&&e.s4Quest&&e.s4Group===group);
 for(const e of actors){e.dormant=false;e.noticed=true;e.alertT=.5;e.cd=Math.max(e.cd,1.1);e.vocal=3.5;}
 if(actors.length&&audio.active)audio.creature(actors[0],true);
 if(group===0)feed('SOMETHING UNDER THE CARS.');
 if(group===3)feed('THE LAST SERVICE IS STILL HERE.');
}
function s4qThreats(){
 if(!s4qRunning())return [];
 return enemies.filter(e=>e.alive&&e.s4Quest&&!e.dormant&&Math.hypot(e.x-player.x,e.y-player.y)<19);
}
function s4qCombat(){return s4qRunning()&&!S4Q.action&&s4qThreats().length>0;}
function s4qProgress(){
 if(!s4qRunning())return;
 for(const [branch,key,label]of [['park','parkClear','PARKING CLEAR'],['bus','busClear','BUS ROAD CLEAR']]){
  if(!S4Q[key]&&!enemies.some(e=>e.alive&&e.s4Quest===branch)){
   S4Q[key]=true;feed(label+'\nTHE RETURN WALK WILL STAY QUIET.');
  }
 }
 s4qSave();
}
function s4qCanReach(p,range=2.3,cone=.9){
 const dx=p.x-player.x,dy=p.y-player.y,d=Math.hypot(dx,dy);
 return d<range&&(d<.32||Math.abs(angle(Math.atan2(dy,dx)-player.a))<cone)&&
  (d<.25||s4CastRay(player.x,player.y,dx/d,dy/d,Math.max(0,d-.14)).d>=d-.15);
}
function s4qNearby(){
 if(!s4qRunning()||s4dLocked())return null;
 const q=[];
 if(!S4Q.keys)q.push({...S4Q_KEYS,kind:'keys',label:'TAKE AMBULANCE KEYS',touch:'KEYS'});
 if(!S4Q.ext)q.push({...S4Q_EXT,kind:'ext',label:'TAKE FIRE EXTINGUISHER',touch:'TAKE'});
 if(!S4Q.gate)q.push({x:S4Q_GATE.x,y:S4Q_GATE.y+(player.y>S4Q_GATE.y?.18:-.18),kind:'gate',label:'UNLATCH SERVICE WALK',touch:'OPEN'});
 S4Q_SUPPLIES.forEach((p,i)=>{if(!(S4Q.supplies&(1<<i)))q.push({...p,kind:'supply',index:i,touch:'SUPPLY'});});
 if(!S4Q.moved)q.push({x:61.72,y:43,kind:'wreck',label:S4Q.fire?(S4Q.ext?'EXTINGUISH ENGINE FIRE':'EXAMINE AMBULANCE'):(S4Q.keys?'START AND MOVE AMBULANCE':'EXAMINE AMBULANCE'),touch:S4Q.fire&&S4Q.ext?'DOUSE':!S4Q.fire&&S4Q.keys?'MOVE':'EXAMINE'});
 return q.filter(p=>s4qCanReach(p,p.kind==='wreck'?5:2.3)).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]||null;
}
function s4qInteract(){
 const p=s4qNearby();if(!p)return false;
 if(p.kind==='keys'||p.kind==='ext'){
  S4Q[p.kind]=true;audio.pickup();audio.play('shell',{vol:.23,rate:p.kind==='keys'?1.65:.65,wet:.06,pos:p});
  s4qSave(p.kind==='keys'?'AMBULANCE KEYS SECURED':'EXTINGUISHER SECURED');
  say(p.kind==='keys'?'AMBULANCE KEYS.':'FIRE EXTINGUISHER.',1.7);
  feed((S4Q.keys&&S4Q.ext?'BOTH ITEMS SECURED. RETURN TO THE WRECK.':p.kind==='keys'?'NEXT: THE BUS SHELTER EXTINGUISHER.':'NEXT: STAFF CAR 04 IN PARKING.')+'\nTHE SIGNED SERVICE WALK LINKS BOTH ROUTES.');
 }else if(p.kind==='gate'){
  S4Q.gate=true;s4qApplyGate();audio.play('environment0',{vol:.42,rate:1.1,pos:p,wet:.08});s4qSave('SERVICE WALK UNLATCHED');feed('SERVICE WALK OPEN\nPARKING ↔ CITY ROAD');
 }else if(p.kind==='supply'){
  const supply=S4Q_SUPPLIES[p.index];
  if(player.hp>=100&&guns.every(g=>g.reserve>=g.maxReserve)){feed('YOU ARE FULLY SUPPLIED. LEAVE IT FOR THE RETURN.');return true;}
  S4Q.supplies|=1<<p.index;player.hp=Math.min(100,player.hp+supply.hp);
  guns.forEach((g,i)=>g.reserve=Math.min(g.maxReserve,g.reserve+supply.ammo[i]));
  audio.pickup();s4qSave('EMERGENCY SUPPLY USED');feed('FIRST AID +'+supply.hp+' · AMMUNITION\nONE USE. THE EMPTY CASE STAYS EMPTY.');
 }else if(p.kind==='wreck'){
  if(S4Q.fire&&!S4Q.ext)feed('ENGINE FIRE. CANNOT GET INSIDE.\nEXTINGUISHER AT THE BUS SHELTER.\nSPARE KEYS IN STAFF CAR 04, PARKING.');
  else if(!S4Q.fire&&!S4Q.keys)feed('THE FIRE IS OUT. IGNITION LOCKED.\nSPARE KEYS IN STAFF CAR 04, PARKING.');
  else if(enemies.some(e=>e.alive&&!e.dormant&&Math.hypot(e.x-64,e.y-43)<17)||bullets.some(b=>b.owner==='enemy'&&Math.hypot(b.x-player.x,b.y-player.y)<15))feed('CLEAR THE NEARBY THREATS FIRST.');
  else s4qStartAction(S4Q.fire?'extinguish':'move');
 }
 hudUpdate();return true;
}
function s4qVehicleBox(v){
 const c=Math.abs(Math.cos(v.a)),s=Math.abs(Math.sin(v.a)),hx=c*2.25+s*1.35,hy=s*2.25+c*1.35;
 return{x0:v.x-hx,x1:v.x+hx,y0:v.y-hy,y1:v.y+hy,kind:'ambulance'};
}
function s4qNavigation(){
 for(let y=38;y<=45;y++)for(let x=56;x<=75;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 buildFlow();
}
function s4qApplyVehicle(){
 S4.solids=S4.solids.filter(b=>b.kind!=='ambulance');
 if(S4Q.moved)S4D.vehicle={...S4Q_PARKED};
 S4.solids.push(s4qVehicleBox(S4D.vehicle));s4qNavigation();
}
function s4qMovePosition(t){
 // Reverse straight out of the crushed hedge, then steer into the wider court edge.
 const progress=s4dEase(t);
 if(progress<.54)return{x:mix(59.2,64.7,progress/.54),y:43,a:0,alive:true};
 const v=(progress-.54)/.46,u=1-v;
 const x=u*u*u*64.7+3*u*u*v*65+3*u*v*v*65.1+v*v*v*66;
 const y=u*u*u*43+3*u*u*v*43+3*u*v*v*42+v*v*v*42;
 const dx=3*u*u*.3+6*u*v*.1+3*v*v*.9,dy=6*u*v*(-1);
 return{x,y,a:Math.atan2(dy,dx),alive:true};
}
function s4qStartAction(kind){
 s4qSave();S4Q.action={kind,origin:{x:player.x,y:player.y,a:player.a}};
 releaseInputs();player.vx=player.vy=0;shotCD=reloadT=reloadDuration=dashT=meleeT=muzzle=recoil=0;
 if(kind==='move')reviewPlace(64,47,-2.29);
 s4dPhase(kind);audio.questAction(kind);hudUpdate();
}
function s4qActionFinish(){
 if(!S4Q.action)return false;
 const kind=S4Q.action.kind;
 if(kind==='extinguish'){S4Q.fire=false;S4Q.steam=3;audio.questFireOut();}
 else{S4Q.moved=true;S4D.door=0;s4qApplyVehicle();audio.questVehicleStop();}
 S4Q.action=null;S4D.safeT=1.1;releaseInputs();player.vx=player.vy=0;weaponDrop=.2;
 s4dPhase('aftermath');s4qSave(kind==='extinguish'?'ENGINE FIRE EXTINGUISHED':'GARDEN PATH OPEN');
 say(kind==='extinguish'?'THE FIRE IS OUT.':'THE WAY IS OPEN.',1.8);
 feed(kind==='extinguish'?(S4Q.keys?'USE THE KEYS TO MOVE THE AMBULANCE.':'FIND THE SPARE KEYS IN STAFF CAR 04.'):'FOLLOW THE LIVING HEDGE TO THE GARDEN.');return true;
}
function s4qFireAmount(){return !S4D.crashed?0:!S4Q.on?1:!S4Q.fire?0:S4Q.action?.kind==='extinguish'?1-s4dEase((S4D.t-.75)/3.2)*.98:1;}
function s4qTick(dt){
 if(!s4qRunning()||mode!=='playing')return;
 S4Q.clock+=dt;S4Q.steam=Math.max(0,S4Q.steam-dt);
 if(S4Q.action){
  if(S4Q.action.kind==='move'){
   S4D.door=1-s4dEase(S4D.t/.55);S4D.vehicle=s4qMovePosition((S4D.t-.65)/4.6);
   S4.solids=S4.solids.filter(b=>b.kind!=='ambulance');S4.solids.push(s4qVehicleBox(S4D.vehicle));
   player.a=mix(-2.29,Math.atan2(S4D.vehicle.y-player.y,S4D.vehicle.x-player.x),s4dEase(S4D.t/1.4));
   if(S4D.t>=5.6)s4qActionFinish();
  }else{
   const o=S4Q.action.origin,p=s4dEase(S4D.t/.7);
   player.x=mix(o.x,64,p);player.y=mix(o.y,47,p);player.a=o.a+angle(-2.29-o.a)*p;player.vx=player.vy=0;
   if(S4D.t>=4.15)s4qActionFinish();
  }
  return;
 }
 for(const e of enemies){
  if(!e.alive||!e.s4Quest||!e.dormant||e.s4Group===4)continue;
  const d=Math.hypot(e.x-player.x,e.y-player.y);
  if(d<(e.s4Quest==='park'?8:12)&&lineOfSight(e.x,e.y,player.x,player.y))s4qWake(e.s4Group);
 }
 // The second bus pair leaves cover only when the player commits to the shelter.
 if(player.x>130&&player.y<10.3)s4qWake(4);
 const zone=s4Zone();
 if(zone!==S4Q.lastZone){S4Q.lastZone=zone;if(!S4Q.visited.includes(zone))S4Q.visited.push(zone);s4qSave();}
 if(S4Q.moved&&!S4Q.done&&player.x<51&&player.y<35){
  S4Q.done=true;review.done=false;s4qSave('GARDEN FIELD REACHED');say('SOMETHING GUARDS THE GATES.',2);
 }
 if(S4Q.done&&!CB.on)cbfJourneyBegin();
}
function s4qHud(){
 const active=s4qRunning();$('questInventory').classList.toggle('hidden',!active);if(!active)return;
 $('questKeys').textContent=(S4Q.keys?'✓ ':'○ ')+'KEYS';$('questExt').textContent=(S4Q.ext?'✓ ':'○ ')+'EXTINGUISHER';
 $('questKeys').classList.toggle('found',S4Q.keys);$('questExt').classList.toggle('found',S4Q.ext);
 const near=s4qNearby(),sign=s4dLocked()?null:s4NearbyLabel(),threats=s4qThreats();
 let goal=S4Q.moved?'FOLLOW THE HEDGE WALK TO THE GARDEN':S4Q.keys&&S4Q.ext?'RETURN TO THE AMBULANCE':S4Q.keys?'FIND THE BUS SHELTER EXTINGUISHER':S4Q.ext?'FIND STAFF CAR 04 · PARKING':'KEYS IN PARKING · EXTINGUISHER AT BUS STOP';
 if(S4Q.done)goal='THE GUARDIAN BLOCKS THE GATES';
 if(S4Q.action)goal=(S4Q.action.kind==='extinguish'?'EXTINGUISHING ENGINE FIRE':'CLEARING THE GARDEN WALK')+' · '+Math.min(100,Math.floor(S4D.t/(S4Q.action.kind==='extinguish'?4.15:5.6)*100))+'%';
 $('goal').textContent=near?'[E] '+near.label:sign?'[E] '+sign.interact:goal;
 $('lifeHint').textContent=threats.length?(review.active&&!review.damage?'PROTECTED':'KILL TO RESTORE'):'TAKE A BREATH';
 $('touchUse').classList.toggle('hidden',!near&&!sign);$('touchUse').textContent=near?near.touch:'READ';
 // Guide along roads, never straight through the dense forest.
 let target,label;
 if(S4Q.moved){target={x:56.5,y:39};label='GARDEN';if(player.x<57&&player.y<40)target={x:43,y:26};}
 else if(S4Q.keys&&S4Q.ext){target={x:64,y:43};label='WRECK';}
 else if(player.x>80&&player.y>61&&!S4Q.keys){target=S4Q_KEYS;label='STAFF 04';}
 else if(player.x>130&&player.y<18&&!S4Q.ext){target=S4Q_EXT;label='SHELTER';}
 else{target=null;label=S4Q.keys?'BUS ROAD':S4Q.ext?'PARKING':'CHOOSE A ROUTE';}
 $('compassText').textContent=label;$('compassArrow').style.visibility=target?'visible':'hidden';
 if(target){
  let p=target;
  // A landmark arrow is useful only while the landmark is visible. The physical
  // road signs guide the long woodland legs, without pointing through tree walls.
  if(!lineOfSight(player.x,player.y,target.x,target.y)){p=null;$('compassText').textContent='FOLLOW THE SIGNS';}
  $('compassArrow').style.visibility=p?'visible':'hidden';if(p)$('compassArrow').style.transform='rotate('+angle(Math.atan2(p.y-player.y,p.x-player.x)-player.a)+'rad)';
 }
 if(review.active){$('reviewBarText').textContent='NO WAY OUT · '+(S4Q.done?'GARDEN APPROACH OPEN':S4Q.action?'AMBULANCE RECOVERY':'TWO WAYS FORWARD');$('reviewStatus').textContent='T CONTROLS · B REPLAY · '+(review.damage?'DAMAGE ON':'PROTECTED')+(S4Q.done?' · THE GUARDIAN WAITS':'');}
}
function s4qReview(scene){
 if(!['s4_quest','s4_keys','s4_extinguisher','s4_recovery','s4_open'].includes(scene))return;
 Object.assign(S4D,{on:true,carry:s4dCapture(),phase:'aftermath',door:1,wave:2,spawned:31,safeT:1.8});s4dPlaceWreck();s4qBegin();
 const poses={s4_quest:[64,47,-1.57],s4_keys:[84,63,1.02],s4_extinguisher:[129.8,17,-.82],s4_recovery:[63.8,43,Math.PI],s4_open:[56.5,40,-Math.PI/2]};
 reviewPlace(...poses[scene]);
 if(scene==='s4_recovery'||scene==='s4_open'){
  enemies=[];S4Q.keys=S4Q.ext=S4Q.parkClear=S4Q.busClear=S4Q.gate=true;S4Q.awake=31;s4qApplyGate();
 }
 if(scene==='s4_open'){S4Q.fire=false;S4Q.moved=true;S4D.door=0;s4qApplyVehicle();}
 msgT=feedT=0;s4qSave('PHASE 3 REVIEW START');hudUpdate();
}
for(const [id,label,hint]of [
 ['s4_quest','Recovery expedition — either order','The courtyard is already clear. Find the keys in marked staff car 04 and the extinguisher inside the bus shelter. Either order works. E or the contextual touch button picks up, opens and operates. The service walk connects the two branches.'],
 ['s4_keys','Parking — the spare keys','At the parking entrance. Eight creatures in three local groups, car cover and a clearly marked staff vehicle. Kill or evade them. Clearances and supplies persist. Look for the service walk at the northeast corner.'],
 ['s4_extinguisher','Bus station — emergency cabinet','Near the final road bend. Four creatures, exposed sightlines and shelter cover. The extinguisher sits in the red cabinet inside the shelter. The signed service walk on the return road leads to parking.'],
 ['s4_recovery','Ambulance — douse and move','Both items already carried and all branch enemies cleared. Face the rear of the wreck: E extinguishes the engine, then E starts the reverse out of the garden entrance. Pause during either action. Check the clear path and the parked vehicle collision.'],
 ['s4_open','Garden — after the recovery','Wreck already moved, both branches clear. Follow the hedge walkway into the garden field and inspect the open route. The separate Seraphim review scenes now test the toy calmly; Cerberus combat is still a later phase.']
 ])reviewScenes[id]={label,level:3,chapter:true,hint};

// SOURCE: exterior-quest-world.js
// Native 3D props extend the existing world renderer; signs stay on physical faces.
// Shared materials and original hospital, forest, lake and creature artwork are retained.
const S4Q_ART={};
const S4Q_WORLD={faces:null,key:''};
function s4qBuildProps(){
 S4Q_WORLD.faces=null;S4Q_WORLD.key='';s4qDressCars();
 // Staff car: a lit open driver's door, a numbered bay and matching ambulance ID.
 s4Box(95.87,79.85,.3,.07,1.28,.55,-1,[61,81,71],true);
 s4Quad([[95.87,79.21,.82],[95.87,80.49,.82],[95.87,80.49,1.12],[95.87,79.21,1.12]],-1,[19,45,47]);
 s4Box(97,80.1,1.02,.53,.23,.07,-1,[131,86,31]);
 s4Label(97,78.54,.57,'04',.58,{h:.17,front:[0,-1],color:'#eedfb0'});
 s4Box(98.1,77.9,0,.075,.075,1.92,7,[42,61,58],true);
 s4Label(98.1,77.9,1.66,'AMBULANCE 04\nON-CALL DRIVER',2.15,{h:.64,front:[0,-1],interact:'READ THE STAFF BAY',read:'AMBULANCE 04 — ON-CALL DRIVER\nSpare keys are hanging from the open driver’s door.'});
 S4.lamps.push({x:96,y:79.4,z:1.05,color:[235,186,100]});
 // Emergency cabinet at the shelter, to the right of the bench so it is reachable.
 s4Box(137.08,5.04,.45,.7,.25,1.02,7,[111,29,33]);
 s4Quad([[136.78,5.178,.51],[137.38,5.178,.51],[137.38,5.178,1.39],[136.78,5.178,1.39]],-1,[17,24,25]);
 for(const x of[136.73,137.43])s4Box(x,5.21,.45,.055,.075,1.02,-1,[145,36,43]);
 s4Label(137.08,5.19,1.62,'FIRE\nEXTINGUISHER',.83,{h:.35,front:[0,1],color:'#fff0d0'});
 s4Box(137.08,5.14,1.86,.86,.19,.075,-1,[191,232,207]);
 S4.lamps.push({x:137.08,y:5.6,z:1.85,color:[177,219,196]});
 // Physical supply cases: E leaves a full case alone and empty cases stay empty.
 for(const p of S4Q_SUPPLIES){
  s4Box(p.x,p.y,.02,.66,.43,.25,7,[79,87,73]);
  s4Label(p.x,p.y-.23,.19,'FIRST AID',.57,{h:.14,front:[0,-1],color:'#e4edc8'});
  s4Label(p.x,p.y+.23,.19,'FIRST AID',.57,{h:.14,front:[0,1],color:'#e4edc8'});
 }
 // A narrow, winding maintenance footpath links the already separated regions.
 // The forest edge and floor share this exact route; no gaps or invisible passage.
 for(const [x,y]of [[102.8,59],[105.2,47],[104.5,37],[107.7,28]]){
  s4Box(x,y,0,.1,.1,.82,7,[39,56,48]);s4Box(x,y,.76,.2,.2,.08,-1,[163,185,129]);
  S4.lamps.push({x,y,z:.8,color:[128,153,112]});
 }
 s4RoadSign(100.2,65.5,'SERVICE WALK →','SERVICE WALK →\nA footpath through the woods to the city road and bus station.',[-1,0],2.6,1.3);
 s4RoadSign(109.8,23.1,'PARKING / SERVICE WALK ↓','PARKING / SERVICE WALK\nFollow the low lamps south through the forest.',[-.65,-.76],3,1.35);
 s4Label(109.8,23.1,1.35,'BUS STATION →',3,{front:[.65,.76],h:.4,interact:'READ THE SERVICE SIGN',read:'BUS STATION →\nFollow the city road to the right.'});
 for(const x of[102.08,105.92])s4Box(x,56.5,0,.12,.15,1.36,7,[63,79,65],true);
 s4Label(104,56.5,1.6,'SERVICE WALK',2.75,{h:.3,front:[0,1]});
 s4Label(104,56.5,1.6,'SERVICE WALK',2.75,{h:.3,front:[0,-1]});
 for(const f of S4.faces)if(f.cx===undefined){const xs=f.points.map(p=>p[0]),ys=f.points.map(p=>p[1]);f.cx=(Math.min(...xs)+Math.max(...xs))/2;f.cy=(Math.min(...ys)+Math.max(...ys))/2;f.radius=Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))/2;}
}
function s4qApplyGate(){
 S4.solids=S4.solids.filter(b=>b.kind!=='serviceGate');
 if(S4Q.on&&!S4Q.gate)S4.solids.push({x0:102.08,x1:105.92,y0:56.44,y1:56.56,kind:'serviceGate'});
 for(let y=55;y<=57;y++)for(let x=102;x<=105;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;
 S4Q_WORLD.faces=null;buildFlow();
}
function s4qMeshBox(faces,x,y,z,w,d,h,color,emissive=false){
 const a=x-w/2,b=x+w/2,n=y-d/2,s=y+d/2,t=z+h;
 for(const points of[
  [[a,n,z],[b,n,z],[b,n,t],[a,n,t]],[[b,s,z],[a,s,z],[a,s,t],[b,s,t]],
  [[a,s,z],[a,n,z],[a,n,t],[a,s,t]],[[b,n,z],[b,s,z],[b,s,t],[b,n,t]],
  [[a,n,t],[b,n,t],[b,s,t],[a,s,t]]])faces.push({points,tex:-1,color,u:1,v:1,emissive,cx:x,cy:y,radius:Math.hypot(w,d)/2});
}
function s4qCanister(faces,x,y,z,scale=1){
 const r=.12*scale,h=.59*scale;
 for(let i=0;i<12;i++){
  const a=i/12*TAU,b=(i+1)/12*TAU,xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r,xx2=x+Math.cos(b)*r,yy2=y+Math.sin(b)*r;
  faces.push({points:[[xx,yy,z],[xx2,yy2,z],[xx2,yy2,z+h],[xx,yy,z+h]],tex:-1,color:i%3?[153,35,39]:[196,57,49],surface:S4Q_ART.extinguisher,u:S4Q_ART.extinguisher?1/12:1,u0:S4Q_ART.extinguisher?((i+3)%12)/12:0,v:1});
  faces.push({points:[[xx,yy,z+h],[xx2,yy2,z+h],[x,y,z+h+.075*scale],[x,y,z+h+.075*scale]],tex:-1,color:[111,31,33],u:1,v:1});
 }
 s4qMeshBox(faces,x,y,z+h+.05*scale,.045*scale,.045*scale,.1*scale,[163,166,140]);
 s4qMeshBox(faces,x+.055*scale,y,z+h+.14*scale,.24*scale,.055*scale,.033*scale,[38,44,41]);
 s4qMeshBox(faces,x+.17*scale,y,z+.18*scale,.04*scale,.05*scale,.48*scale,[19,28,28]);
 s4qMeshBox(faces,x+.2*scale,y,z+.1*scale,.07*scale,.08*scale,.14*scale,[33,41,37]);
 // The prepared wrap carries the worn instruction label around the cylinder.
}
function s4qWorldFaces(){
 if(!s4qRunning())return;
 const key=[S4Q.keys,S4Q.ext,S4Q.supplies,S4Q.gate,S4Q.fire].join('|');
 if(!S4Q_WORLD.faces||key!==S4Q_WORLD.key){
  S4Q_WORLD.key=key;const f=S4Q_WORLD.faces=[];
  if(!S4Q.keys){
   const {x,y}=S4Q_KEYS;
   for(let i=0;i<12;i++){
    const a=i/12*TAU,b=(i+1)/12*TAU;
    f.push({points:[[x,y+Math.cos(a)*.083,.97+Math.sin(a)*.083],[x,y+Math.cos(b)*.083,.97+Math.sin(b)*.083],[x,y+Math.cos(b)*.062,.97+Math.sin(b)*.062],[x,y+Math.cos(a)*.062,.97+Math.sin(a)*.062]],tex:-1,color:[218,216,152],u:1,v:1,emissive:true});
   }
   s4qMeshBox(f,x,y-.03,.68,.045,.055,.24,[183,183,150]);
   for(const z of[.69,.735,.78])s4qMeshBox(f,x,y-.065,z,.045,.06,.025,[196,199,163]);
   s4qMeshBox(f,x,y+.1,.74,.045,.14,.19,[168,99,35]);
  }
  if(!S4Q.ext)s4qCanister(f,S4Q_EXT.x,S4Q_EXT.y,.58);
  if(!S4Q.gate){
   for(const z of[.2,.92])s4qMeshBox(f,104,56.5,z,3.8,.085,.065,[87,101,77]);
   for(let x=102.2;x<105.9;x+=.32)s4qMeshBox(f,x,56.5,.2,.038,.065,.78,[53,72,60]);
  }else{
   // The actual gate remains visible, folded alongside the path.
   for(const z of[.2,.92])s4qMeshBox(f,102.08,54.6,z,.085,3.8,.065,[87,101,77]);
  }
  S4Q_SUPPLIES.forEach((p,i)=>{
   const open=!!(S4Q.supplies&(1<<i));
   s4qMeshBox(f,p.x,p.y-(open?.19:0),open?.27:.28,.67,open?.04:.44,open?.38:.04,open?[41,54,44]:[124,147,99]);
   if(!open){s4qMeshBox(f,p.x,p.y,.325,.26,.07,.009,[224,234,181]);s4qMeshBox(f,p.x,p.y,.326,.07,.26,.009,[224,234,181]);}
  });
  if(!S4Q.fire){
   // Chalky extinguisher residue stays at the crash site after the van leaves.
   for(let i=0;i<9;i++)s4qMeshBox(f,57.3+Math.sin(i*4)*.6,43+Math.cos(i*2.7)*.9,.016,.32,.34,.003,[148,153,126]);
  }
 }
 for(const f of S4Q_WORLD.faces)s4DrawFace(f);
 if(S4Q.action?.kind==='extinguish'){
  const f=[],x=player.x+camDX*.65-camDY*.27,y=player.y+camDY*.65+camDX*.27;
  s4qCanister(f,x,y,-.22,.9);for(const face of f)s4DrawFace(face);
 }
}
function s4qAtmosphere(){
 if(!s4qRunning())return;
 if(!S4Q.keys){const p=project(S4Q_KEYS.x,S4Q_KEYS.y,.95);if(p&&s4Visible(p.x,p.y,p.d,.12))drawGlow(p.x,p.y,p.scale*.18,'#fff0a2',.34);}
 if(!S4Q.ext){const p=project(S4Q_EXT.x,S4Q_EXT.y,1.05);if(p&&s4Visible(p.x,p.y,p.d,.2))drawGlow(p.x,p.y,p.scale*.2,'#fff0d0',.15);}
 const spraying=S4Q.action?.kind==='extinguish'&&S4D.t>.75;
 if(!spraying&&S4Q.steam<=0)return;
 // Short, depth-clipped foam pulses arch over the patient box onto the engine.
 const clock=S4Q.clock;
 for(let i=0;i<(settings.reduce?8:18);i++){
  const t=(clock*.85+i/18)%1;
  let x=57.45+Math.sin(i*2.5)*t*.45,y=43+Math.cos(i*3)*t*.75,z=1.2+t*2;
  if(spraying){x=mix(player.x+camDX*.65-camDY*.27,57.4,t);y=mix(player.y+camDY*.65+camDX*.27,43,t);z=.7+Math.sin(t*Math.PI)*2.05+t*.35;}
  const p=project(x,y,z);if(!p)continue;
  const r=Math.max(1,p.scale*(spraying?.025+t*.14:.15+t*.22));
  if(!s4Visible(p.x,p.y,p.d,.12))continue;
  wc.fillStyle='rgba(221,232,201,'+((spraying?.26:.17)*Math.min(1,spraying?1:S4Q.steam)*(.6+.4*t))+')';
  wc.beginPath();wc.arc(p.x,p.y,r,0,TAU);wc.fill();
 }
}

function s4qPrepareAtlas(img){
 const tiles={lower:[2,249,623,266,512,192],glass:[106,98,450,140,384,128],front:[632,358,617,190,384,160],windshield:[655,24,566,155,384,128],extinguisher:[3,630,619,620,256,256],steel:[637,641,604,600,256,256],door:[114,248,216,256,192,256]};
 for(const [name,[x,y,w,h,cw,ch]]of Object.entries(tiles)){
  const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,x*img.width/1254,y*img.height/1254,w*img.width/1254,h*img.height/1254,0,0,cw,ch);S4Q_ART[name]={w:cw,h:ch,data:g.getImageData(0,0,cw,ch).data};
 }
}
function s4qDressCars(){
 const cars=[[97,80]];
 const panel=(points,key)=>{const f=s4Quad(points,-1,[54,75,67]);f.surface=S4Q_ART[key];};
 for(const [x,y]of cars){
  for(const side of[-1,1]){
   const xx=x+side*.827;
   panel([[xx,y-1.425,.14],[xx,y+1.425,.14],[xx,y+1.425,.603],[xx,y-1.425,.603]],'lower');
   const glassX=x+side*.722;
   panel([[glassX,y-.56,.603],[glassX,y+.8,.603],[glassX,y+.8,.98],[glassX,y-.56,.98]],'glass');
  }
  panel([[x-.825,y-1.431,.14],[x+.825,y-1.431,.14],[x+.825,y-1.431,.602],[x-.825,y-1.431,.602]],'front');
  panel([[x+.63,y-.572,.68],[x-.63,y-.572,.68],[x-.63,y-.572,.94],[x+.63,y-.572,.94]],'windshield');
  panel([[x-.825,y-1.425,.602],[x+.825,y-1.425,.602],[x+.825,y+1.425,.602],[x-.825,y+1.425,.602]],'steel');
  panel([[x-.72,y-.56,.982],[x+.72,y-.56,.982],[x+.72,y+.8,.982],[x-.72,y+.8,.982]],'steel');
 }
 // One door stands ajar in the numbered bay, with the actual keys on its outside.
 panel([[95.832,79.21,.3],[95.832,80.49,.3],[95.832,80.49,.82],[95.832,79.21,.82]],'door');
 panel([[95.869,79.21,.82],[95.869,80.49,.82],[95.869,80.49,1.12],[95.869,79.21,1.12]],'glass');
}

function s4qPrepareParking(img){
 const xs=[3,365,727,1090,1446],ys=[3,365,716,1084],names=['redSide','redFront','redRear','redPaint','blueSide','blueFront','blueRear','bluePaint','wheel','sideGlass','windGlass','rearGlass'];
 for(let i=0;i<12;i++){
  const col=i%4,row=Math.floor(i/4),c=document.createElement('canvas');c.width=c.height=256;
  const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,xs[col],ys[row],xs[col+1]-xs[col]-5,ys[row+1]-ys[row]-5,0,0,256,256);
  const data=g.getImageData(0,0,256,256).data;
  // The circular wheel mesh uses the atlas as a cutout material.
  if(i===8)for(let y=0;y<256;y++)for(let x=0;x<256;x++)if((x-128)**2+(y-128)**2>125**2)data[(y*256+x)*4+3]=0;
  S4Q_ART[names[i]]={w:256,h:256,data};
 }
}
function s4qParkingCar(x,y,variant){
 const wagon=variant===1,prefix=variant%2?'blue':'red',roof= wagon?1.12:1.04,rear=wagon?.92:.5;
 // The original footprint is retained, including the encounter cover lanes.
 S4.solids.push({x0:x-.825,x1:x+.825,y0:y-1.425,y1:y+1.425});
 const panel=(p,key,flip=false,cutout=false)=>{const f=s4Quad(p.map(([a,b,c])=>[x+a,y+b,c]),-1,[48,58,60]);f.surface=S4Q_ART[key];f.u=flip?-1:1;f.u0=flip?1:0;f.cutout=cutout;};
 panel([[-.825,-1.425,.17],[.825,-1.425,.17],[.825,-1.425,.58],[-.825,-1.425,.58]],prefix+'Front');
 panel([[.825,1.425,.17],[-.825,1.425,.17],[-.825,1.425,.59],[.825,1.425,.59]],prefix+'Rear');
 panel([[-.825,-1.425,.58],[.825,-1.425,.58],[.825,-.64,.69],[-.825,-.64,.69]],prefix+'Paint');
 panel([[-.825,-.64,.69],[.825,-.64,.69],[.68,-.22,roof],[-.68,-.22,roof]],'windGlass');
 panel([[-.68,-.22,roof],[.68,-.22,roof],[.68,rear,roof],[-.68,rear,roof]],prefix+'Paint');
 panel([[-.68,rear,roof],[.68,rear,roof],[.825,1.25,.65],[-.825,1.25,.65]],'rearGlass');
 panel([[-.825,1.25,.65],[.825,1.25,.65],[.825,1.425,.59],[-.825,1.425,.59]],prefix+'Paint');
 for(const s of [-1,1]){
  panel([[s*.825,-1.425,.17],[s*.825,1.425,.17],[s*.825,1.425,.66],[s*.825,-1.425,.66]],prefix+'Side',s>0);
  panel([[s*.825,-.64,.66],[s*.825,1.25,.66],[s*.68,rear,roof],[s*.68,-.22,roof]],'sideGlass',s>0);
  for(const yy of [-.91,.96]){
   const xx=s*.846,r=.27,z=.29;
   panel([[xx,yy-r,z-r],[xx,yy+r,z-r],[xx,yy+r,z+r],[xx,yy-r,z+r]],'wheel',s<0,true);
   for(let n=0;n<8;n++){
    const a=n*TAU/8,b=(n+1)*TAU/8;
    s4Quad([[x+xx,y+yy+Math.cos(a)*r,z+Math.sin(a)*r],[x+xx-s*.16,y+yy+Math.cos(a)*r,z+Math.sin(a)*r],[x+xx-s*.16,y+yy+Math.cos(b)*r,z+Math.sin(b)*r],[x+xx,y+yy+Math.cos(b)*r,z+Math.sin(b)*r]],-1,[17,20,22]);
   }
  }
 }
}

// SOURCE: exterior-quest-audio.js
// Local branch sounds, not a second global ambience or a replacement score.
audio.questBake=function(){
 if(!this.ctx||this.s4qBuffers)return;
 const rate=this.ctx.sampleRate,make=kind=>{
  const seconds=kind==='hiss'?4:6,b=this.ctx.createBuffer(1,rate*seconds,rate),d=b.getChannelData(0);let seed=4817,low=0,mid=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.998+n*.002;mid=mid*.85+n*.15;
   if(kind==='hiss')d[i]=Math.tanh((mid*.7+(n-mid)*.2+low*.5)*1.4)*(.84+.08*Math.sin(t*TAU*7));
   else if(kind==='hum')d[i]=Math.sin(t*TAU*60)*.065+Math.sin(t*TAU*120)*.025+(n-mid)*.003;
   else{const pulse=Math.pow(Math.max(0,Math.sin(t*TAU*.5)),4);d[i]=(Math.sin(TAU*415*t+2*Math.sin(TAU*2*t))*.15+Math.sin(TAU*207.5*t)*.07)*pulse;}
  }
  const seam=Math.round(rate*.02);for(let i=0;i<seam;i++){const u=i/seam;d[d.length-seam+i]=d[d.length-seam+i]*(1-u)+d[i]*u;}return b;
 };
 this.s4qBuffers={hiss:make('hiss'),hum:make('hum'),alarm:make('alarm')};
};
audio.questLoop=function(kind,pos){
 this.questBake();const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.s4qBuffers[kind];source.loop=true;gain.gain.value=0;filter.type='lowpass';filter.frequency.value=6000;send.gain.value=kind==='hum'?.16:.065;
 source.connect(filter).connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const v={source,gain,pan,filter,send,kind,pos};source.onended=()=>{for(const n of[source,gain,pan,filter,send])try{n.disconnect();}catch{}};source.start(a.currentTime);return v;
};
audio.questAction=function(kind){
 if(!this.ctx||!this.active)return;
 this.departureScoreStop();
 if(kind==='extinguish'){
  if(!this.s4qHiss)this.s4qHiss=this.questLoop('hiss',{x:player.x,y:player.y});
  this.play('shell',{vol:.37,rate:1.2,wet:.035});this.play('effort0',{vol:.26,wet:.05});
 }else{
  if(!this.s4dEngine)this.s4dEngine=this.departureLoop('engine');
  this.play('machinery',{vol:.45,rate:.8,pos:S4D.vehicle,wet:.1});this.play('environment0',{vol:.36,rate:.9,pos:S4D.vehicle,wet:.08});
 }
};
audio.questFireOut=function(){
 for(const key of['s4qHiss','s4dFire']){const v=this[key];if(v)try{v.source.stop();}catch{}this[key]=null;}
};
audio.questVehicleStop=function(){
 if(this.s4dEngine)try{this.s4dEngine.source.stop();}catch{}this.s4dEngine=null;
 if(this.active)this.play('environment1',{vol:.32,rate:.85,pos:S4D.vehicle,wet:.06});
};
audio.questTick=function(){
 if(!s4qRunning()||!this.ctx||!this.active||mode!=='playing')return;
 const t=this.ctx.currentTime;
 this.s4qNodes=this.s4qNodes||[];
 if(!this.s4qNodes.length){this.s4qNodes.push(this.questLoop('alarm',{x:97,y:80}),this.questLoop('hum',{x:135,y:5.8}));this.s4qNext=5;}
 for(const v of this.s4qNodes){
  const dx=v.pos.x-player.x,dy=v.pos.y-player.y,d=Math.hypot(dx,dy),blocked=d<27&&!lineOfSight(player.x,player.y,v.pos.x,v.pos.y);
  const base=v.kind==='alarm'?(S4Q.keys?.035:.46):.52;
  v.gain.gain.setTargetAtTime(d>27?0:base/(1+d*.25)*(blocked?.22:1),t,.25);
  v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.9,.9),t,.12);
  v.filter.frequency.setTargetAtTime(blocked?800:v.kind==='hum'?2100:3500,t,.16);
 }
 if(this.s4qHiss){this.s4qHiss.gain.gain.setTargetAtTime(S4Q.action?.kind==='extinguish'&&S4D.t>.75?.78:0,t,.035);this.s4qHiss.pan.pan.setTargetAtTime(.2,t,.06);}
 if(S4Q.clock>=this.s4qNext){
  this.s4qNext=S4Q.clock+9+(Math.floor(S4Q.clock)%7);
  if(S4.zone==='PARKING LOT'&&!S4Q.parkClear)this.play('shell',{vol:.32,rate:.62,pos:{x:93,y:71},wet:.22});
  if(S4.zone==='BUS STATION'&&!S4Q.busClear)this.play('environment2',{vol:.24,rate:.72,pos:{x:135,y:5.8},wet:.16});
 }
};
audio.questStop=function(){
 for(const v of[...(this.s4qNodes||[]),this.s4qHiss])if(v)try{v.source.stop();}catch{}
 this.s4qNodes=[];this.s4qHiss=null;this.s4qNext=5;
};
const s4qPreviousTick=audio.tick.bind(audio),s4qPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt){s4qPreviousTick(dt);this.questTick();};
audio.reset=function(){this.questStop();s4qPreviousReset();};

// SOURCE: seraphim.js
// Phase 4 is a protected fixture, not an early activation of the campaign boss.
// The canonical object owns every location. Guns remain exactly three guns.
const S4T_ITEM={name:'WOUNDED SERAPHIM',color:'#efdb9e',rgb:[239,219,158],ammo:'',reserve:''};
const s4tFresh=()=>({on:false,phase:'ground',x:40.2,y:29.3,z:.27,vx:0,vy:0,vz:0,
 clock:0,flight:0,settle:0,returnT:0,throwT:0,gunReturnT:0,throwLatch:false,previousGun:0,
 origin:{x:42,y:31},safe:{x:40.2,y:29.3},facing:0,
 pickups:0,lands:0,waters:0,returns:0,voiceAt:2.8,proxy:null});
const S4T=s4tFresh();
const S4T_RUNTIME={checkpoint:null,obstacles:[],nav:null};
function s4tRunning(){return s4Running()&&S4T.on;}
function s4tCarried(){return s4tRunning()&&S4T.phase==='carried';}
function equippedItem(){return weapon===3?S4T_ITEM:guns[weapon];}
function s4tReset(){
 if(weapon===3)weapon=S4T.previousGun;
 Object.assign(S4T,s4tFresh());Object.assign(S4T_RUNTIME,{checkpoint:null,obstacles:[],nav:null});
 document.body.classList.remove('seraphim-held');$('slot3').classList.add('hidden');$('touchFire').textContent='FIRE';
 audio.seraphimStop?.();
}
function s4tEquip(){
 if(!s4tCarried()){if(s4tRunning())feed('THE SERAPHIM IS NOT IN YOUR HANDS. FOLLOW ITS LIGHT.');return false;}
 changeWeapon(3);return true;
}
function s4tNear(){
 return s4tRunning()&&S4T.phase==='ground'&&s4qCanReach(S4T,2.35,1.0);
}
function s4tInteract(){
 if(!s4tNear())return false;
 S4T.previousGun=weapon<3?weapon:S4T.previousGun;S4T.phase='carried';S4T.pickups++;
 S4T.throwT=0;S4T.gunReturnT=0;S4T.returnT=0;S4T.proxy&&(S4T.proxy.phase='idle');
 reloadT=reloadDuration=muzzle=meleeT=0;changeWeapon(3);audio.seraphimCue('lift');
 feed('STILL ALIVE.\n4 TO HOLD · FIRE TO THROW · 1–3 FOR GUNS');cbfToyReaction('lift');hudUpdate();return true;
}
function s4tThrow(){
 if(!s4tCarried()||mode!=='playing'||S4T.throwLatch||shotCD>0)return false;
 const a=player.a,pitch=clamp(aimPitch/H,-.1,.1);
 S4T.origin={x:player.x,y:player.y};S4T.safe={...S4T.origin};
 Object.assign(S4T,{phase:'airborne',x:player.x,y:player.y,z:.72,
  vx:Math.cos(a)*8.2,vy:Math.sin(a)*8.2,vz:3.15+pitch*7,
  facing:a,flight:0,throwT:.32,gunReturnT:1.35,throwLatch:true,returnT:0});
 mouseFire=false;keys.KeyF=false;reloadT=reloadDuration=recoil=muzzle=0;shotCD=.5;
 audio.seraphimCue('throw');hudUpdate();return true;
}
function s4tReleaseTrigger(){S4T.throwLatch=false;}
function s4tBuildCollision(){
 // Recover actual top heights from the existing geometry without changing it.
 const bounds=S4.faces.map(f=>({x0:Math.min(...f.points.map(p=>p[0])),x1:Math.max(...f.points.map(p=>p[0])),
  y0:Math.min(...f.points.map(p=>p[1])),y1:Math.max(...f.points.map(p=>p[1])),z:Math.max(...f.points.map(p=>p[2]))}));
 S4T_RUNTIME.obstacles=S4.solids.map(b=>{
  let top=b.kind==='forest'?12:b.kind==='hedge'?2.8:.9;
  for(const f of bounds)if(f.x0>=b.x0-.08&&f.x1<=b.x1+.08&&f.y0>=b.y0-.08&&f.y1<=b.y1+.08)top=Math.max(top,f.z);
  return{...b,top};
 });
}
function s4tBlocked(x,y,z,r=.16){
 if(s4Outside(x,y)&&!s4Pond(x,y))return true;
 return S4T_RUNTIME.obstacles.some(b=>z-r<b.top&&x+r>b.x0&&x-r<b.x1&&y+r>b.y0&&y-r<b.y1);
}
function s4tSafePoint(p){
 if(fits(p.x,p.y,.24))return {...p};
 // Search close to the release point, never return inside a hedge or under a car.
 for(let r=.3;r<=3;r+=.3)for(let i=0;i<24;i++){
  const x=p.x+Math.cos(i*TAU/24)*r,y=p.y+Math.sin(i*TAU/24)*r;
  if(fits(x,y,.24)&&s4qCanReach({x,y},200,Math.PI))return{x,y};
 }
 return{x:42,y:31};
}
function s4tReturn(reason='THE LIGHT RETURNS TO THE BANK.'){
 const p=s4tSafePoint(S4T.safe||S4T.origin);Object.assign(S4T,p,{phase:'ground',z:.27,vx:0,vy:0,vz:0,returnT:0,settle:.5});
 S4T.returns++;if(S4T.proxy)Object.assign(S4T.proxy,{x:43,y:24.5,a:Math.PI/2,phase:'idle',route:[],index:0,wait:0});audio.seraphimCue('return');feed(reason+'\nE TO RECOVER.');
}
function s4tLand(){
 S4T.vx=S4T.vy=S4T.vz=0;
 if(s4Pond(S4T.x,S4T.y)){
  S4T.phase='water';S4T.z=.08;S4T.waters++;S4T.returnT=3.2;
  audio.seraphimCue('water');
  if(cbfWaterLanding()){hudUpdate();return;}
  if(S4T.proxy){
   const route=s4tPlanRoute(S4T);
   if(route){Object.assign(S4T.proxy,{phase:'walk',route,index:0,wait:0});S4T.returnT=0;feed('WATER LANDING · WATCH THE LARGE FOOTPRINT REACH THE BANK.');}
   else{S4T.proxy.phase='blocked';feed('NO CLEAR LARGE-BODY ROUTE.\nTHE TOY WILL RETURN; THE GATES STAY CLOSED.');}
  }else feed('WATER LANDING.\nREVIEW: THE TOY RETURNS TO THE BANK IN A MOMENT.');
 }else if(fits(S4T.x,S4T.y,.24)){
  S4T.phase='ground';S4T.z=.27;S4T.settle=.45;S4T.safe={x:S4T.x,y:S4T.y};S4T.lands++;
  audio.seraphimCue('land');feed('A BROKEN LITTLE BREATH.\nTHE LIGHT MARKS WHERE IT LANDED.');cbfToyReaction('land');
 }else s4tReturn('THE THROW COULD NOT BE RECOVERED THERE.');
 if(!cbRunning())review.done=S4T.pickups>0&&S4T.lands>0&&S4T.waters>0;hudUpdate();
}
function s4tTick(dt){
 if(!s4tRunning()||mode!=='playing')return;
 S4T.clock+=dt;S4T.settle=Math.max(0,S4T.settle-dt);
 S4T.throwT=Math.max(0,S4T.throwT-dt);
 if(S4T.gunReturnT>0){S4T.gunReturnT=Math.max(0,S4T.gunReturnT-dt);if(!S4T.gunReturnT&&weapon===3){weapon=S4T.previousGun;weaponDrop=.16;hudUpdate();}}
 if(S4T.phase==='carried'){S4T.x=player.x;S4T.y=player.y;S4T.z=.62;}
 else if(S4T.phase==='airborne'){
  // Small, deterministic substeps prevent fast throws tunnelling through thin rails.
  let left=dt;while(left>1e-8&&S4T.phase==='airborne'){
   const h=Math.min(left,1/120);left-=h;S4T.flight+=h;
   const x=S4T.x+S4T.vx*h,y=S4T.y+S4T.vy*h,z=S4T.z+S4T.vz*h-3.75*h*h;
   S4T.vz-=7.5*h;
   if(s4tBlocked(x,S4T.y,z)){S4T.vx*=-.25;S4T.vy*=.55;}else S4T.x=x;
   if(s4tBlocked(S4T.x,y,z)){S4T.vy*=-.25;S4T.vx*=.55;}else S4T.y=y;
   S4T.z=z;
   // Merely crossing water in mid-air is never a successful water landing.
   if(z<=.27)s4tLand();else if(S4T.flight>3)s4tReturn('THE TOY RETURNS TO REACHABLE GROUND.');
  }
 }
 if(S4T.proxy)s4tProxyTick(dt);
 if(S4T.returnT>0){S4T.returnT=Math.max(0,S4T.returnT-dt);if(!S4T.returnT)s4tReturn();}
 audio.seraphimTick();
}
function s4tSnapshot(){return JSON.parse(JSON.stringify(S4T));}
function s4tSave(notify=true){
 if(!s4tRunning()||cbRunning())return false;
 S4T_RUNTIME.checkpoint={toy:s4tSnapshot(),carry:s4dCapture(),player:{...player},stageTime,scene:review.scene,
  shotCD,reloadT,reloadDuration,dashT,dashCD,meleeT,meleeCD,weaponDrop,bob,aimPitch,
  bullets:bullets.map(b=>({...b})),done:review.done};
 if(notify){$('reviewAudioStatus').textContent='Seraphim checkpoint captured: '+S4T.phase+'. Restore repeats this exact state.';feed('SERAPHIM CHECKPOINT CAPTURED.');}
 reviewSync();return true;
}
function s4tRestore(){
 const c=S4T_RUNTIME.checkpoint;if(!c)return false;
 // Reload the same fixture, then replace its single toy with the captured state.
 reviewLoad(c.scene);Object.assign(S4T,JSON.parse(JSON.stringify(c.toy)));S4T.throwLatch=false;
 s4dCarry(c.carry);Object.assign(player,c.player);_safeX=player.x;_safeY=player.y;
 ({stageTime,shotCD,reloadT,reloadDuration,dashT,dashCD,meleeT,meleeCD,weaponDrop,bob,aimPitch}=c);
 bullets=c.bullets.map(b=>({...b}));review.done=c.done;S4T_RUNTIME.checkpoint=c;
 releaseInputs();audio.seraphimStop();hudUpdate();feed('SERAPHIM CHECKPOINT · '+S4T.phase.toUpperCase());return true;
}
function s4tHud(){
 const on=s4tRunning(),held=s4tCarried(),selected=on&&weapon===3;
 $('slot3').classList.toggle('hidden',!held);$('slot3').classList.toggle('active',selected);
 document.body.classList.toggle('seraphim-held',selected);$('touchFire').textContent=selected?'THROW':'FIRE';
 if(!on)return;
 const near=s4tNear();if(!cbRunning())$('lifeHint').textContent='PROTECTED';
 $('goal').textContent=near?'[E] LIFT THE WOUNDED SERAPHIM':held?(selected?'FIRE TO THROW · 1–3 GUNS':'4 TO HOLD THE SERAPHIM · ITS LIGHT FOLLOWS YOU'):S4T.phase==='airborne'?'FOLLOW THE FALLING LIGHT':S4T.phase==='water'?'WATER LANDED · REVIEW RETURN PENDING':'FOLLOW THE HOLY LIGHT';
 if(selected){$('ammo').textContent='';$('reserve').textContent='';}
 $('touchUse').classList.toggle('hidden',!near&&!s4NearbyLabel());$('touchUse').textContent=near?'LIFT':'READ';
 $('compassText').textContent=held?'CARRIED':S4T.phase==='water'?'IN THE WATER':'SERAPHIM';
 const dx=S4T.x-player.x,dy=S4T.y-player.y,d=Math.hypot(dx,dy);
 const visible=!held&&d>.2&&s4CastRay(player.x,player.y,dx/d,dy/d,d).d>=d-.15;
 $('compassArrow').style.visibility=visible?'visible':'hidden';
 if(visible)$('compassArrow').style.transform='rotate('+angle(Math.atan2(dy,dx)-player.a)+'rad)';
 $('reviewBarText').textContent='THE STOLEN SERAPHIM · CALM INTERACTION REVIEW';
 $('reviewStatus').textContent=S4T.proxy?'LARGE FOOTPRINT: '+S4T.proxy.phase.toUpperCase()+' · MOVEMENT TEST ONLY · T CONTROLS':'E LIFT · 4 HOLD · FIRE THROW · T CHECKPOINT · B RESET';
}
function s4tReview(scene){
 if(!['s4_toy','s4_toy_carry','s4_toy_west','s4_toy_route'].includes(scene))return;
 Object.assign(S4T,s4tFresh(),{on:true,previousGun:weapon});enemies=[];drops=[];bullets=[];
 const poses={s4_toy:[42,31.4,-1.85],s4_toy_carry:[35,32.5,Math.PI/2],s4_toy_west:[25.3,28.5,Math.PI],s4_toy_route:[39,32.5,1.84]};
 reviewPlace(...poses[scene]);S4T.safe={x:player.x,y:player.y};S4T.origin={...S4T.safe};
 if(scene!=='s4_toy'){S4T.phase='carried';S4T.x=player.x;S4T.y=player.y;S4T.pickups=1;weapon=3;weaponDrop=.15;}
 if(scene==='s4_toy_route')S4T.proxy={x:43,y:24.5,a:Math.PI/2,r:1.55,phase:'idle',route:[],index:0,wait:0};
 s4tBuildCollision();if(S4T.proxy)s4tBuildNav();
 msgT=feedT=0;s4tSave(false);hudUpdate();
}
for(const [id,label,hint]of [
 ['s4_toy','Seraphim — lift the fallen light','A calm garden test. Walk toward the light and press E, or LIFT on touch. 4 holds the creature; FIRE throws it. Wheel/GUN cycles the carried fourth slot. Land throws stay recoverable. All four seraphim scenes remain protected, even with Normal selected.'],
 ['s4_toy_carry','Seraphim — held at the hospital bay','Already in your hands, facing the near water. Throw on grass and recover it; switch all three guns and return with 4. The holy light stays with you while carrying it. No ammo, reload or damage belongs to the toy. Water throws return to your bank after a short review hold.'],
 ['s4_toy_west','Seraphim — the western bank','Already carrying the creature by the large western lake. Try different banks and oblique throws. Only a landing in water counts; crossing water in the air does not. Bad throws return to reachable ground. T lets you capture and restore the exact state, including mid-flight.'],
 ['s4_toy_route','Seraphim — large guardian route proof','The wire cage marks a 3.1-unit-wide, nonattacking guardian footprint. It is a navigation proxy, not Cerberus artwork. A water landing asks it to reach a clear bank and enter the water. Test from different points along the shore; the toy then returns. No attacks, drowning, victory or gate opening is enabled.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

// SOURCE: seraphim-world.js
const S4T_ART={front:null,back:null,hands:null};
function s4tPrepareArt(img){
 // Atlas panels retain genuine alpha. Scaling/cropping only; no colour-key removal.
 for(const [key,x,y,w,h,dw,dh]of [['front',0,0,627,598,384,366],['back',627,0,627,600,384,367],['hands',0,600,1254,654,960,501]]){
  const image=document.createElement('canvas');image.width=dw;image.height=dh;
  const c=image.getContext('2d',{willReadFrequently:true});c.drawImage(img,x,y,w,h,0,0,dw,dh);
  S4T_ART[key]={image,w:dw,h:dh,data:c.getImageData(0,0,dw,dh).data};
 }
}
function s4tWorldFaces(){
 if(!s4tRunning())return;
 if(S4T.phase!=='carried'&&S4T.phase!=='mouth'){
  const t=S4T.clock,w=.73,h=.70*(1+(settings.reduce?0:.012*Math.sin(t*2.1))),
   z=S4T.z-.27+(S4T.phase==='ground'?Math.sin(S4T.settle*17)*S4T.settle*.014:0),ox=-camDY*w/2,oy=camDX*w/2;
  const rear=Math.cos(Math.atan2(player.y-S4T.y,player.x-S4T.x)-S4T.facing)<-.35;
  const art=rear?S4T_ART.back:S4T_ART.front;
  if(art)s4DrawFace({points:[[S4T.x-ox,S4T.y-oy,z],[S4T.x+ox,S4T.y+oy,z],[S4T.x+ox,S4T.y+oy,z+h],[S4T.x-ox,S4T.y-oy,z+h]],
   surface:art,tex:-1,color:[219,210,169],u:1,v:1,emissive:true,cutout:true});
 }
 const p=S4T.proxy;if(!p)return;
 const faces=[],color=p.phase==='walk'?[149,189,174]:[93,128,137],r=p.r;
 // A technical wire volume makes the development boundary unmistakable.
 for(const z of[.05,2.15])for(let i=0;i<16;i++){
  const a=i*TAU/16,b=(i+1)*TAU/16;
  faces.push({points:[[p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,z],[p.x+Math.cos(b)*r,p.y+Math.sin(b)*r,z],
   [p.x+Math.cos(b)*r,p.y+Math.sin(b)*r,z+.035],[p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,z+.035]],tex:-1,color,u:1,v:1,emissive:true});
 }
 for(let i=0;i<8;i++){const a=i*TAU/8;s4qMeshBox(faces,p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,.05,.035,.035,2.1,color,true);}
 for(const f of faces)s4DrawFace(f);
}
function s4tLightPosition(){if(S4T.phase==='mouth')return cbfMouthPoint();return s4tCarried()?{x:player.x,y:player.y,z:.5}:S4T;}
function s4tAtmosphere(){
 if(!s4tRunning())return;
 const p=s4tLightPosition(),carried=s4tCarried();if(S4T.phase==='mouth'&&p.z<.06)return;
 if(carried){
  // Illumination falls onto the carrier, not an opaque stripe over the reticle.
  wc.save();const g=wc.createLinearGradient(0,0,0,H*.34);g.addColorStop(0,'rgba(248,234,180,.09)');g.addColorStop(1,'rgba(248,234,180,0)');
  wc.fillStyle=g;wc.fillRect(0,0,W,H*.34);wc.restore();return;
 }
 const d=(p.x-player.x)*camDX+(p.y-player.y)*camDY;if(d<.1||d>75)return;
 const base=project(p.x,p.y,Math.max(.15,p.z)),top=project(p.x,p.y,12);if(!base||!top)return;
 const span=Math.min(W*.22,Math.max(2,base.scale*.43)),x0=Math.max(0,Math.floor(base.x-span)),x1=Math.min(W-1,Math.ceil(base.x+span));
 const y0=Math.max(0,Math.floor(top.y)),y1=Math.min(H-1,Math.ceil(base.y));
 // Per-pixel occlusion keeps light behind the hospital, trees and gate posts.
 if(x1<x0||y1<y0)return;
 const img=wc.getImageData(x0,y0,x1-x0+1,y1-y0+1);
 const data=img.data,width=x1-x0+1;
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
  if(!s4Visible(x,y,d,.28))continue;
  const cross=(x+.5-base.x)/span,soft=Math.exp(-cross*cross*5),vertical=.65+.35*(y-y0)/Math.max(1,y1-y0),alpha=soft*.29*vertical;
  const i=((y-y0)*width+x-x0)*4;data[i]+=alpha*220;data[i+1]+=alpha*193;data[i+2]+=alpha*130;
 }
 wc.putImageData(img,x0,y0);
 if(s4Visible(base.x,base.y,d,.35))drawGlow(base.x,base.y,Math.min(30,base.scale*.32),'#f0dda9',.21);
 // Small drifting motes, with simulation time so pause also stills the light.
 for(let i=0;i<9;i++){
  const a=i*2.399,t=settings.reduce?0:S4T.clock,z=.2+((i*.37+t*.09)%2.8),v=project(p.x+Math.cos(a+t*.13)*.24,p.y+Math.sin(a+t*.13)*.24,z);
  if(v&&s4Visible(v.x,v.y,v.d,.05)){wc.fillStyle='#ddd3a38c';wc.fillRect(v.x,v.y,1,1);}
 }
 if(S4T.phase==='water'){
  wc.save();wc.strokeStyle='#d8debb';wc.globalAlpha=.3;wc.lineWidth=1;
  for(let j=0;j<3;j++){const r=.25+((S4T.clock*.32+j*.4)%1.3);wc.beginPath();let started=false;
   for(let k=0;k<=40;k++){const a=k/40*TAU,v=project(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,.03);if(!v||!s4Visible(v.x,v.y,v.d,.1)){started=false;continue;}if(!started){wc.moveTo(v.x,v.y);started=true;}else wc.lineTo(v.x,v.y);}wc.stroke();}
  wc.restore();
 }
}
function s4tRenderHands(){
 const art=S4T_ART.hands;if(!s4tRunning()||!art)return;
 const carried=s4tCarried();if(!carried&&S4T.throwT<=0)return;const out=carried?0:1-S4T.throwT/.32;
 // Width is capped as well as height: portrait hands never swallow the viewport.
 const w=Math.min(W*.88,H*1.1),h=w*art.h/art.w,moving=settings.reduce?0:Math.min(1,Math.hypot(player.vx,player.vy)/4.65);
 const breath=settings.reduce?0:Math.sin(S4T.clock*2.1)*h*.005;
 const x=W/2+(settings.reduce?0:Math.sin(bob)*moving*2-sway*3),y=H+h*.02+breath+weaponDrop*h*1.4+out*h*1.35;
 wc.save();wc.translate(x,y);if(!settings.reduce)wc.rotate(Math.sin(bob)*moving*.004);
 wc.drawImage(art.image,-w/2,-h,w,h);wc.restore();
}

// Deliberately bounded large-body routing proof. It has no combat or score hooks.
const S4T_NAV={x:22,y:20,w:73,h:53,step:.5,r:1.55};
function s4tProxyFree(x,y,water=false){
 const r=S4T_NAV.r;if(s4Outside(x-r,y-r)||s4Outside(x+r,y+r))return false;
 for(const b of S4.solids){
  const dx=x-clamp(x,b.x0,b.x1),dy=y-clamp(y,b.y0,b.y1);
  if(dx*dx+dy*dy<(r+.03)**2)return false;
 }
 if(!water){if(s4Pond(x,y))return false;for(let i=0;i<24;i++)if(s4Pond(x+Math.cos(i*TAU/24)*(r+.035),y+Math.sin(i*TAU/24)*(r+.035)))return false;}
 return true;
}
function s4tProxySweep(a,b,water=false){
 const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.18));
 for(let i=0;i<=steps;i++)if(!s4tProxyFree(mix(a.x,b.x,i/steps),mix(a.y,b.y,i/steps),water))return false;
 return true;
}
function s4tBuildNav(){
 const n=S4T_NAV,cells=new Uint8Array(n.w*n.h);
 for(let y=0;y<n.h;y++)for(let x=0;x<n.w;x++)cells[y*n.w+x]=s4tProxyFree(n.x+x*n.step,n.y+y*n.step)?1:0;
 S4T_RUNTIME.nav=cells;
}
function s4tPlanRoute(target,p=S4T.proxy){
 const n=S4T_NAV,grid=S4T_RUNTIME.nav;if(!grid||!p)return null;
 const point=i=>({x:n.x+(i%n.w)*n.step,y:n.y+Math.floor(i/n.w)*n.step,water:false});
 const id=(x,y)=>{const gx=Math.round((x-n.x)/n.step),gy=Math.round((y-n.y)/n.step);return gx<0||gy<0||gx>=n.w||gy>=n.h?-1:gy*n.w+gx;};
 // A walking actor can be beside a blocked rounded grid cell. Find a nearby
 // cell reachable by its complete footprint; never snap it onto that cell.
 let start=-1,closest=Infinity;
 for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){
  const j=id(p.x+x*n.step,p.y+y*n.step);if(j<0||!grid[j])continue;
  const q=point(j),d=Math.hypot(q.x-p.x,q.y-p.y);
  if(d<closest&&s4tProxySweep(p,q)){start=j;closest=d;}
 }
 if(start<0)return null;
 const parent=new Int32Array(grid.length);parent.fill(-2);parent[start]=-1;const queue=[start];
 for(let head=0;head<queue.length;head++){
  const i=queue[head],x=i%n.w,y=Math.floor(i/n.w);
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const xx=x+dx,yy=y+dy,j=yy*n.w+xx;
   if(xx<0||yy<0||xx>=n.w||yy>=n.h||!grid[j]||parent[j]!==-2)continue;
   if(dx&&dy&&(!grid[y*n.w+xx]||!grid[yy*n.w+x]))continue;
   parent[j]=i;queue.push(j);
  }
 }
 let best=null,bestScore=Infinity;
 for(const shore of S4.shore){
  if(shore.x<22||shore.x>57||shore.y<21||shore.y>45)continue;
  const oval=[S4_POND,S4_LAKE].sort((a,b)=>Math.abs(((shore.x-a.x)/a.rx)**2+((shore.y-a.y)/a.ry)**2-1)-Math.abs(((shore.x-b.x)/b.rx)**2+((shore.y-b.y)/b.ry)**2-1))[0];
  let nx=(shore.x-oval.x)/oval.rx**2,ny=(shore.y-oval.y)/oval.ry**2;const len=Math.hypot(nx,ny);nx/=len;ny/=len;
  const bank={x:shore.x+nx*(n.r+.22),y:shore.y+ny*(n.r+.22),water:false},entry={x:shore.x-nx*(n.r+.3),y:shore.y-ny*(n.r+.3),water:true};
  const score=(shore.x-target.x)**2+(shore.y-target.y)**2;
  if(score>=bestScore||!s4Pond(entry.x,entry.y)||!s4tProxyFree(bank.x,bank.y)||!s4tProxySweep(bank,entry,true))continue;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
   const j=id(bank.x+dx*.5,bank.y+dy*.5);if(j<0||parent[j]===-2||!s4tProxySweep(point(j),bank))continue;
   bestScore=score;best={j,bank,entry};
  }
 }
 if(!best)return null;
 const raw=[];for(let i=best.j;i>=0;i=parent[i])raw.push(point(i));raw.reverse();raw.push(best.bank);
 // Remove staircase turns only where the complete footprint can sweep the chord.
 const route=[];let from={x:p.x,y:p.y},i=0;
 while(i<raw.length){let far=i;for(let j=i+1;j<raw.length;j++){if(!s4tProxySweep(from,raw[j]))break;far=j;}route.push(raw[far]);from=raw[far];i=far+1;}
 route.push(best.entry);return route;
}
function s4tProxyTick(dt){
 const p=S4T.proxy;if(p.phase==='arrived'){p.wait+=dt;if(p.wait>1.4){s4tReturn('LARGE FOOTPRINT REACHED THE WATER. REVIEW RESET.');}return;}
 if(p.phase!=='walk')return;
 const target=p.route[p.index];if(!target){p.phase='arrived';p.wait=0;return;}
 const dx=target.x-p.x,dy=target.y-p.y,d=Math.hypot(dx,dy),step=Math.min(d,2.8*dt);
 const next={x:p.x+dx/(d||1)*step,y:p.y+dy/(d||1)*step};
 if(!s4tProxySweep(p,next,target.water)){p.phase='blocked';S4T.returnT=2;feed('ROUTE BLOCKED. THE TOY WILL RETURN TO SAFETY.');return;}
 Object.assign(p,next);if(d>.001)p.a=Math.atan2(dy,dx);if(d<=step+.001)p.index++;
}

// SOURCE: seraphim-audio.js
// Close, frail and breathy. A local injured voice, not another music bed.
audio.seraphimBake=function(){
 if(!this.ctx||this.s4tBuffers)return;
 const rate=this.ctx.sampleRate,buffers={};
 for(const [kind,seconds]of [['breath',2.6],['water',1.5],['feather',.42]]){
  const b=this.ctx.createBuffer(1,Math.floor(rate*seconds),rate),d=b.getChannelData(0);let seed=93173,low=0,mid=0;
  for(let i=0;i<d.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate,u=t/seconds;
   low=.986*low+.014*n;mid=.78*mid+.22*n;
   if(kind==='breath'){
    const env=Math.sin(Math.PI*u)**2*(.55+.45*Math.sin(Math.PI*u)),trem=.85+.15*Math.sin(TAU*5.1*t);
    const fundamental=183*t-11*t*t/seconds;
    d[i]=((mid-low)*.055+Math.sin(TAU*fundamental+Math.sin(t*7)*.11)*.043+Math.sin(TAU*fundamental*2.006)*.025+Math.sin(TAU*fundamental*3.01)*.009)*env*trem;
   }else if(kind==='water'){
    const splash=(mid*.6+low*4)*Math.exp(-t*7)*Math.min(1,t*60),bubble=Math.sin(TAU*(150*t+55*(1-Math.exp(-t*3))))*Math.exp(-t*4)*.045;
    d[i]=(splash+bubble)*Math.min(1,(1-u)*12);
   }else d[i]=(n-mid)*.07*Math.sin(Math.PI*u)**2*(.5+.5*Math.sin(t*TAU*13)**2);
  }
  buffers[kind]=b;
 }
 this.s4tBuffers=buffers;
};
audio.seraphimSound=function(kind,vol=1){
 if(!this.ctx||!this.active)return;this.seraphimBake();
 const source=this.ctx.createBufferSource(),gain=this.ctx.createGain(),pan=this.ctx.createStereoPanner(),send=this.ctx.createGain();
 source.buffer=this.s4tBuffers[kind];gain.gain.value=vol;send.gain.value=kind==='breath'?.14:.055;
 source.connect(gain).connect(pan).connect(this.sfx);gain.connect(send).connect(this.room);
 const v={source,gain,pan,send,vol,follow:kind==='breath',pos:{x:S4T.x,y:S4T.y}};
 this.s4tVoices=this.s4tVoices||[];this.s4tVoices.push(v);
 source.onended=()=>{for(const a of[source,gain,pan,send])try{a.disconnect();}catch{}this.s4tVoices=(this.s4tVoices||[]).filter(a=>a!==v);};
 source.start(this.ctx.currentTime);this.seraphimPosition(v);return v;
};
audio.seraphimPosition=function(v){
 const pos=v.follow?s4tLightPosition():v.pos,dx=pos.x-player.x,dy=pos.y-player.y,d=Math.hypot(dx,dy),t=this.ctx.currentTime;
 const clear=d<.3||s4CastRay(player.x,player.y,dx/(d||1),dy/(d||1),d).d>=d-.2;
 v.gain.gain.setTargetAtTime(v.vol/(1+d*.32)*(clear?1:.15),t,.06);
 v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.85,.85),t,.06);
};
audio.seraphimCue=function(kind){
 if(!this.active)return;
 if(kind==='water')this.seraphimSound('water',1.4);
 else if(kind==='lift'){this.seraphimSound('feather',1.1);this.seraphimSound('breath',1.1);S4T.voiceAt=S4T.clock+6.5;}
 else if(kind==='throw')this.seraphimSound('feather',1.4);
 else if(kind==='land'){this.play('bodyfall',{vol:.12,rate:1.45,pos:S4T,wet:.04});this.seraphimSound('feather',.8);S4T.voiceAt=S4T.clock+.65;}
 else if(kind==='return'){this.seraphimSound('feather',.7);S4T.voiceAt=S4T.clock+.8;}
};
audio.seraphimTick=function(){
 if(!s4tRunning()||!this.ctx||!this.active||mode!=='playing')return;
 for(const v of this.s4tVoices||[])this.seraphimPosition(v);
 if(S4T.clock>=S4T.voiceAt){
  S4T.voiceAt=S4T.clock+6.5;
  if(S4T.phase!=='water'&&Math.hypot(S4T.x-player.x,S4T.y-player.y)<14)this.seraphimSound('breath',s4tCarried()?1.15:.95);
 }
};
audio.seraphimStop=function(){for(const v of this.s4tVoices||[])try{v.source.stop();}catch{}this.s4tVoices=[];};
const s4tAudioReset=audio.reset.bind(audio);
audio.reset=function(){this.seraphimStop();s4tAudioReset();};

// SOURCE: cerberus.js
// One actor and health pool. Phase 6 changes the last third into a frenzy:
// guns stagger the guardian; the captive seraphim supplies the way through.
const CB_MAX=7200,CB_STOP=CB_MAX/3,CB_RADIUS=1.55;
const cbFresh=()=>({on:false,alive:true,state:'waiting',x:43,y:24.5,a:Math.PI/2,
 hp:CB_MAX,trail:CB_MAX,clock:0,t:0,attack:null,cooldown:2.2,cycle:0,
 hurt:0,voiceAt:3,stepAt:0,walk:0,shots:0,beams:0,blocked:0,hitCue:0,
 practice:'both',beamSide:1,checkpoint:null,toyDropped:false,stagger:0,staggerMeter:0,
 staggerLast:0,tug:0,route:[],routeIndex:0,lureCommitted:false,sink:0,
 waterPulse:0,gateProgress:0,rewarded:false,completed:false,roomWait:0,roomHint:0,dropFrom:null,dropTo:null,
 toyHeld:false,retrieveToy:null,sinkAt:null,retrieveFacing:0,retrieveTurn:0,chewCue:0,yap:null,yapCD:.6,yapCycle:0,yapFlash:0});
const CB=cbFresh();
function cbRunning(){return s4Running()&&CB.on;}
function cbAI(){return !review.active||review.ai;}
function cbFighting(){return cbRunning()&&['active','frenzy'].includes(CB.state);}
function cbPressure(){return cbFighting()&&cbAI()&&mode==='playing';}
function cbScoreWanted(){return cbRunning()&&cbAI()&&(!review.active||review.music)&&['active','transition','frenzy','fetch','retrieve'].includes(CB.state);}
function cbIntensity(){return clamp((CB_MAX-CB.hp)/(CB_MAX-CB_STOP),0,1);}
function cbReset(){
 audio.cerberusStop?.();Object.assign(CB,cbFresh());
 document.body.classList.remove('cerberus-fight','cerberus-frenzy');
}
function cbBodyFree(x,y,r=.19){return !cbRunning()||!CB.alive||Math.hypot(x-CB.x,y-CB.y)>=CB_RADIUS+r;}
function cbHead(kind){
 // Attack and audio origins follow the same directional neck/muzzle anchors
 // as the artwork, rather than an unrelated floating point above the body.
 const p=cbAttachment(kind),across=p.pose===2?(p.flip?-.24:.24)*p.height:0;
 return{x:p.x-Math.sin(player.a)*across,y:p.y+Math.cos(player.a)*across,
  z:p.z+p.height*(kind==='shepherd'?.55:kind==='bulldog'?.50:.48),alive:true};
}
function cbCancelAttack(){
 CB.attack=CB.yap=null;CB.yapCD=.8;for(const q of bullets)if(q.cb)q.cancelled=true;
 audio.cerberusBeamStop?.();
 audio.cerberusChargeStop?.();
}
function cbAwaken(){
 if(!cbRunning()||CB.state!=='waiting')return;
 CB.state='waking';CB.t=0;CB.cooldown=.85;audio.cerberusCue('wake');
 feed('THREE THROATS. ONE WOUND.');hudUpdate();
}
function cbRay(x,y,dx,dy,limit){
 if(!cbRunning()||!CB.alive||CB.state==='boundary')return null;
 const ex=CB.x-x,ey=CB.y-y,along=ex*dx+ey*dy,cross=ex*dy-ey*dx,r=CB_RADIUS;
 if(Math.abs(cross)>r)return null;
 const d=Math.max(.015,along-Math.sqrt(r*r-cross*cross));
 if(along+r<.01||d>limit)return null;
 const wallHit=s4CastRay(x,y,dx,dy,limit);
 if(wallHit.d+.025<d)return null;
 return{d,x:x+dx*d,y:y+dy*d,z:.86,cerberus:true};
}
function cbProjectileContact(q,dx,dy){
 const len=Math.hypot(dx,dy);if(!len)return null;
 return cbRay(q.x,q.y,dx/len,dy/len,len+q.r);
}
function cbExplosion(q){
 if(q.owner!=='player'||!cbRunning()||CB.state==='boundary')return;
 if(q.cbHit){cbDamage(q.damage,q.cbHit,q.kind);return;}
 if(q.kind!=='grave')return;
 const d=Math.hypot(q.x-CB.x,q.y-CB.y),edge=Math.max(0,d-CB_RADIUS);
 if(edge>=2.65)return;
 const dx=(CB.x-q.x)/(d||1),dy=(CB.y-q.y)/(d||1),hit=s4CastRay(q.x,q.y,dx,dy,edge+.03);
 if(hit.d+.025<edge)return;
 cbDamage(q.damage*clamp(1-edge/2.65,.2,1),{x:CB.x-dx*CB_RADIUS,y:CB.y-dy*CB_RADIUS,z:.7},'grave');
}
function cbDamage(amount,p,kind){
 if(!cbRunning()||!['waiting','waking','active','frenzy'].includes(CB.state)||!Number.isFinite(amount)||amount<=0)return false;
 if(CB.state==='waiting')cbAwaken();
 if(CB.state==='frenzy')cbfStagger(amount*mods.damage);
 else if(!(review.active&&review.holdBoss))CB.hp=Math.max(CB_STOP,CB.hp-amount*mods.damage);
 CB.hurt=.19;hitmarker=.15;emit(p.x,p.y,p.z||.8,'#fb246c',kind==='grave'?24:9,kind==='grave'?1.15:.65);
 if(CB.clock>=CB.hitCue){CB.hitCue=CB.clock+.13;audio.cerberusCue('hit',p,kind==='grave'?1:.5);}
 if(CB.hp<=CB_STOP&&!CB.toyDropped&&CB.practice==='both'){cbfDrop();}
 else if(CB.hp<=CB_STOP&&CB.practice!=='both'){
  CB.state='boundary';CB.t=0;cbCancelAttack();audio.cerberusStop();
  review.done=true;CB.trail=CB.hp;hitstop=0;shake=Math.min(shake,2);
  // No score, clear flag, end screen, toy pickup or gate mutation here.
  feed('HEAD PRACTICE COMPLETE.\nT → CERBERUS: THE COMPLETE FIGHT FOR THE LAST THIRD.');
 }
 hudUpdate();return true;
}
function cbPlayerSweep(a,b){
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/.12));
 for(let i=0;i<=n;i++)if(!fits(mix(a.x,b.x,i/n),mix(a.y,b.y,i/n),.24))return false;
 return true;
}
function cbBeamDistance(b,p){
 const along=(p.x-b.x)*b.dx+(p.y-b.y)*b.dy;
 if(along<0||along>b.length)return Infinity;
 return Math.abs((p.x-b.x)*b.dy-(p.y-b.y)*b.dx);
}
function cbBeamFrame(b,progress){
 // The whole sweep commits before charging. It never retargets the player.
 const a=b.aim+b.arc*(progress*2-1)*b.side;
 b.dx=Math.cos(a);b.dy=Math.sin(a);
 b.length=Math.max(0,Math.min(23,s4CastRay(b.x,b.y,b.dx,b.dy,23).d-.06));
 return b;
}
function cbPlanBeam(){
 const m=cbHead('bulldog'),d=Math.hypot(player.x-m.x,player.y-m.y);
 if(d<3.2||d>20)return null;
 const a=Math.atan2(player.y-m.y,player.x-m.x),rx=-Math.sin(a),ry=Math.cos(a),arc=Math.atan2(1.65,d);
 for(const side of [CB.beamSide,-CB.beamSide]){
  const b=cbBeamFrame({x:m.x,y:m.y,z:.62,endZ:.52,aim:a,arc,width:.22,side,safe:null},0);
  if(b.length<d-1.5)continue;
  // Walk behind the starting edge during the charge. Verify the whole path
  // and all sweep angles; the lake, hedges and body can never steal this exit.
  for(const turn of [0,-.35,.35,-.7,.7]){
   const angle=a-side*Math.PI/2+turn,p={x:player.x+Math.cos(angle)*3.0,y:player.y+Math.sin(angle)*3.0};
   if(!cbPlayerSweep(player,p))continue;
   let clear=true;for(let n=0;n<=12;n++){const frame=cbBeamFrame({...b},n/12);if(cbBeamDistance(frame,p)<.82){clear=false;break;}}
   if(!clear)continue;
   if(CB.practice==='both'){const m0=cbHead('shepherd'),sx=player.x-m0.x,sy=player.y-m0.y,sl=Math.hypot(sx,sy)||1;
    if(Math.abs((p.x-m0.x)*sy-(p.y-m0.y)*sx)/sl<.85)continue;
   }
   b.safe=p;b.safeFrom={x:player.x,y:player.y};
   if(!cbfBeamEscapeClear(b))continue;
   CB.beamSide=-side;return b;
  }
 }
 return null;
}
function cbStartAttack(kind){
 if(kind==='yap')return cbfStartYap();
 if(!cbPressure()||CB.attack)return false;
 if(kind==='beam'){
  // The little head never waits for this turn. Existing and future small
  // bolts leave one feasible walking escape from the committed beam sweep.
  if(bullets.some(q=>q.cb&&!q.cbYap&&!q.cancelled))return false;
  const beam=cbPlanBeam();if(!beam){CB.blocked++;CB.cooldown=.55;return false;}
  CB.attack={kind:'beam',t:0,windup:1.1,duration:1.35,fired:false,beam,
   assist:CB.state!=='frenzy'&&CB.practice==='both'&&CB.hp<CB_MAX*.78?{target:{x:player.x,y:player.y},sent:0,done:false,fixed:true}:null};
  audio.cerberusCharge();return true;
 }
 const m=cbHead('shepherd'),d=Math.hypot(player.x-m.x,player.y-m.y);
 if(d<1.1||d>20||s4CastRay(m.x,m.y,(player.x-m.x)/d,(player.y-m.y)/d,d).d<d-.35)return false;
 const count=CB.hp<CB_MAX*.62?5:4;
 CB.attack={kind:'salvo',t:0,windup:.62,duration:(count-1)*.25+.24,fired:false,sent:0,count,target:{x:player.x,y:player.y}};
 audio.cerberusCue('snarl',m);return true;
}
function cbSalvoShot(a){
 if(!a.fixed)a.target={x:player.x,y:player.y};
 const m=cbHead('shepherd'),direction=Math.atan2(a.target.y-m.y,a.target.x-m.x)+(a.fixed?0:(a.sent%2?1:-1)*.045);
 bullets.push({x:m.x,y:m.y,z:m.z,cbZ0:m.z,cbTravel:0,cbTargetD:Math.max(1,Math.hypot(a.target.x-m.x,a.target.y-m.y)),a:direction,speed:7.2+cbIntensity(),damage:19,kind:'cerberus',cb:true,
  life:3.2,r:.20,owner:'enemy',color:'#ff4a86'});
 a.sent++;CB.shots++;audio.cerberusCue('spit',m);emit(m.x,m.y,m.z,'#ff526f',5,.45);
}
function cbMove(dt){
 if(CB.attack||!cbFighting()||!cbAI()||review.active&&review.scene==='cb_inspect')return;
 const dx=player.x-CB.x,dy=player.y-CB.y,d=Math.hypot(dx,dy);
 // A slow, weighty advance leaves room to circle and never pursues into the
 // estate corridors. Check the whole circular footprint, not its centre.
 if(d<5.4||d>18)return;
 const speed=.95+cbIntensity()*.35,nx=CB.x+dx/d*speed*dt,ny=CB.y+dy/d*speed*dt;
 if(nx<35||nx>50||ny<22||ny>32||!s4tProxyFree(nx,ny))return;
 CB.x=nx;CB.y=ny;CB.walk+=dt;
 if(CB.clock>CB.stepAt){CB.stepAt=CB.clock+.85;audio.cerberusCue('step',CB);}
}
function cbTick(dt){
 if(!cbRunning()||mode!=='playing')return;
 CB.clock+=dt;CB.t+=dt;CB.hurt=Math.max(0,CB.hurt-dt);CB.trail=mix(CB.trail,CB.hp,1-Math.exp(-dt*4));
 CB.tug=Math.max(0,CB.tug-dt);
 if(cbfTick(dt))return;
 if(CB.state==='boundary')return;
 const dx=player.x-CB.x,dy=player.y-CB.y,d=Math.hypot(dx,dy);
 if(!CB.attack&&!(review.active&&review.scene==='cb_inspect'))CB.a=angle(CB.a+clamp(angle(Math.atan2(dy,dx)-CB.a),-dt*.72,dt*.72));
 if(CB.state==='waiting'&&d<11&&s4CastRay(player.x,player.y,-dx/d,-dy/d,d).d>d-1.6)cbAwaken();
 if(CB.state==='waking'&&CB.t>=2.2){CB.state='active';CB.t=0;}
 if(!cbAI()){cbCancelAttack();CB.cooldown=Math.max(1.2,CB.cooldown);return;}
 if(!cbFighting())return;
 cbfYapTick(dt);
 cbMove(dt);
 if(CB.clock>=CB.voiceAt){CB.voiceAt=CB.clock+5.8;audio.cerberusCue('breath',cbHead('bulldog'));}
 const a=CB.attack;
 if(a){
  a.t+=dt;
  if(a.kind==='salvo'){
   while(a.sent<a.count&&a.t>=a.windup+a.sent*.25)cbSalvoShot(a);
  }else{
   // Coordination arrives after the player has seen both heads separately.
   // The extra shot commits to the old position, leaving the proven exit.
   if(a.assist&&!a.assist.done&&a.t>=.4){cbSalvoShot(a.assist);a.assist.done=true;}
   if(a.t>=a.windup&&!a.fired){a.fired=true;CB.beams++;cbBeamRelease(a);audio.cerberusBeam(a.beam);}
   if(a.fired)cbBeamFrame(a.beam,clamp((a.t-a.windup)/a.duration,0,1));
   if(a.fired&&!a.hit&&a.t<=a.windup+a.duration&&cbBeamDistance(a.beam,player)<a.beam.width+.24){
    const hp=player.hp;
    hurtPlayer(27,'The Bulldog lowers its head before a low sweep. Move behind its starting side, or dash through the beam.');
    // One contact per sweep, independent of frame rate or pain cooldown.
    if(player.hp<hp)a.hit=true;
   }
  }
  if(a.t>=a.windup+a.duration){CB.attack=null;CB.cooldown=CB.state==='frenzy'?.82:(a.kind==='beam'?.8:.72)-cbIntensity()*.22;CB.cycle++;audio.cerberusBeamStop();}
 }else{
  CB.cooldown-=dt;
  if(CB.cooldown<=0){
   const kind=CB.practice==='bulldog'?'beam':CB.practice==='shepherd'?'salvo':CB.cycle%2?'beam':'salvo';
   if(!cbStartAttack(kind)){CB.cooldown=CB.state==='frenzy'&&kind==='beam'?.12:.5;
    if(kind==='beam'&&CB.state!=='frenzy'&&CB.practice==='both'&&!bullets.some(q=>q.cb&&!q.cbYap&&!q.cancelled))cbStartAttack('salvo');
   }
  }
 }
 audio.cerberusTick();
}
function cbSave(){
 CB.checkpoint={scene:review.scene,carry:s4dCapture(),player:{...player},pose:{x:CB.x,y:CB.y,a:CB.a},stageTime};
 reviewSync();
}
function cbRestore(){
 const c=CB.checkpoint;if(!c)return false;
 if(c.journey){S4D.checkpoint=c.journey;s4dRestore();cbfJourneyBegin();CB.checkpoint=c;hudUpdate();return true;}
 reviewLoad(c.scene);s4dCarry(c.carry);Object.assign(player,c.player);Object.assign(CB,c.pose);
 _safeX=player.x;_safeY=player.y;stageTime=c.stageTime;CB.checkpoint=c;
 releaseInputs();hudUpdate();feed('PRE-BOSS CHECKPOINT RESTORED.');return true;
}
function cbReview(scene){
 if(!scene.startsWith('cb_'))return;
 Object.assign(CB,cbFresh(),{on:true,practice:scene==='cb_shepherd'?'shepherd':scene==='cb_bulldog'?'bulldog':'both'});
 enemies=[];drops=[];bullets=[];review.unlimited=false;
 reviewPlace(43,33,-Math.PI/2);
 if(scene==='cb_arrival')reviewPlace(47.5,32.5,-1.95);
 if(scene==='cb_inspect'){reviewPlace(43,30.3,-Math.PI/2);review.ai=false;review.damage=false;review.music=false;CB.state='active';}
 else if(scene!=='cb_arrival'){CB.state='waking';CB.t=0;CB.cooldown=.85;audio.cerberusCue('wake');}
 guns[0].reserve=48;guns[1].reserve=144;guns[2].reserve=9;
 if(scene==='cb_threshold'){
  // Exercise the actual damaging-hit transition, not an already-dropped toy.
  CB.state='active';CB.hp=CB.trail=CB_STOP+85;CB.cooldown=.9;
  const volley={target:{x:player.x,y:player.y},sent:0,fixed:true};
  for(let i=0;i<3;i++)cbSalvoShot(volley);
 }
 msgT=feedT=0;cbSave();hudUpdate();audio.levels();
}
function cbHud(){
 if(!cbRunning())return;
 if(cbfHud())return;
 const visible=mode!=='menu',pct=CB.hp/CB_MAX*100;
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);document.body.classList.add('cerberus-fight');
 $('bossHud').classList.remove('boss-dead');$('bossHud').setAttribute('aria-label','Cerberus boss');$('bossTitle').textContent='CERBERUS';
 $('bossMeter').setAttribute('aria-label','Cerberus shared health');$('bossMeter').setAttribute('aria-valuenow',Math.round(pct));
 $('bossFill').style.width=pct+'%';$('bossTrail').style.width=(CB.trail/CB_MAX*100)+'%';$('bossHealth').textContent=Math.round(pct)+'%';
 $('bossState').textContent=CB.state==='boundary'?'REVIEW COMPLETE':!cbAI()?'INSPECTION':CB.attack?.kind==='beam'?(CB.attack.fired?'WHITEOUT':'BEAM CHARGING'):CB.attack?'SHEPHERD SALVO':CB.state==='waking'?'THREE THROATS':'THE GATEKEEPER';
 $('goal').textContent=CB.state==='boundary'?'HEAD PRACTICE COMPLETE · T FOR THE FULL FIGHT':!cbAI()?'INSPECT CERBERUS · T FOR COMBAT CONDITIONS':'BREAK THE GUARDIAN · TWO HEADS ARE HUNTING';
 $('compassText').textContent='CERBERUS';$('compassArrow').style.transform='rotate('+angle(Math.atan2(CB.y-player.y,CB.x-player.x)-player.a)+'rad)';
 $('lifeHint').textContent=!review.active||review.damage?'STAY MOBILE':'PROTECTED';
 $('reviewBarText').textContent='CERBERUS · '+(CB.state==='boundary'?'LAST THIRD / REVIEW COMPLETE':cbAI()?'TWO-HEAD COMBAT':'CIRCLE + INSPECT')+' · '+(!review.active||review.damage?'DAMAGE ON':'PROTECTED')+' / '+(review.unlimited?'AMMO REFILL':'FINITE AMMO');
}
for(const [id,label,hint]of [
 ['cb_threshold','Cerberus — just before one-third health','Quick freeze-fix check. Start just above 33% with enemy shots already in flight. Use Combat drill for protected testing. Fire weapon 2 or 3 until the toy drops, keep moving through the frenzy, then pause and resume. B repeats this exact starting point.'],
 ['cb_fight','Cerberus — two-head boss review','Start here with Normal conditions to judge the fight: damage on, finite ammo. Combat drill protects health for practice. The Shepherd re-aims each bolt; the Bulldog lowers its head and sweeps a low white beam. Pressure increases as health falls. At 33% the review stops safely. T restores the pre-boss checkpoint; B resets.'],
 ['cb_arrival','Cerberus — first sight at the gates','Approach the guardian. Notice three breeds fused to one body, its weight, and the tiny head chewing its captive light. Combat drill activates the two attacking heads; Explore lets you approach calmly.'],
 ['cb_shepherd','Cerberus — Shepherd salvo practice','Only the Shepherd attacks. Its throat and jaw warn before four staggered bolts, increasing to five later. Each shot aims when released; keep moving. Finite ammo; Combat drill protects health, Normal enables damage.'],
 ['cb_bulldog','Cerberus — Bulldog beam practice','Only the Bulldog attacks. Read the lowered head, white throat and rising growl: there is no marked floor lane. A low beam sweeps across where you stood. Move behind its starting side during the charge or dash through it. Try shore and cover; the committed sweep never follows you.'],
 ['cb_inspect','Cerberus — calm creature inspection','AI and damage off. Walk around the whole body and inspect each breed, stitched necks, breathing and the Chihuahua chewing the seraphim. This scene holds its heading so you can see its sides and rear. T can enable combat again.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

// SOURCE: cerberus-world.js
const CB_ART={body:[],heads:{},neck:null};
const CB_BODY_CROPS=[[145,7,547,308],[666,7,1220,309],[27,311,626,617],[706,305,1221,615],[174,615,526,920],[715,627,1220,920],[50,926,626,1230],[675,925,1227,1236]];
// Authored wide-shoulder body and the approved head sheet use background
// keys decoded once into cutout textures (neutral bright body / green heads).
const CB_HEAD_CROPS=[[80,5,288,383],[427,4,652,382],[779,4,1091,388],[1176,12,1385,386],[50,402,317,725],[403,394,668,725],[773,400,1074,722],[1144,403,1402,724],[50,728,313,1052],[406,729,667,1053],[811,730,1044,1053],[1146,724,1405,1051]];
// Shepherd / Bulldog / Chihuahua socket rims in each authored body view.
// These are sprite rig coordinates, not a second creature or collider.
const CB_SOCKET_PIXELS=[
 [[349,20],[483,45],[218,47]],[[1006,20],[1127,55],[880,55]],
 [[530,325],[461,350],[601,366]],[[1062,319],[946,344],[1171,350]],
 [[350,628],[246,661],[460,667]],[[872,641],[787,670],[970,666]],
 [[179,936],[82,967],[265,971]],[[864,936],[777,969],[987,963]]
];
function cbView(){
 const view=angle(Math.atan2(player.y-CB.y,player.x-CB.x)-CB.a);
 return{view,dir:((Math.round(view/(Math.PI/4))%8)+8)%8,side:Math.sin(view),forward:Math.cos(view),
  breathe:settings.reduce?0:Math.sin(CB.clock*2.35)*.025};
}
function cbAttachment(kind){
 const v=cbView(),i=['shepherd','bulldog','chihuahua'].indexOf(kind),crop=CB_BODY_CROPS[v.dir],socket=CB_SOCKET_PIXELS[v.dir][i],
  height=kind==='shepherd'?1.08:kind==='bulldog'?.83:.71,bodyH=1.60+v.breathe,
  bodyW=bodyH*(crop[2]-crop[0])/(crop[3]-crop[1]),sv=(socket[1]-crop[1])/(crop[3]-crop[1]),across=((socket[0]-crop[0])/(crop[2]-crop[0])-.5)*bodyW,
  base=bodyH*(1-sv)-.18+(kind==='shepherd'?.04:kind==='chihuahua'?.03:0),
  a=kind==='chihuahua'?CB.yap:CB.attack,active=!!(a&&(kind==='shepherd'?(a.kind==='salvo'||a.assist&&!a.assist.done):kind==='bulldog'?a.kind==='beam':true)),
  tracking=kind==='chihuahua'&&!active&&CB.toyDropped&&!CB.toyHeld&&S4T.on,
  headView=kind==='chihuahua'&&active?angle(Math.atan2(player.y-CB.y,player.x-CB.x)-a.aim):tracking?angle(Math.atan2(player.y-CB.y,player.x-CB.x)-Math.atan2(S4T.y-CB.y,S4T.x-CB.x)):v.view,
  pose=Math.cos(headView)<-.45?3:Math.abs(Math.sin(headView))>.72?2:kind==='chihuahua'&&!CB.toyDropped&&Math.sin(CB.clock*7)>.6?1:active&&a.t>a.windup*.45?1:0,
  jaw=kind==='chihuahua'?(CB.toyDropped?(CB.toyHeld?Math.sin(CB.clock*12)*1.3:active?Math.sin(CB.clock*37)*2:0):Math.sin(CB.clock*7)):0,
  bias=.026+(kind==='shepherd'?.008:(kind==='chihuahua'?v.side:-v.side)*.012),
  charge=kind==='bulldog'&&a?.kind==='beam'?clamp(a.t/(a.windup*.72),0,1):0,
  z=mix(base,.62-height*.50,charge)+(settings.reduce?0:jaw*.013+(active&&kind==='shepherd'?Math.sin(Math.min(a.t/a.windup,1)*Math.PI)*.07:0));
 const lean=tracking?(CB.state==='fetch'?.12:CB.tug>0?Math.sin(CB.tug*Math.PI)*.09:0):0,
  toward=tracking?Math.atan2(S4T.y-CB.y,S4T.x-CB.x):CB.a;
 const result={x:CB.x-Math.sin(player.a)*across-Math.cos(player.a)*bias+Math.cos(toward)*lean,
  y:CB.y+Math.cos(player.a)*across-Math.sin(player.a)*bias+Math.sin(toward)*lean,
  z:z+(CB.stagger>0?-.10:0),height,pose,flip:pose===2&&Math.sin(headView)<0,jaw,active,base,charge,sv};
 if(kind==='chihuahua')cbfRetrieveHead(result);return result;
}
function cbPrepareArt(img,kind){
 if(kind==='body'){
  const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d',{willReadFrequently:true});
  g.drawImage(img,311,56,76,85,0,0,96,96);CB_ART.neck={w:96,h:96,data:g.getImageData(0,0,96,96).data};
 }
 const crops=kind==='body'?CB_BODY_CROPS:CB_HEAD_CROPS;
 for(let i=0;i<crops.length;i++){
  const [x0,y0,x1,y1]=crops[i],ratio=(x1-x0)/(y1-y0),h=kind==='body'?280:320,w=Math.round(h*ratio),image=document.createElement('canvas');
  image.width=w;image.height=h;const c=image.getContext('2d',{willReadFrequently:true});
  c.drawImage(img,x0,y0,x1-x0,y1-y0,0,0,w,h);
  const art={image,w,h,data:c.getImageData(0,0,w,h).data};
  for(let n=0;n<art.data.length;n+=4){
   const r=art.data[n],g=art.data[n+1],b=art.data[n+2];
   const keyed=kind==='heads'?g>64&&g>r*1.3&&g>b*1.3:Math.min(r,g,b)>155&&Math.max(r,g,b)-Math.min(r,g,b)<20;
   if(keyed)art.data[n+3]=0;
  }
  if(kind==='body')CB_ART.body[i]=art;
  else{const k=['shepherd','bulldog','chihuahua'][Math.floor(i/4)];(CB_ART.heads[k]||(CB_ART.heads[k]=[]))[i%4]=art;}
 }
}
function cbSprite(art,x,y,z,h,flip=false,emissive=false,w=null,water=false){
 if(!art)return;w=w||h*art.w/art.h;
 let v=1;
 if(water){z-=CB.sink;if(z+h<=.025)return;if(z<.025){const top=z+h;v=(top-.025)/h;h=top-.025;z=.025;}}
 const ox=-camDY*w/2,oy=camDX*w/2;
 s4DrawFace({points:[[x-ox,y-oy,z],[x+ox,y+oy,z],[x+ox,y+oy,z+h],[x-ox,y-oy,z+h]],surface:art,
  tex:-1,color:[149,117,94],u:flip?-1:1,u0:flip?1:0,v,cutout:true,emissive});
}
function cbWorldFaces(){
 if(!cbRunning()||!CB.alive)return;
 const v=cbView();
 const body=CB_ART.body[v.dir];
 const drowning=CB.state==='drowning';
 cbSprite(body,CB.x,CB.y,0,1.60+v.breathe,false,CB.hurt>0,null,drowning);
 const parts=['shepherd','bulldog','chihuahua'].map(kind=>{const p=cbAttachment(kind);return{kind,p,d:(p.x-player.x)*camDX+(p.y-player.y)*camDY};});
 parts.sort((a,b)=>b.d-a.d);
 for(const {kind,p}of parts){
  if((p.charge||kind==='chihuahua'&&CB.state==='retrieve')&&body){
   // The attached Bulldog neck bends down with the attacking head. Reuse the
   // authored tissue around its socket instead of leaving a floating muzzle.
   const w=.27,top=p.base+.24,nx=p.x+camDX*.035,ny=p.y+camDY*.035;
   s4DrawFace({points:[[nx+camDY*w,ny-camDX*w,p.z+.16],[nx-camDY*w,ny+camDX*w,p.z+.16],[nx-camDY*w,ny+camDX*w,top],[nx+camDY*w,ny-camDX*w,top]],surface:CB_ART.neck,tex:-1,color:[149,117,94],u:1,v:1});
  }
  cbSprite(CB_ART.heads[kind]?.[p.pose],p.x,p.y,p.z,p.height,p.flip,CB.hurt>0,null,drowning);
  if(kind==='chihuahua'&&(!CB.toyDropped||CB.toyHeld)){
   // The approved seraphim stays visibly held at the little head's mouth.
   const m=cbHead(kind);cbSprite(v.forward<-.45?S4T_ART.back:S4T_ART.front,
    m.x-camDX*.10,m.y-camDY*.10,m.z-.10,CB.toyHeld?.33:.23,false,true,CB.toyHeld?.37:.28,drowning);
  }
 }
 cbBeamWorld();
}
function cbAtmosphere(){
 if(!cbRunning())return;
 cbfWaterAtmosphere();if(!CB.alive)return;
 const a=CB.attack;
 if(a?.kind==='beam'&&a.fired){
  const b=a.beam;
  for(let d=.35;d<b.length;d+=.7){
   const p=project(b.x+b.dx*d,b.y+b.dy*d,mix(b.z,b.endZ,d/b.length));
   if(p&&p.d>1.1&&s4Visible(p.x,p.y,p.d,.5))drawGlow(p.x,p.y,Math.min(44,p.scale*.27),'#b7f4ff',settings.reduce?.1:.19);
  }
 }
 if(a){
  const kind=a.kind==='beam'?'bulldog':'shepherd',m=cbHead(kind),v=project(m.x,m.y,m.z);
  if(v&&s4Visible(v.x,v.y,v.d,.8)){
   const ready=clamp(a.t/a.windup,0,1);drawGlow(v.x,v.y,Math.min(50,v.scale*(.11+ready*.3)),a.kind==='beam'?'#d7faff':a.kind==='yap'?'#ffd768':'#ff347b',settings.reduce?.12:.2+ready*.22);
  }
 }
 if(CB.yap){const m=cbHead('chihuahua'),v=project(m.x,m.y,m.z);if(v&&s4Visible(v.x,v.y,v.d,.8))drawGlow(v.x,v.y,Math.min(26,v.scale*(CB.yapFlash>0?.3:.14)),'#ffdc7c',settings.reduce?.12:CB.yapFlash>0?.42:.18);}
 if(a?.assist&&!a.assist.done){const m=cbHead('shepherd'),v=project(m.x,m.y,m.z);if(v&&s4Visible(v.x,v.y,v.d,.8))drawGlow(v.x,v.y,Math.min(24,v.scale*.2),'#ff347b',settings.reduce?.12:.26);}
 // Captive light stays small, making the chewed toy readable during combat.
 if(CB.toyDropped)return;
 const p=cbHead('chihuahua'),v=project(p.x-camDX*.025,p.y-camDY*.025,p.z);
 if(v&&s4Visible(v.x,v.y,v.d,.45))drawGlow(v.x,v.y,Math.min(16,v.scale*.15),'#f2dca4',.09);
}

// SOURCE: cerberus-vfx.js
// Simulation-clock effects, clipped by outdoor geometry. No lane preview.
// Ribbons are camera-facing strips in world space, not screen overlays.
function cbvRibbon(a,b,width,color,near=.08,surface=null){
 const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[player.x-(a[0]+b[0])*.5,player.y-(a[1]+b[1])*.5,.52-(a[2]+b[2])*.5],
  n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],len=Math.hypot(...n)||1;
 const p=n.map(t=>t/len*width);
 s4DrawFace({points:[a.map((t,i)=>t-p[i]),b.map((t,i)=>t-p[i]),b.map((t,i)=>t+p[i]),a.map((t,i)=>t+p[i])],tex:-1,color,u:1,v:1,emissive:!surface||!!surface.glow,cutout:!!surface?.cutout,near,surface});
}
function cbvRing(m,axis,r,t,color,width=.012){
 const side=[-Math.sin(axis),Math.cos(axis),0];
 for(let i=0;i<18;i++){
  const p=j=>{const a=j*TAU/18+t;return[m.x+side[0]*Math.cos(a)*r,m.y+side[1]*Math.cos(a)*r,m.z+Math.sin(a)*r];};
  cbvRibbon(p(i),p(i+1),width,color,1.05);
 }
}
function cbBeamWorld(){
 const a=CB.attack;if(a?.kind!=='beam')return;
 const m=cbHead('bulldog'),t=a.t,axis=a.beam.aim;
 if(!a.fired){
  const u=clamp(t/a.windup,0,1),r=.48*(1-u)+.11;
  cbvRing(m,axis,r,t*3,[88,153,211],.013);
  cbvRing(m,axis,r*.66,-t*5,[215,210,255],.019);
  const n=settings.reduce?5:10;
  for(let j=0;j<n;j++){
   const phase=(t*1.7+j/n)%1,ang=j*2.399+t*5,dist=.15+(1-phase)*.58;
   const point=k=>{const d=dist+k;return[m.x-Math.sin(axis)*Math.cos(ang-k*4)*d,m.y+Math.cos(axis)*Math.cos(ang-k*4)*d,m.z+Math.sin(ang-k*4)*d*.66];};
   cbvRibbon(point(0),point(.07),.009+u*.006,j%2?[132,221,255]:[243,159,255],1.05);
  }
  const front={x:m.x-camDX*.12,y:m.y-camDY*.12,z:m.z};
  cbvRing(front,player.a,.035+u*.065,0,[250,251,255],.024);
  return;
 }
 const b=a.beam,root=[b.x,b.y,b.z],end=[b.x+b.dx*b.length,b.y+b.dy*b.length,b.endZ];
 // The same physical shaft now has turbulent plasma and broken edges,
 // instead of several flat, opaque stripes. Its centre is continuously hot.
 cbvRibbon(root,end,.235,[110,70,199],1.1,cbvPlasma());
 for(let j=0;j<(settings.reduce?12:28);j++){
  const p=k=>{const d=k/28*b.length,ang=d*3.2-t*24,r=.19;return[b.x+b.dx*d-b.dy*Math.cos(ang)*r,b.y+b.dy*d+b.dx*Math.cos(ang)*r,mix(b.z,b.endZ,d/b.length)+Math.sin(ang)*r];};
  cbvRibbon(p(j),p(j+1),.016,j%3?[186,249,255]:[242,146,255],1.1);
 }
 for(let j=0;j<3;j++){
  const d=((t*9+j*b.length/3)%b.length),p={x:b.x+b.dx*d,y:b.y+b.dy*d,z:mix(b.z,b.endZ,d/b.length)};
  cbvRing(p,Math.atan2(b.dy,b.dx),.23,0,[143,206,248],.009);
 }
 cbvRing(m,Math.atan2(b.dy,b.dx),.28,t*3,[234,248,255],.045);
}
function cbBeamRelease(a){
 const m=cbHead('bulldog');emit(m.x,m.y,m.z,'#c2f1ff',settings.reduce?5:18,.6);
 shake=Math.max(shake,settings.reduce?0:3.5);
}
function cbYapSprite(q,v){
 if(!s4Visible(v.x,v.y,v.d,.15))return;
 const r=clamp(v.scale*q.r,1,13);
 wc.save();wc.globalAlpha=.25;wc.fillStyle=q.color;wc.beginPath();wc.arc(v.x,v.y,r*2.1,0,TAU);wc.fill();
 wc.globalAlpha=1;wc.beginPath();wc.arc(v.x,v.y,r,0,TAU);wc.fill();
 wc.fillStyle='#fffbdc';wc.beginPath();wc.arc(v.x,v.y,Math.max(.8,r*.47),0,TAU);wc.fill();wc.restore();
}

const CBV_PLASMA={w:192,h:48,data:new Uint8ClampedArray(192*48*4),stamp:-1,glow:true,cutout:true};
function cbvPlasma(){
 const s=CBV_PLASMA,stamp=Math.floor(CB.clock*(settings.reduce?3:18));if(s.stamp===stamp)return s;s.stamp=stamp;
 const t=settings.reduce?0:CB.clock;
 for(let x=0;x<s.w;x++)for(let y=0;y<s.h;y++){
  const u=x/s.w,v=(y/s.h-.5)*2,
   rag=.83+.09*Math.sin(x*.43-t*17)+.07*Math.sin(x*.93+t*31),
   warp=Math.sin(x*.13-t*14)*.055+Math.sin(x*.67+t*24)*.02,d=Math.abs(v-warp),
   thread=Math.sin(x*.55+v*35-t*40)**10,
   core=Math.exp(-d*d*22),body=Math.exp(-d*d*4.3),i=(y*s.w+x)*4;
  s.data[i]=53+core*205+thread*65;s.data[i+1]=30+body*167+core*70;
  s.data[i+2]=131+body*123;s.data[i+3]=d<rag?255:0;
 }return s;
}

// SOURCE: cerberus-audio.js
// The original recordings retain the voice's mass. Each throat has its own
// register, timing and physical origin, through the existing HRTF/room mix.
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const t=this.ctx.currentTime,m=pos||CB,play=(key,vol,rate,wet=.13,delay=0)=>{
  const bite=kind==='yap'?this.ctx.createGain():null;
  if(bite){bite.connect(this.sfx);bite.gain.setValueAtTime(1,t+delay);bite.gain.setTargetAtTime(.001,t+delay+.085,.017);}
  const v=this.play(key,{vol:vol*strength,rate,wet,pos:m,at:t+delay,bus:bite});
  if(v){
   v.cb=true;v.filter.frequency.setTargetAtTime(kind==='chew'?2700:6500,t,.015);
   if(bite){const ended=v.source.onended;v.source.onended=()=>{ended();bite.disconnect();};v.until=t+delay+.18;v.source.stop(t+delay+.18);}
  }else bite?.disconnect();
 };
 if(kind==='wake'){
  play('roar0',1.7,.62,.24);play('brute1',1.05,.76,.16,.16);play('bodyfall',.5,.57,.16,.12);
 }else if(kind==='snarl'){play('patient2',1.1,.66,.12);play('roar1',.5,.95,.17);}
 else if(kind==='spit'){play('bodyhit1',.68,.77,.1);play('flesh1',.56,.7,.13);}
 else if(kind==='charge'){play('brute0',1.0,.54,.18);play('machinery',.44,1.31,.08);}
 else if(kind==='hit'){play('gore1',.78,.8,.09);if(strength>.8)play('brute2',.56,.69,.17);}
 else if(kind==='step'){play('bodyfall',.45,.51,.09);play('step2',.48,.61,.1);}
 else if(kind==='chew'){play('flesh0',.23,1.32,.025);play('breath2',.16,1.44,.06);}
 else if(kind==='breath'){play('brute2',.8,.49,.13);}
 else if(kind==='snap'){play('flesh1',.8,.72,.08);play('patient1',.55,1.62,.1);}
 else if(kind==='yap'){play('brute1',.72,1.85+(CB.shots%3)*.11,.08);play('bodyhit0',.28,1.3,.04);}
 else if(kind==='want'){play('patient2',.56,1.73,.1);play('brute0',.43,.58,.14,.12);}
 else if(kind==='stagger'){play('roar1',1.05,.67,.16);play('bodyfall',.7,.59,.07);}
 else if(kind==='fetch'){play('patient2',.8,1.85,.1);play('brute0',1.0,.55,.17,.16);}
 else if(kind==='plunge'){play('bodyfall',1.5,.42,.17);play('brute2',1.1,.63,.12,.1);}
 else if(kind==='submerge'){play('brute0',.9,.4,.07);}
 else if(kind==='gate'){play('machinery',.62,.61,.16);play('bodyhit1',.6,.46,.15,1.55);}
};
audio.cerberusBake=function(){
 if(!this.ctx||this.cbBeamBuffer)return;
 // Layered air tear, detuned electrical grit and sub pressure. The attack's
 // initial crack stays separate from its sustained body and travels spatially.
 const rate=this.ctx.sampleRate,b=this.ctx.createBuffer(2,Math.round(rate*1.5),rate);
 for(let ch=0;ch<2;ch++){
  const data=b.getChannelData(ch);let seed=77021+ch*743,low=0,mid=0;
  for(let i=0;i<data.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
   low=low*.994+n*.006;mid=mid*.72+n*.28;
   const gate=.7+.3*Math.sin(t*TAU*43+ch*.4)**2,
    tear=Math.sin(TAU*(131*t+2.1*Math.sin(t*38))+mid*5)*.23,
    pressure=Math.sin(TAU*47*t+low*2)*.3,
    crack=n*Math.exp(-t*65)*.65,envelope=Math.min(1,t/.004,(1.5-t)/.06);
   data[i]=Math.tanh((low*5+mid*.82+tear+pressure+crack)*gate)*envelope*.7;
  }
 }this.cbBeamBuffer=b;
};
audio.cerberusCharge=function(){
 if(!this.ctx||!this.active)return;this.cerberusChargeStop();
 const a=this.ctx,rate=a.sampleRate;
 if(!this.cbChargeBuffer){
  const b=a.createBuffer(2,Math.ceil(rate*1.1),rate);
  for(let ch=0;ch<2;ch++){
   const data=b.getChannelData(ch);let seed=9191+ch*151,low=0,phase=0;
   for(let i=0;i<data.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate,u=t/1.1;
    low=low*.82+n*.18;phase+=TAU*(64+u*u*415)/rate;
    const teeth=Math.sin(phase+Math.sin(phase*1.497)*2.4),
     intake=(low*.75+n*.10)*(.4+.6*Math.sin(t*TAU*(9+u*16))**2),
     swell=Math.sin(Math.PI*clamp(u*1.01,0,1))*.32+u*.68;
    data[i]=Math.tanh(teeth*.25+intake+Math.sin(t*TAU*37)*.12)*swell*Math.min(1,t*35)*.7;
   }
  }this.cbChargeBuffer=b;
 }
 const source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner(),m=cbHead('bulldog'),d=Math.hypot(m.x-player.x,m.y-player.y);
 source.buffer=this.cbChargeBuffer;gain.gain.value=.9/(1+d*.065);
 pan.pan.value=clamp(((m.y-player.y)*Math.cos(player.a)-(m.x-player.x)*Math.sin(player.a))/(d||1),-.8,.8);
 source.connect(gain).connect(pan).connect(this.sfx);const v={source,gain,pan};this.cbCharge=v;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbCharge===v)this.cbCharge=null;};source.start(a.currentTime);
 this.cerberusCue('charge',m,.85);
};
audio.cerberusChargeStop=function(){
 const v=this.cbCharge;if(!v)return;this.cbCharge=null;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);
 v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
audio.cerberusBeam=function(beam){
 if(!this.ctx||!this.active)return;this.cerberusChargeStop();this.cerberusBeamStop();this.cerberusBake();
 const a=this.ctx,source=a.createBufferSource(),gain=a.createGain(),pan=a.createStereoPanner();
 source.buffer=this.cbBeamBuffer;gain.gain.value=.65;source.connect(gain).connect(pan).connect(this.sfx);
 const v={source,gain,pan,beam};this.cbBeam=v;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbBeam===v)this.cbBeam=null;};source.start(a.currentTime);
 const hit=this.play('blast1',{vol:.92,rate:.68,wet:.17,pos:cbHead('bulldog')});if(hit)hit.cb=true;const throat=this.play('brute2',{vol:.46,rate:.48,wet:.1,pos:cbHead('bulldog')});if(throat)throat.cb=true;
};
audio.cerberusBeamStop=function(){
 const v=this.cbBeam;if(!v)return;this.cbBeam=null;
 v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
audio.cerberusScoreStop=function(){
 const v=this.cbScore;if(v){this.cbScore=null;v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}}
 if(this.ctx&&cbRunning()){this.music.gain.cancelScheduledValues(this.ctx.currentTime);this.music.gain.setValueAtTime(0,this.ctx.currentTime);}
};
audio.cerberusTick=function(){
 if(!this.ctx||!this.active||!cbRunning()||mode!=='playing')return;
 const t=this.ctx.currentTime,enabled=cbScoreWanted()&&settings.music>0;
 if(!enabled)this.cerberusScoreStop();
 else if(!this.cbScore&&this.cbScoreBuffer){
  const source=this.ctx.createBufferSource(),gain=this.ctx.createGain();source.buffer=this.cbScoreBuffer;source.loop=true;gain.gain.value=.92;
  source.connect(gain).connect(this.musicTone);this.musicTone.frequency.setTargetAtTime(13200,t,.14);
  const voice={source,gain};this.cbScore=voice;source.onended=()=>{source.disconnect();gain.disconnect();if(this.cbScore===voice)this.cbScore=null;};
  source.start(t);
 }
 this.exteriorMix();
 if(this.cbWater){
  const v=this.cbWater,dx=v.pos.x-player.x,dy=v.pos.y-player.y,d=Math.hypot(dx,dy);
  v.gain.gain.setTargetAtTime(1.1/(1+d*.065),t,.06);
  v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.75,.75),t,.05);
 }
 if(this.cbBeam){
  const v=this.cbBeam,b=v.beam,l=clamp((player.x-b.x)*b.dx+(player.y-b.y)*b.dy,0,b.length),dx=b.x+b.dx*l-player.x,dy=b.y+b.dy*l-player.y,d=Math.hypot(dx,dy);
  v.gain.gain.setTargetAtTime(.74/(1+d*.11),t,.03);v.pan.pan.setTargetAtTime(clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.9,.9),t,.04);
 }
};
audio.cerberusStop=function(){
 this.cerberusScoreStop();this.cerberusBeamStop();this.cerberusChargeStop();
 this.cerberusWaterStop();
 for(const v of [...this.voices])if(v.cb)try{v.source.stop();}catch{}
};
audio.cerberusWater=function(pos){
 if(!this.ctx||!this.active)return;this.cerberusWaterStop();
 const ctx=this.ctx,rate=ctx.sampleRate;
 if(!this.cbWaterBuffer){
  const b=ctx.createBuffer(2,Math.ceil(rate*4.3),rate);
  for(let ch=0;ch<2;ch++){
   const data=b.getChannelData(ch);let seed=53719+ch*571,low=0,mid=0;
   for(let i=0;i<data.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)|0;const n=(seed>>>0)/2147483648-1,t=i/rate;
    low=low*.993+n*.007;mid=mid*.86+n*.14;
    const impact=Math.exp(-t*2.6)*Math.min(1,t*45),struggle=Math.exp(-Math.max(0,t-.6)*.85)*(Math.sin(t*8+ch*.4)**8)*.34,
     air=Math.max(0,1-t/4.3),bubble=Math.sin(TAU*(83*t+24*Math.sin(t*2.8)))*Math.sin(t*17)**10*.09;
    data[i]=Math.tanh((low*8+mid*1.4)*(impact+struggle)+bubble*air)*Math.min(1,(4.3-t)*3)*.74;
   }
  }this.cbWaterBuffer=b;
 }
 const source=ctx.createBufferSource(),gain=ctx.createGain(),pan=ctx.createStereoPanner(),dx=pos.x-player.x,dy=pos.y-player.y,d=Math.hypot(dx,dy);
 source.buffer=this.cbWaterBuffer;gain.gain.value=1.1/(1+d*.065);
 pan.pan.value=clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(d||1),-.75,.75);
 source.connect(gain).connect(pan).connect(this.sfx);const voice={source,gain,pan,pos:{...pos}};this.cbWater=voice;
 source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect();if(this.cbWater===voice)this.cbWater=null;};source.start(ctx.currentTime);
};
audio.cerberusWaterStop=function(){
 const v=this.cbWater;if(!v)return;this.cbWater=null;
 v.gain.gain.cancelScheduledValues(this.ctx.currentTime);v.gain.gain.setValueAtTime(0,this.ctx.currentTime);try{v.source.stop();}catch{}
};
const cbPreviousTick=audio.tick.bind(audio),cbPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt){
 cbPreviousTick(dt);if(!cbRunning()||mode!=='playing')return;
 this.cerberusTick();
 if(CB.state!=='boundary'&&!CB.toyDropped&&CB.clock>=(this.cbChewAt||0)){this.cbChewAt=CB.clock+2.9;this.cerberusCue('chew',cbHead('chihuahua'));}
};
audio.reset=function(){this.cerberusStop();this.cbChewAt=0;cbPreviousReset();};
const cbPreviousEnd=audio.end.bind(audio);
audio.end=function(won){if(CB.on)this.cerberusStop();cbPreviousEnd(won);};

// SOURCE: cerberus-finale.js
// Phase 6. One wounded item, one guardian, and one irreversible water landing.
// The earlier single-head drills retain their safe one-third stopping point.
const CBF_STAGGER=360;
const CBF_GATE={leaves:[],passable:false};
function cbfSafe(){return cbRunning()&&(CB.state==='transition'||CB.lureCommitted);}
function cbfJourneyBegin(){
 if(!s4qRunning()||!S4Q.moved||CB.on)return false;
 s4dSave();const journey=S4D.checkpoint;
 Object.assign(CB,cbFresh(),{on:true});review.done=false;
 CB.checkpoint={journey};reviewSync();return true;
}
function cbfDropPoint(){
 // Put the light outside the body on reachable, visible grass. No pickup can
 // be hidden inside its collider, the gate, a hedge or the shore.
 for(const r of [3.3,2.8,3.8,4.4])for(const turn of [.40,-.4,0,.85,-.85,1.3,-1.3,Math.PI]){
  const a=CB.a+turn,p={x:CB.x+Math.cos(a)*r,y:CB.y+Math.sin(a)*r};
  if(fits(p.x,p.y,.3)&&s4CastRay(CB.x,CB.y,Math.cos(a),Math.sin(a),r).d>=r-.05)return p;
 }
 return s4tSafePoint({x:42,y:31});
}
function cbfDrop(){
 if(!cbRunning()||CB.toyDropped)return false;
 const from=cbHead('chihuahua'),to=cbfDropPoint();
 cbCancelAttack();bullets=bullets.filter(q=>q.owner!=='enemy');
 CB.state='transition';CB.t=0;CB.toyDropped=true;CB.hp=CB.trail=CB_STOP;
 CB.dropFrom={...from};CB.dropTo=to;CB.stagger=CB.staggerMeter=0;CB.cycle=0;
 Object.assign(S4T,s4tFresh(),{on:true,phase:'dropping',x:from.x,y:from.y,z:from.z,
  previousGun:weapon<3?weapon:0,safe:{...to},origin:{...to},facing:CB.a,voiceAt:1.8});
 s4tBuildCollision();S4T_RUNTIME.nav=null;
 audio.cerberusBeamStop();audio.cerberusCue('snap',from);
 feed('THE LITTLE HEAD STOPS CHEWING.');review.done=false;
 return true;
}
function cbfSettleDrop(){
 Object.assign(S4T,CB.dropTo,{phase:'ground',z:.27,settle:.4});
 audio.seraphimCue('land');CB.state='frenzy';CB.t=0;CB.cooldown=.9;CB.cycle=0;CB.yapCD=.45;
 audio.cerberusCue('yap',cbHead('chihuahua'),1.15);
 feed('FRENZY · GUNFIRE STAGGERS THE HEADS.\nTHE FALLEN LIGHT IS STILL BREATHING.');hudUpdate();
}
function cbfStagger(damage){
 if(CB.state!=='frenzy'||CB.stagger>0||review.active&&review.holdBoss)return;
 CB.staggerMeter=Math.min(CBF_STAGGER,CB.staggerMeter+damage);CB.staggerLast=CB.clock;
 if(CB.staggerMeter>=CBF_STAGGER){
  CB.stagger=1.05;cbCancelAttack();CB.cooldown=.75;
  audio.cerberusCue('stagger');feed('HEADS STAGGERED · MAKE YOUR MOVE.');
 }
}
function cbfStartYap(){
 if(!cbPressure()||CB.state!=='frenzy'||CB.stagger>0||CB.yap)return false;
 const m=cbHead('chihuahua'),dx=player.x-m.x,dy=player.y-m.y,d=Math.hypot(dx,dy);
 if(d<1||d>22||s4CastRay(m.x,m.y,dx/d,dy/d,d).d<d-.35)return false;
 const spiral=CB.yapCycle%2===1;
 CB.yap={kind:'yap',t:0,windup:.28,duration:1.08,sent:0,count:8,
  aim:Math.atan2(dy,dx),gap:CB.yapCycle%2?-.29:.29,spiral,target:{x:player.x,y:player.y}};
 audio.cerberusCue('yap',m,.75);return true;
}
function cbfYapShot(a){
 // Staggered fans and corkscrew fans retain moving gaps, rather than filling
 // every angle. They have their own clock and fire during either big head.
 const m=cbHead('chihuahua'),sweep=a.spiral?(a.sent-3.5)*.055:(a.sent%2? .04:-.04);
 let live=bullets.filter(q=>q.cbYap&&!q.cancelled).length;
 for(let i=0;i<11&&live<96;i++){
  const offset=(i-5)*.195+sweep;if(Math.abs(offset-a.gap)<.16)continue;
  const direction=a.aim+offset,speed=a.spiral?11.8:10.6;
  if(!cbfYapEscapeClear(m,direction,speed))continue;
  bullets.push({x:m.x,y:m.y,z:m.z,cbZ0:m.z,cbTravel:0,
   cbTargetD:Math.max(1,Math.hypot(a.target.x-m.x,a.target.y-m.y)),a:direction,
   speed,damage:6,kind:'cerberus',cb:true,cbYap:true,life:2.5,r:.085,
   owner:'enemy',color:a.spiral?'#ffad64':'#ffe082'});
  live++;CB.shots++;
 }
 a.sent++;CB.yapFlash=.09;emit(m.x,m.y,m.z,'#ffe5a0',2,.2);
 audio.cerberusCue('yap',m,.52+(a.sent%2)*.14);
}
function cbfYapTick(dt){
 if(CB.state!=='frenzy'||!cbAI()||CB.stagger>0)return;
 CB.yapFlash=Math.max(0,CB.yapFlash-dt);
 const a=CB.yap;
 if(a){
  a.t+=dt;while(a.sent<a.count&&a.t>=a.windup+a.sent*.135)cbfYapShot(a);
  if(a.t>=a.windup+a.duration){CB.yap=null;CB.yapCD=.48;CB.yapCycle++;}
 }else{CB.yapCD-=dt;if(CB.yapCD<=0&&!cbfStartYap())CB.yapCD=.25;}
}
function cbfEscapePoint(b,time){
 const u=clamp(time/.86,0,1);return{x:mix(b.safeFrom.x,b.safe.x,u),y:mix(b.safeFrom.y,b.safe.y,u)};
}
function cbfBoltMeetsEscape(q,b,elapsed=0){
 const dx=Math.cos(q.a)*q.speed,dy=Math.sin(q.a)*q.speed;
 for(let t=0;t<=Math.min(q.life,2.55-elapsed);t+=.055){
  const p=cbfEscapePoint(b,t+elapsed);
  if(Math.hypot(q.x+dx*t-p.x,q.y+dy*t-p.y)<.61)return true;
 }return false;
}
function cbfBeamEscapeClear(b){return !bullets.some(q=>q.cbYap&&!q.cancelled&&cbfBoltMeetsEscape(q,b));}
function cbfYapEscapeClear(m,a,speed){
 const beam=CB.attack;if(beam?.kind!=='beam')return true;
 return !cbfBoltMeetsEscape({x:m.x,y:m.y,a,speed,life:2.5},beam.beam,beam.t);
}
function cbfToyReaction(kind){
 if(!cbRunning()||CB.state!=='frenzy')return;
 CB.tug=kind==='land'?1.15:.6;
 audio.cerberusCue('want',cbHead('chihuahua'));
 if(kind==='land')feed('THE LITTLE HEAD PULLS TOWARD ITS TOY.\nTHE OTHER TWO BRACE AGAINST IT.');
}
function cbfWaterLanding(){
 if(!cbRunning()||!CB.toyDropped)return false;
 if(CB.lureCommitted)return true;
 if(CB.state!=='frenzy')return false;
 if(!S4T_RUNTIME.nav)s4tBuildNav();
 const route=cbfRetrieveRoute(S4T);
 if(!route){s4tReturn('THE GUARDIAN CANNOT REACH THAT BANK. TRY AN OPEN SHORE.');return true;}
 CB.route=route;CB.routeIndex=0;CB.lureCommitted=true;CB.state='fetch';CB.t=0;
 CB.stagger=CB.staggerMeter=0;S4T.returnT=0;
 cbCancelAttack();bullets=bullets.filter(q=>q.owner!=='enemy');
 audio.cerberusCue('fetch',cbHead('chihuahua'));feed('IT WILL NOT LET GO.');
 return true;
}
function cbfMakeRoom(next){
 const gap=CB_RADIUS+.27,dx=player.x-next.x,dy=player.y-next.y,d=Math.hypot(dx,dy);
 if(d>=gap)return true;
 // The solved encounter cannot kill or trap its player. A tiny swept nudge
 // moves an obstructing player to dry grass; otherwise the body waits.
 const a=d>.01?Math.atan2(dy,dx):CB.a+Math.PI/2;
 for(const turn of [0,.4,-.4,.8,-.8,1.2,-1.2]){
  const p={x:next.x+Math.cos(a+turn)*(gap+.04),y:next.y+Math.sin(a+turn)*(gap+.04)};
  if(Math.hypot(p.x-player.x,p.y-player.y)>.45||!cbPlayerSweep(player,p))continue;
  player.x=p.x;player.y=p.y;_safeX=p.x;_safeY=p.y;player.vx=player.vy=0;return true;
 }
 return false;
}
function cbfFetchTick(dt){
 const target=CB.route[CB.routeIndex];
 if(!target){if(CB.toyHeld)cbfDrown();else cbfBeginRetrieve();return;}
 const dx=target.x-CB.x,dy=target.y-CB.y,d=Math.hypot(dx,dy),step=Math.min(d,3.1*dt),
  next={x:CB.x+dx/(d||1)*step,y:CB.y+dy/(d||1)*step};
 if(!s4tProxySweep(CB,next,!!target.water)){
  // Do not fake arrival or phase through scenery. An unexpected obstruction
  // cancels the solution and makes the canonical item recoverable again.
  CB.lureCommitted=false;CB.state='frenzy';CB.t=0;CB.cooldown=2;
  s4tReturn('THE HEAVY BODY CANNOT PASS. THE LIGHT RETURNS.');return;
 }
 if(!cbfMakeRoom(next)){
  CB.roomWait=(CB.roomWait||0)+dt;
  if(CB.roomWait>1.2&&CB.clock>(CB.roomHint||0)){CB.roomHint=CB.clock+6;feed('GIVE THE BODY ROOM TO PASS.');}
  return;
 }
 CB.roomWait=0;
 Object.assign(CB,next);CB.walk+=dt;
 if(d>.001)CB.a=angle(CB.a+clamp(angle(Math.atan2(dy,dx)-CB.a),-dt*2.8,dt*2.8));
 if(CB.clock>CB.stepAt){CB.stepAt=CB.clock+.45;audio.cerberusCue('step',CB,1.35);}
 if(d<=step+.001)CB.routeIndex++;
}
function cbfDrown(){
 if(CB.state!=='fetch'||!CB.toyHeld||S4T.phase!=='mouth'||!s4Pond(CB.x,CB.y))return false;
 // The planned end point is beyond the shore by more than the body radius.
 for(let i=0;i<24;i++)if(!s4Pond(CB.x+Math.cos(i*TAU/24)*CB_RADIUS,CB.y+Math.sin(i*TAU/24)*CB_RADIUS))return false;
 CB.state='drowning';CB.t=0;CB.sink=0;CB.waterPulse=0;cbCancelAttack();
 audio.cerberusScoreStop();audio.cerberusCue('plunge',CB);audio.cerberusWater(CB);
 shake=Math.max(shake,settings.reduce?0:4.5);
 emit(CB.x,CB.y,.08,'#c3dce0',settings.reduce?18:65,2.3);
 feed('THREE THROATS. NO BREATH.');return true;
}
function cbfDefeated(){
 if(CB.rewarded)return;
 CB.alive=false;CB.state='aftermath';CB.t=0;CB.hp=CB.trail=0;CB.rewarded=true;
 score+=6000;kills++;stageKills++;killmarker=.25;
 s4tReset();audio.cerberusStop();audio.exteriorMix();
 audio.cerberusCue('gate', {x:43,y:19.5});
 const label=S4.labels.find(l=>l.interact==='EXAMINE THE GATES');
 if(label)label.read='THE IRON HAS LET GO.\nTHERE IS A WAY THROUGH.';
 feed('THE GATES RELEASE.');hudUpdate();
}
function cbfTick(dt){
 if(CB.state==='transition'){
  const u=clamp(CB.t/1.12,0,1),ease=s4dEase(u);
  S4T.x=mix(CB.dropFrom.x,CB.dropTo.x,ease);S4T.y=mix(CB.dropFrom.y,CB.dropTo.y,ease);
  S4T.z=mix(CB.dropFrom.z,.27,u)+Math.sin(Math.PI*u)*.34;
  if(CB.t>=1.9)cbfSettleDrop();return true;
 }
 if(CB.state==='fetch'){cbfFetchTick(dt);cbfSyncMouth();return true;}
 if(CB.state==='retrieve'){cbfRetrieveTick();return true;}
 if(CB.state==='drowning'){
  CB.sink=s4dEase(CB.t/3.9)*2.75+(settings.reduce?0:Math.sin(CB.t*10)*.07*Math.sin(Math.PI*clamp(CB.t/3.9,0,1)));
  cbfSyncMouth();
  if(CB.t>=CB.waterPulse){
   CB.waterPulse=CB.t+.48;
   emit(CB.x,CB.y,.08,'#91b8c5',settings.reduce?4:12,1.8);
   if(CB.t>1&&CB.t<2)audio.cerberusCue('submerge',CB,.6);
  }
  if(CB.t>=4.3)cbfDefeated();return true;
 }
 if(CB.state==='aftermath'){
  cbfOpenGate(clamp(CB.t/2.1,0,1));
  if(CB.gateProgress>=1)hgWalkTick();
  return true;
 }
 if(CB.state==='escaped')return true;
 if(CB.state==='frenzy'){
  if(CB.stagger>0){CB.stagger=Math.max(0,CB.stagger-dt);if(!CB.stagger)CB.staggerMeter=0;return true;}
  if(CB.clock-CB.staggerLast>2.4)CB.staggerMeter=Math.max(0,CB.staggerMeter-dt*45);
 }
 return false;
}
function cbfBuildGate(){
 hgBuild();CBF_GATE.leaves=[];CBF_GATE.passable=false;
 const old=S4.faces.filter(f=>f.cerberusGate);S4.faces=S4.faces.filter(f=>!f.cerberusGate);
 for(const f of old)for(let side=0;side<2;side++){
  const points=f.points.map(p=>[mix(p[0],43,.5),p[1],p[2]]);
  // Split at the centre seam, preserving the original complete texture.
  const a=f.points[0][0],b=f.points[1][0],left=side===0?a:43,right=side===0?43:b;
  points[0][0]=points[3][0]=left;points[1][0]=points[2][0]=right;
  const leaf={...f,points,u:f.u/2,u0:side*f.u/2};delete leaf.cx;delete leaf.out;
  const west=(left+right)/2<43;
  CBF_GATE.leaves.push({face:leaf,closed:points.map(p=>[...p]),hinge:west?39.65:46.35,sign:west?-1:1});
  S4.faces.push(leaf);
 }
}
function cbfOpenGate(progress){
 CB.gateProgress=progress;const u=s4dEase(progress);
 for(const l of CBF_GATE.leaves){
  const a=l.sign*u*Math.PI*.47,c=Math.cos(a),s=Math.sin(a);
  l.face.points=l.closed.map(p=>{const dx=p[0]-l.hinge,dy=p[1]-19.5;return[l.hinge+dx*c-dy*s,19.5+dx*s+dy*c,p[2]];});
  delete l.face.cx;delete l.face.out;
 }
 if(progress>=.88){
  S4.solids=S4.solids.filter(b=>!['cerberusGate','cerberusLeaf'].includes(b.kind));
  for(const l of CBF_GATE.leaves.filter((_,i)=>i<2)){
   const xs=l.face.points.map(p=>p[0]),ys=l.face.points.map(p=>p[1]);
   S4.solids.push({x0:Math.min(...xs)-.05,x1:Math.max(...xs)+.05,y0:Math.min(...ys)-.05,y1:Math.max(...ys)+.05,kind:'cerberusLeaf'});
  }
  if(!CBF_GATE.passable){CBF_GATE.passable=true;for(let y=15;y<=20;y++)for(let x=39;x<=47;x++)map[y][x]=s4Solid(x+.5,y+.5)?1:0;buildFlow();}
 }
}
function cbfComplete(){
 if(CB.completed||!CB.rewarded||CB.gateProgress<1||!hgInside()||player.y>7.3||mode!=='playing')return false;
 CB.completed=true;CB.state='escaped';cleared=true;review.done=review.active;
 finish(true);
 $('endLabel').textContent='CHAPTER FOUR COMPLETE';$('endTitle').textContent='INTO HELL.';
 $('endReason').textContent='The hospital was only the threshold. Something vast is breathing on the other side.';
 $('retryBtn').textContent='REPLAY BOSS CHECKPOINT';return true;
}
function cbfHud(){
 if(!CB.toyDropped)return false;
 const resolved=CB.lureCommitted,after=!CB.alive,pct=CB.stagger>0?100:CB.staggerMeter/CBF_STAGGER*100;
 const visible=!after&&mode!=='menu';
 $('bossHud').classList.toggle('hidden',!visible);document.body.classList.toggle('boss-fight',visible);
 document.body.classList.add('cerberus-fight');$('bossHud').classList.remove('boss-dead');
 $('bossHud').setAttribute('aria-label','Cerberus frenzy');$('bossTitle').textContent=resolved?'CERBERUS':'FRENZY';document.body.classList.add('cerberus-frenzy');
 $('bossMeter').setAttribute('aria-label','Gun stagger buildup');$('bossMeter').setAttribute('aria-valuenow',Math.round(pct));
 $('bossFill').style.width=pct+'%';$('bossTrail').style.width=pct+'%';
 $('bossHealth').textContent=CB.stagger>0?'OPEN':resolved?'':Math.round(pct)+'%';
 $('bossState').textContent=CB.state==='transition'?'THE LITTLE HEAD WAKES':CB.state==='retrieve'?'THE TOY IS HIS':CB.state==='fetch'?(CB.toyHeld?'ONE LAST CHEW':'THE BODY FOLLOWS'):CB.state==='drowning'?'NO BREATH':CB.stagger>0?'MAKE YOUR MOVE':CB.attack?.kind==='beam'?(CB.attack.fired?'WHITEOUT':'BEAM CHARGING'):CB.attack?(CB.yap?'CROSSFIRE':'SHEPHERD SALVO'):CB.yap?'CHIHUAHUA FRENZY':'GUNFIRE BUYS TIME';
 $('goal').textContent=after?(hgInside()?'FOLLOW THE BRIDGE INTO HELL':'HELL IS OPEN · WALK THROUGH'):resolved?'WATCH THE WATER':CB.state==='transition'?'THE CAPTIVE LIGHT FALLS':s4tNear()?'[E] LIFT THE WOUNDED SERAPHIM':s4tCarried()?(weapon===3?'FIRE TO THROW · 1–3 GUNS':'4 TO HOLD THE SERAPHIM'):S4T.phase==='airborne'?'FOLLOW THE FALLING LIGHT':'THE LITTLE HEAD WANTS ITS TOY';
 $('lifeHint').textContent=cbfSafe()?'TAKE A BREATH':!review.active||review.damage?'STAY MOBILE':'PROTECTED';
 const target=after?{x:43,y:hgInside()?6:17.5}:resolved?CB:S4T,held=s4tCarried();
 $('compassText').textContent=after?(hgInside()?'THE OTHER SIDE':'GARDEN GATES'):resolved?'THE POND':held?'SERAPHIM CARRIED':'SERAPHIM';
 $('compassArrow').style.visibility=held?'hidden':'visible';
 $('compassArrow').style.transform='rotate('+angle(Math.atan2(target.y-player.y,target.x-player.x)-player.a)+'rad)';
 if(review.active){
  $('reviewBarText').textContent='NO WAY OUT · '+(after?'THE OPEN GATES':resolved?'THE GUARDIAN FOLLOWS':'CERBERUS / LAST THIRD');
  $('reviewStatus').textContent='T CONTROLS · B RESET · '+(CB.completed?'SCENE COMPLETE':cbfSafe()?'AFTERMATH':review.damage?'DAMAGE ON':'PROTECTED');
 }
 return true;
}
function cbfWaterAtmosphere(){
 if(!cbRunning()||!['drowning','aftermath'].includes(CB.state)||CB.state==='aftermath'&&CB.t>7)return;
 const fade=CB.state==='aftermath'?clamp(1-CB.t/7,0,1):1;
 wc.save();wc.lineWidth=1;wc.strokeStyle='#a9cdd4';
 for(let j=0;j<4;j++){
  const u=((CB.clock*.38+j*.25)%1),r=.5+u*3.8;
  wc.globalAlpha=(1-u)*fade*.42;wc.beginPath();let started=false;
  for(let i=0;i<=44;i++){
   const a=i*TAU/44,x=CB.x+Math.cos(a)*r,y=CB.y+Math.sin(a)*r,v=project(x,y,.035);
   if(!v||!s4Pond(x,y)||!s4Visible(v.x,v.y,v.d,.15)){started=false;continue;}
   if(started)wc.lineTo(v.x,v.y);else{wc.moveTo(v.x,v.y);started=true;}
  }wc.stroke();
 }wc.restore();
}
function cbfReview(scene){
 if(!['cb_transition','cb_frenzy','cb_dropped','cb_carried','cb_water','cb_after'].includes(scene))return;
 cbfDrop();
 if(scene!=='cb_transition')cbfSettleDrop();
 if(scene==='cb_dropped')reviewPlace(S4T.x+.7,S4T.y+2,-Math.PI/2-.3);
 if(['cb_carried','cb_water','cb_after'].includes(scene)){
  reviewPlace(35,33.1,Math.PI/2);Object.assign(S4T,{phase:'carried',pickups:1,x:player.x,y:player.y});weapon=3;
 }
 if(scene==='cb_water')s4tThrow();
 if(scene==='cb_after'){
  // Enter the actual aftermath through the same resolved state and gate code.
  CB.lureCommitted=true;CB.state='drowning';CB.x=35;CB.y=37;CB.sink=2.8;cbfDefeated();CB.t=2.1;cbfOpenGate(1);
  reviewPlace(43,24,-Math.PI/2);
 }
 msgT=feedT=0;cbSave();hudUpdate();audio.levels();
}
reviewScenes.cb_fight={label:'Cerberus — the complete fight',level:3,chapter:true,hint:'Normal conditions: damage on, finite ammo. The approved two-head fight now continues into a new last third. Read the heads, the fallen light and their reactions. T restores your starting checkpoint; B resets. For a calm test choose Explore; Combat drill keeps attacks but protects you.'};
reviewScenes.s4_departure.hint=reviewScenes.s4_departure.hint.replace('adds the music and active ambush without damage','adds the active ambush without damage. Ordinary fights stay music-free')+' This entry now continues through the expedition, Cerberus, the pond and the gates. Select Normal for a full playthrough.';
reviewScenes.s4_open.hint='Recovery finished. Follow the hedge walk into the garden, approach the guardian and finish Scene 4. Normal enables damage. Resources and cleared branch state survive the pre-boss retry.';
for(const [id,label,hint]of [
 ['cb_transition','Cerberus — the last-third transition','The little head has just lost its captive. Watch the drop, light and change from health to Frenzy. The drop has a short protected beat. Then the Chihuahua fires independently through the other attacks; Combat drill protects you, Normal enables damage.'],
 ['cb_frenzy','Cerberus — angry Chihuahua','Begin at the last third with the seraphim on the ground. The Chihuahua fires dense, gapped fans independently through the Shepherd and Bulldog attacks. The larger heads still alternate. There is no floor laser marker. Guns fill a stagger bar to create a brief opening. The bar is not more health to grind down.'],
 ['cb_dropped','Seraphim — recover under pressure','Close to the dropped light. Lift with E / touch LIFT. Slot 4 and FIRE throw; 1–3 return to guns. Land throws remain recoverable. Watch the little head pull toward the toy. Carrying it does not protect you in combat.'],
 ['cb_carried','Seraphim — the solution at the shore','Already carrying the seraphim near the hospital bay. Try land throws and different banks. Only an actual water landing commits the guardian. Watch the entire body reach the water; the score gives way to the plunge and night.'],
 ['cb_water','Cerberus — the throw and drowning','The seraphim is already in flight toward water. Watch the guardian reach the actual toy, the little head lower, bite and chew, then sink with it. The score must stop at the plunge, after retrieval. Pause and resume at any point. The gates release after the body sinks; step through the window and walk along the bridge to complete the chapter.'],
 ['cb_after','Garden gates — after the guardian','The water is still. Corrupted iron opens onto a living hellscape. Look through the window, strafe to see the bridge in depth, then walk through. Stop, turn around and walk back to the night if you wish. Continuing along the hell bridge completes the chapter. No score should restart, no invisible gate should block you and no other ending button is needed. The checkpoint repeats this aftermath entry.']
])reviewScenes[id]={label,level:3,chapter:true,hint};

// SOURCE: cerberus-retrieve.js
// A real route to the actual floating object, then a visible bite, lift and chew.
// Only the canonical S4T changes ownership; the water never destroys a second toy.
function cbfRetrieveRoute(toy){
 const route=s4tPlanRoute(toy,CB);if(!route||route.length<2)return null;
 const bank=route[route.length-2],deep=route[route.length-1],approach=Math.atan2(bank.y-toy.y,bank.x-toy.x);
 for(const radius of [.85,1.15,1.5])for(const turn of [0,.45,-.45,.9,-.9,Math.PI]){
  const a=approach+turn,at={x:toy.x+Math.cos(a)*radius,y:toy.y+Math.sin(a)*radius,water:true};
  if(!s4Pond(at.x,at.y)||!s4tProxyFree(at.x,at.y,true))continue;
  const direct=s4tProxySweep(bank,at,true),viaDeep=s4tProxySweep(deep,at,true),wet=cbfFullyWet(at);
  if(!direct&&!viaDeep||!wet&&!viaDeep)continue;
  CB.retrieveToy={x:toy.x,y:toy.y,z:toy.z};CB.sinkAt={...(wet?at:deep)};
  return [...(direct?route.slice(0,-1):route),at];
 }
 return null;
}
function cbfBeginRetrieve(){
 if(CB.state!=='fetch'||CB.toyHeld||!CB.retrieveToy||S4T.phase!=='water')return false;
 if(Math.hypot(CB.x-S4T.x,CB.y-S4T.y)>1.6)return false;
 CB.state='retrieve';CB.t=0;CB.chewCue=1.35;
 const a=Math.atan2(S4T.y-CB.y,S4T.x-CB.x),cross=Math.cos(a)*(player.y-CB.y)-Math.sin(a)*(player.x-CB.x);
 CB.retrieveFacing=CB.a;CB.retrieveTurn=angle(a+(cross<0?-.8:.8));feed('FOUND IT.');return true;
}
function cbfRetrieveHead(p){
 if(CB.state!=='retrieve')return;
 const t=CB.t,u=t<.85?s4dEase(t/.85):t<1.08?1:1-s4dEase((t-1.08)/.72),target=CB.retrieveToy;
 if(!target)return;
 // Align the actual visible muzzle with the floating item. The attached neck
 // stretches down; after the bite, head and held item rise together.
 p.pose=t>.43&&t<1.1?1:CB.toyHeld&&Math.sin(CB.clock*12)>.3?1:p.pose;
 const across=p.pose===2?(p.flip?-.24:.24)*p.height:0;
 p.x=mix(p.x,target.x+Math.sin(player.a)*across,u);
 p.y=mix(p.y,target.y-Math.cos(player.a)*across,u);
 p.z=mix(p.z,.15-p.height*.48,u);
}
function cbfMouthPoint(){const p=cbHead('chihuahua');return{x:p.x,y:p.y,z:p.z-CB.sink};}
function cbfSyncMouth(){
 if(!CB.toyHeld||S4T.phase!=='mouth')return;
 const p=cbfMouthPoint();Object.assign(S4T,p,{facing:CB.a,returnT:0});
}
function cbfFullyWet(p){
 if(!s4Pond(p.x,p.y))return false;for(let i=0;i<24;i++)if(!s4Pond(p.x+Math.cos(i*TAU/24)*CB_RADIUS,p.y+Math.sin(i*TAU/24)*CB_RADIUS))return false;return true;
}
function cbfRetrieveTick(){
 CB.a=angle(CB.retrieveFacing+angle(CB.retrieveTurn-CB.retrieveFacing)*s4dEase(CB.t/.65));
 if(CB.t>=.88&&!CB.toyHeld){
  CB.toyHeld=true;S4T.phase='mouth';S4T.returnT=0;cbfSyncMouth();
  audio.cerberusCue('chew',cbHead('chihuahua'),2.6);
  emit(CB.retrieveToy.x,CB.retrieveToy.y,.09,'#e0d8b6',settings.reduce?4:10,.35);
 }
 cbfSyncMouth();
 if(CB.toyHeld&&CB.t>=CB.chewCue){CB.chewCue+=.42;audio.cerberusCue('chew',cbHead('chihuahua'),1.8);}
 if(CB.t>=2.25){
  CB.state='fetch';CB.t=0;CB.route=[{...CB.sinkAt,water:true}];CB.routeIndex=0;
  // The body sinks only after holding the object and reaching full-depth water.
  feed('HE HAS HIS TOY.');
 }
}

// SOURCE: hell-gate.js
// The old garden iron has become the lip of something alive. These additions
// reuse the chapter-three tissue/bone materials; no original artwork changes.
const HG={faces:[],veins:[],ribs:[],surface:null,stamp:-1,cross:0};
function hgTissue(slot){return materialPixels[slot]?{w:256,h:256,data:materialPixels[slot]}:null;}
function hgBone(a,b,r0,r1,slot=5,collection=HG.faces){
 const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,side=[-dy/len,dx/len,0],
  other=[-dx/len*(b[2]-a[2]),-dy/len*(b[2]-a[2]),len],ol=Math.hypot(...other)||1;
 for(let i=0;i<5;i++){
  const point=(p,r,j)=>{const t=j*TAU/5;return p.map((v,k)=>v+(side[k]*Math.cos(t)+other[k]/ol*Math.sin(t))*r);};
  collection.push({points:[point(a,r0,i),point(b,r1,i),point(b,r1,i+1),point(a,r0,i+1)],tex:-1,color:[107,35,51],u:1,v:1,slot});
 }
}
function hgBuild(){
 HG.faces=[];HG.veins=[];HG.ribs=[];HG.stamp=-1;HG.cross=0;HG.entered=false;hgBuildWalk();
 // Thick cords consume the stone pillars; ivory hooks crown their silhouette.
 for(const side of [-1,1]){
  const x=43+side*3.52;
  for(let j=0;j<7;j++){
   const z=j*.48,dx=Math.sin(j*1.9)*.18;
   hgBone([x+dx,20.01,z],[x+Math.sin((j+1)*1.9)*.18,19.97,z+.52],.27,.25,6);
   HG.veins.push([[x+dx,20.24,z],[x+Math.sin((j+1)*1.9)*.18,20.24,z+.52]]);
  }
  for(let j=0;j<3;j++){
   const z=2.15+j*.49,a=[x,20.02,z],b=[x+side*(.65-j*.13),20.04,z+.62],c=[x+side*(.36-j*.10),20.01,z+1.04];
   hgBone(a,b,.20,.115);hgBone(b,c,.115,.004);
  }
  // Visible roof of ribs behind the crest and into the threshold.
  for(let j=0;j<3;j++){
   const a=[x,19.2-j*.72,2.9],b=[43+side*2.3,19.15-j*.72,4.1],c=[43+side*.65,19.1-j*.72,4.42];
   hgBone(a,b,.23,.17,6);hgBone(b,c,.17,.045,5);
   HG.veins.push([a,b],[b,c]);
  }
 }
 // Root arteries crawl toward the arena, leaving the walking collision alone.
 for(let j=0;j<7;j++){
  const x=39.8+j*1.04,a=[x,19.62,.035],b=[x+Math.sin(j*2)*.6,21.5,.04],c=[x+Math.sin(j*3),23+j%2,.025];
  hgBone(a,b,.075,.052,6);hgBone(b,c,.052,.005,6);HG.veins.push([a,b],[b,c]);
 }
}
function hgLeafCorruption(){
 const u=s4dEase(CB.gateProgress);
 for(const side of [-1,1]){
  const hinge=side<0?39.65:46.35,ang=side*u*Math.PI*.47,c=Math.cos(ang),s=Math.sin(ang),
   at=(x,z)=>{const dx=x-hinge;return[hinge+dx*c+.075*s,19.5+dx*s+.075*c,z];};
  for(let j=0;j<4;j++){
   const x=43+side*(.42+j*.73),a=at(x,.10),b=at(x+side*.11,1.32),c0=at(x,2.85);
   const faces=[];hgBone(a,b,.075,.09,6,faces);hgBone(b,c0,.09,.01,6,faces);
   for(const f of faces){f.surface=hgTissue(f.slot);s4DrawFace(f);}
   cbvRibbon(at(x,.24),at(x+side*.10,1.22),.017,[225,33,90]);
  }
  // An inverted crown is welded into each leaf, opening with the iron.
  for(let j=0;j<5;j++){
   const a0=j*TAU/5-Math.PI/2,a1=(j+2)*TAU/5-Math.PI/2,center=43+side*1.63;
   cbvRibbon(at(center+Math.cos(a0)*.49,1.93+Math.sin(a0)*.49),at(center+Math.cos(a1)*.49,1.93+Math.sin(a1)*.49),.024,[244,37,111]);
  }
 }
}
function hgWorld(){
 if(!s4Running())return;
 hgRenderWindow();
 if(Math.hypot(player.x-43,player.y-19.5)>44)return;
 for(const f of HG.faces){f.surface=hgTissue(f.slot);s4DrawFace(f);}
 const pulse=settings.reduce?1:.85+Math.sin(CB.clock*2.1)*.15;
 for(const [a,b]of HG.veins)cbvRibbon(a.map((v,i)=>i===1?v-.035:v),b.map((v,i)=>i===1?v-.035:v),.018,[Math.round(239*pulse),23,76]);
 hgLeafCorruption();
}
function hgBeginCrossing(){
 if(!HG.entered){HG.entered=true;feed('THE NIGHT FALLS AWAY. THE STORM IS ALL AROUND.');}
 return true;
}

// SOURCE: hell-walk.js
// Two spaces share a threshold. The view through it is rendered using the
// current camera, real depth, real floor coordinates and actual bridge geometry.
// There is no billboard of a destination and no input-locked crossing movie.
const HG_WALK={x0:40,x1:46,y0:5.5,y1:19.22};
function hgInside(){return s4Running()&&CB.rewarded&&player.y<HG_WALK.y1&&player.x>39.5&&player.x<46.5;}
function hgWalkTick(){
 if(hgInside()){
  hgBeginCrossing();if(player.y<7.3)cbfComplete();
 }
}
function hgWindowPoint(x,y,z){
 const dy=y-player.y;if(Math.abs(dy)<1e-6)return true;
 const t=(HG_WALK.y1-player.y)/dy;if(t<=0||t>=1)return true;
 const atX=mix(player.x,x,t),atZ=mix(.52,z,t);
 return atX>39.65&&atX<46.35&&atZ>-.02&&atZ<3.4;
}
function hgPointVisible(x,y,z){return !hgInside()||y<HG_WALK.y1||hgWindowPoint(x,y,z);}
function hgIndoorTree(p){return p.y<19.23&&p.y>3&&Math.abs(p.x-43)<6.5;}
function hgIndoorFace(f){return f.tex===8&&f.points.every(p=>p[1]<19.23&&p[1]>4&&Math.abs(p[0]-43)<4);}
function hgCarveWalk(){
 const hole={x0:39.9,x1:46.1,y0:5.4,y1:19.24},out=[];
 for(const b of S4.solids){
  if(b.kind!=='forest'||b.x1<=hole.x0||b.x0>=hole.x1||b.y1<=hole.y0||b.y0>=hole.y1){out.push(b);continue;}
  const x0=Math.max(b.x0,hole.x0),x1=Math.min(b.x1,hole.x1),y0=Math.max(b.y0,hole.y0),y1=Math.min(b.y1,hole.y1);
  for(const r of [{x0:b.x0,x1:b.x1,y0:b.y0,y1:y0},{x0:b.x0,x1:b.x1,y0:y1,y1:b.y1},
   {x0:b.x0,x1:x0,y0,y1},{x0:x1,x1:b.x1,y0,y1}])if(r.x1-r.x0>.001&&r.y1-r.y0>.001)out.push({...b,...r});
 }
 S4.solids=out;
 for(let y=6;y<19;y++)for(let x=40;x<46;x++)S4.forest[y*S4_WIDTH+x]=0;
 // Invisible drop protection coincides with the bridge's bone parapets.
 for(const b of [{x0:39.8,x1:40.08,y0:5.4,y1:19.20},{x0:45.92,x1:46.2,y0:5.4,y1:19.20},{x0:40,x1:46,y0:5.4,y1:5.6}])S4.solids.push({...b,kind:'hellParapet'});
}
function hgBuildWalk(){
 HG.walkFaces=[];HG.mask=null;hgCarveWalk();
 const faces=HG.walkFaces;
 // Real slabs, broken parapets, ribs and remote spires establish depth.
 for(const y of [17.8,13.9,10,6.1])for(const side of [-1,1]){
  const x=43+side*3.12,a=[x,y,-.7],b=[x+side*.38,y,1.8],c=[x-side*.44,y,3.65],d=[43+side*.6,y,4.5];
  hgBone(a,b,.25,.22,6,faces);hgBone(b,c,.22,.16,5,faces);hgBone(c,d,.16,.015,5,faces);
  hgBone([x,y,.45],[x,y-3.8,.48],.12,.10,5,faces);
  hgBone([x,y,.1],[x+side*.9,y-.45,-1.7],.17,.03,6,faces);
 }
 for(let i=0;i<7;i++){
  const y=18.8-i*1.95;
  faces.push({points:[[40,y,-.24],[46,y,-.24],[46,y,.005],[40,y,.005]],tex:-1,slot:5,color:[93,40,46],u:1,v:1});
 }
 // Monumental silhouettes stand well beyond the walkable bridge. They move
 // against one another as you strafe; this is not a flattened sky painting.
 for(let i=0;i<17;i++){
  const side=i%2?-1:1,x=43+side*(8+i*2.5),y=-14-(i%4)*11,z=12+(i%5)*4;
  hgBone([x,y,-2],[x+side*.8,y,z*.72],1.8+(i%3)*.7,.9,6,faces);
  hgBone([x+side*.8,y,z*.72],[x-side*1.2,y+1.4,z],.9,.015,5,faces);
 }
}
function hgDrawWalk(){
 for(const f of HG.walkFaces){f.surface=hgTissue(f.slot);f.portalMask=HG.mask;s4DrawFace(f);}
 // Bright veins run along, rather than across, the path. Their world spacing
 // supplies extra movement cues as the player steps through the glassy seam.
 for(const side of [-1,1])for(let i=0;i<9;i++){
  const y=19.18-i*2,x=43+side*2.76;
  const face={points:[[x-.025,y,.018],[x+.025,y,.018],[x+side*.08+.025,y-1.85,.018],[x+side*.08-.025,y-1.85,.018]],tex:-1,color:[248,37,105],u:1,v:1,emissive:true,portalMask:HG.mask};s4DrawFace(face);
 }
}
function hgRenderWindow(){
 const inside=hgInside();if(!inside&&Math.hypot(player.x-43,player.y-19.22)>45)return;
 if(!HG.mask||HG.mask.length!==W*H)HG.mask=new Uint8Array(W*H);else HG.mask.fill(0);
 const sky=S4_ART.sky,stone=materialPixels[0],blood=materialPixels[7],clock=settings.reduce?0:gameTime,depth=S4.depth;
 const stormLight=hgStormFlash();let count=0;
 for(let x=0;x<W;x++){
  const camera=2*x/W-1,dx=camDX+planeX*camera,dy=camDY+planeY*camera,
   at=(HG_WALK.y1-player.y)/(dy||1e-9),gx=player.x+dx*at,
   hits=at>0&&gx>39.65&&gx<46.35,rayLen=Math.hypot(dx,dy),yaw=Math.atan2(dy,dx),
   sx=sky?Math.floor(s4SkyU(yaw)*sky.w):0;
  if(!inside&&!hits)continue;
  const y0=inside?0:Math.max(0,Math.ceil(horizon+(.52-3.4)*projection/at)),y1=inside?H-1:Math.min(H-1,Math.floor(horizon+(.52+.025)*projection/at));
  for(let y=y0;y<=y1;y++){
   const pi=y*W+x,i=pi*4,zAt=.52-(y-horizon)*at/projection,window=hits&&zAt>-.025&&zAt<3.4;
   if(inside?window:!window||depth[pi]<at-.018)continue;
   HG.mask[pi]=1;count++;
   const down=y-horizon,d=down>0?projection*.52/Math.max(.5,down):1e6,
    wx=player.x+dx*d,wy=player.y+dy*d,bridge=down>0&&wx>=40&&wx<=46&&wy<19.25&&wy>-58,
    skyY=sky?clamp(Math.floor((.9-Math.atan2(horizon-y,projection*rayLen)/.68)*sky.h),0,sky.h-1):0,
    si=sky?(skyY*sky.w+sx)*4:0;
   let r=sky?sky.data[si]*1.05+17:27,g=sky?sky.data[si+1]*.11+2:3,b=sky?sky.data[si+2]*.34+13:20,dep=1e6;
   const pitch=Math.atan2(horizon-y,projection*rayLen),moon=Math.hypot(angle(yaw+Math.PI/2)*.82,pitch-.38),halo=Math.exp(-Math.abs(moon-.13)*58);
   r+=halo*146;g+=halo*27;b+=halo*59;if(moon<.115){r=10;g=1;b=13;}
   if(bridge){
    const tx=Math.floor(wx*110)&255,ty=Math.floor(wy*110)&255,ti=(ty*256+tx)*4,
     join=(Math.abs(wx-Math.round(wx))<.026||Math.abs(wy/1.95-Math.round(wy/1.95))<.018)?.44:1,
     near=clamp((19.2-wy)/4,0,1),lit=1/(1+d*.037),glow=Math.exp(-((wx-43)**2)*.3)*.12;
    r=(stone?stone[ti]:69)*(1+near*.37)*join*lit+near*22;
    g=(stone?stone[ti+1]:70)*(.63-near*.34)*join*lit;
    b=(stone?stone[ti+2]:73)*(.72-near*.17)*join*lit+glow*35;dep=d;
   }else if(down>0){
    // The glowing blood sea lies below the raised walkway, not on its floor.
    const sea=projection*2.5/Math.max(.5,down),xx=player.x+dx*sea,yy=player.y+dy*sea,
     tx=(Math.floor(xx*54+Math.sin(yy+clock*.4)*3)&255),ty=(Math.floor(yy*54-clock*4)&255),ti=(ty*256+tx)*4,
     f=1/(1+sea*.025);
    r=(blood?blood[ti]:85)*f*.9+29;g=(blood?blood[ti+1]:13)*f*.17+2;b=(blood?blood[ti+2]:24)*f*.5+16;dep=sea;
   }
   r+=stormLight*56;g+=stormLight*35;b+=stormLight*57;
   if(!inside){
    // A thin reflective sheen remains at the window; the world beyond has
    // full perspective and depth. Its edge never becomes an opaque texture.
    const edge=Math.max(0,1-Math.min(gx-39.65,46.35-gx,zAt,3.4-zAt)/.12),sheen=edge*.32;
    const film=.025+.025*Math.pow(Math.max(0,Math.sin(gx*1.4+zAt*2.1-clock*.32)),12);
    r=mix(r,198,sheen+film);g=mix(g,167,sheen+film);b=mix(b,225,sheen+film);
   }
   px[i]=r;px[i+1]=g;px[i+2]=b;px[i+3]=255;depth[pi]=dep;
  }
 }
 if(count)hgDrawWalk();
}

// SOURCE: hell-storm.js
// The destination is a storm, audible through the opening and surrounding you
// on the bridge. Bounded visual work and two cached audio buffers; no new score.
const HG_STORM={clock:0,thunder:-1};
function hgStormStrength(){
 if(!s4Running()||!CB.rewarded)return 0;
 if(hgInside())return 1;
 const d=Math.hypot(player.x-43,player.y-19.22);
 return clamp((22-d)/18,0,1)*CB.gateProgress*(lineOfSight(player.x,player.y,43,20.5)?1:.08);
}
function hgStormFlash(){
 if(settings.reduce||!s4Running()||!CB.rewarded)return 0;
 const t=HG_STORM.clock%9.4-2;
 return t>=0&&t<.16?Math.sin(t/.16*Math.PI)*.7:t>=.29&&t<.48?Math.sin((t-.29)/.19*Math.PI)*.36:0;
}
audio.hellStormBuffer=function(thunder=false){
 const key=thunder?'hgThunderBuffer':'hgWindBuffer';if(this[key])return this[key];
 const rate=16000,n=rate*(thunder?6:16),fade=rate/2,b=this.ctx.createBuffer(2,n,rate);
 let seed=thunder?43172:89123;
 for(let ch=0;ch<2;ch++){
  const raw=new Float32Array(n+fade);let low=0,mid=0,air=0;
  for(let i=0;i<raw.length;i++){
   seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/2147483648-1,t=i/rate;
   low=low*.993+white*.007;mid=mid*.94+white*.06;air=air*.60+white*.40;
   if(thunder){
    const start=Math.max(0,t-ch*.027),roll=Math.exp(-start*.8)*(1+.24*Math.sin(start*9)),
     attack=Math.min(1,start*38),crack=Math.exp(-start*24)*air*1.7;
    raw[i]=Math.tanh((low*5.3+mid*.85)*roll+crack)*attack*Math.min(1,(6-t)*2);
   }else{
    const gust=.64+.17*Math.sin(t*.73+ch*.65)+.11*Math.sin(t*1.69+ch),
     whistle=Math.sin(t*TAU*(183+ch*9)+Math.sin(t*.7)*8)*.009;
    raw[i]=Math.tanh((low*2.1+mid*.76+(air-mid)*.27)*gust+whistle);
   }
  }
  const out=b.getChannelData(ch);
  for(let i=0;i<n;i++){const blend=Math.min(1,i/fade);out[i]=thunder?raw[i]:raw[i]*blend+(i<fade?raw[n+i]*(1-blend):0);}
 }
 this[key]=b;return b;
};
audio.hellStormStop=function(){
 for(const group of [this.hgWind,this.hgThunder])if(group){
  group.source.onended=null;try{group.source.stop();}catch{}
  for(const n of group.nodes)try{n.disconnect();}catch{}
 }
 this.hgWind=this.hgThunder=null;
};
audio.hellStormLayer=function(thunder=false){
 const a=this.ctx,source=a.createBufferSource(),filter=a.createBiquadFilter(),gain=a.createGain(),pan=a.createStereoPanner();
 source.buffer=this.hellStormBuffer(thunder);source.loop=!thunder;filter.type='lowpass';filter.frequency.value=1200;
 gain.gain.value=0;source.connect(filter).connect(gain).connect(pan).connect(this.sfx);
 const layer={source,filter,gain,pan,nodes:[source,filter,gain,pan]};
 if(thunder)source.onended=()=>{for(const n of layer.nodes)n.disconnect();if(this.hgThunder===layer)this.hgThunder=null;};
 source.start(a.currentTime);return layer;
};
audio.hellStormTick=function(dt){
 if(mode!=='playing')return;
 if(!s4Running()||!CB.rewarded){if(this.hgWind||this.hgThunder)this.hellStormStop();return;}
 HG_STORM.clock+=dt;
 const strength=hgStormStrength();if(!this.ctx||!this.active)return;
 if(strength>.005&&!this.hgWind)this.hgWind=this.hellStormLayer();
 const t=this.ctx.currentTime,inside=hgInside(),dx=43-player.x,dy=19.22-player.y,
  pan=inside?0:clamp((dy*Math.cos(player.a)-dx*Math.sin(player.a))/(Math.hypot(dx,dy)||1),-1,1)*.75;
 if(this.hgWind){
  this.hgWind.gain.gain.setTargetAtTime(strength*(inside?1.13:.84),t,.5);
  this.hgWind.filter.frequency.setTargetAtTime(inside?6100:900+strength*2100,t,.4);
  this.hgWind.pan.pan.setTargetAtTime(pan,t,.25);
 }
 const cycle=Math.floor(HG_STORM.clock/9.4),phase=HG_STORM.clock%9.4;
 if(phase>=2.7&&HG_STORM.thunder!==cycle){
  HG_STORM.thunder=cycle;
  if(strength>.03&&!this.hgThunder){
   this.hgThunder=this.hellStormLayer(true);
   this.hgThunder.gain.gain.setValueAtTime(strength*.9,t);
   this.hgThunder.filter.frequency.setValueAtTime(inside?3400:1200+strength*1500,t);
   this.hgThunder.pan.pan.setValueAtTime(inside?(cycle%2?.34:-.34):pan,t);
  }
 }
 if(this.hgThunder){
  this.hgThunder.gain.gain.setTargetAtTime(strength*.9,t,.25);
  this.hgThunder.filter.frequency.setTargetAtTime(inside?3400:1200+strength*1500,t,.25);
  this.hgThunder.pan.pan.setTargetAtTime(inside?(cycle%2?.34:-.34):pan,t,.25);
 }
 // The quiet courtyard mix is preserved outside. Wildlife recedes inside.
 if(inside)for(const n of this.s4Nodes||[])n.gain.gain.setTargetAtTime(n.kind==='wind'?.02:0,t,.45);
};
function hgStormLine(a,b,color,width,alpha){
 const p=project(...a),q=project(...b);if(!p||!q)return;
 for(const v of [p,q]){
  if(v.x<0||v.x>=W||v.y<0||v.y>=H)return;
  const index=(v.y|0)*W+(v.x|0);
  if(!HG.mask?.[index]||S4.depth[index]<v.d-.12)return;
 }
 wc.strokeStyle=color;wc.globalAlpha=alpha;wc.lineWidth=width;
 wc.beginPath();wc.moveTo(p.x,p.y);wc.lineTo(q.x,q.y);wc.stroke();
}
function hgStormDraw(){
 if(!s4Running()||!CB.rewarded||Math.hypot(player.x-43,player.y-19.22)>35)return;
 const clock=settings.reduce?0:HG_STORM.clock;
 wc.save();
 // Fixed population. Ash travels across the actual bridge in perspective.
 for(let i=0;i<72;i++){
  const x=34+((i*7.131+clock*(2.8+i%3*.35))%19),
   y=19.1-((i*3.173+clock*.8)%26),z=.08+((i*.731+clock*.37)%3.7),
   length=settings.reduce?.025:.15+(i%4)*.04;
  hgStormLine([x,y,z],[x-length,y+.025,z+.07],i%5?'#d9b8b1':'#fb738d',1,i%5?.28:.46);
 }
 const flash=hgStormFlash();
 if(flash>0){
  const side=Math.floor(HG_STORM.clock/9.4)%2?1:-1,bolt=[];
  for(let j=0;j<9;j++)bolt.push([43+side*9+Math.sin(j*7.3)*1.2,-34+j*.27,10-j*.9]);
  for(let j=1;j<bolt.length;j++)hgStormLine(bolt[j-1],bolt[j],'#f2dbea',1.5,flash);
 }
 wc.restore();
}
const hgStormPreviousTick=audio.tick.bind(audio),hgStormPreviousReset=audio.reset.bind(audio);
audio.tick=function(dt=0){hgStormPreviousTick(dt);this.hellStormTick(dt);};
audio.reset=function(){this.hellStormStop();HG_STORM.clock=0;HG_STORM.thunder=-1;hgStormPreviousReset();};

// SOURCE: wayfinding.js
// R4-P07: stable destinations, traversable routes, and deliberate hospital use.
// Navigation ignores creatures. It never owns quest state or changes collision.
const WF_BREAKER={x:56.86,y:9,id:'mains',label:'Plant Hall',nx:-1,ny:0};
const WF={map:null,key:'',open:null,edges:null,field:null,targetKey:'',selected:'',path:[],
 seen:null,cell:-1,at:-1,routeBuilds:0,gridBuilds:0,wasUncharted:false};
function wfUncharted(){return !!(CH.maze||CH.tr||liminal.mode||hgInside());}
function wfTopologyKey(){return [stage,useChapter,CH.power,FV.closed,FV.returnOpen,
 HW.resolved,HB.state,S4Q.moved,S4Q.gate,CB.rewarded,S4D.phase].join('|');}
function wfFree(x,y,r=.21){return !wall(x-r,y-r)&&!wall(x+r,y-r)&&
 !wall(x-r,y+r)&&!wall(x+r,y+r)&&furnitureFree(x,y,r);}
function wfClear(a,b){
 const steps=Math.max(1,Math.ceil(Math.hypot(a.x-b.x,a.y-b.y)*5));
 for(let i=1;i<=steps;i++)if(!wfFree(mix(a.x,b.x,i/steps),mix(a.y,b.y,i/steps)))return false;
 return true;
}
function wfSync(){
 const key=wfTopologyKey();
 if(WF.map!==map){
  WF.map=map;WF.key='';WF.selected='';WF.seen=new Uint8Array(MW*MH);WF.cell=-1;
 }
 if(WF.key!==key){
  WF.key=key;WF.open=null;WF.edges=null;WF.field=null;WF.targetKey='';WF.path=[];WF.at=-1;
 }
 // Discover the local footprint, not enemies and not the solution to a liminal space.
 const cell=(player.y|0)*MW+(player.x|0),uncharted=wfUncharted();
 if(uncharted!==WF.wasUncharted){WF.wasUncharted=uncharted;WF.seen.fill(0);WF.cell=-1;WF.path=[];WF.field=null;}
 if(cell!==WF.cell){
  WF.cell=cell;
  for(let y=Math.max(0,(player.y|0)-6);y<Math.min(MH,(player.y|0)+7);y++)
   for(let x=Math.max(0,(player.x|0)-6);x<Math.min(MW,(player.x|0)+7);x++)
    if(Math.hypot(x+.5-player.x,y+.5-player.y)<7&&lineOfSight(player.x,player.y,x+.5,y+.5))WF.seen[y*MW+x]=1;
 }
}
function wfTargets(){
 if(wfUncharted()||s4dLocked())return [];
 if(chRunning())return [CH.power?{...exit,id:'security',label:'Security door'}:{...WF_BREAKER}];
 if(fvRunning()){
  if(FV.closed>=3)return [{...exit,id:'airlock',label:'Exit airlock'}];
  return FV.valves.filter(v=>!v.closed&&!(v.id==='OR3'&&FV.purgeT>0))
   .map(v=>({x:v.x,y:v.y-1.38,id:v.id,label:{OR1:'OR 1 · Power',OR2:'OR 2 · Vent',OR3:'OR 3 · Purge'}[v.id]}));
 }
 if(hwRunning())return HW.resolved?[{...exit,id:'exit',label:'Main entrance'}]:
  HB.state==='dormant'?[{x:32.5,y:11.5,id:'heart',label:'Heart chamber'}]:[];
 if(s4Running()){
  if(cbRunning()&&!CB.rewarded)return []; // Let the encounter and the toy's light speak.
  if(CB.rewarded)return [{x:43,y:18.8,id:'gate',label:'Garden gates'}];
  if(s4qRunning()){
   if(S4Q.moved)return [{x:43,y:30,id:'garden',label:'Garden gates'}];
   if(S4Q.keys&&S4Q.ext)return [{x:61.5,y:43,id:'wreck',label:'Ambulance'}];
   return [...(!S4Q.keys?[{...S4Q_KEYS,id:'keys',label:'Parking · Staff 04'}]:[]),
    ...(!S4Q.ext?[{...S4Q_EXT,id:'ext',label:'Bus shelter'}]:[])];
  }
  return [];
 }
 return cleared?[{...exit,id:'exit',label:'Exit'}]:[];
}
function wfTarget(){
 const list=wfTargets();
 let target=list.find(t=>t.id===WF.selected);
 if(!target){target=list[0]||null;WF.selected=target?.id||'';WF.field=null;WF.targetKey='';}
 return target;
}
function wfGrid(){
 if(WF.open)return;
 WF.open=new Uint8Array(MW*MH);WF.gridBuilds++;
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)
  if((s4Running()||map[y]?.[x]===0)&&wfFree(x+.5,y+.5))WF.open[y*MW+x]=1;
 WF.edges=new Uint8Array(MW*MH);
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
  const i=y*MW+x;if(!WF.open[i])continue;
  if(WF.open[i+1]&&wfFree(x+1,y+.5)){WF.edges[i]|=2;WF.edges[i+1]|=1;}
  if(WF.open[i+MW]&&wfFree(x+.5,y+1)){WF.edges[i]|=8;WF.edges[i+MW]|=4;}
 }
}
function wfNearestCell(p,requireVisible=false){
 let best=-1,dist=Infinity;
 for(let y=Math.max(1,(p.y|0)-3);y<Math.min(MH-1,(p.y|0)+4);y++)
  for(let x=Math.max(1,(p.x|0)-3);x<Math.min(MW-1,(p.x|0)+4);x++){
   const n=y*MW+x,d=Math.hypot(x+.5-p.x,y+.5-p.y);
   if(WF.open[n]&&d<dist&&(!requireVisible||lineOfSight(x+.5,y+.5,p.x,p.y))){best=n;dist=d;}
  }
 return best;
}
function wfRoute(target=wfTarget()){
 if(!target||wfUncharted()){WF.path=[];return [];}
 wfGrid();
 const targetKey=target.id+':'+target.x+','+target.y;
 if(WF.targetKey!==targetKey||!WF.field){
  WF.targetKey=targetKey;WF.field=new Int16Array(MW*MH);WF.field.fill(-1);WF.at=-1;
  const goal=wfNearestCell(target,true),queue=new Int32Array(MW*MH);let head=0,tail=0;
  if(goal>=0){queue[tail++]=goal;WF.field[goal]=0;}
  while(head<tail){
   const i=queue[head++],x=i%MW,y=(i/MW)|0;
   for(const [n,bit] of [[i-1,1],[i+1,2],[i-MW,4],[i+MW,8]])
    if((WF.edges[i]&bit)&&WF.field[n]<0){WF.field[n]=WF.field[i]+1;queue[tail++]=n;}
  }
  WF.routeBuilds++;
 }
 const cell=wfNearestCell(player,true);
 if(WF.at===cell)return WF.path;
 WF.at=cell;WF.path=[];if(cell<0||WF.field[cell]<0)return WF.path;
 let i=cell;
 for(let count=0;count<MW*MH;count++){
  WF.path.push({x:i%MW+.5,y:((i/MW)|0)+.5});
  if(WF.field[i]===0)break;
  const next=[[i-1,1],[i+1,2],[i-MW,4],[i+MW,8]].find(([n,bit])=>(WF.edges[i]&bit)&&WF.field[n]===WF.field[i]-1)?.[0];
  if(next===undefined)break;i=next;
 }
 return WF.path;
}
function wfBearing(target){
 if(!target)return null;
 const d=Math.hypot(target.x-player.x,target.y-player.y);
 if(d<2.7&&lineOfSight(player.x,player.y,target.x,target.y))return {near:true,point:target};
 const route=wfRoute(target);let point=null;
 for(let i=0;i<Math.min(route.length,9);i++){
  if(wfClear(player,route[i]))point=route[i];else break;
 }
 if(!point||Math.hypot(point.x-player.x,point.y-player.y)<.2)return null;
 return {point,angle:angle(Math.atan2(point.y-player.y,point.x-player.x)-player.a)};
}
function wfBreakerNear(){
 return chRunning()&&!wfUncharted()&&mode==='playing'&&
  Math.hypot(player.x-WF_BREAKER.x,player.y-WF_BREAKER.y)<2.4&&
  Math.abs(angle(Math.atan2(WF_BREAKER.y-player.y,WF_BREAKER.x-player.x)-player.a))<.8&&
  lineOfSight(player.x,player.y,WF_BREAKER.x,WF_BREAKER.y);
}
function chInteract(){
 if(!wfBreakerNear())return false;
 if(CH.power){feed('MAINS ONLINE / SECURITY DOOR RELEASED');return true;}
 chRestorePower();wfSync();hudUpdate();return true;
}
function wfHud(){
 wfSync();const target=wfTarget(),bearing=mode==='playing'?wfBearing(target):null;
 const arrow=$('compassArrow'),label=$('compassText');
 arrow.style.transform='none';arrow.style.visibility='visible';
 $('compass').classList.toggle('hidden',!target||mode!=='playing'||wfUncharted());
 if(target){
  arrow.textContent=!bearing?'·':bearing.near?'◇':Math.abs(bearing.angle)>2.45?'↶':bearing.angle<-.38?'‹':bearing.angle>.38?'›':'↑';
  label.textContent=target.label;
  $('compass').setAttribute('aria-label',target.label+': '+(!bearing?'follow the signs':bearing.near?'nearby':Math.abs(bearing.angle)>2.45?'turn around':bearing.angle<-.38?'turn left':bearing.angle>.38?'turn right':'ahead'));
  $('wfNavHint').textContent=!bearing?'FOLLOW SIGNS':bearing.near?'NEARBY':
   Math.abs(bearing.angle)>2.45?'TURN AROUND':bearing.angle<-.38?'TURN LEFT':bearing.angle>.38?'TURN RIGHT':'AHEAD';
 }
 if(chRunning()&&!wfUncharted()){
  $('fvStatus').classList.remove('hidden');
  $('fvStatus').textContent=CH.power?'Service return is open. Leave through Security.':'Ward 1 → Service Riser → Plant Hall';
  const near=wfBreakerNear();$('interactPrompt').classList.toggle('hidden',!near);$('touchUse').classList.toggle('hidden',!near);
  if(near){
   $('interactAction').textContent=CH.power?'MAINS · ONLINE':(coarse?'USE · ':'[E] ')+'RESTORE MAINS POWER';
   $('interactHint').textContent=CH.power?'Security is unlocked. Take the service return.':'Releases the Security door and opens the service return.';
   $('interactPrompt').style.borderColor='#bbab7b';$('touchUse').textContent=CH.power?'ONLINE':'POWER';
  }
 }
 if(fvRunning()){
  const parts=['OR1','OR2','OR3'].map((id,i)=>(fvSystem(id)?.closed?'✓ ':'○ ')+['Power','Vent','Purge'][i]);
  $('wfSystems').textContent=parts.join('   ');
 }else $('wfSystems').textContent='';
 $('wfSystems').classList.toggle('hidden',!fvRunning());
}

// SOURCE: ward-signs.js
// Real, depth-clipped enamel faces. Text shares the board's perspective, never
// an independent floating label. Exterior signs retain their approved renderer.
const WF_SIGN_CACHE=new Map(),WF_FACE_CACHE=new WeakMap();
function wfText(c,text,x,y,width,size,color='#e0e1c8',align='left'){
 c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;
 c.font='600 '+size+'px Arial, "DejaVu Sans", sans-serif';
 while(c.measureText(text).width>width&&size>12)c.font='600 '+(--size)+'px Arial, "DejaVu Sans", sans-serif';
 c.fillText(text,x,y);
}
function wfSignLines(label){
 return String(label||'WARD').replace(/W[‑–]0/g,'W-0').trim().split(/\s*\/\s*|\s{2,}/).filter(Boolean).slice(0,3);
}
function wfSignTexture(p){
 let label=p.label;
 if(chRunning()&&label==='NO POWER')label=CH.power?'MAINS ONLINE / SECURITY OPEN':'MAINS OFFLINE / PLANT HALL';
 const lines=wfSignLines(label),arch=p.kind==='arch',small=/^W[-‑–]0\d$|^BAY \d$/.test(label),key='sign:'+arch+':'+lines.join('|');
 if(WF_SIGN_CACHE.has(key))return WF_SIGN_CACHE.get(key);
 const img=document.createElement('canvas');img.width=small?384:768;img.height=arch?54:small?132:lines.length>1?146:114;
 const c=img.getContext('2d'),h=img.height,w=img.width;
 c.fillStyle='#111f21';c.fillRect(0,0,w,img.height);
 c.fillStyle='#74817a';c.fillRect(2,2,w-4,img.height-4);c.fillStyle='#283e3d';c.fillRect(5,5,w-10,img.height-10);
 const tint=/POWER|PLANT|HV/.test(label)?'#ae9871':/OR |PURGE|STERILE|THEATRE/.test(label)?'#879b96':'#9ca99b';
 c.fillStyle=tint;c.fillRect(12,12,5,h-24);
 c.fillStyle='#bfc2ac20';c.fillRect(18,7,w-38,2);
 for(const x of [28,w-28])for(const y of [18,h-18]){
  c.fillStyle='#a4aaa0';c.beginPath();c.arc(x,y,3,0,TAU);c.fill();c.fillStyle='#1a2528';c.fillRect(x-2,y,4,1);
 }
 // Fixed stains, not per-frame noise; the lettering stays clean and legible.
 c.fillStyle='#00000016';for(let i=0;i<22;i++)c.fillRect((i*113+21)%w,(i*37)%h,3+(i%11),1);
 const texts=arch?[lines.join(' · ')]:lines;
 texts.forEach((text,i)=>wfText(c,text,arch||small?w/2:52,(i+.5)*h/texts.length,w-100,arch?34:small?62:lines.length>1?42:59,undefined,arch||small?'center':'left'));
 WF_SIGN_CACHE.set(key,img);return img;
}
function wfSignFace(p){
 if(p.kind==='arch'){
  let nx=Math.sin(p.a),ny=-Math.cos(p.a);
  if((player.x-p.x)*nx+(player.y-p.y)*ny<0){nx=-nx;ny=-ny;}
  return {x:p.x+nx*.128,y:p.y+ny*.128,nx,ny,z:1.104,w:1.82,h:.127};
 }
 const cached=WF_FACE_CACHE.get(p);if(cached&&cached.map===map)return cached.face;
 let nx=p.nx??Math.sin(p.a),ny=p.ny??Math.cos(p.a),x=p.x,y=p.y;
 // Some old room plaques were a cell deep inside masonry. Find the exposed
 // side on this wall axis and mount just proud of it, never through the wall.
 if(p.nx===undefined){
  const candidates=[];
  for(const sign of [1,-1])for(let step=0;step<=26;step++){
   const offset=step*.05,xx=x+nx*sign*offset,yy=y+ny*sign*offset;
   if(!wall(xx+nx*sign*.05,yy+ny*sign*.05)){
    const backing=wall(xx-nx*sign*.12,yy-ny*sign*.12);
    candidates.push({x:xx+nx*sign*.055,y:yy+ny*sign*.055,nx:nx*sign,ny:ny*sign,score:offset+(backing?0:.8)+(sign<0?2:0)});break;
   }
  }
  candidates.sort((a,b)=>a.score-b.score);if(candidates.length)({x,y,nx,ny}=candidates[0]);
 }
 const lines=wfSignLines(p.label),small=/^W[-‑–]0\d$|^BAY \d$/.test(p.label),
  face={x,y,nx,ny,z:p.z||.86,w:p.w||(small?.72:1.68),h:p.h||(lines.length>1?.32:.25)};
 WF_FACE_CACHE.set(p,{map,face});return face;
}
function wfDrawFace(texture,f){
 const dot=(player.x-f.x)*f.nx+(player.y-f.y)*f.ny;
 if(dot<.018||dot>19)return;
 const tx=f.ny,ty=-f.nx,midDepth=(f.x-player.x)*camDX+(f.y-player.y)*camDY;
 if(midDepth+f.w/2<.075||Math.hypot(f.x-player.x,f.y-player.y)>20)return;
 const a=project(f.x-tx*f.w/2,f.y-ty*f.w/2,f.z),b=project(f.x+tx*f.w/2,f.y+ty*f.w/2,f.z);
 const left=a&&b?Math.max(0,Math.floor(Math.min(a.x,b.x))):0,
  right=a&&b?Math.min(W-1,Math.ceil(Math.max(a.x,b.x))):W-1;
 if(right-left<3)return;
 wc.save();wc.imageSmoothingEnabled=true;
 // Column sampling gives perspective-correct text even at an oblique angle.
 // A bounded W columns also makes grazing/near-plane cases cheap and finite.
 for(let sx=left;sx<=right;sx++){
  const camera=2*(sx+.5)/W-1,dx=camDX+planeX*camera,dy=camDY+planeY*camera,
   den=dx*f.nx+dy*f.ny;
  if(Math.abs(den)<1e-6)continue;
  const d=-dot/den;
  if(d<=.075||d>22||zBuffer[sx]<d-.065)continue;
  const u=((player.x+dx*d-f.x)*tx+(player.y+dy*d-f.y)*ty)/f.w+.5;
  if(u<0||u>=1)continue;
  const top=horizon+(.52-f.z-f.h/2)*projection/d,height=f.h*projection/d;
  const y0=Math.max(0,top),y1=Math.min(H,top+height);if(y1<=y0)continue;
  wc.drawImage(texture,Math.min(texture.width-1,(u*texture.width)|0),(y0-top)/height*texture.height,
   1,(y1-y0)/height*texture.height,sx,y0,1,y1-y0);
  wc.fillStyle='rgba(3,9,15,'+clamp(.07+d*.022,.08,.51)+')';wc.fillRect(sx,y0,1,y1-y0);
 }
 wc.restore();
}
function wfDrawSign(p){wfDrawFace(wfSignTexture(p),wfSignFace(p));}
function wfPanelTexture(id,done,ready=true,progress=0){
 // The only animated face is the 12-step purge display. No unbounded cache.
 const tick=Math.floor(progress*12),key='panel:'+id+':'+done+':'+ready+':'+tick;
 if(WF_SIGN_CACHE.has(key))return WF_SIGN_CACHE.get(key);
 const img=document.createElement('canvas');img.width=480;img.height=300;const c=img.getContext('2d');
 c.fillStyle='#101c20';c.fillRect(0,0,480,300);c.fillStyle='#737b73';c.fillRect(3,3,474,294);
 c.fillStyle='#33423f';c.fillRect(9,9,462,282);c.fillStyle='#132626';c.fillRect(24,22,432,65);
 const names={mains:'MAINS / PLANT',OR1:'OR 1 / POWER',OR2:'OR 2 / VENT',OR3:'OR 3 / PURGE',recovery:'RECOVERY SUPPLY'};
 wfText(c,names[id],40,54,400,31);
 const color=done?'#a4bdb0':!ready?'#626e6a':id==='OR3'?'#b77676':id==='OR2'?'#8aafad':'#c1a973';
 c.fillStyle='#081717';c.fillRect(34,105,270,122);
 if(id==='mains'||id==='OR1'){
  c.fillStyle='#c1baa0';c.fillRect(47,119,131,69);c.strokeStyle='#243b38';c.lineWidth=3;
  c.beginPath();c.arc(112,181,51,Math.PI,TAU);c.stroke();
  c.beginPath();c.moveTo(112,181);c.lineTo(done?147:79,143);c.stroke();
  c.fillStyle='#172523';c.fillRect(221,112,23,103);c.fillStyle='#787e70';c.fillRect(218,done?117:181,30,30);
  c.fillStyle=color;c.fillRect(204,done?111:175,57,17);
 }else if(id==='OR2'){
  c.strokeStyle='#83968f';c.lineWidth=3;c.beginPath();c.arc(116,165,48,0,TAU);c.stroke();
  for(let i=0;i<4;i++){
   const a=i*TAU/4+.4;c.save();c.translate(116,165);c.rotate(a);c.fillStyle='#778b83';c.beginPath();c.ellipse(19,0,25,11,0,0,TAU);c.fill();c.restore();
  }
  c.fillStyle='#152522';for(let y=126;y<210;y+=12)c.fillRect(63,y,106,3);
  c.strokeStyle=color;c.beginPath();c.arc(240,166,25,0,TAU);c.stroke();c.fillStyle=color;c.fillRect(237,140,6,30);
 }else if(id==='OR3'){
  c.fillStyle='#706f59';c.fillRect(54,115,111,106);c.fillStyle='#172624';c.fillRect(60,121,99,94);
  c.fillStyle=done?'#5b7165':'#b45856';c.beginPath();c.arc(109,169,30,0,TAU);c.fill();
  c.strokeStyle='#9f9e83';c.lineWidth=7;c.strokeRect(74,128,70,76);
  wfText(c,tick&&!done?String(12-tick).padStart(2,'0')+'s':done?'OFF':'READY',231,155,108,26,color,'center');
  c.fillStyle='#4e615b';c.fillRect(189,188,94,10);c.fillStyle=color;c.fillRect(189,188,94*(done?1:progress),10);
 }else{
  c.strokeStyle='#8a9d91';c.lineWidth=3;c.strokeRect(46,116,242,101);
  c.fillStyle=ready&&!done?'#b6c6ad':'#78877b';c.fillRect(100,137,21,61);c.fillRect(80,157,61,21);
  c.fillStyle='#9ca896';c.fillRect(259,150,7,36);
 }
 c.fillStyle='#1a2825';c.fillRect(328,107,116,121);c.fillStyle=color;c.beginPath();c.arc(386,137,10,0,TAU);c.fill();
 wfText(c,done?'DONE':ready?'READY':'OFF',386,182,100,23,color,'center');
 wfText(c,id==='mains'?(done?'SECURITY RELEASED':'SECURITY INTERLOCK'):id==='recovery'?'EMERGENCY USE ONLY':done?'SYSTEM ISOLATED':'LOCAL ISOLATION CONTROL',240,262,424,22,'#bdc1ac','center');
 for(const x of [18,462])for(const y of [18,282]){c.fillStyle='#9b9f8f';c.beginPath();c.arc(x,y,3,0,TAU);c.fill();}
 WF_SIGN_CACHE.set(key,img);return img;
}
function wfDrawControl(p){
 const id=p.fvSystem||'mains',info=id==='mains'?{done:CH.power,ready:true,progress:0}:fvControlInfo(id),
  nx=id==='mains'?-1:Math.sin(p.a),ny=id==='mains'?0:-Math.cos(p.a);
 wfDrawFace(wfPanelTexture(id,info.done,info.ready,info.progress),{
  x:p.x+nx*.089,y:p.y+ny*.089,nx,ny,z:.66,w:.8,h:.5});
}
// These are labels and a wall-mounted panel only; no extra floor obstacles.
const WF_ADMISSIONS_PROPS=[
 {kind:'wf_control',...WF_BREAKER,a:-Math.PI/2},
 {kind:'sign',x:27.96,y:48.3,a:-Math.PI/2,label:'← WARD 1 / PLANT HALL'},
 {kind:'sign',x:31.94,y:29.4,a:-Math.PI/2,label:'← WARD 1 / SERVICE RISER'},
 {kind:'sign',x:50.91,y:20.9,a:-Math.PI/2,label:'← PLANT HALL / VIA RISER'},
 {kind:'sign',x:56.88,y:7.2,a:-Math.PI/2,label:'MAINS SWITCH / SECURITY INTERLOCK'}
];
function wfExtraProps(){return chRunning()&&!wfUncharted()?WF_ADMISSIONS_PROPS:[];}

// SOURCE: ward-map.js
// A quiet, paused hospital plan plus a local Tab peek. No enemy radar.
const WF_MAP={parent:'playing',w:0,h:0};
const WF_ROOM_LABELS={
 0:[[26.5,55,'RECEPTION',16],[10,40,'TRIAGE',9],[41,40,'WARD 2',13],[24,26,'NURSES',7],
    [17,27.4,'RECORDS',7],[32,21.4,'WARD 1',15],[49.5,15.5,'RISER',5],[44,7.5,'PLANT HALL',15]],
 1:[[17.5,24,'OR 1',10],[38.5,24,'OR 2',11],[38.5,40,'OR 3',11],[17.5,40,'RECOVERY',12],
    [27.5,32.5,'SPINE',6],[50.5,31,'STORE',6],[17,13.5,'NORTH RING',14],[8,55.5,'VESTIBULE',11]],
 2:[[27,56,'RECEPTION',15],[32.5,12,'HEART',16],[50.5,31,'RISER',6],[25,2.5,'MAIN ENTRANCE',17]],
 3:[[64,56,'HOSPITAL',27],[65,47,'COURTYARD',13],[94,71,'PARKING',22],[130,9,'BUS SHELTER',20],
    [25,47,'POND',24],[43,28,'GARDEN',13],[82,22,'CITY ROAD',17]]
};
function wfMapTitle(){return wfUncharted()?'UNCHARTED':s4Running()?'HOSPITAL GROUNDS':
 chRunning()?'ADMISSIONS':fvRunning()?'FEVER THEATRE':hwRunning()?'HEART WARD':wardNames[stage];}
function wfMapMarkers(){
 if(wfUncharted())return [];
 if(chRunning())return [{...WF_BREAKER,mark:'P',done:CH.power},{...exit,id:'security',label:'Security',mark:'X',locked:!CH.power}];
 if(fvRunning())return [...FV.valves.map((v,i)=>({x:v.x,y:v.y-1.38,id:v.id,mark:String(i+1),label:FV_SYSTEMS[v.id].name,done:v.closed})),
  {...FV_RECOVERY,mark:'+',label:'Recovery supply',done:FV.recoveryUsed,locked:!fvSystem('OR1')?.closed},
  {...exit,id:'airlock',mark:'X',label:'Exit airlock',locked:FV.closed<3}];
 return wfTargets().map(t=>({...t,mark:t.id==='exit'||t.id==='gate'?'X':'◇'}));
}
function wfMapBounds(local){
 if(local)return {x0:player.x-14,y0:player.y-14,x1:player.x+14,y1:player.y+14};
 if(s4Running()&&!wfUncharted())return {x0:0,y0:0,x1:144,y1:96};
 let x0=MW,y0=MH,x1=0,y1=0;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]===0&&(!wfUncharted()||WF.seen[y*MW+x])){
  x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);
 }
 if(x1<=x0)return {x0:player.x-8,y0:player.y-8,x1:player.x+8,y1:player.y+8};
 return {x0:x0-2,y0:y0-2,x1:x1+2,y1:y1+2};
}
function wfDrawMap(c,w,h,local=false){
 wfSync();const unknown=wfUncharted(),bounds=wfMapBounds(local),pad=local?7:24,
  scale=Math.min((w-pad*2)/(bounds.x1-bounds.x0),(h-pad*2)/(bounds.y1-bounds.y0)),
  ox=(w-(bounds.x1-bounds.x0)*scale)/2-bounds.x0*scale,
  oy=(h-(bounds.y1-bounds.y0)*scale)/2-bounds.y0*scale,
  X=x=>ox+x*scale,Y=y=>oy+y*scale;
 c.clearRect(0,0,w,h);c.fillStyle='#0d191e';c.fillRect(0,0,w,h);
 c.save();c.beginPath();c.rect(pad/2,pad/2,w-pad,h-pad);c.clip();
 if(s4Running()&&!unknown)wfGrid();
 for(let y=Math.max(0,Math.floor(bounds.y0));y<Math.min(MH,Math.ceil(bounds.y1));y++)
  for(let x=Math.max(0,Math.floor(bounds.x0));x<Math.min(MW,Math.ceil(bounds.x1));x++){
   const i=y*MW+x,seen=WF.seen[i];if(unknown&&!seen)continue;
   const floor=s4Running()?(unknown?!wall(x+.5,y+.5):!!WF.open?.[i]):map[y][x]===0;
   c.fillStyle=floor?(seen?'#3b5050':'#263b40'):s4Running()&&s4Pond(x+.5,y+.5)?'#193743':'#152329';
   c.fillRect(X(x),Y(y),scale+.35,scale+.35);
  }
 // Draw furniture as small solid footprints; openings read as actual openings.
 if(!s4Running())for(const p of furniture){
  if(unknown&&!WF.seen[(p.y|0)*MW+(p.x|0)])continue;
  c.save();c.translate(X(p.x),Y(p.y));c.rotate(p.a);c.fillStyle='#14272a';
  c.fillRect(-p.hx*scale,-p.hy*scale,p.hx*2*scale,p.hy*2*scale);c.restore();
 }
 const target=wfTarget(),route=wfRoute(target);
 if(route.length>1){
  c.strokeStyle='#aeb98780';c.lineWidth=local?1.5:2;c.setLineDash(local?[2,3]:[4,5]);c.beginPath();
  c.moveTo(X(player.x),Y(player.y));for(const p of route)c.lineTo(X(p.x),Y(p.y));c.stroke();c.setLineDash([]);
 }
 if(!local&&!unknown&&useChapter){
  for(const [x,y,text,space] of WF_ROOM_LABELS[stage]||[]){
   c.font='600 '+clamp(scale*1.65,10,13)+'px Arial, "DejaVu Sans", sans-serif';
   if(c.measureText(text).width>space*scale)continue;
   c.textAlign='center';c.textBaseline='middle';
   const tw=c.measureText(text).width;
   c.fillStyle='#102027dd';c.fillRect(X(x)-tw/2-3,Y(y)-8,tw+6,16);
   c.fillStyle='#bac9c1';c.fillText(text,X(x),Y(y));
  }
 }
 for(const p of wfMapMarkers()){
  const x=X(p.x),y=Y(p.y);if(x<pad/2||x>w-pad/2||y<pad/2||y>h-pad/2)continue;
  const selected=p.id===target?.id,r=local?4:8;
  c.fillStyle=p.done?'#587166':p.locked?'#895e64':selected?'#d8c98d':'#839a90';
  c.fillRect(x-r,y-r,r*2,r*2);
  if(!local){c.fillStyle='#102028';c.font='bold 11px Arial, "DejaVu Sans", sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(p.done?'✓':p.mark,x,y+.5);}
  if(selected){c.strokeStyle='#e5d7a4';c.lineWidth=1;c.strokeRect(x-r-3,y-r-3,r*2+6,r*2+6);}
 }
 // True north stays fixed. Only this player arrow rotates.
 c.save();c.translate(X(player.x),Y(player.y));c.rotate(player.a);c.fillStyle='#fff5d6';c.strokeStyle='#0b1a20';c.lineWidth=2;
 c.beginPath();c.moveTo(local?7:10,0);c.lineTo(local?-5:-7,local?-4:-6);c.lineTo(local?-2:-3,0);c.lineTo(local?-5:-7,local?4:6);c.closePath();c.stroke();c.fill();c.restore();c.restore();
 c.textAlign='right';c.font='600 '+(local?10:12)+'px Arial, "DejaVu Sans", sans-serif';c.fillStyle='#a4b8b1';c.fillText('N ↑',w-12,local?17:20);
 if(local){c.textAlign='left';c.font='9px Arial, "DejaVu Sans", sans-serif';c.fillText('M · FULL MAP',8,h-8);}
}
function wfMapOptions(){
 const list=$('wfDestinations');list.replaceChildren();
 for(const t of wfTargets()){
  const button=document.createElement('button');button.type='button';button.textContent=t.label;
  button.dataset.target=t.id;button.setAttribute('aria-pressed',String(WF.selected===t.id));
  button.onclick=()=>{WF.selected=t.id;WF.field=null;wfRefreshMap();
   const selected=Array.from(list.children).find(b=>b.dataset.target===t.id);selected?.focus();};list.append(button);
 }
}
function wfRefreshMap(){
 wfSync();wfTarget();
 $('wfMapTitle').textContent=wfMapTitle();
 $('wfMapObjective').textContent=wfUncharted()?'This space is missing from the hospital plan. Only the area you have explored is shown.':
  chRunning()?CH.objective:fvRunning()?FV.objective:hwRunning()?HW.objective:$('goal').textContent;
 $('wfMapNote').textContent=wfUncharted()?'Explore to reveal the local layout.':fvRunning()?'Choose a destination below. Complete the three systems in any order.':
  wfTargets().length>1?'Choose which destination to follow.':wfTargets().length?'Follow the marked route. Rooms off the route are still yours to explore.':'Use the room names and your heading to get your bearings.';
 const w=Math.max(250,Math.min(1050,innerWidth-48)),h=Math.max(220,Math.min(640,innerHeight-265));
 WF_MAP.w=w;WF_MAP.h=h;const canvas=$('wfLargeMap');canvas.width=w;canvas.height=h;
 wfDrawMap(canvas.getContext('2d'),w,h);wfMapOptions();
}
function wfOpenMap(){
 if(mode!=='playing'&&mode!=='paused')return;
 WF_MAP.parent=mode;if(mode==='playing')pauseGame();
 hideOverlays();mode='map';$('mapPanel').classList.remove('hidden');
 $('map').classList.add('hidden');wfRefreshMap();$('wfMapClose').focus();
}
function wfCloseMap(){
 if(mode!=='map')return;
 hideOverlays();releaseInputs();
 if(WF_MAP.parent==='paused'){mode='paused';$('pause').classList.remove('hidden');$('resumeBtn').focus();}
 else{resumeGame();canvas.focus();hudUpdate();}
}
function wfMapKey(e){
 if(e.code==='KeyM'&&(e.ctrlKey||e.metaKey||e.altKey))return false;
 if(e.code==='KeyM'&&(mode==='playing'||mode==='paused'||mode==='map')){
  e.preventDefault();if(!e.repeat){if(mode==='map')wfCloseMap();else wfOpenMap();}return true;
 }
 if(mode!=='map')return false;
 if(e.code==='Escape'){e.preventDefault();wfCloseMap();}
 // Keep keyboard focus in the map without stealing normal navigation keys.
 if(e.code==='Tab'){
  const buttons=[$('wfMapClose'),...$('wfDestinations').children],first=buttons[0],last=buttons[buttons.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
 return true;
}
function wfRenderCorner(){
 const show=mode==='playing'&&(mapHeld||settings.map)&&!s4dLocked();
 $('map').classList.toggle('hidden',!show);if(show)wfDrawMap(mapCtx,150,150,true);
}
$('wfMapClose').onclick=wfCloseMap;$('touchMap').onclick=wfOpenMap;$('pauseMap').onclick=wfOpenMap;
addEventListener('resize',()=>{if(mode==='map')wfRefreshMap();});

// SOURCE: creature-voices.js
// BETA 0.1.1: pre-rendered creature performances + restrained spatial voices.
// This extension leaves the approved weapon/player/music/scene units intact.
const MV_COUNTS={idle:4,attack:5,death:3};
const MV_SPECIES=['unstitched','runner','orderly'];
const MV_TONE={unstitched:2800,runner:4500,orderly:1900,shepherd:3100,bulldog:2400,chihuahua:3800,heart:2000};
const MV={owners:new WeakMap(),bags:new Map(),idleAt:-Infinity,deathAt:-Infinity,
 preview:null,previewNodes:[],previewToken:0,played:0,culled:0};

audio.monsterChoose=function(species,event){
 const key=species+'_'+event,n=MV_COUNTS[event];let bag=MV.bags.get(key);
 if(!bag){bag={remaining:[],last:-1};MV.bags.set(key,bag);}
 if(!bag.remaining.length){
  bag.remaining=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag.remaining[i],bag.remaining[j]]=[bag.remaining[j],bag.remaining[i]];}
  if(bag.remaining[n-1]===bag.last)[bag.remaining[0],bag.remaining[n-1]]=[bag.remaining[n-1],bag.remaining[0]];
 }
 bag.last=bag.remaining.pop();return 'mv_'+key+bag.last;
};
const mvPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.monsterReady)return this.monsterReady;
 const base=mvPrepare();if(!this.ctx)return base;
 this.monsterReady=base.then(async ok=>{
  if(!ok||!this.ctx)return false;
  this.monsterBank=await loadAudioAsset(CREATURE_AUDIO_DATA,this.ctx);return true;
 });return this.monsterReady;
};
const mvPosition=audio.position.bind(audio);
audio.position=function(v,t){
 mvPosition(v,t);
 if(v.mv&&v.pos){
  const p=v.follow?.alive?v.follow:v.pos,blocked=!lineOfSight(player.x,player.y,p.x,p.y);
  v.filter.frequency.setTargetAtTime(blocked?Math.min(750,v.tone):v.tone,t,.045);
 }
};
audio.monsterSweep=function(t){
 for(const v of [...this.voices])if(v.mv&&v.until<=t)try{v.source.stop();}catch{}
};
audio.monsterSound=function(species,event,{pos=null,follow=null,owner=null,priority=1,vol=1,rate=1,wet=.16,at=0,cb=false}={}){
 if(!this.ctx||!this.monsterBank)return null;
 const a=this.ctx,t=Math.max(a.currentTime,at||a.currentTime),d=pos?Math.hypot(pos.x-player.x,pos.y-player.y):0;
 if(d>(species==='heart'||cb?24:event==='idle'?10:16)){MV.culled++;return null;}
 this.monsterSweep(a.currentTime);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 // Four creature throats maximum. A close charge warning can replace a distant
 // breath/death, but incidental chatter cannot steal an attack warning.
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 if(owner){
  const same=live.filter(v=>v.owner===owner);
  if(event!=='death'&&same.some(v=>v.priority>priority)){MV.culled++;return null;}
  for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,a.currentTime,.012);try{v.source.stop(a.currentTime+.035);}catch{}}
 }
 const remaining=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 if(remaining.length>=4){
  const candidate=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!candidate){MV.culled++;return null;}candidate.retiring=true;try{candidate.source.stop();}catch{}
 }
 const key=this.monsterChoose(species,event),cue=CREATURE_AUDIO_CUES[key];if(!cue)return null;
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.monsterBank;source.playbackRate.value=clamp(rate,.82,1.18);
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=MV_TONE[species];
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(pos&&a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,key,species,event,priority,owner,distance:d,tone:MV_TONE[species],cb,source,gain,filter,send,panner,nodes,vol,wet,
  pos:pos?{...pos}:null,follow,until:t+cue.duration/source.playbackRate.value+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const index=this.voices.indexOf(v);if(index>=0)this.voices.splice(index,1);};
 if(pos)this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);MV.played++;return v;
};

// Remove the human scream layers from direct creature calls too (Heart phase
// changes, environmental calls and the Bulldog beam's throat layer).
const mvPlay=audio.play.bind(audio);
audio.play=function(key,options={}){
 const match=/^(patient|crawler|brute|scream|shriek|roar|death)\d+$/.exec(key);
 if(!match)return mvPlay(key,options);
 const prefix=match[1],event=['scream','shriek','roar'].includes(prefix)?'attack':prefix==='death'?'death':'idle';
 const boss=cbRunning(),heart=(hbFighting()||HB.state==='dying')&&['scream','roar'].includes(prefix);
 const species=heart?'heart':boss&&prefix==='brute'?'bulldog':['patient','scream','death'].includes(prefix)?'unstitched':['crawler','shriek'].includes(prefix)?'runner':'orderly';
 return this.monsterSound(species,event,{...options,rate:1+(Math.random()-.5)*.07,vol:Math.min(options.vol??.65,1.05)*.82,wet:Math.min(options.wet??.16,.22),priority:heart?4:event==='attack'?2:0,cb:boss});
};
const mvOldCreature=audio.creature.bind(audio),mvOldKill=audio.kill.bind(audio);
audio.creature=function(e,attack=false){
 if(!e||e.type===3||!this.active||!this.ctx)return;
 // The mirror's deliberately borrowed player voice remains a narrative effect.
 if(liminal.mode==='mirror')return mvOldCreature(e,attack);
 const t=this.ctx.currentTime,event=attack?'attack':'idle',urgent=attack&&e.type>0&&e.windup>0;
 let memory=MV.owners.get(e);if(!memory){memory={idle:-Infinity,attack:-Infinity};MV.owners.set(e,memory);}
 const gap=attack?(urgent?.27:e.type===0?1.35:.85):8.5;
 if(t-memory[event]<gap||(!attack&&t<MV.idleAt)){MV.culled++;return;}
 const v=this.monsterSound(MV_SPECIES[e.type]||'orderly',event,{pos:e,follow:e,owner:e,priority:urgent?4:attack?2:0,
  vol:attack?(e.type===2?1.02:.84):.48,wet:attack?.16:.20,rate:rand(.955,1.04)});
 if(v){memory[event]=t;if(!attack)MV.idleAt=t+rand(2.3,3.8);}
 return v;
};
audio.kill=function(e=null){
 if(liminal.mode==='mirror')return mvOldKill(e);
 this.flesh(e,true);
 if(!e||e.type===3||!this.active||!this.ctx)return;
 const t=this.ctx.currentTime;if(t<MV.deathAt)return;
 const v=this.monsterSound(MV_SPECIES[e.type]||'orderly','death',{pos:e,owner:e,priority:1,vol:.62,wet:.14,rate:rand(.95,1.04)});
 if(v)MV.deathAt=t+.48;
};

// Canine articulations replace sped-up human/imp voices. Physical impacts,
// beam synthesis, score, splash and the exact finale timing remain unchanged.
const mvOldCerberusCue=audio.cerberusCue.bind(audio);
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const p=pos||CB,t=this.ctx.currentTime;
 const throat=(species,event,vol,delay=0)=>this.monsterSound(species,event,{pos:p,priority:kind==='yap'?2:4,vol:vol*strength,wet:.13,rate:rand(.96,1.04),at:t+delay,cb:true});
 if(kind==='wake'){throat('shepherd','attack',1.25);throat('bulldog','idle',.95,.23);mvPlay('bodyfall',{pos:p,vol:.5,rate:.57,wet:.16});}
 else if(kind==='snarl')throat('shepherd','attack',1.0);
 else if(kind==='charge')throat('bulldog','attack',.95);
 else if(kind==='hit'){mvPlay('gore1',{pos:p,vol:.78*strength,rate:.8,wet:.09});if(strength>.8)throat('bulldog','death',.5);}
 else if(kind==='chew'){mvPlay('flesh0',{pos:p,vol:.23,rate:1.32,wet:.025});}
 else if(kind==='breath')throat('bulldog','idle',.65);
 else if(kind==='snap'){mvPlay('flesh1',{pos:p,vol:.8,rate:.72,wet:.08});throat('chihuahua','attack',.7);}
 else if(kind==='yap'){
  if(t<(this.mvYapAt||0))return;this.mvYapAt=t+.19;
  throat('chihuahua','attack',.64);
 }
 else if(kind==='want')throat('chihuahua','idle',.65);
 else if(kind==='stagger'){throat('shepherd','death',.9);mvPlay('bodyfall',{pos:p,vol:.7,rate:.59,wet:.07});}
 else if(kind==='fetch'){throat('chihuahua','attack',.75);throat('bulldog','idle',.7,.18);}
 else if(kind==='plunge'){mvPlay('bodyfall',{pos:p,vol:1.5,rate:.42,wet:.17});throat('bulldog','death',.7,.1);}
 else if(kind==='submerge')throat('bulldog','death',.55);
 else mvOldCerberusCue(kind,pos,strength);
};

// A separate context auditions the exact baked clips without resuming paused
// music, ambience, pending attacks, game time or the main audio context.
audio.monsterPreviewStop=function(){
 MV.previewToken++;
 for(const v of MV.previewNodes){try{v.source.stop();}catch{}for(const n of v.nodes)try{n.disconnect();}catch{}}
 MV.previewNodes=[];
 if(MV.preview){MV.preview.suspend().catch(()=>{});}
 if($('mvPreviewStatus'))$('mvPreviewStatus').textContent='Choose a creature. Listen plays a breath, attack and death variation.';
};
audio.monsterPreview=function(){
 if(mode!=='settings')return;
 this.monsterPreviewStop();const token=MV.previewToken;
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 if(!MV.preview)MV.preview=new AC();const a=MV.preview;
 a.resume().catch(()=>{});
 this.prepare().then(ok=>{
  if(!ok||mode!=='settings'||token!==MV.previewToken)return;
  const species=MV_SPECIES[Number($('mvPreviewSpecies').value)||0],distance=Number($('mvPreviewDistance').value)||2;
  let at=a.currentTime+.05;
  for(const event of ['idle','attack','death']){
   const key=this.monsterChoose(species,event),cue=CREATURE_AUDIO_CUES[key],source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter();
   source.buffer=this.monsterBank;filter.type='lowpass';filter.frequency.value=MV_TONE[species];filter.Q.value=.4;
   const level=(event==='idle'?.48:event==='death'?.62:species==='orderly'?1.02:.84)*.86/(1+distance*.21);
   gain.gain.value=settings.mute?0:settings.sfx*level;source.connect(filter).connect(gain).connect(a.destination);
   const v={source,gain,level,nodes:[source,filter,gain]};MV.previewNodes.push(v);
   source.onended=()=>{for(const n of v.nodes)try{n.disconnect();}catch{}MV.previewNodes=MV.previewNodes.filter(n=>n!==v);if(!MV.previewNodes.length&&token===MV.previewToken){a.suspend().catch(()=>{});$('mvPreviewStatus').textContent='Finished. Listen again for different takes.';}};
   source.start(at,cue.start,cue.duration);at+=cue.duration+.52;
  }
  $('mvPreviewStatus').textContent=settings.mute?'Muted in Options.':'Breath → attack → death · '+distance+' m · game remains paused';
 }).catch(()=>{$('mvPreviewStatus').textContent='Audio unavailable. Reload the file to retry.';});
};
$('mvPreviewPlay').onclick=()=>audio.monsterPreview();
$('mvPreviewStop').onclick=()=>audio.monsterPreviewStop();
const mvSettingsBack=$('settingsBack').onclick;
$('settingsBack').onclick=()=>{audio.monsterPreviewStop();mvSettingsBack();};
const mvReset=audio.reset.bind(audio),mvStart=audio.start.bind(audio),mvLevels=audio.levels.bind(audio),mvPause=audio.pause.bind(audio);
audio.reset=function(){this.monsterPreviewStop();mvReset();MV.owners=new WeakMap();MV.idleAt=MV.deathAt=-Infinity;this.mvYapAt=0;};
audio.start=function(){this.monsterPreviewStop();mvStart();};
audio.pause=function(){this.monsterPreviewStop();mvPause();};
audio.levels=function(){mvLevels();for(const v of MV.previewNodes)v.gain.gain.setTargetAtTime(settings.mute?0:settings.sfx*v.level,MV.preview.currentTime,.02);};
addEventListener('blur',()=>audio.monsterPreviewStop());
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.monsterPreviewStop();});

// SOURCE: navigation-hud.js
// BETA 0.1.2: presentation only. Keep the existing routing, state thresholds,
// target selection and hidden states in wfHud as the authoritative output.
const NH_OPEN_TEST_WARD=openTestWard;
const NH_DIRECTIONS={
 '↑':['ahead','Ahead'], '‹':['left','Turn left'], '›':['right','Turn right'],
 '↶':['behind','Turn around'], '◇':['near','Nearby'], '·':['signs','Follow signs']
};
const nhOriginalHud=wfHud;
wfHud=function(){
 const result=nhOriginalHud();
 const [direction,hint]=NH_DIRECTIONS[$('compassArrow').textContent]||NH_DIRECTIONS['·'];
 // Icons are mounted once. Frame updates only select the visible SVG; they do
 // not parse markup, allocate graphics or trigger a new route calculation.
 const compass=$('compass');
 if(compass.dataset.direction!==direction)compass.dataset.direction=direction;
 $('wfNavHint').textContent=hint;
 return result;
};

// SOURCE: approved-creatures.js
// Only the owner's approved breathing/attack performances enter the campaign.
// Original MP3 bank/cue offsets are retained; no rebake or runtime pitch shift.
const APPROVED_CREATURES={orderly:'a',runner:'b'};
const AC_TAKES=new Map();
const acPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedReady)return this.approvedReady;
 const base=acPrepare();if(!this.ctx)return base;
 this.approvedReady=base.then(async ok=>{
  if(!ok)return false;
  this.approvedBank=await loadAudioAsset(CREATURE_AUDITION_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedReady=null;throw error;});
 return this.approvedReady;
};
audio.approvedCreatureSound=function(species,event,{pos,follow,owner,priority,vol,wet}){
 if(!this.ctx||!this.approvedBank||!APPROVED_CREATURES[species]||!['idle','attack'].includes(event))return null;
 const a=this.ctx,t=a.currentTime,d=Math.hypot(pos.x-player.x,pos.y-player.y);
 if(d>(event==='idle'?10:16)){MV.culled++;return null;}
 this.monsterSweep(t);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring);
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const same=live.filter(v=>v.owner===owner);
 if(same.some(v=>v.priority>priority)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==owner);
 let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const bag=species+'_'+event,take=AC_TAKES.get(bag)||0;
 const key='ca_'+species+'_'+APPROVED_CREATURES[species]+'_'+event+take,cue=CREATURE_AUDITION_CUES[key];
 if(!cue||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,t,.012);try{v.source.stop(t+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,key,species,event,priority,owner,distance:d,tone:10500,cb:false,source,gain,filter,send,panner,nodes,vol,wet,pos:{...pos},follow,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);AC_TAKES.set(bag,1-take);MV.played++;return v;
};
const acCreature=audio.creature.bind(audio);
audio.creature=function(e,attack=false){
 if(!e||![1,2].includes(e.type)||liminal.mode==='mirror')return acCreature(e,attack);
 if(!this.active||!this.ctx)return;
 const t=this.ctx.currentTime,event=attack?'attack':'idle',urgent=attack&&e.windup>0;
 let memory=MV.owners.get(e);if(!memory){memory={idle:-Infinity,attack:-Infinity};MV.owners.set(e,memory);}
 const gap=attack?(urgent?.27:.85):8.5;
 if(t-memory[event]<gap||(!attack&&t<MV.idleAt)){MV.culled++;return;}
 const v=this.approvedCreatureSound(e.type===2?'orderly':'runner',event,{pos:e,follow:e,owner:e,priority:urgent?4:attack?2:0,vol:attack?1:.72,wet:attack?.16:.20});
 if(v){memory[event]=t;if(!attack)MV.idleAt=t+rand(2.3,3.8);}
 return v;
};
// Shared reset/death/spatial lifecycle handles approved voices because they
// participate in the existing mv pool. Deaths and scripted boss cues stay pending.
const acReset=audio.reset.bind(audio);
audio.reset=function(){acReset();AC_TAKES.clear();};

// SOURCE: approved-cerberus.js
// Approved 0.1.4 auditions: Shepherd A, Bulldog A, Chihuahua B, both events.
// Keep the original encoded bank, exact cue boundaries and audition pitch.
const APPROVED_CERBERUS={shepherd:'a',bulldog:'a',chihuahua:'b'};
const ACB={takes:new Map(),heads:{shepherd:{},bulldog:{},chihuahua:{}},next:new Map(),beamDepth:0,breath:0};
const acbPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedCerberusReady)return this.approvedCerberusReady;
 const base=acbPrepare();if(!this.ctx)return base;
 this.approvedCerberusReady=base.then(async ok=>{
  if(!ok){this.approvedCerberusReady=null;return false;}
  this.approvedCerberusBank=await loadAudioAsset(CREATURE_ROUND2_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedCerberusReady=null;throw error;});
 return this.approvedCerberusReady;
};
audio.approvedCerberusSound=function(species,event,{pos=null,priority=4,vol=1,wet=.13,at=0}={}){
 if(!this.active||!this.ctx||!this.approvedCerberusBank||!cbRunning()||!APPROVED_CERBERUS[species]||!['idle','attack'].includes(event))return null;
 const a=this.ctx,now=a.currentTime,t=Math.max(now,at),p=pos||cbHead(species),owner=ACB.heads[species],d=Math.hypot(p.x-player.x,p.y-player.y);
 if(d>24){MV.culled++;return null;}
 this.monsterSweep(now);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring),same=live.filter(v=>v.owner===owner),memory=ACB.next.get(species);
 // Projectile volleys call yap every .19s. A whole recorded performance is
 // one voice, not a new throat per projectile. An attack may interrupt breath.
 if(same.some(v=>v.event==='attack'||v.priority>priority)||(memory?.event===event&&t<memory.until)){
  MV.culled++;return null;
 }
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==owner);let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const bag=species+'_'+event,take=ACB.takes.get(bag)||0,key='cr_'+species+'_'+APPROVED_CERBERUS[species]+'_'+event+take,cue=CREATURE_ROUND2_CUES[key];
 if(!cue||!Number.isFinite(cue.start)||!Number.isFinite(cue.duration)||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedCerberusBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,now,.012);try{v.source.stop(now+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedCerberusBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,approvedCerberus:true,key,species,event,priority,owner,distance:d,tone:10500,cb:true,source,gain,filter,send,panner,nodes,vol,wet,pos:{...p},follow:null,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);
 ACB.takes.set(bag,1-take);ACB.next.set(species,{event,until:t+cue.duration+(event==='idle'?4:species==='chihuahua'?.28:.35)});MV.played++;return v;
};
const acbPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(v.approvedCerberus&&cbRunning()){
  // Retrieval moves the whole guardian. Follow the rendered muzzle, including
  // its final descent, rather than leaving its voice where a volley started.
  const p=cbHead(v.species);v.pos={...p,z:p.z-(CB.sink||0)};v.distance=Math.hypot(p.x-player.x,p.y-player.y);
 }
 return acbPosition(v,t);
};
const acbCue=audio.cerberusCue.bind(audio);
audio.cerberusCue=function(kind,pos=null,strength=1){
 if(!this.ctx||!this.active||!cbRunning())return;
 const p=pos||CB,t=this.ctx.currentTime;
 const throat=(species,event,vol,delay=0)=>this.approvedCerberusSound(species,event,{pos:cbHead(species),priority:event==='idle'?0:kind==='yap'?2:4,vol:vol*strength,wet:.13,at:t+delay});
 if(kind==='wake'){
  throat('shepherd','attack',1.25);throat('bulldog','idle',.95,.23);
  mvPlay('bodyfall',{pos:p,vol:.5,rate:.57,wet:.16});
 }else if(kind==='snarl')return throat('shepherd','attack',1);
 else if(kind==='charge')return throat('bulldog','attack',.95);
 else if(kind==='breath'){
  // Share occasional resting breaths between the two adult throats; the
  // existing 5.8s encounter timer and global incidental-voice cap still apply.
  const species=ACB.breath%2?'shepherd':'bulldog',v=throat(species,'idle',.72);if(v)ACB.breath++;return v;
 }else if(kind==='snap'){
  mvPlay('flesh1',{pos:p,vol:.8,rate:.72,wet:.08});return throat('chihuahua','attack',.7);
 }else if(kind==='yap')return throat('chihuahua','attack',.8);
 else if(kind==='want')return throat('chihuahua','idle',.72);
 else if(kind==='fetch'){
  const v=throat('chihuahua','attack',.85);throat('bulldog','idle',.7,.18);return v;
 }else return acbCue(kind,pos,strength);
 // Chewing/impacts/steps, pending death performances, splash, machinery,
 // score and beam synthesis keep their exact parent implementation.
};
const acbPlay=audio.play.bind(audio),acbBeam=audio.cerberusBeam.bind(audio);
audio.play=function(key,options={}){
 // This is the one direct legacy throat call outside cerberusCue. Scope it
 // to beam emission so Heart and other scripted brute voices are untouched.
 if(ACB.beamDepth&&key==='brute2'&&cbRunning())return this.approvedCerberusSound('bulldog','attack',{...options,priority:4,vol:.65});
 return acbPlay(key,options);
};
audio.cerberusBeam=function(...args){ACB.beamDepth++;try{return acbBeam(...args);}finally{ACB.beamDepth--;}};
const acbStop=audio.cerberusStop.bind(audio);
audio.cerberusStop=function(){
 acbStop();ACB.next.clear();ACB.takes.clear();ACB.breath=0;
};

// SOURCE: warden-design.js
// The Warden receives its own illustrated silhouette. Its existing encounter,
// visibility ramp, collision, scale and scripted breathing remain unchanged.
const WARDEN_DESIGN={ready:null,art:null};
function prepareWardenDesign(){
 if(WARDEN_DESIGN.ready)return WARDEN_DESIGN.ready;
 WARDEN_DESIGN.ready=new Promise((resolve,reject)=>{
  const image=new Image();
  image.onload=()=>{try{
   const source=document.createElement('canvas');source.width=image.width;source.height=image.height;
   const g=source.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0);
   const pixels=g.getImageData(0,0,source.width,source.height).data;
   let x0=source.width,y0=source.height,x1=-1,y1=-1;
   for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(pixels[(y*source.width+x)*4+3]>32){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
   if(x1<=x0||y1<=y0)throw Error('Warden artwork is empty');
   const c=document.createElement('canvas');c.height=320;c.width=Math.max(1,Math.round((x1-x0+1)/(y1-y0+1)*320));
   const cg=c.getContext('2d');cg.imageSmoothingEnabled=true;cg.drawImage(source,x0,y0,x1-x0+1,y1-y0+1,0,0,c.width,c.height);
   const hit=document.createElement('canvas');hit.width=c.width;hit.height=c.height;
   const hg=hit.getContext('2d');hg.drawImage(c,0,0);hg.globalCompositeOperation='source-atop';hg.fillStyle='#fff5d6';hg.fillRect(0,0,hit.width,hit.height);
   WARDEN_DESIGN.art={image:c,hit,aspect:c.width/c.height};resolve(WARDEN_DESIGN.art);
  }catch(error){reject(error);}};
  image.onerror=()=>reject(Error('Warden artwork could not load'));
  image.src=WARDEN_ART_DATA;
 });
 return WARDEN_DESIGN.ready;
}
const wdPrepareAtlas=prepareAtlas;
prepareAtlas=function(src,isGun){
 const original=wdPrepareAtlas(src,isGun);
 if(isGun)return original;
 // Boot already awaits the monster atlas before it calls buildWardenSprite.
 // Include this independent asset in that promise to avoid a first-load race.
 return Promise.all([original,prepareWardenDesign()]).then(([sprites])=>sprites);
};
buildWardenSprite=function(){
 if(!WARDEN_DESIGN.art)throw Error('Warden artwork was not prepared');
 monsterSprites[3]=WARDEN_DESIGN.art;
};

// SOURCE: approved-heart.js
// Owner approval: Heart B breathing and A attack, exact round-three takes.
// The living organ has one spatial voice, regardless of how many faces show.
const APPROVED_HEART={idle:'b',attack:'a'};
const AH={owner:{},takes:new Map(),next:0,breathT:7.5,context:null};
const ahPrepare=audio.prepare.bind(audio);
audio.prepare=function(){
 if(this.approvedHeartReady)return this.approvedHeartReady;
 const base=ahPrepare();if(!this.ctx)return base;
 this.approvedHeartReady=base.then(async ok=>{
  if(!ok){this.approvedHeartReady=null;return false;}
  this.approvedHeartBank=await loadAudioAsset(CREATURE_ROUND3_DATA,this.ctx);return true;
 }).catch(error=>{this.approvedHeartReady=null;throw error;});
 return this.approvedHeartReady;
};
audio.approvedHeartStop=function(reset=false){
 // Cancel dry output and new room sends immediately, including queued sources.
 // Existing shared room decay and the separately routed finale stay intact.
 const t=this.ctx?.currentTime||0;
 for(const v of [...this.voices])if(v.approvedHeart){
  v.retiring=true;v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(0,t);
  v.send.gain.cancelScheduledValues(t);v.send.gain.setValueAtTime(0,t);
  try{v.source.stop();}catch{}for(const n of v.nodes)try{n.disconnect();}catch{}
  v.ended=true;const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);
 }
 AH.next=0;AH.breathT=7.5;if(reset)AH.takes.clear();
};
audio.approvedHeartSound=function(event,{priority=event==='idle'?0:4,vol=event==='idle'?.8:1,wet=.16}={}){
 if(!this.ctx||!this.active||mode!=='playing'||!this.approvedHeartBank||!hbFighting()||!APPROVED_HEART[event])return null;
 const a=this.ctx,t=a.currentTime,p=hbSoundPoint(),d=Math.hypot(p.x-player.x,p.y-player.y);
 if(d>24){MV.culled++;return null;}
 this.monsterSweep(t);
 const live=this.voices.filter(v=>v.mv&&!v.ended&&!v.retiring),same=live.filter(v=>v.owner===AH.owner);
 // Do not chop a selected performance into every beat, volley or visible face.
 // A telegraph can interrupt a breath; another attack waits for this throat.
 if(same.some(v=>v.event==='attack'||v.priority>priority)||(event==='attack'&&t<AH.next)){
  MV.culled++;return null;
 }
 if(event==='idle'&&live.some(v=>v.event==='idle'||v.priority>=3)){MV.culled++;return null;}
 const remaining=live.filter(v=>v.owner!==AH.owner);let displaced=null;
 if(remaining.length>=4){
  displaced=remaining.filter(v=>v.priority<priority||(v.priority===priority&&v.distance>d+3)).sort((a,b)=>a.priority-b.priority||b.distance-a.distance)[0];
  if(!displaced){MV.culled++;return null;}
 }
 const take=AH.takes.get(event)||0,key='cr3_heart_'+APPROVED_HEART[event]+'_'+event+take,cue=CREATURE_ROUND3_CUES[key];
 if(!cue||!Number.isFinite(cue.start)||!Number.isFinite(cue.duration)||cue.start<0||cue.duration<=0||cue.start+cue.duration>this.approvedHeartBank.duration+.05)return null;
 for(const v of same){v.retiring=true;v.gain.gain.setTargetAtTime(0,t,.012);try{v.source.stop(t+.035);}catch{}}
 if(displaced){displaced.retiring=true;try{displaced.source.stop();}catch{}}
 const source=a.createBufferSource(),gain=a.createGain(),filter=a.createBiquadFilter(),send=a.createGain();
 source.buffer=this.approvedHeartBank;source.playbackRate.value=1;
 filter.type='lowpass';filter.Q.value=.4;filter.frequency.value=10500;
 gain.gain.value=vol;send.gain.value=wet;source.connect(filter).connect(gain);
 const nodes=[source,gain,filter,send];let panner=null;
 if(a.createPanner){panner=a.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=1;panner.rolloffFactor=0;panner.maxDistance=60;gain.connect(panner).connect(this.sfx);nodes.push(panner);}
 else gain.connect(this.sfx);
 gain.connect(send).connect(this.room);
 const v={mv:true,approved:true,approvedHeart:true,key,species:'heart',event,priority,owner:AH.owner,distance:d,tone:10500,cb:false,source,gain,filter,send,panner,nodes,vol,wet,pos:{...p},follow:null,until:t+cue.duration+.05,ended:false};
 source.onended=()=>{if(v.ended)return;v.ended=true;for(const n of nodes)try{n.disconnect();}catch{}const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);};
 this.position(v,t);this.voices.push(v);source.start(t,cue.start,cue.duration);
 AH.takes.set(event,1-take);if(event==='attack'){AH.next=t+cue.duration+.35;AH.breathT=Math.max(AH.breathT,6.5);}
 MV.played++;return v;
};
const ahPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(v.approvedHeart&&hbFighting()){
  // The existing Heart anchor chooses the closest exposed surface. Retain
  // normal wall occlusion as the player moves between the organ's sides.
  v.pos=hbSoundPoint();v.distance=Math.hypot(v.pos.x-player.x,v.pos.y-player.y);
 }
 return ahPosition(v,t);
};
const ahPlay=audio.play.bind(audio);
audio.play=function(key,options={}){
 // A contextual call replaces only the living Heart's own old throat cue.
 // Death fallback, enemies and unrelated scripted roars are not approvals.
 if(AH.context&&/^(roar|scream)\d+$/.test(key)&&hbFighting())
  return this.approvedHeartSound('attack',{vol:AH.context==='start'?1.05:AH.context==='phase'?.95:.85});
 return ahPlay(key,options);
};
const ahStart=hbStart,ahPhase=hbUpdatePhase,ahBegin=hbBeginAttack;
hbStart=function(...args){
 const before=AH.context;AH.context='start';try{return ahStart(...args);}finally{AH.context=before;}
};
hbUpdatePhase=function(...args){
 const before=AH.context;AH.context='phase';try{return ahPhase(...args);}finally{AH.context=before;}
};
hbBeginAttack=function(...args){
 const before=AH.context;AH.context='attack';let started;
 try{started=ahBegin(...args);}finally{AH.context=before;}
 // The blood-well's physical swelling cue remains. Add the same chosen
 // attack articulation used by the fan; never repeat it on strike release.
 if(started&&HB.attack?.kind==='well')audio.approvedHeartSound('attack',{vol:.85});
 return started;
};
const ahTick=hbTick;
hbTick=function(dt){
 ahTick(dt);
 if(!hbFighting()||mode!=='playing'||!audio.active)return;
 AH.breathT=Math.max(0,AH.breathT-dt);
 if(AH.breathT<=0){
  // Deliberate spaces between breaths, independent of the 76–110 BPM pulse.
  // Missed incidental calls are discarded rather than queued behind combat.
  if(HB.introT===0&&!HB.attack)audio.approvedHeartSound('idle',{wet:.14});
  AH.breathT=AH.takes.get('idle')?8.5:7.5;
 }
};
const ahDie=hbDie,ahFinish=hbFinish,ahBossReset=hbReset,ahRestore=hbRestoreSnapshot,ahReset=audio.reset.bind(audio),ahAudioStart=audio.start.bind(audio);
hbDie=function(...args){if(hbFighting())audio.approvedHeartStop();return ahDie(...args);};
hbFinish=function(...args){audio.approvedHeartStop();return ahFinish(...args);};
hbReset=function(...args){audio.approvedHeartStop(true);return ahBossReset(...args);};
hbRestoreSnapshot=function(...args){audio.approvedHeartStop(true);return ahRestore(...args);};
audio.reset=function(){this.approvedHeartStop(true);return ahReset();};
audio.start=function(){
 // Weapon previews can resume the main context while a menu is open. They
 // must not also resume a suspended live-Heart voice from the paused fight.
 if(mode!=='playing')this.approvedHeartStop();return ahAudioStart();
};

// SOURCE: warden-ghost.js
// A presence in the wrong place. Dedicated Warden presentation only; movement,
// triggers, collisions and the approved breathing remain in their old modules.
const wgRenderEnemy=renderEnemy;
function wardenPresence(e,d,time=gameTime){
 const reveal=e.hwSeen?clamp(1-d*.02,.58,1):clamp((7.4-d)/5.2,.10,1);
 // A slow 11-second drift, never a flashing disappearance. Reduced effects is
 // completely still. Use simulation time so pausing freezes the apparition.
 const phase=Number.isFinite(e.phase)?e.phase:0;
 const presence=settings.reduce?.63:.63+.055*Math.sin(time*.55+phase);
 return clamp(1-d*.03,.5,1)*reveal*presence;
}
renderEnemy=function(e){
 if(e.type!==3)return wgRenderEnemy(e);
 const a=creatureTypes[3],v=project(e.x,e.y,0),art=monsterSprites[3];
 if(!v||v.d>20||!art)return;
 const death=e.alive?1:Math.max(0,e.death/.38);if(death<=0)return;
 const phase=Number.isFinite(e.phase)?e.phase:0;
 const height=v.scale*a.size*(e.alive?1:death*.65)*(1-(e.cower||0)*.34);
 const width=height*art.aspect,left=v.x-width/2,top=v.y-height;
 if(left>W||left+width<0)return;
 const alpha=wardenPresence(e,v.d)*death;
 // No foot shadow, walking squash, additive halo or luminous eyes. Keep the
 // same wall-depth clipping as every other sprite: it cannot show through walls.
 spriteClipped(art.image,left,top,width,height,v.d,alpha);
 if(!settings.reduce){
  // A barely displaced afterimage. Constant opacity, subpixel slow drift,
  // one extra clipped draw; no allocations, timers, filters or pixel scans.
  const offset=Math.sin(gameTime*.31+phase)*Math.min(1.2,width*.012);
  spriteClipped(art.image,left+offset,top-.35,width,height,v.d,alpha*.055);
 }
};

// SOURCE: warden-guide-r3.js
// A brief lead through the real opening, then a glimpse through the hallway wall.
// Route progress is scalar so the established checkpoint copies remain valid.
const WG_RADIUS=.85,WG_NORTH=4.15,WG_ARC=Math.PI*.5*WG_RADIUS;
const WG_PATH=[[32.5,3.35],[33.35,2.5]];
const WG_LENGTH=WG_NORTH+WG_ARC,WG_DEPARTURE=.8;
function wgPoint(s){
 if(s<=WG_NORTH)return {x:32.5,y:7.5-s};
 if(s<WG_NORTH+WG_ARC){const a=Math.PI+(s-WG_NORTH)/WG_RADIUS;return {x:33.35+Math.cos(a)*WG_RADIUS,y:3.35+Math.sin(a)*WG_RADIUS};}
 return {x:33.35,y:2.5};
}
function wgPlayerProgress(){
 // Closest projection onto the actual rounded route. The first and last
 // straights extend past their ends, so approach/exit do not pin the pacing.
 const north=Math.min(7.5-player.y,WG_NORTH),ny=7.5-north;
 let best=(player.x-32.5)**2+(player.y-ny)**2,progress=north;
 let a=Math.atan2(player.y-3.35,player.x-33.35);if(a<0)a+=TAU;
 a=clamp(a,Math.PI,Math.PI*1.5);
 const cx=33.35+Math.cos(a)*WG_RADIUS,cy=3.35+Math.sin(a)*WG_RADIUS;
 const cd=(player.x-cx)**2+(player.y-cy)**2;
 if(cd<best){best=cd;progress=WG_NORTH+(a-Math.PI)*WG_RADIUS;}
 const east=Math.max(0,player.x-33.35),ed=(player.x-33.35-east)**2+(player.y-2.5)**2;
 if(ed<best)progress=WG_NORTH+WG_ARC+east;
 return progress;
}
function wgPrime(w){
 w.wgGuide=true;w.wgStep=-1;w.wgT=0;w.wgSpeed=0;w.wgFade=1;w.wgGone=false;
 w.wgProgress=0;w.wgPlayerProgress=wgPlayerProgress();w.wgPlayerSpeed=0;w.wgWaiting=false;w.wgEntered=false;
}
const wgResolve=hwResolve;
hwResolve=function(...args){
 const previous=HW.warden,result=wgResolve(...args),w=HW.warden;
 if(HW.resolved&&w&&w!==previous){wgPrime(w);hwSave();}
 return result;
};
const wgPresence=wardenPresence;
wardenPresence=function(e,d,time=gameTime){
 return wgPresence(e,d,time)*(e.wgGuide?(e.wgGone?0:clamp(e.wgFade,0,1)):1);
};
function wgTick(dt){
 const w=HW.warden;
 if(!hwRunning()||mode!=='playing'||player.hp<=0||HW.ending||!HW.resolved||HB.state!=='dead'||!w||!w.wgGuide||w.wgGone||!w.alive)return;
 dt=Math.min(Math.max(Number.isFinite(dt)?dt:0,0),.1);if(!dt)return;
 // Remember the actual crossing even if the player dashes away or turns back.
 // The upper corridor starts at row 3; standing in the crack is not entry.
 if(player.y<3.75&&player.y>1&&player.x>31.6&&player.x<37)w.wgEntered=true;
 if(w.wgStep===WG_PATH.length){
  if(!w.wgEntered)return;
  w.wgT=Math.min(WG_DEPARTURE,w.wgT+dt);const t=w.wgT/WG_DEPARTURE,u=t*t*(3-2*t);
  // A short, continuous sideways slip into the nearby wall. Depth clipping
  // hides the last trace; the selected breath fades through the same hook.
  w.x=mix(33.35,33.9,u);w.y=mix(2.5,.65,u);w.wgFade=1-u;
  if(t===1){w.wgGone=true;w.wgFade=0;w.wgSpeed=0;w.wgStep++;w.alive=false;w.death=0;}
  return;
 }
 const d=Math.hypot(w.x-player.x,w.y-player.y),pp=wgPlayerProgress();
 const walk=4.65*clamp(Number.isFinite(mods.speed)?mods.speed:1,.5,2);
 if(w.wgStep<0){
  if(d>7||!lineOfSight(w.x,w.y,player.x,player.y)){w.wgT=0;w.wgPlayerProgress=pp;return;}
  w.wgT+=dt;if(w.wgT<.1)return;
  w.wgStep=0;w.wgT=0;w.wgPlayerProgress=pp;
  w.wgPlayerSpeed=Math.min(walk,Math.hypot(player.vx,player.vy));
 }
 // Ignore brief corner occlusion after the player has seen it. A latched
 // distance wait has distinct stop/resume thresholds, avoiding edge chatter.
 if(w.wgWaiting){if(d<7.5)w.wgWaiting=false;}
 else if(d>10)w.wgWaiting=true;
 const forward=clamp((pp-w.wgPlayerProgress)/dt,0,walk*1.15);w.wgPlayerProgress=pp;
 w.wgPlayerSpeed=mix(w.wgPlayerSpeed,forward,1-Math.exp(-dt*6));
 const lead=4.8,remaining=Math.max(0,WG_LENGTH-w.wgProgress);
 // Brake gently at the bend if the player has not entered yet, avoiding a
 // hard waypoint stop while preserving the same lead at the actual opening.
 const target=w.wgWaiting?0:Math.min(clamp(w.wgPlayerSpeed+(pp+lead-w.wgProgress)*2.3,0,walk*1.42),Math.sqrt(2*walk*3*remaining));
 // Continuous acceleration and braking; no velocity reset at path points.
 const acceleration=target>w.wgSpeed?walk*6:walk*3;
 w.wgSpeed+=clamp(target-w.wgSpeed,-acceleration*dt,acceleration*dt);
 if(w.wgSpeed<.015&&target<.015){w.wgSpeed=0;return;}
 const next=Math.min(WG_LENGTH,w.wgProgress+w.wgSpeed*dt),p=wgPoint(next);
 // Only the final disappearance enters a wall; ordinary travel uses the
 // same furniture-aware fit test as the player, including the rounded turn.
 if(!fits(p.x,p.y,w.r)){w.wgSpeed=Math.max(0,w.wgSpeed-walk*3*dt);return;}
 w.wgProgress=next;w.x=p.x;w.y=p.y;
 w.wgStep=next<WG_NORTH?0:1;
 if(next===WG_LENGTH){w.x=33.35;w.y=2.5;w.wgStep=WG_PATH.length;w.wgT=0;w.wgSpeed=0;}
}
hwTick=function(dt){
 if(!hwRunning())return;
 if(HW.arrival>0){HW.arrival-=dt;if(player.y<58)HW.arrival=0;}
 if(HB.state==='dormant'&&hbSafeEntry())hbStart();
 hbTick(dt);wgTick(dt);
};

// SOURCE: warden-breath.js
// The Heart's dormant Warden was never given a breathing trigger. Keep the
// approved three airy FX performances and the earlier Warden scenes intact.
const WB={voice:null,owner:null};
audio.wardenBreathStop=function(){
 const v=WB.voice;WB.voice=null;WB.owner=null;if(!v)return;
 const t=this.ctx?.currentTime||0;
 v.gain.gain.cancelScheduledValues(t);v.gain.gain.setValueAtTime(0,t);
 v.send.gain.cancelScheduledValues(t);v.send.gain.setValueAtTime(0,t);
 try{v.source.stop();}catch{}for(const node of v.nodes)try{node.disconnect();}catch{}
 v.ended=true;const i=this.voices.indexOf(v);if(i>=0)this.voices.splice(i,1);
};
function wbPresent(w){return !!(w&&w.alive&&!w.wgGone&&(w.wgFade??1)>0);}
const wbPosition=audio.position.bind(audio);
audio.position=function(v,t){
 if(!v.wardenBreath)return wbPosition(v,t);
 const w=v.follow,fade=wbPresent(w)?clamp(w.wgFade??1,0,1):0;
 // Leave headroom intact: the same .72 source ceiling, with a clearer direct
 // image and less room wash than the earlier long, impossible corridors.
 const dx=w.x-player.x,dy=w.y-player.y,d=Math.hypot(dx,dy),blocked=!lineOfSight(player.x,player.y,w.x,w.y);
 const x=(dy*Math.cos(player.a)-dx*Math.sin(player.a))*1.7,z=-(dx*Math.cos(player.a)+dy*Math.sin(player.a))*1.7;
 v.distance=d;v.gain.gain.setTargetAtTime(v.vol*fade/(1+d*.16)*(blocked?.33:1),t,.045);
 v.filter.frequency.setTargetAtTime(blocked?850:Math.max(5000,17000-d*650),t,.05);
 v.send.gain.setTargetAtTime(v.wet*(blocked?1.35:1),t,.07);
 if(v.panner?.positionX){v.panner.positionX.setTargetAtTime(x,t,.025);v.panner.positionY.setTargetAtTime((w.wgLift||0)-.02,t,.025);v.panner.positionZ.setTargetAtTime(z,t,.025);}
 else if(v.panner?.pan)v.panner.pan.setTargetAtTime(clamp(x/(d*1.7+.1),-1,1),t,.025);
};
audio.wardenBreathSound=function(w){
 if(!this.active||!this.ctx||!this.bank||mode!=='playing'||!hwRunning()||!HW.resolved||w!==HW.warden||!wbPresent(w)||settings.mute||settings.sfx<=0)return null;
 if(Math.hypot(w.x-player.x,w.y-player.y)>14)return null;
 if(WB.voice){if(WB.voice.ended||WB.voice.until<=this.ctx.currentTime||WB.owner!==w)this.wardenBreathStop();else return null;}
 const take=(w.wbBreathTake||0)%3,key='breath'+take;
 const v=this.play(key,{vol:.72,rate:.7,pos:w,follow:w,wet:.24});if(!v)return null;
 v.wardenBreath=true;v.key=key;v.ended=false;
 const ended=v.source.onended;
 v.source.onended=()=>{if(v.ended)return;v.ended=true;ended?.();if(WB.voice===v){WB.voice=null;WB.owner=null;}};
 WB.voice=v;WB.owner=w;this.position(v,this.ctx.currentTime);
 w.wbBreathTake=(take+1)%3;w.wbBreathT=AUDIO_CUES[key].duration/.7+2.1+take*.35;
 return v;
};
const wbHeartTick=hwTick;
hwTick=function(dt){
 wbHeartTick(dt);
 const w=HW.warden;
 if(!hwRunning()||!HW.resolved||!wbPresent(w)||HW.ending){audio.wardenBreathStop();return;}
 if(mode!=='playing'||!audio.active)return;
 if(WB.voice&&(WB.owner!==w||WB.voice.ended||WB.voice.until<=(audio.ctx?.currentTime||0)))audio.wardenBreathStop();
 if(WB.voice)audio.position(WB.voice,audio.ctx.currentTime);
 // A simulation timer cannot pile up missed calls during a pause. Do not
 // queue distant breaths: the first one becomes available on approach.
 if(!Number.isFinite(w.wbBreathT))w.wbBreathT=.7;
 if(Math.hypot(w.x-player.x,w.y-player.y)>14)return;
 w.wbBreathT=Math.max(0,w.wbBreathT-clamp(dt,0,.25));
 if(w.wbBreathT<=0&&!audio.wardenBreathSound(w))w.wbBreathT=.5;
};
const wbReset=audio.reset.bind(audio),wbStart=audio.start.bind(audio),wbEnd=audio.end.bind(audio);
audio.reset=function(){this.wardenBreathStop();return wbReset();};
audio.start=function(){
 // A weapon preview may wake the shared context while the game is suspended.
 // Ordinary pause/resume keeps the one current breath frozen in that context.
 if(mode!=='playing')this.wardenBreathStop();return wbStart();
};
audio.end=function(...args){this.wardenBreathStop();return wbEnd(...args);};

// SOURCE: boot.js
function loop(now){const dt=clamp((now-last)/1000,0,.033);last=now;nowTime=now/1000;if(mode==='menu')player.a=Math.sin(nowTime*.14)*.13;update(dt);render();requestAnimationFrame(loop);}
wireTestWard();syncSettings();loadStage(0);$('bestText').textContent=best?'PERSONAL BEST / '+best.toLocaleString():'';
Promise.all([prepareAtlas(ASSETS.monsters,false),prepareAtlas(ASSETS.weapons,true),prepareEnvironment(ASSETS.environment),prepareCorruption(ASSETS.corruption,ASSETS.heart,ASSETS.heartDead),prepareExterior(),audio.prepare().catch(()=>{feed('AUDIO UNAVAILABLE');$('reviewAudioStatus').textContent='Audio unavailable. Reload the file to retry.';return false;})]).then(([m,g])=>{monsterSprites=m;gunSprites=g;buildWardenSprite();audio.departureBake();s4dFireTextures();artReady=true;$('startTest').disabled=false;$('startBtn').disabled=false;$('startBtn').textContent='ENTER THE WARD →';}).catch(()=>{$('error').classList.remove('hidden');$('error').textContent='The ward assets did not load. Reload to try again.';$('startBtn').textContent='RELOAD GAME';$('startBtn').disabled=false;$('startBtn').onclick=()=>location.reload();});
requestAnimationFrame(loop);


// SOURCE: beta-shell.js
// Distribution shell only. All approved campaign/renderer/audio units precede
// this file unchanged. No telemetry, uploads, remote assets or new combat rules.
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
   'Chapter: '+(stage+1)+' / '+(s4Running()?'No Way Out':wardNames[stage]||'Menu'),
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

// SOURCE: creature-gallery-r4.js
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