/* ============================================================
   "Why did that happen?" — an opt-in science reveal.
   A shared bottom-sheet the Aura + Chat call after a collapse.
   Invisible unless tapped: depth for the curious, no wall for
   anyone else. Plain teen language; grown-up name deferred.
   ============================================================ */
'use strict';

function wT(th, en) { return (typeof lang !== 'undefined' && lang === 'th') ? th : en; }

const WHY_CONTENT = {
  measure: {
    title: { th: 'ทำไมถึงได้ค่านั้น?', en: "Why'd you get that?" },
    points: [
      { th: 'ก่อนเธอกดวัด อนุภาคเป็นทั้ง ⬆ และ ⬇ พร้อมกันจริง ๆ ไม่ใช่แค่ “ยังไม่รู้”', en: "Before you looked, it was genuinely BOTH ⬆ and ⬇ at once — not 'we just didn't know yet.'" },
      { th: 'พอเธอวัดปุ๊บ มันต้องเลือกเป็นค่าเดียวทันที โอกาสได้แต่ละค่า = ความ “เอียง” ของมันยกกำลังสอง', en: "The instant you measure, it has to pick one. Your odds of each = how far it 'leans,' squared." },
      { th: 'เลยเป็นเหตุผลที่วันนี้ทุกคนได้โอกาสเท่ากัน แต่ผลไม่เหมือนกัน — มันสุ่มจริง ๆ', en: "That's why everyone gets the same odds today but a different result — it's genuinely random." },
    ],
    name: { th: 'ชื่อทางการ: superposition + การวัด + กฎของบอร์น (Born rule)', en: 'Grown-up name: superposition + measurement + the Born rule' },
  },
  entanglement: {
    title: { th: 'ทำไมเพื่อนได้ค่าตรงข้ามเป๊ะ?', en: 'Why does your friend get the exact opposite?' },
    points: [
      { th: 'ตอนสร้างเป็นคู่ อนุภาคสองตัวถูกผูกกันไว้ ถ้าตัวนึงเป็น ⬆ อีกตัวต้องเป็น ⬇ เสมอ', en: 'When the pair is made, the two are locked together — if one is ⬆, the other is ALWAYS ⬇.' },
      { th: 'ไม่มีการส่งสัญญาณหากันเลยนะ มันแค่สัมพันธ์กันตั้งแต่แรก ไกลแค่ไหนก็ตรงข้ามกันเป๊ะ', en: "No signal passes between them — they're just correlated from the start. Any distance, still perfectly opposite." },
      { th: 'จุดที่หลอนคือ ไม่มี “แผนลับ” ที่เตรียมไว้ก่อนอันไหนเลียนแบบความสัมพันธ์นี้ได้เลย (ไอน์สไตน์ยังงง)', en: 'The eerie part: no secret pre-arranged plan can fake this link (it bugged Einstein too).' },
    ],
    name: { th: 'ชื่อทางการ: ความพัวพันเชิงควอนตัม · ทฤษฎีบทเบลล์', en: "Grown-up name: quantum entanglement · Bell's theorem" },
  },
};

function openWhy(key) {
  const c = WHY_CONTENT[key];
  if (!c) return;
  closeWhy(true);
  const back = document.createElement('div');
  back.className = 'why-backdrop';
  back.id = 'whyBackdrop';
  back.onclick = (e) => { if (e.target === back) closeWhy(); };
  const sheet = document.createElement('div');
  sheet.className = 'why-sheet';
  sheet.innerHTML = `
    <div class="why-grab"></div>
    <div class="why-eyebrow">🧠 ${wT('ทำไมถึงเป็นแบบนั้น', 'WHY DID THAT HAPPEN')}</div>
    <div class="why-title">${wT(c.title.th, c.title.en)}</div>
    <ul class="why-points">${c.points.map(p => `<li>${wT(p.th, p.en)}</li>`).join('')}</ul>
    <div class="why-name">${wT(c.name.th, c.name.en)}</div>
    <button class="why-close" onclick="closeWhy()">${wT('เก็ตแล้ว 👍', 'got it 👍')}</button>`;
  back.appendChild(sheet);
  document.body.appendChild(back);
  requestAnimationFrame(() => back.classList.add('in'));
  if (typeof play === 'function') play('nav');
}

function closeWhy(instant) {
  const b = document.getElementById('whyBackdrop');
  if (!b) return;
  if (instant) { b.remove(); return; }
  b.classList.remove('in');
  setTimeout(() => b.remove(), 260);
}
