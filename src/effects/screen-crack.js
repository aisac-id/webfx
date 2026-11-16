import BaseEffect from '../core/base-effect.js';
import { rand, randInt, TAU } from '../core/utils.js';

/** Clicks leave jagged glass-crack lines that slowly fade out. */
export default class ScreenCrackEffect extends BaseEffect {
  async onEnable() {
    this.cracks = [];
    this.onCleanup(this.pointer.onDown((x, y) => this._crack(x, y)));
    this.draw((ctx, { dt }) => {
      for (const c of this.cracks) {
        c.life -= 0.006 * dt;
        if (c.life <= 0) continue;
        for (const line of c.lines) {
          ctx.globalAlpha = c.life * 0.9;
          ctx.strokeStyle = 'rgba(20,20,30,0.8)';
          ctx.lineWidth = 2.4;
          this._path(ctx, line);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(230,240,255,0.9)';
          ctx.lineWidth = 1;
          this._path(ctx, line);
          ctx.stroke();
        }
        // Impact point
        ctx.globalAlpha = c.life;
        ctx.fillStyle = 'rgba(240,245,255,0.9)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, TAU);
        ctx.fill();
      }
      this.cracks = this.cracks.filter((c) => c.life > 0);
      ctx.globalAlpha = 1;
    });
  }

  _crack(x, y) {
    if (this.cracks.length >= 5) this.cracks.shift();
    const lines = [];
    const n = randInt(5, 8);
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * TAU + rand(-0.3, 0.3);
      const pts = [{ x, y }];
      let px = x;
      let py = y;
      let a = ang;
      const segs = randInt(3, 6);
      for (let s = 0; s < segs; s++) {
        const len = rand(14, 42);
        a += rand(-0.5, 0.5);
        px += Math.cos(a) * len;
        py += Math.sin(a) * len;
        pts.push({ x: px, y: py });
      }
      lines.push(pts);
    }
    this.cracks.push({ x, y, lines, life: 1 });
  }

  _path(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (const p of pts) ctx.lineTo(p.x, p.y);
  }

  onDisable() {
    this.cracks = [];
  }
}