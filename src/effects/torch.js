import BaseEffect from '../core/base-effect.js';

/**
 * The page goes dark; the cursor carries a warm torch.
 * Pure CSS overlay updated on pointermove (throttled to one write
 * per animation frame) - no canvas work at all.
 */
export default class TorchEffect extends BaseEffect {
  async onEnable() {
    this.dark = this.overlay('transition:opacity 0.5s;opacity:0;');
    this._pending = false;
    this._paint(this.pointer.x, this.pointer.y);
    requestAnimationFrame(() => { this.dark.style.opacity = '1'; });
    this.onCleanup(this.pointer.onMove((x, y) => {
      if (this._pending) return;
      this._pending = true;
      requestAnimationFrame(() => {
        this._pending = false;
        this._paint(x, y);
      });
    }));
  }

  _paint(x, y) {
    const r = 190 * this.intensity;
    this.dark.style.background =
      `radial-gradient(circle ${r}px at ${x}px ${y}px,` +
      'rgba(255,190,90,0.10) 0%,' +
      'rgba(20,12,4,0.25) 45%,' +
      'rgba(5,4,2,0.88) 100%)';
  }
}