/* ============================================================
   Station 7 — Quantum Circuit Builder
   Implements a Grover's Search circuit editor and simulator
   ============================================================ */

'use strict';

/* ── Constants ─────────────────────────────────────────────── */
const TARGET_STATE = 2;   // |010⟩ = 2 in decimal (binary 010)
const TARGET_LABEL = '|2⟩';
const SUCCESS_THRESHOLD = 0.75; // 75% probability
const NUM_QUBITS = 3;
const NUM_STATES = 8;

/* ── Gate definitions ──────────────────────────────────────── */
const GATES = {
  H: {
    name: 'Hadamard',
    short: 'H',
    type: 'hadamard',
    cssClass: 'hadamard',
    description: 'Puts a qubit into superposition',
  },
  X: {
    name: 'Pauli-X',
    short: 'X',
    type: 'pauli',
    cssClass: 'pauli',
    description: 'Bit flip — 0↔1',
  },
  CNOT: {
    name: 'CNOT',
    short: 'CX',
    type: 'cnot',
    cssClass: 'cnot',
    description: 'Control-Not — entangles two qubits',
  },
  ORACLE: {
    name: 'Oracle',
    short: 'ƒ',
    type: 'oracle',
    cssClass: 'oracle',
    description: 'Marks the target state |2⟩',
  },
  DIFF: {
    name: 'Diffusion',
    short: 'D',
    type: 'diffusion',
    cssClass: 'diffusion',
    description: 'Amplifies the marked state',
  },
  M: {
    name: 'Measure',
    short: 'M',
    type: 'measure',
    cssClass: 'measure',
    description: 'Collapses and shows probabilities',
  },
};

/* ── Circuit state ─────────────────────────────────────────── */
const CIRCUIT = {
  wires: [[], [], []], // gates per wire (Q0, Q1, Q2)
  state: null,          // complex state vector
  probs: null,          // probability distribution
  hasRun: false,
  success: false,
  hintLevel: 0,
};

/* ── Complex number helpers ────────────────────────────────── */
// Complex: {re, im}
function cAdd(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
function cSub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
function cMul(a, b) { return { re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re }; }
function cScale(a, s) { return { re: a.re * s, im: a.im * s }; }
function cMag2(a) { return a.re * a.re + a.im * a.im; }
function cConj(a) { return { re: a.re, im: -a.im }; }

// State vector: array of 8 complex numbers
function initState() {
  return Array.from({ length: NUM_STATES }, (_, i) =>
    i === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 }
  );
}

/* ── Gate application ──────────────────────────────────────── */
// Single-qubit gates (applies to all qubits in parallel)
function applyH(state, qubit) {
  const factor = 1 / Math.SQRT2;
  const newState = state.map(x => ({ re: x.re, im: x.im }));
  for (let base = 0; base < NUM_STATES; base += (1 << (qubit + 1))) {
    for (let i = 0; i < (1 << qubit); i++) {
      const a = base + i;
      const b = base + i + (1 << qubit);
      const reA = state[a].re, imA = state[a].im;
      const reB = state[b].re, imB = state[b].im;
      newState[a].re = factor * (reA + reB);
      newState[a].im = factor * (imA + imB);
      newState[b].re = factor * (reA - reB);
      newState[b].im = factor * (imA - imB);
    }
  }
  return newState;
}

function applyX(state, qubit) {
  const newState = state.map(x => ({ re: x.re, im: x.im }));
  for (let base = 0; base < NUM_STATES; base += (1 << (qubit + 1))) {
    for (let i = 0; i < (1 << qubit); i++) {
      const a = base + i;
      const b = base + i + (1 << qubit);
      newState[a].re = state[b].re; newState[a].im = state[b].im;
      newState[b].re = state[a].re; newState[b].im = state[a].im;
    }
  }
  return newState;
}

function applyCNOT(state) {
  // CNOT: qubit 0 = control, qubit 1 = target (Q0→Q1)
  // Flip Q1 when Q0 = 1
  const newState = state.map(x => ({ re: x.re, im: x.im }));
  for (let i = 0; i < NUM_STATES; i++) {
    if ((i & 1) !== 0) {
      // Q0 = 1: flip Q1 (bit 1)
      const flipped = i ^ 2;
      newState[flipped].re = state[i].re;
      newState[flipped].im = state[i].im;
    } else {
      newState[i].re = state[i].re;
      newState[i].im = state[i].im;
    }
  }
  return newState;
}

function applyOracle(state) {
  // Oracle: flip phase of |TARGET_STATE⟩
  const newState = state.map(x => ({ re: x.re, im: x.im }));
  newState[TARGET_STATE].re = -state[TARGET_STATE].re;
  newState[TARGET_STATE].im = -state[TARGET_STATE].im;
  return newState;
}

function applyDiffusion(state) {
  // Grover diffusion: D = 2|s⟩⟨s| - I
  // |s⟩ = uniform superposition (all states equal amplitude)
  const N = NUM_STATES;
  const amp = 1 / Math.sqrt(N);
  const newState = state.map(() => ({ re: 0, im: 0 }));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      // newState[i] += 2*amp*amp * state[j] - (i===j ? state[j] : 0)
      // = (2/N - 1) * state[i] + 2/N * sum_other(state)
      // Optimized: new[i] = (2/N - 1) * state[i] + 2/N * (sum - state[i])
      //           = 2/N * sum - 1/N * state[i]
    }
  }
  // Simplified: D|ψ⟩ = 2|s⟩⟨s|ψ⟩ - |ψ⟩
  // ⟨s|ψ⟩ = sum(amp * state[j]) for all j = amp * sum(state)
  let sumRe = 0, sumIm = 0;
  for (let j = 0; j < N; j++) {
    sumRe += state[j].re;
    sumIm += state[j].im;
  }
  const factor = 2 * amp;
  const newState2 = state.map(x => ({
    re: factor * amp * sumRe - x.re,
    im: factor * amp * sumIm - x.im,
  }));
  return newState2;
}

function applyMeasure(state) {
  // Measurement doesn't change the state — just reveals probabilities
  return state;
}

/* ── Run the full circuit ──────────────────────────────────── */
function runCircuit() {
  let s = initState();
  const wires = CIRCUIT.wires;

  for (let step = 0; step < 10; step++) {
    let anyGate = false;
    for (let q = 0; q < NUM_QUBITS; q++) {
      if (wires[q][step]) {
        anyGate = true;
        const g = wires[q][step];
        switch (g) {
          case 'H': s = applyH(s, q); break;
          case 'X': s = applyX(s, q); break;
          case 'CNOT': s = applyCNOT(s); break;
          case 'ORACLE': s = applyOracle(s); break;
          case 'DIFF': s = applyDiffusion(s); break;
        }
      }
    }
    if (!anyGate) break;
  }

  // Normalize (handle floating point drift)
  let norm = 0;
  for (let i = 0; i < NUM_STATES; i++) norm += cMag2(s[i]);
  norm = Math.sqrt(norm);
  if (norm > 1e-10) s = s.map(x => cScale(x, 1 / norm));

  CIRCUIT.state = s;
  CIRCUIT.probs = s.map(x => cMag2(x));
  CIRCUIT.hasRun = true;
  CIRCUIT.success = CIRCUIT.probs[TARGET_STATE] >= SUCCESS_THRESHOLD;
}

/* ── Rendering ─────────────────────────────────────────────── */
function renderCircuit() {
  const page = document.getElementById('circuitPage');
  if (!page) return;
  page.innerHTML = buildCircuitHTML();
  // Localize any data-i18n slots (renderCircuit runs outside applyLanguage too)
  if (typeof t === 'function') {
    page.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
  }
  attachCircuitEvents();
}

// Tiny helper: pick th/en based on the current UI language
function c7(th, en) { return (typeof lang !== 'undefined' && lang === 'th') ? th : en; }

function buildCircuitHTML() {
  const hasGates = CIRCUIT.wires.some(w => w.length > 0);

  const wireRows = CIRCUIT.wires.map((wire, qi) => {
    const slots = wire.map((g, gi) => {
      const gate = GATES[g];
      return `
        <div class="circuit-gate ${gate.cssClass}" data-wire="${qi}" data-slot="${gi}"
             onclick="removeCircuitGate(${qi},${gi})" title="${gate.name}">
          ${gate.short}
          <div class="gate-remove" onclick="event.stopPropagation();removeCircuitGate(${qi},${gi})">×</div>
        </div>`;
    }).join('');

    return `
      <div class="circuit-wire">
        <div class="wire-label">Q${qi}</div>
        <div class="wire-track" id="wireTrack${qi}" data-qubit="${qi}"
             ondragover="onWireDragOver(event)" ondragleave="onWireDragLeave(event)"
             ondrop="onWireDrop(event,${qi})">
          ${slots || `<span style="color:var(--text-dim);font-size:0.78rem;padding-left:8px;opacity:0.7">${c7('ลากเกตมาวางตรงนี้', 'Drop gates here')}</span>`}
        </div>
      </div>`;
  }).join('');

  const probBars = CIRCUIT.probs
    ? CIRCUIT.probs.map((p, i) => {
      const isTarget = i === TARGET_STATE;
      const isHigh = p > 0.25 && !isTarget;
      const pct = (p * 100).toFixed(1);
      const bin = i.toString(2).padStart(NUM_QUBITS, '0');
      let cls = 'default';
      if (isTarget) cls = 'target-state';
      else if (isHigh && CIRCUIT.hasRun) cls = 'nontarget-high';
      return `
        <div class="prob-row">
          <div class="prob-state-label">|${i}⟩</div>
          <div class="prob-track">
            <div class="prob-bar ${cls}" style="width:${Math.max(p * 100, p > 0 ? 3 : 0)}%"></div>
          </div>
          <div class="prob-pct ${isTarget && CIRCUIT.success ? 'above-target' : ''}">${pct}%</div>
        </div>`;
    }).join('')
    : '';

  const pctNow = CIRCUIT.probs ? (CIRCUIT.probs[TARGET_STATE] * 100).toFixed(1) : '0';
  const resultHTML = CIRCUIT.hasRun
    ? CIRCUIT.success
      ? `<div class="circuit-result success">
           <span>✅</span> <strong>${c7(`|2⟩ ถึง ${pctNow}% แล้ว — ปลดล็อกแกนควอนตัม!`, `|2⟩ reached ${pctNow}% — Quantum Core Unlocked!`)}</strong>
         </div>`
      : `<div class="circuit-result error">
           <span>⚠️</span> ${c7(`ความน่าจะเป็นของ |2⟩ อยู่ที่ ${pctNow}% — ต้องได้ ${(SUCCESS_THRESHOLD * 100).toFixed(0)}% ขึ้นไป`, `|2⟩ probability is ${pctNow}% — need ${(SUCCESS_THRESHOLD * 100).toFixed(0)}%+`)}
         </div>`
    : '';

  const hintHTML = buildHintHTML();

  return `
    <div class="circuit-page-inner">
      <div class="circuit-header">
        <div class="circuit-header-number">07 / CIRCUIT</div>
        <h1 class="circuit-header-title" data-i18n="c7_title">Quantum Circuit Builder</h1>
        <p class="circuit-header-desc" data-i18n="c7_intro">
          Build Grover's search algorithm from scratch. Drag gates onto the circuit wires,
          run the simulation, and amplify the probability of finding the target state.
        </p>
        <div class="circuit-objective">
          <span>🎯</span>
          <span>${c7(
            `เป้าหมาย: ค้นหา <strong>${TARGET_LABEL}</strong> (ไบนารี 010) — ทำความน่าจะเป็นให้เกิน <strong>${(SUCCESS_THRESHOLD * 100).toFixed(0)}%</strong>`,
            `Target: find <strong>${TARGET_LABEL}</strong> (binary 010) — get probability above <strong>${(SUCCESS_THRESHOLD * 100).toFixed(0)}%</strong>`
          )}</span>
        </div>
      </div>

      ${resultHTML}

      <div class="circuit-builder">
        <div class="circuit-palette" id="gatePalette">
          <div class="palette-title">GATES</div>
          ${Object.entries(GATES).filter(([k]) => k !== 'M').map(([k, g]) => `
            <div class="gate-item" draggable="true" data-gate="${k}"
                 ondragstart="onGateDragStart(event,'${k}')"
                 ondragend="onGateDragEnd(event)">
              <div class="gate-pill ${g.cssClass}">${g.short}</div>
              <div class="gate-name">${g.name}</div>
            </div>`).join('')}
          <div class="palette-divider"></div>
          <div class="gate-item" draggable="true" data-gate="M"
               ondragstart="onGateDragStart(event,'M')"
               ondragend="onGateDragEnd(event)">
            <div class="gate-pill measure">M</div>
            <div class="gate-name">Measure</div>
          </div>
          <div class="palette-actions">
            <button class="circuit-reset-btn" onclick="resetCircuit7()" style="width:100%;justify-content:center">
              ${c7('เริ่มใหม่', 'Reset')}
            </button>
          </div>
        </div>

        <div>
          <div class="circuit-canvas-wrap">
            <div class="circuit-canvas-label">CIRCUIT WIRES</div>
            <div class="circuit-wires">
              ${wireRows}
            </div>
          </div>

          <div class="circuit-output">
            <div class="circuit-output-label">OUTPUT PROBABILITIES</div>
            <div class="prob-bars" id="probBars">
              ${probBars || `<div style="color:var(--text-dim);font-size:0.88rem;text-align:center;padding:20px 0">
                ${c7('วางเกตแล้วกด <strong>รันวงจร</strong> เพื่อดูความน่าจะเป็น', 'Drop gates and press <strong>Run Circuit</strong> to see probabilities')}
              </div>`}
            </div>
            ${CIRCUIT.hasRun ? `
            <div class="target-marker">
              <div class="target-marker-dot"></div>
              <span>${c7(`เป้าหมาย <strong>${TARGET_LABEL}</strong> — ต้องได้ ≥`, `Target <strong>${TARGET_LABEL}</strong> — need ≥`)}<span class="target-marker-val">${(SUCCESS_THRESHOLD * 100).toFixed(0)}%</span></span>
            </div>` : ''}
          </div>

          <div class="circuit-controls">
            <div class="circuit-hint-wrap">
              <button class="circuit-hint-btn" onclick="toggleHint()">
                <span>💡</span>
                <span data-i18n="c7_hint_btn">Hint</span>
              </button>
              ${hintHTML}
            </div>
            <div class="circuit-action-btns">
              <button class="circuit-run-btn" onclick="runCircuit7()">
                ${c7('รันวงจร ▶', 'Run Circuit ▶')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="simulation-container">
        <div class="challenge-strip">
          <span class="chip" data-i18n="challenge_chip">Challenge</span>
          <span data-i18n="c7_challenge">
            Build Grover's algorithm: initialize superposition, apply oracle, run diffusion.
            Find |2⟩ with probability above ${(SUCCESS_THRESHOLD * 100).toFixed(0)}%.
          </span>
        </div>
      </div>
    </div>`;
}

function buildHintHTML() {
  const hints = [
    c7('อัลกอริทึมของ Grover เริ่มจากทำให้ทุกคิวบิตอยู่ใน <strong>superposition</strong> ด้วยเกต Hadamard (H)',
       'Grover\'s algorithm starts by putting all qubits into <strong>superposition</strong> using Hadamard gates.'),
    c7('Oracle จะ<strong>ทำเครื่องหมาย</strong>สถานะเป้าหมาย |2⟩ (ไบนารี 010) ด้วยการกลับเฟส',
       'The Oracle <strong>marks</strong> the target state |2⟩ (binary 010) by flipping its phase.'),
    c7('ตัวดำเนินการ Diffusion จะ<strong>ขยาย</strong>แอมพลิจูดของสถานะที่ถูกทำเครื่องหมาย และกดสถานะอื่นลง',
       'The Diffusion operator <strong>amplifies</strong> the marked state\'s amplitude while suppressing others.'),
    c7('ลองนี่: H บน Q0, Q1, Q2 → Oracle → Diffusion → Measure',
       'Try: H on Q0, Q1, Q2 → Oracle → Diffusion → Measure.'),
  ];

  if (CIRCUIT.hintLevel === 0) return '';

  const hint = hints[Math.min(CIRCUIT.hintLevel - 1, hints.length - 1)];
  return `
    <div class="circuit-hint-panel" id="hintPanel">
      <div class="hint-title">${c7('คำใบ้', 'HINT')} ${CIRCUIT.hintLevel}</div>
      <div class="hint-text">${hint}</div>
      <div class="hint-step">${CIRCUIT.hintLevel < hints.length
        ? c7(`เหลืออีก ${hints.length - CIRCUIT.hintLevel} คำใบ้`, `${hints.length - CIRCUIT.hintLevel} hints remaining`)
        : c7('คำใบ้สุดท้ายแล้ว', 'Last hint shown')}</div>
    </div>`;
}

function toggleHint() {
  const panel = document.getElementById('hintPanel');
  if (panel) {
    panel.remove();
  } else {
    CIRCUIT.hintLevel = Math.min(CIRCUIT.hintLevel + 1, 4);
    // Re-render just the hint area
    const wrap = document.querySelector('.circuit-hint-wrap');
    if (wrap) {
      const btn = wrap.querySelector('.circuit-hint-btn');
      const temp = document.createElement('div');
      temp.innerHTML = buildHintHTML();
      const newPanel = temp.firstElementChild;
      if (newPanel) wrap.insertBefore(newPanel, btn.nextSibling);
    }
  }
}

/* ── Drag & Drop ───────────────────────────────────────────── */
let dragGateType = null;
let dragGhost = null;

function onGateDragStart(e, gateType) {
  dragGateType = gateType;
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', gateType);

  // Create custom drag ghost
  const gate = GATES[gateType];
  dragGhost = document.createElement('div');
  dragGhost.className = 'gate-pill ' + gate.cssClass;
  dragGhost.textContent = gate.short;
  dragGhost.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;opacity:0.85;transform:rotate(-3deg)scale(1.15)';
  document.body.appendChild(dragGhost);
  e.dataTransfer.setDragImage(dragGhost, 26, 18);

  e.target.closest('.gate-item').classList.add('dragging');
}

function onGateDragEnd(e) {
  dragGateType = null;
  e.target.closest('.gate-item')?.classList.remove('dragging');
  if (dragGhost) { dragGhost.remove(); dragGhost = null; }
  document.querySelectorAll('.wire-track.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function onWireDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  e.currentTarget.classList.add('drag-over');
}

function onWireDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onWireDrop(e, qubit) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const gateType = e.dataTransfer.getData('text/plain') || dragGateType;
  if (!gateType || !GATES[gateType]) return;

  CIRCUIT.wires[qubit].push(gateType);
  CIRCUIT.hasRun = false;
  CIRCUIT.probs = null;
  renderCircuit();
  play('click');
}

function removeCircuitGate(qubit, slot) {
  CIRCUIT.wires[qubit].splice(slot, 1);
  CIRCUIT.hasRun = false;
  CIRCUIT.probs = null;
  renderCircuit();
  play('click');
}

/* ── Run & Check ───────────────────────────────────────────── */
function runCircuit7() {
  play('prepare');

  // Always recompute from the current gate layout
  runCircuit();

  // Re-render to show new probabilities
  renderCircuit();

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.prob-bar').forEach((bar, i) => {
      bar.style.transition = 'width 0.6s cubic-bezier(0.22,1,0.36,1)';
      const p = CIRCUIT.probs[i];
      bar.style.width = Math.max(p * 100, p > 0 ? 3 : 0) + '%';
    });
  }, 50);

  if (CIRCUIT.success) {
    setTimeout(() => {
      play('success');
      showCircuitSuccess();
    }, 700);
  } else {
    play('error');
  }
}

function showCircuitSuccess() {
  // Pulse the target bar
  document.querySelectorAll('.prob-bar').forEach(bar => bar.classList.add('success-pulse'));

  // Trigger confetti
  if (typeof confetti === 'function') confetti();

  // Show success overlay
  const page = document.getElementById('circuitPage');
  if (!page) return;

  const overlay = document.createElement('div');
  overlay.id = 'circuitSuccessOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(6,6,16,0.9);backdrop-filter:blur(12px);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    z-index:200;text-align:center;gap:16px;
    animation:fade-in 0.4s ease-out;
  `;
  overlay.innerHTML = `
    <style>@keyframes fade-in{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}</style>
    <div style="font-size:4rem;animation:bounce 0.6s ease-out">
      <div style="font-size:5rem;line-height:1">🔓</div>
    </div>
    <div style="font-family:'Orbitron',sans-serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:800;
                background:linear-gradient(125deg,#34e08a,#22e0ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
                filter:drop-shadow(0 0 20px rgba(52,224,138,0.4))">
      ${c7('สร้างวงจรสำเร็จ!', 'CIRCUIT SUCCESSFUL')}
    </div>
    <div style="color:#c8d0ee;font-size:1rem;max-width:480px;line-height:1.7">
      ${c7(
        `คุณสร้างอัลกอริทึมการค้นหาของ Grover สำเร็จแล้ว ตอนนี้สถานะ |2⟩ มีความน่าจะเป็น <strong style="color:#34e08a">${(CIRCUIT.probs[TARGET_STATE] * 100).toFixed(1)}%</strong> — เร็วกว่าการค้นหาแบบทั่วไปแบบ quadratic speedup`,
        `You've built Grover's Search algorithm. The |2⟩ state now has <strong style="color:#34e08a">${(CIRCUIT.probs[TARGET_STATE] * 100).toFixed(1)}%</strong> probability — a quadratic speedup over classical search.`
      )}
    </div>
    <div style="color:#8e9ac0;font-size:0.88rem;margin-top:4px">
      ${c7('ปลดล็อกแกนควอนตัมเรียบร้อยแล้ว', 'The Quantum Core is now fully unlocked.')}
    </div>
    <button onclick="dismissCircuitSuccess()" style="
      margin-top:16px;padding:12px 32px;background:linear-gradient(135deg,#34e08a,#22e0ff);
      color:#fff;font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:600;
      letter-spacing:1.5px;border:none;border-radius:999px;cursor:pointer;
      box-shadow:0 4px 24px rgba(52,224,138,0.35);transition:all 0.2s">
      ${c7('กลับห้องแล็บ', 'Back to Lab')}
    </button>
  `;
  document.body.appendChild(overlay);

  // Mark station 7 complete
  PUZZLE[7].solved = true;
  if (typeof progress !== 'undefined') { progress[7] = true; localStorage.setItem('qx_progress', JSON.stringify(progress)); }
  if (typeof markComplete === 'function') markComplete(7);
  if (typeof updateLabProgress === 'function') updateLabProgress();
  if (typeof renderProgress === 'function') renderProgress();
}

function dismissCircuitSuccess() {
  const overlay = document.getElementById('circuitSuccessOverlay');
  if (overlay) overlay.remove();
  goHome();
}

function resetCircuit7() {
  play('click');
  CIRCUIT.wires = [[], [], []];
  CIRCUIT.state = null;
  CIRCUIT.probs = null;
  CIRCUIT.hasRun = false;
  CIRCUIT.success = false;
  CIRCUIT.hintLevel = 0;
  renderCircuit();
}

/* ── Attach events ─────────────────────────────────────────── */
function attachCircuitEvents() {
  // Make palette gates draggable on mobile (pointer events)
  document.querySelectorAll('.gate-item').forEach(item => {
    let clone = null;
    item.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') {
        e.preventDefault();
        const gateType = item.dataset.gate;
        // Create floating clone that follows pointer
        clone = item.cloneNode(true);
        clone.style.cssText = `
          position:fixed;pointer-events:none;z-index:9999;opacity:0.85;
          transform:scale(1.15) rotate(-3deg);
          left:${e.clientX - 26}px;top:${e.clientY - 18}px;
          background:transparent;border:none;
        `;
        document.body.appendChild(clone);

        const moveHandler = (e2) => {
          if (clone) {
            clone.style.left = (e2.clientX - 26) + 'px';
            clone.style.top = (e2.clientY - 18) + 'px';

            // Highlight drop target
            document.querySelectorAll('.wire-track').forEach(track => {
              const r = track.getBoundingClientRect();
              const inTrack = e2.clientX >= r.left && e2.clientX <= r.right &&
                              e2.clientY >= r.top  && e2.clientY <= r.bottom;
              track.classList.toggle('drag-over', inTrack);
            });
          }
        };
        const upHandler = (e2) => {
          if (clone) {
            // Find which wire we dropped on
            let dropped = false;
            document.querySelectorAll('.wire-track').forEach(track => {
              const r = track.getBoundingClientRect();
              const inTrack = e2.clientX >= r.left && e2.clientX <= r.right &&
                              e2.clientY >= r.top  && e2.clientY <= r.bottom;
              if (inTrack) {
                const qubit = parseInt(track.dataset.qubit);
                CIRCUIT.wires[qubit].push(gateType);
                CIRCUIT.hasRun = false;
                CIRCUIT.probs = null;
                dropped = true;
              }
              track.classList.remove('drag-over');
            });
            if (dropped) {
              play('click');
              renderCircuit();
            }
            clone.remove();
            clone = null;
          }
          document.removeEventListener('pointermove', moveHandler);
          document.removeEventListener('pointerup', upHandler);
        };
        document.addEventListener('pointermove', moveHandler);
        document.addEventListener('pointerup', upHandler);
      }
    });
  });
}

/* ── Initialize ────────────────────────────────────────────── */
function initCircuit7() {
  // Called from app.js when station 7 page is opened
  renderCircuit();
}
