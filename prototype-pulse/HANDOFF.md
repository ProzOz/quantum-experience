# Handoff — PULSE prototype → build

**Date:** 2026-07-25
**Project:** `C:\Users\USER\Desktop\quan2` (ProzOz/quantum-experience)
**Context:** SCiUS BUU school science-fair booth site. Bilingual TH/EN, static, no
backend ever, mobile portrait. Booth is roughly a month out.

This closes a `/prototype` detour off step 2 of the main flow. The prototype has
answered its question. The next session picks up at recording the decision, then
rejoins the main flow.

---

## Where everything lives — read these, don't re-derive them

| what | where |
|---|---|
| The three design-spike ADRs | `docs/adr/000{1,2,3}-*.md` on branch `worktree-design-spikes-adr` (**not on `main`** — the two have diverged completely) |
| The prototype, solvers, full method + evidence | `prototype-pulse/` on branch `prototype-pulse-difficulty` (base `worktree-design-spikes-adr`, HEAD `7591c2c`) |
| Findings writeup, all three rounds | `prototype-pulse/README.md` |
| Round-by-round evidence and corrections | PR https://github.com/ProzOz/quantum-experience/pull/2 (draft) + its two comments |
| Playable build | https://claude.ai/code/artifact/5ba85a25-a17b-45b2-aa4a-7bfb243564e9 |

Three commits on the branch, each with a detailed message:
`03fbc51` (round 1 — difficulty), `031b893` (round 2 — scoring),
`7591c2c` (round 3 — mechanic legibility).

**Everything factual is in those artifacts.** What follows is only what is *not*
written down anywhere else.

---

## The verdict, which exists only in conversation

The owner played the round-3 build and said:

> "prototype visibly look like shit but still feel a little bit fun"

Two separate findings, and the split matters:

1. **The mechanic has legs.** This is the **first positive feel signal in the
   project's recorded history.** ADR-0001, ADR-0002 and the handoff notes behind
   them are a list of ideas that were "insanely boring and pointless", "not short
   boring stuff", "nothing to get good at". This is the first thing to get off
   zero. Treat it as the single most important fact in this handoff.

2. **The presentation does not.** That is a *visual* problem, not a mechanic one —
   different class, much cheaper, and **not a prototype question**. There is
   nothing to falsify (nobody is surprised that a polished version looks better),
   and prototype code is throwaway by construction. Visual identity is a real
   booth deliverable and belongs in the spec, not in another prototype round.

### ⚠️ Unknown, and it is the top question to resolve

**Which variant felt fun — A, B, or C?** The owner said "prototype", singular, and
was not asked. The three are materially different games:

- **A** — Bloch sphere, hold-to-drive
- **B** — top-down disc (azimuthal equidistant), hold-to-drive
- **C** — top-down disc, discrete 90° tap pulses

They imply different specs, different booth copy, and different explanations of
the physics to a visitor. **Ask this before writing anything.** If the answer is
"I don't remember / I only tried one", ask them to spend two minutes on the link
above flipping between the three with the `‹ ›` bar.

### Caveat to carry into the ADR verbatim

"A little bit fun" is a **weak** yes. Recommendation given was: commit on it — the
two unpulled levers (visual identity, and arcade juice: hit feedback, combo
escalation, sound) both point up. But record the weakness, because if the built,
polished version is still only "a little bit fun", that means the mechanic was
never carrying it and the polish was. Better to learn that in week two than at
the booth.

---

## Three ADR-0003 claims this prototype overturned

These are load-bearing and currently live **only** in commit messages and PR
comments. They need to become an ADR (amend 0003, or a new 0004) before any spec
is written.

1. **ω ∈ 9–13 is not a constraint.** ADR-0003 pinned it there because anything
   slower made targets unreachable inside the window. The prototype generates
   every target as the endpoint of a real, human-feasible input word, so targets
   are reachable at **any** ω. That reasoning has lapsed. ω is now a **legibility**
   parameter, not a reachability one — tuned near 4, because the Bloch tip moves
   at ω × R px/s and ~1900 px/s (the old ω = 11) is far past what a hand can track.

2. **The difficulty ladder is tightness.** Count is a stakes multiplier (`p^K`,
   error does not compound); budget is a bounded secondary speed tier that stops
   responding below ~700 ms. Evidence tables in `prototype-pulse/README.md`.

3. **Scoring must be lock-in, not sampled at the buzzer.** ADR-0003 says "score =
   fidelity" without specifying *when*. That gap is exactly what made round 2
   unplayable — at a 700 ms window and an 80% bar, buzzer sampling took a thumb
   from 75.6% down to 25.4% per target.

Also worth preserving as a design rule regardless of variant: **generate targets as
the endpoint of a real playable input word.** Without it, randomly-placed targets
at 550 ms and below have worst-case ceilings of 78/62/51/27%, and levels are
silently impossible — which at a booth reads as "broken".

---

## Still open from ADR-0003, unchanged and now blocking

ADR-0003 is still **Proposed**. Accepting it is the owner's call, not the agent's.
Its "Still open" section has three items besides the difficulty ladder:

1. **Vocabulary collision** — `station` / `topic` / `puzzle` / `hook` overlap, and
   station IDs do not match display names (`id:4` renders as "Station 3").
   ADR-0003 says pin this *before writing tickets or it infects the new work*.
   **`CONTEXT.md` does not exist yet** — verified. This step is what creates it.
2. **Fate of the ~250KB of existing bilingual code** (aura, chat, duel, coop).
   Asked twice in earlier sessions, still unanswered. A spec cannot be written
   around a hole that size.
3. **LINE in-app browser localStorage isolation** — untested. This was background
   risk; it is now load-bearing, because "tightness is the ladder, count is the
   score" means a personal-best grind, which wants persisted PBs. The prototype
   deliberately kept everything in-memory to dodge it. ~20-minute spike, not a
   design question.

Tracker state: **zero GitHub issues**, no `.scratch/`. Clean slate.

---

## Suggested skills, in order

1. **`/domain-modeling`** — record the three overturned claims as an ADR
   (amend 0003 or add 0004), including the weak-signal caveat. Hard-to-reverse
   decisions are exactly its job.
2. **`/grill-with-docs`** — on the three still-open items above. Not to re-grill
   PULSE (that idea is sharp; three ADRs and three prototype rounds back it), but
   because two are unanswered scope questions that will otherwise infect the spec,
   and it is the step that produces the missing `CONTEXT.md`.
3. **`/to-spec`** → **`/to-tickets`** → **`/implement`** per ticket. This is a
   multi-session build with a booth a month out. Keep grill → spec → tickets in
   **one unbroken context window**; clear context between each `/implement`.

**Do not** reach for `/wayfinder` — three ADRs and a played prototype mean the fog
is gone, and it would cost a week that is not available. **Do not** `/triage` —
nothing incoming, and `/to-tickets` output is already agent-ready. **Do not** start
another `/prototype` round for the visuals.

---

## Prompt for the next session

Paste this into a fresh session:

```
Repo: C:\Users\USER\Desktop\quan2. Check out branch prototype-pulse-difficulty and
read prototype-pulse/HANDOFF.md first — it is a handoff from a finished /prototype
session and it points at the ADRs, the prototype branch, and PR #2 rather than
repeating them.

Note the ADRs are only on branch worktree-design-spikes-adr, and the prototype is
on prototype-pulse-difficulty — neither is on main, which has diverged completely.

Context: bilingual TH/EN static site, no backend ever, mobile portrait, school
science fair booth about a month out.

The prototype is done. I played it and it looks like shit but feels a little bit
fun — the first positive feel signal this project has had. So we are committing to
building PULSE, and the visual identity is build work, not another prototype.

Start by asking me which variant felt fun (A sphere+hold, B disc+hold, or C
disc+tap) — the handoff explains why that changes everything downstream, and
nobody asked me.

Then:
1. /domain-modeling — record as an ADR the three ADR-0003 claims the prototype
   overturned (omega is a legibility not a reachability parameter; tightness is the
   difficulty ladder; scoring must be lock-in not buzzer-sampled), and record the
   "only a little bit fun" signal as the weak yes it is.
2. /grill-with-docs — on ADR-0003's three still-open items: the station/topic/
   puzzle/hook vocabulary collision (this is what creates the missing CONTEXT.md),
   the fate of the ~250KB of existing bilingual modules, and whether LINE's in-app
   browser isolates localStorage now that a personal-best grind needs persistence.
   Push me for real answers on the 250KB one — I have dodged it twice.
3. Then /to-spec and /to-tickets, in the same context window.

Do not start another prototype round, and do not use /wayfinder.
```
