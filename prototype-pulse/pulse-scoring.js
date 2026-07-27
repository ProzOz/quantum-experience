/* PROTOTYPE — throwaway. Does the SCORING RULE fix "everything is too hard"?
 *
 * Rule A (shipped first): fidelity sampled at the buzzer. One instant decides
 *   the target. Being at 99% a frame early scores nothing.
 * Rule B (candidate): best fidelity reached at ANY instant while the target is
 *   live; touching the bar locks the hit in immediately.
 *
 * Both are deterministic — no dice either way, so ADR-0003's core claim holds.
 * Rule B is arguably closer to the ADR's own words ("steer the vector onto
 * each one") than sampling at the buzzer is.
 *
 * Also re-tests the BUDGET verdict, because the scoring rule may flip it:
 * under rule A a short window is EASIER (fewer distinct plays, guessing works);
 * under rule B a short window should be HARDER (fewer chances to touch).
 *
 * Run: node prototype-pulse/pulse-scoring.js
 */

'use strict';

const OMEGA = 11, DRIVE = 14, SUB_DT = 1 / 120, MIN_SEG = 6;

function step(s, on, dt) {
  const nx = on ? DRIVE : 0, nz = OMEGA, nn = Math.hypot(nx, nz);
  const th = nn * dt, c = Math.cos(th / 2), sn = Math.sin(th / 2);
  const u = -sn * (nz / nn), v = -sn * (nx / nn);
  const [ar, ai, br, bi] = s;
  return [c * ar - u * ai - v * bi, c * ai + u * ar + v * br,
          -v * ai + c * br + u * bi, v * ar + c * bi - u * br];
}
const bloch = ([ar, ai, br, bi]) => [2 * (ar * br + ai * bi), 2 * (ar * bi - ai * br),
                                     ar * ar + ai * ai - br * br - bi * bi];
const fid = (s, t) => { const r = bloch(s); return (1 + r[0] * t[0] + r[1] * t[1] + r[2] * t[2]) / 2; };

function humanWord(ticks) {
  const b = [];
  let bit = Math.random() < 0.5 ? 1 : 0;
  while (b.length < ticks) {
    const len = MIN_SEG + Math.floor(Math.random() * MIN_SEG * 2.5);
    for (let i = 0; i < len && b.length < ticks; i++) b.push(bit);
    bit ^= 1;
  }
  return b;
}
const runTicks = (s, bits) => { for (const b of bits) { s = step(s, b, SUB_DT); s = step(s, b, SUB_DT); } return s; };

/* score under both rules in one pass */
function play(s, bits, t) {
  let best = 0;
  for (const b of bits) {
    s = step(s, b, SUB_DT); best = Math.max(best, fid(s, t));
    s = step(s, b, SUB_DT); best = Math.max(best, fid(s, t));
  }
  return { end: fid(s, t), best, state: s };
}

function makeTarget(state, ticks) {
  const idle = bloch(runTicks(state, new Array(ticks).fill(0)));
  const full = bloch(runTicks(state, new Array(ticks).fill(1)));
  const here = bloch(state);
  const near = (a, b) => (1 + a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / 2;
  let bT = null, bW = null, bC = Infinity;
  for (let k = 0; k < 60; k++) {
    const w = humanWord(ticks), t = bloch(runTicks(state, w));
    const c = Math.max(near(t, idle), near(t, full), near(t, here));
    if (c < bC) { bC = c; bT = t; bW = w; }
    if (c < 0.85) return { t, w };
  }
  return { t: bT, w: bW };
}

const BARS = [0.70, 0.80, 0.88, 0.93, 0.96, 0.98, 0.993];
const WINDOWS = [500, 700, 900, 1200, 1600];
const pctf = (x) => (100 * x).toFixed(1).padStart(5);

function sample(ms, nTargets = 300, perTarget = 16) {
  const ticks = Math.round(ms / 1000 * 60);
  const ends = [], bests = [];
  let s = [Math.cos(17.5 * Math.PI / 180), 0, Math.sin(17.5 * Math.PI / 180), 0];
  for (let k = 0; k < nTargets; k++) {
    const { t, w } = makeTarget(s, ticks);
    for (let j = 0; j < perTarget; j++) {
      const r = play(s, humanWord(ticks), t);
      ends.push(r.end); bests.push(r.best);
    }
    s = runTicks(s, w);
  }
  const rate = (arr, bar) => arr.filter(x => x >= bar).length / arr.length;
  return { ticks, ends, bests, rate };
}

console.log('Pass rate of a RANDOM human-feasible thumb on ONE target.\n');
console.log('  A = scored at the buzzer   B = best instant reached (lock-in)\n');
console.log('window rule | ' + BARS.map(b => (100 * b).toFixed(1).padStart(6)).join(' |'));
console.log('-'.repeat(13 + BARS.length * 9));
const store = {};
for (const ms of WINDOWS) {
  const r = sample(ms);
  store[ms] = r;
  console.log(String(ms + 'ms').padStart(6), '  A |', BARS.map(b => pctf(r.rate(r.ends, b)) + '%').join(' |'));
  console.log(String('').padStart(6), '  B |', BARS.map(b => pctf(r.rate(r.bests, b)) + '%').join(' |'));
}

console.log('\n\nSurvival of a WHOLE RUN (one miss ends it), rule B, 700ms window:');
console.log('Uses the random-thumb rate as a floor — a real player is better,');
console.log('but if a random thumb cannot clear rung 1, rung 1 is not a tutorial.\n');
{
  const r = store[700];
  console.log('  bar   | per-target |  2 in a row |  4 in a row |  6 in a row');
  for (const b of BARS) {
    const p = r.rate(r.bests, b);
    console.log(`  ${(100 * b).toFixed(1).padStart(5)} | ${pctf(p)}%     | ${pctf(p ** 2)}%      | ${pctf(p ** 4)}%      | ${pctf(p ** 6)}%`);
  }
}

console.log('\n\nDoes the scoring rule FLIP the budget verdict? (bar 93%)\n');
console.log('  window | rule A (buzzer) | rule B (lock-in)');
for (const ms of WINDOWS) {
  const r = store[ms];
  console.log(`  ${String(ms + 'ms').padStart(6)} | ${pctf(r.rate(r.ends, 0.93))}%          | ${pctf(r.rate(r.bests, 0.93))}%`);
}
console.log('\n  Rule A: shorter window -> HIGHER pass rate (inverted knob, rejected).');
console.log('  Rule B: shorter window -> LOWER pass rate (a real knob again).');
