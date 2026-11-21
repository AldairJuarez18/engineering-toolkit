import { useMemo, useState } from 'react';
import { Cpu, Plus, RotateCcw, Trash2 } from 'lucide-react';
import {
  RESISTANCE_UNITS,
  type ResistanceUnit,
} from '../math/electronics/ohmLaw';
import { solveResistors, type ConnectionMode } from '../math/electronics/resistors';
import { formatNumber, formatWithPrefix } from '../math/format';
import { StepByStepCard } from '../components/shared/StepByStepCard';

interface ResistorField {
  id: string;
  raw: string;
  unit: ResistanceUnit;
}

const INITIAL_RESISTORS: ResistorField[] = [
  { id: 'r-1', raw: '100', unit: 'Ω' },
  { id: 'r-2', raw: '220', unit: 'Ω' },
];

export function ResistorsTool() {
  const [mode, setMode] = useState<ConnectionMode>('series');
  const [resistors, setResistors] = useState<ResistorField[]>(INITIAL_RESISTORS);

  const handleAddResistor = () => {
    setResistors((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}-${prev.length}`,
        raw: '',
        unit: 'Ω',
      },
    ]);
  };

  const handleRemoveResistor = (id: string) => {
    if (resistors.length <= 2) return;
    setResistors((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateValue = (id: string, raw: string) => {
    setResistors((prev) =>
      prev.map((item) => (item.id === id ? { ...item, raw } : item)),
    );
  };

  const handleUpdateUnit = (id: string, unit: ResistanceUnit) => {
    setResistors((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unit } : item)),
    );
  };

  const handleReset = () => {
    setResistors([
      { id: 'r-reset-1', raw: '', unit: 'Ω' },
      { id: 'r-reset-2', raw: '', unit: 'Ω' },
    ]);
  };

  const outcome = useMemo(() => {
    const valuesInOhms = resistors.map((item) => {
      if (item.raw.trim() === '') return undefined;
      const num = Number(item.raw);
      return Number.isNaN(num) ? NaN : num * RESISTANCE_UNITS[item.unit];
    });

    return solveResistors(mode, valuesInOhms);
  }, [mode, resistors]);

  return (
    <div className="space-y-6">
      {/* Selector de tipo de conexión y acciones */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
          <button
            type="button"
            onClick={() => setMode('series')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              mode === 'series'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Conexión en Serie
          </button>
          <button
            type="button"
            onClick={() => setMode('parallel')}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              mode === 'parallel'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-blue-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Conexión en Paralelo
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar valores
        </button>
      </div>

      {/* Lista dinámica de resistencias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Resistencias del arreglo ({resistors.length})
          </span>
          <button
            type="button"
            onClick={handleAddResistor}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar resistencia
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {resistors.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                R{index + 1}
              </span>

              <input
                type="number"
                step="any"
                min="0"
                value={item.raw}
                onChange={(e) => handleUpdateValue(item.id, e.target.value)}
                placeholder="Ej. 330"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <select
                value={item.unit}
                onChange={(e) =>
                  handleUpdateUnit(item.id, e.target.value as ResistanceUnit)
                }
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Ω">Ω</option>
                <option value="kΩ">kΩ</option>
                <option value="MΩ">MΩ</option>
              </select>

              <button
                type="button"
                onClick={() => handleRemoveResistor(item.id)}
                disabled={resistors.length <= 2}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label={`Eliminar R${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mensajes de estado o resultados */}
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
          {/* Tarjeta destacada de Resistencia Equivalente */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Cpu className="h-4 w-4" />
              <span>
                Resistencia Equivalente ({mode === 'series' ? 'Serie' : 'Paralelo'})
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <p className="font-mono text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                {formatWithPrefix(outcome.data.equivalentResistance, 'Ω')}
              </p>
              <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                ({formatNumber(outcome.data.equivalentResistance)} Ω)
              </span>
            </div>
          </div>

          <StepByStepCard steps={outcome.data.steps} copyText={outcome.data.summaryText} />
        </div>
      )}
    </div>
  );
}