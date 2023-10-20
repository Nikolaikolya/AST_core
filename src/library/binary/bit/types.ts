export type BitResult = number | never
export type BitValue = 0 | 1;

export interface IBit {
  get: (index: number, bit: number) => BitResult
  set: (index: number, bit: number, value: BitValue) => BitResult
}