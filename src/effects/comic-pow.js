import BaseEffect from '../core/base-effect.js';
import { rand, pick } from '../core/utils.js';

const WORDS = ['POW!', 'BAM!', 'BOOM!', 'ZAP!', 'WHAM!', 'KRAK!'];
const COLORS = ['#ffd166', '#ff6b6b', '#4cc9f0', '#95e06c'];

/** Comic-book word bursts popping out of every click. */
export default class ComicPowEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-pop {
        0% { transform: translate(-50%,-50%) scale(0.2) rotate(var(--rot)); opacity: 0; }
        18% { transform: translate(-50%,-50%) scale(1.25) rotate(var(--rot)); opacity: 1; }
        30% { transform: translate(-50%,-50%) scale(1) rotate(var(--rot)); }
        75% { opacity: 1; }
        100% { transform: translate(-50%,-60%) scale(1.05) rotate(var(--rot)); opacity: 0; }
      }
      .${k} {
        position: fixed; z-index: 2147483647; pointer-events: none;
        padding: 8px 16px; border: 3px solid #111; border-radius: 14px;
        font: 900 22px 'Comic Sans MS', 'Arial Black', sans-serif;
        color: #111; letter-spacing: 1px;
        box-shadow: 4px 4px 0 #111;
        animation: ${k}-pop 0.7s ease forwards;
      }
    `);
    this.live = 0;
    this.onCleanup(this.pointer.onDown((x, y) => this._pop(x, y)));
  }

  _pop(x, y) {
    if (this.live >= 6) return; // hard cap on concurrent DOM bursts
    this.live++;
    const el = document.createElement('div');
    el.className = this.id;
    el.textContent = pick(WORDS);
    el.style.left = `${x + rand(-14, 14)}px`;
    el.style.top = `${y + rand(-24, -8)}px`;
    el.style.background = pick(COLORS);
    el.style.setProperty('--rot', `${rand(-12, 12)}deg`);
    this.node(el);
    setTimeout(() => {
      el.remove();
      this.live--;
    }, 720);
  }

  onDisable() {
    this.live = 0;
  }
}