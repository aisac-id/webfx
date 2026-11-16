/**
 * Curated scene presets for Shuffle and AI Director mode.
 * Every scene respects the performance budget (max 4 effects,
 * total cost <= 7, at most one cinematic filter).
 */
const SCENES = [
  { id: 'blockbuster', name: 'Blockbuster', effects: ['cinematic', 'embers'] },
  { id: 'cyberpunk', name: 'Cyberpunk', effects: ['glitch', 'neon-trail', 'rain'] },
  { id: 'digital', name: 'Digital World', effects: ['matrix-rain', 'night-vision'] },
  { id: 'cozy-winter', name: 'Cozy Winter', effects: ['snow', 'sparkle-trail'] },
  { id: 'party', name: 'Party Time', effects: ['confetti', 'disco', 'balloons'] },
  { id: 'horror', name: 'Haunted Night', effects: ['noir', 'fog', 'lightning'] },
  { id: 'ocean', name: 'Deep Ocean', effects: ['underwater', 'bubbles'] },
  { id: 'space', name: 'Deep Space', effects: ['starfield', 'meteors', 'black-hole'] },
  { id: 'anime', name: 'Anime Fight', effects: ['impact-flash', 'comic-pow', 'sakura'] },
  { id: 'retrowave', name: 'Retrowave', effects: ['vhs', 'synthwave'] },
  { id: 'silent-film', name: 'Silent Film', effects: ['old-film', 'screen-shake'] },
  { id: 'fairy-tale', name: 'Fairy Tale', effects: ['sakura', 'hearts-trail', 'fireflies'] },
  { id: 'hacker', name: 'Hacker Den', effects: ['hologram', 'matrix-rain', 'typing-sparks'] },
  { id: 'arcade', name: 'Arcade', effects: ['synthwave', 'combo-counter', 'bouncy-balls'] },
  { id: 'storm', name: 'Thunderstorm', effects: ['rain', 'lightning', 'screen-shake'] },
  { id: 'dream', name: 'Daydream', effects: ['dreamy', 'bubbles', 'kaleido-trail'] },
  { id: 'autumn', name: 'Autumn Walk', effects: ['autumn-leaves', 'torch'] },
  { id: 'ghost-story', name: 'Ghost Story', effects: ['fog', 'ghosts', 'noir'] },
];

export default SCENES;

/** Pick a random scene, avoiding the previous one when possible. */
export const pickScene = (lastId = null) => {
  const pool = SCENES.filter((s) => s.id !== lastId);
  return pool[Math.floor(Math.random() * pool.length)];
};

/** Convert a scene into a storage `enabled` map. */
export const sceneToEnabled = (scene) =>
  Object.fromEntries(scene.effects.map((id) => [id, true]));