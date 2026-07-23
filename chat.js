/* ============================================================
   Text the Particle — a paranoid quantum particle DMs you.
   Zero reading of paragraphs: you tap reply bubbles. Superposition
   → measurement/collapse → entanglement (fused with a tag-a-friend
   share link, no backend). Real 50/50 collapse under the hood.
   ============================================================ */
'use strict';

function cT(th, en) { return (typeof lang !== 'undefined' && lang === 'th') ? th : en; }
function chatReduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

const CHAT = { node: null, measured: null, twin: null, busy: false, currentReplies: null };

const CHAT_NODES = {
  start: {
    msgs: [
      { th: 'เฮ้ 🫣 อย่าเพิ่งมองผมนะ', en: "hey 🫣 don't look at me yet" },
      { th: 'คือตอนนี้ผมอยู่ 2 ที่พร้อมกันอ่ะ ถ้าเธอมองปุ๊บ ผมยุบเลยนะ เอาจริง', en: "i'm in two places rn. you look at me, i collapse. fr fr" },
    ],
    replies: [
      { th: 'ยุบก็ยุบ 👀', en: 'look anyway 👀', next: 'measure' },
      { th: 'โอเค ไม่มอง 🙈', en: "ok i won't 🙈", next: 'dontlook' },
    ],
  },
  dontlook: {
    msgs: [
      { th: 'ขอบใจ 😮‍💨 งั้นผมขออยู่แบบซ้อนทับต่อไปนะ', en: 'thx 😮‍💨 lemme stay in superposition then' },
      { th: 'คือผมเป็นทั้ง ⬆ และ ⬇ พร้อมกันเลย มันคือวิถีของผม', en: "i'm both ⬆ AND ⬇ at the same time. it's my whole vibe" },
      { th: 'แต่เอาจริง สุดท้ายเธอก็ต้องมองผมแหละ ไม่งั้นมันไม่จบ 😅', en: 'but ngl you gotta look eventually or this never ends 😅' },
    ],
    replies: [
      { th: 'งั้นมองแล้วนะ 👁️', en: 'ok looking now 👁️', next: 'measure' },
    ],
  },
  measure: {
    onEnter: 'collapse',
    msgs: [
      { up:   { th: 'โห เธอวัดผมจริงดิ 💀 ผมกลายเป็น ⬆ ล้วน ๆ อีกครึ่งหายวับไปเลย', en: "bro you really measured me 💀 i'm full ⬆ now, my other half just vanished" },
        down: { th: 'จบข่าว 💀 ผมเหลือ ⬇ อย่างเดียวแล้ว', en: "it's over 💀 i'm just ⬇ now" } },
      { th: 'นี่แหละที่เขาเรียกว่า "การวัด" พอเธอดูปุ๊บ ผมต้องเลือกเป็นค่าเดียวทันที', en: 'THIS is what they call "measurement" — the sec you look, i gotta pick one value' },
    ],
    replies: [
      { th: 'แล้วไงต่อ 🤨', en: 'ok… and? 🤨', next: 'twin' },
      { th: 'เดี๋ยว เมื่อกี้มันเกิดอะไรขึ้น 🧠', en: 'wait what just happened 🧠', action: 'why:measure' },
    ],
  },
  twin: {
    msgs: [
      { th: 'เดี๋ยวนะ... ผมเพิ่งนึกออก ผมมีฝาแฝด 👯', en: 'wait… i just remembered. i have a twin 👯' },
      { th: 'เราพัวพันกันอยู่ ไม่ว่าอยู่ไกลกันแค่ไหน ถ้าผมเป็น ⬆ มันจะเป็น ⬇ เป๊ะ ๆ ทุกครั้ง', en: "we're entangled. no matter the distance — if i'm ⬆, it's ALWAYS ⬇" },
      { th: 'ส่งลิงก์นี้ให้เพื่อนสิ ฝาแฝดผมจะไปโผล่หาเขา แล้วได้ค่าตรงข้ามกับผมเป๊ะ 🔗', en: 'send this to a friend — my twin shows up for them and gets the exact opposite of me 🔗' },
    ],
    replies: [
      { th: 'ส่งให้เพื่อน 🔗', en: 'send to a friend 🔗', action: 'entangle' },
      { th: 'ทำไมตรงข้ามกันเป๊ะ 🧠', en: 'why the exact opposite? 🧠', action: 'why:entanglement' },
      { th: 'เริ่มใหม่ 🔄', en: 'restart 🔄', next: 'start', action: 'reset' },
    ],
  },
  twinArrive: {
    onEnter: 'twinCollapse',
    msgs: [
      { th: 'เธอคือเพื่อนของคนที่เพิ่งวัดผมใช่มะ 👀', en: "you're the friend of the one who just measured me, right? 👀" },
      { th: 'งั้นเธอคือฝาแฝดของผม เราพัวพันกันแล้ว', en: "then you're my twin. we're entangled now" },
      { up:   { th: 'เขาได้ ⬇ ... เธอเลยถูกล็อกเป็น ⬆ เป๊ะ ไม่มีทางเป็นอย่างอื่นเลย 💥', en: "they got ⬇ … so you're locked to ⬆. no other option 💥" },
        down: { th: 'เขาได้ ⬆ ... เธอเลยถูกล็อกเป็น ⬇ เป๊ะ ไม่มีทางเป็นอย่างอื่นเลย 💥', en: "they got ⬆ … so you're locked to ⬇. no other option 💥" } },
      { th: 'นี่แหละความพัวพันของจริง ไม่ใช่มายากล', en: "that's REAL entanglement. not a magic trick." },
    ],
    replies: [
      { th: 'ทำไมตรงข้ามกันเป๊ะ 🧠', en: 'why the exact opposite? 🧠', action: 'why:entanglement' },
      { th: 'หลอนอ่ะ 😳 ขอลองเองบ้าง', en: 'creepy 😳 lemme try myself', next: 'start', action: 'reset' },
      { th: 'ส่งต่อให้เพื่อนอีกคน 🔗', en: 'pass it on 🔗', action: 'entangle' },
    ],
  },
};

/* ── Entry ───────────────────────────────────────────────── */
function openChat() { CHAT.twin = null; enterChat('start'); }

function enterChat(startId) {
  if (typeof stopContinuous === 'function') stopContinuous();
  if (typeof stopAnimations === 'function') stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('chatPage');
  if (!page) return;
  page.classList.add('active');
  const hdr = document.getElementById('headerTitle');
  if (hdr) hdr.textContent = cT('แชทกับอนุภาค', 'Text the Particle');
  window.scrollTo({ top: 0, behavior: 'auto' });
  CHAT.measured = null; CHAT.busy = false; CHAT.currentReplies = null;
  renderChatShell();
  gotoNode(startId);
  if (typeof play === 'function') play('nav');
}

function chatGoHome() {
  history.replaceState(null, '', location.pathname + location.search);
  CHAT.twin = null;
  if (typeof goHome === 'function') goHome();
}

function renderChatShell() {
  const page = document.getElementById('chatPage');
  if (!page) return;
  page.innerHTML = `
    <div class="chat-wrap">
      <div class="chat-topbar">
        <button class="chat-back" onclick="chatGoHome()" aria-label="back">←</button>
        <div class="chat-avatar superposed" id="chatAvatar"></div>
        <div class="chat-who">
          <div class="chat-name">particle <span class="chat-badge">⚛</span></div>
          <div class="chat-status" id="chatStatus">online</div>
        </div>
      </div>
      <div class="chat-thread" id="chatThread"></div>
      <div class="chat-replies" id="chatReplies"></div>
    </div>`;
}

/* ── Flow ────────────────────────────────────────────────── */
function gotoNode(id) {
  const node = CHAT_NODES[id];
  if (!node) return;
  CHAT.node = id;
  clearReplies();
  if (node.onEnter === 'collapse') doCollapse(null, () => typeThen(node));
  else if (node.onEnter === 'twinCollapse') doCollapse(CHAT.twin ? (CHAT.twin.outcome === 0 ? 1 : 0) : null, () => typeThen(node));
  else typeThen(node);
}

function delay(ms) { return new Promise(r => setTimeout(r, chatReduced() ? 40 : ms)); }

async function typeThen(node) {
  CHAT.busy = true;
  for (const m of node.msgs) {
    await showTyping(700);
    pushIncoming(resolveMsg(m));
    await delay(300);
  }
  CHAT.busy = false;
  renderReplies(node.replies);
}

function resolveMsg(m) {
  if (m.up && m.down) { const v = (CHAT.measured === 0) ? m.up : m.down; return cT(v.th, v.en); }
  return cT(m.th, m.en);
}

function doCollapse(forced, cb) {
  const outcome = (forced === 0 || forced === 1) ? forced : (Math.random() < 0.5 ? 0 : 1);
  CHAT.measured = outcome;
  const av = document.getElementById('chatAvatar');
  setStatus(cT('กำลังยุบตัว…', 'collapsing…'));
  if (av) av.className = 'chat-avatar collapsing';
  if (navigator.vibrate) navigator.vibrate(30);
  setTimeout(() => {
    if (av) av.className = 'chat-avatar ' + (outcome === 0 ? 'up' : 'down');
    if (navigator.vibrate) navigator.vibrate([0, 40, 20, 60]);
    pushSystemState(outcome);
    setStatus('online');
    if (typeof play === 'function') play(outcome === 0 ? 'success' : 'collision');
    if (cb) cb();
  }, chatReduced() ? 0 : 720);
}

function chatReply(i) {
  const rep = CHAT.currentReplies && CHAT.currentReplies[i];
  if (!rep || CHAT.busy) return;
  // "why?" chips open the science reveal without consuming the flow
  if (rep.action && rep.action.indexOf('why:') === 0) {
    if (typeof openWhy === 'function') openWhy(rep.action.slice(4));
    if (typeof play === 'function') play('click');
    return;
  }
  clearReplies();
  pushOutgoing(cT(rep.th, rep.en));
  if (typeof play === 'function') play('click');
  if (rep.action === 'reset') {
    CHAT.twin = null; CHAT.measured = null;
    const av = document.getElementById('chatAvatar');
    if (av) av.className = 'chat-avatar superposed';
  }
  if (rep.action === 'entangle') {
    chatEntangle();
    if (!rep.next) setTimeout(() => renderReplies(CHAT_NODES[CHAT.node].replies), 500);
  }
  if (rep.next) setTimeout(() => gotoNode(rep.next), 340);
}

/* ── Bubbles ─────────────────────────────────────────────── */
function showTyping(ms) {
  return new Promise(res => {
    const t = document.getElementById('chatThread');
    setStatus(cT('กำลังพิมพ์…', 'typing…'));
    const d = document.createElement('div');
    d.className = 'chat-bubble in chat-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    if (t) { t.appendChild(d); scrollThread(); }
    setTimeout(() => { d.remove(); setStatus('online'); res(); }, chatReduced() ? 60 : ms);
  });
}
function pushIncoming(text) { appendBubble(text, 'in'); }
function pushOutgoing(text) { appendBubble(text, 'out'); }
function appendBubble(text, side) {
  const t = document.getElementById('chatThread');
  if (!t) return;
  const d = document.createElement('div');
  d.className = 'chat-bubble ' + side;
  d.textContent = text;
  t.appendChild(d);
  requestAnimationFrame(() => d.classList.add('in-view'));
  scrollThread();
}
function pushSystemState(o) {
  const t = document.getElementById('chatThread');
  if (!t) return;
  const d = document.createElement('div');
  d.className = 'chat-state ' + (o === 0 ? 'up' : 'down');
  d.innerHTML = `<span class="chat-state-glyph">${o === 0 ? '⬆' : '⬇'}</span><span>${o === 0 ? cT('สปินอัพ', 'SPIN UP') : cT('สปินดาวน์', 'SPIN DOWN')}</span>`;
  t.appendChild(d);
  requestAnimationFrame(() => d.classList.add('in-view'));
  scrollThread();
}
function renderReplies(replies) {
  CHAT.currentReplies = replies;
  const r = document.getElementById('chatReplies');
  if (!r) return;
  r.innerHTML = replies.map((rep, i) => `<button class="chat-reply" onclick="chatReply(${i})">${cT(rep.th, rep.en)}</button>`).join('');
}
function clearReplies() { const r = document.getElementById('chatReplies'); if (r) r.innerHTML = ''; }
function setStatus(s) { const el = document.getElementById('chatStatus'); if (el) el.textContent = s; }
function scrollThread() { const t = document.getElementById('chatThread'); if (t) t.scrollTop = t.scrollHeight; }

/* ── Entanglement share (same trick as Aura, its own #c= key) ─ */
function chatEntangle() {
  const outcome = (CHAT.measured === 0 || CHAT.measured === 1) ? CHAT.measured : (Math.random() < 0.5 ? 0 : 1);
  const payload = btoa(JSON.stringify({ o: outcome }));
  const link = location.origin + location.pathname + '#c=' + payload;
  const msg = cT('อนุภาคควอนตัมตัวนี้อยากพัวพันกับเธอ 👯 เปิดสิ เธอจะได้ค่าตรงข้ามกับเราเป๊ะ 💥 ',
                 "this quantum particle wants to entangle with you 👯 open it — you'll get the exact opposite of me 💥 ");
  if (navigator.share) navigator.share({ text: msg, url: link }).catch(() => chatCopy(link));
  else chatCopy(link);
}
function chatCopy(link) {
  if (navigator.clipboard) navigator.clipboard.writeText(link);
  if (typeof toast === 'function') toast(cT('คัดลอกลิงก์แล้ว ส่งให้เพื่อนเลย!', 'Link copied — send it to a friend!'));
}

/* ── Inbound friend link: #c=<base64{o}> ─────────────────── */
function chatCheckInbound() {
  const m = /[#&]c=([^&]+)/.exec(location.hash);
  if (!m) return false;
  try {
    const data = JSON.parse(atob(decodeURIComponent(m[1])));
    if (data.o === 0 || data.o === 1) {
      CHAT.twin = { outcome: data.o };
      enterChat('twinArrive');
      return true;
    }
  } catch (e) { /* ignore malformed */ }
  return false;
}
