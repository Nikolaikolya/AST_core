export interface LinkedListNode<T> {
  value: T
  next?: LinkedListNode<T>
}

export interface DoubleLinkedListNode<T> {
  value: T
  next: DoubleLinkedListNode<T>
  prev?: DoubleLinkedListNode<T>
}
