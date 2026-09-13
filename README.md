# ASHFALL // NEON WARD — Beta 0.2.1

Mobile controls, landscape layout, clear interactions and stable navigation for the four-chapter horror FPS. This is a downloadable release; uploading it is a separate step from building it.

## Play

For a website, publish the contents of this folder with `index.html` at the root. Keep `assets/` beside it. GitHub Pages can serve it from the repository root; `.nojekyll` is included. A local web server also works: `python3 -m http.server 8000`, then open `http://localhost:8000`.

The separately supplied `ashfall-beta-0.2.1.html` contains the same game and all media in one file for offline desktop use. On phones, use the hosted website: opening HTML from a phone's file preview is not equivalent to running it in a browser tab.

### Touch

- Left stick: move. Swipe open scene space to aim.
- Hold **FIRE** to shoot; drag the same finger to aim while shooting. A separate aim finger also works.
- **DASH**, **MELEE**, **RELOAD**, and **GUN**: immediate actions. GUN cycles available equipment, including a carried Seraphim.
- The separate **USE** button appears for a reachable item, sign, ambulance, angel, or open chapter exit. Its label describes the current action.
- **MAP** pauses the action. **PAUSE** opens the pause menu. Rotate to landscape for the widest view; rotating during play pauses and releases all held controls.
- **Options → Aim sensitivity** adjusts touch and mouse aiming. Fullscreen is offered when the browser exposes the required API. Gameplay fits the visible browser area without fullscreen.

Keyboard: WASD move · mouse aim/fire · 1–4 or wheel equipment · R reload · Q/right click melee · Space/Shift dash · E use · M map · Tab peek · U mute · Esc pause.

Start on Standard. Headphones recommended. Reduced flashes and motion are available in Options. Checkpoints last for the current browser session; closing or reloading starts a fresh run.

## Changes

- Safe-area-aware edge controls, compact HUD and portrait/short-landscape layouts. USE appears independently of the combat controls so they do not move during an interaction.
- Canvas, HUD and menus follow the visible viewport as browser chrome changes. Mobile weapons occupy less of the view.
- Independent touch ownership, drag-to-aim firing, press feedback, cancellation cleanup, and gameplay-scoped selection/context-menu/gesture guards. Menus remain scrollable and feedback text remains selectable.
- One final HUD update path removes conflicting chapter 4 compass/objective updates. Direction thresholds have a small dead band to prevent jitter.
- Clear contextual interaction prompts and matching touch actions for quest items, ambulance, Seraphim and exits.
- Chapters 1 and 2 have readable exit plaques and steady light/door trim once the exit unlocks.

All 29 media files, audio cue data, selected creature voices and existing campaign progression are preserved. See [PLAYTEST.md](PLAYTEST.md) for focused checks and validation limits.

## Build and check

No npm install or application server is required for deployment. `src/modules.json` defines the ordered runtime modules, which are compiled into one script to preserve shared scope.

```sh
python3 tools/build.py
python3 tests/check_distribution.py
node tests/check_asset_loader.cjs
node tests/check_hud_interactions.cjs
node tests/check_mobile_input.cjs
```

To verify inherited media and cue data, pass the original beta 0.2.0 HTML to `check_distribution.py --standalone /path/to/ashfall-beta-0.2.0.html`.

To export one self-contained HTML after building:

```sh
python3 tools/export_standalone.py /path/to/ashfall-beta-0.2.1.html
```

Commit `src/`, generated `index.html`, and `assets/code/` together. Media filenames contain content hashes. Keep their exact filenames and bytes; the original standalone beta 0.2.0 checksum is `c38b4c928977a12710e2033e5bfac09d64041f935153b9b8895a9171e8a2d52b`.

Full audio attributions remain in Options and credits; see [CREDITS.md](CREDITS.md).
