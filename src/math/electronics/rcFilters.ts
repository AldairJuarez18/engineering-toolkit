import type { CalculationStep } from '../../types/toolkit';
import { formatNumber, formatWithPrefix } from '../format';

export type FilterType = 'low-pass' | 'high-pass';
export type CapacitanceUnit = 'pF' | 'nF' | 'µF' | 'mF';

export const CAPACITANCE_UNITS: Record<CapacitanceUnit, number> = {
  pF: 1e-12,
  nF: 1e-9,
  µF: 1e-6,
  mF: 1e-3,
};

export interface RcFilterInput {
  type: FilterType;
  resistance?: number; // en Ohms (Ω)
  capacitance?: number; // en Farads (F)
}

export interface FrequencyPoint {
  frequency: number; // Hz
  frequencyLabel: string; // Ej. "1.59 kHz"
  gainDb: number; // dB
  magnitude: number; // |H(f)| entre 0 y 1
  phaseDeg: number; // grados
  isCutoff: boolean;
}

export interface RcFilterResult {
  type: FilterType;
  resistance: number;
  capacitance: number;
  timeConstant: number; // tau en segundos (s)
  cutoffFrequency: number; // fc en Hz
  angularCutoff: number; // wc en rad/s
  curve: FrequencyPoint[];
  steps: CalculationStep[];
  summaryText: string;
}

export type RcFilterOutcome =
  | { status: 'incomplete'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: RcFilterResult };

export function evaluateRcResponse(
  type: FilterType,
  frequency: number,
  cutoffFrequency: number,
): { gainDb: number; magnitude: number; phaseDeg: number } {
  const ratio = frequency / cutoffFrequency;
  const denominator = Math.sqrt(1 + ratio * ratio);

  const magnitude = type === 'low-pass' ? 1 / denominator : ratio / denominator;
  const gainDb = 20 * Math.log10(Math.max(magnitude, 1e-12));

  const phaseRad =
    type === 'low-pass' ? -Math.atan(ratio) : Math.atan(1 / Math.max(ratio, 1e-12));
  const phaseDeg = (phaseRad * 180) / Math.PI;

  return {
    gainDb: Number(gainDb.toFixed(2)),
    magnitude: Number(magnitude.toFixed(4)),
    phaseDeg: Number(phaseDeg.toFixed(1)),
  };
}

export function solveRcFilter(input: RcFilterInput): RcFilterOutcome {
  const { type, resistance, capacitance } = input;

  if (resistance === undefined || capacitance === undefined) {
    return {
      status: 'incomplete',
      message: 'Ingresa el valor de la resistencia (R) y del capacitor (C) para analizar el filtro.',
    };
  }

  if (!Number.isFinite(resistance) || !Number.isFinite(capacitance)) {
    return {
      status: 'error',
      message: 'Los valores de resistencia y capacitancia deben ser números válidos.',
    };
  }

  if (resistance <= 0 || capacitance <= 0) {
    return {
      status: 'error',
      message: 'Tanto la resistencia como la capacitancia deben ser estrictamente mayores a cero.',
    };
  }

  const timeConstant = resistance * capacitance;
  const cutoffFrequency = 1 / (2 * Math.PI * timeConstant);
  const angularCutoff = 1 / timeConstant;

  // Generar 41 puntos desde 0.01·fc hasta 100·fc (2 décadas abajo y 2 arriba)
  const curve: FrequencyPoint[] = [];
  for (let i = -20; i <= 20; i += 1) {
    const exponent = i / 10; // de -2.0 a +2.0 en pasos de 0.1
    const freq = cutoffFrequency * Math.pow(10, exponent);
    const { gainDb, magnitude, phaseDeg } = evaluateRcResponse(
      type,
      freq,
      cutoffFrequency,
    );

    curve.push({
      frequency: freq,
      frequencyLabel: formatWithPrefix(freq, 'Hz'),
      gainDb,
      magnitude,
      phaseDeg,
      isCutoff: i === 0,
    });
  }

  const typeLabel = type === 'low-pass' ? 'Pasa Bajas (Low-Pass)' : 'Pasa Altas (High-Pass)';
  const phaseAtCutoff = type === 'low-pass' ? '-45°' : '+45°';

  const steps: CalculationStep[] = [
    {
      label: 'Cálculo de la constante de tiempo del circuito (τ)',
      formula: 'τ = R · C',
      substitution: `τ = (${formatNumber(resistance)} Ω) · (${capacitance.toExponential(3)} F)`,
      result: `${formatWithPrefix(timeConstant, 's')} (${timeConstant.toExponential(3)} s)`,
    },
    {
      label: 'Cálculo de la frecuencia de corte a -3 dB (fc)',
      formula: 'fc = 1 / (2 · π · R · C)',
      substitution: `fc = 1 / (2 · π · ${formatNumber(resistance)} Ω · ${capacitance.toExponential(3)} F)`,
      result: `${formatWithPrefix(cutoffFrequency, 'Hz')} (${formatNumber(cutoffFrequency)} Hz)`,
    },
    {
      label: 'Frecuencia angular de corte (ωc)',
      formula: 'ωc = 2 · π · fc = 1 / τ',
      substitution: `ωc = 1 / ${timeConstant.toExponential(3)} s`,
      result: `${formatNumber(angularCutoff)} rad/s`,
    },
    {
      label: `Respuesta en la frecuencia de corte (${typeLabel})`,
      formula: '|H(fc)| = 1 / √2 ≈ 0.7071 (-3.01 dB)',
      substitution: `En f = ${formatWithPrefix(cutoffFrequency, 'Hz')}, la ganancia cae 3 dB y el desfase es ${phaseAtCutoff}`,
      result: `Ganancia: -3.01 dB | Desfase: ${phaseAtCutoff}`,
    },
  ];

  const summaryText = [
    `Engineering Toolkit — Filtro RC ${typeLabel}`,
    `Resistencia (R): ${formatWithPrefix(resistance, 'Ω')}`,
    `Capacitor (C): ${formatWithPrefix(capacitance, 'F')}`,
    `Frecuencia de corte (fc): ${formatWithPrefix(cutoffFrequency, 'Hz')} (${formatNumber(cutoffFrequency)} Hz)`,
    `Constante de tiempo (τ): ${formatWithPrefix(timeConstant, 's')}`,
    `Frecuencia angular (ωc): ${formatNumber(angularCutoff)} rad/s`,
    '',
    ...steps.map(
      (s, i) => `${i + 1}. ${s.label}: ${s.formula} => ${s.substitution} = ${s.result}`,
    ),
  ].join('\n');

  return {
    status: 'ok',
    data: {
      type,
      resistance,
      capacitance,
      timeConstant,
      cutoffFrequency,
      angularCutoff,
      curve,
      steps,
      summaryText,
    },
  };
}