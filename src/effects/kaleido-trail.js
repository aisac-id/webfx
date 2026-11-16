import BaseEffect from '../core/base-effect.js';
import { TAU } from '../core/utils.js';

/**
 * Cursor trail mirrored across both screen axes into a glowing
 * 4-way mandala. One trail buffer, four cheap draws.
 */
export default class KaleidoTrailEffect extends BaseEffect {
  async onEnable() {
    this.points = [];
    this.max = 42;
    this.hue = 0;
    this.onCleanup(this.pointer.onMove((x, y) => {
      this.points.unshift({ x, y });
      if (this.points.length > this.max) this.points.pop();
    }));
    this.draw((ctx, { w, h, dt }) => {
      this.hue = (this.hue + 1.5 * dt) % 360;
      if (this.points.length < 2) return;
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      const mirrors = [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
      ];
      for (const [mx, my] of mirrors) {
        for (let i = 1; i < this.points.length; i++) {
          const t = 1 - i / this.points.length;
          const p0 = this.points[i - 1];
          const p1 = this.points[i];
          const hue = (this.hue + i * 5) % 360;
          ctx.strokeStyle = `hsla(${hue}, 95%, 65%, ${t * 0.7})`;
          ctx.lineWidth = 5 * t * this.intensity + 0.4;
          ctx.beginPath();
          ctx.moveTo(mx === 1 ? p0.x : w - p0.x, my === 1 ? p0.y : h - p0.y);
          ctx.lineTo(mx === 1 ? p1.x : w - p1.x, my === 1 ? p1.y : h - p1.y);
          ctx.stroke();
        }
      }
      // Center jewel
      const head = this.points[0];
      ctx.fillStyle = `hsla(${this.hue}, 95%, 75%, 0.9)`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.points = [];
  }
}