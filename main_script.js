const world  = document.getElementById('world');
const navbar = document.getElementById('navbar');
const coords = document.getElementById('coords');
const bgGrid = document.querySelector('.bg-grid');

const MAX_TILT    = 5;
const PERSPECTIVE = 400;

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

// ─────────────────────────────
// GEOFIELD Tactical Cursor
// ─────────────────────────────

const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let ringX  = mouseX;
let ringY  = mouseY;

// skip world tilt on map page — body.map-page is set from the start in HTML
// also skip on data page
const isMapPage = document.body.classList.contains('map-page');
const isDataPage = document.body.classList.contains('data-page');

function lerp(a, b, t) { return a + (b - a) * t; }

// ─────────────────────────────
// SINGLE UNIFIED RAF LOOP
// (was: animate() + animateCursor() — two separate loops)
// ─────────────────────────────

function tick() {

  currentX = lerp(currentX, targetX, 0.06);
  currentY = lerp(currentY, targetY, 0.06);

  // ── WORLD + GRID TILT — skip on map page and data page (map canvas must not warp) ──
  if (!isMapPage && !isDataPage) {
    world.style.transform =
      `perspective(${PERSPECTIVE}px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    bgGrid.style.transform =
      `perspective(${PERSPECTIVE}px) rotateX(${currentX * -0.3}deg) rotateY(${currentY * -0.3}deg)`;
  }

  // ── NAVBAR TILT — always active on every page ──
  navbar.style.transform =
    `perspective(1200px) rotateX(${currentX * 0.5}deg) rotateY(${currentY * 0.5}deg) translateZ(60px)`;

  // ── CURSOR RING SMOOTH FOLLOW ──
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top  = `${ringY}px`;

  requestAnimationFrame(tick);
}

tick();

// ─────────────────────────────
// SINGLE MOUSEMOVE HANDLER
// (was: two separate document.addEventListener('mousemove') calls)
// ─────────────────────────────

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  const nx = (e.clientX - cx) / cx;
  const ny = (e.clientY - cy) / cy;

  // tilt targets
  targetY =  nx * MAX_TILT;
  targetX = -ny * MAX_TILT;

  // coords HUD
  if (coords) {
    const lat = (ny * -5).toFixed(4);
    const lng = (nx *  5).toFixed(4);
    coords.textContent = `LAT ${lat} — LNG ${lng}`;
  }

  // cursor dot (exact follow)
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top  = `${mouseY}px`;
});

// ─────────────────────────────
// SINGLE MOUSELEAVE HANDLER
// (was: two separate document.addEventListener('mouseleave') calls)
// ─────────────────────────────

document.addEventListener('mouseleave', () => {
  // reset tilt
  targetX = 0;
  targetY = 0;
  if (coords) coords.textContent = 'LAT 0.0000 — LNG 0.0000';

  // hide cursor
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});

// ── CLICK EFFECT ──
document.addEventListener('mousedown', () => {
  cursorRing.classList.remove('click');
  void cursorRing.offsetWidth;
  cursorRing.classList.add('click');
});

// ── CURSOR ACTIVE STATE ON INTERACTIVE ELEMENTS ──
document.querySelectorAll('.tilt-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
});

// ─────────────────────────────
// FIX #2: VANILLA TILT GUARD
// (was: init called on every page even with no .tilt-card elements)
// ─────────────────────────────

if (document.querySelector('.tilt-card')) {
  VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
    max:         18,
    speed:       300,
    glare:       true,
    'max-glare': 0.2,
    perspective: 600,
  });
}

// ─────────────────────────────
// THEME
// ─────────────────────────────

const saved = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ─────────────────────────────
// LANGUAGE SYSTEM
// ─────────────────────────────

window.addEventListener(
  'DOMContentLoaded',
  () => {

    const languageToggle =
      document.getElementById(
        'language-toggle'
      );

    const langModal =
      document.getElementById(
        'lang-modal'
      );

    const langTitle =
      document.getElementById(
        'lang-title'
      );

    const langOptions =
      document.querySelectorAll(
        '.lang-option'
      );

    const langConfirm =
      document.getElementById(
        'lang-confirm'
      );

    let currentLanguage =
      localStorage.getItem(
        'geofield-language'
      ) || 'lokal';

    let selectedLanguage =
      currentLanguage;

    // ─────────────────────────────
    // UPDATE UI
    // ─────────────────────────────

    function updateLanguageUI() {

      if (!languageToggle) return;

      languageToggle.textContent =
        currentLanguage === 'lokal'
          ? 'LOK'
          : 'ENG';

    }

    function updateLanguageTitle() {

      if (!langTitle) return;

      langTitle.textContent =
        selectedLanguage === 'lokal'
          ? 'Mauki pakai bahasa apa?'
          : 'What language do you prefer?';

    }

    function updateConfirmButton() {

      if (!langConfirm) return;

      langConfirm.textContent =
        selectedLanguage === 'lokal'
          ? 'Okemi'
          : 'Confirm';

    }

    function updateActiveOption() {

      langOptions.forEach(option => {

        option.classList.toggle(
          'active',
          option.dataset.lang ===
          selectedLanguage
        );

      });

    }

    // ─────────────────────────────
    // CLEAN GLITCH SYSTEM
    // IMPORTANT FIX:
    // REMOVE CLASS AFTER ANIMATION
    // ─────────────────────────────

    function applyGlitch(el) {

      if (!el) return;

      el.classList.remove(
        'lang-glitch'
      );

      void el.offsetWidth;

      el.classList.add(
        'lang-glitch'
      );

      el.addEventListener(
        'animationend',
        () => {

          el.classList.remove(
            'lang-glitch'
          );

        },
        { once: true }
      );

    }

    function triggerLanguageGlitch() {

      applyGlitch(langTitle);

      applyGlitch(langConfirm);

      langOptions.forEach(option => {
        applyGlitch(option);
      });

    }

    // ─────────────────────────────
    // INITIALIZE
    // ─────────────────────────────

    updateLanguageUI();
    updateLanguageTitle();
    updateConfirmButton();
    updateActiveOption();

    // ─────────────────────────────
    // OPEN MODAL
    // ─────────────────────────────

    languageToggle?.addEventListener(
      'click',
      () => {

        selectedLanguage =
          currentLanguage;

        updateLanguageTitle();
        updateConfirmButton();
        updateActiveOption();

        langModal.classList.add(
          'active'
        );

      }
    );

    // ─────────────────────────────
    // CLOSE MODAL
    // ─────────────────────────────

    langModal?.addEventListener(
      'click',
      (e) => {

        if (e.target === langModal) {

          langModal.classList.remove(
            'active'
          );

        }

      }
    );

    // ─────────────────────────────
    // LANGUAGE SELECT
    // ─────────────────────────────

    langOptions.forEach(option => {

      option.addEventListener(
        'click',
        () => {

          const nextLang =
            option.dataset.lang;

          if (
            nextLang ===
            selectedLanguage
          ) return;

          selectedLanguage =
            nextLang;

          updateLanguageTitle();
          updateConfirmButton();
          updateActiveOption();

          triggerLanguageGlitch();

        }
      );

    });

    // ─────────────────────────────
    // CONFIRM
    // ─────────────────────────────

    langConfirm?.addEventListener(
      'click',
      () => {

        triggerLanguageGlitch();

        setTimeout(() => {

          currentLanguage =
            selectedLanguage;

          localStorage.setItem(
            'geofield-language',
            currentLanguage
          );

          updateLanguageUI();

          langModal.classList.remove(
            'active'
          );

        }, 180);

      }
    );

  }
);