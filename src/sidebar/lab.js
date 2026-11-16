import { PRESET_COUNT, generatePreset, randomSeed } from '../core/generator.js';
import ICONS from './icons.js';

const CHUNK = 40;
const MAX_FAVORITES = 30;

/** Effect Lab tab: infinite generator, favorites, 1000-preset browser. */
class LabView {
  constructor(ctl) {
    this.ctl = ctl;
    this.favorites = [];
    this.lastSeed = null;
    this.limit = CHUNK;
    // Presets are pure functions of their seed - build the library once.
    this.presets = [];
    for (let s = 1; s <= PRESET_COUNT; s++) this.presets.push(generatePreset(s));
  }

  async init() {
    const data = await chrome.storage.sync.get(['favorites', 'lastGen']);
    this.favorites = data.favorites ?? [];
    this.lastSeed = data.lastGen ?? null;
  }

  resetPaging() {
    this.limit = CHUNK;
  }

  async generate() {
    const seed = randomSeed();
    const p = generatePreset(seed);
    this.lastSeed = seed;
    const enabled = { ...this.ctl.enabled, [p.id]: true };
    await chrome.storage.sync.set({ enabled, director: false, lastGen: seed });
    this.ctl.toast(`Generated: ${p.name}`);
  }

  async toggleFavorite(p) {
    const exists = this.favorites.some((f) => f.seed === p.seed);
    const favorites = exists
      ? this.favorites.filter((f) => f.seed !== p.seed)
      : [{ seed: p.seed, name: p.name }, ...this.favorites].slice(0, MAX_FAVORITES);
    await chrome.storage.sync.set({ favorites });
    this.ctl.toast(exists ? 'Removed from favorites' : `Saved: ${p.name}`);
  }

  render() {
    const list = this.ctl.listEl;
    list.textContent = '';
    list.appendChild(this._hero());

    if (this.favorites.length > 0) {
      list.appendChild(this._subhead('Favorites', this.favorites.length));
      for (const fav of this.favorites) {
        list.appendChild(this._favCard(generatePreset(fav.seed)));
      }
    }

    const q = this.ctl.query;
    const filtered = q
      ? this.presets.filter(
          (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      : this.presets;
    this.ctl.sectionCountEl.textContent = String(filtered.length);
    list.appendChild(this._subhead('Preset Library', filtered.length));

    for (const p of filtered.slice(0, this.limit)) {
      list.appendChild(this.ctl._card(p));
    }
    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No presets match your search.';
      list.appendChild(empty);
    }
    if (filtered.length > this.limit) {
      const more = document.createElement('button');
      more.className = 'show-more';
      more.textContent = `Show more (${filtered.length - this.limit} left)`;
      more.addEventListener('click', () => {
        this.limit += CHUNK;
        this.render();
      });
      list.appendChild(more);
    }
  }

  _hero() {
    const hero = document.createElement('div');
    hero.className = 'lab-hero';

    const btn = document.createElement('button');
    btn.className = 'gen-btn';
    btn.innerHTML = `${ICONS.dice}<span>Generate Random Effect</span>`;
    btn.addEventListener('click', () => this.generate());
    hero.appendChild(btn);

    if (this.lastSeed !== null) {
      const p = generatePreset(this.lastSeed);
      const row = document.createElement('div');
      row.className = `last-gen${this.ctl.enabled[p.id] ? ' on' : ''}`;

      const info = document.createElement('div');
      info.className = 'info';
      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = p.name;
      const desc = document.createElement('div');
      desc.className = 'desc';
      desc.textContent = `#${p.seed} - ${p.desc}`;
      info.append(name, desc);
      info.addEventListener('click', () => this.ctl.toggle(p.id));

      const heart = document.createElement('button');
      const saved = this.favorites.some((f) => f.seed === p.seed);
      heart.className = `heart-btn${saved ? ' saved' : ''}`;
      heart.title = saved ? 'Remove from favorites' : 'Save to favorites';
      heart.innerHTML = ICONS.heart;
      heart.addEventListener('click', () => this.toggleFavorite(p));

      row.append(info, heart);
      hero.appendChild(row);
    }
    return hero;
  }

  _subhead(text, count) {
    const head = document.createElement('div');
    head.className = 'lab-subhead';
    const label = document.createElement('span');
    label.textContent = text;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = String(count);
    head.append(label, badge);
    return head;
  }

  _favCard(p) {
    const card = this.ctl._card(p);
    const remove = document.createElement('button');
    remove.className = 'remove-btn';
    remove.title = 'Remove from favorites';
    remove.innerHTML = ICONS.close;
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(p);
    });
    card.appendChild(remove);
    return card;
  }
}

export default LabView;