import React, { useState } from 'react';
import { ArrowUpRight, Check, HeartPulse, Building2, UtensilsCrossed, GraduationCap, Briefcase, Rocket } from 'lucide-react';
import { INDUSTRIES_DATA } from '../data/studioData';
import { IndustryItem } from '../types';

interface IndustriesSectionProps {
  onSelectHealthcare: () => void;
  onStartProjectForIndustry: (industryName: string) => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  onSelectHealthcare,
  onStartProjectForIndustry,
}) => {
  const [activeIndustryId, setActiveIndustryId] = useState<string>(INDUSTRIES_DATA[0].id);

  const getIndustryIcon = (id: string) => {
    switch (id) {
      case 'healthcare':
        return <HeartPulse className="w-5 h-5" />;
      case 'hospitality':
        return <UtensilsCrossed className="w-5 h-5" />;
      case 'real-estate':
        return <Building2 className="w-5 h-5" />;
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'professional-services':
        return <Briefcase className="w-5 h-5" />;
      case 'startups-retail':
        return <Rocket className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const activeIndustry = INDUSTRIES_DATA.find((ind) => ind.id === activeIndustryId) || INDUSTRIES_DATA[0];

  return (
    <section id="industries" className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E2DC]">
          <div>
            <span className="font-mono text-xs text-[#777873] uppercase tracking-widest block mb-3">
              INDUSTRIES WE WORK WITH
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight">
              Different industries. One digital standard.
            </h2>
          </div>

          <p className="text-sm text-[#777873] max-w-md font-normal leading-relaxed">
            While each sector has distinct audience journeys, all require clarity, speed, architectural typography and high-converting workflows.
          </p>
        </div>

        {/* 6 Industry Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES_DATA.map((industry) => {
            const isHealthcare = industry.id === 'healthcare';
            const isSelected = activeIndustryId === industry.id;

            return (
              <div
                key={industry.id}
                onClick={() => {
                  setActiveIndustryId(industry.id);
                  if (isHealthcare) {
                    onSelectHealthcare();
                  }
                }}
                className={`relative p-8 border transition-all duration-300 flex flex-col justify-between min-h-[300px] cursor-pointer ${
                  isSelected
                    ? 'border-[#17191D] bg-[#EFECE6] shadow-sm'
                    : 'border-[#E5E2DC] bg-[#F7F6F2] hover:border-[#17191D]/40 hover:bg-[#EFECE6]/40'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIndustryId(industry.id);
                    if (isHealthcare) onSelectHealthcare();
                  }
                }}
                aria-label={`Industry: ${industry.title}`}
              >
                {/* Top: Icon, Title & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isHealthcare
                          ? 'bg-[#17191D] text-[#91A99B]'
                          : 'bg-[#E5E2DC] text-[#17191D]'
                      }`}
                    >
                      {getIndustryIcon(industry.id)}
                    </div>

                    <span
                      className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded ${
                        isHealthcare
                          ? 'bg-[#91A99B]/20 text-[#2E4639] font-bold border border-[#91A99B]/30'
                          : 'bg-[#E5E2DC]/60 text-[#777873]'
                      }`}
                    >
                      {industry.accentMetric}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-[#17191D] mb-3">
                    {industry.title}
                  </h3>

                  <p className="text-sm text-[#777873] leading-relaxed mb-4">
                    {industry.summary}
                  </p>

                  <div className="text-xs text-[#17191D]/70 font-mono pt-2 border-t border-[#E5E2DC]/80">
                    <span className="text-[#777873]">Focus: </span>
                    {industry.examples}
                  </div>
                </div>

                {/* Bottom: Action trigger */}
                <div className="pt-6 mt-6 border-t border-[#E5E2DC] flex items-center justify-between text-xs font-semibold text-[#17191D]">
                  <span>
                    {isHealthcare ? 'View Specialisation' : 'Explore Solutions'}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#91A99B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Industry Detail Strip */}
        <div className="mt-10 p-6 sm:p-8 bg-[#17191D] text-[#F7F6F2] border border-[#17191D] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#91A99B]" />
              <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                Industry Focus: {activeIndustry.title}
              </span>
            </div>
            <div className="text-base text-white/90">
              Core Deliverables for {activeIndustry.title}:
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-xs text-white/70">
              {activeIndustry.deliverables.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#91A99B]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartProjectForIndustry(activeIndustry.title)}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#F7F6F2] text-[#17191D] hover:bg-white active:scale-95 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Discuss {activeIndustry.title} Project</span>
            <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
          </button>
        </div>
      </div>
    </section>
  );
};
