import { useMemo, useState } from 'react';
import { Info, RotateCcw, Zap } from 'lucide-react';
import {
  CURRENT_UNITS,
  POWER_UNITS,
  RESISTANCE_UNITS,
  VOLTAGE_UNITS,
  solveOhmLaw,
  type CurrentUnit,
  type OhmVariableKey,
  type PowerUnit,
  type ResistanceUnit,
  type VoltageUnit,
} from '../math/electronics/ohmLaw';
import { formatWithPrefix } from '../math/format';
import { StepByStepCard } from '../components/shared/StepByStepCard';

export function OhmLawTool() {
  const [voltageRaw, setVoltageRaw] = useState('');
  const [currentRaw, setCurrentRaw] = useState('');
  const [resistanceRaw, setResistanceRaw] = useState('');
  const [powerRaw, setPowerRaw] = useState('');

  const [voltageUnit, setVoltageUnit] = useState<VoltageUnit>('V');
  const [currentUnit, setCurrentUnit] = useState<CurrentUnit>('mA');
  const [resistanceUnit, setResistanceUnit] = useState<ResistanceUnit>('Ω');
  const [powerUnit, setPowerUnit] = useState<PowerUnit>('W');

  const activeKeys = useMemo(() => {
    const keys: OhmVariableKey[] = [];
    if (voltageRaw.trim() !== '') keys.push('voltage');
    if (currentRaw.trim() !== '') keys.push('current');
    if (resistanceRaw.trim() !== '') keys.push('resistance');
    if (powerRaw.trim() !== '') keys.push('power');
    return keys;
  }, [voltageRaw, currentRaw, resistanceRaw, powerRaw]);

  const outcome = useMemo(() => {
    const parseVal = (raw: string, factor: number): number | undefined => {
      if (raw.trim() === '') return undefined;
      const num = Number(raw);
      return Number.isNaN(num) ? NaN : num * factor;
    };

    return solveOhmLaw({
      voltage: parseVal(voltageRaw, VOLTAGE_UNITS[voltageUnit]),
      current: parseVal(currentRaw, CURRENT_UNITS[currentUnit]),
      resistance: parseVal(resistanceRaw, RESISTANCE_UNITS[resistanceUnit]),
      power: parseVal(powerRaw, POWER_UNITS[powerUnit]),
    });
  }, [
    voltageRaw,
    currentRaw,
    resistanceRaw,
    powerRaw,
    voltageUnit,
    currentUnit,
    resistanceUnit,
    powerUnit,
  ]);

  const handleReset = () => {
    setVoltageRaw('');
    setCurrentRaw('');
    setResistanceRaw('');
    setPowerRaw('');
  };

  const isFieldLocked = (key: OhmVariableKey) =>
    activeKeys.length >= 2 && !activeKeys.includes(key);

  const isCalculatedField = (key: OhmVariableKey) =>
    outcome.status === 'ok' && outcome.data.calculatedKeys.includes(key);

  return (
    <div className="space-y-6">
      {/* Encabezado de instrucciones y botón limpiar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200/80 bg-blue-50/70 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/30">
        <div className="flex items-center gap-2.5 text-xs text-blue-900 sm:text-sm dark:text-blue-200">
          <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            Introduce <strong>dos magnitudes conocidas</strong>; las otras dos se despejarán
            automáticamente.
          </span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={activeKeys.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Limpiar campos
        </button>
      </div>

      {/* Grid de 4 magnitudes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Voltaje */}
        <div
          className={`rounded-xl border p-4 transition-colors ${
            isCalculatedField('voltage')
              ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20'
              : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="ohm-voltage"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Voltaje (V)
            </label>
            {isCalculatedField('voltage') && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Calculado
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="ohm-voltage"
              type="number"
              step="any"
              value={voltageRaw}
              disabled={isFieldLocked('voltage')}
              onChange={(e) => setVoltageRaw(e.target.value)}
              placeholder={
                outcome.status === 'ok' && isCalculatedField('voltage')
                  ? formatWithPrefix(outcome.data.voltage, 'V')
                  : 'Ej. 12'
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/60"
            />
            <select
              value={voltageUnit}
              disabled={isFieldLocked('voltage')}
              onChange={(e) => setVoltageUnit(e.target.value as VoltageUnit)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="mV">mV</option>
              <option value="V">V</option>
              <option value="kV">kV</option>
            </select>
          </div>
        </div>

        {/* Corriente */}
        <div
          className={`rounded-xl border p-4 transition-colors ${
            isCalculatedField('current')
              ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20'
              : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="ohm-current"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Corriente (I)
            </label>
            {isCalculatedField('current') && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Calculado
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="ohm-current"
              type="number"
              step="any"
              value={currentRaw}
              disabled={isFieldLocked('current')}
              onChange={(e) => setCurrentRaw(e.target.value)}
              placeholder={
                outcome.status === 'ok' && isCalculatedField('current')
                  ? formatWithPrefix(outcome.data.current, 'A')
                  : 'Ej. 250'
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/60"
            />
            <select
              value={currentUnit}
              disabled={isFieldLocked('current')}
              onChange={(e) => setCurrentUnit(e.target.value as CurrentUnit)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="µA">µA</option>
              <option value="mA">mA</option>
              <option value="A">A</option>
            </select>
          </div>
        </div>

        {/* Resistencia */}
        <div
          className={`rounded-xl border p-4 transition-colors ${
            isCalculatedField('resistance')
              ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20'
              : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="ohm-resistance"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Resistencia (R)
            </label>
            {isCalculatedField('resistance') && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Calculado
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="ohm-resistance"
              type="number"
              step="any"
              value={resistanceRaw}
              disabled={isFieldLocked('resistance')}
              onChange={(e) => setResistanceRaw(e.target.value)}
              placeholder={
                outcome.status === 'ok' && isCalculatedField('resistance')
                  ? formatWithPrefix(outcome.data.resistance, 'Ω')
                  : 'Ej. 330'
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/60"
            />
            <select
              value={resistanceUnit}
              disabled={isFieldLocked('resistance')}
              onChange={(e) => setResistanceUnit(e.target.value as ResistanceUnit)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="Ω">Ω</option>
              <option value="kΩ">kΩ</option>
              <option value="MΩ">MΩ</option>
            </select>
          </div>
        </div>

        {/* Potencia */}
        <div
          className={`rounded-xl border p-4 transition-colors ${
            isCalculatedField('power')
              ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20'
              : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="ohm-power"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Potencia (P)
            </label>
            {isCalculatedField('power') && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Calculado
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              id="ohm-power"
              type="number"
              step="any"
              value={powerRaw}
              disabled={isFieldLocked('power')}
              onChange={(e) => setPowerRaw(e.target.value)}
              placeholder={
                outcome.status === 'ok' && isCalculatedField('power')
                  ? formatWithPrefix(outcome.data.power, 'W')
                  : 'Ej. 5'
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/60"
            />
            <select
              value={powerUnit}
              disabled={isFieldLocked('power')}
              onChange={(e) => setPowerUnit(e.target.value as PowerUnit)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="mW">mW</option>
              <option value="W">W</option>
              <option value="kW">kW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Área de resultados o alertas */}
      {outcome.status === 'error' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
          {outcome.message}
        </div>
      )}

      {outcome.status === 'ok' && (
        <div className="space-y-6 pt-2">
          {/* Resumen de 4 valores */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Resultados del circuito
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">Voltaje (V)</span>
                <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.voltage, 'V')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">Corriente (I)</span>
                <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.current, 'A')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">Resistencia (R)</span>
                <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.resistance, 'Ω')}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950/50">
                <span className="text-xs text-slate-500 dark:text-slate-400">Potencia (P)</span>
                <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {formatWithPrefix(outcome.data.power, 'W')}
                </p>
              </div>
            </div>
          </div>

          {/* Procedimiento paso a paso */}
          <StepByStepCard steps={outcome.data.steps} copyText={outcome.data.summaryText} />
        </div>
      )}
    </div>
  );
}