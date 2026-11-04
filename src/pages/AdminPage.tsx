import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  UserPlus,
  Building2,
  FolderKanban,
  Layers,
  FileSignature,
  CreditCard,
  Receipt,
  Users,
  FileCode2,
  Settings,
  Plug,
  Activity,
  ShieldCheck,
  Search,
  Bell,
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { BrandMonogram } from '../components/BrandMonogram';
import { useAdminStore } from '../context/AdminStoreContext';
import { AdminSectionId } from '../types/admin';
import { AdminLoginView } from '../components/admin/AdminLoginView';
import { AdminOverviewAndAnalytics } from '../components/admin/AdminOverviewAndAnalytics';
import { AdminCrmAndProjects } from '../components/admin/AdminCrmAndProjects';
import { AdminFinanceAndOperations } from '../components/admin/AdminFinanceAndOperations';
import { AdminGovernanceAndSystem } from '../components/admin/AdminGovernanceAndSystem';

interface AdminNavGroup {
  groupLabel: string;
  items: {
    id: AdminSectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    groupLabel: 'Command & Intelligence',
    items: [
      { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    groupLabel: 'Pipeline & Delivery',
    items: [
      { id: 'leads', label: 'Leads & Enquiries', icon: UserPlus },
      { id: 'clients', label: 'Clients', icon: Building2 },
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'services', label: 'Services', icon: Layers },
      { id: 'proposals', label: 'Proposals', icon: FileSignature },
    ],
  },
  {
    groupLabel: 'Commercial Finance',
    items: [
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'invoices', label: 'Invoices', icon: Receipt },
    ],
  },
  {
    groupLabel: 'Studio Governance',
    items: [
      { id: 'team', label: 'Team Management', icon: Users },
      { id: 'content', label: 'Content Management', icon: FileCode2 },
      { id: 'settings', label: 'Website Settings', icon: Settings },
      { id: 'integrations', label: 'Integrations', icon: Plug },
      { id: 'logs', label: 'Activity Logs', icon: Activity },
      { id: 'security', label: 'Security & Permissions', icon: ShieldCheck },
    ],
  },
];

interface AdminPageProps {
  onExitToSite: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onExitToSite }) => {
  const {
    session,
    logoutAdmin,
    leads,
    clients,
    projects,
    invoices,
    payments,
    activityLogs,
  } = useAdminStore();

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Compute global search results across leads, clients, projects, and invoices
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const results: { type: string; label: string; sub: string; section: AdminSectionId }[] = [];

    leads.forEach((l) => {
      if (
        l.fullName.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Lead',
          label: `${l.businessName} (${l.fullName})`,
          sub: `${l.status} • ${l.interestedService}`,
          section: 'leads',
        });
      }
    });

    clients.forEach((c) => {
      if (
        c.companyName.toLowerCase().includes(q) ||
        c.primaryContactName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Client',
          label: c.companyName,
          sub: `${c.tier} • ${c.country}`,
          section: 'clients',
        });
      }
    });

    projects.forEach((p) => {
      if (p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q)) {
        results.push({
          type: 'Project',
          label: p.title,
          sub: `${p.status} • $${p.budget.toLocaleString()}`,
          section: 'projects',
        });
      }
    });

    invoices.forEach((inv) => {
      if (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Invoice',
          label: `${inv.invoiceNumber} — ${inv.clientName}`,
          sub: `$${inv.totalAmount.toLocaleString()} • ${inv.status}`,
          section: 'invoices',
        });
      }
    });

    return results.slice(0, 6);
  }, [globalSearch, leads, clients, projects, invoices]);

  // Require authenticated Admin Session
  if (!session || !session.isAuthenticated) {
    return <AdminLoginView onExitToSite={onExitToSite} />;
  }

  const activeNavMeta = ADMIN_NAV_GROUPS.flatMap((g) => g.items).find(
    (i) => i.id === activeSection
  );

  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const pendingVerifyCount = payments.filter(
    (p) => p.verificationStatus === 'Pending Verification'
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#17191D] flex">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#17191D] text-[#F7F6F2] border-r border-[#262930] transition-all duration-200 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {/* Brand Top Header */}
        <div className="h-16 px-5 border-b border-[#262930] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <BrandMonogram className="w-7 h-7 text-[#F7F6F2] shrink-0" />
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-display text-sm font-bold tracking-[0.2em]">AVENIQ</div>
                <div className="text-[10px] font-mono text-[#91A99B] uppercase tracking-widest">
                  Command Centre
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="Toggle sidebar width"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="text-[#777873] hover:text-white p-1"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.groupLabel}>
              {!sidebarCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#777873]">
                  {group.groupLabel}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-[#91A99B] text-[#17191D] font-semibold'
                          : 'text-[#D6D4CE] hover:bg-[#22252B] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && item.id === 'leads' && newLeadsCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#17191D] text-[#F7F6F2] tabular-nums">
                          {newLeadsCount}
                        </span>
                      )}
                      {!sidebarCollapsed && item.id === 'payments' && pendingVerifyCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#B86B11] text-white tabular-nums">
                          {pendingVerifyCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Public Site Return & Logout */}
        <div className="p-3 border-t border-[#262930] space-y-1.5">
          <button
            type="button"
            onClick={onExitToSite}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#91A99B] hover:bg-[#22252B] transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Return to Public Site</span>}
          </button>
          <button
            type="button"
            onClick={logoutAdmin}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#E5E2DC] hover:bg-[#B42318]/20 hover:text-[#FCA5A5] transition-colors whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out Session</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#17191D]/70 flex">
          <div className="w-72 bg-[#17191D] text-[#F7F6F2] h-full flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#262930]">
                <div className="flex items-center gap-2.5">
                  <BrandMonogram className="w-6 h-6 text-[#F7F6F2]" />
                  <span className="font-display text-sm font-bold tracking-[0.2em]">
                    AVENIQ ADMIN
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#777873] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-5">
                {ADMIN_NAV_GROUPS.map((group) => (
                  <div key={group.groupLabel}>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#777873] mb-1.5">
                      {group.groupLabel}
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveSection(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs ${
                              activeSection === item.id
                                ? 'bg-[#91A99B] text-[#17191D] font-semibold'
                                : 'text-[#D6D4CE]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#262930] space-y-2">
              <button
                type="button"
                onClick={onExitToSite}
                className="w-full text-left px-3 py-2 text-xs text-[#91A99B]"
              >
                ← Return to Public Website
              </button>
              <button
                type="button"
                onClick={logoutAdmin}
                className="w-full text-left px-3 py-2 text-xs text-[#FCA5A5]"
              >
                Sign Out Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Header */}
        <header className="h-16 bg-white border-b border-[#E5E2DC] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 border border-[#E5E2DC] text-[#17191D]"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-[#777873] truncate">
              <span>/admin</span>
              <span>/</span>
              <span className="text-[#17191D] font-semibold truncate">
                {activeNavMeta?.label || 'Overview Dashboard'}
              </span>
            </div>
          </div>

          {/* Global Search & Session Controls */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 text-[#777873] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads, clients, invoices..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] text-xs focus:outline-none focus:border-[#17191D]"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#17191D] shadow-lg z-50 divide-y divide-[#E5E2DC]">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveSection(res.section);
                        setGlobalSearch('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F7F6F2] flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-xs font-medium text-[#17191D] truncate">
                          {res.label}
                        </div>
                        <div className="text-[10px] font-mono text-[#777873] truncate">
                          {res.sub}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC]">
                        {res.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Drawer Toggle */}
            <div className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => setShowNotifications((s) => !s)}
                className="p-2 border border-[#E5E2DC] bg-[#F7F6F2] hover:bg-[#E5E2DC]/50 text-[#17191D] relative"
              >
                <Bell className="w-4 h-4" />
                {(newLeadsCount > 0 || pendingVerifyCount > 0) && (
                  <span className="w-2 h-2 bg-[#17191D] rounded-full absolute top-1 right-1" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#17191D] shadow-xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      Studio Alerts
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-[#777873]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                    {newLeadsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('leads');
                          setShowNotifications(false);
                        }}
                        className="w-full text-left p-2.5 bg-[#F7F6F2] border border-[#E5E2DC] hover:border-[#17191D]"
                      >
                        <div className="font-semibold text-[#17191D]">
                          {newLeadsCount} New Enquiries Awaiting Triage
                        </div>
                        <div className="text-[11px] text-[#777873]">
                          Click to review CRM pipeline
                        </div>
                      </button>
                    )}
                    {pendingVerifyCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('payments');
                          setShowNotifications(false);
                        }}
                        className="w-full text-left p-2.5 bg-[#B86B11]/10 border border-[#B86B11]/30"
                      >
                        <div className="font-semibold text-[#B86B11]">
                          {pendingVerifyCount} Manual Payment Pending Verification
                        </div>
                        <div className="text-[11px] text-[#777873]">
                          Requires confirmation reference
                        </div>
                      </button>
                    )}
                    {activityLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="p-2 border-b border-[#E5E2DC] text-[11px]">
                        <div className="font-mono text-[#17191D]">{log.action}</div>
                        <div className="text-[#777873] truncate">{log.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Session Profile & Role Badge */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#E5E2DC]">
              <div className="text-right">
                <div className="text-xs font-semibold text-[#17191D] leading-tight">
                  {session.fullName}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#2E6F40]">
                  {session.role}
                </div>
              </div>
              <button
                type="button"
                onClick={logoutAdmin}
                title="Sign Out of Admin Command Centre"
                className="px-2.5 py-1.5 border border-[#E5E2DC] text-xs font-mono uppercase hover:bg-[#17191D] hover:text-white transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Active Section Workspace */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1440px] w-full mx-auto">
          {(activeSection === 'overview' || activeSection === 'analytics') && (
            <AdminOverviewAndAnalytics
              section={activeSection}
              onNavigateSection={(sec) => setActiveSection(sec)}
            />
          )}

          {(activeSection === 'leads' ||
            activeSection === 'clients' ||
            activeSection === 'projects') && <AdminCrmAndProjects section={activeSection} />}

          {(activeSection === 'services' ||
            activeSection === 'proposals' ||
            activeSection === 'payments' ||
            activeSection === 'invoices') && (
            <AdminFinanceAndOperations section={activeSection} />
          )}

          {(activeSection === 'team' ||
            activeSection === 'content' ||
            activeSection === 'settings' ||
            activeSection === 'integrations' ||
            activeSection === 'logs' ||
            activeSection === 'security') && (
            <AdminGovernanceAndSystem section={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
};
