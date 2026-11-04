import React, { useState } from 'react';
import {
  X,
  Cloud,
  ShieldCheck,
  LogOut,
  LogIn,
  Trash2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { useFirebaseStudio } from '../context/FirebaseContext';
import { EnquiryStatus, OpdStatus } from '../types';

interface StudioPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartNewEnquiry: () => void;
}

const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, { label: string; badgeClass: string }> = {
  submitted: {
    label: 'Submitted',
    badgeClass: 'bg-[#91A99B]/20 text-[#2E4639] border-[#91A99B]',
  },
  in_review: {
    label: 'In Principal Review',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  scheduled: {
    label: 'Discovery Scheduled',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  completed: {
    label: 'Completed (Locked)',
    badgeClass: 'bg-[#17191D] text-white border-[#17191D]',
  },
  archived: {
    label: 'Archived (Locked)',
    badgeClass: 'bg-[#E5E2DC] text-[#777873] border-[#E5E2DC]',
  },
};

const OPD_STATUS_LABELS: Record<OpdStatus, { label: string; badgeClass: string }> = {
  requested: {
    label: 'Requested',
    badgeClass: 'bg-[#91A99B]/20 text-[#2E4639] border-[#91A99B]',
  },
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-[#17191D] text-white border-[#17191D]',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
};

export const StudioPortalModal: React.FC<StudioPortalModalProps> = ({
  isOpen,
  onClose,
  onStartNewEnquiry,
}) => {
  const {
    user,
    isAdmin,
    authError,
    enquiries,
    opdAppointments,
    unsyncedCount,
    signInWithGoogle,
    signOutUser,
    updateEnquiryStatus,
    deleteEnquiryRecord,
    updateOpdAppointmentStatus,
    deleteOpdAppointmentRecord,
    syncLocalRecordsToCloud,
  } = useFirebaseStudio();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'opd'>('enquiries');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    try {
      await syncLocalRecordsToCloud();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#17191D]/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-portal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#F7F6F2] border border-[#E5E2DC] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-[#17191D] text-[#F7F6F2] px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#91A99B]/20 border border-[#91A99B]/40 flex items-center justify-center text-[#91A99B]">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#91A99B] font-bold">
                  FIREBASE CLOUD PORTAL
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-mono bg-[#91A99B] text-[#17191D] px-2 py-0.5 font-bold uppercase">
                    STUDIO ADMIN
                  </span>
                )}
              </div>
              <h2 id="studio-portal-title" className="font-heading text-lg sm:text-xl font-extrabold text-white">
                Client Enquiries &amp; Clinical Triage Desk
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white border border-white/15 hover:border-white/40 transition-colors"
            aria-label="Close Studio Portal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Authentication & Cloud Sync Bar */}
        <div className="bg-white px-6 py-4 border-b border-[#E5E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#91A99B]/25 border border-[#91A99B] flex items-center justify-center font-heading font-bold text-xs text-[#2E4639]">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-[#17191D] flex items-center gap-1.5">
                  <span>{user.displayName || 'Authenticated Client'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E4639]" />
                </div>
                <div className="text-[11px] font-mono text-[#777873]">
                  {user.email} · Synced to Firestore (`directed-correlate-vdckx`)
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#17191D] flex items-center gap-1.5">
                <span>Sign in with Google for Real-Time Cloud Persistence</span>
              </div>
              <p className="text-[11px] text-[#777873]">
                Authenticate via Firebase Auth to sync and manage your project briefs and OPD appointments across devices.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {user && unsyncedCount > 0 && (
              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#91A99B] text-[#17191D] text-xs font-bold uppercase tracking-wider hover:bg-[#829b8c] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync {unsyncedCount} Local to Cloud</span>
              </button>
            )}

            {user ? (
              <button
                type="button"
                onClick={signOutUser}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F7F6F2] hover:bg-[#E5E2DC] text-[#17191D] border border-[#E5E2DC] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17191D] hover:bg-[#252830] text-[#F7F6F2] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#91A99B]" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>

        {authError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 bg-[#EFECE6] border-b border-[#E5E2DC] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-t border-x transition-colors flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'bg-[#F7F6F2] text-[#17191D] font-bold border-[#E5E2DC] -mb-px'
                : 'bg-transparent text-[#777873] hover:text-[#17191D] border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Project Enquiries ({enquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('opd')}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-t border-x transition-colors flex items-center gap-2 ${
              activeTab === 'opd'
                ? 'bg-[#F7F6F2] text-[#17191D] font-bold border-[#E5E2DC] -mb-px'
                : 'bg-transparent text-[#777873] hover:text-[#17191D] border-transparent'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Healthcare OPD Requests ({opdAppointments.length})</span>
          </button>
        </div>

        {/* Scrollable Content List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'enquiries' ? (
            enquiries.length === 0 ? (
              <div className="bg-white border border-[#E5E2DC] p-10 text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-[#F7F6F2] border border-[#E5E2DC] flex items-center justify-center text-[#777873]">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="font-heading text-base font-bold text-[#17191D]">
                    No Project Enquiries Logged Yet
                  </h3>
                  <p className="text-xs text-[#777873] leading-relaxed">
                    Submit a project brief via the Contact page to persist your architectural scope and track studio review status here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartNewEnquiry();
                  }}
                  className="inline-flex items-center gap-2 bg-[#17191D] text-white hover:bg-[#252830] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  <span>Create Project Enquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#91A99B]" />
                </button>
              </div>
            ) : (
              enquiries.map((enq) => {
                const statusInfo = ENQUIRY_STATUS_LABELS[enq.status] || ENQUIRY_STATUS_LABELS.submitted;
                const isLocked = enq.status === 'completed' || enq.status === 'archived';
                return (
                  <div
                    key={enq.id}
                    className="bg-white border border-[#E5E2DC] p-5 space-y-4 hover:border-[#17191D]/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E2DC]">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading font-bold text-base text-[#17191D]">
                            {enq.businessName}
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC] text-[#17191D]">
                            {enq.interestedService}
                          </span>
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 border font-semibold ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-xs text-[#777873] mt-1 font-mono">
                          {enq.fullName} · {enq.email} · {enq.country}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#EFECE6] text-[#777873]">
                          {enq.syncedToCloud ? 'Firestore Cloud' : 'Session Record'}
                        </span>
                        {enq.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => deleteEnquiryRecord(enq.id)}
                            className="p-1.5 text-[#777873] hover:text-red-600 border border-[#E5E2DC] hover:border-red-300 transition-colors"
                            aria-label={`Delete enquiry for ${enq.businessName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#17191D] bg-[#F7F6F2] p-3 border border-[#E5E2DC] leading-relaxed">
                      {enq.projectDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-[#777873]">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span>Budget: {enq.budgetRange}</span>
                        <span>Timeline: {enq.timeline}</span>
                      </div>

                      {(isAdmin || !enq.syncedToCloud) && !isLocked && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase">Triage Status:</span>
                          <select
                            aria-label={`Update status for ${enq.businessName}`}
                            value={enq.status}
                            onChange={(e) =>
                              updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)
                            }
                            className="bg-[#F7F6F2] border border-[#E5E2DC] px-2 py-1 text-[11px] text-[#17191D] focus:outline-none focus:border-[#17191D]"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="in_review">In Review</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          ) : opdAppointments.length === 0 ? (
            <div className="bg-white border border-[#E5E2DC] p-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-[#F7F6F2] border border-[#E5E2DC] flex items-center justify-center text-[#777873]">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#17191D]">
                No Healthcare OPD Consultations Logged
              </h3>
              <p className="text-xs text-[#777873] max-w-md mx-auto leading-relaxed">
                Use the interactive Hospital OPD Appointment widget in the Healthcare Specialisation section to log a specialist consultation request.
              </p>
            </div>
          ) : (
            opdAppointments.map((opd) => {
              const statusInfo = OPD_STATUS_LABELS[opd.status] || OPD_STATUS_LABELS.requested;
              const isLocked = opd.status === 'completed' || opd.status === 'cancelled';
              return (
                <div
                  key={opd.id}
                  className="bg-white border border-[#E5E2DC] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-sm text-[#17191D]">
                        Patient: {opd.patientName}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-[#17191D] text-white">
                        {opd.department}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 border font-semibold ${statusInfo.badgeClass}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-xs text-[#777873] flex items-center gap-3 font-mono">
                      <span>{opd.leadDoctor}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#2E4639]">
                        <Clock className="w-3 h-3" /> Slot: {opd.preferredSlot}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={() => updateOpdAppointmentStatus(opd.id, 'cancelled')}
                        className="px-2.5 py-1 text-[11px] font-mono border border-[#E5E2DC] hover:border-red-400 text-[#777873] hover:text-red-700 transition-colors"
                      >
                        Cancel Slot
                      </button>
                    )}
                    {opd.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => deleteOpdAppointmentRecord(opd.id)}
                        className="p-1.5 text-[#777873] hover:text-red-600 border border-[#E5E2DC] transition-colors"
                        aria-label={`Delete OPD appointment for ${opd.patientName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#EFECE6] px-6 py-3.5 border-t border-[#E5E2DC] flex items-center justify-between text-[11px] font-mono text-[#777873]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E4639]" />
            <span>Zero-Trust Firestore Rules Active (`enquiries`, `opdAppointments`)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-[#17191D] hover:underline uppercase"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
