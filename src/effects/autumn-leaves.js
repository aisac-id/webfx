import BaseEffect from '../core/base-effect.js';
import { rand, pick, TAU } from '../core/utils.js';

const LEAF = ['#d9480f', '#e8590c', '#f08c00', '#c92a2a', '#a61e4d', '#e67700'];

/** Red and gold autumn leaves tumbling through the air. */
export default class AutumnLeavesEffect extends BaseEffect {
  async onEnable() {
    this.leaves = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.round(32 * this.intensity);
      while (this.leaves.length < target) {
        this.leaves.push(this._leaf(w, h, true));
      }
      if (this.leaves.length > target) this.leaves.length = target;
      for (const l of this.leaves) {
        l.y += l.speed * dt;
        l.x += (Math.sin(t / 800 + l.phase) * 1.1 + l.wind) * dt;
        l.rot += l.spin * dt;
        if (l.y > h + 16 || l.x > w + 30) Object.assign(l, this._leaf(w, h, false));
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = l.color;
        // Simple leaf: two arcs meeting at tip and stem.
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.quadraticCurveTo(l.size, -l.size * 0.2, 0, l.size);
        ctx.quadraticCurveTo(-l.size, -l.size * 0.2, 0, -l.size);
        ctx.fill();
        ctx.strokeStyle = 'rgba(80,40,0,0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.lineTo(0, l.size * 1.25);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });
  }

  _leaf(w, h, anywhere) {
    return {
      x: rand(-30, w),
      y: anywhere ? rand(-h, 0) : rand(-80, -16),
      size: rand(5, 10),
      speed: rand(0.8, 2),
      wind: rand(0.3, 1.2),
      rot: rand(0, TAU),
      spin: rand(-0.08, 0.08),
      phase: rand(0, TAU),
      color: pick(LEAF),
    };
  }

  onDisable() {
    this.leaves = [];
  }
}