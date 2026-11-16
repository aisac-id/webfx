import BaseEffect from '../core/base-effect.js';
import { TAU } from '../core/utils.js';

/** Concentric water rings expanding from each click. */
export default class RippleEffect extends BaseEffect {
  async onEnable() {
    this.rings = [];
    this.onCleanup(this.pointer.onDown((x, y) => {
      for (let i = 0; i < 3; i++) {
        this.rings.push({ x, y, radius: 2 + i * 10, life: 1 - i * 0.15 });
      }
    }));
    this.draw((ctx, { dt }) => {
      ctx.strokeStyle = '#66ccff';
      for (const r of this.rings) {
        r.radius += 3.2 * dt * this.intensity;
        r.life -= 0.022 * dt;
        if (r.life <= 0) continue;
        ctx.globalAlpha = r.life * 0.7;
        ctx.lineWidth = 2.5 * r.life + 0.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, TAU);
        ctx.stroke();
      }
      this.rings = this.rings.filter((r) => r.life > 0);
      ctx.globalAlpha = 1;
    });
  }

  onDisable() {
    this.rings = [];
  }
}