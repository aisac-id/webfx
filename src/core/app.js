import Pointer from './pointer.js';
import CanvasLayer from './canvas-layer.js';
import EFFECTS from './registry.js';

/**
 * Content-side application. Owns shared resources (pointer, canvas),
 * reads the enabled-effect map from storage and lazily imports ONLY
 * the modules for enabled effects. Toggling off fully disposes them.
 */
export default class App {
  constructor() {
    this.pointer = new Pointer();
    this.canvas = new CanvasLayer();
    this.settings = { intensity: 1 };
    this.enabled = {};
    this.instances = new Map();
    this._loading = new Set();
  }

  async init() {
    this.pointer.install();
    const data = await chrome.storage.sync.get(['enabled', 'intensity']);
    this.enabled = data.enabled ?? {};
    this.settings.intensity = data.intensity ?? 1;
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync') return;
      if (changes.intensity) {
        this.settings.intensity = changes.intensity.newValue ?? 1;
      }
      if (changes.enabled) {
        this.enabled = changes.enabled.newValue ?? {};
        this._sync();
      }
    });
    await this._sync();
  }

  async _sync() {
    const jobs = [];
    for (const entry of EFFECTS) {
      const want = !!this.enabled[entry.id];
      if (want && !this.instances.has(entry.id)) jobs.push(this._load(entry));
      if (!want && this.instances.has(entry.id)) this._unload(entry.id);
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
      const effect = new mod.default(this);
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