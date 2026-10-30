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
