export class ConvertMemory {
  static mbToBytes = (mb: number): number => this.kbToBytes(mb * 1024);
  static kbToBytes = (kb: number): number => kb * 1024;
  static bytesToKb = (bytes: number): number => bytes * 1024;
  static kbToMb = (kb: number): number => kb * 1024;
}
