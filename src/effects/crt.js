import BaseEffect from '../core/base-effect.js';

/** Old CRT monitor: phosphor scanlines, flicker and curved-glass vignette. */
export default class CrtEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-flicker {
        0%, 100% { opacity: 0.92; } 8% { opacity: 1; } 16% { opacity: 0.95; }
        30% { opacity: 1; } 52% { opacity: 0.9; } 70% { opacity: 1; }
        86% { opacity: 0.96; }
      }
    `);
    // RGB phosphor mask + scanlines
    const mask = this.overlay(
      'background:' +
      'repeating-linear-gradient(0deg,rgba(0,0,0,0.22) 0 1px,transparent 1px 3px),' +
      'repeating-linear-gradient(90deg,rgba(255,0,0,0.05) 0 1px,rgba(0,255,0,0.05) 1px 2px,rgba(0,0,255,0.05) 2px 3px);',
    );
    mask.style.animation = `${k}-flicker 0.12s infinite`;
    // Curved glass edge darkening
    this.overlay(
      'background:radial-gradient(ellipse at center,transparent 62%,rgba(0,0,0,0.55) 100%);' +
      'border-radius:2.5% / 4%;box-shadow:inset 0 0 120px rgba(0,0,0,0.6);',
    );
    // Slow rolling brightness band
    this.style(`
      @keyframes ${k}-roll {
        0% { transform: translateY(-30vh); } 100% { transform: translateY(130vh); }
      }
    `);
    const roll = this.overlay(
      'background:linear-gradient(transparent,rgba(255,255,255,0.05),transparent);' +
      'height:22vh;bottom:auto;',
    );
    roll.style.animation = `${k}-roll 6s linear infinite`;
  }
}