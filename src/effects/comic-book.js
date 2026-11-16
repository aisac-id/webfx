import BaseEffect from '../core/base-effect.js';

/** Halftone print dots + punchy saturated comic ink colors. */
export default class ComicBookEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} { filter: saturate(1.9) contrast(1.3) brightness(1.04); }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    // Halftone dot screen
    this.overlay(
      'background-image:radial-gradient(circle,rgba(0,0,0,0.22) 1px,transparent 1.6px);' +
      'background-size:6px 6px;opacity:0.65;',
    );
    // Slight paper warmth
    this.overlay('background:rgba(255,244,214,0.10);mix-blend-mode:multiply;');
    // Ink frame around the viewport
    this.overlay(
      'box-shadow:inset 0 0 0 5px #111,inset 0 0 0 8px rgba(255,255,255,0.6);' +
      'border-radius:4px;',
    );
  }
}