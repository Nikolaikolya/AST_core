export interface ICache<K extends string, V> {
  get: (key: K) => V | undefined
  set: (key: K, value: V) => void
  remove: (key: K) => void
  clear: () => void
}

export interface LRUCacheOptions {
  size: number
}
