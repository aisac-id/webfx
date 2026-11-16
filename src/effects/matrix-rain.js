import BaseEffect from '../core/base-effect.js';
import { rand, randInt } from '../core/utils.js';

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFXYZ';

/** Classic green digital rain of falling glyph columns. */
export default class MatrixRainEffect extends BaseEffect {
  async onEnable() {
    this.fontSize = 16;
    this.columns = [];
    this._lastW = 0;
    this.draw((ctx, { w, h, dt }) => {
      if (w !== this._lastW) {
        this._lastW = w;
        const n = Math.ceil(w / this.fontSize);
        this.columns = Array.from({ length: n }, () => ({
          y: rand(-h, 0),
          speed: rand(2, 7),
        }));
      }
      // Dim translucent wash creates the fading trail.
      ctx.fillStyle = 'rgba(0, 10, 2, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${this.fontSize}px monospace`;
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        col.y += col.speed * dt * this.intensity;
        if (col.y > h + 200) {
          col.y = rand(-300, 0);
          col.speed = rand(2, 7);
        }
        const x = i * this.fontSize;
        const ch = GLYPHS[randInt(0, GLYPHS.length - 1)];
        ctx.fillStyle = '#b6ffb6';
        ctx.fillText(ch, x, col.y);
        ctx.fillStyle = 'rgba(0, 220, 70, 0.8)';
        ctx.fillText(GLYPHS[randInt(0, GLYPHS.length - 1)], x, col.y - this.fontSize);
        ctx.fillStyle = 'rgba(0, 160, 50, 0.45)';
        ctx.fillText(GLYPHS[randInt(0, GLYPHS.length - 1)], x, col.y - this.fontSize * 2);
      }
    });
  }

  onDisable() {
    this.columns = [];
  }
}