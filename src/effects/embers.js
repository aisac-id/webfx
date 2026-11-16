import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick } from '../core/utils.js';

const HEAT = ['#ffba08', '#faa307', '#f48c06', '#e85d04', '#dc2f02'];

/** Hot embers rising from the bottom edge, flickering as they cool. */
export default class EmbersEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.draw((ctx, { w, h, dt }) => {
      const n = Math.random() < 0.5 * this.intensity ? 2 : 0;
      this.ps.burst(0, 0, n, () => ({
        x: rand(0, w),
        y: h + 6,
        vx: rand(-0.4, 0.4),
        vy: rand(-2.2, -0.8),
        size: rand(1, 3),
        decay: rand(0.003, 0.008),
        drag: 0.999,
        color: pick(HEAT),
        glow: 10,
      }));
      ctx.globalCompositeOperation = 'lighter';
      this.ps.update(ctx, dt);
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.ps?.clear();
  }
}