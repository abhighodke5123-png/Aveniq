import React, { useState } from 'react';
import {
  Users,
  FileCode2,
  Settings,
  Plug,
  Activity,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Lock,
  Database,
  Search,
  X,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { AdminRole, TeamMemberRecord } from '../../types/admin';
import { CONCEPT_PROJECTS, INDUSTRIES_DATA } from '../../data/studioData';
import { canPerformAdminAction, AdminPermissionAction } from '../../utils/adminLogic';

const ALL_ROLES: AdminRole[] = ['Super Admin', 'Admin', 'Manager', 'Staff'];

const PERMISSION_MATRIX_ROWS: { action: AdminPermissionAction; label: string }[] = [
  { action: 'view_dashboard', label: 'View Command Centre & KPI Analytics' },
  { action: 'manage_leads', label: 'Manage CRM Leads, Notes & Follow-ups' },
  { action: 'convert_lead', label: 'Convert Qualified Leads to Active Clients' },
  { action: 'manage_clients', label: 'Create & Edit Client Organisations' },
  { action: 'manage_projects', label: 'Manage Projects, Milestones & Tasks' },
  { action: 'manage_proposals', label: 'Issue & Update Commercial Proposals' },
  { action: 'create_invoice', label: 'Generate & Modify Client Invoices' },
  { action: 'record_manual_payment', label: 'Record Manual Payment Entries' },
  { action: 'verify_payment', label: 'Verify Manual Payments & Gateway Settlements' },
  { action: 'manage_team', label: 'Onboard Studio Team Members' },
  { action: 'manage_settings', label: 'Modify Global Website & Studio Settings' },
  { action: 'manage_roles_security', label: 'Configure RBAC Roles & Security Policies' },
];

export const AdminGovernanceAndSystem: React.FC<{
  section: 'team' | 'content' | 'settings' | 'integrations' | 'logs' | 'security';
}> = ({ section }) => {
  const {
    session,
    teamMembers,
    websiteSettings,
    activityLogs,
    checkPermission,
    createTeamMember,
    updateTeamMemberRole,
    updateWebsiteSettings,
    switchSessionRole,
  } = useAdminStore();

  // Team member modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    fullName: '',
    email: '',
    role: 'Staff' as AdminRole,
    title: '',
    department: 'Engineering' as TeamMemberRecord['department'],
  });

  // Settings local form state
  const [settingsForm, setSettingsForm] = useState(websiteSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string | null>(null);

  // Activity log search
  const [logQuery, setLogQuery] = useState('');

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.fullName.trim() || !teamForm.email.trim()) return;
    createTeamMember(teamForm);
    setShowTeamModal(false);
    setTeamForm({
      fullName: '',
      email: '',
      role: 'Staff',
      title: '',
      department: 'Engineering',
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('manage_settings')) return;
    updateWebsiteSettings(settingsForm);
    setSettingsSavedMsg('Global studio settings persisted and logged in audit trail.');
    setTimeout(() => setSettingsSavedMsg(null), 3000);
  };

  // ============================================================================
  // SECTION 10: TEAM MANAGEMENT
  // ============================================================================
  if (section === 'team') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
              Studio Roster & Capacity Allocation
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#17191D]">
              Team Management ({teamMembers.length})
            </h2>
          </div>
          <button
            type="button"
            disabled={!checkPermission('manage_team')}
            onClick={() => setShowTeamModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17191D] text-[#F7F6F2] text-xs font-medium tracking-wider uppercase hover:bg-[#17191D]/90 transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Team Member
          </button>
        </div>

        <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
                <th className="py-3.5 px-4">Member</th>
                <th className="py-3.5 px-4">Title & Practice</th>
                <th className="py-3.5 px-4">RBAC Role</th>
                <th className="py-3.5 px-4">Active Projects</th>
                <th className="py-3.5 px-4">Studio Utilization</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DC] text-sm">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#17191D] text-xs">{member.fullName}</div>
                    <div className="font-mono text-[11px] text-[#777873]">{member.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs text-[#17191D]">{member.title}</div>
                    <div className="text-[11px] text-[#777873] font-mono">{member.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      aria-label={`Role for ${member.fullName}`}
                      disabled={!checkPermission('manage_roles_security')}
                      value={member.role}
                      onChange={(e) =>
                        updateTeamMemberRole(member.id, e.target.value as AdminRole)
                      }
                      className="bg-[#F7F6F2] border border-[#E5E2DC] px-2.5 py-1 text-xs font-mono text-[#17191D] disabled:opacity-60"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#17191D] tabular-nums">
                    {member.activeProjectsCount} engagements
                  </td>
                  <td className="py-3.5 px-4 w-48">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1 tabular-nums">
                      <span>Capacity</span>
                      <span>{member.utilizationPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E5E2DC]">
                      <div
                        className="h-full bg-[#17191D]"
                        style={{ width: `${member.utilizationPercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#2E6F40]/10 text-[#2E6F40] border border-[#2E6F40]/30">
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showTeamModal && (
          <div className="fixed inset-0 z-50 bg-[#17191D]/60 flex items-center justify-center p-4">
            <div className="bg-white border border-[#E5E2DC] max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-3">
                <h3 className="font-display text-lg font-semibold text-[#17191D]">
                  Onboard Studio Member
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="text-[#777873] hover:text-[#17191D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddTeamMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teamForm.fullName}
                    onChange={(e) => setTeamForm({ ...teamForm, fullName: e.target.value })}
                    placeholder="e.g., Priya Nair"
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">
                    Studio Email
                  </label>
                  <input
                    type="email"
                    required
                    value={teamForm.email}
                    onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                    placeholder="priya@aveniq.studio"
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#17191D] mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={teamForm.title}
                    onChange={(e) => setTeamForm({ ...teamForm, title: e.target.value })}
                    placeholder="Senior Frontend Architect"
                    className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      Department
                    </label>
                    <select
                      value={teamForm.department}
                      onChange={(e) =>
                        setTeamForm({
                          ...teamForm,
                          department: e.target.value as TeamMemberRecord['department'],
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-xs bg-white"
                    >
                      <option value="Executive">Executive</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design & UX">Design & UX</option>
                      <option value="Healthcare Strategy">Healthcare Strategy</option>
                      <option value="Search & Growth">Search & Growth</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#17191D] mb-1">
                      RBAC Role
                    </label>
                    <select
                      value={teamForm.role}
                      onChange={(e) =>
                        setTeamForm({ ...teamForm, role: e.target.value as AdminRole })
                      }
                      className="w-full px-3 py-2 border border-[#E5E2DC] text-xs bg-white"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTeamModal(false)}
                    className="px-4 py-2 border border-[#E5E2DC] text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#17191D] text-white text-xs font-medium uppercase tracking-wider"
                  >
                    Add Member
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
  // SECTION 11: CONTENT MANAGEMENT (CASE STUDIES & INDUSTRIES)
  // ============================================================================
  if (section === 'content') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
            Editorial Portfolio & Industry Verticals
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#17191D]">
            Published Case Studies ({CONCEPT_PROJECTS.length}) & Verticals ({INDUSTRIES_DATA.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONCEPT_PROJECTS.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E2DC] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#777873] mb-2">
                  <span>{item.industry}</span>
                  <span className="text-[#2E6F40]">Published</span>
                </div>
                <h3 className="font-display text-base font-semibold text-[#17191D] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#777873] mb-3">{item.tagline}</p>
                <div className="flex flex-wrap gap-1">
                  {item.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC] text-[10px] font-mono text-[#17191D]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-[#E5E2DC] text-[11px] font-mono text-[#777873] tabular-nums">
                {item.deliverables.length} Deliverables • {item.architectureHighlights.length}{' '}
                Architecture Specs
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTION 12: WEBSITE SETTINGS
  // ============================================================================
  if (section === 'settings') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
            Global Brand & Operational Configuration
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#17191D]">
            Website & Studio Settings
          </h2>
        </div>

        {settingsSavedMsg && (
          <div className="p-4 bg-[#2E6F40]/10 border border-[#2E6F40]/30 text-[#2E6F40] text-xs font-medium">
            {settingsSavedMsg}
          </div>
        )}

        <form
          onSubmit={handleSaveSettings}
          className="bg-white border border-[#E5E2DC] p-6 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-[#17191D] mb-1">Brand Name</label>
              <input
                type="text"
                value={settingsForm.brandName}
                onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17191D] mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#17191D] mb-1">
              Primary Hero Headline
            </label>
            <input
              type="text"
              value={settingsForm.heroHeadline}
              onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-[#17191D] mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17191D] mb-1">
                WhatsApp Direct Number
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#17191D] mb-1">
                Target Geography
              </label>
              <input
                type="text"
                value={settingsForm.primaryGeography}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, primaryGeography: e.target.value })
                }
                className="w-full px-3 py-2 border border-[#E5E2DC] text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-xs text-[#17191D] cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.ndaProtectionBanner}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, ndaProtectionBanner: e.target.checked })
                }
              />
              Display Mutual NDA Protection Notice on Enquiry Forms
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-[#17191D] cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.maintenanceMode}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })
                }
              />
              Enable Scheduled Maintenance Banner
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-[#E5E2DC] pt-4">
            <span className="text-[11px] font-mono text-[#777873]">
              Last updated by {websiteSettings.updatedBy}
            </span>
            <button
              type="submit"
              disabled={!checkPermission('manage_settings')}
              className="px-5 py-2.5 bg-[#17191D] text-white text-xs font-medium uppercase tracking-wider disabled:opacity-40"
            >
              Save Studio Configuration
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ============================================================================
  // SECTION 13: INTEGRATIONS & CLOUD INFRASTRUCTURE
  // ============================================================================
  if (section === 'integrations') {
    const integrationsList = [
      {
        name: 'Firebase Firestore & Google Auth',
        provider: 'Google Cloud (asia-southeast1)',
        identifier: 'directed-correlate-vdckx',
        status: 'Connected & Live',
        description:
          'Real-time public website enquiry ingestion, security rules enforcement, and Super Admin OAuth verification.',
      },
      {
        name: 'Supabase PostgreSQL Schema & RLS',
        provider: 'PostgreSQL 16 Migration Ready',
        identifier: 'supabase/migrations/001_aveniq_admin_schema.sql',
        status: 'Schema Provisioned',
        description:
          'Complete relational schema with 13 normalized tables, foreign keys, indexes, and Row Level Security policies.',
      },
      {
        name: 'Stripe & Razorpay Gateway Verification',
        provider: 'Commercial Settlement Guard',
        identifier: 'Webhook Signature & Intent Validation',
        status: 'Active Guard',
        description:
          'Separates verified gateway payment intents from manual wire recordings to prevent unverified revenue inflation.',
      },
      {
        name: 'WhatsApp Business Direct Triage',
        provider: 'Meta Cloud API / Deep Link',
        identifier: `+${websiteSettings.whatsappNumber}`,
        status: 'Operational',
        description:
          'Instant consultation routing for hospital leadership and enterprise clients.',
      },
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
            Cloud Infrastructure & Third-Party Connectors
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#17191D]">
            Connected Studio Integrations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {integrationsList.map((item) => (
            <div key={item.name} className="bg-white border border-[#E5E2DC] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#777873]">{item.provider}</span>
                <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#2E6F40]/10 text-[#2E6F40] border border-[#2E6F40]/30">
                  {item.status}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[#17191D]">{item.name}</h3>
              <p className="text-xs text-[#777873] leading-relaxed">{item.description}</p>
              <div className="pt-2 border-t border-[#E5E2DC] font-mono text-[11px] text-[#17191D]">
                Resource: {item.identifier}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTION 14: IMMUTABLE ACTIVITY LOGS
  // ============================================================================
  if (section === 'logs') {
    const filteredLogs = activityLogs.filter((log) => {
      if (!logQuery.trim()) return true;
      const q = logQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actorEmail.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q)
      );
    });

    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
              Compliance & Governance Ledger
            </span>
            <h2 className="font-display text-2xl font-semibold text-[#17191D]">
              Administrative Activity Logs ({filteredLogs.length})
            </h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#777873] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by actor, action, entity..."
              value={logQuery}
              onChange={(e) => setLogQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#E5E2DC] text-xs bg-[#F7F6F2]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Actor & Role</th>
                <th className="py-3.5 px-4">Event Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2DC] text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F6F2]/60">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#777873] tabular-nums whitespace-nowrap">
                    {log.createdAtIso.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono text-[#17191D]">{log.actorEmail}</div>
                    <div className="text-[10px] font-mono uppercase text-[#777873]">
                      {log.actorRole}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC] font-mono text-[10px] text-[#17191D]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#777873]">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="py-3 px-4 text-[#17191D]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTION 15: SECURITY & RBAC PERMISSIONS
  // ============================================================================
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E2DC] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777873] block mb-1">
            Role-Based Access Control & RLS Policy Matrix
          </span>
          <h2 className="font-display text-2xl font-semibold text-[#17191D]">
            Security & Permissions Architecture
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#777873]">Simulate Active Role:</span>
          <select
            aria-label="Simulate RBAC Role"
            value={session?.role || 'Super Admin'}
            onChange={(e) => switchSessionRole(e.target.value as AdminRole)}
            className="bg-[#17191D] text-white px-3 py-2 text-xs font-mono uppercase tracking-wider"
          >
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="bg-white border border-[#E5E2DC] overflow-x-auto">
        <div className="px-6 py-4 border-b border-[#E5E2DC] flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-[#17191D]">
            Enforced RBAC Capability Matrix
          </h3>
          <span className="text-xs font-mono text-[#777873]">
            Current Active Role: <strong className="text-[#17191D]">{session?.role}</strong>
          </span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2DC] bg-[#F7F6F2] text-[10px] font-mono uppercase tracking-wider text-[#777873]">
              <th className="py-3.5 px-4">Administrative Capability</th>
              {ALL_ROLES.map((role) => (
                <th key={role} className="py-3.5 px-4 text-center">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DC] text-xs">
            {PERMISSION_MATRIX_ROWS.map((row) => (
              <tr key={row.action} className="hover:bg-[#F7F6F2]/60">
                <td className="py-3 px-4 font-medium text-[#17191D]">{row.label}</td>
                {ALL_ROLES.map((role) => {
                  const allowed = canPerformAdminAction(role, row.action);
                  return (
                    <td key={role} className="py-3 px-4 text-center font-mono">
                      {allowed ? (
                        <span className="inline-block px-2 py-0.5 bg-[#2E6F40]/10 text-[#2E6F40] text-[10px]">
                          ALLOWED
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-[#F7F6F2] text-[#777873] text-[10px]">
                          RESTRICTED
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
