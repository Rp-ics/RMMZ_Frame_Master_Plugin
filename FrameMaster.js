/*:
 * @target MZ
 * @title FrameMaster MZ
 * @plugindesc v1.2.0 Unlimited frame-by-frame character animations (Godot-style) with visual editor, auto-pilot states, loop modes, frame events and crossfade blends.
 * @author Rpx & Just Dev
 * @url https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin
 *
 * @help
 * ============================================================================
 * FrameMaster MZ v1.2.0 — Godot-style frame-by-frame animation for RMMZ
 * ============================================================================
 * Breaks the 3-frame character limit: play animations with UNLIMITED frames
 * on the player and map events. Single PNGs per frame and sprite-sheet
 * slicing (grid) are both supported.
 *
 * ----------------------------------------------------------------------------
 * QUICK START (no coding required)
 * ----------------------------------------------------------------------------
 * 1. Put frame PNGs in  img/framemaster/  (or one sprite sheet PNG).
 * 2. Open  tools/framemaster_editor.html  in Chrome/Edge, pick your project
 *    folder when asked, and build animations visually (drag-and-drop
 *    timeline, live preview, per-frame duration + events). Saving is automatic
 *    and writes  data/framemaster/*.json .
 *    (Online alternative, any browser: https://rpxgames.win/tools/framemaster/ )
 * 3. In-game, use the Plugin Commands (no scripting needed):
 *      FrameMaster > Play / Stop / TransitionTo / OpenPreview
 *      FrameMaster > AutoPlay / AutoStop  (Godot-style automatic states)
 *    Or press the preview key (default F8) during playtest to open the
 *    built-in preview scene and check every animation on a live sprite.
 * 4. Scripters can use the $gameFrameMaster API (see API section below).
 *
 * ----------------------------------------------------------------------------
 * FOLDERS & FILES
 * ----------------------------------------------------------------------------
 *  img/framemaster/                  frame PNGs and sprite sheets
 *  data/framemaster/                 one JSON file per animation
 *  data/framemaster/FM_Animations.json   registry [{ id, name, file }]
 *  tools/framemaster_editor.html     standalone visual editor (open manually;
 *                                    RMMZ plugins cannot add Tools-menu items)
 *
 * If FM_Animations.json is missing, the plugin simply starts with an empty
 * list and logs a hint (when DebugLog is ON). Nothing crashes.
 *
 * Deployed/encrypted games: either exclude img/framemaster/ from encryption
 * or keep PreloadOnMapLoad ON so files are decoded before first use.
 *
 * ----------------------------------------------------------------------------
 * PLUGIN COMMANDS
 * ----------------------------------------------------------------------------
 *  Play           Start an animation on Player / This Event / Event ID.
 *  Stop           Stop an animation and restore the normal charset sprite.
 *  TransitionTo   Switch animation with a crossfade blend.
 *  OpenPreview    Open the in-game preview scene (Scene_FrameMaster).
 *  AutoPlay       Godot-style auto-pilot: idle when stopped, walk when
 *                 moving, dash when dashing (plus per-direction variants).
 *                 Runs by itself until AutoStop; a manual Play pauses it
 *                 and Stop resumes it.
 *  AutoStop       Disable the auto-pilot, restore the normal sprite.
 *
 * ----------------------------------------------------------------------------
 * AUTO-PILOT (no coding required)
 * ----------------------------------------------------------------------------
 * Call AutoPlay ONCE (e.g. an Autorun event on the starting map, erased
 * afterwards) with at least an Idle and a Walk animation id:
 *   Player + Idle "hero_idle" + Walk "hero_walk"  -> done forever.
 * The character now animates itself: stopped = idle, moving = walk,
 * dashing = dash (falls back to walk when empty). Optional per-direction
 * overrides (IdleDown, WalkLeft, ...) win over the base id when set;
 * anything uncovered falls back to the ORIGINAL charset sprite.
 * The mapping is saved with the game. Manual Play pauses the auto-pilot;
 * Stop (or a new AutoPlay) resumes it; AutoStop turns it off.
 *
 * ----------------------------------------------------------------------------
 * SCRIPT API (for events > Script, and external plugins)
 * ----------------------------------------------------------------------------
 *  $gameFrameMaster.play(character, animationId, options);
 *    character: $gamePlayer, $gameMap.event(n), event id number (0 = player),
 *               or "player".  (In an event Script box, a handy shortcut is
 *               $gameMap.event(this._eventId).)
 *    options: { loop, speed, blend, onComplete }
 *      loop:       true/false to override the animation file, or omit for file default
 *      speed:      speed multiplier, e.g. 2.0 = double speed (default 1.0)
 *      blend:      crossfade in milliseconds (default = DefaultBlend param)
 *      onComplete: function(){} called once when a NON-looping animation ends
 *                  (script use only; never saved)
 *
 *  $gameFrameMaster.stop(character);
 *  $gameFrameMaster.transitionTo(character, newAnimationId, blendDuration);
 *  $gameFrameMaster.getCurrentFrame(character);      // index, or -1
 *  $gameFrameMaster.isPlaying(character);            // boolean
 *  $gameFrameMaster.getCurrentAnimation(character);  // id string or null
 *  $gameFrameMaster.listAnimations();                // [{id,name,frames,loop}]
 *  $gameFrameMaster.isReady();                       // registry loaded?
 *  $gameFrameMaster.setAuto(character, mapping);     // Godot-style auto-pilot
 *    mapping: { idle, walk, dash?,
 *               idleDown, idleUp, idleLeft, idleRight,
 *               walkDown, walkUp, walkLeft, walkRight, blend? }
 *    Example: setAuto($gamePlayer, { idle: "hero_idle", walk: "hero_walk" })
 *  $gameFrameMaster.clearAuto(character);            // auto-pilot off
 *  $gameFrameMaster.getAuto(character);              // mapping or null
 *  $gameFrameMaster.desiredAutoAnim(character);      // id the auto-pilot wants
 *
 * Frame durations are stored in GAME FRAMES (60 = 1 second). The visual
 * editor also shows milliseconds (ms = frames * 1000 / 60).
 *
 * ----------------------------------------------------------------------------
 * LOOP MODES (set per animation in the visual editor)
 * ----------------------------------------------------------------------------
 *  normal    0,1,2,…,n then restart from Loop From (default).
 *  pingpong  bounce forwards and backwards: 0,1,2,…,n-1,n-2,…,1,0,1,…
 *            (Loop From is ignored; needs Loop ON, else plays once straight).
 *  random    a different random frame on every step (never repeats twice;
 *            needs Loop ON, else plays once straight).
 *
 * ----------------------------------------------------------------------------
 * FRAME EVENTS (no coding required, set them in the visual editor)
 * ----------------------------------------------------------------------------
 * Each frame can carry events, fired automatically when the frame is shown:
 *   - Play SE:        { type:"se", se:{ name, volume, pitch, pan } }
 *   - Common Event:   { type:"commonEvent", id }
 *   - Set Switch:     { type:"switch", id, value }
 * Unknown event types are ignored (with a warning when DebugLog is ON) so
 * future editor versions stay compatible with this runtime.
 *
 * ----------------------------------------------------------------------------
 * LICENSE (LITE — free for commercial and non-commercial games)
 * ----------------------------------------------------------------------------
 *  Credit "FrameMaster MZ by Rpx & Just Dev". Do not redistribute, resell or claim
 *  the plugin as your own. Full terms in the LICENSE file. PRO features
 *  are licensed separately.
 *
 * ----------------------------------------------------------------------------
 * COMPATIBILITY
 * ----------------------------------------------------------------------------
 * - Requires RPG Maker MZ 1.8+. Place below other character-visual plugins.
 * - v1 targets map characters (Player + Events). Pictures/Battlers are
 *   intentionally untouched (v2 seam: FM.TargetResolver).
 * - Saves: the current animation + frame per character is stored on
 *   $gameSystem and restored on load (mid-animation saves work).
 *
 * ============================================================================
 * @param DefaultBlend
 * @text Default Blend (ms)
 * @desc Crossfade duration used when Play/TransitionTo omits blend. 0 = hard cut.
 * @default 120
 * @type number
 * @min 0
 * @max 2000
 *
 * @param PreloadOnMapLoad
 * @text Preload On Map Load
 * @desc Load all FrameMaster bitmaps when a map starts (avoids first-play hitch).
 * @default true
 * @type boolean
 *
 * @param DebugLog
 * @text Debug Log
 * @desc Print FrameMaster warnings and info to the console (F12 during playtest).
 * @default false
 * @type boolean
 *
 * @param PreviewKey
 * @text Preview Key
 * @desc Opens the in-game preview scene while on the map. "none" disables it.
 * @default F8
 * @type select
 * @option none
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @command Play
 * @text Play Animation
 * @desc Start a FrameMaster animation on a character.
 * @arg target
 *   @text Target
 *   @type select
 *   @option Player
 *   @value player
 *   @option This Event
 *   @value this
 *   @option Event ID
 *   @value event
 *   @default player
 * @arg eventId
 *   @text Event ID
 *   @type number
 *   @default 1
 *   @desc Used only when Target = Event ID.
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
 *   @desc Animation ID as shown in the preview scene (F8) or editor.
 * @arg loop
 *   @text Loop Override
 *   @type select
 *   @option File Default
 *   @value default
 *   @option Loop
 *   @value true
 *   @option Play Once
 *   @value false
 *   @default default
 * @arg speed
 *   @text Speed Multiplier
 *   @type number
 *   @default 1.0
 *   @min 0.1
 *   @max 8.0
 *   @decimals 2
 * @arg blend
 *   @text Blend (ms)
 *   @type number
 *   @default -1
 *   @desc Crossfade in ms. -1 = use Default Blend parameter.
 *
 * @command Stop
 * @text Stop Animation
 * @desc Stop the FrameMaster animation and restore the normal sprite.
 * @arg target
 *   @text Target
 *   @type select
 *   @option Player
 *   @value player
 *   @option This Event
 *   @value this
 *   @option Event ID
 *   @value event
 *   @default player
 * @arg eventId
 *   @text Event ID
 *   @type number
 *   @default 1
 *   @desc Used only when Target = Event ID.
 *
 * @command TransitionTo
 * @text Transition To Animation
 * @desc Switch to another animation with a crossfade blend.
 * @arg target
 *   @text Target
 *   @type select
 *   @option Player
 *   @value player
 *   @option This Event
 *   @value this
 *   @option Event ID
 *   @value event
 *   @default player
 * @arg eventId
 *   @text Event ID
 *   @type number
 *   @default 1
 *   @desc Used only when Target = Event ID.
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
 * @arg blend
 *   @text Blend (ms)
 *   @type number
 *   @default -1
 *   @desc Crossfade in ms. -1 = use Default Blend parameter.
 *
 * @command OpenPreview
 * @text Open Preview Scene
 * @desc Open the in-game FrameMaster preview/test scene.
 *
 * @command AutoPlay
 * @text Auto-Pilot On (Idle/Walk)
 * @desc Godot-style automatic states: stopped = Idle, moving = Walk, dashing = Dash. Directional fields are optional overrides.
 * @arg target
 *   @text Target
 *   @type select
 *   @option Player
 *   @value player
 *   @option This Event
 *   @value this
 *   @option Event ID
 *   @value event
 *   @default player
 * @arg eventId
 *   @text Event ID
 *   @type number
 *   @default 1
 *   @desc Used only when Target = Event ID.
 * @arg idle
 *   @text Idle Animation
 *   @type string
 *   @default hero_idle
 *   @desc Played while stopped (any direction, unless overridden below).
 * @arg walk
 *   @text Walk Animation
 *   @type string
 *   @default hero_walk
 *   @desc Played while moving (any direction, unless overridden below).
 * @arg dash
 *   @text Dash Animation
 *   @type string
 *   @default
 *   @desc Played while dashing. Empty = use Walk.
 * @arg idleDown
 *   @text Idle Down
 *   @type string
 *   @default
 *   @desc Optional: idle facing down. Empty = use Idle.
 * @arg idleUp
 *   @text Idle Up
 *   @type string
 *   @default
 *   @desc Optional: idle facing up. Empty = use Idle.
 * @arg idleLeft
 *   @text Idle Left
 *   @type string
 *   @default
 *   @desc Optional: idle facing left. Empty = use Idle.
 * @arg idleRight
 *   @text Idle Right
 *   @type string
 *   @default
 *   @desc Optional: idle facing right. Empty = use Idle.
 * @arg walkDown
 *   @text Walk Down
 *   @type string
 *   @default
 *   @desc Optional: walking down. Empty = use Walk.
 * @arg walkUp
 *   @text Walk Up
 *   @type string
 *   @default
 *   @desc Optional: walking up. Empty = use Walk.
 * @arg walkLeft
 *   @text Walk Left
 *   @type string
 *   @default
 *   @desc Optional: walking left. Empty = use Walk.
 * @arg walkRight
 *   @text Walk Right
 *   @type string
 *   @default
 *   @desc Optional: walking right. Empty = use Walk.
 * @arg blend
 *   @text Blend (ms)
 *   @type number
 *   @default -1
 *   @desc Crossfade between auto states. -1 = use Default Blend parameter.
 *
 * @command AutoStop
 * @text Auto-Pilot Off
 * @desc Disable the auto-pilot and restore the normal sprite.
 * @arg target
 *   @text Target
 *   @type select
 *   @option Player
 *   @value player
 *   @option This Event
 *   @value this
 *   @option Event ID
 *   @value event
 *   @default player
 * @arg eventId
 *   @text Event ID
 *   @type number
 *   @default 1
 *   @desc Used only when Target = Event ID.
 */

(() => {
"use strict";

// ============================================================================
// 0. Config & tiny utilities
// ============================================================================

const PLUGIN_NAME = "FrameMaster";
const FM_FOLDER_IMG = "img/framemaster/";
const FM_FOLDER_DATA = "data/framemaster/";
const FM_REGISTRY_FILE = "FM_Animations.json";

const params = PluginManager.parameters(PLUGIN_NAME);
const FM_Config = {
    defaultBlend: Math.max(0, Number(params["DefaultBlend"] || 120)),
    preloadOnMapLoad: String(params["PreloadOnMapLoad"] !== undefined ? params["PreloadOnMapLoad"] : "true") === "true",
    debugLog: String(params["DebugLog"] || "false") === "true",
    previewKey: String(params["PreviewKey"] || "F8")
};

const FM_KEY_CODES = { F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123 };

function fmLog(...args) {
    if (FM_Config.debugLog && typeof console !== "undefined") {
        console.log("[FrameMaster]", ...args);
    }
}

function fmWarn(...args) {
    if (typeof console !== "undefined") {
        console.warn("[FrameMaster]", ...args);
    }
}

function fmClampInt(value, min, max, fallback) {
    const n = Math.floor(Number(value));
    if (!isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
}

function fmIsValidId(id) {
    return typeof id === "string" && /^[A-Za-z0-9_]+$/.test(id);
}

// ============================================================================
// 1. Schema validation (shared contract with tools/framemaster_editor.html)
// ----------------------------------------------------------------------------
// Animation JSON shape:
// {
//   id, name, version, loop, loopFrom, baseSpeed,
//   anchorX, anchorY,
//   frames: [{ img, source, rect:{x,y,w,h}|null, duration, events:[...] }]
// }
// A frame uses either:
//   - single PNG:        { img: "slime_0.png", rect: null }
//   - sheet slice:       { img: <ignored>, source: "sheet.png", rect: {...} }
// ============================================================================

function fmSanitizeFrameEvent(ev) {
    if (!ev || typeof ev !== "object") return null;
    if (ev.type === "se") {
        const se = ev.se || {};
        const name = String(se.name || "");
        if (!name) return null;
        return {
            type: "se",
            se: {
                name: name,
                volume: fmClampInt(se.volume, 0, 100, 90),
                pitch: fmClampInt(se.pitch, 50, 150, 100),
                pan: fmClampInt(se.pan, -100, 100, 0)
            }
        };
    }
    if (ev.type === "commonEvent") {
        const id = fmClampInt(ev.id, 1, 9999, 0);
        if (id <= 0) return null;
        return { type: "commonEvent", id: id };
    }
    if (ev.type === "switch") {
        const id = fmClampInt(ev.id, 1, 9999, 0);
        if (id <= 0) return null;
        return { type: "switch", id: id, value: !!ev.value };
    }
    // Unknown future types: ignored with a warning (forward compatibility).
    fmLog("Ignoring unknown frame event type:", ev.type);
    return null;
}

function fmSanitizeFrame(raw) {
    if (!raw || typeof raw !== "object") return null;
    const source = String(raw.source || "").trim();
    const img = String(raw.img || "").trim();
    const file = (source || img).replace(/^.*[\\/]/, "");
    if (!file) return null;
    let rect = null;
    if (raw.rect && typeof raw.rect === "object") {
        const w = fmClampInt(raw.rect.w, 1, 8192, 0);
        const h = fmClampInt(raw.rect.h, 1, 8192, 0);
        if (w > 0 && h > 0) {
            rect = {
                x: fmClampInt(raw.rect.x, 0, 8192, 0),
                y: fmClampInt(raw.rect.y, 0, 8192, 0),
                w: w,
                h: h
            };
        }
    }
    const events = Array.isArray(raw.events)
        ? raw.events.map(fmSanitizeFrameEvent).filter(e => !!e)
        : [];
    return {
        img: rect ? file : file,   // display file (sheet file when sliced)
        source: source ? file : null,
        rect: rect,
        duration: fmClampInt(raw.duration, 1, 36000, 6),
        events: events
    };
}

function fmSanitizeAnimation(raw) {
    if (!raw || typeof raw !== "object") return null;
    const id = String(raw.id || "").trim();
    if (!fmIsValidId(id)) {
        fmWarn("Skipping animation with invalid id:", raw.id);
        return null;
    }
    if (!Array.isArray(raw.frames) || raw.frames.length === 0) {
        fmWarn("Skipping animation with no frames:", id);
        return null;
    }
    const frames = raw.frames.map(fmSanitizeFrame).filter(f => !!f);
    if (frames.length === 0) {
        fmWarn("Skipping animation with no valid frames:", id);
        return null;
    }
    const loopFrom = fmClampInt(raw.loopFrom, 0, frames.length - 1, 0);
    const loopMode = (raw.loopMode === "pingpong" || raw.loopMode === "random")
        ? raw.loopMode
        : "normal";
    return {
        id: id,
        name: String(raw.name || id),
        version: fmClampInt(raw.version, 1, 9999, 1),
        loop: raw.loop !== false,
        loopFrom: loopFrom,
        loopMode: loopMode,
        baseSpeed: Math.min(8, Math.max(0.1, Number(raw.baseSpeed) || 1.0)),
        anchorX: Math.min(1, Math.max(0, Number(raw.anchorX) || 0.5)),
        anchorY: Math.min(1, Math.max(0, Number(raw.anchorY) || 1.0)),
        frames: frames
    };
}

// ============================================================================
// 2. Async JSON loader (own XHR: graceful 404, never throws LoadError)
// ============================================================================

function fmLoadJson(url, onOk, onFail) {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => {
            if (xhr.status < 400) {
                try {
                    onOk(JSON.parse(xhr.responseText));
                } catch (e) {
                    fmWarn("Invalid JSON:", url, e);
                    onFail(e);
                }
            } else {
                onFail(new Error("HTTP " + xhr.status));
            }
        };
        xhr.onerror = () => onFail(new Error("XHR error"));
        xhr.send();
    } catch (e) {
        onFail(e);
    }
}

// ============================================================================
// 3. Game_FrameMaster — registry + per-character state machine + public API
// ============================================================================

function Game_FrameMaster() {
    this.initialize(...arguments);
}

Game_FrameMaster.prototype.initialize = function() {
    this._anims = {};          // id -> sanitized animation
    this._registryReady = false;
    this._pendingFiles = 0;
    this._readyCallbacks = [];
    this._bitmaps = {};        // filename -> Bitmap
    this._pendingRestore = null; // save/load: event states waiting for map setup
    this._callbacks = new WeakMap(); // character -> onComplete fn (never saved)
    // Self-diagnostics (shown in Scene_FrameMaster, no console needed).
    this._registryStatus = "pending"; // pending|ok|empty|missing|invalid-shape
    this._fileStatus = {};     // file -> { status, id? }
                               // file status: ok|missing|invalid-json|invalid-schema
};

Game_FrameMaster.prototype.isReady = function() {
    return this._registryReady && this._pendingFiles <= 0;
};

Game_FrameMaster.prototype.onReady = function(fn) {
    if (this.isReady()) fn();
    else this._readyCallbacks.push(fn);
};

Game_FrameMaster.prototype._setReady = function() {
    this._registryReady = true;
    this._pendingFiles = 0;
    const pending = this._readyCallbacks.splice(0);
    for (const fn of pending) {
        try { fn(); } catch (e) { fmWarn("onReady callback failed:", e); }
    }
};

// ---- Registry loading ------------------------------------------------------

Game_FrameMaster.prototype.loadRegistry = function() {
    const self = this;
    fmLoadJson(FM_FOLDER_DATA + FM_REGISTRY_FILE,
        data => self._onRegistryLoaded(data),
        () => {
            // Fresh project: no registry yet. Start empty, do not crash.
            // NOTE: Chromium itself logs "net::ERR_FILE_NOT_FOUND" for the
            // missing JSON above — that line comes from the browser, not from
            // a bug. The actionable message is the warning below.
            fmWarn("FrameMaster: no registry at \"" + FM_FOLDER_DATA + FM_REGISTRY_FILE + "\" — starting with 0 animations.");
            fmWarn("FrameMaster setup: (1) create \"data/framemaster/\" and \"img/framemaster/\" in your PROJECT folder "
                + "(not next to the plugin file); (2) copy the demo JSONs there or build your own with "
                + "tools/framemaster_editor.html; (3) restart the playtest. Details: doc/FrameMaster_HELP.md.");
            self._anims = {};
            self._registryStatus = "missing";
            self._setReady();
        });
};

Game_FrameMaster.prototype._onRegistryLoaded = function(data) {
    let entries = [];
    if (Array.isArray(data)) entries = data;
    else if (data && Array.isArray(data.animations)) entries = data.animations;
    else {
        fmWarn("Registry has unexpected shape, starting empty.");
        this._anims = {};
        this._registryStatus = "invalid-shape";
        this._setReady();
        return;
    }
    const files = [];
    for (const entry of entries) {
        if (entry && typeof entry.file === "string" && entry.file) {
            files.push(String(entry.file).replace(/^.*[\\/]/, ""));
        }
    }
    if (files.length === 0) {
        this._anims = {};
        this._registryStatus = "empty";
        this._setReady();
        return;
    }
    this._registryStatus = "ok";
    this._pendingFiles = files.length;
    for (const file of files) {
        this._loadAnimationFile(file);
    }
};

Game_FrameMaster.prototype._loadAnimationFile = function(file) {
    const self = this;
    fmLoadJson(FM_FOLDER_DATA + file,
        raw => {
            const anim = fmSanitizeAnimation(raw);
            if (anim) {
                self._anims[anim.id] = anim;
                self._fileStatus[file] = { status: "ok", id: anim.id };
                fmLog("Loaded animation:", anim.id, "(" + anim.frames.length + " frames)");
            } else {
                self._fileStatus[file] = { status: "invalid-schema" };
                fmWarn("Animation file \"" + FM_FOLDER_DATA + file + "\" is valid JSON but not a valid animation "
                    + "(needs id + at least one frame with an image). Re-export it from the visual editor.");
            }
            self._pendingFiles--;
            if (self._pendingFiles <= 0) {
                self._registryReady = true;
                const pending = self._readyCallbacks.splice(0);
                for (const fn of pending) {
                    try { fn(); } catch (e) { fmWarn("onReady callback failed:", e); }
                }
            }
        },
        err => {
            const msg = String(err && err.message || err);
            // Missing files surface as HTTP errors (http) or XHR errors
            // (file:// playtest); anything else means the JSON is broken.
            const kind = (/^HTTP/.test(msg) || msg === "XHR error") ? "missing" : "invalid-json";
            self._fileStatus[file] = { status: kind };
            fmWarn("Could not load animation file \"" + FM_FOLDER_DATA + file + "\" (" + msg + "). "
                + "Check the file name (exact case) and the \"file\" entry in " + FM_REGISTRY_FILE + ".");
            self._pendingFiles--;
            if (self._pendingFiles <= 0) {
                self._registryReady = true;
                const pending = self._readyCallbacks.splice(0);
                for (const fn of pending) {
                    try { fn(); } catch (e) { fmWarn("onReady callback failed:", e); }
                }
            }
        });
};

/** Hot-reload hook used by the external editor workflow (playtest restart). */
Game_FrameMaster.prototype.reload = function() {
    this._anims = {};
    this._registryReady = false;
    this._pendingFiles = 0;
    this._bitmaps = {};
    this._registryStatus = "pending";
    this._fileStatus = {};
    this.loadRegistry();
};

/**
 * Self-diagnostics for Scene_FrameMaster: explains WHY nothing loaded,
 * without opening the console. Snapshot object, safe to render directly.
 */
Game_FrameMaster.prototype.getDiagnostics = function() {
    const files = Object.keys(this._fileStatus).map(file => ({
        file: file,
        status: this._fileStatus[file].status,
        id: this._fileStatus[file].id || null
    }));
    // Where the game is actually running from (proves wrong-folder issues).
    let base = "";
    try {
        if (typeof window !== "undefined" && window.location && window.location.href) {
            base = String(window.location.href).split("?")[0];
            const m = base.match(/^file:\/\/\/(.*)$/);
            if (m) {
                try { base = decodeURIComponent(m[1]); }
                catch (e) { base = m[1]; }
            }
        }
    } catch (e) { base = ""; }
    return {
        registryStatus: this._registryStatus,
        registryPath: FM_FOLDER_DATA + FM_REGISTRY_FILE,
        dataFolder: FM_FOLDER_DATA,
        imgFolder: FM_FOLDER_IMG,
        runningFrom: base,
        files: files,
        animCount: Object.keys(this._anims).length
    };
};

Game_FrameMaster.prototype.getAnimation = function(animationId) {
    return this._anims[animationId] || null;
};

Game_FrameMaster.prototype.listAnimations = function() {
    return Object.values(this._anims).map(a => ({
        id: a.id, name: a.name, frames: a.frames.length, loop: a.loop
    }));
};

// ---- Bitmap cache ----------------------------------------------------------

Game_FrameMaster.prototype.bitmapFor = function(filename) {
    if (!filename) return null;
    // MZ's ImageManager.loadBitmap() appends ".png" itself
    // (url = folder + name + ".png"), so strip it here. JSON files,
    // the editor and the ZIP pack keep full "name.png" filenames.
    const key = String(filename).replace(/\.png$/i, "");
    let bmp = this._bitmaps[key];
    if (!bmp) {
        bmp = ImageManager.loadBitmap(FM_FOLDER_IMG, key);
        this._bitmaps[key] = bmp;
    }
    return bmp;
};

Game_FrameMaster.prototype.preloadAll = function() {
    const ids = Object.keys(this._anims);
    for (const id of ids) {
        const anim = this._anims[id];
        for (const frame of anim.frames) {
            this.bitmapFor(frame.source || frame.img);
        }
    }
    if (ids.length === 0) {
        fmLog("Preload: 0 animations registered — nothing to preload. "
            + "If this surprises you, the registry failed to load; see the FrameMaster warnings above.");
    } else {
        fmLog("Preloaded bitmaps for", ids.length, "animations.");
    }
};

// ---- Character resolution --------------------------------------------------

Game_FrameMaster.prototype.resolveCharacter = function(ref, interpreter) {
    try {
        if (!ref && ref !== 0) {
            // Plugin-command "this event" passes interpreter separately.
            if (interpreter && typeof interpreter.eventId === "function") {
                const eid = interpreter.eventId();
                if (eid > 0 && typeof $gameMap !== "undefined" && $gameMap) {
                    return $gameMap.event(eid);
                }
            }
            return null;
        }
        if (typeof Game_CharacterBase !== "undefined" && ref instanceof Game_CharacterBase) {
            return ref;
        }
        // Game_Interpreter passed directly (event Script box `this`).
        if (ref && typeof ref.eventId === "function" && typeof $gameMap !== "undefined" && $gameMap) {
            const eid = ref.eventId();
            if (eid > 0) return $gameMap.event(eid);
            return (typeof $gamePlayer !== "undefined") ? $gamePlayer : null;
        }
        if (typeof ref === "number") {
            if (ref <= 0) return (typeof $gamePlayer !== "undefined") ? $gamePlayer : null;
            return (typeof $gameMap !== "undefined" && $gameMap) ? $gameMap.event(ref) : null;
        }
        if (typeof ref === "string") {
            const s = ref.trim().toLowerCase();
            if (s === "player" || s === "0" || s === "-1") {
                return (typeof $gamePlayer !== "undefined") ? $gamePlayer : null;
            }
            if ((s === "this" || s === "current" || s === "thisevent") && interpreter && typeof interpreter.eventId === "function") {
                return $gameMap.event(interpreter.eventId());
            }
            const m = s.match(/^event[:\s]+(\d+)$/) || s.match(/^(\d+)$/);
            if (m && typeof $gameMap !== "undefined" && $gameMap) {
                const eid = Number(m[1]);
                return eid <= 0 ? $gamePlayer : $gameMap.event(eid);
            }
        }
    } catch (e) {
        fmWarn("resolveCharacter failed:", e);
    }
    return null;
};

Game_FrameMaster.prototype.characterKey = function(ch) {
    try {
        if (ch === $gamePlayer) return "player";
        if (typeof Game_Follower !== "undefined" && ch instanceof Game_Follower) {
            const list = ($gamePlayer && $gamePlayer.followers()) ? $gamePlayer.followers()._data : [];
            return "follower_" + Math.max(0, list.indexOf(ch));
        }
        if (typeof Game_Event !== "undefined" && ch instanceof Game_Event) {
            const mapId = ($gameMap) ? $gameMap.mapId() : 0;
            return "ev_" + mapId + "_" + ch.eventId();
        }
        if (typeof Game_Vehicle !== "undefined" && ch instanceof Game_Vehicle) {
            return "vehicle_" + (ch._type || "x");
        }
    } catch (e) { /* fall through */ }
    return null;
};

// ---- State machine ---------------------------------------------------------

Game_FrameMaster.prototype._getState = function(character) {
    return (character && character._fmState) || null;
};

Game_FrameMaster.prototype._isLooping = function(anim, state) {
    if (state && state.loopOverride !== null && state.loopOverride !== undefined) {
        return !!state.loopOverride;
    }
    return !!anim.loop;
};

Game_FrameMaster.prototype.play = function(character, animationId, options) {
    const ch = this.resolveCharacter(character);
    if (!ch) {
        fmWarn("play: unknown character:", character);
        return false;
    }
    const anim = this.getAnimation(animationId);
    if (!anim) {
        fmWarn("play: unknown animation:", animationId);
        return false;
    }
    const ok = this._startPlayback(ch, anim, options || {});
    if (ok && ch._fmAuto) {
        // Manual playback takes over until stop() resumes the auto-pilot.
        ch._fmAuto.suspended = true;
    }
    return ok;
};

/** Shared playback starter (manual play + auto-pilot switches). */
Game_FrameMaster.prototype._startPlayback = function(ch, anim, options) {
    options = options || {};
    // Snapshot current display for crossfade blend.
    const blendMs = (options.blend !== undefined && options.blend !== null)
        ? Math.max(0, Number(options.blend) || 0)
        : FM_Config.defaultBlend;
    if (blendMs > 0) {
        const from = this.frameView(ch);
        if (from && from.bitmap) {
            ch._fmBlendFrom = from;
            ch._fmBlendMs = blendMs;
        } else {
            ch._fmBlendFrom = null;
        }
    } else {
        ch._fmBlendFrom = null;
    }
    let loopOverride = null;
    if (options.loop === true || options.loop === false) loopOverride = !!options.loop;
    ch._fmState = {
        animId: anim.id,
        frameIndex: 0,
        frameElapsed: 0,
        playing: true,
        speedMul: Math.min(8, Math.max(0.1, Number(options.speed) || 1.0)),
        loopOverride: loopOverride,
        baseSpeed: anim.baseSpeed,
        dir: 1 // ping-pong travel direction (+1 forward, -1 backward)
    };
    ch._fmNeedsResync = false;
    if (typeof options.onComplete === "function") {
        this._callbacks.set(ch, options.onComplete);
    } else if (this._callbacks.has(ch)) {
        this._callbacks.delete(ch);
    }
    this.bitmapFor(anim.frames[0].source || anim.frames[0].img);
    this._fireFrameEvents(anim.frames[0]);
    fmLog("play:", anim.id, "on", this.characterKey(ch));
    return true;
};

Game_FrameMaster.prototype.stop = function(character) {
    const ch = this.resolveCharacter(character);
    if (!ch) {
        fmWarn("stop: unknown character:", character);
        return false;
    }
    if (this._callbacks.has(ch)) this._callbacks.delete(ch);
    if (ch._fmState) {
        ch._fmState = null;
        ch._fmNeedsResync = true; // force Sprite_Character back to native bitmap
    }
    // A configured auto-pilot resumes driving on the next frame.
    if (ch._fmAuto) ch._fmAuto.suspended = false;
    return true;
};

Game_FrameMaster.prototype.transitionTo = function(character, newAnimationId, blendDuration) {
    const blend = (blendDuration !== undefined && blendDuration !== null)
        ? blendDuration
        : FM_Config.defaultBlend;
    const ch = this.resolveCharacter(character);
    const prevLoop = ch && ch._fmState ? ch._fmState.loopOverride : null;
    const prevSpeed = ch && ch._fmState ? ch._fmState.speedMul : 1.0;
    const ok = this.play(character, newAnimationId, { blend: blend });
    // Preserve loop/speed context across the transition unless a fresh play() set them.
    if (ok && ch && ch._fmState) {
        if (prevLoop !== null) ch._fmState.loopOverride = prevLoop;
        ch._fmState.speedMul = prevSpeed;
    }
    return ok;
};

Game_FrameMaster.prototype.getCurrentFrame = function(character) {
    const ch = this.resolveCharacter(character);
    const st = this._getState(ch);
    return st ? st.frameIndex : -1;
};

Game_FrameMaster.prototype.isPlaying = function(character) {
    const ch = this.resolveCharacter(character);
    const st = this._getState(ch);
    return !!(st && st.playing);
};

Game_FrameMaster.prototype.getCurrentAnimation = function(character) {
    const ch = this.resolveCharacter(character);
    const st = this._getState(ch);
    return st ? st.animId : null;
};

// ---- Auto-pilot (Godot-style state machine: idle / walk / dash) -------------
// Configure once (Plugin Command "AutoPlay" or setAuto) and the character
// switches animations by itself: stopped -> idle, moving -> walk,
// dashing -> dash, with per-direction overrides (idleDown, walkLeft, ...).
// A manual play() suspends the auto-pilot; stop() resumes it.

Game_FrameMaster.prototype._sanitizeAutoMapping = function(raw) {
    if (!raw || typeof raw !== "object") return null;
    const keys = ["idle", "walk", "dash",
        "idleDown", "idleUp", "idleLeft", "idleRight",
        "walkDown", "walkUp", "walkLeft", "walkRight"];
    const mapping = {};
    for (const k of keys) {
        if (typeof raw[k] === "string" && raw[k].trim()) {
            mapping[k] = raw[k].trim();
        }
    }
    // Any single animation is enough (e.g. only directional walk variants;
    // uncovered situations fall back to the original charset sprite).
    if (!keys.some(k => mapping[k])) return null;
    mapping.blend = (raw.blend !== undefined && raw.blend !== null)
        ? Math.min(2000, Math.max(0, Number(raw.blend) || 0))
        : FM_Config.defaultBlend;
    return mapping;
};

Game_FrameMaster.prototype.setAuto = function(character, mapping) {
    const ch = this.resolveCharacter(character);
    if (!ch) {
        fmWarn("setAuto: unknown character:", character);
        return false;
    }
    const clean = this._sanitizeAutoMapping(mapping);
    if (!clean) {
        fmWarn("setAuto: mapping needs at least one animation id (idle, walk, dash or a directional variant).");
        return false;
    }
    ch._fmAuto = { mapping: clean, suspended: false, _warnedMissing: null };
    fmLog("auto-pilot ON for", this.characterKey(ch), JSON.stringify(clean));
    return true;
};

/** Disables the auto-pilot and restores the native sprite. */
Game_FrameMaster.prototype.clearAuto = function(character) {
    const ch = this.resolveCharacter(character);
    if (!ch) {
        fmWarn("clearAuto: unknown character:", character);
        return false;
    }
    ch._fmAuto = null;
    if (this._callbacks.has(ch)) this._callbacks.delete(ch);
    if (ch._fmState) {
        ch._fmState = null;
        ch._fmNeedsResync = true;
    }
    return true;
};

Game_FrameMaster.prototype.getAuto = function(character) {
    const ch = this.resolveCharacter(character);
    return (ch && ch._fmAuto) ? ch._fmAuto.mapping : null;
};

Game_FrameMaster.prototype._autoDirectionSuffix = function(ch) {
    try {
        const d = ch.direction();
        if (d === 2) return "Down";
        if (d === 4) return "Left";
        if (d === 6) return "Right";
        return "Up";
    } catch (e) {
        return "Down";
    }
};

/** Picks the animation id for the character's current situation (or null). */
Game_FrameMaster.prototype.desiredAutoAnim = function(character) {
    const ch = this.resolveCharacter(character);
    if (!ch || !ch._fmAuto) return null;
    const mapping = ch._fmAuto.mapping;
    let moving = false;
    try { moving = !!ch.isMoving(); } catch (e) { moving = false; }
    const suffix = this._autoDirectionSuffix(ch);
    if (moving) {
        let dashing = false;
        try { dashing = typeof ch.isDashing === "function" && !!ch.isDashing(); } catch (e) { dashing = false; }
        if (dashing && mapping.dash) return mapping.dash;
        return mapping["walk" + suffix] || mapping.walk || null;
    }
    return mapping["idle" + suffix] || mapping.idle || null;
};

/** Auto-pilot tick: switch animation only when the desired one changes. */
Game_FrameMaster.prototype.updateAuto = function(ch) {
    const auto = ch._fmAuto;
    if (!auto || auto.suspended) return;
    let want = null;
    try { want = this.desiredAutoAnim(ch); } catch (e) { want = null; }
    const st = ch._fmState;
    const cur = st ? st.animId : null;
    if (want && want !== cur) {
        const anim = this.getAnimation(want);
        if (!anim) {
            // Warn once per missing id (never spam every frame).
            if (auto._warnedMissing !== want) {
                auto._warnedMissing = want;
                fmWarn("auto-pilot: unknown animation \"" + want + "\" — check the AutoPlay mapping.");
            }
            return;
        }
        auto._warnedMissing = null;
        this._startPlayback(ch, anim, { blend: auto.mapping.blend });
    } else if (!want && st) {
        // Situation not covered by the mapping -> back to native sprite.
        ch._fmState = null;
        ch._fmNeedsResync = true;
    }
};

/** Per-frame advance. Called from the Game_CharacterBase.update hook. */
Game_FrameMaster.prototype.updateCharacter = function(ch) {
    try {
        this.updateAuto(ch);
    } catch (e) {
        fmWarn("updateAuto failed:", e);
    }
    const st = ch._fmState;
    if (!st || !st.playing) return;
    const anim = this.getAnimation(st.animId);
    if (!anim) {
        ch._fmState = null;
        ch._fmNeedsResync = true;
        return;
    }
    const frame = anim.frames[st.frameIndex];
    if (!frame) {
        ch._fmState = null;
        ch._fmNeedsResync = true;
        return;
    }
    const looping = this._isLooping(anim, st);
    st.frameElapsed += st.speedMul * anim.baseSpeed;
    // Loop modes (only when looping; a play-once animation always runs straight).
    const pingpong = looping && anim.loopMode === "pingpong" && anim.frames.length > 1;
    const randomPick = looping && anim.loopMode === "random" && anim.frames.length > 1;
    // Pre-touch next bitmap one frame early to hide load hitches.
    if (st.frameElapsed >= frame.duration - 1) {
        const nextIdx = st.frameIndex + 1;
        if (nextIdx < anim.frames.length) {
            this.bitmapFor(anim.frames[nextIdx].source || anim.frames[nextIdx].img);
        } else if (looping) {
            this.bitmapFor(anim.frames[anim.loopFrom].source || anim.frames[anim.loopFrom].img);
        }
    }
    while (st.frameElapsed >= anim.frames[st.frameIndex].duration) {
        st.frameElapsed -= anim.frames[st.frameIndex].duration;
        if (pingpong) {
            // Bounce: 0,1,2,…,n-1,n-2,…,1,0,1,… (loopFrom is ignored).
            let dir = st.dir === -1 ? -1 : 1;
            let next = st.frameIndex + dir;
            if (next >= anim.frames.length) {
                dir = -1;
                next = anim.frames.length - 2;
            } else if (next < 0) {
                dir = 1;
                next = 1;
            }
            st.dir = dir;
            st.frameIndex = next;
            this._fireFrameEvents(anim.frames[next]);
            continue;
        }
        if (randomPick) {
            let next = st.frameIndex;
            let guard = 0;
            do {
                next = Math.floor(Math.random() * anim.frames.length);
                guard++;
            } while (next === st.frameIndex && guard < 8);
            st.frameIndex = next;
            this._fireFrameEvents(anim.frames[next]);
            continue;
        }
        let next = st.frameIndex + 1;
        if (next >= anim.frames.length) {
            if (looping) {
                next = Math.min(anim.loopFrom, anim.frames.length - 1);
            } else {
                // Finished: hold last frame, stop, fire callback.
                st.frameIndex = anim.frames.length - 1;
                st.frameElapsed = 0;
                st.playing = false;
                const cb = this._callbacks.get(ch);
                if (cb) {
                    this._callbacks.delete(ch);
                    try { cb(); } catch (e) { fmWarn("onComplete failed:", e); }
                }
                return;
            }
        }
        st.frameIndex = next;
        this._fireFrameEvents(anim.frames[next]);
    }
};

// ---- Frame events ----------------------------------------------------------

Game_FrameMaster.prototype._fireFrameEvents = function(frame) {
    if (!frame || !frame.events || frame.events.length === 0) return;
    for (const ev of frame.events) {
        try {
            if (ev.type === "se") {
                if (typeof AudioManager !== "undefined") {
                    AudioManager.playSe({ name: ev.se.name, volume: ev.se.volume, pitch: ev.se.pitch, pan: ev.se.pan });
                }
            } else if (ev.type === "commonEvent") {
                if (typeof $gameTemp !== "undefined" && $gameTemp && typeof $gameTemp.reserveCommonEvent === "function") {
                    if (typeof $dataCommonEvents !== "undefined" && $dataCommonEvents && $dataCommonEvents[ev.id]) {
                        $gameTemp.reserveCommonEvent(ev.id);
                    } else {
                        fmLog("Frame event: common event", ev.id, "does not exist — skipped.");
                    }
                }
            } else if (ev.type === "switch") {
                if (typeof $gameSwitches !== "undefined" && $gameSwitches) {
                    $gameSwitches.setValue(ev.id, !!ev.value);
                }
            }
        } catch (e) {
            fmWarn("Frame event failed:", JSON.stringify(ev), e);
        }
    }
};

// ---- View helpers (used by Sprite_Character + preview scene) ---------------

/**
 * Current display rect for a map character, or null when native rendering
 * should be used. { bitmap, sx, sy, sw, sh, anchorX, anchorY } or {pending:true}.
 */
Game_FrameMaster.prototype.frameView = function(character) {
    const ch = this.resolveCharacter(character);
    if (!ch) return null;
    const st = ch._fmState;
    if (!st) return null;
    return this.frameViewByIndex(st.animId, st.frameIndex);
};

Game_FrameMaster.prototype.frameViewByIndex = function(animationId, frameIndex) {
    const anim = this.getAnimation(animationId);
    if (!anim) return null;
    const frame = anim.frames[frameIndex];
    if (!frame) return null;
    const bmp = this.bitmapFor(frame.source || frame.img);
    if (!bmp || !bmp.isReady || !bmp.isReady()) return { pending: true };
    if (frame.rect) {
        return {
            bitmap: bmp,
            sx: frame.rect.x, sy: frame.rect.y, sw: frame.rect.w, sh: frame.rect.h,
            anchorX: anim.anchorX, anchorY: anim.anchorY
        };
    }
    return {
        bitmap: bmp,
        sx: 0, sy: 0, sw: bmp.width, sh: bmp.height,
        anchorX: anim.anchorX, anchorY: anim.anchorY
    };
};

// ---- Save / load -----------------------------------------------------------

Game_FrameMaster.prototype.saveStates = function() {
    const out = {};
    const collect = (ch) => {
        // Save playback AND/OR auto-pilot config (auto-only chars have no state).
        if (!ch || (!ch._fmState && !ch._fmAuto)) return;
        const key = this.characterKey(ch);
        if (!key) return;
        const entry = { animId: null };
        if (ch._fmState) {
            const st = ch._fmState;
            entry.animId = st.animId;
            entry.frameIndex = st.frameIndex;
            entry.playing = st.playing;
            entry.speedMul = st.speedMul;
            entry.loopOverride = st.loopOverride;
        }
        if (ch._fmAuto) {
            entry.auto = { mapping: ch._fmAuto.mapping };
        }
        out[key] = entry;
    };
    try {
        if (typeof $gamePlayer !== "undefined" && $gamePlayer) {
            collect($gamePlayer);
            if ($gamePlayer.followers) {
                for (const f of $gamePlayer.followers()._data) collect(f);
            }
        }
        if (typeof $gameMap !== "undefined" && $gameMap) {
            for (const ev of $gameMap.events()) collect(ev);
        }
    } catch (e) {
        fmWarn("saveStates failed:", e);
    }
    return out;
};

Game_FrameMaster.prototype.loadStates = function(blob) {
    this._pendingRestore = (blob && typeof blob === "object") ? blob : null;
    // Player/followers exist right now; events are applied on map setup.
    try {
        if (this._pendingRestore && typeof $gamePlayer !== "undefined" && $gamePlayer) {
            for (const key of Object.keys(this._pendingRestore)) {
                if (key === "player") {
                    this._applySavedState($gamePlayer, this._pendingRestore[key]);
                } else if (key.indexOf("follower_") === 0) {
                    const idx = Number(key.split("_")[1]) || 0;
                    const f = $gamePlayer.followers()._data[idx];
                    if (f) this._applySavedState(f, this._pendingRestore[key]);
                }
            }
        }
    } catch (e) {
        fmWarn("loadStates (player) failed:", e);
    }
};

Game_FrameMaster.prototype.onMapSetup = function() {
    // Safety net: if the registry never started loading (e.g. another plugin
    // replaced DataManager.loadDatabase without chaining), start it now
    // instead of staying "pending" forever.
    if (!this._registryReady && this._registryStatus === "pending") {
        fmLog("Registry was never loaded — retrying now.");
        try {
            this.loadRegistry();
        } catch (e) {
            fmWarn("Registry retry failed:", e);
        }
    }
    if (FM_Config.preloadOnMapLoad) {
        try { this.preloadAll(); } catch (e) { fmWarn("preload failed:", e); }
    }
    if (!this._pendingRestore) return;
    try {
        if (typeof $gameMap === "undefined" || !$gameMap) return;
        const mapId = $gameMap.mapId();
        for (const key of Object.keys(this._pendingRestore)) {
            const m = key.match(/^ev_(\d+)_(\d+)$/);
            if (m && Number(m[1]) === mapId) {
                const ev = $gameMap.event(Number(m[2]));
                if (ev) this._applySavedState(ev, this._pendingRestore[key]);
            }
        }
    } catch (e) {
        fmWarn("loadStates (events) failed:", e);
    }
    // Keep player keys for follower re-entry; drop nothing (cheap).
};

Game_FrameMaster.prototype._applySavedState = function(ch, saved) {
    if (!ch || !saved) return;
    // Restore the auto-pilot first (always resumed after a load).
    if (saved.auto && saved.auto.mapping) {
        const clean = this._sanitizeAutoMapping(saved.auto.mapping);
        if (clean) ch._fmAuto = { mapping: clean, suspended: false, _warnedMissing: null };
    }
    if (!saved.animId) return; // auto-only entry: the next tick picks the anim
    const anim = this.getAnimation(saved.animId);
    if (!anim) {
        fmLog("Saved animation no longer exists, skipped:", saved.animId);
        return;
    }
    ch._fmState = {
        animId: anim.id,
        frameIndex: fmClampInt(saved.frameIndex, 0, anim.frames.length - 1, 0),
        frameElapsed: 0,
        playing: !!saved.playing,
        speedMul: Math.min(8, Math.max(0.1, Number(saved.speedMul) || 1.0)),
        loopOverride: (saved.loopOverride === true || saved.loopOverride === false) ? !!saved.loopOverride : null,
        baseSpeed: anim.baseSpeed,
        dir: 1
    };
    ch._fmNeedsResync = false;
};

// ============================================================================
// 4. MZ core hooks (all alias-chained, compat-safe)
// ============================================================================

// ---- Global instance ----
let $gameFrameMaster = null;
if (typeof window !== "undefined") window.$gameFrameMaster = null;

const _FM_DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    // setupNewGame() recreates ALL game objects WITHOUT reloading the
    // database — a fresh Game_FrameMaster would otherwise stay forever
    // "pending" with 0 animations after every return-to-title. Carry over
    // the already-loaded registry (read-only at runtime). Per-session data
    // (playback states, auto-pilot config, callbacks) intentionally restarts.
    const prev = (typeof $gameFrameMaster !== "undefined") ? $gameFrameMaster : null;
    _FM_DataManager_createGameObjects.call(this);
    $gameFrameMaster = new Game_FrameMaster();
    if (typeof window !== "undefined") window.$gameFrameMaster = $gameFrameMaster;
    if (prev && typeof prev.isReady === "function" && prev.isReady()) {
        $gameFrameMaster._anims = prev._anims;
        $gameFrameMaster._bitmaps = prev._bitmaps;
        $gameFrameMaster._fileStatus = prev._fileStatus;
        $gameFrameMaster._registryStatus = prev._registryStatus;
        $gameFrameMaster._registryReady = true;
    }
};

const _FM_DataManager_loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
    _FM_DataManager_loadDatabase.call(this);
    try {
        if ($gameFrameMaster) $gameFrameMaster.loadRegistry();
    } catch (e) {
        fmWarn("Registry load failed:", e);
    }
};

const _FM_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    return _FM_Scene_Boot_isReady.call(this) && (!$gameFrameMaster || $gameFrameMaster.isReady());
};

// ---- Per-character update ----
const _FM_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    _FM_Game_CharacterBase_update.call(this);
    try {
        if ($gameFrameMaster) $gameFrameMaster.updateCharacter(this);
    } catch (e) {
        fmWarn("updateCharacter failed:", e);
    }
};

// ---- Save support ----
const _FM_DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = _FM_DataManager_makeSaveContents.call(this);
    try {
        contents.fmStates = $gameFrameMaster ? $gameFrameMaster.saveStates() : {};
    } catch (e) {
        contents.fmStates = {};
    }
    return contents;
};

const _FM_DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    _FM_DataManager_extractSaveContents.call(this, contents);
    try {
        if ($gameFrameMaster) $gameFrameMaster.loadStates(contents.fmStates);
    } catch (e) {
        fmWarn("extractSaveContents (FM) failed:", e);
    }
};

// ---- Map setup: preload + apply pending event restores ----
const _FM_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    _FM_Game_Map_setup.call(this, mapId);
    try {
        if ($gameFrameMaster) $gameFrameMaster.onMapSetup();
    } catch (e) {
        fmWarn("onMapSetup failed:", e);
    }
};

// ============================================================================
// 5. Sprite_Character hook — draw FM frames instead of the 3-frame charset
// ============================================================================

const _FM_Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function() {
    _FM_Sprite_Character_initMembers.call(this);
    this._fmBlendSprite = null;
    this._fmBlendTime = 0;
    this._fmBlendDuration = 0;
    this._fmWasActive = false;
};

Sprite_Character.prototype.fmEnsureBlendSprite = function() {
    if (!this._fmBlendSprite) {
        this._fmBlendSprite = new Sprite();
        this._fmBlendSprite.anchor.x = 0.5;
        this._fmBlendSprite.anchor.y = 1;
        this._fmBlendSprite.visible = false;
        this.addChild(this._fmBlendSprite);
    }
    return this._fmBlendSprite;
};

Sprite_Character.prototype.fmStartBlend = function(from, blendMs) {
    if (!from || !from.bitmap || blendMs <= 0) return;
    const overlay = this.fmEnsureBlendSprite();
    overlay.bitmap = from.bitmap;
    overlay.setFrame(from.sx, from.sy, from.sw, from.sh);
    overlay.anchor.x = from.anchorX;
    overlay.anchor.y = from.anchorY;
    overlay.opacity = 255;
    overlay.visible = true;
    this._fmBlendTime = 0;
    this._fmBlendDuration = Math.max(1, blendMs);
};

Sprite_Character.prototype.fmUpdateBlend = function() {
    if (!this._fmBlendSprite || !this._fmBlendSprite.visible) return;
    // Advance in wall-clock ms so blends look right even at low fps.
    this._fmBlendTime += 1000 / 60;
    const t = Math.min(1, this._fmBlendTime / this._fmBlendDuration);
    this._fmBlendSprite.opacity = Math.round(255 * (1 - t));
    if (t >= 1) {
        this._fmBlendSprite.visible = false;
        this._fmBlendSprite.bitmap = null;
    }
};

const _FM_Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    _FM_Sprite_Character_update.call(this);
    try {
        this.fmUpdateBlend();
        // Consume a pending blend snapshot (set by play()/transitionTo()).
        if (this._character && this._character._fmBlendFrom) {
            const from = this._character._fmBlendFrom;
            this._character._fmBlendFrom = null;
            this.fmStartBlend(from, this._character._fmBlendMs || 0);
            this._character._fmBlendMs = 0;
        }
    } catch (e) {
        fmWarn("FM blend update failed:", e);
    }
};

const _FM_Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
Sprite_Character.prototype.updateBitmap = function() {
    const ch = this._character;
    // Forced resync (after stop()): fall back to native path with cache bust.
    if (ch && ch._fmNeedsResync) {
        ch._fmNeedsResync = false;
        this._tilesetId = -9999;
        this._tileId = -9999;
        this._characterName = "\0fm-resync";
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._fmWasActive = false;
    }
    if (ch && ch._fmState && $gameFrameMaster) {
        let view = null;
        try { view = $gameFrameMaster.frameView(ch); } catch (e) { view = null; }
        if (view && view.pending) {
            return; // bitmap still loading: keep last shown image, no flicker
        }
        if (view && view.bitmap) {
            this._tileId = 0;
            this._characterName = "\0fm:" + ch._fmState.animId;
            this._characterIndex = 0;
            this.bitmap = view.bitmap;
            this.anchor.x = view.anchorX;
            this.anchor.y = view.anchorY;
            this._fmWasActive = true;
            return;
        }
        // Animation missing (deleted file): restore native sprite once.
        if (this._fmWasActive) {
            this._fmWasActive = false;
            this._tilesetId = -9999;
            this._tileId = -9999;
            this._characterName = "\0fm-missing";
            this.anchor.x = 0.5;
            this.anchor.y = 1;
        }
    } else if (this._fmWasActive) {
        this._fmWasActive = false;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }
    _FM_Sprite_Character_updateBitmap.call(this);
};

const _FM_Sprite_Character_isImageChanged = Sprite_Character.prototype.isImageChanged;
Sprite_Character.prototype.isImageChanged = function() {
    if (this._character && (this._character._fmNeedsResync || this._character._fmBlendFrom)) {
        return true;
    }
    // While an FM animation drives this sprite, native change detection is
    // bypassed (updateBitmap handles FM bitmaps directly every frame).
    if (this._character && this._character._fmState && $gameFrameMaster) {
        return false;
    }
    return _FM_Sprite_Character_isImageChanged.call(this);
};

const _FM_Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
Sprite_Character.prototype.updateFrame = function() {
    const ch = this._character;
    if (ch && ch._fmState && $gameFrameMaster) {
        let view = null;
        try { view = $gameFrameMaster.frameView(ch); } catch (e) { view = null; }
        if (view && view.bitmap) {
            this.updateHalfBodySprites();
            if (this._bushDepth > 0) {
                const d = this._bushDepth;
                if (this._upperBody && this._lowerBody) {
                    this._upperBody.bitmap = view.bitmap;
                    this._lowerBody.bitmap = view.bitmap;
                }
                this.setFrame(view.sx, view.sy, 0, view.sh);
                if (this._upperBody && this._lowerBody) {
                    this._upperBody.setFrame(view.sx, view.sy, view.sw, view.sh - d);
                    this._lowerBody.setFrame(view.sx, view.sy + view.sh - d, view.sw, d);
                }
            } else {
                this.setFrame(view.sx, view.sy, view.sw, view.sh);
            }
            return;
        }
        if (view && view.pending) return; // keep previous frame while loading
    }
    _FM_Sprite_Character_updateFrame.call(this);
};

// ============================================================================
// 6. Scene_FrameMaster — in-game preview/test scene
// ============================================================================

function Scene_FrameMaster() {
    this.initialize(...arguments);
}
Scene_FrameMaster.prototype = Object.create(Scene_MenuBase.prototype);
Scene_FrameMaster.prototype.constructor = Scene_FrameMaster;

Scene_FrameMaster.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._previewAnimId = null;
    this._previewIndex = 0;
    this._previewElapsed = 0;
    this._previewPlaying = true;
    this._previewSpeed = 1.0;
    this._previewDir = 1; // ping-pong travel direction
};

Scene_FrameMaster.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createListWindow();
    this.createPreviewSprite();
    this.createPropsWindow();
    this._helpWindow.setText("Up/Down: select animation   OK: play/pause   PgUp/PgDn: speed   Cancel: back");
    const list = $gameFrameMaster ? $gameFrameMaster.listAnimations() : [];
    if (list.length > 0) {
        this._listWindow.select(0);
        this._onAnimSelected();
    } else {
        this._helpWindow.setText("No animations loaded. Read the diagnosis on the right, fix the files, restart playtest. (Cancel: back)");
        this.refreshProps(); // draw the diagnostics panel (list is empty)
    }
    // Selectable windows start DEACTIVATED (MZ default): without this,
    // the list ignores all input and the scene can never be closed.
    this._listWindow.activate();
};

Scene_FrameMaster.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

Scene_FrameMaster.prototype.createListWindow = function() {
    const ww = 360;
    const wh = Graphics.boxHeight - this.helpAreaHeight();
    this._listWindow = new Window_FmAnimList(new Rectangle(0, this.helpAreaHeight(), ww, wh));
    this._listWindow.setHandler("ok", this._onPlayPause.bind(this));
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    this._listWindow.setHandler("pagedown", this._onSpeedDown.bind(this));
    this._listWindow.setHandler("pageup", this._onSpeedUp.bind(this));
    this.addWindow(this._listWindow);
};

Scene_FrameMaster.prototype.createPreviewSprite = function() {
    this._previewSprite = new Sprite();
    this._previewSprite.anchor.x = 0.5;
    this._previewSprite.anchor.y = 1.0;
    this._previewSprite.x = 360 + (Graphics.boxWidth - 360 - 260) / 2;
    this._previewSprite.y = Graphics.boxHeight - 120;
    const scale = 2;
    this._previewSprite.scale.x = scale;
    this._previewSprite.scale.y = scale;
    this.addChild(this._previewSprite);
    // Checkerboard-style backdrop: simple translucent panel behind sprite.
    this._previewBackdrop = new Sprite(new Bitmap(320, 320));
    this._previewBackdrop.bitmap.fillAll("rgba(0,0,0,0.35)");
    this._previewBackdrop.x = this._previewSprite.x - 160;
    this._previewBackdrop.y = this._previewSprite.y - 320;
    this.addChildAt(this._previewBackdrop, 0);
};

Scene_FrameMaster.prototype.createPropsWindow = function() {
    const ww = 260;
    const wx = Graphics.boxWidth - ww;
    const wh = Graphics.boxHeight - this.helpAreaHeight();
    this._propsWindow = new Window_FmProps(new Rectangle(wx, this.helpAreaHeight(), ww, wh));
    this.addWindow(this._propsWindow);
};

Scene_FrameMaster.prototype._onAnimSelected = function() {
    const item = this._listWindow.currentItem();
    this._previewAnimId = item ? item.id : null;
    this._previewIndex = 0;
    this._previewElapsed = 0;
    this._previewPlaying = true;
    this._previewDir = 1;
    this.refreshProps();
};

Scene_FrameMaster.prototype._onPlayPause = function() {
    this._previewPlaying = !this._previewPlaying;
    this._listWindow.activate();
    this.refreshProps();
};

Scene_FrameMaster.prototype._onSpeedUp = function() {
    this._previewSpeed = Math.min(4, Math.round((this._previewSpeed + 0.25) * 100) / 100);
    this._listWindow.activate();
    this.refreshProps();
};

Scene_FrameMaster.prototype._onSpeedDown = function() {
    this._previewSpeed = Math.max(0.25, Math.round((this._previewSpeed - 0.25) * 100) / 100);
    this._listWindow.activate();
    this.refreshProps();
};

Scene_FrameMaster.prototype.refreshProps = function() {
    if (this._propsWindow) {
        this._propsWindow.setPreview(this._previewAnimId, this._previewIndex, this._previewPlaying, this._previewSpeed);
    }
};

Scene_FrameMaster.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    // Track list cursor changes without overriding Window handlers.
    const item = this._listWindow ? this._listWindow.currentItem() : null;
    const id = item ? item.id : null;
    if (id !== this._previewAnimId) {
        this._onAnimSelected();
    }
    this.updatePreview();
};

Scene_FrameMaster.prototype.updatePreview = function() {
    if (!this._previewAnimId || !$gameFrameMaster) {
        if (this._previewSprite) this._previewSprite.bitmap = null;
        return;
    }
    const anim = $gameFrameMaster.getAnimation(this._previewAnimId);
    if (!anim) return;
    if (this._previewPlaying && anim.frames.length > 1) {
        this._previewElapsed += this._previewSpeed * anim.baseSpeed;
        const pp = anim.loop && anim.loopMode === "pingpong";
        const rnd = anim.loop && anim.loopMode === "random";
        let guard = 0;
        while (this._previewElapsed >= anim.frames[this._previewIndex].duration && guard < 64) {
            guard++;
            this._previewElapsed -= anim.frames[this._previewIndex].duration;
            if (pp) {
                let dir = this._previewDir === -1 ? -1 : 1;
                let next = this._previewIndex + dir;
                if (next >= anim.frames.length) {
                    dir = -1;
                    next = anim.frames.length - 2;
                } else if (next < 0) {
                    dir = 1;
                    next = 1;
                }
                this._previewDir = dir;
                this._previewIndex = next;
            } else if (rnd) {
                let next = this._previewIndex;
                let guard2 = 0;
                do {
                    next = Math.floor(Math.random() * anim.frames.length);
                    guard2++;
                } while (next === this._previewIndex && guard2 < 8);
                this._previewIndex = next;
            } else {
                let next = this._previewIndex + 1;
                if (next >= anim.frames.length) {
                    next = anim.loop ? Math.min(anim.loopFrom, anim.frames.length - 1) : 0;
                }
                this._previewIndex = next;
            }
        }
    }
    const view = $gameFrameMaster.frameViewByIndex(this._previewAnimId, this._previewIndex);
    if (view && view.bitmap) {
        this._previewSprite.bitmap = view.bitmap;
        this._previewSprite.setFrame(view.sx, view.sy, view.sw, view.sh);
        this._previewSprite.anchor.x = view.anchorX;
        this._previewSprite.anchor.y = view.anchorY;
    }
    // Light refresh of the frame counter only when it changes.
    if (this._propsWindow &&
        (this._lastPropsIndex !== this._previewIndex ||
         this._lastPropsPlaying !== this._previewPlaying ||
         this._lastPropsSpeed !== this._previewSpeed)) {
        this._lastPropsIndex = this._previewIndex;
        this._lastPropsPlaying = this._previewPlaying;
        this._lastPropsSpeed = this._previewSpeed;
        this.refreshProps();
    }
};

// ---- Window_FmAnimList ----

function Window_FmAnimList() {
    this.initialize(...arguments);
}
Window_FmAnimList.prototype = Object.create(Window_Selectable.prototype);
Window_FmAnimList.prototype.constructor = Window_FmAnimList;

Window_FmAnimList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._items = ($gameFrameMaster ? $gameFrameMaster.listAnimations() : []);
    this.refresh();
};

Window_FmAnimList.prototype.maxItems = function() {
    return this._items.length;
};

Window_FmAnimList.prototype.currentItem = function() {
    return this._items[this.index()] || null;
};

Window_FmAnimList.prototype.drawItem = function(index) {
    const item = this._items[index];
    if (!item) return;
    const rect = this.itemLineRect(index);
    this.drawText(item.name, rect.x + 4, rect.y, rect.width - 120);
    this.drawText(item.frames + "f", rect.x + rect.width - 116, rect.y, 52, "right");
    this.drawText(item.loop ? "loop" : "once", rect.x + rect.width - 60, rect.y, 56, "right");
};

Window_FmAnimList.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_FmAnimList.prototype.playOkSound = function() {
    // OK toggles play/pause: keep the cursor sound subtle.
    SoundManager.playCursor();
};

// ---- Window_FmProps ----

function Window_FmProps() {
    this.initialize(...arguments);
}
Window_FmProps.prototype = Object.create(Window_Base.prototype);
Window_FmProps.prototype.constructor = Window_FmProps;

Window_FmProps.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
};

Window_FmProps.prototype.setPreview = function(animId, frameIndex, playing, speed) {
    this.contents.clear();
    if (!animId || !$gameFrameMaster) {
        this.drawDiagnostics();
        return;
    }
    const anim = $gameFrameMaster.getAnimation(animId);
    if (!anim) return;
    const y = 0;
    this.drawTextEx("\\C[6]" + anim.name, 0, y);
    let yy = this.lineHeight() + 8;
    this.drawText("ID: " + anim.id, 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("Frames: " + anim.frames.length, 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("Loop: " + (anim.loop ? "yes (from " + anim.loopFrom + ", " + (anim.loopMode || "normal") + ")" : "no"), 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("Base speed: x" + anim.baseSpeed, 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("Now: frame " + frameIndex + " / " + (anim.frames.length - 1), 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("State: " + (playing ? "playing" : "paused"), 0, yy, this.innerWidth); yy += this.lineHeight();
    this.drawText("Preview speed: x" + speed, 0, yy, this.innerWidth); yy += this.lineHeight() + 8;
    const frame = anim.frames[frameIndex];
    if (frame) {
        this.drawText("Frame file:", 0, yy, this.innerWidth); yy += this.lineHeight();
        this.drawText((frame.source || frame.img) + (frame.rect ? " [sheet]" : ""), 0, yy, this.innerWidth - 8); yy += this.lineHeight();
        this.drawText("Duration: " + frame.duration + "f (" + Math.round(frame.duration * 1000 / 60) + " ms)", 0, yy, this.innerWidth); yy += this.lineHeight();
        this.drawText("Events: " + frame.events.length, 0, yy, this.innerWidth);
    }
};

/**
 * In-game self-diagnosis: tells the developer exactly which files are
 * missing or broken, so the console is never needed for setup issues.
 */
Window_FmProps.prototype.drawDiagnostics = function() {
    const diag = ($gameFrameMaster && $gameFrameMaster.getDiagnostics)
        ? $gameFrameMaster.getDiagnostics()
        : null;
    if (!diag) {
        this.drawText("No animation", 0, 0, this.innerWidth);
        return;
    }
    this.contents.fontSize = 20;
    const lh = this.lineHeight();
    const maxW = this.innerWidth - 8;
    let yy = 0;
    // Hard-split single words (paths/URLs) that exceed the panel width.
    const chunksOf = (word) => {
        const out = [];
        let cur = "";
        for (const ch of String(word)) {
            if (cur && this.textWidth(cur + ch) > maxW) {
                out.push(cur);
                cur = ch;
            } else {
                cur += ch;
            }
        }
        if (cur) out.push(cur);
        return out;
    };
    const line = (text) => {
        // Simple word-wrap for the narrow panel.
        const words = [];
        for (const w of String(text).split(" ")) {
            words.push(...chunksOf(w));
        }
        let row = "";
        for (const w of words) {
            const trial = row ? row + " " + w : w;
            if (this.textWidth(trial) > maxW && row) {
                this.drawText(row, 0, yy, this.innerWidth);
                yy += lh;
                row = w;
            } else {
                row = trial;
            }
        }
        if (row) {
            this.drawText(row, 0, yy, this.innerWidth);
            yy += lh;
        }
    };
    line("Diagnosis: 0 animations");
    if (diag.runningFrom) {
        line("From:");
        line(diag.runningFrom);
    }
    const regMsg = {
        pending: "Registry: loading…",
        ok: "Registry: OK",
        empty: "Registry: OK but EMPTY",
        missing: "Registry: MISSING",
        "invalid-shape": "Registry: BROKEN (not a list)"
    }[diag.registryStatus] || "Registry: ?";
    line(regMsg);
    if (diag.registryStatus === "missing") {
        line("Missing file:");
        line(diag.registryPath);
        line("Unzip the pack into the project root, then restart playtest.");
    } else if (diag.registryStatus === "empty") {
        line("The registry exists but lists no files. Add animations with the visual editor.");
    } else if (diag.registryStatus === "invalid-shape") {
        line("The registry must be a list like:");
        line('[{"id":"x","file":"x.json"}]');
    } else if (diag.registryStatus === "ok") {
        const bad = diag.files.filter(f => f.status !== "ok");
        if (bad.length === 0 && diag.animCount === 0) {
            line("Registry OK, but every file failed. See below.");
        }
        const shown = diag.files.slice(0, 6);
        for (const f of shown) {
            if (f.status === "ok") line(f.file + ": OK (" + f.id + ")");
            else if (f.status === "missing") line(f.file + ": NOT FOUND (exact name?)");
            else if (f.status === "invalid-json") line(f.file + ": BROKEN JSON");
            else line(f.file + ": BAD DATA (id+frames?)");
        }
        if (diag.files.length > shown.length) {
            line("…+" + (diag.files.length - shown.length) + " more (see console F12).");
        }
        line("Images go in " + diag.imgFolder + " with exact PNG names.");
    }
    this.resetFontSettings();
};

// ============================================================================
// 7. Plugin commands + preview hotkey
// ============================================================================

function fmResolveCommandTarget(args, interpreter) {
    const target = String(args.target || "player");
    if (target === "player") return (typeof $gamePlayer !== "undefined") ? $gamePlayer : null;
    if (target === "this") {
        if (interpreter && typeof interpreter.eventId === "function") {
            const eid = interpreter.eventId();
            if (eid > 0 && typeof $gameMap !== "undefined" && $gameMap) return $gameMap.event(eid);
        }
        return null;
    }
    const eid = Number(args.eventId || 0);
    if (eid > 0 && typeof $gameMap !== "undefined" && $gameMap) return $gameMap.event(eid);
    return null;
}

PluginManager.registerCommand(PLUGIN_NAME, "Play", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("Play: no target character.");
        return;
    }
    const loopRaw = String(args.loop || "default");
    const options = {
        loop: loopRaw === "true" ? true : loopRaw === "false" ? false : undefined,
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? FM_Config.defaultBlend : Math.max(0, Number(args.blend) || 0)
    };
    $gameFrameMaster.play(ch, String(args.animation || "").trim(), options);
});

PluginManager.registerCommand(PLUGIN_NAME, "Stop", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (ch) $gameFrameMaster.stop(ch);
});

PluginManager.registerCommand(PLUGIN_NAME, "TransitionTo", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("TransitionTo: no target character.");
        return;
    }
    const blend = Number(args.blend) < 0 ? FM_Config.defaultBlend : Math.max(0, Number(args.blend) || 0);
    $gameFrameMaster.transitionTo(ch, String(args.animation || "").trim(), blend);
});

PluginManager.registerCommand(PLUGIN_NAME, "OpenPreview", function() {
    if (typeof SceneManager !== "undefined") SceneManager.push(Scene_FrameMaster);
});

PluginManager.registerCommand(PLUGIN_NAME, "AutoPlay", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("AutoPlay: no target character.");
        return;
    }
    // Empty directional fields fall back to Idle/Walk; empty Dash falls back to Walk.
    const mapping = {
        idle: String(args.idle || "").trim(),
        walk: String(args.walk || "").trim(),
        dash: String(args.dash || "").trim(),
        idleDown: String(args.idleDown || "").trim(),
        idleUp: String(args.idleUp || "").trim(),
        idleLeft: String(args.idleLeft || "").trim(),
        idleRight: String(args.idleRight || "").trim(),
        walkDown: String(args.walkDown || "").trim(),
        walkUp: String(args.walkUp || "").trim(),
        walkLeft: String(args.walkLeft || "").trim(),
        walkRight: String(args.walkRight || "").trim(),
        blend: Number(args.blend) < 0 ? FM_Config.defaultBlend : Math.max(0, Number(args.blend) || 0)
    };
    $gameFrameMaster.setAuto(ch, mapping);
});

PluginManager.registerCommand(PLUGIN_NAME, "AutoStop", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (ch) $gameFrameMaster.clearAuto(ch);
});

// Preview hotkey on the map (F-key mapped to a virtual button at boot).
(function fmSetupPreviewKey() {
    try {
        if (FM_Config.previewKey && FM_Config.previewKey !== "none" && typeof Input !== "undefined") {
            const code = FM_KEY_CODES[FM_Config.previewKey];
            if (code && !Input.keyMapper[code]) {
                Input.keyMapper[code] = "fmPreview";
            }
        }
    } catch (e) { /* Input may not exist in headless tests */ }
})();

const _FM_Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _FM_Scene_Map_update.call(this);
    try {
        if (typeof Input !== "undefined" && Input.isTriggered && Input.isTriggered("fmPreview")) {
            SceneManager.push(Scene_FrameMaster);
        }
    } catch (e) { /* ignore */ }
};

// ============================================================================
// 8. Public exports / test seam
// ============================================================================

const FrameMaster_API = {
    version: "1.2.0",
    Game_FrameMaster: Game_FrameMaster,
    Scene_FrameMaster: Scene_FrameMaster,
    Window_FmAnimList: Window_FmAnimList,
    Window_FmProps: Window_FmProps,
    sanitizeAnimation: fmSanitizeAnimation,
    sanitizeFrame: fmSanitizeFrame,
    config: FM_Config
};

if (typeof window !== "undefined") {
    window.FrameMaster = FrameMaster_API;
}
// CommonJS seam so the logic can be smoke-tested with plain node.
if (typeof module !== "undefined" && module.exports) {
    module.exports = FrameMaster_API;
}

})();
