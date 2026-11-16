import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, randInt, TAU } from '../core/utils.js';

/**
 * Clicked elements disintegrate into drifting dust.
 * Dust colors are sampled from the element's computed styles; the DOM
 * itself is only hidden (never removed) and fully restored on disable.
 */
export default class ThanosSnapEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.snapped = [];
    this.onCleanup(this.pointer.onDown((x, y, e) => this._snap(e)));
    this.draw((ctx, { dt }) => {
      this.ps.update(ctx, dt);
    });
  }

  _snap(e) {
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    if (el === document.body || el === document.documentElement) return;
    if (this.snapped.some((s) => s.el === el)) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    if (rect.width * rect.height > window.innerWidth * window.innerHeight * 0.6) return;

    const cs = getComputedStyle(el);
    const palette = [cs.color, cs.backgroundColor, cs.borderTopColor]
      .filter((c) => c && !c.includes('0, 0, 0, 0'));
    if (palette.length === 0) palette.push('rgb(150,150,150)');

    const area = rect.width * rect.height;
    const count = Math.min(Math.round((area / 90) * this.intensity), 900);
    for (let i = 0; i < count; i++) {
      this.ps.spawn({
        x: rect.left + rand(0, rect.width),
        y: rect.top + rand(0, rect.height),
        vx: rand(0.4, 2.4),
        vy: rand(-1.4, 0.4),
        size: rand(0.8, 2.4),
        decay: rand(0.004, 0.012),
        drag: 0.995,
        gravity: -0.01,
        color: palette[randInt(0, palette.length - 1)],
      });
    }

    const prev = {
      el,
      transition: el.style.transition,
      opacity: el.style.opacity,
      transform: el.style.transform,
      visibility: el.style.visibility,
    };
    this.snapped.push(prev);
    el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    el.style.opacity = '0';
    el.style.transform = 'translate(14px, -8px) rotate(1.5deg)';
    setTimeout(() => {
      if (this.snapped.includes(prev)) el.style.visibility = 'hidden';
    }, 950);
  }

  onDisable() {
    for (const s of this.snapped ?? []) {
      s.el.style.transition = s.transition;
      s.el.style.opacity = s.opacity;
      s.el.style.transform = s.transform;
      s.el.style.visibility = s.visibility;
    }
    this.snapped = [];
    this.ps?.clear();
  }
}