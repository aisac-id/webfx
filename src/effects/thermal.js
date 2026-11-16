import BaseEffect from '../core/base-effect.js';

/** Predator-style thermal false-color view of the page. */
export default class ThermalEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} {
        filter: grayscale(1) contrast(1.6) brightness(1.05) invert(1);
      }
      @keyframes ${k}-shift {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(-35deg); }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    // Map luminance to a heat palette: blue -> magenta -> orange -> yellow.
    const heat = this.overlay(
      'background:linear-gradient(180deg,#ffdd00 0%,#ff6a00 30%,#d400ff 65%,#1a1aff 100%);' +
      'mix-blend-mode:color;',
    );
    heat.style.animation = `${k}-shift 8s ease-in-out infinite`;
    this.overlay(
      'background:linear-gradient(180deg,rgba(255,220,0,0.12),rgba(20,20,255,0.18));' +
      'mix-blend-mode:overlay;',
    );
    // Sensor readout corner
    const hud = this.node(document.createElement('div'));
    hud.textContent = 'FLIR  x1.0  AUTO';
    hud.style.cssText =
      'position:fixed;bottom:18px;right:22px;z-index:2147483647;pointer-events:none;' +
      "font:600 13px 'Courier New',monospace;color:#fff;opacity:0.75;letter-spacing:2px;";
  }
}