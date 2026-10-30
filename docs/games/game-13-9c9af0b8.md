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
