# Drowned Hollow voices — beta 0.2.8

The Drowned Hollow retains its approved dragging inhale, low chest growl and abrupt overlapping roar. Its attack has a sharper mouth articulation over the low body layer. The slowed creature movement changes encounter timing without altering these performances.

The source performances come from the existing approved Orderly audition bank, the inherited Orderly voice bank, and existing breath/organic contact cues. The chapter remixes copies of those samples. All original media files and cue offsets remain unchanged; beta 0.2.6 water PCM and the entire existing water/footstep module remain byte-identical. No new music is added.

The Hollow has awake, breath, charge, windup, attack, hit and death cues, with two cached takes per cue. All 14 are baked during the existing audio loading gate. Encounter callbacks allocate sources but do not create PCM buffers. Its voice is emitted from the articulated mouth, matching the rendered scale and rotation. HRTF is used where available; stereo and mono fallback retain the cue. Distance, connected rooms, solid occlusion and existing local pool/tile/cavern responses shape the result.

The mix allows one active throat. Previous voices fade for 18 ms; at most two such tails are retained. A charge displaces a breath, damage responds immediately, and repeated shotgun pellet hits cannot produce stacked pain screams. At least two slots in the existing 24-source graph are reserved when admitting a new voice, so water and environmental motion retain space.

## Included 11-second listening preview

`ashfall-beta-0.2.8-hollow-voices.wav` contains only the Drowned Hollow:

| Time | Performance |
| --- | --- |
| 0.2–1.6 s | Breathing, approximately 12 m away |
| 2.1–3.9 s | Awake warning, approximately 15 m away |
| 4.05–5.7 s | Charge, moving from 15 m to 2 m |
| 5.95–6.9 s | Close attack |
| 7.25–7.8 s | Hit reaction |
| 8.2–10.0 s | Death |
| 10.0–11.0 s | Large-pool decay |

The preview preserves the approved prior Hollow audition sample-for-sample through 10.95 seconds, then fades the remaining pool tail over the final 50 ms. It uses exact runtime-baked PCM from the actual inherited decoded recordings. Its room response is an offline convolution with the actual game response buffers. Stereo panning, chosen distances and event timings are authored for review; live HRTF, physical occlusion, the master limiter and actual AI movement are not simulated. No human listening or real-browser listening test has been performed.

Run `node tests/check_restroom_threat_audio.cjs` for the focused native checks. The suite is self-contained and uses deterministic signals for DSP checks. Regression hashes confirm all 14 retained Hollow takes are sample-identical to beta 0.2.7 when given identical inputs. The water preservation check compares SHA-256 hashes verified against the approved beta 0.2.6 sources; no previous checkout is required. Other checks cover finite samples, mouth placement, occlusion, routing, audio lifecycle, priority gating and the single-voice limit.

The optional `--render` mode exports actual-bank Hollow event PCM and pool impulse responses for a listening preview; it is not part of runtime. Set `ASHFALL_AUDIO_BANK_DIR` to an existing input directory containing these decoded files, all mono, 24 kHz, raw little-endian float32 PCM:

| Decoded filename | Included source recording |
| --- | --- |
| `approved.f32` | `assets/audio/creature-auditions-a190f10c4f0b.mp3` |
| `fx.f32` | `assets/audio/fx-7b8598627e4a.mp3` |
| `monster.f32` | `assets/audio/creature-voices-0244fee2a287.mp3` |

For example, FFmpeg decoding uses `ffmpeg -i INPUT.mp3 -ac 1 -ar 24000 -f f32le OUTPUT.f32`. With those files prepared, run `node tests/check_restroom_threat_audio.cjs --render`. Set `ASHFALL_AUDIO_PREVIEW_DIR` for a separate output directory; otherwise output is written beside the input PCM. No machine-specific paths are embedded in the suite.
