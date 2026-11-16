import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Blue depth tint, wavering light caustics and rising bubbles. */
export default class UnderwaterEffect extends BaseEffect {
  async onEnable() {
    this.overlay('background:linear-gradient(rgba(0,60,120,0.18),rgba(0,25,70,0.38));');
    this.bubbles = [];
    this.draw((ctx, { w, h, dt, t }) => {
      // Caustic light bands from the surface
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        const x = ((t * 0.02 + i * w / 4) % (w + 300)) - 150;
        const g = ctx.createLinearGradient(x - 80, 0, x + 80, h * 0.7);
        g.addColorStop(0, 'rgba(120,200,255,0.07)');
        g.addColorStop(1, 'rgba(120,200,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x - 40 + Math.sin(t / 1200 + i) * 30, 0);
        ctx.lineTo(x + 40 + Math.sin(t / 1200 + i) * 30, 0);
        ctx.lineTo(x + 160, h * 0.7);
        ctx.lineTo(x - 160, h * 0.7);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      // Bubbles
      const target = Math.round(18 * this.intensity);
      while (this.bubbles.length < target) {
        this.bubbles.push({
          x: rand(0, w), y: h + rand(0, h),
          r: rand(2, 7), speed: rand(0.8, 2.2), phase: rand(0, TAU),
        });
      }
      if (this.bubbles.length > target) this.bubbles.length = target;
      ctx.strokeStyle = 'rgba(190,230,255,0.55)';
      ctx.lineWidth = 1;
      for (const b of this.bubbles) {
        b.y -= b.speed * dt;
        b.x += Math.sin(t / 600 + b.phase) * 0.6 * dt;
        if (b.y < -10) { b.y = h + 10; b.x = rand(0, w); }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.stroke();
      }
    });
  }

  onDisable() {
    this.bubbles = [];
  }
}