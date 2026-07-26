# ADR-0004 — The Satisfaction standard, and the falsification of ADR-0003's teaching bet

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** project owner, from reported Classmate playtests
**Supersedes:** ADR-0003 (PULSE), which never left Proposed and is now abandoned

## Context

Five builds had been judged and five had failed, with no written definition of what
"good" meant. Every verdict on record — the ADR-0001 and ADR-0002 rejections, the
four Stations, and all three PULSE playtest rounds — lists the **project owner** as
the sole decider. The grilling session that produced this ADR established that the
owner had also collected Classmate feedback and never recorded it anywhere.

That feedback is the most valuable asset the project has, and it is written down
here for the first time.

## Decision

**Satisfaction is positive feedback stated by a SCiUS Classmate who has played the
thing.** Not the owner's judgement, not observed behaviour, not a survey score.
**Learning drives Satisfaction** — teaching is a source of the good feedback, not a
tax levied against it.

Consequences that follow, and are binding on the next design:

1. **Content must be genuinely new to a Classmate.** Duality, tunneling and
   superposition are already theirs; the quantum-computing side is the only place
   Learning still exists for this audience.
2. **Engagement gates comprehension, not the reverse.** Classmates are selective-
   programme students who will work hard at something fun. Do not simplify — make
   the difficulty desirable.
3. **Meaning must be intrinsic.** See the falsification below.
4. **The verb is Execution, not Configuration.**

## Evidence — the Classmate verdicts

| Build | Classmate response |
|---|---|
| Stations 1–3 (duality, tunneling, superposition) | already understood the content — nothing left to learn |
| Station 4 (gates, circuits, Grover) | *"boring and hard to understand"* — too lazy to play |
| PULSE (round 3) | played it through, then asked **"what is this even for?"** |

Everything built is either **already understood** or **unintelligible**. There is no
third bucket, and under this ADR's model both buckets score zero by construction.
That is the whole of the project's failure record, explained.

## The falsified claim

ADR-0003 staked PULSE on an explicitly extrinsic bet: the mechanic makes a player
ask *"why does waiting help?"*, and a poster or a student then answers it. That bet
has now been run against the measuring population and it lost.

The itch never formed. *"Why does waiting help?"* is curiosity from inside the
activity. *"What is this even for?"* is a rejection of the activity — the player
never got in far enough to have the question ADR-0003 predicted. Asked to
disambiguate, the owner confirmed the response meant **both** "I can't connect this
to quantum anything" **and** "I see no reason for this to exist."

Note the failure is narrow and specific. Classmates played PULSE to the end. They
did not call it boring and did not call it hard. **The mechanic held; the meaning
was absent.** Extrinsic framing had already failed once before this — the legacy lab
wraps its Stations in a "quantum particle in a facility mid-breach" narrative and
also measured zero.

## Consequences

- PULSE is abandoned, mechanic and code both. The owner's decision, taken after
  this diagnosis, was a clean slate rather than a repair.
- What survives PULSE is one finding, not one line of code: deterministic fidelity
  scoring produces a genuine skill curve — 25.9 points between optimal and sloppy
  play, with no luck in the scoring loop (ADR-0003, Evidence 1).
- The ~250KB of legacy bilingual modules is abandoned along with it.
- The owner is a well-calibrated proxy for Classmate *taste*, and a structurally
  invalid proxy for Classmate *novelty* — they cannot see their own build for the
  first time. n=1 self-assessment is not Satisfaction.

## Still open

> **Closed by ADR-0005.** The grilling resumed and settled the Station 4 diagnosis
> and the Verb. The section below is left as written for the record; read ADR-0005
> for the answers. Note that ADR-0005 also resolves the contradiction between
> Decision §4 above ("The verb is Execution") and the Verb bullet below
> ("unresolved") — they were never in real disagreement.

The grilling that produced this ADR did not finish. Settled provisionally, pending
the rest of it:

- **Payoff** — beat a classical solver at the same task, plus genuine surprise. The
  classical baseline is intended to *be* the teaching, not decorate it.
- **Verb** — unresolved. The owner reports Execution as measured in PULSE was "too
  hard to understand", but Configuration is what Station 4 already was. Neither
  survives as-is; this is the open question.
- **The Station 4 diagnosis** — *what specifically* made it hard to understand was
  being asked when the session ran out of context. Unanswered, and load-bearing.
