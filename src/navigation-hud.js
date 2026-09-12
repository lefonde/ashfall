// BETA 0.1.2: presentation only. Keep the existing routing, state thresholds,
// target selection and hidden states in wfHud as the authoritative output.
const NH_OPEN_TEST_WARD=openTestWard;
const NH_DIRECTIONS={
 '↑':['ahead','Ahead'], '‹':['left','Turn left'], '›':['right','Turn right'],
 '↶':['behind','Turn around'], '◇':['near','Nearby'], '·':['signs','Follow signs']
};
const nhOriginalHud=wfHud;
wfHud=function(){
 const result=nhOriginalHud();
 const [direction,hint]=NH_DIRECTIONS[$('compassArrow').textContent]||NH_DIRECTIONS['·'];
 // Icons are mounted once. Frame updates only select the visible SVG; they do
 // not parse markup, allocate graphics or trigger a new route calculation.
 const compass=$('compass');
 if(compass.dataset.direction!==direction)compass.dataset.direction=direction;
 $('wfNavHint').textContent=hint;
 return result;
};

