/* PROTOTYPE — throwaway. Ceilings for the exact levels shipped in
 * pulse-prototype.html, so no rung is accidentally impossible (or trivially
 * possible) when the owner plays it. Reports the WORST-case ceiling over many
 * random (start, target) pairs, because a level is only fair if its hardest
 * roll is still clearable.
 *
 * Run: node --max-old-space-size=4096 prototype-pulse/pulse-levels.js
 */

'use strict';

function stepSpinor(s, omega, drive, dt) {
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

const NTH = 140, NPH = 280;
function cellOf(r) {
  const th = Math.acos(Math.max(-1, Math.min(1, r[2])));
  let ph = Math.atan2(r[1], r[0]); if (ph < 0) ph += 2 * Math.PI;
  return Math.min(NTH - 1, (th / Math.PI * NTH) | 0) * NPH + Math.min(NPH - 1, (ph / (2 * Math.PI) * NPH) | 0);
}

const OMEGA = 11, DRIVE = 14, MIN_SEG = 6;

function ceiling(ticks, target, start) {
  const key = (c, b, a) => (c * 2 + b) * (MIN_SEG + 1) + Math.min(a, MIN_SEG);
  let cur = new Map([[key(cellOf(bloch(start)), 0, MIN_SEG), { s: start, bit: 0, age: MIN_SEG }]]);
  for (let t = 0; t < ticks; t++) {
    const next = new Map();
    for (const n of cur.values())
      for (const bit of (n.age >= MIN_SEG ? [n.bit, n.bit ^ 1] : [n.bit])) {
        let s = n.s;
        s = stepSpinor(s, OMEGA, bit ? DRIVE : 0, 1 / 120);
        s = stepSpinor(s, OMEGA, bit ? DRIVE : 0, 1 / 120);
        const age = bit === n.bit ? n.age + 1 : 1;
        const k = key(cellOf(bloch(s)), bit, age);
        if (!next.has(k)) next.set(k, { s, bit, age });
      }
    cur = next;
  }
  let best = -1;
  for (const n of cur.values()) { const f = fid(n.s, target); if (f > best) best = f; }
  return best;
}

function randUnit() {
  const z = 2 * Math.random() - 1, ph = 2 * Math.PI * Math.random(), r = Math.sqrt(1 - z * z);
  return [r * Math.cos(ph), r * Math.sin(ph), z];
}
function randState() {
  const [x, y, z] = randUnit();
  const th = Math.acos(z), ph = Math.atan2(y, x);
  return [Math.cos(th / 2), 0, Math.sin(th / 2) * Math.cos(ph), Math.sin(th / 2) * Math.sin(ph)];
}

const pct = (x) => (100 * x).toFixed(1) + '%';
const ROLLS = 24;

console.log('omega =', OMEGA, ' Omega =', DRIVE, ' minSeg =', MIN_SEG, 'ticks (100ms)\n');

console.log('=== Ladder C (BUDGET): window shrinks, bar fixed at 93% ===');
console.log('  window | ticks | worst ceiling | median ceiling | bar 93% clearable?');
for (const ms of [900, 700, 550, 450, 350, 250]) {
  const ticks = Math.round(ms / 1000 * 60);
  const cs = [];
  for (let k = 0; k < ROLLS; k++) cs.push(ceiling(ticks, randUnit(), randState()));
  cs.sort((a, b) => a - b);
  const worst = cs[0], med = cs[cs.length >> 1];
  console.log(`  ${String(ms + 'ms').padStart(6)} | ${String(ticks).padStart(5)} | ${pct(worst).padStart(13)} | ${pct(med).padStart(14)} | ${worst >= 0.93 ? 'yes' : 'NO — impossible'}`);
}

console.log('\n=== Ladder A (TIGHTNESS): bar rises, window fixed at 700ms ===');
console.log('  bar    | tolerance | worst ceiling | clearable?');
{
  const ticks = 42, cs = [];
  for (let k = 0; k < ROLLS * 2; k++) cs.push(ceiling(ticks, randUnit(), randState()));
  cs.sort((a, b) => a - b);
  const worst = cs[0];
  for (const bar of [0.80, 0.88, 0.93, 0.96, 0.98, 0.993]) {
    const ang = (Math.acos(2 * bar - 1) * 180 / Math.PI).toFixed(1);
    console.log(`  ${pct(bar).padStart(6)} | ${(ang + ' deg').padStart(9)} | ${pct(worst).padStart(13)} | ${worst >= bar ? 'yes' : 'NO'}`);
  }
  console.log('  (worst ceiling is a property of the window, not the bar — same 700ms for every rung)');
}

console.log('\n=== Ladder B (COUNT): more targets, bar 93%, window 700ms ===');
console.log('  Per-target difficulty is identical by construction; what changes is');
console.log('  the chance of surviving the whole chain. p = P(clear one target).');
{
  console.log('  targets | run clears if p=0.60 | p=0.75 | p=0.90');
  for (const K of [2, 4, 6, 9, 13, 18])
    console.log(`  ${String(K).padStart(7)} | ${(100 * 0.6 ** K).toFixed(1).padStart(19)}% | ${(100 * 0.75 ** K).toFixed(1).padStart(5)}% | ${(100 * 0.9 ** K).toFixed(1).padStart(5)}%`);
}
