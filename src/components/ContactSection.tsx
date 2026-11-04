import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  MessageCircle,
  Mail,
  ShieldCheck,
  ChevronDown,
  Code2,
  Cloud,
  LogIn,
} from 'lucide-react';
import { EnquiryFormData, ServiceCategory, StoredEnquiryRecord } from '../types';
import { validateEnquiryForm, generateWhatsAppEnquiryUrl } from '../utils/enquiryValidation';
import { STUDIO_META } from '../data/studioData';
import { useFirebaseStudio } from '../context/FirebaseContext';

const SERVICE_OPTIONS: ServiceCategory[] = [
  'Hospital Website',
  'Clinic Website',
  'Business Website',
  'E-commerce Website',
  'Website Redesign',
  'SEO & Digital Growth',
  'AI & Automation',
  'Other',
];

const BUDGET_OPTIONS = [
  'Under $10,000 (₹5L - ₹8L)',
  '$10,000 - $25,000 (₹8L - ₹20L)',
  '$25,000 - $50,000 (₹20L - ₹40L)',
  '$50,000+ (Enterprise / Hospital Network)',
];

interface ContactSectionProps {
  initialService?: ServiceCategory;
  hideHeader?: boolean;
  embedded?: boolean;
  onOpenPortal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService,
  hideHeader = false,
  embedded = false,
  onOpenPortal,
}) => {
  const { user, signInWithGoogle, submitEnquiry, enquiries } = useFirebaseStudio();

  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    country: '',
    interestedService: initialService || 'Hospital Website',
    budgetRange: '$10,000 - $25,000 (₹8L - ₹20L)',
    timeline: '1-3 months',
    projectDescription: '',
  });

  React.useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, interestedService: initialService }));
    }
  }, [initialService]);

  // Honeypot for spam protection
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<StoredEnquiryRecord | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showIntegrationDetails, setShowIntegrationDetails] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam check
    if (honeypot) {
      console.warn('Spam detected via honeypot.');
      return;
    }

    const validation = validateEnquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstErrorKey = Object.keys(validation.errors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const savedRecord = await submitEnquiry(formData);
      setSubmittedData(savedRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPayload = () => {
    if (!submittedData) return;
    navigator.clipboard.writeText(JSON.stringify(submittedData, null, 2));
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  const handleDownloadPayload = () => {
    if (!submittedData) return;
    const blob = new Blob([JSON.stringify(submittedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aveniq-project-enquiry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="contact"
      className={
        embedded
          ? 'bg-[#F7F6F2]'
          : 'py-24 md:py-32 border-b border-[#E5E2DC] bg-[#F7F6F2]'
      }
    >
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-12'}>
        {/* Section Header */}
        {!hideHeader && (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-[#E5E2DC] mb-12">
            <div>
              <span className="font-mono text-xs text-[#777873] uppercase tracking-widest block mb-3">
                START A PROJECT
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17191D] tracking-tight">
                Tell us about your next ambition.
              </h2>
            </div>

            <p className="text-sm text-[#777873] max-w-md leading-relaxed">
              Every submission is reviewed by our engineering and design leads. We reply within 24 business hours with an initial project perspective.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Communication Info & Trust Marks */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#17191D] mb-2">
                  Direct Studio Access
                </h3>
                <p className="text-sm text-[#777873] leading-relaxed">
                  Prefer direct correspondence or scheduling a video conference? Reach us through our official studio channels.
                </p>
              </div>

              {/* Contact Links */}
              <div className="space-y-4">
                <a
                  href={`mailto:${STUDIO_META.contactEmail}`}
                  className="flex items-center gap-3 p-4 bg-white border border-[#E5E2DC] hover:border-[#17191D] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E5E2DC]/50 flex items-center justify-center text-[#17191D] group-hover:bg-[#17191D] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-[#777873]">Email Enquiries</div>
                    <div className="text-sm font-semibold text-[#17191D]">{STUDIO_META.contactEmail}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${STUDIO_META.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-white border border-[#E5E2DC] hover:border-[#17191D] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#91A99B]/20 flex items-center justify-center text-[#2E4639] group-hover:bg-[#91A99B] group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase text-[#777873]">WhatsApp Direct Desk</div>
                    <div className="text-sm font-semibold text-[#17191D]">+91 98765 43210 (Studio Lead)</div>
                  </div>
                </a>
              </div>

              {/* Firebase Cloud Portal Status Card */}
              <div className="p-5 bg-white border border-[#E5E2DC] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#17191D]">
                    <Cloud className="w-3.5 h-3.5 text-[#91A99B]" />
                    <span>Firebase Cloud Sync</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#91A99B]/20 text-[#2E4639] font-semibold">
                    {user ? 'Authenticated' : 'Ready'}
                  </span>
                </div>
                <p className="text-xs text-[#777873] leading-relaxed">
                  {user
                    ? `Signed in as ${user.email}. Submitted briefs sync directly to Firestore with owner-isolated access.`
                    : 'Sign in with Google to persist your project briefs in real time to our Firestore Client Portal.'}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {!user && (
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#17191D] text-white text-[11px] font-mono uppercase tracking-wider hover:bg-[#252830] transition-colors"
                    >
                      <LogIn className="w-3 h-3 text-[#91A99B]" />
                      <span>Google Sign-In</span>
                    </button>
                  )}
                  {onOpenPortal && (
                    <button
                      type="button"
                      onClick={onOpenPortal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F6F2] border border-[#E5E2DC] hover:border-[#17191D] text-[#17191D] text-[11px] font-mono uppercase tracking-wider transition-colors"
                    >
                      <span>Portal ({enquiries.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Geographic Footprint */}
              <div className="p-5 bg-[#EFECE6]/70 border border-[#E5E2DC] rounded space-y-2">
                <div className="text-xs font-mono uppercase font-bold text-[#17191D]">
                  International Reach
                </div>
                <p className="text-xs text-[#777873] leading-relaxed">
                  AVENIQ works with hospital groups, clinic directors, and businesses across India, the United States, United Kingdom, Australia, Canada, and European markets.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#2E4639] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NDA &amp; IP Protection Guaranteed
                </div>
              </div>
            </div>

            {/* Technical Integration Documentation Note */}
            <div className="pt-6 border-t border-[#E5E2DC]">
              <button
                type="button"
                onClick={() => setShowIntegrationDetails(!showIntegrationDetails)}
                className="text-xs font-mono text-[#777873] hover:text-[#17191D] flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Firebase Firestore &amp; Zero-Trust Rules Architecture</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showIntegrationDetails ? 'rotate-180' : ''}`} />
              </button>

              {showIntegrationDetails && (
                <div className="mt-3 p-3 bg-white border border-[#E5E2DC] rounded text-[11px] font-mono text-[#777873] space-y-1.5">
                  <div className="text-[#17191D] font-bold">Live Cloud Architecture (`directed-correlate-vdckx`):</div>
                  <p>
                    Connected to Firebase Firestore (`/enquiries` &amp; `/opdAppointments`) with strict ABAC security rules, server timestamps, and Google OAuth authentication.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Clean Accessible Enquiry Form */}
          <div className="lg:col-span-8 bg-white border border-[#E5E2DC] p-8 sm:p-10 shadow-sm relative">
            {submittedData ? (
              /* Success State */
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#91A99B]/20 text-[#2E4639] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#2E4639]" />
                </div>

                <div className="max-w-lg mx-auto space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFECE6] border border-[#E5E2DC] text-[10px] font-mono uppercase text-[#2E4639]">
                    <Cloud className="w-3 h-3" />
                    <span>
                      {submittedData.syncedToCloud
                        ? `Persisted to Firestore (${submittedData.id})`
                        : `Saved to Client Portal (${submittedData.id})`}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#17191D]">
                    Project Enquiry Prepared
                  </h3>
                  <p className="text-sm text-[#777873] leading-relaxed">
                    Thank you, <strong className="text-[#17191D]">{submittedData.fullName}</strong>. Your enquiry for <strong className="text-[#17191D]">{submittedData.businessName}</strong> ({submittedData.interestedService}) has been verified and logged.
                  </p>
                </div>

                {/* Direct Action Options */}
                <div className="max-w-md mx-auto pt-4 space-y-3">
                  <a
                    href={generateWhatsAppEnquiryUrl(submittedData, STUDIO_META.whatsappNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#17191D] text-white hover:bg-[#252830] py-3.5 px-6 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#91A99B]" />
                    <span>Send via WhatsApp to Studio Lead</span>
                  </a>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPayload}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F7F6F2] hover:bg-[#E5E2DC] text-[#17191D] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border border-[#E5E2DC] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedReceipt ? 'Copied to Clipboard!' : 'Copy Brief JSON'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadPayload}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#F7F6F2] hover:bg-[#E5E2DC] text-[#17191D] py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border border-[#E5E2DC] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Brief</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5E2DC] text-xs text-[#777873]">
                  <span>Want to submit another inquiry? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setFormData({
                        fullName: '',
                        businessName: '',
                        email: '',
                        phone: '',
                        country: '',
                        interestedService: 'Hospital Website',
                        budgetRange: '$10,000 - $25,000 (₹8L - ₹20L)',
                        timeline: '1-3 months',
                        projectDescription: '',
                      });
                    }}
                    className="text-[#17191D] font-bold underline hover:text-[#91A99B]"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Honeypot field for spam prevention */}
                <input
                  type="text"
                  name="website_security_field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="field-fullName"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Dr. Rajesh Verma or Julian Vance"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.fullName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                    />
                    {errors.fullName && (
                      <p id="error-fullName" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Business Name */}
                  <div>
                    <label
                      htmlFor="field-businessName"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Business / Hospital Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-businessName"
                      name="businessName"
                      type="text"
                      placeholder="e.g. Zenith Super Speciality Hospital"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.businessName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                      aria-invalid={!!errors.businessName}
                      aria-describedby={errors.businessName ? 'error-businessName' : undefined}
                    />
                    {errors.businessName && (
                      <p id="error-businessName" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.businessName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="field-email"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Work / Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-email"
                      name="email"
                      type="email"
                      placeholder="name@organisation.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'error-email' : undefined}
                    />
                    {errors.email && (
                      <p id="error-email" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="field-phone"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Phone Number (with country code) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98200 12345 or +1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.phone
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'error-phone' : undefined}
                    />
                    {errors.phone && (
                      <p id="error-phone" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Country */}
                  <div>
                    <label
                      htmlFor="field-country"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-country"
                      name="country"
                      type="text"
                      placeholder="e.g. India, United States, United Kingdom..."
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.country
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                      aria-invalid={!!errors.country}
                      aria-describedby={errors.country ? 'error-country' : undefined}
                    />
                    {errors.country && (
                      <p id="error-country" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.country}
                      </p>
                    )}
                  </div>

                  {/* Interested Service */}
                  <div>
                    <label
                      htmlFor="field-interestedService"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Interested Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="field-interestedService"
                      name="interestedService"
                      value={formData.interestedService}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors ${
                        errors.interestedService
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E2DC] focus:border-[#17191D]'
                      }`}
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget Range & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="field-budgetRange"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Estimated Budget Tier
                    </label>
                    <select
                      id="field-budgetRange"
                      name="budgetRange"
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E5E2DC] text-sm text-[#17191D] focus:border-[#17191D] focus:outline-none"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="field-timeline"
                      className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                    >
                      Desired Timeline
                    </label>
                    <input
                      id="field-timeline"
                      name="timeline"
                      type="text"
                      placeholder="e.g. 1-2 months, Q3 Launch, Immediate"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E5E2DC] text-sm text-[#17191D] focus:border-[#17191D] focus:outline-none"
                    >
                    </input>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label
                    htmlFor="field-projectDescription"
                    className="block text-xs font-mono uppercase tracking-wider text-[#17191D] font-semibold mb-2"
                  >
                    Project Description &amp; Objectives <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="field-projectDescription"
                    name="projectDescription"
                    rows={4}
                    placeholder="Describe your current business challenge, target launch date, primary features required (e.g. doctor directory, online booking, booking engine)..."
                    value={formData.projectDescription}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#F7F6F2] border text-sm text-[#17191D] focus:outline-none transition-colors resize-y ${
                      errors.projectDescription
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-[#E5E2DC] focus:border-[#17191D]'
                    }`}
                    aria-invalid={!!errors.projectDescription}
                    aria-describedby={errors.projectDescription ? 'error-projectDescription' : undefined}
                  />
                  {errors.projectDescription && (
                    <p id="error-projectDescription" className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.projectDescription}
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#777873]">
                    Fields marked with <span className="text-red-500">*</span> are required.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#17191D] text-[#F7F6F2] hover:bg-[#252830] active:scale-[0.98] disabled:opacity-70 px-8 py-4 text-xs font-bold tracking-widest uppercase transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validating Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Project Enquiry</span>
                        <Send className="w-3.5 h-3.5 text-[#91A99B]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
