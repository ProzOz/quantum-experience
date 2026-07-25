/* PROTOTYPE — throwaway. Solver v2: human-feasible PULSE ceilings.
 *
 * Why v2 exists: v1 let the optimal player flip the thumb every 16ms, and at
 * any window >= 400ms that reaches 100% fidelity on every target. That ceiling
 * is a robot's, not a player's, so it cannot tune a difficulty ladder.
 *
 * v2 adds MIN_SEG: once you press or release, you are committed for at least
 * that many ticks. ~6 ticks (100ms) is a realistic floor for a thumb. Now the
 * ceiling means "best a human hand could do", which is what a level must be
 * tuned against.
 *
 * Run: node prototype-pulse/pulse-solve2.js
 */

'use strict';

function stepSpinor(s, omega, drive, dt) {
  const nx = drive, nz = omega;
  const nn = Math.hypot(nx, nz);
  const th = nn * dt;
  const c = Math.cos(th / 2), sn = Math.sin(th / 2);
  const u = -sn * (nz / nn), v = -sn * (nx / nn);
  const [ar, ai, br, bi] = s;
  return [
    c * ar - u * ai - v * bi,
    c * ai + u * ar + v * br,
    -v * ai + c * br + u * bi,
    v * ar + c * bi - u * br,
  ];
}

function bloch(s) {
  const [ar, ai, br, bi] = s;
  return [2 * (ar * br + ai * bi), 2 * (ar * bi - ai * br),
          ar * ar + ai * ai - br * br - bi * bi];
}

const fidelity = (s, t) => {
  const r = bloch(s);
  return (1 + r[0] * t[0] + r[1] * t[1] + r[2] * t[2]) / 2;
};

const NTH = 180, NPH = 360;   // 1 degree cells
function cellOf(r) {
  const th = Math.acos(Math.max(-1, Math.min(1, r[2])));
  let ph = Math.atan2(r[1], r[0]);
  if (ph < 0) ph += 2 * Math.PI;
  return Math.min(NTH - 1, Math.floor(th / Math.PI * NTH)) * NPH
       + Math.min(NPH - 1, Math.floor(ph / (2 * Math.PI) * NPH));
}

/* Reachable set with a minimum-segment constraint. A node's identity is
 * (sphere cell, current thumb bit, ticks-since-flip clamped to MIN_SEG),
 * because those are exactly what determine the legal futures. */
function solve(cfg) {
  const { omega, drive, ticks, target, start, minSeg, tickDt = 1 / 60, substeps = 2 } = cfg;
  const dt = tickDt / substeps;
  const key = (cell, bit, age) => (cell * 2 + bit) * (minSeg + 1) + Math.min(age, minSeg);

  let cur = new Map();
  cur.set(key(cellOf(bloch(start)), 0, minSeg), { s: start, bit: 0, age: minSeg });

  for (let t = 0; t < ticks; t++) {
    const next = new Map();
    for (const node of cur.values()) {
      const options = node.age >= minSeg ? [node.bit, node.bit ^ 1] : [node.bit];
      for (const bit of options) {
        let s = node.s;
        for (let q = 0; q < substeps; q++) s = stepSpinor(s, omega, bit ? drive : 0, dt);
        const age = bit === node.bit ? node.age + 1 : 1;
        const k = key(cellOf(bloch(s)), bit, age);
        if (!next.has(k)) next.set(k, { s, bit, age });
      }
    }
    cur = next;
  }

  let best = -1;
  for (const node of cur.values()) {
    const f = fidelity(node.s, target);
    if (f > best) best = f;
  }
  return { best, states: cur.size };
}

/* A plausible human input word: segments of random length >= minSeg. */
function humanWord(ticks, minSeg) {
  const bits = [];
  let bit = Math.random() < 0.5 ? 1 : 0;
  while (bits.length < ticks) {
    const len = minSeg + Math.floor(Math.random() * minSeg * 2.5);
    for (let i = 0; i < len && bits.length < ticks; i++) bits.push(bit);
    bit ^= 1;
  }
  return bits;
}

function replay(cfg, bits) {
  const dt = (cfg.tickDt || 1 / 60) / (cfg.substeps || 2);
  let s = cfg.start;
  for (const bit of bits)
    for (let q = 0; q < (cfg.substeps || 2); q++) s = stepSpinor(s, cfg.omega, bit ? cfg.drive : 0, dt);
  return fidelity(s, cfg.target);
}

function spread(cfg, trials = 20000) {
  const out = [];
  for (let k = 0; k < trials; k++) out.push(replay(cfg, humanWord(cfg.ticks, cfg.minSeg)));
  out.sort((a, b) => a - b);
  const at = (q) => out[Math.min(out.length - 1, Math.floor(out.length * q))];
  return { p50: at(0.5), p90: at(0.9), p99: at(0.99), max: at(0.9999) };
}

function tgt(latDeg, azDeg) {
  const th = latDeg * Math.PI / 180, ph = azDeg * Math.PI / 180;
  return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
}

const START = [1, 0, 0, 0];
const pct = (x) => (100 * x).toFixed(1) + '%';
const TARGETS = [[50, 90], [75, 130], [90, 200], [110, 300], [135, 45]];

/* ── Q1: how much does a realistic thumb cost you? ─────────── */
console.log('=== Q1: ceiling vs minimum thumb segment (omega 11, Omega 14, 700ms) ===');
console.log('  minSeg |  ms  | ceiling (median over 5 targets)');
for (const minSeg of [1, 3, 5, 6, 8, 12]) {
  const cs = TARGETS.map(([lat, az]) =>
    solve({ omega: 11, drive: 14, ticks: 42, target: tgt(lat, az), start: START, minSeg }).best);
  cs.sort((a, b) => a - b);
  console.log(`  ${String(minSeg).padStart(6)} | ${String(Math.round(minSeg / 60 * 1000)).padStart(4)} | ${pct(cs[2])}`);
}

/* ── Q2: the three candidate difficulty knobs ──────────────── */
const MIN_SEG = 6;   // 100ms committed thumb — the human floor used from here on

console.log('\n=== Q2a: KNOB "BUDGET" — shorter window (omega 11, Omega 14, minSeg 6) ===');
console.log('  window | ticks | ceiling | human p50 | p99  | headroom(ceil-p50)');
for (const [ms, ticks] of [[200, 12], [300, 18], [400, 24], [500, 30], [700, 42], [1000, 60], [1400, 84]]) {
  const cs = [], p50 = [], p99 = [];
  for (const [lat, az] of TARGETS) {
    const cfg = { omega: 11, drive: 14, ticks, target: tgt(lat, az), start: START, minSeg: MIN_SEG };
    cs.push(solve(cfg).best);
    const sp = spread(cfg, 6000); p50.push(sp.p50); p99.push(sp.p99);
  }
  const med = (a) => { a = [...a].sort((x, y) => x - y); return a[2]; };
  console.log(`  ${String(ms + 'ms').padStart(6)} | ${String(ticks).padStart(5)} | ${pct(med(cs)).padStart(7)} | ${pct(med(p50)).padStart(9)} | ${pct(med(p99)).padStart(5)} | ${(100 * (med(cs) - med(p50))).toFixed(1)} pts`);
}

console.log('\n=== Q2b: KNOB "TIGHTNESS" — how rare is each threshold? (700ms window) ===');
console.log('  (fraction of plausible human words clearing the bar; ceiling is 100% reachable)');
console.log('  thresh | angle | %words clearing | median tries to clear');
{
  const words = [];
  for (const [lat, az] of TARGETS) {
    const cfg = { omega: 11, drive: 14, ticks: 42, target: tgt(lat, az), start: START, minSeg: MIN_SEG };
    for (let k = 0; k < 20000; k++) words.push(replay(cfg, humanWord(42, MIN_SEG)));
  }
  for (const th of [0.75, 0.85, 0.90, 0.95, 0.98, 0.995]) {
    const frac = words.filter((f) => f >= th).length / words.length;
    const ang = (Math.acos(2 * th - 1) * 180 / Math.PI).toFixed(1);
    console.log(`  ${pct(th).padStart(6)} | ${(ang + '째').padStart(6)} | ${(100 * frac).toFixed(3).padStart(8)}%      | ${frac > 0 ? Math.round(1 / frac) : '>1e5'}`);
  }
}

console.log('\n=== Q2c: KNOB "COUNT" — chained targets, errors compound? ===');
console.log('  Each target starts from wherever the previous one ended.');
console.log('  Measured: p50 fidelity of target #n for a plausible human, over 6000 runs.');
{
  const CHAIN = [[75, 130], [110, 300], [50, 90], [135, 45], [90, 200], [60, 250]];
  const per = CHAIN.map(() => []);
  for (let k = 0; k < 6000; k++) {
    let s = START;
    for (let i = 0; i < CHAIN.length; i++) {
      const T = tgt(CHAIN[i][0], CHAIN[i][1]);
      const bits = humanWord(42, MIN_SEG);
      for (const bit of bits) { s = stepSpinor(s, 11, bit ? 14 : 0, 1 / 120); s = stepSpinor(s, 11, bit ? 14 : 0, 1 / 120); }
      per[i].push(fidelity(s, T));
    }
  }
  console.log('  target# | human p50 | p90');
  per.forEach((a, i) => {
    a.sort((x, y) => x - y);
    console.log(`  ${String(i + 1).padStart(7)} | ${pct(a[a.length >> 1]).padStart(9)} | ${pct(a[Math.floor(a.length * 0.9)])}`);
  });

  // Does the START state change what is reachable? (the real question for chaining)
  console.log('\n  ceiling for target 2 as a function of where target 1 left you:');
  console.log('  start lat | ceiling for target(110,300)');
  for (const lat of [10, 45, 90, 135, 170]) {
    const th = lat * Math.PI / 180;
    const st = [Math.cos(th / 2), 0, Math.sin(th / 2), 0];
    const r = solve({ omega: 11, drive: 14, ticks: 42, target: tgt(110, 300), start: st, minSeg: MIN_SEG });
    console.log(`  ${String(lat).padStart(9)} | ${pct(r.best)}`);
  }
}
