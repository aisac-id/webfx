import BaseEffect from '../core/base-effect.js';
import { rand, TAU } from '../core/utils.js';

/**
 * A singularity at the cursor: ambient particles orbit and spiral
 * inward, getting stretched and swallowed at the event horizon.
 */
export default class BlackHoleEffect extends BaseEffect {
  async onEnable() {
    this.motes = [];
    this.draw((ctx, { w, h, dt }) => {
      const cx = this.pointer.x;
      const cy = this.pointer.y;
      const target = Math.round(90 * this.intensity);
      while (this.motes.length < target) {
        const ang = rand(0, TAU);
        const dist = rand(120, Math.max(w, h) * 0.6);
        this.motes.push({
          x: cx + Math.cos(ang) * dist,
          y: cy + Math.sin(ang) * dist,
          size: rand(0.8, 2.4),
          hue: rand(180, 320),
        });
      }
      // Accretion glow
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 60);
      g.addColorStop(0, 'rgba(0,0,0,0.95)');
      g.addColorStop(0.35, 'rgba(120,60,255,0.35)');
      g.addColorStop(1, 'rgba(120,60,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, TAU);
      ctx.fill();

      ctx.globalCompositeOperation = 'lighter';
      this.motes = this.motes.filter((m) => {
        const dx = cx - m.x;
        const dy = cy - m.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = 90 / dist;
        // Radial pull + tangential swirl = spiral.
        m.x += ((dx / dist) * pull + (-dy / dist) * 2.2) * dt;
        m.y += ((dy / dist) * pull + (dx / dist) * 2.2) * dt;
        if (dist < 10) return false;
        const a = Math.min(1, 160 / dist);
        ctx.fillStyle = `hsla(${m.hue}, 90%, 70%, ${a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * Math.min(1, dist / 60), 0, TAU);
        ctx.fill();
        return true;
      });
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.motes = [];
  }
}