FrameMaster MZ — demo images
============================

This folder already contains runnable placeholder art:

  slime_0.png ... slime_7.png   bouncing slime (8 frames, 48x48)
  hero_run_sheet.png            288x48 run cycle (6 cells of 48x48)

Copy this folder's contents into your project's img/framemaster/
together with demo/data/framemaster/*.json into data/framemaster/,
then press F8 during playtest: slime_idle, hero_run and slime_bounce
play immediately.

Replace these PNGs with your own art anytime (same file names and the
demo animations keep working). Regenerate them with:
  node tools/make_demo_art.js
