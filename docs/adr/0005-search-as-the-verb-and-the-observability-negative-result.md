# ADR-0005 — Search is the verb, and observability is not the cure

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** project owner, from reported Classmate playtests
**Continues:** ADR-0004, whose "Still open" section this closes

## Context

ADR-0004 left three things open: the Station 4 diagnosis, the Payoff, and the Verb.
It also contradicted itself on the last one — Decision §4 binds *"The verb is
Execution, not Configuration"* while "Still open" calls the verb unresolved. This
ADR closes the diagnosis and the verb, and explains why the contradiction was
never a real disagreement.

## Evidence 1 — the Station 4 diagnosis

Asked what *specifically* Classmates found hard about Station 4, the owner's answer
was unambiguous: **the mechanics were clear and the meaning was absent.** Classmates
could place gates and press Run without difficulty. They had no idea what any gate
did or why the number moved.

This is not the same complaint as "I couldn't work the interface," and the
distinction is load-bearing for everything below.

The code shows how a player was left in that position. Station 4 is `circuit.js`
(id 7, rendered "Station 4" — the id defect CONTEXT.md notes):

1. **Placing a gate erases the output rather than updating it.** `onWireDrop` sets
   `probs = null` (`circuit.js:494`), so the bar chart reverts to its empty state.
   Adding information to the circuit removes information from the screen.
   `CLAUDE.md` claims "every gate placement changes the output probabilities live";
   that is not what shipped.
2. **Only `|amplitude|²` ever reaches the screen** (`circuit.js:201`). Phase is
   computed and never rendered anywhere.
3. **Therefore the Oracle changes the display by exactly zero pixels.** It flips the
   sign of one amplitude (`circuit.js:141`) and probability is the squared
   magnitude, so H,H,H → Run gives eight bars at 12.5%, and adding the Oracle →
   Run gives *the same eight bars at 12.5%*. The gate that performs the search is
   observationally identical to no gate at all. Diffusion then jumps the target to
   ~78% with nothing on screen having explained why.
4. **The hints explain in a vocabulary the interface never draws.** The Oracle
   "flips its arrow backwards" (`circuit.js:411`); Diffusion "reflects every arrow
   about the average" (`circuit.js:413`). There is no arrow anywhere in the UI.
5. **Every gate's `description` is dead code** (`circuit.js:22–57`) — defined, never
   rendered. The sole in-UI explanation is a `title=` tooltip, which does not exist
   on touch, and mobile portrait is the only layout that matters.

Try-things-until-green was not laziness. It was the only strategy the display
supported.

## Evidence 2 — observability is not the cure (negative result)

The obvious inference from Evidence 1 is that Station 4 failed because its state
was invisible, and that the fix is to show the state. **That inference is false, and
PULSE is the counter-example.**

PULSE rendered the qubit state continuously and well: a live Bloch-disc projection
with a motion trail (`prototype-pulse/pulse-prototype.html:294`, `:344`),
deliberately designed for legibility — *"distance from centre is the polar angle
theta, angle around is the phase phi. No hidden hemisphere, no depth ambiguity"*
(`:35–37`). It was built precisely to avoid the problem Station 4 has.

| Build | State visible? | Classmate outcome |
|---|---|---|
| Station 4 (Configuration) | no — only \|amp\|², Oracle is a no-op on screen | mechanics clear, meaning absent |
| PULSE (Execution) | yes — live, continuous, phase included | mechanics clear, meaning absent |

Opposite on observability, identical on symptom. **Seeing what is happening is not
the same as knowing what you are accomplishing.** Any future design that proposes
"make the state visible" as its answer to comprehension has already been run twice
and has one hit and one miss, which is no evidence at all.

## Decision — the verb is Search

**Search: the player spends queries against a hidden answer, graded on how few were
needed, racing a classical solver performing the identical task alongside them.**

The already-settled Payoff decides this, and it does so structurally rather than by
taste. The Payoff is *beat a classical solver at the same task*. A player cannot
beat a classical solver at precision, timing or control — a computer is perfectly
precise and the player loses every time. The only axis on which a quantum player
beats a classical one is **how many queries it takes to find the answer**. Grover's
algorithm *is* a query-complexity result; that is the entire theorem. So the Payoff
forecloses PULSE-flavoured Execution structurally, not merely empirically.

### This resolves ADR-0004's contradiction rather than picking a side

Search **is** Execution under CONTEXT.md's definition — graded on how well it is
performed, admits a skill curve — so ADR-0004 Decision §4 stands unamended. The
verb class was never wrong. What was wrong was the glossary's *quality dimension*:
CONTEXT.md defined Execution as "precision, timing, control", and that narrow list
is exactly what smuggled PULSE's motor-skill flavour in and made the result
incomparable to a classical baseline. The dimension is widened to include
**efficiency**, and Execution survives intact with its failure explained.

### Why this clears both graves

- **Against Station 4's grave:** the goal is meaningful before any quantum is
  understood. *Find the thing in fewer guesses than the other guy* is a goal a
  Classmate wants to win on sight, with no poster and no explainer — which is what
  ADR-0004 requires of Intrinsic meaning.
- **Against PULSE's grave:** the quantum is the win condition, not decoration. At
  8 boxes a classical searcher needs ~4.5 queries on average and Grover needs 2.
  The player cannot win without the algorithm, so *"what is this even for?"* is
  answered by the scoreboard rather than by framing. This is the classical baseline
  *being* the teaching, exactly as ADR-0004's provisional Payoff intends.

## Consequences

- The verb is settled and binding on the next design. Configuration is rejected
  permanently; precision/timing Execution is rejected as incompatible with the
  Payoff.
- CONTEXT.md gains **Search**, **Query** and **Classical baseline**, and its
  **Execution** entry is widened. See the glossary for the canonical wording.
- "Show the player the state" is demoted from a fix to a tactic. It may still be
  worth doing; it is no longer an argument that comprehension will follow.
- Station 4's five defects above are documented as diagnosis, not as a repair
  backlog. Nothing here commits the project to fixing `circuit.js`.

## Still open

- **Search-space size.** At 8 boxes the margin is 2 versus ~4.5 queries. That may
  be too thin for the win to *feel* like a win. This is a size question, not a verb
  question, and it is explicitly not settled here.
- **Whether the margin feels like a victory at all.** This cannot be settled on
  paper — it is a feel question and needs a runnable answer. Route: `/handoff` out,
  `/prototype` the race, `/handoff` back. Do not guess at it in conversation.
- **What a single query *is* in the interface** — what the player physically does to
  spend one, and how the classical opponent's queries are shown alongside.
- **Payoff** remains as ADR-0004 left it: beat a classical solver, plus genuine
  surprise. Confirmed as load-bearing by this ADR, not re-derived by it.
