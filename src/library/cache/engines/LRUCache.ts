import { type ICache, type LRUCacheOptions } from "../types";

export class LRUCache<K extends string, V> implements ICache<K, V> {
  #queue = new Map<K, V>();
  #size: number = 0;

  constructor ({ size }: LRUCacheOptions) {
    this.#size = size;
  }

  clear (): void {
    this.#queue.clear();
  }

  get (key: K): V | undefined {
    if (this.#queue.has(key)) {
      const el = this.#queue.get(key);
      this.#queue.delete(key);
      this.#queue.set(key, el!);
      return el;
    }
    return undefined;
  }

  remove (key: K): void {
    if (this.#queue.has(key)) {
      this.#queue.delete(key);
    }
  }

  set (key: K, value: V): void {
    if (this.#queue.has(key)) {
      this.#queue.delete(key);
    }

    if (this.#size <= this.#queue.size) {
      this.#queue.delete(this.#queue.keys().next().value);
    }

    this.#queue.set(key, value);
  }
}
