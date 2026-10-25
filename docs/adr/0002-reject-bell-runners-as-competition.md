# ADR-0002 — Reject BELL RUNNERS as a competition; keep the 75% crossing

**Status:** Accepted
**Date:** 2026-07-25
**Deciders:** project owner, with a variance spike run before committing build time

## Context

BELL RUNNERS was the second of three candidate games. Two-player CHSH: two engines whose
difference is one visible line — the classical one computes `a = f(x, λ)` and
*structurally never receives* the other player's question; the quantum one uses
`coopMatchProb()` (`coop.js:486`, already written, returns `Math.cos(d/2)**2`).

The intended discovery ramp: binary dials first, then a 4×4 board enumerating all 16
classical strategies so the 75% ceiling is found **by exhaustion**, then continuous dials
with a live S value and a red line at 2.0 that thumb-dragging hill-climbs toward the
quantum optimum. The Tsirelson bound doubles as anti-cheat.

The risk identified up front was social: the optimum is four numbers, so one student
posts them in the class LINE group on day two and the quantum tier becomes copy-paste,
after which everyone scores 85.4% ± noise and the leaderboard ranks RNG variance.

## Method

A simulator (`bell.js`, throwaway, not checked in) using the existing `cos²(d/2)` kernel
from `coop.js:486`. It reproduces `cos²(π/8) = 85.36%` exactly for optimal settings and
75.00% for the classical ceiling, which validates the model against theory before any
conclusion is drawn from it.

Note for anyone re-deriving this: the `cos²(d/2)` kernel already contains the half-angle,
so optimal settings are spaced **45°** apart in this parameterisation, not 22.5°. Getting
this wrong yields 79.86% and quietly understates the whole analysis.

## Evidence

The real problem is worse than the leak, and different in kind: **the optimum is flat.**

| Angle error | Win probability | Cost vs optimal |
|---|---|---|
| 0° | 85.36% | — |
| 2° | 85.33% | 0.02 pts |
| 5° | 85.22% | 0.13 pts |
| 10° | 84.82% | 0.54 pts |
| 15° | 84.15% | 1.20 pts |
| 22.5° | 82.66% | 2.69 pts |
| 45° | 75.00% | 10.36 pts |

Consequences of that flatness:

- Resolving a 5°-better player from a sloppier one at 95% confidence needs
  **373,753 rounds**. For 2°, **14.5 million**.
- A leaderboard of 200 players who *all already know* the optimal angles spreads
  **20–35 points** purely on luck (35 pts at 20 rounds/match, 20 pts at 100).
- The thumb-dragging hill-climb is nearly feedback-free by construction: a maximum has
  zero derivative, so the closer a player gets, the less the game can tell them.

A player a full 22.5° off — visibly sloppy — still scores 82.66%, comfortably above the
75% classical ceiling. Skill is invisible; only the physics is visible.

## Decision

**Reject BELL RUNNERS as a competitive/skill game.** It cannot rank players, and a
leaderboard over it would be a random number generator with extra steps.

**Keep the finding that crossing 75% is sharp.** Going from 45°-off (75.00%, exactly the
classical ceiling) to optimal (85.36%) is a 10.36-point signal — large, unambiguous, and
the only thing in the whole table that measures cleanly. That is the physics payoff and
it survives.

## Consequences

- The 75% crossing is a genuine revelation but a **one-shot** one. Once seen, it is
  finished. That places it back in the "poke it once and you are done" category this
  project has rejected repeatedly — so it is a *moment*, not a game.
- Correct use: a single beat inside something else, not a mode with a leaderboard.
- `coopMatchProb()` at `coop.js:486` remains correct and reusable.

## Relationship to ADR-0001

Both candidates died for the same underlying reason, which is worth naming: **quantum
mechanics resists being made into a skill curve.** Interference washes out player control
(ADR-0001) and probabilistic scoring drowns player precision in variance (ADR-0002). Any
future candidate must be checked against this failure mode *before* build, not after.
