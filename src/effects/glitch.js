import BaseEffect from '../core/base-effect.js';

/** RGB split, jitter and scanline corruption bursts, cyberpunk style. */
export default class GlitchEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-jitter {
        0%, 88%, 100% { filter: none; transform: translate(0,0); }
        89% { filter: hue-rotate(90deg) saturate(3); transform: translate(-4px,2px) skewX(1.5deg); }
        91% { filter: hue-rotate(-60deg) contrast(1.6); transform: translate(5px,-2px); }
        93% { filter: invert(0.12) saturate(2.5); transform: translate(-3px,0) skewX(-2deg); }
        95% { filter: hue-rotate(180deg); transform: translate(2px,1px); }
        97% { filter: none; transform: translate(0,0); }
      }
      html.${k} { animation: ${k}-jitter 3.2s infinite steps(1); }
      @keyframes ${k}-slice {
        0%, 90%, 100% { opacity: 0; }
        91% { opacity: 1; top: 12%; height: 6px; }
        93% { opacity: 1; top: 64%; height: 12px; }
        95% { opacity: 1; top: 38%; height: 4px; }
        97% { opacity: 0; }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    // RGB split ghost lines
    const slice = this.overlay(
      'background:linear-gradient(90deg,rgba(255,0,80,0.35),rgba(0,255,255,0.35));' +
      'mix-blend-mode:screen;height:8px;top:20%;bottom:auto;opacity:0;',
    );
    slice.style.animation = `${k}-slice 2.7s infinite steps(1)`;

    // Permanent faint scanlines
    this.overlay(
      'background:repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0 1px,transparent 1px 3px);' +
      'opacity:0.5;',
    );
  }
}