import { uid } from './utils.js';

/**
 * Abstract base class for every effect.
 * Handles lifecycle + resource cleanup so disabling an effect always
 * removes every listener, timer, DOM node and canvas drawer it created.
 *
 * Subclasses implement onEnable() and optionally onDisable().
 */
export default class BaseEffect {
  constructor(app) {
    this.app = app;
    this.pointer = app.pointer;
    this.canvasLayer = app.canvas;
    this.settings = app.settings;
    this.id = uid();
    this._cleanups = [];
    this._nodes = [];
    this._canvasRelease = null;
  }

  /** Global intensity multiplier (0.2 - 2) from the popup slider. */
  get intensity() {
    return this.settings.intensity ?? 1;
  }

  async enable() {
    await this.onEnable();
  }

  disable() {
    for (const fn of this._cleanups) fn();
    this._cleanups = [];
    if (this._canvasRelease) {
      this._canvasRelease();
      this._canvasRelease = null;
    }
    for (const node of this._nodes) node.remove();
    this._nodes = [];
    this.onDisable();
  }

  /** Event listener that is auto-removed on disable. */
  listen(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this._cleanups.push(() => target.removeEventListener(type, fn, opts));
  }

  /** Interval that is auto-cleared on disable. */
  every(ms, fn) {
    const id = setInterval(fn, ms);
    this._cleanups.push(() => clearInterval(id));
  }

  /** Register a per-frame canvas drawer on the shared canvas layer. */
  draw(fn) {
    this._canvasRelease = this.canvasLayer.acquire(this, fn);
  }

  /** Inject a <style> element, auto-removed on disable. */
  style(css) {
    const el = document.createElement('style');
    el.textContent = css;
    document.documentElement.appendChild(el);
    this._nodes.push(el);
    return el;
  }

  /** Track any DOM node for auto-removal on disable. */
  node(el, parent = document.documentElement) {
    parent.appendChild(el);
    this._nodes.push(el);
    return el;
  }

  /** Fullscreen click-through overlay div. */
  overlay(extraCss = '') {
    const d = document.createElement('div');
    d.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:2147483645;' + extraCss;
    return this.node(d);
  }

  /** Add an arbitrary cleanup callback. */
  onCleanup(fn) {
    this._cleanups.push(fn);
  }

  async onEnable() {}

  onDisable() {}
}