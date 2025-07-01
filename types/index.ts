// types/index.ts
export type ProjectType = 'landing' | 'ecommerce' | 'webapp' | 'cms' | 'redesign' | 'other';
export type BudgetRange = '5-10k' | '10-20k' | '20-50k' | '50k+' | 'unsure';

export interface SolicitudFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: ProjectType | '';
  budgetRange: BudgetRange | '';
  deadline: string;
  description: string;
  features: string[];
  integrations: string[];
  designPreferences: string;
  targetAudience: string;
  existingWebsite: string;
  hostingPreferences: string;
  additionalComments: string;
}

export interface CardType {
  id: string;
  title: string;
  price?: string;
  features?: readonly string[];
  bgColor: string;
  tech?: readonly string[];
  icon: string;
  isCustom: boolean;
  highlight?: boolean;
}