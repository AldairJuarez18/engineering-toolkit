import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw, Scale } from 'lucide-react';
import {
  MAGNITUDES,
  convertUnits,
  type MagnitudeId,
} from '../math/unitConverter';
import { formatNumber } from '../math/format';
import { StepByStepCard } from '../components/shared/StepByStepCard';

export function UnitConverterTool() {
  const [magnitudeId, setMagnitudeId] = useState<MagnitudeId>('length');
  const currentMagnitude = useMemo(
    () => MAGNITUDES.find((m) => m.id === magnitudeId) ?? MAGNITUDES[0],
    [magnitudeId],
  );

  const [valueRaw, setValueRaw] = useState('1');
  const [fromUnitId, setFromUnitId] = useState(currentMagnitude.defaultFrom);
  const [toUnitId, setToUnitId] = useState(currentMagnitude.defaultTo);

  const handleSelectMagnitude = (nextId: MagnitudeId) => {
    const nextMag = MAGNITUDES.find((m) => m.id === nextId);
    if (!nextMag) return;
    setMagnitudeId(nextId);
    setFromUnitId(nextMag.defaultFrom);
    setToUnitId(nextMag.defaultTo);
  };

  const handleSwapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleReset = () => {
    setValueRaw('');
  };

  const outcome = useMemo(() => {
    const trimmed = valueRaw.trim();
    const parsed = trimmed === '' ? undefined : Number(trimmed);

    return convertUnits({
      magnitudeId,
      value: parsed,
      fromUnitId,
      toUnitId,
    });
  }, [magnitudeId, valueRaw, fromUnitId, toUnitId]);

  return (
    <div className="space-y-6">
      {/* Selector de las 9 magnitudes */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Selecciona la magnitud física ({MAGNITUDES.length} disponibles)
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpiar valor
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {MAGNITUDES.map((mag) => {
            const isActive = mag.id === magnitudeId;
            return (
              <button
                key={mag.id}
                type="button"
                onClick={() => handleSelectMagnitude(mag.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {mag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de entrada y selección de unidades */}
      <div className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-12 dark:border-slate-800 dark:bg-slate-950/40">
        {/* Valor */}
        <div className="md:col-span-4">
          <label
            htmlFor="uc-value"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Valor a convertir
          </label>
          <input
            id="uc-value"
            type="number"
            step="any"
            value={valueRaw}
            onChange={(e) => setValueRaw(e.target.value)}
            placeholder="Ej. 10"
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Unidad origen */}
        <div className="md:col-span-3">
          <label
            htmlFor="uc-from"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            De (origen)
          </label>
          <select
            id="uc-from"
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {currentMagnitude.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Botón invertir */}
        <div className="flex justify-center md:col-span-2">
          <button
            type="button"
            onClick={handleSwapUnits}
            title="Intercambiar unidades"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 md:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeftRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="md:hidden">Invertir unidades</span>
          </button>
        </div>

        {/* Unidad destino */}
        <div className="md:col-span-3">
          <label
            htmlFor="uc-to"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            A (destino)
          </label>
          <select
            id="uc-to"
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {currentMagnitude.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
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
          {/* Resultado principal */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Scale className="h-4 w-4" />
              <span>Resultado de la conversión ({outcome.data.magnitude.name})</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              {formatNumber(outcome.data.inputValue, 6)} {outcome.data.fromUnit.symbol} ={' '}
              <span className="text-blue-600 dark:text-blue-400">
                {formatNumber(outcome.data.outputValue, 6)} {outcome.data.toUnit.symbol}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {outcome.data.fromUnit.name} a {outcome.data.toUnit.name}
            </p>
          </div>

          {/* Tabla de equivalencias simultáneas */}
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Equivalencias en todas las unidades de {outcome.data.magnitude.name.toLowerCase()}
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {outcome.data.equivalences.map((item) => {
                const isTarget = item.unit.id === outcome.data.toUnit.id;
                return (
                  <button
                    key={item.unit.id}
                    type="button"
                    onClick={() => setToUnitId(item.unit.id)}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      isTarget
                        ? 'border-blue-400 bg-blue-50/70 dark:border-blue-600 dark:bg-blue-950/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                      {item.unit.name}
                    </span>
                    <span className="mt-1 block truncate font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {formatNumber(item.value, 5)} {item.unit.symbol}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Procedimiento paso a paso */}
          <StepByStepCard steps={outcome.data.steps} copyText={outcome.data.summaryText} />
        </div>
      )}
    </div>
  );
}