# Game 13 — instance 9c9af0b8 — planning notes

Human: Philihp plays **red**. Claude (Fable 5.1) plays the other three seats, each
independently adversarial per the session playbook (coalition only if red runs away).

Strategy skill in force: `docs/ora-et-labora-strategy-SKILL.md` (Part V doctrine,
4p progression arcs A/B/C, land-first, round-8 per-color checkpoint).

## Session log

- 2026-10-30 — session opened. Kennerspiel MCP not yet connected in this session;
  waiting on connector before seating.

## Win conditions (named before move 1, per color)

Game started as **3p France long** (white seat dropped at START). Order: green → red → blue; green is start player.
Round-1 display: G01 G02 F04 F05 G06 G07 F08 F09 F11 G12. Heartland has a hillside at (4,0) but the Clay Mound sits on it;
Cloister Office at (4,1), so (3,1) is each player's only cloister-adjacent open slot — protect it for G02/F09.

- **Green (opener) — Arc A, land-then-chain.** G06 Fuel Merchant turn 1 with prior bonus (energy→coins), fund two land buys
  while districts are 2–4¢, then F04 on a hills-district hillside by r6, F05 by r8, F21 by r11, F24 on cloister adjacency.
- **Blue (third seat) — Arc B, Castle tempo.** G12 Stone Merchant r1 + prior USE for 2 stone, mountain plot as soon as 3¢ exist,
  stone ≥5 by r5, BUILD G28 by r8–10, settle every recall cycle with pre-earmarked energy.
- Red (Philihp) — unknown; watch which of G12/F04 he takes and adapt.

## Turn-by-turn plans

### R1 green (action 1 of 2)
Frame: all tokens at 2, prior home, 6¢ reachable. Candidates: (a) BUILD G06 (3,0) + prior `USE G06 PtWo` → +5¢, E+5;
(b) CUT_PEAT now and G06 at action 2 selling 6 energy → 8¢ (risk: red/blue take G06 first); (c) BUILD G07 + `USE G07 Pt`.
Chose (a) — guaranteed engine + E5, then `BUY_DISTRICT -1 HILLS` (2¢) as the free action. Left: 4¢, 1 sheep, LB×2 home.
Note: engine auto-flipped grain→straw for the G06 cost and made change from the nickel on the land buy.
Plan for action 2 (end of round): CUT_PEAT or FELL_TREES depending on which token red/blue leave fat; buy a plot (3¢) if still 4¢.

## Lessons to inject into the strategy skill

_(collected during play; promoted to Part II/V/VI at checkpoints and game end)_

## Session 2 — 2026-10-30 (re-opened on fresh instance 9c9af0b8)

Instance 484e0497 was never started; Philihp opened a new lobby. Claude seated as blue, green, white.
Waiting on START (mode/variant chosen on the website).

### R1 red
`CUT_PEAT 0 0` → peat 3. No build. Red is fuel-banking; G06 gone so likely G07 or a settle-fuel plan.

### R1 blue
Frame: G12 still in display, prior home, food 4 / energy 2. `BUILD G12 (3,0)` + prior `USE G12 ShGnPnPt` → stone 2, E+6.
Spent the only penny: mountain plot (3¢) must wait for a Cloister Office harvest (coin token 2→3 at r2). Kept (3,1) open for ☩.

### R1 green (action 2 of 2)
Frame: peat token 0 (red cut), clay 2, wood 2. Prior stuck on G06 until both LBs are placed → recall needs LB placements.
Candidates: FELL_TREES 2 wood (clergy-free, no recall progress) vs `USE LG1` 2 clay (LB placed, F04's clay done).
Chose `USE LG1` → clay 2; free action `BUY_PLOT 0 COAST` (3¢) → water ×2 (D3 each) + 2 coast. Left 1¢.
Plan: R2 FELL_TREES at wood 3 → F04 (3w+2c) buildable R3 on hillside (3,-1) or coast; LB2 to Office/Farmyard for recall by R3–4.

### R2 red (action 1)
`BUILD G07 (0,0)` + prior `USE G07 PtPtPt` → coal 4, 2¢. Red has a dense fuel bank; expect settle-fuel or G06-less coin via Bakery.

### R2 blue
Frame: coin 3, 0¢, plot now 4¢. `USE LB3` (Office) → 3¢ → `BUY_DISTRICT -1 HILLS` (3¢). Castle can sit on a hillside, so
the hills district substitutes for the 4¢ mountain plot for now. LB1 placed; LB2 next round → recall r4.

### R2 green
`FELL_TREES 2 0` → wood 3. F04 cost (3w+2c) complete. R3: `BUILD F04` on hillside (3,-1) (keeps (4,-1) for a later anchor).
Prior still on G06 — no build bonus; fine, no grain to flip yet anyway.

### R2 red (action 2)
`USE LR1 Jo` → clay 3 via joker. Red: clay 3, wood 1, coal 4, 2¢ — F04 was within one fell of red's reach.

### R3 blue (action 1 of 2; start player)
Frame: sheep 4, peat 3, all three clergy out after this → recall r4. `USE LB2 Sh` → sheep 4 (8 food).
Action 2 plan: `CUT_PEAT` (peat 3 if nobody resets it) → 6 energy. R4 with prior home: `USE G12` 4 sheep + 2 peat → +4 stone = 6.

### R3 green
`BUILD F04 3 -1` (hillside). Economic 5→15. Green: 1¢, 1 sheep, LB2 home, prior on G06, LB1 on Clay Mound.
Next: LB2 → Farmyard grain (token 4→5 at r4) so all clergy are out → recall r5 → prior flips grain on F04.
F05 Bakery (2c+1sw) is the next build; clay from the Mound after recall.

### R3 red
`BUILD G01 3 1` — Priory on red's cloister slot. Threat: red can free-USE any prior-occupied building (blue's G12, green's G06).
Keep priors off buildings red would love to borrow; prefer LBs on engines once recall has happened.

### R3 blue (action 2)
`CUT_PEAT 0 0` → peat 3. Recall fired at r4 start: all clergy home. R4 plan: prior `USE G12 ShShShShPtPt` → +4 stone (6 total).

### R4 green (action 1 of 2)
`USE LG2 Gn` → grain 5 (LB2 out; all clergy placed → recall r5). Action 2: FELL_TREES if wood ≥3 else CUT_PEAT —
fuel for F05 baking and settlement A (phase A arrives after the beam passes pile A; watch `upcoming_turns`).

### R4 red
`USE G01` → free `USE G06 CoCoCo` on GREEN's Fuel Merchant (prior-occupied) → 10¢; `BUY_DISTRICT 2 PLAINS`. Red: nickel+3¢, 4 rows.
**Lesson (promote to G01 dossier / V.3):** in 3–4p with a Priory on the table, a prior parked on a no-input or sellable
engine (G06, F11, G12 with staged inputs) is a free menu item for the Priory owner every cycle. Park the prior on
input-gated buildings (F04 with no spare grain) or keep it home for build bonuses.

### R4 blue
`USE G12 ShShShShPtPt` (LB, not prior) → stone 6. Skipped phase-A settle prep: blue's only decent pocket is the ☩ slot (3,1).
R5: Office → 3–4¢; settle A only if a cheap positive pocket exists, else bank for land.

### R4 green (action 2)
`FELL_TREES 1 0` → wood 3 (energy 3 + G02 material). Green: 1¢, wood 3, grain 5, sheep 1. Recall at r5.
R5 (one action): `USE F04` with LB → 5 flour + 5 straw; settle A with flour as food (Market Town 7f/0e at coast (-1,0):
D2 + water 3 = 5 + E2; or Farming Village 3f/3e keeping flour). Decide at the settle turn via get_legal_moves.

### R5 red (action 1)
`USE LR1` → clay 7. Red is clay-heavy: F05 (2c+1sw) or the A-phase G18 Workshop are both live for red.

### R5 blue
`USE LB3` → 4¢ → `BUY_DISTRICT 2 PLAINS` (4¢; next district 5¢). Blue now 3 rows; prior home, 2 LBs out.
No settle A possible (0 food). R6 plan: FELL_TREES for a 4th good, R7 `BUILD F08` + prior `USE F08` (4 goods → 7¢ + bread).

### R5 green
`BUILD G02 3 1` (☩ slot, E+4 → 19) + prior `USE G02 PnGnSh Gn` → grain 10. Choice of output weighed:
grain (settle A Market Town now, 7 food) vs clay (locks F05 next round) vs peat (12 energy). Took grain: settle slot A
is worth ~7 pts now and the slot does not come back; F05 clay comes from the Mound at r6 (clay token 2).
Settle A plan: `SETTLE S03 -1 0` (Market Town, 7 grain, 0 energy): D2 + water 3 = 5 + E2.

## Round 5 — red a2 + settlement phase A (moves 54–62)

**Red a2 (observed):** `BUILD F09 3 2` with prior → grape, then `USE G01` borrowed green's
prior-occupied G02 (`ClGnPn → Wo`, nickel converted). Red: 4¢, 6 clay, 6 wood, sheep, grape, coal.
Second Priory borrow of the game — the prior on G02 was the price of the build bonus, and red cashed it.
Red has 6 wood + 6 clay: F05 Bakery (2c+1sw) and F08 Market (2st) are both in reach for red soon.

**Blue settle A:** `get_legal_moves []` → only `COMMIT` (0 food). Passed.

**Green settle A:** `SETTLE SG3 -1 0 GnGnGnGnGnGnGn` → Market Town on coast beside water.
Settlement value 5 (water 3 + town 2), economic +2 for the card. Green 26 / red 13 / blue 6.
Engine note: settlement ids are per-colour (`SG1..SG4`), not `S01..S04`; legal tokens were `SG1`,`SG3`.
Left (-1,1) coast open for F11 (D7) next to the town; (0,0) moor is the other neighbour — a future
dwelling-value target once the moor is cut.

**Next (R6, order blue → green → red, red gets the 2nd action):**
- Blue a1: `FELL_TREES` (wood 2) for a 4th good, so `BUILD F08 + prior USE F08` lands R7 — unless red
  takes F08 first with 6 wood (red can't: F08 costs 2 stone; red has 0 stone). Safe.
- Green: clay token is at 0 now; Clay Mound after it ticks (1 at R6, 2 at R7). F05 needs 2c+1sw:
  straw comes from flipping grain. Alternatively F11 needs 1w+1st — green has 1 wood, 0 stone.
  Watch the R6 intros (F14 G16 F17 G18 G19) before committing to a build target.

## Round 6 — blue a1, green (moves 63–68)

**Red settle A (observed):** `SETTLE SR2 1 2 PnPnPnCo` — Farming Village at (1,2), value 1. Red 15.
Red now: 1¢, 6 clay, 6 wood, sheep, grape. No grain → no straw → F05/F17/G16 are NOT buildable
for red this round; F14 (hill 4,2), G18 (3w), G19 (2w+2c) are.

**Blue a1 (start player, 2 actions this round):** `USE LB2 JoSh` → 5 sheep. Joker (5) beat the sheep
token (4). Sheep is blue's 4th distinct good (peat, clay, stone, sheep) and 10 food for settle B.
Only the prior was home, so it went to the Farmyard; blue's a2 can only be a BUILD (no clergy).
Plan a2: `BUILD F08 3 1` (2 stone) with no bonus. R7 blue has all 3 clergy out → recall → prior
`USE F08 PtClStSh` → 7¢ + bread. Risk: red has 4 distinct goods + 1¢ and moves before blue in R7, so
red can WC a fresh F08. Building at a2 rather than a1 at least denies red the R6 window.
Rejected: FELL_TREES (3 wood < 5 sheep); BUILD F08 at a1 (exposed to red immediately).

**Green:** `BUILD F14 4 -1` (1 wood) — economic +3 (29). Grapevine is the only grape wheel in 3p and
red had 6 wood + an empty hill; claiming it gates red out of F21 wine / F24. Prior stays on G02 (red
keeps borrowing it via Priory — accepted cost; it is not sellable output).
Next green: `USE LG1` for 2 clay (clay token 2) → F05 Bakery (2c + straw from grain) R7/R8;
LB on F14 once the joker regrows (F14 reads the joker until the grape indicator arrives r8).

## Round 6 a2 → Round 7 green a1 (moves 69–74)

**Red R6 (observed):** `USE LR2 Sh` → 5 sheep (red: 1¢, 6 clay, 6 wood, 5 sheep, grape). All red
clergy out → engine returned them at the start of R7. Same for blue.

**Blue a2:** `BUILD F08 2 2` (2 stone → 4 left), economic 11. Placed at (2,2) not (3,1): keeps the
cloister slot (3,1) beside the Office open for F17 ☩, and (3,2) becomes a pocket touching F08 (D8)
and a future F17 (D7). Engine quirk: all three clergy came home at the R7 round start without a
placement being needed — recall is automatic when all are out at round start.
Blue R7 plan: prior `USE F08 PtClStSh` → 7¢ + bread (red moves first and holds 1¢ + 4 goods; if red
WCs F08, blue answers WITH_LAYBROTHER and pivots to Clay Mound / stone).

**Green a1 (start player, 2 actions):** `CUT_PEAT 0 0` → 5 peat (peat token was 5, now 0).
**Engine quirk: CUT_PEAT did NOT place a clergy** — both LBs still home after it. Treat FELL_TREES /
CUT_PEAT as clergy-free main actions in this engine (verify FELL_TREES too).
Plan a2 (end of R7): `USE G06 PtPtPtPtPt` → 10¢ (5 peat = 10 energy ≥ 9) → buy a plains district
(row 2, 5¢) for ☩ growth below G02, and keep ~5¢ toward a plot / F05 clay next round.
Risk: red WCs G06 with its 6 wood for 8¢ first; low odds (net +1¢ for red after the fee).
Rejected: `USE LG1` 3 clay → F05 at a2 with no bonus (prior stuck on G02 until green's own recall).

## Round 7 — red, blue, green a2 (moves 75–84)

**Red R7 (observed):** `USE F09` (grape) + `USE G01` → green's G02 `ClShWo → Gn` (6 grain). Red: 1¢,
5 clay, 5 wood, 6 grain, 4 sheep, 2 grape. Third Priory borrow of green's prior-occupied G02.
Red did NOT WC blue's F08.

**Blue:** `USE F08 PtClShSn` (LB seated, prior kept home) → 7¢ + bread, goods +2. Then
`BUY_PLOT 1 COAST` (4¢) → coast at (-1,1),(-1,2), water (-2,1),(-2,2). Blue: 3¢, 4 sheep, 3 stone,
bread. Token for stone is `Sn`. Plot price ladder now [4,5,5,5,6,6,7].
Next blue: F11 (1w+1st, coast, D7) needs wood → FELL_TREES (wood 4) is clergy-free, so R8 can be
`FELL_TREES` + nothing else… or `BUILD F11 -1 2` once wood is in hand, prior bonus optional
(F11 needs inputs). Settle B pocket: (-1,2)? no — F11 at (-1,1), settle at (-1,2): water 3 + F11 7.

**Green a2:** `USE G06 PtPtPtPtPt` → 10¢ (2 nickels), goods +4 (33). `BUY_DISTRICT 2 PLAINS` (5¢)
→ row 2 = forest, plains ×3, hill at (4,2). Opens (3,2) directly under G02 for the next ☩ build and
(4,2) hill for a Castle later. Green: 3 grain, 5¢, LB2 home, LB1 on G06, prior on G02.
Next green (R8, after red+blue): `USE LG1` → 3 clay (clay token 3+) with LB2 → all 3 out → R9
recall → `BUILD F05` + prior `USE F05`. Or if red threatens F05 (6 grain = straw, 5 clay): build F05
first with LB… F05 is red's natural next build — red CAN build it now. Accept; green's chain still
needs F04 flour (3 grain). Alternative green ☩ target: F17 Library (2st+1sw) — no stone. G16 (3c+1sw).

Scores after R7: green 33 / red 15 / blue 11. Red is behind on the board but holds the richest
bag (6 grain, 5 clay, 5 wood, 4 sheep, 2 grape) and a Priory that keeps milking green's G02.

## Round 8 — red a1, blue, green (moves 85–90) + ROUND-8 CHECKPOINT

**Red a1 (observed):** `WORK_CONTRACT F04 Pn` → `USE F04 GnGnGnGnGnGn` → 6 flour + 6 straw for 1¢.
The engine auto-seated green's LB2 on F04 (no prompt — green had only LBs home). Red: 0¢, 5 clay,
5 wood, 4 sheep, 6 flour, 6 straw, 2 grape. Red's a2 (end of R8) is almost certainly
`BUILD F05` + prior bake → ~6 bread. F05 is unique: green's own Bakery is gone if so.

**Blue:** `FELL_TREES 1 0` → 5 wood (wood token was 5; clergy-free). Blue: 3¢, 5 wood, 4 sheep,
3 stone, bread; LB2 + prior home. R9 blue is start player (2 actions): a1 `BUILD F11 -1 1` (1w+1st)
+ prior `USE F11` → ceramic + wine + wood + coin; a2 `BUILD G18` (3w) at (3,1)?? — no, (3,1) is the
☩ slot and G18 IS ☩ → yes G18 at (3,1) beside the Office. Or hold G18 until clay+energy exist.

**Green:** all clergy out, BUILD not even offered (nothing affordable). `WORK_CONTRACT G01 Pn` (1¢ to
red) → pending red's WITH_LAYBROTHER / WITH_PRIOR → then `USE G01` → `USE G02 <3 goods> Cl` → 6 clay.
Side effect: red's clergy sits on G01 for the cycle, closing the Priory borrow loop. Fee gives red
1¢ (red was at 0) — that re-arms a red WC next round; accepted.

### Round-8 win-condition audit

| | green (reliquary + cluster) | blue (stone / settlements) | red (Philihp) |
|---|---|---|---|
| F04 owned / contracted | ✓ owned (fired once — by red) | ✗ | ✓ rents it |
| Cluster beside high-D anchor | ✗ (SG3 by water only; F11 slot kept) | ✗ (no settlement; F08 D8 placed) | ✗ (SR2 alone, value 1) |
| Stone bank or chain online | ◐ F04+F14 built, F05 at risk to red | ◐ 3 stone, G12 owned | ◐ flour 6, F05 next |
| Columns (goods/econ/settle) | 2 / 24 / 5 = 31 | 0 / 11 / 0 = 11 | 0 / 14 / 1 = 15 |

Green: one hard "no". Chain pivot if red takes F05: green's bread = WC red's F05 (pre-stage flour via
F04 + fuel), and lean harder on the ☩ cluster at (3,2)/(2,2)/(4,2) — G16 (3c+1sw) is affordable
after the 6-clay haul and gives diversity for G02; F17 needs stone green does not have.
Blue: two "no"s → pivot INTO settlements now: F11 at (-1,1) makes (-1,2) a 10-pocket (water 3 +
F11 7); (3,2) is an 8+ pocket beside F08. Settle B food: 4 sheep (8) + bread.
Red: strongest bag at the table, weakest board; the Priory/WC loop is red's engine. Blocking G01
and firing F04/F05 before red can rent them is how blue/green stay ahead.

Lessons injected into the strategy skill this checkpoint: G01 parking cost + WC-the-Priory counter,
G06 tiers, F04 as 1¢ rental, start-player a2 build timing, grammar (`JoSh`, `Sn`, `SGn` ids),
quirks 18 (auto LB response) and 19 (round-start full recall).

**Green (cont., moves 91–95):** red answered `WITH_LAYBROTHER` (LB2R on G01; red has only the prior
home now). `USE G01` → the bare `USE G02` leaf was unaffordable (only 2 kinds of goods), so
`CONVERT NiGn` (nickel → 5 pennies, 1 grain → straw) then `USE G02 PnGnSw Cl` → 6 clay.
Green: 4¢, 6 clay, 1 grain, all clergy out → full recall at R9 start. Score 29 (coins spent).
Grammar: G02 needs 3 DIFFERENT goods; straw from a free grain flip counts as its own good, so
grain + straw + penny is the cheapest triple. `CONVERT` tokens: `Ni` (nickel→pennies), `Gn` (grain→straw).

R9 green plan (after blue's a1, before red): prior home → `BUILD F05 3 2`?? F05 isn't ☩ — keep (3,2)
for ☩. F05 at (2,2) or (1,2). But if red builds F05 at its a2 now (5 clay + 6 straw in hand), green
switches to `BUILD G16 3 2` (3c+1sw, ☩, D5) + prior bonus → 1 of each basic good (diversity for G02
and the next settle), keeping 3 clay toward G18 later. Watch for red's F05 before deciding.

## Round 9 — blue a1, green (moves 96–104)

**Red R8 a2 (observed):** `BUILD G19 3 0` + prior `USE G19 ShShShShSwSwSwSw` → 4 meat (20 food).
Red: 1¢, 3 clay, 3 wood, 6 flour, 2 grape, 2 straw, 4 meat; econ 22 → 23 total. Red did NOT take F05.
Grape token entered the wheel at R9 (value 2).

**Blue a1 (start player):** `BUILD F11 -1 1` (1w+1st) → `WITH_PRIOR` → `USE F11` → ceramic + wine +
wood + 1¢. Blue: 4¢, 5 wood, 4 sheep, 2 stone, ceramic, bread, wine; goods 5, econ 12 → 17.
Pocket (-1,2): water 3 + F11 7 = 10 for settle B (end of R10). Phantom bonus `USE` lingered; COMMIT fine.
Blue a2 (end of R9, after red): `BUILD G18 3 1` (3w, ☩ beside Office) — no bonus (prior on F11),
but it banks econ and is the ceramic engine once clay/energy exist; OR `BUILD F17 3 1` (2st+1sw) —
no straw. G18 it is, unless red's move changes the display.

**Green:** `BUILD F05 0 0` (2 clay + grain→straw), no prior bonus (0 flour — the prior stays home).
**Settlement scoring is live:** SG3 at (-1,0) went 5 → 10 the moment F05 (D5) landed beside it.
Green 38 (goods 0 / econ 28 / settle 10). F05 denied to red's 6 flour: red must now rent it (1¢ to
green, green's clergy seated) or route bread elsewhere. Green: 4¢, 4 clay, all clergy home.
Next green (R10): `USE LG2 Gn` (grain 6) → F04 flour → bake; or `BUILD G16 3 2` (3c+1sw) needs straw
→ needs grain first. Farmyard first.

Scores: green 38 / red 23 / blue 17. Settle B: red settles first (R10 end), then blue, then green.

## Round 9 a2 → Round 10 green a1 (moves 105–111)

**Red R9 (observed):** `BUILD G16 2 2` + prior `USE G16` → 1 of each basic; placed beside SR2 (1,2),
settlement 1 → 6 live. Red 30 (econ 24 / settle 6). Red's bag: 2¢, 6 flour, 4 meat, 4 wood, 2 grape.

**Blue a2:** `BUILD G18 3 1` (3 wood) — ☩ beside the Office, econ 12 → 19, total 24. No bonus (prior
on F11). Blue: 4¢, 2 wood, 4 sheep, 2 stone, ceramic, bread, wine. Only F17 is left on the display.
R10 blue (one action, before settle B): `USE G12` LB2 → stone (2 food + 1 energy each: sheep + wood →
2 stone) — or keep sheep for the settle and USE G18 ClPt? no clay. Decide at the turn.
Settle B plan: pocket (-1,2) = water 3 + F11 7 = 10 + the tile's own D. Food: 4 sheep (8) + bread.

**Green a1 (start player R10, 2 actions):** `USE LG2 Gn` → 6 grain (grain token 6; joker was 5).
Green: 4¢, 4 clay, 6 grain; LB2 + prior home.
Green a2 (end of R10, right before the settle turns): `USE F04 GnGnGnGnGnGn` with LB2 → 6 flour + straw,
leaving the prior home for an R11 `BUILD` + bonus; or prior `USE F05` can't (no flour yet). Settle B
food for green = whatever grain is left — so a2 might instead be `BUILD G16`? gone. F17 (2st)? no stone.
→ a2 = F04 flip of 4 grain (keep 2 grain as settle food? Fishing Village SG4 needs 8ish). Check the
settle drill at the time; flour counts as 1 food too.

R11 intros: F20 F21 G22 F24 G26 — F21 Winery (green: grapes from F14 → wine), F24 Church (reliquary,
D9 ☩) is green's win-condition anchor; G22 Quarry needs a mountain plot. Blue wants G22/F24-adjacent
stone. Red will chase F21/F24 too.

## Round 10 — blue, green a2 (moves 112–117); settle B pending

**Red R10 (observed):** `USE LR3` Cloister Office → 6¢ (coin token 6). Red: 8¢, 6 flour, 4 meat,
4 wood, 2 grape, 1 peat. Red 32.

**Blue:** `USE LB1` Clay Mound (clay 6) with LB2 → 6 clay. All blue clergy out → recall at R11.
Rejected: `USE G12` (would eat settle sheep for 2 stone); F17 (no straw).
Settle B (after red): pocket (-1,2) coast. Fishing Village SB4 (8 food + 3 energy) = D6 + water 3 +
F11 7 = 16 — but blue's energy is 2 wood only → probably unaffordable; fallback Artist's Colony SB5
(5 food + 1 energy, D5, E−1) = 15. Drill `["SETTLE","SB4","-1","2"]` first; `SB5` if empty.

**Green a2:** `CUT_PEAT 0 1` (peat 4) → 4 peat, clergy-free. Chosen over the F04 flour flip because
the settle turn needs energy: Fishing Village SG4 at (-1,1) = D6 + water 3 + SG3 2 = 11, E4, cost
8 food (6 grain + 2¢) + 3 energy (2 peat). Leaves 2 peat (4 energy) for baking later, 4 clay, 2¢.
Flour can wait a round; a live 11-point settlement cannot.

Lesson candidate (Part III): **settlement value is scored live** — F05 beside SG3 (+5) and red's G16
beside SR2 (+5) both paid the moment they were built. Late builds belong next to existing settlements.

## Settlement phase B (moves 118–124)

**Red (observed):** `BUY_DISTRICT 3 PLAINS` then `SETTLE SR5 2 3 MtWo` — Artist's Colony under G16:
5 + G16 5 = 10. Red: settlements [6, 10], total 39. Red paid 1 meat + 1 wood; still 3 meat, 6 flour, 3¢.

**Blue:** `SETTLE SB4 -1 2` drill → empty (3 energy, blue had 2 wood). `SETTLE SB5 -1 2 BrShWo` →
Artist's Colony: 5 + water 3 + F11 7 = **15**, E −1. Blue: 4¢, 6 clay, 1 wood, 3 sheep, 2 stone,
ceramic, wine. Total 38. Full recall at R11 start.

**Green:** `SETTLE SG4 -1 1 GnGnGnGnGnPnPnPnPtPt` (5 grain + 3¢ + 2 peat) → Fishing Village 11
(6 + water 3 + SG3 2) AND SG3 rose 10 → 16 because SG4's D6 counts for it. **Settlements score each
other's dwelling value** — a settlement pair is worth D(a)+D(b) extra on top of the buildings.
Green: settlements [16, 11], econ 32, total **59**. Kept 1 grain, 1¢, 2 peat, 4 clay.

Scores after B: green 59 / red 39 / blue 38. Green leads by 20 — no coalition trigger (that's
Philihp-only); red and blue stay independent.

R11 display: F17, F20, F21 Winery, G22 Quarry, F24 Cloister Church, G26. Order R11: red, blue, green,
red (red start player). Green's next: F21 (grapes→wine) needs F14 grapes first (joker 6 / grape 4:
`USE F14 Jo`? = 6 grapes), then F24 at (3,2) ☩ (cost 5 clay? check dossier) — green has 4 clay.
Blue's next: G18 with 6 clay + energy (1 wood, 0 peat) → needs fuel: CUT_PEAT (peat 2) or buy coal.
Blue stone: 2 → G22 Quarry needs a mountain plot (4¢ — blue has 4¢).

## Round 11 — blue, green (moves 125–131)

**Red R11 a1 (observed):** `CUT_PEAT 0 1 Jo` → 7 peat (joker 6 on the moor). Red: 7 peat, 6 flour,
3¢, 3 meat. Red will WC green's F05 (1¢) and bake 6 bread with 3 peat — expect it at red's a2.
Red's clergy: only LB2 home. Note: CUT_PEAT accepts a trailing `Jo`.

**Blue:** `BUY_PLOT -1 COAST` (4¢ → 0¢) then `BUILD G26 -1 -1` Shipyard (4 clay + 1 stone), no bonus
(needs 2 wood; blue has 1). Econ 18 → 33, total 37 → **52**. Uncontested: neither opponent has an
empty coast tile. Placed in the corner so (-1,0) stays a pocket: water 3 + F11 7 − G26 2 = 8 + own D.
Blue: 0¢, 2 clay, 1 wood, 3 sheep, 1 stone, ceramic, wine; all clergy home.
R12 blue is start player (2 actions): a1 `FELL_TREES` (wood 4) → 2 wood for G26 + G18 fuel;
a2 `USE G26 WoWo` → nickel + ornament (+6), or `USE G12` for F24 stone. F24 race: blue needs
5 clay + 3 stone (has 2/1); green needs 3 stone (0); red 1 clay. Nobody is close — stone token
enters R13. Blue's path: G12 (sheep + wood) 2 stone/fire, Clay Mound when the token regrows.

**Green:** `USE F14` → 4 grapes (grape token 4, joker 0) with LB2; prior home. Green: 2 peat, 1¢,
4 clay, 1 grain, 4 grapes. Next: F21 Winery (2c + 2 straw) needs 2 grain → Farmyard (grain 2 now,
growing) then `BUILD F21` + prior → 4 wine. F21 also raises the WC fee to 2¢ — red's F05 rental
gets pricier. F24 for green: 5 clay + 3 stone — no stone source; G22 needs a mountain plot (5¢)
+ 5¢ build. Realistic green chain: F21 wine → sell @7¢ or hold for a rented F24 if blue builds it.

Scores: green 59 / blue 52 / red 39.

## Round 12 — blue a1, green (moves 132–137)

**Red R11 a2 (observed):** `USE G07 PtPtPtPtPtPtPt` → 8 coal (+1¢). Red: 4¢, 8 coal, 6 flour, 3 meat,
all clergy home (recalled at R12 start). Red hasn't rented F05 yet — the bake is coming.

**Blue a1 (start player):** `FELL_TREES 2 -1` → wood 5 (token 5) → 6 wood. Clergy-free; all 3 home.
Blue a2 plan (end of R12): `USE G12 ShShShWoWoWo` → 3 stone (4 total) — the F24 stone. Then R13
`USE LB1` Clay Mound (token 4 → 6 clay), R14 `BUILD F24 3 2` + prior. G26 `WoWo` fires wait for R15
(blue start player again). Keeping 2 wood for G26.

**Green:** `CUT_PEAT 0 -1` (peat 3 → 5 peat) clergy-free; prior stays home. Green: 5 peat, 1¢,
4 clay, 1 grain, 4 grapes; LB1 on Farmyard, LB2 on F14 until recall.
R13 green (start player: green, red, blue, green): a1 prior `USE G06 PtPtPtPtPt` → 10¢ (all clergy out →
recall R14... no: recall happens at round start only when ALL are out at that moment, so the prior
goes out at a1 and comes back R14). a2 = BUILD only (F21 needs 2 straw: only 1 grain) → buy mountain
plot (5¢) at a2 and bank 5¢ for G22 Quarry next cycle. Stone token enters R13.
