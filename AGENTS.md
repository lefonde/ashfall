# ASHFALL development guidance

This repository hosts the public beta 0.2.0 on GitHub Pages. The owner authorized publishing and asked for sensible website packaging instead of uploading the 50 MB standalone HTML. All 29 media payloads retain their exact original bytes; website changes concern asset transport and maintainability only.

`src/modules.json` defines 63 ordered runtime units that share lexical game state. `tools/build.py` combines them into one script to preserve hoisting and startup order. Edit source, then regenerate the root entry page and `assets/code/` outputs. Do not edit the compiled script directly or split the runtime into independently executing scripts without checking initialization dependencies.

Image/audio filenames identify their exact content. Keep source/manifest references and generated output consistent. Preserve complete cue data, including the multiline Heart finale cues. Run `python3 tests/check_distribution.py` and `node tests/check_asset_loader.cjs` after packaging changes. If the original standalone beta is available, pass it as `--standalone` to check exact inherited media, UI and gameplay code.

The owner requires staged game development: one working version with focused playtest pointers, followed by a pause for feedback. Publication does not authorize a new gameplay phase. Preserve selected creature voices, the short Warden hallway disappearance and the credits-gated selected-only gallery. Unstitched/death choices remain unapproved; do not replace them silently. Do not broaden gameplay, art or audio changes as part of hosting maintenance.

Differentiate native code/asset checks from real-browser playthroughs and listening. Keep secrets, temporary files and redundant standalone exports out of this public repository.
