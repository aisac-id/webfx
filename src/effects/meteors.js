import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Shooting stars streaking diagonally with glowing gradient tails. */
export default class MeteorsEffect extends BaseEffect {
  async onEnable() {
    this.meteors = [];
    this.draw((ctx, { w, h, dt }) => {
      if (Math.random() < 0.02 * this.intensity && this.meteors.length < 6) {
        const speed = rand(9, 16);
        const ang = rand(Math.PI * 0.62, Math.PI * 0.78); // down-left
        this.meteors.push({
          x: rand(w * 0.3, w * 1.2),
          y: rand(-40, h * 0.3),
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          len: rand(90, 190),
          life: 1,
        });
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const m of this.meteors) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= 0.008 * dt;
        if (m.life <= 0) continue;
        const norm = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / norm) * m.len;
        const ty = m.y - (m.vy / norm) * m.len;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${m.life})`);
        g.addColorStop(0.3, `rgba(140,190,255,${m.life * 0.6})`);
        g.addColorStop(1, 'rgba(140,190,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${m.life})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.2, 0, TAU);
        ctx.fill();
      }
      this.meteors = this.meteors.filter(
        (m) => m.life > 0 && m.y < h + 200 && m.x > -250);
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.meteors = [];
  }
}