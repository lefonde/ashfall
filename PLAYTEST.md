# ASHFALL beta 0.2.9 — release notes

This beta improves performance while retaining the current levels, water, sound, controls and Drowned Hollow design/balance.

## Files and release

- **ashfall-beta-0.2.9.html** is the complete single-file game. Keep this file intact when sharing it.
- **ashfall-web-beta-0.2.9.zip** contains the static website and editable source. Extract it and serve `index.html` with its adjacent `assets/` directory. For GitHub Pages, place those contents at the configured publishing root. It needs no backend or runtime dependency installation.
- These files are prepared for a beta release. This task does not publish or change an existing hosted site.

Use the same hosted origin and path when updating if you want that browser's current checkpoints/settings to remain available. Existing compatible checkpoints and the previous-generation recovery behavior are retained.

## Changes

- Transfer entrances/exits render only the necessary views and restrict expensive adjoining-world shading to the doorway. The problematic forward entry frame changes from three scene renders to one.
- Transfer composition removes all full-screen Canvas pixel readbacks. Reusable buffers and snapshots reduce repeated allocation.
- The host renderer skips floor and ceiling work that opaque walls cover. Water, mirrors and both staircase views reject work outside their contributing surfaces.
- Transfer exit restores existing lighting and collision, with enemy/compass navigation prepared during the hallway instead of rebuilt at the crossing.
- The full restroom world and unchanged gallery reverb are prepared during initial loading. The initial preparation step can take longer; the first staircase view and hallway entry no longer need to perform that construction.
- Unchanged navigation, checkpoint generation, audio positions and HUD values reuse prior results. Dynamic map/furniture/vehicle/boss changes still invalidate navigation correctly.
- Optional local performance recording includes whole-frame intervals and separate update/render CPU time. It is off by default and transmits nothing. The existing automatic resolution thresholds remain; cooldown now follows elapsed time.

All 84 rooms, six districts/floors, spatial folds, water/projectile reflections, Warden behavior, secret progression, and the approved Hollow are retained. The removed encounters stay removed, including after loading old saves. Approved water/audio source files, creature artwork/world geometry, all 29 inherited media files and original cue constants remain unchanged.

## Verified for this release

- **25 full-art views exactly match beta 0.2.8**, pixel for pixel and in final camera/world state, at the same 640 × 296 resolution. These cover both Transfer portals, flooded rooms, an actual visible mirror and three staircase viewpoints.
- Four additional masked-versus-full portal image comparisons and twelve portal performance/work gates pass.
- Thirteen preparation/crossing checks verify exact navigation, preserved lighting/collision, cancellation/retry behavior and bit-identical gallery PCM.
- Sixteen Transfer scenarios, ten flooded-hallway haunting checks and twelve reciprocal portal continuity checks pass.
- Sixteen mobile input checks and the HUD interaction gate pass.
- Twenty-three encounter checks pass, including real movement, reloads and limited-ammo counterplay with all three weapons. The full save suite passes 40 existing cases plus a cache-specific case; threat audio passes 20 existing DSP/lifecycle checks plus the owner-update assertion. The save/audio results were completed during implementation against the resulting source and retained for the release, without redundant reruns.
- Eight new diagnostic/loading checks and twelve existing resolution-adaptation checks pass.
- All seven restroom integration suites pass: 79 checks. Full traversal reaches all 84 rooms and the exit across 121,072 reachable poses; 242 ordinary connection directions pass, including 52 stair directions. Chapter controls, seamless stairs, ballistics, rendering, sewer progression and reflection masks pass.
- The web distribution, all ten MP3 decoder routes, original beta 0.2.0 media/cue comparison, and standalone JavaScript parse checks pass.

These are native runtime, Canvas and audio-processing tests. The test browser could not open the local server, so this release does **not** claim measured browser/phone FPS, a live listening review, or physical-device thermal testing. Work reductions are verified; their FPS benefit depends on the device/browser.

## Suggested beta playtest

1. Use **Hallway playtest → Level 1 entrance**, then Level 2. Approach slowly, turn away/back, cross while moving and firing, and inspect the exit. Check for smooth camera movement and stable frame pacing at both thresholds.
2. Enter the lower chapter through the post-Heart left staircase. Look down/up during the descent, then inspect flooded galleries, reservoirs and mirrors. Check projectile reflections and water sound.
3. Preview the Drowned Hollow, then continue a normal campaign/checkpoint. Confirm that its approved appearance and combat pacing feel unchanged.
4. On a phone, test landscape, simultaneous movement/aim/fire, pause/resume and orientation changes. Play a longer session to check heating and sustained frame rate.

For optional local timing capture, see `PERFORMANCE.md`. Keep quality settings equal when comparing against beta 0.2.8. Do not interpret native work-count savings as a promised percentage increase in FPS.
