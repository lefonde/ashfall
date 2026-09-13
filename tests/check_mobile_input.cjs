// Exercise the production listeners in Node. This is not browser/device certification.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');

function harness({ coarse = true } = {}) {
  class Target {
    constructor() { this.listeners = new Map(); }
    addEventListener(type, listener, options) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push({ listener, options });
    }
    emit(type, props = {}) {
      const event = { type, target: this, cancelable: true, defaultPrevented: false,
        pointerType: 'touch', pointerId: 1, clientX: 0, clientY: 0, detail: 1,
        preventDefault() { if (this.cancelable) this.defaultPrevented = true; }, ...props };
      for (const entry of this.listeners.get(type) || []) entry.listener(event);
      if (typeof this['on' + type] === 'function') this['on' + type](event);
      return event;
    }
  }
  class Element extends Target {
    constructor(id = '', tagName = 'DIV') {
      super(); this.id = id; this.tagName = tagName; this.parentElement = null;
      this.style = { setProperty(key, value) { this[key] = value; } };
      const classes = new Set();
      this.classList = {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, value) { const add = value === undefined ? !classes.has(name) : value;
          add ? classes.add(name) : classes.delete(name); return add; }
      };
      this.captured = new Set(); this.children = []; this.textContent = '';
      this.rect = { left: 20, top: 200, width: 100, height: 100 };
    }
    closest(selector) {
      const ids = selector.split(',').map(part => part.trim().slice(1));
      for (let el = this; el; el = el.parentElement) if (ids.includes(el.id)) return el;
      return null;
    }
    getBoundingClientRect() { return this.rect; }
    setPointerCapture(id) { this.captured.add(id); }
    releasePointerCapture(id) { this.captured.delete(id); }
    hasPointerCapture(id) { return this.captured.has(id); }
    querySelector(selector) { return selector === '.touchLabel' ? this.label || null : null; }
    append(...children) { for (const child of children) { child.parentElement = this; this.children.push(child); } }
    replaceChildren(...children) { this.children = []; this.append(...children); }
    focus() {}
    getContext() { return context2d; }
  }
  const metrics = { allocations: 0, bufferWrites: 0 }, elements = new Map();
  const context2d = { createImageData(width, height) {
    metrics.allocations++; return { data: new Uint8ClampedArray(width * height * 4) };
  } };
  function get(id) {
    if (!elements.has(id)) {
      const element = new Element(id, /^touch/.test(id) ? 'BUTTON' : 'DIV');
      elements.set(id, element);
      for (const prop of ['width', 'height']) Object.defineProperty(element, prop, {
        get() { return this['_' + prop]; }, set(value) { metrics.bufferWrites++; this['_' + prop] = value; }
      });
    }
    return elements.get(id);
  }
  const document = new Target();
  Object.assign(document, {
    body: get('body'), documentElement: get('html'), hidden: false, pointerLockElement: null,
    getElementById: get, createElement: tag => new Element('', tag.toUpperCase()),
    querySelectorAll: selector => selector === '#touch .is-pressed'
      ? [...elements.values()].filter(el => el.closest('#touch') && el.classList.contains('is-pressed')) : [],
    exitPointerLock() { document.pointerLockElement = null; }
  });
  document.documentElement.append(document.body);
  for (const id of ['game', 'touch', 'hud', 'settings', 'pause', 'feedback']) document.body.append(get(id));
  for (const id of ['stick', 'stickKnob', 'touchFire', 'touchDash', 'touchGun', 'touchReload',
    'touchMelee', 'touchUse', 'touchMap', 'touchPause']) get('touch').append(get(id));
  get('touchUse').label = new Element('', 'SPAN');
  get('touchUse').append(get('touchUse').label);
  get('settings').append(get('sensitivity'));
  get('sensitivity').tagName = 'INPUT';
  get('feedback').append(get('feedbackText'));
  get('feedbackText').tagName = 'TEXTAREA';
  const win = new Target(), visualViewport = new Target(), orientation = new Target();
  Object.assign(visualViewport, { width: 844, height: 390, offsetLeft: 0, offsetTop: 0, scale: 1 });
  const queuedFrames = new Map(); let nextFrame = 1;
  const calls = { shoot: 0, triggerRelease: 0, dash: 0, gun: 0, reload: 0, melee: 0,
    map: 0, audioPause: 0, audioStart: 0, interactions: [] };
  const flags = { locked: false, s4: false, fv: false, ch: false, exitNear: false,
    s4Handled: false, fvHandled: false, chHandled: false };
  const sandbox = {
    Element, document, innerWidth: 844, innerHeight: 390, visualViewport,
    screen: { orientation }, matchMedia: query => ({ matches: query === '(pointer: coarse)' && coarse }),
    localStorage: { getItem: () => null, setItem() {} },
    addEventListener: win.addEventListener.bind(win),
    requestAnimationFrame: callback => { const id = nextFrame++; queuedFrames.set(id, callback); return id; },
    cancelAnimationFrame: id => queuedFrames.delete(id),
    s4dLocked: () => flags.locked, s4Running: () => flags.s4,
    fvRunning: () => flags.fv, chRunning: () => flags.ch, hwRunning: () => false,
    s4tReleaseTrigger: () => calls.triggerRelease++,
    shoot: () => calls.shoot++, dash: () => calls.dash++, changeWeapon: () => calls.gun++,
    reload: () => calls.reload++, melee: () => calls.melee++, wfOpenMap: () => calls.map++,
    s4Interact: () => { calls.interactions.push('s4'); return flags.s4Handled; },
    fvInteract: () => { calls.interactions.push('fv'); return flags.fvHandled; },
    chInteract: () => { calls.interactions.push('ch'); return flags.chHandled; },
    hudExitNear: () => flags.exitNear,
    audio: { pause: () => calls.audioPause++, start: () => calls.audioStart++ },
    review: { active: false }, feed() {},
    // Only helpers used by completeWard's chapter hand-off are stubbed.
    fvHandOver() {}, chHandOver() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const filename of ['state.js', 'run.js', 'input.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, 'src', filename), 'utf8'), sandbox, { filename });
  }
  const run = code => vm.runInContext(code, sandbox);
  function point(id, type, pointerId, x = 0, y = 0, props = {}) {
    return get(id).emit(type, { pointerId, clientX: x, clientY: y, ...props });
  }
  function flush() { const batch = [...queuedFrames.values()]; queuedFrames.clear(); batch.forEach(fn => fn()); }
  function game() { run("mode='playing'; document.body.classList.add('playing');"); }
  return { run, get, point, flush, game, win, document, visualViewport, orientation, queuedFrames,
    metrics, flags, calls, sandbox };
}

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('PASS ' + name); }
  catch (error) { console.error('FAIL ' + name); throw error; }
}
function near(actual, expected, tolerance = 1e-9) { assert(Math.abs(actual - expected) < tolerance, `${actual} ≈ ${expected}`); }
function actions(h) { return ['shoot', 'dash', 'gun', 'reload', 'melee', 'map'].reduce((n, key) => n + h.calls[key], 0) + h.calls.interactions.length; }
function assertReleased(h) {
  assert.equal(h.run('mouseFire'), false);
  assert.equal(h.run('touchMove.x'), 0); assert.equal(h.run('touchMove.y'), 0);
  assert.equal(h.run('touchLook.id'), null); assert.equal(h.run('mapHeld'), false);
  assert.equal(h.run('Object.keys(keys).length'), 0);
  assert.equal(h.run('lookDelta'), 0);
  assert.equal(h.get('stickKnob').style.transform, '');
  assert.equal(h.document.querySelectorAll('#touch .is-pressed').length, 0);
}
function holdInputs(h) {
  h.game(); h.point('stick', 'pointerdown', 1, 104, 250);
  h.point('game', 'pointerdown', 2, 500, 100);
  h.point('game', 'pointermove', 2, 510, 100);
  h.point('touchFire', 'pointerdown', 3, 750, 290);
  h.run('keys.KeyW=true; mapHeld=true;');
}

test('three fingers can move, aim and hold fire independently', () => {
  const h = harness(); h.game();
  h.point('stick', 'pointerdown', 1, 104, 250);
  h.point('game', 'pointerdown', 2, 500, 100);
  h.point('touchFire', 'pointerdown', 3, 750, 290);
  assert.equal(h.calls.shoot, 1); near(h.run('touchMove.x'), 1);
  h.point('game', 'pointermove', 2, 520, 105);
  const aimed = h.run('player.a'); assert(aimed > 0);
  h.point('touchFire', 'pointermove', 3, 765, 295);
  near(h.run('player.a'), aimed); // The separate look finger owns aim.
  h.point('stick', 'pointermove', 1, 70, 216);
  near(h.run('touchMove.y'), -1); assert.equal(h.run('mouseFire'), true);
  h.point('game', 'pointerup', 2);
  h.point('touchFire', 'pointermove', 3, 775, 295);
  assert(h.run('player.a') > aimed); // Fire drag becomes aim when that finger is free.
  h.point('touchFire', 'pointerup', 3);
  assert.equal(h.run('mouseFire'), false); near(h.run('touchMove.y'), -1);
});

test('extra fingers cannot steal controls or release the owning finger', () => {
  const h = harness(); holdInputs(h); const aimed = h.run('player.a');
  h.point('stick', 'pointerdown', 4, 36, 250);
  h.point('game', 'pointerdown', 5, 700, 100);
  h.point('touchFire', 'pointerdown', 6, 790, 300);
  h.point('stick', 'pointermove', 4, 36, 250);
  h.point('game', 'pointermove', 5, 780, 100);
  h.point('touchFire', 'pointermove', 6, 830, 300);
  h.point('stick', 'pointerup', 4); h.point('game', 'pointerup', 5); h.point('touchFire', 'pointerup', 6);
  near(h.run('touchMove.x'), 1); near(h.run('player.a'), aimed);
  assert.equal(h.run('touchLook.id'), 2); assert.equal(h.run('mouseFire'), true);
  assert.equal(h.calls.shoot, 1);
});

for (const cancellation of ['pointercancel', 'lostpointercapture']) test(cancellation + ' clears ownership and late moves cannot stick or jump', () => {
  const h = harness(); holdInputs(h);
  h.point('stick', cancellation, 1); h.point('game', cancellation, 2); h.point('touchFire', cancellation, 3);
  const aimed = h.run('player.a');
  h.point('stick', 'pointermove', 1, 30, 290);
  h.point('game', 'pointermove', 2, 700, 100);
  h.point('touchFire', 'pointermove', 3, 800, 300);
  assert.equal(h.run('mouseFire'), false); assert.equal(h.run('touchMove.x'), 0);
  assert.equal(h.run('touchMove.y'), 0); near(h.run('player.a'), aimed);
  h.point('touchFire', 'pointerdown', 10, 700, 200);
  h.point('touchFire', 'pointermove', 10, 710, 200);
  assert(h.run('player.a') > aimed); assert.equal(h.calls.shoot, 2);
});

for (const interruption of ['pause', 'blur', 'hidden', 'orientation']) test(interruption + ' releases all input and requires a fresh touch after resume', () => {
  const h = harness(); holdInputs(h);
  if (interruption === 'pause') h.run('pauseGame()');
  if (interruption === 'blur') h.win.emit('blur');
  if (interruption === 'hidden') { h.document.hidden = true; h.document.emit('visibilitychange'); }
  if (interruption === 'orientation') h.orientation.emit('change');
  assert.equal(h.run('mode'), 'paused'); assertReleased(h);
  h.run('resumeGame()'); const aimed = h.run('player.a');
  h.point('stick', 'pointermove', 1, 36, 250);
  h.point('game', 'pointermove', 2, 650, 100);
  h.point('touchFire', 'pointermove', 3, 800, 290);
  assertReleased(h); near(h.run('player.a'), aimed);
  h.point('stick', 'pointerdown', 10, 104, 250); near(h.run('touchMove.x'), 1);
});

test('paused and cutscene controls cannot trigger gameplay; pause remains available in cutscenes', () => {
  const h = harness();
  for (const state of ['paused', 'playing']) {
    h.run(`mode='${state}'`); h.flags.locked = state === 'playing';
    const before = actions(h);
    for (const id of ['stick', 'game', 'touchFire', 'touchDash', 'touchGun', 'touchReload', 'touchMelee', 'touchUse', 'touchMap']) {
      h.point(id, 'pointerdown', 1, 104, 250);
      h.point(id, 'pointermove', 1, 130, 250);
      h.get(id).emit('click', { detail: 0 });
    }
    assert.equal(actions(h), before); near(h.run('player.a'), 0); assert.equal(h.run('touchMove.x'), 0);
  }
  h.point('touchPause', 'pointerdown', 9);
  assert.equal(h.run('mode'), 'paused'); assertReleased(h);
});

test('action presses fire once and synthetic clicks do not duplicate them', () => {
  const h = harness(); h.game();
  h.point('touchDash', 'pointerdown', 1); h.point('touchDash', 'pointerup', 1);
  h.get('touchDash').emit('click', { detail: 1 }); assert.equal(h.calls.dash, 1);
  h.get('touchDash').emit('click', { detail: 0 }); assert.equal(h.calls.dash, 2);
  h.get('touchReload').disabled = true;
  h.point('touchReload', 'pointerdown', 2); h.get('touchReload').emit('click', { detail: 0 });
  assert.equal(h.calls.reload, 0);
});

test('USE respects interaction priority and chapter exits use the same proximity gate', () => {
  const h = harness(); h.game(); h.run('cleared=true;');
  h.flags.exitNear = false;
  h.point('touchUse', 'pointerdown', 1); h.point('touchUse', 'pointerup', 1);
  assert.equal(h.run('mode'), 'playing'); assert.deepEqual(h.calls.interactions, ['s4', 'fv', 'ch']);
  h.flags.s4Handled = true; h.flags.exitNear = true; h.calls.interactions.length = 0;
  h.point('touchUse', 'pointerdown', 2); h.point('touchUse', 'pointerup', 2);
  assert.deepEqual(h.calls.interactions, ['s4']); assert.equal(h.run('mode'), 'playing');
  h.flags.s4Handled = false; h.flags.fvHandled = true; h.calls.interactions.length = 0;
  h.point('touchUse', 'pointerdown', 3); h.point('touchUse', 'pointerup', 3);
  assert.deepEqual(h.calls.interactions, ['s4', 'fv']); assert.equal(h.run('mode'), 'playing');
  h.flags.fvHandled = false; h.flags.chHandled = true; h.calls.interactions.length = 0;
  h.point('touchUse', 'pointerdown', 4); h.point('touchUse', 'pointerup', 4);
  assert.deepEqual(h.calls.interactions, ['s4', 'fv', 'ch']); assert.equal(h.run('mode'), 'playing');
  h.flags.chHandled = false;
  h.point('touchUse', 'pointerdown', 5);
  assert.equal(h.run('mode'), 'upgrade'); assertReleased(h);
  assert.equal(h.get('upgradeList').children.length, 3);
});

test('selection, drag, callout and page gestures are blocked only on the active game surface', () => {
  const h = harness(); h.game();
  for (const type of ['contextmenu', 'selectstart', 'dragstart', 'touchstart', 'touchmove',
    'gesturestart', 'gesturechange', 'gestureend']) {
    for (const target of [h.get('game'), h.get('touchUse').label, h.get('hud')]) {
      assert.equal(h.document.emit(type, { target }).defaultPrevented, true, type + ' is prevented on gameplay');
    }
    for (const target of [h.get('sensitivity'), h.get('feedbackText')]) {
      assert.equal(h.document.emit(type, { target }).defaultPrevented, false, type + ' leaves native UI alone');
    }
    h.run("mode='paused'");
    assert.equal(h.document.emit(type, { target: h.get('game') }).defaultPrevented, false);
    h.game();
  }
  assert.equal(h.document.emit('touchmove', { target: h.get('game'), cancelable: false }).defaultPrevented, false);
  for (const type of ['touchstart', 'touchmove', 'gesturestart', 'gesturechange', 'gestureend']) {
    assert(h.document.listeners.get(type).some(entry => entry.options.capture && entry.options.passive === false));
  }
});

test('touch aiming honors the shared sensitivity setting and reduced motion', () => {
  const h = harness(); h.game(); h.run('settings.sensitivity=.002;');
  h.point('game', 'pointerdown', 1, 500, 100); h.point('game', 'pointermove', 1, 520, 110);
  const low = h.run('player.a'); assert(low > 0); assert(h.run('aimPitch') < 0);
  h.point('game', 'pointerup', 1); h.run('player.a=0; aimPitch=0; settings.sensitivity=.004; settings.reduce=true;');
  h.point('game', 'pointerdown', 2, 500, 100); h.point('game', 'pointermove', 2, 520, 110);
  near(h.run('player.a'), 2 * low); near(h.run('aimPitch'), 0);
});

test('joystick has a dead zone and reads resized element bounds on the next gesture', () => {
  const h = harness(); h.game();
  h.point('stick', 'pointerdown', 1, 71, 250); near(h.run('touchMove.x'), 0); near(h.run('touchMove.y'), 0);
  h.point('stick', 'pointermove', 1, 104, 250); near(h.run('touchMove.x'), 1);
  h.point('stick', 'pointermove', 1, 1000, 1000);
  near(h.run('Math.hypot(touchMove.x,touchMove.y)'), 1); h.point('stick', 'pointerup', 1);
  h.get('stick').rect = { left: 50, top: 100, width: 200, height: 200 };
  h.point('stick', 'pointerdown', 2, 218, 200); near(h.run('touchMove.x'), 1);
  h.point('stick', 'pointermove', 2, 152, 200); near(h.run('touchMove.x'), 0);
});

test('visual viewport resize is coalesced; scrolling updates offsets without reallocating the renderer', () => {
  const h = harness(); const style = h.document.documentElement.style;
  assert.equal(style['--game-width'], '844px'); assert.equal(style['--game-height'], '390px');
  const allocations = h.metrics.allocations, writes = h.metrics.bufferWrites;
  h.visualViewport.offsetLeft = 8; h.visualViewport.offsetTop = 28;
  h.visualViewport.emit('scroll'); h.visualViewport.emit('resize'); h.win.emit('resize');
  assert.equal(h.queuedFrames.size, 1); h.flush();
  assert.equal(style['--game-left'], '8px'); assert.equal(style['--game-top'], '28px');
  assert.equal(h.metrics.allocations, allocations); assert.equal(h.metrics.bufferWrites, writes);
  // Width/height are the visual viewport's CSS pixels, including its current zoom scale.
  Object.assign(h.visualViewport, { width: 422, height: 195, scale: 2, offsetLeft: 10 });
  h.visualViewport.emit('resize'); h.flush();
  assert.equal(style['--game-width'], '422px'); assert.equal(style['--game-height'], '195px');
  assert.equal(style['--game-left'], '10px'); assert.equal(h.metrics.allocations, allocations);
  h.visualViewport.height = 160; h.visualViewport.emit('resize'); h.flush();
  assert.equal(style['--game-height'], '160px'); assert.equal(h.metrics.allocations, allocations + 1);
  near(h.run('H/W'), 160 / 422, 1 / 640);
  Object.assign(h.visualViewport, { width: 390, height: 844, scale: 1 });
  h.visualViewport.emit('resize'); h.flush();
  assert.equal(h.document.body.classList.contains('mobile-portrait'), true);
  assert(h.run('W>=128 && H>=120 && H<=800'));
});

test('a hybrid device activates touch layout after first touch without changing mouse ownership', () => {
  const h = harness({ coarse: false }); h.game();
  assert.equal(h.document.body.classList.contains('touch-device'), false);
  h.point('game', 'pointerdown', 1, 500, 100, { pointerType: 'mouse' });
  assert.equal(h.run('touchLook.id'), null); assert.equal(h.run('coarse'), false);
  h.point('game', 'pointerdown', 2, 500, 100);
  assert.equal(h.run('coarse'), true); assert.equal(h.document.body.classList.contains('touch-device'), true);
  assert.equal(h.queuedFrames.size, 1);
});

console.log(`PASS ${passed} mobile input/viewport regression scenarios. Native browser rendering and physical-device behavior remain separate checks.`);
