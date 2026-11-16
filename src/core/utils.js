/** Small shared math / misc helpers. */
export const TAU = Math.PI * 2;

export const rand = (min, max) => min + Math.random() * (max - min);

export const randInt = (min, max) => Math.floor(rand(min, max + 1));

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const lerp = (a, b, t) => a + (b - a) * t;

/** Unique DOM id / class prefix so effects never collide with page styles. */
export const uid = (prefix = 'webfx') =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

/** Convert hex color + alpha to an rgba() string. */
export const rgba = (hex, alpha) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};