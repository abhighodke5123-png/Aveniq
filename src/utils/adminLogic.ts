import {
  AdminRole,
  ClientRecord,
  DateRangeFilter,
  InvoiceRecord,
  LeadRecord,
  PaymentRecord,
  ProjectRecord,
} from '../types/admin';

export type AdminPermissionAction =
  | 'view_dashboard'
  | 'manage_leads'
  | 'convert_lead'
  | 'manage_clients'
  | 'manage_projects'
  | 'manage_proposals'
  | 'create_invoice'
  | 'record_manual_payment'
  | 'verify_payment'
  | 'manage_team'
  | 'manage_content'
  | 'manage_settings'
  | 'manage_roles_security';

const ROLE_PERMISSION_MATRIX: Record<AdminRole, AdminPermissionAction[]> = {
  'Super Admin': [
    'view_dashboard',
    'manage_leads',
    'convert_lead',
    'manage_clients',
    'manage_projects',
    'manage_proposals',
    'create_invoice',
    'record_manual_payment',
    'verify_payment',
    'manage_team',
    'manage_content',
    'manage_settings',
    'manage_roles_security',
  ],
  Admin: [
    'view_dashboard',
    'manage_leads',
    'convert_lead',
    'manage_clients',
    'manage_projects',
    'manage_proposals',
    'create_invoice',
    'record_manual_payment',
    'verify_payment',
    'manage_team',
    'manage_content',
    'manage_settings',
  ],
  Manager: [
    'view_dashboard',
    'manage_leads',
    'convert_lead',
    'manage_clients',
    'manage_projects',
    'manage_proposals',
    'create_invoice',
    'record_manual_payment',
    'manage_content',
  ],
  Staff: [
    'view_dashboard',
    'manage_leads',
    'manage_projects',
    'manage_content',
  ],
};

export function canPerformAdminAction(
  role: AdminRole,
  action: AdminPermissionAction
): boolean {
  const allowed = ROLE_PERMISSION_MATRIX[role];
  return Array.isArray(allowed) && allowed.includes(action);
}

export function isWithinDateFilter(
  isoString: string,
  filter: DateRangeFilter,
  customRange?: { start: string; end: string },
  referenceNow: Date = new Date()
): boolean {
  const time = new Date(isoString).getTime();
  if (Number.isNaN(time)) return true;

  const nowMs = referenceNow.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  if (filter === 'today') {
    const startOfToday = new Date(referenceNow);
    startOfToday.setHours(0, 0, 0, 0);
    return time >= startOfToday.getTime();
  }
  if (filter === '7d') {
    return time >= nowMs - 7 * dayMs;
  }
  if (filter === '30d') {
    return time >= nowMs - 30 * dayMs;
  }
  if (filter === '90d') {
    return time >= nowMs - 90 * dayMs;
  }
  if (filter === 'custom' && customRange?.start && customRange?.end) {
    const startMs = new Date(customRange.start).getTime();
    const endMs = new Date(customRange.end).getTime() + dayMs - 1;
    if (!Number.isNaN(startMs) && !Number.isNaN(endMs)) {
      return time >= startMs && time <= endMs;
    }
  }
  return true;
}

export interface DashboardComputedMetrics {
  totalRevenue: number;
  pendingPaymentsTotal: number;
  monthlyRecurringRevenue: number;
  totalClients: number;
  activeProjectsCount: number;
  pendingProjectsCount: number;
  completedProjectsCount: number;
  newEnquiriesCount: number;
  totalLeadsCount: number;
  convertedLeadsCount: number;
  conversionRatePercent: number;
  outstandingInvoicesTotal: number;
  outstandingInvoicesCount: number;
  projectCompletionRatePercent: number;
  monthlyRevenueSeries: { month: string; verifiedRevenue: number; invoicedAmount: number }[];
  leadAcquisitionSeries: { stage: string; count: number }[];
  clientRevenueBreakdown: { clientId: string; clientName: string; verifiedPaid: number; outstanding: number }[];
}

export function calculateDashboardMetrics(params: {
  leads: LeadRecord[];
  clients: ClientRecord[];
  projects: ProjectRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  dateFilter?: DateRangeFilter;
  customRange?: { start: string; end: string };
  referenceNow?: Date;
}): DashboardComputedMetrics {
  const {
    leads,
    clients,
    projects,
    invoices,
    payments,
    dateFilter = '90d',
    customRange,
    referenceNow = new Date(),
  } = params;

  const filteredPayments = payments.filter((p) =>
    isWithinDateFilter(p.paidAtIso, dateFilter, customRange, referenceNow)
  );
  const filteredLeads = leads.filter((l) =>
    isWithinDateFilter(l.createdAtIso, dateFilter, customRange, referenceNow)
  );

  // Strict financial invariant: ONLY 'Verified' payments count toward Total Revenue received
  const verifiedPayments = filteredPayments.filter(
    (p) => p.verificationStatus === 'Verified'
  );
  const pendingPayments = filteredPayments.filter(
    (p) => p.verificationStatus === 'Pending Verification'
  );

  const totalRevenue = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPaymentsTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // MRR from active/in-progress/completed projects with a monthly retainer
  const monthlyRecurringRevenue = projects
    .filter((p) => p.status !== 'Cancelled')
    .reduce((sum, p) => sum + (p.monthlyRetainer || 0), 0);

  const totalClients = clients.length;
  const activeProjectsCount = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Review'
  ).length;
  const pendingProjectsCount = projects.filter(
    (p) => p.status === 'Planning' || p.status === 'On Hold'
  ).length;
  const completedProjectsCount = projects.filter(
    (p) => p.status === 'Completed'
  ).length;

  const newEnquiriesCount = filteredLeads.filter((l) => l.status === 'New').length;
  const totalLeadsCount = filteredLeads.length;
  const convertedLeadsCount = filteredLeads.filter(
    (l) => l.status === 'Converted'
  ).length;

  const conversionRatePercent =
    totalLeadsCount > 0
      ? Number(((convertedLeadsCount / totalLeadsCount) * 100).toFixed(1))
      : 0;

  const outstandingInvoices = invoices.filter(
    (inv) => inv.status === 'Sent' || inv.status === 'Overdue'
  );
  const outstandingInvoicesTotal = outstandingInvoices.reduce(
    (sum, inv) => sum + inv.totalAmount,
    0
  );

  const projectCompletionRatePercent =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
        )
      : 0;

  // Compute monthly revenue series from actual payment & invoice timestamps
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthBuckets = new Map<string, { verifiedRevenue: number; invoicedAmount: number }>();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(referenceNow.getFullYear(), referenceNow.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    monthBuckets.set(key, { verifiedRevenue: 0, invoicedAmount: 0 });
  }

  for (const p of payments) {
    if (p.verificationStatus !== 'Verified') continue;
    const d = new Date(p.paidAtIso);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    const bucket = monthBuckets.get(key);
    if (bucket) {
      bucket.verifiedRevenue += p.amount;
    }
  }

  for (const inv of invoices) {
    if (inv.status === 'Cancelled') continue;
    const d = new Date(inv.issueDate);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    const bucket = monthBuckets.get(key);
    if (bucket) {
      bucket.invoicedAmount += inv.totalAmount;
    }
  }

  const monthlyRevenueSeries = Array.from(monthBuckets.entries()).map(
    ([month, vals]) => ({
      month,
      verifiedRevenue: vals.verifiedRevenue,
      invoicedAmount: vals.invoicedAmount,
    })
  );

  const stages: LeadRecord['status'][] = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Negotiation',
    'Converted',
    'Lost',
  ];
  const leadAcquisitionSeries = stages.map((stage) => ({
    stage,
    count: leads.filter((l) => l.status === stage).length,
  }));

  const clientRevenueBreakdown = clients.map((client) => {
    const verifiedPaid = payments
      .filter(
        (p) => p.clientId === client.id && p.verificationStatus === 'Verified'
      )
      .reduce((s, p) => s + p.amount, 0);
    const outstanding = invoices
      .filter(
        (inv) =>
          inv.clientId === client.id &&
          (inv.status === 'Sent' || inv.status === 'Overdue')
      )
      .reduce((s, inv) => s + inv.totalAmount, 0);
    return {
      clientId: client.id,
      clientName: client.companyName,
      verifiedPaid,
      outstanding,
    };
  });

  return {
    totalRevenue,
    pendingPaymentsTotal,
    monthlyRecurringRevenue,
    totalClients,
    activeProjectsCount,
    pendingProjectsCount,
    completedProjectsCount,
    newEnquiriesCount,
    totalLeadsCount,
    convertedLeadsCount,
    conversionRatePercent,
    outstandingInvoicesTotal,
    outstandingInvoicesCount: outstandingInvoices.length,
    projectCompletionRatePercent,
    monthlyRevenueSeries,
    leadAcquisitionSeries,
    clientRevenueBreakdown,
  };
}

/**
 * Enforces strict separation between Gateway Verified payments and Manual Payment recording.
 * A payment CANNOT be marked 'Verified' without a valid gateway/bank transaction reference (>= 6 chars).
 */
export function validatePaymentSubmission(input: {
  amount: number;
  recordingMode: 'Gateway Verified' | 'Manual Record';
  transactionReference: string;
  requestedVerificationStatus?: 'Pending Verification' | 'Verified';
}): {
  isValid: boolean;
  error?: string;
  enforcedStatus: 'Pending Verification' | 'Verified';
} {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return {
      isValid: false,
      error: 'Payment amount must be greater than zero.',
      enforcedStatus: 'Pending Verification',
    };
  }

  const ref = (input.transactionReference || '').trim();
  if (ref.length < 4) {
    return {
      isValid: false,
      error: 'A valid transaction reference or receipt ID is required.',
      enforcedStatus: 'Pending Verification',
    };
  }

  // Manual recordings ALWAYS start as 'Pending Verification' until explicitly verified
  if (input.recordingMode === 'Manual Record') {
    return {
      isValid: true,
      enforcedStatus: 'Pending Verification',
    };
  }

  // Gateway Verified requires a gateway verification signature prefix or >= 8 char reference
  if (ref.length < 8) {
    return {
      isValid: false,
      error:
        'Gateway-verified payments require a full gateway confirmation ID (at least 8 characters, e.g. pi_3Q9x... or pay_N8k...).',
      enforcedStatus: 'Pending Verification',
    };
  }

  return {
    isValid: true,
    enforcedStatus: input.requestedVerificationStatus || 'Verified',
  };
}

export function buildClientFromLead(
  lead: LeadRecord,
  accountManager = 'Arjun Mehta'
): ClientRecord {
  const isHealthcare =
    lead.interestedService === 'Hospital Website' ||
    lead.interestedService === 'Clinic Website' ||
    lead.businessName.toLowerCase().includes('hospital') ||
    lead.businessName.toLowerCase().includes('clinic');

  return {
    id: `cli_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    companyName: lead.businessName,
    primaryContactName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    country: lead.country || 'India',
    industry: isHealthcare ? 'Healthcare' : 'Commercial Enterprise',
    tier: lead.budgetRange.includes('50,000') || lead.budgetRange.includes('25,000')
      ? 'Enterprise'
      : 'Growth',
    status: 'Onboarding',
    sourceLeadId: lead.id,
    accountManager,
    totalBilled: 0,
    createdAtIso: new Date().toISOString(),
  };
}

export function generateLeadsCsv(leads: LeadRecord[]): string {
  const headers = [
    'Lead ID',
    'Full Name',
    'Business Name',
    'Email',
    'Phone',
    'Country',
    'Service',
    'Budget Range',
    'Timeline',
    'Status',
    'Assigned To',
    'Follow-Up Date',
    'Created At',
  ];

  const escapeCsvCell = (val: string) => {
    const clean = String(val ?? '').replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = leads.map((l) =>
    [
      l.id,
      l.fullName,
      l.businessName,
      l.email,
      l.phone,
      l.country,
      l.interestedService,
      l.budgetRange,
      l.timeline,
      l.status,
      l.assignedTo,
      l.followUpDate,
      l.createdAtIso,
    ]
      .map(escapeCsvCell)
      .join(',')
  );

  return [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
}
