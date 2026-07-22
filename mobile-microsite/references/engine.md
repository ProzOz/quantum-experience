# Engine recipes — how to build the page (both lanes, mobile-first)

Not a template. These are the load-bearing mechanics you write *into* each bespoke
build. Everything else — markup, styling, motion shape, copy — you design fresh per
brand. The delight layer (preloader, stations, ripple, sound, finale…) lives in
`wow.md`; this file is the chassis it bolts onto.

---

## Layout law (portrait first)

- Design at 390×844 first; the desktop cinema stage (below) is the adaptation.
- Viewport units: `100dvh` for the sticky stage (iOS URL-bar-proof), `svh` for
  anything that must never resize mid-scroll. Never bare `100vh` on mobile.
- `padding: env(safe-area-inset-*)` on fixed chrome; primary CTAs, the sound toggle,
  and station controls live in the **bottom third** — the thumb zone.
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  — `viewport-fit=cover` or safe-area insets read as 0.
- Type scales in `dvh`/`vw` clamps: `font-size: clamp(2.6rem, 9dvh, 7rem)` style.

## Scroll feel (two physics, one page)

- **Touch devices: native momentum scroll.** Lenis wheel-lerp under a thumb feels
  wrong and fights iOS. Detect `matchMedia('(pointer: fine)')` — initialise Lenis
  only there; on touch the film is driven straight from the native scroll position
  (the frame-index lerp already smooths it).
- **Chapter magnetism (touch):** never CSS `scroll-snap` on the tall driver — it
  fights the sticky stage and momentum. Instead, on scroll settle (no scroll events
  for ~120ms), if progress is within ~4% of a chapter junction, glide it home with a
  ~350ms JS-animated `scrollTo` (easeOutQuint). Cancel instantly on any new touch.

---

## Scrub engine (Lane B) — canvas + frames, never `<video>`

`<video currentTime>` scrubbing stutters (seek latency). The only jank-free path:
pre-extracted JPEG frames drawn to a full-viewport `<canvas>`, driven by scroll.

**Structure:** a tall scroll driver (`~170vh per chapter`, e.g. `850vh` for 5)
containing a `position:sticky; top:0; height:100dvh` stage with the canvas +
overlays. Film progress:

```js
const r = filmScroll.getBoundingClientRect();
const p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
```

**Cover-fit draw (portrait frames, any viewport):** frames are ~720×1280. Draw
cover-fit so phone gets full-bleed and the desktop stage crops nothing important
(subjects are centre-framed by storyboard law):

```js
const s = Math.max(cw / fw, ch / fh);              // canvas w/h, frame w/h
ctx.drawImage(bmp, (cw - fw * s) / 2, (ch - fh * s) / 2, fw * s, fh * s);
```

**Lerped playhead** (this is the butter — direct mapping feels mechanical):

```js
currentFrame += (target - currentFrame) * 0.14;   // target = p * (FRAME_COUNT - 1)
```

**The anti-jank core — ImageBitmap sliding window.** `drawImage(HTMLImageElement)`
forces a *synchronous* JPEG decode on the main thread at first paint and again after
browser cache eviction — those decode spikes are the "frame-by-frame glitchy" feel.
Decode off-thread around the playhead so every draw is a pure GPU blit:

```js
const bitmaps = new Map(), decoding = new Set();
const B_AHEAD = 18, B_KEEP = 28; let bmpCenter = -999;
function ensureBitmaps(center){
  if (Math.abs(center - bmpCenter) < 3) return;
  bmpCenter = center;
  const lo = Math.max(0, center - B_AHEAD), hi = Math.min(FRAME_COUNT - 1, center + B_AHEAD);
  for (let i = lo; i <= hi; i++){
    if (bitmaps.has(i) || decoding.has(i) || !images[i]) continue;
    decoding.add(i);
    createImageBitmap(images[i]).then(b => {
      decoding.delete(i);
      if (Math.abs(i - bmpCenter) > B_KEEP){ b.close(); return; }
      bitmaps.set(i, b);
      if (i === displayed) drawFrame(i, true);      // repaint if the shown frame upgraded
    }).catch(() => decoding.delete(i));
  }
  for (const k of Array.from(bitmaps.keys()))
    if (k < center - B_KEEP || k > center + B_KEEP){ bitmaps.get(k).close(); bitmaps.delete(k); }
}
// draw: prefer bitmaps.get(idx), fall back to nearest loaded HTMLImageElement
```

Call `ensureBitmaps(Math.round(currentFrame))` every tick, **pre-warm around frame 0
at boot**, and cap `devicePixelRatio` at **1.5** (2.0 doubles blit cost for invisible
gain). The window + `close()` discipline is also the iOS memory law: iPhone caps
total canvas memory (~a few hundred MB) and *silently blanks canvases* past it —
never hold all frames decoded, never skip `close()`.

**Frame loading:** concurrency-capped pump (~10 in flight) into an array — first
chapter first, so the preloader (wow.md §1) can hand off to a live hero fast — with a
`nearestFrame()` fallback (scan outward from the requested index) so a missing frame
never blanks the canvas. Frame files are `f_0001..f_NNNN`; 0-based index `i` → file
`f_(i+1)` (`assemble.sh` prints `FRAME_COUNT`).

Two field lessons, both invisible until measured:
- **Draw fallbacks prefer the nearest *decoded bitmap*** over any `HTMLImageElement`
  — when fast scroll outruns the decode window, falling back to an Image is a
  synchronous main-thread JPEG decode (a 100ms+ spike every time). A one-frame-stale
  bitmap is invisible behind the lerp; the spike is not.
- **Initialise `displayed = -1`, never 0** — a `displayed=0` init silently skips the
  first `drawFrame(0)` (index equality) and a fresh load shows a black canvas until
  the first scroll. `?jump` screenshots force-draw and will never catch this; test a
  fresh no-param load too.

## The cinema stage (desktop adaptation — not a bigger phone)

At `(min-width: 1024px) and (pointer: fine)` the vertical film becomes a centred
**stage** and the margins come alive:

- **Stage:** the film canvas centred at `min(42vw, 700px)` wide, full `100dvh` tall,
  cover-fit. Optionally a hairline luminous frame / soft glow that fits the world.
- **Bleed:** a second, cheaper canvas behind it, full-viewport, drawing the *same
  frame* stretched, under `filter: blur(60px) brightness(.35) saturate(1.3)` — the
  film's own light floods the page edges. Draw it at 1/8 resolution; blur hides it.
- **Margins live:** chapter HUD/readout in one margin, beat typography can step into
  the margins (on phone the same beats overlay the film), ambient particles cross the
  full viewport. The stage is the screen; the margins are the theatre.
- After-film content reflows to real desktop layouts — never a stretched phone column.

## Beat overlays (copy over the film)

Absolute-positioned overlays with progress envelopes, driven from the same tick:

```html
<div class="beat" data-in="0.16" data-peak="0.235" data-out="0.31"><h2>…</h2></div>
```
```js
function beatAlpha(b, p){
  if (p < b.in || p > b.out) return 0;
  if (p < b.peak) return (p - b.in) / Math.max(1e-4, b.peak - b.in);
  if (b.out > 1.5) return 1;                    // finale: data-out="2" never fades
  return 1 - (p - b.peak) / Math.max(1e-4, b.out - b.peak);
}
// alpha → style.opacity, plus a small translateY against scroll direction
```

Hero beat must be visible at scroll 0: `data-in="-0.1" data-peak="0"`. If the finale
frame is a centred product/subject, anchor the finale copy low or in the stage
margins so the subject stays hero.

## Adaptive header + live theme-color

Sample the drawn frame's top strip every ~180ms into a 16×4 offscreen canvas, average
luminance, toggle an `.on-light` class (threshold ≈ 138). All header colours run
through `currentColor` so one class flips everything.

**Same sampler, second output:** write the sampled average colour into
`<meta name="theme-color">` (throttled) for Chrome Android + iOS Safari ≤18, **and**
add the `scroll()`-timeline body-background animation for iOS Safari 26+, which
ignores the meta — full dual pattern in wow.md §6. Pair with a chapter readout HUD
(label + thin progress bar), or theme it (altimeter, depth gauge, fuel — wow.md
finale completes it).

## Seam handoff (film → content, no visible line)

The assembly script samples the film's final-frame bottom-patch colour. Start the
next section's background **at exactly that hex**, and add a bottom-fade overlay on
the film stage that ramps in over the last ~8% of progress (`(p - 0.92) / 0.08`).
Fade the grain + vignette out with the same ramp. If the film ends dark and the
content is light, build a tall gradient "landing zone" that melts dark → brand-light
over the first content block.

## Ambient hero layer (optional, free, sells the opening)

Themed canvas particles (snow glisten, gold pollen, embers, plankton) over the static
first frame, fading out across the first ~7% of scroll: one 32px offscreen
radial-gradient sprite, `drawImage` per particle with per-particle depth
(size/speed/alpha), sin-based twinkle or glow pulse. Never `shadowBlur` (expensive).
Stop rendering entirely once alpha hits 0. Skip under `prefers-reduced-motion`.

## Reduced-motion fallback (a page, not an apology)

Under `prefers-reduced-motion`, or if frames fail to load: swap to a static editorial
page — 4-5 curated key frames as full-bleed images with the same copy and CTAs, no
scrub, no stations. Design it; don't let it be a blank hero.

## The dev contract (verification hooks — implement in every build)

```js
const JUMP = new URLSearchParams(location.search).get('jump');
if (JUMP !== null) history.scrollRestoration = 'manual';   // and skip smooth-scroll init
// after everything is loaded and settled:
if (JUMP !== null){ scrollTo(0, +JUMP || 0); /* recompute progress, draw, tick once */ }
window.__ready = true;
```

`?jump=<y>` must land pre-scrolled with all scroll-driven state force-settled (for
pure-code builds: `ScrollTrigger.update()` then set each scrubbed animation's
`totalProgress` explicitly). **"All state" includes velocity-derived variables** —
zero the velocity, aberration/registration-drift, and skew vars on a jump landing,
or every screenshot carries a motion artefact live scrolling would never show (a
jump is not a fast scroll). Stations must not block a `?jump` landing — jump past a
station lands it in its completed state. `__ready` gates the screenshot harness. Hide
any cursor-follower until the first real `mousemove` or it photobombs captures at
(0,0).

Jank meter for the console: track per-frame rAF deltas, log `max` every 2s. Judge
p95/max, never average fps — a 60fps average hides 80ms decode spikes perfectly.

---

## Pure-code film (Lane A) — the motion vocabulary

The "film" is a sequence of scroll-driven scenes, composed at portrait first. Wire
Lenis into GSAP's ticker **on fine-pointer devices only** (see Scroll feel):

```js
if (matchMedia('(pointer: fine)').matches){
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
```

Vocabulary to compose from (pick what tells *this* brand's journey):
- **Char-split hero reveal** — split the wordmark into spans, stagger
  `yPercent:120 → 0` with `power4.out`.
- **Pinned scrubbed scenes** — `pin: true, scrub: true, end: '+=140%'` timelines
  (a growing/rotating form, a blend "vortex", a mask opening to full-bleed). Size
  pinned stages in `dvh`.
- **Horizontal pinned run** — translate a `width:max-content` track by
  `-(scrollWidth - innerWidth)`; child parallax via `containerAnimation`. Works with
  native touch scroll. Use `invalidateOnRefresh: true`.
- **Clip-path reveals** — `inset(0 0 100% 0) → inset(0)` on scroll for editorial rows.
- **Velocity-skew** — skew a ticker/marquee by `ScrollTrigger.getVelocity()` clamped.
- **Counters** — `once: true` triggers with `snap: { textContent: 1 }`.
- **Marquee drift** — `xPercent: -50, repeat: -1` on a doubled row.

Then layer the WOW kit (wow.md) — Lane A builds still get the preloader, a
touch-interactive scene, velocity grade, sound, theme-color, and the finale payoff.

### Style recipe — Kinetic Type (the words ARE the film)

One continuous *typographic* journey: the page reads as a single camera move through
language. Mechanics on top of the vocabulary above:
- **A persistent trajectory**, not disconnected scenes: each pinned scene hands off
  scale/position to the next (end one scene zoomed INTO a counter-form or a period,
  open the next inside it) — that's the "one unbroken shot" in type.
- **Scale is the terrain:** hero words at 30-60vw, journeys that dive into a letter's
  negative space, sentences that assemble word-by-word on scroll (char/word spans,
  scrubbed staggers), numbers that grow into full-viewport walls.
- The VoC language library IS the footage — the beats aren't captions over visuals,
  they're the visuals. Choose a display face strong enough to hold a full viewport.
- Stations go physical on the type itself: drag a word apart, hold to set a weight
  (variable-font axis animating), release to slam a stamp down (screen shake).
- Touch layer: type-reactive — letters repel/attract around the finger, or a
  highlight sweeps the glyphs under it. Never a water ripple.

### Style recipe — Graphic Editorial (the animated zine)

Flat colour fields, cutout subjects, print memory — a magazine that plays like a
film. Mechanics:
- **Scenes are spreads:** full-bleed colour fields (2 inks + paper) that wipe/slide
  into each other with hard edges (clip-path), never soft dissolves. The continuous
  journey = one object or motif (a cutout, a stamp, a numeral) travelling through
  every spread via FLIP/pinned handoffs.
- Texture is load-bearing: grain on every field, halftone shadows, registration
  offsets on display type, paper-edge borders on images. Duotone all photography
  toward the palette.
- Cutout subjects collide with type (subject clips INTO the hero word), stickers/
  stamps slap in with spring physics, marquees and tickers carry meta copy.
- Stations: peel a sticker, drag a torn-paper edge, hold to ink a stamp.
- Touch layer: a halftone bloom or ink-spread where the finger lands.

Both recipes keep the full spine: driver + sticky stage (or pinned scenes), beats as
the sales arc, stations (diegetic, industry-matched), the WOW kit, the Conversion
Law, `?jump`/`__ready`, and phone-first verification. Style changes the world, never
the machine.

**Ordering law (silent killer):** ScrollTriggers are refreshed in *creation order*.
Create all pinned scenes **first**, ambient/background triggers **after** — otherwise
positions computed before pin spacers exist are silently wrong (effects fire
thousands of pixels early).

Performance floor (enough to protect the illusion, no more): GPU-only properties
(transform/opacity), `will-change` on the few moving nodes, no layout-thrashing reads
in tickers. Same dev contract + jank meter as Lane B.
