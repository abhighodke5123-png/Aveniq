import React from 'react';
import { ArrowUpRight, MessageSquare, ShieldCheck, Mail } from 'lucide-react';
import { STUDIO_META } from '../data/studioData';

interface FinalCtaProps {
  onStartProject: () => void;
  onOpenDirectChat?: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onStartProject,
  onOpenDirectChat,
}) => {
  return (
    <section className="py-24 md:py-36 bg-[#17191D] text-[#F7F6F2] relative overflow-hidden border-b border-[#252830]">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '90px 90px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#91A99B]" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/70">
              INITIATE COLLABORATION
            </span>
          </div>

          {/* Oversized Headline */}
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06]">
            Your next digital chapter starts here.
          </h2>

          {/* Supporting Copy */}
          <p className="mt-8 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
            Have a business, idea or project in mind? Let's create something meaningful together.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onStartProject}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#F7F6F2] text-[#17191D] hover:bg-white active:scale-[0.98] transition-all px-9 py-4 text-xs font-bold tracking-widest uppercase group border border-white"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>

            <a
              href={`https://wa.me/${STUDIO_META.whatsappNumber}?text=${encodeURIComponent(
                "Hello AVENIQ Studio, I would like to discuss our upcoming digital project."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98] transition-all px-9 py-4 text-xs font-bold tracking-widest uppercase border border-white/20 group"
            >
              <MessageSquare className="w-4 h-4 text-[#91A99B]" />
              <span>Let's Talk</span>
            </a>
          </div>

          {/* Studio Reassurance Note */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50 font-mono">
            <span>Direct Principal Engineer Review</span>
            <span>·</span>
            <span>Guaranteed Non-Disclosure</span>
            <span>·</span>
            <span>International Delivery Standards</span>
          </div>
        </div>
      </div>
    </section>
  );
};
