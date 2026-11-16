import BaseEffect from '../core/base-effect.js';

/** Soft pastel bloom like a dreamy memory sequence. */
export default class DreamyEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} { filter: saturate(1.25) brightness(1.06) contrast(0.96); }
      @keyframes ${k}-drift {
        0%, 100% { transform: translate(0,0) scale(1); }
        33% { transform: translate(-3%,2%) scale(1.05); }
        66% { transform: translate(2%,-2%) scale(1.03); }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    // Drifting pastel wash
    const wash = this.overlay(
      'background:' +
      'radial-gradient(45% 45% at 25% 30%,rgba(255,190,230,0.16),transparent 70%),' +
      'radial-gradient(50% 50% at 75% 65%,rgba(170,210,255,0.16),transparent 70%),' +
      'radial-gradient(40% 40% at 55% 20%,rgba(255,240,190,0.13),transparent 70%);' +
      'mix-blend-mode:screen;inset:-6%;',
    );
    wash.style.animation = `${k}-drift 14s ease-in-out infinite`;
    // White bloom vignette (inverse vignette)
    this.overlay(
      'background:radial-gradient(ellipse at center,rgba(255,255,255,0.10) 30%,rgba(255,250,245,0.28) 100%);',
    );
  }
}