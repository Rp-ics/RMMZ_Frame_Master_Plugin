# FrameMaster MZ — Complete Guide (Setup, Settings & Commands)

> **Language:** English · **Version:** v2.3.0 · **Authors:** Rpx & Just Dev  
> **Online Forge:** https://rpxgames.win/tools/framemaster/ · **Repo:** https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin

This is the step-by-step guide to install, configure and use FrameMaster without writing code (unless you want to). Every command is explained with what it does, when to use it and a practical example.

---

## Table of Contents

1. [What FrameMaster Does](#1-what-framemaster-does)
2. [Requirements](#2-requirements)
3. [Installation in 3 Minutes](#3-installation-in-3-minutes)
4. [Folder Structure](#4-folder-structure)
5. [Create Your First Animation (Web Forge)](#5-create-your-first-animation-web-forge)
6. [Local Editor (Offline Alternative)](#6-local-editor-offline-alternative)
7. [Import from Aseprite](#7-import-from-aseprite)
8. [In-Game Preview (F8 Key)](#8-in-game-preview-f8-key)
9. [Plugin Settings (Parameters)](#9-plugin-settings-parameters)
10. [Plugin Commands — Overview](#10-plugin-commands--overview)
11. [Character Commands (Map) — Details](#11-character-commands-map--details)
12. [Auto-Pilot (Godot-style)](#12-auto-pilot-godot-style)
13. [Layers — Visual Equipment](#13-layers--visual-equipment)
14. [Battlers and Pictures](#14-battlers-and-pictures)
15. [Battle Director (Battle States)](#15-battle-director-battle-states)
16. [Independent Actions — PlayOnce](#16-independent-actions--playonce)
17. [Script API (For Coders)](#17-script-api-for-coders)
18. [Image Formats, Weight and Preload](#18-image-formats-weight-and-preload)
19. [API for Other Plugins (Compatibility)](#19-api-for-other-plugins-compatibility)
20. [Troubleshooting](#20-troubleshooting)

---

## 1. What FrameMaster Does

- Breaks the **3-frame** limit of RPG Maker MZ charsets: you can have **unlimited frames** per animation.
- Works on **Player, Events, Followers, Battlers (Actors/Enemies), Pictures**.
- Each animation is a JSON file in `data/framemaster/` + PNG/WebP in `img/framemaster/`.
- You get a **visual editor** (drag & drop, timeline, live preview) both online and local.
- Supports **normal, ping-pong (forward-backward) and random loops**, **crossfade (blend)**, **frame events** (SE, common event, switch, script), **equipment layers** and **Battle Director** (idle, attacks, hit, death... automatic).

> **Key concept:** FrameMaster does not guess when to animate. You create animations in the Forge, then tell the game *when* to play them (with an Event). **Auto-Pilot** and **Battle Director** will then trigger them automatically once configured.

---

## 2. Requirements

- **RPG Maker MZ 1.8+** (tested on NW.js and web deploy).
- Place FrameMaster **below** other visual plugins (e.g., VisuStella Events & Movement Core) in the Plugin Manager list.
- For the local editor you need **Chrome/Edge** if you want direct auto-save into the project folder. The online Forge works on any browser.

---

## 3. Installation in 3 Minutes

### Step 1 — Copy the plugin
1. Get `FrameMaster.js` (provided by the author / release) and copy it to `<YourProject>/js/plugins/`.
2. Open the MZ editor → **Plugin Manager (F10)** → right-click → **Add** → choose **FrameMaster** → **ON**.
3. Set the 4 parameters (see chapter 9). For starters leave everything at default.

### Step 2 — Create folders
Create these two folders manually (or let the Forge do it) in the **project root** (where `game.rmmzproject` is):
```
<YourProject>/
├── data/framemaster/
└── img/framemaster/
```

### Step 3 — Add demo or your own content
- **Option A (recommended):** Go to https://rpxgames.win/tools/framemaster/ → **Load demo** → **Download pack (.zip)** → unzip into the **project root** (merge `data/` and `img/`). You instantly get 3 working animations.
- **Option B:** Copy `demo/data/framemaster/*.json` and `demo/img/framemaster/*.png` from the repo into the same folders.

### Step 4 — Test
Start **Playtest (▶)** → on the map press **F8** → you should see the animation list. If you see **0 animations**, read the diagnosis panel on the right (see chapter 8) or chapter 20.

> **Important note:** If you unzipped the pack inside a subfolder like `Coop/framemaster_pack/data/...` you used the wrong level: move `data/framemaster` and `img/framemaster` directly into the root.

---

## 4. Folder Structure

```
<YourProject>/
├── data/framemaster/
│   ├── FM_Animations.json      # registry: [{id, name, file}]
│   ├── FM_BattleSets.json      # battle sets registry (if you use the Director)
│   ├── slime_idle.json         # one animation
│   └── bset_slime.json         # one battle set
└── img/framemaster/
    ├── slime_0.png / .webp
    ├── hero_run_sheet.png
    └── ...
```

- **Do not edit** `FM_Animations.json` and `FM_BattleSets.json` by hand: the Forge writes them.
- PNG/WebP can be single frames or full sprite sheets.

---

## 5. Create Your First Animation (Web Forge)

Open **https://rpxgames.win/tools/framemaster/**

### 5.1 Upload PNG/WebP
- Drag your PNG/WebP **anywhere on the page**, or use **Choose file**.
- Frames can have **different sizes** (e.g., 64×64 and 64×128 for a sword swing) — the Atlas packer handles it. Keep transparent background, feet at bottom center, anchor `0.5,1`.
- Ordered names help: `walk_0.png … walk_5.png`.

### 5.2 Create animation
1. Click **+ New** → rename on the right **ID (slug)** e.g. `player_walk` (only `lowercase_numbers_underscore`) and **Name** `Walk`.
2. Click **Add all PNGs as frames** (sorted by name) or click thumbnails to add one by one.
3. **Sprite sheet?** If you have a single PNG with a grid: pick the sheet on the left, set **Frame width/height**, press **Grid** to see the grid, then **Slice → append**.

### 5.3 Timeline and Preview
- **Timeline** below: drag to reorder, click / Ctrl+click / Shift+click to select, batch to change duration or delete.
- **Preview** in the center: **Space** play/pause, **←/→** single frame, **Speed** and **grounding** (fake shadow).
- **Properties** on the right: **Loop** ON/OFF, **Loop from**, **Loop mode** (Normal / Ping-pong 1,2,3,2,1 / Random), **Base speed**, **Anchor**.
- **Selected frame:** change **Duration** in frames (60 = 1 sec) or ms, replace image, add **Frame events** (+ SE / + Event / + Switch / + Script).

### 5.4 Saving — Source vs Build (Atlas)
You always **edit single frames** (modular). On save/export the tool can **auto-pack** them into one atlas texture per animation for performance.

- **Atlas toggle** (toolbar, checked by default): **ON** = build `atlas_<id>.png` (one texture, 1 XHR/GPU bind, 60-80% with `.webp`), **OFF** = keep 60 single PNGs (editable, slower).
- **If you linked the project folder** (button **Project folder**, Chromium only): auto-save writes either atlas + JSON with `rect`+`offset` (ON) or single PNGs + JSON (OFF) on every change (`Saved ✓ [Atlas]`).
- **Otherwise:** press **Download pack (.zip)** → same choice → unzip into the project root. The pack always contains the correct `data/framemaster/*.json` + `img/framemaster/` (atlas or singles).

> Keep single PNGs for editing, ship atlas for play — best of both worlds. No grid constraint.

### 5.5 Layer Strip (visual test)
Below the preview you will find **Layers:** 3 fields. Write an **animation ID** or a **suffix** like `_iron`. Example base `hero_walk` + `_iron` → preview `hero_walk_iron` overlaid on the same frameIndex. This is only to check alignment (real layers live in game state, not in the animation file).

---

## 6. Local Editor (Offline Alternative)

Open `tools/framemaster_editor.html` (double-click) in Chrome/Edge.

- **Open project folder…** → choose the project root → auto-save like the Forge.
- On Firefox/Safari: use the file pickers and then **Export JSON** → manually copy to `data/framemaster/` and add a line in `FM_Animations.json`.

Same features as the Forge, without Battle Sets tab / GIF export (online only).

---

## 7. Import from Aseprite

1. In Aseprite: **File → Export Sprite Sheet** → JSON **Array** (or Hash) + PNG.
2. In Forge: **Import JSON** → select the Aseprite JSON.
3. The Forge creates **one animation per `frameTag`** (if present) or a single one otherwise. `duration` in ms is converted to frames (`*60/1000`), `frame.x/y/w/h` becomes `rect`, `meta.image` becomes `source`.

> If the sheet name in `meta.image` does not match the uploaded PNG, rename the PNG or upload the correct one.

---

## 8. In-Game Preview (F8 Key)

In **Playtest**, on the map press **F8** (configurable in parameters):

- List on the left: all animations, select with arrows.
- Center: 2× preview with checkerboard background.
- Right: current frame properties + **Diagnosis** panel if the list is empty.
- Controls: **Up/Down** change animation, **OK (Z/Space/Enter)** play/pause, **PageUp/PageDown** speed, **Esc / Right Click** exit.

**If you see 0 animations:** read the panel on the right: it tells you the exact missing file (`data/framemaster/FM_Animations.json` or `xxx.json` with type `missing/invalid-json/bad data`), the images folder `img/framemaster/` and the `From:` path where the game was launched from (to spot the wrong folder).

---

## 9. Plugin Settings (Parameters)

In **Plugin Manager** clicking on FrameMaster:

| Parameter | Default | What it does |
|---|---|---|
| **Default Blend (ms)** | 120 | Crossfade when switching from one FM animation to another. 0 = hard cut. Used if the command leaves Blend at `-1`. |
| **Preload On Map Load** | true | Preloads images of animations **near the player** (26 tile radius on large maps) on map entry. Prevents hitch on first play. On small maps with ≤24 animations it preloads all. LRU cache 220 bitmaps. |
| **Debug Log** | false | Prints useful info to console (F12) (loaded anims, warnings). Turn on while setting up, off for release. |
| **Preview Key** | F8 | Key that opens the F8 scene in playtest. `none` disables it. |

---

## 10. Plugin Commands — Overview

All under **Event → Plugin Command → FrameMaster** (and `FrameMasterPRO` for compatibility, now alias).

| Command | What it does | When to use it |
|---|---|---|
| **Play** | Plays an animation on Player/Event | Cutscene, interaction, possession |
| **Stop** | Stops and returns to original sprite | End of cutscene |
| **TransitionTo** | Changes animation with crossfade, keeping speed | Smooth state change |
| **OpenPreview** | Opens the F8 scene from an event | In-game debug |
| **AutoPlay / AutoStop** | Auto-pilot: automatic idle/walk | Explorable maps (see ch.12) |
| **PlayBattler / StopBattler** | Animates a battler in battle | Skills, hits |
| **PlayPicture / StopPicture** | Animates a Picture (Show Picture first) | Animated HUD, screen effects |
| **BattleSetup** | Assigns a Battle Set to battlers | Battle start (see ch.15) |
| **LayerSet / LayerClear** | Adds/removes visual layers | Equipment (see ch.13) |
| **PlayOnce / PlayBattlerOnce / PlayPictureOnce** | Single action that returns automatically | Emotes, chest opening, hit flash |

> **Target:** `Player` = player, `This Event` = the event running the command, `Event ID` = number. In Scripts use `$gamePlayer`, `$gameMap.event(n)` or `this._eventId`.

---

## 11. Character Commands (Map) — Details

### Play
- **Animation ID:** the exact slug (case sensitive) you see in F8, e.g. `slime_idle`.
- **Loop Override:** `File Default` = use file's loop, `Loop` / `Play Once` forces it.
- **Speed:** multiplier (2.0 = double).
- **Blend:** fade ms. `-1` = Default Blend. From native to FM is always hard cut.

*Example:* Event with Trigger **Action Button** → Plugin Command **Play** → Target `This Event` → Animation `slime_idle` → press Z in front of the sprite.

### Stop
Restores the original charset. If there was an Auto-Pilot, **Stop resumes it**.

### TransitionTo
Like Play but keeps the previous speed. Useful for `idle → walk` without stutter.

---

## 12. Auto-Pilot (Godot-style)

**Idea:** you assign a mapping once, then the character animates itself: **standing = idle, moving = walk, dashing = dash**.

### Setup (3 clicks, no code)
1. Create an **Autorun Event** on the starting map.
2. Plugin Command → **AutoPlay** → fill:
   - **Target:** `Player`
   - **Idle:** `hero_idle`  · **Walk:** `hero_walk` (at least one of them)
   - **Dash:** `hero_run` (optional, if empty it uses Walk)
   - **IdleDown/Up/Left/Right** and **WalkDown/.../WalkRight** and **4 diagonals** `WalkDownLeft` etc. optional — empty = uses base Idle/Walk, always fallback to original sprite if missing.
   - **Blend:** `-1`
3. Below add **Erase Event** (Autorun runs once and disappears).

From then on: standing → idle, walking → walk, dashing → dash. Diagonals are detected via **vector** `realX/Y - x/y`, so they work with any pixel mover (Altimit, Rosedale, Half Move) without markers.

**Rules:**
- **Play** **pauses** the auto-pilot (for cutscenes) → **Stop** **resumes** it, **AutoStop** **turns it off**.
- **PlayOnce** (ch.16) does not pause it permanently: it returns automatically.
- The mapping is **saved** with the save file.

---

## 13. Layers — Visual Equipment

**Concept:** one base animation + **stack of layers** sharing the same `frameIndex` (lockstep). Two kinds:

- **Suffix** (following equip): `{slot:"weapon", suffix:"_iron"}` → base `hero_walk` draws `hero_walk_iron`, base `hero_idle` draws `hero_idle_iron`. Automatic across auto-pilot, blends and battle states. Missing variant = slot hidden there, no error.
- **Fixed** (overlay): `{slot:"halo", anim:"halo_loop"}` — any animation.

Max **8 layers**, `dx/dy` for pixel nudge, lockstep on base timing.

### A. Automatic from Database (recommended)
Tag weapons/armors in **Database → Note**:
```
<fm-layer:weapon:_iron>
<fm-layer:cape:_red>
```
Equip → layer appears, unequip → disappears. Manual `LayerSet` entries survive equip changes. Player = party leader, Follower = its actor, Battler = same actor in battle (`actor _mainSprite` / `enemy self`) — sword stays on the slash too.

### B. Manual via commands
- **LayerSet:** `Target` + `Slot` (e.g. `weapon`) + `Kind` = `Suffix` or `Fixed` + `Value` (`_iron` or `halo_loop`) + `dx/dy`.
- **LayerClear:** `Slot` filled = clears one slot, empty = clears all.

### C. API (for Script events or other plugins)
```js
$gameFrameMaster.setLayers($gamePlayer, [{slot:"weapon", suffix:"_iron"}]);
$gameFrameMaster.clearLayers($gamePlayer, "weapon"); // or without slot = all
$gameFrameMaster.getLayers($gamePlayer); // [{slot,suffix,anim,dx,dy}]
```
Other plugins can inject layers without touching saves:
```js
FrameMaster.registerLayerProvider("myAura", ch => {
  if (ch === $gamePlayer && $gameSwitches.value(10))
    return {slot:"aura", anim:"aura_loop", dx:0, dy:-8};
  return null;
});
FrameMaster.unregisterLayerProvider("myAura");
```
Providers are sanitized, deduped (manual/equip wins) and called every frame (keep them cheap). Supports pre-boot queue.

**Preview:** in the Forge, below the preview, the **Layers:** row lets you test up to 3 layers (ID or `_suffix`) in real time — visual test only, real state is in-game.

---

## 14. Battlers and Pictures

### Battlers (Actors/Enemies, front and side-view)
- **PlayBattler / StopBattler:** `Side: Actor/Enemy` + `ID` (Actor = database ID, Enemy = **0-based** troop order: first enemy = 0) + `Animation` + `Loop/Speed/Blend`.
- Hit-flash, damage popups, states and collapse stay on top of FM frames. Actor's weapon hides while FM drives it and returns on next weapon motion.
- API: `playBattler(battler, animId, opts)` where battler is instance (`$gameActors.actor(1)`, `$gameTroop.members()[0]`) or string `"actor:1"` / `"enemy:0"`. Also `transitionBattler`, `getBattlerFrame` / `isBattlerPlaying` / `getBattlerAnimation`.

### Pictures
- **PlayPicture / StopPicture:** `Picture ID 1–100` (you must have done **Show Picture** first) + animation. Position/scale/rotation/opacity/tone stay native, only content changes.
- API: `playPicture(idOrPicture, animId, opts)` / `transitionPicture` / etc.

> **Blend:** FM → FM crossfades, native → FM is hard cut (LITE-wide rule).

---

## 15. Battle Director (Battle States)

Build a **Battle Set** in the Forge (**Battle Sets tab**): map battle moments → animation IDs — `idle`, `appear`, `attack1/2/3`, `skill`, `item`, `defend`, `hit`, `evade`, `die`, `victory` + **HP phases** that swap the whole set (boss forms).

| Moment | When it triggers | Behavior |
|---|---|---|
| `appear` | Battle start (if assigned) | Once, then idle |
| `idle` | Standing / after every one-shot | Loop |
| `attack1-3` | Battler acts (Attack) | Once, then idle. Pick: cycle 1→2→3, random, first |
| `skill` / `item` | Skill / Item | Once, then idle |
| `defend` | Guard | Loop as stance until replaced |
| `hit` | Takes damage (and survives) | Once, then idle |
| `evade` | Dodges (physical/magical) | Once, then idle |
| `die` | Collapses | Once over fade, then released |
| `victory` | Party wins (actor) | Loop until battle ends |

Empty = native behavior for that moment (SV motions, collapse...).

### Assignment (once)
- **Troop Event, Span: Battle** → `FrameMaster → BattleSetup` → `All Enemies → slime_battle`
- **Actor:** same command on starting map (Autorun) → persists across battles. Empty `Set` = **clear**.

### API
```js
$gameFrameMaster.assignBattleSet(battler, "slime_battle");
$gameFrameMaster.clearBattleSet(battler);
$gameFrameMaster.getBattlerSet(battler);
$gameFrameMaster.playBattlerState(battler, "hit"); // any moment of the set
```

Demo: `slime_battle` uses `slime_idle`/`attack`/`hit`/`die`.

---

## 16. Independent Actions — PlayOnce

**Disposable** animations that do not dirty the permanent state:

- **PlayOnce** on character, **PlayBattlerOnce**, **PlayPictureOnce**: play **once** (`loop` forced off) and then return automatically — if there is Auto-Pilot it returns to idle/walk, otherwise to native charset/image. `onComplete` callback chainable.

*Example:* Chest event → `PlayOnce` → `chest_open` on This Event → should stay open until explicit `Stop`? No: with PlayOnce it returns automatically after opening (to stay open use normal `Play` with `Loop: false`).

Commands only have `Speed` and `Blend` (loop is implicit). API:
```js
$gameFrameMaster.playOnce($gamePlayer, "emote_wave", {speed:1.2});
$gameFrameMaster.playBattlerOnce($gameActors.actor(1), "skill_fire");
```

---

## 17. Script API (For Coders)

```js
// Map characters
$gameFrameMaster.play($gameMap.event(3), "slime_idle");
$gameFrameMaster.play($gamePlayer, "hero_run", {speed:1.5, blend:200, loop:false, onComplete:()=> $gameSwitches.setValue(10,true)});
$gameFrameMaster.stop($gameMap.event(3));
$gameFrameMaster.transitionTo($gamePlayer, "hero_idle", 300);
$gameFrameMaster.getCurrentFrame($gamePlayer);     // 0-based, -1 = none
$gameFrameMaster.isPlaying($gamePlayer);
$gameFrameMaster.getCurrentAnimation($gamePlayer); // "hero_run" or null
$gameFrameMaster.listAnimations();                 // [{id,name,frames,loop}]
$gameFrameMaster.isReady();
$gameFrameMaster.setAuto($gamePlayer, {idle:"hero_idle", walk:"hero_walk", walkDownLeft:"hero_dl"});
$gameFrameMaster.clearAuto($gamePlayer);
$gameFrameMaster.getAuto($gamePlayer);
$gameFrameMaster.desiredAutoAnim($gamePlayer);

// Battler / Picture
$gameFrameMaster.playBattler("enemy:0", "slime_hit", {blend:80});
$gameFrameMaster.stopBattler($gameActors.actor(1));
$gameFrameMaster.playPicture(3, "fire_loop");

// Layer
$gameFrameMaster.setLayers($gamePlayer, [{slot:"weapon", suffix:"_iron", dx:0, dy:0}]);

// Compat
FrameMaster.registerLayerProvider("myId", ch => ({slot:"aura", anim:"aura_loop"}));
```

Inside an **Event Script**, `this._eventId` is the current event, so `$gameMap.event(this._eventId)` points to *this event*.

---

## 18. Image Formats, Weight and Preload

- **Formats:** `.png` and **`.webp`** (60-80% smaller for same quality). Just use `name.webp` in frames — the Forge accepts/drops both, the pack includes them, runtime uses `loadBitmapFromUrl` for `.webp`.
- **LRU Cache 220 bitmaps:** prevents OOM with hundreds of frames; least recent are discarded.
- **Proximity Preload:** on map entry (if `PreloadOnMapLoad` ON) it preloads only images **near the player** (26 tile radius on large maps, all on small maps) for `state`/`auto`/`layers`/`battle set`. On huge maps it does not preload everything.
- **Encrypted deploy:** exclude `img/framemaster/` from encryption, or keep preload ON.

---

## 19. API for Other Plugins (Compatibility)

FrameMaster is **alias-chained** (never overwritten) on `Sprite_Character`, `Sprite_Actor/Enemy/Picture`, `Game_Battler`. Place it **below** other visual plugins.

Full matrix: see `doc/COMPATIBILITY.md`.

Main public hook: `FrameMaster.registerLayerProvider` (see ch.13). Other hooks (auto, battle) are internal but stable: ask if you need a custom provider.

---

## 20. Troubleshooting

| Symptom | Cause → Solution |
|---|---|
| `0 animations` + `Registry: MISSING` in F8 | Wrong folder. Unzip the pack **into the project root** (e.g. `Coop/data/framemaster/` not `Coop/framemaster_pack/data/...`). |
| `Could not load animation file "data/framemaster/xxx.json"` | File name with different case or broken JSON. Re-export from Forge. |
| `f1.png.png` in console | Old `.png.png` bug — update `FrameMaster.js` to v2.3.0+. |
| F8 did not close | Fixed in v1.2.1 → `activate()` of the list. Update. |
| `From: chrome-extension://...` in diagnosis | You are launching the game from an extension, not from the editor's Playtest. Use the editor's **Play**. |
| F8 stays on `loading…` | Recreation bug after New Game — fixed since v1.2.1 (carry-over registry). Update. |
| Weapon does not follow in battle | Normal: weapon hides during FM actor and returns on next weapon motion. For weapon layer in battle use **Layers** (suffix), it does not depend on weapon sprite. |
| Auto-pilot does not change diagonally | Set `WalkDownLeft` etc. and use a mover that sets `direction` 1/3/7/9 or `realX/Y` (Altimit). Otherwise it uses base `walk`. |
| `.webp` not showing | Missing file in `img/framemaster/` or wrong extension. Check console with `Debug Log` ON. |

If you are stuck, open **F8** and read the **Diagnosis** panel on the right: it tells you the exact file (`missing/invalid-json/bad data`), the `img/framemaster/` folder and the `From:` path.

---

*End of guide. For updates: https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin — Forge: https://rpxgames.win/tools/framemaster/*
