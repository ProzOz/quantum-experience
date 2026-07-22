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
const PUZZLE = {
  1: { targetSep: 60, targetEnergy: 40, attempts: 0, maxAttempts: 10, best: 0, solved: false },
  2: { balancedNeeded: 10, balancedCount: 0, solved: false },
  3: { attempts: 0, solved: false },
  4: { scoreNeeded: 100, solved: false },
  5: { trialsNeeded: 40, solved: false },
  6: { solved: false },
  7: { solved: false },
};

const STATION_THEORY = {
  1: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> ความเป็นคู่ของคลื่น-อนุภาค</h3>
        <p>แสงและอนุภาคทุกชนิดมีธรรมชาติสองด้าน: เป็นได้ทั้งอนุภาค (จุด) และคลื่น (ลายแถบ) พร้อมกัน! นี่เรียกว่า Wave-Particle Duality ซึ่งเป็นหลักการพื้นฐานของกลศาสตร์ควอนตัม</p>
      </div>
      <div class="theory-equation">
        <code>λ = h / p</code>
        <span>ความยาวคลื่นเดอบรอยล์ = ค่าคงที่พลังค์ / โมเมนตัม</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>กล้องจุลทรรศน์อิเล็กตรอน (TEM) - ทำงานด้วยคุณสมบัติคลื่นของอิเล็กตรอน</li>
          <li>เทคโนโลยี LCD และ LED - ใช้หลักการแทรกสอดของแสง</li>
          <li>Holography (โฮโลแกรม) - การบันทึกภาพสามมิติ</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Wave-Particle Duality</h3>
        <p>Light and all particles have a dual nature: they can behave as both particles (dots) and waves (interference patterns) simultaneously! This is called Wave-Particle Duality, a fundamental principle of quantum mechanics.</p>
      </div>
      <div class="theory-equation">
        <code>λ = h / p</code>
        <span>de Broglie wavelength = Planck's constant / momentum</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Transmission Electron Microscope (TEM) - uses electron wave properties</li>
          <li>LCD and LED technology - uses light interference principles</li>
          <li>Holography - 3D image recording technology</li>
        </ul>
      </div>
    `
  },
  2: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> การซ้อนทับเชิงควอนตัม (Superposition)</h3>
        <p>คิวบิต (qubit) สามารถอยู่ในสถานะ 0 และ 1 พร้อมกัน จนกว่าจะถูกวัด นี่คือหลักการ Superposition ที่ทำให้ควอนตัมคอมพิวเตอร์ทำงานได้เร็วกว่าคอมพิวเตอร์ปกติหลายเท่า</p>
      </div>
      <div class="theory-equation">
        <code>|ψ⟩ = α|0⟩ + β|1⟩</code>
        <span>สถานะคิวบิต = ความน่าจะเป็นของ 0 + ความน่าจะเป็นของ 1</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>ควอนตัมคอมพิวเตอร์ - ประมวลผลหลายเส้นทางพร้อมกัน</li>
          <li>Quantum cryptography - การเข้ารหัสที่ไม่สามารถแฮ็กได้</li>
          <li>Quantum sensors - เซ็นเซอร์ที่แม่นยำสูงมาก</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Quantum Superposition</h3>
        <p>A qubit can exist in both 0 and 1 states simultaneously until measured. This is the Superposition principle that makes quantum computers exponentially faster than regular computers for certain problems.</p>
      </div>
      <div class="theory-equation">
        <code>|ψ⟩ = α|0⟩ + β|1⟩</code>
        <span>Qubit state = probability amplitude of 0 + probability amplitude of 1</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Quantum computers - process multiple paths simultaneously</li>
          <li>Quantum cryptography - unhackable encryption</li>
          <li>Quantum sensors - ultra-precise measurement devices</li>
        </ul>
      </div>
    `
  },
  3: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> หลักความไม่แน่นอนของไฮเซนเบิร์ก</h3>
        <p>เราไม่สามารถรู้ตำแหน่งและโมเมนตัมของอนุภาคได้พร้อมกันอย่างแม่นยำ ยิ่งรู้อันหนึ่งแม่นเท่าไร อีกอันยิ่งไม่แน่นอน ผลคูณของความไม่แน่นอนทั้งสองมีขีดต่ำสุดเท่ากับ ħ/2</p>
      </div>
      <div class="theory-equation">
        <code>Δx · Δp ≥ ħ/2</code>
        <span>ความไม่แน่นอนของตำแหน่ง × ความไม่แน่นอนของโมเมนตัม ≥ ค่าคงที่</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>Electron microscopy - ใช้หลักความไม่แน่นอนในการออกแบบ</li>
          <li>Quantum computing - จำกัดความแม่นยำของการวัด</li>
          <li>Medical imaging - MRI ใช้หลัก nuclear magnetic resonance</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Heisenberg's Uncertainty Principle</h3>
        <p>We cannot know both position and momentum of a particle with perfect accuracy simultaneously. The more precisely you know one, the less you know the other. The product of uncertainties has a minimum value of ħ/2.</p>
      </div>
      <div class="theory-equation">
        <code>Δx · Δp ≥ ħ/2</code>
        <span>Position uncertainty × Momentum uncertainty ≥ minimum constant</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Electron microscopy - uses uncertainty in design optimization</li>
          <li>Quantum computing - sets limits on measurement precision</li>
          <li>Medical imaging - MRI uses nuclear magnetic resonance</li>
        </ul>
      </div>
    `
  },
  4: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> การทะลุอุโมงค์ควอนตัม (Quantum Tunneling)</h3>
        <p>อนุภาคมีความน่าจะเป็นที่จะ "ทะลุ" ผ่านกำแพงพลังงานที่มันไม่น่าจะข้ามได้ แม้ว่าฟิสิกส์คลาสสิกบอกว่าเป็นไปไม่ได้! ยิ่งกำแพงบางและต่ำ ยิ่งมีโอกาสทะลุสูง</p>
      </div>
      <div class="theory-equation">
        <code>T ≈ e^(-2κL)</code>
        <span>โอกาสทะลุ ≈ ลดลงแบบเอกซ์โพเนนเชียลตามความหนา</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>Flash memory (USB/SSD) - ใช้หลัก tunneling ในการเขียนข้อมูล</li>
          <li>Scanning Tunneling Microscope (STM) - ถ่ายภาพอะตอม</li>
          <li>การสันดาปในดวงอาทิตย์ - ทำให้ดาวฤกษ์เรืองแสงได้</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Quantum Tunneling</h3>
        <p>Particles have a probability to "tunnel through" energy barriers they classically shouldn't be able to cross! Even though classical physics says it's impossible. The thinner and lower the barrier, the higher the tunneling probability.</p>
      </div>
      <div class="theory-equation">
        <code>T ≈ e^(-2κL)</code>
        <span>Tunneling probability ≈ decreases exponentially with barrier thickness</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Flash memory (USB/SSD) - uses tunneling to write data</li>
          <li>Scanning Tunneling Microscope (STM) - images individual atoms</li>
          <li>Solar fusion - enables stars to shine</li>
        </ul>
      </div>
    `
  },
  5: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> การพัวพันเชิงควอนตัม (Quantum Entanglement)</h3>
        <p>เมื่ออนุภาคสองตัวพัวพันกัน สถานะของมันเชื่อมโยงกันทันที ไม่ว่าจะอยู่ห่างกันแค่ไหน การวัดอนุภาคหนึ่งจะกำหนดสถานะของอีกอันทันที นี่คือทฤษฎีบทเบลล์ที่พิสูจน์ว่าควอนตัมไม่ใช่ทฤษฎีแบบ "ตัวแปรซ่อน"</p>
      </div>
      <div class="theory-equation">
        <code>|Φ+⟩ = (|00⟩ + |11⟩) / √2</code>
        <span>สถานะ Bell พัวพัน - ทั้งสองเป็น 0 หรือทั้งสองเป็น 1</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>Quantum teleportation - ส่งสถานะควอนตัมโดยไม่ต้องขนส่งอนุภาค</li>
          <li>Quantum cryptography (QKD) - การสื่อสารที่ไม่สามารถดักฟังได้</li>
          <li>Quantum computing - เชื่อมต่อ qubits หลายตัวเข้าด้วยกัน</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Quantum Entanglement</h3>
        <p>When two particles are entangled, their states are instantly connected regardless of distance. Measuring one particle instantly determines the other's state. Bell's theorem proves quantum mechanics is not a "hidden variable" theory.</p>
      </div>
      <div class="theory-equation">
        <code>|Φ+⟩ = (|00⟩ + |11⟩) / √2</code>
        <span>Bell state - both are 0 or both are 1 when measured</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Quantum teleportation - transfer quantum states without moving particles</li>
          <li>Quantum cryptography (QKD) - unhackable communication</li>
          <li>Quantum computing - connect multiple qubits together</li>
        </ul>
      </div>
    `
  },
  6: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> แมวของชเรอดิงเงอร์และปัญหาการวัด</h3>
        <p>ในการทดลองสมมติ แมวในกล่องอยู่ในสถานะซ้อนทับ "เป็น+ตาย" จนกว่าจะมีคนเปิดดู การเปิดกล่องคือ "การวัด" ที่ทำให้สถานะยุบลง คำถามคือ: ขอบเขตของการซ้อนทับอยู่ตรงไหน? ที่อนุภาคเดียว หรือถึงแมวด้วย?</p>
      </div>
      <div class="theory-equation">
        <code>|ψ⟩ = (|แมวเป็น⟩ + |แมวตาย⟩) / √2</code>
        <span>สถานะซ้อนทับของแมว ก่อนการวัด</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>Decoherence research - ศึกษาว่าควอนตัมกลายเป็นคลาสสิกได้อย่างไร</li>
          <li>Quantum error correction - แก้ไขความผิดพลาดในควอนตัมคอมพิวเตอร์</li>
          <li>ไมโครสโคป - ความไม่แน่นอนในการวัดขนาดเล็ก</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Schrödinger's Cat & The Measurement Problem</h3>
        <p>In the thought experiment, the cat is in superposition "alive + dead" until someone opens the box. Opening the box is the "measurement" that collapses the state. The question is: where is the boundary of superposition? At the particle, or up to the cat?</p>
      </div>
      <div class="theory-equation">
        <code>|ψ⟩ = (|cat alive⟩ + |cat dead⟩) / √2</code>
        <span>Superposition state of the cat before measurement</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Decoherence research - how quantum becomes classical</li>
          <li>Quantum error correction - fixing errors in quantum computers</li>
          <li>Microscopy - uncertainty in small-scale measurements</li>
        </ul>
      </div>
    `
  },
  7: {
    th: `
      <div class="theory-section">
        <h3><span>💡</span> อัลกอริทึมของ Grover และ Quadratic Speedup</h3>
        <p>Grover's algorithm ค้นหาข้อมูลใน O(√N) เท่า เทียบกับ O(N) ของการค้นหาแบบดั้งเดิม สำหรับฐานข้อมูล 4 รายการ ควอนตัมใช้แค่ 1 ครั้ง ขณะที่คลาสสิกใช้เฉลี่ย 2.5 ครั้ง นี่คือ "quadratic speedup" ที่ทำให้ควอนตัมทำงานเร็วขึ้นอย่างมาก</p>
      </div>
      <div class="theory-equation">
        <code>T_quantum = O(√N) vs T_classical = O(N)</code>
        <span>ควอนตัมเร็วกว่า √N เท่า สำหรับการค้นหา</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> การประยุกต์ใช้จริง</h4>
        <ul>
          <li>Database search - ค้นหาข้อมูลเร็วขึ้น √N เท่า</li>
          <li>Optimization problems - หาคำตอบที่ดีที่สุดเร็วขึ้น</li>
          <li>Cryptography - ถอดรหัสเร็วขึ้น (ทำให้ RSA ล้าสมัยได้)</li>
        </ul>
      </div>
    `,
    en: `
      <div class="theory-section">
        <h3><span>💡</span> Grover's Algorithm & Quadratic Speedup</h3>
        <p>Grover's algorithm searches in O(√N) time vs O(N) for classical search. For a 4-item database, quantum uses just 1 query while classical needs 2.5 on average. This "quadratic speedup" makes quantum dramatically faster for search problems.</p>
      </div>
      <div class="theory-equation">
        <code>T_quantum = O(√N) vs T_classical = O(N)</code>
        <span>Quantum √N times faster for search problems</span>
      </div>
      <div class="theory-applications">
        <h4><span>🌟</span> Real-World Applications</h4>
        <ul>
          <li>Database search - √N times faster searching</li>
          <li>Optimization - find optimal solutions faster</li>
          <li>Cryptography - breaks RSA encryption faster (makes it obsolete)</li>
        </ul>
      </div>
    `
  }
};

/* ── Lab-only bilingual strings ───────────────────────────── */
const LAB_I18N = {
  // Mission briefing (replaces "CRITICAL FAILURE")
  mission_badge:     { th: 'ผู้พิทักษ์ควอนตัม', en: 'Quantum Guardian' },
  mission_welcome:   { th: 'ยินดีต้อนรับ, Quantum Guardian', en: 'Welcome, Quantum Guardian' },
  mission_crisis:    { th: 'แกนพลังงานควอนตัมกำลังถูกคุกคาม!', en: 'The Quantum Core is under threat!' },
  mission_damage:    { th: 'สถานีทั้ง 7 แห่งได้รับความเสียหาย', en: 'All 7 stations have been damaged' },
  mission_hope:      { th: 'คุณคือหวังเดียวที่จะกอบกู้มันคืนมา', en: 'You are the only hope to restore them' },
  mission_progress:  { th: 'ความคืบหน้า', en: 'Progress' },
  mission_stations:  { th: 'สถานี', en: 'stations' },
  mission_start:     { th: 'เริ่มภารกิจแรกของคุณ →', en: 'Start your first mission →' },

  // Alert banners (legacy, kept for compatibility)
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
  restored_t:    { th: 'ซ่อมสถานีสำเร็จ!', en: 'STATION RESTORED!' },
  restored_d:    { th: (n) => `${n} กลับมาออนไลน์แล้ว แกนควอนตัมแข็งแกร่งขึ้น`, en: (n) => `${n} is back online. The quantum core grows stronger.` },
  btn_review:    { th: 'ดูการทดลองต่อ →', en: 'Review simulation →' },
  btn_back_lab:  { th: 'กลับห้องแล็บ', en: 'Back to lab' },
  core_unlocked: { th: '⚛️ ปลดล็อกแกนควอนตัมแล้ว!', en: '⚛️ Quantum Core unlocked!' },

  // Summary screen
  summary_learned:      { th: 'สิ่งที่คุณได้เรียนรู้', en: 'What You Learned' },
  summary_theory:       { th: '📚 เรียนรู้ทฤษฎี', en: '📚 Learn the Theory' },
  summary_continue:     { th: 'เล่นต่อ →', en: 'Continue Playing →' },
  summary_theory_title: { th: 'ทฤษฎีเบื้องหลัง', en: 'Behind the Theory' },
  summary_applications: { th: 'การประยุกต์ใช้จริง', en: 'Real-World Applications' },
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
  const pct = Math.round(doneCount / 7 * 100);

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

  // Mission briefing for incomplete labs, celebration for complete
  const missionSection = doneCount === 7 ? `
    <div class="mission-complete">
      <div class="mission-badge mission-badge-success">🏆 ${LT('title_ok')}</div>
      <h2 class="mission-complete-title">${LT('subtitle_ok')}</h2>
    </div>
  ` : `
    <div class="mission-briefing">
      <div class="mission-badge">🛡️ ${LT('mission_badge')}</div>
      <h1 class="mission-title">${LT('mission_welcome')}</h1>
      <p class="mission-narrative">
        <strong>${LT('mission_crisis')}</strong><br>
        ${LT('mission_damage')}<br>
        ${LT('mission_hope')}
      </p>
      <div class="mission-progress-wrap">
        <div class="mission-progress-label">
          <span>${LT('mission_progress')}</span>
          <span>${doneCount}/7 ${LT('mission_stations')}</span>
        </div>
        <div class="mission-progress-bar">
          <div class="mission-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    </div>
  `;

  page.innerHTML = `
  <div class="lab-home">
    ${missionSection}

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
  const learned = STATION_LEARNED[s.id]?.[lang] || '';
  return `
    <div class="puzzle-inner summary-screen">
      <div class="summary-icon">✅</div>
      <div class="summary-title">${LT('restored_t')}</div>
      <div class="summary-station">${s.name[lang]}</div>

      ${learned ? `
      <div class="summary-learned">
        <div class="summary-learned-title">
          <span>📚</span>
          <span>${LT('summary_learned')}</span>
        </div>
        <p>${learned}</p>
      </div>
      ` : ''}

      <div class="summary-actions">
        <button class="summary-btn-theory" onclick="showTheoryPanel(${s.id})">
          ${LT('summary_theory')}
        </button>
        <button class="puzzle-btn-secondary" onclick="dismissPuzzle(${s.id})">
          ${LT('summary_continue')}
        </button>
        <button class="puzzle-btn-primary" onclick="goHome()">
          ${LT('btn_back_lab')}
        </button>
      </div>
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

/* ── Theory Panel ───────────────────────────────────────────── */
function showTheoryPanel(stationId) {
  const s = STATIONS.find(x => x.id === stationId);
  const theory = STATION_THEORY[stationId]?.[lang] || '';

  // Close the puzzle overlay first
  dismissPuzzle(stationId);

  // Create theory panel
  const panel = document.createElement('div');
  panel.className = 'theory-panel';
  panel.id = 'theoryPanel';
  panel.innerHTML = `
    <div class="theory-content">
      <div class="theory-header">
        <div class="theory-title">
          <span>🔬</span>
          <span>${s.name[lang]}</span>
        </div>
        <button class="theory-close" onclick="closeTheoryPanel()">×</button>
      </div>
      <div class="theory-body">
        ${theory}
      </div>
    </div>`;

  document.body.appendChild(panel);
  document.body.style.overflow = 'hidden';
  play('nav');
}

function closeTheoryPanel() {
  const panel = document.getElementById('theoryPanel');
  if (panel) {
    panel.remove();
    document.body.style.overflow = '';
  }
  play('nav');
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
                border:1px solid var(--line);border-radius:var(--radius-lg);
                background:#f9fafb">
      <div style="font-family:'Orbitron',sans-serif;font-size:0.72rem;letter-spacing:3px;
                  color:var(--cyan);margin-bottom:12px">${gv('บทสรุป', 'THE TAKEAWAY')}</div>
      <p style="color:var(--text-secondary);max-width:620px;margin:0 auto;line-height:1.8;font-size:0.95rem">
        ${gv(
          'ทุกสถานีที่คุณซ่อม คือ<strong style="color:var(--text-primary)">เครื่องมือจริงของควอนตัมคอมพิวเตอร์</strong> — และคุณเพิ่งใช้มันครบทุกชิ้น',
          "Every station you repaired is a <strong style=\"color:var(--text-primary)\">real tool of quantum computing</strong> — and you just used them all."
        )}
      </p>
    </div>
  </div>`;
}
