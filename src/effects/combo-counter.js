import BaseEffect from '../core/base-effect.js';

/** Fighting-game style combo counter that racks up while you click. */
export default class ComboCounterEffect extends BaseEffect {
  async onEnable() {
    const k = this.id;
    this.style(`
      .${k} {
        position: fixed; top: 14vh; right: 4vw; z-index: 2147483647;
        pointer-events: none; text-align: right; opacity: 0;
        transition: opacity 0.25s;
        font-family: 'Arial Black', system-ui, sans-serif;
      }
      .${k} .n {
        font-size: 52px; font-weight: 900; line-height: 1;
        color: #ffd166; -webkit-text-stroke: 2px #7a2d00;
        text-shadow: 0 4px 0 rgba(0,0,0,0.35);
      }
      .${k} .label {
        font-size: 15px; font-weight: 900; letter-spacing: 4px;
        color: #fff; -webkit-text-stroke: 0.6px #333;
      }
      @keyframes ${k}-punch {
        0% { transform: scale(1.6) rotate(-4deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
      .${k}.punch .n { animation: ${k}-punch 0.18s ease; }
    `);
    this.box = document.createElement('div');
    this.box.className = k;
    this.nEl = document.createElement('div');
    this.nEl.className = 'n';
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = 'COMBO';
    this.box.append(this.nEl, label);
    this.node(this.box);
    this.count = 0;
    this._timer = 0;
    this.onCleanup(this.pointer.onDown(() => this._hit()));
    this.onCleanup(() => clearTimeout(this._timer));
  }

  _hit() {
    this.count++;
    this.nEl.textContent = `x${this.count}`;
    // Color tiers like a real fighting game.
    const tier = this.count >= 30 ? '#ff4d6d' : this.count >= 15 ? '#ff9e00'
      : this.count >= 5 ? '#ffd166' : '#ffffff';
    this.nEl.style.color = tier;
    this.box.style.opacity = '1';
    this.box.classList.remove('punch');
    void this.box.offsetWidth;
    this.box.classList.add('punch');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this.box.style.opacity = '0';
      this.count = 0;
    }, 1300);
  }

  onDisable() {
    this.count = 0;
  }
}