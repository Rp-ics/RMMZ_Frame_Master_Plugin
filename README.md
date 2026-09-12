# FrameMaster MZ

Godot-style **frame-by-frame character animation** for RPG Maker MZ —
unlimited frames, visual editors, automatic states, one-click exports.

- 🎞️ **Live Animation Forge (no install): https://rpxgames.win/tools/framemaster/**
- 📦 Repository: https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin
- 📖 Full manual: `doc/FrameMaster_HELP.md` · Guida completa (ITA): `GUIDE.md` · Compatibility: `doc/COMPATIBILITY.md`

## Editions

One edition: **everything free** (since v2.0.0 the ex-PRO battlers,
pictures, script events and battle director are all included).

## Features (v2.3.0)

- **Unlimited frames** per animation (no more 3-frame limit), single PNGs
  or sprite-sheet slicing with grid preview
- **Layers / visual equipment**: suffix layers follow the base animation
  (`hero_walk` + `_iron`), fixed overlays for anything else, DB note-tag
  auto-equip (`<fm-layer:weapon:_iron>`), offsets, **battler layers in
  battle**, lockstep timing
- **8-direction auto-pilot**: vettore diagonale in pixel movement (Altimit,
- **Auto-pilot**: idle when stopped, walk when moving, dash when dashing,
  plus 4-dir/8-dir variants (diagonal vector for pixel movers) — set once via Plugin Command, runs forever
- **Frame events**: SE, Common Event, Switch fired automatically per frame
- **Crossfade blends** between animations
- **Visual editors**: standalone local tool + online Animation Forge
  (drag-and-drop timeline, live preview, batch editing, auto-save)
- **Exports**: MZ project pack (.zip), animated **GIF**, single-PNG
  **sprite sheet** + frame map, frames ZIP — use animations anywhere
- **F8 in-game preview scene** with self-diagnosis panel (no console needed)
- **Save-game compatible**, MZ 1.8+, English throughout

## Layout

```text
FrameMaster/
├── FrameMaster.js                  # the plugin (js/plugins/)
├── tools/
│   ├── framemaster_editor.html     # local visual editor (Chrome/Edge)
│   └── make_demo_art.js            # regenerates demo PNGs (node)
├── demo/
│   ├── data/framemaster/*.json     # slime_idle, hero_run, slime_bounce
│   └── img/framemaster/*.png       # runnable placeholder art
└── doc/
    └── FrameMaster_HELP.md         # full manual
```

## Install (3 minutes)

1. Copy `FrameMaster.js` into your project's `js/plugins/` and enable it.
2. Unzip a forge pack (or the `demo/` folders) into your **project root**
   so `data/framemaster/` and `img/framemaster/` merge in.
3. Playtest → **F8** → preview. Use Plugin Commands
   (`Play` / `AutoPlay` / `Stop` / `AutoStop`), no code needed.

The online forge: **https://rpxgames.win/tools/framemaster/** (same editor,
runs in any browser, adds GIF / sprite-sheet / frames-ZIP export).

## Compatibility

See `doc/COMPATIBILITY.md` — matrix for VisuStella / Altimit / Rosedale / MZ3D / Aseprite + API `registerLayerProvider`.

## License

Free for commercial and non-commercial games, credit required
("FrameMaster MZ by Rpx & Just Dev"). No redistribution/resale of the plugin file.
Full terms in `LICENSE`.
