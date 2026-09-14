// Cold work belongs to the existing asset-loading gate, before any campaign or
// preview can start. Authored geometry is shared; no run/checkpoint is entered.
const PERF_PREPARATION={state:'idle',pending:null,serial:0,error:null,audioContext:null,gallery:null};
function performancePreparationYield(){return new Promise(resolve=>setTimeout(resolve,0));}
function cancelPerformancePreparation(){
 PERF_PREPARATION.serial++;
 if(PERF_PREPARATION.state==='preparing')PERF_PREPARATION.state='idle';
 PERF_PREPARATION.pending=null;
}
function preparePerformanceAudio(){
 if(!rsAudioInit())return false;
 const c=RS_AUDIO.ctx;if(PERF_PREPARATION.audioContext===c&&PERF_PREPARATION.gallery)return true;
 // Use the approved deterministic synthesizer unchanged. Keep one response
 // outside its four-entry LRU so later room previews cannot evict the hallway.
 PERF_PREPARATION.audioContext=c;PERF_PREPARATION.gallery=performanceBaseAudioImpulse(RS_TRANSFER_ACOUSTICS.acoustic);
 return true;
}
const performanceBaseAudioImpulse=rsAudioImpulse;
rsAudioImpulse=function(name){
 if(name===RS_TRANSFER_ACOUSTICS.acoustic&&PERF_PREPARATION.audioContext===RS_AUDIO.ctx&&PERF_PREPARATION.gallery)return PERF_PREPARATION.gallery;
 return performanceBaseAudioImpulse(name);
};
function preparePerformanceWorld(){
 const state=PERF_PREPARATION;
 if(state.state==='failed')return Promise.reject(state.error);
 if(state.pending)return state.pending;
 if(mode==='playing')return Promise.resolve(false);
 const serial=++state.serial;state.state='preparing';
 const current=()=>serial===state.serial&&mode!=='playing';
 state.pending=(async()=>{
  try{
   // Let the loading label paint before construction, and again before audio.
   await performancePreparationYield();if(!current())return false;
   rsBuildWorld();if(!RR.baked)rsBakeFaces();
   await performancePreparationYield();if(!current())return false;
   preparePerformanceAudio();
   await performancePreparationYield();if(!current())return false;
   state.state='ready';return true;
  }catch(error){
   // A partially constructed authored world cannot be appended a second time.
   // The existing loader displays its reload action for a failed preparation.
   if(serial===state.serial){state.state='failed';state.error=error;}throw error;
  }finally{
   if(serial===state.serial){state.pending=null;if(state.state==='preparing')state.state='idle';}
  }
 })();
 return state.pending;
}
