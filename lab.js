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
    tagline: { th: 'ปรับคิวบิตให้สมดุล 50:50 แล้ววัดซ้ำ', en: 'Balance the qubit 50:50 and measure it' },
    goal: { th: 'ตั้ง θ = 90° (สมดุล 50:50) แล้ววัดให้ครบ 10 ครั้ง', en: 'Set θ = 90° (a 50:50 split) and take 10 measurements' },
    goalIcon: '🔍',
  },
  {
    id: 3, icon: '📈',
    name: { th: 'สถานีที่ 3: ความไม่แน่นอน', en: 'Station 3: Uncertainty' },
    tagline: { th: 'บีบกลุ่มคลื่นให้คมที่สุดเท่าที่ธรรมชาติยอม', en: 'Squeeze the wave packet as sharp as nature allows' },
    goal: { th: 'ทำให้ Δx < 0.60 โดยที่ Δx·Δp ≤ 0.55 (บีบความกว้างให้แคบ)', en: 'Get Δx < 0.60 while keeping Δx·Δp ≤ 0.55 (narrow the width)' },
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
    goal: { th: 'สร้างวงจร Grover ให้ |2⟩ ได้ความน่าจะเป็น ≥ 75%', en: "Build Grover's circuit — get |2⟩ probability ≥ 75%" },
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
  // Station 2: balanced-qubit measurements
  2: {
    balancedNeeded: 10,
    balancedCount: 0,
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

/* ── Lab-only bilingual strings ───────────────────────────── */
const LAB_I18N = {
  alert_ok:      { th: 'ระบบควอนตัม — ทุกสถานีทำงานปกติ', en: 'QUANTUM FACILITY — ALL STATIONS NOMINAL' },
  alert_bad:     { th: (n) => `ระบบควอนตัม — ขัดข้องรุนแรง — ${n} สถานีออฟไลน์`, en: (n) => `QUANTUM FACILITY — CRITICAL FAILURE — ${n} STATION${n === 1 ? '' : 'S'} OFFLINE` },
  title_ok:      { th: 'ออนไลน์เต็มระบบ', en: 'FULLY ONLINE' },
  title_bad:     { th: 'ห้องแล็บฉุกเฉิน', en: 'LAB EMERGENCY' },
  subtitle_ok:   { th: '<span class="hl">ครบ 7 สถานีแล้ว!</span> กดเข้าแกนควอนตัมเพื่อดูการทดลองสุดท้ายเลย', en: '<span class="hl">All 7 stations online!</span> Enter the Quantum Core for the final experiment.' },
  subtitle_bad:  { th: '<span class="hl">แกนควอนตัมล่ม!</span> เล่นเกมซ่อมทั้ง 7 สถานีให้ครบ เพื่อปลดล็อกการทดลองสุดท้าย', en: '<span class="hl">The quantum core is down!</span> Beat all 7 station games to unlock the final experiment.' },
  core_label:    { th: 'แกนควอนตัม · การทดลองสุดท้าย', en: 'QUANTUM CORE · FINAL EXPERIMENT' },
  core_title:    { th: 'การค้นหาควอนตัมของ Grover', en: "Grover's Quantum Search" },
  core_ok:       { th: 'แกนออนไลน์แล้ว ดูควอนตัมคอมพิวเตอร์ค้นฐานข้อมูลใน 1 คิวรี — คอมพิวเตอร์ทั่วไปใช้เฉลี่ย 2.5', en: 'The core is online. Watch a quantum computer search a database in 1 query — a classical computer takes 2.5.' },
  core_bad:      { th: 'กู้ทั้ง 7 สถานีเพื่อปลดล็อกการสาธิตสุดท้าย และชมความได้เปรียบของควอนตัมแบบสด ๆ', en: 'Restore all 7 stations to unlock the final demonstration. See the quantum advantage live.' },
  stations_unit: { th: 'สถานี', en: 'STATIONS' },
  mission:       { th: 'เป้าหมายภารกิจ', en: 'MISSION OBJECTIVE' },
  online:        { th: 'ออนไลน์', en: 'ONLINE' },
  offline:       { th: 'ออฟไลน์', en: 'OFFLINE' },
  play_btn:      { th: 'เล่นเลย', en: 'PLAY' },
  replay_btn:    { th: 'ผ่านแล้ว · เล่นซ้ำ', en: 'DONE · Replay' },
  restored_t:    { th: 'ซ่อมสถานีสำเร็จ!', en: 'STATION RESTORED' },
  restored_d:    { th: (n) => `${n} กลับมาออนไลน์แล้ว แกนควอนตัมแข็งแกร่งขึ้น`, en: (n) => `${n} is back online. The quantum core grows stronger.` },
  btn_review:    { th: 'ดูการทดลองต่อ →', en: 'Review simulation →' },
  btn_back_lab:  { th: 'กลับห้องแล็บ', en: 'Back to lab' },
  core_unlocked: { th: '⚛️ ปลดล็อกแกนควอนตัมแล้ว!', en: '⚛️ Quantum Core unlocked!' },
};
function LT(key, arg) {
  const e = LAB_I18N[key];
  if (!e) return key;
  const v = e[lang] || e.en;
  return typeof v === 'function' ? v(arg) : v;
}

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
      data-station="${s.id}"
      onclick="${onclick}"
      onmousemove="stationGlow(event,this)"
      onpointerenter="play('hover')"
      aria-label="${s.name[lang]}">
      <div class="station-number">
        <span class="station-status-dot"></span>
        STATION-0${s.id} · ${solved ? LT('online') : LT('offline')}
      </div>
      <span class="station-icon">${s.icon}</span>
      <div class="station-name">${s.name[lang]}</div>
      <div class="station-tagline">${s.tagline[lang]}</div>
      <div class="station-play">${solved ? '✔ ' + LT('replay_btn') : '▶ ' + LT('play_btn')}</div>
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
      ${doneCount === 7 ? LT('alert_ok') : LT('alert_bad', 7 - doneCount)}
    </div>

    <h1 class="lab-title">
      <div class="lab-title-line1">QUANTUM</div>
      <div class="lab-title-line2">${doneCount === 7 ? LT('title_ok') : LT('title_bad')}</div>
    </h1>

    <p class="lab-subtitle">
      ${doneCount === 7 ? LT('subtitle_ok') : LT('subtitle_bad')}
    </p>

    <div class="station-grid">${stationCards}</div>

    ${typeof CT === 'function' ? `
    <button class="coop-banner" onclick="openCoop()" onpointerenter="play('hover')">
      <div class="coop-banner-icon">👥</div>
      <div class="coop-banner-content">
        <div class="coop-banner-label">${CT('banner_label')}</div>
        <div class="coop-banner-title">${CT('banner_title')}</div>
        <div class="coop-banner-desc">${CT('banner_desc')}</div>
      </div>
      <div class="coop-banner-play">▶</div>
    </button>` : ''}

    <div class="${coreClass}" id="corePanel" onclick="${coreUnlocked ? 'openQuantumCore()' : ''}" ${coreCursor}>
      <div class="core-lock-icon">${coreUnlocked ? '⚛️' : '🔒'}</div>
      <div class="core-content">
        <div class="core-label">${LT('core_label')}</div>
        <div class="core-title">${LT('core_title')}</div>
        <div class="core-desc">
          ${coreUnlocked ? LT('core_ok') : LT('core_bad')}
        </div>
        <div class="core-progress">
          <div class="core-progress-bar-wrap">
            <div class="core-progress-bar" id="coreProgressBar" style="width:${pct}%"></div>
          </div>
          <div class="core-progress-label" id="coreProgressLabel">${doneCount}/7 ${LT('stations_unit')}</div>
        </div>
      </div>
      ${coreUnlocked ? '<button class="core-cta" onclick="event.stopPropagation();openQuantumCore()">LAUNCH →</button>' : ''}
    </div>
  </div>`;
}

/* ── Refresh lab-generated text after a language switch ───── */
function updateLabGoalStrips() {
  for (const s of STATIONS) {
    const desc = document.getElementById('goalDesc' + s.id);
    if (desc) desc.textContent = s.goal[lang];
    const label = document.getElementById('goalLabel' + s.id);
    if (label) label.textContent = LT('mission');
  }
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
          <div class="puzzle-goal-label" id="goalLabel${s.id}">${LT('mission')}</div>
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
    <div class="puzzle-inner">
      <div class="puzzle-icon">✅</div>
      <div class="puzzle-title">${LT('restored_t')}</div>
      <div class="puzzle-desc">${LT('restored_d', s.name[lang])}</div>
      <button class="puzzle-btn puzzle-btn-secondary" onclick="dismissPuzzle(${s.id})">${LT('btn_review')}</button>
      <button class="puzzle-btn puzzle-btn-primary" onclick="goHome()">${LT('btn_back_lab')}</button>
    </div>`;
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
  document.getElementById('headerTitle').textContent = t('t7_title');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  if (typeof initCircuit7 === 'function') initCircuit7();
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

let coreUnlockToasted = false;

function updateLabProgress(silent) {
  const done = STATIONS.filter(s => PUZZLE[s.id].solved).length;
  const bar = document.getElementById('coreProgressBar');
  const lbl = document.getElementById('coreProgressLabel');
  if (bar) bar.style.width = Math.round(done / 7 * 100) + '%';
  if (lbl) lbl.textContent = done + '/7 ' + LT('stations_unit');

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
    if (!silent && !coreUnlockToasted) {
      coreUnlockToasted = true;
      toast(LT('core_unlocked'));
    }
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

/* ── Station 2: balanced-qubit measurements ─────────────── */
// Called by measure2() — counts measurements taken at θ ≈ 90° (50:50)
function checkStation2Super() {
  const p = PUZZLE[2];
  if (p.solved) return;

  const theta = parseFloat(document.getElementById('theta')?.value || 0);
  if (Math.abs(theta - 90) <= 5) p.balancedCount++;

  const statusEl = document.getElementById('goalStatus2');
  if (statusEl) {
    statusEl.textContent = `${p.balancedCount}/${p.balancedNeeded} @ θ=90°`;
    statusEl.className = 'puzzle-goal-status' + (p.balancedCount >= p.balancedNeeded ? ' ok' : '');
  }

  if (p.balancedCount >= p.balancedNeeded) {
    showPuzzleSuccess(2);
  }
}

/* ── Station 3: Uncertainty imaging ─────────────────────── */
// Called by updateUncertainty() — checks if within spec.
// Achievable: narrow the width slider so Δx < 0.60 near t = 0
// (Δx·Δp is 0.50 at t=0 and grows as the packet spreads).
function checkStation3Spec() {
  const p = PUZZLE[3];
  if (p.solved) return;

  const dx = parseFloat(document.getElementById('stDx')?.textContent || 1);
  const dp = parseFloat(document.getElementById('stDp')?.textContent || 1);
  const prod = dx * dp;

  const statusEl = document.getElementById('goalStatus3');
  if (statusEl) {
    const ok = prod <= 0.55 && dx < 0.60;
    statusEl.textContent = `Δx = ${dx.toFixed(2)} · Δx·Δp = ${prod.toFixed(2)}`;
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

  const winMsg = (n) => lang === 'th'
    ? `ควอนตัม: 1 คิวรี · คลาสสิก: ${n} คิวรี — ควอนตัมชนะ!`
    : `Quantum: 1 query · Classical: ${n} queries. Quantum wins.`;

  const tick = () => {
    if (steps >= order.length) {
      const avg = 2.5;
      document.getElementById('groverClassicalCount').textContent = (steps).toString();
      document.getElementById('groverClassicalUnit').textContent = `${t('lab_classical_q')} (avg ${avg})`;
      document.getElementById('groverStatus').textContent = winMsg(steps);
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
      document.getElementById('groverStatus').textContent = winMsg(steps);
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
  document.getElementById('groverClassicalUnit').textContent = t('lab_classical_q');
  document.getElementById('groverPickLabel').textContent = lang === 'th' ? '← เลือกไอเทมเป้าหมาย' : '← Pick a target item';
  document.getElementById('groverStatus').textContent = t('lab_select_target');
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

  const gv = (th, en) => (lang === 'th' ? th : en);

  const items = [0,1,2,3].map(i => `
    <div class="grover-item" onclick="groverPickTarget(${i})">
      <div class="grover-amp-bar">
        <div class="grover-amp-fill" style="height:25%"></div>
      </div>
      <div class="grover-label">${gv('ไอเทม', 'Item')} ${i+1}</div>
    </div>`).join('');

  const insights = [
    { label: gv('01 · ซ้อนทับ', '01 · SUPERPOSITION'), text: gv('ควอนตัมตรวจ<b>ทั้ง 4 ไอเทมพร้อมกัน</b>', 'Quantum checks <b>all 4 items at once</b>.') },
    { label: gv('02 · กลับเฟส', '02 · PHASE KICKBACK'), text: gv('Oracle <b>ทำเครื่องหมายเป้าหมาย</b>โดยไม่ต้องอ่านค่า', 'The oracle <b>marks the target</b> without reading it.') },
    { label: gv('03 · การแทรกสอด', '03 · INTERFERENCE'), text: gv('คลื่นแทรกสอด — <b>เป้าหมายโตขึ้น</b> ตัวอื่นหักล้างหาย', 'Waves interfere — <b>the target grows</b>, the rest cancel.') },
    { label: gv('04 · การยุบตัว', '04 · COLLAPSE'), text: gv('วัดปุ๊บ เจอเป้าหมาย <b>ใน 1 คิวรีเดียว</b>', 'Measure — target found <b>in just 1 query</b>.') },
    { label: gv('05 · ไม่มีทางลัด', '05 · NO SHORTCUT'), text: gv('คลาสสิกต้อง<b>เปิดดูทีละอัน</b> เฉลี่ย 2.5 ครั้ง', 'Classical must <b>check one by one</b> — 2.5 on average.') },
    { label: gv('06 · ความได้เปรียบ', '06 · THE ADVANTAGE'), text: gv('ยิ่งฐานข้อมูลใหญ่ ควอนตัมยิ่งทิ้งห่าง (<b>√N</b> ต่อ N/2)', 'The bigger the database, the bigger the gap (<b>√N</b> vs N/2).') },
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
      <span>${LT('btn_back_lab')}</span>
    </button>

    <div style="text-align:center;margin:28px 0 36px">
      <div style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;letter-spacing:3px;color:var(--violet);margin-bottom:12px">
        ${LT('core_label')}
      </div>
      <h1 style="font-family:'Orbitron',sans-serif;font-size:clamp(1.8rem,4vw,3rem);font-weight:800;
                 background:linear-gradient(125deg,var(--violet),var(--cyan));
                 -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
                 margin-bottom:14px">
        ${LT('core_title')}
      </h1>
      <p style="font-size:1rem;color:var(--text-secondary);max-width:580px;margin:0 auto;line-height:1.8">
        ${gv(
          'ควอนตัมคอมพิวเตอร์ค้นฐานข้อมูล 4 ไอเทมใน <strong style="color:var(--cyan)">1 คิวรี</strong> คอมพิวเตอร์ทั่วไปใช้ <strong style="color:var(--gold)">เฉลี่ย 2.5</strong> — เลือกไอเทมลับแล้วดูสองอัลกอริทึมแข่งกัน',
          'A quantum computer searches a 4-item database in <strong style="color:var(--cyan)">1 query</strong>. A classical computer takes <strong style="color:var(--gold)">2.5 on average</strong>. Pick the hidden item and watch both algorithms race.'
        )}
      </p>
    </div>

    <div class="station-video-wrap" style="max-width:900px;margin:0 auto 28px">
      <div class="station-video-label">${gv('🎬 แกนควอนตัมออนไลน์', '🎬 QUANTUM CORE ONLINE')}</div>
      <video class="station-video" src="https://d8j0ntlcm91z4.cloudfront.net/user_3GoMLVnG8OtCKYFji8KiOMERBWu/hf_20260722_104333_c1ccbfff-2a9e-4da2-bbc1-1ec71bd03977.mp4" controls playsinline preload="metadata" poster="https://d8j0ntlcm91z4.cloudfront.net/user_3GoMLVnG8OtCKYFji8KiOMERBWu/hf_20260722_100242_f63c22ab-d800-4a9a-b8fc-cbb262bd39e8.png"></video>
    </div>

    <div class="core-phase">
      <div class="core-phase-label">${gv('ฐานข้อมูล — คลิกเพื่อเลือกเป้าหมาย', 'DATABASE — CLICK TO MARK THE TARGET')}</div>
      <div style="font-size:0.85rem;color:var(--text-dim);margin-bottom:14px" id="groverPickLabel">${gv('← เลือกไอเทมเป้าหมาย', '← Pick a target item')}</div>
      <div class="grover-grid">${items}</div>

      <div class="grover-vs">
        <div class="grover-algo-box quantum">
          <div class="grover-algo-title">${gv('ควอนตัม', 'QUANTUM')}</div>
          <div class="grover-algo-count" id="groverQuantumCount">—</div>
          <div class="grover-algo-unit">${t('lab_classical_q')}</div>
        </div>
        <div class="grover-vs-divider">VS</div>
        <div class="grover-algo-box classical">
          <div class="grover-algo-title">${gv('คลาสสิก', 'CLASSICAL')}</div>
          <div class="grover-algo-count" id="groverClassicalCount">—</div>
          <div class="grover-algo-unit" id="groverClassicalUnit">${t('lab_classical_q')}</div>
        </div>
      </div>

      <div style="text-align:center;margin-top:6px;font-size:0.88rem;color:var(--text-secondary)" id="groverStatus">
        ${t('lab_select_target')}
      </div>

      <div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
        <button class="btn btn-primary" id="groverRunBtn" onclick="groverRun()" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px">
            <polygon points="6 4 20 12 6 20 6 4"/>
          </svg>
          ${gv('รันควอนตัมเซิร์ช', 'Run Quantum Search')}
        </button>
        <button class="btn btn-secondary" id="groverResetBtn" onclick="groverReset()" style="display:none">
          ${gv('เริ่มใหม่', 'Reset')}
        </button>
      </div>
    </div>

    <div class="core-insight">${insights}</div>

    <div style="text-align:center;margin-top:40px;padding:28px;
                border:1px solid var(--border-light, var(--line));border-radius:var(--radius-lg);
                background:var(--bg-card);box-shadow:0 0 30px rgba(212,165,116,0.06)">
      <div style="font-family:'Orbitron',sans-serif;font-size:0.72rem;letter-spacing:3px;
                  color:var(--gold);margin-bottom:12px">${gv('บทสรุป', 'THE TAKEAWAY')}</div>
      <p style="color:var(--text-secondary);max-width:620px;margin:0 auto;line-height:1.8;font-size:0.95rem">
        ${gv(
          'ทุกสถานีที่คุณซ่อม คือ<strong style="color:var(--text-primary)">เครื่องมือจริงของควอนตัมคอมพิวเตอร์</strong> และคุณเพิ่งใช้มันครบทุกชิ้น',
          "Every station you repaired is a <strong style=\"color:var(--text-primary)\">real tool of quantum computing</strong>, and you just used them all."
        )}
      </p>
    </div>
  </div>`;
}
