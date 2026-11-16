import BaseEffect from '../core/base-effect.js';
import { rand } from '../core/utils.js';

/** Hyperspace starfield: stars accelerate outward from screen center. */
export default class StarfieldEffect extends BaseEffect {
  async onEnable() {
    this.stars = [];
    this.draw((ctx, { w, h, dt }) => {
      const cx = w / 2;
      const cy = h / 2;
      const target = Math.round(160 * this.intensity);
      while (this.stars.length < target) {
        this.stars.push({
          x: rand(-cx, cx), y: rand(-cy, cy),
          z: rand(0.1, 1), pz: 0,
        });
      }
      if (this.stars.length > target) this.stars.length = target;
      ctx.strokeStyle = '#ffffff';
      ctx.lineCap = 'round';
      for (const s of this.stars) {
        s.pz = s.z;
        s.z -= 0.012 * dt;
        if (s.z <= 0.02) {
          s.x = rand(-cx, cx);
          s.y = rand(-cy, cy);
          s.z = 1;
          s.pz = 1;
        }
        const sx = cx + s.x / s.z;
        const sy = cy + s.y / s.z;
        const px = cx + s.x / s.pz;
        const py = cy + s.y / s.pz;
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        const a = 1 - s.z;
        ctx.globalAlpha = a;
        ctx.lineWidth = Math.max(a * 2.4, 0.4);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  onDisable() {
    this.stars = [];
  }
}