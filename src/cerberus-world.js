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

