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
