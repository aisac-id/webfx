/**
 * Central effect catalog. Shared by the popup (UI) and the content app
 * (lazy loader). `file` is the ES module dynamically imported ONLY when
 * the effect is enabled - nothing else is ever fetched or executed.
 */
export const CATEGORIES = [
  { id: 'click', name: 'Click FX' },
  { id: 'cursor', name: 'Cursor Trails' },
  { id: 'ambient', name: 'Ambient & Weather' },
  { id: 'cinema', name: 'Cinematic Filters' },
];

const EFFECTS = [
  { id: 'explosion', name: 'Explosion Click', category: 'click', file: 'explosion.js',
    desc: 'Fiery particle blast + shockwave ring on every click.' },
  { id: 'ripple', name: 'Water Ripple', category: 'click', file: 'ripple.js',
    desc: 'Concentric water rings expand from each click.' },
  { id: 'confetti', name: 'Confetti Burst', category: 'click', file: 'confetti.js',
    desc: 'Celebration confetti explodes from your clicks.' },
  { id: 'screen-shake', name: 'Screen Shake', category: 'click', file: 'screen-shake.js',
    desc: 'The whole page rumbles on click, like an impact shot.' },
  { id: 'thanos-snap', name: 'Thanos Snap', category: 'click', file: 'thanos-snap.js',
    desc: 'Clicked elements disintegrate into drifting dust.' },
  { id: 'fire-trail', name: 'Fire Trail', category: 'cursor', file: 'fire-trail.js',
    desc: 'Your cursor drags a trail of rising flames.' },
  { id: 'sparkle-trail', name: 'Sparkle Trail', category: 'cursor', file: 'sparkle-trail.js',
    desc: 'Twinkling pastel stars follow your mouse.' },
  { id: 'neon-trail', name: 'Neon Ribbon', category: 'cursor', file: 'neon-trail.js',
    desc: 'A glowing hue-cycling ribbon follows the cursor.' },
  { id: 'black-hole', name: 'Black Hole', category: 'cursor', file: 'black-hole.js',
    desc: 'Particles spiral into a singularity at your cursor.' },
  { id: 'matrix-rain', name: 'Matrix Rain', category: 'ambient', file: 'matrix-rain.js',
    desc: 'Green digital rain of glyphs, straight from 1999.' },
  { id: 'snow', name: 'Snowfall', category: 'ambient', file: 'snow.js',
    desc: 'Soft snowflakes drifting down with gentle sway.' },
  { id: 'rain', name: 'Rainstorm', category: 'ambient', file: 'rain.js',
    desc: 'Fast rain streaks with splashes at the bottom.' },
  { id: 'fireflies', name: 'Fireflies', category: 'ambient', file: 'fireflies.js',
    desc: 'Wandering glowing bugs pulsing in the dark.' },
  { id: 'embers', name: 'Rising Embers', category: 'ambient', file: 'embers.js',
    desc: 'Hot embers float up from the bottom of the screen.' },
  { id: 'bubbles', name: 'Bubbles', category: 'ambient', file: 'bubbles.js',
    desc: 'Soap bubbles rise, wobble and pop at the top.' },
  { id: 'starfield', name: 'Starfield Warp', category: 'ambient', file: 'starfield.js',
    desc: 'Hyperspace star streaks flying past the camera.' },
  { id: 'lightning', name: 'Lightning Storm', category: 'ambient', file: 'lightning.js',
    desc: 'Random sky flashes with jagged glowing bolts.' },
  { id: 'fireworks', name: 'Fireworks', category: 'ambient', file: 'fireworks.js',
    desc: 'Auto rockets + click to launch your own show.' },
  { id: 'aurora', name: 'Aurora', category: 'ambient', file: 'aurora.js',
    desc: 'Slow northern-light ribbons waving across the page.' },
  { id: 'fog', name: 'Haunted Fog', category: 'ambient', file: 'fog.js',
    desc: 'Thick drifting fog banks for a horror mood.' },
  { id: 'underwater', name: 'Underwater', category: 'ambient', file: 'underwater.js',
    desc: 'Blue depth tint, light caustics and rising bubbles.' },
  { id: 'cinematic', name: 'Cinematic Grade', category: 'cinema', file: 'cinematic.js',
    desc: 'Letterbox bars, film grain, vignette, teal-orange grade.' },
  { id: 'glitch', name: 'Cyber Glitch', category: 'cinema', file: 'glitch.js',
    desc: 'RGB split, jitter and scanline corruption bursts.' },
  { id: 'vhs', name: 'VHS Retro', category: 'cinema', file: 'vhs.js',
    desc: 'Scanlines, noise, tracking jitter and a PLAY badge.' },
  { id: 'crt', name: 'CRT Monitor', category: 'cinema', file: 'crt.js',
    desc: 'Phosphor scanlines, flicker and curved-glass vignette.' },
  { id: 'night-vision', name: 'Night Vision', category: 'cinema', file: 'night-vision.js',
    desc: 'Green phosphor military night-vision view.' },
  { id: 'thermal', name: 'Thermal Camera', category: 'cinema', file: 'thermal.js',
    desc: 'Heat-map false color, predator style.' },
  { id: 'blueprint', name: 'Blueprint', category: 'cinema', file: 'blueprint.js',
    desc: 'Inverted blue engineering schematic with grid.' },
];

export default EFFECTS;

export const byId = (id) => EFFECTS.find((e) => e.id === id);