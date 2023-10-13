import { type ICache } from "../types";

export class NeverCache<K extends string, V> implements ICache<K, V> {
  clear (): void {
  }

  get (key: K): V | undefined {
    return undefined;
  }

  remove (key: K): void {
  }

  set (key: K, value: V): void {
  }
}
