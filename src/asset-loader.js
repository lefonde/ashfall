// Website transport only. The exact MP3 bytes are decoded by the same context
// and played through the beta's unchanged mixing and creature selection code.
async function loadAudioAsset(url,context){
 const response=await fetch(url);
 if(!response.ok)throw Error('Audio asset could not load ('+response.status+'): '+url);
 const bytes=await response.arrayBuffer();
 if(!bytes.byteLength)throw Error('Audio asset was empty: '+url);
 return context.decodeAudioData(bytes);
}
