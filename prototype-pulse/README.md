# PULSE — prototype

**Throwaway.** Three rounds, each driven by a playtest verdict.

| round | question | verdict |
|---|---|---|
| 1 | Where does difficulty come from — tightness, count, or budget? | **Tightness.** Count is stakes, budget is a bounded speed tier. |
| 2 | *"All of the modes are too hard."* | The **scoring rule**, not the ladder. Lock-in fixed it. |
| 3 | *"Easier, but the game mechanic feels like shit."* | It was **illegible**, not badly tuned. See below. |

The current build (`?variant=A|B|C`) varies the **mechanic**, not the difficulty —
round 1 settled difficulty, so the live question is which mechanic feels good.

    A — SPHERE + HOLD   ω 4, with a forward preview of both futures
    B — DISC   + HOLD   same physics, drawn top-down
    C — DISC   + TAP    discrete hard 90° pulses instead of holding

A → B isolates the **view**. B → C isolates the **control**.

## Round 3: the mechanic was illegible

The tip of the Bloch vector moves at up to **ω × R pixels per second**. At the
shipped ω = 11 with R = 170 px that is **~1900 px/s** free and **~3000 px/s** while
driving — it crosses the sphere in under 0.2 s. A phone tip is comfortably
trackable to roughly 600 px/s. You could not see cause and effect, so you held and
hoped. That is a slot machine with a hold button — the exact failure ADR-0001 named
for MANY WORLDS.

**The constraint that pinned ω there had already dissolved.** ADR-0003 fixed
ω ∈ 9–13 because anything slower made targets *unreachable inside the window*. But
targets are now generated as the endpoint of a real input word, so they are
reachable at **any** ω. Nobody noticed the constraint had lapsed — including me,
for two rounds.

Slowing to ω = 4 puts the tip at 680 px/s and stretches the precession period from
0.57 s to 1.57 s. Difficulty does not vanish, it just moves up the bar — a random
thumb clears an 88% bar but only 41% at a 99% bar — so the tightness ladder simply
recalibrates to 88 / 93 / 96 / 98 / 99 / 99.5%.

Three further changes, each attacking a specific reason it felt bad:

- **Both futures are drawn.** A gold path shows where holding (or the next tap)
  takes you; a purple path shows where letting go takes you. This is just forward
  simulation of deterministic dynamics, so it is honest — and it converts the game
  from guessing into planning. It is "wait for the phase" made visible.
- **The disc view** (variants B and C) is an azimuthal-equidistant projection:
  distance from centre is the polar angle (centre = |0⟩, rim = |1⟩), angle around
  is the phase. The whole sphere with no hidden hemisphere and no depth ambiguity,
  and free precession becomes a clock hand sweeping at constant speed.
- **Tap-to-pulse** (variant C) replaces analog hold-duration with discrete hard 90°
  X-pulses — the impulsive limit real quantum control actually uses. Only the smooth
  precession has to be tracked; the pulse reads as a jump. So the skill collapses to
  pure timing, which is what rhythm games are built on.

**Unverified.** Everything in this section is reasoning plus a legibility budget,
not a playtest. Which of the three actually feels good is exactly what cannot be
settled on paper — that is what the variants are for.

---

## Round 1: where difficulty comes from

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

### First finding: the scoring rule mattered more than any of the three knobs

The first build scored fidelity **at the buzzer** — wherever the vector happened to
be when the window expired. Playtest verdict was blunt: *every mode is too hard*.
That was correct, and it was not the ladder values.

Buzzer scoring throws away everything except one instant. Being at 99% a frame
early counts for nothing, and there is no read-time to find the phase before
acting. Every game this is modelled on — osu!, Geometry Dash, Super Hexagon —
shows the thing coming and pays you the moment you connect.

Rule now: **best fidelity reached at any instant while the target is live, locking
in the moment you touch the bar.** Still fully deterministic — no dice, so
ADR-0003's core requirement holds — and arguably closer to the ADR's own words
("steer the vector onto each one") than sampling at the buzzer was.

Pass rate of one random human-feasible thumb on one target, 700 ms window:

| bar | at the buzzer | lock-in |
|---|---|---|
| 70% | 36.9% | **85.7%** |
| 80% | 25.4% | **75.6%** |
| 88% | 15.8% | **62.9%** |
| 93% | 9.7% | **50.6%** |
| 99.3% | 1.2% | **17.2%** |

Level 1 of ladder A (4 in a row at a 70% bar) goes from roughly 1-in-250 to
**over half** for *random* input. A real player is well above that. Verified in the
browser: a scripted random thumb now clears level 1 of ladders A and C, and still
fails every level 6.

### This flips the budget verdict — my earlier one was wrong

The first writeup said budget was an *inverted* knob: shortening the window raised
the pass rate. That was true, but **only under buzzer scoring** — the very rule
that made the game unplayable. Under lock-in, a shorter window means fewer chances
to touch the target, so it works the normal way round. Recorded here because the
earlier claim is in the git history and the PR.

| window | buzzer | lock-in |
|---|---|---|
| 1600ms | 7.3% | 82.3% |
| 1200ms | 7.7% | 70.6% |
| 900ms | 8.8% | 59.5% |
| 700ms | 9.5% | 52.8% |
| 500ms | 13.5% | 46.9% |
| 400ms | 18.6% | 42.7% |
| 300ms | 19.9% | 40.6% |
| 250ms | 17.9% | 36.0% |

But budget is **bounded**. It drops 29.5 points across 1600 → 700 ms, then only
16.8 points across 700 → 250 ms, and 400/300/250 ms are nearly flat. Two effects
fight below ~700 ms: fewer chances to touch (harder) against a collapsing space of
distinct plays (easier, since a thumb cannot commit for under ~100 ms). They
roughly cancel. Ladder C deliberately runs 1600 → 400 ms so you can feel where it
stops responding.

### Tightness is still the primary knob

At a fixed 900 ms window, lock-in scoring, random thumb per target:

| bar | tolerance | clears |
|---|---|---|
| 70% | 66° | 90.8% |
| 80% | 53° | 82.6% |
| 88% | 41° | 71.3% |
| 93% | 31° | 59.3% |
| 96% | 23° | 48.2% |
| 99.3% | 10° | 21.7% |

Monotone, no cliff, no saturation, every rung reachable. Two things keep it ahead
of budget:

- **Range.** Tightness spans 90.8% → 21.7% (4.2×) and is still falling at the top
  rung. Budget spans 82.3% → 36.0% (2.3×) and flattens halfway.
- **It is drawable.** The bar is an angular radius, so the target zone visibly
  shrinks. The player *sees* the difficulty rise. Nothing shows a shorter clock
  except a faster-draining arc.

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

**Tightness is the ladder. Count is the score. Budget is a speed tier, not a
ladder.** Ramp difficulty by shrinking the target zone; the required streak length
is what you grind against on a rung; the clock is available as a secondary tier
(1600 → 700 ms is the responsive range) but cannot carry the curve on its own.

And underneath all three: **lock-in scoring is not optional.** It was worth more
than every knob choice combined.

### Current ladder tuning

| | rungs | fixed |
|---|---|---|
| **A — tightness** | bar 70 / 80 / 88 / 93 / 96 / 99% | 4 targets, 900ms |
| **B — count** | 2 / 4 / 6 / 9 / 13 / 18 targets | 88% bar, 900ms |
| **C — budget** | 1600 / 1200 / 900 / 700 / 500 / 400ms | 93% bar, 4 targets |

Rung 1 of each is clearable by *random* input, so it works as a booth tutorial;
rung 6 of each resists it.

### Still to check in the hand

- Is rung 1 now too easy? It is deliberately clearable by random input so a booth
  visitor cannot bounce off it, but there is a difference between "forgiving" and
  "nothing happened". If it feels like nothing happened, raise ladder A rung 1 from
  70% to 80% — that is still 82.6% per target.
- Does the ladder now climb at the right *rate*? Six rungs may be too few or too
  many between "first touch" and "this is hard".
- Ladder C past rung 4 (700 ms) should feel like it stops getting harder and starts
  just feeling rushed. If it doesn't — if 400 ms feels meaningfully harder than
  700 ms — the flattening is not showing up in the hand and budget deserves more
  weight than the recommendation gives it.

## Not production code

No tests, no error handling, no persistence (session only — LINE in-app
localStorage is still untested per ADR-0003). The floating variant switcher would
never ship. The physics kernel (`step` / `bloch` / `fidTo`, ~25 lines) is the only
part worth lifting into the real module; everything else is scaffolding.
