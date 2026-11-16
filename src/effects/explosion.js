import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick, TAU } from '../core/utils.js';

const COLORS = ['#ffdd55', '#ff9933', '#ff5522', '#ffcc88', '#ffffff'];

/** Fiery particle blast + expanding shockwave ring on every click. */
export default class ExplosionEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.rings = [];
    this.onCleanup(this.pointer.onDown((x, y) => this._blast(x, y)));
    this.draw((ctx, { dt }) => {
      for (const r of this.rings) {
        r.radius += r.speed * dt;
        r.life -= 0.04 * dt;
        if (r.life <= 0) continue;
        ctx.globalAlpha = r.life * 0.8;
        ctx.strokeStyle = '#ffaa44';
        ctx.lineWidth = 3 * r.life;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, TAU);
        ctx.stroke();
      }
      this.rings = this.rings.filter((r) => r.life > 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      this.ps.update(ctx, dt);
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  _blast(x, y) {
    const n = Math.round(45 * this.intensity);
    this.ps.burst(x, y, n, () => {
      const ang = rand(0, TAU);
      const speed = rand(1, 9);
      return {
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: rand(1.5, 4.5),
        decay: rand(0.015, 0.04),
        gravity: 0.12,
        drag: 0.96,
        color: pick(COLORS),
        glow: 12,
      };
    });
    this.rings.push({ x, y, radius: 4, speed: 7, life: 1 });
  }

  onDisable() {
    this.ps?.clear();
    this.rings = [];
  }
}