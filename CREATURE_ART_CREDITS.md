# Beta 0.2.8 Drowned Hollow art

The Drowned Hollow uses original face and skin artwork generated for ASHFALL with the built-in image generation tool. Its articulated mesh, animation, texture mapping and lighting are authored in `src/restroom-creatures.js`.

## Retained artwork

This release contains two embedded 128 × 128 RGB tiles: the approved Hollow face and the original veined wet skin. Each encoded tile contains a 96-color RGB palette followed by 16,384 palette indices. The synchronous runtime decoder needs no external image request.

The approved face tile is unchanged from beta 0.2.7. SHA-256 of its encoded `RSC_ATLAS[0]` string: `5ea609ec74d888672a2fe47fcb660869720192c9412b9905665ba851c25a7d90`.

The skin receives a cool, pale waterlogged tone during decoding. A darker variation follows the closed folds of the torso. The original generation prompt was not retained. The relevant design brief was a gaunt, wet, hollow face with an open mouth, and organic, veined wet skin for a creature in flooded institutional reservoirs.

## Body revision

The beta 0.2.8 body is new code-authored geometry: a sealed, distended abdomen and chest, sagging folds, uneven swollen limbs, and rounded empty hands. The face, authored 2.05 scale and nominal head position are preserved. It has no open abdominal cavity, handheld weapon or pointed hanging appendages.

Only the two retained runtime tiles are distributed. There is no supplemental source atlas in this release. The 29 inherited media payloads and their original credits in `CREDITS.md` are unchanged.

## Verification scope

Native geometry and raster checks cover invisible bodies and reflections, closed torso surfaces, height, the exact retained face data, texture detail, muzzle lighting, depth occlusion, water and mirror masks, and a bounded single-creature rendering budget. Native captures inspect the changed body in the authored dark reservoir. These checks do not establish browser or phone frame rates or replace an in-game player review.
