/**
 * Central effect catalog. Shared by the sidebar (UI), the content app
 * (lazy loader) and the budget guard. `file` is dynamically imported ONLY
 * when enabled. `cost` is the render budget weight (1 light, 2 medium);
 * `group: 'filter'` marks fullscreen filters - only one may be active.
 */
export const CATEGORIES = [
  { id: 'click', name: 'Click & Keys' },
  { id: 'cursor', name: 'Cursor Trails' },
  { id: 'ambient', name: 'Ambient & World' },
  { id: 'cinema', name: 'Cinematic Filters' },
];

const E = (id, name, category, desc, cost = 1, group = null) =>
  ({ id, name, category, desc, cost, group, file: `${id}.js` });

const EFFECTS = [
  // ---- Click & Keys ----
  E('explosion', 'Explosion Click', 'click', 'Fiery particle blast + shockwave ring on every click.'),
  E('ripple', 'Water Ripple', 'click', 'Concentric water rings expand from each click.'),
  E('confetti', 'Confetti Burst', 'click', 'Celebration confetti explodes from your clicks.'),
  E('screen-shake', 'Screen Shake', 'click', 'The whole page rumbles on click, like an impact shot.'),
  E('thanos-snap', 'Thanos Snap', 'click', 'Clicked elements disintegrate into drifting dust.'),
  E('comic-pow', 'Comic POW!', 'click', 'POW! BAM! BOOM! comic bursts pop out of your clicks.'),
  E('combo-counter', 'Combo Counter', 'click', 'Fighting-game combo counter racks up as you click.'),
  E('typing-sparks', 'Keystroke Sparks', 'click', 'Every keypress spits cyan sparks at the cursor.'),
  E('screen-crack', 'Screen Crack', 'click', 'Clicks leave jagged glass cracks that fade away.'),
  E('impact-flash', 'Impact Flash', 'click', 'Anime impact frame: instant invert flash + speed lines.'),
  E('bouncy-balls', 'Bouncy Balls', 'click', 'Clicks drop glossy balls that bounce with real physics.'),
  // ---- Cursor Trails ----
  E('fire-trail', 'Fire Trail', 'cursor', 'Your cursor drags a trail of rising flames.'),
  E('sparkle-trail', 'Sparkle Trail', 'cursor', 'Twinkling pastel stars follow your mouse.'),
  E('neon-trail', 'Neon Ribbon', 'cursor', 'A glowing hue-cycling ribbon follows the cursor.'),
  E('black-hole', 'Black Hole', 'cursor', 'Particles spiral into a singularity at your cursor.', 2),
  E('snake-trail', 'Pixel Snake', 'cursor', 'A little snake with eyes chases your cursor around.'),
  E('orbit-planets', 'Orbit Planets', 'cursor', 'Tiny planets orbit your cursor like a solar system.'),
  E('torch', 'Torchlight', 'cursor', 'The page goes dark; your cursor carries a warm torch.'),
  E('hearts-trail', 'Hearts Trail', 'cursor', 'Soft pink hearts float up from your cursor path.'),
  E('kaleido-trail', 'Kaleidoscope', 'cursor', 'Your trail mirrors 4-way into a glowing mandala.'),
  // ---- Ambient & World ----
  E('matrix-rain', 'Matrix Rain', 'ambient', 'Green digital rain of glyphs, straight from 1999.', 2),
  E('snow', 'Snowfall', 'ambient', 'Soft snowflakes drifting down with gentle sway.'),
  E('rain', 'Rainstorm', 'ambient', 'Fast rain streaks with splashes at the bottom.'),
  E('fireflies', 'Fireflies', 'ambient', 'Wandering glowing bugs pulsing in the dark.'),
  E('embers', 'Rising Embers', 'ambient', 'Hot embers float up from the bottom of the screen.'),
  E('bubbles', 'Bubbles', 'ambient', 'Soap bubbles rise, wobble and pop at the top.'),
  E('starfield', 'Starfield Warp', 'ambient', 'Hyperspace star streaks flying past the camera.', 2),
  E('lightning', 'Lightning Storm', 'ambient', 'Random sky flashes with jagged glowing bolts.'),
  E('fireworks', 'Fireworks', 'ambient', 'Auto rockets + click to launch your own show.', 2),
  E('aurora', 'Aurora', 'ambient', 'Slow northern-light ribbons waving across the page.', 2),
  E('fog', 'Haunted Fog', 'ambient', 'Thick drifting fog banks for a horror mood.'),
  E('underwater', 'Underwater', 'ambient', 'Blue depth tint, light caustics and rising bubbles.', 2),
  E('sakura', 'Sakura Petals', 'ambient', 'Cherry-blossom petals spinning down in the wind.'),
  E('autumn-leaves', 'Autumn Leaves', 'ambient', 'Red and gold leaves tumbling through the air.'),
  E('meteors', 'Meteor Shower', 'ambient', 'Shooting stars streak across with glowing tails.'),
  E('balloons', 'Balloons', 'ambient', 'Colorful party balloons drifting up with strings.'),
  E('paper-planes', 'Paper Planes', 'ambient', 'Paper planes gliding across on lazy sine waves.'),
  E('ghosts', 'Friendly Ghosts', 'ambient', 'Translucent little ghosts bobbing across the page.'),
  E('disco', 'Disco Fever', 'ambient', 'Rotating colored club beams + pulsing dance floor.', 2),
  E('synthwave', 'Synthwave Horizon', 'ambient', 'Retro sun and a scrolling neon perspective grid.', 2),
  // ---- Cinematic Filters (exclusive: one at a time) ----
  E('cinematic', 'Cinematic Grade', 'cinema', 'Letterbox, film grain, vignette, teal-orange grade.', 2, 'filter'),
  E('glitch', 'Cyber Glitch', 'cinema', 'RGB split, jitter and scanline corruption bursts.', 2, 'filter'),
  E('vhs', 'VHS Retro', 'cinema', 'Scanlines, noise, tracking jitter and a PLAY badge.', 2, 'filter'),
  E('crt', 'CRT Monitor', 'cinema', 'Phosphor scanlines, flicker and curved-glass vignette.', 2, 'filter'),
  E('night-vision', 'Night Vision', 'cinema', 'Green phosphor military night-vision view.', 2, 'filter'),
  E('thermal', 'Thermal Camera', 'cinema', 'Heat-map false color, predator style.', 2, 'filter'),
  E('blueprint', 'Blueprint', 'cinema', 'Inverted blue engineering schematic with grid.', 2, 'filter'),
  E('noir', 'Film Noir', 'cinema', 'Moody black & white, heavy vignette, detective vibes.', 2, 'filter'),
  E('old-film', 'Old Film 1920s', 'cinema', 'Sepia flicker, scratches, grain and cigarette burns.', 2, 'filter'),
  E('comic-book', 'Comic Book', 'cinema', 'Halftone dots and punchy saturated ink colors.', 2, 'filter'),
  E('hologram', 'Hologram', 'cinema', 'Cyan projection with scanlines and interference rolls.', 2, 'filter'),
  E('dreamy', 'Dreamy Bloom', 'cinema', 'Soft pastel bloom, like a memory sequence.', 2, 'filter'),
];

export default EFFECTS;

export const byId = (id) => EFFECTS.find((e) => e.id === id);