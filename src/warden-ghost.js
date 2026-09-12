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

