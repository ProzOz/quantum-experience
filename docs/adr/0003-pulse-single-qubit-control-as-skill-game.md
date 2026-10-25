# ADR-0003 — PULSE: single-qubit control as the skill game

**Status:** Proposed — spike passed, awaiting the owner's decision to build
**Date:** 2026-07-25
**Supersedes the search that produced:** ADR-0001 (rejected), ADR-0002 (rejected)

## Context

ADR-0001 and ADR-0002 killed two candidates for the same root reason: **quantum mechanics
resists skill curves.** Interference washes out player control; probabilistic scoring
drowns player precision in variance.

The owner then named the interaction shape the project is actually aiming for: **a skill
game you grind** — osu!, Geometry Dash, Super Hexagon. You are bad, then you are good, and
the gap is visibly you improving. This retroactively explains every rejection recorded in
the handoff: each rejected idea was a poke-once demo with no skill curve
("insanely boring and pointless", "not short boring stuff", "nothing to get good at").

So the design problem is precise: **build a skill curve on quantum mechanics without the
randomness eating the skill.**

## Decision (proposed)

Score on something **deterministic**: fidelity to a target state, `|⟨target|ψ⟩|²`. The
quantum-ness lives in the state space — complex amplitudes, Bloch-sphere geometry,
non-commuting rotations — while the score is exact and continuous. No dice anywhere in
the scoring loop.

**PULSE** — one qubit, one thumb, portrait:

- The Bloch vector precesses continuously about Z (Larmor). Free automatic motion: the beat.
- Holding the thumb applies a drive about X (Rabi). Releasing lets it precess.
- Targets stream at the player; steer the vector onto each one.
- Score = fidelity, shown live as a percentage. Fail = below threshold. Instant restart.

The skill is that mashing gets you nowhere — you must **wait for the phase** and time the
pulse against the precession. That is literally the technique of quantum control, learned
in the thumb before it has a name. Per decision 6 in the handoff, "why does waiting help?"
is the itch the booth is supposed to create.

Supporting fact already verified in an earlier session: textbook Clifford+T gates (H, X, S, T)
hide order-dependence completely — all 24 orderings give exactly 50.0% in a Z-basis
measurement. `{H, Ry70, Rx50, Rz60}` instead spreads 1.7%→97.0% across 14 bins.
Non-commutativity is only *felt* if the gate set is chosen to make it visible.

## Evidence

Simulator `pulse.js` (throwaway, not checked in). `H = (ω/2)σz + (Ω/2)σx` with the drive
gated by a per-frame thumb bit at 60fps; exhaustive over all 2²⁰ inputs for a 20-frame
(⅓ second) window. Norm conserved to `2.0e-14` over 300-frame runs.

**1. Improvement is hugely visible — the inverse of ADR-0002.**

| | PULSE | BELL RUNNERS (ADR-0002) |
|---|---|---|
| optimal | 80.4% | 85.36% |
| sloppy / mashing | 54.5% | 82.66% |
| **gap** | **25.9 pts** | 2.69 pts |
| noise | **none — deterministic** | ±20–35 pts of luck |
| rounds to resolve a small skill gap | **1** | 373,753 |

**2. The landscape is smooth, so it is trainable.** Perturbing the optimal input:

| frames flipped (of 20) | median fidelity | mean drop |
|---|---|---|
| 1 | 77.1% | 3.3 pts |
| 2 | 74.0% | 6.2 pts |
| 3 | 71.5% | 8.8 pts |
| 5 | 67.8% | 12.9 pts |
| 8 | 63.4% | 17.4 pts |

Roughly 2 points per wrong frame, monotone, no cliff. A slightly better player reliably
scores slightly better — the precondition for a grind that rewards practice.

**3. It is genuinely a timing game, not a slider.** Holding the number of drive frames
fixed and varying only *when* they occur:

| drive frames | worst ordering | best ordering | spread from timing alone |
|---|---|---|---|
| 1 | 44.4% | 55.2% | 10.8 pts |
| 3 | 34.9% | 64.0% | 29.1 pts |
| 6 | 26.4% | 72.0% | **45.6 pts** |
| 9 | 26.6% | 74.4% | **47.8 pts** |
| 12 | 35.5% | 74.1% | 38.6 pts |
| 18 | 69.0% | 77.5% | 8.6 pts |

Order alone moves the score by up to 48 points. The skill lives at mid drive-density
(6–9 frames of 20), which is a concrete design target for level tuning.

## Consequences and open constraints

**The precession rate ω is NOT the difficulty knob.** It is a tuning parameter with a
sweet spot, and it fails on both sides:

| ω | best achievable | inputs ≥90% | mashing median |
|---|---|---|---|
| 2 | 50.0% | 0% | 21.7% |
| 6 | 80.4% | 0% | 54.5% |
| **9** | **96.3%** | **0.588%** | 71.2% |
| 13 | 94.6% | 0.092% | 70.7% |
| 25 | 85.0% | 0% | 50.4% |

Too slow and the target is simply unreachable in the window; too fast and control washes
out. Tune ω ≈ 9–13, where ~0.1–0.6% of inputs clear 90% — hard but achievable. Difficulty
must then ramp from **something else**: target tightness, number of targets in a sequence,
or a shorter frame budget. This is unresolved and must be settled before build.

Note the ω = 6 numbers used elsewhere in this ADR are from a deliberately *untuned* level;
at ω = 9 the ceiling rises to 96.3%.

## Still open

- The difficulty ladder (above).
- The vocabulary collision flagged in the handoff — `station` / `topic` / `puzzle` / `hook`
  overlap, and station IDs do not match display names (`id:4` renders as "Station 3").
  Pin this down in `CONTEXT.md` before writing tickets or it infects the new work too.
- Fate of the ~250KB of existing bilingual code (aura, chat, duel, coop). Asked twice in
  earlier sessions, still unanswered.
- LINE in-app browser localStorage isolation — untested, and threatening to any design
  with persisted state such as a personal-best grind.
