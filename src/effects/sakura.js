import BaseEffect from '../core/base-effect.js';
import { rand, pick, TAU } from '../core/utils.js';

const PINK = ['#ffb7c5', '#ffc9d6', '#ff9eb5', '#ffd7e0'];

/** Cherry-blossom petals spinning down in the wind. */
export default class SakuraEffect extends BaseEffect {
  async onEnable() {
    this.petals = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(50 * this.intensity);
      while (this.petals.length < target) {
        this.petals.push(this._petal(w, h, true));
      }
      if (this.petals.length > target) this.petals.length = target;
      for (const p of this.petals) {
        p.y += p.speed * dt;
        p.x += (Math.sin(t / 1000 + p.phase) * 0.8 + p.wind) * dt;
        p.rot += p.spin * dt;
        if (p.y > h + 12 || p.x > w + 20) {
          Object.assign(p, this._petal(w, h, false));
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });
  }

  _petal(w, h, anywhere) {
    return {
      x: rand(-20, w),
      y: anywhere ? rand(-h, 0) : rand(-60, -10),
      size: rand(3.5, 7),
      speed: rand(0.7, 1.8),
      wind: rand(0.2, 0.9),
      rot: rand(0, TAU),
      spin: rand(-0.06, 0.06),
      phase: rand(0, TAU),
      color: pick(PINK),
    };
  }

  onDisable() {
    this.petals = [];
  }
}