/* ============================================================
   Quantum Aura — the shareable front door
   A real single-qubit measurement (honest Born rule) delivered
   as a screenshot-ready "aura" card. Daily-seeded odds + a
   tag-a-friend entanglement link (async, no backend).
   ============================================================ */
'use strict';

/* ── Honest physics kernel (verifiable) ──────────────────────
   A qubit is amplitudes {a0, a1}. probs() = Born rule. measure()
   draws a basis state honestly from those probabilities. */
function auraProbs(q) {
  const n = q.a0 * q.a0 + q.a1 * q.a1 || 1;
  return [q.a0 * q.a0 / n, q.a1 * q.a1 / n];
}
function auraMeasureQ(q, rng) {
  const [p0] = auraProbs(q);
  return (rng() < p0) ? 0 : 1;   // 0 = ⬆ up, 1 = ⬇ down
}
// tiny seeded PRNG (deterministic — for the daily shared state)
function auraMulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AURA = {
  seed: 0,
  theta: 90,        // degrees; sets the odds
  p0: 0.5,
  measured: null,   // 0 | 1
  twin: null,       // {seed, outcome} if opened from a friend's link
  spinning: false,
  streak: 0,
  rarity: 0,
  rarityRevealed: false,
};

/* ── Gacha rarity — the pull-again chase ─────────────────── */
const AURA_RARITY = [
  { key: 'common',    th: 'ธรรมดา',      en: 'Common',    color: '#9aa6c8', glow: 'rgba(154,166,200,0.45)', emoji: '⚪' },
  { key: 'rare',      th: 'แรร์',         en: 'Rare',      color: '#35e0ff', glow: 'rgba(53,224,255,0.6)',   emoji: '🔷' },
  { key: 'epic',      th: 'เอพิค',        en: 'Epic',      color: '#b06bff', glow: 'rgba(176,107,255,0.7)',  emoji: '🟣' },
  { key: 'legendary', th: 'เลเจนดารี่',   en: 'Legendary', color: '#ffc23d', glow: 'rgba(255,194,61,0.85)',  emoji: '⭐' },
  { key: 'mythic',    th: 'ตำนาน',        en: 'Mythic',    color: '#ff5db1', glow: 'rgba(255,93,177,0.95)',  emoji: '🌈' },
];
function auraRollRarity() {
  const r = Math.random();
  if (r < 0.002) return 4;   // mythic ~0.2%
  if (r < 0.022) return 3;   // legendary ~2%
  if (r < 0.09)  return 2;   // epic ~7%
  if (r < 0.32)  return 1;   // rare ~23%
  return 0;                  // common
}
function auraDex() {
  try { return JSON.parse(localStorage.getItem('qx_aura_dex') || '{"best":-1,"seen":[]}'); }
  catch (e) { return { best: -1, seen: [] }; }
}
function auraDexRecord(idx) {
  const d = auraDex();
  d.best = Math.max(d.best == null ? -1 : d.best, idx);
  d.seen = d.seen || [];
  d.seen[idx] = true;
  localStorage.setItem('qx_aura_dex', JSON.stringify(d));
  return d;
}

// today's date as an integer seed (YYYYMMDD) — same for everyone today
function auraDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function auraDateLabel() {
  const d = new Date();
  const th = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const m = (lang === 'th' ? th : en)[d.getMonth()];
  return `${d.getDate()} ${m}`;
}

function auraLang(th, en) { return (typeof lang !== 'undefined' && lang === 'th') ? th : en; }

// daily streak (localStorage) — the reason to come back tomorrow
function auraStreakInfo() {
  let d = {};
  try { d = JSON.parse(localStorage.getItem('qx_aura_streak') || '{}'); } catch (e) {}
  return { count: d.count || 0, last: d.last || 0 };
}
function auraBumpStreak() {
  const today = auraDailySeed();
  let d = {};
  try { d = JSON.parse(localStorage.getItem('qx_aura_streak') || '{}'); } catch (e) {}
  if (d.last === today) return d.count || 1;                    // already counted today
  const y = new Date(new Date().getTime() - 86400000);
  const yseed = y.getFullYear() * 10000 + (y.getMonth() + 1) * 100 + y.getDate();
  const count = (d.last === yseed) ? (d.count || 0) + 1 : 1;    // continue vs reset
  localStorage.setItem('qx_aura_streak', JSON.stringify({ last: today, count }));
  return count;
}

/* ── Caption pools (bilingual, teen slang) ───────────────────
   Keyed by outcome + whether the outcome was expected (>=50%) or an upset. */
const AURA_CAPTIONS = {
  up_expected: {
    th: ['ขึ้น ⬆ ตามดวงเป๊ะ ปังมาก', 'สปินอัพ ⬆ ตัวมัมชัด ๆ', 'พุ่ง ⬆ ตามคาด จึ้งไปอีก'],
    en: ['Spin up ⬆ — understood the assignment.', 'Locked in ⬆. main character energy.', '⬆ exactly as called. no cap.'],
  },
  up_upset: {
    th: ['พลิกล็อกขึ้น ⬆ ทั้งที่มีลุ้นแค่ {p}% เกินต้าน', 'สู้ดวงแล้วได้ ⬆ ทั้งที่ {p}% จึ้งงง'],
    en: ['Beat the odds ⬆ — only {p}% chance. that\'s rizz.', 'Flipped ⬆ against {p}% odds. we\'re so back.'],
  },
  down_expected: {
    th: ['ลง ⬇ ตามดวง แต่ก็แซ่บดี', 'สปินดาวน์ ⬇ ชิว ๆ ไม่ซีเรียส', 'ดิ่ง ⬇ ตามคาด เท่ดี'],
    en: ['Spin down ⬇ but honestly on brand.', 'Down ⬇. it\'s not that deep.', '⬇ as expected. lowkey iconic.'],
  },
  down_upset: {
    th: ['พลิกมาลง ⬇ ซะงั้น จบข่าว', 'มีลุ้น {p}% แต่ก็ร่วง ⬇ อิหยังวะ', 'ดวงเล่นตลก ⬇ ทั้งที่ {p}%'],
    en: ['Plot twist ⬇. the universe said no.', 'Had {p}% for up, still fell ⬇. อิหยังวะ.', 'Against {p}% odds you dropped ⬇. cooked.'],
  },
};
function auraPick(key, pThis) {
  const pool = AURA_CAPTIONS[key][auraLang('th', 'en') === 'th' ? 'th' : 'en'];
  const i = Math.floor(Math.random() * pool.length);
  return pool[i].replace('{p}', Math.round(pThis * 100));
}

/* ── Navigation ──────────────────────────────────────────── */
function openAura() {
  if (typeof stopContinuous === 'function') stopContinuous();
  if (typeof stopAnimations === 'function') stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('auraPage');
  if (!page) return;
  page.classList.add('active');
  const hdr = document.getElementById('headerTitle');
  if (hdr) hdr.textContent = auraLang('ควอนตัมออร่า', 'Quantum Aura');
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (typeof play === 'function') play('nav');

  // daily-seeded odds
  AURA.seed = auraDailySeed();
  const rng = auraMulberry(AURA.seed);
  AURA.theta = 35 + rng() * 110;                 // 35°..145° → varied but never extreme
  AURA.p0 = Math.cos(AURA.theta * Math.PI / 360) ** 2;
  AURA.measured = null;
  AURA.spinning = false;
  AURA.streak = auraStreakInfo().count;
  renderAura();
}

function auraGoHome() {
  history.replaceState(null, '', location.pathname + location.search);  // clear #e=
  AURA.twin = null;
  if (typeof goHome === 'function') goHome();
}

/* ── Render: pre-measure orb, or the result card ─────────── */
function renderAura() {
  const page = document.getElementById('auraPage');
  if (!page) return;
  const p0pct = Math.round(AURA.p0 * 100), p1pct = 100 - p0pct;

  const twinBanner = AURA.twin ? `
    <div class="aura-twin-banner">
      ${auraLang(
        `เพื่อนของคุณวัดได้ <b>${AURA.twin.outcome === 0 ? '⬆' : '⬇'}</b> — คุณเลยถูกล็อกเป็นตรงข้าม 💥`,
        `Your friend measured <b>${AURA.twin.outcome === 0 ? '⬆' : '⬇'}</b> — so you're locked to the opposite 💥`)}
    </div>` : '';

  page.innerHTML = `
    <div class="aura-wrap">
      <button class="aura-back" onclick="auraGoHome()" aria-label="back">✕</button>
      <div class="aura-eyebrow">${auraLang('ควอนตัมออร่าประจำวัน', 'DAILY QUANTUM AURA')} · ${auraDateLabel()}</div>
      ${twinBanner}
      ${AURA.streak > 0 ? `<div class="aura-streak">🔥 ${AURA.streak} ${auraLang(AURA.streak === 1 ? 'วัน' : 'วันติด', AURA.streak === 1 ? 'day' : 'day streak')}</div>` : ''}

      <div class="aura-stage" id="auraStage">
        <div class="aura-orb ${AURA.measured === null ? 'superposed' : (AURA.measured === 0 ? 'up' : 'down')}" id="auraOrb">
          <span class="aura-orb-glyph">${AURA.measured === null ? '' : (AURA.measured === 0 ? '⬆' : '⬇')}</span>
        </div>
      </div>

      ${AURA.measured === null ? `
        <div class="aura-odds">
          <span class="aura-odds-up">⬆ ${p0pct}%</span>
          <span class="aura-odds-sep">/</span>
          <span class="aura-odds-down">${p1pct}% ⬇</span>
        </div>
        <div class="aura-sub">${auraLang(
            'วันนี้ทุกคนได้โอกาสเท่ากัน แต่ผลของแต่ละคนไม่เหมือนกัน',
            'Everyone gets the same odds today — but a different result.')}</div>
        <button class="aura-measure-btn" onclick="auraMeasure()">
          ${auraLang('วัดออร่า', 'Measure me')}
        </button>
        <div class="aura-hint">${auraLang('หรือเขย่ามือถือ', 'or shake your phone')}</div>
        ${(function () { const d = auraDex(); return (d.best != null && d.best >= 0) ? `<div class="aura-dex">🏆 ${auraLang('พูลดีสุดของนาย', 'your best pull')}: <b style="color:${AURA_RARITY[d.best].color}">${AURA_RARITY[d.best].emoji} ${auraLang(AURA_RARITY[d.best].th, AURA_RARITY[d.best].en)}</b></div>` : ''; })()}
      ` : `
        <div class="aura-rarity" id="auraRarity"></div>
        <canvas class="aura-card" id="auraCard" width="720" height="1152"></canvas>
        <div class="aura-actions">
          <button class="aura-again-btn aura-pull-btn" onclick="auraAgainTune()">🎲 ${auraLang('วัดอีกรอบ!', 'PULL AGAIN')}</button>
          <button class="aura-share-btn" onclick="auraShare()">${auraLang('แชร์การ์ด', 'Share card')}</button>
          <button class="aura-friend-btn" onclick="auraEntangle()">${auraLang('พัวพันกับเพื่อน 🔗', 'Entangle a friend 🔗')}</button>
          <button class="aura-why-btn" onclick="openWhy('measure')">🧠 ${auraLang('ทำไมถึงได้ค่านี้?', 'why did i get this?')}</button>
        </div>
        ${AURA.streak > 0 ? `<div class="aura-streak-nudge">${auraLang('🔥 สตรีค ' + AURA.streak + ' วัน — พรุ่งนี้กลับมาต่อสตรีคนะ', '🔥 ' + AURA.streak + '-day streak — come back tomorrow to keep it')}</div>` : ''}
        <div class="aura-honest">${auraLang(
            'นี่คือการวัดควอนตัมจริง ๆ ก่อนวัด คุณเป็นทั้ง ⬆ และ ⬇ พร้อมกัน',
            'A real quantum measurement. Before you looked, you were BOTH ⬆ and ⬇ at once.')}</div>
      `}
    </div>`;

  if (AURA.measured !== null) {
    drawAuraCard();
    const rEl = document.getElementById('auraRarity');
    if (!AURA.rarityRevealed) auraRevealRarity();
    else if (rEl) auraRenderRarityBadge(rEl, AURA.rarity, false);
  }
}

/* ── Rarity reveal (slot-machine tease) + celebration ────── */
function auraRenderRarityBadge(el, idx, rolling) {
  const r = AURA_RARITY[idx];
  el.textContent = r.emoji + ' ' + auraLang(r.th, r.en);
  el.style.color = r.color;
  el.style.borderColor = r.glow;
  el.style.boxShadow = rolling ? 'none' : ('0 0 22px ' + r.glow);
}
function auraRevealRarity() {
  const el = document.getElementById('auraRarity');
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { auraRenderRarityBadge(el, AURA.rarity, false); el.classList.add('locked'); AURA.rarityRevealed = true; if (AURA.rarity >= 3) auraCelebrate(); return; }
  let n = 0; const ticks = 16;
  const spin = () => {
    if (n >= ticks) {
      auraRenderRarityBadge(el, AURA.rarity, false);
      el.classList.remove('locked'); void el.offsetWidth; el.classList.add('locked');
      AURA.rarityRevealed = true;
      drawAuraCard();
      if (AURA.rarity >= 3) auraCelebrate();
      else if (AURA.rarity >= 1 && typeof play === 'function') play('discover');
      return;
    }
    auraRenderRarityBadge(el, Math.floor(Math.random() * AURA_RARITY.length), true);
    if (typeof play === 'function' && n % 2 === 0) play('hover');
    n++;
    setTimeout(spin, 55 + n * n * 1.4);
  };
  spin();
}
function auraCelebrate() {
  if (typeof confetti === 'function') confetti();
  if (typeof play === 'function') play('success');
  if (navigator.vibrate) navigator.vibrate([0, 60, 30, 120, 30, 160]);
  const wrap = document.querySelector('.aura-wrap');
  if (wrap) { wrap.classList.remove('aura-shake'); void wrap.offsetWidth; wrap.classList.add('aura-shake'); }
}

/* ── Measure: honest Born-rule collapse + orb animation ──── */
function auraMeasure() {
  if (AURA.spinning || AURA.measured !== null) return;
  AURA.spinning = true;
  if (typeof play === 'function') play('measure');
  if (navigator.vibrate) navigator.vibrate(30);

  // honest draw. If this is a twin (friend link), force the anti-correlated result.
  let outcome;
  if (AURA.twin) {
    outcome = AURA.twin.outcome === 0 ? 1 : 0;   // perfect anti-correlation (same basis)
  } else {
    outcome = auraMeasureQ({ a0: Math.cos(AURA.theta * Math.PI / 360), a1: Math.sin(AURA.theta * Math.PI / 360) }, Math.random);
  }

  const orb = document.getElementById('auraOrb');
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (orb && !reduce) orb.classList.add('collapsing');

  setTimeout(() => {
    AURA.measured = outcome;
    AURA.spinning = false;
    AURA.streak = auraBumpStreak();
    AURA.rarity = auraRollRarity();
    AURA.rarityRevealed = false;
    auraDexRecord(AURA.rarity);
    if (navigator.vibrate) navigator.vibrate([0, 40, 20, 60]);
    if (typeof play === 'function') play(outcome === 0 ? 'success' : 'collision');
    renderAura();
  }, reduce ? 0 : 620);
}

// shake to measure
let _auraShakeLast = 0;
function auraOnMotion(e) {
  if (!document.getElementById('auraPage')?.classList.contains('active')) return;
  if (AURA.measured !== null || AURA.spinning) return;
  const a = e.accelerationIncludingGravity; if (!a) return;
  const mag = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
  const now = Date.now();
  if (mag > 32 && now - _auraShakeLast > 1200) { _auraShakeLast = now; auraMeasure(); }
}

/* ── Shareable card (canvas) ─────────────────────────────── */
// preload generated aura backgrounds + SCIUS/Burapha logos for the share card
const AURA_ASSETS = {};
(function () {
  const load = (key, src) => {
    const im = new Image();
    im.onload = () => { if (AURA.measured !== null) drawAuraCard(); };
    im.src = src;
    AURA_ASSETS[key] = im;
  };
  load('up', 'aura-bg-up.png');
  load('down', 'aura-bg-down.png');
  load('logo', 'scius-buu-logo-removebg-preview.png');
})();
function auraDrawCover(ctx, img, x, y, w, h) {
  const ir = img.naturalWidth / img.naturalHeight, r = w / h;
  let dw, dh, dx, dy;
  if (ir > r) { dh = h; dw = h * ir; dx = x - (dw - w) / 2; dy = y; }
  else { dw = w; dh = w / ir; dx = x; dy = y - (dh - h) / 2; }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawAuraCard() {
  const cv = document.getElementById('auraCard');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const up = AURA.measured === 0;
  const pThis = up ? AURA.p0 : (1 - AURA.p0);

  // background gradient by outcome (up = warm gold/coral, down = cool purple)
  const g = ctx.createLinearGradient(0, 0, W, H);
  if (up) { g.addColorStop(0, '#2a1c14'); g.addColorStop(0.5, '#3a2416'); g.addColorStop(1, '#20140c'); }
  else { g.addColorStop(0, '#1a1526'); g.addColorStop(0.5, '#241a35'); g.addColorStop(1, '#120e1c'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // generated aura background (cover), if loaded
  const bgImg = AURA_ASSETS[up ? 'up' : 'down'];
  if (bgImg && bgImg.complete && bgImg.naturalWidth) {
    auraDrawCover(ctx, bgImg, 0, 0, W, H);
    const sc = ctx.createLinearGradient(0, 0, 0, H);
    sc.addColorStop(0, 'rgba(0,0,0,0.34)');
    sc.addColorStop(0.5, 'rgba(0,0,0,0.12)');
    sc.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = sc; ctx.fillRect(0, 0, W, H);
  }

  // soft glow orb
  const cx = W / 2, oy = H * 0.34, accent = up ? '#D4A574' : '#8B6BAE';
  const rg = ctx.createRadialGradient(cx, oy, 10, cx, oy, 260);
  rg.addColorStop(0, up ? 'rgba(212,165,116,0.55)' : 'rgba(139,107,174,0.55)');
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, oy, 260, 0, Math.PI * 2); ctx.fill();

  // header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(230,226,220,0.55)';
  ctx.font = '600 26px Inter, Kanit, sans-serif';
  ctx.fillText(auraLang('ควอนตัมออร่า', 'QUANTUM AURA') + ' · ' + auraDateLabel(), cx, 86);
  // rarity badge
  const rar = AURA_RARITY[(AURA.rarity != null) ? AURA.rarity : 0];
  ctx.fillStyle = rar.color;
  ctx.font = '800 38px Orbitron, Inter, sans-serif';
  ctx.fillText(auraLang(rar.th, rar.en).toUpperCase() + ' ' + rar.emoji, cx, 150);

  // big glyph
  ctx.font = '200px sans-serif';
  ctx.fillText(up ? '⬆' : '⬇', cx, oy + 70);

  // state name
  ctx.fillStyle = accent;
  ctx.font = '800 62px Orbitron, Inter, sans-serif';
  ctx.fillText(up ? auraLang('สปินอัพ', 'SPIN UP') : auraLang('สปินดาวน์', 'SPIN DOWN'), cx, oy + 250);

  // odds line
  ctx.fillStyle = 'rgba(230,226,220,0.85)';
  ctx.font = '400 34px Inter, Kanit, sans-serif';
  ctx.fillText(auraLang(
    `โอกาสที่คุณจะได้แบบนี้: ${Math.round(pThis * 100)}%`,
    `Your chance of this: ${Math.round(pThis * 100)}%`), cx, oy + 320);

  // caption (wrapped)
  const key = (up ? 'up' : 'down') + '_' + (pThis >= 0.5 ? 'expected' : 'upset');
  const cap = AURA._lastCaption || (AURA._lastCaption = auraPick(key, pThis));
  ctx.fillStyle = '#E6E2DC';
  ctx.font = '700 46px Inter, Kanit, sans-serif';
  wrapText(ctx, cap, cx, oy + 430, W - 120, 58);

  // honest footer
  ctx.fillStyle = 'rgba(230,226,220,0.55)';
  ctx.font = '400 26px Inter, Kanit, sans-serif';
  wrapText(ctx, auraLang('ก่อนวัด คุณเป็นทั้งสองอย่างพร้อมกันจริง ๆ',
                         'Before you looked, you were genuinely both at once.'), cx, H - 176, W - 140, 34);
  // SCIUS BUU logo + wordmark (branding travels with every share)
  const logo = AURA_ASSETS.logo;
  if (logo && logo.complete && logo.naturalWidth) {
    const ls = 60; ctx.drawImage(logo, cx - ls / 2, H - 130, ls, ls);
  }
  ctx.fillStyle = accent;
  ctx.font = '700 22px Orbitron, Inter, sans-serif';
  ctx.fillText('QUANTUM · EXPERIENCE', cx, H - 44);
  ctx.fillStyle = 'rgba(230,226,220,0.5)';
  ctx.font = '600 18px Inter, sans-serif';
  ctx.fillText('SCIUS BUU · วมว.', cx, H - 20);
  // rarity glow border
  const gi = (AURA.rarity != null) ? AURA.rarity : 0;
  ctx.strokeStyle = rar.color;
  ctx.lineWidth = 5 + gi * 2.5;
  ctx.shadowColor = rar.color; ctx.shadowBlur = 6 + gi * 12;
  const lw = ctx.lineWidth;
  ctx.strokeRect(lw / 2, lw / 2, W - lw, H - lw);
  ctx.shadowBlur = 0;
  ctx.textAlign = 'left';
}

function wrapText(ctx, text, cx, y, maxW, lh) {
  const words = String(text).split(' ');
  let line = '', yy = y;
  const prevAlign = ctx.textAlign; ctx.textAlign = 'center';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, cx, yy); line = w; yy += lh; }
    else line = test;
  }
  if (line) ctx.fillText(line, cx, yy);
  ctx.textAlign = prevAlign;
}

/* ── Share (client-side, no backend) ─────────────────────── */
function auraShare() {
  const cv = document.getElementById('auraCard');
  if (!cv) return;
  if (typeof play === 'function') play('click');
  cv.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], 'quantum-aura.png', { type: 'image/png' });
    const shareText = auraLang('วัดออร่าควอนตัมของคุณ 👇', 'Measure your quantum aura 👇');
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url: location.href });
        return;
      }
    } catch (e) { /* fall through to download */ }
    // fallback: download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'quantum-aura.png'; a.click();
    URL.revokeObjectURL(a.href);
  }, 'image/png');
}

/* ── Tag-a-friend entanglement (async via URL hash) ──────── */
function auraEntangle() {
  if (AURA.measured === null) return;
  if (typeof play === 'function') play('click');
  const payload = btoa(JSON.stringify({ s: AURA.seed, o: AURA.measured }));
  const link = location.origin + location.pathname + '#e=' + payload;
  const msg = auraLang(
    'เราพัวพันกันแล้ว! เปิดลิงก์นี้แล้วเธอจะได้ผลตรงข้ามกับเราเป๊ะ 💥 ',
    "We're entangled! Open this and you'll get the exact opposite of me 💥 ");
  if (navigator.share) {
    navigator.share({ text: msg, url: link }).catch(() => auraCopy(link));
  } else {
    auraCopy(link);
  }
}
function auraCopy(link) {
  if (navigator.clipboard) navigator.clipboard.writeText(link);
  if (typeof toast === 'function') toast(auraLang('คัดลอกลิงก์แล้ว ส่งให้เพื่อนเลย!', 'Link copied — send it to a friend!'));
}

/* tune / measure again — reuse the tilting-coin idea as odds control (v1: re-roll) */
function auraAgainTune() {
  AURA._lastCaption = null;
  AURA.measured = null;
  AURA.spinning = false;
  renderAura();
}

/* ── Inbound friend link: #e=<base64{s,o}> ───────────────── */
function auraCheckInbound() {
  const m = /[#&]e=([^&]+)/.exec(location.hash);
  if (!m) return false;
  try {
    const data = JSON.parse(atob(decodeURIComponent(m[1])));
    if (typeof data.s === 'number' && (data.o === 0 || data.o === 1)) {
      AURA.twin = { seed: data.s, outcome: data.o };
      // twin shares the same daily odds
      openAura();
      // override seed with the friend's so the "quantum weather" matches
      AURA.seed = data.s;
      const rng = auraMulberry(data.s);
      AURA.theta = 35 + rng() * 110;
      AURA.p0 = Math.cos(AURA.theta * Math.PI / 360) ** 2;
      renderAura();
      return true;
    }
  } catch (e) { /* ignore malformed */ }
  return false;
}

// device motion (shake) listener — attached once
if (typeof window !== 'undefined') {
  window.addEventListener('devicemotion', auraOnMotion);
}
