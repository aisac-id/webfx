import BaseEffect from '../core/base-effect.js';

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

/** Military green-phosphor night vision with sensor noise. */
export default class NightVisionEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} {
        filter: grayscale(1) sepia(1) hue-rotate(65deg) saturate(3.2)
                brightness(1.15) contrast(1.15);
      }
      @keyframes ${k}-noise {
        0% { background-position: 0 0; } 50% { background-position: -50px 30px; }
        100% { background-position: 40px -20px; }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    const noise = this.overlay(
      `background-image:url("${NOISE_SVG}");opacity:0.10;mix-blend-mode:overlay;`,
    );
    noise.style.animation = `${k}-noise 0.25s steps(2) infinite`;
    this.overlay(
      'background:radial-gradient(circle at center,transparent 48%,rgba(0,20,0,0.75) 100%);',
    );
    this.overlay(
      'background:repeating-linear-gradient(0deg,rgba(0,40,0,0.12) 0 1px,transparent 1px 3px);',
    );
  }
}