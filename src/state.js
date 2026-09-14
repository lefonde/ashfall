// state.js — bundled from the owner’s liminal baseline.
const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d',{alpha:false}), mapCtx=$('map').getContext('2d');
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mix=(a,b,t)=>a+(b-a)*t, rand=(a=0,b=1)=>a+Math.random()*(b-a), angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
const settings={music:.48,sfx:.8,sensitivity:.00225,shake:.65,res:1,difficulty:1,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,map:false,mute:false};
try{const saved=JSON.parse(localStorage.getItem('ashfall-settings-v2')||'{}');if(saved&&typeof saved==='object'){
 for(const [key,lo,hi]of [['music',0,1],['sfx',0,1],['sensitivity',.0006,.0054],['shake',0,1],['res',.5,1],['difficulty',0,2]])if(typeof saved[key]==='number'&&Number.isFinite(saved[key]))settings[key]=clamp(saved[key],lo,hi);
 for(const key of ['reduce','map','mute'])if(typeof saved[key]==='boolean')settings[key]=saved[key];
}}catch{}
let best=0;try{best=Math.max(0,Number(localStorage.getItem('ashfall-best-v2'))||0);if(!Number.isFinite(best))best=0;}catch{}
let coarse=matchMedia('(pointer: coarse)').matches;
document.body.classList.toggle('touch-device',coarse);
let W=640,H=360,frame,px,zBuffer,sceneRenderScaleCap=1,aimPitch=0,sceneAngularView=false;const world=document.createElement('canvas'),wc=world.getContext('2d',{alpha:false});
// Use the visible viewport, including mobile browser chrome and rotation.
const gameViewport={width:0,height:0,left:0,top:0};
let viewportFrame=0;
function resize(){
 const view=window.visualViewport;
 const width=Math.max(1,Math.round(view?.width||innerWidth||800));
 const height=Math.max(1,Math.round(view?.height||innerHeight||450));
 Object.assign(gameViewport,{width,height,left:view?.offsetLeft||0,top:view?.offsetTop||0});
 const style=document.documentElement.style;
 for(const [key,value] of Object.entries(gameViewport))style.setProperty('--game-'+key,value+'px');
 document.body.classList.toggle('mobile-portrait',coarse&&height>width);
 const ar=height/width;
 const renderScale=Math.min(clamp(settings.res||1,.5,1),clamp(sceneRenderScaleCap,.5,1));
 let w=Math.max(128,Math.round(640*renderScale/8)*8),h=Math.round(w*ar);
 if(h>800){h=800;w=Math.max(128,Math.round(h/ar/8)*8);h=Math.round(w*ar);}
 if(h<120){h=120;w=Math.max(128,Math.round(h/ar/8)*8);h=Math.round(w*ar);}
 h=clamp(h,120,800);
 if(W===w&&H===h&&frame)return;
 const pitchFraction=Number.isFinite(aimPitch)?aimPitch/(sceneAngularView?W:H):0;
 // The chapter stores tan(view angle) in projection pixels. Keep both that
 // displacement and its projection basis proportional through any resize.
 if(sceneAngularView)projection*=w/W;
 W=w;H=h;aimPitch=pitchFraction*(sceneAngularView?W:H);canvas.width=world.width=W;canvas.height=world.height=H;
 frame=wc.createImageData(W,H);px=frame.data;zBuffer=new Float32Array(W);
 ctx.imageSmoothingEnabled=false;wc.imageSmoothingEnabled=false;
}
function queueViewportResize(){
 if(viewportFrame)return;
 viewportFrame=requestAnimationFrame(()=>{viewportFrame=0;resize();});
}
addEventListener('resize',queueViewportResize);
window.visualViewport?.addEventListener('resize',queueViewportResize);
window.visualViewport?.addEventListener('scroll',queueViewportResize);
function mobileOrientationChange(){
 releaseInputs();if(coarse&&mode==='playing')pauseGame();queueViewportResize();
}
if(screen.orientation?.addEventListener)screen.orientation.addEventListener('change',mobileOrientationChange);
else addEventListener('orientationchange',mobileOrientationChange);
resize();
let mode='menu',difficulty=1,stage=0,gameTime=0,stageTime=0,kills=0,stageKills=0,score=0,combo=0,comboT=0,maxCombo=0,grace=5,cleared=false;
let map=[],MW=64,MH=64,flow=[],flowClock=0,enemies=[],bullets=[],particles=[],rings=[],drops=[],decals=[],tracers=[],numbers=[],exit={x:20.5,y:22.5};
let weapon=0,shotCD=0,reloadT=0,reloadDuration=0,recoil=0,muzzle=0,shake=0,hurt=0,hitstop=0,hitmarker=0,killmarker=0,whiteFlash=0,dashT=0,dashCD=0,meleeT=0,meleeCD=0,weaponDrop=0;
let nowTime=0,last=0,msgT=0,feedT=0,bob=0,sway=0,lookDelta=0,mapHeld=false,mouseFire=false,menuParent='menu',hudClock=0,ambientClock=1.2,enemyId=0;
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
