// Native source-driven HUD checks. Geometry is stubbed; this is not a browser playthrough.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..'),nodes=new Map(),noop=()=>{};
function node(id){
 if(!nodes.has(id)){
  const classes=new Set();
  nodes.set(id,{textContent:'',innerHTML:'',style:{},dataset:{},setAttribute(k,v){this[k]=v;},
   classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains(v){return classes.has(v);},toggle(v,on){if(on===undefined)on=!classes.has(v);on?classes.add(v):classes.delete(v);return on;}}});
 }
 return nodes.get(id);
}
const c={console,Math,Set,Float32Array,Int16Array,Uint8Array,$:node,document:{body:node('body')},hudComposing:false,
 mode:'playing',coarse:false,useChapter:true,stage:3,cleared:false,stageKills:0,quotas:[8,12,16,20],wardNames:['A','B','C','D'],
 player:{x:64,y:47,a:0,hp:100,vx:0,vy:0},exit:{x:43,y:19.5},enemies:[],bullets:[],
 CH:{power:false},FV:{closed:0},HW:{resolved:false},HB:{state:'dormant'},
 S4:{on:true,zone:'ENTRANCE COURT'},S4D:{on:true,phase:'aftermath',t:0,clock:0,safeT:0,crashed:true},S4D_DURATIONS:{},
 S4Q:{on:true,keys:false,ext:false,fire:true,moved:false,done:false,action:null,gate:false,supplies:0},
 S4Q_KEYS:{x:95.76,y:79.65},S4Q_EXT:{x:137.08,y:5.36},S4Q_GATE:{x:104,y:56.5},S4Q_SUPPLIES:[],
 S4T:{on:false,phase:'ground',x:90,y:90},CB:{on:false,toyDropped:false,hp:900,trail:900,state:'waking',x:43,y:26,alive:true},CB_MAX:900,CBF_STAGGER:360,
 WF:{selected:'',field:null,targetKey:'',navTarget:'',navArrow:''},WF_BREAKER:{x:56.86,y:9,id:'mains',label:'Plant Hall'},
 review:{active:false,damage:true,unlimited:false,scene:'test',hudClock:0},reviewScenes:{test:{label:'Test scene'}},BUILD:{id:'test'},
 liminal:{mix:0,fed:null},weapon:0,reloadT:0,score:0,gameTime:0,stageTime:0,dashCD:0,combo:0,comboT:0,msgT:0,feedT:0,
 hudClock:0,grace:0,hitstop:0,keys:{},touchMove:{x:0,y:0},mods:{speed:1},aimPitch:0,sway:0,lookDelta:0,dashT:0,bob:0,
 shotCD:0,meleeCD:0,meleeT:0,weaponDrop:0,recoil:0,muzzle:0,shake:0,hurt:0,hitmarker:0,killmarker:0,whiteFlash:0,mouseFire:false,_safeX:64,_safeY:47,
 audio:{tick:noop},equipment:{ammo:10,reserve:30,name:'TEST GUN',color:'#fff'},
 chRunning:()=>false,fvRunning:()=>false,hwRunning:()=>false,hgInside:()=>false,wfUncharted:()=>false,wfSync:noop,
 wfBearing:()=>({angle:0}),wfBreakerNear:()=>false,fvNearestUse:()=>null,fvSystem:()=>null,openTestWard:noop,
 s4NearbyLabel:()=>null,cbAI:()=>true,reviewFixture:()=>false,
 lineOfSight:()=>true,s4CastRay:(x,y,dx,dy,max)=>({d:max}),
 chTick:noop,fvTick:noop,hwTick:noop,s4Tick:noop,s4qTick:noop,s4tTick:noop,cbTick:noop,reviewTick:noop,liminalTick:noop,
 move:noop,fits:()=>true,shoot:noop,enemyAI:noop,updateBullets:noop,updateEffects:noop,completeWard:noop,
 hbHud:noop,fvHud(){node('interactPrompt').classList.add('hidden');node('touchUse').classList.add('hidden');},
 touchSetLabel(id,text){node(id).textContent=text;},equippedItem(){return this.equipment;},formatTime:()=> '00:00',
 clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),mix:(a,b,t)=>a+(b-a)*t,angle:a=>Math.atan2(Math.sin(a),Math.cos(a))};
// Functions keep their actual source body. Top-level initialization and art/audio are excluded.
vm.createContext(c);
function load(file,names){
 const text=fs.readFileSync(path.join(root,'src',file),'utf8');
 for(const name of names){
  const start=text.indexOf('function '+name+'(');assert(start>=0,name+' exists');
  let end=text.indexOf('\n',start),script;
  while(end>=0){try{script=new vm.Script(text.slice(start,end),{filename:file+':'+name});break;}catch(error){if(!(error instanceof SyntaxError))throw error;end=text.indexOf('\n',end+1);}}
  assert(script,name+' closes');script.runInContext(c);
 }
}
load('ui.js',['hudUpdate','hudExitNear','hudExteriorInteraction','hudInteractionHud']);
load('simulation.js',['update']);
load('exterior.js',['s4Running','s4Hud']);
load('exterior-sequence.js',['s4dLocked','s4dPhase','s4dTick','s4dHud','s4dWreckNear']);
load('exterior-quest.js',['s4qRunning','s4qCanReach','s4qNearby','s4qThreats','s4qHud']);
load('seraphim.js',['s4tRunning','s4tCarried','s4tNear','s4tHud']);
load('cerberus.js',['cbRunning','cbHud']);
load('cerberus-finale.js',['cbfSafe','cbfHud']);
load('wayfinding.js',['wfTargets','wfTarget','wfDirection','wfHud']);
load('review.js',['reviewHud']);
vm.runInContext(fs.readFileSync(path.join(root,'src/navigation-hud.js'),'utf8'),c);
c.equippedItem=()=>c.equipment;
function tickFrames(count){for(let i=0;i<count;i++){c.update(1/60);assert.equal(c.hudComposing,false);}}
function checkEveryFrame(count,expected){for(let i=0;i<count;i++){tickFrames(1);for(const [id,value]of Object.entries(expected))assert.equal(node(id).textContent,value,`frame ${i}: ${id}`);}}

// Between periodic HUD refreshes the legacy departure tick must not repaint navigation.
c.hudUpdate();checkEveryFrame(180,{compassText:'Parking · Staff 04',goal:'KEYS IN PARKING · EXTINGUISHER AT BUS STOP'});
c.S4Q.moved=c.S4Q.done=true;c.CB.on=true;c.hudUpdate();
checkEveryFrame(120,{goal:'BREAK THE GUARDIAN · TWO HEADS ARE HUNTING',lifeHint:'STAY MOBILE'});
assert(node('compass').classList.contains('hidden'),'combat does not expose a misleading route');
c.CB.toyDropped=true;c.CB.state='frenzy';c.CB.stagger=0;c.CB.staggerMeter=0;c.S4T.on=true;c.S4T.phase='carried';c.weapon=3;
c.hudUpdate();checkEveryFrame(120,{goal:'FIRE TO THROW · 1–3 GUNS',lifeHint:'STAY MOBILE'});
c.review.active=true;c.reviewHud();assert.equal(node('goal').textContent,'FIRE TO THROW · 1–3 GUNS');assert(node('compass').classList.contains('hidden'));
c.CB.alive=false;c.CB.rewarded=true;c.hudUpdate();checkEveryFrame(60,{goal:'HELL IS OPEN · WALK THROUGH',compassText:'Garden gates'});

// Actual proximity predicate: key, extinguisher, ambulance and Seraphim; walls and facing still matter.
c.review.active=false;c.CB.on=false;c.S4T.on=false;c.S4Q.moved=c.S4Q.done=false;c.weapon=0;
Object.assign(c.player,{x:94.76,y:79.65,a:0});c.hudUpdate();assert.equal(node('interactAction').textContent,'[E] TAKE AMBULANCE KEYS');assert.equal(node('touchUse').textContent,'KEYS');
c.player.a=Math.PI;c.hudUpdate();assert(node('interactPrompt').classList.contains('hidden'),'no prompt behind player');
c.player.a=0;c.s4CastRay=()=>({d:0});c.hudUpdate();assert(node('interactPrompt').classList.contains('hidden'),'no prompt through wall');
c.s4CastRay=(x,y,dx,dy,max)=>({d:max});c.S4Q.keys=true;Object.assign(c.player,{x:136.08,y:5.36,a:0});c.coarse=true;c.hudUpdate();
assert.equal(node('interactAction').textContent,'USE · TAKE FIRE EXTINGUISHER');assert.equal(node('touchUse').textContent,'TAKE');
c.S4Q.ext=true;Object.assign(c.player,{x:64,y:43,a:Math.PI});c.hudUpdate();assert.equal(node('interactAction').textContent,'USE · EXTINGUISH ENGINE FIRE');
c.S4Q.fire=false;c.hudUpdate();assert.equal(node('interactAction').textContent,'USE · START AND MOVE AMBULANCE');
c.S4T.on=true;Object.assign(c.S4T,{phase:'ground',x:63,y:43});c.hudUpdate();assert.equal(node('touchUse').textContent,'LIFT','Seraphim uses the same first priority as E');
c.player.a=0;c.hudUpdate();assert(node('interactPrompt').classList.contains('hidden'));
c.player.a=Math.PI;c.S4D.phase='move';c.hudUpdate();assert(node('interactPrompt').classList.contains('hidden'));assert(node('touchUse').classList.contains('hidden'));
c.S4D.phase='aftermath';c.mode='paused';c.hudUpdate();assert(node('touchUse').classList.contains('hidden'));c.mode='playing';

// Exit prompt only covers the actual E/USE radius, and yields to chapter controls.
c.S4.on=false;c.S4T.on=false;c.S4D.on=false;c.stage=0;c.cleared=true;c.exit={x:10,y:10};Object.assign(c.player,{x:8.6,y:10});
c.hudUpdate();assert(c.hudExitNear());assert.equal(node('touchUse').textContent,'EXIT');
c.player.x=8.5;c.hudUpdate();assert(!c.hudExitNear());assert(node('touchUse').classList.contains('hidden'));
c.player.x=8.6;c.fvNearestUse=()=>({id:'OR1'});assert(!c.hudExitNear());c.fvNearestUse=()=>null;
c.wfUncharted=()=>true;c.hudUpdate();assert(node('interactPrompt').classList.contains('hidden'));c.wfUncharted=()=>false;

// Near a turn threshold, small yaw noise keeps a readable instruction; a real turn updates.
const destination={id:'test'};c.WF.navTarget='';c.WF.navArrow='';
assert.equal(c.wfDirection(destination,{angle:0}),'↑');
for(const angle of [.37,.39,.36,.40])assert.equal(c.wfDirection(destination,{angle}),'↑');
assert.equal(c.wfDirection(destination,{angle:.7}),'›');
assert.equal(c.wfDirection(destination,{angle:-.7}),'‹');
assert.equal(c.wfDirection(destination,{near:true}),'◇');
assert.equal(c.wfDirection(destination,null),'·');
console.log('PASS native HUD scheduling, boss/finale priority, contextual reach/facing/occlusion, cutscene/pause guards, exit radius and direction stability.');
