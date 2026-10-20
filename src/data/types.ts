export type ConditionCategory = 'oesophagus' | 'stomach' | 'intestine' | 'liver' | 'pancreas';
export type ProcedureCategory = 'endoscopy' | 'functional' | 'liver' | 'therapeutic';

export interface Reference {
  label: string;
  url: string;
}

export interface Condition {
  slug: string;
  title: string;
  short: string;
  category: ConditionCategory;
  image: string;
  featured: boolean;
  paragraphs: string[];
  references: Reference[];
}

export interface Procedure {
  slug: string;
  title: string;
  short: string;
  category: ProcedureCategory;
  image: string;
  featured: boolean;
  paragraphs: string[];
  references: Reference[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  keyPoints?: string[];
  inlineImage?: { name: string; caption: string };
  relatedConditions?: string[];
  paragraphs: string[];
  references: Reference[];
}
