/* PROTOTYPE — throwaway. Headless solver for PULSE level tuning.
 *
 * Question it answers: for a candidate level (omega, drive strength, window
 * length, target), what fidelity is ACTUALLY reachable by a perfect player?
 * Used to check that every rung of every difficulty ladder in
 * pulse-prototype.html is clearable before the owner plays it.
 *
 * Method: a pure state of one qubit is a point on the Bloch sphere, so the
 * state space is 2D. Discretise the sphere and propagate the exact reachable
 * SET forward one decision tick at a time under both inputs (hold / release).
 * This is not a beam search with a myopic ranking — it is the reachable set,
 * so the reported ceiling is a real ceiling, not a search artifact.
 *
 * Run: node prototype-pulse/pulse-solve.js
 */

'use strict';

/* ── Physics ───────────────────────────────────────────────── */
// H = (omega/2) sigma_z + (Omega/2) sigma_x, drive gated by the thumb bit.
// U = exp(-i H dt) is a Bloch rotation by |n| dt about n = (Omega, 0, omega).
// Spinor (a, b) as four floats. Global phase is carried but never scored.

function stepSpinor(s, omega, drive, dt) {
  const nx = drive, nz = omega;
  const nn = Math.hypot(nx, nz);
  const th = nn * dt;
  const c = Math.cos(th / 2);
  const sn = Math.sin(th / 2);
  const u = -sn * (nz / nn);   // imag part of the diagonal
  const v = -sn * (nx / nn);   // imag part of the off-diagonal
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
  return [
    2 * (ar * br + ai * bi),
    2 * (ar * bi - ai * br),
    ar * ar + ai * ai - br * br - bi * bi,
  ];
}

// Fidelity |<target|psi>|^2 between pure states = (1 + r.t)/2 on the Bloch sphere.
function fidelity(s, t) {
  const r = bloch(s);
  return (1 + r[0] * t[0] + r[1] * t[1] + r[2] * t[2]) / 2;
}

function norm(s) {
  return Math.hypot(s[0], s[1], s[2], s[3]);
}

/* ── Reachable-set solver ──────────────────────────────────── */
const NTH = 360, NPH = 720;  // ~0.5 degree cells

function cellOf(r) {
  const th = Math.acos(Math.max(-1, Math.min(1, r[2])));
  let ph = Math.atan2(r[1], r[0]);
  if (ph < 0) ph += 2 * Math.PI;
  const i = Math.min(NTH - 1, Math.floor(th / Math.PI * NTH));
  const j = Math.min(NPH - 1, Math.floor(ph / (2 * Math.PI) * NPH));
  return i * NPH + j;
}

/* Propagate the reachable set for `ticks` decision ticks (input held constant
 * within a tick, SUBSTEPS physics steps per tick), then report the best
 * fidelity to `target` at the final tick and the input word that gets there. */
function solve(cfg) {
  const { omega, drive, ticks, target, start, tickDt = 1 / 60, substeps = 2 } = cfg;
  const dt = tickDt / substeps;

  let cur = new Map();                       // cell -> {s, parent, bit}
  cur.set(cellOf(bloch(start)), { s: start, parent: -1, bit: 0 });
  const history = [cur];

  for (let t = 0; t < ticks; t++) {
    const next = new Map();
    let idx = 0;
    const keys = [...cur.keys()];
    for (const k of keys) {
      const node = cur.get(k);
      node._i = idx++;
      for (const bit of [0, 1]) {
        let s = node.s;
        for (let q = 0; q < substeps; q++) s = stepSpinor(s, omega, bit ? drive : 0, dt);
        const c = cellOf(bloch(s));
        if (!next.has(c)) next.set(c, { s, parent: node._i, bit });
      }
    }
    cur = next;
    history.push(cur);
  }

  let best = -1, bestNode = null;
  for (const node of cur.values()) {
    const f = fidelity(node.s, target);
    if (f > best) { best = f; bestNode = node; }
  }

  // Reconstruct the input word by walking parents back through history.
  const bits = [];
  let node = bestNode;
  for (let t = ticks; t > 0; t--) {
    bits.push(node.bit);
    const prev = [...history[t - 1].values()];
    node = prev[node.parent];
  }
  bits.reverse();

  return { best, bits, states: cur.size };
}

/* Replay an input word exactly — verifies the solver's answer independently
 * of the discretisation. */
function replay(cfg, bits) {
  const { omega, drive, target, start, tickDt = 1 / 60, substeps = 2 } = cfg;
  const dt = tickDt / substeps;
  let s = start;
  for (const bit of bits) {
    for (let q = 0; q < substeps; q++) s = stepSpinor(s, omega, bit ? drive : 0, dt);
  }
  return { f: fidelity(s, target), n: norm(s) };
}

/* Median fidelity of a mashing player: random hold/release with a mean
 * hold length of ~5 ticks (~83ms), which is roughly what a thumb does. */
function mashing(cfg, trials = 4000) {
  const out = [];
  for (let k = 0; k < trials; k++) {
    const bits = [];
    let bit = Math.random() < 0.5 ? 1 : 0;
    for (let t = 0; t < cfg.ticks; t++) {
      if (Math.random() < 0.2) bit ^= 1;
      bits.push(bit);
    }
    out.push(replay(cfg, bits).f);
  }
  out.sort((a, b) => a - b);
  return { median: out[out.length >> 1], p90: out[Math.floor(out.length * 0.9)] };
}

/* ── Experiments ───────────────────────────────────────────── */
const NORTH = [0, 0, 1];
const START = [1, 0, 0, 0];                  // |0>, the north pole
const pct = (x) => (100 * x).toFixed(1) + '%';

// Target from latitude (degrees from +z) and azimuth (degrees).
function tgt(latDeg, azDeg) {
  const th = latDeg * Math.PI / 180, ph = azDeg * Math.PI / 180;
  return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
}

console.log('=== sanity: norm conservation over 600 random ticks ===');
{
  let s = START;
  for (let i = 0; i < 1200; i++) s = stepSpinor(s, 11, Math.random() < 0.5 ? 14 : 0, 1 / 120);
  console.log('  |psi| - 1 =', (norm(s) - 1).toExponential(2));
}

console.log('\n=== Q1: drive strength Omega at omega = 11, 0.6s window ===');
console.log('  Omega | ceiling | mash med | gap');
for (const drive of [6, 8, 11, 14, 18, 24]) {
  const cfg = { omega: 11, drive, ticks: 36, target: tgt(75, 130), start: START };
  const r = solve(cfg);
  const m = mashing(cfg);
  console.log(`  ${String(drive).padStart(5)} | ${pct(r.best).padStart(7)} | ${pct(m.median).padStart(8)} | ${(100 * (r.best - m.median)).toFixed(1)} pts`);
}

console.log('\n=== Q2: does a SHORTER WINDOW raise difficulty, or kill reachability? ===');
console.log('  (omega = 11, Omega = 14, target lat 75 az 130)');
console.log('  window | ticks | ceiling | mash med | gap');
for (const [ms, ticks] of [[250, 15], [400, 24], [550, 33], [700, 42], [1000, 60], [1500, 90]]) {
  const cfg = { omega: 11, drive: 14, ticks, target: tgt(75, 130), start: START };
  const r = solve(cfg);
  const m = mashing(cfg);
  console.log(`  ${String(ms + 'ms').padStart(6)} | ${String(ticks).padStart(5)} | ${pct(r.best).padStart(7)} | ${pct(m.median).padStart(8)} | ${(100 * (r.best - m.median)).toFixed(1)} pts`);
}

console.log('\n=== Q3: is the ceiling target-dependent? (0.7s window) ===');
console.log('  lat  az | ceiling | mash med | gap');
for (const [lat, az] of [[30, 0], [50, 90], [75, 130], [90, 200], [110, 300], [135, 45], [160, 180]]) {
  const cfg = { omega: 11, drive: 14, ticks: 42, target: tgt(lat, az), start: START };
  const r = solve(cfg);
  const m = mashing(cfg);
  console.log(`  ${String(lat).padStart(3)} ${String(az).padStart(3)} | ${pct(r.best).padStart(7)} | ${pct(m.median).padStart(8)} | ${(100 * (r.best - m.median)).toFixed(1)} pts`);
}

console.log('\n=== Q4: verify best words replay exactly (no discretisation drift) ===');
{
  const cfg = { omega: 11, drive: 14, ticks: 42, target: tgt(75, 130), start: START };
  const r = solve(cfg);
  const v = replay(cfg, r.bits);
  console.log('  solver says', pct(r.best), '| replay says', pct(v.f), '| |psi| =', v.n.toFixed(12));
  console.log('  reachable cells at final tick:', r.states);
  console.log('  input word:', r.bits.join(''));
}
