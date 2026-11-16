import EFFECTS, { CATEGORIES } from '../core/registry.js';

/** Popup controller: renders the catalog and persists toggle state. */
class PopupController {
  constructor() {
    this.enabled = {};
    this.query = '';
    this.listEl = document.getElementById('list');
    this.countEl = document.getElementById('active-count');
    this.searchEl = document.getElementById('search');
    this.intensityEl = document.getElementById('intensity');
    this.intensityValueEl = document.getElementById('intensity-value');
  }

  async init() {
    const data = await chrome.storage.sync.get(['enabled', 'intensity']);
    this.enabled = data.enabled ?? {};
    const intensity = data.intensity ?? 1;
    this.intensityEl.value = String(intensity);
    this.intensityValueEl.textContent = `${Number(intensity).toFixed(1)}x`;

    this.searchEl.addEventListener('input', () => {
      this.query = this.searchEl.value.trim().toLowerCase();
      this.render();
    });
    this.intensityEl.addEventListener('input', () => {
      const v = Number(this.intensityEl.value);
      this.intensityValueEl.textContent = `${v.toFixed(1)}x`;
      chrome.storage.sync.set({ intensity: v });
    });
    document.getElementById('disable-all').addEventListener('click', () => {
      this.enabled = {};
      chrome.storage.sync.set({ enabled: {} });
      this.render();
    });
    this.render();
  }

  toggle(id) {
    this.enabled = { ...this.enabled, [id]: !this.enabled[id] };
    chrome.storage.sync.set({ enabled: this.enabled });
    this.render();
  }

  render() {
    this.listEl.textContent = '';
    let shown = 0;
    for (const cat of CATEGORIES) {
      const items = EFFECTS.filter((e) =>
        e.category === cat.id &&
        (!this.query ||
          e.name.toLowerCase().includes(this.query) ||
          e.desc.toLowerCase().includes(this.query)));
      if (items.length === 0) continue;
      shown += items.length;

      const heading = document.createElement('div');
      heading.className = 'category';
      heading.textContent = cat.name;
      this.listEl.appendChild(heading);

      for (const entry of items) {
        this.listEl.appendChild(this._card(entry));
      }
    }
    if (shown === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No effects match your search.';
      this.listEl.appendChild(empty);
    }
    const active = EFFECTS.filter((e) => this.enabled[e.id]).length;
    this.countEl.textContent = `${active} effect${active === 1 ? '' : 's'} active`;
  }

  _card(entry) {
    const card = document.createElement('div');
    card.className = `card${this.enabled[entry.id] ? ' on' : ''}`;
    card.setAttribute('role', 'switch');
    card.setAttribute('aria-checked', String(!!this.enabled[entry.id]));
    card.tabIndex = 0;

    const info = document.createElement('div');
    info.className = 'info';
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = entry.name;
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = entry.desc;
    info.append(name, desc);

    const sw = document.createElement('div');
    sw.className = 'switch';

    card.append(info, sw);
    card.addEventListener('click', () => this.toggle(entry.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(entry.id);
      }
    });
    return card;
  }
}

new PopupController().init();