import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Wandering glowing fireflies with pulsing brightness. */
export default class FirefliesEffect extends BaseEffect {
  async onEnable() {
    this.bugs = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(28 * this.intensity);
      while (this.bugs.length < target) {
        this.bugs.push({
          x: rand(0, w), y: rand(0, h),
          ang: rand(0, TAU), speed: rand(0.3, 0.9),
          phase: rand(0, TAU), pulse: rand(0.6, 1.6),
        });
      }
      if (this.bugs.length > target) this.bugs.length = target;
      ctx.globalCompositeOperation = 'lighter';
      for (const b of this.bugs) {
        b.ang += rand(-0.15, 0.15) * dt;
        b.x += Math.cos(b.ang) * b.speed * dt;
        b.y += Math.sin(b.ang) * b.speed * dt;
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;
        if (b.y < -20) b.y = h + 20;
        if (b.y > h + 20) b.y = -20;
        const glow = 0.35 + 0.65 * Math.abs(Math.sin(t / 700 * b.pulse + b.phase));
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 14);
        g.addColorStop(0, `rgba(220,255,140,${glow})`);
        g.addColorStop(1, 'rgba(220,255,140,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 14, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,210,${glow})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.6, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.bugs = [];
  }
}