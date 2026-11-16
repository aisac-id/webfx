import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick } from '../core/utils.js';

const FLAME = ['#fff3b0', '#ffd166', '#ff9e00', '#ff5400', '#d00000'];

/** Rising flame particles emitted along the cursor path. */
export default class FireTrailEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.onCleanup(this.pointer.onMove((x, y) => {
      const n = Math.max(1, Math.round(3 * this.intensity));
      this.ps.burst(x, y, n, () => ({
        vx: rand(-0.6, 0.6),
        vy: rand(-2.4, -0.8),
        size: rand(2.5, 6),
        grow: -0.12,
        decay: rand(0.03, 0.06),
        color: pick(FLAME),
        glow: 14,
        drag: 0.98,
      }));
    }));
    this.draw((ctx, { dt }) => {
      ctx.globalCompositeOperation = 'lighter';
      this.ps.update(ctx, dt);
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  onDisable() {
    this.ps?.clear();
  }
}