import BaseEffect from '../core/base-effect.js';

/** Cyan holographic projection: scanlines, flicker, interference roll. */
export default class HologramEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-flicker {
        0%, 100% { opacity: 1; } 92% { opacity: 1; }
        93% { opacity: 0.75; } 94% { opacity: 1; } 97% { opacity: 0.85; }
      }
      html.${k} {
        filter: grayscale(0.7) sepia(0.6) hue-rotate(140deg) saturate(2.2)
                brightness(1.08) contrast(1.1);
        animation: ${k}-flicker 3.7s infinite steps(1);
      }
      @keyframes ${k}-roll {
        0% { transform: translateY(-20vh); } 100% { transform: translateY(120vh); }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    this.overlay(
      'background:repeating-linear-gradient(0deg,rgba(0,255,255,0.06) 0 1px,transparent 1px 3px);',
    );
    this.overlay('background:rgba(0,180,220,0.07);mix-blend-mode:screen;');
    // Interference band rolling down
    const band = this.overlay(
      'height:14vh;bottom:auto;' +
      'background:linear-gradient(transparent,rgba(120,255,255,0.12),rgba(255,255,255,0.18),transparent);',
    );
    band.style.animation = `${k}-roll 4.5s linear infinite`;
    // Projection base glow
    this.overlay(
      'background:radial-gradient(ellipse at 50% 100%,rgba(0,220,255,0.14),transparent 60%);',
    );
  }
}