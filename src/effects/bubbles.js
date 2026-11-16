import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Soap bubbles rising with wobble, a specular highlight, and a pop. */
export default class BubblesEffect extends BaseEffect {
  async onEnable() {
    this.bubbles = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(24 * this.intensity);
      while (this.bubbles.length < target) {
        this.bubbles.push({
          x: rand(0, w), y: h + rand(10, h * 0.5),
          r: rand(5, 22), speed: rand(0.5, 1.6),
          phase: rand(0, TAU),
        });
      }
      if (this.bubbles.length > target) this.bubbles.length = target;
      for (const b of this.bubbles) {
        b.y -= b.speed * dt;
        b.x += Math.sin(t / 800 + b.phase) * 0.5 * dt;
        if (b.y < -b.r) {
          b.y = h + b.r;
          b.x = rand(0, w);
        }
        ctx.strokeStyle = 'rgba(200,230,255,0.6)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.stroke();
        // Specular highlight
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.18, 0, TAU);
        ctx.fill();
      }
    });
  }

  onDisable() {
    this.bubbles = [];
  }
}