import BaseEffect from '../core/base-effect.js';
import { TAU } from '../core/utils.js';

/** Slow northern-light ribbons waving across the upper page. */
export default class AuroraEffect extends BaseEffect {
  async onEnable() {
    this.bands = [
      { hue: 140, y: 0.18, amp: 40, speed: 0.00022, width: 90 },
      { hue: 170, y: 0.28, amp: 55, speed: 0.00017, width: 120 },
      { hue: 280, y: 0.12, amp: 30, speed: 0.0003, width: 70 },
    ];
    this.draw((ctx, { w, h, t }) => {
      ctx.globalCompositeOperation = 'screen';
      for (const b of this.bands) {
        const baseY = h * b.y;
        const grad = ctx.createLinearGradient(0, baseY - b.width, 0, baseY + b.width);
        grad.addColorStop(0, `hsla(${b.hue}, 90%, 60%, 0)`);
        grad.addColorStop(0.5, `hsla(${b.hue}, 90%, 60%, ${0.16 * this.intensity})`);
        grad.addColorStop(1, `hsla(${b.hue}, 90%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 24) {
          const y = baseY + Math.sin(x * 0.004 + t * b.speed * 1000) * b.amp
            + Math.sin(x * 0.0013 - t * b.speed * 600) * b.amp * 0.6;
          ctx.lineTo(x, y - b.width);
        }
        for (let x = w; x >= 0; x -= 24) {
          const y = baseY + Math.sin(x * 0.004 + t * b.speed * 1000) * b.amp
            + Math.sin(x * 0.0013 - t * b.speed * 600) * b.amp * 0.6;
          ctx.lineTo(x, y + b.width);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    });
  }
}