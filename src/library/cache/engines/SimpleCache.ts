import { type ICache } from "../types";

export class SimpleCache<K extends string, V> implements ICache<K, V> {
  #cache = new Map<K, V>();

  clear (): void {
    this.#cache.clear();
  }

  get (key: K): V | undefined {
    return this.#cache.get(key) ?? undefined;
  }

  remove (key: K): void {
    this.#cache.delete(key);
  }

  set (key: K, value: V): void {
    this.#cache.set(key, value);
  }
}
