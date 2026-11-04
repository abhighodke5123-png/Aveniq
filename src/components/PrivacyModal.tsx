import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17191D]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-privacy-title"
    >
      <div
        className="relative bg-[#F7F6F2] text-[#17191D] w-full max-w-2xl border border-[#E5E2DC] shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#17191D] text-[#F7F6F2] p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#91A99B]" />
            <h2 id="modal-privacy-title" className="font-heading text-xl font-bold text-white">
              Privacy Policy &amp; Data Governance
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white transition-colors"
            aria-label="Close privacy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-sm text-[#777873] leading-relaxed flex-1">
          <p className="font-semibold text-[#17191D]">
            Last updated: November 2026. AVENIQ Digital Experience Studio.
          </p>

          <div>
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-1">
              1. Information We Collect
            </h3>
            <p>
              When you submit a project enquiry on our website, we collect your full name, business name, email address, phone number, country, and project brief details. We do not sell or rent this data to any third party.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-1">
              2. Purpose of Processing
            </h3>
            <p>
              Your details are used solely to assess your project requirements, communicate strategic estimates, prepare technical proposals, and coordinate meetings.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-1">
              3. Healthcare &amp; Clinical Data Standards
            </h3>
            <p>
              In our healthcare web engineering practice, patient confidentiality and clinical privacy are strictly maintained in alignment with HIPAA, NABH, and local health data governance frameworks.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-1">
              4. IP Ownership &amp; Non-Disclosure
            </h3>
            <p>
              All concepts, custom codebases, and intellectual assets developed under client contracts remain the exclusive property of the client upon project completion.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-1">
              5. Contact Us
            </h3>
            <p>
              For privacy queries or data deletion requests, email our data team at{' '}
              <a href="mailto:privacy@aveniqstudio.com" className="text-[#17191D] font-bold underline">
                privacy@aveniqstudio.com
              </a>.
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#EFECE6] border-t border-[#E5E2DC] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#17191D] text-white hover:bg-[#252830] px-6 py-2 text-xs font-bold uppercase tracking-wider"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
