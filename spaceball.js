'use strict';
/* ============================================================
   spaceball.js — Ultra clean, owner's image only
   No overlays, no canvas, no pink — just the image bouncing
   ============================================================ */

(function () {
  const CFG = {
    bounceDecay: 0.82,
    friction: 0.998,
    kickStrength: 15,
    idleSpeed: 1.2,
    kickRadius: 120,
    ballSize: 90,
  };

  const SB = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    angle: 0,
    angVel: 0,
    squash: 1,
    squashY: 1,
    bounceSquash: 0,
    visible: false,
    idleTimer: 0,
  };

  let ball, container;

  function init() {
    container = document.getElementById('ownerSpaceball');
    ball = document.getElementById('spaceballBall');

    if (!container || !ball) return;

    container.style.cssText = `
      position:fixed;inset:0;pointer-events:none;
      z-index:8888;overflow:hidden;display:none;
    `;

    ball.style.cssText = `
      position:absolute;
      width:${CFG.ballSize}px;height:${CFG.ballSize}px;
      border-radius:16px;
      background:transparent;
      will-change:transform,left,top;
      overflow:hidden;
    `;

    const imgWrap = document.getElementById('spaceballImgWrap');
    if (imgWrap) {
      imgWrap.style.cssText = `
        position:absolute;inset:0;
        border-radius:14px;
        overflow:hidden;
      `;
      const img = document.getElementById('spaceballImg');
      if (img) {
        img.style.cssText = `
          width:100%;height:100%;object-fit:cover;
          display:block;pointer-events:none;user-select:none;
          border-radius:14px;
        `;
      }
    }

    resetPosition();
    setTimeout(firstKick, 500);
    requestAnimationFrame(loop);
    SB.visible = true;
    container.style.display = 'block';
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

  let mouseX = -9999, mouseY = -9999;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  let lastTime = 0;

  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 16.67, 3);
    lastTime = timestamp;

    if (SB.visible) {
      updatePhysics(dt);
      updateBallPosition();
    }

    requestAnimationFrame(loop);
  }

  function updatePhysics(dt) {
    const halfSize = CFG.ballSize / 2;
    const W = window.innerWidth;
    const H = window.innerHeight;

    SB.vx *= Math.pow(CFG.friction, dt);
    SB.vy *= Math.pow(CFG.friction, dt);

    SB.idleTimer += dt;
    if (SB.idleTimer > 30 && (Math.abs(SB.vx) < 0.5 || Math.abs(SB.vy) < 0.5)) {
      const angle = Math.random() * Math.PI * 2;
      SB.vx += Math.cos(angle) * CFG.idleSpeed * 0.3;
      SB.vy += Math.sin(angle) * CFG.idleSpeed * 0.3;
      SB.idleTimer = 0;
    }

    const dx = SB.x - mouseX;
    const dy = SB.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CFG.kickRadius && dist > 0) {
      const force = (CFG.kickRadius - dist) / CFG.kickRadius;
      const nx = dx / dist;
      const ny = dy / dist;
      SB.vx += nx * force * CFG.kickStrength * 0.12 * dt;
      SB.vy += ny * force * CFG.kickStrength * 0.12 * dt;
      SB.angVel += (Math.random() - 0.5) * force * 6;
    }

    SB.x += SB.vx * dt;
    SB.y += SB.vy * dt;

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
    if (SB.y < halfSize + 60) {
      SB.y = halfSize + 60;
      SB.vy = Math.abs(SB.vy) * CFG.bounceDecay;
      bounced = true;
    } else if (SB.y > H - halfSize) {
      SB.y = H - halfSize;
      SB.vy = -Math.abs(SB.vy) * CFG.bounceDecay;
      bounced = true;
    }

    if (bounced) {
      SB.bounceSquash = Math.max(SB.bounceSquash, 0.15);
      SB.angVel += (SB.vx > 0 ? 1 : -1) * 3;
    }

    SB.angVel *= 0.97;
    SB.angVel += SB.vx * 0.03 * dt;
    SB.angle += SB.angVel * dt;

    SB.bounceSquash *= 0.86;
    if (SB.bounceSquash < 0.01) SB.bounceSquash = 0;

    const sq = SB.bounceSquash;
    SB.squash = 1 + sq * 0.4;
    SB.squashY = 1 - sq * 0.25;
  }

  function updateBallPosition() {
    ball.style.left = (SB.x - CFG.ballSize / 2) + 'px';
    ball.style.top = (SB.y - CFG.ballSize / 2) + 'px';
    const scaleStr = `scaleX(${SB.squash.toFixed(3)}) scaleY(${SB.squashY.toFixed(3)})`;
    const rotateStr = `rotate(${SB.angle.toFixed(1)}deg)`;
    ball.style.transform = `${scaleStr} ${rotateStr}`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 80));
  } else {
    setTimeout(init, 80);
  }
})();
