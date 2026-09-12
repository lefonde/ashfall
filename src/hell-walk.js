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

