import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Filter, ExternalLink, Layers } from 'lucide-react';
import { CONCEPT_PROJECTS } from '../data/studioData';
import { ConceptProject } from '../types';

interface SelectedWorkProps {
  onSelectProject: (project: ConceptProject) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const [filter, setFilter] = useState<string>('all');

  const categories = [
    { label: 'All Concepts', value: 'all' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Hospitality', value: 'Hospitality' },
    { label: 'Real Estate', value: 'Real Estate' },
    { label: 'Technology', value: 'Technology' },
  ];

  const filteredProjects =
    filter === 'all'
      ? CONCEPT_PROJECTS
      : CONCEPT_PROJECTS.filter((p) => p.industry === filter);

  return (
    <section id="work" className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header with Important Concept Notice */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#E5E2DC]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#777873] uppercase tracking-widest">
                SELECTED WORK
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#17191D] text-[#F7F6F2] px-2 py-0.5 rounded font-semibold">
                Studio Concept Projects
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight">
              Digital experiences, thoughtfully created.
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm text-[#777873] leading-relaxed mb-3">
              Architectural case studies demonstrating our capabilities across healthcare, hospitality, real estate, and technology.
            </p>
            {/* Required prominent concept project disclosure */}
            <div className="text-[11px] font-mono text-[#777873] bg-[#EFECE6] border border-[#E5E2DC] p-2.5 rounded">
              <span className="font-bold text-[#17191D]">NOTICE:</span> These represent AVENIQ Concept Projects &amp; architectural explorations demonstrating our design systems, not completed third-party client work.
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilter(cat.value)}
              className={`text-xs px-4 py-2 font-mono uppercase tracking-wider transition-colors border ${
                filter === cat.value
                  ? 'bg-[#17191D] text-[#F7F6F2] border-[#17191D]'
                  : 'bg-transparent text-[#777873] border-[#E5E2DC] hover:text-[#17191D] hover:border-[#17191D]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 6 Visual Concept Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer flex flex-col justify-between border border-[#E5E2DC] bg-[#F7F6F2] hover:border-[#17191D] hover:shadow-lg transition-all duration-300"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(project);
                }
              }}
              aria-label={`View concept project: ${project.title}`}
            >
              {/* Mockup Card Artwork Header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#17191D] p-5 flex flex-col justify-between text-[#F7F6F2] border-b border-[#E5E2DC]">
                {/* Visual styling background based on concept type */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.imagePlaceholderStyle.bgGradient} opacity-95 group-hover:scale-105 transition-transform duration-500`}
                />

                {/* Subtle geometric pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `radial-gradient(#91A99B 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />
                </div>

                {/* Browser chrome header inside mockup */}
                <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10 text-[10px] font-mono text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                    <span className="w-2 h-2 rounded-full bg-white/30" />
                  </div>
                  <span className="uppercase text-[9px] text-[#91A99B] font-semibold tracking-wider">
                    AVENIQ CONCEPT
                  </span>
                </div>

                {/* Concept Centerpiece Graphic */}
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

                {/* Card Mockup Footer */}
                <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/60">
                  <span>{project.industry}</span>
                  <span className="flex items-center gap-1 text-[#91A99B]">
                    View Project <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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

                  <h3 className="font-heading text-xl font-bold text-[#17191D] group-hover:text-[#17191D] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-[#777873] mt-2 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Services Tags */}
                <div className="mt-6 pt-4 border-t border-[#E5E2DC]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.services.slice(0, 3).map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 bg-[#E5E2DC]/50 text-[#17191D]/80 rounded"
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

                  <div className="mt-4 flex items-center justify-between pt-2 text-xs font-semibold text-[#17191D] group-hover:text-[#2E4639]">
                    <span>Inspect Architectural Blueprint</span>
                    <ArrowUpRight className="w-4 h-4 text-[#91A99B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
