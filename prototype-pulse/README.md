# PULSE — difficulty-ladder prototype

**Throwaway.** Built to answer the one question that kept ADR-0003 at *Proposed*.

> ω turned out to be a tuning parameter with a sweet spot (9–13), not a knob.
> So difficulty has to come from somewhere else: **target tightness**,
> **number of targets**, or a **shorter frame budget**. Which one?

## Run it

**On a phone** — open the published artifact link (portrait, tap and hold anywhere).

**Locally** — open `pulse-prototype.html` in any browser. No build, no server, no
dependencies. Add `?variant=A|B|C` to jump straight to a ladder, `?lang=th` for Thai.

**The solvers** (Node, no deps):

```
node prototype-pulse/pulse-solve.js                        # v1: reachability, no thumb constraint
node --max-old-space-size=4096 prototype-pulse/pulse-solve2.js   # v2: with a realistic thumb
node --max-old-space-size=4096 prototype-pulse/pulse-levels.js   # ceilings for the shipped levels
```

## The game

One qubit, one thumb, portrait. `H = (ω/2)σz + (Ω/2)σx` at ω = 11, Ω = 14.
The Bloch vector precesses about Z on its own; holding drives it about X.
Score is fidelity `|⟨target|ψ⟩|²` — deterministic, no dice anywhere.

Fixed-timestep physics (1/120 s accumulator) so the score does not depend on the
phone's refresh rate. Verified bit-identical on repeat: same input word, same
fidelity to the last digit.

### Three ladders, one game

The game is held **visually identical** across all three variants; only the one
varied parameter changes. That is a deliberate departure from the usual "variants
must differ structurally" rule — here the variants *are* the difficulty axes, and
holding the looks constant is what makes the comparison valid.

| | varies | fixed |
|---|---|---|
| **A — tightness** | bar 80 → 88 → 93 → 96 → 98 → 99.3% | 4 targets, 700ms |
| **B — count** | 2 → 4 → 6 → 9 → 13 → 18 targets | 93% bar, 700ms |
| **C — budget** | 900 → 700 → 550 → 450 → 350 → 250ms | 93% bar, 4 targets |

### Every target is provably hittable

Targets are not placed at random. Each one is generated as the **endpoint of a
real, human-feasible input word** (every press or release held ≥ 100 ms) starting
from the current state, then rejected if you would drift into it by doing nothing,
by just holding, or by staying put.

This matters. With randomly placed targets the worst-case ceiling collapses as the
window shortens — 97.6% at 700 ms, then 77.9% / 62.2% / 51.4% / 26.5% at
550/450/350/250 ms — so a 93% bar would make half of ladder C silently impossible,
and "impossible" reads at a booth as "broken". By construction the ceiling is
100.00% at every window (verified in-page, 600 chained targets per window).

## Findings

### Budget is not a knob. It is an *inverted* knob.

Pass rate of a random-but-human-feasible thumb, measured against the shipped
generator (4,800 samples per row):

| window | median fidelity | clears 93% | clears 99.3% | tries to clear 93% |
|---|---|---|---|---|
| 900ms | 53.1% | 8.81% | 0.88% | 11 |
| 700ms | 54.4% | 9.33% | 1.31% | 11 |
| 550ms | 60.6% | 12.29% | 2.06% | 8 |
| 450ms | 60.3% | 16.54% | 3.08% | 6 |
| 350ms | 70.0% | 19.29% | 3.85% | 5 |
| 250ms | 73.7% | 18.85% | 5.46% | 5 |

Shortening the window makes the game **easier on every measure**. The reason is
structural: a thumb cannot commit for less than ~100 ms, so a 250 ms window admits
only about two segments. The space of distinct plays collapses, and guessing lands
on the answer. A *long* window is what creates enough ways to be wrong for
precision to matter.

So budget fails the same way ω did, and then some — with random targets it kills
reachability, and with reachable targets it makes the game degenerate. **Rejected.**

### Tightness is the difficulty knob.

At a fixed 700 ms window, the bar alone produces a clean monotone ladder:

| bar | tolerance | random thumb clears | tries to clear |
|---|---|---|---|
| 80.0% | 53° | 24.31% | 4 |
| 88.0% | 41° | 14.88% | 7 |
| 93.0% | 31° | 9.33% | 11 |
| 96.0% | 23° | 6.00% | 17 |
| 98.0% | 16° | 3.23% | 31 |
| 99.3% | 10° | 1.31% | 76 |

Roughly halving per rung, no cliff, every rung reachable, and — the part that
matters for a booth — it is **drawable**. The bar is an angular radius, so the
tolerance ring visibly shrinks on the sphere. The player sees the difficulty.

### Count is a stakes knob, not a difficulty knob.

Chaining targets does not compound error. Median fidelity per position across a
6-target chain: 51.7 → 50.1 → 50.4 → 50.3 → 49.6 → 49.1%. Flat. And the ceiling
for target *n+1* is 100% regardless of where target *n* left you (start latitudes
10° through 170° all reach 100%), because within 700 ms the reachable set from any
state is the whole sphere. There is no such thing as being left in a bad position.

What count changes is survival: at per-target skill *p*, a run clears with *p^K*.

| targets | p = 0.60 | p = 0.75 | p = 0.90 |
|---|---|---|---|
| 2 | 36.0% | 56.3% | 81.0% |
| 6 | 4.7% | 17.8% | 53.1% |
| 13 | 0.1% | 2.4% | 25.4% |
| 18 | 0.0% | 0.6% | 15.0% |

That is the combo/streak mechanic — real tension, but it converts precision into
*consistency* rather than making any single moment harder.

### Recommendation

**Tightness is the ladder. Count is the score.** Difficulty ramps by shrinking the
tolerance ring; length of the required streak is what you grind against on a given
rung. Hold the window fixed at 700 ms and never shorten it.

### One thing the simulation cannot settle

Every number above measures a *random* thumb. A human at 250 ms may well *feel*
rushed and panicked even though the objective pass rate is higher — subjective
difficulty and measured difficulty can disagree, and this project has been burned
before by designs that read fine and played boring. **Play ladder C and check
whether level 6 feels easier than level 1.** If it does, budget is dead on both
counts. If it feels harder despite the numbers, that is a genuine finding and the
recommendation above needs revisiting.

## Not production code

No tests, no error handling, no persistence (session only — LINE in-app
localStorage is still untested per ADR-0003). The floating variant switcher would
never ship. The physics kernel (`step` / `bloch` / `fidTo`, ~25 lines) is the only
part worth lifting into the real module; everything else is scaffolding.
