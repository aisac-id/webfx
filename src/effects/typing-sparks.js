import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick, TAU } from '../core/utils.js';

const SPARK = ['#22d3ee', '#67e8f9', '#a5f3fc', '#ffffff'];

/** Every keypress spits a small fan of cyan sparks at the cursor. */
export default class TypingSparksEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.listen(window, 'keydown', () => {
      const n = Math.max(2, Math.round(5 * this.intensity));
      this.ps.burst(this.pointer.x, this.pointer.y, n, () => {
        const ang = rand(-Math.PI, 0);
        const speed = rand(1.5, 4.5);
        return {
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          shape: 'streak',
          size: rand(1.5, 3),
          decay: rand(0.05, 0.09),
          gravity: 0.15,
          color: pick(SPARK),
          glow: 8,
        };
      });
    }, { capture: true, passive: true });
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