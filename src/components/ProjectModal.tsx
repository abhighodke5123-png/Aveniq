import React from 'react';
import { X, ArrowUpRight, Check, ShieldCheck, Sparkles, Layers, Cpu, Laptop } from 'lucide-react';
import { ConceptProject } from '../types';

interface ProjectModalProps {
  project: ConceptProject | null;
  onClose: () => void;
  onStartSimilarProject: (project: ConceptProject) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onStartSimilarProject,
}) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17191D]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div
        className="relative bg-[#F7F6F2] text-[#17191D] w-full max-w-4xl border border-[#E5E2DC] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#17191D] text-[#F7F6F2] p-6 sm:p-8 flex items-start justify-between border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase bg-[#91A99B]/20 text-[#91A99B] px-2 py-0.5 rounded font-bold">
                AVENIQ CONCEPT PROJECT
              </span>
              <span className="text-xs font-mono text-white/50 uppercase">
                {project.industry} // {project.category}
              </span>
            </div>
            <h2
              id="modal-project-title"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white"
            >
              {project.title}
            </h2>
            <p className="text-sm text-white/70 mt-1 max-w-2xl">
              {project.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Important concept project badge notice */}
          <div className="p-3.5 bg-[#EFECE6] border border-[#E5E2DC] text-xs font-mono text-[#777873] rounded">
            <strong className="text-[#17191D]">Studio Exploration Note:</strong> This is an original AVENIQ concept project created to illustrate our architectural design methodology, clinical navigation systems, and technical execution standards.
          </div>

          {/* Project Summary */}
          <div>
            <h3 className="font-heading text-lg font-bold text-[#17191D] mb-2">
              Architectural Concept Brief
            </h3>
            <p className="text-base text-[#777873] leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Architecture & Engineering Highlights */}
          <div className="p-6 bg-white border border-[#E5E2DC] rounded space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#91A99B] font-bold">
              <Sparkles className="w-4 h-4" />
              Engineered Capabilities &amp; System Metrics
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#17191D]/90">
              {project.architectureHighlights.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#91A99B] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Deliverables & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading font-bold text-sm text-[#17191D] mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#777873]" />
                Key Deliverables
              </h4>
              <ul className="space-y-2 text-sm text-[#777873]">
                {project.deliverables.map((deliv, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#91A99B]" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#17191D] mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#777873]" />
                Core Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 bg-white border border-[#E5E2DC] text-[#17191D] rounded font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-5 sm:p-6 bg-[#EFECE6] border-t border-[#E5E2DC] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#777873]">
            Interested in building a digital experience of this caliber?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#777873] hover:text-[#17191D]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartSimilarProject(project);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#17191D] text-white hover:bg-[#252830] px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              <span>Discuss {project.industry} Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
