/*:
 * @target MZ
 * @title FrameMaster MZ
 * @plugindesc v2.3.0 Unlimited frame-by-frame animation (Godot-style): characters, battlers, pictures, layers, 8-dir auto-pilot, battle director.
 * @author Rpx & Just Dev
 * @url https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin
 *
 * @help
 * ============================================================================
 * FrameMaster MZ v2.3.0 — Godot-style frame-by-frame animation for RMMZ
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
 *  PlayBattler    Battle actor/enemy plays an animation (side+front view).
 *  StopBattler    Back to the normal battler sprite.
 *  PlayPicture    Map picture (by id) plays an animation.
 *  StopPicture    Back to the picture's own image.
 *  BattleSetup    Assign a battle set to battlers (director on/off).
 *  LayerSet       Add a visual layer (equipment suffix or fixed overlay).
 *  LayerClear     Remove one layer slot, or all layers.
 *  PlayOnce       Independent one-shot on a character (auto-resumes).
 *  PlayBattlerOnce One-shot on a battler, then native sprite.
 *  PlayPictureOnce One-shot on a picture, then own image.
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
 *  $gameFrameMaster.playOnce(character, animationId, options); // one-shot, auto-resumes
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
 *  $gameFrameMaster.playBattler(battler, animId, options);   // battler: instance, "actor:1", "enemy:0"
 *  $gameFrameMaster.stopBattler(battler);
 *  $gameFrameMaster.transitionBattler(battler, newId, blendMs);
 *  $gameFrameMaster.playBattlerOnce(battler, animId, options); // one-shot, then native
 *  $gameFrameMaster.getBattlerFrame / isBattlerPlaying / getBattlerAnimation
 *  $gameFrameMaster.playPicture(idOrPicture, animId, options); // id 1-100
 *  $gameFrameMaster.stopPicture(idOrPicture);
 *  $gameFrameMaster.transitionPicture(idOrPicture, newId, blendMs);
 *  $gameFrameMaster.playPictureOnce(idOrPicture, animId, options); // one-shot, then own image
 *  $gameFrameMaster.getPictureFrame / isPicturePlaying / getPictureAnimation
 *  $gameFrameMaster.assignBattleSet(battler, setId); // battle director set
 *  $gameFrameMaster.clearBattleSet(battler);
 *  $gameFrameMaster.playBattlerState(battler, "hit"); // any set moment
 *  $gameFrameMaster.setLayers(character, [{ slot:"weapon", suffix:"_iron" }]);
 *  $gameFrameMaster.clearLayers(character, "weapon"); // or no slot = all
 *  $gameFrameMaster.getLayers(character);            // [{slot,suffix,anim,dx,dy}]
 *  FrameMaster.registerLayerProvider(id, fn);        // compat hook for other plugins — fn(ch) => layer|layers|null
 *  FrameMaster.unregisterLayerProvider(id);
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
 * BATTLERS & PICTURES (no coding required)
 * ----------------------------------------------------------------------------
 *  PlayBattler on an actor ($gameActors.actor id) or enemy (0-based troop
 *  order): unlimited frames in battle, side-view and front-view. Hit-flash,
 *  damage popups, states and collapse keep working on top; the actor weapon
 *  hides while FM drives it. PlayPicture animates a map picture by id
 *  (Show Picture first): position/scale/rotation/opacity/tone are kept.
 *  Blends crossfade FM -> FM; native -> FM is a hard cut (LITE-wide rule).
 *
 * ----------------------------------------------------------------------------
 * SCRIPT FRAME-EVENTS
 * ----------------------------------------------------------------------------
 *  A frame event { type:"script", code:"..." } (editors: + Script) runs when
 *  the frame shows, on any owner. Available names: $gameVariables,
 *  $gameSwitches, $gameSelfSwitches, $gameActors, $gameParty, $gameTroop,
 *  $gameMap, $gamePlayer, $gameScreen, $gameTemp, $gameMessage, owner, fm.
 *  Errors log to console and never crash; 5000 chars max per snippet.
 *
 * ----------------------------------------------------------------------------
 * BATTLE DIRECTOR (Godot-style battle states, zero code in game)
 * ----------------------------------------------------------------------------
 *  Build a Battle Set in the forge (Battle Sets tab): idle, appear,
 *  attack1/2/3 (cycle/random/first), skill, item, defend, hit, evade, die,
 *  victory + HP phases that swap the whole set. Assign once — Troop Event,
 *  Span Battle -> BattleSetup -> All Enemies (actors: starting-map event) —
 *  and the director drives everything, returning one-shots to idle by
 *  itself. Empty moments keep native SV motions.
 *
 * ----------------------------------------------------------------------------
 * LAYERS — visual equipment & overlays (no coding required)
 * ----------------------------------------------------------------------------
 *  One base animation + a stack of layers drawn over it, sharing the base
 *  frame (lockstep). Two layer kinds:
 *    suffix: { slot:"weapon", suffix:"_iron" } — draws base+suffix
 *            ("hero_walk"+" _iron" = "hero_walk_iron"); follows idle, walk,
 *            battle states and blends automatically. Missing variant = the
 *            slot hides for that base animation, no error.
 *    fixed:  { slot:"halo", anim:"halo_loop" } — any overlay animation.
 *  Offsets dx/dy nudge a layer in pixels. Max 8 layers (perf guard).
 *  Equipment: tag DB weapons/armors with e.g. <fm-layer:weapon:_iron> and
 *  equipping rebuilds that slot by itself (manual LayerSet survives);
 *  unequipping clears it. Player = party leader, followers = their actor;
 *  now with battler layers in battle too (weapon spada visibile).
 *  In v2.3.0 also on battlers/pictures, lockstep with idle/attack/hit… states.
 *  Other plugins can inject layers without touching saves:
 *    FrameMaster.registerLayerProvider("myAura", ch => {
 *      if (ch === $gamePlayer && $gameSwitches.value(10))
 *        return { slot:"aura", anim:"aura_loop", dx:0, dy:-8 };
 *      return null;
 *    });
 *  Provider layers are sanitized, deduped (manual/equip wins) and capped at 8.
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
 * @arg walkDownLeft
 *   @text Walk Down-Left (Diagonal)
 *   @type string
 *   @default
 *   @desc Pixel-movement diagonal. Empty = use Walk.
 * @arg walkDownRight
 *   @text Walk Down-Right (Diagonal)
 *   @type string
 *   @default
 *   @desc Pixel-movement diagonal. Empty = use Walk.
 * @arg walkUpLeft
 *   @text Walk Up-Left (Diagonal)
 *   @type string
 *   @default
 *   @desc Pixel-movement diagonal. Empty = use Walk.
 * @arg walkUpRight
 *   @text Walk Up-Right (Diagonal)
 *   @type string
 *   @default
 *   @desc Pixel-movement diagonal. Empty = use Walk.
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
 *
 * @command PlayBattler
 * @text Play (Battler)
 * @desc Play a FrameMaster animation on a battle actor or enemy.
 * @arg side
 *   @text Side
 *   @type select
 *   @option Actor
 *   @value actor
 *   @option Enemy
 *   @value enemy
 *   @default enemy
 * @arg id
 *   @text Actor ID / Enemy Index
 *   @type number
 *   @default 1
 *   @desc Actor: database ID. Enemy: 0-based troop order (first enemy = 0).
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
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
 *   @desc Crossfade FM -> FM. -1 = Default Blend. Native -> FM is a hard cut.
 *
 * @command StopBattler
 * @text Stop (Battler)
 * @desc Stop the FM animation, restore the normal battler sprite.
 * @arg side
 *   @text Side
 *   @type select
 *   @option Actor
 *   @value actor
 *   @option Enemy
 *   @value enemy
 *   @default enemy
 * @arg id
 *   @text Actor ID / Enemy Index
 *   @type number
 *   @default 1
 *   @desc Actor: database ID. Enemy: 0-based troop order (first enemy = 0).
 *
 * @command PlayPicture
 * @text Play (Picture)
 * @desc Play a FrameMaster animation on a map picture (Show Picture first).
 * @arg pictureId
 *   @text Picture ID
 *   @type number
 *   @default 1
 *   @min 1
 *   @max 100
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
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
 *   @desc Crossfade FM -> FM. -1 = Default Blend. Picture -> FM is a hard cut.
 *
 * @command StopPicture
 * @text Stop (Picture)
 * @desc Stop the FM animation, restore the picture's own image.
 * @arg pictureId
 *   @text Picture ID
 *   @type number
 *   @default 1
 *   @min 1
 *   @max 100
 *
 * @command BattleSetup
 * @text Battle Setup (Director)
 * @desc Assign a battle set (idle/attacks/hit/die/…) to battlers. Empty Set = clear assignment. Usually a Troop Event, Span: Battle.
 * @arg scope
 *   @text Who
 *   @type select
 *   @option One Enemy
 *   @value enemy
 *   @option All Enemies
 *   @value allEnemies
 *   @option One Actor
 *   @value actor
 *   @option All Actors
 *   @value allActors
 *   @default allEnemies
 * @arg id
 *   @text Enemy Index / Actor ID
 *   @type number
 *   @default 0
 *   @desc Enemy: 0-based troop order (first = 0). Actor: database ID. Ignored for All.
 * @arg set
 *   @text Battle Set ID
 *   @type string
 *   @default slime_battle
 *   @desc Battle set from the forge. EMPTY clears the assignment.
 *
 * @command LayerSet
 * @text Set Layer (Equipment/Overlay)
 * @desc Add a visual layer over the base animation. Suffix layers follow the base animation id; fixed layers play any animation.
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
 * @arg slot
 *   @text Slot
 *   @type string
 *   @default weapon
 *   @desc Slot name: weapon, armor, helm, cape… Re-setting a slot replaces it.
 * @arg kind
 *   @text Kind
 *   @type select
 *   @option Suffix (follows base anim)
 *   @value suffix
 *   @option Fixed animation
 *   @value anim
 *   @default suffix
 * @arg value
 *   @text Suffix or Animation ID
 *   @type string
 *   @default _iron
 *   @desc Suffix appended to the base id (e.g. _iron), or a fixed animation id.
 * @arg dx
 *   @text Offset X
 *   @type number
 *   @default 0
 *   @min -500
 *   @max 500
 * @arg dy
 *   @text Offset Y (up positive)
 *   @type number
 *   @default 0
 *   @min -500
 *   @max 500
 *
 * @command LayerClear
 * @text Clear Layers
 * @desc Remove one layer slot, or every layer when Slot is empty.
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
 * @arg slot
 *   @text Slot
 *   @type string
 *   @default
 *   @desc Slot to clear. Empty = clear all layers.
 *
 * @command PlayOnce
 * @text Play Once (One-Shot)
 * @desc Independent one-shot: plays an animation once (loop forced off) and then returns to auto-pilot or native sprite. Perfect for emotes/chest opening.
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
 *   @desc Crossfade into the one-shot. -1 = Default Blend.
 *
 * @command PlayBattlerOnce
 * @text Play Once (Battler)
 * @desc One-shot on a battler: plays once then returns to native battler sprite.
 * @arg side
 *   @text Side
 *   @type select
 *   @option Actor
 *   @value actor
 *   @option Enemy
 *   @value enemy
 *   @default enemy
 * @arg id
 *   @text Actor ID / Enemy Index
 *   @type number
 *   @default 1
 *   @desc Actor: database ID. Enemy: 0-based troop order (first enemy = 0).
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
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
 *   @desc Crossfade into the one-shot. -1 = Default Blend.
 *
 * @command PlayPictureOnce
 * @text Play Once (Picture)
 * @desc One-shot on a picture: plays once then returns to the picture's own image.
 * @arg pictureId
 *   @text Picture ID
 *   @type number
 *   @default 1
 *   @min 1
 *   @max 100
 * @arg animation
 *   @text Animation ID
 *   @type string
 *   @default idle
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
 *   @desc Crossfade into the one-shot. -1 = Default Blend.
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

const FM_pendingLayerProviders = [];

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
    // Unknown types (e.g. PRO "script"): preserved verbatim so extensions
    // can run them. The base runtime ignores them when firing (see below).
    // NOTE: ev comes from JSON.parse, so it is plain data — safe to keep.
    if (typeof ev.type === "string" && ev.type) {
        fmLog("Keeping unknown frame event type for extensions:", ev.type);
        return { ...ev, type: String(ev.type) };
    }
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
    this._bitmaps = {};        // canonical(lower) -> Bitmap (LRU)
    this._bitmapOrder = [];    // LRU recency, oldest first
    this._pendingRestore = null; // save/load: event states waiting for map setup
    this._callbacks = new WeakMap(); // character -> onComplete fn (never saved)
    this._layerProviders = []; // {id, fn} — external layer sources (compat API)
    if (FM_pendingLayerProviders.length) {
        for (const p of FM_pendingLayerProviders.splice(0)) {
            try { this.registerLayerProvider(p.id, p.fn); } catch (e) {}
        }
    }
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
    this._bitmapOrder = [];
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
    const raw = String(filename);
    const MAX_BITMAPS = 220; // ~200 frames + headroom; evicts LRU on overflow
    const touch = (canon) => {
        const at = this._bitmapOrder.indexOf(canon);
        if (at !== -1) this._bitmapOrder.splice(at, 1);
        this._bitmapOrder.push(canon);
        while (this._bitmapOrder.length > MAX_BITMAPS) {
            const evict = this._bitmapOrder.shift();
            const bmp = this._bitmaps[evict];
            if (bmp) {
                try { if (bmp.destroy) bmp.destroy(); } catch (e) {}
                delete this._bitmaps[evict];
            }
        }
    };
    // .webp: MZ's loadBitmap always appends .png, so use the URL loader
    // to keep the real extension (60-80% smaller than PNG).
    if (/\.webp$/i.test(raw)) {
        const canon = raw.toLowerCase();
        let bmp = this._bitmaps[canon];
        if (bmp) { touch(canon); return bmp; }
        const url = FM_FOLDER_IMG + (typeof Utils !== "undefined" && Utils.encodeURI ? Utils.encodeURI(raw) : raw);
        bmp = ImageManager.loadBitmapFromUrl(url);
        this._bitmaps[canon] = bmp;
        touch(canon);
        return bmp;
    }
    // MZ's ImageManager.loadBitmap() appends ".png" itself
    // (url = folder + name + ".png"), so strip it here. JSON files,
    // the editor and the ZIP pack keep full "name.png" filenames.
    const key = raw.replace(/\.png$/i, "");
    const canon = key.toLowerCase();
    let bmp = this._bitmaps[canon];
    if (bmp) { touch(canon); return bmp; }
    bmp = ImageManager.loadBitmap(FM_FOLDER_IMG, key);
    this._bitmaps[canon] = bmp;
    // Keep the original-case key as an alias for direct lookups (no extra LRU entry)
    if (key !== canon) this._bitmaps[key] = bmp;
    touch(canon);
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

Game_FrameMaster.prototype.preloadNearby = function() {
    try {
        if (!this.isReady()) return;
        const toPreload = new Set();
        const addAnim = (animId) => {
            if (!animId) return;
            const anim = this.getAnimation(animId);
            if (!anim) return;
            for (const f of anim.frames) {
                const file = f.source || f.img;
                if (file) toPreload.add(file);
            }
        };
        const collectFor = (ch) => {
            if (!ch) return;
            if (ch._fmState) addAnim(ch._fmState.animId);
            if (ch._fmAuto && ch._fmAuto.mapping) {
                for (const k in ch._fmAuto.mapping) {
                    if (k === "blend") continue;
                    addAnim(ch._fmAuto.mapping[k]);
                }
            }
            if (Array.isArray(ch._fmLayers)) {
                for (const L of ch._fmLayers) {
                    if (!L) continue;
                    if (L.suffix && ch._fmState) addAnim(ch._fmState.animId + L.suffix);
                    if (L.anim) addAnim(L.anim);
                }
            }
            // Battle sets assigned to this battler (pre-warm for upcoming battle)
            if (ch._fmBSet && typeof proBsets !== "undefined" && proBsets[ch._fmBSet]) {
                const set = proBsets[ch._fmBSet];
                for (const k in set.states) addAnim(set.states[k]);
            }
        };
        // Player + followers are always nearby
        if (typeof $gamePlayer !== "undefined" && $gamePlayer) {
            collectFor($gamePlayer);
            try {
                const followers = $gamePlayer.followers() ? $gamePlayer.followers()._data : [];
                for (const f of followers) collectFor(f);
            } catch (e) {}
        }
        // Pending restore anims (still to be applied to events)
        if (this._pendingRestore) {
            for (const key in this._pendingRestore) {
                const rec = this._pendingRestore[key];
                if (rec && rec.animId) addAnim(rec.animId);
                if (rec && rec.layers) {
                    for (const L of rec.layers) {
                        if (L.suffix && rec.animId) addAnim(rec.animId + L.suffix);
                        if (L.anim) addAnim(L.anim);
                    }
                }
                if (rec && rec.auto && rec.auto.mapping) {
                    for (const k in rec.auto.mapping) {
                        if (k !== "blend") addAnim(rec.auto.mapping[k]);
                    }
                }
            }
        }
        // Nearby events (proximity cull for large maps)
        if (typeof $gameMap !== "undefined" && $gameMap && typeof $gameMap.events === "function") {
            const events = $gameMap.events();
            const isLarge = $gameMap.width() * $gameMap.height() > 1600;
            const px = (typeof $gamePlayer !== "undefined" && $gamePlayer) ? $gamePlayer.x : 0;
            const py = (typeof $gamePlayer !== "undefined" && $gamePlayer) ? $gamePlayer.y : 0;
            const RADIUS = 26; // tiles, ~ screen + margin
            for (const ev of events) {
                if (!ev) continue;
                if (isLarge) {
                    const dx = Math.abs(ev.x - px);
                    const dy = Math.abs(ev.y - py);
                    if (dx + dy > RADIUS && Math.max(dx, dy) > 18) continue;
                }
                collectFor(ev);
            }
        }
        // Party actors' battle sets (warm for next encounter)
        if (typeof $gameParty !== "undefined" && $gameParty && typeof $gameParty.members === "function") {
            try {
                for (const actor of $gameParty.members()) collectFor(actor);
            } catch (e) {}
        }
        if (toPreload.size === 0) {
            // Nothing anchored yet (e.g., fresh map with no FM): fallback to all for small games
            const total = Object.keys(this._anims).length;
            if (total > 0 && total <= 24) {
                fmLog("Proximity preload: no anchored anims — preloading all " + total + " animations (small game).");
                return this.preloadAll();
            }
            fmLog("Proximity preload: no nearby FM animations to warm.");
            return;
        }
        for (const file of toPreload) this.bitmapFor(file);
        fmLog("Proximity preload:", toPreload.size, "images for nearby characters (LRU", this._bitmapOrder.length + ").");
    } catch (e) {
        fmWarn("preloadNearby failed:", e);
        try { this.preloadAll(); } catch (e2) {}
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
    this._fireFrameEvents(anim.frames[0], ch);
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

/**
 * Independent one-shot action: plays an animation once (loop forced off)
 * without permanently overwriting the auto-pilot. When it finishes it
 * returns to the auto-pilot (if any) or to the native charset sprite.
 * Perfect for cutscene hits, chest openings, emotes on characters that
 * have no permanent profile. The 60-80% smaller .webp frames work the
 * same as PNG — just use "name.webp" filenames.
 */
Game_FrameMaster.prototype.playOnce = function(character, animationId, options) {
    const ch = this.resolveCharacter(character);
    if (!ch) {
        fmWarn("playOnce: unknown character:", character);
        return false;
    }
    const anim = this.getAnimation(animationId);
    if (!anim) {
        fmWarn("playOnce: unknown animation:", animationId);
        return false;
    }
    options = options || {};
    const userCb = options.onComplete;
    const hadAuto = !!(ch._fmAuto && !ch._fmAuto.suspended);
    // Force non-looping, keep blend/speed from caller
    const wrapped = () => {
        try { if (typeof userCb === "function") userCb(); } catch (e) { fmWarn("playOnce onComplete failed:", e); }
        try {
            if (ch._fmAuto) {
                ch._fmAuto.suspended = false;
                // Let the next updateAuto tick pick the right idle/walk.
                // If the one-shot is still the current state and has ended,
                // clear it so auto doesn't have to wait for a switch.
                const st = ch._fmState;
                if (st && st.animId === animationId && !st.playing) {
                    ch._fmState = null;
                    ch._fmNeedsResync = false;
                }
            } else {
                const st = ch._fmState;
                if (st && st.animId === animationId && !st.playing) {
                    ch._fmState = null;
                    ch._fmNeedsResync = true;
                    if (this._callbacks.has(ch)) this._callbacks.delete(ch);
                }
            }
        } catch (e) { fmWarn("playOnce resume failed:", e); }
    };
    const opts = {
        loop: false,
        speed: options.speed,
        blend: options.blend,
        onComplete: wrapped
    };
    const ok = this._startPlayback(ch, anim, opts);
    if (ok && ch._fmAuto) ch._fmAuto.suspended = true;
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
        "walkDown", "walkUp", "walkLeft", "walkRight",
        "walkDownLeft", "walkDownRight", "walkUpLeft", "walkUpRight"];
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
    // Include the exact previous position alongside the mapping so the
    // diagonal vector (real-vs-logical delta) is version-proof and has no
    // alias-timing dependency on _realX/_realY hooking.
    ch._fmAuto = { mapping: clean, suspended: false, _warnedMissing: null, _px: isFinite(ch._x) ? Number(ch._x) : 0, _py: isFinite(ch._y) ? Number(ch._y) : 0 };
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
    // Stateless vector: remaining real-vs-logical deltas catch pixel
    // movement (Altimit/HalfMove/Rosedale) without hook interposition and
    // degrade to Down safely when movers lack the fields.
    try {
        if (typeof ch.isMoving === "function" && ch.isMoving()) {
            const rx = (isFinite(ch._realX) && isFinite(ch._x)) ? Number(ch._realX) - Number(ch._x) : 0;
            const ry = (isFinite(ch._realY) && isFinite(ch._y)) ? Number(ch._realY) - Number(ch._y) : 0;
            if (rx !== 0 || ry !== 0) {
                const x = Number(Math.sign(rx));
                const y = Number(Math.sign(ry));
                if (x < 0 && y > 0) return "DownLeft";
                if (x > 0 && y > 0) return "DownRight";
                if (x < 0 && y < 0) return "UpLeft";
                if (x > 0 && y < 0) return "UpRight";
                if (y > 0) return "Down";
                if (y < 0) return "Up";
                if (x < 0) return "Left";
                if (x > 0) return "Right";
            }
        }
        const d = ch.direction();
        if (d === 1) return "DownLeft";
        if (d === 3) return "DownRight";
        if (d === 7) return "UpLeft";
        if (d === 9) return "UpRight";
        if (d === 2) return "Down";
        if (d === 4) return "Left";
        if (d === 6) return "Right";
        return "Up";
    } catch (e) {
        try {
            const d = ch.direction();
            if (d === 2) return "Down";
            if (d === 4) return "Left";
            if (d === 6) return "Right";
            return "Up";
        } catch (e2) {
            return "Down";
        }
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
    auto._px = isFinite(ch._x) ? Number(ch._x) : (auto._px || 0);
    auto._py = isFinite(ch._y) ? Number(ch._y) : (auto._py || 0);
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
    auto._px = isFinite(ch._x) ? Number(ch._x) : auto._px;
    auto._py = isFinite(ch._y) ? Number(ch._y) : auto._py;
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
            this._fireFrameEvents(anim.frames[next], ch);
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
            this._fireFrameEvents(anim.frames[next], ch);
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
        this._fireFrameEvents(anim.frames[next], ch);
    }
};

// ---- Frame events ----------------------------------------------------------
// owner: the character/battler/picture that reached the frame (used by
// extensions such as PRO script events; ignored by the base runtime).
Game_FrameMaster.prototype._fireFrameEvents = function(frame, owner) {
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
            } else if (ev.type === "script" && typeof this._proRunScript === "function") {
                // PRO-origin frame event (free since v2.0.0 merge).
                try {
                    this._proRunScript(ev, owner);
                } catch (e) {
                    if (typeof console !== "undefined") console.warn("[FrameMaster] Script event failed:", e);
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
    // Characters resolve normally; battlers/pictures (same _fmState shape)
    // fall through to the direct read. Anything else yields null.
    const ch = this.resolveCharacter(character) || character;
    if (!ch || !ch._fmState) return null;
    try {
        return this.frameViewByIndex(ch._fmState.animId, ch._fmState.frameIndex);
    } catch (e) {
        return null;
    }
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
        // Save playback AND/OR auto-pilot AND/OR layers (chars with only
        // layers/auto and no state still need an entry).
        const layers = (ch && Array.isArray(ch._fmLayers) && ch._fmLayers.length) ? ch._fmLayers : null;
        if (!ch || (!ch._fmState && !ch._fmAuto && !layers)) return;
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
        if (layers) {
            entry.layers = layers;
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
        try { this.preloadNearby(); } catch (e) { fmWarn("preload failed:", e); }
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
    ch._fmLayers = this._sanitizeLayers(saved.layers);
    if (!saved.animId) return; // stateless entry: ticks pick the anim up
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
    this._fmLayerSprites = null; // pooled overlay sprites, one per layer
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

// Layer pool: one child sprite per active layer, created lazily and reused.
// Self-contained on purpose (no game lookups) so it can never break sprites.
// Layer pool renderer shared by map characters and battlers: one pooled
// child sprite per active layer. Self-contained on purpose (no game lookups,
// only host-sprite primitives) so it can never break sprites.
function fmPaintLayers(hostSprite, views) {
    try {
        if (!hostSprite || typeof hostSprite.addChild !== "function") return;
        let pool = hostSprite._fmLayerSprites;
        if (!pool) {
            pool = [];
            hostSprite._fmLayerSprites = pool;
        }
        const n = views ? views.length : 0;
        while (pool.length < n) {
            const s = new Sprite();
            s.visible = false;
            hostSprite.addChild(s);
            pool.push(s);
        }
        for (let i = 0; i < pool.length; i++) {
            const s = pool[i];
            if (i < n) {
                const v = views[i];
                s.bitmap = v.bitmap;
                s.setFrame(v.sx, v.sy, v.sw, v.sh);
                s.anchor.x = v.anchorX;
                s.anchor.y = v.anchorY;
                s.x = v.dx || 0;
                s.y = v.dy || 0;
                s.opacity = hostSprite.opacity;
                s.visible = true;
            } else {
                s.visible = false;
                s.bitmap = null;
            }
        }
    } catch (e) { /* layers never break sprites */ }
}

Sprite_Character.prototype.fmSyncLayers = function(views) {
    fmPaintLayers(this, views);
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
        if ($gameFrameMaster) {
            try { $gameFrameMaster.fmDrawLayers(this, ch); } catch (e) {}
        }
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
            if ($gameFrameMaster) {
                try { $gameFrameMaster.fmDrawLayers(this, ch); } catch (e) {}
            }
        }
    } else if (this._fmWasActive) {
        this._fmWasActive = false;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        if ($gameFrameMaster) {
            try { $gameFrameMaster.fmDrawLayers(this, ch); } catch (e) {}
        }
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
            try { $gameFrameMaster.fmDrawLayers(this, ch); } catch (e) {}
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

PluginManager.registerCommand(PLUGIN_NAME, "LayerSet", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("LayerSet: no target character.");
        return;
    }
    const slot = String(args.slot || "").trim();
    if (!/^[A-Za-z0-9_]+$/.test(slot)) {
        fmWarn("LayerSet: slot must be letters, digits or underscore.");
        return;
    }
    const kind = String(args.kind || "suffix");
    const value = String(args.value || "").trim();
    const entry = {
        slot: slot,
        suffix: kind === "anim" ? null : (value || null),
        anim: kind === "anim" ? value : null,
        dx: Math.min(500, Math.max(-500, Math.floor(Number(args.dx) || 0))),
        dy: Math.min(500, Math.max(-500, Math.floor(Number(args.dy) || 0)))
    };
    if (!entry.suffix && !entry.anim) {
        fmWarn("LayerSet: empty value — nothing to set.");
        return;
    }
    const stack = $gameFrameMaster.getLayers(ch).filter(l => l.slot !== slot);
    stack.push(entry);
    $gameFrameMaster.setLayers(ch, stack);
});

PluginManager.registerCommand(PLUGIN_NAME, "LayerClear", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("LayerClear: no target character.");
        return;
    }
    const slot = String(args.slot || "").trim();
    $gameFrameMaster.clearLayers(ch, slot || undefined);
});

PluginManager.registerCommand(PLUGIN_NAME, "PlayOnce", function(args) {
    if (!$gameFrameMaster) return;
    const ch = fmResolveCommandTarget(args, this);
    if (!ch) {
        fmWarn("PlayOnce: no target character.");
        return;
    }
    $gameFrameMaster.playOnce(ch, String(args.animation || "").trim(), {
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
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
        walkDownLeft: String(args.walkDownLeft || "").trim(),
        walkDownRight: String(args.walkDownRight || "").trim(),
        walkUpLeft: String(args.walkUpLeft || "").trim(),
        walkUpRight: String(args.walkUpRight || "").trim(),
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
// 9. Battlers & pictures (free since the v2.0.0 merge — Godot-style visual
//    freedom everywhere: map, battle, screen)
// ----------------------------------------------------------------------------
// Battlers (actors + enemies, side-view and front-view): hit-flash, damage
// popups, states and collapse keep working on top of FM frames. The actor's
// weapon sprite hides while FM drives it and returns with the next motion.
// Pictures: position/scale/rotation/opacity/tone kept, image replaced.
// Blends crossfade FM -> FM; native -> FM is a hard cut (LITE-wide rule).
// ============================================================================

function proWarn(...args) {
    if (typeof console !== "undefined") console.warn("[FrameMaster]", ...args);
}

const SCRIPT_MAX_LENGTH = 5000;

// ---- Resolution helpers ----

function proResolveBattler(ref) {
    try {
        if (ref && (typeof ref === "object" || typeof ref === "function")) {
            if (typeof Game_Battler === "undefined" || (ref instanceof Game_Battler)) return ref;
            if (typeof Game_Picture !== "undefined" && (ref instanceof Game_Picture)) return ref;
            return ref;
        }
        if (!ref && ref !== 0) return null;
        if (typeof ref === "string") {
            const m = ref.trim().toLowerCase().match(/^(actor|enemy)[:\s]+(\d+)$/);
            if (m) {
                const n = Number(m[2]);
                if (m[1] === "actor" && typeof $gameActors !== "undefined" && $gameActors) {
                    return $gameActors.actor(n) || null;
                }
                if (m[1] === "enemy" && typeof $gameTroop !== "undefined" && $gameTroop) {
                    const members = $gameTroop.members();
                    return (n >= 0 && n < members.length) ? members[n] : null;
                }
            }
        }
    } catch (e) {
        proWarn("resolveBattler failed:", e);
    }
    return null;
}

function proResolvePicture(ref) {
    try {
        if (typeof Game_Picture !== "undefined" && ref instanceof Game_Picture) {
            return ref;
        }
        const id = Math.floor(Number(ref));
        if (id >= 1 && id <= 100 && typeof $gameScreen !== "undefined" && $gameScreen) {
            return $gameScreen.picture(id);
        }
    } catch (e) {
        proWarn("resolvePicture failed:", e);
    }
    return null;
}

function proApi() {
    try {
        const g = (typeof window !== "undefined") ? window.$gameFrameMaster : null;
        if (!g) return null;
        return g;
    } catch (e) {
        return null;
    }
}

// ---- Battlers ----

Game_FrameMaster.prototype.playBattler = function(battler, animationId, options) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn('playBattler: unknown battler. Use $gameActors.actor(n), $gameTroop.members()[i], "actor:1" or "enemy:0".');
        return false;
    }
    const anim = api.getAnimation(animationId);
    if (!anim) {
        proWarn("playBattler: unknown animation:", animationId);
        return false;
    }
    // _startPlayback snapshots the previous FM display via frameView
    // (which understands battlers); native -> FM starts with a hard cut.
    return api._startPlayback(b, anim, options || {});
};

Game_FrameMaster.prototype.stopBattler = function(battler) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("stopBattler: unknown battler.");
        return false;
    }
    if (api._callbacks && api._callbacks.has(b)) api._callbacks.delete(b);
    if (b._fmState) {
        b._fmState = null;
        b._fmNeedsResync = true; // force sprite back to the native battler image
    }
    return true;
};

Game_FrameMaster.prototype.transitionBattler = function(battler, newAnimationId, blendDuration) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("transitionBattler: unknown battler.");
        return false;
    }
    const prevLoop = b._fmState ? b._fmState.loopOverride : null;
    const prevSpeed = b._fmState ? b._fmState.speedMul : 1.0;
    const ok = api.playBattler(b, newAnimationId, {
        blend: (blendDuration !== undefined && blendDuration !== null) ? blendDuration : undefined
    });
    if (ok && b._fmState) {
        if (prevLoop !== null) b._fmState.loopOverride = prevLoop;
        b._fmState.speedMul = prevSpeed;
    }
    return ok;
};

Game_FrameMaster.prototype.getBattlerFrame = function(battler) {
    const b = proResolveBattler(battler);
    return (b && b._fmState) ? b._fmState.frameIndex : -1;
};

Game_FrameMaster.prototype.isBattlerPlaying = function(battler) {
    const b = proResolveBattler(battler);
    return !!(b && b._fmState && b._fmState.playing);
};

Game_FrameMaster.prototype.getBattlerAnimation = function(battler) {
    const b = proResolveBattler(battler);
    return (b && b._fmState) ? b._fmState.animId : null;
};

Game_FrameMaster.prototype.playBattlerOnce = function(battler, animationId, options) {
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("playBattlerOnce: unknown battler.");
        return false;
    }
    const api = proApi();
    if (!api) return false;
    const anim = api.getAnimation(animationId);
    if (!anim) {
        proWarn("playBattlerOnce: unknown animation:", animationId);
        return false;
    }
    options = options || {};
    const userCb = options.onComplete;
    const wrapped = () => {
        try { if (typeof userCb === "function") userCb(); } catch (e) { proWarn("playBattlerOnce onComplete failed:", e); }
        try {
            const st = b._fmState;
            if (st && st.animId === animationId && !st.playing) {
                b._fmState = null;
                b._fmNeedsResync = true;
                if (api._callbacks && api._callbacks.has(b)) api._callbacks.delete(b);
            }
        } catch (e) {}
    };
    return api._startPlayback(b, anim, { loop: false, speed: options.speed, blend: options.blend, onComplete: wrapped });
};

// ---- Pictures ----

Game_FrameMaster.prototype.playPicture = function(picture, animationId, options) {
    const api = proApi();
    if (!api) return false;
    const p = proResolvePicture(picture);
    if (!p) {
        proWarn("playPicture: unknown picture. Show it first (Show Picture id 1-100).");
        return false;
    }
    const anim = api.getAnimation(animationId);
    if (!anim) {
        proWarn("playPicture: unknown animation:", animationId);
        return false;
    }
    return api._startPlayback(p, anim, options || {});
};

Game_FrameMaster.prototype.stopPicture = function(picture) {
    const api = proApi();
    if (!api) return false;
    const p = proResolvePicture(picture);
    if (!p) {
        proWarn("stopPicture: unknown picture.");
        return false;
    }
    if (api._callbacks && api._callbacks.has(p)) api._callbacks.delete(p);
    if (p._fmState) {
        p._fmState = null;
        p._fmNeedsResync = true; // force sprite back to the picture's own image
    }
    return true;
};

Game_FrameMaster.prototype.playPictureOnce = function(picture, animationId, options) {
    const p = proResolvePicture(picture);
    if (!p) {
        proWarn("playPictureOnce: unknown picture.");
        return false;
    }
    const api = proApi();
    if (!api) return false;
    const anim = api.getAnimation(animationId);
    if (!anim) {
        proWarn("playPictureOnce: unknown animation:", animationId);
        return false;
    }
    options = options || {};
    const userCb = options.onComplete;
    const wrapped = () => {
        try { if (typeof userCb === "function") userCb(); } catch (e) { proWarn("playPictureOnce onComplete failed:", e); }
        try {
            const st = p._fmState;
            if (st && st.animId === animationId && !st.playing) {
                p._fmState = null;
                p._fmNeedsResync = true;
                if (api._callbacks && api._callbacks.has(p)) api._callbacks.delete(p);
            }
        } catch (e) {}
    };
    return api._startPlayback(p, anim, { loop: false, speed: options.speed, blend: options.blend, onComplete: wrapped });
};

Game_FrameMaster.prototype.transitionPicture = function(picture, newAnimationId, blendDuration) {
    const api = proApi();
    if (!api) return false;
    const p = proResolvePicture(picture);
    if (!p) {
        proWarn("transitionPicture: unknown picture.");
        return false;
    }
    const prevSpeed = p._fmState ? p._fmState.speedMul : 1.0;
    const ok = api.playPicture(p, newAnimationId, {
        blend: (blendDuration !== undefined && blendDuration !== null) ? blendDuration : undefined
    });
    if (ok && p._fmState) p._fmState.speedMul = prevSpeed;
    return ok;
};

Game_FrameMaster.prototype.getPictureFrame = function(picture) {
    const p = proResolvePicture(picture);
    return (p && p._fmState) ? p._fmState.frameIndex : -1;
};

Game_FrameMaster.prototype.isPicturePlaying = function(picture) {
    const p = proResolvePicture(picture);
    return !!(p && p._fmState && p._fmState.playing);
};

Game_FrameMaster.prototype.getPictureAnimation = function(picture) {
    const p = proResolvePicture(picture);
    return (p && p._fmState) ? p._fmState.animId : null;
};

// ---- Shared view helper: current FM display of ANY owner -------------
// (battlers and pictures carry the same _fmState shape as characters).

Game_FrameMaster.prototype.__proView = function(owner) {
    if (!owner || !owner._fmState) return null;
    try {
        return this.frameViewByIndex(owner._fmState.animId, owner._fmState.frameIndex);
    } catch (e) {
        return null;
    }
};

// ---- Script frame-events (free since v2.0.0; executed from _fireFrameEvents) ----

Game_FrameMaster.prototype._proRunScript = function(ev, owner) {
    const code = ev && typeof ev.code === "string" ? ev.code : "";
    if (!code.trim()) return;
    if (code.length > SCRIPT_MAX_LENGTH) {
        proWarn("Script event too long (" + code.length + " chars, max " + SCRIPT_MAX_LENGTH + ") — skipped. Heavy logic belongs in plugins.");
        return;
    }
    try {
        const fn = new Function(
            "$gameVariables", "$gameSwitches", "$gameSelfSwitches",
            "$gameActors", "$gameParty", "$gameTroop", "$gameMap",
            "$gamePlayer", "$gameScreen", "$gameTemp", "$gameMessage",
            "owner", "fm",
            '"use strict";\n' + code
        );
        fn.call(this,
            (typeof $gameVariables !== "undefined") ? $gameVariables : undefined,
            (typeof $gameSwitches !== "undefined") ? $gameSwitches : undefined,
            (typeof $gameSelfSwitches !== "undefined") ? $gameSelfSwitches : undefined,
            (typeof $gameActors !== "undefined") ? $gameActors : undefined,
            (typeof $gameParty !== "undefined") ? $gameParty : undefined,
            (typeof $gameTroop !== "undefined") ? $gameTroop : undefined,
            (typeof $gameMap !== "undefined") ? $gameMap : undefined,
            (typeof $gamePlayer !== "undefined") ? $gamePlayer : undefined,
            (typeof $gameScreen !== "undefined") ? $gameScreen : undefined,
            (typeof $gameTemp !== "undefined") ? $gameTemp : undefined,
            (typeof $gameMessage !== "undefined") ? $gameMessage : undefined,
            owner || null,
            (typeof window !== "undefined" && window.$gameFrameMaster) ? window.$gameFrameMaster : null
        );
    } catch (e) {
        proWarn("Script event failed (game continues):", String((e && e.message) || e));
    }
};

// ---- Crossfade overlay helper (FM -> FM blends on battler/picture sprites) ----

function proBlendConsume(owner, hostSprite, targetSprite) {
    try {
        const from = owner ? owner._fmBlendFrom : null;
        const ms = Math.max(0, Number(owner && owner._fmBlendMs) || 0);
        if (owner) {
            owner._fmBlendFrom = null;
            owner._fmBlendMs = 0;
        }
        if (!from || !from.bitmap) return;
        if (ms <= 0 || !hostSprite || !targetSprite) return;
        let overlay = hostSprite._fmProBlend;
        if (!overlay) {
            overlay = new Sprite();
            hostSprite.addChild(overlay);
            hostSprite._fmProBlend = overlay;
        }
        overlay.bitmap = from.bitmap;
        overlay.setFrame(from.sx, from.sy, from.sw, from.sh);
        overlay.anchor.x = targetSprite.anchor.x;
        overlay.anchor.y = targetSprite.anchor.y;
        overlay.x = 0;
        overlay.y = 0;
        overlay.opacity = 255;
        overlay.visible = true;
        hostSprite._fmProBlendT = 0;
        hostSprite._fmProBlendDur = Math.max(1, ms);
    } catch (e) {
        proWarn("Blend start failed:", e);
    }
}

function proBlendFade(hostSprite) {
    try {
        const overlay = hostSprite ? hostSprite._fmProBlend : null;
        if (!overlay || !overlay.visible) return;
        hostSprite._fmProBlendT = (hostSprite._fmProBlendT || 0) + 1000 / 60;
        const t = Math.min(1, hostSprite._fmProBlendT / (hostSprite._fmProBlendDur || 1));
        overlay.opacity = Math.round(255 * (1 - t));
        if (t >= 1) {
            overlay.visible = false;
            overlay.bitmap = null;
        }
    } catch (e) {
        proWarn("Blend fade failed:", e);
    }
}

// Owner tick shared by battler/picture sprites: advance FM state (the
// updater skips auto-pilot automatically — battlers/pictures never carry it)
// and drive the blend overlay.
function proTickOwner(owner, hostSprite, targetSprite) {
    try {
        const api = proApi();
        if (!api || !owner) return;
        api.updateCharacter(owner);
        proBlendConsume(owner, hostSprite, targetSprite);
        proBlendFade(hostSprite);
        proWatchdog(owner);
    } catch (e) {
        proWarn("Owner tick failed:", e);
    }
}

// Current FM view or null/"pending" for sprite hooks.
function proOwnerView(owner) {
    try {
        const api = proApi();
        if (!api || !owner || !owner._fmState) return null;
        return api.__proView(owner);
    } catch (e) {
        return null;
    }
}

// ---- Sprite hooks — enemies (draw on the sprite itself) ----

// Paint (or hide, when the owner has no FM state) the layer pool of a
// battler sprite host: the sprite itself for enemies, _mainSprite for actors.
function proPaintBattlerLayers(owner, hostSprite) {
    try {
        const api = proApi();
        if (!api || !hostSprite) return;
        api.fmDrawLayersFor(hostSprite, owner);
    } catch (e) { /* layers never break battles */ }
}

const _PRO_Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function() {
    _PRO_Sprite_Enemy_update.call(this, ...arguments);
    if (this._enemy) proTickOwner(this._enemy, this, this);
};

const _PRO_Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
Sprite_Enemy.prototype.updateBitmap = function() {
    const b = this._enemy;
    if (b && b._fmNeedsResync) {
        // Force the native path to reload the battler image.
        b._fmNeedsResync = false;
        this._battlerName = "\0fm-resync";
        try { proPaintBattlerLayers(b, this); } catch (e) {}
    }
    if (b && b._fmState) {
        const view = proOwnerView(b);
        if (view && view.pending) return; // image loading: keep last shown
        if (view && view.bitmap) {
            this._battlerName = "\0fm:" + b._fmState.animId;
            this.bitmap = view.bitmap;
            return;
        }
        // Animation vanished (deleted file): fall through to native once.
        if (this._battlerName && String(this._battlerName).indexOf("\0fm:") === 0) {
            this._battlerName = "\0fm-missing";
            try { proPaintBattlerLayers(b, this); } catch (e) {}
        }
    }
    _PRO_Sprite_Enemy_updateBitmap.call(this);
};

const _PRO_Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
    const b = this._enemy;
    if (b && b._fmState) {
        const view = proOwnerView(b);
        if (view && view.bitmap) {
            // FM wins over collapse framing; hit-flash/opacity still apply.
            this.setFrame(view.sx, view.sy, view.sw, view.sh);
            try { proPaintBattlerLayers(b, this); } catch (e) {}
            return;
        }
        if (view && view.pending) return;
    }
    _PRO_Sprite_Enemy_updateFrame.call(this);
};

// ---- Sprite hooks — actors (draw on the _mainSprite child; weapon hides) ----

const _PRO_Sprite_Actor_update = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function() {
    _PRO_Sprite_Actor_update.call(this, ...arguments);
    if (this._actor && this._mainSprite) proTickOwner(this._actor, this._mainSprite, this._mainSprite);
};

const _PRO_Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function() {
    const a = this._actor;
    if (a && a._fmNeedsResync) {
        a._fmNeedsResync = false;
        this._battlerName = "\0fm-resync";
        if (this._mainSprite) {
            try { proPaintBattlerLayers(a, this._mainSprite); } catch (e) {}
        }
    }
    if (a && a._fmState && this._mainSprite) {
        const view = proOwnerView(a);
        if (view && view.pending) return;
        if (view && view.bitmap) {
            this._battlerName = "\0fm:" + a._fmState.animId;
            this._mainSprite.bitmap = view.bitmap;
            return;
        }
        if (this._battlerName && String(this._battlerName).indexOf("\0fm:") === 0) {
            this._battlerName = "\0fm-missing";
            if (this._mainSprite) {
                try { proPaintBattlerLayers(a, this._mainSprite); } catch (e) {}
            }
        }
    }
    _PRO_Sprite_Actor_updateBitmap.call(this);
};

const _PRO_Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
Sprite_Actor.prototype.updateFrame = function() {
    const a = this._actor;
    if (a && a._fmState && this._mainSprite) {
        const view = proOwnerView(a);
        if (view && view.bitmap) {
            this._mainSprite.setFrame(view.sx, view.sy, view.sw, view.sh);
            this.setFrame(0, 0, view.sw, view.sh);
            // A custom full-body take replaces attack motions: park the weapon
            // (native setup() shows it again on the next weapon motion).
            if (this._weaponSprite) this._weaponSprite.visible = false;
            try { proPaintBattlerLayers(a, this._mainSprite); } catch (e) {}
            return;
        }
        if (view && view.pending) return;
    }
    _PRO_Sprite_Actor_updateFrame.call(this);
};

// ---- Sprite hooks — pictures (bitmap swap + frame crop, transforms kept) ----

const _PRO_Sprite_Picture_update = Sprite_Picture.prototype.update;
Sprite_Picture.prototype.update = function() {
    _PRO_Sprite_Picture_update.call(this, ...arguments);
    try {
        const picture = this.picture();
        if (picture) {
            proTickOwner(picture, this, this);
            if (picture._fmState) {
                const view = proOwnerView(picture);
                if (view && view.bitmap) {
                    this.setFrame(view.sx, view.sy, view.sw, view.sh);
                }
            }
        }
    } catch (e) {
        proWarn("Picture tick failed:", e);
    }
};

const _PRO_Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
    const picture = (typeof this.picture === "function") ? this.picture() : null;
    if (picture && picture._fmNeedsResync) {
        picture._fmNeedsResync = false;
        this._pictureName = "\0fm-resync";
    }
    if (picture && picture._fmState) {
        const view = proOwnerView(picture);
        if (view && view.pending) {
            this.visible = true;
            return;
        }
        if (view && view.bitmap) {
            this._pictureName = "\0fm:" + picture._fmState.animId;
            this.bitmap = view.bitmap;
            this.visible = true;
            return;
        }
        if (this._pictureName && String(this._pictureName).indexOf("\0fm:") === 0) {
            this._pictureName = "\0fm-missing";
        }
    }
    _PRO_Sprite_Picture_updateBitmap.call(this);
};

// ============================================================================
// 10. Battle Director — Godot-style battle state machine, zero code in game
// ----------------------------------------------------------------------------
// A Battle Set maps battle MOMENTS to animation ids:
//
//   idle / appear / attack1 / attack2 / attack3 / skill / item / defend /
//   hit / evade / die / victory                                   (+ phases)
//
// Assign a set once (Troop Event at battle start, or an Autorun for actors)
// and the director drives everything: action start -> attack cycle,
// damage -> hit (or phase swap), evasion -> evade, collapse -> die,
// victory -> victory, battle start -> appear -> idle. One-shots always
// return to idle; unmapped moments keep native behavior (SV motions…).
// ============================================================================

const PRO_BSET_STATES = ["idle", "appear",
    "attack1", "attack2", "attack3", "skill", "item", "defend",
    "hit", "evade", "die", "victory"];
const PRO_BSET_FOLDER = "data/framemaster/";
const PRO_BSET_REGISTRY = "FM_BattleSets.json";

let proBsets = {};
let proBsetsReady = false;
let proBsetsPending = 0;

function proBsetLoadJson(url, onOk, onFail) {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => {
            if (xhr.status < 400) {
                try { onOk(JSON.parse(xhr.responseText)); }
                catch (e) { onFail(e); }
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

function proSanitizeBattleSet(raw) {
    if (!raw || typeof raw !== "object") return null;
    const id = String(raw.id || "").trim();
    if (!/^[A-Za-z0-9_]+$/.test(id)) return null;
    const src = (raw.states && typeof raw.states === "object") ? raw.states : {};
    const states = {};
    for (const k of PRO_BSET_STATES) {
        states[k] = (typeof src[k] === "string") ? src[k].trim() : "";
    }
    const pick = String(raw.attackPick || "cycle").toLowerCase();
    const phases = Array.isArray(raw.phases) ? raw.phases.map(p => {
        if (!p || typeof p !== "object") return null;
        const set = String(p.set || "").trim();
        const rawHp = Math.floor(Number(p.hpBelow));
        if (!set || !isFinite(rawHp) || rawHp <= 0) return null;
        return { hpBelow: Math.min(99, rawHp), set: set };
    }).filter(Boolean) : [];
    return {
        id: id,
        name: String(raw.name || id),
        attackPick: (pick === "random" || pick === "first") ? pick : "cycle",
        states: states,
        phases: phases
    };
}

function proFinishBattleLoad() {
    proBsetsReady = true;
    proBsetsPending = 0;
}

function proLoadBattleFile(file) {
    proBsetLoadJson(PRO_BSET_FOLDER + file,
        raw => {
            try {
                const set = proSanitizeBattleSet(raw);
                if (set) proBsets[set.id] = set;
            } catch (e) { proWarn("Bad battle set file:", file); }
            proBsetsPending--;
            if (proBsetsPending <= 0) proFinishBattleLoad();
        },
        () => {
            proBsetsPending--;
            if (proBsetsPending <= 0) proFinishBattleLoad();
        });
}

function proLoadBattleSets() {
    proBsetLoadJson(PRO_BSET_FOLDER + PRO_BSET_REGISTRY,
        data => {
            let entries = [];
            if (Array.isArray(data)) entries = data;
            else if (data && Array.isArray(data.sets)) entries = data.sets;
            const files = [];
            for (const e of entries) {
                if (e && typeof e.file === "string" && e.file) {
                    files.push(String(e.file).replace(/^.*[\\/]/, ""));
                }
            }
            if (!files.length) { proFinishBattleLoad(); return; }
            proBsetsPending = files.length;
            for (const f of files) proLoadBattleFile(f);
        },
        () => {
            // No battle sets authored: fine, director stays dormant.
            proBsets = {};
            proFinishBattleLoad();
        });
}

function proBattleSetsReady() {
    return proBsetsReady && proBsetsPending <= 0;
}

const _FM2_DataManager_loadDatabase = DataManager.loadDatabase;
DataManager.loadDatabase = function() {
    _FM2_DataManager_loadDatabase.call(this);
    try { proLoadBattleSets(); } catch (e) { proWarn("Battle registry load failed:", e); }
};

const _FM2_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    return _FM2_Scene_Boot_isReady.call(this) && proBattleSetsReady();
};

// ---- Set assignment ----------------------------------------------------

Game_FrameMaster.prototype.assignBattleSet = function(battler, setId, opts) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("assignBattleSet: unknown battler.");
        return false;
    }
    const id = String(setId || "").trim();
    if (!id || !proBsets[id]) {
        proWarn('assignBattleSet: unknown battle set "' + setId + '". Check FM_BattleSets.json.');
        return false;
    }
    b._fmBSet = id;
    b._fmBAtk = 0;
    if (!opts || opts.enter !== false) proBattleEnter(b);
    return true;
};

Game_FrameMaster.prototype.clearBattleSet = function(battler) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("clearBattleSet: unknown battler.");
        return false;
    }
    b._fmBSet = null;
    b._fmBAtk = 0;
    return api.stopBattler(b);
};

Game_FrameMaster.prototype.getBattlerSet = function(battler) {
    const b = proResolveBattler(battler);
    return (b && b._fmBSet) || null;
};

Game_FrameMaster.prototype.listBattleSets = function() {
    return Object.values(proBsets).map(s => ({ id: s.id, name: s.name }));
};

// ---- Director core -----------------------------------------------------

function proSetOf(battler) {
    try {
        const id = battler && battler._fmBSet;
        if (!id || !proBsets[id]) return null;
        return proBsets[id];
    } catch (e) {
        return null;
    }
}

function proIsDead(battler) {
    try {
        return typeof battler.isDead === "function" && !!battler.isDead();
    } catch (e) {
        return false;
    }
}

function proPlayIdle(battler, blend) {
    const api = proApi();
    if (!api || !battler) return false;
    const set = proSetOf(battler);
    const idle = set && set.states.idle;
    if (!idle) return false;
    if (api.getBattlerAnimation(battler) === idle && api.isBattlerPlaying(battler)) {
        return true; // already there: never restart, never churn
    }
    return api.playBattler(battler, idle, { blend: blend });
}

// One-shot state (-> idle, or release on death). Powers appear, attacks,
// skills, items, hits, evades and dies with a single code path.
function proOneShot(battler, animId, opts) {
    const api = proApi();
    if (!api || !battler || !animId) return false;
    opts = opts || {};
    return api.playBattler(battler, animId, {
        loop: false,
        speed: opts.speed,
        blend: opts.blend,
        onComplete: function() {
            try {
                const set = proSetOf(battler);
                if (!set) return;
                if (proIsDead(battler)) {
                    api.stopBattler(battler);
                    return;
                }
                proPlayIdle(battler, opts.blend);
            } catch (e) { /* never break the battle flow */ }
        }
    });
}

// Manual trigger of ANY named state (scripters' escape hatch for custom
// moments). Looping states (idle/defend/victory) hold; the rest one-shot.
Game_FrameMaster.prototype.playBattlerState = function(battler, stateName, opts) {
    const api = proApi();
    if (!api) return false;
    const b = proResolveBattler(battler);
    if (!b) {
        proWarn("playBattlerState: unknown battler.");
        return false;
    }
    const set = proSetOf(b);
    const key = String(stateName || "").trim();
    const anim = (set && set.states[key]) || null;
    if (!anim) return false;
    opts = opts || {};
    if (key === "idle" || key === "defend" || key === "victory") {
        return api.playBattler(b, anim, { speed: opts.speed, blend: opts.blend });
    }
    return proOneShot(b, anim, opts);
};

function proPickAttack(battler, set) {
    const cands = ["attack1", "attack2", "attack3"]
        .map(k => set.states[k]).filter(Boolean);
    if (!cands.length) return null;
    const mode = set.attackPick || "cycle";
    if (mode === "random") return cands[Math.floor(Math.random() * cands.length)];
    if (mode === "first") return cands[0];
    const i = (Math.floor(Number(battler._fmBAtk) || 0)) % cands.length;
    battler._fmBAtk = i + 1;
    return cands[i];
}

// Battle entry: appear once (-> idle chain) or straight to idle.
function proBattleEnter(battler) {
    const set = proSetOf(battler);
    if (!set) return false;
    if (set.states.appear) return proOneShot(battler, set.states.appear, {});
    return proPlayIdle(battler);
}

// Phase swap on HP thresholds (deepest match wins). Silent idle swap.
function proCheckPhases(battler) {
    try {
        const cur = battler && battler._fmBSet;
        const set = cur && proBsets[cur];
        if (!set || !set.phases || !set.phases.length) return;
        if (proIsDead(battler)) return;
        let rate = 1;
        try { rate = Number(battler.hpRate()); } catch (e) { return; }
        if (!isFinite(rate)) return;
        let best = null;
        for (const ph of set.phases) {
            if (!ph || !ph.set || !proBsets[ph.set]) continue;
            if (rate * 100 < ph.hpBelow && (!best || ph.hpBelow < best.hpBelow)) {
                best = ph;
            }
        }
        if (best && best.set !== cur) {
            battler._fmBSet = best.set;
            battler._fmBAtk = 0;
            proPlayIdle(battler);
        }
    } catch (e) { /* phases never break battles */ }
}

// Safety net: a finished one-shot with no callback left (e.g. battle save
// loaded mid-animation) resumes idle instead of freezing on a frame.
function proWatchdog(battler) {
    try {
        if (typeof Game_Battler === "undefined" || !(battler instanceof Game_Battler)) return;
        const st = battler._fmState;
        if (!st || st.playing) return;
        if (proIsDead(battler)) return;
        const set = proSetOf(battler);
        const idle = set && set.states.idle;
        if (!idle || st.animId === idle) return;
        proPlayIdle(battler);
    } catch (e) { /* watchdog never breaks battles */ }
}

// ---- Battle hooks (base class: Actor + Enemy overrides chain to it) ----

const _FM2_performActionStart = Game_Battler.prototype.performActionStart;
Game_Battler.prototype.performActionStart = function(action) {
    _FM2_performActionStart.call(this, action);
    try {
        const set = proSetOf(this);
        if (!set || !action) return;
        if (typeof action.isGuard === "function" && action.isGuard()) {
            if (set.states.defend) proPlayIdleDefend(this, set);
            return;
        }
        let anim = null;
        try {
            if (typeof action.isAttack === "function" && action.isAttack()) {
                anim = proPickAttack(this, set);
            } else if (typeof action.isSkill === "function" && action.isSkill()) {
                anim = set.states.skill || null;
            } else if (typeof action.isItem === "function" && action.isItem()) {
                anim = set.states.item || null;
            }
        } catch (e) { anim = null; }
        if (anim) proOneShot(this, anim, {});
    } catch (e) {
        proWarn("Director action hook failed:", e);
    }
};

function proPlayIdleDefend(battler, set) {
    const api = proApi();
    if (!api) return false;
    // Defend is a stance: loop until the next trigger replaces it.
    if (api.getBattlerAnimation(battler) === set.states.defend && api.isBattlerPlaying(battler)) {
        return true;
    }
    return api.playBattler(battler, set.states.defend, {});
}

const _FM2_performDamage = Game_Battler.prototype.performDamage;
Game_Battler.prototype.performDamage = function() {
    _FM2_performDamage.call(this);
    try {
        const set = proSetOf(this);
        if (!set) return;
        proCheckPhases(this); // HP already updated: swap set first…
        const fresh = proSetOf(this); // …then react with the (maybe new) set
        if (!fresh || proIsDead(this)) return; // collapse hook owns death
        if (fresh.states.hit) proOneShot(this, fresh.states.hit, {});
    } catch (e) {
        proWarn("Director damage hook failed:", e);
    }
};

const _FM2_performEvasion = Game_Battler.prototype.performEvasion;
Game_Battler.prototype.performEvasion = function() {
    _FM2_performEvasion.call(this);
    try {
        const set = proSetOf(this);
        if (set && set.states.evade && !proIsDead(this)) proOneShot(this, set.states.evade, {});
    } catch (e) {
        proWarn("Director evasion hook failed:", e);
    }
};

const _FM2_performMagicEvasion = Game_Battler.prototype.performMagicEvasion;
Game_Battler.prototype.performMagicEvasion = function() {
    _FM2_performMagicEvasion.call(this);
    try {
        const set = proSetOf(this);
        if (set && set.states.evade && !proIsDead(this)) proOneShot(this, set.states.evade, {});
    } catch (e) {
        proWarn("Director evasion hook failed:", e);
    }
};

const _FM2_performCollapse = Game_Battler.prototype.performCollapse;
Game_Battler.prototype.performCollapse = function() {
    _FM2_performCollapse.call(this);
    try {
        const set = proSetOf(this);
        if (set && set.states.die) proOneShot(this, set.states.die, {});
    } catch (e) {
        proWarn("Director collapse hook failed:", e);
    }
};

const _FM2_Game_Actor_performVictory = Game_Actor.prototype.performVictory;
Game_Actor.prototype.performVictory = function() {
    _FM2_Game_Actor_performVictory.call(this);
    try {
        const set = proSetOf(this);
        if (set && set.states.victory) {
            const api = proApi();
            if (api) api.playBattler(this, set.states.victory, {});
        }
    } catch (e) {
        proWarn("Director victory hook failed:", e);
    }
};

// Battle start: wipe map-bred playback (fresh battle visuals), keep the
// assignments, then run every set's entry (appear -> idle, or idle).
const _FM2_BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    _FM2_BattleManager_startBattle.call(this);
    try {
        const sweep = [];
        try {
            if (typeof $gameParty !== "undefined" && $gameParty) {
                sweep.push(...$gameParty.members());
            }
        } catch (e) {}
        try {
            if (typeof $gameTroop !== "undefined" && $gameTroop) {
                sweep.push(...$gameTroop.members());
            }
        } catch (e) {}
        for (const b of sweep) {
            if (!b) continue;
            if (b._fmState) {
                b._fmState = null;
                b._fmNeedsResync = true;
            }
            proBattleEnter(b);
        }
    } catch (e) {
        proWarn("Director battle-start sweep failed:", e);
    }
};

// ---- Plugin commands (dual namespace: new "FrameMaster" + legacy
// "FrameMasterPRO" so existing events keep working after the v2.0.0 merge) ----

function proCommandBattler(args, interpreter) {
    const side = String(args.side || "enemy");
    const id = Math.floor(Number(args.id) || 0);
    if (side === "actor" && typeof $gameActors !== "undefined" && $gameActors) {
        return $gameActors.actor(id);
    }
    if (typeof $gameTroop !== "undefined" && $gameTroop) {
        const members = $gameTroop.members();
        return (id >= 0 && id < members.length) ? members[id] : null;
    }
    // "this" is the interpreter: only meaningful for pictures, not battlers.
    void interpreter;
    return null;
}

function proCmdPlayBattler(args) {
    const api = proApi();
    if (!api) return;
    const b = proCommandBattler(args, this);
    if (!b) {
        proWarn("PlayBattler: battler not found (side=" + args.side + " id=" + args.id + "). Enemies use 0-based troop order.");
        return;
    }
    api.playBattler(b, String(args.animation || "").trim(), {
        loop: String(args.loop || "default") === "true" ? true : String(args.loop) === "false" ? false : undefined,
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
}

function proCmdStopBattler(args) {
    const api = proApi();
    if (!api) return;
    const b = proCommandBattler(args, this);
    if (b) api.stopBattler(b);
}

function proCmdPlayPicture(args) {
    const api = proApi();
    if (!api) return;
    const id = Math.floor(Number(args.pictureId) || 0);
    if (!(id >= 1 && id <= 100)) {
        proWarn("PlayPicture: picture id must be 1-100.");
        return;
    }
    api.playPicture(id, String(args.animation || "").trim(), {
        loop: String(args.loop || "default") === "true" ? true : String(args.loop) === "false" ? false : undefined,
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
}

function proCmdStopPicture(args) {
    const api = proApi();
    if (!api) return;
    const id = Math.floor(Number(args.pictureId) || 0);
    if (id >= 1 && id <= 100) api.stopPicture(id);
}

function proCmdBattleSetup(args) {
    const api = proApi();
    if (!api) return;
    const scope = String(args.scope || "enemy");
    const id = Math.floor(Number(args.id) || 0);
    const setId = String(args.set || "").trim();
    const targets = [];
    try {
        if ((scope === "enemy" || scope === "allEnemies") && typeof $gameTroop !== "undefined" && $gameTroop) {
            const members = $gameTroop.members();
            if (scope === "enemy") {
                if (id >= 0 && id < members.length) targets.push(members[id]);
            } else {
                targets.push(...members);
            }
        }
        if ((scope === "actor" || scope === "allActors") && typeof $gameParty !== "undefined" && $gameParty) {
            if (scope === "actor" && typeof $gameActors !== "undefined" && $gameActors) {
                const a = $gameActors.actor(id);
                if (a) targets.push(a);
            } else {
                targets.push(...$gameParty.members());
            }
        }
    } catch (e) {
        proWarn("BattleSetup resolve failed:", e);
    }
    if (!targets.length) {
        proWarn("BattleSetup: no battlers matched (scope=" + scope + " id=" + id + ").");
        return;
    }
    for (const b of targets) {
        if (!setId) api.clearBattleSet(b);
        else api.assignBattleSet(b, setId);
    }
}

PluginManager.registerCommand(PLUGIN_NAME, "PlayBattler", proCmdPlayBattler);
PluginManager.registerCommand("FrameMasterPRO", "PlayBattler", proCmdPlayBattler);
PluginManager.registerCommand(PLUGIN_NAME, "StopBattler", proCmdStopBattler);
PluginManager.registerCommand("FrameMasterPRO", "StopBattler", proCmdStopBattler);
PluginManager.registerCommand(PLUGIN_NAME, "PlayPicture", proCmdPlayPicture);
PluginManager.registerCommand("FrameMasterPRO", "PlayPicture", proCmdPlayPicture);
PluginManager.registerCommand(PLUGIN_NAME, "StopPicture", proCmdStopPicture);
PluginManager.registerCommand("FrameMasterPRO", "StopPicture", proCmdStopPicture);
PluginManager.registerCommand(PLUGIN_NAME, "BattleSetup", proCmdBattleSetup);
PluginManager.registerCommand("FrameMasterPRO", "BattleSetup", proCmdBattleSetup);

PluginManager.registerCommand(PLUGIN_NAME, "PlayBattlerOnce", function(args) {
    if (!$gameFrameMaster) return;
    const b = proCommandBattler(args, this);
    if (!b) {
        proWarn("PlayBattlerOnce: battler not found (side=" + args.side + " id=" + args.id + ").");
        return;
    }
    $gameFrameMaster.playBattlerOnce(b, String(args.animation || "").trim(), {
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
});
PluginManager.registerCommand("FrameMasterPRO", "PlayBattlerOnce", function(args) {
    if (!$gameFrameMaster) return;
    const b = proCommandBattler(args, this);
    if (!b) return;
    $gameFrameMaster.playBattlerOnce(b, String(args.animation || "").trim(), {
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
});
PluginManager.registerCommand(PLUGIN_NAME, "PlayPictureOnce", function(args) {
    if (!$gameFrameMaster) return;
    const id = Math.floor(Number(args.pictureId) || 0);
    if (!(id >= 1 && id <= 100)) {
        proWarn("PlayPictureOnce: picture id must be 1-100.");
        return;
    }
    $gameFrameMaster.playPictureOnce(id, String(args.animation || "").trim(), {
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
});
PluginManager.registerCommand("FrameMasterPRO", "PlayPictureOnce", function(args) {
    if (!$gameFrameMaster) return;
    const id = Math.floor(Number(args.pictureId) || 0);
    if (!(id >= 1 && id <= 100)) return;
    $gameFrameMaster.playPictureOnce(id, String(args.animation || "").trim(), {
        speed: Math.min(8, Math.max(0.1, Number(args.speed) || 1.0)),
        blend: Number(args.blend) < 0 ? undefined : Math.max(0, Number(args.blend) || 0)
    });
});

// ============================================================================
// 11. Layers — visual equipment & overlays (Godot-style multi-sprite)
// ----------------------------------------------------------------------------
// A character keeps ONE base animation plus a stack of LAYERS drawn over it:
//
//   { slot: "weapon", suffix: "_iron" }   follows the base: base "hero_walk"
//                                        + suffix "_iron" draws "hero_walk_iron"
//   { slot: "halo", anim: "halo_loop" }  fixed overlay, any animation
//
// Layers share the base frameIndex (lockstep) and base timing; a layer whose
// animation is missing (or still loading) is skipped silently that frame.
// Offsets dx/dy nudge a layer in pixels. Max 8 layers (perf guard).
//
// Equipment sets suffix layers automatically from DB note tags:
//   <fm-layer:weapon:_iron>   <fm-layer:cape:_red>
// Manual LayerSet entries survive equip changes; equip-managed ones refresh.
// ============================================================================

Game_FrameMaster.prototype._sanitizeLayers = function(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    const seen = new Set();
    for (const e of raw) {
        if (!e || typeof e !== "object") continue;
        const slot = String(e.slot || "").trim();
        if (!/^[A-Za-z0-9_]+$/.test(slot) || seen.has(slot)) continue;
        const suffix = (typeof e.suffix === "string") ? e.suffix.trim() : "";
        const anim = (typeof e.anim === "string") ? e.anim.trim() : "";
        if (!suffix && !fmIsValidId(anim)) continue;
        if (anim && !fmIsValidId(anim)) continue;
        seen.add(slot);
        out.push({
            slot: slot,
            suffix: suffix || null,
            anim: anim || null,
            dx: fmClampInt(e.dx, -500, 500, 0),
            dy: fmClampInt(e.dy, -500, 500, 0),
            auto: !!e.auto
        });
        if (out.length >= 8) break;
    }
    return out;
};

/** Replace the whole layer stack (validated). [] clears. */
Game_FrameMaster.prototype.setLayers = function(character, layers) {
    const ch = fmLayerOwner(this, character);
    if (!ch) {
        fmWarn("setLayers: unknown character:", character);
        return false;
    }
    ch._fmLayers = this._sanitizeLayers(layers);
    return true;
};

/** Clear one slot, or the whole stack when slot is omitted. */
Game_FrameMaster.prototype.clearLayers = function(character, slot) {
    const ch = fmLayerOwner(this, character);
    if (!ch) {
        fmWarn("clearLayers: unknown character:", character);
        return false;
    }
    if (slot === undefined || slot === null || slot === "") {
        ch._fmLayers = [];
    } else {
        const keep = String(slot);
        ch._fmLayers = (Array.isArray(ch._fmLayers) ? ch._fmLayers : [])
            .filter(l => l && l.slot !== keep);
    }
    return true;
};

/** A copy of the current stack (never the live array). */
Game_FrameMaster.prototype.getLayers = function(character) {
    const ch = fmLayerOwner(this, character);
    if (!ch || !Array.isArray(ch._fmLayers)) return [];
    return ch._fmLayers.map(l => ({
        slot: l.slot, suffix: l.suffix || null, anim: l.anim || null,
        dx: l.dx || 0, dy: l.dy || 0, auto: !!l.auto
    }));
};

/**
 * Compatibility hook for other plugins:
 *   $gameFrameMaster.registerLayerProvider("myPlugin_weapon", ch => {
 *     if (ch === $gamePlayer && $gameParty.leader().isStateAffected(10))
 *       return { slot: "aura", anim: "poison_aura", dx: 0, dy: -8 };
 *     return null;
 *   });
 * The provider is called every frame (keep it cheap) and may return a
 * single layer object or an array. Returned layers are sanitized, deduped
 * (manual/equip wins over provider) and capped at 8.
 */
Game_FrameMaster.prototype.registerLayerProvider = function(id, fn) {
    if (!/^[A-Za-z0-9_]+$/.test(String(id || ""))) {
        fmWarn("registerLayerProvider: id must be letters/digits/underscore.");
        return false;
    }
    if (typeof fn !== "function") {
        fmWarn("registerLayerProvider: provider must be a function(character) => layer|layers|null.");
        return false;
    }
    this._layerProviders = this._layerProviders || [];
    this._layerProviders = this._layerProviders.filter(p => p.id !== String(id));
    this._layerProviders.push({ id: String(id), fn: fn });
    fmLog("Layer provider registered:", id);
    return true;
};

Game_FrameMaster.prototype.unregisterLayerProvider = function(id) {
    if (!this._layerProviders) return false;
    const before = this._layerProviders.length;
    this._layerProviders = this._layerProviders.filter(p => p.id !== String(id));
    return this._layerProviders.length !== before;
};

Game_FrameMaster.prototype.listLayerProviders = function() {
    return (this._layerProviders || []).map(p => p.id);
};

// Effective layer list: manual stack first, else the underlying actor's
// equipment layers (player = party leader, followers = their actor).
function fmAvatarLayers(ch) {
    try {
        if (ch && Array.isArray(ch._fmLayers) && ch._fmLayers.length) {
            return ch._fmLayers;
        }
        let actor = null;
        if (typeof Game_Follower !== "undefined" && (ch instanceof Game_Follower)) {
            if (ch.actor && typeof ch.actor === "function") actor = ch.actor();
        } else if (typeof $gamePlayer !== "undefined" && ch === $gamePlayer) {
            if (typeof $gameParty !== "undefined" && $gameParty &&
                typeof $gameParty.leader === "function") {
                actor = $gameParty.leader();
            }
        }
        if (actor && Array.isArray(actor._fmLayers) && actor._fmLayers.length) {
            return actor._fmLayers;
        }
    } catch (e) { /* fall through to no layers */ }
    return [];
}

/**
 * Resolved per-frame layer views for rendering.
 * [{ slot, bitmap, sx, sy, sw, sh, anchorX, anchorY, dx, dy }]
 */
Game_FrameMaster.prototype.layerViews = function(character) {
    return this.layerViewsFor(this.resolveCharacter(character));
};

/** Same, for an already-resolved owner (characters, battlers, pictures). */
Game_FrameMaster.prototype.layerViewsFor = function(owner) {
    const ch = owner;
    if (!ch || !ch._fmState) return [];
    const st = ch._fmState;
    const base = this.getAnimation(st.animId);
    if (!base) return [];
    let layers = fmAvatarLayers(ch);
    // External providers (compat API) — appended, manual/equip wins on slot collision
    if (Array.isArray(this._layerProviders) && this._layerProviders.length) {
        const extra = [];
        for (const p of this._layerProviders) {
            try {
                const r = p.fn(ch);
                if (!r) continue;
                if (Array.isArray(r)) extra.push(...r);
                else extra.push(r);
            } catch (e) {
                fmWarn("layer provider", p.id, "failed:", e);
            }
        }
        if (extra.length) {
            layers = this._sanitizeLayers(layers.concat(extra));
        }
    }
    if (!layers.length) return [];
    const out = [];
    for (const L of layers) {
        if (!L || typeof L.slot !== "string" || !L.slot) continue;
        let animId = null;
        if (typeof L.suffix === "string" && L.suffix) animId = st.animId + L.suffix;
        else if (typeof L.anim === "string" && L.anim) animId = L.anim;
        if (!animId) continue;
        const anim = this.getAnimation(animId);
        if (!anim || !anim.frames || !anim.frames.length) continue;
        const frame = anim.frames[st.frameIndex % anim.frames.length];
        if (!frame) continue;
        const bmp = this.bitmapFor(frame.source || frame.img);
        if (!bmp || !bmp.isReady || !bmp.isReady()) continue;
        out.push({
            slot: L.slot,
            bitmap: bmp,
            sx: frame.rect ? frame.rect.x : 0,
            sy: frame.rect ? frame.rect.y : 0,
            sw: frame.rect ? frame.rect.w : bmp.width,
            sh: frame.rect ? frame.rect.h : bmp.height,
            anchorX: anim.anchorX,
            anchorY: anim.anchorY,
            dx: fmClampInt(L.dx, -500, 500, 0),
            dy: fmClampInt(L.dy, -500, 500, 0)
        });
        if (out.length >= 8) break;
    }
    return out;
};

/** Draw (or hide) the layer pool of a map-character sprite. */
Game_FrameMaster.prototype.fmDrawLayers = function(sprite, character) {
    if (!sprite) return;
    let views = [];
    try {
        views = this.layerViews(character);
    } catch (e) {
        views = [];
    }
    try {
        fmPaintLayers(sprite, views);
    } catch (e) { /* layers never break sprites */ }
};

/** Same, for an already-resolved owner (used by battler sprites). */
Game_FrameMaster.prototype.fmDrawLayersFor = function(sprite, owner) {
    if (!sprite) return;
    let views = [];
    try {
        views = this.layerViewsFor(owner);
    } catch (e) {
        views = [];
    }
    try {
        fmPaintLayers(sprite, views);
    } catch (e) { /* layers never break sprites */ }
};

// Owner resolver for layer APIs: map characters resolve normally, any other
// object with layer state (battlers, pictures) passes through untouched.
function fmLayerOwner(api, ref) {
    try {
        const ch = api.resolveCharacter(ref);
        if (ch) return ch;
        if (ref && (typeof ref === "object" || typeof ref === "function")) return ref;
    } catch (e) { /* fall through to null */ }
    return null;
}

// ---- Equipment -> layers (DB note tags, zero events needed) --------------
// Tag weapons/armors with e.g.  <fm-layer:weapon:_iron>
// and equipping rebuilds the actor's auto layers; unequipping clears them.

Game_FrameMaster.prototype.fmRebuildEquipLayers = function(actor) {
    if (!actor || !Array.isArray(actor._equips)) return false;
    let equips = [];
    try {
        equips = (typeof actor.equips === "function") ? (actor.equips() || []) : [];
    } catch (e) {
        return false;
    }
    const prev = Array.isArray(actor._fmLayers) ? actor._fmLayers : [];
    const manual = prev.filter(l => l && !l.auto);
    const seen = new Set(manual.map(l => l.slot));
    const auto = [];
    for (const item of equips) {
        if (!item || typeof item.note !== "string" || !item.note) continue;
        const re = /<\s*fm-layer\s*:\s*([A-Za-z0-9_]+)\s*:\s*([^<>\s]+)\s*>/gi;
        let m = null;
        while ((m = re.exec(item.note)) !== null) {
            const slot = m[1];
            if (seen.has(slot)) continue;
            seen.add(slot);
            auto.push({ slot: slot, suffix: m[2], anim: null, dx: 0, dy: 0, auto: true });
            if (manual.length + auto.length >= 8) break;
        }
        if (manual.length + auto.length >= 8) break;
    }
    actor._fmLayers = manual.concat(auto);
    return true;
};

const _FM_Game_Actor_refresh = Game_Actor.prototype.refresh;
Game_Actor.prototype.refresh = function() {
    _FM_Game_Actor_refresh.call(this);
    // Single choke point: equip screen, event commands, class changes and
    // new-game setup all flow through here. Pure read + assign, no recursion.
    try {
        if (typeof $gameFrameMaster !== "undefined" && $gameFrameMaster) {
            $gameFrameMaster.fmRebuildEquipLayers(this);
        }
    } catch (e) { /* equipment never breaks actors */ }
};

// ============================================================================
// 12. Public exports / test seam
// ============================================================================

const FrameMaster_API = {
    version: "2.3.0",
    Game_FrameMaster: Game_FrameMaster,
    Scene_FrameMaster: Scene_FrameMaster,
    Window_FmAnimList: Window_FmAnimList,
    Window_FmProps: Window_FmProps,
    sanitizeAnimation: fmSanitizeAnimation,
    sanitizeFrame: fmSanitizeFrame,
    sanitizeLayers: Game_FrameMaster.prototype._sanitizeLayers,
    config: FM_Config,
    // Shorthand for early plugin load: queues until $gameFrameMaster exists
    registerLayerProvider(id, fn) {
        if (typeof window !== "undefined" && window.$gameFrameMaster && window.$gameFrameMaster.registerLayerProvider) {
            return window.$gameFrameMaster.registerLayerProvider(id, fn);
        }
        FM_pendingLayerProviders.push({ id: String(id), fn: fn });
        return true;
    },
    unregisterLayerProvider(id) {
        if (typeof window !== "undefined" && window.$gameFrameMaster && window.$gameFrameMaster.unregisterLayerProvider) {
            return window.$gameFrameMaster.unregisterLayerProvider(id);
        }
        const idx = FM_pendingLayerProviders.findIndex(p => p.id === String(id));
        if (idx !== -1) FM_pendingLayerProviders.splice(idx, 1);
        return idx !== -1;
    }
};

if (typeof window !== "undefined") {
    window.FrameMaster = FrameMaster_API;
    // Deprecated v1.x PRO namespace: the file is gone, the API lives here.
    window.FrameMasterPRO = { version: FrameMaster_API.version, mergedInto: "FrameMaster" };
}
// CommonJS seam so the logic can be smoke-tested with plain node.
if (typeof module !== "undefined" && module.exports) {
    module.exports = FrameMaster_API;
}

})();
