export const enumerable = <T>(
  iter: Iterator<T>
): IterableIterator<[number, T]> => {
  let index = 0;

  return {
    [Symbol.iterator](): IterableIterator<[number, T]> {
      return this;
    },
    next(): IteratorResult<[number, T]> {
      const { done, value } = iter.next();

      if (done) return { done: true, value: [] };
      else {
        const result: { value: [number, T]; done: boolean } = {
          value: [index, value],
          done: false,
        };

        index++;

        return result;
      }
    },
  };
};
