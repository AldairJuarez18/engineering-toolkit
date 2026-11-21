import { useMemo, useState } from 'react';
import { Activity, RotateCcw } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  RESISTANCE_UNITS,
  type ResistanceUnit,
} from '../math/electronics/ohmLaw';
import {
  CAPACITANCE_UNITS,
  solveRcFilter,
  type CapacitanceUnit,
  type FilterType,
  type FrequencyPoint,
} from '../math/electronics/rcFilters';
import { formatNumber, formatWithPrefix } from '../math/format';
import { StepByStepCard } from '../components/shared/StepByStepCard';

interface BodeTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: FrequencyPoint }>;
}

function BodeTooltip({ active, payload }: BodeTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
      <p className="font-mono font-bold text-slate-900 dark:text-white">
        f = {point.frequencyLabel}
        {point.isCutoff ? ' (Corte fc)' : ''}
      </p>
      <div className="mt-1.5 space-y-1 font-mono text-slate-600 dark:text-slate-300">
        <p>
          Ganancia:{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {point.gainDb} dB
          </span>
        </p>
        <p>|H(f)|: {point.magnitude}</p>
        <p>Desfase: {point.phaseDeg}°</p>
      </div>
    </div>
  );
}

export function RcFiltersTool() {
  const [filterType, setFilterType] = useState<FilterType>('low-pass');
  const [rRaw, setRRaw] = useState('1');
  const [cRaw, setCRaw] = useState('100');

  const [rUnit, setRUnit] = useState<ResistanceUnit>('kΩ');
  const [cUnit, setCUnit] = useState<CapacitanceUnit>('nF');

  const handleReset = () => {
    setRRaw('');
    setCRaw('');
  };

  const outcome = useMemo(() => {
    const parseVal = (raw: string, factor: number): number | undefined => {
      if (raw.trim() === '') return undefined;
      const num = Number(raw);
      return Number.isNaN(num) ? NaN : num * factor;
    };

    return solveRcFilter({
      type: filterType,
      resistance: parseVal(rRaw, RESISTANCE_UNITS[rUnit]),
      capacitance: parseVal(cRaw, CAPACITANCE_UNITS[cUnit]),
    });
  }, [filterType, rRaw, cRaw, rUnit, cUnit]);

  return (
    <div className="space-y-6">
      {/* Selector de topología y botón limpiar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => setFilterType('low-pass')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              filterType === 'low-pass'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Filtro Pasa Bajas
          </button>
          <button
            type="button"
            onClick={() => setFilterType('high-pass')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              filterType === 'high-pass'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Filtro Pasa Altas
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar campos
        </button>
      </div>

      {/* Entradas + Diagrama del filtro RC */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-1">
          {/* Resistencia */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <label
              htmlFor="rc-r"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Resistencia (R)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="rc-r"
                type="number"
                step="any"
                min="0"
                value={rRaw}
                onChange={(e) => setRRaw(e.target.value)}
                placeholder="Ej. 1"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <select
                value={rUnit}
                onChange={(e) => setRUnit(e.target.value as ResistanceUnit)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Ω">Ω</option>
                <option value="kΩ">kΩ</option>
                <option value="MΩ">MΩ</option>
              </select>
            </div>
          </div>

          {/* Capacitor */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <label
              htmlFor="rc-c"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Capacitor (C)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="rc-c"
                type="number"
                step="any"
                min="0"
                value={cRaw}
                onChange={(e) => setCRaw(e.target.value)}
                placeholder="Ej. 100"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <select
                value={cUnit}
                onChange={(e) => setCUnit(e.target.value as CapacitanceUnit)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="pF">pF</option>
                <option value="nF">nF</option>
                <option value="µF">µF</option>
                <option value="mF">mF</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diagrama dinámico Pasa Bajas / Pasa Altas */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:col-span-5 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Topología {filterType === 'low-pass' ? 'RC Pasa Bajas' : 'CR Pasa Altas'}
          </span>

          <svg
            viewBox="0 0 240 165"
            className="h-40 w-full max-w-[240px] text-slate-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Vin */}
            <circle cx="24" cy="48" r="3.5" className="fill-blue-500 stroke-blue-500" />
            <text
              x="24"
              y="34"
              textAnchor="middle"
              stroke="none"
              className="fill-blue-600 font-mono text-[11px] font-bold dark:fill-blue-400"
            >
              Vin
            </text>
            <line x1="28" y1="48" x2="56" y2="48" />

            {/* Elemento serie (R en Pasa Bajas, C en Pasa Altas) */}
            {filterType === 'low-pass' ? (
              <>
                <rect
                  x="56"
                  y="37"
                  width="46"
                  height="22"
                  rx="3"
                  className="fill-white dark:fill-slate-900"
                />
                <text
                  x="79"
                  y="28"
                  textAnchor="middle"
                  stroke="none"
                  className="fill-current font-mono text-[11px] font-semibold"
                >
                  R
                </text>
              </>
            ) : (
              <>
                <line x1="56" y1="48" x2="74" y2="48" />
                <line x1="74" y1="34" x2="74" y2="62" strokeWidth="2.5" />
                <line x1="84" y1="34" x2="84" y2="62" strokeWidth="2.5" />
                <line x1="84" y1="48" x2="102" y2="48" />
                <text
                  x="79"
                  y="26"
                  textAnchor="middle"
                  stroke="none"
                  className="fill-current font-mono text-[11px] font-semibold"
                >
                  C
                </text>
              </>
            )}

            {/* Nodo central hacia Vout */}
            <line x1="102" y1="48" x2="196" y2="48" />
            <circle cx="135" cy="48" r="3" className="fill-emerald-500 stroke-emerald-500" />
            <circle cx="200" cy="48" r="3.5" className="fill-emerald-500 stroke-emerald-500" />
            <text
              x="200"
              y="34"
              textAnchor="middle"
              stroke="none"
              className="fill-emerald-600 font-mono text-[11px] font-bold dark:fill-emerald-400"
            >
              Vout
            </text>

            {/* Rama paralela a GND (C en Pasa Bajas, R en Pasa Altas) */}
            {filterType === 'low-pass' ? (
              <>
                <line x1="135" y1="48" x2="135" y2="82" />
                <line x1="120" y1="82" x2="150" y2="82" strokeWidth="2.5" />
                <line x1="120" y1="92" x2="150" y2="92" strokeWidth="2.5" />
                <line x1="135" y1="92" x2="135" y2="128" />
                <text
                  x="160"
                  y="91"
                  stroke="none"
                  className="fill-current font-mono text-[11px] font-semibold"
                >
                  C
                </text>
              </>
            ) : (
              <>
                <line x1="135" y1="48" x2="135" y2="68" />
                <rect
                  x="124"
                  y="68"
                  width="22"
                  height="42"
                  rx="3"
                  className="fill-white dark:fill-slate-900"
                />
                <line x1="135" y1="110" x2="135" y2="128" />
                <text
                  x="156"
                  y="93"
                  stroke="none"
                  className="fill-current font-mono text-[11px] font-semibold"
                >
                  R
                </text>
              </>
            )}

            {/* Tierra GND */}
            <line x1="121" y1="128" x2="149" y2="128" />
            <line x1="126" y1="133" x2="144" y2="133" />
            <line x1="131" y1="138" x2="139" y2="138" />
          </svg>
        </div>
      </div>

      {/* Alertas o Resultados */}
      {outcome.status === 'incomplete' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          {outcome.message}
        </div>
      )}

      {outcome.status === 'error' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
          {outcome.message}
        </div>
      )}

      {outcome.status === 'ok' && (
        <div className="space-y-6 pt-2">
          {/* 3 métricas clave */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Parámetros de corte del filtro
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Frecuencia de corte (fc)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.cutoffFrequency, 'Hz')}
                </p>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  ({formatNumber(outcome.data.cutoffFrequency)} Hz)
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Constante de tiempo (τ)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.timeConstant, 's')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Frecuencia angular (ωc)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(outcome.data.angularCutoff)} rad/s
                </p>
              </div>
            </div>
          </div>

          {/* Gráfica de respuesta en frecuencia (Bode dB) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Curva de respuesta en frecuencia (Magnitud en dB)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Barrido logarítmico de 0.01·fc a 100·fc. Pasa el cursor sobre la curva para ver cada punto.
                </p>
              </div>
              <span className="rounded-md bg-amber-100 px-2.5 py-1 font-mono text-xs font-semibold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                Corte -3 dB @ {formatWithPrefix(outcome.data.cutoffFrequency, 'Hz')}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={outcome.data.curve}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#64748b" opacity={0.2} />
                  <XAxis
                    dataKey="frequencyLabel"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    interval={9}
                  />
                  <YAxis
                    domain={[-45, 5]}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    unit=" dB"
                    width={54}
                  />
                  <Tooltip content={<BodeTooltip />} />
                  <ReferenceLine
                    y={-3.01}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    label={{
                      value: '-3 dB',
                      position: 'insideBottomRight',
                      fill: '#f59e0b',
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gainDb"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Procedimiento paso a paso */}
          <StepByStepCard steps={outcome.data.steps} copyText={outcome.data.summaryText} />
        </div>
      )}
    </div>
  );
}