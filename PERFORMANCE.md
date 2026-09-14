# ASHFALL beta 0.2.9 — performance implementation

This release implements the lossless stages of the performance plan: reduce unnecessary rendering and repeated CPU work while retaining the current game. No rooms, geometry, creature features, water effects or approved sounds were removed. No new resolution reduction was used to obtain the reported work savings.

## Rendering and crossing changes

- A render plan chooses the physically correct side of a Transfer doorway before rendering. Each necessary world renders once; a world with no contributing pixels is skipped. The problematic forward entry frame now renders one hallway view instead of two hospital views plus the hallway.
- Adjoining-world floor, wall and water shading follows the doorway aperture. Lightweight full-width depth rays remain because sprite crop sampling depends on them; removing those rays caused small image differences during development and was corrected.
- Reusable Canvas surfaces compose the complete world, including sprites and props. Transfer portals use zero Canvas image readbacks. Color/depth storage, render snapshots and parked entity lists are reused.
- The host renderer omits floor and ceiling shading that opaque walls overwrite.
- Water and mirrors use reusable masks, reflected-camera culling and bounded raster rows. Empty reflection passes and unnecessary color-buffer copies are skipped. Vertex and clipping storage is reused.
- Both directions of the Heart/restroom staircase restrict expensive drawing to their visible opening. Upstream water-refraction pixels are retained where required for exact output. The reverse staircase still performs readbacks for its existing reprojection; eliminating those would require a larger rendering change.
- Leaving Transfer restores the parked lighting/collision caches and seals the doorway locally. Enemy and compass navigation are prepared in bounded steps during the hallway, with correct fallbacks for unusual direct-preview exits. The actual normal crossing does not rebake lighting or rebuild navigation.

## Preparation and recurring work

The full authored restroom world and unchanged gallery reverb are prepared before the initial loading gate enables play. This moves first-use work out of the visible staircase and hallway entry; initial preparation can take longer. The gallery retains the exact approved PCM and a bounded cache entry.

Navigation fields reuse unchanged map and collision inputs, including dynamic furniture, exterior vehicles and the live boss. Updates without eligible pursuing enemies skip navigation work. Changed topology still rebuilds the correct field.

Checkpoint generation is encoded once, validated data is cached by its exact stored text, and redundant unchanged writes are suppressed. Immediate milestones, backup generations, retry resources, corruption fallback and old-encounter filtering remain. Active creature audio positions update once, while HUD values are written only when changed.

The existing restroom resolution settings and thresholds remain. Its cooldown uses elapsed time. Wider automatic quality changes, GPU migration and worker rendering were conditional later options in the plan; this beta does not introduce them.

## Verification evidence

An independent native Canvas comparison used all original artwork at 640 × 296 and found **25 exact matches to beta 0.2.8**, covering 4,736,000 final displayed pixels and the matching camera/world state:

- Eighteen Transfer poses across both chapters, including approaches, oblique/backward views, and both threshold straddles.
- Four authored flooded/mirror room views, including an actually visible mirror.
- Three staircase views, including reverse and steep-pitch views.

The sampled forward entry changes from three scene renders to one. Sampled Transfer views use zero image readbacks, previously two or three at visible doorways. A mirror-facing P01 view skips 814 water-reflection face submissions without changing any displayed pixel. A synthetic flooded aperture produces the same image with over 40% fewer raster candidates. These are work-count results for the named cases, not whole-game FPS percentages.

Portable regression tests cover masked/full secondary image equality, work budgets, buffer reuse, viewport changes, prewarmed PCM equality, crossing restoration, navigation invalidation, save durability and whole-frame diagnostics. `PLAYTEST.md` records the release gate results.

**Measurement limit:** the test browser could not open the local server (`ERR_BLOCKED_BY_CLIENT`). Validation therefore uses native simulation, Canvas and audio processing. No real-browser FPS, physical-phone compatibility/performance, live listening or thermal result is claimed for this beta.

## Optional local performance recording

The shipped build does not collect or transmit performance records by default. To investigate a device slowdown, open a hosted game with `?perf=1`, or start a recording in that game's developer console:

```js
ashfallPerformance.start()
// Play through the slow area, then pause.
ashfallPerformance.stop()
ashfallPerformance.download()
```

`ashfallPerformance.report()` returns the report without downloading it. The recorder keeps the latest 1,800 gameplay frames, up to 96 events, frame intervals, separate update/render CPU times, scene/resolution, render-work counters and aggregate named spans. It does not send a network request or log every frame. Pause/background gaps are excluded from gameplay pacing samples. Timing work runs only when recording is enabled.

Compare the same route at the same selected resolution, effects and device conditions. Frame intervals include scheduling; CPU spans exclude browser presentation. Do not compare native timings to phone FPS. Recheck both hallway entrances/exits, stairs, flooded combat, mobile landscape orientation and a longer device session before announcing a device-specific performance target.
