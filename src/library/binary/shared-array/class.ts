export class LocalStorage {
  private readonly MAX_KEY_LENGTH = 100;
  private readonly KEY_SIZE = 1;
  private readonly VALUE_SIZE = 4;
  private readonly START_BYTE = 0;

  private readonly decoder = new TextDecoder();
  private readonly encoder = new TextEncoder();

  private readonly dataView: DataView;

  constructor (private readonly arrayBuffer: ArrayBuffer) {
    this.dataView = new DataView(this.arrayBuffer);
  }

  public get offset (): number {
    return this.KEY_SIZE + this.VALUE_SIZE;
  }

  set (key: string, value: string): void {
    if (key.length >= this.MAX_KEY_LENGTH) {
      throw new Error("Key long from 100 simbols");
    }

    const valueDecode = this.encoder.encode(value);
    const keyDecode = this.encoder.encode(key);

    const [keyOffsets] = this.getOffsetKey(key);

    if (keyOffsets !== this.START_BYTE) {
      this.remove(key);
    }

    const startByte = this.getStartByte(this.START_BYTE);
    const keyOffset = this.offset + startByte;
    const valueOffset = this.offset + startByte + keyDecode.byteLength;

    this.dataView.setInt8(startByte, keyDecode.byteLength);
    this.dataView.setInt32(startByte + this.KEY_SIZE, valueDecode.byteLength);

    const keyArr = new Int8Array(this.arrayBuffer, keyOffset, keyDecode.byteLength);
    const valueArr = new Int8Array(this.arrayBuffer, valueOffset, valueDecode.byteLength);

    keyArr.set(keyDecode);
    valueArr.set(valueDecode);
  }

  get (key: string): string | null {
    const keyDecode = this.encoder.encode(key);

    const [keyOffset, valueSize] = this.getOffsetKey(key);

    if (keyOffset === this.START_BYTE) return null;

    const valueArr = new Int8Array(this.arrayBuffer, keyOffset + keyDecode.byteLength, valueSize);
    return this.decoder.decode(valueArr);
  }

  remove (key: string): void {
    const [keyOffset, valueSize] = this.getOffsetKey(key);

    if (keyOffset !== this.START_BYTE) {
      const startByte = keyOffset - this.offset;
      const keyLength = this.dataView.getInt8(startByte);
      const endByte = startByte + keyLength + this.offset + valueSize;

      const startArray = new Int8Array(this.arrayBuffer, endByte);
      const newArray = new Int8Array(this.arrayBuffer, startByte);

      newArray.set(startArray);
    }
  }

  private getOffsetKey (key: string, startOffset: number = 0): number[] {
    const offsetKey = this.dataView.getInt8(startOffset);
    const offsetValue = this.dataView.getInt32(startOffset + this.KEY_SIZE);

    const bytesOffsets = startOffset === this.START_BYTE ? offsetKey : startOffset + this.offset;

    const viewKey = new Int8Array(this.arrayBuffer, bytesOffsets, offsetKey);
    const decodeKey = this.decoder.decode(viewKey);

    if (decodeKey === "") return [this.START_BYTE, this.START_BYTE];

    if (decodeKey === key) {
      return [bytesOffsets, offsetValue];
    } else {
      return this.getOffsetKey(key, offsetKey + offsetValue + this.offset + startOffset);
    }
  }

  private getStartByte (start: number): number {
    const keySize = this.dataView.getInt8(start);
    const valueSize = this.dataView.getInt32(start + this.KEY_SIZE);

    if (keySize === this.START_BYTE) return start;

    return this.getStartByte(this.offset + keySize + valueSize + start);
  }

  values (): IterableIterator<string> {
    const iterable = this[Symbol.iterator]();
    let iterator = iterable.next();

    return {
      [Symbol.iterator] () {
        return this;
      },
      next (): IteratorResult<string> {
        const { value, done } = iterator;
        if (done === true) return { value: undefined, done: true };

        iterator = iterable.next();

        return { value: value[1], done };
      }
    };
  }

  keys (): IterableIterator<string> {
    const iterable = this[Symbol.iterator]();
    let iterator = iterable.next();

    return {
      [Symbol.iterator] () {
        return this;
      },
      next (): IteratorResult<string> {
        const { value, done } = iterator;
        if (done === true) return { value: undefined, done: true };

        iterator = iterable.next();

        return { value: value[0], done };
      }
    };
  }

  [Symbol.iterator] (): IterableIterator<string[]> {
    let startByte = this.START_BYTE;
    const dataView = this.dataView;
    const offset = this.offset;
    const arrayBuffer = this.arrayBuffer;
    const decoder = this.decoder;

    return {

      [Symbol.iterator] () {
        return this;
      },

      next (): IteratorResult<string[]> {
        const keyLength = dataView.getInt8(startByte);
        const valueLength = dataView.getInt32(startByte + 1);

        if (keyLength === 0) return { value: undefined, done: true };

        const keyArray = new Int8Array(arrayBuffer, offset + startByte, keyLength);
        const valueArray = new Int8Array(arrayBuffer, offset + startByte + keyLength, valueLength);

        const value = [decoder.decode(keyArray), decoder.decode(valueArray)];

        startByte = startByte + offset + keyLength + valueLength;

        return { value, done: false };
      }
    };
  }
}
