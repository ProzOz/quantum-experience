# The WOW kit (both lanes) — the delight law

Every build ships items 1–8. These are what make someone film their screen. Design
each one *in-world* — the mechanics below are chassis; the skin is invented fresh per
brand. The engine chassis (scrub, stage, beats, HUD) lives in `engine.md`.

The test of every moment: **would it land in a 20-second phone-screen clip?** If a
feature is invisible in that clip, it's polish, not WOW — spend the effort elsewhere.

---

## 1. The preloader — a designed moment, not a bare bar

The first thing every visitor sees. Build it from the brand's world: a wordmark that
fills like liquid, a depth gauge pressurizing, a shutter opening, a fuse burning.

Mechanics: progress = real loaded-frame count, not a fake timer. Gate the hero on the
**first act only** (~35% of frames) and keep pumping behind it — a preloader that
waits for everything reads as broken. Exit by *transition into the hero* (the loader
lifts/parts/dissolves to reveal frame 0 already live), never a hard swap. Fire
`window.__ready` only after the exit transition settles.

## 2. Scroll stations — the visitor acts, the WORLD answers

At 1–2 points, the film holds and a gesture is demanded before the journey continues.
This is the single biggest jump from "watching" to "playing" — IF the gesture is
**diegetic**. Two laws before any mechanics:

- **The gesture must BE the story action, and the film must respond WHILE it
  happens.** Holding is diving deeper (the film keeps scrubbing slowly, water
  darkens, sound deepens); dragging is physically pulling the thread (it bends with
  the finger, snaps taut); releasing is the hammer strike (flash, shake, ring).
  A progress ring filling next to a frozen film is UI, not experience — **the
  generic hold-ring-with-label is banned as a default.** If the world doesn't
  change during the gesture, the station isn't done.
- **Never reuse a station mechanic across builds.** The mechanic is art direction,
  invented fresh from this brand's world in Step 1/2, same as the palette. Two
  brands with the same gesture = the same site.
- **The gesture is the industry's core action.** Ask: what is the ONE physical act
  this business does for its customer? A dive brand: you dive. A coach: you break
  through. An ops tool: you pull order from chaos. A studio: you strike/forge/ship.
  The visitor should finish the gesture having *done the thing the brand promises* —
  that's what makes the moment land in the ICP's gut, not just their eyes.

Release-early behaviour is part of the story too (the ocean buoys you back up, the
thread springs back, the hammer cools) — design it, don't just decay a meter.

**The never-fight, never-trap law (iOS):** never block native scroll to make a
station. The robust pattern is a **progress plateau**:

- Film progress `f = locked ? min(P, S_POINT) : P` — while locked, scroll continues
  natively but the film holds at the station frame and the station UI breathes.
- The gesture target is a **small control in the thumb zone** (a ring, a handle) —
  never a full-screen touch shield; `preventDefault` only on that control
  (`touch-action:none` on it), so page scroll stays free everywhere else.
- Hold-to-charge: `pointerdown` fills 0→1 over ~1.1s (rAF), release decays. On
  completion: unlock + haptic + sound tick + a particle burst; the lerped playhead
  animates the film's catch-up to the live scroll position — the release *whoosh* is
  the reward.
- **Auto-release** if raw progress passes the plateau by ~8–10% (the impatient are
  never trapped), and `?jump` past a station lands it completed (dev contract).
- Storyboard stations onto *held* moments in the footage (a hover, a still
  composition), never mid-move.

## 3. Touch-reactive film — the world reacts to the finger

Touching the film makes the WORLD respond — and like stations, **the response is
art direction, unique per build, never reused**. Water rings belong to a water
world only. The menu (extend it freely): refraction rings (water), a soft luminous
highlight halo that follows the finger (light worlds — a drifting glow/bloom, no
distortion), heat shimmer (fire/forge), directional thread-smear (woven/fabric),
frost crystallisation, magnetic pull. Two builds with the same touch response feel
like the same template — vary the *mechanic*, not just the colour.

**Restraint law: the effect tapers with progress.** Full strength on the hero, where
it invites play; attenuate to ~25% by a third of the way down (a `gain` uniform
driven by film progress) so it never competes with beats, stations, or the finale.
A touch effect that's still shouting at chapter four is a distraction, not delight.

Reference implementation (ripple variant — swap the displacement math per world):
the 2D film canvas becomes an offscreen source; a WebGL canvas displays it through
a fragment shader each tick:

- Upload the offscreen canvas via `texImage2D` per draw (fine at ≤DPR 1.5).
- Ripples = a `vec3[8]` uniform (x, y, age 0→1); shader displaces UVs with a
  decaying ring: `amp = (1-age) * 0.012 * exp(-ring²/0.0012) * sin(ring*90.0)`.
- Spawn on `pointerdown` and throttled `pointermove` (~90ms) — **passive listeners
  only**: the ripple reacts to the finger *while the page scrolls under it*; it never
  `preventDefault`s. One WebGL context per page (multiple contexts is a reliable iOS
  crash path).
- **Graceful degrade is mandatory:** if WebGL init throws, remove the GL canvas and
  the 2D path continues untouched. The ripple is a gift, never a dependency.
- Premium variant when the budget allows: a half-res (256–384px) ping-pong **flowmap
  FBO** accumulating pointer velocity with per-frame dissipation — trails and
  direction-aware smearing instead of rings. Same passive-overlay law applies.

Chromatic aberration and zoom ride in the same shader for free (see §4) — one
uniform each, no extra passes.

## 4. Velocity-reactive grade — the page responds to *how* you move

Track scroll velocity (lerped, decaying ~0.94/tick). Map it to:
- **Chromatic aberration** — in-shader: sample R/G/B with ±`ab*0.004` UV offsets.
- **Grain lift** — add `ab*0.12` to the grain overlay's opacity.
- **Micro-zoom** — up to ~1.05 scale (in-shader or CSS transform on the 2D path).

Scroll hard and the world strains; stop and it settles to calm. Subtle is the law:
at rest all three must be exactly zero.

## 5. Sound — muted by default, designed toggle, chapter crossfade

- One ambient loop per act (2 is plenty: e.g. surface/deep) crossfaded by film
  progress, + a soft tick/ping on chapter junctions and station completion.
- **Muted by default.** A designed toggle (equalizer bars, a sonar dot) in the thumb
  zone. First tap = create the `AudioContext` *inside the gesture handler*, play a
  1-sample silent buffer, then `resume()` — the silent-buffer kick is still the
  reliable iOS unlock. **One context per page, ever** (Safari caps at ~4 and leaks).
  The hardware mute switch kills Web Audio at OS level — sound is never load-bearing.
- Loops: decoded `AudioBuffer` + `loop=true` (never `<audio>` — it gaps on iOS) with
  per-loop `GainNode`s into one master. **Equal-power crossfade**
  (`cos(t·π/2)` / `cos((1-t)·π/2)`) via `setTargetAtTime(v, now, 0.15)` — direct
  `.gain.value` writes per tick produce zipper noise; linear crossfades dip in the
  middle.
- No audio assets? Synthesize with ffmpeg (filtered brown noise = wind/ocean/room
  tone; a faded sine + echo = a tick) — bake to ~96k AAC. Sound is worth shipping
  even when no one sends files.

## 6. Live theme-color — the browser chrome joins the film

The phone's browser UI tints with the film as the visitor descends. **Ship both
mechanisms** — support split in 2025/26:

- **Chrome Android + iOS Safari ≤18:** write the sampled top-strip average (reuse the
  adaptive-header sampler, engine.md) into `<meta name="theme-color">`, throttled.
- **iOS Safari 26+ ignores the meta entirely** and auto-samples the body/fixed-bar
  background *at render time* — JS background mutations don't re-trigger it. The one
  live path is a scroll-driven CSS animation on the body background:

```css
@supports (animation-timeline: scroll()) {
  html,body{ animation: toolbar-shift linear both; animation-timeline: scroll(root); }
}
@keyframes toolbar-shift{ 0%{background:#0c1a20} 100%{background:#030608} }
```

Author the keyframes from the film's actual chapter colours. Keep fixed bars opaque —
translucent fixed chrome makes Safari's sampling unpredictable.

## 7. Haptics — junctions you can feel

`navigator.vibrate && navigator.vibrate(8)` on chapter cross; a pattern like
`[12,60,24]` on station completion. Android-only; the guard *is* the fallback. Never
vibrate on plain scroll — junctions and completions only, or it reads as a bug.

## 8. The finale payoff — land the ending like a game beat

The last 5% of the film is the reward for the whole trip. Required shape:
- The film resolves on its hero frame (product/subject centred — storyboard law).
- **A payoff moment fires once crossing ~f=0.955 — and it must obey the premium
  law: slow, massive, luminous, physical. Uniform radial particle sprays are
  banned — they read as confetti, and confetti reads as cheap.** Premium payoffs:
  - **Light first:** a bloom/flare of the film itself — a screen-blend radial glow
    overlay or an in-shader brightness lift, swelling over ~1s and settling. The
    world exhales; nothing "pops".
  - **Matter second, with physics:** if particles join, they are FEW (30–60), large,
    soft, and obey the world's physics — plankton rises with buoyancy and drag,
    embers drift on updraft, snow settles. Velocities are slow and damped, never an
    outward explosion from a point.
  - **Sound + haptic land the beat** (a low bloom, a single pattern) when enabled.
- The CTA arrives on a **spring integrator** (no library: `v += (-y*k - v*c); y += v`
  on translateY + scale), overshooting once and settling. It is the only interactive
  element that *moves to meet you* on the whole page.
- The HUD completes in-world (depth gauge hits bottom, meter flips to a verdict
  line). The finale beat never fades out (`data-out="2"`).
- Station completions follow the same premium law: the world responds (whiteout
  breakthrough, thread-snap light pulse, strike flash + shake), never a spray.

## 9. Delight vocabulary (season to taste, 2–3 per build)

- **Magnetic buttons** — within ~80px, translate the button toward the pointer by
  ~0.25× the offset (spring back on leave). Fine-pointer only.
- **Text scramble reveal** — cycle random glyphs per character, resolving
  left-to-right over ~600ms. Use the brand's own glyph set (coordinates, digits,
  runes) — never generic matrix katakana.
- **Velocity-skewed marquee** — `skewX(clamp(velocity))` on a drifting doubled row.
- **Counters with easing** — `IntersectionObserver` once, `1-(1-t)⁴` ease, real
  numbers only (fake stats are forbidden).
- **Ambient hero layer** — themed sprite particles over frame 0, fading by ~7%
  scroll (engine.md). The hero must feel alive before the first scroll.

One-line flourishes, only when they cost nothing and fit the world: a hidden
long-press easter egg; permissionless tilt parallax (Android `deviceorientation` —
never trigger the iOS permission dialog for a garnish). **Cut before you dilute:**
three moments at full depth beat eight at half depth.

## 10. What was deliberately cut (don't re-add casually)

- **Branching scroll paths** — two extra clips of cost, breaks the scrub's
  park-anywhere contract, and confuses the one-continuous-shot story.
- **Full-screen scroll-hijack stations** — fights iOS momentum, feels broken; the
  plateau pattern above gives the same drama without the fight.
- **Autoplaying sound** — blocked by policy and hostile; the designed toggle wins.
- **Per-device frame manifests / battery guards / payload budgets** — perf machinery
  that never shows up in the clip. The anti-jank core in engine.md is the floor;
  beyond it, spend on spectacle.
