# FrameMaster MZ — Changelog

## v2.3.0

- NEW: **.webp support** — frame images can be `.png` or `.webp` (60-80%
  smaller, same quality); forge accepts/drops WebP, pack includes it,
  runtime uses `loadBitmapFromUrl` for `.webp`
- NEW: **PlayOnce / Independent Actions** — one-shot on characters,
  battlers and pictures (`playOnce` / `playBattlerOnce` /
  `playPictureOnce` + 3 Plugin Commands, dual namespace) that returns
  to auto-pilot or native sprite; loop forced off, callback chainable

## v2.2.0

- NEW: **Battler layers** — suffix/fixed layers draw over idle/attack/hit
  battle frames too (actor = _mainSprite, enemy = self); weapon sprite
  still parks during FM, layers survive the battle-start sweep
- NEW: **8-direction auto-pilot** — 4 diagonal walk slots (`walkDownLeft`
  etc.), vector via real-vs-logical position deltas (any pixel mover),
  AutoPlay gains the 4 diagonal args + docs; blend/persistence unchanged
- Forge: battle Sets visual tab now lists the new diagonal slots

## v2.1.0

- NEW: **Layers / visual equipment** — suffix layers follow the base
  animation id, fixed layers play any overlay; per-layer anchor + dx/dy
  offsets; lockstep frame timing; max 8 (perf guard)
- NEW: DB note-tag auto-equip (`<fm-layer:weapon:_iron>`), rebuilt on
  every equip change via a single `Game_Actor.refresh` hook; manual
  LayerSet entries survive; player = party leader, followers = actor
- NEW: `LayerSet` / `LayerClear` commands + `setLayers` / `clearLayers` /
  `getLayers` API + `layerViews()` view helper
- Layers persist in save files; map characters only (battlers ignore them)
- Forge: live layer-test composite in the animation preview

## v2.0.0 (everything free)

- MERGE: the ex-PRO file is gone — battlers, pictures, script events and
  the battle director live in the single free `FrameMaster.js`
- Old `FrameMasterPRO` plugin commands keep working (legacy namespace)
- `window.FrameMasterPRO` kept as a deprecated alias
- Docs merged into `doc/FrameMaster_HELP.md`; single free LICENSE

## PRO v1.1.0 (requires LITE v1.2.1+)

- NEW: **Battle Director** — battle sets map moments (idle/appear/
  attack1-3/skill/item/defend/hit/evade/die/victory) to animations with
  attack cycle-random-first pick, HP phase swaps, appear→idle entry,
  one-shot→idle chains, stuck-frame watchdog
- NEW: `BattleSetup` command (enemy/actor/all) + `assignBattleSet` /
  `clearBattleSet` / `getBattlerSet` / `playBattlerState` API
- Battle Sets visual tab in the online forge (states, phases, pack export)
- Demo battle content: slime_attack/hit/die art + anims + slime_battle set

## PRO v1.0.0 (requires LITE v1.2.1+)

- NEW FILE `FrameMasterPRO.js`: battlers (actors + enemies, SV + front),
  map pictures, script frame-events (`owner`, `fm` + game objects)
- `PlayBattler` / `StopBattler` / `PlayPicture` / `StopPicture` commands
  and matching `$gameFrameMaster` API (+ transitions, getters)
- FM → FM crossfade blends on battler/picture sprites; hit-flash, popups,
  states and collapse keep working; actor weapon parks during FM
- Editors gained `+ Script ★` frame events (PRO badge, 5000-char cap)
- Docs: `doc/FrameMaster_PRO.md`, commercial `LICENSE_PRO.md`

## LITE v1.2.1

- Unknown frame-event types preserved for extensions (PRO script events
  load in LITE and are ignored); `_fireFrameEvents` passes the owner along
- No behavior change for free users

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
