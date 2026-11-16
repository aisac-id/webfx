import BaseEffect from '../core/base-effect.js';
import { TAU } from '../core/utils.js';

/** Retro synthwave sun with stripe gaps + scrolling perspective grid. */
export default class SynthwaveEffect extends BaseEffect {
  async onEnable() {
    this.draw((ctx, { w, h, t }) => {
      const horizon = h * 0.68;
      const sunR = Math.min(w, h) * 0.16;
      const sunX = w / 2;
      const sunY = horizon - sunR * 0.25;
      // Sun
      const g = ctx.createLinearGradient(0, sunY - sunR, 0, sunY + sunR);
      g.addColorStop(0, 'rgba(255,220,90,0.85)');
      g.addColorStop(0.55, 'rgba(255,90,140,0.85)');
      g.addColorStop(1, 'rgba(190,40,200,0.85)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, TAU);
      ctx.fill();
      // Stripe gaps across the lower half of the sun
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 5; i++) {
        const y = sunY + sunR * (0.1 + i * 0.18);
        ctx.fillRect(sunX - sunR - 2, y, sunR * 2 + 4, 2 + i * 1.6);
      }
      ctx.restore();
      // Horizon glow line
      ctx.fillStyle = 'rgba(255,60,180,0.5)';
      ctx.fillRect(0, horizon - 1, w, 2);
      // Perspective grid below the horizon
      ctx.strokeStyle = 'rgba(255,60,200,0.4)';
      ctx.lineWidth = 1;
      const rows = 12;
      const scroll = (t * 0.00012 * this.intensity) % 1;
      for (let i = 0; i < rows; i++) {
        const p = (i + scroll) / rows;
        const y = horizon + (h - horizon) * p * p;
        ctx.globalAlpha = 0.25 + p * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.5;
      const cols = 18;
      for (let i = 0; i <= cols; i++) {
        const x = (i / cols) * w;
        ctx.beginPath();
        ctx.moveTo(w / 2 + (x - w / 2) * 0.08, horizon);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }
}