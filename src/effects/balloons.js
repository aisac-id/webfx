import BaseEffect from '../core/base-effect.js';
import { rand, pick, TAU } from '../core/utils.js';

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9e00'];

/** Colorful party balloons drifting up, each with a wavy string. */
export default class BalloonsEffect extends BaseEffect {
  async onEnable() {
    this.balloons = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(10 * this.intensity);
      while (this.balloons.length < target) {
        this.balloons.push({
          x: rand(0, w), y: h + rand(30, h),
          r: rand(14, 24), speed: rand(0.5, 1.2),
          phase: rand(0, TAU), color: pick(COLORS),
        });
      }
      if (this.balloons.length > target) this.balloons.length = target;
      for (const b of this.balloons) {
        b.y -= b.speed * dt;
        b.x += Math.sin(t / 1100 + b.phase) * 0.4 * dt;
        if (b.y < -b.r * 3) {
          b.y = h + b.r * 3;
          b.x = rand(0, w);
        }
        // String
        ctx.strokeStyle = 'rgba(120,120,140,0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.r * 1.15);
        ctx.quadraticCurveTo(
          b.x + Math.sin(t / 700 + b.phase) * 8, b.y + b.r * 2.2,
          b.x, b.y + b.r * 3);
        ctx.stroke();
        // Balloon body
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.r * 0.85, b.r, 0, 0, TAU);
        ctx.fill();
        // Knot
        ctx.beginPath();
        ctx.moveTo(b.x - 3, b.y + b.r * 1.12);
        ctx.lineTo(b.x + 3, b.y + b.r * 1.12);
        ctx.lineTo(b.x, b.y + b.r * 0.9);
        ctx.closePath();
        ctx.fill();
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.ellipse(b.x - b.r * 0.3, b.y - b.r * 0.35, b.r * 0.18, b.r * 0.28, -0.5, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  onDisable() {
    this.balloons = [];
  }
}