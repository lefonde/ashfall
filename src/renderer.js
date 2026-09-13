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
 if(p.wfExit&&wfExitReady(p)){
  // Constant emergency trim: readable from either approach, no flashing or
  // screen-space marker competing with the aiming area.
  for(const side of [-1,1]){
   for(const xx of [-.96,.96])quad([[xx-.018,side*.124,.16],[xx+.018,side*.124,.16],[xx+.018,side*.124,.98],[xx-.018,side*.124,.98]],'#9ce2bf',-1,true);
   quad([[-.9,side*.125,1.01],[.9,side*.125,1.01],[.9,side*.125,1.035],[-.9,side*.125,1.035]],'#9ce2bf',-1,true);
  }
 }
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
function renderGun(){if(!artReady)return;if(weapon===3){s4tRenderHands();return;}const g=guns[weapon],art=gunSprites[weapon],motion=settings.reduce?0:Math.min(1,Math.hypot(player.vx,player.vy)/4.65),reloadDip=reloadT>0?Math.sin(Math.PI*clamp(1-reloadT/reloadDuration,0,1)):0;const gh=Math.min(H*(weapon===2?.68:.64),coarse?Math.min(H*.5,W*.76/art.aspect):Infinity,cbRunning()&&H>W?H*.46:Infinity),gw=gh*art.aspect,gx=W*.5+(settings.reduce?0:Math.sin(bob)*3*motion-sway*9),gy=H+gh*.13+Math.abs(Math.cos(bob))*motion*3+recoil*(weapon===1?8:22)+reloadDip*gh*.65+weaponDrop*gh*2+s4dGunDip()*gh;
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
