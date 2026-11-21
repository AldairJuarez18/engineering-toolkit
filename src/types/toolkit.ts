export type CategoryId =
  | 'electronics'
  | 'mechanics'
  | 'math'
  | 'civil'
  | 'industrial'
  | 'communications';

export type ToolTier = 'free' | 'pro';
export type ToolStatus = 'available' | 'coming-soon';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
}

export interface ToolItem {
  id: string;
  title: string;
  shortDescription: string;
  categoryId: CategoryId;
  tier: ToolTier;
  status: ToolStatus;
  keywords: string[];
}

export interface CalculationStep {
  label: string;
  formula?: string;
  substitution?: string;
  result: string;
}