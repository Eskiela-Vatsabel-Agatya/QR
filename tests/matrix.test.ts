import { describe, it, expect } from 'vitest';
import { makeMatrix } from '../src/lib/qr/matrix';
describe('matrix', () => {
  it('encodes a normal URL at M and H', () => {
    const u = 'https://www.lunarcreativa.workers.dev/portofolio/detail?id=K001';
    expect(makeMatrix(u, 'M')).not.toBeNull(); expect(makeMatrix(u, 'H')).not.toBeNull();
  });
  it('encodes UTF-8 text', () => expect(makeMatrix('Halo dunia ☕ 日本', 'M')).not.toBeNull());
  it('fails only when truly too long', () => { expect(makeMatrix('a'.repeat(2000), 'M')).not.toBeNull(); expect(makeMatrix('a'.repeat(3000), 'M')).toBeNull(); });
});
