import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Paper planes gliding across the screen on lazy sine waves. */
export default class PaperPlanesEffect extends BaseEffect {
  async onEnable() {
    this.planes = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.max(2, Math.round(4 * this.intensity));
      while (this.planes.length < target) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        this.planes.push({
          x: dir === 1 ? rand(-w, -40) : rand(w + 40, w * 2),
          y: rand(h * 0.1, h * 0.7),
          dir,
          speed: rand(1.6, 3.2),
          amp: rand(20, 55),
          phase: rand(0, TAU),
          size: rand(10, 16),
        });
      }
      if (this.planes.length > target) this.planes.length = target;
      for (const p of this.planes) {
        p.x += p.speed * p.dir * dt;
        const y = p.y + Math.sin(t / 900 + p.phase) * p.amp;
        const slope = Math.cos(t / 900 + p.phase) * p.amp * 0.004;
        if ((p.dir === 1 && p.x > w + 60) || (p.dir === -1 && p.x < -60)) {
          p.x = p.dir === 1 ? -60 : w + 60;
          p.y = rand(h * 0.1, h * 0.7);
        }
        ctx.save();
        ctx.translate(p.x, y);
        ctx.scale(p.dir, 1);
        ctx.rotate(slope * p.dir);
        const s = p.size;
        ctx.fillStyle = 'rgba(245,248,255,0.95)';
        ctx.strokeStyle = 'rgba(140,150,180,0.8)';
        ctx.lineWidth = 1;
        // Fuselage
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.lineTo(-s, -s * 0.5);
        ctx.lineTo(-s * 0.4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Lower wing
        ctx.fillStyle = 'rgba(210,218,235,0.95)';
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.lineTo(-s * 0.4, 0);
        ctx.lineTo(-s * 0.7, s * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  onDisable() {
    this.planes = [];
  }
}