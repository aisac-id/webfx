import BaseEffect from '../core/base-effect.js';

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

/** VHS look: scanlines, tape noise, tracking jitter and a PLAY badge. */
export default class VhsEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-track {
        0%, 93%, 100% { transform: translate(0,0); filter: none; }
        94% { transform: translate(-6px,0) skewX(2deg); filter: saturate(1.6) hue-rotate(8deg); }
        96% { transform: translate(4px,1px); filter: contrast(1.3); }
        98% { transform: translate(-2px,0); filter: none; }
      }
      html.${k} { animation: ${k}-track 5s infinite steps(1); }
      @keyframes ${k}-noise {
        0% { background-position: 0 0; } 50% { background-position: 60px -40px; }
        100% { background-position: -30px 50px; }
      }
      @keyframes ${k}-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0.25; } }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    this.overlay(
      'background:repeating-linear-gradient(0deg,rgba(0,0,0,0.18) 0 2px,transparent 2px 4px);',
    );
    const noise = this.overlay(
      `background-image:url("${NOISE_SVG}");opacity:0.06;`,
    );
    noise.style.animation = `${k}-noise 0.3s steps(3) infinite`;
    // Chromatic tint
    this.overlay(
      'background:linear-gradient(90deg,rgba(255,0,60,0.05),rgba(0,180,255,0.05));' +
      'mix-blend-mode:screen;',
    );

    const badge = this.node(document.createElement('div'));
    badge.textContent = 'PLAY';
    badge.style.cssText =
      'position:fixed;top:22px;left:26px;z-index:2147483647;pointer-events:none;' +
      "font:700 22px 'Courier New',monospace;color:#e8e8e8;letter-spacing:3px;" +
      'text-shadow:2px 0 rgba(255,0,80,0.7),-2px 0 rgba(0,255,255,0.7);';
    badge.style.animation = `${k}-blink 1.6s infinite`;
  }
}