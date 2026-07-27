/* PROTOTYPE — throwaway. "Easier, but the mechanic feels like shit."
 *
 * Difficulty is settled. This asks a different question: which MECHANIC is
 * legible in the hand? Three hypotheses for why holding-to-drive on a fast
 * Bloch sphere feels bad:
 *
 *   1. Too fast to read. The tip moves at up to omega*R px/s. At omega=11 and
 *      R=170px that is ~1900 px/s, crossing the sphere in under 0.2s. You
 *      cannot see cause and effect, so you hold and hope.
 *   2. The 3D projection is unreadable. Depth on a wireframe sphere is
 *      ambiguous; you end up reading the number, not the picture.
 *   3. Hold-duration is mushy. One analog axis on a touchscreen. Rhythm games
 *      are built on WHEN you tap, not how long you hold.
 *
 * KEY UNLOCK: ADR-0003 pinned omega to 9..13 because slower made targets
 * unreachable inside the window. Targets are now generated as the endpoint of a
 * real input word, so they are reachable at ANY omega. That constraint is gone,
 * and omega is free to be tuned for legibility instead of for a solver.
 *
 * This script re-tunes the bar for the slowed configs so difficulty does not
 * collapse when the speed drops.
 *
 * Run: node prototype-pulse/pulse-feel.js
 */

'use strict';

const SUB_DT = 1 / 120;

function step(s, omega, drive, dt) {
  const nn = Math.hypot(drive, omega);
  const th = nn * dt, c = Math.cos(th / 2), sn = Math.sin(th / 2);
  const u = -sn * (omega / nn), v = -sn * (drive / nn);
  const [ar, ai, br, bi] = s;
  return [c * ar - u * ai - v * bi, c * ai + u * ar + v * br,
          -v * ai + c * br + u * bi, v * ar + c * bi - u * br];
}
const bloch = ([ar, ai, br, bi]) => [2 * (ar * br + ai * bi), 2 * (ar * bi - ai * br),
                                     ar * ar + ai * ai - br * br - bi * bi];
const fid = (s, t) => { const r = bloch(s); return (1 + r[0] * t[0] + r[1] * t[1] + r[2] * t[2]) / 2; };

/* ── HOLD mode: a per-substep drive bit ────────────────────── */
function holdWord(subs, minSeg) {
  const b = [];
  let bit = Math.random() < 0.5 ? 1 : 0;
  while (b.length < subs) {
    const len = minSeg + Math.floor(Math.random() * minSeg * 2.5);
    for (let i = 0; i < len && b.length < subs; i++) b.push(bit);
    bit ^= 1;
  }
  return b;
}

/* ── TAP mode: hard 90-degree X pulses at chosen instants ──── */
function tapWord(subs, cfg) {
  const gapMin = Math.round(cfg.minGapMs / 1000 * 120);
  const pulse = Math.round(cfg.pulseSubs);
  const bits = new Array(subs).fill(0);
  let t = Math.floor(Math.random() * gapMin);
  while (t < subs) {
    for (let i = 0; i < pulse && t + i < subs; i++) bits[t + i] = 1;
    t += pulse + gapMin + Math.floor(Math.random() * gapMin * 2);
  }
  return bits;
}

function run(s, bits, omega, drive) {
  let best = 0, cur = s;
  for (const b of bits) cur = step(cur, omega, b ? drive : 0, SUB_DT);
  return cur;
}
function runBest(s, bits, omega, drive, t) {
  let best = 0, cur = s;
  for (const b of bits) { cur = step(cur, omega, b ? drive : 0, SUB_DT); best = Math.max(best, fid(cur, t)); }
  return best;
}

function makeTarget(state, subs, cfg, word) {
  const idle = bloch(run(state, new Array(subs).fill(0), cfg.omega, cfg.drive));
  const here = bloch(state);
  const near = (a, b) => (1 + a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / 2;
  let bT = null, bW = null, bC = Infinity;
  for (let k = 0; k < 50; k++) {
    const w = word(subs, cfg);
    const t = bloch(run(state, w, cfg.omega, cfg.drive));
    const c = Math.max(near(t, idle), near(t, here));
    if (c < bC) { bC = c; bT = t; bW = w; }
    if (c < 0.8) return { t, w };
  }
  return { t: bT, w: bW };
}

const BARS = [0.70, 0.80, 0.88, 0.93, 0.96, 0.99];
const pf = (x) => (100 * x).toFixed(1).padStart(5);

function measure(name, cfg, word, windowMs, nT = 250, per = 16) {
  const subs = Math.round(windowMs / 1000 * 120);
  const bests = [];
  let s = [Math.cos(0.3), 0, Math.sin(0.3), 0];
  for (let k = 0; k < nT; k++) {
    const { t, w } = makeTarget(s, subs, cfg, word);
    for (let j = 0; j < per; j++) bests.push(runBest(s, word(subs, cfg), cfg.omega, cfg.drive, t));
    s = run(s, w, cfg.omega, cfg.drive);
  }
  const rate = (bar) => bests.filter(x => x >= bar).length / bests.length;
  const tipPx = cfg.omega * 170;
  const drivePx = Math.hypot(cfg.omega, cfg.drive) * 170;
  console.log(`\n${name}  (window ${windowMs}ms)`);
  console.log(`  tip speed: ${tipPx.toFixed(0)} px/s free, ${drivePx.toFixed(0)} px/s driven`
    + `   precession period ${(2 * Math.PI / cfg.omega).toFixed(2)}s`);
  console.log('  bar   | ' + BARS.map(b => (100 * b).toFixed(0).padStart(5)).join(' |'));
  console.log('  clear | ' + BARS.map(b => pf(rate(b))).join(' |'));
  return rate;
}

console.log('=== legibility budget ===');
console.log('  A phone tip is comfortably trackable up to roughly 600 px/s.');
console.log('  Current shipped build: omega=11 Omega=14 -> 1870 free / 3026 driven px/s.\n');

console.log('=== HOLD mode, slowed so cause and effect are visible ===');
measure('omega=3.0 Omega=3.8', { omega: 3.0, drive: 3.8, minSeg: 12 }, (n, c) => holdWord(n, c.minSeg), 2200);
measure('omega=4.0 Omega=5.1', { omega: 4.0, drive: 5.1, minSeg: 12 }, (n, c) => holdWord(n, c.minSeg), 1800);
measure('omega=5.0 Omega=6.4', { omega: 5.0, drive: 6.4, minSeg: 12 }, (n, c) => holdWord(n, c.minSeg), 1500);

console.log('\n\n=== TAP mode: hard 90-degree X pulses ===');
console.log('  Only the smooth precession has to be tracked; the pulse reads as a jump.');
console.log('  So omega can stay higher without losing legibility.');
for (const [om, ms] of [[4, 2400], [5, 2000], [6, 1800]]) {
  const drive = 50;                       // hard pulse: Omega >> omega
  const pulseSubs = (Math.PI / 2) / drive * 120;
  measure(`omega=${om} hard pulse (${(pulseSubs / 120 * 1000).toFixed(0)}ms, 90deg)`,
    { omega: om, drive, pulseSubs, minGapMs: 180 }, tapWord, ms);
}
