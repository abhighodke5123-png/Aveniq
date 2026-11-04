import React from 'react';
import { X, ArrowUpRight, Check, Sparkles, Layers, Cpu } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInitiateService: (service: ServiceItem) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onInitiateService,
}) => {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17191D]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
    >
      <div
        className="relative bg-[#F7F6F2] text-[#17191D] w-full max-w-3xl border border-[#E5E2DC] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#17191D] text-[#F7F6F2] p-6 sm:p-8 flex items-start justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-[#91A99B] font-bold">
                CAPABILITY // {service.number}
              </span>
            </div>
            <h2
              id="modal-service-title"
              className="font-heading text-2xl sm:text-3xl font-extrabold text-white"
            >
              {service.title}
            </h2>
            <p className="text-sm text-white/70 mt-1 max-w-xl">
              {service.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Close service modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h3 className="font-heading text-base font-bold text-[#17191D] mb-2">
              Overview &amp; Strategic Value
            </h3>
            <p className="text-sm text-[#777873] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Deliverables */}
          <div className="p-6 bg-white border border-[#E5E2DC] rounded space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#17191D] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#91A99B]" />
              Standard Scope &amp; Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#17191D]/90">
                  <Check className="w-3.5 h-3.5 text-[#91A99B] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies & Ideal For */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E5E2DC] rounded">
              <div className="text-[10px] font-mono text-[#777873] uppercase font-bold mb-2">
                Tech Stack &amp; Tooling
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono px-2 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC] text-[#17191D] rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E2DC] rounded">
              <div className="text-[10px] font-mono text-[#777873] uppercase font-bold mb-1">
                Ideal Client Profile
              </div>
              <p className="text-xs text-[#777873] leading-relaxed">
                {service.idealFor}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-[#EFECE6] border-t border-[#E5E2DC] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#777873] hover:text-[#17191D]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onInitiateService(service);
            }}
            className="inline-flex items-center gap-2 bg-[#17191D] text-white hover:bg-[#252830] px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            <span>Inquire About {service.title}</span>
            <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
