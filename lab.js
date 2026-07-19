'use strict';
/* ============================================================
   lab.js — Quantum Lab Redesign
   Replaces buildHome(); adds puzzle layer + Grover climax
   ============================================================ */

/* ── Station metadata ─────────────────────────────────────── */
const STATIONS = [
  {
    id: 1, icon: '🌊',
    name: { th: 'สถานีที่ 1: ทวิภาพ', en: 'Station 1: Duality' },
    tagline: { th: 'จับรูปแบบการแทรกสอดที่ถูกซ่อนไว้', en: 'Match the hidden interference pattern' },
    goal: { th: 'ปรับช่องและพลังงานจนรูปแบบตรงกับเป้าหมาย ≥80%', en: 'Tune slits & energy until your pattern matches ≥80%' },
    goalIcon: '🎯',
  },
  {
    id: 2, icon: '⚛️',
    name: { th: 'สถานีที่ 2: ซ้อนทับ', en: 'Station 2: Superposition' },
    tagline: { th: 'ระบุสถานะคิวบิตที่ซ่อนอยู่ใน 5 ครั้งวัด', en: 'Identify the hidden qubit state in 5 measurements' },
    goal: { th: 'ใช้ 5 การวัดเพื่อบอกสถานะที่ซ่อนอยู่', en: 'Use 5 measurements to identify the hidden state' },
    goalIcon: '🔍',
  },
  {
    id: 3, icon: '📈',
    name: { th: 'สถานีที่ 3: ความไม่แน่นอน', en: 'Station 3: Uncertainty' },
    tagline: { th: 'ถ่ายภาพอนุภาคให้อยู่ในค่าที่กำหนด', en: 'Image the particle within spec — if you can' },
    goal: { th: 'ทำให้ Δx·Δp ≤ 0.55 โดยที่ Δx < 0.45 และ Δp < 0.45', en: 'Achieve Δx·Δp ≤ 0.55 with Δx < 0.45 and Δp < 0.45' },
    goalIcon: '📸',
  },
  {
    id: 4, icon: '🚀',
    name: { th: 'สถานีที่ 4: การทะลุ', en: 'Station 4: Tunneling' },
    tagline: { th: 'นำทางอนุภาคผ่านสนามกำแพง', en: 'Navigate a particle through the barrier field' },
    goal: { th: 'เล่น Qubit Runner และทำคะแนนให้ถึง 100', en: 'Play Qubit Runner and score 100+' },
    goalIcon: '🎮',
  },
  {
    id: 5, icon: '🔗',
    name: { th: 'สถานีที่ 5: พัวพัน', en: 'Station 5: Entanglement' },
    tagline: { th: 'จับสปายด้วยทฤษฎีบทเบลล์', en: 'Catch the eavesdropper using Bell inequality' },
    goal: { th: 'วัด 40 คู่ พิสูจน์ว่าผลละเมิดขอบเขตคลาสสิก', en: 'Run 40 trials and prove Bell inequality violation' },
    goalIcon: '🕵️',
  },
  {
    id: 6, icon: '🐈',
    name: { th: 'สถานีที่ 6: การยุบตัว', en: 'Station 6: Collapse' },
    tagline: { th: 'หาหน้าต่างวัดที่ดีที่สุดก่อน decoherence', en: 'Find the optimal measurement window before decoherence' },
    goal: { th: 'เปิดกล่อง 5 ครั้ง สังเกตรูปแบบการยุบตัว', en: 'Open the box 5× and complete the observation log' },
    goalIcon: '⏱️',
  },
  {
    id: 7, icon: '⚡',
    name: { th: 'สถานีที่ 7: วงจรควอนตัม', en: 'Station 7: Circuit Puzzle' },
    tagline: { th: 'ประกอบวงจรควอนตัมด้วยการลากเกต', en: 'Build quantum circuits by dragging gates onto qubits' },
    goal: { th: 'แก้ 5 ด่านปริศนาวงจรควอนตัม', en: 'Solve all 5 quantum circuit puzzle levels' },
    goalIcon: '🔌',
  },
];

/* ── Puzzle state per station ─────────────────────────────── */
// Extends the existing `progress` object with puzzle metadata
const PUZZLE = {
  // Station 1: pattern match
  1: {
    targetSep: 60, targetEnergy: 40,
    attempts: 0, maxAttempts: 10,
    best: 0,
    solved: false,
  },
  // Station 2: qubit ID
  2: {
    hiddenTheta: 0, hiddenPhi: 0, // set on station open
    measurementsLeft: 5,
    guessSubmitted: false,
    solved: false,
  },
  // Station 3: uncertainty imaging
  3: {
    attempts: 0,
    solved: false,
  },
  // Station 4: Qubit Runner score gate
  4: {
    scoreNeeded: 100,
    solved: false,
  },
  // Station 5: Bell violation detection
  5: {
    trialsNeeded: 40,
    solved: false,
  },
  // Station 6: box opening log
  6: {
    opensNeeded: 5,
    opens: 0,
    log: [],
    solved: false,
  },
  // Station 7: Quantum Circuit Puzzle
  7: {
    solved: false,
  },
};

/* ── Build new home page ──────────────────────────────────── */
function buildLabHome() {
  const page = document.getElementById('homePage');
  if (!page) return;

  const doneCount = Object.values(PUZZLE).filter(p => p.solved).length;

  let stationCards = STATIONS.map(s => {
    const solved = PUZZLE[s.id].solved;
    const onclick = s.id === 7 ? 'openCircuitPuzzle()' : `openTopic(${s.id})`;
    return `
    <button class="station-card${solved ? ' online' : ''}"
      onclick="${onclick}"
      onmousemove="stationGlow(event,this)"
      onpointerenter="play('hover')"
      aria-label="${s.name[lang]}">
      <div class="station-number">
        <span class="station-status-dot"></span>
        STATION-0${s.id} · ${solved ? 'ONLINE' : 'OFFLINE'}
      </div>
      <span class="station-icon">${s.icon}</span>
      <div class="station-name" data-i18n-lab="st${s.id}_name">${s.name[lang]}</div>
      <div class="station-tagline" data-i18n-lab="st${s.id}_tagline">${s.tagline[lang]}</div>
      <div class="station-done-ring">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
    </button>`;
  }).join('');

  const coreUnlocked = doneCount === 7;
  const coreClass = coreUnlocked ? 'quantum-core-panel unlocked' : 'quantum-core-panel';
  const coreCursor = coreUnlocked ? '' : 'style="cursor:not-allowed"';
  const pct = Math.round(doneCount / 7 * 100);

  page.innerHTML = `
  <div class="lab-home">
    <div class="lab-alert">
      <span class="lab-alert-dot"></span>
      QUANTUM FACILITY — ${doneCount === 7 ? 'ALL STATIONS NOMINAL' : 'CRITICAL FAILURE — ' + (7 - doneCount) + ' STATION' + (7 - doneCount === 1 ? '' : 'S') + ' OFFLINE'}
    </div>

    <h1 class="lab-title">
      <div class="lab-title-line1">QUANTUM</div>
      <div class="lab-title-line2">${doneCount === 7 ? 'FULLY ONLINE' : 'LAB EMERGENCY'}</div>
    </h1>

    <p class="lab-subtitle">
      ${doneCount === 7
        ? `<span class="hl">All 7 stations are back online.</span> The Quantum Core is ready — witness why quantum beats classical.`
        : `The lab's <span class="hl">quantum core has failed</span>. Seven research stations are offline. Repair each one to restore power — then see something no classical computer can match.`
      }
    </p>

    <div class="station-grid">${stationCards}</div>

    <div class="${coreClass}" id="corePanel" onclick="${coreUnlocked ? 'openQuantumCore()' : ''}" ${coreCursor}>
      <div class="core-lock-icon">${coreUnlocked ? '⚛️' : '🔒'}</div>
      <div class="core-content">
        <div class="core-label">QUANTUM CORE · FINAL EXPERIMENT</div>
        <div class="core-title">Grover's Quantum Search</div>
        <div class="core-desc">
          ${coreUnlocked
            ? 'The core is online. Watch a quantum computer search a database in 1 query — a classical computer takes 2.5.'
            : 'Restore all 7 stations to unlock the final demonstration. See the quantum advantage live.'}
        </div>
        <div class="core-progress">
          <div class="core-progress-bar-wrap">
            <div class="core-progress-bar" id="coreProgressBar" style="width:${pct}%"></div>
          </div>
          <div class="core-progress-label" id="coreProgressLabel">${doneCount}/7 STATIONS</div>
        </div>
      </div>
      ${coreUnlocked ? '<button class="core-cta" onclick="event.stopPropagation();openQuantumCore()">LAUNCH →</button>' : ''}
    </div>
  </div>`;
}

function stationGlow(e, el) {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--my', (e.clientY - r.top) + 'px');
}

/* ── Puzzle goal strip injection ─────────────────────────── */
// Called after buildTopics() — injects goal strip + puzzle overlay into each topic page
function injectPuzzleUI() {
  for (const s of STATIONS) {
    const page = document.getElementById('topic' + s.id + 'Page');
    if (!page) continue;

    // Insert goal strip before simulation-container
    const simContainer = page.querySelector('.simulation-container');
    if (simContainer) {
      const strip = document.createElement('div');
      strip.className = 'puzzle-goal-strip';
      strip.id = 'goalStrip' + s.id;
      strip.innerHTML = `
        <div class="puzzle-goal-icon">${s.goalIcon}</div>
        <div class="puzzle-goal-text">
          <div class="puzzle-goal-label">MISSION OBJECTIVE</div>
          <div class="puzzle-goal-desc" id="goalDesc${s.id}">${s.goal[lang]}</div>
        </div>
        <div class="puzzle-goal-status" id="goalStatus${s.id}"></div>`;
      simContainer.parentNode.insertBefore(strip, simContainer);
    }

    // Inject success overlay (hidden initially unless already solved)
    const overlay = document.createElement('div');
    overlay.id = 'puzzleOverlay' + s.id;
    overlay.className = PUZZLE[s.id].solved
      ? 'puzzle-overlay puzzle-overlay-success'
      : 'puzzle-overlay hidden';

    if (PUZZLE[s.id].solved) {
      overlay.innerHTML = puzzleSuccessHTML(s);
    }

    // Wrap the page content in a relative-positioned container for overlay
    const inner = page.querySelector('.topic-page');
    if (inner) {
      inner.style.position = 'relative';
      inner.appendChild(overlay);
    }
  }
}

function puzzleSuccessHTML(s) {
  return `
    <div class="puzzle-icon">✅</div>
    <div class="puzzle-title">STATION RESTORED</div>
    <div class="puzzle-desc">${s.name[lang]} is back online. The quantum core grows stronger.</div>
    <button class="puzzle-btn puzzle-btn-secondary" onclick="dismissPuzzle(${s.id})">Review simulation →</button>
    <button class="puzzle-btn puzzle-btn-primary" onclick="goHome()">Back to lab</button>`;
}

function showPuzzleSuccess(id) {
  const overlay = document.getElementById('puzzleOverlay' + id);
  if (!overlay) return;
  const s = STATIONS.find(x => x.id === id);
  overlay.className = 'puzzle-overlay puzzle-overlay-success';
  overlay.innerHTML = puzzleSuccessHTML(s);
  play('success');
  confetti();
  // Update progress
  PUZZLE[id].solved = true;
  // Sync to app.js progress state
  if (typeof progress !== 'undefined') { progress[id] = true; localStorage.setItem('qx_progress', JSON.stringify(progress)); }
  if (typeof renderProgress === 'function') renderProgress();
  if (typeof toast === 'function') toast(t('toast_done'));
  markComplete(id);
  updateLabProgress();
}

/* ── Wrapper compatible with app.js ───────────────────────── */
function markCompleteApp(id) {
  // Called by lab.js showPuzzleSuccess to update app.js progress
  if (typeof progress !== 'undefined') { progress[id] = true; localStorage.setItem('qx_progress', JSON.stringify(progress)); }
  if (typeof renderProgress === 'function') renderProgress();
  if (typeof toast === 'function') toast(t('toast_done'));
}

/* ── Circuit puzzle navigation ─────────────────────────────── */
function openCircuitPuzzle() {
  stopContinuous();
  stopAnimations();
  currentTopic = 7;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('circuitPage').classList.add('active');
  document.getElementById('headerTitle').textContent = t('st7_name');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  requestAnimationFrame(() => {
    if (typeof initCircuit7 === 'function') initCircuit7();
  });
}

/* ── Station completion (called by circuit.js) ────────────── */
function markStationSolved(id) {
  if (PUZZLE[id] && !PUZZLE[id].solved) {
    PUZZLE[id].solved = true;
    markComplete(id);
    updateLabProgress();
    confetti();
    play('success');
  }
}

function dismissPuzzle(id) {
  const overlay = document.getElementById('puzzleOverlay' + id);
  if (overlay) overlay.classList.add('hidden');
}

function updateLabProgress() {
  const done = STATIONS.filter(s => PUZZLE[s.id].solved).length;
  const bar = document.getElementById('coreProgressBar');
  const lbl = document.getElementById('coreProgressLabel');
  if (bar) bar.style.width = Math.round(done / 7 * 100) + '%';
  if (lbl) lbl.textContent = done + '/7 STATIONS';

  // Update station cards (handle both openTopic and openCircuitPuzzle)
  for (const s of STATIONS) {
    const sel = s.id === 7
      ? `[onclick="openCircuitPuzzle()"]`
      : `[onclick="openTopic(${s.id})"]`;
    const card = document.querySelector(sel);
    if (card && PUZZLE[s.id].solved) card.classList.add('online');
  }

  // Unlock core
  if (done === 7) {
    const panel = document.getElementById('corePanel');
    if (panel) {
      panel.classList.add('unlocked');
      panel.onclick = () => openQuantumCore();
      panel.style.cursor = 'pointer';
      panel.querySelector('.core-lock-icon').textContent = '⚛️';
    }
    toast('⚛️ Quantum Core unlocked!');
  }
}

/* ── Station 1: Interference Pattern Match ───────────────── */
// Called after every slit re-draw — compares current pattern to target
function checkStation1Match() {
  const p = PUZZLE[1];
  if (p.solved) return;

  const sep = parseFloat(document.getElementById('slitSep')?.value || 55);
  const energy = parseFloat(document.getElementById('energy')?.value || 55);

  // Score = 1 - normalised distance to (targetSep, targetEnergy)
  const ds = (sep - p.targetSep) / 80;
  const de = (energy - p.targetEnergy) / 90;
  const dist = Math.sqrt(ds*ds + de*de);
  const score = Math.max(0, 1 - dist * 2.5);

  p.best = Math.max(p.best, score);
  p.attempts++;

  const statusEl = document.getElementById('goalStatus1');
  if (statusEl) {
    const pct = Math.round(score * 100);
    statusEl.textContent = t('lab_match') + ': ' + pct + '%';
    statusEl.className = 'puzzle-goal-status' + (pct >= 80 ? ' ok' : '');
  }

  if (score >= 0.80 && !p.solved) {
    showPuzzleSuccess(1);
  }
}

/* ── Station 3: Uncertainty imaging ─────────────────────── */
// Called by updateUncertainty() — checks if within spec
function checkStation3Spec() {
  const p = PUZZLE[3];
  if (p.solved) return;

  const dx = parseFloat(document.getElementById('stDx')?.textContent || 1);
  const dp = parseFloat(document.getElementById('stDp')?.textContent || 1);
  const prod = dx * dp;

  const statusEl = document.getElementById('goalStatus3');
  if (statusEl) {
    const ok = prod <= 0.55 && dx < 0.45 && dp < 0.45;
    statusEl.textContent = `Δx·Δp = ${prod.toFixed(2)}`;
    statusEl.className = 'puzzle-goal-status' + (ok ? ' ok' : '');
    if (ok) showPuzzleSuccess(3);
  }
}

/* ── Station 4: Qubit Runner score gate ─────────────────── */
// Called by QR on game over if score >= 100
function checkStation4Score(score) {
  if (PUZZLE[4].solved) return;
  if (score >= PUZZLE[4].scoreNeeded) {
    showPuzzleSuccess(4);
  }
}

/* ── Station 5: Bell violation ───────────────────────────── */
// Called by measureBatch5 when 40 trials done
function checkStation5Bell(trials, corrPct) {
  if (PUZZLE[5].solved) return;
  const statusEl = document.getElementById('goalStatus5');
  if (statusEl) {
    statusEl.textContent = `${trials} trials · ${corrPct}% match`;
    if (trials >= 40) {
      // CHSH violation: at 0° same-basis, QM predicts 100% match
      // Classical bound: 75% for optimally-chosen angles
      const violation = corrPct > 80 || corrPct < 20; // either pole of correlation
      statusEl.className = 'puzzle-goal-status' + (violation ? ' ok' : '');
      if (violation) showPuzzleSuccess(5);
    }
  }
}

/* ── Station 6: Decoherence log ──────────────────────────── */
// Called each time openBox6() is called
function logStation6Open(catAlive, waitTime) {
  const p = PUZZLE[6];
  if (p.solved) return;
  p.opens++;
  p.log.push({ alive: catAlive, wait: waitTime });

  const statusEl = document.getElementById('goalStatus6');
  if (statusEl) {
    statusEl.textContent = `${p.opens}/${p.opensNeeded} observations`;
    statusEl.className = 'puzzle-goal-status' + (p.opens >= p.opensNeeded ? ' ok' : '');
  }

  if (p.opens >= p.opensNeeded) {
    showPuzzleSuccess(6);
  }
}

/* ── Quantum Core: Grover's Search ───────────────────────── */
function openQuantumCore() {
  stopAnimations && stopAnimations();
  stopContinuous && stopContinuous();
  if (typeof QR !== 'undefined') cancelAnimationFrame(QR.raf);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const corePage = document.getElementById('corePage');
  if (corePage) {
    corePage.classList.add('active');
    document.getElementById('headerTitle').textContent = t('lab_title');
    window.scrollTo({ top: 0, behavior: 'auto' });
    buildGroverPage();
  }
}

let groverTarget = -1;
let groverQuantumSteps = 0;
let groverClassicalSteps = 0;
let groverRunning = false;
let groverAmps = [0.25, 0.25, 0.25, 0.25]; // equal superposition
let insightsLit = 0;

function buildGroverPage() {
  groverTarget = -1;
  groverQuantumSteps = 0;
  groverClassicalSteps = 0;
  groverRunning = false;
  groverAmps = [0.25, 0.25, 0.25, 0.25];
  insightsLit = 0;
  renderGroverState();
}

function groverPickTarget(idx) {
  if (groverRunning || groverTarget !== -1) return;
  groverTarget = idx;
  groverAmps = [0.25, 0.25, 0.25, 0.25];
  groverQuantumSteps = 0;
  groverClassicalSteps = 0;
  insightsLit = 0;

  // Mark as target
  document.querySelectorAll('.grover-item').forEach((el, i) => {
    el.classList.toggle('target', i === groverTarget);
  });
  document.getElementById('groverRunBtn').disabled = false;
  document.getElementById('groverStatus').textContent = t('lab_target_locked');
  lightInsight(0); // superposition always active from start
}

function groverRun() {
  if (groverRunning || groverTarget === -1) return;
  groverRunning = true;
  document.getElementById('groverRunBtn').disabled = true;
  document.getElementById('groverPickLabel').textContent = '';
  document.getElementById('groverStatus').textContent = t('lab_search_running');

  // Step 1: Hadamard (already in superposition — show it)
  lightInsight(0); // superposition
  setTimeout(() => {
    // Oracle: flip phase of target
    groverAmps = groverAmps.map((a, i) => i === groverTarget ? -a : a);
    lightInsight(1); // entanglement / phase kickback
    groverQuantumSteps = 1;
    renderGroverAmps();

    setTimeout(() => {
      // Grover diffusion: invert about average
      const avg = groverAmps.reduce((s, a) => s + a, 0) / 4;
      groverAmps = groverAmps.map(a => 2 * avg - a);
      lightInsight(2); // interference — amplitude of target grew
      groverQuantumSteps = 2;
      renderGroverAmps();

      setTimeout(() => {
        // Measure: target probability ≈ 100% after 1 iteration for N=4
        groverAmps = groverAmps.map((a, i) => i === groverTarget ? 1.0 : 0.0);
        lightInsight(3); // collapse
        groverQuantumSteps = 3;
        renderGroverAmps();

        // Mark quantum found
        document.querySelectorAll('.grover-item')[groverTarget].classList.add('found');
        document.getElementById('groverQuantumCount').textContent = '1';
        document.getElementById('groverStatus').textContent = t('lab_search_complete');

        setTimeout(() => runClassicalComparison(), 800);
      }, 900);
    }, 900);
  }, 600);
}

function runClassicalComparison() {
  // Simulate classical linear search (random order)
  const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  let steps = 0;
  lightInsight(4); // tunneling analogy (classical has no shortcut)

  const tick = () => {
    if (steps >= order.length) {
      const avg = 2.5;
      document.getElementById('groverClassicalCount').textContent = (steps).toString();
      document.getElementById('groverClassicalUnit').textContent = `queries (avg ${avg})`;
      document.getElementById('groverStatus').textContent =
        'Quantum: 1 query · Classical: ' + steps + ' queries. Quantum wins.';
      groverRunning = false;
      document.getElementById('groverResetBtn').style.display = 'inline-block';
      lightInsight(5); // final: why this matters
      return;
    }
    const el = document.querySelectorAll('.grover-item')[order[steps]];
    el.classList.add('searched-classical');
    steps++;
    if (order[steps - 1] === groverTarget) {
      document.getElementById('groverClassicalCount').textContent = steps.toString();
      document.getElementById('groverStatus').textContent =
        'Quantum: 1 query · Classical: ' + steps + ' queries. Quantum wins.';
      groverRunning = false;
      document.getElementById('groverResetBtn').style.display = 'inline-block';
      lightInsight(5);
      return;
    }
    setTimeout(tick, 500);
  };
  setTimeout(tick, 300);
}

function groverReset() {
  document.querySelectorAll('.grover-item').forEach(el => {
    el.classList.remove('target', 'found', 'searched-classical');
  });
  groverTarget = -1;
  groverQuantumSteps = 0;
  groverClassicalSteps = 0;
  groverRunning = false;
  groverAmps = [0.25, 0.25, 0.25, 0.25];
  insightsLit = 0;
  document.getElementById('groverRunBtn').disabled = true;
  document.getElementById('groverResetBtn').style.display = 'none';
  document.getElementById('groverQuantumCount').textContent = '—';
  document.getElementById('groverClassicalCount').textContent = '—';
  document.getElementById('groverClassicalUnit').textContent = 'queries';
  document.getElementById('groverPickLabel').textContent = '← Pick a target item';
  document.getElementById('groverStatus').textContent = 'Select a database item to mark as the target, then run the search.';
  document.querySelectorAll('.core-insight-item').forEach(el => el.classList.remove('lit'));
  renderGroverAmps();
}

function renderGroverAmps() {
  document.querySelectorAll('.grover-amp-fill').forEach((fill, i) => {
    const pct = Math.abs(groverAmps[i]) * 100;
    fill.style.height = pct + '%';
    fill.style.background = groverAmps[i] < 0
      ? 'rgba(255, 107, 125, 0.8)'
      : (i === groverTarget ? 'var(--cyan)' : 'var(--violet)');
  });
}

function lightInsight(idx) {
  const items = document.querySelectorAll('.core-insight-item');
  if (items[idx]) items[idx].classList.add('lit');
}

function renderGroverState() {
  // Render the full Grover page HTML
  const page = document.getElementById('corePage');
  if (!page) return;

  const items = [0,1,2,3].map(i => `
    <div class="grover-item" onclick="groverPickTarget(${i})">
      <div class="grover-amp-bar">
        <div class="grover-amp-fill" style="height:25%"></div>
      </div>
      <div class="grover-label">Item ${i+1}</div>
    </div>`).join('');

  const insights = [
    { label: '01 · SUPERPOSITION', text: 'The quantum computer checks <b>all 4 items at once</b> using superposition — a wave of probability amplitudes.' },
    { label: '02 · PHASE KICKBACK', text: 'The <b>oracle flips the phase</b> of the target — a quantum trick that marks it without reading it.' },
    { label: '03 · INTERFERENCE', text: '<b>Amplitudes interfere</b> like waves — the target grows, others cancel. One Grover iteration suffices for N=4.' },
    { label: '04 · COLLAPSE', text: 'Measurement <b>collapses</b> the wave: the target now has ~100% probability. Found in 1 query.' },
    { label: '05 · NO SHORTCUT', text: 'A classical computer has no wave to amplify — it must <b>check items one by one</b>. Average: N/2 = 2.5 queries.' },
    { label: '06 · THE ADVANTAGE', text: 'For N items, quantum needs <b>√N queries</b>, classical needs N/2. For large databases, this gap is enormous.' },
  ].map((ins, i) => `
    <div class="core-insight-item" id="insight${i}">
      <div class="core-insight-num">${ins.label}</div>
      <div class="core-insight-text">${ins.text}</div>
    </div>`).join('');

  page.innerHTML = `
  <div class="core-page">
    <button class="back-btn" onclick="goHome()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Back to lab</span>
    </button>

    <div style="text-align:center;margin:28px 0 36px">
      <div style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;letter-spacing:3px;color:var(--violet);margin-bottom:12px">
        QUANTUM CORE · FINAL EXPERIMENT
      </div>
      <h1 style="font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:800;
                 background:linear-gradient(125deg,var(--violet),var(--cyan));
                 -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
                 margin-bottom:14px">
        Grover's Quantum Search
      </h1>
      <p style="font-size:1rem;color:var(--text-secondary);max-width:580px;margin:0 auto;line-height:1.8">
        A quantum computer searches a 4-item database in <strong style="color:var(--cyan)">1 query</strong>.
        A classical computer takes <strong style="color:#ffb347">2.5 on average</strong>.
        Pick the hidden item and watch both algorithms race.
      </p>
    </div>

    <div class="core-phase">
      <div class="core-phase-label">DATABASE — CLICK TO MARK THE TARGET</div>
      <div style="font-size:0.85rem;color:var(--text-dim);margin-bottom:14px" id="groverPickLabel">← Pick a target item</div>
      <div class="grover-grid">${items}</div>

      <div class="grover-vs">
        <div class="grover-algo-box quantum">
          <div class="grover-algo-title">QUANTUM</div>
          <div class="grover-algo-count" id="groverQuantumCount">—</div>
          <div class="grover-algo-unit">queries</div>
        </div>
        <div class="grover-vs-divider">VS</div>
        <div class="grover-algo-box classical">
          <div class="grover-algo-title">CLASSICAL</div>
          <div class="grover-algo-count" id="groverClassicalCount">—</div>
          <div class="grover-algo-unit" id="groverClassicalUnit">queries</div>
        </div>
      </div>

      <div style="text-align:center;margin-top:6px;font-size:0.88rem;color:var(--text-secondary)" id="groverStatus">
        Select a database item to mark as the target, then run the search.
      </div>

      <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
        <button class="btn btn-primary" id="groverRunBtn" onclick="groverRun()" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px">
            <polygon points="6 4 20 12 6 20 6 4"/>
          </svg>
          Run Quantum Search
        </button>
        <button class="btn btn-secondary" id="groverResetBtn" onclick="groverReset()" style="display:none">
          Reset
        </button>
      </div>
    </div>

    <div class="core-insight">${insights}</div>

    <div style="text-align:center;margin-top:40px;padding:28px;
                border:1px solid var(--line);border-radius:var(--radius-lg);
                background:rgba(255,255,255,0.02)">
      <div style="font-family:'Orbitron',sans-serif;font-size:0.72rem;letter-spacing:3px;
                  color:var(--cyan);margin-bottom:12px">THE TAKEAWAY</div>
      <p style="color:var(--text-secondary);max-width:620px;margin:0 auto;line-height:1.8;font-size:0.95rem">
        Every phenomenon you fixed in this lab — superposition, interference, entanglement, tunneling,
        collapse — is a <strong style="color:var(--text-primary)">tool quantum computers use</strong>.
        Without them, Grover's algorithm is impossible. With them, it changes everything.
      </p>
    </div>
  </div>`;
}
