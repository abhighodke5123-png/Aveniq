import React, { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  UserCheck,
  CheckSquare,
  Square,
  FileText,
  Trash2,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { ClientRecord, LeadStatus, ProjectStatus } from '../../types/admin';
import { ServiceCategory } from '../../types';
import { generateLeadsCsv } from '../../utils/adminLogic';

const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Negotiation',
  'Converted',
  'Lost',
];

const PROJECT_STATUSES: ProjectStatus[] = [
  'Planning',
  'In Progress',
  'Review',
  'Completed',
  'On Hold',
  'Cancelled',
];

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

interface AdminCrmAndProjectsProps {
  section: 'leads' | 'clients' | 'projects';
  globalSearchQuery?: string;
}

export const AdminCrmAndProjects: React.FC<AdminCrmAndProjectsProps> = ({
  section,
  globalSearchQuery = '',
}) => {
  const {
    leads,
    clients,
    projects,
    teamMembers,
    checkPermission,
    createLead,
    updateLeadStatus,
    updateLeadAssignment,
    addLeadNote,
    addLeadCommunication,
    convertLeadToClient,
    deleteLead,
    createClient,
    updateClientStatus,
    createProject,
    updateProjectStatus,
    addProjectMilestone,
    toggleProjectMilestone,
    addProjectTask,
    updateProjectTaskStatus,
    addProjectDocument,
  } = useAdminStore();

  // CRM Leads State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'All' | LeadStatus>('All');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    country: 'India',
    interestedService: 'Hospital Website' as ServiceCategory,
    budgetRange: '$25,000 - $50,000 (₹20L - ₹40L)',
    timeline: '1-3 months',
    projectDescription: '',
  });
  const [noteInput, setNoteInput] = useState('');
  const [commChannel, setCommChannel] = useState<'Email' | 'WhatsApp' | 'Discovery Call' | 'Proposal Review'>('Discovery Call');
  const [commSummary, setCommSummary] = useState('');
  const [conversionFeedback, setConversionFeedback] = useState<string | null>(null);

  // Clients State
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    companyName: '',
    primaryContactName: '',
    email: '',
    phone: '',
    country: 'India',
    industry: 'Healthcare',
    tier: 'Enterprise' as 'Enterprise' | 'Growth' | 'Boutique',
    status: 'Active' as 'Active' | 'Onboarding' | 'Retainer' | 'Inactive',
    accountManager: 'Arjun Mehta',
  });

  // Projects State
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    serviceCategory: 'Hospital Website' as ServiceCategory,
    budget: 35000,
    monthlyRetainer: 2000,
    deadline: '2026-12-31',
    leadMember: 'Arjun Mehta',
    summary: '',
  });
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDue, setNewMilestoneDue] = useState('2026-11-30');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Rohan Kapoor');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'Architecture Spec' | 'Design System' | 'Statement of Work' | 'Security Audit'>('Architecture Spec');

  // =========================================================================
  // SECTION 3: LEADS & ENQUIRIES (CRM)
  // =========================================================================
  if (section === 'leads') {
    const effectiveQuery = (leadSearch || globalSearchQuery).toLowerCase().trim();
    const filteredLeads = leads.filter((l) => {
      const matchesStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
      const matchesQuery =
        !effectiveQuery ||
        l.fullName.toLowerCase().includes(effectiveQuery) ||
        l.businessName.toLowerCase().includes(effectiveQuery) ||
        l.email.toLowerCase().includes(effectiveQuery) ||
        l.interestedService.toLowerCase().includes(effectiveQuery);
      return matchesStatus && matchesQuery;
    });

    const activeLead = leads.find((l) => l.id === selectedLeadId) || filteredLeads[0] || null;

    const handleExportCsv = () => {
      const csv = generateLeadsCsv(filteredLeads);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aveniq-leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const handleCreateLeadSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLeadForm.fullName.trim() || !newLeadForm.businessName.trim() || !newLeadForm.email.trim()) {
        return;
      }
      const created = createLead(newLeadForm);
      setSelectedLeadId(created.id);
      setShowNewLeadForm(false);
      setNewLeadForm({
        fullName: '',
        businessName: '',
        email: '',
        phone: '',
        country: 'India',
        interestedService: 'Hospital Website',
        budgetRange: '$25,000 - $50,000 (₹20L - ₹40L)',
        timeline: '1-3 months',
        projectDescription: '',
      });
    };

    const handleConvertLead = (leadId: string) => {
      const createdClient = convertLeadToClient(leadId);
      if (createdClient) {
        setConversionFeedback(
          `Converted ${createdClient.companyName} into an active Client record (${createdClient.id}).`
        );
        setTimeout(() => setConversionFeedback(null), 5000);
      }
    };

    return (
      <div className="space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div>
            <div className="text-xs font-mono text-[#777873] uppercase tracking-wider mb-1">
              Lead Management &amp; CRM Pipeline
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
              Leads &amp; Client Enquiries
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E5E2DC] hover:border-[#17191D] text-xs font-semibold text-[#17191D] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV ({filteredLeads.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNewLeadForm(!showNewLeadForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#91A99B]" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {conversionFeedback && (
          <div className="p-4 bg-[#91A99B]/20 border border-[#91A99B] text-xs text-[#17191D] font-medium flex items-center justify-between">
            <span>{conversionFeedback}</span>
            <button
              type="button"
              onClick={() => setConversionFeedback(null)}
              className="text-xs font-mono underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Create New Lead Modal/Drawer Form */}
        {showNewLeadForm && (
          <form
            onSubmit={handleCreateLeadSubmit}
            className="bg-white border border-[#17191D] p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
              <h2 className="font-heading text-base font-bold text-[#17191D]">
                Record New Inbound Lead
              </h2>
              <button
                type="button"
                onClick={() => setShowNewLeadForm(false)}
                className="text-xs text-[#777873] hover:text-[#17191D]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="new-lead-name" className="block text-xs font-mono text-[#777873] mb-1">
                  Contact Full Name *
                </label>
                <input
                  id="new-lead-name"
                  type="text"
                  required
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  placeholder="Dr. Vikram Rao"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                />
              </div>
              <div>
                <label htmlFor="new-lead-business" className="block text-xs font-mono text-[#777873] mb-1">
                  Hospital / Organisation *
                </label>
                <input
                  id="new-lead-business"
                  type="text"
                  required
                  value={newLeadForm.businessName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, businessName: e.target.value })}
                  placeholder="Sterling Heart Institute"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                />
              </div>
              <div>
                <label htmlFor="new-lead-email" className="block text-xs font-mono text-[#777873] mb-1">
                  Work Email *
                </label>
                <input
                  id="new-lead-email"
                  type="email"
                  required
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="vrao@sterlingheart.org"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                />
              </div>
              <div>
                <label htmlFor="new-lead-phone" className="block text-xs font-mono text-[#777873] mb-1">
                  Phone Number *
                </label>
                <input
                  id="new-lead-phone"
                  type="text"
                  required
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  placeholder="+91 98200 55112"
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                />
              </div>
              <div>
                <label htmlFor="new-lead-service" className="block text-xs font-mono text-[#777873] mb-1">
                  Primary Service
                </label>
                <select
                  id="new-lead-service"
                  value={newLeadForm.interestedService}
                  onChange={(e) =>
                    setNewLeadForm({
                      ...newLeadForm,
                      interestedService: e.target.value as ServiceCategory,
                    })
                  }
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                >
                  {SERVICE_CATEGORIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-lead-country" className="block text-xs font-mono text-[#777873] mb-1">
                  Country
                </label>
                <input
                  id="new-lead-country"
                  type="text"
                  value={newLeadForm.country}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, country: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                />
              </div>
            </div>

            <div>
              <label htmlFor="new-lead-desc" className="block text-xs font-mono text-[#777873] mb-1">
                Project Requirements &amp; Objectives *
              </label>
              <textarea
                id="new-lead-desc"
                rows={2}
                required
                value={newLeadForm.projectDescription}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, projectDescription: e.target.value })
                }
                placeholder="Describe clinical departments, booking requirements, and launch timeline..."
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[#17191D] text-white text-xs font-bold uppercase tracking-wider"
              >
                Save Lead to CRM
              </button>
            </div>
          </form>
        )}

        {/* Search & Status Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#777873] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              aria-label="Search leads by name, business, or email"
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              placeholder="Search leads by name, hospital, email, or service..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E2DC] text-xs text-[#17191D] focus:border-[#17191D] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#EFECE6] border border-[#E5E2DC]">
            {(['All', ...LEAD_STATUSES] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setLeadStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  leadStatusFilter === st
                    ? 'bg-[#17191D] text-white'
                    : 'text-[#777873] hover:text-[#17191D]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Split Master-Detail View: Lead Table + Detailed Lead Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Leads Table */}
          <div className="lg:col-span-7 bg-white border border-[#E5E2DC] overflow-hidden">
            {filteredLeads.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="text-sm font-bold text-[#17191D]">No matching leads found</div>
                <p className="text-xs text-[#777873]">
                  Adjust your status filter or click "Add Lead" to log a new enquiry.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[11px] font-mono uppercase text-[#777873]">
                      <th className="py-3 px-4">Organisation &amp; Contact</th>
                      <th className="py-3 px-3">Service</th>
                      <th className="py-3 px-3">Stage</th>
                      <th className="py-3 px-3">Assigned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC] text-xs">
                    {filteredLeads.map((lead) => {
                      const isSelected = activeLead?.id === lead.id;
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#EFECE6]/90' : 'hover:bg-[#F7F6F2]'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#17191D]">{lead.businessName}</div>
                            <div className="text-[11px] text-[#777873]">
                              {lead.fullName} · {lead.country}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#777873]">{lead.interestedService}</td>
                          <td className="py-3 px-3">
                            <select
                              aria-label={`Change status for ${lead.businessName}`}
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updateLeadStatus(lead.id, e.target.value as LeadStatus)
                              }
                              className="bg-white border border-[#E5E2DC] px-2 py-1 text-[11px] font-mono text-[#17191D] focus:border-[#17191D] focus:outline-none"
                            >
                              {LEAD_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-[#777873]">
                            {lead.assignedTo}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Detailed Lead Profile Panel */}
          <div className="lg:col-span-5 bg-white border border-[#E5E2DC] p-6 space-y-5">
            {activeLead ? (
              <>
                <div className="flex items-start justify-between gap-3 border-b border-[#E5E2DC] pb-4">
                  <div>
                    <div className="text-[11px] font-mono text-[#777873]">
                      Lead Profile · {activeLead.source}
                    </div>
                    <h2 className="font-heading text-lg font-extrabold text-[#17191D]">
                      {activeLead.businessName}
                    </h2>
                    <div className="text-xs text-[#777873] mt-0.5">
                      {activeLead.fullName} · {activeLead.email} · {activeLead.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activeLead.status !== 'Converted' && checkPermission('convert_lead') && (
                      <button
                        type="button"
                        onClick={() => handleConvertLead(activeLead.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17191D] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#252830] transition-colors whitespace-nowrap shrink-0"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#91A99B]" />
                        <span>Convert to Client</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteLead(activeLead.id)}
                      className="p-1.5 text-[#777873] hover:text-red-600 border border-[#E5E2DC]"
                      aria-label={`Delete lead ${activeLead.businessName}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Project Brief & Commercial Metadata */}
                <div className="space-y-2 text-xs">
                  <div className="text-[#777873] font-mono">
                    {activeLead.interestedService} · {activeLead.budgetRange} · Timeline: {activeLead.timeline}
                  </div>
                  <p className="p-3 bg-[#F7F6F2] border border-[#E5E2DC] text-[#17191D] leading-relaxed">
                    {activeLead.projectDescription}
                  </p>
                </div>

                {/* Assignment & Follow-Up Date */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E5E2DC]">
                  <div>
                    <label
                      htmlFor="lead-assign-select"
                      className="block text-[11px] font-mono text-[#777873] mb-1"
                    >
                      Assigned Owner
                    </label>
                    <select
                      id="lead-assign-select"
                      value={activeLead.assignedTo}
                      onChange={(e) =>
                        updateLeadAssignment(
                          activeLead.id,
                          e.target.value,
                          activeLead.followUpDate
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                    >
                      {teamMembers.map((tm) => (
                        <option key={tm.id} value={tm.fullName}>
                          {tm.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lead-followup-date"
                      className="block text-[11px] font-mono text-[#777873] mb-1"
                    >
                      Next Follow-Up Date
                    </label>
                    <input
                      id="lead-followup-date"
                      type="date"
                      value={activeLead.followUpDate}
                      onChange={(e) =>
                        updateLeadAssignment(
                          activeLead.id,
                          activeLead.assignedTo,
                          e.target.value
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="space-y-2 pt-3 border-t border-[#E5E2DC]">
                  <div className="text-xs font-bold text-[#17191D]">
                    Internal Studio Notes ({activeLead.internalNotes.length})
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      aria-label="Add internal note"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add internal qualification or architecture note..."
                      className="flex-1 px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addLeadNote(activeLead.id, noteInput);
                        setNoteInput('');
                      }}
                      className="px-3 py-1.5 bg-[#17191D] text-white text-xs font-semibold"
                    >
                      Add Note
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {activeLead.internalNotes.map((n) => (
                      <div key={n.id} className="p-2 bg-[#F7F6F2] text-xs">
                        <div className="text-[10px] font-mono text-[#777873]">
                          {n.author} · {n.createdAtIso.slice(0, 10)}
                        </div>
                        <div className="text-[#17191D]">{n.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Communication History */}
                <div className="space-y-2 pt-3 border-t border-[#E5E2DC]">
                  <div className="text-xs font-bold text-[#17191D]">
                    Communication History ({activeLead.communicationHistory.length})
                  </div>
                  <div className="flex gap-1.5">
                    <select
                      aria-label="Communication channel"
                      value={commChannel}
                      onChange={(e) => setCommChannel(e.target.value as typeof commChannel)}
                      className="px-2 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                    >
                      <option value="Discovery Call">Discovery Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Proposal Review">Proposal Review</option>
                    </select>
                    <input
                      type="text"
                      aria-label="Communication summary"
                      value={commSummary}
                      onChange={(e) => setCommSummary(e.target.value)}
                      placeholder="Log call or email outcome..."
                      className="flex-1 px-2.5 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addLeadCommunication(activeLead.id, commChannel, commSummary);
                        setCommSummary('');
                      }}
                      className="px-3 py-1.5 bg-[#17191D] text-white text-xs font-semibold"
                    >
                      Log
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto">
                    {activeLead.communicationHistory.map((c) => (
                      <div key={c.id} className="p-2 bg-[#F7F6F2] text-xs">
                        <div className="text-[10px] font-mono text-[#777873]">
                          {c.channel} · {c.loggedBy} · {c.timestampIso.slice(0, 10)}
                        </div>
                        <div className="text-[#17191D]">{c.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xs text-[#777873] py-8 text-center">
                Select a lead from the table to inspect full profile and communication history.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SECTION 4: CLIENTS
  // =========================================================================
  if (section === 'clients') {
    const handleCreateClient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newClientForm.companyName.trim() || !newClientForm.email.trim()) return;
      createClient(newClientForm);
      setShowNewClientForm(false);
      setNewClientForm({
        companyName: '',
        primaryContactName: '',
        email: '',
        phone: '',
        country: 'India',
        industry: 'Healthcare',
        tier: 'Enterprise',
        status: 'Active',
        accountManager: 'Arjun Mehta',
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <div>
            <div className="text-xs font-mono text-[#777873] uppercase tracking-wider mb-1">
              Client Roster &amp; Accounts
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
              Studio Clients ({clients.length})
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowNewClientForm(!showNewClientForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17191D] text-white text-xs font-bold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 text-[#91A99B]" />
            <span>Add Client</span>
          </button>
        </div>

        {showNewClientForm && (
          <form
            onSubmit={handleCreateClient}
            className="bg-white border border-[#17191D] p-6 space-y-4"
          >
            <div className="text-sm font-bold text-[#17191D]">Onboard New Client Account</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Company / Hospital Name *"
                value={newClientForm.companyName}
                onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
              <input
                type="text"
                required
                placeholder="Primary Contact Name *"
                value={newClientForm.primaryContactName}
                onChange={(e) =>
                  setNewClientForm({ ...newClientForm, primaryContactName: e.target.value })
                }
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
              <input
                type="email"
                required
                placeholder="Contact Email *"
                value={newClientForm.email}
                onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newClientForm.phone}
                onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
              <input
                type="text"
                placeholder="Country"
                value={newClientForm.country}
                onChange={(e) => setNewClientForm({ ...newClientForm, country: e.target.value })}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
              <input
                type="text"
                placeholder="Industry (e.g. Healthcare)"
                value={newClientForm.industry}
                onChange={(e) => setNewClientForm({ ...newClientForm, industry: e.target.value })}
                className="px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewClientForm(false)}
                className="px-4 py-2 border border-[#E5E2DC] text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#17191D] text-white text-xs font-bold uppercase"
              >
                Create Client Account
              </button>
            </div>
          </form>
        )}

        <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[11px] font-mono uppercase text-[#777873]">
                <th className="py-3 px-4">Client Organisation</th>
                <th className="py-3 px-4">Primary Contact</th>
                <th className="py-3 px-4">Sector &amp; Region</th>
                <th className="py-3 px-4">Account Lead</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Billed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DC] text-xs">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-[#F7F6F2]/60">
                  <td className="py-3.5 px-4 font-bold text-[#17191D]">{client.companyName}</td>
                  <td className="py-3.5 px-4 text-[#777873]">
                    <div>{client.primaryContactName}</div>
                    <div className="font-mono text-[11px]">{client.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#777873]">
                    {client.industry} · {client.country} · {client.tier}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#17191D]">
                    {client.accountManager}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      aria-label={`Status for ${client.companyName}`}
                      value={client.status}
                      onChange={(e) =>
                        updateClientStatus(
                          client.id,
                          e.target.value as ClientRecord['status']
                        )
                      }
                      className="bg-[#F7F6F2] border border-[#E5E2DC] px-2 py-1 text-[11px] font-mono"
                    >
                      <option value="Active">Active</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Retainer">Retainer</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#17191D] tabular-nums">
                    ${client.totalBilled.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SECTION 5: PROJECTS (PROJECT MANAGEMENT SYSTEM)
  // =========================================================================
  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;
    const created = createProject(newProjectForm);
    setSelectedProjectId(created.id);
    setShowNewProjectForm(false);
    setNewProjectForm({
      title: '',
      clientId: clients[0]?.id || '',
      serviceCategory: 'Hospital Website',
      budget: 35000,
      monthlyRetainer: 2000,
      deadline: '2026-12-31',
      leadMember: 'Arjun Mehta',
      summary: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
        <div>
          <div className="text-xs font-mono text-[#777873] uppercase tracking-wider mb-1">
            Delivery &amp; Engineering Operations
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] tracking-tight">
            Project Management ({projects.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowNewProjectForm(!showNewProjectForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17191D] text-white text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 text-[#91A99B]" />
          <span>Create Project</span>
        </button>
      </div>

      {showNewProjectForm && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white border border-[#17191D] p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
            <h2 className="font-heading text-base font-bold text-[#17191D]">
              Initialize New Studio Project
            </h2>
            <button
              type="button"
              onClick={() => setShowNewProjectForm(false)}
              className="text-xs text-[#777873]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="proj-title-input" className="block text-xs font-mono text-[#777873] mb-1">
                Project Title *
              </label>
              <input
                id="proj-title-input"
                type="text"
                required
                value={newProjectForm.title}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                placeholder="Apex Cardiac Sciences Portal"
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              />
            </div>

            <div>
              <label htmlFor="proj-client-select" className="block text-xs font-mono text-[#777873] mb-1">
                Assign Client *
              </label>
              <select
                id="proj-client-select"
                value={newProjectForm.clientId}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, clientId: e.target.value })}
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="proj-lead-select" className="block text-xs font-mono text-[#777873] mb-1">
                Project Lead
              </label>
              <select
                id="proj-lead-select"
                value={newProjectForm.leadMember}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, leadMember: e.target.value })}
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              >
                {teamMembers.map((tm) => (
                  <option key={tm.id} value={tm.fullName}>
                    {tm.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="proj-budget-input" className="block text-xs font-mono text-[#777873] mb-1">
                Total Budget (USD) *
              </label>
              <input
                id="proj-budget-input"
                type="number"
                required
                value={newProjectForm.budget}
                onChange={(e) =>
                  setNewProjectForm({ ...newProjectForm, budget: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs font-mono"
              />
            </div>

            <div>
              <label htmlFor="proj-deadline-input" className="block text-xs font-mono text-[#777873] mb-1">
                Target Deadline *
              </label>
              <input
                id="proj-deadline-input"
                type="date"
                required
                value={newProjectForm.deadline}
                onChange={(e) => setNewProjectForm({ ...newProjectForm, deadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs font-mono"
              />
            </div>

            <div>
              <label htmlFor="proj-service-select" className="block text-xs font-mono text-[#777873] mb-1">
                Service Category
              </label>
              <select
                id="proj-service-select"
                value={newProjectForm.serviceCategory}
                onChange={(e) =>
                  setNewProjectForm({
                    ...newProjectForm,
                    serviceCategory: e.target.value as ServiceCategory,
                  })
                }
                className="w-full px-3 py-2 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
              >
                {SERVICE_CATEGORIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#17191D] text-white text-xs font-bold uppercase tracking-wider"
            >
              Launch Project Workspace
            </button>
          </div>
        </form>
      )}

      {/* Master-Detail Project List & Project Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Project List */}
        <div className="lg:col-span-5 space-y-3">
          {projects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-5 border cursor-pointer transition-colors space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#17191D]'
                    : 'bg-white border-[#E5E2DC] hover:border-[#17191D]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono text-[#777873]">
                      {proj.clientName} · Due {proj.deadline}
                    </div>
                    <h3 className="font-heading text-sm font-bold text-[#17191D] mt-0.5">
                      {proj.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#17191D] tabular-nums">
                    ${proj.budget.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#777873] tabular-nums">
                    <span>{proj.status}</span>
                    <span>{proj.progress}% Complete</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EFECE6]">
                    <div
                      className="h-full bg-[#17191D]"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Project Workspace (Milestones, Tasks, Documents, Status) */}
        <div className="lg:col-span-7 bg-white border border-[#E5E2DC] p-6 space-y-6">
          {activeProject ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2DC] pb-4">
                <div>
                  <div className="text-xs font-mono text-[#777873]">
                    {activeProject.clientName} · Lead: {activeProject.leadMember}
                  </div>
                  <h2 className="font-heading text-lg font-extrabold text-[#17191D]">
                    {activeProject.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    aria-label={`Project status for ${activeProject.title}`}
                    value={activeProject.status}
                    onChange={(e) =>
                      updateProjectStatus(
                        activeProject.id,
                        e.target.value as ProjectStatus
                      )
                    }
                    className="px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs font-mono"
                  >
                    {PROJECT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timeline & Progress Slider */}
              <div className="p-4 bg-[#F7F6F2] border border-[#E5E2DC] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span>Start: {activeProject.startDate}</span>
                  <span className="font-bold text-[#17191D]">
                    Completion Progress: {activeProject.progress}%
                  </span>
                  <span>Deadline: {activeProject.deadline}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  aria-label="Project completion percentage"
                  value={activeProject.progress}
                  onChange={(e) =>
                    updateProjectStatus(
                      activeProject.id,
                      activeProject.status,
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-[#17191D]"
                />
              </div>

              {/* Milestones Section */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#17191D] uppercase font-mono">
                  Project Milestones ({activeProject.milestones.length})
                </div>
                <div className="space-y-2">
                  {activeProject.milestones.map((ms) => (
                    <div
                      key={ms.id}
                      onClick={() => toggleProjectMilestone(activeProject.id, ms.id)}
                      className="flex items-center justify-between p-2.5 bg-[#F7F6F2] border border-[#E5E2DC] cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {ms.completed ? (
                          <CheckSquare className="w-4 h-4 text-[#2E4639]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#777873]" />
                        )}
                        <span className={ms.completed ? 'line-through text-[#777873]' : 'text-[#17191D] font-medium'}>
                          {ms.title}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#777873] tabular-nums">
                        Due {ms.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="New milestone title"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="Add milestone (e.g. UAT & Clinical Sign-off)..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                  />
                  <input
                    type="date"
                    aria-label="New milestone due date"
                    value={newMilestoneDue}
                    onChange={(e) => setNewMilestoneDue(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addProjectMilestone(activeProject.id, newMilestoneTitle, newMilestoneDue);
                      setNewMilestoneTitle('');
                    }}
                    className="px-3 py-1.5 bg-[#17191D] text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Tasks Section */}
              <div className="space-y-3 pt-4 border-t border-[#E5E2DC]">
                <div className="text-xs font-bold text-[#17191D] uppercase font-mono">
                  Engineering &amp; Design Tasks ({activeProject.tasks.length})
                </div>
                <div className="space-y-2">
                  {activeProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs gap-2"
                    >
                      <div>
                        <div className="font-medium text-[#17191D]">{task.title}</div>
                        <div className="text-[11px] font-mono text-[#777873]">
                          {task.assignedTo} · Priority: {task.priority}
                        </div>
                      </div>
                      <select
                        aria-label={`Status for task ${task.title}`}
                        value={task.status}
                        onChange={(e) =>
                          updateProjectTaskStatus(
                            activeProject.id,
                            task.id,
                            e.target.value as typeof task.status
                          )
                        }
                        className="px-2 py-1 bg-white border border-[#E5E2DC] text-[11px] font-mono"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Review</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    aria-label="New task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add task..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                  />
                  <select
                    aria-label="Task assignee"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="px-2 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                  >
                    {teamMembers.map((tm) => (
                      <option key={tm.id} value={tm.fullName}>
                        {tm.fullName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      addProjectTask(
                        activeProject.id,
                        newTaskTitle,
                        newTaskAssignee,
                        newTaskPriority,
                        activeProject.deadline
                      );
                      setNewTaskTitle('');
                    }}
                    className="px-3 py-1.5 bg-[#17191D] text-white text-xs font-semibold"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              {/* Project Documents Section */}
              <div className="space-y-3 pt-4 border-t border-[#E5E2DC]">
                <div className="text-xs font-bold text-[#17191D] uppercase font-mono">
                  Project Specifications &amp; Documents ({activeProject.documents.length})
                </div>
                <div className="space-y-1.5">
                  {activeProject.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#777873]" />
                        <span className="font-medium text-[#17191D]">{doc.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#777873]">
                        {doc.category} · {doc.sizeLabel}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    aria-label="Document file name"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Document filename (e.g. Clinical-UX-Spec-v3.pdf)..."
                    className="flex-1 px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addProjectDocument(activeProject.id, newDocName, newDocCategory);
                      setNewDocName('');
                    }}
                    className="px-3 py-1.5 bg-[#17191D] text-white text-xs font-semibold"
                  >
                    Attach Document
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
