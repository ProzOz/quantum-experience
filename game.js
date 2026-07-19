'use strict';

/* ============================================================
   Qubit Runner — Quantum Experience · SCIUS BUU
   An arcade game where you ARE a quantum particle.
   ============================================================
   RULES:
     • Barriers scroll left. You must be in a clear lane to survive.
     • Hold SPACE (or long-press on touch) to SPLIT into superposition
       across 2 lanes simultaneously — then your wave packet can tunnel
       through a barrier with probability T = exp(−κ·thickness).
     • Coherence meter depletes while split; regenerates while whole.
     • Colliding with a barrier un-split = instant collapse (game over).
   ============================================================ */

const QR = (() => {
  /* ── private state ───────────────────────────────────────── */
  let canvas, ctx, W, H;
  let LANES, laneH;
  const PLAYER_X_FRAC = 0.22; // player is drawn at 22% of width

  let state = 'idle'; // idle | playing | dead
  let raf = null;
  let lastTs = 0;
  let frameN = 0;

  // Player
  let lane = 1;           // 0..LANES-1  current lane index
  let laneTarget = 1;
  let laneY = 0;          // smooth Y position
  let coherence = 1.0;
  let isSplit = false;
  let splitPhase = 0;

  // Score
  let score = 0;
  let highScore = parseInt(localStorage.getItem('qrun_hs') || '0');
  let speed = 2.8;        // pixels per frame
  let dist = 0;           // world distance scrolled

  // Obstacles: each is { sx, lane, w, thickness, passed, type:'wall'|'gate' }
  //   sx = screen x of the left edge (starts at W, scrolls left)
  let obstacles = [];
  let spawnCd = 0;

  // Effects
  let flashes  = []; // {x, y, r, color, a}
  let sparks   = []; // {x, y, vx, vy, a, color}
  let shake    = 0;

  // Input
  let spaceDown = false;
  let touchActive = false;
  let touchHold = false;
  let touchHoldTimer = 0;
  let boundKeys = false;

  /* ── helpers ─────────────────────────────────────────────── */
  function laneToY(l) { return (l + 0.5) * laneH; }

  function tunnelP(thickness) {
    // T = exp(−κ · thickness), κ = 0.075
    return Math.exp(-0.075 * Math.max(0, thickness));
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  function glow(x, y, radius, hex, alpha) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(${hexToRgb(hex)},${alpha})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDisc(x, y, r, hex, alpha) {
    ctx.fillStyle = `rgba(${hexToRgb(hex)},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function addFlash(x, y, hex, r) {
    flashes.push({ x, y, r, color: hex, a: 1.0 });
  }

  function addSparks(x, y, hex, n) {
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 4;
      sparks.push({ x, y, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, a: 1, color: hex });
    }
  }

  function tryPlay(name) {
    // delegate to app.js's play() if it exists
    if (typeof play === 'function') play(name);
  }

  /* ── resize ──────────────────────────────────────────────── */
  function resize() {
    const wrap = document.getElementById('gameWrap');
    if (!wrap || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = wrap.clientWidth;
    H = wrap.clientHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    LANES = 4;
    laneH = H / LANES;
    laneY = laneToY(lane);
  }

  /* ── init ────────────────────────────────────────────────── */
  function init() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    if (!boundKeys) {
      bindInput();
      boundKeys = true;
    }
    // Draw idle background so canvas isn't blank before the menu shows
    drawBg();
    // Keep the menu overlay's high score up to date
    refreshMenuHs();
  }

  /* ── input ───────────────────────────────────────────────── */
  function bindInput() {
    // Keyboard
    window.addEventListener('keydown', e => {
      if (state !== 'playing') return;
      if (e.code === 'Space' || e.code === 'ShiftLeft') {
        e.preventDefault();
        if (!spaceDown) { spaceDown = true; beginSplit(); }
      }
      if (e.code === 'ArrowUp'   || e.code === 'KeyW') { e.preventDefault(); moveLane(-1); }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); moveLane(+1); }
    });
    window.addEventListener('keyup', e => {
      if (e.code === 'Space' || e.code === 'ShiftLeft') {
        spaceDown = false;
        endSplit();
      }
    });

    // Touch: tap-and-hold for split; swipe up/down for lane
    canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (state === 'idle')     { startGame(); return; }
      if (state === 'dead')     { showMenuScreen(); return; }
      touchActive = true;
      touchHold = false;
      touchHoldTimer = setTimeout(() => { touchHold = true; beginSplit(); }, 180);
    }, { passive: false });

    canvas.addEventListener('pointermove', e => {
      if (state !== 'playing' || !touchActive) return;
      e.preventDefault();
      const newLane = Math.max(0, Math.min(LANES-1, Math.floor((e.offsetY) / laneH)));
      if (newLane !== laneTarget) moveLane(newLane - laneTarget);
    }, { passive: false });

    canvas.addEventListener('pointerup', e => {
      clearTimeout(touchHoldTimer);
      touchActive = false;
      if (touchHold) endSplit();
      touchHold = false;
    });
  }

  function moveLane(dir) {
    laneTarget = Math.max(0, Math.min(LANES-1, laneTarget + dir));
  }

  function beginSplit() {
    if (isSplit || coherence < 0.08 || state !== 'playing') return;
    isSplit = true;
    splitPhase = 0;
    coherence = Math.max(0, coherence - 0.10);
    addFlash(W * PLAYER_X_FRAC, laneY, '#22e0ff', 40);
    tryPlay('success');
  }

  function endSplit() {
    if (!isSplit) return;
    isSplit = false;
    coherence = Math.max(0, coherence - 0.06);
  }

  /* ── game flow ───────────────────────────────────────────── */
  function startGame() {
    state = 'playing';
    score = 0;
    dist  = 0;
    speed = 2.8;
    lane = 1;
    laneTarget = 1;
    laneY = laneToY(1);
    coherence = 1.0;
    isSplit = false;
    spaceDown = false;
    obstacles = [];
    flashes = [];
    sparks  = [];
    spawnCd = 80;
    shake   = 0;
    frameN  = 0;

    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';

    tryPlay('nav');
    cancelAnimationFrame(raf);
    lastTs = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function showMenuScreen() {
    state = 'idle';
    cancelAnimationFrame(raf);
    document.getElementById('gameMenu').style.display = 'flex';
    document.getElementById('gameOver').style.display = 'none';
    refreshMenuHs();
  }

  function die() {
    if (state === 'dead') return;
    state = 'dead';
    addFlash(W * PLAYER_X_FRAC, laneY, '#ff6b7d', 90);
    addSparks(W * PLAYER_X_FRAC, laneY, '#ff6b7d', 24);
    shake = 22;
    tryPlay('error');

    const isNewRecord = score > highScore && score > 0;
    if (isNewRecord) {
      highScore = score;
      localStorage.setItem('qrun_hs', highScore);
    }

    // Notify lab puzzle system
    if (typeof checkStation4Score === 'function') checkStation4Score(score);

    setTimeout(() => {
      const el = document.getElementById('gameOver');
      if (!el) return;
      document.getElementById('goScore').textContent = score;
      document.getElementById('goBest').textContent  = highScore;
      const nr = document.getElementById('goNewRecord');
      if (nr) nr.style.display = isNewRecord ? 'block' : 'none';
      el.style.display = 'flex';
    }, 700);
  }

  function refreshMenuHs() {
    const el = document.getElementById('menuHighScore');
    if (el) el.textContent = highScore > 0 ? 'BEST: ' + highScore : '';
  }

  /* ── main loop ───────────────────────────────────────────── */
  function loop(ts) {
    const dt = Math.min((ts - lastTs) / 16.667, 3);
    lastTs = ts;
    frameN++;
    if (state === 'playing') update(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  /* ── update ──────────────────────────────────────────────── */
  function update(dt) {
    // Speed / difficulty ramp
    dist  += speed * dt;
    score  = Math.floor(dist / 8);
    speed  = 2.8 + dist / 4000;        // caps around 10 at ~29000 dist

    const spawnInterval = Math.max(38, 100 - dist / 200);

    // Smooth lane
    laneY += (laneToY(laneTarget) - laneY) * 0.20 * dt;

    // Coherence
    if (isSplit) {
      coherence -= 0.0028 * dt;
      splitPhase += 0.09 * dt;
      if (coherence <= 0) { coherence = 0; endSplit(); }
    } else {
      coherence = Math.min(1, coherence + 0.0018 * dt);
    }

    // Spawn obstacles
    spawnCd -= dt;
    if (spawnCd <= 0) {
      spawnCd = spawnInterval;
      spawnObstacle();
    }

    // Scroll obstacles & check collisions
    const playerX = W * PLAYER_X_FRAC;
    const keepObs = [];
    for (const obs of obstacles) {
      obs.sx -= speed * dt;

      // Hit-test: player passes through obstacle's x range
      if (!obs.passed && obs.sx + obs.w < playerX) {
        obs.passed = true;
        const playerInLane = (obs.type === 'wall') && (obs.lane === laneTarget);

        if (playerInLane) {
          if (isSplit) {
            // Tunneling roll
            const p = tunnelP(obs.thickness);
            if (Math.random() < p) {
              score  += 20;
              coherence = Math.min(1, coherence + 0.18);
              addFlash(playerX, laneY, '#34e08a', 50);
              addSparks(playerX, laneY, '#34e08a', 12);
              tryPlay('success');
            } else {
              // Partial collapse then lose
              endSplit();
              die();
              return;
            }
          } else {
            // Not split = guaranteed death
            die();
            return;
          }
        } else {
          // Cleared safely
          score += 5;
          addFlash(playerX, laneToY(obs.lane), '#22e0ff', 20);
        }
      }

      if (obs.sx > -100) keepObs.push(obs);
    }
    obstacles = keepObs;

    // Effects
    flashes = flashes.filter(f => (f.a -= 0.04 * dt) > 0);
    sparks  = sparks.filter(s => {
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.vx *= 0.94; s.vy *= 0.94;
      s.a  -= 0.035 * dt;
      return s.a > 0;
    });
    if (shake > 0) shake -= 0.9 * dt;
  }

  function spawnObstacle() {
    const thickness = Math.max(8, 38 - dist / 300);

    // 70% chance: single lane wall, 30%: multi-wall (harder)
    if (Math.random() < 0.7) {
      const l = Math.floor(Math.random() * LANES);
      obstacles.push({ sx: W + 20, lane: l, w: 20, thickness, passed: false, type: 'wall' });
    } else {
      // Block 2 adjacent lanes — player must dodge AND split
      const l = Math.floor(Math.random() * (LANES - 1));
      obstacles.push({ sx: W + 20, lane: l,   w: 18, thickness, passed: false, type: 'wall' });
      obstacles.push({ sx: W + 20, lane: l+1, w: 18, thickness, passed: false, type: 'wall' });
    }
  }

  /* ── draw ────────────────────────────────────────────────── */
  function draw() {
    if (!ctx) return;
    // Screen shake
    let sx = 0, sy = 0;
    if (shake > 0) { sx = (Math.random()-.5)*shake; sy = (Math.random()-.5)*shake; }
    ctx.save();
    ctx.translate(sx, sy);

    drawBg();
    drawObstacles();
    drawPlayer();
    drawEffects();
    if (state === 'playing') drawHUD();

    ctx.restore();
  }

  function drawBg() {
    // Deep space
    ctx.fillStyle = '#06060f';
    ctx.fillRect(-20, -20, (W||800)+40, (H||500)+40);

    if (!W) return;

    // Lane dividers
    ctx.strokeStyle = 'rgba(34, 224, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < LANES; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * laneH);
      ctx.lineTo(W, i * laneH);
      ctx.stroke();
    }

    // Scrolling vertical grid
    if (state === 'playing') {
      const gap = 90;
      const off = -(dist % gap);
      ctx.strokeStyle = 'rgba(100, 80, 200, 0.06)';
      for (let x = off; x < W; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
    }
  }

  function drawObstacles() {
    for (const obs of obstacles) {
      if (obs.sx < -30 || obs.sx > W + 30) continue;
      const y = obs.lane * laneH;
      const h = laneH;
      const color = obs.type === 'wall' ? '#9b7bff' : '#ff6b7d';
      const rgb   = obs.type === 'wall' ? '155,123,255' : '255,107,125';

      // Ambient glow
      const gg = ctx.createRadialGradient(obs.sx + obs.w/2, y + h/2, 0, obs.sx + obs.w/2, y + h/2, h * 0.7);
      gg.addColorStop(0, `rgba(${rgb},0.18)`);
      gg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gg;
      ctx.fillRect(obs.sx - 30, y - 10, obs.w + 60, h + 20);

      // Body
      const bg = ctx.createLinearGradient(obs.sx, y, obs.sx + obs.w, y + h);
      bg.addColorStop(0, `rgba(${rgb},0.9)`);
      bg.addColorStop(1, `rgba(${rgb},0.4)`);
      ctx.fillStyle = bg;
      ctx.fillRect(obs.sx, y, obs.w, h);

      // Edge highlight
      ctx.strokeStyle = `rgba(${rgb},0.7)`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obs.sx, y, obs.w, h);

      // Tunneling odds badge (shown when split)
      if (isSplit && obs.type === 'wall' && state === 'playing') {
        const p = tunnelP(obs.thickness);
        const pct = Math.round(p * 100);
        ctx.fillStyle = pct > 20 ? '#34e08a' : pct > 5 ? '#ffb347' : '#ff6b7d';
        ctx.font = `bold 11px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(pct + '%', obs.sx + obs.w / 2, y + h / 2 + 4);
        ctx.textAlign = 'left';
      }
    }
  }

  function drawPlayer() {
    if (!W) return;
    const px = W * PLAYER_X_FRAC;
    const py = laneY;

    if (state === 'dead') {
      // Dissolved particle
      glow(px, py, 40, '#ff6b7d', 0.15);
      return;
    }

    if (isSplit) {
      // Two ghost particles
      const drift = Math.sin(splitPhase) * 14;
      const g1y = py - drift;
      const g2y = py + drift;

      // Entanglement link
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = `rgba(155,123,255,${0.3 + Math.abs(Math.sin(splitPhase)) * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(px - 4, g1y); ctx.lineTo(px - 4, g2y); ctx.stroke();
      ctx.setLineDash([]);

      // Wave packet envelopes
      drawWave(px, g1y, 28, splitPhase, 'rgba(34,224,255,0.35)');
      drawWave(px, g2y, 28, splitPhase + Math.PI, 'rgba(155,123,255,0.35)');

      // Ghost glows
      const cAlpha = 0.5 + coherence * 0.4;
      glow(px, g1y, 22, '#22e0ff', cAlpha * 0.6);
      glow(px, g2y, 22, '#9b7bff', cAlpha * 0.6);

      // Core dots
      drawDisc(px, g1y, 7, '#22e0ff', cAlpha);
      drawDisc(px, g2y, 7, '#9b7bff', cAlpha);
      // Bright centers
      drawDisc(px, g1y, 3, '#ffffff', 0.9);
      drawDisc(px, g2y, 3, '#ffffff', 0.9);

    } else {
      // Single whole particle
      drawWave(px, py, 24, frameN * 0.055, 'rgba(34,224,255,0.3)');
      glow(px, py, 28, '#22e0ff', 0.55);
      drawDisc(px, py, 9, '#22e0ff', 1.0);
      drawDisc(px, py, 3.5, '#ffffff', 0.95);

      // Decoherence ring — grows as coherence drains
      if (coherence < 0.85) {
        const t = 1 - coherence;
        ctx.strokeStyle = `rgba(255,107,125,${t * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 13 + t * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawWave(cx, cy, halfW, phase, color) {
    ctx.beginPath();
    for (let i = -halfW; i <= halfW; i += 2) {
      const env = Math.exp(-((i / halfW) ** 2) * 3);
      const wy  = cy + env * Math.cos(i * 0.38 + phase) * 13;
      i === -halfW ? ctx.moveTo(cx + i, wy) : ctx.lineTo(cx + i, wy);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawEffects() {
    for (const f of flashes) {
      glow(f.x, f.y, f.r * f.a, f.color, f.a * 0.8);
    }
    for (const s of sparks) {
      drawDisc(s.x, s.y, 2.5 * s.a, s.color, s.a);
    }
  }

  function drawHUD() {
    // Score (top-left)
    ctx.fillStyle = 'rgba(34,224,255,0.95)';
    ctx.font = 'bold 30px "Orbitron", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(score, 20, 42);

    ctx.fillStyle = 'rgba(155,123,255,0.65)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('BEST ' + highScore, 20, 60);

    // Coherence bar (top-right)
    const bx = W - 170, by = 16, bw = 150, bh = 13;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(bx, by, bw, bh);

    const cColor = coherence > 0.5 ? '#34e08a' : coherence > 0.25 ? '#ffb347' : '#ff6b7d';
    const cRgb   = coherence > 0.5 ? '52,224,138' : coherence > 0.25 ? '255,179,71' : '255,107,125';
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(0, cColor);
    grad.addColorStop(1, '#22e0ff');
    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, bw * coherence, bh);

    ctx.strokeStyle = 'rgba(150,175,255,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.fillStyle = 'rgba(150,175,255,0.6)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('COHERENCE', bx - 6, by + 10);
    ctx.textAlign = 'left';

    // Hint strip (fades after a while)
    if (frameN < 200) {
      const a = Math.max(0, 1 - frameN / 200);
      ctx.globalAlpha = a * 0.75;
      ctx.fillStyle = '#eef3ff';
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('↑↓ or W/S to change lane · Hold SPACE to split into superposition', W / 2, H - 22);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }

    // Superposition label while split
    if (isSplit) {
      const pulse = 0.6 + Math.abs(Math.sin(frameN * 0.07)) * 0.4;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#9b7bff';
      ctx.font = 'bold 12px "Orbitron", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ SUPERPOSITION', W / 2, H - 22);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
    }
  }

  /* ── public API ──────────────────────────────────────────── */
  return {
    get raf() { return raf; },
    set raf(v) { raf = v; },
    get highScore() { return highScore; },
    init,
    resize,
    startGame,
    showMenu: showMenuScreen,
  };
})();

window.addEventListener('load', () => QR.init());
