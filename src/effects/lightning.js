import BaseEffect from '../core/base-effect.js';
import { rand, randInt } from '../core/utils.js';

/** Random sky flashes with jagged, glowing lightning bolts. */
export default class LightningEffect extends BaseEffect {
  async onEnable() {
    this.flash = this.overlay('background:#eaf2ff;opacity:0;transition:opacity 0.08s;');
    this.bolt = null;
    this.boltLife = 0;
    this._schedule();
    this.draw((ctx, { dt }) => {
      if (!this.bolt || this.boltLife <= 0) return;
      this.boltLife -= 0.06 * dt;
      ctx.globalAlpha = Math.max(this.boltLife, 0);
      ctx.strokeStyle = '#dceaff';
      ctx.shadowColor = '#88aaff';
      ctx.shadowBlur = 22;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.bolt[0].x, this.bolt[0].y);
      for (const p of this.bolt) ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    });
  }

  _schedule() {
    this.every(randInt(2500, 6000), () => this._strike());
  }

  _strike() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const points = [];
    let x = rand(w * 0.15, w * 0.85);
    let y = -10;
    const endY = rand(h * 0.4, h * 0.85);
    while (y < endY) {
      points.push({ x, y });
      y += rand(20, 55);
      x += rand(-45, 45);
    }
    this.bolt = points;
    this.boltLife = 1;
    // Double flash like a real strike.
    this.flash.style.opacity = String(0.55 * this.intensity);
    setTimeout(() => { this.flash.style.opacity = '0'; }, 90);
    setTimeout(() => { this.flash.style.opacity = String(0.3 * this.intensity); }, 180);
    setTimeout(() => { this.flash.style.opacity = '0'; }, 280);
  }

  onDisable() {
    this.bolt = null;
  }
}