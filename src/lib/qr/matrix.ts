import qrcode from 'qrcode-generator';
export type Grid = boolean[][];
export function makeMatrix(data: string, ecc: 'M' | 'H'): Grid | null {
  try {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']!;
    const q = qrcode(0, ecc);
    q.addData(data, 'Byte');
    q.make();
    const n = q.getModuleCount();
    return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => q.isDark(r, c)));
  } catch { return null; } // payload too long
}
