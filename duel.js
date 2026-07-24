/* ============================================================
   วัดใจควอนตัม / Quantum Match — the entanglement compatibility duel.
   Send a link to your crush/friend → they tap → quantum "measures"
   how entangled you two are (a stable per-pair %). The send IS the
   mechanic. No backend (state rides in the URL hash).
   ============================================================ */
'use strict';

function dT(th, en) { return (typeof lang !== 'undefined' && lang === 'th') ? th : en; }

const DUEL = { stage: 'sender', nameA: '', nameB: '', pct: 0 };

// deterministic per-pair compatibility (same two names → always same %)
function duelCompat(a, b) {
  const s = [String(a).trim().toLowerCase(), String(b).trim().toLowerCase()].sort().join('❤');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  let p = 35 + (h % 66);            // mostly 35..100 (feels good)
  if (h % 11 === 0) p = h % 35;     // ~9% get a dramatic low
  return Math.max(0, Math.min(100, p));
}
function duelVerdict(p) {
  if (p >= 90) return { th: 'โซลเมทควอนตัม 💞', en: 'Quantum soulmates 💞', s_th: 'เกิดมาเพื่อพัวพันกัน', s_en: 'born to be entangled' };
  if (p >= 75) return { th: 'พัวพันแรงงง 💘', en: 'Strongly entangled 💘', s_th: 'เคมีพุ่งปรี๊ด', s_en: 'chemistry off the charts' };
  if (p >= 55) return { th: 'มีเคมีนะเนี่ย ✨', en: 'Got chemistry ✨', s_th: 'ลุ้นได้อยู่นะ', s_en: "there's something here" };
  if (p >= 35) return { th: 'เป็นเพื่อนกันดีกว่า 🤝', en: 'Better as friends 🤝', s_th: 'สายเฟรนด์โซน', s_en: 'friend-zone coded' };
  return { th: 'คนละมิติ 💔', en: 'Different dimensions 💔', s_th: 'ควอนตัมบอกว่า... ไม่ 💀', s_en: 'quantum said no 💀' };
}

function openDuel() {
  DUEL.stage = 'sender'; DUEL.nameA = ''; DUEL.nameB = ''; DUEL.pct = 0;
  showDuelPage(); renderDuel();
}
function duelCheckInbound() {
  const m = /[#&]duel=([^&]+)/.exec(location.hash);
  if (!m) return false;
  try {
    const d = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1])))));
    if (d && typeof d.a === 'string') { DUEL.stage = 'receiver'; DUEL.nameA = d.a || ''; DUEL.nameB = ''; DUEL.pct = 0; showDuelPage(); renderDuel(); return true; }
  } catch (e) { /* ignore */ }
  return false;
}
function showDuelPage() {
  if (typeof stopContinuous === 'function') stopContinuous();
  if (typeof stopAnimations === 'function') stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('duelPage'); if (!pg) return;
  pg.classList.add('active');
  const h = document.getElementById('headerTitle'); if (h) h.textContent = dT('วัดใจควอนตัม', 'Quantum Match');
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (typeof play === 'function') play('nav');
}
function duelGoHome() { history.replaceState(null, '', location.pathname + location.search); if (typeof goHome === 'function') goHome(); }

function renderDuel() {
  const pg = document.getElementById('duelPage'); if (!pg) return;

  if (DUEL.stage === 'sender') {
    pg.innerHTML = `
      <div class="duel-wrap">
        <button class="aura-back" onclick="duelGoHome()" aria-label="back">✕</button>
        <div class="duel-heart">💘</div>
        <h1 class="duel-title">${dT('วัดใจควอนตัม', 'Quantum Match')}</h1>
        <p class="duel-sub">${dT('อยากรู้มั้ยว่าเธอกับ “เขา” พัวพันเชิงควอนตัมกันกี่ %? ใส่ชื่อเธอ แล้วส่งลิงก์ให้เขาเปิด 👀', 'how quantum-entangled are you and your crush? drop your name, send them the link 👀')}</p>
        <input class="duel-input" id="duelNameA" maxlength="24" placeholder="${dT('ชื่อเธอ...', 'your name...')}">
        <button class="duel-go" onclick="duelSend()">${dT('ส่งให้เขา 🔗', 'send it 🔗')}</button>
        <div class="duel-hint">${dT('ผลจะออกตอนเขาเปิดลิงก์แล้วกดวัด', 'the result appears once they open it and tap')}</div>
      </div>`;
  } else if (DUEL.stage === 'receiver') {
    pg.innerHTML = `
      <div class="duel-wrap">
        <button class="aura-back" onclick="duelGoHome()" aria-label="back">✕</button>
        <div class="duel-heart">💌</div>
        <h1 class="duel-title">${escapeHtml(DUEL.nameA || dT('มีคนนึง', 'someone'))} ${dT('ชวนเธอมาวัดใจ 👀', 'wants to match with you 👀')}</h1>
        <p class="duel-sub">${dT('ควอนตัมจะบอกว่าเธอสองคนพัวพันกันแค่ไหน ใส่ชื่อแล้วกดวัดเลย', 'quantum will tell you how entangled you two are. name + tap.')}</p>
        <input class="duel-input" id="duelNameB" maxlength="24" placeholder="${dT('ชื่อเธอ...', 'your name...')}">
        <button class="duel-go" onclick="duelMeasure()">${dT('วัดใจเลย! 💫', 'match us! 💫')}</button>
      </div>`;
  } else {
    const v = duelVerdict(DUEL.pct);
    pg.innerHTML = `
      <div class="duel-wrap">
        <button class="aura-back" onclick="duelGoHome()" aria-label="back">✕</button>
        <div class="duel-stage2">
          <div class="duel-orb a">${escapeHtml((DUEL.nameA || 'A').slice(0, 2))}</div>
          <div class="duel-string" id="duelString"></div>
          <div class="duel-orb b">${escapeHtml((DUEL.nameB || 'B').slice(0, 2))}</div>
        </div>
        <div class="duel-pct" id="duelPct">0%</div>
        <div class="duel-verdict" style="color:${DUEL.pct >= 55 ? '#ff6b9d' : '#9aa6c8'}">${dT(v.th, v.en)}</div>
        <div class="duel-verdict-sub">${dT(v.s_th, v.s_en)}</div>
        <div class="duel-names">${escapeHtml(DUEL.nameA || '?')} <span>💞</span> ${escapeHtml(DUEL.nameB || '?')}</div>
        <div class="duel-actions">
          <button class="duel-go" onclick="duelShareResult()">${dT('แชร์ผล 📸', 'share result 📸')}</button>
          <button class="duel-again" onclick="openDuel()">${dT('ลองกับคนอื่น', 'try someone else')}</button>
        </div>
      </div>`;
    duelAnimateResult();
  }
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function duelSend() {
  const el = document.getElementById('duelNameA');
  DUEL.nameA = (el && el.value.trim()) || dT('เพื่อน', 'someone');
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ a: DUEL.nameA }))));
  const link = location.origin + location.pathname + '#duel=' + payload;
  const msg = dT(`${DUEL.nameA} ชวนเธอมาวัดใจควอนตัม 👀 กดดูสิว่าเราพัวพันกันกี่ %`, `${DUEL.nameA} wants to quantum-match with you 👀 see how entangled we are`);
  if (typeof play === 'function') play('success');
  if (navigator.share) navigator.share({ text: msg, url: link }).catch(() => duelCopy(link));
  else duelCopy(link);
}
function duelMeasure() {
  const el = document.getElementById('duelNameB');
  DUEL.nameB = (el && el.value.trim()) || dT('เธอ', 'you');
  DUEL.pct = duelCompat(DUEL.nameA, DUEL.nameB);
  DUEL.stage = 'result';
  if (typeof play === 'function') play('measure');
  renderDuel();
}
function duelAnimateResult() {
  const str = document.getElementById('duelString');
  if (str) setTimeout(() => str.classList.add('lit'), 250);
  const pctEl = document.getElementById('duelPct');
  const target = DUEL.pct;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finish = () => {
    if (target >= 75) { if (typeof confetti === 'function') confetti(); if (navigator.vibrate) navigator.vibrate([0, 60, 30, 120]); if (typeof play === 'function') play('success'); }
    else if (typeof play === 'function') play(target >= 35 ? 'discover' : 'collision');
  };
  if (reduce) { if (pctEl) pctEl.textContent = target + '%'; finish(); return; }
  let cur = 0;
  const step = () => {
    cur += Math.max(1, Math.ceil((target - cur) / 8));
    if (cur >= target) { cur = target; if (pctEl) pctEl.textContent = cur + '%'; finish(); return; }
    if (pctEl) pctEl.textContent = cur + '%';
    setTimeout(step, 42);
  };
  setTimeout(step, 750);
}
function duelShareResult() {
  const v = duelVerdict(DUEL.pct);
  const msg = dT(`${DUEL.nameA} 💞 ${DUEL.nameB} พัวพันกัน ${DUEL.pct}% — ${v.th}! มาวัดใจควอนตัมกับเพื่อนสิ`, `${DUEL.nameA} 💞 ${DUEL.nameB} = ${DUEL.pct}% entangled — ${v.en}! quantum-match your friends`);
  if (navigator.share) navigator.share({ text: msg, url: location.origin + location.pathname }).catch(() => duelCopy(msg));
  else duelCopy(msg);
}
function duelCopy(x) { if (navigator.clipboard) navigator.clipboard.writeText(x); if (typeof toast === 'function') toast(dT('คัดลอกแล้ว ส่งเลย!', 'copied — send it!')); }
