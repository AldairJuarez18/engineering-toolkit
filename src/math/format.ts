export function formatNumber(value: number, maxDecimals = 4): string {
  if (!Number.isFinite(value)) return 'Indefinido';
  if (value === 0) return '0';

  const abs = Math.abs(value);
  if (abs < 1e-4 || abs >= 1e7) {
    return value.toExponential(3).replace('+', '');
  }

  return Number(value.toFixed(maxDecimals)).toString();
}

const SI_PREFIXES = [
  { factor: 1e9, symbol: 'G' },
  { factor: 1e6, symbol: 'M' },
  { factor: 1e3, symbol: 'k' },
  { factor: 1, symbol: '' },
  { factor: 1e-3, symbol: 'm' },
  { factor: 1e-6, symbol: 'µ' },
  { factor: 1e-9, symbol: 'n' },
  { factor: 1e-12, symbol: 'p' },
];

export function formatWithPrefix(value: number, baseUnit: string): string {
  if (!Number.isFinite(value)) return 'Indefinido';
  if (value === 0) return `0 ${baseUnit}`;

  const abs = Math.abs(value);
  const match =
    SI_PREFIXES.find((p) => abs >= p.factor) ?? SI_PREFIXES[SI_PREFIXES.length - 1];

  const scaled = value / match.factor;
  return `${formatNumber(scaled, 4)} ${match.symbol}${baseUnit}`;
}