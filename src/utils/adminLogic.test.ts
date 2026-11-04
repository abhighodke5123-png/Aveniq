import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canPerformAdminAction,
  calculateDashboardMetrics,
  validatePaymentSubmission,
  buildClientFromLead,
  generateLeadsCsv,
  resolveFirebaseAdminRole,
} from './adminLogic';
import { LeadRecord, ClientRecord, ProjectRecord, InvoiceRecord, PaymentRecord } from '../types/admin';

test('resolveFirebaseAdminRole enforces email_verified and resolves RBAC roles from /admins/{uid}', () => {
  // Rejects unverified email even if email matches bootstrapped Super Admin (Anti-Spoofing)
  assert.equal(
    resolveFirebaseAdminRole({
      email: 'abhighodke5123@gmail.com',
      emailVerified: false,
      adminDocExists: true,
      adminDocData: { role: 'Super Admin' },
    }),
    null
  );

  // Resolves verified bootstrapped Super Admin
  assert.equal(
    resolveFirebaseAdminRole({
      email: 'abhighodke5123@gmail.com',
      emailVerified: true,
      adminDocExists: false,
      adminDocData: null,
    }),
    'Super Admin'
  );

  assert.equal(
    resolveFirebaseAdminRole({
      email: 'abhighodke8877@gmail.com',
      emailVerified: true,
      adminDocExists: false,
      adminDocData: null,
    }),
    'Super Admin'
  );

  // Resolves Firestore /admins/{uid} document with explicit Manager role
  assert.equal(
    resolveFirebaseAdminRole({
      email: 'arjun@aveniq.studio',
      emailVerified: true,
      adminDocExists: true,
      adminDocData: { email: 'arjun@aveniq.studio', role: 'Manager' },
    }),
    'Manager'
  );

  // Defaults to Admin if /admins/{uid} document exists without explicit role property
  assert.equal(
    resolveFirebaseAdminRole({
      email: 'clara@aveniq.studio',
      emailVerified: true,
      adminDocExists: true,
      adminDocData: { email: 'clara@aveniq.studio' },
    }),
    'Admin'
  );

  // Rejects verified non-admin user when /admins/{uid} does not exist
  assert.equal(
    resolveFirebaseAdminRole({
      email: 'visitor@external.org',
      emailVerified: true,
      adminDocExists: false,
      adminDocData: null,
    }),
    null
  );
});

test('RBAC permission matrix enforces Super Admin, Admin, Manager, and Staff boundaries', () => {
  assert.equal(canPerformAdminAction('Super Admin', 'manage_roles_security'), true);
  assert.equal(canPerformAdminAction('Admin', 'manage_roles_security'), false);
  assert.equal(canPerformAdminAction('Admin', 'verify_payment'), true);
  assert.equal(canPerformAdminAction('Manager', 'verify_payment'), false);
  assert.equal(canPerformAdminAction('Manager', 'convert_lead'), true);
  assert.equal(canPerformAdminAction('Staff', 'convert_lead'), false);
  assert.equal(canPerformAdminAction('Staff', 'manage_leads'), true);
});

test('validatePaymentSubmission separates manual payment recording from verified gateway confirmation', () => {
  // Manual payments always default to Pending Verification so they never inflate verified revenue prematurely
  const manualRes = validatePaymentSubmission({
    amount: 12500,
    recordingMode: 'Manual Record',
    transactionReference: 'WIRE-9012',
    requestedVerificationStatus: 'Verified',
  });
  assert.equal(manualRes.isValid, true);
  assert.equal(manualRes.enforcedStatus, 'Pending Verification');

  // Gateway Verified rejects short/invalid transaction IDs
  const invalidGateway = validatePaymentSubmission({
    amount: 12500,
    recordingMode: 'Gateway Verified',
    transactionReference: 'short',
  });
  assert.equal(invalidGateway.isValid, false);

  // Gateway Verified accepts valid transaction IDs
  const validGateway = validatePaymentSubmission({
    amount: 12500,
    recordingMode: 'Gateway Verified',
    transactionReference: 'pi_3Q9xK2L901284Verified',
  });
  assert.equal(validGateway.isValid, true);
  assert.equal(validGateway.enforcedStatus, 'Verified');
});

test('calculateDashboardMetrics computes accurate figures from actual records', () => {
  const now = new Date('2026-11-04T12:00:00Z');
  const leads: LeadRecord[] = [
    {
      id: 'l1',
      fullName: 'Dr. Arvind Mehta',
      businessName: 'Aura Healthcare System',
      email: 'arvind@aurahospital.org',
      phone: '+91 98200 11111',
      country: 'India',
      interestedService: 'Hospital Website',
      budgetRange: '$25,000 - $50,000 (₹20L - ₹40L)',
      timeline: '2 months',
      projectDescription: 'Quaternary hospital portal with OPD scheduling.',
      status: 'Converted',
      source: 'Website Enquiry',
      assignedTo: 'Elena Vance',
      followUpDate: '2026-11-10',
      internalNotes: [],
      communicationHistory: [],
      createdAtIso: '2026-10-20T10:00:00Z',
      updatedAtIso: '2026-10-25T10:00:00Z',
    },
    {
      id: 'l2',
      fullName: 'Sarah Jenkins',
      businessName: 'Verdant Dental',
      email: 'sarah@verdantdental.co.uk',
      phone: '+44 20 7946 0192',
      country: 'United Kingdom',
      interestedService: 'Clinic Website',
      budgetRange: '$10,000 - $25,000 (₹8L - ₹20L)',
      timeline: '1-2 months',
      projectDescription: 'Dental studio redesign and patient booking.',
      status: 'New',
      source: 'Website Enquiry',
      assignedTo: 'Elena Vance',
      followUpDate: '2026-11-08',
      internalNotes: [],
      communicationHistory: [],
      createdAtIso: '2026-11-02T10:00:00Z',
      updatedAtIso: '2026-11-02T10:00:00Z',
    },
  ];

  const clients: ClientRecord[] = [
    {
      id: 'c1',
      companyName: 'Aura Healthcare System',
      primaryContactName: 'Dr. Arvind Mehta',
      email: 'arvind@aurahospital.org',
      phone: '+91 98200 11111',
      country: 'India',
      industry: 'Healthcare',
      tier: 'Enterprise',
      status: 'Active',
      accountManager: 'Elena Vance',
      totalBilled: 38000,
      createdAtIso: '2026-10-25T10:00:00Z',
    },
  ];

  const projects: ProjectRecord[] = [
    {
      id: 'p1',
      title: 'Aura Hospital Digital Ecosystem',
      clientId: 'c1',
      clientName: 'Aura Healthcare System',
      serviceCategory: 'Hospital Website',
      status: 'In Progress',
      budget: 38000,
      monthlyRetainer: 2400,
      progress: 70,
      startDate: '2026-10-26',
      deadline: '2026-12-15',
      leadMember: 'Elena Vance',
      assignedTeam: ['Elena Vance', 'Rohan Kapoor'],
      milestones: [],
      tasks: [],
      documents: [],
      summary: 'Hospital web platform',
      createdAtIso: '2026-10-26T10:00:00Z',
    },
  ];

  const invoices: InvoiceRecord[] = [
    {
      id: 'inv1',
      invoiceNumber: 'INV-2026-001',
      clientId: 'c1',
      clientName: 'Aura Healthcare System',
      clientEmail: 'arvind@aurahospital.org',
      issueDate: '2026-10-26',
      dueDate: '2026-11-15',
      subtotal: 20000,
      taxRatePercent: 0,
      taxAmount: 0,
      totalAmount: 20000,
      status: 'Paid',
      lineItems: [{ id: 'li1', description: 'Phase 1 Architecture', quantity: 1, unitPrice: 20000 }],
      notes: '',
      createdAtIso: '2026-10-26T10:00:00Z',
    },
    {
      id: 'inv2',
      invoiceNumber: 'INV-2026-002',
      clientId: 'c1',
      clientName: 'Aura Healthcare System',
      clientEmail: 'arvind@aurahospital.org',
      issueDate: '2026-11-01',
      dueDate: '2026-11-20',
      subtotal: 18000,
      taxRatePercent: 0,
      taxAmount: 0,
      totalAmount: 18000,
      status: 'Sent',
      lineItems: [{ id: 'li2', description: 'Phase 2 OPD Engine', quantity: 1, unitPrice: 18000 }],
      notes: '',
      createdAtIso: '2026-11-01T10:00:00Z',
    },
  ];

  const payments: PaymentRecord[] = [
    {
      id: 'pay1',
      invoiceId: 'inv1',
      invoiceNumber: 'INV-2026-001',
      clientId: 'c1',
      clientName: 'Aura Healthcare System',
      amount: 20000,
      paymentMethod: 'Stripe Gateway',
      recordingMode: 'Gateway Verified',
      transactionReference: 'pi_3Q9xVerified001',
      verificationStatus: 'Verified',
      paidAtIso: '2026-10-27T10:00:00Z',
    },
    {
      id: 'pay2',
      invoiceId: 'inv2',
      invoiceNumber: 'INV-2026-002',
      clientId: 'c1',
      clientName: 'Aura Healthcare System',
      amount: 18000,
      paymentMethod: 'Wire Transfer',
      recordingMode: 'Manual Record',
      transactionReference: 'WIRE-PENDING-02',
      verificationStatus: 'Pending Verification',
      paidAtIso: '2026-11-03T10:00:00Z',
    },
  ];

  const metrics = calculateDashboardMetrics({
    leads,
    clients,
    projects,
    invoices,
    payments,
    dateFilter: '90d',
    referenceNow: now,
  });

  assert.equal(metrics.totalRevenue, 20000);
  assert.equal(metrics.pendingPaymentsTotal, 18000);
  assert.equal(metrics.monthlyRecurringRevenue, 2400);
  assert.equal(metrics.totalClients, 1);
  assert.equal(metrics.activeProjectsCount, 1);
  assert.equal(metrics.newEnquiriesCount, 1);
  assert.equal(metrics.conversionRatePercent, 50);
  assert.equal(metrics.outstandingInvoicesTotal, 18000);
});

test('buildClientFromLead and generateLeadsCsv transform lead records accurately', () => {
  const sampleLead: LeadRecord = {
    id: 'lead_test_1',
    fullName: 'Dr. Kabir Anand',
    businessName: 'Anand Orthopedic Hospital',
    email: 'kabir@anandortho.in',
    phone: '+91 98111 22334',
    country: 'India',
    interestedService: 'Hospital Website',
    budgetRange: '$25,000 - $50,000 (₹20L - ₹40L)',
    timeline: '2-3 months',
    projectDescription: 'Robotic joint replacement portal.',
    status: 'Qualified',
    source: 'Website Enquiry',
    assignedTo: 'Arjun Mehta',
    followUpDate: '2026-11-12',
    internalNotes: [],
    communicationHistory: [],
    createdAtIso: '2026-11-01T09:00:00Z',
    updatedAtIso: '2026-11-01T09:00:00Z',
  };

  const client = buildClientFromLead(sampleLead, 'Arjun Mehta');
  assert.equal(client.companyName, 'Anand Orthopedic Hospital');
  assert.equal(client.industry, 'Healthcare');
  assert.equal(client.tier, 'Enterprise');

  const csv = generateLeadsCsv([sampleLead]);
  assert.ok(csv.includes('"Anand Orthopedic Hospital"'));
  assert.ok(csv.includes('"Hospital Website"'));
});
