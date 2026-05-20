# GEOFIELD — Design System & Architecture

> Tactical cinematic GIS interface for cultural and geospatial exploration.

---

# Core Identity

GEOFIELD is a cinematic geospatial visualization platform built around:

* Tactical HUD aesthetics
* Cinematic GIS interaction
* Futuristic interface systems
* Smooth immersive map navigation
* Cultural and tourism exploration
* Interactive 3D geospatial presentation

The visual direction combines:

* Satellite command systems
* Sci-fi tactical interfaces
* Military HUD overlays
* Geospatial visualization dashboards
* Minimal cinematic UI composition

---

# Typography System

## Primary Display Font

Used for:

* Hero titles
* Main cinematic headings
* Tactical section titles

Current styling behavior:

```css
font-family:
  "novecento-sans-wide",
  "Rajdhani",
  sans-serif;
```

Hero title characteristics:

* Ultra-wide geometric appearance
* Aggressive uppercase styling
* High visual authority
* Cinematic spacing
* Tactical command-display feeling

### Hero Title Styling

```css
.hero-title {
  font-size: clamp(56px, 9vw, 120px);
  font-weight: 700;
  letter-spacing: -0.08em;
  text-transform: uppercase;
}
```

---

# Color System

## Dark Theme

### Base Colors

| Purpose         | Color     |
| --------------- | --------- |
| Base Background | `#0a0e1a` |
| Surface         | `#0f1628` |
| Panel           | `#111d35` |
| Primary Text    | `#e8f4f8` |
| Secondary Text  | `#7a9bb5` |
| Accent Yellow   | `#FDDB3A` |
| Tactical Grey   | `#52575D` |
| Deep Grey       | `#41444B` |
| Cream Highlight | `#F6F4E6` |

### Visual Identity

Dark theme should feel:

* Tactical
* Cinematic
* Atmospheric
* Futuristic
* Slightly militaristic
* Geospatial-command oriented

Yellow acts as:

* Signal color
* Focus indicator
* Active-state accent
* HUD highlight
* Interaction emphasis

NOT as a persistent fill color.

---

## Light Theme

### Base Colors

| Purpose         | Color     |
| --------------- | --------- |
| Base Background | `#e0e0e0` |
| Surface         | `#d4d4d4` |
| Panel           | `#DEDAD8` |
| Primary Text    | `#0a0e1a` |
| Secondary Text  | `#1d1d1d` |
| Accent Yellow   | `#FDDB3A` |
| Tactical Grey   | `#41444B` |
| Deep Grey       | `#b3b3b3` |
| Cream Highlight | `#0a0e1a` |

### Visual Identity

Light theme is NOT intended to feel:

* playful
* bright-modern SaaS
* corporate dashboard
* Google Maps style

Light theme should still preserve:

* Tactical atmosphere
* HUD-inspired visuals
* Cinematic contrast
* Engineered aesthetic

while using brighter surfaces.

---

# Cursor System

## Tactical Cursor

The native browser cursor is intentionally disabled.

Custom cursor system:

* `.cursor-dot`
* `.cursor-ring`

Features:

* Smooth lerp movement
* Hover response
* Click pulse animation
* Tactical glow effects
* Theme-aware styling

Rules:

* Native cursor should never appear
* Text cursor must remain disabled
* Pointer cursor must remain disabled
* All interactions use tactical cursor only

---

# Navigation System

## Navbar

Characteristics:

* Fixed tactical HUD bar
* Glassmorphism blur effect
* Yellow tactical border accents
* Mouse-reactive parallax tilt
* System-status visual indicators

### Navbar Motion

Controlled via:

```text
main_script.js
```

Features:

* Independent 3D tilt
* Perspective transform
* Smooth lerp interpolation

---

# Hero System

## Landing Hero

Primary identity area.

Contains:

* Hero eyebrow
* Massive title typography
* Subtitle descriptor
* Interactive tilt cards

### Motion Style

Hero should feel:

* floating
* cinematic
* holographic
* reactive

without becoming chaotic.

---

# Card System

## Tilt Cards

Framework:

```text
VanillaTilt.js
```

Characteristics:

* Glassmorphism tactical panels
* Yellow HUD line accents
* Depth illusion
* Reactive lighting
* Cinematic hover motion

Rules:

* Motion must remain subtle
* Avoid excessive rotation
* Maintain readability first

---

# Map System

## Framework

```text
MapLibre GL JS
```

## Projection

```text
Globe Projection
```

## Camera Philosophy

Map interaction should feel:

* cinematic
* immersive
* satellite-like
* responsive
* atmospheric

NOT:

* enterprise GIS
* rigid GIS software
* default web map interaction

---

# 3D Camera System

## Current Behavior

Features:

* Smooth lerp camera motion
* Mouse-reactive pitch/bearing
* Cinematic fly-in startup
* 2D / 3D toggle
* Realtime parallax response

## Performance Rule

Realtime loops must use:

```js
map.jumpTo()
```

NOT:

```js
map.easeTo()
```

inside animation-frame loops.

Reason:

* Prevent animation queue stacking
* Avoid frame pacing instability
* Reduce GPU overhead
* Preserve responsiveness

`easeTo()` should only be used for:

* cinematic transitions
* flyTo sequences
* fitBounds animation
* mode switching

---

# Marker System

## Dark Theme Markers

Characteristics:

* Tactical yellow glow
* HUD-style presence
* Cinematic visibility

## Light Theme Markers

Characteristics:

* Dark graphite body
* Yellow accent borders
* High readability
* Reduced visual noise

Reason:

Yellow in light mode should remain:

* signal
* highlight
* focus state

not persistent geometry.

---

# Marker Labels

## Label Design

Labels should remain:

* readable
* cinematic
* tactical
* layered above map cleanly

### Light Theme Rule

Use:

* dark floating panels
* subtle yellow borders
* soft tactical shadows

Avoid:

* white translucent labels
* low-contrast panels
* flat tooltip styles

---

# Weather Overlay System

## Radar Overlay

Recommended architecture:

* Raster weather overlay
* Toggleable HUD control
* Tactical precipitation display

### Intended Sources

Preferred:

```text
RainViewer
```

Reason:

* Stable API
* Realtime radar
* MapLibre compatible
* Lightweight raster tiles

---

# Animation System

## Glitch Transition

Files:

```text
transition.css
transition.js
```

Features:

* RGB split effects
* Slice distortion
* Cinematic transitions
* Tactical digital corruption aesthetic

### Design Goal

Transitions should feel:

* digital
* unstable
* holographic
* cinematic

without reducing usability.

---

# Interaction Principles

## Motion Philosophy

All motion in GEOFIELD must:

* feel intentional
* feel weighted
* remain smooth
* preserve cinematic atmosphere

Avoid:

* hyperactive motion
* arcade-style movement
* excessive bounce
* chaotic transitions

---

# Theme Philosophy

## Dark Theme

Represents:

* tactical operations
* nighttime GIS
* command-center atmosphere
* cinematic immersion

## Light Theme

Represents:

* drafting-table aesthetic
* tactical paper interface
* engineering blueprint atmosphere

NOT generic white UI.

---

# Current System Files

| File             | Purpose                      |
| ---------------- | ---------------------------- |
| `index.html`     | Landing interface            |
| `map.html`       | GIS map interface            |
| `about.html`     | Cinematic dossier page       |
| `data.html`      | Data section                 |
| `main.css`       | Global styling system        |
| `main_script.js` | Global interaction systems   |
| `map_script.js`  | Map camera + GIS systems     |
| `mapdata.js`     | Geospatial location database |
| `transition.css` | Glitch transition visuals    |
| `transition.js`  | Glitch transition logic      |

---

# Future Expansion

## Planned Systems

Potential future additions:

* Animated radar timeline
* Terrain visualization
* Route/path systems
* Heatmap overlays
* GIS analytics dashboard
* Expanded location database
* Cinematic detail panels
* Dynamic environmental overlays
* Real-time geospatial data layers

---

# Design Rules Summary

## Always Preserve

* Tactical atmosphere
* Cinematic motion
* Strong typography
* Geospatial immersion
* HUD visual identity
* Smooth interaction
* Consistent accent hierarchy

## Avoid

* Generic corporate UI
* Bright flat design
* Excessive colors
* Overly playful motion
* Default browser behaviors
* Generic map-dashboard aesthetics

---

# GEOFIELD Identity Statement

GEOFIELD is not a standard web map.

It is a cinematic tactical geospatial experience designed to make regional exploration feel immersive, atmospheric, and visually engineered.
