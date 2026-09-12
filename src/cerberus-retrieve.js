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

