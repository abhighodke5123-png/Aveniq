import React from 'react';
import { VALUE_PROPOSITIONS } from '../data/studioData';
import { Target, Compass, Terminal, BarChart2 } from 'lucide-react';

export const WhyAveniq: React.FC = () => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Target className="w-5 h-5 text-[#17191D]" />;
      case 1:
        return <Compass className="w-5 h-5 text-[#17191D]" />;
      case 2:
        return <Terminal className="w-5 h-5 text-[#17191D]" />;
      case 3:
        return <BarChart2 className="w-5 h-5 text-[#17191D]" />;
      default:
        return <Target className="w-5 h-5 text-[#17191D]" />;
    }
  };

  return (
    <section className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl pb-14 border-b border-[#E5E2DC]">
          <span className="font-mono text-xs text-[#777873] uppercase tracking-widest block mb-3">
            WHY AVENIQ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight leading-[1.12]">
            Thoughtful design. Intelligent technology. Meaningful growth.
          </h2>
          <p className="mt-4 text-base text-[#777873] leading-relaxed">
            We operate at the intersection of architectural aesthetics and hard conversion engineering. Here is the foundation behind every project we deliver.
          </p>
        </div>

        {/* 4 Value Propositions Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E5E2DC]">
          {VALUE_PROPOSITIONS.map((prop, idx) => (
            <div
              key={idx}
              className="p-8 border-b border-r border-[#E5E2DC] flex flex-col justify-between hover:bg-[#EAE8E1]/40 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-bold text-[#91A99B]">
                    {prop.number}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#E5E2DC]/50 flex items-center justify-center group-hover:bg-[#91A99B]/20 transition-colors">
                    {getIcon(idx)}
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#17191D] mb-3">
                  {prop.title}
                </h3>

                <p className="text-sm text-[#777873] leading-relaxed">
                  {prop.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5E2DC]/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#91A99B]" />
                <span className="font-mono text-[10px] text-[#777873] uppercase tracking-wider">
                  Verified Standard
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
