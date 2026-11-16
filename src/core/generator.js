/**
 * Parametric effect generator. A preset is fully determined by its seed,
 * so only the seed is stored/synced - the content side regenerates the
 * exact same preset on demand. 10 shapes x 12 palettes x 8 physics x
 * 6 emitters = 5,760 combinations, curated into 1000 browseable presets
 * plus an unlimited random generator.
 */
export const SHAPES = [
  'circle', 'star', 'rect', 'streak', 'heart',
  'petal', 'ring', 'triangle', 'spark', 'bubble',
];

export const PALETTES = {
  Inferno: ['#fff3b0', '#ffd166', '#ff9e00', '#ff5400', '#d00000'],
  Ocean: ['#caf0f8', '#90e0ef', '#00b4d8', '#0077b6', '#48cae4'],
  Neon: ['#ff2ec4', '#22d3ee', '#a3ff12', '#b388ff', '#ffffff'],
  Sakura: ['#ffb7c5', '#ffc9d6', '#ff9eb5', '#ffd7e0', '#fff0f3'],
  Gold: ['#fff3b0', '#ffd700', '#e6b800', '#ffb700', '#ffffff'],
  Matrix: ['#b6ffb6', '#00dc46', '#00a032', '#7dff9e', '#e8ffe8'],
  Aurora: ['#80ffdb', '#64dfdf', '#48bfe3', '#5390d9', '#7400b8'],
  Candy: ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff'],
  Mono: ['#ffffff', '#d8d8e0', '#a8a8b8', '#787888', '#f0f0f5'],
  Sunset: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#ffea00'],
  Toxic: ['#a3ff12', '#70e000', '#38b000', '#ccff33', '#9ef01a'],
  Ice: ['#e0fbfc', '#c2dfe3', '#9db4c0', '#5c6b73', '#ffffff'],
};

export const PHYSICS = [
  'fall', 'rise', 'explode', 'orbit', 'swirl', 'fountain', 'rain', 'float',
];

export const EMITTERS = ['cursor', 'click', 'bottom', 'top', 'edges', 'center'];

const PHYSICS_NOUN = {
  fall: 'Drizzle', rise: 'Ascension', explode: 'Burst', orbit: 'Orbit',
  swirl: 'Vortex', fountain: 'Fountain', rain: 'Storm', float: 'Drift',
};

const ADJECTIVES = [
  'Cosmic', 'Velvet', 'Electric', 'Frozen', 'Molten', 'Ghostly', 'Royal',
  'Wild', 'Silent', 'Crystal', 'Shadow', 'Radiant', 'Ancient', 'Hyper',
  'Lunar', 'Solar', 'Mystic', 'Turbo', 'Dreamy', 'Feral', 'Golden',
  'Midnight', 'Prism', 'Quantum', 'Rogue', 'Stellar', 'Vivid', 'Wicked',
  'Zen', 'Blazing', 'Drifting', 'Secret',
];

export const PRESET_COUNT = 1000;

/** Deterministic PRNG (mulberry32) so a seed always yields one preset. */
const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const genId = (seed) => `gen:${seed}`;
export const isGenId = (id) => typeof id === 'string' && id.startsWith('gen:');
export const seedOf = (id) => parseInt(id.slice(4), 10);

/** Build the full preset for a seed. Pure + deterministic. */
export function generatePreset(seed) {
  const r = rng(seed);
  const pickIn = (arr) => arr[Math.floor(r() * arr.length)];
  const shape = pickIn(SHAPES);
  const palette = pickIn(Object.keys(PALETTES));
  const physics = pickIn(PHYSICS);
  const emitter = pickIn(EMITTERS);
  const adj = pickIn(ADJECTIVES);
  const speed = 0.6 + r() * 1.2;
  return {
    seed,
    id: genId(seed),
    name: `${adj} ${palette} ${PHYSICS_NOUN[physics]}`,
    desc: `${shape} - ${physics} - from ${emitter}`,
    shape, palette, physics, emitter, speed,
    size: [1.5 + r() * 2, 4 + r() * 4],
    glow: r() < 0.6 ? Math.round(4 + r() * 10) : 0,
    additive: r() < 0.5,
    spin: (r() - 0.5) * 0.3,
  };
}

/** Random seed for the infinite generator. */
export const randomSeed = () => 1 + Math.floor(Math.random() * 999999999);