import { useState, type ReactNode } from 'react';
import {
  Building2,
  Cog,
  Cpu,
  Factory,
  LayoutGrid,
  Menu,
  Moon,
  Radio,
  Search,
  Sigma,
  Star,
  Sun,
  Terminal,
  X,
} from 'lucide-react';
import type { Category, CategoryId } from '../../types/toolkit';
import type { Theme } from '../../hooks/useTheme';

export type NavFilter = 'all' | 'favorites' | CategoryId;

interface AppShellProps {
  categories: Category[];
  activeFilter: NavFilter;
  onSelectFilter: (filter: NavFilter) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  favoritesCount: number;
  toolCountsByCategory: Record<CategoryId, number>;
  totalToolsCount: number;
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case 'Cpu':
      return <Cpu className="h-4 w-4 shrink-0" />;
    case 'Cog':
      return <Cog className="h-4 w-4 shrink-0" />;
    case 'Sigma':
      return <Sigma className="h-4 w-4 shrink-0" />;
    case 'Building2':
      return <Building2 className="h-4 w-4 shrink-0" />;
    case 'Factory':
      return <Factory className="h-4 w-4 shrink-0" />;
    case 'Radio':
      return <Radio className="h-4 w-4 shrink-0" />;
    default:
      return <LayoutGrid className="h-4 w-4 shrink-0" />;
  }
}

export function AppShell({
  categories,
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  favoritesCount,
  toolCountsByCategory,
  totalToolsCount,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (filter: NavFilter) => {
    onSelectFilter(filter);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        {/* Marca */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={() => handleNavClick('all')}
            className="flex items-center gap-2.5 text-left"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Engineering Toolkit
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Suite de Ingeniería
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Exploración rápida */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Explorar
          </p>
          <button
            type="button"
            onClick={() => handleNavClick('all')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutGrid className="h-4 w-4" />
              Todas las herramientas
            </span>
            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {totalToolsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('favorites')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'favorites'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Star className="h-4 w-4" />
              Favoritos
            </span>
            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {favoritesCount}
            </span>
          </button>
        </div>

        {/* Categorías */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Categorías
          </p>
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleNavClick(cat.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  {getCategoryIcon(cat.iconName)}
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
                  {toolCountsByCategory[cat.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pie lateral */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Cálculo local verificable
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Fórmulas ejecutadas directamente en tu navegador con desarrollo paso a paso.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Overlay móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar móvil */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white p-4 transition-transform duration-200 lg:hidden dark:border-slate-800 dark:bg-slate-900 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar escritorio */}
      <aside className="fixed inset-y-0 left-0 hidden w-68 border-r border-slate-200 bg-white p-4 lg:block dark:border-slate-800 dark:bg-slate-900">
        {sidebarContent}
      </aside>

      {/* Contenedor principal */}
      <div className="lg:pl-68">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Buscador */}
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar herramienta, fórmula o magnitud..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-8 pl-9 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-900"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Selector de tema */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-600" />
                  <span className="hidden sm:inline">Modo oscuro</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Área de contenido */}
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}