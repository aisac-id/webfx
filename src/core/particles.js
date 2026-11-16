import { TAU, clamp } from './utils.js';

/** One particle. Plain data + step/draw, driven by ParticleSystem. */
export class Particle {
  constructor(o = {}) {
    Object.assign(this, {
      x: 0, y: 0, vx: 0, vy: 0,
      life: 1, decay: 0.02,
      size: 3, grow: 0,
      color: '#ffffff',
      gravity: 0, drag: 1,
      shape: 'circle', glow: 0,
      angle: 0, spin: 0,
    }, o);
  }

  /** Advance one 60fps-normalized step; returns false when dead. */
  step(dt) {
    this.vx *= this.drag;
    this.vy = this.vy * this.drag + this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;
    this.size += this.grow * dt;
    this.angle += this.spin * dt;
    return this.life > 0 && this.size > 0.05;
  }

  draw(ctx) {
    const a = clamp(this.life, 0, 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = this.color;
    if (this.glow > 0) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.glow;
    }
    switch (this.shape) {
      case 'rect':
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        ctx.restore();
        break;
      case 'star': {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? this.size : this.size * 0.4;
          const ang = (i / 8) * TAU;
          ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }
      case 'streak':
        ctx.strokeStyle = this.color;
        ctx.lineWidth = Math.max(this.size * 0.3, 0.5);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2);
        ctx.stroke();
        break;
      case 'heart': {
        const s = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + s * 0.35);
        ctx.bezierCurveTo(this.x - s, this.y - s * 0.45,
          this.x - s * 0.5, this.y - s * 1.1, this.x, this.y - s * 0.35);
        ctx.bezierCurveTo(this.x + s * 0.5, this.y - s * 1.1,
          this.x + s, this.y - s * 0.45, this.x, this.y + s * 0.35);
        ctx.fill();
        break;
      }
      case 'petal':
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      case 'ring':
        ctx.strokeStyle = this.color;
        ctx.lineWidth = Math.max(this.size * 0.25, 0.6);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.87, this.size * 0.5);
        ctx.lineTo(-this.size * 0.87, this.size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      case 'spark':
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? this.size * 1.4 : this.size * 0.22;
          const ang = (i / 8) * TAU;
          ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      case 'bubble':
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.35, this.y - this.size * 0.35,
          this.size * 0.18, 0, TAU);
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, TAU);
        ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

/** Pool of particles with a single update+draw call per frame. */
export default class ParticleSystem {
  constructor() {
    this.items = [];
  }

  spawn(opts) {
    const p = new Particle(opts);
    this.items.push(p);
    return p;
  }

  burst(x, y, count, factory) {
    for (let i = 0; i < count; i++) {
      this.spawn({ x, y, ...factory(i) });
    }
  }

  /** Call once per frame from a canvas drawer. */
  update(ctx, dt) {
    this.items = this.items.filter((p) => p.step(dt));
    for (const p of this.items) p.draw(ctx);
  }

  get count() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}