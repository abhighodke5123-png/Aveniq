import { ServiceCategory } from './index';

export type AdminSectionId =
  | 'overview'
  | 'analytics'
  | 'leads'
  | 'clients'
  | 'projects'
  | 'services'
  | 'proposals'
  | 'payments'
  | 'invoices'
  | 'team'
  | 'content'
  | 'settings'
  | 'integrations'
  | 'logs'
  | 'security';

export type AdminRole = 'Super Admin' | 'Admin' | 'Manager' | 'Staff';

export type DateRangeFilter = 'today' | '7d' | '30d' | '90d' | 'custom';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Converted'
  | 'Lost';

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAtIso: string;
}

export interface LeadCommunicationEntry {
  id: string;
  channel: 'Email' | 'WhatsApp' | 'Discovery Call' | 'Proposal Review';
  summary: string;
  loggedBy: string;
  timestampIso: string;
}

export interface LeadRecord {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  interestedService: ServiceCategory;
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  status: LeadStatus;
  source: string;
  assignedTo: string;
  followUpDate: string;
  internalNotes: LeadNote[];
  communicationHistory: LeadCommunicationEntry[];
  convertedClientId?: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface ClientRecord {
  id: string;
  companyName: string;
  primaryContactName: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  tier: 'Enterprise' | 'Growth' | 'Boutique';
  status: 'Active' | 'Onboarding' | 'Retainer' | 'Inactive';
  sourceLeadId?: string;
  accountManager: string;
  totalBilled: number;
  createdAtIso: string;
}

export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'Review'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  category: 'Architecture Spec' | 'Design System' | 'Statement of Work' | 'Security Audit';
  sizeLabel: string;
  uploadedBy: string;
  uploadedAtIso: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  serviceCategory: ServiceCategory;
  status: ProjectStatus;
  budget: number;
  monthlyRetainer: number;
  progress: number;
  startDate: string;
  deadline: string;
  leadMember: string;
  assignedTeam: string[];
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  summary: string;
  createdAtIso: string;
}

export interface ProposalRecord {
  id: string;
  proposalNumber: string;
  title: string;
  clientOrLeadName: string;
  leadId?: string;
  clientId?: string;
  serviceCategory: ServiceCategory;
  amount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  validUntil: string;
  scopeSummary: string;
  createdBy: string;
  createdAtIso: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  projectId?: string;
  projectTitle?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRatePercent: number;
  taxAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  lineItems: InvoiceLineItem[];
  notes: string;
  createdAtIso: string;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  paymentMethod: 'Stripe Gateway' | 'Razorpay Gateway' | 'Wire Transfer' | 'Manual Entry';
  recordingMode: 'Gateway Verified' | 'Manual Record';
  transactionReference: string;
  verificationStatus: 'Pending Verification' | 'Verified' | 'Failed' | 'Refunded';
  verifiedBy?: string;
  verifiedAtIso?: string;
  paidAtIso: string;
}

export interface TeamMemberRecord {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  title: string;
  department: 'Executive' | 'Engineering' | 'Design & UX' | 'Healthcare Strategy' | 'Search & Growth';
  activeProjectsCount: number;
  utilizationPercent: number;
  status: 'Active' | 'In Deep Work' | 'On Leave';
  joinedAtIso: string;
}

export interface ActivityLogRecord {
  id: string;
  actorEmail: string;
  actorRole: AdminRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAtIso: string;
}

export interface WebsiteSettingsRecord {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  contactEmail: string;
  whatsappNumber: string;
  primaryGeography: string;
  maintenanceMode: boolean;
  ndaProtectionBanner: boolean;
  updatedBy: string;
  updatedAtIso: string;
}

export interface StudioServicePackage {
  id: string;
  number: string;
  title: string;
  tagline: string;
  baseInvestmentUsd: number;
  typicalTimeline: string;
  active: boolean;
  deliverables: string[];
}
