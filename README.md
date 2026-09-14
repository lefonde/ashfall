# ASHFALL // NEON WARD — beta 0.2.9

The Lower Restrooms is a separate exploration chapter beneath the hospital: 84 authored rooms across six districts and six lower floor levels, with flooded galleries, vaulted reservoirs, reachable court balconies, stable spatial anomalies and a hidden sewer escape into the outdoor campaign.

Beta 0.2.9 improves performance at unchanged visual quality. Transfer doorways render each necessary scene once, restrict adjoining-world shading to the opening, and compose without Canvas pixel readbacks. Water and mirror rendering reject work outside visible reflecting surfaces. Crossing restores prepared lighting, collision and navigation; ordinary navigation and checkpoint work reuse unchanged data. The full restroom world and the original gallery acoustic response are prepared during initial loading. This adds preparation before play in exchange for avoiding that first-use work at the staircase and hallway.

See `PERFORMANCE.md` for implementation notes, exact image comparisons and optional local diagnostics. Real-browser and physical-phone frame rates remain device-dependent; the automated checks do not certify a fixed FPS.

## Play

Open the separately supplied `ashfall-beta-0.2.9.html` for the single-file version. This web/source package uses `index.html` and its adjacent `assets/` folder; keep them together when serving it as a static site. No backend or runtime dependency download is needed.

The menu offers **Start the restroom chapter** for a new run beginning downstairs, and **Continue the descent** when a valid checkpoint is available. Chapter previews let you inspect individual districts, the two post-Heart routes, or the Drowned Hollow without replacing your saved campaign. The Hollow preview enables attacks but protect the player from damage; ordinary campaign appearances remain rare.

For the campaign route, complete the optional Transfer in the first or second level, defeat the Heart, and follow the Warden left at the existing hallway junction. The far-left stair descends into the new chapter. Without the discovery, the Warden leads right toward the normal exit.

Desktop: WASD movement; mouse looking and firing; E to use a door; M to open the exploration sketch; Escape to pause. The restroom camera can look and fire almost straight up or down; the reticle and all three weapons share the same sight line. Existing weapon, reload, melee and dash controls remain available.

Mobile: use landscape for the widest view. Left stick moves; drag on the right to look; FIRE can also be dragged to aim while held. OPEN/CLOSE appears only when a usable door is nearby. MAP pauses exploration. Safe-area handling, independent multitouch ownership and gameplay gesture suppression are retained.

The chapter adapts its internal render resolution to sustained rendering load, after a warmup, preserving the current scale at the entrance. It preserves viewport proportions, camera pitch and the resolution limit chosen in Options. Cooldown now follows elapsed time so it does not stretch when frames slow down. The original quality thresholds remain. Leaving restores the normal rendering scale; the HUD and touch targets retain their layout.

## The chapter

- Twelve public-wing rooms, eighteen wash galleries, sixteen cubicle-warren rooms, sixteen reservoir/perimeter rooms, twelve court/enclosed-gallery rooms, and ten undercroft/dry-wing rooms. Stalls, connectors and additional court decks are not counted as separate rooms.
- Four major flooded halls and three multi-floor courts, including real stairs, balconies and distant accessible rooms.
- Six fixed spatial connections with normal local movement and reversible traversal. Ordinary backtracking works; the Transfer's forward-only rule stays in its own hallway.
- Water footsteps tied to resolved movement and local water depth. Large spaces echo; selected rooms have local water ambience, and others have ambient silence.
- Indoor water with submerged floor visibility, reflected architecture and moving projectile light; district materials, local illumination, world-plane signs and selected mirrors.
- Doors, deep-side latches, persistent shortcuts, a floor/district exploration sketch and optional orientation hints.
- One extremely rare melee presence: the towering Drowned Hollow in a dark reservoir. A swollen, waterlogged body surrounds its hollow face; its belly is closed and its hands are empty. Angry breathing and water movement warn of its slower, heavy charge. The first hit or attack reveals it permanently. The Warden himself disappears before this chapter and remains absent within it.
- Real recorded water footsteps replace the synthetic water step layer, with quieter boot weight, depth variation and local acoustics.
- The optional Transfer hallway is flooded, with ripples and reflections. Both doorways show their actual adjoining space before crossing, preserving the camera, weapon and held inputs. Its existing movement rules remain intact; optical compression keeps the stationary Warden in view, and shots toward him provoke wall screams without harming him.

The first stair is at the original post-Heart left dead end. The new rooms do not enlarge or replace the Heart map. Crossing the bottom stair doorway closes the route back to the Heart. Deep in the undercroft, a service drain leads into a long sewer ascent and emerges between the hospital and lake. The exterior culvert is present on normal outdoor runs, but barred from that side until earned through the restrooms. The sewer joins the existing outdoor quest and Cerberus progression.

## Checkpoints

Checkpoints preserve the current chapter position, floor, inventory, health, explored rooms, door/shortcut state, spatial discoveries, consumed Transfer and resolved Heart. They are written at stable transitions, periodically during exploration, and when leaving the session. A previous valid generation provides a fallback if the latest checkpoint is corrupted.

Progress is stored by the browser in the current game location. Continue becomes available when that browser exposes a valid saved checkpoint. The menu reports a storage failure if saving is unavailable. Starting a new run replaces the previous run; isolated chapter previews do not. The Hollow encounter choice, reveal state and spent opportunity persist without reload rerolls. Older checkpoints are upgraded without restoring discontinued encounters or changing carried resources. Death retries downstairs. Sewer arrival has a durable checkpoint; exterior combat subsequently uses the existing in-session Journey checkpoints. Reloading the page resumes the sewer arrival anchor with its matching inventory and world state.

## Build and source

`src/modules.json` defines the ordered shared-scope JavaScript modules. `tools/build.py` combines them into one content-hashed script and produces the entry page and stylesheet:

```sh
python3 tools/build.py
python3 tools/export_standalone.py /absolute/path/ashfall-beta-0.2.9.html
```

Runtime code is intentionally bundled as a single script because the original modules share lexical state and initialization order. The restroom world, renderer, audio, controller and checkpoint modules are separate source files within that build.

All 29 inherited media files retain their exact original bytes and content-hashed filenames. Added architecture, creature geometry and room responses are authored in code. The Hollow uses its approved face and wet-skin textures embedded in the bundle; their provenance is recorded in `CREATURE_ART_CREDITS.md`. New recorded water Foley is embedded in the source, with source links and licensing in `WATER_AUDIO_CREDITS.md`. See `CREDITS.md` for inherited credits.

## Verification

```sh
node tests/check_mobile_input.cjs
node tests/check_hud_interactions.cjs
node tests/check_transfer.cjs
node tests/check_transfer_haunting.cjs
node tests/check_transfer_portals.cjs
node tests/check_transfer_performance.cjs
node tests/check_performance_parity.cjs
node tests/check_performance_preparation.cjs
node tests/check_performance_metrics.cjs
node tests/check_performance_recurring.cjs
node tests/check_restrooms.cjs
node tests/check_restroom_controls.cjs
node tests/check_restroom_transition.cjs
node tests/check_restroom_ballistics.cjs
node tests/check_restroom_rendering.cjs
node tests/check_restroom_render_masks.cjs
node tests/check_restroom_performance.cjs
node tests/check_restroom_encounters.cjs
node tests/check_restroom_creatures.cjs
node tests/check_restroom_sewer.cjs
node tests/check_restroom_audio.cjs
node tests/check_restroom_threat_audio.cjs
node tests/check_restroom_threat_world.cjs
node tests/check_restroom_save.cjs
python3 tests/check_distribution.py
node tests/check_asset_loader.cjs
```

The distribution check also accepts `--standalone /absolute/path/ashfall-beta-0.2.0.html` to verify the original media and cue data against the recovered baseline. `PLAYTEST.md` records the validation performed for this release and the remaining device/experience checks. Native simulation, Canvas renders and audio DSP checks are distinct from a real browser or phone playthrough.

`LOWER_RESTROOMS_PLAN.md` contains the approved scope and design rationale. This package contains a review build; it does not publish or alter an existing hosted site.
