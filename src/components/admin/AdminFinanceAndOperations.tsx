import React, { useState, useMemo } from 'react';
import {
  FileText,
  CreditCard,
  Receipt,
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Printer,
  Download,
  Eye,
  X,
  Trash2,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { InvoiceRecord, PaymentRecord, ProposalRecord } from '../../types/admin';
import { ServiceCategory } from '../../types';

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Hospital Website',
  'Clinic Website',
  'Business Website',
  'E-commerce Website',
  'Website Redesign',
  'SEO & Digital Growth',
  'AI & Automation',
  'Other',
];

export const AdminFinanceAndOperations: React.FC<{
  section: 'services' | 'proposals' | 'payments' | 'invoices';
}> = ({ section }) => {
  const {
    services,
    proposals,
    payments,
    invoices,
    clients,
    projects,
    checkPermission,
    updateServicePackage,
    createProposal,
    updateProposalStatus,
    createInvoice,
    updateInvoiceStatus,
    recordPayment,
    verifyPendingPayment,
  } = useAdminStore();

  // Proposal creation state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [propForm, setPropForm] = useState({
    title: '',
    clientOrLeadName: '',
    serviceCategory: 'Hospital Website' as ServiceCategory,
    amount: 34000,
    validUntil: '2026-12-15',
    scopeSummary: '',
  });

  // Invoice creation & PDF preview state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceRecord | null>(null);
  const [invForm, setInvForm] = useState({
    clientId: clients[0]?.id || '',
    projectId: projects[0]?.id || '',
    dueDate: '2026-12-01',
    taxRatePercent: 0,
    notes: 'Wire transfer / Stripe settlement within 14 days of issue.',
    lineItems: [
      { description: 'Enterprise Digital Architecture & Design Systems', quantity: 1, unitPrice: 18500 },
    ],
  });

  // Payment recording & verification state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [payForm, setPayForm] = useState({
    invoiceId: invoices[0]?.id || '',
    amount: invoices[0]?.totalAmount || 18500,
    paymentMethod: 'Stripe Gateway' as PaymentRecord['paymentMethod'],
    recordingMode: 'Gateway Verified' as PaymentRecord['recordingMode'],
    transactionReference: '',
  });

  // Inline verification input for pending manual payments
  const [verifyingPaymentId, setVerifyingPaymentId] = useState<string | null>(null);
  const [confirmationRefInput, setConfirmationRefInput] = useState('');

  // Financial aggregates for Payments tab
  const financeMetrics = useMemo(() => {
    const verifiedTotal = payments
      .filter((p) => p.verificationStatus === 'Verified')
      .reduce((s, p) => s + p.amount, 0);
    const pendingTotal = payments
      .filter((p) => p.verificationStatus === 'Pending Verification')
      .reduce((s, p) => s + p.amount, 0);
    const outstandingInvoicesTotal = invoices
      .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
      .reduce((s, i) => s + i.totalAmount, 0);

    // Client-wise verified revenue breakdown
    const byClientMap = new Map<string, { clientName: string; verified: number; pending: number }>();
    payments.forEach((p) => {
      const existing = byClientMap.get(p.clientId) || {
        clientName: p.clientName,
        verified: 0,
        pending: 0,
      };
      if (p.verificationStatus === 'Verified') existing.verified += p.amount;
      if (p.verificationStatus === 'Pending Verification') existing.pending += p.amount;
      byClientMap.set(p.clientId, existing);
    });

    return {
      verifiedTotal,
      pendingTotal,
      outstandingInvoicesTotal,
      clientBreakdown: Array.from(byClientMap.values()),
    };
  }, [payments, invoices]);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title.trim() || !propForm.clientOrLeadName.trim()) return;
    createProposal(propForm);
    setShowProposalModal(false);
    setPropForm({
      title: '',
      clientOrLeadName: '',
      serviceCategory: 'Hospital Website',
      amount: 34000,
      validUntil: '2026-12-15',
      scopeSummary: '',
    });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invForm.clientId || invForm.lineItems.length === 0) return;
    const created = createInvoice({
      clientId: invForm.clientId,
      projectId: invForm.projectId || undefined,
      dueDate: invForm.dueDate,
      taxRatePercent: Number(invForm.taxRatePercent) || 0,
      lineItems: invForm.lineItems.filter((li) => li.description.trim() && li.unitPrice > 0),
      notes: invForm.notes,
    });
    setShowInvoiceModal(false);
    setPreviewInvoice(created);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentFeedback(null);
    const res = recordPayment({
      invoiceId: payForm.invoiceId,
      amount: Number(payForm.amount),
      paymentMethod: payForm.paymentMethod,
      recordingMode: payForm.recordingMode,
      transactionReference: payForm.transactionReference,
    });

    if (!res.ok) {
      setPaymentFeedback({ type: 'error', text: res.error || 'Payment validation failed.' });
      return;
    }

    setPaymentFeedback({
      type: 'success',
      text:
        res.payment?.verificationStatus === 'Verified'
          ? `Gateway payment verified (${res.payment.transactionReference}). Invoice marked Paid.`
          : `Manual payment recorded as Pending Verification. It will NOT count as verified revenue until confirmed.`,
    });
    setPayForm((prev) => ({ ...prev, transactionReference: '' }));
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentFeedback(null);
    }, 1400);
  };

  const handleConfirmPendingPayment = (paymentId: string) => {
    setPaymentFeedback(null);
    const res = verifyPendingPayment(paymentId, confirmationRefInput);
    if (!res.ok) {
      setPaymentFeedback({ type: 'error', text: res.error || 'Verification failed.' });
      return;
    }
    setVerifyingPaymentId(null);
    setConfirmationRefInput('');
    setPaymentFeedback({
      type: 'success',
      text: 'Pending payment verified with bank/gateway reference and added to verified studio revenue.',
    });
  };

  const handleDownloadInvoiceHtml = (inv: InvoiceRecord) => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${inv.invoiceNumber} — AVENIQ Studio Invoice</title>
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; color: #17191D; padding: 48px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #17191D; padding-bottom: 24px; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; }
    th, td { border-bottom: 1px solid #E5E2DC; padding: 12px 8px; text-align: left; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #777873; }
    .totals { margin-top: 24px; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 style="margin:0;letter-spacing:0.15em;">AVENIQ</h1>
      <p style="font-size:12px;color:#777873;">Independent Digital Experience Studio</p>
    </div>
    <div style="text-align:right;">
      <h2 style="margin:0;">${inv.invoiceNumber}</h2>
      <p style="font-size:12px;color:#777873;">Status: ${inv.status}</p>
      <p style="font-size:12px;color:#777873;">Issued: ${inv.issueDate} | Due: ${inv.dueDate}</p>
    </div>
  </div>
  <div>
    <strong>Billed To:</strong> ${inv.clientName} (${inv.clientEmail})<br/>
    ${inv.projectTitle ? `<strong>Engagement:</strong> ${inv.projectTitle}` : ''}
  </div>
  <table>
    <thead>
      <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Line Total</th></tr>
    </thead>
    <tbody>
      ${inv.lineItems
        .map(
          (li) =>
            `<tr><td>${li.description}</td><td>${li.quantity}</td><td>$${li.unitPrice.toLocaleString()}</td><td>$${(
              li.quantity * li.unitPrice
            ).toLocaleString()}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
  <div class="totals">
    <p>Subtotal: <strong>$${inv.subtotal.toLocaleString()}</strong></p>
    <p>Tax (${inv.taxRatePercent}%): <strong>$${inv.taxAmount.toLocaleString()}</strong></p>
    <h3>Total Due: $${inv.totalAmount.toLocaleString()} USD</h3>
  </div>
  <p style="margin-top:40px;font-size:12px;color:#777873;">Notes: ${inv.notes}</p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}-AVENIQ.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // SECTION 6: SERVICES CATALOGUE
  // ============================================================================
  if (section === 'services') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
              Studio Capabilities & Commercial Architecture
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#17191D]">
              Service Packages & Retainer Tiers
            </h2>
          </div>
          <div className="text-xs text-[#777873] font-mono tabular-nums">
            Active Offerings: {services.filter((s) => s.active).length} / {services.length}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-[#E5E2DC] p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#777873]">
                    Service {svc.number}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateServicePackage(svc.id, { active: !svc.active })}
                    className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                      svc.active
                        ? 'bg-[#2E6F40]/10 text-[#2E6F40] border-[#2E6F40]/30'
                        : 'bg-[#F7F6F2] text-[#777873] border-[#E5E2DC]'
                    }`}
                  >
                    {svc.active ? 'Active Offering' : 'Archived'}
                  </button>
                </div>

                <h3 className="font-display text-lg font-semibold text-[#17191D] mb-1">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#777873] mb-4">{svc.tagline}</p>

                <div className="grid grid-cols-2 gap-4 p-3.5 bg-[#F7F6F2] border border-[#E5E2DC] mb-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#777873] mb-1">
                      Base Investment (USD)
                    </label>
                    <input
                      type="number"
                      value={svc.baseInvestmentUsd}
                      onChange={(e) =>
                        updateServicePackage(svc.id, {
                          baseInvestmentUsd: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white border border-[#E5E2DC] px-2.5 py-1.5 text-sm font-mono font-semibold text-[#17191D] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#777873] mb-1">
                      Typical Delivery Window
                    </label>
                    <input
                      type="text"
                      value={svc.typicalTimeline}
                      onChange={(e) =>
                        updateServicePackage(svc.id, { typicalTimeline: e.target.value })
                      }
                      className="w-full bg-white border border-[#E5E2DC] px-2.5 py-1.5 text-sm text-[#17191D]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777873] block mb-2">
                    Core Deliverables
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {svc.deliverables.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 bg-[#F7F6F2] border border-[#E5E2DC] text-[#17191D]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTION 7: PROPOSALS MANAGEMENT
  // ============================================================================
  if (section === 'proposals') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
              Commercial Scopes & SOW Dispatch
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#17191D]">
              Client Proposals ({proposals.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowProposalModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17191D] text-[#F7F6F2] text-xs font-medium tracking-wider uppercase hover:bg-[#17191D]/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Issue New Proposal
          </button>
        </div>

        <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
                <th className="py-3.5 px-4">Proposal #</th>
                <th className="py-3.5 px-4">Engagement Title</th>
                <th className="py-3.5 px-4">Organisation</th>
                <th className="py-3.5 px-4">Practice Area</th>
                <th className="py-3.5 px-4">Commercial Value</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DC] text-sm">
              {proposals.map((prop) => (
                <tr key={prop.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                    {prop.proposalNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#17191D]">{prop.title}</div>
                    <div className="text-xs text-[#777873] line-clamp-1">{prop.scopeSummary}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-[#17191D]">
                    {prop.clientOrLeadName}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#777873]">{prop.serviceCategory}</td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                    ${prop.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#777873] tabular-nums">
                    {prop.validUntil}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      aria-label={`Status for ${prop.proposalNumber}`}
                      value={prop.status}
                      onChange={(e) =>
                        updateProposalStatus(prop.id, e.target.value as ProposalRecord['status'])
                      }
                      className="bg-[#F7F6F2] border border-[#E5E2DC] px-2.5 py-1 text-xs font-mono text-[#17191D]"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showProposalModal && (
          <div className="fixed inset-0 z-50 bg-[#17191D]/60 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E5E2DC] max-w-lg w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
                <h3 className="font-display text-lg font-semibold text-[#17191D]">
                  Issue Commercial Proposal
                </h3>
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="text-[#777873] hover:text-[#17191D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    placeholder="e.g., Multi-Hospital Telemedicine & Patient Acquisition Architecture"
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Client / Lead Organisation
                    </label>
                    <input
                      type="text"
                      required
                      value={propForm.clientOrLeadName}
                      onChange={(e) =>
                        setPropForm({ ...propForm, clientOrLeadName: e.target.value })
                      }
                      placeholder="e.g., Sterling Dental & Implant Centres"
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Proposed Value (USD)
                    </label>
                    <input
                      type="number"
                      required
                      min={1000}
                      value={propForm.amount}
                      onChange={(e) =>
                        setPropForm({ ...propForm, amount: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono tabular-nums"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Service Discipline
                    </label>
                    <select
                      value={propForm.serviceCategory}
                      onChange={(e) =>
                        setPropForm({
                          ...propForm,
                          serviceCategory: e.target.value as ServiceCategory,
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                    >
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={propForm.validUntil}
                      onChange={(e) => setPropForm({ ...propForm, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Executive Scope Summary
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={propForm.scopeSummary}
                    onChange={(e) => setPropForm({ ...propForm, scopeSummary: e.target.value })}
                    placeholder="Key architecture deliverables, clinical UX milestones, and SLA..."
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-4 py-2 border border-[#E5E2DC] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#17191D] text-white text-xs font-medium uppercase tracking-wider"
                  >
                    Dispatch Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // SECTION 8: PAYMENTS & GATEWAY VERIFICATION LEDGER
  // ============================================================================
  if (section === 'payments') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
              Strict Gateway Verification & Settlement Ledger
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#17191D]">
              Payments & Revenue Verification
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setPaymentFeedback(null);
              setShowPaymentModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17191D] text-[#F7F6F2] text-xs font-medium tracking-wider uppercase hover:bg-[#17191D]/90 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Payment Entry
          </button>
        </div>

        {/* Strict Separation KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E5E2DC] p-5">
            <div className="flex items-center justify-between text-xs text-[#777873] mb-2">
              <span className="font-mono uppercase tracking-wider">Verified Studio Revenue</span>
              <CheckCircle2 className="w-4 h-4 text-[#2E6F40]" />
            </div>
            <div className="font-display text-2xl font-semibold text-[#17191D] tabular-nums">
              ${financeMetrics.verifiedTotal.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#777873] mt-1">
              Confirmed via Stripe/Razorpay or verified wire reference
            </p>
          </div>

          <div className="bg-white border border-[#E5E2DC] p-5">
            <div className="flex items-center justify-between text-xs text-[#777873] mb-2">
              <span className="font-mono uppercase tracking-wider">
                Pending Manual Verification
              </span>
              <Clock className="w-4 h-4 text-[#B86B11]" />
            </div>
            <div className="font-display text-2xl font-semibold text-[#B86B11] tabular-nums">
              ${financeMetrics.pendingTotal.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#777873] mt-1">
              Excluded from verified revenue until reference confirmation
            </p>
          </div>

          <div className="bg-white border border-[#E5E2DC] p-5">
            <div className="flex items-center justify-between text-xs text-[#777873] mb-2">
              <span className="font-mono uppercase tracking-wider">Outstanding Receivables</span>
              <Receipt className="w-4 h-4 text-[#17191D]" />
            </div>
            <div className="font-display text-2xl font-semibold text-[#17191D] tabular-nums">
              ${financeMetrics.outstandingInvoicesTotal.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#777873] mt-1">
              Open Sent and Overdue client invoices
            </p>
          </div>
        </div>

        {paymentFeedback && (
          <div
            className={`p-4 border text-xs font-medium flex items-center justify-between ${
              paymentFeedback.type === 'error'
                ? 'bg-[#B42318]/10 border-[#B42318]/30 text-[#B42318]'
                : 'bg-[#2E6F40]/10 border-[#2E6F40]/30 text-[#2E6F40]'
            }`}
          >
            <span>{paymentFeedback.text}</span>
            <button type="button" onClick={() => setPaymentFeedback(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Transaction Ledger */}
        <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
          <div className="px-6 py-4 border-b border-[#E5E2DC] flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-[#17191D]">
              Transaction & Verification Ledger
            </h3>
            <span className="text-[11px] font-mono text-[#777873]">
              Manual recordings require explicit Admin confirmation
            </span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
                <th className="py-3.5 px-4">Invoice</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method & Mode</th>
                <th className="py-3.5 px-4">Gateway / Bank Reference</th>
                <th className="py-3.5 px-4">Verification Status</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DC] text-sm">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                    {pay.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-[#17191D]">
                    {pay.clientName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                    ${pay.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#777873]">
                    <div>{pay.paymentMethod}</div>
                    <div className="text-[10px] font-mono uppercase">{pay.recordingMode}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#17191D] tabular-nums">
                    {pay.transactionReference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border ${
                        pay.verificationStatus === 'Verified'
                          ? 'bg-[#2E6F40]/10 text-[#2E6F40] border-[#2E6F40]/30'
                          : 'bg-[#B86B11]/10 text-[#B86B11] border-[#B86B11]/30'
                      }`}
                    >
                      {pay.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {pay.verificationStatus === 'Pending Verification' ? (
                      verifyingPaymentId === pay.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Bank/Gateway Ref..."
                            value={confirmationRefInput}
                            onChange={(e) => setConfirmationRefInput(e.target.value)}
                            className="px-2 py-1 border border-[#E5E2DC] text-xs font-mono w-36"
                          />
                          <button
                            type="button"
                            onClick={() => handleConfirmPendingPayment(pay.id)}
                            className="px-2.5 py-1 bg-[#2E6F40] text-white text-[10px] font-mono uppercase"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setVerifyingPaymentId(null)}
                            className="px-2 py-1 border border-[#E5E2DC] text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!checkPermission('verify_payment')}
                          onClick={() => {
                            setVerifyingPaymentId(pay.id);
                            setConfirmationRefInput(pay.transactionReference || '');
                          }}
                          className="px-2.5 py-1 bg-[#17191D] text-white text-[10px] font-mono uppercase tracking-wider disabled:opacity-40 whitespace-nowrap"
                        >
                          Verify Settlement
                        </button>
                      )
                    ) : (
                      <span className="text-[11px] font-mono text-[#777873]">
                        Verified by {pay.verifiedBy || 'Gateway'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Client-Wise Revenue Breakdown */}
        <div className="bg-white border border-[#E5E2DC] p-6">
          <h3 className="font-display text-sm font-semibold text-[#17191D] mb-4">
            Client-Wise Revenue Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financeMetrics.clientBreakdown.map((item) => (
              <div key={item.clientName} className="p-4 bg-[#F7F6F2] border border-[#E5E2DC]">
                <div className="text-xs font-semibold text-[#17191D] mb-2">{item.clientName}</div>
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-[#777873]">Verified Paid:</span>
                  <span className="text-[#2E6F40] font-semibold">
                    ${item.verified.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono tabular-nums mt-1">
                  <span className="text-[#777873]">Pending Confirmation:</span>
                  <span className="text-[#B86B11]">${item.pending.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Record Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-[#17191D]/60 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E5E2DC] max-w-lg w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
                <h3 className="font-display text-lg font-semibold text-[#17191D]">
                  Record Payment Transaction
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="text-[#777873] hover:text-[#17191D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Target Invoice
                  </label>
                  <select
                    value={payForm.invoiceId}
                    onChange={(e) => {
                      const selected = invoices.find((i) => i.id === e.target.value);
                      setPayForm({
                        ...payForm,
                        invoiceId: e.target.value,
                        amount: selected ? selected.totalAmount : payForm.amount,
                      });
                    }}
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                  >
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} — {inv.clientName} (${inv.totalAmount.toLocaleString()}{' '}
                        [{inv.status}])
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Recording Mode
                    </label>
                    <select
                      value={payForm.recordingMode}
                      onChange={(e) =>
                        setPayForm({
                          ...payForm,
                          recordingMode: e.target.value as PaymentRecord['recordingMode'],
                          paymentMethod:
                            e.target.value === 'Manual Record'
                              ? 'Wire Transfer'
                              : 'Stripe Gateway',
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                    >
                      <option value="Gateway Verified">Gateway Verified</option>
                      <option value="Manual Record">Manual Record (Unverified)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={payForm.paymentMethod}
                      onChange={(e) =>
                        setPayForm({
                          ...payForm,
                          paymentMethod: e.target.value as PaymentRecord['paymentMethod'],
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                    >
                      <option value="Stripe Gateway">Stripe Gateway</option>
                      <option value="Razorpay Gateway">Razorpay Gateway</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="Manual Entry">Manual Entry</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={payForm.amount}
                      onChange={(e) =>
                        setPayForm({ ...payForm, amount: Number(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Transaction / Wire Reference
                    </label>
                    <input
                      type="text"
                      required
                      value={payForm.transactionReference}
                      onChange={(e) =>
                        setPayForm({ ...payForm, transactionReference: e.target.value })
                      }
                      placeholder="e.g., pi_3Q9xLmAveniq9941"
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#F7F6F2] border border-[#E5E2DC] text-[11px] text-[#777873]">
                  {payForm.recordingMode === 'Manual Record'
                    ? 'Security Policy: Manual payment entries are logged as "Pending Verification" and will NOT mark the invoice Paid until an Admin verifies the settlement reference.'
                    : 'Gateway Policy: Requires a valid gateway payment intent ID (minimum 6 characters).'}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border border-[#E5E2DC] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#17191D] text-white text-xs font-medium uppercase tracking-wider"
                  >
                    Submit Payment Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // SECTION 9: INVOICES & PDF DOCUMENT GENERATOR
  // ============================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
            Billing & Commercial Documentation
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#17191D]">
            Client Invoices ({invoices.length})
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowInvoiceModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17191D] text-[#F7F6F2] text-xs font-medium tracking-wider uppercase hover:bg-[#17191D]/90 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          Generate Invoice
        </button>
      </div>

      <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Project Engagement</th>
              <th className="py-3.5 px-4">Issue / Due Date</th>
              <th className="py-3.5 px-4">Total Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Document</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DC] text-sm">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                  {inv.invoiceNumber}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-[#17191D] text-xs">{inv.clientName}</div>
                  <div className="text-[11px] text-[#777873] font-mono">{inv.clientEmail}</div>
                </td>
                <td className="py-3.5 px-4 text-xs text-[#777873]">
                  {inv.projectTitle || 'Retainer Engagement'}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-[#777873] tabular-nums">
                  {inv.issueDate} → {inv.dueDate}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#17191D] tabular-nums">
                  ${inv.totalAmount.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <select
                    aria-label={`Status for ${inv.invoiceNumber}`}
                    value={inv.status}
                    onChange={(e) =>
                      updateInvoiceStatus(inv.id, e.target.value as InvoiceRecord['status'])
                    }
                    className="bg-[#F7F6F2] border border-[#E5E2DC] px-2.5 py-1 text-xs font-mono text-[#17191D]"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewInvoice(inv)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#17191D] text-white text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3" />
                      PDF Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoiceHtml(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#E5E2DC] text-[10px] font-mono uppercase tracking-wider text-[#17191D] hover:bg-[#F7F6F2] whitespace-nowrap"
                    >
                      <Download className="w-3 h-3" />
                      Export
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-[#17191D]/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E2DC] max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
              <h3 className="font-display text-lg font-semibold text-[#17191D]">
                Create Commercial Invoice
              </h3>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="text-[#777873] hover:text-[#17191D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Client Organisation
                  </label>
                  <select
                    value={invForm.clientId}
                    onChange={(e) => setInvForm({ ...invForm, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Linked Project
                  </label>
                  <select
                    value={invForm.projectId}
                    onChange={(e) => setInvForm({ ...invForm, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm bg-white"
                  >
                    <option value="">General Retainer</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invForm.dueDate}
                    onChange={(e) => setInvForm({ ...invForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={invForm.taxRatePercent}
                    onChange={(e) =>
                      setInvForm({ ...invForm, taxRatePercent: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#17191D]">Invoice Line Items</label>
                  <button
                    type="button"
                    onClick={() =>
                      setInvForm({
                        ...invForm,
                        lineItems: [
                          ...invForm.lineItems,
                          { description: 'Milestone Deliverable', quantity: 1, unitPrice: 5000 },
                        ],
                      })
                    }
                    className="text-xs font-mono text-[#17191D] underline"
                  >
                    + Add Line Item
                  </button>
                </div>
                {invForm.lineItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      required
                      placeholder="Deliverable description"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...invForm.lineItems];
                        updated[idx] = { ...item, description: e.target.value };
                        setInvForm({ ...invForm, lineItems: updated });
                      }}
                      className="col-span-6 px-2.5 py-1.5 border border-[#E5E2DC] text-xs"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...invForm.lineItems];
                        updated[idx] = { ...item, quantity: Number(e.target.value) || 1 };
                        setInvForm({ ...invForm, lineItems: updated });
                      }}
                      className="col-span-2 px-2.5 py-1.5 border border-[#E5E2DC] text-xs font-mono tabular-nums"
                    />
                    <input
                      type="number"
                      min={1}
                      value={item.unitPrice}
                      onChange={(e) => {
                        const updated = [...invForm.lineItems];
                        updated[idx] = { ...item, unitPrice: Number(e.target.value) || 0 };
                        setInvForm({ ...invForm, lineItems: updated });
                      }}
                      className="col-span-3 px-2.5 py-1.5 border border-[#E5E2DC] text-xs font-mono tabular-nums"
                    />
                    <button
                      type="button"
                      disabled={invForm.lineItems.length <= 1}
                      onClick={() =>
                        setInvForm({
                          ...invForm,
                          lineItems: invForm.lineItems.filter((_, i) => i !== idx),
                        })
                      }
                      className="col-span-1 text-[#777873] hover:text-[#B42318] disabled:opacity-30 flex justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#17191D] mb-1">
                  Settlement Terms & Wire Instructions
                </label>
                <input
                  type="text"
                  value={invForm.notes}
                  onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E2DC] text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 border border-[#E5E2DC] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#17191D] text-white text-xs font-medium uppercase tracking-wider"
                >
                  Generate & Preview PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice PDF Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-[#17191D]/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E2DC] max-w-3xl w-full p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#777873]">
                  Official Commercial Invoice Document
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E2DC] text-xs font-mono uppercase hover:bg-[#F7F6F2]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadInvoiceHtml(previewInvoice)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17191D] text-white text-xs font-mono uppercase"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Invoice
                </button>
                <button
                  type="button"
                  aria-label="Close invoice preview"
                  onClick={() => setPreviewInvoice(null)}
                  className="p-1.5 text-[#777873] hover:text-[#17191D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-6 border border-[#E5E2DC] bg-[#F7F6F2]/40 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#17191D] pb-6">
                <div>
                  <div className="font-display text-2xl font-bold tracking-[0.18em] text-[#17191D]">
                    AVENIQ
                  </div>
                  <p className="text-xs text-[#777873] mt-1">
                    Independent Digital Experience Studio • Healthcare & Enterprise Systems
                  </p>
                  <p className="text-xs font-mono text-[#777873] mt-0.5">
                    billing@aveniq.studio • Global Operations
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="font-mono text-xl font-bold text-[#17191D] tabular-nums">
                    {previewInvoice.invoiceNumber}
                  </div>
                  <div className="text-xs font-mono uppercase text-[#777873] mt-1">
                    Status: <strong className="text-[#17191D]">{previewInvoice.status}</strong>
                  </div>
                  <div className="text-xs font-mono text-[#777873] tabular-nums">
                    Issued: {previewInvoice.issueDate} • Due: {previewInvoice.dueDate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono uppercase text-[10px] tracking-wider text-[#777873] block mb-1">
                    Billed To Client
                  </span>
                  <div className="font-semibold text-sm text-[#17191D]">
                    {previewInvoice.clientName}
                  </div>
                  <div className="font-mono text-[#777873]">{previewInvoice.clientEmail}</div>
                </div>
                {previewInvoice.projectTitle && (
                  <div className="sm:text-right">
                    <span className="font-mono uppercase text-[10px] tracking-wider text-[#777873] block mb-1">
                      Project Engagement
                    </span>
                    <div className="font-medium text-[#17191D]">{previewInvoice.projectTitle}</div>
                  </div>
                )}
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#17191D] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
                    <th className="py-2.5">Deliverable Description</th>
                    <th className="py-2.5 text-right">Qty</th>
                    <th className="py-2.5 text-right">Unit Price</th>
                    <th className="py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC] text-xs">
                  {previewInvoice.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="py-3 font-medium text-[#17191D]">{li.description}</td>
                      <td className="py-3 text-right font-mono tabular-nums">{li.quantity}</td>
                      <td className="py-3 text-right font-mono tabular-nums">
                        ${li.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono font-semibold tabular-nums">
                        ${(li.quantity * li.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col items-end space-y-1.5 border-t border-[#17191D] pt-4 text-xs font-mono tabular-nums">
                <div className="flex justify-between w-56">
                  <span className="text-[#777873]">Subtotal:</span>
                  <span>${previewInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-56">
                  <span className="text-[#777873]">Tax ({previewInvoice.taxRatePercent}%):</span>
                  <span>${previewInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-56 text-sm font-bold text-[#17191D] pt-2 border-t border-[#E5E2DC]">
                  <span>Total Due (USD):</span>
                  <span>${previewInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#777873] border-t border-[#E5E2DC] pt-3">
                <strong>Settlement Instructions:</strong> {previewInvoice.notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
