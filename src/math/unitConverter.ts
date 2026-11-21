import type { CalculationStep } from '../types/toolkit';
import { formatNumber } from './format';

export type MagnitudeId =
  | 'length'
  | 'mass'
  | 'time'
  | 'temperature'
  | 'voltage'
  | 'current'
  | 'power'
  | 'frequency'
  | 'pressure';

export interface UnitDefinition {
  id: string;
  symbol: string;
  name: string;
  /** Factor respecto a la unidad base (solo para magnitudes lineales) */
  factor?: number;
  toBase: (value: number) => number;
  fromBase: (baseValue: number) => number;
}

export interface MagnitudeDefinition {
  id: MagnitudeId;
  name: string;
  baseUnitSymbol: string;
  isLinear: boolean;
  defaultFrom: string;
  defaultTo: string;
  units: UnitDefinition[];
}

function linearUnit(id: string, symbol: string, name: string, factor: number): UnitDefinition {
  return {
    id,
    symbol,
    name,
    factor,
    toBase: (v) => v * factor,
    fromBase: (b) => b / factor,
  };
}

export const MAGNITUDES: MagnitudeDefinition[] = [
  {
    id: 'length',
    name: 'Longitud',
    baseUnitSymbol: 'm',
    isLinear: true,
    defaultFrom: 'in',
    defaultTo: 'mm',
    units: [
      linearUnit('mm', 'mm', 'Milímetros', 1e-3),
      linearUnit('cm', 'cm', 'Centímetros', 1e-2),
      linearUnit('m', 'm', 'Metros', 1),
      linearUnit('km', 'km', 'Kilómetros', 1e3),
      linearUnit('in', 'in', 'Pulgadas', 0.0254),
      linearUnit('ft', 'ft', 'Pies', 0.3048),
      linearUnit('yd', 'yd', 'Yardas', 0.9144),
      linearUnit('mi', 'mi', 'Millas', 1609.344),
    ],
  },
  {
    id: 'mass',
    name: 'Masa',
    baseUnitSymbol: 'kg',
    isLinear: true,
    defaultFrom: 'lb',
    defaultTo: 'kg',
    units: [
      linearUnit('mg', 'mg', 'Miligramos', 1e-6),
      linearUnit('g', 'g', 'Gramos', 1e-3),
      linearUnit('kg', 'kg', 'Kilogramos', 1),
      linearUnit('t', 't', 'Toneladas métricas', 1e3),
      linearUnit('oz', 'oz', 'Onzas', 0.028349523125),
      linearUnit('lb', 'lb', 'Libras', 0.45359237),
    ],
  },
  {
    id: 'time',
    name: 'Tiempo',
    baseUnitSymbol: 's',
    isLinear: true,
    defaultFrom: 'min',
    defaultTo: 's',
    units: [
      linearUnit('us', 'µs', 'Microsegundos', 1e-6),
      linearUnit('ms', 'ms', 'Milisegundos', 1e-3),
      linearUnit('s', 's', 'Segundos', 1),
      linearUnit('min', 'min', 'Minutos', 60),
      linearUnit('h', 'h', 'Horas', 3600),
      linearUnit('d', 'd', 'Días', 86400),
    ],
  },
  {
    id: 'temperature',
    name: 'Temperatura',
    baseUnitSymbol: 'K',
    isLinear: false,
    defaultFrom: 'C',
    defaultTo: 'F',
    units: [
      {
        id: 'C',
        symbol: '°C',
        name: 'Grados Celsius',
        toBase: (c) => c + 273.15,
        fromBase: (k) => k - 273.15,
      },
      {
        id: 'F',
        symbol: '°F',
        name: 'Grados Fahrenheit',
        toBase: (f) => ((f - 32) * 5) / 9 + 273.15,
        fromBase: (k) => ((k - 273.15) * 9) / 5 + 32,
      },
      {
        id: 'K',
        symbol: 'K',
        name: 'Kelvin',
        toBase: (k) => k,
        fromBase: (k) => k,
      },
      {
        id: 'R',
        symbol: '°R',
        name: 'Grados Rankine',
        toBase: (r) => (r * 5) / 9,
        fromBase: (k) => (k * 9) / 5,
      },
    ],
  },
  {
    id: 'voltage',
    name: 'Voltaje',
    baseUnitSymbol: 'V',
    isLinear: true,
    defaultFrom: 'V',
    defaultTo: 'mV',
    units: [
      linearUnit('uV', 'µV', 'Microvolts', 1e-6),
      linearUnit('mV', 'mV', 'Milivolts', 1e-3),
      linearUnit('V', 'V', 'Volts', 1),
      linearUnit('kV', 'kV', 'Kilovolts', 1e3),
      linearUnit('MV', 'MV', 'Megavolts', 1e6),
    ],
  },
  {
    id: 'current',
    name: 'Corriente',
    baseUnitSymbol: 'A',
    isLinear: true,
    defaultFrom: 'A',
    defaultTo: 'mA',
    units: [
      linearUnit('uA', 'µA', 'Microamperes', 1e-6),
      linearUnit('mA', 'mA', 'Miliamperes', 1e-3),
      linearUnit('A', 'A', 'Amperes', 1),
      linearUnit('kA', 'kA', 'Kiloamperes', 1e3),
    ],
  },
  {
    id: 'power',
    name: 'Potencia',
    baseUnitSymbol: 'W',
    isLinear: true,
    defaultFrom: 'hp',
    defaultTo: 'W',
    units: [
      linearUnit('mW', 'mW', 'Miliwatts', 1e-3),
      linearUnit('W', 'W', 'Watts', 1),
      linearUnit('kW', 'kW', 'Kilowatts', 1e3),
      linearUnit('MW', 'MW', 'Megawatts', 1e6),
      linearUnit('hp', 'hp', 'Caballos de fuerza (HP)', 745.69987158),
      linearUnit('btuh', 'BTU/h', 'BTU por hora', 0.29307107),
    ],
  },
  {
    id: 'frequency',
    name: 'Frecuencia',
    baseUnitSymbol: 'Hz',
    isLinear: true,
    defaultFrom: 'MHz',
    defaultTo: 'kHz',
    units: [
      linearUnit('Hz', 'Hz', 'Hertz', 1),
      linearUnit('kHz', 'kHz', 'Kilohertz', 1e3),
      linearUnit('MHz', 'MHz', 'Megahertz', 1e6),
      linearUnit('GHz', 'GHz', 'Gigahertz', 1e9),
      linearUnit('rpm', 'rpm', 'Revoluciones por minuto', 1 / 60),
    ],
  },
  {
    id: 'pressure',
    name: 'Presión',
    baseUnitSymbol: 'Pa',
    isLinear: true,
    defaultFrom: 'psi',
    defaultTo: 'kPa',
    units: [
      linearUnit('Pa', 'Pa', 'Pascales', 1),
      linearUnit('kPa', 'kPa', 'Kilopascales', 1e3),
      linearUnit('MPa', 'MPa', 'Megapascales', 1e6),
      linearUnit('bar', 'bar', 'Bar', 1e5),
      linearUnit('atm', 'atm', 'Atmósferas estándar', 101325),
      linearUnit('psi', 'psi', 'Libras por pulgada² (PSI)', 6894.757293),
      linearUnit('mmHg', 'mmHg', 'Milímetros de mercurio', 133.322387),
    ],
  },
];

export interface UnitConversionInput {
  magnitudeId: MagnitudeId;
  value?: number;
  fromUnitId: string;
  toUnitId: string;
}

export interface UnitEquivalenceItem {
  unit: UnitDefinition;
  value: number;
}

export interface UnitConversionResult {
  magnitude: MagnitudeDefinition;
  inputValue: number;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  outputValue: number;
  equivalences: UnitEquivalenceItem[];
  steps: CalculationStep[];
  summaryText: string;
}

export type UnitConversionOutcome =
  | { status: 'incomplete'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ok'; data: UnitConversionResult };

function buildTemperatureSteps(
  value: number,
  fromUnit: UnitDefinition,
  toUnit: UnitDefinition,
  kelvinValue: number,
  outputValue: number,
): CalculationStep[] {
  if (fromUnit.id === toUnit.id) {
    return [
      {
        label: 'Misma escala seleccionada',
        formula: `T(${toUnit.symbol}) = T(${fromUnit.symbol})`,
        substitution: `${formatNumber(value)} ${fromUnit.symbol}`,
        result: `${formatNumber(outputValue)} ${toUnit.symbol}`,
      },
    ];
  }

  // Conversiones directas más comunes en ingeniería
  if (fromUnit.id === 'C' && toUnit.id === 'F') {
    return [
      {
        label: 'Conversión directa de Celsius a Fahrenheit',
        formula: '°F = (°C · 9 / 5) + 32',
        substitution: `°F = (${formatNumber(value)} · 1.8) + 32`,
        result: `${formatNumber(outputValue)} °F`,
      },
    ];
  }

  if (fromUnit.id === 'F' && toUnit.id === 'C') {
    return [
      {
        label: 'Conversión directa de Fahrenheit a Celsius',
        formula: '°C = (°F - 32) · 5 / 9',
        substitution: `°C = (${formatNumber(value)} - 32) · 5 / 9`,
        result: `${formatNumber(outputValue)} °C`,
      },
    ];
  }

  if (fromUnit.id === 'C' && toUnit.id === 'K') {
    return [
      {
        label: 'Conversión de Celsius a Kelvin (SI)',
        formula: 'K = °C + 273.15',
        substitution: `K = ${formatNumber(value)} + 273.15`,
        result: `${formatNumber(outputValue)} K`,
      },
    ];
  }

  if (fromUnit.id === 'K' && toUnit.id === 'C') {
    return [
      {
        label: 'Conversión de Kelvin a Celsius',
        formula: '°C = K - 273.15',
        substitution: `°C = ${formatNumber(value)} - 273.15`,
        result: `${formatNumber(outputValue)} °C`,
      },
    ];
  }

  // Ruta general pasando por Kelvin
  return [
    {
      label: `Paso 1: Convertir de ${fromUnit.name} a Kelvin (base SI)`,
      formula: 'T(K) = f(T_origen)',
      substitution: `Desde ${formatNumber(value)} ${fromUnit.symbol}`,
      result: `${formatNumber(kelvinValue)} K`,
    },
    {
      label: `Paso 2: Convertir de Kelvin a ${toUnit.name}`,
      formula: `T(${toUnit.symbol}) = g(T_K)`,
      substitution: `Desde ${formatNumber(kelvinValue)} K`,
      result: `${formatNumber(outputValue)} ${toUnit.symbol}`,
    },
  ];
}

export function convertUnits(input: UnitConversionInput): UnitConversionOutcome {
  const magnitude = MAGNITUDES.find((m) => m.id === input.magnitudeId);
  if (!magnitude) {
    return { status: 'error', message: 'Magnitud física no reconocida.' };
  }

  const fromUnit = magnitude.units.find((u) => u.id === input.fromUnitId);
  const toUnit = magnitude.units.find((u) => u.id === input.toUnitId);

  if (!fromUnit || !toUnit) {
    return { status: 'error', message: 'Unidades de origen o destino no válidas.' };
  }

  if (input.value === undefined) {
    return {
      status: 'incomplete',
      message: `Ingresa un valor numérico en ${fromUnit.name} (${fromUnit.symbol}) para convertir.`,
    };
  }

  if (!Number.isFinite(input.value)) {
    return { status: 'error', message: 'El valor ingresado debe ser un número válido.' };
  }

  const baseValue = fromUnit.toBase(input.value);

  if (magnitude.id === 'temperature' && baseValue < 0) {
    return {
      status: 'error',
      message: 'La temperatura ingresada está por debajo del cero absoluto (0 K / -273.15 °C).',
    };
  }

  const outputValue = toUnit.fromBase(baseValue);

  const equivalences: UnitEquivalenceItem[] = magnitude.units.map((unit) => ({
    unit,
    value: unit.fromBase(baseValue),
  }));

  const steps: CalculationStep[] = [];

  if (magnitude.isLinear && fromUnit.factor !== undefined && toUnit.factor !== undefined) {
    const directRatio = fromUnit.factor / toUnit.factor;

    if (fromUnit.id === toUnit.id) {
      steps.push({
        label: 'Unidad de origen y destino idénticas',
        formula: `Valor (${toUnit.symbol}) = Valor (${fromUnit.symbol})`,
        substitution: `${formatNumber(input.value)} ${fromUnit.symbol}`,
        result: `${formatNumber(outputValue)} ${toUnit.symbol}`,
      });
    } else if (fromUnit.symbol === magnitude.baseUnitSymbol || toUnit.symbol === magnitude.baseUnitSymbol) {
      steps.push({
        label: `Conversión directa mediante factor SI (${fromUnit.symbol} → ${toUnit.symbol})`,
        formula: `1 ${fromUnit.symbol} = ${formatNumber(directRatio, 6)} ${toUnit.symbol}`,
        substitution: `${formatNumber(input.value)} ${fromUnit.symbol} × ${formatNumber(directRatio, 6)}`,
        result: `${formatNumber(outputValue, 6)} ${toUnit.symbol}`,
      });
    } else {
      steps.push(
        {
          label: `Conversión a unidad base del SI (${magnitude.baseUnitSymbol})`,
          formula: `Valor_base = Valor (${fromUnit.symbol}) × ${formatNumber(fromUnit.factor, 6)}`,
          substitution: `${formatNumber(input.value)} × ${formatNumber(fromUnit.factor, 6)}`,
          result: `${formatNumber(baseValue, 6)} ${magnitude.baseUnitSymbol}`,
        },
        {
          label: `Conversión de ${magnitude.baseUnitSymbol} a ${toUnit.name} (${toUnit.symbol})`,
          formula: `Resultado = Valor_base / ${formatNumber(toUnit.factor, 6)}`,
          substitution: `${formatNumber(baseValue, 6)} ${magnitude.baseUnitSymbol} / ${formatNumber(toUnit.factor, 6)}`,
          result: `${formatNumber(outputValue, 6)} ${toUnit.symbol}`,
        },
      );
    }
  } else {
    steps.push(...buildTemperatureSteps(input.value, fromUnit, toUnit, baseValue, outputValue));
  }

  const summaryText = [
    `Engineering Toolkit — Conversor de Unidades (${magnitude.name})`,
    `Entrada: ${formatNumber(input.value, 6)} ${fromUnit.symbol} (${fromUnit.name})`,
    `Resultado: ${formatNumber(outputValue, 6)} ${toUnit.symbol} (${toUnit.name})`,
    '',
    ...steps.map(
      (s, i) => `${i + 1}. ${s.label}: ${s.formula} => ${s.substitution} = ${s.result}`,
    ),
  ].join('\n');

  return {
    status: 'ok',
    data: {
      magnitude,
      inputValue: input.value,
      fromUnit,
      toUnit,
      outputValue,
      equivalences,
      steps,
      summaryText,
    },
  };
}