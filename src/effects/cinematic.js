import BaseEffect from '../core/base-effect.js';

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

/** Letterbox bars, animated film grain, vignette and teal-orange grade. */
export default class CinematicEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    // Teal shadows / orange highlights approximation via blend overlays.
    this.overlay(
      'background:linear-gradient(120deg,rgba(0,90,110,0.20),rgba(255,140,50,0.14));' +
      'mix-blend-mode:soft-light;',
    );
    this.overlay(
      'background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.5) 100%);',
    );
    const grain = this.overlay(
      `background-image:url("${GRAIN_SVG}");opacity:0.07;mix-blend-mode:overlay;`,
    );
    this.style(`
      @keyframes ${k}-grain {
        0% { transform: translate(0,0); } 25% { transform: translate(-30px,20px); }
        50% { transform: translate(20px,-25px); } 75% { transform: translate(-15px,-10px); }
        100% { transform: translate(0,0); }
      }
    `);
    grain.style.animation = `${k}-grain 0.45s steps(4) infinite`;
    grain.style.inset = '-40px';

    const barCss =
      'position:fixed;left:0;right:0;height:7vh;background:#000;' +
      'pointer-events:none;z-index:2147483647;transition:transform 0.8s ease;';
    const top = this.node(document.createElement('div'));
    top.style.cssText = barCss + 'top:0;transform:translateY(-100%);';
    const bottom = this.node(document.createElement('div'));
    bottom.style.cssText = barCss + 'bottom:0;transform:translateY(100%);';
    requestAnimationFrame(() => {
      top.style.transform = 'translateY(0)';
      bottom.style.transform = 'translateY(0)';
    });
  }
}