import BaseEffect from '../core/base-effect.js';
import { rand, pick, TAU } from '../core/utils.js';

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9e00'];

/** Clicks drop glossy balls that bounce with gravity and restitution. */
export default class BouncyBallsEffect extends BaseEffect {
  async onEnable() {
    this.balls = [];
    this.onCleanup(this.pointer.onDown((x, y) => {
      if (this.balls.length >= 12) this.balls.shift();
      this.balls.push({
        x, y,
        vx: rand(-4, 4), vy: rand(-2, 1),
        r: rand(9, 18),
        color: pick(COLORS),
        life: 1,
      });
    }));
    this.draw((ctx, { w, h, dt }) => {
      for (const b of this.balls) {
        b.vy += 0.45 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y + b.r > h) {
          b.y = h - b.r;
          b.vy *= -0.75;
          b.vx *= 0.98;
        }
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -0.8; }
        if (b.x + b.r > w) { b.x = w - b.r; b.vx *= -0.8; }
        b.life -= 0.0035 * dt;
        if (b.life <= 0) continue;
        ctx.globalAlpha = Math.min(b.life * 2, 1);
        const g = ctx.createRadialGradient(
          b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.25, b.color);
        g.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.fill();
      }
      this.balls = this.balls.filter((b) => b.life > 0);
      ctx.globalAlpha = 1;
    });
  }

  onDisable() {
    this.balls = [];
  }
}