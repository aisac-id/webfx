/**
 * One shared fullscreen canvas for ALL canvas-based effects.
 * A single requestAnimationFrame loop drives every registered drawer,
 * so 10 active effects still cost only one RAF and one composite layer.
 */
export default class CanvasLayer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.drawers = new Map();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._raf = 0;
    this._last = 0;
    this._onResize = () => this._resize();
  }

  /** Register a draw callback; returns a release function. */
  acquire(owner, drawFn) {
    this.drawers.set(owner, drawFn);
    this._ensure();
    return () => this.release(owner);
  }

  release(owner) {
    this.drawers.delete(owner);
    if (this.drawers.size === 0) this._teardown();
  }

  _ensure() {
    if (this.canvas) return;
    const c = document.createElement('canvas');
    c.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;' +
      'z-index:2147483646;';
    document.documentElement.appendChild(c);
    this.canvas = c;
    this.ctx = c.getContext('2d');
    this._resize();
    window.addEventListener('resize', this._onResize, { passive: true });
    this._last = performance.now();
    const tick = (t) => {
      if (!this.canvas) return;
      // dt normalized to 60fps units so speeds are frame-rate independent.
      const dt = Math.min((t - this._last) / 16.667, 3);
      this._last = t;
      const { ctx, dpr } = this;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const env = { w: window.innerWidth, h: window.innerHeight, dt, t };
      for (const fn of this.drawers.values()) {
        ctx.save();
        try { fn(ctx, env); } catch { /* keep other effects alive */ }
        ctx.restore();
      }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
  }

  _teardown() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
  }
}