export type ServiceCategory =
  | 'Hospital Website'
  | 'Clinic Website'
  | 'Business Website'
  | 'E-commerce Website'
  | 'Website Redesign'
  | 'SEO & Digital Growth'
  | 'AI & Automation'
  | 'Other';

export interface EnquiryFormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  interestedService: ServiceCategory;
  budgetRange?: string;
  timeline?: string;
  projectDescription: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof EnquiryFormData, string>>;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  idealFor: string;
}

export interface IndustryItem {
  id: string;
  title: string;
  summary: string;
  examples: string;
  deliverables: string[];
  accentMetric: string;
}

export interface ConceptProject {
  id: string;
  title: string;
  industry: string;
  category: string;
  tagline: string;
  summary: string;
  services: string[];
  deliverables: string[];
  techStack: string[];
  architectureHighlights: string[];
  imagePlaceholderStyle: {
    bgGradient: string;
    accentColor: string;
    patternType: 'grid' | 'waves' | 'architectural' | 'minimal';
  };
}

export interface ProcessStep {
  number: string;
  title: string;
  duration: string;
  description: string;
  keyOutputs: string[];
}
