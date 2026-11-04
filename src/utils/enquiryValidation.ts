import {
  EnquiryFormData,
  ValidationResult,
  OpdAppointmentInput,
  ServiceCategory,
  OpdDepartment,
  OpdSlot,
} from '../types';

/**
 * Verbatim volumetric boundaries and regex patterns synchronized with
 * `firebase-blueprint.json` and `firestore.rules`.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
export const VALID_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

export const ENQUIRY_BOUNDS = {
  ownerId: { minLength: 1, maxLength: 128 },
  fullName: { minLength: 2, maxLength: 120 },
  businessName: { minLength: 1, maxLength: 160 },
  email: { minLength: 3, maxLength: 254 },
  phone: { minLength: 7, maxLength: 32 },
  country: { minLength: 1, maxLength: 100 },
  interestedService: { minLength: 1, maxLength: 60 },
  budgetRange: { minLength: 1, maxLength: 80 },
  timeline: { minLength: 1, maxLength: 80 },
  projectDescription: { minLength: 15, maxLength: 2000 },
  status: { minLength: 1, maxLength: 32 },
} as const;

export const OPD_BOUNDS = {
  ownerId: { minLength: 1, maxLength: 128 },
  patientName: { minLength: 2, maxLength: 120 },
  department: { minLength: 1, maxLength: 40 },
  leadDoctor: { minLength: 2, maxLength: 120 },
  preferredSlot: { minLength: 1, maxLength: 32 },
  status: { minLength: 1, maxLength: 32 },
} as const;

export const ALLOWED_SERVICES: ServiceCategory[] = [
  'Hospital Website',
  'Clinic Website',
  'Business Website',
  'E-commerce Website',
  'Website Redesign',
  'SEO & Digital Growth',
  'AI & Automation',
  'Other',
];

export const ALLOWED_OPD_DEPARTMENTS: OpdDepartment[] = [
  'Cardiology',
  'Oncology',
  'Orthopedics',
  'Neurology',
];

export const ALLOWED_OPD_SLOTS: OpdSlot[] = [
  '10:30 AM',
  '12:00 PM',
  '03:30 PM',
  '05:00 PM',
];

export function validateEnquiryForm(data: Partial<EnquiryFormData>): ValidationResult {
  const errors: Partial<Record<keyof EnquiryFormData, string>> = {};

  // Full Name
  const fullName = data.fullName?.trim() || '';
  if (fullName.length === 0) {
    errors.fullName = 'Please enter your full name.';
  } else if (fullName.length < ENQUIRY_BOUNDS.fullName.minLength) {
    errors.fullName = `Full name must be at least ${ENQUIRY_BOUNDS.fullName.minLength} characters.`;
  } else if (fullName.length > ENQUIRY_BOUNDS.fullName.maxLength) {
    errors.fullName = `Full name cannot exceed ${ENQUIRY_BOUNDS.fullName.maxLength} characters.`;
  }

  // Business Name
  const businessName = data.businessName?.trim() || '';
  if (businessName.length === 0) {
    errors.businessName = 'Please enter your business or organisation name.';
  } else if (businessName.length > ENQUIRY_BOUNDS.businessName.maxLength) {
    errors.businessName = `Business name cannot exceed ${ENQUIRY_BOUNDS.businessName.maxLength} characters.`;
  }

  // Email
  const email = data.email?.trim() || '';
  if (email.length === 0) {
    errors.email = 'Please provide your business email.';
  } else if (
    email.length < ENQUIRY_BOUNDS.email.minLength ||
    email.length > ENQUIRY_BOUNDS.email.maxLength ||
    !EMAIL_REGEX.test(email)
  ) {
    errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
  }

  // Phone
  const phone = data.phone?.trim() || '';
  if (phone.length === 0) {
    errors.phone = 'Please provide a contact phone number.';
  } else {
    const cleanedPhone = phone.replace(/[\s()-]/g, '');
    if (
      cleanedPhone.length < ENQUIRY_BOUNDS.phone.minLength ||
      cleanedPhone.length > 16 ||
      phone.length > ENQUIRY_BOUNDS.phone.maxLength
    ) {
      errors.phone = 'Please enter a valid telephone number with country code.';
    }
  }

  // Country
  const country = data.country?.trim() || '';
  if (country.length === 0) {
    errors.country = 'Please specify your country or territory.';
  } else if (country.length > ENQUIRY_BOUNDS.country.maxLength) {
    errors.country = `Country name cannot exceed ${ENQUIRY_BOUNDS.country.maxLength} characters.`;
  }

  // Interested Service
  if (!data.interestedService || !ALLOWED_SERVICES.includes(data.interestedService)) {
    errors.interestedService = 'Please select the primary service of interest.';
  }

  // Project Description
  const projectDescription = data.projectDescription?.trim() || '';
  if (projectDescription.length === 0) {
    errors.projectDescription = 'Please describe your project, timeline, and core goals.';
  } else if (projectDescription.length < ENQUIRY_BOUNDS.projectDescription.minLength) {
    errors.projectDescription = `Please provide a brief description (at least ${ENQUIRY_BOUNDS.projectDescription.minLength} characters) so we can prepare accurately.`;
  } else if (projectDescription.length > ENQUIRY_BOUNDS.projectDescription.maxLength) {
    errors.projectDescription = `Project description cannot exceed ${ENQUIRY_BOUNDS.projectDescription.maxLength} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Defensive payload sanitizer that guarantees outgoing Firestore Enquiry mutations
 * adhere strictly to `firebase-blueprint.json` volumetric and enum constraints.
 */
export function sanitizeEnquiryPayload(data: EnquiryFormData) {
  const interestedService: ServiceCategory = ALLOWED_SERVICES.includes(data.interestedService)
    ? data.interestedService
    : 'Hospital Website';

  const budgetRange = (data.budgetRange?.trim() || '$10,000 - $25,000 (₹8L - ₹20L)').slice(
    0,
    ENQUIRY_BOUNDS.budgetRange.maxLength
  );
  const timeline = (data.timeline?.trim() || '1-3 months').slice(
    0,
    ENQUIRY_BOUNDS.timeline.maxLength
  );

  return {
    fullName: data.fullName.trim().slice(0, ENQUIRY_BOUNDS.fullName.maxLength),
    businessName: data.businessName.trim().slice(0, ENQUIRY_BOUNDS.businessName.maxLength),
    email: data.email.trim().slice(0, ENQUIRY_BOUNDS.email.maxLength),
    phone: data.phone.trim().slice(0, ENQUIRY_BOUNDS.phone.maxLength),
    country: data.country.trim().slice(0, ENQUIRY_BOUNDS.country.maxLength),
    interestedService,
    budgetRange,
    timeline,
    projectDescription: data.projectDescription
      .trim()
      .slice(0, ENQUIRY_BOUNDS.projectDescription.maxLength),
  };
}

export function sanitizeOpdPayload(input: OpdAppointmentInput): OpdAppointmentInput {
  const department: OpdDepartment = ALLOWED_OPD_DEPARTMENTS.includes(input.department)
    ? input.department
    : 'Cardiology';
  const preferredSlot: OpdSlot = ALLOWED_OPD_SLOTS.includes(input.preferredSlot)
    ? input.preferredSlot
    : '10:30 AM';

  return {
    patientName: input.patientName.trim().slice(0, OPD_BOUNDS.patientName.maxLength),
    department,
    leadDoctor: input.leadDoctor.trim().slice(0, OPD_BOUNDS.leadDoctor.maxLength),
    preferredSlot,
  };
}

export function generateSafeDocId(prefix: string): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const raw = `${prefix}_${Date.now()}_${randomPart}`.replace(/[^a-zA-Z0-9_\-]/g, '');
  return raw.slice(0, 64);
}

export function generateWhatsAppEnquiryUrl(
  data: EnquiryFormData,
  studioWhatsAppNumber = '919876543210'
): string {
  const text = [
    `*AVENIQ Project Enquiry*`,
    `-------------------------`,
    `*Name:* ${data.fullName}`,
    `*Organisation:* ${data.businessName}`,
    `*Country:* ${data.country}`,
    `*Service:* ${data.interestedService}`,
    data.budgetRange ? `*Budget:* ${data.budgetRange}` : '',
    data.timeline ? `*Target Timeline:* ${data.timeline}` : '',
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone}`,
    ``,
    `*Project Brief:*`,
    `${data.projectDescription}`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://api.whatsapp.com/send?phone=${studioWhatsAppNumber}&text=${encodeURIComponent(text)}`;
}

export function formatCountryDisplayName(codeOrName: string): string {
  if (!codeOrName) return '';
  return codeOrName.trim();
}
