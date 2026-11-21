import { useState } from 'react';
import { BookOpen, Check, Copy } from 'lucide-react';
import type { CalculationStep } from '../../types/toolkit';

interface StepByStepCardProps {
  title?: string;
  steps: CalculationStep[];
  copyText: string;
}

export function StepByStepCard({
  title = 'Desarrollo paso a paso',
  steps,
  copyText,
}: StepByStepCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3.5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar procedimiento</span>
            </>
          )}
        </button>
      </div>

      <ol className="mt-4 space-y-3.5">
        {steps.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className="rounded-lg border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {index + 1}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {step.label}
              </span>
            </div>

            <div className="mt-2.5 space-y-1.5 pl-7 font-mono text-xs sm:text-sm">
              {step.formula && (
                <p className="text-slate-500 dark:text-slate-400">
                  <span className="font-sans text-xs font-medium text-slate-400 dark:text-slate-500">
                    Fórmula:{' '}
                  </span>
                  {step.formula}
                </p>
              )}
              {step.substitution && (
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-sans text-xs font-medium text-slate-400 dark:text-slate-500">
                    Sustitución:{' '}
                  </span>
                  {step.substitution}
                </p>
              )}
              <p className="pt-0.5 font-semibold text-blue-600 dark:text-blue-400">
                <span className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400">
                  Resultado:{' '}
                </span>
                {step.result}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}