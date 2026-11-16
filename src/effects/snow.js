import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Soft snowflakes drifting down with a gentle sinusoidal sway. */
export default class SnowEffect extends BaseEffect {
  async onEnable() {
    this.flakes = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(120 * this.intensity);
      while (this.flakes.length < target) {
        this.flakes.push({
          x: rand(0, w),
          y: rand(-h, 0),
          r: rand(1, 3.5),
          speed: rand(0.5, 1.8),
          phase: rand(0, TAU),
          sway: rand(0.3, 1.2),
        });
      }
      if (this.flakes.length > target) this.flakes.length = target;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (const f of this.flakes) {
        f.y += f.speed * dt;
        f.x += Math.sin(t / 900 + f.phase) * f.sway * dt * 0.5;
        if (f.y > h + 5) {
          f.y = -5;
          f.x = rand(0, w);
        }
        ctx.globalAlpha = 0.4 + f.r / 6;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  onDisable() {
    this.flakes = [];
  }
}