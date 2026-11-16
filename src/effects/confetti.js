import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick, TAU } from '../core/utils.js';

const COLORS = ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9e00'];

/** Celebration confetti bursting from every click. */
export default class ConfettiEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.onCleanup(this.pointer.onDown((x, y) => {
      const n = Math.round(35 * this.intensity);
      this.ps.burst(x, y, n, () => {
        const ang = rand(-Math.PI, 0); // upward fan
        const speed = rand(3, 10);
        return {
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          shape: 'rect',
          size: rand(6, 12),
          decay: rand(0.008, 0.016),
          gravity: 0.25,
          drag: 0.985,
          spin: rand(-0.3, 0.3),
          angle: rand(0, TAU),
          color: pick(COLORS),
        };
      });
    }));
    this.draw((ctx, { dt }) => this.ps.update(ctx, dt));
  }

  onDisable() {
    this.ps?.clear();
  }
}