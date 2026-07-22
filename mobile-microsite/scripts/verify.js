#!/usr/bin/env node
/*
 * verify.js — the visual-verification harness (mechanical lane, no model).
 *
 *   node verify.js shot   <url> <out.png> [width] [height]     # screenshot at ?jump position
 *   node verify.js mshot  <url> <out.png>                      # same, phone viewport (390x844, touch, DPR2)
 *   node verify.js jank   <url> [--mobile]                     # scroll-through jank test (p95/max)
 *   node verify.js teaser <url> <out.mp4> [seconds]            # record a 9:16 scroll-through promo clip
 *
 * Uses puppeteer-core + your system Chrome (host preview panes throttle hidden tabs, freezing
 * rAF and returning stale screenshots — this path is immune). The page under test must
 * implement the dev contract described in references/engine.md: ?jump=<scrollY> lands
 * pre-scrolled+settled, and window.__ready === true fires once the page is truly ready.
 * If __ready never fires, this harness FAILS — a screenshot of an unready page is not proof.
 *
 * The mobile modes are the primary ones: films are vertical-native, so verify at the phone
 * viewport FIRST and treat desktop shots as the adaptation check.
 *
 * Setup once:  npm i puppeteer-core   (and have Google Chrome installed)
 * Chrome path is auto-detected for macOS/Linux/Windows; override with CHROME_PATH=/path.
 * If Chrome refuses to launch sandboxed (some Linux/CI), set NO_SANDBOX=1.
 */
const puppeteer = require('puppeteer-core');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const p = process.platform;
  if (p === 'darwin') return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (p === 'win32') return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  return '/usr/bin/google-chrome';
}

async function withBrowser(fn) {
  const args = ['--hide-scrollbars'];
  if (process.env.NO_SANDBOX) args.push('--no-sandbox');
  const b = await puppeteer.launch({ executablePath: chromePath(), headless: 'new', args });
  try { return await fn(b); }
  finally { await b.close().catch(() => {}); }
}

async function ready(page) {
  await page.waitForFunction('window.__ready === true', { timeout: 60000 })
    .catch(() => { throw new Error('window.__ready never fired — page not ready, refusing to capture (implement the dev contract)'); });
}

async function openPage(b, url, viewport) {
  const page = await b.newPage();
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
  await ready(page);
  return page;
}

async function shot(url, out, viewport) {
  await withBrowser(async b => {
    const page = await openPage(b, url, viewport);
    await new Promise(r => setTimeout(r, 1200)); // let lerps/entrances settle
    await page.screenshot({ path: out });
    console.log('captured', out, `(${viewport.width}x${viewport.height}${viewport.isMobile ? ' mobile' : ''})`);
  });
}

async function jank(url, mobile) {
  await withBrowser(async b => {
    const viewport = mobile ? PHONE : { width: 1440, height: 900, deviceScaleFactor: 1 };
    const page = await openPage(b, url, viewport);
    if (mobile) { // approximate mid-range hardware, not an M-series Mac
      const client = await page.createCDPSession();
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }
    const stats = await page.evaluate(() => new Promise(res => {
      const end = Math.max(0, (document.scrollingElement || document.documentElement).scrollHeight - innerHeight);
      const deltas = []; let last = performance.now(), y = 0;
      const tick = () => {
        const now = performance.now(); deltas.push(now - last); last = now;
        y += 13; window.scrollTo(0, Math.min(y, end));
        if (y < end) requestAnimationFrame(tick);
        else {
          deltas.sort((a, b) => a - b);
          const p = q => deltas[Math.floor(deltas.length * q)];
          res({
            frames: deltas.length, scrolled: end,
            avg: +(deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(1),
            p95: +p(0.95).toFixed(1), max: +deltas[deltas.length - 1].toFixed(1),
            over50: deltas.filter(d => d > 50).length,
          });
        }
      };
      requestAnimationFrame(tick);
    }));
    console.log(JSON.stringify(stats));
    /* Judge SUSTAINED smoothness: p95 + spike count. A single isolated spike is a
     * one-off compositor/layer promotion, not scroll jank the eye can see. */
    const p95Limit = mobile ? 40 : 30, spikeLimit = mobile ? 3 : 2;
    const ok = stats.p95 < p95Limit && stats.over50 <= spikeLimit;
    console.log(ok ? `PASS (p95 ${stats.p95} < ${p95Limit}ms, ${stats.over50} spikes${mobile ? ', 4x throttled' : ''})`
                   : 'JANK — sustained: investigate the bitmap window / DPR / frame weight / texture uploads');
    if (!ok) process.exitCode = 2;
  });
}

/* Record a phone-viewport scroll-through as a 9:16 MP4 — every build ships its own
 * Reels-ready promo clip. Eased scroll (slow-fast-slow) over `seconds`, ~30fps. */
async function teaser(url, out, seconds = 18, endFrac = 1) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'teaser-'));
  await withBrowser(async b => {
    const page = await openPage(b, url, PHONE);
    await new Promise(r => setTimeout(r, 1500));
    let end = await page.evaluate(() =>
      Math.max(0, (document.scrollingElement || document.documentElement).scrollHeight - innerHeight));
    end = Math.round(end * Math.min(Math.max(endFrac, 0.05), 1)); // end on the money shot, not the footer
    const fps = 30, total = Math.round(seconds * fps);
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
    for (let i = 0; i < total; i++) {
      const y = Math.round(ease(i / (total - 1)) * end);
      await page.evaluate(v => window.scrollTo(0, v), y);
      await new Promise(r => setTimeout(r, 34)); // let the lerp + film catch up
      await page.screenshot({ path: path.join(tmp, `t_${String(i).padStart(4, '0')}.png`) });
      if (i % fps === 0) console.log(`teaser: ${i}/${total} frames`);
    }
  });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '30',
    '-i', path.join(tmp, 't_%04d.png'),
    '-vf', 'scale=780:1688:force_original_aspect_ratio=increase,crop=780:1688',
    '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('teaser saved:', out);
}

const argv = process.argv.slice(2);
const mode = argv[0];
(async () => {
  if (mode === 'shot') await shot(argv[1], argv[2], { width: +argv[3] || 1440, height: +argv[4] || 900, deviceScaleFactor: 1 });
  else if (mode === 'mshot') await shot(argv[1], argv[2], PHONE);
  else if (mode === 'jank') await jank(argv[1], argv.includes('--mobile'));
  else if (mode === 'teaser') await teaser(argv[1], argv[2], +argv[3] || 18, +argv[4] || 1);
  else {
    console.error('usage: verify.js shot <url> <out.png> [w] [h] | mshot <url> <out.png> | jank <url> [--mobile] | teaser <url> <out.mp4> [seconds] [endFraction]');
    process.exit(1);
  }
})().catch(e => { console.error(e.message); process.exit(1); });
