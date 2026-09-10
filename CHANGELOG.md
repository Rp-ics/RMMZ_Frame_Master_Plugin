# FrameMaster MZ — Changelog

## v1.2.0

- Loop modes per animation: normal, ping-pong (forwards-backwards), random
- Web exports: animated GIF (loop baked in), single-PNG sprite sheet
  (strip/grid + JSON frame map), frames ZIP
- New demo animation: `slime_bounce` (ping-pong)
- Runnable placeholder demo art (`slime_*.png`, `hero_run_sheet.png`)
- F8 preview shows the loop mode; both editors gained the Loop mode control

## v1.1.0

- Auto-pilot (Godot-style states): idle / walk / dash + per-direction
  variants via `AutoPlay` / `AutoStop` commands and script API
- Manual `play()` pauses auto-pilot, `stop()` resumes it
- Auto-pilot config persists in save files
- F8 self-diagnosis panel (registry + per-file status, running path)
- Fixed: registry kept across New Game (no more eternal "loading…")
- Fixed: `.png.png` double extension (MZ appends `.png` itself)

## v1.0.0

- Core runtime: unlimited frames on Player + Events, sheet slicing,
  per-frame durations, loop/loopFrom, frame events (SE/CommonEvent/Switch)
- Crossfade blends, save/load mid-animation
- Script API (`$gameFrameMaster`) + Plugin Commands
- Standalone visual editor + online Animation Forge (pack ZIP export)
- F8 in-game preview scene
