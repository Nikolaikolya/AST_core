export type EventValues = Array<(...args: unknown[]) => unknown>

export interface IEventEmitterParams {
  namespace: string
  delimiter?: string
}

export interface Disposable {
  dispose: () => unknown
}

export interface IEventEmitter {
  on: (event: string, fn: (...args: unknown[]) => unknown) => Disposable
  once: (event: string) => void
  emit: (event: string, data: unknown) => void
  off: (event: string) => void
  pipe: (event: string, target: IEventEmitter) => Disposable
}
