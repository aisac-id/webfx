import BaseEffect from '../core/base-effect.js';
import { lerp } from '../core/utils.js';

/** Glowing hue-cycling ribbon that chases the cursor. */
export default class NeonTrailEffect extends BaseEffect {
  async onEnable() {
    this.points = [];
    this.max = 36;
    this.hue = 0;
    this.draw((ctx, { dt }) => {
      this.hue = (this.hue + 2 * dt) % 360;
      // Head eases toward the pointer for a smooth ribbon feel.
      const head = this.points[0] ?? { x: this.pointer.x, y: this.pointer.y };
      this.points.unshift({
        x: lerp(head.x, this.pointer.x, 0.5),
        y: lerp(head.y, this.pointer.y, 0.5),
      });
      if (this.points.length > this.max) this.points.pop();
      if (this.points.length < 3) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 16;
      for (let i = 1; i < this.points.length; i++) {
        const t = 1 - i / this.points.length;
        const hue = (this.hue + i * 4) % 360;
        ctx.strokeStyle = `hsla(${hue}, 100%, 62%, ${t})`;
        ctx.shadowColor = `hsl(${hue}, 100%, 62%)`;
        ctx.lineWidth = 10 * t * this.intensity + 0.5;
        ctx.beginPath();
        ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
        ctx.lineTo(this.points[i].x, this.points[i].y);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });
  }

  onDisable() {
    this.points = [];
  }
}