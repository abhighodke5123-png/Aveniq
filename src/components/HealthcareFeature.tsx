import React, { useState } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Phone,
  Search,
  User,
  Clock,
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { HEALTHCARE_FEATURES } from '../data/studioData';
import { useFirebaseStudio } from '../context/FirebaseContext';
import { OpdSlot } from '../types';

interface HealthcareFeatureProps {
  onStartHealthcareProject: () => void;
}

export const HealthcareFeature: React.FC<HealthcareFeatureProps> = ({
  onStartHealthcareProject,
}) => {
  const { submitOpdAppointment, opdAppointments } = useFirebaseStudio();
  const [selectedDepartment, setSelectedDepartment] = useState<'Cardiology' | 'Oncology' | 'Orthopedics' | 'Neurology'>('Cardiology');
  const [mockBookingSuccess, setMockBookingSuccess] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<OpdSlot>('10:30 AM');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');

  const departments = {
    Cardiology: {
      name: 'Cardiology & Vascular Sciences',
      leadDoctor: 'Dr. Arvind Mehta, MS, MCh',
      role: 'Chief Cardiothoracic Surgeon · 22+ Years Experience',
      highlight: 'Minimally invasive valve replacement & coronary bypass',
      opdDays: 'Mon, Wed, Fri (09:00 - 14:00)',
      badges: ['NABH Certified', 'Pediatric Cardiac Care'],
    },
    Oncology: {
      name: 'Comprehensive Cancer Care Center',
      leadDoctor: 'Dr. Sarah Sterling, MD, DNB',
      role: 'Senior Consultant Surgical Oncologist · 18+ Years',
      highlight: 'Targeted immunotherapy, robotic precision resections',
      opdDays: 'Tue, Thu, Sat (10:00 - 15:30)',
      badges: ['Molecular Tumor Board', 'Painless Chemotherapy Daycare'],
    },
    Orthopedics: {
      name: 'Orthopedics & Joint Reconstruction',
      leadDoctor: 'Dr. Kabir Anand, MS Ortho, FRCS',
      role: 'Director of Robotic Arthroplasty · 20+ Years',
      highlight: 'Sub-millimeter robotic total knee and hip replacement',
      opdDays: 'Mon to Thu (11:00 - 17:00)',
      badges: ['Sports Medicine Unit', 'Rapid Rehabilitation Protocol'],
    },
    Neurology: {
      name: 'Neurosciences & Stroke Institute',
      leadDoctor: 'Dr. Elena Rostova, MD, DM Neuro',
      role: 'Chair of Interventional Neurology · 16+ Years',
      highlight: '24/7 Hyperacute stroke thrombolysis & epilepsy monitoring',
      opdDays: 'Mon, Wed, Sat (09:30 - 14:30)',
      badges: ['Comprehensive Stroke Center', 'Neuro-ICU Dedicated Team'],
    },
  };

  const currentDept = departments[selectedDepartment];

  const handleSimulatedBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (patientName.trim().length < 2) return;
    await submitOpdAppointment({
      patientName: patientName.trim(),
      department: selectedDepartment,
      leadDoctor: currentDept.leadDoctor,
      preferredSlot: selectedSlot,
    });
    setMockBookingSuccess(true);
    setTimeout(() => {
      setMockBookingSuccess(false);
      setPatientName('');
    }, 4500);
  };

  return (
    <section
      id="healthcare"
      className="py-24 md:py-32 bg-[#17191D] text-[#F7F6F2] border-b border-[#252830] relative overflow-hidden"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-14 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-[#91A99B] rounded-full" />
              <span className="font-mono text-xs tracking-widest text-[#91A99B] uppercase font-bold">
                OUR SPECIALISATION — HEALTHCARE
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] max-w-3xl">
              Healthcare deserves a better digital experience.
            </h2>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-base text-white/70 leading-relaxed">
              We help hospitals, clinics and healthcare professionals create modern digital experiences that make it easier for patients to discover services, explore specialists and request appointments.
            </p>

            <button
              type="button"
              onClick={onStartHealthcareProject}
              className="inline-flex items-center gap-2 bg-[#F7F6F2] text-[#17191D] hover:bg-[#E5E2DC] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all"
            >
              <span>Explore Healthcare Solutions</span>
              <ArrowUpRight className="w-4 h-4 text-[#91A99B]" />
            </button>
          </div>
        </div>

        {/* Main Grid: Interactive Hospital Mockup + Feature Checklist */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Interactive Hospital Website Mockup */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-3 text-xs text-white/60 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                  Interactive Live Architecture Mockup
                </span>
              </div>

              {/* Viewport switch */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`px-2 py-0.5 text-[11px] flex items-center gap-1 transition-colors ${
                    viewportMode === 'desktop'
                      ? 'bg-white/15 text-white font-medium rounded'
                      : 'text-white/50 hover:text-white'
                  }`}
                  aria-label="Switch mockup to Desktop view"
                >
                  <Monitor className="w-3 h-3" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`px-2 py-0.5 text-[11px] flex items-center gap-1 transition-colors ${
                    viewportMode === 'mobile'
                      ? 'bg-white/15 text-white font-medium rounded'
                      : 'text-white/50 hover:text-white'
                  }`}
                  aria-label="Switch mockup to Mobile view"
                >
                  <Smartphone className="w-3 h-3" /> Mobile
                </button>
              </div>
            </div>

            {/* Browser Frame */}
            <div
              className={`transition-all duration-300 mx-auto bg-[#F7F6F2] text-[#17191D] rounded-lg shadow-2xl border border-white/20 overflow-hidden ${
                viewportMode === 'mobile' ? 'max-w-sm' : 'w-full'
              }`}
            >
              {/* Mockup Browser Chrome */}
              <div className="bg-[#EFECE6] px-4 py-2.5 border-b border-[#E5E2DC] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="font-mono text-[10px] text-[#777873] bg-[#F7F6F2] px-3 py-0.5 rounded border border-[#E5E2DC] max-w-xs truncate">
                  aurahospital.org/departments/{selectedDepartment.toLowerCase()}
                </div>
                <div className="text-[10px] font-mono text-[#2E4639] font-semibold bg-[#91A99B]/25 px-1.5 py-0.5 rounded">
                  NABH ACCREDITED
                </div>
              </div>

              {/* Mockup Hospital Top Bar */}
              <div className="bg-[#17191D] text-[#F7F6F2] px-4 py-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#91A99B]" />
                  <span className="font-heading font-bold tracking-wider">AURA HEALTHCARE</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <span className="hidden sm:inline">Emergency 24/7: 1800-419-2020</span>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#91A99B] hover:underline"
                  >
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Mockup Department Selector */}
              <div className="bg-white px-4 py-3 border-b border-[#E5E2DC] overflow-x-auto">
                <div className="text-[10px] font-mono text-[#777873] uppercase tracking-wider mb-2">
                  Select Department to Preview OPD &amp; Specialist Profile:
                </div>
                <div className="flex gap-2">
                  {(['Cardiology', 'Oncology', 'Orthopedics', 'Neurology'] as const).map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setMockBookingSuccess(false);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-none font-medium whitespace-nowrap transition-colors ${
                        selectedDepartment === dept
                          ? 'bg-[#17191D] text-white font-semibold'
                          : 'bg-[#F7F6F2] text-[#777873] hover:text-[#17191D] border border-[#E5E2DC]'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mockup Main Department Content */}
              <div className="p-5 sm:p-6 space-y-6">
                <div>
                  <div className="text-xs font-mono text-[#91A99B] font-semibold">
                    CLINICAL CENTRE OF EXCELLENCE
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#17191D]">
                    {currentDept.name}
                  </h3>
                  <p className="text-xs text-[#777873] mt-1">
                    {currentDept.highlight}
                  </p>
                </div>

                {/* Doctor Profile Card */}
                <div className="bg-white border border-[#E5E2DC] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-[#EAE8E1] border border-[#E5E2DC] flex items-center justify-center shrink-0 text-[#17191D]">
                      <User className="w-6 h-6 text-[#777873]" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-[#17191D]">
                        {currentDept.leadDoctor}
                      </div>
                      <div className="text-xs text-[#777873] mt-0.5">
                        {currentDept.role}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-[#2E4639] font-mono">
                        <Clock className="w-3 h-3 text-[#91A99B]" />
                        <span>OPD: {currentDept.opdDays}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-1.5 sm:text-right">
                    {currentDept.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-2 py-0.5 bg-[#91A99B]/15 text-[#2E4639] rounded font-semibold inline-block"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Interactive Appointment Request Simulation */}
                <div className="bg-[#F7F6F2] border border-[#E5E2DC] p-4 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-heading font-bold text-[#17191D] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#91A99B]" /> Instant OPD Appointment Request
                    </span>
                    <span className="text-[10px] font-mono text-[#777873]">
                      Verified Desk · {opdAppointments.length} Logged
                    </span>
                  </div>

                  {mockBookingSuccess ? (
                    <div className="bg-[#91A99B]/20 border border-[#91A99B] p-3 text-center text-xs text-[#17191D] rounded space-y-1 animate-fadeIn">
                      <div className="font-bold flex items-center justify-center gap-1 text-[#2E4639]">
                        <CheckCircle2 className="w-4 h-4 text-[#2E4639]" /> Request Logged for {selectedDepartment}
                      </div>
                      <p className="text-[11px] text-[#777873]">
                        Saved to Studio Portal (`opdAppointments`). Hospital desk receives automated WhatsApp &amp; SMS notification.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSimulatedBooking} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="mockup-patient-name"
                            className="text-[10px] font-mono uppercase text-[#777873] block mb-1"
                          >
                            Patient Name
                          </label>
                          <input
                            id="mockup-patient-name"
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#E5E2DC] focus:border-[#17191D] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="mockup-slot"
                            className="text-[10px] font-mono uppercase text-[#777873] block mb-1"
                          >
                            Preferred Slot
                          </label>
                          <select
                            id="mockup-slot"
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value as OpdSlot)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#E5E2DC] focus:border-[#17191D] focus:outline-none"
                          >
                            <option value="10:30 AM">Morning: 10:30 AM</option>
                            <option value="12:00 PM">Noon: 12:00 PM</option>
                            <option value="03:30 PM">Afternoon: 03:30 PM</option>
                            <option value="05:00 PM">Evening: 05:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 bg-[#17191D] text-white hover:bg-[#252830] py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          Request Consultation
                        </button>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-[#91A99B]/30 hover:bg-[#91A99B]/40 text-[#17191D] text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Instant WhatsApp Support"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#2E4639]" /> WhatsApp
                        </a>
                      </div>
                    </form>
                  )}
                </div>

                {/* Patient Triage & Trust Bar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5E2DC] text-[10px] font-mono text-[#777873]">
                  <div>✓ Cashless TPA Support</div>
                  <div>✓ NABH 5th Edition</div>
                  <div>✓ WhatsApp OPD Alerts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Healthcare Feature Checklist & Clinical Standards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white/[0.04] border border-white/10 rounded-sm">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#91A99B] mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                HEALTHCARE SPECIALISATION SUITE
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Built specifically for clinical trust and patient ease.
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Hospital websites must reassure anxious families while guiding them swiftly to the correct specialist doctor. We replace chaotic legacy portals with serene, high-converting digital care pathways.
              </p>
            </div>

            {/* 8 Feature Blocks */}
            <div className="space-y-3">
              {HEALTHCARE_FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white/[0.02] border border-white/10 hover:border-[#91A99B]/50 transition-colors flex items-start gap-3 rounded-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#91A99B]/20 text-[#91A99B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Specialisation CTA Box */}
            <div className="p-6 bg-[#91A99B]/10 border border-[#91A99B]/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#91A99B] uppercase font-mono">
                  Have a Hospital or Clinic Project?
                </div>
                <div className="text-xs text-white/70 mt-0.5">
                  We schedule a 30-min strategy review of your current patient acquisition funnel.
                </div>
              </div>
              <button
                type="button"
                onClick={onStartHealthcareProject}
                className="shrink-0 bg-white text-[#17191D] hover:bg-[#E5E2DC] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Schedule Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
