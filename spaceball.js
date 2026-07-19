'use strict';
/* ============================================================
   spaceball.js — Cute Pink Owner Spaceball
   Bounces around, gets kicked by cursor, hurts when touched
   Fun & kawaii by student perspective ✨
   ============================================================ */

(function () {
  /* ── Config ──────────────────────────────────────────────── */
  const CFG = {
    bounceDecay: 0.82,
    friction: 0.997,
    kickStrength: 18,
    idleSpeed: 1.8,
    idleTurnChance: 0.012,
    kickRadius: 140,
    hurtRadius: 55,
    hurtRecoveryMs: 900,
    ballSize: 90,
    pink1: '#ff9ec4',
    pink2: '#ff6ba8',
    pink3: '#ffb3d0',
    pinkGlow: 'rgba(255, 107, 168, 0.6)',
    hurtColor: '#ff4488',
  };

  /* ── State ───────────────────────────────────────────────── */
  const SB = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    angle: 0,
    angVel: 0,
    hurting: false,
    hurtTimer: null,
    hurtCount: 0,
    squash: 1,
    squashY: 1,
    bounceSquash: 0,
    visible: false,
    idleTimer: 0,
  };

  /* ── DOM refs ────────────────────────────────────────────── */
  let ball, face, hurt;
  let trailCanvas, trailCtx;
  const trailPoints = [];
  const MAX_TRAIL = 28;
  const sparkles = [];
  const MAX_SPARKLES = 60;

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    buildDOM();
    resetPosition();
    setTimeout(firstKick, 500);
    requestAnimationFrame(loop);
    SB.visible = true;
    document.getElementById('ownerSpaceball').style.display = 'block';
  }

  function buildDOM() {
    const container = document.getElementById('ownerSpaceball');
    container.style.cssText = `
      position:fixed;inset:0;pointer-events:none;
      z-index:8888;overflow:hidden;display:none;
    `;

    // Trail canvas
    trailCanvas = document.createElement('canvas');
    trailCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    resizeTrailCanvas();
    container.appendChild(trailCanvas);
    trailCtx = trailCanvas.getContext('2d');

    window.addEventListener('resize', resizeTrailCanvas);

    // Ball wrapper — transparent, just shows the person image
    ball = document.getElementById('spaceballBall');
    ball.style.cssText = `
      position:absolute;
      width:${CFG.ballSize}px;height:${CFG.ballSize}px;
      border-radius:20px;
      background:transparent;
      box-shadow:none;
      border:none;
      will-change:transform,left,top;
    `;

    // Owner image — clipped to rounded rect so it fills the frame cleanly
    const imgWrap = document.getElementById('spaceballImgWrap');
    if (imgWrap) {
      imgWrap.style.cssText = `
        position:absolute;inset:0;
        border-radius:18px;
        overflow:hidden;
      `;
      const img = document.getElementById('spaceballImg');
      if (img) {
        img.style.cssText = `
          width:100%;height:100%;object-fit:cover;
          display:block;pointer-events:none;user-select:none;
          border-radius:18px;
        `;
      }
    }

    // Face overlay (nested inside ball so it moves with it)
    face = document.getElementById('spaceballFace');
    face.style.cssText = `
      position:absolute;inset:0;border-radius:20px;
      pointer-events:none;
    `;

    // Hurt overlay (also nested)
    hurt = document.getElementById('spaceballHurt');
    hurt.style.cssText = `
      position:absolute;inset:0;border-radius:18px;
      background:rgba(255,107,168,0.03);
      display:none;pointer-events:none;
    `;

    // Inject global animations
    injectStyles();

    updateFace('happy');
  }

  function injectStyles() {
    if (document.getElementById('sbStyles')) return;
    const s = document.createElement('style');
    s.id = 'sbStyles';
    s.textContent = `
      @keyframes tearDrop {
        0%   { transform: translateY(0) scaleY(1); opacity: 0.9; }
        100% { transform: translateY(14px) scaleY(1.5); opacity: 0; }
      }
      @keyframes hurtPulse {
        0%,100% { box-shadow: none; border-radius:20px; border:none; }
        50%      { box-shadow: none; border-radius:20px; border:none; }
      }
      @keyframes hurtSpin {
        0%   { transform: scaleX(1) scaleY(1) rotate(0deg); border-radius:20px; }
        20%  { transform: scaleX(1.1) scaleY(0.9) rotate(-10deg); border-radius:20px; }
        40%  { transform: scaleX(0.92) scaleY(1.08) rotate(8deg); border-radius:20px; }
        60%  { transform: scaleX(1.06) scaleY(0.94) rotate(-6deg); border-radius:20px; }
        80%  { transform: scaleX(0.96) scaleY(1.04) rotate(4deg); border-radius:20px; }
        100% { transform: scaleX(1) scaleY(1) rotate(0deg); border-radius:20px; }
      }
      @keyframes hurtFlash {
        0%   { opacity: 0.45; }
        100% { opacity: 0; }
      }
      @keyframes screenShake {
        0%   { transform: translate(0,0); }
        15%  { transform: translate(-5px, 3px); }
        30%  { transform: translate(5px, -3px); }
        45%  { transform: translate(-3px, 5px); }
        60%  { transform: translate(3px,-5px); }
        75%  { transform: translate(-2px, 2px); }
        90%  { transform: translate(2px,-2px); }
        100% { transform: translate(0,0); }
      }
    `;
    document.head.appendChild(s);
  }

  function resizeTrailCanvas() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }

  function resetPosition() {
    SB.x = window.innerWidth / 2;
    SB.y = window.innerHeight / 2;
    SB.vx = (Math.random() - 0.5) * 2;
    SB.vy = (Math.random() - 0.5) * 2;
    SB.angle = 0;
    SB.angVel = 0;
    SB.squash = 1;
    SB.squashY = 1;
    SB.bounceSquash = 0;
    updateBallPosition();
  }

  function firstKick() {
    const angle = Math.random() * Math.PI * 2;
    SB.vx = Math.cos(angle) * CFG.idleSpeed * 2;
    SB.vy = Math.sin(angle) * CFG.idleSpeed * 2;
  }

  /* ── Face expressions ────────────────────────────────────── */
  function updateFace(state) {
    const sz = CFG.ballSize;
    let html = '';

    if (state === 'happy') {
      html = `
        <!-- Happy face -->
        <div style="position:absolute;top:${sz*0.30}px;left:${sz*0.19}px;width:${sz*0.20}px;height:${sz*0.11}px;
                    background:${CFG.pink1};border-radius:0 0 50% 50%;opacity:0.65"></div>
        <div style="position:absolute;top:${sz*0.30}px;right:${sz*0.19}px;width:${sz*0.20}px;height:${sz*0.11}px;
                    background:${CFG.pink1};border-radius:0 0 50% 50%;opacity:0.65"></div>
        <div style="position:absolute;bottom:${sz*0.24}px;left:50%;transform:translateX(-50%);
                    width:${sz*0.38}px;height:${sz*0.20}px;
                    border:3px solid ${CFG.pink1};border-top:none;border-radius:0 0 50% 50%;
                    background:transparent;opacity:0.75"></div>
      `;
    } else if (state === 'hurt') {
      const ex = `font-family:sans-serif;font-size:${sz*0.24}px;font-weight:900;color:${CFG.hurtColor};text-shadow:0 0 8px ${CFG.hurtColor};line-height:1;position:absolute;top:${sz*0.26}px`;
      html = `
        <div style="${ex};left:${sz*0.17}px">×</div>
        <div style="${ex};right:${sz*0.17}px">×</div>
        <!-- Tears -->
        <div style="position:absolute;top:${sz*0.44}px;left:${sz*0.22}px;width:${sz*0.09}px;height:${sz*0.15}px;
                    background:linear-gradient(180deg,#b8e8ff,transparent);border-radius:50% 50% 50% 50%;
                    animation:tearDrop 0.5s ease-in infinite;opacity:0.9"></div>
        <div style="position:absolute;top:${sz*0.44}px;right:${sz*0.22}px;width:${sz*0.09}px;height:${sz*0.15}px;
                    background:linear-gradient(180deg,#b8e8ff,transparent);border-radius:50% 50% 50% 50%;
                    animation:tearDrop 0.5s ease-in 0.25s infinite;opacity:0.9"></div>
        <!-- Dizzy mouth -->
        <div style="position:absolute;bottom:${sz*0.26}px;left:50%;transform:translateX(-50%);
                    font-size:${sz*0.15}px;color:${CFG.hurtColor};opacity:0.85;font-weight:700;
                    font-family:monospace;text-shadow:0 0 6px ${CFG.hurtColor}">~_~</div>
      `;
    } else if (state === 'shocked') {
      html = `
        <div style="position:absolute;top:${sz*0.27}px;left:${sz*0.20}px;width:${sz*0.17}px;height:${sz*0.17}px;
                    background:${CFG.pink1};border-radius:50%;opacity:0.85"></div>
        <div style="position:absolute;top:${sz*0.27}px;right:${sz*0.20}px;width:${sz*0.17}px;height:${sz*0.17}px;
                    background:${CFG.pink1};border-radius:50%;opacity:0.85"></div>
        <div style="position:absolute;bottom:${sz*0.20}px;left:50%;transform:translateX(-50%);
                    width:${sz*0.22}px;height:${sz*0.22}px;
                    border:3px solid ${CFG.pink1};border-radius:50%;background:transparent;opacity:0.8"></div>
      `;
    }

    face.innerHTML = html;
  }

  /* ── Mouse tracking ──────────────────────────────────────── */
  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* ── Physics loop ────────────────────────────────────────── */
  let lastTime = 0;

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 16.67, 3);
    lastTime = timestamp;

    if (SB.visible) {
      updatePhysics(dt);
      updateBallPosition();
      renderTrail();
      updateSparkles(dt);
      checkHurt();
    }

    requestAnimationFrame(loop);
  }

  function updatePhysics(dt) {
    const halfSize = CFG.ballSize / 2;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Friction
    SB.vx *= Math.pow(CFG.friction, dt);
    SB.vy *= Math.pow(CFG.friction, dt);

    // Idle wandering nudges
    SB.idleTimer += dt;
    if (SB.idleTimer > 30 && (Math.abs(SB.vx) < 0.6 || Math.abs(SB.vy) < 0.6)) {
      const angle = Math.random() * Math.PI * 2;
      SB.vx += Math.cos(angle) * CFG.idleSpeed * 0.4;
      SB.vy += Math.sin(angle) * CFG.idleSpeed * 0.4;
      SB.idleTimer = 0;
    }
    if (Math.random() < CFG.idleTurnChance * dt) {
      const angle = Math.random() * Math.PI * 2;
      SB.vx += Math.cos(angle) * CFG.idleSpeed * 0.5;
      SB.vy += Math.sin(angle) * CFG.idleSpeed * 0.5;
    }

    // Cursor push (kick)
    const dx = SB.x - mouseX;
    const dy = SB.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CFG.kickRadius && dist > 0) {
      const force = (CFG.kickRadius - dist) / CFG.kickRadius;
      const nx = dx / dist;
      const ny = dy / dist;
      SB.vx += nx * force * CFG.kickStrength * 0.15 * dt;
      SB.vy += ny * force * CFG.kickStrength * 0.15 * dt;
      SB.angVel += (Math.random() - 0.5) * force * 8;

      if (force > 0.5) {
        SB.bounceSquash = Math.max(SB.bounceSquash, force * 0.3);
        spawnSparkles(SB.x, SB.y, 4);
        playSound('kick', force);
      }
      if (force > 0.3 && Math.random() < 0.3) {
        spawnSparkle(
          SB.x + (Math.random() - 0.5) * CFG.ballSize,
          SB.y + (Math.random() - 0.5) * CFG.ballSize
        );
      }
    }

    // Integrate position
    SB.x += SB.vx * dt;
    SB.y += SB.vy * dt;

    // Wall bounce with energy decay
    let bounced = false;
    if (SB.x < halfSize) {
      SB.x = halfSize;
      SB.vx = Math.abs(SB.vx) * CFG.bounceDecay;
      bounced = true;
    } else if (SB.x > W - halfSize) {
      SB.x = W - halfSize;
      SB.vx = -Math.abs(SB.vx) * CFG.bounceDecay;
      bounced = true;
    }
    if (SB.y < halfSize + 66) {
      SB.y = halfSize + 66;
      SB.vy = Math.abs(SB.vy) * CFG.bounceDecay;
      bounced = true;
    } else if (SB.y > H - halfSize) {
      SB.y = H - halfSize;
      SB.vy = -Math.abs(SB.vy) * CFG.bounceDecay;
      bounced = true;
    }

    if (bounced) {
      SB.bounceSquash = Math.max(SB.bounceSquash, 0.2);
      SB.angVel += (SB.vx > 0 ? 1 : -1) * 4;
      spawnSparkles(SB.x, SB.y, 3);
      spawnStars(SB.x, SB.y, 2);
      playSound('bounce');
    }

    // Rotation from rolling + angular damping
    SB.angVel *= 0.96;
    SB.angVel += SB.vx * 0.04 * dt;
    SB.angle += SB.angVel * dt;

    // Squash decay
    SB.bounceSquash *= 0.85;
    if (SB.bounceSquash < 0.01) SB.bounceSquash = 0;

    const sq = SB.bounceSquash;
    SB.squash = 1 + sq * 0.45;
    SB.squashY = 1 - sq * 0.28;
  }

  function updateBallPosition() {
    // Apply position
    ball.style.left = (SB.x - CFG.ballSize / 2) + 'px';
    ball.style.top = (SB.y - CFG.ballSize / 2) + 'px';

    // Squash then rotate
    const scaleStr = `scaleX(${SB.squash.toFixed(3)}) scaleY(${SB.squashY.toFixed(3)})`;
    const rotateStr = `rotate(${SB.angle.toFixed(1)}deg)`;
    ball.style.transform = `${scaleStr} ${rotateStr}`;

    // Hurt state visual
    if (SB.hurting) {
      ball.style.animation = 'hurtPulse 0.12s ease-in-out infinite alternate, hurtSpin 0.35s ease-in-out';
    } else {
      ball.style.animation = 'none';
      ball.style.boxShadow = 'none';
    }

    // Record trail
    trailPoints.push({ x: SB.x, y: SB.y });
    if (trailPoints.length > MAX_TRAIL) trailPoints.shift();
  }

  /* ── Hurt detection ──────────────────────────────────────── */
  function checkHurt() {
    if (SB.hurting) return;
    const dx = SB.x - mouseX;
    const dy = SB.y - mouseY;
    if (Math.sqrt(dx * dx + dy * dy) < CFG.hurtRadius) {
      triggerHurt();
    }
  }

  function triggerHurt() {
    SB.hurting = true;
    SB.hurtCount++;
    clearTimeout(SB.hurtTimer);

    // Reverse direction sharply
    const angle = Math.atan2(SB.vy, SB.vx) + Math.PI + (Math.random() - 0.5) * 0.6;
    const newSpeed = Math.max(Math.sqrt(SB.vx * SB.vx + SB.vy * SB.vy), CFG.kickStrength * 0.6);
    SB.vx = Math.cos(angle) * newSpeed;
    SB.vy = Math.sin(angle) * newSpeed;
    SB.angVel += (Math.random() - 0.5) * 22 + 10;
    SB.bounceSquash = 0.5;

    // Flash overlay
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;background:radial-gradient(circle,rgba(255,68,136,0.28),transparent 65%);
      pointer-events:none;z-index:8887;animation:hurtFlash 0.2s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 200);

    // Screen shake
    const shake = document.createElement('div');
    shake.style.cssText = `
      position:fixed;inset:0;pointer-events:none;z-index:8886;
      animation:screenShake 0.28s ease-out forwards;
    `;
    document.body.appendChild(shake);
    setTimeout(() => shake.remove(), 280);

    // Big sparkle burst
    spawnSparkles(SB.x, SB.y, 12);
    spawnStars(SB.x, SB.y, 6);

    // Update face
    updateFace('hurt');
    hurt.style.display = 'block';

    // Cute bonk sound
    playSound('hurt');

    // Recover
    SB.hurtTimer = setTimeout(() => {
      SB.hurting = false;
      updateFace('happy');
      hurt.style.display = 'none';
    }, CFG.hurtRecoveryMs);
  }

  /* ── Sparkle particles ───────────────────────────────────── */
  function spawnSparkle(x, y) {
    if (sparkles.length >= MAX_SPARKLES) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    sparkles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 3 + Math.random() * 5,
      type: Math.random() < 0.6 ? 'spark' : 'star',
      hue: Math.random() < 0.7 ? 340 : 200,
    });
  }

  function spawnSparkles(x, y, count) {
    for (let i = 0; i < count; i++) spawnSparkle(x, y);
  }

  function spawnStars(x, y, count) {
    for (let i = 0; i < count; i++) {
      if (sparkles.length >= MAX_SPARKLES) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      sparkles.push({
        x: x + (Math.random() - 0.5) * CFG.ballSize,
        y: y + (Math.random() - 0.5) * CFG.ballSize,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 5 + Math.random() * 9,
        type: 'star',
        hue: 340,
      });
    }
  }

  function updateSparkles(dt) {
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.93;
      p.vy *= 0.93;
      p.life -= 0.04 * dt;
      if (p.life <= 0) sparkles.splice(i, 1);
    }
  }

  function renderTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    // Draw trail gradient path
    for (let i = 1; i < trailPoints.length; i++) {
      const p1 = trailPoints[i - 1];
      const p2 = trailPoints[i];
      const alpha = (i / trailPoints.length) * 0.38;
      const width = (i / trailPoints.length) * CFG.ballSize * 0.55;
      trailCtx.beginPath();
      trailCtx.moveTo(p1.x, p1.y);
      trailCtx.lineTo(p2.x, p2.y);
      trailCtx.strokeStyle = `rgba(255, 158, 200, ${alpha})`;
      trailCtx.lineWidth = width;
      trailCtx.lineCap = 'round';
      trailCtx.stroke();
    }

    // Draw sparkles
    sparkles.forEach(p => {
      const a = p.life;
      trailCtx.save();
      trailCtx.globalAlpha = a;
      trailCtx.fillStyle = p.type === 'star'
        ? `hsl(${p.hue}, 100%, 88%)`
        : `hsl(${p.hue}, 100%, 92%)`;
      if (p.type === 'star') {
        drawStar(trailCtx, p.x, p.y, p.size * p.life, p.size * 0.4 * p.life);
      } else {
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.size * p.life * 0.5, 0, Math.PI * 2);
        trailCtx.fill();
      }
      trailCtx.restore();
    });
  }

  function drawStar(ctx, cx, cy, outerR, innerR) {
    const pts = 4;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const ang = (i * Math.PI) / pts - Math.PI / 2;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  /* ── Audio ───────────────────────────────────────────────── */
  // Rate-limiter so the same sound doesn't spam 60×/sec
  let lastSoundTime = { kick: 0, bounce: 0, hurt: 0 };
  const SOUND_COOLDOWN = 130; // ms

  function playSound(type, intensity) {
    const now = performance.now();
    if (now - lastSoundTime[type] < SOUND_COOLDOWN) return;
    lastSoundTime[type] = now;
    tryPlaySpaceballSound(type, intensity || 1);
  }

  function tryPlaySpaceballSound(type, intensity) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ac = new AudioCtx();
      if (ac.state === 'suspended') ac.resume();

      if (type === 'hurt') {
        // ── Hurt: descending bonk + wah + bell ──────────────────
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.18);
        gain.gain.setValueAtTime(0.28, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.28);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 0.28);

        const osc2 = ac.createOscillator();
        const gain2 = ac.createGain();
        osc2.connect(gain2);
        gain2.connect(ac.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1050, ac.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(280, ac.currentTime + 0.22);
        gain2.gain.setValueAtTime(0.12, ac.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.32);
        osc2.start(ac.currentTime);
        osc2.stop(ac.currentTime + 0.32);

        const bell = ac.createOscillator();
        const bellGain = ac.createGain();
        bell.connect(bellGain);
        bellGain.connect(ac.destination);
        bell.type = 'sine';
        bell.frequency.setValueAtTime(1400, ac.currentTime + 0.04);
        bellGain.gain.setValueAtTime(0.18, ac.currentTime + 0.04);
        bellGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
        bell.start(ac.currentTime + 0.04);
        bell.stop(ac.currentTime + 0.55);

      } else if (type === 'kick') {
        // ── Kick: cute springy boing ────────────────────────────
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + 220 * intensity, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(480 + 320 * intensity, ac.currentTime + 0.055);
        osc.frequency.exponentialRampToValueAtTime(160 + 80 * intensity, ac.currentTime + 0.14);
        gain.gain.setValueAtTime(0.20 * intensity, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.16);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 0.16);

        // Soft whoosh overtone
        const noise = ac.createOscillator();
        const noiseGain = ac.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(ac.destination);
        noise.type = 'triangle';
        noise.frequency.setValueAtTime(820 + 380 * intensity, ac.currentTime);
        noise.frequency.exponentialRampToValueAtTime(380, ac.currentTime + 0.09);
        noiseGain.gain.setValueAtTime(0.09 * intensity, ac.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.11);
        noise.start(ac.currentTime);
        noise.stop(ac.currentTime + 0.11);

      } else if (type === 'bounce') {
        // ── Bounce: soft spring boing + sparkle ping ─────────────
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ac.currentTime + 0.045);
        osc.frequency.exponentialRampToValueAtTime(190, ac.currentTime + 0.13);
        gain.gain.setValueAtTime(0.15, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 0.15);

        const ping = ac.createOscillator();
        const pingGain = ac.createGain();
        ping.connect(pingGain);
        pingGain.connect(ac.destination);
        ping.type = 'sine';
        ping.frequency.setValueAtTime(1080, ac.currentTime + 0.02);
        pingGain.gain.setValueAtTime(0.07, ac.currentTime + 0.02);
        pingGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
        ping.start(ac.currentTime + 0.02);
        ping.stop(ac.currentTime + 0.18);
      }
    } catch (_) { /* Audio unavailable, silent fail */ }
  }

  /* ── Boot ────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 80));
  } else {
    setTimeout(init, 80);
  }

})();
