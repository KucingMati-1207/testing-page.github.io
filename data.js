// ─────────────────────────────
// GEOFIELD DATA PAGE
// ─────────────────────────────

// ─────────────────────────────
// THEME CHECK
// ─────────────────────────────

const isLightTheme =
  () =>
    document.documentElement.getAttribute(
      'data-theme'
    ) === 'light';

// ─────────────────────────────
// MAP COLORS
// ─────────────────────────────

function getBaseFillColor() {

  return isLightTheme()

    ? 'rgba(25,25,25,0.52)'

    : 'rgba(210,210,210,0.14)';

}

function getHoverFillColor() {

  return isLightTheme()

    ? 'rgba(8,8,8,0.72)'

    : 'rgba(235,235,235,0.34)';

}

// ─────────────────────────────
// CREATE MAP
// ─────────────────────────────

const dataMap = new maplibregl.Map({

  container: 'data-map',

  style:
    isLightTheme()
      ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',

  // shifted LEFT
  // so district appears MORE RIGHT
  center: [118.84, -3.32],

  zoom: 9.35,

  pitch: 42,

  bearing: -14,

  attributionControl: false,

  interactive: true,

  dragPan: false,
  scrollZoom: false,
  boxZoom: false,
  dragRotate: false,
  keyboard: false,
  doubleClickZoom: false,
  touchZoomRotate: false

});

// ─────────────────────────────
// GLOBE
// ─────────────────────────────

dataMap.on('style.load', () => {

  dataMap.setProjection({
    type: 'globe'
  });

});

// ─────────────────────────────
// LOAD DISTRICT LAYER
// ─────────────────────────────

async function loadPolmanLayer() {

  if (
    dataMap.getLayer('polman-fill')
  ) {

    dataMap.removeLayer(
      'polman-fill'
    );

  }

  if (
    dataMap.getSource('polman')
  ) {

    dataMap.removeSource(
      'polman'
    );

  }

  const response =
    await fetch(
      'assets/data/id7602_polewali_mandar.geojson'
    );

  const geojson =
    await response.json();

  dataMap.addSource(
    'polman',
    {
      type: 'geojson',
      data: geojson
    }
  );

  dataMap.addLayer({

    id: 'polman-fill',

    type: 'fill',

    source: 'polman',

    paint: {

      'fill-antialias': false,

      'fill-color':
        getBaseFillColor(),

      'fill-opacity': 1

    }

  });

  // ─────────────────────────────
  // ENTIRE REGION HOVER
  // ─────────────────────────────

  let regionHovered = false;

  dataMap.on(
    'mousemove',
    'polman-fill',
    () => {

      if (regionHovered)
        return;

      regionHovered = true;

      dataMap.setPaintProperty(
        'polman-fill',
        'fill-color',
        getHoverFillColor()
      );

    }
  );

  dataMap.on(
    'mouseleave',
    'polman-fill',
    () => {

      regionHovered = false;

      dataMap.setPaintProperty(
        'polman-fill',
        'fill-color',
        getBaseFillColor()
      );

    }
  );

}

// ─────────────────────────────
// INITIAL LOAD
// ─────────────────────────────

dataMap.on('load', async () => {

  await loadPolmanLayer();

  // ─────────────────────────────
  // CINEMATIC CAMERA LOOP
  // MORE NOTICEABLE MOVEMENT
  // ─────────────────────────────

  function cinematicMapLoop() {

    const time =
      performance.now() * 0.0003;

    dataMap.jumpTo({

      center: [

        118.84 +
        Math.sin(time * 0.45) * 0.018,

        -3.32 +
        Math.cos(time * 0.35) * 0.008

      ],

      bearing:
        -14 + Math.sin(time) * 4.2,

      pitch:
        42 + Math.cos(time * 0.7) * 1.8

    });

    requestAnimationFrame(
      cinematicMapLoop
    );

  }

  cinematicMapLoop();

});

// ─────────────────────────────
// THEME SWITCHING
// ─────────────────────────────

const observer =
  new MutationObserver((mutations) => {

    mutations.forEach(async (mutation) => {

      if (
        mutation.attributeName ===
        'data-theme'
      ) {

        const newStyle =
          isLightTheme()
            ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
            : 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

        dataMap.setStyle(newStyle);

        dataMap.once(
          'style.load',
          async () => {

            dataMap.setProjection({
              type: 'globe'
            });

            await loadPolmanLayer();

          }
        );

      }

    });

  });

observer.observe(
  document.documentElement,
  {
    attributes: true,
    attributeFilter: ['data-theme']
  }
);

// ─────────────────────────────
// REVEAL ON SCROLL
// ─────────────────────────────

const revealEls =
  document.querySelectorAll(
    '.reveal'
  );

const revealObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (
          entry.isIntersecting
        ) {

          entry.target.classList.add(
            'visible'
          );

        }

      });

    },

    {
      threshold: 0.2
    }

  );

revealEls.forEach(el => {
  revealObserver.observe(el);
});

// ─────────────────────────────
// COUNT-UP ANIMATION
// ─────────────────────────────

const numberEls =
  document.querySelectorAll(
    '.info-number'
  );

const countObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(entry => {

        if (
          !entry.isIntersecting
        ) return;

        const el =
          entry.target;

        const target =
          parseInt(
            el.dataset.target
          );

        let current = 0;

        const duration = 1800;

        const increment =
          target /
          (duration / 16);

        const counter =
          setInterval(() => {

            current += increment;

            if (
              current >= target
            ) {

              current = target;

              clearInterval(
                counter
              );

            }

            el.textContent =
              Math.floor(current);

          }, 16);

        countObserver.unobserve(
          el
        );

      });

    },

    {
      threshold: 0.5
    }

  );

numberEls.forEach(el => {
  countObserver.observe(el);
});
// ─────────────────────────────
// DISTRICT MAP
// ─────────────────────────────

const districtMap =
  new maplibregl.Map({

    container:
      'district-map',

    style:
      isLightTheme()
        ? 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'
        : 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',

    center:
      [119.22, -3.31],

    zoom: 9.5,

    minZoom: 9.5,
    maxZoom: 9.5,

    pitch: 48,

    bearing: -18,

    attributionControl: false,

    interactive: false,

    dragPan: false,
    scrollZoom: false,
    boxZoom: false,
    dragRotate: false,
    keyboard: false,
    doubleClickZoom: false,
    touchZoomRotate: false

  });

// globe
districtMap.on(
  'style.load',
  () => {

    districtMap.setProjection({
      type: 'globe'
    });

  }
);

// mouse cinematic tilt
const districtMapContainer =
  document.getElementById(
    'district-map'
  );

districtMapContainer.addEventListener(
  'mousemove',
  (e) => {

    const rect =
      districtMapContainer.getBoundingClientRect();

    const x =
      (e.clientX - rect.left) /
      rect.width;

    const y =
      (e.clientY - rect.top) /
      rect.height;

    districtMap.easeTo({

      bearing:
        -18 + (x - 0.5) * 16,

      pitch:
        48 + (0.5 - y) * 10,

      duration: 400

    });

  }
);

// reset
districtMapContainer.addEventListener(
  'mouseleave',
  () => {

    districtMap.easeTo({

      bearing: -18,
      pitch: 48,

      duration: 700

    });

  }
);
// ─────────────────────────────
// DISTRICT GEOJSON FILES
// ─────────────────────────────

const districtFiles = [

  'assets/data/id7602010_tinambung.geojson',
  'assets/data/id7602011_balanipa.geojson',
  'assets/data/id7602012_limboro.geojson',
  'assets/data/id7602020_tubbi_taramanu.geojson',
  'assets/data/id7602021_alu.geojson',
  'assets/data/id7602030_campalagian.geojson',
  'assets/data/id7602031_luyo.geojson',
  'assets/data/id7602040_wonomulyo.geojson',
  'assets/data/id7602041_mapilli.geojson',
  'assets/data/id7602042_tapango.geojson',
  'assets/data/id7602043_matakali.geojson',
  'assets/data/id7602044_bulo.geojson',
  'assets/data/id7602050_polewali.geojson',
  'assets/data/id7602051_binuang.geojson',
  'assets/data/id7602052_anreapi.geojson',
  'assets/data/id7602061_matangnga.geojson'

];

// load all districts
districtMap.on(
  'load',
  async () => {

    for (
      let i = 0;
      i < districtFiles.length;
      i++
    ) {

      const sourceId =
        `district-${i}`;

      districtMap.addSource(
        sourceId,
        {
          type: 'geojson',
          data: districtFiles[i]
        }
      );

      districtMap.addLayer({

        id: `${sourceId}-fill`,

        type: 'fill',

        source: sourceId,

        paint: {

          'fill-antialias': false,

          'fill-color':
            isLightTheme()
              ? 'rgba(20,20,20,0.28)'
              : 'rgba(220,220,220,0.12)',

          'fill-opacity': 1

        }

      });

      // hover
      districtMap.on(
        'mousemove',
        `${sourceId}-fill`,
        () => {

          districtMap.setPaintProperty(
            `${sourceId}-fill`,
            'fill-color',

            isLightTheme()
              ? 'rgba(10,10,10,0.62)'
              : 'rgba(255,255,255,0.34)'
          );

        }
      );

      districtMap.on(
        'mouseleave',
        `${sourceId}-fill`,
        () => {

          districtMap.setPaintProperty(
            `${sourceId}-fill`,
            'fill-color',

            isLightTheme()
              ? 'rgba(20,20,20,0.28)'
              : 'rgba(220,220,220,0.12)'
          );

        }
      );

    }

  }
);