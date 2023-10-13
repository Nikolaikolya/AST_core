import { type ICache } from "../types";

export function ttlWrapper<T extends ICache<any, any>> (second: number, cache: T): T {
  const { set: oSet, remove: oRemove, clear: oClear } = cache;
  const timers = new Map<unknown, unknown>();
  const ttl = second * 1000;

  Object.assign(cache, {
    set (key: string, value: unknown) {
      if (timers.has(key)) {
        clearTimeout(timers.get(key) as number);
      }

      oSet.call(this, key, value);
      timers.set(key, setInterval(this.remove.bind(this, key), ttl));
    },
    remove (key: string) {
      if (timers.has(key)) {
        clearTimeout(timers.get(key) as number);
        timers.delete(key);
      }

      oRemove.call(this, key);
    },
    clear () {
      for (const el of timers.values()) {
        clearTimeout(el as number);
      }

      timers.clear();
      oClear.call(this);
    }
  });

  return cache;
};
