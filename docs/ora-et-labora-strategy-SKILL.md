---
name: ora-et-labora-strategy
description: "Rules reference, per-building strategy dossiers, and accumulated play memory for the Ora et Labora board game (France variant). Part I is the engine-verified rules digest (turn/round structure by mode, the three main actions, work contracts, clergy, landscape geometry and pricing, settlement phases, the three scoring columns). Part II is the heart: a dossier for EVERY France building — cost, economic/dwelling value, terrain, cloister flag, player-count availability, function — plus strategy fields (desirability rating, cost pain, combos with other buildings, work-contract magnetism, layout/cloister notes, player-count notes) and an append-only Memories list of lessons from played games. Parts III–IV cover settlements, landscape, and goods. Part V is doctrine (win conditions, round-8 checkpoint, column audits, openings for 2p/4p/solo, endgame). Part VI is engine/MCP operations (USE grammar, Castle protocols, engine quirks). Part VII is the game ledger. Use when planning moves, evaluating building priorities, assigning clergy, placing settlements, or analyzing game state — and UPDATE it after every game per the 'How to encode new memories' section."
compatibility: "Kennerspiel MCP (list_my_games, get_game, get_legal_moves, make_move)"
---

# Ora et Labora — Rules, Building Dossiers & Strategic Memory

**Default assumed mode: France, long 2-player.** The reference covers all modes; player-count differences are flagged per building and per section.

> **Sources of truth, in order:** (1) the engine source in `game/src/board/` — `buildings.ts` (roster by stage/player), `erections.ts` (economic value, dwelling value, terrain, cloister flag), `settlements.ts`, `resource.ts` (food/energy/coin/point values); (2) the official Lookout/Z-Man rulebook + appendix (`https://www.lookout-spiele.de/en/games/ora.html`) for design intent. Live game state (`get_game`) overrides both for the *current* round, prices, and rondel position. **Where the engine diverges from the rulebook, that is an engine bug** — file a GitHub issue with observed-vs-expected, then keep playing against the engine's actual behavior (Part VI lists known cases).

## How to use this file

1. **Before a game:** read Part V (doctrine) to name your win condition, then Part I if rules are hazy.
2. **During a game:** before any unfamiliar `BUILD`/`USE`/`WORK_CONTRACT`, open that building's dossier in Part II and read its **Function** line — never act on name resemblance or memory. Check Part VI before trusting `get_legal_moves`.
3. **After a game:** encode what you learned (next section).

## How to encode new memories (do this after EVERY game)

Each kind of observation has exactly one home. Keep entries short, dated, and tagged with the game (e.g. `(g7)` or the instance id).

| What you learned | Where it goes |
|---|---|
| Anything about one building — a combo that worked, a trap, how contested it was, whether opponents work-contracted it, a payment/command detail | That building's **Memories** bullets in Part II (append; newest last). If it changes the headline judgment, also adjust the ★ rating / Combos / WC lines |
| A settlement-placement or landscape lesson | Part III |
| A repeatable principle confirmed ≥2 games (or one decisive time) | Part V doctrine — fold it into the relevant subsection rather than appending a new section |
| An engine behavior, quirk, or rules divergence | Part VI quirks list (numbered, append) |
| The game itself — result, win condition named/followed, what decided it | One compact entry in the Part VII ledger (≤10 lines, template provided) |

**Promotion rule:** the ledger is a log, not a memory store. If a ledger lesson matters, it must ALSO live in a dossier or doctrine — assume future readers skim only Parts II and V. **Pruning rule:** when Memories bullets on one building contradict each other, keep the newer verified one and delete the stale one; this file should get sharper, not longer.

---

# PART I — RULES DIGEST (engine-verified)

## I.1 Shape of the game

- **1–4 players**; France map (grain→flour→bread, grapes→wine). Goal: highest total across three scoring columns (§I.9). Solo goal: 500 (France long).
- Each player starts with a **2×5 heartland**: 3 forest + 2 moor cards, plus three **basic buildings** — Farmyard, Clay Mound, Cloister Office. (Short game: one fewer forest and moor.)
- **Clergy:** 1 Prior + 2 Lay Brothers per player (short game: 1+1). Clergy never leave your own board; opponents place *your* clergy on *your* buildings via work contracts.

## I.2 Turn / round structure by mode

| Mode | Wheel | Action cadence | Settle phases | Bonus round | Game end |
|------|-------|----------------|---------------|-------------|----------|
| **3–4p long** | front `0,2,3,4,…` | 1 action each; start player takes a 2nd at round end | A–D + final **E** | yes (r25) | after 5th settle phase |
| **Regular 2p** | back `0,1,2,2,…` | per turn: rotate wheel, take **2 actions** | A–D only | no | D out **and ≤1 building** in display |
| **Long 2p** | front | start player **2 actions**, other **1**, swap each round | A–D only | no | D out **and ≤3 buildings** in display |
| **Short 3–4p** | front | 12 rounds + bonus | A–E | yes (r13) | after final settle phase |
| **Solo (1p + neutral)** | front | rotate wheel, take **2 actions** | A–D + final **E** | no | after final settle phase |

**Engine wheel values** (`rondel.ts armValues`): back side `[0,1,2,2,3,4,4,5,6,6,7,8,10]` **only** when `players === 2 && length === 'short'` (the "normal" 2p game). **Everything else uses the front side** `[0,2,3,4,5,6,6,7,7,8,8,9,10]` — long 2p, solo, and all 3–4p games.

**Goods-indicator entry:** France long / multiplayer: **grapes r8, stone r13**. Short: grapes r4, stone r6. Regular 2p: grapes r11, stone r18. Until entry, produce via the **joker**. **Solo: grapes and stone indicators never enter** — joker only. Always read the live rondel from `get_game`.

## I.3 Sequence of a round (multiplayer / long)

1. **Recall** — each player with *all* clergy placed takes them all back (1–2 placed → none return).
2. **Rotate** the wheel one space counterclockwise.
3. **Settlement phase** if the beam passed the next card pile (A→B→C→D, then E).
4. **Actions** (per the mode table). 5. Pass the start-player marker.

## I.4 The production wheel

- Seven indicators start in play: clay, coins, grain, livestock, wood, peat, joker. Grapes/stone enter later (§I.2).
- A production building takes goods = the value at that good's indicator, then resets it to **0**. Past space 10 it stays on 10 (multiplayer); **solo: it is removed from the game**.
- **Joker** (shared): `USE <bldg> Jo` harvests at the **joker's** value and resets the **joker**, leaving the good's own indicator untouched. Only worth it when joker ≥ the good's own value. A fat joker is a race — whoever harvests next claims it.

## I.5 The three main actions (exactly one per action slot)

**A) Place a clergyman** — on one of *your own* unoccupied buildings, triggering its function (fires on *placement* only); OR issue a **work contract** (§I.6) on an opponent's unoccupied building. Only landscape buildings (not the display) can be used.

**B) Fell trees / Cut peat** — remove 1 forest (→ wood) or 1 moor (→ peat); take goods = that indicator, reset it. **Uses no clergyman.** Frees the space to build on. Legal even at indicator 0.

**C) Build** — pay the cost, place on an empty space of allowed terrain. **Cloister buildings (☩) must be orthogonally adjacent to another cloister building.** If your **Prior is home**, you may place it on the just-built building for an immediate bonus USE — the signature **build→USE double action**. Coin-financed buildings (Palace, Quarry, Pilgrimage Site, Cloister Garden…) still consume the build action.

**Free actions** (any number, before or after the main action): buy ≤1 landscape per turn and ≤1 per settlement phase (long 2p: ≤2 across your 3-in-a-row actions); trade 5 pennies ↔ 1 nickel; trade 1 wine → 1 coin; **flip grain → straw** (free, anytime, irreversible — grain is the only freely flippable tile, and both faces are *different goods*, so one grain pile can pay both a grain and a straw cost).

## I.6 Work contracts

- Pay the owner **1 coin** (→ **2 coins permanently once any Winery is built, by anyone**). The owner seats one of *their* free clergy; *you* get the function. You cannot contract a player with no free clergy. A contract cannot be refused; pay before seeing the benefit.
- **Present instead of coins:** return **1 wine** to the *general supply* — the owner receives nothing. Post-Winery this is doubly correct: costs ~1 pt of wine instead of 2 coins AND denies the income.
- Engine: after `WORK_CONTRACT <bldg> <pay>`, the **owner** responds `WITH_LAYBROTHER` or `WITH_PRIOR`. In 2p the human opponent must respond — the pipeline stalls if they're AFK. When *you* respond, default `WITH_LAYBROTHER`; the Prior is too valuable to strand on someone else's fee.
- Solo: fees go to the supply; the wine-present rule still applies.

## I.7 Clergy and recall

- **Prior** = a Lay Brother plus the build→USE bonus (must be home at build time). Reserve it for build-bonuses and high-multiplier activations; default a Lay Brother everywhere else (`USE` auto-seats a LB; see Part VI grammar).
- **Recall** fires only at round start and only when *all* your clergy are placed. Stranding 1–2 clergy means they never cycle back. The **Bathhouse (F23)** recalls mid-turn but needs the coin: `USE F23 Pn`.
- **Soft-lock warning:** zero coins + zero free clergy + nothing to fell/cut = no legal main action; the engine does not auto-pass (`COMMIT`/`PASS` rejected). Keep ≥1 coin buffered; never strand your last clergy on a non-settle turn.
- **USE requires a free clergyman; BUILD never does.** Fully placed = you can still BUILD, BUY, CONVERT — and you cannot be work-contracted.

## I.8 Landscape expansion (heartland → districts + plots)

- **Districts** (`BUY_DISTRICT`) — 1×5 strips flush above/below the heartland. **Hills side** = Moor/Forest/Forest/Hillside/Hillside (2 forest + 1 moor cards, 2 open hillside). **Plains side** = Forest/Plains/Plains/Plains/Hillside (1 forest card, 4 open spaces).
- **Coastal plots** (`BUY_PLOT … COAST`) — attach **left**: 2 Water + 2 Coast. Water carries **dwelling 3 even unbuilt**. Unlocks F04/F11/G26/F33 and the Fishing Village.
- **Mountain plots** (`BUY_PLOT … MOUNTAIN`) — attach **right**: 2 Hillside + 1 Mountain (mountain borders both hillsides). The only Mountain source (Quarry, Castle) and extra Hillside (Grapevine, Palace, Hilltop Village).
- **Price ramp** (`board/landscape.ts`, consumed from index 0): **2/3/4p districts `2,3,4,4,5,5,6,7,8` — rising; plots `3,4,4,5,5,5,6,6,7` — rising. Solo: both arrays reversed — falling.** In multiplayer buy land EARLY (cheaper + more rounds of use); in solo no price rush, but option value still says buy when you can use the space. Read live `district_purchase_prices` / `plot_purchase_prices`.

## I.9 Settlement phases and scoring

- Settlement phase: each player may build **≤1 settlement**, paying its **food + energy** (excess wasted; you may buy ≤1 landscape first). Fishing Village = Coast only; Hilltop Village = Hillside only; never on Mountain/Water; not buildable via the normal build action. Afterwards the letter's buildings enter the display and each player gains 1 new settlement card (A→Artist's Colony, B→Hamlet, C→Village, D→Hilltop Village).
- The **Castle (G28)** builds one settlement on demand — the *only* settle route after the last phase, and the only route to the Hilltop Village in 2p.
- **Scoring — three independent columns:**
  1. **Goods** — point tiles held: book 2, ceramic 3, ornament 4, reliquary 8, Wonder 30, wine 1, nickel 2. **Raw basic goods score ZERO** (empirically confirmed); loose pennies convert 5→nickel = 2 pts.
  2. **Economic** — sum of economic values of all your buildings AND settlements.
  3. **Settlement dwelling** — each settlement scores its own dwelling value **plus** the dwelling value of every orthogonally adjacent card (buildings, other settlements, Water = 3). A high-D building between *k* settlements pays all *k*. Negative dwellings only bite beside settlements.

---

# PART II — BUILDING DOSSIERS (France, engine-verified)

## How to read a dossier

```
#### <ID> <Name> — ★★★★☆ [☩]
`Cost · E<econ> D<dwelling> · <terrain> · P <player counts> · <stage>`
Function: what one USE does (exact — trust this over the name).
Get it: how desirable, and when in the game.
Cost pain: how hard the build cost is to assemble.
Combos: buildings/landscape it multiplies with.
WC: work-contract dynamics — will opponents contract you for it; should you contract theirs.
Layout: placement/cloister/landscape notes.
Count: player-count sensitivity.
Memories: dated, append-only observations from real games.
```

- **★ rating** = how hard you should fight to get it, in the modes where it exists (5 = game-deciding, 1 = skip unless free). Fields with nothing notable are omitted.
- **P column** (engine `roundBuildings`): `1`=solo, `2`,`3`,`4`. **The engine's 2p game (BOTH lengths) uses only the 24 cards whose P contains `2`** — a deliberate implementation choice pinned by tests (`roundBuildings` ignores `length`). Seventeen France cards never appear in 2p: G01, F03, G06, F09, F10, G13, F15, G16, F20, F23, F25, F29, F31, F32, F36, G39, F40. Consequences for 2p: **G34 is the only Wonder route; reliquaries only via F24/F35; no Hospice escape for unbuilt buildings; no Bathhouse recall valve; no Priory.**
- Costs: `w`=wood `c`=clay `st`=stone `sw`=straw `¢`=coins. Terrain default is **C/P/H** = Coast/Plains/Hillside.

## Basic buildings (every heartland; not in any pile)

#### Farmyard (LW2/LR2…) — production wheel: grain OR livestock
`start · E0 D2`
Function: harvest grain or sheep at that indicator's value. **Requires the explicit good:** `USE LW2 Gn` / `Sh` (or `GnJo`/`ShJo` off the joker).
Combos: grain feeds the Windmill chain and flips to straw; sheep feed the Slaughterhouse (with straw) for 5-food meat.
Memories:
- (g8) Clergy-locked start players get stranded off hot Farmyard tokens — don't spend the last home clergy on your first action of a 2-action round.

#### Clay Mound (LW1/LR1…) — production wheel: clay
`start · E0 D3`
Function: harvest clay at the clay indicator's value (bare `USE`).
Combos: clay → G18 ceramics; clay is the cheapest input for G02 triples.

#### Cloister Office (LW3/LR3…) — ☩ · production wheel: coins
`start · E0 D2 · ☩`
Function: harvest coins at the coin indicator's value.
Get it: it's free — and it is the **zero-cost coin printer** most players forget. Strictly better than feeding point-goods into the Market when coin-starved.
Combos: it is a cloister building — the seed the whole ☩ cluster must chain from. Funds work contracts, landscape, financed builds.
Layout: everything ☩ must eventually connect back to this card (or another ☩) — **keep at least one orthogonal space next to the growing cluster open** or you can never build another cloister building.
Memories:
- (g3) Recovery chain from total scarcity starts here: Office → coins → WC opponent's Courtyard → 6 peat → Workshop. Treads water, doesn't win.
- (g8) It empties the coin wheel to 0 — a supplement, not a substitute for real income (Bakery/Winery sales).

## Start buildings (in the display from round 1)

#### G01 Priory — ★★★☆☆ · ☩
`1w+1c · E4 D3 · C/P/H · P 1·3·4 (NOT in 2p) · Start`
Function: **two-step:** `USE G01` seats a LB and grants a FREE bonus USE of any building occupied by a **prior** (yours or an opponent's) — no work-contract fee. Then `USE <target> …` as a second command (`USE G01 G12 ShPt` as one command is rejected).
Get it: cheap, ☩, and the key 4p tempo tool — every opponent prior becomes a free menu.
Combos: opponents' priors on Stone Merchant / Castle / converters; your own prior parked on a favorite engine for re-fires. Also advances your own recall (seats a LB).
WC: opponents can contract YOUR Priory to reach a third player's prior-occupied building (verified g8: red used blue's Priory to fire white's prior-occupied Castle). Owning it invites that.
Count: 4p star (many priors on board); absent in 2p.
Memories:
- (g8, open discrepancy) A bare `USE G01` once seated the prior and granted NO bonus despite prior-occupied targets existing — verify the precondition before relying on it.
- Appendix: build-bonus on G01 is a no-op turn 1 (your own prior is still home; no prior-occupied targets) — skip the bonus, keeping the prior home.

#### G02 Cloister Courtyard — ★★★★☆ · ☩
`2w · E4 D4 · C/P/H · P all · Start`
Function: **3 different goods → 6 identical basic goods** (clay/wood/peat/grain/sheep/coin).
Get it: early. Never a terminal action — its worth is as the *front* of a chain.
Combos: 6 grain → Windmill → 6 flour + 6 straw → Bakery → 6 bread (settlement fuel or ×F24 reliquaries); 6 wood = the Castle's entire wood cost in one USE; 6 peat = 12 energy re-lighting a dead Workshop.
WC: a top rental — opponents (and you, when starved) contract it for fuel/grain injections. Expect income; expect to pay it out too.
Layout: ☩ — an early cheap cluster-grower.
Count: all modes; in solo it's also a free-use candidate during neutral phases.
Memories:
- (g3) Late-game fuel injection: `USE G02 PnClNi Pt` → 6 peat = 12 energy → two G18 cycles = +18 goods. Prefer inputs **PnClNi** over spending wine (save for F24) or ceramic.
- (g8·4p) Syntax is fussy: input triple's token order is fixed (`PnGnCl Wo` legal where `PnClGn Wd` was not) — drill `get_legal_moves ["USE","G02"]`, don't guess.

#### F03 Grain Storage — ★★☆☆☆
`1w+1sw · E3 D4 · C/P/H · P 1·4 · Start`
Function: pay 1 coin → 6 grain (indicator untouched).
Combos: instant Windmill fuel; grain also flips to straw for builds. Appendix: the fast grain start for the flour→bread chain in 4p.
Count: 1p/4p only.

#### F04 Windmill — ★★★★★
`3w+2c · E10 D6 · **Coast/Hillside only** · P all · Start`
Function: flip ≤7 grain → straw sides; take **1 flour per flip** (flour = 1 food).
Get it: **chain-critical — the front of F04→F05→F24, the dominant France win condition.** Target: built (or reliably contracted) by ~round 8 in 2p long.
Cost pain: moderate (3w+2c) — the real gate is **terrain**: no coast/hillside in the starting heartland, so a coast plot or hills district must be bought first. Budget that purchase by round 5–7.
Combos: F05 Bakery (flour→bread), F24 Church (bread+wine→reliquary); the straw byproduct simultaneously feeds G19 Slaughterhouse and F37 Dormitory; G02/F03 mass-produce its grain input. Prior on it flips up to 7 in one action.
WC: high magnet. If the opponent owns it, `WORK_CONTRACT F04 Wn` → `USE F04 GnGn…` every recall cycle is the only flour path — pre-stage the grain before contracting.
Layout: E10 + D6 — also a respectable settlement anchor on a hillside.
Count: all modes. In 4p it's a race card — one copy, four players.
Memories:
- (g5) Red built F04 r9 / F05 r10 and won by 180; white never established the chain. "Build F04 by round 8 or WC it" is the standing rule.
- (g9·4p) White built F04 r6 — correct — but the chain still arrived 15 rounds late because F24's site wasn't prepared. The chain is three buildings AND their sites.

#### F05 Bakery — ★★★★★
`2c+1sw · E4 D5 · C/P/H · P all · Start`
Function: flip flour → **bread** at ½ energy each; may sell ≤2 bread @ 4¢.
Get it: with F04 — the middle of the reliquary chain. The bread sale is also one of the few food→coin taps in 2p.
Cost pain: light. Appendix note: don't sell bread you'll need — the Cloister Church is the reason to hoard it.
Combos: F04 upstream, F24 downstream; peat coal (3 energy) bakes 6 bread per tile.
WC: magnet when the opponent lacks it — the bread pipeline `WC F04 → WC F05` costs ~1 wine + 2¢ + fuel per cycle across two main actions (g5).
Memories:
- (g8·blue) Ended holding flour 9 with zero bread — a built/available Bakery never fired is the canonical stockpile failure.

#### G06 Fuel Merchant — ★★★☆☆
`1c+1sw · E5 D2 · C/P/H · P 1·3·4 (not 2p) · Start`
Function: sell 3/6/9 energy → 5/8/10 coins.
Get it: an early coin engine in modes that have it; pairs with G07 peat coal (3 energy each).
Combos: G07 (coal), moor districts (peat), Calefactory. Appendix: build it turn 1 after `CUT_PEAT` with your prior and you hold 6¢ + 1 sheep — two landscape purchases funded immediately.
Count: 1/3/4p; in 2p use Bakery sales / F30 / Cloister Office instead.

#### G07 Peat Coal Kiln — ★★★☆☆
`1c · E4 **D−2** · C/P/H · P all · Start`
Function: take 1 peat coal + 1 coin; additionally flip any peat → peat coal free.
Get it: the classic 2p turn-1 build (1 clay — cheapest coin-minting tile). Coal (3 energy) is the densest fuel for settlements/Bakery/Workshop/Stone Merchant.
Combos: moors (`CUT_PEAT`), G06 in 3–4p, every energy sink.
Layout: **D−2 — site it interior, away from future settlement pockets.**
Memories:
- (2p opening book) `BUILD G07` + prior bonus `USE G07 Pt` = +1¢, +1 coal, starting peat flipped to coal; economic +4 on turn 1.

#### F08 Market — ★★★☆☆
`2st · E5 **D8** · C/P/H · P all · Start`
Function: **4 different goods → 7 coins + 1 bread.**
Get it: two reasons — the D8 settlement anchor and the coin burst. Stone-gated at a stage where stone only comes from G12/G13, so it doubles as a stone-sink competitor with F17.
Combos: cheap-junk inputs (Pn/Cl/Wo/Sn); the bread side-feed toward F24.
WC: decent rental for liquidity.
Layout: D8 — wedge it between settlement pockets.
Memories:
- **(g3b, −7 pts) F08 is a goods SINK — every input is priced at coin/bread parity. NEVER feed it books/ceramics/ornaments/wine.** Test any unfamiliar 4-input building with cheap inputs only. It is not the Sacristy.

#### F09 Cloister Garden — ★★★★☆ · ☩
`3¢ (financed) · E5 D0 · C/P/H · P 1·3·4 (not 2p) · Start`
Function: +1 grape, then a **free USE of one unoccupied orthogonal neighbor** (once per turn, no clergyman for the free use).
Get it: cheap repeatable double-action; in 3–4p also your grape trickle before/beside the Grapevine.
Combos: whatever you park next to it — Windmill, Courtyard, Church. **Route work contracts through the Garden:** contracting the Garden gets the grape AND the neighbor's effect for the same single fee (verified with the maintainer, g8). Go direct at the target only to deny.
Layout: ☩, D0 — its value is entirely in what it's adjacent to; plan the neighborhood before placing.
Count: 1/3/4p. Solo/4p: free-use gem.
Memories:
- (solo) Engine-verified: the free neighbor use appears under `USE` in `get_legal_moves` even though `bonus_actions` stays `[]`.
- (g8) Made the direct-to-Church WC mistake twice before the routing rule stuck.

#### F10 Carpentry — ★★☆☆☆
`2w+1c · E7 D0 · C/P/H · P 4 only · Start`
Function: remove 1 forest → carry out a free **Build** action.
Get it: only with a forest supply to feed it — an engine with no fuel is dead weight (g8·blue built it, never bought forests).
Combos: hills districts (2 forests each); big-cost builds late.
Count: 4p only (appendix: removed from long 2p for the three-clergy-in-one-turn exploit).

#### F11 Harbor Promenade — ★★★★☆
`1w+1st · E1 **D7** · **Coast only** · P all · Start`
Function: take 1 ceramic + 1 wine + 1 wood + 1 coin — **no input**.
Get it: free +4-ish points per fire plus a D7 coastal anchor. Slow alone (once per recall cycle) — pair with faster engines.
WC: **top WC magnet — a no-input building is +3–4 net per contract for anyone.** Owning it = fee income every cycle; if the opponent owns it, contract it whenever your clergy are idle and nothing advances the win condition.
Layout: coast only — one more reason the early coast plot pays; D7 beside water (D3 each) makes a cheap high pocket.
Memories:
- (g7) Never WC'd the opponent's F11/F37 across ~10 idle-clergy rounds — an uncollected +30–40 floor.
- (g8·green) The Harbor as the ONLY engine tops out ~110 points. Supplement, never backbone.

#### G12 Stone Merchant — ★★★★☆
`1w · E6 D1 · C/P/H · P all · Start`
Function: ≤5×/USE: **2 food + 1 energy → 1 stone**.
Get it: **the 2p stone lifeline** (with G22 the only sources; F29 is 3–4p). Stone gates Castle, Sacristy, Market, Church, F38 — no stone = no win condition (g7's zero-stone cascade lost every endgame engine at once). Build by ~round 10 at the latest.
Cost pain: trivial (1 wood).
Combos: G19 meat / sheep as the food; coal as energy; downstream G28/G34/F24/F08.
WC: strong magnet — everyone needs stone eventually. Owning it = income; their prior parked on it is a Priory/Palace target.
Memories:
- (g4) An early G12 lead means nothing if the stone leaks into G18 ornaments — bank it toward the Castle (see doctrine: stone is gated capital).
- (2p opening book) Natural second build when the heartland has no coast/hillside for F04: unlocks Market/Library by rounds 2–3.

#### G13 Builders' Market — ★★★☆☆
`2c · E6 D1 · C/P/H · P 1·4 · Start`
Function: pay 2 coins → 2 wood + 2 clay + 1 stone + 1 straw.
Get it: a materials burst that includes early stone; appendix calls it the slower-but-cheaper Stone Merchant. **Solo: it belongs to the neutral player** — use it via contract/free-use, don't plan to own it.
Count: 1/4p only.

## A buildings (enter at settlement phase A)

#### F14 Grapevine (A) — ★★★★☆
`1w · E3 D6 · **Hillside only** · P 2·3·4 · A`
Function: production wheel: **grapes** (joker until the grapes indicator enters r8; never a real indicator in solo).
Get it: **the single grape source in 2p** — it gates wine, and wine gates F24 reliquaries, Palace activations, and the WC present. If you're on the reliquary plan, this is non-negotiable.
Cost pain: 1 wood — the gate is a **hillside** (hills district or mountain plot).
Combos: F21 Winery, F24 Church, F27 Palace (1 wine per activation), work-contract presents.
WC: magnet whenever the opponent needs wine; harvesting resets the grape indicator for everyone behind you.
Count: 2p: unique and contested. 4p: F31 adds a second copy at C.

#### F15 Financed Estate — ★★★☆☆
`1c+1st · E4 D6 · C/P/H · P 1·4 · A`
Function: flip 1 coin → book; take 1 bread + 2 grapes + 2 flour.
Get it: one USE quietly stocks half the reliquary chain's inputs plus a book — excellent value per action in the modes that have it.
Combos: F21 (grapes), F05/F24 (bread/flour).
Count: 1/4p only.

#### G16 Cloister Chapter House — ★★☆☆☆ · ☩
`3c+1sw · E2 D5 · C/P/H · P 1·3·4 · A`
Function: take 1 of each of the 6 basic goods.
Get it: diversity in one action — feeds G02, F08, settlement payments. Mediocre alone; fine cluster filler with D5.
Count: 1/3/4p.

#### F17 Cloister Library — ★★★★☆ · ☩
`2st+1sw · E7 **D7** · C/P/H · P all · A`
Function: flip ≤3 coins → books; and/or trade **1 book → 1 meat + 1 wine**.
Get it: the book engine AND a D7 cluster anchor. Competes with F04 in the round 5–8 converter race, not as a secondary pickup.
Cost pain: 2 stone this early = G12 output — plan the stone.
Combos: books → G34 Sacristy Wonder; the meat+wine clause feeds settlements and F24; F23/recall to re-fire.
WC: magnet for book/wine access.
Memories:
- (g3) Compound move: `PnPnPnBo`-style (flip 3 → books, trade 1 → meat+wine) nets ~+5 pts + 5 food + 1 wine per USE.
- (g7, final turn) With no downstream use for meat/wine, the simple flip `PnPnPn` (+6) strictly beats the compound (+5) — the compound only wins when the meat/wine has a job.

#### G18 Cloister Workshop — ★★★★☆ · ☩
`3w · E7 D2 · C/P/H · P all · A`
Function: flip ≤3 clay → ceramic (3 pts each) and/or 1 stone → ornament (4 pts), **1 energy per tile**.
Get it: the steady goods-column engine — reliable +9 to +13 per fire with clay and fuel.
Combos: Clay Mound (clay), G07 coal / moors (energy), F30 (ceramic→12¢ cash-out), G34 (ceramic+ornament ingredients), F23 recall loops.
WC: magnet — opponents rent it for ceramics; they may also contract it purely to DENY you a cycle (g3: red shut a re-lit Workshop with one WC at the decisive moment).
Layout: ☩; D2 is nothing — interior is fine.
Memories:
- (g3) Clay-limited, not hard-capped: 1 ornament per USE max, ceramics up to clay on hand. A small stone reserve (~3) covers ornaments for a whole endgame — don't over-mine for them.
- **(g4, doctrine) Do NOT feed Castle stone into ornaments.** 1 stone → +4 is a catastrophic trade against a 15–25 VP Castle settle.
- (g6) When wood is both your settle fuel and your only energy, one settlement (~13) dwarfs a few ceramics — only burn wood here once settling is over.

#### G19 Slaughterhouse — ★★★★☆
`2w+2c · E8 **D−3** · C/P/H · P all · A`
Function: flip livestock → **meat** (5 food), **1 straw each**.
Get it: the food engine that powers expensive settlements and the Castle cannon — 2 food in, 5 food out.
Combos: Farmyard sheep + Windmill straw byproduct; G28 Castle (meat is the clean settle payment); G12 (meat = stone food).
WC: rented by anyone staging a big settle.
Layout: **D−3 — keep ≥2 tiles from every settlement pocket.**
Memories:
- (g3) Red's Castle spam ran on stockpiled meat — 5-food tiles are what make per-turn settles affordable.
- Reserve a straw or two if a build this turn needs it; otherwise run all pairs.

## B buildings

#### F20 Inn — ★★★☆☆
`2w+2sw · E4 D6 · C/P/H · P 1·3·4 · B`
Function: sell ≤7 food @ 1¢ each; and/or 1 wine @ 6¢.
Get it: the food→coin tap for modes that have it; solid D6.
Count: 1/3/4p; 2p relies on Bakery/F30 instead.

#### F21 Winery — ★★★★☆
`2c+2sw · E4 D5 · C/P/H · P all · B`
Function: flip grapes → **wine**; sell 1 wine @ 7¢. **Building it raises the work-contract price to 2¢ for ALL players, permanently.**
Get it: three compounding effects — captures the wine chain (wine = 1 food + 1 coin + 1 pt), taxes every future WC on the table, and arms the wine-present denial (1 wine to supply beats paying 2¢ to the opponent).
Combos: F14 upstream; F24, F27 Palace, WC presents downstream.
WC: post-build, opponents needing wine must come to you at the raised price.
Count: the WC tax hits 1 opponent in 2p but 3 in 4p — earlier build, bigger table tax. Time it for when *you* rely on contracts least.
Memories:
- (g5) Target: F05 + F21 online by ~round 11 in 2p long if running the reliquary plan.

#### G22 Quarry (B) — ★★★☆☆
`5¢ (financed) · E7 **D−4** · **Mountain only** · P all · B`
Function: production wheel: **stone**.
Get it: the volume stone source — but the stone indicator only enters r13 (France long; joker before that), and it needs a mountain plot.
Cost pain: 5 coins + the mountain plot purchase.
WC: **prime late-game rental: `WORK_CONTRACT G22 Wn` → `USE G22` at stone 7 = 7 stone for one wine** (g7's missed play). Owning it makes YOU the stone landlord.
Layout: **D−4, the worst in the game** — mountain plots are naturally peripheral; keep settlements off the adjacent hillsides or eat the leak.
Memories:
- (g3) `USE G22` at stone-wheel 0 = wasted action + clergyman. Check the indicator first; use G12 for on-demand stone.
- Not a prestige build — mountain-only placement implies nothing about value.

#### F23 Bathhouse — ★★★☆☆ · ☩
`1st+1sw · E2 D6 · C/P/H · P 1·4 (NOT in 2p) · B`
Function: flip 1 coin → book, +1 ceramic; **immediately recall ALL your clergy**.
Get it: the mid-turn recall valve — the soft-lock escape and the engine-loop accelerator (Workshop/Library re-fires without waiting for the round wave).
Combos: G18/F17 loops; any turn your prior must come home for a build-bonus.
Count: 1/4p only — **in 2p there is no recall valve; clergy discipline must be perfect.**
Memories:
- **(solo, hard-won) The recall requires the coin: `USE F23 Pn`. Bare `USE F23` seats a clergyman and does NOTHING** — this exact mistake fed the 192-point soft-lock. Keep ≥1¢ reserved if F23 is your reset plan.

#### F24 Cloister Church — ★★★★★ · ☩
`5c+3st · E12 **D9** · C/P/H · P all · B`
Function: ≤2×/USE: **1 bread + 1 wine → 1 reliquary** (8 pts). Highest dwelling value in the game.
Get it: **the terminal of the dominant chain (F04→F05→F24) and the best settlement anchor. It is unique — treat it as a RACE, not a project.** If you can build it now, build it now; two rounds of visible preparation (cloister-adjacent district, stone mining) hands a faster opponent the card (g3 lost exactly this way).
Cost pain: steep (5c+3st) and it's ☩ — the cloister-adjacent site must exist BEFORE the card is affordable. Prepare the site by phase B.
Combos: bread from F05 (or F08 side-feed), wine from F21; D9 wants 2–3 settlements wrapped around it; G34 consumes the reliquaries into Wonders.
WC: the sharpest denial target in 2p — **an opponent can WC it with no bread/wine, parking THEIR clergy on it just to freeze your engine for the closing turns (2¢ well spent — it closed g3b).** Counter: keep your own prior resident on it across the endgame, even firing it barren to deny the denial. Conversely, if the opponent owns it, contract it the turn it's built to steal the first firing.
Memories:
- **(g3b, −5 pts) Inputs are BREAD + WINE (`USE F24 BrWn`) — not book + wine.** Pre-stage the bread before building or contracting it; a barren USE fires legally and produces nothing.
- (g9) White's F24 landed r14 but the first firing was forfeited — no bread in hand on the BUILD turn. The build-bonus is half the value; stage inputs first.

#### F25 Chamber of Wonders — ★★☆☆☆
`1w+1c · E0 D6 · C/P/H · P 1·4 · B`
Function: **13 different goods → 1 Wonder** (30 pts).
Get it: cheap, and in 1p/4p it's the second Wonder route. The 13-goods hoard conflicts with converting stockpiles — commit or skip.
Combos: G16 Chapter House / G02 for diversity; remember grain and straw count as different goods (flip one).
Count: 1/4p; **in 2p it doesn't exist — G34 is the only Wonder.**

#### G26 Shipyard — ★★★☆☆
`4c+1st · E15 **D−2** · **Coast only** · P all · B`
Function: 2 wood → 5 coins (a nickel, 2 pts) + 1 ornament (1×/turn).
Get it: E15 is huge standing value and each fire is ~+6. But it **plateaus**: once-per-turn, and its ornaments only compound with a downstream multiplier.
Combos: forests/districts (wood), G34 (ornaments), F27 Palace funding (nickels).
WC: magnet — wood is cheap for everyone.
Layout: coast; D−2 — keep off the settlement pocket side of your coast.
Memories:
- (g4) Four contracted fires = 4 ornaments + 4 nickels that never multiplied — 16 flat VP. Without a Sacristy plan, treat it as coins, not a strategy.

## C buildings

#### F27 Palace — ★★★★☆
`25¢ (financed) · E25 **D8** · **Hillside only** · P all · C`
Function: pay 1 wine → **USE any occupied building** (yours or anyone's), no work-contract, no clergyman.
Get it: the anti-work-contract engine and the Castle doubler. E25 nearly repays the sticker alone; D8 anchors a pocket.
Cost pain: 25 coins — start banking in the B/C rounds (Cloister Office, Bakery sales, F30, G26) or it stays theoretical. Appendix: keep 1 wine on hand when you build it.
Combos: **G28 Castle (fire it twice per turn: once by clergy, once by Palace — red's g5 endgame), F14/F21 (the wine supply), any opponent engine you're locked out of.** Defeats blocking: an occupied building is exactly what it CAN reach.
Layout: hillside only; D8 between settlements.
Count: strong everywhere; in 4p the occupied-building menu is naturally larger.
Memories:
- (g4, g5) Two straight games identified it in hindsight as the unused axis. Budget toward it deliberately or drop it early — 25¢ doesn't happen by accident.

#### G28 Castle — ★★★★★
`6w+5st · E15 D7 · **Hillside/Mountain** · P all · C`
Function: **build 1 settlement** from your supply, paying its food + energy.
Get it: **the settlement cannon — the single highest-VP repeatable engine in long games.** The only settle route after the phases end; the only Hilltop Village route in 2p; the cure for stranded settlement cards (every mode). Fire it every recall cycle for 15–25 VP a shot.
Cost pain: heavy and slow — 6 wood (one G02 USE) + 5 stone (a G12 project or G22 harvest) + a hill/mountain site. **Secure the SITE before the stone: a mountain plot bought early beats stone banked with nowhere to build (g9·green had 6+6 materials and no legal tile).** Target: buildable by ~round 18–20 in 2p long.
Combos: G19 meat (clean 5-food payments), F27 Palace (second fire per turn), G12/G22 (stone), G02 (wood). Castle settles do NOT advance the endgame trigger — you can spam it without shortening the game.
WC: magnet — opponents without one will contract yours to place their own settlements (fee income, but it hands them 15+ VP; in 4p consider whether the fee is worth it… you can't refuse, so mostly: keep your own clergy OFF it only when safe).
Layout: **seat a LAY BROTHER on it, not the prior** — a prior parked on the Castle is a door for anyone with a Priory/Palace (g8: red fired white's prior-occupied Castle through blue's Priory and stole a Hilltop-tier settle).
Memories:
- (g2) Contracted-Castle protocol verified (+17 in one turn); (g4) opponent's self-owned Castle from r24 = 7 settlements vs my 4, a ~90-pt column swing. This is what hoarded stone is FOR.
- (solo) In solo you accumulate more settlement cards than phases — a Castle is near-mandatory to avoid stranding.

#### F29 Quarry (C) — ★★★☆☆
`5¢ · E7 **D−4** · Mountain only · P 3·4 · C`
Function: second stone production wheel.
Count: 3–4p only — stone stays scarcer in 2p; plan accordingly there.

#### F30 Town Estate — ★★★☆☆
`2st+2sw · E6 D5 · C/P/H · P all · C`
Function: sell 1 ceramic → **12 coins** (1×/turn).
Get it: the best liquidity converter in the game — one G18 ceramic funds six work contracts or half a Palace instalment.
Combos: G18 (ceramic supply), F27 (coin sink), F35 (coin dump into reliquaries).
WC: strong rental when coin-starved — one visit cures it (g3 recovery chain).

#### F31 Grapevine (C) — ★★★☆☆
`1w · E3 D6 · Hillside only · P 4 · C`
Function: second grapes wheel. 4p only — relieves the F14 monopoly there; in 2p/3p F14 stays unique.

#### F32 Calefactory — ★★☆☆☆ · ☩
`1st · E2 D5 · C/P/H · P 1·3·4 · C`
Function: pay 1 coin → BOTH a free `FELL_TREES` and a free `CUT_PEAT` drop into `bonus_actions`.
Get it: cheap ☩ filler that doubles fuel actions. Only cashable while you still own forest/moor tiles — the one bonus that can legitimately lapse.
Memories:
- (solo) **Bare `USE F32` does nothing — you must pay: `USE F32 Pn`.** Another contributor to the 192 soft-lock.

#### F33 Shipping Company — ★★★☆☆
`3w+3c · E8 D4 · **Coast only** · P all · C`
Function: pay 3 energy → joker-wheel production of **meat, bread, OR wine** (your choice; resets the joker).
Get it: the flexible refined-food tap — late bread/wine without the full chain, meat without sheep.
Combos: F24 (bread OR wine on demand), settlements (meat), Palace (wine). Appendix: with it in play, watch the joker — it becomes contested.
Memories:
- (g7) The F33-wine → Castle-WC → SW4 settle chain netted +13 in one turn — its best use is feeding a settle/Church turn, not idle production.

## D buildings

#### G34 Sacristy — ★★★★★ · ☩
`3st+2sw · E10 D7 · C/P/H · P all · D`
Function: **book + ceramic + ornament + reliquary → 1 Wonder** (30 pts; net ~+13 over inputs), 1×/turn.
Get it: **the only Wonder route in 2p.** A mid-game COMMITMENT, never a round-D hail-mary: by D you need (a) a cloister-adjacent open plot already reserved, (b) a reliquary source already running (F24 or F35), (c) stone and fuel intact. Lay those rails in the B/C rounds or skip the line entirely.
Combos: F17 (book), G18 (ceramic + ornament), F24/F35 (reliquary), F23 recall loops in 1/4p. A single Sacristy re-fires only as fast as you re-collect four ingredients — caps around +30–60 VP; it AMPLIFIES a scoring engine, it isn't one.
WC: opponents with the four goods and no Sacristy must rent yours.
Layout: ☩ — the classic failure is a boxed-in cloister with no legal site (g3).
Memories:
- (g4) Chain verified end-to-end: `USE G34 BoCeOrRq` → Wonder. **Engine quirk: the build accepted grain in place of straw** (Part VI #6) — grain is far cheaper to mass; exploit until fixed.
- (g3, observed) Red's killing block: Quarry→10 stone, BUILD G34, USE G34 — ~+30 and it advanced termination too.

#### F35 Forger's Workshop — ★★★★☆
`2c+1sw · E4 **D2** · C/P/H · P all · D`
Function: buy reliquaries in ONE USE: 5¢ for the first, +10¢ each thereafter — `reliquaries = 1 + floor((coins − 5) / 10)`. 35¢ → 4 reliquaries (+32 gross); 105¢ → 11.
Get it: the coin-dump converter — turns a fat treasury into the goods column in a single action, and the second reliquary source in 2p.
Combos: F30/G26/F08 (coin engines), G34 (reliquary ingredient).
WC: **THE coin-sink threat.** When an opponent's coins exceed ~25 and F35 is available/built, model their next action as a reliquary dump — contract it the turn it's built to deny (2¢ vs 10+ pts per denied cycle). Symmetrically, expect them to deny yours.
Layout: **D2 — a runt anchor.** "It's an F-building" implies nothing about dwelling value; check the D column, never the name.
Memories:
- (g3b, winner's side) `BUILD F35 ClCl` + prior bonus `USE F35 Pn×15` = **+18 in one turn** — the best single turn of that series. Engine accepted 2 clay with zero straw (Part VI #13).
- (g3b, loser's side) Its unread card sat in the display for turns; a 2¢ defensive WC on the build turn would have flipped a 4-pt loss.
- (g9·green, −8) Fired blind with point-goods at risk — it takes COINS, nothing else. Read the dossier before the USE.
- (Part VI #12) One-clergy building: a second USE needs an actual recall first; the enumerator may offer it anyway — check `clergy_at_home`.

#### F36 Pilgrimage Site — ★★★★☆
`6¢ (financed) · E2 D6 · C/P/H · P 1·3·4 (NOT in 2p) · D`
Function: upgrade book→ceramic→ornament→reliquary, up to **2 steps** across ≤2 trades per USE.
Get it: quiet gold in 1/3/4p — ceramic (3) → reliquary (8) is **+5 per tile**; a ceramic stockpile becomes a reliquary rack.
Combos: G18 (ceramic mass), F17 (books), G34 (reliquary sink).
Count: **absent in 2p** — there the ceramic→reliquary path simply doesn't exist; don't plan it.
Memories:
- (g8·green, ~−40) Built it, never used it, sat on ceramic 8. Declined `USE F36 Ce` out of unfamiliar-converter caution — the dossier existed precisely to answer that. Identify, then fire.

#### F37 Dormitory — ★★★☆☆ · ☩
`3c · E3 D4 · C/P/H · P all · D`
Function: take 1 ceramic; then **1 straw + 1 wood → 1 book**, repeatable.
Get it: cheap ☩ with a free ceramic per fire and a junk→book mill (grain flips supply the straw).
Combos: Windmill straw byproduct, forests, G34.
WC: minor magnet — the free ceramic is +3 net per contract for anyone idle (same logic as F11; collect it, and expect visitors).

#### F38 Printing Office — ★★★★☆
`1w+2st · E5 D5 · C/P/H · P all · D`
Function: remove ≤4 forest cards from your landscape → **1 book each** (forests are consumed, spaces become plains).
Get it: the endgame forest cash-out — up to +8 goods in one USE plus cleared build space.
Combos: hills districts held unfelled; G34 (books). Tension: every forest felled earlier for wood is a book not printed — late districts can be bought AS book fuel.
Layout: D5 is respectable.
Memories:
- (g5, observed) Red's r26 BUILD+USE = +8 goods +5 econ in one turn. Build only after stone is no longer needed for G28/G34.

#### G39 Estate — ★★★☆☆
`2w+2st · E5 D6 · C/P/H · P 1·4 · D`
Function: ≤2×/USE: **10 food OR 6 energy → 1 book + 1 ornament** (+6 per set, +12 per USE).
Get it: the surplus dump for food/energy in 1/4p endgames.
Count: 1/4p only.
Memories:
- (g9·blue) Built with zero fuel — bonus USE fired into nothing, two turns lost gathering. **Pre-stage 6+ energy BEFORE the build** (6 peat = 12, plenty); the bonus alone is +12 if fed.

#### F40 Hospice — ★★★★☆ · ☩
`3w+1sw · E7 D5 · C/P/H · P 1·3·4 (NOT in 2p) · D`
Function: use the function of any **unbuilt** (display) building, free.
Get it: a sparse-board multiplier — its menu is every building nobody built. In 4p, where most of ~40 cards never get erected, it's a free best-pick every cycle (red's g8 endgame staple). Weak on a dense board.
Count: strongest in 4p; absent in 2p (uncovered buildings there are permanently unavailable).
Memories:
- (g8) Your own under-building directly arms the opponent's Hospice — another reason to build wide.

#### G41 House of the Brotherhood — ★★★☆☆ · ☩
`1c+1st · E3 D3 · C/P/H · P all · D`
Function: pay 5¢ → **2 pts per cloister building you built** (3–4p; **1½ in long 2p, 1 in solo**).
Get it: the cloister-cluster payoff card — 6 own ☩ buildings = +12 (4p). Cheap; D3 runt.
Combos: every ☩ you built; it counts itself and the Cloister Office. Points may be taken as books/ceramics/ornaments/reliquaries — no "trading up" (can't take 1 reliquary for 6).
Layout: needs the cluster to still have an open adjacency to build INTO — the boxed-cloister failure again.
Count: rate scales with player count; in solo it's half-strength.

## Cloister buildings (☩) at a glance

Cloister Office (basic) · G01 Priory · G02 Courtyard · F09 Garden · G16 Chapter House · F17 Library · G18 Workshop · F23 Bathhouse · F24 Church · F32 Calefactory · F37 Dormitory · G34 Sacristy · F40 Hospice · G41 Brotherhood. One connected cluster per player; **every future ☩ build needs an open space orthogonal to the cluster — protect one at all times** (the #1 cause of dead Sacristy/Church plans). G41 pays per ☩ built, so cluster size is itself a scoring resource; the high-D church complex (F24 D9, F17 D7, G34 D7) makes the cluster edge premium settlement real estate.

## Terrain restrictions at a glance

- **Coast only:** F11, G26, F33, Fishing Village (S04). **Coast/Hillside:** F04. **Hillside only:** F14/F31, F27, Hilltop Village (S08). **Mountain only:** G22/F29. **Hillside or Mountain:** G28. Everything else: Coast/Plains/Hillside. Settlements never on Mountain/Water.

---

# PART III — SETTLEMENTS & LANDSCAPE

## Settlement reference (engine-verified; cost = food + energy, excess wasted)

| ID | Settlement | Stage | Food | Energy | E | D | Terrain | Notes |
|----|-----------|-------|------|--------|---|---|---------|-------|
| S01 | Shanty Town | Start | 1 | 1 | 0 | **−3** | C/P/H | Own −3 leaks to each ADJACENT SETTLEMENT (not buildings) — fine in a high-D building pocket, never beside another settlement |
| S02 | Farming Village | Start | 3 | 3 | 1 | 1 | C/P/H | |
| S03 | Market Town | Start | 7 | 0 | 2 | 2 | C/P/H | Zero energy |
| S04 | Fishing Village | Start | 8 | 3 | 4 | 6 | **Coast** | + water (D3 each) = cheap high pocket |
| S05 | Artist's Colony | A | 5 | 1 | **−1** | 5 | C/P/H | Negative economic value |
| S06 | Hamlet | B | 5 | 6 | 3 | 4 | C/P/H | |
| S07 | Village | C | 15 | 9 | 8 | 6 | C/P/H | |
| S08 | Hilltop Village | D | 30 | 3 | 10 | 8 | **Hillside** | In 2p ONLY placeable via the Castle |

## Placement doctrine

1. **Scout before paying — placement is irreversible.** Enumerate every legal (settlement × location × payment) via `get_legal_moves`; sum own D + all orthogonal Ds.
2. **Checkerboard compounds hardest:** alternate settlements with high-D buildings (`S–B–S–B`) so every card pays multiple neighbors. A tile touching ≥2 of your settlements beats a higher-D tile in isolation (g8: +23 triple-cluster; g3: +10 off the cheapest piece in the box).
3. **Anchors:** F24 (9), F08/F27 (8), F11/F17/G28/G34 (7), Hilltop (8), Fishing Village (6), Water (3, free). **Traps (keep settlements ≥2 away):** G22/F29 (−4), G19/S01 (−3), G07/G26 (−2).
4. **Save the hillsides.** High-D anchors and the Hilltop need open adjacent plots at phase C/D; burying every hillside under early buildings forfeits the compounding column (g3's decisive error).
5. **Payment = min-cost covering.** Prefer zero-point goods (grain/sheep/bread/meat); wine forfeits 1 pt, each nickel 2. When food divides by 5, `Mt×n + Co` or `Ni×n + Co` is exact-fit (g7: red's `SETTLE SR8 5 0 MtMtMtMtMtMtCo` = zero waste, zero points forfeited).
6. **Pre-stage energy before every settle phase.** Food-with-zero-energy settles nothing (g9·blue forfeited phases B–D holding plenty of food). Keep a moor or forest alive so energy is one main action away.

## Landscape doctrine

- **Buy land FIRST — everything else stands on it** (g9's universal lesson: the winner bought six rows in rounds 2–4 at 3–4¢; every losing color bought ≤1, late, and forfeited settle phases to saturation). Prices ramp with each purchase, so late buyers pay most for least. Targets: **first district by ~round 4, two by round 8; a coast plot by 6–8** (water D3 + F04/F11 unlock); **a mountain plot before the Castle's stone arrives**.
- A district is simultaneously fuel (forests/moors), build space, and settlement real estate; a plot purchase is a settlement-pocket AND Castle/Hilltop decision. Buying is a FREE action — it never costs tempo, only coins.
- Hills side for fuel + hillsides; plains side for maximum open space.
- Fuel discipline: once the moors are cut out, peat is gone and every energy engine stalls — retain a moor, buy a moor district, or keep G02 access.

---

# PART IV — GOODS REFERENCE (engine-verified)

**Coins, wine (and whiskey) count as food.** Energy: peat coal 3, peat 2, wood 1, straw ½.

| Good | Food | Energy | Coin | Pts | Key sources | Used for |
|------|:----:|:------:|:----:|:---:|-------------|----------|
| Grain | 1 | – | – | 0 | Farmyard, G02, F03 | flip→straw; F04 flour; diversity inputs |
| Straw | – | ½ | – | 0 | flip grain (free), G13 | builds; G19; F37 |
| Wood | – | 1 | – | 0 | fell trees, G02, G13, F11 | builds; energy; G26 |
| Clay | – | – | – | 0 | Clay Mound, G02, G13 | builds; G18 ceramic |
| Peat | – | 2 | – | 0 | cut peat, G02 | energy; G07 coal |
| Peat coal | – | 3 | – | 0 | G07 | densest energy |
| Livestock | 2 | – | – | 0 | Farmyard | food; G19 meat |
| Penny | 1 | – | 1 | 0* | Cloister Office, sales | land, WCs, financed builds, flip→book |
| Nickel | 5 | – | 5 | **2** | trade 5 pennies, G26 | liquidity; food (forfeits 2 pts) |
| Stone | – | – | – | 0 | G22/F29, G12, G13 | gates F08/F24/G28/G34/F38; G18 ornament |
| Grapes | 1 | – | – | 0 | F14/F31, F15 | F21 wine |
| Flour | 1 | – | – | 0 | F04 | F05 bread |
| Meat | 5 | – | – | 0 | G19, F17, F33 | settle food |
| Bread | 3 | – | – | 0 | F05, F08, F33, F15 | F24 reliquary; settle food |
| Wine | 1 | – | 1 | **1** | F21, F11, F17, F33 | F24; **F27 Palace**; WC present |
| Book | – | – | – | **2** | F17/F23/F15 (coin flips), F38, F37 | G34 |
| Ceramic | – | – | – | **3** | G18, F11, F23, F37 | G34; F30→12¢; F36 upgrade |
| Ornament | – | – | – | **4** | G18, G26, G39 | G34; F36→reliquary |
| Reliquary | – | – | – | **8** | F24, F35, F36 | G34 |
| Wonder | – | – | – | **30** | G34; F25 | pure points (8 exist) |

\* 5 loose pennies → 1 nickel = 2 pts at scoring.

**Core chains:** reliquary: grain →F04→ flour →F05→ bread; grapes →F21→ wine; bread+wine →F24→ reliquary. Wonder: Bo+Ce+Or+Rq →G34 (or 13 goods →F25 in 1/4p). Goods loop: clay+energy →G18 ceramic, stone+energy →G18 ornament, coins →F17 books. Food: sheep+straw →G19 meat. Liquidity: F30 ceramic→12¢, F05 bread sales, G06/F20 (non-2p), Cloister Office. Stone: G12 (on demand) + G22/F29 (wheel).

---

# PART V — STRATEGY DOCTRINE

## V.1 Name the win condition before move 1 (the anti-drift rule)

Seven straight 2p losses shared one profile: competent goods/economic engine, buried by 90–120 points of settlements+economic. Knowing "settlements compound" did not fix it — only opening commitment does. **Before the first move, state ONE of:**

1. **Castle-settle** — route stone + a hill/mountain plot toward G28 by ~r18; settle every recall cycle; G19 meat as fuel; F27 to double-fire.
2. **Reliquary chain** — F04 by ~r8, F05+F21 by ~r11, F24 the instant its cloister site is ready (it's a race); Sacristy optional on top.
3. **Cloister-cluster** — pack ☩ high-D anchors, wrap settlements around them, cash G41; Sacristy rails laid in B/C.

Every early action serves the named plan; "balanced economic development" is the documented losing pattern, treat drift as a bug.

**Round-8 checkpoint (2p):** (a) do I own or reliably WC F04? (b) is a settlement cluster forming beside a high-D anchor? (c) is stone banking toward a Castle OR the reliquary chain online? **Two "no"s = you are losing — pivot THIS round.**

**Column audit every ~5 rounds:** read all three score columns; pivot INTO the one running away from you. Never pour actions into a column you already lead (g6: tied economic, won goods, lost settlements 33–153). Goods scale linearly; settlements and economic compound.

## V.2 Action economy

- Every conversion answers "what do I gain in points or unblocked bottleneck?" — "flexibility" is a trap. Pure A→B→A cycles are action theft.
- **The BUILD + prior-bonus USE with inputs already staged is the strongest turn in the game** (+18 and +30 observed). A build whose bonus fires into missing inputs is half value — gather inputs the turn BEFORE the build. The build-bonus requires the prior HOME at build time.
- Watch `bonus_actions` every turn; spending a granted bonus is the default (F09 grape+neighbor, F40, G28 settle, Calefactory fell/cut). Letting one lapse is almost always wrong.
- Never pay a WORK_CONTRACT without a concrete same-turn USE plan; never COMMIT with the main action unspent.

## V.3 Clergy

- Prior → build-bonuses and volume converters (F04/F05/G19/F17); Lay Brother → ordinary production, and ALWAYS the response to opponents' work contracts (`WITH_LAYBROTHER`).
- Recall discipline: place all three in a round to recall next round; in 2p there is no Bathhouse — perfect discipline or stranded clergy.
- Keep the prior OFF the Castle (Priory/Palace theft vector) and, in endgames, ON your F24 (denial-WC counter).
- Soft-lock rule: never end a turn with zero coins + zero free clergy + nothing fellable.

## V.4 Work-contract playbook

- **Rentals (steady +3–4/action when idle):** F11 Harbor, F37 Dormitory (no-input outputs); G02 (fuel/grain injection); F30 (12¢ liquidity); G22 late (`WC G22 Wn` at stone 7 = 7 stone for one wine).
- **Chain access:** F04/F05 bread pipeline when the opponent owns the chain — pre-stage grain/flour/fuel; two main actions per cycle.
- **Denial (2p specialty):** contract the building the opponent most needs free, timed for that turn — their engine (g3's Workshop shutoff), a fresh F35 when their coins > ~25 (the coin-sink threat window), or a barren F24 park in the closing turns. Denial leverage SCALES DOWN with player count: in 3–4p, advancing your own board usually dominates hampering one of several rivals.
- **Payment:** wine present > coins once F21 exists (saves 1¢ AND denies income). The engine makes change from nickels.
- **Multi-color note (running several seats):** in-family WCs move the fee between your own colors (net zero) and can deliberately trip the contracted color's recall.

## V.5 Opening books

**2p long, start player (2 actions):**
1. `BUILD G07` central-interior + prior bonus `USE G07 Pt` (+1¢ +1 coal, peat flipped; economic +4). 2. `FELL_TREES` (wood is the broadest build input; frees a plot; clergy-free).
Then: G12 for stone → F08/F17 if the heartland lacks coast/hillside; coast plot ~r4–5 to unlock F04 and the water pocket. Alternative turn-1 builds: G12 (stone race), G02 (chain front). Keep re-deriving against the opponent — an opening blind to their development is a memorized line waiting to be punished.

**4p long:** start player's 2 actions are SPLIT (first and last turn of the round) — a build+bonus must fit in one turn, and hot wheel tokens may not survive to your second. Full 41-card deck is live; round-1 display: G01 G02 F03 F04 F05 G06 G07 F08 F09 F10 F11 G12 G13. With multiple Claude colors: diversify win conditions by pick order (opener grabs the scarcest engine, e.g. G12; later seats take the Windmill chain or the cloister-cluster); don't point two colors at the same hot token; use `Jo` to harvest while PRESERVING a good's token for a later-acting friendly color (and to drain the shared joker away from the human).

**Solo:** converter window slides to ~rounds 10–16 (no rival draining the display). Two solo-only mechanics dominate planning: (1) **each settlement phase force-builds the entire display onto the NEUTRAL board first** — land your heavyweights on YOUR board in the 1–4 rounds before each phase or forfeit their economic value; (2) **during each phase you may use one neutral building FREE** (if the neutral prior is free) — claim it every time (Builders' Market, Grain Storage, Fuel Merchant, Slaughterhouse). Land prices FALL over time (reversed piles). Surplus settlement cards make the Castle near-mandatory.

## V.6 Tempo milestones (2p long pacing check)

| Rounds | Economy | Clergy | Settlements |
|--------|---------|--------|-------------|
| 3–5 | coins (G07/G12); first converter | prior + 1 LB working | 1st settle only if clearly positive |
| 6–8 | 2nd converter (F04/F05/G19); **round-8 checkpoint** | all 3 cycling | 1–2 placed, cluster forming |
| 9–11 | F17/F21; chain scaling; stone source live | clean cycles | 2–3 placed |
| 12+ | engine self-sustaining; bank toward G28/F27/G34 | prior reserved for build-bonuses | remaining via phases + Castle |

## V.7 Endgame

**Final-action menu (run the argmax explicitly before the last COMMIT):** Castle settle (often max, +17…+25) > F24 (+7/set, ≤2) > G34 (+13) > G18 (≤+13 gross) > F35 (+6 first 5¢, +4 per +10¢) > F38 (≤+8) > G41 (1½/☩ in 2p long) > F37 (+3, +2/set) > coin ticks. Terminal turns: Δscore is the only objective — any zero-Δ action is dominated; basics-only outputs are zero.

**Termination control (2p long: display ≤3 after D ends the round):** ahead on rate → prolong (don't build the display down); behind → BUILD it down aggressively (BUILD needs no clergy — always available). Castle settles do NOT advance the trigger — a leader can spam settles indefinitely unless you close the display. While display > 3, `upcoming_turns` is a FLOOR, not a ceiling — "final" rounds extend; plan 3–5-turn chains, don't burn the first extra turn on a coin tick (g7).

**Saturated-board goods pivot (when settles are unaffordable):** Clay Mound → G18 ceramics, coins → F17 books, F23 recall loops (1/4p), F08 one-shot for liquidity — +46 goods in the solo recovery. It treads water against a compounding opponent; it's a floor, not a comeback.

**Phase-D shock (confirmed 3×):** phase D introduces ALL D-tier buildings AND both players' S08 simultaneously — the build pool doubles exactly when settle pressure peaks. Read `upcoming_turns[*].introduced` before planning any phase-D action.

---

# PART VI — ENGINE & MCP OPERATIONS

## MCP workflow

1. `get_legal_moves([])` → available verbs; drill down (`["SETTLE"]` → pieces → coords → payment bundles) for full enumeration; execute via `make_move`.
2. **Ground truth is the `get_game` frame** (`clergy`, `bonus_actions`, `usableBuildings`, coins, `upcoming_turns`), NOT the enumerator — see quirks 1/7/12. `upcoming_turns` entries `{round, player, settle, bonus, introduced}` are read straight off the engine's Flower/Frame list — never compute round letters from memory. Divergences between rulebook and engine surface at Frame boundaries (phase timing, introductions, termination) — watch those spots.
3. After any human rollback, re-fetch `get_game` (`move_count` is the staleness check).
4. Landscape-tile convention: `L`-prefixed tiles ship with land — `LMO` moor, `LFO` forest; distinct from L-numbered starting BUILDINGS (`LW1` Clay Mound, `LW2` Farmyard, `LW3` Cloister Office, per color).

## USE command grammar (engine-verified)

- **Clergy:** bare `USE <bldg>` auto-seats a **lay brother**. For the Prior, issue standalone `WITH_PRIOR` first, then `USE <bldg>`.
- **Wheel token:** trailing `Jo` harvests at the JOKER's value and resets the JOKER (good's own token preserved) — only when joker ≥ the good's value. Governs Clay Mound, Cloister Office, Farmyard, F14, G22. **Farmyard needs the explicit good:** `Gn`/`Sh`/`GnJo`/`ShJo`.
- Some trailing tokens are conversion INPUTS, not wheel selectors (`USE G07 Pt` flips peat→coal) — read the dossier first.
- **The bare-verb `""` completion is usually a NO-OP** — occupy the building, do nothing, action + clergyman wasted. Always pass explicit tokens. Known traps: `USE F23 Pn` (bare = no recall), `USE F32 Pn` (bare = no bonus), G19 needs paired sheep+straw.
- Unaffordable-leaf signature: completions `[""]` with `partial_is_complete_command: false` = valid tile/verb, cannot afford — never "send it".

## Castle protocols (verified sequences)

Opponent-owned: `WORK_CONTRACT G28 <pay>` (their clergy mans it; you may pay `Wn`) → `USE G28` (→ `bonus_actions: ["SETTLE"]`; not legal before this) → `SETTLE <S> <col> <row> <pay>` → `COMMIT`. One turn; the USE costs no second main action; COMMIT early forfeits the settle.
Self-owned: `BUILD G28 <col> <row>` → prior bonus `USE G28` → `SETTLE …` → `COMMIT`; then re-fire every recall cycle free. Strictly better than renting — no fee, no opponent income, repeatable.

## Engine quirks & suspected bugs (numbered; append new ones)

1. **Phantom SETTLE legality:** `get_legal_moves` enumerates SETTLE completions even when no settle is active; the executor rejects. Truth: `bonus_actions` / `upcoming_turns[0].settle`.
2. Empty-string completion + `partial_is_complete_command: false` = syntactically complete, semantically unverified.
3. Post-rollback state is stale — re-fetch.
4. `join_game` takes `instance`, not `instance_id`.
5. Round Tower dwelling = 2 in current source (historical 9-bug fixed; Ireland-only).
6. **G34 build accepts grain in place of straw** (built with 2 grain, zero straw — makes the Wonder line cheaper; file/track issue).
7. **The enumerator is broadly over-permissive** on USE/WORK_CONTRACT drill-downs (no free clergy, no coins, etc.). Empty top-level completions = genuinely no move; otherwise verify against the frame.
8. F09 free neighbor-use appears under `USE` while `bonus_actions` stays `[]`.
9. G22 at stone-wheel 0 yields nothing — wasted action.
10. G26 pays a nickel (2 pts) + ornament, not loose pennies.
11. Start-building grammar: bare `USE LWx` resolves Office/Mound by slot; Farmyard forks (see grammar).
12. **F35 scaling** (5+10n per USE) — enumerator under-reporting fixed in PR #1798; on stale deployments compute from coins. One-clergy building: a second USE requires an actual recall; the enumerator may offer it anyway (`clergy_at_home` is truth; a wrong attempt forces rollback).
13. **F35 build accepted `ClCl`** (straw waived) — cheaper until fixed.
14. WITH_LAYBROTHER/WITH_PRIOR after a WC must be played by the building's OWNER — in 2p vs a human, an AFK human stalls your pipeline.
15. (g8, unresolved) Bare `USE G01` seated the prior but granted no bonus despite prior-occupied targets — precondition unclear; verify before relying.

## Solo-mode mechanics

See V.5 (solo opening) for the two dominant mechanics: forced neutral-building phase before each SETTLE, and the free neutral-building use during each phase. Additional: neutral WC fees go to the supply (pick which neutral clergy); indicators pushed past 10 are REMOVED; grapes/stone indicators never enter (joker only); land price arrays reversed (falling); G13 Builders' Market is neutral-owned.

---

# PART VII — GAME LEDGER (append one entry per game)

**Template:**
```
#### <n>. <instance> · <mode> · <result>
Win condition named: <one of V.1 / none> — followed? <y/n>
Decided by: <one sentence>
Encoded: <dossier/doctrine/quirk updates made>
```

#### 1. (2p long) · L 29–70
No win condition; 2 wasted WCs + 3 empty WITH_PRIORs by r8; S01 in a bare pocket; F08 at r10+. Origin of: action-economy and prior-allocation doctrine.

#### 2. (2p long) · L 91–361
Decided r4–8 by red's F04→F17 chain. Phantom-SETTLE and identity-guessing burned ~6 turns; Castle-WC protocol solved (+17); SW6/7/8 stranded (39 pts) → Castle doctrine. Encoded: quirks 1–4, Part VI protocols.

#### 3. (2p long) · L 252–464 (mid-game read 199–308 was premature)
Lost the F24 race (two rounds of visible setup vs opponent's ready tile); columns: won goods, lost economic+settlements by ~140 each. Encoded: race doctrine (F24), column audit, termination lever, fuel discipline, recovery chains, hillside discipline.

#### 4. (2p long) · L 261–407
Won goods (+40, Wonder via G34 incl. grain-for-straw quirk), lost economic/settlements by 93/93 — stone leaked into G18 ornaments while red Castle-settled 7v4. Encoded: stone-is-gated-capital, G26 plateau, Palace/Castle axes.

#### 5. 1370dc21 (2p long) · L 158–338
Red ran F04(r9)→F05(r10)→F24 uncontested; F27 doubled red's Castle. Encoded: "the chain is THE path", WITH_LAYBROTHER default, WC bread pipeline, land-timing targets (coast r6–8, district r5–7).

#### 6. 92331440 (2p long) · L 185–334
Tied economic 92–94, lost settlements 33–153 — proof the economic moat is worthless. Encoded: V.1 procedural fix (name win condition, r8 checkpoint, column audit), basics-score-zero, D-varies-by-card, build-bonus-needs-prior-home.

#### 7. 2e8fd78d (2p long) · L 229–380
Sixth identical profile; V.1 fix not applied. Zero stone all game → no G28/G34/F08/F30. Encoded: Shanty leak semantics, checkerboard, r27 extension (floor not ceiling), exact-pay settles, F11/F37 WC floor, `WC G22 Wn`.

#### 8. 39f1ef09 (4p long, 3 colors vs human red) · red 251 / W130 / G125 / B104
All three colors goods-rich, land/building-poor; red built wide, checkerboarded, pre-staged fuel. Encoded: F40 Hospice dynamics, F09 WC routing, F36 lesson, prior-off-Castle, in-family WCs, 4p opening book.

#### 9. 2952eea3 (4p long, 3 colors vs human red) · red 241 / W117 / B73 / G52
One cause, three expressions: land bought too late/little/never. Encoded: land-first doctrine, F35 coins-only (−8 blind fire), pre-stage bread before F24, G39 fuel pre-staging, two-districts-by-r8.

#### 10. (solo, France long) · 192 soft-lock → 261 on corrected replay
Soft-lock from stacked discipline leaks (bare F23/F32, lapsed bonus, skipped free neutral uses). Encoded: coin buffer, paid-recall grammar, solo neutral-phase mechanics, solo converter window r10–16, +46 goods pivot.

#### 11. 282bfe7e (2p long) · L 414–418 (knife-edge)
Led +14 late; lost to F08 goods-sink misread (−7), F24 bread-not-book (−5), and red's F35 coin dump + terminal barren-WC denial of F24. Encoded: F08 sink warning, F24 inputs, F35 scaling + coin-sink threat window, denial-WC counter, BUILD+prior +18 benchmark.
