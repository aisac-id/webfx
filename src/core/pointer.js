/**
 * Shared pointer tracker. Installed once per page; every effect subscribes
 * to it instead of attaching its own global listeners.
 */
export default class Pointer {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.down = false;
    this._moveSubs = new Set();
    this._downSubs = new Set();
    this._upSubs = new Set();
    this._installed = false;
  }

  install() {
    if (this._installed) return;
    this._installed = true;
    const opts = { capture: true, passive: true };
    window.addEventListener('pointermove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      for (const fn of this._moveSubs) fn(this.x, this.y, e);
    }, opts);
    window.addEventListener('pointerdown', (e) => {
      this.down = true;
      this.x = e.clientX;
      this.y = e.clientY;
      for (const fn of this._downSubs) fn(this.x, this.y, e);
    }, opts);
    window.addEventListener('pointerup', (e) => {
      this.down = false;
      for (const fn of this._upSubs) fn(this.x, this.y, e);
    }, opts);
  }

  /** Each subscribe method returns an unsubscribe function. */
  onMove(fn) {
    this._moveSubs.add(fn);
    return () => this._moveSubs.delete(fn);
  }

  onDown(fn) {
    this._downSubs.add(fn);
    return () => this._downSubs.delete(fn);
  }

  onUp(fn) {
    this._upSubs.add(fn);
    return () => this._upSubs.delete(fn);
  }
}