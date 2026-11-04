import React from 'react';
import { PROCESS_STEPS } from '../data/studioData';
import { Check } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E2DC]">
          <div>
            <span className="font-mono text-xs text-[#777873] uppercase tracking-widest block mb-3">
              OUR PROCESS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight">
              From the first idea to the final experience.
            </h2>
          </div>

          <p className="text-sm text-[#777873] max-w-md leading-relaxed">
            A disciplined, milestone-driven workflow ensuring total transparency, predictable delivery, and exceptional craftsmanship at each stage.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Hidden on small screens) */}
        <div className="hidden lg:grid grid-cols-5 gap-6 mt-16 relative">
          {/* Continuous horizontal connection line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-[#E5E2DC] z-0" />

          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col justify-between">
              <div>
                {/* Node with step number */}
                <div className="w-10 h-10 rounded-full bg-[#17191D] text-[#F7F6F2] font-mono text-xs font-bold flex items-center justify-center border-4 border-[#F7F6F2] mb-6 shadow-sm">
                  {step.number}
                </div>

                <div className="text-[11px] font-mono text-[#91A99B] font-semibold mb-1">
                  {step.duration}
                </div>

                <h3 className="font-heading text-xl font-bold text-[#17191D] mb-3">
                  {step.title}
                </h3>

                <p className="text-xs text-[#777873] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Key Outputs */}
              <div className="pt-4 border-t border-[#E5E2DC] space-y-1.5">
                <div className="text-[10px] font-mono text-[#17191D] uppercase font-semibold">
                  Key Deliverables:
                </div>
                {step.keyOutputs.map((out, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-1.5 text-[11px] text-[#777873]">
                    <Check className="w-3 h-3 text-[#91A99B] shrink-0" />
                    <span>{out}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile & Tablet Vertical Timeline (Shown on sm/md) */}
        <div className="lg:hidden mt-12 space-y-8 relative pl-6 border-l-2 border-[#E5E2DC]">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="relative pl-4">
              {/* Vertical node indicator */}
              <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#17191D] text-[#F7F6F2] font-mono text-xs font-bold flex items-center justify-center border-2 border-[#F7F6F2]">
                {step.number}
              </div>

              <div className="text-xs font-mono text-[#91A99B] font-semibold mb-1">
                {step.duration}
              </div>

              <h3 className="font-heading text-2xl font-bold text-[#17191D] mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-[#777873] leading-relaxed mb-4">
                {step.description}
              </p>

              <div className="p-3 bg-[#EFECE6]/60 border border-[#E5E2DC] rounded space-y-1">
                <div className="text-[10px] font-mono text-[#17191D] uppercase font-semibold mb-1">
                  Key Outputs:
                </div>
                {step.keyOutputs.map((out, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-1.5 text-xs text-[#777873]">
                    <Check className="w-3 h-3 text-[#91A99B] shrink-0" />
                    <span>{out}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
