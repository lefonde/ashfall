// Source integration harness; no browser, DOM layout, audio playback or network.
const fs=require('fs'),path=require('path'),vm=require('vm');
module.exports=function runtime({nativeCanvas=null}={}){
 const root=path.join(__dirname,'..'),elements=new Map(),storage=new Map();
 const noop=()=>{},context2d=()=>new Proxy({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),
  getImageData:(x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h}),
  measureText:t=>({width:String(t).length*7}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},
  {get(o,k){return k in o?o[k]:noop;}});
 function element(tag='div'){
  const classes=new Set(),e=tag==='canvas'&&nativeCanvas?nativeCanvas.createCanvas(640,360):{};
  Object.assign(e,{tagName:tag.toUpperCase(),style:{setProperty:noop,removeProperty:noop},dataset:{},children:[],textContent:'',innerHTML:'',value:'',checked:false,
   addEventListener:noop,removeEventListener:noop,setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},getAttribute(k){return this[k];},
   append(...v){this.children.push(...v);},appendChild(v){this.children.push(v);},replaceChildren(...v){this.children=v;},
   focus:noop,blur:noop,remove:noop,contains:()=>false,querySelectorAll:()=>[],querySelector:()=>null,closest:()=>null,
   getBoundingClientRect:()=>({left:0,top:0,width:960,height:540}),
   classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},contains:x=>classes.has(x),toggle(x,on){if(on===undefined)on=!classes.has(x);on?classes.add(x):classes.delete(x);return on;}}});
  if(!e.getContext){const ctx=context2d();e.getContext=()=>ctx;}
  return e;
 }
 const get=id=>{if(!elements.has(id))elements.set(id,element(['game','map'].includes(id)?'canvas':'div'));return elements.get(id);};
 const document={body:element(),documentElement:element(),getElementById:get,createElement:element,
  querySelectorAll:()=>[],querySelector:()=>null,addEventListener:noop,exitPointerLock:noop};
 const c={console,Date,Uint8Array,Uint8ClampedArray,Int16Array,Int32Array,Float32Array,Float64Array,ArrayBuffer,Map,Set,Promise,
  document,innerWidth:960,innerHeight:540,devicePixelRatio:1,matchMedia:()=>({matches:false,addEventListener:noop}),
  screen:{orientation:{addEventListener:noop}},navigator:{userAgent:'Native source harness'},location:{search:'',href:'http://example.invalid/'},
  addEventListener:noop,removeEventListener:noop,requestAnimationFrame:()=>0,cancelAnimationFrame:noop,setTimeout:()=>0,clearTimeout:noop,setInterval:()=>0,clearInterval:noop,
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
  URLSearchParams,performance:{now:()=>0},Image:nativeCanvas?.Image||class{},
  fetch:()=>Promise.reject(Error('No network in native harness'))};
 c.window=c;c.visualViewport={width:960,height:540,offsetLeft:0,offsetTop:0,addEventListener:noop};
 vm.createContext(c);
 const constants=JSON.parse(fs.readFileSync(path.join(root,'src/constants.json'),'utf8'));
 let source=Object.entries(constants).map(([k,v])=>'const '+k+'='+JSON.stringify(v)+';').join('\n');
 source+='\n'+fs.readFileSync(path.join(root,'src/asset-loader.js'),'utf8');
 for(const file of JSON.parse(fs.readFileSync(path.join(root,'src/modules.json'),'utf8'))){if(file==='boot.js')continue;source+='\n'+fs.readFileSync(path.join(root,'src',file),'utf8');}
 vm.runInContext(source,c,{filename:'ashfall-runtime.js'});
 return {eval:s=>vm.runInContext(s,c),context:c,elements,get,root};
};
