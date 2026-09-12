# ASHFALL // NEON WARD

**[Play beta 0.2.0](https://lefonde.github.io/ashfall/)**

A four-chapter browser horror FPS: a living hospital, overwhelming weapons and places that should not exist.

Start on Standard. Forgiving offers more room to explore; Unkind raises the pressure. Headphones recommended. The game contains horror, gore and flashing effects; Options includes reduced flashes and motion.

## Playing and beta feedback

WASD move · mouse aim/fire · 1–4 or wheel switch available equipment · R reload · Q/right click melee · Space/Shift dash · E interact · M map · Tab peek · U mute · Esc pause.

Checkpoints last for the current browser session. Closing or reloading loses the run. Mouse and keyboard is the main beta target; touch controls are also included.

Use Pause → Beta Feedback → Copy Feedback Details to prepare a bug report. Nothing is sent automatically. Please describe your best moment, any confusing objective, unfair fight, repetitive sound, slowdown or retry problem. Include device/browser and difficulty. After completing the campaign, the credits lead to a creature gallery with the selected voices.

## Website layout

- `index.html`: lightweight entry page.
- `assets/images/` and `assets/audio/`: exact original artwork and MP3 recordings, saved as individual binary files. Filenames contain content hashes so unchanged media can be reused from browser cache across updates.
- `src/`: ordered game modules, stylesheet, page template, cue data and media manifest.
- `assets/code/`: generated runtime and CSS. One runtime script preserves the original game's shared scope and function ordering.
- `tools/build.py`: dependency-free static packager.
- `tests/`: native distribution and asset-loader checks.

Build with Python 3:

```sh
python3 tools/build.py
python3 tests/check_distribution.py
node tests/check_asset_loader.cjs
```

Commit source changes together with the generated page/code. Media must retain their manifest checksums; replacing a recording or image requires a new content-hashed filename and corresponding manifest entry. No npm installation or application server is needed. GitHub Pages publishes `main` / repository root; `.nojekyll` keeps it a plain static site.

The web build uses approximately 37.7 MB before HTTP compression, compared with the 50.1 MB standalone HTML. It removes base64 transport overhead without reducing art or audio quality. A first visit still downloads the game's media; this release does not introduce chapter streaming or persistent campaign saves.

## Credits and verification

Full recording attributions and license links remain in the game's Options and credits. [CREDITS.md](CREDITS.md) contains a copy for repository readers.

Gameplay baseline: standalone beta 0.2.0, SHA-256 `c38b4c928977a12710e2033e5bfac09d64041f935153b9b8895a9171e8a2d52b`. Website changes are limited to loading separate assets and static packaging. All image/audio bytes, cue offsets, selected voices, game rules and the short Warden encounter are preserved.

Native checks verify source/media preservation and network-to-decoder behavior. They do not certify real-browser rendering, device performance or subjective sound quality; please include these in beta feedback.
