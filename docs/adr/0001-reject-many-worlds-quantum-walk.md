# ADR-0001 — Reject MANY WORLDS (quantum-walk maze)

**Status:** Accepted
**Date:** 2026-07-25
**Deciders:** project owner, with a falsification spike run before committing build time

## Context

MANY WORLDS was one of three candidate games for the SCiUS BUU booth site. The pitch:
a puzzle-platformer with no single avatar, where one swipe moves **every** superposed
copy at once. The maze is the Hilbert space — one complex amplitude per cell — reusing
the existing `cAdd` / `cMul` / `cMag2` helpers (`circuit.js:73-77`) verbatim. Walls do
not block a copy; they reflect it with a −1 phase, like a wave on a fixed rope end.
A marked cell plus `applyDiffusion` was claimed to turn a room into literal amplitude
amplification, so the player would discover "mark, sweep, ~√N times" as a rhythm.

The design carried one load-bearing risk, identified up front: **not legibility, but
solvability**. Nobody can forward-simulate 30 interfering amplitudes mentally. If the
game is swipe-until-green, it is a slot machine in a puzzle costume.

That risk was explicitly falsifiable in about a day, which is far cheaper than the month
the full build would have cost. So we ran the spike first.

## Method

A headless simulator (`walk.js`, throwaway, not checked in) modelling:

- Hilbert space = position (5×5 cells) ⊗ coin (4 directions) = 100 complex amplitudes
- A swipe in direction `d` applies `U_d = Shift · GroverCoin · Z_d`, where `Z_d` flips
  the sign of coin component `d` (the player's mark) and `GroverCoin` is `G = 2|s⟩⟨s| − I`
  on the four directions — the same shape as the existing `applyDiffusion`
- `G · Z_d` is exactly one Grover iteration in coin space, so a swipe genuinely pumps
  amplitude toward `d` without ever being deterministic
- Shift: amplitude with coin `d` moves to the neighbour in direction `d`; if that
  neighbour is a wall it stays put, reverses direction and picks up −1

Then: exhaustive search over every 4ⁿ swipe sequence, plus beam search past exhaustive
depth, plus a separate run of the marked-cell amplitude-amplification variant.

## Evidence

**The simulator is trustworthy.** Norm conserved to `1.1e-15` over 500 random swipes.

**The plain swipe-walk cannot hit a target.** Goal at the opposite corner (Manhattan
distance 8):

| Search | Depth | Empty grid | 20% walls |
|---|---|---|---|
| Exhaustive (200 grids × 87,380 sequences) | 8 | 3.8% | 0.4% |
| Exhaustive | 10 | 16.0% | 7.6% |
| Exhaustive | 11 | 18.9% | 11.9% |
| Beam (width 3000) | 12 | 21.9% | 8.2% |
| Beam (width 3000) | 16 | 36.3% | 22.1% |
| Beam (width 3000) | 24 | 36.3% | 41.4% |

**Zero** sequences reached 50% at any exhaustive depth, on any grid, at any wall density.
A classical walker needs 8 perfect moves and arrives with 100%. The saturation near 40%
is reached only by a search vastly stronger than a human, after 16–24 swipes.

**The amplitude-amplification claim does not hold at this scale.** Running the marked-cell
oracle every step (i.e. quantum-walk search) on an empty 5×5, against a 4.0% uniform baseline:

- median peak on the marked cell across all 25 possible marked cells: **5.8%**
- best case: 9.7%, reached at **t = 35**, not at t = √25 = 5
- the trace jitters between 2% and 8% with no legible rhythm

This agrees with published theory — Ambainis–Kempe–Rivosh show the 2D grid is the *weak*
case for quantum-walk search, with success probability O(1/log N). The result matching
the literature is evidence it is real physics rather than a simulation bug.

One false lead worth recording: an early metric reported "100% on some cell" at every
depth. That was real but degenerate — swiping `U` in the top-left corner reflects
everything straight back into the start cell. The physics was right; the metric was
rewarding staying home.

## Decision

**Reject MANY WORLDS.** The load-bearing risk resolved against the design. It is not a
puzzle and not even a lottery — a lottery at least has winners. The player cannot
reliably reach a target at all, and the amplitude-amplification rhythm that was supposed
to carry the skill curve does not exist on a grid this size.

## Consequences

- The month of build time is not spent. This is the spike working as intended.
- The honest reflecting-wall rule (−1 phase on reflection) is still good physics and
  still legible; it just does not produce a controllable game. Reusable if a future
  design wants a *visualisation* rather than a goal-directed puzzle.
- The `circuit.js` complex helpers remain unused by any shipped game so far.

## Caveats

Tested with the Grover coin. It is the standard choice for walk search and the one that
makes "a swipe is a Grover iteration" honest, but it is one coin family. A larger grid
improves the asymptotics but worsens the absolute swipe count, which a booth interaction
cannot afford — so this does not rescue the design.
