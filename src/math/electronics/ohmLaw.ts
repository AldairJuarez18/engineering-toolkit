import type { CalculationStep } from '../../types/toolkit';
import { formatNumber, formatWithPrefix } from '../format';

export type VoltageUnit = 'mV' | 'V' | 'kV';
export type CurrentUnit = 'µA' | 'mA' | 'A';
export type ResistanceUnit = 'Ω' | 'kΩ' | 'MΩ';
export type PowerUnit = 'mW' | 'W' | 'kW';

export const VOLTAGE_UNITS: Record<VoltageUnit, number> = {
  mV: 1e-3,
  V: 1,
  kV: 1e3,
};

export const CURRENT_UNITS: Record<CurrentUnit, number> = {
  µA: 1e-6,
  mA: 1e-3,
  A: 1,
};

export const RESISTANCE_UNITS: Record<ResistanceUnit, number> = {
  Ω: 1,
  kΩ: 1e3,
  MΩ: 1e6,
};

export const POWER_UNITS: Record<PowerUnit, number> = {
  mW: 1e-3,
  W: 1,
  kW: 1e3,
};

export interface OhmLawInput {
  voltage?: number; // en Volts (V)
  current?: number; // en Amperes (A)
  resistance?: number; // en Ohms (Ω)
  power?: number; // en Watts (W)
}

export type OhmVariableKey = 'voltage' | 'current' | 'resistance' | 'power';

export interface OhmLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  calculatedKeys: OhmVariableKey[];
  steps: CalculationStep[];
  summaryText: string;
}

export type OhmLawOutcome =
  | { status: 'incomplete'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: OhmLawResult };

export function solveOhmLaw(input: OhmLawInput): OhmLawOutcome {
  const entries = (Object.entries(input) as [OhmVariableKey, number | undefined][]).filter(
    ([, val]) => val !== undefined && !Number.isNaN(val),
  );

  if (entries.length < 2) {
    return {
      status: 'incomplete',
      message: 'Ingresa exactamente dos magnitudes conocidas para despejar las otras dos.',
    };
  }

  if (entries.length > 2) {
    return {
      status: 'error',
      message: 'Solo se permiten dos valores conocidos a la vez. Limpia un campo para recalcular.',
    };
  }

  for (const [, val] of entries) {
    if (!Number.isFinite(val)) {
      return { status: 'error', message: 'Los valores ingresados deben ser números finitos.' };
    }
  }

  const hasV = input.voltage !== undefined;
  const hasI = input.current !== undefined;
  const hasR = input.resistance !== undefined;
  const hasP = input.power !== undefined;

  if (hasR && (input.resistance as number) <= 0) {
    return {
      status: 'error',
      message: 'La resistencia debe ser estrictamente mayor a 0 Ω.',
    };
  }

  if (hasP && (input.power as number) < 0) {
    return {
      status: 'error',
      message: 'La potencia disipada en un elemento resistivo no puede ser negativa.',
    };
  }

  let V = 0;
  let I = 0;
  let R = 0;
  let P = 0;
  let calculatedKeys: OhmVariableKey[] = [];
  const steps: CalculationStep[] = [];

  // Caso 1: Voltaje y Corriente conocidos
  if (hasV && hasI) {
    V = input.voltage as number;
    I = input.current as number;
    if (I === 0) {
      return {
        status: 'error',
        message: 'La corriente no puede ser 0 A al calcular la resistencia (división entre cero).',
      };
    }
    if ((V > 0 && I < 0) || (V < 0 && I > 0)) {
      return {
        status: 'error',
        message: 'El voltaje y la corriente deben tener el mismo signo para una resistencia positiva.',
      };
    }
    R = V / I;
    P = V * I;
    calculatedKeys = ['resistance', 'power'];

    steps.push(
      {
        label: 'Cálculo de la resistencia (Ley de Ohm)',
        formula: 'R = V / I',
        substitution: `R = ${formatNumber(V)} V / ${formatNumber(I)} A`,
        result: `${formatNumber(R)} Ω (${formatWithPrefix(R, 'Ω')})`,
      },
      {
        label: 'Cálculo de la potencia eléctrica (Ley de Watt)',
        formula: 'P = V · I',
        substitution: `P = (${formatNumber(V)} V) · (${formatNumber(I)} A)`,
        result: `${formatNumber(P)} W (${formatWithPrefix(P, 'W')})`,
      },
    );
  }
  // Caso 2: Voltaje y Resistencia conocidos
  else if (hasV && hasR) {
    V = input.voltage as number;
    R = input.resistance as number;
    I = V / R;
    P = (V * V) / R;
    calculatedKeys = ['current', 'power'];

    steps.push(
      {
        label: 'Cálculo de la corriente (Ley de Ohm)',
        formula: 'I = V / R',
        substitution: `I = ${formatNumber(V)} V / ${formatNumber(R)} Ω`,
        result: `${formatNumber(I)} A (${formatWithPrefix(I, 'A')})`,
      },
      {
        label: 'Cálculo de la potencia eléctrica',
        formula: 'P = V² / R',
        substitution: `P = (${formatNumber(V)} V)² / ${formatNumber(R)} Ω`,
        result: `${formatNumber(P)} W (${formatWithPrefix(P, 'W')})`,
      },
    );
  }
  // Caso 3: Voltaje y Potencia conocidos
  else if (hasV && hasP) {
    V = input.voltage as number;
    P = input.power as number;
    if (V === 0) {
      return {
        status: 'error',
        message: 'El voltaje no puede ser 0 V al despejar corriente y resistencia desde la potencia.',
      };
    }
    if (P === 0) {
      return {
        status: 'error',
        message: 'La potencia debe ser mayor a 0 W para determinar una resistencia finita.',
      };
    }
    I = P / V;
    R = (V * V) / P;
    calculatedKeys = ['current', 'resistance'];

    steps.push(
      {
        label: 'Cálculo de la corriente eléctrica',
        formula: 'I = P / V',
        substitution: `I = ${formatNumber(P)} W / ${formatNumber(V)} V`,
        result: `${formatNumber(I)} A (${formatWithPrefix(I, 'A')})`,
      },
      {
        label: 'Cálculo de la resistencia eléctrica',
        formula: 'R = V² / P',
        substitution: `R = (${formatNumber(V)} V)² / ${formatNumber(P)} W`,
        result: `${formatNumber(R)} Ω (${formatWithPrefix(R, 'Ω')})`,
      },
    );
  }
  // Caso 4: Corriente y Resistencia conocidos
  else if (hasI && hasR) {
    I = input.current as number;
    R = input.resistance as number;
    V = I * R;
    P = I * I * R;
    calculatedKeys = ['voltage', 'power'];

    steps.push(
      {
        label: 'Cálculo del voltaje (Ley de Ohm)',
        formula: 'V = I · R',
        substitution: `V = (${formatNumber(I)} A) · (${formatNumber(R)} Ω)`,
        result: `${formatNumber(V)} V (${formatWithPrefix(V, 'V')})`,
      },
      {
        label: 'Cálculo de la potencia eléctrica',
        formula: 'P = I² · R',
        substitution: `P = (${formatNumber(I)} A)² · ${formatNumber(R)} Ω`,
        result: `${formatNumber(P)} W (${formatWithPrefix(P, 'W')})`,
      },
    );
  }
  // Caso 5: Corriente y Potencia conocidos
  else if (hasI && hasP) {
    I = input.current as number;
    P = input.power as number;
    if (I === 0) {
      return {
        status: 'error',
        message: 'La corriente no puede ser 0 A al despejar voltaje y resistencia desde la potencia.',
      };
    }
    V = P / I;
    R = P / (I * I);
    calculatedKeys = ['voltage', 'resistance'];

    steps.push(
      {
        label: 'Cálculo del voltaje eléctrico',
        formula: 'V = P / I',
        substitution: `V = ${formatNumber(P)} W / ${formatNumber(I)} A`,
        result: `${formatNumber(V)} V (${formatWithPrefix(V, 'V')})`,
      },
      {
        label: 'Cálculo de la resistencia eléctrica',
        formula: 'R = P / I²',
        substitution: `R = ${formatNumber(P)} W / (${formatNumber(I)} A)²`,
        result: `${formatNumber(R)} Ω (${formatWithPrefix(R, 'Ω')})`,
      },
    );
  }
  // Caso 6: Resistencia y Potencia conocidos
  else if (hasR && hasP) {
    R = input.resistance as number;
    P = input.power as number;
    V = Math.sqrt(P * R);
    I = Math.sqrt(P / R);
    calculatedKeys = ['voltage', 'current'];

    steps.push(
      {
        label: 'Cálculo del voltaje eléctrico',
        formula: 'V = √(P · R)',
        substitution: `V = √(${formatNumber(P)} W · ${formatNumber(R)} Ω)`,
        result: `${formatNumber(V)} V (${formatWithPrefix(V, 'V')})`,
      },
      {
        label: 'Cálculo de la corriente eléctrica',
        formula: 'I = √(P / R)',
        substitution: `I = √(${formatNumber(P)} W / ${formatNumber(R)} Ω)`,
        result: `${formatNumber(I)} A (${formatWithPrefix(I, 'A')})`,
      },
    );
  }

  const summaryText = [
    'Engineering Toolkit — Ley de Ohm y Potencia',
    `Voltaje (V): ${formatWithPrefix(V, 'V')}`,
    `Corriente (I): ${formatWithPrefix(I, 'A')}`,
    `Resistencia (R): ${formatWithPrefix(R, 'Ω')}`,
    `Potencia (P): ${formatWithPrefix(P, 'W')}`,
    '',
    ...steps.map(
      (s, i) => `${i + 1}. ${s.label}: ${s.formula} => ${s.substitution} = ${s.result}`,
    ),
  ].join('\n');

  return {
    status: 'ok',
    data: {
      voltage: V,
      current: I,
      resistance: R,
      power: P,
      calculatedKeys,
      steps,
      summaryText,
    },
  };
}