---
name: ora-et-labora-strategy
description: Strategic coaching for Ora et Labora board game. Use this skill when planning moves, evaluating building priorities, assigning clergy, placing settlements, or analyzing game state. Teaches action economy discipline, clergy hierarchy (Prior over Laybrother), settlement evaluation heuristics, economic engine scaling, resource conversion discipline, the Castle (G28) settlement protocol, work contract mechanics, settlement food/fuel payment economics, scoring-column allocation (goods scale linearly while settlements and economic buildings compound), and Kennerspiel engine quirks. Helps avoid wasted actions, negative settlement placements, and delayed economic scaling.
compatibility: Kennerspiel MCP (list_my_games, get_game, get_legal_moves, make_move)
---

# Ora et Labora Strategic Coach

Strategic decision framework for improving play quality in Ora et Labora (long game, France variant).

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

### Building Identity Reference — France variant (rulebook-verified)

Building IDs map to the official index. Engine prefixes (G/F) match the card numbers; settlements are S01–S08 with color prefix (SW5 = white's S05).

Columns: **E** = economic value, **D** = dwelling value (what adjacent settlements score). Cost: w=wood, c=clay, st=stone, sw=straw, ¢=coins. Loc: blank = Coast/Plains/Hillside; ☩ = must also be adjacent to a cloister building. **2p** = present in the 2-player long game (build pool is filtered by player count — buildings marked – never appear).

| ID  | Building | E | D | Cost | Loc | 2p | Function (compressed) |
|-----|----------|---|---|------|-----|----|----------------------|
| —   | Farmyard / Clay Mound / Cloister Office | 0 | 2/3/2 | start | ☩(Office) | ✓ | Production wheel: grain-or-livestock / clay / coins |
| G01 | Priory | 4 | 3 | 1w+1c | ☩ | – | Use a building occupied by any prior (pay only the Priory's contract) |
| G02 | Cloister Courtyard | 4 | 4 | 2w | ☩ | ✓ | 3 different goods → 6 identical basic goods |
| F03 | Grain Storage | 3 | 4 | 1w+1sw | | – | 1 coin → 6 grain |
| F04 | Windmill | 10 | 6 | 3w+2c | Coast/Hill | ✓ | Flip ≤7 grain→straw, +1 flour each |
| F05 | Bakery | 4 | 5 | 2c+1sw | | ✓ | Flip flour→bread @ ½ energy each; may sell ≤2 bread @ 4¢ |
| G06 | Fuel Merchant | 5 | 2 | 1c+1sw | | – | Sell 3/6/9 energy → 5/8/10 coins |
| G07 | Peat Coal Kiln | 4 | **−2** | 1c | | ✓ | +1 peat coal +1 coin; flip peat→peat coal freely |
| F08 | Market | 5 | **8** | 2st | | ✓ | 4 different goods → 7 coins + 1 bread |
| F09 | Cloister Garden | 5 | 0 | 3¢ | ☩ | – | +1 grapes; then use an unoccupied neighbor (once/turn) |
| F10 | Carpentry | 7 | 0 | 2w+1c | | – | Remove 1 forest → free Build action (excluded from 2p long) |
| F11 | Harbor Promenade | 1 | **7** | 1w+1st | Coast | ✓ | +1 ceramic, 1 wine, 1 wood, 1 coin |
| G12 | Stone Merchant | 6 | 1 | 1w | | ✓ | ≤5×: 2 food + 1 energy → 1 stone |
| G13 | Builders' Market | 6 | 1 | 2c | | – | 2¢ → 2w + 2c + 1st + 1sw |
| F14 | Grapevine (A) | 3 | 6 | 1w | Hillside | ✓ | Production wheel: grapes |
| F15 | Financed Estate | 4 | 6 | 1c+1st | | – | Flip 1 coin→book; +1 bread, 2 grapes, 2 flour |
| G16 | Cloister Chapter House | 2 | 5 | 3c+1sw | ☩ | – | +1 of each of the 6 basic goods |
| F17 | Cloister Library | 7 | **7** | 2st+1sw | ☩ | ✓ | Flip ≤3 coins→books; then 1 book → 1 meat + 1 wine |
| G18 | Cloister Workshop | 7 | 2 | 3w | ☩ | ✓ | Flip ≤3 clay→ceramic and ≤1 stone→ornament, 1 energy/tile |
| G19 | Slaughterhouse | 8 | **−3** | 2w+2c | | ✓ | Flip livestock→meat, 1 straw each (2 food → 5 food) |
| F20 | Inn | 4 | 6 | 2w+2sw | | – | Sell ≤7 food @ 1¢ each; +1 wine @ 6¢ |
| F21 | Winery | 4 | 5 | 2c+2sw | | ✓ | Grapes→wine; sell 1 wine @ 7¢. **Raises work-contract price to 2¢ for everyone** |
| G22 | Quarry (B) | 7 | **−4** | 5¢ | Mountain | ✓ | Production wheel: stone |
| F23 | Bathhouse | 2 | 6 | 1st+1sw | ☩ | – | Flip 1 coin→book, +1 ceramic; recall ALL your clergy immediately |
| F24 | Cloister Church | 12 | **9** | 5c+3st | ☩ | ✓ | ≤2× (1 bread + 1 wine) → 1 reliquary. Highest D in the game |
| F25 | Chamber of Wonders | 0 | 6 | 1w+1c | | – | 13 different goods → 1 Wonder |
| G26 | Shipyard | 15 | **−2** | 4c+1st | Coast | ✓ | 2 wood → 5 coins + 1 ornament (once/turn) |
| F27 | Palace | 25 | **8** | 25¢ | Hillside | ✓ | Pay 1 wine → use ANY occupied building |
| G28 | **Castle** | 15 | **7** | 6w+5st | Hill/Mtn | ✓ | Build 1 settlement from your supply, paying its food + energy |
| F29 | Quarry (C) | 7 | −4 | 5¢ | Mountain | – | Second quarry (removed in 2p long) |
| F30 | Town Estate | 6 | 5 | 2st+2sw | | ✓ | Sell 1 ceramic @ 12 coins (once/turn) |
| F31 | Grapevine (C) | 3 | 6 | 1w | Hillside | – | Second grapevine (removed in 2p long) |
| F32 | Calefactory | 2 | 5 | 1st | ☩ | – | 1¢ → fell-trees and/or cut-peat actions |
| F33 | Shipping Company | 8 | 4 | 3w+3c | Coast | ✓ | 3 energy → joker-wheel production of meat, bread, or wine |
| G34 | Sacristy | 10 | **7** | 3st+2sw | ☩ | ✓ | book+ceramic+ornament+reliquary → 1 Wonder (net +13) |
| F35 | Forger's Workshop | 4 | 2 | 2c+1sw | | ✓ | 5¢ → 1 reliquary; each additional @ 10¢ |
| F36 | Pilgrimage Site | 2 | 6 | 6¢ | | – | Upgrade book→ceramic→ornament→reliquary, ≤2 steps |
| F37 | Dormitory | 3 | 4 | 3c | ☩ | ✓ | +1 ceramic; then (1 straw + 1 wood → 1 book)×∞ |
| F38 | Printing Office | 5 | 5 | 1w+2st | | ✓ | Remove ≤4 forest → 1 book each |
| G39 | Estate | 5 | 6 | 2w+2st | | – | ≤2×: 10 food or 6 energy → 1 book + 1 ornament |
| F40 | Hospice | 7 | 5 | 3w+1sw | ☩ | – | Use the function of any UNBUILT building, free |
| G41 | House of the Brotherhood | 3 | 3 | 1c+1st | ☩ | ✓ | 5¢ → 1½ pts per cloister building (2p long rate) |

**Dwelling-value geometry (2p):** settlement anchors worth chasing are F24 Cloister Church (9), F08 Market (8), F27 Palace (8), F11/F17/G28/G34 (7), settlements themselves (Fishing Village 6, Hilltop 8). Negative-D traps to keep settlements away from: G22 Quarry (−4), G19 Slaughterhouse (−3), G07 Peat Coal Kiln (−2), G26 Shipyard (−2), Shanty Town (−3). Cloister buildings (☩) cluster by rule, which naturally co-locates the high-D church complex — plan a settlement pocket beside it. Also note G41 pays per ☩ building, so the cloister count is itself a scoring resource.

Point-goods values: book = 2, ceramic = 3, ornament = 4, reliquary = 8, Wonder = 30, wine = 1 (also 1 coin + 1 food), 5-coin tile = 2.

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

### Settlement Payment Economics (food + fuel)

Every settlement costs food AND fuel simultaneously. Verified resource values:

- **Food:** Nickel (5-coin tile) = 5, Meat = 5, Beer = 5, **Bread = 3**, Sheep/livestock = 2, Grain = Grape = Penny = Flour = Wine = 1. Wine additionally carries 1 coin + 1 point; a 5-coin tile is worth 2 points.
- **Fuel/energy:** Peat coal = 3, Peat = 2, Wood = 1, Straw = 0.5

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

### Work Contract Pricing (rulebook-verified)

Base price: 1 coin, paid to the building's owner; the owner mans the building with one of THEIR clergymen (yours stay free). Once the Winery (F21) is built — by anyone — the price rises to 2 coins for all players for the rest of the game (hence `PnPn` in game 2). One wine may always be paid instead, regardless of price level ("present for the host") — and per the overview sheet **the wine is drunk and returned to the general supply, not given to the opponent**. So post-Winery the wine present is doubly correct: it costs you ~2 points of value instead of 2 coins, AND denies the opponent the 2-coin income — a relative-score swing of roughly 2× the coin route. The engine accepts `WORK_CONTRACT G22 Wn`.

### Official Final-Action Menu (France, from the rulebook)

The endgame is a one-shot argmax over this menu. Approximate net deltas:

- **Castle G28 → SETTLE**: often the maximum; a Hilltop Village placement can exceed +20
- **Cloister Church F24**: +7 per bread+wine set, ≤2 sets (wine's own point already counted)
- **Sacristy G34**: +13 (book+ceramic+ornament+reliquary → Wonder)
- **Cloister Workshop G18**: up to +13 gross (3 ceramics + 1 ornament, minus energy)
- **House of the Brotherhood G41**: 5 coins → 1½ pts per cloister building (2p long)
- **Forger's Workshop F35**: +6 for 5 coins; +4 per additional reliquary at 10 coins
- **Printing Office F38**: up to +8 (≤4 forests → books)
- **Dormitory F37**: +3, then +2 per straw+wood set
- **Estate G39**: +6 or +12 dumping food/energy *(not in 2p)*
- **Winery F21 / Shipping Company F33**: situational wine production

Run the comparison explicitly before the last COMMIT. Game 2's round-27 instance: Castle settle (+17) vs Cloister Workshop (~+8 net) — settle dominated.

### Canonical Rules & Divergence Protocol

The authoritative rules are the official Lookout/Z-Man documents (setup sheet, 4-page general rules, 8-page detailed rules, 12-page glossary), public at `https://www.lookout-spiele.de/en/games/ora.html`. **The rulebook is ground truth; the Kennerspiel engine is an implementation of it.** Where the engine's behavior diverges from the rulebook, that is a *bug in the engine*, not a rule to internalize — capture it as a GitHub issue (describe observed vs. expected with a reproduction), then resume play against the engine's actual behavior. Do not silently encode buggy behavior as strategy.

### Kennerspiel Engine Quirks & Suspected Bugs

1. **Phantom SETTLE legality (suspected bug — file an issue).** `get_legal_moves(["SETTLE", …])` enumerates full settlement/coordinate/payment completions even when `bonus_actions = []` and no settlement phase is active, yet `make_move` correctly rejects them all. Per the rulebook, SETTLE is legal only during a settlement phase or via the Castle bonus, so the enumerator and the executor disagree — `get_legal_moves` is over-permissive. *Expected:* `get_legal_moves` should offer SETTLE only when a settle action is actually available. *Workaround until fixed:* treat the game-state `bonus_actions` array (and `upcoming_turns[0].settle`) as ground truth for whether SETTLE will be accepted; the completion list is necessary but not sufficient.
2. An empty-string completion with `partial_is_complete_command: false` means "syntactically complete, semantically unverified" — not a guarantee the engine will accept the command.
3. After any human rollback, re-fetch `get_game` before reasoning; in-context state is stale and `move_count` is the cheap staleness check.
4. `join_game` takes parameter `instance`, not `instance_id`.
5. **Round Tower dwelling value = 9, should be 2 (confirmed data bug; audited in published 0.19.1).** `pointsForDwelling(RoundTower)` returns 9 in `src/board/erections.ts` (and `dist`); both the rulebook appendix and the overview sheet print 2, and the Cloister Church is the stated *unique* highest at 9 — so the 9 is almost certainly copied from there. Ireland-only (I35), so France play is unaffected, but in an Ireland game it over-credits every adjacent settlement by 7 (and a Round Tower between two settlements leaks 14). Fix: `() => 2`, regenerate `dist`. Audit footnote: this was the *only* discrepancy across all 80 erections — every cost, every economic value, the other 79 dwelling values, and all 8 settlement food/energy costs matched canon exactly.

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

### USE Command Grammar — Clergy Assignment and Token Selection (engine-verified)

`USE <building> [token]` carries two independent degrees of freedom the engine resolves separately: **which clergyman is placed** and **which production-wheel token is reset**. Either one, set wrong, silently changes the result.

**Clergyman (who mans it).**
- Bare `USE <building>` auto-assigns a **lay brother** when one is home — the correct default for ordinary production. Do not spend the Prior reflexively.
- To man it with the **Prior**, issue the standalone command `WITH_PRIOR` *first*, then `USE <building>`. `WITH_PRIOR` is a flag for the next USE, not a building target. (Separate from the build-time bonus, where placing the Prior on a just-built building is auto-handled and grants the immediate bonus USE.)

**Token (which wheel token resets).** The optional trailing token names the production-wheel token to harvest-and-reset, defaulting to the building's natural good. The lever here is the **joker**:
- `USE <building> Jo` still pays out the building's good, but resets the **joker** token instead of the good's own token — leaving the good's token hot to keep climbing. Use it to protect a high token (e.g. a clay token sitting at 5) while still taking the good this turn, whenever the joker has accumulated value worth spending.
- bare (no token) resets the good's own token.

**Buildings this governs (production-wheel):** Clay Mound, Cloister Office, Farmyard, Vineyard (F14), Quarry (G22).

**Farmyard requires an explicit good** (it is a grain/sheep fork): `Gn` → grain (resets grain token), `Sh` → sheep (resets sheep token), `GnJo` → grain off the joker (grain token preserved), `ShJo` → sheep off the joker (sheep token preserved).

**Do not conflate with conversion-input tokens.** Some buildings take a trailing token that names a *conversion input*, not a wheel selector — `USE G07 Pt` flips peat → peat coal (the Peat Coal Kiln's free flip), unrelated to the joker. Read each building's effect before assuming the trailing token is a wheel selector.

### Opening Book — France, long 2p (living, not dogma)

Strong tested defaults; **keep observing the opponent and re-deriving.** An opening blind to the other player's development is a memorized line waiting to be punished — explore the deltas every game and fold what wins back into this section.

**Start-player round-1 block (2 actions), thin opening hand (1 each of peat/penny/clay/wood/grain/sheep):**
1. `BUILD G07` on a central interior plains plot, then take the auto-granted bonus `USE G07 Pt`. Penny scarcity is the game's binding constraint, and G07 (1 clay — the cheapest coin-minting tile) is the earliest fix; the Prior bonus USE nets +1 coin, +1 peat coal, and flips the starting peat to coal (fuel-3 > fuel-2, free). Economic +4 immediately. G07's −2 dwelling also wants to sit interior, away from future coastal settlement pockets. The Prior parks here and recycles on the round-4 wave recall — clear of the 5–8 converter window.
2. `FELL_TREES` on a forest. Wood is the broadest build material (G02 2w, F04 3w, G18 3w) and felling also opens a build plot, pre-empting landscape saturation; it is clergy-free, so both lay brothers stay home. +2 wood at the round-1 wheel value.

**Post-opening fork (landscape-gated):** with no free coast/hillside in the heartland (the common case), F04 Windmill is unbuildable, so the accessible converter axis is stone-based — **F08 Market** (E8; "4 goods → 7 coins + bread"; D8 settlement anchor) and **F17 Cloister Library** (the book engine) — which makes **G12 Stone Merchant** the natural follow-on build, plus a coastal plot around rounds 4–5 for cheap settlement dwelling value and to unlock F04.

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
