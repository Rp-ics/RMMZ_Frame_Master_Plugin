# FrameMaster MZ — Manual (v2.3.0)

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
   **Aseprite**: export JSON (Array or Hash) + PNG sheet, then *Import JSON*
   — the forge creates the animation(s) automatically (one per `frameTag`).
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
directional fields — 4 cardinals (`IdleDown`…`WalkRight`) plus 4 diagonals
(`WalkDownLeft` … `WalkUpRight`, stateless vector, works with Altimit and
pixel movers without any extra marker) — and anything left empty falls back
to Idle/Walk; no animation at all shows the original charset sprite.

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

## 3c2. Layers — visual equipment (no code)

One base animation + stacked layers sharing its frame. Two kinds:

- **Suffix** (equipment that follows): `{ slot: "weapon", suffix: "_iron" }`
  draws `hero_walk_iron` under base `hero_walk`, `hero_idle_iron` under
  `hero_idle` — automatic across auto-pilot, blends and battle states.
  A missing variant hides that slot for that base, no error.
- **Fixed** (overlays): `{ slot: "halo", anim: "halo_loop" }`, any animation.

Tag database weapons/armors with `<fm-layer:weapon:_iron>` (slot + suffix)
and equipping rebuilds the slot by itself; unequipping clears it. Manual
`LayerSet` entries survive equip changes. Player reads the party leader,
followers read their actor, battlers read the same actor in battle
(actor = `_mainSprite`, enemy = self) — so a sword iron stays on the
slash animation too. Per-layer `dx`/`dy` nudge pixels; max 8 layers;
layers save with the game. Check alignment in the forge preview (Layers
row under the preview bar).

## 3c3. One-shots — independent actions (no profile needed)

Any character, battler or picture can play a **one-shot** (`PlayOnce`,
`PlayBattlerOnce`, `PlayPictureOnce`) — loop forced off. Characters with
an auto-pilot resume it afterwards; others return to the native sprite.
Perfect for emotes, chest openings or hit flashes on characters that have
no permanent animations, or for .webp frames (same as PNG, just name
`name.webp` — 60-80% smaller).

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

## 7. Compatibility & limits (v2.3.0 — everything free)

- **MZ 1.8+**. Place FrameMaster **below** other character-visual plugins
  (VisuStella Events & Movement Core, etc.).
- **Characters**: Player + Events + Followers + Vehicles — with **8-dir**
  auto-pilot (cardinal + diagonal via real-vs-logical vector, works with any
  pixel mover: Altimit Movement, Rosedale Collision, Half Move).
- **Battlers & Pictures**: fully supported (side/front view, map pictures)
  with Battle Director, hit-flash and collapse intact.
- **Layers**: map characters + battlers (actor `_mainSprite` / enemy self),
  suffix/fixed, 8 max, lockstep; auto-equip via `<fm-layer:slot:suffix>`.
- **Images**: `.png` and `.webp` (60-80% smaller) — same API, LRU cache
  (220 bitmaps) prevents OOM with hundreds of frames; proximity preload on
  map start when enabled.
- **Frame events**: SE / Common Event / Switch / **Script** (`owner`, `fm`).
- **One-shots**: `PlayOnce` family for independent actions (auto-resumes).
- **Saves**: animation + layers + auto-pilot ride on `$gameSystem`;
  mid-animation / mid-battle saves restore cleanly. Missing files degrade to
  native sprite with a warning — never a crash.
- **Encrypted deploys**: exclude `img/framemaster/` or keep preloading ON.
- **MZ3D**: no explicit 3D-safe mode yet — anchor offsets are 2D only;
  reported compatible, but test your 3D scene. Use `anchor 0.5,1` for ground.

| Plugin / Feature | Status |
|---|---|
| VisuStella Events & Movement Core (8-dir, dash) | ✅ Auto-pilot reads `isMoving`/`direction`/`isDashing` — no patch needed |
| Altimit Movement / Rosedale / Half Move (pixel) | ✅ Vector `realX/Y - x/y` catches sub-tile drift |
| MZ3D (3D) | ⚠️ No 3D anchor; 2D layers/battlers work, 3D characters need test |
| Yami 8Dir Ex / other 8-dir movers | ✅ Direction codes 1/3/7/9 mapped, vector fallback |
| Aseprite sheet+JSON | ✅ Import in forge (Array/Hash, frameTags → anims) |

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
