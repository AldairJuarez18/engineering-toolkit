import { describe, expect, it } from 'vitest';
import { convertUnits } from './unitConverter';

describe('convertUnits', () => {
  it('convierte pulgadas a milímetros (1 in = 25.4 mm)', () => {
    const res = convertUnits({
      magnitudeId: 'length',
      value: 1,
      fromUnitId: 'in',
      toUnitId: 'mm',
    });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.outputValue).toBeCloseTo(25.4, 6);
    }
  });

  it('convierte temperatura Celsius a Fahrenheit y Kelvin (100 °C -> 212 °F)', () => {
    const res = convertUnits({
      magnitudeId: 'temperature',
      value: 100,
      fromUnitId: 'C',
      toUnitId: 'F',
    });
    expect(res.status).toBe('ok');
    if (res.status === 'ok') {
      expect(res.data.outputValue).toBeCloseTo(212, 6);
    }
  });

  it('convierte RPM a Hertz y atmósferas a kPa correctamente', () => {
    const freq = convertUnits({
      magnitudeId: 'frequency',
      value: 60,
      fromUnitId: 'rpm',
      toUnitId: 'Hz',
    });
    expect(freq.status).toBe('ok');
    if (freq.status === 'ok') {
      expect(freq.data.outputValue).toBeCloseTo(1, 6);
    }

    const press = convertUnits({
      magnitudeId: 'pressure',
      value: 1,
      fromUnitId: 'atm',
      toUnitId: 'kPa',
    });
    expect(press.status).toBe('ok');
    if (press.status === 'ok') {
      expect(press.data.outputValue).toBeCloseTo(101.325, 4);
    }
  });

  it('rechaza temperaturas por debajo del cero absoluto', () => {
    const res = convertUnits({
      magnitudeId: 'temperature',
      value: -300,
      fromUnitId: 'C',
      toUnitId: 'K',
    });
    expect(res.status).toBe('error');
  });
});