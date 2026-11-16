import { byId } from './registry.js';

/**
 * Performance guard. Hard rules so effects can never pile up and
 * choke the browser:
 *   - at most MAX_ACTIVE effects at once
 *   - total render cost <= MAX_COST
 *   - at most ONE fullscreen cinematic filter
 * When a rule would break, the OLDEST active effects are swapped out.
 */
export default class BudgetGuard {
  constructor() {
    this.maxActive = 4;
    this.maxCost = 7;
  }

  costOf(id) {
    return byId(id)?.cost ?? 1;
  }

  totalCost(ids) {
    return ids.reduce((sum, id) => sum + this.costOf(id), 0);
  }

  /**
   * @param {string[]} order active effect ids, oldest first
   * @returns {{keep: string[], dropped: string[]}}
   */
  enforce(order) {
    const keep = [...order];
    const dropped = [];
    const drop = (id) => {
      const i = keep.indexOf(id);
      if (i >= 0) {
        keep.splice(i, 1);
        dropped.push(id);
      }
    };
    // Only one fullscreen filter: keep the most recently enabled one.
    const filters = keep.filter((id) => byId(id)?.group === 'filter');
    while (filters.length > 1) drop(filters.shift());
    // Count + cost budget: sacrifice the oldest first.
    while (keep.length > this.maxActive || this.totalCost(keep) > this.maxCost) {
      drop(keep[0]);
    }
    return { keep, dropped };
  }
}