import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Rotating colored club beams from above + a pulsing dot dance floor. */
export default class DiscoEffect extends BaseEffect {
  async onEnable() {
    this.beams = Array.from({ length: 5 }, (_, i) => ({
      hue: i * 72,
      speed: rand(0.0004, 0.0009) * (i % 2 === 0 ? 1 : -1),
      phase: rand(0, TAU),
      originX: (i + 0.5) / 5,
    }));
    this.draw((ctx, { w, h, t }) => {
      ctx.globalCompositeOperation = 'screen';
      // Beams
      for (const b of this.beams) {
        const ox = w * b.originX;
        const ang = Math.PI / 2 + Math.sin(t * b.speed + b.phase) * 0.7;
        const len = h * 1.2;
        const spread = 0.09;
        const hue = (b.hue + t * 0.02) % 360;
        const g = ctx.createLinearGradient(ox, 0, ox, h);
        g.addColorStop(0, `hsla(${hue}, 95%, 60%, ${0.30 * this.intensity})`);
        g.addColorStop(1, `hsla(${hue}, 95%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(ox, -10);
        ctx.lineTo(ox + Math.cos(ang - spread) * len, Math.sin(ang - spread) * len);
        ctx.lineTo(ox + Math.cos(ang + spread) * len, Math.sin(ang + spread) * len);
        ctx.closePath();
        ctx.fill();
      }
      // Dance floor dots along the bottom
      const cols = Math.ceil(w / 60);
      const rows = 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pulse = Math.sin(t / 220 + c * 0.9 + r * 1.7);
          if (pulse < 0.2) continue;
          const hue = (c * 40 + r * 80 + t * 0.05) % 360;
          ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${pulse * 0.35})`;
          ctx.beginPath();
          ctx.arc(c * 60 + 30, h - 20 - r * 26, 5 + pulse * 3, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.beams = [];
  }
}