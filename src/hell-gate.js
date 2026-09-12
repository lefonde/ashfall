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

