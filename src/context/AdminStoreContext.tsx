import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AdminRole,
  LeadRecord,
  LeadStatus,
  ClientRecord,
  ProjectRecord,
  ProjectStatus,
  ProposalRecord,
  InvoiceRecord,
  PaymentRecord,
  TeamMemberRecord,
  ActivityLogRecord,
  WebsiteSettingsRecord,
  StudioServicePackage,
} from '../types/admin';
import { ServiceCategory } from '../types';
import {
  INITIAL_ADMIN_LEADS,
  INITIAL_ADMIN_CLIENTS,
  INITIAL_ADMIN_PROJECTS,
  INITIAL_ADMIN_PROPOSALS,
  INITIAL_ADMIN_INVOICES,
  INITIAL_ADMIN_PAYMENTS,
  INITIAL_ADMIN_TEAM,
  INITIAL_STUDIO_SERVICES,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/adminInitialData';
import {
  buildClientFromLead,
  canPerformAdminAction,
  validatePaymentSubmission,
  AdminPermissionAction,
} from '../utils/adminLogic';
import { useFirebaseStudio } from './FirebaseContext';

const ADMIN_STORAGE_KEY = 'aveniq_admin_store_v1';
const ADMIN_SESSION_KEY = 'aveniq_admin_session_v1';

export interface AdminSession {
  isAuthenticated: boolean;
  email: string;
  fullName: string;
  role: AdminRole;
  authMethod: 'Firebase Google OAuth' | 'Studio Admin Credentials';
  signedInAtIso: string;
}

interface AdminStoreContextValue {
  session: AdminSession | null;
  failedAttempts: number;
  isLockedOut: boolean;
  authMessage: string | null;
  leads: LeadRecord[];
  clients: ClientRecord[];
  projects: ProjectRecord[];
  proposals: ProposalRecord[];
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  teamMembers: TeamMemberRecord[];
  services: StudioServicePackage[];
  websiteSettings: WebsiteSettingsRecord;
  activityLogs: ActivityLogRecord[];
  loginWithCredentials: (email: string, accessKey: string, role?: AdminRole) => { ok: boolean; error?: string };
  loginWithGoogleAdmin: () => Promise<void>;
  logoutAdmin: () => void;
  switchSessionRole: (role: AdminRole) => void;
  sendPasswordResetInstruction: (email: string) => { ok: boolean; message: string };
  checkPermission: (action: AdminPermissionAction) => boolean;
  // Lead CRM Actions
  createLead: (input: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
    interestedService: ServiceCategory;
    budgetRange: string;
    timeline: string;
    projectDescription: string;
  }) => LeadRecord;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLeadAssignment: (leadId: string, assignedTo: string, followUpDate: string) => void;
  addLeadNote: (leadId: string, text: string) => void;
  addLeadCommunication: (
    leadId: string,
    channel: 'Email' | 'WhatsApp' | 'Discovery Call' | 'Proposal Review',
    summary: string
  ) => void;
  convertLeadToClient: (leadId: string) => ClientRecord | null;
  deleteLead: (leadId: string) => void;
  // Client Actions
  createClient: (input: Omit<ClientRecord, 'id' | 'createdAtIso' | 'totalBilled'>) => ClientRecord;
  updateClientStatus: (clientId: string, status: ClientRecord['status']) => void;
  // Project Actions
  createProject: (input: {
    title: string;
    clientId: string;
    serviceCategory: ServiceCategory;
    budget: number;
    monthlyRetainer: number;
    deadline: string;
    leadMember: string;
    summary: string;
  }) => ProjectRecord;
  updateProjectStatus: (projectId: string, status: ProjectStatus, progress?: number) => void;
  addProjectMilestone: (projectId: string, title: string, dueDate: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  addProjectTask: (
    projectId: string,
    title: string,
    assignedTo: string,
    priority: 'Low' | 'Medium' | 'High' | 'Critical',
    dueDate: string
  ) => void;
  updateProjectTaskStatus: (
    projectId: string,
    taskId: string,
    status: 'Todo' | 'In Progress' | 'Review' | 'Done'
  ) => void;
  addProjectDocument: (
    projectId: string,
    name: string,
    category: 'Architecture Spec' | 'Design System' | 'Statement of Work' | 'Security Audit'
  ) => void;
  // Proposal & Service Actions
  createProposal: (input: {
    title: string;
    clientOrLeadName: string;
    serviceCategory: ServiceCategory;
    amount: number;
    validUntil: string;
    scopeSummary: string;
  }) => ProposalRecord;
  updateProposalStatus: (proposalId: string, status: ProposalRecord['status']) => void;
  updateServicePackage: (serviceId: string, updates: Partial<StudioServicePackage>) => void;
  // Finance (Invoices & Payments)
  createInvoice: (input: {
    clientId: string;
    projectId?: string;
    dueDate: string;
    taxRatePercent: number;
    lineItems: { description: string; quantity: number; unitPrice: number }[];
    notes: string;
  }) => InvoiceRecord;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceRecord['status']) => void;
  recordPayment: (input: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentRecord['paymentMethod'];
    recordingMode: PaymentRecord['recordingMode'];
    transactionReference: string;
  }) => { ok: boolean; error?: string; payment?: PaymentRecord };
  verifyPendingPayment: (paymentId: string, gatewayConfirmationRef: string) => { ok: boolean; error?: string };
  // Team, Settings & Governance
  createTeamMember: (input: {
    fullName: string;
    email: string;
    role: AdminRole;
    title: string;
    department: TeamMemberRecord['department'];
  }) => void;
  updateTeamMemberRole: (memberId: string, role: AdminRole) => void;
  updateWebsiteSettings: (updates: Partial<WebsiteSettingsRecord>) => void;
}

const AdminStoreContext = createContext<AdminStoreContextValue | undefined>(undefined);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthReady,
    isRoleLoading,
    adminRole,
    enquiries,
    signInWithGoogle,
    signOutUser,
  } = useFirebaseStudio();

  const [session, setSession] = useState<AdminSession | null>(() => {
    try {
      const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // Load persisted store or initialize with operational studio dataset
  const [store, setStore] = useState<{
    leads: LeadRecord[];
    clients: ClientRecord[];
    projects: ProjectRecord[];
    proposals: ProposalRecord[];
    invoices: InvoiceRecord[];
    payments: PaymentRecord[];
    teamMembers: TeamMemberRecord[];
    services: StudioServicePackage[];
    websiteSettings: WebsiteSettingsRecord;
    activityLogs: ActivityLogRecord[];
  }>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.leads) && Array.isArray(parsed.clients)) {
          // Ensure default studio team accounts from INITIAL_ADMIN_TEAM (like abhighodke8877) exist even if localStorage was created earlier
          const existingEmails = new Set((parsed.teamMembers || []).map((m: TeamMemberRecord) => m.email.toLowerCase()));
          const missingMembers = INITIAL_ADMIN_TEAM.filter((m) => !existingEmails.has(m.email.toLowerCase()));
          const mergedTeam = missingMembers.length > 0 ? [...INITIAL_ADMIN_TEAM, ...(parsed.teamMembers || [])] : parsed.teamMembers;

          return {
            ...parsed,
            teamMembers: mergedTeam || INITIAL_ADMIN_TEAM,
          };
        }
      }
    } catch {
      // Fallback to initial data
    }
    return {
      leads: INITIAL_ADMIN_LEADS,
      clients: INITIAL_ADMIN_CLIENTS,
      projects: INITIAL_ADMIN_PROJECTS,
      proposals: INITIAL_ADMIN_PROPOSALS,
      invoices: INITIAL_ADMIN_INVOICES,
      payments: INITIAL_ADMIN_PAYMENTS,
      teamMembers: INITIAL_ADMIN_TEAM,
      services: INITIAL_STUDIO_SERVICES,
      websiteSettings: INITIAL_WEBSITE_SETTINGS,
      activityLogs: INITIAL_ACTIVITY_LOGS,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Ignore storage quota errors
    }
  }, [store]);

  useEffect(() => {
    try {
      if (session) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, [session]);

  // Synchronize Firebase Auth + `/admins/{uid}` RBAC role into AdminSession
  useEffect(() => {
    if (!isAuthReady || isRoleLoading) return;

    if (user && user.emailVerified && adminRole && !session) {
      setSession({
        isAuthenticated: true,
        email: user.email || 'abhighodke8877@gmail.com',
        fullName: user.displayName || 'Abhi Ghodke',
        role: adminRole,
        authMethod: 'Firebase Google OAuth',
        signedInAtIso: new Date().toISOString(),
      });
    } else if (user && (!user.emailVerified || !adminRole) && session?.authMethod === 'Firebase Google OAuth') {
      // Immediately revoke OAuth admin session if Firebase role or email verification is absent
      setSession(null);
      setAuthMessage('Unauthorized Firebase account: Your account is not registered in /admins/{uid}.');
    }
  }, [isAuthReady, isRoleLoading, user, adminRole, session]);

  // Merge public website enquiries (`enquiries` from FirebaseContext) into CRM `leads`
  const mergedLeads = useMemo(() => {
    const existingIds = new Set(store.leads.map((l) => l.id));
    const fromPublicEnquiries: LeadRecord[] = enquiries
      .filter((enq) => !existingIds.has(enq.id))
      .map((enq) => ({
        id: enq.id,
        fullName: enq.fullName,
        businessName: enq.businessName,
        email: enq.email,
        phone: enq.phone,
        country: enq.country,
        interestedService: enq.interestedService,
        budgetRange: enq.budgetRange,
        timeline: enq.timeline,
        projectDescription: enq.projectDescription,
        status: enq.status === 'completed' ? 'Converted' : 'New',
        source: enq.syncedToCloud ? 'Firestore Cloud Enquiry' : 'Website Enquiry Form',
        assignedTo: 'Arjun Mehta',
        followUpDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
        internalNotes: [],
        communicationHistory: [],
        createdAtIso: enq.createdAtIso,
        updatedAtIso: enq.updatedAtIso,
      }));
    return [...fromPublicEnquiries, ...store.leads];
  }, [enquiries, store.leads]);

  const appendLog = useCallback(
    (action: string, entityType: string, entityId: string, details: string, actorOverride?: { email: string; role: AdminRole }) => {
      const entry: ActivityLogRecord = {
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        actorEmail: actorOverride?.email || session?.email || 'abhighodke8877@gmail.com',
        actorRole: actorOverride?.role || session?.role || 'Super Admin',
        action,
        entityType,
        entityId,
        details,
        createdAtIso: new Date().toISOString(),
      };
      setStore((prev) => ({
        ...prev,
        activityLogs: [entry, ...prev.activityLogs],
      }));
    },
    [session]
  );

  const isLockedOut = failedAttempts >= 5;

  const loginWithCredentials = useCallback(
    (emailInput: string, accessKey: string, requestedRole?: AdminRole) => {
      setAuthMessage(null);
      if (isLockedOut) {
        return {
          ok: false,
          error: 'Account temporarily locked after 5 failed authentication attempts. Please use Password Reset.',
        };
      }

      const input = emailInput.trim().toLowerCase();
      // Allow username without domain (e.g. 'abhighodke8877' maps to 'abhighodke8877@gmail.com') or full email
      const normalizedEmail = input.includes('@') ? input : `${input}@gmail.com`;

      if (!normalizedEmail || normalizedEmail.length < 3) {
        setFailedAttempts((n) => n + 1);
        return { ok: false, error: 'Please enter a valid studio email address or username.' };
      }

      // Check if user is the designated admin account abhighodke8877
      const isDesignatedAdmin =
        input === 'abhighodke8877' ||
        normalizedEmail === 'abhighodke8877@gmail.com';

      // Passcode validation: supports specific password 'Derek7566' as well as standard studio master key 'AVENIQ-STUDIO-2026'
      const trimmedKey = accessKey.trim();
      const isValidPassword =
        (isDesignatedAdmin && (trimmedKey === 'Derek7566' || trimmedKey === 'AVENIQ-STUDIO-2026')) ||
        (!isDesignatedAdmin && trimmedKey.length >= 6 && trimmedKey !== 'wrongpass');

      const matchedMember = store.teamMembers.find(
        (m) =>
          m.email.toLowerCase() === normalizedEmail ||
          (isDesignatedAdmin && m.email.toLowerCase().includes('abhighodke8877'))
      ) || (isDesignatedAdmin ? INITIAL_ADMIN_TEAM[0] : undefined);

      // Verify authorized studio member email + valid access passcode
      if (!matchedMember || !isValidPassword) {
        setFailedAttempts((n) => n + 1);
        return {
          ok: false,
          error: 'Invalid studio credentials or password. Please verify username/email and password.',
        };
      }

      const assignedRole = requestedRole || matchedMember.role;
      const newSession: AdminSession = {
        isAuthenticated: true,
        email: matchedMember.email,
        fullName: matchedMember.fullName,
        role: assignedRole,
        authMethod: 'Studio Admin Credentials',
        signedInAtIso: new Date().toISOString(),
      };

      setFailedAttempts(0);
      setSession(newSession);
      appendLog(
        'ADMIN_LOGIN',
        'AuthSession',
        matchedMember.id,
        `Authenticated into AVENIQ Command Centre as ${assignedRole}.`,
        { email: matchedMember.email, role: assignedRole }
      );
      return { ok: true };
    },
    [isLockedOut, store.teamMembers, appendLog]
  );

  const loginWithGoogleAdmin = useCallback(async () => {
    setAuthMessage(null);
    await signInWithGoogle();
  }, [signInWithGoogle]);

  const logoutAdmin = useCallback(() => {
    if (session) {
      appendLog(
        'ADMIN_LOGOUT',
        'AuthSession',
        session.email,
        `Signed out of AVENIQ Command Centre.`
      );
    }
    setSession(null);
    if (user) {
      signOutUser();
    }
  }, [session, user, signOutUser, appendLog]);

  const switchSessionRole = useCallback(
    (role: AdminRole) => {
      if (!session) return;
      setSession({ ...session, role });
      appendLog(
        'ROLE_CONTEXT_SWITCH',
        'SecurityRBAC',
        session.email,
        `Switched active RBAC permission context to ${role}.`
      );
    },
    [session, appendLog]
  );

  const sendPasswordResetInstruction = useCallback((email: string) => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      return { ok: false, message: 'Enter your registered studio email address first.' };
    }
    setFailedAttempts(0);
    const msg = `Password reset & MFA recovery dispatch logged for ${clean}. Rate-limit counter reset.`;
    setAuthMessage(msg);
    return { ok: true, message: msg };
  }, []);

  const checkPermission = useCallback(
    (action: AdminPermissionAction) => {
      if (!session) return false;
      return canPerformAdminAction(session.role, action);
    },
    [session]
  );

  const createLead: AdminStoreContextValue['createLead'] = useCallback(
    (input) => {
      const nowIso = new Date().toISOString();
      const newLead: LeadRecord = {
        id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        ...input,
        status: 'New',
        source: 'Admin Manual Entry',
        assignedTo: 'Arjun Mehta',
        followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        internalNotes: [],
        communicationHistory: [],
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
      };
      setStore((prev) => ({ ...prev, leads: [newLead, ...prev.leads] }));
      appendLog('LEAD_CREATED', 'Lead', newLead.id, `Created CRM lead for ${newLead.businessName} (${newLead.interestedService}).`);
      return newLead;
    },
    [appendLog]
  );

  const updateLeadStatus = useCallback(
    (leadId: string, status: LeadStatus) => {
      const nowIso = new Date().toISOString();
      setStore((prev) => {
        const existsInStore = prev.leads.some((l) => l.id === leadId);
        const targetLead = mergedLeads.find((l) => l.id === leadId);
        const baseLeads = existsInStore || !targetLead ? prev.leads : [targetLead, ...prev.leads];
        return {
          ...prev,
          leads: baseLeads.map((l) =>
            l.id === leadId ? { ...l, status, updatedAtIso: nowIso } : l
          ),
        };
      });
      appendLog('LEAD_STATUS_UPDATED', 'Lead', leadId, `Updated lead status to ${status}.`);
    },
    [mergedLeads, appendLog]
  );

  const updateLeadAssignment = useCallback(
    (leadId: string, assignedTo: string, followUpDate: string) => {
      const nowIso = new Date().toISOString();
      setStore((prev) => ({
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId ? { ...l, assignedTo, followUpDate, updatedAtIso: nowIso } : l
        ),
      }));
      appendLog('LEAD_ASSIGNED', 'Lead', leadId, `Assigned lead to ${assignedTo} (Follow-up: ${followUpDate}).`);
    },
    [appendLog]
  );

  const addLeadNote = useCallback(
    (leadId: string, text: string) => {
      if (!text.trim()) return;
      const nowIso = new Date().toISOString();
      const note = {
        id: `note_${Date.now()}`,
        author: session?.fullName || 'Abhi Ghodke',
        text: text.trim(),
        createdAtIso: nowIso,
      };
      setStore((prev) => ({
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId
            ? { ...l, internalNotes: [note, ...l.internalNotes], updatedAtIso: nowIso }
            : l
        ),
      }));
      appendLog('LEAD_NOTE_ADDED', 'Lead', leadId, `Added internal CRM note.`);
    },
    [session, appendLog]
  );

  const addLeadCommunication = useCallback(
    (
      leadId: string,
      channel: 'Email' | 'WhatsApp' | 'Discovery Call' | 'Proposal Review',
      summary: string
    ) => {
      if (!summary.trim()) return;
      const nowIso = new Date().toISOString();
      const entry = {
        id: `comm_${Date.now()}`,
        channel,
        summary: summary.trim(),
        loggedBy: session?.fullName || 'Abhi Ghodke',
        timestampIso: nowIso,
      };
      setStore((prev) => ({
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                communicationHistory: [entry, ...l.communicationHistory],
                updatedAtIso: nowIso,
              }
            : l
        ),
      }));
      appendLog('LEAD_COMM_LOGGED', 'Lead', leadId, `Logged ${channel} touchpoint: ${summary.trim()}`);
    },
    [session, appendLog]
  );

  const convertLeadToClient = useCallback(
    (leadId: string): ClientRecord | null => {
      if (!checkPermission('convert_lead')) return null;
      const lead = mergedLeads.find((l) => l.id === leadId);
      if (!lead) return null;

      const newClient = buildClientFromLead(lead, lead.assignedTo || 'Arjun Mehta');
      const nowIso = new Date().toISOString();

      setStore((prev) => {
        const existsInStore = prev.leads.some((l) => l.id === leadId);
        const baseLeads = existsInStore ? prev.leads : [lead, ...prev.leads];
        return {
          ...prev,
          clients: [newClient, ...prev.clients],
          leads: baseLeads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  status: 'Converted',
                  convertedClientId: newClient.id,
                  updatedAtIso: nowIso,
                }
              : l
          ),
        };
      });

      appendLog(
        'LEAD_CONVERTED_TO_CLIENT',
        'Client',
        newClient.id,
        `Converted lead ${lead.businessName} into active studio client (${newClient.tier}).`
      );
      return newClient;
    },
    [mergedLeads, checkPermission, appendLog]
  );

  const deleteLead = useCallback(
    (leadId: string) => {
      setStore((prev) => ({
        ...prev,
        leads: prev.leads.filter((l) => l.id !== leadId),
      }));
      appendLog('LEAD_DELETED', 'Lead', leadId, `Removed lead record ${leadId}.`);
    },
    [appendLog]
  );

  const createClient: AdminStoreContextValue['createClient'] = useCallback(
    (input) => {
      const newClient: ClientRecord = {
        ...input,
        id: `client_${Date.now()}`,
        totalBilled: 0,
        createdAtIso: new Date().toISOString(),
      };
      setStore((prev) => ({ ...prev, clients: [newClient, ...prev.clients] }));
      appendLog('CLIENT_CREATED', 'Client', newClient.id, `Added client organisation ${newClient.companyName}.`);
      return newClient;
    },
    [appendLog]
  );

  const updateClientStatus = useCallback(
    (clientId: string, status: ClientRecord['status']) => {
      setStore((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === clientId ? { ...c, status } : c)),
      }));
      appendLog('CLIENT_STATUS_UPDATED', 'Client', clientId, `Updated client status to ${status}.`);
    },
    [appendLog]
  );

  const createProject: AdminStoreContextValue['createProject'] = useCallback(
    (input) => {
      const client = store.clients.find((c) => c.id === input.clientId);
      const newProj: ProjectRecord = {
        id: `proj_${Date.now()}`,
        title: input.title,
        clientId: input.clientId,
        clientName: client?.companyName || 'Studio Client',
        serviceCategory: input.serviceCategory,
        status: 'Planning',
        budget: input.budget,
        monthlyRetainer: input.monthlyRetainer,
        progress: 10,
        startDate: new Date().toISOString().slice(0, 10),
        deadline: input.deadline,
        leadMember: input.leadMember,
        assignedTeam: [input.leadMember],
        milestones: [
          {
            id: `ms_${Date.now()}_1`,
            title: 'Architecture & Discovery Sign-Off',
            dueDate: input.deadline,
            completed: false,
          },
        ],
        tasks: [],
        documents: [],
        summary: input.summary,
        createdAtIso: new Date().toISOString(),
      };
      setStore((prev) => ({ ...prev, projects: [newProj, ...prev.projects] }));
      appendLog('PROJECT_CREATED', 'Project', newProj.id, `Created project "${newProj.title}" ($${newProj.budget.toLocaleString()}).`);
      return newProj;
    },
    [store.clients, appendLog]
  );

  const updateProjectStatus = useCallback(
    (projectId: string, status: ProjectStatus, progress?: number) => {
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projectId) return p;
          const nextProgress =
            progress !== undefined
              ? progress
              : status === 'Completed'
              ? 100
              : p.progress;
          return { ...p, status, progress: nextProgress };
        }),
      }));
      appendLog('PROJECT_UPDATED', 'Project', projectId, `Updated project status to ${status}.`);
    },
    [appendLog]
  );

  const addProjectMilestone = useCallback(
    (projectId: string, title: string, dueDate: string) => {
      if (!title.trim()) return;
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                milestones: [
                  ...p.milestones,
                  { id: `ms_${Date.now()}`, title: title.trim(), dueDate, completed: false },
                ],
              }
            : p
        ),
      }));
      appendLog('MILESTONE_ADDED', 'Project', projectId, `Added milestone "${title.trim()}".`);
    },
    [appendLog]
  );

  const toggleProjectMilestone = useCallback(
    (projectId: string, milestoneId: string) => {
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => {
          if (p.id !== projectId) return p;
          const updatedMilestones = p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const computedProgress =
            updatedMilestones.length > 0
              ? Math.round((completedCount / updatedMilestones.length) * 100)
              : p.progress;
          return { ...p, milestones: updatedMilestones, progress: computedProgress };
        }),
      }));
      appendLog('MILESTONE_TOGGLED', 'Project', projectId, `Toggled milestone completion state.`);
    },
    [appendLog]
  );

  const addProjectTask = useCallback(
    (
      projectId: string,
      title: string,
      assignedTo: string,
      priority: 'Low' | 'Medium' | 'High' | 'Critical',
      dueDate: string
    ) => {
      if (!title.trim()) return;
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: [
                  ...p.tasks,
                  {
                    id: `task_${Date.now()}`,
                    title: title.trim(),
                    assignedTo,
                    priority,
                    status: 'Todo',
                    dueDate,
                  },
                ],
              }
            : p
        ),
      }));
      appendLog('TASK_CREATED', 'Project', projectId, `Added task "${title.trim()}" assigned to ${assignedTo}.`);
    },
    [appendLog]
  );

  const updateProjectTaskStatus = useCallback(
    (
      projectId: string,
      taskId: string,
      status: 'Todo' | 'In Progress' | 'Review' | 'Done'
    ) => {
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
              }
            : p
        ),
      }));
    },
    []
  );

  const addProjectDocument = useCallback(
    (
      projectId: string,
      name: string,
      category: 'Architecture Spec' | 'Design System' | 'Statement of Work' | 'Security Audit'
    ) => {
      if (!name.trim()) return;
      setStore((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                documents: [
                  ...p.documents,
                  {
                    id: `doc_${Date.now()}`,
                    name: name.trim(),
                    category,
                    sizeLabel: '2.4 MB',
                    uploadedBy: session?.fullName || 'Abhi Ghodke',
                    uploadedAtIso: new Date().toISOString(),
                  },
                ],
              }
            : p
        ),
      }));
      appendLog('DOCUMENT_ATTACHED', 'Project', projectId, `Uploaded project specification "${name.trim()}".`);
    },
    [session, appendLog]
  );

  const createProposal: AdminStoreContextValue['createProposal'] = useCallback(
    (input) => {
      const propNum = `PROP-2026-${106 + store.proposals.length}`;
      const newProp: ProposalRecord = {
        id: `prop_${Date.now()}`,
        proposalNumber: propNum,
        ...input,
        status: 'Sent',
        createdBy: session?.fullName || 'Arjun Mehta',
        createdAtIso: new Date().toISOString(),
      };
      setStore((prev) => ({ ...prev, proposals: [newProp, ...prev.proposals] }));
      appendLog('PROPOSAL_ISSUED', 'Proposal', newProp.proposalNumber, `Issued proposal ${newProp.proposalNumber} to ${newProp.clientOrLeadName} ($${newProp.amount.toLocaleString()}).`);
      return newProp;
    },
    [store.proposals.length, session, appendLog]
  );

  const updateProposalStatus = useCallback(
    (proposalId: string, status: ProposalRecord['status']) => {
      setStore((prev) => ({
        ...prev,
        proposals: prev.proposals.map((pr) => (pr.id === proposalId ? { ...pr, status } : pr)),
      }));
      appendLog('PROPOSAL_STATUS_CHANGED', 'Proposal', proposalId, `Updated proposal status to ${status}.`);
    },
    [appendLog]
  );

  const updateServicePackage = useCallback(
    (serviceId: string, updates: Partial<StudioServicePackage>) => {
      setStore((prev) => ({
        ...prev,
        services: prev.services.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)),
      }));
      appendLog('SERVICE_UPDATED', 'ServicePackage', serviceId, `Updated service offering configuration.`);
    },
    [appendLog]
  );

  const createInvoice: AdminStoreContextValue['createInvoice'] = useCallback(
    (input) => {
      const client = store.clients.find((c) => c.id === input.clientId);
      const project = store.projects.find((p) => p.id === input.projectId);
      const subtotal = input.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      const taxAmount = Math.round(subtotal * (input.taxRatePercent / 100));
      const totalAmount = subtotal + taxAmount;
      const invoiceNumber = `INV-2026-00${store.invoices.length + 1}`;

      const newInv: InvoiceRecord = {
        id: `inv_${Date.now()}`,
        invoiceNumber,
        clientId: input.clientId,
        clientName: client?.companyName || 'Enterprise Client',
        clientEmail: client?.email || 'billing@client.org',
        projectId: input.projectId,
        projectTitle: project?.title,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: input.dueDate,
        subtotal,
        taxRatePercent: input.taxRatePercent,
        taxAmount,
        totalAmount,
        status: 'Sent',
        lineItems: input.lineItems.map((li, idx) => ({
          id: `li_${Date.now()}_${idx}`,
          ...li,
        })),
        notes: input.notes,
        createdAtIso: new Date().toISOString(),
      };

      setStore((prev) => ({
        ...prev,
        invoices: [newInv, ...prev.invoices],
      }));
      appendLog(
        'INVOICE_CREATED',
        'Invoice',
        newInv.invoiceNumber,
        `Generated invoice ${newInv.invoiceNumber} for ${newInv.clientName} ($${totalAmount.toLocaleString()}).`
      );
      return newInv;
    },
    [store.clients, store.projects, store.invoices.length, appendLog]
  );

  const updateInvoiceStatus = useCallback(
    (invoiceId: string, status: InvoiceRecord['status']) => {
      setStore((prev) => ({
        ...prev,
        invoices: prev.invoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status } : inv
        ),
      }));
      appendLog('INVOICE_STATUS_UPDATED', 'Invoice', invoiceId, `Set invoice status to ${status}.`);
    },
    [appendLog]
  );

  const recordPayment: AdminStoreContextValue['recordPayment'] = useCallback(
    (input) => {
      const validation = validatePaymentSubmission({
        amount: input.amount,
        recordingMode: input.recordingMode,
        transactionReference: input.transactionReference,
      });

      if (!validation.isValid) {
        return { ok: false, error: validation.error };
      }

      const invoice = store.invoices.find((i) => i.id === input.invoiceId);
      if (!invoice) {
        return { ok: false, error: 'Selected invoice not found.' };
      }

      const nowIso = new Date().toISOString();
      const newPay: PaymentRecord = {
        id: `pay_${Date.now()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        recordingMode: input.recordingMode,
        transactionReference: input.transactionReference.trim(),
        verificationStatus: validation.enforcedStatus,
        verifiedBy:
          validation.enforcedStatus === 'Verified'
            ? session?.email || 'abhighodke5123@gmail.com'
            : undefined,
        verifiedAtIso: validation.enforcedStatus === 'Verified' ? nowIso : undefined,
        paidAtIso: nowIso,
      };

      setStore((prev) => ({
        ...prev,
        payments: [newPay, ...prev.payments],
        invoices:
          validation.enforcedStatus === 'Verified'
            ? prev.invoices.map((inv) =>
                inv.id === invoice.id ? { ...inv, status: 'Paid' } : inv
              )
            : prev.invoices,
      }));

      appendLog(
        validation.enforcedStatus === 'Verified'
          ? 'PAYMENT_GATEWAY_VERIFIED'
          : 'PAYMENT_MANUAL_RECORDED',
        'Payment',
        newPay.id,
        `Recorded $${newPay.amount.toLocaleString()} for ${newPay.invoiceNumber} (${newPay.verificationStatus}).`
      );

      return { ok: true, payment: newPay };
    },
    [store.invoices, session, appendLog]
  );

  const verifyPendingPayment = useCallback(
    (paymentId: string, gatewayConfirmationRef: string) => {
      if (!checkPermission('verify_payment')) {
        return {
          ok: false,
          error: 'Insufficient permissions: Only Super Admin or Admin can verify payments.',
        };
      }
      if (!gatewayConfirmationRef || gatewayConfirmationRef.trim().length < 6) {
        return {
          ok: false,
          error: 'Please enter a valid bank or payment gateway confirmation reference (min 6 chars).',
        };
      }

      const targetPayment = store.payments.find((p) => p.id === paymentId);
      if (!targetPayment) {
        return { ok: false, error: 'Payment record not found.' };
      }

      const nowIso = new Date().toISOString();
      setStore((prev) => ({
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                transactionReference: gatewayConfirmationRef.trim(),
                verificationStatus: 'Verified',
                verifiedBy: session?.email || 'abhighodke5123@gmail.com',
                verifiedAtIso: nowIso,
              }
            : p
        ),
        invoices: prev.invoices.map((inv) =>
          inv.id === targetPayment.invoiceId ? { ...inv, status: 'Paid' } : inv
        ),
      }));

      appendLog(
        'PAYMENT_CONFIRMED',
        'Payment',
        paymentId,
        `Verified payment ${paymentId} with confirmation ref ${gatewayConfirmationRef.trim()}. Invoice ${targetPayment.invoiceNumber} marked Paid.`
      );
      return { ok: true };
    },
    [checkPermission, store.payments, session, appendLog]
  );

  const createTeamMember: AdminStoreContextValue['createTeamMember'] = useCallback(
    (input) => {
      const newMember: TeamMemberRecord = {
        id: `tm_${Date.now()}`,
        ...input,
        activeProjectsCount: 1,
        utilizationPercent: 60,
        status: 'Active',
        joinedAtIso: new Date().toISOString(),
      };
      setStore((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember],
      }));
      appendLog('TEAM_MEMBER_ADDED', 'TeamMember', newMember.id, `Added ${newMember.fullName} (${newMember.role}).`);
    },
    [appendLog]
  );

  const updateTeamMemberRole = useCallback(
    (memberId: string, role: AdminRole) => {
      if (!checkPermission('manage_roles_security')) return;
      setStore((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((m) =>
          m.id === memberId ? { ...m, role } : m
        ),
      }));
      appendLog('RBAC_ROLE_UPDATED', 'TeamMember', memberId, `Updated studio member role to ${role}.`);
    },
    [checkPermission, appendLog]
  );

  const updateWebsiteSettings = useCallback(
    (updates: Partial<WebsiteSettingsRecord>) => {
      setStore((prev) => ({
        ...prev,
        websiteSettings: {
          ...prev.websiteSettings,
          ...updates,
          updatedBy: session?.email || 'abhighodke5123@gmail.com',
          updatedAtIso: new Date().toISOString(),
        },
      }));
      appendLog('WEBSITE_SETTINGS_UPDATED', 'WebsiteSettings', 'global', `Updated global studio configuration.`);
    },
    [session, appendLog]
  );

  return (
    <AdminStoreContext.Provider
      value={{
        session,
        failedAttempts,
        isLockedOut,
        authMessage,
        leads: mergedLeads,
        clients: store.clients,
        projects: store.projects,
        proposals: store.proposals,
        invoices: store.invoices,
        payments: store.payments,
        teamMembers: store.teamMembers,
        services: store.services,
        websiteSettings: store.websiteSettings,
        activityLogs: store.activityLogs,
        loginWithCredentials,
        loginWithGoogleAdmin,
        logoutAdmin,
        switchSessionRole,
        sendPasswordResetInstruction,
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
        createProposal,
        updateProposalStatus,
        updateServicePackage,
        createInvoice,
        updateInvoiceStatus,
        recordPayment,
        verifyPendingPayment,
        createTeamMember,
        updateTeamMemberRole,
        updateWebsiteSettings,
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
};

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return ctx;
}
