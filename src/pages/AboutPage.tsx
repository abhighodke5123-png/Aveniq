import React from 'react';
import { ProcessSection } from '../components/ProcessSection';
import { WhyAveniq } from '../components/WhyAveniq';
import { BrandMonogram } from '../components/BrandMonogram';
import { STUDIO_META } from '../data/studioData';
import { PageId } from '../utils/router';
import { ArrowUpRight, ShieldCheck, Globe, Users, Code, Sparkles, Check } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#91A99B] font-bold">PAGE 05 // ABOUT</span>
          <span className="text-[#E5E2DC]">/</span>
          <span className="font-mono text-xs text-[#777873] uppercase">Studio Philosophy</span>
        </div>

        {/* Dedicated Page Hero */}
        <div className="max-w-4xl pb-14 border-b border-[#E5E2DC]">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight leading-[1.08]">
            Designed to move business forward.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
            AVENIQ is an independent creative technology studio helping ambitious businesses and healthcare institutions transform their digital presence through bespoke design, intelligent automation, and high-performance engineering.
          </p>
        </div>

        {/* Studio Manifesto / Story Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white border border-[#E5E2DC] shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <BrandMonogram size={32} />
                <div>
                  <div className="font-heading font-extrabold text-lg uppercase tracking-wider text-[#17191D]">
                    AVENIQ STUDIO
                  </div>
                  <div className="text-xs text-[#777873] font-mono">
                    Independent Creative Technology
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E2DC] space-y-3 text-xs text-[#777873] leading-relaxed">
                <div>
                  <strong className="text-[#17191D] block mb-0.5">Primary Specialisation:</strong>
                  Healthcare web engineering, hospital portals, specialist doctor profiles, and clinical patient booking workflows.
                </div>
                <div>
                  <strong className="text-[#17191D] block mb-0.5">Commercial Range:</strong>
                  Hospitality, premium real estate, education, professional advisory, and high-velocity technology startups.
                </div>
                <div>
                  <strong className="text-[#17191D] block mb-0.5">Geographic Delivery:</strong>
                  India, United States, United Kingdom, Australia, Canada, and global international markets.
                </div>
              </div>
            </div>

            {/* Direct Principal Access Card */}
            <div className="p-6 bg-[#91A99B]/15 border border-[#91A99B]/30 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#2E4639]">
                <Users className="w-4 h-4 text-[#2E4639]" />
                Direct Principal Access
              </div>
              <p className="text-xs text-[#17191D] leading-relaxed">
                You work directly with senior architects and creative directors. No junior handoffs, no bureaucratic layers, and no bloated agency markups.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-[#17191D]/90 text-lg leading-relaxed">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D]">
              Why traditional agency models are broken.
            </h2>

            <p className="text-[#777873] text-base leading-relaxed">
              For years, companies faced a frustrating compromise. Creative design agencies produced striking mockups in Figma, but their resulting websites were sluggish, bloated with plugins, and mathematically indifferent to conversion funnels.
            </p>

            <p className="text-[#777873] text-base leading-relaxed">
              On the other side, standard development shops built functional databases and CRM integrations, but delivered cold, uninspired templates that eroded brand prestige and failed to inspire patient or client trust.
            </p>

            <div className="p-6 bg-white border border-[#E5E2DC] border-l-4 border-l-[#91A99B] space-y-2 my-6">
              <p className="text-base text-[#17191D] font-medium leading-relaxed">
                "AVENIQ was established to erase this divide. We combine the quiet, architectural refinement of an elite European design studio with the rigorous full-stack engineering standards of a modern technology lab."
              </p>
            </div>

            <p className="text-[#777873] text-base leading-relaxed">
              Every interface is built from first principles using clean TypeScript, modern component architecture, and sub-second edge deployment. The result is a digital presence that commands authority within seconds and converts curiosity into commercial action.
            </p>
          </div>
        </div>

        {/* Global Standards Banner */}
        <div className="mt-20 p-8 sm:p-12 bg-white border border-[#E5E2DC]">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-[#91A99B]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#777873]">
              INTERNATIONAL CLIENT COLLABORATION
            </span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D] mb-4">
            Structured for seamless international delivery.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-[#F7F6F2] border border-[#E5E2DC] space-y-2">
              <div className="font-mono text-xs font-bold text-[#91A99B]">01 / ASYNCHRONOUS AGILITY</div>
              <div className="font-heading text-base font-bold text-[#17191D]">Time-Zone Harmony</div>
              <p className="text-xs text-[#777873] leading-relaxed">
                Whether you operate from London, Mumbai, New York, or Sydney, our sprint updates and video milestones align with your executive schedule.
              </p>
            </div>

            <div className="p-5 bg-[#F7F6F2] border border-[#E5E2DC] space-y-2">
              <div className="font-mono text-xs font-bold text-[#91A99B]">02 / TRANSPARENT COMMERCE</div>
              <div className="font-heading text-base font-bold text-[#17191D]">Fixed Milestone Pricing</div>
              <p className="text-xs text-[#777873] leading-relaxed">
                No open-ended hourly billing or surprise scopes. Every project is planned with itemized deliverables, defined milestones, and guaranteed delivery.
              </p>
            </div>

            <div className="p-5 bg-[#F7F6F2] border border-[#E5E2DC] space-y-2">
              <div className="font-mono text-xs font-bold text-[#91A99B]">03 / CODE &amp; IP OWNERSHIP</div>
              <div className="font-heading text-base font-bold text-[#17191D]">100% Client Property</div>
              <p className="text-xs text-[#777873] leading-relaxed">
                Zero proprietary lock-in. All Git repositories, design tokens, and DNS credentials are transferred to your legal entity upon project sign-off.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Studio Core Tenets */}
      <div className="mt-20 border-t border-[#E5E2DC]">
        <WhyAveniq />
      </div>

      {/* Full-Width 5-Step Process Timeline */}
      <ProcessSection />

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mt-20">
        <div className="p-8 sm:p-12 bg-[#17191D] text-[#F7F6F2] border border-[#17191D] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-xs text-[#91A99B] font-bold uppercase mb-1">
              READY TO COMMENCE?
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Let's create something meaningful together.
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="shrink-0 inline-flex items-center gap-2 bg-[#F7F6F2] text-[#17191D] hover:bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
