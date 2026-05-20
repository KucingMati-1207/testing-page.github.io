// ─────────────────────────────
// GEOFIELD Tactical Map
// ─────────────────────────────

const TARGET = { lng: 119.344865, lat: -3.433153 };

// ─────────────────────────────
// CREATE MAP
// ─────────────────────────────

// Determine the initial map style based on the current theme
const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
const mapStyle = initialTheme === 'light' 
  ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' 
  : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const map = new maplibregl.Map({
  container: 'map',
  style:     mapStyle,
  center:    [121.0, -2.0],
  zoom:      5.4,
  pitch:     75,
  bearing:   -10,
  antialias: false
});

map.on('style.load', () => { map.setProjection({ type: 'globe' }); });

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

// ─────────────────────────────
// CINEMATIC STARTUP
// ─────────────────────────────

map.on('load', () => {
  setTimeout(() => {
    map.flyTo({
      center:    [TARGET.lng, TARGET.lat],
      zoom:      14,
      pitch:     50,
      bearing:   -12,
      speed:     0.22,
      curve:     3.2,
      essential: true
    });
  }, 1200);
});

// ─────────────────────────────
// COORDINATE HUD
// ─────────────────────────────

const mapCoords  = document.getElementById('coords');
const mapElement = document.getElementById('map');
const mapShell   = document.querySelector('.map-shell');

map.on('mousemove', (e) => {
  mapCoords.textContent =
    `LAT ${e.lngLat.lat.toFixed(5)} — LNG ${e.lngLat.lng.toFixed(5)}`;
});

mapShell.addEventListener('mouseleave', () => {
  mapCoords.textContent = 'LAT 0.00000 — LNG 0.00000';
});
// ─────────────────────────────
// MAP VIEW 3D RESPONSE — OPTIMIZED
// ─────────────────────────────

const BASE_PITCH   = 50;
const BASE_BEARING = -12;

const PITCH_MAX = 8;
const BEAR_MAX  = 6;

// smoother responsiveness
const CAMERA_LERP = 0.11;

// threshold before camera update
const CAMERA_EPSILON = 0.015;

let targetPitch   = BASE_PITCH;
let targetBearing = BASE_BEARING;

let currentPitch  = BASE_PITCH;
let currentBear   = BASE_BEARING;

let flyInDone     = false;
let flyInProgress = false;
let userDragging  = false;
let mouseOnMap    = false;
let is3DMode      = true;

// ─────────────────────────────
// STARTUP
// ─────────────────────────────

map.once('moveend', () => {
flyInDone = true;
});

// ─────────────────────────────
// USER INTERACTION TRACKING
// ─────────────────────────────

mapElement.addEventListener('mousedown', () => {
userDragging = true;
});

window.addEventListener('mouseup', () => {
userDragging = false;

currentPitch = map.getPitch();
currentBear  = map.getBearing();
});

map.on('moveend', () => {
currentPitch  = map.getPitch();
currentBear   = map.getBearing();
flyInProgress = false;
});

map.on('zoomstart', () => {
userDragging = true;
});

map.on('zoomend', () => {
userDragging = false;

currentPitch = map.getPitch();
currentBear  = map.getBearing();
});

// ─────────────────────────────
// LERP
// ─────────────────────────────

function lerpVal(a, b, t) {
return a + (b - a) * t;
}

// ─────────────────────────────
// REALTIME CAMERA LOOP
// OPTIMIZED:
// - jumpTo instead of easeTo
// - no animation stacking
// - no internal easing conflict
// - threshold updates
// ─────────────────────────────

function tick3D() {

const canAnimate =
flyInDone &&
!userDragging &&
!flyInProgress;

if (canAnimate) {


currentPitch = lerpVal(
  currentPitch,
  targetPitch,
  CAMERA_LERP
);

currentBear = lerpVal(
  currentBear,
  targetBearing,
  CAMERA_LERP
);

const pitchDelta =
  Math.abs(currentPitch - map.getPitch());

const bearDelta =
  Math.abs(currentBear - map.getBearing());

// only update if movement is meaningful
if (
  pitchDelta > CAMERA_EPSILON ||
  bearDelta  > CAMERA_EPSILON
) {

  // MUCH cheaper than easeTo for realtime motion
  map.jumpTo({
    pitch: currentPitch,
    bearing: currentBear
  });

}


}

requestAnimationFrame(tick3D);
}

tick3D();

// ─────────────────────────────
// MOUSE PARALLAX INPUT
// RAF THROTTLED
// ─────────────────────────────

let mouseRAF = null;

mapShell.addEventListener('mousemove', (e) => {

if (
!flyInDone ||
!is3DMode ||
flyInProgress
) return;

if (mouseRAF) return;

mouseRAF = requestAnimationFrame(() => {


const rect = mapShell.getBoundingClientRect();

const nx =
  ((e.clientX - rect.left) / rect.width - 0.5) * 2;

const ny =
  ((e.clientY - rect.top) / rect.height - 0.5) * 2;

targetPitch =
  BASE_PITCH + (ny * PITCH_MAX);

targetBearing =
  BASE_BEARING + (-nx * BEAR_MAX);

mouseRAF = null;


});

});

mapShell.addEventListener('mouseenter', () => {
mouseOnMap = true;
});

mapShell.addEventListener('mouseleave', () => {

mouseOnMap = false;

if (is3DMode) {


targetPitch   = BASE_PITCH;
targetBearing = BASE_BEARING;


}
});

// ─────────────────────────────
// 2D / 3D TOGGLE
// ─────────────────────────────

const viewToggle = document.getElementById('view-toggle');

function triggerInPlaceGlitch() {
  const glitchWorld = document.getElementById('world');
  const r      = document.querySelector('.glitch-r');
  const g      = document.querySelector('.glitch-g');
  const b      = document.querySelector('.glitch-b');
  const slices = document.querySelectorAll('.glitch-slice');

  glitchWorld.classList.remove('glitch-in');
  [r, g, b].forEach(el => el?.classList.remove('rgb-flicker'));
  slices.forEach(el => el?.classList.remove('slice-flicker'));

  void glitchWorld.offsetWidth;

  glitchWorld.classList.add('glitch-in');
  [r, g, b].forEach(el => el?.classList.add('rgb-flicker'));
  slices.forEach(el => el?.classList.add('slice-flicker'));
}

if (viewToggle) {
  viewToggle.addEventListener('click', () => {
    is3DMode = !is3DMode;
    triggerInPlaceGlitch();

    flyInProgress = true;

    if (is3DMode) {
      viewToggle.querySelector('span').textContent = '2D MODE';
      targetPitch   = BASE_PITCH;
      targetBearing = BASE_BEARING;
      map.easeTo({ pitch: BASE_PITCH, bearing: BASE_BEARING, duration: 800 });
    } else {
      viewToggle.querySelector('span').textContent = '3D MODE';
      targetPitch   = 0;
      targetBearing = 0;
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  });
}

// ─────────────────────────────
// MARKERS
// ─────────────────────────────

const markers = [];

function clearMarkers() {
  markers.forEach(m => m.remove());
  markers.length = 0;
}

function makeMarkerEl(loc) {
  const el = document.createElement('div');
  el.className = 'geo-marker';

  const dot = document.createElement('div');
  dot.className = 'geo-dot';
  el.appendChild(dot);

  const label = document.createElement('div');
  label.className = 'geo-label';
  label.innerHTML = `<strong>${loc.name}</strong><span>${loc.subtitle}</span>`;
  el.appendChild(label);

  return { el, label };
}

// ─────────────────────────────
// FILTER + FLY-IN TO FIT ALL MARKERS
// ─────────────────────────────

function renderCategory(category) {
  clearMarkers();
  const data = MAP_DATABASE[category] || [];
  if (!data.length) return;

  // Build bounds to encompass all markers in this category
  const bounds = new maplibregl.LngLatBounds();

  data.forEach(location => {
    const { el } = makeMarkerEl(location);

      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([location.lng, location.lat])
      .addTo(map);

    markers.push(marker);
    bounds.extend([location.lng, location.lat]);
  });

  // Fly to fit all markers — respects current 2D/3D mode
  flyInProgress = true;
  map.fitBounds(bounds, {
    padding:   { top: 120, bottom: 120, left: 180, right: 180 },
    pitch:     is3DMode ? BASE_PITCH : 0,
    bearing:   is3DMode ? BASE_BEARING : 0,
    maxZoom:   15,
    speed:     0.8,
    curve:     1.4,
    essential: true
  });
  // moveend will set flyInProgress = false and sync currentPitch/currentBear
}

// ─────────────────────────────
// FILTER BUTTONS
// ─────────────────────────────

const filters = document.querySelectorAll('.map-filter');

let mapMouseX = 0;
let mapMouseY = 0;

window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  mapMouseX = (e.clientX - cx) / cx;
  mapMouseY = (e.clientY - cy) / cy;
});

let btnCurrentX = 0;
let btnCurrentY = 0;

function lerpBtn(a, b, t) { return a + (b - a) * t; }

function tickButtons() {
  btnCurrentX = lerpBtn(btnCurrentX, mapMouseY * 5, 0.06);
  btnCurrentY = lerpBtn(btnCurrentY, mapMouseX * 5, 0.06);

  filters.forEach(btn => {
    if (!btn.matches(':hover')) {
      const active = btn.classList.contains('active');
      btn.style.transform = `
        perspective(1200px)
        rotateX(${btnCurrentX * 0.6}deg)
        rotateY(${btnCurrentY * 0.6}deg)
        translateY(${active ? '-4px' : '0px'})
        translateZ(${active ? '24px' : '0px'})
        scale(${active ? '1.04' : '1'})
      `;
    }
  });

  requestAnimationFrame(tickButtons);
}

tickButtons();

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const isAlreadyActive = btn.classList.contains('active');
    filters.forEach(b => {
      b.classList.remove('active');
      b.style.transform = '';
    });
    if (!isAlreadyActive) {
      btn.classList.add('active');
      renderCategory(btn.dataset.category);
    } else {
      clearMarkers();
    }
  });

  btn.addEventListener('mousemove', (e) => {
    const rect   = btn.getBoundingClientRect();
    const x      = e.offsetX - rect.width  / 2;
    const y      = e.offsetY - rect.height / 2;
    const active = btn.classList.contains('active');
    btn.style.transform = `
      perspective(1200px)
      rotateX(${-y / 10}deg)
      rotateY(${x  / 10}deg)
      translateY(${active ? '-4px' : '-1px'})
      translateZ(${active ? '24px' : '10px'})
      scale(${active ? '1.04' : '1'})
    `;
  });

  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

// ─────────────────────────────
// TACTICAL SEARCH SYSTEM
// ─────────────────────────────

const allLocations = [];
for (const category in MAP_DATABASE) {
  MAP_DATABASE[category].forEach(loc => {
    allLocations.push({ ...loc, category });
  });
}

const searchInput   = document.getElementById('map-search');
const searchResults = document.getElementById('search-results');

function engageLocation(loc) {
  filters.forEach(btn => btn.classList.remove('active'));
  clearMarkers();

  const { el, label } = makeMarkerEl(loc);

  // Force label visible on landing
  label.style.opacity   = '1';
  label.style.transform = 'translateX(0px)';

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
    .setLngLat([loc.lng, loc.lat])
    .addTo(map);

  markers.push(marker);

  // FIX: fly-in pitch/bearing respect current 2D/3D mode
  const landingPitch   = is3DMode ? 65        : 0;
  const landingBearing = is3DMode ? (Math.random() * 60) - 30 : 0;

  flyInProgress = true;
  map.flyTo({
    center:    [loc.lng, loc.lat],
    zoom:      16.5,
    pitch:     landingPitch,
    bearing:   landingBearing,
    speed:     1.4,
    curve:     1.2,
    essential: true
  });

  // Sync 3D targets so mouse hover orbits from correct landing angle
  targetPitch   = landingPitch;
  targetBearing = landingBearing;

  searchInput.value          = loc.name;
  searchResults.style.display = 'none';
  searchInput.blur();
}

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  searchResults.innerHTML = '';

  if (!query.length) { searchResults.style.display = 'none'; return; }

  const matches = allLocations.filter(loc =>
    loc.name.toLowerCase().includes(query) ||
    loc.subtitle.toLowerCase().includes(query)
  );

  if (matches.length) {
    searchResults.style.display = 'block';
    matches.forEach(loc => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <span class="search-item-title">${loc.name}</span>
        <span class="search-item-sub">// ${loc.category} : ${loc.subtitle}</span>
      `;
      item.addEventListener('mousedown', () => engageLocation(loc));
      searchResults.appendChild(item);
    });
  } else {
    searchResults.style.display = 'none';
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.toLowerCase().trim();
    const match = allLocations.find(loc =>
      loc.name.toLowerCase().includes(query) ||
      loc.subtitle.toLowerCase().includes(query)
    );
    if (match) engageLocation(match);
  }
});

searchInput.addEventListener('blur',  () => { searchResults.style.display = 'none'; });
searchInput.addEventListener('focus', () => {
  if (searchInput.value.length && searchResults.children.length) {
    searchResults.style.display = 'block';
  }
});

// ─────────────────────────────
// MAP THEME SYNC
// ─────────────────────────────
const mapThemeToggleBtn = document.getElementById('theme-toggle');

if (mapThemeToggleBtn) {
  mapThemeToggleBtn.addEventListener('click', () => {
    // Add a tiny delay to allow main_script.js to update the data-theme attribute first
    setTimeout(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newStyle = currentTheme === 'light' 
        ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' 
        : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
        
      map.setStyle(newStyle);
    }, 10);
  });
}