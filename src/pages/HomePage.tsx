import React from 'react';
import { Hero } from '../components/Hero';
import { Introduction } from '../components/Introduction';
import { HealthcareFeature } from '../components/HealthcareFeature';
import { ServicesSection } from '../components/ServicesSection';
import { IndustriesSection } from '../components/IndustriesSection';
import { SelectedWork } from '../components/SelectedWork';
import { WhyAveniq } from '../components/WhyAveniq';
import { ProcessSection } from '../components/ProcessSection';
import { FinalCta } from '../components/FinalCta';
import { ConceptProject, ServiceItem } from '../types';
import { PageId } from '../utils/router';
import { ArrowRight, Layers, Building, FolderKanban } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onSelectProject: (project: ConceptProject) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProject,
  onSelectService,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <Hero
        onStartProject={() => onNavigate('contact')}
        onExploreWork={() => onNavigate('work')}
        onExploreHealthcare={() => {
          const el = document.getElementById('healthcare');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Introduction & Pillars */}
      <Introduction />

      {/* Quick Page Jump Banner: Services & Industries */}
      <div className="bg-[#EFECE6] border-b border-[#E5E2DC] py-6">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#777873] uppercase tracking-wider">
            Dedicated Studio Sections:
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E5E2DC] hover:border-[#17191D] text-xs font-semibold text-[#17191D] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#91A99B]" />
              <span>Explore All 5 Capabilities</span>
              <ArrowRight className="w-3 h-3 text-[#777873]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('industries')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#E5E2DC] hover:border-[#17191D] text-xs font-semibold text-[#17191D] transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-[#91A99B]" />
              <span>Explore 6 Target Industries</span>
              <ArrowRight className="w-3 h-3 text-[#777873]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('work')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] text-xs font-semibold transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#91A99B]" />
              <span>View 6 Concept Studies</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Featured Healthcare (Flagship Specialisation) */}
      <HealthcareFeature
        onStartHealthcareProject={() => onNavigate('contact')}
      />

      {/* 4. Services Preview */}
      <ServicesSection
        onSelectService={onSelectService}
        onStartProjectForService={() => onNavigate('contact')}
      />

      {/* 5. Industries Preview */}
      <IndustriesSection
        onSelectHealthcare={() => {
          const el = document.getElementById('healthcare');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onStartProjectForIndustry={() => onNavigate('contact')}
      />

      {/* 6. Selected Work (AVENIQ Concept Projects) */}
      <SelectedWork onSelectProject={onSelectProject} />

      {/* 7. Why AVENIQ */}
      <WhyAveniq />

      {/* 8. Process */}
      <ProcessSection />

      {/* 9. Final CTA */}
      <FinalCta
        onStartProject={() => onNavigate('contact')}
      />
    </div>
  );
};
