import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEnquiryForm,
  generateWhatsAppEnquiryUrl,
  sanitizeEnquiryPayload,
  sanitizeOpdPayload,
  generateSafeDocId,
  VALID_ID_REGEX,
  ENQUIRY_BOUNDS,
} from './enquiryValidation';
import { EnquiryFormData } from '../types';

test('validateEnquiryForm returns errors for empty object', () => {
  const result = validateEnquiryForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.businessName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.country);
  assert.ok(result.errors.interestedService);
  assert.ok(result.errors.projectDescription);
});

test('validateEnquiryForm rejects invalid email formats', () => {
  const result = validateEnquiryForm({
    fullName: 'Dr. Jane Smith',
    businessName: 'Apex Medical Centre',
    email: 'notanemail',
    phone: '+1 555 123 4567',
    country: 'United States',
    interestedService: 'Hospital Website',
    projectDescription: 'We need a complete portal overhaul for 50+ doctors.',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.email?.includes('valid email'));
});

test('validateEnquiryForm accepts valid complete data', () => {
  const validData: EnquiryFormData = {
    fullName: 'Julian Vance',
    businessName: 'Vance & Co Architects',
    email: 'julian@vancearch.co.uk',
    phone: '+44 20 7946 0991',
    country: 'United Kingdom',
    interestedService: 'Business Website',
    budgetRange: '$15k - $30k',
    timeline: '2-3 months',
    projectDescription: 'Full brand strategy and architectural portfolio website with custom CMS.',
  };

  const result = validateEnquiryForm(validData);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('sanitizeEnquiryPayload and sanitizeOpdPayload enforce firebase-blueprint.json bounds', () => {
  const raw: EnquiryFormData = {
    fullName: '  Dr. Arvind Mehta  ',
    businessName: '  Aura Hospital  ',
    email: '  arvind@aurahospital.org  ',
    phone: '+91 98200 12345',
    country: 'India',
    interestedService: 'Hospital Website',
    budgetRange: '',
    timeline: '',
    projectDescription: 'A'.repeat(2500),
  };

  const sanitized = sanitizeEnquiryPayload(raw);
  assert.equal(sanitized.fullName, 'Dr. Arvind Mehta');
  assert.equal(sanitized.projectDescription.length, ENQUIRY_BOUNDS.projectDescription.maxLength);
  assert.ok(sanitized.budgetRange.length >= 1);
  assert.ok(sanitized.timeline.length >= 1);

  const opd = sanitizeOpdPayload({
    patientName: '  Ramesh Kumar  ',
    department: 'Cardiology',
    leadDoctor: 'Dr. Arvind Mehta, MS, MCh',
    preferredSlot: '10:30 AM',
  });
  assert.equal(opd.patientName, 'Ramesh Kumar');

  const docId = generateSafeDocId('enq');
  assert.ok(VALID_ID_REGEX.test(docId));
});

test('generateWhatsAppEnquiryUrl generates valid encoded url with details', () => {
  const data: EnquiryFormData = {
    fullName: 'Maya Sharma',
    businessName: 'Horizon MultiSpeciality Hospital',
    email: 'contact@horizonhospital.org',
    phone: '+91 98200 12345',
    country: 'India',
    interestedService: 'Hospital Website',
    budgetRange: '$25k+',
    timeline: 'Immediate (1-2 months)',
    projectDescription: 'Redesign of 250-bed hospital web portal with doctor profiles and appointment workflows.',
  };

  const url = generateWhatsAppEnquiryUrl(data, '919876543210');
  assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919876543210&text='));
  assert.ok(url.includes(encodeURIComponent('Horizon MultiSpeciality Hospital')));
  assert.ok(url.includes(encodeURIComponent('Hospital Website')));
});
