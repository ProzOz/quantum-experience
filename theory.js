/* ============================================================
   Shared theory briefs + chalkboard figures (TH / EN)
   Labels come from I18N via t(); diagrams are language-neutral ink.
   ============================================================ */
'use strict';

function theoryBriefHTML(key) {
  const titleKey = key + '_brief_title';
  const textKey = key + '_brief';
  if (typeof I18N === 'undefined' || !I18N[titleKey] || !I18N[textKey]) return '';
  const parts = t(textKey).split(/\n\n+/);
  const paras = parts.map((p, i) =>
    `<p class="brief-text" data-i18n-para="${textKey}" data-i18n-index="${i}">${p}</p>`
  ).join('');
  return `
    <div class="pre-play-brief">
      <h3 class="brief-title" data-i18n="${titleKey}">${t(titleKey)}</h3>
      ${paras}
    </div>`;
}

function theoryParasHTML(key) {
  if (typeof I18N === 'undefined' || !I18N[key]) return '';
  return t(key).split(/\n\n+/).map((p, i) =>
    `<p class="brief-text" data-i18n-para="${key}" data-i18n-index="${i}">${p}</p>`
  ).join('');
}

function theoryFigureHTML(id) {
  const art = typeof THEORY_ART !== 'undefined' ? THEORY_ART[id] : null;
  if (!art) return '';
  const titleKey = 'td' + id + '_title';
  return `
    <figure class="theory-figure" data-theory="${id}" aria-labelledby="theoryFigTitle${id}">
      <figcaption class="theory-diagram-label" data-i18n="theory_diagram_label">${t('theory_diagram_label')}</figcaption>
      <div class="theory-art">
        <div class="theory-art-title" id="theoryFigTitle${id}" data-i18n="${titleKey}">${t(titleKey)}</div>
        <p class="theory-art-sub" data-i18n="td${id}_sub">${t('td' + id + '_sub')}</p>
        ${art()}
        <p class="theory-art-caption" data-i18n="td${id}_caption">${t('td' + id + '_caption')}</p>
      </div>
    </figure>`;
}

function theoryBlockHTML(id) {
  const meta = typeof TOPIC_META !== 'undefined' ? TOPIC_META[id] : null;
  const key = meta ? meta.key : ('t' + id);
  return theoryBriefHTML(key) + theoryFigureHTML(id);
}

function hydrateTheorySlots() {
  document.querySelectorAll('[data-theory-slot]').forEach(el => {
    const id = parseInt(el.getAttribute('data-theory-slot'), 10);
    if (!id) return;
    el.innerHTML = theoryBlockHTML(id);
  });
}

function inkLabel(key, extraClass) {
  return `<span class="theory-art-tag${extraClass ? ' ' + extraClass : ''}" data-i18n="${key}">${t(key)}</span>`;
}

/* Chalk-ink SVGs — geometry only; running copy lives in I18N. */
const THEORY_ART = {
  1: () => `
    <svg class="theory-svg" viewBox="0 0 640 200" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="18" y="78" width="54" height="44" rx="4"/>
        <path d="M72 100h70"/>
        <circle cx="110" cy="100" r="3.5" fill="#B45309" stroke="none"/>
        <circle cx="128" cy="100" r="3.5" fill="#B45309" stroke="none"/>
        <path d="M200 28v144M200 28h18M200 172h18"/>
        <path d="M200 78h18M200 122h18" stroke="#EDE6D9" stroke-width="10"/>
        <path d="M218 82 A48 48 0 0 1 218 78" opacity="0"/>
        <path d="M232 70c28 8 52 22 88 30M232 130c28-8 52-22 88-30"/>
        <path d="M250 58c36 12 64 30 102 42M250 142c36-12 64-30 102-42" opacity="0.55"/>
        <rect x="548" y="22" width="16" height="156" fill="#3F2A0A" stroke="none"/>
        <rect x="550" y="30" width="12" height="10" fill="#B45309" stroke="none"/>
        <rect x="550" y="50" width="12" height="6" fill="#EDE6D9" stroke="none"/>
        <rect x="550" y="64" width="12" height="10" fill="#B45309" stroke="none"/>
        <rect x="550" y="84" width="12" height="6" fill="#EDE6D9" stroke="none"/>
        <rect x="550" y="98" width="12" height="14" fill="#B45309" stroke="none"/>
        <rect x="550" y="120" width="12" height="6" fill="#EDE6D9" stroke="none"/>
        <rect x="550" y="134" width="12" height="10" fill="#B45309" stroke="none"/>
        <rect x="550" y="154" width="12" height="6" fill="#EDE6D9" stroke="none"/>
        <text x="208" y="74" fill="#3F2A0A" stroke="none" font-size="11" font-family="IBM Plex Mono, monospace">S₁</text>
        <text x="208" y="148" fill="#3F2A0A" stroke="none" font-size="11" font-family="IBM Plex Mono, monospace">S₂</text>
      </g>
    </svg>
    <div class="theory-art-legend">
      ${inkLabel('td1_source')}
      ${inkLabel('td1_slits')}
      ${inkLabel('td1_screen')}
    </div>
    <div class="theory-art-legend theory-art-legend-sub">
      ${inkLabel('td1_bright')}
      ${inkLabel('td1_dark')}
    </div>`,

  2: () => `
    <svg class="theory-svg theory-svg-narrow" viewBox="0 0 280 240" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linecap="round">
        <ellipse cx="140" cy="120" rx="88" ry="88"/>
        <ellipse cx="140" cy="120" rx="88" ry="28" opacity="0.45"/>
        <path d="M140 32v176M52 120h176"/>
        <path d="M140 120 L198 78" stroke="#B45309" stroke-width="2.5"/>
        <circle cx="198" cy="78" r="4" fill="#B45309" stroke="none"/>
        <path d="M140 120 L140 62" stroke="#6B4A12" stroke-dasharray="4 4" opacity="0.8"/>
        <path d="M158 104 A22 22 0 0 1 172 120" stroke="#B45309"/>
        <text x="132" y="26" fill="#3F2A0A" stroke="none" font-size="13" font-family="IBM Plex Sans, Sarabun, sans-serif">|0⟩</text>
        <text x="132" y="228" fill="#3F2A0A" stroke="none" font-size="13" font-family="IBM Plex Sans, Sarabun, sans-serif">|1⟩</text>
        <text x="204" y="72" fill="#B45309" stroke="none" font-size="13" font-family="IBM Plex Sans, Sarabun, sans-serif">|ψ⟩</text>
        <text x="168" y="108" fill="#B45309" stroke="none" font-size="12" font-family="IBM Plex Sans, Sarabun, sans-serif">θ</text>
        <text x="232" y="124" fill="#6B4A12" stroke="none" font-size="12" font-family="IBM Plex Sans, Sarabun, sans-serif">φ</text>
      </g>
    </svg>
    <div class="theory-art-legend">
      ${inkLabel('td2_eq')}
    </div>`,

  3: () => `
    <div class="theory-art-split">
      <div class="theory-art-col">
        <div class="theory-art-kicker" data-i18n="td3_narrow">${t('td3_narrow')}</div>
        <svg class="theory-svg" viewBox="0 0 220 120" role="img" aria-hidden="true">
          <g fill="none" stroke="#3F2A0A" stroke-width="2">
            <path d="M16 104h188M16 16v88"/>
            <path d="M110 100 C114 20, 106 20, 110 100" stroke="#B45309" stroke-width="2.4"/>
            <path d="M28 70 Q110 96 192 70" opacity="0.85"/>
          </g>
        </svg>
      </div>
      <div class="theory-art-col">
        <div class="theory-art-kicker" data-i18n="td3_wide">${t('td3_wide')}</div>
        <svg class="theory-svg" viewBox="0 0 220 120" role="img" aria-hidden="true">
          <g fill="none" stroke="#3F2A0A" stroke-width="2">
            <path d="M16 104h188M16 16v88"/>
            <path d="M28 88 Q110 24 192 88" stroke="#B45309" stroke-width="2.4"/>
            <path d="M110 100 C114 36, 106 36, 110 100"/>
          </g>
        </svg>
      </div>
    </div>
    <p class="theory-art-eq">Δx · Δp ≥ ħ/2</p>
    <div class="theory-art-legend">
      ${inkLabel('td3_floor')}
    </div>`,

  4: () => `
    <svg class="theory-svg" viewBox="0 0 640 170" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linecap="round">
        <path d="M24 130h592M24 24v106"/>
        <path d="M40 108 C70 40, 110 40, 140 108" stroke="#B45309" stroke-width="2.4"/>
        <path d="M48 118 C78 86, 110 86, 132 118" opacity="0.45"/>
        <rect x="268" y="38" width="104" height="92" fill="#E8DCC8" stroke="#3F2A0A"/>
        <text x="300" y="88" fill="#6B4A12" stroke="none" font-size="14" font-family="IBM Plex Sans, Sarabun, sans-serif">V₀</text>
        <path d="M268 70h104" stroke="#B45309" stroke-dasharray="6 4"/>
        <text x="378" y="66" fill="#B45309" stroke="none" font-size="12" font-family="IBM Plex Sans, Sarabun, sans-serif">E</text>
        <path d="M500 108 C520 88, 548 88, 572 108" stroke="#B45309" stroke-width="1.6"/>
      </g>
    </svg>
    <div class="theory-art-legend">
      ${inkLabel('td4_in')}
      ${inkLabel('td4_wall')}
      ${inkLabel('td4_out')}
    </div>`,

  5: () => `
    <svg class="theory-svg" viewBox="0 0 640 160" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linecap="round">
        <circle cx="120" cy="80" r="36"/>
        <circle cx="520" cy="80" r="36"/>
        <path d="M156 80 C260 20, 380 140, 484 80" stroke="#B45309" stroke-width="2.2"/>
        <path d="M250 80h140" stroke="#6B4A12" stroke-dasharray="5 5"/>
        <text x="108" y="86" fill="#3F2A0A" stroke="none" font-size="16" font-family="IBM Plex Sans, Sarabun, sans-serif">A</text>
        <text x="508" y="86" fill="#3F2A0A" stroke="none" font-size="16" font-family="IBM Plex Sans, Sarabun, sans-serif">B</text>
        <text x="308" y="72" fill="#6B4A12" stroke="none" font-size="12" font-family="IBM Plex Sans, Sarabun, sans-serif">d</text>
      </g>
    </svg>
    <div class="theory-art-legend">
      ${inkLabel('td5_a')}
      ${inkLabel('td5_b')}
      ${inkLabel('td5_link')}
    </div>`,

  6: () => `
    <svg class="theory-svg theory-svg-narrow" viewBox="0 0 280 200" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linejoin="round">
        <rect x="70" y="28" width="140" height="144" rx="4"/>
        <path d="M70 28h140l12-12H82z" fill="#E8DCC8"/>
        <text x="124" y="108" fill="#B45309" stroke="none" font-size="28" font-family="IBM Plex Serif, Georgia, serif">ψ</text>
        <path d="M88 148c16-18 28-18 44 0s28 18 44 0 28-18 40 0" opacity="0.7"/>
      </g>
    </svg>
    <div class="theory-art-legend">
      ${inkLabel('td6_alive')}
      ${inkLabel('td6_until')}
      ${inkLabel('td6_dead')}
    </div>`,

  7: () => `
    <svg class="theory-svg" viewBox="0 0 640 150" role="img" aria-hidden="true">
      <g fill="none" stroke="#3F2A0A" stroke-width="2" stroke-linejoin="round">
        <path d="M24 40h88M24 75h88M24 110h88"/>
        <rect x="112" y="24" width="44" height="32" fill="#E8DCC8"/>
        <rect x="112" y="59" width="44" height="32" fill="#E8DCC8"/>
        <rect x="112" y="94" width="44" height="32" fill="#E8DCC8"/>
        <text x="126" y="46" fill="#3F2A0A" stroke="none" font-size="16" font-family="IBM Plex Sans, Sarabun, sans-serif">H</text>
        <text x="126" y="81" fill="#3F2A0A" stroke="none" font-size="16" font-family="IBM Plex Sans, Sarabun, sans-serif">H</text>
        <text x="126" y="116" fill="#3F2A0A" stroke="none" font-size="16" font-family="IBM Plex Sans, Sarabun, sans-serif">H</text>
        <path d="M156 40h48M156 75h48M156 110h48"/>
        <rect x="204" y="28" width="120" height="94" fill="#E8DCC8"/>
        <text x="228" y="80" fill="#3F2A0A" stroke="none" font-size="14" font-family="IBM Plex Sans, Sarabun, sans-serif">Oracle</text>
        <path d="M324 40h40M324 75h40M324 110h40"/>
        <rect x="364" y="28" width="120" height="94" fill="#E8DCC8"/>
        <text x="386" y="80" fill="#3F2A0A" stroke="none" font-size="14" font-family="IBM Plex Sans, Sarabun, sans-serif">Diffuse</text>
        <path d="M484 40h40M484 75h40M484 110h40"/>
        <rect x="524" y="32" width="10" height="16" fill="#3F2A0A" stroke="none"/>
        <path d="M529 48v16M522 64h14"/>
        <rect x="524" y="67" width="10" height="16" fill="#3F2A0A" stroke="none"/>
        <path d="M529 83v16M522 99h14"/>
        <rect x="524" y="102" width="10" height="16" fill="#3F2A0A" stroke="none"/>
        <path d="M529 118v10M522 128h14"/>
      </g>
    </svg>
    <div class="theory-art-bars" aria-hidden="true">
      <span style="height:22%"></span>
      <span style="height:18%"></span>
      <span class="is-target" style="height:88%"></span>
      <span style="height:16%"></span>
      <span style="height:20%"></span>
      <span style="height:14%"></span>
      <span style="height:18%"></span>
      <span style="height:12%"></span>
    </div>
    <div class="theory-art-legend">
      ${inkLabel('td7_h')}
      ${inkLabel('td7_mark')}
      ${inkLabel('td7_amp')}
    </div>`
};
