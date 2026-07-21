'use strict';
/* ============================================================
   Entangle Together — Co-op Bell Challenge
   Two players share one entangled photon source. Rotate your
   detectors to fulfil each round's goal card; the match odds
   follow P(same) = cos²(Δθ/2). Zap Eve before she measures,
   or the pair decoheres and the round is lost.
   ============================================================ */

/* ── Bilingual strings ─────────────────────────────────────── */
const COOP_I18N = {
  banner_label:  { th: 'โหมดพิเศษ · เล่น 2 คน', en: 'BONUS MODE · 2 PLAYERS' },
  banner_title:  { th: 'Entangle Together — ภารกิจพัวพันคู่หู', en: 'Entangle Together — Co-op Bell Challenge' },
  banner_desc:   { th: 'คุมเครื่องวัดคนละฝั่ง ประสานมุมให้ตรงเป้า และช่วยกันสอยสปาย Eve', en: 'One detector each — coordinate your angles, hit the goal, and zap Eve the eavesdropper.' },
  header_number: { th: 'โหมดพิเศษ · ENTANGLEMENT', en: 'BONUS · ENTANGLEMENT' },
  header_title:  { th: 'Entangle Together', en: 'Entangle Together' },
  header_desc:   { th: 'คุมเครื่องวัดคนละฝั่ง หมุนให้ตรงเป้า แล้วช่วยกันสอยสปาย Eve!', en: 'One detector each — aim together and zap Eve the spy!' },
  menu_sub:      { th: 'เก็บ 10 แต้มก่อนโฟตอนหมด 20 คู่', en: 'Score 10 points before 20 photon pairs run out.' },
  how_title:     { th: 'วิธีเล่น', en: 'HOW TO PLAY' },
  how1:          { th: 'หมุนเครื่องวัดตามการ์ดเป้าหมายบนจอ', en: 'Rotate your detector to match the goal card' },
  how2:          { th: 'ทำมิเตอร์ P ให้เขียว ก่อนวงแหวนนับถอยหลังหมด', en: 'Get the P meter green before the countdown ring ends' },
  how3:          { th: 'Eve 🕵️ โผล่เมื่อไหร่ รีบกดยิงทันที!', en: 'When Eve 🕵️ appears — zap her fast!' },
  btn_2p:        { th: 'เล่น 2 คน', en: '2 PLAYERS' },
  btn_ai:        { th: 'เล่นกับ AI', en: 'PLAY WITH AI' },
  p1:            { th: 'ผู้เล่น 1 · เครื่องวัด A', en: 'PLAYER 1 · DETECTOR A' },
  p2:            { th: 'ผู้เล่น 2 · เครื่องวัด B', en: 'PLAYER 2 · DETECTOR B' },
  rotate:        { th: 'หมุนเครื่องวัด', en: 'Rotate detector' },
  zap:           { th: 'ยิงเลเซอร์ใส่ Eve', en: 'Zap Eve' },
  goal_tag:      { th: 'เป้าหมายรอบนี้', en: 'ROUND GOAL' },
  goal_match:    { th: 'ให้ผลตรงกัน', en: 'CORRELATE' },
  goal_anti:     { th: 'ให้ผลตรงข้าม', en: 'ANTI-CORRELATE' },
  goal_tune:     { th: 'จูนความน่าจะเป็น', en: 'TUNE THE ODDS' },
  goal_match_sub:{ th: 'หันเครื่องวัดไปทางเดียวกัน (Δθ ≈ 0°)', en: 'Point your detectors the same way (Δθ ≈ 0°)' },
  goal_anti_sub: { th: 'หันเครื่องวัดสวนทางกัน (Δθ ≈ 180°)', en: 'Point your detectors opposite ways (Δθ ≈ 180°)' },
  goal_tune_sub: { th: (n) => `ตั้งมุมให้มิเตอร์ P(ตรงกัน) = ${n}% (±7%) ตอนปล่อยโฟตอน`, en: (n) => `Set the meter to P(match) = ${n}% (±7%) at launch` },
  tune_hit:      { th: (n) => `จูนแม่น! P = ${n}% — +1 แต้ม`, en: (n) => `Perfectly tuned! P = ${n}% — +1 point` },
  tune_miss:     { th: (n) => `พลาด — ปล่อยที่ P = ${n}%`, en: (n) => `Missed — launched at P = ${n}%` },
  streak_bonus:  { th: 'โบนัสสตรีค! +1 แต้มพิเศษ', en: 'Streak bonus! +1 extra point' },
  zap_cd:        { th: 'เลเซอร์กำลังชาร์จ…', en: 'Zapper recharging…' },
  zap_false:     { th: 'ยิงพลาด! เลเซอร์ต้องชาร์จใหม่', en: 'False alarm! Zapper needs to recharge' },
  meter_match:   { th: 'P(ผลตรงกัน)', en: 'P(match)' },
  pairs_left:    { th: 'โฟตอนเหลือ', en: 'PAIRS LEFT' },
  streak:        { th: 'สตรีค', en: 'STREAK' },
  eve_warn:      { th: '🕵️ Eve กำลังดักฟัง! ยิงเลย!', en: '🕵️ Eve is intercepting! Zap her!' },
  eve_zapped:    { th: 'สอย Eve ได้! ความพัวพันปลอดภัย', en: 'Eve zapped! Entanglement is safe' },
  eve_escaped:   { th: 'Eve วัดโฟตอนไปแล้ว — ความพัวพันสลาย!', en: 'Eve measured the photon — entanglement destroyed!' },
  round_hit:     { th: 'สำเร็จ! +1 แต้มทีม', en: 'Success! +1 team point' },
  round_miss:    { th: 'พลาด — ผลไม่ตรงเป้า', en: 'Missed — results did not fit the goal' },
  win_title:     { th: 'ทีมพัวพันสมบูรณ์!', en: 'PERFECTLY ENTANGLED!' },
  lose_title:    { th: 'โฟตอนหมดแล้ว', en: 'OUT OF PHOTONS' },
  win_sub:       { th: 'พวกคุณคุมความสัมพันธ์ควอนตัมได้อย่างเซียน — แบบที่ฟิสิกส์คลาสสิกอธิบายไม่ได้', en: 'You mastered quantum correlations — the kind classical physics cannot explain.' },
  lose_sub:      { th: 'เกือบแล้ว! จำไว้: สิ่งเดียวที่สำคัญคือมุมต่างระหว่างเครื่องวัดสองฝั่ง', en: 'So close! Remember: all that matters is the angle between the two detectors.' },
  stat_points:   { th: 'แต้มทีม', en: 'TEAM POINTS' },
  stat_streak:   { th: 'สตรีคสูงสุด', en: 'BEST STREAK' },
  stat_eve:      { th: 'สอย Eve', en: 'EVES ZAPPED' },
  btn_again:     { th: 'เล่นอีกครั้ง', en: 'PLAY AGAIN' },
  btn_menu:      { th: 'กลับเมนู', en: 'MENU' },
  phys1_t:       { th: '🔗 ความพัวพัน', en: '🔗 Entanglement' },
  phys1_d:       { th: 'โฟตอนสองตัวคือสถานะเดียวกัน — ผลวัดจึงเชื่อมกันแม้อยู่ไกล', en: 'Two photons share one state — their results stay linked at any distance.' },
  phys2_t:       { th: '📐 กฎ cos²', en: '📐 The cos² law' },
  phys2_d:       { th: 'มุมเดียวกัน = ตรงกัน 100% · สวนทาง = ตรงข้าม 100% — สำคัญแค่ "มุมต่าง"', en: 'Aligned = 100% match · opposite = 100% anti. Only Δθ matters.' },
  phys3_t:       { th: '🕵️ ทำไม Eve ถึงพัง', en: '🕵️ Why Eve breaks it' },
  phys3_d:       { th: 'แอบวัดกลางทาง = ความพัวพันสลายทันที — นี่คือหัวใจของการเข้ารหัสควอนตัม', en: 'Peeking mid-flight destroys entanglement — the heart of quantum cryptography.' },
  ai_name:       { th: 'AI คู่หู', en: 'AI PARTNER' },
  best_line:     { th: (b) => `สถิติดีสุด: ${b.score} แต้ม · สตรีค ×${b.streak}`, en: (b) => `BEST: ${b.score} pts · streak ×${b.streak}` },
};
function CT(key, arg) {
  const e = COOP_I18N[key];
  if (!e) return key;
  const v = e[lang] || e.en;
  return typeof v === 'function' ? v(arg) : v;
}

/* ── Game constants ────────────────────────────────────────── */
const COOP_CFG = {
  targetPoints: 10,
  pairBudget: 20,
  aimTimeStart: 3.4,   // aim window shrinks as rounds progress
  aimTimeMin: 2.0,
  aimTimeStep: 0.12,
  flightTime: 1.8,     // photon flight seconds
  resolveTime: 1.2,    // pause on the verdict before next round
  rotSpeed: 140,       // deg per second while key held
  eveChance: 0.38,     // chance per round from round 4 on
  eveShowAt: 0.25,     // flight fraction when Eve appears
  eveMeasureAt: 0.72,  // flight fraction when Eve measures if not zapped
  zapCooldown: 1.3,    // false alarms lock your zapper — no spamming
  tuneTolerance: 7,    // ± percent window for TUNE cards
};

/* ── State ─────────────────────────────────────────────────── */
const COOP = {
  state: 'menu',        // menu | aim | flight | resolve | over
  aiPartner: false,
  angleA: 90, angleB: 270,
  score: 0, streak: 0, bestStreak: 0, evesZapped: 0,
  pairsFired: 0, round: 0,
  card: 'match',        // match | anti | tune
  tuneTarget: 75,       // % target for tune cards
  tuneOkAtLaunch: false,
  aimTime: 3.4,         // current round's aim window (ramps down)
  phaseT: 0,            // time in current phase
  eve: null,            // {active, zapped, measured, side}
  lastResult: null,     // {a:'up'|'down', b, ok}
  zapFlash: 0,
  zapCd: { 1: 0, 2: 0 },// per-player zap cooldown after a false alarm
  shake: 0,             // screen shake amount
  floaters: [],         // rising "+1" texts {text,color,t,x,y}
  burst: [],            // success particles {x,y,vx,vy,t,color}
  msg: null, msgT: 0, msgColor: '#c8d0ee',
  keys: {},
  raf: null, lastTs: 0,
  cv: null, ctx: null, w: 0, h: 0,
  won: false,
};

/* ── Page skeleton ─────────────────────────────────────────── */
function buildCoopPage() {
  const page = document.getElementById('coopPage');
  if (!page) return;
  page.innerHTML = `
  <div class="coop-page-inner">
    <div class="coop-header">
      <div class="coop-header-number">${CT('header_number')}</div>
      <h1 class="coop-header-title">${CT('header_title')}</h1>
      <p class="coop-header-desc">${CT('header_desc')}</p>
    </div>

    <div class="coop-viewport">
      <div id="coopWrap">
        <canvas id="coopCanvas"></canvas>

        <div class="coop-hud" id="coopHud" style="display:none">
          <div class="coop-hud-pips" id="coopPips"></div>
          <div class="coop-hud-right">
            <span id="coopPairsLeft"></span>
            <span class="coop-hud-streak" id="coopStreak"></span>
          </div>
        </div>

        <div class="coop-goal hidden" id="coopGoal">
          <div class="coop-goal-tag">${CT('goal_tag')}</div>
          <div class="coop-goal-text" id="coopGoalText"></div>
          <div class="coop-goal-sub" id="coopGoalSub"></div>
        </div>

        <div class="coop-meter" id="coopMeter" style="display:none">
          <div class="coop-meter-label"><span id="coopMeterLabel">${CT('meter_match')}</span> = <span id="coopMeterVal">50</span>%</div>
          <div class="coop-meter-track">
            <div class="coop-meter-fill" id="coopMeterFill"></div>
            <div class="coop-meter-mark" id="coopMeterMark" style="display:none"></div>
          </div>
        </div>

        <div class="coop-touch p1" id="coopTouchP1" style="display:none">
          <button class="coop-touch-btn" data-k="a">⟲</button>
          <button class="coop-touch-btn" data-k="d">⟳</button>
          <button class="coop-touch-btn" data-k="w">⚡</button>
        </div>
        <div class="coop-touch p2" id="coopTouchP2" style="display:none">
          <button class="coop-touch-btn" data-k="ArrowUp">⚡</button>
          <button class="coop-touch-btn" data-k="ArrowLeft">⟲</button>
          <button class="coop-touch-btn" data-k="ArrowRight">⟳</button>
        </div>

        <div class="coop-overlay" id="coopMenu"></div>
        <div class="coop-overlay" id="coopOver" style="display:none"></div>
      </div>
    </div>

    <div class="coop-physics">
      <div class="coop-physics-card">
        <div class="coop-physics-title" style="color:var(--violet)">${CT('phys1_t')}</div>
        <div class="coop-physics-text">${CT('phys1_d')}</div>
      </div>
      <div class="coop-physics-card">
        <div class="coop-physics-title" style="color:var(--cyan)">${CT('phys2_t')}</div>
        <div class="coop-physics-text">${CT('phys2_d')}</div>
      </div>
      <div class="coop-physics-card">
        <div class="coop-physics-title" style="color:var(--error)">${CT('phys3_t')}</div>
        <div class="coop-physics-text">${CT('phys3_d')}</div>
      </div>
    </div>
  </div>`;

  prepCoopCanvas();
  renderCoopMenu();
  bindCoopTouch();
}

function coopBest() {
  try { return JSON.parse(localStorage.getItem('qx_coop_best') || 'null'); }
  catch (e) { return null; }
}

function renderCoopMenu() {
  const menu = document.getElementById('coopMenu');
  if (!menu) return;
  const best = coopBest();
  menu.style.display = 'flex';
  menu.innerHTML = `
    <div class="coop-title">ENTANGLE TOGETHER</div>
    <div class="coop-subtitle">${CT('menu_sub')}</div>
    ${best ? `<div style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#b09aff;opacity:0.85">${CT('best_line', best)}</div>` : ''}
    <div class="coop-mode-btns">
      <button class="coop-mode-btn two" onclick="startCoop(false)">👥 ${CT('btn_2p')}</button>
      <button class="coop-mode-btn ai" onclick="startCoop(true)">🤖 ${CT('btn_ai')}</button>
    </div>
    <div class="coop-howto">
      <div class="coop-howto-title">${CT('how_title')}</div>
      <div class="coop-howto-step"><span class="coop-howto-num">1</span>${CT('how1')}</div>
      <div class="coop-howto-step"><span class="coop-howto-num">2</span>${CT('how2')}</div>
      <div class="coop-howto-step"><span class="coop-howto-num">3</span>${CT('how3')}</div>
    </div>
    <div class="coop-legend">
      <div class="coop-legend-col p1">
        <div class="coop-legend-title">${CT('p1')}</div>
        <div class="coop-legend-row"><span class="coop-key">A</span><span class="coop-key">D</span> ${CT('rotate')}</div>
        <div class="coop-legend-row"><span class="coop-key">W</span> ${CT('zap')}</div>
      </div>
      <div class="coop-legend-col p2">
        <div class="coop-legend-title">${CT('p2')}</div>
        <div class="coop-legend-row"><span class="coop-key">◀</span><span class="coop-key">▶</span> ${CT('rotate')}</div>
        <div class="coop-legend-row"><span class="coop-key">▲</span> ${CT('zap')}</div>
      </div>
    </div>`;
}

function renderCoopOver() {
  const over = document.getElementById('coopOver');
  if (!over) return;
  over.style.display = 'flex';
  over.innerHTML = `
    <div class="${COOP.won ? 'coop-over-title-win' : 'coop-over-title-lose'}">
      ${COOP.won ? CT('win_title') : CT('lose_title')}
    </div>
    <div class="coop-subtitle">${COOP.won ? CT('win_sub') : CT('lose_sub')}</div>
    <div class="coop-stats">
      <div class="coop-stat"><div class="coop-stat-value">${COOP.score}</div><div class="coop-stat-label">${CT('stat_points')}</div></div>
      <div class="coop-stat"><div class="coop-stat-value">${COOP.bestStreak}</div><div class="coop-stat-label">${CT('stat_streak')}</div></div>
      <div class="coop-stat"><div class="coop-stat-value">${COOP.evesZapped}</div><div class="coop-stat-label">${CT('stat_eve')}</div></div>
    </div>
    <div class="coop-mode-btns">
      <button class="coop-mode-btn two" onclick="startCoop(${COOP.aiPartner})">${CT('btn_again')}</button>
      <button class="coop-mode-btn ai" onclick="coopToMenu()">${CT('btn_menu')}</button>
    </div>`;
}

/* ── Navigation ────────────────────────────────────────────── */
function openCoop() {
  if (typeof stopContinuous === 'function') stopContinuous();
  if (typeof stopAnimations === 'function') stopAnimations();
  currentTopic = 0;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('coopPage').classList.add('active');
  document.getElementById('headerTitle').textContent = CT('header_title');
  window.scrollTo({ top: 0, behavior: 'auto' });
  play('nav');
  // The floating mascot wanders over the play field — park it during co-op
  const ball = document.getElementById('ownerSpaceball');
  if (ball) ball.style.display = 'none';
  COOP.state = 'menu';
  buildCoopPage();
}

function coopToMenu() {
  COOP.state = 'menu';
  cancelAnimationFrame(COOP.raf);
  document.getElementById('coopOver').style.display = 'none';
  document.getElementById('coopHud').style.display = 'none';
  document.getElementById('coopMeter').style.display = 'none';
  document.getElementById('coopGoal').classList.add('hidden');
  renderCoopMenu();
  play('nav');
}

function refreshCoopLanguage() {
  // Rebuild static chrome + current overlay; skip mid-game to keep canvas alive
  if (COOP.state === 'menu' || COOP.state === 'over') {
    buildCoopPage();
    if (COOP.state === 'over') {
      document.getElementById('coopMenu').style.display = 'none';
      renderCoopOver();
    }
  }
}

/* ── Canvas ────────────────────────────────────────────────── */
function prepCoopCanvas() {
  const cv = document.getElementById('coopCanvas');
  if (!cv) return;
  COOP.cv = cv;
  COOP.ctx = cv.getContext('2d');
  sizeCoopCanvas();
  drawCoop(); // idle backdrop behind menu
}

function sizeCoopCanvas() {
  const cv = COOP.cv;
  if (!cv) return;
  const rect = cv.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  COOP.w = Math.max(rect.width, 10);
  COOP.h = Math.max(rect.height, 10);
  cv.width = Math.floor(COOP.w * dpr);
  cv.height = Math.floor(COOP.h * dpr);
  COOP.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', () => {
  if (document.getElementById('coopPage')?.classList.contains('active')) {
    sizeCoopCanvas();
    if (COOP.state === 'menu' || COOP.state === 'over') drawCoop();
  }
});

/* ── Game flow ─────────────────────────────────────────────── */
function startCoop(withAI) {
  COOP.aiPartner = withAI;
  COOP.state = 'aim';
  COOP.score = 0; COOP.streak = 0; COOP.bestStreak = 0; COOP.evesZapped = 0;
  COOP.pairsFired = 0; COOP.round = 0;
  COOP.angleA = 90; COOP.angleB = withAI ? 250 : 270;
  COOP.won = false;
  COOP.msg = null;
  COOP.zapCd = { 1: 0, 2: 0 };
  COOP.shake = 0;
  COOP.floaters = [];
  COOP.burst = [];
  COOP.keys = {};
  document.getElementById('coopMenu').style.display = 'none';
  document.getElementById('coopOver').style.display = 'none';
  document.getElementById('coopHud').style.display = 'flex';
  document.getElementById('coopMeter').style.display = 'block';
  const touch = 'ontouchstart' in window;
  document.getElementById('coopTouchP1').style.display = touch ? 'flex' : 'none';
  document.getElementById('coopTouchP2').style.display = touch ? 'flex' : 'none';
  play('prepare');
  nextCoopRound();
  COOP.lastTs = 0;
  cancelAnimationFrame(COOP.raf);
  COOP.raf = requestAnimationFrame(coopLoop);
}

function nextCoopRound() {
  COOP.round++;
  COOP.state = 'aim';
  COOP.phaseT = 0;
  // Aim window shrinks each round — gentle difficulty ramp
  COOP.aimTime = Math.max(COOP_CFG.aimTimeMin,
    COOP_CFG.aimTimeStart - (COOP.round - 1) * COOP_CFG.aimTimeStep);

  // Card draw: TUNE cards enter the deck from round 6
  const r = Math.random();
  if (COOP.round >= 6 && r < 0.25) {
    COOP.card = 'tune';
    COOP.tuneTarget = Math.random() < 0.5 ? 75 : 25;
  } else {
    COOP.card = r < 0.5 + (COOP.round >= 6 ? 0.125 : 0) ? 'match' : 'anti';
  }

  COOP.eve = null;
  COOP.lastResult = null;
  const goal = document.getElementById('coopGoal');
  goal.classList.remove('hidden', 'match', 'anti', 'tune');
  goal.classList.add(COOP.card === 'tune' ? 'match' : COOP.card);
  const txt = document.getElementById('coopGoalText');
  const sub = document.getElementById('coopGoalSub');
  if (COOP.card === 'match') {
    txt.textContent = '✔ ' + CT('goal_match');
    sub.textContent = CT('goal_match_sub');
  } else if (COOP.card === 'anti') {
    txt.textContent = '✖ ' + CT('goal_anti');
    sub.textContent = CT('goal_anti_sub');
  } else {
    txt.textContent = '🎚 ' + CT('goal_tune') + ` → ${COOP.tuneTarget}%`;
    sub.textContent = CT('goal_tune_sub', COOP.tuneTarget);
  }
  updateCoopMeterMark();
  updateCoopHud();
}

function launchCoopPair() {
  COOP.state = 'flight';
  COOP.phaseT = 0;
  COOP.pairsFired++;
  // TUNE cards are judged by your aim at the moment of launch
  if (COOP.card === 'tune') {
    COOP.tuneOkAtLaunch =
      Math.abs(coopMatchProb() * 100 - COOP.tuneTarget) <= COOP_CFG.tuneTolerance;
  }
  const hasEve = COOP.round >= 4 && Math.random() < COOP_CFG.eveChance;
  COOP.eve = hasEve
    ? { active: false, zapped: false, measured: false, side: Math.random() < 0.5 ? -1 : 1 }
    : null;
  play('particle');
  updateCoopHud();
}

function resolveCoopRound() {
  COOP.state = 'resolve';
  COOP.phaseT = 0;

  const pNow = Math.round(coopMatchProb() * 100);
  let ok, a, b;
  if (COOP.eve && COOP.eve.measured) {
    // Entanglement destroyed — round auto-fails
    a = Math.random() < 0.5 ? 'up' : 'down';
    b = Math.random() < 0.5 ? 'up' : 'down';
    ok = false;
    coopSay(CT('eve_escaped'), '#ff6b7d');
  } else if (COOP.card === 'tune') {
    // Judged on aiming accuracy at launch; photons still behave honestly
    const pSame = coopMatchProb();
    a = Math.random() < 0.5 ? 'up' : 'down';
    const same = Math.random() < pSame;
    b = same ? a : (a === 'up' ? 'down' : 'up');
    ok = COOP.tuneOkAtLaunch;
    coopSay(ok ? CT('tune_hit', pNow) : CT('tune_miss', pNow), ok ? '#34e08a' : '#ff6b7d');
  } else {
    const pSame = coopMatchProb();
    a = Math.random() < 0.5 ? 'up' : 'down';
    const same = Math.random() < pSame;
    b = same ? a : (a === 'up' ? 'down' : 'up');
    ok = (COOP.card === 'match') === same;
    coopSay(ok ? CT('round_hit') : CT('round_miss'), ok ? '#34e08a' : '#ff6b7d');
  }
  COOP.lastResult = { a, b, ok };

  const cx = COOP.w * 0.5, cy = COOP.h * 0.5;
  if (ok) {
    COOP.score++;
    COOP.streak++;
    COOP.bestStreak = Math.max(COOP.bestStreak, COOP.streak);
    let gained = '+1';
    // Every 3rd streak hit awards a bonus point
    if (COOP.streak > 0 && COOP.streak % 3 === 0 && COOP.score < COOP_CFG.targetPoints) {
      COOP.score++;
      gained = '+2';
      coopSay(CT('streak_bonus'), '#ffb347');
    }
    COOP.floaters.push({ text: gained, color: '#34e08a', t: 0, x: cx, y: cy - 70 });
    for (let i = 0; i < 14; i++) {
      const ang = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 120;
      COOP.burst.push({ x: cx, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
                        t: 0, color: i % 2 ? '#34e08a' : '#22e0ff' });
    }
    play('discover');
  } else {
    COOP.streak = 0;
    COOP.shake = 1;
    play('collision');
  }
  COOP.score = Math.min(COOP.score, COOP_CFG.targetPoints);
  updateCoopHud();
}

function endCoop(won) {
  COOP.state = 'over';
  COOP.won = won;
  cancelAnimationFrame(COOP.raf);
  document.getElementById('coopGoal').classList.add('hidden');
  // Persist the best run
  const prev = coopBest();
  if (!prev || COOP.score > prev.score ||
      (COOP.score === prev.score && COOP.bestStreak > prev.streak)) {
    localStorage.setItem('qx_coop_best',
      JSON.stringify({ score: COOP.score, streak: COOP.bestStreak }));
  }
  if (won) {
    play('success');
    if (typeof confetti === 'function') confetti();
  } else {
    play('error');
  }
  renderCoopOver();
}

/* ── Physics ───────────────────────────────────────────────── */
function coopDeltaTheta() {
  let d = Math.abs(COOP.angleA - COOP.angleB) % 360;
  if (d > 180) d = 360 - d;
  return d; // 0..180
}
function coopMatchProb() {
  const d = coopDeltaTheta() * Math.PI / 180;
  return Math.cos(d / 2) ** 2;
}

/* ── HUD ───────────────────────────────────────────────────── */
function updateCoopHud() {
  const pips = document.getElementById('coopPips');
  if (pips) {
    pips.innerHTML = Array.from({ length: COOP_CFG.targetPoints }, (_, i) =>
      `<div class="coop-pip${i < COOP.score ? ' filled' : ''}"></div>`).join('');
  }
  const left = document.getElementById('coopPairsLeft');
  if (left) left.textContent = `${CT('pairs_left')}: ${COOP_CFG.pairBudget - COOP.pairsFired}`;
  const st = document.getElementById('coopStreak');
  if (st) st.textContent = COOP.streak >= 2 ? `🔥 ${CT('streak')} ×${COOP.streak}` : '';
}

function updateCoopMeter() {
  const p = Math.round(coopMatchProb() * 100);
  const val = document.getElementById('coopMeterVal');
  const fill = document.getElementById('coopMeterFill');
  if (!val || !fill) return;
  val.textContent = p;
  fill.style.width = p + '%';
  const good = COOP.card === 'match' ? p >= 88
    : COOP.card === 'anti' ? p <= 12
    : Math.abs(p - COOP.tuneTarget) <= COOP_CFG.tuneTolerance;
  fill.classList.toggle('good', good);
}

function updateCoopMeterMark() {
  const mark = document.getElementById('coopMeterMark');
  if (!mark) return;
  if (COOP.card === 'tune') {
    mark.style.display = 'block';
    mark.style.left = COOP.tuneTarget + '%';
  } else {
    mark.style.display = 'none';
  }
}

function coopSay(text, color) {
  COOP.msg = text;
  COOP.msgColor = color || '#c8d0ee';
  COOP.msgT = 0;
}

/* ── Input ─────────────────────────────────────────────────── */
// Uses e.code (physical keys) so it works on Thai/any keyboard layout
const COOP_KEYMAP = {
  KeyA: 'a', KeyD: 'd', KeyW: 'w',
  ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', ArrowUp: 'ArrowUp',
};
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('coopPage')?.classList.contains('active')) return;
  if (COOP.state === 'menu' || COOP.state === 'over') return;
  const k = COOP_KEYMAP[e.code];
  if (!k) return;
  e.preventDefault();
  if (k === 'w') { if (!e.repeat) coopZap(1); return; }
  if (k === 'ArrowUp') { if (!e.repeat) coopZap(2); return; }
  COOP.keys[k] = true;
});
document.addEventListener('keyup', (e) => {
  const k = COOP_KEYMAP[e.code];
  if (k) COOP.keys[k] = false;
});

function bindCoopTouch() {
  document.querySelectorAll('.coop-touch-btn').forEach(btn => {
    const k = btn.dataset.k;
    const on = (e) => {
      e.preventDefault();
      if (k === 'w') { coopZap(1); return; }
      if (k === 'ArrowUp') { coopZap(2); return; }
      COOP.keys[k] = true;
    };
    const off = (e) => { e.preventDefault(); COOP.keys[k] = false; };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointerleave', off);
  });
}

function coopZap(player) {
  if (COOP.state !== 'flight' && COOP.state !== 'aim') return;
  if (COOP.zapCd[player] > 0) {
    coopSay(CT('zap_cd'), '#8e9ac0');
    play('hover');
    return;
  }
  if (COOP.state === 'flight' &&
      COOP.eve && COOP.eve.active && !COOP.eve.zapped && !COOP.eve.measured) {
    COOP.eve.zapped = true;
    COOP.evesZapped++;
    COOP.zapFlash = 1;
    coopSay(CT('eve_zapped'), '#22e0ff');
    play('measure');
  } else {
    // False alarm — your zapper needs to recharge, so no spamming W/↑
    COOP.zapCd[player] = COOP_CFG.zapCooldown;
    COOP.zapFlash = 0.35;
    coopSay(CT('zap_false'), '#ffb347');
    play('hover');
  }
}

/* ── AI partner ────────────────────────────────────────────── */
function coopAiStep(dt) {
  // Aim for the goal with a little human-like lag and wobble
  let deltaWanted = 0;
  if (COOP.card === 'anti') deltaWanted = 180;
  else if (COOP.card === 'tune') deltaWanted = COOP.tuneTarget === 75 ? 60 : 120;
  const targetB = COOP.angleA + deltaWanted;
  let diff = ((targetB - COOP.angleB) % 360 + 540) % 360 - 180; // -180..180
  const speed = COOP_CFG.rotSpeed * 0.8;
  const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
  COOP.angleB = (COOP.angleB + step + 360) % 360;
  // AI zaps Eve with a human-ish reaction delay
  if (COOP.eve && COOP.eve.active && !COOP.eve.zapped && !COOP.eve.measured) {
    COOP.eve.aiTimer = (COOP.eve.aiTimer || 0) + dt;
    if (COOP.eve.aiTimer > 0.55 + Math.random() * 0.3) coopZap(2);
  }
}

/* ── Main loop ─────────────────────────────────────────────── */
function coopLoop(ts) {
  if (!document.getElementById('coopPage')?.classList.contains('active')) return; // page left
  if (COOP.state === 'menu' || COOP.state === 'over') return;

  if (!COOP.lastTs) COOP.lastTs = ts;
  const dt = Math.min((ts - COOP.lastTs) / 1000, 0.05);
  COOP.lastTs = ts;
  COOP.phaseT += dt;
  COOP.msgT += dt;
  COOP.zapFlash = Math.max(0, COOP.zapFlash - dt * 2.5);
  COOP.shake = Math.max(0, COOP.shake - dt * 3);
  COOP.zapCd[1] = Math.max(0, COOP.zapCd[1] - dt);
  COOP.zapCd[2] = Math.max(0, COOP.zapCd[2] - dt);
  COOP.floaters = COOP.floaters.filter(f => (f.t += dt) < 1.1);
  COOP.burst = COOP.burst.filter(p => {
    p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
    p.vx *= 0.96; p.vy *= 0.96;
    return p.t < 0.8;
  });

  // Rotation input
  const rs = COOP_CFG.rotSpeed * dt;
  if (COOP.keys['a']) COOP.angleA = (COOP.angleA - rs + 360) % 360;
  if (COOP.keys['d']) COOP.angleA = (COOP.angleA + rs) % 360;
  if (!COOP.aiPartner) {
    if (COOP.keys['ArrowLeft']) COOP.angleB = (COOP.angleB - rs + 360) % 360;
    if (COOP.keys['ArrowRight']) COOP.angleB = (COOP.angleB + rs) % 360;
  } else {
    coopAiStep(dt);
  }

  // Phase transitions
  if (COOP.state === 'aim' && COOP.phaseT >= COOP.aimTime) {
    launchCoopPair();
  } else if (COOP.state === 'flight') {
    const f = COOP.phaseT / COOP_CFG.flightTime;
    if (COOP.eve && !COOP.eve.active && f >= COOP_CFG.eveShowAt) {
      COOP.eve.active = true;
      coopSay(CT('eve_warn'), '#ffb347');
      play('error');
    }
    if (COOP.eve && COOP.eve.active && !COOP.eve.zapped && !COOP.eve.measured && f >= COOP_CFG.eveMeasureAt) {
      COOP.eve.measured = true;
    }
    if (f >= 1) resolveCoopRound();
  } else if (COOP.state === 'resolve' && COOP.phaseT >= COOP_CFG.resolveTime) {
    if (COOP.score >= COOP_CFG.targetPoints) { endCoop(true); return; }
    if (COOP.pairsFired >= COOP_CFG.pairBudget) { endCoop(false); return; }
    nextCoopRound();
  }

  updateCoopMeter();
  drawCoop();
  COOP.raf = requestAnimationFrame(coopLoop);
}

/* ── Drawing ───────────────────────────────────────────────── */
function drawCoop() {
  const ctx = COOP.ctx;
  if (!ctx) return;
  const { w, h } = COOP;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0b1e';
  ctx.fillRect(0, 0, w, h);

  // Star field (deterministic)
  ctx.fillStyle = 'rgba(180, 200, 255, 0.25)';
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 137.5) % 360) / 360 * w;
    const sy = ((i * 61.8) % 100) / 100 * h;
    ctx.fillRect(sx, sy, 1.6, 1.6);
  }

  // Screen shake on failures
  ctx.save();
  if (COOP.shake > 0) {
    ctx.translate((Math.random() - 0.5) * 9 * COOP.shake,
                  (Math.random() - 0.5) * 9 * COOP.shake);
  }

  const cy = h * 0.5;
  const cx = w * 0.5;
  const ax = w * 0.14, bx = w * 0.86;
  const detR = Math.min(44, w * 0.055);

  // Entanglement link line
  const g = ctx.createLinearGradient(ax, 0, bx, 0);
  g.addColorStop(0, 'rgba(34, 224, 255, 0.15)');
  g.addColorStop(0.5, 'rgba(176, 154, 255, 0.3)');
  g.addColorStop(1, 'rgba(255, 179, 71, 0.15)');
  ctx.strokeStyle = g;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 8]);
  ctx.beginPath(); ctx.moveTo(ax, cy); ctx.lineTo(bx, cy); ctx.stroke();
  ctx.setLineDash([]);

  // Source (pulsing heart of the system)
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 300);
  const srcGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26 + pulse * 8);
  srcGrad.addColorStop(0, 'rgba(176, 154, 255, 0.95)');
  srcGrad.addColorStop(1, 'rgba(176, 154, 255, 0)');
  ctx.fillStyle = srcGrad;
  ctx.beginPath(); ctx.arc(cx, cy, 26 + pulse * 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e9e2ff';
  ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(200, 208, 238, 0.7)';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Φ⁺', cx, cy - 34);

  // Detectors
  drawCoopDetector(ctx, ax, cy, detR, COOP.angleA, '#22e0ff',
    (lang === 'th' ? 'ผู้เล่น 1' : 'PLAYER 1'), COOP.lastResult?.a);
  drawCoopDetector(ctx, bx, cy, detR, COOP.angleB, '#ffb347',
    COOP.aiPartner ? CT('ai_name') : (lang === 'th' ? 'ผู้เล่น 2' : 'PLAYER 2'), COOP.lastResult?.b);

  // Zap-readiness indicators beside each detector
  drawZapReady(ctx, ax, cy - detR - 34, COOP.zapCd[1], '#22e0ff');
  drawZapReady(ctx, bx, cy - detR - 34, COOP.zapCd[2], '#ffb347');

  // Aim countdown ring around the source
  if (COOP.state === 'aim') {
    const frac = 1 - COOP.phaseT / COOP.aimTime;
    ctx.strokeStyle = 'rgba(240, 244, 255, 0.75)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
  }

  // Photons in flight
  if (COOP.state === 'flight') {
    const f = Math.min(COOP.phaseT / COOP_CFG.flightTime, 1);
    const pxA = cx + (ax + detR + 4 - cx) * f;
    const pxB = cx + (bx - detR - 4 - cx) * f;
    const wob = Math.sin(f * 26) * 7;
    drawPhoton(ctx, pxA, cy + wob, '#22e0ff');
    drawPhoton(ctx, pxB, cy - wob, '#ffb347');

    // Eve on a random side each time — both players must watch
    if (COOP.eve && COOP.eve.active && !COOP.eve.zapped) {
      const evTarget = COOP.eve.side < 0 ? ax : bx;
      const ex = cx + (evTarget - cx) * 0.45;
      const bob = Math.sin(performance.now() / 160) * 4;
      ctx.font = `${Math.round(detR * 0.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🕵️', ex, cy - 26 + bob);
      if (!COOP.eve.measured) {
        // Warning ring
        ctx.strokeStyle = `rgba(255, 179, 71, ${0.5 + 0.4 * Math.sin(performance.now() / 120)})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ex, cy - 34 + bob, detR * 0.62, 0, Math.PI * 2); ctx.stroke();
      } else {
        // Eve measuring — red collapse zap toward the photon on her side
        const victim = COOP.eve.side < 0 ? { x: pxA, y: cy + wob } : { x: pxB, y: cy - wob };
        ctx.strokeStyle = 'rgba(255, 107, 125, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ex, cy - 20 + bob); ctx.lineTo(victim.x, victim.y); ctx.stroke();
      }
    }
  }

  // Zap flash (laser from both edges to Eve's spot)
  if (COOP.zapFlash > 0 && COOP.eve && COOP.eve.zapped) {
    const evTarget = COOP.eve.side < 0 ? ax : bx;
    const ex = cx + (evTarget - cx) * 0.45;
    ctx.strokeStyle = `rgba(34, 224, 255, ${COOP.zapFlash})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ax, cy - detR); ctx.lineTo(ex, cy - 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, cy - detR); ctx.lineTo(ex, cy - 34); ctx.stroke();
    ctx.fillStyle = `rgba(240, 244, 255, ${COOP.zapFlash * 0.9})`;
    ctx.beginPath(); ctx.arc(ex, cy - 34, 14 * (1.6 - COOP.zapFlash), 0, Math.PI * 2); ctx.fill();
  }

  // Success particle burst
  for (const p of COOP.burst) {
    ctx.globalAlpha = Math.max(0, 1 - p.t / 0.8);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Result verdict
  if (COOP.state === 'resolve' && COOP.lastResult) {
    ctx.font = `700 ${Math.round(detR * 0.9)}px "Orbitron", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COOP.lastResult.ok ? 'rgba(52, 224, 138, 0.95)' : 'rgba(255, 107, 125, 0.95)';
    ctx.fillText(COOP.lastResult.ok ? '✔' : '✖', cx, cy - 50);
  }

  // Rising score floaters
  for (const f of COOP.floaters) {
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.1);
    ctx.fillStyle = f.color;
    ctx.font = '800 26px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y - f.t * 44);
  }
  ctx.globalAlpha = 1;

  // Δθ readout
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(142, 154, 192, 0.9)';
  ctx.fillText(`Δθ = ${Math.round(coopDeltaTheta())}°`, cx, h - 14);

  // Floating message
  if (COOP.msg && COOP.msgT < 2.2) {
    const alpha = COOP.msgT < 1.7 ? 1 : (2.2 - COOP.msgT) / 0.5;
    ctx.font = `600 15px ${lang === 'th' ? '"Kanit",' : ''} "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COOP.msgColor;
    ctx.globalAlpha = alpha;
    ctx.fillText(COOP.msg, cx, h * 0.24);
    ctx.globalAlpha = 1;
  }

  ctx.restore(); // end shake transform
}

function drawZapReady(ctx, x, y, cd, color) {
  const ready = cd <= 0;
  ctx.globalAlpha = ready ? 0.9 : 0.25;
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText('⚡', x, y);
  if (!ready) {
    // Recharge arc
    const frac = 1 - cd / COOP_CFG.zapCooldown;
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 5, 11, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawCoopDetector(ctx, x, y, r, angle, color, label, result) {
  // Body
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Tick marks
  ctx.strokeStyle = 'rgba(170, 190, 255, 0.25)';
  ctx.lineWidth = 1;
  for (let a = 0; a < 360; a += 45) {
    const rad = a * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(rad) * (r - 5), y + Math.sin(rad) * (r - 5));
    ctx.lineTo(x + Math.cos(rad) * r, y + Math.sin(rad) * r);
    ctx.stroke();
  }

  // Direction arrow
  const rad = (angle - 90) * Math.PI / 180; // 0° points up
  const tipX = x + Math.cos(rad) * (r - 8);
  const tipY = y + Math.sin(rad) * (r - 8);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tipX, tipY); ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - 10 * Math.cos(rad - 0.45), tipY - 10 * Math.sin(rad - 0.45));
  ctx.lineTo(tipX - 10 * Math.cos(rad + 0.45), tipY - 10 * Math.sin(rad + 0.45));
  ctx.closePath(); ctx.fill();

  // Result dot
  if (result) {
    ctx.fillStyle = result === 'up' ? '#34e08a' : '#ff6b7d';
    ctx.beginPath(); ctx.arc(x, y + r + 18, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#06121a';
    ctx.font = '700 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'up' ? '↑' : '↓', x, y + r + 22);
  }

  // Labels
  ctx.font = `600 12px ${lang === 'th' ? '"Kanit",' : ''} "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText(label, x, y - r - 12);
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(200, 208, 238, 0.8)';
  ctx.fillText(Math.round(angle) + '°', x, y + r + 40);
}

function drawPhoton(ctx, x, y, color) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, 14);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
}
