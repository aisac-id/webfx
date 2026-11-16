import BaseEffect from '../core/base-effect.js';
import { TAU } from '../core/utils.js';

/** Tiny planets orbiting the cursor like a pocket solar system. */
export default class OrbitPlanetsEffect extends BaseEffect {
  async onEnable() {
    this.planets = [
      { dist: 34, speed: 0.0022, r: 5, color: '#4cc9f0', phase: 0 },
      { dist: 56, speed: 0.0013, r: 7, color: '#ff9e00', phase: 2.1 },
      { dist: 82, speed: 0.0008, r: 4, color: '#b388ff', phase: 4.2 },
    ];
    this.draw((ctx, { t }) => {
      const cx = this.pointer.x;
      const cy = this.pointer.y;
      // Sun glow at the cursor
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      g.addColorStop(0, 'rgba(255,230,150,0.95)');
      g.addColorStop(1, 'rgba(255,180,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, TAU);
      ctx.fill();
      // Orbit rings
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      for (const p of this.planets) {
        ctx.beginPath();
        ctx.arc(cx, cy, p.dist, 0, TAU);
        ctx.stroke();
      }
      // Planets + tiny moons
      for (const p of this.planets) {
        const a = t * p.speed + p.phase;
        const x = cx + Math.cos(a) * p.dist;
        const y = cy + Math.sin(a) * p.dist;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
        const ma = t * p.speed * 4 + p.phase;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(x + Math.cos(ma) * (p.r + 5), y + Math.sin(ma) * (p.r + 5), 1.6, 0, TAU);
        ctx.fill();
      }
    });
  }

  onDisable() {
    this.planets = [];
  }
}