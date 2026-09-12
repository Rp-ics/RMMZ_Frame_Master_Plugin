# FrameMaster MZ — Guida Completa (Setup, Impostazioni e Comandi)

> **Lingua:** Italiano · **Versione:** v2.3.0 · **Autori:** Rpx & Just Dev  
> **Forge online:** https://rpxgames.win/tools/framemaster/ · **Repo:** https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin

Questa è la guida passo-passo per installare, configurare e usare FrameMaster senza scrivere codice (se non vuoi). Ogni comando è spiegato con a cosa serve, quando usarlo e un esempio pratico.

---

## Indice

1. [Cosa fa FrameMaster](#1-cosa-fa-framemaster)
2. [Requisiti](#2-requisiti)
3. [Installazione in 3 minuti](#3-installazione-in-3-minuti)
4. [Struttura cartelle](#4-struttura-cartelle)
5. [Creare la tua prima animazione (Forge Web)](#5-creare-la-tua-prima-animazione-forge-web)
6. [Editor locale (alternativa offline)](#6-editor-locale-alternativa-offline)
7. [Importare da Aseprite](#7-importare-da-aseprite)
8. [Anteprima in gioco (tasto F8)](#8-anteprima-in-gioco-tasto-f8)
9. [Impostazioni Plugin (Parameters)](#9-impostazioni-plugin-parameters)
10. [Comandi Plugin — panoramica](#10-comandi-plugin--panoramica)
11. [Comandi Personaggi (Mappa)](#11-comandi-personaggi-mappa)
12. [Auto-Pilot (Godot-style)](#12-auto-pilot-godot-style)
13. [Layer — Equipaggiamento Visivo](#13-layer--equipaggiamento-visivo)
14. [Battler e Pictures](#14-battler-e-pictures)
15. [Battle Director (stati di battaglia)](#15-battle-director-stati-di-battaglia)
16. [Azioni Indipendenti — PlayOnce](#16-azioni-indipendenti--playonce)
17. [Script API (per chi usa codice)](#17-script-api-per-chi-usa-codice)
18. [Formati immagine, Peso e Preload](#18-formati-immagine-peso-e-preload)
19. [API per altri plugin (Compatibilità)](#19-api-per-altri-plugin-compatibilità)
20. [Risoluzione Problemi (Troubleshooting)](#20-risoluzione-problemi-troubleshooting)

---

## 1. Cosa fa FrameMaster

- Rompe il limite di **3 frame** dei charset di RPG Maker MZ: puoi avere **frame infiniti** per animazione.
- Funziona su **Player, Eventi, Follower, Battler (Actor/Nemici), Pictures**.
- Ogni animazione è un file JSON in `data/framemaster/` + PNG/WebP in `img/framemaster/`.
- Hai un **editor visuale** (drag & drop, timeline, anteprima) sia online che locale.
- Supporta **loop normali, ping-pong (avanti-indietro) e random**, **crossfade (blend)**, **frame events** (suono, common event, switch, script), **layer equipaggiamento** e **Battle Director** (idle, attacchi, hit, morte... automatici).

> **Concetto chiave:** FrameMaster non indovina quando animare. Tu crei le animazioni nella Forge, poi dici al gioco *quando* farle partire (con un Evento). L'**Auto-Pilot** e il **Battle Director** le fanno partire da soli dopo, una volta configurati.

---

## 2. Requisiti

- **RPG Maker MZ 1.8+** (testato su NW.js e deploy web).
- Metti FrameMaster **sotto** altri plugin visivi (es. VisuStella Events & Movement Core) nella lista Plugin Manager.
- Per l'editor locale serve **Chrome/Edge** se vuoi l'auto-salvataggio diretto nella cartella progetto. La Forge online funziona su qualsiasi browser.

---

## 3. Installazione in 3 minuti

### Passo 1 — Copia il plugin
1. Prendi `FrameMaster.js` (te lo fornisce l'autore / release) e copialo in `<TuoProgetto>/js/plugins/`.
2. Apri l'editor MZ → **Plugin Manager (F10)** → tasto destro → **Aggiungi** → scegli **FrameMaster** → **ON**.
3. Imposta i 4 parametri (vedi capitolo 9). Per iniziare lascia tutto di default.

### Passo 2 — Crea le cartelle
Crea a mano (o lascia fare alla Forge) queste due cartelle nella **root del progetto** (dove c'è `game.rmmzproject`):
```
<TuoProgetto>/
├── data/framemaster/
└── img/framemaster/
```

### Passo 3 — Aggiungi contenuti demo o tuoi
- **Opzione A (consigliata):** Vai su https://rpxgames.win/tools/framemaster/ → **Load demo** → **Download pack (.zip)** → scompatta nella **root del progetto** (unisci `data/` e `img/`). Hai subito 3 animazioni funzionanti.
- **Opzione B:** Copia `demo/data/framemaster/*.json` e `demo/img/framemaster/*.png` dal repo nella stesse cartelle.

### Passo 4 — Prova
Avvia **Playtest (▶)** → sulla mappa premi **F8** → dovresti vedere la lista animazioni. Se vedi **0 animazioni**, leggi il pannello di diagnosi a destra (vedi capitolo 8) o il capitolo 20.

> **Nota importante:** Se hai scompattato il pack dentro una sottocartella tipo `Coop/framemaster_pack/data/...` hai sbagliato livello: sposta `data/framemaster` e `img/framemaster` direttamente nella root.

---

## 4. Struttura cartelle

```
<TuoProgetto>/
├── data/framemaster/
│   ├── FM_Animations.json      # registro: [{id, name, file}]
│   ├── FM_BattleSets.json      # registro battle sets (se usi il Director)
│   ├── slime_idle.json         # una animazione
│   └── bset_slime.json         # un battle set
└── img/framemaster/
    ├── slime_0.png / .webp
    ├── hero_run_sheet.png
    └── ...
```

- **Non modificare a mano** `FM_Animations.json` e `FM_BattleSets.json`: li scrive la Forge.
- I PNG/WebP possono essere singoli frame o sprite sheet interi.

---

## 5. Creare la tua prima animazione (Forge Web)

Apri **https://rpxgames.win/tools/framemaster/**

### 5.1 Upload PNG/WebP
- Trascina i tuoi PNG/WebP **ovunque nella pagina**, oppure usa **Scegli file**.
- Devono avere **stessa dimensione** dentro una stessa animazione (es. tutti 48×48), sfondo trasparente, piedi in basso al centro.
- Nomi ordinati aiutano: `walk_0.png … walk_5.png`.

### 5.2 Crea animazione
1. Clicca **+ New** → rinomina a destra **ID (slug)** es. `player_walk` (solo `minuscole_numeri_underscore`) e **Name** `Camminata`.
2. Clicca **Add all PNGs as frames** (ordina per nome) oppure clicca le miniature per aggiungerle una ad una.
3. **Sprite sheet?** Se hai un unico PNG con griglia: scegli lo sheet a sinistra, imposta **Frame width/height**, premi **Grid** per vedere la griglia, poi **Slice → append**.

### 5.3 Timeline e Anteprima
- **Timeline** sotto: trascina per riordinare, click / Ctrl+click / Shift+click per selezionare, batch per cambiare durata o cancellare.
- **Anteprima** al centro: **Spazio** play/pausa, **←/→** frame singolo, **Speed** e **grounding** (ombretto finto).
- **Proprietà** a destra: **Loop** ON/OFF, **Loop from**, **Loop mode** (Normal / Ping-pong 1,2,3,2,1 / Random), **Base speed**, **Anchor**.
- **Frame selezionato:** cambia **Durata** in frame (60 = 1 sec) o ms, sostituisci immagine, aggiungi **Frame events** (+ SE / + Event / + Switch / + Script).

### 5.4 Salvataggio
- **Se hai collegato la cartella progetto** (bottone **Project folder**, solo Chromium): salva automatico in `data/framemaster/` a ogni modifica (`Saved ✓`).
- **Altrimenti:** premi **Download pack (.zip)** → scompatta nella root del progetto.

### 5.5 Striscia Layer (test visivo)
Sotto l'anteprima trovi **Layers:** 3 campi. Scrivi un **ID animazione** o un **suffisso** tipo `_iron`. Es. base `hero_walk` + `_iron` → prova `hero_walk_iron` sovrapposto allo stesso frameIndex. Serve solo per vedere l'allineamento (i layer veri vivono nello stato di gioco, non nel file animazione).

---

## 6. Editor locale (alternativa offline)

Apri `tools/framemaster_editor.html` (doppio click) in Chrome/Edge.

- **Open project folder…** → scegli la root del progetto → auto-save come la Forge.
- Su Firefox/Safari: usa i file picker e poi **Export JSON** → copia a mano in `data/framemaster/` e aggiungi riga in `FM_Animations.json`.

Funzioni identiche alla Forge, senza tab Battle Sets / export GIF (quelli sono solo online).

---

## 7. Importare da Aseprite

1. In Aseprite: **File → Export Sprite Sheet** → JSON **Array** (o Hash) + PNG.
2. In Forge: **Import JSON** → seleziona il JSON di Aseprite.
3. La Forge crea **una animazione per ogni `frameTag`** (se presenti) o una singola altrimenti. `duration` in ms viene convertito in frame (`*60/1000`), `frame.x/y/w/h` diventa `rect`, `meta.image` diventa `source`.

> Se il nome sheet in `meta.image` non coincide con il PNG caricato, rinomina il PNG o carica quello giusto.

---

## 8. Anteprima in gioco (tasto F8)

In **Playtest**, sulla mappa premi **F8** (configurabile nei parametri):

- Lista a sinistra: tutte le animazioni, select con frecce.
- Centro: preview 2× con sfondo a scacchiera.
- Destra: proprietà del frame corrente + pannello **Diagnosis** se la lista è vuota.
- Controlli: **Su/Giù** cambia animazione, **OK (Z/Spazio/Invio)** play/pausa, **PagSu/PagGiù** velocità, **Esc / Tasto destro** esci.

**Se vedi 0 animazioni:** leggi il pannello a destra: ti dice il file esatto mancante (`data/framemaster/FM_Animations.json` o `xxx.json` con tipo `missing/invalid-json/bad data`), la cartella immagini `img/framemaster/` e il percorso `From:` da cui il gioco è partito (per scovare la cartella sbagliata).

---

## 9. Impostazioni Plugin (Parameters)

Nel **Plugin Manager** cliccando su FrameMaster:

| Parametro | Default | Cosa fa |
|---|---|---|
| **Default Blend (ms)** | 120 | Dissolvenza incrociata quando passi da un'animazione FM a un'altra. 0 = stacco secco. Usato se il comando lascia Blend a `-1`. |
| **Preload On Map Load** | true | Precarica le immagini delle animazioni **vicine al player** (raggio 26 tile su mappe grandi) all'ingresso mappa. Evita scatti al primo play. Su mappe piccole con ≤24 animazioni precarica tutto. Cache LRU 220 bitmap. |
| **Debug Log** | false | Stampa in console (F12) info utili (anim caricate, warning). Accendilo mentre configuri, spegnilo in release. |
| **Preview Key** | F8 | Tasto che apre la scena F8 in playtest. `none` lo disabilita. |

---

## 10. Comandi Plugin — panoramica

Tutti in **Evento → Plugin Command → FrameMaster** (e `FrameMasterPRO` per compatibilità, ora alias).

| Comando | A cosa serve | Quando usarlo |
|---|---|---|
| **Play** | Fa partire un'animazione su Player/Evento | Cutscene, interazione, possesso |
| **Stop** | Ferma e torna allo sprite originale | Fine cutscene |
| **TransitionTo** | Cambia animazione con crossfade, mantenendo velocità | Cambio stato fluido |
| **OpenPreview** | Apre la scena F8 da evento | Debug in gioco |
| **AutoPlay / AutoStop** | Auto-pilot: idle/camminata automatici | Mappe esplorabili (vedi cap.12) |
| **PlayBattler / StopBattler** | Anima un battler in battaglia | Skill, colpi |
| **PlayPicture / StopPicture** | Anima una Picture (Show Picture prima) | HUD animati, effetti schermo |
| **BattleSetup** | Assegna un Battle Set ai battler | Inizio battaglia (vedi cap.15) |
| **LayerSet / LayerClear** | Aggiunge/rimuove layer visivi | Equipaggiamento (vedi cap.13) |
| **PlayOnce / PlayBattlerOnce / PlayPictureOnce** | Azione singola che poi torna da sola | Emote, apertura baule, hit flash |

> **Target:** `Player` = giocatore, `This Event` = l'evento che esegue il comando, `Event ID` = numero. Negli Script usa `$gamePlayer`, `$gameMap.event(n)` o `this._eventId`.

---

## 11. Comandi Personaggi (Mappa) — dettaglio

### Play
- **Animation ID:** lo slug esatto (case sensitive) che vedi in F8, es. `slime_idle`.
- **Loop Override:** `File Default` = usa il loop del file, `Loop` / `Play Once` lo forza.
- **Speed:** moltiplicatore (2.0 = doppio).
- **Blend:** ms di dissolvenza. `-1` = Default Blend. Da nativo a FM è sempre stacco secco.

*Esempio:* Evento con Trigger **Action Button** → Plugin Command **Play** → Target `This Event` → Animation `slime_idle` → premi Z davanti al PNG.

### Stop
Ripristina il charset originale. Se c'era un Auto-Pilot, **Stop lo riattiva**.

### TransitionTo
Come Play ma tieni la velocità precedente. Utile per `idle → walk` senza scatti.

---

## 12. Auto-Pilot (Godot-style)

**Idea:** assegni una volta una mappatura, poi il personaggio si anima da solo: **fermo = idle, in movimento = walk, in scatto = dash**.

### Setup (3 click, zero codice)
1. Crea un **Evento Autorun** nella mappa iniziale.
2. Plugin Command → **AutoPlay** → compila:
   - **Target:** `Player`
   - **Idle:** `hero_idle`  · **Walk:** `hero_walk` (minimo 1 dei due)
   - **Dash:** `hero_run` (opzionale, se vuoto usa Walk)
   - **IdleDown/Up/Left/Right** e **WalkDown/.../WalkRight** e **4 diagonali** `WalkDownLeft` ecc. opzionali — vuoti = usano Idle/Walk base, sempre fallback allo sprite originale se manca.
   - **Blend:** `-1`
3. Sotto aggiungi **Erase Event** (l'Autorun parte una volta e sparisce).

Da lì: fermo → idle, cammini → walk, dash → dash. Le diagonali sono rilevate da **vettore** `realX/Y - x/y`, quindi funzionano con qualsiasi mover pixel (Altimit, Rosedale, Half Move) senza marker.

**Regole:**
- **Play** mette in **pausa** l'auto-pilot (per cutscene) → **Stop** lo **riprende**, **AutoStop** lo **spegne**.
- **PlayOnce** (cap.16) non lo mette in pausa permanente: dopo torna da solo.
- La mappatura si **salva** con il save.

---

## 13. Layer — Equipaggiamento Visivo

**Concetto:** un'animazione base + **stack di layer** che condividono lo stesso `frameIndex` (lockstep). Due tipi:

- **Suffix** (equip che segue): `{slot:"weapon", suffix:"_iron"}` → base `hero_walk` disegna `hero_walk_iron`, base `hero_idle` disegna `hero_idle_iron`. Automatico su auto-pilot, blend e stati battaglia. Variante mancante = slot nascosto lì, nessun errore.
- **Fixed** (overlay): `{slot:"halo", anim:"halo_loop"}` — qualsiasi animazione.

Max **8 layer**, `dx/dy` per nudge in pixel, lockstep sul tempo della base.

### A. Automatico da Database (consigliato)
Tagga armi/armature nel **Database → Nota**:
```
<fm-layer:weapon:_iron>
<fm-layer:cape:_red>
```
Equippaggi → il layer appare, disequippaggi → sparisce. I `LayerSet` manuali sopravvivono ai cambi equip. Player = leader del party, Follower = proprio actor, Battler = stesso actor in battaglia (`actor _mainSprite` / `enemy self`) — la spada resta anche sull'attacco.

### B. Manuale via comandi
- **LayerSet:** `Target` + `Slot` (es. `weapon`) + `Kind` = `Suffix` o `Fixed` + `Value` (`_iron` o `halo_loop`) + `dx/dy`.
- **LayerClear:** `Slot` pieno = svuota uno slot, vuoto = svuota tutti.

### C. API (per eventi Script o altri plugin)
```js
$gameFrameMaster.setLayers($gamePlayer, [{slot:"weapon", suffix:"_iron"}]);
$gameFrameMaster.clearLayers($gamePlayer, "weapon"); // o senza slot = tutti
$gameFrameMaster.getLayers($gamePlayer); // [{slot,suffix,anim,dx,dy}]
```
Altri plugin possono iniettare layer senza toccare i save:
```js
FrameMaster.registerLayerProvider("myAura", ch => {
  if (ch === $gamePlayer && $gameSwitches.value(10))
    return {slot:"aura", anim:"aura_loop", dx:0, dy:-8};
  return null;
});
FrameMaster.unregisterLayerProvider("myAura");
```
I provider sono sanitizzati, dedup (manuale/equip vince) e chiamati ogni frame (tienili leggeri). Supporta coda pre-boot.

**Anteprima:** nella Forge, sotto l'anteprima, la riga **Layers:** ti fa provare fino a 3 layer (ID o `_suffix`) in tempo reale — solo test visivo, lo stato vero è in gioco.

---

## 14. Battler e Pictures

### Battler (Actor/Nemici, front e side-view)
- **PlayBattler / StopBattler:** `Side: Actor/Enemy` + `ID` (Actor = ID database, Enemy = **0-based** troop order: primo nemico = 0) + `Animation` + `Loop/Speed/Blend`.
- Hit-flash, popup danni, stati e collapse restano sopra i frame FM. L'arma dell'actor si nasconde mentre FM lo guida e torna alla prossima motion arma.
- API: `playBattler(battler, animId, opts)` dove battler è istanza (`$gameActors.actor(1)`, `$gameTroop.members()[0]`) o stringa `"actor:1"` / `"enemy:0"`. Anche `transitionBattler`, `getBattlerFrame` / `isBattlerPlaying` / `getBattlerAnimation`.

### Pictures
- **PlayPicture / StopPicture:** `Picture ID 1–100` (devi aver fatto **Show Picture** prima) + animazione. Posizione/scala/rotazione/opacità/tono restano nativi, cambia solo il contenuto.
- API: `playPicture(idOrPicture, animId, opts)` / `transitionPicture` / ecc.

> **Blend:** FM → FM crossfada, nativo → FM è stacco secco (regola LITE-wide).

---

## 15. Battle Director (stati di battaglia)

Costruisci un **Battle Set** nella Forge (**tab Battle Sets**): mappa momenti di battaglia → ID animazioni — `idle`, `appear`, `attack1/2/3`, `skill`, `item`, `defend`, `hit`, `evade`, `die`, `victory` + **fasi HP** che cambiano tutto il set (forme boss).

| Momento | Quando parte | Comportamento |
|---|---|---|
| `appear` | Inizio battaglia (se assegnato) | Una volta, poi idle |
| `idle` | Fermo / dopo ogni one-shot | Loop |
| `attack1-3` | Il battler agisce (Attack) | Una volta, poi idle. Pick: cycle 1→2→3, random, first |
| `skill` / `item` | Skill / Oggetto | Una volta, poi idle |
| `defend` | Guard | Loop come stance fino a rimpiazzo |
| `hit` | Subisce danno (e sopravvive) | Una volta, poi idle |
| `evade` | Schiva (fisico/magico) | Una volta, poi idle |
| `die` | Collassa | Una volta sopra il fade, poi rilasciato |
| `victory` | Party vince (actor) | Loop fino a fine battaglia |

Vuoto = comportamento nativo per quel momento (motion SV, collapse...).

### Assegnazione (una volta)
- **Troop Event, Span: Battle** → `FrameMaster → BattleSetup` → `All Enemies → slime_battle`
- **Actor:** stesso comando su mappa iniziale (Autorun) → persiste tra battaglie. `Set` vuoto = **clear**.

### API
```js
$gameFrameMaster.assignBattleSet(battler, "slime_battle");
$gameFrameMaster.clearBattleSet(battler);
$gameFrameMaster.getBattlerSet(battler);
$gameFrameMaster.playBattlerState(battler, "hit"); // qualsiasi momento del set
```

Demo: `slime_battle` usa `slime_idle`/`attack`/`hit`/`die`.

---

## 16. Azioni Indipendenti — PlayOnce

Animazioni **usa-e-getta** che non sporcano lo stato permanente:

- **PlayOnce** su character, **PlayBattlerOnce**, **PlayPictureOnce**: giocano **una volta** (`loop` forzato off) e poi tornano da soli — se c'è Auto-Pilot torna a idle/walk, altrimenti al charset/immagine nativo. Callback `onComplete` chainabile.

*Esempio:* Evento baule → `PlayOnce` → `chest_open` su This Event → resta aperto fino a `Stop` esplicito? No: con PlayOnce torna da solo dopo l'apertura (per farlo restare aperto usa `Play` normale con `Loop: false`).

Comandi hanno solo `Speed` e `Blend` (loop è implicito). API:
```js
$gameFrameMaster.playOnce($gamePlayer, "emote_wave", {speed:1.2});
$gameFrameMaster.playBattlerOnce($gameActors.actor(1), "skill_fire");
```

---

## 17. Script API (per chi usa codice)

```js
// Personaggi mappa
$gameFrameMaster.play($gameMap.event(3), "slime_idle");
$gameFrameMaster.play($gamePlayer, "hero_run", {speed:1.5, blend:200, loop:false, onComplete:()=> $gameSwitches.setValue(10,true)});
$gameFrameMaster.stop($gameMap.event(3));
$gameFrameMaster.transitionTo($gamePlayer, "hero_idle", 300);
$gameFrameMaster.getCurrentFrame($gamePlayer);     // 0-based, -1 = none
$gameFrameMaster.isPlaying($gamePlayer);
$gameFrameMaster.getCurrentAnimation($gamePlayer); // "hero_run" o null
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

Dentro uno **Script di evento**, `this._eventId` è l'evento corrente, quindi `$gameMap.event(this._eventId)` punta a *questo evento*.

---

## 18. Formati Immagine, Peso e Preload

- **Formati:** `.png` e **`.webp`** (60-80% più piccolo a pari qualità). Basta usare `name.webp` nei frame — la Forge li accetta/droppa entrambi, il pack li include, il runtime usa `loadBitmapFromUrl` per `.webp`.
- **Cache LRU 220 bitmap:** evita OOM con centinaia di frame; i meno recenti vengono scartati.
- **Preload di prossimità:** all'ingresso mappa (se `PreloadOnMapLoad` ON) precarica solo le immagini **vicine al player** (raggio 26 tile su mappe grandi, tutti su mappe piccole) per `state`/`auto`/`layers`/`battle set`. Su mappe enormi non precarica tutto.
- **Deploy cifrato:** escludi `img/framemaster/` dalla cifratura, o tieni il preload ON.

---

## 19. API per Altri Plugin (Compatibilità)

FrameMaster è **alias-chained** (mai sovrascritto) su `Sprite_Character`, `Sprite_Actor/Enemy/Picture`, `Game_Battler`. Mettilo **sotto** altri plugin visivi.

Matrice completa: vedi `doc/COMPATIBILITY.md`.

Hook pubblico principale: `FrameMaster.registerLayerProvider` (vedi cap.13). Altri hook (auto, battle) sono interni ma stabili: chiedi se ti serve un provider custom.

---

## 20. Risoluzione Problemi (Troubleshooting)

| Sintomo | Causa → Soluzione |
|---|---|
| `0 animations` + `Registry: MISSING` in F8 | Cartella sbagliata. Scompatta il pack **nella root** del progetto (es. `Coop/data/framemaster/` non `Coop/framemaster_pack/data/...`). |
| `Could not load animation file "data/framemaster/xxx.json"` | Nome file con maiuscole diverse o JSON rotto. Riesporta dalla Forge. |
| `f1.png.png` in console | Vecchio bug `.png.png` — aggiorna `FrameMaster.js` a v2.3.0+. |
| F8 non si chiudeva | Fixato in v1.2.1 → `activate()` della lista. Aggiorna. |
| `From: chrome-extension://...` in diagnosi | Stai lanciando il gioco da un'estensione, non da Playtest dell'editor. Usa **Play** dell'editor. |
| F8 resta su `loading…` | Bug di ricreazione dopo New Game — fixato da v1.2.1 (carry-over registry). Aggiorna. |
| Arma non segue in battaglia | Normal: arma si nasconde durante FM actor e torna alla prossima motion arma. Per layer arma in battaglia usa i **Layer** (suffix), non dipende dall'arma sprite. |
| Auto-pilot non cambia in diagonale | Imposta `WalkDownLeft` ecc. e usa un mover che imposta `direction` 1/3/7/9 o `realX/Y` (Altimit). Altrimenti usa `walk` base. |
| `.webp` non si vede | File mancante in `img/framemaster/` o nome con estensione sbagliata. Controlla console con `Debug Log` ON. |

Se resti bloccato, apri **F8** e leggi il pannello **Diagnosis** a destra: ti dice il file esatto (`missing/invalid-json/bad data`), la cartella `img/framemaster/` e il percorso `From:`.

---

*Fine guida. Per aggiornamenti: https://github.com/Rp-ics/RMMZ_Frame_Master_Plugin — Forge: https://rpxgames.win/tools/framemaster/*
