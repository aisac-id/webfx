import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, pick, TAU } from '../core/utils.js';

const PASTEL = ['#ffd6e8', '#c9f0ff', '#fff5ba', '#d8ffd6', '#e8d6ff', '#ffffff'];

/** Twinkling pastel stars scattered along the cursor path. */
export default class SparkleTrailEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.onCleanup(this.pointer.onMove((x, y) => {
      if (Math.random() > 0.6 * this.intensity) return;
      this.ps.spawn({
        x: x + rand(-8, 8),
        y: y + rand(-8, 8),
        vx: rand(-0.5, 0.5),
        vy: rand(-0.8, 0.2),
        shape: 'star',
        size: rand(2, 6),
        grow: -0.05,
        decay: rand(0.02, 0.045),
        spin: rand(-0.15, 0.15),
        angle: rand(0, TAU),
        color: pick(PASTEL),
        glow: 10,
      });
    }));
    this.draw((ctx, { dt }) => this.ps.update(ctx, dt));
  }

  onDisable() {
    this.ps?.clear();
  }
}