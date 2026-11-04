import React from 'react';
import { ContactSection } from '../components/ContactSection';
import { ServiceCategory } from '../types';
import { PageId } from '../utils/router';
import { STUDIO_META } from '../data/studioData';
import { MessageSquare, Mail, ShieldCheck, Clock, MapPin, ArrowUpRight } from 'lucide-react';

interface ContactPageProps {
  initialService?: ServiceCategory;
  onNavigate: (page: PageId) => void;
  onOpenPortal?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialService = 'Hospital Website',
  onNavigate,
  onOpenPortal,
}) => {
  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#F7F6F2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Page Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs text-[#91A99B] font-bold">PAGE 06 // CONTACT</span>
          <span className="text-[#E5E2DC]">/</span>
          <span className="font-mono text-xs text-[#777873] uppercase">Start a Project</span>
        </div>

        {/* Dedicated Page Hero */}
        <div className="max-w-4xl pb-12 border-b border-[#E5E2DC]">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17191D] tracking-tight leading-[1.08]">
            Tell us about your next ambition.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#777873] font-normal leading-relaxed max-w-2xl">
            Whether you are planning a quaternary hospital web platform, a luxury hospitality showcase, or a total brand redesign, our senior engineering leads respond within 24 business hours.
          </p>
        </div>

        {/* Studio Direct Response Guarantees */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 border-b border-[#E5E2DC]">
          <div className="p-4 bg-white border border-[#E5E2DC] flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#91A99B]" />
            <div>
              <div className="font-heading font-bold text-xs text-[#17191D]">
                24-Hour Review Turnaround
              </div>
              <div className="text-[11px] text-[#777873]">Direct review by Studio Principals</div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E2DC] flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#91A99B]" />
            <div>
              <div className="font-heading font-bold text-xs text-[#17191D]">
                Strict Mutual NDA
              </div>
              <div className="text-[11px] text-[#777873]">Total confidentiality guaranteed</div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E2DC] flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#91A99B]" />
            <div>
              <div className="font-heading font-bold text-xs text-[#17191D]">
                International Delivery
              </div>
              <div className="text-[11px] text-[#777873]">India · US · UK · Australia · Global</div>
            </div>
          </div>
        </div>

        {/* Embedded Complete Enquiry Form Section */}
        <div className="mt-12">
          <ContactSection
            key={initialService}
            initialService={initialService}
            hideHeader={true}
            embedded={true}
            onOpenPortal={onOpenPortal}
          />
        </div>

        {/* Alternate Quick Links */}
        <div className="mt-20 p-8 bg-[#EFECE6] border border-[#E5E2DC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-[#777873]">
            Looking for something else? Explore our full work archive or capabilities.
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onNavigate('work')}
              className="text-xs font-bold text-[#17191D] hover:text-[#91A99B] underline"
            >
              Browse 6 Concept Studies →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="text-xs font-bold text-[#17191D] hover:text-[#91A99B] underline"
            >
              View All 5 Services →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
