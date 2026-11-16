import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/** Translucent friendly ghosts bobbing across the page. */
export default class GhostsEffect extends BaseEffect {
  async onEnable() {
    this.ghosts = [];
    this.draw((ctx, { w, h, dt, t }) => {
      const target = Math.max(2, Math.round(4 * this.intensity));
      while (this.ghosts.length < target) {
        const dir = Math.random() < 0.5 ? 1 : -1;
        this.ghosts.push({
          x: dir === 1 ? rand(-w, -30) : rand(w + 30, w * 2),
          y: rand(h * 0.15, h * 0.75),
          dir, speed: rand(0.6, 1.4),
          size: rand(14, 26), phase: rand(0, TAU),
        });
      }
      if (this.ghosts.length > target) this.ghosts.length = target;
      for (const g of this.ghosts) {
        g.x += g.speed * g.dir * dt;
        if ((g.dir === 1 && g.x > w + 60) || (g.dir === -1 && g.x < -60)) {
          g.x = g.dir === 1 ? -60 : w + 60;
          g.y = rand(h * 0.15, h * 0.75);
        }
        const y = g.y + Math.sin(t / 800 + g.phase) * 14;
        const s = g.size;
        ctx.globalAlpha = 0.55 + Math.sin(t / 1200 + g.phase) * 0.12;
        ctx.fillStyle = '#f4f6ff';
        ctx.beginPath();
        ctx.arc(g.x, y, s, Math.PI, 0);
        // Wavy skirt
        const waves = 4;
        const bottom = y + s * 1.2;
        ctx.lineTo(g.x + s, bottom);
        for (let i = waves; i >= 0; i--) {
          const wx = g.x - s + (i / waves) * s * 2;
          const wy = bottom + (i % 2 === 0 ? -s * 0.22 : 0)
            + Math.sin(t / 300 + i + g.phase) * 2;
          ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.fill();
        // Eyes
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#2a2a3a';
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(g.x + side * s * 0.35 + g.dir * 2, y - s * 0.1,
            s * 0.12, s * 0.2, 0, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    });
  }

  onDisable() {
    this.ghosts = [];
  }
}