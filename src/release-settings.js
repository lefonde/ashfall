/* ============================================ RELEASE READINESS  (P08) === */
/* One place that says what the three difficulties actually do, so the control
   can describe itself instead of the player having to guess. */
const DIFFICULTIES=[
  {id:0,name:'FORGIVING',note:'Creatures are slower and hit for 35% less.'},
  {id:1,name:'STANDARD', note:'The approved balance.'},
  {id:2,name:'UNKIND',   note:'Creatures are faster and hit for 30% more.'}
];
function applyDifficulty(){
  difficulty=clamp(Math.round(settings.difficulty),0,2)|0;
  settings.difficulty=difficulty;
  $('difficulty').value=String(difficulty);
  for(const b of document.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',Number(b.dataset.mode)===difficulty?'true':'false');
  const el=$('difficultyNote');
  if(el)el.textContent=DIFFICULTIES[difficulty].note;
}

