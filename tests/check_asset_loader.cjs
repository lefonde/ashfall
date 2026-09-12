// Native transport checks, not browser or subjective audio certification.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.join(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/media.json'))),calls=[];
const sandbox={fetch:async url=>{
 assert(!url.startsWith('/')&&!url.includes('..'),'project-relative media');
 const item=manifest.find(m=>m.path===url);assert(item,'known media URL');
 const bytes=fs.readFileSync(path.join(root,url));calls.push(url);
 return {ok:true,status:200,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};
}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'src/asset-loader.js'),'utf8'),sandbox);
(async()=>{
 for(const item of manifest.filter(m=>m.path.endsWith('.mp3'))){
  let decodes=0;
  const context={decodeAudioData:async bytes=>{decodes++;assert.equal(hash(Buffer.from(bytes)),item.sha256);return {asset:item.path};}};
  const result=await sandbox.loadAudioAsset(item.path,context);
  assert.equal(result.asset,item.path);assert.equal(decodes,1);
 }
 assert.equal(calls.length,10);
 let decoded=false;sandbox.fetch=async()=>({ok:false,status:404});
 await assert.rejects(sandbox.loadAudioAsset('missing.mp3',{decodeAudioData(){decoded=true;}}),/404/);assert(!decoded);
 sandbox.fetch=async()=>({ok:true,status:200,arrayBuffer:async()=>new ArrayBuffer(0)});
 await assert.rejects(sandbox.loadAudioAsset('empty.mp3',{}),/empty/);
 sandbox.fetch=async()=>{throw Error('offline');};
 await assert.rejects(sandbox.loadAudioAsset('offline.mp3',{}),/offline/);
 sandbox.fetch=async()=>({ok:true,status:200,arrayBuffer:async()=>new ArrayBuffer(8)});
 await assert.rejects(sandbox.loadAudioAsset('invalid.mp3',{decodeAudioData:async()=>{throw Error('decode failed');}}),/decode failed/);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),src=html.match(/<script src="([^"]+)"/)[1];
 new vm.Script(fs.readFileSync(path.join(root,src),'utf8'));
 console.log('PASS all ten exact MP3 banks reach the intended decoder; HTTP/empty/network/decode errors propagate; compiled runtime parses.');
})().catch(error=>{console.error(error);process.exitCode=1;});
