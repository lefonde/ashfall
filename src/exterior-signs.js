// Lettering is typeset once into a physical sign face, then projected with the world.
// Texture and board share the same dimensions: distance and viewing angle cannot separate them.
const S4_SIGN_CACHE=new Map();
function s4SignTexture(label){
 const rows=label.text.split('\n'),h=label.h||.4,w=label.w;
 const key=[label.text,w,h,label.color||''].join('|');
 if(S4_SIGN_CACHE.has(key))return S4_SIGN_CACHE.get(key);
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=Math.max(48,Math.round(768*h/w));
 const g=canvas.getContext('2d',{willReadFrequently:true}),cw=canvas.width,ch=canvas.height,pad=22,line=ch/rows.length;
 g.fillStyle='#1d3736';g.fillRect(0,0,cw,ch);
 g.strokeStyle='#748780';g.lineWidth=2;g.strokeRect(6,6,cw-12,ch-12);
 g.fillStyle='#afb6a0';for(const x of [13,cw-13])for(const y of [13,ch-13]){g.beginPath();g.arc(x,y,2,0,TAU);g.fill();}
 let font=Math.floor(Math.min(line*.58,60));
 for(;;){g.font='600 '+font+'px sans-serif';if(font<=8||rows.every(row=>g.measureText(row).width<=cw-pad*2))break;font--;}
 g.textAlign=rows.length>1?'left':'center';g.textBaseline='middle';g.fillStyle=label.color||'#d7dec7';
 const metrics=[];
 rows.forEach((row,i)=>{const y=(i+.5)*line;g.fillText(row,rows.length>1?pad:cw/2,y);metrics.push({text:row,width:g.measureText(row).width,y,font});});
 const texture={data:g.getImageData(0,0,cw,ch).data,w:cw,h:ch,metrics,pad};S4_SIGN_CACHE.set(key,texture);return texture;
}
function s4BuildSigns(){
 for(const l of S4.labels){
  if(!l.text)continue;
  const front=l.front||[0,1],len=Math.hypot(...front),nx=front[0]/len,ny=front[1]/len,rx=ny,ry=-nx,h=l.h||.4;
  const corner=(side,z,offset)=>[l.x+rx*side+nx*offset,l.y+ry*side+ny*offset,z];
  const points=[corner(-l.w/2,l.z-h/2,.066),corner(l.w/2,l.z-h/2,.066),corner(l.w/2,l.z+h/2,.066),corner(-l.w/2,l.z+h/2,.066)];
  const face=s4Quad(points,-1,[29,55,54]);face.surface=s4SignTexture(l);face.sign=true;face.out=[nx,ny];face.cx=l.x;face.cy=l.y;face.radius=l.w/2+.07;
  // Dark back and thin top/side edges keep an oblique board physically legible.
  const back=points.map(p=>[p[0]-nx*.095,p[1]-ny*.095,p[2]]);
  const f=s4Quad(back,-1,[25,38,37]);f.out=[-nx,-ny];f.cx=l.x;f.cy=l.y;f.radius=face.radius;
  for(const [a,b]of [[0,3],[3,2],[2,1],[1,0]])s4Quad([points[a],points[b],back[b],back[a]],-1,[73,86,77]);
  l.face=face;
 }
}
// Retained hook for the shared renderer. World text is already in the pixel depth pass.
function s4DrawLabels(){}

