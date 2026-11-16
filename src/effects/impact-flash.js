import BaseEffect from '../core/base-effect.js';
import { rand, randInt, TAU } from '../core/utils.js';

/** Anime impact frame: quick invert flash + radial speed lines on click. */
export default class ImpactFlashEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-flash {
        0% { filter: invert(1) hue-rotate(180deg) contrast(1.4); }
        100% { filter: none; }
      }
      html.${k} { animation: ${k}-flash 0.12s steps(2); }
    `);
    this.lines = [];
    this._timer = 0;
    this.onCleanup(this.pointer.onDown((x, y) => this._impact(x, y)));
    this.onCleanup(() => clearTimeout(this._timer));
    this.draw((ctx, { dt }) => {
      for (const l of this.lines) {
        l.life -= 0.07 * dt;
        if (l.life <= 0) continue;
        ctx.globalAlpha = l.life;
        ctx.strokeStyle = l.dark ? '#111' : '#fff';
        ctx.lineWidth = l.width * l.life;
        ctx.beginPath();
        ctx.moveTo(l.x1, l.y1);
        ctx.lineTo(l.x2, l.y2);
        ctx.stroke();
      }
      this.lines = this.lines.filter((l) => l.life > 0);
      ctx.globalAlpha = 1;
    });
  }

  _impact(x, y) {
    const root = document.documentElement;
    root.classList.remove(this.id);
    void root.offsetWidth;
    root.classList.add(this.id);
    clearTimeout(this._timer);
    this._timer = setTimeout(() => root.classList.remove(this.id), 140);

    const n = Math.round(22 * this.intensity);
    for (let i = 0; i < n; i++) {
      const ang = rand(0, TAU);
      const inner = rand(60, 140);
      const outer = inner + rand(200, 600);
      this.lines.push({
        x1: x + Math.cos(ang) * inner,
        y1: y + Math.sin(ang) * inner,
        x2: x + Math.cos(ang) * outer,
        y2: y + Math.sin(ang) * outer,
        width: rand(1, 4),
        dark: randInt(0, 1) === 1,
        life: 1,
      });
    }
  }

  onDisable() {
    document.documentElement.classList.remove(this.id);
    this.lines = [];
  }
}