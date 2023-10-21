export type SchemeType = "number" | "boolean" | "utf";

export type SchemeItem = [number, SchemeType];

export type EncryptingParamData = Array<number | string | boolean>;

export interface OffsetsResult {
  offset: number;
  position: number;
}

export interface Serialize {
  count: number;
  type: SchemeType;
  partial: boolean;
  offset: number;
  position: number;
}
