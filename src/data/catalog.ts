import type { Category, ToolItem } from '../types/toolkit';

export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Electrónica y electricidad',
    description: 'Análisis de circuitos, leyes fundamentales, filtros y componentes.',
    iconName: 'Cpu',
  },
  {
    id: 'mechanics',
    name: 'Mecánica y dinámica',
    description: 'Cinemática, estática, fuerzas, movimiento y análisis de cuerpos.',
    iconName: 'Cog',
  },
  {
    id: 'math',
    name: 'Matemáticas',
    description: 'Conversiones, álgebra, cálculo y herramientas numéricas de apoyo.',
    iconName: 'Sigma',
  },
  {
    id: 'civil',
    name: 'Civil y estructuras',
    description: 'Cargas, vigas, esfuerzos y propiedades de materiales estructurales.',
    iconName: 'Building2',
  },
  {
    id: 'industrial',
    name: 'Industrial y procesos',
    description: 'Optimización, control de calidad, tiempos y eficiencia operativa.',
    iconName: 'Factory',
  },
  {
    id: 'communications',
    name: 'Comunicaciones',
    description: 'Señales, enlaces, espectro, atenuación y radiofrecuencia.',
    iconName: 'Radio',
  },
];

export const TOOLS: ToolItem[] = [
  {
    id: 'ohm-law',
    title: 'Ley de Ohm y Potencia',
    shortDescription:
      'Calcula voltaje, corriente, resistencia o potencia eléctrica despejando automáticamente la incógnita a partir de dos valores conocidos.',
    categoryId: 'electronics',
    tier: 'free',
    status: 'available',
    keywords: ['voltaje', 'corriente', 'resistencia', 'potencia', 'ohm', 'watts', 'amperes'],
  },
  {
    id: 'resistors',
    title: 'Resistencias en Serie y Paralelo',
    shortDescription:
      'Obtén la resistencia equivalente de arreglos en serie o paralelo mostrando la fórmula aplicada y el desarrollo paso a paso.',
    categoryId: 'electronics',
    tier: 'free',
    status: 'available',
    keywords: ['resistencia equivalente', 'serie', 'paralelo', 'ohms', 'circuito'],
  },
  {
    id: 'voltage-divider',
    title: 'Divisor de Voltaje',
    shortDescription:
      'Determina el voltaje de salida en un divisor resistivo a partir de la fuente de entrada y el valor de las resistencias.',
    categoryId: 'electronics',
    tier: 'free',
    status: 'available',
    keywords: ['divisor', 'tension', 'voltaje salida', 'r1', 'r2', 'atenuador'],
  },
  {
    id: 'rc-filters',
    title: 'Filtros RC (Pasa Bajas y Pasa Altas)',
    shortDescription:
      'Calcula la frecuencia de corte (-3 dB) de filtros pasivos RC y visualiza su curva de respuesta en frecuencia.',
    categoryId: 'electronics',
    tier: 'free',
    status: 'available',
    keywords: ['filtro', 'pasa bajas', 'pasa altas', 'frecuencia de corte', 'capacitor', 'bode', 'rc'],
  },
  {
    id: 'unit-converter',
    title: 'Conversor de Unidades de Ingeniería',
    shortDescription:
      'Convierte valores entre sistemas de unidades para longitud, masa, tiempo, temperatura, voltaje, corriente, potencia, frecuencia y presión.',
    categoryId: 'math',
    tier: 'free',
    status: 'available',
    keywords: ['unidades', 'convertir', 'longitud', 'masa', 'presion', 'temperatura', 'frecuencia'],
  },
  {
    id: 'kinematics-2d',
    title: 'Cinemática y Tiro Parabólico',
    shortDescription:
      'Analiza alcance máximo, altura y tiempo de vuelo en lanzamientos bidimensionales con desglose de vectores.',
    categoryId: 'mechanics',
    tier: 'free',
    status: 'coming-soon',
    keywords: ['cinematica', 'proyectil', 'velocidad', 'aceleracion', 'dinamica'],
  },
  {
    id: 'beam-reactions',
    title: 'Reacciones en Vigas Isostáticas',
    shortDescription:
      'Calcula reacciones en apoyos y diagramas de fuerza cortante para vigas simplemente apoyadas con cargas puntuales.',
    categoryId: 'civil',
    tier: 'pro',
    status: 'coming-soon',
    keywords: ['vigas', 'apoyos', 'momento', 'cortante', 'estructuras'],
  },
  {
    id: 'rf-link-budget',
    title: 'Presupuesto de Enlace y Decibeles',
    shortDescription:
      'Evalúa pérdidas en espacio libre, ganancia de antenas y potencia recibida en enlaces inalámbricos.',
    categoryId: 'communications',
    tier: 'pro',
    status: 'coming-soon',
    keywords: ['rf', 'antenas', 'dbm', 'atenuacion', 'enlace', 'frecuencia'],
  },
];