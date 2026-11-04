import React from 'react';
import { ArrowUpRight, Globe, Palette, TrendingUp, Cpu, Server } from 'lucide-react';
import { SERVICES_DATA } from '../data/studioData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onStartProjectForService?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onStartProjectForService,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'digital-experiences':
        return <Globe className="w-5 h-5 text-[#17191D]" />;
      case 'brand-creative':
        return <Palette className="w-5 h-5 text-[#17191D]" />;
      case 'search-growth':
        return <TrendingUp className="w-5 h-5 text-[#17191D]" />;
      case 'ai-automation':
        return <Cpu className="w-5 h-5 text-[#17191D]" />;
      case 'digital-infrastructure':
        return <Server className="w-5 h-5 text-[#17191D]" />;
      default:
        return <Globe className="w-5 h-5 text-[#17191D]" />;
    }
  };

  return (
    <section id="services" className="py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E5E2DC]">
          <div>
            <span className="font-mono text-xs text-[#777873] uppercase tracking-widest block mb-3">
              WHAT WE DO
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight">
              Everything your business needs to grow digitally.
            </h2>
          </div>

          <p className="text-sm text-[#777873] max-w-md font-normal leading-relaxed">
            From hospital web platforms and corporate redesigns to intelligent lead automation, we provide the complete digital capability your business requires.
          </p>
        </div>

        {/* 5 Premium Service Blocks */}
        <div className="divide-y divide-[#E5E2DC]">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="group py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer hover:bg-[#EFECE6]/50 transition-colors px-4 -mx-4 rounded-sm"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectService(service);
                }
              }}
              aria-label={`View details for ${service.title}`}
            >
              {/* Number and Icon */}
              <div className="flex items-center gap-6 lg:w-1/4">
                <span className="font-mono text-base font-bold text-[#777873] group-hover:text-[#17191D] transition-colors">
                  {service.number}
                </span>
                <div className="w-10 h-10 rounded-full border border-[#E5E2DC] bg-[#F7F6F2] flex items-center justify-center group-hover:border-[#91A99B] group-hover:bg-[#91A99B]/10 transition-all">
                  {getIcon(service.id)}
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#17191D] group-hover:text-[#17191D] transition-colors">
                  {service.title}
                </h3>
              </div>

              {/* Description */}
              <div className="lg:w-1/2">
                <p className="text-base text-[#777873] group-hover:text-[#17191D]/80 leading-relaxed transition-colors">
                  {service.description}
                </p>

                {/* Deliverables snippet */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.deliverables.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-2 py-0.5 bg-[#E5E2DC]/50 text-[#17191D]/70 rounded"
                    >
                      {item}
                    </span>
                  ))}
                  {service.deliverables.length > 3 && (
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-transparent text-[#777873]">
                      +{service.deliverables.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action / Trigger */}
              <div className="lg:w-1/4 flex items-center lg:justify-end gap-3 pt-2 lg:pt-0">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#17191D] group-hover:text-[#2E4639] transition-colors">
                  Explore Scope
                </span>
                <div className="w-8 h-8 rounded-full border border-[#E5E2DC] group-hover:border-[#17191D] group-hover:bg-[#17191D] group-hover:text-[#F7F6F2] flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-4 h-4 text-[#777873] group-hover:text-[#91A99B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
