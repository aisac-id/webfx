import BaseEffect from '../core/base-effect.js';

/** Inverted blue engineering schematic with a drafting grid. */
export default class BlueprintEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      html.${k} {
        filter: grayscale(1) invert(1) sepia(1) hue-rotate(185deg)
                saturate(2.4) brightness(0.92) contrast(1.05);
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    // Fine + coarse drafting grid
    this.overlay(
      'background:' +
      'repeating-linear-gradient(0deg,rgba(140,200,255,0.10) 0 1px,transparent 1px 24px),' +
      'repeating-linear-gradient(90deg,rgba(140,200,255,0.10) 0 1px,transparent 1px 24px),' +
      'repeating-linear-gradient(0deg,rgba(140,200,255,0.16) 0 1px,transparent 1px 120px),' +
      'repeating-linear-gradient(90deg,rgba(140,200,255,0.16) 0 1px,transparent 1px 120px);',
    );
    this.overlay(
      'background:radial-gradient(ellipse at center,transparent 60%,rgba(0,20,60,0.4) 100%);',
    );
    const stamp = this.node(document.createElement('div'));
    stamp.textContent = 'WEBFX ENGINEERING - REV A';
    stamp.style.cssText =
      'position:fixed;bottom:16px;left:20px;z-index:2147483647;pointer-events:none;' +
      "font:600 12px 'Courier New',monospace;color:rgba(180,220,255,0.8);" +
      'letter-spacing:2px;border:1px solid rgba(180,220,255,0.5);padding:5px 10px;';
  }
}