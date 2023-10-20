import { BitResult, BitValue, IBit } from "./types";

export class Bit implements IBit {
  constructor(private readonly array: Int8Array) {}
  get(index: number, bit: number): BitResult {
    const count = this.getCount(1);
    const position = this.setPosition(count, bit);

    return (this.array[index] & position) !== 0 ? 1 : 0;
  }

  set(index: number, bit: number, value: BitValue): BitResult {
    const count = this.getCount(1);
    const position = this.setPosition(count, bit - 1);

    const newValue =
      value === 1
        ? this.array[index] | position
        : this.array[index] & ~position;

    this.array[index] = newValue;

    return newValue;
  }

  private getCount(count: number): number {
    if (count > 8) {
      throw new Error("Bit arrow 8");
    }

    return (2 ** 8 - 1) >>> (8 - count);
  }

  private setPosition(value: number, position: number): BitResult {
    if (position > 8) {
      throw new Error("Bit arrow 8");
    }

    return value << position;
  }
}
