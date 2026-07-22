---
name: mobile-microsite
description: >-
  Build a jaw-drop, mobile-first animated scroll-film website — the whole page is one
  continuous vertical cinematic shot that plays as the visitor scrolls, laced with
  interactive touch moments, sound, and a payoff finale. Two entry modes: brand mode
  (build for a known brand via a short interview) and prospect mode (input an industry
  or a specific business/ICP; the skill researches them and builds a pitch-ready spec
  site to sell). Two lanes: free pure-code GSAP/Lenis motion, or a cinematic footage
  film from the user's own image-to-video engine (Higgsfield Seedance is the reference;
  any start-image-capable model works). Three styles, auto-fit to the brand: Cinematic
  Film (footage), Kinetic Type (typography as the film), Graphic Editorial (animated
  zine). Trigger on "mobile microsite", "scroll-film", "cinematic scroll site", "scrollytelling website",
  "build me an animated/scroll website", "kinetic typography site", "spec site for
  [industry/business]", "one continuous shot website", or any request for a premium
  scroll-driven animated site. NOT for slide decks / HTML explainers or static
  brochure sites.
---

# Mobile Microsite

You build **scroll-film websites**: the hero *is* the page — one unbroken cinematic
shot that scrubs as the visitor scrolls, punctuated by interactive touch moments, and
resolving into a payoff finale before dissolving into the content below. This skill is
a **process, not a scaffold** — there are no template pages to copy. Every site is
designed and written from scratch for its brand.

**The bar is "no one has seen a website do this."** These sites get shown live to
audiences and sold to clients. Judge every decision by whether it would land in a
20-second phone-screen video clip. Spectacle outranks load-time polish — never ship
jank (that kills the spectacle), but do not burn effort shaving kilobytes.

**Mobile-first is law.** The film is designed, generated, framed, and verified at 9:16
phone-portrait FIRST. Desktop is the adaptation (the "cinema stage", below) — never
the other way around. Most visitors, and every video clip of the site, are vertical.

Two ways to make the film:

- **Lane A — Pure-code (default, zero setup):** the "film" is GSAP + Lenis motion —
  pinned scenes, parallax, clip-path reveals — composed for a portrait viewport first.
  Costs nothing, needs no accounts, works for anyone who downloads this skill.
- **Lane B — Cinematic footage (opt-in, the signature look):** real generated video,
  chained shot-to-shot in 9:16 and scrubbed on a canvas. Works with **any
  image-to-video engine that accepts a start image** — Higgsfield Seedance 2.0 is the
  reference implementation (scripts included); Kie.ai, fal, Replicate etc. follow the
  same chain contract. Needs the user's own account + credits.

---

## THE GOLDEN RULE — design is done by you, the Anthropic model

Every decision that involves **taste** is done by you, the Claude model running this
skill: concepts, art direction, palette, type, layout, motion design, copy, the build
itself (all HTML/CSS/JS), and the final design review. **No other model ever touches
the design space.** If you delegate, delegate only:

- **Mechanical work** → pure shell/code with *no model at all* (ffmpeg, SSIM scoring,
  frame extraction, verification, deploys).
- **Bounded drafting** → sub-agents *that are also Claude* (e.g. drafting one chapter's
  video prompt, researching a prospect's industry, writing one after-film section).
  Never route design or code to a non-Anthropic model.

---

## STEP 0 — Two front doors

### Mode 1 — Brand mode (the user has a brand)

Run the interview. Batch the questions; prefer the host's structured-question UI.
**Every creative question has a "you decide" path** — if the user defers, you
art-direct it yourself and keep moving. Never block on a design answer you can make.

1. **What are we building, and the one-line vibe?** Brand/product name, what it is,
   the feeling.
2. **Brand assets, or should I create the world?**
3. **The journey — the one continuous shot, top to bottom.** Where the camera starts
   and where it ends — the *transformation*. Or: "design the arc from my brand."
   **This is the heart of the whole build.**
4. **Real video, or pure motion?** → Lane B or Lane A. Default Lane A if unsure.
5. **(Lane B only)** Which engine? Higgsfield is the reference path; any start-image
   model works. Installed/authed? Chapter count? Credit ceiling? Draft cheap, confirm
   cost, master only on approval. No engine → Lane A.
6. **What comes after the film?** Sections, primary CTA, contact + socials.
7. **Where does it go live?** Local only, or their own Vercel.

### Mode 2 — Prospect mode (input: an industry or a specific business/ICP)

The user names an industry ("luxury med spas") or a specific prospect. You research,
position, and build a **pitch-ready spec site** they can sell. No interview — you
answer every interview question yourself from research. Fan out Claude sub-agents:

- **The prospect/industry:** what they actually sell, their highest-margin offer, who
  their dream customer is, what their current websites look like (and why they're
  forgettable), pricing norms, the emotional core of the purchase.
- **Voice-of-customer language (mandatory):** mine reviews, Reddit/forums, testimonials
  and sales pages for the ICP's own words — their pains ("drowning in…"), fears (what
  happens if nothing changes), hopes and dreams (the after-state they describe), and
  objections. Build a mini language library: 10–15 verbatim-flavoured phrases. **Every
  beat and every headline draws from this library** — the visitor should feel read,
  not written at. Never invent statistics or testimonials for a real prospect.
- **The industry's visual codes:** materials, environments, colours, textures the
  audience already associates with premium in this space — the film's world is built
  from these.
- **A named local/real prospect (if given):** their branding, services, reviews,
  photos of their actual space/product — the site must feel custom-built for them.

**Positioning law:** the hero and the film sell the *prospect's* grand-slam offer to
*their* ICP. The site is the thing they wish they had, never a demo about you or a
"report". Copy is written as if their best copywriter wrote it. Then proceed through
Steps 1–2 exactly as brand mode, pitching concepts back to the user before building.

---

## STEP 1 — Pitch concepts back (before building anything)

From the interview or research, develop **2–3 named creative concepts** and pitch
them. Rules:

- Lead with your **recommended** concept, explicitly marked "(Recommended)".
- Each concept gets a *concrete what-you-actually-see walkthrough* — narrate the
  scroll on a phone: what the visitor sees at the top, what happens as they scroll,
  what each chapter shows, how the film resolves.
- **Each concept names its WOW moments** (from the kit in `references/wow.md`): which
  scroll station(s), what the finale payoff is, what the sound world is, what the
  preloader does. A concept with no WOW moments is not a concept.
- Name each concept (a title is half the sell), state the **style** (Step 1.5) with
  one line of why it fits this ICP, the lane, the chapter count, and (Lane B) the
  estimated credits. Concepts may differ in style — that's often the real choice.
- **Optional second-model sparring (if available):** if a second frontier-model CLI
  exists on the machine (`codex`, `gemini`…), hand it the concepts *as text* to attack
  and to propose one wildcard. Strategy critique only — it never writes copy, code, or
  design; you arbitrate and author. If unavailable, skip silently.
- Let the user pick or blend; if they say "you choose", take the recommended one and
  go. (Prospect mode with "just build it": same — recommended concept, go.)

---

## STEP 1.5 — Choose the style (the skill decides, the user can override)

Every build commits to ONE of three named styles before concepts are pitched. **You
choose it from the Step 0 answers / prospect research and defend the choice in the
pitch** — the user never has to know the taxonomy exists unless they want to overrule.

| Style | The "film" is… | Best fit signals |
|---|---|---|
| **Cinematic Film** (Lane B) | Generated footage, one continuous shot | The industry sells a *world or experience* (travel, product craft, food, fitness, real estate); strong visual codes; user has a video engine |
| **Kinetic Type** (Lane A) | The words themselves — huge typography choreographed as one continuous journey | The industry sells *authority, clarity, or a promise* (law, finance, consulting, SaaS, agencies); the VoC language is strong enough to BE the visuals; no video engine |
| **Graphic Editorial** (Lane A) | Flat colour fields, cutouts, print texture — an animated zine | The brand sells *culture, craft, or attitude* (fashion, music, hospitality, indie products); strong illustration/print heritage; wants to feel human, not polished |

Decision heuristics, in order: (1) what the purchase *feels* like to the ICP —
immersion → Cinematic, conviction → Kinetic Type, belonging → Graphic Editorial;
(2) the brand's strongest existing asset (photography → Cinematic, voice/wordmark →
Kinetic Type, illustration/print → Graphic Editorial); (3) no video engine rules out
Cinematic — and that's a feature, not a downgrade. All three styles keep the same
spine: one continuous journey, scroll stations, the WOW kit, the Conversion Law, and
the verify harness. Each Step 1 concept names its style and one line of why.

---

## STEP 2 — Art-direct the world (you, alone)

Decide and commit: palette (exact hexes), a display+body **type pairing** with real
character (never default system fonts), a logo lockup (inline SVG), the motion feel,
the sound world, and the chapter names. Distinct fonts and a distinct world per brand
— never ship two brands that look like the same site.

**Compose for portrait.** Every keyframe prompt, every beat layout, every type
decision is made at 9:16 first. Film subjects live in the centre of frame (the
portrait crop is the master; there is no wider "safe" version coming). Type is sized
in `dvh`/`svh` units with safe-area insets; primary CTAs and controls live in the
bottom third — the thumb zone.

---

## LANE A — Pure-code (default; carries Kinetic Type and Graphic Editorial)

Write a single self-contained HTML page from scratch for this brand. Load GSAP,
ScrollTrigger, and Lenis from CDN (vendor locally for production). Compose the film
from the motion vocabulary in `references/engine.md` §Pure-code — plus the style
recipes there for **Kinetic Type** (the words are the film) and **Graphic Editorial**
(the animated zine) — arranged to tell *this* brand's journey, designed at 390px-wide
first, then given its desktop adaptation. Weave in the required WOW kit (below).
Then the after-film sections + footer, verification (mobile first), and optionally
deploy.

Critical ordering law: **create ScrollTriggers for ambient/background effects AFTER
pinned scenes** — creation order is refresh order; violating this silently
mis-positions everything after a pin spacer.

## LANE B — Cinematic footage (any image-to-video engine)

Read `references/playbook.md` first — it is the law for this lane. In brief:

1. **Storyboard** the concept as N chapters (5 is the sweet spot), one continuous
   camera direction, **9:16 vertical**, subjects centre-framed.
2. **Generate the opening keyframe** (image model, 9:16), then chain N clips where
   **each clip's start image is the literal last frame of the previous clip**
   (`scripts/chain-step.sh`: generate → wait → download → extract frames → SSIM
   junction gate → auto-retry on server failures). Draft the whole chain cheap
   (480p) first; master at full res only on approval — and re-chain the master pass
   sequentially (clip N+1's start image comes from the *master* clip N, never the
   draft).
3. **Junction-gate every seam** — measured, never eyeballed. Dissolves over bad seams
   are forbidden.
4. **Assemble** with `scripts/assemble.sh` (drops duplicate junction frames, encodes
   `-fps_mode vfr`, extracts ~300 vertical frames, samples the seam colour).
5. **Build the page from scratch** around the footage: the canvas scrub engine in
   `references/engine.md` (ImageBitmap sliding window, lerped playhead, adaptive
   header, beat overlays, seam handoff, the `?jump`/`__ready` dev contract) plus the
   WOW kit. Write it for this brand; never copy a previous site.

**Pipeline the build:** clip generation is serial and slow — while the chain renders,
build the page shell, beats, after-film sections, and WOW layer against the draft
keyframe/early clips. Footage drops in at the end.

---

## THE WOW KIT (required, both lanes)

`references/wow.md` is the delight law. Every build ships, at minimum:

1. **A designed preloader** — in-world, branded, a moment (never a bare bar).
2. **At least one scroll station** — a point where the film holds and the visitor
   *acts* (hold-to-charge, drag-to-reveal, swipe) before the journey continues.
3. **A finale payoff** — the last beat lands like a game beat: particle bloom, spring
   physics CTA, HUD completion. Never a fade into a footer.
4. **Touch-reactive film** — the WebGL ripple/displacement layer over the canvas
   (Lane B) or a touch-reactive hero treatment (Lane A).
5. **Velocity-reactive grade** — scroll hard: grain/chromatic aberration/zoom kick.
6. **Sound, muted by default** — one ambient loop crossfaded per chapter + soft beat
   ticks, behind a designed toggle, unlocked on first gesture.
7. **Live `theme-color` tint** — the phone's browser chrome follows the film.
8. **Haptic ticks** on chapter junctions where supported.

Cheap flourishes worth one line of consideration, never required: a hidden easter egg,
permissionless tilt parallax. Anything beyond the kit that fits *this* brand's world:
pitch it in Step 1.

---

## THE CONVERSION LAW (beautiful AND high-converting)

The film earns attention; the structure converts it. Every build:

1. **The hero states the offer with total clarity.** Within the first viewport, in
   plain words: what this is, who it's for, the outcome. ("Hand-built 1000 m dive
   watches. Three hundred a year." beats "Built for the place light forgets" — keep
   the poetry, but only AFTER clarity is established, or under it.) If a stranger
   screenshots the hero, they can say what's being sold.
2. **The beats ARE the sales arc.** Map the film's chapters to the ICP's emotional
   journey in their own words (language library): the pain they'd use → the fear of
   staying → the turn → the after-state → the offer. Never decorative copy — and
   **never chapter labels on beats** ("Chapter II — Twilight" is authorial
   scaffolding; chapter names live only in the themed HUD readout, if anywhere).
3. **One primary CTA.** Chosen in Step 0/research (book, buy, request, join). It
   appears at the finale (the spring-physics arrival), again after the proof section,
   and at the end. Nothing else competes — no nav menus, no five equal buttons.
4. **The finale sells the outcome, not the product.** Headline = the grand-slam
   after-state; the product/offer is how they get it.
5. **Proof before the ask.** Real numbers, real testimonials, real logos when they
   exist; for fictional/spec builds, plausible placeholders clearly styled as such
   ([Client], [Result]) — fabricating proof for a real prospect is forbidden.
6. **Answer the top 2–3 objections** (from research) as designed content — a card, a
   spec row, an FAQ line — before the final CTA.
7. **Thumb-zone CTAs on mobile**, `dvh`-sized tap targets, zero dead ends: the page
   always ends on the ask.
8. **The fast path: a persistent quiet CTA.** The film is the persuasion engine, but
   conversion never requires finishing it. A small fixed CTA pill (header or thumb
   zone) fades in once the visitor commits (~8% scroll) and glides them to the ask.
   High-intent visitors buy in 10 seconds; the film is there for everyone else.
9. **The CTA lands on a real next step.** Never a dead `#` link — a booking embed,
   a short designed form (2-3 fields), or checkout. Spec builds include the designed
   form so the client sees the full conversion path.
10. **Measure or it didn't happen.** Every build ships a tiny event stub
   (`window.__convert(event)` pushing to an array/dataLayer): `cta_view`,
   `cta_click`, `station_complete`, `film_complete`, `form_submit`. Real deployments
   wire it to analytics in one line; without it, "high-converting" is a guess.

---

## THE DESKTOP ADAPTATION — the cinema stage

Desktop is not a bigger phone and not a crop. The vertical film plays centred at
roughly 40–45vw ("the stage"); the margins are alive: a blurred, darkened bleed of
the same film fills the edges, ambient particles cross the full viewport, and chapter
typography/HUD live in the margins (on mobile they overlay the film). Content
sections reflow to real desktop layouts. One frame set serves both (frames are
~720×1280 — the stage is only ~650px wide).

---

## THE DELEGATION MODEL (how tokens stay low)

| Work | Who does it |
|---|---|
| Concepts, art direction, palette, type, motion, copy, the build, design review | **You (Claude)** — never delegated |
| Prospect/industry research (Mode 2), drafting chapter video prompts, one after-film section | Claude **sub-agents**, fanned out in parallel |
| Concept sparring (optional, if a second CLI exists) | Another frontier model — strategy text only, never design |
| Frame extraction, SSIM gating, assembly, jank test, screenshots, teaser, deploy | **Pure shell — no model** (`scripts/*`) |

Fan out independent pieces concurrently; keep the taste-bearing spine on yourself.

## COST DISCIPLINE (Lane B)

1. **Audio OFF** — `--generate_audio false`. Audio ON silently ~3×'s the bill.
2. **Confirm before spending.** Quote credits before generating; show the balance
   receipt after. (Prospect mode counts too — quote before the draft chain.)
3. **Draft cheap, master once.** Whole chain at 480p/fast → approval → sequential
   re-chain at full res.
4. **Reuse the footage.** One film can power several directions.

## VERIFY (both lanes — phone first)

Implement the dev contract in every build: `?jump=<scrollY>` lands pre-scrolled with
all scroll state force-settled, and `window.__ready = true` fires only when truly
ready. Then `scripts/verify.js`:

- `mshot` — **the primary check**: phone-viewport (390×844, touch, DPR2) screenshots
  of every beat, every station, every junction, the finale.
- `shot` — desktop cinema-stage check.
- `jank --mobile` — scroll-through with 4× CPU throttle; judge p95/max, never average.
- `teaser` — record the 9:16 scroll-through MP4. **Every build ships its own
  Reels-ready promo clip.** In prospect mode this clip is half the sales asset.

**Always generate the phone-shell preview too:** `scripts/phone-shell.sh <site-dir>`
writes `phone.html` — the site framed in an iPhone shell for instant desktop
preview (`open http://localhost:<port>/phone.html`). Hand this URL to the user the
moment the site is scrollable; it's how a mobile-first build is shown on a laptop
(and on stream).

Do at least one full fine-toothed pass at the phone viewport looking for anything
flat, broken, or ordinary — the bar is jaw-drop, and "nothing is broken" does not
meet it. Never ask the user to eyeball what you can prove.

**The collision sweep (mandatory):** mshot 10-12 evenly spaced scroll positions and
READ them as a contact sheet. Hunt for: overlapping text layers, fixed chrome (pill,
HUD, sound toggle) sitting on content, headlines clipping the viewport, mid-fade
ghosting that reads as broken in a still. Layered scroll pages fail *between* the
designed moments — the sweep catches what beat-by-beat shots never will.

## DEPLOY (opt-in, their Vercel)

Build a **lean** copy first — `index.html` + vendored libs (`cp -RL`) + only runtime
`frames/`/`assets/`/audio. Never upload build intermediates (raw clips, keyframes).
Then `vercel deploy --prod --yes` from the lean dir. New Vercel projects often sit
behind Deployment Protection (a login wall) — point the user to Project → Settings →
Deployment Protection; don't change their security settings for them.

## GUARDRAILS

- **Zero personal data ships with this skill** — no API keys, no accounts, no
  personal paths. Never bake credentials in.
- Design + build stay on Claude. Mechanical work goes to code; design never does.
- Confirm credits before spending; show the receipt after.
- One continuous shot; one world per brand; no visible seams; no dissolve masking.
- Prospect mode: never impersonate the prospect or publish under their name — the
  spec site is a pitch asset the user presents, and it stays on the user's hosting.
- Respect `prefers-reduced-motion`: serve the static editorial fallback (key frames +
  full copy), not a broken film.
- Reference files: `references/playbook.md` (footage law), `references/engine.md`
  (build mechanics), `references/wow.md` (delight law), `scripts/chain-step.sh`,
  `scripts/assemble.sh`, `scripts/verify.js`.
