export type ServiceCategory =
  | 'Hospital Website'
  | 'Clinic Website'
  | 'Business Website'
  | 'E-commerce Website'
  | 'Website Redesign'
  | 'SEO & Digital Growth'
  | 'AI & Automation'
  | 'Other';

export type EnquiryStatus =
  | 'submitted'
  | 'in_review'
  | 'scheduled'
  | 'completed'
  | 'archived';

export type OpdDepartment =
  | 'Cardiology'
  | 'Oncology'
  | 'Orthopedics'
  | 'Neurology';

export type OpdSlot =
  | '10:30 AM'
  | '12:00 PM'
  | '03:30 PM'
  | '05:00 PM';

export type OpdStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

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

export interface StoredEnquiryRecord extends EnquiryFormData {
  id: string;
  ownerId: string;
  budgetRange: string;
  timeline: string;
  status: EnquiryStatus;
  createdAtIso: string;
  updatedAtIso: string;
  syncedToCloud: boolean;
}

export interface OpdAppointmentInput {
  patientName: string;
  department: OpdDepartment;
  leadDoctor: string;
  preferredSlot: OpdSlot;
}

export interface StoredOpdRecord extends OpdAppointmentInput {
  id: string;
  ownerId: string;
  status: OpdStatus;
  createdAtIso: string;
  updatedAtIso: string;
  syncedToCloud: boolean;
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
