import { type LinkedListNode } from "../types";
import { NodeList } from "./node";

export class LinkedList<T> {
  constructor (private _first?: LinkedListNode<T>, private _last?: LinkedListNode<T>) {
  }

  get first (): LinkedListNode<T> {
    return this._first!;
  }

  get last (): LinkedListNode<T> {
    return this._last!;
  }

  add (value: T): void {
    if (this._first === undefined) {
      this._first = new NodeList(value);
    } else {
      const newNode = new NodeList(value);

      if (this._last === undefined) {
        this._first.next = newNode;
        this._last = newNode;
      } else {
        this._last.next = newNode;
        this._last = newNode;
      }
    }
  }

  [Symbol.iterator] (): Iterator<T> {
    let res: LinkedListNode<T> | undefined = this.first;

    return {
      next (): IteratorResult<T> {
        if (res?.value !== undefined) {
          const value = res.value;

          if (res.next !== undefined) {
            res = res.next;
            return { value, done: false };
          } else res = undefined;

          return { value, done: false };
        }

        return { value: undefined, done: true };
      }
    };
  }
}
