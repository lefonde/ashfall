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


