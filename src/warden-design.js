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

