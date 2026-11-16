/**
 * One shared fullscreen canvas for ALL canvas-based effects.
 * A single requestAnimationFrame loop drives every registered drawer.
 * Performance features:
 *   - loop fully pauses while the tab is hidden
 *   - adaptive resolution: drops to 1x DPR if sustained FPS is low
 */
export default class CanvasLayer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.drawers = new Map();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._raf = 0;
    this._last = 0;
    this._slowFrames = 0;
    this._onResize = () => this._resize();
    this._onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(this._raf);
        this._raf = 0;
      } else if (this.canvas && !this._raf) {
        this._last = performance.now();
        this._raf = requestAnimationFrame(this._tick);
      }
    };
    this._tick = (t) => this._frame(t);
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
    document.addEventListener('visibilitychange', this._onVisibility);
    this._last = performance.now();
    if (!document.hidden) this._raf = requestAnimationFrame(this._tick);
  }

  _frame(t) {
    if (!this.canvas) return;
    const raw = t - this._last;
    // dt normalized to 60fps units so speeds are frame-rate independent.
    const dt = Math.min(raw / 16.667, 3);
    this._last = t;
    this._adaptQuality(raw);
    const { ctx, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const env = { w: window.innerWidth, h: window.innerHeight, dt, t };
    for (const fn of this.drawers.values()) {
      ctx.save();
      try { fn(ctx, env); } catch { /* keep other effects alive */ }
      ctx.restore();
    }
    this._raf = requestAnimationFrame(this._tick);
  }

  /** After ~2s below 30fps, halve resolution to recover smoothness. */
  _adaptQuality(rawMs) {
    if (this.dpr <= 1) return;
    this._slowFrames = rawMs > 33 ? this._slowFrames + 1 : 0;
    if (this._slowFrames > 60) {
      this.dpr = 1;
      this._slowFrames = 0;
      this._resize();
    }
  }

  _resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
  }

  _teardown() {
    cancelAnimationFrame(this._raf);
    this._raf = 0;
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
  }
}