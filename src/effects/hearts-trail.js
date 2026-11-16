import BaseEffect from '../core/base-effect.js';
import { rand, pick } from '../core/utils.js';

const PINK = ['#ff8fab', '#ffb3c6', '#fb6f92', '#ffc2d1'];

/** Soft pink hearts floating up from the cursor path. */
export default class HeartsTrailEffect extends BaseEffect {
  async onEnable() {
    this.hearts = [];
    this.onCleanup(this.pointer.onMove((x, y) => {
      if (Math.random() > 0.35 * this.intensity) return;
      if (this.hearts.length > 60) this.hearts.shift();
      this.hearts.push({
        x: x + rand(-6, 6), y: y + rand(-6, 6),
        vx: rand(-0.4, 0.4), vy: rand(-1.6, -0.7),
        size: rand(4, 9), life: 1,
        color: pick(PINK), wob: rand(0, 6),
      });
    }));
    this.draw((ctx, { dt, t }) => {
      for (const h of this.hearts) {
        h.x += (h.vx + Math.sin(t / 400 + h.wob) * 0.3) * dt;
        h.y += h.vy * dt;
        h.life -= 0.018 * dt;
        if (h.life <= 0) continue;
        ctx.globalAlpha = h.life;
        ctx.fillStyle = h.color;
        this._heart(ctx, h.x, h.y, h.size);
      }
      this.hearts = this.hearts.filter((h) => h.life > 0);
      ctx.globalAlpha = 1;
    });
  }

  _heart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y - s * 0.45, x - s * 0.5, y - s * 1.1, x, y - s * 0.35);
    ctx.bezierCurveTo(x + s * 0.5, y - s * 1.1, x + s, y - s * 0.45, x, y + s * 0.35);
    ctx.closePath();
    ctx.fill();
  }

  onDisable() {
    this.hearts = [];
  }
}