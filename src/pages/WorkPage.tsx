import React, { useState } from 'react';
import { CONCEPT_PROJECTS } from '../data/studioData';
import { ConceptProject } from '../types';
import { PageId } from '../utils/router';
import { ArrowUpRight, Sparkles, Filter, Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface WorkPageProps {
  onNavigate: (page: PageId) => void;
  onSelectProject: (project: ConceptProject) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { label: 'All Concepts (6)', value: 'all' },
    { label: 'Healthcare (2)', value: 'Healthcare' },
    { label: 'Hospitality (2)', value: 'Hospitality' },
    { label: 'Real Estate (1)', value: 'Real Estate' },
    { label: 'Technology (1)', value: 'Technology' },
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? CONCEPT_PROJECTS
      : CONCEPT_PROJECTS.filter((p) => p.industry === activeFilter);

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#91A99B] font-bold">PAGE 04 // WORK</span>
          <span className="text-[#E5E2DC]">/</span>
          <span className="font-mono text-xs text-[#777873] uppercase">Selected Concept Projects</span>
        </div>

        {/* Dedicated Page Hero */}
        <div className="max-w-4xl pb-12 border-b border-[#E5E2DC]">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight leading-[1.08]">
            Digital experiences, thoughtfully created.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
            Architectural case studies demonstrating our capabilities across multispeciality healthcare, boutique hospitality, premium real estate, and enterprise technology.
          </p>
        </div>

        {/* Mandatory Concept Notice Banner */}
        <div className="mt-8 p-5 bg-[#EFECE6] border border-[#E5E2DC] rounded text-xs text-[#777873] leading-relaxed flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#17191D] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono">
            i
          </div>
          <div>
            <span className="font-bold text-[#17191D] font-heading text-sm block mb-1">
              AVENIQ Concept Projects &amp; Architectural Explorations
            </span>
            These initial case studies are original AVENIQ concept explorations demonstrating our design systems, component libraries, clinical navigation workflows, and architectural engineering. They are not completed commercial client commissions. We never invent third-party client testimonials or fictitious performance metrics.
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveFilter(cat.value)}
                className={`text-xs px-4 py-2.5 font-mono uppercase tracking-wider transition-all border ${
                  activeFilter === cat.value
                    ? 'bg-[#17191D] text-[#F7F6F2] border-[#17191D] font-bold shadow-sm'
                    : 'bg-white text-[#777873] border-[#E5E2DC] hover:text-[#17191D] hover:border-[#17191D]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[#777873]">
            Showing {filteredProjects.length} Architectural Study{filteredProjects.length > 1 ? 'ies' : ''}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer flex flex-col justify-between border border-[#E5E2DC] bg-white hover:border-[#17191D] hover:shadow-xl transition-all duration-300"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(project);
                }
              }}
              aria-label={`Inspect concept project: ${project.title}`}
            >
              {/* Visual Card Artwork */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#17191D] p-5 flex flex-col justify-between text-[#F7F6F2] border-b border-[#E5E2DC]">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.imagePlaceholderStyle.bgGradient} opacity-95 group-hover:scale-105 transition-transform duration-500`}
                />

                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(#91A99B 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />
                </div>

                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                  <span className="uppercase text-[9px] text-[#91A99B] font-semibold tracking-wider">
                    STUDIO BLUEPRINT
                  </span>
                </div>

                <div className="relative z-10 my-auto py-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-1">
                    {project.category}
                  </div>
                  <div className="font-heading text-lg sm:text-xl font-extrabold text-white group-hover:text-[#91A99B] transition-colors">
                    {project.title}
                  </div>
                  <p className="text-[11px] text-white/70 line-clamp-2 mt-1">
                    {project.tagline}
                  </p>
                </div>

                <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/60">
                  <span>{project.industry}</span>
                  <span className="flex items-center gap-1 text-[#91A99B]">
                    Inspect Case <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#777873] mb-2">
                    <span className="text-[#91A99B] font-bold uppercase">{project.industry}</span>
                    <span>{project.category}</span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-[#17191D]">
                    {project.title}
                  </h3>

                  <p className="text-sm text-[#777873] mt-2 line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Architecture Highlights & Services */}
                <div className="mt-6 pt-4 border-t border-[#E5E2DC] space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.services.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#F7F6F2] border border-[#E5E2DC] text-[#17191D]/80 rounded"
                      >
                        {srv}
                      </span>
                    ))}
                    {project.services.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 text-[#777873]">
                        +{project.services.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs font-semibold text-[#17191D] group-hover:text-[#2E4639]">
                    <span>View Specifications &amp; Deliverables</span>
                    <ArrowUpRight className="w-4 h-4 text-[#91A99B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Technical Benchmarks Banner */}
        <div className="mt-20 p-8 sm:p-12 bg-[#17191D] text-[#F7F6F2] border border-[#17191D]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#91A99B] font-bold">
                BUILT-IN ENGINEERING STANDARDS
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Every project is verified against our 100/100 performance rubric.
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Whether creating a quaternary hospital portal or an alpine luxury resort, we enforce sub-second load times, total mobile responsive fidelity, clean semantic HTML, and multi-tier security.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#F7F6F2] text-[#17191D] hover:bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <span>Commission a Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
