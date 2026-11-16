import BaseEffect from '../core/base-effect.js';
import { rand } from '../core/utils.js';

/** Whole-page impact rumble on click, like a movie impact shot. */
export default class ScreenShakeEffect extends BaseEffect {
  async onEnable() {
    this.cls = `webfx-shake-${this.id}`;
    this.style(`
      @keyframes ${this.cls}-kf {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        15% { transform: translate(-8px, 5px) rotate(-0.4deg); }
        30% { transform: translate(7px, -6px) rotate(0.4deg); }
        45% { transform: translate(-6px, -4px) rotate(-0.3deg); }
        60% { transform: translate(5px, 6px) rotate(0.3deg); }
        75% { transform: translate(-3px, 2px) rotate(-0.15deg); }
        90% { transform: translate(2px, -2px) rotate(0.1deg); }
      }
      html.${this.cls} { animation: ${this.cls}-kf 0.35s linear; }
    `);
    this._timer = 0;
    this.onCleanup(this.pointer.onDown(() => this._shake()));
    this.onCleanup(() => clearTimeout(this._timer));
  }

  _shake() {
    const root = document.documentElement;
    root.classList.remove(this.cls);
    // Force reflow so repeated clicks restart the animation.
    void root.offsetWidth;
    root.style.setProperty('--webfx-shake', rand(0.8, 1.2) * this.intensity);
    root.classList.add(this.cls);
    clearTimeout(this._timer);
    this._timer = setTimeout(() => root.classList.remove(this.cls), 400);
  }

  onDisable() {
    document.documentElement.classList.remove(this.cls);
  }
}