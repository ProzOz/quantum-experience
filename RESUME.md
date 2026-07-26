# Resume on a new machine

Written 2026-07-27, at the end of the grilling session that produced ADR-0005.

## 1. Clone and get on the right branch

```bash
git clone https://github.com/ProzOz/quantum-experience.git
cd quantum-experience
git checkout prototype-pulse-difficulty   # the design thread lives here
npm install
```

`main` on GitHub (`cf2794b`) is the real site history. The old PC also had a
**stale local `main`**, diverged since `5a2336c`, whose three commits were never
pushed to `main`; they are preserved on `backup/local-main-old-pc`. Do not merge
that into `main` without deciding you want it — the work in it is a parallel take
on features `origin/main` already has.

## 2. Restore the agent toolchain

`.agents/` is gitignored, and `.claude/skills/*` are only **absolute symlinks**
into it. None of it is on `main`. It was bundled onto the backup branch:

```bash
git checkout origin/backup/local-main-old-pc -- .agents mobile-microsite skills-lock.json
git reset                      # unstage — files stay on disk, .gitignore hides them
mkdir -p .claude/skills
cp -r .agents/skills/* .claude/skills/   # real dirs, not symlinks — survives a path change
```

That restores all 37 skills, including `ask-matt`, `grill-with-docs`, `grilling`,
`domain-modeling`, `prototype`, `handoff`, `implement`, `to-spec`, `to-tickets`
and `wayfinder`.

Three loose booth photos (`G304-product.png`, `IMG_0794.png`, `owner.png`) are on
the same backup branch if you want them — they are referenced by no HTML, JS or
CSS.

## 3. Where the thinking stands

Read in this order, and do not re-derive any of it:

- `CONTEXT.md` — the glossary. Satisfaction, Classmate, Learning, Intrinsic
  meaning, Execution, Configuration, Search, Query, Classical baseline.
- `docs/adr/0004-...md` — the Satisfaction standard, the three Classmate verdicts,
  and the falsification of ADR-0003's extrinsic teaching bet.
- `docs/adr/0005-...md` — the Station 4 diagnosis, the observability negative
  result, and Search adopted as the verb.

**Ignore `prototype-pulse/HANDOFF.md` entirely.** It is superseded and says the
opposite of what was decided.

Settled: Satisfaction is the only success measure; PULSE is abandoned; the verb is
**Search** — spend Queries against a hidden answer, graded on how few, racing a
visible Classical baseline.

## 4. The next step is a prototype, not a spec

Do **not** go to `/to-spec`. ADR-0005 rests on one unvalidated assumption, and this
project has now guessed wrong on paper five times. The open question needs a
runnable answer:

> Racing a visible classical solver at 8 boxes, does a player who wins in 2 queries
> *know they won*, and want to go again?

If no, the fix is probably the search-space size, not the verb — try 16 (2 vs 8.5)
and 64 (6 vs 32.5) before touching anything settled. And per ADR-0004, it is not
answered when it feels good to the owner: n=1 self-assessment is not Satisfaction.
A Classmate has to race it and say something.

## 5. Prompt to paste into Claude Code

```
Repo: quantum-experience, branch prototype-pulse-difficulty.

Read CONTEXT.md, docs/adr/0004-*.md and docs/adr/0005-*.md first. They hold the
Satisfaction standard, my classmates' verdicts, why ADR-0003's teaching bet
failed, and why the verb is Search. Do not re-derive any of it and do not
re-litigate the decisions in it. Ignore prototype-pulse/HANDOFF.md entirely —
it is superseded.

ADR-0005 is settled but rests on one unvalidated assumption, which is the next
thing to test: at 8 boxes, a quantum player wins in 2 queries against a
classical solver's ~4.5. I need to know whether that margin actually reads as a
win to a player, because if it doesn't, the search-space size has to change.

Run /prototype to build a throwaway race: the player and a visible classical
solver searching the same hidden boxes, spending queries side by side. Make N
adjustable (8, 16, 64) so I can feel the difference. Throwaway from day one —
we keep the answer, not the code.

Facts you can look up in the repo, look up. Decisions are mine.
```
