import BaseEffect from '../core/base-effect.js';
import ParticleSystem, { Particle } from '../core/particles.js';
import { PALETTES } from '../core/generator.js';
import { rand, pick, TAU } from '../core/utils.js';

const MOTE_PHYSICS = ['orbit', 'swirl', 'float'];
const MAX_PARTICLES = 380;

/**
 * The parametric engine: ONE class runs every generated preset
 * (any shape x palette x physics x emitter). Only this module is
 * loaded, no matter how many generated effects are active.
 */
export default class GeneratedEffect extends BaseEffect {
  constructor(app, preset) {
    super(app);
    this.p = preset;
  }

  async onEnable() {
    this.ps = new ParticleSystem();
    this.motes = [];
    this.colors = PALETTES[this.p.palette];
    const mote = MOTE_PHYSICS.includes(this.p.physics);
    if (this.p.emitter === 'cursor' && !mote) {
      this.onCleanup(this.pointer.onMove((x, y) => this._spawn(x, y, 2)));
    }
    if (this.p.emitter === 'click') {
      this.onCleanup(this.pointer.onDown((x, y) => this._burst(x, y)));
    }
    this.draw((ctx, env) => this._frame(ctx, env));
  }

  _base(x, y, extra = {}) {
    return {
      x, y,
      size: rand(this.p.size[0], this.p.size[1]),
      color: pick(this.colors),
      glow: this.p.glow,
      shape: this.p.shape,
      decay: rand(0.006, 0.018),
      spin: this.p.spin,
      angle: rand(0, TAU),
      ...extra,
    };
  }

  /** Initial velocity for ballistic physics at speed factor. */
  _velocity() {
    const s = this.p.speed;
    switch (this.p.physics) {
      case 'fall': return { vx: rand(-0.5, 0.5), vy: rand(0.6, 1.8) * s, gravity: 0.015 };
      case 'rise': return { vx: rand(-0.5, 0.5), vy: -rand(0.6, 1.8) * s, gravity: -0.008 };
      case 'rain': return { vx: 0.6 * s, vy: rand(6, 10) * s, gravity: 0.05 };
      case 'fountain': return { vx: rand(-2.2, 2.2), vy: -rand(3.5, 7) * s, gravity: 0.16 };
      default: {
        const a = rand(0, TAU);
        const v = rand(1, 5) * s;
        return { vx: Math.cos(a) * v, vy: Math.sin(a) * v, gravity: 0.05, drag: 0.97 };
      }
    }
  }

  _spawn(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.ps.spawn(this._base(x + rand(-6, 6), y + rand(-6, 6), this._velocity()));
    }
  }

  _burst(x, y) {
    const n = Math.round(28 * this.intensity);
    this.ps.burst(x, y, n, () => {
      const a = rand(0, TAU);
      const v = rand(1.5, 7) * this.p.speed;
      return this._base(0, 0, {
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        gravity: 0.08, drag: 0.97, decay: rand(0.01, 0.03),
      });
    });
  }

  _spawnPoint(em, w, h) {
    switch (em) {
      case 'bottom': return { x: rand(0, w), y: h + 8 };
      case 'top': return { x: rand(0, w), y: -8 };
      case 'center': return { x: w / 2 + rand(-50, 50), y: h / 2 + rand(-50, 50) };
      case 'edges': {
        const side = pick(['l', 'r', 't', 'b']);
        if (side === 'l') return { x: -8, y: rand(0, h) };
        if (side === 'r') return { x: w + 8, y: rand(0, h) };
        if (side === 't') return { x: rand(0, w), y: -8 };
        return { x: rand(0, w), y: h + 8 };
      }
      default: return { x: this.pointer.x, y: this.pointer.y };
    }
  }

  _frame(ctx, env) {
    const { w, h, dt } = env;
    const mote = MOTE_PHYSICS.includes(this.p.physics);
    if (!mote) {
      const em = this.p.emitter;
      if (em !== 'cursor' && em !== 'click' && this.ps.count < MAX_PARTICLES) {
        const rate = this.p.physics === 'rain' ? 4 : 2;
        const n = Math.random() < 0.8 * this.intensity ? rate : 0;
        for (let i = 0; i < n; i++) {
          const pt = this._spawnPoint(em, w, h);
          this._spawn(pt.x, pt.y, 1);
        }
      }
      if (this.p.physics === 'explode' && em !== 'click' && Math.random() < 0.018) {
        const pt = this._spawnPoint(em === 'cursor' ? 'center' : em, w, h);
        this._burst(pt.x, pt.y);
      }
      if (this.ps.count > MAX_PARTICLES) {
        this.ps.items.splice(0, this.ps.count - MAX_PARTICLES);
      }
    } else {
      this._motes(ctx, env);
    }
    if (this.p.additive) ctx.globalCompositeOperation = 'lighter';
    this.ps.update(ctx, dt);
    ctx.globalCompositeOperation = 'source-over';
  }

  /** Persistent motes for orbit / swirl / float physics. */
  _motes(ctx, { w, h, dt }) {
    const target = Math.round(60 * this.intensity);
    while (this.motes.length < target) {
      const m = {
        x: rand(0, w), y: rand(0, h),
        ang: rand(0, TAU), dist: rand(30, 220),
        speed: rand(0.01, 0.04) * this.p.speed,
        p: new Particle(this._base(0, 0, { decay: 0 })),
      };
      this.motes.push(m);
    }
    if (this.motes.length > target) this.motes.length = target;
    const cx = this.pointer.x;
    const cy = this.pointer.y;
    if (this.p.additive) ctx.globalCompositeOperation = 'lighter';
    for (const m of this.motes) {
      if (this.p.physics === 'orbit') {
        m.ang += m.speed * dt;
        m.x = cx + Math.cos(m.ang) * m.dist;
        m.y = cy + Math.sin(m.ang) * m.dist;
      } else if (this.p.physics === 'swirl') {
        m.ang += m.speed * 2.4 * dt;
        m.dist -= 0.7 * this.p.speed * dt;
        if (m.dist < 8) m.dist = rand(140, 260);
        m.x = cx + Math.cos(m.ang) * m.dist;
        m.y = cy + Math.sin(m.ang) * m.dist;
      } else {
        m.ang += rand(-0.12, 0.12) * dt;
        m.x += Math.cos(m.ang) * m.speed * 40 * dt;
        m.y += Math.sin(m.ang) * m.speed * 40 * dt;
        if (m.x < -12) m.x = w + 12;
        if (m.x > w + 12) m.x = -12;
        if (m.y < -12) m.y = h + 12;
        if (m.y > h + 12) m.y = -12;
      }
      m.p.x = m.x;
      m.p.y = m.y;
      m.p.angle += this.p.spin * dt;
      m.p.life = 1;
      m.p.draw(ctx);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  onDisable() {
    this.ps?.clear();
    this.motes = [];
  }
}