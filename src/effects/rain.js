import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand } from '../core/utils.js';

/** Fast diagonal rain streaks with tiny splashes near the bottom. */
export default class RainEffect extends BaseEffect {
  async onEnable() {
    this.drops = [];
    this.splashes = new ParticleSystem();
    this.draw((ctx, { w, h, dt }) => {
      const target = Math.round(140 * this.intensity);
      while (this.drops.length < target) {
        this.drops.push({
          x: rand(-100, w), y: rand(-h, 0),
          len: rand(10, 24), speed: rand(11, 18),
        });
      }
      if (this.drops.length > target) this.drops.length = target;
      ctx.strokeStyle = 'rgba(160,200,255,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of this.drops) {
        d.y += d.speed * dt;
        d.x += d.speed * 0.18 * dt;
        if (d.y > h) {
          if (Math.random() < 0.3) {
            this.splashes.burst(d.x, h - 2, 3, () => ({
              vx: rand(-1, 1), vy: rand(-2, -0.5),
              size: rand(0.6, 1.4), decay: 0.08,
              gravity: 0.2, color: 'rgba(170,210,255,0.8)',
            }));
          }
          d.y = rand(-80, -10);
          d.x = rand(-100, w);
        }
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.18, d.y - d.len);
      }
      ctx.stroke();
      this.splashes.update(ctx, dt);
    });
  }

  onDisable() {
    this.drops = [];
    this.splashes?.clear();
  }
}