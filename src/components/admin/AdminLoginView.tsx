import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogIn,
} from 'lucide-react';
import { BrandMonogram } from '../BrandMonogram';
import { useAdminStore } from '../../context/AdminStoreContext';
import { AdminRole } from '../../types/admin';

interface AdminLoginViewProps {
  onExitToSite: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onExitToSite }) => {
  const {
    loginWithCredentials,
    loginWithGoogleAdmin,
    sendPasswordResetInstruction,
    failedAttempts,
    isLockedOut,
    authMessage,
  } = useAdminStore();

  const [email, setEmail] = useState('abhighodke5123@gmail.com');
  const [accessKey, setAccessKey] = useState('AVENIQ-STUDIO-2026');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('Super Admin');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = loginWithCredentials(email, accessKey, selectedRole);
    if (!res.ok && res.error) {
      setError(res.error);
    }
  };

  const handlePasswordReset = () => {
    setError(null);
    const res = sendPasswordResetInstruction(email);
    if (!res.ok) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#17191D] text-[#F7F6F2] flex flex-col justify-between p-6 sm:p-10 font-sans">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <BrandMonogram size={28} />
          <span className="font-heading text-base font-extrabold tracking-widest uppercase text-white">
            AVENIQ
          </span>
          <span className="text-xs text-white/50">·</span>
          <span className="font-mono text-xs text-[#91A99B]">Command Centre</span>
        </div>

        <button
          type="button"
          onClick={onExitToSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Studio</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#1E2126] border border-white/15 p-8 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-[#91A99B] uppercase tracking-wider">
            Authorized Personnel Only
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Command Centre
          </h1>
          <p className="text-xs text-white/65 leading-relaxed">
            Sign in with your registered AVENIQ studio account. Public registration is disabled; access is governed by role-based permissions and audit logging.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {authMessage && (
          <div className="p-3.5 bg-[#91A99B]/15 border border-[#91A99B]/40 text-xs text-[#D1DDD6] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#91A99B] shrink-0 mt-0.5" />
            <span>{authMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-login-email"
              className="block text-xs font-mono text-white/80 mb-1.5"
            >
              Studio Email Address
            </label>
            <input
              id="admin-login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abhighodke5123@gmail.com"
              className="w-full px-3.5 py-2.5 bg-[#17191D] border border-white/15 text-sm text-white focus:border-[#91A99B] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-login-key"
                className="block text-xs font-mono text-white/80"
              >
                Admin Security Passcode
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-[11px] font-mono text-[#91A99B] hover:underline"
              >
                Reset Passcode
              </button>
            </div>
            <input
              id="admin-login-key"
              type="password"
              required
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter studio security key"
              className="w-full px-3.5 py-2.5 bg-[#17191D] border border-white/15 text-sm text-white focus:border-[#91A99B] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-login-role"
              className="block text-xs font-mono text-white/80 mb-1.5"
            >
              RBAC Session Role
            </label>
            <select
              id="admin-login-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
              className="w-full px-3.5 py-2.5 bg-[#17191D] border border-white/15 text-sm text-white focus:border-[#91A99B] focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Governance &amp; Security)</option>
              <option value="Admin">Admin (Operations, Finance &amp; Team)</option>
              <option value="Manager">Manager (CRM, Clients &amp; Projects)</option>
              <option value="Staff">Staff (Assigned Projects &amp; Leads)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLockedOut}
            className="w-full py-3 px-5 bg-[#F7F6F2] text-[#17191D] hover:bg-[#E5E2DC] disabled:opacity-50 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In to Command Centre</span>
          </button>
        </form>

        <div className="relative py-1 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#1E2126] px-3 text-[11px] font-mono text-white/40">OR</span>
          <div className="border-t border-white/10 w-full" />
        </div>

        <button
          type="button"
          onClick={loginWithGoogleAdmin}
          className="w-full py-2.5 px-4 bg-[#17191D] hover:bg-white/5 text-white border border-white/20 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
        >
          <LogIn className="w-3.5 h-3.5 text-[#91A99B]" />
          <span>Continue with Firebase Google OAuth</span>
        </button>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#91A99B]" />
            <span>RLS &amp; Zero-Trust Rules Active</span>
          </span>
          <span className="tabular-nums">Attempts: {failedAttempts}/5</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-mono">
        <div>AVENIQ Administrative Environment · No Public Registration</div>
        <div className="flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-[#91A99B]" />
          <span>Session Protected by RBAC &amp; Audit Trail</span>
        </div>
      </div>
    </div>
  );
};
