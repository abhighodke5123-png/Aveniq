import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/studioData';
import { ServiceItem, ServiceCategory } from '../types';
import { ArrowUpRight, Check, ShieldCheck, Zap, Layers, Cpu, Globe, Palette, TrendingUp, Server, HelpCircle, ChevronDown } from 'lucide-react';
import { PageId } from '../utils/router';

interface ServicesPageProps {
  onNavigate: (page: PageId) => void;
  onSelectServiceModal: (service: ServiceItem) => void;
  onInitiateServiceInquiry: (serviceName: ServiceCategory) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectServiceModal,
  onInitiateServiceInquiry,
}) => {
  const [activeServiceId, setActiveServiceId] = useState<string>(SERVICES_DATA[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getServiceCategoryName = (id: string): ServiceCategory => {
    switch (id) {
      case 'digital-experiences':
        return 'Hospital Website';
      case 'brand-creative':
        return 'Website Redesign';
      case 'search-growth':
        return 'SEO & Digital Growth';
      case 'ai-automation':
        return 'AI & Automation';
      case 'digital-infrastructure':
        return 'Business Website';
      default:
        return 'Business Website';
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'digital-experiences':
        return <Globe className="w-5 h-5" />;
      case 'brand-creative':
        return <Palette className="w-5 h-5" />;
      case 'search-growth':
        return <TrendingUp className="w-5 h-5" />;
      case 'ai-automation':
        return <Cpu className="w-5 h-5" />;
      case 'digital-infrastructure':
        return <Server className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const faqs = [
    {
      q: 'Do you use pre-made WordPress or Webflow templates?',
      a: 'Never. Every AVENIQ digital experience is custom designed in Figma from first principles and built with modern frameworks (React, Next.js, TypeScript, Tailwind CSS) for unmatched speed, clean architecture, and 100/100 Core Web Vitals.',
    },
    {
      q: 'How does AVENIQ handle clinical & hospital website compliance?',
      a: 'We design doctor directories, appointment pipelines, and patient data flows in strict alignment with NABH, HIPAA, and healthcare privacy guidelines, ensuring zero patient data leakage and seamless WhatsApp OPD alerts.',
    },
    {
      q: 'Who owns the codebase and designs upon completion?',
      a: 'You do. 100% full intellectual property, source code, Figma design files, and deployment accounts are transferred to your organisation upon final delivery.',
    },
    {
      q: 'How do you collaborate across international time zones (India, USA, UK, Australia)?',
      a: 'We employ an asynchronous communication cadence with weekly executive strategy sprints, dedicated WhatsApp coordination desks, and milestone progress reviews accommodated to your local working hours.',
    },
  ];

  const currentActive = SERVICES_DATA.find((s) => s.id === activeServiceId) || SERVICES_DATA[0];

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Breadcrumb / Navigation Badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#91A99B] font-bold">PAGE 02 // SERVICES</span>
          <span className="text-[#E5E2DC]">/</span>
          <span className="font-mono text-xs text-[#777873] uppercase">Studio Capabilities</span>
        </div>

        {/* Dedicated Page Hero */}
        <div className="max-w-4xl pb-14 border-b border-[#E5E2DC]">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight leading-[1.08]">
            Everything your business needs to grow digitally.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
            Five modular capabilities engineered for commercial visibility, clinical trust, and high-performance operations across international markets.
          </p>
        </div>

        {/* Service Switcher Tabs */}
        <div className="mt-12 flex flex-wrap gap-2 pb-6 border-b border-[#E5E2DC]">
          {SERVICES_DATA.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => setActiveServiceId(srv.id)}
              className={`flex items-center gap-2.5 px-5 py-3 text-xs font-mono uppercase tracking-wider transition-all border ${
                activeServiceId === srv.id
                  ? 'bg-[#17191D] text-[#F7F6F2] border-[#17191D] font-bold shadow-sm'
                  : 'bg-white text-[#777873] border-[#E5E2DC] hover:text-[#17191D] hover:border-[#17191D]/40'
              }`}
            >
              <span className={activeServiceId === srv.id ? 'text-[#91A99B]' : 'text-[#777873]'}>
                {srv.number}
              </span>
              <span>{srv.title}</span>
            </button>
          ))}
        </div>

        {/* Active In-Depth Capability Showcase Card */}
        <div className="mt-8 bg-white border border-[#E5E2DC] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Scope & Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#17191D] text-[#91A99B] flex items-center justify-center">
                  {getIcon(currentActive.id)}
                </div>
                <div>
                  <span className="font-mono text-xs text-[#91A99B] font-bold">
                    CAPABILITY {currentActive.number}
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D]">
                    {currentActive.title}
                  </h2>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#17191D]/80 leading-relaxed font-medium">
                {currentActive.tagline}
              </p>

              <p className="text-sm text-[#777873] leading-relaxed">
                {currentActive.description}
              </p>

              {/* Standard Scope & Deliverables Checklist */}
              <div className="pt-4 border-t border-[#E5E2DC]">
                <h3 className="font-heading font-bold text-sm text-[#17191D] mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#91A99B]" />
                  What We Deliver Under {currentActive.title}:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentActive.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#17191D]">
                      <div className="w-4 h-4 rounded-full bg-[#91A99B]/20 text-[#2E4639] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#2E4639]" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Technical Architecture & Action */}
            <div className="lg:col-span-5 bg-[#F7F6F2] border border-[#E5E2DC] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#777873] font-bold mb-1">
                    Ideal Fit For:
                  </div>
                  <p className="text-xs text-[#17191D] leading-relaxed font-medium">
                    {currentActive.idealFor}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E2DC]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#777873] font-bold mb-2">
                    Engineered With:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentActive.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-1 bg-white border border-[#E5E2DC] text-[#17191D] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E2DC] space-y-1.5 text-xs text-[#777873]">
                  <div className="flex items-center gap-2 text-[#17191D] font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#91A99B]" />
                    <span>Guaranteed 100/100 Core Web Vitals</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#17191D] font-medium">
                    <Zap className="w-4 h-4 text-[#91A99B]" />
                    <span>Sub-0.6s Global Time-to-Interactive</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E5E2DC] space-y-3">
                <button
                  type="button"
                  onClick={() => onInitiateServiceInquiry(getServiceCategoryName(currentActive.id))}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] active:scale-95 py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>Inquire About {currentActive.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectServiceModal(currentActive)}
                  className="w-full text-xs font-semibold text-[#777873] hover:text-[#17191D] py-2 text-center transition-colors"
                >
                  Inspect Full Deliverable Matrix Modal ↗
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All 5 Services Grid Cards Overview */}
        <div className="mt-20">
          <div className="flex items-center justify-between pb-6 border-b border-[#E5E2DC]">
            <h3 className="font-heading text-2xl font-bold text-[#17191D]">
              All Five Studio Pillars at a Glance
            </h3>
            <span className="text-xs font-mono text-[#777873]">5 Capabilities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {SERVICES_DATA.map((srv) => (
              <div
                key={srv.id}
                onClick={() => {
                  setActiveServiceId(srv.id);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`p-6 border transition-all cursor-pointer flex flex-col justify-between min-h-[260px] ${
                  activeServiceId === srv.id
                    ? 'border-[#17191D] bg-[#EAE8E1]/40 shadow-sm'
                    : 'border-[#E5E2DC] bg-white hover:border-[#17191D]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#91A99B]">
                      {srv.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#E5E2DC]/50 flex items-center justify-center text-[#17191D]">
                      {getIcon(srv.id)}
                    </div>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-[#17191D] mb-2">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-[#777873] leading-relaxed line-clamp-3">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E2DC] flex items-center justify-between text-xs font-semibold text-[#17191D]">
                  <span>View Scope</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#91A99B]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Models & Tiers */}
        <div className="mt-24 p-8 sm:p-12 bg-[#17191D] text-[#F7F6F2] border border-[#17191D]">
          <div className="max-w-2xl mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#91A99B] font-bold block mb-2">
              ENGAGEMENT ARCHITECTURE
            </span>
            <h3 className="font-heading text-3xl font-extrabold text-white">
              Two transparent ways ambitious businesses partner with AVENIQ.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Model 1: Fixed Scope Project Sprints */}
            <div className="p-6 bg-white/5 border border-white/10 rounded space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#91A99B] font-bold">MODEL 01</span>
                <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-white/80">
                  Fixed Milestone
                </span>
              </div>
              <h4 className="font-heading text-xl font-bold text-white">
                Turnkey Website &amp; Portal Sprints
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Ideal for hospitals, clinics, property developers, and companies requiring a complete new digital presence, clinical appointment portal, or total re-platforming.
              </p>
              <ul className="space-y-2 text-xs text-white/80 pt-2">
                <li className="flex items-center gap-2">✓ Fixed pricing, guaranteed delivery timeline</li>
                <li className="flex items-center gap-2">✓ Full Figma design system + custom TypeScript code</li>
                <li className="flex items-center gap-2">✓ Turnaround typically 4 to 8 weeks</li>
              </ul>
            </div>

            {/* Model 2: Dedicated Studio Partnership */}
            <div className="p-6 bg-white/5 border border-white/10 rounded space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#91A99B] font-bold">MODEL 02</span>
                <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-white/80">
                  Dedicated Retainer
                </span>
              </div>
              <h4 className="font-heading text-xl font-bold text-white">
                Continuous Studio Partnership
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                For expanding hospital networks, hotel groups, and scaling enterprises requiring ongoing landing page optimization, technical SEO, AI workflows, and dedicated uptime support.
              </p>
              <ul className="space-y-2 text-xs text-white/80 pt-2">
                <li className="flex items-center gap-2">✓ Dedicated senior design &amp; engineering capacity</li>
                <li className="flex items-center gap-2">✓ Monthly CRO, SEO rankings, and feature sprints</li>
                <li className="flex items-center gap-2">✓ 24/7 priority incident response SLA</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/60">
              Need a bespoke scope for a hospital network or custom platform?
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 bg-[#F7F6F2] text-[#17191D] hover:bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Schedule Strategy Call</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
            </button>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-24 max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#91A99B]" />
            <span className="font-mono text-xs text-[#777873] uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h3 className="font-heading text-3xl font-extrabold text-[#17191D] mb-8">
            Clear answers about our studio process.
          </h3>

          <div className="divide-y divide-[#E5E2DC] border-t border-b border-[#E5E2DC]">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-base sm:text-lg font-heading font-bold text-[#17191D] hover:text-[#91A99B] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#777873] transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#17191D]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-[#777873] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
