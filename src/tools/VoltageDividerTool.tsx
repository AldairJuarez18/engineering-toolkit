import { useMemo, useState } from 'react';
import { GitCommitHorizontal, RotateCcw } from 'lucide-react';
import {
  RESISTANCE_UNITS,
  VOLTAGE_UNITS,
  type ResistanceUnit,
  type VoltageUnit,
} from '../math/electronics/ohmLaw';
import { solveVoltageDivider } from '../math/electronics/voltageDivider';
import { formatNumber, formatWithPrefix } from '../math/format';
import { StepByStepCard } from '../components/shared/StepByStepCard';

export function VoltageDividerTool() {
  const [vinRaw, setVinRaw] = useState('12');
  const [r1Raw, setR1Raw] = useState('10');
  const [r2Raw, setR2Raw] = useState('4.7');

  const [vinUnit, setVinUnit] = useState<VoltageUnit>('V');
  const [r1Unit, setR1Unit] = useState<ResistanceUnit>('kΩ');
  const [r2Unit, setR2Unit] = useState<ResistanceUnit>('kΩ');

  const handleReset = () => {
    setVinRaw('');
    setR1Raw('');
    setR2Raw('');
  };

  const outcome = useMemo(() => {
    const parseVal = (raw: string, factor: number): number | undefined => {
      if (raw.trim() === '') return undefined;
      const num = Number(raw);
      return Number.isNaN(num) ? NaN : num * factor;
    };

    return solveVoltageDivider({
      vin: parseVal(vinRaw, VOLTAGE_UNITS[vinUnit]),
      r1: parseVal(r1Raw, RESISTANCE_UNITS[r1Unit]),
      r2: parseVal(r2Raw, RESISTANCE_UNITS[r2Unit]),
    });
  }, [vinRaw, r1Raw, r2Raw, vinUnit, r1Unit, r2Unit]);

  return (
    <div className="space-y-6">
      {/* Barra de acción */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
          Parámetros del circuito
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar campos
        </button>
      </div>

      {/* Entradas + Diagrama esquemático */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controles */}
        <div className="space-y-4 lg:col-span-7">
          {/* Vin */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <label
              htmlFor="vd-vin"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Voltaje de entrada (Vin)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="vd-vin"
                type="number"
                step="any"
                value={vinRaw}
                onChange={(e) => setVinRaw(e.target.value)}
                placeholder="Ej. 12"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <select
                value={vinUnit}
                onChange={(e) => setVinUnit(e.target.value as VoltageUnit)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="mV">mV</option>
                <option value="V">V</option>
                <option value="kV">kV</option>
              </select>
            </div>
          </div>

          {/* R1 y R2 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <label
                htmlFor="vd-r1"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Resistencia superior (R1)
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="vd-r1"
                  type="number"
                  step="any"
                  min="0"
                  value={r1Raw}
                  onChange={(e) => setR1Raw(e.target.value)}
                  placeholder="Ej. 10"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <select
                  value={r1Unit}
                  onChange={(e) => setR1Unit(e.target.value as ResistanceUnit)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="Ω">Ω</option>
                  <option value="kΩ">kΩ</option>
                  <option value="MΩ">MΩ</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
              <label
                htmlFor="vd-r2"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Resistencia inferior (R2)
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="vd-r2"
                  type="number"
                  step="any"
                  min="0"
                  value={r2Raw}
                  onChange={(e) => setR2Raw(e.target.value)}
                  placeholder="Ej. 4.7"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <select
                  value={r2Unit}
                  onChange={(e) => setR2Unit(e.target.value as ResistanceUnit)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="Ω">Ω</option>
                  <option value="kΩ">kΩ</option>
                  <option value="MΩ">MΩ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Diagrama visual del divisor */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4 lg:col-span-5 dark:border-slate-800 dark:bg-slate-950/40">
          <span className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Esquema de referencia
          </span>
          <svg
            viewBox="0 0 220 190"
            className="h-44 w-full max-w-[220px] text-slate-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Nodo Vin */}
            <circle cx="80" cy="20" r="3.5" className="fill-blue-500 stroke-blue-500" />
            <text
              x="66"
              y="24"
              textAnchor="end"
              stroke="none"
              className="fill-blue-600 font-mono text-[12px] font-bold dark:fill-blue-400"
            >
              Vin
            </text>

            {/* Línea superior a R1 */}
            <line x1="80" y1="24" x2="80" y2="42" />
            {/* Resistor R1 */}
            <rect
              x="68"
              y="42"
              width="24"
              height="42"
              rx="3"
              className="fill-white dark:fill-slate-900"
            />
            <text
              x="58"
              y="67"
              textAnchor="end"
              stroke="none"
              className="fill-current font-mono text-[11px] font-semibold"
            >
              R1
            </text>

            {/* Línea intermedia + derivación Vout */}
            <line x1="80" y1="84" x2="80" y2="112" />
            <line x1="80" y1="98" x2="145" y2="98" className="stroke-emerald-500" />
            <circle cx="80" cy="98" r="3" className="fill-emerald-500 stroke-emerald-500" />
            <circle cx="148" cy="98" r="3.5" className="fill-emerald-500 stroke-emerald-500" />
            <text
              x="157"
              y="102"
              stroke="none"
              className="fill-emerald-600 font-mono text-[12px] font-bold dark:fill-emerald-400"
            >
              Vout
            </text>

            {/* Resistor R2 */}
            <rect
              x="68"
              y="112"
              width="24"
              height="42"
              rx="3"
              className="fill-white dark:fill-slate-900"
            />
            <text
              x="58"
              y="137"
              textAnchor="end"
              stroke="none"
              className="fill-current font-mono text-[11px] font-semibold"
            >
              R2
            </text>

            {/* Línea a GND */}
            <line x1="80" y1="154" x2="80" y2="170" />
            <line x1="66" y1="170" x2="94" y2="170" />
            <line x1="71" y1="175" x2="89" y2="175" />
            <line x1="76" y1="180" x2="84" y2="180" />
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
          <div>
            <div className="mb-3 flex items-center gap-2">
              <GitCommitHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Resultados del divisor
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Voltaje de salida (Vout)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.vout, 'V')}
                </p>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  ({formatNumber(outcome.data.ratio * 100, 2)}% de Vin)
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Caída en R1 (VR1)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.vr1, 'V')}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Corriente de rama (I)
                </span>
                <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.current, 'A')}
                </p>
              </div>
            </div>
          </div>

          <StepByStepCard steps={outcome.data.steps} copyText={outcome.data.summaryText} />
        </div>
      )}
    </div>
  );
}