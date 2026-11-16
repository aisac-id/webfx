import BaseEffect from '../core/base-effect.js';
import { rand } from '../core/utils.js';

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E";

/** 1920s projector: sepia flicker, scratches, grain and cigarette burns. */
export default class OldFilmEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      @keyframes ${k}-flicker {
        0%, 100% { filter: sepia(0.85) contrast(1.15) brightness(0.95); }
        20% { filter: sepia(0.85) contrast(1.2) brightness(1.05); }
        40% { filter: sepia(0.85) contrast(1.1) brightness(0.88); }
        60% { filter: sepia(0.85) contrast(1.25) brightness(1); }
        80% { filter: sepia(0.85) contrast(1.12) brightness(0.9); }
      }
      html.${k} { animation: ${k}-flicker 0.5s steps(5) infinite; }
      @keyframes ${k}-grain {
        0% { background-position: 0 0; } 50% { background-position: -60px 40px; }
        100% { background-position: 45px -30px; }
      }
    `);
    document.documentElement.classList.add(k);
    this.onCleanup(() => document.documentElement.classList.remove(k));

    const grain = this.overlay(
      `background-image:url("${GRAIN_SVG}");opacity:0.13;mix-blend-mode:overlay;`,
    );
    grain.style.animation = `${k}-grain 0.3s steps(3) infinite`;
    this.overlay(
      'background:radial-gradient(ellipse at center,transparent 50%,rgba(30,15,0,0.6) 100%);',
    );
    // Vertical scratches that jump around
    this.scratches = [];
    for (let i = 0; i < 3; i++) {
      const s = this.overlay('width:1px;bottom:0;background:rgba(60,40,10,0.35);');
      this.scratches.push(s);
    }
    this.every(180, () => {
      for (const s of this.scratches) {
        const visible = Math.random() < 0.5;
        s.style.opacity = visible ? String(rand(0.2, 0.7)) : '0';
        s.style.left = `${rand(2, 98)}vw`;
        s.style.right = 'auto';
      }
    });
    // Cigarette burn cue mark, top-right, occasionally
    this.burn = this.overlay(
      'width:34px;height:34px;left:auto;bottom:auto;top:26px;right:30px;' +
      'border-radius:50%;opacity:0;' +
      'background:radial-gradient(circle,rgba(255,240,200,0.9) 20%,rgba(120,70,10,0.7) 45%,transparent 70%);',
    );
    this.every(4200, () => {
      this.burn.style.opacity = '1';
      setTimeout(() => { this.burn.style.opacity = '0'; }, 320);
    });
  }

  onDisable() {
    this.scratches = [];
  }
}