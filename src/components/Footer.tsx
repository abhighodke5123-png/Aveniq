import React from 'react';
import { BrandMonogram } from './BrandMonogram';
import { STUDIO_META } from '../data/studioData';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { PageId } from '../utils/router';

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigatePage: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onNavigatePage }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { name: string; page: PageId; number: string }[] = [
    { name: 'Home', page: 'home', number: '01' },
    { name: 'Services & Capabilities', page: 'services', number: '02' },
    { name: 'Industries & Sectors', page: 'industries', number: '03' },
    { name: 'Selected Work & Concepts', page: 'work', number: '04' },
    { name: 'About & Philosophy', page: 'about', number: '05' },
    { name: 'Start a Project', page: 'contact', number: '06' },
  ];

  return (
    <footer className="bg-[#17191D] text-[#F7F6F2] pt-20 pb-12 border-t border-[#252830]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <BrandMonogram size={32} dark={true} />
              <div>
                <span className="font-heading text-xl font-extrabold tracking-widest text-white uppercase block leading-none">
                  AVENIQ
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 mt-1 block">
                  Digital Experience Studio
                </span>
              </div>
            </div>

            <p className="font-heading text-lg text-white/80 max-w-sm font-medium">
              {STUDIO_META.tagline}
            </p>

            <p className="text-xs text-white/50 leading-relaxed max-w-md">
              AVENIQ helps ambitious healthcare institutions and commercial enterprises transform their digital presence through bespoke design, high-performance engineering, intelligent automation, and measurable search growth.
            </p>

            <div className="pt-2 text-xs font-mono text-[#91A99B]">
              Operating across India, United States, United Kingdom, Australia, Canada &amp; International markets.
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40 font-semibold mb-4">
              Dedicated Pages
            </div>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigatePage(item.page);
                      scrollToTop();
                    }}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group text-left"
                  >
                    <span className="font-mono text-[10px] text-[#91A99B] font-bold">{item.number}</span>
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#91A99B]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Channels / Configurable Placeholders */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono uppercase tracking-widest text-white/40 font-semibold mb-4">
              Direct Channels
            </div>

            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${STUDIO_META.contactEmail}`}
                className="block p-3 bg-white/5 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-colors"
              >
                <div className="text-[10px] font-mono text-white/40 uppercase">Studio Email</div>
                <div className="font-semibold mt-0.5">{STUDIO_META.contactEmail}</div>
              </a>

              <a
                href={`https://wa.me/${STUDIO_META.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="block p-3 bg-white/5 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-colors"
              >
                <div className="text-[10px] font-mono text-white/40 uppercase">WhatsApp Coordination Desk</div>
                <div className="font-semibold text-[#91A99B] mt-0.5">+91 98765 43210 (Studio Direct)</div>
              </a>

              {/* Social Channels with placeholders */}
              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-white/60">
                <a
                  href="https://linkedin.com/company/aveniq-studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <span>·</span>
                <a
                  href="https://instagram.com/aveniq.studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <span>·</span>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors underline"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            © {currentYear} AVENIQ. All rights reserved. Designed to move business forward.
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                onNavigatePage('admin');
                scrollToTop();
              }}
              className="hover:text-white transition-colors"
            >
              Admin Command Centre
            </button>

            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors"
            >
              Privacy &amp; Data Governance
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
