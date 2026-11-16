import BaseEffect from '../core/base-effect.js';
import ParticleSystem from '../core/particles.js';
import { rand, randInt, TAU } from '../core/utils.js';

/** Auto-launched rockets that burst into colored sparks; click to launch. */
export default class FireworksEffect extends BaseEffect {
  async onEnable() {
    this.ps = new ParticleSystem();
    this.rockets = [];
    this.onCleanup(this.pointer.onDown((x, y) => this._launch(x, y)));
    this.every(1400, () => {
      if (Math.random() < 0.7 * this.intensity) {
        this._launch(
          rand(window.innerWidth * 0.15, window.innerWidth * 0.85),
          rand(window.innerHeight * 0.15, window.innerHeight * 0.45),
        );
      }
    });
    this.draw((ctx, { h, dt }) => {
      ctx.globalCompositeOperation = 'lighter';
      this.rockets = this.rockets.filter((r) => {
        r.y += r.vy * dt;
        r.vy *= 0.985;
        // Rocket trail
        this.ps.spawn({
          x: r.x + rand(-1, 1), y: r.y,
          vx: rand(-0.3, 0.3), vy: rand(0.3, 1),
          size: 1.4, decay: 0.06, color: '#ffcf99', glow: 6,
        });
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, TAU);
        ctx.fill();
        if (r.y <= r.targetY) {
          this._explode(r.x, r.y, r.hue);
          return false;
        }
        return r.y > -20;
      });
      this.ps.update(ctx, dt);
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  _launch(x, targetY) {
    this.rockets.push({
      x, y: window.innerHeight + 8,
      vy: -rand(9, 12), targetY,
      hue: randInt(0, 360),
    });
  }

  _explode(x, y, hue) {
    const n = Math.round(60 * this.intensity);
    this.ps.burst(x, y, n, () => {
      const ang = rand(0, TAU);
      const speed = rand(1, 6.5);
      return {
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: rand(1, 2.6),
        decay: rand(0.008, 0.02),
        gravity: 0.06,
        drag: 0.975,
        color: `hsl(${hue + rand(-20, 20)}, 100%, ${randInt(55, 75)}%)`,
        glow: 10,
      };
    });
  }

  onDisable() {
    this.rockets = [];
    this.ps?.clear();
  }
}