# Changelog

## [0.21.2] - 2026-07-02

- Allow a COMMIT when the main action hasn't been used. Any human looking only one turn ahead can avoid this state, but an MCTS random walk encounters it quite often.

## [0.21.1] - 2026-06-24

- The combination of Ornament + Book with the HouseOfTheBrotherhood wasn't offered for points of 6. (#1846)

## [0.21.0] - 2026-06-24

- GameStatePlaying, GameStateSetup, GameStateFinished: all of these are now just GameState (#1818)
- Carpentry allows NoOp (#1843)

## [0.20.3] - 2026-06-23

### Fixed
- Wine/food correctly consumed with the Inn; had the 7 and 6 reversed (#1838)
- Carpentry col/row params reversed and inconsistent with completion (#1840)

## [0.20.2] - 2026-06-16

### Fixed
- Round Tower corrected to award 2 dwelling points (was incorrectly 9) (#1800)
- Forger's Workshop move enumeration now generates all affordable reliquary tiers (5, 15, 25, 35, 45 coins) instead of capping at 2 reliquaries (#1798)

## [0.20.1] - 2026-06-14

### Fixed
- Re-enabled TypeScript declaration file (`.d.ts`) emit that had been accidentally disabled, unblocking Vercel deploys (#1783)

## [0.20.0] - 2026-06-14

### Changed
- Repository rebranded from `hathora-et-labora` to `kennerspiel`; README badges and CI links updated accordingly

### Fixed
- Bonus round no longer offers a phantom `USE` action for `buildContinuation` when the prior is not free (#1775)
