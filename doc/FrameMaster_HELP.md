# FrameMaster MZ — Manual (v1.2.0)

Unlimited frame-by-frame character animations for RPG Maker MZ, with a visual
editor. Godot's `AnimatedSprite2D` philosophy, zero code required.

---

## 1. Installation

1. Copy `FrameMaster.js` into your project's `js/plugins/` folder.
2. Open the Plugin Manager (F10 in the editor... the MZ editor, not playtest),
   add **FrameMaster**, and set the 4 parameters:
   - **Default Blend (ms)** — crossfade used when a command omits blend (`120`).
   - **Preload On Map Load** — `true` recommended (kills first-play hitches).
   - **Debug Log** — `true` while setting up, `false` for release.
   - **Preview Key** — playtest hotkey for the preview scene (`F8`).
3. Create the folders in your project (the editor can do it for you):
   `img/framemaster/` and `data/framemaster/`.
4. Copy the demo: `demo/data/framemaster/*.json` → `data/framemaster/`,
   plus your PNGs → `img/framemaster/`.

> **Why is there no Tools-menu entry?** RMMZ plugins cannot extend the
> editor's `Tools` menu — there is no API for it. FrameMaster ships a
> standalone visual editor instead (next section) plus an in-game preview
> scene. Same workflow, no JSON hand-editing.

---

## 2. Visual editor (`tools/framemaster_editor.html`)

Open it in **Chrome or Edge** (only they allow folder auto-save).

> **Online alternative (recommended):** the same forge, always up to date,
> lives at **https://rpxgames.win/tools/framemaster/** — no install, works
> in any browser, and adds **Download pack (.zip)** with the exact project
> folder layout, a copy-paste play snippet, drag-and-drop PNG import and a
> preloaded demo.

1. **Open project folder…** → pick your MZ project root. The editor reads
   `img/framemaster/*.png` and `data/framemaster/*.json`, and every change
   auto-saves back (watch the status text: `Saved ✓`).
2. **+ New** an animation, rename it on the right (ID = slug for commands).
3. **Import frames**: *Add all PNGs as frames* (name-sorted), click any
   thumbnail to append it, or drop loose PNGs via the file picker.
4. **Sprite sheets**: pick the sheet, enter frame W/H, *Preview grid* to
   verify, *Slice → append* to generate one frame per cell.
5. **Timeline**: drag to reorder; click / Ctrl-click / Shift-click to select;
   batch-apply duration, clear events, or delete.
6. **Preview**: Space = play/pause, ←/→ = step frames, speed slider,
   *map grounding* toggle draws a fake ground shadow.
7. **Frame inspector**: duration in frames *and* ms, image swap, and
   **frame events** (+ SE / + Common Event / + Switch).
8. **Properties**: loop on/off, loop-from frame, base speed, anchor preset.

Firefox / Safari: folder access is unavailable — use the file pickers and
**Export JSON**, then copy the file into `data/framemaster/` and add a
`{ id, name, file }` line to `FM_Animations.json` by hand (one line, once).

---

## 3. Using animations in game (no code)

Plugin Commands — `Event → Plugin Command → FrameMaster`:

| Command | What it does |
|---|---|
| **Play** | Start animation on Player / This Event / Event ID, with loop override, speed, blend. |
| **Stop** | Stop and restore the normal charset sprite. |
| **TransitionTo** | Crossfade into another animation (keeps current speed). |
| **OpenPreview** | Open the preview scene anywhere (e.g. a debug event). |
| **AutoPlay** | Godot-style auto-pilot: Idle stopped / Walk moving / Dash dashing (+ optional per-direction variants). Set once, runs by itself. |
| **AutoStop** | Turn the auto-pilot off, restore the normal sprite. |

## 3b. Auto-pilot (the Godot way, still zero code)

Call **AutoPlay once** — e.g. an Autorun event on your starting map that runs
it on the Player and then erases itself. The classic full setup is an Idle
plus a Walk animation, but any single animation is enough: fill only what
you have (e.g. just the four directional walks) and anything uncovered
shows the original charset sprite.

- Target: `Player`, Idle: `hero_idle`, Walk: `hero_walk` → done forever.

From then on the character drives itself: stopped plays idle, moving plays
walk, dashing plays dash (or walk when Dash is empty). Fill the optional
`IdleDown…WalkRight` fields only if you made directional variants; anything
left empty falls back to Idle/Walk, and situations with no animation at all
show the original charset sprite.

Rules: a manual **Play** pauses the auto-pilot (for cutscenes etc.) and
**Stop** resumes it; **AutoStop** disables it completely. The mapping is
saved with the game, so it survives save/load.

## 3c. Loop modes

Each animation picks how it loops (visual editor → Loop mode):

- **Normal** — `0,1,2,…,n`, restart from Loop From.
- **Ping-pong** — bounce: `0,1,2,…,n-1,n-2,…,1,0,1,…` (Loop From ignored).
- **Random** — a different random frame every step, never twice in a row.

Modes apply to looping playback; a play-once animation always runs straight
`0…n` and then fires `onComplete`.

## 3d. Exporting outside MZ (online forge)

On the Rpx site forge (`tools/framemaster/`) every animation also exports
for global use: **GIF** (animated, loop baked in, 1–3x scale), **Sheet PNG**
(all frames in one strip/grid image + a JSON map of frame rects, 1–4x), and
**Frames ZIP** (one PNG per frame + manifest — handy after slicing a sheet).
Ping-pong/random are baked as one representative pass.

Press the **Preview Key (F8)** on the map during playtest to browse every
animation on a live 2× sprite with its properties panel.

---

## 4. Script API (events + external plugins)

```javascript
// Start (character = $gamePlayer, $gameMap.event(n), event-id number, "player")
$gameFrameMaster.play($gameMap.event(3), "slime_idle");
$gameFrameMaster.play($gamePlayer, "hero_run", { speed: 1.5, blend: 200 });
$gameFrameMaster.play($gamePlayer, "cutscene_once", {
  loop: false,
  onComplete: () => $gameSwitches.setValue(10, true)
});

$gameFrameMaster.stop($gameMap.event(3));
$gameFrameMaster.transitionTo($gamePlayer, "hero_idle", 300);

$gameFrameMaster.getCurrentFrame($gamePlayer);      // 0-based index, -1 = none
$gameFrameMaster.isPlaying($gamePlayer);            // true/false
$gameFrameMaster.getCurrentAnimation($gamePlayer);  // "hero_run" or null
$gameFrameMaster.listAnimations();                  // [{id,name,frames,loop}]
```

Inside an event's **Script** box, `this._eventId` is the current event, so
`$gameFrameMaster.play($gameMap.event(this._eventId), "slime_idle")` targets
*this event*.

---

## 5. Godot mapping cheat-sheet

| Godot (`AnimatedSprite2D`) | FrameMaster MZ |
|---|---|
| `SpriteFrames` resource | `data/framemaster/<id>.json` + registry |
| Animation (name, loop, speed) | Properties panel: name, loop, loop-from, base speed |
| Frame + duration | Timeline thumbnails + per-frame duration (frames/ms) |
| `animation_finished` signal | `onComplete` callback (non-looping anims) |
| `offset` | Anchor preset (bottom-center = map chars) |
| `play("name")` | `Play` command / `$gameFrameMaster.play(...)` |

---

## 6. Frame durations

Stored in **game frames** (60 = 1 second at 60 fps). The editor shows both:

```
ms = frames × 1000 / 60        frames = round(ms × 60 / 1000)
```

Speed multipliers (`speed` option, base speed) scale playback without
touching the authored durations.

---

## 7. Compatibility & limits (v1)

- MZ **1.8+**. Place FrameMaster **below** other character-visual plugins.
- Targets: **Player + map Events** (followers/vehicles supported by the API).
  Pictures and battlers are untouched — coming in v2.
- Frame events: **SE / Common Event / Switch** (script calls arrive in v2;
  the schema already ignores unknown types safely).
- Saves store animation + frame per character on `$gameSystem`; mid-animation
  saves restore cleanly. Deleted animation files degrade to the native sprite
  with a console warning — never a crash.
- Encrypted deploys: exclude `img/framemaster/` from encryption, or keep
  preloading ON.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `net::ERR_FILE_NOT_FOUND` + `no registry at "data/framemaster/FM_Animations.json"` | **Normal on first run before setup** — the ERR line is Chromium logging the missing file; the plugin then starts with 0 animations. Fix: create `data/framemaster/` + `img/framemaster/` in your **project** folder, copy the demo JSONs (or build with the editor), restart playtest. |
| `Could not load animation file "data/framemaster/xxx.json"` | Registry lists it but the file is missing/misspelled (check exact upper/lower case) or not valid JSON. |
| `Preload: 0 animations registered` (debug only) | Follows from the above — no animations loaded, so nothing to preload. |
| Preview scene (F8) shows 0 animations | Read the **Diagnosis panel on the right** — it names the exact missing/broken file. No console needed. |
| Sprite stuck / invisible | PNG missing in `img/framemaster/` (check name case); turn Debug Log ON and read F12 console. |
| First play hitches | Enable Preload On Map Load. |
| Two plugins fight over sprites | Move FrameMaster to the bottom of the plugin list. |
| Editor won't auto-save | Use Chrome/Edge + “Open project folder…”, or Export JSON manually. |
