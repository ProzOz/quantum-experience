# The Scroll-Film Playbook (Lane B — cinematic footage)

Hard-won rules for making the whole page one continuous generated film. These are a
floor, not a ceiling — break them knowingly, never by accident.

## 1. Vertical-first law
The film is **9:16 native**. Every keyframe and every clip is generated at `9:16`;
frames are extracted vertically (~720×1280) and serve BOTH phone (full-bleed) and
desktop (the ~650px-wide cinema stage — see engine.md §Stage). There is no separate
landscape master and no "crop it for mobile" step, in either direction. Compose
centre-frame: the portrait frame IS the master composition. A deliberate 16:9
desktop-only build is allowed but is the exception and must be chosen consciously.

## 2. Footage-first law
The film is the source of truth; the website is a player. Design the camera arc first
(one continuous journey, ~5 chapters), then build the page around whatever footage
actually comes back. Never storyboard the site and force footage to match — footage
drifts, copy is cheap to move. Plan where the **scroll stations** land (wow.md) at
storyboard time: a station wants a held moment in the footage (a hover, a still
composition), not the middle of a fast move.

## 3. Chaining law (flawless joins)
Each clip's `--start-image` is the **ffmpeg-extracted literal last frame** of the
previous clip — not a lookalike keyframe, the actual pixels:

```bash
ffmpeg -sseof -0.05 -i clipN.mp4 -update 1 -q:v 1 clipN-last.png
higgsfield generate create seedance_2_0 --prompt "..." \
  --start-image clipN-last.png --duration 5 --resolution 1080p \
  --mode std --aspect_ratio 9:16 --generate_audio false
```

Only the opening keyframe (image model, 9:16) starts the chain; every later
start-image is a real last frame. Keep one continuous camera direction (always
descending / always pushing in) — reversals read as cuts. Uniform clip length =
constant scrub speed.

**Product-finale law (brand bias).** Video models are heavily biased toward famous
real products — "luxury dive watch" WILL return a Rolex, logo and all, and text-only
negatives ("no logo") don't stop it. For any finale that resolves on a product:
generate the product as a **still first** (image models obey no-branding constraints
reliably), verify it's clean, then chain the final clip with `--start-image` (the
previous last frame) **plus `--end-image` (the approved product still)** — the clip
interpolates onto exactly the design you approved. Never ship a real trademark on a
fictional brand.

**The master pass re-chains.** Draft-tier and master-tier clips end on different
pixels. When mastering, clip N+1's start image comes from the **master** clip N —
the master pass is sequential by nature. Never feed a draft last-frame into a master
generation.

## 4. The junction gate (measured, never eyeballed)
```bash
ffmpeg -i A-last.png -i B-first.png -lavfi ssim -f null - 2>&1 | grep All
```
- **≥ 0.88 pass** · 0.80–0.88 watch it in motion · a true fail is **structural**.
- SSIM under-reads on stochastic texture (clouds ~0.66, embers ~0.72, liquid caustics
  ~0.60 can all be seamless). The number says *where* to look; the side-by-side decides.
- The #1 real failure is **grade/geometry drift** (an invented sunrise, a new horizon).
  Fix by regenerating with: *"Continue the exact same shot from the reference frame,
  identical framing, identical colour grade. Do not change the colour grade."*
- **Dissolves/crossfades over a bad junction are forbidden** — the scrub lets the user
  park on the seam, which exposes the mask instantly. Fix the join, don't hide it.

## 5. Billing truths (attribute per-job, never by shared balance delta)
- `--generate_audio false` is *the* cost lever — audio ON silently ~3×'s the bill.
- Measured price ladder per 5s clip (confirmed against real transactions 2026-07):
  1080p/std ≈ 45 · 720p/std ≈ 22.5 · 720p/fast ≈ 17.5 · 480p/fast ≈ 7.5. 10s = 2×5s.
  2k nano-banana still ≈ 2.
- **Concurrency lies: never attribute spend by before/after balance delta when
  anything else might be generating on the account** (parallel builds, other
  sessions). A sibling build once "measured" 2.5–3× overbilling that was really
  three concurrent chains sharing one balance. The truthful source is
  `higgsfield account transactions` — per-job rows; attribute YOUR jobs by
  timestamp/model, and quote budgets from the table above.
- **Draft the whole chain at 480p/fast to validate, then re-chain approved prompts at
  1080p** (sequentially — see §3). A regen at draft tier costs a fraction.
- ~15% of jobs fail server-side with no reason and don't bill — `chain-step.sh`
  auto-retries the create+wait cycle up to 3×.

## 6. Pipeline the build (don't idle while clips render)
Generation is serial and slow (5 clips × minutes each). While the chain renders,
build everything that doesn't need final footage: page shell, type, beats and copy,
after-film sections, the WOW layer (preloader, stations, ripple, sound, finale),
using the keyframe + early clips as stand-ins. Footage frames drop in at the end.
This roughly halves wall-clock time.

## 7. Assembly
- Concat dropping the duplicate junction frame (`select='gte(n,1)'` on clips 2+), and
  **always `-fps_mode vfr`** on the master encode — default CFR sync pads ~5 dup frames
  per junction = frozen scrub zones.
- Extract every 2nd frame to ~300 JPEGs, portrait-scaled to 1280px tall, `-q:v 4`.
  (Dark, grainy footage nearly doubles JPEG bytes — this stays light without visible
  loss at phone-bleed / stage size.)
- Frame naming contract: files are `f_0001..f_NNNN`; the engine's 0-based frame `i`
  maps to file `f_(i+1)`. `assemble.sh` prints `FRAME_COUNT` — trust it.
- Sample the final frame's centred bottom-patch colour → the seam hex for the
  film→content handoff.

`scripts/chain-step.sh` and `scripts/assemble.sh` do all of this.

## 8. The scrub engine (why it's jank-free)
- **Canvas + pre-extracted JPEGs**, never `<video currentTime>` scrubbing (seek stutter).
- **ImageBitmap sliding window**: `drawImage(HTMLImageElement)` forces a *synchronous*
  JPEG decode on first paint (and after cache eviction) — that decode spike *is* the
  frame-by-frame jank. `createImageBitmap` decodes off-thread; keep a window of decoded
  bitmaps around the playhead (±18 ahead, evict/close beyond ±28) so every draw is a
  pure GPU blit.
- Lerp the frame index (`current += (target-current)*0.14`) for butter. Cap DPR ~1.5.
- A concurrency-capped image pump; `nearestFrame()` fallback so a missing frame never
  blanks the canvas.
- **Measure jank with rAF deltas (p95/max), not average fps.** Smoothness is not a
  perf nicety here — jank kills the one-continuous-shot illusion, which is the product.

## 9. Verification harness (phone first)
Host preview panes throttle hidden tabs (rAF freezes → stale screenshots). The
reliable path: puppeteer-core + system Chrome + the page dev-contract
(`?jump=<scrollY>` lands pre-scrolled and force-settled; `window.__ready = true` only
after frames are decoded and settled). `scripts/verify.js`:
- `mshot` (390×844 touch, DPR2) — the primary check. Shoot every beat, every station,
  every junction, the finale.
- `shot` — the desktop cinema-stage check.
- `jank --mobile` — 4× CPU-throttled scroll-through; judge p95/max.
- `teaser` — records the 9:16 scroll-through MP4. Every build ships its own
  Reels-ready promo clip; in prospect mode it's half the sales asset.
Hide any cursor-follower until first real mousemove or it photobombs captures at 0,0.

## 10. Governance
Design taste and design code are done by the Claude model only. Mechanical steps
(ffmpeg, SSIM, puppeteer, vercel) are pure code — no model. Quote credits before
spending; show the receipt after. One continuous shot, one world per brand.
