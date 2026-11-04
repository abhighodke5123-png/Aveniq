import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Calendar,
  TrendingUp,
  FolderKanban,
  Users,
  FileText,
  DollarSign,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { calculateDashboardMetrics } from '../../utils/adminLogic';
import { AdminSectionId, DateRangeFilter } from '../../types/admin';

interface AdminOverviewAndAnalyticsProps {
  section: 'overview' | 'analytics';
  onNavigateSection: (sec: AdminSectionId) => void;
}

export const AdminOverviewAndAnalytics: React.FC<AdminOverviewAndAnalyticsProps> = ({
  section,
  onNavigateSection,
}) => {
  const { leads, clients, projects, invoices, payments, activityLogs } = useAdminStore();

  const [dateFilter, setDateFilter] = useState<DateRangeFilter>('90d');
  const [customStart, setCustomStart] = useState('2026-08-01');
  const [customEnd, setCustomEnd] = useState('2026-11-30');

  const metrics = useMemo(
    () =>
      calculateDashboardMetrics({
        leads,
        clients,
        projects,
        invoices,
        payments,
        dateFilter,
        customRange: { start: customStart, end: customEnd },
      }),
    [leads, clients, projects, invoices, payments, dateFilter, customStart, customEnd]
  );

  const maxMonthlyVal = Math.max(
    1,
    ...metrics.monthlyRevenueSeries.map((m) =>
      Math.max(m.verifiedRevenue, m.invoicedAmount)
    )
  );

  const maxStageCount = Math.max(
    1,
    ...metrics.leadAcquisitionSeries.map((s) => s.count)
  );

  if (section === 'analytics') {
    // Compute service line revenue and geography from actual records
    const serviceBreakdown = [
      'Hospital Website',
      'Clinic Website',
      'Business Website',
      'Website Redesign',
      'AI & Automation',
      'SEO & Digital Growth',
    ].map((svc) => {
      const matchingProjects = projects.filter((p) => p.serviceCategory === svc);
      const contracted = matchingProjects.reduce((s, p) => s + p.budget, 0);
      const matchingLeads = leads.filter((l) => l.interestedService === svc).length;
      return { service: svc, projectsCount: matchingProjects.length, contracted, matchingLeads };
    });

    const countryCounts = clients.reduce<Record<string, number>>((acc, c) => {
      acc[c.country] = (acc[c.country] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div>
            <div className="text-xs font-mono text-[#777873] uppercase tracking-wider mb-1">
              Intelligence &amp; Attribution
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
              Studio Performance Analytics
            </h1>
          </div>
          <div className="text-xs text-[#777873] font-mono tabular-nums">
            Computed from {leads.length} Leads · {projects.length} Projects · {payments.length} Transactions
          </div>
        </div>

        {/* Top KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E5E2DC] p-5 space-y-1">
            <div className="text-xs text-[#777873]">Lead-to-Client Conversion Rate</div>
            <div className="font-mono text-2xl font-bold text-[#17191D] tabular-nums">
              {metrics.conversionRatePercent}%
            </div>
            <div className="text-xs text-[#777873] tabular-nums">
              {metrics.convertedLeadsCount} of {metrics.totalLeadsCount} qualified enquiries
            </div>
          </div>

          <div className="bg-white border border-[#E5E2DC] p-5 space-y-1">
            <div className="text-xs text-[#777873]">Average Project Contract Value</div>
            <div className="font-mono text-2xl font-bold text-[#17191D] tabular-nums">
              $
              {projects.length > 0
                ? Math.round(
                    projects.reduce((s, p) => s + p.budget, 0) / projects.length
                  ).toLocaleString()
                : 0}
            </div>
            <div className="text-xs text-[#777873]">Across active &amp; completed engagements</div>
          </div>

          <div className="bg-white border border-[#E5E2DC] p-5 space-y-1">
            <div className="text-xs text-[#777873]">Mean Portfolio Delivery Velocity</div>
            <div className="font-mono text-2xl font-bold text-[#17191D] tabular-nums">
              {metrics.projectCompletionRatePercent}%
            </div>
            <div className="text-xs text-[#777873] tabular-nums">
              {metrics.completedProjectsCount} completed · {metrics.activeProjectsCount} active
            </div>
          </div>

          <div className="bg-white border border-[#E5E2DC] p-5 space-y-1">
            <div className="text-xs text-[#777873]">Annualized Recurring Retainers (ARR)</div>
            <div className="font-mono text-2xl font-bold text-[#17191D] tabular-nums">
              ${(metrics.monthlyRecurringRevenue * 12).toLocaleString()}
            </div>
            <div className="text-xs text-[#777873] tabular-nums">
              ${metrics.monthlyRecurringRevenue.toLocaleString()} MRR baseline
            </div>
          </div>
        </div>

        {/* Service Attribution Table & Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-[#E5E2DC] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
              <h2 className="font-heading text-base font-bold text-[#17191D]">
                Contracted Volume &amp; Demand by Service Specialisation
              </h2>
              <span className="text-xs text-[#777873] font-mono">Live Database Aggregation</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E2DC] text-[11px] font-mono uppercase text-[#777873]">
                    <th className="py-2.5 pr-4">Service Line</th>
                    <th className="py-2.5 px-4 text-right">Inbound Leads</th>
                    <th className="py-2.5 px-4 text-right">Active Projects</th>
                    <th className="py-2.5 pl-4 text-right">Contracted Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC] text-xs">
                  {serviceBreakdown.map((row) => (
                    <tr key={row.service} className="hover:bg-[#F7F6F2]/60">
                      <td className="py-3 pr-4 font-medium text-[#17191D]">{row.service}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#777873]">
                        {row.matchingLeads}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#777873]">
                        {row.projectsCount}
                      </td>
                      <td className="py-3 pl-4 text-right font-mono font-semibold tabular-nums text-[#17191D]">
                        ${row.contracted.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-[#E5E2DC] p-6 space-y-4">
            <div className="border-b border-[#E5E2DC] pb-3">
              <h2 className="font-heading text-base font-bold text-[#17191D]">
                Client Footprint by Geography
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(countryCounts).map(([country, count]) => {
                const pct = clients.length > 0 ? Math.round((count / clients.length) * 100) : 0;
                return (
                  <div key={country} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#17191D]">{country}</span>
                      <span className="font-mono text-[#777873] tabular-nums">
                        {count} client{count === 1 ? '' : 's'} · {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#EFECE6]">
                      <div
                        className="h-full bg-[#17191D]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Command Centre Header & Date Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
        <div>
          <div className="text-xs font-mono text-[#777873] uppercase tracking-wider mb-1">
            Executive Command Centre
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
            Studio Operations &amp; Financial Overview
          </h1>
        </div>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 p-1 bg-[#EFECE6] border border-[#E5E2DC]">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: 'Last 7 days' },
                { id: '30d', label: 'Last 30 days' },
                { id: '90d', label: 'Last 90 days' },
                { id: 'custom', label: 'Custom range' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setDateFilter(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  dateFilter === opt.id
                    ? 'bg-[#17191D] text-[#F7F6F2]'
                    : 'text-[#777873] hover:text-[#17191D]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 text-xs font-mono bg-white border border-[#E5E2DC] px-2.5 py-1">
              <Calendar className="w-3.5 h-3.5 text-[#777873]" />
              <input
                type="date"
                aria-label="Custom range start date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-transparent text-xs focus:outline-none"
              />
              <span>to</span>
              <input
                type="date"
                aria-label="Custom range end date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-transparent text-xs focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Primary KPI Grid (All calculated from actual database records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Revenue */}
        <div className="bg-white border border-[#E5E2DC] p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#777873]">
            <span>Verified Revenue Received</span>
            <DollarSign className="w-4 h-4 text-[#2E4639]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#17191D] tabular-nums">
            ${metrics.totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-[#777873] pt-2 border-t border-[#E5E2DC] tabular-nums">
            <span>MRR: ${metrics.monthlyRecurringRevenue.toLocaleString()}/mo</span>
            <button
              type="button"
              onClick={() => onNavigateSection('payments')}
              className="text-[#17191D] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Ledger</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Outstanding Invoices & Pending Payments */}
        <div className="bg-white border border-[#E5E2DC] p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#777873]">
            <span>Outstanding Invoices</span>
            <FileText className="w-4 h-4 text-[#777873]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#17191D] tabular-nums">
            ${metrics.outstandingInvoicesTotal.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-[#777873] pt-2 border-t border-[#E5E2DC] tabular-nums">
            <span>
              {metrics.outstandingInvoicesCount} open · ${metrics.pendingPaymentsTotal.toLocaleString()} unverified
            </span>
            <button
              type="button"
              onClick={() => onNavigateSection('invoices')}
              className="text-[#17191D] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Invoices</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3. Projects (Active, Pending, Completed) */}
        <div className="bg-white border border-[#E5E2DC] p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#777873]">
            <span>Active Studio Projects</span>
            <FolderKanban className="w-4 h-4 text-[#777873]" />
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#17191D] tabular-nums">
            {metrics.activeProjectsCount}
          </div>
          <div className="flex items-center justify-between text-xs text-[#777873] pt-2 border-t border-[#E5E2DC] tabular-nums">
            <span>
              {metrics.pendingProjectsCount} pending · {metrics.completedProjectsCount} completed
            </span>
            <button
              type="button"
              onClick={() => onNavigateSection('projects')}
              className="text-[#17191D] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>Projects</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4. Clients, New Enquiries & Conversion Rate */}
        <div className="bg-white border border-[#E5E2DC] p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-[#777873]">
            <span>Total Clients &amp; Conversion</span>
            <Users className="w-4 h-4 text-[#777873]" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#17191D] tabular-nums">
              {metrics.totalClients}
            </span>
            <span className="text-xs font-mono text-[#2E4639] tabular-nums">
              {metrics.conversionRatePercent}% conv.
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#777873] pt-2 border-t border-[#E5E2DC] tabular-nums">
            <span>{metrics.newEnquiriesCount} new enquiries awaiting triage</span>
            <button
              type="button"
              onClick={() => onNavigateSection('leads')}
              className="text-[#17191D] font-semibold hover:underline inline-flex items-center gap-0.5"
            >
              <span>CRM</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts Row: Monthly Revenue Graph & Lead Acquisition Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue & Invoiced Graph */}
        <div className="lg:col-span-7 bg-white border border-[#E5E2DC] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E2DC] pb-4">
            <div>
              <h2 className="font-heading text-base font-bold text-[#17191D]">
                Monthly Verified Revenue vs. Invoiced Billing
              </h2>
              <p className="text-xs text-[#777873]">
                Calculated directly from verified gateway settlements and issued client invoices
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#17191D]">
                <span className="w-2.5 h-2.5 bg-[#17191D] inline-block" /> Verified Paid
              </span>
              <span className="flex items-center gap-1.5 text-[#777873]">
                <span className="w-2.5 h-2.5 bg-[#91A99B] inline-block" /> Invoiced
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3 items-end h-48 pt-4 px-2 border-b border-[#E5E2DC]">
            {metrics.monthlyRevenueSeries.map((item) => {
              const paidHeightPct = Math.round((item.verifiedRevenue / maxMonthlyVal) * 100);
              const invHeightPct = Math.round((item.invoicedAmount / maxMonthlyVal) * 100);
              return (
                <div key={item.month} className="flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    <div
                      title={`Verified Paid: $${item.verifiedRevenue.toLocaleString()}`}
                      className="w-4 sm:w-5 bg-[#17191D] transition-all"
                      style={{ height: `${Math.max(paidHeightPct, item.verifiedRevenue > 0 ? 8 : 2)}%` }}
                    />
                    <div
                      title={`Invoiced: $${item.invoicedAmount.toLocaleString()}`}
                      className="w-4 sm:w-5 bg-[#91A99B] transition-all"
                      style={{ height: `${Math.max(invHeightPct, item.invoicedAmount > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-[#777873] tabular-nums">{item.month}</div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#777873] font-mono tabular-nums">
            <span>Total Verified: ${metrics.totalRevenue.toLocaleString()}</span>
            <span>Pending Verification: ${metrics.pendingPaymentsTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Lead Acquisition & Pipeline Stage Graph */}
        <div className="lg:col-span-5 bg-white border border-[#E5E2DC] p-6 space-y-5">
          <div className="border-b border-[#E5E2DC] pb-4">
            <h2 className="font-heading text-base font-bold text-[#17191D]">
              Lead Acquisition &amp; Pipeline Stages
            </h2>
            <p className="text-xs text-[#777873]">
              Distribution across {leads.length} active CRM enquiries
            </p>
          </div>

          <div className="space-y-3">
            {metrics.leadAcquisitionSeries.map((item) => {
              const widthPct = Math.round((item.count / maxStageCount) * 100);
              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#17191D]">{item.stage}</span>
                    <span className="font-mono text-[#777873] tabular-nums">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-[#EFECE6]">
                    <div
                      className={`h-full ${
                        item.stage === 'Converted' ? 'bg-[#2E4639]' : 'bg-[#17191D]'
                      }`}
                      style={{ width: `${Math.max(widthPct, item.count > 0 ? 10 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Project Completion Analytics, Recent Transactions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Completion Progress */}
        <div className="lg:col-span-5 bg-white border border-[#E5E2DC] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
            <h2 className="font-heading text-base font-bold text-[#17191D]">
              Project Completion Analytics
            </h2>
            <span className="font-mono text-xs text-[#2E4639] font-semibold tabular-nums">
              Avg {metrics.projectCompletionRatePercent}%
            </span>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-[#17191D] truncate">{proj.title}</span>
                  <span className="font-mono text-[#777873] tabular-nums shrink-0">
                    {proj.status} · {proj.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#EFECE6]">
                  <div
                    className="h-full bg-[#17191D] transition-all"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-4 bg-white border border-[#E5E2DC] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
            <h2 className="font-heading text-base font-bold text-[#17191D]">
              Recent Transactions
            </h2>
            <button
              type="button"
              onClick={() => onNavigateSection('payments')}
              className="text-xs font-mono text-[#17191D] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-[#E5E2DC]">
            {payments.slice(0, 4).map((pay) => (
              <div key={pay.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <div className="font-semibold text-[#17191D] truncate">{pay.clientName}</div>
                  <div className="text-[11px] font-mono text-[#777873]">
                    {pay.invoiceNumber} · {pay.verificationStatus}
                  </div>
                </div>
                <div className="font-mono font-bold text-[#17191D] tabular-nums shrink-0">
                  ${pay.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Client & System Activity */}
        <div className="lg:col-span-3 bg-white border border-[#E5E2DC] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
            <h2 className="font-heading text-base font-bold text-[#17191D]">
              Recent Activity
            </h2>
            <button
              type="button"
              onClick={() => onNavigateSection('logs')}
              className="text-xs font-mono text-[#17191D] hover:underline"
            >
              Audit Log
            </button>
          </div>

          <div className="divide-y divide-[#E5E2DC]">
            {activityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="py-2.5 space-y-0.5 text-xs">
                <div className="font-mono text-[11px] text-[#777873]">
                  {log.action} · {log.actorRole}
                </div>
                <div className="text-[#17191D] leading-snug line-clamp-2">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
