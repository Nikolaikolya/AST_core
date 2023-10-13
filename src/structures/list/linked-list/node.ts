import { type LinkedListNode } from "../types";

export class NodeList<T> implements LinkedListNode<T> {
  constructor (public value: T, public next?: LinkedListNode<T>) {
  }
}
