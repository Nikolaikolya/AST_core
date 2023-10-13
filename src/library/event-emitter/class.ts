import { type EventValues, type IEventEmitter, type IEventEmitterParams, type Disposable } from "./types";

export class EventEmitter implements IEventEmitter {
  #events = new Map<string, EventValues>();
  constructor (private readonly params: IEventEmitterParams = { namespace: "", delimiter: ":" }) {
  }

  emit (event: string, data: unknown): void {
    if (this.#events.has(event)) {
      for (const ev of this.#events.get(event)!) {
        ev(data);
      }
    }
  }

  off (event: string): void {
  }

  on (event: string, fn: (...args: unknown[]) => unknown): Disposable {
    if (this.#events.has(event)) {
      const allEvents = this.#events.get(event);

      allEvents?.push(fn);
      this.#events.delete(event);
      this.#events.set(event, allEvents!);
    }

    this.#events.set(event, [fn]);

    return {
      dispose: () => { this.off(event); }
    };
  }

  once (event: string): void {
  }

  pipe (event: string, target: IEventEmitter): Disposable {
    // return this.on(event, (e) => { target.emit(event, e); });
    return {
      dispose: () => { this.off(event); }
    };
  }

  private getNamespace (event: string): string {
    const { namespace, delimiter } = this.params;
    return `${namespace}${delimiter}${event}`;
  }
}
