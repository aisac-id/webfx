import BaseEffect from '../core/base-effect.js';
import { lerp, TAU } from '../core/utils.js';

/** A little segmented snake with eyes that chases the cursor. */
export default class SnakeTrailEffect extends BaseEffect {
  async onEnable() {
    this.segments = Array.from({ length: 16 }, () => ({
      x: this.pointer.x, y: this.pointer.y,
    }));
    this.draw((ctx, { dt, t }) => {
      const head = this.segments[0];
      head.x = lerp(head.x, this.pointer.x, Math.min(0.35 * dt, 1));
      head.y = lerp(head.y, this.pointer.y, Math.min(0.35 * dt, 1));
      // Each segment follows the previous at a fixed spacing.
      const spacing = 9;
      for (let i = 1; i < this.segments.length; i++) {
        const prev = this.segments[i - 1];
        const s = this.segments[i];
        const dx = prev.x - s.x;
        const dy = prev.y - s.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist > spacing) {
          s.x = prev.x - (dx / dist) * spacing;
          s.y = prev.y - (dy / dist) * spacing;
        }
      }
      // Body, tail to head
      for (let i = this.segments.length - 1; i >= 0; i--) {
        const s = this.segments[i];
        const r = 8 * (1 - i / this.segments.length) + 2.5;
        const hue = 130 + Math.sin(t / 500 + i * 0.4) * 20;
        ctx.fillStyle = `hsl(${hue}, 65%, ${45 + i}%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, TAU);
        ctx.fill();
      }
      // Eyes on the head, facing travel direction
      const neck = this.segments[1];
      const ang = Math.atan2(head.y - neck.y, head.x - neck.x);
      for (const side of [-1, 1]) {
        const ex = head.x + Math.cos(ang + side * 0.7) * 5;
        const ey = head.y + Math.sin(ang + side * 0.7) * 5;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, TAU);
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(ex + Math.cos(ang) * 1.2, ey + Math.sin(ang) * 1.2, 1.5, 0, TAU);
        ctx.fill();
      }
    });
  }

  onDisable() {
    this.segments = [];
  }
}