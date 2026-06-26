---
name: ora-et-labora-strategy
description: "Rules reference AND strategic coaching for the Ora et Labora board game (France variant). Parts I–V are the authoritative rules and reference — turn/round structure by mode, the three main actions, settlement phases, the three scoring columns, work contracts, conversions, and a complete engine-verified building table (every building's cost, landscape, cloister flag, economic value, dwelling value, stage Start/A/B/C/D, and player-count availability), a settlement table, a goods/resource table (food/energy/coin/point values and how each good is produced and used), landscape geometry (district hills/plains sides, coastal/mountain plots) and the district/plot price ramp (rising normally, reversed in solo). Parts VI–VII are strategy distilled from played games: action economy, clergy hierarchy (Prior over Lay Brother), settlement evaluation, economic-engine scaling, the Castle (G28) protocol, scoring-column allocation, and Kennerspiel engine quirks. Use when planning moves, evaluating building priorities, assigning clergy, placing settlements, or analyzing game state."
compatibility: "Kennerspiel MCP (list_my_games, get_game, get_legal_moves, make_move)"
---

# Ora et Labora — Rules, Reference & Strategic Coach

This skill has two halves. **Parts I–V are the authoritative rules and reference** — every fact below is verified against the official Lookout/Z-Man rulebook + appendix AND this repository's engine source (`game/src/board/`). **Parts VI–VII are strategy** distilled from played games. When strategy prose and the reference disagree, the reference wins. The default assumed mode is **France, long 2-player**, but the reference covers all modes.

> **Sources of truth, in order:** (1) the engine source in `game/src/board/` — `buildings.ts` (cost, roster-by-stage/player), `erections.ts` (economic value, dwelling value, terrain, cloister flag), `settlements.ts` (settlement cost), `resource.ts` (food/energy/coin/point values); (2) the official rulebook/appendix for design intent. Live game state (`get_game`) overrides both for the *current* round, prices, and rondel position.

---

# PART I — RULES OF THE GAME

## I.1 Shape of the game

- **1–4 players**, two map variants: **France** (grain→flour→bread, grapes→wine) and **Ireland** (grain→malt→beer, malt+wood+peat→whiskey). This engine and skill assume **France**.
- **Goal:** most total points (three scoring columns, §I.10). Solo goal: reach 500 points (France long).
- Each player starts with a **2×5 heartland**: 3 forest cards + 2 moor cards on empty spaces, plus the three **basic buildings** — Farmyard (grain *or* livestock), Clay Mound (clay), Cloister Office (coins). (In the *short* game each player leaves the top-left forest+moor off, starting with one fewer of each.)
- **Clergy:** 1 Prior + 2 Lay Brothers per player (the *short* game uses 1 Prior + 1 Lay Brother). Clergy never leave your own diocese; opponents place *your* clergy on *your* buildings via work contracts.

## I.2 Turn / round structure by mode

| Mode | Production wheel | Action cadence | Settlement phases | Bonus round | Game end |
|------|------------------|----------------|-------------------|-------------|----------|
| **3–4p long** | front `0,2,3,4,…` | each player 1 action per round; start player takes a 2nd at round end (4 actions/round in 3p, 5 in 4p) | A, B, C, D + final **E** | yes (round 25) | after the 5th settlement phase |
| **Regular 2p** | back `0,1,2,2,…` | per turn: rotate wheel, that player takes **2 actions** | A, B, C, D (no E) | no | when D-cards are out **and ≤1 building** left in display |
| **Long 2p** | front `0,2,3,4,…` | round-based: start player takes **2 actions**, other takes **1**, then swap | A, B, C, D (no E) | no | when D-cards are out **and ≤3 buildings** left in display |
| **Short 3–4p** | front `0,2,3,4,…` | 12 rounds + bonus; extra bonus-production rules | A, B, C, D + E | yes (round 13) | after final settlement phase |
| **Solo (1p + neutral)** | front `0,2,3,4,…` | like 2p: rotate wheel, take **2 actions** | A, B, C, D + final **E** | no | after the final settlement phase |

**Engine wheel values** (`rondel.ts armValues`): the engine uses the **back side** `[0,1,2,2,3,4,4,5,6,6,7,8,10]` **only for the regular 2-player game** (the condition is `players === 2 && length === 'short'` — the rulebook's "normal two player game"). **Every other configuration uses the front side** `[0,2,3,4,5,6,6,7,7,8,8,9,10]` — long 2p, solo, *and all 3–4p games (long and short multiplayer)*. (The rulebook agrees: the short *multiplayer* game uses the front wheel; only the normal 2p game uses the back.)

**Goods-indicator entry (France long / multiplayer):** the **grapes** indicator enters in **round 8**, the **stone** indicator in **round 13**. (Short game: grapes round 4, stone round 6. Regular 2p: grapes round 11, stone round 18.) Until an indicator is in play, use the **joker** to produce that good. In the **solo game the grapes and stone indicators are removed entirely** — grapes/stone are *only* ever produced via the joker. Always read the live rondel from `get_game` for the exact round.

## I.3 Sequence of a round (multiplayer / long)

1. **Recall clergy** — every player who placed *all* their clergy takes them all back. (Placed only 1–2 → none come back. You must take them back.)
2. **Rotate the production wheel** one space counterclockwise → nearly all production increases at once.
3. **Settlement phase** if the wheel beam passed the next card pile (A→B→C→D, then E).
4. **Actions** — each player one action in order; start player gets a second at the end.
5. **Pass the start-player marker** clockwise.

## I.4 The production wheel (rondel)

- Seven indicators start in play: **clay, coins, grain, livestock, wood, peat, joker**. Grapes and stone enter later (§I.2).
- A production building (board-outline in its function box) takes goods = the value at that good's indicator, then resets that indicator to **0**. It then climbs again one step per rotation.
- An indicator pushed past space 10 stays on 10 (multiplayer); in **solo** it is removed from the game entirely.
- **Joker** (shared by all players): substitutes for any good's indicator on any production action — even for grapes/stone before their own indicators exist. `USE <bldg> Jo` harvests at the **joker's** value and resets the **joker**, leaving the good's own indicator untouched. So `Jo` pays only when joker ≥ the good's own value.

## I.5 The three main actions (exactly one per action slot)

**A) Place a clergyman to use a building** — place your Prior or a Lay Brother on one of *your own* unoccupied buildings and trigger its function; OR issue a **work contract** (§I.7) to use an opponent's unoccupied building. A function fires on *placement*, never on merely sitting. A clergyman can be placed without using the function. Only buildings on the landscape (not the side display) can be used.

**B) Fell trees / Cut peat** — remove (max) 1 **forest** card (→ wood) or 1 **moor** card (→ peat) from your landscape; take goods = the wood/peat indicator, then reset it to 0. **Uses no clergyman.** Frees the space to build on. Legal even at indicator 0 (you just get nothing) and even with no cards left (no effect).

**C) Build a building** — pay the cost (top-left of the card: wood, clay, stone, straw, sometimes coins) and place it on an empty landscape space of an allowed terrain. **Cloister buildings (☩) must be orthogonally adjacent to another cloister building.** If your **Prior is free**, you may immediately place it on the just-built building for a bonus USE — the signature **build→USE double action**. Some buildings are *financed* (paid in coins) instead of built with materials; this still counts as the build action.

## I.6 Free / extra actions (any number, before or after the main action)

- **Buy a landscape** — at most **1 per turn** and **1 per settlement phase** (long 2p: up to 2 across your 3-in-a-row actions). Must be placed immediately. See §I.9.
- **Trade coins** — 5 pennies ↔ 1 nickel (5-coin tile) anytime; trade 1 wine → 1 coin (Ireland: 1 whiskey → 2 coins) anytime.
- **Flip grain → straw** — at any time, irreversibly. **Grain is the only tile freely flippable.** Straw can never become grain. Because both faces count as *different* goods, flipping lets one grain stockpile pay both a "grain" and a "straw" cost.

## I.7 Work contracts

- To use an opponent's building, pay the owner **1 coin** (→ **2 coins** permanently once *any* Winery/Whiskey Distillery is built, by anyone). The owner seats one of *their* free clergy on the building; *you* get the function. Your clergy stay home.
- You cannot contract a player who has placed all clergy. A contract cannot be refused. Pay immediately (before seeing the benefit). You may contract without using the function.
- **Present instead of coins:** return **1 wine** (France) / 1 whiskey (Ireland) to the *general supply* instead of paying — the owner receives nothing (the present is "drunk"). This is correct post-Winery: it costs ~1 point of wine instead of 2 coins AND denies the opponent the income.
- Engine: after `WORK_CONTRACT <bldg> <pay>`, the building owner responds `WITH_LAYBROTHER` or `WITH_PRIOR`.
- **Solo:** using a neutral building costs coins paid to the supply (you pick which neutral clergy); the present rule still applies.

## I.8 The Prior, clergy hierarchy, and recall

- **Prior** = same as a Lay Brother, plus the build→USE bonus (must be home at build time). Reserve it for build-bonuses and high-multiplier activations; default a **Lay Brother** for ordinary production and for work-contract responses.
- **Recall** only at round start, and only when *all* clergy are placed. Stranding 1–2 clergy means they never cycle back — a common soft-lock cause. The **Bathhouse (F23, `USE F23 Pn`)** recalls all *your* clergy immediately, mid-turn (it needs the coin payment).

## I.9 Landscape expansion (heartland → districts + plots)

The heartland is a fixed 2×5 strip. Three ways to grow it:

- **Districts** (`BUY_DISTRICT`) — 1×5 strips that stack **flush above or below** the heartland (no left/right offset). Each district has two sides you choose at placement:
  - **Hills side** = *Moor / Forest / Forest / Hillside / Hillside* → you place **1 moor card + 2 forest cards**; the 2 hillside spaces stay empty (buildable).
  - **Plains side** = *Forest / Plains / Plains / Plains / Hillside* → you place **1 forest card**; the 3 plains + 1 hillside spaces stay empty.
  - (So the hills side yields 2 forests + 1 moor + 2 hillside spaces; the plains side yields just 1 forest + more open building space.)
- **Coastal plots** (`BUY_PLOT … COAST`) — attach to the **left**: **2 Water + 2 Coast** spaces. Water carries dwelling **3** even unbuilt. Unlocks coast-only buildings (F04 Windmill, F11 Harbor Promenade, G26 Shipyard, F33 Shipping Company) and the Fishing Village.
- **Mountain plots** (`BUY_PLOT … MOUNTAIN`) — attach to the **right**: **2 Hillside + 1 Mountain** spaces (each mountain borders two hillsides). The only source of Mountain spaces (Quarry, Castle) and a source of Hillside (Grapevine, Palace, Castle, Hilltop Village).

**Landscape pricing — the price RAMP (and its solo reversal).** The piles are sorted cheapest-on-top, so each purchase costs more than the last. Engine arrays (`board/landscape.ts`), consumed from index 0:

| Mode | District prices (in buy order) | Plot prices (in buy order) |
|------|--------------------------------|----------------------------|
| **2 / 3 / 4 players** | `2, 3, 4, 4, 5, 5, 6, 7, 8` (**rising**) | `3, 4, 4, 5, 5, 5, 6, 6, 7` (**rising**) |
| **Solo (1 player)** | `8, 7, 6, 5, 5, 4, 4, 3, 2` (**reversed — falling**) | `7, 6, 6, 5, 5, 5, 4, 4, 3` (**reversed — falling**) |

So in 2/3/4-player games landscape gets **more expensive** the longer you wait (buy early), while in the **solo game the piles are flipped** (most expensive first) so landscape gets **cheaper** over time. Always read live `district_purchase_prices` / `plot_purchase_prices` from `get_game`.

## I.10 Settlement phases

- Triggered when the wheel beam passes the next card pile (A→B→C→D, then E in multiplayer/solo). Long 2p and regular 2p have **only A–D** (no E).
- Each player may build **≤1 settlement** from supply, paying its **food + energy** cost (top-left of the card). Excess food/energy is wasted (no change). You may buy ≤1 landscape first.
- Restrictions: Fishing Village = **Coast** only; Hilltop Village = **Hillside** only; never on Mountain/Water; a settlement may not be built via the normal build action; you can't build it "for later".
- After settling, distribute the letter's new building cards into the shared display, and give each player **1 new settlement card** (A→Artist's Colony, B→Hamlet, C→Village, D→Hilltop Village).
- The **Castle (G28)** `USE G28` builds one settlement (paying its cost) on demand — the *only* way to place settlements after the last settlement phase, and the only route to the Hilltop Village in 2p.

## I.11 Scoring (three independent columns)

1. **Goods** — point values on held tiles: **book 2, ceramic 3, ornament 4, reliquary 8, Wonder 30, wine/whiskey 1, 5-coin nickel 2**. Raw basic goods score **0**; loose pennies optimally convert 5→nickel = 2 pts at scoring.
2. **Economic** — sum the economic values of *all* your buildings **and** settlements (dwelling values irrelevant here).
3. **Settlement dwelling** — each settlement scores its own dwelling value **plus** the dwelling value of every orthogonally adjacent card: buildings, *other settlements*, and Water spaces (3). A high-dwelling building between *k* settlements pays each of them. Negative dwellings only matter when adjacent to a settlement.

The winner is the highest total. Ties → multiple winners.

---

# PART II — BUILDING REFERENCE (France, engine-verified)

**How to read these tables.** **Cost:** `w`=wood, `c`=clay, `st`=stone, `sw`=straw, `¢`=coins. **E** = economic value (scores directly). **D** = dwelling value (what adjacent settlements score). **☩** = cloister building (must be built orthogonally adjacent to another cloister building). **Land:** allowed terrain (C/P/H = Coast/Plains/Hillside, the default). **P** = player counts in which this France card appears, from the engine's `roundBuildings` (`1`=solo, `2`,`3`,`4`). **Stage** = when it enters the display: **Start** (bible symbol, present from the opening) or settlement-phase tier **A/B/C/D**.

> **Engine roster note.** In *this* engine, the **2-player game uses 24 France buildings for BOTH short and long length** — only cards whose **P** column contains a `2`. Seventeen France cards are therefore absent from 2-player play: **G01, F03, G06, F09, F10, G13** (Start), **F15, G16** (A), **F20, F23, F25** (B), **F29, F31, F32** (C), **F36, G39, F40** (D). This is a **deliberate implementation choice, not a bug:** `roundBuildings` keys only on `(country, players)` and ignores `length`, and the test suite explicitly pins it — `buildings.test.ts` asserts `roundBuildings({players: 2, country: 'france', length: 'long'}, …).not.toContain('G01')`. (The printed rulebook's *long* 2-player game would instead use nearly all buildings — only F10/F31/F29 removed — so this engine intentionally departs from the printed long-2p roster. Treat the **P** column as authoritative for what actually appears here.)

### Basic buildings (start on every heartland; not in any pile)

| ID | Building | Cost | E | D | ☩ | Land | Function |
|----|----------|------|---|---|---|------|----------|
| — | **Farmyard** | start | 0 | 2 | – | heartland | Production wheel: **grain *or* livestock** (pick one) |
| — | **Clay Mound** | start | 0 | 3 | – | heartland | Production wheel: **clay** |
| — | **Cloister Office** | start | 0 | 2 | ☩ | heartland | Production wheel: **coins** (a cloister building) |

### Start buildings (bible symbol — in the display from round 1)

| ID | Building | Cost | E | D | ☩ | Land | P | Function |
|----|----------|------|---|---|---|------|---|----------|
| G01 | Priory | 1w+1c | 4 | 3 | ☩ | C/P/H | 1·3·4 | Use a building occupied by a prior (yours or an opponent's); pay only the Priory's work-contract, not the target's |
| G02 | Cloister Courtyard | 2w | 4 | 4 | ☩ | C/P/H | all | **3 different goods → 6 identical basic goods** (clay/wood/peat/grain/livestock/coin) |
| F03 | Grain Storage | 1w+1sw | 3 | 4 | – | C/P/H | 1·4 | Pay 1 coin → 6 grain (indicator unaffected) |
| F04 | **Windmill** | 3w+2c | 10 | 6 | – | **Coast/Hill** | all | Flip ≤7 grain → straw; take **1 flour per flip** |
| F05 | **Bakery** | 2c+1sw | 4 | 5 | – | C/P/H | all | Flip flour → **bread** at ½ energy each; may sell ≤2 bread @ 4¢ |
| G06 | Fuel Merchant | 1c+1sw | 5 | 2 | – | C/P/H | 1·3·4 | Sell 3 / 6 / 9 energy → 5 / 8 / 10 coins |
| G07 | Peat Coal Kiln | 1c | 4 | **−2** | – | C/P/H | all | Take 1 peat coal + 1 coin; also flip any peat → peat coal freely |
| F08 | Market | 2st | 5 | **8** | – | C/P/H | all | **4 different goods → 7 coins + 1 bread** |
| F09 | Cloister Garden | 3¢ | 5 | 0 | ☩ | C/P/H | 1·3·4 | +1 grapes, then a **free USE of one unoccupied neighbor** (1×/turn) |
| F10 | Carpentry | 2w+1c | 7 | 0 | – | C/P/H | 4 | Remove 1 forest → carry out a free **Build** action |
| F11 | Harbor Promenade | 1w+1st | 1 | **7** | – | **Coast** | all | Take 1 ceramic + 1 wine + 1 wood + 1 coin (no input) |
| G12 | Stone Merchant | 1w | 6 | 1 | – | C/P/H | all | ≤5×: **2 food + 1 energy → 1 stone** |
| G13 | Builders' Market | 2c | 6 | 1 | – | C/P/H | 1·4 | Pay 2 coins → 2 wood + 2 clay + 1 stone + 1 straw (neutral-owned in solo) |

### A buildings (enter at settlement phase A)

| ID | Building | Cost | E | D | ☩ | Land | P | Function |
|----|----------|------|---|---|---|------|---|----------|
| F14 | Grapevine (A) | 1w | 3 | 6 | – | **Hillside** | 2·3·4 | Production wheel: **grapes** (joker until grapes indicator enters; *not* in solo) |
| F15 | Financed Estate | 1c+1st | 4 | 6 | – | C/P/H | 1·4 | Flip 1 coin → book; take 1 bread + 2 grapes + 2 flour |
| G16 | Cloister Chapter House | 3c+1sw | 2 | 5 | ☩ | C/P/H | 1·3·4 | Take 1 of **each** of the 6 basic goods |
| F17 | Cloister Library | 2st+1sw | 7 | **7** | ☩ | C/P/H | all | Flip ≤3 coins → books; and/or trade **1 book → 1 meat + 1 wine** |
| G18 | Cloister Workshop | 3w | 7 | 2 | ☩ | C/P/H | all | Flip ≤3 clay → ceramic and/or 1 stone → ornament, **1 energy per tile** |
| G19 | Slaughterhouse | 2w+2c | 8 | **−3** | – | C/P/H | all | Flip livestock → **meat**, **1 straw each** (2 food → 5 food) |

### B buildings (enter at settlement phase B)

| ID | Building | Cost | E | D | ☩ | Land | P | Function |
|----|----------|------|---|---|---|------|---|----------|
| F20 | Inn | 2w+2sw | 4 | 6 | – | C/P/H | 1·3·4 | Sell ≤7 food @ 1¢ each; and/or 1 wine @ 6¢ |
| F21 | **Winery** | 2c+2sw | 4 | 5 | – | C/P/H | all | Grapes → **wine**; sell 1 wine @ 7¢. **Raises work-contract price to 2¢ for everyone** |
| G22 | Quarry (B) | 5¢ | 7 | **−4** | – | **Mountain** | all | Production wheel: **stone** |
| F23 | Bathhouse | 1st+1sw | 2 | 6 | ☩ | C/P/H | 1·4 | Flip 1 coin → book, +1 ceramic; **recall ALL your clergy immediately** |
| F24 | **Cloister Church** | 5c+3st | 12 | **9** | ☩ | C/P/H | all | ≤2×: **1 bread + 1 wine → 1 reliquary**. Highest dwelling in the game |
| F25 | Chamber of Wonders | 1w+1c | 0 | 6 | – | C/P/H | 1·4 | **13 different goods → 1 Wonder** |
| G26 | Shipyard | 4c+1st | 15 | **−2** | – | **Coast** | all | 2 wood → 5 coins + 1 ornament (1×/turn) |

### C buildings (enter at settlement phase C)

| ID | Building | Cost | E | D | ☩ | Land | P | Function |
|----|----------|------|---|---|---|------|---|----------|
| F27 | **Palace** | 25¢ | 25 | **8** | – | **Hillside** | all | Pay 1 wine → **USE any occupied building** (yours or theirs), no work-contract |
| G28 | **Castle** | 6w+5st | 15 | 7 | – | **Hill/Mtn** | all | **Build 1 settlement** from supply, paying its food + energy |
| F29 | Quarry (C) | 5¢ | 7 | **−4** | – | **Mountain** | 3·4 | Production wheel: stone (the second Quarry) |
| F30 | Town Estate | 2st+2sw | 6 | 5 | – | C/P/H | all | Sell 1 ceramic → 12 coins (1×/turn) |
| F31 | Grapevine (C) | 1w | 3 | 6 | – | **Hillside** | 4 | Production wheel: grapes (the second Grapevine) |
| F32 | Calefactory | 1st | 2 | 5 | ☩ | C/P/H | 1·3·4 | Pay 1 coin → a free fell-trees and/or cut-peat |
| F33 | Shipping Company | 3w+3c | 8 | 4 | – | **Coast** | all | Pay 3 energy → joker-wheel production of **meat, bread, OR wine** |

### D buildings (enter at settlement phase D)

| ID | Building | Cost | E | D | ☩ | Land | P | Function |
|----|----------|------|---|---|---|------|---|----------|
| G34 | **Sacristy** | 3st+2sw | 10 | 7 | ☩ | C/P/H | all | **book + ceramic + ornament + reliquary → 1 Wonder** (1×/turn) |
| F35 | Forger's Workshop | 2c+1sw | 4 | 2 | – | C/P/H | all | Buy reliquaries: 5¢ for the 1st, **+10¢ each** thereafter (one USE: 5/15/25… → 1/2/3…) |
| F36 | Pilgrimage Site | 6¢ | 2 | 6 | – | C/P/H | 1·3·4 | Upgrade book→ceramic→ornament→reliquary, up to **2 steps** per use |
| F37 | Dormitory | 3c | 3 | 4 | ☩ | C/P/H | all | Take 1 ceramic; then **1 straw + 1 wood → 1 book**, repeatable |
| F38 | Printing Office | 1w+2st | 5 | 5 | – | C/P/H | all | Remove ≤4 forest cards → **1 book each** |
| G39 | Estate | 2w+2st | 5 | 6 | – | C/P/H | 1·4 | ≤2×: **10 food OR 6 energy → 1 book + 1 ornament** |
| F40 | Hospice | 3w+1sw | 7 | 5 | ☩ | C/P/H | 1·3·4 | Use the function of any **unbuilt** building, free |
| G41 | House of the Brotherhood | 1c+1st | 3 | 3 | ☩ | C/P/H | all | 5¢ → **2 pts per cloister building** you built (1½ in long 2p, 1 in solo) |

### Cloister buildings (☩) — the adjacency-chain set (France)

Cloister Office (basic) · **G01** Priory · **G02** Cloister Courtyard · **F09** Cloister Garden · **G16** Cloister Chapter House · **F17** Cloister Library · **G18** Cloister Workshop · **F23** Bathhouse · **F24** Cloister Church · **F32** Calefactory · **F37** Dormitory · **G34** Sacristy · **F40** Hospice · **G41** House of the Brotherhood. Each must be built orthogonally adjacent to another ☩ building; the cloister grows as one connected cluster, and **G41 scores per ☩ building you built**, so the cluster size is itself a scoring resource.

### Terrain restrictions at a glance

- **Coast only:** F11 Harbor Promenade, G26 Shipyard, F33 Shipping Company, **Fishing Village (S04)**.
- **Coast or Hillside:** F04 Windmill.
- **Hillside only:** F14 / F31 Grapevine, F27 Palace, **Hilltop Village (S08)**.
- **Mountain only:** G22 / F29 Quarry.
- **Hillside or Mountain:** G28 Castle.
- **Everything else:** Coast / Plains / Hillside. (Plains = any space cleared of forest/moor.)
- Settlements may never be placed on Mountain or Water.

---

# PART III — SETTLEMENT REFERENCE (France, engine-verified)

Each player owns all 8 settlements: the four **Start** settlements (S01–S04) from the opening, then S05/S06/S07/S08 received one each at settlement phases A/B/C/D. Cost is **food + energy**, paid from goods (excess wasted). A settlement's *own* contribution is its **E** (added to the economic column) plus its **D** (the base of its settlement-column score, before neighbor adjacency) — e.g. the appendix's "initial value" of the Hilltop Village is E10 + D8 = 18.

| ID | Settlement | Stage | Food | Energy | E | D | Terrain | Notes |
|----|-----------|-------|------|--------|---|---|---------|-------|
| S01 | Shanty Town | Start | 1 | 1 | 0 | **−3** | C/P/H | Cheapest; own −3 leaks to *adjacent settlements* — never place beside another settlement |
| S02 | Farming Village | Start | 3 | 3 | 1 | 1 | C/P/H | |
| S03 | Market Town | Start | 7 | 0 | 2 | 2 | C/P/H | Zero energy cost |
| S04 | Fishing Village | Start | 8 | 3 | 4 | 6 | **Coast** | Coast only; pairs with water (D3) for a cheap high pocket |
| S05 | Artist's Colony | A | 5 | 1 | **−1** | 5 | C/P/H | Negative economic value |
| S06 | Hamlet | B | 5 | 6 | 3 | 4 | C/P/H | |
| S07 | Village | C | 15 | 9 | 8 | 6 | C/P/H | |
| S08 | Hilltop Village | D | 30 | 3 | 10 | 8 | **Hillside** | Hillside only; in 2p only placeable via the **Castle** |

---

# PART IV — GOODS / RESOURCE REFERENCE (engine-verified)

Engine value functions (`board/resource.ts`): **food** = `costFood`, **energy** = `costEnergy`, **money** = `costMoney`, **points** = `costPoints`/`goodsPoints`. **Coins, wine, and whiskey count as food** for settlement payment (this surprises people). Energy: peat coal 3, peat 2, wood 1, straw ½.

| Good | Food | Energy | Coin | Pts | Produced by (key sources) | Used for |
|------|:----:|:------:|:----:|:---:|---------------------------|----------|
| Grain | 1 | – | – | 0 | Farmyard; Cloister Courtyard; Grain Storage (¢→6); Chapter House | Flip → straw; Windmill → flour; "different goods" inputs |
| Straw | – | ½ | – | 0 | **Flip grain (free)**; Builders' Market | Building material; energy; Slaughterhouse meat; Dormitory books |
| Wood | – | 1 | – | 0 | Fell trees; Cloister Courtyard; Builders' Market; Harbor | Building material; energy; Shipyard; Whiskey (Ireland) |
| Clay | – | – | – | 0 | Clay Mound; Cloister Courtyard; Builders' Market | Building material; Workshop → ceramic |
| Peat | – | 2 | – | 0 | Cut peat; Cloister Courtyard | Energy; Peat Coal Kiln → peat coal |
| Peat coal | – | 3 | – | 0 | Peat Coal Kiln (flip peat) | Densest energy (settlements, Bakery, Workshop, Stone Merchant) |
| Livestock (sheep) | 2 | – | – | 0 | Farmyard; Forest Hut (Ire) | Food; Slaughterhouse (+straw) → meat |
| Penny (1 coin) | 1 | – | 1 | 0\* | Cloister Office; many sales | Landscapes; work contracts; buying buildings; flip → book |
| Nickel (5 coins) | 5 | – | 5 | **2** | Trade 5 pennies; Shipyard; sales | Liquidity; food for settlements (forfeits 2 pts) |
| Stone | – | – | – | 0 | Quarry; Stone Merchant; Builders' Market | Gates Market, Church, Castle, Sacristy; Workshop → ornament |
| **Grapes** | 1 | – | – | 0 | Grapevine; Financed Estate | Winery → wine |
| **Flour** | 1 | – | – | 0 | Windmill (flip grain) | Bakery → bread |
| **Meat** | 5 | – | – | 0 | Slaughterhouse; Cloister Library; Shipping Co; Refectory(Ire) | High-density settlement food |
| **Bread** | 3 | – | – | 0 | Bakery; Market; Shipping Co; Financed Estate | Cloister Church reliquary; settlement food |
| **Wine** | 1 | – | 1 | **1** | Winery; Harbor; Cloister Library; Shipping Co | Cloister Church + bread → reliquary; **Palace**; work-contract present |
| Book | – | – | – | **2** | Flip coin → book (Library, Bathhouse, Financed Estate); Printing Office (forest → book); Dormitory (straw+wood → book) | Sacristy Wonder; Druid's House / Bulwark (Ire) |
| Ceramic | – | – | – | **3** | Cloister Workshop (clay+energy); Harbor; Bathhouse; Dormitory | Sacristy Wonder; Town Estate → 12¢; Pilgrimage upgrade |
| Ornament | – | – | – | **4** | Cloister Workshop (stone+energy); Shipyard; Estate | Sacristy Wonder; Pilgrimage → reliquary |
| Reliquary | – | – | – | **8** | Cloister Church (bread+wine); Forger's Workshop; Pilgrimage | Sacristy Wonder; Portico (Ire) → many goods |
| Wonder | – | – | – | **30** | Sacristy; Chamber of Wonders | Pure points (only 8 exist) |

\* Pennies score 0 held loose, but 5 pennies → 1 nickel = 2 pts at scoring. (Point values are from `resource.ts` `costPoints`/`goodsPoints`, except the **Wonder**'s 30, which is per the rulebook — Wonders are tallied separately, not inside those functions.)

**The core France conversion chains:**
- **Reliquary engine (the decisive chain):** grain → **F04 Windmill** → flour → **F05 Bakery** → bread; grapes → **F21 Winery** → wine; bread + wine → **F24 Cloister Church** → reliquary (8 pts).
- **Wonder engine:** book + ceramic + ornament + reliquary → **G34 Sacristy** → Wonder (30 pts); or 13 different goods → **F25 Chamber of Wonders** → Wonder.
- **Goods/points loop:** clay + energy → ceramic, stone + energy → ornament (**G18 Workshop**); coins → books (**F17 Library**); recall via **F23 Bathhouse** to re-fire.
- **Food engine:** livestock + straw → meat (**G19 Slaughterhouse**, 5 food) — fuels expensive settlements and the Castle.
- **Liquidity:** energy → coins (**G06 Fuel Merchant**); ceramic → 12¢ (**F30 Town Estate**); food/wine → coins (**F20 Inn**); the **Cloister Office** mints coins for free.
- **Stone:** **G12 Stone Merchant** (2 food + 1 energy → 1 stone, ≤5×) and **G22 Quarry** (production wheel) — gates the Castle/Sacristy/Market/Church.

---

# PART V — KEY UNDERSTANDINGS (review notes)

1. **Grain → straw is one-way and free, anytime.** Grain is the *only* tile that flips freely. Straw never reverts to grain. Both faces are *different goods*, so one grain pile can satisfy a "1 grain + 1 straw" cost by flipping one tile.
2. **District sides give different cards.** The **hills side** lays down **2 forests + 1 moor** (plus 2 hillside spaces); the **plains side** lays down only **1 forest** (plus 3 plains + 1 hillside). Pick hills for fuel (forest=wood, moor=peat) + hillside building room; pick plains for maximum open build space.
3. **Plot composition is fixed:** coastal plot (left) = 2 Water + 2 Coast; mountain plot (right) = 2 Hillside + 1 Mountain. Water = dwelling 3 free; Mountain is the only Quarry/Castle terrain.
4. **Landscape price ramps up as you buy (2/3/4p), and is reversed in solo** (most expensive first, getting cheaper). See §I.9 for the exact arrays. In multiplayer, *buy land early* — it is cheaper and arms more rounds of building/settling.
5. **Coins and wine pay food.** A settlement's food cost can be met with pennies (1), nickels (5), or wine (1) — but spending nickels/wine forfeits their scoring points; prefer zero-point food (grain/sheep/bread/meat).
6. **Negative dwellings only bite beside settlements** — G22 Quarry (−4), G19 Slaughterhouse (−3), G07 Peat Coal Kiln (−2), G26 Shipyard (−2), S01 Shanty Town (−3). Site them away from your settlement pockets; the Shanty Town's −3 also leaks to each *adjacent settlement*.
7. **Cloister buildings chain.** Every ☩ building must touch another ☩ building; the cloister grows as one cluster, which the Cloister Church / Sacristy / House of the Brotherhood all reward. Once your cloister is boxed in by non-cloister buildings, you can build no more ☩ buildings — protect an open cloister-adjacent space.
8. **The work-contract present (wine) returns to the supply, not the opponent** — so post-Winery it both saves coins and denies income.
9. **Production indicators enter on a schedule** (grapes r8, stone r13 in France long); the **joker** substitutes earlier, but pays only the joker's own value and is shared by everyone.
10. **The Castle is the only post-phase settlement route** (and the only way to place the Hilltop Village in 2p) — it builds settlements without advancing the display, so it does not end the game.
11. **Engine ≠ printed long-2p roster (intentional).** This engine's 2-player game uses the 24-building set (P-column contains `2`) for *both* short and long length — `roundBuildings` ignores `length`, and a test explicitly pins 2p-long to exclude G01. The printed long-2p "nearly all buildings" rule is deliberately not implemented; the 24-set is what actually appears, so build strategy on it.
12. **Round Tower dwelling is 2 in the current engine** (`pointsForDwelling` = 2) — the historical "9" data bug noted in Part VII is fixed in this codebase. (Round Tower is Ireland-only anyway.)

---

# PART VI — STRATEGIC COACHING

The remainder of this document is hard-won strategy from played games (mostly France long 2p, some 4p and solo). It builds on the rules and reference above; where any older embedded table or claim conflicts with Parts I–V, Parts I–V win.

## Core Strategic Principles

### 1. Action Economy is Absolute

Every action slot is finite and irreplaceable. Wasted actions compound into decisive score gaps.

**Decision rubric before committing action:**
- Does this action advance position (build/convert/settle) or secure tempo (prior placement, resource positioning)?
- If paying WORK_CONTRACT, do I have a concrete plan to USE the building this turn or immediately after?
- If placing WITH_PRIOR, am I following it with a USE action that multiplies the benefit?

**Common waste patterns to avoid:**
- Pay WORK_CONTRACT, then skip the USE follow-up (lose action + lose penny)
- WITH_PRIOR × 2+ consecutive moves with no USE activation (syntactically legal, strategically worthless)
- COMMIT before main action is spent (forfeits remaining slot)

### 2. Clergy Hierarchy: Prior ≻ Laybrother

Prior and Laybrother are NOT interchangeable. Prior unlocks multiplicative tempo; Laybrother is defensive/transient.

**Prior allocation rule:**
- Reserve Prior for synergistic building activations where the bonus USE materializes into real economic gain
- Example: USE F04 (Windmill, grain→flour) WITH_PRIOR unlocks an extra conversion — the bonus USE has direct point/resource value
- Never burn Prior on defensive placements or work contract responses

**Laybrother allocation rule:**
- Default to Laybrother for work contract responses (defensive, non-multiplying)
- Use LB for blocking/denial placements if tempo requires
- Use LB when Prior is unavailable and you need to fill a slot

**Red flag:** Using Prior on a work contract or purely defensive action signals strategic confusion.

**Clergy discipline — soft-lock prevention (CRITICAL, solo-verified):**

- Clergy return to your supply **only when all three are placed at the start of a round.** Stranding one or two on production buildings means they never cycle back; you'll go entire rounds clergy-locked.
- **Never spend your last idle clergy (or all your liquidity) on a non-settle turn without confirming you can still act next turn.** Exhausting clergy + coins + harvestable land on a normal action turn produces a **soft-lock**: no legal main action exists, the engine does NOT auto-pass, and `COMMIT`/`PASS` are both rejected. The game cannot advance — a hard rollback is the only escape (this is what cost a clean finish in the solo game at 192).
- **The Bathhouse (F23) recall is the safety valve — and it requires the coin payment: `USE F23 Pn`.** The bare `USE F23` does NOT recall clergy (see USE Command Grammar). Keep ≥1 coin reserved if you intend to use F23 to reset clergy.
- **Keep a coin buffer at all times.** Work contracts are your only way to act through neutral/opponent buildings when your own clergy are stuck, and they cost 1 coin (or **2 coins once any Winery is built** — including the neutral Winery in solo). Zero coins + zero idle clergy = locked.

### 3. Settlement Placement: Scout Before Paying

Settlement value is **irreversible** — incorrect placement is catastrophic and unrecoverable.

**Settlement evaluation process (mandatory before committing):**
1. Check **all available SETTLE options** for your color (use `get_legal_moves` to enumerate)
2. For each candidate location, evaluate:
   - **Economic value**: proximity to resources, conversion chains, trade routes
   - **Defensive value**: blocking opponent's future settlements
   - **Scoring delta**: a settlement scores its own dwelling value plus the dwelling value of every orthogonally adjacent card — buildings, water spaces (+3), and other settlements. See the dwelling-value geometry in Endgame Protocols.
3. **Never settle negative-value pockets** unless forced by blockade (a Shanty Town's own −3, or a neighbor like the Quarry at −4, is catastrophic)
4. Prefer pockets that touch the most dwelling value: coastal plots (each water space = +3, free) and clusters beside high-D anchors (Cloister Church 9, Market/Palace 8). A high-D building wedged between *k* settlements pays its dwelling to all *k*.

**Example (canonical dwelling values):**
- A settlement in a bare interior pocket with no high-value neighbors scores little beyond its own dwelling; a Shanty Town (S01, −3) there is a cascading deficit
- The same settlement in a coastal pocket — two water spaces at +3 each, beside a high-D building — is strongly positive and recoverable

### 4. Economic Buildings Drive Score Exponentially

F-buildings (converters) and some G-buildings (engines) scale commodity chains into massive economic gain. **Early acquisition is disproportionately valuable.**

**Building priority heuristic (rounds 5–10):**
1. **High-priority converters**: F04 Windmill (grain→flour, ≤7), F05 Bakery (flour→bread; bread = 3 food), G19 Slaughterhouse (livestock+straw→meat; meat = 5 food), F17 Cloister Library (≤3 coins→books, then book→meat+wine), F21 Winery (grapes→wine)
   - These unlock commodity engines; delaying costs exponential points
   - Opponent acquiring the Windmill/Library chain by round 7–8 signals you're in tempo deficit
   - **F17 Cloister Library compound move (optimal):** combine both card clauses in one USE — flip ≤3 coin tiles → 3 books, then trade 1 book → 1 meat + 1 wine. Net: −3 coin tiles (−3¢ liquidity) → +2 books (+4 pts) + 1 meat (5 food) + 1 wine (+1 pt + 1¢ + 1 food) = **+5 pts + 5 food + 1 wine per USE**. F17 competes with F04 in the converter race at rounds 5–8, not as a secondary acquisition — missing it is a convergence cost, not a deferral.
2. **Economic engines**: G02 Cloister Courtyard (3 different goods → 6 identical basic goods), F14 Grapevine and G22 Quarry (production-wheel producers)
   - Support converters; enable resource cycling
3. **Utility buildings**: G07 (water/stone), G12 (Stone Merchant — NOT a settlement enabler; see Endgame Protocols), LB upgrades
   - Secondary; acquire after establishing converter backbone

**Scaling principle:**
- If opponent has 3+ converters by round 10 and you have 0–1, game is effectively decided
- Economic advantage compounds: each converter enables next converter cheaper (shared work contracts, clergy synergies)

### 5. Resource Conversion Discipline

Convert only for **point accumulation** or **critical resource bottleneck resolution**. Pure cycles (convert A→B→A) are action theft.

**Conversion value rubric:**
- **Good**: CONVERT Penny×5 → Nickel (results in +2 goods points, net positive)
- **Good**: CONVERT Grain → Flour → Bread (commodity chain unlocked by F04 Windmill + F05 Bakery, creates economic multiplier)
- **Bad**: CONVERT Nickel → Pennies (loses goods points, reverses progress)
- **Bad**: CONVERT resources with no follow-up plan (action wasted, no payoff)

**Discipline rule:**
- Every conversion must answer: "What do I gain?" If the answer is "flexibility" or "optionality," it's likely a trap.

**G02 Cloister Courtyard late-game fuel injection (game 3 verified).** `USE G02 PnClNi Pt` → 6 peat. Cost: 1 penny + 1 clay + 1 nickel = −2 goods value. Output: 6 peat = 12 energy potential (6×2). Two USE G18 cycles powered by these 6 peat net +18 goods — pays back the conversion 9× over. Input choice matters: **prefer PnClNi** over PnClWn (saves wine for F24 bread+wine reliquary chain) and over PnClCe (saves 3 goods vs 2 for nickel). Output choice: peat (density 2) when energy is the bottleneck; wood (density 1) when also needing construction material; stone if G34 Sacristy is reachable.

### 6. Stone is Gated Capital, Not a Consumable

Stone gates the two highest-leverage buildings in the game: the **Castle (G28, 5 stone)** and the **Sacristy (G34, 3 stone)** — each converts into 15–30+ VP. Stone spent early on Cloister Workshop (G18) ornament conversion (1 stone per +4 VP ornament) is a catastrophic misallocation against that opportunity cost.

**Rule:** until the Castle is built (or the Castle line is explicitly abandoned), treat every stone as reserved. Do not feed stone into G18 ornaments, and do not let a Stone Merchant (G12) lead sit idle either — convert food + energy into stone *and bank it* toward Castle/Sacristy. In game 4 an early G12 stone lead evaporated into G18 ceramics/ornaments while the opponent routed stone into a round-24 Castle and out-settled me 7 settlements to 4 (a ~90-point settlement-column swing).

### 7. The Cloister Courtyard (G02) Multiplier

G02 takes **3 different goods (anything, including zero-value tiles) → 6 identical basic goods** (grain, wood, clay, peat, penny, or sheep). Three-for-six on basics looks unexciting, but its worth is as the *front* of a conversion chain, never as a terminal action:

- **6 grain → F04 Windmill (Prior, flips ≤7) → 6 flour + 6 straw → F05 Bakery → 6 bread.** Six bread = 18 food (settlement fuel), or paired with wine, 6× F24 reliquaries = +48 VP.
- The straw byproduct from the Windmill simultaneously feeds G19 Slaughterhouse and F37 Dormitory.

Build G02 early — it is a cloister building (☩), so it also grows the cluster that G41 and the high-D church complex reward — and chain it relentlessly. Treating it as "3 goods for 6 basics" and stopping there forfeits its entire purpose.

### 8. Bonus-Action Discipline — Engineer Them, Spend Them

A granted bonus action is a **free building USE** that costs no clergyman — among the strongest plays in the game. **Watch the `bonus_actions` array every turn and treat spending it as the default.** You usually trigger these intentionally (for the extra grape, or to borrow an effect without paying to build the building); receiving one and letting it lapse is rare and almost always wrong.

- **Cloister Garden (F09):** `USE F09` → +1 grape **and** a free USE of one unoccupied orthogonal neighbor. Cheap repeatable double-action. (See Engine Quirk 8 for the engine-verified mechanic.)
- **Hospice (F40):** `USE F40` → free use of any **unbuilt** building's effect — borrow it without paying the build cost.
- **Palace (F27):** pay 1 wine → use any **occupied** building (see "Palace — The Anti-Work-Contract Engine" in Endgame Protocols).
- **Castle (G28):** `USE G28` → bonus **SETTLE** (the only settle route after phase D).
- **Calefactory (F32):** pay 1 coin → drops **both** a free `FELL_TREES` and a free `CUT_PEAT` into `bonus_actions`. The one exception to "always spend it": you can only cash these if you still have a forest/moor tile to work, so this bonus can legitimately go unused.
- **Build-bonus (any building):** placing your prior on a newly built building grants an immediate free USE of it — the signature double-action. Do not forfeit it unless the building's effect is genuinely dead (no inputs).

**The BUILD+Prior double-action is the single highest-value turn in the game** when a productive building is built on a turn with good inputs ready. Verified game 3, round 27:
```
BUILD F35 1 0 ClCl          # main action; +4 econ +4 settle adjacency
USE F35 Pn×15               # bonus USE (15¢ → 2 reliquaries, +10 net)
COMMIT
```
Net for one turn: **+18 score**. No single plain USE, settle, or WC in that game came close. When choosing a build location, evaluate the bonus-USE economics *in the same calculation* as the dwelling-adjacency score — a high-D building (F24 D=9, F08 D=8, F27 D=8) wedged between two settlements and with a productive first-fire is the canonical jackpot turn.

Past failure: forfeiting an F09 grape and waving off build-bonus USEs. Default to engineering and spending the bonus.

---

## Mid-Game Execution: Critical Lessons from Live Play

### The Converter Window (Rounds 5–8): Non-Negotiable

The game is decided in this window. Missing it costs 10–15 points by round 8.

**What happens:**
- Converters built in rounds 5–8 with Prior placement achieve exponential scaling
- Example: F04 (round 5) + G19 (round 7), both with Prior → 30 points by round 8 while opponent stalls at 27
- Missing this window creates a gap that compounds through endgame (settlement and commodity scaling only recover 5–8 points max)

**Action discipline before round 5 directly enables round 5–8 success:**
- Rounds 1–4 must generate 5–8 pennies + diversified resources (clay, wood, peat)
- Wasted work contracts, empty WITH_PRIOR chains, or failed building activations in rounds 1–4 directly prevent converter acquisition in rounds 5–8
- Every action in round 1–2 that doesn't advance toward liquidity or building foundation is a point lost in round 8+

### District Purchases: Landscape Expansion is a Building Strategy

**Critical oversight in live play:** Ignoring district tile purchases locks you out of building placements.

**What happened:**
- Red bought HILLS districts [2] and [3], expanding their landscape with new buildable tiles
- I didn't purchase districts and hit landscape saturation by round 8
- F14 became affordable in round 8, but I had zero valid placement locations for it
- Result: Dead capital (2 pennies) and no ability to build despite having the resources

**Principle:** District purchases in rounds 4–7 are simultaneous building strategy. Treat them as:
- Space reservation for upcoming converters
- Option value for flexibility (more placements = more building choices)
- Early payoff: each district bought costs 2–4 pennies but unlocks 1–2 additional buildings in critical rounds 5–8

### Liquidity Management: Penny Scarcity is Your Bottleneck

**Observed constraint:** With 2 pennies by round 8, I couldn't afford F14 (Grapevine), F17, or district tiles. Resources were plentiful (6 peat, 4 wood) but worthless.

**Root cause:** No early economic engine to generate pennies.
- G02 (round 2) generated +4 economic but produced 0 pennies
- G07 or G12 should have been sequenced to unlock penny generation
- LW landscape activations (LW1, LW2) generate sheep/resources but pennies require building activation

**Fix:** Establish penny-generating buildings by round 4:
1. Build G07 or G12 early (rounds 2–3)
2. Activate them with clergy strategically placed to avoid blocking converters
3. Use converted pennies to buy districts (round 4–5) and acquire converters (round 5–8)

### Clergy Allocation: Prior on Converters, Not Utilities

**Critical mistake:** Placed PRIW on G18 (Cloister Workshop) instead of a volume converter.

**What should happen:**
- Prior on a volume converter (F04 Windmill, F05 Bakery, G19 Slaughterhouse): bonus USE mass-converts commodity chains, exponential gain
- Prior on G18 (Cloister Workshop): bounded at 3 clay + 1 stone per use — solid points, but no multiplicative benefit

**Principle:**
- Prior → Converters (F04, F05, G19, F17, F21). The bonus USE multiplies commodity accumulation
- Laybrother → Utilities, landscape, defense. Transient use, no multiplicative synergy
- **Exception:** Prior on producer buildings (G02, G19) if you're establishing the initial engine before converters lock in

### Landscape Saturation: Plan Building Placement by Round 3

**Observed end-state:** By round 8, my landscape was saturated with 6 buildings on 8 available plots. New building slots required district purchases (which I skipped).

**Constraint:** You have limited initial landscape tiles. Planning which buildings occupy which slots is critical.

**Optimal layout (for early converters):**
- Rows 0–1: 8 total plots initially
- Reserve 2–3 plots for early converters (F05, F04) + early utilities (G02, G12)
- Buy districts in rounds 4–5 to unlock expansion before round 7 converter wave

**Anti-pattern:** Building G07, G18, G12 in rows 0–1, leaving no space for F14/F17 in rounds 7–8 (what I did)

### Settlement Value: Scout Before Paying Resources

**Observed gap:** Red's SR2 settlement yielded +7 points; mine (SW1) yielded +4 points. Both cost sheep + peat, but location value was drastically different.

**Principle:** Settlement locations have fixed point multipliers (coastal, interior, corner, etc.). Evaluate all SETTLE options before committing.

**Missing in live play:** I didn't enumerate or evaluate locations, just placed SW1 opportunistically. Result: 3-point penalty vs Red.

---

## Decision Framework: Move Evaluation

When facing a decision point (multiple legal actions available):

### Should I settle now or build/convert?

1. **Settle if:**
   - You have scouted a +3 or higher value location
   - Opponent is close to blockading your preferred settlement
   - Score gap is recoverable via settlement accumulation (unlikely late game)

2. **Build/convert if:**
   - You're behind on economic engine development (converters, producers)
   - You have clergy ready for high-synergy activation
   - Settlement value near you is negative or already claimed

### Should I commit this work contract?

1. **Yes if:**
   - You have a specific building you plan to USE immediately or next turn
   - The building unlock enables a resource chain or bonus action (e.g., opponent's Castle G28 → SETTLE; but WORK_CONTRACT alone is inert — you must USE the building afterward, same turn)

2. **No if:**
   - You're just "exploring options" (wasted penny)
   - The building is blocked or you lack resources to activate it
   - You have 0 actions left to USE after paying WORK_CONTRACT

### Which clergy (Prior vs. Laybrother)?

1. **Prior if:**
   - You're activating a high-synergy converter (F04, F05, G19) where bonus USE multiplies value
   - You're unlocking a production chain that directly generates points/resources

2. **Laybrother if:**
   - You're responding defensively to opponent's work contract
   - You're filling a slot to prevent opponent action
   - Prior is already placed

---

## Common Pitfalls & Recovery

### Pitfall: Wasted Work Contracts (Action Leak)

**Symptom:** You paid WORK_CONTRACT but didn't activate the building.

**Recovery:**
- Acknowledge the action is lost; move forward without trying to "make up" the cost
- Tighten discipline: never pay without a 100% activation plan

### Pitfall: Negative Settlement Placement

**Symptom:** You placed a settlement and lost 3–5 points.

**Recovery:**
- Negative; unrecoverable — focus on future placements
- Ensure all future SETTLE decisions include full location enumeration
- If forced into negative placement by blockade, document the defender's strategy for future games

### Pitfall: Late Economic Engine (Rounds 10+)

**Symptom:** Opponent has 3+ converters, you're just building your first F-building.

**Recovery:**
- Game is effectively decided at this point
- Use remaining turns to finish settlements, place clergy, and extract what value remains
- Plan early converter acquisition (rounds 5–8) for next game

### Pitfall: Prior Burned on Defensive Action

**Symptom:** You used Prior to respond to opponent's work contract (defensive play).

**Recovery:**
- Acknowledge mistake; Prior is lost
- Revert to Laybrother-only clergy allocation for remainder of game
- Next game: reserve Prior strictly for synergistic building activations

### Pitfall: Opponent Denial WC on Your Cloister Church (F24)

**Symptom (game 3):** Opponent plays `WORK_CONTRACT F24 PnPn` → `USE F24` → `COMMIT`. Their Prior parks on F24 with no conversion done (no bread+wine); costs them 2 pennies and one action. Costs you: your own Prior is now locked off its best engine, your Cloister Church is occupied, and if this is the closing turn the recall never fires — your reliquary chain dies without firing.

**Why it works:** WC-with-no-useful-conversion is action-positive for the denier. They spend 2¢ to freeze your strongest engine on the final turns. Particularly devastating against F24 because USE requires bread+wine; with PRIR locked by the denier, even resupplying those goods buys you nothing.

**Counter-strategy:**
- In closing turns, keep your own PRIR resident on F24 between cycles: USE F24 yourself before the opponent can WC it — even a barren USE (no bread+wine) that produces nothing still denies the denial.
- Schedule F24 USEs so PRIR returns home only via planned recall, never sitting idle where a 2¢ WC can grab it.
- Track opponent's coin reserves: a 2¢ WC requires almost no liquidity. Assume it will happen in the final turns and bake it into your action order.

---

## Tempo Milestones (Long Game Reference)

Use these as pacing checks:

| Round | Economic milestones | Clergy milestones | Settlements |
|-------|-------------------|-------------------|-------------|
| 3–5   | G07/G12 for pennies; initial converter (F04) | Prior + 1 lay brother working | 1st settlement, only if +value |
| 6–8   | 2nd converter operational (F04, F05, G19) | all 3 clergy working (Prior + 2 LB) | 1–2 settlements placed |
| 9–11  | 3rd converter (F17, F21); commodity chain scaling | clergy cycling cleanly each round | 2–3 settlements placed |
| 12+   | engine self-sustaining; pivot to placements + points | Prior reserved for converter bonus USE | remaining settlements; Castle for any after phase D |

*Round numbers are indicative multiplayer pacing. In the long 2p game the hard anchors are the converter window (5–8) and indicator entry (grapes round 8, stone round 13); total settlements are capped by the four phases A–D plus any built via the Castle. Each player has exactly 3 clergy: 1 Prior + 2 Lay Brothers.*

**If you lag on converters by round 8, you're in a deficit that's hard to recover from.**

---

## Integration with Kennerspiel MCP

When planning moves:

1. Call `get_legal_moves([])` to see available actions
2. For each major decision (SETTLE, BUILD, COMMIT), enumerate all legal options
3. Apply decision rubric above
4. Execute via `make_move(command)`

Example workflow:
```
get_legal_moves([]) → ["USE", "BUILD", "SETTLE", "COMMIT"]
get_legal_moves(["SETTLE"]) → ["SW5","SW6","SW7","SW8"]   (your unplaced settlements; SW = white)
get_legal_moves(["SETTLE","SW5"]) → ["-1 0","0 1","2 2", ...]   (legal col/row pairs)
get_legal_moves(["SETTLE","SW5","-1","0"]) → feasible payment bundles, e.g. "NiWo"
→ make_move("SETTLE SW5 -1 0 NiWo")
# SETTLE only succeeds when bonus_actions contains "SETTLE" (a settlement phase, or the Castle bonus) — see phantom legality.
```

---

## Key Takeaways — Game 1 (Red 70, Blue 29)

- **Action economy loss**: 2 wasted work contracts, 3 consecutive WITH_PRIOR with no USE = ~6–8 effective action deficit by round 8
- **Clergy misallocation**: the Prior used defensively instead of on an F04/F08 synergy = lost tempo multiplier
- **Settlement failure**: first settlement (S01 Shanty Town, −3 dwelling) placed in a bare interior pocket = net negative, unrecoverable
- **Late converter**: F08 acquired round 10+, should have been round 6–7 = ~20–30 point swing
- **Final score**: Red 70, Blue 29 (41-point deficit) driven by converters acquired rounds 5–8

**Next game priorities:**
1. Converter acquisition in rounds 5–8 (non-negotiable)
2. Prior reserved strictly for synergistic building UPSs
3. Settlement location scouted and evaluated before paying (mandatory enumeration)
4. Work contract discipline: pay only when activation is planned

---

## Endgame Protocols & Engine-Verified Mechanics (Game 2)

Everything below was verified empirically against the Kennerspiel engine, not inferred from rules memory. Trust observed state transitions over assumed building identities.

### Building Identity Reference → see Part II

The full, engine-verified building table (cost, landscape, cloister flag, economic value, dwelling value, stage, and player-count availability for **every** France building) is now **Part II — Building Reference**; settlements are in **Part III**, goods values and sources in **Part IV**. Consult those before any unfamiliar `BUILD` or `USE` — identify a building by its verified row, never by name resemblance.

**Dwelling-value geometry (settlement anchors).** Wrap settlements around the highest-D buildings: F24 Cloister Church (9), F08 Market (8), F27 Palace (8), F11 Harbor / F17 Library / G28 Castle / G34 Sacristy (7); plus settlements themselves (Fishing Village 6, Hilltop 8) and Water (3). Keep settlements away from negative-D traps: G22/F29 Quarry (−4), G19 Slaughterhouse (−3), G07 Peat Coal Kiln (−2), G26 Shipyard (−2), S01 Shanty Town (−3). Cloister buildings (☩) cluster by rule, co-locating the high-D church complex — reserve a settlement pocket beside it, and remember G41 scores per ☩ building you built.

Point-goods values: book 2, ceramic 3, ornament 4, reliquary 8, Wonder 30, wine 1 (also 1 coin + 1 food), 5-coin nickel 2.

**Structural consequences of the 2p build set.** Per the engine's `roundBuildings`, **seventeen** France cards never appear in 2-player play (the 24-building 2p roster excludes them; see Part II): **G01** Priory, F03, G06, F09, F10, G13 (Start); F15, G16 (A); F20, F23, F25 (B); F29, F31, F32 (C); F36, G39, F40 (D). (Earlier notes said "sixteen" and omitted G01 — corrected.) Seven critical bottlenecks result:

1. **G34 Sacristy is the unique Wonder route** — no F25 Chamber of Wonders alternative
2. **Reliquaries dual-sourced only** — F24 Cloister Church (bread+wine, ≤2/turn) and F35 Forger's Workshop
3. **Stone single-sourced** — G22 wheel + G12 Merchant (≤5×: 2 food + 1 energy → 1 stone)
4. **Grapes single-sourced** — F14 alone; controls wine→reliquaries→Palace pathways
5. **Food→coin liquidity thin** — only F05 Bakery bread sale (≤2 bread @ 4¢) plus scattered sources (F08, G26, F30, G07)
6. **Priory (G01) is the sole tempo amplifier** — no F09/F23 workarounds; misplaced Prior = round-long commitment
7. **No unbuilt-building escape** — F40 Hospice removed; uncovered buildings permanently unavailable

**Identity verification rule:** a building's effect is confirmed only by an observed state delta (e.g., `bonus_actions` mutation) or the official index above, never by name resemblance or prior-session summaries. Two full turns were incinerated in game 2 acting on the unverified claim "G12 enables settlement." When identity is uncertain and the action is irreversible, consult this table, inspect state, or ask the human — do not probe by executing.

### Round Structure — Long 2p (canonical, from the detailed rulebook p.8)

The long 2-player game is round-based and uses the **front side of the production wheel** (values 0, 2, 3, 4, …) — *not* the slower back side of the normal 2p game. Each round: (1) any player with all three clergymen placed takes them back; (2) rotate the wheel one space counterclockwise; (3) a settlement phase fires if the beam passed the next card pile; (4) **the start player takes 2 actions, then the other player takes 1**; (5) start-player role swaps, then repeat. The 2-action block is the planning unit — schedule two-step combos (build → USE, produce → convert) inside your own block, never split across the opponent's interleaved action.

Goods-indicator entry is by **round number, not settlement letter** (my earlier "phases A/B" note was wrong). On the front wheel the multiplayer schedule applies: the **grapes** indicator enters round 8, **stone** round 13 (until then both are reachable only via the joker). Treat the rondel state in `get_game` as authoritative for the exact round — don't compute it from memory.

The three main actions: **place a clergyman** (USE a building — yours, or an opponent's via work contract), **fell trees / cut peat** (production-wheel quantity, spends NO clergyman, frees a landscape space), or **build a building** (cloister buildings ☩ must be orthogonally adjacent to your existing cloister; placing your prior on the new building grants an immediate bonus USE — the signature double-action). Extra/free actions, any number per turn before or after the main action: buy ≤1 landscape (`BUY_PLOT`/`BUY_DISTRICT`), `CONVERT` (flip grain→straw — irreversible; trade 5 pennies ↔ 1 nickel; wine→1 coin). Across your 1 trailing action + next round's 2-action block ("three in a row") you may buy up to two landscapes total.

**Game end (long 2p): no bonus round and no 5th settlement phase.** There are only four settlement phases, A–D. The endgame triggers once the D buildings are in play and **≤3 buildings remain in the open display**; finish the current round, then score — that is why game 2 ran to round 27 with no phase-E settle. After phase D the **Castle (G28) is the only route to place any further settlement**, the Hilltop Village (S08, D-tier) included.

### Engine Model: the Flower and its Frames

The JavaScript engine does **not** branch on round letters A–E, nor on the (country × player-count × length) matrix the rulebook organizes around. It generalizes all of that into a single structure: the **Flower** (the rondel / production wheel) carries an ordered **list of Frames**. Each Frame encodes, declaratively, what happens as the beam sweeps past it — introduce a card pile (the A/B/C/D buildings plus that tier's settlement), fire a settlement phase, enter a goods indicator (grapes, stone), or mark the terminal frame. The rulebook's A–E phases are just one projection of this Frame list; the engine treats them uniformly, which is why it needs no special-case code per variant.

This is exactly what `get_game.upcoming_turns` exposes: entries like `{round, player, settle, bonus, introduced: [...]}` are **Frames, read straight off the Flower** — not round-letters reconstructed after the fact. Practical consequence: to know whether the next turn is a settle turn, what bonus applies, or which buildings are about to arrive, **read the Frame list (`upcoming_turns`); never compute round letters from memory.** And because the rulebook's per-variant phase timing is collapsed into one general mechanism, divergences between rulebook and engine are most likely to surface at **Frame boundaries** — exactly when a phase fires, what it introduces, and the terminal condition. Watch those spots for bugs.

### Landscape Expansion Geometry (rulebook p.5)

Heartland is a fixed 2×5 strip (3 forest + 2 moor at start). Three ways to grow it, ≤2 buys per round in long 2p (one in your first action, one in the second/third):
- **Districts** (`BUY_DISTRICT`, cost 2–8, cheapest on top) stack flush above/below the heartland, no horizontal offset; each is a 1×5 strip placeable as *Moor/Forest/Forest/Hillside/Hillside* or *Forest/Plains/Plains/Plains/Hillside*. Source of forest/moor (fuel + free build space after felling) and extra hillside.
- **Coastal plots** (`BUY_PLOT … COAST`, cost 3–7) attach to the **left**: 2 water + 2 coast spaces. Water carries dwelling 3 even unbuilt — free settlement-neighbor value — and the coast spaces unlock Fishing Village (S04), Shipyard (G26), Harbor Promenade (F11), Shipping Company (F33), Windmill (F04).
- **Mountain plots** (`BUY_PLOT … PLAINS`/mountain) attach to the **right**: 2 hillside + 1 mountain (and each mountain space borders two hillside). The only source of mountain spaces (Castle G28, Quarry G22) and a source of the hillside needed for Grapevine (F14), Palace (F27), Hilltop Village (S08).

So a plot purchase is simultaneously a settlement-pocket decision (coastal water = cheap dwelling value) and a Castle/Hilltop enablement decision (mountain = the only G28 site) — not merely "more space."

**Pricing direction is resolved (Part I.9), but still READ IT LIVE** from `get_game.district_purchase_prices` / `plot_purchase_prices` for the exact next price. In **2/3/4-player** games the piles are cheapest-on-top, so prices **rise** as you buy (districts `2,3,4,4,5,5,6,7,8`; plots `3,4,4,5,5,5,6,6,7`) — there *is* an early-bird discount, so buy land early. In the **solo** game the piles are flipped (most expensive first), so prices **fall** as you buy (districts `8,7,6,5,5,4,4,3,2`; plots `7,6,6,5,5,5,4,4,3`) — no rush on price, but option value still argues for buying when you can use the space. **Either way, buy for option value:** a district bought round 4 grants ~15 more rounds of building/settling on the new space, while one bought on the final turn recovers only its raw tile value with nothing built on it — and that option value falls as the game shortens. (The historical "the engine flip-flopped" note is superseded: 2/3/4p rises, solo falls — verified in `board/landscape.ts`.)

### The Castle Settlement Protocol (exact, verified sequence)

When the settle-granting building sits on the **opponent's** board:

```
WORK_CONTRACT G28 <payment>     # e.g. PnPn — pays the OPPONENT; THEIR clergy mans the building
USE G28                         # activates the effect → bonus_actions = ["SETTLE"]
SETTLE <S> <col> <row> <pay>    # e.g. SETTLE SW5 -1 0 NiWo
COMMIT
```

Postcondition invariants to check between steps:
1. After `WORK_CONTRACT`: `main_action_used: true`; opponent clergy (e.g. LB2R) appears on the building; payment transfers to opponent's stock. **SETTLE is not yet legal** — see phantom legality below.
2. After `USE`: `bonus_actions` contains `"SETTLE"` and `upcoming_turns[0].settle` flips true. This field is the authoritative precondition; if it's empty, every SETTLE will be rejected regardless of what `get_legal_moves` enumerates.
3. `USE` after `WORK_CONTRACT` does **not** consume a second main action — both belong to one turn's command sequence.
4. `COMMIT` only after the bonus action is spent. Committing early forfeits it (game ends if final turn).

Cost accounting: a coin-paid WORK_CONTRACT is a wealth transfer to the opponent (their pennies increased 4→6 in game 2); a wine present is not (it returns to the supply). Either way the cost is strictly dominated by a well-chosen settlement gain (+17 here), but fold it into the move's net value — and prefer wine when holding any.

### The Castle Protocol — When You Own It

If you build the Castle yourself, the work-contract step disappears — you USE your own building directly, and your own Prior on it grants the immediate bonus action:

```
BUILD G28 <col> <row>           # 6 wood + 5 stone, on a hill/mountain space you own
USE G28                         # with your Prior → bonus_actions gains "SETTLE"
SETTLE <S> <col> <row> <pay>    # the bonus settle; pay its food + energy
COMMIT
```

This is strictly better than contracting an opponent's Castle: no coin or wine cost, no opponent income, and — critically — it is **repeatable every recall cycle**. Each round you bring your clergy home, USE the Castle again for another settlement. It is the single highest-VP engine in the long 2p game: the opponent in game 4 placed 7 settlements (to my 4) almost entirely through a self-owned Castle from round 24 on. **Secure the materials (6 wood + 5 stone) and a mountain/hill plot to site it by roughly round 18–20**; every recall cycle after that is a free 15–25 VP settlement. (See Principle 6 — this is what the hoarded stone is *for*.)

### Settlement Payment Economics (food + fuel)

Every settlement costs food AND fuel simultaneously. Verified resource values:

- **Food:** Nickel (5-coin tile) = 5, Meat = 5, Beer = 5, **Bread = 3**, Sheep/livestock = 2, Grain = Grape = Penny = Flour = Wine = 1. Wine additionally carries 1 coin + 1 point; a 5-coin tile is worth 2 points.
- **Fuel/energy:** Peat coal = 3, Peat = 2, Wood = 1, Straw = 0.5

**Settlement-payment hidden tax — prefer zero-base-point goods.** When goods are consumed for settlement payment, any endgame scoring value they carry is forfeited:

| Good | Food value | Endgame point cost when paid |
|------|-----------|------------------------------|
| Grain / Flour / Penny | 1 | 0 |
| Sheep / Livestock | 2 | 0 |
| Bread | 3 | 0 |
| Meat / Beer | 5 | 0 |
| Wine | 1 | **1** |
| Nickel (5-coin tile) | 5 | **2** |

Strategy: a Village (S07, 15 food) paid with 3 meat costs 0 endgame points; paid with 3 nickels it forfeits 6. Prefer dumping zero-point goods (grain, sheep, bread, meat) before spending wine or nickels when the combinatorics allow.

Settlement index (France; cost is energy + food, "initial value" = own dwelling + own land before neighbors):

| ID | Settlement | Cost (E+F) | Dwelling | Initial | Notes |
|----|-----------|------------|----------|---------|-------|
| S01 | Shanty Town | 1+1 | −3 | −3 | Recoverable via neighbors; never place other settlements adjacent to it |
| S02 | Farming Village | 3+3 | 1 | 2 | |
| S03 | Market Town | 0+7 | 2 | 4 | Zero energy cost |
| S04 | Fishing Village | 3+8 | 6 | 10 | Coast only |
| S05 | Artist's Colony (A) | 1+5 | 5 | 4 | Economic value −1 |
| S06 | Hamlet (B) | 6+5 | 4 | 7 | |
| S07 | Village (C) | 9+15 | 6 | 14 | |
| S08 | Hilltop Village (D) | 3+30 | 8 | 18 | Hillside only; **in the 2p long game the Castle is the ONLY way to place it** |

Scoring decomposes into three independent buckets (rulebook p.7), exactly matching the engine's `score` object: **(1) goods** = point values on held tiles (book 2, ceramic 3, ornament 4, reliquary 8, Wonder 30, wine/whiskey 1, 5-coin tile 2); **(2) economic** = summed economic values of all your buildings AND settlements (dwelling values irrelevant here — this is where SW5's −1 lives, taking white 42→41); **(3) settlements** = for each settlement, its own dwelling value plus the dwelling values of every orthogonally adjacent card.

Two canonical scoring levers I had missed:
- **A building adjacent to *k* settlements contributes its dwelling value to all *k* of them.** A single high-D anchor (Cloister Church D=9, Market/Palace D=8) wedged between two or three settlements pays out two or three times. The endgame geometry to chase is a *cluster* of settlements sharing high-D neighbors, not isolated placements.
- **Settlements have dwelling value and count as neighbors of each other** (engine-verified: placing SW5 next to SW4 raised SW4's score 9→14). Water spaces carry dwelling 3 even unbuilt. Negative dwelling values (Quarry −4, Slaughterhouse −3, Kiln/Shipyard −2) **only matter when adjacent to a settlement** — sited away from settlements they are free; sited beside one they bleed every adjacent settlement.

Therefore evaluate the full product space settlement × location × payment, and prefer locations that touch the most dwelling value (counting shared anchors once per settlement). In round 27, SW8 (initial 18) was also placeable; SW5 won only because its coastal pocket (G12 + SW4 + water) summed higher.

Payment selection is a min-cost covering problem: `get_legal_moves(["SETTLE", S, col, row])` enumerates the exact feasible payment set; choose the bundle with lowest residual scoring value (e.g. `NiWo` = nickel + wood cleanly covers 5 food + 1 energy with minimal point sacrifice — but a 5-coin tile IS worth 2 points, so prefer dumping zero-point commodities like grain/sheep/grapes when the combinatorics allow).

**Verified Castle settle payment (game 3, Settlement D, SR8 Hilltop Village):** `SETTLE SR8 5 0 NiNiNiNiNiNiCo` — placed on a mountain-plot hillside at (5,0), adjacent to LR1 (D=3). Payment: 6 nickels = 30 food (exact match for SR8's 30F cost) + 1 peat coal = 3 energy (exact match for SR8's 3E cost). Zero overpay, zero waste. Score delta: +11 settle (own D=8 + LR1 D=3) + 10 econ (S08 economic value) − 12 goods (6 nickel chunks × 2 pts each) = **+9 net**. General rule: when food cost is divisible by 5, Ni×n is a clean exact-match payment; coal/peat-coal handle energy in 3s cleanly.

### Work Contract Pricing (rulebook-verified)

Base price: 1 coin, paid to the building's owner; the owner mans the building with one of THEIR clergymen (yours stay free). Once the Winery (F21) is built — by anyone — the price rises to 2 coins for all players for the rest of the game (hence `PnPn` in game 2). One wine may always be paid instead, regardless of price level ("present for the host") — and per the overview sheet **the wine is drunk and returned to the general supply, not given to the opponent**. So post-Winery the wine present is doubly correct: it costs you ~2 points of value instead of 2 coins, AND denies the opponent the 2-coin income — a relative-score swing of roughly 2× the coin route. The engine accepts `WORK_CONTRACT G22 Wn`.

**Winery (F21) as strategic lever.** Building F21 creates three compounding effects simultaneously:
1. **Capture** the grapes→wine conversion chain (wine = 1 food + 1 coin + 1 point; sellable @ 7¢)
2. **Tax** every subsequent work contract by +1¢ for both players — once F21 is built this is permanent and irreversible
3. **Amplify** the wine-present tactic: paying 1 wine instead of 2 coins denies the opponent the 2-coin income AND saves 1 coin, making it ~2× more cost-effective than the coin route

Front-load the F21 build once grapes are in hand and the opponent relies on work contracts. An opponent running a WC-heavy strategy (e.g. to access your converters) pays 1 extra coin per WC for the rest of the game — compounding across 10+ WCs this is a decisive tempo swing.

### Palace (F27) — The Anti-Work-Contract Engine

The Palace (25 coins, **+25 VP**, **D = 8**, hillside) carries the most flexible ability in the game: **pay 1 wine → USE any *occupied* building**, regardless of whose clergy sits on it. This bypasses the work-contract mechanic entirely — a building another player has manned (normally locked to you) becomes usable for a single wine.

Two consequences worth planning around:
- **It defeats blocking.** An opponent occupying a key converter to deny you no longer succeeds; burn a wine and use it anyway.
- **It enables double-firing.** Work-contract a building (1 wine, the opponent mans and uses it), then immediately Palace it (1 more wine) for a second activation of the same building in one turn.

At 25 coins it is a heavy investment, but the +25 VP alone nearly repays the cost in points, the D = 8 anchors a settlement pocket, and the ability compounds every turn you hold wine. Stockpiling coins early (e.g. repeated `USE` on a coin-pull landscape to draw the coin token) is the prerequisite. In game 4 I never approached 25 coins and left this entire axis unused.

### Official Final-Action Menu (France, from the rulebook)

The endgame is a one-shot argmax over this menu. Approximate net deltas:

- **Castle G28 → SETTLE**: often the maximum; a Hilltop Village placement can exceed +20
- **Cloister Church F24**: +7 per bread+wine set, ≤2 sets (wine's own point already counted)
- **Sacristy G34**: +13 (book+ceramic+ornament+reliquary → Wonder)
- **Cloister Workshop G18**: up to +13 gross (3 ceramics + 1 ornament, minus energy)
- **House of the Brotherhood G41**: 5 coins → 1½ pts per cloister building (2p long)
- **Forger's Workshop F35**: +6 for 5 coins; +4 per additional reliquary at 10 coins (unlimited within-USE scaling — `reliquaries = 1 + floor((coins − 5) / 10)`; see Engine Quirk 12 if planning off the completion list)
- **Printing Office F38**: up to +8 (≤4 forests → books)
- **Dormitory F37**: +3, then +2 per straw+wood set
- **Estate G39**: +6 or +12 dumping food/energy *(not in 2p)*
- **Winery F21 / Shipping Company F33**: situational wine production

Run the comparison explicitly before the last COMMIT. Game 2's round-27 instance: Castle settle (+17) vs Cloister Workshop (~+8 net) — settle dominated.

**Endgame goods engine — the saturated-board pivot (solo-verified, +46 goods in the recovery game).** When the board is saturated and settlements are too food/energy-expensive to keep firing, pivot to a points loop that needs no land: **Clay Mound → clay** (own), **Cloister Courtyard → wood/energy** (own or contracted), **Workshop (G18): 3 clay → 3 ceramic = +9**, **Library (F17): coins → books = +2 each**, and **Bathhouse (F23) recall via `USE F23 Pn`** so the Workshop/Library fire again next turn (the recall itself adds a book + ceramic). **Market (F08): 4 different goods → 7 coins + 1 bread** is a strong one-shot for liquidity and a little food when the loop runs short of pennies. Goods values for the comparison: reliquary 8, ornament 4, ceramic 3, book 2, nickel 2, wine 1.

### Canonical Rules & Divergence Protocol

The authoritative rules are the official Lookout/Z-Man documents (setup sheet, 4-page general rules, 8-page detailed rules, 12-page glossary), public at `https://www.lookout-spiele.de/en/games/ora.html`. **The rulebook is ground truth; the Kennerspiel engine is an implementation of it.** Where the engine's behavior diverges from the rulebook, that is a *bug in the engine*, not a rule to internalize — capture it as a GitHub issue (describe observed vs. expected with a reproduction), then resume play against the engine's actual behavior. Do not silently encode buggy behavior as strategy.

### Kennerspiel Engine Quirks & Suspected Bugs

1. **Phantom SETTLE legality (suspected bug — file an issue).** `get_legal_moves(["SETTLE", …])` enumerates full settlement/coordinate/payment completions even when `bonus_actions = []` and no settlement phase is active, yet `make_move` correctly rejects them all. Per the rulebook, SETTLE is legal only during a settlement phase or via the Castle bonus, so the enumerator and the executor disagree — `get_legal_moves` is over-permissive. *Expected:* `get_legal_moves` should offer SETTLE only when a settle action is actually available. *Workaround until fixed:* treat the game-state `bonus_actions` array (and `upcoming_turns[0].settle`) as ground truth for whether SETTLE will be accepted; the completion list is necessary but not sufficient.
2. An empty-string completion with `partial_is_complete_command: false` means "syntactically complete, semantically unverified" — not a guarantee the engine will accept the command.
3. After any human rollback, re-fetch `get_game` before reasoning; in-context state is stale and `move_count` is the cheap staleness check.
4. `join_game` takes parameter `instance`, not `instance_id`.
5. **Round Tower dwelling value — FIXED in the current source (now 2).** `pointsForDwelling(RoundTower)` returns **2** in `src/board/erections.ts` today, matching the rulebook/overview; the historical `9` data bug (which over-credited adjacent settlements in Ireland games) is resolved. Round Tower is Ireland-only (I35), so France play was never affected. Audit footnote retained: in the broader audit this was the *only* erection discrepancy — every cost, economic value, the other dwelling values, and all 8 settlement food/energy costs match canon (and were re-verified against the engine when Parts I–V above were written).
6. **Sacristy (G34) build cost — engine accepts grain in place of straw (verify vs. rulebook).** The building table and overview sheet print G34's cost as 3 stone + 2 straw, but in game 4 the engine accepted `BUILD G34 4 2` while I held **zero straw**, consuming 2 grain instead. Either grain is being treated as a straw substitute for this cost, or the straw requirement is mis-encoded. *Expected (per overview):* 2 straw specifically. *Observed:* 2 grain accepted, build succeeded, and `USE G34 BoCeOrRq` then produced the Wonder. File an issue with the reproduction; until resolved, you can satisfy the G34 build with grain on hand — which makes the Wonder line materially easier, since grain is far cheaper to mass-produce (G02 → rondel) than straw.
7. **`get_legal_moves` is heavily over-permissive on verb drill-down (solo-verified).** Beyond the phantom-SETTLE case in quirk 1, the enumerator also lists `USE` and `WORK_CONTRACT` continuations that the executor will reject — no clergy free, no coins, settle phase inactive, etc. **Ground truth is the `get_game` frame**: `clergy`, `bonusActions`, `usableBuildings`, and your coin count. If top-level `get_legal_moves([])` returns an empty completion list, you genuinely have no legal move; otherwise drilling alone is not a legality proof.
8. **Cloister Garden (F09) combo confirmed (solo-verified).** `USE F09` → +1 grape **and** a free bonus USE of one unoccupied orthogonal neighbor, spending no clergyman. The free use appears under `USE` in `get_legal_moves` even though `bonus_actions` stays `[]`. Excellent for cheap repeated double-actions — free Windmill (grain→flour+straw), free Courtyard, etc.
9. **Quarry (G22) yields 0 stone when the stone production-wheel value is 0.** `USE G22` against a zero-value stone token is a wasted action. For reliable stone use the **Stone Merchant (G12)** (2 food + 1 energy → 1 stone, ≤5×), or wait until the wheel value is non-zero.
10. **Shipyard (G26) USE returns a nickel (5-coin tile, 2 pts) + 1 ornament for 2 wood** — not loose pennies. Factor the nickel's 2 VP into the per-use value.
11. **Start-building grammar.** `USE LRx` with no argument resolves to either the **Cloister Office** (produces coins at the coin-wheel value) or the **Clay Mound** (clay) depending on which LR slot it is. The **Farmyard** is a fork that requires the explicit good: `Sh` (sheep) or `Gn` (grain). Output quantity = current rondel token value, so harvest these when the relevant token is hot.
12. **Forger's Workshop (F35) reliquary cap — move enumerator under-reported (fixed).** A recent game surfaced that `get_legal_moves(["USE","F35"])` only ever offered the 5¢ and 15¢ payments (1 or 2 reliquaries), even when the player held far more coin — capping the enumerated payoff at 15¢ → 2 reliquaries. The **executor was always correct**: a single `USE F35` honors the full rulebook scaling (5¢ for the 1st reliquary, +10¢ each thereafter — 5/15/25/35/45… → 1/2/3/4/5…; see the within-USE scaling note above), so the cap lived purely in the completion/enumeration path. *Fixed:* F35's `complete` now enumerates every affordable 5+10n tier (most-expensive-first), so the enumerator matches the executor. Until the deployed engine ships the fix, do **not** trust the F35 completion list as the ceiling — the executor accepts 25¢/35¢/45¢ payments the enumerator may omit; compute the reliquary count yourself from coins on hand (`reliquaries = 1 + floor((coins − 5) / 10)` for coins ≥ 5). **Rollback caution (over-permissive direction, cf. quirks 1 & 7):** F35 is a one-clergy building — a `USE` seats a clergyman and the building is occupied until a recall (round-wave or paid Bathhouse `USE F23 Pn`). The enumerator can still list a second `USE F35` before the clergy have actually recalled; attempting it triggers a rollback. Ground-truth the clergy/occupancy state in `get_game`, not the completion list, before planning a second fire.
13. **BUILD F35 accepts ClCl (2 clay only), waiving the straw requirement (suspected bug — file an issue).** Rulebook lists F35 build cost as 2c + 1sw. The engine accepted `BUILD F35 X Y ClCl` with zero straw on hand in game 3. *Expected (rulebook):* 2 clay + 1 straw. *Workaround:* the clay-only path is usable until fixed; it makes F35 materially cheaper to place, especially early when straw is scarce.

### Final-Turn Decision Discipline

1. **Dominance principle**: never play a move when a known alternative strictly dominates it in points. If A yields x, B yields y, and y > x with both known, choosing A is an unforced error of magnitude y − x. This is the zeroth axiom; everything else is implementation detail.
2. **No experimental main actions**: the main action is a non-renewable resource within the turn. Executing "USE G18 to see what happens" converts an information query into an irreversible commitment. Resolve uncertainty by drilling `get_legal_moves`, inspecting state deltas, or asking — never by spending the action.
3. **Explicit instruction ⇒ exact execution**: when the human specifies the move, the search space collapses to a single element. Execute verbatim, verify preconditions, do not substitute a "similar" building or improvise.
4. **Terminal-state objective**: at the last action, the only objective is Δ(score). Any action with Δ(score) = 0 (e.g., USE on a non-scoring building, grain→straw conversion) is dominated by every scoring alternative.

### Key Takeaways — Game 2 (Red 361, White 91)

- 287-point loss decided in rounds 4–8: red's F04→F17 grain→flour→book chain (143 economic) compounding alongside the SR2/SR5 settlement engine (157 settlement). Endgame amplifiers (F24, G34) only multiplied an engine that already existed.
- The Castle protocol, executed correctly, recovered +17 in one turn (74 → 91) — proof the sequence works, and a measure of what each earlier settle-capable turn left on the table.
- Failure taxonomy this game: unverified building identities (2 burned turns on G12/G18), trusting phantom legality (4+ rejected SETTLEs), incomplete protocol knowledge (WORK_CONTRACT without the USE step), and improvising against explicit instruction.
- White ended with SW6, SW7, SW8 unplaced — 7 + 14 + 18 = 39 initial points stranded in supply. In the 2p long game the Hilltop Village can ONLY enter via the Castle, so every settle-capable turn skipped is potentially that 18+ permanently forfeited.
- Next game: converter window rounds 5–8 remains the decisive battle; the endgame protocol above is now solved and should cost zero rollbacks.

### Key Takeaways — Game 4 (Green 407, White 261)

- 146-point loss with an *inverted* profile from game 2: I **won the goods column (+40)** — a completed Wonder via the Sacristy, plus a 19-book / 11-ceramic stockpile — but lost economic by 93 and settlements by 93. Winning goods while losing the other two columns by ~90 each is the signature of conceding the Castle-settlement engine.
- **The decisive error was stone allocation.** An early Stone Merchant (G12) lead was spent on G18 ceramic/ornament conversion instead of being banked toward a Castle. The opponent built a self-owned Castle around round 24 and fired it every recall cycle, placing 7 settlements to my 4. Stone hoarded for Castle/Sacristy is worth multiples of stone burned on ornaments (Principle 6).
- **The Wonder chain works end-to-end** (Sacristy build → `USE G34 BoCeOrRq` → +1 Wonder, ~+13 net in the move) and carried the goods-column win. The engine accepted the G34 build with grain substituting for straw — see Engine Quirk 6. But a single Sacristy fires the Wonder only as fast as you can recall and re-collect its four ingredients; it caps around +30–60 VP and does not, alone, out-race a Castle settlement engine.
- **Shipyard (G26) plateaus.** Work-contracted four times for 4 ornaments + 4 nickels (~+6 VP/action), but it is once-per-turn and its ornaments compound only if a downstream multiplier exists (Sacristy, or F36 Pilgrimage Site upgrading ornament → reliquary). I ended holding 4 unspent ornaments = 16 flat VP that never multiplied.
- **Two whole strategic axes were left unused: the self-owned Castle and the Palace.** Both were identified only in hindsight. Next game: commit to one of three openings — Castle-settle, Wonder-goods, or Cloister-cluster — by round 6, and if it is Castle-settle, route every stone and a hill/mountain plot toward G28 by round 18–20.

### USE Command Grammar — Clergy Assignment and Token Selection (engine-verified)

`USE <building> [token]` carries two independent degrees of freedom the engine resolves separately: **which clergyman is placed** and **which production-wheel token is reset**. Either one, set wrong, silently changes the result.

**Clergyman (who mans it).**
- Bare `USE <building>` auto-assigns a **lay brother** when one is home — the correct default for ordinary production. Do not spend the Prior reflexively.
- To man it with the **Prior**, issue the standalone command `WITH_PRIOR` *first*, then `USE <building>`. `WITH_PRIOR` is a flag for the next USE, not a building target. (Separate from the build-time bonus, where placing the Prior on a just-built building is auto-handled and grants the immediate bonus USE.)

**Token (which wheel token resets).** The optional trailing token names the production-wheel token to harvest-and-reset, defaulting to the building's natural good. The lever here is the **joker**:
- `USE <building> Jo` harvests the good at the **joker token's** value — the joker *substitutes* for the good's own token — and resets the **joker**, leaving the good's own token untouched to keep climbing. The payout therefore equals the joker's value, **not** the good's, so `Jo` is only worth it when the joker token ≥ the good's own token: to bank a larger harvest, and/or to preserve a hot good-token for a later use (or a later-acting color). When the joker is low — e.g. someone just drained it to 0 — `Jo` yields almost nothing; use the bare command. The joker is **shared by all players**, so a fat joker is a race: whoever harvests next claims it.
- bare (no token) resets the good's own token.

**Buildings this governs (production-wheel):** Clay Mound, Cloister Office, Farmyard, Vineyard (F14), Quarry (G22).

**Farmyard requires an explicit good** (it is a grain/sheep fork): `Gn` → grain (resets grain token), `Sh` → sheep (resets sheep token), `GnJo` → grain off the joker (grain token preserved), `ShJo` → sheep off the joker (sheep token preserved).

**Do not conflate with conversion-input tokens.** Some buildings take a trailing token that names a *conversion input*, not a wheel selector — `USE G07 Pt` flips peat → peat coal (the Peat Coal Kiln's free flip), unrelated to the joker. Read each building's effect before assuming the trailing token is a wheel selector.

**Empty-completion trap — the bare `USE <bldg>` is usually a no-op (solo-game-verified).** For most converting/paying buildings, the bare-verb completion (`""`) that `get_legal_moves` offers means "occupy the building but do **nothing**" — no conversion, no payment, no effect. The action and the clergyman are spent for zero return. **Always pass the explicit conversion/payment tokens.** Concrete traps:
- **Bathhouse (F23) recall: `USE F23 Pn`.** Bare `USE F23` does NOT recall clergy — it just seats a clergyman on F23 (the wasted-action this caused in the solo soft-lock). Keep ≥1 coin if you plan to reset clergy via F23.
- **Calefactory (F32): `USE F32 Pn`-style.** You MUST pay the penny or the free FELL_TREES / CUT_PEAT bonus actions never appear.
- **Slaughterhouse (G19): pair sheep and straw in equal amounts** (1 straw per livestock→meat). Run most/all of them for food (meat = 5 each), but reserve a straw or two if a build that turn needs it (straw is a common build cost).
- **General rule.** Before sending a USE, decide the exact quantities; the engine will not "do the obvious thing" for you. The bare-verb completion is a silent waste of the action.

### Opening Book — France, long 2p (living, not dogma)

Strong tested defaults; **keep observing the opponent and re-deriving.** An opening blind to the other player's development is a memorized line waiting to be punished — explore the deltas every game and fold what wins back into this section.

**Pick the opening by which round-2 build you intend to make, not by which production maximum looks largest in isolation.** Four viable turn-1 builds from the thin starting hand (1 each of peat/penny/clay/wood/grain/sheep):

| Build | Cost | Bonus USE yield | Round-2 intent |
|-------|------|-----------------|----------------|
| **G07 Peat Coal Kiln** | 1 clay | +1¢ + 1 peat coal; flip peat→coal | 2¢ landscape purchase turn 2; coin-mint base |
| **G12 Stone Merchant** | 1 wood | 2 food + 1 energy → 1 stone | Unlocks Market (F08) or Library (F17) by rounds 2–3 |
| **G02 Cloister Courtyard** | 2 wood | 3 different basics → 6 identical | Diversity conversion base; cloister cluster seed |
| **G01 Priory** | 1w+1c | Use an occupied building via your Prior | Rarely useful first player; viable second-player to chain opponent's prior |

**Start-player round-1 block (2 actions), default opening:**
1. `BUILD G07` on a central interior plains plot, then take the auto-granted bonus `USE G07 Pt`. Penny scarcity is the game's binding constraint, and G07 (1 clay — the cheapest coin-minting tile) is the earliest fix; the Prior bonus USE nets +1 coin, +1 peat coal, and flips the starting peat to coal (fuel-3 > fuel-2, free). Economic +4 immediately. G07's −2 dwelling also wants to sit interior, away from future coastal settlement pockets. The Prior parks here and recycles on the round-4 wave recall — clear of the 5–8 converter window.
2. `FELL_TREES` on a forest. Wood is the broadest build material (G02 2w, F04 3w, G18 3w) and felling also opens a build plot, pre-empting landscape saturation; it is clergy-free, so both lay brothers stay home. +2 wood at the round-1 wheel value.

**Post-opening fork (landscape-gated):** with no free coast/hillside in the heartland (the common case), F04 Windmill is unbuildable, so the accessible converter axis is stone-based — **F08 Market** (E8; "4 goods → 7 coins + bread"; D8 settlement anchor) and **F17 Cloister Library** (the book engine) — which makes **G12 Stone Merchant** the natural follow-on build, plus a coastal plot around rounds 4–5 for cheap settlement dwelling value and to unlock F04.

### Opening Book — France, long 4-player (faster startup)

The 2p opening book above does not transfer cleanly to a 4-player long game — the structure, the deck, and the table dynamics all differ. Internalize these before move 1 so the opening runs without fumbling.

**Turn structure.** Each round the **start player takes two actions (the first AND the last turn of the round); everyone else takes one.** The start-player role rotates each round. With seating R-G-B-W and white opening, round 1 is `W, R, G, B, W`; round 2 (red start) `R, G, B, W, R`; etc. The start player's two actions are **split** by the other three players' turns — they are two separate turns, each ending in its own COMMIT — so a build plus its bonus-USE must fit inside one of them, and a hot wheel token you are eyeing for your second action can be reset by an opponent before you reach it.

**The full building deck is live.** All sixteen buildings that 2p France excludes are present (F03 Grain Storage, G06 Fuel Merchant, F09 Cloister Garden, F10 Carpentry, G13 Builders' Market, and the rest). The round-1 display is `G01 G02 F03 F04 F05 G06 G07 F08 F09 F10 F11 G12 G13`. Plan from this deck, not the 2p set; the structural-bottleneck analysis written for the 2p build set does not apply.

**One shared deck + three Claude colors → diversify win conditions by pick order.** There is exactly one of each building, and the three colors compete for the same deck (and against the human). Give each color a different compounding win condition and let pick order drive the scarce grabs:
- The opener (round-1 start player) takes the **most resource-hungry plan and grabs the scarcest engine first** — Castle-settle, opening `BUILD G12` (the only stone engine in the display) → `USE G12 ShPt` to bank the first stone before anyone snipes it.
- A later-picking color takes the **F04 Windmill → F05 Bakery → F24 reliquary** chain; it needs a bought coast plot before F04 anyway, so it opens by minting coins rather than racing for a card.
- Another takes the **cloister-cluster → Sacristy Wonder**, opening on a cloister building and leaning on the Priory.

**The Priory (G01) — the key 4p tool, absent from 2p.** `G01` (1w+1c, ☩, +4E) lets you USE any building that has a **prior** on it — yours or an opponent's — for free, with no work-contract fee. It is a **two-step** command, not one:
1. `USE G01` seats a lay brother on the Priory and drops a FREE bonus USE into the frame (the state's `nextUse` flips to `free`; the summary view does not show this — confirm via the USE menu, which will now list the prior-occupied targets).
2. `USE <target>` — e.g. `USE G12 ShPt` to mint stone off the Stone-Merchant owner's prior, paying only your own goods.
`USE G01 G12 ShPt` as a single command is rejected. The Priory also consumes a lay brother, advancing you toward the all-three-placed recall, so your prior cycles home sooner. **Caveat:** G01's *build*-bonus is a no-op unless you already have a prior-occupied building on your own board — on a turn-1 build your prior is still home, so skip the bonus (skipping leaves the prior home).

**The shared production wheel rewards harvest order.** All players draw from one wheel; harvesting a good **resets its token to 0 for everyone behind you in turn order**. The first harvester of a hot good (clay at 4, say) takes it and leaves 0 for the rest. With three colors acting in sequence, coordinate rather than collide: if green takes the hot clay, blue pivots to the next-best token; do not point two of your colors at the same hot good in one round, and do not strip a token (e.g. grain) that a *later-acting* color of yours needs more than the current one does. Tokens climb one step per round, so a drained token rebuilds.

**Use the joker to hand a token to your next color (and to deny the human).** The joker substitutes for any good's token; `USE <building> Jo` harvests at the **joker's** value and resets the **joker**, leaving the good's own token standing. When two of your colors want the same wedge in one round, the earlier color can harvest off the joker (whenever joker ≥ the good's value) to take its share while **preserving the good's token for the later color** — e.g. blue minting coins via `USE LB3 Jo` so the coin token survives for green's coast-plot purchase at a later seat. This also drains the shared joker away from the human. (See the corrected joker rule in the USE-grammar section: `Jo` pays the joker's value, not the good's, so it is worthless when the joker is low.)

**G02 Cloister Courtyard is the opening's best converter.** `BUILD G02` (2w, ☩, +4E) then `USE G02 <3 distinct goods><output>` turns three junk goods into **6 of any one basic** — a single use mints the Castle's entire 6 wood, or 6 grain for settlement food, or 6 peat to fuel a stone engine. The syntax is fussy: stone is `Sn`, wood is `Wo`, and the input triple's token order is fixed by the engine — drill `get_legal_moves ["USE","G02"]` rather than guessing (a wrong guess like `PnClGn Wd` is rejected; the legal form this game was `PnGnCl Wo`).

**Clergy cycling — and the start-player trap.** One Prior + two Lay Brothers; recall fires at ROUND START only when all three are placed, and a bare `USE` auto-seats a lay brother (preserving the prior). Place all three in a round to recall next round and cycle the prior back for build-bonuses — but watch the trap: if you spend your last home clergy on your *first* action as start player, your *second* (last-of-round) action is stuck with only the clergy-free verbs (FELL / CUT / BUILD) and cannot reach a hot wheel token. This stranded green off a grain-5 token this game.

### Key Takeaways — Game 3 (France long, 2p, in progress through round 17)

A close game (white 109, red 107 at round 17) that hinged on a single building race.

**The unique-building race — the decisive lesson.** White spent rounds 14–15 *setting up* for the Cloister Church (F24): bought a cloister-adjacent district (telegraphing intent) and mined 4 stone for its cost, planning to build it round 16 with the Prior's bonus USE and transmute 6 books. Red, the round-16 start player, built it first on a plains tile they *already owned*, fed by a wine+bread stockpile, and minted 2 reliquaries (+~20 goods, economy 39 to 51) — vaulting 75 to 107. **A unique high-value building is a race, not a project.** If you can build it now, build it now; do not burn two rounds gathering toward it while an opponent with a ready tile and ready inputs sits before you in turn order. Buying a cloister-adjacent district is a tell that announces the target. When the prize is unique and the opponent's path is shorter, either accelerate brutally (build it the turn it becomes reachable) or abandon the plan and deny by other means.

**Work Contract as adversarial timing (2p).** Losing the building does not lose access to it — `WORK_CONTRACT F24 ...` lets you USE red's Church (their clergy mans it; pay 1 coin, or 1 wine which returns to supply). In 2p this is a genuine disruption lever: contract the building on the turn its owner most needs it free, or to drain an input they were hoarding. But it only disrupts when the opponent's plan is *legible* — guess wrong and you have wasted the coin and the action. The leverage scales DOWN with player count: in 3–4p, hampering one of several opponents is usually dominated by simply advancing your own engine. 2p is the regime where denial/timing plays earn their keep; in larger games, concentrate on your own board.

**Building-ID corrections (this engine).**
- **G22 = Quarry**: mountain-only (`BUILD G22` offered only the lone mountain coordinate), dwelling −4, a stone producer — NOT a prestige build. Do not chase it; its negative dwelling poisons any adjacent settlement and the Stone Merchant already covers stone. A mountain-only placement signature does not imply a high-ceiling building.
- **G26**: offered no legal placement on a landlocked board — coast-requiring, effectively unavailable inland.
- The unaffordable-leaf signature recurred verbatim: `BUILD G22 6 1` returned completions `[""]` with `partial_is_complete_command: false` = valid tile, insufficient resources. The placement enumerator ignores cost; the cost check fails silently at the leaf. Same pattern blocked `BUILD F24` until stone was in hand. Treat that exact `[""]` + false leaf as "cannot afford / cannot complete," never as "send it."

**Engine signal — `upcoming_turns[*].introduced`.** This array flags the round a new building/resource enters the supply (observed `introduced: ["stone"]` queued for round 18 — plausibly the Castle G28 or another stone-tier building). Read it to time big builds and anticipate what the opponent may grab next.

**Goods-value confirmations.** Ornament = 4 (clean read: a 2-pottery + 1-ornament Workshop batch scored +10 = 6 + 4). The Cloister Workshop is clay-limited on pottery, NOT hard-capped at 3 items — `ClClSnWoWoWo` (2 pottery + 1 ornament) was the per-use max only because clay was 2; with clay >= 3 the menu extends to 3 pottery + 1 ornament. One ornament per use is the ornament ceiling; pottery fills the remaining slots up to clay on hand. Because it is 1 ornament/use, a small stone reserve (~3) covers ornaments for the entire endgame — do not over-mine stone for them; reserve stone for builds.

**Position note (post-Cloister-Church-loss).** Reliquary parity is unreachable without the Church. White's path: fire the Workshop (pottery + ornament, ~+10/recall cycle) and Library (books, +6/cycle) every recall; treat the Castle (G28; watch the round-18 introduction) as the one remaining high-ceiling lever — it is also the ONLY route to the Hilltop Village in 2p long; and salvage settlement points where high-D anchors (Market 8) still leave open pockets. Win on breadth (pottery + ornaments + books + a Castle settle), not by matching red's reliquary engine item-for-item.

**Landscape-tile convention.** The `L` prefix marks tiles that come WITH the landscape — `LMO` Moor (cut peat), `LFO` Forest (fell trees) — not erectable buildings. Distinct from the L-numbered STARTING buildings (`LW1`/`LR1` Clay Mound, `LW2`/`LR2` Farmyard, `LW3`/`LR3` Cloister Office), which are real erections that ship on the starting board.

### Key Takeaways — Game 3 (concluded; the endgame collapse, round 27 / settlement D)

White lost decisively, 199 to 308 at termination, after being within ~15 at round 17. The collapse is the instructive part: white's *engine worked* and white still lost by 100+.

**Optimize the column you are LOSING, not the one you are winning.** Final columns: goods white 123 / red 53; economic white 31 / red 124; settlements white 45 / red 131. White won goods outright (pottery + ornaments + books did their job) and got buried in the two columns that decide the game. Goods scale **linearly** (each Workshop/Library use is a fixed +6 to +13). Settlements and economic buildings **compound**: a hillside settlement beside two high-dwelling cards is +25 to +30, and high-E buildings (Palace 25, Castle 15, Church 12) stack a 100+ economic base no goods grind can match. Audit all three columns every few rounds; when one runs away, pivot INTO it rather than pouring more actions into the column you already lead.

**Settlements are the compounding column; feed them early.** Two mechanics drove red's 131:
- **Clustering / mutual adjacency.** A settlement scores its own dwelling plus every orthogonally adjacent card's dwelling, and it simultaneously *raises* each adjacent settlement by its own dwelling. White's one strong settle (Farming Village dropped between SW3 and SW5) netted +10 across three tiles off the cheapest settlement in the box: own 1 + 2 + 5 = 8, plus +1 to each neighbor. Hunt plots that touch two existing settlements or high-dwelling buildings.
- **Hillside discipline.** High-dwelling anchors (Palace 8, Cloister Church 9, Library 7) make adjacent settlements huge, but only if open plots remain next to them. White buried every hillside under buildings in the early game and was left with the low-value west edge for settlements; red saved hillsides for clusters. Do not let buildings eat all your high-value adjacency before the settlement phases arrive.

**The Castle (G28) is a repeatable settlement cannon.** `USE G28` builds one settlement per turn, paying its food/energy from supply. Red stockpiled meat (Slaughterhouse, 5 food per tile) and minted +16 to +30 settlements every turn until the settlement supply ran dry. With G28 plus a food engine this is often the single best action in the game; white had neither.

**The Sacristy/Wonder comeback is a MID-GAME commitment, never a round-D hail-mary.** Converting a fat book/ceramic/ornament surplus into 30-point Wonders via G34 is sound, but by round D it was unreachable: (a) G34 is a cloister building and must sit adjacent to a cloister building, and white's cloister tiles were all boxed in by occupied neighbors, so placement first required *buying* a plot; (b) white was stone-, clay-, and fuel-starved; (c) the termination trigger (below) left no runway. Lay the rails in the B/C rounds: keep one cloister-adjacent open plot, bank a reliquary source (Forger's F35 coins to reliquary, or Church bread+wine), and protect fuel. Note also the 2p exclusions: Pilgrimage Site (F36) is a 1/3/4-player building and never appears in 2p, so the clean ceramic-to-reliquary path does not exist; Forger's Workshop (any player count) is the buildable reliquary feed.

**Termination lever (2p long): the game ends only when the build display drops to 3 or fewer (round D onward).** Neither player is forced to build it down. So: if your per-turn rate BEATS the opponent's, prolong (do not empty the display); if you are being out-rated, which is the losing side's default, END it sooner by building the display down to 3 to cap the opponent's remaining scoring turns. Critically, the Castle builds *settlements*, not display buildings, so an opponent can Castle-settle indefinitely without advancing termination; only display builds count toward the trigger.

**Work-contract utility engine (when the opponent's clergy are all home).** With all opposing clergy recalled, chain one WC per free clergy to rent their buildings before they re-place. The two that cure chronic starvation:
- **Town Estate (F30): 1 ceramic to 12 coins.** Trades a 3-point surplus tile for the scarcest resource; one visit funds ~6 work contracts or a Palace down-payment.
- **Cloister Courtyard (G02): 3 different goods to 6 identical basic goods** — take 6 peat to refuel a dead Workshop, or 6 clay/coins as needed.
The WC fee (2 coins once a Winery/Distillery is in play) is payable from any coin tile; the engine makes change from a 5-coin tile automatically.

**Fuel discipline.** Once the Moor is cut out, peat is gone and the Workshop (the +13 engine) collapses to ~+4/turn on straw scraps. Keep a renewable fuel source alive — retain a moor for `CUT_PEAT`, buy a moor district, or queue Cloister Courtyard WCs — or the goods engine stalls exactly when you need it most.

**Meta-lesson.** White played a clean *tactical* game (efficient Workshop/Library cycles, sound WC reads, a tidy +10 cluster settle) and still lost by 100+ because the *strategic allocation* was wrong from the midgame: too many actions into the linear column, hillsides spent on buildings, the compounding columns (settlements, economic, Wonders) neglected until they were unreachable. Diagnose which column compounds and commit to it while the board still allows it.

### Game 3 — extended-endgame addendum: mechanics learned dragging it to termination (true final 252–464)

Correction to the section above: that "199–308" reading was a mid-collapse snapshot. The game actually ran ~80 more moves to a true FINISHED state of White 252, Red 464 (a 212-point loss). Final columns: goods W170 / R131, economic W35 / R147, settlements W47 / R186 — the same shape as before, only wider. The extra moves taught engine mechanics, not strategy; the outcome was already set in the B/C rounds exactly as the section above describes. The mechanics are worth recording because they govern what is even *possible* once you are starved and trying to claw back or to force the end.

**USE requires a free clergyman — running out of clergy locks you out of using buildings.** BUILD does not require a free clergyman; it grants a bonus USE via your prior (if not already placed). WORK_CONTRACT requires the *contracted* player to have a free clergyman — a fully clergy-locked opponent cannot be contracted. With all your clergy placed, the only legal verbs are BUY_PLOT / BUY_DISTRICT / CONVERT, and you must spend one of these actions just to cycle your clergy home next turn. Consequence: track free clergy as a USE resource — you can always BUILD while clergy-locked, but you cannot USE or receive contracts.

**Work-contract is a denial weapon, not just a rental.** Contracting an opponent's building (provided they have a free clergyman) forces THEM to seat one of THEIR clergymen on it. So contracting the engine building they lean on (their Workshop) does two things at once: you take the output and you deny them the building's use for that round. Red shut my freshly re-lit +9 Workshop off with a single `WORK_CONTRACT G18` at the exact moment I needed it. Aim contracts at whatever the opponent is currently leaning on, and time them for the turn they most need it free.

**The Cloister Office (LW3) is a zero-cost coin printer.** `USE LW3` harvests coins at the coin-wheel value for no goods cost — strictly better than feeding point-goods into the Market (F08), which pays poorly and burns scoring tiles. When coin-starved this is the unlock most players forget; pair it with the Town Estate and Cloister Courtyard contracts from the section above to rebuild from nothing.

**Re-lighting a dead engine from scarcity (the recovery chain).** When fuel, coins, and food are all gone: Cloister Office to coins; those coins pay the fee to work-contract the opponent's Cloister Courtyard; the Courtyard turns 3 junk goods into 6 peat; the peat fuels the Workshop; the Workshop turns clay into ceramic at +9. It clawed back ~11 points in the final stretch even under a denial contract. Worth knowing — but note it only treads water. A linear recovery chain does not out-rate a compounding opponent; it buys dignity, not the game.

**Coast is buyable; the stone wall is the real gate.** Coast-only buildings are not an absolute wall — `BUY_PLOT` on the water edge mints a coast tile as a FREE action (it does not spend your main action). Ocean tiles also carry a dwelling value of 3, making the Fishing Village attractive there; in the Ireland variant the Houseboat placed on Ocean yields dwelling value 6. But every high-end France endgame building (Shipyard, Sacristy, Printing Office, House of Brotherhood) gates on STONE, and if you have spent your food and energy chains down you cannot make stone (Stone Merchant needs 2 food + 1 energy per unit) — so you can build none of them and therefore cannot force termination. Keep a stone path alive into the endgame (your own Quarry, or a live food+energy supply feeding the Stone Merchant) if you want to control when the game ends.

**The Sacristy/Wonder block, observed live.** Red's killing sequence was one block: Quarry to 10 stone, BUILD Sacristy (G34), then USE the Sacristy (book + ceramic + ornament + reliquary into a Wonder) for roughly +30. That is the single highest-value repeatable sequence in the game and it also advanced termination (the Sacristy is a display build). It confirms the section above: commit to the Sacristy line in the B/C rounds with a reliquary feed and a cloister-adjacent plot reserved — never as a round-D hail-mary, by which point it is unreachable.

**Directive: never concede; maximize final score relative to the opponent (only a human ends a game).** When far behind with a stalled engine, the two levers are (1) grind your own points and (2) build the display to 3 or fewer to cap the opponent's remaining turns — choose by whether your per-turn rate beats theirs from here. Neither lever rescues a deficit already set by column allocation, so the standing lesson holds: win the compounding columns (settlements, economic, Wonders) while the board still allows it, and do not pour late actions into the linear goods column you already lead.

### Solo Play (France long, 1p + neutral) — Mode-Specific Mechanics

Solo France/long pits one human against a neutral player; settlement timing, the building display, and clergy cycles all behave specifically. Two relevant universal lessons from solo play — the USE empty-completion no-op, bonus-action discipline, the clergy soft-lock, the pricing-direction correction, and the endgame goods engine pivot — are already woven into Principles 2 and 8, the USE Command Grammar, the Engine Quirks, and the Final-Action Menu above. The solo-*only* mechanics are these:

**Settlement phases run a forced "neutral building phase" first.** When a settlement phase (A/B/C/D) fires, every building still in the open display is forcibly built onto the **neutral player's board** (free — no cost to you), one at a time, until the display is empty. Only then do you receive the **SETTLE** bonus. **Consequence: build the high-economic buildings you want on YOUR board BEFORE the settlement phase**, or they go to neutral and you forfeit their economic value. You can still use them via work contract afterward, but the dwelling/economic value is lost to you. Plan the converter/heavyweight builds in the 1–4 rounds preceding each phase.

**FREE neutral-building use during the settlement phase (do not skip this).** After buildings are placed on the neutral heartland and *before/with* the SETTLE bonus, if the neutral player's prior is free you may **use one of those neutral buildings for free** — no work-contract fee. This is a free activation EVERY settlement phase and is easy to overlook. Use it on whatever your endgame is short of:
- **Builders' Market** (wood/clay/stone/straw)
- **Grain Storage** (1¢ → 6 grain)
- **Fuel Merchant** (fuel → coins)
- **Slaughterhouse** (livestock → meat, 5 food each)

Missing this repeatedly is what forced paying coins to work-contract the same buildings later in the soft-lock game.

**Each settlement phase also adds a new settlement tile to your supply** (you gain SR5, SR6, SR7… as phases pass), so you almost always have more settlements than phases. The **Castle (G28)** is the only way to place the surplus once the phases are exhausted — build it. (This generalizes the multi-player "post-phase-D Castle is the only settle route" rule into "you will *always* have stranded settlements in solo without a Castle.")

**Solo pacing shifts the converter window later.** The multiplayer "rounds 5–8 converter window" (Tempo Milestones above) is compressed by adversarial drafting. In solo, with no second player burning through the display, the actual converter window slides to **roughly rounds 10–16** — Windmill, Bakery, Cloister Library, Workshop, Market, then the heavyweights (Cloister Church, Shipyard, Castle, Quarry). The principle is unchanged (acquire aggressively; Prior on volume converters); only the round numbers shift. Read the active rondel state and `upcoming_turns` for the real timing, not the multiplayer milestones table.

### Key Takeaways — Solo Game (192 soft-lock → 261 recovery, France long, 1p + neutral)

- The first run **soft-locked at 192** on a normal action turn: zero coins, all three clergy stranded on production buildings, no harvestable land. `COMMIT`/`PASS` both rejected; no legal main action existed. A human rollback was the only way out.
- After rollback, the corrected play finished cleanly at **261** by: restoring liquidity (keeping a ≥1-coin buffer at all times), cycling clergy via the **paid** Bathhouse recall (`USE F23 Pn`, never the bare `USE F23`), settling stranded tiles via a self-built **Castle (G28)**, and pivoting to the **endgame goods engine** (Clay Mound → Courtyard → Workshop ceramic + Library book loop with F23 recall) once the board was saturated. The pivot alone delivered **+46 goods**.
- **Root cause of the soft-lock** was not a single bad move but a discipline cluster: a wasted bare `USE F23` (expected a recall, got a wasted action); a wasted bare `USE F32` (no penny paid, no FELL_TREES/CUT_PEAT bonus); a wasted bonus action (an F09 grape left unspent); and skipped FREE neutral-building uses during settlement phases. Each was individually small; together they drained coins, clergy, and bonus actions to zero on the same turn.
- **Solo-specific lesson:** the forced neutral-building phase before SETTLE means heavyweight builds *must* land on your board in the 1–4 rounds preceding each phase, and the FREE neutral-building use *during* each phase is a recurring free action you must claim — both are easy to forget and both compound.
- **One-line takeaway:** Build heavyweights *before* each settlement phase; never strand all clergy/coins on a normal turn; trust the `get_game` frame over the move enumerator; the bare `USE F23` does **not** recall.

### Key Takeaways — Game 3, instance 282bfe7e (France long, 2p, lost 414–418)

A knife-edge endgame loss decided by two avoidable misreads of building effects in the last rondel cycle. The general engine and clergy framework worked; specific French building semantics did not. Score arc: Blue led +14 at move 415 → +5 at 419 → −3 at 421 → −4 at 426 (FINISHED).

**Misread 1 — F08 Market fed with scoring goods (−7 pts in one action).** F08 Market's `USE F08 <four-distinct-goods>` is a coin/bread conversion (per the canonical table: 4 different goods → 7 coins + 1 bread, observed as ~2 pennies + 1 nickel + 1 bread). The 4-distinct-input shape resembles the Sacristy's wonder-builder (G34 BoCeOrRq), but the economy is the opposite: F08 is a goods SINK that prices every input at coin/bread parity. **Feeding any high-value goods (book, ceramic, ornament, wine) into F08 is a strictly negative trade.** Rule: test any unfamiliar 4-input building with cheap inputs only (Pn/Cl/Wo/Sn) before risking scoring goods. The canonical table in this file is the first source to consult — F08 was already documented as Market, not Bakery.

**Misread 2 — F24 Cloister Church needs BREAD, not book (~−5 pts).** The reliquary chain is `USE F24 BrWn` = 1 bread + 1 wine → 1 reliquary (+8 pts gross), verified at line 377 in the canonical table. Memorising it as "book + wine" left F24 work-contracted but un-fireable — the USE still fires legally without bread but produces nothing, wasting the action plus the work-contract fee already paid. **Pre-plan the bread before work-contracting F24.** Bread comes from F05 Bakery (flour → bread), fed by F04 Windmill (grain → flour); F08 Market also outputs 1 bread per 4-goods conversion as a side-effect, but never as a primary bread source.

**Verified F35 Forger's Workshop scaling — all within a single USE.** The rate is: first reliquary costs 5 coins, each additional costs 10 coins, all within **one** `USE F35` — so 105 coins yields 11 reliquaries in one action. The threat is not "repeated USEs": it is **one USE draining a large coin reserve.** With 35 coins a single USE yields 4 reliquaries (+32 pts gross). Engine note: the enumerator previously under-reported by capping at 15¢ → 2 reliquaries; PR #1798 shipped the fix so `get_legal_moves` now enumerates every 5+10n tier, matching the executor. If planning off a stale deployment, compute the count from coins on hand rather than the completion list (see Engine Quirk 12). The slope-inversion in this game (from +14 lead to −4 loss over three opponent actions) was real and the WC-deny response stands either way.

**New principle — The Coin-Sink Threat Window.** When opponent's penny reserve exceeds ~25 and any coin-consuming converter (F35 Forger's Workshop, F17 Cloister Library, G41 House of Brotherhood, F33 Shipping Company) sits in `buildings_available`, model their **next action** as a potential coin dump: a single F35 USE with 35 coins yields 4 reliquaries (+32 pts gross) in one action. Three options:
1. **Deny** — `WORK_CONTRACT` the threat building the turn it is built. Costs 2 coins post-Winery; saves 10+ pts per denied rondel cycle. The instant F35 enters available AND opponent holds >30 pennies, contract it.
2. **Outscore** — accept and run your own compounding chain (Castle settle, Sacristy Wonder, Workshop ceramics + Library books).
3. **Advance the rondel** — settle to push past the round-trigger that returns their clergy, capping the spam.

Never assume one BUILD = one USE for coin-cheap converters. The Forger's Workshop sat in `buildings_available` for multiple turns without my reading its effect; a 2-penny defensive WC the turn it was built would have flipped a 4-pt loss into a ~10-pt win.

**Failure taxonomy this game:**
- Unverified building effect with scoring goods at risk (F08 BoCeOrWn → −7).
- Memorised effect wrong (F24 = book+wine in memory; actually bread+wine → ~−5 plus a wasted WC).
- Underestimated F35 within-USE scaling — did not realise a single USE with a large coin pile converts the entire reserve into reliquaries in one action.
- Did not WC the new threat when F35 was built — a 2-penny defensive contract on the build turn would have flipped the result.

**One-line takeaway:** Consult the canonical building table in THIS file before USE on any unfamiliar building; when opponent's pennies exceed ~25 and a coin-converter is available, model the next rondel as a coin dump and either WC-deny the threat or outscore via your own compounding column.

**Red's perspective (winner, 418–414) — additional lessons from the same game:**

- **BUILD+Prior is the strongest single turn.** BUILD F35 + bonus USE F35 (15¢ → 2 reliquaries) yielded **+18 in a single turn** — more than any settle, any plain USE, or any WC in the game. When a coin reserve is ready and a productive building is buildable, doing BUILD now (rather than accumulating one more turn) captures the bonus USE and its full value.
- **Denial WC F24 closed the game.** The terminal play was `WORK_CONTRACT F24 PnPn` → `USE F24` (no bread+wine, produces nothing) → `COMMIT`. Cost: 2 pennies. Effect: opponent's reliquary engine locked for the closing sequence, ending the game before their recall could fire. A 2¢ investment that swung the margin.
- **Engine quirk rollback cost 10 pts but win held.** A third `USE F35` in Settlement Round D was accepted by the engine but illegal per rules (clergy had not actually recalled); rollback was required. Net cost ~+10 score forfeited. Never play to the engine's over-permissive second F35 USE in a recall-gated state — confirm `clergy_at_home = 3` before issuing it.
- **Final margin (4 pts) is fragile.** When leading by single digits in Settlement Round D, every denial play swings 2–10 points. Track opponent's coin reserve and clergy state to predict the closing move and plan the counter before it arrives.

### Key Takeaways — Game 5, instance 1370dc21 (France long, 2p, lost 158–338)

A 180-point loss whose shape repeated the core failure from game 4 but with a sharper diagnosis: white built a competent economic foundation (G07, G12, F08, G18, G19, F11, F24, G28) yet never established the **reliquary engine** — the single chain (F04→F05→F24) that decided every game in this series. Red built F04 in round 9, F05 in round 10, and F24 before white could contest it; by round 20 red was firing 2+ reliquaries per recall cycle while white had fired exactly one. Final columns: goods W28 / R51, economic W67 / R135, settlements W63 / R140.

**The F04→F05→F24 chain is the dominant win condition — not one of several paths, the path.** Every other engine (G18 ceramics, G19 meat, G28 Castle) is a consolation prize if this chain is lost. Acquiring F04 by round 8 and F05 + F21 by round 11 is the non-negotiable target. If the opponent gets F04 first, immediately WORK_CONTRACT it every recall cycle to generate your own flour — the chain is still accessible through WC even without ownership. If F24 goes to the opponent, WC it the turn it is built to prevent their first bonus USE.

**WITH_LAYBROTHER discipline when opponent work-contracts your building.** When `active_player ≠ current_player` and the last command was `WORK_CONTRACT`, the engine is waiting for the building owner (you) to respond with `WITH_LAYBROTHER` or `WITH_PRIOR`. **Always respond WITH_LAYBROTHER** — the Prior is too valuable as a build-bonus trigger to strand on a work-contract response. Exception: you are about to build a new building this same recall cycle, so the Prior will be occupied regardless; even then, default to LB unless you have a specific reason.

**F27 Palace (1 wine → USE any occupied building) is a late-game force multiplier, not a luxury.** Red used F27 to chain G28 Castle settles every turn in the final rounds, placing the Hilltop Village and multiple Villages without spending a separate main action. At 25 coins it is expensive, but its +25 economic value alone almost repays the cost, the D=8 dwelling anchors a settlement cluster, and the ability effectively doubles your Castle's output. Budget toward 25 coins in the C/D rounds; the Palace is the bridge between a single-Castle and a Castle-spam endgame.

**Landscape geometry — buy coast early, buy districts before you need them.** White acquired a coast plot at round 15 (too late for F11 to contribute much to settlement adjacency) and a PLAINS district at round 13 (needed to place F24 — a near miss). Buy one coast plot by round 6–8: water tiles carry D=3 free, unlocking the coastal settlement pocket (Fishing Village + water = +9 baseline) and coast-only buildings (F11, G26, F33, F04). Buy one HILLS district by round 5–7 to reserve hillside plots for F04 (hillside), F27 (hillside), and G28 (hill/mountain) before landscape saturates.

**The WC bread pipeline (when you don't own F04/F05).** Once F04 and F05 are built by the opponent: `WORK_CONTRACT F04 Wn` → `USE F04 GnGn...` → flour+straw, then `WORK_CONTRACT F05 PnPn` → `USE F05 FlFl...Pt` → bread. This costs 1 wine + 2 coins + fuel per cycle and takes two separate main actions, but it is the only path to F24 reliquaries when you lack the buildings. Pre-plan: have grain ready before contracting F04, and have flour + energy ready before contracting F05. Running both WCs in the same two-action block is the efficient sequence.

**Engine quirk — WITH_LAYBROTHER after your own WORK_CONTRACT.** When you play `WORK_CONTRACT <building>`, the engine flips `active_player` to the building owner to select WITH_LAYBROTHER or WITH_PRIOR. In a 2p game where you WC the opponent's building, the opponent (human) must play WITH_LAYBROTHER. This cannot be played by the AI agent on the opponent's behalf — the engine enforces ownership. Build this dependency into session planning: if the human is AFK, the WC pipeline stalls at this step.

**Printing Office (F38, E=5, D=5, cost 1w+2st): verified endgame goods burst.** `USE F38 <forest coords>` removes up to 4 LFO forests from your landscape and yields 1 book (2 pts) per forest — up to +8 goods in a single USE, plus clearing build space. Forests are not consumed by felling (they produce wood); they ARE consumed by F38 (gone permanently, replaced by plains). The net value: +8 goods − 5 stone cost (shared with G34 and G28) − 1 wood. Build it only after stone is no longer needed for G28/G34, but it is a strong late finisher when you hold forests you haven't felled. Observed: red gained +8 goods + +5 economic from one F38 BUILD+USE in round 26.

**Termination control — understand who benefits from prolonging.** The game ends at the end of the round when the D-tier display drops to ≤3 buildings. Building from the display advances termination; Castle settles do not. If you are behind: build display buildings aggressively (every build shortens the opponent's remaining turns). If you are ahead: let the opponent exhaust themselves building the display down; do not build unless the building's value exceeds what the opponent would score in one extra turn. In this game white was behind from round 20 onward and should have been building every display building reachable; instead white ignored the display and let red extend the game at will.

**One-line takeaway:** Build F04 by round 8 or WC it; build F05 + F21 by round 11; build F24 the instant the cloister-adjacent plot is ready — this chain is the game. Everything else (G28, F27, G34) amplifies an engine that must already exist.

### Key Takeaways — Game 6, instance 92331440 (France long, 2p, lost 185–334)

A 149-point loss that is, by the columns, the **cleanest possible illustration** of this series' recurring failure. Final columns: goods G60 / B87, economic **G92 / B94**, settlements **G33 / B153**. I spent the entire game on a ceramics/economic engine and finished economically *even* with the opponent (92 vs 94) — direct proof the "economic moat" is worthless: the opponent matched it for free while ignoring it, and buried me by **120 points of settlements**. This is the FIFTH straight loss with the identical profile (games 2, 4, 5, this one — and game 3 twice).

**The lesson is no longer "settlements compound." That is known and documented five times over, and knowing it has not changed the play. The corrective is therefore procedural, not informational:**

1. **Name the win condition before move 1.** Exactly one of: *Castle-settle* (route stone + a hill/mountain plot to G28 by ~round 18, then settle every recall), *reliquary-chain* (F04→F05→F24 by ~rounds 8/10/12), or *cloister-cluster* (high-D anchors with packed dwellings). State it explicitly at game start; every early action serves it.
2. **Hard round-8 checkpoint (2p).** Answer three yes/no: (a) Do I own or work-contract F04? (b) Is a settlement cluster forming beside a high-D anchor (F24=9, F08/F27=8, F11/F17/G28/G34=7)? (c) Is stone banking toward a Castle, or is the reliquary chain online? **Two "no"s = you are already losing — pivot THIS round.** Do not spend round 9+ admiring a goods/economic engine.
3. **Audit all three score columns every ~5 rounds and pivot INTO the one running away.** Never pour actions into the column you already lead (I led/tied goods and economic and lost anyway).

**Confirmed empirically: raw basic goods score ZERO.** A bonus USE that produced +6 grain moved the goods column by exactly 0 (60→60). Only refined goods (book 2, ceramic 3, ornament 4, reliquary 8, Wonder 30), wine (1), and coin-tiles (nickel 2) carry endgame points. Grain/clay/wood/stone/peat/sheep are inputs, worth nothing if held at scoring. A USE whose only output is basic goods is a terminal-turn zero — dominated by any refined output (see Final-Turn Decision Discipline §4).

**House-value (D) varies wildly even within F-buildings — verify D before planning a settlement adjacency.** I built F35 expecting an F-civic pump and got **D=2** (SG5 13→15, a +2 bump) plus E=4 — a runt, exactly as the canonical table lists. G41 was E3/D3, also a runt. Contrast F38 (pumped Blue's SB5 by ~21) and F24 (D=9). "It's an F-building" implies nothing about house value; consult the D column of the building table, never the name.

**Naming caution — trust the canonical table / verified effect over colloquial names, even the engine author's.** The human called G34 the "Forger's Workshop" mid-game, but the engine's own `buildingName.ts` and the canonical table both name **G34 the Sacristy** (the Wonder-builder, `USE G34 BoCeOrRq` → Wonder) and **F35 the Forger's Workshop** (coins → reliquary). A `USE G34 BoCeOrRq` confirmed G34 builds the Wonder. Identify a building by its verified cost/effect or the table, never by a spoken label.

**The build-bonus USE requires your Prior at home.** Building F35 while fully clergy-locked (`clergy_at_home: []`) granted **no** bonus USE; building G41 with the Prior home granted one. BUILD itself never needs a free clergy (build while locked freely), but the signature build→USE double-action only fires if the Prior is home to seat on the new building. If you want the bonus, recall the Prior first.

**Wood is both settlement fuel and G18 energy — do not cannibalize it.** When your only energy is wood and wood is also your settle fuel, never feed the Workshop with it: one settlement (~13) dwarfs a few ceramics (~+9). Only run G18 on wood once settlements are no longer placeable (game ending), when the fuel is otherwise dead — that turn netted +10 cleanly.

**"Stop the bleeding" lever confirmed.** Down 140+, with no settle phase remaining this round and four dwellings stranded, building the display 4→2 to end the game after round 27 was correct — it caps the runaway opponent's remaining turns (BUILD needs no free clergy, so it is always available as a terminator). My four unplaced dwellings (SG4/6/7/8) scored zero — the same stranding as game 2's SW6/7/8, same root cause: no self-owned Castle and too few settlement phases reached. The lever was right; the result was decided by midgame column allocation, as in every prior game.

**One-line takeaway:** Pick a compounding-column win (Castle-settle or the F04→F05→F24 reliquary chain) before move 1 and verify it at a hard round-8 checkpoint; an economic engine that *ties* the opponent's economic column (92–94 here) while they out-settle you 153–33 is the fifth replay of the same loss — the pattern is fully documented and still costs games, so the only fix left is to change the opening, not the knowledge.

### Key Takeaways — Game 7, instance 2e8fd78d (France long, 2p, lost 229–380)

A 151-point loss with the **sixth straight occurrence of the same column profile** — goods W72/R99 (−27), economic W80/R130 (−50), settlements **W77/R151 (−74)**. The compounding columns again accounted for ~80% of the deficit. White's economic engine (G02 + G18 + F17 + F35 added late) was perfectly competent in isolation; the loss was decided in the settlement column by Red's Sacristy-into-double-Wonder turn (rounds 27a/27c, +60) and the Castle→Palace→SR8 Hilltop closer (+72 across three actions). Game 6's procedural fix — "name the win condition before move 1" — was not followed, and the result is statistically indistinguishable from games 2/4/5/6.

**Shanty Town (S01) leaks D=−3 to every orthogonal SETTLEMENT, not to adjacent buildings.** SW1 sat at (2,2) flanked by SW7 and SW6 in row 2 / row 3 of column 2. SW1 itself scored a respectable 16 (own −3 + F17 D=7 + LW2 D=2 + SW7 D=6 + SW6 D=4), but the **hidden cost** was a −3 leak applied to *each* adjacent settlement: SW7 (own D=6) scored 6, SW6 (own D=4) scored 5 — each ~3 points below where they should have been. The −3 D matters specifically when settlements neighbor S01; buildings adjacent to S01 are unaffected. **Placement rule:** S01 may sit in a high-D-building pocket (F17/F24/F08), but never adjacent to another settlement. Treat S01 the way you treat the Quarry (D=−4) and Shipyard (D=−2): keep settlements at orthogonal distance ≥ 2.

**Checkerboard placement maximizes settlement-to-settlement cross-boost.** Each settlement's score includes the dwelling values of every orthogonally adjacent card — buildings AND other settlements. A row of three settlements `S—S—S` cross-feeds (each middle settlement counts both neighbors). Better: alternate settlements with high-D buildings (`S—B—S—B—S`) so each settlement sees one or two building anchors *and* one or two settlements — both contribute D. The reverse anti-pattern is settlements next to negative-D buildings (Quarry/Shipyard/Kiln/Slaughterhouse/Shanty Town) which deduct *every scoring round forever*. Plan the settlement spine in row 2/3 of the heartland as a deliberate checkerboard with the high-D cluster (F24/F08/F27) interleaved.

**Stone is the *single* limiting resource in 2p France — no stone = no win condition.** White had ZERO stone the entire game. The cascade: no G28 Castle (SW8 Hilltop stranded, −18 raw + lost recall-cycle settles), no G34 Sacristy (no Wonder access, Red took both Wonders for +60), no F08 Market (no D=8 settlement anchor), no F30 Town Estate (no ceramic→12¢ cash-out for 14 stranded ceramic). G22 Quarry (5¢, mountain plot) and G12 Stone Merchant (1w + food/energy→stone) are the only stone sources; build at least one by round 10 or accept that every endgame engine (Castle/Sacristy/Market/Palace) is permanently unreachable.

**The engine extends round 27 indefinitely while display > 3 — anticipate the extra turns.** I treated my first "R27 W final" as truly final and burned the slot on USE LW3 (+2 pts). The engine then granted **five more W turns** (USE LW1 / USE LW2 Gn + CONVERT / BUILD F35 / USE F17). Had the multi-turn horizon been visible up front, the correct opener would have been WC G22 on the first extra turn to bank stone, then BUILD F35 + USE F35 for a reliquary, then F38 for books. Rule: while display > 3, `upcoming_turns` is a *floor*, not a ceiling; plan 3–5-turn chains and don't waste the "final" slot on a coin tick.

**BUILD bonus USE quality depends on inputs READY THAT TURN.** Red's BUILD G34 + USE G34 BoCeOrRq scored +30 in one action because all four ingredients (book/ceramic/ornament/reliquary) were in hand. My BUILD F35 + bonus USE LW3 scored +8 because F35's USE needed 5¢ (had 0¢), so the bonus had to redirect onto LW3 for a coin tick. A BUILD without its activation inputs prepared is half value; gather the bonus-USE inputs in the turn(s) preceding the BUILD, never assume the build alone will pay.

**Settlement payment in exact zero-point goods (Red's SR8 model).** Red's terminal Hilltop placement: `SETTLE SR8 5 0 MtMtMtMtMtMtCo` — 6 meat (30F exact, 0 endgame value) + 1 peat coal (3E exact, 0 endgame value). Zero overpay, zero forfeited points. Compare paying 30F via 6 nickels — that would have lost 12 endgame points (nickel = 2 pts). Routing meat/sheep/grain/bread to settle costs and reserving wine/nickels for scoring is the canonical pattern; when food is divisible by 5, `Mt×n + Co` is the cleanest payment in the game.

**WC the opponent's no-input free-output buildings (F11, F37) every recall cycle — a +3 to +4 per main floor I left on the table.** F11 Harbor Promenade outputs 1 ceramic + 1 wine + 1 wood + 1 coin per USE with **no input cost** — net +4 pts per WC (2 coins paid). F37 Dormitory outputs +1 ceramic free (+3 pts per WC). Across ~10 rounds where I had clergy idle, this would have been +30 to +40 routed value at zero opportunity cost. I never WC'd either. Add to the standing turn-planning checklist: when nothing else materially advances the win condition, WC F11 or F37.

**Final-turn `USE F17 PnPnPn` simple-flip dominates the compound trade by +1.** With 4 coins on hand and no use for meat/wine afterward, the simple flip `PnPnPn` (−3¢, +3 books = +6) strictly beats the compound `PnPnPnBo` (−3¢ −1 book, +3 books +1 meat +1 wine = +5). The compound move is only correct when the meat/wine has downstream value (food for a settle, fee for a WC). On the literal last action with no follow-up, the meat+wine forfeits to scoring.

**The `WORK_CONTRACT G22 Wn` should have been my round-26 play (in hindsight).** Wood val 5–6 and stone val 7 throughout the late game. A single `WC G22 Wn` + `USE G22` would have minted 7 stone in one action, the wine returned to supply (no Red income), and that stone unlocked F38 (book burst) or G41 (per-cloister scaling). Cost: 1 wine = 1 pt. Yield: 7 stone enabling ~+10 to +25 across subsequent BUILDs. I had 6 wine after the F33 chain and used it all on the SW4 settle; reserving 1 wine for stone-WC would have been the higher-EV branch.

**Procedural meta-lesson — six straight games with the same loss profile means the *opening* is wrong, not the midgame.** The procedural fix from game 6 ("name the win condition before move 1; round-8 checkpoint; audit columns every 5 rounds") was *not* applied here. I drifted into a generic ceramics/books engine again — exactly the trap game 6's takeaway warned against. Knowledge of the failure mode has not corrected the failure mode for six consecutive games. The next experiment must hard-commit to one of {Castle-settle, F04-reliquary-chain, cloister-cluster} *at move 1* and treat any drift toward "balanced economic development" as the bug it is. If round 8 shows two no's on the checkpoint, the game is statistically lost regardless of what happens after.

**Engine quirk note — Round 27 settle phase D auto-introduces SW8/SR8 + all E-tier buildings (G34/F35/F37/F38/G41) simultaneously.** Confirmed third time this series (games 2, 6, 7). Both players' SW8/SR8 settlements enter `settlements_unplaced` and the E-tier buildings enter `buildings_available` at the same engine frame as phase D's settle bonus fires. Plan for this: the BUILD pool *doubles* in size right when settle pressure is highest, and SW8 enters unplaced precisely when the natural settle phases end — making the Castle (G28) the *only* path to place it. Reading `upcoming_turns[*].introduced` for the next 1–3 turns shows which BUILDs/settlements are about to arrive; never plan a phase-D action without checking that array.

**One-line takeaway:** Game 7 is the sixth identical loss in profile. The midgame execution was clean (the F33-wine-into-Castle-WC-SW4 chain netted +13 in one turn, the proudest play of the series); the *opening* committed to no compounding-column strategy and the rest of the game was deciding which losing column to lose by less. The next game's first move must be a stone acquisition (G07/G12) or a coast plot (F04 enablement) — whichever serves the named win condition — and the round-8 checkpoint must veto any drift.

### Key Takeaways — Game 8, instance 39f1ef09 (France long, **4-player**, ran green/blue/white vs. human red; lost red 251 / white 130 / green 125 / blue 104)

The first 4-player game in this log, and the first run as three colors against a single human (red). Red won by 121 over my best color. The instructive value is not the loss — three hands against one strong opponent will lose — but that all three of my colors failed in the *same* direction, and it is the exact opposite of how red played. Red built wide (economic **88** vs. my 42 / 35 / 26), placed settlements in a dense checkerboard, pre-staged fuel before the settle phases, and spent freely; my colors hoarded unrefined goods, built too few buildings, bought landscape far too late, and left whole engines (Bakery, Winery, Pilgrimage Site) built-or-available and never fired. **Goods-rich and real-estate-poor loses to building-rich and land-rich** — blue held the *highest* goods column in the game (58) and finished *last*.

**4p structure note.** The start-player takes two actions per round (split as separate turns, interleaved with the others); settlement rounds late in the game (here D, then E) issue each player a regular **bonus action** *and* a dedicated **settle** turn, and `BUY_DISTRICT`/`BUY_PLOT` is a free action that does not consume either. Read `upcoming_turns[*].bonus`/`.settle` to see them coming.

**Red — the model to copy:**
1. **Checkerboard placement compounds hardest.** Red's seven settlements (18/26/26/19/13/22/23) scored densely because each touched several neighbors, with high-D buildings interleaved between settlements (`S–B–S–B`) so every placement boosted multiple neighbors and was boosted in turn. (Reinforces Game 7's checkerboard note with a 4p data point.)
2. **Build wide and early.** Economic 88 vs. my 42/35/26. Buildings are standing points *and* the engines that mint goods, coins, and settles. Under-building was my single largest structural gap, upstream of every other failure.
3. **The Hospice (F40) is a sparse-board multiplier — and a 4p board stays sparse.** With four players and few of the ~40 buildings ever erected, `USE F40` became a free pick of the best *unbuilt* building's effect, late, every cycle. My under-building widened red's Hospice menu directly: failing to build does not merely starve my own economy, it arms the Hospice owner.
4. **Pre-stage fuel before the settle phases.** Red spent main actions on `CUT_PEAT` (+8) and `FELL_TREES` ahead of phases D/E, then placed SR4/SR7/SR8 without ever energy-starving. Energy is not an afterthought; it is the floor a settlement stands on.
5. **A prior left on a building is a lever for whoever can reach it.** Red work-contracted *blue's* Priory (G01) to fire *white's* prior-occupied Castle and settle SR8 — my clergy, my building, red's points, a full Hilltop-tier piece it otherwise had no route to that cycle. Seat a lay brother on the Castle, not the prior, unless you are re-firing it yourself (see Priory rule below).

**White — best of mine (130):**
1. **Triple-cluster settling.** SW6 onto a tile adjacent to two of my own settlements returned **+23** (its own dwelling value plus a boost to *each* neighbor). A tile touching ≥2 of your settlements beats a higher-D piece placed in isolation.
2. **A hills district bought in the opening is worth more than ten bought at round 24.** White's moor/hillside district arrived round 24 — too late to cut its moor (cutting needs a fresh main action and the game ended first) or to settle SW8 on its hillside. In 4p the district price ramps fast (5→6→7→8 here); the same moor bought early fuels every settle and unlocks the Hilltop.
3. **Never settle beside a negative-D dwelling.** White's Fishing Village (SW4) settled adjacent to its own Shanty Town (SW1 = S01, **D−3**); the Shanty leaked −3 into the Fishing Village's score. (Reinforces the Game 7 Shanty rule: keep S01 / Quarry / Shipyard / Kiln / Slaughterhouse ≥2 tiles from any settlement — partly forced here by the only open coast tile, which is itself the argument for buying coast/landscape *before* you are cornered.)
4. **Keep the prior off the Castle.** White's `WITH_PRIOR → USE G28` is exactly the door red walked through to steal SR8. A bare `USE G28` seats a lay brother and shuts the door — and unless *you* are firing the Priory/Palace re-access yourself, the door only helps opponents.
5. **The Cloister Office (LW3) is a clean coin tap** — paid coins equal the coin-wheel value (+5 in one use here) — but it empties the wheel to zero, so it is a supplement, never a substitute for the Bakery/Winery income I never built.

**Green (125):**
1. **Don't strand settlement pieces.** Green finished holding four pieces it could never place — no open tiles, no self-owned Castle, no further settle phase. Same stranding as games 2 and 6. Buy landscape early or build a Castle so the in-hand dwellings are not dead weight at scoring.
2. **Build your own converter; don't subsist on renting one.** Green's only ceramics came from work-contracting blue's Workshop (G18), and only on the rare turn it scraped together the 2-coin fee. A self-owned G18 or F35 built by ~round 8 makes clay→ceramic self-sufficient and ends the coin-gated dependence.
3. **`USE` the Pilgrimage Site (F36) you built — it upgrades goods up the chain.** Green built F36 (upgrade book→ceramic→ornament→reliquary, ≤2 steps) and then *never used it*, sitting on ceramic 8. One ceramic fed in returns a reliquary at two steps: **ceramic (3) → reliquary (8), +5 each** — eight ceramics unupgraded was roughly **+40 forfeited**. I declined the `USE F36 Ce` option mid-game out of "don't gamble an unknown converter" caution, but the building table in *this* skill names F36 and its exact effect. **Identify an unfamiliar building against the reference before declining its input — the reference exists precisely for this.**
4. **One slow engine cannot carry a game.** The Harbor (+4 per *full* recall) was green's only reliable scorer and far too slow alone. Pair the goods engine with a coin source and a converter, or it tops out around 110.
5. **Late adjacency still pays.** SG5 squeezed beside SG7 in the dying settle phase returned **+18**. Even a cramped final placement should hunt a neighboring settlement over an empty pocket — the difference here was ~+6 vs. the isolated alternative.

**Blue — last (104), the cautionary tale:**
1. **Convert your stockpiles, or contract someone who can.** Blue ended holding grape 11 and flour 9 — not one drop of wine, not one loaf of bread. Two engines' worth of refined goods and coins left fallow. If you will not build the Winery (F21) and Bakery (F05), work-contract them; raw grapes and flour score zero.
2. **Run a coin engine from move one.** Blue was perpetually broke — repeatedly unable to afford a 2-coin work-contract — while sitting on the exact inputs (flour, grapes) that the Bakery and Winery turn *into coin*. Both buildings make money; liquidity funds everything else, and its absence cascaded into every other shortfall.
3. **Feed what you build.** Blue erected the Carpentry (F10, removes a forest for a free Build) but never bought a district to supply it forests — a built engine starved of its only fuel.
4. **Energy is the floor everything stands on.** Blue ended at zero energy: it could neither run its Workshop (stone 4 never became ornaments) nor pay a settlement's fuel — so it could not settle at all in phase E, despite holding five pieces. A moor district in the opening unlocks both.
5. **A pile of goods is not a winning position.** Blue led the whole game in goods (58, highest of four) and finished dead last, because settlements (3) and economic (26) were the smallest on the board. Refined goods are *a* column, never *the* column; the reliquary stack (5 = 40 pts) was good work, but a goods tower on three settlements loses to anyone who built and settled.

**Rules clarified this game (verified with the maintainer):**
- **Cloister Garden (F09) — prefer it as the work-contract target.** When you want to use (or WC to use) any building orthogonally adjacent to the Garden, route the contract through the *Garden*: `USE F09` yields a grape **and** grants a bonus USE of an unoccupied neighbor — same single fee, the neighbor's effect *plus* a grape. Go direct to the target building only to *deny* an opponent its use, and only when that denial affects the outcome (in a decided game, take the grape). I made the direct-to-Church mistake twice before it stuck.
- **Hospice (F40) — `USE F40` → bonus USE of any *unbuilt* building's effect, no clergy and no build cost.** Scales with how many buildings remain unbuilt: strongest in 4p and late, exactly the window in which red used it.
- **Priory (G01) — `USE G01` → bonus USE of any building that currently has a Prior (any player's) standing on it, no clergy.** *Open discrepancy to verify:* a bare `USE G01` (blue, this game) seated blue's prior but granted **no** bonus USE, with F37, F20, and LG3 all prior-occupied at the moment of use. Either an engine quirk or an unstated precondition (does G01 require a prior already on *it* before the use confers the bonus?). Resolve before relying on it in a plan.
- **`CUT_PEAT` and `FELL_TREES` are main actions, not building-gated.** The five main-action commands are `CUT_PEAT`, `FELL_TREES`, `BUILD`, `USE`, and `WORK_CONTRACT`. With a moor or forest in hand you spend a main action to cut peat or fell trees for renewable energy directly. The Calefactory (F32), via `USE F32 Pn`, additionally drops *both* into `bonus_actions` (do one, both, or neither). My belief that white "could not cut peat" was wrong — it owned a moor but never reached a fresh main-action turn to use it, because the district was bought twenty rounds too late.

**Intra-team note (multi-color play).** White work-contracted *blue's* own Workshop to convert white's clay to ceramic: the 2-coin fee merely moved between my own colors (net zero for the team), and seating blue's clergy on G18 also tripped blue's recall. When you control several seats, an in-family work contract converts one color's surplus through another's building at no real cost — and can be timed to advance the contracted color's recall.

**One-line takeaway:** Three hands lost to one in the same direction every prior solo loss has taken — too few buildings, landscape bought too late, stockpiles never converted, engines (Winery / Bakery / Pilgrimage Site) built or available but never fired. Red built wide, placed in a checkerboard, fueled ahead of the settle phases, and spent freely. The corrective is the one six prior games named and did not apply: **build and buy landscape early, commit actions to the compounding columns (settlements + economic), and treat a fat goods column as the warning sign it is.**

### Key Takeaways — Game 9, instance 2952eea3 (France long, **4-player**, ran green/blue/white vs. human red; red 241 / white 117 / blue 73 / green 52)

A 4-player long game with three Claude colors (green/blue/white) against a single human (red). Final score: red 241, white 117, blue 73, green 52. Red won by 124 over second place. The loss had one cause that expressed itself three different ways across three colors: **landscape was bought too late, too little, or never.** Red bought districts in rounds 2–4 at 3–4¢ each and ended with rows −2 through 4 — seven rows total — enabling settlement rounds C/D/E at 10–27 pts per settle. None of my three colors bought more than one district, none built into rows 3+, and all three forfeited settlement rounds D/E entirely due to landscape saturation. The economic and goods engines were sound; the land to put them on was absent.

**Green (52) — three lessons:**

1. **Never bought a single district. The consequence was total.** Green ran out of buildable plots by round 8 (every open plot occupied), ran out of settleable plots by round 12 (no legal placement for any settlement type in rounds C/D/E), and forfeited every settle from round C onward. The same engine that scored 12 pts in the single settlement round it could access (SG1/SG2/SG3) would have scored 40–60 pts across C/D/E on expanded landscape. Landscape is not an upgrade — it is a prerequisite. The first free action of every session must price a district purchase.

2. **F35 Forger's Workshop was fired blind, and it cost −8 goods.** `USE F35` consumed goods from the stockpile for an unknown output; the goods score dropped from 4 to −4 in one action. The canonical building table in this file names F35 and its exact effect (coins → reliquaries). Firing an unfamiliar building without consulting the reference — especially one that accepts point-goods as input — is self-harm. **Rule: before any USE on an unfamiliar building, find its row in the building table and read the Function column. If it is not in the table, ask. Never probe by executing with point-goods at risk.**

3. **Stone 6 + wood 6 accumulated by round 22 — G28 costs 5st+6w — but no valid hill/mountain plot existed.** G28 requires a hillside or mountain placement. Green had one hillside (LG1, occupied from the start) and no others, because no district was ever bought. Stone accumulation is useless without the terrain. For G28 to fire, the hill/mountain plot must be secured first — ideally a mountain plot from a coast/mountain purchase (`BUY_PLOT MOUNTAIN`) or a HILLS district bought before the stone supply even starts. Plan the site before planning the stone.

**White (117) — three lessons:**

1. **The F04→F05→F24 reliquary chain was correct but 15 rounds late, and the bread pipeline was never pre-staged.** F04 built round 6, F05 round 9, F24 round 14, first reliquary produced round 22 — two reliquaries total. The terminal failure was not missing any of the three buildings; it was arriving at F24's bonus USE with no bread in hand, forfeiting the first firing. **Pre-stage the bread before building F24:** have flour+peat in hand, or grain+peat, so the bonus USE fires immediately on the BUILD turn. The BUILD+Prior double-action on a terminal converter is the highest-value turn in the game; squandering the bonus USE because the input was not pre-staged is the canonical waste.

2. **One landscape district, bought round 12, was the reason F24 had no legal cloister-adjacent placement until round 14.** A 2-round delay on the game's highest-D building (D=9) cost two recall cycles of reliquary production — roughly 14 pts at the margin. The district needed was a PLAINS row-2 purchase at ~4¢; white had 5¢ by round 8. **Buy the cloister-adjacent district by round 6–8, not round 12.** Landscape price escalates as opponents buy; white paid roughly 2× what the same district cost red in round 3.

3. **District prices escalate as opponents buy, so early buyers get cheaper options AND better choices.** Red's districts cost 3–4¢ each in rounds 2–4. White's cost 6–7¢ in rounds 12–14. Beyond the price, early buyers lock in the rows with the best building types (HILLS for F04/F27/G28, MOUNTAINS for G22/G28); late buyers get whatever remains. Every round spent deferring a district purchase is a round paying a higher price for a worse row. **Treat the first district purchase as a round-2 action, not a round-12 catch-up.**

**Blue (73) — three lessons:**

1. **G39 (Estate) was built without a fuel pipeline, forfeiting both the bonus USE and the first follow-up firing.** G39 requires 6 energy (fuel) or 10 food per conversion. Blue built it with zero fuel and zero food, fired the bonus USE to nothing, and spent two more turns gathering fuel before the first real firing. **Build G39 only after 6+ fuel is staged.** The correct sequence: cut peat (6 peat = 12 energy, more than enough), verify the stock, then build G39 and fire it immediately on the BUILD turn for the full book+ornament output. The double-conversion (2 book + 2 ornament per firing, not 1+1 as initially assumed) makes pre-staging even more valuable — the bonus USE alone is +12 goods if fuel is ready.

2. **Blue forfeited settlement rounds B, C, and D from energy starvation.** Grain, pennies, and ceramic were plentiful. Wood/peat/straw/coal were zero on every settle turn. Settlement cost is food AND energy simultaneously; holding food with zero energy is equivalent to holding nothing. **Energy must be pre-staged before every settlement phase, not reactively sourced after the settle turn arrives.** The fix is structural: own a moor (CUT_PEAT) or a forest (FELL_TREES) in the landscape, so energy is always one main action away. Blue bought one HILLS district at round 6 but never acquired coast/plains with moor tiles — a single moor-rich district in round 4 would have resolved every energy shortage.

3. **Landscape district prices are cheapest at the start and rise with each purchase.** Blue bought one HILLS district at round 6 for 2¢ — the lowest price of the entire game. That was correct. The error was stopping at one. Each subsequent district costs ~1¢ more than the last (verified: 2→3→4→5→6→7→8 in this game's price array). The player who buys landscape first gets the cheapest rows, the best terrain types, and the most build/settle turns on each row. **Buy at least two districts by round 8** — the first for the primary engine site, the second for settlement expansion. A third by round 12 enables settlement rounds C/D/E. Blue's total landscape spend was 2¢ over the whole game; red's was roughly 30¢ across six rows, and that investment compounded every single turn from round 5 onward.

**Universal lesson confirmed across all three colors:** Landscape districts are the first purchase, not the last. The price escalates as more are bought, so the player who buys last pays most for least. Green paid zero and received zero settlement options from round 12 on. White paid 6¢ for a district that cost red 3¢ in round 3. Blue bought once correctly then stopped. Red bought six rows over six rounds and those rows hosted every high-scoring building and settlement in the game. **Buy land first. Everything else requires land to stand on.**
