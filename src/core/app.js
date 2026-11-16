import Pointer from './pointer.js';
import CanvasLayer from './canvas-layer.js';
import BudgetGuard from './budget.js';
import EFFECTS, { byId } from './registry.js';
import { isGenId, seedOf, generatePreset } from './generator.js';

/**
 * Content-side application. Owns shared resources (pointer, canvas),
 * lazily imports ONLY enabled effect modules, and enforces the
 * performance budget: when too much is enabled, the oldest effects are
 * swapped out automatically and the change is persisted.
 */
export default class App {
  constructor() {
    this.pointer = new Pointer();
    this.canvas = new CanvasLayer();
    this.guard = new BudgetGuard();
    this.settings = { intensity: 1 };
    this.enabled = {};
    this.order = [];
    this.instances = new Map();
    this._loading = new Set();
  }

  async init() {
    this.pointer.install();
    const data = await chrome.storage.sync.get(['enabled', 'intensity']);
    this.settings.intensity = data.intensity ?? 1;
    this._adopt(data.enabled ?? {});
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync') return;
      if (changes.intensity) {
        this.settings.intensity = changes.intensity.newValue ?? 1;
      }
      if (changes.enabled) this._adopt(changes.enabled.newValue ?? {});
    });
    await this._sync();
  }

  /** Diff the new enabled map, enforce the budget, persist drops. */
  _adopt(map) {
    for (const id of Object.keys(map)) {
      if (map[id] && !this.enabled[id] && (byId(id) || isGenId(id))) {
        this.order.push(id);
      }
    }
    this.enabled = { ...map };
    this.order = this.order.filter((id) => this.enabled[id]);
    const { keep, dropped } = this.guard.enforce(this.order);
    if (dropped.length > 0) {
      this.order = keep;
      for (const id of dropped) delete this.enabled[id];
      chrome.storage.sync.set({ enabled: this.enabled });
    }
    this._sync();
  }

  async _sync() {
    const ids = new Set(EFFECTS.map((e) => e.id));
    for (const id of Object.keys(this.enabled)) {
      if (this.enabled[id] && isGenId(id)) ids.add(id);
    }
    const jobs = [];
    for (const id of ids) {
      const want = !!this.enabled[id];
      const entry = byId(id) ?? { id, file: 'generated.js' };
      if (want && !this.instances.has(id)) jobs.push(this._load(entry));
      if (!want && this.instances.has(id)) this._unload(id);
    }
    await Promise.all(jobs);
  }

  async _load(entry) {
    if (this._loading.has(entry.id)) return;
    this._loading.add(entry.id);
    try {
      const url = chrome.runtime.getURL(`src/effects/${entry.file}`);
      const mod = await import(url);
      // User may have toggled it off while the module was loading.
      if (!this.enabled[entry.id]) return;
      const effect = isGenId(entry.id)
        ? new mod.default(this, generatePreset(seedOf(entry.id)))
        : new mod.default(this);
      this.instances.set(entry.id, effect);
      await effect.enable();
    } catch (err) {
      console.warn(`[WebFX] failed to load "${entry.id}"`, err);
    } finally {
      this._loading.delete(entry.id);
    }
  }

  _unload(id) {
    const effect = this.instances.get(id);
    if (!effect) return;
    try { effect.disable(); } catch (err) {
      console.warn(`[WebFX] cleanup error for "${id}"`, err);
    }
    this.instances.delete(id);
  }
}