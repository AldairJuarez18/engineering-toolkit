import type { CalculationStep } from '../../types/toolkit';
import { formatNumber, formatWithPrefix } from '../format';

export type ConnectionMode = 'series' | 'parallel';

export interface ResistorsResult {
  mode: ConnectionMode;
  resistances: number[]; // en Ohms (Ω)
  equivalentResistance: number; // en Ohms (Ω)
  steps: CalculationStep[];
  summaryText: string;
}

export type ResistorsOutcome =
  | { status: 'incomplete'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: ResistorsResult };

export function solveResistors(
  mode: ConnectionMode,
  resistances: (number | undefined)[],
): ResistorsOutcome {
  if (resistances.length < 2) {
    return {
      status: 'error',
      message: 'Se necesitan al menos dos resistencias para calcular un arreglo.',
    };
  }

  for (let i = 0; i < resistances.length; i += 1) {
    const val = resistances[i];
    if (val === undefined) {
      return {
        status: 'incomplete',
        message: 'Completa el valor de todas las resistencias agregadas para calcular.',
      };
    }
    if (!Number.isFinite(val) || val <= 0) {
      return {
        status: 'error',
        message: `La resistencia R${i + 1} debe ser un número mayor a 0 Ω.`,
      };
    }
  }

  const validValues = resistances as number[];
  const steps: CalculationStep[] = [];
  let equivalentResistance = 0;

  if (mode === 'series') {
    equivalentResistance = validValues.reduce((acc, r) => acc + r, 0);

    const formulaTerms = validValues.map((_, i) => `R${i + 1}`).join(' + ');
    const subTerms = validValues.map((r) => `${formatNumber(r)} Ω`).join(' + ');

    steps.push({
      label: 'Suma directa de resistencias en serie',
      formula: `Req = ${formulaTerms}`,
      substitution: `Req = ${subTerms}`,
      result: `${formatNumber(equivalentResistance)} Ω (${formatWithPrefix(equivalentResistance, 'Ω')})`,
    });
  } else {
    const inverseSum = validValues.reduce((acc, r) => acc + 1 / r, 0);
    equivalentResistance = 1 / inverseSum;

    const formulaTerms = validValues.map((_, i) => `(1 / R${i + 1})`).join(' + ');
    const subTerms = validValues.map((r) => `(1 / ${formatNumber(r)} Ω)`).join(' + ');

    steps.push(
      {
        label: 'Suma de los recíprocos (conductancias)',
        formula: `1 / Req = ${formulaTerms}`,
        substitution: `1 / Req = ${subTerms}`,
        result: `1 / Req = ${formatNumber(inverseSum, 6)} Ω⁻¹`,
      },
      {
        label: 'Despeje de la resistencia equivalente en paralelo',
        formula: 'Req = 1 / (1 / Req)',
        substitution: `Req = 1 / ${formatNumber(inverseSum, 6)} Ω⁻¹`,
        result: `${formatNumber(equivalentResistance)} Ω (${formatWithPrefix(equivalentResistance, 'Ω')})`,
      },
    );
  }

  const modeLabel = mode === 'series' ? 'Serie' : 'Paralelo';
  const summaryText = [
    `Engineering Toolkit — Resistencias en ${modeLabel}`,
    ...validValues.map((r, i) => `R${i + 1}: ${formatWithPrefix(r, 'Ω')}`),
    `Resistencia Equivalente (Req): ${formatWithPrefix(equivalentResistance, 'Ω')} (${formatNumber(equivalentResistance)} Ω)`,
    '',
    ...steps.map(
      (s, i) => `${i + 1}. ${s.label}: ${s.formula} => ${s.substitution} = ${s.result}`,
    ),
  ].join('\n');

  return {
    status: 'ok',
    data: {
      mode,
      resistances: validValues,
      equivalentResistance,
      steps,
      summaryText,
    },
  };
}