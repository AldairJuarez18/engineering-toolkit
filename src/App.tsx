import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Wrench } from 'lucide-react';
import { CATEGORIES, TOOLS } from './data/catalog';
import { useTheme } from './hooks/useTheme';
import { AppShell, type NavFilter } from './components/layout/AppShell';
import { ToolCatalog } from './components/catalog/ToolCatalog';
import type { CategoryId, ToolItem } from './types/toolkit';

const OhmLawTool = lazy(() =>
  import('./tools/OhmLawTool').then((m) => ({ default: m.OhmLawTool })),
);
const ResistorsTool = lazy(() =>
  import('./tools/ResistorsTool').then((m) => ({ default: m.ResistorsTool })),
);
const VoltageDividerTool = lazy(() =>
  import('./tools/VoltageDividerTool').then((m) => ({ default: m.VoltageDividerTool })),
);
const RcFiltersTool = lazy(() =>
  import('./tools/RcFiltersTool').then((m) => ({ default: m.RcFiltersTool })),
);
const UnitConverterTool = lazy(() =>
  import('./tools/UnitConverterTool').then((m) => ({ default: m.UnitConverterTool })),
);

const FAVORITES_KEY = 'etk_favorites';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<NavFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (toolId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId],
    );
  };

  const toolCountsByCategory = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      electronics: 0,
      mechanics: 0,
      math: 0,
      civil: 0,
      industrial: 0,
      communications: 0,
    };
    for (const tool of TOOLS) {
      counts[tool.categoryId] += 1;
    }
    return counts;
  }, []);

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return TOOLS.filter((tool) => {
      if (activeFilter === 'favorites' && !favoriteIds.includes(tool.id)) {
        return false;
      }
      if (
        activeFilter !== 'all' &&
        activeFilter !== 'favorites' &&
        tool.categoryId !== activeFilter
      ) {
        return false;
      }
      if (!query) return true;

      const inTitle = tool.title.toLowerCase().includes(query);
      const inDesc = tool.shortDescription.toLowerCase().includes(query);
      const inKeywords = tool.keywords.some((kw) => kw.toLowerCase().includes(query));
      return inTitle || inDesc || inKeywords;
    });
  }, [activeFilter, favoriteIds, searchQuery]);

  const headerInfo = useMemo(() => {
    if (activeFilter === 'all') {
      return {
        title: 'Todas las herramientas',
        subtitle:
          'Calculadoras verificables, análisis de circuitos y conversores para ingeniería.',
      };
    }
    if (activeFilter === 'favorites') {
      return {
        title: 'Tus herramientas favoritas',
        subtitle: 'Acceso rápido a las calculadoras que marcaste con estrella.',
      };
    }
    const category = CATEGORIES.find((c) => c.id === activeFilter);
    return {
      title: category?.name ?? 'Categoría',
      subtitle: category?.description ?? '',
    };
  }, [activeFilter]);

  const handleSelectFilter = (filter: NavFilter) => {
    setActiveFilter(filter);
    setSelectedTool(null);
  };

  const renderToolWorkspace = (tool: ToolItem) => {
    switch (tool.id) {
      case 'ohm-law':
        return <OhmLawTool />;
      case 'resistors':
        return <ResistorsTool />;
      case 'voltage-divider':
        return <VoltageDividerTool />;
      case 'rc-filters':
        return <RcFiltersTool />;
      case 'unit-converter':
        return <UnitConverterTool />;
      default:
        return (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Wrench className="h-5 w-5" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              Espacio de trabajo listo para implementar
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
              En las siguientes fases conectaremos aquí el motor matemático y los controles
              interactivos de esta calculadora.
            </p>
          </div>
        );
    }
  };

  return (
    <AppShell
      categories={CATEGORIES}
      activeFilter={activeFilter}
      onSelectFilter={handleSelectFilter}
      searchQuery={searchQuery}
      onSearchChange={(value) => {
        setSearchQuery(value);
        if (selectedTool) setSelectedTool(null);
      }}
      favoritesCount={favoriteIds.length}
      toolCountsByCategory={toolCountsByCategory}
      totalToolsCount={TOOLS.length}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {selectedTool ? (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedTool(null)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              {CATEGORIES.find((c) => c.id === selectedTool.categoryId)?.name}
            </span>
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              {selectedTool.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              {selectedTool.shortDescription}
            </p>

            <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-800">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Cargando herramienta...</span>
                  </div>
                }
              >
                {renderToolWorkspace(selectedTool)}
              </Suspense>
            </div>
          </div>
        </div>
      ) : (
        <ToolCatalog
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          tools={filteredTools}
          categories={CATEGORIES}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelectTool={(tool) => setSelectedTool(tool)}
          onResetFilters={() => {
            setActiveFilter('all');
            setSearchQuery('');
          }}
        />
      )}
    </AppShell>
  );
}

export default App;