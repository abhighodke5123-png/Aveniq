import { EnquiryFormData, ValidationResult } from '../types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export function validateEnquiryForm(data: Partial<EnquiryFormData>): ValidationResult {
  const errors: Partial<Record<keyof EnquiryFormData, string>> = {};

  // Full Name
  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.fullName = 'Please enter your full name.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  // Business Name
  if (!data.businessName || data.businessName.trim().length === 0) {
    errors.businessName = 'Please enter your business or organisation name.';
  }

  // Email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Please provide your business email.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
  }

  // Phone
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Please provide a contact phone number.';
  } else {
    const cleanedPhone = data.phone.trim().replace(/[\s()-]/g, '');
    if (cleanedPhone.length < 7 || cleanedPhone.length > 16) {
      errors.phone = 'Please enter a valid telephone number with country code.';
    }
  }

  // Country
  if (!data.country || data.country.trim().length === 0) {
    errors.country = 'Please specify your country or territory.';
  }

  // Interested Service
  if (!data.interestedService) {
    errors.interestedService = 'Please select the primary service of interest.';
  }

  // Project Description
  if (!data.projectDescription || data.projectDescription.trim().length === 0) {
    errors.projectDescription = 'Please describe your project, timeline, and core goals.';
  } else if (data.projectDescription.trim().length < 15) {
    errors.projectDescription = 'Please provide a brief description (at least 15 characters) so we can prepare accurately.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateWhatsAppEnquiryUrl(data: EnquiryFormData, studioWhatsAppNumber = '919876543210'): string {
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
