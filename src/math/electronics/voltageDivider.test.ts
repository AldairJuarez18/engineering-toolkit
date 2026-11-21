import { describe, expect, it } from 'vitest';
import { solveVoltageDivider } from './voltageDivider';

describe('solveVoltageDivider', () => {
  it('divide a la mitad cuando R1 y R2 son iguales (10 V, 1 kΩ, 1 kΩ -> 5 V)', () => {
    const res = solveVoltageDivider({ vin: 10, r1: 1000, r2: 1000 });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.vout).toBeCloseTo(5, 6);
      expect(res.data.current).toBeCloseTo(0.005, 6);
      expect(res.data.ratio).toBeCloseTo(0.5, 6);
    }
  });

  it('calcula correctamente un divisor asimétrico (12 V, 2 kΩ, 1 kΩ -> 4 V)', () => {
    const res = solveVoltageDivider({ vin: 12, r1: 2000, r2: 1000 });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.vout).toBeCloseTo(4, 6);
      expect(res.data.vr1).toBeCloseTo(8, 6);
    }
  });

  it('rechaza resistencias iguales o menores a cero', () => {
    const res = solveVoltageDivider({ vin: 5, r1: 0, r2: 1000 });
    expect(res.status).toBe('error');
  });
});