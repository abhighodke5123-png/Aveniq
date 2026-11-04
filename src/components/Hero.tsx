import React from 'react';
import { ArrowUpRight, ArrowDown, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { STUDIO_META } from '../data/studioData';

interface HeroProps {
  onStartProject: () => void;
  onExploreWork: () => void;
  onExploreHealthcare: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartProject,
  onExploreWork,
  onExploreHealthcare,
}) => {
  return (
    <section
      id="home"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden border-b border-[#E5E2DC]"
    >
      {/* Subtle architectural background coordinate lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #17191D 1px, transparent 1px), linear-gradient(to bottom, #17191D 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Top Eyebrow & Studio Sub-descriptor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-8 border-b border-[#E5E2DC]">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#91A99B] animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-widest text-[#17191D] uppercase">
              {STUDIO_META.descriptor}
            </span>
          </div>

          <div className="text-[11px] font-mono tracking-wider text-[#777873] uppercase">
            {STUDIO_META.subDescriptor}
          </div>
        </div>

        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pt-10 lg:pt-14 items-start">
          {/* Left Column: Oversized Typography & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-[#17191D] leading-[1.08] tracking-tight">
                Your next stage of growth starts with a{' '}
                <span className="relative inline-block text-[#17191D]">
                  better digital
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full text-[#91A99B]/50"
                    height="6"
                    viewBox="0 0 200 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 4.5C50 1.5 150 1.5 200 4.5"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </span>{' '}
                presence.
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
                {STUDIO_META.heroDescription}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onStartProject}
                className="inline-flex items-center justify-center gap-2.5 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] active:scale-[0.98] transition-all px-8 py-4 text-xs font-bold tracking-widest uppercase group border border-[#17191D]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 text-[#91A99B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onExploreWork}
                className="inline-flex items-center justify-center gap-2.5 bg-transparent text-[#17191D] hover:bg-[#E5E2DC]/50 active:scale-[0.98] transition-all px-8 py-4 text-xs font-bold tracking-widest uppercase border border-[#E5E2DC] group"
              >
                <span>Explore Our Work</span>
                <ArrowDown className="w-4 h-4 text-[#777873] group-hover:translate-y-1 transition-transform" />
              </button>
            </div>

            {/* Studio Badge / Healthcare Callout */}
            <div className="mt-12 pt-8 border-t border-[#E5E2DC] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#91A99B]/15 flex items-center justify-center text-[#91A99B]">
                  <Activity className="w-4 h-4 text-[#2E4639]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#17191D]">
                    Primary Specialisation: Healthcare
                  </div>
                  <div className="text-[11px] text-[#777873]">
                    Hospital portals, specialist doctor profiles &amp; appointment automation
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onExploreHealthcare}
                className="hidden sm:inline-flex text-xs font-semibold text-[#17191D] hover:text-[#91A99B] items-center gap-1 group whitespace-nowrap"
              >
                <span>Explore Solutions</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Visual Artwork & Studio Blueprint Composition */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#17191D] text-[#F7F6F2] p-7 sm:p-9 shadow-2xl border border-[#17191D] flex flex-col justify-between min-h-[480px]">
              {/* Monogram watermarking */}
              <div className="absolute top-4 right-4 text-white/5 font-heading text-8xl font-black select-none pointer-events-none">
                A
              </div>

              {/* Artwork Header */}
              <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-[#91A99B]" />
                  <span className="font-mono text-[11px] tracking-widest uppercase text-white/70">
                    AVENIQ STUDIO SPEC // 2026
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-white/80 rounded">
                  GLOBAL VERIFIED
                </span>
              </div>

              {/* Architectural Graphic Artwork: Clean Editorial Geometric Lines */}
              <div className="relative z-10 my-8 py-4">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono text-white/40 uppercase">01 / Foundation</span>
                    <span className="text-xs font-mono text-[#91A99B]">Sub-0.6s Global TTI</span>
                  </div>

                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#91A99B] w-full" />
                  </div>

                  {/* Architectural Blueprint Diagram */}
                  <div className="p-4 bg-white/[0.03] border border-white/10 rounded font-mono text-xs text-white/80 space-y-2.5">
                    <div className="flex justify-between items-center text-[11px] text-white/50 border-b border-white/10 pb-2">
                      <span>SYSTEM ARCHITECTURE</span>
                      <span className="text-[#91A99B]">STABLE V4.8</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-white/40 block text-[9px]">ENGINE</span>
                        <span>Next.js &amp; Edge CDN</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">CLINICAL COMPLIANCE</span>
                        <span>HIPAA / NABH Aligned</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">APPOINTMENT FLOW</span>
                        <span>WhatsApp &amp; CRM Sync</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px]">ORGANIC DISCOVERY</span>
                        <span>Hyper-Local Schema</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="border border-white/10 p-3 bg-white/[0.02]">
                      <div className="font-heading text-xl font-bold text-white">100</div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">PERFORMANCE</div>
                    </div>
                    <div className="border border-white/10 p-3 bg-white/[0.02]">
                      <div className="font-heading text-xl font-bold text-[#91A99B]">0ms</div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">LAYOUT SHIFT</div>
                    </div>
                    <div className="border border-white/10 p-3 bg-white/[0.02]">
                      <div className="font-heading text-xl font-bold text-white">24/7</div>
                      <div className="text-[10px] font-mono text-white/50 mt-0.5">INTAKE AUTOMATION</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artwork Footer */}
              <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#91A99B]" />
                  Bespoke Architectural Engineering
                </span>
                <span className="font-mono text-[10px] text-white/40">INDIA · USA · UK · GLOBAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
