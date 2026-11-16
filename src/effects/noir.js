import BaseEffect from '../core/base-effect.js';

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

/** Moody black & white detective look with a heavy vignette. */
export default class NoirEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} { filter: grayscale(1) contrast(1.35) brightness(0.92); }
      @keyframes ${k}-grain {
        0% { background-position: 0 0; } 50% { background-position: -40px 30px; }
        100% { background-position: 30px -25px; }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    const grain = this.overlay(
      `background-image:url("${GRAIN_SVG}");opacity:0.08;mix-blend-mode:overlay;`,
    );
    grain.style.animation = `${k}-grain 0.4s steps(3) infinite`;
    this.overlay(
      'background:radial-gradient(ellipse at center,transparent 42%,rgba(0,0,0,0.72) 100%);',
    );
    // Diagonal venetian-blind shadows
    this.overlay(
      'background:repeating-linear-gradient(115deg,rgba(0,0,0,0.16) 0 26px,transparent 26px 78px);' +
      'opacity:0.6;',
    );
  }
}