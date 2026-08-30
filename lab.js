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
    goal: { th: 'เอียงลูกศรให้นอนราบ (สมดุล 50:50) แล้ววัดให้ครบ 10 ครั้ง', en: 'Tilt the arrow flat (a 50:50 split) and measure 10 times' },
    goalIcon: '🔍',
  },
  {
    id: 4, icon: '🚀',
    name: { th: 'สถานีที่ 3: การทะลุ', en: 'Station 3: Tunneling' },
    tagline: { th: 'นำทางอนุภาคผ่านสนามกำแพง', en: 'Navigate a particle through the barrier field' },
    goal: { th: 'เล่น Qubit Runner และทำคะแนนให้ถึง 100', en: 'Play Qubit Runner and score 100+' },
    goalIcon: '🎮',
  },
  {
    id: 7, icon: '⚡',
    name: { th: 'สถานีที่ 4: วงจรควอนตัม', en: 'Station 4: Circuit Puzzle' },
    tagline: { th: 'ประกอบวงจรควอนตัมด้วยการลากเกต', en: 'Build quantum circuits by dragging gates onto qubits' },
    goal: { th: 'สร้างวงจร Grover ดันกล่อง #2 ให้เกิน 75%', en: "Build Grover's circuit — push box #2 above 75%" },
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
  subtitle_ok:   { th: '<span class="hl">ครบทุกสถานีแล้ว!</span> กดเข้าแกนควอนตัมเพื่อดูการทดลองสุดท้ายเลย', en: '<span class="hl">All stations online!</span> Enter the Quantum Core for the final experiment.' },
  subtitle_bad:  { th: 'ซ่อมทุกสถานีให้ครบ เพื่อปลดล็อกการทดลองสุดท้าย', en: 'Beat every station to unlock the final experiment.' },
  core_label:    { th: 'แกนควอนตัม · การทดลองสุดท้าย', en: 'QUANTUM CORE · FINAL EXPERIMENT' },
  core_title:    { th: 'การค้นหาควอนตัมของ Grover', en: "Grover's Quantum Search" },
  core_ok:       { th: 'แกนออนไลน์แล้ว ดูควอนตัมคอมพิวเตอร์ค้นฐานข้อมูลใน 1 คิวรี — คอมพิวเตอร์ทั่วไปใช้เฉลี่ย 2.5', en: 'The core is online. Watch a quantum computer search a database in 1 query — a classical computer takes 2.5.' },
  core_bad:      { th: 'กู้ทุกสถานีเพื่อปลดล็อกการสาธิตสุดท้าย และชมความได้เปรียบของควอนตัมแบบสด ๆ', en: 'Restore all stations to unlock the final demonstration. See the quantum advantage live.' },
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

  const doneCount = STATIONS.filter(s => PUZZLE[s.id].solved).length;
  const total = STATIONS.length;

  let stationCards = STATIONS.map((s, i) => {
    const solved = PUZZLE[s.id].solved;
    const onclick = s.id === 7 ? 'openCircuitPuzzle()' : `openTopic(${s.id})`;
    return `\n    <button class="station-card${solved ? ' online' : ''}"\n      data-station="${s.id}"\n      onclick="${onclick}"\n      onmousemove="stationGlow(event,this)"\n      onpointerenter="play('hover')"\n      aria-label="${s.name[lang]}">\n      <div class="station-number">\n        <span class="station-status-dot"></span>\n        STATION-0${i + 1} · ${solved ? LT('online') : LT('offline')}\n      </div>\n      <span class="station-icon">${s.icon}</span>\n      <div class="station-name">${s.name[lang]}</div>\n      <div class="station-tagline">${s.tagline[lang]}</div>\n      <div class="station-play">${solved ? '✔ ' + LT('replay_btn') : '▶ ' + LT('play_btn')}</div>\n      <div class="station-done-ring">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">\n          <path d="M20 6L9 17l-5-5"/>\n        </svg>\n      </div>\n    </button>`;
  }).join('');

  const coreUnlocked = doneCount === total;
  const coreClass = coreUnlocked ? 'quantum-core-panel unlocked' : 'quantum-core-panel';
  const coreCursor = coreUnlocked ? '' : 'style="cursor:not-allowed"';
  const pct = Math.round(doneCount / total * 100);

  page.innerHTML = `\n  <div class="lab-home qx-flow">\n    <div class="qx-hero">\n      <div class="qx-hero-eyebrow">\n        <span class="qx-breach-dot"></span>${lang === 'th' ? 'แล็บควอนตัม · ระบบกำลังพัง' : 'QUANTUM FACILITY · CONTAINMENT BREACH'}\n      </div>\n      <h1 class="qx-hero-title">${lang === 'th' ? 'คุณคืออนุภาคควอนตัม<br>ในแล็บที่กำลังพัง' : "You're a quantum particle<br>in a facility mid-breach"}</h1>\n      <p class="qx-hero-sub">${lang === 'th' ? 'เลือกสิ่งที่อยากลอง — ใช้เวลาแค่ 10 วิ แล้วแชร์ได้เลย ⚛' : 'pick your vibe — 10 seconds, then share it ⚛'}</p>\n    </div>\n\n    <div class="qx-hooks">\n      <button class="qx-hook qx-hook-aura" onclick="openAura()" onpointerenter="play('hover')" aria-label="Quantum Aura">\n        <div class="qx-hook-orb">🔮</div>\n        <div class="qx-hook-title">${lang === 'th' ? 'วัดออร่าควอนตัม' : 'Measure your Aura'}</div>\n        <div class="qx-hook-sub">${lang === 'th' ? 'แตะ → ยุบตัวจริง → การ์ดแชร์ได้' : 'tap → real collapse → shareable card'}</div>\n      </button>\n      <button class="qx-hook qx-hook-chat" onclick="openChat()" onpointerenter="play('hover')" aria-label="Text the Particle">\n        <div class="qx-hook-orb">💬</div>\n        <div class="qx-hook-title">${lang === 'th' ? 'แชทกับอนุภาค' : 'Text the Particle'}</div>\n        <div class="qx-hook-sub">${lang === 'th' ? 'มันส่ง DM มา 👀 คุยกับมันสิ' : 'it just DMed you 👀 reply to it'}</div>\n      </button>\n    </div>\n\n    <div class="quantum-core-panel unlocked" id="corePanel" onclick="openQuantumCore()">\n      <div class="core-lock-icon">⚛️</div>\n      <div class="core-content">\n        <div class="core-label">${LT('core_label')}</div>\n        <div class="core-title">${LT('core_title')}</div>\n        <div class="core-desc">${LT('core_ok')}</div>\n      </div>\n      <button class="core-cta" onclick="event.stopPropagation();openQuantumCore()">LAUNCH →</button>\n    </div>\n\n    ${typeof CT === 'function' ? `\n    <button class="coop-banner" onclick="openCoop()" onpointerenter="play('hover')">\n      <div class="coop-banner-icon">👥</div>\n      <div class="coop-banner-content">\n        <div class="coop-banner-label">${CT('banner_label')}</div>\n        <div class="coop-banner-title">${CT('banner_title')}</div>\n        <div class="coop-banner-desc">${CT('banner_desc')}</div>\n      </div>\n      <div class="coop-banner-play">▶</div>\n    </button>` : ''}\n  </div>`;
}
