import type { CalculationStep } from '../../types/toolkit';
import { formatNumber, formatWithPrefix } from '../format';

export interface VoltageDividerInput {
  vin?: number; // en Volts (V)
  r1?: number; // en Ohms (Ω)
  r2?: number; // en Ohms (Ω)
}

export interface VoltageDividerResult {
  vin: number;
  r1: number;
  r2: number;
  vout: number;
  vr1: number;
  current: number;
  ratio: number;
  steps: CalculationStep[];
  summaryText: string;
}

export type VoltageDividerOutcome =
  | { status: 'incomplete'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: VoltageDividerResult };

export function solveVoltageDivider(input: VoltageDividerInput): VoltageDividerOutcome {
  const { vin, r1, r2 } = input;

  if (vin === undefined || r1 === undefined || r2 === undefined) {
    return {
      status: 'incomplete',
      message: 'Ingresa el voltaje de entrada (Vin) y ambas resistencias (R1 y R2) para calcular.',
    };
  }

  if (!Number.isFinite(vin) || !Number.isFinite(r1) || !Number.isFinite(r2)) {
    return {
      status: 'error',
      message: 'Todos los valores ingresados deben ser números válidos.',
    };
  }

  if (r1 <= 0 || r2 <= 0) {
    return {
      status: 'error',
      message: 'Las resistencias R1 y R2 deben ser estrictamente mayores a 0 Ω.',
    };
  }

  const rTotal = r1 + r2;
  const current = vin / rTotal;
  const vout = vin * (r2 / rTotal);
  const vr1 = vin - vout;
  const ratio = r2 / rTotal;

  const steps: CalculationStep[] = [
    {
      label: 'Resistencia total en serie del divisor',
      formula: 'Rtotal = R1 + R2',
      substitution: `Rtotal = ${formatNumber(r1)} Ω + ${formatNumber(r2)} Ω`,
      result: `${formatNumber(rTotal)} Ω (${formatWithPrefix(rTotal, 'Ω')})`,
    },
    {
      label: 'Corriente que circula por la rama (Ley de Ohm)',
      formula: 'I = Vin / (R1 + R2)',
      substitution: `I = ${formatNumber(vin)} V / ${formatNumber(rTotal)} Ω`,
      result: `${formatNumber(current)} A (${formatWithPrefix(current, 'A')})`,
    },
    {
      label: 'Voltaje de salida en R2 (Fórmula del divisor de voltaje)',
      formula: 'Vout = Vin · [ R2 / (R1 + R2) ]',
      substitution: `Vout = ${formatNumber(vin)} V · [ ${formatNumber(r2)} Ω / (${formatNumber(r1)} Ω + ${formatNumber(r2)} Ω) ]`,
      result: `${formatNumber(vout)} V (${formatWithPrefix(vout, 'V')})`,
    },
  ];

  const summaryText = [
    'Engineering Toolkit — Divisor de Voltaje',
    `Voltaje de entrada (Vin): ${formatWithPrefix(vin, 'V')}`,
    `R1: ${formatWithPrefix(r1, 'Ω')} | R2: ${formatWithPrefix(r2, 'Ω')}`,
    `Voltaje de salida (Vout): ${formatWithPrefix(vout, 'V')} (${formatNumber(vout)} V)`,
    `Caída en R1 (VR1): ${formatWithPrefix(vr1, 'V')}`,
    `Corriente de rama (I): ${formatWithPrefix(current, 'A')}`,
    `Relación de transferencia (Vout/Vin): ${formatNumber(ratio * 100, 2)}%`,
    '',
    ...steps.map(
      (s, i) => `${i + 1}. ${s.label}: ${s.formula} => ${s.substitution} = ${s.result}`,
    ),
  ].join('\n');

  return {
    status: 'ok',
    data: {
      vin,
      r1,
      r2,
      vout,
      vr1,
      current,
      ratio,
      steps,
      summaryText,
    },
  };
}