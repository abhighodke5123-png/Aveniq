import React, { useState } from 'react';
import { INDUSTRIES_DATA } from '../data/studioData';
import { HealthcareFeature } from '../components/HealthcareFeature';
import { IndustryItem, ServiceCategory } from '../types';
import { PageId } from '../utils/router';
import { ArrowUpRight, Check, HeartPulse, Building2, UtensilsCrossed, GraduationCap, Briefcase, Rocket, ShieldCheck, Compass } from 'lucide-react';

interface IndustriesPageProps {
  onNavigate: (page: PageId) => void;
  onInitiateIndustryInquiry: (serviceName: ServiceCategory) => void;
}

export const IndustriesPage: React.FC<IndustriesPageProps> = ({
  onNavigate,
  onInitiateIndustryInquiry,
}) => {
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('healthcare');

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

  const sectorDeepDives: Record<string, {
    coreChallenge: string;
    aveniqSolution: string;
    keyDeliverables: string[];
    recommendedService: ServiceCategory;
  }> = {
    healthcare: {
      coreChallenge:
        'Legacy hospital websites overwhelm patients with chaotic menus, broken doctor directories, and clinical jargon that induces anxiety.',
      aveniqSolution:
        'We engineer tranquil, architectural care portals with sub-second doctor search, one-click OPD schedule requests, and instant WhatsApp triage desk routing.',
      keyDeliverables: [
        'Doctor credential & OPD schedule engine',
        'Clinical Department & procedure care guides',
        'Direct WhatsApp triage and emergency hotline bar',
        'Multi-location hyper-local SEO optimization',
        'NABH 5th Edition & HIPAA alignment',
      ],
      recommendedService: 'Hospital Website',
    },
    hospitality: {
      coreChallenge:
        'High OTA commission fees (15-25% to Booking.com/Expedia) and generic templates that fail to convey architectural atmosphere and culinary craft.',
      aveniqSolution:
        'We design immersive editorial websites with full-viewport visual storytelling, room-specific walkthroughs, direct reservation engines, and interactive dining menus.',
      keyDeliverables: [
        'Commission-free direct booking engine integration',
        'Seasonal degustation & cocktail menu showcases',
        'VIP concierge and private event booking pathways',
        'High-DPI responsive architectural photography layouts',
      ],
      recommendedService: 'Business Website',
    },
    'real-estate': {
      coreChallenge:
        'Bland property portals fail to attract ultra-high-net-worth investors or communicate architectural craftsmanship and location desirability.',
      aveniqSolution:
        'We craft high-concept digital showrooms featuring interactive penthouse floorplan viewers, neighborhood amenity maps, and private showing qualification funnels.',
      keyDeliverables: [
        'Interactive floorplan & elevation navigators',
        'Architectural monograph brochure instant downloads',
        'Private VIP sales gallery viewing scheduler',
        'Investor lead qualification & CRM synchronization',
      ],
      recommendedService: 'Business Website',
    },
    education: {
      coreChallenge:
        'Confusing academic structures, buried fee information, and friction-filled application forms that discourage international prospective students.',
      aveniqSolution:
        'Clear academic program finders, faculty research showcases, campus tour schedulers, and multi-lingual admissions pipelines.',
      keyDeliverables: [
        'Degree & curriculum program navigators',
        'Admissions inquiry and campus visit scheduler',
        'Accreditation and placement outcome archives',
        'Multi-lingual international student portal',
      ],
      recommendedService: 'Business Website',
    },
    'professional-services': {
      coreChallenge:
        'Outdated corporate websites that look indistinguishable from competitors and fail to establish quiet authority with corporate decision-makers.',
      aveniqSolution:
        'Editorial typography, insightful thought leadership publishing, senior partner case archives, and secure consultation dispatch.',
      keyDeliverables: [
        'Partner bio directories & legal/financial deal archives',
        'Thought leadership & whitepaper publishing engine',
        'Confidential client intake and appointment dispatch',
        'Institutional regulatory and compliance presentation',
      ],
      recommendedService: 'Business Website',
    },
    'startups-retail': {
      coreChallenge:
        'Slow page speeds, confusing SaaS product explanations, and clunky e-commerce checkouts that bleed prospective users.',
      aveniqSolution:
        'High-velocity product storytelling, interactive API/feature playgrounds, friction-free checkout orchestration, and sub-0.6s global load times.',
      keyDeliverables: [
        'Interactive feature & latency benchmark playgrounds',
        'Enterprise security & SOC2 compliance showcases',
        'High-conversion checkout & payment workflows',
        'Modern headless CMS and self-serve developer sandboxes',
      ],
      recommendedService: 'E-commerce Website',
    },
  };

  const currentSector = sectorDeepDives[selectedIndustryId] || sectorDeepDives['healthcare'];
  const currentIndustry = INDUSTRIES_DATA.find((i) => i.id === selectedIndustryId) || INDUSTRIES_DATA[0];

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#91A99B] font-bold">PAGE 03 // INDUSTRIES</span>
          <span className="text-[#E5E2DC]">/</span>
          <span className="font-mono text-xs text-[#777873] uppercase">Sector Specialisations</span>
        </div>

        {/* Dedicated Page Hero */}
        <div className="max-w-4xl pb-14 border-b border-[#E5E2DC]">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight leading-[1.08]">
            Different industries. One digital standard.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
            We operate across six specialized sectors, combining deep domain user behavior with architectural aesthetics and relentless conversion discipline.
          </p>
        </div>

        {/* Industry Selector Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDUSTRIES_DATA.map((ind) => {
            const isSelected = selectedIndustryId === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedIndustryId(ind.id)}
                className={`p-4 border text-left transition-all flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'border-[#17191D] bg-[#17191D] text-white shadow-md'
                    : 'border-[#E5E2DC] bg-white text-[#17191D] hover:border-[#17191D]/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-white/10 text-[#91A99B]' : 'bg-[#EAE8E1] text-[#17191D]'
                  }`}>
                    {getIndustryIcon(ind.id)}
                  </div>
                  {ind.id === 'healthcare' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#91A99B]" />
                  )}
                </div>

                <div className="mt-3">
                  <div className="font-heading text-sm font-bold leading-tight">
                    {ind.title}
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-white/60' : 'text-[#777873]'}`}>
                    {ind.accentMetric}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sector Deep Dive Container */}
        <div className="mt-8 bg-white border border-[#E5E2DC] p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E5E2DC]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#17191D] text-[#91A99B] flex items-center justify-center shrink-0">
                {getIndustryIcon(selectedIndustryId)}
              </div>
              <div>
                <span className="font-mono text-xs text-[#91A99B] font-bold uppercase">
                  SECTOR PROFILE // {currentIndustry.accentMetric}
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-[#17191D]">
                  {currentIndustry.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onInitiateIndustryInquiry(currentSector.recommendedService)}
              className="inline-flex items-center gap-2 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all self-start lg:self-auto"
            >
              <span>Discuss {currentIndustry.title} Project</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
            </button>
          </div>

          {/* Challenge vs Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="p-6 bg-red-50/40 border border-red-100 rounded space-y-2">
              <div className="text-[11px] font-mono text-red-600 font-bold uppercase">
                The Industry Problem:
              </div>
              <p className="text-sm text-[#17191D]/80 leading-relaxed">
                {currentSector.coreChallenge}
              </p>
            </div>

            <div className="p-6 bg-[#91A99B]/15 border border-[#91A99B]/30 rounded space-y-2">
              <div className="text-[11px] font-mono text-[#2E4639] font-bold uppercase">
                The AVENIQ Standard:
              </div>
              <p className="text-sm text-[#17191D] leading-relaxed font-medium">
                {currentSector.aveniqSolution}
              </p>
            </div>
          </div>

          {/* Sector Deliverables */}
          <div className="mt-8 pt-6 border-t border-[#E5E2DC]">
            <h3 className="font-heading font-bold text-base text-[#17191D] mb-4">
              Core Engineering Deliverables for {currentIndustry.title}:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentSector.keyDeliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#17191D] bg-[#F7F6F2] p-3 border border-[#E5E2DC]">
                  <Check className="w-4 h-4 text-[#91A99B] shrink-0 mt-0.5" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded Featured Healthcare Flagship */}
        <div className="mt-20">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-[#91A99B] font-bold uppercase">
                FLAGSHIP SPECIALITY
              </span>
              <h3 className="font-heading text-2xl font-bold text-[#17191D]">
                Healthcare Specialisation Architecture
              </h3>
            </div>
            <span className="text-xs font-mono text-[#777873]">Hospital &amp; Clinic Portals</span>
          </div>

          <HealthcareFeature
            onStartHealthcareProject={() => onInitiateIndustryInquiry('Hospital Website')}
          />
        </div>
      </div>
    </div>
  );
};
