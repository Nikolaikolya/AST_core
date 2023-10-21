import {
  EncryptingParamData,
  OffsetsResult,
  SchemeItem,
  Serialize,
} from "./types";
import { BitResult } from "../bit/types";
import { enumerable } from "../../iterable";

export class Encrypting {
  private readonly SIZE: number = 8;
  private readonly _data: Int8Array;
  private readonly _serialize: Serialize[];
  constructor(private readonly _scheme: SchemeItem[]) {
    this._serialize = this.serialize();

    this._data = new Int8Array(this.length);
  }

  encode(data: EncryptingParamData): ArrayBuffer {
    const normalized = this.normalizedData(data);

    for (const [i, el] of enumerable(this._serialize.values())) {
      switch (el.type) {
        case "number":
          if (this.getByteSiZeNumber(normalized[i] as number) > el.count) {
            throw new Error("Element not");
          }

          const v = normalized[i] as number;
          this._data[el.position] |= this.setPosition(v, el.offset);
          break;
        case "boolean":
          const bool = normalized[i] as boolean;
          this._data[el.position] |= this.setPosition(Number(bool), el.offset);
          break;
        case "utf":
          const char = normalized[i] as string;

          this._data[el.position] |= this.setPosition(
            char.charCodeAt(0),
            el.offset
          );

          break;
      }
    }

    return this._data.buffer;
  }

  decode(data: ArrayBuffer): EncryptingParamData {
    const int8 = new Uint8Array(data);
    const returned: EncryptingParamData = [];

    for (const [i, el] of enumerable(this._serialize.values())) {
      const count = this.getCount(el.count);
      const value = int8[el.position];

      switch (el.type) {
        case "number":
          returned.push(
            (value & this.setPosition(count, el.offset)) >> el.offset
          );
          break;
        case "boolean":
          returned.push(
            (value & this.setPosition(count, el.offset)) >> el.offset === 1
          );
          break;
        case "utf":
          if (el.partial) {
            let char = returned.at(-1) as string;
            char += String.fromCharCode(value);

            returned[returned.length - 1] = char;
          } else returned.push(String.fromCharCode(value));

          break;
      }
    }

    return returned;
  }

  private serialize(): Serialize[] {
    const returned: Serialize[] = [];
    const offsets = this.getOffset();

    for (const [size, type] of this._scheme) {
      let tmpSerialize: Serialize;

      if (size !== 0 && size % this.SIZE === 0) {
        const length = size / this.SIZE;

        for (let i = 0; i < length; i++) {
          const { offset, position } = offsets(this.SIZE);

          tmpSerialize = {
            type: type,
            count: this.SIZE,
            position: position,
            offset: returned.length === 0 ? 0 : offset,
            partial: i !== 0,
          };

          returned.push(tmpSerialize!);
        }
      } else {
        const { offset, position } = offsets(size);
        tmpSerialize = {
          type: type,
          count: size,
          position: position,
          offset: returned.length === 0 ? 0 : offset,
          partial: false,
        };
        returned.push(tmpSerialize!);
      }
    }

    return returned;
  }
  private deserialize(): void {}

  private getOffset() {
    let offset = 0,
      position = 0;

    return (size: number): OffsetsResult => {
      const returned: { offset: number; position: number } = {
        offset: offset,
        position,
      };

      if (offset + size >= this.SIZE || size === this.SIZE) {
        if (offset + size > this.SIZE) {
          offset = 0;
          position++;

          returned.offset = 0;
          returned.position = position;
        } else {
          returned.offset = offset;
          returned.position = position;
        }
      }

      offset += size;

      return returned;
    };
  }

  private get length(): number {
    return Math.max(...this._serialize.map((i) => i.position + 1));
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

  getByteSiZeNumber(number: number): number {
    return Math.ceil(Math.log2(number + 1));
  }

  private normalizedData(data: EncryptingParamData): EncryptingParamData {
    const result: EncryptingParamData = [];

    for (const el of data) {
      if (typeof el === "string") {
        for (const str of el) {
          result.push(str);
        }
      } else {
        result.push(el);
      }
    }

    return result;
  }
}
