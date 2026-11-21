import { ArrowRight, Clock, Lock, SearchX, Star } from 'lucide-react';
import type { Category, ToolItem } from '../../types/toolkit';

interface ToolCatalogProps {
  title: string;
  subtitle: string;
  tools: ToolItem[];
  categories: Category[];
  favoriteIds: string[];
  onToggleFavorite: (toolId: string) => void;
  onSelectTool: (tool: ToolItem) => void;
  onResetFilters: () => void;
}

export function ToolCatalog({
  title,
  subtitle,
  tools,
  categories,
  favoriteIds,
  onToggleFavorite,
  onSelectTool,
  onResetFilters,
}: ToolCatalogProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      {/* Encabezado de sección */}
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      {/* Estado vacío si la búsqueda no coincide */}
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <SearchX className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No encontramos herramientas con ese criterio
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Intenta buscar por otra magnitud física, componente o regresa al catálogo completo.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Ver todas las herramientas
          </button>
        </div>
      ) : (
        /* Grid de tarjetas */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const isAvailable = tool.status === 'available';
            const isFavorite = favoriteIds.includes(tool.id);
            const categoryName = categoryMap.get(tool.categoryId) ?? 'Ingeniería';

            return (
              <article
                key={tool.id}
                onClick={() => {
                  if (isAvailable) onSelectTool(tool);
                }}
                className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all ${
                  isAvailable
                    ? 'cursor-pointer border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/60'
                    : 'border-slate-200/80 bg-slate-100/60 opacity-80 dark:border-slate-800/80 dark:bg-slate-900/30'
                }`}
              >
                <div>
                  {/* Fila superior: categoría + acciones */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {categoryName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {tool.tier === 'pro' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                          <Lock className="h-3 w-3" />
                          Pro
                        </span>
                      )}

                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(tool.id);
                          }}
                          className={`rounded-lg p-1.5 transition-colors ${
                            isFavorite
                              ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                          }`}
                          aria-label={
                            isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`}
                          />
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          Próximamente
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <h2 className="mt-3.5 text-base font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {tool.shortDescription}
                  </p>
                </div>

                {/* Pie de tarjeta */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800/80">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Abrir herramienta
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      En desarrollo
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}