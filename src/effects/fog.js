import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Thick drifting fog banks made of soft radial blobs. */
export default class FogEffect extends BaseEffect {
  async onEnable() {
    this.banks = [];
    this.draw((ctx, { w, h, dt }) => {
      const target = Math.round(10 * this.intensity);
      while (this.banks.length < target) {
        this.banks.push({
          x: rand(0, w), y: rand(h * 0.3, h),
          r: rand(140, 340), vx: rand(-0.35, 0.35),
          alpha: rand(0.05, 0.13),
        });
      }
      if (this.banks.length > target) this.banks.length = target;
      for (const b of this.banks) {
        b.x += b.vx * dt;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(200,205,215,${b.alpha})`);
        g.addColorStop(1, 'rgba(200,205,215,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.fill();
      }
    });
  }

  onDisable() {
    this.banks = [];
  }
}