# FrameMaster MZ — Compatibility Matrix (v2.3.0)

Tested on RPG Maker MZ 1.8+ (NW.js, Chrome/Edge, `file://` playtest and deployed `https://`). FrameMaster is a pure visual layer: it replaces bitmap/frame, never touches collision, input or save structure.

## Summary

| Plugin / Feature | Status | Notes |
|---|---|---|
| **VisuStella Events & Movement Core** (8-dir, dash) | ✅ | Auto-pilot reads `isMoving()` / `direction()` / `isDashing()` — no patch. Direction codes `1/3/7/9` + vector fallback. Place FrameMaster **below** VisuStella. |
| **Altimit Movement** (pixel, collision) | ✅ | Stateless vector `realX/Y - x/y` catches sub-tile drift, no `initEquips` hook conflict. Layers follow base frame lockstep. |
| **Rosedale Collision / Half Move** | ✅ | Same vector path as Altimit. No grid snap required. |
| **Yami 8Dir Ex / other 8-dir movers** | ✅ | 4 diagonal walk slots `walkDownLeft` … `walkUpRight`; vector wins over direction code. |
| **MZ3D (3D)** | ⚠️ | 2D layers/battlers/pictures work. Anchor `0.5,1` is ground-projected; 3D characters need manual test. No 3D-safe anchor mode yet — use `anchor 0.5,1` for ground. Reported compatible, not certified. |
| **Aseprite (tool)** | ✅ | Forge imports JSON Array/Hash + `frameTags` → anims, `duration` ms → `*60/1000` frames, `meta.image` as sheet name (fallback to JSON basename). |
| **VisuStella Battle Core / other battle plugins** | ⚠️ | Battle Director hooks `performActionStart`/`performDamage`/etc. on `Game_Battler` base — chains via alias. Place FrameMaster **below** Battle Core. Hit-flash/collapse intact. |
| **Other character-visual plugins** | ⚠️ | All alias-chained (`Sprite_Character.updateBitmap` / `updateFrame`). Place FrameMaster at bottom of visual stack. `DebugLog` warns if `characterPattern` looks hijacked. |

## Details

### Movement

- **Cardinal**: `direction()` 2/4/6/8 → `Down/Left/Right/Up`.
- **Diagonal**: `realX/Y - x/y` sign vector → `DownLeft` etc.; falls back to direction code when not moving. Works with any pixel mover without `Game_Character` patch. Threshold is zero — any drift counts.

### Layers

- Map characters + battlers (actor `_mainSprite` / enemy `self`). Max 8, lockstep `st.frameIndex % len`, `bitmapFor` LRU 220. Other plugins inject via `FrameMaster.registerLayerProvider(id, ch => layer|layers|null)` — sanitized, dedup (manual/equip wins), called every frame (keep cheap). Example in `HELP.md` LAYERS.

### Images

- `.png` and `.webp` — `.webp` uses `ImageManager.loadBitmapFromUrl` (60-80% smaller). Forge accepts/drops both, pack includes either.

### Saves / Deployment

- Animation + layers + auto-pilot on `$gameSystem` (`fmStates` + `auto` + `layers`), mid-animation/battle saves restore. Missing files degrade to native sprite with `F12` warning. Encrypted deploys: exclude `img/framemaster/` or keep `PreloadOnMapLoad` ON. Proximity preload (26 tiles, large-map cull) warms nearby `state`/`auto`/`layers`/`battle set` images via LRU.

### API for Compatibility

```js
// Early (plugin load) or late (event) — both work:
FrameMaster.registerLayerProvider("myAura", ch => {
  if (ch === $gamePlayer && $gameSwitches.value(10))
    return { slot:"aura", anim:"aura_loop", dx:0, dy:-8 };
  return null;
});
FrameMaster.unregisterLayerProvider("myAura");
```

If you hit a conflict, open an issue with the other plugin's name/version and a minimal repro — pattern above has fixed VisuStella-style conflicts in hours.

## Test Matrix (manual, playtest)

- [x] 4-dir walk + dash (VisuStella-style mover stub)
- [x] 8-dir vector + direction-code fallback
- [x] Pixel drift (Altimit stub `realX=0.9`)
- [x] Battler hit → phase swap → die → victory chain
- [x] Picture `Show Picture` + FM → `Erase Picture` cleanup
- [x] Layer suffix `hero_walk` + `_iron` → `hero_walk_iron` across auto + battle + blend
- [x] `.webp` frame load + LRU eviction at 220
- [x] Proximity preload on large map (26 tile radius)
- [x] Layer provider → manual wins, sanitize, queue pre-boot
