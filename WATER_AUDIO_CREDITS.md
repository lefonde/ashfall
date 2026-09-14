# Recorded water audio in ASHFALL beta 0.2.6

The main audible water footsteps now use six actual water recordings from RomanKolachnik's [Water Footsteps pack](https://freesound.org/people/RomanKolachnik/packs/37492/) on Freesound, published February 1, 2023. Each individual source page identifies its sound as **Creative Commons Zero 1.0**. The [CC0 public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/) permits copying, modification and redistribution, including commercial use. Credit is retained voluntarily.

The publicly offered high quality MP3 previews linked on the source pages were downloaded September 13, 2026. Each preview was decoded to mono 24 kHz, gently band-limited at 48–5100 Hz, trimmed only at near-silent edges, level-balanced with a peak ceiling, and faded over 8 ms at the start and 20 ms at the end. The resulting 16-bit little-endian PCM is embedded in `src/restroom-water-samples.js`. Playback uses these recordings as the main splash texture; wet-depth variants alter timing and filtering and add a quiet low-frequency layer from the game's unchanged boot sounds. Water-motion and impact variants reuse the recordings without the boot layer. No downloaded recording is replaced with an attribution-free claim of original synthesis.

The original 29 inherited media payloads and original cue tables remain byte-identical. The embedded PCM requires no additional runtime network request or browser codec support.

| Source | Public preview | Download SHA-256 | Embedded PCM SHA-256 |
| --- | --- | --- | --- |
| [Footsteps 672202](https://freesound.org/people/RomanKolachnik/sounds/672202/) | [MP3](https://cdn.freesound.org/previews/672/672202_14677358-hq.mp3) | `166769484044adecb905ace6702217ad024b7c169cb8e5b75ae21074a7063db0` | `74fc728cd0d41326dd089421a5b632e586a2374c651fef283cef7b2667f1dbd9` |
| [Footsteps 672201](https://freesound.org/people/RomanKolachnik/sounds/672201/) | [MP3](https://cdn.freesound.org/previews/672/672201_14677358-hq.mp3) | `da335760a07ce60a26b2f86195c7df300740290fd6101f42ada1abbb6e1955fe` | `f171a972c4f4d680bf9eca7c644cd62a71ea200c6f6dd85c4ecd8fdd686387d8` |
| [Footsteps 672200](https://freesound.org/people/RomanKolachnik/sounds/672200/) | [MP3](https://cdn.freesound.org/previews/672/672200_14677358-hq.mp3) | `0fee01006f92f630c7f228a3c846f27cd0e557a67be6dc4025f8f1968a735c1f` | `7b0137256df31eaa054229f346082298339de4134afa82b37e55d1b3c95c152d` |
| [Footsteps 672199](https://freesound.org/people/RomanKolachnik/sounds/672199/) | [MP3](https://cdn.freesound.org/previews/672/672199_14677358-hq.mp3) | `a46245aac0867a83c45cf24e4a905491a10fc9aee8d80a970e195efdd1ae60c6` | `47bd81b8ab524e7d69b73439be10e948555501f16bf9d0b48dd31b3fdb46a992` |
| [Footsteps 672205](https://freesound.org/people/RomanKolachnik/sounds/672205/) | [MP3](https://cdn.freesound.org/previews/672/672205_14677358-hq.mp3) | `c50a70992f14b36d837cd0ac21a5bd58ffd27a266954af2c540ea1f397a291e6` | `8a609c5aa5c638ed973f0c172bed13d00a9f2d4e6ca84fb6a3751425ed9fe472` |
| [Footsteps 672204](https://freesound.org/people/RomanKolachnik/sounds/672204/) | [MP3](https://cdn.freesound.org/previews/672/672204_14677358-hq.mp3) | `c3dae4ed2393180761d8d40e41863a3001115196582db23051f469ffa6f28ccb` | `a152cff2fdd33a933238b09cd492b455595d1f2905d4cc04a326710c30def6cd` |

Objective DSP and lifecycle tests are not a substitute for listening. The source descriptions establish recorded-water provenance; perceived realism and the in-game mix still require human review.

## Water preview

`ashfall-beta-0.2.6-water-preview.wav` is a 14.8-second offline preview using the game's actual cached water/boot buffers, six takes, playback rates, step gains, stereo room impulse responses, and default SFX/master gains. The room low-pass is approximated with an RBJ biquad; the final master bass shelf, compressor and waveshaper are omitted. It is not a browser recording or a human listening test, and it has no added loudness normalization.

| Time | Sound |
| --- | --- |
| 0.0–0.7 s | Silence |
| 0.7–4.6 s | Shallow-water steps in a tiled room |
| 4.6–7.0 s | Splash and room tails |
| 7.0–10.9 s | Deeper-water steps in a large pool room |
| 10.9–14.8 s | Final splash and pool echo decay |

The preview uses the final wet cadence: 1.45 movement units per footstep at a movement speed of 4.25 × 0.93, or 2.726 footsteps per second. The previous 0.95-unit cadence produced 4.16 footsteps per second and excessive overlap. Movement speed is unchanged.
