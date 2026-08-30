'use strict';
/* ============================================================
   lab.js — Quantum Lab Redesign
   Replaces buildHome(); adds puzzle layer + Grover climax
   ============================================================ */

/* ── Station metadata ───────────────────────────────────── */
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
    goal: { th: 'เอียงลูกศรให้นอนราบ ( สมดุล 50:50) แล้ววัดให้ครบ 10 ครั้ง', en: 'Tilt the arrow flat (a 50:50 split) and measure 10 times' },
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
