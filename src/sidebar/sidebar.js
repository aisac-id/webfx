import EFFECTS, { CATEGORIES } from '../core/registry.js';
import ICONS from './icons.js';

/** Sidebar controller: icon-tab rail, filtered effect list, settings. */
class SidebarController {
  constructor() {
    this.enabled = {};
    this.category = 'all';
    this.query = '';
    this.railEl = document.getElementById('rail');
    this.listEl = document.getElementById('list');
    this.countEl = document.getElementById('active-count');
    this.titleEl = document.getElementById('section-title');
    this.sectionCountEl = document.getElementById('section-count');
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

    document.getElementById('close').innerHTML = ICONS.close;
    document.getElementById('search-ico').innerHTML = ICONS.search;
    document.getElementById('close').addEventListener('click', () => this._close());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });

    this._buildRail();
    this.searchEl.addEventListener('input', () => {
      this.query = this.searchEl.value.trim().toLowerCase();
      this.render();
    });
    this.intensityEl.addEventListener('input', () => {
      const v = Number(this.intensityEl.value);
      this.intensityValueEl.textContent = `${v.toFixed(1)}x`;
      chrome.storage.sync.set({ intensity: v });
    });
    this.render();
  }

  _close() {
    window.parent.postMessage({ webfx: 'close-sidebar' }, '*');
  }

  _buildRail() {
    const tabs = [{ id: 'all', name: 'All Effects' }, ...CATEGORIES];
    for (const tab of tabs) {
      const btn = document.createElement('button');
      btn.className = `rail-btn${tab.id === this.category ? ' active' : ''}`;
      btn.dataset.tab = tab.id;
      btn.title = tab.name;
      btn.innerHTML = ICONS[tab.id];
      const dot = document.createElement('span');
      dot.className = 'dot';
      btn.appendChild(dot);
      btn.addEventListener('click', () => this.setCategory(tab.id));
      this.railEl.appendChild(btn);
    }
    const spacer = document.createElement('div');
    spacer.className = 'rail-spacer';
    this.railEl.appendChild(spacer);

    const off = document.createElement('button');
    off.className = 'rail-btn power';
    off.title = 'Turn all effects off';
    off.innerHTML = ICONS.power;
    off.addEventListener('click', () => {
      this.enabled = {};
      chrome.storage.sync.set({ enabled: {} });
      this.render();
    });
    this.railEl.appendChild(off);
  }

  setCategory(id) {
    this.category = id;
    for (const btn of this.railEl.querySelectorAll('.rail-btn[data-tab]')) {
      btn.classList.toggle('active', btn.dataset.tab === id);
    }
    this.render();
  }

  toggle(id) {
    this.enabled = { ...this.enabled, [id]: !this.enabled[id] };
    chrome.storage.sync.set({ enabled: this.enabled });
    this.render();
  }

  _visibleEffects() {
    return EFFECTS.filter((e) =>
      (this.category === 'all' || e.category === this.category) &&
      (!this.query ||
        e.name.toLowerCase().includes(this.query) ||
        e.desc.toLowerCase().includes(this.query)));
  }

  render() {
    const items = this._visibleEffects();
    const cat = CATEGORIES.find((c) => c.id === this.category);
    this.titleEl.textContent = cat ? cat.name : 'All Effects';
    this.sectionCountEl.textContent = `${items.length}`;

    this.listEl.textContent = '';
    for (const entry of items) this.listEl.appendChild(this._card(entry));
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No effects match your search.';
      this.listEl.appendChild(empty);
    }

    const active = EFFECTS.filter((e) => this.enabled[e.id]).length;
    this.countEl.textContent = `${active} effect${active === 1 ? '' : 's'} active`;
    // Per-tab active dots
    for (const btn of this.railEl.querySelectorAll('.rail-btn[data-tab]')) {
      const tab = btn.dataset.tab;
      const n = EFFECTS.filter(
        (e) => (tab === 'all' || e.category === tab) && this.enabled[e.id]).length;
      btn.classList.toggle('has-active', n > 0);
    }
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

new SidebarController().init();