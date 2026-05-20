// ─────────────────────────────────────────────
// GEOFIELD — Glitch Transition System
// transition.js
// ─────────────────────────────────────────────

// ── BUILD GLITCH DOM ──
const glitchContainer = document.createElement('div');
glitchContainer.id = 'glitch-container';

glitchContainer.innerHTML = `
  <div class="glitch-r"></div>
  <div class="glitch-g"></div>
  <div class="glitch-b"></div>
`;

// ── GENERATE RANDOM SLICE BARS ──
for (let i = 0; i < 10; i++) {
  const slice = document.createElement('div');

  slice.classList.add('glitch-slice');

  const top = Math.random() * 90;
  const height = Math.random() * 6 + 1;
  const delay = Math.random() * 0.3;

  slice.style.cssText = `
    top: ${top}%;
    height: ${height}px;
    animation-delay: ${delay}s;
  `;

  glitchContainer.appendChild(slice);
}

document.body.appendChild(glitchContainer);

// ── GET WORLD ELEMENT ──
// renamed to avoid collision with main_script.js
const glitchWorld = document.getElementById('world');

// ── GLITCH TRANSITION FUNCTION ──
function glitchTransition(href) {

  const r = glitchContainer.querySelector('.glitch-r');
  const g = glitchContainer.querySelector('.glitch-g');
  const b = glitchContainer.querySelector('.glitch-b');

  const slices = glitchContainer.querySelectorAll('.glitch-slice');

  // reset animation classes
  [r, g, b].forEach(el => {
    el.classList.remove('rgb-flicker');
  });

  slices.forEach(el => {
    el.classList.remove('slice-flicker');
  });

  glitchWorld.classList.remove('glitch-out', 'glitch-in');

  // force browser reflow
  void glitchWorld.offsetWidth;

  // trigger world glitch
  glitchWorld.classList.add('glitch-out');

  // trigger rgb + slice effects
  requestAnimationFrame(() => {

    [r, g, b].forEach(el => {
      el.classList.add('rgb-flicker');
    });

    slices.forEach(el => {
      el.classList.add('slice-flicker');
    });

  });

  // navigate after animation
setTimeout(() => {
  window.location.href = href;
}, 120);
}

// ── PAGE LOAD GLITCH-IN ──
window.addEventListener('DOMContentLoaded', () => {

  const r = glitchContainer.querySelector('.glitch-r');
  const g = glitchContainer.querySelector('.glitch-g');
  const b = glitchContainer.querySelector('.glitch-b');

  const slices = glitchContainer.querySelectorAll('.glitch-slice');

  // force reflow
  void glitchWorld.offsetWidth;

  // start intro animation
  glitchWorld.classList.add('glitch-in');

  [r, g, b].forEach(el => {
    el.classList.add('rgb-flicker');
  });

  slices.forEach(el => {
    el.classList.add('slice-flicker');
  });

  // cleanup after animation
  glitchWorld.addEventListener('animationend', (e) => {

    // only react to main animation
    if (e.animationName !== 'glitchIn') return;

    glitchWorld.classList.remove('glitch-in');

    [r, g, b].forEach(el => {
      el.classList.remove('rgb-flicker');
    });

    slices.forEach(el => {
      el.classList.remove('slice-flicker');
    });

  }, { once: true });

});

// ── INTERCEPT NAVIGATION ──
document.querySelectorAll('.nav-links a').forEach(link => {

  link.addEventListener('click', (e) => {

    const href = link.getAttribute('href');

    // ignore invalid/same-page links
    if (
      !href ||
      href === '#' ||
      href === window.location.pathname.split('/').pop()
    ) {
      return;
    }

    e.preventDefault();

    glitchTransition(href);

  });

});