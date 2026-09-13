# Beta 0.2.1 — focused phone playtest

Use the website in a normal browser tab. Start on Standard, rotate to landscape, and confirm **BETA 0.2.1** appears on the menu.

1. **View and fit:** Check the menu, Options, normal gameplay, map and boss HUD. Try landscape both ways, including with a notch on either side. Nothing essential should sit under the notch/home indicator, and the center aiming area should remain clear. Repeat with browser bars visible and after they change size. Portrait remains playable, with a landscape suggestion in the menu.
2. **Move + aim + shoot:** Hold the left stick while dragging on FIRE. Then keep shooting while aiming with a separate finger on the scene. Lift either finger: the remaining action should continue. Try RELOAD, MELEE, DASH and GUN. Adjust Aim sensitivity and confirm it changes touch aiming.
3. **Interrupt safely:** Pause, open the map, switch apps, lock the screen and rotate the phone. No movement or shooting should remain held after resuming. Rotation deliberately pauses an active game.
4. **Browser gestures:** Long-press/drag the joystick, FIRE and other gameplay buttons. Test two fingers on the scene. Gameplay should not select text, drag elements or open a page context menu. Options must still scroll, sliders must work, and Pause → Beta Feedback must still allow selecting/copying text. Browser/OS edge-navigation and home gestures remain controlled by the browser/OS.
5. **Clear exits:** Restore power in Admissions; find the steady mint Security exit sign and open arch. Complete all three Fever Theatre systems; check the Exit Airlock signs. Near either open exit, E or the touch EXIT action should advance; walking through still works.
6. **Chapter 4:** Approach keys, extinguisher, supplies, ambulance and the wounded Seraphim. Verify the dedicated prompt and USE label agree, disappear out of range/behind a wall, and operate the target. The combat buttons should stay in place when USE appears. Watch the compass/objective through the quest, boss and aftermath for alternating text.

## Verification performed

Native checks exercise the actual input handlers, visible viewport resizing, independent touch ownership and cancellation, HUD composition across repeated frames, contextual reach/facing/occlusion, packaged source consistency, JavaScript parsing, and audio transport. Media/cue checks compare against the original beta 0.2.0.

The browser available during development blocked local build navigation. This release therefore has **not** been visually playtested in an actual browser or certified on iPhone Safari, Android Chrome or Firefox. CSS layout was reviewed and control geometry checked without a browser. Please test on your phones before replacing the public beta.

Report: phone model, OS/browser version, screen orientation, scene, exact action, and a screenshot or short recording. Pause → Beta Feedback includes the build version, visible viewport size and current scene.
