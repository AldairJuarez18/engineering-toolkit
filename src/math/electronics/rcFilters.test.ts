import { describe, expect, it } from 'vitest';
import { evaluateRcResponse, solveRcFilter } from './rcFilters';

describe('solveRcFilter', () => {
  it('calcula correctamente fc y tau para R = 1 kΩ y C = 1 µF', () => {
    const res = solveRcFilter({
      type: 'low-pass',
      resistance: 1000,
      capacitance: 1e-6,
    });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.timeConstant).toBeCloseTo(0.001, 8);
      expect(res.data.cutoffFrequency).toBeCloseTo(159.1549, 3);
      const cutoffPoint = res.data.curve.find((p) => p.isCutoff);
      expect(cutoffPoint?.gainDb).toBeCloseTo(-3.01, 2);
      expect(cutoffPoint?.phaseDeg).toBeCloseTo(-45, 1);
    }
  });

  it('comprueba atenuación pasa bajas vs pasa altas lejos de fc', () => {
    const fc = 1000;
    const lowPassHighFreq = evaluateRcResponse('low-pass', 100000, fc);
    const highPassLowFreq = evaluateRcResponse('high-pass', 10, fc);

    expect(lowPassHighFreq.gainDb).toBeCloseTo(-40, 1);
    expect(highPassLowFreq.gainDb).toBeCloseTo(-40, 1);
  });

  it('devuelve error si R o C son menores o iguales a cero', () => {
    const res = solveRcFilter({
      type: 'high-pass',
      resistance: 1000,
      capacitance: 0,
    });
    expect(res.status).toBe('error');
  });
});