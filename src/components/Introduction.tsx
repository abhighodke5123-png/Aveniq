import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { STUDIO_META } from '../data/studioData';

interface IntroductionProps {
  onLearnMore?: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onLearnMore }) => {
  return (
    <section id="about" className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Eyebrow */}
        <div className="flex items-center gap-2 mb-8">
          <span className="font-mono text-xs text-[#777873] uppercase tracking-widest">
            01 / INTRODUCTION &amp; PHILOSOPHY
          </span>
        </div>

        {/* Large Editorial Headline & Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] leading-[1.12] tracking-tight">
              {STUDIO_META.introHeadline}
            </h2>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-12 h-0.5 bg-[#91A99B]" />
              <span className="font-mono text-xs text-[#777873] uppercase tracking-wider">
                Digital Experience Studio
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[#17191D]/90 text-lg md:text-xl font-normal leading-relaxed">
            <p className="text-[#17191D] font-medium">
              {STUDIO_META.introParagraph1}
            </p>
            <p className="text-[#777873]">
              {STUDIO_META.introParagraph2}
            </p>

            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-[#E5E2DC]">
              <div>
                <div className="font-heading text-2xl font-bold text-[#17191D]">
                  Bespoke
                </div>
                <div className="text-xs text-[#777873] mt-1 font-mono">
                  Zero standard templates. Every interface is designed specifically for your brand.
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-[#17191D]">
                  International
                </div>
                <div className="text-xs text-[#777873] mt-1 font-mono">
                  Engineered to international standards for clients across India, US, UK, and worldwide.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Studio Tenets in Minimal Architectural Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E5E2DC]">
          <div className="p-8 border-b border-r border-[#E5E2DC] hover:bg-[#EAE8E1]/40 transition-colors">
            <div className="font-mono text-xs text-[#91A99B] font-semibold mb-3">
              PILLAR 01
            </div>
            <h3 className="font-heading text-xl font-bold text-[#17191D] mb-2">
              Clinical &amp; Commercial Precision
            </h3>
            <p className="text-sm text-[#777873] leading-relaxed">
              We design with rigorous domain knowledge. Whether it is patient doctor directories or real estate showings, we eliminate user friction.
            </p>
          </div>

          <div className="p-8 border-b border-r border-[#E5E2DC] hover:bg-[#EAE8E1]/40 transition-colors">
            <div className="font-mono text-xs text-[#91A99B] font-semibold mb-3">
              PILLAR 02
            </div>
            <h3 className="font-heading text-xl font-bold text-[#17191D] mb-2">
              Editorial Aesthetic Discipline
            </h3>
            <p className="text-sm text-[#777873] leading-relaxed">
              Quiet authority beats visual noise. We employ considered whitespace, architectural grid layouts, and refined typography that instills deep trust.
            </p>
          </div>

          <div className="p-8 border-b border-r border-[#E5E2DC] hover:bg-[#EAE8E1]/40 transition-colors">
            <div className="font-mono text-xs text-[#91A99B] font-semibold mb-3">
              PILLAR 03
            </div>
            <h3 className="font-heading text-xl font-bold text-[#17191D] mb-2">
              Engineered For Conversion
            </h3>
            <p className="text-sm text-[#777873] leading-relaxed">
              Beauty without business utility is wasted. Every AVENIQ digital experience is built with clear enquiry pathways, SEO structure, and instant contact channels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
